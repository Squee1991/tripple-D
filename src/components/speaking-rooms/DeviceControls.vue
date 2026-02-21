<template>
  <div class="controls">
    <button
        class="controls__btn"
        :class="{ 'controls__btn--off': !audioEnabled }"
        @click="$emit('toggle-audio')"
        :title="audioEnabled ? t('speakingRooms.micOn') : t('speakingRooms.micOff')"
    >
      <span class="controls__icon">{{ audioEnabled ? '&#127908;' : '&#128263;' }}</span>
    </button>

    <button
        v-if="isHost && hasNextQuestion"
        class="controls__btn controls__btn--next"
        :disabled="isAdvancingQuestion"
        @click="$emit('next-question')"
        :title="t('speakingRooms.nextQuestion')"
    >
      <span class="controls__icon">&#9197;</span>
      <span class="controls__text">{{ t('speakingRooms.nextQuestion') }}</span>
    </button>

    <button
        v-if="isHost"
        class="controls__btn controls__btn--close"
        @click="$emit('close-room')"
        :title="t('speakingRooms.closeRoom')"
    >
      <span class="controls__icon">&#128683;</span>
      <span class="controls__text">{{ t('speakingRooms.closeRoom') }}</span>
    </button>

    <button
        class="controls__btn controls__btn--leave"
        @click="$emit('leave')"
        :title="t('speakingRooms.leaveRoom')"
    >
      <span class="controls__icon">&#128308;</span>
      <span class="controls__text">{{ t('speakingRooms.leave') }}</span>
    </button>
  </div>
</template>

<script setup>
const { t } = useI18n()

defineProps({
  audioEnabled: { type: Boolean, default: true },
  isHost: { type: Boolean, default: false },
  hasNextQuestion: { type: Boolean, default: false },
  isAdvancingQuestion: { type: Boolean, default: false }
})

defineEmits(['toggle-audio', 'leave', 'close-room', 'next-question'])
</script>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.8rem 1.5rem;
  background: rgba(30, 30, 30, 0.95);
  border-radius: 20px;
  border: 3px solid #444;
}

.controls__btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  border: 3px solid #555;
  border-radius: 14px;
  background: #333;
  color: #fff;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s;
}

.controls__btn--off {
  background: #d32f2f;
  border-color: #b71c1c;
}

.controls__btn--next {
  background: #f1c40f;
  border-color: #d4ac0d;
  color: #1e1e1e;
}

.controls__btn--next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.controls__btn--close {
  background: #d32f2f;
  border-color: #b71c1c;
}

.controls__btn--leave {
  background: #d32f2f;
  border-color: #b71c1c;
}

.controls__icon {
  font-size: 1.2rem;
}

.controls__text {
  display: none;
}

@media (min-width: 768px) {
  .controls__text {
    display: inline;
  }
}

@media (min-width: 1024px) {
  .controls__btn:hover:not(:disabled) {
    filter: brightness(1.2);
    transform: translateY(-1px);
  }
}
</style>
