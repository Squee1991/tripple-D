<script setup>
    import { useRoute, useRouter } from 'vue-router'
    import { userAuthStore } from '../store/authStore.js'
    import { onMounted } from 'vue'

    const route = useRoute()
    const router = useRouter()
    const auth = userAuthStore()
    const sessionId = route.query.session_id
    import { getAuth, onAuthStateChanged } from 'firebase/auth'
    onMounted(() => {
      if (sessionId) {
        const authInstance = getAuth()
        onAuthStateChanged(authInstance, async (user) => {
          if (!user) {
            console.error('Пользователь не авторизован даже после ожидания')
            return
          }
          try {
            console.log('Пользователь авторизован, получаем токен...')
            const token = await user.getIdToken()
            const response = await $fetch('/api/stripe/confirm', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`
              },
              body: { sessionId }
            })
            console.log('Ответ от сервера:', response)
            if (response.success) {
              await auth.fetchuser()
              if (!auth.isPremium) {
                console.warn('⚠️ Премиум не обновился сразу, повторная попытка...')
                await new Promise((r) => setTimeout(r, 1000))
                await auth.fetchuser()
              }
            } else {
              console.error('Сервер вернул ошибку:', response.error)
            }
          } catch (e) {
            console.error('Ошибка при выполнении запроса $fetch:', e)
          }
          setTimeout(() => {
            router.push('/')
          }, 3000)
        })
      }
    })

</script>
<template>
    <div class="success-page">
        <div class="loader"></div>
        <h1>Спасибо за покупку!</h1>
        <p>Подписка активирована.</p>
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
