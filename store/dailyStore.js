	import { defineStore } from 'pinia'
	import { ref, computed, watch } from 'vue'
	import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore'
	import { getAuth, onAuthStateChanged } from 'firebase/auth'
	import { dailyQuests } from '@/utils/dailyQuests.js'
	import { userlangStore } from '../store/learningStore.js'

	export const dailyStore = defineStore('dailyStore', () => {
		const QUESTS_PER_DAY = 3
		const DAY_MS = 24 * 60 * 60 * 1000
		const isClient = typeof window !== 'undefined'
		const langStore = userlangStore()
		const DEBUG_DAILY_MINUTE = false
		const CYCLE_MS = DEBUG_DAILY_MINUTE ? 60_000 : DAY_MS
		const db = getFirestore()


		const words = langStore.words
		const learnedWords = langStore.learnedWords
		const totalEarnedPoints = langStore.totalEarnedPoints
		const points = langStore.points
		const exp = langStore.exp
		const isLeveling = langStore.isLeveling
		const currentIndex = langStore.currentIndex
		const currentModeIndex = langStore.currentModeIndex


		function wrapSlice(arr, start, count) {
			const len = arr.length
			if (!len) return []
			const end = start + count
			return end <= len
				? arr.slice(start, end)
				: [...arr.slice(start), ...arr.slice(0, end - len)]
		}

		const nowMs = ref(Date.now())
		let timerId = null

		function start() {
			if (!isClient) return
			if (timerId) return
			loadFromFirebase().then(ensureBaselineForToday)
			timerId = setInterval(() => { nowMs.value = Date.now() }, 1000)
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

		// ---- baseline ----------------------------------------------------------
		const BASELINE_KEY = 'daily_baseline_v2'
		const baseline = ref({
			learnedWords: 0,
			totalEarnedPoints: 0,
			lettersDone: 0,
			wordArticleDone: 0,
			audioDone: 0,
			pluralDone: 0,
			bestStreakAnyMode: 0,
			bestStreakEasyArticle: 0,
			duelsPlayed: 0,
			points: 0,
			exp: 0,
			level: 0,
			currentIndex: 0,
			currentModeIndex: 0
		})

		function countMode(modeKey) {
			return (words || []).filter(w => w?.progress?.[modeKey] === true).length
		}

		function currentCounters() {
			return {
				learnedWords: (learnedWords || []).length,
				totalEarnedPoints: totalEarnedPoints || 0,
				lettersDone: countMode('letters'),
				wordArticleDone: countMode('wordArticle'),
				audioDone: countMode('audio'),
				pluralDone: countMode('plural'),
				bestStreakAnyMode: 0,
				bestStreakEasyArticle: 0,
				duelsPlayed: 0,
				points: points || 0,
				exp: exp || 0,
				level: isLeveling || 0,
				currentIndex: currentIndex || 0,
				currentModeIndex: currentModeIndex || 0
			}
		}

		function ensureBaselineForToday() {
			if (!isClient) return
			const all = JSON.parse(localStorage.getItem(BASELINE_KEY) || '{}')
			const key = String(dayIndex.value)
			if (!all[key]) {
				all[key] = currentCounters()
				localStorage.setItem(BASELINE_KEY, JSON.stringify(all))
				saveToFirebaseBaseline(all[key])
			}
			baseline.value = all[key]
		}

		function updateBaselinePatch(patch) {
			if (!isClient) return
			const all = JSON.parse(localStorage.getItem(BASELINE_KEY) || '{}')
			const key = String(dayIndex.value)
			all[key] = { ...(all[key] || currentCounters()), ...patch }
			localStorage.setItem(BASELINE_KEY, JSON.stringify(all))
			baseline.value = all[key]
			saveToFirebaseBaseline(all[key])
		}

		watch(dayIndex, () => ensureBaselineForToday())

		// ---- watch прогресса learningStore --------------------------------------
		watch(learnedWords, () => updateBaselinePatch({ learnedWords: learnedWords.length }), { deep: true })
		watch(totalEarnedPoints, (v) => updateBaselinePatch({ totalEarnedPoints: v }))
		watch(words, () => {
			updateBaselinePatch({
				lettersDone: countMode('letters'),
				wordArticleDone: countMode('wordArticle'),
				audioDone: countMode('audio'),
				pluralDone: countMode('plural'),
			})
		}, { deep: true })
		watch(points, (v) => updateBaselinePatch({ points: v }))
		watch(exp, (v) => updateBaselinePatch({ exp: v }))
		watch(isLeveling, (v) => updateBaselinePatch({ level: v }))
		watch([currentIndex, currentModeIndex], () => {
			updateBaselinePatch({ currentIndex: currentIndex.value, currentModeIndex: currentModeIndex.value })
		})

		// ---- живые инкременты и прогресс слов -----------------------------------
		function recordAnswerResult(isCorrect, { word = null, modeKey = null, difficulty = null } = {}) {
			if (word && modeKey) {
				langStore.markProgress(word, modeKey, isCorrect)
				if (isCorrect) langStore.markAsLearned(word)
			}

			let current = Number(sessionStorage.getItem('streakAnyMode') || '0')
			current = isCorrect ? current + 1 : 0
			sessionStorage.setItem('streakAnyMode', String(current))
			if (current > (baseline.value.bestStreakAnyMode || 0)) {
				updateBaselinePatch({ bestStreakAnyMode: current })
			}

			if (isCorrect && modeKey === 'article' && difficulty === 'easy') {
				let curEasy = Number(sessionStorage.getItem('streakEasyArticle') || '0')
				curEasy += 1
				sessionStorage.setItem('streakEasyArticle', String(curEasy))
				if (curEasy > (baseline.value.bestStreakEasyArticle || 0)) {
					updateBaselinePatch({ bestStreakEasyArticle: curEasy })
				}
			}

			if (!isCorrect && modeKey === 'article' && difficulty === 'easy') {
				sessionStorage.setItem('streakEasyArticle', '0')
			}
		}

		function recordDuelPlayed() {
			updateBaselinePatch({ duelsPlayed: (baseline.value.duelsPlayed || 0) + 1 })
		}

		// ---- прогресс квестов ---------------------------------------------------
		function getCurrentValueForQuestId(id) {
			const learnedDelta = Math.max(0, (learnedWords?.length || 0) - (baseline.value.learnedWords || 0))
			const pointsDelta = Math.max(0, (totalEarnedPoints || 0) - (baseline.value.totalEarnedPoints || 0))
			const lettersDelta = Math.max(0, countMode('letters') - (baseline.value.lettersDone || 0))
			const wordArticleDelta = Math.max(0, countMode('wordArticle') - (baseline.value.wordArticleDone || 0))
			const audioDelta = Math.max(0, countMode('audio') - (baseline.value.audioDone || 0))
			const pluralDelta = Math.max(0, countMode('plural') - (baseline.value.pluralDone || 0))

			switch (id) {
				case 1: return learnedDelta
				case 2: return pointsDelta
				case 3: return baseline.value.bestStreakEasyArticle || 0
				case 4: return baseline.value.bestStreakAnyMode || 0
				case 5: return lettersDelta
				case 6: return wordArticleDelta
				case 7: return audioDelta
				case 8: return baseline.value.duelsPlayed || 0
				default: return 0
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
				return { ...q, targetValue: target, currentValue, isCompleted: currentValue >= target }
			})
		})

		const msLeft = computed(() => {
			const d = new Date(nowMs.value)
			const nextMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime()
			return Math.max(0, nextMidnight - nowMs.value)
		})

		// ---- Firebase -----------------------------------------------------------
		const getUserDocRef = () => {
			const user = getAuth().currentUser
			if (!user) return null
			return doc(db, 'users', user.uid)
		}

		const saveToFirebaseBaseline = async (baselineData) => {
			const userDoc = getUserDocRef()
			if (!userDoc) return
			await setDoc(userDoc, { dailyBaseline: { [String(dayIndex.value)]: baselineData } }, { merge: true })
		}

		const loadFromFirebase = async () => {
			return new Promise((resolve) => {
				const auth = getAuth()
				onAuthStateChanged(auth, async (user) => {
					if (!user) return resolve()
					const userDoc = doc(db, 'users', user.uid)
					const docSnap = await getDoc(userDoc)
					if (docSnap.exists()) {
						const data = docSnap.data()
						const dailyData = data.dailyBaseline?.[String(dayIndex.value)]
						if (dailyData) baseline.value = dailyData
					}
					resolve()
				})
			})
		}

		return {
			start, stop,
			todayQuests, msLeft,
			recordAnswerResult,
			recordDuelPlayed
		}
	})
