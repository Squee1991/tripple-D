<template>
  <div class="game-page">
    <div class="game-container">
      <div class="page-header">
        <VBackBtnNav/>
        <h1 class="page-title">{{ t('nav.gameMode') }}</h1>
      </div>
      <VTransition>
        <div class="scrollable-view" v-if="isMounted">
          <div class="banner-wrapper">
            <VBanner
                :text="t('bannerTitles.play')"
                :icon="Game"
            />
          </div>
          <div class="topics-list-container">
            <template v-for="game in gameModes" :key="game.id">
              <NuxtLink
                  v-if="game.url"
                  :to="game.url"
                  class="topic-list-item"
              >
                <div class="topic-item-content">
                  <div class="topic-icon-box">
                    <img class="topic-img-icon" :src="game.icon" :alt="game.alt">
                  </div>
                  <div class="topic-label">{{ game.title }}</div>
                </div>
                <VArrowNav/>
              </NuxtLink>
            </template>
          </div>
        </div>
      </VTransition>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, onMounted} from 'vue'
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";
import VBanner from "~/src/components/V-banner.vue";
import DuelIcon from '../assets/images/chat-balloon.svg'
import Diary from '../assets/images/Diary.svg'
import GuessWords from '../assets/images/guessWord.svg'
import Marathon from '../assets/images/dailyIcons/timer.svg'
import Galaxy from '../assets/images/Galaxy.svg'
import Game from '../assets/images/app-nav-icons/game.svg'
import VArrowNav from "~/src/components/V-arrowNav.vue";
import VTransition from "~/src/components/V-transition.vue";
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
  setTimeout(() => {
    isMounted.value = true
  }, 100)
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

.page-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  background: var(--bg);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  flex-shrink: 0;
  z-index: 10;
}

.page-title {
  font-size: 23px;
  font-weight: 800;
  color: var(--title);
  letter-spacing: 1px;
  margin: 0 0 0 15px;
  text-shadow: 0 1px var(--title);
}

.scrollable-view {
  flex: 1;
  overflow-y: auto;
  padding: 10px 16px 110px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.scrollable-view::-webkit-scrollbar {
  display: none;
}

.banner-wrapper {
  margin-bottom: 20px;
}

.topics-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topic-list-item {
  background: var(--menuItemsBg);
  border-radius: 20px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  transition: transform 0.1s, box-shadow 0.1s;
  text-decoration: none;
  width: 100%;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.topic-list-item:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 var(--tabsSlideBorderColor);
}

.topic-item-content {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.topic-icon-box {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.topic-img-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.topic-label {
  color: var(--titleColor);
  font-size: 17px;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
  line-height: 1.2;
  margin: 0;
  text-align: left;
}

@media (max-width: 400px) {
  .topic-label {
    font-size: 15px;
  }
  .topic-icon-box {
    width: 32px;
    height: 32px;
  }
}
</style>