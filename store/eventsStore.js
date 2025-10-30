import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useEventSessionStore = defineStore('eventSession', () => {
	const eventId = ref('')
	const questId = ref('')
	const stepIndex = ref(0)
	const score = ref(0)
	const finished = ref(false)
	const start = (id, qid) => {
		eventId.value = String(id || '')
		questId.value = String(qid || '')
		stepIndex.value = 0
		score.value = 0
		finished.value = false
	}

	const restoreIfPossible = (id) => {
		eventId.value = String(id || '')
		questId.value = ''
		stepIndex.value = 0
		score.value = 0
		finished.value = false
		return true
	}

	const next = (totalSteps) => {
		if (stepIndex.value + 1 < totalSteps) stepIndex.value++
	}

	const prev = () => {
		if (stepIndex.value > 0) stepIndex.value--
	}

	const addScore = (n = 1) => {
		score.value += n
	}

	const finishQuest = () => {
		finished.value = true
	}

	const resetAllForEvent = () => {
		eventId.value = ''
		questId.value = ''
		stepIndex.value = 0
		score.value = 0
		finished.value = false
	}

	return {
		// state
		eventId,
		questId,
		stepIndex,
		score,
		finished,
		// actions
		start,
		restoreIfPossible,
		next,
		prev,
		addScore,
		finishQuest,
		resetAllForEvent
	}
})
