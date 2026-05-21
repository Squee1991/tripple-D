<template>
  <div class="app-container">
    <header class="session__header" style="flex-shrink: 0; z-index: 10;">
      <button class="btn-icon-back" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h1 class="title">Практика диалогов</h1>
    </header>
    <main class="chat-window" ref="chatContainer">
      <button v-if="!store.chatStarted" class="start-btn" @click="startDialogue">
        Начать диалог
      </button>
      <div
          v-for="(msg, index) in store.chatHistory"
          :key="index"
          :class="['message-wrapper', msg.sender === 'bot' ? 'bot-message' : 'user-message']"
      >
        <div class="message-bubble">
          <div v-if="msg.sender === 'bot'" class="message__icon">
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
    </main>
    <footer class="options-panel" v-if="store.chatStarted">
      <p class="options-title" v-if="store.currentOptions.length > 0">Выберите ответ:</p>
      <div class="options-list" v-if="store.currentOptions.length > 0">
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
      <div class="input-area" :style="{ marginTop: store.currentOptions.length > 0 ? '10px' : '0' }">
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
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, nextTick} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useSpeakStore} from '../../store/speakStore.js';
import SoundBtn from "~/src/components/soundBtn.vue";

const {locale} = useI18n();
const route = useRoute();
const router = useRouter();
const store = useSpeakStore();

const chatContainer = ref(null);
const inputField = ref(null);
const manualInput = ref('');
const isListening = ref(false);
const isTyping = ref(false);
let recognition = null;

const getTranslation = (translationData) => {
  if (!translationData) return '';
  if (typeof translationData === 'string') return translationData;
  const currentLoc = locale.value || 'en-US';
  if (translationData[currentLoc]) {
    return translationData[currentLoc];
  }
  const matchedKey = Object.keys(translationData).find(key =>
      key.toLowerCase().startsWith(currentLoc.toLowerCase()) ||
      currentLoc.toLowerCase().startsWith(key.toLowerCase())
  );
  if (matchedKey) {
    return translationData[matchedKey];
  }
  return translationData['en-US'] || '';
};

onMounted(async () => {
  const theme = route.query.theme || 'firstmeet';
  const level = route.query.level || 'beginner';
  await store.loadDialogue(level, theme);
});

onUnmounted(() => {
  store.resetSession();
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
});

const goBack = () => {
  router.push('/speak-practice');
};

const speakGerman = (text) => {
  return new Promise((resolve) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  });
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const startDialogue = async () => {
  if (!store.dialogueData || !store.dialogueData['start']) return;
  store.chatStarted = true;
  store.setStep('start');
  store.isOptionsDisabled = true;

  isTyping.value = true;
  await scrollToBottom();

  const step = store.currentStepData;

  setTimeout(async () => {
    isTyping.value = false;
    store.addMessage('bot', step.botText, step.botTranslation);
    await scrollToBottom();
    await speakGerman(step.botText);
    store.isOptionsDisabled = false;
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
  }
};

const processUserAnswer = async (userText, userTranslation, nextStepKey) => {
  store.addMessage('user', userText, userTranslation);
  store.setStep(nextStepKey);
  await scrollToBottom();

  const nextStepData = store.currentStepData;

  if (nextStepData) {
    isTyping.value = true;
    await scrollToBottom();

    setTimeout(async () => {
      isTyping.value = false;
      store.addMessage('bot', nextStepData.botText, nextStepData.botTranslation);
      await scrollToBottom();

      await speakGerman(nextStepData.botText);
      store.isOptionsDisabled = false;
    }, 1500);
  } else {
    store.isOptionsDisabled = false;
  }
};

const toggleListening = () => {
  if (isListening.value) {
    recognition?.stop();
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("К сожалению, ваш браузер не поддерживает голосовой ввод.");
    return;
  }

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

onMounted(async () => {
  await startDialogue()
});
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
}

.session__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  background: var(--bg);
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

.title {
  font-size: 23px;
  color: var(--title);
  margin-left: 15px;
}

.start-btn {
  position: absolute;
  top: 40%;
  left: 50%;
  font-weight: bold;
  transform: translateX(-50%);
  background-color: #6B55A4;
  color: #FFFFFF;
  border: none;
  padding: 14px 26px;
  border-radius: 8px;
  cursor: pointer;
  z-index: 5;
}

.chat-window {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  scroll-behavior: smooth;
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
  font-size: 14px;
  color: var(--titleColor);
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  border: 1px solid #3f4257;
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