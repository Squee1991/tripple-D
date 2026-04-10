<template>
  <div v-if="show" class="modal">
    <div class="modal__overlay"></div>
    <div class="modal__window">
      <div class="modal__title">{{ t('questCompletedModals.questNotCompleted') }}</div>
      <div class="modal__text">{{ t('questCompletedModals.warning') }}</div>
      <div class="modal__actions">
        <button class="btn btn--danger" @click="$emit('leave')">
          {{ t('questCompletedModals.leave') }}
        </button>
        <button class="btn btn--primary" @click="$emit('continue')">
          {{ t('questCompletedModals.continue') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

defineEmits(['leave', 'continue'])
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
}

.modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, .35);
  backdrop-filter: blur(2px);
}

.modal__window {
  position: relative;
  width: min(440px, 92%);
  background: #fff;
  border: 3px solid #111;
  border-radius: 18px;
  box-shadow: 4px 4px 0 #1e1e1e;
  padding: 20px 35px;
  text-align: center;
  z-index: 1;
}

.modal__title {
  font-weight: 900;
  font-size: 28px;
  margin-bottom: 8px;
  color: #111;
}

.modal__text {
  padding: 10px;
  font-family: "Nunito", sans-serif;
}

.modal__actions {
  display: flex;
  justify-content: center;
  flex-direction: column-reverse;
  gap: 12px;
  flex-wrap: wrap;
  padding: 20px;
}

/* Кнопки внутри модалки */
.btn {
  height: 56px;
  padding: 0 26px;
  border-radius: 16px;
  font-family: "Nunito", sans-serif;
  font-weight: 900;
  font-size: 22px;
  border: 2px solid #1e1e1e;
  color: #1e1e1e;
  background: #9dceff;
  cursor: pointer;
  box-shadow: 2px 2px 0 #1e1e1e;
  transition: all .1s ease-in-out;
}

.btn--primary { background: #a7ecb8; }
.btn--danger { background: #ffd0cc; }

@media (max-width: 767px) {
  .btn {
    height: 45px;
    font-size: 20px;
  }
}
</style>