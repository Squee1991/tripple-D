<template>
  <div v-if="open" class="hint-modal">
    <div class="hint-modal__overlay" @click="closeNumbersHintModal"></div>
    <div class="hint-modal__window">
      <div class="hint-modal__badge">❗</div>
      <div class="hint-modal__title"> {{ t('modalLocations.title')}}</div>
      <div class="hint-modal__text">{{ t('modalLocations.text')}}</div>
      <div class="hint-modal__example">
        <div class="hint-modal__example-title">{{ t('modalLocations.examples')}}</div>
        <div class="hint-modal__example-row">
          <span class="hint-chip">8</span>
          <span class="hint-sep">{{ t('modalLocations.or')}}</span>
          <span class="hint-chip">acht</span>
        </div>
        <div class="hint-modal__example-row">
          <span class="hint-chip">7:30</span>
          <span class="hint-sep">{{ t('modalLocations.or')}}</span>
          <span class="hint-chip">halb acht</span>
        </div>
      </div>
      <label class="hint-modal__checkbox">
        <input type="checkbox" v-model="dontShowNumbersHintAgain" class="hint-modal__checkbox-input"/>
        <span class="hint-modal__checkbox-box"></span>
        <span class="hint-modal__checkbox-text">{{ t('modalLocations.notShow')}}</span>
      </label>
      <div class="hint-modal__actions">
        <button class="hint-btn hint-btn--primary" @click="closeNumbersHintModal">{{ t('modalLocations.btnAccept')}}</button>
      </div>
      <button class="hint-modal__close" @click="closeNumbersHintModal">×</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const NUMBERS_HINT_KEY = 'hide_numbers_hint_modal'
const { t } = useI18n()
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])
const dontShowNumbersHintAgain = ref(false)

function closeNumbersHintModal() {
  if (dontShowNumbersHintAgain.value) {
    localStorage.setItem(NUMBERS_HINT_KEY, 'true')
  }
  emit('close')
}

</script>


<style scoped>

.hint-modal {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.hint-modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(3px);
}

.hint-modal__window {
  position: relative;
  width: min(520px, 94vw);
  background: #fff;
  border: 4px solid #1e1e1e;
  border-radius: 22px;
  box-shadow: 2px 2px 0 #1e1e1e;
  padding: 26px 22px 22px;
  text-align: center;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: hintPop 160ms ease-out;
}

@keyframes hintPop {
  from {
    transform: scale(0.96);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.hint-modal__badge {
  width: 64px;
  height: 64px;
  margin-top: -52px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  background: #ffd86b;
  border: 3px solid #1e1e1e;
  border-radius: 18px;
  box-shadow: 4px 4px 0 #1e1e1e;
  transform: rotate(-6deg);
}

.hint-modal__close {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 2px solid #1e1e1e;
  background: #f16221;
  color: white;
  box-shadow: 2px 2px 0 #1e1e1e;
  font-weight: 900;
  font-size: 22px;
  cursor: pointer;
}

.hint-modal__title {
  font-weight: 900;
  font-size: 27px;
  margin-bottom: 8px;
  color: #f16221;
  text-shadow: 1px 1px #f16221;
}

.hint-modal__text {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
}

.hint-modal__example {
  width: 100%;
  max-width: 440px;
  margin-bottom: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: 2px solid #1e1e1e;
  border-radius: 18px;
  background: #f7fbff;
  box-shadow: 2px 2px 0 #1e1e1e;
}

.hint-modal__example-title {
  font-weight: 900;
  font-size: 14px;
}

.hint-modal__example-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hint-chip {
  padding: 8px 12px;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 14px;
  box-shadow: 2px 2px 0 #1e1e1e;
  font-weight: 900;
}

.hint-sep {
  font-weight: 900;
}

.hint-modal__checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  font-weight: 900;
  cursor: pointer;
}

.hint-modal__checkbox-input {
  display: none;
}

.hint-modal__checkbox-box {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  border: 3px solid #1e1e1e;
}

.hint-modal__checkbox-input:checked + .hint-modal__checkbox-box {
  background: #b9f5c4;
}

.hint-modal__checkbox-input:checked + .hint-modal__checkbox-box::after {
  content: "✓";
  font-weight: 900;
}

.hint-modal__actions {
  margin-top: 14px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.hint-btn {
  height: 56px;
  padding: 0 28px;
  border-radius: 16px;
  font-weight: 900;
  font-size: 20px;
  border: 2px solid #1e1e1e;
  background: #a7ecb8;
  box-shadow: 2px 2px 0 #1e1e1e;
  cursor: pointer;
}

</style>
