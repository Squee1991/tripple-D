<script setup>
import {ref, computed} from 'vue'
import {useSeoMeta} from "#imports";
import {useRouter} from 'vue-router'
import SoundBtn from '../src/components/soundBtn.vue'
import Modal from '../src/components/modal.vue'
import TipsModal from '../src/components/V-tips.vue'

import Women from 'assets/images/speak-themen/people/Gemini_Generated_Image_mk095imk095imk09 (2).png'
import taskImage from 'assets/images/speak-themen/animals/panda.png'
import taskImage0 from 'assets/images/speak-themen/animals/dog.png'
import taskImage1 from 'assets/images/speak-themen/animals/dog-hiding.png'
import taskImage2 from 'assets/images/speak-themen/animals/cat.png'
import taskImage3 from 'assets/images/speak-themen/animals/Fox-read-book.png'
import taskImage4 from 'assets/images/speak-themen/home/stay-home.png'
import snowManImage from 'assets/images/speak-themen/winter/snowman.png'
import taskImage6 from 'assets/images/speak-themen/winter/skiing.png'

useSeoMeta({
  robots: 'noindex, nofollow'
})

const router = useRouter()
const {t, locale} = useI18n()
const isAr = computed(() => locale.value === 'ar')

const mode = ref('local')
const showDevModal = ref(false)
const showTips = ref(false)
const preSelectedLevel = ref('A1')
const gameStarted = ref(false)

const sliderTransform = computed(() => {
  if (isAr.value) {
    return mode.value === 'online' ? 'translateX(100%)' : 'translateX(0%)'
  } else {
    return mode.value === 'online' ? 'translateX(0%)' : 'translateX(100%)'
  }
})

const overlayData = ref({
  title: "describePicture.rulesTitle",
  text: "describePicture.rulesText"
})

const tipsData = ref({
  tips: [
    {id: '1', text: t('describePictureTips.tipOne')},
    {id: '2', text: t('describePictureTips.tipTwo')},
    {id: '3', text: t('describePictureTips.tipThree')},
  ]
})

const openModal = () => {
  showDevModal.value = true
}
const closeModal = () => {
  showDevModal.value = false
}
const tipsModule = () => {
  showTips.value = true
}

function goBack() {
  if (gameStarted.value) {
    gameStarted.value = false
    restart()
  } else {
    router.push('/')
  }
}

function selectPreLevel(level) {
  preSelectedLevel.value = level
}

function startGame() {
  selectedLevel.value = preSelectedLevel.value
  gameStarted.value = true
}

function hasReferenceForLevel(task, level) {
  const ref = task?.descriptions?.[level]
  return typeof ref === 'string' && ref.trim().length > 0
}

const tasks = [
  // {
  //   id: 1,
  //   image: Women,
  //   descriptions: {
  //     A1: "Eine Frau mit langen Haaren sitzt und lächelt. Sie trägt elegante Kleidung und sieht freundlich aus.",
  //     A2: "Eine Frau mit langen Haaren sitzt und lächelt. Sie trägt elegante Kleidung und wirkt sehr freundlich.",
  //     B1: "Eine Frau mit langen Haaren sitzt und lächelt freundlich. Sie trägt elegante Kleidung und macht einen sympathischen Eindruck."
  //   }
  // },
  // {
  //   id: 2,
  //   image: taskImage4,
  //   descriptions: {
  //     A1: "Ein gemütliches Zuhause mit einer Person, die drinnen bleibt. Es gibt Möbel und eine warme Atmosphäre.",
  //     A2: "Ein gemütliches Zuhause. Eine Person bleibt drinnen. Man sieht Möbel und eine warme, ruhige Atmosphäre.",
  //     B1: "Ein gemütliches Zuhause, in dem eine Person drinnen bleibt. Möbel und die warme Atmosphäre schaffen ein behagliches Gefühl."
  //   }
  // },
  {
    id: 3,
    image: snowManImage,
    descriptions: {
      A1: "Auf dem Bild ist ein Schneemann. Er ist weiß. Er hat eine Nase. Er trägt eine Mütze und einen Schal. Der Schneemann lächelt.",
      A2: "Auf dem Bild sieht man einen Schneemann. Der Schneemann ist weiß und rund. Er hat eine orange Nase und schwarze Augen. Er trägt eine blaue und orange Mütze und einen rosa Schal. Der Schneemann hat auch zwei Arme aus Zweigen. Er sieht freundlich aus.",
      B1: "Auf dem Bild ist ein Schneemann zu sehen. Er besteht aus zwei großen Schneekugeln und ist ganz weiß. Der Schneemann hat eine orange Karottennase, schwarze Augen und ein freundliches Lächeln. Er trägt eine bunte Mütze in Blau und Orange sowie einen rosa Schal. Seine Arme sind aus Zweigen gemacht, und auf seinem Körper sind violette Knöpfe. Der Schneemann wirkt fröhlich und winterlich."
    }
  },
  // {
  //   id: 4,
  //   image: taskImage2,
  //   descriptions: {
  //     A1: "Eine niedliche Katze sitzt oder liegt. Sie hat weiches Fell und schaut aufmerksam.",
  //     A2: "Eine niedliche Katze sitzt oder liegt ruhig. Ihr Fell ist weich, und sie schaut aufmerksam.",
  //     B1: "Eine niedliche Katze sitzt oder liegt entspannt. Sie hat weiches Fell und beobachtet aufmerksam ihre Umgebung."
  //   }
  // },
  // {
  //   id: 5,
  //   image: taskImage3,
  //   descriptions: {
  //     A1: "Ein Fuchs liest ein Buch. Er sieht klug und konzentriert aus. Das Bild ist fantasievoll.",
  //     A2: "Ein Fuchs liest ein Buch und wirkt klug und konzentriert. Das Bild ist fantasievoll.",
  //     B1: "Ein Fuchs sitzt da und liest ein Buch. Er wirkt klug und konzentriert, das Bild hat eine fantasievolle Stimmung."
  //   }
  // },
  // {
  //   id: 6,
  //   image: taskImage1,
  //   descriptions: {
  //     A1: "Ein Hund versteckt sich oder schaut schüchtern hervor. Er sieht verspielt oder ängstlich aus.",
  //     A2: "Ein Hund versteckt sich ein wenig oder schaut schüchtern hervor. Er wirkt verspielt oder etwas ängstlich.",
  //     B1: "Ein Hund versteckt sich teilweise und schaut schüchtern hervor. Er wirkt verspielt, vielleicht aber auch etwas ängstlich."
  //   }
  // },
  // {
  //   id: 7,
  //   image: taskImage,
  //   descriptions: {
  //     A1: "Ein Pandabär mit schwarzweißem Fell. Er ist süß und frisst möglicherweise Bambus.",
  //     A2: "Ein süßer Pandabär mit schwarzweißem Fell. Vielleicht frisst er Bambus.",
  //     B1: "Ein Pandabär mit typisch schwarzweißem Fell. Er wirkt niedlich und könnte Bambus fressen."
  //   }
  // },
  // {
  //   id: 8,
  //   image: taskImage0,
  //   descriptions: {
  //     A1: "Ein freundlicher Hund schaut in die Kamera. Er hat ein fröhliches Gesicht und weiches Fell.",
  //     A2: "Ein freundlicher Hund blickt in die Kamera. Sein Gesicht wirkt fröhlich, sein Fell ist weich.",
  //     B1: "Ein freundlicher Hund schaut direkt in die Kamera. Er hat ein fröhliches Gesicht und ein weiches, gepflegtes Fell."
  //   }
  // },
]

const levels = ['A1', 'A2', 'B1']
const selectedLevel = ref(null)

const currentTaskIndex = ref(0)
const input = ref('')
const messages = ref([])
const isLoading = ref(false)
const err = ref('')
const isAnswered = ref(false)

function selectLevel(level) {
  selectedLevel.value = level
}

function getScoreClass(score) {
  if (score >= 8) return 'score-high'
  if (score >= 5) return 'score-medium'
  return 'score-low'
}

const currentImage = computed(() => {
  if (currentTaskIndex.value >= tasks.length) return null
  return tasks[currentTaskIndex.value].image
})

const isFinished = computed(() => currentTaskIndex.value >= tasks.length)

async function sendMessage() {
  if (!input.value.trim()) return
  isLoading.value = true
  err.value = ''
  messages.value.push({role: 'user', content: input.value})

  const userText = input.value
  input.value = ''

  try {
    const task = tasks[currentTaskIndex.value]
    const reference = task?.descriptions?.[selectedLevel.value] || ''
    if (!reference.trim()) {
      err.value = "Нет эталонного описания для выбранного уровня."
      isLoading.value = false
      return
    }
    const res = await $fetch('/api/groq-vision', {
      method: 'POST',
      body: {
        referenceDescription: reference,
        userLevel: selectedLevel.value,
        userMessage: userText,
        userLocale: locale.value
      }
    })
    if (res.data) {
      messages.value.push({
        role: 'assistant',
        isStructured: true,
        score: res.data.score || 0,
        feedback: res.data.feedback || '',
        suggestedAnswer: res.data.suggestedAnswer || '',
        keyCorrections: res.data.keyCorrections || []
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
  const task = tasks[currentTaskIndex.value]
  if (task && !hasReferenceForLevel(task, selectedLevel.value)) {
    err.value = "Для следующего задания нет эталонного описания на выбранном уровне."
  }
}

function restart() {
  currentTaskIndex.value = 0
  messages.value = []
  isAnswered.value = false
  err.value = ''
  selectedLevel.value = null
}
</script>

<template>
  <div class="lobby">
    <Modal
        :visible="showDevModal"
        @close="closeModal"
        :title="t(overlayData.title)"
        :text="t(overlayData.text)"
    />
    <div class="lobby-container">
      <TipsModal
          v-model="showTips"
          :title="t('adjectiveComparisonPage.tipTitle')"
          :tips="tipsData.tips"
      />
      <!-- Level Selection Screen -->
      <div v-if="!selectedLevel">
        <div class="duel__header">
          <button @click="goBack" class="back-button-global" aria-label="Back">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            <span>{{ t('wordDuel.btnBack') }}</span>
          </button>
          <div class="tiips__info-wrapper">
            <button class="btn__tips" @click="tipsModule">
              <img class="tipps__icon" src="../assets/images/Tipps.svg" alt="Tips Icon">
            </button>
            <button class="btn__tips" @click="openModal">
              <img class="duel__question-img" :title="t('hoverTitle.duelInfo')"
                   src="../assets/images/question.svg" alt="Info Icon">
            </button>
          </div>
        </div>

        <div class="mode-toggle-wrapper">
          <div
              class="mode-toggle-option mode-toggle-option--disabled"
              :class="{ 'mode-toggle-option--inactive': mode !== 'online' }"
          >
            🌐 {{ t('wordDuel.online') }}
          </div>
          <div
              class="mode-toggle-option"
              :class="{ 'mode-toggle-option--inactive': mode !== 'local' }"
          >
            👤 {{ t('wordDuel.local') }}
          </div>
          <div class="mode-toggle-slider" :style="{ transform: sliderTransform }"></div>
        </div>

        <div class="main-content-wrapper">
          <div class="level-grid">
            <button
                v-for="level in levels"
                :key="level"
                @click="selectPreLevel(level)"
                class="level-card"
                :class="{ 'level-card--selected': preSelectedLevel === level }">
              <h2 class="card-level-title">{{ level }}</h2>
            </button>
          </div>

          <div class="stats-block">
            <h3>
              {{ t('describePicture.title') }}
            </h3>
            <p class="stats-description">{{ t('describePicture.description') }}</p>
            <button
                @click="startGame"
                class="start-game-button"
            >
              {{ t('describePicture.startBtn') }} ({{ preSelectedLevel }})
            </button>
          </div>
        </div>
      </div>

      <!-- Game Screen -->
      <div v-else class="game-container">
        <div class="duel__header">
          <button @click="goBack" class="back-button-global" aria-label="Back">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            <span>{{ t('wordDuel.btnBack') }}</span>
          </button>
          <span class="badge">{{ t('describePicture.task') }} {{ currentTaskIndex + 1 }} / {{ tasks.length }}</span>
        </div>

        <div v-if="isFinished" class="finish-screen">
          <div class="icon">🎉</div>
          <h2>{{ t('describePicture.finishTitle') }}</h2>
          <p>{{ t('describePicture.finishText') }}</p>
          <button @click="restart" class="btn-primary btn-restart">{{ t('describePicture.restartBtn') }}</button>
        </div>

        <div v-else class="content-wrapper">
          <div class="image-wrapper">
            <div class="image-frame">
              <img :src="currentImage" alt="Task Image"/>
            </div>
          </div>
          <div class="chat-area">
            <div v-if="messages.length === 0" class="placeholder">
              {{ t('describePicture.placeholder') }}
            </div>
            <div class="messages-list">
              <div v-for="(m, i) in messages" :key="i" :class="['message', m.role]">
                <template v-if="m.isStructured">
                  <div class="result-card">
                    <div class="score-section">
                      <div class="score-circle" :class="getScoreClass(m.score)">
                        {{ m.score }}/10
                      </div>
                    </div>
                    <div class="feedback-section">
                      <h4>Feedback:</h4>
                      <p>{{ m.feedback }}</p>
                    </div>
                    <div class="suggested-section">
                      <h4>{{ t('describePicture.suggestedAnswer') }} ({{ selectedLevel }}):</h4>
                      <p class="suggested-text">{{ m.suggestedAnswer }}</p>
                      <SoundBtn :text="m.suggestedAnswer"/>
                    </div>
                    <div class="corrections-section">
                      <h4>{{ t('describePicture.keyCorrections') }}:</h4>
                      <ol>
                        <li v-for="(correction, idx) in m.keyCorrections" :key="idx">
                          {{ correction }}
                        </li>
                      </ol>
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
                  :placeholder="t('describePicture.inputPlaceholder')"
                  :disabled="isLoading"
                  class="main-input"
              />
              <button @click="sendMessage" :disabled="isLoading" class="btn-send">➤</button>
            </template>
            <template v-else>
              <button class="btn-next" @click="nextTask">
                {{ t('describePicture.nextBtn') }} ➡️
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Lobby styles - matching sentence-duel */
.mode-toggle-wrapper {
  width: 320px;
  display: flex;
  background: #fff;
  border-radius: 16px;
  position: relative;
  margin: 2rem auto;
  box-shadow: 2px 2px 0px #1e1e1e;
  border: 3px solid #1e1e1e;
  overflow: hidden;
  padding: 4px;
}

.tipps__icon {
  width: 50px;
}

.tiips__info-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn__tips {
  background: none;
  border: none;
  cursor: pointer;
}

.mode-toggle-option {
  flex: 1;
  text-align: center;
  padding: 10px 5px;
  cursor: pointer;
  color: #fff;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  position: relative;
  transition: color 0.4s cubic-bezier(.38, 1.32, .39, 1);
  user-select: none;
  z-index: 1;
}

.mode-toggle-option--inactive {
  color: #1e1e1e;
}

.mode-toggle-option--disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.mode-toggle-slider {
  pointer-events: none;
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: #1e1e1e;
  border-radius: 12px;
  transition: transform 0.4s cubic-bezier(.38, 1.32, .39, 1);
  z-index: 0;
}

.duel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  max-width: 1200px;
  margin: 0 auto;
  gap: 15px;
}

.back-button-global {
  display: flex;
  align-items: center;
  border: 2px solid #1e1e1e;
  padding: 15px;
  background: #4ade80;
  border-radius: 16px;
  cursor: pointer;
  color: #282626;
  font-size: 1.2rem;
  font-weight: 400;
  font-family: "Nunito", sans-serif;
  box-shadow: 2px 2px 0px #1e1e1e;
  transition: all 0.1s ease-in-out;
}

.duel__question-img {
  width: 70px;
  cursor: pointer;
}

.back-button-global:hover {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #1e1e1e;
}

.back-button-global svg {
  width: 24px;
  height: 24px;
  fill: white;
}

.lobby-container {
  padding: 40px;
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
}

.level-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.level-card {
  background-color: white;
  border: 2px solid #1e1e1e;
  border-radius: 20px;
  padding: 15px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-shadow: 2px 2px 0px #1e1e1e;
}

.level-card:hover:not(:disabled) {
  background-color: #FFD24B;
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0 #1e1e1e;
}

.level-card.level-card--selected {
  background-color: #FFD24B;
  transform: translateY(-2px) scale(1.01);
  box-shadow: 2px 2px 0px #1e1e1e;
  min-width: 120px;
}

.card-level-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  color: #1e1e1e;
}

.main-content-wrapper {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 40px auto 0;
}

.stats-block {
  background-color: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 4px 4px 0 #1e1e1e;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 250px;
}

.stats-block h3 {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 15px;
  color: #1e1e1e;
  line-height: 1.3;
}

.stats-description {
  text-align: center;
  font-size: 1rem;
  color: #666;
  margin-bottom: 0;
  max-width: 400px;
  flex: 1;
  display: flex;
  align-items: center;
}

.start-game-button {
  width: 100%;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #1e1e1e;
  padding: 12px 20px;
  background: #4ade80;
  border-radius: 12px;
  cursor: pointer;
  color: #1e1e1e;
  font-size: 1.4rem;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
  box-shadow: 4px 4px 0px #1e1e1e;
  transition: all 0.1s ease-in-out;
}

.start-game-button:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

/* Game container styles */
.game-container {
  max-width: 600px;
  margin: 0 auto;
}

.game-container .duel__header {
  padding: 0;
  margin-bottom: 20px;
}

.badge {
  background: #FFD24B;
  color: #1e1e1e;
  padding: 8px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  border: 2px solid #1e1e1e;
}

.content-wrapper {
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 20px;
  box-shadow: 4px 4px 0 #1e1e1e;
  overflow: hidden;
}

.finish-screen {
  padding: 60px 20px;
  text-align: center;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 20px;
  box-shadow: 4px 4px 0 #1e1e1e;
}

.finish-screen .icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.finish-screen h2 {
  margin: 0 0 10px;
  color: #1e1e1e;
  font-size: 1.8rem;
}

.finish-screen p {
  color: #666;
  margin-bottom: 30px;
}

.image-wrapper {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.image-frame {
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  background: #f8f8f8;
}

.image-frame img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
}

.chat-area {
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
  padding: 20px;
  background: #fafafa;
  border-top: 2px solid #e0e0e0;
}

.placeholder {
  text-align: center;
  color: #999;
  margin-top: 40px;
  font-size: 1.1rem;
  font-weight: 600;
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
  border-radius: 16px;
  font-size: 15px;
  line-height: 1.5;
  position: relative;
  white-space: pre-wrap;
  border: 2px solid #1e1e1e;
}

.user .bubble {
  background: #FFD24B;
  color: #1e1e1e;
  border-bottom-right-radius: 4px;
}

.assistant .bubble {
  background: #fff;
  color: #1e1e1e;
  border-bottom-left-radius: 4px;
}

.msg-sound {
  margin-right: 8px;
  align-self: flex-end;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.loading {
  display: flex;
  gap: 4px;
  padding: 16px 20px !important;
}

.loading span {
  width: 6px;
  height: 6px;
  background: #1e1e1e;
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
  margin: 0 20px 10px;
  border-radius: 8px;
  border: 2px solid #ef4444;
}

.controls {
  padding: 20px;
  background: white;
  border-top: 2px solid #e0e0e0;
  display: flex;
  gap: 10px;
}

.main-input {
  flex: 1;
  padding: 14px 16px;
  border: 2px solid #1e1e1e;
  border-radius: 12px;
  font-size: 16px;
  font-family: "Nunito", sans-serif;
  outline: none;
  transition: all 0.2s;
}

.main-input:focus {
  box-shadow: 2px 2px 0 #1e1e1e;
}

.btn-send {
  width: 50px;
  background: #4ade80;
  color: #1e1e1e;
  border: 2px solid #1e1e1e;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0 #1e1e1e;
}

.btn-send:hover {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #1e1e1e;
}

.btn-send:disabled {
  background: #ccc;
  box-shadow: none;
}

.btn-next, .btn-restart {
  width: 100%;
  padding: 14px;
  background: #4ade80;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 3px 3px 0 #1e1e1e;
}

.btn-next:hover, .btn-restart:hover {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #1e1e1e;
}

.btn-restart {
  background: #FFD24B;
}

/* Result Card Styles */
.result-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  width: 100%;
  max-width: 100%;
  border: 2px solid #1e1e1e;
}

.score-section {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.score-circle {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  border: 3px solid #1e1e1e;
}

.score-high {
  background: #4ade80;
  color: #1e1e1e;
}

.score-medium {
  background: #FFD24B;
  color: #1e1e1e;
}

.score-low {
  background: #f8d7da;
  color: #721c24;
}

.feedback-section,
.suggested-section,
.corrections-section {
  margin-bottom: 12px;
}

.feedback-section h4,
.suggested-section h4,
.corrections-section h4 {
  margin: 0 0 6px;
  font-size: 14px;
  color: #1e1e1e;
  font-weight: 700;
}

.feedback-section p,
.suggested-section p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}

.suggested-text {
  background: #e8f5e9;
  padding: 10px 12px;
  border-radius: 8px;
  font-weight: 500;
  margin-bottom: 8px !important;
  border: 2px solid #4ade80;
}

.corrections-section ol {
  margin: 0;
  padding-left: 20px;
}

.corrections-section li {
  font-size: 13px;
  color: #555;
  line-height: 1.5;
  margin-bottom: 4px;
}

/* Responsive styles */
@media (max-width: 1024px) {
  .duel__header {
    padding: 0 10px;
  }
}

@media (max-width: 767px) {
  .back-button-global {
    padding: 10px;
    width: 100%;
    justify-content: center;
    font-size: 1.1rem;
    font-weight: 600;
    box-shadow: 2px 2px 0 black;
  }

  .level-card.level-card--selected {
    min-width: 100px;
  }

  .lobby-container {
    padding: 20px;
  }

  .card-level-title {
    text-align: center;
    font-size: 1.4rem;
  }

  .duel__header {
    flex-direction: column;
    max-width: 400px;
  }

  .main-content-wrapper {
    flex-direction: column;
  }

  .level-grid {
    display: flex;
    flex-direction: column;
  }

  .level-card {
    box-shadow: 2px 2px 2px #1e1e1e;
  }

  .level-card.level-card--selected {
    box-shadow: 2px 2px 0px #1e1e1e;
    transform: none;
  }

  .level-card:hover:not(:disabled) {
    box-shadow: 2px 2px 0px #1e1e1e;
    transform: none;
  }

  .start-game-button {
    font-size: 1.2rem;
    padding: 10px;
    box-shadow: 2px 2px 0px #1e1e1e;
  }

  .game-container {
    padding: 0;
  }

  .content-wrapper {
    border-radius: 16px;
  }
}
</style>