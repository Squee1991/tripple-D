import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { regions } from '~/utils/regions.js'
import { doc, getDoc, getFirestore, runTransaction, increment, setDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const REGEN_INTERVAL_MS = 10 * 1000
const MAX_LIVES = 5

export const userChainStore = defineStore('chain', () => {
	const db = getFirestore()
	const quest = ref(null)
	const loading = ref(true)
	const error = ref('')
	const currentIndex = ref(0)
	const correctCount = ref(0)
	const answeredCount = ref(0)
	const finished = ref(false)
	const showResult = ref(false)
	const isCorrect = ref(false)
	const answers = ref([])
	const selected = ref('')
	const userInput = ref('')
	const reorderSelection = ref([])
	const reorderBank = ref([])
	const maxLives = MAX_LIVES
	const lives = ref(maxLives)
	const lastLifeAtMs = ref(0)
	const confirming = ref(false)
	const advancing = ref(false)
	const lifeSpentThisStep = ref(false)
	const currentQuestId = ref('')
	const currentRegionKey = ref('')
	const questProgress = ref({})
	const sessionStarted = ref(false)
	const justAwarded = ref(false)
	let lifeTickerId = null
	const requiredTasks = computed(() => quest.value?.conditions?.requiredTasks ?? quest.value?.tasks?.length ?? 0)
	const minCorrect = computed(() => quest.value?.conditions?.minCorrect ?? requiredTasks.value)
	const task = computed(() => (finished.value ? null : (quest.value?.tasks?.[currentIndex.value] ?? null)))
	const success = computed(() => correctCount.value >= minCorrect.value)
	const progressEntry = computed(() => questProgress.value[currentQuestId.value] || null)
	const rewardClaimed = computed(() => !!progressEntry.value?.rewardClaimed)
	const correctAnswer = computed(() => {
		if (!task.value) return ''
		return (
			task.value.answer ||
			task.value.correctAnswer ||
			(task.value.correctOrder ? task.value.correctOrder.join(' ') : '') ||
			''
		)
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
			const unsub = onAuthStateChanged(auth, u => {
				unsub()
				resolve(u || null)
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

			const l = typeof data.lives === 'number' ? data.lives : maxLives
			const ts = typeof data.lastLifeAtMs === 'number' ? data.lastLifeAtMs : 0
			lives.value = Math.max(0, Math.min(maxLives, l))
			lastLifeAtMs.value = ts || (lives.value < maxLives ? Date.now() : 0)
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
		if (!sessionStarted.value) return
		const userRef = await getUserRef()
		if (!userRef) return

		await runTransaction(db, async (tx) => {
			const snap = await tx.get(userRef)
			const data = snap.exists() ? (snap.data() || {}) : {}
			const qp = data.questProgress || {}
			const prev = qp[currentQuestId.value] || {}
			if (prev.success) {
				questProgress.value = { ...questProgress.value, [currentQuestId.value]: prev }
				return
			}

			const answered = Math.min(answeredCount.value, requiredTasks.value)
			const percent = requiredTasks.value
				? Math.max(0, Math.min(100, Math.round((correctCount.value / requiredTasks.value) * 100)))
				: 0

			// const answered = Math.min(answeredCount.value, requiredTasks.value)
			// const percent = requiredTasks.value
			// 	? Math.max(0, Math.min(100, Math.round((answered / requiredTasks.value) * 100)))
			// 	: 0

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
				answeredCount: answered,
				completed: true,
				success: success.value,
				rewardClaimed: reward,
				timesCompleted,
				livesAtFinish: lives.value,
				updatedAtMs: Date.now()
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
			const allRegionKeys = regions.map(r => r.pathTo)
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
			const changed = applyLifeRegenIfNeeded()
			if (changed) await saveLivesToRoot()

			startLifeTicker()
		} catch (e) {
			error.value = e.message || String(e)
		} finally {
			loading.value = false
		}
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
		showResult.value = true

		try {
			answeredCount.value = Math.min(answeredCount.value + 1, requiredTasks.value)
			if (isCorrect.value) {
				correctCount.value += 1
			} else if (!skipLives && !lifeSpentThisStep.value) {
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
		if (currentIndex.value + 1 >= requiredTasks.value) {
			finished.value = true
		} else {
			currentIndex.value += 1
		}
		resetInputs()
		advancing.value = false
	}

	function restart() {
		currentIndex.value = 0
		correctCount.value = 0
		answeredCount.value = 0
		finished.value = false
		showResult.value = false
		isCorrect.value = false
		sessionStarted.value = false
		answers.value = []
		resetInputs()
		if (lives.value < maxLives && !lastLifeAtMs.value) lastLifeAtMs.value = Date.now()
	}

	function resetViewState() {
		loading.value = true
		error.value = ''
		justAwarded.value = false
		quest.value = null
		currentIndex.value = 0
		correctCount.value = 0
		answeredCount.value = 0
		finished.value = false
		showResult.value = false
		isCorrect.value = false
		answers.value = []
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
		answeredCount,
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
		correctAnswer,
		isConfirmDisabled,

		lives,
		maxLives,

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

		applyLifeRegenIfNeeded,
		saveLivesToRoot
	}
})
