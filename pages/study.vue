<template>
  <div class="learn-page">
    <div class="learn-container">
      <div class="page-header">
        <VBackBtnNav @click="handleBack"/>
        <h1 class="page-title">
          {{ selectedCategory ? selectedCategory.title : t('nav.training') }}
        </h1>
      </div>
      <transition name="fade-slide" mode="out-in">
        <div v-if="isMounted && !selectedCategory" key="main" class="learn-grid">
          <div
              v-for="category in learnCategories"
              :key="category.id"
              class="learn-card"
          >
            <NuxtLink v-if="category.url" :to="category.url" class="card-content">
              <div class="card__icon-wrapper">
                <img class="card__icon" :src="category.icon" alt="">
              </div>
              <h2 class="card-title">{{ category.title }}</h2>
              <img class="card__icon-next" src="../assets/images/next.svg" alt="">
            </NuxtLink>
            <button v-else @click="openCategory(category)" class="card-content">
              <span class="card__icon-wrapper">
                <img class="card__icon" :src="Folder" alt="">
              </span>
              <div class="card-title">{{ category.title }}</div>
              <div class="icon__next">
                <img class="card__icon-next" src="../assets/images/next.svg" alt="">
              </div>
            </button>
          </div>
        </div>
        <div v-else-if="isMounted && selectedCategory" key="sub" class="learn-grid">
          <NuxtLink
              v-for="link in selectedCategory.items"
              :key="link.id"
              :to="link.url"
              class="learn-card sub-card"
          >
            <div class="card-content">
              <h3 class="card-title">{{ link.label }}</h3>
              <div class="icon__next">
                <img class="card__icon-next" src="../assets/images/next.svg" alt="">
              </div>
            </div>
          </NuxtLink>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";
import Folder from "../assets/images/fileFolder.svg";
import Photo from "../assets/images/photo-frame.svg";
import Sound from "../assets/images/SoundIcon.svg";
import Thematic from "../assets/images/thematicSticker.svg";
import Cards from "../assets/images/cards.svg";
import Puzzle from "../assets/images/puzzle-piece.svg";

const { t } = useI18n()
const router = useRouter()
const selectedCategory = ref(null)
const isMounted = ref(false)

const learnCategories = computed(() => [
  {
    id: 'articles',
    title: t('sub.articles'),
    items: [
      { id: 'learn-tips', url: '/article-basic', label: t('underSub.prev') },
      { id: 'learn-rules', url: '/article-theory', label: t('underSub.rules') },
      { id: 'learn-selectedTopics', url: '/articles', label: t('underSub.artRules') }
    ]
  },
  {
    id: 'verbs',
    title: t('sub.verbs'),
    items: [
      { id: 'verb-theory', url: '/verbs-theory', label: t('underSub.verbsTheory') },
      { id: 'verb-form', url: '/verb-forms', label: t('underSub.forms') },
      { id: 'tenses', url: '/tenses', label: t('underSub.verbFirst') },
      { id: 'modalVerbs', url: '/modal-verbs', label: t('underSub.verbSecond') },
      { id: 'verb-types', url: '/verb-types', label: t('underSub.verbTypes') }
    ]
  },
  {
    id: 'prepositions',
    title: t('sub.prepositions'),
    items: [
      { id: 'prepositions-theory', url: '/prepositions-theory', label: t('underSub.rules') },
      { id: 'prepositions-practice', url: '/prepositions', label: t('underSub.prepositions') }
    ]
  },
  {
    id: 'adjectives',
    title: t('sub.adjectives'),
    items: [
      { id: 'adjectives-theory', url: '/adjectives-theory', label: t('underSub.adjectiveTheory') },
      { id: 'adjectives-basic', url: '/adjective-basics', label: t('underSub.adjectivesBasic') },
      { id: 'declination', url: '/adjective-declension', label: t('underSub.declination') },
      { id: 'comparison', url: '/adjective-comparison', label: t('underSub.comparison') }
    ]
  },
  { id: 'audio', icon: Sound, url: '/audio-tasks', title: t('sub.audio') },
  { id: 'description', icon: Photo, url: '/image-description', title: t('sub.describePicture') },
  { id: 'themen', icon: Thematic, url: '/thematic-learning', title: t('sub.themen') },
  { id: 'cards', icon: Cards, url: '/create-cards', title: t('sub.card') },
  { id: 'idioms', icon: Puzzle, url: '/idioms', title: t('sub.idioms') }
])

const openCategory = (category) => {
  window.history.pushState({ isSubCategory: true }, '')
  selectedCategory.value = category
}

const handleBack = () => {
  window.history.back()
}

const handlePopState = () => {
  if (selectedCategory.value) {
    selectedCategory.value = null
  } else {
    router.push('/')
  }
}

onMounted(() => {
  isMounted.value = true
  window.history.pushState({ isLearnRoot: true }, '')
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})

definePageMeta({
  layout: 'footerlayout'
})
</script>

<style scoped>
.learn-page {
  font-family: "Nunito", sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.learn-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.card__icon {
  width: 40px;
  height: 40px;
}

.card__icon-wrapper {
  margin-right: 15px;
}

.card__icon-next {
  width: 18px;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  flex-shrink: 0;
  z-index: 10;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--titleColor);
  margin: 0 0 0 10px;
  text-shadow: 0 1px var(--titleColor);
}

.learn-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 15px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: calc(105px + var(--sab));
  -webkit-overflow-scrolling: touch;
}

.learn-card {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
  flex-shrink: 0;
  border-radius: 20px;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 15px;
  height: 100%;
  width: 100%;
  background: none;
  border: none;
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  flex: 1;
  margin: 0;
  color: var(--titleColor);
  text-align: start;
}

.sub-card .card-title {
  font-size: 18px;
  font-weight: 600;
}

.sub-card {
  padding: 8px 0;
}

.chevron {
  color: #C7C7CC;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>