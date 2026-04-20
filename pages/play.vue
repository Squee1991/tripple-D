<template>
  <div class="game-page">
    <div class="game-container">
      <div class="page-header">
        <VBackBtnNav/>
        <h1 class="page-title">{{ t('nav.gameMode') }}</h1>
      </div>
      <transition name="menu-appear">
        <div class="game-grid" v-if="isMounted">
          <div
              v-for="game in gameModes"
              :key="game.id"
              class="game-card"
          >
            <NuxtLink
                v-if="game.url"
                :to="game.url"
                class="card-content"
            >
              <h2 class="card-title">{{ game.title }}</h2>
              <div class="card__icon-wrapper">
                <img class="card__icon-item" :src="game.icon" :alt="game.alt">
              </div>
            </NuxtLink>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";
import DuelIcon from '../assets/images/chat-balloon.svg'
import Diary from '../assets/images/Diary.svg'
import GuessWords from '../assets/images/guessWord.svg'
import Marathon from '../assets/images/dailyIcons/timer.svg'
import Galaxy from '../assets/images/Galaxy.svg'
const isMounted = ref(false)


definePageMeta({
  layout: 'footerlayout'
})



const {t} = useI18n()
const gameModes = computed(() => [
  {id: 'fight', url: '/german-universe', icon: Galaxy, alt: 'Galaxy', title: t('sub.fight')},
  {id: 'wordDuel', url: '/sentence-duel', icon: DuelIcon, alt: 'DuelIcon', title: t('sub.wordDuel')},
  {id: 'quests', url: '/recipes', icon: Diary, alt: 'Diary', title: t('sub.quests')},
  {id: 'duel-guess', url: '/guess-word', icon: GuessWords, alt: 'GuessWords', title: t('sub.guess')},
  {id: 'articlemarathon', url: '/article-marathon', icon: Marathon, alt: 'Marathon', title: t('sub.marathon')}
])

onMounted(() => {
  isMounted.value = true
})

</script>

<style scoped>
.game-page {
  font-family: "Nunito", sans-serif;
  background: var(--bg);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.game-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.card__icon-item {
  width: 45px;
  height: 45px;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 10px 10px;
  background: var(--bg);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  flex-shrink: 0;
  z-index: 10;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--titleColor);
  letter-spacing: 1px;
  margin: 0 0 0 15px;
}

.game-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 110px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.game-grid::-webkit-scrollbar {
  display: none;
}

.game-card {
  background: #2c323d;
  border-radius: 12px;
  padding: 5px 15px;
  border: 2px solid #363d4a;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.is-dev .card-title {
  color: #888;
}


.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #FFFFFF;
}

.menu-appear-enter-active {
  transition: all 0.4s ease-out;
}

.menu-appear-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

</style>