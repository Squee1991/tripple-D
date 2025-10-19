<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocalePath } from '#i18n'

// --- роутинг / локаль ---
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

// --- параметры урла ---
const eventId = computed(() => String(route.params.id || ''))
const questId = computed(() => String(route.query.questId || 'q1'))
const stepNum = computed(() => {
  const n = Number(route.query.step || 1)
  return Number.isFinite(n) && n > 0 ? n : 1
})

// --- загрузка данных ---
const loading = ref(true)
const eventData = ref({ quests: [] })

async function loadJson(id) {
  loading.value = true
  try {
    // public/events/event-<id>.json
    const data = await $fetch(`/events/event-${id}.json`, { retry: 0 })
    eventData.value = (data && typeof data === 'object') ? data : { quests: [] }
  } catch (e) {
    console.warn('JSON load failed:', e)
    eventData.value = { quests: [] }
  } finally {
    loading.value = false
  }
}

onMounted(() => loadJson(eventId.value))
watch(eventId, id => loadJson(id))

// --- вычисления по текущему квесту/шагу ---
const quest = computed(() => eventData.value.quests.find(q => q.id === questId.value) || null)
const step  = computed(() => quest.value?.steps?.[stepNum.value - 1] || null)

// --- навигация ---
function backToEvent() {
  router.push(localePath({ name: 'event-id', params: { id: eventId.value } }))
}

function gotoStep(next) {
  router.push(localePath({
    name: 'event-id-session',
    params: { id: eventId.value },
    query:  { questId: questId.value, step: String(next) }
  }))
}

function nextStep() {
  const total = quest.value?.steps?.length || 0
  const next = stepNum.value + 1
  if (next <= total) gotoStep(next)
  else backToEvent()
}

// --- локальное состояние проверки заданий ---
const selectedIndex = ref(null)   // для mcq
const userFill = ref('')          // для fill
const wasWrong = ref(false)       // флаг ошибки

// сброс при смене шага
watch(step, () => {
  selectedIndex.value = null
  userFill.value = ''
  wasWrong.value = false
})

// обработчики ответов
function answerMCQ(i) {
  selectedIndex.value = i
  if (!step.value || step.value.type !== 'mcq') return
  if (i === step.value.answerIndex) nextStep()
  else wasWrong.value = true
}

function answerTF(userBool) {
  if (!step.value || step.value.type !== 'tf') return
  if (userBool === step.value.answerBool) nextStep()
  else wasWrong.value = true
}

function answerFill() {
  if (!step.value || step.value.type !== 'fill') return
  const a = (step.value.answerText || '').trim().toLowerCase()
  const u = (userFill.value || '').trim().toLowerCase()
  if (u === a) nextStep()
  else wasWrong.value = true
}
</script>

<template>
  <div class="session">
    <div v-if="loading" class="state">Загрузка…</div>

    <div v-else-if="!quest" class="state">
      Квест не найден.
      <button class="btn" @click="backToEvent">Назад</button>
    </div>

    <div v-else-if="!step" class="state">
      Шаг не найден.
      <button class="btn" @click="backToEvent">Назад</button>
    </div>

    <div v-else class="card">
      <div class="head">
        <h2 class="title">{{ quest.title }}</h2>
        <div class="meta">Шаг {{ stepNum }} / {{ quest.steps.length }}</div>
      </div>

      <!-- WORD -->
      <div v-if="step.type === 'word'">
        <p class="q">Слово:</p>
        <p class="word">{{ step.props?.word }}</p>
        <button class="btn primary" @click="nextStep">Далее</button>
      </div>

      <!-- MCQ -->
      <div v-else-if="step.type === 'mcq'">
        <p class="q">{{ step.question }}</p>
        <div class="options">
          <button
              v-for="(opt,i) in step.options"
              :key="i"
              class="opt"
              :class="{
              selected: selectedIndex === i,
              wrong: wasWrong && selectedIndex === i && i !== step.answerIndex
            }"
              @click="answerMCQ(i)"
          >{{ opt }}</button>
        </div>
        <div v-if="wasWrong" class="hint">Неверно, попробуй ещё раз</div>
      </div>

      <!-- TRUE / FALSE -->
      <div v-else-if="step.type === 'tf'">
        <p class="q">{{ step.statement }}</p>
        <div class="options inline">
          <button class="opt" @click="answerTF(true)">Правда</button>
          <button class="opt" @click="answerTF(false)">Ложь</button>
        </div>
        <div v-if="wasWrong" class="hint">Неверно</div>
      </div>

      <!-- FILL -->
      <div v-else-if="step.type === 'fill'">
        <p class="q">{{ step.prompt }}</p>
        <div class="fill">
          <input v-model="userFill" class="input" placeholder="Ваш ответ" @keyup.enter="answerFill" />
          <button class="opt" @click="answerFill">Проверить</button>
        </div>
        <div v-if="wasWrong" class="hint">Неверно</div>
      </div>

      <!-- FALLBACK -->
      <div v-else>
        Неизвестный тип шага: <code>{{ step.type }}</code>
        <div class="options">
          <button class="btn" @click="nextStep">Пропустить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.session { padding: 16px; }
.state { display: grid; gap: 12px; place-items: start; }
.card {
  display: grid; gap: 16px;
  background: #ffffffc8; border: 2px solid #eef2ff; border-radius: 16px;
  padding: 16px; backdrop-filter: blur(4px);
}
.head { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
.title { font-weight: 900; color: #1A2140; }
.meta { font-weight: 800; color: #5873c5; }
.q { font-weight: 800; margin: 4px 0 8px; color: #2a3257; }
.word { font-size: 28px; font-weight: 900; color: #1A2140; margin-bottom: 10px; }

.options { display: grid; gap: 8px; }
.options.inline { grid-auto-flow: column; justify-content: start; }
.opt, .btn {
  padding: 10px 14px; border-radius: 12px; border: 2px solid #dfe7ff; background: #f4f7ff;
  cursor: pointer; font-weight: 800;
}
.opt:hover, .btn:hover { background: #e8f0ff; }
.opt.selected { outline: 2px solid #6aa3ff; }
.opt.wrong { background: #ffe5e5; border-color: #ffbdbd; }
.btn.primary { background: #51c150; color: #fff; border-color: #3aa93a; }
.hint { color: #c01e1e; font-weight: 800; }

.fill { display: flex; gap: 8px; align-items: center; }
.input {
  padding: 10px 12px; border-radius: 10px; border: 2px solid #dfe7ff; min-width: 220px;
  font-weight: 700;
}
</style>
