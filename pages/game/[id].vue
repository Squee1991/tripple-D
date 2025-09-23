<script setup>
// Секция <script setup> остаётся без изменений
import {useDuelStore} from '../../store/sentenceDuelStore.js';
import {userAuthStore} from '../../store/authStore.js';
import {useRoute, useRouter} from 'vue-router';
import {onMounted, onUnmounted, ref, watch, computed} from 'vue';
import Modal from '../../src/components/modal';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const gameStore = useDuelStore();
const authStore = userAuthStore();

const currentAnswer = ref('');
const showCountdown = ref(true);
const countdown = ref(3);
const showEndGameModal = ref(false);
const opponentLeft = ref(false);

const opponent = computed(() => {
    if (!gameStore.sessionData?.players) return null;
    const opponentEntry = Object.entries(gameStore.sessionData.players).find(
        ([uid]) => uid !== authStore.uid
    );
    return opponentEntry ? opponentEntry[1] : null;
});

const answerWords = computed(() => {
    return currentAnswer.value ? currentAnswer.value.split(' ') : [];
});

const availableWords = computed(() => {
    if (!gameStore.sessionData?.currentRoundData?.scrambledWords) return [];
    const selectedWords = answerWords.value;
    const allWords = [...gameStore.sessionData.currentRoundData.scrambledWords];
    for (const word of selectedWords) {
        const index = allWords.indexOf(word);
        if (index > -1) {
            allWords.splice(index, 1);
        }
    }
    return allWords;
});

const gameOutcome = computed(() => {
    if (gameStore.sessionData?.status !== 'finished') return null;
    const players = gameStore.sessionData.players;
    const localPlayer = players[authStore.uid];
    const opponentPlayer = Object.entries(players).find(([uid]) => uid !== authStore.uid)?.[1];
    if (!localPlayer || !opponentPlayer) return 'draw';
    const localScore = localPlayer.score;
    const opponentScore = opponentPlayer.score;
    if (localScore >= 6 && localScore > opponentScore) return 'win';
    if (opponentScore >= 6 && opponentScore > localScore) return 'loss';
    return 'draw';
});

const endGameModalData = computed(() => {
    if (!showEndGameModal.value || gameStore.sessionData?.status !== 'finished') return null;
    switch (gameOutcome.value) {
        case 'win':
            return {title: t('wordDuelSession.victory'), text: t('wordDuelSession.victoryText'), type: 'win'};
        case 'loss':
            return {title: t('wordDuelSession.loss'), text: t('wordDuelSession.lossText'), type: 'loss'};
        case 'draw':
            return {title: t('duel.drawTitle'), text: t('duel.drawText'), type: 'draw'};
        default:
            return null;
    }
});

function closeEndGameModal() {
    showEndGameModal.value = false;
    router.back();
}

function LeaveSession() {
    gameStore.leaveSession();
    router.push('/play');
}

onMounted(() => {
    const sessionId = route.params.id;
    if (sessionId) gameStore.listenToSession(sessionId);
    const interval = setInterval(() => {
        countdown.value--;
        if (countdown.value === 0) {
            clearInterval(interval);
            setTimeout(() => {
                showCountdown.value = false;
            }, 500);
        }
    }, 1000);
});

onUnmounted(() => {
    if (gameStore.sessionData?.status !== 'finished') {
        gameStore.leaveSession();
    }
});

function addWordToAnswer(word) {
    if (currentAnswer.value === '') {
        currentAnswer.value = word;
    } else {
        currentAnswer.value += ` ${word}`;
    }
}

function removeWordFromAnswer(index) {
    const words = [...answerWords.value];
    words.splice(index, 1);
    currentAnswer.value = words.join(' ');
}

watch(() => gameStore.sessionData, (newSession, oldSession) => {
    if (oldSession && oldSession.players && Object.keys(oldSession.players).length === 2 && !newSession) {
        opponentLeft.value = true;
        setTimeout(() => {
            router.push('/play');
        }, 3000);
    }
}, {deep: true});

watch(() => gameStore.sessionData?.status, (newStatus, oldStatus) => {
    if (!gameStore.sessionData) return;
    const isHost = gameStore.sessionData.hostId === authStore.uid;
    if (isHost && newStatus === 'starting') {
        gameStore.prepareCurrentRound();
    }
    if (newStatus === 'starting' || oldStatus === 'round_over') {
        currentAnswer.value = '';
    }
    if (newStatus === 'finished') {
        showEndGameModal.value = true;
    }
}, {immediate: true});

watch(() => gameStore.sessionData?.currentRoundData?.answers, (newAnswers) => {
    if (!gameStore.sessionData || !newAnswers) return;
    const isHost = gameStore.sessionData.hostId === authStore.uid;
    if (isHost && gameStore.sessionData.status === 'in_progress') {
        gameStore.checkRoundWinner();
    }
}, {deep: true});

watch(currentAnswer, (newText) => {
    if (gameStore.sessionData?.status === 'in_progress') {
        gameStore.submitAnswer(newText);
    }
});
</script>

<template>
    <div>
        <div v-if="showCountdown" class="countdown-overlay">
            <div class="countdown-content">
                <p v-if="countdown > 0" class="countdown-number">{{ countdown }}</p>
                <p v-else class="countdown-number start">{{ t('wordDuelSession.start') }}</p>
            </div>
        </div>

        <Modal
            v-if="opponentLeft"
            :visible="true"
            :title="t('wordDuelSession.leave')"
            :text="t('wordDuelSession.leaveText')"
            type="info"
            @close="LeaveSession"
        />

        <Modal
            v-if="endGameModalData"
            :visible="showEndGameModal"
            :title="endGameModalData.title"
            :text="endGameModalData.text"
            :type="endGameModalData.type"
            @close="closeEndGameModal"
        />

        <div class="game-page-wrapper">
            <div v-if="!gameStore.sessionData" class="loading-text">
                <p>{{ t('wordDuelSession.loading') }}</p>
            </div>

            <div v-else class="game-container">
                <div class="player-display opponent-display">
                    <img v-if="opponent?.avatar" :src="authStore.getAvatarUrl(opponent.avatar)" alt="Opponent Avatar" class="player-avatar"/>
                    <div v-else class="player-avatar-placeholder"></div>
                    <div class="player-text-info">
                        <span class="player-name">{{ opponent?.name || 'Ожидание...' }}</span>
                        <span class="player-score">🏆 {{ opponent?.score || 0 }}</span>
                    </div>
                </div>

                <div class="player-display local-player-display">
                    <img v-if="authStore.avatarUrl" :src="authStore.avatarUrl" alt="Your Avatar" class="player-avatar"/>
                    <div v-else class="player-avatar-placeholder"></div>
                    <div class="player-text-info">
                        <span class="player-name">{{ authStore.name }}</span>
                        <span class="player-score">🏆 {{ gameStore.sessionData.players[authStore.uid]?.score || 0 }}</span>
                    </div>
                </div>

                <div class="game-main">
                    <div class="round-counter">
                        {{ t('wordDuelSession.round') }} {{ gameStore.sessionData.currentRoundIndex + 1 }} /
                        {{ gameStore.sessionData.totalRounds }}
                    </div>

                    <div class="game-board">
                        <div class="answer-section">
                            <button
                                v-for="(word, index) in answerWords"
                                :key="`ans-${index}`"
                                @click="removeWordFromAnswer(index)"
                                class="word-button answer-word"
                            >
                                {{ word }}
                            </button>

                            <span v-if="!currentAnswer && gameStore.sessionData.status === 'in_progress'"
                                  class="answer-placeholder">

                            </span>
                            <span v-if="gameStore.sessionData.status !== 'in_progress' && !showEndGameModal"
                                  class="answer-placeholder">
                               {{ t('wordDuelSession.ready') }}
                            </span>
                        </div>
                    </div>

                    <div class="game-footer">
                        <div class="word-pool">
                            <button
                                v-if="gameStore.sessionData.status === 'in_progress'"
                                v-for="(word, index) in availableWords"
                                :key="`pool-${index}`"
                                @click="addWordToAnswer(word)"
                                class="word-button"
                            >
                                {{ word }}
                            </button>
                        </div>
                        <button class="leave-button" @click="LeaveSession">
                            {{ t('wordDuelSession.leaveBtn') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Секция стилей ниже содержит изменения */
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
    color: #fff;
}

@keyframes countdown-pulse {
    0% { transform: scale(.8); opacity: 0; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

@keyframes start-fade-out {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
}

.countdown-number {
    font-family: 'Fredoka One', cursive;
    font-size: 15rem;
    font-weight: 800;
    animation: countdown-pulse .9s ease-out;
}

.countdown-number.start {
    font-size: 8rem;
    animation: start-fade-out .5s ease-in forwards;
}

.game-page-wrapper {
    background-color: #FDF8F0;
    min-height: 100vh;
    font-family: 'Nunito', sans-serif;
    padding: 20px;
}

.loading-text {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 90vh;
    font-size: 2rem;
    font-weight: 700;
    color: #3A3A3A;
}

.game-container {
    position: relative;
    min-height: calc(100vh - 40px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.player-display {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 15px;
    background: #fff;
    padding: 10px;
    border-radius: 15px;
    border: 3px solid #1e1e1e;
    z-index: 10;
    /* CHANGE: Added fixed width and box-sizing */
    width: 230px;
    box-sizing: border-box;
}

.opponent-display {
    top: 20px;
    left: 20px;
    border-color: #E89C9C;
    box-shadow: 5px 5px 0 #E89C9C;
}

.local-player-display {
    bottom: 20px;
    left: 20px;
    border-color: #A2C9A2;
    box-shadow: 5px 5px 0 #A2C9A2;
}

.player-avatar, .player-avatar-placeholder {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #1e1e1e;
    /* CHANGE: Prevent avatar from shrinking */
    flex-shrink: 0;
}

.player-avatar-placeholder {
    background-color: #e0e0e0;
}

.player-text-info {
    display: flex;
    flex-direction: column;
    /* CHANGE: Allow text block to use remaining space */
    flex: 1;
    min-width: 0; /* Important for ellipsis to work in flexbox */
}

.player-name {
    font-size: 1.2rem;
    font-weight: 700;
    /* CHANGE: Added text overflow handling */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.player-score {
    font-size: 1.2rem;
    font-weight: 800;
}

.game-main {
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.round-counter {
    text-align: center;
    background-color: rgba(255, 255, 255, .9);
    padding: 8px 16px;
    border-radius: 10px;
    font-weight: 700;
    color: #3A3A3A;
    border: 2px solid #eee;
    margin-bottom: 20px;
}

.game-board, .game-footer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.game-board {
    justify-content: center;
}

.answer-section {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 25px;
    border-radius: 20px;
    border: 3px dashed #ccc;
    width: 100%;
    min-height: 120px;
}

.answer-placeholder {
    font-size: 1.5rem;
    font-weight: 700;
    color: #aaa;
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

.word-button:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
    background-color: #FFD24B;
}

.answer-word {
    background-color: #A2C9A2;
}

.answer-word:hover {
    background-color: #c1e0c1;
}

.leave-button {
    border: 3px solid #1e1e1e;
    box-shadow: 4px 4px 0 #1e1e1e;
    background-color: #ccc;
    color: #1e1e1e;
    font-weight: 700;
    font-size: 1rem;
    padding: 10px 20px;
    border-radius: 12px;
    cursor: pointer;
    transition: all .1s ease-in-out;
    width: 100%;
    max-width: 400px;
}

.leave-button:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
}

@media (max-width: 768px) {
    .player-display {
        gap: 8px;
        padding: 8px;
        width: 180px; /* Adjusted width for smaller screens */
    }
    .opponent-display, .local-player-display {
        left: 10px;
    }
    .opponent-display { top: 10px; }
    .local-player-display { bottom: 10px; }

    .player-avatar, .player-avatar-placeholder {
        width: 45px;
        height: 45px;
    }
    .player-name, .player-score {
        font-size: 1rem;
    }
    .game-main {
        padding-top: 80px;
        padding-bottom: 80px;
    }
}
</style>