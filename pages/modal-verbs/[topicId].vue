<template>
  <div class="quiz-page">
    <header v-if="!loading && quizStore.activeQuestion" class="quiz-header">
      <button class="btn-icon-back" @click="backTo">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="#374151" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <div class="progress-wrapper">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }">
            <div class="progress-glare"></div>
          </div>
        </div>
      </div>
      <div class="question-counter">
        {{ quizStore.currentQuestionIndex + 1 }} / {{ quizStore.currentQuestions.length }}
      </div>
    </header>
    <main class="quiz-main-content">
      <div v-if="loading" class="loading">
        <VLoginPreloader/>
      </div>
      <div v-else-if="quizStore.quizCompleted" class="finish-screen">
        <template v-if="isVictory">
          <CelebrationFireworks
              :key="`cw-${startExpLocal}-${targetExpLocal}-${startPointsLocal}-${targetPointsLocal}`"
              :start-exp="startExpLocal"
              :target-exp="targetExpLocal"
              :start-points="startPointsLocal"
              :target-points="targetPointsLocal"
              :level-start="startLevelLocal"
              :level-end="endLevelLocal"
          />
        </template>
        <template v-else>
          <div class="fail-card">
            <p class="fail-text">{{ t('sessionNotSuccessModal.failText')}} {{ quizStore.score }} / {{ quizStore.currentQuestions.length }}.</p>
            <p class="fail-sub">
              {{ t('sessionNotSuccessModal.failSub')}}
            </p>
            <div class="fail-actions">
              <button class="btn try-again" @click="retryQuiz">{{ t('sessionNotSuccessModal.again')}}</button>
              <button class="btn back" @click="backTo">{{ t('sessionNotSuccessModal.back')}}</button>
            </div>
          </div>
        </template>
      </div>

      <div v-else-if="quizStore.activeQuestion" class="quiz-content">
        <div class="question-card">
          <SoundBtn :text="fullSentence"/>
          <p class="question-text">
            <span>{{ quizStore.activeQuestion.question.split('___')[0] }}</span>
            <span class="blank-space" :class="{ 'has-selection': quizStore.selectedOption }">
              {{ quizStore.selectedOption || '( ... )' }}
            </span>
            <span>{{ quizStore.activeQuestion.question.split('___')[1] }}</span>
          </p>
        </div>

        <div class="options-grid">
          <button
              v-for="option in quizStore.activeQuestion.options"
              :key="option"
              @click="quizStore.chooseOption(option)"
              class="option-button"
              :class="{ selected: quizStore.selectedOption === option }"
              :disabled="quizStore.feedback !== null"
          >
            {{ option }}
          </button>
        </div>

        <div class="footer-controls">
          <div v-if="quizStore.feedback" class="feedback-message" :class="quizStore.feedback">
            <span v-if="quizStore.feedback === 'correct'">✨ {{ t('prasens.correct') }}</span>
            <span v-else>❌ {{ t('prasens.wrong') }} <b>{{ quizStore.activeQuestion.answer }}</b></span>
          </div>

          <button
              v-if="quizStore.feedback === null"
              @click="quizStore.checkAnswer()"
              :disabled="!quizStore.selectedOption"
              class="action-button check"
          >
            {{ t('prasens.check') }}
          </button>
          <button
              v-else
              @click="quizStore.nextQuestion()"
              class="action-button next"
          >
            {{ t('prasens.further') }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useSeoMeta} from '#imports'

import {useQuizStore} from '../../store/adjectiveStore.js'
import {userlangStore} from '../../store/learningStore.js'
import CelebrationFireworks from '../../src/components/CelebrationFireworks.vue'
import SoundBtn from '../../src/components/soundBtn.vue'
import VPreloader from "~/src/components/V-preloader.vue";
import VLoginPreloader from "~/src/components/V-loginPreloader.vue";

useSeoMeta({robots: 'noindex, nofollow'})

const AWARD_EXP = 5
const AWARD_POINTS = 5
const DELAY_MS = 4000
const LEVEL_UP_XP = 100

const router = useRouter()
const route = useRoute()
const learning = userlangStore()
const quizStore = useQuizStore()
const {t} = useI18n()

const loading = ref(true)
const category = 'modal-verbs'
const {topicId} = route.params

const isVictory = computed(() => {
  return quizStore.currentQuestions.length === 10 && quizStore.score >= 8
})

// Вычисляем процент для прогресс-бара
const progressPercentage = computed(() => {
  if (!quizStore.currentQuestions || quizStore.currentQuestions.length === 0) return 0;
  return (quizStore.currentQuestionIndex / quizStore.currentQuestions.length) * 100;
})

const retryQuiz = async () => {
  const fileName = `/adjective/${category}-${topicId}.json`
  await quizStore.startNewQuiz({ modeId: category, topicId, fileName, contentVersion: 'v1' })
}

const fullSentence = computed(() => {
  const quest = quizStore.activeQuestion
  if (!quest) return ''
  const [pre, post = ''] = quest.question.split('___')
  const word = quizStore.selectedOption || ''
  return `${pre}${word}${post}`
})

const startExpLocal = ref(0)
const targetExpLocal = ref(0)
const startPointsLocal = ref(0)
const targetPointsLocal = ref(0)
const startLevelLocal = ref(0)
const endLevelLocal = ref(0)

const backTo = () => router.back()

onMounted(async () => {
  loading.value = true
  const fileName = `/verbs-data/${category}-${topicId}.json`
  quizStore.setContext({modeId: category, topicId, fileName, contentVersion: 'v1'})
  await quizStore.restoreOrStart({modeId: category, topicId, fileName, contentVersion: 'v1'})
  await learning.loadFromFirebase?.()
  loading.value = false
})

watch(() => quizStore.quizCompleted, async (done) => {
  if (!done) return

  const curExp = Number(learning.exp || 0)
  const curPoints = Number(learning.points || 0)
  const curLevel = Number(learning.isLeveling || 0)

  const rawTargetExp = curExp + AWARD_EXP
  const levelUps = Math.floor(rawTargetExp / LEVEL_UP_XP)
  const endLevel = curLevel + levelUps
  const endExpMod = rawTargetExp % LEVEL_UP_XP
  startExpLocal.value = curExp
  targetExpLocal.value = endExpMod
  startPointsLocal.value = curPoints
  targetPointsLocal.value = curPoints + AWARD_POINTS
  startLevelLocal.value = curLevel
  endLevelLocal.value = endLevel
  setTimeout(async () => {
    learning.exp = rawTargetExp
    learning.points = targetPointsLocal.value
    learning.handleLeveling?.()
    await learning.saveToFirebase?.()
  }, DELAY_MS)
})
</script>

<style scoped>

.quiz-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--bg);
  font-family: "Nunito", sans-serif;
  overflow: hidden;
}

.quiz-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  gap: 20px;
  background: var(--bg);
  border-bottom: 2px solid #e5e7eb;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  flex-shrink: 0;
  z-index: 10;
}

.btn-icon-back {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-bottom: 4px solid #e5e7eb;
  border-radius: 14px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s;
  flex-shrink: 0;
}

.btn-icon-back:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}

.progress-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
}

.progress-bar {
  flex: 1;
  height: 28px;
  background-color: #e5e7eb;
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.question-counter {
  color: var(--titleColor);
  font-weight: 600;
  font-size: 18px;
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
}

.question-card {
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 30px;
}

.question-text {
  font-size: 1.4rem;
  color: #374151;
  margin: 0;
  line-height: 1.5;
  font-weight: 700;
}

.blank-space {
  display: inline-block;
  min-width: 60px;
  padding: 0 8px;
  color: #9ca3af;
  border-bottom: 2px dashed #d1d5db;
  text-align: center;
  transition: all 0.3s ease;
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
  padding: 16px 24px;
  font-size: 1.3rem;
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

.footer-controls {
  margin-top: auto;
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feedback-message {
  padding: 16px;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 800;
  text-align: center;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.feedback-message.correct {
  background-color: #dcfce7;
  color: #166534;
  border: 2px solid #bbf7d0;
}

.feedback-message.incorrect {
  background-color: #fee2e2;
  color: #991b1b;
  border: 2px solid #fecaca;
}

.action-button {
  width: 100%;
  padding: 18px;
  border-radius: 24px;
  font-size: 1.3rem;
  font-weight: 800;
  text-align: center;
  cursor: pointer;
  transition: transform 0.1s;
}

.action-button.check {
  background: #3b82f6;
  color: #ffffff;
  border: 2px solid #2563eb;
  border-bottom: 6px solid #1d4ed8;
}

.action-button.check:disabled {
  background: #e5e7eb;
  border-color: #d1d5db;
  border-bottom-width: 6px;
  color: #9ca3af;
  cursor: not-allowed;
}

.action-button.next {
  background: #4ade80;
  color: #ffffff;
  border: 2px solid #22c55e;
  border-bottom: 6px solid #16a34a;
}

.action-button:active:not(:disabled) {
  transform: translateY(4px);
  border-bottom-width: 2px;
  margin-bottom: 4px;
}

.finish-screen {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.fail-card {
  max-width: 400px;
  width: 90%;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 28px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  animation: popIn 0.4s ease-out;
}

.fail-emoji {
  font-size: 4rem;
  margin: 0 0 16px 0;
}

.fail-text {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #374151;
}

.fail-sub {
  font-size: 1.1rem;
  margin-bottom: 24px;
  color: #6b7280;
}

.fail-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn.try-again, .btn.back {
  padding: 16px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.1s;
}

.btn.try-again {
  background: #3b82f6;
  color: #ffffff;
  border: 2px solid #2563eb;
  border-bottom: 6px solid #1d4ed8;
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

.btn.try-again:active {
  transform: translateY(4px);
  border-bottom-width: 2px;
  margin-bottom: 4px;
}

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
</style>