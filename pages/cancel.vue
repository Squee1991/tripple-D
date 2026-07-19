<script setup>
import {useRoute, useRouter} from 'vue-router'
import {ref, onMounted} from 'vue'
import {getAuth} from 'firebase/auth'
import { userAuthStore } from '../store/authStore.js'

const route = useRoute()
const router = useRouter()
const mode = ref('checkout')
const status = ref('idle')
const statusMessage = ref('')
const errorMessage = ref('')
const authStore = userAuthStore()
const { t } = useI18n()

const handleCancelSubscription = async () => {
  const authInstance = getAuth()
  const user = authInstance.currentUser

  if (!user) {
    status.value = 'error'
    statusMessage.value = t('stripeCancel.errorAuth')
    errorMessage.value = t('stripeCancel.pleaseAuth')
    return
  }
  status.value = 'processing'
  statusMessage.value = t('stripeCancel.canceling')
  try {
    const response = await $fetch('/api/stripe/cancel', {
      method: 'POST',
      body: {
        email: user.email,
        uid: user.uid
      }
    })

    if (response.success) {
      status.value = 'success'
      statusMessage.value = t('stripeCancel.canceledSub')
      authStore.subscriptionCancelled = true
    } else {
      status.value = 'error'
      statusMessage.value = t('stripeCancel.errorCancelSub')
      errorMessage.value = response.error || t('stripeCancel.errorCancelResponse')
    }
  } catch (e) {
    status.value = 'error'
    statusMessage.value = t('stripeCancel.serverError')
    errorMessage.value = t('stripeCancel.serverOffline')
  }
}

onMounted(() => {
  if (route.query.action === 'unsubscribe') {
    mode.value = 'unsubscribe'
    statusMessage.value = t('stripeCancel.cancelSub')
  } else {
    mode.value = 'checkout'
    statusMessage.value = t('stripeCancel.cancelPayment')
  }
})

</script>

<template>
  <div class="payment-status-container">
    <div class="status-card" :class="status">
      <template v-if="mode === 'checkout'">
        <div class="icon-wrapper error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h1 class="title">{{ statusMessage }}</h1>
        <p class="subtitle">
          {{t('stripeCancel.processInterrupted')}}
        </p>
        <div class="actions">
          <button @click="router.push('/pay')" class="btn-primary">
            {{t('stripeCancel.tryAgain')}}
          </button>
          <button @click="router.push('/')" class="btn-secondary">
            {{t('stripeCancel.backToMain')}}
          </button>
        </div>
      </template>
      <template v-else-if="mode === 'unsubscribe'">
        <div v-if="status === 'idle'" class="icon-wrapper warning-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div v-if="status === 'processing'" class="spinner"></div>
        <div v-if="status === 'success'" class="icon-wrapper success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div v-if="status === 'error'" class="icon-wrapper error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h1 class="title">{{ statusMessage }}</h1>
        <p class="subtitle" v-if="status === 'idle'">
          {{t('stripeCancel.extensionCanceled')}}
        </p>
        <p class="subtitle" v-if="status === 'success'">
          {{t('stripeCancel.extensionCanceledCanBack')}}
        </p>
        <p class="subtitle error-text" v-if="status === 'error'">
          {{ errorMessage }}
        </p>
        <div class="actions">
          <template v-if="status === 'idle'">
            <button @click="handleCancelSubscription" class="btn-danger">
              {{t('stripeCancel.confirmCancel')}}
            </button>
            <button @click="router.push('/')" class="btn-secondary">
              {{t('stripeCancel.notConfirmCancel')}}
            </button>
          </template>
          <template v-else-if="status === 'success' || status === 'error'">
            <button @click="router.push('/')" class="btn-primary">
              {{t('stripeCancel.backToMainPage')}}
            </button>
          </template>
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
.payment-status-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--bg);
  padding: 1.5rem;
}

.status-card {
  background: var(--tabBg);
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  max-width: 420px;
  width: 100%;
  text-align: center;
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.success-icon {
  background-color: #f0fdf4;
  color: #22c55e;
}

.error-icon {
  background-color: #fef2f2;
  color: #ef4444;
}

.warning-icon {
  background-color: #fff7ed;
  color: #f97316;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

.title {
  color: var(--title);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.subtitle {
  color: var(--title);
  font-size: 1rem;
  margin-bottom: 2rem;
}

.error-text {
  color: #ef4444;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-primary {
  background-color: #3466bb;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background-color: #334155;
}

.btn-secondary {
  background-color: transparent;
  color: var(--title);
  padding: 0.75rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.btn-secondary:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-danger:hover {
  background-color: #dc2626;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

svg {
  width: 32px;
  height: 32px;
}
</style>