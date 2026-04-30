<template>
  <div class="page-wrapper">
    <div class="header__title-wrapper">
      <VBackBtn/>
      <h1 class="header__title">{{ t('ranked.marathonTab')}}</h1>
    </div>
    <div class="prepare-container">
      <div class="banner">
        <VBanner
            :text="t('marathonPrepare.subtitle')"
            :icon="DailyIcon"
        />
      </div>
      <div class="panel__wrapper">
        <div v-if="authStore.uid" class="user-greeting">
          <p class="record">
            {{ t('marathonPrepare.streak') }}
            <span class="record__value">{{ currentRecord }}</span>
          </p>
        </div>
        <div v-else class="guest-greeting">
          <p>{{ t('marathonPrepare.notAuth') }}</p>
        </div>
        <div v-if="gameStore.isLoaded" class="settings-block">
          <h2>{{ t('marathonPrepare.chooseDifficulty') }}</h2>
          <div class="difficulty-options">
            <button
                v-for="opt in difficultyBase"
                :key="opt.value"
                @click="selectedDifficulty = opt.value"
                class="difficulty-btn"
                :class="[{'active': selectedDifficulty === opt.value}, opt.base]"
            >
              <div class="button-content">
                <span class="btn-title">{{ t(opt.titleKey) }}</span>
                <span class="btn-desc">{{ t(opt.descKey) }}</span>
              </div>
              <div class="difficulty-bars">
                <div class="bar bar-1" :class="{ 'bar-active': opt.value >= 1 }"></div>
                <div class="bar bar-2" :class="{ 'bar-active': opt.value >= 2 }"></div>
                <div class="bar bar-3" :class="{ 'bar-active': opt.value >= 3 }"></div>
              </div>
            </button>
          </div>
        </div>
        <div v-else class="loading">
          <div class="bouncy-loader">
            <span></span><span></span><span></span>
          </div>
          <p>{{ t('marathonPrepare.loading') }}</p>
        </div>
      </div>
    </div>
    <div class="bottom-action">
      <button
          class="start-button"
          @click="startGame"
          :disabled="!authStore.uid || !gameStore.isLoaded"
      >
        {{ authStore.uid ? t('marathonPrepare.start') : t('marathonPrepare.login') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useGameStore} from '../store/marafonStore.js'
import {userAuthStore} from '../store/authStore.js'
import {useSeoMeta} from "#imports";
import VBackBtn from "~/src/components/V-back-btn.vue";
import VBanner from "~/src/components/V-banner.vue";
import DailyIcon from '../assets/images/dailyIcons/timer.svg'

useSeoMeta({
  robots: 'noindex, nofollow'
})

const {t} = useI18n()
const gameStore = useGameStore()
const authStore = userAuthStore()
const router = useRouter()
const selectedDifficulty = ref(1)

const currentRecord = computed(() => {
  if (gameStore.personalBests) {
    return gameStore.personalBests[selectedDifficulty.value] || 0
  }
  return 0
})

onMounted(() => {
  if (!gameStore.loadWords && typeof gameStore.loadWords !== 'function') return
  gameStore.loadWords()
  gameStore.fetchRecord()
})

function startGame() {
  if (!authStore.uid) return
  gameStore.selectGameSettings(selectedDifficulty.value)
  router.push('/marathon-session')
}

const difficultyBase = ref([
  {
    value: 1,
    base: 'easy',
    titleKey: 'marathonPrepare.difficultEasy',
    descKey: 'marathonPrepare.difficultDescriptionEasy'
  },
  {
    value: 2,
    base: 'normal',
    titleKey: 'marathonPrepare.difficultNormal',
    descKey: 'marathonPrepare.difficultDescriptionNormal'
  },
  {
    value: 3,
    base: 'hard',
    titleKey: 'marathonPrepare.difficultHard',
    descKey: 'marathonPrepare.difficultDescriptionHard'
  }
])
</script>

<style scoped>

.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  font-family: "Nunito", sans-serif;
  background-color: var(--bg);
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.banner {
  padding: 0 15px;
}

.header__title-wrapper {
  display: flex;
  align-items: center;
  padding: 5px 10px 10px 10px;
  flex-shrink: 0;
  z-index: 10;
  margin-bottom: 15px;
}

.header__title {
  flex: 1;
  font-size: 22px;
  font-weight: 900;
  color: var(--titleColor);
  letter-spacing: 0.5px;
  margin-left: 15px;
  text-shadow: 0 1px var(--titleColor);
}

.prepare-container {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow-y: auto;
  padding-bottom: calc(env(safe-area-inset-bottom) + 120px);
}

.prepare-container::-webkit-scrollbar {
  display: none;
}

.header {
  text-align: center;
}

.subtitle {
  font-size: 18px;
  color: #6a7585;
  padding: 16px 20px 0;
  margin: 0;
  font-weight: 800;
}

.panel__wrapper {
  padding: 16px 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-greeting, .guest-greeting {
  padding: 16px;
  border-radius: 20px;
  text-align: center;
}

.guest-greeting p {
  color: #1e1e1e;
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.user-greeting .record {
  margin: 0;
  font-weight: 800;
  color: var(--titleColor);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.record__value {
  font-size: 23px;
  font-weight: 900;
  background: #fca13a;
  color: #1e1e1e;
  padding: 4px 16px;
  border-radius: 12px;
}

.settings-block h2 {
  font-size: 22px;
  text-align: center;
  margin: 0 0 16px 0;
  color: var(--titleColor);
  font-weight: 900;
}

.difficulty-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.difficulty-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-radius: 20px;
  border: 3px solid var(--menuBorder);
  box-shadow: 2px 2px 0 var(--menuBorder);
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: left;
  background: #ffffff;
  color: #1e1e1e;
}

.difficulty-btn.easy.active {
  background-color: #2bd653;
  color: white;

}

.difficulty-btn.normal.active {
  background-color: #edc838;
  color: white;
}

.difficulty-btn.hard.active {
  background-color: #e68f8f;
  color: white;
}

.button-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.btn-title {
  font-size: 20px;
  font-weight: 900;
}

.btn-desc {
  font-size: 14px;
  font-weight: 700;
  color: #4b5563;
}

.difficulty-bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 32px;
}

.bar {
  width: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  border: 2px solid #9ca3af;
  transition: all 0.2s;
}

.bar-1 {
  height: 14px;
}

.bar-2 {
  height: 22px;
}

.bar-3 {
  height: 32px;
}

.bar.bar-active {
  background-color: #ef4444;
  border-color: #991b1b;
}


.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 16px;
}

.loading p {
  font-size: 18px;
  font-weight: 800;
  color: #1e1e1e;
  margin: 0;
}

.bouncy-loader {
  display: flex;
  gap: 8px;
}

.bouncy-loader span {
  width: 16px;
  height: 16px;
  background: #6358ac;
  border-radius: 50%;
  animation: bounce 0.5s alternate infinite cubic-bezier(0.6, 0.05, 0.15, 0.95);
}

.bouncy-loader span:nth-child(2) {
  animation-delay: 0.1s;
}

.bouncy-loader span:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-15px);
  }
}


.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25px 20px;
  z-index: 20;
  display: flex;
  justify-content: center;
}

.start-button {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 6px 0 #005bb5;
  cursor: pointer;
  transition: all 0.1s;
  width: 100%;
}

.start-button:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  border-color: #d1d5db;
  cursor: not-allowed;
  box-shadow: 0 5px 0 #d1d5db;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>