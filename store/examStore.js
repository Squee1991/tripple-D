import { defineStore } from "pinia"
import { ref, computed } from 'vue'

export const userExamStore = defineStore('exam', () => {
    const exercises = ref([])
    const currentIndex = ref(0)
    const userAnswers = ref([])

    const loadTopics = async (theme) => {
        try {
            const response = await fetch(theme)
            const data = await response.json()
            exercises.value = data.modules
            currentIndex.value = 0
            userAnswers.value = []
        } catch (e) {
            console.log(e, 'error')
        }
    }

    const currentExercise = computed(() => exercises.value[currentIndex.value])
    const isFinished = computed(() => currentIndex.value >= exercises.value.length)

    const answerCurrent = (userAnswer) => {
        const current = currentExercise.value
        const correct = current.task.answer
            ? userAnswer === current.task.answer
            : true

        userAnswers.value.push({
            id: current.id,
            answer: userAnswer,
            correct
        })

        currentIndex.value++
    }

    return {
        exercises,
        currentIndex,
        userAnswers,
        currentExercise,
        isFinished,
        loadTopics,
        answerCurrent
    }
})
