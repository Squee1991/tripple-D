<script setup>
    import { useGameStore } from '../store/SentenceDuelStore.js';
    import { useRouter } from 'vue-router';
    import { watch, computed } from 'vue';
    // import { useSentencesStore } from '../store/sentencesStore.js';
    // const sentencesStore = useSentencesStore();
    const gameStore = useGameStore();
    const router = useRouter();
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

    const isWaitingForOpponent = computed(() => {
        return !!gameStore.gameId && gameStore.sessionData?.status === 'waiting';
    });

    const isOpponentFound = computed(() => {
        return gameStore.sessionData?.status === 'starting';
    });

    function handleFindGameClick(level) {
        gameStore.findGame(level);
    }

    watch(() => gameStore.sessionData?.status, (newStatus) => {
        if (newStatus === 'starting') {
            setTimeout(() => {
                if (gameStore.gameId) {
                    router.push(`/game/${gameStore.gameId}`);
                }
            }, 2000);
        }
    });
</script>

<template>
    <div>
        <div v-if="!isWaitingForOpponent && !isOpponentFound">
            <p>Выберите уровень для игры:</p>
            <button
                    v-for="level in levels"
                    :key="level"
                    @click="handleFindGameClick(level)"

                    :disabled="gameStore.isSearching"
            >
                Играть ({{ level }})
            </button>
            <p v-if="gameStore.error">{{ gameStore.error }}</p>
        </div>
        <div v-else-if="isWaitingForOpponent">
            <p>Идёт поиск соперника...</p>
        </div>
        <div v-else-if="isOpponentFound">
            <p>Противник найден!</p>
            <p>Игра начнется через несколько секунд...</p>
        </div>
    </div>
</template>