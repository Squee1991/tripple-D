<script setup>

    import {useGameStore} from '../../store/SentenceDuelStore.js';
    import {userAuthStore} from '../../store/authStore.js';
    import {useRoute} from 'vue-router';
    import {onMounted, onUnmounted, ref, watch} from 'vue';

    const route = useRoute();
    const gameStore = useGameStore();
    const authStore = userAuthStore();
    const currentAnswer = ref('');
    let debounceTimer = null;

    onMounted(() => {
        const sessionId = route.params.id;
        if (sessionId) {
            gameStore.listenToSession(sessionId);
        }
    });

    onUnmounted(() => {
        gameStore.leaveSession();
    });

    watch(() => gameStore.sessionData, (newData, oldData) => {
        if (!newData) return;
        const isHost = newData.hostId === authStore.uid;
        if (isHost && newData.status === 'starting') {
            gameStore.prepareCurrentRound();
        }

        if (isHost && newData.status === 'in_progress' && newData.currentRoundData?.answers !== oldData?.currentRoundData?.answers) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                gameStore.checkRoundWinner();
            }, 500);

        }
        if (newData.status === 'starting' && oldData?.status === 'round_over') {
            currentAnswer.value = '';
        }
    }, {deep: true});

    watch(currentAnswer, (newText) => {
        gameStore.submitAnswer(newText);

    });


</script>
<template>
    <div>
        <div v-if="!gameStore.sessionData">
            <p>Загрузка игры...</p>
        </div>
        <div v-else>
            <h1>Уровень: {{ gameStore.sessionData.level }}</h1>
            <h2>Раунд: {{ gameStore.sessionData.currentRoundIndex + 1 }} / {{ gameStore.sessionData.totalRounds }}</h2>
            <div v-for="(player, playerId) in gameStore.sessionData.players" :key="playerId">
                <p>Игрок {{ player.name || playerId }}: {{ player.score }} очков</p>
            </div>
            <div v-if="gameStore.sessionData.status === 'round_over'">
                <h3>Раунд завершен!</h3>
            </div>
            <div v-else-if="gameStore.sessionData.status === 'in_progress' && gameStore.sessionData.currentRoundData">
                <h3>Соберите предложение:</h3>
                <div class="scrambled-words">
                    <span v-for="(word, index) in gameStore.sessionData.currentRoundData.scrambledWords" :key="index">
                        {{ word }}
                    </span>
                </div>
                <input type="text" placeholder="Ваш ответ" v-model="currentAnswer">
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

</style>