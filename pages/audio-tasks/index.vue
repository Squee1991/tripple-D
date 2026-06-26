<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {storeToRefs} from 'pinia'
import {useAudioTaskStore} from '../../store/audioTaskStore.js'
import {userAuthStore} from '../../store/authStore.js'
import Modal from "../../src/components/modal.vue"
import VBanner from "~/src/components/V-banner.vue"
import HeadPhones from '../../assets/images/headphones.svg'
import VTransition from "~/src/components/V-transition.vue"
import VPremiumModal from "~/src/components/V-premiumModal.vue"
import VArrowNav from "~/src/components/V-arrowNav.vue";

const router = useRouter()
const store = useAudioTaskStore()
const authStore = userAuthStore()
const {allTasks, currentLevel, userProgress} = storeToRefs(store)
const {t } = useI18n()
const screen = ref('levels')
const showDevModal = ref(false)
const isMounted = ref(false)
const levels = ['A1', 'A2', 'B1']
const levelColors = ['#49b36a', '#88B5FF', '#FF9F7F']
const topicColors = ['#FFEB7F', '#9DFFBB', '#FFAFF3', '#88B5FF', '#FF9F7F', '#AFAFFF', '#7FFFDF', '#FFD1AF']
const showPremiumModal = ref(false)

const overlayData = {
  title: t('audioTasks.overlayDataTitle'),
  text: t('audioTasks.overlayDataText'),
}

const headerTitle = computed(() => screen.value === 'levels' ? t('audioTasks.audioTheme') : `${currentLevel.value}`)
const headerText = computed(() => screen.value === 'levels' ? t('audioTasks.takeComplexity') : t('audioTasks.takeTheme'))
const availableTopics = computed(() => allTasks.value[currentLevel.value] || [])

const handleBackClick = () => {
  if (screen.value === 'topics') {
    window.history.back()
  } else {
    router.push('/')
  }
}

const handlePopState = () => {
  if (screen.value === 'topics') {
    screen.value = 'levels'
  }
}

const getTopicColor = (index) => topicColors[index % topicColors.length]

const getTopicCompleted = (topic) => {
  if (!userProgress.value[topic.id]) return 0
  return Object.values(userProgress.value[topic.id]).filter(status => status === 'success').length
}

const getTopicProgressPercent = (topic) => {
  const total = topic.tasks?.length || 0
  return total === 0 ? 0 : (getTopicCompleted(topic) / total) * 100
}

const selectLevel = (level) => {
  window.history.pushState({ isAudioTopics: true }, '')
  store.setLevel(level)
  screen.value = 'topics'
}

const selectTopic = (topic, index) => {
  if (index === 0 || authStore.isPremium) {
      store.setCurrentTopicId(topic.id)
      router.push('/audio-tasks/session')
  } else {
    showPremiumModal.value = true
  }
}

onMounted(async () => {
  setTimeout(()=> {
    isMounted.value = true
  }, 100)
  await store.fetchTasks()
  await store.loadUserProgress()
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>

<template>
  <div class="quiz">
    <div class="quiz__container">
      <Modal
          @close="showDevModal = false"
          :visible="showDevModal"
          :title="overlayData.title"
          :img="HeadPhones"
          :text="overlayData.text"
      />
      <div class="quiz__header-wrapper">
        <header class="quiz__header">
          <button @click="handleBackClick" class="btn-icon-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div class="quiz__titles">
            <h1 class="quiz__title">{{ headerTitle }}</h1>
          </div>
          <button class="quiz__btn quiz__btn--info" @click="showDevModal = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                 stroke="orange" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </header>
      </div>
      <div class="quiz__content">
        <VTransition>
          <div v-if="isMounted" :key="screen" class="scrollable-view">
            <template v-if="screen === 'levels'">
              <div class="banner-wrapper">
                <VBanner
                    :text="t('bannerTitles.audio')"
                    :icon="HeadPhones"
                />
              </div>
              <div class="topics-list-container">
                <div
                    v-for="(level, index) in levels"
                    :key="level"
                    @click="selectLevel(level)"
                    class="topic-list-item"
                >
                  <div class="topic-item-content">
                    <span class="topic-label">{{ t('audioTasks.level') }}</span>
                    <div class="topic-icon-box" :style="{ color: levelColors[index] }">
                      <span style="font-size: 28px; font-weight: 900;">{{ level }}</span>
                    </div>
                  </div>
                  <VArrowNav/>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="banner-wrapper">
                <VBanner
                    :text="t('bannerTitles.audio')"
                    :icon="HeadPhones"
                />
              </div>
              <div class="topics-list-container">
                <div
                    v-for="(topic, index) in availableTopics"
                    :key="topic.id"
                    @click="selectTopic(topic, index)"
                    class="topic-list-item"
                >
                  <div class="topic-main-row">
                    <div class="topic-item-content">
                      <div class="topic-icon-box">{{ topic.icon }}</div>
                      <span class="topic-label">{{ t(topic.title) }}</span>
                    </div>
                    <div class="topic-arrow" :class="{ 'topic-arrow--locked': index !== 0 && !authStore.isPremium }">
                      <VArrowNav v-if="index === 0 || authStore.isPremium"/>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    </div>
                  </div>
                  <div v-if="topic.tasks?.length" class="topic-progress-wrapper">
                    <div class="progress-bar-container">
                      <div
                          class="progress-bar-fill"
                          :style="{
                          width: `${getTopicProgressPercent(topic)}%`,
                          backgroundColor: getTopicColor(index)
                        }"
                      ></div>
                    </div>
                    <div class="progress-text">
                      {{ getTopicCompleted(topic) }}/{{ topic.tasks.length }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </VTransition>
      </div>
      <VPremiumModal v-model:show="showPremiumModal" />
    </div>
  </div>
</template>

<style scoped>
.quiz {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg);
  font-family: 'Nunito', sans-serif;
  overflow: hidden;
}

.quiz__container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
}

.quiz__header-wrapper {
  padding: 5px 10px 15px 10px;
  flex-shrink: 0;
  margin-bottom: 10px;
}

.quiz__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quiz__title {
  font-size: 23px;
  font-weight: 900;
  color: var(--title);
  margin: 0;
  -webkit-text-stroke: 1px var(--title);
}

.quiz__subtitle {
  font-size: 1rem;
  font-weight: 800;
  color: var(--titleColor);
  text-align: center;
  text-transform: uppercase;
  margin-top: 8px;
}

.btn-icon-back, .quiz__btn {
  background: #fff;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  transition: all 0.1s;
}

.btn-icon-back:active, .quiz__btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.quiz__content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.scrollable-view {
  flex: 1;
  overflow-y: auto;
  padding: 10px 16px 50px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.scrollable-view::-webkit-scrollbar {
  display: none;
}

.topic-arrow--locked {
  background-color: #a0aec0;
  box-shadow: 0 3px 0px #718096;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%
}

.banner-wrapper {
  margin-bottom: 20px;
}

.topics-list-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.topic-list-item {
  border-radius: 20px;
  padding: 4px 16px;
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

.topic-list-item:not(:has(.topic-main-row)) {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
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
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.1));
}

.topic-label {
  color: var(--titleColor);
  font-size: 18px;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
}

.topic-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
  width: 100%;
}

.progress-bar-container {
  flex: 1;
  height: 8px;
  background-color: #1e272e;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
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

.quiz-pop-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.quiz-pop-leave-active {
  transition: all 0.2s ease-in;
}
.quiz-pop-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.quiz-pop-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

@media (max-width: 400px) {
  .topic-icon-box {
    font-size: 28px;
    width: 35px;
  }
}
</style>
