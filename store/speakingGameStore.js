import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
	getFirestore,
	collection,
	query,
	where,
	addDoc,
	onSnapshot,
	getDocs,
	doc,
	serverTimestamp,
	updateDoc,
	orderBy,
	limit,
	runTransaction,
	deleteDoc,
	Timestamp
} from 'firebase/firestore'
import { userAuthStore } from './authStore.js'

export const useSpeakingGameStore = defineStore('speakingGameStore', () => {
	const db = getFirestore()
	const authStore = userAuthStore()

	// State
	const isSearching = ref(false)
	const gameId = ref(null)
	const sessionData = ref(null)
	const error = ref(null)
	const questionBank = ref(null)
	let unsubscribeFromSession = null

	// Computed
	const isHost = computed(() => {
		return sessionData.value?.hostId === authStore.uid
	})

	const isGuest = computed(() => {
		return sessionData.value?.guestId === authStore.uid
	})

	const currentRound = computed(() => {
		if (!sessionData.value) return null
		const index = sessionData.value.currentRoundIndex
		return sessionData.value.rounds?.[index] || null
	})

	const myRecordings = computed(() => {
		if (!sessionData.value || !authStore.uid) return []
		return sessionData.value.players?.[authStore.uid]?.recordings || []
	})

	const opponentRecordings = computed(() => {
		if (!sessionData.value || !authStore.uid) return []
		const opponentId = isHost.value ? sessionData.value.guestId : sessionData.value.hostId
		if (!opponentId) return []
		return sessionData.value.players?.[opponentId]?.recordings || []
	})

	const opponentData = computed(() => {
		if (!sessionData.value || !authStore.uid) return null
		const opponentId = isHost.value ? sessionData.value.guestId : sessionData.value.hostId
		if (!opponentId) return null
		return sessionData.value.players?.[opponentId] || null
	})

	// Load questions from JSON file
	async function loadQuestions(topic) {
		try {
			const response = await fetch(`/speaking-questions/${topic}.json`)
			if (!response.ok) {
				throw new Error('Failed to load questions')
			}
			questionBank.value = await response.json()
			return true
		} catch (err) {
			console.error('Error loading questions:', err)
			error.value = 'Failed to load questions'
			return false
		}
	}

	// Select random questions for a level
	function selectRandomQuestions(level, count = 3) {
		if (!questionBank.value) {
			console.error('Question bank not loaded')
			return []
		}

		const questions = questionBank.value.levels[level] || []
		if (questions.length < count) {
			console.warn(`Not enough questions for level ${level}`)
			return questions
		}

		// Shuffle and select
		const shuffled = [...questions].sort(() => Math.random() - 0.5)
		return shuffled.slice(0, count)
	}

	// Create a new game session (host)
	async function createGameSession(level, topic, hostId) {
		const selectedQuestions = selectRandomQuestions(level, 3)
		if (selectedQuestions.length < 3) {
			error.value = 'Not enough questions available'
			return null
		}

		const expireAt = Timestamp.fromMillis(Date.now() + 15 * 60 * 1000) // 15 minutes
		const sessionsRef = collection(db, 'speakingGameSessions')

		const newSession = {
			hostId: hostId,
			guestId: null,
			status: 'waiting',
			createdAt: serverTimestamp(),
			expireAt: expireAt,
			level: level,
			topic: topic,
			totalRounds: 3,
			currentRoundIndex: 0,
			roundDuration: 60, // seconds
			players: {
				[hostId]: {
					name: authStore.name || 'Player',
					avatar: authStore.avatarUrl || '',
					recordings: []
				}
			},
			rounds: selectedQuestions.map((q, index) => ({
				roundIndex: index,
				questionId: q.id,
				question: q.question,
				startTime: null,
				completed: false
			}))
		}

		try {
			const newSessionRef = await addDoc(sessionsRef, newSession)
			return newSessionRef.id
		} catch (err) {
			console.error('Error creating session:', err)
			error.value = 'Failed to create game session'
			return null
		}
	}

	// Find a game or create one (matchmaking)
	async function findGame(level, topic) {
		if (isSearching.value) return
		const myUserId = authStore.uid
		if (!myUserId) {
			error.value = 'User not authenticated'
			return
		}

		// Load questions if not loaded
		if (!questionBank.value || questionBank.value.topic !== topic) {
			const loaded = await loadQuestions(topic)
			if (!loaded) return
		}

		isSearching.value = true
		error.value = null

		// Query for waiting sessions
		const q = query(
			collection(db, 'speakingGameSessions'),
			where('guestId', '==', null),
			where('status', '==', 'waiting'),
			where('level', '==', level),
			where('topic', '==', topic),
			orderBy('createdAt'),
			limit(1)
		)

		try {
			const snapshot = await getDocs(q)

			if (!snapshot.empty) {
				// Join existing session
				const sessionToJoin = snapshot.docs[0]
				const sessionRef = doc(db, 'speakingGameSessions', sessionToJoin.id)

				try {
					await runTransaction(db, async (t) => {
						const docSnap = await t.get(sessionRef)
						if (!docSnap.exists() || docSnap.data().guestId) {
							throw 'Session already taken'
						}
						t.update(sessionRef, {
							guestId: myUserId,
							status: 'starting',
							[`players.${myUserId}`]: {
								name: authStore.name || 'Player',
								avatar: authStore.avatarUrl || '',
								recordings: []
							}
						})
					})
					listenToSession(sessionToJoin.id)
				} catch (e) {
					console.error('Failed to join session:', e)
					error.value = 'Failed to join session'
					// Retry finding another session
					setTimeout(() => findGame(level, topic), 100)
				}
			} else {
				// Create new session as host
				const newGameId = await createGameSession(level, topic, myUserId)
				if (newGameId) {
					listenToSession(newGameId)
				}
			}
		} catch (err) {
			console.error('Error finding game:', err)
			error.value = 'Error finding game'
		} finally {
			isSearching.value = false
		}
	}

	// Listen to session updates
	function listenToSession(sessionId) {
		gameId.value = sessionId
		const sessionRef = doc(db, 'speakingGameSessions', sessionId)

		if (unsubscribeFromSession) unsubscribeFromSession()

		unsubscribeFromSession = onSnapshot(sessionRef, (docSnap) => {
			const prevStatus = sessionData.value?.status

			if (!docSnap.exists()) {
				// Session deleted (opponent left or host cleaned up)
				sessionData.value = null
				gameId.value = null
				if (unsubscribeFromSession) {
					unsubscribeFromSession()
					unsubscribeFromSession = null
				}
				return
			}

			const data = { id: docSnap.id, ...docSnap.data() }
			sessionData.value = data

			const newStatus = data.status

			// Handle status transitions
			if (newStatus === 'finished' && prevStatus !== 'finished') {
				// Game finished - host will clean up after delay
				if (data.hostId === authStore.uid) {
					console.log(`Host cleaning up session ${data.id} in 10 seconds...`)
					setTimeout(async () => {
						try {
							await deleteDoc(doc(db, 'speakingGameSessions', data.id))
							console.log(`Session ${data.id} deleted successfully`)
						} catch (e) {
							console.log('Failed to delete session (may already be deleted)')
						}
					}, 10000) // 10 seconds
				}
			}
		})
	}

	// Submit a recording for current round
	async function submitRecording(transcription, duration) {
		if (!gameId.value || !sessionData.value) {
			console.error('No active game session')
			return false
		}

		const myUserId = authStore.uid
		const currentRoundIndex = sessionData.value.currentRoundIndex
		const sessionRef = doc(db, 'speakingGameSessions', gameId.value)

		const recording = {
			roundIndex: currentRoundIndex,
			transcription: transcription,
			timestamp: serverTimestamp(),
			duration: duration
		}

		try {
			await updateDoc(sessionRef, {
				[`players.${myUserId}.recordings`]: [...myRecordings.value, recording]
			})
			return true
		} catch (err) {
			console.error('Error submitting recording:', err)
			error.value = 'Failed to submit recording'
			return false
		}
	}

	// Start the game (both players ready)
	async function startGame() {
		if (!gameId.value || !isHost.value) {
			console.error('Only host can start game')
			return false
		}

		const sessionRef = doc(db, 'speakingGameSessions', gameId.value)

		try {
			await updateDoc(sessionRef, {
				status: 'in_progress',
				'rounds.0.startTime': serverTimestamp()
			})
			return true
		} catch (err) {
			console.error('Error starting game:', err)
			error.value = 'Failed to start game'
			return false
		}
	}

	// Advance to next round (host only)
	async function advanceRound() {
		if (!gameId.value || !isHost.value || !sessionData.value) {
			console.error('Only host can advance rounds')
			return false
		}

		const currentIndex = sessionData.value.currentRoundIndex
		const totalRounds = sessionData.value.totalRounds
		const sessionRef = doc(db, 'speakingGameSessions', gameId.value)

		try {
			// Mark current round as completed
			await updateDoc(sessionRef, {
				[`rounds.${currentIndex}.completed`]: true
			})

			if (currentIndex + 1 >= totalRounds) {
				// Game finished
				await updateDoc(sessionRef, {
					status: 'finished'
				})
			} else {
				// Move to next round
				await updateDoc(sessionRef, {
					currentRoundIndex: currentIndex + 1,
					[`rounds.${currentIndex + 1}.startTime`]: serverTimestamp()
				})
			}
			return true
		} catch (err) {
			console.error('Error advancing round:', err)
			error.value = 'Failed to advance round'
			return false
		}
	}

	// Check if both players submitted for current round
	function bothPlayersSubmitted() {
		if (!sessionData.value) return false

		const currentIndex = sessionData.value.currentRoundIndex
		const hostId = sessionData.value.hostId
		const guestId = sessionData.value.guestId

		if (!guestId) return false

		const hostRecordings = sessionData.value.players?.[hostId]?.recordings || []
		const guestRecordings = sessionData.value.players?.[guestId]?.recordings || []

		const hostSubmitted = hostRecordings.some(r => r.roundIndex === currentIndex)
		const guestSubmitted = guestRecordings.some(r => r.roundIndex === currentIndex)

		return hostSubmitted && guestSubmitted
	}

	// Cancel matchmaking search
	async function cancelSearch() {
		if (gameId.value && sessionData.value?.status === 'waiting') {
			const sessionRef = doc(db, 'speakingGameSessions', gameId.value)
			try {
				await deleteDoc(sessionRef)
			} catch (e) {
				console.error('Error deleting session:', e)
			}
		}
		leaveSession()
	}

	// Leave current session
	async function leaveSession() {
		if (unsubscribeFromSession) {
			unsubscribeFromSession()
			unsubscribeFromSession = null
		}

		if (gameId.value) {
			// If host leaves, delete the session
			if (sessionData.value && sessionData.value.hostId === authStore.uid) {
				try {
					const sessionRef = doc(db, 'speakingGameSessions', gameId.value)
					await deleteDoc(sessionRef)
				} catch (e) {
					console.error('Error deleting session on leave:', e)
				}
			}
		}

		gameId.value = null
		sessionData.value = null
		isSearching.value = false
		error.value = null
	}

	// Reset store
	function resetStore() {
		leaveSession()
		questionBank.value = null
	}

	return {
		// State
		isSearching,
		gameId,
		sessionData,
		error,
		questionBank,

		// Computed
		isHost,
		isGuest,
		currentRound,
		myRecordings,
		opponentRecordings,
		opponentData,

		// Actions
		loadQuestions,
		selectRandomQuestions,
		findGame,
		listenToSession,
		submitRecording,
		startGame,
		advanceRound,
		bothPlayersSubmitted,
		cancelSearch,
		leaveSession,
		resetStore
	}
})
