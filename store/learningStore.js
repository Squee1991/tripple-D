import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
export const userlangStore = defineStore('learning', () => {
	const db = getFirestore()
	const words = ref([])
	const learnedWords = ref([])         // тут слова, полностью изученные
	const wrongAnswers = ref([])         // тут слова, где были ошибки
	const selectedTopics = ref([])       // тут выбранные темы (ключи)
	const selectedWords = ref([])        // тут слова, выбранные для сессии(текущая тема)
	const points = ref(0)                // тут очки/баллы
	const currentIndex = ref(0)          // тут индекс текущего слова в сессии
	const currentModeIndex = ref(0)      // тут индекс текущего способа обучения
	const exp = ref(0)                   // тут опыт
	const isLeveling = ref(0)            // тут уровень

	const topicStats = computed(() => {
		const stats = {}
		const topics = [...new Set(words.value.map(w => w.topic).filter(Boolean))]
		for (const topic of topics) {
			const total = words.value.filter(w => w.topic === topic).length
			const learned = learnedWords.value.filter(w => w.topic === topic).length
			stats[topic] = { totalWords: total, learnedWords: learned }
		}
		return stats
	})

	const markProgress = async (word, modeKey, value = true) => {
		const selected = selectedWords.value.find(w => w.de === word.de)
		const wasAlreadyTrue = selected.progress[modeKey] === true
		selected.progress[modeKey] = value
		if (value === true && !wasAlreadyTrue) {
			points.value++
			exp.value++
			handleLeveling()
		}
		const found = words.value.find(w => w.de === word.de)
		if (found) {
			if (!found.progress) found.progress = {}
			found.progress[modeKey] = value
		}
		await saveToFirebase()
	}

	const addWordsToGlobal = async (wordsList) => {
		let added = false
		wordsList.forEach(newWord => {
			if (!words.value.find(w => w.de === newWord.de)) {
				words.value.push({
					...newWord,
					progress: {
						article: null,
						letters: null,
						wordArticle: null,
						audio: null,
						plural: null
					}
				})
				added = true
			}
		})
		if (added) await saveToFirebase()
	}

	const setSelectedWords = async (wordsList) => {
		selectedWords.value = wordsList.map(word => ({
			...word,
			progress: {
				article: null,
				letters: null,
				wordArticle: null,
				audio: null,
				plural: null
			}
		}))
		currentIndex.value = 0
		currentModeIndex.value = 0
		await saveToFirebase()
	}

	const handleLeveling = () => {
		const LEVEL_UP_XP = 100
		if (exp.value >= LEVEL_UP_XP) {
			isLeveling.value++
			exp.value -= LEVEL_UP_XP
		}
	}

	const setSelectedTopics = async (topics) => {
		const uniqueTopics = Array.from(new Set([...selectedTopics.value, ...topics]))
		selectedTopics.value = uniqueTopics
		currentIndex.value = 0
		currentModeIndex.value = 0
		await saveToFirebase()
	}

	const markAsLearned = async (word, selectedModes = []) => {
		const requiredModes = selectedModes.length
			? selectedModes
			: ['article', 'letters', 'wordArticle', 'audio', 'plural']

		const isFullyLearned = requiredModes.every(mode => word.progress?.[mode] === true)

		if (!isFullyLearned) return

		if (!learnedWords.value.find(w => w.de === word.de)) {
			learnedWords.value.push({ ...word })

			points.value++
			exp.value++
			handleLeveling()

			await saveToFirebase()
		}
	}

	const addWrongAnswers = async (word) => {
		if (!word || !word.de) return;
		const isAlreadyInWrong = wrongAnswers.value.find(w => w.de === word.de);
		if (!isAlreadyInWrong) {
			wrongAnswers.value.push({ ...word });
			await saveToFirebase();
		}
	};

	const clearProgress = async () => {
		words.value.forEach(word => {
			word.progress = {
				article: false, letters: null, wordArticle: null, audio: null, plural: null
			}
		})
		selectedWords.value.forEach(word => {
			word.progress = {
				article: null, letters: null, wordArticle: null , audio: null, plural: null
			}
		})
		learnedWords.value = []
		points.value = 0
		currentIndex.value = 0
		currentModeIndex.value = 0
		await saveToFirebase()
	}

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
					selectedTopics.value = data.selectedTopics || []
					selectedWords.value = data.selectedWords || []
					points.value = data.points || 0
					exp.value = data.exp || 0
					isLeveling.value = data.isLeveling || 0
					currentIndex.value = data.currentIndex || 0
					currentModeIndex.value = data.currentModeIndex || 0
				}
				resolve()
			})
		})
	}

	const getUserDocRef = () => {
		const user = getAuth().currentUser
		if (!user) return null
		return doc(db, 'users', user.uid)
	}

	const saveToFirebase = async () => {
		const userDoc = getUserDocRef()
		if (!userDoc) return
		await setDoc(userDoc, {
			words: words.value,
			learnedWords: learnedWords.value,
			wrongAnswers: wrongAnswers.value,
			selectedTopics: selectedTopics.value,
			selectedWords: selectedWords.value,
			points: points.value,
			exp: exp.value,
			isLeveling: isLeveling.value,
			currentIndex: currentIndex.value,
			currentModeIndex: currentModeIndex.value
		}, { merge: true })
	}

	const syncSelectedWordsProgress = () => {
		selectedWords.value = selectedWords.value.map(selected => {
			const fullWord = words.value.find(w => w.de === selected.de)
			if (fullWord && fullWord.progress) {
				selected.progress = fullWord.progress
			}
			return selected
		})
	}
	const clearAll = async () => {
		words.value = []
		learnedWords.value = []
		wrongAnswers.value = []
		selectedTopics.value = []
		selectedWords.value = []
		points.value = 0
		exp.value = 0
		isLeveling.value = 1
		currentIndex.value = 0
		currentModeIndex.value = 0
		await saveToFirebase()
	}

	return {
		words,
		learnedWords,
		wrongAnswers,
		selectedTopics,
		selectedWords,
		points,
		exp,
		isLeveling,
		currentIndex,
		currentModeIndex,
		topicStats,
		handleLeveling,
		markProgress,
		markAsLearned,
		setSelectedTopics,
		setSelectedWords,
		addWrongAnswers,
		clearProgress,
		syncSelectedWordsProgress,
		loadFromFirebase,
		saveToFirebase,
		clearAll,
		addWordsToGlobal
	}
})
