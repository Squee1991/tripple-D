<script setup>
import { useGameStore } from '../../store/SentenceDuelStore.js';
import { userAuthStore } from '../../store/authStore.js';
import { useSentencesStore } from '../../store/sentencesStore.js';
import { useRoute } from 'vue-router';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const route = useRoute();
const gameStore = useGameStore();
const authStore = userAuthStore();
const sentencesStore = useSentencesStore();  // ← добавили
const currentAnswer = ref('');

onMounted(async () => {
    // 1) ждём загрузки предложений
    await sentencesStore.loadSentences();

    // 2) только после этого подключаемся к сессии
    const sessionId = route.params.id;
    if (sessionId) {
        gameStore.listenToSession(sessionId);
    }
});

onUnmounted(() => gameStore.leaveSession());

function addWordToAnswer(word) {
    currentAnswer.value = currentAnswer.value
        ? `${currentAnswer.value} ${word}`
        : word;
}

function clearAnswer() {
    currentAnswer.value = '';
}

// Запуск каждого раунда при переходе в “starting”, если ещё нет scrambledWords
watch(
    () => gameStore.sessionData?.status,
    (newStatus) => {
        if (
            newStatus === 'starting' &&
            !gameStore.sessionData.currentRoundData?.scrambledWords
        ) {
            currentAnswer.value = '';
            gameStore.prepareCurrentRound();
        }
    }
);

// Отправка ответа сразу при изменении currentAnswer
watch(currentAnswer, (txt) => {
    if (gameStore.sessionData?.status === 'in_progress') {
        gameStore.submitAnswer(txt);
    }
});
</script>



<template>
    <div>
        <div v-if="!gameStore.sessionData">
            <p>Загрузка игры...!!</p>
        </div>
        <div v-else>
            <h1>Уровень: {{ gameStore.sessionData.level }}</h1>
            <h2>Раунд: {{ gameStore.sessionData.currentRoundIndex + 1 }} / {{ gameStore.sessionData.totalRounds }}</h2>
            <div v-for="(player, playerId) in gameStore.sessionData.players" :key="playerId">
                <p>Игрок {{ player.name || playerId }}: {{ player.score }} очков</p>
            </div>
            <div v-if="gameStore.sessionData.status === 'round_over'">
                <h3>Раунд завершен!</h3>
                <p v-if="gameStore.sessionData.rounds[gameStore.sessionData.currentRoundIndex].winner">
                    Победитель: {{ gameStore.sessionData.players[gameStore.sessionData.rounds[gameStore.sessionData.currentRoundIndex].winner].name }}
                </p>
            </div>
            <div v-else-if="gameStore.sessionData.status === 'in_progress' && gameStore.sessionData.currentRoundData">
                <h3>Соберите предложение:</h3>
                <div class="scrambled-words">
                    <button
                            v-for="(word, index) in gameStore.sessionData.currentRoundData.scrambledWords"
                            :key="index"
                            @click="addWordToAnswer(word)"
                            class="word-button"
                    >
                        {{ word }}
                    </button>
                </div>
                <div class="answer-section">
                    <input type="text" placeholder="Ваш ответ появится здесь" v-model="currentAnswer" readonly>
                    <button @click="clearAnswer" class="clear-button">Очистить</button>
                </div>
            </div>

            <div v-else-if="gameStore.sessionData.status === 'finished'">
                <h2>Игра окончена!</h2>
            </div>

            <div v-else>
                <p>Приготовьтесь, раунд начинается...</p>
            </div>
        </div>
    </div>
</template>

<style>
    .scrambled-words span {
        display: inline-block;
        padding: 10px;
        margin: 5px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .word-button {
        padding: 10px 15px;
        margin: 5px;
        font-size: 1rem;
        background-color: #e7e7e7;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    .word-button:hover {
        background-color: #d1d1d1;
    }
    .answer-section {
        margin-top: 20px;
        display: flex;
        align-items: center;
    }
    .answer-section input {
        flex-grow: 1;
        padding: 10px;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #fff;
    }
    .clear-button {
        margin-left: 10px;
        padding: 10px 15px;
        background-color: #f44336;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .clear-button:hover {
        background-color: #d32f2f;
    }
</style>