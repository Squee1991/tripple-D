<template>
  <div class="actions" :class="{ 'disabled': disabled, 'is-reveal': feedback === 'incorrect' }">
    <button v-for="article in ARTICLES" :key="article" class="article-btn" :class="[article, buttonClass(article)]"
            @click="emit('choose', article)">
      <span class="article-text">{{ article }}</span>
    </button>
  </div>
</template>

<script setup>
// Кнопки артиклей. После ошибки правильная кнопка светится, нажатая неправильная и третья — тускнеют
const props = defineProps({
  disabled: {type: Boolean, default: false},
  feedback: {type: String, default: null},
  correctArticle: {type: String, default: ''},
  chosenArticle: {type: String, default: null}
})
const emit = defineEmits(['choose'])

const ARTICLES = ['der', 'die', 'das']

function buttonClass(article) {
  if (props.feedback !== 'incorrect') return ''
  if (article === props.correctArticle) return 'is-right-answer'
  if (article === props.chosenArticle) return 'is-wrong-choice'
  return 'is-faded'
}
</script>

<style scoped>
.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  width: 100%;
  max-width: 600px;
  padding-bottom: 20px;
  transition: opacity 0.2s ease;
}

.actions.disabled {
  pointer-events: none;
  opacity: 0.6;
}

/* Показываем правильный ответ — ряд не тускнеет, тускнеют только неправильные кнопки */
.actions.disabled.is-reveal {
  opacity: 1;
}

.article-btn {
  flex: 1;
  padding: 16px 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.article-btn:active {
  transform: translateY(6px);
}

.article-text {
  font-family: "Nunito", sans-serif;
  font-size: 28px;
  font-weight: 900;
  color: #ffffff;
  text-transform: lowercase;
}

.article-btn.der {
  background-color: #007AFF;
  box-shadow: 0 6px 0 #005bb5;
}

.article-btn.der:active {
  box-shadow: 0 0 0 #005bb5;
}

.article-btn.die {
  background-color: #FF3B30;
  box-shadow: 0 6px 0 #c22820;
}

.article-btn.die:active {
  box-shadow: 0 0 0 #c22820;
}

.article-btn.das {
  background-color: #34C759;
  box-shadow: 0 6px 0 #248a3d;
}

.article-btn.das:active {
  box-shadow: 0 0 0 #248a3d;
}

/* После ошибки: правильная кнопка светится и пульсирует, остальные притушены */
.actions.disabled .article-btn.is-right-answer {
  opacity: 1;
  animation: rightAnswerPulse 0.6s ease-in-out 2;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.25), 0 0 0 4px #ffffff, 0 0 24px 4px rgba(255, 255, 255, 0.6);
}

.article-btn.is-wrong-choice {
  opacity: 0.35;
}

.article-btn.is-faded {
  opacity: 0.35;
}

@keyframes rightAnswerPulse {
  50% {
    transform: scale(1.08);
  }
}
</style>
