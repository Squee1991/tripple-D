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
      <VTransition>
        <div v-if="isPageLoaded" class="theme-content-area">
          <div class="grid-area-wrapper">
            <div class="theme__grid-container">
              <div class="banner-wrapper">
                <VBanner :icon="BannerIcon" :text="t('bannerTitles.article')"/>
              </div>
              <div class="topics-list-container">
                <div v-for="group in categorizedTopics" :key="group.id" class="category-group">
                  <div class="category-header">
                    <h3 class="category-title">{{ t(group.title) }}</h3>
                    <div class="category-progress-inline">
                      <span class="category-counter">
                        {{ getCategoryStatus(group).completed }}/{{ group.keys.length }}
                      </span>
                      <div class="mini-progress-bar">
                        <div
                            class="mini-progress-fill"
                            :style="{ width: getCategoryStatus(group).percent + '%' }"
                        ></div>
                      </div>
                      <div class="completion-check" :class="{ 'is-finished': getCategoryStatus(group).isAllDone }">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                             stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div class="category-grid">
                    <div
                        v-for="(key, index) in group.keys"
                        :key="key"
                        class="topic-list-item"
                        :class="{ active: selectedTopic === key }"
                        @click="selectTopic(key)"
                    >
                      <div class="topic-main-row">
                        <div class="topic-item-content">
                          <div class="topic-icon-box">
                            <span class="theme__cards-icon-item">{{ iconMap[key] || '✨' }}</span>
                          </div>
                          <span class="topic-label">{{ t(nameMap[key]) }}</span>
                        </div>
                        <!-- Проверяем доступность темы через новую функцию -->
                        <VArrowNav v-if="isTopicUnlocked(key)"/>
                        <div v-else class="topic-arrow topic-arrow--locked">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="topic-progress-wrapper">
                        <div class="progress-bar-container">
                          <div class="progress-bar-fill"
                               :style="{ width: `${themeProgress[key]?.total ? (themeProgress[key].learned / themeProgress[key].total) * 100 : 0}%`, backgroundColor: getTopicColor(index) }"></div>
                        </div>
                        <div class="progress-text">{{
                            themeProgress[key]?.learned || 0
                          }}/{{ themeProgress[key]?.total || 0 }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VTransition>
      <Transition appear name="slide-right">
        <div v-if="showModesBlock" class="learning-modes-block">
          <div class="learning__modes-wrapper">
            <div class="modes-header-container">
              <button @click="clearSelectedTopic" class="close-modes-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                     stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
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
      <VPremiumModal v-model:show="showPremiumModal"/>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, nextTick, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {userlangStore} from '../../store/learningStore.js'
import {userAuthStore} from '../../store/authStore.js'
import {nameMap, categories, iconMap, topicColors, baseModes} from '../../utils/nameMap.js'
import VLoginPreloader from "../../src/components/V-loginPreloader.vue"
import VBanner from "~/src/components/V-banner.vue"
import BannerIcon from '../../assets/images/articleBannerIcon.svg'
import VArrowNav from "~/src/components/V-arrowNav.vue"
import VTransition from "~/src/components/V-transition.vue"
import VPremiumModal from "~/src/components/V-premiumModal.vue"

const getTopicColor = (index) => topicColors[index % topicColors.length]

const { t, locale } = useI18n()
const showModesBlock = ref(false)
const router = useRouter()
const store = userlangStore()
const authStore = userAuthStore()
const themeList = ref({})
const selectedTopic = ref(null)
const selectedModes = ref([])
const localePath = useLocalePath()
const isLoading = ref(false)
const isPageLoaded = ref(false)
const showPremiumModal = ref(false)

const categorizedTopics = computed(() => {
  return categories.map(category => {
    const filteredKeys = category.topics.filter(key => nameMap[key] && themeList.value[key]);
    return {...category, keys: filteredKeys};
  }).filter(group => group.keys.length > 0);
})

const flatTopics = computed(() => {
  return categorizedTopics.value.flatMap(group => group.keys)
})

function hasAnyPlural(wordsArray) {
  const list = Array.isArray(wordsArray) ? wordsArray : []
  return list.some(w => w.plural && String(w.plural).trim() !== '')
}

const availableModes = computed(() => {
  const key = selectedTopic.value
  if (!key) return []
  const topicWords = Array.isArray(themeList.value[key]) ? themeList.value[key] : []
  return hasAnyPlural(topicWords) ? baseModes : baseModes.filter(m => m.key !== 'plural')
})

const themeProgress = computed(() => {
  return Object.fromEntries(
      Object.entries(themeList.value).map(([key, words]) => {
        const total = words.length
        const hasPlural = hasAnyPlural(words)
        const modesToCheck = baseModes.filter(m => hasPlural || m.key !== 'plural').map(m => m.key)
        const learned = words.filter(word => {
          const globalWord = store.words.find(w => w.de === word.de && w.topic === key)
          if (!globalWord || !globalWord.progress) return false
          return modesToCheck.every(mode => globalWord.progress[mode] === true)
        }).length
        return [key, {learned, total}]
      })
  )
})

const getCategoryStatus = (group) => {
  const completed = group.keys.filter(key => {
    const prog = themeProgress.value[key]
    return prog && prog.learned > 0 && prog.learned === prog.total
  }).length
  const total = group.keys.length
  return {
    completed,
    percent: total > 0 ? (completed / total) * 100 : 0,
    isAllDone: completed > 0 && completed === total
  }
}

const isTopicUnlocked = (key) => {
  if (authStore.isPremium) return true
  const allKeys = flatTopics.value
  const index = allKeys.indexOf(key)
  if (index === 0) return true
  const prevKey = allKeys[index - 1]
  const prevProgress = themeProgress.value[prevKey]
  return prevProgress && prevProgress.total > 0 && prevProgress.learned === prevProgress.total
}

const selectTopic = (key) => {
  if (isTopicUnlocked(key)) {
    window.history.pushState({isModesOpen: true}, '')
    selectedTopic.value = key
    selectedModes.value = []
    showModesBlock.value = true
  } else {
    showPremiumModal.value = true
  }
}

const startLearning = async () => {
  if (!selectedModes.value.length || isLoading.value) return
  isLoading.value = true

  try {
    const sortedSelectedModes = baseModes.filter(m => selectedModes.value.includes(m.key)).map(m => m.key)
    const currentLangKey = locale.value || 'en'

    const topicWordsLocal = (themeList.value[selectedTopic.value] || [])
        .filter(word => {
          const globalWord = store.words.find(w => w.de === word.de && w.topic === selectedTopic.value)
          return sortedSelectedModes.some(mode => !(globalWord?.progress?.[mode] === true))
        })
        .map(w => ({
          de: w.de,
          article: w.article,
          plural: w.plural || '',
          topic: selectedTopic.value,
          [currentLangKey]: w[currentLangKey]
        }))

    await store.addWordsToGlobal(topicWordsLocal)
    await store.setSelectedWords(topicWordsLocal)
    await store.setSelectedTopics([selectedTopic.value])
    await store.saveToFirebase()

    await nextTick()
    await router.push(localePath({
      path: '/articles/articles-session',
      query: {topic: selectedTopic.value, mode: sortedSelectedModes}
    }))
  } catch (e) {
    isLoading.value = false
  }
}

function goBack() {
  if (showModesBlock.value) window.history.back()
  else router.push('/')
}

const handlePopState = () => {
  if (showModesBlock.value) {
    showModesBlock.value = false
    selectedTopic.value = null
  }
}

const clearSelectedTopic = () => {
  if (showModesBlock.value) window.history.back()
}

onMounted(()=> {
  setTimeout(() => {
    isPageLoaded.value = true
  }, 100)
})

onMounted(async () => {
  const res = await fetch('/words.json')
  themeList.value = await res.json()
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => window.removeEventListener('popstate', handlePopState))
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
  font-size: 23px;
  font-weight: 600;
  color: var(--title);
  text-shadow: 1px 1px var(--title);
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
  margin: 0 15px 15px 15px;
}

.topics-list-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 10px 40px 15px;
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
  font-size: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme__cards-icon-item {
  display: inline-block;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.topic-label {
  color: var(--titleColor);
  font-size: 17px;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
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
}

.topic-arrow--locked {
  background-color: #a0aec0;
  box-shadow: 0 3px 0px #718096;
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
  padding: 5px 10px 15px 10px;
  margin-bottom: 15px;
}

.close-modes-btn {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.close-modes-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
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
  padding: 0 15px;
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
  border-radius: 20px;
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
  padding: 14px;
  font-family: "Nunito", sans-serif;
  font-size: 19px;
  font-weight: 700;
  background-color: #3b82f6;
  border: 2px solid #2563eb;
  color: white;
  border-radius: 34px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  border-bottom: 4px solid #1d4ed8;
  margin: 10px 15px 20px 15px;

}

.start-btn:disabled {
  background: #e0e0e0;
  color: #a1a1a1;
  border: 2px solid #a1a1a1;
  border-bottom: 4px solid #a1a1a1;
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
    font-size: 14px;
  }
}

.category-group {
  margin-bottom: 15px;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  margin-bottom: 12px;
}

.category-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
}

.category-progress-inline {
  display: flex;
  align-items: center;
  gap: 5px;
}

.category-counter {
  font-size: 14px;
  font-weight: 800;
  color: var(--titleColor);
  letter-spacing: 1px;
}

.mini-progress-bar {
  width: 60px;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #cbd5e0;
}

.mini-progress-fill {
  height: 100%;
  background-color: #2ecc71;
  transition: width 0.3s ease;
}

.completion-check {
  color: #cbd5e0;
  display: flex;
  align-items: center;
}

.completion-check.is-finished {
  color: #2ecc71;
}

.category-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 12px;
  padding: 0 16px 15px 16px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

.category-grid::-webkit-scrollbar {
  display: none;
}

.topic-list-item {
  flex: 0 0 85%;
  scroll-snap-align: start;
  border-radius: 20px;
  padding: 16px;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .topic-list-item {
    flex: 0 0 300px;
  }
}
</style>