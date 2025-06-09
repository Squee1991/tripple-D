// store/guessStore.js
import {defineStore} from 'pinia'
import {ref, computed} from 'vue'

export const useGuessWordStore = defineStore('guessWord', () => {
	const answer = ref('')
	const masked = ref([])
	const attempts = ref(15)
	const usedLetters = ref([])
	const win = ref(false)
	const lose = ref(false)
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ'.split('')
	const loadedWords = ref([])
	const currentWordObj = ref(null)

	async function loadWords() {
		if (loadedWords.value.length) return
		const response = await fetch('/words.json')
		const data = await response.json()
		let arr = []
		Object.values(data).forEach(themeArr => {
			arr = arr.concat(themeArr)
		})
		loadedWords.value = arr
	}

	async function startGame() {
		await loadWords()
		const wordObj = loadedWords.value[Math.floor(Math.random() * loadedWords.value.length)]
		currentWordObj.value = wordObj // Сохраняем весь объект слова
		answer.value = wordObj.de.toUpperCase()
		masked.value = Array(answer.value.length).fill('')
		usedLetters.value = []
		attempts.value = 15
		win.value = false
		lose.value = false
	}

	function pickLetter(letter) {
		if (win.value || lose.value || usedLetters.value.includes(letter)) return
		usedLetters.value.push(letter)
		let found = false
		for (let i = 0; i < answer.value.length; i++) {
			if (answer.value[i] === letter) {
				masked.value[i] = letter
				found = true
			}
		}
		if (!found) attempts.value--
		checkGameStatus()
	}

	function tryGuessWord(word) {
		if (win.value || lose.value) return
		if (word.toUpperCase() === answer.value) {
			masked.value = answer.value.split('')
			win.value = true
		} else {
			attempts.value--
			checkGameStatus()
		}
	}

	function checkGameStatus() {
		if (masked.value.join('') === answer.value) win.value = true
		if (attempts.value <= 0 && !win.value) lose.value = true
	}

	const displayMasked = computed(() =>
		masked.value.map(l => (l ? l : '_')).join(' ')
	)

	return {
		answer, masked, attempts, usedLetters, win, lose,
		alphabet, displayMasked,
		currentWordObj,
		startGame, pickLetter, tryGuessWord,
	}
})
