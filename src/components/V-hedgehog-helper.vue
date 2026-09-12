<template>
  <div class="hedgehog-helper-wrapper">
    <button
        v-if="!isOpen && task"
        class="hh-fab"
        :class="{'pulse-danger': lives <= 1}"
        @click="openSheet"
    >
      <div class="hh-fab-icon">
        <img class="hh-avatar" :src="HedgehogIcon" alt="HedgehogIcon">
      </div>
      <span v-if="lives <= 1" class="hh-badge">SOS</span>
    </button>
    <transition name="fade">
      <div v-if="isOpen" class="hh-overlay" @click="closeSheet"></div>
    </transition>
    <transition name="slide-up">
      <div v-if="isOpen" class="hh-bottom-sheet">
        <div class="hh-sheet-header">
          <div class="hh-drag-line"></div>
          <button class="hh-close-btn" @click="closeSheet">✕</button>
        </div>
        <div class="hh-chat-area">
          <div class="hh-msg hh-bot">
            <img class="hh-avatar" :src="HedgehogIcon" alt="HedgehogIcon">
            <div class="hh-bubble">
              <span v-if="!hintData && !isLoading">Привет! Чем помочь?</span>
              <span v-else-if="isLoading">...</span>
              <div v-else>
                <template v-if="hintData.correctOption && hintData.correctOption !== '...'">
                  <strong>Ответ:</strong> <span class="hh-highlight">{{ hintData.correctOption }}</span>
                </template>
                <p class="hh-exp">{{ hintData.explanation }}</p>
              </div>
            </div>
          </div>
          <div v-if="!hintData && !isLoading" class="hh-user-actions">
            <button class="hh-action-btn primary" @click="requestHint">
              {{ actionType === 'grammar' ? 'Объясни грамматику' : 'Подскажи ответ' }}
            </button>
            <button class="hh-action-btn secondary" @click="closeSheet">
              Я попробую сам!
            </button>
          </div>
          <div v-if="hintData" class="hh-user-actions">
            <button class="hh-action-btn primary" @click="closeSheet">
              Понял, спасибо!
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { useI18n } from 'vue-i18n'
import HedgehogIcon from '~/assets/images/AssistantIcon.png'

const { t, locale } = useI18n()

const props = defineProps({
  task: { type: Object, default: null },
  lives: { type: Number, default: 5 },
  actionType: { type: String, default: 'hint' },
  selectedAnswer: { type: String, default: '' }
})

const isOpen = ref(false)
const isLoading = ref(false)
const hintData = ref(null)

watch(() => props.task, () => {
  hintData.value = null
  isLoading.value = false
}, { deep: true })

const openSheet = () => {
  isOpen.value = true
}

const closeSheet = () => {
  isOpen.value = false
}

const requestHint = async () => {
  if (isLoading.value || !props.task) return
  isLoading.value = true

  try {
    const functions = getFunctions(undefined, 'us-central1')
    const getAssistant = httpsCallable(functions, 'hedgehogAssistant')

    const correctAnswer = props.task.correctAnswer || props.task.answer || ''
    const rawQuestion = props.task.question || ''
    let rawOptions = props.task.options || props.task.reorderBank || []
    if (props.task.type === 'reorder' && rawOptions.length === 0) {
      rawOptions = correctAnswer ? correctAnswer.split(' ') : []
    }

    const questionText = rawQuestion ? (rawQuestion.startsWith('themen.') || rawQuestion.startsWith('locations.') ? t(rawQuestion) : rawQuestion) : ''
    const optionsList = rawOptions.map(option => {
      try {
        return t(option)
      } catch {
        return option
      }
    })

    const audioText = props.task.text || ''
    const currentLang = locale.value || 'ru'

    const res = await getAssistant({
      action: props.actionType,
      question: questionText,
      options: optionsList,
      taskType: props.task.type || 'grammar',
      audioText: audioText,
      correctAnswer: correctAnswer,
      sentence: questionText,
      answer: correctAnswer,
      selectedAnswer: props.selectedAnswer || '',
      userLocale: currentLang
    })

    if (res.data?.error === 'LIMIT_REACHED') {
      hintData.value = {
        correctOption: "Лимит",
        explanation: "На сегодня подсказки закончились. Переходи на Premium!"
      }
      return
    }

    if (res.data?.data) {
      hintData.value = {
        correctOption: res.data.data.correctOption || res.data.data.answer || '',
        explanation: res.data.data.explanation || 'Обрати внимание на род и падеж!'
      }
    } else {
      hintData.value = {
        correctOption: "...",
        explanation: "Не удалось загрузить подсказку. Попробуй еще раз!"
      }
    }
  } catch (err) {
    console.error("Helper Error:", err)
    hintData.value = {
      correctOption: "...",
      explanation: "Ошибка соединения с ассистентом."
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.hedgehog-helper-wrapper {
  position: relative;
  z-index: 10005; /* Чтобы кнопка всегда была поверх любых штор и карточек */
}

.hh-fab {
  position: fixed;
  bottom: 90px;
  right: 16px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #3b2d54;
  border: 2px solid #a855f7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  z-index: 10005;
}

.pulse-danger {
  animation: hh-pulse 1.2s infinite;
  border-color: #ef4444;
}

@keyframes hh-pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.hh-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 5px;
  border-radius: 6px;
}

.hh-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  z-index: 10010;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

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
  padding: 16px 20px 32px;
  color: white;
  border-top: 2px solid #a855f7;
}

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease-out; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.hh-sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
}

.hh-drag-line {
  width: 44px;
  height: 4px;
  background: #6b7280;
  border-radius: 4px;
  margin: 0 auto;
}

.hh-close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #9ca3af;
  font-size: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: -4px;
}

.hh-chat-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hh-msg {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.hh-avatar {
  width: 44px;
  height: 44px;
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
}

.hh-action-btn.primary {
  background: #a855f7;
  color: white;
  box-shadow: 0 4px 0 #7e22ce;
}

.hh-action-btn.primary:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #7e22ce;
}

.hh-action-btn.secondary {
  background: transparent;
  color: #9ca3af;
}
</style>