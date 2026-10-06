<template>
  <main class="ios-trainer-page">
    <VLoginPreloader v-if="isLoadingAd"/>
    <div v-else-if="!isLoadingAd" class="ios-app-container">
      <header class="ios-header" :class="{ 'not__started' : !isStarted }">
        <VBackBtn/>
        <span v-if="!isStarted" class="title">{{ t('sub.guess') }}</span>
        <div v-if="isStarted && !store.win && !store.lose" class="ios-stats">
          <div class="stat-pill">
            <img class="guess__icon-header" src="../assets/images/dailyIcons/timer.svg" alt="">
            <span class="guest__header-point">{{ timePassed }}</span>
          </div>
          <div class="stat-pill">
            <img class="guess__icon-header" src="../assets/images/heartInfo.svg" alt="heart">
            <span class="guest__header-point">{{ store.attempts }}</span>
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
          <img class="guess__icon" src="../assets/images/GuessIcon.svg" alt="">
        </div>
        <p class="subtitle">{{ t('guessWord.subtitle') }}</p>
        <button class="ios-btn-primary btn-bounce" @click="startGame(false)">
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
          <div class="actions-wrapper">
            <div
                v-if="showHintButton"
                class="hint-container"
                :class="{ 'hint-container--expanded': isHintExpanded }"
            >
              <button
                  v-if="!isHintExpanded"
                  class="ios-btn-hint-square bounce-in"
                  @click="isHintExpanded = true"
                  title="Подсказка"
              >
                💡
              </button>
              <div v-else class="hint-popup bounce-in">
                <button class="hint-close-btn" @click="isHintExpanded = false">✕</button>
                <div class="hint-title">💡 {{ t('guessWordHint.hint-title') }}</div>
                <div class="hint-desc">{{ t('guessWordHint.hint-desc') }}</div>
                <button class="hint-action-btn" @click="confirmUseHint">{{ t('guessWordHint.hint-action-btn') }}</button>
              </div>
            </div>
            <button
                class="ios-btn-secondary"
                @click="guessWord"
                :disabled="store.win || store.lose || !guessInput"
            >
              {{ t('guessWord.guess') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <Transition name="fade-scale">
      <div v-if="shouldShowArticleModal" class="fullscreen-modal">
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
          <div v-if="animStep >= 1" class="step-fade-in">
            <h2 class="fs-title">{{ t('guessWord.good') }}</h2>
            <p class="fs-text">
              {{ t('guessWord.article') }} <br/>
              <span class="highlight-word">{{ store.answer }}</span>
            </p>
          </div>
          <div v-if="animStep >= 2" class="step-fade-in">
            <img :src="articleError ? Support : Great" class="status-img bounce-in" alt="Status icon"/>
          </div>
          <div v-if="animStep >= 3" class="reward-pill bounce-in">
            <img :src="Article" alt="Article" class="reward-icon">
            <span class="reward-text">+{{ displayCoins }}</span>
          </div>
          <div v-if="animStep >= 4" class="step-fade-in full-width-block">
            <div v-if="!articleResult" class="fs-buttons">
              <button class="ios-btn-primary fs-btn der" @click="checkArticle('der')">der</button>
              <button class="ios-btn-primary fs-btn die" @click="checkArticle('die')">die</button>
              <button class="ios-btn-primary fs-btn das" @click="checkArticle('das')">das</button>
            </div>
            <div v-if="articleResult" class="feedback-badge bounce-in"
                 :class="{'success': !articleError, 'error': articleError}">
              {{ articleResult }}
            </div>
            <button v-if="articleResult" class="ios-btn-primary fs-next-btn bounce-in" @click="closeArticleModal">
              {{ t('guessWord.further') }} →
            </button>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="fade-scale">
      <div v-if="showLoseModal" class="fullscreen-modal">
        <div class="fullscreen-content">
          <img :src="Support" class="status-img bounce-in" alt="Lose icon"/>
          <h2 class="fs-title">{{ t('guessWord.notToday') }}</h2>
          <p class="fs-text">
            {{ t('guessWord.guessed') }} <br/>
            <span class="highlight-error">{{ store.answer }}</span>
          </p>
          <div class="fs-actions">
            <button class="ios-btn-primary fs-action-btn" @click="startGame(false)">
              {{ t('guessWord.tryAgain') }}
            </button>
            <NuxtLink to="/" class="ios-btn-secondary fs-link-btn">{{ t('guessWord.btnToMain') }}</NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
    <VStreakModal
        v-model="showStreakModal"
        :streak="authStore.streakCount"
        @close="handleStreakClosed"
    />
  </main>
</template>

<script setup>
import {ref, watch, onUnmounted, computed} from 'vue'
import {useGuessWordStore} from '../store/guesStore.js'
import {userlangStore} from '~/store/learningStore.js'
import {userAuthStore} from '~/store/authStore.js'
import {dailyStore} from '~/store/dailyStore.js'
import {useRouter} from 'vue-router'
import {nameMap} from '../utils/nameMap.js'
import {useSeoMeta} from '#imports'
import VBackBtn from '~/src/components/V-back-btn.vue'
import VLoginPreloader from '~/src/components/V-loginPreloader.vue'
import VStreakModal from '~/src/components/V-streak.vue'
import {useQuestAnimations} from '~/composables/useQuestAnimations.js'
import {playLevelCompleted} from '~/utils/soundManager.js'
import Article from '~/assets/images/article.svg'
import Support from '~/assets/images/Support.svg'
import Great from '~/assets/images/Greatcon.svg'

import {showInterstitial} from '../utils/admob.js'

const {t} = useI18n()
const store = useGuessWordStore()
const langStore = userlangStore()
const authStore = userAuthStore()
const daily = dailyStore()

const isSpinning = ref(false)
const guessInput = ref('')
const articleResult = ref(null)
const isStarted = ref(false)
const showArticleModal = ref(false)
const showLoseModal = ref(false)
const isLoadingAd = ref(false)
const now = ref(Date.now())

const articleError = ref(false)
const hintUsed = ref(false)
const isHintExpanded = ref(false)

const showStreakModal = ref(false)
const isWaitingForStreakClose = ref(false)
const initialStreak = ref(authStore.streakCount || 0)
const streakWasIncremented = ref(false)

watch(() => authStore.streakCount, (newVal) => {
  if (newVal > initialStreak.value) {
    streakWasIncremented.value = true
  }
})

const shouldShowArticleModal = computed(() => {
  return showArticleModal.value && !showStreakModal.value && !isWaitingForStreakClose.value
})

const questStoreAdapter = computed(() => ({
  hasMistakes: false,
  quest: {
    rewards: {
      xp: 0,
      points: 1
    }
  }
}))

const {
  animStep,
  displayCoins,
  confettiParticles,
  resetAnimations
} = useQuestAnimations(questStoreAdapter.value, false, shouldShowArticleModal)

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

const showHintButton = computed(() => {
  return store.answer && store.answer.length > 6 && !hintUsed.value && !store.win && !store.lose
})

function startTimer() {
  if (intervalId) clearInterval(intervalId)
  intervalId = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

function stopTimer() {
  if (intervalId) clearInterval(intervalId)
}

function handleRestart() {
  isSpinning.value = true
  setTimeout(() => {
    isSpinning.value = false
  }, 500)
  startGame(true)
}

function confirmUseHint() {
  isHintExpanded.value = false
  useHint()
}

function useHint() {
  if (!store.answer || hintUsed.value) return
  hintUsed.value = true

  const answerArr = store.answer.toUpperCase().split('')
  const unrevealed = [...new Set(answerArr.filter(char => {
    return !store.usedLetters.some(used => used.toUpperCase() === char)
  }))]

  const toReveal = unrevealed.sort(() => 0.5 - Math.random()).slice(0, 2)

  toReveal.forEach(char => {
    const alphabetChar = store.alphabet.find(a => a.toUpperCase() === char) || char
    store.pickLetter(alphabetChar)
  })
}

function checkArticle(selectedArticle) {
  if (!store.currentWordObj) return
  const correct = selectedArticle === store.currentWordObj.article.toLowerCase()

  if (correct) {
    articleResult.value = t('eventSessionPage.correct')
    articleError.value = false
  } else {
    articleResult.value = `${t('guessWord.wrong')} ${store.currentWordObj.article}`
    articleError.value = true
  }
}

function handleStreakClosed() {
  showStreakModal.value = false
  isWaitingForStreakClose.value = false
  showArticleModal.value = true
  playLevelCompleted()
}

function closeArticleModal() {
  showArticleModal.value = false
  resetAnimations()
  startGame(true)
}

function closeLoseModal() {
  showLoseModal.value = false
}

function startGame(skipAd = false) {
  showArticleModal.value = false
  showLoseModal.value = false
  showStreakModal.value = false
  isWaitingForStreakClose.value = false
  hintUsed.value = false
  isHintExpanded.value = false
  articleError.value = false
  initialStreak.value = authStore.streakCount || 0
  streakWasIncremented.value = false
  resetAnimations()
  stopTimer()

  const startSession = () => {
    store.startGame()
    now.value = Date.now()
    isStarted.value = true
    guessInput.value = ''
    articleResult.value = null
    startTimer()
  }

  if (skipAd) {
    startSession()
    return
  }

  isLoadingAd.value = true
  showInterstitial(() => {
    isLoadingAd.value = false
    startSession()
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
        showArticleModal.value = true
        playLevelCompleted()
      }
    }, 500)
  }
})

watch(() => store.lose, (isLose) => {
  if (isLose) {
    stopTimer()
    setTimeout(() => {
      showLoseModal.value = true
    }, 600)
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

.title {
  color: var(--title);
  font-size: 23px;
  font-weight: 600;
  margin-left: 15px;
  text-shadow: 1px 1px var(--title);
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

.not__started {
  justify-content: start;
}

.ios-stats {
  display: flex;
  align-items: center;
}

.stat-pill {
  display: flex;
  align-items: center;
  padding: 4px;
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

.reward-text {
  font-size: 36px;
  font-weight: 600;
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
  padding: 20px 15px 25px 15px;
}

.mascot-emoji {
  font-size: 80px;
  margin-bottom: 20px;
  width: 140px;
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
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 17px;
  margin-bottom: 25px;
  font-weight: 600;
}

.word-board {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-bottom: 30px;
  min-height: 64px;
}

.letter-box {
  width: 34px;
  height: 44px;
  background: #e5e5ea;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
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
  margin-bottom: 20px;
}

.key-btn {
  width: 38px;
  height: 48px;
  background: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 19px;
  font-weight: 700;
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
  gap: 12px;
  margin-top: auto;
  padding: 15px 0 20px 0;
  align-items: flex-end;
}

.actions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  position: relative;
}

.hint-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 40px;
}

.hint-popup {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: #ffffff;
  border: 2px solid #FF9500;
  border-radius: 18px;
  padding: 12px 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 50;
  text-align: left;
}

.hint-close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #8e8e93;
  font-size: 14px;
  cursor: pointer;
  padding: 2px;
  line-height: 1;
}

.hint-title {
  font-size: 15px;
  font-weight: 800;
  color: #1c1c1e;
}

.hint-desc {
  font-size: 12px;
  color: #636366;
  line-height: 1.3;
}

.guest__header-point {
  font-family: Lilita One, sans-serif;
  font-weight: 400;
  font-size: 24px;
  margin-left: 4px;
  width: 40px;
}

.hint-action-btn {
  margin-top: 4px;
  background: linear-gradient(135deg, #FF9500, #FFCC00);
  border: none;
  color: #fff;
  border-radius: 12px;
  padding: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 0 #d67a00;
  transition: all 0.1s;
}

.hint-action-btn:active {
  transform: translateY(2px);
  box-shadow: 0 0 0 #d67a00;
}

.ios-btn-hint-square {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #FF9500, #FFCC00);
  border: none;
  border-radius: 12px;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 0 #d67a00;
  cursor: pointer;
  transition: all 0.1s;
}

.ios-btn-hint-square:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 #d67a00;
}

.ios-input {
  flex: 1;
  background: #fff;
  border: 2px solid #e5e5ea;
  border-radius: 18px;
  padding: 14px 18px;
  font-size: 14px;
  font-weight: 600;
  color: #1c1c1e;
  outline: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.ios-input:focus {
  border-color: #007AFF;
  box-shadow: 0 4px 14px rgba(0, 122, 255, 0.15);
}

.ios-input:disabled {
  background: #f2f2f7;
  color: #aeaeb2;
  border-color: #f2f2f7;
}

.ios-btn-primary {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 6px 0 #005bb5;
  cursor: pointer;
  transition: all 0.1s;
  width: 100%;
  max-width: 360px;
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
  border-radius: 50px;
  padding: 14px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.1s;
  white-space: nowrap;
}

.ios-btn-secondary:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 #248a3d;
}

.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bg, #f2f2f7);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
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

.step-fade-in {
  animation: fadeInStep 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes fadeInStep {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.reward-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  font-weight: 800;
  font-size: 22px;
  color: #d67a00;
}

.reward-icon {
  width: 40px;
}

.status-img {
  width: 140px;
  margin-bottom: 16px;
  object-fit: contain;
}

.fs-title {
  font-size: 30px;
  font-weight: 800;
  color: var(--titleColor, #1c1c1e);
  margin-bottom: 8px;
}

.fs-text {
  font-size: 20px;
  color: #8e8e93;
  margin-bottom: 20px;
  line-height: 1.4;
}

.fs-text .highlight-word {
  display: inline-block;
  margin-top: 6px;
  font-size: 28px;
}

.fs-buttons {
  display: flex;
  gap: 16px;
  width: 100%;
}

.fs-btn {
  width: 100%;
  padding: 20px;
  font-size: 22px;
  border-radius: 20px;
}

.fs-btn.der {
  background: #007AFF;
  box-shadow: 0 6px 0 #005bb5;
}

.fs-btn.die {
  background: #FF3B30;
  box-shadow: 0 6px 0 #c22820;
}

.fs-btn.das {
  background: #34C759;
  box-shadow: 0 6px 0 #248a3d;
}

.fs-next-btn {
  margin-top: 25px;
  background: #2588f7;
  box-shadow: 0 6px 0 #1970d3;
  border-radius: 50px;
}

.fs-next-btn:active:not(:disabled) {
  box-shadow: 0 0 0 #000;
}

.fs-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

.fs-action-btn {
  width: 100%;
  padding: 18px;
  font-size: 18px;
  border-radius: 50px;
}

.fs-link-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  background: none;
  color: #808085;
  padding: 18px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
}

.fs-link-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 #d1d1d6;
}

.highlight-word {
  color: #34C759;
  font-weight: 800;
  font-size: 22px;
}

.highlight-error {
  color: #FF3B30;
  font-weight: 800;
  font-size: 26px;
  display: inline-block;
  margin-top: 8px;
}

.feedback-badge {
  margin-top: 20px;
  padding: 16px;
  border-radius: 16px;
  font-weight: 800;
  font-size: 18px;
  width: 100%;
  text-align: center;
}

.feedback-badge.success {
  color: #34C759;
}

.feedback-badge.error {
  color: #FF3B30;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
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

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>