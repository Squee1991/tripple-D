<template>
  <div class="learn-page">
    <div class="learn-container">
      <div class="page-header">
        <VBackBtnNav @click="handleBack"/>
        <h1 class="page-title">
          {{ selectedCategory ? selectedCategory.title : t('nav.training') }}
        </h1>
      </div>
      <VTransition>
        <div v-if="isMounted && !selectedCategory" key="main" class="scrollable-view">
          <div class="banner-wrapper">
            <VBanner
                :text="bannerTitleComputed"
                :icon="LearnIcon"
            />
          </div>
          <nav class="mobile-nav" role="tablist">
            <div class="sliding-bg" :style="{ transform: `translateX(${activeIndex * 100}%)` }"></div>
            <button
                v-for="(tab, index) in learnTabs"
                :key="tab.id"
                class="mobile-nav__btn"
                :class="{ 'mobile-nav__btn--active': activeTabId === tab.id }"
                role="tab"
                @click="setTab(tab.id)"
            >
              <img :src="tab.icon" alt="" class="tab-icon" />
              <span class="tab-label">{{ tab.label }}</span>
            </button>
          </nav>
          <VTransition>
            <div v-if="activeTabId === 'practice'" key="practice" class="topics-list-container">
              <template v-for="category in practiceCategories" :key="category.id">
                <NuxtLink v-if="category.url" :to="category.url" class="topic-list-item">
                  <div class="topic-item-content">
                    <div class="topic-icon-box">
                      <img class="topic-img-icon" :src="category.icon" alt="">
                    </div>
                    <span class="topic-label">{{ category.title }}</span>
                  </div>
                  <VArrowNav/>
                </NuxtLink>
              </template>
            </div>
            <div v-else-if="activeTabId === 'grammar'" key="grammar" class="topics-list-container">
              <template v-for="category in grammarCategories" :key="category.id">
                <NuxtLink v-if="category.url" :to="category.url" class="topic-list-item">
                  <div class="topic-item-content">
                    <div class="topic-icon-box">
                      <img class="topic-img-icon" :src="category.icon" alt="">
                    </div>
                    <span class="topic-label">{{ category.title }}</span>
                  </div>
                  <VArrowNav/>
                </NuxtLink>
                <button v-else @click="openCategory(category)" class="topic-list-item">
                  <div class="topic-item-content">
                    <div class="topic-icon-box">
                      <img class="topic-img-icon" :src="Folder" alt="">
                    </div>
                    <span class="topic-label">{{ category.title }}</span>
                  </div>
                  <VArrowNav/>
                </button>
              </template>
            </div>
          </VTransition>
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
              <VArrowNav/>
            </NuxtLink>
          </div>
        </div>
      </VTransition>
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
import VArrowNav from "~/src/components/V-arrowNav.vue";
import VTransition from "~/src/components/V-transition.vue";
import BannerIcon from '../assets/images/articleBannerIcon.svg'
import PracticeIcon from '../assets/images/practiceIcon.svg'
import GrammarIcon from '../assets/images/GrammarIcon.svg'
import TextBook from '../assets/images/TextBook.svg'
import SpeakingIcon from '../assets/images/speakingIcon.svg'

const { t } = useI18n()
const router = useRouter()
const selectedCategory = ref(null)
const isMounted = ref(false)


const learnTabs = [
  { id: 'practice', label: t('studyNavAndBanner.practice'), icon: PracticeIcon },
  { id: 'grammar', label: t('studyNavAndBanner.grammar'), icon: GrammarIcon },
]
const STUDY_STATE_TOGGLE = 'study_toggle_state'
const activeTabId = ref((typeof window !== 'undefined' && sessionStorage.getItem(STUDY_STATE_TOGGLE)) || learnTabs[0].id)
const activeIndex = computed(() => learnTabs.findIndex(tab => tab.id === activeTabId.value))


const bannerTitleComputed = computed(() => {
  return activeTabId.value === 'grammar' ? t('studyNavAndBanner.bannerGrammar') : t('studyNavAndBanner.bannerPractice')
})

function setTab(id) {
  activeTabId.value = id
  sessionStorage.setItem(STUDY_STATE_TOGGLE, id)
}

const practiceCategories = computed(() => [
  { id: 'words', icon: BannerIcon, url: '/articles', title: t('sub.words') },
  { id: 'words', icon: SpeakingIcon, url: '/speak-practice', title: t('sub.speak') },
  { id: 'audio', icon: Sound, url: '/audio-tasks', title: t('sub.audio') },
  { id: 'text', icon: TextBook, url: '/text-tasks', title: t('sub.textTask') },
  { id: 'description', icon: Photo, url: '/image-description', title: t('sub.describePicture') },
  { id: 'themen', icon: Thematic, url: '/thematic-learning', title: t('sub.themen') },
  { id: 'exams', icon: Exam, url: '/exams', title: t('nav.tests') },
])

const grammarCategories = computed(() => [
  {
    id: 'articles',
    title: t('sub.articles'),
    items: [
      { id: 'learn-tips', url: '/article-basic', label: t('underSub.prev') },
      { id: 'learn-rules', url: '/article-theory', label: t('underSub.rules') },
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
  { id: 'idioms', icon: Puzzle, url: '/idioms', title: t('sub.idioms') },
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
  setTimeout(() => {
    isMounted.value = true
  }, 100)
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
  font-size: 23px;
  font-weight: 700;
  color: var(--title);
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

.mobile-nav {
  display: flex;
  position: relative;
  justify-content: space-between;
  background: var(--tabBg, var(--menuItemsBg));
  border-radius: 40px;
  padding: 6px;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile, 0 4px 0 var(--tabsSlideBorderColor));
  margin: 0 0 20px 0;
  z-index: 1;
  flex-shrink: 0;
}

.sliding-bg {
  position: absolute;
  top: 5px;
  bottom: 6px;
  left: 6px;
  width: calc(50% - 6px);
  background: var(--tabsSlideBg);
  box-shadow: var(--tabSlideBoxShadow, 0 2px 0 rgba(0,0,0,0.1));
  border-radius: 30px;
  transition: transform 0.4s cubic-bezier(0.34, 1.35, 0.64, 1);
  z-index: 1;
}

.mobile-nav__btn {
  border: none;
  background: none;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  position: relative;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;
}

.tab-icon {
  width: 33px;
  height: 33px;
  object-fit: contain;
  transition: transform 0.2s;
}

.tab-label {
  font-size: 15px;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
  color: var(--titleColor);
  transition: transform 0.2s;
}

.topics-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topic-list-item {
  border-radius: 20px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
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

@media (max-width: 400px) {
  .topic-label {
    font-size: 15px;
  }
  .topic-icon-box {
    width: 32px;
    height: 32px;
  }
  .tab-label {
    font-size: 14px;
  }
}
</style>