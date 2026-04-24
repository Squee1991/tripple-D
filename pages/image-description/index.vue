<template>
  <div class="page-container">
    <Modal
        :visible="showDevModal"
        @close="closeModal"
        :title="t(overlayData.title)"
        :img="Description"
        :text="t(overlayData.text)"
    />
    <div class="content-shell">
      <header class="app-header">
        <VBackBtn/>
        <h1 class="header-title">
          <span>{{ t('describePicture.title') }}</span>
        </h1>
        <button class="btn-icon-info" @click="openModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
               stroke="orange" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </header>
      <transition name="fade" mode="out-in">
        <div v-if="viewState === 'topics'" class="view-topics" key="topics">
          <div class="intro-block">
            <p> {{ t('descriptionPage.intro')}}</p>
          </div>
          <div class="topics-flex-container">
            <div v-for="topic in topics" :key="topic.id" class="topic-card-item" @click="selectTopic(topic)">
              <div class="card-top-banner" :style="{ background: topic.gradient || '#ffbe76' }">
                <h3 :style="{ color: topic.textColor || '#1e272e' }">{{ t(topic.label) }}</h3>
              </div>
              <div class="card-body-content">
                <div class="topic-icon">{{ topic.icon }}</div>
                <div class="card-footer-strip">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="viewState === 'level'" class="view-level" key="level">
          <div class="level-header"><h2>{{ t('descriptionPage.level')}}</h2></div>
          <div class="level-options">
            <button v-for="level in levels" :key="level" @click="selectLevel(level)" class="level-card"
                    :class="{ 'active': selectedLevel === level }">
              <div class="level-mark"></div>
              <span class="level-name">{{ level }}</span>
            </button>
          </div>
          <button @click="startGame" class="btn-primary-action">{{ t('nominativ.start')}}</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSeoMeta, useState } from "#imports"
import { useRouter } from 'vue-router'
import Modal from '../../src/components/modal.vue'
import Description from '@/assets/images/reporting.svg'
import { topics } from '@/utils/descriptionImages.js'
import VBackBtn from "~/src/components/V-back-btn.vue";

useSeoMeta({
  robots: 'noindex, nofollow'
})

const router = useRouter()
const { t } = useI18n()

const levels = ['A1', 'A2', 'B1']
const viewState = ref('topics')
const selectedTopic = ref(null)
const selectedLevel = ref('A1')
const showDevModal = ref(false)

const overlayData = ref({ title: "describePicture.rulesTitle", text: "describePicture.rulesText" })

const sessionConfig = useState('sessionConfig', () => ({
  topicId: null,
  level: 'A1'
}))

const openModal = () => { showDevModal.value = true }
const closeModal = () => { showDevModal.value = false }

function selectTopic(topic) {
  selectedTopic.value = topic
  viewState.value = 'level'
}

function selectLevel(level) {
  selectedLevel.value = level
}

function startGame() {
  sessionConfig.value = {
    topicId: selectedTopic.value.id,
    level: selectedLevel.value
  }
  router.push('/image-description/session')
}

function goBack() {
  if (viewState.value === 'level') {
    selectedTopic.value = null
    viewState.value = 'topics'
  } else {
    router.push('/')
  }
}
</script>

<style scoped>

.page-container {
  font-family: "Nunito", sans-serif;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  color: #1e272e;
  height: 100%;
  min-height: 100%;
}

h1, h2, h3, .header-title, .level-name, .btn-primary-action {
  font-family: "Nunito", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--titleColor, #1e272e);
  margin: 0;
}

.content-shell {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 5px 10px 15px 10px;
  flex-shrink: 0;
}

.header-title {
  font-size: 22px;
  font-weight: 900;
  color: var(--titleColor, #1e272e);
  text-shadow: 1px 1px 0px #ffffff;
}

.btn-icon-info {
  background: #f5f5f6;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 14px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  flex-shrink: 0;
}

.btn-icon-info:active {
  transform: translate(2px, 3px);
  box-shadow: 0px 0px 0px #1e272e;
}

.view-topics {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.view-topics::-webkit-scrollbar {
  display: none;
}

.intro-block {
  margin-bottom: 16px;
  text-align: center;
}

.intro-block p {
  font-size: 16px;
  font-weight: 800;
  color: var(--titleColor, #1e272e);
  margin: 0;
  padding: 0 10px;
}

.topics-flex-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
  padding: 20px 15px;
}

.topic-card-item {
  background-color: #ffffff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  display: flex;
  flex-direction: column;
}

.topic-card-item:active {
  transform: translate(3px, 4px);
  box-shadow: 1px 1px 0px #1e272e;
}

.card-top-banner {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 3px solid var(--tabsSlideBorderColor);
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.card-top-banner h3 {
  font-size: 14px;
  font-weight: 900;
  line-height: 1.2;
}

.card-body-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  background-color: #ffffff;
}

.topic-icon {
  font-size: 54px;
  filter: drop-shadow(3px 3px 0px rgba(30, 39, 46, 0.2));
}

.task-count {
  font-size: 14px;
  font-weight: 900;
  font-family: "Nunito", sans-serif;
}

.view-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  max-width: 450px;
  width: 100%;
}

.level-header h2 {
  font-size: 20px;
  text-align: center;
  margin-bottom: 16px;
}

.level-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-bottom: 24px;
}

.level-card {
  padding: 16px 20px;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  background: #ffffff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s, background-color 0.2s;
}

.level-card:active {
  transform: translate(2px, 3px);
}

.level-card.active {
  background: #feca57;
}

.level-mark {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 3px solid #1e272e;
  background: #ffffff;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.level-card.active .level-mark::after {
  content: "";
  width: 12px;
  height: 12px;
  background: #1e272e;
  border-radius: 50%;
}

.level-name {
  font-size: 22px;
  font-weight: 900;
  color: #1e272e;
}

.btn-primary-action {
  display: block;
  width: 100%;
  text-decoration: none;
  background: #3b82f6;
  color: #ffffff;
  padding: 12px;
  border-radius: 24px;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  border: 2px solid #2563eb;
  border-bottom: 6px solid #1d4ed8;
  transition: transform 0.1s;
}

.btn-primary-action:active {
  transform: translate(2px, 3px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 767px) {
  .header-title {
    font-size: 20px;
    text-align: center;
  }
  .intro-block p {
    font-size: 15px;
  }
  .level-header h2 {
    font-size: 18px;
  }
}
</style>