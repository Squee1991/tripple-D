<template>
  <div class="session" :style="{ '--accent': accent }">
    <header class="session__top">
      <button type="button" class="session__close" :aria-label="t('flashCards.backToDeck')" @click="exit">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3.5"
             stroke-linecap="round" aria-hidden="true">
          <line x1="6" y1="6" x2="18" y2="18"></line>
          <line x1="18" y1="6" x2="6" y2="18"></line>
        </svg>
      </button>
      <div class="session__bar">
        <span class="session__bar-fill" :style="{ width: progressPercent + '%' }"></span>
      </div>
      <span class="session__mode">{{ modeTitle }}</span>
    </header>

    <div v-if="!decksStore.loaded" class="session__loading"><span class="session__spinner"></span></div>

    <!-- нечего делать: нет новых / нечего повторять -->
    <section v-else-if="!queue.length && !finished" class="session__empty">
      <p class="session__empty-icon" aria-hidden="true">🗂️</p>
      <p class="session__empty-text">{{ emptyText }}</p>
      <button type="button" class="session__btn" @click="exit">{{ t('flashCards.backToDeck') }}</button>
    </section>

    <section v-else-if="finished" class="session__result">
      <p class="session__result-icon" aria-hidden="true">{{ resultIcon }}</p>
      <h1 class="session__result-title">{{ t('flashCards.resultTitle') }}</h1>
      <template v-if="mode === 'study' || mode === 'learn'">
        <p v-if="reviewedCards.length" class="session__result-line">
          {{ t('flashCards.resultCorrect', {count: firstTryRight, total: reviewedCards.length}) }}
        </p>
        <p v-if="learnedCards.length" class="session__result-line">{{ t('flashCards.resultLearned', {count: learnedCards.length}) }}</p>
      </template>
      <!-- карточки: итог круга, две стопки -->
      <div v-else-if="mode === 'flash'" class="session__piles">
        <div class="session__pile session__pile--know">
          <span class="session__pile-num">{{ sessionCards.length - unknownPile.length }}</span>
          <span class="session__pile-cap">{{ t('flashCards.know') }}</span>
        </div>
        <div class="session__pile session__pile--unknown">
          <span class="session__pile-num">{{ unknownPile.length }}</span>
          <span class="session__pile-cap">{{ t('flashCards.again') }}</span>
        </div>
      </div>
      <p v-else class="session__result-line">
        {{ t('flashCards.resultCorrect', {count: firstTryRight, total: sessionCards.length}) }}
      </p>
      <p v-if="mode !== 'flash'" class="session__result-sub">{{ t('flashCards.resultNext') }}</p>
      <div class="session__result-actions">
        <button v-if="mode === 'flash' && unknownPile.length" type="button" class="session__btn" @click="build(unknownPile)">
          {{ t('flashCards.repeatUnknown', {count: unknownPile.length}) }}
        </button>
        <button v-else-if="canRepeat" type="button" class="session__btn session__btn--ghost" @click="build()">
          {{ t('flashCards.repeatSession') }}
        </button>
        <button type="button" class="session__btn" @click="exit">{{ t('flashCards.backToDeck') }}</button>
      </div>
    </section>

    <!-- карточки: перевернуть и сказать, знаешь ли -->
    <section v-else-if="mode === 'flash'" class="session__flash">
      <p class="session__hint">{{ flipped ? t('flashCards.rateYourself') : t('flashCards.tapToFlip') }}</p>
      <Transition name="card-swap" mode="out-in">
      <button :key="step" type="button" class="flip" :class="{ 'flip--back': flipped }" @click="flip">
        <span class="flip__inner">
          <span class="flip__face flip__face--front">
            <span class="flip__word">
              <span v-if="current.card.article" :style="{ color: ARTICLE_COLORS[current.card.article] }">
                {{ current.card.article }}
              </span>
              {{ current.card.de }}
            </span>
            <span v-if="current.card.plural" class="flip__sub">die {{ current.card.plural }}</span>
          </span>
          <span class="flip__face flip__face--back">
            <span class="flip__word flip__word--native">{{ current.card.translation }}</span>
            <span v-if="current.card.perfekt" class="flip__sub">{{ current.card.perfekt }}</span>
            <span v-if="current.card.example" class="flip__sub flip__sub--example">{{ current.card.example }}</span>
          </span>
        </span>
      </button>
      </Transition>
      <!-- оценка только после переворота: сначала вспомни сам -->
      <div v-if="flipped" class="session__flash-actions">
        <button type="button" class="session__btn session__btn--again" @click="flashAnswer(false)">
          {{ t('flashCards.again') }}
        </button>
        <button type="button" class="session__btn session__btn--know" @click="flashAnswer(true)">
          {{ t('flashCards.know') }}
        </button>
      </div>
    </section>

    <section v-else class="session__task">
      <VCardTask :key="step" :task="current" :accent="accent" @next="taskDone"/>
    </section>
  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useSeoMeta} from '#imports'
import VCardTask from '~/src/components/cards/V-cardTask.vue'
import {userAuthStore} from '~/store/authStore.js'
import {useDecksStore} from '~/store/decksStore.js'
import {ARTICLE_COLORS, loadDictionary, randomTranslations} from '~/utils/cardDictionary.js'
import {shuffleList, LESSON_WORD_COUNT, REVIEW_WORD_COUNT} from '~/utils/wordReview.js'
import {getSpeechAudio} from '~/utils/googleTTS.js'
import {playLevelCompleted, initSound} from '~/utils/soundManager.js'
import {vibrateTap} from '~/utils/haptics.js'
import {gradeAnswer} from '~/utils/memoryModel.js'

useSeoMeta({robots: 'noindex, nofollow'})

const {t, locale} = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = userAuthStore()
const decksStore = useDecksStore()

const deckId = computed(() => String(route.params.deckId || ''))
// «all» — повторение по всем колодам
const isAll = computed(() => deckId.value === 'all')
// study: главный режим «Учить» (повтор по сроку + новые слова); learn/review остались для ссылок; flash: быстрый просмотр
const mode = computed(() => (isAll.value ? 'review' : (['study', 'learn', 'review', 'flash'].includes(route.query.mode) ? route.query.mode : 'study')))
const deck = computed(() => (isAll.value ? null : decksStore.deckById(deckId.value)))
const accent = computed(() => deck.value?.color || '#8b5cf6')

const queue = ref([])
// step: номер показа (ключ для перерисовки задания), done: сколько заданий уже засчитано
const step = ref(0)
const done = ref(0)
const finished = ref(false)
const flipped = ref(false)
const sessionCards = ref([])
const firstTryRight = ref(0)
// «Карточки»: что отметили «не знаю» в этом круге
const unknownPile = ref([])
// «Учить»: что в этой сессии повторяли по сроку и что учили впервые
const reviewedCards = ref([])
const learnedCards = ref([])
// карточки, где уже была ошибка: в итоге «верно с первого раза» их не считаем
const missed = new Set()
let built = false

const current = computed(() => queue.value[0])
// «ещё раз» и ошибки прогресс не двигают: засчитанные из засчитанных + оставшихся в очереди
const progressPercent = computed(() => {
  const total = done.value + queue.value.length
  return total ? Math.round((done.value / total) * 100) : 0
})

const modeTitle = computed(() => ({
  study: t('flashCards.sessionLearn'),
  learn: t('flashCards.sessionLearn'),
  review: t('flashCards.sessionReview'),
  flash: t('flashCards.sessionFlash')
}[mode.value]))

const emptyText = computed(() => {
  if (mode.value === 'study') return t('flashCards.studyDoneSub')
  if (mode.value === 'learn') return t('flashCards.noNew')
  if (mode.value === 'review') return t('flashCards.noDue')
  return t('flashCards.needCards')
})
const resultIcon = computed(() => {
  if (mode.value === 'learn' || (mode.value === 'study' && !reviewedCards.value.length)) return '🎓'
  if (mode.value === 'flash') return unknownPile.value.length ? '💪' : '🏆'
  return firstTryRight.value === sessionCards.value.length ? '🏆' : '💪'
})
const canRepeat = computed(() => mode.value === 'flash'
    // карточки: «ещё круг со всеми», если незнакомых не осталось
    || ((mode.value === 'learn' || mode.value === 'study') && decksStore.freshCards(deckId.value).length > 0)
    || (mode.value === 'study' && decksStore.dueCards(deckId.value).length > 0)
    || (mode.value === 'review' && decksStore.dueCards(isAll.value ? null : deckId.value).length > 0))

// 3 неверных перевода: из этой колоды, а если в ней мало слов, из словаря
function meaningOptions(card, pool) {
  const others = shuffleList(pool.filter(item => item.id !== card.id && item.translation && item.translation !== card.translation)
      .map(item => item.translation))
  const unique = [...new Set(others)].slice(0, 3)
  if (unique.length < 3) unique.push(...randomTranslations(locale.value, 3 - unique.length, [card.translation, ...unique]))
  return shuffleList([card.translation, ...unique])
}

// задание при повторе зависит от уровня карточки, как у слов в уроках
function reviewTaskType(card) {
  const level = Number(card.level || 1)
  if (level <= 1) return 'meaning'
  if (level === 2) return 'write'
  if (level === 3) return 'audio'
  if (level === 4 && card.plural) return 'plural'
  if (level === 4 && card.article) return 'article'
  return Math.random() < 0.5 ? 'write' : 'audio'
}

// kind: review — повтор по сроку (первый ответ двигает дату), learn — новое слово по шагам урока
function makeTask(type, card, pool, kind = 'learn') {
  return {type, card, kind, options: type === 'meaning' ? meaningOptions(card, pool) : null}
}

function lessonTasks(cards, pool) {
  const tasks = []
  // шаги по кругу для всей группы: знакомство → перевод → артикль → написать
  for (const type of ['intro', 'meaning', 'article', 'write']) {
    for (const card of shuffleList(cards)) {
      if (type === 'article' && !card.article) continue
      tasks.push(makeTask(type, card, pool, 'learn'))
    }
  }
  return tasks
}

const reviewTasks = (cards, pool) => cards.map(card => makeTask(reviewTaskType(card), card, pool, 'review'))

// cards: для «Карточек» можно передать стопку «не знаю», тогда новый круг только с ней
async function build(cardsForRound = null) {
  const roundCards = Array.isArray(cardsForRound) ? [...cardsForRound] : null
  unknownPile.value = []
  finished.value = false
  flipped.value = false
  step.value = 0
  done.value = 0
  firstTryRight.value = 0
  missed.clear()
  await loadDictionary().catch(err => console.error(err))

  const pool = isAll.value ? decksStore.cards : decksStore.cardsOfDeck(deckId.value)
  let tasks = []
  reviewedCards.value = []
  learnedCards.value = []
  const due = mode.value === 'learn' || mode.value === 'flash' ? []
      : shuffleList(decksStore.dueCards(isAll.value ? null : deckId.value)).slice(0, REVIEW_WORD_COUNT)
  const fresh = mode.value === 'study' || mode.value === 'learn'
      ? shuffleList(decksStore.freshCards(deckId.value)).slice(0, LESSON_WORD_COUNT) : []
  if (mode.value !== 'flash') {
    reviewedCards.value = due
    learnedCards.value = fresh
    sessionCards.value = [...due, ...fresh]
    // сначала то, что пора повторить (чтобы не забылось), потом новое
    tasks = [...reviewTasks(due, pool), ...lessonTasks(fresh, pool)]
  } else {
    const cards = shuffleList(roundCards || pool)
    sessionCards.value = cards
    tasks = cards.map(card => ({type: 'flash', card}))
  }
  queue.value = tasks
}

watch(() => [authStore.initialized, authStore.uid], async ([initialized, uid]) => {
  if (!initialized) return
  if (!uid) {
    router.replace('/')
    return
  }
  try {
    await decksStore.load()
    if (!built) {
      built = true
      initSound()
      await build()
    }
  } catch (err) {
    console.error(err)
  }
}, {immediate: true})

async function complete() {
  finished.value = true
  playLevelCompleted()
  try {
    if (learnedCards.value.length) {
      await Promise.all(learnedCards.value.map(card => decksStore.markLearned(card, missed.has(card.id))))
    }
  } catch (err) {
    console.error(err)
  }
}

function advance() {
  queue.value = queue.value.slice(1)
  done.value++
  step.value++
  if (!queue.value.length) complete()
}

// не знаешь: карточка вернётся через пару других, а не сразу следующей
const REQUEUE_GAP = 3
function requeue(task) {
  const rest = queue.value.slice(1)
  rest.splice(Math.min(REQUEUE_GAP, rest.length), 0, task)
  queue.value = rest
  step.value++
}

function taskDone(result) {
  const task = current.value
  if (!task) return
  const correct = result.correct
  if (task.kind === 'review') {
    // первый ответ решает, когда слово придёт снова; ошибка: слово вернётся ещё раз в этой же сессии,
    // но этот повтор только для закрепления и дату уже не меняет
    if (!task.practice) {
      if (correct) firstTryRight.value++
      decksStore.markReviewed(task.card, gradeAnswer({...result, type: task.type})).catch(err => console.error(err))
    }
    if (correct) advance()
    else requeue({...makeTask(task.type, task.card, isAll.value ? decksStore.cards : decksStore.cardsOfDeck(deckId.value), 'review'), practice: true})
    return
  }
  // урок: ошибку повторяем чуть позже, пока не ответит верно
  if (!correct) {
    missed.add(task.card.id)
    requeue(makeTask(task.type, task.card, isAll.value ? decksStore.cards : decksStore.cardsOfDeck(deckId.value)))
    return
  }
  advance()
}

function speakCurrent() {
  const card = current.value?.card
  if (card) getSpeechAudio(card.article ? `${card.article} ${card.de}` : card.de)
}

// немецкая сторона: озвучиваем слово
function flip() {
  flipped.value = !flipped.value
  vibrateTap()
  if (!flipped.value) speakCurrent()
}

// новая карточка в режиме «Карточки»: сразу звучит немецкое слово
watch(step, () => {
  if (mode.value === 'flash' && !finished.value) speakCurrent()
})

// круг по колоде: каждая карточка один раз, «знаю» и «не знаю» раскладывают в две стопки
function flashAnswer(known) {
  const task = current.value
  if (!task) return
  flipped.value = false
  if (!known) unknownPile.value = [...unknownPile.value, task.card]
  advance()
}

function exit() {
  router.replace(isAll.value ? '/cards' : `/cards/${deckId.value}`)
}
</script>

<style scoped>
.session {
  --accent: #8b5cf6;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 560px;
  min-height: 100%;
  margin: 0 auto;
  padding: 12px 16px calc(24px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.session__top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.session__close {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 12px;
  background: var(--tabsSlideBg);
  box-shadow: var(--boxShadowMobile);
  color: var(--title);
  cursor: pointer;
}

.session__bar {
  flex: 1;
  height: 14px;
  overflow: hidden;
  border-radius: 7px;
  background: color-mix(in srgb, var(--title) 15%, transparent);
}

.session__bar-fill {
  display: block;
  height: 100%;
  border-radius: 7px;
  background: var(--accent);
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.15);
  transition: width 0.35s ease;
}

.session__mode {
  flex-shrink: 0;
  color: var(--title);
  font-size: 14px;
  font-weight: 900;
}

.session__loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.session__spinner {
  width: 34px;
  height: 34px;
  border: 4px solid var(--tabsSlideBorderColor);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: session-spin 0.8s linear infinite;
}

@keyframes session-spin {
  to {
    rotate: 360deg;
  }
}

.session__empty,
.session__result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 30px 0;
  text-align: center;
}

.session__empty-icon,
.session__result-icon {
  font-size: 64px;
  line-height: 1;
}

.session__empty-text {
  margin-bottom: 8px;
  color: var(--title);
  font-size: 17px;
  font-weight: 800;
}

.session__result-title {
  color: var(--title);
  font-size: 26px;
  font-weight: 900;
}

.session__result-line {
  color: var(--title);
  font-size: 18px;
  font-weight: 800;
}

.session__result-sub {
  color: var(--title);
  font-size: 15px;
  font-weight: 700;
  opacity: 0.75;
}

.session__piles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  margin-top: 6px;
}

.session__pile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px 8px;
  border-radius: 18px;
}

.session__pile--know {
  background: color-mix(in srgb, #22c55e 16%, transparent);
  color: #22c55e;
}

.session__pile--unknown {
  background: color-mix(in srgb, #f97316 16%, transparent);
  color: #f97316;
}

.session__pile-num {
  font-size: 30px;
  font-weight: 900;
  line-height: 1.1;
}

.session__pile-cap {
  font-size: 14px;
  font-weight: 800;
}

.session__result-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 14px;
}

.session__btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 16px;
  background: var(--accent);
  box-shadow: 0 5px 0 color-mix(in srgb, var(--accent) 65%, #000);
  color: #fff;
  font-size: 17px;
  font-weight: 900;
  cursor: pointer;
}

.session__btn:active {
  transform: translateY(5px);
  box-shadow: none;
}

.session__btn--ghost {
  background: var(--tabBg);
  box-shadow: 0 5px 0 var(--tabsSlideBorderColor);
  color: var(--title);
}

.session__btn--again {
  background: #f97316;
  box-shadow: 0 5px 0 #c2410c;
}

.session__btn--know {
  background: #22c55e;
  box-shadow: 0 5px 0 #15803d;
}

.session__hint {
  margin-bottom: 12px;
  color: var(--title);
  font-size: 15px;
  font-weight: 800;
  text-align: center;
  opacity: 0.75;
}

.session__flash {
  display: flex;
  flex-direction: column;
}

.session__flash-actions {
  animation: session-actions-in 0.2s ease-out;
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

/* карточка с переворотом */
.flip {
  width: 100%;
  height: 300px;
  padding: 0;
  border: none;
  background: none;
  perspective: 1200px;
  cursor: pointer;
}

.flip__inner {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.3, 1.3, 0.5, 1);
}

.flip--back .flip__inner {
  transform: rotateY(180deg);
}

.flip__face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  box-sizing: border-box;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 26px;
  background: var(--tabsSlideBg);
  box-shadow: 0 8px 0 var(--tabsSlideBorderColor), 0 14px 22px rgba(0, 0, 0, 0.15);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.flip__face--back {
  border-color: color-mix(in srgb, var(--accent) 60%, #fff);
  background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 75%, #fff) 0%, var(--accent) 100%);
  box-shadow: 0 8px 0 color-mix(in srgb, var(--accent) 65%, #000), 0 14px 22px rgba(0, 0, 0, 0.15);
  color: #fff;
  transform: rotateY(180deg);
}

.flip__word {
  color: var(--title);
  font-size: 34px;
  font-weight: 900;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.flip__word--native {
  color: #fff;
}

.flip__sub {
  font-size: 17px;
  font-weight: 800;
  opacity: 0.8;
}

.flip__face--front .flip__sub {
  color: var(--title);
}

.flip__sub--example {
  font-style: italic;
}

@keyframes session-actions-in {
  from {
    opacity: 0;
    translate: 0 8px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

/* смена карточки: старая улетает, новая (или та же, если «ещё раз») прилетает */
.card-swap-enter-active,
.card-swap-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.card-swap-enter-from {
  opacity: 0;
  transform: translateX(40px) rotate(4deg);
}

.card-swap-leave-to {
  opacity: 0;
  transform: translateX(-40px) rotate(-4deg);
}

@media (prefers-reduced-motion: reduce) {
  .card-swap-enter-active,
  .card-swap-leave-active {
    transition-duration: 0.01s;
  }

  .flip__inner {
    transition-duration: 0.01s;
  }
}
</style>
