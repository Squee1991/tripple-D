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
import { userlangStore } from './learningStore.js'
import {
    DAILY_WORD_COINS,
    getTodayKey,
    getYesterdayKey,
    pickDailyWord,
    getLetterMarks,
} from '../utils/dailyWord.js'

// Жизней на слово. От этого числа зависят достижения «без ошибок», «с запасом» и «на последней попытке»
const MAX_ATTEMPTS = 15

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

export const useGuessWordStore = defineStore('guessWord', () => {
    const authStore = userAuthStore()
    const db = getFirestore()
    const daily = dailyStore()
    const langStore = userlangStore()

    const answer = ref('')
    const masked = ref([])
    const attempts = ref(MAX_ATTEMPTS)
    const usedLetters = ref([])

    const guessedWords = ref([])
    const guessedFastWords = ref([])
    const guessedOnLastTryWords = ref([])
    const guessedPerfectWords = ref([])
    const guessedSafeWords = ref([])

    const win = ref(false)
    const lose = ref(false)

    // Слово дня: результат сегодняшней попытки и серия дней с отгаданным словом
    const isDailyMode = ref(false)
    const dailyResult = ref(null)
    const dailyStreak = ref(0)
    const dailyBestStreak = ref(0)
    const dailyLastWinDate = ref('')
    const dailyUpdatedAt = ref(0)

    const isDailyPlayedToday = computed(() => dailyResult.value?.date === getTodayKey())
    // Серия жива, если последнее слово дня отгадано сегодня или вчера
    const currentDailyStreak = computed(() =>
        [getTodayKey(), getYesterdayKey()].includes(dailyLastWinDate.value) ? dailyStreak.value : 0
    )

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
        attempts.value = MAX_ATTEMPTS
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
        dailyResult.value = null
        dailyStreak.value = 0
        dailyBestStreak.value = 0
        dailyLastWinDate.value = ''
        dailyUpdatedAt.value = 0
    }

    // Слово дня хранится и в браузере: попытка не теряется без сети и у гостя
    const dailyStorageKey = (name) => `guess_daily_${name}_${authStore.uid || 'guest'}`

    function readDailyLocal(name) {
        try { return JSON.parse(localStorage.getItem(dailyStorageKey(name)) || 'null') } catch { return null }
    }

    function writeDailyLocal(name, value) {
        try {
            if (value === null) localStorage.removeItem(dailyStorageKey(name))
            else localStorage.setItem(dailyStorageKey(name), JSON.stringify(value))
        } catch {}
    }

    function getDailyState() {
        return {
            result: dailyResult.value,
            streak: dailyStreak.value,
            bestStreak: dailyBestStreak.value,
            lastWinDate: dailyLastWinDate.value,
            updatedAt: dailyUpdatedAt.value,
        }
    }

    // Берём более свежее состояние — из браузера или из облака
    function applyDailyState(state) {
        if (!state || Number(state.updatedAt || 0) < dailyUpdatedAt.value) return
        dailyResult.value = state.result || null
        dailyStreak.value = Number(state.streak || 0)
        dailyBestStreak.value = Number(state.bestStreak || 0)
        dailyLastWinDate.value = state.lastWinDate || ''
        dailyUpdatedAt.value = Number(state.updatedAt || 0)
    }

    // Начатая сегодня попытка — чтобы нельзя было перезапустить слово дня, закрыв игру
    function saveDailyProgress() {
        if (!isDailyMode.value || win.value || lose.value) return
        writeDailyLocal('progress', {
            date: getTodayKey(),
            answer: answer.value,
            usedLetters: usedLetters.value,
            attempts: attempts.value,
            startedAt: timeStarted.value,
        })
    }

    function hasDailyInProgress() {
        return readDailyLocal('progress')?.date === getTodayKey()
    }

    function finishDailyWord(isWin) {
        if (!isDailyMode.value || isDailyPlayedToday.value) return
        const todayKey = getTodayKey()
        if (isWin) {
            const isStreakContinued = dailyLastWinDate.value === getYesterdayKey()
            dailyStreak.value = isStreakContinued ? dailyStreak.value + 1 : 1
            dailyLastWinDate.value = todayKey
            dailyBestStreak.value = Math.max(dailyBestStreak.value, dailyStreak.value)
        } else {
            dailyStreak.value = 0
        }
        dailyResult.value = {
            date: todayKey,
            word: answer.value,
            isWin,
            attemptsLeft: isWin ? attempts.value : 0,
            timeSpent: timeSpent.value ?? 0,
            marks: getLetterMarks(usedLetters.value, answer.value),
        }
        dailyUpdatedAt.value = Date.now()
        writeDailyLocal('progress', null)
        writeDailyLocal('state', getDailyState())
    }

    async function addCoinReward(coins = 1) {
        if (typeof langStore.addPoints === 'function') {
            await langStore.addPoints(coins)
        } else {
            langStore.points = Number(langStore.points || 0) + coins
            langStore.totalEarnedPoints = Number(langStore.totalEarnedPoints || 0) + coins
            try { daily.addPoints(coins) } catch {}
            if (typeof langStore.saveToFirebase === 'function') {
                await langStore.saveToFirebase()
            }
        }
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
        try {
            const snap = await getDoc(doc(db, 'leaderboard_guess', user.uid))
            return snap.exists()
        } catch (e) {
            return false
        }
    }

    async function loadLeaderboard() {
        try {
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
        } catch (e) {
            console.error('Error loading leaderboard:', e)
            return []
        }
    }

    async function loadGuessProgress() {
        const user = await getUser()
        resetState()
        applyDailyState(readDailyLocal('state'))
        if (!user) return

        try {
            const refDoc = guessProgressStateRef(db, user.uid)
            const snap = await getDoc(refDoc)
            if (snap.exists()) {
                const data = snap.data()
                if (Array.isArray(data.guessedWords)) guessedWords.value = data.guessedWords
                if (Array.isArray(data.guessedFastWords)) guessedFastWords.value = data.guessedFastWords
                if (Array.isArray(data.guessedOnLastTryWords)) guessedOnLastTryWords.value = data.guessedOnLastTryWords
                if (Array.isArray(data.guessedPerfectWords)) guessedPerfectWords.value = data.guessedPerfectWords
                if (Array.isArray(data.guessedSafeWords)) guessedSafeWords.value = data.guessedSafeWords
                applyDailyState(data.dailyWord)
            }
        } catch (e) {
            console.error('Error loading guess progress:', e)
        }
    }

    async function saveGuessProgress() {
        const user = await getUser()
        if (!user) return

        const refDoc = guessProgressStateRef(db, user.uid)
        try {
            await setDoc(
                refDoc,
                {
                    guessedWords: guessedWords.value,
                    guessedFastWords: guessedFastWords.value,
                    guessedOnLastTryWords: guessedOnLastTryWords.value,
                    guessedPerfectWords: guessedPerfectWords.value,
                    guessedSafeWords: guessedSafeWords.value,
                    dailyWord: getDailyState(),
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

        try {
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
        } catch (e) {
            console.error('Error migrating progress:', e)
        }
    }

    async function loadWords() {
        if (loadedWords.value.length) return
        try {
            const res = await fetch('/words.json')
            const data = await res.json()
            loadedWords.value = Object.entries(data).flatMap(([themeKey, arr]) =>
                (arr || []).map(w => ({
                    ...w,
                    theme: w.theme || w.topic || themeKey,
                }))
            )
        } catch (e) {
            console.error('Error loading words:', e)
        }
    }

    async function startGame() {
        isDailyMode.value = false
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
        attempts.value = MAX_ATTEMPTS
        win.value = false
        lose.value = false
        timeStarted.value = Date.now()
        timeFinished.value = null
    }

    // Слово дня: всем одно и то же слово, одна попытка. Возвращает false, если сегодня уже сыграно
    async function startDailyGame() {
        await loadWords()
        await loadGuessProgress()
        if (isDailyPlayedToday.value) return false
        const choice = pickDailyWord(loadedWords.value, alphabet, getTodayKey())
        if (!choice) return false

        isDailyMode.value = true
        currentWordObj.value = choice
        answer.value = choice.de.toUpperCase()
        masked.value = Array(answer.value.length).fill('')
        usedLetters.value = []
        attempts.value = MAX_ATTEMPTS
        win.value = false
        lose.value = false
        timeStarted.value = Date.now()
        timeFinished.value = null

        // Продолжаем попытку, начатую сегодня
        const savedProgress = readDailyLocal('progress')
        if (savedProgress?.date === getTodayKey() && savedProgress.answer === answer.value) {
            usedLetters.value = [...savedProgress.usedLetters]
            usedLetters.value.forEach(revealLetter)
            attempts.value = savedProgress.attempts
            timeStarted.value = savedProgress.startedAt || Date.now()
        }
        saveDailyProgress()
        return true
    }

    // Открывает букву в слове. Возвращает true, если она там есть
    function revealLetter(letter) {
        let found = false
        answer.value.split('').forEach((ch, i) => {
            if (ch === letter) {
                masked.value[i] = letter
                found = true
            }
        })
        return found
    }

    function pickLetter(letter) {
        if (win.value || lose.value || usedLetters.value.includes(letter)) return
        usedLetters.value.push(letter)
        if (!revealLetter(letter)) attempts.value--
        checkGameStatus()
        saveDailyProgress()
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
        saveDailyProgress()
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
        const isDailyWin = isDailyMode.value
        if (isDailyWin) finishDailyWord(true)
        const word = answer.value
        if (!guessedWords.value.includes(word)) {
            guessedWords.value.push(word)
            if (timeSpent.value !== null && timeSpent.value <= 20 && !guessedFastWords.value.includes(word)) guessedFastWords.value.push(word)
            if (attempts.value >= 10 && !guessedSafeWords.value.includes(word)) guessedSafeWords.value.push(word)
            if (attempts.value === MAX_ATTEMPTS && !guessedPerfectWords.value.includes(word)) guessedPerfectWords.value.push(word)
            if (attempts.value === 1 && !guessedOnLastTryWords.value.includes(word)) guessedOnLastTryWords.value.push(word)
        }
        daily.addGuessWord(1)

        try { daily.addGuessed(1) } catch {}

        // 1 монета за отгаданное слово, за слово дня — больше
        await addCoinReward(isDailyWin ? DAILY_WORD_COINS : 1)

        await saveGuessProgress()
        if (authStore.name) await saveToLeaderboard(authStore.name, guessedWords.value.length)
    })

    watch(lose, async lost => {
        if (!lost || !isDailyMode.value) return
        finishDailyWord(false)
        await saveGuessProgress()
    })

    watch(() => authStore.initialized, (isReady) => {
        if (isReady && authStore.uid) {
            loadGuessProgress()
        } else if (!authStore.uid) {
            resetState()
        }
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
        guessedCount,
        maxAttempts: MAX_ATTEMPTS,
        isDailyMode,
        dailyResult,
        dailyBestStreak,
        currentDailyStreak,
        isDailyPlayedToday,
        hasDailyInProgress,
        startDailyGame,
    }
})