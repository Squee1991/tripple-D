<template>
  <main class="session-page"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
  >
    <ExitSessionModal
        :animationData="hedgehogLeaveSession"
        :show="showExitModal"
        @update:show="val => showExitModal = val"
        @cancel="cancelExit"
        @confirm="confirmExit"
    />
    <VHedgehogHelper
        v-if="currentTaskForHelper && !finished"
        :task="currentTaskForHelper"
        :selected-answer="selectedAnswer || feedback?.selected"
        action-type="grammar"
    />
    <div class="session-container">
      <section v-if="loading" class="view-state view-state--loading">
        <div class="bouncy-loader">
          <span></span><span></span><span></span>
        </div>
        <p class="loading-text">{{ t('trainerPage.loading') }}</p>
      </section>
      <section v-else-if="thematic.selectedModule" class="view-state view-state--content">
        <div v-if="!finished" class="top-nav">
          <div class="nav-actions">
            <VStopSessionBtn @close="exit"/>
          </div>
          <div class="progress-wrapper">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }">
                <div class="progress-glare"></div>
              </div>
            </div>
            <span class="progress-text">{{ current + 1 }} / {{ sessionTotalTasks }}</span>
          </div>
        </div>
        <div v-if="!finished" class="quiz-content">
          <div class="question-card">
            <div class="question-inner">
              <SoundBtn :text="cleanText(visibleSentence)"/>
              <p class="question-text" :class="{ 'is-revealed': feedback && feedback.isCorrect }">
                {{ visibleSentence }}
              </p>
            </div>
          </div>
          <div class="options-grid">
            <button
                v-for="option in answerOptions"
                :key="option"
                class="option-pill"
                :class="{
                  'is-selected': !isChecked && selectedAnswer === option,
                  'is-correct': isChecked && option === tasks[current].answer,
                  'is-wrong': isChecked && feedback && feedback.selected === option && !feedback.isCorrect,
                  'is-disabled': isChecked && option !== tasks[current].answer && option !== feedback?.selected
                }"
                @click="toggleOption(option)"
                :disabled="isChecked"
            >
              <span class="option-text">{{ option }}</span>
            </button>
          </div>
        </div>
        <div v-if="!isChecked && !finished" class="bottom-action-container">
          <button class="btn-gummy btn-gummy--primary" :disabled="!selectedAnswer" @click="performCheck">
            {{ t('questCompletedModals.check') || 'Проверить' }}
          </button>
        </div>
        <div v-if="isChecked && !finished" class="bottom-sheet"
             :class="feedback.isCorrect ? 'sheet--success' : 'sheet--error'">
          <div class="feedback-message">
            <div v-if="feedback.isCorrect" class="feedback-content">
              <span class="feedback-text">{{ t('trainerPage.right') }}</span>
            </div>
            <div v-else class="feedback-content">
              <span class="feedback-text">{{ t('trainerPage.false') }} {{ tasks[current].answer }}</span>
            </div>
          </div>
          <button class="btn-gummy" :class="feedback.isCorrect ? 'btn-gummy--success' : 'btn-gummy--error'"
                  @click="next">
            {{ t('trainerPage.further') }}
          </button>
        </div>
        <Transition name="fade-scale">
          <div v-if="shouldShowFinishModal" class="fullscreen-modal">
            <div class="confetti-container" v-if="correctAnswers === sessionTotalTasks && confettiParticles.length > 0">
              <div
                  v-for="p in confettiParticles"
                  :key="p.id"
                  class="confetti-piece"
                  :style="{
                    left: p.left + '%',
                    backgroundColor: p.color,
                    animationDelay: p.delay + 's',
                    animationDuration: p.duration + 's',
                    width: p.width + 'px',
                    height: p.height + 'px'
                  }"
              ></div>
            </div>
            <div class="fullscreen-content">
              <div v-if="animStep >= 1" class="step-fade-in">
                <img :src="correctAnswers === sessionTotalTasks ? Great : Support" class="status-img bounce-in"
                     alt="Status icon"/>
              </div>
              <div v-if="animStep >= 2" class="step-fade-in">
                <p class="fs-text" v-if="correctAnswers === sessionTotalTasks">
                  {{ t('trainerPage.save') }}
                </p>
                <p class="fs-text" v-else>
                  {{ t('trainerPage.result') }}
                </p>
                <div v-if="correctAnswers !== sessionTotalTasks" class="streak-number bounce-in">
                  {{ correctAnswers }} / {{ sessionTotalTasks }}
                </div>
              </div>
              <div v-if="animStep >= 3" class="step-fade-in full-width-block actions-spacing">
                <div class="fs-actions" v-if="correctAnswers === sessionTotalTasks">
                  <button class="ios-btn-primary fs-action-btn" @click="exit">
                    {{ t('trainerPage.backToTheme') }}
                  </button>
                </div>
                <div class="fs-actions" v-else>
                  <button class="ios-btn-primary fs-action-btn" @click="restartModule">
                    {{ t('trainerPage.repeat') }}
                  </button>
                  <button class="ios-btn-secondary fs-link-btn" @click="exit">
                    {{ t('trainerPage.toMain') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </section>
      <section v-else class="view-state view-state--error">
        <div class="result-emoji">Oops!</div>
        <p class="error-text">{{ t('trainerPage.notFound') }}</p>
        <button class="btn-gummy btn-gummy--primary" @click="exit">{{ t('trainerPage.toMain') }}</button>
      </section>
    </div>
    <VStreakModal
        v-model="showStreakModal"
        :streak="authStore.streakCount"
        @close="handleStreakClosed"
    />
  </main>
</template>

<script setup>
import {useTrainerStore} from '~/store/themenProgressStore.js'
import {userAuthStore} from '~/store/authStore.js'
import {dailyStore} from '~/store/dailyStore.js'
import {useRouter} from 'vue-router'
import {ref, onMounted, onUnmounted, computed, watch} from 'vue'
import SoundBtn from "../../src/components/soundBtn.vue";
import hedgehogLeaveSession from 'assets/animation/hedgehog_leave_session.json'

import VStopSessionBtn from "~/src/components/V-stopSessionBtn.vue";
import ExitSessionModal from '../../src/components/V-stopSessionModal.vue'
import {useSwipeBack} from '~/composables/useSwipeBack.js'
import VHedgehogHelper from "~/src/components/V-hedgehog-helper.vue";
import VStreakModal from '~/src/components/V-streak.vue'

import Great from '~/assets/images/Greatcon.svg'
import Support from '~/assets/images/Support.svg'

import {playCorrect, playWrong, playLevelCompleted, unlockAudioByUserGesture} from '~/utils/soundManager.js'

useSeoMeta({
  robots: 'noindex, nofollow'
})

const router = useRouter()
const {t} = useI18n()
const thematic = useTrainerStore()
const authStore = userAuthStore()
const daily = dailyStore()

const correctAnswers = ref(0)
const loading = ref(true)
const current = ref(0)
const answerOptions = ref([])
const selectedAnswer = ref(null)
const feedback = ref(null)
const finished = ref(false)
const isChecked = ref(false)
const showExitModal = ref(false)
const sessionMistakes = ref([])

const sessionTotalTasks = ref(0)
const animStep = ref(0)
const confettiParticles = ref([])

const showStreakModal = ref(false)
const isWaitingForStreakClose = ref(false)
const initialStreak = ref(authStore.streakCount || 0)
const streakWasIncremented = ref(false)

watch(() => authStore.streakCount, (newVal) => {
  if (newVal > initialStreak.value) streakWasIncremented.value = true
})

const {handleTouchStart, handleTouchMove, handleTouchEnd} = useSwipeBack(() => {
  exit()
}, {
  ignoreSelector: '.options-grid, .option-pill, .bottom-sheet, .btn-gummy, .hh-fab, .hh-overlay, .hh-bottom-sheet'
})

const tasks = computed(() => {
  const allTasks = thematic.selectedModule?.tasks || []
  const progress = thematic.getModuleProgress(thematic.selectedLevel?.level, thematic.selectedModule?.id)

  if (progress && !progress.completed && progress.mistakes?.length > 0) {
    return allTasks
        .map((task, index) => ({...task, originalIndex: index}))
        .filter(task => progress.mistakes.includes(task.originalIndex))
  }

  return allTasks.map((task, index) => ({...task, originalIndex: index}))
})

const shouldShowFinishModal = computed(() => {
  return finished.value && !showStreakModal.value && !isWaitingForStreakClose.value
})

const currentTaskForHelper = computed(() => {
  if (!tasks.value.length || current.value >= tasks.value.length) return null
  const currentTask = tasks.value[current.value]
  return {
    question: currentTask.question,
    answer: currentTask.answer,
    correctAnswer: currentTask.answer,
    options: answerOptions.value,
    type: 'grammar'
  }
})

const progressPercent = computed(() => {
  if (!sessionTotalTasks.value) return 0;
  return ((current.value + (finished.value ? 1 : 0)) / sessionTotalTasks.value) * 100
})

const visibleSentence = computed(() => {
  if (!tasks.value.length) return ''
  const task = tasks.value[current.value]
  if (isChecked.value && feedback.value?.isCorrect) {
    return task.question.replace('___', task.answer)
  }
  return task.question
})

const cleanText = (text) => {
  return text.replace(/_/g, '').trim()
}

const generateAnswerOptions = (correctAnswer) => {
  const allArticles = ['der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem'];
  let distractors = allArticles.filter(item => item !== correctAnswer);
  for (let i = distractors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }
  const options = [correctAnswer, distractors[0], distractors[1]];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  answerOptions.value = options;
}

const setupCurrentQuestion = () => {
  feedback.value = null;
  isChecked.value = false;
  selectedAnswer.value = null;
  if (tasks.value.length > 0) {
    const task = tasks.value[current.value];
    generateAnswerOptions(task.answer);
  }
}

const toggleOption = (option) => {
  if (isChecked.value) return;
  if (selectedAnswer.value === option) {
    selectedAnswer.value = null;
  } else {
    selectedAnswer.value = option;
  }
}

const performCheck = () => {
  if (!selectedAnswer.value || isChecked.value) return;
  check(selectedAnswer.value);
}

const check = (selected) => {
  if (isChecked.value) return;
  unlockAudioByUserGesture();
  const task = tasks.value[current.value]
  const isCorrect = selected === task.answer
  feedback.value = {isCorrect, selected};
  isChecked.value = true

  if (isCorrect) {
    playCorrect()
    correctAnswers.value += 1
  } else {
    playWrong()
    sessionMistakes.value.push(task.originalIndex)
  }
}

function spawnConfetti() {
  const confettiColors = ['#ffb100', '#c982ff', '#4caf50', '#00c2ff', '#ff5252', '#ffffff']
  const particles = []
  for (let i = 0; i < 70; i++) {
    particles.push({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 1.5,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      duration: 2.5 + Math.random() * 2,
      width: 7 + Math.random() * 8,
      height: 12 + Math.random() * 14
    })
  }
  confettiParticles.value = particles
}

const triggerFinishAnimations = () => {
  playLevelCompleted()
  if (correctAnswers.value === sessionTotalTasks.value) {
    spawnConfetti()
  }
  animStep.value = 0
  setTimeout(() => {
    animStep.value = 1
  }, 100)
  setTimeout(() => {
    animStep.value = 2
  }, 600)
  setTimeout(() => {
    animStep.value = 3
  }, 1100)
}

const handleStreakClosed = () => {
  showStreakModal.value = false
  isWaitingForStreakClose.value = false
  triggerFinishAnimations()
}

const next = async () => {
  if (current.value < tasks.value.length - 1) {
    current.value++
    setupCurrentQuestion();
  } else {
    finished.value = true
    await thematic.saveModuleAttempt(thematic.selectedLevel.level, thematic.selectedModule.id, sessionMistakes.value)

    isWaitingForStreakClose.value = true
    setTimeout(async () => {
      const isStreakHigher = authStore.streakCount > initialStreak.value
      const streakCountedToday = daily.currentCycle?.streakCounted || streakWasIncremented.value || isStreakHigher
      const modalAlreadyShownToday = daily.currentCycle?.streakModalShown === true

      if (streakCountedToday && !modalAlreadyShownToday) {
        if (typeof daily.markStreakModalShown === 'function') {
          await daily.markStreakModalShown()
        }
        showStreakModal.value = true
      } else {
        isWaitingForStreakClose.value = false
        triggerFinishAnimations()
      }
    }, 500)
  }
}

const exit = () => {
  const hasStarted = current.value > 0 || isChecked.value === true
  if (hasStarted && finished.value === false) {
    showExitModal.value = true
  } else {
    router.back()
  }
}

const confirmExit = () => {
  showExitModal.value = false
  router.back()
}

const cancelExit = () => {
  showExitModal.value = false
}

const restartModule = () => {
  correctAnswers.value = 0
  current.value = 0
  finished.value = false
  sessionMistakes.value = []
  animStep.value = 0
  confettiParticles.value = []

  sessionTotalTasks.value = tasks.value.length
  setupCurrentQuestion()
}

const handleBeforeUnload = (event) => {
  event.preventDefault();
};

onMounted(async () => {
  initialStreak.value = authStore.streakCount || 0
  if (!thematic.selectedModule) {
    await thematic.loadProgress()
  }
  loading.value = false;
  if (tasks.value.length > 0) {
    sessionTotalTasks.value = tasks.value.length
    setupCurrentQuestion();
  }
  window.addEventListener('beforeunload', handleBeforeUnload);
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
})

</script>

<style scoped>
.session-page {
  font-family: "Nunito", sans-serif;
  height: 100%;
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
}

.session-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.view-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.view-state--loading, .view-state--error {
  justify-content: center;
  align-items: center;
  padding: 24px;
  text-align: center;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 5px 10px;
  background: transparent;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.progress-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 28px;
  background-color: #e5e7eb;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.progress-fill {
  height: 100%;
  background: #4ade80;
  border-radius: 8px;
  transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  border: none;
}

.progress-glare {
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}

.progress-text {
  font-weight: 900;
  color: var(--titleColor);
  font-size: 16px;
}

.quiz-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 16px calc(env(safe-area-inset-bottom) + 120px);
  overflow-y: auto;
}

.question-card {
  background: #ffffff;
  border-radius: 20px;
  border: none;
  padding: 24px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 140px;
}

.question-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.question-text {
  font-size: 24px;
  font-weight: 900;
  color: #4c1d95;
  text-align: center;
  margin: 0;
  line-height: 1.3;
}

.question-text.is-revealed {
  color: #2563eb;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
}

.option-pill {
  width: 100%;
  padding: 16px 8px;
  background: #bfdbfe;
  border: 2px solid transparent;
  border-radius: 16px;
  box-shadow: 0 4px 0 #3b82f6;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.option-pill:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}

.option-text {
  font-family: "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 900;
  color: #1e3a8a;
}

.option-pill.is-selected {
  background: #93c5fd;
  border-color: #2563eb;
  box-shadow: 0 4px 0 #1d4ed8;
}

.option-pill.is-correct {
  background: #bbf7d0;
  box-shadow: 0 4px 0 #16a34a;
}

.option-pill.is-correct .option-text {
  color: #064e3b;
}

.option-pill.is-wrong {
  background: #fecaca;
  box-shadow: 0 4px 0 #e11d48;
}

.option-pill.is-wrong .option-text {
  color: #881337;
}

.option-pill.is-disabled {
  opacity: 0.6;
  background: #f3f4f6;
  box-shadow: 0 4px 0 #9ca3af;
  cursor: not-allowed;
}

.option-pill.is-disabled .option-text {
  color: #6b7280;
}

.bottom-action-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 1024px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 16px calc(env(safe-area-inset-bottom) + 16px);
  background: transparent;
  display: flex;
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 1024px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 16px calc(env(safe-area-inset-bottom) + 16px);
  border: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

.sheet--success {
  background: #d1fae5;
  border-top: 3px solid #2E7D32;;
}

.sheet--error {
  background: #ffe4e6;
  border-top: 2px solid #C62828;;
}

.feedback-message {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.feedback-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feedback-text {
  font-size: 20px;
  font-weight: 900;
  color: #1f2937;
  text-align: left;
  line-height: 1.2;
}

.sheet--error .feedback-text b {
  color: #be123c;
  display: block;
}

.btn-gummy {
  width: 100%;
  padding: 16px;
  font-family: "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 900;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  text-transform: uppercase;
}

.btn-gummy:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: 0 5px 0 #9ca3af !important;
  background: #d1d5db !important;
}

.btn-gummy:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent !important;
}

.btn-gummy--primary {
  background: #60a5fa;
  color: #ffffff;
  box-shadow: 0 5px 0 #2563eb;
}

.btn-gummy--success {
  background: #4ade80;
  color: #064e3b;
  box-shadow: 0 5px 0 #16a34a;
}

.btn-gummy--error {
  background: #f87171;
  color: #ffffff;
  box-shadow: 0 5px 0 #e11d48;
}

/* --- Стили для полноэкранной модалки --- */
.fullscreen-modal {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: var(--bg, #f2f2f7);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.fullscreen-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.full-width-block {
  width: 100%;
}

.actions-spacing {
  margin-top: 20px;
}

.step-fade-in {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInStep 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInStep {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fs-title {
  font-size: 32px;
  font-weight: 900;
  color: var(--titleColor, #1c1c1e);
  margin-bottom: 6px;
}

.fs-text {
  font-size: 19px;
  font-weight: 600;
  color: #8e8e93;
  margin-bottom: 6px;
}

.streak-number {
  font-size: 34px;
  font-weight: 900;
  color: #34C759;
  line-height: 1;
  margin-bottom: 24px;

  padding: 8px 24px;
  border-radius: 20px;
  display: inline-block;
}

.status-img {
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  object-fit: contain;
}

.fs-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.ios-btn-primary {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 800;
  box-shadow: 0 6px 0 #005bb5;
  cursor: pointer;
  transition: all 0.1s;
  width: 100%;
}

.ios-btn-primary:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #005bb5;
}

.ios-btn-secondary {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  background: none;
  color: #89898e;
  padding: 16px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 800;
  width: 100%;
  border: none;
  cursor: pointer;
}

.ios-btn-secondary:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #d1d1d6;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 10000;
}

.confetti-piece {
  position: absolute;
  top: -20px;
  border-radius: 3px;
  animation: confettiFall linear forwards;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(105vh) rotate(720deg);
    opacity: 0;
  }
}

.bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Лоадер */
.bouncy-loader {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.bouncy-loader span {
  width: 18px;
  height: 18px;
  background: #60a5fa;
  border: none;
  border-radius: 50%;
  animation: bounce 0.5s alternate infinite cubic-bezier(0.6, 0.05, 0.15, 0.95);
}

.bouncy-loader span:nth-child(2) {
  background: #4ade80;
  animation-delay: 0.1s;
}

.bouncy-loader span:nth-child(3) {
  background: #fde047;
  animation-delay: 0.2s;
}

.loading-text {
  font-size: 20px;
  font-weight: 900;
  color: #4b5563;
}
</style>