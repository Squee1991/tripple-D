<template>
  <div class="card-task" :style="{ '--accent': accent }">
    <p class="card-task__prompt">{{ promptText }}</p>

    <!-- знакомство: карточка целиком -->
    <div v-if="task.type === 'intro'" class="card-task__intro">
      <button type="button" class="card-task__speak card-task__speak--corner" :aria-label="t('flashCards.listen')"
              @click="speak">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M4 9v6h4l5 4V5L8 9H4z"/>
          <path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      </button>
      <p class="card-task__word">
        <span v-if="card.article" :style="{ color: ARTICLE_COLORS[card.article] }">{{ card.article }}</span>
        {{ card.de }}
      </p>
      <p class="card-task__translation">{{ card.translation }}</p>
      <ul class="card-task__facts">
        <li v-if="card.plural"><b>{{ t('flashCards.plural') }}:</b> die {{ card.plural }}</li>
        <li v-if="card.praeteritum"><b>{{ t('flashCards.praeteritum') }}:</b> {{ card.praeteritum }}</li>
        <li v-if="card.perfekt"><b>{{ t('flashCards.perfekt') }}:</b> {{ card.perfekt }}</li>
        <li v-if="card.example" class="card-task__example">{{ card.example }}</li>
      </ul>
      <p v-if="genderRule" class="card-task__rule">
        💡 {{ t('flashCards.genderRule', {suffix: genderRule.suffix, article: genderRule.article}) }}
      </p>
    </div>

    <!-- что спрашиваем: немецкое слово или перевод -->
    <div v-else class="card-task__question">
      <template v-if="task.type === 'meaning' || task.type === 'article'">
        <button type="button" class="card-task__speak card-task__speak--corner" :aria-label="t('flashCards.listen')"
                @click="speak">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z"/>
            <path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </button>
        <p v-if="task.type === 'article'" class="card-task__word">
          <span v-if="answered" class="card-task__filled" :style="{ color: ARTICLE_COLORS[card.article] }">{{ card.article }}</span>
          <span v-else class="card-task__gap">___</span>
          {{ card.de }}
        </p>
        <p v-else class="card-task__word">
          <span v-if="card.article" :style="{ color: ARTICLE_COLORS[card.article] }">{{ card.article }}</span>
          {{ card.de }}
        </p>
        <p v-if="task.type === 'article'" class="card-task__translation">{{ card.translation }}</p>
      </template>
      <template v-else-if="task.type === 'audio'">
        <button type="button" class="card-task__speak card-task__speak--big" :aria-label="t('flashCards.listen')"
                @click="speak">
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z"/>
            <path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </button>
      </template>
      <template v-else>
        <p class="card-task__word card-task__word--native">{{ card.translation }}</p>
        <p v-if="task.type === 'plural'" class="card-task__translation">{{ wordWithArticle }}</p>
      </template>
    </div>

    <!-- варианты ответа -->
    <div v-if="task.type === 'meaning'" class="card-task__options">
      <button
          v-for="option in task.options"
          :key="option"
          type="button"
          class="card-task__option"
          :class="optionClass(option)"
          :disabled="answered"
          @click="choose(option)"
      >{{ option }}
      </button>
    </div>

    <div v-else-if="task.type === 'article'" class="card-task__articles">
      <button
          v-for="art in ARTICLES"
          :key="art"
          type="button"
          class="card-task__article"
          :class="optionClass(art)"
          :style="{ '--art': ARTICLE_COLORS[art] }"
          :disabled="answered"
          @click="choose(art)"
      >{{ art }}
      </button>
    </div>

    <form v-else-if="isWriting" class="card-task__write" @submit.prevent="checkWritten">
      <input
          ref="input"
          v-model="typed"
          class="card-task__input"
          :class="{ 'card-task__input--right': answered && isCorrect, 'card-task__input--wrong': answered && !isCorrect }"
          :readonly="answered"
          :placeholder="writePlaceholder"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
          enterkeyhint="done"
      >
      <div v-if="!answered" class="card-task__letters">
        <button v-for="letter in LETTERS" :key="letter" type="button" class="card-task__letter"
                @click="addLetter(letter)">{{ letter }}
        </button>
      </div>
    </form>

    <!-- ошибка или опечатка: правильный ответ простой строкой -->
    <p v-if="answered && task.type !== 'intro' && (!isCorrect || isAlmost)" class="card-task__answer-line"
       :class="isCorrect ? 'card-task__answer-line--almost' : 'card-task__answer-line--wrong'">
      {{ isAlmost ? t('flashCards.almost') : t('flashCards.wrong') }}
      <b class="card-task__answer-word">{{ expectedText }}</b>
    </p>

    <!-- одна кнопка: серая «Проверить», после ответа зелёная или красная «Дальше» -->
    <button v-if="task.type === 'intro'" type="button" class="card-task__btn" @click="next">
      {{ t('flashCards.next') }}
    </button>
    <button v-else-if="answered" type="button" class="card-task__btn"
            :class="isCorrect ? 'card-task__btn--right' : 'card-task__btn--wrong'" @click="next">
      {{ t('flashCards.next') }}
    </button>
    <button v-else-if="isWriting" type="button" class="card-task__btn card-task__btn--idle"
            :disabled="!typed.trim()" @click="checkWritten">
      {{ t('flashCards.check') }}
    </button>
    <button v-else-if="isChoice" type="button" class="card-task__btn card-task__btn--idle"
            :disabled="!picked" @click="checkChoice">
      {{ t('flashCards.check') }}
    </button>
  </div>
</template>

<script setup>
import {ref, computed, watch, nextTick, onMounted} from 'vue'
import {ARTICLES, ARTICLE_COLORS} from '~/utils/cardDictionary.js'
import {normalizeAnswer, isAlmostCorrectAnswer, getGenderRule} from '~/utils/wordReview.js'
import {getSpeechAudio} from '~/utils/googleTTS.js'
import {playCorrect, playWrong, initSound} from '~/utils/soundManager.js'
import {vibrateSuccess, vibrateError, vibrateTap} from '~/utils/haptics.js'

const props = defineProps({
  // {type: 'intro' | 'meaning' | 'article' | 'write' | 'audio' | 'plural', card, options?}
  task: {type: Object, required: true},
  accent: {type: String, default: '#8b5cf6'}
})
const emit = defineEmits(['next'])
const {t} = useI18n()

const LETTERS = ['ä', 'ö', 'ü', 'ß']

const typed = ref('')
const picked = ref(null)
const answered = ref(false)
const isCorrect = ref(false)
const isAlmost = ref(false)
const input = ref(null)
// когда показали задание: по времени ответа модель памяти понимает, легко ли вспомнилось
let shownAt = 0
let answerMs = 0

const card = computed(() => props.task.card)
const isWriting = computed(() => ['write', 'audio', 'plural'].includes(props.task.type))
const isChoice = computed(() => props.task.type === 'meaning' || props.task.type === 'article')
const wordWithArticle = computed(() => (card.value.article ? `${card.value.article} ${card.value.de}` : card.value.de))
const genderRule = computed(() => (card.value.article ? getGenderRule(card.value) : null))

const promptText = computed(() => ({
  intro: t('flashCards.newWord'),
  meaning: t('flashCards.chooseTranslation'),
  article: t('flashCards.chooseArticle'),
  write: card.value.article ? t('flashCards.writeWithArticle') : t('flashCards.writeWord'),
  audio: t('flashCards.listenWrite'),
  plural: t('flashCards.writePlural')
}[props.task.type]))

const writePlaceholder = computed(() => {
  if (props.task.type === 'plural') return 'die ...'
  return card.value.article ? 'der / die / das ...' : '...'
})

// что засчитываем при письме: слово с артиклем; во мн. числе «die» можно не писать
const expectedText = computed(() => {
  if (props.task.type === 'meaning') return card.value.translation
  if (props.task.type === 'article') return wordWithArticle.value
  if (props.task.type === 'plural') return `die ${card.value.plural}`
  return wordWithArticle.value
})

function speak() {
  getSpeechAudio(wordWithArticle.value)
}

function finish(correct) {
  answerMs = shownAt ? Date.now() - shownAt : 0
  answered.value = true
  isCorrect.value = correct
  if (correct) {
    playCorrect()
    vibrateSuccess()
  } else {
    playWrong()
    vibrateError()
  }
  if (correct && props.task.type !== 'audio') speak()
}

// нажатие на вариант только выбирает его (можно передумать), засчитываем по кнопке «Проверить»
function choose(option) {
  if (answered.value) return
  picked.value = option
  vibrateTap()
}

function checkChoice() {
  if (answered.value || !picked.value) return
  const right = props.task.type === 'article' ? card.value.article : card.value.translation
  finish(picked.value === right)
}

function optionClass(option) {
  if (!answered.value) return option === picked.value ? 'is-selected' : (picked.value && props.task.type === 'article' ? 'is-dim' : '')
  const right = props.task.type === 'article' ? option === card.value.article : option === card.value.translation
  if (right) return 'is-right'
  return option === picked.value ? 'is-wrong' : 'is-dim'
}

function checkWritten() {
  if (answered.value || !typed.value.trim()) return
  const answer = normalizeAnswer(typed.value)
  const targets = props.task.type === 'plural'
      ? [`die ${card.value.plural}`, card.value.plural]
      : [expectedText.value]
  const exact = targets.some(target => normalizeAnswer(target) === answer)
  const almost = !exact && targets.some(target => isAlmostCorrectAnswer(typed.value, target))
  isAlmost.value = almost
  finish(exact || almost)
}

function addLetter(letter) {
  const el = input.value
  const value = typed.value
  const start = el?.selectionStart ?? value.length
  const end = el?.selectionEnd ?? value.length
  typed.value = value.slice(0, start) + letter + value.slice(end)
  nextTick(() => {
    el?.focus()
    el?.setSelectionRange(start + 1, start + 1)
  })
}

// {correct, almost, ms, answerLength}: по этому сессия ставит оценку ответа
function next() {
  emit('next', {
    correct: props.task.type === 'intro' ? true : isCorrect.value,
    almost: isAlmost.value,
    ms: answerMs,
    answerLength: expectedText.value.length
  })
}

function prepare() {
  typed.value = ''
  picked.value = null
  answered.value = false
  isCorrect.value = false
  isAlmost.value = false
  shownAt = Date.now()
  answerMs = 0
  if (props.task.type === 'audio' || props.task.type === 'intro') speak()
  if (isWriting.value) nextTick(() => input.value?.focus())
}

watch(() => props.task, prepare)
onMounted(() => {
  initSound()
  prepare()
})
</script>

<style scoped>
.card-task {
  --accent: #8b5cf6;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-task__prompt {
  color: var(--title);
  font-size: 16px;
  font-weight: 900;
  text-align: center;
  opacity: 0.85;
}

/* карточка нейтральная (чуть светлее фона), а не цветная: отделена и от фона, и от вариантов */
.card-task__intro,
.card-task__question {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 150px;
  box-sizing: border-box;
  padding: 28px 20px 26px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 20px;
  background: var(--menuItemsBg);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  text-align: center;
}

/* боковой отступ: длинное слово не залезает под кнопку озвучки в углу */
.card-task__word {
  padding-inline: 34px;
  color: var(--title);
  font-size: 26px;
  font-weight: 900;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.card-task__word--native {
  font-size: 22px;
}

.card-task__translation {
  color: var(--title);
  font-size: 16px;
  font-weight: 700;
  opacity: 0.75;
}

.card-task__facts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
  color: var(--title);
  font-size: 15px;
  font-weight: 700;
  list-style: none;
}

.card-task__example {
  font-style: italic;
  opacity: 0.85;
}

.card-task__rule {
  margin-top: 4px;
  padding: 8px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, #f59e0b 18%, transparent);
  color: var(--title);
  font-size: 14px;
  font-weight: 800;
}

.card-task__speak {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 50%;
  background: var(--bg);
  color: var(--title);
  cursor: pointer;
}

.card-task__speak--big {
  width: 64px;
  height: 64px;
  border: none;
  background: var(--accent);
  box-shadow: 0 4px 0 color-mix(in srgb, var(--accent) 65%, #000);
  color: #fff;
}

/* озвучка в правом верхнем углу карточки: не разделяет картинку и слово */
.card-task__speak--corner {
  position: absolute;
  top: 10px;
  inset-inline-end: 10px;
  width: 36px;
  height: 36px;
}

.card-task__speak:active {
  transform: scale(0.92);
}

.card-task__options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* варианты нейтральные (фон страницы), а не цвета карточки: вопрос и ответы не сливаются */
.card-task__option {
  padding: 11px 14px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 14px;
  background: var(--bg);
  box-shadow: 0 3px 0 var(--tabsSlideBorderColor);
  color: var(--title);
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
}

.card-task__option:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: none;
}

.card-task__articles {
  display: flex;
  gap: 10px;
}

.card-task__article {
  flex: 1;
  padding: 11px 4px;
  border: 2px solid var(--art);
  border-radius: 14px;
  background: var(--art);
  box-shadow: 0 3px 0 color-mix(in srgb, var(--art) 65%, #000);
  color: #fff;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
}

.card-task__article:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: none;
}

/* выбранный, но ещё не проверенный вариант */
.card-task__option.is-selected {
  border-color: #2563eb;
  background: #3b82f6;
  box-shadow: 0 3px 0 #1d4ed8;
  color: #fff;
}

.card-task__article.is-selected {
  outline: 3px solid var(--title);
  outline-offset: 2px;
  translate: 0 -3px;
}

.is-right {
  border-color: #16a34a !important;
  background: #22c55e !important;
  box-shadow: 0 4px 0 #15803d !important;
  color: #fff !important;
}

.is-wrong {
  border-color: #dc2626 !important;
  background: #ef4444 !important;
  box-shadow: 0 4px 0 #b91c1c !important;
  color: #fff !important;
}

.is-dim {
  opacity: 0.45;
}

.card-task__write {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-task__input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 14px;
  background: var(--bg);
  color: var(--titleColor);
  font-size: 18px;
  font-weight: 800;
  text-align: center;
  outline: none;
}

.card-task__input:focus {
  border-color: var(--accent);
}

.card-task__input--right {
  color: #22c55e;
}

.card-task__input--wrong {
  color: #ef4444;
}

.card-task__letters {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.card-task__letter {
  width: 46px;
  height: 42px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 12px;
  background: var(--bg);
  box-shadow: 0 3px 0 var(--tabsSlideBorderColor);
  color: var(--title);
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
}

.card-task__letter:active {
  transform: translateY(3px);
  box-shadow: none;
}

.card-task__answer-line {
  color: var(--title);
  font-size: 16px;
  font-weight: 800;
  text-align: center;
}

.card-task__answer-word {
  display: block;
  margin-top: 2px;
  font-size: 22px;
  font-weight: 900;
}

.card-task__answer-line--wrong .card-task__answer-word {
  color: #ef4444;
}

.card-task__answer-line--almost .card-task__answer-word {
  color: #f59e0b;
}

.card-task__gap {
  opacity: 0.6;
}

/* артикль встаёт на место пропуска */
.card-task__filled {
  display: inline-block;
  animation: card-task-fill 0.35s cubic-bezier(0.3, 1.6, 0.5, 1);
}

@keyframes card-task-fill {
  from {
    scale: 0.4;
    opacity: 0;
  }
  to {
    scale: 1;
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card-task__filled {
    animation: none;
  }
}

.card-task__btn {
  margin-top: 6px;
  padding: 13px;
  border: none;
  border-radius: 14px;
  background: var(--accent);
  box-shadow: 0 4px 0 color-mix(in srgb, var(--accent) 65%, #000);
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
}

.card-task__btn:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: none;
}

.card-task__btn--idle {
  background: #9ca3af;
  box-shadow: 0 4px 0 #6b7280;
}

.card-task__btn--right {
  background: #22c55e;
  box-shadow: 0 4px 0 #15803d;
}

.card-task__btn--wrong {
  background: #ef4444;
  box-shadow: 0 4px 0 #b91c1c;
}

.card-task__btn:disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
