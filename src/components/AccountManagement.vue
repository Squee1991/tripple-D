<template>
  <div class="account-tab-body">
    <div class="subscription-status-row">
      <div class="subscription-label">{{ t('cabinet.status') }}</div>
      <div class="subscription-status">
        <template v-if="authStore.isPremium && !authStore.subscriptionCancelled">
          <span class="status-pill is-active">✅ {{ t('cabinet.active') }}</span>
        </template>
        <template v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
          <span class="status-pill is-cancelled">⚠️ {{ t('cabinet.canceled') }}</span>
        </template>
        <template v-else>
          <div class="status-inline">
            <span class="status-pill is-free">❌</span>
            <button @click="routeToPay" class="premium__btn">
              {{ t('cabinet.buyPremium') }}
            </button>
          </div>
        </template>
      </div>
    </div>
    <template v-if="authStore.isPremium && !authStore.subscriptionCancelled">
      <div class="premium__status-wrapper">
        <p class="subtext">
          📅 {{ t('cabinet.nextPayment') }} {{ formattedSubscriptionEndDate }}
        </p>
        <button class="btn btn-outline-danger" @click.stop="openCancelModal">
          {{ t('cabinet.cancelBtn') }}
        </button>
      </div>
    </template>
    <template v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
      <p class="access__text">
        📅 {{ t('cabinet.access') }} {{ formattedSubscriptionEndDate }}
      </p>
    </template>
    <div class="account-actions">
      <button @click.stop="openDeleteModal" class="btn btn-danger w-full">
        {{ t('cabinet.deleteAcc') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
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

const openCancelModal =() => {
  emit('open', 'cancelPremium')
}

const openDeleteModal = () => {
  emit('open', 'deleteAccount')
}
</script>

<style scoped>
.account-tab-body {
  padding: 6px 0;
}

.subscription-status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 6px;
  margin-top: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.subscription-label {
  font-weight: 800;
  opacity: 0.85;
  color: var(--titleColor);
  white-space: nowrap;
}

.subscription-status {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 220px;
}

.status-inline {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  gap: 8px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 14px;
  line-height: 1;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(42, 41, 41, 0.92);
  backdrop-filter: blur(6px);
}

.status-pill.is-active {
  border-color: rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.12);
}

.status-pill.is-cancelled {
  border-color: rgba(245, 158, 11, 0.35);
  background: rgba(245, 158, 11, 0.12);
}

.status-pill.is-free {
  border-color: rgba(148, 163, 184, 0.35);
  background: rgba(148, 163, 184, 0.10);
  color: var(--titleColor);

}

.premium__btn {
  padding: 8px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(59, 130, 246, 0.18);
  color: var(--titleColor);
  font-weight: 800;
  cursor: pointer;
  box-shadow: none;
  transition: transform 0.15s ease, background 0.15s ease;
}

@media (min-width: 1024px) {
  .premium__btn:hover {
    transform: translateY(-1px);
    background: rgba(59, 130, 246, 0.24);
  }
}

/* блок управления premium */
.premium__status-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 6px 0;
  gap: 12px;
}

.subtext {
  margin: 0;
  font-weight: 800;
  color: var(--titleColor);
}

.access__text {
  margin-top: 10px;
  padding: 0 6px;
  font-weight: 800;
  color: var(--titleColor);
}

.btn {
  border-radius: 16px;
  padding: 10px 16px;
  font-weight: 800;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
  color: var(--titleColor);
}

.btn-outline-danger {
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.6);
  margin-left: auto;
}

.btn-danger {
  border: 1px solid rgba(0, 0, 0, 0.35);
  color: #fff;
}

.account-actions {
  display: flex;
  justify-content: end;
  margin-top: 16px;
  padding: 0 2px;
}

.w-full {
  padding: 8px 14px;
  color: var(--titleColor);
}



@media (max-width: 1023px) {
  .subscription-status-row {
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .subscription-status {
    width: 100%;
  }


  .status-inline {
    width: 100%;
    justify-content: space-between;
  }

  .premium__status-wrapper {
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
  }
}
</style>
