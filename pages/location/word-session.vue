<template>
  <div
      class="vocab-container"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
  >
    <template v-if="viewMode === 'list'">
      <header class="vocab-header list-header">
        <button class="btn-icon-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h2 class="list-title">{{ t('landWordsSession.words') }}</h2>
      </header>
      <main class="vocab-main word-list-main">
        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
        </div>
        <div v-else-if="errorMessage" class="error-state">
          {{ errorMessage }}
        </div>
        <template v-else-if="vocabulary.length">
          <div v-for="(item, index) in vocabulary" :key="index" class="word-list-item">
            <SoundBtn :text="item.word" class="list-sound-btn"/>
            <div class="word-details">
              <span class="word-german-list">{{ item.word }}</span>
              <span class="word-translation-list">
                {{ getTranslation(item) }}
              </span>
              <button v-if="item.isVerb" class="btn-verb-forms" @click="goToVerbForms(item.verbKey || item.word)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                {{ t('landWordsSession.verbs') }}
              </button>
            </div>
            <button v-if="getTip(item)" class="btn-tip" @click="openTipModal(getTip(item))">💡</button>
          </div>
        </template>
        <div v-else class="empty-state">{{ t('landWordsSession.error') }}</div>
      </main>
      <footer class="vocab-footer" v-if="vocabulary.length">
        <button class="btn-primary" @click="startPractice">{{ t('locationWordSession.learnWords') }}</button>
        <button class="btn-secondary" style="margin-top: 12px;" @click="startQuest">{{ t('landWordsSession.toQuest') }}</button>
      </footer>
    </template>
    <template v-else-if="viewMode === 'practice'">
      <header class="vocab-header" v-if="currentWord">
        <button class="btn-icon-back" @click="handleBackClick">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="progress_exp-bar">
          <div class="progress__bar" :style="{ width: `${progressPercentage}%` }">
            <div class="glare"></div>
          </div>
        </div>
      </header>
      <main class="vocab-main" v-if="currentWord">
        <div class="flashcard" :class="{'audio-only': currentWord.displayType === 'audio'}">
          <SoundBtn :text="currentWord.word" class="btn-sound-custom"/>
          <h2 v-if="currentWord.displayType === 'visual'" class="word-german">{{ currentWord.word }}</h2>
        </div>
        <div class="options-container">
          <button
              v-for="(option, index) in options"
              :key="index"
              class="option-btn"
              :class="{
              'correct': selectedAnswer && option === currentWord.correctTranslation,
              'incorrect': selectedAnswer === option && option !== currentWord.correctTranslation
            }"
              :disabled="selectedAnswer !== null"
              @click="checkAnswer(option)"
          >
            {{ option }}
          </button>
        </div>
      </main>
      <Teleport to="body">
        <Transition name="slide-up">
          <div v-if="currentStep >= totalSteps && totalSteps > 0" class="completion-overlay">
            <div class="completion-modal">
              <h2>{{ t('locationWordSession.excellent') }}</h2>
              <div class="completion-stats">
                <div class="stat correct">
                  <span class="stat-icon">✅</span>
                  <span class="stat-value">{{ correctAnswers }}</span>
                </div>
                <div class="stat incorrect">
                  <span class="stat-icon">❌</span>
                  <span class="stat-value">{{ incorrectAnswers }}</span>
                </div>
              </div>
              <div class="completion-overlay_icon">
                <img src="../../assets/images/GoodJobIcon.svg" alt="success_icon" @error="$event.target.style.display='none'">
              </div>
              <div class="completion-actions">
                <button class="btn-primary" @click="startQuest">{{ t('locationWordSession.begin') }}</button>
                <button class="btn-secondary" @click="restartLearning">{{ t('locationWordSession.repeat') }}</button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
      <footer class="vocab-footer" v-if="selectedAnswer && currentWord">
        <button class="btn-primary" @click="nextStep">
          {{ currentStep < totalSteps - 1 ? t('locationWordSession.further') : t('locationWordSession.finish') }}
        </button>
      </footer>
    </template>
    <Transition name="fade">
      <div v-if="isTipModalOpen" class="tip-overlay" @click.self="closeTipModal">
        <div class="tip-modal">
          <div class="tip-modal-header">
            <h3>{{ t('landWordsSession.grammar') }}</h3>
            <button class="close-btn" @click="closeTipModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="tip-modal-body">
            <p>{{ currentTipText }}</p>
          </div>
          <button class="btn-primary modal-ok-btn" @click="closeTipModal">{{ t('landWordsSession.got') }}</button>
        </div>
      </div>
    </Transition>

    <Teleport to="body">
      <VStopSessionModal
          v-model:show="showExitModal"
          @confirm="confirmExit"
          @cancel="cancelExit"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SoundBtn from '~/src/components/soundBtn.vue'
import VStopSessionModal from "~/src/components/V-stopSessionModal.vue"
import { useSwipeBack } from '~/composables/useSwipeBack.js'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const regionKey = route.query.region
const questId = route.query.questId

const viewMode = ref('list')
const vocabulary = ref([])
const isLoading = ref(true)
const errorMessage = ref("")

const isTipModalOpen = ref(false)
const currentTipText = ref("")

const learningSequence = ref([])
const currentStep = ref(0)
const options = ref([])
const selectedAnswer = ref(null)
const allTranslationsRef = ref([])

const correctAnswers = ref(0)
const incorrectAnswers = ref(0)

const showExitModal = ref(false)
const isConfirmedExit = ref(false)
let pendingRoute = null

const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeBack(() => {
  handleBackClick()
})

const totalSteps = computed(() => learningSequence.value.length)
const progressPercentage = computed(() => {
  if (totalSteps.value === 0) return 0
  return (currentStep.value / totalSteps.value) * 100
})
const currentWord = computed(() => {
  if (totalSteps.value === 0) return null
  const index = Math.min(currentStep.value, totalSteps.value - 1)
  return learningSequence.value[index]
})

onMounted(async () => {
  if (!regionKey || !questId) {
    errorMessage.value = ""
    isLoading.value = false
    return
  }
  try {
    const response = await fetch(`/quests/quests-${regionKey}.json`)
    if (!response.ok) {
      throw new Error("Error data.")
    }
    const data = await response.json()
    const quests = Array.isArray(data) ? data : (data.quests || [data])

    const currentQuest = quests.find(q => String(q.questId) === String(questId))

    if (currentQuest && currentQuest.vocabulary) {
      vocabulary.value = currentQuest.vocabulary
    }
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isLoading.value = false
  }
})

function getTranslation(item) {
  if (!item) return ''
  const currentLang = locale.value.split('-')[0]
  return item[`translation-${currentLang}`] || item['translation-en'] || ''
}

function goBack() {
  if (regionKey) {
    router.push(`/location/${regionKey}`)
  } else {
    router.back()
  }
}

function startQuest() {
  isConfirmedExit.value = true
  router.replace({
    path: `/location/quest-${questId}`,
    query: { region: regionKey }
  })
}

function getTip(item) {
  const currentLang = locale.value.split('-')[0]
  return item[`tip-${currentLang}`] || item['tip-ru'] || item['tip-en'] || null
}

function openTipModal(text) {
  currentTipText.value = text
  isTipModalOpen.value = true
}

function closeTipModal() {
  isTipModalOpen.value = false
  setTimeout(() => {
    currentTipText.value = ""
  }, 200)
}

function goToVerbForms(verbName) {
  router.push({
    path: '/verb-forms',
    query: { verb: verbName }
  })
}

function startPractice() {
  viewMode.value = 'practice'

  const allTranslations = vocabulary.value.map(v => getTranslation(v))
  allTranslationsRef.value = allTranslations

  const sequence = []
  vocabulary.value.forEach(v => {
    sequence.push({ ...v, displayType: 'visual', correctTranslation: getTranslation(v) })
    sequence.push({ ...v, displayType: 'audio', correctTranslation: getTranslation(v) })
  })

  learningSequence.value = sequence.sort(() => Math.random() - 0.5)
  currentStep.value = 0
  correctAnswers.value = 0
  incorrectAnswers.value = 0
  selectedAnswer.value = null

  if (learningSequence.value.length > 0) {
    generateOptions(allTranslations)
    setTimeout(() => {
      playSound(currentWord.value.word)
    }, 300)
  }
}

function generateOptions(allTranslations) {
  if (!currentWord.value) return
  const correct = currentWord.value.correctTranslation
  const incorrectOptions = allTranslations.filter(t => t !== correct)
  const randomIncorrect = incorrectOptions.sort(() => Math.random() - 0.5).slice(0, 2)

  while (randomIncorrect.length < 2) {
    randomIncorrect.push(t('locationWordSession.variation') + Math.random().toString(36).substring(7))
  }

  options.value = [correct, ...randomIncorrect].sort(() => Math.random() - 0.5)
}

function checkAnswer(selected) {
  selectedAnswer.value = selected
  if (selected === currentWord.value.correctTranslation) {
    correctAnswers.value++
  } else {
    incorrectAnswers.value++
  }
}

function nextStep() {
  selectedAnswer.value = null
  currentStep.value++

  if (currentStep.value < totalSteps.value) {
    generateOptions(allTranslationsRef.value)
    playSound(currentWord.value.word)
  }
}

function playSound(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'de-DE'
    utterance.rate = 1
    window.speechSynthesis.speak(utterance)
  }
}

function restartLearning() {
  currentStep.value = 0
  correctAnswers.value = 0
  incorrectAnswers.value = 0
  selectedAnswer.value = null
  learningSequence.value = learningSequence.value.sort(() => Math.random() - 0.5)
  generateOptions(allTranslationsRef.value)
  setTimeout(() => {
    playSound(currentWord.value.word)
  }, 300)
}

function handleBackClick() {
  if (viewMode.value === 'list') {
    goBack()
    return
  }
  if (currentStep.value >= totalSteps.value) {
    viewMode.value = 'list'
  } else {
    showExitModal.value = true
  }
}

function confirmExit() {
  isConfirmedExit.value = true
  showExitModal.value = false
  if (pendingRoute) {
    router.push(pendingRoute.path)
  } else {
    viewMode.value = 'list'
  }
}

function cancelExit() {
  showExitModal.value = false
  pendingRoute = null
}

onBeforeRouteLeave((to, from, next) => {
  if (viewMode.value === 'list' || isConfirmedExit.value || (viewMode.value === 'practice' && currentStep.value >= totalSteps.value)) {
    next()
  } else {
    showExitModal.value = true
    pendingRoute = to
    next(false)
  }
})
</script>

<style scoped>
.vocab-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 768px;
  margin: 0 auto;
  font-family: 'Nunito', sans-serif;
  touch-action: pan-y;
  position: relative;
  overflow: hidden;
  background-color: var(--bg);
}

.vocab-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background: var(--bg);
  z-index: 10;
}

.list-header {
  justify-content: space-between;
}

.list-title {
  font-size: 23px;
  font-weight: 800;
  color: var(--title);
  margin: 0;
  flex: 1;
  text-align: center;
  padding-right: 40px;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile, 0 4px 0 rgba(0,0,0,0.05));
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.progress_exp-bar {
  flex: 1;
  height: 25px;
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

.vocab-main {
  flex-grow: 1;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.vocab-main::-webkit-scrollbar {
  display: none;
  width: 0 !important;
}

.word-list-main {
  gap: 12px;
  padding: 20px 15px;
}

.word-list-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: white;
  padding: 12px 12px 12px 10px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  border: 2px solid #f1f5f9;
  transition: transform 0.1s ease;
}

.word-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex-grow: 1;
}

.word-german-list {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.word-translation-list {
  font-size: 15px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 2px;
}

.btn-verb-forms {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #bfdbfe;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.1s ease, transform 0.1s ease;
  margin-top: 4px;
}

.btn-verb-forms:active {
  transform: scale(0.96);
  background: #dbeafe;
}

.btn-tip {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #ffedd5;
  border: 2px solid #fdba74;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0 3px 0 #fb923c;
  margin-left: auto;
  align-self: center;
}

.btn-tip:active {
  transform: translateY(3px);
  box-shadow: 0 0 0 transparent;
}

/* Стили карточек практики */
.flashcard {
  background: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  gap: 16px;
  min-height: 100px;
}

.flashcard.audio-only :deep(.btn-sound) {
  width: 80px;
  height: 80px;
  font-size: 32px;
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.word-german {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  text-align: center;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  background: white;
  text-align: center;
  border: 2px solid #e2e8f0;
  border-radius: 46px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:active:not(:disabled) {
  transform: translateY(2px);
}

.option-btn.correct {
  background: #dcfce7;
  border-color: #22c55e;
  color: #166534;
}

.option-btn.incorrect {
  background: #fee2e2;
  border-color: #ef4444;
  color: #991b1b;
}

/* Футер и кнопки */
.vocab-footer {
  padding: 24px;
  background: var(--bg);
}

.btn-primary {
  width: 100%;
  background: #58cc02;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 46px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 5px 0 #46a302;
  transition: transform 0.1s;
}

.btn-primary:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}

.btn-secondary {
  width: 100%;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  padding: 14px 24px;
  border-radius: 42px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-secondary:active {
  transform: scale(0.97);
}

/* Модалка с подсказкой */
.tip-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.tip-modal {
  background: white;
  width: 100%;
  max-width: 400px;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tip-modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #475569;
}

.tip-modal-body p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: #475569;
  font-weight: 600;
}

.modal-ok-btn {
  margin-top: 8px;
  background: #3b82f6;
  box-shadow: 0 5px 0 #2563eb;
}

.modal-ok-btn:active {
  box-shadow: 0 0 0 transparent;
}

.completion-overlay {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9999;
}

.completion-modal {
  background: var(--bgModal, #ffffff);
  border-radius: 24px 24px 0 0;
  padding: 30px 20px;
  width: 100%;
  max-width: 768px;
  text-align: center;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border-top: 3px solid whitesmoke;
}

.completion-modal h2 {
  font-size: 27px;
  color: var(--titleColor, #1f2937);
  font-weight: 700;
  margin: 0;
}

.completion-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 18px;
}

.stat.correct {
  background-color: #dcfce7;
  color: #166534;
}

.stat.incorrect {
  background-color: #fee2e2;
  color: #991b1b;
}

.completion-overlay_icon {
  width: 140px;
  margin-bottom: 20px;
}

.completion-overlay_icon img {
  width: 100%;
  height: auto;
}

.completion-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  font-size: 18px;
  color: var(--title, #555);
  margin-top: 40px;
  font-weight: 600;
}

.error-state {
  color: #d64671;
  background: #FFE7E7;
  padding: 15px;
  border-radius: 12px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #58cc02;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>