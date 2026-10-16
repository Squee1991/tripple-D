<template>
  <div class="game-page-layout">
    <VLoginPreloader v-if="isLoadingAd || !isReady"/>
    <template v-else>
      <!-- Кнопка «назад» и прогресс забега — такой же прогресс-бар, как у уровня в V-points -->
      <div class="top-bar">
        <VStopSessionBtn @close="leaveRun"/>
        <div class="custom-progress">
          <div class="progress_exp-bar">
            <div class="progress__bar" :style="{ width: progressPercent + '%' }">
              <div class="glare"></div>
            </div>
          </div>
          <div class="progress-circle">{{ Math.min(wordIndex + 1, words.length) }} / {{ words.length }}</div>
        </div>
      </div>

      <main v-if="!isFinished && currentWord" class="game-content">
        <div class="game-area">
          <VArticleCard
              :word="currentWord"
              :feedback="feedback"
              :streak="streakInRow"
              :card-key="wordIndex"
              :fly-direction="flyDirection"
              :milestone-text="milestoneText"
          />
          <VArticleButtons
              :disabled="isChecking"
              :feedback="feedback"
              :correct-article="currentWord.article"
              :chosen-article="chosenArticle"
              @choose="handleArticleChoice"
          />
        </div>
      </main>

      <!-- Итоги забега -->
      <Transition name="result-pop">
        <div v-if="isFinished" class="result">
          <h2 class="result__title">{{ t('dailyRun.finishTitle') }}</h2>
          <div class="result__score">{{ correctCount }} <span>/ {{ words.length }}</span></div>

          <div class="result__stats">
            <div class="result__stat">
              <span class="result__stat-value">⏱ {{ formattedTime }}</span>
              <span class="result__stat-label">{{ t('dailyRun.timeLabel') }}</span>
            </div>
            <div class="result__stat">
              <span class="result__stat-value">🔥 {{ finalStreak }}</span>
              <span class="result__stat-label">{{ t('dailyRun.streakLabel') }}</span>
            </div>
            <div v-if="reward" class="result__stat">
              <span class="result__stat-value">+{{ reward }}</span>
              <span class="result__stat-label">{{ t('dailyRun.rewardLabel') }}</span>
            </div>
          </div>

          <div class="result__mistakes">
            <div v-if="!mistakes.length" class="result__no-mistakes">{{ t('dailyRun.noMistakes') }}</div>
            <template v-else>
              <div class="result__mistakes-title">{{ t('dailyRun.mistakesTitle') }}</div>
              <ul class="result__mistakes-list">
                <li v-for="mistake in mistakes" :key="mistake.de" class="result__mistake">
                  <span class="result__mistake-article" :class="'is-' + mistake.article">{{ mistake.article }}</span>
                  {{ mistake.de }}
                </li>
              </ul>
            </template>
          </div>

          <p class="result__next">{{ nextRunText }}</p>
          <button class="result__done" @click="goToMarathon">{{ t('dailyRun.done') }}</button>
        </div>
      </Transition>
    </template>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import {useRouter} from 'vue-router'
import {useDailyRunStore} from '~/store/dailyRunStore.js'
import {userAuthStore} from '~/store/authStore.js'
import {userlangStore} from '~/store/learningStore.js'
import {playCorrectRising, playWrong, playLevelCompleted, unlockAudioByUserGesture} from '~/utils/soundManager.js'
import {vibrateSuccess, vibrateError, vibrateImpact} from '~/utils/haptics.js'
import {showInterstitial} from '~/utils/admob.js'
import VStopSessionBtn from '~/src/components/V-stopSessionBtn.vue'
import VLoginPreloader from '~/src/components/V-loginPreloader.vue'
import VArticleCard from '~/src/components/V-articleCard.vue'
import VArticleButtons from '~/src/components/V-articleButtons.vue'

const {t} = useI18n()
const router = useRouter()
const {$track} = useNuxtApp()
const dailyRunStore = useDailyRunStore()
const authStore = userAuthStore()
const langStore = userlangStore()

const CARD_FLY_AFTER_CORRECT_MS = 350
const CARD_FALL_AFTER_MISTAKE_MS = 1200
const STREAK_MILESTONES = [10, 20]
const MILESTONE_VISIBLE_MS = 1300

const isReady = ref(false)
const isLoadingAd = ref(false)
const words = ref([])
const wordIndex = ref(0)
const correctCount = ref(0)
const streakInRow = ref(0)
const mistakes = ref([])
const feedback = ref(null)
const isChecking = ref(false)
const flyDirection = ref('der')
const chosenArticle = ref(null)
const milestoneText = ref('')
const isFinished = ref(false)
const runTimeMs = ref(0)
const finalStreak = ref(0)
const reward = ref(0)
let startedAt = 0
let milestoneTimer = 0
let isStarted = false

const currentWord = computed(() => words.value[wordIndex.value] || null)
const progressPercent = computed(() => words.value.length ? wordIndex.value / words.value.length * 100 : 0)

const formattedTime = computed(() => {
  const totalSeconds = Math.round(runTimeMs.value / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
})

// Сколько осталось до полуночи — тогда откроется новый забег
const nextRunText = computed(() => {
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  const minutesLeft = Math.max(0, Math.ceil((midnight - new Date()) / 60000))
  return t('dailyRun.nextIn', {hours: Math.floor(minutesLeft / 60), minutes: minutesLeft % 60})
})

function showMilestone(text) {
  milestoneText.value = text
  clearTimeout(milestoneTimer)
  milestoneTimer = setTimeout(() => {
    milestoneText.value = ''
  }, MILESTONE_VISIBLE_MS)
}

function handleArticleChoice(article) {
  if (isChecking.value || isFinished.value || !currentWord.value) return
  isChecking.value = true
  chosenArticle.value = article
  const isCorrect = article === currentWord.value.article
  feedback.value = isCorrect ? 'correct' : 'incorrect'

  if (isCorrect) {
    playCorrectRising(streakInRow.value)
    vibrateSuccess()
  } else {
    playWrong()
    vibrateError()
  }
  flyDirection.value = isCorrect ? article : 'drop'

  setTimeout(() => {
    if (isCorrect) {
      correctCount.value += 1
      streakInRow.value += 1
      if (STREAK_MILESTONES.includes(streakInRow.value)) {
        showMilestone('🔥 ' + t('marathonGame.streakMilestone', {count: streakInRow.value}))
        vibrateImpact()
      }
    } else {
      streakInRow.value = 0
      mistakes.value.push(currentWord.value)
    }
    feedback.value = null
    isChecking.value = false
    if (wordIndex.value + 1 >= words.value.length) {
      finishRun()
      return
    }
    wordIndex.value += 1
  }, isCorrect ? CARD_FLY_AFTER_CORRECT_MS : CARD_FALL_AFTER_MISTAKE_MS)
}

// Конец забега: сохраняем результат (одна попытка в день), начисляем награду, отправляем в аналитику
async function finishRun() {
  if (isFinished.value) return
  runTimeMs.value = Date.now() - startedAt
  isFinished.value = true
  wordIndex.value = words.value.length
  playLevelCompleted()

  const saved = await dailyRunStore.saveResult({
    score: correctCount.value,
    total: words.value.length,
    timeMs: runTimeMs.value
  })
  finalStreak.value = saved?.streak ?? dailyRunStore.currentStreak
  reward.value = saved?.reward ?? 0
  if (reward.value > 0) langStore.addPoints(reward.value)

  $track('daily_run_finished', {
    date: dailyRunStore.today,
    score: correctCount.value,
    total: words.value.length,
    time_seconds: Math.round(runTimeMs.value / 1000),
    streak_days: finalStreak.value,
    finished_early: correctCount.value + mistakes.value.length < words.value.length
  })
}

// Вышли посреди забега — попытка засчитывается с тем, что успели набрать
async function leaveRun() {
  if (isStarted && !isFinished.value) {
    await finishRun()
  }
  goToMarathon()
}

function goToMarathon() {
  router.push('/article-marathon')
}

function startRun() {
  words.value = dailyRunStore.buildTodayWords()
  startedAt = Date.now()
  isStarted = true
  $track('daily_run_started', {date: dailyRunStore.today, streak_days: dailyRunStore.currentStreak})
}

onMounted(async () => {
  window.addEventListener('pointerdown', unlockAudioByUserGesture, {once: true, capture: true})
  if (!authStore.uid) {
    goToMarathon()
    return
  }
  await Promise.all([dailyRunStore.loadProfile(), dailyRunStore.loadWords()])
  // Сегодня уже играли — забег один раз в день
  if (dailyRunStore.isPlayedToday || !dailyRunStore.allWords.length) {
    goToMarathon()
    return
  }
  isReady.value = true
  isLoadingAd.value = true
  showInterstitial(() => {
    isLoadingAd.value = false
    startRun()
  })
})

onBeforeUnmount(() => {
  clearTimeout(milestoneTimer)
  // Ушли со страницы другим способом (системная кнопка «назад») — тоже засчитываем попытку
  if (isStarted && !isFinished.value) finishRun()
})
</script>

<style scoped>
.game-page-layout {
  background-color: var(--bg, #fcfcfc);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  font-family: 'Nunito', sans-serif;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.top-bar {
  padding: 5px 15px;
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Прогресс-бар — как у уровня в V-points */
.custom-progress {
  position: relative;
  flex: 1;
}

.progress_exp-bar {
  height: 27px;
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 800;
  color: #313030;
  white-space: nowrap;
  z-index: 2;
}

.game-content {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 16px;
}

.game-area {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  flex: 1;
}

/* Итоги забега */
.result {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 20px calc(24px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
  text-align: center;
}

.result__title {
  margin: 0;
  color: var(--titleColor);
  font-size: 26px;
  font-weight: 900;
}

.result__score {
  color: #ff9500;
  font-size: 64px;
  font-family: 'Lilita One', sans-serif;
  line-height: 1;
}

.result__score span {
  color: var(--titleColor);
  font-size: 32px;
  opacity: 0.6;
}

.result__stats {
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

.result__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 20px;
  background: var(--bgModal, #ffffff);
  border: 3px solid var(--tabsSlideBorderColor);
}

.result__stat-value {
  color: var(--titleColor);
  font-size: 20px;
  font-weight: 900;
}

.result__stat-label {
  color: #8a8f98;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.result__mistakes {
  width: 100%;
}

.result__mistakes-title,
.result__no-mistakes {
  color: var(--titleColor);
  font-size: 16px;
  font-weight: 900;
  margin-bottom: 8px;
}

.result__mistakes-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 180px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.result__mistake {
  padding: 6px 12px;
  border-radius: 12px;
  background: var(--bgModal, #ffffff);
  border: 2px solid var(--tabsSlideBorderColor);
  color: var(--titleColor);
  font-weight: 800;
}

.result__mistake-article.is-der {
  color: #007AFF;
}

.result__mistake-article.is-die {
  color: #FF3B30;
}

.result__mistake-article.is-das {
  color: #34C759;
}

.result__next {
  margin: 4px 0 0;
  color: #8a8f98;
  font-size: 14px;
  font-weight: 800;
}

.result__done {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 20px;
  background: #ff9500;
  box-shadow: 0 6px 0 #c86f00;
  color: #ffffff;
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;
}

.result__done:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #c86f00;
}

.result-pop-enter-active {
  transition: opacity 0.3s, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-pop-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
</style>
