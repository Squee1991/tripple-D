<template>
  <div class="quiz-app">
    <div class="quiz-app-container">
      <div v-if="loading" class="quiz-screen">
        <p class="loading-text">{{ t('dailyPanel.loading') }}</p>
      </div>
      <div v-else-if="currentTask" class="quiz-screen">
        <header class="study-nav">
          <button @click="handleExitTrigger" class="btn-icon-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div class="study-nav-progress">
            <div class="progress_exp-bar">
              <div class="progress__bar" :style="{ width: progressPercentage + '%' }">
                <div class="glare"></div>
              </div>
            </div>
          </div>
          <div>
            <span class="study-nav-counter">{{ currentTaskNumber }}/{{ totalTasksInTopic }}</span>
          </div>
        </header>
        <main class="study-main">
          <article class="quest-card">
            <section class="quest-card-audio">
              <div v-if="!isTaskChecked" class="quest-card-instruction-wrapper">
                <AudioButton
                    :key="'main-' + currentTask.id"
                    :level="currentLevel"
                    :topicId="currentTopic.id"
                    :fileName="currentTask.id + '_main'"
                    class="quest-card-mega-play"
                />
                <p class="quest-card-instruction">{{ t('imageDescription.listen') }}</p>
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
                <SoundBtn :text="optionText" class="quest-option-audio"/>
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
              <button v-if="!isTaskChecked"
                      @click="checkResult"
                      :disabled="!hasUserSelected"
                      class="quiz-btn quiz-btn-primary"
              >{{ t('imageDescription.check') }}
              </button>
              <div v-else class="quest-card-actions">
                <button v-if="!isLastTask" @click="goToNextTask" class="quiz-btn quiz-btn-next">
                  {{ t('imageDescription.further') }}
                </button>
                <button v-else @click="finishAndSave" class="quiz-btn quiz-btn-finish">
                  {{ t('imageDescription.finish') }}
                </button>
              </div>
              <button v-if="!isTaskChecked && canSkip" @click="skipTask" class="quiz-btn quiz-btn-skip">
                {{ t('imageDescription.skip') }}
              </button>
            </footer>
          </article>
        </main>
      </div>
      <ExitSessionModal
          :show="!!activeModal"
          @update:show="val => { if (!val) activeModal = null }"
          :text-class="modalData?.textClass"
          :icon="activeModal === 'exit' ? SadHedgehogIcon : null"
          @cancel="modalData?.onCancel"
          @confirm="modalData?.onConfirm"
      >
        <div v-if="activeModal === 'finish'" class="stats-grid">
          <div v-for="(val, key) in statsMap" :key="key" :class="['stat-item', 'stat-' + key]">
            <span v-if="key === 'total'">{{ t('imageDescription.total') }}</span>
            <span v-else-if="key === 'correct'">{{ t('imageDescription.perfect') }}</span>
            <span v-else-if="key === 'partial'">{{ t('imageDescription.notPerfect') }}</span>
            <span v-else-if="key === 'wrong'">{{ t('imageDescription.mistakes') }}</span>
            <span v-else-if="key === 'accuracy'">{{ t('imageDescription.value') }}</span>
            <b>{{ key === 'accuracy' ? val + '%' : val }}</b>
          </div>
        </div>
      </ExitSessionModal>
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
import ExitSessionModal from '../../src/components/V-stopSessionModal.vue'
import SadHedgehogIcon from '../../assets/images/Sadlyhedgehog.png'

const {t} = useI18n()
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
  if (res.status === 'success') return {class: 'is-success', text: t('imageDescription.success')}
  if (res.wrongCount > 0 || res.correctCount === 0) return {class: 'is-wrong', text: t('imageDescription.isWrong')}
  return {class: 'is-warning', text: t('imageDescription.isWarning')}
})

const statsMap = computed(() => {
  const total = sessionTasks.value.length;
  const acc = total > 0 ? Math.round((sessionStats.value.correct / total) * 100) : 0;
  return {
    total: total,
    correct: sessionStats.value.correct,
    partial: sessionStats.value.partial,
    wrong: sessionStats.value.wrong,
    accuracy: acc
  }
})

const modalData = computed(() => {
  if (activeModal.value === 'exit') return {
    title: t('imageDescription.modalTitleWarning'),
    text: t('imageDescription.modalTextWarning'),
    confirmLabel: t('imageDescription.leave'),
    cancelLabel: t('imageDescription.continue'),
    onConfirm: () => {
      stopAllAudio();
      router.push('/audio-tasks')
    },
    onCancel: () => activeModal.value = null
  }
  if (activeModal.value === 'finish') return {
    title: sessionStats.value.passed ? t('imageDescription.goodWork') : t('imageDescription.needTraining'),
    text: sessionStats.value.passed ? t('imageDescription.themeSuccess') : t('imageDescription.themeNotSuccess'),
    textClass: sessionStats.value.passed ? 'success-text' : 'fail-text',
    confirmLabel: t('trainerPage.repeat'),
    cancelLabel: t('sessionNotSuccessModal.back'),
    onConfirm: () => {
      activeModal.value = null;
      initializeSession()
    },
    onCancel: () => {
      activeModal.value = null;
      router.push('/audio-tasks')
    }
  }
  return null
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
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Nunito', sans-serif;
  color: #1e272e;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

.quiz-app-container {
  padding: 5px 10px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.quiz-screen {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.study-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.quest-card-instruction-wrapper {
  margin: auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  flex-shrink: 0;
}

.progress_exp-bar {
  width: 100%;
  height: 27px;
  background: #e8eae5;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background: #4ade80;
  transition: width .4s;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.glare {
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 4px
}

.study-nav-counter {
  position: relative;
  z-index: 1;
  font-weight: 900;
  font-size: 18px;
  color: var(--titleColor);
}

.study-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.quest-card {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  border-radius: 24px;
  padding: 10px;
  flex: 1;
  margin-bottom: 8px;
  min-height: 0;
}

.quest-card-audio {
  flex: 1;
  background: #f1f1f1;
  border-radius: 16px;
  padding: 10px;
  margin-bottom: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 2px 0 var(--tabsSlideBorderColor);
  overflow: hidden;
  min-height: 0;
}

.btn-icon-back {
  background: #fff;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  border-radius: 12px;
  width: 40px;
  height: 38px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.chat-flow {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 5px;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chat-flow::-webkit-scrollbar {
  display: none;
}

.quest-card-instruction {
  font-weight: 900;
  font-size: 16px;
  color: #1e272e;
  background: #ffffff;
  padding: 6px 12px;
  border-radius: 12px;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
}

.quest-card-mega-play {
  background: #48dbfb !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 34% !important;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
}

.quest-card-options,
.quest-feedback,
.quest-card-footer {
  flex-shrink: 0;
}

.quest-card-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.quest-option {
  display: flex;
  align-items: stretch;
  gap: 8px;
}

.quest-option-audio {
  flex-shrink: 0;
  width: 44px !important;
  height: 44px !important;
  padding: 0 4px;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  border-radius: 14px !important;
}

.quest-option-button {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  padding: 4px 7px;
  background: #ffffff;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s, background-color 0.2s;
}

.quest-option-button:active:not(:disabled) {
  transform: translate(2px, 3px);
  box-shadow: 0px 0px 0px #1e272e;
}

.quest-option-button.is-selected {
  background: #c7ecee;
}

.quest-option-button.is-correct {
  background: #b8e994;
}

.quest-option-button.is-missed {
  background: #f6e58d;
}

.quest-option-button.is-wrong {
  background: #ff7979;
}

.quest-option-check {
  width: 24px;
  height: 24px;
  min-width: 24px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 8px;
  margin-right: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  background: #ffffff;
  font-size: 14px;
}

.is-selected .quest-option-check,
.is-wrong .quest-option-check,
.is-missed .quest-option-check {
  background: #1e272e;
  color: #ffffff;
}

.quest-option-text {
  font-weight: 800;
  font-size: 14px;
  line-height: 1.2;
}

.quest-feedback {
  text-align: center;
  margin-bottom: 8px;
  padding: 6px;
  border-radius: 16px;
  background: #ffffff;
}

.quest-feedback.is-success {
  background: #b8e994;
}

.quest-feedback.is-warning {
  background: #f6e58d;
}

.quest-feedback.is-wrong {
  background: #ff7979;
}

.quest-feedback-text {
  font-weight: 900;
  font-size: 15px;
}

.chat-bubble {
  padding: 5px 12px;
  border-radius: 16px;
  max-width: 90%;
  border: 3px solid #1e272e;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.3;
}

.chat-bubble-male {
  align-self: flex-start;
  background: #ffffff;
  text-align: left;
  box-shadow: 3px 3px 0px #1e272e;
  border-bottom-left-radius: 4px;
}

.chat-bubble-female {
  align-self: flex-end;
  text-align: left;
  background: #c7ecee;
  box-shadow: -2px 2px 0px #1e272e;
  border-bottom-right-radius: 4px;
}

.quiz-btn {
  width: 100%;
  padding: 6px;
  border-radius: 18px;
  font-weight: 900;
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.quiz-btn:active:not(:disabled) {
  transform: translate(3px, 4px);
  box-shadow: 0px 0px 0px #1e272e;
}

.quiz-btn-primary:disabled {
  background: #dcdde1;
  color: #718093;
  border-color: #718093;
  box-shadow: 3px 4px 0px #718093;
  cursor: not-allowed;
}

.quiz-btn-primary {
  background-color: #58cc02 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 4px 0 #46a302 !important;
}

.quiz-btn-next {
  background-color: #1cb0f6 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 4px 0 #1899d6 !important;
}

.quiz-btn-finish {
  background-color: #ffc800 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 4px 0 #e5a400 !important;
}

.quiz-btn-skip {
  background-color: #ffffff !important;
  color: #afafaf !important;
  border: 2px solid #e5e5e5 !important;
  box-shadow: 0 2px 0 #e5e5e5 !important;
}

.quest-card-footer {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.quest-card-actions {
  width: 100%;
}

.success-text {
  color: #2ed573;
}

.fail-text {
  color: #ff4757;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  background: #f1f2f6;
  padding: 16px;
  border-radius: 16px;
  border: 3px solid #1e272e;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 900;
  font-size: 14px;
  border-bottom: 2px dashed #dcdde1;
  padding-bottom: 4px;
}

.stat-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
  margin-top: 4px;
  font-size: 16px;
  color: #ff6b81;
}

.quiz-expand-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 1;
}

.study-nav-progress {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 6px;
}

.quiz-expand-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.loading-text {
  text-align: center;
  font-weight: 900;
  font-size: 18px;
  margin-top: 40px;
}
</style>