<script setup>
import {ref, onMounted, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {getFirestore, doc, getDoc} from 'firebase/firestore'
import {getStorage, ref as sRef, getDownloadURL} from 'firebase/storage'
const route = useRoute()
const router = useRouter()
const db = getFirestore()
const storage = getStorage()
const loading = ref(true)
const error = ref(null)
const attempt = ref(null)

function toDateFlexible(value) {
  if (!value) return null
  try {
    if (typeof value.toDate === 'function') return value.toDate()
    const d = new Date(value)
    return isNaN(d) ? null : d
  } catch {
    return null
  }
}

// const formatSec = (s) => {
//   const n = Number(s || 0)
//   if (!n) return '0с'
//   const m = Math.floor(n / 60)
//   const r = n % 60
//   return m ? `${m}м ${r}с` : `${r}с`
// }

const itemsByModule = computed(() => {
  const acc = {}
  const items = Array.isArray(attempt.value?.items) ? attempt.value.items : []
  for (const it of items) {
    const mod = it?.module || 'Unbekannt'
    if (!acc[mod]) acc[mod] = []
    acc[mod].push(it)
  }
  return acc
})

async function loadAttempt() {
  loading.value = true
  error.value = null
  attempt.value = null
  try {
    const id = route.query.id
    if (!id || typeof id !== 'string') throw new Error('Не передан id попытки')
    const dref = doc(db, 'examAttempts', id)
    const snap = await getDoc(dref)
    if (!snap.exists()) throw new Error('Документ не найден')
    attempt.value = {id: snap.id, ...snap.data()}
    await hydrateAudioUrls()
  } catch (e) {
    console.error(e)
    error.value = e?.message || 'Не удалось загрузить результат'
  } finally {
    loading.value = false
  }
}

async function hydrateAudioUrls() {
  const items = Array.isArray(attempt.value?.items) ? attempt.value.items : []
  const jobs = []
  for (const it of items) {
    const files = it?.speaking?.audioFiles
    if (!Array.isArray(files) || !files.length) continue
    for (const af of files) {
      if ((af.url || af.downloadURL) && typeof (af.url || af.downloadURL) === 'string') continue
      if (!af.storagePath) continue
      jobs.push(
          getDownloadURL(sRef(storage, af.storagePath))
              .then((u) => {
                af.url = u
                af.downloadURL = u
              })
              .catch((err) => {
                console.warn('getDownloadURL failed for', af.storagePath, err)
              })
      )
    }
  }
  if (jobs.length) {
    await Promise.allSettled(jobs)
  }
}

function goBack() {
  if (history.length > 1) history.back()
  else router.push('/cabinet')
}

onMounted(loadAttempt)
</script>

<template>
  <div class="arch">
    <div class="arch__head">
      <button class="arch__back" @click="goBack">← Назад</button>
      <h1 class="arch__title">Результат экзамена</h1>
    </div>
    <div v-if="loading" class="arch__box">Загрузка…</div>
    <div v-else-if="error" class="arch__box arch__box--error">{{ error }}</div>
    <div v-else-if="attempt" class="arch__content">
      <div class="arch__card">
        <div class="arch__row"><b>Уровень:</b> {{ attempt.level || '—' }}</div>
        <div class="arch__row">
          <b>Статус:</b>
          <span class="arch__badge" :class="attempt.status === 'finished' ? 'is-finished' : 'is-draft'">
            {{ (attempt.status || 'draft').toUpperCase() }}
          </span>
        </div>
        <div class="arch__row">
          <b>Начало:</b> {{ toDateFlexible(attempt.startedAt)?.toLocaleString?.() || '—' }}
<!--          <span class="arch__dot">•</span>-->
<!--          <b>Окончание:</b> {{ toDateFlexible(attempt.finishedAt)?.toLocaleString?.() || '—' }}-->
<!--          <span class="arch__dot">•</span>-->
<!--          <b>Длительность:</b> {{ attempt.durationSec ?? 0 }} c-->
        </div>
        <div v-if="attempt.status === 'finished'" class="arch__row">
          <b>Средний балл:</b> {{ attempt.averageScore }} / 10
        </div>
        <div v-if="attempt.perModuleScores" class="arch__chips">
          <span v-for="(score, mod) in attempt.perModuleScores" :key="mod" class="arch__chip">
            {{ mod }}: {{ score }}/10
          </span>
        </div>
      </div>
      <div v-for="(list, mod) in itemsByModule" :key="mod" class="arch__module">
        <h2 class="arch__mod-title">{{ mod }}</h2>
        <div v-for="it in list" :key="it.id" class="arch__item">
          <div class="arch__left">
            <p v-if="it.taskText"><b>Aufgabe:</b> {{ it.taskText }}</p>
            <p v-if="it.question"><b>Frage:</b> {{ it.question }}</p>
            <p class="arch__ans"><b>Ответ:</b> {{ it.answer || '—' }}</p>
            <div v-if="it.feedback" class="arch__fb">
              <p v-if="it.feedback.result"><b>Оценка:</b> {{ it.feedback.result }}</p>
              <p v-if="it.feedback.feedback"><b>Комментарий:</b> {{ it.feedback.feedback }}</p>
              <p v-if="it.feedback.correctedVersion"><b>Korrektur:</b> {{ it.feedback.correctedVersion }}</p>
            </div>
            <div v-if="it.speaking?.audioFiles?.length" class="arch__speaking">
              <div v-for="(af, idx) in it.speaking.audioFiles" :key="idx" class="arch__audio">
<!--                <div><b>Audio #{{ idx + 1 }}:</b> ~{{ formatSec(af.durationSec) }}</div>-->
<!--                <div v-if="af.transcription"><b>Transkript:</b> {{ af.transcription }}</div>-->
              </div>
            </div>
          </div>
          <div class="arch__score">
            <div class="arch__score-badge">{{ it.score }} / 10</div>
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
  padding: 20px;
  font-family: "Nunito", sans-serif;
}

.arch__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.arch__back {
  border: 3px solid #000;
  border-radius: 12px;
  padding: 8px 12px;
  background: #ffd54f;
  font-weight: 800;
  box-shadow: 3px 3px 0 #000;
  cursor: pointer;
}

.arch__title {
  font-size: 1.8rem;
  font-weight: 900;
  color: var(--titleColor, #111);
}

.arch__box {
  border: 2px solid #000;
  border-radius: 16px;
  padding: 12px;
  background: #fff7dd;
  box-shadow: 3px 3px 0 #000;
  margin-top: 12px;
}

.arch__box--error {
  background: #ffe2e2;
}

.arch__card {
  border: 3px solid #000;
  border-radius: 16px;
  padding: 12px;
  background: #f3f4f6;
  box-shadow: 4px 4px 0 #000;
  margin-top: 12px;
}

.arch__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
  align-items: center;
}

.arch__badge {
  font-size: .75rem;
  padding: 2px 8px;
  border: 2px solid #000;
  border-radius: 999px;
  font-weight: 900;
  text-transform: uppercase;
}

.is-finished {
  background: #bbf7d0;
}

.is-draft {
  background: #fde68a;
}

.arch__dot {
  opacity: .6;
}

.arch__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.arch__chip {
  font-size: .85rem;
  background: #eee;
  border: 2px solid #000;
  border-radius: 999px;
  padding: 2px 8px;
}

.arch__module {
  margin-top: 18px;
}

.arch__mod-title {
  font-size: 1.3rem;
  font-weight: 900;
  margin-bottom: 8px;
}

.arch__item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 10px;
  background: #fff;
  margin-bottom: 10px;
}

.arch__left p {
  margin: 4px 0;
}

.arch__ans {
  margin-top: 6px;
}

.arch__fb {
  margin-top: 6px;
  font-size: .95rem;
}

.arch__speaking {
  margin-top: 8px;
}

.arch__audio {
  margin-top: 6px;
}

.arch__player {
  display: block;
  margin-top: 4px;
  width: 280px;
}

.arch__no-audio {
  margin-top: 4px;
  font-size: .9rem;
  opacity: .7;
}

.arch__score-badge {
  background: #42a5f5;
  color: #fff;
  padding: 6px 10px;
  border-radius: 12px;
  font-weight: 900;
  min-width: 90px;
  text-align: center;
}
</style>
