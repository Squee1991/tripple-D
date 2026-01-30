<script setup>
import {ref, computed, nextTick} from 'vue'
import {useSeoMeta} from "#imports";
import {useRouter} from 'vue-router'
import SoundBtn from '../src/components/soundBtn.vue'
import Modal from '../src/components/modal.vue'
import TipsModal from '../src/components/V-tips.vue'
import {topics} from '../utils/descriptionImages.js'

useSeoMeta({
  robots: 'noindex, nofollow'
})

const router = useRouter()
const {t, locale} = useI18n()
const levels = ['A1', 'A2', 'B1']
const viewState = ref('topics')
const selectedTopic = ref(null)
const selectedLevel = ref('A1')
const currentTaskIndex = ref(0)
const input = ref('')
const messages = ref([])
const isLoading = ref(false)
const err = ref('')
const isAnswered = ref(false)
const showDevModal = ref(false)
const showTips = ref(false)

const isRecording = ref(false)
const isProcessing = ref(false)
let mediaRecorder = null
let audioChunks = []

const startRecording = async () => {
  try {
    err.value = ''
    const stream = await navigator.mediaDevices.getUserMedia({audio: true})
    audioChunks = []

    let mimeType = 'audio/webm'
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      mimeType = 'audio/webm;codecs=opus'
    }

    mediaRecorder = new MediaRecorder(stream, {mimeType})

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.push(event.data)
    }

    mediaRecorder.onstop = async () => {
      isProcessing.value = true
      isRecording.value = false
      stream.getTracks().forEach(track => track.stop())

      try {
        const audioBlob = new Blob(audioChunks, {type: mimeType})
        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)

        reader.onloadend = async () => {
          const base64String = reader.result
          try {
            const res = await $fetch('/api/whisper', {
              method: 'POST',
              body: {audioContent: base64String, lang: 'de'}
            })
            if (res && res.text && res.text.trim()) {
              await sendMessage(res.text)
            } else {
              err.value = "Не удалось распознать речь (пустой ответ)"
            }
          } catch (serverErr) {
            console.error(serverErr)
            err.value = "Ошибка сервера: " + (serverErr.data?.error || serverErr.message)
          } finally {
            isProcessing.value = false
          }
        }
      } catch (e) {
        console.error(e)
        err.value = "Ошибка обработки аудио"
        isProcessing.value = false
      }
    }

    mediaRecorder.start()
    isRecording.value = true

  } catch (e) {
    console.error(e)
    err.value = "Нет доступа к микрофону"
  }
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }
}

const toggleRecording = () => {
  if (isRecording.value) stopRecording()
  else startRecording()
}


const overlayData = ref({title: "describePicture.rulesTitle", text: "describePicture.rulesText"})
const tipsData = ref({
  tips: [
    {id: '1', text: t('describePictureTips.tipOne')},
    {id: '2', text: t('describePictureTips.tipTwo')},
    {id: '3', text: t('describePictureTips.tipThree')}]
})

const activeTasks = computed(() => selectedTopic.value ? selectedTopic.value.tasks : [])
const currentImage = computed(() => {
  if (!activeTasks.value.length || currentTaskIndex.value >= activeTasks.value.length) return null
  return activeTasks.value[currentTaskIndex.value].image
})
const isFinished = computed(() => currentTaskIndex.value >= activeTasks.value.length)
const progressPercentage = computed(() => (!activeTasks.value.length) ? 0 : ((currentTaskIndex.value) / activeTasks.value.length) * 100)

const openModal = () => {
  showDevModal.value = true
}
const closeModal = () => {
  showDevModal.value = false
}

function selectTopic(topic) {
  selectedTopic.value = topic;
  viewState.value = 'level'
}

function selectLevel(level) {
  selectedLevel.value = level
}

function startGame() {
  currentTaskIndex.value = 0;
  messages.value = [];
  isAnswered.value = false;
  err.value = '';
  viewState.value = 'game'
}

function goBack() {
  if (viewState.value === 'game') {
    viewState.value = 'level';
    messages.value = [];
    isAnswered.value = false
  } else if (viewState.value === 'level') {
    selectedTopic.value = null;
    viewState.value = 'topics'
  } else {
    router.push('/')
  }
}

function restart() {
  currentTaskIndex.value = 0;
  messages.value = [];
  isAnswered.value = false;
  err.value = ''
}

function changeTopic() {
  selectedTopic.value = null;
  viewState.value = 'topics'
}

function nextTask() {
  currentTaskIndex.value++;
  messages.value = [];
  isAnswered.value = false;
  err.value = '';
  input.value = ''
}

function getScoreClass(score) {
  if (score >= 8) return 'score-high';
  if (score >= 5) return 'score-medium';
  return 'score-low'
}

async function urlToBase64(url) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (e) {
    console.error("Ошибка картинки:", e)
    return null
  }
}

async function sendMessage(voiceText = null) {
  const textToSend = (typeof voiceText === 'string') ? voiceText : input.value

  if (!textToSend || !textToSend.trim()) return

  isLoading.value = true
  err.value = ''
  messages.value.push({role: 'user', content: textToSend})
  input.value = ''
  await nextTick()
  const container = document.querySelector('.messages-scroll')
  if (container) container.lastElementChild?.scrollIntoView({behavior: "smooth"})

  try {
    const task = activeTasks.value[currentTaskIndex.value]
    const reference = task?.descriptions?.[selectedLevel.value] || ''
    let finalImageUrl = task.image
    if (finalImageUrl && !finalImageUrl.startsWith('http')) {
      const base64 = await urlToBase64(finalImageUrl)
      if (base64) finalImageUrl = base64
    }
    const res = await $fetch('/api/groq-vision', {
      method: 'POST',
      body: {
        referenceDescription: reference,
        userLevel: selectedLevel.value,
        userMessage: textToSend,
        userLocale: locale.value,
        imageUrl: finalImageUrl
      }
    })

    if (res.data) {
      messages.value.push({
        role: 'assistant', isStructured: true,
        score: res.data.score || 0,
        feedback: res.data.feedback || '',
        suggestedAnswer: res.data.suggestedAnswer || '',
        keyCorrections: res.data.keyCorrections || []
      })
      isAnswered.value = true
    } else if (res.text) {
      messages.value.push({role: 'assistant', content: res.text, isStructured: false})
      isAnswered.value = true
    } else if (res.error) {
      err.value = "Error: " + res.error
    }
  } catch (e) {
    err.value = "Network Error: " + e.message
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <Modal :visible="showDevModal" @close="closeModal" :title="t(overlayData.title)" :text="t(overlayData.text)"/>
    <TipsModal v-model="showTips" :title="t('adjectiveComparisonPage.tipTitle')" :tips="tipsData.tips"/>
    <div class="content-shell">
      <header class="app-header">
        <button @click="goBack" class="btn-icon-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 class="header-title"><span v-if="viewState === 'topics'">{{ t('describePicture.title') }}</span><span
            v-else>{{ selectedTopic?.label }}</span></h1>
        <button class="btn-icon-info" @click="openModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </header>

      <transition name="fade" mode="out-in">
        <div v-if="viewState === 'topics'" class="view-topics" key="topics">
          <div class="intro-block">
            <h2>Выберите тему 📚</h2>
            <p>Выберите категорию для тренировки навыков описания.</p>
          </div>
          <div class="topics-flex-container">
            <div v-for="topic in topics" :key="topic.id" class="topic-card-item" :style="{ background: topic.gradient }"
                 @click="selectTopic(topic)">
              <div class="topic-icon">{{ topic.icon }}</div>
              <div class="topic-info"><h3 :style="{ color: topic.textColor }">{{ topic.label }}</h3><span
                  class="task-count" :style="{ color: topic.textColor, opacity: 0.8 }">{{
                  topic.tasks.length
                }} картинок</span></div>
            </div>
          </div>
        </div>
        <div v-else-if="viewState === 'level'" class="view-level" key="level">
          <div class="level-header"><h2>Выберите сложность</h2></div>
          <div class="level-options">
            <button v-for="level in levels" :key="level" @click="selectLevel(level)" class="level-card"
                    :class="{ 'active': selectedLevel === level }">
              <div class="level-mark"></div>
              <span class="level-name">{{ level }}</span></button>
          </div>
          <button @click="startGame" class="btn-primary-action">Начать
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h13M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <div v-else class="game-view" key="game">
          <div v-if="isFinished" class="finish-state">
            <div class="finish-content">
              <div class="medal-icon">🎉</div>
              <h2>Тема выполнена</h2>
              <button @click="changeTopic" class="btn-primary-action full-width">Выбрать новую тему</button>
            </div>
          </div>
          <div v-else class="active-game-layout">
            <div class="game-sidebar">
              <div class="progress-container">
                <div class="progress-bar"><span class="progress-text">{{ currentTaskIndex + 1 }} / {{
                    activeTasks.length
                  }}</span>
                  <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                </div>
              </div>
              <div class="image-card"><img :src="currentImage" alt="Task"/></div>
            </div>
            <div class="game-main">
              <div class="chat-container">
                <div v-if="messages.length === 0" class="empty-state"><p>{{ t('describePicture.placeholder') }}</p>
                </div>
                <div class="messages-scroll">
                  <transition-group name="list">
                    <div v-for="(m, i) in messages" :key="i" :class="['msg-row', m.role]">
                      <div v-if="m.isStructured" class="feedback-card">
                        <div class="feedback-score-badge" :class="getScoreClass(m.score)">{{ m.score }}/10</div>
                        <div class="feedback-body">
                          <p class="main-feedback">{{ m.feedback }}</p>
                          <div class="suggestion-box">
                            <div class="suggestion-header"><span class="icon">✨</span><span>Ответ ({{
                                selectedLevel
                              }}):</span></div>
                            <div class="suggestion-content">
                              <SoundBtn :text="m.suggestedAnswer" class="mini-sound"/>
                              <p class="suggestion-text">{{ m.suggestedAnswer }}</p></div>
                          </div>
                          <div v-if="m.keyCorrections?.length" class="corrections-box"><span class="correction-title">💡 Как улучшить:</span>
                            <ul class="correction-list">
                              <li v-for="(c, idx) in m.keyCorrections" :key="idx" class="correction-item">{{ c }}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div v-else class="bubble-wrapper">
                        <div v-if="m.role === 'assistant'" class="sound-wrap">
                          <SoundBtn :text="m.content || ''"/>
                        </div>
                        <div class="bubble">{{ m.content }}</div>
                      </div>
                    </div>
                  </transition-group>
                  <div v-if="isLoading || isProcessing" class="msg-row assistant">
                    <div class="bubble typing-indicator"><span>•</span><span>•</span><span>•</span></div>
                  </div>
                </div>
              </div>
              <div v-if="err" class="error-toast">{{ err }}</div>
              <div class="input-dock">
                <template v-if="!isAnswered">
                  <input v-model="input" @keyup.enter="() => sendMessage()"
                         :placeholder="isRecording ? 'Идет запись...' : t('describePicture.inputPlaceholder')"
                         :disabled="isLoading || isRecording || isProcessing" class="modern-input"/>
                  <button @click="() => sendMessage()" :disabled="isLoading || !input.trim()" class="btn-send-round">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                  <button @click="toggleRecording" class="btn-mic"
                          :class="{ 'recording': isRecording, 'processing': isProcessing }"
                          :disabled="isLoading || isProcessing">
                    <svg v-if="!isRecording && !isProcessing" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    <svg v-else-if="isRecording" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                         stroke-linejoin="round">
                      <rect x="6" y="6" width="12" height="12"></rect>
                    </svg>
                    <span v-else>⏳</span>
                  </button>
                </template>
                <template v-else>
                  <button class="btn-primary-action full-width" @click="nextTask">{{
                      t('describePicture.nextBtn')
                    }}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>

.page-container {
  font-family: "Nunito", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #1f2937;
}

.btn-icon-back, .btn-icon-info {
  border: none;
  background: none;
}

.content-shell {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #edf2f7;
}

.header-title {
  font-size: 1.6rem;
  font-weight: 700;
}

.view-topics {
  padding: 20px 10px;
  overflow-y: auto;
  flex: 1;
}

.topics-flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.topic-card-item {
  flex: 1 1 calc(20% - 15px);
  min-width: 180px;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.topic-card-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.topic-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.topic-info h3 {
  margin: 0 0 5px;
  font-size: 1rem;
  font-weight: 700;
}

.task-count {
  font-size: 0.85rem;
  font-weight: 600;
}

.view-level {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.level-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  margin: 30px 0;
}

.level-card {
  padding: 18px 25px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.level-card.active {
  border-color: #6366f1;
  background: #eff6ff;
}

.level-mark {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  position: relative;
  flex-shrink: 0;
}

.level-card.active .level-mark {
  border-color: #6366f1;
  background: #6366f1;
}

.level-card.active .level-mark::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.level-name {
  font-size: 1.1rem;
  font-weight: 700;
}

.active-game-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 10px;
  padding: 20px 10px;
}

.game-sidebar {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.progress-container {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 18px;
  background: #d6d9de;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #10b981;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  left: 50%;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.image-card {
  max-width: 512px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #edf2f7;
  overflow: hidden;
}

.image-card img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px 10px 10px;
}

.feedback-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 20px;
  width: 100%;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.feedback-score-badge {
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 16px;
  border-bottom-left-radius: 16px;
  font-weight: 800;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.score-high {
  background: #dcfce7;
  color: #166534;
}

.score-medium {
  background: #fef9c3;
  color: #854d0e;
}

.score-low {
  background: #fee2e2;
  color: #991b1b;
}

.main-feedback {
  font-size: 1.05rem;
  line-height: 1.5;
  margin-bottom: 18px;
  color: #374151;
  font-weight: 500;
  margin-top: 10px;
}

.suggestion-box {
  background: #f8fafc;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #6366f1;
}

.intro-block {
  margin-bottom: 10px;

}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.suggestion-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.suggestion-text {
  font-style: italic;
  color: #1e293b;
  margin: 0;
}

.corrections-box {
  margin-top: 15px;
}

.correction-title {
  display: block;
  font-weight: 700;
  font-size: 0.9rem;
  color: #e11d48;
  margin-bottom: 8px;
}

.correction-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.correction-item {
  position: relative;
  padding-left: 20px;
  margin-bottom: 6px;
  font-size: 0.95rem;
  color: #4b5563;
}

.correction-item::before {
  content: "•";
  position: absolute;
  left: 5px;
  color: #e11d48;
  font-weight: bold;
}

.input-dock {
  border-top: 1px solid #edf2f7;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.modern-input {
  flex: 1;
  padding: 14px 20px;
  border-radius: 15px;
  border: 1px solid #e2e8f0;
  outline: none;
}

.btn-send-round {
  width: 48px;
  height: 48px;
  background: #6366f1;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  text-align: center;
  font-weight: 600;
}

.btn-primary-action {
  background: #111827;
  color: #fff;
  padding: 16px 30px;
  border-radius: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}

.bubble {
  padding: 12px 16px;
  border-radius: 15px;
}

.user .bubble {
  background: #6366f1;
  color: white;
  border-bottom-right-radius: 4px;
}

.assistant .bubble {
  background: #f1f5f9;
  border-bottom-left-radius: 4px;
}

.msg-row {
  display: flex;
  width: 100%;
  margin-bottom: 15px;
}

.user {
  justify-content: flex-end;
}

.assistant {
  justify-content: flex-start;
}

@media (max-width: 1000px) {
  .topic-card-item {
    flex: 1 1 calc(33.33% - 15px);
  }
}

@media (max-width: 1023px) {
  .active-game-layout {
    flex-direction: column;
  }

  .active-game-layout {
    padding: 20px 0;
    max-width: 768px;
    margin: 0 auto;
  }
}

.btn-mic {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: #9fdc72;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-mic:hover {
  background: #e5e7eb;
}

.btn-mic.recording {
  background: #fee2e2;
  color: #ef4444;
  animation: pulse-red 1.5s infinite;
}

.btn-mic.processing {
  opacity: 0.7;
  cursor: not-allowed;
}

@keyframes pulse-red {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}
</style>