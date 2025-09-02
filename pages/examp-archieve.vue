<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userExamStore } from '../store/examStore.js'

const route = useRoute()
const router = useRouter()
const examStore = userExamStore()

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

const itemsByModule = computed(() => {
  const acc = {}
  const items = Array.isArray(examStore.currentArchiveAttempt?.items)
      ? examStore.currentArchiveAttempt.items
      : []
  for (const it of items) {
    const mod = it?.module || 'Unbekannt'
    if (!acc[mod]) acc[mod] = []
    acc[mod].push(it)
  }
  return acc
})

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
      <button class="arch__back" @click="goBack">← Назад</button>
      <h1 class="arch__title">Результат экзамена</h1>
    </div>
    <div v-if="examStore.currentArchiveLoading" class="arch__box">Загрузка…</div>
    <div v-else-if="examStore.currentArchiveError" class="arch__box arch__box--error">{{ examStore.currentArchiveError }}</div>
    <div v-else-if="examStore.currentArchiveAttempt" class="arch__content">
      <div class="arch__card">
        <div class="arch__row"><b>Уровень:</b> {{ examStore.currentArchiveAttempt.level || '—' }}</div>
        <div class="arch__row">
          <b>Статус:</b>
          <span class="arch__badge" :class="examStore.currentArchiveAttempt.status === 'finished' ? 'is-finished' : 'is-draft'">
            {{ (examStore.currentArchiveAttempt.status || 'draft').toUpperCase() }}
          </span>
        </div>
        <div class="arch__row">
          <b>Начало:</b> {{ toDateFlexible(examStore.currentArchiveAttempt.startedAt)?.toLocaleString?.() || '—' }}
        </div>
        <div v-if="examStore.currentArchiveAttempt.status === 'finished'" class="arch__row">
          <b>Средний балл:</b> {{ examStore.currentArchiveAttempt.averageScore }} / 10
        </div>
        <div v-if="examStore.currentArchiveAttempt.perModuleScores" class="arch__chips">
          <span v-for="(score, mod) in examStore.currentArchiveAttempt.perModuleScores" :key="mod" class="arch__chip">
            {{ mod }}: {{ score }}/10
          </span>
        </div>
      </div>
      <div v-for="(list, mod) in itemsByModule" :key="mod" class="arch__module">
        <h2 class="arch__mod-title">{{ mod }}</h2>
        <div v-for="it in list" :key="it.id" class="arch__item">
          <div class="arch__left">
            <p v-if="it.taskText"><b>Die Aufgabe:</b> {{ it.taskText }}</p>
            <p v-if="it.question"><b>Die Frage:</b> {{ it.question }}</p>
            <p class="arch__ans"><b>Die Antwort:</b> {{ it.answer || '—' }}</p>
            <div v-if="it.feedback" class="arch__fb">
              <p v-if="it.feedback.result"><b>Оценка:</b> {{ it.feedback.result }}</p>
              <p v-if="it.feedback.feedback"><b>Комментарий:</b> {{ it.feedback.feedback }}</p>
              <p v-if="it.feedback.correctedVersion"><b>Korrektur:</b> {{ it.feedback.correctedVersion }}</p>
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