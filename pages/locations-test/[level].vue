<template>
  <div class="lt" :class="{ 'lt--rtl': locale === 'ar' }">
    <header class="lt__head">
      <VBackBtn/>
      <h1 class="lt__title">{{ t('locationTest.title', { level }) }}</h1>
    </header>

    <div v-if="error" class="lt__card">
      <p class="lt__text">{{ t('locationTest.error') }}</p>
    </div>

    <!-- уровень ещё не пройден: тест закрыт -->
    <div v-else-if="phase === 'locked'" class="lt__card lt__card--center">
      <span class="lt__lock" aria-hidden="true">🔒</span>
      <p class="lt__result">{{ t('locationTest.lockedTitle') }}</p>
      <p class="lt__text">{{ t('locationTest.lockedText', { level, land: t(`locationNames.${LEVEL_SUMMITS[level]}`) }) }}</p>
      <NuxtLink class="lt__btn lt__btn--link" to="/">{{ t('locationTest.toMap') }}</NuxtLink>
    </div>

    <!-- вступление -->
    <div v-else-if="phase === 'intro'" class="lt__card lt__card--center">
      <span class="lt__chip" :class="'lt__chip--' + level.toLowerCase()">{{ level }}</span>
      <p class="lt__text">{{ t('locationTest.intro') }}</p>
      <p class="lt__hint">{{ t('locationTest.count', { count: totalTasks, topics: data?.topics.length || 0 }) }}</p>
      <button type="button" class="lt__btn" :disabled="!data" data-track="location_test_start" @click="start">
        {{ t('locationTest.start') }}
      </button>
    </div>

    <!-- задание -->
    <div v-else-if="phase === 'test' && task" class="lt__card">
      <!-- сегментная полоса как в квестах: кусочек на задание -->
      <div class="lt__progress" dir="ltr">
        <div class="lt__line" aria-hidden="true">
          <span v-for="(step, i) in progressSteps" :key="i" class="lt__dot" :class="'lt__dot--' + step"></span>
        </div>
        <span class="lt__count">{{ index + 1 }}/{{ tasks.length }}</span>
      </div>
      <p class="lt__topic-now">{{ t(`locationTest.topic.${task.topic}`) }}</p>

      <div :key="index" class="lt__task">
        <!-- инструкция, перевод и немецкое предложение отдельно, как в квестах -->
        <div v-if="questionParts" class="lt__split">
          <p class="lt__instr">{{ questionParts.instruction }}</p>
          <p class="lt__meaning" :class="{ 'lt__meaning--main': !questionParts.sentence }">{{ questionParts.meaning }}</p>
          <p v-if="questionParts.sentence" class="lt__sentence" lang="de" dir="ltr">
            {{ questionParts.before }}<span v-if="questionParts.hasGap" class="lt__gap" :class="gapClass">{{ answered ? rightAnswer : '' }}</span>{{ questionParts.after }}
          </p>
        </div>
        <p v-else class="lt__question">{{ t(task.question) }}</p>
        <p v-if="task.type === 'readAndAnswer'" class="lt__read" lang="de" dir="ltr">{{ t(task.text) }}</p>
        <SoundBtn v-if="task.type === 'speechToText'" :text="task.text"/>

        <div v-if="isChoice" class="lt__options">
          <button
              v-for="option in options"
              :key="option"
              type="button"
              class="lt__option"
              :class="optionClass(option)"
              :disabled="answered"
              @click="selected = option"
          >
            {{ t(option) }}
          </button>
        </div>

        <template v-else-if="isTyping">
          <input
              v-model="typed"
              class="lt__input"
              type="text"
              lang="de"
              dir="ltr"
              autocomplete="off"
              autocapitalize="off"
              :disabled="answered"
              :placeholder="t('locationTest.placeholder')"
              @keyup.enter="primaryAction"
          >
          <div class="lt__letters" dir="ltr">
            <button
                v-for="letter in LETTERS"
                :key="letter"
                type="button"
                class="lt__letter"
                :disabled="answered"
                @click="typed += letter"
            >
              {{ letter }}
            </button>
          </div>
        </template>

        <div v-else class="lt__reorder" dir="ltr">
          <div class="lt__picked">
            <button
                v-for="(word, i) in picked"
                :key="word + i"
                type="button"
                class="lt__word"
                :disabled="answered"
                @click="moveWord(i, picked, bank)"
            >
              {{ t(word) }}
            </button>
          </div>
          <div class="lt__bank">
            <button
                v-for="(word, i) in bank"
                :key="word + i"
                type="button"
                class="lt__word"
                :disabled="answered"
                @click="moveWord(i, bank, picked)"
            >
              {{ t(word) }}
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- панель ответа прижата к низу экрана, как в квестах -->
    <div v-if="phase === 'test' && task" class="lt__actions" :class="feedbackClass">
      <div class="lt__actions-in">
        <div v-if="answered" class="lt__feedback" :class="lastCorrect ? 'lt__feedback--ok' : 'lt__feedback--bad'">
          <img class="lt__feedback-icon" :src="lastCorrect ? RightIcon : WrongIcon" alt="">
          <div v-if="!lastCorrect" class="lt__feedback-text">
            <span>{{ t('locationTest.wrong') }}</span>
            <strong lang="de" dir="ltr">{{ rightAnswer }}</strong>
          </div>
        </div>
        <button type="button" class="lt__action" :class="actionClass" :disabled="!answered && !canCheck" @click="primaryAction">
          {{ !answered ? t('locationTest.check') : index === tasks.length - 1 ? t('locationTest.finish') : t('locationTest.next') }}
        </button>
      </div>
    </div>

    <!-- итог: сначала самые слабые темы -->
    <div v-else-if="phase === 'result'" class="lt__card">
      <div class="lt__ring">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle cx="60" cy="60" r="52" class="lt__ring-track"/>
          <circle
              cx="60" cy="60" r="52"
              class="lt__ring-fill"
              :stroke-dasharray="RING"
              :stroke-dashoffset="RING * (1 - totalCorrect / tasks.length)"
          />
        </svg>
        <span class="lt__score">{{ totalCorrect }}<small>/{{ tasks.length }}</small></span>
      </div>
      <p class="lt__result">{{ t('locationTest.score', { correct: totalCorrect, total: tasks.length }) }}</p>
      <p class="lt__hint">{{ weakTopics.length ? t('locationTest.weakHint') : t('locationTest.allGood') }}</p>

      <ul class="lt__topics">
        <li v-for="topic in topicResults" :key="topic.id" class="lt__topic">
          <div class="lt__topic-row">
            <span class="lt__topic-name">{{ t(`locationTest.topic.${topic.id}`) }}</span>
            <span class="lt__topic-score" dir="ltr">{{ topic.correct }}/{{ topic.total }}</span>
          </div>
          <div class="lt__topic-bar" dir="ltr" aria-hidden="true">
            <span
                class="lt__topic-fill"
                :class="{ 'lt__topic-fill--weak': topic.weak }"
                :style="{ width: (topic.correct / topic.total) * 100 + '%' }"
            ></span>
          </div>
          <NuxtLink
              v-if="topic.weak"
              class="lt__repeat"
              :to="`/location/${topic.land}`"
              data-track="location_test_repeat"
          >
            {{ t('locationTest.repeat') }}: {{ t(topic.landName) }}
          </NuxtLink>
        </li>
      </ul>

      <button type="button" class="lt__btn" @click="start">{{ t('locationTest.retry') }}</button>
      <NuxtLink class="lt__link" to="/">{{ t('locationTest.toMap') }}</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VBackBtn from '~/src/components/V-back-btn.vue'
import SoundBtn from '~/src/components/soundBtn.vue'
import { userChainStore } from '~/store/chainStore.js'
import { userAuthStore } from '~/store/authStore.js'
import { LEVEL_SUMMITS, isLevelFinished } from '~/utils/germanLevel.js'
import RightIcon from '~/assets/images/location-icons/accept.svg'
import WrongIcon from '~/assets/images/location-icons/cancel.svg'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const chainStore = userChainStore()
const authStore = userAuthStore()
const { $track } = useNuxtApp()

const LEVELS = ['A1', 'A2', 'B1']
const LETTERS = ['ä', 'ö', 'ü', 'ß']
const RING = 2 * Math.PI * 52
// тема слабая, если верно меньше 70%
const WEAK_BELOW = 0.7

const level = computed(() => String(route.params.level || '').toUpperCase())
const data = ref(null)
const error = ref(false)
const phase = ref('loading')
const tasks = ref([])
const index = ref(0)
const results = ref([])
const selected = ref('')
const typed = ref('')
const picked = ref([])
const bank = ref([])
const options = ref([])
const answered = ref(false)
const lastCorrect = ref(false)

const task = computed(() => tasks.value[index.value] || null)
const isChoice = computed(() => ['select', 'readAndAnswer'].includes(task.value?.type))
const isTyping = computed(() => ['input', 'speechToText'].includes(task.value?.type))
const totalTasks = computed(() => (data.value?.topics.length || 0) * (data.value?.perTopic || 0))
const totalCorrect = computed(() => results.value.filter(Boolean).length)
const canCheck = computed(() => {
  if (isChoice.value) return !!selected.value
  if (isTyping.value) return !!typed.value.trim()
  return picked.value.length > 0
})
const rightAnswer = computed(() => {
  const item = task.value
  if (!item) return ''
  if (item.type === 'reorder') return item.correctOrder.map(word => t(word)).join(' ')
  return t(item.correctAnswer || item.answer || '')
})

// вопрос в кавычках делим на части: инструкция, перевод, предложение с пропуском
const QUOTE_PAIRS = { '«': ['»'], '“': ['”'], '„': ['”', '“'], '"': ['"'] }
const questionParts = computed(() => {
  if (!task.value) return null
  const text = String(t(task.value.question))
  const open = [...text].findIndex(ch => QUOTE_PAIRS[ch])
  if (open <= 0) return null
  const closers = QUOTE_PAIRS[text[open]]
  let close = -1
  for (let i = open + 1; i < text.length; i++) {
    if (closers.includes(text[i])) { close = i; break }
  }
  if (close === -1) return null
  const instruction = text.slice(0, open).trim().replace(/[:：]\s*$/, '').trim()
  const meaning = text.slice(open + 1, close).trim()
  const sentence = text.slice(close + 1).trim().replace(/^[:：]\s*/, '').trim()
  if (!instruction || !meaning) return null
  const [before, after = ''] = sentence.split('___')
  return { instruction, meaning, sentence, before, after, hasGap: sentence.includes('___') }
})
const progressSteps = computed(() => tasks.value.map((_, i) => {
  if (results.value[i] !== undefined) return results.value[i] ? 'done' : 'wrong'
  return i === index.value ? 'current' : 'pending'
}))
const feedbackClass = computed(() => {
  if (!answered.value) return ''
  return lastCorrect.value ? 'lt__actions--ok' : 'lt__actions--bad'
})
const actionClass = computed(() => {
  if (!answered.value) return 'lt__action--check'
  return lastCorrect.value ? 'lt__action--next' : 'lt__action--wrong'
})
const gapClass = computed(() => {
  if (!answered.value) return ''
  return lastCorrect.value ? 'lt__gap--ok' : 'lt__gap--bad'
})

const shuffled = (list) => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function prepareTask() {
  const item = task.value
  selected.value = ''
  typed.value = ''
  picked.value = []
  answered.value = false
  bank.value = item?.type === 'reorder' ? shuffled(item.words) : []
  options.value = item?.options ? shuffled(item.options) : []
}

function start() {
  tasks.value = data.value.topics.flatMap(topic =>
    shuffled(topic.pool).slice(0, data.value.perTopic).map(item => ({ ...item, topic: topic.id }))
  )
  results.value = []
  index.value = 0
  phase.value = 'test'
  prepareTask()
  $track?.('location_test_started', { level: level.value })
}

function moveWord(i, from, to) {
  const [word] = from.splice(i, 1)
  to.push(word)
}

function isRight(item) {
  const same = (a, b) => chainStore.normalizeSpeechText(a) === chainStore.normalizeSpeechText(b)
  if (item.type === 'reorder') return picked.value.join(' ').trim() === item.correctOrder.join(' ')
  if (item.type === 'input') return same(typed.value, item.correctAnswer || item.answer)
  if (item.type === 'speechToText') {
    const accepted = item.accept?.length ? item.accept : [item.answer || item.correctAnswer]
    return accepted.some(answer => same(typed.value, answer))
  }
  return selected.value === item.answer
}

const optionClass = (option) => {
  if (!answered.value) return { 'lt__option--on': selected.value === option }
  if (option === task.value.answer) return 'lt__option--ok'
  return option === selected.value ? 'lt__option--bad' : ''
}

const topicResults = computed(() => {
  const map = new Map()
  tasks.value.forEach((item, i) => {
    if (i >= results.value.length) return
    const row = map.get(item.topic) || { id: item.topic, correct: 0, total: 0, wrongByLand: {} }
    row.total++
    if (results.value[i]) row.correct++
    else row.wrongByLand[item.land] = (row.wrongByLand[item.land] || 0) + 1
    map.set(item.topic, row)
  })
  return [...map.values()]
    .map(row => {
      // повторять ведём в землю, где больше всего ошибок
      const land = Object.entries(row.wrongByLand).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
      const landName = tasks.value.find(item => item.land === land)?.landName || ''
      return { ...row, land, landName, weak: row.correct / row.total < WEAK_BELOW }
    })
    .sort((a, b) => a.correct / a.total - b.correct / b.total)
})
const weakTopics = computed(() => topicResults.value.filter(topic => topic.weak))

async function finish() {
  phase.value = 'result'
  const topics = Object.fromEntries(topicResults.value.map(row => [row.id, { correct: row.correct, total: row.total }]))
  $track?.('location_test_finished', {
    level: level.value,
    correct: totalCorrect.value,
    total: tasks.value.length,
    weak_topics: weakTopics.value.length
  })
  try {
    await chainStore.saveLocationTest(level.value, {
      correct: totalCorrect.value,
      total: tasks.value.length,
      topics,
      at: Date.now()
    })
  } catch (e) {
    console.error('Не удалось сохранить итоговый тест:', e)
  }
}

function primaryAction() {
  if (!answered.value) {
    if (!canCheck.value) return
    lastCorrect.value = isRight(task.value)
    results.value[index.value] = lastCorrect.value
    answered.value = true
    return
  }
  if (index.value === tasks.value.length - 1) return finish()
  index.value++
  prepareTask()
}

// по прямой ссылке тоже нельзя открыть тест раньше времени: ждём вход и загружаем прогресс
const authReady = () => new Promise(resolve => {
  if (authStore.initialized) return resolve()
  const stop = watch(() => authStore.initialized, (ready) => {
    if (!ready) return
    stop()
    resolve()
  })
})

onMounted(async () => {
  if (!LEVELS.includes(level.value)) return router.replace('/')
  await authReady()
  if (!authStore.uid) return router.replace('/')
  try {
    await chainStore.loadProgressFromFirebase()
    if (!isLevelFinished(chainStore.questProgress, level.value)) {
      phase.value = 'locked'
      return
    }
    data.value = await $fetch(`/location-tests/${level.value}.json`)
    phase.value = 'intro'
  } catch (e) {
    console.error('Не удалось загрузить итоговый тест:', e)
    error.value = true
  }
})
</script>

<style scoped>
.lt {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: 12px 12px 170px;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
}

.lt__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.lt__title {
  flex: 1;
  min-width: 0;
  color: var(--title);
  font-size: 20px;
  font-weight: 900;
}

.lt__card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 24px;
  background: var(--tabBg);
}

.lt__card--center {
  align-items: center;
  text-align: center;
}

.lt__lock {
  font-size: 42px;
  line-height: 1;
}

.lt__btn--link {
  display: block;
  box-sizing: border-box;
  text-align: center;
  text-decoration: none;
}

.lt__chip {
  padding: 5px 16px;
  border-radius: 14px;
  border-bottom: 4px solid rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 22px;
  font-weight: 900;
}

.lt__chip--a1 {
  background: #22c55e;
}

.lt__chip--a2 {
  background: #3b82f6;
}

.lt__chip--b1 {
  background: #8b5cf6;
}

.lt__text {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.45;
}

.lt__hint {
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  opacity: 0.75;
}

.lt__btn {
  width: 100%;
  padding: 13px;
  border: none;
  border-radius: 50px;
  background: var(--tabsSlideBg);
  box-shadow: var(--tabSlideBoxShadow);
  color: #fff;
  font-family: inherit;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
}

html.light .lt__btn {
  background: #6358ac;
}

.lt__btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.lt__progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lt__line {
  display: flex;
  flex: 1;
  gap: 2px;
  min-width: 0;
}

.lt__dot {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 15px;
  border-radius: 5px;
  background: rgba(127, 127, 127, 0.3);
  transition: background 0.3s ease;
}

.lt__dot--done {
  background: linear-gradient(180deg, #66d16e 0%, #43a047 100%);
}

.lt__dot--wrong {
  background: linear-gradient(180deg, #f2706c 0%, #d9534f 100%);
}

.lt__dot--current {
  background: linear-gradient(180deg, #6f9dff 0%, #3d7bf5 100%);
}

.lt__count {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 900;
}

.lt__topic-now {
  font-size: 12px;
  font-weight: 800;
  opacity: 0.75;
}

.lt__task {
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: lt-in 0.2s ease;
}

.lt__question {
  font-size: 16px;
  font-weight: 800;
  line-height: 1.4;
}

.lt__split {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.lt__instr {
  font-size: 13px;
  font-weight: 700;
  opacity: 0.7;
}

/* задание без плашки: варианты ответа это кнопки, задание это текст */
.lt__meaning {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.35;
}

.lt__meaning--main {
  font-size: 18px;
  font-weight: 900;
}

.lt__sentence {
  width: 100%;
  font-size: 19px;
  font-weight: 800;
  line-height: 1.5;
}

.lt__gap {
  display: inline-block;
  min-width: 62px;
  min-height: 1.15em;
  margin: 0 3px;
  padding: 0 6px;
  border-bottom: 3px solid #3b82f6;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.18);
  line-height: 1.2;
  text-align: center;
  vertical-align: -0.15em;
}

.lt__gap--ok {
  border-bottom-color: #22c55e;
  background: rgba(34, 197, 94, 0.18);
  color: #22c55e;
}

.lt__gap--bad {
  border-bottom-color: #ef4444;
  background: rgba(239, 68, 68, 0.18);
  color: #ef4444;
}

.lt__read {
  padding: 12px;
  border-radius: 14px;
  background: var(--settingsSectionBg);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
}

.lt__options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
}

.lt__option {
  width: 100%;
  padding: 12px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  background: var(--settingsSectionBg);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  color: var(--titleColor);
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s, border-color 0.15s;
}

.lt__option:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: 0 1px 0 var(--tabsSlideBorderColor);
}

.lt__option--on {
  border-color: #8b7cf6;
  box-shadow: 0 4px 0 #6358ac;
}

.lt__option--ok {
  border-color: #16a34a;
  background: #22c55e;
  box-shadow: 0 4px 0 #16a34a;
  color: #fff;
}

.lt__option--bad {
  border-color: #dc2626;
  background: #ef4444;
  box-shadow: 0 4px 0 #dc2626;
  color: #fff;
}

.lt__input {
  width: 100%;
  padding: 12px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  outline: none;
  background: var(--settingsSectionBg);
  color: var(--titleColor);
  font-family: inherit;
  font-size: 16px;
  font-weight: 800;
}

.lt__letters {
  display: flex;
  gap: 6px;
}

.lt__letter,
.lt__word {
  padding: 8px 12px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 12px;
  background: var(--settingsSectionBg);
  color: var(--titleColor);
  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.lt__reorder {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lt__picked {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 48px;
  padding: 6px;
  border: 3px dashed var(--tabsSlideBorderColor);
  border-radius: 14px;
}

.lt__bank {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.lt__actions {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.lt__actions--ok {
  border-top: 3px solid #2e7d32;
  background-color: #d4edda;
}

.lt__actions--bad {
  border-top: 3px solid #c62828;
  background-color: #f8d7da;
}

.lt__actions-in {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 500px;
  padding: 14px 20px;
  padding-bottom: calc(14px + env(safe-area-inset-bottom));
}

.lt__feedback {
  display: flex;
  align-items: center;
  gap: 10px;
  animation: lt-up 0.2s ease;
}

.lt__feedback--ok {
  justify-content: center;
}

.lt__feedback-icon {
  flex-shrink: 0;
  width: 34px;
}

.lt__feedback-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
  color: #c62828;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.3;
}

.lt__feedback-text strong {
  font-size: 16px;
  font-weight: 900;
}

.lt__action {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 50px;
  color: #fff;
  font-family: inherit;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.lt__action:disabled {
  opacity: 0.5;
  cursor: default;
}

.lt__action--check {
  background-color: #3b82f6;
  box-shadow: 0 5px 0 #2563eb;
}

.lt__action--next {
  background-color: #4ade80;
  box-shadow: 0 5px 0 #12a647;
}

.lt__action--wrong {
  background-color: #ef4444;
  box-shadow: 0 5px 0 #dc2626;
}

.lt__action:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: none;
}

.lt__ring {
  position: relative;
  width: 132px;
  height: 132px;
  margin: 0 auto;
}

.lt__ring svg {
  display: block;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.lt__ring circle {
  fill: none;
  stroke-width: 11;
}

.lt__ring-track {
  stroke: var(--settingsSectionBg);
}

.lt__ring-fill {
  stroke: #8b7cf6;
  stroke-linecap: round;
}

.lt__score {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  font-weight: 900;
}

.lt__score small {
  font-size: 17px;
  opacity: 0.6;
}

.lt__result {
  font-size: 17px;
  font-weight: 900;
  text-align: center;
}

.lt__topics {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.lt__topic-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 800;
}

.lt__topic-name {
  min-width: 0;
}

.lt__topic-score {
  flex-shrink: 0;
}

.lt__topic-bar {
  height: 9px;
  overflow: hidden;
  border-radius: 9px;
  background: var(--settingsSectionBg);
}

.lt__topic-fill {
  display: block;
  height: 100%;
  border-radius: 9px;
  background: #22c55e;
}

.lt__topic-fill--weak {
  background: #ef4444;
}

.lt__repeat {
  display: inline-block;
  margin-top: 6px;
  color: #8b7cf6;
  font-size: 13px;
  font-weight: 900;
  text-decoration: underline;
}

.lt__link {
  color: var(--titleColor);
  font-size: 14px;
  font-weight: 800;
  text-align: center;
  text-decoration: underline;
  opacity: 0.7;
}

@keyframes lt-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes lt-in {
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
