<template>
  <main class="feedback-page">
    <div class="overlay">
      <section class="modal" v-if="!feedbackSent">
        <div v-if="!surveyStarted" class="modal__inner">
          <div class="modal__title">
            <h2>Помоги нам стать лучше</h2>
          </div>
          <div class="modal__content">
            <div class="intro-block">
              <p class="intro-text">
                Мы собираем честный фидбек, чтобы сделать обучение удобнее и полезнее.
              </p>
              <p class="intro-subtext">
                Опрос займёт около 30 секунд. Нам правда важно твоё мнение 💛
              </p>
            </div>
            <footer class="footer footer--center">
              <button type="button" class="button button--primary" @click="startSurvey">
                Пройти опрос
              </button>
            </footer>
          </div>
        </div>

        <div v-else class="modal__inner">
          <div class="modal__title">
            <h2>Помоги нам улучшить наш сайт</h2>
          </div>
          <div class="modal__content">
            <header class="modal-header">
              <div class="progress-text">
                Вопрос {{ currentStepIndex + 1 }} из {{ questions.length }}
              </div>
              <div class="progress-bar">
                <div
                    class="progress-fill"
                    :style="{ width: ((currentStepIndex + 1) / questions.length) * 100 + '%' }"
                ></div>
              </div>
            </header>

            <form class="form" @submit.prevent="handleNextOrSubmit">
              <div class="question-block">
                <p class="question-title">{{ currentQuestion.title }}</p>

                <div v-if="currentQuestion.type === 'choices'" class="choices">
                  <button
                      v-for="option in currentQuestion.options"
                      :key="option"
                      type="button"
                      class="choice"
                      :class="{ 'choice--selected': isOptionSelected(option) }"
                      @click="toggleOption(option)"
                  >
                    {{ option }}
                  </button>
                </div>

                <div v-else-if="currentQuestion.type === 'rating'" class="rating">
                  <button
                      v-for="(icon, index) in ratingIcons"
                      :key="index"
                      type="button"
                      class="rating-button"
                      @click="setRating(index + 1)"
                  >
                    <img
                        :src="icon"
                        :alt="`${index + 1} из 5`"
                        class="rating-image"
                        :class="{ 'rating-image--active': getCurrentRatingValue() >= index + 1 }"
                    />
                  </button>
                </div>

                <textarea
                    v-if="currentQuestion.commentKey"
                    v-model="feedbackData[currentQuestion.commentKey]"
                    class="comment-input"
                    :rows="currentQuestion.rows || 2"
                    :placeholder="currentQuestion.placeholder"
                ></textarea>

                <p v-if="currentErrorMessage" class="error-message">
                  {{ currentErrorMessage }}
                </p>
              </div>

              <footer class="footer">
                <button
                    v-if="currentStepIndex > 0"
                    type="button"
                    class="button button--secondary"
                    @click="previousStep"
                >
                  Назад
                </button>
                <button
                    type="submit"
                    class="button button--primary"
                    :disabled="!isStepValid"
                >
                  {{ isLastStep ? 'Отправить' : 'Далее' }}
                </button>
              </footer>
            </form>
          </div>
        </div>
      </section>

      <section class="modal modal--thanks" v-else>
        <h2 class="thanks-title">Спасибо за отзыв!</h2>
        <img class="send__email" :src="SendEmail" alt="">
        <p class="thanks-message">
          Мы ценим ваше мнение — оно помогает сделать сайт лучше.
        </p>
        <button class="button button--primary" @click="resetForm">Закрыть</button>
      </section>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { userAuthStore } from '../store/authStore.js'
import OnePoint from '../assets/images/feedback-images/1point.svg'
import TwoPoint from '../assets/images/feedback-images/2point.svg'
import ThreePoint from '../assets/images/feedback-images/3point.svg'
import FourPoint from '../assets/images/feedback-images/4point.svg'
import FivePoint from '../assets/images/feedback-images/5point.svg'
import SendEmail from '../assets/images/feedback-images/send-mail.svg'

const db = getFirestore()
const authStore = userAuthStore()

const ratingIcons = [OnePoint, TwoPoint, ThreePoint, FourPoint, FivePoint]
const feedbackData = reactive({})
const currentStepIndex = ref(0)
const feedbackSent = ref(false)
const surveyStarted = ref(false)
const isSubmitting = ref(false)

const questions = [
  {
    type: 'rating',
    title: 'Насколько полезны наши задания?',
    dataKey: 'usefulnessRating',
    commentKey: 'usefulnessComment',
    placeholder: 'Что было непонятно или что стоит улучшить?'
  },
  {
    type: 'choices',
    title: 'Какие задания тебе хочется видеть больше?',
    dataKey: 'selectedTasks',
    commentKey: 'taskComment',
    selectMode: 'multi',
    options: [
      'Меня всё устраивает',
      'Больше аудио',
      'Больше говорение',
      'Больше заданий по темам'
    ],
    placeholder: 'Например: «Хочу больше заданий по теме Еда»'
  },
  {
    type: 'choices',
    title: 'Возникали ли у тебя ошибки или баги?',
    dataKey: 'interfaceIssues',
    commentKey: 'interfaceIssuesComment',
    selectMode: 'multi',
    options: ['да', 'нет'],
    placeholder: 'Если да, то какие...',
    rows: 3
  },
  {
    type: 'choices',
    title: 'Как тебе упражнения на сайте?',
    dataKey: 'exerciseFeedback',
    commentKey: 'exerciseFeedbackComment',
    selectMode: 'single',
    options: ['Нравятся', 'Нормально', 'Можно лучше', 'Не нравятся'],
    placeholder: 'Если хочешь — напиши подробнее'
  },
  {
    type: 'rating',
    title: 'Насколько ты доволен обучением у нас?',
    dataKey: 'siteRating',
    commentKey: 'siteWishes',
    placeholder: 'Что нравится? Что улучшить?',
    rows: 3
  }
]

const errorMessages = {
  usefulnessRating: 'Поставь оценку или напиши, что можно улучшить.',
  selectedTasks: 'Пожалуйста, уточни, какие задания нужны.',
  interfaceIssues: 'Пожалуйста, опиши, что именно не так.',
  exerciseFeedback: 'Выбери вариант или напиши свой комментарий.',
  siteRating: 'Поставь оценку или напиши свои пожелания.'
}

questions.forEach(question => {
  if (question.selectMode === 'multi') {
    feedbackData[question.dataKey] = []
  } else if (question.type === 'rating') {
    feedbackData[question.dataKey] = 0
  } else {
    feedbackData[question.dataKey] = ''
  }

  if (question.commentKey) {
    feedbackData[question.commentKey] = ''
  }
})

const currentQuestion = computed(() => questions[currentStepIndex.value])
const isLastStep = computed(() => currentStepIndex.value === questions.length - 1)

const validateStep = (question, data) => {
  if (!question) return false

  if (question.dataKey === 'usefulnessRating') {
    return data.usefulnessRating > 0 || data.usefulnessComment?.trim().length > 0
  }

  if (question.dataKey === 'selectedTasks') {
    const tasks = data.selectedTasks || []
    const hasContent = tasks.length > 0 || data.taskComment?.trim().length > 0
    const needsDetail =
        tasks.some(t => t !== 'Меня всё устраивает') && !data.taskComment?.trim()
    return hasContent && !needsDetail
  }

  if (question.dataKey === 'interfaceIssues') {
    const issues = data.interfaceIssues || []
    const hasSelection = issues.length > 0
    const hasComment = data.interfaceIssuesComment?.trim().length > 0
    if (!hasSelection && !hasComment) return false
    if (issues.includes('да') && !hasComment) return false
    return true
  }

  if (question.dataKey === 'exerciseFeedback') {
    return !!data.exerciseFeedback || data.exerciseFeedbackComment?.trim().length > 0
  }

  if (question.dataKey === 'siteRating') {
    return data.siteRating > 0 || data.siteWishes?.trim().length > 0
  }

  return true
}

const getErrorMessage = (question, data) => {
  if (!question) return null
  const isValid = validateStep(question, data)
  if (isValid) return null
  return errorMessages[question.dataKey] || null
}

const isStepValid = computed(() => validateStep(currentQuestion.value, feedbackData))
const currentErrorMessage = computed(() => getErrorMessage(currentQuestion.value, feedbackData))

const getCurrentRatingValue = () => {
  return feedbackData[currentQuestion.value.dataKey]
}

const setRating = value => {
  feedbackData[currentQuestion.value.dataKey] = value
}

const isOptionSelected = option => {
  const key = currentQuestion.value.dataKey
  const value = feedbackData[key]
  if (Array.isArray(value)) {
    return value.includes(option)
  }
  return value === option
}

const toggleOption = option => {
  const key = currentQuestion.value.dataKey
  if (currentQuestion.value.selectMode === 'multi') {
    const list = feedbackData[key]
    const index = list.indexOf(option)
    if (index === -1) {
      list.push(option)
    } else {
      list.splice(index, 1)
    }
  } else {
    feedbackData[key] = option
  }
}

const submitFeedback = async () => {
  try {
    isSubmitting.value = true

    const plainAnswers = {}
    Object.keys(feedbackData).forEach(key => {
      plainAnswers[key] = feedbackData[key]
    })

    const payload = {
      userId: authStore.user?.uid || null,
      createdAt: serverTimestamp(),
      answers: plainAnswers
    }

    await addDoc(collection(db, 'feedbackSurvey'), payload)
    feedbackSent.value = true
  } catch (e) {
    console.error('Ошибка отправки feedback:', e)
  } finally {
    isSubmitting.value = false
  }
}

const handleNextOrSubmit = async () => {
  if (!isStepValid.value || isSubmitting.value) return

  if (isLastStep.value) {
    await submitFeedback()
  } else {
    currentStepIndex.value++
  }
}

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

const resetForm = () => {
  feedbackSent.value = false
  surveyStarted.value = false
  currentStepIndex.value = 0
  Object.keys(feedbackData).forEach(key => {
    const value = feedbackData[key]
    if (Array.isArray(value)) {
      feedbackData[key] = []
    } else if (typeof value === 'number') {
      feedbackData[key] = 0
    } else {
      feedbackData[key] = ''
    }
  })
}

const startSurvey = () => {
  surveyStarted.value = true
}
</script>


<style scoped>
.send__email {
  width: 150px;
  margin-bottom: 10px;
}

.feedback-page {
  min-height: 100vh;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.modal {
  width: 460px;
  max-width: 100%;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.25);
  overflow: hidden;
}

.modal__inner {
  display: flex;
  flex-direction: column;
}

.modal__title {
  width: 100%;
  background: #c74c71;
  padding: 10px;
  text-align: center;
  color: white;
}

.modal__content {
  padding: 20px;
}

.modal-header {
  margin-bottom: 12px;
}

.progress-bar {
  width: 100%;
  height: 15px;
  background: #e5e7eb;
  border-radius: 999px;
  margin-top: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #656a71;
  transition: width 0.25s ease;
}

.progress-text {
  font-size: 15px;
  color: #6b7280;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.question-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.question-title {
  margin: 0;
  font-size: 18px;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  color: #111827;
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.choice {
  padding: 6px 12px;
  border-radius: 14px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.choice--selected {
  background: #fde047;
  border-color: #facc15;
}

.rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 7px;
}

.rating-button {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.rating-image {
  width: 50px;
  height: 50px;
  display: block;
  filter: grayscale(100%);
  opacity: 0.4;
  transition: all 0.15s;
}

.rating-image--active {
  filter: none;
  opacity: 1;
  transform: translateY(-1px);
}

.comment-input {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 8px 10px;
  font-size: 13px;
  resize: none;
  height: 75px;
}

.error-message {
  font-size: 12px;
  color: #b91c1c;
  margin: 0;
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px dashed #e5e7eb;
}

.footer--center {
  justify-content: center;
}

.button {
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 14px;
  border: 1px solid #111827;
  cursor: pointer;
  transition: opacity 0.15s;
  min-width: 120px;
  font-weight: 600;
}

.button--primary {
  background: #d6d6d6;
}

.button--secondary {
  background: #7C5CD6;
  color: white;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal--thanks {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.thanks-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}

.thanks-message {
  font-size: 14px;
  color: #374151;
  margin-bottom: 16px;
  padding: 0 20px;
  max-width: 80%;
  width: 80%;
}

.intro-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.intro-text {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.intro-subtext {
  font-size: 14px;
  color: #4b5563;
}
</style>
