<template>
  <div
      class="vocab-container"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
  >
    <template v-if="viewMode === 'list'">
      <header class="vocab-header list-header">
        <button class="btn-icon-back" @click="handleBackClick">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h2 class="list-title">{{ t('speakSession.wordList') }}</h2>
      </header>
      <main class="vocab-main word-list-main">
        <div v-for="(word, index) in wordList" :key="index" class="word-list-item">
          <SoundBtn :text="word.german" class="list-sound-btn"/>
          <div class="word-details">
            <span class="word-german-list">{{ word.german }}</span>
            <span class="word-translation-list">{{ word.correctTranslation }}</span>
          </div>
        </div>
      </main>
      <footer class="vocab-footer">
        <button class="btn-primary" @click="startPractice">
          {{ t('speakSession.practiceWords') }}
        </button>
      </footer>
    </template>
    <template v-else-if="viewMode === 'practice'">
      <header class="vocab-header" v-if="currentWord">
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
          <SoundBtn :text="currentWord.german" class="btn-sound-custom"/>
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
      <Transition name="slide-up">
        <div v-if="currentStep >= totalSteps && totalSteps > 0" class="completion-overlay">
          <div class="completion-modal">
            <h2>{{ t('speakSession.goodJob') }}</h2>
            <div class="completion-stats">
              <div class="stat correct">
                <span class="stat-icon">✅</span>
                <span class="stat-value">{{ correctAnswers }}</span>
              </div>
              <div class="stat incorrect">
                <span class="stat-icon">❌</span>
                <span class="stat-value">{{ incorrectAnswers }}</span>
              </div>
            </div>
            <div class="completion-overlay_icon">
              <img src="../../assets/images/GoodJobIcon.svg" alt="success_icon">
            </div>
            <div class="completion-actions">
              <button class="btn-primary" @click="finishLearning">{{ t('speakSession.list') }}</button>
              <button class="btn-secondary" @click="restartLearning">{{t('speakSession.repeat')}}</button>
            </div>
          </div>
        </div>
      </Transition>
      <footer class="vocab-footer" v-if="selectedAnswer && currentWord">
        <button class="btn-primary" @click="nextStep">
          {{ currentStep < totalSteps - 1 ? t('speakSession.further') : t('speakSession.end') }}
        </button>
      </footer>
    </template>
    <VStopSessionModal
        v-model:show="showExitModal"
        @confirm="confirmExit"
        @cancel="cancelExit"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import {useRouter, useRoute, onBeforeRouteLeave} from 'vue-router';
import {useSpeakStore} from '../../store/speakStore.js';
import {useI18n} from 'vue-i18n';
import SoundBtn from '../../src/components/soundBtn.vue';
import VStopSessionModal from "~/src/components/V-stopSessionModal.vue";

import {useSwipeBack} from '~/composables/useSwipeBack.js';

const router = useRouter();
const route = useRoute();
const store = useSpeakStore();
const {locale, t} = useI18n();
const viewMode = ref('list');
const wordList = ref([]);

const learningSequence = ref([]);
const currentStep = ref(0);
const options = ref([]);
const selectedAnswer = ref(null);
const allTranslationsRef = ref([]);

const correctAnswers = ref(0);
const incorrectAnswers = ref(0);

const showExitModal = ref(false);
const isConfirmedExit = ref(false);
let pendingRoute = null;

const {handleTouchStart, handleTouchMove, handleTouchEnd} = useSwipeBack(() => {
  handleBackClick();
});

const totalSteps = computed(() => learningSequence.value.length);
const progressPercentage = computed(() => {
  if (totalSteps.value === 0) return 0;
  return (currentStep.value / totalSteps.value) * 100;
});
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
  if (!currentWord.value) return;
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
  if (selected === currentWord.value.correctTranslation) {
    correctAnswers.value++;
  } else {
    incorrectAnswers.value++;
  }
};

const nextStep = () => {
  selectedAnswer.value = null;
  currentStep.value++;

  if (currentStep.value < totalSteps.value) {
    generateOptions(allTranslationsRef.value);
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

const startPractice = () => {
  viewMode.value = 'practice';

  const allTranslations = wordList.value.map(w => w.correctTranslation);
  allTranslationsRef.value = allTranslations;

  const sequence = [];
  wordList.value.forEach(word => {
    sequence.push({...word, displayType: 'visual'});
    sequence.push({...word, displayType: 'audio'});
  });

  learningSequence.value = sequence.sort(() => Math.random() - 0.5);

  if (learningSequence.value.length > 0) {
    generateOptions(allTranslations);
    setTimeout(() => {
      playSound(currentWord.value.german);
    }, 300);
  }
};

onBeforeRouteLeave((to, from, next) => {
  if (viewMode.value === 'list' || isConfirmedExit.value || (viewMode.value === 'practice' && currentStep.value >= totalSteps.value)) {
    next();
  } else {
    showExitModal.value = true;
    pendingRoute = to;
    next(false);
  }
});

const handleBackClick = () => {
  if (viewMode.value === 'list') {
    router.push('/speak-practice');
    return;
  }

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

const restartLearning = () => {
  currentStep.value = 0;
  correctAnswers.value = 0;
  incorrectAnswers.value = 0;
  selectedAnswer.value = null;
  learningSequence.value = learningSequence.value.sort(() => Math.random() - 0.5);
  generateOptions(allTranslationsRef.value);
  setTimeout(() => {
    playSound(currentWord.value.german);
  }, 300);
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
  wordList.value = Array.from(uniqueWordsMap.values());
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
  position: relative;
  overflow: hidden;
}

.vocab-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  gap: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.list-header {
  justify-content: space-between;
}

.list-title {
  font-size: 23px;
  font-weight: 800;
  color: var(--title);
  margin: 0;
  flex: 1;
  text-align: center;
  padding-right: 40px;
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

.glare {
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
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.word-list-main {
  gap: 12px;
  padding: 20px 15px;
}

.word-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 8px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  border: 2px solid #f1f5f9;
  transition: transform 0.1s ease;
}

.word-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.word-german-list {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
}

.word-translation-list {
  font-size: 15px;
  color: #64748b;
  font-weight: 600;
}

.flashcard {
  background: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  gap: 16px;
  min-height: 100px;
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
  border-radius: 46px;
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

.vocab-footer {
  padding: 24px;
}

.btn-primary {
  width: 100%;
  background: #58cc02;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 46px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 5px 0 #46a302;
  transition: transform 0.1s;
}

.btn-primary:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}

.btn-secondary {
  width: 100%;
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  padding: 14px 24px;
  border-radius: 42px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-secondary:active {
  transform: scale(0.97);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.completion-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 50;
}

.completion-modal {
  background: var(--bgModal, #ffffff);
  border-radius: 24px 24px 0 0;
  padding: 30px 20px;
  width: 100%;
  max-width: 768px;
  text-align: center;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border-top: 3px solid whitesmoke;
}

.completion-modal h2 {
  font-size: 27px;
  color: var(--titleColor, #1f2937);
  font-weight: 700;
  margin: 0;
}

.completion-modal p {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 10px 0;
}

.completion-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 18px;
}

.stat.correct {
  background-color: #dcfce7;
  color: #166534;
}

.stat.incorrect {
  background-color: #fee2e2;
  color: #991b1b;
}

.completion-overlay_icon {
  width: 140px;
  margin-bottom: 20px;
}

.completion-overlay_icon img {
  width: 100%;
  height: auto;
}

.completion-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>