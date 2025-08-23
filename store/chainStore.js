import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { regions } from '~/utils/regions.js'
import { doc, getDoc, getFirestore, runTransaction, increment, setDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const HOUR_MS = 60 * 60 * 1000
const MAX_LIVES = 5

export const userChainStore = defineStore('chain', () => {
	const db = getFirestore()

	// --- Состояние квеста ---
	const quest = ref(null)
	const loading = ref(true)
	const error = ref('')

	const currentIndex = ref(0)
	const correctCount = ref(0)
	const finished = ref(false)
	const showResult = ref(false)
	const isCorrect = ref(false)

	const selected = ref('')
	const userInput = ref('')
	const reorderSelection = ref([])
	const reorderBank = ref([])

	// --- ГЛОБАЛЬНЫЕ жизни (общие на весь аккаунт) ---
	const maxLives = MAX_LIVES
	const lives = ref(maxLives)
	const lastLifeAtMs = ref(0) // момент старта восстановления (когда с 5 упали на 4)

	// --- Прочее ---
	const currentQuestId = ref('')
	const currentRegionKey = ref('')
	const questProgress = ref({})
	const sessionStarted = ref(false)
	const justAwarded = ref(false)

	// --- Вычисления по квесту ---
	const requiredTasks = computed(() => quest.value?.conditions?.requiredTasks ?? quest.value?.tasks?.length ?? 0)
	const minCorrect    = computed(() => quest.value?.conditions?.minCorrect ?? requiredTasks.value)
	const task          = computed(() => finished.value ? null : (quest.value?.tasks?.[currentIndex.value] ?? null))
	const success       = computed(() => correctCount.value >= minCorrect.value)

	const progressEntry = computed(() => questProgress.value[currentQuestId.value] || null)
	const rewardClaimed = computed(() => !!progressEntry.value?.rewardClaimed)

	const correctAnswer = computed(() => {
		if (!task.value) return ''
		return task.value.answer || task.value.correctAnswer || (task.value.correctOrder ? task.value.correctOrder.join(' ') : '') || ''
	})

	const isConfirmDisabled = computed(() => {
		if (showResult.value) return true
		if (!task.value) return true
		switch (task.value.type) {
			case 'select':
			case 'readAndAnswer': return !selected.value
			case 'input':
			case 'speechToText': return !userInput.value.trim()
			case 'reorder': return reorderSelection.value.length === 0
			case 'textToSpeech': return false
			default: return true
		}
	})

	// ---------- helpers ----------
	function resetInputs() {
		selected.value = ''
		userInput.value = ''
		reorderSelection.value = []
		reorderBank.value = []
	}

	function waitForAuthUser() {
		const auth = getAuth()
		if (auth.currentUser) return Promise.resolve(auth.currentUser)
		return new Promise(resolve => {
			const unsub = onAuthStateChanged(auth, u => { unsub(); resolve(u || null) })
		})
	}

	async function getUserRef() {
		const user = await waitForAuthUser()
		if (!user) return null
		return doc(db, 'users', user.uid)
	}

	// ---------- ГЛОБАЛЬНАЯ загрузка (включая жизни) ----------
	async function loadProgressFromFirebase() {
		const userRef = await getUserRef()
		if (!userRef) return
		const snap = await getDoc(userRef)
		if (snap.exists()) {
			const data = snap.data() || {}
			questProgress.value = data.questProgress || {}

			// читаем глобальные жизни из корня
			const l = typeof data.lives === 'number' ? data.lives : maxLives
			const ts = typeof data.lastLifeAtMs === 'number' ? data.lastLifeAtMs : 0
			lives.value = Math.max(0, Math.min(maxLives, l))
			lastLifeAtMs.value = ts || (lives.value < maxLives ? Date.now() : 0)
		} else {
			// дефолт: полный набор
			lives.value = maxLives
			lastLifeAtMs.value = 0
			questProgress.value = {}
			await setDoc(userRef, { lives: maxLives, lastLifeAtMs: 0, questProgress: {} }, { merge: true })
		}

		// применяем регенерацию и сохраняем
		applyLifeRegenIfNeeded()
		await saveLivesToRoot()
	}

	// ---------- Регенерация: +1 жизнь за каждый полный час до 5 ----------
	function applyLifeRegenIfNeeded() {
		if (lives.value >= maxLives) return
		if (!lastLifeAtMs.value) lastLifeAtMs.value = Date.now()

		const now = Date.now()
		const ticks = Math.floor((now - lastLifeAtMs.value) / HOUR_MS) // сколько часов прошло
		if (ticks <= 0) return

		const gained = Math.min(maxLives - lives.value, ticks)
		if (gained > 0) {
			lives.value += gained
			lastLifeAtMs.value += gained * HOUR_MS
			if (lives.value > maxLives) lives.value = maxLives
		}
	}

	// ---------- Сохранение глобальных жизней в корень user-дока ----------
	async function saveLivesToRoot() {
		const userRef = await getUserRef()
		if (!userRef) return
		await setDoc(userRef, { lives: lives.value, lastLifeAtMs: lastLifeAtMs.value }, { merge: true })
	}

	// ---------- Финал квеста (жизни НЕ трогаем) ----------
	async function saveFinalProgress() {
		if (!currentQuestId.value) return
		const userRef = await getUserRef()
		if (!userRef) return

		const answered = Math.min(currentIndex.value + (showResult.value ? 1 : 0), requiredTasks.value)
		const percent = requiredTasks.value ? Math.max(0, Math.min(100, Math.round((answered / requiredTasks.value) * 100))) : 0

		const payload = await runTransaction(db, async (tx) => {
			const snap = await tx.get(userRef)
			const data = snap.exists() ? (snap.data() || {}) : {}
			const qp = data.questProgress || {}
			const prev = qp[currentQuestId.value] || {}

			let reward = !!prev.rewardClaimed
			let timesCompleted = Number(prev.timesCompleted || 0)
			if (success.value) timesCompleted += 1

			let awardedNow = false
			if (success.value && !reward) {
				tx.set(userRef, { points: increment(20), exp: increment(20) }, { merge: true })
				reward = true
				awardedNow = true
			}

			const p = {
				region: currentRegionKey.value || null,
				progressPercent: percent,
				correctCount: correctCount.value,
				requiredTasks: requiredTasks.value,
				completed: true,
				success: success.value,
				rewardClaimed: reward,
				timesCompleted,
				livesAtFinish: lives.value,
				updatedAtMs: Date.now()
			}

			tx.set(userRef, { questProgress: { [currentQuestId.value]: p } }, { merge: true })
			justAwarded.value = awardedNow
			return p
		})

		questProgress.value = { ...questProgress.value, [currentQuestId.value]: payload }
	}

	// ---------- Загрузка квеста ----------
	async function loadQuest(questId, regionKey) {
		loading.value = true
		error.value = ''
		quest.value = null

		restart(rewardClaimed.value) // не трогаем глобальные жизни

		currentQuestId.value = String(questId || '')
		currentRegionKey.value = String(regionKey || '')
		justAwarded.value = false

		try {
			const allRegionKeys = regions.map(r => r.pathTo)
			const tryLoadFrom = async (region) => {
				const res = await fetch(`/quests/quests-${region}.json`)
				if (!res.ok) return null
				const list = await res.json()
				const arr = Array.isArray(list) ? list : [list]
				return arr.find(q => q.questId === questId) || null
			}

			if (regionKey) {
				const q = await tryLoadFrom(regionKey)
				if (q) quest.value = q
			}
			if (!quest.value) {
				for (const key of allRegionKeys) {
					const q = await tryLoadFrom(key)
					if (q) { quest.value = q; currentRegionKey.value = key; break }
				}
			}
			if (!quest.value) throw new Error('Квест не найден')

			// реген жизней при входе в любой квест
			applyLifeRegenIfNeeded()
			await saveLivesToRoot()
		} catch (e) {
			error.value = e.message || String(e)
		} finally {
			loading.value = false
		}
	}

	// ---------- Работа с задачами ----------
	function choose(opt) {
		if (finished.value || showResult.value) return
		selected.value = opt
	}

	function handleReorderWord(word, from) {
		if (showResult.value) return
		const source = from === 'bank' ? reorderBank.value : reorderSelection.value
		const dest   = from === 'bank' ? reorderSelection.value : reorderBank.value
		const index = source.findIndex(item => item === word)
		if (index > -1) { const [moved] = source.splice(index, 1); dest.push(moved) }
	}

	async function confirm(skipLives = false) {
		if (isConfirmDisabled.value || !task.value) return
		sessionStarted.value = true

		switch (task.value.type) {
			case 'select':
			case 'readAndAnswer': isCorrect.value = selected.value === task.value.answer; break
			case 'input':         isCorrect.value = userInput.value.trim().toLowerCase() === task.value.correctAnswer.toLowerCase(); break
			case 'speechToText':  isCorrect.value = userInput.value.trim().toLowerCase() === task.value.answer.toLowerCase(); break
			case 'reorder':       isCorrect.value = JSON.stringify(reorderSelection.value) === JSON.stringify(task.value.correctOrder); break
			case 'textToSpeech':  isCorrect.value = true; break
		}

		if (isCorrect.value) {
			correctCount.value += 1
		} else if (!skipLives) {
			const before = lives.value
			lives.value = Math.max(0, lives.value - 1)
			// если было 5 и стало 4 — запускаем таймер
			if (before === maxLives && lives.value < maxLives) {
				lastLifeAtMs.value = Date.now()
			}
			await saveLivesToRoot()
		}

		showResult.value = true
	}

	async function nextTask(skipLives = false) {
		if (finished.value) return
		showResult.value = false

		if (!skipLives && lives.value <= 0) {
			finished.value = true
			return
		}

		if (currentIndex.value + 1 >= requiredTasks.value) {
			finished.value = true
		} else {
			currentIndex.value += 1
		}
		resetInputs()
	}

	function restart(/* skipLivesMode = false */) {
		currentIndex.value = 0
		correctCount.value = 0
		finished.value = false
		showResult.value = false
		isCorrect.value = false
		quest.value = null
		sessionStarted.value = false
		resetInputs()

		// глобальные жизни НЕ трогаем
		if (lives.value < maxLives && !lastLifeAtMs.value) {
			lastLifeAtMs.value = Date.now()
		}
	}

	// по завершении квеста — сохраним прогресс (жизни глобальные не меняем)
	watch(finished, async (v) => { if (v) { try { await saveFinalProgress() } catch {} } })

	// подготовка для reorder
	watch(task, newTask => {
		if (newTask && newTask.type === 'reorder') {
			reorderBank.value = [...newTask.words]
			reorderSelection.value = []
		}
	})

	return {
		// state
		quest,
		loading,
		error,
		currentIndex,
		correctCount,
		finished,
		showResult,
		isCorrect,
		selected,
		userInput,
		reorderSelection,
		reorderBank,

		// computed
		requiredTasks,
		minCorrect,
		task,
		success,
		correctAnswer,
		isConfirmDisabled,

		// lives (GLOBAL)
		lives,
		maxLives,

		// misc
		questProgress,
		sessionStarted,
		justAwarded,

		// api
		loadProgressFromFirebase,
		loadQuest,
		choose,
		handleReorderWord,
		confirm,
		restart,
		nextTask,

		// опционально на экспорт — если захочешь дергать вручную
		applyLifeRegenIfNeeded,
		saveLivesToRoot,
	}
})
