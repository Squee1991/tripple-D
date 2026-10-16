<template>
  <div class="word-display">
    <!-- Надписи «🔥 10 подряд!», «🏆 Новый рекорд!» и т.п. -->
    <Transition name="milestone">
      <div v-if="milestoneText" class="milestone">{{ milestoneText }}</div>
    </Transition>
    <slot name="above"/>

    <!-- Карточка улетает к выбранному артиклю, после ошибки показывает верный артикль и падает -->
    <Transition :name="'card-' + flyDirection" mode="out-in">
      <div :key="cardKey" class="word-card" :class="[feedbackClass, fireClass]">
        <span v-if="fireClass" class="word-card__fire">🔥 {{ streak }}</span>
        <h1>
          <span v-if="feedback === 'incorrect'" class="word-card__article" :class="'is-' + word.article">{{ word.article }}</span>
          {{ word.de }}
        </h1>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {computed} from 'vue'

// Карточка со словом для игр с артиклями (марафон, ежедневный забег).
// cardKey меняется — старая карточка улетает в сторону flyDirection (der / die / das / drop), новая выезжает сверху
const props = defineProps({
  word: {type: Object, required: true},
  feedback: {type: String, default: null},
  streak: {type: Number, default: 0},
  cardKey: {type: Number, default: 0},
  flyDirection: {type: String, default: 'der'},
  milestoneText: {type: String, default: ''}
})

// Огонь серии: 10 подряд — оранжевый, 25 — синий, 50 — фиолетовый
const FIRE_STREAKS = {orange: 10, blue: 25, purple: 50}

const fireClass = computed(() => {
  if (props.streak >= FIRE_STREAKS.purple) return 'fire-purple'
  if (props.streak >= FIRE_STREAKS.blue) return 'fire-blue'
  if (props.streak >= FIRE_STREAKS.orange) return 'fire-orange'
  return ''
})

const feedbackClass = computed(() => {
  if (props.feedback === 'correct') return 'feedback-correct'
  if (props.feedback === 'incorrect') return 'feedback-incorrect'
  return ''
})
</script>

<style scoped>
.word-display {
  position: relative;
  text-align: center;
  min-height: 190px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

/* Карточка со словом */
.word-card {
  position: relative;
  width: 100%;
  max-width: 340px;
  min-height: 130px;
  padding: 28px 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 28px;
  background: var(--bgModal, #ffffff);
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: 0 8px 0 var(--boxShadowMobile);
  transition: box-shadow 0.3s, border-color 0.3s;
}

.word-card.feedback-correct {
  border-color: #34C759;
}

.word-card.feedback-incorrect {
  border-color: #FF3B30;
}

/* После ошибки — правильный артикль перед словом, цветом артикля */
.word-card__article {
  margin-right: 8px;
  animation: articleReveal 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.word-card__article.is-der {
  color: #007AFF;
}

.word-card__article.is-die {
  color: #FF3B30;
}

.word-card__article.is-das {
  color: #34C759;
}

@keyframes articleReveal {
  from {
    opacity: 0;
    transform: scale(0.4);
  }
}

/* Огонь серии: 10 подряд — оранжевый, 25 — синий, 50 — фиолетовый */
.word-card.fire-orange {
  border-color: #ff9500;
  box-shadow: 0 8px 0 #c86f00, 0 0 28px rgba(255, 149, 0, 0.55);
}

.word-card.fire-blue {
  border-color: #0a84ff;
  box-shadow: 0 8px 0 #0060c0, 0 0 32px rgba(10, 132, 255, 0.6);
}

.word-card.fire-purple {
  border-color: #bf5af2;
  box-shadow: 0 8px 0 #8a2fc0, 0 0 36px rgba(191, 90, 242, 0.65);
  animation: firePulse 1.2s ease-in-out infinite;
}

@keyframes firePulse {
  50% {
    box-shadow: 0 8px 0 #8a2fc0, 0 0 52px rgba(191, 90, 242, 0.9);
  }
}

.word-card__fire {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  padding: 3px 12px;
  border-radius: 999px;
  background: #ff9500;
  color: #ffffff;
  font-size: 15px;
  font-weight: 900;
  white-space: nowrap;
}

.fire-blue .word-card__fire {
  background: #0a84ff;
}

.fire-purple .word-card__fire {
  background: #bf5af2;
}

/* Карточка выезжает сверху */
.card-der-enter-active, .card-die-enter-active, .card-das-enter-active, .card-drop-enter-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s;
}

.card-der-enter-from, .card-die-enter-from, .card-das-enter-from, .card-drop-enter-from {
  opacity: 0;
  transform: translateY(-40px) scale(0.9);
}

/* …и улетает к кнопке выбранного артикля или падает после ошибки */
.card-der-leave-active, .card-die-leave-active, .card-das-leave-active, .card-drop-leave-active {
  transition: transform 0.3s ease-in, opacity 0.3s ease-in;
}

.card-der-leave-to {
  opacity: 0;
  transform: translate(-90%, 120px) rotate(-25deg) scale(0.6);
}

.card-die-leave-to {
  opacity: 0;
  transform: translateY(160px) scale(0.5);
}

.card-das-leave-to {
  opacity: 0;
  transform: translate(90%, 120px) rotate(25deg) scale(0.6);
}

.card-drop-leave-to {
  opacity: 0;
  transform: translateY(90px) rotate(8deg);
}

/* Надпись «🔥 10 подряд!» / «🏆 Новый рекорд!» */
.milestone {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  padding: 8px 18px;
  border-radius: 999px;
  background: #ff9500;
  color: #ffffff;
  font-size: 18px;
  font-weight: 900;
  white-space: nowrap;
  box-shadow: 0 6px 18px rgba(255, 149, 0, 0.45);
}

.milestone-enter-active {
  transition: opacity 0.2s, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.milestone-leave-active {
  transition: opacity 0.25s;
}

.milestone-enter-from {
  opacity: 0;
  transform: translateX(-50%) scale(0.5);
}

.milestone-leave-to {
  opacity: 0;
}

.word-display h1 {
  font-size: 36px;
  font-weight: 900;
  line-height: 1.1;
  color: var(--titleColor);
  margin: 0;
  word-break: break-word;
  transition: color 0.2s ease;
}

.feedback-correct h1 {
  color: #34C759;
}

.feedback-incorrect h1 {
  color: var(--titleColor);
}

.feedback-incorrect {
  animation: gentle-shake 0.4s ease both;
}

@keyframes gentle-shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}
</style>
