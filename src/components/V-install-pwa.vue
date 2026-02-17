<script setup>
import { ref, onMounted } from 'vue'

const installPrompt = ref(null)
const isInstalled = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    installPrompt.value = e
  })
  window.addEventListener('appinstalled', () => {
    installPrompt.value = null
    isInstalled.value = true
    console.log('PWA было успешно установлено')
  })
})

const clickInstall = async () => {
  if (!installPrompt.value) return
  installPrompt.value.prompt()
  const { outcome } = await installPrompt.value.userChoice
  console.log(`Пользователь ответил: ${outcome}`)
  installPrompt.value = null
}
</script>

<template>
  <button
      v-if="installPrompt"
      @click="clickInstall"
      class="install-btn"
  >
    Установить приложение
  </button>
</template>

<style scoped>
.install-btn {
  padding: 10px 20px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
</style>