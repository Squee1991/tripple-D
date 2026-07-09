<template>
  <div class="error-game-page">
    <div class="error__btn-back">
      <button class="btn-icon-back" @click="handleError">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
    </div>
    <div class="game-content">
      <h2 class="game-title">{{ t('errorPage.game-title')}}</h2>
      <p class="game-desc">
        {{ t('errorPage.game-desc')}}
      </p>
      <div v-if="score < 19" class="game-board">
        <div class="word-display">{{ currentWord.text }}</div>
        <div class="articles-grid">
          <button
              v-for="art in ['der', 'die', 'das']"
              :key="art"
              class="article-btn"
              :class="{
              'btn-correct': selectedArticle === art && answerStatus === 'correct',
              'btn-incorrect': selectedArticle === art && answerStatus === 'incorrect'
            }"
              :disabled="isProcessing"
              @click="checkAnswer(art)"
          >
            {{ art }}
          </button>
        </div>
      </div>
      <div v-else class="win-screen">
        <h3>{{ t('errorPage.win-screen')}}</h3>
        <p>{{ t('errorPage.win-desc')}}</p>
      </div>
    </div>
    <VNetwork/>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import VNetwork from "~/src/components/V-network.vue";
const { t } = useI18n();
const props = defineProps({
  error: Object
})

const score = ref(0)
const selectedArticle = ref(null)
const answerStatus = ref(null)
const isProcessing = ref(false)

const words = [
  { text: 'Apfel', article: 'der' },
  { text: 'Katze', article: 'die' },
  { text: 'Haus', article: 'das' },
  { text: 'Tisch', article: 'der' },
  { text: 'Sonne', article: 'die' },
  { text: 'Buch', article: 'das' },
  { text: 'Hund', article: 'der' },
  { text: 'Blume', article: 'die' },
  { text: 'Auto', article: 'das' },
  { text: 'Baum', article: 'der' },
  { text: 'Stadt', article: 'die' },
  { text: 'Kind', article: 'das' },
  { text: 'Stuhl', article: 'der' },
  { text: 'Frau', article: 'die' },
  { text: 'Wasser', article: 'das' },
  { text: 'Mann', article: 'der' },
  { text: 'Tür', article: 'die' },
  { text: 'Fenster', article: 'das' },
  { text: 'Zug', article: 'der' },
  { text: 'Zeit', article: 'die' }
]

const currentWordIndex = ref(0)
const currentWord = computed(() => words[currentWordIndex.value])

const checkAnswer = (selectedArt) => {
  if (isProcessing.value) return;
  isProcessing.value = true;
  selectedArticle.value = selectedArt;

  if (selectedArt === currentWord.value.article) {
    answerStatus.value = 'correct';
    score.value++;
  } else {
    answerStatus.value = 'incorrect';
    score.value = 0;

  }
  setTimeout(() => {
    isProcessing.value = false;
    selectedArticle.value = null;
    answerStatus.value = null;

    if (score.value < 3) {
      currentWordIndex.value = (currentWordIndex.value + 1) % words.length;
    }
  }, 600);
}

const handleError = () => {
  clearError({redirect: '/'})
}

</script>

<style scoped>
.error-game-page {
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: var(--bg);
  color: var(--titleColor);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.error__btn-back {
  padding: 5px 10px 15px 10px;
}

.game-content {
  text-align: center;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  position: relative;
}

.game-title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 5px;
}

.game-desc {
  font-size: 16px;
  opacity: 0.8;
}

.game-board {
  margin-top: 30px;
}

.word-display {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 30px;
  color: #f39c12;
  text-shadow: 0 0 10px rgba(243, 156, 18, 0.3);
}

.articles-grid {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.article-btn {
  padding: 15px 25px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 16px;
  background: rgba(131, 128, 128, 0.72);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: var(--titleColor);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.article-btn:not(:disabled):active {
  transform: scale(0.95);
}

.article-btn.btn-correct {
  background: rgba(0, 220, 130, 0.15);
  border-color: rgba(0, 220, 130, 0.6);
  color: #00dc82;
  box-shadow: 0 0 15px rgba(0, 220, 130, 0.3);
}

.article-btn.btn-incorrect {
  background: rgba(255, 87, 87, 0.15);
  border-color: rgba(255, 87, 87, 0.6);
  color: #ff5757;
  box-shadow: 0 0 15px rgba(255, 87, 87, 0.3);
  animation: shake 0.4s;
}

.article-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.win-screen {
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.win-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  min-width: 40px;
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

@keyframes popIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-5px);
  }
  40%, 80% {
    transform: translateX(5px);
  }
}
</style>