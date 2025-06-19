// store/guesStore.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc , getDocs, collection } from 'firebase/firestore'
import { userAuthStore } from './authStore.js'
async function getUser() {
	const auth = getAuth()
	if (auth.currentUser) return auth.currentUser
	return new Promise(resolve => {
		const unsub = onAuthStateChanged(auth, u => {
			unsub()
			resolve(u)
		})
	})
}

export const useGuessWordStore = defineStore('guessWord', () => {
	const authStore = userAuthStore()
	const db = getFirestore()
	const answer = ref('')
	const masked = ref([])
	const attempts = ref(15)
	const usedLetters = ref([])
	const guessedWords = ref([])
	const win = ref(false)
	const lose = ref(false)
	const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ'.split('')
	const loadedWords = ref([])
	const currentWordObj = ref(null)


	const timeStarted = ref(null)
	const timeFinished = ref(null)
	const timeSpent = computed(() =>
		timeStarted.value && timeFinished.value
			? Math.floor((timeFinished.value - timeStarted.value) / 1000)
			: null
	)

	async function saveToLeaderboard(name, count) {
		const user = await getUser()
		if (!user || count === 0) return
		console.log('[saveToLeaderboard] Попытка сохранить: имя=', name, 'количество=', count, 'UID=', user.uid);
		try {
			await setDoc(
				doc(db, 'leaderboard', user.uid),
				{ name, guessed: count, updatedAt: Date.now() },
				{ merge: true }
			)
			console.log('Успешно ');
		} catch (error) {
			console.error('ОШИБКА', error);
		}
	}

	async function hasInLeaderboard() {
		const user = await getUser()
		if (!user) return false
		const snap = await getDoc(doc(db, 'leaderboard', user.uid))
		return snap.exists()
	}

	async function loadLeaderboard() {
		const snap = await getDocs(collection(db, 'leaderboard'))
		const arr = []
		snap.forEach(d => arr.push(d.data()))
		arr.sort((a, b) => b.guessed - a.guessed)
		return arr
	}

	async function loadGuessProgress() {
		const user = await getUser()
		if (!user) return
		const snap = await getDoc(doc(db, 'guessProgress', user.uid))
		if (snap.exists()) {
			const data = snap.data()
			if (Array.isArray(data.guessedWords)) {
				guessedWords.value = data.guessedWords
			}
		}
	}


	async function saveGuessProgress() {
		const user = await getUser()
		console.log('[guessStore] saveGuessProgress called, user =', user)
		console.log('[guessStore] guessedWords =', guessedWords.value)
		if (!user) {
			return
		}
		try {
			await setDoc(
				doc(db, 'guessProgress', user.uid),
				{ guessedWords: guessedWords.value },
				{ merge: true }
			)

		} catch (e) {

		}
	}

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
		await loadGuessProgress()
		const pool = loadedWords.value.filter(
			w => !guessedWords.value.includes(w.de.toUpperCase())
		)
		if (!pool.length) {
			console.log('[guessStore] all words guessed!')
			return
		}
		const wordObj = pool[Math.floor(Math.random() * pool.length)]
		currentWordObj.value = wordObj
		answer.value = wordObj.de.toUpperCase()
		masked.value = Array(answer.value.length).fill('')
		usedLetters.value = []
		attempts.value = 15
		win.value = false
		lose.value = false
		timeStarted.value = Date.now()
		timeFinished.value = null
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
			timeFinished.value = Date.now()
		} else {
			attempts.value--
			checkGameStatus()
		}
	}

	function checkGameStatus() {
		if (masked.value.join('') === answer.value) {
			win.value = true
			timeFinished.value = Date.now()
		}
		if (attempts.value <= 0 && !win.value) {
			lose.value = true
			timeFinished.value = Date.now()
		}
	}

	const displayMasked = computed(() =>
		masked.value.map(l => (l ? l : '_')).join(' ')
	)

	watch(win, async w => {
		console.log('[watch win] win changed →', w)
		if (w && answer.value) {
			const word = answer.value
			if (!guessedWords.value.includes(word)) {
				console.log('[watch win] pushing word →', word)
				guessedWords.value.push(word)
				await saveGuessProgress()
				// ВАЖНО: сразу после прогресса пишем в лидерборд
				console.log('[watch win] about to call saveToLeaderboard, authStore.name=', authStore.name)
				if (authStore.name) {
					await saveToLeaderboard(authStore.name, guessedWords.value.length)
				} else {
					console.warn('[watch win] authStore.name пустой!')
				}
			}
		}
	})

	return {
		answer, masked, attempts, usedLetters, win, lose,
		alphabet, displayMasked, guessedWords,
		currentWordObj,
		startGame, pickLetter, tryGuessWord,
		loadGuessProgress, saveGuessProgress,
		timeStarted, timeFinished, timeSpent,  saveToLeaderboard,
		loadLeaderboard, hasInLeaderboard
	}
})
