<template>
  <div class="quiz-app">
    <div class="quiz-app-container">
      <transition name="quiz-pop" mode="out-in">

        <div v-if="screen === 'levels'" class="quiz-screen">
          <header class="quiz-header">
            <h1 class="quiz-header-title">Deutsch Quiz</h1>
            <p class="quiz-header-subtitle">Выбери свой уровень сложности</p>
          </header>
          <div class="quiz-grid quiz-grid-levels">
            <button v-for="level in ['A1', 'A2', 'B1']" :key="level" @click="selectLevel(level)" class="level-card">
              <div class="level-card-content">
                <span class="level-card-badge">{{ level }}</span>
                <span class="level-card-name">Уровень {{ level }}</span>
              </div>
              <div class="level-card-arrow">→</div>
            </button>
          </div>
        </div>

        <div v-else-if="screen === 'topics'" class="quiz-screen">
          <header class="quiz-header">
            <button @click="screen = 'levels'" class="quiz-back-btn">⬅ Уровни</button>
            <h2 class="quiz-header-title">Темы {{ currentLevel }}</h2>
          </header>
          <div class="quiz-grid quiz-grid-topics">
            <button v-for="topic in availableTopics" :key="topic.id" @click="selectTopic(topic)" class="topic-card">
              <div class="topic-card-icon">{{ topic.icon }}</div>
              <div class="topic-card-info">
                <h3 class="topic-card-title">{{ topic.title }}</h3>
              </div>
              <div class="topic-card-arrow">→</div>
            </button>
          </div>
        </div>

        <div v-else class="quiz-screen">
          <header class="study-nav">
            <button @click="screen = 'topics'" class="study-nav-back"> ⬅ </button>
            <div class="study-nav-progress">
              <div class="progress-bar">
                <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
              </div>
              <span class="study-nav-counter">{{ currentTaskNumber }}/{{ totalTasksInTopic }}</span>
            </div>
          </header>

          <main v-if="!loading && currentTask" class="study-main">
            <article class="quest-card">
              <section class="quest-card-audio">
                <p class="quest-card-instruction">Прослушайте диалог!</p>

                <AudioButton
                    :level="currentLevel"
                    :topicId="currentTopic.id"
                    :fileName="currentTask.id + '_main'"
                    class="quest-card-mega-play"
                />

                <transition name="quiz-expand">
                  <div v-if="isTaskChecked" class="chat-flow">
                    <div v-for="(line, idx) in currentTask.dialogue" :key="idx" :class="['chat-bubble', 'chat-bubble-' + line.gender.toLowerCase()]">
                      <p class="chat-bubble-text">{{ line.text }}</p>
                    </div>
                  </div>
                </transition>
              </section>

              <div class="quest-card-options">
                <div v-for="(optionText, index) in currentTask.options" :key="index" class="quest-option">

                  <SoundBtn :content="optionText" class="quest-option-audio"/>

                  <button @click="handleOptionSelection(index)" :disabled="isTaskChecked" :class="getOptionClasses(index)">
                    <div class="quest-option-check">
                      <span v-if="isOptionSelected(index)">✓</span>
                    </div>
                    <span class="quest-option-text">{{ optionText }}</span>
                  </button>
                </div>
              </div>

              <footer class="quest-card-footer">
                <button v-if="!isTaskChecked" @click="checkResult" :disabled="!hasUserSelectedAnything" class="quiz-btn-primary">ПРОВЕРИТЬ</button>
                <div v-else class="quest-card-actions">
                  <button v-if="!isLastTask" @click="goToNextTask" class="quiz-btn-next">ДАЛЬШЕ</button>
                  <button v-else @click="screen = 'topics'" class="quiz-btn-finish">ФИНИШ 🏆</button>
                </div>
              </footer>
            </article>
          </main>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAudioTaskStore } from '../store/audioTaskStore.js'
import AudioButton from '../src/components/AudioBtn.vue'
import SoundBtn from '../src/components/soundBtn.vue'

const store = useAudioTaskStore()
const { allTasks, currentLevel, loading } = storeToRefs(store)

const screen = ref('levels')
const currentTopic = ref(null)
const currentIndex = ref(0)
const userSelections = ref({})
const taskResults = ref({})

onMounted(() => store.fetchTasks())

const availableTopics = computed(() => allTasks.value[currentLevel.value] || [])
const currentTask = computed(() => currentTopic.value?.tasks[currentIndex.value])
const currentTaskId = computed(() => currentTask.value?.id)
const isTaskChecked = computed(() => taskResults.value[currentTaskId.value]?.checked)
const hasUserSelectedAnything = computed(() => (userSelections.value[currentTaskId.value]?.length || 0) > 0)
const currentTaskNumber = computed(() => currentIndex.value + 1)
const totalTasksInTopic = computed(() => currentTopic.value?.tasks.length || 0)
const progressPercentage = computed(() => totalTasksInTopic.value > 0 ? (currentTaskNumber.value / totalTasksInTopic.value) * 100 : 0)
const isLastTask = computed(() => currentIndex.value >= totalTasksInTopic.value - 1)

const getLevelDescription = (level) => ''
const selectLevel = (level) => { store.setLevel(level); screen.value = 'topics' }
const selectTopic = (topic) => { currentTopic.value = topic; currentIndex.value = 0; userSelections.value = {}; taskResults.value = {}; screen.value = 'quiz' }

const handleOptionSelection = (optionIndex) => {
  if (isTaskChecked.value) return
  const taskId = currentTaskId.value
  if (!userSelections.value[taskId]) userSelections.value[taskId] = []
  const currentSelections = userSelections.value[taskId]
  if (currentSelections.includes(optionIndex)) {
    userSelections.value[taskId] = currentSelections.filter(idx => idx !== optionIndex)
  } else {
    userSelections.value[taskId].push(optionIndex)
  }
}

const isOptionSelected = (index) => userSelections.value[currentTaskId.value]?.includes(index)

const getOptionClasses = (optionIndex) => {
  const result = taskResults.value[currentTaskId.value]
  const isSelected = isOptionSelected(optionIndex)
  const isCorrect = currentTask.value.correctIndices.includes(optionIndex)
  let classes = 'quest-option-button'
  if (isSelected) classes += ' is-selected'
  if (result?.checked) {
    if (isCorrect) classes += ' is-correct'
    else if (isSelected) classes += ' is-wrong'
  }
  return classes
}

const checkResult = () => {
  const task = currentTask.value
  const selections = userSelections.value[task.id] || []
  const isCorrect = selections.length === task.correctIndices.length && selections.every(idx => task.correctIndices.includes(idx))
  taskResults.value[task.id] = { checked: true, isSuccess: isCorrect }
}

const goToNextTask = () => { if (!isLastTask.value) currentIndex.value++ }
</script>



<style scoped>

.quiz-app {
  min-height: 100vh;
  background-color: #f0f4f8;
  padding: 20px 8px;
  font-family: 'Nunito', sans-serif;
  color: #3c3c3c;
}

.quiz-app-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.quiz-header {
  text-align: center;
  margin-bottom: 40px;
}

.quiz-header-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin: 0 0 10px;
}

.quiz-header-subtitle {
  color: #afafaf;
  font-weight: 700;
}

.quiz-back-btn {
  background: none;
  border: none;
  color: #afafaf;
  font-weight: 900;
  cursor: pointer;
  margin-bottom: 20px;
  transition: color 0.2s;
}

.quiz-back-btn:hover {
  color: #3c3c3c;
}

.quiz-grid {
  display: grid;
  gap: 15px;
  justify-content: center;
}

.quiz-grid-levels {
  grid-template-columns: repeat(auto-fit, minmax(280px, 420px));
}

.quiz-grid-topics {
  grid-template-columns: repeat(auto-fit, minmax(320px, 450px));
}

.level-card, .topic-card {
  background: #ffffff;
  border: 2px solid #e5e5e5;
  border-bottom: 6px solid #e5e5e5;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.1s;
  box-sizing: border-box;
  width: 100%;
}

.level-card:active, .topic-card:active {
  transform: translateY(4px);
  border-bottom-width: 2px;
}

.level-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.level-card-badge {
  font-size: 2rem;
  font-weight: 900;
  color: #58cc02;
  display: block;
  margin-left: 10px;
}

.level-card-name {
  color: #afafaf;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.level-card-arrow {
  font-size: 1.8rem;
  font-weight: 900;
  color: #e5e5e5;
}

.topic-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
}

.topic-card-icon {
  font-size: 2.8rem;
}

.topic-card-info {
  flex-grow: 1;
  text-align: left;
}

.topic-card-title {
  font-size: 1.3rem;
  font-weight: 900;
  margin: 0;
}

.topic-card-stats {
  color: #afafaf;
  font-weight: 700;
  font-size: 0.9rem;
}

.topic-card-arrow {
  font-size: 1.4rem;
  font-weight: 900;
  color: #e5e5e5;
}

.study-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 700px;
  margin: 0 auto 15px;
}

.study-nav-back {
  background: #1cb0f6;
  width: 45px;
  height: 25px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: none;
  font-weight: 900;
  color: #ffffff;
  cursor: pointer;
  font-size: 22px;
}

.study-nav-progress {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex-grow: 1;
  height: 25px;
  background: #e5e5e5;
  border-radius: 20px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #58cc02;
  transition: width 0.4s ease;
}

.study-nav-counter {
  font-weight: 900;
  color: #afafaf;
}

.study-main {
  max-width: 700px;
  margin: 0 auto;
}

.quest-card {
  background: #ffffff;
  border: 2px solid #e5e5e5;
  border-bottom: 8px solid #e5e5e5;
  border-radius: 32px;
  padding: 9px;
  box-sizing: border-box;
}

.quest-card-badge {
  display: inline-block;
  background: #ce93d8;
  color: #ffffff;
  padding: 5px 14px;
  border-radius: 10px;
  font-weight: 900;
  font-size: 0.75rem;
  margin-bottom: 20px;
}

.quest-card-audio {
  background: #f8fbff;
  border-radius: 24px;
  padding: 14px;
  margin-bottom: 15px;
  text-align: center;
}

.quest-card-instruction {
  font-weight: 900;
  color: #1cb0f6;
  margin-bottom: 20px;
}

.quest-card-mega-play {
  background: #1cb0f6 !important;
  width: 75px;
  height: 75px;
  border-radius: 50% !important;
  border-bottom: 5px solid #1899d6 !important;
  margin: 0 auto;
}

.quest-card-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.quest-option {
  display: flex;
  align-items: center;
  gap: 6px;
}

.quest-option-audio {
  flex-shrink: 0;
  width: 48px !important;
  height: 48px !important;
  background: #eef2f7 !important;
  border-bottom: 4px solid #d1d9e6 !important;
  border-radius: 14px !important;
}

.quest-option-button {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 5px;
  background: #ffffff;
  border: 2px solid #e5e5e5;
  border-bottom: 4px solid #e5e5e5;
  border-radius: 18px;
  cursor: pointer;
  text-align: left;
}

.quest-option-button.is-selected {
  background: #f1f7ff;
  border-color: #1cb0f6;
}

.quest-option-button.is-correct {
  background: #d7ffb8;
  border-color: #58cc02;
  border-bottom-color: #46a302;
}

.quest-option-button.is-wrong {
  background: #ffdfe0;
  border-color: #ff4b4b;
  border-bottom-color: #d13a3a;
}

.quest-option-check {
  width: 22px;
  height: 22px;
  min-width: 22px;
  border: 2px solid #e5e5e5;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #ffffff;
}

.is-selected .quest-option-check {
  background: #1cb0f6;
  border-color: #1cb0f6;
}

.quest-option-text {
  font-weight: 700;
  color: #4b4b4b;
}

.chat-flow {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
  font-weight: 600;
}

.chat-bubble {
  padding: 6px 12px;
  border-radius: 18px;
  max-width: 85%;
  border: 2px solid #e5e5e5;
}

.chat-bubble-male {
  align-self: flex-start;
  background: #ffffff;
}

.chat-bubble-female {
  align-self: flex-end;
  background: #ddf4ff;
  border-color: #1cb0f6;
}

.quiz-btn-primary, .quiz-btn-next, .quiz-btn-finish {
  width: 100%;
  padding: 9px;
  border-radius: 18px;
  border: none;
  font-weight: 900;
  font-size: 1.2rem;
  cursor: pointer;
  text-transform: uppercase;
}

.quiz-btn-primary {
  background: #58cc02;
  color: #ffffff;
  border-bottom: 6px solid #46a302;
}

.quiz-btn-primary:disabled {
  background: #e5e5e5;
  border-bottom-color: #cccccc;
  color: #afafaf;
}

.quiz-btn-next {
  background: #1cb0f6;
  color: #ffffff;
  border-bottom: 6px solid #1899d6;
}

.quiz-btn-finish {
  background: #ffc800;
  color: #ffffff;
  border-bottom: 6px solid #e5b100;
}

.quiz-pop-enter-active {
  animation: quiz-pop-in 0.3s ease-out;
}

@keyframes quiz-pop-in {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.quiz-expand-enter-active {
  transition: all 0.4s ease;
  max-height: 800px;
  overflow: hidden;
}

.quiz-expand-enter-from {
  opacity: 0;
  max-height: 0;
}
</style>