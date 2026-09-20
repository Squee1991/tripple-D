<template>
  <div class="page-wrapper">
    <div class="header__title-wrapper">
      <VBackBtn/>
      <h1 class="header__title">{{ t('ranked.marathonTab')}}</h1>
    </div>
    <Transition>
      <div v-if="isMounted" class="prepare-container">
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
    </Transition>
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
const isMounted = ref(false)

const currentRecord = computed(() => {
  const bests = gameStore.allTimeBests || gameStore.personalBests
  if (bests) {
    return bests[selectedDifficulty.value] || 0
  }
  return 0
})

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 100)
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
  background-color: var(--bg, #0f111a);
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
  color: #ffffff;
  letter-spacing: 0.5px;
  margin-left: 15px;
  text-shadow: 0 1px rgba(0, 0, 0, 0.4);
}

.prepare-container {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow-y: auto;
}

.prepare-container::-webkit-scrollbar {
  display: none;
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
  padding: 10px;
  border-radius: 20px;
  text-align: center;
}

.guest-greeting p {
  color: #ffffff;
  font-size: 18px;
  font-weight: 800;
  margin: 0;
}

.user-greeting .record {
  margin: 0;
  font-weight: 800;
  color: #ffffff;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.record__value {
  font-size: 24px;
  font-weight: 900;
  background: #34C759;
  color: #ffffff;
  padding: 4px 18px;
  border-radius: 14px;
  box-shadow: 0 3px 0 #248a3d;
}

.settings-block h2 {
  font-size: 22px;
  text-align: center;
  margin: 0 0 16px 0;
  color: #ffffff;
  font-weight: 900;
}

.difficulty-options {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.difficulty-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-radius: 22px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.15s ease, background-color 0.2s ease;
  text-align: left;
  background: #232738;
}

.difficulty-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
}

.difficulty-btn.easy {
  border-color: #34C759;
  box-shadow: 0 5px 0 rgba(52, 199, 89, 0.4);
}
.difficulty-btn.easy .btn-title {
  color: #34C759;
}
.difficulty-btn.easy .btn-desc {
  color: #a0a5b5;
}
.difficulty-btn.easy.active {
  background: #34C759;
  box-shadow: 0 6px 0 #248a3d;
}
.difficulty-btn.easy.active .btn-title,
.difficulty-btn.easy.active .btn-desc {
  color: #ffffff;
}

.difficulty-btn.normal {
  border-color: #007AFF;
  box-shadow: 0 5px 0 rgba(0, 122, 255, 0.4);
}
.difficulty-btn.normal .btn-title {
  color: #007AFF;
}
.difficulty-btn.normal .btn-desc {
  color: #a0a5b5;
}
.difficulty-btn.normal.active {
  background: #007AFF;
  box-shadow: 0 6px 0 #005bb5;
}
.difficulty-btn.normal.active .btn-title,
.difficulty-btn.normal.active .btn-desc {
  color: #ffffff;
}

.difficulty-btn.hard {
  border-color: #FF3B30;
  box-shadow: 0 5px 0 rgba(255, 59, 48, 0.4);
}
.difficulty-btn.hard .btn-title {
  color: #FF3B30;
}
.difficulty-btn.hard .btn-desc {
  color: #a0a5b5;
}
.difficulty-btn.hard.active {
  background: #FF3B30;
  box-shadow: 0 6px 0 #c22820;
}
.difficulty-btn.hard.active .btn-title,
.difficulty-btn.hard.active .btn-desc {
  color: #ffffff;
}

.button-content {
  display: flex;
  flex-direction: column;
}

.btn-title {
  font-size: 21px;
  font-weight: 900;
  transition: color 0.2s ease;
}

.btn-desc {
  font-size: 15px;
  font-weight: 700;
  transition: color 0.2s ease;
}

.difficulty-bars {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 32px;
}

.bar {
  width: 8px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  transition: background-color 0.2s;
}

.bar-1 { height: 14px; }
.bar-2 { height: 22px; }
.bar-3 { height: 32px; }


.difficulty-btn.easy:not(.active) .bar.bar-active {
  background-color: #34C759;
}
.difficulty-btn.normal:not(.active) .bar.bar-active {
  background-color: #007AFF;
}
.difficulty-btn.hard:not(.active) .bar.bar-active {
  background-color: #FF3B30;
}

/* В выбранной активной карточке горят белым */
.difficulty-btn.active .bar.bar-active {
  background-color: #ffffff;
}
.difficulty-btn.active .bar:not(.bar-active) {
  background-color: rgba(255, 255, 255, 0.35);
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
  color: #ffffff;
  margin: 0;
}

.bouncy-loader {
  display: flex;
  gap: 8px;
}

.bouncy-loader span {
  width: 16px;
  height: 16px;
  background: #007AFF;
  border-radius: 50%;
  animation: bounce 0.5s alternate infinite cubic-bezier(0.6, 0.05, 0.15, 0.95);
}

.bouncy-loader span:nth-child(2) { animation-delay: 0.1s; }
.bouncy-loader span:nth-child(3) { animation-delay: 0.2s; }

.bottom-action {
  padding: 20px 20px 28px 20px;
  margin-top: auto;
}

.start-button {
  background: #4F6AF6;
  color: #ffffff;
  border: none;
  border-radius: 54px;
  padding: 16px 22px;
  font-size: 19px;
  font-weight: 900;
  box-shadow: 0 6px 0 #3247c4;
  cursor: pointer;
  transition: all 0.1s;
  width: 100%;
}

.start-button:active:not(:disabled) {
  transform: translateY(6px);
  box-shadow: 0 0 0 #3247c4;
}

.start-button:disabled {
  background: #2a2e42;
  color: #636882;
  cursor: not-allowed;
  box-shadow: 0 5px 0 #1b1d2b;
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

@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-15px); }
}
</style>