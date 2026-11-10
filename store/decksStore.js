// Свои колоды карточек. Колоды: users/{uid}/decks, карточки: users/{uid}/deckCards (с полем deckId).
// Карточки лежат плоско, чтобы «повторить всё на сегодня» по всем колодам было одним запросом.
import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {
	getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch, increment
} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {getDateKey, isWordDue, isWordInReview, isWordMastered} from '~/utils/wordReview.js'
import {afterLesson, afterReview} from '~/utils/memoryModel.js'
import {dictionaryKey as cardKey} from '~/utils/cardDictionary.js'

export const DECK_COLORS = ['#8b5cf6', '#3b82f6', '#16a34a', '#f59e0b', '#ec4899', '#0ea5e9', '#ef4444', '#14b8a6']
export const DECK_LEVELS = ['A1', 'A2', 'B1']
export const DECK_TITLE_MAX = 40
export const CARD_FIELD_MAX = 120

const clean = (value, max = CARD_FIELD_MAX) => String(value || '').trim().slice(0, max)

export const useDecksStore = defineStore('decks', () => {
	const db = getFirestore()
	const decks = ref([])
	const cards = ref([])
	const loaded = ref(false)
	const loadedUid = ref(null)
	let loadingPromise = null

	const uid = () => getAuth().currentUser?.uid || null
	const decksCol = (userId) => collection(db, 'users', userId, 'decks')
	const cardsCol = (userId) => collection(db, 'users', userId, 'deckCards')

	async function load(force = false) {
		const userId = uid()
		if (!userId) return
		if (!force && loaded.value && loadedUid.value === userId) return
		if (loadingPromise) return loadingPromise
		loadingPromise = (async () => {
			const [deckSnap, cardSnap] = await Promise.all([getDocs(decksCol(userId)), getDocs(cardsCol(userId))])
			decks.value = deckSnap.docs.map(d => ({id: d.id, ...d.data()}))
				.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
			cards.value = cardSnap.docs.map(d => ({id: d.id, ...d.data()}))
			loaded.value = true
			loadedUid.value = userId
		})()
		try {
			await loadingPromise
		} finally {
			loadingPromise = null
		}
	}

	function reset() {
		decks.value = []
		cards.value = []
		loaded.value = false
		loadedUid.value = null
	}

	const deckById = (id) => decks.value.find(deck => deck.id === id) || null
	const cardsOfDeck = (deckId) => cards.value.filter(card => card.deckId === deckId)
		.sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')))

	function statsOf(list) {
		const today = getDateKey()
		return {
			total: list.length,
			fresh: list.filter(card => !isWordInReview(card)).length,
			learning: list.filter(card => isWordInReview(card) && !isWordMastered(card)).length,
			mastered: list.filter(card => isWordMastered(card)).length,
			due: list.filter(card => isWordDue(card, today)).length
		}
	}

	const deckStats = (deckId) => statsOf(cardsOfDeck(deckId))
	const totalDue = computed(() => statsOf(cards.value).due)

	// deckId = null: по всем колодам
	const dueCards = (deckId = null) => {
		const today = getDateKey()
		return cards.value.filter(card => (!deckId || card.deckId === deckId) && isWordDue(card, today))
	}
	const freshCards = (deckId) => cardsOfDeck(deckId).filter(card => !isWordInReview(card))

	async function createDeck({title, level = '', color = DECK_COLORS[0]}) {
		const userId = uid()
		if (!userId) return null
		const now = new Date().toISOString()
		const data = {
			title: clean(title, DECK_TITLE_MAX),
			level: DECK_LEVELS.includes(level) ? level : '',
			color: DECK_COLORS.includes(color) ? color : DECK_COLORS[0],
			cardCount: 0,
			createdAt: now,
			updatedAt: now
		}
		const ref = await addDoc(decksCol(userId), data)
		const deck = {id: ref.id, ...data}
		decks.value = [deck, ...decks.value]
		return deck
	}

	async function updateDeck(deckId, patch) {
		const userId = uid()
		const deck = deckById(deckId)
		if (!userId || !deck) return
		const data = {updatedAt: new Date().toISOString()}
		if ('title' in patch) data.title = clean(patch.title, DECK_TITLE_MAX)
		if ('level' in patch) data.level = DECK_LEVELS.includes(patch.level) ? patch.level : ''
		if ('color' in patch && DECK_COLORS.includes(patch.color)) data.color = patch.color
		await updateDoc(doc(db, 'users', userId, 'decks', deckId), data)
		Object.assign(deck, data)
	}

	// колоду удаляем вместе с её карточками; в одном batch не больше 500 записей
	async function deleteDeck(deckId) {
		const userId = uid()
		if (!userId) return
		const refs = cardsOfDeck(deckId).map(card => doc(db, 'users', userId, 'deckCards', card.id))
		refs.push(doc(db, 'users', userId, 'decks', deckId))
		for (let start = 0; start < refs.length; start += 450) {
			const batch = writeBatch(db)
			refs.slice(start, start + 450).forEach(item => batch.delete(item))
			await batch.commit()
		}
		cards.value = cards.value.filter(card => card.deckId !== deckId)
		decks.value = decks.value.filter(deck => deck.id !== deckId)
	}

	function cardData(input) {
		const kind = ['noun', 'verb', 'phrase'].includes(input.kind) ? input.kind : 'phrase'
		return {
			kind,
			de: clean(input.de),
			article: kind === 'noun' && ['der', 'die', 'das'].includes(input.article) ? input.article : '',
			plural: kind === 'noun' ? clean(input.plural) : '',
			translation: clean(input.translation),
			praeteritum: kind === 'verb' ? clean(input.praeteritum) : '',
			perfekt: kind === 'verb' ? clean(input.perfekt) : '',
			example: clean(input.example, 200)
		}
	}

	async function addCard(deckId, input) {
		const userId = uid()
		if (!userId || !deckById(deckId)) return null
		const data = {
			...cardData(input),
			deckId,
			level: 0,
			nextReviewDate: null,
			createdAt: new Date().toISOString()
		}
		const ref = await addDoc(cardsCol(userId), data)
		await updateDoc(doc(db, 'users', userId, 'decks', deckId), {cardCount: increment(1)})
		const card = {id: ref.id, ...data}
		cards.value = [...cards.value, card]
		const deck = deckById(deckId)
		if (deck) deck.cardCount = (deck.cardCount || 0) + 1
		return card
	}

	// много карточек сразу (список, курс, фото); слова, которые уже есть в колоде, пропускаем
	async function addCards(deckId, inputs) {
		const userId = uid()
		if (!userId || !deckById(deckId)) return []
		const have = new Set(cardsOfDeck(deckId).map(card => cardKey(card.de)))
		const now = Date.now()
		const fresh = []
		for (const input of inputs) {
			const data = cardData(input)
			const key = cardKey(data.de)
			if (!data.de || !data.translation || have.has(key)) continue
			have.add(key)
			// разное время создания: в колоде карточки остаются в порядке списка
			fresh.push({...data, deckId, level: 0, nextReviewDate: null, createdAt: new Date(now + fresh.length).toISOString()})
		}
		const added = []
		for (let start = 0; start < fresh.length; start += 450) {
			const batch = writeBatch(db)
			for (const data of fresh.slice(start, start + 450)) {
				const ref = doc(cardsCol(userId))
				batch.set(ref, data)
				added.push({id: ref.id, ...data})
			}
			await batch.commit()
		}
		if (added.length) {
			await updateDoc(doc(db, 'users', userId, 'decks', deckId), {cardCount: increment(added.length)})
			cards.value = [...cards.value, ...added]
			const deck = deckById(deckId)
			if (deck) deck.cardCount = (deck.cardCount || 0) + added.length
		}
		return added
	}

	async function updateCard(cardId, input) {
		const userId = uid()
		const card = cards.value.find(item => item.id === cardId)
		if (!userId || !card) return
		const data = cardData({...card, ...input})
		await updateDoc(doc(db, 'users', userId, 'deckCards', cardId), data)
		Object.assign(card, data)
	}

	async function deleteCard(cardId) {
		const userId = uid()
		const card = cards.value.find(item => item.id === cardId)
		if (!userId || !card) return
		await deleteDoc(doc(db, 'users', userId, 'deckCards', cardId))
		await updateDoc(doc(db, 'users', userId, 'decks', card.deckId), {cardCount: increment(-1)})
		cards.value = cards.value.filter(item => item.id !== cardId)
		const deck = deckById(card.deckId)
		if (deck) deck.cardCount = Math.max(0, (deck.cardCount || 1) - 1)
	}

	async function saveProgress(card, progress) {
		const userId = uid()
		if (!userId) return
		Object.assign(card, progress)
		await updateDoc(doc(db, 'users', userId, 'deckCards', card.id), progress)
	}

	// урок пройден: карточка уходит в повторение, первый повтор завтра (с ошибками в уроке слово считаем сложнее)
	const markLearned = (card, hadMistakes = false) => saveProgress(card, afterLesson(hadMistakes))
	// повтор: grade из memoryModel.gradeAnswer, модель памяти сама считает следующую дату
	const markReviewed = (card, grade) => saveProgress(card, afterReview(card, grade))

	return {
		decks, cards, loaded,
		load, reset,
		deckById, cardsOfDeck, deckStats, totalDue, dueCards, freshCards,
		createDeck, updateDeck, deleteDeck,
		addCard, addCards, updateCard, deleteCard,
		markLearned, markReviewed
	}
})
