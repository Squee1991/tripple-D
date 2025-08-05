import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useQuizStore = defineStore('quiz', () => {
    const allQuestions = ref([])
    const currentQuestions = ref([])
    const userAnswers = ref({})
    const currentQuestionIndex = ref(0)
    const selectedOption = ref(null)
    const feedback = ref(null)

    const activeQuestion = computed(() => {
        if (currentQuestions.value.length > 0 && currentQuestionIndex.value < currentQuestions.value.length) {
            return currentQuestions.value[currentQuestionIndex.value]
        }
        return null
    })

    const score = computed(() => Object.values(userAnswers.value).filter(a => a.isCorrect).length)
    const quizCompleted = computed(() => currentQuestions.value.length > 0 && currentQuestionIndex.value >= currentQuestions.value.length)

    async function startNewQuiz(fileName) {
        currentQuestions.value = []
        userAnswers.value = {}
        currentQuestionIndex.value = 0
        selectedOption.value = null
        feedback.value = null
        try {
            const response = await fetch(fileName)
            allQuestions.value = await response.json()
        } catch (e) {
            console.error("Failed to load quiz data from:", fileName, e);
            allQuestions.value = []
        }
        if(allQuestions.value && allQuestions.value.length > 0) {
            const shuffled = [...allQuestions.value].sort(() => 0.5 - Math.random())
            currentQuestions.value = shuffled.slice(0, 10)
        }
    }

    function chooseOption(option) {
        if (feedback.value === null) {
            selectedOption.value = option
        }
    }

    function checkAnswer() {
        if (!selectedOption.value || !activeQuestion.value) return
        const isCorrect = selectedOption.value === activeQuestion.value.answer
        feedback.value = isCorrect ? 'correct' : 'incorrect'
        userAnswers.value[currentQuestionIndex.value] = {
            answer: selectedOption.value,
            isCorrect
        }
    }

    function nextQuestion() {
        if (currentQuestionIndex.value < currentQuestions.value.length) {
            currentQuestionIndex.value++
            selectedOption.value = null
            feedback.value = null
        }
    }

    return {
        score,
        quizCompleted,
        activeQuestion,
        currentQuestions,
        selectedOption,
        feedback,
        currentQuestionIndex,
        startNewQuiz,
        chooseOption,
        checkAnswer,
        nextQuestion,
    }
})