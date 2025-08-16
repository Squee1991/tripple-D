import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection,
    query,
    orderBy
} from 'firebase/firestore'
import { userAuthStore } from './authStore.js'
import { useAchievementStore } from './achievementStore.js'

async function getUser() {
    const auth = getAuth()
    if (auth.currentUser) return auth.currentUser
    return new Promise(resolve => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            unsubscribe()
            resolve(user)
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
    const guessedFastWords = ref([])
    const guessedOnLastTryWords = ref([])
    const guessedPerfectWords = ref([])
    const guessedSafeWords = ref([])
    const win = ref(false)
    const lose = ref(false)
    const timeStarted = ref(null)
    const timeFinished = ref(null)
    const timeSpent = computed(() =>
        timeStarted.value && timeFinished.value
            ? Math.floor((timeFinished.value - timeStarted.value) / 1000)
            : null
    )

    const alphabet = 'QWERTZUIOPÜASDFGHJKLÖÄYXCVBNM'.split('')
    const loadedWords = ref([])
    const currentWordObj = ref(null)

    function resetState() {
        answer.value = ''
        masked.value = []
        attempts.value = 15
        usedLetters.value = []
        win.value = false
        lose.value = false
        currentWordObj.value = null
        timeStarted.value = null
        timeFinished.value = null
    }

    async function saveToLeaderboard(name, count) {
        const user = await getUser()
        if (!user || count === 0) return
        try {
            await setDoc(
                doc(db, 'leaderboard_guess', user.uid),
                {
                    name,
                    guessed: count,
                    updatedAt: Date.now(),
                    avatar: authStore.avatar || '1.png'
                },
                { merge: true }
            )
        } catch (e) {
            console.error('Error saving leaderboard:', e)
        }
    }

    async function hasInLeaderboard() {
        const user = await getUser()
        if (!user) return false
        const snap = await getDoc(doc(db, 'leaderboard_guess', user.uid))
        return snap.exists()
    }

    async function loadLeaderboard() {
        const col = collection(db, 'leaderboard_guess')
        const q = query(col, orderBy('guessed', 'desc'))
        const snap = await getDocs(q)
        const list = []
        snap.forEach(docSnap => {
            const data = docSnap.data()
            list.push({
                id: docSnap.id,
                name: data.name,
                guessed: data.guessed,
                avatar: data.avatar || '1.png'
            })
        })
        return list
    }

    async function loadGuessProgress() {
        const user = await getUser()
        resetState()
        if (!user) return
        const snap = await getDoc(doc(db, 'guessProgress', user.uid))
        if (snap.exists()) {
            const data = snap.data()
            if (Array.isArray(data.guessedWords)) guessedWords.value = data.guessedWords
            if (Array.isArray(data.guessedFastWords)) guessedFastWords.value = data.guessedFastWords
            if (Array.isArray(data.guessedOnLastTryWords)) guessedOnLastTryWords.value = data.guessedOnLastTryWords
            if (Array.isArray(data.guessedPerfectWords)) guessedPerfectWords.value = data.guessedPerfectWords
            if (Array.isArray(data.guessedSafeWords)) guessedSafeWords.value = data.guessedSafeWords
        }
    }

    async function saveGuessProgress() {
        const user = await getUser()
        if (!user) return
        try {
            await setDoc(
                doc(db, 'guessProgress', user.uid),
                {
                    guessedWords: guessedWords.value,
                    guessedFastWords: guessedFastWords.value,
                    guessedOnLastTryWords: guessedOnLastTryWords.value,
                    guessedPerfectWords: guessedPerfectWords.value,
                    guessedSafeWords: guessedSafeWords.value
                },
                { merge: true }
            )
        } catch (e) {
            console.error('Error saving progress:', e)
        }
    }

    async function loadWords() {
        if (loadedWords.value.length) return
        const res = await fetch('/words.json')
        const data = await res.json()
        loadedWords.value = Object.values(data).flat()
    }

    // ---- Game Flow ----
    async function startGame() {
        await loadWords()
        await loadGuessProgress()
        const pool = loadedWords.value.filter(
            w => !guessedWords.value.includes(w.de.toUpperCase())
        )
        if (!pool.length) {
            alert('Поздравляем! Вы отгадали все слова!')
            return
        }
        const choice = pool[Math.floor(Math.random() * pool.length)]
        currentWordObj.value = choice
        answer.value = choice.de.toUpperCase()
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
        answer.value.split('').forEach((ch, i) => {
            if (ch === letter) {
                masked.value[i] = letter
                found = true
            }
        })
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

    const displayMasked = computed(() => masked.value.map(l => (l || '_')).join(' '))
    watch(win, async won => {
        if (!won || !answer.value) return
        const word = answer.value
        if (!guessedWords.value.includes(word)) {
            guessedWords.value.push(word)
            if (timeSpent.value !== null && timeSpent.value <= 20 && !guessedFastWords.value.includes(word)) guessedFastWords.value.push(word)
            if (attempts.value >= 10 && !guessedSafeWords.value.includes(word)) guessedSafeWords.value.push(word)
            if (attempts.value === 15 && !guessedPerfectWords.value.includes(word)) guessedPerfectWords.value.push(word)
            if (attempts.value === 1 && !guessedOnLastTryWords.value.includes(word)) guessedOnLastTryWords.value.push(word)
        }
        await saveGuessProgress()
        if (authStore.name) await saveToLeaderboard(authStore.name, guessedWords.value.length)
    })

    watch(() => authStore.uid, newUid => {
        if (newUid) loadGuessProgress()
        else resetState()
    }, { immediate: true })

    return {
        answer,
        masked,
        attempts,
        usedLetters,
        win,
        lose,
        alphabet,
        currentWordObj,
        loadedWords,
        timeStarted,
        timeFinished,
        timeSpent,
        displayMasked,
        guessedWords,
        guessedFastWords,
        guessedOnLastTryWords,
        guessedPerfectWords,
        guessedSafeWords,

        // actions
        startGame,
        pickLetter,
        tryGuessWord,
        loadGuessProgress,
        saveGuessProgress,
        loadLeaderboard,
        hasInLeaderboard
    }
})
