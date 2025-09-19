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
      <button type="button" class="back__btn" @click="routeToMain">{{t('examIndexPage.toMain')}}</button>
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
import VConsentModal from "~/src/components/V-consentModal.vue";
import {userAuthStore} from "../store/authStore.js";

const authStore = userAuthStore()
const showConsentModal = ref(false)
const consentGiven = ref(false)
const router = useRouter()
const examStore = userExamStore()
const showHint = ref(false)
const { t } = useI18n()
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

const routeToMain = () => {
  router.push('/')
}

const attemptToStartExam = (levelId) => {
  if (consentGiven.value) {
    router.push(`/exams/level/${levelId}`)
  } else {
    showConsentModal.value = true
  }
}

const handleConsentGiven = () => {
  consentGiven.value = true
  showConsentModal.value = false
  sessionStorage.setItem('voiceConsentGiven', 'true')
  if (consentGiven.value) {
    showHint.value = true
    setTimeout(() => {
      showHint.value = false
    }, 10000)
  }
}

onMounted(() => {
  examStore.loadTopics('/exams/exam-A1.json')
  if (sessionStorage.getItem('voiceConsentGiven') === 'true') {
    consentGiven.value = true
  } else {
    showConsentModal.value = true
  }
})

</script>

<style scoped>
.exam {
  padding: 1rem;
  background-color: #fdf6e3;
  font-family: "Nunito", sans-serif;
  min-height: 100vh;
  text-align: center;
}


.button__not-allowed {
  padding: 10px 15px;
  margin-top: 15px;
  border-radius: 10px;
  width: 100%;
  font-size: 1rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  box-shadow: 3px 3px 0 black;
}

.buttons__wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.exam__not-allowed-wrapper {
  max-width: 380px;
  width: 100%;
  padding: 20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -50%);
  border: 2px solid black;
  border-radius: 20px;
  box-shadow: 4px 4px 0 black;
}

.exam__not-allowed-title {
  text-align: center;
}

.exam__title {
  font-size: 2.4rem;
  margin-bottom: 0.5rem;
}

.exam__subtitle {
  margin-top: 15px;
  font-size: 1.2rem;
  color: #444;
  margin-bottom: 2rem;
}

.exam__highlight {
  font-weight: bold;
  color: #5c3a00;
}

.exam__levels {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.exam-card {
  background-color: #fffbe6;
  border: 3px dashed #aaa;
  border-radius: 15px;
  width: 280px;
  padding: 1.5rem;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.25);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.exam-card:hover {
  transform: scale(1.05);
}

.exam-card__title {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.exam-card__list {
  padding-left: 1.2rem;
  margin-bottom: 1rem;
  flex-grow: 1;
  text-align: left;
}

.exam-card__item {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.exam-card__footer {
  display: flex;
  justify-content: center;
  margin-top: auto;
}

.back__btn {
  background: #4ade80;
  padding: 10px 20px;
  font-size: 1.3rem;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 4px 4px 0 black;
}

@media (min-width: 1024px) {
  .back__btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0px #1e1e1e;

  }
}

.exam-card__button {
  background-color: #ffe58f;
  border: 2px solid transparent;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  color: #333;
  text-decoration: none;
  display: block;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.exam-card__button:hover {
  background-color: #fcd34d;
}

.exam-card--a1 {
  border-color: #60a5fa;
}

.exam-card--a2 {
  border-color: #34d399;
}

.exam-card--b1 {
  border-color: #f59e0b;
}

.exam-card--b2 {
  border-color: #ef4444;
}

@media (max-width: 767px) {
  .exam-card {
    width: 90%
  }
}

.exam-hint {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #fffbe6;
  color: #333;
  border: 2px solid #fcd34d;
  border-radius: 8px;
  padding: 0.8rem 1.2rem;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.25);
  font-size: 0.95rem;
  font-weight: 600;
  z-index: 999;
  font-family: "Nunito", sans-serif;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.6s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>