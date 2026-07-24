<template>
  <div class="level-container">

    <!-- Заголовок / Имитация озвучки -->
    <header class="level-header">
      <h1>Уровень 1: Открой ворота</h1>
      <p v-if="!isSolved" class="voice-hint">
        (Голос: "Чтобы пройти дальше, подбери правильный ключ к замку!")
      </p>
    </header>

    <!-- Игровое поле: Ворота -->
    <div class="gate-wrapper" :class="{ 'gate-opened': isSolved }">
      <div class="gate-label">ВОРОТА</div>

      <!-- Замок (Зона Drop) -->
      <div
          class="lock-box"
          :class="{ 'lock-success': isSolved, 'lock-dragover': isDragOver && !isSolved }"
          @dragover.prevent="onDragOver"
          @dragleave="onDragLeave"
          @drop="onDrop"
      >
        <span class="lock-number">2</span>
        <span class="lock-sign">+</span>

        <!-- Пустой слот или вставленный ключ -->
        <div class="drop-slot" :class="{ 'slot-error': isError }">
          <span v-if="droppedKey" class="dropped-value">{{ droppedKey }}</span>
          <span v-else class="placeholder">?</span>
        </div>

        <span class="lock-sign">=</span>
        <span class="lock-number">6</span>
      </div>

      <!-- Сообщение об успехе -->
      <transition name="fade-bounce">
        <div v-if="isSolved" class="success-message">
          Ворота открыты!
        </div>
      </transition>
    </div>

    <!-- Инвентарь: Ключи на полу -->
    <div class="keys-container" :class="{ 'keys-disabled': isSolved }">
      <div
          v-for="keyVal in keys"
          :key="keyVal"
          draggable="true"
          class="key-item"
          @dragstart="onDragStart($event, keyVal)"
          @dragend="onDragEnd"
      >
        <div class="key-head"></div>
        <div class="key-body">
          <span class="key-value">{{ keyVal }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import {ref} from 'vue'

const keys = [3, 5, 4]
const targetResult = 6
const baseNumber = 2

const droppedKey = ref(null)
const isSolved = ref(false)
const isDragOver = ref(false)
const isError = ref(false)

const onDragStart = (event, value) => {
  event.dataTransfer.setData('text/plain', value)
  event.dataTransfer.effectAllowed = 'move'
  // Делаем сам ключ немного прозрачным при перетаскивании
  setTimeout(() => {
    event.target.style.opacity = '0.5'
  }, 0)
}

const onDragEnd = (event) => {
  event.target.style.opacity = '1'
}

const onDragOver = (event) => {
  isDragOver.value = true
}

const onDragLeave = () => {
  isDragOver.value = false
}

const onDrop = (event) => {
  isDragOver.value = false
  if (isSolved.value) return

  const value = parseInt(event.dataTransfer.getData('text/plain'))
  if (isNaN(value)) return

  droppedKey.value = value

  if (baseNumber + value === targetResult) {
    isSolved.value = true
    isError.value = false
    // Тут можно сделать эмит на следующий уровень
  } else {
    isError.value = true
    // Сбрасываем ошибку через 1 секунду
    setTimeout(() => {
      droppedKey.value = null
      isError.value = false
    }, 1000)
  }
}
</script>

<style scoped>
/* Общий контейнер */
.level-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  background-color: #e0f2fe;
  font-family: 'Arial Rounded MT Bold', 'Comic Sans MS', sans-serif;
  padding: 2rem;
  box-sizing: border-box;
}

/* Заголовок */
.level-header {
  text-align: center;
  margin-bottom: 2rem;
}

.level-header h1 {
  font-size: 2rem;
  color: #1e293b;
  margin: 0;
}

.voice-hint {
  font-size: 1.1rem;
  color: #64748b;
  margin-top: 0.5rem;
}

/* Ворота */
.gate-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 250px;
  background-color: #8b4513; /* Деревянный цвет */
  border: 8px solid #5c2c09;
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease;
}

.gate-label {
  color: #fcd34d;
  font-weight: bold;
  letter-spacing: 4px;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.gate-opened {
  /* Анимация открытия ворот (сдвиг вверх и растворение) */
  transform: translateY(-20px);
  opacity: 0.9;
  box-shadow: 0 20px 40px rgba(74, 222, 128, 0.4);
}

/* Замок */
.lock-box {
  background-color: #d1d5db;
  border: 4px solid #6b7280;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.lock-number, .lock-sign {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
}

.lock-dragover {
  background-color: #f3f4f6;
  border-color: #3b82f6;
  transform: scale(1.05);
}

.lock-success {
  background-color: #86efac;
  border-color: #16a34a;
}

.lock-success .lock-number, .lock-success .lock-sign {
  color: #14532d;
}

/* Слот для ключа (Drop zone) */
.drop-slot {
  width: 60px;
  height: 60px;
  background-color: white;
  border: 4px dashed #9ca3af;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  transition: all 0.2s;
}

.placeholder {
  color: #9ca3af;
}

.dropped-value {
  color: #1f2937;
}

.lock-success .drop-slot {
  border-color: #16a34a;
  border-style: solid;
}

.slot-error {
  border-color: #ef4444;
  background-color: #fee2e2;
  color: #ef4444;
  animation: shake 0.4s ease-in-out;
}

/* Сообщение об успехе */
.success-message {
  position: absolute;
  bottom: -25px;
  background-color: white;
  color: #16a34a;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Инвентарь ключей */
.keys-container {
  width: 100%;
  max-width: 400px;
  background-color: rgba(34, 197, 94, 0.15); /* Зеленоватая "трава" */
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 3rem;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

.keys-disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* Дизайн Ключа */
.key-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  transition: transform 0.2s;
}

.key-item:active {
  cursor: grabbing;
  transform: scale(0.95);
}

.key-item:hover {
  transform: translateY(-5px);
}

.key-head {
  width: 30px;
  height: 30px;
  border: 5px solid #d97706; /* Золотистый цвет */
  border-radius: 50%;
  margin-bottom: -5px;
  z-index: 2;
}

.key-body {
  width: 60px;
  height: 60px;
  background-color: #f59e0b;
  border: 4px solid #d97706;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.key-value {
  font-size: 2rem;
  font-weight: bold;
  color: #78350f;
}

/* Анимации */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}

.fade-bounce-enter-active {
  animation: bounce-in 0.5s;
}

.fade-bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>