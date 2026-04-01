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
          <button @click="handleBackClick" class="quiz__btn quiz__btn--back">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div class="quiz__titles">
            <h1 class="quiz__title">{{ headerTitle }}</h1>
            <p class="quiz__subtitle"> {{ headerText }}</p>
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
      </div>
      <div class="quiz__content">
        <transition name="quiz-pop" mode="out-in">
          <div :key="screen" :class="['quiz__grid', `quiz__grid--${screen}`]">
            <template v-if="screen === 'levels'">
              <button
                  v-for="(level, index) in levels"
                  :key="level"
                  @click="selectLevel(level)"
                  class="card card--level"
                  :style="{ backgroundColor: levelColors[index] }"
              >
                <div class="card__inner">
                  <span class="card__label">{{t('audioTasks.level')}}</span>
                  <span class="card__badge">{{ level }}</span>
                </div>
                <div class="card__arrow">→</div>
              </button>
            </template>
            <template v-else>
              <button
                  v-for="(topic, index) in availableTopics"
                  :key="topic.id"
                  @click="selectTopic(topic)"
                  class="card card--topic"
                  :style="{ backgroundColor: getTopicColor(index) }"
              >
                <div class="card__icon">{{ topic.icon }}</div>
                <div class="card__info">
                  <h3 class="card__title">{{ t(topic.title) }}</h3>
                </div>
                <div v-if="topic.tasks?.length" class="card__progress">
                  <div class="circular-progress" :style="getCircularProgressStyle(topic)">
                    <div class="circular-progress__inner">
                      <span class="circular-progress__text">
                        {{ getTopicCompleted(topic) }}/{{ topic.tasks.length }}
                      </span>
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
const { t } = useI18n()
const screen = ref('levels')
const showDevModal = ref(false)

const levels = ['A1', 'A2', 'B1']
const levelColors = ['#7bed9f', '#70a1ff', '#ff7f50']

const topicColors = [
  '#ffeb3b', '#7bed9f', '#ff9ff3', '#70a1ff',
  '#ff7f50', '#a29bfe', '#55efc4', '#fab1a0',
  '#81ecec', '#fdcb6e', '#ffeaa7', '#00cec9',
  '#ffcccc', '#ccffcc', '#ccccff', '#ffffcc'
]

const overlayData = {
  title: t('audioTasks.overlayDataTitle'),
  text: t('audioTasks.overlayDataText'),
}

const headerTitle = computed(() => {
  return screen.value === 'levels' ? t('audioTasks.audioTheme') : `${currentLevel.value}`
})

const headerText = computed(() => {
  return screen.value === 'levels' ? t('audioTasks.takeComplexity') : t('audioTasks.takeTheme')
})

const availableTopics = computed(() => allTasks.value[currentLevel.value] || [])

const handleBackClick = () => {
  screen.value === 'levels' ? router.push('/') : screen.value = 'levels'
}

const getCircularProgressStyle = (topic) => {
  const percent = getTopicProgressPercent(topic)
  return {
    background: `conic-gradient(rgb(91 132 255) ${percent}%, rgb(255, 255, 255) 0deg)`
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

<style scoped>

.quiz {
  min-height: 100vh;
  font-family: 'Nunito', sans-serif;
  color: #2f3542;
}

.quiz__container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.quiz__header-wrapper {
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 100;
  padding: 15px 20px;
}

.quiz__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 920px;
  margin: 0 auto;
  width: 100%;
}

.quiz__titles {
  text-align: center;
  flex-grow: 1;
}

.quiz__title {
  font-size: 2rem;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 1px;
  color: #ff6b81;
  text-shadow: 2px 2px 0px #2f3542;
}

.quiz__subtitle {
  color: #57606f;
  font-weight: 800;
  font-size: 1rem;
  margin-top: 5px;
  text-transform: uppercase;
}

.quiz__btn {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid #2f3542;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 3px 3px 0px #2f3542;
  transition: all 0.1s ease;
  flex-shrink: 0;
  color: #2f3542;
}

.quiz__btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px 0px #2f3542;
}

.quiz__btn--back {
  background-color: #ffeaa7;
}

.quiz__btn--info {
  background-color: #ffffff;
}

.quiz__content {
  padding: 10px 20px 30px;
}

.quiz__grid {
  display: grid;
  gap: 17px;
  justify-content: center;
}

.quiz__grid--levels {
  grid-template-columns: repeat(auto-fit, minmax(280px, 420px));
}

.quiz__grid--topics {
  grid-template-columns: repeat(auto-fit, minmax(320px, 450px));
}

.card {
  border: 3px solid #2f3542;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.1s ease;
  box-sizing: border-box;
  width: 100%;
  box-shadow: 4px 4px 0px #2f3542;
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 10px;
  color: #2f3542;
}

@media (min-width: 1024px) {
  .card:hover {
    transform: translateY(-1px);
    box-shadow: 5px 5px 0px #2f3542;
  }
}

.card:active {
  transform: translate(6px, 6px);
  box-shadow: 0px 0px 0px #2f3542;
}

.card__arrow {
  font-size: 1.5rem;
  font-weight: 900;
}

.card--level {
  justify-content: space-between;
}

.card__inner {
  display: flex;
  align-items: center;
  gap: 15px;
}

.card__label {
  font-weight: 900;
  font-size: 1.6rem;
  text-transform: uppercase;
}

.card__badge {
  font-size: 2rem;
  font-weight: 900;
  background: #ffffff;
  border: 3px solid #2f3542;
  padding: 4px 10px;
  border-radius: 12px;
  box-shadow: 3px 3px 0px #2f3542;
}

.card__icon {
  font-size: 3rem;
  filter: drop-shadow(2px 2px 0px rgba(47, 53, 66, 0.3));
}

.card__info {
  flex-grow: 1;
  text-align: left;
}

.card__title {
  font-size: 1.3rem;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0;
}

.card__progress {
  margin-right: 10px;
  flex-shrink: 0;
}

.circular-progress {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #2f3542;
}

.circular-progress__inner {
  width: 46px;
  height: 46px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #2f3542;
}

.circular-progress__text {
  font-size: 0.8rem;
  font-weight: 900;
}

.quiz-pop-enter-active {
  animation: quiz-pop-in 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes quiz-pop-in {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 767px) {
  .card__title {
    font-size: 1.1rem;
  }
  .card__icon {
    font-size: 2.6rem;
  }
}
</style>