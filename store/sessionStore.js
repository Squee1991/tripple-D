// store/sessionStore.js
import {defineStore} from 'pinia'
import {ref, computed, watch, onUnmounted} from 'vue'
import {getAuth} from 'firebase/auth'
import {
	getFirestore, collection, query, where,
	orderBy, limit, getDocs, doc, updateDoc,
	addDoc, onSnapshot, serverTimestamp,
	deleteDoc, runTransaction, getDoc
} from 'firebase/firestore'
import {useRouter} from 'vue-router'

export const useSessionStore = defineStore('session', () => {
	const db = getFirestore()
	const auth = getAuth()
	const router = useRouter()

	const uid = computed(() => auth.currentUser?.uid)
	const currentWord = ref(null)
	const sessionId = ref(null)
	const sessionData = ref(null)
	const loading = ref(false)
	const message = ref('')
	const mySessionTimeout = ref(null)
	const mySessionId = ref(null)
	const unsubscribe = ref(null)
	const localePath = useLocalePath()

	const isHost = computed(() => sessionData.value?.hostId === uid.value)
	const isReady = computed(() => isHost.value ? sessionData.value?.readyHost : sessionData.value?.readyGuest)
	const opponentReady = computed(() => isHost.value ? sessionData.value?.readyGuest : sessionData.value?.readyHost)
	const bothPlayersConnected = computed(() => sessionData.value?.status === 'pending' && sessionData.value?.hostId && sessionData.value?.guestId)

	async function findOpponent(theme, deck) {
		loading.value = true
		message.value = ''
		if (!uid.value) {
			message.value = 'Вы не авторизованы'
			loading.value = false
			return
		}
		const q = query(
			collection(db, 'sessions'),
			where('guestId', '==', null),
			where('status', '==', 'waiting'),
			orderBy('createdAt'),
			limit(1)
		)
		const snapshot = await getDocs(q)
		if (!snapshot.empty) {
			const session = snapshot.docs[0]
			const sessionRef = doc(db, 'sessions', session.id)
			try {
				await runTransaction(db, async (transaction) => {
					const docSnap = await transaction.get(sessionRef)
					const data = docSnap.data()
					if (!data || data.guestId || data.status !== 'waiting') throw 'Сессию уже заняли'
					transaction.update(sessionRef, {guestId: uid.value, status: 'pending'})
				})
				sessionId.value = session.id
				mySessionId.value = null
				listenToSession(session.id)
				message.value = ''
			} catch (error) {
				message.value = 'Сессию уже заняли, пробуем снова...'
				loading.value = false
				await findOpponent(theme, deck)
				return
			}
			loading.value = false
		} else {
			const newSessionRef = await addDoc(collection(db, 'sessions'), {
				hostId: uid.value,
				guestId: null,
				status: 'waiting',
				readyHost: false,
				readyGuest: false,
				createdAt: serverTimestamp(),
				theme,
				deck: JSON.parse(JSON.stringify(deck))
			})
			sessionId.value = newSessionRef.id
			mySessionId.value = newSessionRef.id
			listenToSession(newSessionRef.id)
			message.value = ''
			loading.value = false

			mySessionTimeout.value = setTimeout(async () => {
				if (sessionData.value && !sessionData.value.guestId) {
					const q2 = query(
						collection(db, 'sessions'),
						where('guestId', '==', null),
						where('status', '==', 'waiting'),
						orderBy('createdAt'),
						limit(1)
					)
					const snapshot2 = await getDocs(q2)
					if (!snapshot2.empty && snapshot2.docs[0].id !== mySessionId.value) {
						const foreignSession = snapshot2.docs[0]
						const foreignSessionRef = doc(db, 'sessions', foreignSession.id)
						try {
							await runTransaction(db, async (transaction) => {
								const docSnap = await transaction.get(foreignSessionRef)
								const data = docSnap.data()
								if (!data || data.guestId || data.status !== 'waiting') throw 'Сессию уже заняли'
								transaction.update(foreignSessionRef, {guestId: uid.value, status: 'pending'})
							})
							sessionId.value = foreignSession.id
							listenToSession(foreignSession.id)
							message.value = ''
							await deleteDoc(doc(db, 'sessions', mySessionId.value))
							mySessionId.value = null
						} catch {}
					}
				}
			}, 10000)
		}
	}

	async function leaveSession() {
		if (mySessionTimeout.value) clearTimeout(mySessionTimeout.value)
		if (sessionId.value) {
			await deleteDoc(doc(db, 'sessions', sessionId.value))
			sessionId.value = null
			sessionData.value = null
			message.value = 'Вы покинули сессию'
			setTimeout(() => message.value = '', 1500)
		}
	}

	async function markReady() {
		if (!uid.value || !sessionId.value || !sessionData.value) return
		const sessionRef = doc(db, 'sessions', sessionId.value)
		if (sessionData.value.hostId === uid.value) {
			await updateDoc(sessionRef, {readyHost: true})
		} else {
			await updateDoc(sessionRef, {readyGuest: true})
		}
	}

	function listenToSession(id) {
		const sessionRef = doc(db, 'sessions', id)
		if (unsubscribe.value) unsubscribe.value()
		unsubscribe.value = onSnapshot(sessionRef, (docSnap) => {
			const data = docSnap.data()
			sessionData.value = data
			if (data && data.status === 'active') router.push(localePath(`/wordBattle?id=${id}`))
			if (!data) {
				sessionId.value = null
				sessionData.value = null
				message.value = null
			}
		})
	}

	async function loadSessionWord(sessionId) {
		const sessionRef = doc(db, 'sessions', sessionId)
		const sessionSnap = await getDoc(sessionRef)
		const data = sessionSnap.data()
		if (data?.word) currentWord.value = data.word
	}

	watch(() => sessionData.value?.readyHost && sessionData.value?.readyGuest && sessionData.value?.status === 'pending', async (isReady) => {
		if (isReady && sessionId.value) {
			const sessionRef = doc(db, 'sessions', sessionId.value)
			const response = await fetch('/words.json')
			const data = await response.json()
			let arr = []
			Object.values(data).forEach(themeArr => {
				arr = arr.concat(themeArr)
			})
			const random = arr[Math.floor(Math.random() * arr.length)]

			await updateDoc(sessionRef, {
				status: 'active',
				word: random.de
			})
		}
	})

	onUnmounted(() => {
		if (mySessionTimeout.value) clearTimeout(mySessionTimeout.value)
		if (unsubscribe.value) unsubscribe.value()
	})

	return {
		sessionId,
		sessionData,
		findOpponent,
		leaveSession,
		markReady,
		currentWord,
		loadSessionWord,
		isHost,
		isReady,
		opponentReady,
		bothPlayersConnected,
		loading,
		message
	}
})
