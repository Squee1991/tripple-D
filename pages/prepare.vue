<script setup>
import {ref, onMounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useGameStore} from '../store/marafonStore.js';
import {userAuthStore} from '../store/authStore.js';

const {t} = useI18n()
const gameStore = useGameStore();
const authStore = userAuthStore();
const router = useRouter();
const selectedDifficulty = ref(1);
const currentRecord = computed(() => {
  if (gameStore.personalBests) {
    return gameStore.personalBests[selectedDifficulty.value] || 0;
  }
  return 0;
});

onMounted( () => {
  if (!gameStore.loadWords && typeof gameStore.loadWords !== 'function') return
  gameStore.loadWords();
  gameStore.fetchRecord();
});

function startGame() {
  if (!authStore.uid) return;
  gameStore.selectGameSettings(selectedDifficulty.value);
  router.push('/MarathonGame');
}

function goBack() {
  router.push('/');
}

</script>

<template>
  <div class="page-wrapper">
    <button class="back-button" @click="goBack" aria-label="Назад">
      ←
    </button>
    <div class="prepare-container">
      <div class="header">
        <h1>{{ t('marathonPrepare.title') }}</h1>
        <p class="subtitle">{{ t('marathonPrepare.subtitle') }}</p>
      </div>
      <div v-if="authStore.uid" class="user-greeting">
        <p>{{ t('marathonPrepare.greetings') }}, <strong>{{ authStore.name }}</strong>!</p>
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
          <button @click="selectedDifficulty = 1"
                  :class="['difficulty-btn easy', { active: selectedDifficulty === 1 }]">
            <div class="button-content">
              <span>{{ t('marathonPrepare.difficultEasy') }}</span>
              <span>{{ t('marathonPrepare.difficultDescriptionEasy') }}</span>
            </div>
            <span class="icon">🕊️</span>
          </button>
          <button @click="selectedDifficulty = 2"
                  :class="['difficulty-btn normal', { active: selectedDifficulty === 2 }]">
            <div class="button-content">
              <span>{{ t('marathonPrepare.difficultNormal') }}</span>
              <span>{{ t('marathonPrepare.difficultDescriptionNormal') }}</span>
            </div>
            <span class="icon">⏱️</span>
          </button>
          <button @click="selectedDifficulty = 3"
                  :class="['difficulty-btn hard', { active: selectedDifficulty === 3 }]">
            <div class="button-content">
              <span>{{ t('marathonPrepare.difficultHard') }}</span>
              <span>{{ t('marathonPrepare.difficultDescriptionHard') }}</span>
            </div>
            <span class="icon">🔥</span>
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
  background-color: #fef8e4;
  font-family: 'Inter', sans-serif;
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
  border: 3px solid #1e1e1e;
  border-radius: 50%;
  box-shadow: 4px 4px 0 #1e1e1e;
  font-family: "Nunito", sans-serif;
  font-size: 2.5rem;
  color: #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.back-button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e;
}

.back-button:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #1e1e1e;
}

.prepare-container {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0 #1e1e1e;
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.5s ease-out;
}

.header {
  text-align: center;
}

.header h1 {
  font-family: "Nunito", sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  color: #1e1e1e;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 1.1rem;
  color: #555;
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
  color: #555;
}

.user-greeting strong {
  color: #f97028;
}

.user-greeting .record {
  margin-top: 0.75rem;
  font-weight: 700;
  color: #1e1e1e;
  font-size: 16px;
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
  margin-bottom: 1rem;
  color: #1e1e1e;
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

.difficulty-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e;
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
  padding: 1rem 2.5rem;
  font-size: 1.5rem;
  font-weight: 400;
  border-radius: 16px;
  cursor: pointer;
  border: 3px solid #1e1e1e;
  transition: all 0.1s ease-in-out;
  background-color: #4ade80;
  color: #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
  margin-top: 1rem;
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

@media (max-width: 640px) {
  .back-button {
    top: 1rem;
    left: 1rem;
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }

  .prepare-container {
    padding: 1.5rem;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>