<script setup>
import {ref, watch, computed, onMounted} from 'vue'
import {userAuthStore} from '../store/authStore.js'
import {useGuessWordStore} from '../store/guesStore.js'
import {useGameStore} from '../store/marafonStore.js'
import {useRouter} from 'vue-router'
import LeaderboardItem from '../src/components/LeaderboardItem.vue'
import ModalOverlay from '../src/components/modalOverlay.vue'
import CloseIcon from '../assets/images/close.svg'

const {t} = useI18n()
const router = useRouter()
const authStore = userAuthStore()
const guessStore = useGuessWordStore()
const gameStore = useGameStore()
const activeDiscipline = ref('guess')
const guessRating = ref([])
const isGuessLoading = ref(true)
const marathonRating = ref([])
const isMarathonLoading = ref(true)
const isModal = ref(false)
const activeMarathonDifficulty = ref(1)

const disciplines = ref([
  {id: 'guess', label: 'ranked.guessTab'},
  {id: 'marathon', label: 'ranked.marathonTab'}
]);

const modalValues = ref({
  text: "modal.textRanked",
  btn: "modal.textBtn"
})

const difficultyLabels = {
  1: 'ranked.easy',
  2: 'ranked.normal',
  3: 'ranked.hard'
}

const backToMainPage = () => {
  router.back()
}

const isInGuessLeaderboard = computed(() =>
    guessRating.value.some(r => r.name === authStore.name)
);

const userMarathonRecord = computed(() => {
  if (!authStore.uid || !marathonRating.value || marathonRating.value.length === 0) {
    return 0;
  }
  const userRecord = marathonRating.value.find(player => player.id === authStore.uid);
  return userRecord ? userRecord.streak : 0;
})

async function loadGuessStatistics() {
  isGuessLoading.value = true
  guessRating.value = await guessStore.loadLeaderboard()
  if (authStore.uid) {
    await guessStore.loadGuessProgress()
  }
  isGuessLoading.value = false
}

async function loadMarathonStatistics() {
  isMarathonLoading.value = true;
  marathonRating.value = await gameStore.loadMarathonLeaderboard(activeMarathonDifficulty.value)
  if (authStore.uid) {
    await gameStore.fetchRecord()
  }
  isMarathonLoading.value = false
}

async function addToLeaderboard() {
  if (!Array.isArray(guessStore.guessedWords) || guessStore.guessedWords.length === 0) {
    isModal.value = true
    return;
  }
  await guessStore.saveToLeaderboard(authStore.name, guessStore.guessedWords.length)
  guessRating.value = await guessStore.loadLeaderboard()
}

watch(activeMarathonDifficulty, () => {
  if (activeDiscipline.value === 'marathon') {
    loadMarathonStatistics()
  }
});

watch(activeDiscipline, (newDiscipline) => {
  if (newDiscipline === 'guess') {
    loadGuessStatistics()
  } else if (newDiscipline === 'marathon') {
    loadMarathonStatistics()
  }
}, {immediate: true});

watch(() => authStore.uid, () => {
  if (activeDiscipline.value === 'guess') {
    loadGuessStatistics()
  } else if (activeDiscipline.value === 'marathon') {
    loadMarathonStatistics()
  }
}, {immediate: true});

onMounted(async () => {
  if (authStore.uid) {
    await gameStore.fetchRecord()
  }
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
      <div class="ranked__side-btnBack-wrapper">
        <button @click="backToMainPage" class="ranked__side-btnBack">{{ t('chooseTheme.btnBack') }}</button>
      </div>
      <h1 class="corkboard-title">{{ t('ranked.label') }}</h1>
      <div class="control-card">
        <div class="pin"></div>
        <div class="discipline-selector">
          <button
              v-for="tab in disciplines" :key="tab.id"
              class="discipline-selector__button"
              :class="{ 'active': activeDiscipline === tab.id }"
              @click="activeDiscipline = tab.id"
          >
            {{ t(tab.label) }}
          </button>
        </div>
      </div>
      <div class="control-card" v-if="activeDiscipline === 'marathon'">
        <div class="pin"></div>
        <h3 class="control-card__title">{{ t('ranked.difficulty') }}</h3>
        <div class="difficulty-selector">
          <button
              v-for="(label, level) in difficultyLabels"
              :key="level"
              class="difficulty-selector__button"
              :class="{ 'active': activeMarathonDifficulty == level }"
              @click="activeMarathonDifficulty = level"
          >
            {{ t(label) }}
          </button>
        </div>
      </div>
      <div class="control-card user-stats-card">
        <div class="pin"></div>
        <h3 class="control-card__title">{{ t('ranked.myStats') }}</h3>
        <div v-if="authStore.uid">
          <p v-if="activeDiscipline === 'guess'" class="user-stats__item">
            {{ t('ranked.wordsGuessed') }} <span>{{ guessStore.guessedWords.length }}</span>
          </p>
          <p v-if="activeDiscipline === 'marathon'" class="user-stats__item">
            {{ t('ranked.maxStreak') }} <span>{{ userMarathonRecord }}</span>
          </p>
          <button
              v-if="activeDiscipline === 'guess' && !isInGuessLeaderboard && !isGuessLoading"
              @click="addToLeaderboard"
              class="user-stats__action-btn"
          >
            {{ t('ranked.toRanked') }}
          </button>
        </div>
        <p v-else class="user-stats__item">{{ t('ranked.notAuth') }}</p>
      </div>
    </div>
    <div class="ranked-leaderboard-blackboard">
      <div class="blackboard-frame">
        <div class="blackboard">
          <div v-if="activeDiscipline === 'guess'">
            <div v-if="isGuessLoading" class="blackboard__message">{{ t('ranked.loading') }}</div>
            <div v-else-if="guessRating.length">
              <h2 class="blackboard__title">{{ t('ranked.guesTabelelable') }}</h2>
              <ul class="leaderboard__items-container" data-simplebar>
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
              <div class="black__board-title">{{ t('ranked.notData') }}</div>
              <img src="../assets/images/leadership.svg" alt="">
            </div>
          </div>
          <div v-if="activeDiscipline === 'marathon'">
            <div v-if="isMarathonLoading" class="blackboard__message">{{ t('ranked.loading') }}</div>
            <div v-else-if="marathonRating.length">
              <h2 class="blackboard__title">{{ t('ranked.guesMarathonlable') }}: {{
                  t(difficultyLabels[activeMarathonDifficulty])
                }}</h2>
              <ul class="leaderboard__items-container" data-simplebar>
                <li v-for="(player, index) in marathonRating" :key="player.id">
                  <LeaderboardItem
                      :player="player"
                      :rank="index + 1"
                      :is-current-user="authStore.name && player.name && player.name.trim().toLowerCase() === authStore.name.trim().toLowerCase()"
                      score-field="streak" score-unit=""
                  />
                </li>
              </ul>
            </div>
            <div v-else class="blackboard__message">
              <div class="black__board-title">{{ t('ranked.emptydifficult') }}</div>
              <img class="leaderboard__icon" src="../assets/images/leadership.svg" alt="leadership">
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
  gap: 2rem;
  padding: 2rem;
  min-height: 100vh;
  font-family: "Nunito", sans-serif;
}

.ranked-sidebar-corkboard {
  flex: 1;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: transparent;
  padding: 0;
}

.corkboard-title {
  font-family: "Nunito", sans-serif;
  font-size: 34px;
  text-align: center;
  font-weight: 800;
  color: var(--titleColor);
}

.leaderboard__icon {
  padding: 30px;
  max-width: 400px;
}

.black__board-title {
  text-align: center;
  font-weight: 800;
  font-size: 1.8rem;
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
  font-family: "Baloo 2", sans-serif;
  box-shadow: 0 5px 0 0 #4a3f73;
  transition: all 0.1s ease-in-out;
}

.ranked__side-btnBack:hover {
  transform: translateY(2px);
  box-shadow: 0 3px 0 0 #4a3f73;
}

.ranked__side-btnBack:active {
  transform: translateY(5px);
  box-shadow: 0 0px 0 0 #4a3f73;
}


.control-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  box-shadow: 0 6px 0 0 #c7bce1;
  padding: 20px;
  border-radius: 24px;
  border: 4px solid #4a3f73;
  position: relative;
}

.pin {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 24px;
  background: #ff8a80;
  border-radius: 50%;
  border: 3px solid #4a3f73;
}

.control-card__title {
  text-align: center;
  font-weight: 800;
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  color: #4a3f73;
}

.discipline-selector, .difficulty-selector {
  display: flex;
  gap: 10px;
  background: #e1dcf2;
  padding: 8px;
  border-radius: 50px;
}

.discipline-selector__button, .difficulty-selector__button {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-family: "Baloo 2", sans-serif;
  font-weight: 600;
  background: transparent;
  color: #4a3f73;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.discipline-selector__button:hover, .difficulty-selector__button:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.discipline-selector__button.active, .difficulty-selector__button.active {
  background: #ffffff;
  color: #6a5acd;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.user-stats__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 0;
  font-weight: 600;
  font-size: 1.1rem;
  color: #4a3f73;
}

.user-stats__item span {
  font-weight: 800;
  font-size: 1.3em;
  background: #ffffff;
  padding: 2px 8px;
  border-radius: 12px;
  border: 3px solid #d1c4e9;
  min-width: 45px;
  height: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-stats__action-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 0.8rem;
  font-size: 1.1rem;
  font-family: "Baloo 2", sans-serif;
  font-weight: 800;
  background: #80deea;
  color: #4a3f73;
  border: 4px solid #4a3f73;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 5px 0 0 #4a3f73;
  transition: all 0.1s ease-in-out;
}

.user-stats__action-btn:hover {
  transform: translateY(2px);
  box-shadow: 0 3px 0 0 #4a3f73;
}

.user-stats__action-btn:active {
  transform: translateY(5px);
  box-shadow: 0 0 0 0 #4a3f73;
}

.ranked-leaderboard-blackboard {
  flex: 2;
  background: #b39ddb;
  border-radius: 30px;
  border: 5px solid #4a3f73;
  box-shadow: 0 10px 0 0 #4a3f73;
  padding: 24px;
  display: flex;
  width: 100%;
  max-width: 100%;
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

.blackboard__title {
  font-weight: 800;
  color: #ffffff;
  font-family: "Nunito", sans-serif;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 20px;
  text-shadow: 3px 3px 0 #8e7cc3;
}

.blackboard__message {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  font-size: 1.8rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.7);
}

.leaderboard__items-container {
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-y: auto;
}

.leaderboard__items-container > li:nth-child(1) .leaderboard-item {
  background: #fff9c4;
}

.leaderboard__items-container > li:nth-child(2) .leaderboard-item {
  background: #c8e6c9;
}

.leaderboard__items-container > li:nth-child(3) .leaderboard-item {
  background: #ffccbc;
}


::-webkit-scrollbar {
  width: 16px;
}

::-webkit-scrollbar-track {
  background: #d1c4e9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #ffffff;
  border-radius: 10px;
  border: 4px solid #d1c4e9;
}

::-webkit-scrollbar-thumb:hover {
  background: #fffde7;
}

@media (max-width: 1023px) {
  .ranked-layout {
    flex-direction: column;
    gap: 20px;
    padding: 10px;
  }

  .ranked-sidebar-corkboard {
    width: 100%;
    max-width: 100%;
  }
  .ranked-leaderboard-blackboard, .control-card, .ranked__side-btnBack {
    box-shadow: 0 6px 0 0 #4a3f73;
  }
}

@media (max-width: 767px) {
  .ranked-leaderboard-blackboard {
    padding: 10px;
  }
}
</style>