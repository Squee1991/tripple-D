<template>
  <div class="quiz-app"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd"
  >
    <transition name="toast-fade">
      <VHeadsUp v-if="showEmptyWarning" :text="t('dictation.empty')"/>
    </transition>
    <div class="mini-salute-container" v-if="miniConfettiParticles.length > 0">
      <div v-for="particle in miniConfettiParticles" :key="particle.id" class="mini-confetti-piece"
           :style="{
             left: particle.left + '%',
             backgroundColor: particle.color,
             animationDelay: particle.delay + 's',
             animationDuration: particle.duration + 's',
             width: particle.width + 'px',
             height: particle.height + 'px'
           }">
      </div>
    </div>
    <div class="quiz-app-container">
      <div v-if="!currentItem" class="quiz-screen">
        <p class="loading-text">{{ t('dailyPanel.loading') }}</p>
      </div>
      <div v-else class="quiz-screen">
        <header class="study-nav">
          <button @click="handleExitTrigger" class="btn-icon-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div class="study-nav-progress">
            <div class="progress_exp-bar">
              <div class="progress__bar" :style="{ width: progressPercentage + '%' }">
                <div class="glare"></div>
              </div>
            </div>
          </div>
          <span class="study-nav-counter">{{ currentIndex + 1 }}/{{ sessionItems.length }}</span>
        </header>
        <main class="study-main">
          <article class="quest-card">
            <section class="quest-card-audio">
              <div v-if="!result" class="dictation-listen">
                <span v-if="currentItem.review" class="dictation-review">🔁 {{ t('dictation.review') }}</span>
                <div class="dictation-players">
                  <button type="button" class="dictation-play" :class="{ 'is-playing': isSpeaking }"
                          data-track="dictation_play" @click="speak(1)">
                    <img :src="SoundIcon" alt="">
                  </button>
                  <button type="button" class="dictation-play dictation-play--slow"
                          :class="{ 'is-playing': isSpeaking }" :aria-label="t('dictation.slow')"
                          data-track="dictation_play_slow" @click="speak(SLOW_RATE)">
                    🐢
                  </button>
                </div>
                <p class="quest-card-instruction">{{ t('dictation.listen') }}</p>
                <p class="dictation-words-hint">{{ t('dictation.wordsCount', { count: wordCount }) }}</p>
              </div>
              <transition name="quiz-expand">
                <div v-if="result" class="dictation-result">
                  <div class="dictation-answer">
                    <span v-for="(word, index) in result.words" :key="index"
                          :class="['dictation-word', 'dictation-word--' + word.mark]">{{ word.text }}</span>
                  </div>
                  <p class="dictation-translation">{{ translation }}</p>
                  <SoundBtn :text="currentItem.word" class="dictation-replay"/>
                  <p v-if="result.status !== 'success' && submitted" class="dictation-yours">
                    {{ t('dictation.yours') }}: <s>{{ submitted }}</s>
                  </p>
                </div>
              </transition>
            </section>

            <div class="dictation-input-wrap">
              <textarea
                  ref="inputRef"
                  v-model="input"
                  class="dictation-input"
                  :class="result ? 'is-' + result.status : ''"
                  :placeholder="t('dictation.placeholder')"
                  :readonly="!!result"
                  lang="de"
                  rows="2"
                  autocapitalize="off"
                  autocomplete="off"
                  autocorrect="off"
                  spellcheck="false"
                  @keydown.enter.prevent="handleEnter"
              ></textarea>
              <div v-if="!result" class="dictation-letters">
                <button
                    v-for="letter in GERMAN_LETTERS"
                    :key="letter"
                    type="button"
                    class="dictation-letter"
                    @mousedown.prevent
                    @click="insertLetter(letter)"
                >{{ letter }}</button>
              </div>
            </div>

            <div v-if="feedback" :class="['quest-feedback', feedback.class]">
              <p class="quest-feedback-text">{{ feedback.text }}</p>
            </div>
            <footer class="quest-card-footer">
              <button v-if="!result" @click="checkAnswer" class="quiz-btn quiz-btn-primary"
                      data-track="dictation_check">
                {{ t('imageDescription.check') }}
              </button>
              <div v-else class="quest-card-actions">
                <button v-if="!isLastItem" @click="goToNextItem" class="quiz-btn quiz-btn-next">
                  {{ t('imageDescription.further') }}
                </button>
                <button v-else @click="finishAndSave" class="quiz-btn quiz-btn-finish">
                  {{ t('imageDescription.finish') }}
                </button>
              </div>
              <button v-if="!result && canSkipItem" @click="skipCurrentItem" class="quiz-btn quiz-btn-skip">
                {{ t('imageDescription.skip') }}
              </button>
            </footer>
          </article>
        </main>
      </div>
      <ExitSessionModal
          :animation-data="HedgehogLeaveSession"
          :show="activeModal === 'exit'"
          @update:show="updateActiveModal"
          @cancel="activeModal = null"
          @confirm="confirmExit"
      />
      <VQuestResultScreen
          :finished="activeModal === 'finish'"
          :has-mistakes="sessionStats.wrong > 0 || sessionStats.partial > 0"
          :previously-cleared="previouslyCleared"
          :anim-step="animStep"
          :display-xp="displayXp"
          :display-coins="displayCoins"
          :confetti-particles="confettiParticles"
          :has-next-quest="!!nextPart"
          @next="showInterstitial(goNextPart)"
          @themes="showInterstitial(goThemes)"
          @retry-mistakes="retryMistakes"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, onUnmounted, nextTick} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {storeToRefs} from 'pinia'
import {useDictationStore} from '~/store/dictationStore.js'
import {userlangStore} from '~/store/learningStore.js'
import SoundBtn from '~/src/components/soundBtn.vue'
import ExitSessionModal from '~/src/components/V-stopSessionModal.vue'
import VQuestResultScreen from '~/src/components/V-QuestResultScreen.vue'
import VHeadsUp from '~/src/components/V-headsUp.vue'
import {useSwipeBack} from '~/composables/useSwipeBack.js'
import {useQuestAnimations} from '~/composables/useQuestAnimations.js'
import {playCorrect, playWrong, playLevelCompleted, unlockAudioByUserGesture} from '~/utils/soundManager.js'
import {getSpeechAudio, stopSpeech} from '~/utils/googleTTS.js'
import {checkDictation, GERMAN_LETTERS} from '~/utils/dictation.js'
import {showInterstitial, preloadInterstitial} from '~/utils/admob.js'
import SoundIcon from '~/assets/images/SoundIcon.svg'
import HedgehogLeaveSession from '~/assets/animation/hedgehog_leave_session.json'

const {t, locale} = useI18n()
const router = useRouter()
const route = useRoute()
const store = useDictationStore()
const langStore = userlangStore()
const {currentRegionId, currentQuestId, userProgress} = storeToRefs(store)
const {$track} = useNuxtApp()

const SLOW_RATE = 0.7

// с земли диктант открывается веткой «Письмо» — туда же и возвращаемся
const exitPath = computed(() => {
  const back = String(route.query.back || '')
  return back.startsWith('/location/') ? back : '/'
})

const parts = ref([])
const currentPart = ref(null)
const sessionItems = ref([])
const currentIndex = ref(0)
const input = ref('')
const submitted = ref('')
const results = ref({})
const inputRef = ref(null)
const isSpeaking = ref(false)
const showEmptyWarning = ref(false)
const activeModal = ref(null)
const previouslyCleared = ref(false)
const consecutiveCorrectCount = ref(0)
const sessionStartTime = ref(0)
const sessionStats = ref({correct: 0, partial: 0, wrong: 0, passed: false})

const animQuestStore = reactive({
  hasMistakes: false,
  quest: {rewards: {xp: 5, points: 5}}
})

const shouldShowResultScreen = computed(() => activeModal.value === 'finish')

const {
  animStep,
  displayCoins,
  displayXp,
  confettiParticles,
  miniConfettiParticles,
  spawnMiniConfetti,
  resetAnimations
} = useQuestAnimations(animQuestStore, previouslyCleared, shouldShowResultScreen)

const {handleTouchStart, handleTouchMove, handleTouchEnd} = useSwipeBack(() => {
  handleExitTrigger()
}, {
  ignoreSelector: '.dictation-input, .dictation-letters, .quiz-btn, .dictation-play'
})

const currentItem = computed(() => sessionItems.value[currentIndex.value])
const result = computed(() => results.value[currentItem.value?.id] || null)
const isLastItem = computed(() => currentIndex.value >= sessionItems.value.length - 1)
const wordCount = computed(() => currentItem.value?.word.split(/\s+/).filter(Boolean).length || 0)
const canSkipItem = computed(() => userProgress.value[currentRegionId.value]?.[currentItem.value?.id] === 'success')

const nextPart = computed(() => {
  const index = parts.value.findIndex(part => part.id === currentPart.value?.id)
  return index >= 0 ? parts.value[index + 1] || null : null
})

const translation = computed(() => {
  const item = currentItem.value
  if (!item) return ''
  // у предложений из «собери предложение» перевод — в тексте задания после двоеточия
  if (item.translationKey) return t(item.translationKey).replace(/^[^:]*:\s*/, '')
  const lang = locale.value.split('-')[0]
  return item[`translation-${lang}`] || item['translation-en'] || ''
})

const progressPercentage = computed(() => {
  if (!sessionItems.value.length) return 0
  if (isLastItem.value && result.value) return 100
  return (currentIndex.value / sessionItems.value.length) * 100
})

const feedback = computed(() => {
  if (!result.value) return null
  if (result.value.status === 'success') return {class: 'is-success', text: t('dictation.success')}
  if (result.value.status === 'partial') return {class: 'is-warning', text: t('dictation.marks')}
  return {class: 'is-wrong', text: t('dictation.wrong')}
})

async function speak(rate) {
  if (isSpeaking.value || !currentItem.value) return
  unlockAudioByUserGesture()
  isSpeaking.value = true
  await getSpeechAudio(currentItem.value.word, 'de-DE', rate)
  isSpeaking.value = false
}

function insertLetter(letter) {
  const field = inputRef.value
  if (!field) {
    input.value += letter
    return
  }
  const start = field.selectionStart ?? input.value.length
  const end = field.selectionEnd ?? input.value.length
  input.value = input.value.slice(0, start) + letter + input.value.slice(end)
  nextTick(() => {
    field.focus()
    field.setSelectionRange(start + letter.length, start + letter.length)
  })
}

function handleEnter() {
  if (!result.value) checkAnswer()
  else if (!isLastItem.value) goToNextItem()
  else finishAndSave()
}

function checkAnswer() {
  if (!input.value.trim()) {
    showEmptyWarning.value = true
    setTimeout(() => {
      showEmptyWarning.value = false
    }, 2000)
    return
  }

  const item = currentItem.value
  const checked = checkDictation(input.value, item.word)
  submitted.value = input.value.trim()
  results.value[item.id] = checked

  if (checked.status === 'success') {
    playCorrect()
    consecutiveCorrectCount.value++
    if (consecutiveCorrectCount.value === 5) {
      spawnMiniConfetti()
      consecutiveCorrectCount.value = 0
    }
  } else {
    playWrong()
    consecutiveCorrectCount.value = 0
  }

  $track('dictation_answered', {
    region_id: currentRegionId.value,
    quest_id: currentPart.value?.id,
    status: checked.status,
    item_index: currentIndex.value
  })
}

function goToNextItem() {
  stopSpeech()
  currentIndex.value++
  input.value = ''
  submitted.value = ''
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function skipCurrentItem() {
  if (isLastItem.value) finishAndSave()
  else goToNextItem()
}

async function finishAndSave() {
  stopSpeech()
  const finalResults = {}
  let correct = 0
  let partial = 0
  let wrong = 0

  sessionItems.value.forEach(item => {
    const status = results.value[item.id]?.status
    if (!status) return
    finalResults[item.id] = status
    if (status === 'success') correct++
    else if (status === 'partial') partial++
    else wrong++
  })

  const passed = correct >= Math.ceil(sessionItems.value.length * 0.8)
  sessionStats.value = {correct, partial, wrong, passed}
  animQuestStore.hasMistakes = wrong > 0 || partial > 0

  await store.saveProgress(currentRegionId.value, finalResults)

  if (passed) {
    langStore.exp += 5
    langStore.handleLeveling()
    await langStore.addPoints(5)
    playLevelCompleted()
  }

  $track('dictation_session_finished', {
    region_id: currentRegionId.value,
    quest_id: currentPart.value?.id,
    passed,
    correct_count: correct,
    duration_seconds: Math.round((Date.now() - sessionStartTime.value) / 1000)
  })

  activeModal.value = 'finish'
}

function handleExitTrigger() {
  if (currentIndex.value > 0 || result.value) {
    activeModal.value = 'exit'
  } else {
    stopSpeech()
    router.push(exitPath.value)
  }
}

function confirmExit() {
  activeModal.value = null
  $track('dictation_session_abandoned', {
    region_id: currentRegionId.value,
    quest_id: currentPart.value?.id,
    completed_items: currentIndex.value,
    total_items: sessionItems.value.length
  })
  stopSpeech()
  router.push(exitPath.value)
}

function updateActiveModal(isActive) {
  if (!isActive) activeModal.value = null
}

function goNextPart() {
  activeModal.value = null
  if (!nextPart.value) return goThemes()
  store.setCurrent(currentRegionId.value, nextPart.value.id)
  initializeSession()
}

function goThemes() {
  activeModal.value = null
  router.push(exitPath.value)
}

function retryMistakes() {
  activeModal.value = null
  initializeSession()
}

function initializeSession() {
  const part = parts.value.find(p => p.id === currentQuestId.value)
  if (!part) return router.push(exitPath.value)
  currentPart.value = part

  const progress = userProgress.value[currentRegionId.value] || {}
  const unfinished = part.items.filter(item => progress[item.id] !== 'success')
  previouslyCleared.value = unfinished.length === 0
  // сначала то, что ещё не написано без ошибок; если всё написано — вся часть заново
  const pool = unfinished.length ? unfinished : part.items

  sessionItems.value = [...pool].sort(() => Math.random() - 0.5)
  currentIndex.value = 0
  results.value = {}
  input.value = ''
  submitted.value = ''
  consecutiveCorrectCount.value = 0
  resetAnimations()
  sessionStartTime.value = Date.now()

  $track('dictation_session_started', {
    region_id: currentRegionId.value,
    quest_id: part.id,
    total_items: sessionItems.value.length
  })

  // фраза звучит только по нажатию кнопки, без автозапуска
}

onMounted(async () => {
  if (!currentRegionId.value || !currentQuestId.value) {
    return router.push(exitPath.value)
  }
  parts.value = await store.fetchRegion(currentRegionId.value)
  await store.loadUserProgress()
  // реклама не перед диктантом, а при выходе с экрана результатов
  preloadInterstitial()
  initializeSession()
})

onUnmounted(stopSpeech)
</script>

<style scoped>
.quiz-app {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
  color: #1e272e;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

.quiz-app-container {
  padding: 5px 10px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.quiz-screen {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.study-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.study-nav-progress {
  display: flex;
  align-items: center;
  width: 100%;
}

.progress_exp-bar {
  width: 100%;
  height: 27px;
  background: #e8eae5;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background: #4ade80;
  transition: width .4s;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.glare {
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 4px
}

.study-nav-counter {
  font-weight: 900;
  font-size: 18px;
  color: var(--titleColor);
}

.btn-icon-back {
  background: #f5f5f6;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 14px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  flex-shrink: 0;
  padding: 0;
}

.btn-icon-back:active {
  transform: translate(2px, 3px);
  box-shadow: 0px 0px 0px #1e272e;
}

.study-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.quest-card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  border-radius: 24px;
  padding: 10px;
  flex: 1;
  margin-bottom: 8px;
  min-height: 0;
}

.quest-card-audio {
  flex: 1;
  background: #f1f1f1;
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 2px 0 var(--tabsSlideBorderColor);
  overflow-y: auto;
  min-height: 0;
}

.dictation-listen {
  margin: auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.dictation-players {
  display: flex;
  align-items: flex-end;
  gap: 14px;
}

.dictation-review {
  padding: 3px 12px;
  border-radius: 20px;
  background: #ffeb7f;
  border: 2px solid #1e272e;
  font-size: 13px;
  font-weight: 900;
  color: #1e272e;
}

.dictation-play {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 64px;
  border: none;
  border-radius: 35%;
  background: #48dbfb;
  box-shadow: 0 6px 0 #2297b0;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.dictation-play img {
  width: 40px;
}

.dictation-play:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #2297b0;
}

.dictation-play--slow {
  width: 56px;
  height: 48px;
  font-size: 26px;
  background: #9dffbb;
  box-shadow: 0 5px 0 #49b36a;
}

.dictation-play--slow:active {
  box-shadow: 0 1px 0 #49b36a;
}

.dictation-play.is-playing {
  animation: dictation-pulse 1s ease-in-out infinite;
}

.quest-card-instruction {
  font-weight: 900;
  font-size: 16px;
  color: #1e272e;
  padding: 6px 12px 0;
}

.dictation-words-hint {
  font-size: 13px;
  font-weight: 800;
  color: #718093;
}

.dictation-result {
  margin: auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 6px;
}

.dictation-answer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.dictation-word {
  padding: 4px 10px;
  border-radius: 12px;
  border: 2px solid #1e272e;
  font-size: 18px;
  font-weight: 900;
  box-shadow: 0 3px 0 #1e272e;
}

.dictation-word--ok {
  background: #b8e994;
}

.dictation-word--marks {
  background: #f6e58d;
}

.dictation-word--wrong {
  background: #ff7979;
}

.dictation-translation {
  font-size: 15px;
  font-weight: 800;
  color: #57606f;
}

.dictation-replay {
  width: 44px;
}

.dictation-yours {
  font-size: 14px;
  font-weight: 700;
  color: #718093;
  word-break: break-word;
}

.dictation-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.dictation-input {
  width: 100%;
  box-sizing: border-box;
  resize: none;
  padding: 10px 14px;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 3px 0 var(--tabsSlideBorderColor);
  border-radius: 16px;
  background: #ffffff;
  color: #1e272e;
  font-family: 'Nunito', sans-serif;
  font-size: 18px;
  font-weight: 800;
  outline: none;
}

.dictation-input:focus {
  border-color: #1cb0f6;
}

.dictation-input.is-success {
  background: #e6f7d9;
}

.dictation-input.is-partial {
  background: #fdf6d3;
}

.dictation-input.is-wrong {
  background: #ffe1e1;
}

.dictation-letters {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 5px;
}

.dictation-letter {
  height: 40px;
  padding: 0;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 3px 0 var(--tabsSlideBorderColor);
  border-radius: 10px;
  background: #fff;
  color: #1e272e;
  font-family: 'Nunito', sans-serif;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  -webkit-tap-highlight-color: transparent;
}

.dictation-letter:active {
  transform: translateY(3px);
  box-shadow: 0 0 0 var(--tabsSlideBorderColor);
  background: #c7ecee;
}

.quest-feedback {
  text-align: center;
  margin-bottom: 8px;
  padding: 6px;
  border-radius: 16px;
  background: #ffffff;
}

.quest-feedback.is-success {
  background: #b8e994;
}

.quest-feedback.is-warning {
  background: #f6e58d;
}

.quest-feedback.is-wrong {
  background: #ff7979;
}

.quest-feedback-text {
  font-weight: 900;
  font-size: 15px;
}

.quest-card-footer {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.quest-card-actions {
  width: 100%;
}

.quiz-btn {
  width: 100%;
  padding: 10px;
  border-radius: 50px;
  font-weight: 900;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.quiz-btn:active:not(:disabled) {
  transform: translateY(2px);
}

.quiz-btn-primary {
  background-color: #58cc02 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 6px 0 #46a302 !important;
}

.quiz-btn-next {
  background-color: #1cb0f6 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 6px 0 #1899d6 !important;
}

.quiz-btn-finish {
  background-color: #ffc800 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 6px 0 #e5a400 !important;
}

.quiz-btn-skip {
  background-color: #ffffff !important;
  color: #afafaf !important;
  border: 2px solid #e5e5e5 !important;
  box-shadow: 0 2px 0 #e5e5e5 !important;
}

.loading-text {
  text-align: center;
  font-weight: 900;
  font-size: 18px;
  margin-top: 40px;
  color: var(--titleColor);
}

.quiz-expand-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.quiz-expand-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-100%)
}

.mini-salute-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 99999;
}

.mini-confetti-piece {
  position: absolute;
  top: -30px;
  opacity: 0;
  border-radius: 3px;
  animation: miniConfettiFall linear forwards;
  will-change: transform, opacity;
}

@keyframes miniConfettiFall {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg) scale(0.6);
    opacity: 0;
  }
}

@keyframes dictation-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.06);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dictation-play.is-playing {
    animation: none;
  }
}

@media (max-width: 360px) {
  .dictation-letter {
    height: 36px;
    font-size: 16px;
  }
}
</style>
