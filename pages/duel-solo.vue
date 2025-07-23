<script setup>
    import {ref, computed, onMounted} from 'vue'
    import {useRouter, useRoute} from 'vue-router'
    import {useGameStore} from '../store/sentenceDuelStore.js'
    const {t} = useI18n()
    const router = useRouter()
    const route = useRoute()
    const gameStore = useGameStore()
    const level = route.query.level || 'A1'
    const tasks = ref([])
    const totalRounds = ref(8)
    const currentRound = ref(0)
    const scrambledWords = ref([])
    const currentQuestion = computed(() => tasks.value[currentRound.value])
    const answer = ref('')
    const finished = ref(false)
    const correctAnswers = ref(0)
    const showCountdown = ref(true)
    const countdown = ref(3)

    const isAnswerChecked = ref(false)
    const feedback = ref(null)
    function checkAnswer() {
        if (!answer.value) return;
        isAnswerChecked.value = true;
        if (answer.value.trim().toLowerCase() === currentQuestion.value.answer.trim().toLowerCase()) {
            feedback.value = 'correct';
            correctAnswers.value++;
        } else {
            feedback.value = 'incorrect';
        }
    }

    async function waitForNextQuestion(timeout = 1000) {
        const start = Date.now();
        while (!currentQuestion.value && Date.now() - start < timeout) {
            await new Promise(resolve => setTimeout(resolve, 20));
        }
    }

    function proceedToNextRound() {
        if (currentRound.value < totalRounds.value - 1) {
            currentRound.value++;
            answer.value = '';
            feedback.value = null;
            isAnswerChecked.value = false;
            waitForNextQuestion().then(() => {
                setScrambled();
            });
        } else {
            finished.value = true;
        }
    }

    function setScrambled() {
        if (!currentQuestion.value || !currentQuestion.value.question) return;
        const words = currentQuestion.value.question.split(' ');
        scrambledWords.value = words.filter(w => w).sort(() => Math.random() - 0.5);
    }

    function addWord(word) {
        if (isAnswerChecked.value && feedback.value === 'correct') return;
        if (answer.value) answer.value += ' ' + word
        else answer.value = word
    }

    function clearAnswer() {
        answer.value = '';
        isAnswerChecked.value = false;
        feedback.value = null;
    }

    onMounted(async () => {
        await gameStore.loadLocalTasks(level)
        tasks.value = gameStore.localTasks.map(sentence => {
            const cleanSentence = sentence.original.toLowerCase().replace(/[.,!?;]/g, '');
            return {
                question: cleanSentence,
                answer: cleanSentence
            };
        }).slice(0, totalRounds.value);

        if (tasks.value.length > 0) {
            setScrambled()
        } else {
            console.error("Не удалось загрузить или преобразовать задания для локальной игры.");
        }

        let n = 3
        countdown.value = n
        showCountdown.value = true
        const timer = setInterval(() => {
            countdown.value--
            if (countdown.value === 0) {
                clearInterval(timer)
                setTimeout(() => {
                    showCountdown.value = false
                }, 500)
            }
        }, 1000)
    })
</script>

<template>
    <div>
        <div v-if="showCountdown" class="countdown-overlay">
            <div class="countdown-content">
                <p v-if="countdown > 0" class="countdown-number">{{ countdown }}</p>
                <p v-else class="countdown-number start">{{ t('wordDuelSession.start') }}</p>
            </div>
        </div>
        <div class="game-page-wrapper">
            <div class="game-container">
                <div v-if="!finished" class="game-board">
                    <div class="round-counter">
                        {{ t('wordDuelSession.round') }} {{ currentRound + 1 }} / {{ totalRounds }}
                    </div>
                    <div class="word-pool">
                        <button v-for="(word, i) in scrambledWords" :key="i" @click="addWord(word)" class="word-button"
                                :disabled="isAnswerChecked && feedback === 'correct'">
                            {{ word }}
                        </button>
                    </div>
                    <div class="answer-section">
                        <input type="text" v-model="answer" readonly
                               :class="{ 'correct-answer': feedback === 'correct', 'incorrect-answer': feedback === 'incorrect' }">
                        <button @click="clearAnswer" class="btn btn-clear"
                                :disabled="isAnswerChecked && feedback === 'correct'">{{ t('wordDuelSession.clear') }}
                        </button>
                    </div>

                    <div v-if="isAnswerChecked" class="feedback-container">
                        <p v-if="feedback === 'correct'" class="feedback correct">✔ {{ t('prasens.correct')}}</p>
                        <p v-if="feedback === 'incorrect'" class="feedback incorrect">✖ {{ t('prasens.tryAgain')}}</p>
                    </div>

                    <div class="actions-container">
                        <button class="btn btn-leave" @click="router.back()">
                            {{ t('wordDuelSession.leaveBtn') }}
                        </button>
                        <button v-if="!isAnswerChecked" class="btn btn-check" @click="checkAnswer">{{ t('prasens.check')}}</button>
                        <button v-if="isAnswerChecked && feedback === 'correct'" class="btn btn-next"
                                @click="proceedToNextRound">{{ t('prasens.further')}}
                        </button>
                    </div>
                </div>
                <div v-else class="results-board">
                    <div class="result-icon">🏆</div>
                    <h3 class="result-title">{{ t('wordDuelSession.end') }}</h3>
                    <p class="result-subtitle">{{ t('trainerPage.result') }} {{ correctAnswers }} / {{ totalRounds
                        }}</p>
                    <div class="result-actions">
                        <button class="btn" @click="router.back()">{{ t('trainerPage.toMain') }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .countdown-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        color: #fff
    }

    @keyframes countdown-pulse {
        0% {
            transform: scale(.8);
            opacity: 0
        }
        50% {
            transform: scale(1.2);
            opacity: 1
        }
        100% {
            transform: scale(1);
            opacity: 1
        }
    }

    @keyframes start-fade-out {
        0% {
            transform: scale(1);
            opacity: 1
        }
        100% {
            transform: scale(1.5);
            opacity: 0
        }
    }

    .countdown-number {
        font-family: 'Fredoka One', cursive;
        font-size: 15rem;
        font-weight: 800;
        animation: countdown-pulse .9s ease-out
    }

    .countdown-number.start {
        font-size: 8rem;
        animation: start-fade-out .5s ease-in forwards
    }

    .game-page-wrapper {
        background-color: #FDF8F0;
        min-height: 100vh;
        font-family: 'Nunito', sans-serif;
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .game-container {
        width: 100%;
        max-width: 900px;
    }

    .game-board {
        background: #fff;
        border-radius: 24px;
        padding: 2rem 3rem;
        border: 3px solid #1e1e1e;
        box-shadow: 8px 8px 0 #1e1e1e;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        position: relative;
    }

    .results-board {
        text-align: center;
    }

    .round-counter {
        background-color: rgba(251, 226, 166, 0.8);
        padding: 8px 20px;
        border-radius: 12px;
        font-weight: 700;
        color: #3A3A3A;
        border: 2px solid #1e1e1e;
        margin-bottom: 1rem;
    }

    .word-pool {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        justify-content: center;
    }

    .word-button {
        padding: 12px 20px;
        font-size: 1.3rem;
        font-weight: 700;
        border-radius: 12px;
        border: 3px solid #1e1e1e;
        box-shadow: 4px 4px 0 #1e1e1e;
        background-color: #fff;
        cursor: pointer;
        transition: all .1s ease-in-out;
    }

    .word-button:hover:not(:disabled) {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #1e1e1e;
        background-color: #FFD24B;
    }

    .word-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .answer-section {
        display: flex;
        gap: 1rem;
        width: 100%;
        padding: 1rem;
        border-radius: 16px;
        border: 3px dashed #ccc;
    }

    .answer-section input {
        width: 100%;
        flex-grow: 1;
        border: none;
        background: #f0f0f0;
        padding: 15px;
        border-radius: 12px;
        font-size: 1.3rem;
        font-weight: 600;
        color: #3A3A3A;
        text-align: center;
        transition: all 0.2s ease;
    }

    .answer-section input:focus {
        outline: none;
    }

    .answer-section input.correct-answer {
        background-color: #d4edda;
        color: #155724;
    }

    .answer-section input.incorrect-answer {
        background-color: #f8d7da;
        color: #721c24;
    }

    .feedback-container {
        min-height: 30px;
        text-align: center;
    }

    .feedback {
        font-size: 1.5rem;
        font-weight: bold;
        animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .feedback.correct {
        color: #2E7D32;
    }

    .feedback.incorrect {
        color: #C62828;
    }

    .actions-container {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
    }

    .btn {
        padding: 12px 28px;
        font-size: 1.2rem;
        font-weight: 700;
        border-radius: 14px;
        border: 3px solid #1e1e1e;
        box-shadow: 4px 4px 0 #1e1e1e;
        cursor: pointer;
        transition: all .1s ease-in-out;
    }

    .btn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #1e1e1e;
    }

    .btn-leave {
        background-color: #f1f1f1;
        color: #555;
    }

    .btn-clear {
        background-color: #f8d7da;
    }

    .btn-clear:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn-check {
        background-color: #FFD24B;
    }

    .btn-next {
        background-color: #4ade80;
    }

    .result-icon {
        font-size: 4rem
    }

    .result-title {
        font-size: 2.5rem;
        margin: 1rem 0;
    }

    .result-subtitle {
        font-size: 1.2rem;
        margin-bottom: 2rem;
    }

    .result-actions .btn {
        margin: 0 auto;
        background: #FFD24B;
    }
</style>