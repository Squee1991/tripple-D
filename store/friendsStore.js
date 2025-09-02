import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
	getFirestore,
	doc,
	setDoc,
	updateDoc,
	serverTimestamp,
	collection,
	query,
	where,
	getDocs,
	getDoc,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export const useFriendsStore = defineStore('friends', () => {
	const db = getFirestore()
	const auth = getAuth()
	const friends = ref([])
	const requestsIncoming = ref([])
	const requestsOutgoing = ref([])
	const loading = ref(false)
	const error = ref(null)

	function currentUserUid() {
		return auth.currentUser?.uid || null
	}

	async function getProfile(uid) {
		if (!uid) return null
		try {
			const s = await getDoc(doc(db, 'users', uid))
			return s.exists() ? s.data() : null
		} catch {
			return null
		}
	}

	async function findUserByEmail(email) {
		const emailTrim = (email || '').trim()
		const emailNorm = emailTrim.toLowerCase()
		if (!emailTrim) throw new Error('Укажи email')
		const usersCol = collection(db, 'users')
		let snap = await getDocs(query(usersCol, where('emailLower', '==', emailNorm)))
		if (snap.empty) snap = await getDocs(query(usersCol, where('email', '==', emailNorm)))
		if (snap.empty) snap = await getDocs(query(usersCol, where('email', '==', emailTrim)))

		if (snap.empty) return null
		const d = snap.docs[0]
		return { uid: d.id, ...d.data() }
	}

	async function sendFriendRequest(email) {
		const myUid = currentUserUid()
		if (!myUid) throw new Error('Не авторизован')

		const user = await findUserByEmail(email)
		if (!user) throw new Error('Пользователь не найден')

		const theirUid = user.uid
		if (!theirUid) throw new Error('Некорректный UID')
		if (theirUid === myUid) throw new Error('Нельзя добавить себя')

		const theirProfile = user // уже есть
		const theirEmail = theirProfile.email || null
		const theirName  = theirProfile.name || theirProfile.displayName || null

		const myProfile = await getProfile(myUid)
		const myEmail = myProfile?.email || null
		const myName  = myProfile?.name || myProfile?.displayName || null

		await setDoc(
			doc(db, 'users', myUid, 'friends', theirUid),
			{
				status: 'pending',
				email: theirEmail,
				name: theirName,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			},
			{ merge: true }
		)

		await setDoc(
			doc(db, 'users', theirUid, 'friends', myUid),
			{
				status: 'incoming',
				email: myEmail,
				name: myName,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			},
			{ merge: true }
		)

		return true
	}

	async function acceptRequest(fromUid) {
		const myUid = currentUserUid()
		if (!myUid) throw new Error('Не авторизован')
		if (!fromUid) throw new Error('Некорректный UID')

		await setDoc(
			doc(db, 'users', myUid, 'friends', fromUid),
			{ status: 'accepted', updatedAt: serverTimestamp() },
			{ merge: true }
		)
		await setDoc(
			doc(db, 'users', fromUid, 'friends', myUid),
			{ status: 'accepted', updatedAt: serverTimestamp() },
			{ merge: true }
		)
		return true
	}

	async function declineRequest(fromUid) {
		const myUid = currentUserUid()
		if (!myUid) throw new Error('Не авторизован')
		if (!fromUid) throw new Error('Некорректный UID')

		await setDoc(
			doc(db, 'users', myUid, 'friends', fromUid),
			{ status: 'declined', updatedAt: serverTimestamp() },
			{ merge: true }
		)
		await setDoc(
			doc(db, 'users', fromUid, 'friends', myUid),
			{ status: 'declined', updatedAt: serverTimestamp() },
			{ merge: true }
		)
		return true
	}

	async function hydrateMissing(items) {
		return Promise.all(
			items.map(async (it) => {
				if (it?.email && it?.name) return it
				const prof = await getProfile(it.uid)
				return {
					...it,
					email: it.email ?? prof?.email ?? null,
					name: it.name ?? prof?.name ?? prof?.displayName ?? null,
				}
			})
		)
	}

	async function loadFriends() {
		const myUid = currentUserUid()
		if (!myUid) {
			friends.value = []
			requestsIncoming.value = []
			requestsOutgoing.value = []
			return
		}

		loading.value = true
		error.value = null
		try {
			const snap = await getDocs(collection(db, 'users', myUid, 'friends'))
			const all = snap.docs.map(d => ({ uid: d.id, ...d.data() }))
			const accepted = all.filter(f => f.status === 'accepted')
			const incoming = all.filter(f => f.status === 'incoming')
			const pending  = all.filter(f => f.status === 'pending')
			friends.value          = await hydrateMissing(accepted)
			requestsIncoming.value = await hydrateMissing(incoming)
			requestsOutgoing.value = await hydrateMissing(pending)
		} catch (e) {
			console.error(e)
			error.value = e?.message || 'Не удалось загрузить друзей'
		} finally {
			loading.value = false
		}
	}

	return {
		friends,
		requestsIncoming,
		requestsOutgoing,
		loading,
		error,

		findUserByEmail,
		sendFriendRequest,
		acceptRequest,
		declineRequest,
		loadFriends,
	}
})
