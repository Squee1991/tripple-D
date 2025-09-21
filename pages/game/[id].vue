    <script setup>
        import {useDuelStore} from '../../store/sentenceDuelStore.js';
        import {userAuthStore} from '../../store/authStore.js';
        import {useRoute, useRouter} from 'vue-router';
        import {onMounted, onUnmounted, ref, watch, computed} from 'vue';
        import Modal from '../../src/components/modal';
        const { t } = useI18n()
        const route = useRoute();
        const router = useRouter();
        const gameStore = useDuelStore();
        const authStore = userAuthStore();
        const currentAnswer = ref('');
        const showCountdown = ref(true);
        const countdown = ref(3);
        const showEndGameModal = ref(false);
        const opponentLeft = ref(false);
        const gameOutcome = computed(() => {
            if (gameStore.sessionData?.status !== 'finished') return null;

            const players = gameStore.sessionData.players;
            const localPlayer = players[authStore.uid];
            const opponent = Object.entries(players).find(([uid]) => uid !== authStore.uid)?.[1];

            if (!localPlayer || !opponent) return 'draw';

            const localScore = localPlayer.score;
            const opponentScore = opponent.score;

            if (localScore >= 6 && localScore > opponentScore) return 'win';
            if (opponentScore >= 6 && opponentScore > localScore) return 'loss';
            return 'draw';
        });
        const endGameModalData = computed(() => {
            if (gameStore.sessionData?.status !== 'finished') return null;

            if (gameOutcome.value === 'win') {
                return {
                    title: t('wordDuelSession.victory'),
                    text: t('wordDuelSession.victoryText'),
                    type: 'win'
                };
            }
            if (gameOutcome.value === 'loss') {
                return {
                    title: t('wordDuelSession.loss'),
                    text: t('wordDuelSession.lossText'),
                    type: 'loss'
                };
            }
            if (gameOutcome.value === 'draw') {
                return {
                    title: t('duel.drawTitle'),
                    text: t('duel.drawText'),
                    type: 'draw'
                };
            }
            return null;
        });
        const roundOutcome = computed(() => {
            if (gameStore.sessionData?.status !== 'round_over') return null;
            const roundIndex = gameStore.sessionData.currentRoundIndex;
            const winnerId = gameStore.sessionData.rounds[roundIndex]?.winner;
            if (!winnerId) return 'draw';
            return winnerId === authStore.uid ? 'win' : 'loss';
        });
        function closeEndGameModal() {
            showEndGameModal.value = false;
            router.back()
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

        function clearAnswer() {
            currentAnswer.value = '';
        }

        watch(() => gameStore.sessionData, (newSession, oldSession) => {
            if (oldSession && oldSession.players && Object.keys(oldSession.players).length === 2 && !newSession) {
                opponentLeft.value = true;
                setTimeout(() => {
                    router.push('/play');
                }, 3000);
            }
        }, { deep: true });


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
        }, { deep: true });

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
                    <p v-else class="countdown-number start">{{t('wordDuelSession.start')}}</p>
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
            <div class="game-page-wrapper">
                <div v-if="!gameStore.sessionData" class="loading-text">
                    <p>{{t('wordDuelSession.loading')}}</p>
                </div>
                <div v-else class="game-container">
                    <div class="player-zone opponent-zone">
                        <div class="player-info">
                            <span class="player-name">{{ Object.values(gameStore.sessionData.players).find(p => p.name !== authStore.name)?.name || 'Ожидание...' }}</span>
                            <span class="player-score">🏆 {{ Object.values(gameStore.sessionData.players).find(p => p.name !== authStore.name)?.score || 0 }}</span>
                        </div>
                    </div>
                    <div class="game-board">
                        <div class="round-counter">
                            {{t('wordDuelSession.round')}} {{ gameStore.sessionData.currentRoundIndex + 1 }} / {{ gameStore.sessionData.totalRounds
                            }}
                        </div>
                        <div v-if="gameStore.sessionData.status === 'in_progress' && gameStore.sessionData.currentRoundData"
                             class="word-pool">
                            <button
                                    v-for="(word, index) in gameStore.sessionData.currentRoundData.scrambledWords"
                                    :key="index"
                                    @click="addWordToAnswer(word)"
                                    class="word-button"
                            >
                                {{ word }}
                            </button>
                        </div>
                        <div v-else class="status-text-container">
                            <div v-if="gameStore.sessionData.status === 'finished' && gameOutcome === 'win'" class="round-over-text win">
                                <Modal
                                        :visible="true"
                                        v-if="gameStore.sessionData.status === 'finished' && gameOutcome === 'win'"
                                        :title="endGameModalData.title"
                                        :text="endGameModalData.text"
                                        :type="endGameModalData.type"
                                        @close="closeEndGameModal"
                                />
                            </div>
                            <div v-else-if="gameStore.sessionData.status === 'finished' && gameOutcome === 'loss'" class="round-over-text loss">
                                <Modal
                                        :visible="true"
                                        v-if="gameStore.sessionData.status === 'finished' && gameOutcome === 'loss'"
                                        :title="endGameModalData.title"
                                        :text="endGameModalData.text"
                                        :type="endGameModalData.type"
                                        @close="closeEndGameModal"
                                />
                            </div>
                            <div v-else class="round-over-text">{{t('wordDuelSession.ready')}}</div>
                        </div>
                    </div>
                    <div class="player-zone local-player-zone">
                        <div class="answer-section">
                            <input type="text" placeholder="" v-model="currentAnswer" readonly>
                            <button @click="clearAnswer" class="clear-button">{{t('wordDuelSession.clear')}}</button>
                        </div>
                        <div class="player-info">
                            <span class="player-name">{{ authStore.name }}</span>
                            <span class="player-score">🏆 {{ gameStore.sessionData.players[authStore.uid]?.score || 0 }}</span>
                        </div>
                        <button class="leave-button" @click="LeaveSession">
                            {{ t('wordDuelSession.leaveBtn') }}
                        </button>
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
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: calc(100vh - 40px);
            overflow: hidden;
        }

        .game-board {
            position: relative;
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px 0
        }

        .round-counter {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(255, 255, 255, .9);
            padding: 8px 16px;
            border-radius: 10px;
            font-weight: 700;
            color: #3A3A3A;
            border: 2px solid #eee;
            z-index: 10
        }

        .player-zone {
            width: 100%;
            padding: 10px 0
        }

        .player-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            padding: 10px 20px;
            border-radius: 15px;
            border: 3px solid #1e1e1e;
            box-shadow: 5px 5px 0 #1e1e1e
        }

        .player-name {
            font-size: 1.2rem;
            font-weight: 700
        }

        .player-score {
            font-size: 1.2rem;
            font-weight: 800
        }

        .opponent-zone .player-info {
            border-color: #E89C9C;
            box-shadow: 5px 5px 0 #E89C9C
        }

        .local-player-zone {
            display: flex;
            flex-direction: column;
            gap: 15px
        }

        .local-player-zone .player-info {
            border-color: #A2C9A2;
            box-shadow: 5px 5px 0 #A2C9A2
        }

        .answer-section {
            display: flex;
            gap: 15px;
            background-color: #fff;
            padding: 15px;
            border-radius: 20px;
            border: 3px dashed #ccc
        }

        .answer-section input {
            flex-grow: 1;
            border: none;
            background: #f0f0f0;
            padding: 15px;
            border-radius: 12px;
            font-size: 1.2rem;
            font-weight: 600;
            color: #3A3A3A
        }

        .answer-section input:focus {
            outline: none
        }

        .clear-button {
            border: 3px solid #1e1e1e;
            box-shadow: 4px 4px 0 #1e1e1e;
            background-color: #E89C9C;
            color: #1e1e1e;
            font-weight: 700;
            font-size: 1rem;
            padding: 10px 20px;
            border-radius: 12px;
            cursor: pointer;
            transition: all .1s ease-in-out
        }

        .clear-button:hover {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 #1e1e1e
        }

        .word-pool {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            justify-content: center;
            max-width: 900px
        }

        .status-text-container {
            width: 100%
        }

        .round-over-text {
            font-size: 2.5rem;
            font-weight: 800;
            text-align: center
        }

        .round-over-text.win {
            color: #2E7D32;
        }

        .round-over-text.loss {
            color: #C62828;
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
            transition: all .1s ease-in-out
        }

        .word-button:hover {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 #1e1e1e;
            background-color: #FFD24B
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
        }
        .leave-button:hover {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0 #1e1e1e;
        }
    </style>