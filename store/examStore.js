import {defineStore} from "pinia"
import {ref, computed} from 'vue'

export const userExamStore = defineStore('exam', () => {
	const exercises = ref([])
	const currentIndex = ref(0)
	const userAnswers = ref([])
	const loading = ref(false)

	const loadTopics = async (theme) => {
		loading.value = true
		try {
			const res = await fetch(theme)
			const data = await res.json()
			exercises.value = data.modules
			currentIndex.value = 0
			userAnswers.value = []
		} catch (e) {
			console.error('Failed to load topics', e)
		} finally {
			loading.value = false
		}
	}

	const currentExercise = computed(() => exercises.value[currentIndex.value])
	const isFinished = computed(() => currentIndex.value >= exercises.value.length)
	function answerCurrent(userAnswer, feedback = null) {
		const current = currentExercise.value
		if (!current || !current.task || !current.id) {
			console.warn('Нет текущего упражнения — ответ не засчитан')
			return
		}

		const correct = current.task.answer
			? userAnswer === current.task.answer
			: true

		userAnswers.value.push({
			id: current.id,
			answer: userAnswer,
			correct,
			feedback
		})

		currentIndex.value++
	}

	return {
		exercises,
		currentIndex,
		userAnswers,
		currentExercise,
		isFinished,
		loading,
		loadTopics,
		answerCurrent
	}
})
