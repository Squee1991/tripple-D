<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useSeoMeta, useState } from "#imports"
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import SoundBtn from '../../src/components/soundBtn.vue'
import TipsModal from '../../src/components/V-tips.vue'
import { topics } from '@/utils/descriptionImages.js'

import { getFunctions, httpsCallable } from 'firebase/functions'
import { showInterstitial } from '../../utils/admob.js'
import VLoginPreloader from "~/src/components/V-loginPreloader.vue";

useSeoMeta({
  robots: 'noindex, nofollow'
})

const router = useRouter()
const { t, locale } = useI18n()

const sessionConfig = useState('sessionConfig')
const selectedTopic = computed(() => topics.find(t => t.id === sessionConfig.value?.topicId))
const selectedLevel = computed(() => sessionConfig.value?.level || 'A1')
const activeTasks = computed(() => selectedTopic.value ? selectedTopic.value.tasks : [])

const currentTaskIndex = ref(0)
const input = ref('')
const messages = ref([])
const isLoading = ref(false)
const err = ref('')
const isAnswered = ref(false)
const showTips = ref(false)
const isScreenLoading = ref(true)

const isRecording = ref(false)
const isProcessing = ref(false)

const functions = getFunctions(undefined, 'us-central1')

const tipsData = ref({
  tips: [
    {id: '1', text: t('describePictureTips.tipOne')},
    {id: '2', text: t('describePictureTips.tipTwo')},
    {id: '3', text: t('describePictureTips.tipThree')}
  ]
})

const currentImage = computed(() => {
  if (!activeTasks.value.length || currentTaskIndex.value >= activeTasks.value.length) return null
  return activeTasks.value[currentTaskIndex.value].image
})

const isFinished = computed(() => activeTasks.value.length > 0 && currentTaskIndex.value >= activeTasks.value.length)
const progressPercentage = computed(() => (!activeTasks.value.length) ? 0 : ((currentTaskIndex.value) / activeTasks.value.length) * 100)

onMounted(() => {
  if (!sessionConfig.value?.topicId || !selectedTopic.value) {
    router.push('/image-description')
    return
  }

  const minDelay = new Promise(resolve => setTimeout(resolve, 1500))

  const imgPromise = new Promise(resolve => {
    if (!currentImage.value) {
      resolve()
      return
    }
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve
    img.src = currentImage.value
  })

  const adPromise = new Promise(resolve => {
    showInterstitial(() => {
      resolve()
    })
  })

  Promise.all([minDelay, imgPromise, adPromise]).then(() => {
    isScreenLoading.value = false
  })
})

async function sendMessage(voiceText = null) {
  const textToSend = (typeof voiceText === 'string') ? voiceText : input.value
  if (!textToSend || !textToSend.trim()) return

  isLoading.value = true
  err.value = ''
  messages.value.push({ role: 'user', content: textToSend })
  input.value = ''

  await nextTick()
  const container = document.querySelector('.messages-scroll')
  if (container) container.lastElementChild?.scrollIntoView({ behavior: "smooth" })

  try {
    const task = activeTasks.value[currentTaskIndex.value]
    const reference = task?.descriptions?.[selectedLevel.value] || ''
    const finalImageUrl = task.image

    const visionAnalyze = httpsCallable(functions, 'visionAnalyze')
    const result = await visionAnalyze({
      referenceDescription: reference,
      userLevel: selectedLevel.value,
      userMessage: textToSend,
      userLocale: locale.value,
      imageUrl: finalImageUrl
    })

    const res = result.data

    if (res && res.error) {
      err.value = "ПОДРОБНАЯ ОШИБКА: " + res.error;
      messages.value.pop()
    }
    else if (res && res.data) {
      messages.value.push({
        role: 'assistant', isStructured: true,
        score: res.data.score || 0,
        feedback: res.data.feedback || '',
        suggestedAnswer: res.data.suggestedAnswer || '',
        keyCorrections: res.data.keyCorrections || []
      })
      isAnswered.value = true
    } else {
      err.value = "Ошибка анализа. Пустой ответ сервера."
      messages.value.pop()
    }
  } catch (e) {
    err.value = `СЕТЕВАЯ ОШИБКА: [${e.code || 'no-code'}] ${e.message || String(e)}`
    messages.value.pop()
  } finally {
    isLoading.value = false
  }
}

function nextTask() {
  currentTaskIndex.value++;
  messages.value = [];
  isAnswered.value = false;
  err.value = '';
  input.value = ''
}

function goBack() {
  router.push('/image-description')
}
</script>

<template>
  <div class="page-container">
    <div class="page__inner">
      <TipsModal v-model="showTips" :title="t('adjectiveComparisonPage.tipTitle')" :tips="tipsData.tips"/>
      <VLoginPreloader v-if="isScreenLoading"/>
      <div class="content-shell" v-else-if="selectedTopic">
        <div class="game-view">
          <div v-if="isFinished" class="finish-state">
            <div class="finish-content card-style-box">
              <div class="medal-icon">🎉</div>
              <h2>{{ t('descriptionSession.done')}}</h2>
              <button @click="goBack" class="btn-primary-action full-width">{{ t('descriptionSession.newTheme')}}</button>
            </div>
          </div>
          <div v-else class="active-game-layout">
            <div class="game-sidebar">
              <div class="progress-container">
                <button @click="goBack" class="btn-icon-back">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                       stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: progressPercentage + '%' }">
                    <div class="glare"></div>
                  </div>
                </div>
                <div class="progress-text">{{ currentTaskIndex + 1 }} / {{ activeTasks.length }}</div>
              </div>
              <div class="image-card card-style-box"><img :src="currentImage" alt="Task"/></div>
            </div>
            <div class="game-main card-style-box chat-panel">
              <div class="chat-container">
                <div v-if="messages.length === 0" class="empty-state"><p>{{ t('describePicture.placeholder') }}</p></div>
                <div class="messages-scroll">
                  <transition-group name="list">
                    <div v-for="(m, i) in messages" :key="i" :class="['msg-row', m.role]">
                      <div v-if="m.isStructured" class="feedback-card">
                        <div class="feedback-body">
                          <p class="main-feedback">{{ m.feedback }}</p>
                          <div class="suggestion-box">
                            <div class="suggestion-header"><span class="icon">✨</span><span>{{ t('descriptionSession.answer')}}:</span></div>
                            <div class="suggestion-content">
                              <SoundBtn :text="m.suggestedAnswer" class="mini-sound"/>
                              <p class="suggestion-text">{{ m.suggestedAnswer }}</p>
                            </div>
                          </div>
                          <div v-if="m.keyCorrections?.length" class="corrections-box">
                            <span class="correction-title">💡 {{ t('descriptionSession.better')}}</span>
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
                            :placeholder="t('describePicture.inputPlaceholder')"
                            :disabled="isLoading || isProcessing" class="modern-input card-style-box" rows="2"
                  ></textarea>
                  <div class="btn__wrapper">
                    <button @click="() => sendMessage()" :disabled="isLoading || !input.trim()" class="btn-send-round">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                </template>
                <template v-else>
                  <button class="btn-primary-action full-width" @click="nextTask">{{t('describePicture.nextBtn')}}</button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.screen-preloader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.page-container {
  font-family: "Nunito", sans-serif;
  display: flex;
  justify-content: center;
  background-color: var(--bg);
  color: #2b2b2b;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.page__inner {
  padding: 5px 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

h1, h2, h3, .header-title, .btn-primary-action, .correction-title {
  font-family: "Nunito", sans-serif;
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
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active, .btn-icon-info:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.content-shell,
.game-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.header-title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--titleColor);
  text-shadow: 1px 1px 0px #fff;
}

.btn-primary-action {
  background: #3b82f6;
  color: #fff;
  padding: 10px 40px;
  border-radius: 50px;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  box-shadow: 0 5px 0 #1d4ed8;
  transition: transform 0.1s;
  width: 100%;
}

.btn-primary-action:active {
  transform: translate(1px, 1px);
}

.active-game-layout {
  display: flex;
  flex-direction: column;
  max-width: 630px;
  margin: 0 auto;
  gap: 10px;
  flex: 1;
  width: 100%;
  overflow: hidden;
  min-height: 0;
}

.game-sidebar {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex-shrink: 0;
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
  border: 3px solid var(--tabsSlideBorderColor);
}

.image-card img {
  max-width: 100%;
  object-fit: cover;
}

.progress-container {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  gap: 5px;
  flex-shrink: 0;
}

.progress-bar {
  flex: 1;
  height: 27px;
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #4ade80;
  transition: width .4s;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.glare {
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 4px;
}

.progress-text {
  font-size: 18px;
  font-weight: 900;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
}

.chat-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.chat-container {
  overflow-y: auto;
  margin-bottom: 3px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chat-container::-webkit-scrollbar {
  display: none;
}

.empty-state {
  font-weight: 600;
  text-align: center;
  color: var(--titleColor);
}

.bubble {
  padding: 5px 9px;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  max-width: 100%;
  position: relative;
}

.user .bubble {
  background: #e4e6e8;
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
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  padding: 25px 8px 8px 8px;
  width: 100%;
  position: relative;
}

.feedback-score-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  padding: 2px 11px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-bottom-left-radius: 16px;
  border-top-right-radius: 12px;
  font-weight: 900;
  font-size: 1.1rem;
  font-family: "Nunito", sans-serif;
  z-index: 2;
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
  font-family: "Nunito", sans-serif;
  font-size: 1rem;
  margin-bottom: 5px;
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
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
  padding: 8px 0;
}

.modern-input {
  flex: 1;
  padding: 8px;
  font-size: 14px;
  font-weight: 700;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  font-family: 'Nunito', sans-serif;
  outline: none;
  resize: none;
  min-height: 150px;
  scrollbar-width: thin;
  scrollbar-color: #2b2b2b transparent;
}

.modern-input:disabled {
  background-color: #f5f5f5;
  color: #e26a4b;
  opacity: 1;
  -webkit-text-fill-color: #e26a4b;
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
  border: none;
  box-shadow: 0 5px 0 #c4973c;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
  padding: 10px;
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
}
</style>