<template>
  <div class="quiz-app"
       @touchstart="handleTouchStart"
       @touchmove="handleTouchMove"
       @touchend="handleTouchEnd"
  >
    <transition name="toast-fade">
      <VHeadsUp v-if="showEmptyWarning" :text="t('headUp.audioTasks')"/>
    </transition>
    <div class="mini-salute-container" v-if="miniConfettiParticles.length > 0">
      <div v-for="particle in miniConfettiParticles" :key="particle.id" class="mini-confetti-piece"
           :style="{
             left: particle.left + '%',
             backgroundColor: particle.color,
             animationDelay: particle.delay + 's',
             animationDuration: particle.duration + 's',
             width: particle.width + 'px',
             height: particle.height + 'px'
           }">
      </div>
    </div>
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
                  <div v-for="(dialogueLine, index) in currentTask.dialogue"
                       :key="index"
                       :class="['chat-bubble', 'chat-bubble-' + dialogueLine.gender.toLowerCase()]">
                    <p class="chat-bubble-text">{{ dialogueLine.text }}</p>
                  </div>
                </div>
              </transition>
            </section>
            <div class="quest-card-options">
              <div v-for="(optionText, optionIndex) in currentTask.options" :key="optionIndex" class="quest-option">
                <SoundBtn :text="optionText" class="quest-option-audio"/>
                <button @click="handleOptionSelection(optionIndex)"
                        :disabled="isTaskChecked"
                        :class="getOptionClasses(optionIndex)">
                  <div class="quest-option-check">
                    <template v-if="isOptionSelected(optionIndex)">
                      <span v-if="isTaskChecked && !currentTask.correctIndices.includes(optionIndex)">✖</span>
                      <span v-else>✓</span>
                    </template>
                    <template v-else-if="isTaskChecked && currentTask.correctIndices.includes(optionIndex)">
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
              <button v-if="!isTaskChecked && canSkipTask" @click="skipCurrentTask" class="quiz-btn quiz-btn-skip">
                {{ t('imageDescription.skip') }}
              </button>
            </footer>
          </article>
        </main>
      </div>
      <ExitSessionModal
          :animation-data="HedgehogLeaveSession"
          :show="activeModal === 'exit'"
          @update:show="updateActiveModal"
          :text-class="modalData?.textClass"
          @cancel="modalData?.onCancel"
          @confirm="modalData?.onConfirm"
      />
      <VQuestResultScreen
          :finished="activeModal === 'finish'"
          :has-mistakes="sessionStats.wrong > 0 || sessionStats.partial > 0"
          :previously-cleared="previouslyCleared"
          :anim-step="animStep"
          :display-xp="displayXp"
          :display-coins="displayCoins"
          :confetti-particles="confettiParticles"
          :has-next-quest="hasNextPart"
          @next="goNextPart"
          @themes="goThemes"
          @retry-mistakes="retryMistakes"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, computed, onMounted, onUnmounted, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {storeToRefs} from 'pinia'
import {useAudioTaskStore} from '~/store/audioTaskStore.js'
import {userlangStore} from '~/store/learningStore.js'
import AudioButton from '~/src/components/AudioBtn.vue'
import SoundBtn from '~/src/components/soundBtn.vue'
import ExitSessionModal from '~/src/components/V-stopSessionModal.vue'
import VQuestResultScreen from '~/src/components/V-QuestResultScreen.vue'
import {useSwipeBack} from '~/composables/useSwipeBack.js'
import {useQuestAnimations} from '~/composables/useQuestAnimations.js'
import {playCorrect, playWrong, playLevelCompleted, unlockAudioByUserGesture} from '~/utils/soundManager.js'
import {showInterstitial} from '~/utils/admob.js'
import VHeadsUp from "~/src/components/V-headsUp.vue"
import HedgehogLeaveSession from '~/assets/animation/hedgehog_leave_session.json'
const {t} = useI18n()
const router = useRouter()
const route = useRoute()
const store = useAudioTaskStore()
const langStore = userlangStore()

const {allTasks, currentLevel, currentTopicId, loading, userProgress} = storeToRefs(store)

const showEmptyWarning = ref(false)
const currentTopic = ref(null)
const sessionTasks = ref([])
const currentIndex = ref(0)
const userSelections = ref({})
const taskResults = ref({})
const activeModal = ref(null)
const consecutiveCorrectCount = ref(0)
const sessionStartTime = ref(0)
const previouslyCleared = ref(false)

const sessionStats = ref({
  correct: 0,
  partial: 0,
  wrong: 0,
  passed: false
})

const animQuestStore = reactive({
  hasMistakes: false,
  quest: {
    rewards: {
      xp: 5,
      points: 5
    }
  }
})

const shouldShowResultScreen = computed(() => activeModal.value === 'finish')

const {
  animStep,
  displayCoins,
  displayXp,
  confettiParticles,
  miniConfettiParticles,
  spawnMiniConfetti,
  resetAnimations
} = useQuestAnimations(animQuestStore, previouslyCleared, shouldShowResultScreen)

const {$track} = useNuxtApp()

const {handleTouchStart, handleTouchMove, handleTouchEnd} = useSwipeBack(() => {
  handleExitTrigger()
}, {
  ignoreSelector: '.chat-flow, .quest-option-button, .quiz-btn, .quest-option'
})

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
const canSkipTask = computed(() => userProgress.value[currentTopic.value?.id]?.[currentTask.value?.id] === 'success')

const hasNextPart = computed(() => {
  if (!currentTopic.value?.tasks) return false
  const currentPartNumber = Number(route.query.part) || 1
  const chunkSize = 10
  return currentTopic.value.tasks.length > currentPartNumber * chunkSize
})

const feedback = computed(() => {
  const resultData = taskResults.value[currentTask.value?.id]
  if (!resultData?.checked) return null
  if (resultData.status === 'success') {
    return {class: 'is-success', text: t('imageDescription.success')}
  }
  if (resultData.wrongCount > 0 || resultData.correctCount === 0) {
    return {class: 'is-wrong', text: t('imageDescription.isWrong')}
  }
  return {class: 'is-warning', text: t('imageDescription.isWarning')}
})

const modalData = computed(() => {
  if (activeModal.value === 'exit') {
    return {
      title: t('imageDescription.modalTitleWarning'),
      text: t('imageDescription.modalTextWarning'),
      confirmLabel: t('imageDescription.leave'),
      cancelLabel: t('imageDescription.continue'),
      onConfirm: () => {
        const durationSeconds = Math.round((Date.now() - sessionStartTime.value) / 1000)
        $track('audio_session_abandoned', {
          topic_id: currentTopic.value?.id,
          duration_seconds: durationSeconds,
          completed_tasks: currentIndex.value,
          total_tasks: sessionTasks.value.length
        })
        stopAllAudio()
        router.push('/audio-tasks')
      },
      onCancel: () => {
        activeModal.value = null
      }
    }
  }
  return null
})

const updateActiveModal = (isModalActive) => {
  if (!isModalActive) {
    activeModal.value = null
  }
}

const stopAllAudio = () => {
  document.querySelectorAll('audio').forEach(audioElement => {
    audioElement.pause()
    audioElement.currentTime = 0
  })
  window.dispatchEvent(new Event('stop-all-audio'))
}

const handleExitTrigger = () => {
  if (currentIndex.value > 0 || isTaskChecked.value) {
    activeModal.value = 'exit'
  } else {
    stopAllAudio()
    router.push('/audio-tasks')
  }
}

const handleOptionSelection = (optionIndex) => {
  const taskId = currentTask.value.id
  if (!userSelections.value[taskId]) {
    userSelections.value[taskId] = []
  }

  const currentSelections = userSelections.value[taskId]
  if (currentSelections.includes(optionIndex)) {
    userSelections.value[taskId] = currentSelections.filter(index => index !== optionIndex)
  } else {
    userSelections.value[taskId] = [...currentSelections, optionIndex]
  }
}

const isOptionSelected = (optionIndex) => {
  return userSelections.value[currentTask.value?.id]?.includes(optionIndex)
}

const getOptionClasses = (optionIndex) => {
  const isCorrectOption = currentTask.value.correctIndices.includes(optionIndex)
  const isSelectedOption = isOptionSelected(optionIndex)

  let baseClass = 'quest-option-button'

  if (isSelectedOption) {
    baseClass += ' is-selected'
  }

  if (isTaskChecked.value) {
    if (isSelectedOption && isCorrectOption) {
      baseClass += ' is-correct'
    } else if (!isSelectedOption && isCorrectOption) {
      baseClass += ' is-missed'
    } else if (isSelectedOption && !isCorrectOption) {
      baseClass += ' is-wrong'
    }
  }

  return baseClass
}

const checkResult = () => {
  unlockAudioByUserGesture()

  if (!hasUserSelected.value) {
    showEmptyWarning.value = true
    setTimeout(() => {
      showEmptyWarning.value = false
    }, 2000)
    return
  }

  const activeTask = currentTask.value
  const selectedOptions = userSelections.value[activeTask.id] || []
  const correctOptions = activeTask.correctIndices

  const correctSelectionsCount = selectedOptions.filter(index => correctOptions.includes(index)).length
  const wrongSelectionsCount = selectedOptions.filter(index => !correctOptions.includes(index)).length
  const isFullyCorrect = (correctSelectionsCount === correctOptions.length && wrongSelectionsCount === 0)

  taskResults.value[activeTask.id] = {
    checked: true,
    status: isFullyCorrect ? 'success' : 'wrong',
    wrongCount: wrongSelectionsCount,
    correctCount: correctSelectionsCount,
    missedCount: correctOptions.length - correctSelectionsCount
  }

  if (isFullyCorrect) {
    playCorrect()
    consecutiveCorrectCount.value++
    if (consecutiveCorrectCount.value === 5) {
      spawnMiniConfetti()
      consecutiveCorrectCount.value = 0
    }
  } else {
    playWrong()
    consecutiveCorrectCount.value = 0
  }

  $track('audio_task_answered', {
    topic_id: currentTopic.value?.id,
    task_id: activeTask.id,
    is_correct: isFullyCorrect,
    task_index: currentIndex.value
  })
}

const goToNextTask = () => {
  stopAllAudio()
  currentIndex.value++
}

const skipCurrentTask = () => {
  if (isLastTask.value) {
    finishAndSave()
  } else {
    goToNextTask()
  }
}

const finishAndSave = async () => {
  stopAllAudio()

  let correctAnswersCount = 0
  let partialAnswersCount = 0
  let wrongAnswersCount = 0
  const finalTaskResults = {}

  sessionTasks.value.forEach(task => {
    const resultData = taskResults.value[task.id]

    if (resultData?.status === 'success') {
      correctAnswersCount++
      finalTaskResults[task.id] = 'success'
    } else if (resultData?.wrongCount > 0 || resultData?.correctCount === 0) {
      wrongAnswersCount++
      finalTaskResults[task.id] = 'wrong'
    } else if (resultData?.missedCount > 0) {
      partialAnswersCount++
      finalTaskResults[task.id] = 'partial'
    }
  })

  const requiredPassScore = Math.ceil(sessionTasks.value.length * 0.8)
  const isSessionPassed = correctAnswersCount >= requiredPassScore

  sessionStats.value = {
    correct: correctAnswersCount,
    partial: partialAnswersCount,
    wrong: wrongAnswersCount,
    passed: isSessionPassed
  }

  animQuestStore.hasMistakes = wrongAnswersCount > 0 || partialAnswersCount > 0

  await store.saveTopicProgress(currentTopic.value.id, finalTaskResults)

  if (isSessionPassed) {
    langStore.exp += 5
    langStore.handleLeveling()
    await langStore.addPoints(5)
    playLevelCompleted()
  }

  const durationSeconds = Math.round((Date.now() - sessionStartTime.value) / 1000)

  $track('audio_session_finished', {
    topic_id: currentTopic.value?.id,
    passed: isSessionPassed,
    correct_count: correctAnswersCount,
    duration_seconds: durationSeconds
  })

  activeModal.value = 'finish'
}

const goNextPart = () => {
  activeModal.value = null
  if (hasNextPart.value) {
    const nextPartNumber = (Number(route.query.part) || 1) + 1
    router.replace({path: '/audio-tasks/session', query: {part: nextPartNumber}}).then(() => {
      initializeSession()
    })
  } else {
    goThemes()
  }
}

const goThemes = () => {
  activeModal.value = null
  router.push('/audio-tasks')
}

const retryMistakes = () => {
  activeModal.value = null
  initializeSession()
}

const initializeSession = () => {
  const availableTopics = allTasks.value[currentLevel.value] || []
  const foundTopic = availableTopics.find(topic => topic.id === currentTopicId.value)

  if (!foundTopic) {
    return router.push('/audio-tasks')
  }
  currentTopic.value = foundTopic

  currentIndex.value = 0
  userSelections.value = {}
  taskResults.value = {}
  consecutiveCorrectCount.value = 0
  resetAnimations()

  const currentPartNumber = Number(route.query.part) || 1
  const chunkSize = 10
  const startIndex = (currentPartNumber - 1) * chunkSize

  const allTopicTasks = currentTopic.value.tasks || []
  const currentPartTasks = allTopicTasks.slice(startIndex, startIndex + chunkSize)

  const userTopicProgress = userProgress.value[currentTopic.value.id] || {}
  const hasUncompletedTasks = currentPartTasks.some(task => userTopicProgress[task.id] !== 'success')

  let tasksToPlay = currentPartTasks
  if (hasUncompletedTasks) {
    tasksToPlay = currentPartTasks.filter(task => userTopicProgress[task.id] !== 'success')
  }

  sessionTasks.value = [...tasksToPlay].sort(() => Math.random() - 0.5)

  sessionStartTime.value = Date.now()

  $track('audio_session_started', {
    topic_id: currentTopic.value.id,
    level: currentLevel.value,
    part: currentPartNumber,
    total_tasks: sessionTasks.value.length
  })
}

onMounted(async () => {
  if (!currentTopicId.value) {
    return router.push('/audio-tasks')
  }

  await store.fetchTasks()
  await store.loadUserProgress()

  showInterstitial(() => {
    initializeSession()
  })
})

onUnmounted(stopAllAudio)
watch(currentIndex, stopAllAudio)
</script>

<style scoped>
.quiz-app {
  height: 100vh;
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
  flex-direction: column;
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
  padding: 6px 12px;
}

.quest-card-mega-play {
  background: #48dbfb !important;
  width: 80px !important;
  height: 64px !important;
  border-radius: 35% !important;
  border: none;
  box-shadow: 0 6px 0 #2297b0;
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
  padding: 10px;
  border-radius: 50px;
  font-weight: 900;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.quiz-btn:active:not(:disabled) {
  transform: translateY(2px);
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
  box-shadow: 0 6px 0 #46a302 !important;
}

.quiz-btn-next {
  background-color: #1cb0f6 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 6px 0 #1899d6 !important;
}

.quiz-btn-finish {
  background-color: #ffc800 !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 6px 0 #e5a400 !important;
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

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-100%)
}

.mini-salute-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 99999;
}

.mini-confetti-piece {
  position: absolute;
  top: -30px;
  opacity: 0;
  border-radius: 3px;
  animation: miniConfettiFall linear forwards;
  will-change: transform, opacity;
}

@keyframes miniConfettiFall {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg) scale(0.6);
    opacity: 0;
  }
}
</style>