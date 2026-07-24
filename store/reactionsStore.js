import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, getDoc, setDoc, increment, arrayUnion, getFirestore } from 'firebase/firestore'
import { userAuthStore } from './authStore.js'

export const useReactionsStore = defineStore('reactions', () => {
	const db = getFirestore()
	const articlesReactions = ref({ stats: {}, users: {} })
	const authStore = userAuthStore()
	const syncOfflineLikes = async () => {
		const unsyncedString = localStorage.getItem('skillup_unsynced_likes')
		if (!unsyncedString) return
		try {
			const unsyncedQueue = JSON.parse(unsyncedString)
			if (unsyncedQueue.length === 0) return
			const userId = authStore.uid
			if (!userId) return
			const globalDocRef = doc(db, 'reactions_db', 'all_data')
			const userDocRef = doc(db, 'users', userId, 'saved_data', 'reactions')
			const globalPayload = {}
			const userPayload = {}
			unsyncedQueue.forEach(item => {
				globalPayload[`stats.${item.articleId}.${item.emoji}`] = increment(1)
				userPayload[`${item.articleId}`] = arrayUnion(item.emoji)
			})

			await setDoc(globalDocRef, globalPayload, { merge: true })
			await setDoc(userDocRef, userPayload, { merge: true })
			localStorage.removeItem('skillup_unsynced_likes')
			console.log('Синхронизация завершена успешно!')
		} catch (e) {
			console.error('Ошибка отправки отложенных лайков:', e)
		}
	}

	const loadAllReactions = async () => {
		await syncOfflineLikes()
		const cached = localStorage.getItem('skillup_all_reactions')
		if (cached) {
			const { timestamp, data } = JSON.parse(cached)
			if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
				articlesReactions.value = data
				return
			}
		}
		try {
			const userId = authStore.uid
			const globalDocRef = doc(db, 'reactions_db', 'all_data')
			const globalSnap = await getDoc(globalDocRef)
			let globalStats = {}
			if (globalSnap.exists()) {
				globalStats = globalSnap.data().stats || {}
			}
			let userLikes = {}
			if (userId) {
				const userDocRef = doc(db, 'users', userId, 'saved_data', 'reactions')
				const userSnap = await getDoc(userDocRef)
				if (userSnap.exists()) {
					userLikes = userSnap.data() || {}
				}
			}
			const mergedData = {
				stats: globalStats,
				users: userId ? { [userId]: userLikes } : {}
			}

			articlesReactions.value = mergedData

			localStorage.setItem('skillup_all_reactions', JSON.stringify({
				timestamp: Date.now(),
				data: mergedData
			}))

		} catch (e) {
			console.error('Ошибка загрузки данных:', e)
		}
	}

	const addReaction = (articleId, emoji) => {
		const userId = authStore.uid
		if (!userId) {
			alert('Пожалуйста, войди в аккаунт!')
			return
		}
		if (!articlesReactions.value.stats[articleId]) articlesReactions.value.stats[articleId] = {}
		if (!articlesReactions.value.users[userId]) articlesReactions.value.users[userId] = {}
		if (!articlesReactions.value.users[userId][articleId]) articlesReactions.value.users[userId][articleId] = []
		if (articlesReactions.value.users[userId][articleId].includes(emoji)) return
		if (!articlesReactions.value.stats[articleId][emoji]) articlesReactions.value.stats[articleId][emoji] = 0
		articlesReactions.value.stats[articleId][emoji]++
		articlesReactions.value.users[userId][articleId].push(emoji)
		localStorage.setItem('skillup_all_reactions', JSON.stringify({
			timestamp: Date.now(),
			data: articlesReactions.value
		}))
		let unsyncedQueue = []
		const unsyncedString = localStorage.getItem('skillup_unsynced_likes')
		if (unsyncedString) {
			unsyncedQueue = JSON.parse(unsyncedString)
		}
		unsyncedQueue.push({ articleId, emoji })
		localStorage.setItem('skillup_unsynced_likes', JSON.stringify(unsyncedQueue))
	}
	return { articlesReactions, loadAllReactions, addReaction }
})