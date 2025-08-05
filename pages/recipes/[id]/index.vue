<template>
    <div class="dialogue-scene">
        <div class="dialogue-scene__chef-container">
            <img :src="chefImage" alt="Шеф-повар Артикль" class="dialogue-scene__chef-img"/>
        </div>
        <div class="dialogue-scene__main-content">
            <div ref="messageListEl" class="dialogue-scene__messages">
                <div v-for="(message, index) in displayedMessages" :key="`msg-${index}`" class="message-bubble">
                    <div class="message-bubble__content" :class="message.status">
                        <ul v-if="message.isList" class="message-bubble__list">
                            <li v-for="item in message.text" :key="item">{{ item }}</li>
                        </ul>
                        <span v-else>{{ message.text }}</span>
                    </div>
                </div>
                <div v-if="isTyping" class="message-bubble">
                    <div class="message-bubble__content typing-indicator">
                        <span></span><span></span><span></span>
                    </div>
                </div>
            </div>
            <div class="dialogue-scene__footer">
                <div v-if="stage === 'test'" class="article-test">
                    <div v-if="currentTestWord" class="article-test__word">{{ currentTestWord.word }}</div>
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
                <div v-if="stage === 'finished'">
                    <button @click="proceed" class="start-button">{{ finalButtonText }}</button>
                    <button
                            v-if="!testPassed"
                            @click="retryTest"
                            class="start-button"
                    >
                        Попробовать ещё раз за 1 Артиклюс
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuestStore } from '../../../store/questStore.js';
import { userlangStore } from '../../../store/learningStore.js';

// FOOD (еда)
import ChefHi from '../../../assets/images/chefHi.svg';
import ChefOk from '../../../assets/images/ok.svg';
import ChefNo from '../../../assets/images/no.svg';
import ChefTalk from '../../../assets/images/Chef talk.png'

// TRAVEL (путешествия)
import TravelHi from '../../../assets/images/travell Hi.png';
import TravelOk from '../../../assets/images/travell Ok.png';
import TravelNo from '../../../assets/images/travell No.png';
import TravelTalk from '../../../assets/images/travell Talk.png'

const questStore = useQuestStore();
const learningStore = userlangStore();
const router = useRouter();
const route = useRoute();
const recipeId = route.params.id;

const recipe = computed(() => questStore.currentRecipe);
const articleChoices = ['der', 'die', 'das'];

const stage = ref('loading');
const displayedMessages = ref([]);
const isTyping = ref(false);
const messageListEl = ref(null);
const isAnswered = ref(false);
const finalButtonText = ref('');
const testPassed = ref(false);
const currentTestWordIndex = ref(0);
const correctAnswers = ref(0);
const lastAnswer = ref({ choice: null, status: null });
const chefImage = ref('');
const chefImages = ref({ hi: '', ok: '', no: '' });

// Функция для получения изображений по теме
const getChefImagesByTheme = (theme) => {
    if (theme === 'food') {
        return {
            hi: ChefHi,
            ok: ChefOk,
            no: ChefNo,
        };
    } else if (theme === 'travel') {
        return {
            hi: TravelHi,
            ok: TravelOk,
            no: TravelNo,
        };
    } else {
        return {
            hi: TravelHi,
            ok: TravelOk,
            no: TravelNo,
        };
    }
};

const retryTest = async () => {
    if (learningStore.points < 1) {
        await playDialogue([{ speaker: 'chef', text: 'Du hast nicht genug Artiklus!', status: 'error' }]);
        return;
    }
    learningStore.points -= 1;
    await playDialogue([{ speaker: 'chef', text: 'Kein Problem! Eine neue Chance für 1 Artiklus!' }]);
    currentTestWordIndex.value = 0;
    correctAnswers.value = 0;
    isAnswered.value = false;
    lastAnswer.value = { choice: null, status: null };
    displayedMessages.value = [];
    stage.value = 'test';
    chefImage.value = chefImages.value.hi;
};

const playDialogue = async (messages) => {
    for (const msg of messages) {
        isTyping.value = true;
        await new Promise(res => setTimeout(res, 1200));
        isTyping.value = false;
        displayedMessages.value.push(msg);
    }
};

const handleUserChoice = async (choice) => {
    displayedMessages.value = [];
    await playDialogue([{ speaker: 'chef', text: choice.response }]);
    stage.value = 'test';
};

const currentTestWord = computed(() => recipe.value?.ingredients[currentTestWordIndex.value]);

const checkArticle = async (chosenArticle) => {
    isAnswered.value = true;
    const wordData = currentTestWord.value;
    let feedbackMessage = '';
    let status = '';
    if (chosenArticle === wordData.article) {
        correctAnswers.value++;
        chefImage.value = chefImages.value.ok;
        feedbackMessage = `Richtig! Es ist '${wordData.article} ${wordData.word}'.`;
        status = 'success';
        lastAnswer.value = { choice: chosenArticle, status: 'correct' };
    } else {
        chefImage.value = chefImages.value.no;
        feedbackMessage = `Nicht ganz. Es ist '${wordData.article} ${wordData.word}'.`;
        status = 'error';
        lastAnswer.value = { choice: chosenArticle, status: 'incorrect' };
    }
    await playDialogue([{ speaker: 'chef', text: feedbackMessage, status }]);
    await new Promise(res => setTimeout(res, 900));
    if (currentTestWordIndex.value < recipe.value.ingredients.length - 1) {
        currentTestWordIndex.value++;
        isAnswered.value = false;
        lastAnswer.value = { choice: null, status: null };
        chefImage.value = chefImages.value.hi;
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
        finalButtonText.value = 'Начать задание!';
        testPassed.value = true;
        chefImage.value = chefImages.value.ok;
    } else {
        feedbackMessage = recipe.value.postTestFeedback.failure.replace('{accuracy}', accuracy);
        finalButtonText.value = 'К тренировке';
        testPassed.value = false;
        chefImage.value = chefImages.value.no;
    }
    await playDialogue([{ speaker: 'chef', text: feedbackMessage, status: testPassed.value ? 'success' : 'error' }]);
    stage.value = 'finished';
};

const proceed = () => {
    if (testPassed.value) {
        router.push(`/recipes/${recipeId}/task`);
    } else {
        router.push('/recipes');
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
                    await playDialogue([{ speaker: 'chef', text: `Ты уже выполнил это задание. Загружаю следующее...`, status: 'success' }]);
                    router.replace(`/recipes/${nextId}`);
                    return;
                } else {
                    const seconds = await questStore.getRemainingCooldown(recipeId);
                    const minutes = Math.floor(seconds / 60);
                    const sec = seconds % 60;
                    const formatted = `${minutes > 0 ? `${minutes} мин. ` : ''}${sec} сек.`;
                    await playDialogue([{ speaker: 'chef', text: `Следующее задание будет доступно через ${formatted}`, status: 'error' }]);
                    return;
                }
            } else {
                await playDialogue([{ speaker: 'chef', text: `Ты выполнил всё в этой теме!`, status: 'success' }]);
                return;
            }
        }

        await questStore.loadRecipeById(recipeId);
        if (!recipe.value) {
            await playDialogue([{ speaker: 'chef', text: 'Рецепт не найден.' }]);
            return;
        }

        // Задание темы и изображений
        const theme = recipe.value.theme || 'travel'; // default
        chefImages.value = getChefImagesByTheme(theme);
        chefImage.value = chefImages.value.hi;

        const introDialogueObjects = recipe.value.introDialogue.map(line => ({ speaker: 'chef', text: line }));
        await playDialogue(introDialogueObjects);
        const ingredientNames = recipe.value.ingredients.map(i => i.word);
        await playDialogue([{ speaker: 'chef', text: ingredientNames, isList: true }]);
        await playDialogue([{ speaker: 'chef', text: recipe.value.knowledgeCheck.prompt }]);
        stage.value = 'prompt';
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        await playDialogue([{ speaker: 'chef', text: 'Упс, не могу найти рецепты.' }]);
    }
});

watch(displayedMessages, () => {
    nextTick(() => {
        if (messageListEl.value) messageListEl.value.scrollTop = messageListEl.value.scrollHeight;
    });
}, { deep: true });

</script>


<style scoped>

.dialogue-scene {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f3f4f6;
    display: flex;
    font-family: 'Fredoka', sans-serif;
}

.dialogue-scene__chef-container {
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e7ff;
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
    background-color: #fff;
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
    min-height: 220px;
    padding: 1.5rem;
    background-color: #f9fafb;
    border-top: 2px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
}

.message-bubble {
    display: flex;
    width: 100%;
    animation: fadeIn 0.5s ease-out;
    justify-content: flex-start;
}

.message-bubble__content {
    max-width: 80%;
    padding: 1rem 1.5rem;
    border-radius: 20px;
    line-height: 1.6;
    font-size: 1.1rem;
    background-color: #eef2ff;
    border: 2px solid #c7d2fe;
    border-bottom-left-radius: 5px;
}

.message-bubble__list {
    list-style-type: '✅ ';
    padding-left: 1.5rem;
}

.message-bubble__content.success {
    background-color: #dcfce7;
}

.message-bubble__content.error {
    background-color: #fee2e2;
}

.article-test {
    width: 100%;
    text-align: center;
    animation: fadeIn 0.3s;
}

.article-test__word {
    font-size: 3.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: #374151;
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

.article-test__button:hover {
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px #d1d5db;
}

.article-test__button:active {
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0px #d1d5db;
}

.article-test__button--der {
    background-color: #dbeafe;
    color: #1e40af;
}

.article-test__button--die {
    background-color: #fee2e2;
    color: #9f1239;
}

.article-test__button--das {
    background-color: #dcfce7;
    color: #166534;
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
    padding: 1.2rem 2.5rem;
    font-family: 'Fredoka', sans-serif;
    font-weight: 500;
    border-radius: 16px;
    border: 3px solid #111827;
    box-shadow: 6px 6px 0px #d1d5db;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
}

.choice-buttons {
    display: flex;
    gap: 1.5rem;
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

@keyframes shake {
    0%, 100% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-8px);
    }
    75% {
        transform: translateX(8px);
    }
}

@keyframes bounce {
    0%, 60%, 100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-8px);
    }
}
</style>