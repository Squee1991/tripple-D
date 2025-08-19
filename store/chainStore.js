import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { regions } from '~/utils/regions.js'

export const userChainStore = defineStore('chain', () => {
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

	const requiredTasks = computed(() =>
		quest.value?.conditions?.requiredTasks ?? quest.value?.tasks?.length ?? 0
	)
	const minCorrect = computed(() =>
		quest.value?.conditions?.minCorrect ?? requiredTasks.value
	)
	const task = computed(() =>
		finished.value ? null : quest.value?.tasks?.[currentIndex.value] ?? null
	)
	const success = computed(() => correctCount.value >= minCorrect.value)
	const correctAnswer = computed(() => {
		if (!task.value) return ''
		return (
			task.value.answer ||
			task.value.correctAnswer ||
			task.value.correctOrder?.join(' ') ||
			''
		)
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
	}

	async function loadQuest(questId, regionKey) {
		loading.value = true
		error.value = ''
		quest.value = null
		restart()

		try {
			const allRegionKeys = regions.map(r => r.pathTo)

			const tryLoadFrom = async region => {
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
					if (q) {
						quest.value = q
						break
					}
				}
			}
			if (!quest.value) throw new Error('А нет!!!! нихуя')
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
		const destination =
			from === 'bank' ? reorderSelection.value : reorderBank.value
		const index = source.findIndex(item => item === word)
		if (index > -1) {
			const [movedWord] = source.splice(index, 1)
			destination.push(movedWord)
		}
	}

	function confirm() {
		if (isConfirmDisabled.value) return
		if (!task.value) return

		switch (task.value.type) {
			case 'select':
			case 'readAndAnswer':
				isCorrect.value = selected.value === task.value.answer
				break
			case 'input':
				isCorrect.value =
					userInput.value.trim().toLowerCase() ===
					task.value.correctAnswer.toLowerCase()
				break
			case 'speechToText':
				isCorrect.value =
					userInput.value.trim().toLowerCase() ===
					task.value.answer.toLowerCase()
				break
			case 'reorder':
				isCorrect.value =
					JSON.stringify(reorderSelection.value) ===
					JSON.stringify(task.value.correctOrder)
				break
			case 'textToSpeech':
				isCorrect.value = true
				break
		}

		if (isCorrect.value) correctCount.value += 1
		showResult.value = true
	}

	function nextTask() {
		showResult.value = false
		if (currentIndex.value + 1 >= requiredTasks.value) {
			finished.value = true
		} else {
			currentIndex.value += 1
		}
		resetInputs()
	}


	function restart() {
		currentIndex.value = 0
		correctCount.value = 0
		finished.value = false
		showResult.value = false
		isCorrect.value = false
		quest.value = null
		resetInputs()
	}

	watch(task, newTask => {
		if (newTask && newTask.type === 'reorder') {
			reorderBank.value = [...newTask.words]
			reorderSelection.value = []
		}
	})

	return {
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
		requiredTasks,
		minCorrect,
		task,
		success,
		correctAnswer,
		isConfirmDisabled,
		loadQuest,
		choose,
		handleReorderWord,
		confirm,
		restart,
		nextTask
	}
})
