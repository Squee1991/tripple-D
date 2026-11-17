<template>
  <Teleport to="body">
    <Transition name="deck-sheet">
      <div v-if="modelValue" class="deck-sheet" @click.self="close">
        <form class="deck-sheet__panel" @submit.prevent="submit">
          <h2 class="deck-sheet__title">{{ deck ? t('flashCards.editTitle') : t('flashCards.createTitle') }}</h2>

          <label class="deck-sheet__label" for="deck-title">{{ t('flashCards.deckName') }}</label>
          <input
              id="deck-title"
              ref="titleInput"
              v-model="title"
              class="deck-sheet__input"
              :maxlength="DECK_TITLE_MAX"
              :placeholder="t('flashCards.deckNamePlaceholder')"
              autocomplete="off"
          >

          <span class="deck-sheet__label">{{ t('flashCards.level') }}</span>
          <div class="deck-sheet__chips">
            <button
                v-for="item in levelOptions"
                :key="item.value"
                type="button"
                class="deck-sheet__chip"
                :class="{ 'deck-sheet__chip--on': level === item.value }"
                @click="level = item.value"
            >{{ item.label }}
            </button>
          </div>

          <span class="deck-sheet__label">{{ t('flashCards.color') }}</span>
          <div class="deck-sheet__colors">
            <button
                v-for="item in DECK_COLORS"
                :key="item"
                type="button"
                class="deck-sheet__color"
                :class="{ 'deck-sheet__color--on': color === item }"
                :style="{ background: item }"
                :aria-label="item"
                @click="color = item"
            ></button>
          </div>

          <div class="deck-sheet__actions">
            <button type="button" class="deck-btn deck-btn--ghost" @click="close">{{ t('flashCards.cancel') }}</button>
            <button type="submit" class="deck-btn" :disabled="!canSave || saving">
              {{ deck ? t('flashCards.save') : t('flashCards.create') }}
            </button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {ref, computed, watch, nextTick} from 'vue'
import {DECK_COLORS, DECK_LEVELS, DECK_TITLE_MAX} from '~/store/decksStore.js'

const props = defineProps({
  modelValue: {type: Boolean, default: false},
  // колода для редактирования; без неё форма создаёт новую
  deck: {type: Object, default: null},
  saving: {type: Boolean, default: false}
})
const emit = defineEmits(['update:modelValue', 'save'])
const {t} = useI18n()

const title = ref('')
const level = ref('')
const color = ref(DECK_COLORS[0])
const titleInput = ref(null)

const levelOptions = computed(() => [
  {value: '', label: t('flashCards.levelNone')},
  ...DECK_LEVELS.map(value => ({value, label: value}))
])
const canSave = computed(() => title.value.trim().length > 0)

watch(() => props.modelValue, (open) => {
  if (!open) return
  title.value = props.deck?.title || ''
  level.value = props.deck?.level || ''
  color.value = props.deck?.color || DECK_COLORS[Math.floor(Math.random() * DECK_COLORS.length)]
  nextTick(() => titleInput.value?.focus())
})

function close() {
  emit('update:modelValue', false)
}

function submit() {
  if (!canSave.value || props.saving) return
  emit('save', {title: title.value.trim(), level: level.value, color: color.value})
}
</script>

<style scoped>
.deck-sheet {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(15, 23, 42, 0.55);
}

.deck-sheet__panel {
  width: 100%;
  max-width: 560px;
  box-sizing: border-box;
  padding: 22px 18px calc(20px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0;
  background: var(--bgModal);
  color: var(--titleColor);
}

.deck-sheet__title {
  margin-bottom: 16px;
  color: var(--title);
  font-size: 20px;
  font-weight: 900;
  text-align: center;
}

.deck-sheet__label {
  display: block;
  margin: 12px 0 6px;
  color: var(--title);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.deck-sheet__input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 14px;
  background: var(--bg);
  color: var(--titleColor);
  font-size: 16px;
  font-weight: 700;
  outline: none;
}

.deck-sheet__input:focus {
  border-color: #8b5cf6;
}

.deck-sheet__chips,
.deck-sheet__colors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.deck-sheet__chip {
  padding: 8px 14px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 12px;
  background: var(--bg);
  color: var(--title);
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.deck-sheet__chip--on {
  border-color: #8b5cf6;
  background: #8b5cf6;
  color: #fff;
}

.deck-sheet__color {
  width: 36px;
  height: 36px;
  border: 3px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.18);
}

.deck-sheet__color--on {
  border-color: var(--bg);
  outline: 3px solid var(--title);
}

.deck-sheet__actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.deck-btn {
  flex: 1;
  padding: 13px 16px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%);
  box-shadow: 0 4px 0 #6d28d9;
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
}

.deck-btn:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: none;
}

.deck-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.deck-btn--ghost {
  background: var(--tabBg);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  color: var(--title);
}

.deck-sheet-enter-active,
.deck-sheet-leave-active {
  transition: opacity 0.2s ease;
}

.deck-sheet-enter-active .deck-sheet__panel,
.deck-sheet-leave-active .deck-sheet__panel {
  transition: transform 0.25s ease;
}

.deck-sheet-enter-from,
.deck-sheet-leave-to {
  opacity: 0;
}

.deck-sheet-enter-from .deck-sheet__panel,
.deck-sheet-leave-to .deck-sheet__panel {
  transform: translateY(100%);
}
</style>
