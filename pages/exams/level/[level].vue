<template>
  <div class="exam">
    <h1 class="exam__title">📘 Niveau {{ level }}</h1>
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
          <strong class="exam__label">Text:</strong> {{ currentExercise.task.text }}
        </div>
        <div v-if="currentExercise.type==='audio-choice'" class="exam__task-audio">
          <strong class="exam__label">Hörbeispiel:</strong>
          <SoundBtn :text="currentExercise.task.text" lang="de-DE" title="Hörbeispiel anhören"/>
        </div>
        <div class="exam__question">
          <strong class="exam__label">Frage:</strong> {{ currentExercise.task.question }}
        </div>
        <ul class="exam__options">
          <li v-for="option in currentExercise.task.options" :key="option" class="exam__option">
            <button class="exam__button" @click="examStore.answerCurrent(option)">{{ option }}</button>
          </li>
        </ul>
      </div>
      <div v-else-if="currentExercise.type==='text-input'" class="exam__text-input">
        <p class="exam__task-instruction">
          <strong class="exam__label">Aufgabe:</strong> {{ currentExercise.task.instruction }}
        </p>
        <textarea v-model="userInput" class="exam__textarea" placeholder="Antwort schreiben..." rows="4"/>
        <button class="exam__button" @click="submitTextAnswer">Antwort senden</button>
      </div>
      <div v-else-if="currentExercise.type==='speaking-prompt'" class="exam__speaking-prompt">
        <p class="exam__task-prompt">
          <strong class="exam__label">Sprechen Sie:</strong> {{ currentExercise.task.prompt }}
        </p>
        <p class="exam__task-topics">🎯 Themen: {{ currentExercise.task.expectedTopics.join(', ') }}</p>
        <div class="voice-indicator" v-if="isRecording">
          <span class="record-dot"/> Aufnahme läuft...
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
    <div v-else class="exam__card exam__card--finished">
      <h2 class="exam__card-title">🎉 Prüfung abgeschlossen!</h2>
      <h3 class="exam__card-subtitle">🧾 Ergebnis des Tests für Niveau {{ level }}</h3>
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
                <p><strong class="exam__label">Die Antwort:</strong> {{ item.answer || 'Keine Antwort' }}</p>
                <p><strong class="exam__label">Die Bewertung:</strong> {{ item.feedback.result }}</p>
                <p><strong class="exam__label">Der Kommentar:</strong> {{ item.feedback.feedback }}</p>
                <p v-if="item.feedback.correctedVersion">
                  <strong class="exam__label">Korrektur:</strong><br/>{{ item.feedback.correctedVersion }}
                </p>
              </div>
            </div>
            <p class="exam-result-item__score"><strong>{{ item.score }} / 10</strong></p>
          </div>
        </div>
      </div>
      <NuxtLink to="/exams" class="exam__button exam__back-button">⬅ Zurück zu den Niveaus</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {userExamStore} from '../../../store/examStore'
import SoundBtn from '~/src/components/soundBtn.vue'
import VoiceRecorder from '~/src/components/VoiceRecorder.vue'
import {useGroqCheckHomeWork} from '~/composables/useGroqCheck.js'

import { useSeoMeta } from '#imports'
useSeoMeta({
  robots: 'noindex, follow'
})

const route = useRoute()
const {locale} = useI18n()
const examStore = userExamStore()
const userInput = ref('')
const level = ref('')
const isIntroVisible = ref(true)
const isRecording = ref(false)

const currentExercise = computed(() => examStore.currentExercise)
const isExamFinished = computed(() => examStore.isFinished)

const startExam = async () => {
  isIntroVisible.value = false
  if (typeof examStore.startAttempt === 'function') {
    await examStore.startAttempt({level: level.value, locale: locale.value})
  }
}

const onAudioRecorded = async ({ blob, durationSec }) => {
  const exerciseId = currentExercise.value?.id
  if (!exerciseId || !blob) return
  await examStore.uploadSpeakingAudio({
    exerciseId,
    blob,
    durationSec,
    transcription: ''
  })
}

const submitTextAnswer = async () => {
  const answer = (userInput.value || '').trim()
  if (!answer) return
  const feedback = await useGroqCheckHomeWork({
    task: currentExercise.value.task,
    answer,
    level: level.value,
    locale: locale.value
  })
  await examStore.answerCurrent(answer, feedback)
  userInput.value = ''
}

const submitTranscription = async (text) => {
  const answer = (text || '').trim()
  if (!answer) return
  const task = currentExercise.value?.task
  if (!task) return
  const feedback = await useGroqCheckHomeWork({
    task,
    answer,
    level: level.value,
    locale: locale.value
  })
  await examStore.answerCurrent(answer, feedback)
}

const examResult = computed(() => {
  const scoreMap = {
    'ausgezeichnet': 10, 'fast perfekt': 9, 'gut': 8, 'kleine fehler': 7,
    'mittelmäßig': 6, 'okay': 5, 'viele fehler': 4, 'muss verbessert werden': 3,
    'schlecht': 2, 'sehr schlecht': 1, 'keine antwort': 0,
  }

  const allResults = examStore.userAnswers.map(answer => {
    const exercise = examStore.exercises.find(e => e.id === answer.id)
    if (!exercise) return null
    let score = 0
    if (exercise.type === 'multiple-choice' || exercise.type === 'audio-choice') {
      score = answer.correct ? 10 : 0
    } else if (exercise.type === 'text-input' || exercise.type === 'speaking-prompt') {
      score = scoreMap[answer.feedback?.result?.toLowerCase()] ?? 0
    }
    return {
      id: answer.id,
      module: exercise.title || 'Unbekannt',
      score,
      taskText: exercise.task?.instruction || exercise.task?.prompt,
      question: exercise.task?.question,
      answer: answer.answer,
      feedback: answer.feedback
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
    moduleData.averageScore = itemCount > 0 ? (moduleData.totalScore / (itemCount * 10) * 10).toFixed(1) : '0.0'
  }

  const totalScore = allResults.reduce((sum, r) => sum + r.score, 0)
  const averageScore = allResults.length > 0 ? (totalScore / (allResults.length * 10) * 10).toFixed(1) : '0.0'

  return {groupedResults: grouped, averageScore}
})

watch(isExamFinished, async (done) => {
  if (done) {
    if (typeof examStore.finalizeAttemptAndSave === 'function') {
      await examStore.finalizeAttemptAndSave()
    } else {
      if (typeof examStore.finishAttempt === 'function') examStore.finishAttempt()
      if (typeof examStore.buildAttemptSnapshot === 'function') examStore.buildAttemptSnapshot()
    }
  }
})

const moduleCounts = computed(() => {
  const counts = {}
  for (const ex of examStore.exercises) {
    const mod = ex.title || 'Unbekannt'
    counts[mod] = (counts[mod] || 0) + 1
  }
  return Object.entries(counts).map(([name, count]) => ({name, count}))
})

onMounted(() => {
  level.value = (route.params.level || '').toString().toUpperCase()
  examStore.loadTopics(`/exams/exam-${level.value}.json`)
})
</script>

<style scoped>
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
  font-weight: bold;
  color: #5d4037;
  margin-bottom: 0.5rem;
}

.exam {
  background: #fdf6e3;
  min-height: 100vh;
  padding: 3rem 1rem;
  font-family: "Nunito", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.exam__title {
  font-size: 2.8rem;
  margin-bottom: 2rem;
  color: #2c3e50;
  text-shadow: 1px 1px 0 #fff;
  background: #ffeeba;
  padding: 1rem 2rem;
  border-radius: 16px;
  box-shadow: 3px 3px 0 #c59d00;
  transform: rotate(-1.5deg);
}

.exam__loading {
  font-size: 1.5rem;
  padding: 2rem;
  color: #444;
  background: #fff3cd;
  border: 2px dashed #ffcf00;
  border-radius: 12px;
}

.exam__card {
  background: #ffffff;
  border: 4px solid #000;
  border-radius: 20px;
  padding: 2rem;
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
}

.exam__task-text, .exam__task-audio, .exam__question, .exam__task-instruction, .exam__task-prompt, .exam__task-topics {
  margin-bottom: 1.2rem;
  font-size: 1.2rem;
  display: flex;
}

.exam__options {
  list-style: none;
  padding: 0;
  margin: 0;
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

.exam__button:hover {
  background: #ffca28;
  transform: translateY(-2px) rotate(1deg);
}

.exam__textarea {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
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

.exam-result-item:last-child {
  margin-bottom: 0;
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
  0% {
    opacity: 1;
    transform: scale(1)
  }
  50% {
    opacity: .5;
    transform: scale(1.4)
  }
  100% {
    opacity: 1;
    transform: scale(1)
  }
}

@keyframes pulseText {
  0%, 100% {
    opacity: 1
  }
  50% {
    opacity: .5
  }
}
</style>
