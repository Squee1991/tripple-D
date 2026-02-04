import { defineStore } from 'pinia'
import { ref, watch, watchEffect } from 'vue'
import { getFirestore, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
// --- 1) Импорты групп достижений
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
import { prepositionsNominativ } from '../src/achieveGroup/prepositions/prepNominativ.js'
import { prepositionsAkkusativ } from '../src/achieveGroup/prepositions/prepAkkusativ.js'
import { prepositionsGenitiv } from '../src/achieveGroup/prepositions/prepGenitiv.js'
import { prepositionsDativ } from '../src/achieveGroup/prepositions/prepDativ.js'
import { adjectiveBasic } from '../src/achieveGroup/adjective/adjectiveBasic.js'
import { adjectiveDeclension } from '../src/achieveGroup/adjective/adjectiveDeclension.js'
import { adjectiveComparison } from '../src/achieveGroup/adjective/adjectiveComparison.js'
import { tensesVerbs } from '../src/achieveGroup/verbs/tensesVerbs.js'
import { modalVerbs } from '../src/achieveGroup/verbs/modalVerbs.js'
import { typeVerbs } from '../src/achieveGroup/verbs/typeVerbs.js'
import { sentenceAchievement } from '../src/achieveGroup/sentenceDuel/sentenceAchievementsА1.js'
import { eventWinterAchievements } from '../src/achieveGroup/eventAchievement/winterAchievements.js'
import { valentineAchievements } from '../src/achieveGroup/eventAchievement/valentineAchievements.js'

// --- 2) Сторы-источники
import { userChainStore } from '../store/chainStore.js'
import { userAuthStore } from '../store/authStore.js'
import { useQuestStore } from '../store/questStore.js'
import { userlangStore } from '../store/learningStore.js'
import { useLocalStatGameStore } from '../store/localSentenceStore.js'
import { useCardsStore } from '../store/cardsStore.js'
import { useGameStore } from '../store/marafonStore.js'
import { useDuelStore } from '../store/sentenceDuelStore.js'
import { useGuessWordStore } from '../store/guesStore.js'
import { achievementToAwardMap } from '../src/awards/awardsMap.js'
import { guessAchievment } from '../src/achieveGroup/guessAchieve/guessAchievments.js'
import { useQuizStore } from '../store/adjectiveStore.js'
import { useEventSessionStore } from '../store/eventsStore.js'
import { useEasterEggsStore } from '../store/easterEggsStore.js'

export const useAchievementStore = defineStore('achievementStore', () => {
	// --- Группы
	const rawGroups = [
		...valentineAchievements.map(g => ({category: 'valentine' , ...g})),
		...eventWinterAchievements.map(g => ({category: 'winter' , ...g})),
		...sentenceAchievement.map(g => ({ category: 'sentence', ...g })),
		...typeVerbs.map(g => ({ category: 'typeVerbs', ...g })),
		...modalVerbs.map(g => ({ category: 'modalVerbs', ...g })),
		...tensesVerbs.map(g => ({ category: 'tensesVerbs', ...g })),
		...adjectiveComparison.map(g => ({ category: 'adjectiveComparison', ...g })),
		...adjectiveBasic.map(g => ({ category: 'basicAdjectives', ...g })),
		...adjectiveDeclension.map(g => ({ category: 'adjectiveDeclension', ...g })),
		...prepositionsDativ.map(g => ({ category: 'dativ', ...g })),
		...prepositionsNominativ.map(g => ({ category: 'nominativ', ...g })),
		...prepositionsGenitiv.map(g => ({ category: 'genitiv', ...g })),
		...prepositionsAkkusativ.map(g => ({ category: 'akkusativ', ...g })),
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
	// --- Служебные ссылки/хранилища
	const lastUnlockedAward = ref(null)
	const lastUnlockedAchievement = ref(null)
	const popupQueue = ref([])
	const showPopup = ref(false)
	const popupAchievement = ref(null)
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
	const quizStore = useQuizStore()
	const duelStore = useDuelStore()
	const eventStore = useEventSessionStore()
	const eggStore = useEasterEggsStore()
	const isBooting = ref(true)
	const suppressReplaysUntil = ref(0)
	const bootUnlocked = []
	const bootAwards = []

	let eventUnsubs = []
	const dailyAggUnsub = ref(null)
	const prevMap = new Map()
	const required = ['article','letters','wordArticle','audio','plural']
	const VEGETABLES_DE = new Set([
		'Kartoffel','Karotte','Tomate','Gurke','Zwiebel','Kohl','Paprika',
		'Rote Bete','Radieschen','Bohne','Mais','Pilz','Knoblauch'
	]);
	const hasAllModes = (word) => required.every(m => word?.progress?.[m])
	const awardsKey = () => `awards_shown_v1_${authStore?.uid}`
	const completedKey = () => `achievements_completed_v1_${authStore?.uid}`
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

	let shownSet = loadShown()
	let completedSet = loadCompleted()
	const winterRank1BoughtCount = ref(0)
	const valentineRank1BoughtCount = ref(0)
	// --- Utils
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
	// Сброс всего UI/прогресса (без LS)
	function resetAllProgress (options = {}) {
		const { keepBoot = false } = options
		groups.value.forEach(g => {
			g.achievements.forEach(a => { a.currentProgress = 0 })
		})
		popupQueue.value.length = 0
		showPopup.value = false
		popupAchievement.value = null
		lastUnlockedAward.value = null
		lastUnlockedAchievement.value = null
		if (!keepBoot) {
			bootUnlocked.length = 0
			bootAwards.length = 0
		}
	}

	function detachDailyAggListener () {
		if (dailyAggUnsub.value) {
			try { dailyAggUnsub.value() } catch {}
			dailyAggUnsub.value = null
		}
	}

	function attachDailyAggListener () {
		detachDailyAggListener()
		const uid = authStore?.uid
		if (!uid) return
		const ref = doc(db, 'users', uid, 'dailyAgg', 'meta')
		dailyAggUnsub.value = onSnapshot(ref, (snap) => {
			const total = Number((snap.data() || {}).totalCompleted || 0)
			updateProgress('daily42', total)
		})
	}

	function updateProgress (id, val) {
		const ach = findById(id)
		if (!ach) return
		const target = Number(ach.targetProgress ?? 0)
		const prev   = Number(ach.currentProgress ?? 0)
		const incoming = Number(val ?? 0)
		const next     = isBooting.value ? incoming : Math.max(prev, incoming)
		ach.currentProgress = Math.min(next, target)
		const nowCompleted     = ach.currentProgress >= target
		const alreadyCompleted = completedSet.has(id)
		const justCompleted    = nowCompleted && !alreadyCompleted
		if (justCompleted) {
			completedSet.add(id)
			saveCompleted(completedSet)

			const mapVal = achievementToAwardMap[id]

			if (isBooting.value) {
				if (id === 'registerAchievement') {
					// --- НОВЫЙ АКК: показать попап ачивки сразу ---
					popupQueue.value.push(ach)
					showNextPopup()
					lastUnlockedAchievement.value = {
						id: ach.id,
						title: ach.title,
						groupTitle: ach.groupTitle || null,
						ts: Date.now()
					}
					// --- и сразу показать награду за регистрацию ---
					if (mapVal && !shownSet.has(mapVal)) {
						shownSet.add(mapVal)
						saveShown(shownSet)
						lastUnlockedAward.value = { titleKey: mapVal, achId: id, ts: Date.now() }
						// подтянем коллекцию
						updateProgress('Collection', shownSet.size)
					}
				} else {
					// остальные — копим, покажем после boot (или молча отметим, как у тебя настроено)
					bootUnlocked.push(ach.id)
					if (mapVal && !shownSet.has(mapVal)) {
						bootAwards.push({ titleKey: mapVal, achId: id })
					}
				}
			} else {
				// как и было для не-boot режима
				const canShow = Date.now() >= suppressReplaysUntil.value
				if (canShow) {
					popupQueue.value.push(ach)
					showNextPopup()
					lastUnlockedAchievement.value = {
						id: ach.id, title: ach.title, groupTitle: ach.groupTitle || null, ts: Date.now()
					}
					setTimeout(() => {
						if (lastUnlockedAchievement.value?.id === ach.id) lastUnlockedAchievement.value = null
					}, 0)

					if (mapVal && !shownSet.has(mapVal)) {
						shownSet.add(mapVal)
						saveShown(shownSet)
						lastUnlockedAward.value = { titleKey: mapVal, achId: id, ts: Date.now() }
						setTimeout(() => {
							if (lastUnlockedAward.value?.achId === id) lastUnlockedAward.value = null
						}, 0)
						updateProgress('Collection', shownSet.size)
					}
				}
			}
		}


		prevMap.set(id, ach.currentProgress)
	}

	function getPrefixIds (prefix) {
		const ids = []
		for (const g of groups.value) {
			for (const a of g.achievements) {
				if (typeof a.id === 'string' && a.id.startsWith(prefix)) {
					const n = Number(a.id.slice(prefix.length))
					if (Number.isFinite(n)) ids.push({ id: a.id, n })
				}
			}
		}
		ids.sort((a, b) => a.n - b.n)
		return ids.map(x => x.id)
	}
	const CASE_PREFIXES = ['nom', 'akk', 'dat', 'gen']
	const ADJ_BUCKETS = {
		basic:      ['col', 'emo', 'app', 'char', 'dim'],
		comparison: ['creg', 'cuml', 'cspec'],
		declension: ['def', 'indef', 'noart'],
	}
	const ADJ_ALL_PREFIXES = [
		...ADJ_BUCKETS.basic,
		...ADJ_BUCKETS.comparison,
		...ADJ_BUCKETS.declension,
	]
	const VERB_BUCKETS = {
		tenses: ['pras', 'perf', 'fut', 'prat', 'plus'],
		modal:  ['mod', 'neb'],
		types:  ['irr', 'fix', 'ref', 'sep'],
	}
	const VERB_ALL_PREFIXES = [
		...VERB_BUCKETS.tenses,
		...VERB_BUCKETS.modal,
		...VERB_BUCKETS.types,
	]

	function areAllPrefixesCompleted(prefixes) {
		return prefixes.every(isGroupMasterCompleted)
	}

	function recomputeAllVerbsMeta() {
		let done = 0
		if (areAllPrefixesCompleted(VERB_BUCKETS.tenses)) done++
		if (areAllPrefixesCompleted(VERB_BUCKETS.modal))  done++
		if (areAllPrefixesCompleted(VERB_BUCKETS.types))  done++
		updateProgress('all_verbs', done)
	}

	function recomputeAllAdjectivesMeta() {
		let done = 0
		if (areAllPrefixesCompleted(ADJ_BUCKETS.basic))      done++
		if (areAllPrefixesCompleted(ADJ_BUCKETS.comparison)) done++
		if (areAllPrefixesCompleted(ADJ_BUCKETS.declension)) done++
		updateProgress('all_adjectives', done)
	}

	function isGroupMasterCompleted(prefix) {
		const ids = getPrefixIds(prefix)
		if (!ids.length) return false
		const masterId = ids[ids.length - 1]
		const a = findById(masterId)
		if (!a) return false
		const target = Number(a.targetProgress ?? 1)
		const cur    = Number(a.currentProgress ?? 0)
		return cur >= target
	}

	function recomputeAllCasesMeta() {
		const done = CASE_PREFIXES.reduce((acc, p) => acc + (isGroupMasterCompleted(p) ? 1 : 0), 0)
		updateProgress('all_cases', done)
	}

	function finishBootAndReplay () {
		isBooting.value = false
		// реплей ачивок
		if (bootUnlocked.length) {
			bootUnlocked
				.map(id => findById(id))
				.filter(Boolean)
				.forEach(a => popupQueue.value.push(a))
			showNextPopup()
		}
		// реплей наград
		if (bootAwards.length) {
			bootAwards.forEach(({ titleKey, achId }) => {
				if (!shownSet.has(titleKey)) {
					shownSet.add(titleKey)
					saveShown(shownSet)
					lastUnlockedAward.value = { titleKey, achId, ts: Date.now() }
				}
			})
			updateProgress('Collection', shownSet.size)
		}

		bootUnlocked.length = 0
		bootAwards.length = 0
	}

	if (process.client) {
		watch(() => authStore.uid, (uid) => {
			isBooting.value = true
			suppressReplaysUntil.value = Date.now() + 2000
			shownSet = loadShown()
			completedSet = loadCompleted()
			groups.value.forEach(g => {
				g.achievements.forEach(a => {
					if (completedSet.has(a.id)) {
						a.currentProgress = a.targetProgress
					} else {
						a.currentProgress = 0
					}
				})
			})
			updateProgress('Collection', shownSet.size)
			eggStore.loadEggs()
			detachDailyAggListener()

			if (!uid) {
				isBooting.value = false
				resetAllProgress()
				return
			}

			attachDailyAggListener()
			setTimeout(() => {
				const isNewAccount = !completedSet.has('registerAchievement')
				if (isNewAccount) {
					updateProgress('registerAchievement', 1)
				}
			}, 0)
			setTimeout(() => {
				finishBootAndReplay()
				recomputeAllCasesMeta()
				recomputeAllAdjectivesMeta()
				recomputeAllVerbsMeta()
			}, 0)
		}, { immediate: true })
	}
	function initializeProgressTracking () {
		const prepositionsSetup = {
			dativ: 'dat',
			akkusativ: 'akk',
			genitiv: 'gen',
			nominativ: 'nom'
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
				const lastId    = allIds[allIds.length - 1]
				const prereqIds = allIds.slice(0, -1)
				const allDone = prereqIds.every(id => {
					const a = findById(id)
					if (!a) return false
					const tp  = Number(a.targetProgress ?? 1)
					const cur = Number(a.currentProgress ?? 0)
					return cur >= tp
				})
				updateProgress(lastId, allDone ? 1 : 0)
			}
			if (CASE_PREFIXES.includes(prefix)) {
				recomputeAllCasesMeta()
			}
		}

		watch(() => authStore.uid, (uid) => {
			prepositionUnsubs.forEach(fn => { try { fn && fn() } catch {} })
			prepositionUnsubs = []
			if (!uid) return
			Object.entries(prepositionsSetup).forEach(([caseName, prefix]) => {
				const docId  = `prepositions_${caseName}`
				const aggRef = doc(db, 'users', uid, 'quizTopics', docId)
				const sesRef = doc(db, 'users', uid, 'quizSessions', docId)
				let lastAgg = {}, lastSess = {}
				const u1 = onSnapshot(aggRef, s => {
					lastAgg = s.data() || {}
					applyPrepositionSnapshots(prefix, lastAgg, lastSess)
				})
				const u2 = onSnapshot(sesRef, s => {
					lastSess = s.data() || {}
					applyPrepositionSnapshots(prefix, lastAgg, lastSess)
				})
				prepositionUnsubs.push(u1, u2)
			})
		}, { immediate: true })
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
			'modal-verbs_modal': 'mod',
			'modal-verbs_nebensatze': 'neb',
			'verb_irregular': 'irr',
			'verb_prepositions': 'fix',
			'verb_reflexive': 'ref',
			'verb_separable': 'sep'
		}
		let adjectivesUnsubs = []
		watch(() => authStore.uid, (uid) => {
			adjectivesUnsubs.forEach(fn => { try { fn && fn() } catch {} })
			adjectivesUnsubs = []
			if (!uid) return
			Object.entries(adjectivesSetup).forEach(([docId, prefix]) => {
				const aggRef = doc(db, 'users', uid, 'quizTopics', docId)
				const sesRef = doc(db, 'users', uid, 'quizSessions', docId)
				let lastAgg = {}, lastSess = {}
				const u1 = onSnapshot(aggRef, s => {
					lastAgg = s.data() || {}
					applyPrepositionSnapshots(prefix, lastAgg, lastSess)
					if (ADJ_ALL_PREFIXES.includes(prefix)) recomputeAllAdjectivesMeta()
					if (VERB_ALL_PREFIXES.includes(prefix)) recomputeAllVerbsMeta()
				})
				const u2 = onSnapshot(sesRef, s => {
					lastSess = s.data() || {}
					applyPrepositionSnapshots(prefix, lastAgg, lastSess)
					if (ADJ_ALL_PREFIXES.includes(prefix)) recomputeAllAdjectivesMeta()
					if (VERB_ALL_PREFIXES.includes(prefix)) recomputeAllVerbsMeta()
				})
				adjectivesUnsubs.push(u1, u2)
			})
		}, { immediate: true })
		const baseTrackers = [
			{ id: 'registerAchievement', source: () => authStore.uid, compute: (u) => (u ? 1 : 0) },
			{ id: 'daily', source: () => questStore.dailyQuestCount, compute: (v) => v || 0 },
			{ id: 'levelUpExp', source: () => langStore.exp, compute: (v) => v || 0 },
			{ id: 'grandmaster_sentences', source: () => statsStore.constructedSentences, compute: (v) => v || 0 },
			{ id: 'learned10Words', source: () => langStore.learnedWords.length, compute: (v) => v },
			{ id: 'learned100Words', source: () => langStore.learnedWords.length, compute: (v) => v },
			{ id: 'wrong100Answers', source: () => langStore.wrongAnswers.length, compute: (v) => v },
			{ id: 'SiteRegular', source: () => authStore.registeredAt, compute: (d) => (d ? Math.max(0, Math.floor((Date.now() - new Date(d).getTime()) / 86400000)) : 0) },
			{ id: 'createdCountCard', source: () => cardStore.createdCount, compute: (v) => v || 0 },
			{ id: 'LastChance', source: () => gameStore.lastChanceProgress, compute: (v) => v || 0 },
			{ id: 'MarginForError', source: () => gameStore.marginForErrorProgress, compute: (v) => v || 0 },
			{ id: 'OnTheEdge', source: () => gameStore.onTheEdgeProgress, compute: (v) => v || 0 },
			{ id: 'firstArticleAward', source: () => langStore.totalEarnedPoints, compute: (v) => (v > 0 ? 1 : 0) },
			{ id: 'guessFirst', source: () => guessStore.guessedWords.length, compute: (v) => v },
			{ id: 'guessSecond', source: () => guessStore.guessedWords.length, compute: (v) => v },
			{ id: 'guessThird', source: () => guessStore.guessedWords.length, compute: (v) => v },
			{ id: 'guessFourth', source: () => guessStore.guessedWords.length, compute: (v) => v },
			{ id: 'guessSixHundred', source: () => guessStore.guessedWords.length, compute: (v) => v }
		]
		baseTrackers.forEach(({ id, source, compute }) => {
			watch(source, raw => {
				updateProgress(id, compute(raw))
			}, { immediate: true })
		})
		// d) марафон
		;[
			{ category: 'easy', idx: 1 },
			{ category: 'normal', idx: 2 },
			{ category: 'hard', idx: 3 }
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

		watch(() => langStore.words.filter(w => w.progress?.audio).length,
			cnt => groups.value.filter(g => g.category === 'listen')
				.forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
			{ immediate: true }
		)
		watch(() => langStore.words.filter(w => w.progress?.plural).length,
			cnt => groups.value.filter(g => g.category === 'plural')
				.forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
			{ immediate: true }
		)

		watch(() => langStore.words.filter(w => w.progress?.letters).length,
			cnt => groups.value.filter(g => g.category === 'letters')
				.forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
			{ immediate: true }
		)



		const derCount = () => langStore.words.filter(w => w.article === 'der' && w.progress?.article).length
		const dieCount = () => langStore.words.filter(w => w.article === 'die' && w.progress?.article).length
		const dasCount = () => langStore.words.filter(w => w.article === 'das' && w.progress?.article).length
		watch(derCount,
			cnt => groups.value.filter(g => g.category === 'write' && g.title.toLowerCase().includes('der'))
				.forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
			{ immediate: true }
		)
		watch(dieCount,
			cnt => groups.value.filter(g => g.category === 'write' && g.title.toLowerCase().includes('die'))
				.forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
			{ immediate: true }
		)
		watch(dasCount,
			cnt => groups.value.filter(g => g.category === 'write' && g.title.toLowerCase().includes('das'))
				.forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
			{ immediate: true }
		)
		watch(() => langStore.words.filter(w =>
				w?.progress?.wordArticle || w?.progress?.wordPlusArticle
			).length,
			cnt => groups.value
				.filter(g => g.category === 'wordArticle')
				.forEach(g => g.achievements.forEach(a => updateProgress(a.id, cnt))),
			{ immediate: true }
		)

		watch(() => eggStore.answeredMap['lost_sequence'], (isUnlocked) => {
			if (isUnlocked) {
				updateProgress('the_hatch_quest', 1)
			}
		}, { immediate: true })
		// цепочки квестов (карта)
		if (process.client) {
			chainStore.loadProgressFromFirebase?.().catch(() => {})
		}
		watch(() => chainStore.questProgress, (qpRaw) => {
			const qp = qpRaw || {}
			const entries = Object.values(qp).filter(Boolean)
			// --- Новый критерий идеальности (без wrong/skipped) ---
			const isPerfect = (p) => {
				const correct  = Number(p?.correctCount ?? 0)
				const required = Number(p?.requiredTasks ?? 0)
				return Boolean(p?.success) && correct === required
			}
			// --- Локационные ачивки (как и было, только через isPerfect) ---
			const slugById = (id) => (id === 'eastPlain' ? 'east-plain' : id)
			const countForId = (id) => {
				const slug = slugById(id)
				return entries.filter(p => isPerfect(p) && p.region === slug).length
			}
			const locationIds =
				groups.value
					.filter(g => g.category === 'locations')
					.flatMap(g => g.achievements.map(a => a.id))
					.filter(id => id !== 'explorer' && id !== 'FiveHearts')
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
			const fiveHeartsCount = entries.filter(p => {
				const req   = Number(p?.requiredTasks ?? 0)
				const corr  = Number(p?.correctCount ?? 0)
				const lifes = Number(p?.livesAtFinish ?? 0)
				return Boolean(p?.success) && req >= 10 && corr === req && lifes >= 5
			}).length
			updateProgress('FiveHearts', fiveHeartsCount)
		}, { immediate: true, deep: true  })
		// f) прочее
		watch(() => {
			const t = gameStore.totalCorrectAnswers || []
			return (t[1] || 0) + (t[2] || 0) + (t[3] || 0)
		}, total => updateProgress('totalArticles1000', total), { immediate: true })
		watch(() => langStore.isLeveling, lvl => updateProgress('level10',  lvl), { immediate: true })
		watch(() => statsStore.constructedSentences, n => updateProgress('sentences-master', n), { immediate: true })
		watch(() => langStore.totalEarnedPoints,  pts => updateProgress('Hunderd', pts), { immediate: true })
		watch(() => langStore.articlesSpentForAchievement, spent => updateProgress('Articlus', Number(spent) || 0), { immediate: true })
		// лидерборды
		;(async function checkLeaderboard () {
			if (!authStore.uid) return
			const levels = [1, 2, 3]
			const ids = ['leaderboardEasy', 'leaderboardNormal', 'leaderboardHard']
			for (let i = 0; i < 3; i++) {
				const lb = await gameStore.loadMarathonLeaderboard(levels[i])
				updateProgress(ids[i], lb.length > 0 && lb[0].id === authStore.uid ? 1 : 0)
			}
		})()
		watch(() => gameStore.onTheEdgeProgress, v => updateProgress('Impuls', v), { immediate: true })
		watch(() => authStore.registeredAt, date => {
			if (!date) return
			const regTime = new Date(date).getTime()
			if (isNaN(regTime) || regTime < 1672531200000) return
			const days = Math.max(0, Math.floor((Date.now() - regTime) / 86400000))
			updateProgress('OneYearVeteran', Math.min(days, 365))
		}, { immediate: true })

		watch(duelStore.achievements, (duelStats) => {
				const stats = duelStats || {}
				if (Object.keys(stats).length === 0) return
				groups.value
					.filter(g => g.category === 'sentence')
					.forEach(group => {
						group.achievements.forEach(ach => {
							const parts = (ach.id || '').split('_')
							if (parts.length < 2) return
							const level  = parts[0].toUpperCase()
							const metric = parts[1]
							const val = stats[level]?.[metric] ?? 0
							updateProgress(ach.id, val)
						})
					})
			},
			{ immediate: true, deep: true }
		)

		watch(() => {
				const topics = new Set(langStore.learnedWords
					.filter(w => w.de === 'Baum' && required.every(m => w?.progress?.[m] === true))
						.map(w => (w.topic ?? '__no_topic__'))
				)
				return topics.size
			},
			(uniqueTopicsCount) => {
				updateProgress('iAmGroot', uniqueTopicsCount)
			},
			{ immediate: true, deep: true }
		)

		watch(() => langStore.words, (words = []) => {
			const targets = words.filter(w => w.topic === 'Food' && VEGETABLES_DE.has(w.de));
			if (!targets.length) return updateProgress('vegan', 0);
			const allLearned = targets.every(w => hasAllModes(w));
			updateProgress('vegan', allLearned ? 1 : 0);
		}, { immediate: true, deep: true });

		watch(() => langStore.words, (words) => {
			const salamiDone = words.some(w => w.de === 'Salami' && hasAllModes(w))
			if (salamiDone) {
				updateProgress('cowabungaSalami', 1)
			}
		}, { immediate: true, deep: true })

		watch(() => langStore.words, (words = []) => {
			const animals = words.filter(w => w.topic === 'Animals')
			const allLearned = animals.length > 0 && animals.every(w => hasAllModes(w))
			updateProgress('zoo', allLearned ? 1 : 0)
		}, { immediate: true, deep: true })

		watch(() => langStore.words, (words) => {
			const katzeDone = words.some(w => w.de === 'Katze' && hasAllModes(w))
			const hundDone  = words.some(w => w.de === 'Hund' && hasAllModes(w))
			const progress = [katzeDone, hundDone].filter(Boolean).length
			updateProgress('catDog', progress)
		}, { immediate: true, deep: true })

		watch(() => authStore.voiceConsentGiven, (isGiven) => {
			if (isGiven) {
				updateProgress('voiceActivated', 1)
			}
		}, { immediate: true })

		watch(() => authStore.uid, async (uid) => {
			if (!uid) return
			try {
				await duelStore.loadUserAchievements()
			} catch (e) {
			}
		}, { immediate: true })
		// угадай-слово
		watchEffect(() => {
			const map = [
				['guessedFastWords',      guessStore.guessedFastWords.length],
				['guessedSafeWords',      guessStore.guessedSafeWords.length],
				['guessedOnLastTryWords', guessStore.guessedOnLastTryWords.length],
				['guessedPerfectWords',   guessStore.guessedPerfectWords.length]
			]
			map.forEach(([id, val]) => updateProgress(id, val))
		})
		updateProgress('Collection', shownSet.size)
		setTimeout(() => {
			finishBootAndReplay()
		}, 0)

		watch(() => authStore.uid, (uid) => {
			eventUnsubs.forEach(unsub => { try { unsub && unsub() } catch {} })
			eventUnsubs = []
			if (!uid) return

			const winterEventRef = doc(db, 'users', uid, 'eventSessions', 'winter')
			getDoc(winterEventRef).then((snap) => {
				if (!snap.exists()) return
				const eventData = snap.data() || {}
				const questsProgress = eventData.quests || {}
				const shopItems = eventData.shopItems || {}
				const rank1Ids = ['santaHat', 'christmasBall', 'christmasWreath']
				const boughtRank1Count = rank1Ids.reduce((acc, id) => acc + (shopItems[id] ? 1 : 0), 0)
				winterRank1BoughtCount.value = boughtRank1Count
				updateProgress('Collection', shownSet.size + winterRank1BoughtCount.value)
				const wordScore = questsProgress['quest-21']?.score || 0
				const completedQuestsCount = Object.values(questsProgress).filter(quest => quest.finished).length
				const totalRep = eventData.reputationPoints || 0
				updateProgress('firstQuest', completedQuestsCount > 0 ? 1 : 0)
				updateProgress('santaLexicon', wordScore)
				updateProgress('everyQuest', completedQuestsCount)
				updateProgress('winterHonor', totalRep)
				updateProgress('snowFall', shopItems['snowFall'] ? 1 : 0)
				updateProgress('santaHat', shopItems['santaHat'] ? 1 : 0)
				updateProgress('christmasBall', shopItems['christmasBall'] ? 1 : 0)
				updateProgress('christmasWreath', shopItems['christmasWreath'] ? 1 : 0)
				const isAchComplete = (id) => completedSet.has(id);
				const metaChildrenIds = [
					'firstQuest',
					'santaLexicon',
					'everyQuest',
					'snowFall',
					'santaHat',
					'winterHonor',
					'christmasBall',
					'christmasWreath'
				];
				const completedMetaChildren = metaChildrenIds.filter(isAchComplete).length;
				updateProgress('metaChristmas', completedMetaChildren);
			}).catch(error => {

			});
			const unsubWinter = onSnapshot(winterEventRef, (snap) => {
				const eventData = snap.data() || {}
				const questsProgress = eventData.quests || {}
				const shopItems = eventData.shopItems || {}
				const rank1Ids = ['santaHat', 'christmasBall', 'christmasWreath']
				const boughtRank1Count = rank1Ids.reduce((acc, id) => acc + (shopItems[id] ? 1 : 0), 0)
				winterRank1BoughtCount.value = boughtRank1Count
				updateProgress('Collection', shownSet.size + winterRank1BoughtCount.value)
				const wordQuestProgress = questsProgress['quest-21'] || {}
				const wordScore = wordQuestProgress.score || 0
				const completedQuestsCount = Object.values(questsProgress).filter(quest => quest.finished).length
				const totalRep = eventData.reputationPoints || 0
				updateProgress('firstQuest', completedQuestsCount > 0 ? 1 : 0)
				updateProgress('santaLexicon', wordScore)
				updateProgress('everyQuest', completedQuestsCount)
				updateProgress('winterHonor', totalRep)
				updateProgress('snowFall', shopItems['snowFall'] ? 1 : 0)
				updateProgress('santaHat', shopItems['santaHat'] ? 1 : 0)
				updateProgress('christmasBall', shopItems['christmasBall'] ? 1 : 0)
				updateProgress('christmasWreath', shopItems['christmasWreath'] ? 1 : 0)
				const isAchComplete = (id) => completedSet.has(id);
				const metaChildrenIds = [
					'firstQuest',
					'santaLexicon',
					'everyQuest',
					'snowFall',
					'santaHat',
					'winterHonor',
					'christmasBall',
					'christmasWreath'
				];
				const completedMetaChildren = metaChildrenIds.filter(isAchComplete).length;
				updateProgress('metaChristmas', completedMetaChildren);
			})
			eventUnsubs.push(unsubWinter)

			const valentineEventRef = doc(db, 'users', uid, 'eventSessions', 'valentine')
			const handleValentineUpdate = (snap) => {
				if (!snap.exists()) return
				const eventData = snap.data() || {}
				const questsProgress = eventData.quests || {}
				const shopItems = eventData.shopItems || {}
				const wordScore = questsProgress['quest-1']?.score || 0
				updateProgress('valentineWords', wordScore)
				const completedQuestsCount = Object.values(questsProgress).filter(q => q.finished).length
				updateProgress('firstValentineQuest', completedQuestsCount > 0 ? 1 : 0)
				updateProgress('valentineAllQuests', completedQuestsCount)
				updateProgress('valentineBear', shopItems['teddy'] ? 1 : 0)
				updateProgress('cupidArrow', shopItems['arrow'] ? 1 : 0)
				updateProgress('valentineTheme', shopItems['theme'] ? 1 : 0)
				const totalRep = eventData.reputationPoints || 0
				updateProgress('ValentineReputation', totalRep)
				const metaChildrenIds = [
					'firstValentineQuest',
					'valentineWords',
					'valentineAllQuests',
					'valentineBear',
					'cupidArrow',
					'valentineTheme',
					'ValentineReputation'
				];
				const completedMetaChildren = metaChildrenIds.filter(id => completedSet.has(id)).length;
				updateProgress('valentineAllAchievements', completedMetaChildren);
				const rank1Ids = ['teddy', 'cupidArrow']
				const boughtCount = rank1Ids.reduce((acc, id) => acc + (shopItems[id] ? 1 : 0), 0)
				valentineRank1BoughtCount.value = boughtCount
				updateProgress('Collection', shownSet.size + winterRank1BoughtCount.value + valentineRank1BoughtCount.value)
			}
			getDoc(valentineEventRef).then(handleValentineUpdate).catch(() => {})
			const unsubValentine = onSnapshot(valentineEventRef, handleValentineUpdate)
			eventUnsubs.push(unsubValentine)
		}, { immediate: true })
	}

	watch(lastUnlockedAward, (award) => {
		if (award) updateProgress('Collection', shownSet.size + winterRank1BoughtCount.value + valentineRank1BoughtCount.value)
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
