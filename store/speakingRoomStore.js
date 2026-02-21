import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
	getFirestore,
	collection,
	query,
	where,
	orderBy,
	limit,
	getDocs,
	onSnapshot,
	doc,
	startAfter
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { userAuthStore } from './authStore.js'

export const useSpeakingRoomStore = defineStore('speakingRoomStore', () => {
	const db = getFirestore()
	const authStore = userAuthStore()

	// --- Listing state ---
	const rooms = ref([])
	const isLoadingRooms = ref(false)
	const roomFilters = ref({ cefrLevel: null, visibility: 'public' })
	const lastRoomDoc = ref(null)
	const hasMoreRooms = ref(true)

	// --- Active room state ---
	const currentRoom = ref(null)
	const currentRoomId = ref(null)
	const isHost = computed(() => currentRoom.value?.hostId === authStore.uid)
	const participants = computed(() => currentRoom.value?.participants || {})

	// --- Questions state ---
	const pendingQuestionIndex = ref(null)
	const isAdvancingQuestion = ref(false)
	const currentQuestionIndex = computed(() =>
		pendingQuestionIndex.value !== null
			? pendingQuestionIndex.value
			: (currentRoom.value?.currentQuestionIndex ?? 0)
	)
	const questions = computed(() => currentRoom.value?.questions || [])
	const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || null)

	// --- Daily.co state ---
	const localAudioEnabled = ref(true)
	const callState = ref('idle') // idle | joining | joined | left | error
	const dailyParticipants = ref({})

	// --- Listeners ---
	let unsubscribeRoom = null
	let pendingClearTimer = null

	async function getAuthToken() {
		const user = getAuth().currentUser
		if (!user) throw new Error('Not authenticated')
		return user.getIdToken()
	}

	// --- Room listing ---
	async function fetchRooms(reset = false) {
		if (isLoadingRooms.value) return
		isLoadingRooms.value = true

		if (reset) {
			rooms.value = []
			lastRoomDoc.value = null
			hasMoreRooms.value = true
		}

		try {
			const constraints = [
				where('status', 'in', ['waiting', 'active']),
				where('visibility', '==', roomFilters.value.visibility || 'public')
			]

			if (roomFilters.value.cefrLevel) {
				constraints.push(where('cefrLevel', '==', roomFilters.value.cefrLevel))
			}

			constraints.push(orderBy('createdAt', 'desc'))
			constraints.push(limit(20))

			if (lastRoomDoc.value) {
				constraints.push(startAfter(lastRoomDoc.value))
			}

			const q = query(collection(db, 'speakingRooms'), ...constraints)
			const snapshot = await getDocs(q)

			const newRooms = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
			rooms.value = reset ? newRooms : [...rooms.value, ...newRooms]

			if (snapshot.docs.length > 0) {
				lastRoomDoc.value = snapshot.docs[snapshot.docs.length - 1]
			}
			hasMoreRooms.value = snapshot.docs.length === 20
		} catch (err) {
			console.error('Failed to fetch rooms:', err)
		} finally {
			isLoadingRooms.value = false
		}
	}

	// --- Real-time listener for active room ---
	function listenToRoom(roomId) {
		stopListening()
		currentRoomId.value = roomId
		const roomRef = doc(db, 'speakingRooms', roomId)

		unsubscribeRoom = onSnapshot(roomRef, (docSnap) => {
			if (!docSnap.exists()) {
				currentRoom.value = null
				currentRoomId.value = null
				callState.value = 'left'
				return
			}
			currentRoom.value = { id: docSnap.id, ...docSnap.data() }
		})
	}

	function stopListening() {
		if (pendingClearTimer) {
			clearTimeout(pendingClearTimer)
			pendingClearTimer = null
		}
		if (unsubscribeRoom) {
			unsubscribeRoom()
			unsubscribeRoom = null
		}
	}

	// --- Room actions ---
	async function createRoom({ topic, cefrLevel, visibility, maxParticipants }) {
		const token = await getAuthToken()
		const res = await $fetch('/api/speaking-rooms/create-room', {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },
			body: { topic, cefrLevel, visibility, maxParticipants }
		})
		return res
	}

	async function joinRoom(roomId) {
		const token = await getAuthToken()
		callState.value = 'joining'
		try {
			const res = await $fetch('/api/speaking-rooms/join-room', {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
				body: { roomId }
			})

			listenToRoom(roomId)

			const { useDaily } = await import('~/composables/useDaily.js')
			const daily = useDaily()
			const callObj = await daily.createCallObject()

			wireUpDailyEvents(callObj)

			await daily.join(res.dailyRoomUrl, res.token)
			callState.value = 'joined'

			return res
		} catch (err) {
			callState.value = 'error'
			throw err
		}
	}

	function wireUpDailyEvents(callObj) {
		callObj.on('participant-joined', (evt) => {
			dailyParticipants.value = { ...callObj.participants() }
		})
		callObj.on('participant-updated', (evt) => {
			dailyParticipants.value = { ...callObj.participants() }
		})
		callObj.on('participant-left', (evt) => {
			dailyParticipants.value = { ...callObj.participants() }
		})
		callObj.on('app-message', (evt) => {
			if (evt?.data?.type === 'question-change') {
				// Fast-path sync — Firestore listener will also update
			}
		})
		callObj.on('error', (evt) => {
			console.error('Daily error:', evt)
			callState.value = 'error'
		})
		callObj.on('left-meeting', () => {
			callState.value = 'left'
		})
	}

	async function leaveRoom() {
		try {
			const { useDaily } = await import('~/composables/useDaily.js')
			const daily = useDaily()
			await daily.leave()
		} catch (e) {
			console.error('Error leaving Daily call:', e)
		}

		dailyParticipants.value = {}

		if (currentRoomId.value) {
			try {
				const token = await getAuthToken()
				await $fetch('/api/speaking-rooms/leave-room', {
					method: 'POST',
					headers: { Authorization: `Bearer ${token}` },
					body: { roomId: currentRoomId.value }
				})
			} catch (e) {
				console.error('Error leaving room:', e)
			}
		}

		stopListening()
		currentRoom.value = null
		currentRoomId.value = null
		callState.value = 'idle'
		localAudioEnabled.value = true
	}

	async function closeRoom() {
		if (!currentRoomId.value) return
		const token = await getAuthToken()
		await $fetch('/api/speaking-rooms/close-room', {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },
			body: { roomId: currentRoomId.value }
		})
		await leaveRoom()
	}

	// --- Questions (host-only) ---
	async function nextQuestion() {
		if (!isHost.value || !currentRoomId.value || isAdvancingQuestion.value) return
		const nextIdx = currentQuestionIndex.value + 1
		if (nextIdx >= questions.value.length) return

		if (pendingClearTimer) {
			clearTimeout(pendingClearTimer)
			pendingClearTimer = null
		}

		// Optimistic update — UI changes instantly
		pendingQuestionIndex.value = nextIdx
		isAdvancingQuestion.value = true

		try {
			const token = await getAuthToken()
			await $fetch('/api/speaking-rooms/next-question', {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` },
				body: { roomId: currentRoomId.value }
			})
			// Give onSnapshot time to settle before removing optimistic protection
			pendingClearTimer = setTimeout(() => {
				pendingQuestionIndex.value = null
				pendingClearTimer = null
			}, 2000)
		} catch (e) {
			pendingQuestionIndex.value = null
			console.error('Failed to advance question:', e)
		} finally {
			isAdvancingQuestion.value = false
		}

		// Send app message for low-latency sync
		try {
			const { useDaily } = await import('~/composables/useDaily.js')
			const daily = useDaily()
			const callObj = daily.getCallObject()
			if (callObj) {
				callObj.sendAppMessage({ type: 'question-change', index: nextIdx })
			}
		} catch (e) {
			// Firestore will sync anyway
		}
	}

	async function reloadQuestions() {
		if (!isHost.value || !currentRoomId.value) return
		if (pendingClearTimer) {
			clearTimeout(pendingClearTimer)
			pendingClearTimer = null
		}
		pendingQuestionIndex.value = null
		const token = await getAuthToken()
		await $fetch('/api/speaking-rooms/reload-questions', {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },
			body: { roomId: currentRoomId.value }
		})
	}

	// --- Media controls ---
	async function toggleAudio() {
		const { useDaily } = await import('~/composables/useDaily.js')
		const callObj = useDaily().getCallObject()
		if (!callObj) return
		localAudioEnabled.value = !localAudioEnabled.value
		callObj.setLocalAudio(localAudioEnabled.value)
	}

	return {
		// listing
		rooms,
		isLoadingRooms,
		roomFilters,
		hasMoreRooms,
		fetchRooms,
		// active room
		currentRoom,
		currentRoomId,
		isHost,
		participants,
		listenToRoom,
		createRoom,
		joinRoom,
		leaveRoom,
		closeRoom,
		// questions
		currentQuestionIndex,
		questions,
		currentQuestion,
		nextQuestion,
		reloadQuestions,
		isAdvancingQuestion,
		// media
		localAudioEnabled,
		callState,
		dailyParticipants,
		toggleAudio
	}
})
