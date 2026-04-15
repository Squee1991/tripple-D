<template>
  <div>
    <div v-if="!authStore.premium" class="exam">
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
        <VBackBtn/>
        <div class="exam__title">Тесты</div>
      </div>
      <p class="exam__subtitle">
        {{t('examIndexPage.choice')}}
        <span class="exam__highlight">Lesen</span>,
        <span class="exam__highlight">Hören</span>,
        <span class="exam__highlight">Schreiben</span>,
        <span class="exam__highlight">Sprechen</span>
      </p>
      <div class="exam__levels">
        <div
            v-for="level in examLevels"
            :key="level.id"
            :class="['exam-card', `exam-card--${level.id}`]"
        >
          <h2 class="exam-card__title">{{ level.icon }} {{ level.title }}</h2>
          <div class="exam__card-inner">
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
    <div v-else class="exam__not-allowed">
      <div class="exam__not-allowed-wrapper">
        <h2 class="exam__not-allowed-title"> {{ notAllowed.title }}</h2>
        <div class="buttons__wrapper">
          <button
              type="button"
              @click="notAllowedPathBtn(btn.path)"
              v-for="btn in notAllowed.btns"
              :key="btn.id"
              class="button__not-allowed">
            {{ btn.value }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

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

definePageMeta({
  layout: 'footerlayout'
})

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

<style scoped>
.exam {
  font-family: "Nunito", sans-serif;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.exam__header {
  display: flex;
  align-items: center;
  padding: calc(env(safe-area-inset-top) + 20px) 20px 15px;
  background: transparent;
  flex-shrink: 0;
  z-index: 10;
}

.exam__card-inner{
  padding: 10px;
  display: flex;
  flex:1;
  justify-content:space-between;
  flex-direction: column;
}

.exam__title {
  flex: 1;
  font-weight: 900;
  font-size: 24px;
  color: var(--titleColor);
  text-transform: uppercase;
  margin-left: 15px;
  letter-spacing: 0.5px;
}

.exam__subtitle {
  font-size: 16px;
  font-weight: 400;
  color: var(--titleColor);
  padding: 0 20px 15px;
  margin: 0;
  line-height: 1.2;
}

.exam__highlight {
  font-weight: 900;
  color: #1e1e1e;
  background: #fef08a;
  padding: 2px 6px;
  border-radius: 6px;
  border: 2px solid #1e1e1e;
  display: inline-block;
  margin: 2px 0;
}

.exam__levels {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 10px 15px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px;
  scrollbar-width: none;
}

.exam__levels::-webkit-scrollbar {
  display: none;
}

.exam-card {
  background-color: #ffffff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 0 #1e1e1e;
  transition: transform 0.1s, box-shadow 0.1s;
  overflow: hidden;
}

.exam-card__title {
  font-size: 1.1rem;
  font-weight: 900;
  margin: 0 0 10px 0;
  color: #1e1e1e;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #bfdbfe;
  padding: 10px;
}

.exam-card__list {
  margin: 0 0 12px 0;
  flex-grow: 1;
  text-align: left;
  padding: 0 10px;
}

.exam-card__item {
  font-size: 0.85rem;
  font-weight: 700;
  color: #4b5563;
  margin-bottom: 4px;
}

.exam-card__button {
  background-color: #fef08a;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  padding: 10px 8px;
  font-family: "Nunito", sans-serif;
  font-size: 0.9rem;
  font-weight: 900;
  color: #1e1e1e;
  width: 100%;
  cursor: pointer;
  box-shadow: 0 3px 0 #1e1e1e;
  transition: all 0.1s;
  text-transform: uppercase;
}

.exam-card__button:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #1e1e1e;
}

.exam-card--a1 .exam-card__button { background-color: #bfdbfe; }
.exam-card--a2 .exam-card__button { background-color: #a7f3d0; }
.exam-card--b1 .exam-card__button { background-color: #fde68a; }
.exam-card--b2 .exam-card__button { background-color: #fecaca; }

.exam__not-allowed {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.exam__not-allowed-wrapper {
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border: 4px solid #1e1e1e;
  border-radius: 20px;
  box-shadow: 0 6px 0 #1e1e1e;
}

.exam__not-allowed-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 900;
  color: #1e1e1e;
  margin: 0 0 20px 0;
}

.buttons__wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.button__not-allowed {
  padding: 14px;
  border: 3px solid #1e1e1e;
  border-radius: 14px;
  width: 100%;
  font-size: 1.1rem;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  background: #ffffff;
  color: #1e1e1e;
  box-shadow: 0 4px 0 #1e1e1e;
  cursor: pointer;
}

.button__not-allowed:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #1e1e1e;
}

.button__not-allowed:last-child {
  background: #fef08a;
}

.exam-hint {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom) + 90px);
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 14px;
  padding: 12px 16px;
  box-shadow: 0 4px 0 #1e1e1e;
  font-size: 0.95rem;
  font-weight: 800;
  z-index: 999;
  width: 90%;
  text-align: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>