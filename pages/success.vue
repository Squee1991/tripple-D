<script setup>
import {useRoute, useRouter} from 'vue-router'
import {userAuthStore} from '../store/authStore.js'
import {onMounted, ref} from 'vue'
import {getAuth, onAuthStateChanged} from 'firebase/auth'

const route = useRoute()
const router = useRouter()
const auth = userAuthStore()
const sessionId = route.query.session_id

const status = ref('processing') // 'processing' | 'success' | 'error'
const statusMessage = ref('Подтверждаем транзакцию...')

definePageMeta({layout: 'blank'}) // Если есть пустой лейаут

onMounted(() => {
  if (!sessionId) {
    status.value = 'error'
    statusMessage.value = 'Сессия оплаты не найдена'
    return
  }

  const authInstance = getAuth()
  onAuthStateChanged(authInstance, async (user) => {
    if (!user) {
      status.value = 'error'
      statusMessage.value = 'Пожалуйста, авторизуйтесь для завершения'
      return
    }

    try {
      const response = await $fetch('/api/stripe/confirm', {
        method: 'POST',
        body: {sessionId}
      })

      if (response.success) {
        await auth.activatePremium(response.data)
        status.value = 'success'
        statusMessage.value = 'Премиум доступ активирован'
        // Быстрый редирект для успеха
        setTimeout(() => router.push('/'), 4000)
      } else {
        status.value = 'error'
        statusMessage.value = response.error || 'Ошибка активации'
      }
    } catch (e) {
      status.value = 'error'
      statusMessage.value = 'Ошибка связи с сервером'
    }
  })
})
</script>

<template>
  <div class="payment-status-container">
    <div class="status-card" :class="status">
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
      <p class="subtitle">
        {{
          status === 'success' ? 'Теперь вам доступны все функции сервиса.' : 'Произошла техническая заминка при обработке.'
        }}
      </p>

      <div class="actions">
        <button @click="router.push('/')" class="btn-primary">
          На главную
        </button>
      </div>

      <p v-if="status === 'success'" class="auto-redirect">
        Перенаправление через несколько секунд...
      </p>
    </div>
  </div>
</template>

<style scoped>
.payment-status-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8fafc; /* Светлый проф. фон */
  padding: 1.5rem;
}

.status-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  max-width: 420px;
  width: 100%;
  text-align: center;
  border: 1px solid #e2e8f0;
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
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #1e293b;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background-color: #334155;
}

.auto-redirect {
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
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