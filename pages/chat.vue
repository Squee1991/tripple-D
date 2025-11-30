<script setup>
import { ref } from 'vue'

definePageMeta({
  robots: {
    index: false,
    follow: false
  }
})

const input = ref('')
const messages = ref([])
const err = ref('')

async function sendMessage() {
  if (!input.value.trim()) return
  err.value = ''
  messages.value.push({ role: 'user', content: input.value })

  try {
    const res = await $fetch('/api/groq-chat', {
      method: 'POST',
      body: { messages: messages.value }
    })
    const answer = res?.choices?.[0]?.message?.content || ''
    messages.value.push({ role: 'assistant', content: answer })
  } catch (e) {
    const payload =
        typeof e?.data === 'string'
            ? e.data
            : e?.data
                ? JSON.stringify(e.data, null, 2)
                : e?.message || String(e)

    err.value = payload
    console.error('groq-chat error:', e)
  }


  input.value = ''
}
</script>

<template>
  <div>
    <div v-if="err" style="color:red; margin-bottom:8px;">{{ err }}</div>
    <div v-for="(m,i) in messages" :key="i">
      <strong>{{ m.role }}:</strong> {{ m.content }}
    </div>
    <input v-model="input" placeholder="Напиши что-то..." />
    <button @click="sendMessage">Отправить</button>
  </div>
</template>
