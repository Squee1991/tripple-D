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
        <!-- Заголовки в зависимости от статуса -->
        <h4 v-if="authStore.isPremium && !authStore.subscriptionCancelled">
          💎 {{ t('cabinet.active') }} Premium
        </h4>
        <h4 v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
          ⚠️ Подписка отменена
        </h4>
        <h4 v-else>
          👑 Стань Premium
        </h4>

        <!-- Текст / Даты -->
        <p v-if="authStore.isPremium && !authStore.subscriptionCancelled">
          📅 {{ t('cabinet.nextPayment') }} {{ formattedSubscriptionEndDate }}
        </p>
        <p v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
          📅 {{ t('cabinet.access') }} {{ formattedSubscriptionEndDate }}
        </p>
        <p v-else>
          Сними лимиты и ускорь свое обучение.
        </p>
      </div>

      <!-- Кнопки -->
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { userAuthStore } from '../../store/authStore.js'

const emit = defineEmits(['open'])

const { t, locale } = useI18n()
const router = useRouter()
const authStore = userAuthStore()

const formattedSubscriptionEndDate = computed(() => {
  if (!authStore.subscriptionEndsAt) return '-'
  const date = new Date(authStore.subscriptionEndsAt)
  return date.toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })
})

const routeToPay = () => {
  router.push('/pay')
}

const openCancelModal = () => {
  emit('open', 'cancelPremium')
}
</script>

<style scoped>
.account-tab-body {
  padding: 10px 4px;
}

/* =========================================
   КРАСИВЫЙ БАННЕР ПРЕМИУМА
   ========================================= */
.premium-banner {
  margin-top: 5px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899); /* Градиент для FREE */
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.25);
  position: relative;
  overflow: hidden;
  gap: 15px;
}

/* Блик на фоне для дороговизны */
.premium-banner::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
  transform: rotate(30deg);
  pointer-events: none;
}

/* Состояние: Активная подписка */
.premium-banner.is-active {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
}

/* Состояние: Отмененная, но еще действующая подписка */
.premium-banner.is-cancelled {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.25);
}

.premium-content h4 {
  margin: 0;
  font-size: 19px;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.premium-content p {
  margin: 6px 0 0 0;
  font-size: 14px;
  font-weight: 700;
  opacity: 0.95;
}

.premium-actions {
  z-index: 1; /* Чтобы кнопка была над бликом */
  flex-shrink: 0;
}

.premium-action-btn {
  background: #ffffff;
  color: #db2777; /* Цвет текста под FREE фон */
  border: none;
  border-radius: 14px;
  padding: 12px 20px;
  font-family: inherit;
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.1s ease;
  white-space: nowrap;
}

.premium-action-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}

/* Цвет кнопки "Приобрести" в зависимости от фона (на будущее) */
.premium-banner.is-active .premium-action-btn { color: #059669; }
.premium-banner.is-cancelled .premium-action-btn { color: #d97706; }

/* Кнопка "Отменить" - делаем её прозрачной с белой рамкой, чтобы не бросалась в глаза */
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

/* Адаптив для маленьких экранов */
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