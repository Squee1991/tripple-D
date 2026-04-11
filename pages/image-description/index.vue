<script setup>
import { ref } from 'vue'
import { useSeoMeta, useState } from "#imports"
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
            <p> {{ t('descriptionPage.intro')}}</p>
          </div>
          <div class="topics-flex-container">
            <div v-for="topic in topics" :key="topic.id" class="topic-card-item" @click="selectTopic(topic)">
              <div class="card-top-banner" :style="{ background: topic.gradient || '#e26a4b' }">
                <h3 :style="{ color: topic.textColor || '#fff' }">{{ t(topic.label) }}</h3>
              </div>
              <div class="card-body-content">
                <div class="topic-icon">{{ topic.icon }}</div>
                <div class="card-footer-strip">
<!--                  <span class="task-count">{{ topic.tasks.length }} КАРТИНОК</span>-->
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
          <button @click="startGame" class="btn-primary-action">{{ t('nominativ.start')}}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h13M12 5l7 7-7 7"/>
            </svg>
          </button>
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
  padding: 12px;
  background-color: var(--bg);
  color: #2b2b2b;
  min-height: 100vh;
}

h1, h2, h3, .header-title, .level-name, .btn-primary-action {
  font-family: "Nunito", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--titleColor);
}

.btn-icon-info {
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

.btn-icon-info:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px 0px #2b2b2b;
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
  margin-bottom: 10px;
  padding: 10px;
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
  grid-template-columns: repeat(auto-fill, minmax(160px, 2fr));
  gap: 12px;
}

.topic-card-item {
  background-color: #fdfaf6;
  border: 4px solid #2b2b2b;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 3px 3px 0px #2b2b2b;
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
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-top-banner h3 {
  margin: 0;
  font-size: .9rem;
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

.task-count {
  font-size: 0.9rem;
  font-weight: 900;
  font-family: "Nunito", sans-serif;
}

.view-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px 20px;
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
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
  background: var(--regionBtnBg);
  color: #fff;
  padding: 10px 40px;
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
  width: 100%;
}

.btn-primary-action:active {
  transform: translate(5px, 5px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

@media (max-width: 767px) {
  .header-title {
    font-size: 1.2rem;
    display: flex;
    justify-content: center;
    text-align: center;
  }
  .intro-block h2 {
    font-size: 1.3rem;
  }
  .level-header h2{
    font-size: 1.2rem;
  }
}
</style>