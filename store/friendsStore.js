// store/friendsStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
	getFirestore,
	doc,
	setDoc,
	serverTimestamp,
	collection,
	query,
	where,
	getDocs,
	getDoc,
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

function normalizeAvatarPath(v) {
	if (!v) return null
	const s = String(v).trim()
	if (/^https?:\/\//i.test(s)) return s
	const clean = s.split(/[?#]/)[0].replace(/^\/+/, '')
	const file = clean.split('/').pop()

	if (!file) return null
	return '/images/avatars/' + file
}

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

	async function getRelationStatus(uidA, uidB) {
		if (!uidA || !uidB) return 'none'
		try {
			const s = await getDoc(doc(db, 'users', uidA, 'friends', uidB))
			return s.exists() ? (s.data()?.status || 'none') : 'none'
		} catch {
			return 'none'
		}
	}

	async function resolveUser(identifier) {
		const id = String(identifier || '').trim()
		if (!id) return null
		if (id.includes('@')) return await findUserByEmail(id)

		const prof = await getProfile(id)
		return prof ? { uid: id, ...prof } : null
	}


	async function sendFriendRequest(identifier) {
		const myUid = currentUserUid()
		if (!myUid) throw new Error('Не авторизован')
		const user = await resolveUser(identifier)
		if (!user) throw new Error('Пользователь не найден')
		const theirUid = user.uid
		if (!theirUid) throw new Error('Некорректный UID')
		if (theirUid === myUid) throw new Error('Нельзя добавить себя')
		const statusMe   = await getRelationStatus(myUid, theirUid)
		const statusThem = await getRelationStatus(theirUid, myUid)
		if (statusMe === 'accepted' || statusThem === 'accepted') {
			throw new Error('Этот пользователь уже у вас в друзьях.')
		}
		if (statusMe === 'pending') {
			throw new Error('Запрос уже отправлён.')
		}
		if (statusMe === 'incoming') {
			await acceptRequest(theirUid)
			return true
		}
		// --- ИЗМЕНЕНИЕ ДЛЯ РЕШЕНИЯ ЗАДАЧИ ---
		// Мы по-прежнему копируем данные один раз при создании запроса,
		// чтобы UI мог сразу что-то показать, не дожидаясь гидрации.
		// Актуальные данные будут подгружены позже в loadFriends.
		const theirProfile = user
		const myProfile = await getProfile(myUid)
		const theirEmail = theirProfile.email || null
		const theirName  = theirProfile.name || theirProfile.displayName || null
		const myEmail    = myProfile?.email || null
		const myName     = myProfile?.name || myProfile?.displayName || null
		const theirAvatar = normalizeAvatarPath(
			theirProfile.avatarUrl || theirProfile.avatar || theirProfile.photoURL || null
		)
		const myAvatar = normalizeAvatarPath(
			myProfile?.avatarUrl || myProfile?.avatar || myProfile?.photoURL || null
		)

		await setDoc(
			doc(db, 'users', myUid, 'friends', theirUid),
			{
				status: 'pending',
				email: theirEmail,
				name: theirName,
				avatar: theirAvatar,
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
				avatar: myAvatar,
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

	// --- ЛОГИКА ОСТАЛАСЬ БЕЗ ИЗМЕНЕНИЙ, КАК ВЫ И ПРОСИЛИ ---
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

	// --- ИЗМЕНЕНИЕ ДЛЯ РЕШЕНИЯ ЗАДАЧИ ---
	// Функция `hydrateMissing` заменена на эту. Она всегда загружает свежий профиль
	// и обновляет данные (имя, аватар) поверх тех, что уже есть.
	async function hydrateWithLatestData(items) {
		return Promise.all(
			items.map(async (it) => {
				const prof = await getProfile(it.uid)
				if (!prof) { // Если профиль не найден (удален), оставляем старые данные
					return it
				}
				// Возвращаем старые данные 'it', перезаписав их свежими данными из 'prof'
				return {
					...it,
					email: prof.email ?? it.email ?? null,
					name: prof.name ?? prof.displayName ?? it.name ?? null,
					avatar: normalizeAvatarPath(
						prof.avatarUrl ?? prof.avatar ?? prof.photoURL ?? it.avatar ?? null
					),
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
			const relevantRelations = all.filter(f => f.status === 'accepted' || f.status === 'incoming' || f.status === 'pending');
			const hydratedList = await hydrateWithLatestData(relevantRelations)
			friends.value          = hydratedList.filter(f => f.status === 'accepted')
			requestsIncoming.value = hydratedList.filter(f => f.status === 'incoming')
			requestsOutgoing.value = hydratedList.filter(f => f.status === 'pending')

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
		normalizeAvatarPath,
		findUserByEmail,
		sendFriendRequest,
		acceptRequest,
		declineRequest,
		loadFriends,
	}
})