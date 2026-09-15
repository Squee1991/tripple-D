<template>
  <div class="hedgehog-helper-wrapper">
    <button
        v-if="!isOpen && isAvailable && !isAnswered"
        class="hh-fab"
        :class="{'pulse-danger': lives <= 1}"
        @click="openSheet"
    >
      <div class="hh-fab-icon">
        <img class="hh-avatar-fab" :src="HedgehogIcon" alt="HedgehogIcon">
      </div>
    </button>
    <transition name="fade">
      <div v-if="isOpen" class="hh-overlay" @click="closeSheet"></div>
    </transition>
    <transition name="slide-up">
      <div v-if="isOpen" class="hh-bottom-sheet">
        <div class="hh-sheet-header">
          <div class="hh-toggle-btn-wrap" @click="toggleHelperState">
            <span class="hh-mini-toggle-track" :class="{ 'is-off': !uiSettings.hedgehogHelperEnabled }">
              <span class="hh-mini-toggle-thumb"></span>
            </span>
          </div>
          <div class="hh-drag-line"></div>
          <button class="hh-header-icon-btn hh-close-btn" @click="closeSheet">✕</button>
        </div>
        <div class="hh-content-wrapper" ref="wrapperRef">
          <div v-if="!uiSettings.hedgehogHelperEnabled" class="hh-confirm-view">
            <div class="hh-confirm-card">
              <div class="hh-power-circle-icon">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                  <line x1="12" y1="2" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3 class="hh-confirm-title">{{ t('hedgehogModal.off') }}</h3>
              <p class="hh-confirm-text">{{ t('hedgehogModal.onInfo') }}</p>
              <div class="hh-confirm-actions">
                <button class="hh-action-btn primary" @click="closeSheet">{{ t('hedgehogModal.ok') }}</button>
              </div>
            </div>
          </div>
          <div v-else class="hh-chat-area">
            <div class="hh-msg hh-bot">
              <img class="hh-avatar" :src="HedgehogIcon" alt="Hedgehog">
              <div class="hh-bubble">
                <template v-if="isLimitReached && !hintData">
                  <p class="hh-limit-text">
                    <strong>{{ t('hedgehogHleper.limitText') }}</strong><br>
                    {{ t('hedgehogHleper.limitText2') }}
                  </p>
                </template>
                <template v-else-if="!hintData && !isLoading">
                  <span v-if="isImageTask">
                    {{ t('hedgehogImageHelper.hintAnsweredTitle') }}
                  </span>
                  <span v-else>{{ t('hedgehogHleper.greetings') }}</span>
                </template>

                <template v-else-if="isLoading">
                  <div class="hh-loading">...</div>
                </template>

                <template v-else>
                  <div v-if="isImageTask" class="hh-hint-content">
                    <p class="hh-main-hint">
                      📌 <strong>{{ t('hedgehogImageHelper.mainHint2') }}</strong>
                      {{ hintData.hintText }}
                    </p>
                    <div v-if="hintData.vocabulary?.length" class="hh-vocab-box">
                      <span class="hh-section-title">🗣 {{ t('hedgehogImageHelper.usefulWords') }}</span>
                      <div class="hh-chips">
                        <span v-for="(word, idx) in hintData.vocabulary" :key="idx" class="hh-chip">
                          <b>{{ word.de }}</b> — {{ word.tr }}
                        </span>
                      </div>
                    </div>
                    <p v-if="hintData.grammarTip" class="hh-grammar-tip">
                      💡 <strong>{{ t('hedgehogImageHelper.grammarHint') }}</strong> {{ hintData.grammarTip }}
                    </p>
                  </div>
                  <div v-else>
                    <template v-if="hintData.correctOption && hintData.correctOption !== '...'">
                      <strong>{{ t('hedgehogHleper.answer') }}</strong> <span
                        class="hh-highlight">{{ hintData.correctOption }}</span>
                    </template>
                    <p class="hh-exp">{{ hintData.explanation }}</p>
                  </div>
                </template>
              </div>
            </div>

            <div class="hh-user-actions">
              <button
                  v-if="!hintData && !isLoading && !isLimitReached"
                  class="hh-action-btn primary"
                  @click="requestHint"
              >
                {{ mainActionButtonText }}
              </button>

              <template v-else-if="isLimitReached && !hintData && !isLoading">
                <button v-if="!authStore.isPremium" class="hh-action-btn plus" @click="goToPay">
                  {{ t('hedgehogHleper.plus') }}
                </button>
                <button class="hh-action-btn secondary" @click="closeSheet">
                  {{ t('hedgehogHleper.tillTommorow') }}
                </button>
              </template>
              <button
                  v-if="hintData && !isLoading"
                  class="hh-action-btn primary"
                  @click="closeSheet"
              >
                {{ t('hedgehogImageHelper.thanks') }}
              </button>
              <button
                  v-if="!hintData && !isLoading && !isLimitReached"
                  class="hh-action-btn secondary" @click="closeSheet"
              >
                {{ t('hedgehogHleper.cancel') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, computed, watch, nextTick} from 'vue'
import {useRouter} from 'vue-router'
import {getFunctions, httpsCallable} from 'firebase/functions'
import {userAuthStore} from '~/store/authStore.js'
import HedgehogIcon from '~/assets/images/AssistantIcon.png'
import { useUiSettingsStore } from '~/store/uiSettingsStore.js'

const uiSettings = useUiSettingsStore()
const {t, locale} = useI18n()
const router = useRouter()
const authStore = userAuthStore()

const props = defineProps({
  task: {type: Object, default: null},
  lives: {type: Number, default: 5},
  actionType: {type: String, default: 'hint'},
  selectedAnswer: {type: String, default: ''},
  imageUrl: {type: String, default: ''},
  referenceDescription: {type: String, default: ''},
  userLevel: {type: String, default: 'A1'},
  isAnswered: {type: Boolean, default: false}
})

const isOpen = ref(false)
const isLoading = ref(false)
const hintData = ref(null)
const isLimitReached = ref(false)
const wrapperRef = ref(null)

const isImageTask = computed(() => props.actionType === 'imageHint' || !!props.imageUrl || !!props.referenceDescription)
const isAvailable = computed(() => {
  if (!uiSettings.hedgehogHelperEnabled) return false
  return !!props.task || !!props.imageUrl || !!props.referenceDescription
})

const mainActionButtonText = computed(() => {
  if (isImageTask.value) return t('hedgehogImageHelper.getHint')
  if (props.actionType === 'grammar') return t('hedgehogHleper.hintBtn')
  return t('hedgehogHleper.hintBtn')
})

const animateHeightChange = async (callback) => {
  const el = wrapperRef.value
  if (!el) {
    callback()
    return
  }
  const prevHeight = el.offsetHeight
  el.style.height = `${prevHeight}px`
  callback()
  await nextTick()
  el.style.height = 'auto'
  const newHeight = el.offsetHeight
  el.style.height = `${prevHeight}px`
  el.offsetHeight
  el.style.height = `${newHeight}px`
  const onTransitionEnd = () => {
    el.style.height = 'auto'
    el.removeEventListener('transitionend', onTransitionEnd)
  }
  el.addEventListener('transitionend', onTransitionEnd)
}

watch([() => props.task, () => props.imageUrl, () => props.isAnswered], () => {
  hintData.value = null
  isLoading.value = false
  isLimitReached.value = false
  if (props.isAnswered) isOpen.value = false
}, {deep: true})

watch(hintData, () => {
  if (isOpen.value) {
    animateHeightChange(() => {})
  }
})

const openSheet = () => {
  isOpen.value = true
}

const closeSheet = () => {
  isOpen.value = false
}

const toggleHelperState = () => {
  animateHeightChange(() => {
    uiSettings.setHedgehogHelperEnabled(!uiSettings.hedgehogHelperEnabled)
  })
}

const goToPay = () => {
  closeSheet()
  router.push('/pay')
}

const requestHint = async () => {
  if (isLoading.value) return
  isLoading.value = true

  try {
    const functions = getFunctions(undefined, 'us-central1')
    const getAssistant = httpsCallable(functions, 'hedgehogAssistant')
    const currentLang = locale.value || 'ru'

    let payload = {
      action: props.actionType,
      userLocale: currentLang
    }

    if (isImageTask.value) {
      payload = {
        ...payload,
        action: 'imageHint',
        referenceDescription: props.referenceDescription || props.task?.referenceDescription || '',
        userLevel: props.userLevel || 'A1'
      }
    } else {
      let correctAnswer = props.task?.correctAnswer || props.task?.answer || ''
      if (props.task?.type === 'reorder' && props.task?.correctOrder) {
        correctAnswer = props.task.correctOrder.join(' ')
      }

      const rawQuestion = props.task?.question || ''
      let rawOptions = props.task?.options || props.task?.words || props.task?.reorderBank || []
      if (props.task?.type === 'reorder' && (!rawOptions || rawOptions.length === 0)) {
        if (correctAnswer) rawOptions = correctAnswer.trim().split(/\s+/)
      }

      const questionText = rawQuestion ? (rawQuestion.startsWith('themen.') || rawQuestion.startsWith('locations.') ? t(rawQuestion) : rawQuestion) : ''
      const optionsList = Array.isArray(rawOptions) ? rawOptions.map(opt => {
        try {
          return t(opt)
        } catch {
          return opt
        }
      }) : []

      payload = {
        ...payload,
        question: questionText,
        options: optionsList,
        taskType: props.task?.type || 'grammar',
        audioText: props.task?.text || '',
        correctAnswer: correctAnswer,
        sentence: questionText,
        answer: correctAnswer,
        selectedAnswer: props.selectedAnswer || ''
      }
    }

    const res = await getAssistant(payload)

    if (res.data?.error === 'LIMIT_REACHED') {
      isLimitReached.value = true
      return
    }

    if (res.data?.data) {
      hintData.value = res.data.data
    } else {
      throw new Error('Пустые данные от ассистента')
    }
  } catch (err) {
    console.error('Helper Error:', err)
    hintData.value = {
      correctOption: '...',
      explanation: t('hedgehogImageHelper.error'),
      hintText: t('hedgehogImageHelper.errorText'),
      vocabulary: [],
      grammarTip: t('hedgehogImageHelper.errorTip')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.hedgehog-helper-wrapper {
  position: relative;
  z-index: 10005;
}

.hh-fab {
  position: fixed;
  bottom: 122px;
  right: 16px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #3b2d54;
  border: 4px solid #a855f7;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  z-index: 10005;
  transition: transform 0.15s;
}

.hh-fab:active {
  transform: scale(0.92);
}

.pulse-danger {
  animation: hh-pulse 1.2s infinite;
  border-color: #ef4444;
}

@keyframes hh-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.hh-avatar-fab {
  border-radius: 50%;
  object-fit: cover;
}

.hh-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  z-index: 10010;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.hh-bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #232238;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  box-shadow: 0 -4px 25px rgba(0, 0, 0, 0.4);
  z-index: 10020;
  padding: 16px 16px 28px;
  color: white;
  border-top: 2px solid #a855f7;
  max-height: 85vh;
  overflow-y: auto;
}

.hh-content-wrapper {
  transition: height 0.32s cubic-bezier(0.25, 1, 0.5, 1);
  overflow: hidden;
  padding: 6px 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}

.hh-sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.hh-drag-line {
  width: 44px;
  height: 4px;
  background: #6b7280;
  border-radius: 4px;
}

.hh-toggle-btn-wrap {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
}

.hh-mini-toggle-track {
  width: 46px;
  height: 26px;
  background-color: #a855f7;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 3px;
  transition: background-color 0.25s ease;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.25);
}

.hh-mini-toggle-track.is-off {
  background-color: #4b5563;
}

.hh-mini-toggle-thumb {
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 50%;
  transform: translateX(20px);
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
}

.hh-mini-toggle-track.is-off .hh-mini-toggle-thumb {
  transform: translateX(0px);
}

.hh-header-icon-btn {
  background: rgba(255, 255, 255, 0.08);
  border: none;
  color: #9ca3af;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;
}

.hh-header-icon-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
}

.hh-confirm-view {
  padding: 8px 4px 12px;
}

.hh-confirm-card {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.hh-power-circle-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.hh-confirm-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  color: #f3f4f6;
}

.hh-confirm-text {
  font-size: 14px;
  line-height: 1.5;
  color: #9ca3af;
  margin: 0 0 8px;
  max-width: 320px;
}

.hh-confirm-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hh-chat-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hh-msg {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.hh-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #3b2d54;
  border: 2px solid #a855f7;
  object-fit: cover;
  flex-shrink: 0;
}

.hh-bubble {
  background: #374151;
  padding: 14px 16px;
  border-radius: 16px;
  border-top-left-radius: 4px;
  font-size: 15px;
  line-height: 1.45;
  flex-grow: 1;
}

.hh-highlight {
  color: #4ade80;
  font-weight: 800;
  font-size: 1.1em;
}

.hh-exp {
  margin: 8px 0 0 0;
  font-size: 0.95em;
  color: #e5e7eb;
}

.hh-limit-text {
  margin: 0;
  color: #e3dbdb;
  font-size: 14px;
  line-height: 1.4;
}

.hh-hint-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hh-main-hint {
  margin: 0;
  font-size: 14px;
  line-height: 1.4;
  color: #f3f4f6;
}

.hh-vocab-box {
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(168, 85, 247, 0.5);
  border-radius: 12px;
  padding: 10px;
}

.hh-section-title {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  display: block;
}

.hh-chips {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hh-chip {
  background: #202637;
  border: 1px solid #3b4252;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 13px;
  line-height: 1.35;
  color: #e2e8f0;
}

.hh-chip b {
  color: #93c5fd;
}

.hh-grammar-tip {
  margin: 0;
  background: #fef3c7;
  color: #78350f;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.35;
}

.hh-user-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
}

.hh-action-btn {
  padding: 14px 20px;
  border-radius: 25px;
  border: none;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
  text-align: center;
  transition: transform 0.1s, box-shadow 0.1s;
}

.hh-action-btn:active {
  transform: translateY(2px);
}

.hh-action-btn.primary {
  background: #49ad13;
  color: white;
  box-shadow: 0 6px 0 #229e1b;
}

.hh-action-btn.plus {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  box-shadow: 0 4px 0 #b45309;
}

.hh-action-btn.secondary {
  background: transparent;
  color: #9ca3af;
}
</style>