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
              <div>

              </div>
            </div>
            <header class="session-header">
              <div class="session__theme">
                <span class="session__theme-t">{{ t('sessionPage.theme') }}:</span>
                <h1 class="session__topic">{{ translatedTopic }}</h1>
              </div>
              <div class="progress-line">
                <span class="progress-mode">{{ t('sessionPage.choice') }}: <b>{{ t(modeLabel(currentMode)) }}</b> ({{ currentModeIndex + 1 }}/{{ selectedModes.length }})</span>
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
                  <p class="question-text">{{ t('sessionLabels.articleFor') }} <span class="highlight-word">{{ currentWord.de }}</span>:</p>
                  <div class="article-options">
                    <button
                        v-for="art in ['der', 'die', 'das']"
                        :key="art"
                        class="article-btn"
                        :class="{
                        'is-correct': result === 'correct' && userInput === art,
                        'is-wrong': result === 'wrong' && userInput === art,
                        'is-revealed': result === 'wrong' && currentWord.article === art
                      }"
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
                  <div class="letters">
                    <button v-for="(letter, i) in shuffledLetters" :key="i" :disabled="usedLetters[i]" @click="addLetter(letter, i)">
                      {{ letter === ' ' ? '␣' : letter }}
                    </button>
                  </div>
                  <button v-if="userInput" class="letters-clear" @click="clearLetters" type="button">
                    {{ t('wordDuelSession.clear') || 'clear' }}
                  </button>
                  <input v-model="userInput" class="trainer-app__input" readonly/>
                </div>

                <div v-if="currentMode === 'wordArticle'">
                  <div class="question__content">
                    <p class="question-text"><b>{{ t('sessionLabels.word')}} :</b></p>
                    <span class="highlight-word">{{ uiWord }}</span>
                  </div>
                  <input v-model="userInput" class="trainer-app__input" autofocus/>
                </div>

                <div v-if="currentMode === 'plural'">
                  <p class="question-text">{{ t('sessionLabels.pluralFor') }}: <span class="highlight-word">{{ currentWord.de }}</span></p>
                  <input v-model="userInput" class="trainer-app__input" autofocus/>
                </div>

                <div v-if="currentMode === 'audio'">
                  <p class="question-text">{{ t('sessionLabels.audioFor') }}:</p>
                  <button @click="speak(currentWord.de)" class="audio-btn">
                    <img class="megaphones__icon" src="../../assets/images/megaphone.svg" alt="">
                    <span> {{ t('sessionLabels.listen')}}</span>
                  </button>
                  <input v-model="userInput" class="trainer-app__input" autofocus/>
                </div>
              </div>

              <div v-if="shouldShowGermanLetters && (currentMode === 'plural' || currentMode === 'wordArticle' || currentMode === 'letters' || currentMode === 'audio')" class="german__letters">
                <button
                    @click="addGErmanLetters(letter)"
                    class="german__letters-item"
                    v-for="(letter, index) in germanLetters"
                    :key="index"
                >
                  {{ letter }}
                </button>
              </div>

              <div v-if="result" class="answer-result" :class="result">
                <span class="result-icon" v-if="result === 'correct'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </span>
                <span class="result-icon" v-if="result === 'wrong'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>
                <span class="result-text" v-if="currentMode === 'article'">{{ t('result.correctAnswer') }}: <span class="highlight-word">{{ currentWord.article }}</span></span>
                <span class="result-text" v-if="currentMode === 'letters' || currentMode === 'audio'">{{ t('result.correctAnswer') }}: <span class="highlight-word">{{ currentWord.de }}</span></span>
                <span class="result-text" v-if="currentMode === 'wordArticle'">{{ t('result.correct') }}: <span class="highlight-word">{{currentWord.article}} {{ currentWord.de }}</span> </span>
                <span class="result-text" v-if="currentMode === 'plural'">{{ t('result.correct') }}: <span class="highlight-word">{{ currentWord.plural }}</span></span>
              </div>
            </div>
            <div class="actions-wrapper">
              <button
                  v-if="currentMode !== 'article' || result"
                  class="btn-primary"
                  @click="!result ? checkAnswer() : nextStep()"
                  :disabled="!result && (isChecking || (currentMode !== 'wordTranslate' && !userInput))"
              >
                {{ currentMode === 'wordTranslate' ? t('trainerPage.further') : (!result ? t('sessionPage.btnCheck') : t('sessionPage.continue')) }}
              </button>
            </div>
          </div>
          <div v-else class="finish-block">
            <h2 class="finish-block__title">{{ t('sessionLabels.end')}}</h2>
            <div class="finish-block__actions">
              <button class="btn-primary" @click="restartAll">{{ t('sessionLabels.again')}}</button>
              <button v-if="wrongWords.length" class="btn-secondary" :disabled="wrongWords.length === 0" @click="repeatMistakes">
                {{ t('sessionLabels.mistakes')}} ({{ wrongWords.length }})
              </button>
              <router-link class="btn-secondary" to="/articles">{{ t('sessionLabels.back')}}</router-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userlangStore } from '../../store/learningStore.js'
import { getSpeechAudio } from '../../utils/googleTTS.js'
import { nameMap, nameMode } from '../../utils/nameMap.js'
import { playWrong, playCorrect, unlockAudioByUserGesture } from '../../utils/soundManager.js'
import { useSeoMeta } from '#imports'
import SoundBtn from "~/src/components/soundBtn.vue";
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";

useSeoMeta({ robots: 'noindex, nofollow' })

const { t, locale } = useI18n()
const store = userlangStore()
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
const usedLetters = ref([])
const isChecking = ref(false)
const isSpeaking = ref(false)
const germanLetters = ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß']

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
const currentLang = computed(() => locale.value)
const translatedTopic = computed(() => t(nameMap[topicTitle.value]))

const progressPercentage = computed(() => {
  if (totalWords.value === 0) return 0;
  return (store.currentIndex / totalWords.value) * 100;
})

const localeToKeyMap = {
  ru: 'ru', 'ru-RU': 'ru',
  en: 'en', 'en-US': 'en', 'en-GB': 'en',
  tr: 'tr', 'tr-TR': 'tr',
  pl: 'pl', 'pl-PL': 'pl',
  uk: 'uk', 'uk-UA': 'uk',
  es: 'es', 'es-ES': 'es',
  ar: 'ar', 'ar-AR': 'ar',
  uz: 'uz', 'uz-UZ': 'uz',
  de: 'de',
  hi: 'hi',
  fr: 'fr',
  ro: 'ro'
}

const currentLangKey = computed(() => {
  const lc = String(locale.value || '').trim()
  return localeToKeyMap[lc] || localeToKeyMap[lc.split('-')[0]] || 'en'
})

const uiWord = computed(() => {
  const w = currentWord.value || {}
  return w[currentLangKey.value] ?? w.en ?? w.ru ?? w.de ?? ''
})

function hasAnyPlural(wordsArray) {
  return (Array.isArray(wordsArray) ? wordsArray : []).some(w => w.plural && String(w.plural).trim() !== '')
}

const modeLabel = (mode) => nameMode[mode] || mode

const shuffledLetters = computed(() => {
  if (!currentWord.value) return []
  return currentWord.value.de.split('').sort(() => Math.random() - 0.5)
})

function addLetter(letter, idx) {
  if (usedLetters.value[idx]) return
  userInput.value += letter
  usedLetters.value[idx] = true
}

const addGErmanLetters = (letter) => userInput.value += letter

function speak(text) {
  if (isSpeaking.value) return
  isSpeaking.value = true
  getSpeechAudio(text)
  setTimeout(() => isSpeaking.value = false, 3000)
}

function clearLetters() {
  userInput.value = ''
  usedLetters.value = []
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

  if (currentMode.value === 'wordTranslate') {
    if (!isReview.value) {
      await store.markProgress(currentWord.value, currentMode.value, true);
      await store.markAsLearned(currentWord.value);
    }
    playCorrect();
    isChecking.value = false;
    nextStep();
    return;
  }

  let correct = '';
  switch (currentMode.value) {
    case 'article':     correct = currentWord.value.article; break;
    case 'letters':     correct = currentWord.value.de; break;
    case 'wordArticle': correct = `${currentWord.value.article} ${currentWord.value.de}`; break;
    case 'plural':      correct = currentWord.value.plural; break;
    case 'audio':       correct = currentWord.value.de; break;
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

function nextStep() {
  if (currentModeIndex.value < selectedModes.value.length - 1) {
    store.currentModeIndex++
  } else {
    store.currentModeIndex = 0
    store.currentIndex++
  }
  userInput.value = ''
  usedLetters.value = []
  result.value = ''
  if (store.currentIndex >= store.selectedWords.length) {
    finished.value = true
    store.saveToFirebase()
  }
}

function restartAll() {
  if (allWords.value && allWords.value.length > 0) {
    store.selectedWords = [...allWords.value]
  }
  isReview.value = true
  store.currentIndex = 0
  store.currentModeIndex = 0
  finished.value = false
  userInput.value = ''
  result.value = ''
  wrongWords.value = []
}

function repeatMistakes() {
  if (wrongWords.value.length === 0) return
  store.selectedWords = [...wrongWords.value]
  store.currentIndex = 0
  store.currentModeIndex = 0
  finished.value = false
  userInput.value = ''
  result.value = ''
  wrongWords.value = []
}

onMounted(async () => {
  isMounted.value = true;
  const unlockOnce = () => {
    unlockAudioByUserGesture()
    window.removeEventListener('pointerdown', unlockOnce, { capture: true })
    window.removeEventListener('keydown', unlockOnce, { capture: true })
  }
  window.addEventListener('pointerdown', unlockOnce, { capture: true })
  window.addEventListener('keydown', unlockOnce, { capture: true })

  await store.loadFromFirebase()
  store.syncSelectedWordsProgress()

  const mode = route.query.mode
  selectedModes.value = Array.isArray(mode) ? mode : [mode].filter(Boolean)
  if (route.query.topic) topicTitle.value = route.query.topic

  allWords.value = [...store.selectedWords]
  isReview.value = ['1','true','repeat','review'].includes(String(route.query.review || '').toLowerCase())
  isReady.value = true
  window.addEventListener('beforeunload', saveProgressOnExit)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', unlockAudioByUserGesture, { capture: true })
  window.removeEventListener('keydown', unlockAudioByUserGesture, { capture: true })
  window.removeEventListener('beforeunload', saveProgressOnExit)
  store.saveToFirebase()
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', unlockAudioByUserGesture, { capture: true })
  window.removeEventListener('keydown', unlockAudioByUserGesture, { capture: true })
  store.saveToFirebase()
})

watch(userInput, (newVal, oldVal) => {
  if (currentMode.value === 'letters' && newVal.length < oldVal.length) usedLetters.value = []
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
  padding: 5px 10px 15px 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.board-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
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

.glare{
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 4px
}

.progress-fill[style*="width: 100%"] {
  border-radius: 8px;
  border-right: none;
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
  font-size:16px;
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

.word-question {
  font-size: 1.1rem;
  color: var(--titleColor);
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 700;
}

.word-question b {
  font-size: 1.3rem;
  font-weight: 900;
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
  gap: 10px;
  width: 100%;
  margin-top: 10px;
  padding: 0 10px;
}

.article-btn {
  flex: 1;
  padding: 16px 8px;
  font-family: "Nunito", sans-serif;
  font-size: 1.2rem;
  font-weight: 900;
  background: #ffffff;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 4px 0 #1e1e1e;
  transition: all 0.1s ease;
  text-transform: uppercase;
}

.article-btn.is-correct {
  background: #10b981;
  color: #ffffff;
  border-color: #064e3b;
  box-shadow: 0 4px 0 #064e3b;
}

.article-btn.is-wrong {
  background: #ef4444;
  color: #ffffff;
  border-color: #7f1d1d;
  box-shadow: 0 4px 0 #7f1d1d;
}

.article-btn.is-revealed {
  background: #ecfdf5;
  color: #10b981;
  border-color: #10b981;
}

.article-btn:disabled:not(.is-correct):not(.is-wrong):not(.is-revealed) {
  opacity: 0.5;
  cursor: default;
  box-shadow: 0 4px 0 #1e1e1e;
}

.article-btn:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #1e1e1e;
}

.trainer-app__input {
  width: 100%;
  padding: 10px 15px;
  font-family: "Nunito", sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  border: 3px solid #1e1e1e;
  background: #ffffff;
  color: #1e1e1e;
  border-radius: 14px;
  transition: all 0.1s;
  text-align: center;
  box-shadow: inset 0 3px 0 rgba(0,0,0,0.05);
}

.trainer-app__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: inset 0 3px 0 rgba(0,0,0,0.05), 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.trainer-app__input[readonly] {
  cursor: default;
  background: #f3f4f6;
  color: #6b7280;
  border-color: #d1d5db;
  box-shadow: none;
}

.letters {
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.letters button {
  font-family: "Nunito", sans-serif;
  font-size: 1.4rem;
  font-weight: 900;
  width: 40px;
  height: 48px;
  background: #ffffff;
  color: #1e1e1e;
  border-radius: 12px;
  border: 3px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 0 4px 0 #e5e7eb;
}

.letters button:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #e5e7eb;
}

.letters button:disabled {
  background: #f3f4f6;
  border-color: #f3f4f6;
  color: #d1d5db;
  cursor: not-allowed;
  box-shadow: 0 4px 0 #f3f4f6;
}

.letters-clear {
  display: block;
  margin: 0 auto 1.2rem;
  padding: 8px 16px;
  font-family: "Nunito", sans-serif;
  font-size: 0.9rem;
  font-weight: 800;
  background: #ffffff;
  color: #4b5563;
  border: 3px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.1s;
  text-transform: uppercase;
  box-shadow: 0 3px 0 #e5e7eb;
}

.letters-clear:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #e5e7eb;
}

.german__letters {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 12px 0;
}

.german__letters-item {
  padding: 8px 12px;
  border: 3px solid #e5e7eb;
  background: #ffffff;
  color: #1e1e1e;
  font-size: 1.2rem;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 0 3px 0 #e5e7eb;
}

.german__letters-item:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #e5e7eb;
}

.audio-btn {
  display: inline-flex;
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
  margin: 0 auto 1.2rem;
  box-shadow: 0 3px 0 #1e1e1e;
}

.audio-btn:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #1e1e1e;
}

.megaphones__icon {
  width: 20px;
}

.answer-result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 800;
  margin-top: 1.5rem;
  min-height: 2.5rem;
  padding: 12px;
  border-radius: 14px;
  border: 3px solid transparent;
}

.answer-result.correct {
  background: #ecfdf5;
  color: #10b981;
  border-color: #10b981;
}

.answer-result.wrong {
  background: #fef2f2;
  color: #ef4444;
  border-color: #ef4444;
}

.result-icon {
  display: flex;
  align-items: center;
}

.btn-primary {
  width: 100%;
  padding: 16px 20px;
  font-family: "Nunito", sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: #ffffff;
  background-color: #3b82f6;
  border: 3px solid #1e3a8a;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.1s ease;
  text-align: center;
  box-shadow: 0 5px 0 #1e3a8a;
  letter-spacing: 0.5px;
}

.btn-primary:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 1px 0 #1e3a8a;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  border-color: #4b5563;
  color: #4b5563;
  cursor: not-allowed;
  box-shadow: 0 5px 0 #4b5563;
}

.finish-block {
  text-align: center;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.finish-block__title {
  font-size: 28px;
  color: var(--titleColor);
  font-weight: 900;
  margin-bottom: 2rem;
}

.finish-block__actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-secondary {
  display: block;
  width: 100%;
  padding: 14px 20px;
  font-family: "Nunito", sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #1e1e1e;
  background-color: #ffffff;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.1s ease;
  text-align: center;
  text-decoration: none;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
}

.highlight-word {
  color: #3b82f6;
  font-weight: 900;
  font-size: 22px;
}

.answer-result.wrong .highlight-word {
  color: #ef4444;
  text-decoration: underline;
}


.answer-result.correct .highlight-word {
  color: #10b981;
}

.btn-secondary:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 1px 0 #1e1e1e;
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