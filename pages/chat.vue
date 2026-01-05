<script setup>
import {ref, computed} from 'vue'
import {useSeoMeta} from "#imports";
import SoundBtn from '../src/components/soundBtn.vue'

import Women from 'assets/images/speak-themen/people/Gemini_Generated_Image_mk095imk095imk09 (2).png'
import taskImage from 'assets/images/speak-themen/animals/panda.png'
import taskImage0 from 'assets/images/speak-themen/animals/dog.png'
import taskImage1 from 'assets/images/speak-themen/animals/dog-hiding.png'
import taskImage2 from 'assets/images/speak-themen/animals/cat.png'
import taskImage3 from 'assets/images/speak-themen/animals/Fox-read-book.png'
import taskImage4 from 'assets/images/speak-themen/home/stay-home.png'
import taskImage5 from 'assets/images/speak-themen/winter/snowman.png'
import taskImage6 from 'assets/images/speak-themen/winter/skiing.png'

useSeoMeta({
  robots: 'noindex, nofollow'
})

const tasks = [
  {id: 1, image: Women},
  {id: 2, image: taskImage4},
  {id: 3, image: taskImage5},
  {id: 4, image: taskImage2},
  {id: 5, image: taskImage3},
  {id: 6, image: taskImage1},
  {id: 7, image: taskImage},
  {id: 8, image: taskImage0},
]

const currentTaskIndex = ref(0)
const input = ref('')
const messages = ref([])
const isLoading = ref(false)
const err = ref('')
const isAnswered = ref(false)

const currentImage = computed(() => {
  if (currentTaskIndex.value >= tasks.length) return null
  return tasks[currentTaskIndex.value].image
})

const isFinished = computed(() => currentTaskIndex.value >= tasks.length)

async function assetToBase64(url) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  } catch (e) {
    return null
  }
}

async function sendMessage() {
  if (!input.value.trim()) return
  isLoading.value = true
  err.value = ''
  messages.value.push({role: 'user', content: input.value})

  const userText = input.value
  input.value = ''

  try {
    const base64Image = await assetToBase64(currentImage.value)
    const res = await $fetch('/api/groq-vision', {
      method: 'POST',
      body: {message: userText, image: base64Image}
    })
    if (res.data) {
      messages.value.push({
        role: 'assistant',
        isStructured: true,
        icon: res.data.icon || '',
        feedback: res.data.feedback || '',
        german_sentence: res.data.german_sentence || res.data.germanSentence || ''
      })
      isAnswered.value = true

    } else if (res.text) {
      messages.value.push({
        role: 'assistant',
        content: res.text,
        isStructured: false
      })
      isAnswered.value = true
    } else if (res.error) {
      err.value = "Ошибка: " + res.error
    }

  } catch (e) {
    err.value = "Ошибка сети: " + e.message
  } finally {
    isLoading.value = false
  }
}

function nextTask() {
  currentTaskIndex.value++
  messages.value = []
  isAnswered.value = false
  err.value = ''
  input.value = ''
}

function restart() {
  currentTaskIndex.value = 0
  messages.value = []
  isAnswered.value = false
  err.value = ''
}
</script>

<template>
  <div class="trainer-container">
    <div class="card">
      <div v-if="isFinished" class="finish-screen">
        <div class="icon">🎉</div>
        <h2>Отличная работа!</h2>
        <p>Все задания выполнены.</p>
        <button @click="restart" class="btn-primary btn-restart">Начать заново</button>
      </div>

      <div v-else class="content-wrapper">
        <div class="header">
          <span class="badge">Aufgabe {{ currentTaskIndex + 1 }} / {{ tasks.length }}</span>
        </div>
        <div class="image-wrapper">
          <div class="image-frame">
            <img :src="currentImage" alt="Task Image"/>
          </div>
        </div>
        <div class="chat-area">
          <div v-if="messages.length === 0" class="placeholder">
            Was siehst du auf dem Bild?
          </div>
          <div class="messages-list">
            <div v-for="(m, i) in messages" :key="i" :class="['message', m.role]">
              <template v-if="m.isStructured">
                <div class="msg-sound">
                  <SoundBtn :text="m.german_sentence || ''"/>
                </div>

                <div class="bubble assistant-bubble">
                  <div class="feedback-part">
                    <span class="status-icon">{{ m.icon }}</span>
                    {{ m.feedback }}
                  </div>
                  <div class="msg-divider"></div>
                  <div class="german-part">
                    {{ m.german_sentence }}
                  </div>
                </div>
              </template>
              <template v-else>
                <div v-if="m.role === 'assistant'" class="msg-sound">
                  <SoundBtn :text="m.content || ''"/>
                </div>
                <div class="bubble">
                  {{ m.content }}
                </div>
              </template>
            </div>
            <div v-if="isLoading" class="message assistant">
              <div class="bubble loading">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="err" class="error-banner">{{ err }}</div>
        <div class="controls">
          <template v-if="!isAnswered">
            <input
                v-model="input"
                @keyup.enter="sendMessage"
                placeholder="Напиши ответ на немецком..."
                :disabled="isLoading"
                class="main-input"
            />
            <button @click="sendMessage" :disabled="isLoading" class="btn-send">➤</button>
          </template>
          <template v-else>
            <button class="btn-next" @click="nextTask">
              Дальше / Weiter ➡️
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trainer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  padding: 20px;
}

.card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.finish-screen {
  padding: 60px 20px;
  text-align: center;
}

.finish-screen .icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.finish-screen h2 {
  margin: 0 0 10px;
  color: #333;
}

.finish-screen p {
  color: #666;
  margin-bottom: 30px;
}

.header {
  padding: 20px 20px 10px;
  display: flex;
  justify-content: center;
}

.badge {
  background: #eef2ff;
  color: #4f46e5;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.image-wrapper {
  padding: 10px 20px;
  display: flex;
  justify-content: center;
}

.image-frame {
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 5px solid #aaaaff;
  border-radius: 20px;
}

.image-frame img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.chat-area {
  flex: 1;
  min-height: 200px;
  max-height: 360px;
  overflow-y: auto;
  padding: 20px;
  background: #fff;
  position: relative;
}

.placeholder {
  text-align: center;
  color: #ccc;
  margin-top: 60px;
  font-size: 14px;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  width: 100%;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.5;
  position: relative;
  white-space: pre-wrap;
}

.user .bubble {
  background: #007bff;
  color: white;
  border-bottom-right-radius: 4px;
}

.assistant .bubble {
  background: #f1f3f4;
  color: #1f1f1f;
  border-bottom-left-radius: 4px;
}

.msg-sound {
  margin-right: 8px;
  align-self: flex-end;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.assistant-bubble {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 200px;
}

.feedback-part {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

.status-icon {
  font-size: 16px;
  margin-right: 4px;
}

.msg-divider {
  height: 1px;
  background-color: #d1d5db;
  width: 100%;
  margin: 4px 0;
}

.german-part {
  font-weight: 600;
  color: #000;
  font-size: 16px;
}

.loading {
  display: flex;
  gap: 4px;
  padding: 16px 20px !important;
}

.loading span {
  width: 6px;
  height: 6px;
  background: #999;
  border-radius: 50%;
  animation: blink 1.4s infinite both;
}

.loading span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

.error-banner {
  background: #fee2e2;
  color: #ef4444;
  padding: 10px;
  font-size: 13px;
  text-align: center;
  margin: 0 20px;
  border-radius: 8px;
}

.controls {
  padding: 20px;
  background: white;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 10px;
}

.main-input {
  flex: 1;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.main-input:focus {
  border-color: #007bff;
}

.btn-send {
  width: 50px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-send:hover {
  background: #0056b3;
}

.btn-send:disabled {
  background: #ccc;
}

.btn-next, .btn-restart {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.1s;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-next:hover, .btn-restart:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.4);
}

.btn-next:active {
  transform: translateY(0);
}

.btn-restart {
  background: #4f46e5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}
</style>