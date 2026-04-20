<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {storeToRefs} from 'pinia'
import {useAudioTaskStore} from '../../store/audioTaskStore.js'
import Modal from "../../src/components/modal.vue"
import HeadPhones from '../../assets/images/headphones.svg'

const router = useRouter()
const store = useAudioTaskStore()
const {allTasks, currentLevel, userProgress} = storeToRefs(store)
const {t} = useI18n()
const screen = ref('levels')
const showDevModal = ref(false)

const levels = ['A1', 'A2', 'B1']
const levelColors = ['#9DFFBB', '#88B5FF', '#FF9F7F']
const topicColors = ['#FFEB7F', '#9DFFBB', '#FFAFF3', '#88B5FF', '#FF9F7F', '#AFAFFF', '#7FFFDF', '#FFD1AF']

const overlayData = {
  title: t('audioTasks.overlayDataTitle'),
  text: t('audioTasks.overlayDataText'),
}

const headerTitle = computed(() => screen.value === 'levels' ? t('audioTasks.audioTheme') : `${currentLevel.value}`)
const headerText = computed(() => screen.value === 'levels' ? t('audioTasks.takeComplexity') : t('audioTasks.takeTheme'))
const availableTopics = computed(() => allTasks.value[currentLevel.value] || [])

const handleBackClick = () => {
  screen.value === 'levels' ? router.push('/') : screen.value = 'levels'
}

const getCircularProgressStyle = (topic) => {
  const percent = getTopicProgressPercent(topic)
  return {background: `conic-gradient(rgb(74 117 255) ${percent}%, rgb(255, 255, 255) 0deg)`}
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
  store.setLevel(level)
  screen.value = 'topics'
}
const selectTopic = (topic) => {
  store.setCurrentTopicId(topic.id)
  router.push('/audio-tasks/session')
}

onMounted(async () => {
  await store.fetchTasks()
  await store.loadUserProgress()
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
                 stroke="#2b2b2b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div class="quiz__titles">
            <h1 class="quiz__title">{{ headerTitle }}</h1>
          </div>
          <button class="quiz__btn quiz__btn--info" @click="showDevModal = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </button>
        </header>
        <p class="quiz__subtitle">{{ headerText }}</p>
      </div>

      <div class="quiz__content">
        <transition name="quiz-pop" mode="out-in">
          <div :key="screen" :class="['quiz__grid', `quiz__grid--${screen}`]">
            <template v-if="screen === 'levels'">
              <button
                  v-for="(level, index) in levels"
                  :key="level"
                  @click="selectLevel(level)"
                  class="game-card card--level"
                  :style="{ '--card-color': levelColors[index] }"
              >
                <div class="game-card__body">
                  <div class="game-card__content">
                    <span class="game-card__label">{{ t('audioTasks.level') }}</span>
                    <span class="game-card__badge">{{ level }}</span>
                  </div>
                  <div class="game-card__arrow">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="4">
                      <path d="M5 12h14m-7-7l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </button>
            </template>

            <template v-else>
              <button
                  v-for="(topic, index) in availableTopics"
                  :key="topic.id"
                  @click="selectTopic(topic)"
                  class="game-card card--topic"
                  :style="{ '--card-color': getTopicColor(index) }"
              >
                <div class="game-card__body">
                  <div class="game-card__emoji">{{ topic.icon }}</div>
                  <div class="game-card__info">
                    <h3 class="game-card__title">{{ t(topic.title) }}</h3>
                  </div>
                  <div v-if="topic.tasks?.length" class="game-card__progress">
                    <div class="progress-ring" :style="getCircularProgressStyle(topic)">
                      <div class="progress-ring__center">
                        {{ getTopicCompleted(topic) }}/{{ topic.tasks.length }}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </template>
          </div>
        </transition>
      </div>
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
  height: 100%;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.quiz__header-wrapper {
  padding: 10px 16px 15px;
  flex-shrink: 0;
}

.quiz__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quiz__title {
  font-size: 24px;
  font-weight: 900;
  color: var(--titleColor);
  text-transform: uppercase;
  margin: 0;
  -webkit-text-stroke: 1px var(--titleColor);
}

.quiz__subtitle {
  font-size: 1rem;
  font-weight: 800;
  color: #6B7280;
  text-align: center;
  text-transform: uppercase;
  margin-top: 8px;
}

.quiz__content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.quiz__grid {
  display: grid;
  gap: 20px;
  padding: 10px 16px 50px;
  overflow-y: auto;
  align-content: start;
  grid-auto-rows: max-content;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.quiz__grid::-webkit-scrollbar {
  display: none;
}

.quiz__grid--levels {
  grid-template-columns: 1fr;
}

.quiz__grid--topics {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.game-card {
  --card-color: #eee;
  background: var(--card-color);
  border: 2px solid #2b2b2b;
  border-radius: 30px;
  padding: 0;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 4px 0 #2b2b2b;
  transition: transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.1s;
  overflow: hidden;
  display: block;
  flex-shrink: 0;
}

.game-card:active {
  transform: translateY(6px);
  box-shadow: 0 2px 0 #2b2b2b;
}

.game-card__body {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 24px;
  box-sizing: border-box;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
}

.game-card__content {
  display: flex;
  align-items: center;
  gap: 18px;
  width: 100%;
}

.game-card__label {
  font-size: 1.5rem;
  font-weight: 900;
  color: #2b2b2b;
  text-transform: uppercase;
}

.game-card__badge {
  background: #FFFFFF;
  border: 3px solid #2b2b2b;
  border-radius: 16px;
  padding: 4px 14px;
  font-size: 1.8rem;
  font-weight: 900;
}

.game-card__arrow {
  margin-left: auto;
  color: #2b2b2b;
}

.game-card__emoji {
  font-size: 3rem;
  margin-right: 20px;
}

.game-card__info {
  flex: 1;
  text-align: left;
}

.game-card__title {
  font-size: 1.2rem;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0;
  line-height: 1.1;
  color: #2b2b2b;
}

.game-card__progress {
  margin-left: 12px;
}

.progress-ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #2b2b2b;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
}

.progress-ring__center {
  width: 44px;
  height: 44px;
  background: #FFF;
  border: 3px solid #2b2b2b;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-back, .quiz__btn {
  background: #fff;
  border: 3px solid #2b2b2b;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 2px 0px #2b2b2b;
  transition: all 0.1s;
}

.btn-icon-back:active, .quiz__btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.quiz-pop-enter-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.quiz-pop-leave-active {
  transition: all 0.2s ease-in;
}

.quiz-pop-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.quiz-pop-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

@media (max-width: 400px) {
  .game-card__label {
    font-size: 1.2rem;
  }

  .game-card__badge {
    font-size: 1.4rem;
  }

  .game-card__emoji {
    font-size: 2.2rem;
  }

  .game-card__title {
    font-size: 1rem;
  }
}
</style>