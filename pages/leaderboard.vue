<script setup>
import {ref, watch, computed, onMounted, onUnmounted} from 'vue'
import {userAuthStore} from '../store/authStore.js'
import {useGuessWordStore} from '../store/guesStore.js'
import {useGameStore} from '../store/marafonStore.js'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import LeaderboardItem from '../src/components/LeaderboardItem.vue'
import ModalOverlay from '../src/components/modalOverlay.vue'
import CloseIcon from '../assets/images/close.svg'
import VBackBtn from "~/src/components/V-back-btn.vue";

const {t, locale} = useI18n()
const router = useRouter()
const authStore = userAuthStore()
const guessStore = useGuessWordStore()
const gameStore = useGameStore()
const currentSeasonId = ref('')
const activeDiscipline = ref('marathon')
const guessRating = ref([])
const isGuessLoading = ref(true)
const marathonRating = ref([])
const isMarathonLoading = ref(true)
const isModal = ref(false)
const activeMarathonDifficulty = ref(1)
const isLeaderboardOpen = ref(false)
const timeLeftToOpen = ref({d: 0, h: 0, m: 0})
let timerInterval = null

const timerTextComputed = computed(() => {
  return isLeaderboardOpen.value ? t('marathonLeaderBoard.seasonEndsIn') : t('marathonLeaderBoard.seasonStartsIn')
})

const difficultyOptions = ref([
  {level: 1, label: 'ranked.easy'},
  {level: 2, label: 'ranked.normal'},
  {level: 3, label: 'ranked.hard'}
])

const modalValues = ref({
  text: "modal.textRanked",
  btn: "modal.textBtn"
})

const activeDifficultyIndex = computed(() =>
    difficultyOptions.value.findIndex(diff => diff.level === activeMarathonDifficulty.value)
)

const getTransformX = (index, length) => {
  if (index === -1) return 0
  if (locale.value === 'ar') {
    return (length - 1 - index) * 100
  }
  return index * 100
}

const backToMainPage = () => {
  router.push('/')
}

const isInGuessLeaderboard = computed(() =>
    guessRating.value.some(r => r.name === authStore.name)
)

const userMarathonRecord = computed(() => {
  if (!authStore.uid || !marathonRating.value || marathonRating.value.length === 0) {
    return 0
  }
  const userRecord = marathonRating.value.find(player => player.id === authStore.uid)
  return userRecord ? userRecord.streak : 0
})

function updateTimer() {
  const state = gameStore.getSeasonState()
  isLeaderboardOpen.value = state.isOpen
  timeLeftToOpen.value = state.timeLeft
  if (currentSeasonId.value && currentSeasonId.value !== state.currentSeasonId) {
    if (activeDiscipline.value === 'marathon') {
      marathonRating.value = []
      gameStore.personalBests = {1: 0, 2: 0, 3: 0}
    }
  }

  currentSeasonId.value = state.currentSeasonId
}

async function loadGuessStatistics() {
  isGuessLoading.value = true
  guessRating.value = await guessStore.loadLeaderboard()
  if (authStore.uid) {
    await guessStore.loadGuessProgress()
  }
  isGuessLoading.value = false
}

async function loadMarathonStatistics() {
  isMarathonLoading.value = true
  marathonRating.value = await gameStore.loadMarathonLeaderboard(activeMarathonDifficulty.value)
  if (authStore.uid) {
    await gameStore.fetchRecord()
  }
  isMarathonLoading.value = false
}

async function addToLeaderboard() {
  if (!Array.isArray(guessStore.guessedWords) || guessStore.guessedWords.length === 0) {
    isModal.value = true
    return
  }
  await guessStore.saveToLeaderboard(authStore.name, guessStore.guessedWords.length)
  guessRating.value = await guessStore.loadLeaderboard()
}

watch(activeMarathonDifficulty, () => {
  if (activeDiscipline.value === 'marathon') {
    loadMarathonStatistics()
  }
})

watch(activeDiscipline, (newDiscipline) => {
  if (newDiscipline === 'guess') {
    loadGuessStatistics()
  } else if (newDiscipline === 'marathon') {
    loadMarathonStatistics()
  }
}, {immediate: true})

watch(() => authStore.uid, () => {
  if (activeDiscipline.value === 'guess') {
    loadGuessStatistics()
  } else if (activeDiscipline.value === 'marathon') {
    loadMarathonStatistics()
  }
}, {immediate: true})

onMounted(async () => {
  if (authStore.uid) {
    await gameStore.fetchRecord()
  }
  updateTimer()
  timerInterval = setInterval(updateTimer, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<template>
  <div class="ranked-layout">
    <div v-if="isModal">
      <ModalOverlay
          @close="isModal = false"
          :icon="CloseIcon"
          :text="t(modalValues.text)"
          :overlayBtn="t(modalValues.btn)"
      />
    </div>
    <div class="ranked-sidebar-corkboard">
      <div class="ranked__header">
        <div class="ranked__side-btnBack-wrapper">
          <VBackBtn/>
        </div>
        <h1 class="ranked-title">{{ t('ranked.label') }}</h1>
      </div>
      <div class="control-card">
        <div class="marathon-timer-widget">
          <p class="timer-widget__label">{{ timerTextComputed }}</p>
          <div class="timer-widget__countdown" v-if="timeLeftToOpen">
            <div class="timer-widget__item">
              <span class="timer-widget__value">{{ timeLeftToOpen.d }}</span>
              <span class="timer-widget__unit">{{ t('i18nDays.days') }}</span>
            </div>
            <span class="timer-widget__separator">:</span>
            <div class="timer-widget__item">
              <span class="timer-widget__value">{{ timeLeftToOpen.h }}</span>
              <span class="timer-widget__unit">{{ t('i18nDays.hours') }}</span>
            </div>
            <span class="timer-widget__separator">:</span>
            <div class="timer-widget__item">
              <span class="timer-widget__value">{{ timeLeftToOpen.m }}</span>
              <span class="timer-widget__unit">{{ t('i18nDays.mins') }}</span>
            </div>
<!--            <span class="timer-widget__separator">:</span>-->
<!--            <div class="timer-widget__item">-->
<!--              <span class="timer-widget__value">{{ timeLeftToOpen.s }}</span>-->
<!--              <span class="timer-widget__unit">сек</span>-->
<!--            </div>-->
          </div>
        </div>
      </div>
      <div class="control-card" v-if="activeDiscipline === 'marathon'">
        <h3 class="control-card__title">{{ t('ranked.difficulty') }}</h3>
        <nav class="toggle-nav" role="tablist">
          <div
              class="sliding-bg"
              :style="{ width: 'calc(33.333% - 4px)', transform: `translateX(${getTransformX(activeDifficultyIndex, difficultyOptions.length)}%)` }">
          </div>
          <button
              v-for="diff in difficultyOptions"
              :key="diff.level"
              class="toggle-btn"
              :class="{ 'toggle-btn--active': activeMarathonDifficulty === diff.level }"
              role="tab"
              @click="activeMarathonDifficulty = diff.level"
          >
            {{ t(diff.label) }}
          </button>
        </nav>
      </div>
      <div class="control-card user-stats-card"
           v-if="activeDiscipline === 'guess' || (activeDiscipline === 'marathon' && isLeaderboardOpen)">
        <div v-if="authStore.uid">
          <p v-if="activeDiscipline === 'guess'" class="user-stats__item">
            {{ t('ranked.wordsGuessed') }} <span>{{ guessStore.guessedWords.length }}</span>
          </p>
          <p v-if="activeDiscipline === 'marathon'" class="user-stats__item">
            {{ t('ranked.maxStreak') }} <span>{{ userMarathonRecord }}</span>
          </p>
        </div>
        <p v-else class="user-stats__item">{{ t('ranked.notAuth') }}</p>
      </div>
    </div>
    <div class="ranked-leaderboard-blackboard">
      <div class="blackboard-frame">
        <div class="blackboard">
          <div class="blackboard__content">
            <div v-if="activeDiscipline === 'guess'" class="discipline-container">
              <div v-if="guessRating.length" class="leaderboard-wrapper">
                <h2 class="blackboard__title">{{ t('ranked.guesTabelelable') }}</h2>
                <ul class="leaderboard__items-container">
                  <li v-for="(r, index) in guessRating" :key="r.name">
                    <LeaderboardItem
                        :player="r"
                        :rank="index + 1"
                        :is-current-user="authStore.name && r.name && r.name.trim().toLowerCase() === authStore.name.trim().toLowerCase()"
                        score-field="guessed" score-unit=""
                    />
                  </li>
                </ul>
              </div>
              <div v-else class="blackboard__message">
              </div>
            </div>
            <div v-if="activeDiscipline === 'marathon'" class="discipline-container">
              <div v-if="!isLeaderboardOpen" class="blackboard__message timer-message">
                <img class="waiting_icon" src="../assets/images/waitingIcon.png" alt="waiting">
                <p class="empty-state__hint">
                  {{ t('marathonLeaderBoard.stateHint') }}
                </p>
              </div>
              <div v-else-if="marathonRating.length" class="leaderboard-wrapper">
                <h2 class="blackboard__title">
                  {{ t('ranked.guesMarathonlable') }}:
                  {{ t(difficultyOptions.find(d => d.level === activeMarathonDifficulty)?.label || '') }}
                </h2>
                <ul class="leaderboard__items-container">
                  <li v-for="player in marathonRating" :key="player.id">
                    <LeaderboardItem
                        :player="player"
                        :rank="player.rank"
                        :is-current-user="authStore.name && player.name && player.name.trim().toLowerCase() === authStore.name.trim().toLowerCase()"
                        score-field="streak" score-unit=""
                    />
                  </li>
                </ul>
              </div>
              <div v-else class="blackboard__message empty-state">
                <img class="waiting_icon" src="../assets/images/waitingIcon.png" alt="sad hedgehog">
                <div class="black__board-title">{{ t('ranked.emptydifficult') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ranked-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  font-family: "Nunito", sans-serif;
}

.ranked__header {
  display: flex;
  align-items: center;
}

.ranked-sidebar-corkboard {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: transparent;
  padding: 5px 10px 15px 10px;
}

.ranked-title {
  font-family: "Nunito", sans-serif;
  font-size: 23px;
  text-align: center;
  font-weight: 800;
  margin-left: 15px;
  color: var(--title);
}

.leaderboard__icon {
  padding: 30px;
  max-width: 400px;
}

.black__board-title {
  text-align: center;
  font-weight: 800;
  font-size: 16px;
  padding: 0 20px;
  color: #ffffff;
}

.ranked__side-btnBack {
  width: 100%;
  border: 4px solid #4a3f73;
  padding: 15px;
  background: #ffffff;
  border-radius: 20px;
  cursor: pointer;
  color: #4a3f73;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: Nunito, sans-serif;
  box-shadow: 0 3px 0 0 #4a3f73;
  transition: all 0.1s ease-in-out;
}

.ranked__side-btnBack:active {
  transform: translateY(5px);
  box-shadow: 0 0px 0 0 #4a3f73;
}

.control-card__title {
  text-align: center;
  font-weight: 800;
  font-size: 18px;
  color: var(--titleColor);
  margin-bottom: 6px;
  display: none;
}

.toggle-nav {
  display: flex;
  position: relative;
  justify-content: space-between;
  border-radius: 40px;
  padding: 6px;
  background: var(--tabBg);
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  margin: 0 4px;
  z-index: 1;
  flex-shrink: 0;
}

.sliding-bg {
  position: absolute;
  top: 5px;
  bottom: 6px;
  left: 6px;
  background: var(--tabsSlideBg);
  box-shadow: var(--tabSlideBoxShadow);
  border-radius: 30px;
  transition: transform 0.4s cubic-bezier(0.34, 1.35, 0.64, 1);
  z-index: 1;
}

.toggle-btn {
  border: none;
  background: none;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  cursor: pointer;
  position: relative;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;
  font-size: 14px;
  font-family: Nunito, sans-serif;
  font-weight: 700;
  color: white;
  transition: color 0.3s;
}

.toggle-btn--active {
  color: #ffffff;
}

.user-stats__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px;
  font-weight: 600;
  font-size: 18px;
  padding: 16px;
  border-radius: 24px;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.1), 0 6px 0 rgb(0, 160, 220);
  background: linear-gradient(145deg, rgb(0, 194, 255), rgb(0, 168, 219)) rgb(0, 194, 255);
  color: var(--titleColor);
}

.user-stats__item span {
  font-weight: 400;
  font-size: 30px;
  padding: 2px 8px;
  border-radius: 12px;
  min-width: 45px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Lilita One', sans-serif;
}

.ranked-leaderboard-blackboard {
  flex: 2;
  border-radius: 30px;
  display: flex;
  max-width: 100%;
  height: 100vh;
  overflow-y: auto;
  margin: 0 10px 10px 10px;
}

.blackboard-frame, .blackboard {
  background: transparent;
  padding: 0;
  border: none;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.blackboard {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.blackboard__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.discipline-container, .leaderboard-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.blackboard__title {
  font-weight: 800;
  color: #ffffff;
  font-family: "Nunito", sans-serif;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 10px;
}

.blackboard__message {
  display: flex;
  margin-top: 40px;
  align-items: center;
  flex-direction: column;
  height: 100%;
}

.empty-state {
  gap: 15px;
}

.empty-state__hint {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  line-height: 1.4;
  font-weight: 600;
  max-width: 280px;
  margin: 0 auto;
}

.timer-message {
  gap: 15px;
}

.waiting_icon {
  width: 140px;
  margin-bottom: 10px;
}

.timer-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  color: #d1c4e9;
  text-align: center;
}

.leaderboard__items-container {
  padding: 0 2px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

::-webkit-scrollbar {
  width: 2px;
}

::-webkit-scrollbar-track {
  background: #2f2d31;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #ffffff;
  border-radius: 10px;
  border: 4px solid #d1c4e9;
}

.marathon-timer-widget {
  background: var(--tabBg);
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 20px;
  padding: 12px 15px;
  margin: 0 4px;
  box-shadow: var(--boxShadowMobile);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.timer-widget__label {
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  font-family: "Nunito", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  margin: 0;
}

.timer-widget__countdown {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: 'Lilita One', sans-serif;
  width: 100%;
}

.timer-widget__item {
  display: flex;
  align-items: center;
  background: rgba(0, 194, 255, 0.15);
  border: 2px solid #00c2ff;
  border-radius: 12px;
  min-width: 50px;
  padding: 6px 4px;
}

.timer-widget__value {
  font-size: 22px;
  color: #00c2ff;
  line-height: 1;
  font-family: Lilita One, sans-serif;
}

.timer-widget__unit {
  font-size: 14px;
  color: #00c2ff;
  font-family: "Nunito", sans-serif;
  text-transform: uppercase;
  margin-top: 4px;
  font-weight: 700;
}

.timer-widget__separator {
  font-size: 24px;
  color: #00c2ff;
  font-weight: bold;
}

@media (max-width: 1023px) {
  .ranked-sidebar-corkboard {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 767px) {
  .ranked-leaderboard-blackboard {
    padding: 6px;
  }
}
</style>