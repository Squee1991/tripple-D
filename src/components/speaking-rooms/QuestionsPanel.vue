<template>
  <div class="questions-panel">
    <div class="questions-panel__current">
      <span class="questions-panel__label">
        {{ t('speakingRooms.currentQuestion') }} ({{ currentIndex + 1 }}/{{ questions.length }})
      </span>
      <p class="questions-panel__text">
        {{ currentQuestion?.text || t('speakingRooms.noQuestions') }}
      </p>
    </div>

    <button
        v-if="isHost && questions.length === 0"
        class="questions-panel__reload-btn"
        @click="$emit('reload-questions')"
    >
      {{ t('speakingRooms.loadQuestions') }}
    </button>

    <button
        v-if="isHost && hasNextQuestion"
        class="questions-panel__next-btn"
        :disabled="disabled"
        @click="$emit('next-question')"
    >
      {{ t('speakingRooms.nextQuestion') }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps({
  questions: { type: Array, default: () => [] },
  currentIndex: { type: Number, default: 0 },
  isHost: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

defineEmits(['next-question', 'reload-questions'])

const currentQuestion = computed(() => props.questions[props.currentIndex] || null)
const hasNextQuestion = computed(() => props.currentIndex + 1 < props.questions.length)
</script>

<style scoped>
.questions-panel {
  font-family: "Nunito", sans-serif;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #1e1e1e;
  padding: 1.2rem;
}

.questions-panel__label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.questions-panel__text {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e1e1e;
  margin-top: 0.5rem;
  line-height: 1.4;
}

.questions-panel__next-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.7rem;
  font-weight: 800;
  font-size: 1rem;
  border-radius: 14px;
  border: 3px solid #1e1e1e;
  background: #f1c40f;
  color: #1e1e1e;
  box-shadow: 3px 3px 0 #1e1e1e;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.15s;
}

.questions-panel__next-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: 3px 3px 0 #1e1e1e;
}

.questions-panel__history {
  margin-top: 1rem;
  border-top: 2px solid #eee;
  padding-top: 0.8rem;
}

.questions-panel__history-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
}

.questions-panel__history-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.questions-panel__history-item {
  font-size: 0.9rem;
  color: #666;
  padding: 0.3rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.questions-panel__reload-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.7rem;
  font-weight: 800;
  font-size: 1rem;
  border-radius: 14px;
  border: 3px solid #1e1e1e;
  background: #2ecc71;
  color: #fff;
  box-shadow: 3px 3px 0 #1e1e1e;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.15s;
}

@media (min-width: 1024px) {
  .questions-panel__next-btn:hover,
  .questions-panel__reload-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #1e1e1e;
  }
}
</style>
