<template>
  <div class="comic-quiz-page">
    <header v-if="!loading && quizStore.activeQuestion" class="quiz-header-comic">
      <button class="btn__back" @click="backTo">{{ t('prasens.back')}}</button>
      <div>
        <div class="header-item">
          {{ t('prasens.questionNumber')}} {{ quizStore.currentQuestionIndex + 1 }} / {{ quizStore.currentQuestions.length }}
        </div>
        <div class="header-item score">
          {{ t('prasens.score')}} {{ quizStore.score }}
        </div>
      </div>
    </header>
    <main class="quiz-main-content">
      <div v-if="loading" class="fullscreen-state">
        <p>{{ t('prasens.loading')}}</p>
      </div>
      <div v-else-if="quizStore.quizCompleted" class="finish-screen">
        <CelebrationFireworks
            v-model="showCelebration"
            ref="celebration"
            :score="quizStore.score"
            :total="quizStore.currentQuestions.length"
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
      <div v-else-if="quizStore.activeQuestion" class="quiz-content-comic">
        <div class="question-card-comic">
          <SoundBtn :text="fullSentence"/>
          <p class="question-text-comic">
            <span>{{ quizStore.activeQuestion.question.split('___')[0] }}</span>
            <span class="blank-space">{{ quizStore.selectedOption || '( ... )' }}</span>
            <span>{{ quizStore.activeQuestion.question.split('___')[1] }}</span>
          </p>
        </div>
        <div class="options-grid-comic">
          <button
              v-for="option in quizStore.activeQuestion.options"
              :key="option"
              @click="quizStore.chooseOption(option)"
              class="option-button-comic"
              :class="{ selected: quizStore.selectedOption === option }"
              :disabled="quizStore.feedback !== null"
          >
            {{ option }}
          </button>
        </div>
        <div class="footer-controls-comic">
          <div v-if="quizStore.feedback" class="feedback-message-comic" :class="quizStore.feedback">
            <span v-if="quizStore.feedback === 'correct'">{{ t('prasens.correct')}}</span>
            <span v-else>{{ t('prasens.wrong')}} {{ quizStore.activeQuestion.answer }}</span>
          </div>
          <button
              v-if="quizStore.feedback === null"
              @click="quizStore.checkAnswer()"
              :disabled="!quizStore.selectedOption"
              class="action-button check"
          >
            {{ t('prasens.check')}}
          </button>
          <button
              v-else
              @click="quizStore.nextQuestion()"
              class="action-button next"
          >
            {{ t('prasens.further')}}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>

import {ref, onMounted, watch, nextTick,} from 'vue';
import {useQuizStore} from '../../store/adjectiveStore.js';
import { useRouter , useRoute} from 'vue-router'
import {userlangStore} from '../../store/learningStore.js'
import CelebrationFireworks from '../../src/components/CelebrationFireworks.vue'
import { useRewardEngine } from '../../composables/useRewardEngine.js'
import SoundBtn from '../../src/components/soundBtn.vue'
import { useSeoMeta } from '#imports'
useSeoMeta({ robots: 'noindex, nofollow' })

const FINISH_UI = {
  winTitle: 'Поздравляем!',
  tryAgainTitle: 'Ещё чуть-чуть — и получится!',
  result: 'Результат',
  time: 'Время',
  points: 'Артиклюсы',
  level: 'Уровень',
}

const router = useRouter()
const route = useRoute();
const learning = userlangStore()
const quizStore = useQuizStore();
const loading = ref(true);
const { t } = useI18n()
const category = 'modal-verbs';
const { topicId } = route.params;

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

const fullSentence = computed(() => {
  const quest = quizStore.activeQuestion
  if (!quest) return ''
  const [pre , post = ''] = quest.question.split('___')
  const word = quizStore.selectedOption || ''
  return `${pre}${word}${post}`
})

async function startQuiz() {
  loading.value = true
  const fileName = `/verbs-data/${category}-${topicId}.json`
  quizStore.setContext({modeId: category, topicId, fileName, contentVersion: 'v1'})
  await quizStore.startNewQuiz(fileName)
  loading.value = false
  showCelebration.value = false
  startedAt.value = Date.now()
}


const backTo = () => {
  router.back()
}

onMounted(async () => {
  loading.value = true
  const fileName = `/verbs-data/${category}-${topicId}.json`
  quizStore.setContext({modeId: category, topicId, fileName, contentVersion: 'v1'})
  await quizStore.restoreOrStart({modeId: category, topicId, fileName, contentVersion: 'v1'})
  await learning.loadFromFirebase?.()
  startedAt.value = Date.now()
  loading.value = false
})

const {finalize} = useRewardEngine(learning)

watch(() => quizStore.quizCompleted,
    async (done) => {
      if (!done) return
      elapsed.value = fmt(Date.now() - startedAt.value)
      const res = await finalize({
        score: quizStore.score,
        total: quizStore.currentQuestions.length || 10,
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

.btn__back {
  border: 3px solid #1e1e1e;
  padding: 15px;
  background: #f1c40f;
  border-radius: 16px;
  cursor: pointer;
  color: #1e1e1e;
  font-weight: 600;
  font-size: 1.2rem;
  font-family: "Nunito", sans-serif;
  box-shadow: 4px 4px 0px #1e1e1e;
  transition: all 0.1s ease-in-out;
}

.btn__back:hover {
  box-shadow: 2px 2px 0px #1e1e1e;
}

.comic-quiz-page {
  background-color: #f0e8d9;
  font-family: "Nunito", sans-serif;
  letter-spacing: 1.5px;
  min-height: 100vh;
  padding-top: 100px;
}

.quiz-header-comic {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #ffd166;
  color: #000;
  font-size: 1.8rem;
  border-bottom: 3px solid #000;
  box-shadow: 0 4px 0 #000;

}

.quiz-main-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1.5rem;
  box-sizing: border-box;
}

.fullscreen-state {
  font-size: 4rem;
  color: #333;
  text-align: center;
}

.quiz-content-comic {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 15px;
}

.question-card-comic,
.option-button-comic,
.action-button,
.quiz-summary-comic {
  border: 3px solid #000;
  border-radius: 12px;
  box-shadow: 6px 6px 0px #000;
  transition: all 0.1s ease-in-out;
}


.option-button-comic:hover,
.action-button:hover,
.quiz-summary-comic:hover {
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0px #000;
}

.question-card-comic {
  background: #fff;
  padding: 2rem;
  transform: rotate(.7deg);
}

.question-text-comic {
  font-size: 2.5rem;
  text-align: center;
  color: #000;
}

.blank-space {
  color: #0077b6;
  text-decoration: underline;
}

.options-grid-comic {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 15px;
  flex-wrap: wrap;
}

.option-button-comic {
  background-color: #fff;
  color: #000;
  padding: 1rem;
  font-size: 1.8rem;
  cursor: pointer;
  transform: rotate(-1.5deg);
}

.option-button-comic:nth-child(2n) {
  transform: rotate(1.5deg);
}

.option-button-comic.selected {
  background-color: #06d6a0;
  color: #000;
}

.option-button-comic:disabled {
  opacity: 0.7;
  background-color: #e9ecef;
}

.footer-controls-comic {
  min-height: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
}

.feedback-message-comic {
  font-size: 2rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 3px solid black;
  margin-bottom: 10px;
}

.feedback-message-comic.correct {
  background-color: #06d6a0;
  transform: rotate(2deg);
}

.feedback-message-comic.incorrect {
  background-color: #ef476f;
  transform: rotate(-2deg);
}

.action-button {
  width: 100%;
  max-width: 450px;
  padding: 1rem;
  font-size: 2rem;
  cursor: pointer;
}

.action-button.check {
  background-color: #0077b6;
  color: white;
}

.action-button.check:disabled {
  background-color: #adb5bd;
  color: #495057;
  box-shadow: none;
  transform: none;
}

.action-button.next {
  background-color: #60a5fa;
  color: black;
}

.quiz-summary-comic {
  background: #fff;
  padding: 3rem;
  text-align: center;
}

.quiz-summary-comic h2 {
  font-size: 4rem;
}

.quiz-summary-comic p {
  font-size: 2rem;
  margin: 1rem 0 2rem;
}
.btn {
  padding: 14px 16px;
  border-radius: 12px;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
  cursor: pointer;
  font-weight: 800;
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

@media (max-width: 767px) {
  .quiz-header-comic {
    gap: 10px;
    padding: 10px;
  }
  .header-item {
    font-size: 18px;
  }
  .btn__back {
    padding: 10px;
    font-size: 1rem;
  }
  .question-text-comic {
    font-size: 1.3rem;
  }
  .option-button-comic {
    font-size: 1.3rem;
  }
  .action-button {
    font-size: 1.4rem;
    font-family: "Nunito", sans-serif;
    font-weight: 600;
  }
  .quiz-main-content {
    padding: 5px;
  }
  .question-card-comic {
    padding: 1rem;
  }
}

</style>