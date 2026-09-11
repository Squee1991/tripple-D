<template>
  <div class="hedgehog-helper-wrapper">
    <!-- Плавающая кнопка (Ёжик) -->
    <button
        v-if="!isOpen && task"
        class="hh-fab"
        :class="{'pulse-danger': lives <= 1}"
        @click="openSheet"
    >
      <span class="hh-fab-icon">🦔</span>
      <span v-if="lives <= 1" class="hh-badge">SOS</span>
    </button>

    <!-- Затемнение фона -->
    <transition name="fade">
      <div v-if="isOpen" class="hh-overlay" @click="closeSheet"></div>
    </transition>

    <!-- Шторка снизу -->
    <transition name="slide-up">
      <div v-if="isOpen" class="hh-bottom-sheet">
        <div class="hh-sheet-header">
          <div class="hh-drag-line"></div>
          <button class="hh-close-btn" @click="closeSheet">✕</button>
        </div>

        <div class="hh-chat-area">
          <!-- Реплика ёжика -->
          <div class="hh-msg hh-bot">
            <span class="hh-avatar">🦔</span>
            <div class="hh-bubble">
              <span v-if="!hintData && !isLoading">Привет! Вижу, задание хитрое. Чем помочь?</span>
              <span v-else-if="isLoading">Ищу правильный ответ...</span>
              <div v-else>
                <strong>Ответ:</strong> <span class="hh-highlight">{{ hintData.correctOption }}</span>
                <p class="hh-exp">{{ hintData.explanation }}</p>
              </div>
            </div>
          </div>

          <!-- Кнопки действий юзера (пропадают после запроса) -->
          <div v-if="!hintData && !isLoading" class="hh-user-actions">
            <button class="hh-action-btn primary" @click="requestHint">
              Подскажи правильный ответ
            </button>
            <button class="hh-action-btn secondary" @click="closeSheet">
              Я попробую сам!
            </button>
          </div>

          <!-- Кнопка закрытия после получения ответа -->
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
import { ref, watch, computed } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions'

const props = defineProps({
  task: { type: Object, default: null },
  lives: { type: Number, default: 5 }
})

const isOpen = ref(false)
const isLoading = ref(false)
const hintData = ref(null)

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
    const functions = getFunctions()
    const getHint = httpsCallable(functions, 'hedgehogHint')

    // Собираем данные с экрана в зависимости от типа задания
    let questionText = props.task.question || props.task.text || ''
    let optionsList = props.task.options || props.task.reorderBank || []

    const res = await getHint({
      question: questionText,
      options: optionsList,
      taskType: props.task.type
    })

    if (res.data?.data) {
      hintData.value = res.data.data
    } else {
      hintData.value = {
        correctOption: "Ошибка связи",
        explanation: "Не удалось достучаться до сервера."
      }
    }
  } catch (err) {
    console.error(err)
    hintData.value = {
      correctOption: "Ошибка",
      explanation: "Проверь интернет-соединение."
    }
  } finally {
    isLoading.value = false
  }
}

watch(() => props.task, () => {
  hintData.value = null
  isLoading.value = false
}, { deep: true })
</script>

<style scoped>
.hedgehog-helper-wrapper {
  position: relative;
  z-index: 1000;
}

/* Плавающая кнопка */
.hh-fab {
  position: fixed;
  bottom: 120px; /* Выше нижней панели с кнопкой Проверить */
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #3b2d54;
  border: 2px solid #a855f7;
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  cursor: pointer;
  z-index: 99;
}
.pulse-danger {
  animation: hh-pulse 1.2s infinite;
  border-color: #ef4444;
}
@keyframes hh-pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
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

/* Оверлей */
.hh-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(2px);
  z-index: 1000;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Bottom Sheet */
.hh-bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #232238;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
  z-index: 1001;
  padding: 16px 20px 30px;
  color: white;
  border-top: 2px solid #a855f7;
}
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease-out; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.hh-sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.hh-drag-line {
  width: 40px;
  height: 4px;
  background: #6b7280;
  border-radius: 4px;
  margin: 0 auto;
}
.hh-close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 20px;
  position: absolute;
  right: 20px;
  top: 15px;
}

/* Чат */
.hh-chat-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.hh-msg {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}
.hh-avatar {
  font-size: 28px;
  background: #3b2d54;
  padding: 8px;
  border-radius: 50%;
  border: 1px solid #a855f7;
}
.hh-bubble {
  background: #374151;
  padding: 12px 16px;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  font-size: 16px;
  line-height: 1.4;
  flex-grow: 1;
}
.hh-highlight {
  color: #4ade80;
  font-weight: bold;
  font-size: 1.1em;
}
.hh-exp {
  margin: 8px 0 0 0;
  font-size: 0.9em;
  color: #d1d5db;
}

/* Кнопки выбора */
.hh-user-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}
.hh-action-btn {
  padding: 12px 20px;
  border-radius: 20px;
  border: none;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  border-bottom-right-radius: 4px;
  max-width: 90%;
  text-align: right;
}
.hh-action-btn.primary {
  background: #a855f7;
  color: white;
}
.hh-action-btn.secondary {
  background: #4b5563;
  color: #d1d5db;
}
</style>