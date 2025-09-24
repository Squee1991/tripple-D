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
            <div v-if="!isWaitingForOpponent && !isOpponentFound">
                <div class="duel__header">
                    <button @click="goBack" class="back-button-global" aria-label="Назад">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                        <span>{{ t('wordDuel.btnBack') }}</span>
                    </button>
                    <div class="header-section">
                        <h1 class="page-title">{{ t('wordDuel.title') }}</h1>
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
                    <div class="mode-toggle-slider" :class="{ 'mode-toggle-slider--local': mode === 'local' }"></div>
                </div>
                <p class="page-subtitle">{{ t('wordDuel.subTitle') }}</p>

                <div class="main-content-wrapper">
                    <div class="level-grid">
                        <button
                                v-for="level in levels"
                                :key="level"
                                @click="handleFindGameClick(level)"
                                class="level-card"
                                :disabled="(mode === 'online' && gameStore.isSearching) || isLoading"
                        >
                            <h2 class="card-level-title">{{ t('wordDuel.level') }} {{ level }}</h2>
                        </button>
                    </div>

                    <div v-if="authStore.uid" class="stats-block">
                        <h3>
                            Твоя статистика<br> по уровню <span>{{ selectedLevel }}</span>
                        </h3>
                        <div class="stats-container">
                            <div class="stat-item">
                                <span class="stat-label">Побед</span>
                                <span class="stat-value">{{ levelStats.wins }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Серия побед</span>
                                <span class="stat-value">{{ levelStats.streaks }}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Чистые победы</span>
                                <span class="stat-value">{{ levelStats.cleanSweeps }}</span>
                            </div>
                        </div>
                        <p class="stats-hint">Нажми на уровень, чтобы увидеть статистику по нему.</p>
                    </div>
                </div>
            </div>
            <div v-else class="status-overlay">
                <div v-if="isWaitingForOpponent">
                    <p class="status-text">{{ t('wordDuel.searching') }}<span class="dots">...</span></p>
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
import {useI18n} from 'vue-i18n'
import Modal from '../src/components/modal.vue'
import TipsModal from '../src/components/V-tips.vue'
import Login from '../assets/images/login.svg'

const authStore = userAuthStore()
const {t} = useI18n()
const router = useRouter()
const gameStore = useDuelStore()
const showAuthModal = ref(false)
const sentencesStore = useSentencesStore()
const mode = ref('online')
const isLoading = ref(true)
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
        flawlessWins: 0
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

async function handleFindGameClick(level) {
    selectedLevel.value = level

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
        router.push({path: '/duel-solo', query: {level}})
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
}, { immediate: false }); // immediate: false, чтобы не вызывать сразу, так как это уже делает onMounted
onMounted(async () => {
    isLoading.value = true;
    // ИЗМЕНЕНИЕ 2: Загружаем статистику пользователя при загрузке компонента
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
    width: 320px;
    display: flex;
    background: #fff;
    border-radius: 16px;
    position: relative;
    margin: 2rem auto;
    box-shadow: 4px 4px 0px #1e1e1e;
    border: 3px solid #1e1e1e;
    overflow: hidden;
    padding: 4px;
}

.tipps__icon {
    width: 50px;
}

.tiips__info-wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
}

.btn__tips {
    background: none;
    border: none;
    cursor: pointer;
}

.mode-toggle-option {
    flex: 1;
    text-align: center;
    padding: 14px 5px;
    cursor: pointer;
    color: #fff;
    font-family: "Nunito", sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    position: relative;
    transition: color 0.4s cubic-bezier(.38, 1.32, .39, 1);
    user-select: none;
    z-index: 1;
}

.mode-toggle-option--inactive {
    color: #1e1e1e;
}

.mode-toggle-slider {
    position: absolute;
    top: 4px;
    left: 4px;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background: #1e1e1e;
    border-radius: 12px;
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
    padding: 0 40px;
}

.back-button-global {
    border: none;
    display: flex;
    align-items: center;
    border: 3px solid #1e1e1e;
    padding: 15px;
    background: #4ade80;
    border-radius: 16px;
    cursor: pointer;
    color: #1e1e1e;
    font-size: 1.2rem;
    font-weight: 400;
    font-family: "Nunito", sans-serif;
    box-shadow: 4px 4px 0px #1e1e1e;
    transition: all 0.1s ease-in-out;
}

.duel__question-img {
    width: 70px;
    cursor: pointer;
}

.back-button-global:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #1e1e1e;
}

.back-button-global svg {
    width: 24px;
    height: 24px;
    fill: #3A3A3A;
}

.lobby-container {
    padding: 40px;
    font-family: 'Nunito', sans-serif;
    min-height: 100vh
}

.page-title {
    font-size: 2.3rem;
    font-weight: 800;
    color: var(--titleColor);
    text-align: center;
    max-width: 500px;
}

.page-subtitle {
    text-align: center;
    padding: 20px;
    font-size: 1.2rem;
    color: var(--titleColor);
    margin-top: 5px;
}

.level-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
    width: 100%;
}

.header-section {
    padding: 12px;
}

.level-card {
    background-color: white;
    border: 3px solid #1e1e1e;
    border-radius: 20px;
    padding: 25px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    gap: 15px;
    box-shadow: 8px 8px 0px #1e1e1e;
}

.level-card:hover:not(:disabled) {
    background-color: #FFD24B;
    transform: translateY(-2px) scale(1.01);
    box-shadow: 6px 6px 0px #1e1e1e;
}

.level-card:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.level-card {
  border-color: #1e1e1e;
}

.card-level-title {
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
    color: #1e1e1e;
}

.level-card:hover:not(:disabled) .card-level-title {
  color: #1e1e1e;
}

.status-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 60vh;
}

.status-text {
    font-size: 2.5rem;
    font-weight: 800;
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
    margin-top: 25px;
    background-color: #f7f7f7;
    border: 3px solid #E89C9C;
    color: #a85252;
    font-weight: 600;
    font-size: 1rem;
    padding: 10px 25px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-button:hover {
    background-color: #E89C9C;
    color: white;
    transform: translateY(-2px);
}

/* --- ДОБАВЛЕННЫЕ И ОБНОВЛЕННЫЕ СТИЛИ --- */

.main-content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center; /* Центрируем по горизонтали */
    gap: 40px;
    max-width: 1200px;
    margin: 40px auto 0;
}


.stats-block {
    background-color: #fff;
    border: 3px solid #1e1e1e;
    border-radius: 20px;
    padding: 25px;
    box-shadow: 8px 8px 0 #1e1e1e;
    top: 20px;
    width: 100%;

}

.stats-block h3 {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 800;
    margin-top: 0;
    margin-bottom: 25px;
    color: #1e1e1e;
    line-height: 1.3;
}

.stats-block h3 span {
    display: inline-block;
    background-color: #FFD24B;
    color: #1e1e1e;
    padding: 2px 12px;
    border-radius: 8px;
    margin-top: 8px;
    border: 2px solid #1e1e1e;
}

.stats-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f7f7f7;
    padding: 12px 18px;
    border-radius: 12px;
    border: 2px solid #e0e0e0;
    transition: all 0.2s ease;
}

.stat-item:hover {
    transform: scale(1.03);
    border-color: #1e1e1e;
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

.stats-hint {
    text-align: center;
    font-size: 0.9rem;
    color: #777;
    margin-top: 25px;
    margin-bottom: 0;
}


@media (max-width: 1024px) {
    .page-title {
        font-size: 1.2rem;
        text-align: center;
    }

    .duel__header {
        padding: 0 10px;
    }

    .main-content-wrapper {
        grid-template-columns: 1fr; /* Статистика под блоками уровней */
    }

    .stats-block {
        position: static; /* Отключаем "липкость" */
        margin-top: 20px;
    }
}

@media (max-width: 767px) {
    .back-button-global {
        padding: 10px;
        width: 100%;
        justify-content: center;
        font-size: 1.1rem;
        font-family: "Nunito", sans-serif;
        font-weight: 600;
        box-shadow: 2px 2px 0 black;
    }

    .lobby-container {
        padding: 20px;
    }

    .card-level-title {
        text-align: center;
        font-size: 1.4rem;
    }

    .duel__header {
        flex-direction: column;
    }

    .level-grid {
        display: flex;
        flex-direction: column;
    }

    .level-card {
        box-shadow: 2px 2px 2px #1e1e1e;
    }
}
</style>