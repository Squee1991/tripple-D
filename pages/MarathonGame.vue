<template>
    <div class="game-page-layout">
        <button @click="goBackToPrepare" class="back-btn">← Назад</button>
        <div v-if="!gameStore.gameReady" class="not-ready-container">
            <h1>{{ t('marathonGame.notReadyTitle')}}</h1>
            <p>{{ t('marathonGame.reboot') }}</p>
        </div>
        <template v-else>
            <header class="game-header">
                <div class="stats-bar">
                    <div class="stat-widget streak">
                        <div class="widget-label">{{ t('marathonGame.streak')}}</div>
                        <div class="widget-value">{{ gameStore.sessionStreak }}</div>
                    </div>
                    <div class="stat-widget record">
                        <div class="widget-label">{{ t('marathonGame.record') }}</div>
                        <div class="widget-value">{{ currentDifficultyRecord }}</div>
                    </div>
                    <div v-if="gameStore.levelSettings.timer" class="stat-widget timer">
                        <div class="widget-label">{{t('marathonGame.timer')}}</div>
                        <div class="widget-value">{{ gameStore.timer }}</div>
                    </div>
                </div>
                <div class="lives-bar">
                    <div class="widget-label">{{t('marathonGame.health')}}</div>
                    <div class="hearts-container">
                        <span v-for="life in 5" :key="life" class="heart" :class="{ 'lost': life > gameStore.lives }">
                            ❤️
                        </span>
                    </div>
                </div>
            </header>
            <main class="game-content">
                <div v-if="gameStore.gameActive && gameStore.currentWord" class="game-area">
                    <div class="word-display" :class="feedbackClass">
                        <h1>{{ gameStore.currentWord.de }}</h1>
                        <p class="task">{{t('marathonGame.quest')}}</p>
                    </div>
                    <div class="actions" :class="{ 'disabled': isChecking }">
                        <button @click="handleArticleChoice('der')" class="article-btn der">der</button>
                        <button @click="handleArticleChoice('die')" class="article-btn die">die</button>
                        <button @click="handleArticleChoice('das')" class="article-btn das">das</button>
                    </div>
                </div>
                <div v-else class="game-over-wrapper">
                    <div class="game-over">
                        <h1 class="game-over__title">{{t('marathonGame.end')}}</h1>
                        <p class="game-over__streak-info">{{t('marathonGame.urStreak')}}<span>{{ gameStore?.sessionStreak }}</span>
                        </p>

                        <p v-if="gameStore.sessionStreak > 0 && gameStore.sessionStreak >= currentDifficultyRecord"
                           class="game-over__new-record">
                            🎉 {{t('marathonGame.newRecord')}} 🎉
                        </p>
                        <p v-else class="game-over__best-score">
                            {{t('marathonGame.bestResult')}} {{ currentDifficultyRecord }}
                        </p>
                        <button @click="gameStore.retryGame()" class="game-over__retry-btn retry">
                            {{t('marathonGame.tryAgain')}}
                        </button>
                        <button @click="goBackToPrepare" class="game-over__retry-btn back">{{t('marathonGame.back')}}
                        </button>
                        <button @click="toMain" class="game-over__retry-btn main">{{t('marathonGame.main')}}</button>
                    </div>
                </div>
            </main>
        </template>
    </div>
</template>

<script setup>
    import {ref, computed, onMounted, onUnmounted, watch} from 'vue';
    import {useRouter} from 'vue-router';
    import {useGameStore} from '../store/marafonStore.js';

    const {t} = useI18n()
    const gameStore = useGameStore();
    const router = useRouter();
    const feedback = ref(null);
    const isChecking = ref(false)
    const currentDifficultyRecord = computed(() => {
        if (gameStore.personalBests && gameStore.difficulty) {
            return gameStore.personalBests[gameStore.difficulty] || 0;
        }
        return 0;
    });

    const feedbackClass = computed(() => {
        if (feedback.value === 'correct') return 'feedback-correct';
        if (feedback.value === 'incorrect') return 'feedback-incorrect';
        return '';
    });

    function handleArticleChoice(chosenArticle) {
        if (isChecking.value) return;
        isChecking.value = true;
        const isCorrect = chosenArticle === gameStore.currentWord.article;
        feedback.value = isCorrect ? 'correct' : 'incorrect';
        setTimeout(() => {
            gameStore.submitAnswer(isCorrect);
            feedback.value = null;
            isChecking.value = false;
        }, 800);
    }

    function goBackToPrepare() {
        router.push('/prepare');
    }

    function toMain() {
        router.push('/');
    }

    watch(() => gameStore.gameReady, (isReady) => {
        if (!isReady) {
            setTimeout(() => {
                router.push('/prepare');
            }, 1500);
        }
    }, {immediate: true});

    onMounted(() => {
        if (gameStore.gameReady && !gameStore.gameActive) {
            gameStore.startNewRound();
        }
    });

    onUnmounted(() => {
        gameStore.stopTimer();
    });
</script>

<style scoped>

    .game-page-layout {
        background-color: #fef8e4;
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
        font-family: 'Inter', sans-serif;
        color: #1e1e1e;
        padding: 1.5rem;
        box-sizing: border-box;
        position: relative;
    }

    .back-btn {
        position: absolute;
        top: 1.5rem;
        left: 1.5rem;
        z-index: 20;
        background: #fff;
        color: #1e1e1e;
        font-family: "Nunito", sans-serif;
        font-size: 1rem;
        padding: 0.5rem 1rem;
        border: 3px solid #1e1e1e;
        border-radius: 12px;
        box-shadow: 4px 4px 0 #1e1e1e;
        cursor: pointer;
        transition: all 0.1s ease-in-out;
    }

    .back-btn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #1e1e1e;
    }

    .back-btn:active {
        transform: translate(4px, 4px);
        box-shadow: 0 0 0 #1e1e1e;
    }

    .game-header {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: 100%;
        margin: 0 auto;
        position: relative;
    }

    .stats-bar {
        display: flex;
        gap: 1rem;
    }

    .stat-widget {
        background: #fff;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        padding: 0.5rem 1rem;
        text-align: center;
        box-shadow: 4px 4px 0 #1e1e1e;
        min-width: 100px;
    }

    .widget-label {
        font-family: "Nunito", sans-serif;
        font-size: 0.9rem;
        color: #555;
    }

    .widget-value {
        font-family: "Nunito", sans-serif;
        font-size: 1.8rem;
        color: #1e1e1e;
        line-height: 1;
    }

    .stat-widget.record .widget-value {
        color: #f97028;
    }

    .stat-widget.timer {
        background-color: #f87171;
    }

    .stat-widget.timer .widget-label {
        color: white;
        opacity: 0.9;
    }

    .stat-widget.timer .widget-value {
        color: white;
    }

    .lives-bar {
        background: #fff;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        padding: 0.5rem 1rem;
        box-shadow: 4px 4px 0 #1e1e1e;
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;
    }

    .hearts-container {
        display: flex;
        gap: 0.5rem;
        font-size: 1.8rem;
        line-height: 1;
        margin-top: 2px;
    }

    .heart {
        transition: all 0.3s ease;
    }

    .heart.lost {
        transform: scale(0.8);
        filter: grayscale(1);
        opacity: 0.5;
    }

    .game-content {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .game-area {
        width: 100%;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
    }

    .word-display {
        text-align: center;
        margin-bottom: 2rem;
        min-height: 150px;
    }

    .word-display h1 {
        font-family: "Nunito", sans-serif;
        font-size: 7rem;
        font-weight: 600;
        line-height: 1;
        color: #1e1e1e;
        margin: 0;
        transition: color 0.2s ease;
    }

    .word-display .task {
        font-size: 1.25rem;
        color: #555;
        margin-top: 2.5rem;
        font-weight: 500;
    }

    .feedback-correct h1 {
        color: #4ade80;
    }

    .feedback-incorrect h1 {
        color: #f87171;
    }

    .feedback-incorrect {
        animation: shake-incorrect 0.5s ease;
    }

    @keyframes shake-incorrect {
        0%, 100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-15px);
        }
        75% {
            transform: translateX(15px);
        }
    }

    .actions {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        width: 100%;
        transition: opacity 0.2s ease;
    }

    .actions.disabled {
        pointer-events: none;
        opacity: 0.6;
    }

    .article-btn {
        font-family: "Nunito", sans-serif;
        font-size: 2.5rem;
        padding: 1.5rem 0;
        width: 150px;
        border-radius: 20px;
        border: 4px solid #1e1e1e;
        box-shadow: 6px 6px 0 #1e1e1e;
        cursor: pointer;
        transition: all 0.1s ease-in-out;
    }

    .article-btn:hover:not(:active) {
        transform: translate(2px, 2px);
        box-shadow: 4px 4px 0 #1e1e1e;
    }

    .article-btn:active {
        transform: translate(6px, 6px);
        box-shadow: 0 0 0 #1e1e1e;
    }

    .article-btn.der {
        background-color: #60a5fa;
        color: white;
    }

    .article-btn.die {
        background-color: #f87171;
        color: white;
    }

    .article-btn.das {
        background-color: #fca13a;
        color: white;
    }

    .game-over-wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .game-over {
        background-color: #ffffff;
        border: 3px solid #1e1e1e;
        border-radius: 24px;
        box-shadow: 8px 8px 0 #1e1e1e;
        padding: 2.5rem;
        max-width: 450px;
        width: 100%;
        text-align: center;
    }

    .game-over__title {
        font-family: "Nunito", sans-serif;
        font-size: 3rem;
        color: #1e1e1e;
    }

    .game-over__streak-info {
        font-size: 1.5rem;
        margin: 1rem 0;
    }

    .game-over__streak-info span {
        font-family: "Nunito", sans-serif;
        font-size: 2rem;
        color: #f97028;
        margin-left: 0.5rem;
    }

    .game-over__new-record {
        font-size: 1.5rem;
        color: #4ade80;
        font-weight: 700;
        margin-top: 1.5rem;
    }

    .game-over__best-score {
        font-size: 1.1rem;
        color: #555;
        margin-top: 1.5rem;
    }

    .game-over__retry-btn {
        width: 100%;
        margin-top: 1rem;
        padding: 1rem;
        font-family: "Nunito", sans-serif;
        font-size: 1.3rem;
        cursor: pointer;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        box-shadow: 4px 4px 0 #1e1e1e;
        transition: all 0.1s ease-in-out;
    }

    .game-over__retry-btn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #1e1e1e;
    }

    .game-over__retry-btn.retry {
        background-color: #4ade80;
        color: #1e1e1e;
    }

    .game-over__retry-btn.back {
        background-color: #60a5fa;
        color: white;
    }

    .game-over__retry-btn.main {
        background-color: #fca13a;
        color: white;
    }

    .not-ready-container {
        text-align: center;
        width: 100%;
    }

    @media (max-width: 640px) {
        .back-btn {
            top: 1rem;
            left: 1rem;
        }

        .game-header {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding-top:40px
        }

        .lives-bar {
            position: static;
        }
    }

    @media (max-width: 768px) {
        .word-display h1 {
            font-size: 2rem;
        }
    }

</style>