<script setup>
import {useDuelStore} from '../../store/sentenceDuelStore.js';
import {userAuthStore} from '../../store/authStore.js';
import {useRoute, useRouter} from 'vue-router';
import {onMounted, onUnmounted, ref, watch, computed} from 'vue';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Modal from '../../src/components/modal';
import {useLocalePath} from '#imports';

const localePath = useLocalePath();
const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const gameStore = useDuelStore();
const authStore = userAuthStore();
const db = getFirestore();

const opponentLiveAvatar = ref(null);
const currentAnswer = ref('');
const showVsScreen = ref(true);
const showCountdown = ref(true);
const startCountdown = ref(false);
const countdown = ref(3);
const showEndGameModal = ref(false);
const opponentLeft = ref(false);
let countdownInterval = null;

watch(() => gameStore.sessionData?.players, async (players) => {
  if (!players) return;
  const opponentEntry = Object.entries(players).find(([uid]) => uid !== authStore.uid);
  if (opponentEntry) {
    const opponentUid = opponentEntry[0];
    try {
      const userDocRef = doc(db, 'users', opponentUid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().avatar) {
        opponentLiveAvatar.value = userDoc.data().avatar;
      }
    } catch (e) {
      console.error("Не удалось загрузить аватар противника:", e);
    }
  }
}, { deep: true, immediate: true });

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
  router.push(localePath('/sentence-duel'));
}

onMounted(() => {
  const sessionId = route.params.id;
  if (sessionId) gameStore.listenToSession(sessionId);
  setTimeout(() => {
    showVsScreen.value = false;
    startCountdown.value = true;
    countdownInterval = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        setTimeout(() => {
          showCountdown.value = false;
          startCountdown.value = false;
        }, 500);
      }
    }, 1000);

  }, 4500);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

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

watch(() => gameStore.sessionData?.status, (newStatus) => {
  if (newStatus === 'aborted') {
    const abortedBy = gameStore.sessionData?.abortedBy;
    if (abortedBy && abortedBy !== authStore.uid) {
      opponentLeft.value = true;
      setTimeout(() => {
        router.push(localePath('/sentence-duel'));
      }, 3000);
    }
  }
});

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
  <div class="game-page-wrapper">
    <button class="btn-icon-back" @click="LeaveSession">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
           stroke="#5C5446" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    </button>
    <transition name="fade">
      <div v-if="showVsScreen" class="vs-overlay">
        <div class="vs-panel top-panel">
          <div class="player-card opponent-card">
            <img class="card-avatar" :src="authStore.getAvatarUrl(opponentLiveAvatar || opponent?.avatar || '1.png')"
                 alt="Opponent"/>
            <div class="card-name">{{ opponent?.name || 'Ожидание...' }}</div>
          </div>
        </div>
        <div class="vs-badge">VS</div>
        <div class="vs-panel bottom-panel">
          <div class="player-card local-card">
            <img class="card-avatar" :src="authStore.getAvatarUrl(authStore.avatar || '1.png')" alt="You"/>
            <div class="card-name">{{ authStore.name }}</div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showCountdown" class="countdown-overlay">
        <div v-if="startCountdown" class="countdown-content">
          <p v-if="countdown > 0" class="countdown-number">{{ countdown }}</p>
          <p v-else class="countdown-number start">{{ t('wordDuelSession.start') }}</p>
        </div>
      </div>
    </transition>
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
    <div v-if="!gameStore.sessionData" class="loading-text">
      <div class="loader-bounce"></div>
      <p>{{ t('wordDuelSession.loading') }}</p>
    </div>
    <div v-else class="game-container">
      <div class="player-hero opponent-hero">
        <div class="avatar-wrapper">
          <img :src="authStore.getAvatarUrl(opponentLiveAvatar || opponent?.avatar || '1.png')"
               alt="Opponent Avatar"
               class="hero-avatar"
          />
        </div>
        <div class="hero-info-pill opponent-pill">
          <span class="player-name">{{ opponent?.name || t('sentenceDuels.pending') }}</span>
          <span class="player-score">🏆 {{ opponent?.score || 0 }}</span>
        </div>
      </div>
      <div class="game-board-field">
        <div class="round-badge">
          {{ t('wordDuelSession.round') }} {{ gameStore.sessionData.currentRoundIndex + 1 }} /
          {{ gameStore.sessionData.totalRounds }}
        </div>
        <div class="game-main">
          <div class="answer-section">
            <button
                v-for="(word, index) in answerWords"
                :key="`ans-${index}`"
                @click="removeWordFromAnswer(index)"
                class="word-button answer-word"
            >
              {{ word }}
            </button>
            <span v-if="!currentAnswer && gameStore.sessionData.status === 'in_progress'" class="answer-placeholder">
              {{ t('sentenceDuels.answer-placeholder')}}
            </span>
            <span v-if="gameStore.sessionData.status !== 'in_progress' && !showEndGameModal"
                  class="answer-placeholder ready-text">
              {{ t('wordDuelSession.ready') }}
            </span>
          </div>
          <div class="word-pool">
            <button
                v-if="gameStore.sessionData.status === 'in_progress'"
                v-for="(word, index) in availableWords"
                :key="`pool-${index}`"
                @click="addWordToAnswer(word)"
                class="word-button pool-word"
            >
              {{ word }}
            </button>
          </div>
        </div>
      </div>
      <div class="bottom-area">
        <div class="player-hero local-hero">
          <div class="hero-info-pill local-pill">
            <span class="player-name">{{ authStore.name }}</span>
            <span class="player-score">🏆 {{ gameStore.sessionData.players[authStore.uid]?.score || 0 }}</span>
          </div>
          <div class="avatar-wrapper">
            <img :src="authStore.getAvatarUrl(authStore.avatar || '1.png')"
                 alt="Your Avatar"
                 class="hero-avatar"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.game-page-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #F8F4E6;
  font-family: 'Nunito', sans-serif;
  padding-top: max(15px, env(safe-area-inset-top));
  padding-bottom: max(15px, env(safe-area-inset-bottom));
  box-sizing: border-box;
  overflow: hidden;
  color: #5C5446;
}

.vs-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #F8F4E6;
}

.vs-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

.top-panel {
  background: linear-gradient(180deg, #FFE8E8 0%, #FFD6D6 100%);
  border-bottom: 4px solid #E89C9C;
  transform: translateY(-100%);
  animation: slideInTop 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.bottom-panel {
  background: linear-gradient(0deg, #E8F5E9 0%, #C8E6C9 100%);
  border-top: 4px solid #A2C9A2;
  transform: translateY(100%);
  animation: slideInBottom 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

.vs-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  background: #F5A623;
  color: #FFF;
  font-family: 'Fredoka One', 'Nunito', sans-serif;
  font-size: 3.5rem;
  font-weight: 900;
  padding: 15px 20px;
  border-radius: 50%;
  border: 6px solid #FFF;
  box-shadow: 0 8px 0 #D4891C, 0 10px 20px rgba(0, 0, 0, 0.2);
  z-index: 2010;
  animation: popInVs 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards;
}

.player-card {
  width: 160px;
  background: #FFF;
  border: 4px solid #D4C9B3;
  border-radius: 20px;
  box-shadow: 0 10px 0 #E2D7C1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  box-sizing: border-box;
  opacity: 0;
  transform: scale(0.8);
  animation: cardPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.8s forwards;
}

.opponent-card {
  border-color: #E89C9C;
  box-shadow: 0 6px 0 #D98888;
}

.local-card {
  border-color: #A2C9A2;
  box-shadow: 0 6px 0 #8BB58B;
}

.card-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid #F0EAD6;
  object-fit: cover;
  margin-bottom: 15px;
  box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-name {
  font-size: 1.1rem;
  height: 90px;
  display: flex;
  align-items: center;
  font-weight: 800;
  color: #5C5446;
  text-align: center;
  word-break: break-word;
}

@keyframes slideInTop {
  to {
    transform: translateY(0);
  }
}

@keyframes slideInBottom {
  to {
    transform: translateY(0);
  }
}

@keyframes popInVs {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  70% {
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes cardPop {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.game-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.player-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  width: 100%;
}

.bottom-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin-top: auto;
  padding-top: 20px;
}

.avatar-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid #FFFFFF;
  overflow: hidden;
  background-color: #F0EAD6;
  z-index: 2;
}

.hero-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.opponent-hero {
  padding-bottom: 20px;
}

.hero-info-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FFFFFF;
  padding: 6px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 0 #E2D7C1;
  z-index: 3;
}

.player-name {
  font-size: 1rem;
  font-weight: 800;
  color: #5C5446;
  white-space: nowrap;
}

.player-score {
  font-size: 1.1rem;
  font-weight: 900;
  color: #F5A623;
  background: #FFF9E6;
  padding: 2px 8px;
  border-radius: 12px;
}

.game-board-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 10px 0;
  border-radius: 30px;
  padding: 25px 20px 20px 20px;
  position: relative;
}

.round-badge {
  background-color: #A2C9A2;
  color: #FFFFFF;
  padding: 6px 20px;
  border-radius: 20px;
  font-weight: 900;
  margin-bottom: 10px;
  box-shadow: 0 4px 0 #85B085;
  text-transform: uppercase;
  font-size: 16px;
}

.game-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.answer-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  align-items: center;
  background-color: #F8F4E6;
  padding: 15px;
  border-radius: 20px;
  border: 3px dashed #D4C9B3;
  width: 100%;
  min-height: 110px;
  box-sizing: border-box;
  transition: all 0.3s;
}

.answer-placeholder {
  font-size: 1.1rem;
  font-weight: 700;
  color: #BDB4A1;
}

.ready-text {
  color: #A2C9A2;
  font-weight: 800;
  font-size: 1.3rem;
}

.word-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  width: 100%;
  padding-top: 10px;
}

.word-button {
  padding: 10px 18px;
  font-size: 1.1rem;
  font-weight: 800;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.1s ease-out;
  position: relative;
  outline: none;
}

.pool-word {
  background: #FFFFFF;
  color: #5C5446;
  border: 2px solid #D4C9B3;
  box-shadow: 0 5px 0 #D4C9B3;
}

.answer-word {
  background: #D5F5E3;
  color: #229954;
  border: 2px solid #A9DFBF;
  box-shadow: 0 5px 0 #A9DFBF;
}

.word-button:active {
  transform: translateY(5px);
  box-shadow: 0 0px 0 transparent;
}

.loading-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1.5rem;
  font-weight: 800;
  color: #5C5446;
  gap: 15px;
}

.loader-bounce {
  width: 20px;
  height: 20px;
  background-color: #A2C9A2;
  border-radius: 50%;
  animation: bounce 0.5s alternate infinite ease-in;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}

.countdown-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(248, 244, 230, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.countdown-number {
  font-family: 'Fredoka One', 'Nunito', sans-serif;
  font-size: 8rem;
  font-weight: 900;
  animation: countdown-pulse 0.9s ease-out;
  margin: 0;
  color: #F5A623;
  text-shadow: 0 6px 0 #D4891C;
}

.countdown-number.start {
  font-size: 5rem;
  color: #A2C9A2;
  text-shadow: 0 6px 0 #85B085;
  animation: start-fade-out 0.5s ease-in forwards;
}

@keyframes countdown-pulse {
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes start-fade-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@media (max-width: 600px) {
  .avatar-wrapper {
    width: 75px;
    height: 75px;
  }

  .player-name {
    font-size: 0.95rem;
  }

  .game-board-field {
    padding: 20px 15px 15px 15px;
    border-radius: 24px;
  }

  .word-button {
    padding: 8px 14px;
    font-size: 1.05rem;
    border-radius: 12px;
  }

  .answer-section {
    min-height: 150px;
    padding: 10px;
  }

  .player-card {
    width: 170px;
    padding: 10px 20px;
  }

  .card-avatar {
    width: 90px;
    height: 90px;
  }

  .vs-badge {
    font-size: 2.5rem;
    padding: 10px 15px;
  }
}

.btn-icon-back {
  position: absolute;
  top: max(5px, env(safe-area-inset-top));
  left: 15px;
  z-index: 50;
  background: #fff;
  border: 3px solid #D4C9B3;
  box-shadow: 0 4px 0 #D4C9B3;
  border-radius: 12px;
  width: 40px;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 transparent;
}
</style>