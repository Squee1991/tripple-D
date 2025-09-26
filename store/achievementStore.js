import {defineStore} from 'pinia'
import {ref, watch, watchEffect} from 'vue'
import {getFirestore, doc, onSnapshot} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import { useUiSettingsStore } from '../store/uiSettingsStore'

// 1) Импорты всех групп достижений
import {overAchievment} from '../src/achieveGroup/overAllAchieve/overallAchievements.js'
import {wordAchievementsGroup} from '../src/achieveGroup/wordGroup/wordAchievements.js'
import {groupedEasyModeAchievements} from '../src/achieveGroup/marathon/easyModeAchievment.js'
import {groupedNormalModeAchievements} from '../src/achieveGroup/marathon/normalModeAchievement.js'
import {groupedHardModeAchievements} from '../src/achieveGroup/marathon/hardModeAchievments.js'
import {listenAchieveGroup} from '../src/achieveGroup/article/listen.js'
import {pluraGroupAchievment} from '../src/achieveGroup/article/plural.js'
import {writeArticleGroupAchievment} from '../src/achieveGroup/article/writeArticle.js'
import {wordPlusArticleAchievment} from '../src/achieveGroup/article/wordPlusArticle.js'
import {assembleWordGroupAchievement} from '../src/achieveGroup/article/wordsFromLetters.js'
import {cpecialGroupAchievment} from '../src/achieveGroup/specialAchieve/specialAchievment.js'
import {prepositionsNominativ} from '../src/achieveGroup/prepositions/prepNominativ.js'
import {prepositionsAkkusativ} from '../src/achieveGroup/prepositions/prepAkkusativ.js'
import {prepositionsGenitiv} from '../src/achieveGroup/prepositions/prepGenitiv.js'
import {prepositionsDativ} from '../src/achieveGroup/prepositions/prepDativ.js'
import {adjectiveBasic} from '../src/achieveGroup/adjective/adjectiveBasic.js'
import {adjectiveDeclension} from '../src/achieveGroup/adjective/adjectiveDeclension.js'
import {adjectiveComparison} from '../src/achieveGroup/adjective/adjectiveComparison.js'
import {tensesVerbs} from "../src/achieveGroup/verbs/tensesVerbs.js";
import {modalVerbs} from "../src/achieveGroup/verbs/modalVerbs.js";
import {typeVerbs} from "../src/achieveGroup/verbs/typeVerbs.js";
import {sentenceAchievement} from "../src/achieveGroup/sentenceDuel/sentenceAchievementsА1.js"


// 2) Сторы-источники
import {userChainStore} from '../store/chainStore.js'
import {userAuthStore} from '../store/authStore.js'
import {useQuestStore} from '../store/questStore.js'
import {userlangStore} from '../store/learningStore.js'
import {useLocalStatGameStore} from '../store/localSentenceStore.js'
import {useCardsStore} from '../store/cardsStore.js'
import {useGameStore} from '../store/marafonStore.js'
import {useDuelStore} from "../store/sentenceDuelStore.js";
import {useGuessWordStore} from '../store/guesStore.js'
import {achievementToAwardMap} from '../src/awards/awardsMap.js'
import {guessAchievment} from '../src/achieveGroup/guessAchieve/guessAchievments.js'
import {useQuizStore} from '../store/adjectiveStore.js'

export const useAchievementStore = defineStore('achievementStore', () => {
    const rawGroups = [
        ...sentenceAchievement.map(g => ({category: 'sentence', ...g})),
        ...typeVerbs.map(g => ({category: 'typeVerbs', ...g})),
        ...modalVerbs.map(g => ({category: 'modalVerbs', ...g})),
        ...tensesVerbs.map(g => ({category: 'tensesVerbs', ...g})),
        ...adjectiveComparison.map(g => ({category: 'adjectiveComparison', ...g})),
        ...adjectiveBasic.map(g => ({category: 'basicAdjectives', ...g})),
        ...adjectiveDeclension.map(g => ({category: 'adjectiveDeclension', ...g})),
        ...prepositionsDativ.map(g => ({category: 'dativ', ...g})),
        ...prepositionsNominativ.map(g => ({category: 'nominativ', ...g})),
        ...prepositionsGenitiv.map(g => ({category: 'genitiv', ...g})),
        ...prepositionsAkkusativ.map(g => ({category: 'akkusativ', ...g})),
        ...wordAchievementsGroup.map(g => ({category: 'locations', ...g})),
        ...overAchievment.map(g => ({category: 'over', ...g})),
        ...guessAchievment.map(g => ({category: 'guess', ...g})),
        ...groupedEasyModeAchievements.map(g => ({category: 'easy', ...g})),
        ...groupedNormalModeAchievements.map(g => ({category: 'normal', ...g})),
        ...groupedHardModeAchievements.map(g => ({category: 'hard', ...g})),
        ...listenAchieveGroup.map(g => ({category: 'listen', ...g})),
        ...pluraGroupAchievment.map(g => ({category: 'plural', ...g})),
        ...writeArticleGroupAchievment.map(g => ({category: 'write', ...g})),
        ...wordPlusArticleAchievment.map(g => ({category: 'wordArticle', ...g})),
        ...assembleWordGroupAchievement.map(g => ({category: 'letters', ...g})),
        ...cpecialGroupAchievment.map(g => ({category: 'special', ...g}))
    ]

    // --- 2) Инициализация групп с currentProgress:0 ---
    const groups = ref(
        rawGroups.map(group => ({
            ...group,
            achievements: group.achievements.map(a => ({
                ...a,
                title: a.title || a.name,
                currentProgress: 0
            }))
        }))
    )

    const lastUnlockedAward = ref(null)
    const lastUnlockedAchievement = ref(null)


    const bootUnlocked = [] // ачивки
    const bootAwards = [] // награды
    const db = getFirestore()
    const auth = getAuth()
    const authStore = userAuthStore()
    const questStore = useQuestStore()
    const langStore = userlangStore()
    const statsStore = useLocalStatGameStore()
    const cardStore = useCardsStore()
    const gameStore = useGameStore()
    const guessStore = useGuessWordStore()
    const chainStore = userChainStore()
    const popupQueue = ref([])
    const showPopup = ref(false)
    const popupAchievement = ref(null)
    const quizStore = useQuizStore()
    const prevMap = new Map()
    const duelStore = useDuelStore()
    const uiStore = useUiSettingsStore()


    const awardsKey = () => `awards_shown_v1_${authStore?.uid}`
    const completedKey = () => `achievements_completed_v1_${authStore?.uid}`


    function loadShown() {
        if (!process.client) return new Set()
        try {
            const raw = localStorage.getItem(awardsKey())
            return new Set(raw ? JSON.parse(raw) : [])
        } catch {
            return new Set()
        }
    }

    function saveShown(set) {
        if (!process.client) return
        try {
            localStorage.setItem(awardsKey(), JSON.stringify([...set]))
        } catch {
        }
    }

    let shownSet = loadShown()

    function loadCompleted() {
        if (!process.client) return new Set()
        try {
            const raw = localStorage.getItem(completedKey())
            return new Set(raw ? JSON.parse(raw) : [])
        } catch {
            return new Set()
        }
    }

    function saveCompleted(set) {
        if (!process.client) return
        try {
            localStorage.setItem(completedKey(), JSON.stringify([...set]))
        } catch {
        }
    }

    let completedSet = loadCompleted()

    // Перезагрузка наборов при смене пользователя
    watch(() => authStore.uid, () => {
        shownSet = loadShown()
        completedSet = loadCompleted()
    })

    const isBooting = ref(true)

    function findById(id) {
        for (const g of groups.value) {
            const ach = g.achievements.find(a => a.id === id)
            if (ach) return ach
        }
        return null
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


    function updateProgress(id, val) {
        const ach = findById(id)
        if (!ach) return

        const target = Number(ach.targetProgress ?? 0)
        const prev = Number(ach.currentProgress ?? 0)
        const next = Math.max(prev, Number(val ?? 0)) // не уменьшаем
        ach.currentProgress = Math.min(next, target)

        const nowCompleted = ach.currentProgress >= target
        const alreadyCompleted = completedSet.has(id)
        const justCompleted = nowCompleted && !alreadyCompleted

        if (justCompleted) {
            completedSet.add(id)
            saveCompleted(completedSet)

            if (!isBooting.value) {
                popupQueue.value.push(ach)
                showNextPopup()

                // ✅ ИЗМЕНЕНИЕ ЗДЕСЬ: Убрали setTimeout для очистки
                lastUnlockedAchievement.value = {
                    id: ach.id,
                    title: ach.title,
                    groupTitle: ach.groupTitle || null,
                    ts: Date.now()
                }

                const awardTitle = achievementToAwardMap[id]
                if (awardTitle && !shownSet.has(awardTitle)) {
                    shownSet.add(awardTitle)
                    saveShown(shownSet)

                    // ✅ ИЗМЕНЕНИЕ ЗДЕСЬ: Убрали setTimeout для очистки
                    lastUnlockedAward.value = {title: awardTitle, achId: id, ts: Date.now()}

                    updateProgress("firstAward", shownSet.size)
                }
            } else {
                bootUnlocked.push(ach)
                const awardTitle = achievementToAwardMap[id]
                if (awardTitle && !shownSet.has(awardTitle)) {
                    shownSet.add(awardTitle)
                    saveShown(shownSet)
                    bootAwards.push({title: awardTitle, achId: id})
                }
            }
        }

        prevMap.set(id, ach.currentProgress)
    }


    function getPrefixIds(prefix) {
        const ids = []
        for (const g of groups.value) {
            for (const a of g.achievements) {
                if (typeof a.id === 'string' && a.id.startsWith(prefix)) {
                    const n = Number(a.id.slice(prefix.length))
                    if (Number.isFinite(n)) ids.push({id: a.id, n})
                }
            }
        }
        ids.sort((a, b) => a.n - b.n)
        return ids.map(x => x.id)
    }

    // --- 5) Навешиваем watch’еры для всех категорий ---
    function initializeProgressTracking() {
        const prepositionsSetup = {
            dativ: 'dat',
            akkusativ: 'akk',
            genitiv: 'gen',
            nominativ: 'nom',
        }
        let prepositionUnsubs = []
        const applyPrepositionSnapshots = (prefix, agg, sess) => {
            const totalNow = Number(agg?.totalCorrect || 0)

            updateProgress(`${prefix}1`, totalNow > 0 ? 1 : 0)
            updateProgress(`${prefix}2`, totalNow)
            updateProgress(`${prefix}3`, totalNow)

            const perfectCnt = Number(agg?.perfectSessionsCount || 0)
            updateProgress(`${prefix}4`, perfectCnt)

            const fastPerfectCnt = Number(agg?.fastPerfectSessionsCount || 0)
            updateProgress(`${prefix}5`, fastPerfectCnt)

            const allIds = getPrefixIds(prefix)
            if (allIds.length >= 2) {
                const lastId = allIds[allIds.length - 1]
                const prereqIds = allIds.slice(0, -1)
                const allDone = prereqIds.every(id => {
                    const a = findById(id);
                    if (!a) return true
                    const tp = Number(a.targetProgress || 1)
                    return Number(a.currentProgress || 0) >= tp
                })
                updateProgress(lastId, allDone ? 1 : 0)
            }
        }
        watch(() => authStore.uid, (uid) => {
            prepositionUnsubs.forEach(fn => {
                try {
                    fn && fn()
                } catch {
                }
            })
            prepositionUnsubs = []
            if (!uid) return
            Object.entries(prepositionsSetup).forEach(([caseName, prefix]) => {
                const docId = `prepositions_${caseName}`
                const aggRef = doc(db, 'users', uid, 'quizTopics', docId)
                const sessRef = doc(db, 'users', uid, 'quizSessions', docId)
                let lastAgg = {}, lastSess = {}
                const u1 = onSnapshot(aggRef, s => {
                    lastAgg = s.data() || {};
                    applyPrepositionSnapshots(prefix, lastAgg, lastSess)
                })
                const u2 = onSnapshot(sessRef, s => {
                    lastSess = s.data() || {};
                    applyPrepositionSnapshots(prefix, lastAgg, lastSess)
                })
                prepositionUnsubs.push(u1, u2)
            })

        }, {immediate: true})

        const adjectivesSetup = {
            'adjective-basics_colors': 'col',
            'adjective-basics_feelings': 'emo',
            'adjective-basics_appearance': 'app',
            'adjective-basics_character': 'char',
            'adjective-basics_dimensions': 'dim',
            'adjective-comparison_regular-forms': 'creg',
            'adjective-comparison_umlaut-forms': 'cuml',
            'adjective-comparison_irregular-forms': 'cspec',
            'adjective-declension_definite-article': 'def',
            'adjective-declension_indefinite-article': 'indef',
            'adjective-declension_no-article': 'noart',

            'verb_presens': 'pras',
            'verb_perfect': 'perf',
            'verb_futurOne': 'fut',
            'verb_prateritum': 'prat',
            'verb_plusquamperfect': 'plus',

            'verb_modal': 'mod',
            'verb_nebensatze': 'neb',

            'verb_irregular': 'irr',
            'verb_prepositions': 'fix',
            'verb_reflexive': 'ref',
            'verb_separable': 'sep',
        }

        let adjectivesUnsubs = []
        watch(() => authStore.uid, (uid) => {
            adjectivesUnsubs.forEach(fn => {
                try {
                    fn && fn()
                } catch {
                }
            })
            adjectivesUnsubs = []
            if (!uid) return
            Object.entries(adjectivesSetup).forEach(([docId, prefix]) => {
                const aggRef = doc(db, 'users', uid, 'quizTopics', docId)
                const sessRef = doc(db, 'users', uid, 'quizSessions', docId)
                let lastAgg = {}, lastSess = {}
                const u1 = onSnapshot(aggRef, s => {
                    lastAgg = s.data() || {};
                    applyPrepositionSnapshots(prefix, lastAgg, lastSess)
                })
                const u2 = onSnapshot(sessRef, s => {
                    lastSess = s.data() || {};
                    applyPrepositionSnapshots(prefix, lastAgg, lastSess)
                })
                adjectivesUnsubs.push(u1, u2)
            })
        }, {immediate: true})
        // 5.1) over
        const baseTrackers = [
            {id: 'registerAchievement', source: () => authStore.uid, compute: (u) => (u ? 1 : 0)},
            {id: 'daily', source: () => questStore.dailyQuestCount, compute: (v) => v || 0},
            {id: 'levelUpExp', source: () => langStore.exp, compute: (v) => v || 0},
            {id: 'grandmaster_sentences', source: () => statsStore.constructedSentences, compute: (v) => v || 0},
            {id: 'learned10Words', source: () => langStore.learnedWords.length, compute: (v) => v},
            {id: 'learned100Words', source: () => langStore.learnedWords.length, compute: (v) => v},
            {id: 'wrong100Answers', source: () => langStore.wrongAnswers.length, compute: (v) => v},
            {
                id: 'SiteRegular',
                source: () => authStore.registeredAt,
                compute: (d) => (d ? Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 86400000)) : 0)
            },
            {id: 'createdCountCard', source: () => cardStore.createdCount, compute: (v) => v || 0},
            {id: 'LastChance', source: () => gameStore.lastChanceProgress, compute: (v) => v || 0},
            {id: 'MarginForError', source: () => gameStore.marginForErrorProgress, compute: (v) => v || 0},
            {id: 'OnTheEdge', source: () => gameStore.onTheEdgeProgress, compute: (v) => v || 0},
            {id: 'firstArticleAward', source: () => langStore.totalEarnedPoints, compute: (v) => (v > 0 ? 1 : 0)},
            {id: 'guessFirst', source: () => guessStore.guessedWords.length, compute: (v) => v},
            {id: 'guessSecond', source: () => guessStore.guessedWords.length, compute: (v) => v},
            {id: 'guessThird', source: () => guessStore.guessedWords.length, compute: (v) => v},
            {id: 'guessFourth', source: () => guessStore.guessedWords.length, compute: (v) => v},
            {id: 'guessSixHundred', source: () => guessStore.guessedWords.length, compute: (v) => v},
        ]

        baseTrackers.forEach(({id, source, compute}) => {
            watch(source, raw => {
                updateProgress(id, compute(raw))
            }, {immediate: true})
        })

        // 5.2) marathon (easy/normal/hard)
        ;[
            {category: 'easy', idx: 1},
            {category: 'normal', idx: 2},
            {category: 'hard', idx: 3},
        ].forEach(({category, idx}) => {
            watch(() => gameStore.totalCorrectAnswers?.[idx] || 0,
                v => groups.value
                    .filter(g => g.category === category)
                    .forEach(g => g.achievements
                        .filter(a => a.type === 'total')
                        .forEach(a => updateProgress(a.id, v))
                    ),
                {immediate: true}
            )
            watch(() => gameStore.personalBests?.[idx] || 0,
                v => groups.value
                    .filter(g => g.category === category)
                    .forEach(g => g.achievements
                        .filter(a => a.type === 'streak')
                        .forEach(a => updateProgress(a.id, v))
                    ),
                {immediate: true}
            )
        })


        // 5.3) listen
        watch(() => langStore.words.filter(w => w.progress?.audio).length,
            cnt => groups.value
                .filter(g => g.category === 'listen')
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            {immediate: true}
        )

        // 5.4) plural
        watch(() => langStore.words.filter(w => w.progress?.plural).length,
            cnt => groups.value
                .filter(g => g.category === 'plural')
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            {immediate: true}
        )

        // 5.5) write (der/die/das)
        const derCount = () => langStore.words.filter(w => w.article === 'der' && w.progress?.article).length
        const dieCount = () => langStore.words.filter(w => w.article === 'die' && w.progress?.article).length
        const dasCount = () => langStore.words.filter(w => w.article === 'das' && w.progress?.article).length

        watch(derCount,
            cnt => groups.value
                .filter(g => g.category === 'write' && g.title.toLowerCase().includes('der'))
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            {immediate: true}
        )
        watch(dieCount,
            cnt => groups.value
                .filter(g => g.category === 'write' && g.title.toLowerCase().includes('die'))
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            {immediate: true}
        )
        watch(dasCount,
            cnt => groups.value
                .filter(g => g.category === 'write' && g.title.toLowerCase().includes('das'))
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            {immediate: true}
        )

        // 5.6) wordArticle
        watch(() => langStore.words.filter(w => w.progress?.wordArticle).length,
            cnt => groups.value
                .filter(g => g.category === 'wordArticle')
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            {immediate: true}
        )


        if (process.client) {
            chainStore.loadProgressFromFirebase?.().catch(() => {
            })
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
        }, {immediate: true})

        // 5.7) letters
        watch(() => langStore.words.filter(w => w.progress?.letters).length,
            cnt => groups.value
                .filter(g => g.category === 'letters')
                .forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
            {immediate: true}
        )

        // 5.8) special
        watch(() => {
            const t = gameStore.totalCorrectAnswers || []
            return (t[1] || 0) + (t[2] || 0) + (t[3] || 0)
        }, total => updateProgress('totalArticles1000', total), {immediate: true})

        watch(() => langStore.isLeveling,
            lvl => updateProgress('level10', lvl),
            {immediate: true}
        )

        watch(() => statsStore.constructedSentences,
            n => updateProgress('sentences-master', n),
            {immediate: true}
        )

        watch(() => langStore.totalEarnedPoints,
            pts => updateProgress('Hunderd', pts),
            {immediate: true}
        )

        watch(() => langStore.articlesSpentForAchievement,
            spent => updateProgress('ArticlusSpent', spent),
            {immediate: true}
        )

        async function checkLeaderboard() {
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
            {immediate: true}
        )

        watch(() => authStore.registeredAt, date => {
            if (!date) return
            const days = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 86400000))
            updateProgress('OneYearVeteran', days)
        }, {immediate: true})

        // В файле achievementStore.js
// ПОЛНОСТЬЮ ЗАМЕНИТЕ ВАШ СУЩЕСТВУЮЩИЙ watch этим кодом

        watch(() => duelStore.achievements, (duelStats) => {
            // Новый, более детальный лог, который "разворачивает" Proxy
            const plainStats = JSON.parse(JSON.stringify(duelStats));


            if (!plainStats || Object.keys(plainStats).length === 0) {

                return;
            }

            groups.value
                .filter(g => g.category === 'sentence')
                .forEach(group => {
                    group.achievements.forEach(ach => {
                        const parts = ach.id.split('_');
                        if (parts.length < 2) return;

                        const level = parts[0].toUpperCase();
                        const metric = parts[1];


                        const progressValue = plainStats[level]?.[metric];


                        const currentProgress = progressValue || 0;


                        updateProgress(ach.id, currentProgress);
                    });
                });
        }, {
            immediate: true,
            deep: true
        });
        watchEffect(() => {
            const map = [
                ['guessedFastWords', guessStore.guessedFastWords.length],
                ['guessedSafeWords', guessStore.guessedSafeWords.length],
                ['guessedOnLastTryWords', guessStore.guessedOnLastTryWords.length],
                ['guessedPerfectWords', guessStore.guessedPerfectWords.length]
            ]
            map.forEach(([id, val]) => updateProgress(id, val))
        })

        // Инициал: прогресс «Начало коллекции» равен количеству показанных наград
        updateProgress("firstAward", shownSet.size)

        // ✅ завершаем «бут» и делаем реплей трёх тостов с микро-задержками
        watch(() => uiStore.isUiReady, (isReady) => {
            // Этот код сработает только один раз, когда isReady станет true
            if (!isReady) return;

            isBooting.value = false

            // на всякий случай: актуализируем прогресс «Начало коллекции»
            updateProgress('collectionStart', shownSet.size)

            // 1) «Первый шаг» — ПЕРВЫМ
            const regAch = findById('registerAchievement')
            const completed = regAch && regAch.currentProgress >= (regAch.targetProgress || 1)
            const wasBooted = bootUnlocked.find(a => a && a.id === 'registerAchievement')
            if (wasBooted || completed) {
                lastUnlockedAchievement.value = { id: 'registerAchievement', title: 'Первый шаг', ts: Date.now() }
            }
            // 2) Награда (например, «Значок участника») — сразу после «Первого шага»
            setTimeout(() => {
                if (bootAwards.length) {
                    const first = bootAwards[0]
                    lastUnlockedAward.value = { ...first, ts: Date.now() }
                }
            }, 60)
            // 3) «Начало коллекции» — третьим
            setTimeout(() => {
                const collectionAch = findById('collectionStart');
                if (collectionAch && collectionAch.currentProgress >= collectionAch.targetProgress) {
                    lastUnlockedAchievement.value = { id: 'collectionStart', title: 'Начало коллекции', ts: Date.now() }
                }
            }, 120)

        }, { once: true }) // { once: true } гарантирует, что watcher сработает лишь один раз
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
