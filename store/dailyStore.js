import {defineStore} from 'pinia'
import {ref, computed, watch} from 'vue'
import {dailyQuests} from '../utils/dailyQuests.js'
import {userlangStore} from '../store/learningStore.js'
import {useGuessWordStore} from '../store/guesStore.js'

export const dailyStore = defineStore('dailyStore', () => {
    const QUESTS_PER_DAY = 3
    const DAY_MS = 24 * 60 * 60 * 1000
    const isClient = typeof window !== 'undefined'
    const langStore = userlangStore()
    const guessStore = useGuessWordStore()
    const DEBUG_DAILY_MINUTE = true
    const CYCLE_MS = DEBUG_DAILY_MINUTE ? 60_000 : DAY_MS

    // ---- helpers --------------------------------------------------------------
    function wrapSlice(arr, start, count) {
        const len = arr.length
        if (!len) return []
        const end = (start + count)
        return end <= len
            ? arr.slice(start, end)
            : [...arr.slice(start), ...arr.slice(0, end - len)]
    }

    const nowMs = ref(Date.now())
    let timerId = null

    function start() {
        if (!isClient) return
        if (timerId) return
        ensureBaselineForToday()
        timerId = setInterval(() => {
            nowMs.value = Date.now()
        }, 1000)
    }

    function stop() {
        if (!isClient) return
        if (timerId) clearInterval(timerId)
        timerId = null
    }

    const dayIndex = computed(() => {
        const d = new Date(nowMs.value)
        const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate())
        return Math.floor(midnight.getTime() / CYCLE_MS)
    })

    // ---- baseline: значения на начало дня ------------------------------------
    const BASELINE_KEY = 'daily_baseline_v1'
    const baseline = ref({
        learnedWords: 0,
        totalEarnedPoints: 0,
        lettersDone: 0,
        wordArticleDone: 0,
        audioDone: 0,
        bestStreakAnyMode: 0,
        bestStreakEasyArticle: 0,
        duelsPlayed: 0,
        points: 0,
        guessedCount: 0,
        wrongAnswers: 0
    })

    function countMode(modeKey) {
        return (langStore.words || []).filter(w => w?.progress?.[modeKey] === true).length
    }

    function currentCounters() {
        return {
            learnedWords: (langStore.learnedWords || []).length,
            totalEarnedPoints: langStore.totalEarnedPoints || 0,
            guessedCount: guessStore.guessedCount || 0,
            lettersDone: countMode('letters'),
            wordArticleDone: countMode('wordArticle'),
            audioDone: countMode('audio'),
            // Теперь эти значения берутся из langStore.js
            bestStreakAnyMode: langStore.bestStreakAnyMode || 0,
            bestStreakEasyArticle: langStore.bestStreakEasyArticle || 0,
            duelsPlayed: langStore.duelsPlayed || 0,
            wrongAnswers: langStore.wrongAnswers || 0
        }
    }

    function ensureBaselineForToday() {
        if (!isClient) return
        const all = JSON.parse(localStorage.getItem(BASELINE_KEY) || '{}')
        const key = String(dayIndex.value)
        if (!all[key]) {
            all[key] = currentCounters()
            localStorage.setItem(BASELINE_KEY, JSON.stringify(all))
        }
        baseline.value = all[key]
    }

    function updateBaselinePatch(patch) {
        if (!isClient) return
        const all = JSON.parse(localStorage.getItem(BASELINE_KEY) || '{}')
        const key = String(dayIndex.value)
        all[key] = {...(all[key] || currentCounters()), ...patch}
        localStorage.setItem(BASELINE_KEY, JSON.stringify(all))
        baseline.value = all[key]
    }

    watch(dayIndex, () => {
        ensureBaselineForToday()
    })

    // ---- вычисление прогресса по ID квеста -----------------------------------
    function getCurrentValueForQuestId(id) {
        const learnedDelta = Math.max(0, (langStore.learnedWords?.length || 0) - (baseline.value.learnedWords || 0))
        const bestStreakAnyModeDelta = Math.max(0, (langStore.bestStreakAnyMode || 0) - (baseline.value.bestStreakAnyMode || 0))
        const pointsDelta = Math.max(0, (langStore.totalEarnedPoints || 0) - (baseline.value.totalEarnedPoints || 0))
        const points = Math.max(0, langStore.points || 0) - (baseline.value.points || 0)
        const lettersDelta = Math.max(0, countMode('letters') - (baseline.value.lettersDone || 0))
        const wordArticleDelta = Math.max(0, countMode('wordArticle') - (baseline.value.wordArticleDone || 0))
        const guessWordsDelta = Math.max(0, (guessStore.guessedCount || 0) - (baseline.value.guessedCount || 0))
        const wrongAnswerDelta = Math.max(0, (langStore.wrongAnswers || 0) - (baseline.value.wrongAnswers || 0))


        switch (id) {
            case 1:
                return learnedDelta
            case 2:
                return pointsDelta
            case 3:
                return points
            case 4:
                return langStore.bestStreakAnyMode
            case 5:
                return langStore.wrongAnswers
            case 6:
                return guessWordsDelta
            case 7:
                return wordArticleDelta
            case 8:
                return langStore.duelsPlayed
            case 9:
                return langStore.bestStreakEasyArticle
            case 16:
                return guessWordsDelta
            default:
                return 0
        }
    }

    const offset = computed(() => {
        const len = dailyQuests.length || 1
        return (dayIndex.value * QUESTS_PER_DAY) % len
    })

    const todayQuests = computed(() => {
        const slice = wrapSlice(dailyQuests, offset.value, QUESTS_PER_DAY)
        return slice.map(q => {
            const target = Math.max(1, Number(q.targetValue ?? 0))
            const raw = Number(getCurrentValueForQuestId(q.id) ?? 0)
            const currentValue = Math.min(Math.max(0, raw), target)
            return {
                ...q,
                targetValue: target,
                currentValue,
                isCompleted: currentValue >= target
            }
        })
    })

    const msLeft = computed(() => {
        const d = new Date(nowMs.value)
        const nextMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime()
        return Math.max(0, nextMidnight - nowMs.value)
    })

    return {
        start, stop,
        todayQuests, msLeft
    }
})