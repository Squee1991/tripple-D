<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useLocalePath} from '#i18n'
import {useEventSessionStore} from '~/store/eventsStore.js'
import SoundBtn from '~/src/components/soundBtn.vue'

const {t} = useI18n()
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

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const eventStore = useEventSessionStore()

const eventId = computed(() => String(route.params.id || ''))
const eventData = ref({quests: []})
const isLoading = ref(true)
const isFinished = ref(false)

const currentQuest = computed(() => {
  if (!eventStore.questId) return null
  return eventData.value.quests.find(quest => quest.id === eventStore.questId) || null
})

const totalSteps = computed(() => currentQuest.value?.steps?.length || 0)
const currentStep = computed(() => currentQuest.value?.steps?.[eventStore.stepIndex] || null)

const isQuestFullyCompleted = computed(() => {
  const solved = eventStore.solvedSteps || []
  return solved.length >= totalSteps.value
})

const totalPossibleScore = computed(() => {
  const steps = currentQuest.value?.steps || []
  return steps.reduce((sum, step) => {
    if (step.type === 'reading') return sum + (step.questions?.length || 0)
    if (step.type === 'matching') return sum + (step.correctPairs?.length || 0)
    return sum + 1
  }, 0)
})

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
  if (!eventStore.eventId || eventStore.eventId !== eventId.value) {
    const restorationSuccess = await eventStore.restoreIfPossible(eventId.value)
    if (!restorationSuccess) {
      return router.replace({name: 'event-id', params: {id: eventId.value}})
    }
  }
  await loadEventJson()
  if (!currentQuest.value) {
    router.replace({name: 'event-id', params: {id: eventId.value}})
  } else {
    if (eventStore.finished) {
      isFinished.value = true
    }
    const solved = eventStore.solvedSteps || []
    if (!isFinished.value && solved.includes(eventStore.stepIndex)) {
      jumpToNextUnsolvedStep()
    }
  }
})

const selectedOptionIndex = ref(null)
const userTextInput = ref('')
const checkStatus = ref(null)
const matchingState = ref({leftItemId: null, rightItemId: null, chosenPairs: []})
const wrongPairIndices = ref(new Set())

watch(currentStep, () => {
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
  jumpToNextUnsolvedStep()
}

function goToNextStep() {
  let nextIndex = eventStore.stepIndex + 1
  const solved = eventStore.solvedSteps || []
  while (nextIndex < totalSteps.value && solved.includes(nextIndex)) {
    nextIndex++
  }
  if (nextIndex < totalSteps.value) {
    eventStore.setStepIndex(nextIndex)
  } else {
    finishQuest()
  }
}

function finishQuest() {
  eventStore.finishQuest()
  isFinished.value = true
  if (!eventStore.isReplayMode && currentQuest.value && isQuestFullyCompleted.value) {
    const rewards = {
      coins: currentQuest.value.rewardCoins || 0,
      rep: currentQuest.value.rewardRep || 0
    }
    eventStore.awardQuestCompletion(eventStore.questId, rewards)
  }
}

function goBackHome() {
  router.push(localePath({name: 'event-id', params: {id: eventId.value}}))
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
}

function confirmSingleChoice() {
  if (checkStatus.value !== null) {
    goToNextStep()
    return
  }
  if (selectedOptionIndex.value === currentStep.value.correctOptionIndex) {
    checkStatus.value = 'correct'
    eventStore.addScore(1)
    if (eventStore.markStepAsSolved) eventStore.markStepAsSolved(eventStore.stepIndex)
  } else {
    checkStatus.value = 'wrong'
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
    if (eventStore.markStepAsSolved) eventStore.markStepAsSolved(eventStore.stepIndex)
  } else {
    checkStatus.value = 'wrong'
  }
}

function selectReadingOption(questionIndex, optionIndex) {
  if (checkStatus.value !== null) return
  if (currentStep.value?.questions?.[questionIndex]) {
    currentStep.value.questions[questionIndex].userAnswer = optionIndex
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
    if (eventStore.markStepAsSolved) eventStore.markStepAsSolved(eventStore.stepIndex)
  } else {
    checkStatus.value = 'wrong'
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
  if (matchingState.value.rightItemId) tryCommitPair()
}

function pickRightItem(id) {
  if (checkStatus.value !== null) return
  matchingState.value.rightItemId = id
  if (matchingState.value.leftItemId) tryCommitPair()
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
    if (eventStore.markStepAsSolved) eventStore.markStepAsSolved(eventStore.stepIndex)
  } else {
    checkStatus.value = 'wrong'
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
  return ''
})
</script>

<template>
  <div class="lesson">
    <div class="lesson__container">

      <header class="topbar">
        <button class="btn-icon-back" @click="goBackHome">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="topbar__progress" v-if="!isFinished && currentQuest">
          <div class="progress_exp-bar">
            <div class="progress__bar"
                 :style="{ width: (totalSteps ? ((eventStore.stepIndex ) / totalSteps * 100) : 0) + '%' }">
              <div class="glare"></div>
            </div>
          </div>
          <div class="progress__text">
            {{ eventStore.stepIndex + 1 }} / {{ totalSteps }}
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
            <div v-if="currentStep.questions && currentStep.questions.length" class="reading">
              <div v-for="(questionItem, questionIndex) in currentStep.questions" :key="questionIndex"
                   class="reading__item">
                <p class="question">{{ questionIndex + 1 }}. {{ questionItem.question }}</p>
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
                    <span class="option__text">{{ optionText }}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section v-else-if="currentStep?.type === 'mcq' || currentStep?.type === 'multiple-choice'"
                   class="section card">
            <p v-if="currentStep.question" class="question">{{ currentStep.question }}</p>
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
                <span class="option__text">{{ optionText }}</span>
              </button>
            </div>
          </section>

          <section v-else-if="currentStep?.type === 'choose-word'" class="section card">
            <p class="question" v-html="filledSentenceHtml"></p>
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
                <span class="option__text">{{ optionText }}</span>
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
            <h3 class="section__title">{{ currentStep.instruction || t('eventSessionPage.connectPaar') }}</h3>
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
                    {{ leftItem.text }}
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

      <div class="lesson__footer" v-if="!isLoading && currentQuest && !isFinished">
        <div v-if="checkStatus === 'correct'" class="hint hint--success">{{ successMessage }}</div>
        <div v-if="checkStatus === 'wrong' && errorMessage" class="hint hint--error" v-html="errorMessage"></div>
        <button class="btn btn--primary" @click="handlePrimaryAction" :disabled="primaryActionDisabled">
          {{ primaryActionText }}
        </button>
      </div>

      <div v-if="isFinished" class="result-modal-overlay" @click.self="goBackHome">
        <div class="result-wrapper">
          <div v-if="isQuestFullyCompleted" class="result card success-card">
            <div class="result__icon">
              <img class="result_icon" src="../../../assets/images/LeaveLesson.svg" alt="">
            </div>
            <h2 class="result__title">{{ t('eventSessionPage.perfect') }}</h2>
            <p class="result__text">{{ t('eventSessionPage.right') }} {{ totalPossibleScore }}
              {{ t('eventSessionPage.questions') }}</p>
            <div class="rewards" v-if="currentQuest?.rewardCoins && !eventStore.isReplayMode">
              <span class="rewards__icon">+{{ currentQuest.rewardCoins }} 🎃</span>
              <span class="xp-badge-3d">
                <span>+{{ currentQuest.rewardRep }}
                </span>
                <span class="reward_xp"> XP</span>
              </span>
            </div>
            <div class="result__actions">
              <button class="btn btn--primary" @click="goBackHome">
                {{ !eventStore.isReplayMode ? t('eventSessionPage.getReward') : t('eventSessionPage.leave') }}
              </button>
            </div>
          </div>
          <div v-else class="result card fail-card">
            <div class="result__icon">
              <img class="result_icon" src="../../../assets/images/LeaveLesson.svg" alt="">
            </div>
            <p class="result__subtext">{{ t('eventSessionPage.noMistake') }}</p>
            <div class="result__actions">
              <button class="btn btn--primary" @click="retryQuest">{{ t('eventSessionPage.again') }}</button>
              <button class="btn btn--ghost" @click="goBackHome">{{ t('eventSessionPage.leave') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lesson {
  height: 100dvh;
  display: flex;
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
  padding-bottom: 20px;
  scrollbar-width: none;
}

.lesson__content::-webkit-scrollbar {
  display: none;
}

.lesson__footer {
  flex-shrink: 0;
  padding-top: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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
  padding: 30px 20px;
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

.result_icon {
  width: 140px;
}

.result__title {
  font-size: 26px;
  font-weight: 900;
  margin-bottom: 5px;
  color: var(--title);
}

.result__text {
  font-size: 18px;
  font-weight: 700;
  color: var(--titleColor);
}

.result__subtext {
  font-size: 16px;
  color: var(--title);
  margin-bottom: 15px;
  font-weight: 800;
}

.rewards {
  display: flex;
  gap: 10px;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  color: #ff9c1a;
  margin: 10px 0 20px 0;
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

.reward_xp {

}

.xp-badge-3d{
  display: flex;
  align-items: center;
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

.hint {
  font-weight: 900;
  text-align: center;
  width: 100%;
}

.hint--error {
  color: #9b1c1c;
}

.hint--success {
  color: #0f6a36;
}

.btn {
  border: none;
  color: white;
  border-radius: 50px;
  padding: 14px;
  width: 100%;
  font-weight: 900;
  cursor: pointer;
  font-size: 18px;
  background: #fff;
  text-transform: uppercase;
  box-shadow: 0 5px transparent;
}

.btn--primary {
  background: #2b6be2;
  box-shadow: 0 5px #2959b0;
}

.btn--ghost {
  background: none;
  color: #645e5e;
}

.btn:disabled {
  opacity: .5;
  cursor: not-allowed;
  box-shadow: none;
}

.btn:active {
  box-shadow: 0 4px 10px rgba(26, 41, 66, .18);
  transform: translateY(1px);
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
  width: 160px;
  height: 160px;
  display: block;
  padding: 8px;
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
}

@media (max-width: 767px) {
  .option {
    min-height: 40px;
    font-size: 14px;
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