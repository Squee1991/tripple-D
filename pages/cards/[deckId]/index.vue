<template>
  <div class="deck-page" :style="{ '--deck': deck?.color || '#8b5cf6' }">
    <header class="deck-head">
      <VBackBtnNav/>
      <h1 class="deck-head__title">{{ deck?.title || t('flashCards.pageTitle') }}</h1>
      <div v-if="deck" class="deck-head__menu">
        <button type="button" class="deck-head__menu-btn" :aria-label="t('flashCards.editTitle')"
                @click="menuOpen = !menuOpen">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <circle cx="5" cy="12" r="2.4"></circle>
            <circle cx="12" cy="12" r="2.4"></circle>
            <circle cx="19" cy="12" r="2.4"></circle>
          </svg>
        </button>
        <div v-if="menuOpen" class="deck-head__dropdown">
          <button type="button" @click="openEdit">✏️ {{ t('flashCards.editTitle') }}</button>
          <button v-if="cardsWithoutExample.length" type="button" :disabled="examplesBusy" @click="addExamples">
            ✨ {{ examplesBusy ? t('flashCards.aiWorking') : t('flashCards.addExamples') }}
          </button>
          <span v-else-if="deckCards.length" class="deck-head__note">✓ {{ t('flashCards.examplesAllDone') }}</span>
          <button v-if="!confirmDeckDelete" type="button" class="deck-head__danger" @click="confirmDeckDelete = true">
            🗑️ {{ t('flashCards.deleteDeck') }}
          </button>
          <div v-else class="deck-head__confirm">
            <p class="deck-head__confirm-text">{{ t('flashCards.deleteDeckConfirm') }}</p>
            <div class="deck-head__confirm-actions">
              <button type="button" class="deck-head__confirm-yes" :disabled="saving" @click="removeDeck">
                {{ t('flashCards.yes') }}
              </button>
              <button type="button" class="deck-head__confirm-no" @click="confirmDeckDelete = false">
                {{ t('flashCards.no') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div v-if="!decksStore.loaded" class="deck-loading"><span class="deck-loading__dot"></span></div>

    <section v-else-if="!deck" class="deck-missing">
      <p>{{ t('flashCards.notFound') }}</p>
      <NuxtLink to="/cards" class="deck-btn">{{ t('flashCards.toDecks') }}</NuxtLink>
    </section>

    <template v-else>
      <section class="deck-hero">
        <div class="deck-hero__top">
          <span v-if="deck.level" class="deck-hero__level">{{ deck.level }}</span>
          <span class="deck-hero__count">{{ t('flashCards.deckCards', {count: stats.total}) }}</span>
        </div>
        <div class="deck-hero__stats">
          <div class="deck-hero__stat">
            <span class="deck-hero__num">{{ stats.fresh }}</span>
            <span class="deck-hero__cap">{{ t('flashCards.statNew') }}</span>
          </div>
          <div class="deck-hero__stat">
            <span class="deck-hero__num">{{ stats.learning }}</span>
            <span class="deck-hero__cap">{{ t('flashCards.statLearning') }}</span>
          </div>
          <div class="deck-hero__stat">
            <span class="deck-hero__num">{{ stats.mastered }}</span>
            <span class="deck-hero__cap">{{ t('flashCards.statMastered') }}</span>
          </div>
        </div>
      </section>

      <!-- один главный вход: приложение само решает, что повторить и что выучить впервые -->
      <section class="deck-study">
        <button type="button" class="deck-study__main" :disabled="!studyCount" @click="start('study')">
          <span class="deck-study__icon" aria-hidden="true">{{ studyCount ? '🎓' : '✅' }}</span>
          <span class="deck-study__text">
            <span class="deck-study__title">{{ studyCount ? t('flashCards.learn') : t('flashCards.studyDoneTitle') }}</span>
            <span class="deck-study__sub">{{ studySubtitle }}</span>
          </span>
        </button>
        <button type="button" class="deck-study__browse" :disabled="!stats.total" @click="start('flash')">
          🃏 {{ t('flashCards.browse') }}
        </button>
      </section>

      <section class="deck-panel">
        <h2 class="deck-panel__title">{{ t('flashCards.addTitle') }}</h2>
        <VCardForm ref="addForm" :existing-keys="existingKeys" :saving="saving" :accent="deck.color"
                   @save="addCard"/>
        <div class="deck-import">
          <button type="button" class="deck-import__btn" @click="openImport('list')">
            <span class="deck-import__icon" aria-hidden="true">📋</span>{{ t('flashCards.tabList') }}
          </button>
          <button type="button" class="deck-import__btn" @click="openImport('course')">
            <span class="deck-import__icon" aria-hidden="true">🗺️</span>{{ t('flashCards.tabCourse') }}
          </button>
        </div>
      </section>

      <section class="deck-panel">
        <h2 class="deck-panel__title">{{ t('flashCards.cardsList') }}</h2>
        <p v-if="!deckCards.length" class="deck-panel__empty">{{ t('flashCards.noCards') }}</p>
        <ul v-else class="deck-cards">
          <li v-for="card in deckCards" :key="card.id" class="deck-card">
            <VCardForm
                v-if="editingId === card.id"
                :card="card"
                :existing-keys="existingKeys"
                :saving="saving"
                :accent="deck.color"
                @save="data => saveCard(card, data)"
                @cancel="editingId = null"
            />
            <template v-else>
              <button type="button" class="deck-card__sound" :aria-label="t('flashCards.listen')"
                      @click="speak(card)">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M4 9v6h4l5 4V5L8 9H4z"/>
                  <path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" stroke-width="2.2"
                        stroke-linecap="round"/>
                </svg>
              </button>
              <div class="deck-card__body">
                <p class="deck-card__de">
                  <span v-if="card.article" class="deck-card__art" :style="{ color: ARTICLE_COLORS[card.article] }">
                    {{ card.article }}
                  </span>
                  {{ card.de }}
                </p>
                <p class="deck-card__extra">
                  <span>{{ card.translation }}</span>
                  <span v-if="card.plural" class="deck-card__dim">· die {{ card.plural }}</span>
                  <span v-if="card.perfekt" class="deck-card__dim">· {{ card.perfekt }}</span>
                </p>
                <p v-if="card.example" class="deck-card__example">{{ card.example }}</p>
                <span class="deck-card__progress">
                  <span v-if="card.level" class="deck-card__dots" aria-hidden="true">
                    <span v-for="step in MAX_WORD_LEVEL" :key="step" class="deck-card__dot"
                          :class="{ 'deck-card__dot--on': (card.level || 0) >= step }"></span>
                  </span>
                  <span class="deck-card__status">{{ cardStatus(card) }}</span>
                </span>
              </div>
              <div class="deck-card__actions">
                <button type="button" class="deck-card__icon" :aria-label="t('flashCards.editCard')"
                        @click="editingId = card.id">✏️
                </button>
                <button v-if="confirmCardId !== card.id" type="button" class="deck-card__icon"
                        :aria-label="t('flashCards.delete')" @click="confirmCardId = card.id">🗑️
                </button>
                <button v-else type="button" class="deck-card__sure" @click="removeCard(card)">
                  {{ t('flashCards.delete') }}
                </button>
              </div>
            </template>
          </li>
        </ul>
      </section>
    </template>

    <VCardImport v-if="deck" v-model="importOpen" :deck-id="deckId" :start-tab="importTab" :accent="deck.color"
                 @added="onImported"/>
    <Transition name="deck-toast">
      <div v-if="toast" class="deck-toast">{{ toast }}</div>
    </Transition>
    <VDeckForm v-model="editOpen" :deck="deck" :saving="saving" @save="saveDeck"/>
  </div>
</template>

<script setup>
import {ref, computed, watch, onBeforeUnmount} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useSeoMeta} from '#imports'
import VBackBtnNav from '~/src/components/V-backBtnNav.vue'
import VDeckForm from '~/src/components/cards/V-deckForm.vue'
import VCardForm from '~/src/components/cards/V-cardForm.vue'
import VCardImport from '~/src/components/cards/V-cardImport.vue'
import {aiExamples} from '~/utils/deckAi.js'
import {userAuthStore} from '~/store/authStore.js'
import {useDecksStore} from '~/store/decksStore.js'
import {ARTICLE_COLORS, dictionaryKey} from '~/utils/cardDictionary.js'
import {MAX_WORD_LEVEL, LESSON_WORD_COUNT, isWordInReview, isWordMastered, getDateKey, getDateKeyAfterDays} from '~/utils/wordReview.js'
import {getSpeechAudio} from '~/utils/googleTTS.js'

useSeoMeta({robots: 'noindex, nofollow'})

const {t, locale} = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = userAuthStore()
const decksStore = useDecksStore()

const deckId = computed(() => String(route.params.deckId || ''))
const deck = computed(() => decksStore.deckById(deckId.value))
const deckCards = computed(() => decksStore.cardsOfDeck(deckId.value))

// подпись к полоскам: где карточка в повторении
function cardStatus(card) {
  if (!isWordInReview(card)) return t('flashCards.statusNew')
  if (isWordMastered(card)) return t('flashCards.statusMastered')
  const next = card.nextReviewDate || ''
  if (!next || next <= getDateKey()) return t('flashCards.statusToday')
  if (next === getDateKeyAfterDays(1)) return t('flashCards.statusTomorrow')
  const [year, month, day] = next.split('-').map(Number)
  const date = new Date(year, month - 1, day).toLocaleDateString(locale.value, {day: 'numeric', month: 'short'})
  return t('flashCards.statusOn', {date})
}
const stats = computed(() => decksStore.deckStats(deckId.value))
const existingKeys = computed(() => deckCards.value.map(card => dictionaryKey(card.de)))

const addForm = ref(null)
const saving = ref(false)
const editingId = ref(null)
const confirmCardId = ref(null)
const menuOpen = ref(false)
const confirmDeckDelete = ref(false)
const editOpen = ref(false)
const importOpen = ref(false)
const importTab = ref('list')
const toast = ref('')
let toastTimer = null

function openImport(tab) {
  importTab.value = tab
  importOpen.value = true
}

function showToast(text) {
  toast.value = text
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.value = ''
  }, 2500)
}

// AI пишет примеры к карточкам без примера, под уровень колоды (до 20 за раз)
const examplesBusy = ref(false)
const cardsWithoutExample = computed(() => deckCards.value.filter(card => !card.example))
async function addExamples() {
  const list = cardsWithoutExample.value.slice(0, 20)
  if (!list.length || examplesBusy.value) return
  examplesBusy.value = true
  try {
    const {examples} = await aiExamples(list, deck.value?.level || 'A1', locale.value)
    const updates = list.map((card, index) => (examples[index] ? decksStore.updateCard(card.id, {example: examples[index]}) : null))
    await Promise.all(updates.filter(Boolean))
    menuOpen.value = false
    showToast(t('flashCards.examplesAdded', {count: updates.filter(Boolean).length}))
  } catch (err) {
    showToast(err?.code === 'LIMIT' ? t('flashCards.aiLimit') : t('flashCards.aiFailed'))
  } finally {
    examplesBusy.value = false
  }
}

const onImported = (count) => showToast(t('flashCards.addedMany', {count}))
onBeforeUnmount(() => clearTimeout(toastTimer))

watch(() => [authStore.initialized, authStore.uid], ([initialized, uid]) => {
  if (!initialized) return
  if (!uid) {
    router.replace('/')
    return
  }
  decksStore.load().catch(err => console.error(err))
}, {immediate: true})

watch(menuOpen, (open) => {
  if (!open) confirmDeckDelete.value = false
})

// сколько войдёт в «Учить»: всё, что пора повторить, и до LESSON_WORD_COUNT новых
const studyNew = computed(() => Math.min(stats.value.fresh, LESSON_WORD_COUNT))
const studyCount = computed(() => stats.value.due + studyNew.value)
const studySubtitle = computed(() => {
  if (!stats.value.total) return t('flashCards.studyEmpty')
  if (!studyCount.value) return t('flashCards.studyDoneSub')
  const parts = []
  if (stats.value.due) parts.push(t('flashCards.studyDue', {count: stats.value.due}))
  if (studyNew.value) parts.push(t('flashCards.studyNew', {count: studyNew.value}))
  return parts.join(' · ')
})

function start(mode) {
  router.push(`/cards/${deckId.value}/session?mode=${mode}`)
}

async function withSaving(action) {
  saving.value = true
  try {
    await action()
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}

const addCard = (data) => withSaving(async () => {
  await decksStore.addCard(deckId.value, data)
  addForm.value?.reset()
})

const saveCard = (card, data) => withSaving(async () => {
  await decksStore.updateCard(card.id, data)
  editingId.value = null
})

const removeCard = (card) => withSaving(async () => {
  await decksStore.deleteCard(card.id)
  confirmCardId.value = null
})

function openEdit() {
  menuOpen.value = false
  editOpen.value = true
}

const saveDeck = (data) => withSaving(async () => {
  await decksStore.updateDeck(deckId.value, data)
  editOpen.value = false
})

const removeDeck = () => withSaving(async () => {
  await decksStore.deleteDeck(deckId.value)
  router.replace('/cards')
})

function speak(card) {
  getSpeechAudio(card.article ? `${card.article} ${card.de}` : card.de)
}
</script>

<style scoped>
.deck-page {
  --deck: #8b5cf6;
  width: 100%;
  max-width: 640px;
  min-height: 100%;
  margin: 0 auto;
  padding: 12px 16px 40px;
  box-sizing: border-box;
}

.deck-head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.deck-head__title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--title);
  font-size: 22px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deck-head__menu {
  position: relative;
}

.deck-head__menu-btn {
  display: flex;
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

.deck-head__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  inset-inline-end: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  min-width: 210px;
  padding: 6px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 14px;
  background: var(--bgModal);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
}

.deck-head__dropdown button {
  padding: 11px 12px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--title);
  font-size: 15px;
  font-weight: 800;
  text-align: start;
  cursor: pointer;
}

.deck-head__dropdown button:disabled {
  opacity: 0.5;
  cursor: default;
}

.deck-head__note {
  padding: 11px 12px;
  color: var(--title);
  font-size: 14px;
  font-weight: 800;
  opacity: 0.65;
}

.deck-head__danger {
  color: #dc2626 !important;
}

.deck-head__confirm {
  padding: 8px 6px 4px;
}

.deck-head__confirm-text {
  margin-bottom: 10px;
  color: var(--title);
  font-size: 15px;
  font-weight: 800;
}

.deck-head__confirm-actions {
  display: flex;
  gap: 8px;
}

/* «Нет» заметная, «Да» без фона: случайно удалить сложнее */
.deck-head__dropdown .deck-head__confirm-no,
.deck-head__dropdown .deck-head__confirm-yes {
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 900;
  text-align: center;
}

.deck-head__dropdown .deck-head__confirm-no {
  background: #22c55e;
  box-shadow: 0 4px 0 #15803d;
  color: #fff;
}

.deck-head__dropdown .deck-head__confirm-no:active {
  transform: translateY(4px);
  box-shadow: none;
}

.deck-head__dropdown .deck-head__confirm-yes {
  background: transparent;
  color: #ef4444;
}

.deck-loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.deck-loading__dot {
  width: 34px;
  height: 34px;
  border: 4px solid var(--tabsSlideBorderColor);
  border-top-color: var(--deck);
  border-radius: 50%;
  animation: deck-spin 0.8s linear infinite;
}

@keyframes deck-spin {
  to {
    rotate: 360deg;
  }
}

.deck-missing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 40px 0;
  color: var(--title);
  font-size: 17px;
  font-weight: 800;
}

.deck-btn {
  padding: 12px 18px;
  border-radius: 14px;
  background: var(--deck);
  box-shadow: 0 4px 0 color-mix(in srgb, var(--deck) 65%, #000);
  color: #fff;
  font-weight: 900;
  text-decoration: none;
}

.deck-hero {
  margin-bottom: 14px;
  padding: 14px 16px 16px;
  border-radius: 20px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--deck) 75%, #fff) 0%, var(--deck) 100%);
  box-shadow: 0 5px 0 color-mix(in srgb, var(--deck) 65%, #000), 0 8px 14px rgba(0, 0, 0, 0.18);
  color: #fff;
}

.deck-hero__top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.deck-hero__level {
  padding: 2px 9px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--deck);
  font-size: 13px;
  font-weight: 900;
}

.deck-hero__count {
  font-size: 14px;
  font-weight: 800;
  opacity: 0.95;
}

.deck-hero__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.deck-hero__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
}

.deck-hero__num {
  font-size: 22px;
  font-weight: 900;
  line-height: 1.1;
}

.deck-hero__cap {
  font-size: 12px;
  font-weight: 800;
  opacity: 0.92;
}

.deck-study {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}

.deck-study__main {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 20px;
  background: linear-gradient(180deg, #4ade80 0%, #16a34a 100%);
  box-shadow: 0 5px 0 #15803d;
  color: #fff;
  text-align: start;
  cursor: pointer;
}

.deck-study__main:active:not(:disabled) {
  transform: translateY(5px);
  box-shadow: none;
}

.deck-study__main:disabled {
  background: var(--menuItemsBg);
  box-shadow: 0 5px 0 var(--tabsSlideBorderColor);
  color: var(--title);
  cursor: default;
}

.deck-study__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #fff;
  font-size: 24px;
}

.deck-study__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.deck-study__title {
  font-size: 20px;
  font-weight: 900;
}

.deck-study__sub {
  font-size: 14px;
  font-weight: 800;
  opacity: 0.9;
}

.deck-study__browse {
  padding: 12px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  background: var(--bg);
  box-shadow: 0 3px 0 var(--tabsSlideBorderColor);
  color: var(--title);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.deck-study__browse:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: none;
}

.deck-study__browse:disabled {
  opacity: 0.5;
  cursor: default;
}

.deck-panel {
  margin-bottom: 16px;
  padding: 14px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 20px;
  background: var(--tabsSlideBg);
  box-shadow: var(--boxShadowMobile);
}

.deck-panel__title {
  margin-bottom: 12px;
  color: var(--title);
  font-size: 17px;
  font-weight: 900;
}

.deck-panel__empty {
  color: var(--title);
  font-size: 15px;
  font-weight: 700;
  opacity: 0.7;
}

.deck-import {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

/* объёмные кнопки цвета колоды: видно, что на них можно нажать */
.deck-import__btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  padding: 12px 8px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(180deg, color-mix(in srgb, var(--deck) 80%, #fff) 0%, var(--deck) 100%);
  box-shadow: 0 5px 0 color-mix(in srgb, var(--deck) 60%, #000);
  color: #fff;
  font-size: 15px;
  font-weight: 900;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.deck-import__btn:active {
  transform: translateY(5px);
  box-shadow: none;
}

.deck-import__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  font-size: 15px;
  text-shadow: none;
}

.deck-toast {
  position: fixed;
  bottom: calc(24px + env(safe-area-inset-bottom));
  left: 50%;
  z-index: 1100;
  padding: 12px 18px;
  border-radius: 16px;
  background: #1e272e;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  translate: -50% 0;
  width: max-content;
  max-width: calc(100% - 32px);
  box-sizing: border-box;
  text-align: center;
}

.deck-toast-enter-active,
.deck-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.deck-toast-enter-from,
.deck-toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.deck-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
}

.deck-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  background: var(--bg);
}

.deck-card > .card-form {
  flex: 1;
}

.deck-card__sound {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: var(--deck);
  color: #fff;
  cursor: pointer;
}

.deck-card__body {
  flex: 1;
  min-width: 0;
}

.deck-card__de {
  color: var(--title);
  font-size: 17px;
  font-weight: 900;
  overflow-wrap: anywhere;
}

.deck-card__art {
  font-weight: 900;
}

.deck-card__extra {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  color: var(--title);
  font-size: 14px;
  font-weight: 700;
}

.deck-card__dim {
  opacity: 0.6;
}

.deck-card__example {
  margin-top: 3px;
  color: var(--title);
  font-size: 13px;
  font-style: italic;
  font-weight: 700;
  opacity: 0.75;
}

.deck-card__progress {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 5px;
}

.deck-card__dots {
  display: flex;
  gap: 3px;
}

.deck-card__status {
  white-space: nowrap;
  color: var(--title);
  font-size: 12px;
  font-weight: 800;
  opacity: 0.65;
}

.deck-card__dot {
  width: 10px;
  height: 5px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--title) 18%, transparent);
}

.deck-card__dot--on {
  background: var(--deck);
}

.deck-card__actions {
  display: flex;
  flex-shrink: 0;
  gap: 4px;
}

.deck-card__icon {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: var(--tabBg);
  font-size: 15px;
  cursor: pointer;
}

.deck-card__sure {
  padding: 0 10px;
  height: 34px;
  border: none;
  border-radius: 10px;
  background: #dc2626;
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}
</style>
