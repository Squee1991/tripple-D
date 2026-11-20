<script setup>
import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useLocalePath} from '#i18n'
import {useEventSessionStore} from '~/store/eventsStore.js'
import SoundBtn from '~/src/components/soundBtn.vue'
import {playCorrect, playWrong, playLevelCompleted} from "~/utils/soundManager.js"
import {getSpeechAudio} from '~/utils/googleTTS.js'
import EventSuccessModal from '~/src/components/V-EventSuccessModal.vue'
import {useEventSessionLogic} from '~/composables/useEventSessionLogic.js'
import {DotLottieVue} from '@lottiefiles/dotlottie-vue'
import {showInterstitial, preloadInterstitial} from '~/utils/admob.js'
import RightIcon from '~/assets/images/location-icons/accept.svg'
import WrongIcon from '~/assets/images/location-icons/cancel.svg'
import SnowCoin from '~/assets/images/event-rewards/winter-event/winter-words/snowflake.svg'

const isSpeaking = ref(false)

async function speakText(text) {
  if (isSpeaking.value || !text) return
  isSpeaking.value = true
  try {
    await getSpeechAudio(text.trim())
  } catch (error) {
    console.error(error)
  } finally {
    isSpeaking.value = false
  }
}

const {t, locale} = useI18n()

const {
  getResultIcon,
  getResultAnimation,
  getLeaveAnimation,
  animStep,
  displayXp,
  displayCoins,
  confettiParticles,
  runSuccessAnimation
} = useEventSessionLogic(() => String(route.params.id || ''))

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const eventStore = useEventSessionStore()

const eventId = computed(() => String(route.params.id || ''))
const eventData = ref({quests: []})
const isLoading = ref(true)
const isFinished = ref(false)
const showExitModal = ref(false)

const selectedOptionIndex = ref(null)
const userTextInput = ref('')
const checkStatus = ref(null)
const matchingState = ref({leftItemId: null, rightItemId: null, chosenPairs: []})
const wrongPairIndices = ref(new Set())

const currentQuest = computed(() => {
  if (!eventStore.questId) return null
  return eventData.value.quests.find(quest => quest.id === eventStore.questId) || null
})

const totalSteps = computed(() => currentQuest.value?.steps?.length || 0)
const currentStep = computed(() => currentQuest.value?.steps?.[eventStore.stepIndex] || null)

const stepsToPlay = ref([])

function calculateStepsToPlay() {
  const solved = eventStore.solvedSteps || []
  const list = []
  for (let i = 0; i < totalSteps.value; i++) {
    if (!solved.includes(i)) {
      list.push(i)
    }
  }
  stepsToPlay.value = list.length ? list : Array.from({length: totalSteps.value}, (_, i) => i)
}

const totalSessionSteps = computed(() => stepsToPlay.value.length || totalSteps.value || 1)

const currentSessionIndex = computed(() => {
  const idx = stepsToPlay.value.indexOf(eventStore.stepIndex)
  return idx >= 0 ? idx + 1 : 1
})

const isQuestFullyCompleted = computed(() => {
  const solved = eventStore.solvedSteps || []
  return solved.length >= totalSteps.value
})

const allEventImages = import.meta.glob('@/assets/images/event-rewards/**/*.{svg,SVG}', {
  eager: true,
  query: '?url',
  import: 'default'
})

const getImageUrl = (imagePathFromJson) => {
  if (!imagePathFromJson) return ''
  for (const filePath in allEventImages) {
    if (filePath.endsWith(imagePathFromJson)) {
      return allEventImages[filePath]
    }
  }
  return ''
}

// Перевод немецких формулировок на язык пользователя, чтобы задания были понятны новичкам.
// Файл public/events/<id>-translations.json: texts — по точному немецкому тексту, patterns — по шаблону.
// Нет перевода на язык пользователя — показываем английский
const translations = ref({texts: {}, patterns: []})
// Перевод скрыт, пока не нажмут кнопку: 'q' — вопрос, 'q0'.. — вопросы к тексту, 'text' — сам текст
const openTranslations = ref(new Set())
const isTranslationOpen = key => openTranslations.value.has(key)
function closeTranslationsOnOutsideTap(event) {
  if (!openTranslations.value.size) return
  if (event.target?.closest?.('.tr__btn')) return
  openTranslations.value = new Set()
}

onMounted(() => document.addEventListener('pointerdown', closeTranslationsOnOutsideTap))
onBeforeUnmount(() => document.removeEventListener('pointerdown', closeTranslationsOnOutsideTap))

function toggleTranslation(key) {
  const next = new Set(openTranslations.value)
  next.has(key) ? next.delete(key) : next.add(key)
  openTranslations.value = next
}

async function loadTranslations() {
  try {
    const data = await $fetch(`/events/${eventId.value}-translations.json`)
    translations.value = {texts: data?.texts || {}, patterns: data?.patterns || []}
  } catch (error) {
    translations.value = {texts: {}, patterns: []}
  }
}

function translationOf(germanText) {
  if (!germanText) return ''
  const lang = String(locale.value || 'en').slice(0, 2)
  const pick = entry => entry?.[lang] || entry?.en || ''
  const direct = translations.value.texts[germanText]
  if (direct) return pick(direct)
  for (const pattern of translations.value.patterns) {
    const regex = new RegExp(pattern.match)
    if (regex.test(germanText)) return germanText.replace(regex, pick(pattern))
  }
  return ''
}

async function loadEventJson() {
  isLoading.value = true
  try {
    const jsonResponse = await $fetch(`/events/event-${eventId.value}.json`)
    eventData.value = (jsonResponse && Array.isArray(jsonResponse.quests)) ? jsonResponse : {quests: []}
  } catch (error) {
    eventData.value = {quests: []}
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  preloadInterstitial()
  // Счётчик рекламы адвент-календаря больше не используется — убираем остаток у тех, кто успел его получить
  try { localStorage.removeItem('skillup.advent.adCounter') } catch (e) {}
  if (!eventStore.eventId || eventStore.eventId !== eventId.value) {
    const restorationSuccess = await eventStore.restoreIfPossible(eventId.value)
    if (!restorationSuccess) {
      return router.replace({name: 'event-id', params: {id: eventId.value}})
    }
  }
  await Promise.all([loadEventJson(), loadTranslations()])
  if (!currentQuest.value) {
    router.replace({name: 'event-id', params: {id: eventId.value}})
  } else {
    calculateStepsToPlay()
    if (eventStore.finished) {
      isFinished.value = true
      runSuccessAnimation(isQuestFullyCompleted.value, eventStore.isReplayMode, currentQuest.value?.rewardRep, currentQuest.value?.rewardCoins)
    }
    const solved = eventStore.solvedSteps || []
    if (!isFinished.value && solved.includes(eventStore.stepIndex)) {
      jumpToNextUnsolvedStep()
    }
  }
})

watch(currentStep, () => {
  openTranslations.value = new Set()
  selectedOptionIndex.value = null
  userTextInput.value = ''
  checkStatus.value = null
  matchingState.value = {leftItemId: null, rightItemId: null, chosenPairs: []}
  wrongPairIndices.value = new Set()
  if (currentStep.value?.type === 'reading' && Array.isArray(currentStep.value.questions)) {
    currentStep.value.questions.forEach(q => {
      q.userAnswer = null
    })
  }
})

function jumpToNextUnsolvedStep() {
  const solved = eventStore.solvedSteps || []
  for (let i = 0; i < totalSteps.value; i++) {
    if (!solved.includes(i)) {
      eventStore.setStepIndex(i)
      return
    }
  }
  finishQuest()
}

async function retryQuest() {
  isFinished.value = false
  checkStatus.value = null
  await eventStore.start(eventId.value, currentQuest.value.id)
  calculateStepsToPlay()
  jumpToNextUnsolvedStep()
}

function goToNextStep() {
  const currentPos = stepsToPlay.value.indexOf(eventStore.stepIndex)
  if (currentPos >= 0 && currentPos + 1 < stepsToPlay.value.length) {
    eventStore.setStepIndex(stepsToPlay.value[currentPos + 1])
  } else {
    finishQuest()
  }
}

function finishQuest() {
  eventStore.finishQuest()
  isFinished.value = true
  runSuccessAnimation(isQuestFullyCompleted.value, eventStore.isReplayMode, currentQuest.value?.rewardRep, currentQuest.value?.rewardCoins)
  if (isQuestFullyCompleted.value) {
    playLevelCompleted()
  }
  if (!eventStore.isReplayMode && currentQuest.value && isQuestFullyCompleted.value) {
    const rewards = {
      coins: currentQuest.value.rewardCoins || 0,
      rep: currentQuest.value.rewardRep || 0
    }
    eventStore.awardQuestCompletion(eventStore.questId, rewards)
  }
}

function requestExit() {
  if (isFinished.value) {
    goBackHome()
    return
  }
  showExitModal.value = true
}

function closeExitModal() {
  showExitModal.value = false
}

function goBackHome() {
  const goToEvent = () => router.push(localePath({name: 'event-id', params: {id: eventId.value}}))
  if (!isFinished.value) return goToEvent()
  // Адвент-календарь — короткий ежедневный ритуал, рекламу после его окошек не показываем
  const isAdvent = String(eventStore.questId || '').startsWith('advent-')
  if (isAdvent) return goToEvent()
  showInterstitial(goToEvent)
}

const filledSentenceHtml = computed(() => {
  if (currentStep.value?.type !== 'choose-word') return ''
  const sourceText = currentStep.value.sentence || ''
  if (selectedOptionIndex.value == null) {
    return sourceText.replace('___', '<b>___</b>')
  }
  const selectedWord = currentStep.value.options[selectedOptionIndex.value]
  return sourceText.replace('___', `<b>${selectedWord}</b>`)
})

function selectOption(index) {
  if (checkStatus.value !== null) return
  selectedOptionIndex.value = index
  const chosenText = currentStep.value?.options?.[index]
  if (chosenText) {
    speakText(chosenText)
  }
}

function confirmSingleChoice() {
  if (checkStatus.value !== null) {
    goToNextStep()
    return
  }
  if (selectedOptionIndex.value === currentStep.value.correctOptionIndex) {
    checkStatus.value = 'correct'
    eventStore.addScore(1)
    playCorrect()
    if (eventStore.markStepAsSolved) eventStore.markStepAsSolved(eventStore.stepIndex)
  } else {
    checkStatus.value = 'wrong'
    playWrong()
  }
}

function confirmTextInput() {
  if (checkStatus.value !== null) {
    goToNextStep()
    return
  }
  const correctAnswer = (currentStep.value.answerText || '').trim().toLowerCase()
  const userAnswer = (userTextInput.value || '').trim().toLowerCase()
  const isCorrect = correctAnswer === '__ANY_NON_EMPTY__'
      ? userAnswer.length > 0
      : userAnswer === correctAnswer

  if (isCorrect) {
    checkStatus.value = 'correct'
    eventStore.addScore(1)
    playCorrect()
    if (eventStore.markStepAsSolved) eventStore.markStepAsSolved(eventStore.stepIndex)
  } else {
    checkStatus.value = 'wrong'
    playWrong()
  }
}

function selectReadingOption(questionIndex, optionIndex) {
  if (checkStatus.value !== null) return
  if (currentStep.value?.questions?.[questionIndex]) {
    currentStep.value.questions[questionIndex].userAnswer = optionIndex

    const optionText = currentStep.value.questions[questionIndex].options?.[optionIndex]
    if (optionText) {
      speakText(optionText)
    }
  }
}

const isReadingReady = computed(() => {
  if (currentStep.value?.type !== 'reading') return true
  const questions = currentStep.value.questions || []
  return questions.length === 0 || questions.every(q => q.userAnswer !== null && q.userAnswer !== undefined)
})

function checkReadingAnswers() {
  if (checkStatus.value !== null) {
    goToNextStep()
    return
  }
  const questions = currentStep.value?.questions || []
  if (!questions.length) {
    goToNextStep()
    return
  }
  if (!questions.every(q => q.userAnswer !== null && q.userAnswer !== undefined)) return
  const isAllCorrect = questions.every(q => q.userAnswer === q.correctOptionIndex)
  if (isAllCorrect) {
    checkStatus.value = 'correct'
    eventStore.addScore(questions.length)
    playCorrect()
    if (eventStore.markStepAsSolved) eventStore.markStepAsSolved(eventStore.stepIndex)
  } else {
    checkStatus.value = 'wrong'
    playWrong()
  }
}

const usedLeftIds = computed(() => new Set(matchingState.value.chosenPairs.map(([leftId]) => leftId)))
const usedRightIds = computed(() => new Set(matchingState.value.chosenPairs.map(([, rightId]) => rightId)))

const availableLeftItems = computed(() => {
  return (currentStep.value?.pairsLeft || []).filter(item => !usedLeftIds.value.has(item.id))
})

const availableRightItems = computed(() => {
  return (currentStep.value?.pairsRight || []).filter(item => !usedRightIds.value.has(item.id))
})

function pickLeftItem(id) {
  if (checkStatus.value !== null) return
  matchingState.value.leftItemId = id
  const item = currentStep.value?.pairsLeft?.find(i => i.id === id)
  if (item?.text) {
    speakText(item.text)
  }

  if (matchingState.value.rightItemId) tryCommitPair()
}

function pickRightItem(id) {
  if (checkStatus.value !== null) return
  matchingState.value.rightItemId = id
  if (matchingState.value.leftItemId) {
    tryCommitPair()
  }
}

function tryCommitPair() {
  const {leftItemId, rightItemId} = matchingState.value
  if (!leftItemId || !rightItemId) return
  matchingState.value.chosenPairs.push([leftItemId, rightItemId])
  matchingState.value.leftItemId = null
  matchingState.value.rightItemId = null
}

function undoPair(index) {
  if (checkStatus.value !== null) return
  matchingState.value.chosenPairs.splice(index, 1)
  wrongPairIndices.value.delete(index)
}

function checkMatchingAnswers() {
  if (checkStatus.value !== null) {
    goToNextStep()
    return
  }
  wrongPairIndices.value = new Set()
  const correctPairs = currentStep.value?.correctPairs || []
  const correctPairsSet = new Set(correctPairs.map(([left, right]) => `${left}|${right}`))

  matchingState.value.chosenPairs.forEach(([leftId, rightId], index) => {
    if (!correctPairsSet.has(`${leftId}|${rightId}`)) {
      wrongPairIndices.value.add(index)
    }
  })

  const isCountCorrect = matchingState.value.chosenPairs.length === correctPairs.length
  const hasNoErrors = wrongPairIndices.value.size === 0

  if (isCountCorrect && hasNoErrors) {
    checkStatus.value = 'correct'
    eventStore.addScore(correctPairs.length)
    playCorrect()
    if (eventStore.markStepAsSolved) eventStore.markStepAsSolved(eventStore.stepIndex)
  } else {
    checkStatus.value = 'wrong'
    playWrong()
  }
}

const primaryActionText = computed(() => checkStatus.value === null ? t('eventSessionPage.check') : t('eventSessionPage.further'))

const primaryActionDisabled = computed(() => {
  if (checkStatus.value !== null) return false
  const type = currentStep.value?.type
  if (type === 'reading') return !isReadingReady.value
  if (type === 'mcq' || type === 'multiple-choice' || type === 'choose-word') return selectedOptionIndex.value === null
  if (type === 'fill') return !userTextInput.value
  if (type === 'matching') return matchingState.value.chosenPairs.length === 0
  return false
})

function handlePrimaryAction() {
  const type = currentStep.value?.type
  if (type === 'reading') checkReadingAnswers()
  else if (type === 'mcq' || type === 'multiple-choice' || type === 'choose-word') confirmSingleChoice()
  else if (type === 'fill') confirmTextInput()
  else if (type === 'matching') checkMatchingAnswers()
  else goToNextStep()
}

const successMessage = computed(() => {
  if (currentStep.value?.type === 'matching') return t('eventSessionPage.excellentAnswers')
  return t('eventSessionPage.correct')
})

const errorMessage = computed(() => {
  const type = currentStep.value?.type
  if (type === 'choose-word') return t('eventSessionPage.answerHighlighted')
  if (type === 'fill') return `${t('eventSessionPage.rightAnswer')} <b>${currentStep.value?.answerText || ''}</b>`
  if (type === 'matching') return t('eventSessionPage.mistakes')
  if (type === 'mcq' || type === 'multiple-choice') {
    const correctText = currentStep.value?.options?.[currentStep.value?.correctOptionIndex] || ''
    return `${t('eventSessionPage.rightAnswer')} <b>${t(correctText)}</b>`
  }
  return ''
})

const feedbackClass = computed(() => {
  if (checkStatus.value === null) return ''
  return checkStatus.value === 'correct' ? 'correct' : 'incorrect'
})

</script>

<template>
  <div class="lesson">
    <div class="lesson__container">
      <header class="topbar">
        <button class="btn-icon-back" @click="requestExit">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="topbar__progress" v-if="!isFinished && currentQuest">
          <div class="progress_exp-bar">
            <div class="progress__bar"
                 :style="{ width: (((currentSessionIndex - 1) / totalSessionSteps) * 100) + '%' }">
              <div class="glare"></div>
            </div>
          </div>
          <div class="progress__text">
            {{ currentSessionIndex }} / {{ totalSessionSteps }}
          </div>
        </div>
      </header>
      <div class="lesson__content">
        <div v-if="isLoading" class="lesson__state">
          <div class="loader"></div>
          <div>{{ t('eventSessionPage.loading') }}</div>
        </div>
        <div v-else-if="!currentQuest" class="lesson__state">
          <span>{{ t('eventSessionPage.notFound') }}</span>
          <button class="btn btn--ghost" @click="goBackHome">{{ t('eventSessionPage.back') }}</button>
        </div>
        <div v-else class="lesson__card">
          <section v-if="currentStep?.type === 'reading'" class="section card">
            <div class="paper">
              <SoundBtn :text="currentStep.text"/>
              <h3 class="section__title">{{ t('eventSessionPage.listen') }}</h3>
            </div>
            <div v-if="translationOf(currentStep.text)" class="tr">
              <button type="button" class="tr__btn" :class="{ 'is-open': isTranslationOpen('text') }" @click="toggleTranslation('text')">
                <svg class="tr__icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
                <span>{{ t('eventSessionPage.showTranslation') }}</span>
              </button>
              <transition name="tr">
                <p v-if="isTranslationOpen('text')" class="tr__bubble">{{ translationOf(currentStep.text) }}</p>
              </transition>
            </div>
            <div v-if="currentStep.questions && currentStep.questions.length" class="reading">
              <div v-for="(questionItem, questionIndex) in currentStep.questions" :key="questionIndex"
                   class="reading__item">
                <p class="question">{{ questionIndex + 1 }}. {{ t(questionItem.question) }}</p>
                <div v-if="translationOf(questionItem.question)" class="tr">
                  <button type="button" class="tr__btn" :class="{ 'is-open': isTranslationOpen('q' + questionIndex) }" @click="toggleTranslation('q' + questionIndex)">
                    <svg class="tr__icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
                    <span>{{ t('eventSessionPage.showTranslation') }}</span>
                  </button>
                  <transition name="tr">
                    <p v-if="isTranslationOpen('q' + questionIndex)" class="tr__bubble">{{ translationOf(questionItem.question) }}</p>
                  </transition>
                </div>
                <div class="choices">
                  <button
                      v-for="(optionText, optionIndex) in questionItem.options"
                      :key="optionIndex"
                      class="option"
                      :class="{
                      'chosen': questionItem.userAnswer === optionIndex && checkStatus === null,
                      'correct': (checkStatus !== null && questionItem.userAnswer === optionIndex && optionIndex === questionItem.correctOptionIndex) ||
                                 (checkStatus === 'wrong' && optionIndex === questionItem.correctOptionIndex),
                      'wrong': (checkStatus !== null && questionItem.userAnswer === optionIndex && optionIndex !== questionItem.correctOptionIndex)
                    }"
                      @click="selectReadingOption(questionIndex, optionIndex)"
                  >
                    <span class="option__text">{{ t(optionText) }}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section v-else-if="currentStep?.type === 'mcq' || currentStep?.type === 'multiple-choice'"
                   class="section card">
            <!-- В заданиях с картинкой вопрос и перевод не нужны: всё понятно по изображению -->
            <p v-if="currentStep.question && !currentStep.image" class="question">{{ t(currentStep.question) }}</p>
            <div v-if="!currentStep.image && translationOf(currentStep.question)" class="tr">
              <button type="button" class="tr__btn" :class="{ 'is-open': isTranslationOpen('q') }" @click="toggleTranslation('q')">
                <svg class="tr__icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
                <span>{{ t('eventSessionPage.showTranslation') }}</span>
              </button>
              <transition name="tr">
                <p v-if="isTranslationOpen('q')" class="tr__bubble">{{ translationOf(currentStep.question) }}</p>
              </transition>
            </div>
            <img class="question-image" v-if="currentStep.image" :src="getImageUrl(currentStep.image)"
                 alt="Task image"/>
            <div class="choices">
              <button
                  v-for="(optionText, optionIndex) in currentStep.options"
                  :key="optionIndex"
                  class="option"
                  :class="{
                  'chosen': selectedOptionIndex === optionIndex && checkStatus === null,
                  'correct': (checkStatus === 'correct' && selectedOptionIndex === optionIndex) || (checkStatus === 'wrong' && optionIndex === currentStep.correctOptionIndex),
                  'wrong': checkStatus === 'wrong' && selectedOptionIndex === optionIndex && selectedOptionIndex !== currentStep.correctOptionIndex
                }"
                  @click="selectOption(optionIndex)"
              >
                <span class="option__text">{{ t(optionText) }}</span>
              </button>
            </div>
          </section>
          <section v-else-if="currentStep?.type === 'choose-word'" class="section card">
            <p class="question" v-html="filledSentenceHtml"></p>
            <div v-if="translationOf(currentStep.sentence)" class="tr">
              <button type="button" class="tr__btn" :class="{ 'is-open': isTranslationOpen('q') }" @click="toggleTranslation('q')">
                <svg class="tr__icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>
                <span>{{ t('eventSessionPage.showTranslation') }}</span>
              </button>
              <transition name="tr">
                <p v-if="isTranslationOpen('q')" class="tr__bubble">{{ translationOf(currentStep.sentence) }}</p>
              </transition>
            </div>
            <div class="choices">
              <button
                  v-for="(optionText, optionIndex) in currentStep.options"
                  :key="optionIndex"
                  class="option"
                  :class="{
                  'chosen': selectedOptionIndex === optionIndex && checkStatus === null,
                  'correct': (checkStatus === 'correct' && selectedOptionIndex === optionIndex) || (checkStatus === 'wrong' && optionIndex === currentStep.correctOptionIndex),
                  'wrong': checkStatus === 'wrong' && selectedOptionIndex === optionIndex && selectedOptionIndex !== currentStep.correctOptionIndex
                }"
                  @click="selectOption(optionIndex)"
              >
                <span class="option__text">{{ t(optionText) }}</span>
              </button>
            </div>
          </section>
          <section v-else-if="currentStep?.type === 'fill'" class="section card">
            <h3 class="section__title">{{ t('eventSessionPage.fillAnswer') }}</h3>
            <p class="question">{{ currentStep.prompt }}</p>
            <div class="field">
              <input
                  v-model="userTextInput"
                  class="field__input"
                  placeholder="Ваш ответ"
                  @keyup.enter="handlePrimaryAction"
                  :disabled="checkStatus !== null"
              />
            </div>
          </section>
          <section v-else-if="currentStep?.type === 'matching'" class="section card">
            <h3 class="section__title">{{ currentStep.instruction ? t(currentStep.instruction) : t('eventSessionPage.connectPaar') }}</h3>
            <div class="match">
              <div class="match__cols">
                <div class="match__col">
                  <button
                      v-for="leftItem in availableLeftItems"
                      :key="leftItem.id"
                      class="option"
                      :class="{ chosen: matchingState.leftItemId === leftItem.id }"
                      @click="pickLeftItem(leftItem.id)"
                  >
                    {{ t(leftItem.text) }}
                  </button>
                </div>
                <div class="match__col">
                  <button
                      v-for="rightItem in availableRightItems"
                      :key="rightItem.id"
                      class="option"
                      :class="{ chosen: matchingState.rightItemId === rightItem.id }"
                      @click="pickRightItem(rightItem.id)"
                  >
                    {{ t(rightItem.text) }}
                  </button>
                </div>
              </div>
              <div class="pairs">
                <div
                    v-for="(pairArray, pairIndex) in matchingState.chosenPairs"
                    :key="pairIndex"
                    class="pair-chip"
                    :class="{
                      wrong: checkStatus === 'wrong' && wrongPairIndices.has(pairIndex),
                      correct: (checkStatus === 'correct') || (checkStatus === 'wrong' && !wrongPairIndices.has(pairIndex))
                    }"
                    @click="undoPair(pairIndex)"
                >
                  {{ (currentStep.pairsLeft.find(item => item.id === pairArray[0])?.text) || pairArray[0] }} —
                  {{ t((currentStep.pairsRight.find(item => item.id === pairArray[1])?.text)) || pairArray[1] }} ✕
                </div>
              </div>
            </div>
          </section>
          <section v-else class="section card">
            Error <code>{{ currentStep?.type }}</code>
          </section>
        </div>
      </div>
      <div class="actions-wrapper" :class="feedbackClass" v-if="!isLoading && currentQuest && !isFinished">
        <div class="actions-container">
          <div v-if="checkStatus !== null" class="feedback-text">
            <div v-if="checkStatus === 'correct'" class="feedback correct slide-up">
              <img class="quest__feedback-icon" :src="RightIcon" alt="correct_icon">
              {{ successMessage }}
            </div>
            <div v-else class="feedback incorrect shake quest__correct-answer-block">
              <div class="feedback-wrong-header">
                <img class="quest__feedback-icon" :src="WrongIcon" alt="wrong_icon">
                <div v-html="errorMessage" class="correct-answer-text"></div>
              </div>
            </div>
          </div>
          <button v-if="checkStatus === null" class="btn btn-check" :disabled="primaryActionDisabled"
                  @click="handlePrimaryAction">
            {{ primaryActionText }}
          </button>
          <button v-if="checkStatus !== null" class="btn slide-up"
                  :class="checkStatus === 'correct' ? 'btn-next' : 'btn-wrong'" @click="handlePrimaryAction">
            {{ primaryActionText }}
          </button>
        </div>
      </div>
      <div v-if="showExitModal" class="result-modal-overlay" @click.self="closeExitModal">
        <div class="result-wrapper">
          <div class="result card fail-card">
            <div class="result__icon" :class="{ 'result__icon--leave': eventId !== 'halloween' }">
              <DotLottieVue
                  :data="JSON.stringify(getLeaveAnimation())"
                  :loop="true"
                  :autoplay="true"
                  class="result__lottie"
              />
            </div>
            <p class="result__subtext">{{t('questCompletedModals.continueQuest')}}</p>
            <div class="result__actions">
              <button class="btn btn--primary" @click="closeExitModal">{{ t('questCompletedModals.continue') }}</button>
              <button class="btn btn--ghost" @click="goBackHome">{{ t('eventSessionPage.leave') }}</button>
            </div>
          </div>
        </div>
      </div>
      <EventSuccessModal
          v-if="isFinished"
          :finished="isFinished"
          :is-quest-fully-completed="isQuestFullyCompleted"
          :previously-cleared="eventStore.isReplayMode"
          :anim-step="animStep"
          :display-xp="displayXp"
          :display-coins="displayCoins"
          :confetti-particles="confettiParticles"
          :mascot-src="getResultIcon(isQuestFullyCompleted)"
          :lottie-data="getResultAnimation(isQuestFullyCompleted)"
          :show-xp="(currentQuest?.rewardRep || 0) > 0"
          :coin-image="eventId === 'winter' ? SnowCoin : ''"
          @themes="goBackHome"
          @retryMistakes="retryQuest"
      />
    </div>
  </div>
</template>

<style scoped>
.lesson {
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  font-family: "Kablammo", system-ui;
  color: #1f2a44;
}

.lesson__container {
  max-width: 880px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 12px 20px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 15px;
  flex-shrink: 0;
}

.lesson__content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 150px;
  scrollbar-width: none;
}

.lesson__content::-webkit-scrollbar {
  display: none;
}

.result-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 26, 51, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.result-wrapper {
  width: 100%;
  max-width: 768px;
  animation: slideUpModal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideUpModal {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.result.card {
  background: var(--bgModal, #fff);
  /* снизу место под системную полосу телефона, чтобы кнопки не уходили под неё */
  padding: 30px 20px calc(30px + env(safe-area-inset-bottom, 0px));
  border-radius: 24px 24px 0 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  border: none;
  border-top: 3px solid #f5f5f5;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result__icon {
  font-size: 50px;
  margin-bottom: 10px;
}

/* Ёж выхода из квестов на карте: в файле анимации много пустого поля, поэтому крупнее, как в V-stopSessionModal */
.result__icon--leave {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0 20px;
}

.result__icon--leave .result__lottie {
  width: 280px;
  height: 280px;
  flex-shrink: 0;
}

.result__subtext {
  font-size: 16px;
  color: var(--title);
  margin-bottom: 15px;
  font-weight: 800;
}

.result__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.topbar__progress {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress__text {
  text-align: center;
  font-size: 18px;
  font-weight: 900;
  color: #5b647c;
  line-height: 1;
  white-space: nowrap;
}

.progress_exp-bar {
  flex: 1;
  height: 27px;
  background: #eaf1ff;
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(20, 34, 58, .08);
  width: 100%;
}

.progress__bar {
  height: 100%;
  background: linear-gradient(90deg, #ff9c1a, #ffcf4d);
  border-radius: 8px;
  transition: width .25s ease;
  position: relative;
}

.glare {
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 4px;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor, #ccc);
  box-shadow: var(--boxShadowMobile, 0 4px 0 #ccc);
  border-radius: 12px;
  width: 40px;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #2b2b2b;
}

.lesson__state {
  text-align: center;
  font-weight: 800;
  color: #5b647c;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px 0;
}

.loader {
  width: 44px;
  height: 44px;
  border: 5px solid #e3edff;
  border-top-color: #7aa7ff;
  border-radius: 50%;
  margin: 0 auto 6px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.lesson__card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.card {
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  border-radius: 20px;
}

.paper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section__title {
  font-weight: 900;
  font-size: 22px;
  color: white;
  margin-bottom: 10px;
}

.question {
  font-size: 20px;
  font-weight: 800;
  color: var(--title);
  margin: 6px 15px 12px;
}

/* Перевод на язык пользователя: скрыт за кнопкой, открывается «пузырём» под вопросом */
/* Пузырь с переводом лежит поверх заданий и не сдвигает их: место под кнопку зарезервировано всегда */
.tr {
  position: relative;
  z-index: 5;
  align-self: stretch;
  text-align: left;
  margin: -4px 15px 14px;
}

.tr__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 50px;
  padding: 6px 14px 6px 10px;
  background: rgb(94 124 240 / 0.18);
  color: #9fb4ff;
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.tr__btn:active {
  transform: translateY(1px);
}

.tr__btn:not(.is-open) {
  animation: trWiggle 4s ease-in-out 1s infinite;
}

.tr__btn.is-open {
  background: #5e7cf0;
  color: #ffffff;
}

@keyframes trWiggle {
  0%, 82%, 100% { transform: rotate(0); }
  85% { transform: rotate(-6deg); }
  88% { transform: rotate(5deg); }
  91% { transform: rotate(-4deg); }
  94% { transform: rotate(2deg); }
}

@media (prefers-reduced-motion: reduce) {
  .tr__btn:not(.is-open) { animation: none; }
}

.tr__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.tr__bubble {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  margin: 0;
  cursor: pointer;
  box-shadow: 0 10px 24px rgb(0 0 0 / 0.45);
  padding: 10px 14px;
  border-radius: 14px;
  background: #26315a;
  border: 1px solid rgb(94 124 240 / 0.6);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.45;
}

/* хвостик пузыря к кнопке */
.tr__bubble::before {
  content: '';
  position: absolute;
  top: -7px;
  left: 22px;
  width: 12px;
  height: 12px;
  background: inherit;
  border-left: 1px solid rgb(94 124 240 / 0.6);
  border-top: 1px solid rgb(94 124 240 / 0.6);
  transform: rotate(45deg);
}

.tr-enter-active, .tr-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tr-enter-from, .tr-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin: 10px 0 15px 0;
  width: 100%;
}

.option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  min-width: 120px;
  border-radius: 16px;
  background: #fff;
  color: #1f2a44;
  font-weight: 800;
  font-size: 15px;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12);
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform .08s, box-shadow .08s, background .2s, filter .2s;
  position: relative;
}

.option:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(26, 41, 66, .18);
}

.option.chosen {
  background: #e0efff;
  border-color: #3b82f6;
  box-shadow: 0 8px 20px rgba(59, 130, 246, .25);
}

.option.correct {
  background: #e9f8ee;
  color: #0f6a36;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12), 0 0 0 2px #a2dfb6 inset;
  border-color: #a2dfb6;
}

.option.wrong {
  background: #fdecec;
  color: #9b1c1c;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12), 0 0 0 2px #f3b5b5 inset;
  border-color: #f3b5b5;
}

.option__text {
  pointer-events: none;
}

.field {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  max-width: 300px;
}

.field__input {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border-radius: 14px;
  border: none;
  outline: none;
  font-weight: 800;
  color: #1f2a44;
  background: #fff;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12);
}

.reading {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 10px;
  width: 100%;
}

.reading__item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.match {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.match__cols {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.match__col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pairs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.pair-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
  border-radius: 14px;
  padding: 8px 12px;
  font-weight: 900;
  background: #fff;
  color: #1f2a44;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12);
  cursor: pointer;
  transition: transform .08s, box-shadow .08s, background .2s;
}

.pair-chip:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(26, 41, 66, .18);
}

.pair-chip.correct {
  background: #e9f8ee;
  color: #0f6a36;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12), 0 0 0 2px #a2dfb6 inset;
}

.pair-chip.wrong {
  background: #fdecec;
  color: #9b1c1c;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12), 0 0 0 2px #f3b5b5 inset;
}

.question-image {
  width: 180px;
  height: 180px;
  display: block;
  padding: 8px;
}

.actions-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background: transparent;
  transition: background-color 0.3s ease;
  z-index: 100;
}

.actions-wrapper.correct {
  background-color: #d4edda;
  border-top: 3px solid #2E7D32;
}

.actions-wrapper.incorrect {
  background-color: #f8d7da;
  border-top: 2px solid #C62828;
}

.actions-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  gap: 15px;
  align-items: flex-start;
  padding: 15px 20px;
  padding-bottom: calc(15px + env(safe-area-inset-bottom));
}

.feedback-text {
  width: 100%;
  display: flex;
  align-items: center;
}

.feedback {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feedback.correct {
  color: #2E7D32;
}

.feedback.incorrect {
  color: #C62828;
}

.quest__correct-answer-block {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.feedback-wrong-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.correct-answer-text {
  font-weight: 800;
  margin-top: 5px;
}

.quest__feedback-icon {
  width: 32px;
}

.btn {
  width: 100%;
  padding: 14px 24px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  color: #ffffff;
  text-transform: uppercase;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-check {
  background-color: #3b82f6;
  box-shadow: 0 5px 0 #2563eb;
}

.btn-check:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.actions-wrapper.incorrect .btn-check {
  background-color: #ef4444;
  box-shadow: 0 5px 0 #dc2626;
}

.btn-next {
  background-color: #4ade80;
  box-shadow: 0 5px 0 #12a647;
}

.btn-wrong {
  background-color: #ef4444;
  box-shadow: 0 5px 0 #dc2626;
}

.btn--primary {
  background: #2b6be2;
  box-shadow: 0 5px #2959b0;
}

.btn--ghost {
  background: none;
  color: #645e5e;
}

.btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 0 0 transparent !important;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}

.shake {
  animation: shake 0.4s ease-in-out;
}

@media (max-width: 540px) {
  .option {
    width: 100%;
    max-width: 330px;
  }

  .question {
    font-size: 17px;
  }

  .section__title {
    font-size: 19px;
  }

  .lesson__container {
    padding: 10px 10px 15px;
  }

  .topbar {
    padding: 0;
  }

  .quest__feedback-icon {
    width: 24px;
  }

  .feedback {
    font-size: 1.2rem;
  }
}

@media (max-width: 767px) {
  .option {
    min-height: 40px;
    font-size: 13px;
  }
}

@media (min-width: 1024px) {
  .option:hover {
    transform: translateY(-1px) rotate(-.3deg);
  }

  .pair-chip:hover {
    transform: translateY(-1px) rotate(.2deg);
  }
}

</style>