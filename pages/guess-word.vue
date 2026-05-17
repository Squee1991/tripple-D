<template>
  <main class="ios-trainer-page">
    <div class="ios-app-container">
      <header class="ios-header">
        <VBackBtn/>
        <div v-if="isStarted && !store.win && !store.lose" class="ios-stats">
          <div class="stat-pill">
            <img class="guess__icon-header" src="../assets/images/dailyIcons/timer.svg" alt="">
            <span>{{ timePassed }}</span>
          </div>
          <div class="stat-pill">
            <img class="guess__icon-header" src="../assets/images/heartInfo.svg" alt="heart">
            <span>{{ store.attempts }}</span>
          </div>
          <button class="ios-btn-icon" @click="handleRestart" title="Начать заново">
            <img class="guess__icon-header -repeat"
                 :class="{ 'spin-anim': isSpinning }"
                 src="../assets/images/repeat.svg"
                 alt="repeat">
          </button>
        </div>
      </header>
      <div v-if="!isStarted" class="screen-start">
        <div class="mascot-emoji">
          <img class="guess__icon" src="../assets/images/guessWord.svg" alt="">
        </div>
        <p class="subtitle">{{ t('guessWord.subtitle') }}</p>
        <button class="ios-btn-primary btn-bounce" @click="startGame">
          {{ t('guessWord.startGame') }}
        </button>
      </div>
      <div v-else class="screen-game">
        <div v-if="themeText" class="theme-chip">
          💡 {{ t('guessWord.theme') }} <strong>{{ themeText }}</strong>
        </div>
        <div class="word-board">
          <div
              v-for="(char, i) in store.masked"
              :key="i"
              class="letter-box"
              :class="{ 'letter-box--filled': char }"
          >
            {{ char || '' }}
          </div>
        </div>
        <div v-if="store.win" class="success-message bounce-in">
          🎉 {{ t('guessWord.victory') }} 🎉
        </div>
        <div class="game-keyboard">
          <button
              v-for="letter in store.alphabet"
              :key="letter"
              class="key-btn"
              :class="getKeyClass(letter)"
              :disabled="store.usedLetters.includes(letter) || store.win || store.lose"
              @click="store.pickLetter(letter)"
          >
            {{ letter }}
          </button>
        </div>
        <div class="input-section">
          <input
              v-model="guessInput"
              class="ios-input"
              :disabled="store.win || store.lose"
              @keyup.enter="guessWord"
              :placeholder="t('guessWord.placeholder')"
              autocomplete="off"
          />
          <button class="ios-btn-secondary" @click="guessWord" :disabled="store.win || store.lose || !guessInput">
            {{ t('guessWord.guess') }}
          </button>
        </div>
      </div>
    </div>
    <Transition name="ios-modal">
      <div v-if="showArticleModal" class="ios-modal-overlay" @click.self="closeArticleModal">
        <div class="ios-modal-card">
          <h3 class="modal-title">{{ t('guessWord.good') }}</h3>
          <p class="modal-text">{{ t('guessWord.article') }} <span class="highlight-word">{{ store.answer }}</span></p>
          <div v-if="!articleResult" class="article-buttons">
            <button class="ios-btn-primary article-btn" @click="checkArticle('der')">der</button>
            <button class="ios-btn-primary article-btn" @click="checkArticle('die')">die</button>
            <button class="ios-btn-primary article-btn" @click="checkArticle('das')">das</button>
          </div>
          <div v-if="articleResult" class="feedback-badge bounce-in"
               :class="{'success': articleResult === 'Верно!', 'error': articleResult !== 'Верно!'}">
            {{ articleResult }}
          </div>
          <button v-if="articleResult" class="ios-btn-text modal-close" @click="closeArticleModal">
            {{ t('guessWord.further') }} →
          </button>
        </div>
      </div>
    </Transition>
    <Transition name="ios-modal">
      <div v-if="showLoseModal" class="ios-modal-overlay" @click.self="closeLoseModal">
        <div class="ios-modal-card error-card">
          <div class="modal-emoji">💔</div>
          <h3 class="modal-title">{{ t('guessWord.notToday') }}</h3>
          <p class="modal-text">{{ t('guessWord.guessed') }} <span class="highlight-error">{{ store.answer }}</span></p>
          <div class="modal-actions">
            <button class="ios-btn-primary" @click="startGame">{{ t('guessWord.tryAgain') }}</button>
            <NuxtLink to="/" class="ios-btn-secondary link-btn">{{ t('guessWord.btnToMain') }}</NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </main>
</template>

<script setup>
import {ref, watch, onUnmounted, computed} from 'vue'
import {useGuessWordStore} from '../store/guesStore.js'
import {useRouter} from 'vue-router'
import {nameMap} from '../utils/nameMap.js'
import {useSeoMeta} from "#imports"
import VBackBtn from "~/src/components/V-back-btn.vue";
import { showInterstitial } from '../utils/admob.js'
const {t} = useI18n()
const store = useGuessWordStore()
const isSpinning = ref(false)
const guessInput = ref('')
const articleResult = ref(null)
const isStarted = ref(false)
const showArticleModal = ref(false)
const showLoseModal = ref(false)
const now = ref(Date.now())

useSeoMeta({
  robots: 'noindex, nofollow'
})

let intervalId = null
const timePassed = computed(() => {
  if (!store.timeStarted) return 0
  return Math.max(0, Math.floor((now.value - store.timeStarted) / 1000))
})

const themeText = computed(() => {
  const obj = store.currentWordObj
  if (!obj) return ''
  const key = obj.theme || obj.topic || obj.category || ''
  if (!key) return ''
  const locKey = nameMap[key]
  if (locKey) {
    return t(locKey)
  }
  return key
})

function startTimer() {
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

function handleRestart() {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 500)
  startGame()
}

function checkArticle(selectedArticle) {
  if (!store.currentWordObj) return
  const correct = selectedArticle === store.currentWordObj.article.toLowerCase()
  articleResult.value = correct ? 'Верно!' : `Неверно! Правильно: ${store.currentWordObj.article}`
}

function closeArticleModal() {
  showArticleModal.value = false
  startGame()
}

function closeLoseModal() {
  showLoseModal.value = false
}

function stopTimer() {
  if (intervalId) clearInterval(intervalId)
}

function startGame() {
  showInterstitial(async ()=> {
    await store.startGame()
    now.value = Date.now()
    isStarted.value = true
    guessInput.value = ''
    articleResult.value = null
    showArticleModal.value = false
    showLoseModal.value = false
    startTimer()
  })
}

function guessWord() {
  if (!guessInput.value.trim()) return
  store.tryGuessWord(guessInput.value)
  guessInput.value = ''
}

function getKeyClass(letter) {
  if (!store.usedLetters.includes(letter)) return ''
  const answerStr = store.answer || ''
  if (answerStr.toLowerCase().includes(letter.toLowerCase())) {
    return 'key-btn--correct'
  }
  return 'key-btn--wrong'
}

onUnmounted(() => stopTimer())

watch(() => store.win, (isWin) => {
  if (isWin) {
    stopTimer()
    setTimeout(() => {
      showArticleModal.value = true
    }, 600);
  }
})

watch(() => store.lose, (isLose) => {
  if (isLose) {
    stopTimer()
    setTimeout(() => {
      showLoseModal.value = true
    }, 600);
  }
})
</script>

<style scoped>
.ios-trainer-page {
  min-height: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Nunito, sans-serif;
}

.ios-app-container {
  width: 100%;
  max-width: 768px;
  min-height: 100%;
  height: 100%;
  background: var(--bg);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.guess__icon-header {
  width: 34px;
}

.ios-header {
  padding: 5px 10px 15px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: transparent;
  z-index: 10;
}

.ios-btn-back {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #007AFF;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 0;
  transition: opacity 0.2s;
}

.ios-btn-back:active {
  opacity: 0.5;
}

.ios-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-pill {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 600;
  color: var(--titleColor);
}

.ios-btn-icon {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007AFF;
  cursor: pointer;
  margin-left: 10px;
}

.ios-btn-icon:active {
  transform: scale(0.95);
}

.guess__icon {
  width: 150px;
}

.screen-start {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
}

.screen-game {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px 10px 10px 10px;
}

.mascot-emoji {
  font-size: 80px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.title-main {
  font-size: 32px;
  font-weight: 800;
  color: var(--titleColor);
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 17px;
  color: #8e8e93;
  margin-bottom: 40px;
}

.theme-chip {
  align-self: center;
  background: rgba(0, 122, 255, 0.1);
  color: #007AFF;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 18px;
  margin-bottom: 30px;
}

.word-board {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  margin-bottom: 40px;
  min-height: 64px;
}

.letter-box {
  width: 30px;
  height: 40px;
  background: #e5e5ea;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: #1c1c1e;
  text-transform: uppercase;
  box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.letter-box--filled {
  background: #34C759;
  color: #fff;
  box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.game-keyboard {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-bottom: 30px;
}

.key-btn {
  width: 40px;
  height: 50px;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1c1c1e;
  box-shadow: 0 4px 0 #d1d1d6;
  cursor: pointer;
  transition: all 0.1s;
  text-transform: uppercase;
}

.key-btn:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 #d1d1d6;
}

.key-btn--correct {
  background: #34C759;
  color: #ffffff;
  box-shadow: 0 2px 0 #248a3d;
  transform: translateY(2px);
  cursor: not-allowed;
}

.key-btn--wrong {
  background: #FF8A8A;
  color: #ffffff;
  box-shadow: 0 2px 0 #8e8e93;
  transform: translateY(2px);
  cursor: not-allowed;
}

.input-section {
  display: flex;
  gap: 10px;
  margin-top: auto;
  padding: 15px 0;
}

.ios-input {
  flex: 1;
  background: #fff;
  border: 2px solid #e5e5ea;
  border-radius: 16px;
  padding: 10px 16px;
  font-size: 17px;
  color: #1c1c1e;
  outline: none;
  transition: border-color 0.2s;
}

.ios-input:focus {
  border-color: #007AFF;
}

.ios-input:disabled {
  background: #f2f2f7;
  color: #aeaeb2;
}

.ios-btn-primary {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 6px 0 #005bb5;
  cursor: pointer;
  transition: all 0.1s;
  width: 100%;
}

.ios-btn-primary:active:not(:disabled) {
  transform: translateY(6px);
  box-shadow: 0 0 0 #005bb5;
}

.ios-btn-primary:disabled {
  background: #a1c9f7;
  box-shadow: 0 6px 0 #7caee0;
  cursor: not-allowed;
}

.ios-btn-secondary {
  background: #34C759;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 4px 0 #248a3d;
  cursor: pointer;
  transition: all 0.1s;
}

.ios-btn-secondary:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 #248a3d;
}

.ios-btn-text {
  background: none;
  border: none;
  color: #007AFF;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
}

.ios-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 20px;
}

.ios-modal-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 32px 24px;
  width: 100%;
  max-width: 340px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-emoji {
  font-size: 64px;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 24px;
  font-weight: 800;
  color: #1c1c1e;
  margin-bottom: 8px;
}

.modal-text {
  font-size: 16px;
  color: #8e8e93;
  margin-bottom: 24px;
}

.highlight-word {
  color: #34C759;
  font-weight: 800;
  font-size: 18px;
}

.highlight-error {
  color: #FF3B30;
  font-weight: 800;
  font-size: 18px;
}

.article-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.article-btn {
  padding: 12px;
  font-size: 16px;
  flex: 1;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  background: #e5e5ea;
  color: #1c1c1e;
  box-shadow: 0 4px 0 #d1d1d6;
  padding: 14px;
}

.link-btn:active {
  background: #d1d1d6;
}

.feedback-badge {
  margin-top: 16px;
  padding: 10px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
}

.feedback-badge.success {
  background: #e8f8f0;
  color: #34C759;
}

.feedback-badge.error {
  background: #ffebe9;
  color: #FF3B30;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
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

.spin-anim {
  animation: spin360 0.5s ease-in-out;
}

@keyframes spin360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.ios-modal-enter-active,
.ios-modal-leave-active {
  transition: opacity 0.3s ease;
}

.ios-modal-enter-from,
.ios-modal-leave-to {
  opacity: 0;
}

.ios-modal-enter-active .ios-modal-card {
  animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>