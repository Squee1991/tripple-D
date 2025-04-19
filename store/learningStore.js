import { defineStore } from 'pinia'
import { ref } from 'vue'

export const userlangStore = defineStore('learning', () => {
	const words = ref([])
	const learnedWords = ref([])
	const wrongAnswers = ref([])
	const selectedTopics = ref([])

	const loadFromLocal = () => {
		if (process.client) {
			const savedWords = localStorage.getItem('words')
			const savedLearned = localStorage.getItem('learnedWords')
			const savedWrong = localStorage.getItem('wrongAnswers')
			const savedTopics = localStorage.getItem('selectedTopics')

			if (savedWords) words.value = JSON.parse(savedWords)
			if (savedLearned) learnedWords.value = JSON.parse(savedLearned)
			if (savedWrong) wrongAnswers.value = JSON.parse(savedWrong)
			if (savedTopics) selectedTopics.value = JSON.parse(savedTopics)
		}
	}

	const saveAll = () => {
		if (process.client) {
			localStorage.setItem('words', JSON.stringify(words.value))
			localStorage.setItem('learnedWords', JSON.stringify(learnedWords.value))
			localStorage.setItem('wrongAnswers', JSON.stringify(wrongAnswers.value))
		}
	}

	const setSelectedTopics = (topics) => {
		selectedTopics.value = topics
		if (process.client) {
			localStorage.setItem('selectedTopics', JSON.stringify(topics))
		}
	}

	const addWord = (word) => {
		if (!words.value.find(w => w.de === word.de)) {
			words.value.push(word)
			saveAll()
		}
	}

	const removeWord = (word) => {
		words.value = words.value.filter(w => w.de !== word.de)
		saveAll()
	}

	const clearWords = () => {
		words.value = []
		saveAll()
	}

	const markAsLearned = (word) => {
		if (!learnedWords.value.find(w => w.de === word.de)) {
			learnedWords.value.push(word)
			saveAll()
		}
	}

	const isLearned = (word) => {
		return learnedWords.value.some(w => w.de === word.de)
	}

	const addWrongAnswers = (word) => {
		if (!wrongAnswers.value.find(w => w.de === word.de)) {
			wrongAnswers.value.push(word)
			saveAll()
		}
	}

	const cleanWrongAnswers = () => {
		wrongAnswers.value = []
		saveAll()
	}

	const clearAll = () => {
		words.value = []
		learnedWords.value = []
		wrongAnswers.value = []
		localStorage.removeItem('words')
		localStorage.removeItem('learnedWords')
		localStorage.removeItem('wrongAnswers')
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
		loadFromLocal,
		clearAll,
		saveAll,
		setSelectedTopics
	}
})
