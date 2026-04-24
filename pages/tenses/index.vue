<template>
  <div class="verb-types-page" :class="{ 'content-is-active': isContentVisible }">
    <div v-if="showTips" class="tips__overlay" @click.self="showTips = false">
      <div class="tips__content">
        <button class="tips__close" @click="showTips = false">×</button>
        <h2 class="tipps__title">{{ t('modalVerbsTipsTitle.tipsTitle') }}</h2>
        <ul class="tips__list">
          <li v-for="tip in activeTipps" :key="tip.text" class="tips__item">
            <div class="tips__text" v-html="parseTip(tip.text)"></div>
          </li>
        </ul>
      </div>
    </div>
    <div class="sidebar">
      <div class="sidebar__header">
        <VBackBtn/>
        <h2 class="sidebar__title">{{ t('tenses.times') }}</h2>
      </div>
      <ul class="sidebar__list">
        <li
            v-for="item in topics"
            :key="item.id"
            :class="['sidebar__item', { 'sidebar__item--active': topic === item.id }]"
        >
          <button class="sidebar__button" @click="selectTopic(item.id)">
            <span>{{ item.title }}</span>
            <img class="sidebar__next-icon" src="../../assets/images/next.svg" alt="arrow">
          </button>
        </li>
      </ul>
    </div>
    <div class="content" v-if="currentTopicData">
      <header class="content__header">
        <button v-if="isMobileLayout" @click="closeContent" class="btn-icon-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="#374151" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 class="content__title"> {{ currentTopicData.title }}</h1>
      </header>
      <div class="content__body">
        <div class="content__main-column">
          <section
              v-if="currentTopicData.contentBlocks[0] && currentTopicData.contentBlocks[0].type === 'rule'"
              class="info-section"
          >
            <div class="info__wrapper">
              <h3 class="info-section__title">{{ currentTopicData.contentBlocks[0].title }}</h3>
              <button
                  :title="t('hoverTitle.tips')"
                  v-if="currentTopicData.tips"
                  class="info__icon-tips"
                  ref="tipRef"
                  @click="openTips(currentTopicData.tips)"
              ></button>
            </div>
            <p class="info-section__description">{{ currentTopicData.contentBlocks[0].content }}</p>
          </section>
          <div v-for="(block, index) in currentTopicData.contentBlocks.slice(1)" :key="index">
            <section v-if="block.type === 'table'" class="info-section">
              <h3 class="info-section__title">{{ block.title }}</h3>
              <table class="declension-table">
                <thead>
                <tr>
                  <th>{{ t('verbTypeCategorySecond.face') }}</th>
                  <th>{{ t('verbTypeCategorySecond.form') }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="row in block.content" :key="row.person">
                  <td><strong>{{ row.person }}</strong></td>
                  <td v-html="row.form"></td>
                </tr>
                </tbody>
              </table>
            </section>
            <section v-else-if="block.type === 'subheading'" class="info-section">
              <h3 class="info-section__subheading">{{ block.title }}</h3>
            </section>
            <section v-else-if="block.type === 'rules'" class="info-section">
              <ul class="rules-list">
                <li v-for="(rule, i) in block.content" :key="i" class="rules-item">
                  {{ rule }}
                </li>
              </ul>
            </section>
            <section v-else-if="block.type === 'examples'" class="info-section examples-container">
              <div v-for="(example, exIndex) in block.content" :key="exIndex" class="example">
                <div class="example__de-text">
                  <p class="example__sentence" v-html="example.sentence"></p>
                  <SoundBtn :text="example.sentence"/>
                </div>
                <span class="example__translation">{{ example.translation }}</span>
              </div>
            </section>
          </div>
        </div>
        <div class="practice-area">
          <p class="practice-area__description">{{ currentTopicData.practice.description }}</p>
          <NuxtLink :to="`/tenses/${currentTopicData.id}`" class="practice-area__button">
            {{ currentTopicData.practice.buttonText }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useHead, useSeoMeta} from '#imports'
import {useRoute} from 'vue-router'
import {ref, computed, onMounted, onUnmounted, watch, nextTick} from 'vue'
import {useRouter} from 'vue-router'
import Lottie from 'lottie-web'
import TipIcon from '../../assets/animation/info.json'
import SoundBtn from '../../src/components/soundBtn.vue'
import VBackBtn from "~/src/components/V-back-btn.vue";

const {t} = useI18n()
const router = useRouter()
const topic = ref('presens')
const isContentVisible = ref(false)
const isMobileLayout = ref(false)
const showTips = ref(false)
const activeTipps = ref([])
const tipRef = ref(null)
let lottieInstance = null

useSeoMeta({ robots: 'noindex, nofollow' })

const selectTopic = (id) => {
  topic.value = id
  if (isMobileLayout.value) isContentVisible.value = true
}
const backToMenu = () => router.push('/')
const closeContent = () => { isContentVisible.value = false }
const parseTip = (text) => {
  return text.replace(/'([^']+)'/g, (_, key) => {
    try { return t(key) } catch { return key }
  })
}

const topics = [
  {
    id: 'presens', title: 'Präsens',
    tips: [{text: "'prasensTips.first'"}, {text: "'prasensTips.second'"}, {text: "'prasensTips.third'"}, {text: "'prasensTips.fourth'"}],
    contentBlocks: [
      {type: 'rule', title: t('tenses.howToDo'), content: t('tensesPrasens.howToDo')},
      {type: 'subheading', title: t('tenses.howToUse')},
      {type: 'rules', content: [t('tensesPrasens.howToUseFirst'), t('tensesPrasens.howToUseSecond'), t('tensesPrasens.howToUseThird')]},
      {type: 'subheading', title: t('tenses.examples')},
      {type: 'examples', content: [
          {sentence: 'Ich <b>lerne</b> jeden Tag Deutsch.', translation: t('tensesPrasens.example')},
          {sentence: 'Er <b>spielt</b> Fußball.', translation: t('tensesPrasens.exampleTwo')}
        ]}
    ],
    practice: { title: t('tensesPrasens.questTitle'), description: t('tensesPrasens.explain'), buttonText: t('tenses.begin') }
  },
  {
    id: 'perfect', title: 'Perfekt',
    tips: [{text: "'perfectTips.first'"}, {text: "'perfectTips.second'"}, {text: "'perfectTips.third'"}, {text: "'perfectTips.fourth'"}, {text: "'perfectTips.fifth'"}, {text: "'perfectTips.sixth'"}],
    contentBlocks: [
      {type: 'rule', title: t('tenses.howToDo'), content: 'haben / sein + Partizip II'},
      {type: 'subheading', title: t('tenses.howToUse')},
      {type: 'rules', content: [t('perfect.howToUseFirst'), t('perfect.howToUseSecond')]},
      {type: 'subheading', title: t('tenses.examples')},
      {type: 'examples', content: [
          {sentence: 'Sie <b>hat</b> ein Buch <b>gelesen</b>.', translation: t('perfect.example')},
          {sentence: 'Wir <b>sind</b> ins Kino <b>gegangen</b>.', translation: t('perfect.exampleTwo')}
        ]}
    ],
    practice: { title: t('perfect.choose'), description: t('perfect.explain'), buttonText: t('tenses.begin') }
  },
  {
    id: 'futurOne', title: 'Futur I',
    tips: [{text: t('futurOne.tipOne')}, {text: t('futurOne.tipTwo')}, {text: t('futurOne.tipThree')}, {text: t('futurOne.tipFour')}, {text: t('futurOne.tipFive')}, {text: t('futurOne.tipSix')}],
    contentBlocks: [
      {type: 'rule', title: t('futurOne.howToDoTitle'), content: t('futurOne.howToDoExample')},
      {type: 'subheading', title: t('futurOne.howToUseTitle')},
      {type: 'rules', content: [t('futurOne.howToUseFirstExample'), t('futurOne.howToUseSecondExample')]},
      {type: 'subheading', title: t('futurOne.example')},
      {type: 'examples', content: [
          {sentence: 'Ich <b>werde</b> morgen <b>lernen</b>.', translation: t('futurOne.translateOne')},
          {sentence: 'Er <b>wird</b> bald <b>kommen</b>.', translation: t('futurOne.translateTwo')},
          {sentence: 'Wir <b>werden</b> nicht <b>schlafen</b>.', translation: t('futurOne.translateThree')}
        ]},
      {type: 'table', title: t('futurOne.tableTitle'), content: [
          {person: 'ich', form: 'werde'}, {person: 'du', form: 'wirst'}, {person: 'er/sie/es', form: 'wird'},
          {person: 'wir', form: 'werden'}, {person: 'ihr', form: 'werdet'}, {person: 'sie/Sie', form: 'werden'}
        ]}
    ],
    practice: { title: 'Futur I', description: t('futurOne.practiceDesc'), buttonText: t('futurOne.begin') }
  },
  {
    id: 'prateritum', title: 'Präteritum',
    tips: [{text: "'prateritumTips.first'"}, {text: "'prateritumTips.second'"}, {text: "'prateritumTips.third'"}, {text: "'prateritumTips.fourth'"}, {text: "'prateritumTips.fifth'"}],
    contentBlocks: [
      {type: 'rule', title: t('tenses.howToDo'), content: t('präteritum.howToDo')},
      {type: 'subheading', title: t('tenses.howToUse')},
      {type: 'rules', content: [t('präteritum.howToUseFirst'), t('präteritum.howToUseSecond')]},
      {type: 'subheading', title: t('tenses.examples')},
      {type: 'examples', content: [
          {sentence: 'Die Prinzessin <b>lebte</b> in einem Schloss.', translation: t('präteritum.example')},
          {sentence: 'Als Kind <b>las</b> ich sehr gern.', translation: t('präteritum.exampleTwo')}
        ]}
    ],
    practice: { title: t('präteritum.choose'), description: t('präteritum.explain'), buttonText: t('tenses.begin') }
  },
  {
    id: 'plusquamperfect', title: 'Plusquamperfekt',
    tips: [{text: "'plusquamperfekt.first'"}, {text: "'plusquamperfekt.second'"}, {text: "'plusquamperfekt.third'"}, {text: "'plusquamperfekt.fourth'"}, {text: "'plusquamperfekt.fifth'"}],
    contentBlocks: [
      {type: 'rule', title: t('tenses.howToDo'), content: 'hatten / waren + Partizip II'},
      {type: 'subheading', title: t('tenses.howToUse')},
      {type: 'rules', content: [t('pqPerfect.howToUseFirst'), t('pqPerfect.howToUseSecond')]},
      {type: 'subheading', title: t('tenses.examples')},
      {type: 'examples', content: [
          {sentence: 'Er <b>hatte</b> schon <b>gegessen</b>, als ich ankam.', translation: t('pqPerfect.example')},
          {sentence: 'Nachdem sie die Arbeit <b>beendet hatte</b>, ging sie nach Hause.', translation: t('pqPerfect.exampleTwo')}
        ]}
    ],
    practice: { title: t('pqPerfect.choose'), description: t('pqPerfect.explain'), buttonText: t('tenses.begin') }
  }
]
const currentTopicData = computed(() => topics.find((t) => t.id === topic.value))

const openTips = (tipps) => { activeTipps.value = tipps; showTips.value = true }
const initLottieIcon = async () => {
  await nextTick()
  if (lottieInstance) lottieInstance.destroy()
  if (tipRef.value) {
    lottieInstance = Lottie.loadAnimation({
      container: tipRef.value, renderer: 'svg', loop: false, autoplay: true, animationData: TipIcon
    })
  }
}

const checkScreenSize = () => {
  isMobileLayout.value = window.innerWidth <= 767
  if (!isMobileLayout.value) isContentVisible.value = false
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  initLottieIcon()
})
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  if (lottieInstance) lottieInstance.destroy()
})
watch(currentTopicData, initLottieIcon)

</script>

<style scoped>

.verb-types-page {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: "Nunito", sans-serif;
  background: #f7f9fc;
  box-sizing: border-box;
}

::-webkit-scrollbar {
  display: none;
}
* {
  -ms-overflow-style: none;
  scrollbar-width: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.sidebar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  overflow-y: auto;
  padding-bottom: 20px;
}

.sidebar__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  background: var(--bg);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  flex-shrink: 0;
}

.sidebar__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--titleColor);
  margin-left: 16px;
  margin-top: 0;
  margin-bottom: 0;
  text-shadow: 0 1px var(--titleColor);
}

.sidebar__list {
  list-style: none;
  padding: 15px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar__button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 15px;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  border-radius: 20px;
  cursor: pointer;
  font-weight: 800;
  font-size: 16px;
  color: var(--titleColor);
  transition: all 0.1s ease-out;
}

.sidebar__next-icon {
  width: 18px;
}

.content {
  position: absolute;
  inset: 0;
  background: #ffffff;
  z-index: 50;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.verb-types-page.content-is-active .content {
  transform: translateX(0);
}

.content__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  background: var(--bg);
  border-bottom: 2px solid #e5e7eb;
  flex-shrink: 0;
}

.content__title {
  color: var(--titleColor);
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 0 16px;
}

.btn-icon-back {
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

.content__body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px;
  background: var(--bg);
}

.content__main-column {
  flex-grow: 1;
  padding-bottom: 20px;
}

.info-section {
  margin-bottom: 24px;
}

.info__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.info-section__title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--titleColor);
  margin: 0;
}

.info__icon-tips {
  width: 50px;
  height: 50px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 0 #e5e7eb;
  cursor: pointer;
  transition: all 0.1s;
}

.info__icon-tips:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 #e5e7eb;
}

.info-section__description {
  font-size: 1.15rem;
  color: #4b5563;
  line-height: 1.5;
  background: #ffffff;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}

.info-section__subheading {
  font-size: 1.25rem;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 12px;
}

.rules-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.rules-item {
  position: relative;
  margin-bottom: 12px;
  padding-left: 24px;
  color: var(--titleColor);
  font-size: 1.1rem;
  line-height: 1.4;
}

.rules-item::before {
  content: "•";
  position: absolute;
  left: 4px;
  color: #60a5fa;
  font-weight: bold;
  font-size: 1.5rem;
  line-height: 1;
}

.example {
  background: #ffffff;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  position: relative;
  overflow: hidden;
  margin-bottom: 16px;
}

.example::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
}
.example:nth-child(4n+1)::before { background: #ffcc33; }
.example:nth-child(4n+2)::before { background: #4ade80; }
.example:nth-child(4n+3)::before { background: #60a5fa; }
.example:nth-child(4n+4)::before { background: #f472b6; }

.example__de-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-left: 8px;
}

.example__sentence {
  margin: 0;
  font-size: 1.2rem;
  color: #374151;
  font-weight: 700;
}

.example__translation {
  display: block;
  color: #9ca3af;
  font-size: 1rem;
  padding-left: 8px;
}

.declension-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}

.declension-table th {
  background: #ffd166;
  padding: 16px;
  font-weight: 800;
  font-size: 1.1rem;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  text-align: center;
}

.declension-table td {
  padding: 14px;
  background: #ffffff;
  border-bottom: 2px solid #e5e7eb;
  color: #4b5563;
  font-size: 1.1rem;
  text-align: center;
}

.declension-table tr:last-child td {
  border-bottom: none;
}

.declension-table td:first-child {
  background: #f9fafb;
  font-weight: 700;
  border-right: 2px solid #e5e7eb;
}

.practice-area {
  padding: 16px 0 0 0;
  margin-top: auto;
  flex-shrink: 0;
  text-align: center;
}

.practice-area__title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--titleColor);
  margin: 0 0 8px 0;
}

.practice-area__description {
  font-size: 1rem;
  color: #9ca3af;
  margin: 0 0 16px 0;
}

.practice-area__button {
  display: block;
  width: 100%;
  text-decoration: none;
  background: #3b82f6;
  color: #ffffff;
  padding: 18px;
  border-radius: 24px;
  font-size: 1.3rem;
  font-weight: 800;
  text-align: center;
  border: 2px solid #2563eb;
  border-bottom: 6px solid #1d4ed8;
  transition: transform 0.1s;
}

.tips__overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.tips__content {
  position: relative;
  background: #ffffff;
  padding: 20px 15px 15px 15px;
  border-radius: 28px;
  width: 100%;
  max-width: 400px;
  max-height: 85%;
  overflow-y: auto;
  border: 2px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.tips__close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ef4444;
  color: #fff;
  border: 3px solid #ffffff;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.5rem;
  line-height: 1;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
  z-index: 2;
}

.tipps__title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  color: #374151;
  padding-right: 40px;
}

.tips__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips__text {
  font-size: 1rem;
  padding: 10px;
  background: #f0fdf4;
  color: #166534;
  border-radius: 16px;
  margin-bottom: 12px;
  line-height: 1.4;
  border: 2px solid #bbf7d0;
}

@media (min-width: 768px) {
  .verb-types-page {
    flex-direction: row;
  }
  .sidebar {
    width: 350px;
    border-right: 2px solid #e5e7eb;
  }
  .content {
    position: relative;
    transform: none !important;
  }
  .btn-icon-back {
    display: none;
  }
  .content__body {
    flex-direction: row;
    padding: 30px;
  }
  .content__main-column {
    width: 60%;
    padding-right: 30px;
    border-right: 2px dashed #e5e7eb;
  }
  .practice-area {
    width: 40%;
    padding-left: 30px;
    margin-top: 0;
    justify-content: center;
  }
}
</style>