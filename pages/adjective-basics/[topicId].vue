<template>
  <div class="page">
    <header v-if="!loading && store.activeQuestion && !store.quizCompleted" class="quiz-header">
      <button class="btn-back" @click="backTo">{{ t('prasens.back') }}</button>
      <div class="header-right">
        <div class="header-item">
          {{ t('prasens.questionNumber') }} {{ store.currentQuestionIndex + 1 }} / {{ store.currentQuestions.length }}
        </div>
        <div class="header-item">{{ t('prasens.score') }} {{ store.score }}</div>
      </div>
    </header>
    <main class="main">
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
            <p class="fail-emoji">🌱✨</p>
            <p class="fail-text">Правильных {{ store.score }} из {{ store.currentQuestions.length }}.</p>
            <p class="fail-sub">Для получения награды нужно минимум восемь правильных ответов<br>Попробуй ещё раз — у тебя получится!</p>
            <div class="fail-actions">
              <button class="btn try-again" @click="retryQuiz">Попробовать снова</button>
              <button class="btn back" @click="backTo">Назад</button>
            </div>
          </div>
        </template>
      </div>
      <div v-else-if="store.activeQuestion" class="quiz">
        <div class="question">
          <SoundBtn :text="fullSentence" />
          <p class="question-text">
            <span>{{ store.activeQuestion.question.split('___')[0] }}</span>
            <span class="blank">{{ store.selectedOption || '( ... )' }}</span>
            <span>{{ store.activeQuestion.question.split('___')[1] }}</span>
          </p>
        </div>
        <div class="options">
          <button
              v-for="option in store.activeQuestion.options"
              :key="option"
              @click="store.chooseOption(option)"
              class="opt"
              :class="{ selected: store.selectedOption === option }"
              :disabled="store.feedback !== null"
          >
            {{ option }}
          </button>
        </div>
        <div class="controls">
          <div v-if="store.feedback" class="fb" :class="store.feedback">
            <span v-if="store.feedback === 'correct'">{{ t('prasens.correct') }}</span>
            <span v-else>{{ t('prasens.wrong') }} {{ store.activeQuestion.answer }}</span>
          </div>
          <button
              v-if="store.feedback === null"
              class="btn check"
              @click="store.checkAnswer()"
              :disabled="!store.selectedOption"
          >
            {{ t('prasens.check') }}
          </button>
          <button v-else class="btn next" @click="store.nextQuestion()">
            {{ t('prasens.further') }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import VPreloader from "../../src/components/V-preloader.vue";
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSeoMeta } from '#imports'
import { useQuizStore } from '../../store/adjectiveStore.js'
import { userlangStore } from '../../store/learningStore.js'
import CelebrationFireworks from '../../src/components/CelebrationFireworks.vue'
import SoundBtn from '../../src/components/soundBtn.vue'
useSeoMeta({ robots: 'noindex, nofollow' })
const AWARD_EXP = 5
const AWARD_POINTS = 5
const DELAY_MS = 4000
const LEVEL_UP_XP = 100

const router = useRouter()
const route = useRoute()
const store = useQuizStore()
const learning = userlangStore()
const { t } = useI18n()

const loading = ref(true)
const category = 'adjective-basics'
const { topicId } = route.params

const isVictory = computed(() => {
  return store.currentQuestions.length === 10 && store.score >= 8
})

const retryQuiz = async () => {
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
const startExpLocal = ref(0)
const targetExpLocal = ref(0)
const startPointsLocal = ref(0)
const targetPointsLocal = ref(0)
const startLevelLocal = ref(0)
const endLevelLocal = ref(0)

const backTo = () => router.push(`/adjective-basics`)

onMounted(async () => {
  loading.value = true
  const fileName = `/adjective/${category}-${topicId}.json`
  store.setContext({ modeId: category, topicId, fileName, contentVersion: 'v1' })
  await store.restoreOrStart({ modeId: category, topicId, fileName, contentVersion: 'v1' })
  await learning.loadFromFirebase?.()
  setTimeout(() => {
    loading.value = false
  } , 2800)
})

watch(() => store.quizCompleted, async (done) => {
  if (!done) return
  const curExp    = Number(learning.exp || 0)
  const curPoints = Number(learning.points || 0)
  const curLevel  = Number(learning.isLeveling || 0)
  const rawTargetExp = curExp + AWARD_EXP
  const levelUps     = Math.floor(rawTargetExp / LEVEL_UP_XP)
  const endLevel     = curLevel + levelUps
  const endExpMod    = rawTargetExp % LEVEL_UP_XP
  startExpLocal.value     = curExp
  targetExpLocal.value    = endExpMod
  startPointsLocal.value  = curPoints
  targetPointsLocal.value = curPoints + AWARD_POINTS
  startLevelLocal.value   = curLevel
  endLevelLocal.value     = endLevel
  setTimeout(async () => {
    learning.exp    = rawTargetExp
    learning.points = targetPointsLocal.value
    learning.handleLeveling?.()
    await learning.saveToFirebase?.()
  }, DELAY_MS)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
}

.quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #ffd166;
  border-bottom: 3px solid #000;
  box-shadow: 0 4px 0 #000;
  font-family: 'Bangers', cursive;
  letter-spacing: 1.5px;
}

.btn-back {
  border: 3px solid #1e1e1e;
  padding: 12px 16px;
  background: #f1c40f;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 700;
}

.main {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.quiz {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  font-family: "Nunito", sans-serif;
}

.question {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 6px 6px 0 #000;
  transform: rotate(.7deg);
}

.question-text {
  font-size: 1.6rem;
  color: #000;
  text-align: center;
  margin-left: 8px;
}

.blank {
  color: #0077b6;
  text-decoration: underline;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.opt {
  background: #fff;
  color: #000;
  padding: 12px 16px;
  border: 3px solid #000;
  border-radius: 12px;
  box-shadow: 6px 6px 0 #000;
  font-size: 1.4rem;
  cursor: pointer;
  transform: rotate(-1.2deg);
}

.opt:nth-child(2n) {
  transform: rotate(1.2deg);
}

.opt.selected {
  background: #06d6a0;
}

.controls {
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.fb {
  font-size: 1.6rem;
  padding: 8px 12px;
  border: 3px solid #000;
  border-radius: 10px;
}

.fb.correct {
  background: #06d6a0;
  transform: rotate(2deg);
}

.fb.incorrect {
  background: #ef476f;
  transform: rotate(-2deg);
}

.btn {
  padding: 14px 16px;
  border-radius: 12px;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  cursor: pointer;
  font-weight: 800;
}

.btn.check {
  background: #0077b6;
  color: #fff;
}

.btn.next {
  background: #60a5fa;
  color: #000;
}

.finish-screen {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  width: 100%;
}

.fail-card {
  max-width: 600px;
  width: 90%;
  background: #e0f7fa;
  border: 4px solid #000;
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 5px 5px 0 #000;
  transform: rotate(-1deg);
  font-family: "Nunito", sans-serif;
  animation: popIn 0.5s ease-out;
}

.fail-emoji {
  font-size: 3rem;
  margin-bottom: 10px;
}

.fail-text {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #0077b6;
}

.fail-sub {
  font-size: 1.2rem;
  margin-bottom: 24px;
  color: #333;
  line-height: 1.5;
}

.fail-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.btn.try-again {
  background: #06d6a0;
  color: #fff;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 12px 18px;
  box-shadow: 6px 6px 0 #000;
  font-weight: 800;
  transform: rotate(-1deg);
  cursor: pointer;
  transition: background 0.2s;
}

.btn.try-again:hover {
  background: #1de9b6;
}

.btn.back {
  background: #ffd166;
  color: #000;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 12px 18px;
  box-shadow: 6px 6px 0 #000;
  font-weight: 800;
  transform: rotate(1deg);
  cursor: pointer;
  transition: background 0.2s;
}

.btn.back:hover {
  background: #ffe29a;
}

@keyframes popIn {
  from { transform: scale(0.8) rotate(-4deg); opacity: 0; }
  to   { transform: scale(1) rotate(-1deg); opacity: 1; }
}

@media (max-width: 767px) {
  .quiz-header {
    padding: 10px
  }
  .question-text {
    font-size: 1.3rem
  }
  .opt {
    font-size: 1.2rem
  }
}
</style>
