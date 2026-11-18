<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {userExamStore} from '~/store/examStore.js'
import {useRouter} from 'vue-router'
import {userAuthStore} from "../../store/authStore.js";
import {useHead, useSeoMeta} from '#imports'
import VBackBtn from "~/src/components/V-back-btn.vue";
import {examThemeLabel} from "~/utils/examThemes.js";

const {t} = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow'
})

const authStore = userAuthStore()
const isPageLoaded = ref(false)
const router = useRouter()
const examStore = userExamStore()
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

// выбор темы: у каждого уровня несколько тематических вариантов теста
const showThemePicker = ref(false)
const loadingThemes = ref(false)
const selectedLevelId = ref('')
const availableExamsList = ref([])

// экран выбора на весь экран: системная кнопка «назад» закрывает его, а не уходит со страницы
const openThemePicker = () => {
  showThemePicker.value = true
  window.history.pushState({examThemePicker: true}, '')
}

const closeThemePicker = () => {
  if (showThemePicker.value) window.history.back()
}

const onPopState = () => {
  showThemePicker.value = false
}

const onLevelSelect = async (levelId) => {
  selectedLevelId.value = levelId
  loadingThemes.value = true
  openThemePicker()
  try {
    const data = await $fetch(`/exams/exam-${levelId.toUpperCase()}.json`)
    if (Array.isArray(data?.exams) && data.exams.length) {
      availableExamsList.value = data.exams
      return
    }
    throw new Error('no themes')
  } catch {
    showThemePicker.value = false
    router.replace(`/exams/level/${levelId}`)
  } finally {
    loadingThemes.value = false
  }
}

const startSpecificExam = (examId) => {
  showThemePicker.value = false
  // replace() убирает запись экрана выбора из истории: «назад» из теста ведёт к списку уровней
  router.replace(`/exams/level/${selectedLevelId.value}?examId=${examId}`)
}

const attemptToStartExam = (levelId) => {
  onLevelSelect(levelId)
}

onMounted(async () => {
  window.addEventListener('popstate', onPopState)
  isPageLoaded.value = true
  await authStore.initAuth()
  examStore.loadTopics('/exams/exam-A1.json')
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', onPopState)
})
</script>

<template>
  <div class="exam-app-theme">
    <div class="exam">
      <Transition name="picker-slide">
        <div v-if="showThemePicker" :class="['theme-picker', `card--${selectedLevelId}`]">
          <div class="picker-header">
            <button class="btn-icon-back" :aria-label="t('plExam.chooseTheme')" @click="closeThemePicker">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                   stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div class="picker-title">{{ t('plExam.chooseTheme') }}</div>
            <span class="picker-level">{{ selectedLevelId.toUpperCase() }}</span>
          </div>
          <div class="picker-body">
            <div v-if="loadingThemes" class="picker-loader">{{ t('plExam.loadingThemes') }}</div>
            <div v-else class="picker-grid">
              <button
                  v-for="(exam, index) in availableExamsList"
                  :key="exam.exam_id"
                  class="picker-tile"
                  :style="{ animationDelay: `${index * 40}ms` }"
                  :data-track="`exam_theme_${selectedLevelId}_${exam.exam_id}`"
                  @click="startSpecificExam(exam.exam_id)"
              >
                <!-- яркая карточка: у каждой темы свой цвет, иконка в белом круге -->
                <span class="picker-tile-icon">{{ exam.icon || '📝' }}</span>
                <span class="picker-tile-theme">{{ examThemeLabel(t, exam.theme) }}</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
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

/* полноэкранный выбор темы; цвет уровня берётся из card--a1 … card--b2 на корне */
.theme-picker.card--a1 { --level-color: #4ade80; }
.theme-picker.card--a2 { --level-color: #60a5fa; }
.theme-picker.card--b1 { --level-color: #c0962a; }
.theme-picker.card--b2 { --level-color: #f87171; }

.theme-picker {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-sizing: border-box;
  background-color: var(--bg);
  font-family: "Nunito", sans-serif;
}

.picker-header {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  /* на широких экранах шапка по ширине сетки тем (560px + отступы), а не на весь экран */
  max-width: 590px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 10px 10px 15px 10px;
}

.btn-icon-back {
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
  padding: 0;
}

.btn-icon-back:active {
  transform: translate(2px, 3px);
  box-shadow: 0px 0px 0px #1e272e;
}

[dir="rtl"] .btn-icon-back svg {
  transform: scaleX(-1);
}

.picker-title {
  flex: 1;
  color: var(--title);
  font-weight: 900;
  font-size: 22px;
  line-height: 1.15;
  text-shadow: 0 1px var(--title);
}

.picker-level {
  flex: 0 0 auto;
  padding: 4px 14px;
  border-radius: 50px;
  background: var(--level-color);
  color: #fff;
  font-size: 15px;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.picker-body {
  flex: 1;
  overflow-y: auto;
  padding: 5px 15px calc(30px + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling: touch;
}

.picker-body::-webkit-scrollbar {
  display: none;
}

.picker-loader {
  text-align: center;
  padding: 40px 20px;
  font-weight: 700;
  color: var(--title);
}

.picker-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  max-width: 560px;
  margin: 0 auto;
}

/* карточка темы: яркая заливка своим цветом, белый текст, снизу объёмная толщина, при нажатии проседает.
   Цвета идут по кругу, как у плиток модулей на стартовом экране теста */
.picker-tile {
  --tile: #3b82f6;
  --tile-light: #60a5fa;
  --tile-dark: #1d4ed8;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 128px;
  padding: 16px 10px 14px;
  border: 2px solid color-mix(in srgb, var(--tile-light) 65%, #fff);
  border-radius: 20px;
  background: linear-gradient(180deg, var(--tile-light) 0%, var(--tile) 100%);
  box-shadow: 0 5px 0 var(--tile-dark), 0 8px 14px rgba(0, 0, 0, 0.25);
  font-family: inherit;
  cursor: pointer;
  opacity: 0;
  /* появление двигает отдельное свойство translate, чтобы не мешать transform при нажатии */
  animation: picker-tile-in 0.3s ease forwards;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  -webkit-tap-highlight-color: transparent;
}

.picker-tile:nth-child(8n + 1) { --tile: #3b82f6; --tile-light: #60a5fa; --tile-dark: #1d4ed8; }
.picker-tile:nth-child(8n + 2) { --tile: #ec4899; --tile-light: #f472b6; --tile-dark: #be185d; }
.picker-tile:nth-child(8n + 3) { --tile: #16a34a; --tile-light: #22c55e; --tile-dark: #15803d; }
.picker-tile:nth-child(8n + 4) { --tile: #f59e0b; --tile-light: #fbbf24; --tile-dark: #b45309; }
.picker-tile:nth-child(8n + 5) { --tile: #8b5cf6; --tile-light: #a78bfa; --tile-dark: #6d28d9; }
.picker-tile:nth-child(8n + 6) { --tile: #0891b2; --tile-light: #22d3ee; --tile-dark: #0e7490; }
.picker-tile:nth-child(8n + 7) { --tile: #ef4444; --tile-light: #f87171; --tile-dark: #b91c1c; }
.picker-tile:nth-child(8n + 8) { --tile: #ea580c; --tile-light: #fb923c; --tile-dark: #c2410c; }

.picker-tile:active {
  transform: translateY(5px);
  box-shadow: 0 0 0 var(--tile-dark), 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* иконка в белом круге */
.picker-tile-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 3px 0 var(--tile-dark);
  font-size: 30px;
  line-height: 1;
}

.picker-tile-theme {
  font-size: 14px;
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
  color: #fff;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
}

@keyframes picker-tile-in {
  from {
    opacity: 0;
    translate: 0 10px;
  }
  to {
    opacity: 1;
    translate: 0 0;
  }
}

.picker-slide-enter-active,
.picker-slide-leave-active {
  transition: transform 0.28s ease, opacity 0.28s ease;
}

.picker-slide-enter-from,
.picker-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .picker-tile {
    animation: none;
    opacity: 1;
  }
}

.menu-appear-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease-out;
}

.menu-appear-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>