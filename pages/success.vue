<script setup>
import { useRoute, useRouter } from 'vue-router'
import { userAuthStore } from '../store/authStore.js'
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const route = useRoute()
const router = useRouter()
const auth = userAuthStore()
const sessionId = route.query.session_id

const statusText = ref('Проверяем оплату...')

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
        statusText.value = 'Ошибка: войдите в аккаунт'
        return
      }

      try {
        console.log('Пользователь тут, стучимся на сервер...')
        const response = await $fetch('/api/stripe/confirm', {
          method: 'POST',
          body: { sessionId }
        })
        console.log('Ответ сервера:', response)
        if (response.success && response.data) {
          statusText.value = 'Оплата подтверждена! Активируем...'
          await auth.activatePremium(response.data)
          statusText.value = 'Подписка активирована! 🎉'
        } else {
          console.error('Ошибка в ответе:', response)
          statusText.value = 'Ошибка: ' + (response.error || 'Неизвестная ошибка')
        }
      } catch (e) {
        console.error('Ошибка запроса:', e)
        statusText.value = 'Ошибка соединения'
      }
      setTimeout(() => {
        router.push('/')
      }, 3000)
    })
  } else {
    statusText.value = 'Ошибка: нет номера сессии'
    setTimeout(() => router.push('/'), 3000)
  }
})
</script>

<template>
  <div class="success-page">
    <div class="loader"></div>
    <h1>{{ statusText }}</h1>
    <p v-if="auth.isPremium">Теперь вы Premium!</p>
    <p class="redirect-msg">Сейчас вы будете перенаправлены на главную страницу...</p>
  </div>
</template>

<style scoped>

.success-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f5f5ff;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin: 1rem 0 0.5rem;
  color: #4CAF50;
}

p {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.redirect-msg {
  margin-top: 1rem;
  font-style: italic;
  color: #777;
}

.loader {
  border: 6px solid #e0e0e0;
  border-top: 6px solid #4CAF50;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>