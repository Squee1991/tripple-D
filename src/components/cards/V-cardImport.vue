<template>
  <Teleport to="body">
    <Transition name="import-sheet">
      <div v-if="modelValue" class="import" @click.self="close">
        <div class="import__panel" :style="{ '--accent': accent }">
          <header class="import__head">
            <button v-if="step !== 'input' || openedLand" type="button" class="import__back" @click="goBack"
                    :aria-label="t('flashCards.backStep')">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3.5"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 5 8 12 15 19"></polyline>
              </svg>
            </button>
            <h2 class="import__title">{{ headTitle }}</h2>
            <button type="button" class="import__close" :aria-label="t('flashCards.cancel')" @click="close">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3.5"
                   stroke-linecap="round" aria-hidden="true">
                <line x1="6" y1="6" x2="18" y2="18"></line>
                <line x1="18" y1="6" x2="6" y2="18"></line>
              </svg>
            </button>
          </header>


          <div class="import__body">
            <!-- список -->
            <template v-if="step === 'input' && tab === 'list'">
              <p class="import__intro">{{ t('flashCards.listHint') }}</p>
              <textarea
                  v-model="listText"
                  class="import__textarea"
                  :placeholder="t('flashCards.listPlaceholder')"
                  rows="8"
                  autocapitalize="off"
                  spellcheck="false"
              ></textarea>
              <p class="import__hint">{{ t('flashCards.listTip') }}</p>
            </template>

            <!-- из курса: земли, потом квесты земли -->
            <template v-else-if="step === 'input' && tab === 'course'">
              <div v-if="!openedLand" class="import__lands">
                <template v-for="group in landGroups" :key="group.key">
                  <p class="import__group">{{ t(`categories.${group.key}`) }}</p>
                  <button v-for="land in group.lands" :key="land.id" type="button" class="import__land"
                          @click="openLand(land)">
                    <img class="import__land-img" :src="land.icon" alt="" loading="lazy" decoding="async">
                    <span class="import__land-name">{{ t(land.name) }}</span>
                    <span v-if="startedLands.has(land.id)" class="import__land-badge">✓</span>
                  </button>
                </template>
              </div>
              <div v-else class="import__quests">
                <p v-if="questsLoading" class="import__hint">{{ t('flashCards.loading') }}</p>
                <p v-else-if="!quests.length" class="import__hint">{{ t('flashCards.noWords') }}</p>
                <label v-for="quest in quests" :key="quest.questId" class="import__quest">
                  <input v-model="pickedQuests" type="checkbox" :value="quest.questId" class="import__check">
                  <span class="import__quest-name">{{ t(quest.title) }}</span>
                  <span class="import__quest-count">{{ quest.vocabulary.length }}</span>
                </label>
              </div>
            </template>

            <!-- проверка перед добавлением -->
            <template v-else-if="step === 'preview'">
              <p v-if="aiBusy" class="import__ai">✨ {{ t('flashCards.aiWorking') }}</p>
              <p v-else-if="aiError" class="import__ai import__ai--error">{{ aiError }}</p>
              <p v-else class="import__hint">{{ t('flashCards.previewHint') }}</p>
              <ul class="import__rows">
                <li v-for="(row, index) in rows" :key="index" class="import__row"
                    :class="{ 'import__row--off': !row.checked, 'import__row--dup': row.duplicate }">
                  <input v-model="row.checked" type="checkbox" class="import__check" :disabled="row.duplicate">
                  <div class="import__row-main">
                    <p class="import__row-de">
                      <span v-if="row.article" :style="{ color: ARTICLE_COLORS[row.article] }">{{ row.article }}</span>
                      {{ row.de }}
                      <span v-if="row.plural" class="import__row-dim">· die {{ row.plural }}</span>
                    </p>
                    <input v-model="row.translation" class="import__row-input" :placeholder="t('flashCards.translation')"
                           :disabled="row.duplicate" maxlength="120">
                  </div>
                  <span v-if="row.duplicate" class="import__chip import__chip--dup">{{ t('flashCards.inDeck') }}</span>
                  <span v-else-if="row.ai" class="import__chip import__chip--ai">AI</span>
                  <span v-else-if="!row.found" class="import__chip">{{ t('flashCards.notInDictionary') }}</span>
                </li>
              </ul>
            </template>
          </div>

          <footer class="import__foot">
            <button v-if="step === 'input' && tab === 'list'" type="button" class="import__btn"
                    :disabled="!parsedList.length" @click="previewList">
              {{ t('flashCards.listParse', {count: parsedList.length}) }}
            </button>
            <button v-else-if="step === 'input' && tab === 'course' && openedLand" type="button" class="import__btn"
                    :disabled="!pickedQuests.length" @click="previewCourse">
              {{ t('flashCards.showWords') }}
            </button>
            <button v-else-if="step === 'preview'" type="button" class="import__btn"
                    :disabled="!readyRows.length || saving || aiBusy"
                    @click="save">
              {{ t('flashCards.addMany', {count: readyRows.length}) }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {regions} from '~/utils/regions.js'
import {
  ARTICLE_COLORS, loadDictionary, parseWordList, cardFromText, cardsFromQuestVocabulary, dictionaryKey
} from '~/utils/cardDictionary.js'
import {landsWithProgress} from '~/utils/landProgress.js'
import {userChainStore} from '~/store/chainStore.js'
import {useDecksStore} from '~/store/decksStore.js'
import {aiFillCards} from '~/utils/deckAi.js'

const props = defineProps({
  modelValue: {type: Boolean, default: false},
  deckId: {type: String, required: true},
  // с какой вкладки открыть: list | course
  startTab: {type: String, default: 'list'},
  accent: {type: String, default: '#8b5cf6'}
})
const emit = defineEmits(['update:modelValue', 'added'])
const {t, locale} = useI18n()
const decksStore = useDecksStore()
const chainStore = userChainStore()

const tab = ref('list')
const step = ref('input')
const listText = ref('')
const rows = ref([])
const saving = ref(false)
const openedLand = ref(null)
const quests = ref([])
const questsLoading = ref(false)
const pickedQuests = ref([])
const aiBusy = ref(false)
const aiError = ref('')


const headTitle = computed(() => {
  if (step.value === 'preview') return t('flashCards.previewTitle')
  if (openedLand.value) return t(openedLand.value.name)
  return tab.value === 'course' ? t('flashCards.courseTitle') : t('flashCards.listTitle')
})

const landGroups = computed(() => Object.entries(regions).map(([key, lands]) => ({key, lands})))
const startedLands = computed(() => landsWithProgress(chainStore.questProgress))
const parsedList = computed(() => parseWordList(listText.value))
const readyRows = computed(() => rows.value.filter(row => row.checked && !row.duplicate && row.translation.trim()))

watch(() => props.modelValue, (open) => {
  if (!open) return
  tab.value = props.startTab
  step.value = 'input'
  openedLand.value = null
  pickedQuests.value = []
  rows.value = []
  aiError.value = ''
  loadDictionary().catch(err => console.error(err))
})

function close() {
  emit('update:modelValue', false)
}

function goBack() {
  if (aiBusy.value) return
  aiError.value = ''
  if (step.value === 'preview') step.value = 'input'
  else openedLand.value = null
}

// строки проверки: повторы внутри списка схлопываем, слова из колоды показываем, но не добавляем
function showPreview(cards) {
  const inDeck = new Set(decksStore.cardsOfDeck(props.deckId).map(card => dictionaryKey(card.de)))
  const seen = new Set()
  rows.value = cards.filter(card => {
    const key = dictionaryKey(card.de)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  }).map(card => {
    const key = dictionaryKey(card.de)
    const duplicate = inDeck.has(key)
    return {...card, key, duplicate, checked: !duplicate}
  })
  step.value = 'preview'
  fillUnknown()
}

function aiErrorText(err) {
  if (err?.code === 'LIMIT') return t('flashCards.aiLimit')
  if (err?.code === 'NETWORK') return t('flashCards.aiOffline')
  return t('flashCards.aiFailed')
}

// слов нет в словаре: просим AI дописать артикль, мн. число и перевод
async function fillUnknown() {
  const unknown = rows.value.filter(row => !row.found && !row.duplicate).slice(0, 40)
  if (!unknown.length) return
  aiBusy.value = true
  aiError.value = ''
  try {
    const {cards} = await aiFillCards(unknown, locale.value)
    unknown.forEach((row, index) => {
      const card = cards[index]
      if (!card) return
      Object.assign(row, {
        ...card,
        translation: row.translation || card.translation,
        key: dictionaryKey(card.de),
        found: true,
        ai: true
      })
    })
  } catch (err) {
    aiError.value = aiErrorText(err)
  } finally {
    aiBusy.value = false
  }
}

async function previewList() {
  await loadDictionary().catch(err => console.error(err))
  showPreview(parsedList.value.map(item => cardFromText(item.de, item.translation, locale.value)))
}

async function openLand(land) {
  openedLand.value = land
  pickedQuests.value = []
  quests.value = []
  questsLoading.value = true
  try {
    const res = await fetch(`/quests/quests-${land.pathTo}.json`)
    const data = await res.json()
    const list = Array.isArray(data) ? data : Object.values(data)
    quests.value = list.filter(quest => quest?.questId && quest.vocabulary?.length)
  } catch (err) {
    console.error(err)
  } finally {
    questsLoading.value = false
  }
}

async function previewCourse() {
  await loadDictionary().catch(err => console.error(err))
  const picked = quests.value.filter(quest => pickedQuests.value.includes(quest.questId))
  showPreview(picked.flatMap(quest => cardsFromQuestVocabulary(quest.vocabulary, locale.value)))
}

async function save() {
  if (!readyRows.value.length || saving.value) return
  saving.value = true
  try {
    const added = await decksStore.addCards(props.deckId, readyRows.value.map(row => ({...row, translation: row.translation.trim()})))
    emit('added', added.length)
    listText.value = ''
    close()
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.import {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(15, 23, 42, 0.55);
}

.import__panel {
  --accent: #8b5cf6;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 560px;
  max-height: 88vh;
  max-height: 88dvh;
  box-sizing: border-box;
  border-radius: 24px 24px 0 0;
  background: var(--bgModal);
  color: var(--titleColor);
}

.import__head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 10px;
}

.import__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--title);
  font-size: 19px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.import__back,
.import__close {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: var(--tabBg);
  color: var(--title);
  cursor: pointer;
}

.import__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 16px 8px;
}

.import__textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  background: var(--bg);
  color: var(--titleColor);
  font-family: inherit;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.45;
  resize: vertical;
  outline: none;
}

.import__textarea:focus {
  border-color: var(--accent);
}

.import__intro {
  margin: 0 2px 10px;
  color: var(--title);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.35;
}

.import__hint {
  margin: 8px 2px;
  color: var(--title);
  font-size: 14px;
  font-weight: 700;
  opacity: 0.75;
}

.import__lands {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.import__group {
  margin: 10px 2px 2px;
  color: var(--title);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  opacity: 0.7;
}

.import__land,
.import__quest {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 14px;
  background: var(--bg);
  color: var(--title);
  text-align: start;
  cursor: pointer;
}

.import__land-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.import__land-name,
.import__quest-name {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  font-weight: 800;
}

.import__land-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #22c55e;
  color: #fff;
  font-size: 13px;
  font-weight: 900;
}

.import__quests {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.import__quest-count {
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--tabBg);
  font-size: 13px;
  font-weight: 900;
}

.import__check {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  accent-color: var(--accent);
}

.import__rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
}

.import__row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 14px;
  background: var(--bg);
}

.import__row--off {
  opacity: 0.55;
}

.import__row--dup {
  opacity: 0.45;
}

.import__row-main {
  flex: 1;
  min-width: 0;
}

.import__row-de {
  color: var(--title);
  font-size: 16px;
  font-weight: 900;
  overflow-wrap: anywhere;
}

.import__row-dim {
  font-size: 13px;
  opacity: 0.6;
}

.import__row-input {
  width: 100%;
  box-sizing: border-box;
  margin-top: 4px;
  padding: 6px 8px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 10px;
  background: transparent;
  color: var(--titleColor);
  font-size: 14px;
  font-weight: 700;
  outline: none;
}

.import__row-input:focus {
  border-color: var(--accent);
}

.import__chip {
  flex-shrink: 0;
  padding: 3px 7px;
  border-radius: 8px;
  background: #fef3c7;
  color: #b45309;
  font-size: 11px;
  font-weight: 900;
}

.import__chip--ai {
  background: linear-gradient(90deg, #a78bfa, #ec4899);
  color: #fff;
}

.import__ai {
  margin: 8px 2px;
  padding: 10px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  color: var(--title);
  font-size: 14px;
  font-weight: 800;
}

.import__ai--error {
  background: color-mix(in srgb, #ef4444 14%, transparent);
  color: #b91c1c;
}

.import__chip--dup {
  background: var(--tabBg);
  color: var(--title);
}

.import__foot {
  padding: 10px 16px calc(16px + env(safe-area-inset-bottom));
}

.import__btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 16px;
  background: var(--accent);
  box-shadow: 0 5px 0 color-mix(in srgb, var(--accent) 65%, #000);
  color: #fff;
  font-size: 17px;
  font-weight: 900;
  cursor: pointer;
}

.import__btn:active:not(:disabled) {
  transform: translateY(5px);
  box-shadow: none;
}

.import__btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.import-sheet-enter-active,
.import-sheet-leave-active {
  transition: opacity 0.2s ease;
}

.import-sheet-enter-active .import__panel,
.import-sheet-leave-active .import__panel {
  transition: transform 0.25s ease;
}

.import-sheet-enter-from,
.import-sheet-leave-to {
  opacity: 0;
}

.import-sheet-enter-from .import__panel,
.import-sheet-leave-to .import__panel {
  transform: translateY(100%);
}
</style>
