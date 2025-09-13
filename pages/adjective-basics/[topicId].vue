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
      <div v-if="loading" class="loading">{{ t('prasens.loading') }}</div>
      <div v-else-if="store.quizCompleted" class="finish-screen">
        <CelebrationFireworks
            v-model="showCelebration"
            ref="celebration"
            :score="store.score"
            :total="store.currentQuestions.length"
            :elapsed="elapsed"
            :pointsStart="prevPoints"
            :expStart="prevExp"
            :levelStart="prevLevel"
            :award="failMode ? 0 : AWARD"
            :levelUpXp="LEVEL_UP_XP"
            :showStats="!failMode"
            :pieces="460"
            :sparkCount="32"
            :burstsCount="28"
            :area-x="[10, 90]"
            :area-y="[15, 75]"
            :title="failMode ? FINISH_UI.tryAgainTitle : FINISH_UI.winTitle"
            :resultLabel="FINISH_UI.result"
            :timeLabel="FINISH_UI.time"
            :pointsLabel="FINISH_UI.points"
            :levelLabel="FINISH_UI.level"
        >
          <div class="actions">
            <button class="btn primary" @click="startQuiz">{{ t('prasens.again') }}</button>
            <button class="btn ghost" @click="backTo">{{ t('prasens.back') }}</button>
          </div>
        </CelebrationFireworks>
      </div>
      <div v-else-if="store.activeQuestion" class="quiz">
        <div class="question">
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
import {ref, onMounted, watch, nextTick} from 'vue'
import {useQuizStore} from '../../store/adjectiveStore.js'
import {userlangStore} from '../../store/learningStore.js'
import {useRoute, useRouter} from 'vue-router'
import CelebrationFireworks from '../../src/components/CelebrationFireworks.vue'
import {useRewardEngine} from '../../src/composables/useRewardEngine.js'

const FINISH_UI = {
  winTitle: 'Поздравляем!',
  tryAgainTitle: 'Ещё чуть-чуть — и получится!',
  result: 'Результат',
  time: 'Время',
  points: 'Артиклюсы',
  level: 'Уровень',
}
const router = useRouter()
const route = useRoute()
const store = useQuizStore()
const learning = userlangStore()
const {t} = useI18n()

const loading = ref(true)
const category = 'adjective-basics'
const {topicId} = route.params

const showCelebration = ref(false)
const celebration = ref(null)
const startedAt = ref(Date.now())
const elapsed = ref('0:00')

const AWARD = 5
const LEVEL_UP_XP = 100
const PASS_RATIO = 0.8

const prevPoints = ref(0)
const prevExp = ref(0)
const prevLevel = ref(1)
const failMode = ref(false)

function fmt(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

async function startQuiz() {
  loading.value = true
  const fileName = `/adjective/${category}-${topicId}.json`
  store.setContext({modeId: category, topicId, fileName, contentVersion: 'v1'})
  await store.startNewQuiz(fileName)
  loading.value = false
  showCelebration.value = false
  startedAt.value = Date.now()
}

const backTo = () => router.push(`/adjective-basics`)

onMounted(async () => {
  loading.value = true
  const fileName = `/adjective/${category}-${topicId}.json`
  store.setContext({modeId: category, topicId, fileName, contentVersion: 'v1'})
  await store.restoreOrStart({modeId: category, topicId, fileName, contentVersion: 'v1'})
  await learning.loadFromFirebase?.()
  startedAt.value = Date.now()
  loading.value = false
})

const {finalize} = useRewardEngine(learning)

watch(() => store.quizCompleted,
    async (done) => {
      if (!done) return
      elapsed.value = fmt(Date.now() - startedAt.value)
      const res = await finalize({
        score: store.score,
        total: store.currentQuestions.length || 10,
        passRatio: PASS_RATIO,
        baseAward: AWARD,
        levelUpXp: LEVEL_UP_XP,
        save: true,
      })
      prevPoints.value = res.pointsStart
      prevExp.value = res.expStart
      prevLevel.value = res.levelStart
      failMode.value = !res.ok
      await nextTick()
      showCelebration.value = true
      celebration.value?.play()
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

.loading {
  font-size: 2rem;
}

.quiz {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  font-family: 'Bangers', cursive;
}

.question {
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
  padding: 0 10px;
}


.finish-card {
  width: 100%;
  max-width: 420px;
  text-align: center;
  background: transparent;
  border: none;
  box-shadow: none;
  color: #fff;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn.primary {
  background: #60a5fa;
  color: #0b1220;
}

.btn.ghost {
  background: #1c2636;
  color: #e5edff;
}

.btn:active {
  transform: translateY(1px);
  box-shadow: 0 4px 0 #0a0f16;
}

@media (max-width: 767px) {
  .quiz-header {
    padding: 10px;
  }

  .question-text {
    font-size: 1.3rem;
  }

  .opt {
    font-size: 1.2rem;
  }
}
</style>
