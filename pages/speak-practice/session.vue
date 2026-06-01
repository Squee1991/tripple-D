<template>
  <div class="app-container"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd"
  >
    <header class="session__header" style="flex-shrink: 0; z-index: 10;">
      <button class="btn-icon-back" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h1 class="title">Практика общения</h1>
      <button class="quiz__btn quiz__btn--info" @click="showDevModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
             stroke="orange" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </button>
    </header>
    <main class="chat-window" ref="chatContainer">
      <Transition name="fade">
        <div v-if="viewState === 'menu'" class="menu-block">
          <div class="menu-card">
            <div class="icon-circle vocab-icon">📚</div>
            <div class="menu-card-content">
              <h2>Слова к диалогу</h2>
            </div>
            <button class="btn-primary" @click="startVocabLearning">
              {{ isVocabLearned ? 'Повторить' : 'Учить' }}
            </button>
          </div>
          <div class="menu-card">
            <div class="icon-circle start-icon">💬</div>
            <div class="menu-card-content">
              <h2>Диалог</h2>
            </div>
            <button class="btn-primary" @click="startDialogue">
              {{ dialogueCompleted ? 'Повторить' : 'Начать' }}
            </button>
          </div>
        </div>
      </Transition>
      <Transition name="fade">
        <div v-if="viewState === 'vocab'" class="vocab-learning-block">
          <div class="vocab-progress">
            {{ currentVocabIndex + 1 }} / {{ vocabList.length }}
          </div>
          <div class="flashcard">
            <button class="btn-sound-large" @click="speakGerman(vocabList[currentVocabIndex].german)">
              🔊
            </button>
            <h2 class="vocab-german">{{ vocabList[currentVocabIndex].german }}</h2>
            <p class="vocab-russian">{{ getTranslation(vocabList[currentVocabIndex].translation) }}</p>
          </div>
          <div class="vocab-actions">
            <button class="btn-secondary" @click="prevVocab" :disabled="currentVocabIndex === 0">Назад</button>
            <button class="btn-primary" @click="nextVocab">
              {{ currentVocabIndex === vocabList.length - 1 ? 'Завершить' : 'Далее' }}
            </button>
          </div>
        </div>
      </Transition>

      <template v-if="viewState === 'chat'">
        <div
            v-for="(msg, index) in store.chatHistory"
            :key="index"
            :class="['message-wrapper', msg.sender === 'bot' ? 'bot-message' : 'user-message']"
        >
          <div class="message-bubble">
            <div class="message__icon">
              <SoundBtn :text="msg.text"/>
            </div>
            <div class="message">
              <p class="german-text">{{ msg.text }}</p>
              <p v-if="msg.translation" class="russian-translation">{{ getTranslation(msg.translation) }}</p>
            </div>
          </div>
        </div>
        <div v-if="isTyping" class="message-wrapper bot-message">
          <div class="message-bubble typing-bubble">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </template>
    </main>
    <Transition name="slide-bottom">
      <div v-if="dialogueCompleted && viewState === 'chat'" class="bottom-sheet">
        <div class="sheet-content">
          <div class="icon-circle success-icon">🏆</div>
          <h2>Отличная работа!</h2>
          <p>Вы успешно завершили этот диалог.</p>
          <div class="completion-actions">
            <button class="btn-secondary" @click="restartDialogue">Повторить</button>
            <button class="btn-primary" @click="confirmExit">К списку</button>
          </div>
        </div>
      </div>
    </Transition>
    <footer class="options-panel" v-if="viewState === 'chat' && !dialogueCompleted">
      <p class="options-title" v-if="store.currentOptions?.length > 0">Выберите ответ:</p>
      <div class="options-list" v-if="store.currentOptions?.length > 0">
        <button
            v-for="(option, index) in store.currentOptions"
            :key="index"
            class="option-btn"
            :disabled="store.isOptionsDisabled || isTyping"
            :style="{ opacity: (store.isOptionsDisabled || isTyping) ? 0.6 : 1, cursor: (store.isOptionsDisabled || isTyping) ? 'not-allowed' : 'pointer' }"
            @click="handleOptionClick(option)"
        >
          <span class="option-german">{{ option.text }}</span>
          <span class="option-russian">{{ getTranslation(option.translation) }}</span>
        </button>
      </div>
      <div class="input-area" :style="{ marginTop: store.currentOptions?.length > 0 ? '10px' : '0' }">
        <button
            class="mic-btn"
            :class="{ 'is-listening': isListening }"
            @click="toggleListening"
            title="Сказать голосом"
            :disabled="isTyping"
        >
          {{ isListening ? '🔴' : '🎙️' }}
        </button>
        <input
            ref="inputField"
            v-model="manualInput"
            type="text"
            class="text-input"
            placeholder="Напиши или скажи ответ..."
            @keyup.enter="submitManualInput"
            :disabled="isTyping"
        />
        <button class="send-btn" @click="submitManualInput" :disabled="isTyping">➤</button>
      </div>
    </footer>
    <VStopSessionModal
        v-model:show="showExitModal"
        @confirm="confirmExit"
    />
    <Modal
     :visible="showDevModal"
     @close="showDevModal = false"
     :img="SpeakingIcon"
     :title="t('speakIndexPage.modalTitle')"
     :text="t('speakIndexPage.modalText')"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, nextTick} from 'vue';
import {useRoute, useRouter, onBeforeRouteLeave} from 'vue-router';
import {useSpeakStore} from '../../store/speakStore.js';
import SoundBtn from "~/src/components/soundBtn.vue";
import VStopSessionModal from "~/src/components/V-stopSessionModal.vue";
import Modal from '../../src/components/modal.vue';
import SpeakingIcon from "assets/images/speakingIcon.svg";
const {locale, t } = useI18n();
const route = useRoute();
const router = useRouter();
const store = useSpeakStore();
import { useSwipeBack } from '~/composables/useSwipeBack.js';
const viewState = ref('menu');
const chatContainer = ref(null);
const inputField = ref(null);
const manualInput = ref('');
const isListening = ref(false);
const isTyping = ref(false);
const dialogueCompleted = ref(false);
const showExitModal = ref(false);
const isConfirmedExit = ref(false);
const showDevModal = ref(false);
const isVocabLearned = ref(false);
const currentVocabIndex = ref(0);

let recognition = null;


const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeBack(() => {
  goBack();
}, {
  ignoreSelector: '.options-list, .vocab-actions, .text-input'
});

const vocabList = computed(() => {
  if (!store.dialogueData) return [];
  const words = [];
  const seen = new Set();

  for (const key in store.dialogueData) {
    const step = store.dialogueData[key];
    if (step.vocabulary && Array.isArray(step.vocabulary)) {
      step.vocabulary.forEach(v => {
        if (!seen.has(v.german)) {
          seen.add(v.german);
          words.push(v);
        }
      });
    }
  }
  return words;
});

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

const loadDialogueData = async () => {
  const theme = route.query.theme || 'firstmeet';
  const level = route.query.level || 'beginner';
  await store.loadDialogue(level, theme);
};

onMounted(async () => {
  await store.loadUserProgress();
  await loadDialogueData();
});

onUnmounted(() => {
  store.resetSession();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
});

onBeforeRouteLeave((to, from, next) => {
  if (viewState.value === 'menu' || isConfirmedExit.value || (viewState.value === 'chat' && dialogueCompleted.value)) {
    next();
  } else {
    showExitModal.value = true;
    next(false);
  }
});

const goBack = () => {
  if (viewState.value === 'vocab') {
    viewState.value = 'menu';
    return;
  }
  if (viewState.value === 'menu' || dialogueCompleted.value) {
    router.push('/speak-practice');
  } else {
    showExitModal.value = true;
  }
};

const confirmExit = () => {
  isConfirmedExit.value = true;
  showExitModal.value = false;
  router.push('/speak-practice');
};

const startVocabLearning = () => {
  router.push({
    path: '/speak-practice/words-session',
    query: {
      theme: route.query.theme,
      level: route.query.level
    }
  });
};

const nextVocab = async () => {
  if (currentVocabIndex.value < vocabList.value.length - 1) {
    currentVocabIndex.value++;
    await speakGerman(vocabList.value[currentVocabIndex].german);
  } else {
    isVocabLearned.value = true;
    viewState.value = 'menu';
  }
};

const prevVocab = async () => {
  if (currentVocabIndex.value > 0) {
    currentVocabIndex.value--;
    await speakGerman(vocabList.value[currentVocabIndex].german);
  }
};

const restartDialogue = async () => {
  store.resetSession();
  dialogueCompleted.value = false;
  viewState.value = 'menu';
  await loadDialogueData();
};

const speakGerman = async (text) => {
  if (!text) return

  stopSpeech()

  const plainText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/→/g, ', ')
      .trim()

  await getSpeechAudio(plainText, 'de-DE')
}

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const completeDialogue = async () => {
  dialogueCompleted.value = true;
  await scrollToBottom();
  const theme = route.query.theme || 'firstmeet';
  await store.saveDialogueCompletion(theme);
};

const startDialogue = async () => {
  if (!store.dialogueData || !store.dialogueData['start']) return;

  viewState.value = 'chat';
  store.chatStarted = true;
  dialogueCompleted.value = false;

  store.setStep('start');
  store.isOptionsDisabled = true;

  const step = store.currentStepData;

  setTimeout(async () => {
    await speakGerman(step.botText);
  }, 300);

  isTyping.value = true;
  await scrollToBottom();

  setTimeout(async () => {
    isTyping.value = false;
    store.addMessage(
        'bot',
        step.botText,
        step.botTranslation
    );

    await scrollToBottom();
    store.isOptionsDisabled = false;
    checkDialogueEnd(step);
  }, 900);
};

const handleOptionClick = async (option) => {
  if (store.isOptionsDisabled || isTyping.value) return;
  store.isOptionsDisabled = true;
  const textToSpeak = option.text.replace('...', '');
  if (option.text.includes('...')) {
    manualInput.value = option.text.replace('...', ' ');
    await speakGerman(textToSpeak);
    store.isOptionsDisabled = false;
    nextTick(() => {
      if (inputField.value) inputField.value.focus();
    });
  } else {
    await speakGerman(textToSpeak);
    await processUserAnswer(option.text, option.translation, option.nextStep);
  }
};

const submitManualInput = async () => {
  if (!manualInput.value.trim() || store.isOptionsDisabled || isTyping.value) return;
  store.isOptionsDisabled = true;

  const currentStep = store.currentStepData;
  const textToSpeak = manualInput.value;
  const nextStepKey = currentStep.defaultNext;

  const textToSave = manualInput.value;
  manualInput.value = '';

  await speakGerman(textToSpeak);

  if (nextStepKey) {
    await processUserAnswer(textToSave, 'Свой ответ', nextStepKey);
  } else {
    store.addMessage('user', textToSave, 'Свой ответ');
    store.isOptionsDisabled = false;
    checkDialogueEnd(null);
  }
};

const processUserAnswer = async (userText, userTranslation, nextStepKey) => {
  store.addMessage('user', userText, userTranslation);

  if (!nextStepKey || nextStepKey === 'end') {
    await completeDialogue();
    return;
  }

  store.setStep(nextStepKey);
  await scrollToBottom();

  const nextStepData = store.currentStepData;

  if (nextStepData && Object.keys(nextStepData).length > 0) {
    isTyping.value = true;
    await scrollToBottom();

    setTimeout(async () => {
      isTyping.value = false;
      store.addMessage('bot', nextStepData.botText, nextStepData.botTranslation);
      await scrollToBottom();

      await speakGerman(nextStepData.botText);
      store.isOptionsDisabled = false;

      checkDialogueEnd(nextStepData);
    }, 1500);
  } else {
    store.isOptionsDisabled = false;
    await completeDialogue();
  }
};

const checkDialogueEnd = async (stepData) => {
  if (!stepData) {
    if ((!store.currentOptions || store.currentOptions.length === 0)) {
      await completeDialogue();
    }
    return;
  }

  if ((!store.currentOptions || store.currentOptions.length === 0) && !stepData.defaultNext) {
    await completeDialogue();
  }
};

const toggleListening = () => {
  if (isListening.value) {
    recognition?.stop();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;
  recognition = new SpeechRecognition();
  recognition.lang = 'de-DE';
  recognition.interimResults = false;
  recognition.onstart = () => isListening.value = true;
  recognition.onerror = () => isListening.value = false;
  recognition.onend = () => isListening.value = false;
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    manualInput.value += (manualInput.value ? ' ' : '') + transcript;
  };

  recognition.start();
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1240px;
  margin: 0 auto;
  overflow: hidden;
  background: var(--bg);
  font-family: Nunito, sans-serif;
  position: relative;
}

.session__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px 15px 10px;
  background: var(--bg);
}

.btn-icon-back,
.quiz__btn--info{
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

.title {
  font-size: 23px;
  color: var(--title);
  margin-left: 15px;
  text-shadow: 1px 1px var(--title);
}

.menu-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  padding: 20px;
  gap: 20px;
  width: 100%;
  max-width: 400px;
}

.menu-card {
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  gap: 15px;
}

.menu-card-content h2 {
  font-size: 18px;
  color: var(--titleColor);
  font-weight: 600;
  margin: 0 0 5px 0;
}

.menu-card-content p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.vocab-learning-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  gap: 30px;
}

.vocab-progress {
  font-size: 16px;
  font-weight: bold;
  color: #6b7280;
}

.flashcard {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 40px 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  gap: 20px;
}

.btn-sound-large {
  background: #eef2ff;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.btn-sound-large:active {
  transform: scale(0.9);
}

.vocab-german {
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
}

.vocab-russian {
  font-size: 18px;
  color: #6b7280;
  margin: 0;
}

.vocab-actions {
  display: flex;
  width: 100%;
  gap: 15px;
}

.vocab-actions button {
  flex: 1;
}

.icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.start-icon {
  background: #eef2ff;
  color: #6366f1;
}

.vocab-icon {
  background: #fffbeb;
  color: #f59e0b;
}

.success-icon {
  background: #fffbeb;
  color: #f59e0b;
}

.btn-primary {
  background-color: #6B55A4;
  color: #FFFFFF;
  border: none;
  padding: 14px 24px;
  border-radius: 42px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s, transform 0.1s;
}

.btn-primary:hover {
  background-color: #594689;
}

.btn-primary:active {
  transform: scale(0.97);
}

.bottom-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 20;
  padding: 30px 20px;
  text-align: center;
}

.sheet-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 400px;
  margin: 0 auto;
}

.sheet-content h2 {
  font-size: 22px;
  color: #1f2937;
  margin: 0;
}

.sheet-content p {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 10px 0;
}

.completion-actions {
  display: flex;
  width: 100%;
  gap: 10px;
}

.completion-actions .btn-primary,
.completion-actions .btn-secondary {
  flex: 1;
  width: 100%;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  padding: 14px 24px;
  border-radius: 12px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.slide-bottom-enter-from,
.slide-bottom-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.chat-window {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  scroll-behavior: smooth;
  padding-bottom: 40px;
}

.message-wrapper {
  display: flex;
  width: 100%;
}

.bot-message {
  justify-content: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.message-bubble {
  display: flex;
  gap: 5px;
  max-width: 80%;
  padding: 8px 10px;
  border-radius: 16px;
  background-color: #FFFFFF;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message__icon {
  width: 28px;
}

.bot-message .message-bubble {
  border-left: 5px solid #3b82f6;
  border-top-left-radius: 4px;
}

.user-message .message-bubble {
  border-right: 5px solid #8b5cf6;
  border-top-right-radius: 4px;
}

.german-text {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.russian-translation {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.typing-bubble {
  padding: 18px 24px;
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 50px;
}

.dot {
  width: 8px;
  height: 8px;
  background-color: #3b82f6;
  border-radius: 50%;
  animation: typingBounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typingBounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.3;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.options-panel {
  background-color: var(--menuItemsBg);
  padding: 10px;
}

.options-title {
  font-size: 13px;
  color: var(--titleColor);
  font-weight: bold;
  margin-bottom: 4px;
  text-align: center;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.option-btn {
  background-color: #2d3042;
  border-radius: 12px;
  padding: 8px 20px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: inherit;
  border: 1px solid transparent;
}

.option-btn:active:not(:disabled) {
  border-color: #6366f1;
}

.option-german {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
}

.option-russian {
  font-size: 13px;
  color: #a1a1aa;
}

.input-area {
  margin-top: 10px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.mic-btn, .send-btn {
  background-color: #2d3042;
  color: #ffffff;
  border: 2px solid #3f4257;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.mic-btn:hover:not(:disabled), .send-btn:hover:not(:disabled) {
  background-color: #3f4257;
}

.mic-btn:disabled, .send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mic-btn.is-listening {
  background-color: #ef4444;
  border-color: #ef4444;
  animation: pulse 1.5s infinite;
}

.text-input {
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid #3f4257;
  background-color: #2d3042;
  color: #ffffff;
  font-size: 15px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.text-input:focus {
  border-color: #6366f1;
}

.text-input::placeholder {
  color: #9ca3af;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}
</style>