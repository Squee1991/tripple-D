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
        <div v-if="isMounted && !selectedCategory" key="main" class="scrollable-view">
          <div class="banner-wrapper">
            <VBanner
                text="Учите немецкий язык любым удобным способом!"
                :icon="LearnIcon"
            />
          </div>
          <div class="topics-list-container">
            <template v-for="category in learnCategories" :key="category.id">
              <NuxtLink v-if="category.url" :to="category.url" class="topic-list-item">
                <div class="topic-item-content">
                  <div class="topic-icon-box">
                    <img class="topic-img-icon" :src="category.icon" alt="">
                  </div>
                  <span class="topic-label">{{ category.title }}</span>
                </div>
                <div class="topic-arrow">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </NuxtLink>

              <button v-else @click="openCategory(category)" class="topic-list-item">
                <div class="topic-item-content">
                  <div class="topic-icon-box">
                    <img class="topic-img-icon" :src="Folder" alt="">
                  </div>
                  <span class="topic-label">{{ category.title }}</span>
                </div>
                <div class="topic-arrow">
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>
            </template>
          </div>
        </div>
        <div v-else-if="isMounted && selectedCategory" key="sub" class="scrollable-view">
          <div class="topics-list-container">
            <NuxtLink
                v-for="link in selectedCategory.items"
                :key="link.id"
                :to="link.url"
                class="topic-list-item sub-card"
            >
              <div class="topic-item-content">
                <span class="topic-label">{{ link.label }}</span>
              </div>
              <div class="topic-arrow">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </NuxtLink>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";
import VBanner from "~/src/components/V-banner.vue";
import Folder from "../assets/images/fileFolder.svg";
import Photo from "../assets/images/photo-frame.svg";
import Sound from "../assets/images/headphones.svg";
import Thematic from "../assets/images/thematicSticker.svg";
import Cards from "../assets/images/cards.svg";
import Puzzle from "../assets/images/puzzle-piece.svg";
import Exam from "../assets/images/exam-results.svg";
import LearnIcon from "../assets/images/app-nav-icons/study.svg";
const { t } = useI18n()
const router = useRouter()
const selectedCategory = ref(null)
const isMounted = ref(false)

const learnCategories = computed(() => [
  { id: 'audio', icon: Sound, url: '/audio-tasks', title: t('sub.audio') },
  { id: 'description', icon: Photo, url: '/image-description', title: t('sub.describePicture') },
  { id: 'themen', icon: Thematic, url: '/thematic-learning', title: t('sub.themen') },
  { id: 'exams', icon: Exam, url: '/exams', title: t('nav.tests') },
  { id: 'cards', icon: Cards, url: '/create-cards', title: t('sub.card') },
  { id: 'idioms', icon: Puzzle, url: '/idioms', title: t('sub.idioms') },
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
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  transition: transform 0.1s, box-shadow 0.1s;
  text-decoration: none;
  width: 100%;
  box-sizing: border-box;
}

button.topic-list-item {
  text-align: left;
  font-family: inherit;
  outline: none;
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
}

.sub-card .topic-label {
  font-size: 18px;
  font-weight: 700;
}

.topic-arrow {
  background-color: #3b82f6;
  color: #ffffff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 0px #2563eb;
  flex-shrink: 0;
  margin-left: 10px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
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