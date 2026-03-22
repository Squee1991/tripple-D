<template>
  <div class="quiz-app">
    <div class="quiz-app-container">
      <div v-if="loading" class="quiz-screen">
        <p style="text-align: center; font-weight: bold;">Загрузка...</p>
      </div>

      <div v-else-if="currentTask" class="quiz-screen">
        <header class="study-nav">
          <button @click="attemptExit" class="study-nav-back"> ⬅ </button>
          <div class="study-nav-progress">
            <div class="progress-bar">
              <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <span class="study-nav-counter">{{ currentTaskNumber }}/{{ totalTasksInTopic }}</span>
          </div>
        </header>
        <main class="study-main">
          <article class="quest-card">
            <section class="quest-card-audio">
              <p class="quest-card-instruction">Прослушайте диалог!</p>
              <AudioButton
                  :key="'main-audio-' + currentTask.id"
                  :level="currentLevel"
                  :topicId="currentTopic.id"
                  :fileName="currentTask.id + '_main'"
                  class="quest-card-mega-play"
              />
              <transition name="quiz-expand">
                <div v-if="isTaskChecked" class="chat-flow">
                  <div v-for="(line, idx) in currentTask.dialogue" :key="'chat-' + currentTask.id + '-' + idx" :class="['chat-bubble', 'chat-bubble-' + line.gender.toLowerCase()]">
                    <p class="chat-bubble-text">{{ line.text }}</p>
                  </div>
                </div>
              </transition>
            </section>

            <div class="quest-card-options">
              <div v-for="(optionText, index) in currentTask.options" :key="'option-' + currentTask.id + '-' + index" class="quest-option">
                <SoundBtn :key="'sound-' + currentTask.id + '-' + index" :content="optionText" class="quest-option-audio"/>
                <button @click="handleOptionSelection(index)" :disabled="isTaskChecked" :class="getOptionClasses(index)">
                  <div class="quest-option-check">
                    <template v-if="isOptionSelected(index)">
                      <span v-if="isTaskChecked && !currentTask.correctIndices.includes(index)">✖</span>
                      <span v-else>✓</span>
                    </template>
                    <template v-else-if="isTaskChecked && currentTask.correctIndices.includes(index)">
                      <span>!</span>
                    </template>
                  </div>
                  <span class="quest-option-text">{{ optionText }}</span>
                </button>
              </div>
            </div>

            <div v-if="getFeedbackData" :class="['quest-feedback', getFeedbackData.class]">
              <p class="quest-feedback-text">{{ getFeedbackData.text }}</p>
            </div>

            <footer class="quest-card-footer">
              <button v-if="!isTaskChecked" @click="checkResult" :disabled="!hasUserSelectedAnything" class="quiz-btn-primary">ПРОВЕРИТЬ</button>

              <div v-if="!isTaskChecked && canSkipCurrentTask" class="quest-card-actions" style="margin-top: 10px;">
                <button @click="skipTask" class="quiz-btn-skip">ПРОПУСТИТЬ</button>
              </div>

              <div v-if="isTaskChecked" class="quest-card-actions">
                <button v-if="!isLastTask" @click="goToNextTask" class="quiz-btn-next">ДАЛЬШЕ</button>
                <button v-else @click="finishAndSave" class="quiz-btn-finish">ФИНИШ 🏆</button>
              </div>
            </footer>
          </article>
        </main>
      </div>

      <div v-if="showExitModal" class="modal-overlay">
        <div class="modal-card">
          <h3 class="modal-title">Внимание!</h3>
          <p class="modal-text">Задание не пройдено полностью, прогресс не будет сохранен.</p>
          <div class="modal-actions">
            <button @click="cancelExit" class="modal-btn modal-btn-continue">Продолжить</button>
            <button @click="confirmExit" class="modal-btn modal-btn-exit">Выйти</button>
          </div>
        </div>
      </div>

      <div v-if="showFinishModal" class="modal-overlay">
        <div class="modal-card">
          <h3 class="modal-title">{{ sessionStats.passed ? 'Отличная работа! 🏆' : 'Нужно потренироваться! 🏋️' }}</h3>
          <p v-if="sessionStats.passed" class="modal-text success-text">Задание выполнено успешно!</p>
          <p v-else class="modal-text fail-text">Для выполнения задания нужно больше правильных ответов.</p>

          <div class="stats-grid">
            <div class="stat-item stat-correct"><span>Верно:</span> <b>{{ sessionStats.correct }}</b></div>
            <div class="stat-item stat-partial"><span>Частично:</span> <b>{{ sessionStats.partial }}</b></div>
            <div class="stat-item stat-wrong"><span>Неверно:</span> <b>{{ sessionStats.wrong }}</b></div>
          </div>

          <div class="modal-actions">
            <button @click="handleFinishRetry" class="modal-btn modal-btn-continue">Повторить</button>
            <button @click="handleFinishBack" class="modal-btn modal-btn-exit">Назад</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAudioTaskStore } from '../../store/audioTaskStore.js'
import AudioButton from '../../src/components/AudioBtn.vue'
import SoundBtn from '../../src/components/soundBtn.vue'

const router = useRouter()
const store = useAudioTaskStore()
const { allTasks, currentLevel, currentTopicId, loading, userProgress } = storeToRefs(store)

const currentTopic = ref(null)
const sessionTasks = ref([])
const currentIndex = ref(0)
const userSelections = ref({})
const taskResults = ref({})

const showExitModal = ref(false)
const showFinishModal = ref(false)
const sessionStats = ref({ correct: 0, partial: 0, wrong: 0, passed: false })

const stopAllAudio = () => {
  document.querySelectorAll('audio').forEach(audio => {
    audio.pause()
    audio.currentTime = 0
  })
  window.dispatchEvent(new Event('stop-all-audio'))
}

watch(currentIndex, () => {
  stopAllAudio()
})

const handleBeforeUnload = (e) => {
  if (!showFinishModal.value && !showExitModal.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

const initializeSession = () => {
  const topics = allTasks.value[currentLevel.value] || []
  currentTopic.value = topics.find(t => t.id === currentTopicId.value)

  if (!currentTopic.value) {
    router.push('/audio-tasks')
    return
  }

  currentIndex.value = 0
  userSelections.value = {}
  taskResults.value = {}

  const progress = userProgress.value[currentTopic.value.id] || {}
  const hasErrorsOrIncomplete = currentTopic.value.tasks.some(t => progress[t.id] !== 'success')

  let tasksToPlay = []

  if (hasErrorsOrIncomplete) {
    tasksToPlay = currentTopic.value.tasks.filter(t => progress[t.id] !== 'success')
  } else {
    tasksToPlay = [...currentTopic.value.tasks]
  }

  tasksToPlay.sort(() => Math.random() - 0.5)
  sessionTasks.value = tasksToPlay
}

onMounted(async () => {
  if (!currentTopicId.value) {
    router.push('/audio-tasks')
    return
  }
  await store.fetchTasks()
  await store.loadUserProgress()
  initializeSession()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  stopAllAudio()
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

const currentTask = computed(() => sessionTasks.value[currentIndex.value])
const currentTaskId = computed(() => currentTask.value?.id)
const isTaskChecked = computed(() => taskResults.value[currentTaskId.value]?.checked)
const hasUserSelectedAnything = computed(() => (userSelections.value[currentTaskId.value]?.length || 0) > 0)
const currentTaskNumber = computed(() => currentIndex.value + 1)
const totalTasksInTopic = computed(() => sessionTasks.value.length || 0)
const progressPercentage = computed(() => totalTasksInTopic.value > 0 ? (currentIndex.value / totalTasksInTopic.value) * 100 : 0)
const isLastTask = computed(() => currentIndex.value >= totalTasksInTopic.value - 1)

const canSkipCurrentTask = computed(() => {
  if (!currentTopic.value || !currentTask.value) return false
  return userProgress.value[currentTopic.value.id]?.[currentTaskId.value] === 'success'
})

const getFeedbackData = computed(() => {
  const result = taskResults.value[currentTaskId.value]
  if (!result || !result.checked) return null

  if (result.status === 'success') {
    return { class: 'is-success', text: '✅ Задание выполнено верно!' }
  }
  if (result.correctCount === 0) {
    return { class: 'is-wrong', text: '❌ Не выбран ни один правильный вариант ответа!' }
  }
  if (result.wrongCount > 0) {
    return { class: 'is-wrong', text: '❌ Есть неверные ответы!' }
  }
  if (result.missedCount > 0) {
    return { class: 'is-warning', text: '⚠️ Выбраны не все верные варианты!' }
  }
  return null
})

const attemptExit = () => {
  if (currentIndex.value > 0 && !showFinishModal.value && !isLastTask.value && !isTaskChecked.value) {
    showExitModal.value = true
  } else if (currentIndex.value > 0 && !showFinishModal.value) {
    showExitModal.value = true
  } else {
    stopAllAudio()
    router.push('/audio-tasks')
  }
}

const confirmExit = () => {
  stopAllAudio()
  showExitModal.value = false
  router.push('/audio-tasks')
}

const cancelExit = () => {
  showExitModal.value = false
}

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
    if (isSelected && isCorrect) {
      classes += ' is-correct'
    } else if (!isSelected && isCorrect) {
      classes += ' is-missed'
    } else if (isSelected && !isCorrect) {
      classes += ' is-wrong'
    }
  }
  return classes
}

const checkResult = () => {
  const task = currentTask.value
  const selections = userSelections.value[task.id] || []
  const correct = task.correctIndices

  const correctSelected = selections.filter(idx => correct.includes(idx)).length
  const wrongSelected = selections.filter(idx => !correct.includes(idx)).length
  const missedCount = correct.length - correctSelected

  const isSuccess = correctSelected === correct.length && wrongSelected === 0

  let status = isSuccess ? 'success' : 'wrong'

  taskResults.value[task.id] = {
    checked: true,
    status,
    missedCount,
    wrongCount: wrongSelected,
    correctCount: correctSelected
  }
}

const finishAndSave = async () => {
  stopAllAudio()

  let correct = 0
  let partial = 0
  let wrong = 0
  const resultsToSave = {}

  sessionTasks.value.forEach(task => {
    const res = taskResults.value[task.id]
    if (res) {
      if (res.status === 'success') {
        correct++
        resultsToSave[task.id] = 'success'
      } else if (res.wrongCount > 0 || res.correctCount === 0) {
        wrong++
        resultsToSave[task.id] = 'wrong'
      } else if (res.missedCount > 0) {
        partial++
        resultsToSave[task.id] = 'partial'
      }
    }
  })

  const threshold = Math.ceil(sessionTasks.value.length * 0.8)

  sessionStats.value = {
    correct,
    partial,
    wrong,
    passed: correct >= threshold
  }

  await store.saveTopicProgress(currentTopic.value.id, resultsToSave)
  showFinishModal.value = true
}

const handleFinishRetry = () => {
  showFinishModal.value = false
  initializeSession()
}

const handleFinishBack = () => {
  showFinishModal.value = false
  router.push('/audio-tasks')
}

const skipTask = () => {
  stopAllAudio()
  if (!isLastTask.value) currentIndex.value++
  else finishAndSave()
}

const goToNextTask = () => {
  stopAllAudio()
  if (!isLastTask.value) currentIndex.value++
}
</script>

<style scoped>
.quiz-app {
  min-height: 100vh;
  padding: 15px 8px;
  font-family: 'Nunito', sans-serif;
  color: #2f3542;
  position: relative;
}

.quiz-app-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.study-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 700px;
  margin: 0 auto 9px;
}

.study-nav-back {
  background: #ffeaa7;
  width: 45px;
  height: 32px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #2f3542;
  box-shadow: 2px 2px 0px #2f3542;
  font-weight: 900;
  color: #2f3542;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.1s ease;
}

.study-nav-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2f3542;
}

.study-nav-progress {
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-bar {
  flex-grow: 1;
  height: 24px;
  background: #ffffff;
  border-radius: 12px;
  border: 2px solid #2f3542;
  box-shadow: 2px 2px 0px #2f3542;
  overflow: hidden;
  box-sizing: border-box;
}

.progress-bar-fill {
  height: 100%;
  background: #7bed9f;
  transition: width 0.4s ease;
  border-right: 2px solid #2f3542;
}

.study-nav-counter {
  font-weight: 900;
  color: #2f3542;
  font-size: 1.1rem;
}

.study-main {
  max-width: 700px;
  margin: 0 auto;
}

.quest-card {
  background: #ffffff;
  border: 2px solid #2f3542;
  border-radius: 20px;
  box-shadow: 4px 4px 0px #2f3542;
  padding: 12px;
  box-sizing: border-box;
}

.quest-card-audio {
  background: #fdfdfd;
  border: 2px dashed #2f3542;
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 15px;
  text-align: center;
}

.quest-card-instruction {
  font-weight: 900;
  color: #70a1ff;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.quest-card-mega-play {
  background: #70a1ff !important;
  width: 70px !important;
  height: 70px !important;
  border-radius: 50% !important;
  border: 2px solid #2f3542 !important;
  box-shadow: 3px 3px 0px #2f3542 !important;
  margin: 0 auto;
}

.quest-card-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.quest-option {
  display: flex;
  align-items: center;
  gap: 5px;
}

.quest-option-audio {
  flex-shrink: 0;
  width: 44px !important;
  height: 44px !important;
  background: #ffffff !important;
  border: 2px solid #2f3542 !important;
  box-shadow: 2px 2px 0px #2f3542 !important;
  border-radius: 12px !important;
}

.quest-option-button {
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 8px 5px;
  background: #ffffff;
  border: 2px solid #2f3542;
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  box-shadow: 2px 2px 0px #2f3542;
  transition: all 0.1s ease;
}

.quest-option-button:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2f3542;
}

.quest-option-button.is-selected {
  background: #dff9fb;
}

.quest-option-button.is-correct {
  background: #7bed9f;
}

.quest-option-button.is-missed {
  background: #ffeaa7;
}

.quest-option-button.is-wrong {
  background: #ff6b81;
}

.quest-option-check {
  width: 22px;
  height: 22px;
  min-width: 22px;
  border: 2px solid #2f3542;
  border-radius: 6px;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #2f3542;
  background: #ffffff;
  box-sizing: border-box;
}

.is-selected .quest-option-check {
  background: #2f3542;
  color: #ffffff;
}

.is-wrong .quest-option-check {
  background: #2f3542;
  color: #ffffff;
}

.is-missed .quest-option-check {
  background: #2f3542;
  color: #ffffff;
}

.quest-option-text {
  font-weight: 800;
  color: #2f3542;
  font-size: 0.9rem;
}

.quest-feedback {
  text-align: center;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 12px;
  border: 2px dashed #2f3542;
}

.quest-feedback.is-success {
  border: 4px dashed #7bed9f;
}

.quest-feedback.is-warning {
  border: 4px dashed #ffeaa7;
}

.quest-feedback.is-wrong {
  border: 4px dashed #ff6b81;
}

.quest-feedback-text {
  font-weight: 900;
  margin: 0;
  color: #2f3542;
}

.chat-flow {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
}

.chat-bubble {
  padding: 8px 12px;
  border-radius: 16px;
  max-width: 85%;
  border: 2px solid #2f3542;
  background: #ffffff;
}

.chat-bubble-male {
  align-self: flex-start;
  box-shadow: 2px 2px 0px #2f3542;
}

.chat-bubble-female {
  align-self: flex-end;
  background: #dff9fb;
  box-shadow: -2px 2px 0px #2f3542;
}

.quiz-btn-primary, .quiz-btn-next, .quiz-btn-finish, .quiz-btn-skip {
  width: 100%;
  padding: 10px;
  border-radius: 14px;
  border: 2px solid #2f3542;
  font-weight: 900;
  font-size: 1.1rem;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 3px 3px 0px #2f3542;
  transition: all 0.1s ease;
  color: #2f3542;
}

.quiz-btn-primary:active:not(:disabled),
.quiz-btn-next:active,
.quiz-btn-finish:active,
.quiz-btn-skip:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px 0px #2f3542;
}

.quiz-btn-primary {
  background: #7bed9f;
}

.quiz-btn-primary:disabled {
  background: #e5e5e5;
  color: #a4b0be;
  border-color: #a4b0be;
  box-shadow: 3px 3px 0px #a4b0be;
}

.quiz-btn-next {
  background: #70a1ff;
  color: #ffffff;
}

.quiz-btn-finish {
  background: #ffeb3b;
}

.quiz-btn-skip {
  background: #ffffff;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(47, 53, 66, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 20px;
  width: 90%;
  max-width: 360px;
  text-align: center;
  border: 2px solid #2f3542;
  box-shadow: 4px 4px 0px #2f3542;
}

.modal-title {
  font-size: 1.6rem;
  font-weight: 900;
  margin-top: 0;
  margin-bottom: 10px;
  color: #2f3542;
}

.modal-text {
  font-weight: 800;
  color: #57606f;
  margin-bottom: 20px;
}

.success-text {
  color: #2ed573;
}

.fail-text {
  color: #ff6b81;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  background: #fcf9f2;
  padding: 12px;
  border-radius: 12px;
  border: 2px dashed #2f3542;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  font-size: 1rem;
  font-weight: 900;
  color: #2f3542;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.modal-btn {
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: 2px solid #2f3542;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 3px 3px 0px #2f3542;
  transition: all 0.1s ease;
  color: #2f3542;
}

.modal-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px 0px #2f3542;
}

.modal-btn-continue {
  background: #7bed9f;
}

.modal-btn-exit {
  background: #ffeaa7;
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