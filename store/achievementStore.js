import { defineStore } from 'pinia'
import { ref, watch, watchEffect } from 'vue'

// 1) Импорты всех групп достижений
import { overAchievment } from '../src/achieveGroup/overAllAchieve/overallAchievements.js'
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
import { userAuthStore } from '../store/authStore.js'
import { useQuestStore } from '../store/questStore.js'
import { userlangStore } from '../store/learningStore.js'
import { useLocalStatGameStore } from '../store/localSentenceStore.js'
import { useCardsStore } from '../store/cardsStore.js'
import { useGameStore } from '../store/marafonStore.js'
import { useGuessWordStore } from '../store/guesStore.js'

export const useAchievementStore = defineStore('achievementStore', () => {
    // --- 1) Собираем все группы с категорией ---
    const rawGroups = [
        ...overAchievment.map(g => ({ category: 'over', ...g })),
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

    // --- 2) Реактивно инициализируем их, добавляя currentProgress:0 ---
    const groups = ref(
        rawGroups.map(group => ({
            ...group,
            achievements: group.achievements.map(a => ({
                ...a,
                currentProgress: 0
            }))
        }))
    )

    // --- 3) Подключаем сторы-источники ---
    const authStore  = userAuthStore()
    const questStore = useQuestStore()
    const langStore  = userlangStore()
    const statsStore = useLocalStatGameStore()
    const cardStore  = useCardsStore()
    const gameStore  = useGameStore()
    const guessStore = useGuessWordStore()

    // --- 4) Popup-логика ---
    const popupQueue       = ref([])
    const showPopup        = ref(false)
    const popupAchievement = ref(null)
    const prevMap          = new Map()

    function findById(id) {
        for (const g of groups.value) {
            const ach = g.achievements.find(a => a.id === id)
            if (ach) return ach
        }
        return null
    }

    function updateProgress(id, val) {
        const ach = findById(id)
        if (!ach) return
        const prev = prevMap.get(id) || 0
        ach.currentProgress = Math.min(val, ach.targetProgress)
        if (ach.currentProgress >= ach.targetProgress && prev < ach.targetProgress) {
            popupQueue.value.push(ach)
            showNextPopup()
        }
        prevMap.set(id, ach.currentProgress)
    }

    function showNextPopup() {
        if (!showPopup.value && popupQueue.value.length) {
            popupAchievement.value = popupQueue.value.shift()
            showPopup.value = true
        }
    }

    function closePopup() {
        showPopup.value = false
        showNextPopup()
    }

    // --- 5) Навешиваем watch’еры для всех категорий ---
    function initializeProgressTracking() {
        // 5.1) Все «over»-трекеры в одном массиве
        const baseTrackers = [
            { id: 'registerAchievement', source: () => authStore.uid,                    compute: u => u ? 1 : 0 },
            { id: 'daily',               source: () => questStore.dailyQuestCount,       compute: v => v || 0 },
            { id: 'levelUpExp',          source: () => langStore.exp,                   compute: v => v || 0 },
            { id: 'grandmaster_sentences', source: () => statsStore.constructedSentences, compute: v => v || 0 },
            { id: 'learned10Words',      source: () => langStore.learnedWords.length,    compute: v => v },
            { id: 'learned100Words',     source: () => langStore.learnedWords.length,    compute: v => v },
            { id: 'wrong100Answers',     source: () => langStore.wrongAnswers.length,     compute: v => v },
            { id: 'SiteRegular',         source: () => authStore.registeredAt,            compute: d => d
                    ? Math.floor((Date.now() - new Date(d).getTime())/86400000)
                    : 0
            },
            { id: 'createdCountCard',    source: () => cardStore.createdCount,           compute: v => v || 0 },
            { id: 'LastChance',          source: () => gameStore.lastChanceProgress,     compute: v => v || 0 },
            { id: 'MarginForError',      source: () => gameStore.marginForErrorProgress, compute: v => v || 0 },
            { id: 'OnTheEdge',           source: () => gameStore.onTheEdgeProgress,      compute: v => v || 0 },
            { id: 'firstArticleAward',   source: () => langStore.totalEarnedPoints,      compute: v => v || 0 },
            { id: 'guessWordsTotal',     source: () => guessStore.guessedWords.length,   compute: v => v },
            { id: 'guessFast',           source: () => guessStore.guessedFastWords.length, compute: v => v },
            { id: 'guessSafe',           source: () => guessStore.guessedSafeWords.length, compute: v => v },
            { id: 'guessOnLastTry',      source: () => guessStore.guessedOnLastTryWords.length, compute: v => v },
            { id: 'guessPerfect',        source: () => guessStore.guessedPerfectWords.length,  compute: v => v },
        ]

        baseTrackers.forEach(({id, source, compute}) => {
            watch(source, raw => {
                const val = compute(raw)
                updateProgress(id, val)
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

        // 5.7) letters
        watch(() => langStore.words.filter(w => w.progress?.letters).length,
            cnt => groups.value
                .filter(g => g.category === 'letters')
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            { immediate: true }
        )

        // 5.8) special (доп. метрики из cpecialGroupAchievment)
        // 5.8.1) общее число правильных ответов
        watch(() => {
            const t = gameStore.totalCorrectAnswers || []
            return (t[1]||0) + (t[2]||0) + (t[3]||0)
        }, total => updateProgress('totalArticles1000', total), { immediate: true })

        // 5.8.2) уровень
        watch(() => langStore.isLeveling,
            lvl => updateProgress('level10', lvl),
            { immediate: true }
        )

        // 5.8.3) предложения
        watch(() => statsStore.constructedSentences,
            n => updateProgress('sentences-master', n),
            { immediate: true }
        )

        // 5.8.4) очки
        watch(() => langStore.totalEarnedPoints,
            pts => updateProgress('Hunderd', pts),
            { immediate: true }
        )

        // 5.8.5) потраченные статьи
        watch(() => langStore.articlesSpentForAchievement,
            spent => updateProgress('Articlus', spent),
            { immediate: true }
        )

        // 5.8.6) лидерборды
        async function checkLeaderboard() {
            if (!authStore.uid) return
            const levels = [1,2,3]
            const ids    = ['leaderboardEasy','leaderboardNormal','leaderboardHard']
            for (let i = 0; i < 3; i++) {
                const lb = await gameStore.loadMarathonLeaderboard(levels[i])
                updateProgress(ids[i], lb.length > 0 && lb[0].id === authStore.uid ? 1 : 0)
            }
        }
        checkLeaderboard()

        // 5.8.7) onTheEdge
        watch(() => gameStore.onTheEdgeProgress,
            v => updateProgress('Impuls', v),
            { immediate: true }
        )

        // 5.8.8) дата регистрации — OneYearVeteran
        watch(() => authStore.registeredAt, date => {
            if (!date) return
            const days = Math.floor((Date.now() - new Date(date)) / 86400000)
            updateProgress('OneYearVeteran', days)
        }, { immediate: true })

        // 5.8.9) угадывание слов
        watchEffect(() => {
            const map = [
                ['guessedFastWords',      guessStore.guessedFastWords.length],
                ['guessedSafeWords',      guessStore.guessedSafeWords.length],
                ['guessedOnLastTryWords', guessStore.guessedOnLastTryWords.length],
                ['guessedPerfectWords',   guessStore.guessedPerfectWords.length]
            ]
            map.forEach(([id, val]) => updateProgress(id, val))
        })
    }

    // Запускаем трекинг только в клиенте
    if (process.client) initializeProgressTracking()

    return {
        groups,
        showPopup,
        popupAchievement,
        closePopup,
        initializeProgressTracking,
        updateProgress,
        findById
    }
})
