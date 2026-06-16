<template>
  <main class="session-page"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
  >
    <ExitSessionModal
        :show="showExitModal"
        @update:show="val => showExitModal = val"
        @cancel="cancelExit"
        @confirm="confirmExit"
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
            <span class="progress-text">{{ current + 1 }} / {{ tasks.length }}</span>
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
                  'is-correct': isChecked && option === tasks[current].answer,
                  'is-wrong': isChecked && feedback && feedback.selected === option && !feedback.isCorrect,
                  'is-disabled': isChecked && option !== tasks[current].answer && option !== feedback?.selected
                }"
                @click="check(option)"
                :disabled="isChecked"
            >
              <span class="option-text">{{ option }}</span>
            </button>
          </div>
        </div>
        <transition name="slide-up-bouncy">
          <div v-if="isChecked && !finished" class="bottom-sheet"
               :class="feedback.isCorrect ? 'sheet--success' : 'sheet--error'">
            <div class="feedback-message">
              <div v-if="feedback.isCorrect" class="feedback-content">
                <span class="feedback-text">{{ t('trainerPage.right') }}</span>
              </div>
              <div v-else class="feedback-content">
                <span class="feedback-text">{{ t('trainerPage.false') }} <br/><b>{{ tasks[current].answer }}</b></span>
              </div>
            </div>
            <button class="btn-gummy" :class="feedback.isCorrect ? 'btn-gummy--success' : 'btn-gummy--error'"
                    @click="next">
              {{ t('trainerPage.further') }}
            </button>
          </div>
        </transition>
        <div v-if="finished" class="view-state view-state--complete">
          <div class="finish-card" v-if="correctAnswers === tasks.length">
            <div class="result-emoji">🏆</div>
            <h3 class="result-title">{{ t('trainerPage.end') }}</h3>
            <p class="result-subtitle">{{ t('trainerPage.save') }}</p>
            <button class="btn-gummy btn-gummy--primary" @click="exit">{{ t('trainerPage.backToTheme') }}</button>
          </div>
          <div class="finish-card" v-else>
            <div class="result-emoji">💪</div>
            <h3 class="result-title">{{ t('trainerPage.morePractice') }}</h3>
            <p class="result-subtitle">{{ t('trainerPage.result') }} <span>{{ correctAnswers }} / {{
                tasks.length
              }}</span></p>
            <div class="result-actions">
              <button class="btn-gummy btn-gummy--primary" @click="restartModule">{{ t('trainerPage.repeat') }}</button>
              <button class="btn-gummy btn-gummy--secondary" @click="exit">{{ t('trainerPage.toMain') }}</button>
            </div>
          </div>
        </div>
      </section>
      <section v-else class="view-state view-state--error">
        <div class="result-emoji">Oops!</div>
        <p class="error-text">{{ t('trainerPage.notFound') }}</p>
        <button class="btn-gummy btn-gummy--primary" @click="exit">{{ t('trainerPage.toMain') }}</button>
      </section>
    </div>
  </main>
</template>

<script setup>
import {useTrainerStore} from '../../store/themenProgressStore.js'
import {useRouter} from 'vue-router'
import {ref, onMounted, onUnmounted, computed} from 'vue'
import SoundBtn from "../../src/components/soundBtn.vue";
import {useSeoMeta} from '#imports'
import VBackBtn from "~/src/components/V-back-btn.vue";
import VStopSessionBtn from "~/src/components/V-stopSessionBtn.vue";
import ExitSessionModal from '../../src/components/V-stopSessionModal.vue'
import SadHedgehogIcon from '../../assets/images/Sadlyhedgehog.png'
import {useSwipeBack} from '~/composables/useSwipeBack.js'

useSeoMeta({
  robots: 'noindex, nofollow'
})

const router = useRouter()
const {t} = useI18n()
const thematic = useTrainerStore()

const correctAnswers = ref(0)
const loading = ref(true)
const current = ref(0)
const answerOptions = ref([])
const feedback = ref(null)
const finished = ref(false)
const isChecked = ref(false)
const showExitModal = ref(false)
const sessionMistakes = ref([])
const {handleTouchStart, handleTouchMove, handleTouchEnd} = useSwipeBack(() => {
  exit()
}, {
  ignoreSelector: '.options-grid, .option-pill, .bottom-sheet, .btn-gummy'
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

const progressPercent = computed(() => {
  if (!tasks.value.length) return 0;
  return ((current.value + (finished.value ? 1 : 0)) / tasks.value.length) * 100
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
  if (tasks.value.length > 0) {
    const task = tasks.value[current.value];
    generateAnswerOptions(task.answer);
  }
}

const check = (selectedAnswer) => {
  if (isChecked.value) return;

  const task = tasks.value[current.value]
  const isCorrect = selectedAnswer === task.answer
  feedback.value = {isCorrect, selected: selectedAnswer};
  isChecked.value = true

  if (isCorrect) {
    correctAnswers.value += 1
  } else {
    sessionMistakes.value.push(task.originalIndex)
  }
}

const next = async () => {
  if (current.value < tasks.value.length - 1) {
    current.value++
    setupCurrentQuestion();
  } else {
    finished.value = true
    await thematic.saveModuleAttempt(thematic.selectedLevel.level, thematic.selectedModule.id, sessionMistakes.value)
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
  setupCurrentQuestion()
}

const handleBeforeUnload = (event) => {
  event.preventDefault();
};

onMounted(async () => {
  if (!thematic.selectedModule) {
    await thematic.loadProgress()
  }
  loading.value = false;
  if (tasks.value.length > 0) {
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

.quiz-header {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.theme-badge {
  background: #fef3c7;
  color: #d97706;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 900;
  font-size: 1.1rem;
  box-shadow: 0 4px 0 #fde68a;
  text-transform: uppercase;
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
  border: none;
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

.bottom-sheet {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 1024px;
  left: 50%;
  transform: translateX(-50%);
  padding: 16px 16px calc(env(safe-area-inset-bottom) + 16px);
  border-radius: 24px 24px 0 0;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 10;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

.sheet--success {
  background: #d1fae5;
}

.sheet--error {
  background: #ffe4e6;
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

.feedback-emoji {
  font-size: 32px;
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

.view-state--complete {
  padding: 20px;
  justify-content: center;
}

.finish-card {
  background: #ffffff;
  border-radius: 24px;
  border: none;
  padding: 32px 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-emoji {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-title {
  font-size: 28px;
  font-weight: 900;
  color: #4c1d95;
  margin: 0 0 12px 0;
}

.result-subtitle {
  font-size: 18px;
  font-weight: 800;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.result-subtitle span {
  color: #1d4ed8;
  font-weight: 900;
  font-size: 22px;
  background: #dbeafe;
  padding: 4px 12px;
  border-radius: 12px;
  border: none;
  display: inline-block;
  margin-top: 8px;
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
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

.btn-gummy:active {
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

.btn-gummy--secondary {
  background: #36c95d;
  color: white;
  box-shadow: 0 5px 0 #6dd98b;
}

.btn-gummy--danger {
  background: none;
  color: #7f1d1d;
}

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

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-15px);
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.slide-up-bouncy-enter-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-bouncy-leave-active {
  transition: transform 0.2s ease-in;
}

.slide-up-bouncy-enter-from, .slide-up-bouncy-leave-to {
  transform: translateX(-50%) translateY(100%);
}
</style>