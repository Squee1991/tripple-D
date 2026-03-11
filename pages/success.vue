<script setup>
import { useRoute, useRouter } from 'vue-router'
import { userAuthStore } from '../store/authStore.js'
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const route = useRoute()
const router = useRouter()
const auth = userAuthStore()
const sessionId = route.query.session_id

const statusText = ref('Проверяем статус оплаты...')
const isLoading = ref(true)

definePageMeta({
  robots: {
    index: false,
    follow: false
  }
})

onMounted(() => {
  if (sessionId) {
    const authInstance = getAuth()
    onAuthStateChanged(authInstance, async (user) => {
      if (!user) {
        console.error('Пользователь не авторизован')
        statusText.value = 'Ошибка: пожалуйста, войдите в аккаунт'
        isLoading.value = false
        return
      }

      try {
        const response = await $fetch('/api/stripe/confirm', {
          method: 'POST',
          body: { sessionId }
        })

        if (response.success && response.data) {
          await auth.activatePremium(response.data)
          statusText.value = 'Premium успешно активирован!'
          isLoading.value = false
        } else {
          statusText.value = 'Ошибка: ' + (response.error || 'Неизвестная ошибка')
          isLoading.value = false
        }
      } catch (e) {
        console.error('Ошибка запроса:', e)
        statusText.value = 'Ошибка соединения с сервером'
        isLoading.value = false
      }

      // Перенаправление на главную
      setTimeout(() => {
        router.push('/')
      }, 3000)
    })
  } else {
    statusText.value = 'Ошибка: отсутствует номер сессии'
    isLoading.value = false
    setTimeout(() => router.push('/'), 3000)
  }
})
</script>

<template>
  <div class="activation-page">
    <div class="modal-card">
      <div v-if="isLoading" class="loader"></div>

      <div v-else class="icon-placeholder">
        <span v-if="statusText.includes('успешно')">👑</span>
        <span v-else>⚠️</span>
      </div>

      <h1 class="status-title">{{ statusText }}</h1>
      <p class="redirect-msg">Автоматический переход на главную...</p>
    </div>
  </div>
</template>

<style scoped>
.activation-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  /* Фоновый цвет, как у основного интерфейса */
  background-color: #fcf6e3;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  padding: 20px;
}

.modal-card {
  background: #ffffff;
  /* Имитация геймифицированных элементов: толстая граница и сплошная тень */
  border: 3px solid #2d3748;
  border-radius: 20px;
  box-shadow: 0 8px 0 #2d3748;
  padding: 40px 30px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-placeholder {
  font-size: 64px;
  margin-bottom: 15px;
  line-height: 1;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.status-title {
  font-size: 1.8rem;
  color: #2d3748;
  margin: 0 0 15px 0;
  font-weight: 700;
  line-height: 1.3;
}

.redirect-msg {
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
  font-weight: 600;
}

.loader {
  border: 6px solid #edf2f7;
  /* Синий цвет, как у кнопки "Выбрать" на вашем сайте */
  border-top: 6px solid #5b8edc;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin-bottom: 25px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes popIn {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>