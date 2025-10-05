import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
    getFirestore, doc, setDoc, onSnapshot, serverTimestamp, increment,
} from 'firebase/firestore'
import { dailyQuests } from '../utils/dailyQuests.js'

export const dailyStore = defineStore('dailyStore', () => {
    const CYCLE_MS = 24 * 60 * 60 * 1000
    const QUESTS_PER_CYCLE = 3
    const SYNC_MS = 30 * 1000
    const LOCAL_KEY_BASE = 'daily_cycle_v2'
    const localKey = () => `${LOCAL_KEY_BASE}_${uid() || 'anon'}`

    const isClient = typeof window !== 'undefined'
    const auth = getAuth()
    const db = getFirestore()

    const nowMs = ref(isClient ? Date.now() : 0)
    const currentCycle = ref(null)
    const cloudReady = ref(false)
    const unsubRef = ref(null)
    const syncing = ref(false)

    let tickTimer = null
    let syncTimer = null
    let visHandler = null
    let debounceId = null

    const counters = ref({
        learnedWords: 0,
        exp: 0,
        points: 0,
        easyStreakBest: 0,
        wrong: 0,
        guessed: 0,
        wordArticleCnt: 0,
        pluralCnt: 0,
        duels: 0,
        marathonMediumBest: 0,
        hardStreakBest: 0,
        audioArticle: 0
    })

    // === ВСПОМОГАТЕЛЬНОЕ: локальная полуночь ===
    function nextLocalMidnightMs(fromMs = Date.now()) {
        const d = new Date(fromMs)
        d.setHours(24, 0, 0, 0) // 00:00 следующего дня (локально)
        return d.getTime()
    }
    function startOfTodayLocalMs(fromMs = Date.now()) {
        const d = new Date(fromMs)
        d.setHours(0, 0, 0, 0) // 00:00 сегодня (локально)
        return d.getTime()
    }

    // === ТАЙМЕР ДО ЛОКАЛЬНОЙ ПОЛУНОЧИ ===
    const msLeft = computed(() => {
        const now = nowMs.value || Date.now()
        const left = nextLocalMidnightMs(now) - now
        return Math.max(0, left)
    })

    // === КЛЮЧ ЦИКЛА ПО ЛОКАЛЬНЫМ СУТКАМ ===
    const cycleKey = computed(() => {
        const startToday = startOfTodayLocalMs(nowMs.value || Date.now())
        return Math.floor(startToday / CYCLE_MS)
    })

    const offset = computed(() => {
        const len = dailyQuests.length || 1
        return (cycleKey.value * QUESTS_PER_CYCLE) % len
    })

    const todayQuests = computed(() => currentCycle.value?.quests || [])
    const toNum = (v, fb = 0) => (Number.isFinite(Number(v)) ? Number(v) : fb)
    const toStr = (v, fb = '—') => (v === undefined || v === null ? fb : String(v))
    const visible = () => !isClient || document.visibilityState === 'visible'
    const online = () => !isClient || navigator.onLine
    const uid = () => auth.currentUser?.uid || null
    const userDocRef = () => (uid() ? doc(db, 'users', uid(), 'daily', 'currentDailyQuests') : null)
    const aggDocRef = () => (uid() ? doc(db, 'users', uid(), 'dailyAgg', 'meta') : null)

    function sanitizeQuest(q, idx) {
        return {
            id: toStr(q?.id ?? `q_${idx}`),
            title: toStr(q?.title ?? q?.name ?? 'Quest'),
            targetValue: Math.max(1, toNum(q?.targetValue ?? 1, 1)),
            currentValue: 0,
            isCompleted: false,
        }
    }
    function wrapSlice(arr, start, count) {
        const len = arr.length
        if (!len) return []
        const end = start + count
        return end <= len ? arr.slice(start, end) : [...arr.slice(start), ...arr.slice(0, end - len)]
    }

    function buildNewCyclePayload(key) {
        counters.value = {
            learnedWords: 0,
            exp: 0,
            points: 0,
            easyStreakBest: 0,
            wrong: 0,
            guessed: 0,
            pluralCnt: 0,
            wordArticleCnt: 0,
            duels: 0,
            marathonMediumBest: 0,
            hardStreakBest: 0,
            audioArticle: 0
        }
        const slice = wrapSlice(dailyQuests, offset.value, QUESTS_PER_CYCLE).map(sanitizeQuest)
        const start = Date.now()
        const expiresAt = nextLocalMidnightMs(start)

        return {
            cycleKey: key,
            quests: slice,
            counters: { ...counters.value },
            completedCount: 0,
            createdAtMs: start,
            expiresAtMs: expiresAt,
            lastUpdatedAtMs: start,
            updatedBy: uid() || 'local',
            owner: uid() || 'anon',
        }
    }


    function loadLocal() {
        if (!isClient) return null
        try {
            const raw = localStorage.getItem(localKey())
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }

    function saveLocal(obj) {
        if (!isClient) return
        try {
            localStorage.setItem(localKey(), JSON.stringify(obj))
        } catch {}
    }

    async function pushCurrentCycleToCloud(payload, merge = false) {
        if (!online()) { saveLocal(payload); return }
        const ref = userDocRef()
        if (!ref) { saveLocal(payload); return }
        await setDoc(ref, {
            ...payload,
            serverUpdatedAt: serverTimestamp(),
            owner: uid(),
        }, { merge })
        saveLocal(payload)
    }
    async function incrementAgg(count) {
        if (!count || !online() || !aggDocRef()) return
        await setDoc(aggDocRef(), {
            totalCompleted: increment(count),
            lastAggAt: serverTimestamp(),
        }, { merge: true })
    }

    function attachCloudListener() {
        if (unsubRef.value || !uid()) return
        const ref = userDocRef()
        if (!ref) return
        unsubRef.value = onSnapshot(ref, (snap) => {
            cloudReady.value = true
            if (!snap.exists()) return
            const data = snap.data()
            if (!data) return
            const local = currentCycle.value
            if (!local || data.cycleKey !== local.cycleKey || Number(data.lastUpdatedAtMs || 0) > Number(local.lastUpdatedAtMs || 0)) {
                currentCycle.value = data
                counters.value = { ...(data.counters || counters.value) }
                saveLocal(data)
            }
        }, () => {
            cloudReady.value = false
        })
    }
    function detachCloudListener() {
        if (unsubRef.value) { unsubRef.value(); unsubRef.value = null }
        cloudReady.value = false
    }

    function ensureLocalCycle() {
        const key = cycleKey.value
        const exist = loadLocal()
        const now = Date.now()

        // если локальный объект не наш — создаём новый цикл для текущего uid/anon
        if (exist && exist.owner && exist.owner !== (uid() || 'anon')) {
            const fresh = buildNewCyclePayload(key)
            currentCycle.value = fresh
            saveLocal(fresh)
            pushCurrentCycleToCloud(fresh, false).catch(() => {})
            return
        }

        if (!exist || exist.cycleKey !== key || now >= Number(exist.expiresAtMs || 0)) {
            const fresh = buildNewCyclePayload(key)
            currentCycle.value = fresh
            saveLocal(fresh)
            pushCurrentCycleToCloud(fresh, false).catch(() => {})
            return
        }

        currentCycle.value = exist
        counters.value = { ...(exist.counters || counters.value) }
    }


    function valueForQuestByCounters(qid) {
        const c = counters.value
        switch (String(qid)) {
            case 'learnWordsArticle':       return c.learnedWords
            case 'learnMoreWordsArticle':   return c.learnedWords
            case 'exp':                     return c.exp
            case 'articles':                return c.points
            case 'streakEasy':              return c.easyStreakBest
            case 'streakMedium':            return c.marathonMediumBest
            case 'guess':                   return c.guessed
            case 'trainWordArticle':        return c.wordArticleCnt
            case 'duel':                    return c.duels
            case 'trainPlural':             return c.pluralCnt
            case 'streakHard':              return c.hardStreakBest
            case 'audioArticle':            return c.audioArticle
            default:                        return 0
        }
    }

    async function recomputeAndPersist() {
        const local = currentCycle.value
        if (!local) return
        let newlyCompleted = 0
        let changed = false

        const nextQuests = (local.quests || []).map(q => {
            const target = Math.max(1, toNum(q.targetValue, 1))
            const rawVal = valueForQuestByCounters(q.id)
            const val = Math.min(Math.max(0, toNum(rawVal, 0)), target)
            const now = val >= target
            const was = !!q.isCompleted
            if (val !== q.currentValue || now !== was) changed = true
            if (now && !was) newlyCompleted++
            return { ...q, currentValue: val, isCompleted: now }
        })

        if (!changed && newlyCompleted === 0) return

        const updated = {
            ...local,
            quests: nextQuests,
            counters: { ...counters.value },
            completedCount: nextQuests.reduce((a, x) => a + (x.isCompleted ? 1 : 0), 0),
            lastUpdatedAtMs: Date.now(),
            updatedBy: uid() || 'local',
        }

        currentCycle.value = updated
        saveLocal(updated)
        await pushCurrentCycleToCloud(updated, true)
        if (newlyCompleted > 0) { try { await incrementAgg(newlyCompleted) } catch {} }
    }

    async function updateProgressFromCounters() {
        if (syncing.value) return
        syncing.value = true
        try {
            ensureLocalCycle()
            const local = currentCycle.value
            if (!local) return

            // если истёк срок (локальная полночь) или сменился ключ дня — старт нового цикла
            if (Date.now() >= Number(local.expiresAtMs || 0) || local.cycleKey !== cycleKey.value) {
                const fresh = buildNewCyclePayload(cycleKey.value)
                currentCycle.value = fresh
                await pushCurrentCycleToCloud(fresh, false)
                return
            }

            await recomputeAndPersist()
        } finally {
            syncing.value = false
        }
    }

    function addLearned(n = 1) { counters.value.learnedWords += n; scheduleDailySync() }
    function addExp(n = 1) { counters.value.exp += n; scheduleDailySync() }
    function addPoints(n = 1) { counters.value.points += n; scheduleDailySync() }
    function addWrong(n = 1) { counters.value.wrong += n; scheduleDailySync() }
    function addGuessed(n = 1) { counters.value.guessed += n; scheduleDailySync() }
    function addWordArticle(n = 1) { counters.value.wordArticleCnt += n; scheduleDailySync() }
    function addDuels(n = 1) { counters.value.duels += n; scheduleDailySync() }
    function addPlural(n = 1) { counters.value.pluralCnt += n; scheduleDailySync() }
    function addAudioArticle(n = 1) { counters.value.audioArticle += n; scheduleDailySync() }
    function noteEasyStreak(streak) {
        if (streak > counters.value.easyStreakBest) {
            counters.value.easyStreakBest = streak
            scheduleDailySync()
        }
    }
    function noteMarathonMediumStreak(streak) {
        if (streak > counters.value.marathonMediumBest) {
            counters.value.marathonMediumBest = streak
            scheduleDailySync()
        }
    }
    function noteHardStreak(streak) {
        if (streak > counters.value.hardStreakBest) {
            counters.value.hardStreakBest = streak
            scheduleDailySync()
        }
    }

    async function markQuestCompleted(questId) {
        ensureLocalCycle()
        const local = { ...(currentCycle.value) }
        if (!local) return
        const idx = (local.quests || []).findIndex(q => String(q.id) === String(questId))
        if (idx < 0 || local.quests[idx].isCompleted) return

        const target = Math.max(1, toNum(local.quests[idx].targetValue, 1))
        local.quests[idx] = { ...local.quests[idx], currentValue: target, isCompleted: true }
        local.completedCount = (local.quests || []).reduce((a, x) => a + (x.isCompleted ? 1 : 0), 0)
        local.lastUpdatedAtMs = Date.now()
        local.updatedBy = uid() || 'local'

        currentCycle.value = local
        saveLocal(local)
        try {
            await pushCurrentCycleToCloud(local, true)
            await incrementAgg(1)
        } catch {}
    }

    function scheduleDailySync() {
        if (debounceId) clearTimeout(debounceId)
        debounceId = setTimeout(() => { debounceId = null; recomputeAndPersist().catch(() => {}) }, 120)
    }

    function startClock() {
        if (!isClient || tickTimer) return
        tickTimer = setInterval(() => {
            nowMs.value = Date.now()
            if (msLeft.value <= 0) updateProgressFromCounters().catch(() => {})
        }, 1000)
    }
    function stopClock() {
        if (tickTimer) clearInterval(tickTimer)
        tickTimer = null
    }

    function startAutoSync() {
        if (!isClient || syncTimer) return
        const tick = () => { if (visible()) updateProgressFromCounters().catch(() => {}) }
        syncTimer = setInterval(tick, SYNC_MS)
        visHandler = () => { if (visible()) updateProgressFromCounters().catch(() => {}) }
        document.addEventListener('visibilitychange', visHandler)
        tick()
    }
    function stopAutoSync() {
        if (syncTimer) clearInterval(syncTimer)
        syncTimer = null
        if (visHandler) {
            document.removeEventListener('visibilitychange', visHandler)
            visHandler = null
        }
    }

    async function init() {
        ensureLocalCycle()
        if (uid()) attachCloudListener()
        await updateProgressFromCounters()
        startClock()
        startAutoSync()

        onAuthStateChanged(auth, () => {
            detachCloudListener()
            if (uid()) {
                attachCloudListener()
                ensureLocalCycle()
                if (currentCycle.value) {
                    pushCurrentCycleToCloud(currentCycle.value, true).catch(() => {})
                }
            } else {
                ensureLocalCycle()
            }
        })
    }


    watch(cycleKey, () => { ensureLocalCycle() })

    return {
        todayQuests,
        msLeft,
        currentCycle,
        cloudReady,
        init,
        start: startClock,
        stop: stopClock,
        startAutoSync,
        stopAutoSync,
        updateProgressFromCounters,
        markQuestCompleted,
        addLearned, addExp, addPoints, addWrong, addGuessed, addWordArticle, addDuels, noteHardStreak, addAudioArticle,
        noteEasyStreak, noteMarathonMediumStreak, addPlural
    }
})
