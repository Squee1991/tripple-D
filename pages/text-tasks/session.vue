<template>
  <div
      class="drag-page"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
  >
    <div class="drag-page-container" v-if="store.currentTask">
      <div class="header-wrapper">
        <button class="btn-icon-back" @click="handleBackClick">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="custom-progress">
          <div class="progress_exp-bar">
            <div class="progress__bar" :style="{ width: `${progressPercentage}%` }">
              <div class="glare"></div>
            </div>
          </div>
        </div>
        <div class="task-counter">
          {{ currentTaskNumber }} / {{ totalTasks }}
        </div>
      </div>
      <div class="content-area">
        <div class="word-pool-card">
          <transition-group name="list" tag="div" class="word-pool">
            <div
                v-for="word in store.availableWords"
                :key="word"
                class="draggable-word"
                :class="{ 'is-selected': selectedWordForTap === word }"
                @click="selectWordForTap(word)"
            >
              {{ word }}
            </div>
          </transition-group>
          <div v-if="store.availableWords.length === 0" class="empty-pool-msg">{{ t('textTaskSession.allUsed')}}</div>
        </div>
        <div class="text-card">
          <div class="text-content">
            <template v-for="(part, index) in store.currentTask.textElements" :key="index">
              <span v-if="part.type === 'text'" class="static-text">{{ part.content }}</span>
              <span
                  v-else-if="part.type === 'blank'"
                  class="drop-zone"
                  :class="{
                  'has-word': store.blanksState[part.id],
                  'is-correct': store.isChecking && store.blanksState[part.id] === part.correct,
                  'is-wrong': store.isChecking && store.blanksState[part.id] && store.blanksState[part.id] !== part.correct,
                  'is-highlighted': selectedWordForTap && !store.blanksState[part.id]
                }"
                  @click="handleBlankClick(part.id)"
              >
                <span v-if="store.blanksState[part.id]">{{ store.blanksState[part.id] }}</span>
                <span v-else class="drop-placeholder">...</span>
              </span>
            </template>
          </div>
        </div>
      </div>
      <div class="footer-area">
        <button
            class="btn-check"
            :class="{ 'btn-success': isSuccess && store.isChecking }"
            :disabled="!store.isAllFilled && !store.isChecking"
            @click="handleMainAction"
        >
          {{ store.isChecking ? t('questCompletedModals.further') : t('questCompletedModals.check') }}
        </button>
      </div>
    </div>
    <div v-else class="error-state">
      <p>{{ t('textTaskSession.errorText')}}</p>
      <button @click="$router.push('/text-tasks')">{{ t('textTaskSession.back')}}</button>
    </div>

    <ExitSessionModal
        :show="showExitModal"
        @update:show="val => showExitModal = val"
        @cancel="cancelExit"
        @confirm="confirmExit"
    />
    <transition name="slide-up">
      <div v-if="showFinishModal" class="bottom-modal-overlay">
        <div class="bottom-modal-content">
          <img class="modal__image" src="../../assets/images/CorrectAnswerIcon.svg" alt="">
          <p class="bottom-modal-text">
            {{ t('questCompletedModals.count')}} <span>{{ correctAnswersCount }}</span> /  <span>{{ totalTasks }}</span>
          </p>
          <button class="btn-check btn-success finish-btn" @click="finishQuest">{{ t('speakSession.end')}}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter, onBeforeRouteLeave} from 'vue-router'
import {useTextTasksStore} from '../../store/textTasksStore.js'
import ExitSessionModal from '../../src/components/V-stopSessionModal.vue'
import { useSwipeBack } from '~/composables/useSwipeBack.js'

const {t} = useI18n()
const router = useRouter()
const store = useTextTasksStore()

const selectedWordForTap = ref(null)

const showExitModal = ref(false)
const isConfirmedExit = ref(false)
let pendingRoute = null

const showFinishModal = ref(false)
const correctAnswersCount = ref(0)

const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeBack(() => {
  handleBackClick()
}, {
  ignoreSelector: '.text-card, .word-pool-card'
})

onMounted(() => {
  if (!store.currentTask) {
    isConfirmedExit.value = true
    router.push('/text-tasks')
  }
})

onBeforeRouteLeave((to, from, next) => {
  if (isConfirmedExit.value) {
    next()
  } else {
    showExitModal.value = true
    pendingRoute = to
    next(false)
  }
})

const handleBackClick = () => {
  router.push('/text-tasks')
}

const confirmExit = () => {
  isConfirmedExit.value = true
  showExitModal.value = false
  if (pendingRoute) {
    router.push(pendingRoute.path)
  } else {
    router.push('/text-tasks')
  }
}

const cancelExit = () => {
  showExitModal.value = false
  pendingRoute = null
}

const currentTaskNumber = computed(() => {
  return store.currentTaskIndex >= 0 ? store.currentTaskIndex + 1 : 1
})

const totalTasks = computed(() => {
  return store.tasksList?.length > 0 ? store.tasksList.length : 1
})

const progressPercentage = computed(() => {
  if (store.currentTaskIndex < 0) return 0;
  const visuallyCompleted = store.currentTaskIndex + (store.isChecking && isSuccess.value ? 1 : 0);
  return (visuallyCompleted / totalTasks.value) * 100;
})

const isSuccess = computed(() => {
  if (!store.isChecking || !store.currentTask) return false
  return store.currentTask.textElements
      .filter(part => part.type === 'blank')
      .every(part => store.blanksState[part.id] === part.correct)
})

const handleMainAction = async () => {
  if (!store.isChecking) {
    store.toggleCheck()
    if (isSuccess.value) {
      correctAnswersCount.value++
      await store.saveTaskProgress()
    }
  } else {
    const hasNext = store.nextTask()
    if (!hasNext) {
      showFinishModal.value = true
    }
  }
}

const finishQuest = () => {
  showFinishModal.value = false
  isConfirmedExit.value = true
  router.push('/text-tasks')
}

const selectWordForTap = (word) => {
  if (store.isChecking) return
  selectedWordForTap.value = selectedWordForTap.value === word ? null : word
}

const handleBlankClick = (blankId) => {
  if (store.isChecking) return
  if (store.blanksState[blankId]) {
    store.returnWord(blankId)
    return
  }
  if (selectedWordForTap.value && !store.blanksState[blankId]) {
    store.placeWord(blankId, selectedWordForTap.value)
    selectedWordForTap.value = null
  }
}
</script>

<style scoped>
.drag-page {
  font-family: "Nunito", sans-serif;
  height: 100vh;
  display: flex;
  justify-content: center;
  overflow: hidden;
  touch-action: none;
}

.drag-page-container {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.modal__image {
  width: 140px;
  margin: 0 auto;
}

.header-wrapper {
  display: flex;
  align-items: center;
  padding: 10px 15px 15px 15px;
  gap: 8px;
  flex-shrink: 0;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  flex-shrink: 0;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.custom-progress {
  flex: 1;
  position: relative;
}

.progress_exp-bar {
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

.task-counter {
  font-size: 18px;
  font-weight: 800;
  color: var(--titleColor);
  white-space: nowrap;
  flex-shrink: 0;
}

.content-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
  overflow: hidden;
}

.word-pool-card {
  border-radius: 20px;
  padding: 10px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 3px 0 #e2e8f0;
  margin-bottom: 14px;
  flex-shrink: 0;
}

.word-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.empty-pool-msg {
  text-align: center;
  color: #a0aec0;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 0;
}

.draggable-word {
  background: #ffffff;
  border: 2px solid #cbd5e0;
  color: #2d3748;
  font-weight: 800;
  font-size: 14px;
  padding: 6px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 2px 0 #cbd5e0;
  -webkit-user-select: none;
  user-select: none;
  transition: transform 0.1s;
}

.draggable-word:active {
  transform: scale(0.95);
}

.draggable-word.is-selected {
  background: #ebf8ff;
  border-color: #3182ce;
  color: #2b6cb0;
  transform: translateY(2px);
  box-shadow: 0 0 0 transparent;
}

.text-card {
  border-radius: 20px;
  flex: 1;
  padding: 20px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 0 #e2e8f0;
  overflow-y: auto;
  scrollbar-width: none;
  touch-action: pan-y;
}

.text-card::-webkit-scrollbar {
  display: none;
}

.text-content {
  line-height: 2.2;
  font-size: 16px;
  color: var(--titleColor);
  font-weight: 600;
}

.static-text {
  display: inline;
}

.drop-zone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 24px;
  margin: 0 6px;
  padding: 0 10px;
  border: 2px dashed #a0aec0;
  border-radius: 8px;
  vertical-align: middle;
  font-weight: 800;
  color: #4a5568;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  transition: all 0.2s;
}

.drop-placeholder {
  color: #cbd5e0;
}

.drop-zone.has-word {
  background: #ebf8ff;
  border: 2px solid #3182ce;
  color: #2b6cb0;
}

.drop-zone.has-word:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}

.drop-zone.is-highlighted {
  border-color: #4facfe;
  background: #f0f9ff;
  animation: pulse 1.5s infinite;
}

.drop-zone.is-correct {
  background: #f0fff4;
  border-color: #38a169;
  color: #2f855a;
}

.drop-zone.is-wrong {
  background: #fff5f5;
  border-color: #e53e3e;
  color: #c53030;
}

.footer-area {
  padding: 10px 10px 20px 10px;
  flex-shrink: 0;
}

.btn-check {
  width: 100%;
  padding: 12px;
  font-size: 20px;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
  color: white;
  background-color: #4facfe;
  border: none;
  border-radius: 50px;
  box-shadow: 0 6px 0 #0088ff;
  cursor: pointer;
  transition: transform 0.1s, background-color 0.2s;
}

.btn-check.btn-success {
  background-color: #2b6be2;
  box-shadow: 0 6px 0 #2959b0;
}

.btn-check:disabled {
  background-color: #cbd5e0;
  box-shadow: 0 6px 0 #a0aec0;
  cursor: not-allowed;
}

.btn-check:active:not(:disabled) {
  transform: translateY(6px);
  box-shadow: 0 0 0 #0088ff;
}

.btn-check.btn-success:active:not(:disabled) {
  box-shadow: 0 0 0 #276749;
}

.list-enter-active, .list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(79, 172, 254, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(79, 172, 254, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(79, 172, 254, 0);
  }
}

.error-state {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #718096;
  font-weight: bold;
}

.error-state button {
  margin-top: 15px;
  padding: 10px 20px;
  border-radius: 12px;
  background: #4facfe;
  color: white;
  border: none;
  font-weight: bold;
}

.bottom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.93);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
}

.bottom-modal-content {
  background: var(--bgModal);
  width: 100%;
  max-width: 500px;
  border-radius: 24px 24px 0 0;
  padding: 30px 20px 40px;
  text-align: center;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.1);
}

.bottom-modal-icon {
  font-size: 50px;
  margin-bottom: 10px;
}

.bottom-modal-title {
  font-size: 26px;
  font-weight: 900;
  color: #38a169;
  margin-bottom: 15px;
}

.bottom-modal-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--title);
  margin: 32px 0;
}

.bottom-modal-text span {
  color: #38a169;
  font-size: 20px;
}

.finish-btn {
  margin-top: 10px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.35, 0.64, 1), opacity 0.4s ease;
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
</style>