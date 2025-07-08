import { defineStore } from 'pinia'
import { ref } from 'vue'
// Добавим import для updateDoc
import { collection, addDoc, getDocs, query, where, onSnapshot, getFirestore, deleteDoc, doc, updateDoc } from 'firebase/firestore'

export const useCardsStore = defineStore('cardsStore', () => {
	const cards = ref([])
	const db = getFirestore()

	// Эта функция не используется в последней версии компонента, но пусть будет
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

	// --- НОВАЯ ФУНКЦИЯ: для редактирования карточек ---
	const updateCard = async (cardData) => {
		if (!cardData.id) {
			console.error("Ошибка обновления: отсутствует ID карточки");
			return;
		}
		const cardRef = doc(db, "cards", cardData.id);
		// Убираем id из объекта данных, чтобы он не перезаписывался в документе
		const { id, ...dataToUpdate } = cardData;
		await updateDoc(cardRef, dataToUpdate);
	}

	// --- ПЕРЕИМЕНОВАНО: для соответствия компоненту (было deleteCard) ---
	const removeCard = async (cardId) => {
		try {
			await deleteDoc(doc(db, 'cards', cardId))
			// Локальное удаление можно убрать, так как onSnapshot сделает это за нас,
			// но оно дает мгновенный эффект в интерфейсе. Оставим.
			cards.value = cards.value.filter(card => card.id !== cardId)
		} catch (error) {
			console.error('Ошибка при удалении карточки:', error)
		}
	}

	return {
		cards,
		loadPublicCards,
		subscribePublicCards,
		addCard,
		updateCard, // <-- Добавили в return
		removeCard, // <-- Изменили имя в return
	}
})