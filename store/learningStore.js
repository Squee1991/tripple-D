import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
import { userAuthStore } from './authStore'

export const userlangStore = defineStore('learning', () => {
	const words = ref([])
	const db = getFirestore()
	const learnedWords = ref([])
	const wrongAnswers = ref([])
	const selectedTopics = ref([])

	const getUserDocRef = () => {
		const authStore = userAuthStore()
		const uid = authStore.user?.uid
		if (!uid) return null
		return doc(db, 'users', uid)
	}

	const loadFromFirebase = async () => {
		const userDoc = getUserDocRef()
		if (!userDoc) return

		const docSnap = await getDoc(userDoc)
		if (docSnap.exists()) {
			const data = docSnap.data()
			words.value = data.words || []
			learnedWords.value = data.learnedWords || []
			wrongAnswers.value = data.wrongAnswers || []
			selectedTopics.value = data.selectedTopics || []
		}
	}

	const saveToFirebase = async () => {
		const userDoc = getUserDocRef()
		if (!userDoc) return
		await setDoc(userDoc, {
			words: words.value,
			learnedWords: learnedWords.value,
			wrongAnswers: wrongAnswers.value,
			selectedTopics: selectedTopics.value
		}, { merge: true })
	}

	const setWords = async (newWords) => {
		words.value = newWords
		await saveToFirebase()
	}

	const setSelectedTopics = async (topics) => {
		selectedTopics.value = topics
		await saveToFirebase()
	}

	const addWord = async (word) => {
		if (!words.value.find(w => w.de === word.de)) {
			words.value.push(word)
			await saveToFirebase()
		}
	}

	const removeWord = async (word) => {
		words.value = words.value.filter(w => w.de !== word.de)
		await saveToFirebase()
	}

	const clearWords = async () => {
		words.value = []
		await saveToFirebase()
	}

	const markAsLearned = async (word) => {
		if (!learnedWords.value.find(w => w.de === word.de)) {
			learnedWords.value.push(word)
			await saveToFirebase()
		}
	}

	const isLearned = (word) => {
		return learnedWords.value.some(w => w.de === word.de)
	}

	const addWrongAnswers = async (word) => {
		if (!wrongAnswers.value.find(w => w.de === word.de)) {
			wrongAnswers.value.push(word)
			await saveToFirebase()
		}
	}

	const cleanWrongAnswers = async () => {
		wrongAnswers.value = []
		await saveToFirebase()
	}

	const clearAll = async () => {
		words.value = []
		learnedWords.value = []
		wrongAnswers.value = []
		selectedTopics.value = []
		await saveToFirebase()
	}

	return {
		words,
		learnedWords,
		wrongAnswers,
		selectedTopics,
		addWord,
		removeWord,
		clearWords,
		markAsLearned,
		isLearned,
		addWrongAnswers,
		cleanWrongAnswers,
		loadFromFirebase,
		clearAll,
		saveToFirebase,
		setSelectedTopics,
		setWords
	}
})
