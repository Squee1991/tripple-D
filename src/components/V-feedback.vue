<template>
  <main v-show="feedback" class="feedback-page">
    <div class="overlay" @click.self="closeFeedback">
      <section class="modal" v-if="!feedbackSent">
        <div v-if="!surveyStarted" class="modal__inner">
          <div class="modal__title">
            <h2>Помоги нам стать лучше</h2>
            <button @click="closeFeedback" class="close__feedback">X</button>
          </div>
          <div class="modal__content">
            <div class="intro-block">
              <p class="intro-text">Мы собираем фидбек, чтобы сделать обучение удобнее и лучше.</p>
              <p class="intro-subtext">Опрос займёт 30 секунд. Нам важно твоё мнение 💛</p>
            </div>
            <footer class="footer footer--center">
              <button type="button" class="button button--primary" @click="startSurvey">Пройти опрос</button>
            </footer>
          </div>
        </div>
        <div v-else class="modal__inner">
          <div class="modal__title">
            <h2>Помоги нам улучшить сайт</h2>
          </div>
          <div class="modal__content">
            <header class="modal-header">
              <div class="progress-text">Вопрос {{ currentStepIndex + 1 }} из {{ visibleQuestions.length }}</div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
              </div>
            </header>
            <form class="form" @submit.prevent.stop @keydown.enter.prevent>
              <div class="question-block">
                <p class="question-title">{{ currentQuestion.title }}</p>
                <div v-if="currentQuestion.type === 'choices'" class="choices">
                  <button
                      v-for="option in currentQuestion.options"
                      :key="option.value || option"
                      type="button"
                      class="choice"
                      :class="{ 'choice--selected': isOptionSelected(option), 'choice--has-icon': option.icon }"
                      @click.prevent.stop="toggleOption(option)"
                  >
                    <img v-if="option.icon" :src="option.icon" class="choice-icon" :alt="option.label"/>
                    {{ option.label || option }}
                  </button>
                </div>
                <div v-else-if="currentQuestion.type === 'rating'" class="rating">
                  <button
                      v-for="(icon, index) in ratingIcons"
                      :key="index"
                      type="button"
                      class="rating-button"
                      @click.prevent.stop="setRating(index + 1)"
                  >
                    <img
                        :src="icon"
                        :alt="`${index + 1} из 5`"
                        class="rating-image"
                        :class="{ 'rating-image--active': (answers[currentQuestion.dataKey] || 0) >= index + 1 }"
                    />
                  </button>
                </div>
                <textarea
                    v-if="shouldShowCommentField"
                    v-model="answers[currentQuestion.commentKey]"
                    class="comment-input"
                    :rows="currentQuestion.rows || 2"
                    :placeholder="currentQuestion.placeholder"
                ></textarea>
                <p v-if="validationError" class="error-message">{{ validationError }}</p>
              </div>
              <footer class="footer">
                <button v-if="currentStepIndex > 0" type="button" class="button button--secondary" @click="prevStep">
                  Назад
                </button>
                <button type="button" class="button button--primary" :disabled="!!validationError || isSubmitting"
                        @click="handleNext">
                  {{ isLastStep ? 'Отправить' : 'Далее' }}
                </button>
              </footer>
            </form>
          </div>
        </div>
      </section>
      <section class="modal modal--thanks" v-else>
        <h2 class="thanks-title">Спасибо за отзыв!</h2>
        <img class="send__email" :src="SendEmail" alt=""/>
        <p class="thanks-message">Мы ценим ваше мнение.</p>
        <button class="button button--primary" @click="resetForm">Закрыть</button>
      </section>
    </div>
  </main>
</template>

<script setup>
import {reactive, ref, computed} from 'vue'
import {getFirestore, collection, addDoc, serverTimestamp} from 'firebase/firestore'
import {userAuthStore} from '../../store/authStore.js'

import OnePoint from '../assets/images/feedback-images/1point.svg'
import TwoPoint from '../assets/images/feedback-images/2point.svg'
import ThreePoint from '../assets/images/feedback-images/3point.svg'
import FourPoint from '../assets/images/feedback-images/4point.svg'
import FivePoint from '../assets/images/feedback-images/5point.svg'
import SendEmail from '../assets/images/feedback-images/send-mail.svg'
import Window from '../../assets/images/feedback-images/windows.svg'
import Phone from '../../assets/images/feedback-images/smartphone.svg'
import Tablet from '../../assets/images/feedback-images/tablet.svg'

const db = getFirestore()
const authStore = userAuthStore()
const ratingIcons = [OnePoint, TwoPoint, ThreePoint, FourPoint, FivePoint]

const questions = [
  {
    type: 'choices',
    title: 'С какого устройства ты чаще всего пользуешься сайтом?',
    dataKey: 'deviceType',
    selectMode: 'single',
    options: [
      {label: 'Компьютер', value: 'Компьютер', icon: Window},
      {label: 'Телефон', value: 'Телефон', icon: Phone},
      {label: 'Планшет', value: 'Планшет', icon: Tablet}
    ],
    errorMessage: 'Пожалуйста, выберите устройство'
  },
  {
    type: 'choices',
    title: 'Какая раздел тебе нравится больше всего?',
    dataKey: 'favoriteFeature',
    selectMode: 'single',
    options: ['Игры', 'Обучение', 'Языковые земли'],
    commentKey: 'featureComment',
    placeholder: 'Напиши, почему именно эта часть нравится',
    errorMessage: 'Выберите одну опцию'
  },
  {
    type: 'choices',
    title: 'Нравятся ли вам события из календаря?',
    dataKey: 'christmasEventFeedback',
    selectMode: 'single',
    options: ['Да', 'Нет', 'Не участвовал'],
    commentKey: 'christmasEventComment',
    placeholder: 'Поделись впечатлениями или напиши, что можно улучшить',
    errorMessage: 'Выберите одну опцию',
    showCommentCondition: (answer) => answer !== 'Не участвовал'
  },
  {
    type: 'choices',
    title: 'С какими трудностями ты чаще всего сталкиваешься?',
    dataKey: 'mainFrustration',
    selectMode: 'multi',
    options: ['Понимание материалов', 'Сложные задания', 'Навигация в приложении', 'Свой вариант', 'Нет'],
    commentKey: 'frustrationComment',
    placeholder: 'Можно пояснить подробнее (особенно для своего варианта)',
    errorMessage: 'Выберите хотя бы одну',
    showCommentCondition: (answer) => Array.isArray(answer) && answer.length > 0 && !answer.includes('Нет')
  },
  {
    type: 'rating',
    title: 'Насколько полезны наши задания?',
    dataKey: 'usefulnessRating',
    commentKey: 'usefulnessComment',
    placeholder: 'Что было непонятно или что стоит улучшить?',
    errorMessage: 'Пожалуйста, поставьте оценку'
  },
  {
    type: 'choices',
    title: 'Какие задания тебе хочется видеть больше?',
    dataKey: 'selectedTasks',
    selectMode: 'multi',
    options: ['Меня всё устраивает', 'Больше аудио', 'Больше говорение', 'Больше заданий по темам'],
    commentKey: 'taskComment',
    placeholder: 'Например: «Хочу больше заданий по теме Еда»',
    errorMessage: 'Выберите хотя бы один вариант',
    showCommentCondition: (answer) => Array.isArray(answer) && answer.length > 0 && !answer.includes('Меня всё устраивает'),
    commentErrorMessage: 'Напишите, какие именно задания нужны'
  },
  {
    type: 'choices',
    title: 'Возникали ли у тебя ошибки или баги?',
    dataKey: 'interfaceIssues',
    selectMode: 'single',
    options: ['да', 'нет'],
    commentKey: 'interfaceIssuesComment',
    placeholder: 'Если да, то какие...',
    rows: 3,
    errorMessage: 'Ответьте, были ли ошибки',
    showCommentCondition: (answer) => answer === 'да',
    commentErrorMessage: 'Опишите ошибку, пожалуйста'
  },
  {
    type: 'choices',
    title: 'Как ты узнал(а) о нашем веб-приложении?',
    dataKey: 'acquisitionChannel',
    selectMode: 'single',
    options: [
      'Рекомендация',
      'Реклама в соцсетях',
      'Поиск в Google',
      'Другое'
    ],
    commentKey: 'acquisitionChannelDetails',
    placeholder: 'Напиши, откуда именно ты о нас узнал(а)',
    errorMessage: 'Пожалуйста, выберите вариант',
    showCommentCondition: (answer) => answer === 'Другое',
    commentErrorMessage: 'Пожалуйста, уточните источник'
  },
  {
    type: 'rating',
    title: 'Насколько ты доволен обучением у нас?',
    dataKey: 'siteRating',
    commentKey: 'siteWishes',
    placeholder: 'Что нравится? Что улучшить?',
    rows: 3,
    errorMessage: 'Поставьте итоговую оценку'
  }
]

const feedback = computed(() => authStore.shouldShowFeedbackSurvey)
const surveyStarted = ref(false)
const feedbackSent = ref(false)
const isSubmitting = ref(false)
const currentStepIndex = ref(0)

const answers = reactive({})
const flowAnswers = reactive({})

const visibleQuestions = computed(() =>
    questions.filter((q) => !q.showQuestionCondition || q.showQuestionCondition(flowAnswers))
)

const currentQuestion = computed(() => visibleQuestions.value[currentStepIndex.value] || {})
const isLastStep = computed(() => currentStepIndex.value === visibleQuestions.value.length - 1)
const progressPercent = computed(() => ((currentStepIndex.value + 1) / visibleQuestions.value.length) * 100)

const shouldShowCommentField = computed(() => {
  const q = currentQuestion.value
  return q.showCommentCondition ? q.showCommentCondition(answers[q.dataKey]) : !!q.commentKey
})

const validationError = computed(() => {
  const q = currentQuestion.value
  const val = answers[q.dataKey]
  const comment = answers[q.commentKey]
  const isEmpty = Array.isArray(val) ? val.length === 0 : !val && val !== 0
  if (isEmpty) return q.errorMessage || 'Заполните это поле'
  if (shouldShowCommentField.value && q.commentErrorMessage && (!comment || !comment.trim())) return q.commentErrorMessage
  return null
})

const startSurvey = () => {
  surveyStarted.value = true
  Object.assign(flowAnswers, {})
}

const closeFeedback = async () => {
  await authStore.markFeedbackSurveyShown()
}

const isOptionSelected = (option) => {
  const val = typeof option === 'object' ? option.value : option
  const current = answers[currentQuestion.value.dataKey]
  return Array.isArray(current) ? current.includes(val) : current === val
}

const toggleOption = (option) => {
  const val = typeof option === 'object' ? option.value : option
  const key = currentQuestion.value.dataKey

  if (currentQuestion.value.selectMode === 'multi') {
    const list = answers[key] || []
    if (list.includes(val)) {
      answers[key] = list.filter((i) => i !== val)
    } else {
      answers[key] = val === 'Меня всё устраивает' ? [val] : [...list.filter((i) => i !== 'Меня всё устраивает'), val]
    }
  } else {
    answers[key] = val
  }
}

const setRating = (value) => {
  const key = currentQuestion.value.dataKey
  if (key) answers[key] = value
}

const prevStep = () => {
  if (currentStepIndex.value > 0) currentStepIndex.value--
}

const commitCurrentStepToFlow = () => {
  const q = currentQuestion.value
  if (!q?.dataKey) return

  flowAnswers[q.dataKey] = Array.isArray(answers[q.dataKey]) ? [...answers[q.dataKey]] : answers[q.dataKey]

  if (q.commentKey) {
    flowAnswers[q.commentKey] = answers[q.commentKey]
  }

  if (q.dataKey === 'deviceType' && flowAnswers.deviceType !== 'Телефон') {
    delete flowAnswers.phoneOS
    delete flowAnswers.phoneModel
    delete answers.phoneOS
    delete answers.phoneModel
  }

  if (q.dataKey === 'hasNativeLanguage' && flowAnswers.hasNativeLanguage !== 'Нет') {
    delete flowAnswers.missingLanguage
    delete answers.missingLanguage
  }

  if (q.dataKey === 'selectedTasks') {
    const selected = answers.selectedTasks
    const hasComment = Array.isArray(selected) && selected.length > 0 && !selected.includes('Меня всё устраивает')
    if (!hasComment) {
      delete flowAnswers.taskComment
      delete answers.taskComment
    }
  }
  if (q.dataKey === 'interfaceIssues') {
    const selected = answers.interfaceIssues
    const hasComment = Array.isArray(selected) && selected.includes('да')
    if (!hasComment) {
      delete flowAnswers.interfaceIssuesComment
      delete answers.interfaceIssuesComment
    }
  }
}

const handleNext = async () => {
  if (validationError.value || isSubmitting.value) return

  commitCurrentStepToFlow()

  if (!isLastStep.value) {
    currentStepIndex.value++
    return
  }

  isSubmitting.value = true
  try {
    await addDoc(collection(db, 'feedbackSurvey'), {
      userId: authStore.uid || 'guest',
      createdAt: serverTimestamp(),
      answers: {...answers}
    })
    feedbackSent.value = true
    setTimeout(() => {
      resetForm()
    }, 2000)
  } catch (e) {
    console.error(e)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  closeFeedback()
  setTimeout(() => {
    feedbackSent.value = false
    surveyStarted.value = false
    currentStepIndex.value = 0
    for (const key in answers) delete answers[key]
    for (const key in flowAnswers) delete flowAnswers[key]
  }, 300)
}

onMounted(async () => {
  await authStore.initAuth()
  await authStore.checkFeedbackSurveyEligibility()
})

watch(() => authStore.uid, async (newUid) => {
  if (!newUid) return
  await authStore.checkFeedbackSurveyEligibility()
})
</script>

<style scoped>
.feedback-page {
  min-height: 100vh;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  z-index: 9999999;
}

.modal {
  width: 460px;
  max-width: 100%;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal__inner {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.modal__title {
  width: 100%;
  background: #4c5cc7;
  padding: 10px;
  text-align: center;
  color: white;
  position: relative;
}

.modal__title h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close__feedback {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
}

.close__feedback:hover {
  background: rgba(0, 0, 0, 0.2);
}

.modal__content {
  padding: 20px;
}

.modal-header {
  margin-bottom: 12px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #e5e7eb;
  border-radius: 999px;
  margin-top: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #858cc1;
  transition: width 0.25s ease;
}

.progress-text {
  font-size: 14px;
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
  min-height: 180px;
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
  gap: 8px;
}

.choice {
  padding: 8px 14px;
  border-radius: 14px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  align-items: center;
}

.choice--has-icon {
  flex-direction: column;
  padding: 12px 18px;
}

.choice-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 4px;
}

.choice--selected {
  background: #fde047;
  border-color: #facc15;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
}

.rating-button {
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.rating-image {
  width: 45px;
  height: 45px;
  display: block;
  filter: grayscale(100%);
  opacity: 0.4;
  transition: all 0.15s;
}

.rating-image--active {
  filter: none;
  opacity: 1;
  transform: translateY(-2px);
}

.comment-input {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 10px;
  font-size: 14px;
  resize: none;
  height: 80px;
  font-family: inherit;
}

.comment-input:focus {
  border-color: #c74c71;
  outline: none;
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
  padding-top: 12px;
  border-top: 1px dashed #e5e7eb;
  margin-top: auto;
}

.footer--center {
  justify-content: center;
}

.button {
  padding: 8px 20px;
  border-radius: 999px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
  min-width: 100px;
  font-weight: 600;
}

.button--primary {
  background: #111827;
  color: white;
}

.button--secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal--thanks {
  text-align: center;
  padding: 30px;
  align-items: center;
}

.thanks-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
}

.send__email {
  width: 120px;
  margin-bottom: 15px;
}

.thanks-message {
  font-size: 14px;
  color: #4b5563;
  margin-bottom: 20px;
  max-width: 80%;
}

.intro-block {
  text-align: center;
  margin-bottom: 15px;
}

.intro-text {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.intro-subtext {
  font-size: 14px;
  color: #4b5563;
}
</style>
