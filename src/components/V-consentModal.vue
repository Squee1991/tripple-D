<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h2 class="modal-title">🎙️ {{ t('consentModal.title')}}</h2>
      <p class="modal-text">
        {{ t('consentModal.textPartOne')}} <strong>Sprechen</strong>, {{ t('consentModal.textPartTwo')}} <strong>{{ t('consentModal.textPartThree')}}</strong>
      </p>
      <p class="modal-text">
        {{ t('consentModal.textTwoPartOne')}} <strong>{{ t('consentModal.textTwoPartTwo')}}</strong> {{ t('consentModal.textTwoPartThree')}} <strong>{{ t('consentModal.textTwoPartFour')}}</strong>.
      </p>
      <label class="custom-checkbox">
        <input type="checkbox" v-model="isAgreed">
        <span class="checkmark"></span>
        <span>{{ t('consentModal.agree')}}</span>
      </label>
      <button
          class="modal-button"
          :disabled="!isAgreed"
          @click="giveConsent"
      >
        {{ t('consentModal.accept')}}
      </button>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue'
const emit = defineEmits(['consent-given', 'close'])
const isAgreed = ref(false)
const { t } = useI18n()
const giveConsent = () => {
  if (isAgreed.value) {
    emit('consent-given')
  }
}
const closeModal = () => {
  emit('close')
}

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-family: "Nunito", sans-serif;
}

.modal-content {
  background-color: #fffbe6;
  padding: 1.5rem;
  border-radius: 15px;
  border: 3px solid #000000;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 4px 4px 0 black;
}

.modal-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #c7532a;
}

.modal-text {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.modal-button {
  background-color: #4ade80;
  color: #1e1e1e;
  padding: 12px 25px;
  font-size: 1.2rem;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 4px 4px 0 black;
  border: none;
  font-weight: bold;
  margin-top: 1.5rem;
  transition: all 0.2s;
}

.modal-button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e;
}

.modal-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: 4px 4px 0 #666;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  user-select: none;
  margin-top: 1.5rem;
  gap: 10px;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 35px;
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  border: 2px solid #aaa;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.custom-checkbox:hover input ~ .checkmark {
  background-color: #ccc;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #f59e0b;
  border-color: #f59e0b;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox .checkmark:after {
  top: 50%;
  width: 10px;
  height: 15px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg) translate(-50% , -50%);
}
</style>