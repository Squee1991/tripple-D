<script setup>
import {onMounted, ref} from 'vue'
import {userExamStore} from '~/store/examStore.js'
import {useRouter} from 'vue-router'
import VConsentModal from "../../src/components/V-consentModal.vue";
import {userAuthStore} from "../../store/authStore.js";
import { useHead, useSeoMeta } from '#imports'
import VBackBtn from "~/src/components/V-back-btn.vue";

const { t } = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow'
})

const authStore = userAuthStore()
const showConsentModal = ref(false)
const consentGiven = ref(false)
const router = useRouter()
const examStore = userExamStore()
const showHint = ref(false)
const notAllowed = ref({
  title: t('examIndexPage.notAllowedTitle'),
  btns: [
    {id: 'back', path: '/', value: t('examIndexPage.notAllowedTitle')},
    {id: 'premium', path: '/pay', value: t('examIndexPage.buy')},
  ]
})
const notAllowedPathBtn = (to) => {
  router.push(to)
}

const examLevels = [
  {
    id: 'a1',
    icon: '📘',
    title: t('examLevelCardA1.title'),
    modules: [
      {text: t('examLevelCardA1.textOne')},
      {text: t('examLevelCardA1.textTwo')},
      {text:  t('examLevelCardA1.textThree')},
      {text: t('examLevelCardA1.textFour')}
    ]
  },
  {
    id: 'a2',
    icon: '📗',
    title: t('examLevelCardA2.title'),
    modules: [
      {text: t('examLevelCardA2.textOne')},
      {text: t('examLevelCardA2.textTwo')},
      {text:  t('examLevelCardA2.textThree')},
      {text: t('examLevelCardA2.textFour')}
    ]
  },
  {
    id: 'b1',
    icon: '📙',
    title: t('examLevelCardB1.title'),
    modules: [
      {text: t('examLevelCardB1.textOne')},
      {text: t('examLevelCardB1.textTwo')},
      {text:  t('examLevelCardB1.textThree')},
      {text: t('examLevelCardB1.textFour')}
    ]
  },
  {
    id: 'b2',
    icon: '📕',
    title: t('examLevelCardB2.title'),
    modules: [
      {text: t('examLevelCardB2.textOne')},
      {text: t('examLevelCardB2.textTwo')},
      {text:  t('examLevelCardB2.textThree')},
      {text: t('examLevelCardB2.textFour')}
    ]
  }
]

const attemptToStartExam = (levelId) => {
  if (authStore.voiceConsentGiven) {
    router.push(`/exams/level/${levelId}`)
  } else {
    showConsentModal.value = true
  }
}
const handleConsentGiven = async () => {
  await authStore.setVoiceConsent(true)
  showConsentModal.value = false
  showHint.value = true
  setTimeout(() => showHint.value = false, 10000)
}

onMounted(async () => {
  await authStore.initAuth()
  examStore.loadTopics('/exams/exam-A1.json')
  showConsentModal.value = !authStore.voiceConsentGiven
})
</script>
<template>
  <div class="exam-app-theme"> <div v-if="!authStore.premium" class="exam">
    <transition name="fade">
      <div v-if="showHint" class="exam-hint">
        ℹ️ {{t('examIndexPage.hint')}}
      </div>
    </transition>

    <VConsentModal
        v-if="showConsentModal"
        @consent-given="handleConsentGiven"
        @close="showConsentModal = false"
    />

    <div class="exam__header">
      <VBackBtn class="custom-back-btn"/>
      <div class="exam__title-badge">Тесты</div>
    </div>
    <div class="exam__subtitle">
      <div class="exam__subtitle__left">
        <span>{{t('examIndexPage.choice')}}</span>
        <span class="exam__accent">Lesen</span>
        <span class="exam__accent">Hören</span>
        <span class="exam__accent">Schreiben</span>
        <span class="exam__accent">Sprechen</span>
      </div>
      <div class="exam__subtitle__right">
        <img class="exam__subtitle-icon" src="../../assets/images/exam-results.svg" alt="">
      </div>
    </div>
    <div class="exam__scroll-area">
      <div class="exam__grid">
        <div
            v-for="level in examLevels"
            :key="level.id"
            :class="['exam-card', `card--${level.id}`]"
        >
          <div class="exam-card__header">
            <h2 class="exam-card__title">{{ level.title }}</h2>
          </div>
          <div class="exam-card__body">
            <ul class="exam-card__list">
              <li
                  v-for="item in level.modules"
                  :key="item.text"
                  class="exam-card__item"
              >
                {{ item.text }}
              </li>
            </ul>
            <button
                class="exam-card__button"
                @click="attemptToStartExam(level.id)"
            >
              {{t('examIndexPage.to')}} {{ level.id.toUpperCase() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
    <div v-else class="exam__locked">
      <div class="exam__locked-card">
        <h2 class="exam__locked-title"> {{ notAllowed.title }}</h2>
        <div class="exam__locked-buttons">
          <button
              type="button"
              @click="notAllowedPathBtn(btn.path)"
              v-for="btn in notAllowed.btns"
              :key="btn.id"
              class="locked-btn">
            {{ btn.value }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.exam-app-theme {
  min-height: 100vh;
  color: #fff;
}

.exam {
  font-family: "Nunito", sans-serif;
  max-height: 100dvh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.exam__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px
}

.exam__title-badge {
  margin-left: 15px;
  border-radius: 20px;
  color: #fff;
  font-weight: 900;
  font-size: 23px;
}

.exam__subtitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 15px;
  background: #00c2ff;
  border-radius: 20px;
  margin: 10px;
  border: 3px solid #000;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
}

.exam__subtitle__left {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  text-align: left;
  font-size: 15px;
  color: #fff;
  font-weight: 700;
  line-height: 1.4;
}


.exam__subtitle__right {
  flex: 0 0 140px;
  display: flex;
  justify-content: center;
  align-items: center;
}


.exam__subtitle-icon {
  width: 100px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}


.exam__accent {
  display: inline-block;
  font-weight: 800;
  background: #fff;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 13px;
  color: #1561d3;
  border: 1px solid rgba(0,0,0,0.1);
}


.exam__scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px 120px;
  -webkit-overflow-scrolling: touch;
}

.exam__scroll-area::-webkit-scrollbar {
  width: 4px;
}
.exam__scroll-area::-webkit-scrollbar-thumb {
  background: #7c4dff;
  border-radius: 10px;
}

.exam__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding-top: 10px;
}

.exam-card {
  background-color: var(--menuItemsBg);
  border: 3px solid #000;
  border-radius: 18px;
  display: flex;
  padding: 10px 0;
  flex-direction: column;
  box-shadow: 0 5px 0 #000;
  overflow: hidden;
}

.exam-card__header {
  background: rgba(0,0,0,0.2);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 2px solid #000;
}

.level-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.exam-card__title {
  font-size: 16px;
  font-weight: 900;
  margin: 0;
  color: #fff;
  text-transform: uppercase;
}

.exam-card__body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.exam-card__list {
  margin: 0 0 15px 0;
  padding: 0;
  list-style: none;
}

.exam-card__item {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 5px;
  line-height: 1.2;
}


.exam-card__button {
  border: 2px solid #3b82f6;
  background-color: #3b82f6;
  box-shadow: 0 4px 0 #1d4ed8;
  border-radius: 20px;
  padding: 8px 4px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 900;
  color: #fff;
  width: 100%;
  cursor: pointer;
  text-transform: uppercase;
}

.exam-card__button:active {
  transform: translateY(2px);
}

.card--a1 .exam-card__header { border-bottom-color: #4ade80; }
.card--a2 .exam-card__header { border-bottom-color: #60a5fa; }
.card--b1 .exam-card__header { border-bottom-color: #fbbf24; }
.card--b2 .exam-card__header { border-bottom-color: #f87171; }

.exam__locked {
  height: 100vh;
  display: flex;
  padding: 20px;
  align-items: center;
}

.exam__locked-card {
  width: 100%;
  background: #211d40;
  border: 4px solid #000;
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 8px 0 #000;
}

.exam__locked-title {
  color: #fff;
  font-weight: 900;
  margin-bottom: 20px;
}

.locked-btn {
  width: 100%;
  padding: 14px;
  margin-bottom: 10px;
  border: 3px solid #000;
  border-radius: 14px;
  font-weight: 800;
  background: #120f26;
  color: #fff;
  box-shadow: 0 4px 0 #000;
}

.locked-btn:last-child {
  background: #fbbf24;
  color: #000;
}

.exam-hint {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: #000;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 10px 15px;
  z-index: 100;
  font-weight: 800;
  box-shadow: 0 4px 0 #000;
}
</style>