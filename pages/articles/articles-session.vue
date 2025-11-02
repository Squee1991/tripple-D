<template>
  <div class="session-page">
    <button @click="goBack" class="exit-sign">
      <svg class="exit-sign-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor"
              d="m12 12.7l-3.2 3.2q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l3.2-3.2l-3.2-3.2q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l3.2 3.2l3.2-3.2q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7L13.4 12l3.2 3.2q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275zM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.138T12 2q2.075 0 3.9.788t3.175 2.138q1.35 1.35 2.137 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.137T12 22m0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20"></path>
      </svg>
      <span class="exit-sign-text">{{ t('trainerPage.exit') }}</span>
    </button>
    <div class="trainer-app" v-if="isReady">
      <div class="trainer-app__board">
        <div v-if="!finished && currentWord && currentMode">
          <div class="session__theme">
            <div class="session__theme-t">{{ t('sessionPage.theme') }}:</div>
            <h1 class="session__topic">{{ translatedTopic }}</h1>
          </div>
          <div class="progress-line">
            <span>{{ store.currentIndex + 1 }} / {{ totalWords }}</span>
            <span>{{ t('sessionPage.choice') }}: <b>{{ t(modeLabel(currentMode)) }}</b> ({{
                currentModeIndex + 1
              }}/{{ selectedModes.length }})</span>
          </div>
          <div class="word-block">
            <div v-if="currentMode === 'audio'" class="word-question">
              <span>{{ t('sessionLabels.word') }}: {{ currentWord?.[currentLang] }}</span>
            </div>
            <div class="mode-exercise">
              <div v-if="currentMode === 'article'">
                <p>{{ t('sessionLabels.articleFor') }} <b>{{ currentWord.de }}</b>:</p>
                <input v-model="userInput" maxlength="3" class="trainer-app__input"/>
              </div>
              <div v-if="currentMode === 'letters'">
                <p>{{ t('sessionLabels.lettersFor') }} <b>{{ currentWord.article }}</b></p>
                <div class="letters">
                  <button
                      v-for="(letter, i) in shuffledLetters"
                      :key="i"
                      :disabled="usedLetters[i]"
                      @click="addLetter(letter, i)"
                  >
                    {{ letter === ' ' ? '␣' : letter }}
                  </button>
                </div>
                <button
                    v-if="userInput"
                    class="letters-clear"
                    @click="clearLetters"
                    type="button"
                >
                  {{ t('wordDuelSession.clear') || 'clear' }}
                </button>
                <input v-model="userInput" class="trainer-app__input" readonly/>
              </div>
              <div v-if="currentMode === 'wordArticle'">
                <p><b>{{ t('sessionLabels.word')}} : {{ uiWord }}</b></p>
                <input v-model="userInput" class="trainer-app__input"/>
              </div>
              <div v-if="currentMode === 'plural'">
                <p>{{ t('sessionLabels.pluralFor') }} <b>{{ currentWord.de }}</b>:</p>
                <input v-model="userInput" class="trainer-app__input"/>
              </div>
              <div v-if="currentMode === 'audio'">
                <p>{{ t('sessionLabels.audioFor') }}:</p>
                <button @click="speak(currentWord.de)" class="audio-btn">
                  <img class="megaphones__icon" src="../../assets/images/megaphone.svg" alt="">
                  <span> {{ t('sessionLabels.listen')}}</span>
                </button>
                <input v-model="userInput" class="trainer-app__input"/>
              </div>
            </div>
            <div v-if="currentMode === 'plural' || currentMode === 'wordArticle'" class="german__letters">
              <button @click="addGErmanLetters(letter)" class="german__letters-item" v-for="(letter, index) in germanLetters" :key="index">
                {{ letter}}
              </button>
            </div>
            <div v-if="result" class="answer-result" :class="result">
              <span v-if="result === 'correct'">✔ </span>
              <span v-if="result === 'wrong'">✖ </span>
              <span v-if="currentMode === 'article'">{{ t('result.correctAnswer') }}: {{ currentWord.article }}</span>
              <span v-if="currentMode === 'letters' || currentMode === 'audio'">{{ t('result.correctAnswer') }}: {{
                  currentWord.de
                }}</span>
              <span v-if="currentMode === 'wordArticle'">{{ t('result.correct') }}: {{currentWord.article}} {{ currentWord.de }} </span>
              <span v-if="currentMode === 'plural'">{{ t('result.correct') }}: {{ currentWord.plural }}</span>
            </div>
          </div>
          <button
              class="btn"
              @click="!result ? checkAnswer() : nextStep()"
              :disabled="!result && (isChecking || !userInput)"
          >
            {{ !result ? t('sessionPage.btnCheck') : t('sessionPage.continue') }}
          </button>
        </div>
        <div v-else class="finish-block">
          <h2 class="finish-block__title">{{ t('sessionLabels.end')}}</h2>
          <div class="finish-block__actions">
            <button class="btn" @click="restartAll">{{ t('sessionLabels.again')}}</button>
            <button v-if="wrongWords.length" class="btn btn--secondary" :disabled="wrongWords.length === 0"
                    @click="repeatMistakes">
              {{ t('sessionLabels.mistakes')}} ({{ wrongWords.length }})
            </button>
            <router-link class="btn btn--secondary" to="/articles">{{ t('sessionLabels.back')}}</router-link>
          </div>
        </div>
      </div>
      <div class="trainer-app__ledge">
        <div class="duster"></div>
        <div class="chalk"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {userlangStore} from '../../store/learningStore.js'
import {getSpeechAudio} from '../../utils/googleTTS.js'
import {nameMap, nameMode} from '../../utils/nameMap.js'
import { playWrong, playCorrect, unlockAudioByUserGesture } from '../../utils/soundManager.js'
import { useSeoMeta } from '#imports'

useSeoMeta({
  robots: 'noindex, nofollow'
})

const {t, locale} = useI18n()
const wrongWords = ref([])
const allWords = ref([])
const isReview = ref(false)

const store = userlangStore()
const route = useRoute()
const router = useRouter()
const isReady = ref(false)
const selectedModes = ref([])
const sessionWords = ref([])
const finished = ref(false)
const userInput = ref('')
const result = ref('')
const topicTitle = ref('')
const usedLetters = ref([])
const isChecking = ref(false)
const currentModeIndex = computed(() => store.currentModeIndex)
const currentMode = computed(() => selectedModes.value[currentModeIndex.value])
const currentWord = computed(() => store.selectedWords[store.currentIndex])
const totalWords = computed(() => store.selectedWords.length)
const currentLang = computed(() => locale.value);
const translatedTopic = computed(() => t(nameMap[topicTitle.value]))
const isSpeaking = ref(false)
const germanLetters = ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß'];

const localeToKeyMap = {
  ru: 'ru', 'ru-RU': 'ru',
  en: 'en', 'en-US': 'en', 'en-GB': 'en',
  tr: 'tr', 'tr-TR': 'tr',
  pl: 'pl', 'pl-PL': 'pl',
  uk: 'uk', 'uk-UA': 'uk',
  es: 'es', 'es-ES': 'es',
  ar: 'ar', 'ar-AR': 'ar',
  uz: 'uz', 'uz-UZ': 'uz',
  de: 'de', 'de-DE': 'de', 'de-AT': 'de', 'de-CH': 'de'
}

const currentLangKey = computed(() => {
  const lc = String(locale.value || '').trim()
  return localeToKeyMap[lc] || localeToKeyMap[lc.split('-')[0]] || 'en'
})

const uiWord = computed(() => {
  const w = currentWord.value || {}
  return (
      w[currentLangKey.value] ??
      w.en ?? w.ru ?? w.uk ?? w.tr ?? w.pl ?? w.de ?? ''
  )
})

const goBack = () => {
  router.back()
}

function modeLabel(mode) {
  return nameMode[mode] || mode
}

const shuffledLetters = computed(() => {
  if (!currentWord.value) return []
  return currentWord.value.de.split('').sort(() => Math.random() - 0.5)
})

function addLetter(letter, idx) {
  if (usedLetters.value[idx]) return
  userInput.value += letter
  usedLetters.value[idx] = true
}

const addGErmanLetters = (letter)  => {
  userInput.value += letter
}

function speak(text) {
  if (isSpeaking.value) return
  isSpeaking.value = true
  getSpeechAudio(text,)
  setTimeout(() => {
    isSpeaking.value = false
  }, 3000)
}


function clearLetters() {
  userInput.value = ''
  usedLetters.value = []
}

function normalize(text) {
  return (text || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

async function checkAnswer() {
  if (!currentWord.value || isChecking.value) return;
  isChecking.value = true;

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
    // обычный режим — сохраняем
    await store.markProgress(currentWord.value, currentMode.value, ok);
    if (ok) {
      await store.markAsLearned(currentWord.value, selectedModes.value);
    } else {
      if (!wrongWords.value.find(w => w.de === currentWord.value.de)) {
        wrongWords.value.push(currentWord.value);
      }
      await store.addWrongAnswers(currentWord.value);
    }
  } else {
    // повтор — ничего не сохраняем; локально собираем ошибки, если нужно
    if (!ok && !wrongWords.value.find(w => w.de === currentWord.value.de)) {
      wrongWords.value.push(currentWord.value);
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
  }
}

function restartAll() {
  isReview.value = true
  if (!Array.isArray(selectedModes.value) || selectedModes.value.length === 0 || selectedModes.value.every(m => !m)) {
    selectedModes.value = ['article', 'letters', 'wordArticle', 'plural', 'audio']
  }
  let base = Array.isArray(allWords.value) ? allWords.value : []
  if (!base.length) {
    const topic = String(topicTitle.value || route.query.topic || '').trim()
    const pool = Array.isArray(store.words) ? store.words : []
    base = topic ? pool.filter(w => w.topic === topic) : pool.slice()
  }
  if (!base.length) {
    finished.value = true
    return
  }
  store.selectedWords = [...base]
  store.currentIndex = 0
  store.currentModeIndex = 0
  finished.value = false
  userInput.value = ''
  usedLetters.value = []
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
  usedLetters.value = []
  result.value = ''
  wrongWords.value = []
}

onMounted(async () => {
  const captureOpts = { capture: true };
  const unlockOnce = () => {
    unlockAudioByUserGesture();
    window.removeEventListener('pointerdown', unlockOnce, captureOpts);
    window.removeEventListener('keydown', unlockOnce, captureOpts);
  };
  window.addEventListener('pointerdown', unlockOnce, captureOpts);
  window.addEventListener('keydown', unlockOnce, captureOpts);
  await store.loadFromFirebase()
  store.syncSelectedWordsProgress()
  const mode = route.query.mode
  selectedModes.value = Array.isArray(mode) ? mode : [mode].filter(Boolean)
  if (selectedModes.value.length === 0) {
    selectedModes.value = ['article', 'letters', 'wordArticle', 'plural', 'audio']
  }
  isReview.value = ['1','true','yes','repeat','review','practice']
      .includes(String(route.query.review || route.query.repeat || '').toLowerCase())

  allWords.value = [...store.selectedWords]
  if (isReview.value) {
    store.selectedWords = [...allWords.value]
  } else {
    sessionWords.value = store.selectedWords.filter(w => !selectedModes.value.every(m => w.progress?.[m] === true))
    store.selectedWords = sessionWords.value.length ? [...sessionWords.value] : [...allWords.value]
    if (sessionWords.value.length === 0) {
      isReview.value = true
    }
  }

  if (store.currentIndex >= store.selectedWords.length) store.currentIndex = 0
  if (store.currentModeIndex >= selectedModes.value.length) store.currentModeIndex = 0
  if (route.query.topic) topicTitle.value = route.query.topic

  isReady.value = true
})


onBeforeUnmount(() => {
  window.removeEventListener('pointerdown', unlockAudioByUserGesture, { capture: true })
  window.removeEventListener('keydown', unlockAudioByUserGesture, { capture: true })
})


watch(userInput, (newVal, oldVal) => {
  if (currentMode.value !== 'letters') return
  const removed = oldVal.length - newVal.length
  if (removed > 0) {
    usedLetters.value = []
  }
})

</script>

<style scoped>
.session-page {
  font-family: "Nunito", sans-serif;
  background-color: #f0ebe5;
  background-image: repeating-linear-gradient(90deg, #e9e2db, #e9e2db 20px, #f0ebe5 20px, #f0ebe5 40px);
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}


.exit-sign {
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: all;
  position: absolute;
  top: 3vh;
  left: 3vw;
  z-index: 20;
  background-color: #2E7D32;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Nunito', sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 8px 16px;
  border: 3px solid #f0ebe5;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 0 0 15px rgba(46, 204, 113, 0.6), 0 0 25px rgba(46, 204, 113, 0.5);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  text-decoration: none;
}

.exit-sign:hover {
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.9), 0 0 25px rgba(46, 204, 113, 0.8), 0 0 40px rgba(46, 204, 113, 0.7);
  color: #ffffff;
}

.exit-sign-icon {
  font-size: 1.2rem;
  filter: invert(1);
}

.exit-sign-text {
  padding-left: 10px;
}

.trainer-app {
  background: #5D4037;
  padding: 20px;
  padding-bottom: 45px;
  border-radius: 15px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 660px;
  position: relative;
}

.trainer-app__board {
  background: #2c3e50;
  border: 10px solid #34495e;
  border-radius: 5px;
  padding: 2rem 2.5rem;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);
  color: #ecf0f1;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.trainer-app__ledge {
  position: absolute;
  bottom: 10px;
  left: 5%;
  width: 90%;
  height: 25px;
  background-color: #6d4c41;
  border-radius: 3px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}

.duster {
  position: absolute;
  left: 20px;
  bottom: 5px;
  width: 80px;
  height: 40px;
  background-color: #a1887f;
  border-top: 10px solid #5d4037;
  border-radius: 4px;
}

.chalk {
  position: absolute;
  right: 30px;
  bottom: 8px;
  width: 50px;
  height: 10px;
  background-color: #f1c40f;
  border-radius: 2px;
  transform: rotate(-5deg);
}

.session__theme {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
  border-bottom: 1px dashed rgba(236, 240, 241, 0.3);
  padding-bottom: 1rem;
  margin-bottom: 0.5rem;
}

.session__theme-t {
  font-size: 1.2rem;
  color: #bdc3c7;
}

.session__topic {
  font-family: "Nunito", sans-serif;
  font-size: 2.5rem;
  color: #fff;
}

.progress-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.word-block {
  min-height: 250px;
}

.word-question {
  font-size: 1.2rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
}

.word-question b {
  color: #fff;
  font-size: 1.3rem;
}

.mode-exercise p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #ecf0f1;
}

.trainer-app__input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1.2rem;
  border: 2px dashed rgba(236, 240, 241, 0.5);
  background: transparent;
  color: #ecf0f1;
  border-radius: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.trainer-app__input:focus {
  outline: none;
  border-color: #f1c40f;
  border-style: solid;
}

.trainer-app__input[readonly] {
  cursor: default;
  border-style: solid;
  border-color: rgba(236, 240, 241, 0.4);
}

.letters {
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.letters button {
  font-family: "Nunito", sans-serif;
  font-size: 1.5rem;
  width: 45px;
  height: 45px;
  background: transparent;
  color: #f1c40f;
  border-radius: 8px;
  border: 2px solid #f1c40f;
  cursor: pointer;
  transition: all 0.2s;
}

.letters button:hover:not(:disabled) {
  background: #f1c40f;
  color: #2c3e50;
}

.letters button:disabled {
  background: transparent;
  border-color: #7f8c8d;
  color: #7f8c8d;
  cursor: not-allowed;
  opacity: 0.7;
}

.audio-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  color: #ecf0f1;
  border: 2px solid #95a5a6;
  border-radius: 8px;
  padding: 7px 18px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

.audio-btn:hover {
  background: #95a5a6;
  color: #2c3e50;
}

.megaphones__icon {
  width: 20px;
  filter: invert(1);
}

.answer-result {
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 0.5rem;
  min-height: 2rem;
}

.answer-result.correct {
  color: #2ecc71;
}

.answer-result.wrong {
  color: #e74c3c;
}

.btn {
  padding: 12px 24px;
  font-family: "Nunito", sans-serif;
  font-size: 1.5rem;
  color: #f1c40f;
  background-color: transparent;
  border: 3px solid #f1c40f;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  text-decoration: none;
  display: inline-block;
  width: 100%;
  text-align: center;
}

.btn:hover:not(:disabled) {
  background-color: #f1c40f;
  color: #2c3e50;
  transform: translateY(-2px);
}

.btn:disabled {
  border-color: #7f8c8d;
  color: #7f8c8d;
  cursor: not-allowed;
  background: transparent;
  transform: none;
}

.finish-block {
  text-align: center;
  padding: 2rem 0;
}

.finish-block__title {
  font-family: "Nunito", sans-serif;
  font-size: 3rem;
  color: #fff;
}

.finish-block__actions {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn--secondary {
  border-color: #95a5a6;
  color: #95a5a6;
}

.btn--secondary:hover:not(:disabled) {
  background-color: #95a5a6;
  color: #2c3e50;
}

.letters-clear {
  align-self: flex-start;
  margin: 0.25rem 0 0.75rem;
  padding: 6px 14px;
  font-family: "Nunito", sans-serif;
  font-size: 1rem;
  background: transparent;
  color: #95a5a6;
  border: 2px solid #95a5a6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.letters-clear:hover {
  background: #95a5a6;
  color: #2c3e50;
}

.german__letters {
  display: flex;
  gap: 5px;
  margin: 8px 0;
}

.german__letters-item {
  padding: 6px 9px;
  border: 1px solid #95a5a6;
  background: whitesmoke;
  font-size: 17px;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  border-radius: 7px;
}

@media (max-width: 768px) {
  .session-page {
    padding: 0;
  }

  .exit-sign {
    display: none;
  }

  .trainer-app {
    border-radius: 0;
    border: none;
    min-height: 100vh;
  }

  .trainer-app__board {
    min-height: calc(100vh - 40px - 45px);
    padding: 1.5rem 1rem;
  }

  .session__topic {
    font-size: 2rem;
  }

  .progress-line {
    flex-direction: column;
    gap: 0.2rem;
    align-items: flex-start;
  }
}
</style>