<script setup>
import {ref, onMounted, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useGameStore} from '../store/marafonStore.js'
import {userAuthStore} from '../store/authStore.js'
import {useI18n} from 'vue-i18n'

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

function goBack() {
  router.push('/')
}

const difficultyBase = ref([
  {
    value: 1,
    base: 'easy',
    icon: '🕊️',
    titleKey: 'marathonPrepare.difficultEasy',
    descKey: 'marathonPrepare.difficultDescriptionEasy'
  },
  {
    value: 2,
    base: 'normal',
    icon: '⏱️',
    titleKey: 'marathonPrepare.difficultNormal',
    descKey: 'marathonPrepare.difficultDescriptionNormal'
  },
  {
    value: 3,
    base: 'hard',
    icon: '🔥',
    titleKey: 'marathonPrepare.difficultHard',
    descKey: 'marathonPrepare.difficultDescriptionHard'
  }
])

const difficultyClasses = computed(() =>
    difficultyBase.value.reduce((map, o) => {
      map[o.value] = `difficulty-btn ${o.base}${selectedDifficulty.value === o.value ? ' active' : ''}`
      return map
    }, {})
)
</script>

<template>
  <div class="page-wrapper">
    <button class="back-button" @click="goBack" aria-label="Назад">←</button>
    <div class="prepare-container">
      <div class="header">
        <h1>{{ t('marathonPrepare.title') }}</h1>
        <p class="subtitle">{{ t('marathonPrepare.subtitle') }}</p>
      </div>

      <div v-if="authStore.uid" class="user-greeting">
        <p>{{ t('marathonPrepare.greetings') }}, <strong>{{ authStore.name }}</strong></p>
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
              :class="difficultyClasses[opt.value]"
          >
            <div class="button-content">
              <span>{{ t(opt.titleKey) }}</span>
              <span>{{ t(opt.descKey) }}</span>
            </div>
            <span class="icon">{{ opt.icon }}</span>
          </button>
        </div>
      </div>
      <div v-else class="loading">
        <p>{{ t('marathonPrepare.loading') }}</p>
      </div>

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

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  font-family: "Nunito", sans-serif;
  position: relative;
}

.back-button {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
  width: 60px;
  height: 60px;
  background-color: #fff;
  border: 2px solid #1e1e1e;
  border-radius: 50%;
  box-shadow: 2px 2px 0 #1e1e1e;
  font-family: "Nunito", sans-serif;
  font-size: 2.5rem;
  color: #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.back-button:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #1e1e1e;
}

.prepare-container {
  width: 100%;
  max-width: 600px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  border-radius: 24px;
  padding: 0 1.4rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  animation: fadeIn 0.5s ease-out;
}

.header {
  text-align: center;
}

.header h1 {
  font-family: "Nunito", sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--titleColor);
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 1.1rem;
  color: #868383;
  margin: 0;
}

.user-greeting, .guest-greeting {
  font-size: 1.2rem;
  font-weight: 500;
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 16px;
  border: 2px solid #e5e7eb;
  text-align: center;
}

.user-greeting p, .guest-greeting p {
  margin: 0;
}

.guest-greeting p {
  color: var(--titleColor);
}

.user-greeting strong {
  color: #f97028;
}

.user-greeting .record {
  margin-top: 0.75rem;
  font-weight: 700;
  color: #1e1e1e;
  font-size: 15px;
}

.record__value {
  font-size: 24px;
}

.user-greeting .record span {
  display: inline-block;
  background: #fca13a;
  color: #1e1e1e;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  margin-left: 0.5rem;
  border: 2px solid #1e1e1e;
}

.settings-block h2 {
  font-family: "Nunito", sans-serif;
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 10px;
  color: var(--titleColor);
}

.difficulty-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.difficulty-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: left;
  color: #ffffff;
}

@media (min-width: 1024px) {
  .back-button:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
  }
  .difficulty-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
  }
}

.difficulty-btn.active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #1e1e1e;
  filter: brightness(1.1);
}

.difficulty-btn.easy {
  background-color: #60a5fa;
}

.difficulty-btn.normal {
  background-color: #fca13a;
}

.difficulty-btn.hard {
  background-color: #f87171;
}

.button-content {
  display: flex;
  flex-direction: column;
}

.button-content span:first-child {
  font-family: "Nunito", sans-serif;
  font-size: 1.3rem;
  font-weight: 400;
}

.button-content span:last-child {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
  margin-top: 0.25rem;
}

.icon {
  font-size: 2rem;
}

.start-button {
  font-family: "Nunito", sans-serif;
  padding: 0.8rem 2.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  border-radius: 16px;
  cursor: pointer;
  border: 2px solid #1e1e1e;
  transition: all 0.1s ease-in-out;
  background-color: #4ade80;
  color: #1e1e1e;
  box-shadow: 3px 3px 0px #1e1e1e;
  margin-top: 5px;
}

.start-button:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.start-button:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #1e1e1e;
}

.start-button:disabled {
  background: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  box-shadow: 4px 4px 0 #9ca3af;
}

.loading p {
  font-size: 1.2rem;
  font-weight: 700;
  color: #555;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 767px) {
  .difficulty-btn {
    padding: 6px 14px;
  }

  .subtitle {
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .back-button {
    top: 10px;
    left: 10px;
    width: 40px;
    height: 40px;
    font-size: 2rem;
    border-radius: 10px;
  }

  .prepare-container {
    height: 100vh;
    border-radius: 0;
    border: 0;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .page-wrapper {
    padding: 0;
  }
}
</style>
