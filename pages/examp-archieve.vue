<script setup>
import {onMounted, onUnmounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {userExamStore} from '../store/examStore.js'
import VPlayAudio from "../src/components/V-playAudio.vue";
import {useSeoMeta} from "#imports";

useSeoMeta({
  robots: 'noindex, nofollow'
})

const { t } = useI18n();
const route = useRoute()
const router = useRouter()
const examStore = userExamStore()

function toDateFlexible(value) {
  if (!value) return null
  try {
    if (typeof value.toDate === 'function') return value.toDate()
    if (typeof value.seconds === 'number') return new Date(value.seconds * 1000)
    const d = new Date(value)
    return isNaN(d) ? null : d
  } catch {
    return null
  }
}

function isSpeaking(item) {
  return item?.type === 'speaking-prompt'
      || item?.exercise?.type === 'speaking-prompt'
      || item?.module === 'Sprechen';
}

const itemsByModule = computed(() => {
  const acc = {}
  const items = Array.isArray(examStore.currentArchiveAttempt?.items) ? examStore.currentArchiveAttempt.items : []
  for (const item of items) {
    const mod = item?.module || 'Unbekannt'
    if (!acc[mod]) acc[mod] = []
    acc[mod].push(item)
  }
  return acc
})

function audioFilesFor(item) {
  const direct = item?.speaking?.audioFiles
  if (Array.isArray(direct) && direct.length) return direct

  const media = examStore.currentArchiveAttempt?.speakingMedia
  if (!media || !item?.id) return []
  const arr = media[item.id]
  if (!Array.isArray(arr) || !arr.length) return []
  return arr.map(m => ({
    exerciseId: item.id,
    storagePath: m.storagePath || null,
    url: m.url || null,
    durationSec: m.durationSec || 0,
    transcription: m.transcription || ''
  }))
}

function goBack() {
  if (history.length > 1) history.back()
  else router.push('/cabinet')
}

onMounted(() => {
  const attemptId = route.query.id
  examStore.loadSingleAttempt(attemptId)
})

onUnmounted(() => {
  examStore.clearCurrentArchiveAttempt()
})

</script>

<template>
  <div class="arch">
    <div class="arch__head">
      <button class="arch__back" @click="goBack">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h1 class="arch__title">{{ t('archiveExam.title')}}</h1>
    </div>

    <div v-if="examStore.currentArchiveLoading" class="arch__box">{{ t('archiveExam.loading')}}</div>
    <div v-else-if="examStore.currentArchiveError" class="arch__box arch__box--error">
      {{ examStore.currentArchiveError }}
    </div>

    <div v-else-if="examStore.currentArchiveAttempt" class="arch__content">
      <div class="arch__card">
        <div class="arch__row"><b>{{ t('archiveExam.level')}}</b> {{ examStore.currentArchiveAttempt.level || '—' }}</div>
        <div class="arch__row">
          <b>{{ t('archiveExam.status')}}</b>
          <span
              class="arch__badge"
              :class="examStore.currentArchiveAttempt.status === 'finished' ? 'is-finished' : 'is-draft'"
          >
            {{ (examStore.currentArchiveAttempt.status || 'draft').toUpperCase() }}
          </span>
        </div>
        <div class="arch__row">
          <b>{{ t('archiveExam.start')}}</b>
          {{ toDateFlexible(examStore.currentArchiveAttempt.startedAt)?.toLocaleString?.() || '—' }}
        </div>
        <div v-if="examStore.currentArchiveAttempt.status === 'finished'" class="arch__row">
          <b>{{ t('archiveExam.score')}}</b> {{ examStore.currentArchiveAttempt.averageScore }} / 10
        </div>
        <div v-if="examStore.currentArchiveAttempt.perModuleScores" class="arch__chips">
          <span v-for="(score, mod) in examStore.currentArchiveAttempt.perModuleScores" :key="mod" class="arch__chip">
            {{ mod }}: {{ score }}/10
          </span>
        </div>
      </div>

      <div v-for="(list, mod) in itemsByModule" :key="mod" class="arch__module">
        <h2 class="arch__mod-title">{{ mod }}</h2>
        <div v-for="item in list" :key="item.id" class="arch__item">
          <div class="arch__left">
            <div class="arch__score">
              <div v-if="item.taskText" class="arch__task-text"><b>Die Aufgabe:</b> {{ item.taskText }}</div>
              <div class="arch__score-badge">{{ item.score }} / 10</div>
            </div>

            <div class="arch__qa-block">
              <p v-if="item.question" class="arch__question"><b>Die Frage:</b> {{ item.question }}</p>
              <p v-if="!isSpeaking(item)" class="arch__ans"><b>Die Antwort:</b> {{ item.answer || '—' }}</p>
            </div>
            <div v-if="audioFilesFor(item).length" class="arch__audio-list">
              <div v-for="(audio, idx) in audioFilesFor(item)" :key="idx" class="arch__audio-item">
                <div class="arch__audio-meta">
                  <VPlayAudio :src="audio.url" label="Воспроизвести" pauseLabel="Пауза" preload="metadata"/>
                  <div class="timer__inner">
                    <img class="timer" src="../assets/images/dailyIcons/timer.svg" alt="TimerIcon">
                    <div class="timer__value" v-if="audio.durationSec">{{ audio.durationSec }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="item.feedback" class="arch__fb">
              <p v-if="item.feedback.result" class="arch__fb-result"><b>Die Bewertung:</b> {{ item.feedback.result }}</p>
              <p v-if="item.feedback.feedback" class="arch__fb-text"><b>Der Kommentar:</b> {{ item.feedback.feedback }}</p>
              <p v-if="item.feedback.correctedVersion" class="arch__pre">
                <b>Die Korrektur:</b><br/>{{ item.feedback.correctedVersion }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.arch {
  max-width: 1000px;
  margin: 0 auto;
  padding: 5px 10px 15px 10px;
  font-family: "Nunito", sans-serif;
  color: var(--titleColor, #ffffff);
}

.arch__head {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.arch__back {
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

.arch__back:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #000;
}

.arch__title {
  font-size: 23px;
  font-weight: 900;
  color: var(--titleColor);
  text-shadow: 0px 1px var(--titleColor);
  margin-left: 15px;
}

.arch__box {
  border-radius: 16px;
  padding: 16px;
  background: #2a2a3c;
  color: #fff;
  margin-top: 12px;
  font-weight: 700;
  text-align: center;
}

.arch__box--error {
  background: #ff4d4f;
}

.arch__card {
  border-radius: 20px;
  padding: 16px 10px;
  background: #00c2ff;
  margin-bottom: 20px;
  color: #e0e0ff;
}

.arch__row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 6px;
  align-items: center;
  font-size: 15px;
  color: var(--titleColor);
}

.arch__row b {
  color: var(--titleColor);
  font-weight: 800;
}

.arch__badge {
  font-size: 12px;
  padding: 3px 12px;

  border-radius: 999px;
  font-weight: 900;
  text-transform: uppercase;

}

.is-finished {
  background: #34c759;
  color: white;
}

.is-draft {
  background: #ffcc00;
  color: #000;
}

.arch__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 2px dashed rgba(255, 255, 255, 0.1);
}

.arch__chip {
  font-size: 14px;
  font-weight: 800;
  background:white;
  color: #333232;
  border-radius: 12px;
  padding: 6px 8px;
}

.arch__module {
  margin-top: 24px;
}

.arch__mod-title {
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 5px;
  color: var(--titleColor);
  padding-left: 5px;
}

.arch__item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  border-radius: 20px;
  padding: 14px;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  margin-bottom: 16px;
  color: #dcdcdc;
}

.arch__left {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.arch__score {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);
}

.arch__fb-text {
  color: var(--titleColor);
}

.arch__task-text {
  font-size: 1rem;
  line-height: 1.4;
  color: var(--titleColor);
}

.arch__task-text b {
  color: #1855d9;
  font-weight: bold;
  font-size: 17px
}

.arch__score-badge {
  background: #ffcc00;
  color: #000;
  padding: 4px 12px;
  border-radius: 18px;
  font-weight: 900;
  font-size: 15px;
  text-align: center;
  flex-shrink: 0;
}

.arch__qa-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 1.05rem;
}

.arch__question{
  color: var(--titleColor);
}

.arch__ans {
  color: var(--titleColor);
  font-weight: bold;
}

.arch__question b,
.arch__ans b {
  color: #1855d9;
}

.arch__audio-list {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 10px 14px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
}

.arch__audio-item {
  padding: 4px 0;
}

.arch__audio-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.timer__inner {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #3a3a52;
  padding: 6px 12px;
  border-radius: 12px;
  border: 2px solid #000;
}

.timer {
  width: 24px;
}

.timer__value {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
}


.arch__fb {
  margin-top: 6px;
  padding: 14px;
  background: #34c75915;
  border-left: 4px solid #34c759;
  border-radius: 0 16px 16px 0;
  font-size: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.arch__fb b {
  color: #34c759;
  font-weight: 800;
}

.arch__fb-result {
  font-size: 1.05rem;
}

.arch__pre {
  white-space: pre-wrap;
  background: rgba(0,0,0,0.2);
  padding: 10px;
  border-radius: 10px;
  margin-top: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #e0e0e0;
}

@media (max-width: 580px) {
  .arch__score {
    flex-direction: column-reverse;
    align-items: flex-start;
  }

  .arch__score-badge {
    align-self: flex-start;
  }
}
</style>