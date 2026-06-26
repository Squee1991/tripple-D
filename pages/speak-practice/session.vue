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
      <h1 class="title"> {{ t('speakSession.title') }} </h1>
      <button class="quiz__btn quiz__btn--info" @click="showDevModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
             stroke="orange" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </button>
    </header>
    <Transition name="fade">
      <div class="banner" v-if="viewState === 'menu'">
        <VBanner
            :text="textComputed"
            :icon="SpeakingIcon"
        />
      </div>
    </Transition>
    <VTransition>
      <main v-if="isMounted" class="chat-window" ref="chatContainer">
        <Transition name="fade">
          <div v-if="viewState === 'menu'" class="menu-block">
            <nav class="mobile-nav" role="tablist">
              <div class="sliding-bg" :style="{ transform: `translateX(${getTransformX(activeIndex)}%)` }"></div>
              <button
                  v-for="(tab, index) in learnTabs"
                  :key="tab.id"
                  class="mobile-nav__btn"
                  :class="{ 'mobile-nav__btn--active': toggleState === tab.id }"
                  role="tab"
                  @click="setTab(tab.id)"
              >
                <img :src="tab.icon" alt="" class="tab-icon"/>
                <span class="tab-label">{{ tab.label }}</span>
              </button>
            </nav>
            <Transition name="fade" mode="out-in">
              <div v-if="toggleState === 'words'" class="menu-card" key="words">
                <div class="icon-circle vocab-icon">📚</div>
                <div class="menu-card-content">
                  <h2>{{ t('speakSession.words') }}</h2>
                  <p>{{ t('speakSession.wordsText') }}</p>
                </div>
                <button class="btn-primary" @click="startVocabLearning">
                  {{ isVocabLearned ? t('speakSession.repeat') : t('speakSession.start') }}
                </button>
              </div>
              <div v-else class="menu-card" key="dialog">
                <div class="icon-circle start-icon">💬</div>
                <div class="menu-card-content">
                  <h2>{{ t('speakSession.dialogue') }}</h2>
                  <p>{{ t('speakSession.dialogueText') }}</p>
                </div>
                <button class="btn-primary" @click="startDialogue">
                  {{ dialogueCompleted ? t('speakSession.repeat') : t('speakSession.start') }}
                </button>
              </div>
            </Transition>
          </div>
        </Transition>
        <Transition name="fade">
          <div v-if="viewState === 'vocab'" class="vocab-learning-block">
            <div class="vocab-progress">
              {{ currentVocabIndex + 1 }} / {{ vocabList.length }}
            </div>
            <div class="flashcard">
              <button class="btn-sound-large" @click="speakGerman(vocabList[currentVocabIndex].german)">🔊</button>
              <h2 class="vocab-german">{{ vocabList[currentVocabIndex].german }}</h2>
              <p class="vocab-russian">{{ getTranslation(vocabList[currentVocabIndex].translation) }}</p>
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
    </VTransition>
    <Transition name="slide-up">
      <div v-if="showCompletionModal" class="completion-overlay">
        <div class="completion-modal">
          <h2>{{ t('speakSession.goodJob') }}</h2>
          <p>{{ t('speakSession.goodJobTitle') }}</p>
          <div class="completion-overlay_icon">
            <img src="../../assets/images/GoodJobIcon.svg" alt="success_icon">
          </div>
          <div class="completion-actions">
            <button class="btn-primary" @click="confirmExit">{{ t('speakSession.list') }}</button>
            <button class="btn-secondary" @click="restartDialogue">{{ t('speakSession.repeat') }}</button>
          </div>
        </div>
      </div>
    </Transition>
    <footer class="options-panel" v-if="viewState === 'chat' && !dialogueCompleted">
      <p class="options-title" v-if="store.currentOptions?.length > 0">{{ t('speakSession.choice') }}</p>
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
            :title="t('speakSession.hoverVoice')"
            :disabled="isTyping"
        >
          {{ isListening ? '🔴' : '🎙️' }}
        </button>
        <input
            ref="inputField"
            v-model="manualInput"
            type="text"
            class="text-input"
            :placeholder="t('speakSession.placeHolder')"
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
import Dialog from '../../assets/images/dialog.svg'
import Words from '../../assets/images/word.svg'
import VBanner from "~/src/components/V-banner.vue";
import {useSwipeBack} from '~/composables/useSwipeBack.js';
import VTransition from "~/src/components/V-transition.vue";
import {showInterstitial} from '../../utils/admob.js';

const {locale, t} = useI18n();
const route = useRoute();
const router = useRouter();
const store = useSpeakStore();
const isMounted = ref(false);
const viewState = ref('menu');
const chatContainer = ref(null);
const inputField = ref(null);
const manualInput = ref('');
const isListening = ref(false);
const isTyping = ref(false);
const dialogueCompleted = ref(false);
const showExitModal = ref(false);
const showCompletionModal = ref(false);
const isConfirmedExit = ref(false);
const showDevModal = ref(false);
const isVocabLearned = ref(false);
const toggleState = ref('dialog');
let recognition = null;

const {handleTouchStart, handleTouchMove, handleTouchEnd} = useSwipeBack(() => {
  goBack();
}, {
  ignoreSelector: '.options-list, .vocab-actions, .text-input'
});

const textComputed = computed(() => {
  return toggleState.value === 'dialog'
      ? t('speakSessionsBanner.dialog')
      : t('speakSessionsBanner.words')
})

const learnTabs = [
  {id: 'dialog', label: t('speakSession.dialogue'), icon: Dialog},
  {id: 'words', label: t('speakSession.words'), icon: Words},
]

const activeIndex = computed(() => learnTabs.findIndex(tab => tab.id === toggleState.value))

const getTransformX = (index) => {
  if (index === -1) return 0;
  if (locale.value === 'ar') {
    return (learnTabs.length - 1 - index) * 100;
  }
  return index * 100;
};

function setTab(id) {
  toggleState.value = id
}

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

const goBack = () => {
  if (viewState.value === 'menu' || dialogueCompleted.value) {
    router.push('/speak-practice');
  } else {
    showExitModal.value = true;
  }
};

const confirmExit = () => {
  isConfirmedExit.value = true;
  showExitModal.value = false;
  showCompletionModal.value = false;
  router.push('/speak-practice');
};

const startVocabLearning = () => {
  showInterstitial(() => {
    router.push({
      path: '/speak-practice/words-session',
      query: {
        theme: route.query.theme,
        level: route.query.level
      }
    });
  });
};

const restartDialogue = async () => {
  showCompletionModal.value = false;
  showInterstitial(async () => {
    store.resetSession();
    dialogueCompleted.value = false;
    viewState.value = 'menu';
    await loadDialogueData();
  });
};

const speakGerman = async (text) => {
  if (!text) return;
  stopSpeech();
  const plainText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/→/g, ', ')
      .trim();
  await getSpeechAudio(plainText, 'de-DE');
  return new Promise((resolve) => {
    setTimeout(() => {
      const audios = document.getElementsByTagName('audio');
      let playingAudio = null;

      for (let i = audios.length - 1; i >= 0; i--) {
        if (!audios[i].paused && !audios[i].ended) {
          playingAudio = audios[i];
          break;
        }
      }

      if (playingAudio) {
        playingAudio.addEventListener('ended', () => {
          setTimeout(resolve, 200);
        }, {once: true});
      } else if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        const checkInterval = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(checkInterval);
            setTimeout(resolve, 200);
          }
        }, 100);
      } else {
        const estimatedMs = plainText.length * 75;
        setTimeout(resolve, estimatedMs + 200);
      }
    }, 150);
  });
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const completeDialogue = async () => {
  dialogueCompleted.value = true;
  showCompletionModal.value = true;
  await scrollToBottom();
  const theme = route.query.theme || 'firstmeet';
  await store.saveDialogueCompletion(theme);
};

const startDialogue = async () => {
  if (!store.dialogueData || !store.dialogueData['start']) return;
  showInterstitial(async () => {
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
  });
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

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 70)
})

</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1240px;
  margin: 0 auto;
  overflow: hidden;
  background: var(--bg);
  font-family: Nunito, sans-serif;
  position: relative;
}

.banner {
  padding: 0 15px;
}

.session__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px 15px 10px;
  background: var(--bg);
}

.completion-overlay_icon {
  width: 140px;
  margin-bottom: 20px;
}

.btn-icon-back,
.quiz__btn--info {
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

.mobile-nav {
  display: flex;
  position: relative;
  justify-content: space-between;
  background: var(--tabBg, var(--menuItemsBg));
  border-radius: 40px;
  padding: 6px;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile, 0 4px 0 var(--tabsSlideBorderColor));
  z-index: 1;
  flex-shrink: 0;
  width: 100%;
}

.sliding-bg {
  position: absolute;
  top: 5px;
  bottom: 6px;
  left: 6px;
  width: calc(50% - 6px);
  background: var(--tabsSlideBg);
  box-shadow: var(--tabSlideBoxShadow, 0 2px 0 rgba(0, 0, 0, 0.1));
  border-radius: 30px;
  transition: transform 0.4s cubic-bezier(0.34, 1.35, 0.64, 1);
  z-index: 1;
}

.mobile-nav__btn {
  border: none;
  background: none;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  position: relative;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;
}

.tab-icon {
  width: 33px;
  height: 33px;
  object-fit: contain;
  transition: transform 0.2s;
}

.tab-label {
  font-size: 15px;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
  color: var(--titleColor);
  transition: transform 0.2s;
}

.menu-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.menu-card {
  border-radius: 20px;
  padding: 30px 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 15px;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
}

.menu-card-content h2 {
  font-size: 20px;
  color: var(--titleColor);
  font-weight: 700;
  margin: 0 0 10px 0;
}

.menu-card-content p {
  font-size: 14px;
  color: var(--titleColor);
  opacity: 0.8;
  margin: 0 0 15px 0;
  line-height: 1.4;
  max-width: 90%;
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
  font-size: 60px;
}

.start-icon {
  color: #6366f1;
}

.vocab-icon {
  color: #f59e0b;
}

.success-icon {
  color: #f59e0b;
}

.btn-primary {
  background-color: #2b6be2;
  box-shadow: 0 5px 0 #2959b0;
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

.btn-primary:active {
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
  pointer-events: none;
}

.completion-modal {
  background: var(--bgModal);
  border-radius: 24px 24px 0 0;
  padding: 30px 20px;
  width: 100%;
  max-width: 768px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  border-top: 3px solid whitesmoke;
}

.completion-modal h2 {
  font-size: 27px;
  color: var(--titleColor);
  font-weight: 700;
  margin: 0;
}

.completion-modal p {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 10px 0;
}

.completion-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.chat-window {
  flex: 1;
  padding: 0 14px;
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
  border-radius: 15px 15px 0 0;
  border-top: 3px solid var(--tabsSlideBorderColor);

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
  background-color: var(--menuItemsBg);
  padding: 8px 4px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: inherit;
  border: 1px solid transparent;
  border-bottom: 1px solid var(--tabsSlideBorderColor);
}

.option-btn:active:not(:disabled) {
  border-color: #6366f1;
}

.option-german {
  font-size: 15px;
  font-weight: 600;
  color: var(--titleColor);
}

.option-russian {
  font-size: 13px;
  color: var(--titleColor);
}

.input-area {
  margin-top: 10px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.mic-btn, .send-btn {
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 22px;
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
  border-radius: 40px;
  border: 2px solid transparent;
  background-color: var(--bg);
  color: var(--titleColor);
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