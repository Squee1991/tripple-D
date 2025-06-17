import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, addDoc, getDocs, query, where, onSnapshot, getFirestore } from 'firebase/firestore'


export const useCardsStore = defineStore('cardsStore', () => {
	const cards = ref([])
	const db = getFirestore()
	// Получить все публичные карточки
	const loadPublicCards = async () => {
		const q = query(collection(db, 'cards'), where('isPublic', '==', true))
		const snapshot = await getDocs(q)
		cards.value = snapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		}))
	}

	// Реал-тайм подписка на карточки
	const subscribePublicCards = () => {
		const q = query(collection(db, 'cards'), where('isPublic', '==', true))
		return onSnapshot(q, (snapshot) => {
			cards.value = snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}))
		})
	}

	// Добавить новую карточку
	const addCard = async (card) => {
		await addDoc(collection(db, 'cards'), {
			...card,
			isPublic: true,
			createdAt: new Date().toISOString(),
		})
	}

	return {
		cards,
		loadPublicCards,
		subscribePublicCards,
		addCard,
	}
})
