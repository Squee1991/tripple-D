<template>
  <Teleport to="body">
    <transition name="level-picker-fade">
      <div v-if="modelValue" class="level-picker" @click.self="onBackdrop">
        <div class="level-picker__card" role="dialog" aria-modal="true" :aria-label="t('levelPicker.title')">
          <h2 class="level-picker__title">{{ t('levelPicker.title') }}</h2>
          <p class="level-picker__subtitle">{{ t('levelPicker.subtitle') }}</p>

          <div class="level-picker__list" role="radiogroup">
            <button
                v-for="level in levels"
                :key="level.id"
                type="button"
                role="radio"
                :aria-checked="selected === level.id"
                class="level-option"
                :class="{ 'level-option--active': selected === level.id }"
                :data-track="'level_picker_option_' + level.id"
                @click="selected = level.id"
            >
              <span class="level-option__badge">{{ level.id }}</span>
              <span class="level-option__body">
                <span class="level-option__name">{{ t(`levelPicker.${level.key}Name`) }}</span>
                <span class="level-option__phrase" lang="de" dir="ltr">{{ level.phrase }}</span>
                <span v-if="selected === level.id" class="level-option__topics">
                  {{ t(`levelPicker.${level.key}Topics`) }}
                </span>
              </span>
              <span class="level-option__radio" aria-hidden="true"></span>
            </button>
          </div>

          <button
              type="button"
              class="level-picker__btn"
              :disabled="!selected"
              @click="confirm"
          >
            {{ mode === 'settings' ? t('levelPicker.save') : t('levelPicker.continue') }}
          </button>
          <button
              v-if="mode === 'onboarding'"
              type="button"
              class="level-picker__skip"
              @click="skip"
          >
            {{ t('levelPicker.skip') }}
          </button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { userAuthStore } from '~/store/authStore.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // onboarding: первый вход, закрыть можно только выбором или «пропустить» (= A1)
  // settings: смена уровня из настроек, закрывается тапом по фону
  mode: { type: String, default: 'onboarding' }
})
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const authStore = userAuthStore()

// Фразы не переводятся: человек узнаёт свой уровень по тому, понимает ли он немецкий пример
const levels = [
  { id: 'A1', key: 'a1', phrase: 'Ich heiße Anna und wohne in Berlin.' },
  { id: 'A2', key: 'a2', phrase: 'Ich habe gestern Pizza gegessen, weil ich keine Zeit hatte.' },
  { id: 'B1', key: 'b1', phrase: 'Obwohl ich müde war, bin ich noch ins Kino gegangen.' }
]

const selected = ref(null)

watch(() => props.modelValue, (open) => {
  if (open) selected.value = authStore.germanLevel || null
}, { immediate: true })

const close = () => emit('update:modelValue', false)

const { $track } = useNuxtApp()

// source: onboarding | settings | skip. По этому событию видно, какой уровень у аудитории
const trackLevel = (level, source) => {
  const previous = authStore.germanLevel || 'none'
  $track?.('german_level_selected', { level, source, previous })
}

const confirm = async () => {
  if (!selected.value) return
  trackLevel(selected.value, props.mode)
  close()
  await authStore.setGermanLevel(selected.value)
}

const skip = async () => {
  trackLevel('A1', 'skip')
  close()
  await authStore.setGermanLevel('A1')
}

const onBackdrop = () => {
  if (props.mode === 'settings') close()
}
</script>

<style scoped>
.level-picker {
  position: fixed;
  inset: 0;
  z-index: 19000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.level-picker__card {
  width: 100%;
  max-width: 340px;
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: 20px 16px 16px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 28px;
  background: var(--tabBg);
  color: var(--titleColor);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: level-picker-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.level-picker__title {
  font-size: 19px;
  font-weight: 900;
  line-height: 1.25;
}

.level-picker__subtitle {
  margin: 4px 0 14px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  opacity: 0.7;
}

.level-picker__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  background: var(--settingsSectionBg);
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  text-align: start;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}

.level-option:active {
  transform: scale(0.97);
}

.level-option--active {
  border-color: #3b82f6;
}

.level-option__badge {
  flex-shrink: 0;
  width: 34px;
  padding: 3px 0;
  border-radius: 9px;
  background: #3b82f6;
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  text-align: center;
}

.level-option__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.level-option__name {
  font-size: 14px;
  font-weight: 900;
}

.level-option__phrase {
  font-size: 12px;
  font-weight: 600;
  font-style: italic;
  line-height: 1.3;
  text-align: left;
  opacity: 0.75;
}

.level-option__topics {
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid rgba(122, 121, 121, 0.15);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.35;
  opacity: 0.85;
}

.level-option__radio {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 50%;
  transition: border 0.15s;
}

.level-option--active .level-option__radio {
  border: 5px solid #3b82f6;
}

.level-picker__btn {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  border: none;
  border-radius: 50px;
  background: #3b82f6;
  box-shadow: 0 6px 0 #1d4ed8;
  color: #fff;
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.1s ease;
}

.level-picker__btn:active:not(:disabled) {
  transform: translateY(6px);
  box-shadow: 0 0 0 #1d4ed8;
}

.level-picker__btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.level-picker__skip {
  margin-top: 10px;
  padding: 4px 8px;
  border: none;
  background: none;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-decoration: underline;
  opacity: 0.6;
  cursor: pointer;
}

.level-picker-fade-enter-active,
.level-picker-fade-leave-active {
  transition: opacity 0.2s;
}

.level-picker-fade-enter-from,
.level-picker-fade-leave-to {
  opacity: 0;
}

@keyframes level-picker-pop {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
</style>
