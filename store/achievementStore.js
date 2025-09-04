import { defineStore } from 'pinia'
import { ref, watch, watchEffect } from 'vue'
// 1) Импорты всех групп достижений
import { overAchievment } from '../src/achieveGroup/overAllAchieve/overallAchievements.js'
import { wordAchievementsGroup } from '../src/achieveGroup/wordGroup/wordAchievements.js'
import { groupedEasyModeAchievements } from '../src/achieveGroup/marathon/easyModeAchievment.js'
import { groupedNormalModeAchievements } from '../src/achieveGroup/marathon/normalModeAchievement.js'
import { groupedHardModeAchievements } from '../src/achieveGroup/marathon/hardModeAchievments.js'
import { listenAchieveGroup } from '../src/achieveGroup/article/listen.js'
import { pluraGroupAchievment } from '../src/achieveGroup/article/plural.js'
import { writeArticleGroupAchievment } from '../src/achieveGroup/article/writeArticle.js'
import { wordPlusArticleAchievment } from '../src/achieveGroup/article/wordPlusArticle.js'
import { assembleWordGroupAchievement } from '../src/achieveGroup/article/wordsFromLetters.js'
import { cpecialGroupAchievment } from '../src/achieveGroup/specialAchieve/specialAchievment.js'

// 2) Сторы-источники
import { userChainStore } from '../store/chainStore.js'
import { userAuthStore } from '../store/authStore.js'
import { useQuestStore } from '../store/questStore.js'
import { userlangStore } from '../store/learningStore.js'
import { useLocalStatGameStore } from '../store/localSentenceStore.js'
import { useCardsStore } from '../store/cardsStore.js'
import { useGameStore } from '../store/marafonStore.js'
import { useGuessWordStore } from '../store/guesStore.js'
import { achievementToAwardMap } from '../src/awards/awardsMap.js'
import { guessAchievment } from '../src/achieveGroup/guessAchieve/guessAchievments.js'

export const useAchievementStore = defineStore('achievementStore', () => {
    // --- 1) Собираем все группы с категорией ---
    const rawGroups = [
        ...wordAchievementsGroup.map(g => ({ category: 'locations', ...g })),
        ...overAchievment.map(g => ({ category: 'over', ...g })),
        ...guessAchievment.map(g => ({ category: 'guess', ...g })),
        ...groupedEasyModeAchievements.map(g => ({ category: 'easy', ...g })),
        ...groupedNormalModeAchievements.map(g => ({ category: 'normal', ...g })),
        ...groupedHardModeAchievements.map(g => ({ category: 'hard', ...g })),
        ...listenAchieveGroup.map(g => ({ category: 'listen', ...g })),
        ...pluraGroupAchievment.map(g => ({ category: 'plural', ...g })),
        ...writeArticleGroupAchievment.map(g => ({ category: 'write', ...g })),
        ...wordPlusArticleAchievment.map(g => ({ category: 'wordArticle', ...g })),
        ...assembleWordGroupAchievement.map(g => ({ category: 'letters', ...g })),
        ...cpecialGroupAchievment.map(g => ({ category: 'special', ...g }))
    ]

    // --- 2) Инициализация групп с currentProgress:0 ---
    const groups = ref(
        rawGroups.map(group => ({
            ...group,
            achievements: group.achievements.map(a => ({
                ...a,
                currentProgress: 0
            }))
        }))
    )

    const lastUnlockedAward = ref(null)
    const lastUnlockedAchievement = ref(null)


    const bootUnlocked = [] // ачивки
    const bootAwards   = [] // награды

    const authStore  = userAuthStore()
    const questStore = useQuestStore()
    const langStore  = userlangStore()
    const statsStore = useLocalStatGameStore()
    const cardStore  = useCardsStore()
    const gameStore  = useGameStore()
    const guessStore = useGuessWordStore()
    const chainStore = userChainStore()
    const popupQueue = ref([])
    const showPopup = ref(false)
    const popupAchievement = ref(null)

    const prevMap = new Map()


    const awardsKey    = () => `awards_shown_v1_${authStore?.uid }`
    const completedKey = () => `achievements_completed_v1_${authStore?.uid }`


    function loadShown () {
        if (!process.client) return new Set()
        try {
            const raw = localStorage.getItem(awardsKey())
            return new Set(raw ? JSON.parse(raw) : [])
        } catch { return new Set() }
    }
    function saveShown (set) {
        if (!process.client) return
        try { localStorage.setItem(awardsKey(), JSON.stringify([...set])) } catch {}
    }
    let shownSet = loadShown()

    function loadCompleted () {
        if (!process.client) return new Set()
        try {
            const raw = localStorage.getItem(completedKey())
            return new Set(raw ? JSON.parse(raw) : [])
        } catch { return new Set() }
    }
    function saveCompleted (set) {
        if (!process.client) return
        try { localStorage.setItem(completedKey(), JSON.stringify([...set])) } catch {}
    }
    let completedSet = loadCompleted()

    // Перезагрузка наборов при смене пользователя
    watch(() => authStore.uid, () => {
        shownSet = loadShown()
        completedSet = loadCompleted()
    })

    const isBooting = ref(true)

    function findById (id) {
        for (const g of groups.value) {
            const ach = g.achievements.find(a => a.id === id)
            if (ach) return ach
        }
        return null
    }

    function showNextPopup () {
        if (!showPopup.value && popupQueue.value.length) {
            popupAchievement.value = popupQueue.value.shift()
            showPopup.value = true
        }
    }

    function closePopup () {
        showPopup.value = false
        showNextPopup()
    }

    function updateProgress (id, val) {
        const ach = findById(id)
        if (!ach) return

        ach.currentProgress = Math.min(val, ach.targetProgress)

        const nowCompleted     = ach.currentProgress >= ach.targetProgress
        const alreadyCompleted = completedSet.has(id)
        const justCompleted    = nowCompleted && !alreadyCompleted

        if (justCompleted) {
            // фиксируем закрытие
            completedSet.add(id)
            saveCompleted(completedSet)

            if (!isBooting.value) {
                // очередь попапов
                popupQueue.value.push(ach)
                showNextPopup()

                // сигнал для тост-плагина
                lastUnlockedAchievement.value = {
                    id: ach.id,
                    title: ach.title,
                    groupTitle: ach.groupTitle || null,
                    ts: Date.now()
                }
                setTimeout(() => {
                    if (lastUnlockedAchievement.value?.id === ach.id) lastUnlockedAchievement.value = null
                }, 0)

                // 🎁 награда (если есть и не показывали)
                const awardTitle = achievementToAwardMap[id]
                if (awardTitle && !shownSet.has(awardTitle)) {
                    shownSet.add(awardTitle)
                    saveShown(shownSet)
                    lastUnlockedAward.value = { title: awardTitle, achId: id, ts: Date.now() }
                    setTimeout(() => {
                        if (lastUnlockedAward.value?.achId === id) lastUnlockedAward.value = null
                    }, 0)

                    // апдейт «Начало коллекции» по количеству наград
                    updateProgress("firstAward", shownSet.size)
                }
            } else {
                // во время boot — копим для реплея
                bootUnlocked.push(ach)
                const awardTitle = achievementToAwardMap[id]
                if (awardTitle && !shownSet.has(awardTitle)) {
                    shownSet.add(awardTitle)
                    saveShown(shownSet)
                    bootAwards.push({ title: awardTitle, achId: id })
                }
            }
        }

        prevMap.set(id, ach.currentProgress)
    }

    // --- 5) Навешиваем watch’еры для всех категорий ---
    function initializeProgressTracking () {
        // 5.1) over
        const baseTrackers = [

            { id: 'registerAchievement', source: () => authStore.uid,                       compute: (u) => (u ? 1 : 0) },
            { id: 'daily',               source: () => questStore.dailyQuestCount,          compute: (v) => v || 0 },
            { id: 'levelUpExp',          source: () => langStore.exp,                       compute: (v) => v || 0 },
            { id: 'grandmaster_sentences', source: () => statsStore.constructedSentences,   compute: (v) => v || 0 },
            { id: 'learned10Words',      source: () => langStore.learnedWords.length,       compute: (v) => v },
            { id: 'learned100Words',     source: () => langStore.learnedWords.length,       compute: (v) => v },
            { id: 'wrong100Answers',     source: () => langStore.wrongAnswers.length,       compute: (v) => v },
            {id: 'SiteRegular', source: () => authStore.registeredAt, compute: (d) => (d ? Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 86400000)) : 0)},
            { id: 'createdCountCard',    source: () => cardStore.createdCount,              compute: (v) => v || 0 },
            { id: 'LastChance',          source: () => gameStore.lastChanceProgress,        compute: (v) => v || 0 },
            { id: 'MarginForError',      source: () => gameStore.marginForErrorProgress,    compute: (v) => v || 0 },
            { id: 'OnTheEdge',           source: () => gameStore.onTheEdgeProgress,         compute: (v) => v || 0 },
            { id: 'firstArticleAward',   source: () => langStore.totalEarnedPoints,         compute: (v) => (v > 0 ? 1 : 0) },
            { id: 'guessFirst',          source: () => guessStore.guessedWords.length,      compute: (v) => v },
            { id: 'guessSecond',         source: () => guessStore.guessedWords.length,      compute: (v) => v },
            { id: 'guessThird',          source: () => guessStore.guessedWords.length,      compute: (v) => v },
            { id: 'guessFourth',         source: () => guessStore.guessedWords.length,      compute: (v) => v },
            { id: 'guessSixHundred',     source: () => guessStore.guessedWords.length,      compute: (v) => v },
        ]

        baseTrackers.forEach(({ id, source, compute }) => {
            watch(source, raw => {
                updateProgress(id, compute(raw))
            }, { immediate: true })
        })

        // 5.2) marathon (easy/normal/hard)
        ;[
            { category: 'easy',   idx: 1 },
            { category: 'normal', idx: 2 },
            { category: 'hard',   idx: 3 },
        ].forEach(({ category, idx }) => {
            watch(() => gameStore.totalCorrectAnswers?.[idx] || 0,
                v => groups.value
                    .filter(g => g.category === category)
                    .forEach(g => g.achievements
                        .filter(a => a.type === 'total')
                        .forEach(a => updateProgress(a.id, v))
                    ),
                { immediate: true }
            )
            watch(() => gameStore.personalBests?.[idx] || 0,
                v => groups.value
                    .filter(g => g.category === category)
                    .forEach(g => g.achievements
                        .filter(a => a.type === 'streak')
                        .forEach(a => updateProgress(a.id, v))
                    ),
                { immediate: true }
            )
        })

        // 5.3) listen
        watch(() => langStore.words.filter(w => w.progress?.audio).length,
            cnt => groups.value
                .filter(g => g.category === 'listen')
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            { immediate: true }
        )

        // 5.4) plural
        watch(() => langStore.words.filter(w => w.progress?.plural).length,
            cnt => groups.value
                .filter(g => g.category === 'plural')
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            { immediate: true }
        )

        // 5.5) write (der/die/das)
        const derCount = () => langStore.words.filter(w => w.article === 'der' && w.progress?.article).length
        const dieCount = () => langStore.words.filter(w => w.article === 'die' && w.progress?.article).length
        const dasCount = () => langStore.words.filter(w => w.article === 'das' && w.progress?.article).length

        watch(derCount,
            cnt => groups.value
                .filter(g => g.category === 'write' && g.title.toLowerCase().includes('der'))
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            { immediate: true }
        )
        watch(dieCount,
            cnt => groups.value
                .filter(g => g.category === 'write' && g.title.toLowerCase().includes('die'))
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            { immediate: true }
        )
        watch(dasCount,
            cnt => groups.value
                .filter(g => g.category === 'write' && g.title.toLowerCase().includes('das'))
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            { immediate: true }
        )

        // 5.6) wordArticle
        watch(() => langStore.words.filter(w => w.progress?.wordArticle).length,
            cnt => groups.value
                .filter(g => g.category === 'wordArticle')
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            { immediate: true }
        )


        if (process.client) {
            chainStore.loadProgressFromFirebase?.().catch(() => {})
        }
        watch(() => chainStore.questProgress, (qpRaw) => {
            const qp = qpRaw || {}
            const entries = Object.values(qp).filter(Boolean)

            const isPerfect = (p) => {
                const correct = Number(p?.correctCount ?? 0)
                const required = Number(p?.requiredTasks ?? 0)
                const wrong = Number(p?.wrongCount ?? p?.errors ?? 0)
                const skipped = Number(p?.skipped ?? 0)
                const partial = Boolean(p?.partial)
                return Boolean(p?.success) && correct === required && wrong === 0 && skipped === 0 && !partial
            }

            const perfect = entries.filter(isPerfect)
            const slugById = (id) => (id === 'eastPlain' ? 'east-plain' : id)
            const countForId = (id) => {
                const slug = slugById(id)

                return perfect.filter(p => p.region === slug).length
            }
            const locationIds =
                groups.value
                    .filter(g => g.category === 'locations')
                    .flatMap(g => g.achievements.map(a => a.id))
                    .filter(id => id !== 'explorer')

            locationIds.forEach((id) => {
                updateProgress(id, countForId(id))
            })

            const targetOf = (id) => {
                const ach = findById(id)
                return ach?.targetProgress ?? 0
            }

            const completedLocations = locationIds.reduce((acc, id) => {
                const cur = countForId(id)
                return acc + (cur >= targetOf(id) ? 1 : 0)
            }, 0)
            updateProgress('explorer', completedLocations)
            const totalCompletedPerfectQuests = locationIds.reduce((acc, id) => acc + countForId(id), 0)
            updateProgress('languageLands50', totalCompletedPerfectQuests)
        }, { immediate: true })

        // 5.7) letters
        watch(() => langStore.words.filter(w => w.progress?.letters).length,
            cnt => groups.value
                .filter(g => g.category === 'letters')
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            { immediate: true }
        )

        // 5.8) special
        watch(() => {
            const t = gameStore.totalCorrectAnswers || []
            return (t[1] || 0) + (t[2] || 0) + (t[3] || 0)
        }, total => updateProgress('totalArticles1000', total), { immediate: true })

        watch(() => langStore.isLeveling,
            lvl => updateProgress('level10', lvl),
            { immediate: true }
        )

        watch(() => statsStore.constructedSentences,
            n => updateProgress('sentences-master', n),
            { immediate: true }
        )

        watch(() => langStore.totalEarnedPoints,
            pts => updateProgress('Hunderd', pts),
            { immediate: true }
        )

        watch(() => langStore.articlesSpentForAchievement,
            spent => updateProgress('ArticlusSpent', spent),
            { immediate: true }
        )

        async function checkLeaderboard () {
            if (!authStore.uid) return
            const levels = [1, 2, 3]
            const ids = ['leaderboardEasy', 'leaderboardNormal', 'leaderboardHard']
            for (let i = 0; i < 3; i++) {
                const lb = await gameStore.loadMarathonLeaderboard(levels[i])
                updateProgress(ids[i], lb.length > 0 && lb[0].id === authStore.uid ? 1 : 0)
            }
        }
        checkLeaderboard()

        watch(() => gameStore.onTheEdgeProgress,
            v => updateProgress('Impuls', v),
            { immediate: true }
        )

        watch(() => authStore.registeredAt, date => {
            if (!date) return
            const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000))
            updateProgress('OneYearVeteran', days)
        }, { immediate: true })

        watchEffect(() => {
            const map = [
                ['guessedFastWords',      guessStore.guessedFastWords.length],
                ['guessedSafeWords',      guessStore.guessedSafeWords.length],
                ['guessedOnLastTryWords', guessStore.guessedOnLastTryWords.length],
                ['guessedPerfectWords',   guessStore.guessedPerfectWords.length]
            ]
            map.forEach(([id, val]) => updateProgress(id, val))
        })

        // Инициал: прогресс «Начало коллекции» равен количеству показанных наград
        updateProgress("firstAward", shownSet.size)

        // ✅ завершаем «бут» и делаем реплей трёх тостов с микро-задержками
        setTimeout(() => {
            isBooting.value = false

            // на всякий случай: актуализируем прогресс «Начало коллекции»
            updateProgress('collectionStart', shownSet.size)

            // 1) «Первый шаг» — ПЕРВЫМ
            const regAch = findById('registerAchievement')
            const completed = regAch && regAch.currentProgress >= (regAch.targetProgress || 1)
            const wasBooted = bootUnlocked.find(a => a && a.id === 'registerAchievement')
            if (wasBooted || completed) {
                lastUnlockedAchievement.value = { id: 'registerAchievement', title: 'Первый шаг', ts: Date.now() }
                setTimeout(() => {
                    if (lastUnlockedAchievement.value?.id === 'registerAchievement') lastUnlockedAchievement.value = null
                }, 0)
            }

            // 2) Награда (например, «Значок участника») — сразу после «Первого шага»
            setTimeout(() => {
                if (bootAwards.length) {
                    const first = bootAwards[0]
                    lastUnlockedAward.value = { ...first, ts: Date.now() }
                    setTimeout(() => {
                        if (lastUnlockedAward.value?.achId === first.achId) lastUnlockedAward.value = null
                    }, 0)
                }
            }, 60)

            // 3) «Начало коллекции» — третьим
            setTimeout(() => {
                if (shownSet.size >= 1) {
                    lastUnlockedAchievement.value = { id: 'collectionStart', title: 'Начало коллекции', ts: Date.now() }
                    setTimeout(() => {
                        if (lastUnlockedAchievement.value?.id === 'collectionStart') lastUnlockedAchievement.value = null
                    }, 0)
                }
            }, 120)
        }, 0)
    }

    watch(lastUnlockedAward, (award) => {
        if (award) updateProgress("firstAward", shownSet.size)
    })

    if (process.client) initializeProgressTracking()

    return {
        groups,
        showPopup,
        popupAchievement,
        lastUnlockedAward,
        lastUnlockedAchievement,
        closePopup,
        initializeProgressTracking,
        updateProgress,
        findById
    }
})
