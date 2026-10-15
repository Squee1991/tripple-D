<template>
  <div class="game-page-layout">
    <VLoginPreloader v-if="isLoadingAd"/>
    <template v-else-if="!isLoadingAd">
      <div class="top-bar">
        <VStopSessionBtn @close="backTo"/>
        <div class="lives-bar">
          <div class="hearts-container">
            <span v-for="life in 5" :key="life" class="heart" :class="{ 'lost': life > gameStore.lives }">❤️</span>
          </div>
        </div>
      </div>
      <div v-if="!gameStore.gameReady" class="not-ready-container">
        <div class="bouncy-loader">
          <span></span><span></span><span></span>
        </div>
        <h1>{{ t('marathonGame.notReadyTitle') }}</h1>
        <p>{{ t('marathonGame.reboot') }}</p>
      </div>
      <template v-else>
        <header class="game-header">
          <div class="stats-bar">
            <div class="stat-widget streak">
              <div class="widget-label">{{ t('marathonGame.streak') }}</div>
              <div class="widget-value">{{ gameStore.sessionStreak }}</div>
            </div>
            <div class="stat-widget record">
              <div class="widget-label">{{ t('marathonGame.record') }}</div>
              <div class="widget-value">{{ currentDifficultyRecord }}</div>
            </div>
          </div>
          <!-- Таймер: полоска сжимается и краснеет к концу -->
          <div v-if="gameStore.levelSettings.timer" class="timer-bar" :class="{ 'is-danger': isTimerDanger }">
            <div :key="answerCount" class="timer-bar__fill" :style="{ width: timerPercent + '%' }"></div>
          </div>
        </header>
        <main class="game-content">
          <div v-if="gameStore.currentWord" class="game-area">
            <VArticleCard
                :word="gameStore.currentWord"
                :feedback="feedback"
                :streak="gameStore.sessionStreak"
                :card-key="answerCount"
                :fly-direction="flyDirection"
                :milestone-text="milestoneText"
            >
              <template #above>
                <div v-if="stepsToRecord" class="record-chase">🏆 {{ t('marathonGame.toRecord', {count: stepsToRecord}) }}</div>
              </template>
            </VArticleCard>
            <VArticleButtons
                :disabled="isChecking || !gameStore.gameActive"
                :feedback="feedback"
                :correct-article="gameStore.currentWord.article"
                :chosen-article="chosenArticleRef"
                @choose="handleArticleChoice"
            />
          </div>
        </main>
        <div v-if="inGameConfetti.length" class="ingame-confetti">
          <div
              v-for="piece in inGameConfetti"
              :key="piece.id"
              class="confetti-piece"
              :style="{
                left: piece.left + '%',
                backgroundColor: piece.color,
                animationDelay: piece.delay + 's',
                animationDuration: piece.duration + 's',
                width: piece.width + 'px',
                height: piece.height + 'px'
              }"
          ></div>
        </div>
        <Transition name="fade-scale">
          <div v-if="shouldShowGameOverModal" class="fullscreen-modal">
            <div class="confetti-container" v-if="confettiParticles.length > 0">
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
              <div class="step-fade-in">
                <h2 class="fs-title">{{ t('marathonGame.end') }}</h2>
                <p class="fs-text">{{ t('marathonGame.urStreak') }}</p>
                <div class="streak-number bounce-in">{{ gameStore.lastCompletedStreak }}</div>
              </div>
              <div class="step-fade-in">
                <img :src="isNewRecord ? Great : Support" class="status-img bounce-in" alt="Status icon"/>
              </div>
              <div class="step-fade-in full-width-block actions-spacing">
                <div class="fs-actions">
                  <button @click="handleRetry" class="ios-btn-primary fs-action-btn">
                    {{ t('marathonGame.tryAgain') }}
                  </button>
                  <button @click="goBackToPrepare" class="ios-btn-secondary fs-link-btn">
                    {{ t('marathonGame.back') }}
                  </button>
                  <button @click="toMain" class="ios-btn-text">
                    {{ t('eventSessionPage.leave') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </template>
    </template>
    <VStreakModal
        v-model="showStreakModal"
        :streak="authStore.streakCount"
        @close="handleStreakClosed"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useGameStore} from '../store/marafonStore.js'
import {userlangStore} from '~/store/learningStore.js'
import {userAuthStore} from '~/store/authStore.js'
import {dailyStore} from '~/store/dailyStore.js'
import {playCorrectRising, playWrong, playLevelCompleted, unlockAudioByUserGesture} from '../utils/soundManager.js'
import {vibrateSuccess, vibrateError, vibrateImpact} from '~/utils/haptics.js'
import VStopSessionBtn from "~/src/components/V-stopSessionBtn.vue"
import VArticleCard from "~/src/components/V-articleCard.vue"
import VArticleButtons from "~/src/components/V-articleButtons.vue"
import VLoginPreloader from "~/src/components/V-loginPreloader.vue"
import VStreakModal from '~/src/components/V-streak.vue'
import {showInterstitial} from '../utils/admob.js'

import Support from '~/assets/images/Support.svg'
import Great from '~/assets/images/Greatcon.svg'

const {t} = useI18n()
const gameStore = useGameStore()
const langStore = userlangStore()
const authStore = userAuthStore()
const daily = dailyStore()
const router = useRouter()

const feedback = ref(null)
const isChecking = ref(false)
const isLoadingAd = ref(false)

const showGameOverModal = ref(false)
const showStreakModal = ref(false)
const isWaitingForStreakClose = ref(false)
const initialStreak = ref(authStore.streakCount || 0)
const streakWasIncremented = ref(false)

const finalStreak = ref(0)
const confettiParticles = ref([])

const confettiColors = ['#ffb100', '#c982ff', '#4caf50', '#00c2ff', '#ff5252', '#ffffff']

function spawnConfetti() {
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

watch(() => gameStore.sessionStreak, (val) => {
  if (val > 0) {
    finalStreak.value = val
  }
}, {immediate: true})

watch(() => gameStore.gameActive, (isActive) => {
  if (isActive) {
    finalStreak.value = 0
    confettiParticles.value = []
  }
})

watch(() => authStore.streakCount, (newVal) => {
  if (newVal > initialStreak.value) {
    streakWasIncremented.value = true
  }
})

const currentDifficultyRecord = computed(() => {
  if (gameStore.allTimeBests && gameStore.difficulty) {
    return gameStore.allTimeBests[gameStore.difficulty] || 0;
  }
  return 0;
});

const isNewRecord = computed(() => {
  return gameStore.lastCompletedStreak > 0 && gameStore.lastCompletedStreak >= currentDifficultyRecord.value;
});

const coinsEarned = computed(() => {
  return Math.floor(finalStreak.value / 5)
})

const shouldShowGameOverModal = computed(() => {
  return showGameOverModal.value && !showStreakModal.value && !isWaitingForStreakClose.value
})

const backTo = () => {
  router.back()
}


// --- Оживление игры: карточка, огонь серии, таймер-полоска, погоня за рекордом ---
const STREAK_MILESTONES = [10, 25, 50, 75, 100]
const CARD_FLY_AFTER_CORRECT_MS = 350
const CARD_FALL_AFTER_MISTAKE_MS = 1200
const MILESTONE_VISIBLE_MS = 1300
const RECORD_CHASE_FROM_STEPS = 5

// Номер карточки: меняется — старая карточка улетает, новая выезжает сверху
const answerCount = ref(0)
// Куда улетает карточка: der / die / das — к кнопке артикля, drop — падает вниз после ошибки
const flyDirection = ref('der')
const milestoneText = ref('')
let milestoneTimer = 0
// Рекорд на начало забега — чтобы считать, сколько осталось до него
const recordAtStart = ref(0)
const isRecordBeatenThisRun = ref(false)
const inGameConfetti = ref([])
let inGameConfettiTimer = 0
let isAnswerFromButton = false
// Какой артикль игрок выбрал в этом ответе — чтобы после ошибки притушить его кнопку
const chosenArticleRef = ref(null)

const stepsToRecord = computed(() => {
  if (!recordAtStart.value || isRecordBeatenThisRun.value) return 0
  const stepsLeft = recordAtStart.value + 1 - gameStore.sessionStreak
  return stepsLeft > 0 && stepsLeft <= RECORD_CHASE_FROM_STEPS ? stepsLeft : 0
})

const timerPercent = computed(() => {
  const timeLimit = gameStore.levelSettings.timer
  return timeLimit ? Math.max(0, gameStore.timer / timeLimit * 100) : 0
})
const isTimerDanger = computed(() => !!gameStore.levelSettings.timer && gameStore.timer <= 3)

function showMilestone(text) {
  milestoneText.value = text
  clearTimeout(milestoneTimer)
  milestoneTimer = setTimeout(() => {
    milestoneText.value = ''
  }, MILESTONE_VISIBLE_MS)
}

function spawnInGameConfetti() {
  inGameConfetti.value = Array.from({length: 30}, (_, index) => ({
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 0.4,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    duration: 1.6 + Math.random() * 1.2,
    width: 6 + Math.random() * 6,
    height: 10 + Math.random() * 10
  }))
  clearTimeout(inGameConfettiTimer)
  inGameConfettiTimer = setTimeout(() => {
    inGameConfetti.value = []
  }, 3200)
}

// После правильного ответа: побит рекорд или достигнута ступень серии
function celebrateStreak() {
  const streak = gameStore.sessionStreak
  if (recordAtStart.value > 0 && !isRecordBeatenThisRun.value && streak > recordAtStart.value) {
    isRecordBeatenThisRun.value = true
    showMilestone('🏆 ' + t('marathonGame.newRecord'))
    spawnInGameConfetti()
    vibrateImpact()
    return
  }
  if (STREAK_MILESTONES.includes(streak)) {
    showMilestone('🔥 ' + t('marathonGame.streakMilestone', {count: streak}))
    vibrateImpact()
  }
}

function handleArticleChoice(chosenArticle) {
  if (isChecking.value || !gameStore.gameActive) return
  isChecking.value = true
  // Ответ дан — таймер останавливаем, иначе он может засчитать ошибку, пока показываем реакцию
  gameStore.stopTimer()
  const isCorrect = chosenArticle === gameStore.currentWord.article
  feedback.value = isCorrect ? 'correct' : 'incorrect'
  if (isCorrect) {
    playCorrectRising(gameStore.sessionStreak)
    vibrateSuccess()
  } else {
    playWrong()
    vibrateError()
  }
  flyDirection.value = isCorrect ? chosenArticle : 'drop'
  chosenArticleRef.value = chosenArticle
  setTimeout(() => {
    isAnswerFromButton = true
    answerCount.value += 1
    gameStore.submitAnswer(isCorrect)
    feedback.value = null
    isChecking.value = false
    if (isCorrect) celebrateStreak()
  }, isCorrect ? CARD_FLY_AFTER_CORRECT_MS : CARD_FALL_AFTER_MISTAKE_MS)
}

// Слово сменилось само (время вышло) — карточка падает, телефон вибрирует
watch(() => gameStore.currentWord, () => {
  if (isAnswerFromButton) {
    isAnswerFromButton = false
    return
  }
  flyDirection.value = 'drop'
  answerCount.value += 1
})

watch(() => gameStore.lives, (livesNow, livesBefore) => {
  if (livesNow < livesBefore && !isChecking.value) vibrateError()
})

// Начало забега — запоминаем рекорд, к которому будем подбираться
watch(() => gameStore.gameActive, (isActive) => {
  if (!isActive) return
  recordAtStart.value = currentDifficultyRecord.value
  isRecordBeatenThisRun.value = false
  milestoneText.value = ''
})

function handleStreakClosed() {
  showStreakModal.value = false
  isWaitingForStreakClose.value = false
  showGameOverModal.value = true
  if (isNewRecord.value) {
    spawnConfetti()
  }
  playLevelCompleted()
}

function handleRetry() {
  showGameOverModal.value = false
  confettiParticles.value = []
  gameStore.retryGame()
}

function goBackToPrepare() {
  showGameOverModal.value = false
  confettiParticles.value = []
  router.push('/article-marathon')
}

function toMain() {
  showGameOverModal.value = false
  confettiParticles.value = []
  router.push('/article-marathon')
}

watch(() => gameStore.gameActive, (isActive) => {
  if (!isActive && gameStore.gameReady) {
    if (coinsEarned.value > 0 && typeof langStore.addPoints === 'function') {
      langStore.addPoints(coinsEarned.value)
    }

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
        showGameOverModal.value = true
        if (isNewRecord.value) {
          spawnConfetti()
        }
        playLevelCompleted()
      }
    }, 500)
  } else if (isActive) {
    showGameOverModal.value = false
    showStreakModal.value = false
    isWaitingForStreakClose.value = false
    confettiParticles.value = []
    initialStreak.value = authStore.streakCount || 0
    streakWasIncremented.value = false
  }
})

watch(() => gameStore.gameReady, (isReady) => {
  if (!isReady) {
    setTimeout(() => {
      router.push('/article-marathon')
    }, 1500)
  }
}, {immediate: true})

let unlockOnce = null

onMounted(() => {
  const captureOpts = {capture: true}
  unlockOnce = () => {
    unlockAudioByUserGesture()
    window.removeEventListener('pointerdown', unlockOnce, captureOpts)
    window.removeEventListener('keydown', unlockOnce, captureOpts)
  }
  window.addEventListener('pointerdown', unlockOnce, captureOpts)
  window.addEventListener('keydown', unlockOnce, captureOpts)

  if (gameStore.gameReady && !gameStore.gameActive) {
    isLoadingAd.value = true
    showInterstitial(() => {
      isLoadingAd.value = false
      gameStore.startNewRound()
    })
  }
})

onUnmounted(() => {
  clearTimeout(milestoneTimer)
  clearTimeout(inGameConfettiTimer)
  if (unlockOnce) {
    window.removeEventListener('pointerdown', unlockOnce, {capture: true})
    window.removeEventListener('keydown', unlockOnce, {capture: true})
  }
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
  color: #1e1e1e;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.top-bar {
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 20;
}

.lives-bar {
  padding: 4px 12px;
  display: flex;
  align-items: center;
}

.hearts-container {
  display: flex;
  gap: 4px;
  font-size: 28px;
  line-height: 1;
}

.heart {
  transition: filter 0.3s ease;
}

.heart.lost {
  filter: grayscale(1);
}

.game-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.stats-bar {
  display: flex;
  gap: 10px;
  width: 100%;
}

.stat-widget {
  flex: 1;
  background: #ffffff;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 26px;
  padding: 6px 12px;
  text-align: center;
  box-shadow: 0 14px 0 var(--boxShadowMobile);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.widget-label {
  font-size: 16px;
  font-weight: 800;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.widget-value {
  font-size: 36px;
  color: #888484;
  line-height: 1;
  font-family: 'Lilita One', sans-serif;
}

.stat-widget.record .widget-value {
  color: #f59e0b;
}

.stat-widget.timer {
  background-color: #fef2f2;
  border-color: #ef4444;
  box-shadow: 0 4px 0 #ef4444;
}

.stat-widget.timer .widget-label {
  color: #b91c1c;
}

.stat-widget.timer .widget-value {
  color: #ef4444;
}

.game-content {

  display: flex;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
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

/* «До рекорда: 3» */
.record-chase {
  padding: 4px 14px;
  border-radius: 999px;
  background: #fff4d6;
  color: #b7791f;
  font-size: 15px;
  font-weight: 900;
  animation: chasePulse 1s ease-in-out infinite;
}

@keyframes chasePulse {
  50% {
    transform: scale(1.06);
  }
}

/* Таймер-полоска */
.timer-bar {
  width: 100%;
  height: 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.timer-bar__fill {
  height: 100%;
  border-radius: 999px;
  background: #34C759;
  transition: width 1s linear, background 0.3s;
}

.timer-bar.is-danger .timer-bar__fill {
  background: #FF3B30;
}

.timer-bar.is-danger {
  animation: timerPulse 0.5s ease-in-out infinite;
}

@keyframes timerPulse {
  50% {
    transform: scaleY(1.4);
  }
}

/* Салют при новом рекорде во время игры */
.ingame-confetti {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 50;
}

/* Полноэкранная модалка */
.fullscreen-modal {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: var(--bgModal, #1a1c29);
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
}

.fs-title {
  font-size: 32px;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 6px;
}

.fs-text {
  font-size: 19px;
  font-weight: 600;
  color: #a0a5b5;
  margin-bottom: 6px;
}

.streak-number {
  font-size: 64px;
  font-weight: 900;
  color: #34C759;
  line-height: 1;
  margin-bottom: 16px;
}

.status-img {
  width: 140px;
  height: 140px;
  margin-bottom: 12px;
  object-fit: contain;
}

.record-badge {
  background: #fef08a;
  color: #ca8a04;
  font-weight: 900;
  padding: 8px 18px;
  border-radius: 20px;
  border: 2px solid #ca8a04;
  display: inline-block;
  margin-bottom: 16px;
  font-size: 16px;
}

.fs-best-score {
  font-size: 16px;
  font-weight: 800;
  color: #8e8e93;
  margin: 0 0 16px 0;
}

.reward-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 177, 0, 0.15);
  border: 2px solid #ffb100;
  padding: 8px 24px;
  border-radius: 20px;
  margin-bottom: 12px;
  font-weight: 900;
  font-size: 24px;
  color: #d67a00;
}

.reward-icon {
  font-size: 26px;
}

.fs-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  background: #2c2f42;
  color: #ffffff;
  box-shadow: 0 6px 0 #1b1d2a;
  padding: 16px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 800;
  width: 100%;
  border: none;
  cursor: pointer;
}

.ios-btn-secondary:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #1b1d2a;
}

.ios-btn-text {
  background: none;
  border: none;
  color: #8e8e93;
  font-size: 16px;
  font-weight: 700;
  padding: 8px;
  cursor: pointer;
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

.not-ready-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.not-ready-container h1 {
  font-size: 24px;
  font-weight: 900;
  color: #1e1e1e;
  margin: 16px 0 8px;
}

.not-ready-container p {
  font-size: 16px;
  font-weight: 700;
  color: #6b7280;
  margin: 0;
}

.bouncy-loader {
  display: flex;
  gap: 8px;
}

.bouncy-loader span {
  width: 16px;
  height: 16px;
  background: #6358ac;
  border-radius: 50%;
  animation: bounce 0.5s alternate infinite cubic-bezier(0.6, 0.05, 0.15, 0.95);
}

.bouncy-loader span:nth-child(2) {
  animation-delay: 0.1s;
}

.bouncy-loader span:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-15px);
  }
}
</style>