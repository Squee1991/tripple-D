import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { regions } from '~/utils/regions.js'
import { doc, getDoc, getFirestore, runTransaction, increment, setDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {dailyStore } from './dailyStore.js'
const REGEN_INTERVAL_MS = 5 * 60 * 1000
const MAX_LIVES = 5

export const userChainStore = defineStore('chain', () => {
	const db = getFirestore()
	const quest = ref(null)
	const loading = ref(true)
	const error = ref('')
	const finished = ref(false)
	const showResult = ref(false)
	const isCorrect = ref(false)
	const selected = ref('')
	const userInput = ref('')
	const reorderSelection = ref([])
	const reorderBank = ref([])
	const lives = ref(MAX_LIVES)
	const maxLives = MAX_LIVES
	const lastLifeAtMs = ref(0)
	const confirming = ref(false)
	const advancing = ref(false)
	const lifeSpentThisStep = ref(false)
	const currentQuestId = ref('')
	const currentRegionKey = ref('')
	const questProgress = ref({})
	const sessionStarted = ref(false)
	const justAwarded = ref(false)
	const activeQueue = ref([])
	const internalIndex = ref(0)
	const taskResults = ref({})
	const isRetryMode = ref(false)
    const daily = dailyStore()
	let lifeTickerId = null

	const totalQuestTasks = computed(() => quest.value?.conditions?.requiredTasks ?? quest.value?.tasks?.length ?? 0)
	const minCorrect = computed(() => quest.value?.conditions?.minCorrect ?? totalQuestTasks.value)
	const currentTaskIndex = computed(() => {
		if (activeQueue.value.length === 0) return -1
		return activeQueue.value[internalIndex.value]
	})

	const task = computed(() => {
		if (finished.value || !quest.value?.tasks) return null
		const index = currentTaskIndex.value
		return index > -1 ? quest.value.tasks[index] : null
	})

	const requiredTasks = computed(() => activeQueue.value.length)
	const currentIndex = computed(() => internalIndex.value)
	const correctCount = computed(() => {
		return Object.values(taskResults.value).filter(Boolean).length
	})
	const hasMistakes = computed(() => {
		return correctCount.value < totalQuestTasks.value
	})

	const success = computed(() => {
		return correctCount.value >= minCorrect.value
	})

	const progressEntry = computed(() => questProgress.value[currentQuestId.value] || null)

	const answers = computed(() => {
		const result = []
		for (let i = 0; i < requiredTasks.value; i++) {
			const originalIndex = activeQueue.value[i]
			if (taskResults.value[originalIndex] !== undefined) {
				result.push({ correct: taskResults.value[originalIndex] })
			}
		}
		return result
	})

	const correctAnswer = computed(() => {
		if (!task.value) return ''
		return (
			task.value.answer ||
			task.value.correctAnswer ||
			(task.value.correctOrder ? task.value.correctOrder.join(' ') : '') ||
			''
		)
	})

	const questHasAccept = computed(() => {
		const tasks = quest.value?.tasks || []
		return tasks.some((taskItem) => Array.isArray(taskItem.accept) && taskItem.accept.length > 0)
	})

	const isConfirmDisabled = computed(() => {
		if (showResult.value) return true
		if (!task.value) return true
		switch (task.value.type) {
			case 'select':
			case 'readAndAnswer':
				return !selected.value
			case 'input':
			case 'speechToText':
				return !userInput.value.trim()
			case 'reorder':
				return reorderSelection.value.length === 0
			case 'textToSpeech':
				return false
			default:
				return true
		}
	})

	function normalizeSpeechText(text) {
		return String(text || '')
			.toLowerCase()
			.normalize('NFKD')
			.replace(/[\u200B-\u200D\uFEFF]/g, '')
			.replace(/[’‘ʼ´`"“”„]/g, '')
			.replace(/[\u00A0\u202F]/g, ' ')
			.replace(/[^0-9a-zäöüß\s]/gi, '')
			.replace(/\s+/g, ' ')
			.trim()
	}

	function resetInputs() {
		selected.value = ''
		userInput.value = ''
		reorderSelection.value = []
		reorderBank.value = []
		lifeSpentThisStep.value = false
	}

	function waitForAuthUser() {
		const auth = getAuth()
		if (auth.currentUser) return Promise.resolve(auth.currentUser)
		return new Promise(resolve => {
			const unsub = onAuthStateChanged(auth, user => {
				unsub()
				resolve(user || null)
			})
		})
	}

	async function getUserRef() {
		const user = await waitForAuthUser()
		if (!user) return null
		return doc(db, 'users', user.uid)
	}

	function applyLifeRegenIfNeeded() {
		if (lives.value >= maxLives) return false
		if (!lastLifeAtMs.value) lastLifeAtMs.value = Date.now()
		const now = Date.now()
		const ticks = Math.floor((now - lastLifeAtMs.value) / REGEN_INTERVAL_MS)
		if (ticks <= 0) return false

		const gained = Math.min(maxLives - lives.value, ticks)
		if (gained > 0) {
			lives.value += gained
			lastLifeAtMs.value += gained * REGEN_INTERVAL_MS
			if (lives.value >= maxLives) {
				lives.value = maxLives
				lastLifeAtMs.value = 0
			}
			return true
		}
		return false
	}

	async function saveLivesToRoot() {
		const userRef = await getUserRef()
		if (!userRef) return
		await setDoc(userRef, { lives: lives.value, lastLifeAtMs: lastLifeAtMs.value }, { merge: true })
	}

	function startLifeTicker() {
		if (typeof window === 'undefined') return
		if (lifeTickerId) return
		lifeTickerId = window.setInterval(() => {
			const changed = applyLifeRegenIfNeeded()
			if (changed) void saveLivesToRoot()
		}, 1000)
	}

	async function addLife(count = 1) {
		lives.value = Math.min(maxLives, Math.max(0, (lives.value || 0) + count))
		if (lives.value >= maxLives) {
			lastLifeAtMs.value = 0
		} else {
			if (!lastLifeAtMs.value) lastLifeAtMs.value = Date.now()
		}
		await saveLivesToRoot()
	}

	async function loadProgressFromFirebase() {
		const userRef = await getUserRef()
		if (!userRef) return
		const snap = await getDoc(userRef)
		if (snap.exists()) {
			const data = snap.data() || {}
			questProgress.value = data.questProgress || {}

			const loadedLives = typeof data.lives === 'number' ? data.lives : maxLives
			const timestamp = typeof data.lastLifeAtMs === 'number' ? data.lastLifeAtMs : 0
			lives.value = Math.max(0, Math.min(maxLives, loadedLives))
			lastLifeAtMs.value = timestamp || (lives.value < maxLives ? Date.now() : 0)
		} else {
			lives.value = maxLives
			lastLifeAtMs.value = 0
			questProgress.value = {}
			await setDoc(userRef, { lives: maxLives, lastLifeAtMs: 0, questProgress: {} }, { merge: true })
		}
		const changed = applyLifeRegenIfNeeded()
		if (changed) await saveLivesToRoot()
		startLifeTicker()
	}

	async function saveFinalProgress() {
		if (!currentQuestId.value) return
		if (!sessionStarted.value && !isRetryMode.value) return
		const userRef = await getUserRef()
		if (!userRef) return
		if (success.value) {
			if (!isRetryMode.value) {
				daily.addLandQuestion(1)
			}
			if (!hasMistakes.value) {
				daily.addPerfectQuest(1)
			}
		}
		const currentWrongIndices = []
		for (let i = 0; i < totalQuestTasks.value; i++) {
			if (taskResults.value[i] === false) {
				currentWrongIndices.push(i)
			} else if (taskResults.value[i] === undefined) {
			}
		}
		await runTransaction(db, async (tx) => {
			const snap = await tx.get(userRef)
			const data = snap.exists() ? (snap.data() || {}) : {}
			const qp = data.questProgress || {}
			const prev = qp[currentQuestId.value] || {}
			const isSuccessNow = success.value
			if (prev.success && (!prev.wrongIndices || prev.wrongIndices.length === 0) && (prev.correctCount === prev.requiredTasks) && !isRetryMode.value) {
				questProgress.value = { ...questProgress.value, [currentQuestId.value]: prev }
				return
			}
			const finalCorrectCount = currentWrongIndices.length === 0 ? totalQuestTasks.value : correctCount.value

			const percent = totalQuestTasks.value
				? Math.max(0, Math.min(100, Math.round((finalCorrectCount / totalQuestTasks.value) * 100)))
				: 0

			let reward = !!prev.rewardClaimed
			let timesCompleted = Number(prev.timesCompleted || 0)
			const isFirstSuccess = isSuccessNow && !prev.success
			if (isFirstSuccess) timesCompleted += 1
			let awardedNow = false
			if (isSuccessNow && !reward) {
				tx.set(userRef, { points: increment(20), exp: increment(20) }, { merge: true })
				reward = true
				awardedNow = true
			}

			const p = {
				region: currentRegionKey.value || null,
				progressPercent: percent,
				correctCount: finalCorrectCount,
				requiredTasks: totalQuestTasks.value,
				answeredCount: totalQuestTasks.value,
				completed: true,
				success: isSuccessNow,
				rewardClaimed: reward,
				timesCompleted,
				livesAtFinish: lives.value,
				updatedAtMs: Date.now(),
				wrongIndices: currentWrongIndices
			}

			tx.set(userRef, { questProgress: { [currentQuestId.value]: p } }, { merge: true })
			questProgress.value = { ...questProgress.value, [currentQuestId.value]: p }
			justAwarded.value = awardedNow
		})
	}

	async function loadQuest(questId, regionKey) {
		loading.value = true
		error.value = ''
		quest.value = null
		resetViewState()
		currentQuestId.value = String(questId || '')
		currentRegionKey.value = String(regionKey || '')
		justAwarded.value = false

		try {
			const flatRegions = Object.values(regions).flat()
			const allRegionKeys = flatRegions.map(r => r.pathTo)
			const tryLoadFrom = async (region) => {
				const res = await fetch(`/quests/quests-${region}.json`)
				if (!res.ok) return null
				const list = await res.json()
				const arr = Array.isArray(list) ? list : [list]
				return arr.find(q => String(q.questId) === String(questId)) || null
			}

			if (regionKey) {
				const q = await tryLoadFrom(regionKey)
				if (q) quest.value = q
			}
			if (!quest.value) {
				for (const key of allRegionKeys) {
					const q = await tryLoadFrom(key)
					if (q) {
						quest.value = q
						currentRegionKey.value = key
						break
					}
				}
			}
			if (!quest.value) throw new Error('Квест не найден')

			await loadProgressFromFirebase()
			await migrateByAliases(quest.value)
			const savedProgress = questProgress.value[currentQuestId.value]
			if (savedProgress && savedProgress.success && savedProgress.wrongIndices && savedProgress.wrongIndices.length > 0) {
				startRetryMistakes(savedProgress.wrongIndices)
				const total = totalQuestTasks.value
				for (let i = 0; i < total; i++) {
					if (!savedProgress.wrongIndices.includes(i)) {
						taskResults.value[i] = true
					} else {
						taskResults.value[i] = false
					}
				}
			} else {
				initializeTaskQueue(quest.value.tasks.length)
			}
			const changed = applyLifeRegenIfNeeded()
			if (changed) await saveLivesToRoot()
			startLifeTicker()
		} catch (e) {
			error.value = e.message || String(e)
		} finally {
			loading.value = false
		}
	}

	function initializeTaskQueue(length) {
		activeQueue.value = Array.from({ length }, (_, i) => i)
		taskResults.value = {}
		internalIndex.value = 0
		isRetryMode.value = false
	}

	function choose(opt) {
		if (finished.value || showResult.value) return
		selected.value = opt
	}

	function handleReorderWord(word, from) {
		if (showResult.value) return
		const source = from === 'bank' ? reorderBank.value : reorderSelection.value
		const dest = from === 'bank' ? reorderSelection.value : reorderBank.value
		const index = source.findIndex(item => item === word)
		if (index > -1) {
			const [moved] = source.splice(index, 1)
			dest.push(moved)
		}
	}

	async function confirm(skipLives = false) {
		if (confirming.value) return
		if (isConfirmDisabled.value || !task.value) return
		confirming.value = true
		sessionStarted.value = true
		switch (task.value.type) {
			case 'select':
			case 'readAndAnswer':
				isCorrect.value = selected.value === task.value.answer
				break
			case 'input': {
				const rawUser = userInput.value
				const rawAns = task.value.correctAnswer || task.value.answer || ''
				const user = normalizeSpeechText(rawUser)
				const ans = normalizeSpeechText(rawAns)
				isCorrect.value = user === ans
				break
			}
			case 'speechToText': {
				const userRawInput = userInput.value;
				const normalizedUserInput = normalizeSpeechText(userRawInput);
				const acceptedAnswers = Array.isArray(task.value.accept) && task.value.accept.length > 0
					? task.value.accept
					: [task.value.answer || task.value.correctAnswer || ''];
				const isUserAnswerCorrect = acceptedAnswers.some((acceptedAnswer) => {
					const normalizedAcceptedAnswer = normalizeSpeechText(acceptedAnswer);
					return normalizedAcceptedAnswer === normalizedUserInput;
				});

				isCorrect.value = isUserAnswerCorrect;
				break;
			}
			case 'reorder':
				isCorrect.value = JSON.stringify(reorderSelection.value) === JSON.stringify(task.value.correctOrder || [])
				break
			case 'textToSpeech':
				isCorrect.value = true
				break
			default:
				isCorrect.value = false
		}

		const originalIndex = currentTaskIndex.value
		taskResults.value[originalIndex] = isCorrect.value
		showResult.value = true
		try {
			if (!isCorrect.value && !skipLives && !lifeSpentThisStep.value) {
				const before = lives.value
				lives.value = Math.max(0, lives.value - 1)
				lifeSpentThisStep.value = true
				if (before === maxLives && lives.value < maxLives) {
					lastLifeAtMs.value = Date.now()
				}
				await saveLivesToRoot()
			}
		} finally {
			confirming.value = false
		}
	}

	async function nextTask(skipLives = false) {
		if (finished.value) return
		if (advancing.value) return
		advancing.value = true
		showResult.value = false
		if (!skipLives && lives.value <= 0) {
			finished.value = true
			advancing.value = false
			return
		}
		if (internalIndex.value + 1 >= activeQueue.value.length) {
			finished.value = true
		} else {
			internalIndex.value += 1
		}
		resetInputs()
		advancing.value = false
	}

	function startRetryMistakes(indices = null) {
		let mistakeIndices = indices
		if (!mistakeIndices) {
			mistakeIndices = []
			for (const [key, val] of Object.entries(taskResults.value)) {
				if (val === false) mistakeIndices.push(Number(key))
			}
		}

		if (mistakeIndices.length === 0) return
		activeQueue.value = mistakeIndices.sort((a, b) => a - b)
		internalIndex.value = 0
		finished.value = false
		showResult.value = false
		isRetryMode.value = true
		resetInputs()
	}

	function restart(fullyCleared = false) {
		const p = questProgress.value[currentQuestId.value]
		const hasSavedMistakes = p && p.success && p.wrongIndices && p.wrongIndices.length > 0
		const hasCurrentMistakes = hasMistakes.value && success.value
		if (hasSavedMistakes || hasCurrentMistakes) {
			let indices = []
			if (hasCurrentMistakes) {
				for (const [key, val] of Object.entries(taskResults.value)) {
					if (val === false) indices.push(Number(key))
				}
			} else {
				indices = p.wrongIndices
			}
			if (indices.length > 0) {
				startRetryMistakes(indices)
				return
			}
		}

		initializeTaskQueue(totalQuestTasks.value)
		finished.value = false
		showResult.value = false
		isCorrect.value = false
		sessionStarted.value = false
		isRetryMode.value = false
		resetInputs()
		if (lives.value < maxLives && !lastLifeAtMs.value) lastLifeAtMs.value = Date.now()
	}

	async function migrateByAliases(questData) {
		if (!questData?.questId || !Array.isArray(questData.aliases) || !questData.aliases.length) return
		const newId = String(questData.questId)
		if (questProgress.value?.[newId]) return
		const userRef = await getUserRef()
		if (!userRef) return
		await runTransaction(db, async (tx) => {
			const snap = await tx.get(userRef)
			if (!snap.exists()) return
			const data = snap.data() || {}
			const qp = { ...(data.questProgress || {}) }
			if (qp[newId]) return
			const found = questData.aliases
				.map(id => qp[id])
				.filter(Boolean)
				.sort((a, b) => {
					const as = a.success ? 1 : 0
					const bs = b.success ? 1 : 0
					if (as !== bs) return bs - as
					return (b.updatedAtMs || 0) - (a.updatedAtMs || 0)
				})[0]
			if (!found) return
			qp[newId] = found
			questData.aliases.forEach(id => delete qp[id])
			tx.set(userRef, { questProgress: qp }, { merge: true })
		})
		const local = questData.aliases
			.map(id => questProgress.value[id])
			.filter(Boolean)
			.sort((a, b) => {
				const as = a.success ? 1 : 0
				const bs = b.success ? 1 : 0
				if (as !== bs) return bs - as
				return (b.updatedAtMs || 0) - (a.updatedAtMs || 0)
			})[0]
		if (local) {
			questProgress.value[newId] = local
			questData.aliases.forEach(id => delete questProgress.value[id])
		}
	}

	function resetViewState() {
		loading.value = true
		error.value = ''
		justAwarded.value = false
		quest.value = null
		internalIndex.value = 0
		finished.value = false
		showResult.value = false
		isCorrect.value = false
		taskResults.value = {}
		activeQueue.value = []
		isRetryMode.value = false
		sessionStarted.value = false
		resetInputs()
	}

	watch(finished, async (v) => {
		if (v) {
			try {
				await saveFinalProgress()
			} catch {}
		}
	})

	watch(task, (newTask) => {
		if (newTask && newTask.type === 'reorder') {
			reorderBank.value = [...(newTask.words || [])]
			reorderSelection.value = []
		}
		lifeSpentThisStep.value = false
	})

	if (typeof window !== 'undefined') {
		startLifeTicker()
	}

	return {
		quest,
		loading,
		error,
		currentIndex,
		correctCount,
		finished,
		showResult,
		answers,
		isCorrect,
		selected,
		userInput,
		reorderSelection,
		reorderBank,

		requiredTasks,
		minCorrect,
		task,
		success,
		hasMistakes,
		correctAnswer,
		isConfirmDisabled,

		lives,
		maxLives,
		lastLifeAtMs,
		REGEN_INTERVAL_MS,

		questProgress,
		sessionStarted,
		justAwarded,
		questHasAccept,
		confirming,
		advancing,
		lifeSpentThisStep,

		addLife,
		loadProgressFromFirebase,
		loadQuest,
		choose,
		handleReorderWord,
		confirm,
		restart,
		nextTask,
		startRetryMistakes,
		migrateByAliases,
		applyLifeRegenIfNeeded,
		saveLivesToRoot
	}
})