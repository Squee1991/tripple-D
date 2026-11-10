<template>
  <div class="card-form" :style="{ '--accent': accent }">
    <!-- поиск по словарю: по-немецки или на языке приложения -->
    <div v-if="!showFields" class="card-form__search">
      <div class="card-form__search-box">
        <svg class="card-form__search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none"
             stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="16.5" y1="16.5" x2="21" y2="21"></line>
        </svg>
        <input
            v-model="query"
            class="card-form__search-input"
            :placeholder="t('flashCards.searchPlaceholder')"
            autocomplete="off"
            autocapitalize="off"
            spellcheck="false"
            @keydown.enter.prevent="pickFirst"
        >
      </div>

      <ul v-if="suggestions.length" class="card-form__suggest">
        <li v-for="entry in suggestions" :key="entry.kind + entry.de">
          <button type="button" class="card-form__suggest-item" @click="pick(entry)">
            <span v-if="entry.article" class="card-form__article" :style="{ background: ARTICLE_COLORS[entry.article] }">
              {{ entry.article }}
            </span>
            <span v-else class="card-form__article card-form__article--verb">{{ t('flashCards.kindVerbShort') }}</span>
            <span class="card-form__suggest-de">{{ entry.de }}</span>
            <span class="card-form__suggest-tr">{{ translationOf(entry, locale) }}</span>
          </button>
        </li>
      </ul>

      <button v-if="query.trim().length >= 2" type="button" class="card-form__manual" @click="openManual">
        {{ suggestions.length ? t('flashCards.manualOther') : t('flashCards.manualHint') }}
      </button>
    </div>

    <form v-else class="card-form__fields" @submit.prevent="submit">
      <VSegmented v-model="form.kind" :options="kinds"/>

      <div v-if="form.kind === 'noun'" class="card-form__articles">
        <button
            v-for="art in ARTICLES"
            :key="art"
            type="button"
            class="card-form__article-btn"
            :class="{ 'card-form__article-btn--on': form.article === art }"
            :style="{ '--art': ARTICLE_COLORS[art] }"
            @click="form.article = art"
        >{{ art }}
        </button>
      </div>

      <p v-if="articleHint" class="card-form__article-hint">
        <span>{{ t('flashCards.articleInDictionary') }}
          <b :style="{ color: ARTICLE_COLORS[articleHint] }">{{ articleHint }}</b> {{ form.de.trim() }}</span>
        <button type="button" class="card-form__article-fix" :style="{ background: ARTICLE_COLORS[articleHint] }"
                @click="form.article = articleHint">{{ t('flashCards.articleFix') }}</button>
      </p>

      <label class="card-form__label">
        {{ t('flashCards.word') }}
        <input v-model="form.de" class="card-form__input" :maxlength="CARD_FIELD_MAX" required autocomplete="off"
               autocapitalize="off" spellcheck="false">
      </label>

      <label v-if="form.kind === 'noun'" class="card-form__label">
        {{ t('flashCards.plural') }}
        <input v-model="form.plural" class="card-form__input" :maxlength="CARD_FIELD_MAX" autocomplete="off"
               autocapitalize="off" spellcheck="false">
      </label>

      <div v-if="form.kind === 'verb'" class="card-form__row">
        <label class="card-form__label">
          {{ t('flashCards.praeteritum') }}
          <input v-model="form.praeteritum" class="card-form__input" :maxlength="CARD_FIELD_MAX" autocomplete="off"
                 autocapitalize="off" spellcheck="false">
        </label>
        <label class="card-form__label">
          {{ t('flashCards.perfekt') }}
          <input v-model="form.perfekt" class="card-form__input" :maxlength="CARD_FIELD_MAX" autocomplete="off"
                 autocapitalize="off" spellcheck="false">
        </label>
      </div>

      <label class="card-form__label">
        {{ t('flashCards.translation') }}
        <input v-model="form.translation" class="card-form__input" :maxlength="CARD_FIELD_MAX" required
               autocomplete="off">
      </label>

      <label class="card-form__label">
        {{ t('flashCards.example') }}
        <input v-model="form.example" class="card-form__input" maxlength="200" autocomplete="off"
               autocapitalize="off" :placeholder="t('flashCards.optional')">
      </label>

      <button v-if="canAskAi" type="button" class="card-form__ai" :disabled="aiBusy" @click="askAi">
        ✨ {{ aiBusy ? t('flashCards.aiWorking') : t('flashCards.aiFill') }}
      </button>
      <p v-if="aiError" class="card-form__warn">{{ aiError }}</p>

      <p v-if="isDuplicate" class="card-form__warn">{{ t('flashCards.duplicate') }}</p>

      <div class="card-form__actions">
        <button type="button" class="card-form__btn card-form__btn--ghost" @click="cancel">
          {{ t('flashCards.cancel') }}
        </button>
        <button type="submit" class="card-form__btn" :disabled="!canSave || saving">
          {{ card ? t('flashCards.saveCard') : t('flashCards.addCard') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import {ref, reactive, computed, watch, onMounted, onBeforeUnmount} from 'vue'
import {
  ARTICLES, ARTICLE_COLORS, loadDictionary, suggestWords, translationOf, cardFromEntry, dictionaryKey, findExact
} from '~/utils/cardDictionary.js'
import {CARD_FIELD_MAX} from '~/store/decksStore.js'
import {aiFillCards} from '~/utils/deckAi.js'
import VSegmented from '~/src/components/cards/V-segmented.vue'

const props = defineProps({
  // карточка для редактирования
  card: {type: Object, default: null},
  // ключи слов, которые уже есть в колоде: предупреждаем о повторе
  existingKeys: {type: Array, default: () => []},
  saving: {type: Boolean, default: false},
  accent: {type: String, default: '#8b5cf6'}
})
const emit = defineEmits(['save', 'cancel'])
const {t, locale} = useI18n()

const emptyForm = () => ({kind: 'noun', de: '', article: '', plural: '', translation: '', praeteritum: '', perfekt: '', example: ''})
const form = reactive(emptyForm())
const query = ref('')
const suggestions = ref([])
const showFields = ref(false)
// карточка заполнена из словаря: AI не нужен
const fromDictionary = ref(false)
const aiBusy = ref(false)
const aiError = ref('')
let timer = null

const kinds = computed(() => [
  {id: 'noun', label: t('flashCards.kindNoun')},
  {id: 'verb', label: t('flashCards.kindVerb')},
  {id: 'phrase', label: t('flashCards.kindPhrase')}
])

const isDuplicate = computed(() => {
  const key = dictionaryKey(form.de)
  if (!key) return false
  const ownKey = props.card ? dictionaryKey(props.card.de) : null
  return key !== ownKey && props.existingKeys.includes(key)
})
// выбран артикль, которого у этого слова в словаре нет: подсказываем правильный.
// Слова с двумя артиклями (der/die Leiter) не трогаем: запись с выбранным артиклем тоже есть
const dictionaryReady = ref(false)
const articleHint = computed(() => {
  if (!dictionaryReady.value || form.kind !== 'noun' || !form.article || !form.de.trim()) return ''
  if (findExact(`${form.article} ${form.de}`)) return ''
  const entry = findExact(form.de)
  return entry?.kind === 'noun' && entry.article && entry.article !== form.article ? entry.article : ''
})

const canAskAi = computed(() => !fromDictionary.value && !props.card && form.de.trim().length >= 2)
const canSave = computed(() => form.de.trim() && form.translation.trim() && (form.kind !== 'noun' || form.article))

function fill(data) {
  Object.assign(form, emptyForm(), data)
}

watch(() => props.card, (card) => {
  if (card) {
    fill(card)
    showFields.value = true
  }
}, {immediate: true})

watch(query, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    suggestions.value = suggestWords(value, locale.value)
  }, 120)
})

onMounted(() => {
  loadDictionary().then(() => {
    dictionaryReady.value = true
  }).catch(err => console.error(err))
})
onBeforeUnmount(() => clearTimeout(timer))

function pick(entry) {
  fill(cardFromEntry(entry, locale.value))
  fromDictionary.value = true
  showFields.value = true
}

// слова нет в словаре: AI дописывает пустые поля, введённое пользователем не трогаем
async function askAi() {
  if (aiBusy.value) return
  aiBusy.value = true
  aiError.value = ''
  try {
    const de = form.article ? `${form.article} ${form.de}` : form.de
    const {cards} = await aiFillCards([{de, translation: form.translation}], locale.value)
    const card = cards[0]
    if (!card) throw new Error('EMPTY')
    for (const [key, value] of Object.entries(card)) {
      if (value && (!form[key] || key === 'kind' || key === 'de')) form[key] = value
    }
    if (card.article) form.article = card.article
    fromDictionary.value = true
  } catch (err) {
    aiError.value = err?.code === 'LIMIT' ? t('flashCards.aiLimit') : t('flashCards.aiFailed')
  } finally {
    aiBusy.value = false
  }
}

function pickFirst() {
  if (suggestions.value.length) pick(suggestions.value[0])
  else if (query.value.trim().length >= 2) openManual()
}

// слова нет в словаре: введённое считаем немецким, артикль из «der Tisch» разбираем сами
function openManual() {
  fromDictionary.value = false
  const text = query.value.trim()
  const match = text.match(/^(der|die|das)\s+(.+)$/i)
  fill(match
      ? {kind: 'noun', article: match[1].toLowerCase(), de: match[2]}
      : {kind: /\s/.test(text) ? 'phrase' : 'noun', de: text})
  showFields.value = true
}

function reset() {
  fill({})
  fromDictionary.value = false
  aiError.value = ''
  query.value = ''
  suggestions.value = []
  showFields.value = false
}

function cancel() {
  if (props.card) emit('cancel')
  else reset()
}

function submit() {
  if (!canSave.value || props.saving) return
  emit('save', {...form})
}

defineExpose({reset})
</script>

<style scoped>
.card-form {
  --accent: #8b5cf6;
}

.card-form__search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  background: var(--bg);
}

.card-form__search-box:focus-within {
  border-color: var(--accent);
}

.card-form__search-icon {
  flex-shrink: 0;
  color: var(--title);
  opacity: 0.6;
}

.card-form__search-input {
  flex: 1;
  min-width: 0;
  padding: 13px 0;
  border: none;
  background: transparent;
  color: var(--titleColor);
  font-size: 16px;
  font-weight: 700;
  outline: none;
}

.card-form__suggest {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  list-style: none;
}

.card-form__suggest-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 14px;
  background: var(--bg);
  color: var(--titleColor);
  text-align: start;
  cursor: pointer;
}

.card-form__suggest-item:active {
  transform: translateY(2px);
}

.card-form__article {
  flex-shrink: 0;
  min-width: 38px;
  padding: 3px 7px;
  box-sizing: border-box;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  text-align: center;
}

.card-form__article--verb {
  background: #f59e0b;
}

.card-form__suggest-de {
  color: var(--title);
  font-size: 16px;
  font-weight: 900;
}

.card-form__suggest-tr {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--title);
  font-size: 14px;
  font-weight: 700;
  text-align: end;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.7;
}

.card-form__manual {
  margin-top: 10px;
  padding: 4px 2px;
  border: none;
  background: none;
  color: var(--accent);
  font-size: 14px;
  font-weight: 800;
  text-decoration: underline;
  cursor: pointer;
}

.card-form__fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-form__articles {
  display: flex;
  gap: 8px;
}

.card-form__article-btn {
  flex: 1;
  padding: 10px 4px;
  border: 3px solid var(--art);
  border-radius: 14px;
  background: var(--bg);
  color: var(--art);
  font-size: 17px;
  font-weight: 900;
  cursor: pointer;
}

.card-form__article-btn--on {
  background: var(--art);
  box-shadow: 0 4px 0 color-mix(in srgb, var(--art) 70%, #000);
  color: #fff;
}

.card-form__article-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 10px 9px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, #f59e0b 16%, transparent);
  color: var(--title);
  font-size: 14px;
  font-weight: 800;
}

.card-form__article-fix {
  flex-shrink: 0;
  padding: 7px 12px;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
}

.card-form__row {
  display: flex;
  gap: 8px;
}

.card-form__row .card-form__label {
  flex: 1;
  min-width: 0;
}

.card-form__label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: var(--title);
  font-size: 13px;
  font-weight: 800;
}

.card-form__input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 12px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 14px;
  background: var(--bg);
  color: var(--titleColor);
  font-size: 16px;
  font-weight: 700;
  outline: none;
}

.card-form__input:focus {
  border-color: var(--accent);
}

.card-form__ai {
  padding: 11px 14px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(90deg, #a78bfa, #ec4899);
  box-shadow: 0 4px 0 #9d174d;
  color: #fff;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
}

.card-form__ai:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: none;
}

.card-form__ai:disabled {
  opacity: 0.6;
}

.card-form__warn {
  padding: 8px 12px;
  border-radius: 12px;
  background: #fff7ed;
  color: #c2410c;
  font-size: 14px;
  font-weight: 800;
}

.card-form__actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.card-form__btn {
  flex: 1;
  padding: 13px 16px;
  border: none;
  border-radius: 14px;
  background: var(--accent);
  box-shadow: 0 4px 0 color-mix(in srgb, var(--accent) 65%, #000);
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
}

.card-form__btn:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: none;
}

.card-form__btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.card-form__btn--ghost {
  background: var(--tabBg);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  color: var(--title);
}
</style>
