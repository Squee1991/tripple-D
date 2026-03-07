<script setup>
import {ref, computed, nextTick} from 'vue'
import {useSeoMeta} from "#imports"
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
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
               stroke="#2b2b2b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 class="header-title">
          <span v-if="viewState === 'topics'">{{ t('describePicture.title') }}</span>
          <span v-else>{{ selectedTopic?.label }}</span>
        </h1>
        <button class="btn-icon-info" @click="openModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
               stroke="#2b2b2b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </header>

      <transition name="fade" mode="out-in">
        <div v-if="viewState === 'topics'" class="view-topics" key="topics">
          <div class="intro-block">
<!--            <h2>ВЫБЕРИТЕ ТЕМУ</h2>-->
            <p>Выберите категорию для тренировки навыков описания.</p>
          </div>
          <div class="topics-flex-container">
            <div v-for="topic in topics" :key="topic.id" class="topic-card-item" @click="selectTopic(topic)">
              <div class="card-top-banner" :style="{ background: topic.gradient || '#e26a4b' }">
                <h3 :style="{ color: topic.textColor || '#fff' }">{{ topic.label }}</h3>
              </div>
              <div class="card-body-content">
                <div class="topic-icon">{{ topic.icon }}</div>
                <div class="card-footer-strip">
                  <span class="task-count">{{ topic.tasks.length }} КАРТИНОК</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="viewState === 'level'" class="view-level" key="level">
          <div class="level-header"><h2>ВЫБЕРИТЕ СЛОЖНОСТЬ</h2></div>
          <div class="level-options">
            <button v-for="level in levels" :key="level" @click="selectLevel(level)" class="level-card"
                    :class="{ 'active': selectedLevel === level }">
              <div class="level-mark"></div>
              <span class="level-name">{{ level }}</span>
            </button>
          </div>
          <button @click="startGame" class="btn-primary-action">НАЧАТЬ
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h13M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <div v-else class="game-view" key="game">
          <div v-if="isFinished" class="finish-state">
            <div class="finish-content card-style-box">
              <div class="medal-icon">🎉</div>
              <h2>ТЕМА ВЫПОЛНЕНА</h2>
              <button @click="changeTopic" class="btn-primary-action full-width">ВЫБРАТЬ НОВУЮ ТЕМУ</button>
            </div>
          </div>
          <div v-else class="active-game-layout">
            <div class="game-sidebar">
              <div class="progress-container">
                <div class="progress-bar">
                  <span class="progress-text">{{ currentTaskIndex + 1 }} / {{ activeTasks.length }}</span>
                  <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
                </div>
              </div>
              <div class="image-card card-style-box"><img :src="currentImage" alt="Task"/></div>
            </div>
            <div class="game-main card-style-box chat-panel">
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
                            <div class="suggestion-header"><span class="icon">✨</span><span>ОТВЕТ ({{
                                selectedLevel
                              }}):</span></div>
                            <div class="suggestion-content">
                              <SoundBtn :text="m.suggestedAnswer" class="mini-sound"/>
                              <p class="suggestion-text">{{ m.suggestedAnswer }}</p>
                            </div>
                          </div>
                          <div v-if="m.keyCorrections?.length" class="corrections-box">
                            <span class="correction-title">💡 КАК УЛУЧШИТЬ:</span>
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
                  <textarea v-model="input" @keydown.enter.prevent="() => sendMessage()"
                            :placeholder="isRecording ? 'ИДЕТ ЗАПИСЬ...' : t('describePicture.inputPlaceholder')"
                            :disabled="isLoading || isRecording || isProcessing" class="modern-input card-style-box" rows="2"
                  ></textarea>
                  <div class="btn__wrapper">
                    <button @click="() => sendMessage()" :disabled="isLoading || !input.trim()" class="btn-send-round">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                    <button @click="toggleRecording" class="btn-mic"
                            :class="{ 'recording': isRecording, 'processing': isProcessing }"
                            :disabled="isLoading || isProcessing">
                      <svg v-if="!isRecording && !isProcessing" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                           stroke-linejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </svg>
                      <svg v-else-if="isRecording" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                           stroke-linejoin="round">
                        <rect x="6" y="6" width="12" height="12"></rect>
                      </svg>
                      <span v-else>⏳</span>
                    </button>
                  </div>
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
@import url('https://fonts.googleapis.com/css2?family=Pangolin&family=Nunito:wght@400;700;900&display=swap');

.page-container {
  font-family: "Nunito", sans-serif;
  display: flex;
  justify-content: center;
  padding: 12px;
  background-color: var(--bg);
  color: #2b2b2b;
  min-height: 100vh;
}

h1, h2, h3, .header-title, .level-name, .btn-primary-action, .correction-title {
  font-family: 'Pangolin', cursive;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--titleColor);
}

.btn__wrapper {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.btn-icon-back, .btn-icon-info {
  border: none;
  background: #fff;
  border: 3px solid #2b2b2b;
  border-radius: 12px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 3px 3px 0px #2b2b2b;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active, .btn-icon-info:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.content-shell {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.header-title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--titleColor);
  text-shadow: 1px 1px 0px #fff;
}

.intro-block {
  margin-bottom: 15px;
  text-align: center;
}

.intro-block h2 {
  font-size: 2.2rem;
}

.intro-block p {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--titleColor);
}

.topics-flex-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 12px;
}

.topic-card-item {
  background-color: #fdfaf6;
  border: 4px solid #2b2b2b;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 6px 6px 0px #2b2b2b;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
}

@media (min-width: 1024px) {
  .topic-card-item:hover {
    transform: translateY(-2px) rotate(-.3deg);
  }
}

.card-top-banner {
  padding: 15px;
  text-align: center;
  border-bottom: 4px solid #2b2b2b;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-top-banner h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 900;
}

.card-body-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  background-image: radial-gradient(#d5cebe 15%, transparent 16%);
  background-size: 20px 20px;
  background-position: 0 0, 10px 10px;
}

.topic-icon {
  font-size: 60px;
  margin-bottom: 13px;
  filter: drop-shadow(3px 3px 0px rgba(43, 43, 43, 0.3));
}

.card-footer-strip {
  background: #fff;
  border: 3px solid #2b2b2b;
  padding: 5px 15px;
  border-radius: 20px;
}

.task-count {
  font-size: 0.9rem;
  font-weight: 900;
  font-family: 'Pangolin', cursive;
}

.view-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 20px;
}

.level-header h2 {
  font-size: 1.3rem;
}

.level-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px;
  margin: 15px 0;
}

.level-card {
  padding: 20px 25px;
  border: 4px solid #2b2b2b;
  background: #fff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  box-shadow: 4px 4px 0px #2b2b2b;
  transition: transform 0.1s;
}

.level-card:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #2b2b2b;
}

.level-card.active {
  background: #dfaa40;
}

.level-mark {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 4px solid #2b2b2b;
  background: #fff;
  position: relative;
}

.level-card.active .level-mark {
  background: #2b2b2b;
}

.level-name {
  font-size: 1.5rem;
  font-weight: 900;
  color: black;
}

.btn-primary-action {
  background: #e26a4b;
  color: #fff;
  padding: 8px 40px;
  border-radius: 16px;
  font-size: 1.5rem;
  border: 2px solid #2b2b2b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  box-shadow: 3px 3px 0px #2b2b2b;
  transition: transform 0.1s;
}

.btn-primary-action:active {
  transform: translate(5px, 5px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.active-game-layout {
  display: flex;
  flex-direction: column;
  max-width: 630px;
  margin: 0 auto;
  gap: 10px;
}

.game-sidebar {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.card-style-box {
  border-radius: 16px;
}

.image-card {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.progress-container {
  display: flex;
  align-items: center;
}

.progress-bar {
  flex: 1;
  height: 30px;
  background: #fff;
  border: 4px solid #2b2b2b;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #98b460;
  border-right: 4px solid #2b2b2b;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  color: #2b2b2b;
  font-weight: 900;
  z-index: 2;
  font-family: 'Pangolin', cursive;
}

.chat-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #fff;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 3px;
  max-height: 270px;
}

.empty-state {
  font-weight: 600;
  text-align: center;
}

.bubble {
  padding: 5px 9px;
  border-radius: 16px;
  border: 3px solid #2b2b2b;
  font-size: 1rem;
  font-weight: 700;
  max-width: 100%;
  position: relative;
}

.user .bubble {
  background: #9cb9c9;
  border-bottom-right-radius: 0;
}

.suggestion-content {
  display: flex;
  align-items: center;
}

.assistant .bubble {
  background: #fdfaf6;
  border-bottom-left-radius: 0;
}

.msg-row {
  display: flex;
  width: 100%;
  margin-bottom: 5px;
}

.user {
  justify-content: flex-end;
}

.assistant {
  justify-content: flex-start;
}

.feedback-card {
  background: #fdfaf6;
  border: 4px solid #2b2b2b;
  border-radius: 16px;
  padding: 25px 8px 8px 8px;
  width: 100%;
  position: relative;
  box-shadow: 4px 4px 0px rgba(43, 43, 43, 0.1);
}

.feedback-score-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  padding: 2px 11px;
  border: 4px solid #2b2b2b;
  border-bottom-left-radius: 16px;
  border-top-right-radius: 12px;
  font-weight: 900;
  font-size: 1.1rem;
  font-family: 'Pangolin', cursive;
}

.score-high {
  background: #98b460;
  color: #fff;
}

.score-medium {
  background: #dfaa40;
  color: #2b2b2b;
}

.score-low {
  background: #e26a4b;
  color: #fff;
}

.suggestion-header {
  font-family: 'Pangolin', cursive;
  font-size: 1rem;
  margin-bottom: 10px;
}

.correction-title {
  color: #e26a4b;
  font-size: 1.2rem;
}

.correction-item {
  font-weight: 700;
  margin-bottom: 8px;
}

.input-dock {
  display: flex;
  gap: 10px;
}

.modern-input {
  flex: 1;
  padding: 4px 5px;
  font-size: 1.1rem;
  font-weight: 700;
  border: 3px solid #2b2b2b;
  font-family: 'Nunito', sans-serif;
  outline: none;
  box-shadow: 3px 3px 0px #2b2b2b !important;
  resize: none;
  min-height: 110px;
  scrollbar-width: thin;
  scrollbar-color: #2b2b2b transparent;
}

.modern-input::-webkit-scrollbar {
  width: 3px;
}

.modern-input::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 8px;
}

.modern-input::-webkit-scrollbar-thumb {
  background-color: #2b2b2b;
  border-radius: 8px;
}

.btn-send-round, .btn-mic {
  width: 55px;
  height: 55px;
  border: 2px solid #2b2b2b;
  border-radius: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0px #2b2b2b;
  transition: transform 0.1s;
}

.btn-send-round {
  background: #dfaa40;
  color: #2b2b2b;
}

.btn-mic {
  background: #98b460;
  color: #2b2b2b;
}

.btn-send-round:active, .btn-mic:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.btn-mic.recording {
  background: #e26a4b;
  color: #fff;
  animation: none;
}

.finish-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.finish-content {
  padding: 50px;
  text-align: center;
}

.medal-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

@media (max-width: 767px) {
  .header-title {
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
  }

  .btn-send-round, .btn-mic {
    width: 100%;
    height: 42px;
  }

  .input-dock {
    flex-direction: column;
  }

  .chat-panel {
    padding: 5px;
  }

  .btn__wrapper {
    flex-direction: row;
  }

  .intro-block h2 {
    font-size: 1.3rem;
  }

  .level-header h2{
    font-size: 1.2rem;
  }
}
</style>