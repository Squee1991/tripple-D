<template>
  <div class="theme-page">
    <Transition name="fade">
      <VLoginPreloader v-if="isLoading"/>
    </Transition>
    <div class="theme-page-container">
      <div class="theme__title-wrapper">
        <div class="theme__header">
          <button @click="goBack" class="btn-icon-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div class="theme__title">{{ t('modes.themeTitle') }}</div>
        </div>
      </div>
      <transition name="page-fade" appear>
        <div v-if="isPageLoaded" class="theme-content-area">
          <div class="grid-area-wrapper">
            <div class="theme__grid-container">
              <div class="banner-wrapper">
                <VBanner
                    text="Изучение слов и Артиклей по различным темам и способам"
                    :icon="BannerIcon"
                />
              </div>
              <div class="topics-list-container">
                <div
                    v-for="(key, index) in topicKeys"
                    :key="key"
                    class="topic-list-item"
                    :class="{ active: selectedTopic === key }"
                    @click="selectTopic(key)"
                >
                  <div class="topic-main-row">
                    <div class="topic-item-content">
                      <div class="topic-icon-box">
                        <img class="theme__cards-icon-item"
                             :src="`/images/article-themes-images/${iconMap[key] || 'default.svg'}`" :alt="key"/>
                      </div>
                      <span class="topic-label">{{ t(nameMap[key]) }}</span>
                    </div>
                    <VArrowNav/>
                  </div>
                  <div class="topic-progress-wrapper">
                    <div class="progress-bar-container">
                      <div
                          class="progress-bar-fill"
                          :style="{
                          width: `${themeProgress[key]?.total ? (themeProgress[key].learned / themeProgress[key].total) * 100 : 0}%`,
                          backgroundColor: getTopicColor(index)
                        }"
                      ></div>
                    </div>
                    <div class="progress-text">
                      {{ themeProgress[key]?.learned || 0 }}/{{ themeProgress[key]?.total || 0 }}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <Transition name="slide-right" appear>
        <div v-if="showModesBlock" class="learning-modes-block">
          <div class="learning__modes-wrapper">
            <div class="modes-header-container">
              <button @click="clearSelectedTopic" class="close-modes-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="grey"
                        d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275L12 10.6l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275-.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275z"></path>
                </svg>
              </button>
              <div class="modes-title-box">
                <div class="modes-title">{{ t('selectedpage.choiceTitle') }}</div>
                <div class="topic-hint">{{ t('selectedpage.topic') }}: {{ t(nameMap[selectedTopic]) }}</div>
              </div>
            </div>
            <div class="modes-list">
              <label
                  v-for="mode in availableModes"
                  :key="mode.key"
                  class="checkbox-container"
                  :class="{ 'active-mode': selectedModes.includes(mode.key) }"
              >
                <input type="checkbox" v-model="selectedModes" :value="mode.key"/>
                <span class="checkmark">
                  <svg viewBox="0 0 24 24"><polyline points="3 12 10 20 21 4"/></svg>
                </span>
                <span class="label-text">{{ t(mode.label) }}</span>
              </label>
            </div>
            <button class="start-btn" :disabled="!selectedModes.length || isLoading" @click="startLearning">
              {{ t('selectedpage.startBtn') }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, nextTick} from 'vue'
import {useRouter} from 'vue-router'
import {userlangStore} from '../../store/learningStore.js'
import Lottie from 'lottie-web'
import {nameMap} from '../../utils/nameMap.js'
import {useSeoMeta} from '#imports'
import NotFound from '../../assets/animation/notFound.json'
import VLoginPreloader from "../../src/components/V-loginPreloader.vue";
import VBanner from "~/src/components/V-banner.vue";
import BannerIcon from '../../assets/images/articleBannerIcon.svg'
import VArrowNav from "~/src/components/V-arrowNav.vue";

const iconMap = {
  Furniture: 'chair.svg',
  Animals: 'animals.svg',
  Clothes: 'hemd.svg',
  Food: 'meal.svg',
  Body: 'body.svg',
  Professions: 'profession.svg',
  Transport: 'transport.svg',
  Colors: 'colors.svg',
  Nature: 'nature.svg',
  Home: 'home.svg',
  Zeit: 'time.svg',
  City: 'city.svg',
  School: 'school.svg',
  DaysAndMonths: 'calendar.svg',
  Toys: 'toys.svg',
  CommonItems: 'Informatik.svg',
  BathroomItems: 'bath-room.svg',
  Kosmetik: 'makeup.svg',
  Familie: 'family.svg',
  Emotions: 'emotions.svg',
  Werkzeuge: 'instruments.svg',
  Kitchen: 'kitchen.svg',
  Health: 'health.svg',
  Sport: 'sport.svg',
  SportEquipment: 'fitness.svg',
  Travel: 'travel.svg',
  Musik: 'Music.svg',
  Amount: 'Amount.svg',
  Informatik: 'Informatik.svg'
}

const topicColors = ['#FFEB7F', '#9DFFBB', '#FFAFF3', '#88B5FF', '#FF9F7F', '#AFAFFF', '#7FFFDF', '#FFD1AF']
const getTopicColor = (index) => topicColors[index % topicColors.length]

const bannerText = [
  'Изучение слов и Артиклей'
]

const {t} = useI18n()
const showModesBlock = ref(false)
const showNoTopicMessage = ref(true)
const router = useRouter()
const store = userlangStore()
const themeList = ref({})
const selectedTopic = ref(null)
const selectedModes = ref([])
const animationContainer = ref(null)
const localePath = useLocalePath()
const isLoading = ref(false)
const isPageLoaded = ref(false)

useSeoMeta({
  robots: 'noindex, nofollow'
})

const clearSelectedTopic = () => {
  showModesBlock.value = false
  setTimeout(() => {
    selectedTopic.value = null
    selectedModes.value = []
    showNoTopicMessage.value = false
  }, 250)
}

const topicKeys = computed(() => Object.keys(nameMap))

const baseModes = [
  {key: 'wordTranslate', label: 'modes.wordTranslate'},
  {key: 'article', label: 'modes.article'},
  {key: 'letters', label: 'modes.letters'},
  {key: 'wordArticle', label: 'modes.articleWord'},
  {key: 'plural', label: 'modes.plural'},
  {key: 'audio', label: 'modes.audio'}
]

const topicWords = computed(() => {
  const key = selectedTopic.value
  if (!key) return []
  return Array.isArray(themeList.value[key]) ? themeList.value[key] : []
})

function hasAnyPlural(wordsArray) {
  const list = Array.isArray(wordsArray) ? wordsArray : []
  return list.some(w => w.plural && String(w.plural).trim() !== '')
}

const hasPluralForCurrentTopic = computed(() => hasAnyPlural(topicWords.value))

const availableModes = computed(() => {
  return hasPluralForCurrentTopic.value
      ? baseModes
      : baseModes.filter(m => m.key !== 'plural')
})

const themeProgress = computed(() => {
  return Object.fromEntries(
      Object.entries(themeList.value).map(([key, words]) => {
        const total = words.length
        const hasPlural = hasAnyPlural(words)
        const modesToCheck = baseModes
            .filter(m => hasPlural || m.key !== 'plural')
            .map(m => m.key)
        const learned = words.filter(word => {
          const globalWord = store.words.find(w => w.de === word.de && w.topic === key)
          if (!globalWord || !globalWord.progress) return false
          return modesToCheck.every(mode => globalWord.progress[mode] === true)
        }).length

        return [key, {learned, total}]
      })
  )
})

const selectTopic = (key) => {
  selectedTopic.value = key
  selectedModes.value = []
  showModesBlock.value = true
}

const startLearning = async () => {
  if (!selectedModes.value.length || isLoading.value) return
  isLoading.value = true
  try {
    const sortedSelectedModes = baseModes
        .filter(m => selectedModes.value.includes(m.key))
        .map(m => m.key)

    const topicWordsLocal = (themeList.value[selectedTopic.value] || [])
        .filter(word => {
          const globalWord = store.words.find(
              w => w.de === word.de && w.topic === selectedTopic.value
          )
          return sortedSelectedModes.some(mode => !(globalWord?.progress?.[mode] === true))
        })
        .map(w => ({...w, topic: selectedTopic.value}))

    await store.addWordsToGlobal(topicWordsLocal)
    await store.setSelectedWords(topicWordsLocal)
    await store.setSelectedTopics([selectedTopic.value])
    await store.saveToFirebase()

    await nextTick()
    const path = localePath({
      path: '/articles/articles-session',
      query: {topic: selectedTopic.value, mode: sortedSelectedModes}
    })
    await router.push(path)
  } catch (e) {
    console.error(e)
    isLoading.value = false
  }
}

function goBack() {
  router.push('/')
}

onMounted(async () => {
  const res = await fetch('/words.json')
  themeList.value = await res.json()
  isPageLoaded.value = true
})

onMounted(() => {
  if (animationContainer.value) {
    Lottie.loadAnimation({
      container: animationContainer.value,
      loop: false,
      animationData: NotFound
    })
  }
})
</script>

<style scoped>
.theme-page {
  font-family: "Nunito", sans-serif;
  height: 100%;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.theme-page-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.theme__header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 10px 10px 10px;
  margin-bottom: 5px;
  border-radius: 10px;
}

.btn-icon-back {
  background: #f5f5f6;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 14px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  flex-shrink: 0;
  padding: 0;
}

.btn-icon-back:active {
  transform: translate(2px, 3px);
  box-shadow: 0px 0px 0px #1e272e;
}

.theme__title {
  flex: 1;
  display: flex;
  font-size: 24px;
  font-weight: 600;
  color: var(--titleColor);
  margin-left: 15px;
  font-family: "Nunito", sans-serif;
}

.theme__title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.theme-content-area {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  gap: 0;
}

.grid-area-wrapper {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  width: 100%;
}

.theme__grid-container {
  flex-grow: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.theme__grid-container::-webkit-scrollbar {
  display: none;
}

.banner-wrapper {
  margin-bottom: 20px;
}


.topics-list-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-bottom: 40px;
}

.topic-list-item {
  border-radius: 20px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  transition: transform 0.1s, border-bottom-width 0.1s;
}

.topic-list-item:active {
  transform: translateY(4px);
  border-bottom-width: 2px;
}

.topic-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.topic-item-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.topic-icon-box {
  font-size: 32px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme__cards-icon-item {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.15));
}

.topic-label {
  color: var(--titleColor);
  font-size: 17px;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
}

.topic-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  width: 100%;
}

.progress-bar-container {
  flex: 1;
  height: 8px;
  background-color: #1e272e;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease-out;
}

.progress-text {
  color: var(--titleColor);
  font-size: 14px;
  font-weight: 900;
  min-width: 36px;
  text-align: right;
  font-family: "Nunito", sans-serif;
}

.learning-modes-block {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: var(--bg);
  z-index: 2000;
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
}

.learning__modes-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.modes-header-container {
  display: flex;
  align-items: center;
  padding-top: 5px;
  margin-bottom: 15px;
}

.close-modes-btn {
  background: #e0e0e0;
  border: 3px solid #af9e9e;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #737070;
  font-size: 1.5rem;
  transition: background-color 0.1s ease;
  flex-shrink: 0;
}

.close-modes-btn:active {
  background: #e74c3c;
  color: white;
}

.modes-title-box {
  flex-grow: 1;
  text-align: left;
  margin-left: 15px;
  padding-top: 10px;
}

.modes-title {
  display: flex;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--titleColor);
}

.topic-hint {
  color: #726b6b;
  font-family: Nunito, sans-serif;
  font-style: italic;
  font-weight: 500;
  margin-top: 2px;
  text-align: center;
}

.modes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding: 14px;
  border-radius: 16px;
  background: #ffffff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  transition: transform 0.1s ease;
}

.checkbox-container:active {
  transform: scale(0.98);
}

.checkbox-container.active-mode {
  background-color: #f1c40f;
}

.checkbox-container input {
  display: none;
}

.checkmark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 3px solid #af9e9e;
  background: #fff;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s;
}

.checkmark svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.checkmark polyline {
  stroke: #1e1e1e;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  stroke-dasharray: 28;
  stroke-dashoffset: 28;
  transition: stroke-dashoffset 0.3s ease;
}

.checkbox-container input:checked + .checkmark polyline {
  stroke-dashoffset: 0;
}

.checkbox-container input:checked + .checkmark svg {
  opacity: 1;
}

.label-text {
  color: #1e1e1e;
  font-weight: 800;
  font-size: 1.1rem;
}

.start-btn {
  width: 100%;
  padding: 1rem;
  font-family: "Nunito", sans-serif;
  font-size: 19px;
  font-weight: 700;
  background-color: #22c55e;
  border: none;
  color: #1e1e1e;
  border-radius: 24px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0 4px 0px #22934c;
  margin-top: 10px;
  margin-bottom: 20px;
}

.start-btn:disabled {
  background: #e0e0e0;
  color: #a1a1a1;
  border-color: #a1a1a1;
  box-shadow: 0 4px 0 #a1a1a1;
  cursor: not-allowed;
}

.page-fade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease-out;
}
.page-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 400px) {
  .topic-label {
    font-size: 15px;
  }

  .topic-icon-box {
    width: 45px;
    height: 45px;
  }
}
</style>