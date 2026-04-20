<template>
  <div class="comic-quiz-page">
    <header v-if="!loading && store.activeQuestion" class="quiz-header-comic">
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
        <div class="header-item">{{ store.currentQuestionIndex + 1 }} / {{ store.currentQuestions.length }}</div>
      </div>
    </header>
    <main class="quiz-main-content">
      <div v-if="loading" class="loading">
        <VPreloader/>
      </div>
      <div v-else-if="store.quizCompleted" class="finish-screen">
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
            <p class="fail-text">{{ t('sessionNotSuccessModal.failText')}} {{ store.score }} / {{ store.currentQuestions.length }}.</p>
            <p class="fail-sub">
              {{ t('sessionNotSuccessModal.failSub')}}
            </p>
            <div class="fail-actions">
              <button class="btn back" @click="backTo">{{ t('sessionNotSuccessModal.back')}}</button>
              <button class="btn try-again" @click="retryQuiz">{{ t('sessionNotSuccessModal.again')}}</button>
            </div>
          </div>
        </template>
      </div>
      <div v-else-if="store.activeQuestion" class="quiz-content-comic">
        <div class="question-card-comic">
          <SoundBtn :text="fullSentence"/>
          <p class="question-text-comic">
            <span>{{ store.activeQuestion.question.split('___')[0] }}</span>
            <span class="blank-space" :class="{ 'has-selection': store.selectedOption }">
              {{ store.selectedOption || '( ... )' }}
            </span>
            <span>{{ store.activeQuestion.question.split('___')[1] }}</span>
          </p>
        </div>

        <div class="options-grid-comic">
          <button
              v-for="option in store.activeQuestion.options"
              :key="option"
              @click="store.chooseOption(option)"
              class="option-button-comic"
              :class="{ selected: store.selectedOption === option }"
              :disabled="store.feedback !== null"
          >
            {{ option }}
          </button>
        </div>

        <div class="footer-controls-comic">
          <div v-if="store.feedback" class="feedback-message-comic" :class="store.feedback">
            <span v-if="store.feedback === 'correct'">✨ {{ t('prasens.correct') }}</span>
            <span v-else>❌ {{ t('prasens.wrong') }} <b>{{ store.activeQuestion.answer }}</b></span>
          </div>

          <button
              v-if="store.feedback === null"
              @click="store.checkAnswer()"
              :disabled="!store.selectedOption"
              class="action-button check"
          >
            {{ t('prasens.check') }}
          </button>

          <button
              v-else
              @click="store.nextQuestion()"
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
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useSeoMeta} from '#imports'

import {userlangStore} from '../../store/learningStore.js'
import {useQuizStore} from '../../../store/adjectiveStore.js'
import CelebrationFireworks from '../../src/components/CelebrationFireworks.vue'
import SoundBtn from '../../src/components/soundBtn.vue'
import VPreloader from "~/src/components/V-preloader.vue";

useSeoMeta({robots: 'noindex, nofollow'})

const AWARD_EXP = 5
const AWARD_POINTS = 5
const DELAY_MS = 4000
const LEVEL_UP_XP = 100

const router = useRouter()
const route = useRoute()
const learning = userlangStore()
const store = useQuizStore()
const {t} = useI18n()

const loading = ref(true)
const category = 'prepositions'
const {topicId} = route.params

const progressPercent = computed(() => {
  const total = store.currentQuestions.length
  if (total === 0 ) return 0
  if (store.quizCompleted) return 100
  return ((store.currentQuestionIndex) / total) * 100
})

const isVictory = computed(() => {
  return store.currentQuestions.length === 10 && store.score >= 8
})

const retryQuiz = async () => {
  const fileName = `/adjective/${category}-${topicId}.json`
  await store.startNewQuiz({ modeId: category, topicId, fileName, contentVersion: 'v1' })
}

const fullSentence = computed(() => {
  const quest = store.activeQuestion
  if (!quest) return ''
  const [pre, post = ''] = quest.question.split('___')
  const word = store.selectedOption || ''
  return `${pre}${word}${post}`
})

const startExpLocal = ref(0)
const targetExpLocal = ref(0)
const startPointsLocal = ref(0)
const targetPointsLocal = ref(0)
const startLevelLocal = ref(0)
const endLevelLocal = ref(0)

const backTo = () => router.push(`/prepositions`)

onMounted(async () => {
  loading.value = true
  const fileName = `/prepositions/${category}-${topicId}.json`
  store.setContext({modeId: category, topicId, fileName, contentVersion: 'v1'})
  await store.restoreOrStart({modeId: category, topicId, fileName, contentVersion: 'v1'})
  await learning.loadFromFirebase?.()
  loading.value = false
})

watch(() => store.quizCompleted, async (done) => {
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

.comic-quiz-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--bg);
  font-family: "Nunito", sans-serif;
  overflow: hidden;
}

.quiz-header-comic {
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


.progress-container {
  flex: 1;
  display: flex;
  gap: 6px;
}

.header-item {
  text-align: center;
  font-size: 18px;
  font-weight: 800;
  color: var(--titleColor);
  opacity: 0.7;
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

.quiz-content-comic {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
}

.question-card-comic {
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

.question-text-comic {
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

.options-grid-comic {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

.option-button-comic {
  background: white;
  border: 2px solid #e5e7eb;
  border-bottom: 6px solid #e5e7eb;
  border-radius: 20px;
  padding: 16px 24px;
  font-size: 1.3rem;
  font-weight: 800;
  color: #262626;
  cursor: pointer;
  transition: all 0.1s ease-out;
  min-width: 120px;
  text-align: center;
}

.option-button-comic:active:not(:disabled) {
  transform: translateY(4px);
  border-bottom-width: 2px;
  margin-bottom: 4px;
}

.option-button-comic.selected {
  background: #eff6ff;
  border-color: #60a5fa;
  border-bottom-color: #3b82f6;
  color: #1d4ed8;
}

.option-button-comic:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.footer-controls-comic {
  margin-top: auto;
  padding-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feedback-message-comic {
  padding: 16px;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 800;
  text-align: center;
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.feedback-message-comic.correct {
  background-color: #dcfce7;
  color: #166534;
  border: 2px solid #bbf7d0;
}

.feedback-message-comic.incorrect {
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

/* =========================================
   ЭКРАН ПРОИГРЫША
   ========================================= */
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
  background: var(--bg);
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
  color: var(--titleColor);
}

.fail-sub {
  font-size: 1.1rem;
  margin-bottom: 24px;
  color: var(--titleColor);
  opacity: 0.8;
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

.btn.back {
  background: var(--bg);
  color: var(--titleColor);
  border: 2px solid #e5e7eb;
  border-bottom: 6px solid #d1d5db;
}

.btn.try-again:active, .btn.back:active {
  transform: translateY(4px);
  border-bottom-width: 2px;
  margin-bottom: 4px;
}

@keyframes popIn {
  from { transform: scale(0.9); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

@media (max-width: 767px) {
  .question-text-comic {
    font-size: 1.2rem;
  }
  .option-button-comic {
    font-size: 1.1rem;
    padding: 12px 18px;
  }
}
</style>