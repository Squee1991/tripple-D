<template>
  <div class="exam">
    <div class="exam__header" v-if="showHeader">
      <button v-if="isIntroVisible" class="exam__back" @click="router.back()">← Zurück</button>
      <button v-else class="exam__leave" @click="isLeaveModalOpen = true">✖ Prüfung verlassen</button>
      <h1 v-if="isIntroVisible" class="exam__title">📘 Niveau {{ level }}</h1>
      <div class="exam__header-spacer" />
    </div>

    <div v-if="examStore.loading" class="exam__loading">Aufgabe wird geladen...</div>

    <div v-else-if="isIntroVisible" class="exam__intro">
      <h2 class="exam__card-title">📘 Willkommen zur Prüfung!</h2>
      <p class="exam__intro-text">
        Die Prüfung besteht aus <strong>{{ moduleCounts.length }}</strong> Modulen mit insgesamt
        <strong>{{ examStore.exercises.length }}</strong> Aufgaben.
      </p>
      <ul class="exam__intro-list">
        <li v-for="mod in moduleCounts" :key="mod.name">
          🧩 {{ mod.name }} — {{ mod.count }} Aufgabe(n)
        </li>
      </ul>
      <button class="exam__button" @click="startExam">🚀 Prüfung starten</button>
    </div>

    <div v-else-if="!isExamFinished && currentExercise" class="exam__card exam__card--active">
      <p class="exam__progress">Frage {{ examStore.currentIndex + 1 }} von {{ examStore.exercises.length }}</p>
      <h2 class="exam__card-title">{{ currentExercise.title }}</h2>

      <div v-if="['multiple-choice','audio-choice'].includes(currentExercise.type)">
        <div v-if="currentExercise.task.text && currentExercise.type==='multiple-choice'" class="exam__task-text">
          <span><strong class="exam__label">Text: </strong></span>
          <span class="exam__text-read">{{ currentExercise.task.text }}</span>
        </div>

        <div v-if="currentExercise.type==='audio-choice'" class="exam__task-audio">
          <strong class="exam__label">Hörbeispiel:</strong>
          <SoundBtn :text="currentExercise.task.text" lang="de-DE" title="Hörbeispiel anhören" />
        </div>

        <div class="exam__question">
          <span><strong class="exam__label">Frage: </strong></span>
          <span class="exam__text-read">{{ currentExercise.task.question }}</span>
        </div>

        <ul class="exam__options">
          <li v-for="option in currentExercise.task.options" :key="option" class="exam__option">
            <button class="exam__button" @click="examStore.answerCurrent(option)">{{ option }}</button>
          </li>
        </ul>
      </div>

      <div v-else-if="currentExercise.type==='text-input'" class="exam__text-input">
        <p class="exam__task-instruction">
          <span><strong class="exam__label">Aufgabe: </strong></span>
          <span class="exam__text-read">{{ currentExercise.task.instruction }}</span>
        </p>
        <textarea v-model="userInput" class="exam__textarea" placeholder="Antwort schreiben..." rows="4" />
        <button class="exam__button" :disabled="isSubmitting || examStore.saveLoading" @click="submitTextAnswer">
          {{ isSubmitting ? 'Wird geprüft...' : 'Antwort senden' }}
        </button>
      </div>

      <div v-else-if="currentExercise.type==='speaking-prompt'" class="exam__speaking-prompt">
        <p class="exam__task-prompt">
          <strong class="exam__label">Sprechen Sie:</strong> {{ currentExercise.task.prompt }}
        </p>
        <p class="exam__task-topics">🎯 Themen: {{ currentExercise.task.expectedTopics.join(', ') }}</p>

        <div class="voice-indicator" v-if="isRecording">
          <span class="record-dot" /> Aufnahme läuft...
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

      <div v-if="examStore.saveError" class="exam__save-error">
        {{ examStore.saveError }}
      </div>
    </div>

    <div v-else class="exam__card exam__card--finished">
      <h2 class="exam__card-title">🎉 Prüfung abgeschlossen!</h2>
      <h3 class="exam__card-subtitle">🧾 Ergebnis des Tests für Niveau {{ level }}</h3>

      <div v-if="examStore.saveLoading" class="exam__saving">
        Speichern...
      </div>
      <div v-else-if="examStore.saveError" class="exam__save-error">
        {{ examStore.saveError }}
      </div>

      <p class="exam__average-score">
        <strong class="exam__label">Durchschnittliche Punktzahl:</strong> {{ examResult.averageScore }} / 10
      </p>

      <div class="exam-results-container">
        <div
            v-for="(moduleData, moduleName) in examResult.groupedResults"
            :key="moduleName"
            :class="['exam-results-column', `module--${moduleName.toLowerCase()}`]"
        >
          <h3 class="exam-module-title">{{ moduleName }} ({{ moduleData.averageScore }}/10)</h3>
          <div v-for="item in moduleData.items" :key="item.id" class="exam-result-item">
            <div class="exam-result-item__content">
              <p v-if="item.taskText"><strong class="exam__label">Aufgabe:</strong> {{ item.taskText }}</p>
              <p v-if="item.question"><strong class="exam__label">Frage:</strong> {{ item.question }}</p>

              <div v-if="item.feedback" class="exam-result-item__feedback">
                <p v-if="item.type !== 'speaking-prompt'">
                  <strong class="exam__label">Die Antwort:</strong> {{ item.answer || 'Keine Antwort' }}
                </p>
                <p><strong class="exam__label">Die Bewertung:</strong> {{ item.feedback.result }}</p>
                <p><strong class="exam__label">Der Kommentar:</strong> {{ item.feedback.feedback }}</p>
                <p v-if="item.feedback.correctedVersion">
                  <strong class="exam__label">Korrektur:</strong><br />{{ item.feedback.correctedVersion }}
                </p>
              </div>
            </div>
            <p class="exam-result-item__score"><strong>{{ item.score }} / 10</strong></p>
          </div>
        </div>
      </div>

      <NuxtLink to="/exams" class="exam__button exam__back-button">⬅ Zurück zu den Niveaus</NuxtLink>
    </div>

    <div v-if="isLeaveModalOpen" class="modal">
      <div class="modal__card">
        <h3 class="modal__title">Prüfung ist nicht abgeschlossen</h3>
        <p class="modal__text">
          Wenn Sie jetzt verlassen, werden <strong>keine Daten gespeichert</strong> (auch keine Audioaufnahmen).
        </p>
        <div class="modal__actions">
          <button class="exam__button" @click="isLeaveModalOpen = false">Weiter machen</button>
          <button class="exam__button modal__danger" @click="leaveExamConfirmed">Verlassen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { userExamStore } from "../../../store/examStore"
import SoundBtn from "~/src/components/soundBtn.vue"
import VoiceRecorder from "~/src/components/VoiceRecorder.vue"
import { useGroqCheckHomeWork } from "~/composables/useGroqCheck.js"
import { useSeoMeta } from "#imports"

useSeoMeta({ robots: "noindex, follow" })

const route = useRoute()
const router = useRouter()
const { locale: i18nLocale } = useI18n()

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
  await examStore.startAttempt({ level: level.value, locale: i18nLocale.value })
}

const onAudioRecorded = async ({ blob, durationSec }) => {
  const exerciseId = currentExercise.value?.id
  if (!exerciseId || !blob) return
  await examStore.uploadSpeakingAudio({ exerciseId, blob, durationSec, transcription: "" })
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
    if (!acc[moduleName]) acc[moduleName] = { items: [], totalScore: 0 }
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

  return { groupedResults: grouped, averageScore }
})

const moduleCounts = computed(() => {
  const counts = {}
  for (const ex of examStore.exercises) {
    const mod = ex.title || "Unbekannt"
    counts[mod] = (counts[mod] || 0) + 1
  }
  return Object.entries(counts).map(([name, count]) => ({ name, count }))
})

onMounted(() => {
  level.value = (route.params.level || "").toString().toUpperCase()
  examStore.loadTopics(`/exams/exam-${level.value}.json`)
})
</script>

<style scoped>
.exam {
  min-height: 100vh;
  padding: 2.2rem 1rem 3rem;
  font-family: "Nunito", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.exam__header {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 190px 1fr 190px;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.6rem;
}

.exam__header-spacer {
  width: 100%;
  height: 1px;
}

.exam__back {
  justify-self: start;
  background: #ffffff;
  border: 2px solid #000;
  border-radius: 14px;
  padding: 0.7rem 1.1rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 2px 2px 0 #000;
  transition: all 0.2s;
}

.exam__leave {
  justify-self: start;
  background: #fff5f5;
  border: 2px solid #ff3b30;
  color: #c62828;
  border-radius: 14px;
  padding: 0.7rem 1.1rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 3px 3px 0 rgba(0,0,0,0.25);
  transition: all 0.2s;
}

.exam__title {
  justify-self: center;
  font-size: 2.4rem;
  margin: 0;
  color: #2c3e50;
  text-shadow: 1px 1px 0 #fff;
  background: #ffeeba;
  padding: 1rem 2rem;
  border-radius: 16px;
  box-shadow: 3px 3px 0 #c59d00;
  transform: rotate(-1.5deg);
  text-align: center;
}

.exam__loading {
  font-size: 1.5rem;
  padding: 2rem;
  color: #444;
  background: #fff3cd;
  border: 2px dashed #ffcf00;
  border-radius: 12px;
}

.exam__intro {
  background: #fffbe6;
  border: 3px dashed #fbc02d;
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  text-align: center;
  box-shadow: 4px 4px 0 #c0a000;
}

.exam__intro-text {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.exam__intro-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 2rem;
}

.exam__intro-list li {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.exam__progress {
  font-size: 1.1rem;
  text-align: center;
  font-weight: bold;
  color: #5d4037;
  margin-bottom: 0.6rem;
}

.exam__card {
  background: #ffffff;
  border: 4px solid #000;
  border-radius: 20px;
  padding: 1rem;
  max-width: 1200px;
  width: 100%;
  box-shadow: 6px 6px 0 #000;
  margin-bottom: 2rem;
  transform: rotate(0.5deg);
}

.exam__card--active {
  background: #e0f7fa;
}

.exam__card-title {
  font-size: 2rem;
  margin-bottom: 1rem;
  border-bottom: 3px dashed #333;
  padding-bottom: 0.5rem;
  color: #222;
}

.exam__label {
  color: #1a237e;
  margin-right: 6px;
}

.exam__task-text, .exam__task-audio, .exam__question, .exam__task-instruction, .exam__task-prompt, .exam__task-topics {
  margin-bottom: 1.2rem;
  font-size: 1.2rem;
}

.exam__options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.exam__option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.exam__button {
  background: #ffd54f;
  border: 2px solid #ffb300;
  padding: 0.8rem 1.6rem;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  transform: rotate(-1deg);
  box-shadow: 2px 2px 0 #888;
}

.exam__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: rotate(-1deg);
}

.exam__textarea {
  width: 100%;
  padding: 0.6rem;
  resize: none;
  min-height: 150px;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.exam__card--finished {
  background: #e8f5e9;
  border-color: #388e3c;
  transform: rotate(0deg);
  width: 100%;
  max-width: 1200px;
}

.exam__average-score {
  font-size: 1.4rem;
  margin-bottom: 2rem;
  color: #2e7d32;
  font-weight: bold;
  text-align: center;
  background: #fff;
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px dashed #388e3c;
}

.exam__back-button {
  display: inline-block;
  margin-top: 2rem;
}

.exam__saving {
  font-weight: 900;
  text-align: center;
  margin: 0.6rem 0 1rem;
}

.exam__save-error {
  margin-top: 1rem;
  background: #fff5f5;
  border: 2px solid #ff3b30;
  color: #b71c1c;
  font-weight: 900;
  border-radius: 12px;
  padding: 0.8rem 1rem;
}

.exam-results-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.module--schreiben, .module--sprechen {
  grid-column: 1 / -1;
}

.exam-results-column {
  background: #f0f4f8;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #b0bec5;
  display: flex;
  flex-direction: column;
}

.exam-module-title {
  font-size: 1.5rem;
  color: #1e3a5f;
  text-align: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px dashed #78909c;
}

.exam-result-item {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.exam-result-item__content {
  flex-grow: 1;
}

.exam-result-item__content p {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.exam-result-item__score {
  background: #42a5f5;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: bold;
  flex-shrink: 0;
  align-self: center;
}

.exam-result-item__feedback {
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px dashed #ccc;
}

.exam-result-item__feedback p {
  margin: 0.4rem 0;
}

.voice-indicator {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: bold;
  color: #b71c1c;
  margin: 1rem 0;
  animation: pulseText 1s infinite;
}

.record-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: red;
  animation: pulseDot 1s infinite;
}

@keyframes pulseDot {
  0% { opacity: 1; transform: scale(1) }
  50% { opacity: .5; transform: scale(1.4) }
  100% { opacity: 1; transform: scale(1) }
}

@keyframes pulseText {
  0%, 100% { opacity: 1 }
  50% { opacity: .5 }
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9999;
}

.modal__card {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border: 4px solid #000;
  border-radius: 18px;
  box-shadow: 8px 8px 0 #000;
  padding: 1.2rem 1.2rem 1rem;
  transform: rotate(-0.6deg);
}

.modal__title {
  margin: 0 0 0.6rem;
  font-size: 1.4rem;
}

.modal__text {
  margin: 0 0 1rem;
  font-size: 1.05rem;
  line-height: 1.35;
}

.modal__actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.modal__danger {
  background: #ff5252;
  border-color: #c62828;
}

@media (max-width: 767px) {
  .exam__header {
    grid-template-columns: 1fr;
    justify-items: start;
    gap: 0.8rem;
  }
  .exam__title {
    width: 100%;
    font-size: 2rem;
  }
  .exam__header-spacer {
    display: none;
  }
  .exam-results-container {
    display: flex;
    flex-direction: column;
  }
  .exam__text-read {
    font-size: 1rem;
    font-weight: 600;
  }
}

@media (min-width: 1024px) {
  .modal__danger:hover {
    background: #ff1744;
  }

  .exam__button:hover {
    background: #ffca28;
    transform: translateY(-2px) rotate(1deg);
  }

  .exam__leave:hover {
    background: #ff1744;
    color: white;
  }

  .exam__back:hover {
    box-shadow: 0 0 0;
    transform: translate(1px, 1px);
  }
}
</style>
