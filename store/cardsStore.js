import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, addDoc, getDocs, query, where, onSnapshot, getFirestore, deleteDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import {userAuthStore} from './authStore.js'
export const useCardsStore = defineStore('cardsStore', () => {
	const cards = ref([])
	const createdCount = ref(0)
	const db = getFirestore()
    const authStore =  userAuthStore()
	const getUserId = () => {
		const user = getAuth().currentUser
		return user ? user.uid : null
	}

	const loadCreatedCount = async () => {
		const uid = getUserId()
		if (!uid) return
		const statRef = doc(db, 'cardStats', uid)
		const statSnap = await getDoc(statRef)
		if (statSnap.exists()) {
			createdCount.value = statSnap.data().createdCount || 0
		}
	}

	const saveCreatedCount = async () => {
		const uid = getUserId()
		if (!uid) return
		await setDoc(doc(db, 'cardStats', uid), {
			createdCount: createdCount.value,
			name: authStore.name || '',

		}, { merge: true })
	}

	const loadPublicCards = async () => {
		const q = query(collection(db, 'cards'), where('isPublic', '==', true))
		const snapshot = await getDocs(q)
		cards.value = snapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		}))
		await loadCreatedCount()
	}

	const subscribePublicCards = () => {
		const q = query(collection(db, 'cards'), where('isPublic', '==', true))
		return onSnapshot(q, (snapshot) => {
			cards.value = snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}))
		})
	}

	const addCard = async (card) => {
		const uid = getUserId()
		if (!uid) return

		await addDoc(collection(db, 'cards'), {
			...card,
			isPublic: true,
			createdAt: new Date().toISOString(),
			ownerId: uid
		})

		createdCount.value++
		await saveCreatedCount()
	}

	const updateCard = async (cardData) => {
		if (!cardData.id) {
			console.error("Ошибка обновления: отсутствует ID карточки")
			return
		}
		const cardRef = doc(db, "cards", cardData.id)
		const { id, ...dataToUpdate } = cardData
		await updateDoc(cardRef, dataToUpdate)
	}

	const removeCard = async (cardId) => {
		try {
			await deleteDoc(doc(db, 'cards', cardId))
			cards.value = cards.value.filter(card => card.id !== cardId)
		} catch (error) {
			console.error('Ошибка при удалении карточки:', error)
		}
	}

	return {
		cards,
		createdCount,
		loadPublicCards,
		subscribePublicCards,
		addCard,
		updateCard,
		removeCard,
		loadCreatedCount,
	}
})
