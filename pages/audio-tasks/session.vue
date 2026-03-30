<template>
  <div class="quiz-app">
    <div class="quiz-app-container">
      <div v-if="loading" class="quiz-screen">
        <p class="loading-text">Загрузка...</p>
      </div>
      <div v-else-if="currentTask" class="quiz-screen">
        <header class="study-nav">
          <button @click="handleExitTrigger" class="study-nav-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div class="study-nav-progress">
            <div class="progress-bar">
              <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
              <span class="study-nav-counter">{{ currentTaskNumber }}/{{ totalTasksInTopic }}</span>
            </div>
          </div>
        </header>
        <main class="study-main">
          <article class="quest-card">
            <section class="quest-card-audio">
              <div class="quest-card-instruction-wrapper">
                <AudioButton
                    :key="'main-' + currentTask.id"
                    :level="currentLevel"
                    :topicId="currentTopic.id"
                    :fileName="currentTask.id + '_main'"
                    class="quest-card-mega-play"
                />
                <p class="quest-card-instruction">Прослушайте диалог!</p>
              </div>
              <transition name="quiz-expand">
                <div v-if="isTaskChecked" class="chat-flow">
                  <div v-for="(line, idx) in currentTask.dialogue"
                       :key="idx"
                       :class="['chat-bubble', 'chat-bubble-' + line.gender.toLowerCase()]">
                    <p class="chat-bubble-text">{{ line.text }}</p>
                  </div>
                </div>
              </transition>
            </section>
            <div class="quest-card-options">
              <div v-for="(optionText, index) in currentTask.options" :key="index" class="quest-option">
                <SoundBtn :content="optionText" class="quest-option-audio"/>
                <button @click="handleOptionSelection(index)"
                        :disabled="isTaskChecked"
                        :class="getOptionClasses(index)">
                  <div class="quest-option-check">
                    <template v-if="isOptionSelected(index)">
                      <span v-if="isTaskChecked && !currentTask.correctIndices.includes(index)">✖</span>
                      <span v-else>✓</span>
                    </template>
                    <template v-else-if="isTaskChecked && currentTask.correctIndices.includes(index)">
                      <span>!</span>
                    </template>
                  </div>
                  <div class="quest-option-text">{{ optionText }}</div>
                </button>
              </div>
            </div>
            <div v-if="feedback" :class="['quest-feedback', feedback.class]">
              <p class="quest-feedback-text">{{ feedback.text }}</p>
            </div>
            <footer class="quest-card-footer">
              <button v-if="!isTaskChecked" @click="checkResult" :disabled="!hasUserSelected"
                      class="quiz-btn quiz-btn-primary">ПРОВЕРИТЬ
              </button>
              <div v-else class="quest-card-actions">
                <button v-if="!isLastTask" @click="goToNextTask" class="quiz-btn quiz-btn-next">ДАЛЬШЕ</button>
                <button v-else @click="finishAndSave" class="quiz-btn quiz-btn-finish">ФИНИШ 🏆</button>
              </div>
              <button v-if="!isTaskChecked && canSkip" @click="skipTask" class="quiz-btn quiz-btn-skip">ПРОПУСТИТЬ
              </button>
            </footer>
          </article>
        </main>
      </div>
      <div v-if="activeModal" class="modal-overlay">
        <div class="modal-card">
          <h3 class="modal-title">{{ modalData.title }}</h3>
          <p :class="['modal-text', modalData.textClass]">{{ modalData.text }}</p>
          <div v-if="activeModal === 'finish'" class="stats-grid">
            <div v-for="(val, key) in statsMap" :key="key" :class="['stat-item', 'stat-' + key]">
              <span>{{ key === 'correct' ? 'Верно' : key === 'partial' ? 'Частично' : 'Неверно' }}:</span>
              <b>{{ val }}</b>
            </div>
          </div>
          <div class="modal-actions">
            <button @click="modalData.onConfirm" class="modal-btn modal-btn-confirm">{{
                modalData.confirmLabel
              }}
            </button>
            <button @click="modalData.onCancel" class="modal-btn modal-btn-cancel">{{ modalData.cancelLabel }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import {storeToRefs} from 'pinia'
import {useAudioTaskStore} from '../../store/audioTaskStore.js'
import AudioButton from '../../src/components/AudioBtn.vue'
import SoundBtn from '../../src/components/soundBtn.vue'

const router = useRouter()
const store = useAudioTaskStore()
const {allTasks, currentLevel, currentTopicId, loading, userProgress} = storeToRefs(store)

const currentTopic = ref(null)
const sessionTasks = ref([])
const currentIndex = ref(0)
const userSelections = ref({})
const taskResults = ref({})
const activeModal = ref(null)
const sessionStats = ref({correct: 0, partial: 0, wrong: 0, passed: false})

const progressPercentage = computed(() => {
  if (!sessionTasks.value.length) return 0
  if (isLastTask.value && isTaskChecked.value) return 100
  return (currentIndex.value / sessionTasks.value.length) * 100
})

const currentTask = computed(() => sessionTasks.value[currentIndex.value])
const isTaskChecked = computed(() => taskResults.value[currentTask.value?.id]?.checked)
const isLastTask = computed(() => currentIndex.value >= sessionTasks.value.length - 1)
const totalTasksInTopic = computed(() => sessionTasks.value.length)
const currentTaskNumber = computed(() => currentIndex.value + 1)
const hasUserSelected = computed(() => (userSelections.value[currentTask.value?.id]?.length || 0) > 0)
const canSkip = computed(() => userProgress.value[currentTopic.value?.id]?.[currentTask.value?.id] === 'success')

const feedback = computed(() => {
  const res = taskResults.value[currentTask.value?.id]
  if (!res?.checked) return null
  if (res.status === 'success') return {class: 'is-success', text: '✅ Задание выполнено верно!'}
  if (res.wrongCount > 0 || res.correctCount === 0) return {class: 'is-wrong', text: '❌ Есть неверные ответы!'}
  return {class: 'is-warning', text: '⚠️ Выбраны не все верные варианты!'}
})

const statsMap = computed(() => ({
  correct: sessionStats.value.correct,
  partial: sessionStats.value.partial,
  wrong: sessionStats.value.wrong
}))

const modalData = computed(() => {
  if (activeModal.value === 'exit') return {
    title: 'Внимание!',
    text: 'Тема не пройдена полностью, прогресс не будет сохранен.',
    confirmLabel: 'Выйти',
    cancelLabel: 'Продолжить',
    onConfirm: () => {
      stopAllAudio();
      router.push('/audio-tasks')
    },
    onCancel: () => activeModal.value = null
  }
  return {
    title: sessionStats.value.passed ? 'Отличная работа! 🏆' : 'Нужно потренироваться! 🏋️',
    text: sessionStats.value.passed ? 'Тема пройдена успешно!' : 'Тема не пройдена.',
    textClass: sessionStats.value.passed ? 'success-text' : 'fail-text',
    confirmLabel: 'Повторить',
    cancelLabel: 'Назад',
    onConfirm: () => {
      activeModal.value = null;
      initializeSession()
    },
    onCancel: () => {
      activeModal.value = null;
      router.push('/audio-tasks')
    }
  }
})

const stopAllAudio = () => {
  document.querySelectorAll('audio').forEach(a => {
    a.pause();
    a.currentTime = 0;
  })
  window.dispatchEvent(new Event('stop-all-audio'))
}

const handleExitTrigger = () => {
  if (currentIndex.value > 0 || isTaskChecked.value) activeModal.value = 'exit'
  else {
    stopAllAudio();
    router.push('/audio-tasks')
  }
}

const handleOptionSelection = (idx) => {
  const id = currentTask.value.id
  if (!userSelections.value[id]) userSelections.value[id] = []
  const current = userSelections.value[id]
  userSelections.value[id] = current.includes(idx) ? current.filter(i => i !== idx) : [...current, idx]
}

const isOptionSelected = (idx) => userSelections.value[currentTask.value?.id]?.includes(idx)

const getOptionClasses = (idx) => {
  const isCorrect = currentTask.value.correctIndices.includes(idx)
  const isSelected = isOptionSelected(idx)
  let cls = 'quest-option-button'
  if (isSelected) cls += ' is-selected'
  if (isTaskChecked.value) {
    if (isSelected && isCorrect) cls += ' is-correct'
    else if (!isSelected && isCorrect) cls += ' is-missed'
    else if (isSelected && !isCorrect) cls += ' is-wrong'
  }
  return cls
}

const checkResult = () => {
  const task = currentTask.value
  const sel = userSelections.value[task.id] || []
  const corr = task.correctIndices
  const cCount = sel.filter(i => corr.includes(i)).length
  const wCount = sel.filter(i => !corr.includes(i)).length
  taskResults.value[task.id] = {
    checked: true,
    status: (cCount === corr.length && wCount === 0) ? 'success' : 'wrong',
    wrongCount: wCount,
    correctCount: cCount,
    missedCount: corr.length - cCount
  }
}

const goToNextTask = () => {
  stopAllAudio();
  currentIndex.value++
}
const skipTask = () => isLastTask.value ? finishAndSave() : goToNextTask()

const finishAndSave = async () => {
  stopAllAudio()
  let c = 0, p = 0, w = 0
  const results = {}
  sessionTasks.value.forEach(t => {
    const r = taskResults.value[t.id]
    if (r?.status === 'success') {
      c++;
      results[t.id] = 'success'
    } else if (r?.wrongCount > 0 || r?.correctCount === 0) {
      w++;
      results[t.id] = 'wrong'
    } else if (r?.missedCount > 0) {
      p++;
      results[t.id] = 'partial'
    }
  })
  sessionStats.value = {correct: c, partial: p, wrong: w, passed: c >= Math.ceil(sessionTasks.value.length * 0.8)}
  await store.saveTopicProgress(currentTopic.value.id, results)
  activeModal.value = 'finish'
}

const initializeSession = () => {
  const topics = allTasks.value[currentLevel.value] || []
  currentTopic.value = topics.find(t => t.id === currentTopicId.value)
  if (!currentTopic.value) return router.push('/audio-tasks')
  currentIndex.value = 0
  userSelections.value = {}
  taskResults.value = {}
  const prog = userProgress.value[currentTopic.value.id] || {}
  const tasks = currentTopic.value.tasks
  const toPlay = tasks.some(t => prog[t.id] !== 'success') ? tasks.filter(t => prog[t.id] !== 'success') : [...tasks]
  sessionTasks.value = toPlay.sort(() => Math.random() - 0.5)
}

onMounted(async () => {
  if (!currentTopicId.value) return router.push('/audio-tasks')
  await store.fetchTasks();
  await store.loadUserProgress();
  initializeSession()
})
onUnmounted(stopAllAudio)
watch(currentIndex, stopAllAudio)

</script>

<style scoped>
.quiz-app {
  min-height: 100vh;
  padding: 8px;
  font-family: 'Nunito', sans-serif;
  color: #2f3542;
}

.quiz-app-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

.study-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 7px;
}

.quest-card-instruction-wrapper {
  display: flex;
  align-items: center;
}

.study-nav-back {
  background: #ffeaa7;
  width: 60px;
  border-radius: 12px;
  border: 2px solid #2f3542;
  box-shadow: 2px 2px 0px #2f3542;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  padding: 1px;
  align-items: center;
  justify-content: center;
}

.study-nav-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px;
}

.progress-bar {
  flex-grow: 1;
  position: relative;
  height: 26px;
  background: #ffffff;
  border-radius: 12px;
  border: 2px solid #2f3542;
  box-shadow: 2px 2px 0px #2f3542;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #7bed9f;
  transition: width 0.4s ease;
  border-right: 1px solid #2f3542;
}

.study-nav-counter {
  position: relative;
  z-index: 1;
  font-weight: 900;
  font-size: 1.1rem;
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.5);
}

.quest-card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 2px solid #2f3542;
  border-radius: 20px;
  box-shadow: 4px 4px 0px #2f3542;
  padding: 7px;
  height: calc(100vh - 53px);
}

.quest-card-audio {
  flex: 1;
  background: #fdfdfd;
  border: 2px dashed #2f3542;
  border-radius: 16px;
  padding: 5px;
  margin-bottom: 5px;
  text-align: center;
}

.quest-card-instruction {
  font-weight: 900;
  color: #70a1ff;
}

.quest-card-mega-play {
  background: #70a1ff !important;
  width: 50px !important;
  height: 42px !important;
  border-radius: 50% !important;
  border: 2px solid #2f3542 !important;
  box-shadow: 3px 3px 0px #2f3542 !important;
  margin-right: 10px;
}

.quest-card-options {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}

.quest-option {
  display: flex;
  align-items: center;
  gap: 5px;
}

.quest-option-audio {
  flex-shrink: 0;
  width: 39px !important;
  height: 39px !important;
  background: #ffffff !important;
  border: 2px solid #2f3542 !important;
  box-shadow: 2px 2px 0px #2f3542 !important;
  border-radius: 12px !important;
}

.quest-option-button {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  padding: 6px 9px;
  background: #ffffff;
  border: 2px solid #2f3542;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 2px 2px 0px #2f3542;
  transition: 0.1s;
}

.quest-option-button:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px;
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
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  background: #ffffff;
}

.is-selected .quest-option-check, .is-wrong .quest-option-check, .is-missed .quest-option-check {
  background: #2f3542;
  color: #ffffff;
}

.quest-option-text {
  font-weight: 800;
  font-size: 0.9rem;
}

.quest-feedback {
  text-align: center;
  margin-bottom: 7px;
  padding: 3px;
  border-radius: 12px;
  border: 4px dashed #2f3542;
}

.quest-feedback.is-success {
  border-color: #7bed9f;
}

.quest-feedback.is-warning {
  border-color: #ffa707;
}

.quest-feedback.is-wrong {
  border-color: #ff6b81;
}

.quest-feedback-text {
  font-weight: 900;
}

.chat-flow {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.chat-bubble {
  padding: 4px 6px;
  border-radius: 10px;
  max-width: 95%;
  border: 2px solid #2f3542;
  font-size: 13px;
  font-weight: 700;
}

.chat-bubble-male {
  align-self: flex-start;
  background: #ffffff;
  text-align: start;
  box-shadow: 2px 2px 0px #2f3542;
}

.chat-bubble-female {
  align-self: flex-end;
  text-align: start;
  background: #dff9fb;
  box-shadow: -2px 2px 0px #2f3542;
}

.quiz-btn {
  width: 100%;
  padding: 8px;
  border-radius: 14px;
  border: 2px solid #2f3542;
  font-weight: 900;
  text-transform: uppercase;
  box-shadow: 3px 3px 0px #2f3542;
  cursor: pointer;
  transition: 0.1s;
}

.quiz-btn:active:not(:disabled) {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px 0px;
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
  height: 40px;
  padding: 5px;
  font-size: 0.8rem;
}

.quest-card-footer {
  display: flex;
  gap: 10px;
}

.quest-card-actions {
  width: 100%;
}

.modal-overlay {
  position: fixed;
  inset: 0;
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
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 10px;
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
  font-weight: 900;
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
  cursor: pointer;
  box-shadow: 3px 3px 0px #2f3542;
}

.modal-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px;
}

.modal-btn-confirm {
  background: #7bed9f;
}

.modal-btn-cancel {
  background: #ffeaa7;
}

.quiz-expand-enter-active {
  transition: all 0.4s ease;
  max-height: 800px;
  overflow: hidden;
}

.study-nav-progress {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 5px;
}

.quiz-expand-enter-from {
  opacity: 0;
  max-height: 0;
}

.loading-text {
  text-align: center;
  font-weight: bold;
}
</style>