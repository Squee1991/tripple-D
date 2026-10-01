<template>
  <div class="session-page">
    <transition name="fade-slide" appear>
      <div class="trainer-app" v-if="isReady && isMounted">
        <div class="trainer-app__board">
          <div v-if="!finished && currentWord && currentMode" class="board-content">
            <div class="top-nav">
              <VBackBtnNav/>
              <div class="progress-wrapper">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: progressPercentage + '%' }">
                    <div class="glare"></div>
                  </div>
                </div>
              </div>
              <span class="progress-text">{{ store.currentIndex + 1 }} / {{ totalWords }}</span>
            </div>

            <header class="session-header">
              <div class="session__theme">
                <span class="session__theme-t">{{ t('sessionPage.theme') }}:</span>
                <h1 class="session__topic">{{ translatedTopic }}</h1>
              </div>
              <div class="progress-line">
                <span class="progress-mode">{{ t('sessionPage.choice') }}: <b>{{
                    t(modeLabel(currentMode))
                  }}</b> ({{ currentModeIndex + 1 }}/{{ selectedModes.length }})</span>
              </div>
            </header>

            <div class="word-block">
              <div class="mode-exercise">
                <div v-if="currentMode === 'wordTranslate'" class="word-info-display">
                  <div class="wordTranslate">
                    <SoundBtn :text="`${currentWord.article} ${currentWord.de}`"/>
                    <div class="german-word">
                      <span class="highlight-word">{{ currentWord.article }} {{ currentWord.de }}</span>
                    </div>
                  </div>
                  <div class="word-divider">—</div>
                  <div class="translation-word">{{ currentWord[currentLangKey] }}</div>
                </div>

                <div v-if="currentMode === 'article'" class="article-mode-container">
                  <p class="question-text">{{ t('sessionLabels.articleFor') }} <span
                      class="highlight-word">{{ currentWord.de }}</span>:</p>
                  <div class="article-options">
                    <button
                        v-for="art in ['der', 'die', 'das']"
                        :key="art"
                        class="article-btn"
                        :class="[
                          art,
                          {
                            'is-correct': result === 'correct' && userInput === art,
                            'is-wrong': result === 'wrong' && userInput === art,
                            'is-revealed': result === 'wrong' && currentWord.article === art
                          }
                        ]"
                        :disabled="result !== ''"
                        @click="checkArticle(art)"
                    >
                      {{ art }}
                    </button>
                  </div>
                </div>

                <div v-if="currentMode === 'letters'">
                  <div class="question__content">
                    <p class="question-text">{{ t('sessionLabels.lettersFor') }} :</p>
                    <span class="highlight-word">{{ currentWord.ru }}</span>
                  </div>

                  <div class="assembled-letters-box"
                       :class="{ 'is-wrong-box': result === 'wrong', 'is-correct-box': result === 'correct' }">
                    <span
                        v-for="(charObj, i) in selectedLetterObjs"
                        :key="'sel-'+i"
                        class="assembled-char"
                        @click="!result && removeLetter(i)"
                    >
                      {{ charObj.char === ' ' ? '␣' : charObj.char }}
                    </span>
                    <span v-if="selectedLetterObjs.length === 0" class="placeholder-text">...</span>
                  </div>

                  <div class="letters">
                    <button
                        v-for="(letter, i) in shuffledLetters"
                        :key="'shuf-'+i"
                        :class="{'is-hidden': usedLetters[i]}"
                        :disabled="usedLetters[i] || result !== ''"
                        @click="addLetter(letter, i)"
                    >
                      {{ letter === ' ' ? '␣' : letter }}
                    </button>
                  </div>
                </div>

                <div v-if="currentMode === 'wordArticle'">
                  <div class="question__content">
                    <p class="question-text"><b>{{ t('sessionLabels.word') }} :</b></p>
                    <span class="highlight-word">{{ uiWord }}</span>
                  </div>
                  <input v-model="userInput" class="trainer-app__input" :disabled="result !== ''" autofocus/>
                </div>

                <div v-if="currentMode === 'plural'">
                  <p class="question-text">{{ t('sessionLabels.pluralFor') }}: <span
                      class="highlight-word">{{ currentWord.de }}</span></p>
                  <input v-model="userInput" class="trainer-app__input" :disabled="result !== ''" autofocus/>
                </div>

                <div v-if="currentMode === 'audio'">
                  <p class="question-text">{{ t('sessionLabels.audioFor') }}:</p>
                  <button @click="speak(currentWord.de)" class="audio-btn">
                    <img class="megaphones__icon" src="../../assets/images/megaphone.svg" alt="">
                    <span> {{ t('sessionLabels.listen') }}</span>
                  </button>
                  <input v-model="userInput" class="trainer-app__input" :disabled="result !== ''" autofocus/>
                </div>
              </div>

              <div
                  v-if="shouldShowGermanLetters && (currentMode === 'plural' || currentMode === 'wordArticle' || currentMode === 'letters' || currentMode === 'audio')"
                  class="german__letters">
                <button
                    @click="addGErmanLetters(letter)"
                    class="german__letters-item"
                    v-for="(letter, index) in germanLetters"
                    :key="index"
                    :disabled="result !== ''"
                >
                  {{ letter }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="!finished && (currentMode !== 'article' || result)" class="actions-wrapper" :class="feedbackClass">
            <div class="actions-container">
              <div v-if="result" class="feedback-text">
                <div v-if="result === 'correct'" class="feedback correct slide-up">
                  {{ t('trainerPage.right') }}
                </div>
                <div v-else class="feedback incorrect shake">
                  <div class="feedback-wrong-header">{{ t('trainerPage.false') }}</div>
                  <div class="correct-answer-text">{{ correctTextForFeedback }}</div>
                </div>
              </div>
              <button
                  v-if="!result"
                  class="btn btn-check"
                  @click="currentMode === 'wordTranslate' ? nextStep() : checkAnswer()"
                  :disabled="isChecking || (currentMode !== 'wordTranslate' && !userInput)"
              >
                {{ currentMode === 'wordTranslate' ? t('trainerPage.further') : t('sessionPage.btnCheck') }}
              </button>
              <button
                  v-if="result"
                  class="btn slide-up"
                  :class="result === 'correct' ? 'btn-next' : 'btn-wrong'"
                  @click="nextStep"
              >
                {{ t('trainerPage.further') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <Transition name="fade-scale">
      <div v-if="shouldShowFinishModal" class="fullscreen-modal">
        <div class="confetti-container" v-if="wrongWords.length === 0 && confettiParticles.length > 0">
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
            <img :src="wrongWords.length === 0 ? Great : Support" class="status-img bounce-in" alt="Status icon"/>
          </div>
          <div v-if="animStep >= 2" class="step-fade-in">
            <p class="fs-text" v-if="wrongWords.length === 0">
              {{ t('trainerPage.save') }}
            </p>
            <p class="fs-text" v-else>
              {{ t('sessionLabels.mistakes') }}
            </p>
            <div v-if="wrongWords.length > 0" class="streak-number bounce-in">
              {{ wrongWords.length }}
            </div>
          </div>
          <div v-if="animStep >= 3" class="step-fade-in full-width-block actions-spacing">
            <div class="fs-actions" v-if="wrongWords.length === 0">
              <button class="ios-btn-primary fs-action-btn" @click="restartAll">
                {{ t('sessionLabels.again') }}
              </button>
              <router-link to="/articles" class="ios-btn-secondary fs-link-btn">
                {{ t('sessionLabels.back') }}
              </router-link>
            </div>
            <div class="fs-actions" v-else>
              <button class="ios-btn-primary fs-action-btn" @click="repeatMistakes">
                {{ t('sessionLabels.mistakes') }} ({{ wrongWords.length }})
              </button>
              <router-link to="/articles" class="ios-btn-secondary fs-link-btn">
                {{ t('sessionLabels.back') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <VStreakModal
        v-model="showStreakModal"
        :streak="authStore.streakCount"
        @close="handleStreakClosed"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {userlangStore} from '../../store/learningStore.js'
import {userAuthStore} from '~/store/authStore.js'
import {dailyStore} from '~/store/dailyStore.js'
import {getSpeechAudio} from '../../utils/googleTTS.js'
import {nameMap, nameMode} from '../../utils/nameMap.js'
import {playWrong, playCorrect, playLevelCompleted, unlockAudioByUserGesture} from '../../utils/soundManager.js'
import {useSeoMeta} from '#imports'
import SoundBtn from "~/src/components/soundBtn.vue";
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";
import VStreakModal from '~/src/components/V-streak.vue'
import {showInterstitial} from '../../utils/admob.js';

import Great from '~/assets/images/Greatcon.svg'
import Support from '~/assets/images/Support.svg'

useSeoMeta({robots: 'noindex, nofollow'})

const {t, locale} = useI18n()
const store = userlangStore()
const authStore = userAuthStore()
const daily = dailyStore()
const route = useRoute()

const wrongWords = ref([])
const allWords = ref([])
const isReview = ref(false)
const isReady = ref(false)
const isMounted = ref(false)
const selectedModes = ref([])
const finished = ref(false)
const userInput = ref('')
const result = ref('')
const topicTitle = ref('')

const selectedLetterObjs = ref([])
const usedLetters = ref([])

const isChecking = ref(false)
const isSpeaking = ref(false)
const germanLetters = ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß']

const animStep = ref(0)
const confettiParticles = ref([])

const showStreakModal = ref(false)
const isWaitingForStreakClose = ref(false)
const initialStreak = ref(authStore.streakCount || 0)
const streakWasIncremented = ref(false)

watch(() => authStore.streakCount, (newVal) => {
  if (newVal > initialStreak.value) streakWasIncremented.value = true
})

const shouldShowFinishModal = computed(() => {
  return finished.value && !showStreakModal.value && !isWaitingForStreakClose.value
})

const feedbackClass = computed(() => {
  if (!result.value) return ''
  return result.value === 'correct' ? 'correct' : 'incorrect'
})

const shouldShowGermanLetters = computed(() => {
  if (!currentWord.value) return false;
  const textToCheck = currentMode.value === 'plural' ? (currentWord.value.plural || '') : (currentWord.value.de || '');
  return germanLetters.some(letter => textToCheck.includes(letter));
});

const saveProgressOnExit = () => {
  store.saveToFirebase()
}

const currentModeIndex = computed(() => store.currentModeIndex)
const currentMode = computed(() => selectedModes.value[currentModeIndex.value])
const currentWord = computed(() => store.selectedWords[store.currentIndex])
const totalWords = computed(() => store.selectedWords.length)
const currentLangKey = computed(() => {
  const lc = String(locale.value || '').trim()
  return lc.split('-')[0] || 'en'
})
const translatedTopic = computed(() => t(nameMap[topicTitle.value]))

const progressPercentage = computed(() => {
  if (totalWords.value === 0) return 0;
  return (store.currentIndex / totalWords.value) * 100;
})

const uiWord = computed(() => {
  const w = currentWord.value || {}
  return w[currentLangKey.value] ?? w.en ?? w.ru ?? w.de ?? ''
})

const modeLabel = (mode) => nameMode[mode] || mode

const shuffledLetters = computed(() => {
  if (!currentWord.value) return []
  return currentWord.value.de.split('').sort(() => Math.random() - 0.5)
})

const correctTextForFeedback = computed(() => {
  if (!currentWord.value) return ''
  switch (currentMode.value) {
    case 'article':
      return currentWord.value.article;
    case 'letters':
      return currentWord.value.de;
    case 'wordArticle':
      return `${currentWord.value.article} ${currentWord.value.de}`;
    case 'plural':
      return currentWord.value.plural;
    case 'audio':
      return currentWord.value.de;
    default:
      return '';
  }
})

function addLetter(letter, idx) {
  if (usedLetters.value[idx]) return
  selectedLetterObjs.value.push({char: letter, origIdx: idx})
  usedLetters.value[idx] = true
  userInput.value = selectedLetterObjs.value.map(x => x.char).join('')
}

function removeLetter(indexInArray) {
  const obj = selectedLetterObjs.value[indexInArray]
  if (obj.origIdx !== -1) {
    usedLetters.value[obj.origIdx] = false
  }
  selectedLetterObjs.value.splice(indexInArray, 1)
  userInput.value = selectedLetterObjs.value.map(x => x.char).join('')
}

function clearLetters() {
  selectedLetterObjs.value = []
  usedLetters.value = []
  userInput.value = ''
}

const addGErmanLetters = (letter) => {
  userInput.value += letter
  if (currentMode.value === 'letters') {
    selectedLetterObjs.value.push({char: letter, origIdx: -1})
  }
}

function speak(text) {
  if (isSpeaking.value) return
  isSpeaking.value = true
  getSpeechAudio(text)
  setTimeout(() => isSpeaking.value = false, 3000)
}

function normalize(text) {
  return (text || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

async function checkArticle(art) {
  if (result.value) return;
  userInput.value = art;
  await checkAnswer();
}

async function checkAnswer() {
  if (!currentWord.value || isChecking.value) return;
  isChecking.value = true;
  unlockAudioByUserGesture();

  let correct = '';
  switch (currentMode.value) {
    case 'article':
      correct = currentWord.value.article;
      break;
    case 'letters':
      correct = currentWord.value.de;
      break;
    case 'wordArticle':
      correct = `${currentWord.value.article} ${currentWord.value.de}`;
      break;
    case 'plural':
      correct = currentWord.value.plural;
      break;
    case 'audio':
      correct = currentWord.value.de;
      break;
  }

  const ok = normalize(userInput.value) === normalize(correct);
  result.value = ok ? 'correct' : 'wrong';
  ok ? playCorrect() : playWrong();

  if (!isReview.value) {
    await store.markProgress(currentWord.value, currentMode.value, ok);
    if (ok) {
      await store.markAsLearned(currentWord.value);
    } else {
      if (!wrongWords.value.find(w => w.de === currentWord.value.de)) {
        wrongWords.value.push(currentWord.value);
      }
      await store.addWrongAnswers(currentWord.value);
    }
  }

  isChecking.value = false;
}

function spawnConfetti() {
  const confettiColors = ['#ffb100', '#c982ff', '#4caf50', '#00c2ff', '#ff5252', '#ffffff']
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

const triggerFinishAnimations = () => {
  playLevelCompleted()
  if (wrongWords.value.length === 0) {
    spawnConfetti()
  }
  animStep.value = 0
  setTimeout(() => {
    animStep.value = 1
  }, 100)
  setTimeout(() => {
    animStep.value = 2
  }, 600)
  setTimeout(() => {
    animStep.value = 3
  }, 1100)
}

function finishSession() {
  finished.value = true
  store.saveToFirebase()
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
      triggerFinishAnimations()
    }
  }, 500)
}

const handleStreakClosed = () => {
  showStreakModal.value = false
  isWaitingForStreakClose.value = false
  triggerFinishAnimations()
}

function nextStep() {
  if (currentModeIndex.value < selectedModes.value.length - 1) {
    store.currentModeIndex++
  } else {
    store.currentModeIndex = 0
    store.currentIndex++
  }

  clearLetters()
  result.value = ''

  if (store.currentIndex >= store.selectedWords.length) {
    finishSession()
  } else if (currentMode.value === 'wordTranslate') {
    if (!isReview.value && currentWord.value) {
      store.markProgress(currentWord.value, currentMode.value, true);
      store.markAsLearned(currentWord.value);
    }
  }
}

function restartAll() {
  showInterstitial(() => {
    if (allWords.value && allWords.value.length > 0) {
      store.selectedWords = [...allWords.value]
    }
    isReview.value = true
    store.currentIndex = 0
    store.currentModeIndex = 0
    finished.value = false
    clearLetters()
    result.value = ''
    wrongWords.value = []
    animStep.value = 0
    confettiParticles.value = []
  })
}

function repeatMistakes() {
  showInterstitial(() => {
    if (wrongWords.value.length === 0) return
    store.selectedWords = [...wrongWords.value]
    store.currentIndex = 0
    store.currentModeIndex = 0
    finished.value = false
    clearLetters()
    result.value = ''
    wrongWords.value = []
    animStep.value = 0
    confettiParticles.value = []
  })
}

onMounted(async () => {
  isMounted.value = true;
  initialStreak.value = authStore.streakCount || 0
  const unlockOnce = () => {
    unlockAudioByUserGesture()
    window.removeEventListener('pointerdown', unlockOnce, {capture: true})
    window.removeEventListener('keydown', unlockOnce, {capture: true})
  }
  window.addEventListener('pointerdown', unlockOnce, {capture: true})
  window.addEventListener('keydown', unlockOnce, {capture: true})

  await store.loadFromFirebase()
  store.syncSelectedWordsProgress()

  const mode = route.query.mode
  selectedModes.value = Array.isArray(mode) ? mode : [mode].filter(Boolean)
  if (route.query.topic) topicTitle.value = route.query.topic

  allWords.value = [...store.selectedWords]
  isReview.value = ['1', 'true', 'repeat', 'review'].includes(String(route.query.review || '').toLowerCase())

  if (currentMode.value === 'wordTranslate' && currentWord.value && !isReview.value) {
    store.markProgress(currentWord.value, currentMode.value, true);
    store.markAsLearned(currentWord.value);
  }

  showInterstitial(() => {
    isReady.value = true
  })

  window.addEventListener('beforeunload', saveProgressOnExit)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', unlockAudioByUserGesture, {capture: true})
  window.removeEventListener('keydown', unlockAudioByUserGesture, {capture: true})
  window.removeEventListener('beforeunload', saveProgressOnExit)
  store.saveToFirebase()
})
</script>

<style scoped>
.session-page {
  font-family: "Nunito", sans-serif;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}

.trainer-app {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.trainer-app__board {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.board-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 5px 10px 10px 10px;
}

.question__content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.progress-wrapper {
  flex: 1;
}

.progress-bar {
  width: 100%;
  height: 25px;
  background: #e8eae5;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #10b981;
  border-radius: 8px 0 0 8px;
  transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
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

.progress-fill[style*="width: 100%"] {
  border-radius: 8px;
  border-right: none;
}

.progress-text {
  font-weight: 900;
  color: var(--titleColor);
  font-size: 16px;
}

.session-header {
  border-bottom: 3px solid #f3f4f6;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.session__theme {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
}

.session__theme-t {
  font-size: 16px;
  color: var(--titleColor);
  font-weight: 700;
}

.session__topic {
  font-size: 20px;
  color: var(--titleColor);
  font-weight: 900;
  margin: 0;
}

.progress-line {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--titleColor);
  font-weight: 700;
}

.word-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 20px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.word-block::-webkit-scrollbar {
  display: none;
}

.question-text {
  font-size: 16px;
  color: var(--titleColor);
  text-align: center;
  font-weight: 700;
  padding: 0 10px;
}

.question-text b {
  font-weight: 900;
}

.word-info-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  text-align: center;
}

.wordTranslate {
  display: flex;
  align-items: center;
  gap: 8px;
}

.german-word {
  font-size: 22px;
  color: var(--titleColor);
  font-weight: 900;
}

.word-divider {
  font-size: 1.6rem;
  color: #d1d5db;
  margin: 8px 0;
}

.translation-word {
  font-size: 1.6rem;
  color: var(--titleColor);
  font-weight: 700;
}

.article-mode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.article-options {
  display: flex;
  gap: 15px;
  width: 100%;
  max-width: 390px;
  margin-top: 28px;
  padding: 0 10px;
}

.article-btn {
  flex: 1;
  padding: 12px 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Nunito", sans-serif;
  font-size: 28px;
  font-weight: 900;
  color: #ffffff;
  text-transform: lowercase;
}

.article-btn:active:not(:disabled) {
  transform: translateY(6px);
}

.article-btn.der {
  background-color: #007AFF;
  box-shadow: 0 6px 0 #005bb5;
}

.article-btn.der:active:not(:disabled) {
  box-shadow: 0 0 0 #005bb5;
}

.article-btn.die {
  background-color: #FF3B30;
  box-shadow: 0 6px 0 #c22820;
}

.article-btn.die:active:not(:disabled) {
  box-shadow: 0 0 0 #c22820;
}

.article-btn.das {
  background-color: #34C759;
  box-shadow: 0 6px 0 #248a3d;
}

.article-btn.das:active:not(:disabled) {
  box-shadow: 0 0 0 #248a3d;
}

.article-btn.is-correct {
  transform: scale(1.04);
}

.article-btn.is-wrong {
  opacity: 0.5;
  filter: grayscale(0.6);
}

.article-btn.is-revealed {
  animation: pulse-correct 0.6s infinite alternate;
}

@keyframes pulse-correct {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.08);
  }
}

.article-btn:disabled:not(.is-correct):not(.is-wrong):not(.is-revealed) {
  opacity: 0.4;
  cursor: default;
}

.trainer-app__input {
  width: 100%;
  padding: 14px 15px;
  font-family: "Nunito", sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  border: 3px solid #e5e7eb;
  background: #ffffff;
  color: #1e1e1e;
  border-radius: 16px;
  transition: all 0.2s;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  margin-bottom: 20px;
}

.trainer-app__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.15);
}

.trainer-app__input:disabled {
  cursor: default;
  background: #f3f4f6;
  color: #6b7280;
  border-color: #d1d5db;
  box-shadow: none;
}

.assembled-letters-box {
  width: 100%;
  min-height: 58px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 3px solid #e5e7eb;
  border-radius: 16px;
  margin-bottom: 20px;
  transition: all 0.2s;
}

.assembled-letters-box.is-correct-box {
  border-color: #10b981;
  background: #ecfdf5;
}

.assembled-letters-box.is-wrong-box {
  border-color: #ef4444;
  background: #fef2f2;
}

.assembled-char {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 42px;
  background: #3b82f6;
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 900;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 3px 0 #1e3a8a;
  transition: transform 0.1s;
}

.assembled-char:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #1e3a8a;
}

.is-correct-box .assembled-char {
  background: #10b981;
  box-shadow: 0 3px 0 #064e3b;
  cursor: default;
}

.is-wrong-box .assembled-char {
  background: #ef4444;
  box-shadow: 0 3px 0 #7f1d1d;
  cursor: default;
}

.placeholder-text {
  color: #9ca3af;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 2px;
}

.letters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.letters button {
  font-family: "Nunito", sans-serif;
  font-size: 1.4rem;
  font-weight: 900;
  width: 44px;
  height: 52px;
  background: #ffffff;
  color: #1e1e1e;
  border-radius: 12px;
  border: 3px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 0 4px 0 #e5e7eb;
}

.letters button:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}

.letters button.is-hidden {
  opacity: 0;
  pointer-events: none;
}

.german__letters {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 12px 0;
}

.german__letters-item {
  padding: 8px 14px;
  border: 3px solid #e5e7eb;
  background: #ffffff;
  color: #1e1e1e;
  font-size: 1.2rem;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 0 4px 0 #e5e7eb;
}

.german__letters-item:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}

.audio-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #ffffff;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.1s;
  margin: 20px auto;
  box-shadow: 0 3px 0 #1e1e1e;
}

.audio-btn:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #1e1e1e;
}

.megaphones__icon {
  width: 20px;
}

.actions-wrapper {
  margin-top: auto;
  padding: 15px 10px calc(env(safe-area-inset-bottom) + 15px) 10px;
  background: transparent;
  transition: background 0.3s ease;
}

.actions-wrapper.correct {
  background: #dcfce7;
}

.actions-wrapper.incorrect {
  background: #fee2e2;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.feedback-text {
  width: 100%;
}

.feedback {
  font-size: 20px;
  font-weight: 900;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feedback.correct {
  color: #15803d;
}

.feedback.incorrect {
  color: #b91c1c;
}

.feedback-wrong-header {
  font-size: 16px;
  font-weight: 800;
  color: #991b1b;
}

.correct-answer-text {
  font-size: 22px;
  font-weight: 900;
  color: #b91c1c;
}

.btn {
  width: 100%;
  padding: 16px;
  font-family: "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 900;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.1s ease;
  text-transform: uppercase;
}

.btn:active:not(:disabled) {
  transform: translateY(4px);
}

.btn-check {
  background: #007AFF;
  color: #ffffff;
  box-shadow: 0 5px 0 #005bb5;
}

.btn-check:active:not(:disabled) {
  box-shadow: 0 0 0 transparent;
}

.btn-check:disabled {
  background: #d1d5db;
  color: #9ca3af;
  box-shadow: 0 5px 0 #9ca3af;
  cursor: not-allowed;
}

.btn-next {
  background: #22c55e;
  color: #ffffff;
  box-shadow: 0 5px 0 #15803d;
}

.btn-next:active {
  box-shadow: 0 0 0 transparent;
}

.btn-wrong {
  background: #ef4444;
  color: #ffffff;
  box-shadow: 0 5px 0 #b91c1c;
}

.btn-wrong:active {
  box-shadow: 0 0 0 transparent;
}

.slide-up {
  animation: slideUpAnim 0.3s ease-out forwards;
}

@keyframes slideUpAnim {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shake {
  animation: shakeAnim 0.4s ease-in-out;
}

@keyframes shakeAnim {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-5px);
  }
  40%, 80% {
    transform: translateX(5px);
  }
}

.fullscreen-modal {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: var(--bg, #f2f2f7);
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
  animation: fadeInStep 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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

.fs-text {
  font-size: 19px;
  font-weight: 600;
  color: #8e8e93;
  margin-bottom: 6px;
}

.streak-number {
  font-size: 34px;
  font-weight: 900;
  color: #34C759;
  line-height: 1;
  margin-bottom: 24px;
  padding: 8px 24px;
  border-radius: 20px;
  display: inline-block;
}

.status-img {
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  object-fit: contain;
}

.fs-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  background: none;
  color: #89898e;
  padding: 16px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 800;
  width: 100%;
  border: none;
  cursor: pointer;
}

.ios-btn-secondary:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #d1d1d6;
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

.highlight-word {
  font-size: 22px;
  color: darkorange;
  font-weight: 600;
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

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}
</style>