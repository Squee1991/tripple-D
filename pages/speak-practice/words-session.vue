<template>
  <div
      class="vocab-container"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
  >
    <header class="vocab-header">
      <button class="btn-icon-back" @click="handleBackClick">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <div class="progress_exp-bar">
        <div class="progress__bar" :style="{ width: `${progressPercentage}%` }">
          <div class="glare"></div>
        </div>
      </div>
    </header>
    <main class="vocab-main" v-if="currentWord">
      <div class="flashcard" :class="{'audio-only': currentWord.displayType === 'audio'}">
        <SoundBtn :text="currentWord.german" class="btn-sound-custom" />
        <h2 v-if="currentWord.displayType === 'visual'" class="word-german">{{ currentWord.german }}</h2>
      </div>
      <div class="options-container">
        <button
            v-for="(option, index) in options"
            :key="index"
            class="option-btn"
            :class="{
            'correct': selectedAnswer && option === currentWord.correctTranslation,
            'incorrect': selectedAnswer === option && option !== currentWord.correctTranslation
          }"
            :disabled="selectedAnswer !== null"
            @click="checkAnswer(option)"
        >
          {{ option }}
        </button>
      </div>
    </main>
    <div v-else class="completed-state">
      <div class="icon-circle">🎉</div>
      <button class="btn-primary" @click="finishLearning">К выбору тем</button>
    </div>
    <footer class="vocab-footer" v-if="selectedAnswer">
      <button class="btn-primary" @click="nextStep">
        {{ currentStep < totalSteps - 1 ? 'Далее' : 'Завершить' }}
      </button>
    </footer>
    <VStopSessionModal
        v-model:show="showExitModal"
        @confirm="confirmExit"
        @cancel="cancelExit"
    />
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { useSpeakStore } from '../../store/speakStore.js';
import { useI18n } from 'vue-i18n';
import SoundBtn from '../../src/components/soundBtn.vue';
import VStopSessionModal from "~/src/components/V-stopSessionModal.vue";

import { useSwipeBack } from '~/composables/useSwipeBack.js';

const router = useRouter();
const route = useRoute();
const store = useSpeakStore();
const { locale } = useI18n();

const learningSequence = ref([]);
const currentStep = ref(0);
const options = ref([]);
const selectedAnswer = ref(null);

const showExitModal = ref(false);
const isConfirmedExit = ref(false);
let pendingRoute = null;

const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeBack(() => {
  handleBackClick();
});

const totalSteps = computed(() => learningSequence.value.length);
const progressPercentage = computed(() => (currentStep.value / totalSteps.value) * 100);
const currentWord = computed(() => learningSequence.value[currentStep.value]);

const getTranslation = (translationData) => {
  if (!translationData) return '';
  if (typeof translationData === 'string') return translationData;
  const currentLoc = locale.value || 'en-US';
  if (translationData[currentLoc]) return translationData[currentLoc];
  const matchedKey = Object.keys(translationData).find(key =>
      key.toLowerCase().startsWith(currentLoc.toLowerCase()) ||
      currentLoc.toLowerCase().startsWith(key.toLowerCase())
  );
  if (matchedKey) return translationData[matchedKey];
  return translationData['en-US'] || '';
};

const generateOptions = (allTranslations) => {
  const correct = currentWord.value.correctTranslation;
  const incorrectOptions = allTranslations.filter(t => t !== correct);
  const randomIncorrect = incorrectOptions.sort(() => Math.random() - 0.5).slice(0, 2);

  while (randomIncorrect.length < 2) {
    randomIncorrect.push("Вариант " + Math.random().toString(36).substring(7));
  }

  options.value = [correct, ...randomIncorrect].sort(() => Math.random() - 0.5);
};

const checkAnswer = (selected) => {
  selectedAnswer.value = selected;
};

const nextStep = () => {
  selectedAnswer.value = null;
  currentStep.value++;

  if (currentStep.value < totalSteps.value) {
    const allTranslations = Array.from(new Set(learningSequence.value.map(w => w.correctTranslation)));
    generateOptions(allTranslations);
    playSound(currentWord.value.german);
  }
};

const playSound = (text) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }
};

onBeforeRouteLeave((to, from, next) => {
  if (isConfirmedExit.value || currentStep.value >= totalSteps.value) {
    next();
  } else {
    showExitModal.value = true;
    pendingRoute = to;
    next(false);
  }
});

const handleBackClick = () => {
  if (currentStep.value >= totalSteps.value) {
    isConfirmedExit.value = true;
    router.push('/speak-practice');
  } else {
    showExitModal.value = true;
  }
};

const confirmExit = () => {
  isConfirmedExit.value = true;
  showExitModal.value = false;
  if (pendingRoute) {
    router.push(pendingRoute.path);
  } else {
    router.push('/speak-practice');
  }
};

const cancelExit = () => {
  showExitModal.value = false;
  pendingRoute = null;
};

const finishLearning = () => {
  isConfirmedExit.value = true;
  router.push('/speak-practice');
};

onMounted(async () => {
  const theme = route.query.theme;
  const level = route.query.level;

  if (!store.dialogueData) {
    await store.loadDialogue(level, theme);
  }

  const uniqueWordsMap = new Map();
  for (const key in store.dialogueData) {
    const step = store.dialogueData[key];
    if (step.vocabulary) {
      step.vocabulary.forEach(v => {
        if (!uniqueWordsMap.has(v.german)) {
          uniqueWordsMap.set(v.german, {
            german: v.german,
            correctTranslation: getTranslation(v.translation)
          });
        }
      });
    }
  }

  const baseWords = Array.from(uniqueWordsMap.values());
  const allTranslations = baseWords.map(w => w.correctTranslation);
  const sequence = [];

  baseWords.forEach(word => {
    sequence.push({ ...word, displayType: 'visual' });
    sequence.push({ ...word, displayType: 'audio' });
  });

  learningSequence.value = sequence.sort(() => Math.random() - 0.5);

  if (learningSequence.value.length > 0) {
    generateOptions(allTranslations);
    setTimeout(() => {
      playSound(currentWord.value.german);
    }, 300);
  }
});

</script>

<style scoped>
.vocab-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 768px;
  margin: 0 auto;
  font-family: 'Nunito', sans-serif;
  touch-action: pan-y;
}

.vocab-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.progress_exp-bar {
  flex: 1;
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

.glare{
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 4px
}

.vocab-main {
  flex-grow: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;
}

.flashcard {
  background: white;
  border-radius: 20px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  gap: 16px;
  min-height: 160px;
}

.flashcard.audio-only .btn-sound {
  width: 80px;
  height: 80px;
  font-size: 32px;
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-sound {
  background: #eff6ff;
  border: none;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.word-german {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  text-align: center;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  background: white;
  text-align: center;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:active:not(:disabled) {
  transform: translateY(2px);
}

.option-btn.correct {
  background: #dcfce7;
  border-color: #22c55e;
  color: #166534;
}

.option-btn.incorrect {
  background: #fee2e2;
  border-color: #ef4444;
  color: #991b1b;
}

.completed-state {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.icon-circle {
  font-size: 64px;
}

.vocab-footer {
  padding: 24px;
}

.btn-primary {
  width: 100%;
  background: #58cc02;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 0 #46a302;
}

.btn-primary:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}
</style>