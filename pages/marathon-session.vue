<template>
  <div class="game-page-layout">
    <div class="top-bar">
      <VStopSessionBtn @close="backTo" />
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
          <div v-if="gameStore.levelSettings.timer" class="stat-widget timer">
            <div class="widget-label">{{ t('marathonGame.timer') }}</div>
            <div class="widget-value">{{ gameStore.timer }}</div>
          </div>
        </div>
      </header>

      <main class="game-content">
        <div v-if="gameStore.gameActive && gameStore.currentWord" class="game-area">

          <div class="word-display" :class="feedbackClass">
            <h1>{{ gameStore.currentWord.de }}</h1>
          </div>

          <div class="actions" :class="{ 'disabled': isChecking }">
            <button @click="handleArticleChoice('der')" class="article-btn der">
              <span class="article-text">der</span>
            </button>
            <button @click="handleArticleChoice('die')" class="article-btn die">
              <span class="article-text">die</span>
            </button>
            <button @click="handleArticleChoice('das')" class="article-btn das">
              <span class="article-text">das</span>
            </button>
          </div>
        </div>

        <div v-else class="game-over-wrapper">
          <div class="game-over">
            <h1 class="game-over__title">{{ t('marathonGame.end') }}</h1>

            <div class="score-card">
              <p class="game-over__streak-info">
                {{ t('marathonGame.urStreak') }}
                <span class="score-value">{{ gameStore?.sessionStreak }}</span>
              </p>

              <div v-if="gameStore.sessionStreak > 0 && gameStore.sessionStreak >= currentDifficultyRecord" class="record-badge">
                🎉 {{ t('marathonGame.newRecord') }} 🎉
              </div>
              <p v-else class="game-over__best-score">
                {{ t('marathonGame.bestResult') }} {{ currentDifficultyRecord }}
              </p>
            </div>

            <div class="game-over__actions">
              <button @click="gameStore.retryGame()" class="btn-gummy btn-gummy--success">
                {{ t('marathonGame.tryAgain') }}
              </button>
              <button @click="goBackToPrepare" class="btn-gummy btn-gummy--primary">
                {{ t('marathonGame.back') }}
              </button>
              <button @click="toMain" class="btn-gummy btn-gummy--secondary">
                {{ t('marathonGame.main') }}
              </button>
            </div>
          </div>
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useGameStore} from '../store/marafonStore.js'
import {playCorrect, playWrong, unlockAudioByUserGesture} from '../utils/soundManager.js'
import VStopSessionBtn from "~/src/components/V-stopSessionBtn.vue";

const {t} = useI18n()
const gameStore = useGameStore()
const router = useRouter()
const feedback = ref(null)
const isChecking = ref(false)

const currentDifficultyRecord = computed(() => {
  if (gameStore.personalBests && gameStore.difficulty) {
    return gameStore.personalBests[gameStore.difficulty] || 0
  }
  return 0
})

const backTo = () => {
  router.back()
}

const feedbackClass = computed(() => {
  if (feedback.value === 'correct') return 'feedback-correct'
  if (feedback.value === 'incorrect') return 'feedback-incorrect'
  return ''
})

function handleArticleChoice(chosenArticle) {
  if (isChecking.value) return
  isChecking.value = true

  const isCorrect = chosenArticle === gameStore.currentWord.article
  feedback.value = isCorrect ? 'correct' : 'incorrect'

  if (isCorrect) {
    playCorrect()
  } else {
    playWrong()
  }

  setTimeout(() => {
    gameStore.submitAnswer(isCorrect)
    feedback.value = null
    isChecking.value = false
  }, 800)
}

function goBackToPrepare() {
  router.push('/article-marathon')
}

function toMain() {
  router.push('/')
}

watch(
    () => gameStore.gameReady,
    (isReady) => {
      if (!isReady) {
        setTimeout(() => {
          router.push('/article-marathon')
        }, 1500)
      }
    },
    {immediate: true}
)

onMounted(() => {
  const captureOpts = { capture: true };
  const unlockOnce = () => {
    unlockAudioByUserGesture();
    window.removeEventListener('pointerdown', unlockOnce, captureOpts);
    window.removeEventListener('keydown', unlockOnce, captureOpts);
  };
  window.addEventListener('pointerdown', unlockOnce, captureOpts);
  window.addEventListener('keydown', unlockOnce, captureOpts);

  if (gameStore.gameReady && !gameStore.gameActive) {
    gameStore.startNewRound();
  }
});
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
  padding: 25px 15px;
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
  font-size: 25px;
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
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 8px 12px;
  text-align: center;
  box-shadow: 0 4px 0 #1e1e1e;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.widget-label {
  font-size: 0.85rem;
  font-weight: 800;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.widget-value {
  font-size: 1.6rem;
  font-weight: 900;
  color: #1e1e1e;
  line-height: 1;
}

.stat-widget.record .widget-value {
  color: #f59e0b;
}

.stat-widget.timer {
  background-color: #fef2f2;
  border-color: #ef4444;
  box-shadow: 0 4px 0 #ef4444;
}

.stat-widget.timer .widget-label { color: #b91c1c; }
.stat-widget.timer .widget-value { color: #ef4444; }


.game-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
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


.word-display {
  text-align: center;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.word-display h1 {
  font-size: 70px;
  font-weight: 900;
  line-height: 1.1;
  color: var(--titleColor);
  margin: 0;
  word-break: break-word;
  transition: color 0.2s ease;
}

.feedback-correct h1 { color: #4ade80; }
.feedback-incorrect h1 { color: #f87171; }

.feedback-incorrect {
  animation: gentle-shake 0.4s ease both;
}

@keyframes gentle-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  width: 100%;
  max-width: 600px;
  padding-bottom: 20px;
  transition: opacity 0.2s ease;
}

.actions.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.article-btn {
  flex: 1;
  padding: 20px 10px;
  border-radius: 20px;
  border: 4px solid #1e1e1e;
  box-shadow: 0 6px 0 #1e1e1e;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.article-btn:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #1e1e1e;
}

/* Текст внутри артиклей */
.article-text {
  font-family: "Nunito", sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: #ffffff;
  text-transform: lowercase;
}

/* Цвета артиклей */
.article-btn.der { background-color: #60a5fa; }
.article-btn.die { background-color: #f87171; }
.article-btn.das { background-color: #fca13a; }

/* Экран конца игры */
.game-over-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
}

.game-over {
  background-color: #ffffff;
  border: 4px solid #1e1e1e;
  border-radius: 28px;
  box-shadow: 0 8px 0 #1e1e1e;
  padding: 32px 24px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-over__icon {
  font-size: 64px;
  margin-bottom: 12px;
  animation: bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.game-over__title {
  font-size: 32px;
  font-weight: 900;
  color: #1e1e1e;
  margin: 0 0 20px 0;
}

.score-card {
  background: #f3f4f6;
  border: 3px solid #e5e7eb;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  margin-bottom: 24px;
}

.game-over__streak-info {
  font-size: 18px;
  font-weight: 800;
  color: #4b5563;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.score-value {
  font-size: 48px;
  font-weight: 900;
  color: #f59e0b;
  line-height: 1;
}

.record-badge {
  background: #fef08a;
  color: #ca8a04;
  font-weight: 900;
  padding: 8px 16px;
  border-radius: 12px;
  border: 2px solid #ca8a04;
  display: inline-block;
  margin-top: 16px;
  font-size: 16px;
}

.game-over__best-score {
  font-size: 16px;
  font-weight: 800;
  color: #6b7280;
  margin: 16px 0 0 0;
}

.game-over__actions {
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
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-gummy:active {
  transform: translateY(4px);
}

.btn-gummy--primary {
  background: #60a5fa;
  color: #1e1e1e;
  box-shadow: 0 5px 0 #1e1e1e;
}

.btn-gummy--success {
  background: #4ade80;
  color: #1e1e1e;
  box-shadow: 0 5px 0 #1e1e1e;
}

.btn-gummy--secondary {
  background: #ffffff;
  color: #1e1e1e;
  box-shadow: 0 5px 0 #1e1e1e;
}

.btn-gummy:active {
  box-shadow: 0 0 0 #1e1e1e;
}

/* Загрузка */
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
.bouncy-loader span:nth-child(2) { animation-delay: 0.1s; }
.bouncy-loader span:nth-child(3) { animation-delay: 0.2s; }

@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-15px); }
}

@keyframes bounceIn {
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

/* Адаптив под мобилки */
@media (max-width: 1023px) {
  .game-header {
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin-top: calc(env(safe-area-inset-top) + 0px);
  }

  .lives-bar {
    position: static;
    width: 100%;
    justify-content: center;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .word-display h1 {
    font-size: 30px;
  }

  .game-area {
    gap: 30px;
  }

  .article-btn {
    padding: 16px 4px;
    border-radius: 16px;
    border-width: 3px;
    box-shadow: 0 4px 0 #1e1e1e;
  }

  .article-text {
    font-size: 24px;
  }
}
</style>