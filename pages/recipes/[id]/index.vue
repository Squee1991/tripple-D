<template>
  <div class="dialogue-scene-wrapper">
    <!-- Оверлей загрузки рекламы -->
    <div v-if="isAdLoading" class="ad-overlay">
      <div class="ad-spinner"></div>
    </div>

    <!-- ТОЧНАЯ КОПИЯ МОДАЛКИ (VReviveModal style) -->
    <div v-if="showReviveModal" class="revive-overlay" @click.self="showReviveModal = false">
      <div class="revive-modal">
        <h2 class="revive-title">Повторить попытку?</h2>

        <p class="revive-subtitle">
          Вы ответили верно {{ correctAnswers }} / {{ recipe?.ingredients?.length || 0 }}.<br>
          Купите попытку, чтобы продолжить.
        </p>

        <div class="revive-wallet-box">
          <div class="revive-wallet-row">
            <span>Цена</span>
            <span>10 Артиклюсов</span>
          </div>
          <div class="revive-wallet-row">
            <span>У вас:</span>
            <span>{{ learningStore.points }} Артиклюсов</span>
          </div>
        </div>

        <div class="revive-actions">
          <button class="revive-btn revive-btn--ad">
            Смотреть рекламу
          </button>

          <button
              class="revive-btn revive-btn--buy"
              :disabled="learningStore.points < 10"
              @click="buyRetry"
          >
            Купить за 10
          </button>

          <button class="revive-btn revive-btn--back" @click="goBack">
            К темам
          </button>
        </div>
      </div>
    </div>

    <!-- Основной интерфейс (не трогаем) -->
    <div class="dialogue-scene">
      <div class="dialogue-scene__chef-container">
        <img :src="chefImage" alt="Шеф-повар Артикль" class="dialogue-scene__chef-img"/>
      </div>
      <div class="dialogue-scene__main-content">
        <div class="dialogue__header">
          <VBackBtnNav/>
          <div></div>
        </div>
        <div ref="messageListEl" class="dialogue-scene__messages">
          <div
              v-for="(message, index) in displayedMessages"
              :key="`msg-${index}`"
              class="message-bubble"
              :class="{ 'message-bubble--user': message.speaker === 'user' }"
          >
            <div class="message-bubble__avatar">
              <template v-if="message.speaker === 'chef'">
                <img :src="chefImage" alt="Шеф"/>
              </template>
              <template v-else>
                <img v-if="authStore.avatarUrl" :src="authStore.avatarUrl" alt="Я"/>
                <div v-else class="avatar-placeholder-chat"></div>
              </template>
            </div>
            <div class="message-bubble__content"
                 :class="[message.status, { 'user-content': message.speaker === 'user' }]">
              <ul v-if="message.isList" class="message-bubble__list">
                <li v-for="item in message.text" :key="item">{{ item }}</li>
              </ul>
              <span v-else>{{ message.text }}</span>
            </div>
          </div>
          <div v-if="isTyping" class="message-bubble">
            <div class="message-bubble__avatar">
              <img :src="chefImage" alt="Шеф"/>
            </div>
            <div class="message-bubble__content typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
        <div class="dialogue-scene__footer">
          <div v-if="stage === 'test'" class="article-test">
            <div v-if="currentTestWord" class="article-test__word">
              <span v-if="isAnswered"
                    class="article-test__revealed-article"
                    :class="lastAnswer.status"
              >
                {{ currentTestWord.article }}
              </span>
              <span>{{ currentTestWord.word }}</span>
            </div>
            <div v-if="currentTestWord" class="article-test__buttons">
              <button
                  v-for="article in articleChoices"
                  :key="article"
                  @click="checkArticle(article)"
                  :disabled="isAnswered"
                  class="article-test__button"
                  :class="getButtonClass(article)"
              >
                {{ article }}
              </button>
            </div>
          </div>
          <div v-if="stage === 'prompt'" class="choice-buttons">
            <button
                v-for="choice in recipe.knowledgeCheck.choices"
                :key="choice.text"
                @click="handleUserChoice(choice)"
                class="choice-buttons__button"
            >
              {{ choice.text }}
            </button>
          </div>
          <div class="finished__btns-wrapper" v-if="stage === 'finished'">
            <button @click="proceed" class="start-button">{{ finalButtonText }}</button>
            <button
                v-if="!testPassed"
                @click="retryTest"
                class="start-button"
            >
              Повторить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, nextTick, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useQuestStore} from '../../../store/questStore.js';
import {userlangStore} from '../../../store/learningStore.js';
import {userAuthStore} from '../../../store/authStore.js';

import ChefHi from '../../../assets/images/chefHi.svg';
import ChefOk from '../../../assets/images/ok.svg';
import ChefNo from '../../../assets/images/no.svg';
import ChefTalk from '../../../assets/images/Chef talk.png';

import TravelHi from '../../../assets/images/travell Hi.png';
import TravelOk from '../../../assets/images/travell Ok.png';
import TravelNo from '../../../assets/images/travell No.png';
import TravelTalk from '../../../assets/images/travell Talk.png';
import VBackBtn from "~/src/components/V-back-btn.vue";
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";

const questStore = useQuestStore();
const learningStore = userlangStore();
const authStore = userAuthStore();
const router = useRouter();
const route = useRoute();
const recipeId = route.params.id;

const recipe = computed(() => questStore.currentRecipe);
const articleChoices = ['der', 'die', 'das'];
const {t} = useI18n()
const stage = ref('loading');
const displayedMessages = ref([]);
const isTyping = ref(false);
const messageListEl = ref(null);
const isAnswered = ref(false);
const finalButtonText = ref('');
const testPassed = ref(false);
const currentTestWordIndex = ref(0);
const correctAnswers = ref(0);
const lastAnswer = ref({choice: null, status: null});
const chefImage = ref('');
const chefImages = ref({hi: '', ok: '', no: ''});

// Стэйт модалки и рекламы
const showReviveModal = ref(false);
const isAdLoading = ref(false);

const getChefImagesByTheme = (theme) => {
  if (theme === 'food') {
    return {hi: ChefHi, ok: ChefOk, no: ChefNo};
  } else {
    return {hi: TravelHi, ok: TravelOk, no: TravelNo};
  }
};

const startRetrySequence = async () => {
  showReviveModal.value = false;
  await playDialogue([{speaker: 'chef', text: 'Kein Problem! Eine neue Chance!'}]);
  currentTestWordIndex.value = 0;
  correctAnswers.value = 0;
  isAnswered.value = false;
  lastAnswer.value = {choice: null, status: null};
  displayedMessages.value = [];
  stage.value = 'test';
};

const retryTest = () => {
  showReviveModal.value = true;
};

const buyRetry = async () => {
  if (learningStore.points >= 10) {
    learningStore.points -= 10;
    startRetrySequence();
  }
};

/*const watchAdRetry = () => {
  isAdLoading.value = true;
  showRewarded(
      async () => {
        isAdLoading.value = false;
        startRetrySequence();
      },
      (gotReward) => {
        isAdLoading.value = false;
        if (!gotReward) {
          console.log("Юзер закрыл рекламу раньше времени.");
        }
      }
  );
};*/

const goBack = () => {
  showReviveModal.value = false;
  router.push('/articles');
};

const playDialogue = async (messages) => {
  for (const msg of messages) {
    if (msg.speaker === 'chef') {
      isTyping.value = true;
      await new Promise(res => setTimeout(res, 1200));
      isTyping.value = false;
    }
    displayedMessages.value.push(msg);
  }
};

const handleUserChoice = async (choice) => {
  displayedMessages.value = [];
  displayedMessages.value.push({speaker: 'user', text: choice.text});
  await playDialogue([{speaker: 'chef', text: choice.response}]);
  stage.value = 'test';
};

const currentTestWord = computed(() => recipe.value?.ingredients[currentTestWordIndex.value]);

const checkArticle = async (chosenArticle) => {
  isAnswered.value = true;
  const wordData = currentTestWord.value;

  displayedMessages.value.push({speaker: 'user', text: `${chosenArticle} ${wordData.word}`});

  let feedbackMessage = '';
  let status = '';

  if (chosenArticle === wordData.article) {
    correctAnswers.value++;
    feedbackMessage = `Richtig! Es ist '${wordData.article} ${wordData.word}'.`;
    status = 'success';
    lastAnswer.value = {choice: chosenArticle, status: 'correct'};
  } else {
    feedbackMessage = `Nicht ganz. Es ist '${wordData.article} ${wordData.word}'.`;
    status = 'error';
    lastAnswer.value = {choice: chosenArticle, status: 'incorrect'};
  }

  await playDialogue([{speaker: 'chef', text: feedbackMessage, status}]);
  await new Promise(res => setTimeout(res, 900));

  if (currentTestWordIndex.value < recipe.value.ingredients.length - 1) {
    currentTestWordIndex.value++;
    isAnswered.value = false;
    lastAnswer.value = {choice: null, status: null};
  } else {
    finishTest();
  }
};

const getButtonClass = (article) => {
  const colorClass = `article-test__button--${article}`;
  if (isAnswered.value) {
    if (article === currentTestWord.value.article) return `${colorClass} article-test__button--correct`;
    if (article === lastAnswer.value.choice) return `${colorClass} article-test__button--incorrect`;
    return `${colorClass} article-test__button--disabled`;
  }
  return colorClass;
};

const finishTest = async () => {
  stage.value = 'intro';
  const accuracy = Math.round((correctAnswers.value / recipe.value.ingredients.length) * 100);
  let feedbackMessage;

  if (accuracy >= 60) {
    feedbackMessage = recipe.value.postTestFeedback.success.replace('{accuracy}', accuracy);
    finalButtonText.value = t('recipes.start');
    testPassed.value = true;
  } else {
    feedbackMessage = recipe.value.postTestFeedback.failure.replace('{accuracy}', accuracy);
    finalButtonText.value = t('recipes.training');
    testPassed.value = false;
  }

  await playDialogue([{speaker: 'chef', text: feedbackMessage, status: testPassed.value ? 'success' : 'error'}]);
  stage.value = 'finished';
};

const proceed = () => {
  if (testPassed.value) {
    router.push(`/recipes/${recipeId}/task`);
  } else {
    router.push('/articles');
  }
};

onMounted(async () => {
  try {
    const nextId = questStore.getNextRecipeId(recipeId);
    const cooldown = await questStore.isRecipeCooldown(recipeId);
    if (cooldown) {
      if (nextId) {
        const isNextReady = await questStore.isNextRecipeAvailable(recipeId);
        if (isNextReady) {
          await playDialogue([{speaker: 'chef', text: t('recipes.did'), status: 'success'}]);
          router.replace(`/recipes/${nextId}`);
          return;
        } else {
          const seconds = await questStore.getRemainingCooldown(recipeId);
          const minutes = Math.floor(seconds / 60);
          const sec = seconds % 60;
          const formatted = `${minutes > 0 ? `${minutes} min. ` : ''}${sec} sec`;
          await playDialogue([{speaker: 'chef', text: t('recipes.timer') + `${formatted}`, status: 'error'}]);
          return;
        }
      } else {
        await playDialogue([{speaker: 'chef', text: t('recipes.didAll'), status: 'success'}]);
        return;
      }
    }

    await questStore.loadRecipeById(recipeId);
    if (!recipe.value) {
      await playDialogue([{speaker: 'chef', text: t('recipes.notFound')}]);
      return;
    }

    const theme = recipe.value.theme || 'travel';
    chefImages.value = getChefImagesByTheme(theme);
    chefImage.value = chefImages.value.hi;
    const introDialogueObjects = recipe.value.introDialogue.map(line => ({speaker: 'chef', text: line}));
    await playDialogue(introDialogueObjects);
    const ingredientNames = recipe.value.ingredients.map(i => i.word);
    await playDialogue([{speaker: 'chef', text: ingredientNames, isList: true}]);
    await playDialogue([{speaker: 'chef', text: recipe.value.knowledgeCheck.prompt}]);
    stage.value = 'prompt';
  } catch (error) {
    console.error('Error:', error);
    await playDialogue([{speaker: 'chef', text: t('recipes.error')}]);
  }
});

watch(displayedMessages, () => {
  nextTick(() => {
    if (messageListEl.value) messageListEl.value.scrollTop = messageListEl.value.scrollHeight;
  });
}, {deep: true});
</script>

<style scoped>
.dialogue-scene-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.dialogue-scene {
  width: 100%;
  height: 100%;
  display: flex;
  font-family: Nunito, sans-serif;
}

/* Оверлей рекламы */
.ad-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(27, 27, 27, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
}

.ad-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #00c2ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================
   НОВЫЕ ТОЧНЫЕ СТИЛИ ИЗ ВТОРОГО СКРИНШОТА
========================================= */

.revive-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(2px);
}

.revive-modal {
  background: #ffffff;
  width: 100%;
  max-width: 500px;
  border-radius: 24px 24px 0 0;
  padding: 30px 24px 40px;
  text-align: center;
  font-family: "Nunito", sans-serif;
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
}

.revive-title {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin-top: 0;
  margin-bottom: 10px;
}

.revive-subtitle {
  font-size: 16px;
  color: #64748b;
  line-height: 1.5;
  margin-top: 0;
  margin-bottom: 20px;
}

.revive-wallet-box {
  background: #fffdf0;
  border: 1px solid #fde047;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.revive-wallet-row {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  color: #b45309;
  font-size: 16px;
  padding: 4px 0;
}

.revive-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.revive-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  border-radius: 14px;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  font-size: 18px;
  color: #ffffff;
  border: none;
  cursor: pointer;
  transition: all 0.1s ease;
}

.revive-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent !important;
}

.revive-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Оранжевая кнопка */
.revive-btn--ad {
  background-color: #f59e0b;
  box-shadow: 0 4px 0 #d97706;
}

/* Зеленая кнопка */
.revive-btn--buy {
  background-color: #65a30d;
  box-shadow: 0 4px 0 #4d7c0f;
}

.revive-btn--buy:disabled {
  box-shadow: 0 4px 0 #4d7c0f;
}

/* Голубая кнопка */
.revive-btn--back {
  background-color: #60a5fa;
  box-shadow: 0 4px 0 #3b82f6;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}


/* =========================================
   СТИЛИ ДИАЛОГА (НЕ ТРОГАЕМ)
========================================= */

.dialogue__header {
  padding: 5px 10px 15px 10px;
}

.dialogue-scene__chef-container {
  width: 40%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  transition: background-color 0.3s;
}

.dialogue-scene__chef-img {
  max-width: 100%;
  max-height: 80%;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.dialogue-scene__chef-img:hover {
  transform: scale(1.05);
}

.dialogue-scene__main-content {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dialogue-scene__messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.dialogue-scene__footer {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-bubble {
  display: flex;
  width: 100%;
  animation: fadeIn 0.5s ease-out;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 10px;
}

.message-bubble--user {
  flex-direction: row-reverse;
}

.message-bubble__avatar {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.message-bubble__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder-chat {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #5b65e9, #8a93ff);
}

.message-bubble__content {
  max-width: 80%;
  padding: 1rem 1.5rem;
  border-radius: 20px;
  line-height: 1.3;
  font-size: 16px;
  font-weight: 600;
  font-style: italic;
  background-color: #eef2ff;
  color: #1e293b;
  border-bottom-left-radius: 5px;
  border-left: 5px solid #818cf8;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.message-bubble__content:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.05);
}

.user-content {
  background-color: #f8fafc;
  color: #0f172a;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 5px;
  border-left: none;
  border-right: 5px solid #4767de;
}

.message-bubble__list {
  list-style-type: '✅';
  font-weight: 600;
  color: #16c02c;
  padding-left: 20px;
}

.message-bubble__content.success {
  background-color: #17a94c;
  border-left-color: #4ade80;
  color: white;
  font-weight: 600;
}

.message-bubble__content.error {
  background-color: #ca5d5d;
  border-left-color: #c47272;
  color: white;
  font-weight: 600;
}

.article-test {
  width: 100%;
  text-align: center;
  animation: fadeIn 0.3s;
}

.article-test__word {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 2rem;
  color: var(--titleColor);
}

.article-test__buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.article-test__button {
  min-width: 140px;
  padding: 1rem;
  font-size: 1.8rem;
  font-weight: 500;
  border-radius: 16px;
  border: 3px solid #111827;
  box-shadow: 6px 6px 0px #d1d5db;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.article-test__revealed-article {
  margin-right: 6px;
}

.article-test__button:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #d1d5db;
}

.article-test__button--correct {
  background-color: #4ade80;
  color: #fff;
  border-color: #16a34a;
  transform: scale(1.1);
}

.article-test__button--incorrect {
  background-color: #f87171;
  color: #fff;
  border-color: #b91c1c;
  animation: shake 0.5s;
}

.article-test__button--disabled {
  opacity: 0.4;
  pointer-events: none;
}

.choice-buttons, .start-button, .choice-buttons__button {
  font-size: 1.2rem;
  padding: 1rem 2.5rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.choice-buttons {
  display: flex;
  gap: 1.5rem;
}

.finished__btns-wrapper {
  display: flex;
  width: 100%;
  gap: 10px;
}

.typing-indicator span {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #9ca3af;
  border-radius: 50%;
  margin: 0 2px;
  animation: bounce 1.2s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .dialogue-scene {
    flex-direction: column;
    overflow-y: hidden;
  }

  .dialogue-scene__chef-container {
    width: 100%;
    height: 35vh;
    padding: 1rem;
    order: 1;
  }

  .dialogue-scene__chef-img {
    max-height: 100%;
    max-width: 200px;
  }

  .dialogue-scene__main-content {
    width: 100%;
    height: 65vh;
    order: 2;
  }

  .dialogue-scene__messages {
    padding: 1rem;
    gap: 1rem;
  }

  .message-bubble__content {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
  }

  .dialogue-scene__footer {
    min-height: auto;
    padding: 1rem;
    flex-shrink: 0;
  }

  .article-test__buttons,
  .choice-buttons {
    gap: 1rem;
    align-items: center;
    width: 100%;
  }

  .article-test__button,
  .choice-buttons__button,
  .start-button {
    width: 100%;
    max-width: 400px;
    font-size: 1.1rem;
    padding: 1rem;
    min-width: unset;
    border: 2px solid var(--tabsSlideBorderColor);
    box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  }

  .article-test__button:active,
  .choice-buttons__button:active {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #d1d5db;
  }
}

@media (max-width: 1023px) {
  .dialogue-scene__chef-container {
    display: none;
  }

  .dialogue-scene__main-content {
    width: 100%;
    height: 100%;
  }

  .dialogue-scene__messages {
    padding: 1rem;
  }

  .message-bubble__content {
    padding: 10px;
    font-size: 1rem;
  }

  .dialogue-scene__footer {
    min-height: auto;
    padding: 1rem;
    flex-shrink: 0;
  }

  .article-test__buttons,
  .choice-buttons {
    gap: 1rem;
    align-items: center;
    width: 100%;
    font-size: 16px;
    border: none;
    box-shadow: none;
    padding: 0;
  }

  .article-test__button,
  .choice-buttons__button,
  .start-button {
    width: 100%;
    max-width: 400px;
    font-size: 19px;
    font-weight: 600;
    padding: 10px;
    border: none;
    border: 2px solid var(--tabsSlideBorderColor);
    box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  }

  .article-test__button:active,
  .choice-buttons__button:active {
    transform: translate(1px, 1px);
  }
}
</style>