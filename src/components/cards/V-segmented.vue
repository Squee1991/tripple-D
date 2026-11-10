<template>
  <!-- переключатель как на главной (V-uid): «таблетка» переезжает к выбранному пункту -->
  <div class="segmented" role="tablist" :style="{ '--count': options.length }">
    <span class="segmented__pill" :style="{ transform: `translateX(${pillOffset}%)` }"></span>
    <button
        v-for="option in options"
        :key="option.id"
        type="button"
        role="tab"
        class="segmented__btn"
        :class="{ 'segmented__btn--active': option.id === modelValue }"
        :aria-selected="option.id === modelValue"
        @click="emit('update:modelValue', option.id)"
    >
      <span v-if="option.icon" class="segmented__icon" aria-hidden="true">{{ option.icon }}</span>
      <span class="segmented__label">{{ option.label }}</span>
    </button>
  </div>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
  // [{id, label, icon?}]
  options: {type: Array, required: true},
  modelValue: {type: String, default: ''}
})
const emit = defineEmits(['update:modelValue'])
const {locale} = useI18n()

const pillOffset = computed(() => {
  const index = Math.max(0, props.options.findIndex(option => option.id === props.modelValue))
  const position = locale.value === 'ar' ? props.options.length - 1 - index : index
  return position * 100
})
</script>

<style scoped>
.segmented {
  position: relative;
  display: flex;
  padding: 5px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 40px;
  background: var(--tabBg);
  box-shadow: var(--boxShadowMobile);
}

.segmented__pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 5px;
  width: calc((100% - 10px) / var(--count));
  border-radius: 30px;
  background: var(--tabsSlideBg);
  box-shadow: var(--tabSlideBoxShadow);
  transition: transform 0.4s cubic-bezier(0.34, 1.35, 0.64, 1);
  z-index: 1;
}

.segmented__btn {
  position: relative;
  z-index: 2;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  padding: 9px 4px;
  border: none;
  background: none;
  color: var(--titleColor);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.segmented__icon {
  font-size: 18px;
  line-height: 1;
  transition: transform 0.2s;
}

/* длинное слово (например «Существительное») переносится, а не обрезается */
.segmented__label {
  font-size: 14px;
  font-weight: 800;
  line-height: 1.15;
  text-align: center;
  overflow-wrap: anywhere;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.segmented__btn--active .segmented__label {
  opacity: 1;
}

.segmented__btn--active .segmented__icon {
  transform: scale(1.15);
}

@media (prefers-reduced-motion: reduce) {
  .segmented__pill {
    transition-duration: 0.01s;
  }
}
</style>
