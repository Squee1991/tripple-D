<script setup>
import {onMounted, ref} from 'vue'
import {userExamStore} from '~/store/examStore.js'
import {useRouter} from 'vue-router'
import VConsentModal from "../../src/components/V-consentModal.vue";
import {userAuthStore} from "../../store/authStore.js";
import {useHead, useSeoMeta} from '#imports'
import VBackBtn from "~/src/components/V-back-btn.vue";

const {t} = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow'
})

const authStore = userAuthStore()
const showConsentModal = ref(false)
const consentGiven = ref(false)
const isPageLoaded = ref(false)
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
      {text: t('examLevelCardA1.textThree')},
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
      {text: t('examLevelCardA2.textThree')},
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
      {text: t('examLevelCardB1.textThree')},
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
      {text: t('examLevelCardB2.textThree')},
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
  isPageLoaded.value = true
  await authStore.initAuth()
  examStore.loadTopics('/exams/exam-A1.json')
  showConsentModal.value = !authStore.voiceConsentGiven
})
</script>

<template>
  <div class="exam-app-theme">
    <div class="exam">
      <transition name="fade">
        <div v-if="showHint" class="exam-hint">
          ℹ️ {{ t('examIndexPage.hint') }}
        </div>
      </transition>
      <VConsentModal
          v-if="showConsentModal"
          @consent-given="handleConsentGiven"
          @close="showConsentModal = false"
      />
      <div class="exam__header">
        <VBackBtn class="custom-back-btn"/>
        <div class="exam__title-badge">{{ t('nav.tests')}}</div>
      </div>
      <Transition name="menu-appear" appear>
        <div v-if="isPageLoaded" class="exam__scroll-area">
          <div class="exam__subtitle-wrapper">
            <div class="exam__subtitle">
              <div class="exam__subtitle__left">
                <span class="bannerText">{{ t('examIndexPage.choice') }}</span>
                <span class="exam__accent">Lesen</span>
                <span class="exam__accent">Hören</span>
                <span class="exam__accent">Schreiben</span>
                <span class="exam__accent">Sprechen</span>
              </div>
              <div class="exam__subtitle__right">
                <img class="exam__subtitle-icon" src="../../assets/images/exam-results.svg" alt="">
              </div>
            </div>
          </div>
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
                  {{ t('examIndexPage.to') }} {{ level.id.toUpperCase() }}
                </button>
              </div>
            </div>
          </div>

        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.exam-app-theme {
  max-height: 100dvh;
  min-height: 100dvh;
  color: #fff;
  background-color: var(--bg);
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
  padding: 5px 10px 15px 10px;
}

.exam__title-badge {
  margin-left: 15px;
  border-radius: 20px;
  color: var(--title);
  font-weight: 900;
  font-size: 24px;
  text-shadow: 0 1px var(--title);
}

.exam__scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 120px;
  -webkit-overflow-scrolling: touch;
}

.exam__scroll-area::-webkit-scrollbar {
  display: none;
}

.exam__subtitle-wrapper {
  padding: 0 15px;
}

.exam__subtitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1),
  0 4px 0 rgb(0, 150, 200);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3),
  inset 0 -2px 4px rgba(0, 0, 0, 0.1),
  0 6px 0 rgb(0, 160, 220);
  background: #00c2ff;
  border-radius: 20px;
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
  flex: 0 0 110px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.exam__subtitle-icon {
  width: 90px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.exam__accent {
  display: inline-block;
  font-weight: 800;
  background: #fff;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 13px;
  color: #1561d3;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.exam__grid {
  display: flex;
  flex-direction: row;
  gap: 20px;
  padding: 20px 15px 30px 15px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.exam__grid::-webkit-scrollbar {
  display: none;
}

.exam-card {
  background-color: var(--menuItemsBg);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  overflow: hidden;
  flex: 0 0 80%;
  max-width: 320px;
  scroll-snap-align: center;
}

.exam-card__header {
  background: rgba(0, 0, 0, 0.05);
  padding: 16px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 3px solid #000;
}

.exam-card__title {
  font-size: 18px;
  font-weight: 900;
  margin: 0;
  color: var(--titleColor);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bannerText {
  font-size: 17px;
  font-weight: 600;
}

.exam-card__body {
  padding: 30px 25px;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}

.exam-card__list {
  margin: 0 0 20px 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exam-card__item {
  font-size: 15px;
  font-weight: 700;
  color: #7c8ba0;
  margin: 0;
  line-height: 1.4;
}

.exam-card__button {
  border: none;
  background-color: #3b82f6;
  box-shadow: 0 4px 0 #000;
  border-radius: 50px;
  padding: 14px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 900;
  color: #fff;
  width: 100%;
  cursor: pointer;
  text-transform: uppercase;
  transition: transform 0.1s, box-shadow 0.1s;
  margin-top: auto;
}

.exam-card__button:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 #000;
}

.card--a1 .exam-card__header {
  border-bottom-color: #4ade80;
}

.card--a2 .exam-card__header {
  border-bottom-color: #60a5fa;
}

.card--b1 .exam-card__header {
  border-bottom-color: #fbbf24;
}

.card--b2 .exam-card__header {
  border-bottom-color: #f87171;
}

.card--a1 .exam-card__button {
  background-color: #4ade80;
  box-shadow: 0 5px 0 #31af5f;
}

.card--a2 .exam-card__button {
  background-color: #60a5fa;
  box-shadow: 0 5px 0 #447ec5;
}

.card--b1 .exam-card__button {
  background-color: #c0962a;
  box-shadow: 0 5px 0 #a17d20;
}

.card--b2 .exam-card__button {
  background-color: #f87171;
  box-shadow: 0 5px 0 #c54d4d;
}

.exam-hint {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: #000;
  border: 3px solid #000;
  border-radius: 16px;
  padding: 12px 20px;
  z-index: 100;
  font-weight: 800;
  box-shadow: 0 4px 0 #000;
  text-align: center;
  width: 90%;
  max-width: 300px;
}

.menu-appear-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease-out;
}

.menu-appear-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>