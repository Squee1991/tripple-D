<template>
    <div class="game-container">
        <div class="player-info">
            <div>🧑‍🎓 Ты: {{ playerScore }}</div>
            <div>🧑‍🎓 Соперник: {{ opponentScore }}</div>
        </div>

        <div class="sentence-zone">
            <div class="word" v-for="(word, index) in shuffledWords" :key="index" @click="selectWord(word, index)" :class="{ selected: selectedIndexes.includes(index) }">
                {{ word }}
            </div>
        </div>

        <div class="result-zone">
            <div class="word" v-for="(word, index) in selectedWords" :key="index">{{ word }}</div>
        </div>

        <button @click="submitAnswer" :disabled="selectedWords.length !== correctSentence.length">Готово</button>

        <div v-if="showResult" class="result-message">
            <div v-if="isCorrect">✅ Верно!</div>
            <div v-else>❌ Неверно. Правильно: {{ correctSentence.join(' ') }}</div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue'
    const correctSentence = ref(["Ich", "lese", "abends", "gern", "Bücher"])
    const shuffledWords = ref([])
    const selectedWords = ref([])
    const selectedIndexes = ref([])
    const showResult = ref(false)
    const isCorrect = ref(false)
    const playerScore = ref(0)
    const opponentScore = ref(0)

    function shuffle(array) {
        return array.slice().sort(() => Math.random() - 0.5)
    }

    shuffledWords.value = shuffle(correctSentence.value)

    function selectWord(word, index) {
        if (!selectedIndexes.value.includes(index)) {
            selectedWords.value.push(word)
            selectedIndexes.value.push(index)
        }
    }

    function submitAnswer() {
        showResult.value = true
        const userSentence = selectedWords.value.join(' ')
        const correct = correctSentence.value.join(' ')
        isCorrect.value = userSentence === correct
        if (isCorrect.value) {
            playerScore.value += 1
        }
        // В бою сюда добавится отправка на сервер, проверка времени и т.д.
    }
</script>

<style scoped>
    .game-container {
        max-width: 600px;
        margin: 0 auto;
        font-family: sans-serif;
        text-align: center;
    }
    .player-info {
        display: flex;
        justify-content: space-around;
        margin-bottom: 20px;
    }
    .sentence-zone {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
    }
    .word {
        padding: 10px 14px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 6px;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s;
    }
    .word.selected {
        background-color: #d1e7dd;
        border-color: #0f5132;
    }
    .result-zone {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
    }
    button {
        padding: 10px 20px;
        font-weight: bold;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
    }
    .result-message {
        margin-top: 20px;
        font-size: 1.2rem;
        font-weight: bold;
    }
</style>
