<template>
  <Teleport to="body">
    <Transition name="add-deck">
      <div v-if="modelValue" class="add-deck" @click.self="close">
        <div class="add-deck__panel">
          <template v-if="!done">
            <h2 class="add-deck__title">{{ t('flashCards.toDeckTitle', {count: cards.length}) }}</h2>
            <p class="add-deck__words">{{ preview }}</p>

            <div v-if="!decksStore.loaded" class="add-deck__loading">{{ t('flashCards.loading') }}</div>
            <ul v-else class="add-deck__list">
              <li>
                <button type="button" class="add-deck__item" :class="{ 'add-deck__item--on': target === NEW }"
                        @click="target = NEW">
                  <span class="add-deck__dot add-deck__dot--new">+</span>
                  <span class="add-deck__name">{{ t('flashCards.newDeckNamed', {title: newTitle}) }}</span>
                </button>
              </li>
              <li v-for="deck in decksStore.decks" :key="deck.id">
                <button type="button" class="add-deck__item" :class="{ 'add-deck__item--on': target === deck.id }"
                        @click="target = deck.id">
                  <span class="add-deck__dot" :style="{ background: deck.color }"></span>
                  <span class="add-deck__name">{{ deck.title }}</span>
                  <span class="add-deck__count">{{ decksStore.deckStats(deck.id).total }}</span>
                </button>
              </li>
            </ul>

            <button type="button" class="add-deck__btn" :disabled="saving || !decksStore.loaded" @click="save">
              {{ t('flashCards.addMany', {count: cards.length}) }}
            </button>
          </template>

          <div v-else class="add-deck__done">
            <p class="add-deck__done-icon" aria-hidden="true">🗂️</p>
            <p class="add-deck__title">{{ t('flashCards.addedMany', {count: addedCount}) }}</p>
            <p v-if="addedCount < cards.length" class="add-deck__words">{{ t('flashCards.skippedInDeck') }}</p>
            <NuxtLink class="add-deck__btn" :to="`/cards/${doneDeckId}`" @click="close">
              {{ t('flashCards.openDeck') }}
            </NuxtLink>
            <button type="button" class="add-deck__ghost" @click="close">{{ t('flashCards.close') }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useDecksStore, DECK_COLORS} from '~/store/decksStore.js'

const props = defineProps({
  modelValue: {type: Boolean, default: false},
  // готовые карточки (kind, de, article, plural, translation ...)
  cards: {type: Array, default: () => []},
  // название новой колоды, например имя квеста
  suggestedTitle: {type: String, default: ''},
  level: {type: String, default: ''}
})
const emit = defineEmits(['update:modelValue'])
const {t} = useI18n()
const decksStore = useDecksStore()

const NEW = '__new__'
const target = ref(NEW)
const saving = ref(false)
const addedCount = ref(0)
const done = ref(false)
const doneDeckId = ref('')

const newTitle = computed(() => props.suggestedTitle || t('flashCards.newDeck'))
const preview = computed(() => props.cards.slice(0, 6).map(card => (card.article ? `${card.article} ${card.de}` : card.de)).join(', ')
    + (props.cards.length > 6 ? ' ...' : ''))

watch(() => props.modelValue, (open) => {
  if (!open) return
  addedCount.value = 0
  done.value = false
  target.value = NEW
  decksStore.load().catch(err => console.error(err))
})

function close() {
  emit('update:modelValue', false)
}

async function save() {
  if (saving.value) return
  saving.value = true
  try {
    let deckId = target.value
    if (deckId === NEW) {
      const deck = await decksStore.createDeck({
        title: newTitle.value,
        level: props.level,
        color: DECK_COLORS[Math.floor(Math.random() * DECK_COLORS.length)]
      })
      deckId = deck?.id
    }
    if (!deckId) return
    const added = await decksStore.addCards(deckId, props.cards)
    doneDeckId.value = deckId
    addedCount.value = added.length
    done.value = true
  } catch (err) {
    console.error(err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.add-deck {
  position: fixed;
  inset: 0;
  z-index: 1001;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(15, 23, 42, 0.55);
}

.add-deck__panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 560px;
  max-height: 85vh;
  max-height: 85dvh;
  box-sizing: border-box;
  overflow-y: auto;
  padding: 22px 18px calc(20px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0;
  background: var(--bgModal);
}

.add-deck__title {
  color: var(--title);
  font-size: 19px;
  font-weight: 900;
  text-align: center;
}

.add-deck__words {
  color: var(--title);
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  opacity: 0.75;
}

.add-deck__loading {
  color: var(--title);
  text-align: center;
}

.add-deck__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
}

.add-deck__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 14px;
  background: var(--bg);
  color: var(--title);
  text-align: start;
  cursor: pointer;
}

.add-deck__item--on {
  border-color: #8b5cf6;
  background: color-mix(in srgb, #8b5cf6 10%, var(--bg));
}

.add-deck__dot {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
}

.add-deck__dot--new {
  background: #8b5cf6;
  color: #fff;
  font-size: 18px;
  font-weight: 900;
}

.add-deck__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 15px;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.add-deck__count {
  font-size: 13px;
  font-weight: 800;
  opacity: 0.6;
}

.add-deck__btn {
  display: block;
  padding: 14px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%);
  box-shadow: 0 5px 0 #6d28d9;
  color: #fff;
  font-size: 17px;
  font-weight: 900;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.add-deck__btn:active:not(:disabled) {
  transform: translateY(5px);
  box-shadow: none;
}

.add-deck__btn:disabled {
  opacity: 0.5;
}

.add-deck__ghost {
  padding: 10px;
  border: none;
  background: none;
  color: var(--title);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.add-deck__done {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
}

.add-deck__done-icon {
  font-size: 54px;
  line-height: 1;
}

.add-deck-enter-active,
.add-deck-leave-active {
  transition: opacity 0.2s ease;
}

.add-deck-enter-active .add-deck__panel,
.add-deck-leave-active .add-deck__panel {
  transition: transform 0.25s ease;
}

.add-deck-enter-from,
.add-deck-leave-to {
  opacity: 0;
}

.add-deck-enter-from .add-deck__panel,
.add-deck-leave-to .add-deck__panel {
  transform: translateY(100%);
}
</style>
