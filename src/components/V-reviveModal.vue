<template>
  <transition name="revive-fade">
    <div v-if="show" class="revive" @click.self="emit('back')">
      <div class="revive__card" role="dialog" aria-modal="true">
        <span class="revive__grabber" aria-hidden="true"></span>
        <div class="revive__heart" aria-hidden="true">
          <img :src="Life" alt="" class="revive__heart-img"/>
          <span class="revive__heart-zero">0</span>
        </div>
        <div class="revive__title">{{ t('questCompletedModals.lives') }}</div>
        <div class="revive__text">{{ t('questCompletedModals.buyLive') }}</div>
        <div class="revive__wallet">
          <div v-for="(row, i) in walletDetails" :key="i" class="revive__row">
            <span class="revive__label">{{ row.label }}</span>
            <span class="revive__value" :class="{ 'revive__value--low': row.low }">
              {{ row.value }}
              <img :src="Article" alt="" class="revive__coin"/>
            </span>
          </div>
        </div>
        <div class="revive__actions">
          <button
              v-for="(btn, i) in actionButtons"
              :key="i"
              type="button"
              class="revive__btn"
              :class="btn.style"
              :disabled="btn.disabled"
              @click="btn.action"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Article from '~/assets/images/article.svg'
import Life from '~/assets/images/life.svg'

const { t } = useI18n()

const LIFE_PRICE = 5

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
    value: LIFE_PRICE
  },
  {
    label: t('questCompletedModals.balance'),
    value: props.wallet,
    low: !props.canBuyLife
  }
])

const actionButtons = computed(() => {
  const buttons = []

  if (props.remainingAds > 0) {
    buttons.push({
      text: `${t('questCompletedModals.ads')} (${props.remainingAds})`,
      action: () => emit('watchAd'),
      disabled: false,
      style: 'revive__btn--ad'
    })
  }

  buttons.push({
    text: props.canBuyLife ? t('questCompletedModals.buy') : t('questCompletedModals.notEnough'),
    action: () => emit('purchase'),
    disabled: !props.canBuyLife,
    style: 'revive__btn--buy'
  })

  buttons.push({
    text: props.cancelText ? props.cancelText : t('questCompletedModals.back'),
    action: () => emit('back'),
    disabled: false,
    style: 'revive__btn--back'
  })

  return buttons
})
</script>

<style scoped>
.revive {
  position: fixed;
  inset: 0;
  z-index: 19000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
}

.revive__card {
  position: relative;
  width: 100%;
  max-width: 560px;
  padding: 10px 18px calc(18px + env(safe-area-inset-bottom));
  border-radius: 28px 28px 0 0;
  border-top: 4px solid #ff4b4b;
  background: var(--bg);
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  text-align: center;
  animation: revive-up 0.3s ease-out;
}

.revive__grabber {
  display: block;
  width: 40px;
  height: 5px;
  margin: 0 auto 10px;
  border-radius: 3px;
  background: rgba(127, 127, 127, 0.45);
}

.revive__heart {
  position: relative;
  width: 72px;
  height: 72px;
  margin: 0 auto 6px;
  animation: revive-beat 1.6s ease-in-out infinite;
}

.revive__heart-img {
  width: 100%;
  height: 100%;
  filter: grayscale(0.85) drop-shadow(0 4px 0 rgba(0, 0, 0, 0.18));
}

.revive__heart-zero {
  position: absolute;
  right: -4px;
  bottom: -2px;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border: 3px solid var(--bg);
  border-radius: 14px;
  background: #ff4b4b;
  color: #fff;
  font-size: 15px;
  font-weight: 900;
  line-height: 22px;
}

.revive__title {
  font-size: 22px;
  font-weight: 900;
}

.revive__text {
  margin: 6px 0 14px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
  opacity: 0.85;
}

.revive__wallet {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 16px;
  background: #fff;
  border: 3px solid #e0dcdc;
  color: #1e272e;
}

.revive__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 800;
}

.revive__label {
  opacity: 0.7;
}

.revive__value {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  font-weight: 900;
}

.revive__value--low {
  color: #ff4b4b;
}

.revive__coin {
  width: 24px;
  height: 24px;
}

.revive__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.revive__btn {
  padding: 13px;
  border: none;
  border-radius: 34px;
  color: #fff;
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.revive__btn:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: none !important;
}

.revive__btn--ad {
  background: linear-gradient(180deg, #ffb04d, #ff9600);
  box-shadow: 0 5px 0 #cc6f00;
}

.revive__btn--buy {
  background: linear-gradient(180deg, #6fdc2a, #58cc02);
  box-shadow: 0 5px 0 #46a302;
}

.revive__btn--back {
  background: rgba(127, 127, 127, 0.16);
  color: var(--titleColor);
  box-shadow: 0 5px 0 rgba(127, 127, 127, 0.3);
}

.revive__btn:disabled {
  background: #e5e5e5;
  color: #9ca3af;
  box-shadow: 0 5px 0 #d1d5db;
  cursor: not-allowed;
}

.revive-fade-enter-active,
.revive-fade-leave-active {
  transition: opacity 0.2s ease;
}

.revive-fade-enter-from,
.revive-fade-leave-to {
  opacity: 0;
}

@keyframes revive-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes revive-beat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}
</style>
