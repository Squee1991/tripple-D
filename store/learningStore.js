import { defineStore } from 'pinia'
import { ref , computed } from 'vue'
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
import { userAuthStore } from './authStore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const userlangStore = defineStore('learning', () => {
	const words = ref([])
	const db = getFirestore()
	const learnedWords = ref([])
	const wrongAnswers = ref([])
	const selectedTopics = ref([])
	const points = ref(0)
	const currentTopic = ref(null)
	const topicStats = computed(() => {
		const stats = {}
		const topics = [...new Set(words.value.map(w => w.topic).filter(Boolean))]
		for (const topic of topics) {
			const total = words.value.filter(w => w.topic === topic).length
			const learned = learnedWords.value.filter(w => w.topic === topic).length
			stats[topic] = {
				totalWords: total,
				learnedWords: learned
			}
		}

		return stats
	})

	const wordsByCurrentTopic = computed(() => {
		if (!currentTopic.value) return []
		return words.value.filter(word => word.topic === currentTopic.value)
	})

	const filteredTopicStats = computed(() => {
		const result = {}
		for (const topic of selectedTopics.value) {
			if (topicStats.value[topic]) {
				result[topic] = topicStats.value[topic]
			}
		}
		return result
	})

	const markProgress = async (word, modeKey, value = true) => {
		const found = words.value.find(w => w.de === word.de)
		if (!found) return

		if (!found.progress) {
			found.progress = {}
		}
		found.progress[modeKey] = value

		await saveToFirebase()
	}

	const getUserDocRef = () => {
		const user = getAuth().currentUser
		if (!user) return null
		return doc(db, 'users', user.uid)
	}

	const totalPoints = computed(() => points.value)

	const loadFromFirebase = async () => {
		const auth = getAuth()
		const db = getFirestore()
		return new Promise((resolve) => {
			onAuthStateChanged(auth, async (user) => {
				if (!user) return resolve()
				const userDoc = doc(db, 'users', user.uid)
				const docSnap = await getDoc(userDoc)
				if (docSnap.exists()) {
					const data = docSnap.data()
					words.value = data.words || []
					learnedWords.value = data.learnedWords || []
					wrongAnswers.value = data.wrongAnswers || []
					selectedTopics.value = data.selectedTopics || {}
					points.value = data.points || 0
				}
				resolve()
			})
		})
	}

	const saveToFirebase = async () => {
		const userDoc = getUserDocRef()
		if (!userDoc) return
		await setDoc(userDoc, {
			words: words.value,
			learnedWords: learnedWords.value,
			wrongAnswers: wrongAnswers.value,
			selectedTopics: selectedTopics.value,
			points: points.value
		}, { merge: true })
	}

	const setWords = async (newWords) => {
		words.value = newWords
		await saveToFirebase()
	}

	const setSelectedTopics = async (topics) => {
		for (const topic of topics) {
			if (!selectedTopics.value.includes(topic)) {
				selectedTopics.value.push(topic)
			}
		}
		await saveToFirebase()
	}

	const addWord = async (word) => {
		if (!words.value.find(w => w.de === word.de)) {
			words.value.push(word)
			await saveToFirebase()
		}
	}

	const updateSelectedTopic = async (topicKey, total, learned = 0) => {
		selectedTopics.value[topicKey] = {
			totalWords: total,
			learnedWords: learned
		}
		await saveToFirebase()
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
			points.value++
			if (word.topic && selectedTopics.value[word.topic]) {
				selectedTopics.value[word.topic].learnedWords++
			}

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
		selectedTopics.value = {}
		await saveToFirebase()
	}

	return {
		words,
		learnedWords,
		wrongAnswers,
		selectedTopics,
		points,
		totalPoints,
		topicStats,
		filteredTopicStats,
		wordsByCurrentTopic,
		currentTopic,
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
		setWords,
		updateSelectedTopic,
		markProgress
	}
})