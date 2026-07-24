<script setup>
import {ref, computed, onMounted, watch} from "vue"
import {useRoute, useRouter} from "vue-router"
import {useI18n} from "vue-i18n"
import {userExamStore} from "../../../store/examStore"
import SoundBtn from "~/src/components/soundBtn.vue"
import VoiceRecorder from "~/src/components/VoiceRecorder.vue"
import {useGroqCheckHomeWork} from "~/composables/useGroqCheck.js"
import {useSeoMeta} from "#imports"

useSeoMeta({robots: "noindex, follow"})

const route = useRoute()
const router = useRouter()
const {locale: i18nLocale , t} = useI18n()

const examStore = userExamStore()
const userInput = ref("")
const level = ref("")
const isIntroVisible = ref(true)
const isRecording = ref(false)
const isLeaveModalOpen = ref(false)
const isSubmitting = ref(false)

const currentExercise = computed(() => examStore.currentExercise)
const isExamFinished = computed(() => examStore.isFinished)
const showHeader = computed(() => isIntroVisible.value || (!isIntroVisible.value && !isExamFinished.value))

const startExam = async () => {
  isIntroVisible.value = false
  await examStore.startAttempt({level: level.value, locale: i18nLocale.value})
}

const onAudioRecorded = async ({blob, durationSec}) => {
  const exerciseId = currentExercise.value?.id
  if (!exerciseId || !blob) return
  await examStore.uploadSpeakingAudio({exerciseId, blob, durationSec, transcription: ""})
}

const submitTextAnswer = async () => {
  const answer = (userInput.value || "").trim()
  if (!answer || isSubmitting.value) return
  isSubmitting.value = true
  try {
    const feedback = await useGroqCheckHomeWork({
      task: currentExercise.value.task,
      answer,
      level: level.value,
      locale: i18nLocale.value
    })
    await examStore.answerCurrent(answer, feedback)
    userInput.value = ""
  } finally {
    isSubmitting.value = false
  }
}

const submitTranscription = async (text) => {
  const answer = (text || "").trim()
  if (!answer || isSubmitting.value) return
  const task = currentExercise.value?.task
  if (!task) return
  isSubmitting.value = true
  try {
    const feedback = await useGroqCheckHomeWork({
      task,
      answer,
      level: level.value,
      locale: i18nLocale.value
    })
    await examStore.answerCurrent(answer, feedback)
  } finally {
    isSubmitting.value = false
  }
}

const leaveExamConfirmed = async () => {
  isLeaveModalOpen.value = false
  await examStore.abortAttempt()
  router.push("/exams")
}

watch(isExamFinished, async (done) => {
  if (!done) return
  await examStore.finalizeAttemptAndSave()
})

const examResult = computed(() => {
  const scoreMap = {
    "ausgezeichnet": 10, "fast perfekt": 9, "gut": 8, "kleine fehler": 7,
    "mittelmäßig": 6, "okay": 5, "viele fehler": 4, "muss verbessert werden": 3,
    "schlecht": 2, "sehr schlecht": 1, "keine antwort": 0,
  }

  const allResults = examStore.userAnswers.map(answer => {
    const exercise = examStore.exercises.find(e => e.id === answer.id)
    if (!exercise) return null
    let score = 0
    if (exercise.type === "multiple-choice" || exercise.type === "audio-choice") {
      score = answer.correct ? 10 : 0
    } else if (exercise.type === "text-input" || exercise.type === "speaking-prompt") {
      score = scoreMap[answer.feedback?.result?.toLowerCase()] ?? 0
    }
    return {
      id: answer.id,
      module: exercise.title || "Unbekannt",
      score,
      taskText: exercise.task?.instruction || exercise.task?.prompt,
      question: exercise.task?.question,
      answer: answer.answer,
      feedback: answer.feedback,
      type: exercise.type,
    }
  }).filter(Boolean)

  const grouped = allResults.reduce((acc, result) => {
    const moduleName = result.module
    if (!acc[moduleName]) acc[moduleName] = {items: [], totalScore: 0}
    acc[moduleName].items.push(result)
    acc[moduleName].totalScore += result.score
    return acc
  }, {})

  for (const moduleName in grouped) {
    const moduleData = grouped[moduleName]
    const itemCount = moduleData.items.length
    moduleData.averageScore = itemCount > 0 ? (moduleData.totalScore / (itemCount * 10) * 10).toFixed(1) : "0.0"
  }

  const totalScore = allResults.reduce((sum, r) => sum + r.score, 0)
  const averageScore = allResults.length > 0 ? (totalScore / (allResults.length * 10) * 10).toFixed(1) : "0.0"

  return {groupedResults: grouped, averageScore}
})

const moduleCounts = computed(() => {
  const counts = {}
  for (const ex of examStore.exercises) {
    const mod = ex.title || "Unbekannt"
    counts[mod] = (counts[mod] || 0) + 1
  }
  return Object.entries(counts).map(([name, count]) => ({name, count}))
})

onMounted(() => {
  level.value = (route.params.level || "").toString().toUpperCase()
  examStore.loadTopics(`/exams/exam-${level.value}.json`)
})
</script>

<template>
  <div class="exam-app-container">
    <div class="exam__header" v-if="showHeader">
      <div v-if="isIntroVisible" class="header-actions">
        <button class="game-btn game-btn--back" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="exam__title-pill">{{ t('chooseTheme.level')}} {{ level }}</div>
      </div>
      <div v-else class="header-actions">
        <button class="game-btn game-btn--back" @click="router.back()">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="progress-bar-bg">
          <div class="progress__bar" :style="{ width: (examStore.currentIndex / examStore.exercises.length) * 100 + '%' }">
            <div class="glare"></div>
          </div>
        </div>
        <div class="progress-label">{{ examStore.currentIndex + 1 }} / {{ examStore.exercises.length }}</div>
      </div>
      <div class="header-right-spacer"></div>
    </div>
    <div v-if="examStore.loading" class="exam__status-card">
      <div class="loader-spinner"></div>
    </div>
    <div v-else-if="isIntroVisible" class="exam__card exam__card--intro">
      <Transition name="menu-appear" appear>
        <div>
          <div class="card-icon">
            <img class="card__icon-item" src="../../../assets/images/exam-results.svg" alt="exam-results">
          </div>
          <h2 class="card-title">{{ t('examSession.ready') }}</h2>
          <p class="card-text">
            {{ t('examSession.cardTextOne') }} <strong>{{ moduleCounts.length }}</strong> {{ t('examSession.cardTextTwo') }}
            <strong>{{ examStore.exercises.length }}</strong> {{ t('examSession.cardTextThree') }}
          </p>
          <div class="intro-stats">
            <div v-for="mod in moduleCounts" :key="mod.name" class="stat-badge">
              <span class="stat-icon">🧩</span>
              <span class="stat-info">{{ mod.name }}: {{ mod.count }}</span>
            </div>
          </div>
          <button class="action-btn action-btn--primary" @click="startExam">{{ t('examSession.begin') }}</button>
        </div>
      </Transition>
    </div>
    <div v-else-if="!isExamFinished && currentExercise" class="exam__workspace">
      <div class="exam__card exam__card--active">
        <h2 class="exercise-title">{{ currentExercise.title }}</h2>
        <div v-if="['multiple-choice','audio-choice'].includes(currentExercise.type)" class="task-content">
          <div v-if="currentExercise.task.text && currentExercise.type==='multiple-choice'" class="text-bubble">
            {{ currentExercise.task.text }}
          </div>
          <div v-if="currentExercise.type==='audio-choice'" class="audio-section">
            <div class="audio-label">{{ t('examSession.listen') }}</div>
            <SoundBtn :text="currentExercise.task.text" lang="de-DE" class="custom-sound-btn"/>
          </div>
          <div class="question-text">
            <div class="question__label">Die Frage:</div>
            <div>{{ currentExercise.task.question }}</div>
          </div>
          <div class="options-grid">
            <button
                v-for="option in currentExercise.task.options"
                :key="option"
                class="option-btn"
                @click="examStore.answerCurrent(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <div v-else-if="currentExercise.type==='text-input'" class="task-content">
          <p class="instruction-text">{{ currentExercise.task.instruction }}</p>
          <textarea v-model="userInput" class="game-textarea" :placeholder="t('examSession.placeHolder')"/>
          <button class="action-btn action-btn--submit" :disabled="isSubmitting || examStore.saveLoading"
                  @click="submitTextAnswer">
            {{ isSubmitting ? t('examSession.check') : t('examSession.send') }}
          </button>
        </div>

        <div v-else-if="currentExercise.type==='speaking-prompt'" class="task-content">
          <p class="instruction-text"><strong>{{ t('examSession.say')}}</strong> {{ currentExercise.task.prompt }}</p>
          <div class="topics-pills">
            <span v-for="topic in currentExercise.task.expectedTopics" :key="topic" class="topic-pill"># {{
                topic
              }}</span>
          </div>
          <div class="recording-ui">
            <div class="voice-indicator" v-if="isRecording">
              <span class="record-dot">{{ t('examSession.record') }}</span>
            </div>
            <VoiceRecorder
                :lang="'de-DE'"
                :key="examStore.currentIndex"
                @start="isRecording = true"
                @stop="isRecording = false"
                @audio="onAudioRecorded"
                @submit="submitTranscription"
            />
          </div>
        </div>

        <div v-if="examStore.saveError" class="error-toast">
          {{ examStore.saveError }}
        </div>
      </div>
    </div>

    <div v-else class="exam__results-screen">
      <div class="results-header">
        <h2 class="results-main-title">🎉 {{ t('examSession.great') }}</h2>
        <div class="score-circle">
          <span class="score-value">{{ examResult.averageScore }}</span>
          <span class="score-max">/ 10</span>
        </div>
        <p class="results-subtitle">{{ t('examSession.result') }} {{ level }}</p>
      </div>
      <div v-if="examStore.saveLoading" class="saving-status">{{ t('examSession.save') }}</div>
      <div class="results-scroll-area">
        <div
            v-for="(moduleData, moduleName) in examResult.groupedResults"
            :key="moduleName"
            :class="['result-module-card', `mod--${moduleName.toLowerCase()}`]"
        >
          <div class="module-header">
            <span class="module-name">{{ moduleName }}</span>
            <span class="module-score">{{ moduleData.averageScore }}/10</span>
          </div>
          <div v-for="item in moduleData.items" :key="item.id" class="result-item">
            <div class="result-item__main">
              <p class="item-task">{{ item.taskText || item.question }}</p>
              <div v-if="item.feedback" class="feedback-box">
                <p class="feedback-comment">💬 {{ item.feedback.feedback }}</p>
                <div v-if="item.feedback.correctedVersion" class="correction-box">
                  <strong>{{ t('examSession.correctly') }}</strong> {{ item.feedback.correctedVersion }}
                </div>
              </div>
            </div>
            <div class="item-points">{{ item.score }}</div>
          </div>
        </div>
      </div>
      <NuxtLink to="/exams" class="action-btn action-btn--primary">{{ t('examSession.back') }}</NuxtLink>
    </div>
    <div v-if="isLeaveModalOpen" class="game-modal-overlay">
      <div class="game-modal">
        <h3 class="modal-title">{{ t('examSession.interrupt') }}</h3>
        <p class="modal-text">{{ t('examSession.modalText') }}</p>
        <div class="modal-buttons">
          <button class="modal-btn modal-btn--cancel" @click="isLeaveModalOpen = false">{{ t('examSession.continue') }}</button>
          <button class="modal-btn modal-btn--confirm" @click="leaveExamConfirmed">{{ t('examSession.leave') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.exam-app-container {
  color: #fff;
  font-family: "Nunito", sans-serif;
  display: flex;
  flex-direction: column;
}

.question__label {
  display: inline-block;
  background: orange;
  border-radius: 10px;
  font-size: 20px;
  padding: 6px 18px;
  color: white;
  min-width: 120px;
  margin-bottom: 10px;
}

.instruction-text{
  color: var(--title);
  font-weight: 600;
  font-size: 17px;
  margin-bottom: 5px;
}

.exam__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
}

.exam__title-pill {
  font-weight: 900;
  font-size: 23px;
  color: var(--title);
  margin-left: 15px;
  text-shadow: 1px 1px var(--title);
}

.game-btn {
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

.saving-status {
  text-align: center;
  color: var(--title);
  font-size: 18px;
  font-weight: bold;
}

.game-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #000;
}

.game-btn--back {
  background: #fff;
  color: #000;
}

.game-btn--leave {
  background: #f87171;
  color: #fff;
}

.header-actions {
  display: flex;
  align-items: center;
  width: 100%;
}

.card__icon-item {
  width: 130px;
}

.exam__card {
  padding: 20px;
}

.card-icon {
  padding: 10px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.card-title {
  font-size: 23px;
  font-weight: 900;
  text-align: center;
  margin-bottom: 15px;
  color: var(--title);
}

.card-text {
  color: var(--title);
  font-size: 17px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
}

.intro-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 25px;
}

.stat-badge {
  padding: 10px 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid transparent;
  background: rgba(124, 77, 255, 0.2);
  border-color: #7c4dff;
}

.stat-badge:nth-child(5n + 1) {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.6);
  color: #93c5fd;
}

.stat-badge:nth-child(5n + 2) {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.6);
  color: #6ee7b7;
}

.stat-badge:nth-child(5n + 3) {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.6);
  color: #fcd34d;
}

.stat-badge:nth-child(5n + 4) {
  background: rgba(236, 72, 153, 0.15);
  border-color: rgba(236, 72, 153, 0.6);
  color: #f9a8d4;
}

.stat-badge:nth-child(5n + 5) {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.6);
  color: #c4b5fd;
}

.progress-container {
  margin: 10px 0 20px;
  padding: 0 10px;
}

.progress-label {
  font-size: 18px;
  font-weight: 800;
  color: var(--titleColor);
  text-align: center;
}

.progress-bar-bg {
  flex: 1;
  height: 26px;
  background: #e8eae5;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 10px;
}

.progress__bar {
  height: 100%;
  background-color: #10b981;
  border-radius: 10px;
  transition: width 0.3s ease-out;
  position: relative;
}

.glare{
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 4px
}

.exercise-title {
  font-size: 24px;
  font-weight: 900;
  margin-bottom: 15px;
  color: var(--titleColor);
}

.text-bubble {
  background: #2a265a;
  padding: 15px;
  border-radius: 16px;
  margin-bottom: 15px;
  border-left: 5px solid #7c4dff;
  font-weight: 600;
  line-height: 1.4;
}

.question-text {
  font-size: 18px;
  font-weight: 900;
  margin: 15px 0;
  color: var(--titleColor);
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-btn {
  background: #60a5fa;
  border: none;
  border-radius: 35px;
  padding: 12px;
  font-weight: 800;
  font-size: 16px;
  max-width: 200px;
  color: white;
  text-align: center;
  box-shadow: 0 5px 0 #3c7fd2;
  cursor: pointer;

}

.option-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #000;
}

.game-textarea {
  width: 100%;
  background: white;
  border: 2px solid #000;
  border-radius: 15px;
  padding: 12px;
  color: #282828;
  font-weight: 600;
  font-family: inherit;
  font-size: 16px;
  margin-bottom: 15px;
  min-height: 140px;
  overflow-y: auto;
  resize: none;
}

.action-btn {
  width: 100%;
  border: none;
  border-radius: 50px;
  padding: 14px;
  font-weight: 900;
  font-size: 18px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 5px 0 #000;
  transition: all 0.1s;
}

.action-btn:active {
  transform: translateY(3px);
  box-shadow: 0 2px 0 #000;
}

.action-btn:disabled {
  opacity: 0.5;
  transform: none;
}

.action-btn--primary {
  background: #3b82f6;
  box-shadow: 0 5px 0 #306ccc;
  color: white;
  display: flex;
  justify-content: center;

}

.action-btn--submit {
  background: #3b82f6;
  box-shadow: 0 5px 0 #306ccc;
  color: white;
}

.results-header {
  text-align: center;
  padding: 20px 0;
}

.score-circle {
  width: 100px;
  height: 100px;
  background: #7c4dff;
  border: 4px solid #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px auto;
  box-shadow: 0 6px 0 #000;
}

.score-value {
  font-size: 32px;
  font-weight: 900;
}

.score-max {
  font-size: 14px;
  opacity: 0.8;
}

.results-scroll-area {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 5px;
}

.result-module-card {
  background: #2a265a;
  border: 2px solid #000;
  border-radius: 18px;
  padding: 12px;
  margin-bottom: 15px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  font-weight: 900;
  font-size: 16px;
  margin-bottom: 10px;
  color: #fef08a;
}

.result-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 8px;
  display: flex;
  gap: 10px;
}

.item-task {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.item-points {
  background: #000;
  color: #4ade80;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 900;
  font-size: 12px;
  align-self: flex-start;
}

.feedback-box {
  font-size: 12px;
  margin-top: 8px;
  color: #a5a8ff;
}

.correction-box {
  background: rgba(74, 222, 128, 0.1);
  padding: 5px;
  border-radius: 5px;
  color: #4ade80;
  margin-top: 5px;
}

/* МОДАЛКА */
.game-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.game-modal {
  background: #1e1b3d;
  border: 4px solid #000;
  border-radius: 24px;
  padding: 25px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 0 #000;
}

.modal-title {
  font-weight: 900;
  font-size: 20px;
  margin-bottom: 10px;
  text-align: center;
}

.modal-text {
  color: #a5a8ff;
  text-align: center;
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  gap: 10px;
}

.modal-btn {
  flex: 1;
  padding: 12px;
  border: 3px solid #000;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 0 #000;
}

.modal-btn--confirm {
  background: #f87171;
  color: #fff;
}

.modal-btn--cancel {
  background: #fff;
  color: #000;
}

.voice-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f87171;
  font-weight: 900;
  margin-bottom: 10px;
}

.record-dot {
  width: 12px;
  height: 12px;
  background: #f87171;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.menu-appear-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease-out;
}

.menu-appear-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.results-scroll-area::-webkit-scrollbar {
  width: 5px;
}

.results-scroll-area::-webkit-scrollbar-thumb {
  background: #7c4dff;
  border-radius: 10px;
}

</style>
