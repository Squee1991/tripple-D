<template>
  <Teleport to="body">
    <transition name="test-locked-fade">
      <div v-if="modelValue" class="test-locked" @click.self="close">
        <div class="test-locked__card" role="dialog" aria-modal="true">
          <span class="test-locked__icon" aria-hidden="true">🔒</span>
          <h2 class="test-locked__title">{{ t('locationTest.lockedTitle') }}</h2>
          <p class="test-locked__text">{{ t('locationTest.lockedText', { level, land: t(`locationNames.${summit}`) }) }}</p>
          <button type="button" class="test-locked__btn" @click="close">{{ t('locationTest.understood') }}</button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  level: { type: String, default: '' },
  summit: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const close = () => emit('update:modelValue', false)
</script>

<style scoped>
.test-locked {
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

.test-locked__card {
  width: 100%;
  max-width: 320px;
  padding: 22px 18px 18px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 28px;
  background: var(--tabBg);
  color: var(--titleColor);
  text-align: center;
  animation: test-locked-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.test-locked__icon {
  display: block;
  font-size: 42px;
  line-height: 1;
}

.test-locked__title {
  margin-top: 10px;
  font-size: 19px;
  font-weight: 900;
  line-height: 1.25;
}

.test-locked__text {
  margin-top: 6px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  opacity: 0.8;
}

.test-locked__btn {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  border: none;
  border-radius: 50px;
  background: #6358ac;
  box-shadow: 0 5px 0 #4b4190;
  color: #fff;
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
}

.test-locked-fade-enter-active,
.test-locked-fade-leave-active {
  transition: opacity 0.2s;
}

.test-locked-fade-enter-from,
.test-locked-fade-leave-to {
  opacity: 0;
}

@keyframes test-locked-pop {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
</style>
