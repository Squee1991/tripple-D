<template>
  <div v-if="show" class="modal">
    <div class="modal__overlay"></div>
    <div class="modal__window">
      <div class="modal__title">{{ t('questCompletedModals.lives') }}</div>
      <div class="modal__text">
        {{ t('questCompletedModals.count') }} {{ correctCount }} / {{ requiredTasks }}.<br/>
        {{ t('questCompletedModals.buyLive') }}
      </div>
      <div class="wallet">
        <div v-for="(row, i) in walletDetails" :key="i" class="wallet__row">
          <div class="wallet__label">{{ row.label }}</div>
          <div class="wallet__value">{{ row.value }}</div>
        </div>
      </div>
      <div class="modal__actions">
        <button
            v-for="(btn, i) in actionButtons"
            :key="i"
            class="btn"
            :class="btn.style"
            :disabled="btn.disabled"
            @click="btn.action"
        >
          {{ btn.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  show: Boolean,
  correctCount: Number,
  requiredTasks: Number,
  wallet: Number,
  canBuyLife: Boolean,
  remainingAds: {
    type: Number,
    default: 0
  },
  cancelText: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['purchase', 'back', 'watchAd'])

const walletDetails = computed(() => [
  {
    label: t('questCompletedModals.prise'),
    value: t('questCompletedModals.priseValue')
  },
  {
    label: t('questCompletedModals.balance'),
    value: `${props.wallet} ${t('questCompletedModals.points')}`
  }
])

const actionButtons = computed(() => {
  const buttons = []

  if (props.remainingAds > 0) {
    buttons.push({
      text: `Смотреть рекламу (${props.remainingAds})`,
      action: () => emit('watchAd'),
      disabled: false,
      style: 'btn--ad'
    })
  }

  buttons.push({
    text: props.canBuyLife ? t('questCompletedModals.buy') : t('questCompletedModals.notEnough'),
    action: () => emit('purchase'),
    disabled: !props.canBuyLife,
    style: ''
  })

  buttons.push({
    text: props.cancelText ? props.cancelText : t('questCompletedModals.back'),
    action: () => emit('back'),
    disabled: false,
    style: 'btn--primary'
  })

  return buttons
})
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(3px);
  animation: fadeIn 0.3s ease-out;
}

.modal__window {
  position: relative;
  background: #FFFFFF;
  width: min(90%, 420px);
  padding: 32px 24px;
  border-radius: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
  z-index: 1001;
  text-align: center;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.modal__title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #374151;
  margin-bottom: 12px;
}

.modal__text {
  font-size: 1rem;
  color: #6B7280;
  line-height: 1.5;
  margin-bottom: 24px;
}

.wallet {
  background: #FFFBEB;
  border: 2px solid #FDE68A;
  border-radius: 16px;
  padding: 16px 20px;
  margin: 0 auto 24px;
  width: 100%;
}

.wallet__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 800;
  margin: 8px 0;
  font-size: 1.15rem;
  color: #D97706;
}

.wallet__label {
  color: #B45309;
  font-weight: 700;
  opacity: 0.8;
}

.modal__actions {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  flex-direction: column;
}

.btn {
  flex: 1;
  padding: 14px 16px;
  border: 2px solid #58CC02;
  border-bottom-width: 4px;
  border-bottom-color: #58A700;
  border-radius: 16px;
  background: #58CC02;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 800;
  color: #FFFFFF;
  transition: all 0.1s ease;
}

.btn:active:not(:disabled) {
  transform: translateY(2px);
  border-bottom-width: 2px;
  margin-bottom: 2px;
}

.btn:hover:not(:disabled) {
  background: #61E002;
  border-color: #61E002;
}

.btn--primary {
  background: #1CB0F6;
  border-color: #1CB0F6;
  border-bottom-color: #1899D6;
}

.btn--ad {
  background: #FF9600;
  border-color: #FF9600;
  border-bottom-color: #CC7800;
}

.btn--primary:hover:not(:disabled) {
  background: #2DBCFF;
  border-color: #2DBCFF;
}

.btn:disabled {
  background: #E5E5E5;
  border-color: #E5E5E5;
  border-bottom-color: #D1D5DB;
  color: #9CA3AF;
  opacity: 1;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal__window {
    position: absolute;
    bottom: 0;
    width: 100%;
    margin: 0;
    border-radius: 32px 32px 0 0;
    padding: 32px 24px max(32px, env(safe-area-inset-bottom));
    animation: slideUp 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  .btn {
    width: 100%;
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>