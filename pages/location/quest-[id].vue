<template>
  <div class="quest-only">
    <div v-if="loading" class="loading">Загрузка квеста...</div>
    <div v-else-if="error" class="error">
      Ошибка: {{ error }}
      <div class="tiny">questId: {{ questId }} | region: {{ regionKey || '—' }}</div>
      <button class="btn" @click="goBack">Назад</button>
    </div>
    <div v-else-if="task" class="question-card">
      <div class="q-top">
        <div class="q-num">Вопрос {{ currentIndex + 1 }} / {{ requiredTasks }}</div>
      </div>
      <div class="q-text">{{ task.question }}</div>
      <ul class="options" :class="{ locked: showResult }">
        <li v-for="opt in task.options" :key="opt">
          <button
              class="opt-btn"
              :class="optionClass(opt)"
              @click="choose(opt)"
          >
            {{ opt }}
          </button>
        </li>
      </ul>
      <div v-if="showResult" class="feedback" :class="isCorrect ? 'ok' : 'bad'">
        <span class="icon">{{ isCorrect ? '✓' : '✗' }}</span>
        <span class="text">
          {{ isCorrect ? 'Верно!' : `Неверно. Правильно: ${task.answer}` }}
        </span>
      </div>
      <div class="controls">
        <button class="btn" :disabled="!selected || showResult" @click="confirm">Ответить</button>
        <button class="btn secondary" :disabled="showResult" @click="goBack">Выйти</button>
      </div>
    </div>
    <div v-else class="done-box">
      <div class="done-title">{{ success ? 'Квест выполнен! 🎉' : 'Квест провален' }}</div>
      <div class="done-sub">Правильных: {{ correctCount }} из {{ requiredTasks }} (мин. {{ minCorrect }})</div>
      <div class="done-actions">
        <button class="btn" @click="restart">Ещё раз</button>
        <button class="btn primary" @click="goBack">Вернуться</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {regions} from '~/utils/regions.js'

const route = useRoute()
const router = useRouter()

const questId = computed(() => String(route.params.id || route.params.questId || ''))
const regionKey = ref(String(route.query.region || ''))

const loading = ref(true)
const error = ref('')
const quest = ref(null)

const allRegionKeys = regions.map(r => r.pathTo)

const currentIndex = ref(0)
const selected = ref('')
const correctCount = ref(0)
const finished = ref(false)

const showResult = ref(false)
const isCorrect = ref(false)

const requiredTasks = computed(() =>
    quest.value?.conditions?.requiredTasks ?? quest.value?.tasks?.length ?? 0
)
const minCorrect = computed(() =>
    quest.value?.conditions?.minCorrect ?? requiredTasks.value
)
const task = computed(() =>
    finished.value ? null : (quest.value?.tasks?.[currentIndex.value] ?? null)
)
const success = computed(() => correctCount.value >= minCorrect.value)

function optionClass(opt) {
  if (showResult.value) {
    if (opt === task.value.answer) return 'correct pop'
    if (opt === selected.value) return 'wrong shake'
    return 'dim'
  }
  return selected.value === opt ? 'chosen' : ''
}

async function tryLoadFrom(region) {
  const res = await fetch(`/quests/quests-${region}.json`)
  if (!res.ok) return null
  const list = await res.json()
  const arr = Array.isArray(list) ? list : [list]
  return arr.find(q => q.questId === questId.value) || null
}

async function loadQuest() {
  loading.value = true
  error.value = ''
  quest.value = null
  try {
    if (regionKey.value) {
      const q = await tryLoadFrom(regionKey.value)
      if (q) quest.value = q
    }
    if (!quest.value) {
      for (const key of allRegionKeys) {
        const q = await tryLoadFrom(key)
        if (q) {
          quest.value = q;
          regionKey.value = key;
          break
        }
      }
    }
    if (!quest.value) throw new Error('Квест не найден')
  } catch (e) {
    error.value = e.message || String(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadQuest)

function choose(opt) {
  if (finished.value || showResult.value || !task.value) return
  selected.value = opt
}

function confirm() {
  if (!task.value || !selected.value || showResult.value) return
  isCorrect.value = selected.value === task.value.answer
  if (isCorrect.value) correctCount.value += 1

  showResult.value = true

  setTimeout(() => {
    selected.value = ''
    showResult.value = false

    if (currentIndex.value + 1 >= requiredTasks.value) {
      finished.value = true
    } else {
      currentIndex.value += 1
    }
  }, 900)
}

function restart() {
  currentIndex.value = 0
  selected.value = ''
  correctCount.value = 0
  finished.value = false
  showResult.value = false
}

function goBack() {
  if (regionKey.value) router.push(`/location/${regionKey.value}`)
  else router.push('/location')
}
</script>

<style>
.quest-only {
  padding: 20px;
  color: #e5e7eb;
}

.loading, .error, .done-box {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #1f2937;
  background: #0b1220;
  color: #e5e7eb;
}

.error {
  border-color: #7f1d1d;
  background: #3f1d1d;
}

.tiny {
  font-size: 12px;
  opacity: .8;
}

.question-card {
  border: 2px solid black;
  border-radius: 12px;
  padding: 16px;
  background: #111827;
  color: #fff;
}

.q-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.q-num {
  opacity: .85;
}

.q-text {
  font-size: 18px;
  margin-bottom: 12px;
}

.options {
  display: grid;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0 0 12px;
}

.options.locked {
  pointer-events: none;
}


.opt-btn {
  width: 100%;
  text-align: left;
  border: 1px solid #1f2937;
  background: #0b1220;
  color: #fff;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background .15s ease, border-color .15s ease, transform .15s ease, box-shadow .15s ease;
}

.opt-btn:hover {
  background: #111827;
}

.opt-btn.chosen {
  outline: 2px solid #2563eb;
}

.opt-btn.dim {
  opacity: .6;
}

.opt-btn.correct {
  border-color: #065f46;
  background: #064e3b;
  box-shadow: 0 0 0 2px #065f46 inset;
}

.opt-btn.wrong {
  border-color: #7f1d1d;
  background: #3f1d1d;
  box-shadow: 0 0 0 2px #7f1d1d inset;
}


@keyframes pop-kf {
  0% {
    transform: scale(.98);
  }
  60% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes shake-kf {
  0%, 100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-3px);
  }
  40% {
    transform: translateX(3px);
  }
  60% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
}

.pop {
  animation: pop-kf .35s ease-out;
}

.shake {
  animation: shake-kf .35s ease-out;
}

/* ФИДБЭК */
.feedback {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  padding: 10px 12px;
  font-weight: 700;
  margin: 6px 0 10px;
}

.feedback.ok {
  background: #064e3b;
  border: 1px solid #065f46;
}

.feedback.bad {
  background: #3f1d1d;
  border: 1px solid #7f1d1d;
}

.feedback .icon {
  font-size: 18px;
  line-height: 1;
}

.feedback .text {
  opacity: .95;
}

/* КНОПКИ */
.controls {
  display: flex;
  gap: 10px;
}

.btn {
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  font-weight: 800;
  letter-spacing: .02em;
  border: 1px solid #1f2937;
  background: #0b1220;
  color: #fff;
  cursor: pointer;
}

.btn:hover {
  background: #111827;
}

.btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.btn.secondary {
  background: #0b1220;
}

.btn.primary {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.btn.primary:hover {
  background: #1e40af;
}

.done-box {
  text-align: left;
}

.done-title {
  font-weight: 800;
  margin-bottom: 6px;
}

.done-sub {
  opacity: .9;
  margin-bottom: 10px;
}

.done-actions {
  display: flex;
  gap: 10px;
}
</style>
