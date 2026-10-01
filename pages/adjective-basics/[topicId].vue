<template>
  <div class="quiz-page">
    <div class="mini-salute-container" v-if="miniConfettiParticles.length > 0">
      <div
          v-for="p in miniConfettiParticles"
          :key="p.id"
          class="mini-confetti-piece"
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

    <header v-if="!loading && store.activeQuestion && !store.quizCompleted" class="quiz-header">
      <button @click="backTo" class="btn-icon-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="#374151" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <div class="progress-container">
        <div class="progress-wrapper">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%'}">
              <div class="progress-glare"></div>
            </div>
          </div>
        </div>
        <div class="question-counter">
          {{ store.currentQuestionIndex + 1 }} / {{ store.currentQuestions.length }}
        </div>
      </div>
    </header>

    <main class="quiz-main-content">
      <div v-if="loading" class="loading">
        <VLoginPreloader/>
      </div>

      <div v-else-if="store.quizCompleted" class="finish-screen">
        <VQuestResultScreen
            :finished="store.quizCompleted"
            :has-mistakes="store.score < store.currentQuestions.length"
            :previously-cleared="false"
            :anim-step="animStep"
            :display-xp="5"
            :display-coins="5"
            :confetti-particles="confettiParticles"
            :has-next-quest="false"
            @next="backTo"
            @themes="backTo"
            @retry-mistakes="retryQuiz"
        />
      </div>

      <div v-else-if="store.activeQuestion" class="quiz-content">
        <div class="question-card">
          <SoundBtn :text="fullSentence"/>
          <p class="question-text">
            <span>{{ store.activeQuestion.question.split('___')[0] }}</span>
            <span class="blank-space" :class="{ 'has-selection': store.selectedOption }">
              {{ store.selectedOption || '( ... )' }}
            </span>
            <span>{{ store.activeQuestion.question.split('___')[1] }}</span>
          </p>
        </div>

        <div class="options-grid">
          <button
              v-for="option in store.activeQuestion.options"
              :key="option"
              @click="handleOptionClick(option)"
              class="option-button"
              :class="{ selected: store.selectedOption === option }"
              :disabled="store.feedback !== null"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </main>

    <div v-if="store.activeQuestion && !store.quizCompleted && !loading" class="actions-wrapper" :class="store.feedback">
      <div class="actions-container">
        <div v-if="store.feedback" class="feedback-text">
          <div v-if="store.feedback === 'correct'" class="feedback correct slide-up">
            <span class="feedback-emoji">✨</span>
            {{ t('prasens.correct') }}
          </div>
          <div v-else class="feedback incorrect shake quest__correct-answer-block">
            <div class="feedback-wrong-header">
              <span class="feedback-emoji">❌</span>
              {{ t('prasens.wrong') }}
            </div>
            <div class="correct-answer-text">{{ store.activeQuestion.answer }}</div>
          </div>
        </div>
        <button
            v-if="!store.feedback"
            class="btn btn-check"
            :disabled="!store.selectedOption"
            @click="handleCheck"
        >
          {{ t('prasens.check') }}
        </button>
        <button
            v-if="store.feedback"
            class="btn slide-up"
            :class="store.feedback === 'correct' ? 'btn-next' : 'btn-wrong'"
            @click="store.nextQuestion()"
        >
          {{ t('prasens.further') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSeoMeta } from '#imports'
import { useQuizStore } from '~/store/adjectiveStore.js'
import { userlangStore } from '~/store/learningStore.js'
import SoundBtn from '~/src/components/soundBtn.vue'
import VLoginPreloader from "~/src/components/V-loginPreloader.vue"
import VQuestResultScreen from '~/src/components/V-QuestResultScreen.vue'
import { useQuestAnimations } from '~/composables/useQuestAnimations.js'
import { playCorrect, playWrong, playLevelCompleted, unlockAudioByUserGesture } from '~/utils/soundManager.js'

useSeoMeta({ robots: 'noindex, nofollow' })

const AWARD_EXP = 5
const AWARD_POINTS = 5
const DELAY_MS = 4000
const TARGET_LANG_CODE = 'de'

const router = useRouter()
const route = useRoute()
const store = useQuizStore()
const learning = userlangStore()
const { t } = useI18n()

const loading = ref(true)
const isSpeaking = ref(false)
const category = 'adjective-basics'
const { topicId } = route.params
const consecutiveCorrectCount = ref(0)

const learningLanguage = computed(() => learning.learningLang || 'de')

const progressPercent = computed(() => {
  const total = store.currentQuestions.length
  if (total === 0) return 0
  if (store.quizCompleted) return 100
  return ((store.currentQuestionIndex) / total) * 100
})

const shouldShowResultScreen = computed(() => store.quizCompleted)

const {
  animStep,
  displayCoins,
  displayXp,
  confettiParticles,
  miniConfettiParticles,
  spawnMiniConfetti,
  resetAnimations
} = useQuestAnimations(store, ref(false), shouldShowResultScreen)

async function speakText(text) {
  if (isSpeaking.value || !text) return
  isSpeaking.value = true
  try {
    if (typeof getSpeechAudio === 'function') {
      await getSpeechAudio(text.trim())
    }
  } catch (error) {
    console.error(error)
  } finally {
    isSpeaking.value = false
  }
}

function handleOptionClick(option) {
  store.chooseOption(option)
  if (learningLanguage.value === TARGET_LANG_CODE && option.length > 0 && !option.includes('.')) {
    speakText(option)
  }
}

const retryQuiz = async () => {
  resetAnimations()
  consecutiveCorrectCount.value = 0
  const fileName = `/adjective/${category}-${topicId}.json`
  await store.startNewQuiz({ modeId: category, topicId, fileName, contentVersion: 'v1' })
}

const fullSentence = computed(() => {
  const q = store.activeQuestion
  if (!q) return ''
  const [pre, post = ''] = q.question.split('___')
  const word = store.selectedOption || ''
  return `${pre}${word}${post}`
})

const backTo = () => router.push(`/adjective-basics`)

function handleCheck() {
  unlockAudioByUserGesture()
  store.checkAnswer()
}

watch(() => store.feedback, (status) => {
  if (!status) return
  if (status === 'correct') {
    playCorrect()
    consecutiveCorrectCount.value++
    if (consecutiveCorrectCount.value === 5) {
      spawnMiniConfetti()
      consecutiveCorrectCount.value = 0
    }
  } else if (status === 'incorrect') {
    playWrong()
    consecutiveCorrectCount.value = 0
  }
})

onMounted(async () => {
  loading.value = true
  const fileName = `/adjective/${category}-${topicId}.json`
  store.setContext({ modeId: category, topicId, fileName, contentVersion: 'v1' })
  await store.restoreOrStart({ modeId: category, topicId, fileName, contentVersion: 'v1' })
  await learning.loadFromFirebase?.()
  setTimeout(() => {
    loading.value = false
  }, 2800)
})

watch(() => store.quizCompleted, async (done) => {
  if (!done) return

  playLevelCompleted()

  if (store.score >= 8) {
    const curExp = Number(learning.exp || 0)
    const rawTargetExp = curExp + AWARD_EXP
    const targetPoints = Number(learning.points || 0) + AWARD_POINTS

    setTimeout(async () => {
      learning.exp = rawTargetExp
      learning.points = targetPoints
      learning.handleLeveling?.()
      await learning.saveToFirebase?.()
    }, DELAY_MS)
  }
})
</script>

<style scoped>
.quiz-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: var(--bg, #f7f9fc);
  font-family: "Nunito", sans-serif;
  overflow: hidden;
}

.mini-salute-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 99999;
}

.mini-confetti-piece {
  position: absolute;
  top: -30px;
  opacity: 0;
  border-radius: 3px;
  animation: miniConfettiFall linear forwards;
  will-change: transform, opacity;
}

@keyframes miniConfettiFall {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg) scale(0.6);
    opacity: 0;
  }
}

.quiz-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  gap: 20px;
  background-color: var(--bg, #ffffff);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  flex-shrink: 0;
  z-index: 10;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid #2b2b2b;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 2px 0px #2b2b2b;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.progress-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 10px;
}

.question-counter {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--titleColor, #374151);
}

.progress-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
}

.progress-bar {
  flex: 1;
  height: 24px;
  background-color: #e5e7eb;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
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
  background: rgba(255, 255, 255, 0.4);
  border-radius: 4px;
}

.quiz-main-content {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.quiz-main-content::-webkit-scrollbar {
  display: none;
}

.quiz-content {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  padding-bottom: 150px;
}

.question-card {
  border-radius: 24px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
}

.question-text {
  font-size: 18px;
  color: var(--titleColor);
  margin: 0;
  line-height: 1.5;
  font-weight: 700;
}

.blank-space {
  color: #9ca3af;
  border-bottom: 2px dashed #d1d5db;
  text-align: center;
  transition: all 0.3s ease;
  padding: 0 5px;
}

.blank-space.has-selection {
  color: #3b82f6;
  border-bottom: 2px solid #3b82f6;
}

.options-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.option-button {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-bottom: 6px solid #e5e7eb;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 800;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.1s ease-out;
  min-width: 120px;
  text-align: center;
}

.option-button:active:not(:disabled) {
  transform: translateY(4px);
  border-bottom-width: 2px;
  margin-bottom: 4px;
}

.option-button.selected {
  background: #eff6ff;
  border-color: #60a5fa;
  border-bottom-color: #3b82f6;
  color: #1d4ed8;
}

.option-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.feedback-emoji {
  font-size: 24px;
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
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-check {
  background-color: #3b82f6;
  box-shadow: 0 5px 0 #2563eb;
}

.btn-check:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.btn:active:not(:disabled) {
  transform: translateY(2px);
}

.slide-up-enter-active,
.slide-up-leave-active,
.slide-up {
  transition: transform 0.3s ease-in-out;
  animation: slideUpAnim 0.3s forwards;
}

@keyframes slideUpAnim {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
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

.finish-screen {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

@media (max-width: 767px) {
  .question-text {
    font-size: 1.2rem;
  }
  .option-button {
    font-size: 1.1rem;
    padding: 12px 18px;
  }
  .feedback {
    font-size: 1.2rem;
  }
}
</style>