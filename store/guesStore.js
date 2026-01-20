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
    orderBy,
} from 'firebase/firestore'
import { userAuthStore } from './authStore.js'
import { dailyStore } from './dailyStore.js'

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

const guessProgressStateRef = (db, uid) =>
    doc(db, 'users', uid, 'guessProgress', 'state')

async function ensureUserDoc(db, uid, extra = {}) {
    await setDoc(
        doc(db, 'users', uid),
        { uid, updatedAt: Date.now(), ...extra },
        { merge: true }
    )
}
export const useGuessWordStore = defineStore('guessWord', () => {
    const authStore = userAuthStore()
    const db = getFirestore()
    const daily = dailyStore()

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

    const alphabet = 'QWERTZUIOPÜASDFGHJKLÖÄYXCVBNM-'.split('')
    const loadedWords = ref([])
    const currentWordObj = ref(null)

    const guessedCount = computed(() => guessedWords.value.length)
    const displayMasked = computed(() =>
        masked.value.map(l => (l || '_')).join(' ')
    )

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
        guessedWords.value = []
        guessedFastWords.value = []
        guessedOnLastTryWords.value = []
        guessedPerfectWords.value = []
        guessedSafeWords.value = []
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
                    avatar: authStore.avatar || '1.png',
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
        const qy = query(col, orderBy('guessed', 'desc'))
        const snap = await getDocs(qy)
        const list = []
        snap.forEach(docSnap => {
            const data = docSnap.data()
            list.push({
                id: docSnap.id,
                name: data.name,
                guessed: data.guessed,
                avatar: data.avatar || '1.png',
            })
        })
        return list
    }
    async function loadGuessProgress() {
        const user = await getUser()
        resetState()
        if (!user) return
        await ensureUserDoc(db, user.uid, {
            name: authStore.name || null,
            avatar: authStore.avatar || null,
        })
        guessedWords.value = []
        guessedFastWords.value = []
        guessedOnLastTryWords.value = []
        guessedPerfectWords.value = []
        guessedSafeWords.value = []

        const ref = guessProgressStateRef(db, user.uid)
        const snap = await getDoc(ref)
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
        await ensureUserDoc(db, user.uid, {
            name: authStore.name || null,
            avatar: authStore.avatar || null,
        })

        const ref = guessProgressStateRef(db, user.uid)
        try {
            await setDoc(
                ref,
                {
                    guessedWords: guessedWords.value,
                    guessedFastWords: guessedFastWords.value,
                    guessedOnLastTryWords: guessedOnLastTryWords.value,
                    guessedPerfectWords: guessedPerfectWords.value,
                    guessedSafeWords: guessedSafeWords.value,
                    updatedAt: Date.now(),
                },
                { merge: true }
            )
        } catch (e) {
            console.error('Error saving progress:', e)
        }
    }

    async function migrateGuessProgress() {
        const user = await getUser()
        if (!user) return

        await ensureUserDoc(db, user.uid)

        const oldRef = doc(db, 'guessProgress', user.uid)
        const oldSnap = await getDoc(oldRef)
        if (oldSnap.exists()) {
            const data = oldSnap.data()
            await setDoc(
                guessProgressStateRef(db, user.uid),
                { ...data, migratedAt: Date.now() },
                { merge: true }
            )
        }
    }

    async function loadWords() {
        if (loadedWords.value.length) return
        const res = await fetch('/words.json')
        const data = await res.json()
        loadedWords.value = Object.entries(data).flatMap(([themeKey, arr]) =>
            (arr || []).map(w => ({
                ...w,
                theme: w.theme || w.topic || themeKey,
            }))
        )
    }

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
        daily.addGuessWord(1)

        try { daily.addGuessed(1) } catch {}
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
        startGame,
        pickLetter,
        tryGuessWord,
        loadGuessProgress,
        saveGuessProgress,
        migrateGuessProgress,
        loadLeaderboard,
        hasInLeaderboard,

        // computed
        guessedCount,
    }
})
