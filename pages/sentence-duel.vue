<template>
  <div class="lobby">
    <Modal
        :visible="showDevModal"
        @close="closeModal"
        :title="t(overlayData.title)"
        :text="t(overlayData.text)"
    />
    <Modal
        :visible="showAuthModal"
        @close="closeAuthModal"
        :title="authModalData.title"
        :img="Login"
        :text="authModalData.text"
    />
    <div class="lobby-container">
      <TipsModal
          v-model="showTips"
          :title="t('adjectiveComparisonPage.tipTitle')"
          :tips="tipsData.tips"
      />
      <div class="duel__wrapper" v-if="!isWaitingForOpponent && !isOpponentFound">
        <div class="duel__header">
          <div class="duel__header--left">
            <VBackBtn/>
            <div class="duel__header--title">{{ t('categoryAchievments.duel')}}</div>
          </div>
          <div class="tiips__info-wrapper">
            <button class="btn__tips" @click="tipsModule">
              <img class="tipps__icon" src="../assets/images/Tipps.svg" alt="Tips Icon">
            </button>
            <button class="btn__tips" @click="openModal">
              <img class="duel__question-img" :title="t('hoverTitle.duelInfo')"
                   src="../assets/images/question.svg" alt="Info Icon">
            </button>
          </div>
        </div>
        <div class="mode-toggle-wrapper">
          <div
              class="mode-toggle-option"
              :class="{ 'mode-toggle-option--inactive': mode !== 'online' }"
              @click="mode = 'online'"
          >
            🌐 {{ t('wordDuel.online') }}
          </div>
          <div
              class="mode-toggle-option"
              :class="{ 'mode-toggle-option--inactive': mode !== 'local' }"
              @click="mode = 'local'"
          >
            👤 {{ t('wordDuel.local') }}
          </div>
          <div class="mode-toggle-slider" :style="{ transform: sliderTransform }"></div>
        </div>
        <div class="main-content-wrapper">
          <div class="level-grid">
            <button
                v-for="level in levels"
                :key="level"
                @click="selectLevel(level)" class="level-card"
                :class="{ 'level-card--selected': selectedLevel === level }">
              <span class="card-level-title">{{ level }}</span>
            </button>
          </div>
          <div v-if="authStore.uid" class="stats-block">
            <div class="stats__block-info">
              <h3>
                {{ t('sentenceDuels.stats')}} {{ t('sentenceDuels.statsPartTwo')}}
              </h3>
              <div class="stats__block-level">
                <span class="stats__level">{{ selectedLevel }}</span>
              </div>
            </div>
            <div class="stats-container">
              <div class="stat-item">
                <span class="stat-label">{{ t('sentenceDuels.victories')}}</span>
                <span class="stat-value">{{ levelStats.wins }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ t('sentenceDuels.streak')}}</span>
                <span class="stat-value">{{ levelStats.streaks }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ t('sentenceDuels.clearWins')}}</span>
                <span class="stat-value">{{ levelStats.cleanSweeps }}</span>
              </div>
            </div>
            <button
                @click="startGame"
                class="start-game-button"
                :disabled="(mode === 'online' && gameStore.isSearching) || isLoading"
            >
              {{ t('sentenceDuels.start')}}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="status-overlay">
        <div v-if="isWaitingForOpponent" class="search-container">
          <div class="duel__icon-wrapper">
            <div class="duel__icon">
              <img src="../assets/images/DuelIcon.svg" alt="duel_icon">
            </div>
          </div>
          <p class="status-text">
            {{ t('wordDuel.searching') }}<span class="animated-dots"><span>.</span><span>.</span><span>.</span></span>
          </p>
          <button @click="cancelSearch" class="cancel-button">{{ t('wordDuel.cancel') }}</button>
        </div>
        <div v-if="isOpponentFound">
          <p class="status-text">{{ t('wordDuel.found') }}</p>
          <p class="page-subtitle">{{ t('wordDuel.prepare') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted, onUnmounted} from 'vue'
import {useSentencesStore} from '../store/sentencesStore.js'
import {useDuelStore} from '../store/sentenceDuelStore.js'
import {userAuthStore} from '../store/authStore.js'
import {useRouter} from 'vue-router'
import Modal from '../src/components/modal.vue'
import TipsModal from '../src/components/V-tips.vue'
import Login from '../assets/images/login.svg'
import {useSeoMeta} from "#imports";
import VBackBtn from "~/src/components/V-back-btn.vue";

useSeoMeta({
  robots: 'noindex, nofollow'
})

const authStore = userAuthStore()
const router = useRouter()
const gameStore = useDuelStore()
const showAuthModal = ref(false)
const sentencesStore = useSentencesStore()
const mode = ref('online')
const isLoading = ref(true)

const {t, locale} = useI18n()
const isAr = computed(() => locale.value === 'ar')

const sliderTransform = computed(() => {
  if (isAr.value) {
    return mode.value === 'online' ? 'translateX(100%)' : 'translateX(0%)'
  } else {
    return mode.value === 'online' ? 'translateX(0%)' : 'translateX(100%)'
  }
})


const authModalData = {
  title: t('duelGrammarTips.authModal'),
  text: t('duelGrammarTips.authText')
}
const showDevModal = ref(false)
const levels = ['A1', 'A2', 'B1', 'B2']
const levelStats = computed(() => {
  return gameStore.achievements[selectedLevel.value] || {
    wins: 0,
    streaks: 0,
    cleanSweeps: 0,

  }
})
const showTips = ref(false)
const selectedLevel = ref('A1')
const isWaitingForOpponent = computed(() => mode.value === 'online' && !!gameStore.gameId && gameStore.sessionData?.status === 'waiting')
const isOpponentFound = computed(() => mode.value === 'online' && gameStore.sessionData?.status === 'starting')
const overlayData = ref({
  title: "wordDuel.rulesTitle",
  text: "wordDuel.rulesText",
  subtext: "wordDuel.subText"
})

const openModal = () => {
  showDevModal.value = true
}
const closeModal = () => {
  showDevModal.value = false
}
const closeAuthModal = () => {
  showAuthModal.value = false
}
const tipsModule = () => {
  showTips.value = true
}
const tipsData = ref({
  tips: [
    {id: '1', text: t('duelGrammarTips.tipOne')},
    {id: '2', text: t('duelGrammarTips.tipTwo')},
    {id: '3', text: t('duelGrammarTips.tipThree')},
    {id: '4', text: t('duelGrammarTips.tipFour')},
    {id: '5', text: t('duelGrammarTips.tipFive')},
  ]
})

function cancelSearch() {
  gameStore.cancelSearch()
}

function goBack() {
  router.push('/')
  gameStore.cancelSearch()
}

function selectLevel(level) {
  selectedLevel.value = level
}


async function startGame() {
  const level = selectedLevel.value

  if (!authStore.uid) {
    showAuthModal.value = true
    return
  }
  if (mode.value === 'online') {
    gameStore.findGame(level)
  } else {
    if (!sentencesStore.db) {
      await sentencesStore.loadSentences()
    }
    router.push({path: '/sentence-solo', query: {level}})
  }
}

watch(() => gameStore.sessionData?.status, (newStatus) => {
  if (mode.value === 'online' && newStatus === 'starting') {
    setTimeout(() => {
      if (gameStore.gameId) {
        router.push(`/game/${gameStore.gameId}`)
      }
    }, 2000)
  }
})
watch(() => authStore.uid, (newUid) => {
  if (newUid) {
    gameStore.loadUserAchievements();
  }
}, {immediate: false});

onMounted(async () => {
  isLoading.value = true;
  if (authStore.uid) {
    await gameStore.loadUserAchievements()
  }
  if (!sentencesStore.db) {
    await sentencesStore.loadSentences();
  }
  isLoading.value = false;
})
onUnmounted(() => {
  if (isWaitingForOpponent.value) {
    gameStore.cancelSearch()
    gameStore.loadUserAchievements()
  }
})

watch(() => gameStore.sessionData?.status, async (s) => {
  if (s === 'finished') await gameStore.loadUserAchievements()
})
</script>

<style scoped>

.mode-toggle-wrapper {
  display: flex;
  background: var(--tabBg);
  border-radius: 36px;
  position: relative;
  margin: 2rem auto;
  border: 3px solid var(--menuBorder);
  box-shadow: 2px 2px 0 var(--menuBorder);
  overflow: hidden;
  padding: 4px;
  margin: 10px;
}

.tipps__icon {
  width: 36px;
}

.stats__block-info {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.duel__wrapper {
  max-width: 1024px;
  margin: 0 auto;
}

.stats__block-level {
  font-size: 23px;
  font-weight: 600;
  color: white;
  background: #674bff;
  padding: 10px 25px;
  margin-bottom: 25px;
  border-radius: 10px;
  box-shadow: 0 5px 0 #583ee1;
}

.duel__icon{
  width: 200px;
  margin: 0 auto;
  padding: 30px;
}

.tiips__info-wrapper {
  display: flex;
  align-items: center;
  gap: 19px;
}

.btn__tips {
  background: none;
  border: none;
  cursor: pointer;
}

.duel__header--title {
  color: var(--title);
  font-weight: 600;
  font-size: 24px;
  margin-left: 15px;
  text-shadow: 0px 1px var(--title);
}

.duel__header--left {
  display: flex;
  align-items: center;
}

.mode-toggle-option {
  flex: 1;
  text-align: center;
  padding: 12px 5px;
  cursor: pointer;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 17px;
  position: relative;
  transition: color 0.4s cubic-bezier(.38, 1.32, .39, 1);
  user-select: none;
  z-index: 1;
}

.mode-toggle-option--inactive {
  color: var(--titleColor);
}

.mode-toggle-slider {
  pointer-events: none;
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: var(--tabsSlideBg);
  border-radius: 42px;
  transition: transform 0.4s cubic-bezier(.38, 1.32, .39, 1);
  z-index: 0;
}

.mode-toggle-slider--local {
  transform: translateX(100%);
}

.duel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px 15px 10px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 15px;
}

.back-button-global {
  display: flex;
  align-items: center;
  border: 2px solid #1e1e1e;
  padding: 15px;
  background: #4ade80;
  border-radius: 16px;
  cursor: pointer;
  color: #282626;
  font-size: 1.2rem;
  font-weight: 400;
  font-family: "Nunito", sans-serif;
  box-shadow: 2px 2px 0px #1e1e1e;
  transition: all 0.1s ease-in-out;
}

.duel__question-img {
  width: 40px;
  cursor: pointer;
}

.back-button-global svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.lobby-container {
  font-family: 'Nunito', sans-serif;
  height: 100%;
}

.page-subtitle {
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
  color: var(--titleColor);
  margin-top: 5px;
}

.level-grid {
  display: flex;
  gap: 10px;
}

.level-card {
  background-color: var(--tabBg);
  border-radius: 20px;
  padding: 15px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border: 2px solid var(--menuBorder);
  box-shadow: 2px 2px 0 var(--menuBorder);
  color: var(--titleColor);
}

.level-card {
  width: 100%;
}

.level-card.level-card--selected {
  background-color: #674bff;
  color: white;
}

.card-level-title {
  font-size: 24px;
  font-weight: 800;
  margin: 0;
  text-align: center;
}

.status-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
}

.status-text {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--titleColor);
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.dots {
  animation: pulse 1.5s infinite;
}

.cancel-button {
  min-width: 180px;
  margin-top: 25px;
  background-color: #da5252;
  border: none;
  box-shadow: 0 5px 0 #e36363;
  color:white;
  font-weight: 600;
  font-size: 1rem;
  padding: 12px 16px;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
}


.main-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
}

.stats-block {
  background-color: var(--menuItemsBg);
  border: 3px solid var(--menuBorder);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 0 var(--menuBorder);
  top: 20px;
  width: 100%;
}

.stats-block h3 {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 25px;
  color: var(--titleColor);
  line-height: 1.3;
  text-shadow: 0px 1px var(--titleColor);
}

.stats-block h3 span {
  display: inline-block;
  background-color: #FFD24B;
  color: #1e1e1e;
  padding: 2px 12px;
  border-radius: 15px;
  margin-top: 8px;
  border: 2px solid #1e1e1e;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f7f7;
  padding: 12px 18px;
  border-radius: 18px;
  border: 2px solid #e0e0e0;
  transition: all 0.2s ease;
}

.stat-label {
  font-weight: 600;
  font-size: 1rem;
  color: #333;
}

.stat-value {
  font-weight: 900;
  font-size: 1.8rem;
  color: #4ade80;
}

.start-game-button {
  display: block;
  width: 100%;
  text-decoration: none;
  background: #3b82f6;
  color: #ffffff;
  padding: 14px;
  border-radius: 54px;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  border: none;
  box-shadow: 0 6px 0 #1d4ed8;
  transition: transform 0.1s;
}


.start-game-button:disabled {
  background-color: #ccc;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.7;
}

@media (max-width: 767px) {
  .level-grid {
    display: flex;
  }
}

.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.duel__icon-wrapper {
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.radar-pulse.p2 {
  animation-delay: 1s;
}

.radar-pulse.p3 {
  animation-delay: 2s;
}

.animated-dots span {
  display: inline-block;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: 4px;
  color: var(--titleColor);
  line-height: 0;
  animation: dotJump 1.4s infinite both;
}

.animated-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.animated-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotJump {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-6px);
  }
}

</style>