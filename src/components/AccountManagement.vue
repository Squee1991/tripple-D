<template>
  <div class="account-tab-body">
    <div
        class="premium-banner"
        :class="{
        'is-active': authStore.isPremium && !authStore.subscriptionCancelled,
        'is-cancelled': authStore.isPremium && authStore.subscriptionCancelled
      }"
    >
      <div class="premium-content">
        <h4 v-if="authStore.isPremium && !authStore.subscriptionCancelled">
          💎 {{ t('cabinet.active') }} PLUS
        </h4>
        <h4 v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
          {{ t('cabinet.plusCanceled') }}
        </h4>
        <h4 v-else>SKILLUP PLUS</h4>
        <p v-if="authStore.isPremium && !authStore.subscriptionCancelled">
          📅 {{ t('cabinet.nextPayment') }} {{ formattedSubscriptionEndDate }}
        </p>
        <p v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
          📅 {{ t('cabinet.access') }} {{ formattedSubscriptionEndDate }}
        </p>
        <p v-else>
          {{ t('premiumBanner.textBanner')}}
        </p>
      </div>
      <div class="premium-actions">
        <button
            v-if="!authStore.isPremium"
            @click="routeToPay"
            class="premium-action-btn"
        >
          {{ t('cabinet.buyPremium') }}
        </button>
        <button
            v-if="authStore.isPremium && !authStore.subscriptionCancelled && authStore.paymentSource === 'stripe'"
            @click.stop="openCancelModal"
            class="premium-action-btn btn-cancel"
        >
          {{ t('cabinet.cancelBtn') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import {userAuthStore} from '../../store/authStore.js'
const emit = defineEmits(['open'])
const {t, locale} = useI18n()
const router = useRouter()
const authStore = userAuthStore()

const formattedSubscriptionEndDate = computed(() => {
  if (!authStore.subscriptionEndsAt) return '-'
  const date = new Date(authStore.subscriptionEndsAt)
  return date.toLocaleDateString(locale.value, {year: 'numeric', month: 'long', day: 'numeric'})
})

const routeToPay = () => {
  router.push('/pay')
}

const openCancelModal = () => {
  emit('open', 'cancelPremium')
}
</script>

<style scoped>

.premium-banner {
  margin-top: 5px;
  background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
  border-radius: 24px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  position: relative;
  overflow: hidden;
  gap: 15px;
}

.premium-banner::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0) 100%);
  transform: rotate(30deg);
  pointer-events: none;
}

.premium-banner.is-active {
  background: linear-gradient(180deg, #38bdf8 0%, #0284c7 100%);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.25);
}


.premium-banner.is-cancelled {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.25);
}

.premium-content h4 {
  margin: 0;
  font-size: 24px;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.premium-content p {
  margin: 6px 0 0 0;
  font-size: 14px;
  font-weight: 700;
  opacity: 0.95;
}

.premium-actions {
  z-index: 1;
  flex-shrink: 0;
}

.premium-action-btn {
  background: #ffffff;
  color: #db2777;
  border: none;
  border-radius: 24px;
  padding: 14px 20px;
  font-family: inherit;
  font-weight: 900;
  font-size: 17px;
  cursor: pointer;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.1s ease;
  white-space: nowrap;
}

.premium-action-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}


.premium-banner.is-active .premium-action-btn {
  color: #059669;
}

.premium-banner.is-cancelled .premium-action-btn {
  color: #d97706;
}

.premium-action-btn.btn-cancel {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border: 2px solid #ffffff;
  box-shadow: none;
}

.premium-action-btn.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.25);
}

.premium-action-btn.btn-cancel:active {
  transform: translateY(2px);
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 480px) {
  .premium-banner {
    flex-direction: column;
    text-align: center;
    align-items: stretch;
  }

  .premium-actions {
    display: flex;
    justify-content: center;
  }

  .premium-action-btn {
    width: 100%;
  }
}
</style>