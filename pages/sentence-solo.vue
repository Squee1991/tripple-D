<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useDuelStore } from '../store/sentenceDuelStore.js'
import { useLocalStatGameStore } from '../store/localSentenceStore.js'
import VStopSessionModal from "~/src/components/V-stopSessionModal.vue";

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const gameStore = useDuelStore()
const statStore = useLocalStatGameStore()
const level = route.query.level || 'A1'
const tasks = ref([])
const totalRounds = ref(8)
const currentRound = ref(0)
const scrambledWords = ref([])
const currentQuestion = computed(() => tasks.value[currentRound.value])
const answer = ref([])
const finished = ref(false)
const correctAnswers = ref(0)
const showCountdown = ref(true)
const countdown = ref(3)
const showModal = ref(false)
const isAnswerChecked = ref(false)
const feedback = ref(null)

const cancelExit = () =>{
  showModal.value = false
}

const confirmExit = () =>{
  showModal.value = false
  router.push('/sentence-duel')
}

const restartDialogue = () => {
  currentRound.value = 0
  correctAnswers.value = 0
  answer.value = []
  feedback.value = null
  isAnswerChecked.value = false
  finished.value = false
  setScrambled()
}

async function checkAnswer() {
  if (answer.value.length === 0) return
  isAnswerChecked.value = true

  const userAnswer = answer.value.join(' ').trim().toLowerCase()
  const correctAnswer = currentQuestion.value.answer.trim().toLowerCase()

  if (userAnswer === correctAnswer) {
    feedback.value = 'correct'
    correctAnswers.value++
    await statStore.incrementConstructedSentences()
  } else {
    feedback.value = 'incorrect'
  }
}

async function waitForNextQuestion(timeout = 1000) {
  const start = Date.now()
  while (!currentQuestion.value && Date.now() - start < timeout) {
    await new Promise(resolve => setTimeout(resolve, 20))
  }
}

function proceedToNextRound() {
  if (currentRound.value < totalRounds.value - 1) {
    currentRound.value++
    answer.value = []
    feedback.value = null
    isAnswerChecked.value = false
    waitForNextQuestion().then(() => {
      setScrambled()
    })
  } else {
    finished.value = true
  }
}

function setScrambled() {
  if (!currentQuestion.value || !currentQuestion.value.question) return
  const words = currentQuestion.value.question.split(' ')
  scrambledWords.value = words.filter(w => w).sort(() => Math.random() - 0.5)
}

function addWord(word, index) {
  if (isAnswerChecked.value && feedback.value === 'correct') return

  if (feedback.value === 'incorrect') {
    feedback.value = null
    isAnswerChecked.value = false
  }

  answer.value.push(word)
  scrambledWords.value.splice(index, 1)
}

function removeWord(index) {
  if (isAnswerChecked.value && feedback.value === 'correct') return

  if (feedback.value === 'incorrect') {
    feedback.value = null
    isAnswerChecked.value = false
  }

  const word = answer.value[index]
  answer.value.splice(index, 1)
  scrambledWords.value.push(word)
}

onMounted(async () => {
  await gameStore.loadLocalTasks(level)
  try {
    await statStore.loadLocalStats()
  } catch (e) {
    console.warn(e.message)
  }

  tasks.value = gameStore.localTasks.map(sentence => {
    const cleanSentence = sentence.original.toLowerCase().replace(/[.,!?;]/g, '')
    return {
      question: cleanSentence,
      answer: cleanSentence
    }
  }).slice(0, totalRounds.value)

  if (tasks.value.length > 0) {
    setScrambled()
  }
  let n = 3
  countdown.value = n
  showCountdown.value = true
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
      setTimeout(() => {
        showCountdown.value = false
      }, 500)
    }
  }, 1000)
})
</script>

<template>
  <div>
    <VStopSessionModal
        :show="showModal"
        @cancel="cancelExit"
        @confirm="confirmExit"
    />
    <div v-if="showCountdown" class="countdown-overlay">
      <div class="countdown-content">
        <p v-if="countdown > 0" class="countdown-number">{{ countdown }}</p>
        <p v-else class="countdown-number start">{{ t('wordDuelSession.start') }}</p>
      </div>
    </div>
    <div class="game-page-wrapper">
      <div class="game-container">
        <div v-if="!finished" class="game-board">
          <div class="duel__header">
            <button class="btn-icon-back" @click="showModal = true">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                   stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div class="custom-progress">
              <div class="progress_exp-bar">
                <div class="progress__bar" :style="{ width: `${((currentRound + 1) / totalRounds) * 100}%` }">
                  <div class="glare"></div>
                </div>
              </div>
            </div>
            <div class="progress-circle">
              {{ currentRound + 1 }} / {{ totalRounds }}
            </div>
          </div>
          <div class="board__wrapper">
            <div class="answer-section" :class="{ 'correct-answer': feedback === 'correct', 'incorrect-answer': feedback === 'incorrect' }">
              <div v-if="answer.length === 0" class="placeholder-text"></div>
              <button v-for="(word, index) in answer" :key="index" @click="removeWord(index)" class="answer-word"
                      :disabled="isAnswerChecked && feedback === 'correct'">
                {{ word }}
              </button>
            </div>
            <div class="word-pool">
              <button v-for="(word, i) in scrambledWords" :key="i" @click="addWord(word, i)" class="word-button"
                      :disabled="isAnswerChecked && feedback === 'correct'">
                {{ word }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!finished" class="actions-wrapper" :class="feedback">
      <div class="actions-container">
        <div v-if="isAnswerChecked" class="feedback-text">
          <p v-if="feedback === 'correct'" class="feedback correct slide-up">✔ {{ t('prasens.correct') }}</p>
          <p v-if="feedback === 'incorrect'" class="feedback incorrect shake">✖ {{ t('prasens.tryAgain') }}</p>
        </div>
        <button v-if="!isAnswerChecked || feedback === 'incorrect'" class="btn btn-check" @click="checkAnswer">
          {{ t('prasens.check') }}
        </button>
        <button v-if="isAnswerChecked && feedback === 'correct'" class="btn btn-next slide-up" @click="proceedToNextRound">
          {{ t('prasens.further') }}
        </button>
      </div>
    </div>
    <Transition name="slide-up">
      <div v-if="finished" class="completion-overlay">
        <div class="completion-modal">
          <h2>{{ t('speakSession.goodJob')}}</h2>
          <p>{{ t('Вы завершили это задание')}}</p>
          <div class="completion-overlay_icon">
            <img src="../assets/images/GoodJobIcon.svg" alt="success_icon">
          </div>
          <div class="completion-actions">
            <button class="btn-primary" @click="confirmExit">{{ t('speakSession.list')}}</button>
            <button class="btn-secondary" @click="restartDialogue">{{ t('speakSession.repeat')}}</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>

.countdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: #fff
}

.board__wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 15px;
}

.duel__header {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 5px 10px 15px 10px;
  gap: 10px;
}

@keyframes countdown-pulse {
  0% { transform: scale(.8); opacity: 0 }
  50% { transform: scale(1.2); opacity: 1 }
  100% { transform: scale(1); opacity: 1 }
}

@keyframes start-fade-out {
  0% { transform: scale(1); opacity: 1 }
  100% { transform: scale(1.5); opacity: 0 }
}

.countdown-number {
  font-family: Nunito, sans-serif;
  font-size: 4rem;
  font-weight: 800;
  animation: countdown-pulse .9s ease-out
}

.countdown-number.start {
  font-size: 4rem;
  animation: start-fade-out .5s ease-in forwards
}

.game-page-wrapper {
  min-height: 100%;
  font-family: 'Nunito', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-container {
  width: 100%;
  max-width: 900px;
}

.game-board {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding-bottom: 140px;
}

.results-board {
  text-align: center;
}

.custom-progress {
  position: relative;
  width: 100%;
}

.progress_exp-bar {
  flex: 1;
  height: 28px;
  background: #e8eae5;
  border-radius: 20px;
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background-color: #10b981;
  border-radius: 8px;
  transition: width 0.4s ease-out;
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

.progress-circle {
  font-size: 20px;
  font-weight: 800;
  color: var(--titleColor);
  white-space: nowrap;
  z-index: 2;
}

.word-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.word-button {
  padding: 10px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  background-color: #fff;
  cursor: pointer;
  transition: all .1s ease-in-out;
}

.word-button:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #1e1e1e;
}

.word-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.answer-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 80px;
  padding: 8px;
  margin-bottom: 15px;
  border-radius: 16px;
  background: white;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  transition: all 0.2s ease;
}

.placeholder-text {
  color: #a0a6b1;
  font-size: 1.3rem;
  font-weight: 600;
}

.answer-word {
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  background-color: #fff;
  cursor: pointer;
  transition: all .1s ease-in-out;
}

.answer-word:hover:not(:disabled) {
  background-color: #f8d7da;
  transform: scale(0.95);
}

.answer-word:disabled {
  cursor: default;
  opacity: 0.9;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
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
  box-shadow: 0px 0px 0px #2b2b2b;
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
}

.feedback.correct {
  color: #2E7D32;
}

.feedback.incorrect {
  color: #C62828;
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

.actions-wrapper.incorrect .btn-check {
  background-color: #ef4444;
  box-shadow: 0 5px 0 #dc2626;
}

.btn-next {
  background-color: #4ade80;
  box-shadow: 0 5px 0 #12a647;
}

.btn:active {
  transform: translateY(2px);
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

.completion-overlay_icon {
  width: 140px;
  margin-bottom: 20px;
}

.completion-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 150;
  pointer-events: none;
}

.completion-modal {
  background: var(--bgModal, #ffffff);
  border-radius: 24px 24px 0 0 ;
  padding: 30px 20px;
  width: 100%;
  max-width: 768px;
  text-align: center;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border-top: 3px solid whitesmoke;
  pointer-events: auto;
}

.completion-modal h2 {
  font-size: 27px;
  color: var(--titleColor, #111827);
  font-weight: 700;
  margin: 0;
}

.completion-modal p {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 10px 0;
}

.completion-actions {
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  margin-top: 10px;
}

.btn-primary {
  flex: 1;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 16px;
  border: none;
  background-color: #3b82f6;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 0 #2563eb;
  transition: transform 0.1s;
}

.btn-primary:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #2563eb;
}

.btn-secondary {
  flex: 1;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 16px;
  border: 2px solid var(--tabsSlideBorderColor, #e5e7eb);
  background-color: #fff;
  color: #374151;
  cursor: pointer;
  box-shadow: var(--boxShadowMobile);
  transition: transform 0.1s;
}

.btn-secondary:active {
  transform: translateY(2px);
}
</style>