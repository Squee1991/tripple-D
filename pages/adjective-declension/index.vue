<template>
  <div class="declension-page" :class="{ 'content-is-active': isContentVisible }">
    <VTips
        v-model="showTips"
        :title="t('adjectiveComparisonPage.tipTitle')"
        :tips="currentTopicData?.tips"
    />
    <div class="sidebar">
      <div class="sidebar__header">
        <VBackBtn/>
        <h2 class="sidebar__title">{{ t('adjectiveDeclensionPage.sideBarTitle') }}</h2>
      </div>
      <ul class="sidebar__list">
        <li
            v-for="item in topics"
            :key="item.id"
            :class="['sidebar__item', { 'sidebar__item--active': topic === item.id }]"
        >
          <button class="sidebar__button" @click="selectTopic(item.id)">
            <span>{{ item.title }}</span>
            <VArrowNav/>
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
        <h1 class="content__title">{{ currentTopicData.title }}</h1>
      </header>
      <div class="content__body">
        <div class="content__main-column">
          <section class="info-section">
            <div class="info__wrapper">
              <h3 class="info-section__title">{{ t('adjectiveDeclensionPage.ruleTitle') }}</h3>
              <button :title="t('hoverTitle.tips')"
                      v-if="currentTopicData.tips"
                      class="info__icon-tips"
                      ref="tipRef"
                      @click="openTips(currentTopicData.tips)"
              ></button>
            </div>
            <p class="info-section__description">
              {{ currentTopicData.rule }}
            </p>
          </section>
          <section class="info-section">
            <h3 class="info-section__title">{{ t('adjectiveDeclensionPage.tableTitle') }}</h3>
            <table class="declension-table">
              <thead>
              <tr>
                <th>{{ t('adjectiveDeclensionPage.case') }}</th>
                <th>{{ t('adjectiveDeclensionPage.m') }}</th>
                <th>{{ t('adjectiveDeclensionPage.w') }}</th>
                <th>{{ t('adjectiveDeclensionPage.it') }}</th>
                <th v-if="currentTopicData.tableData[0].pl !== undefined">{{ t('adjectiveDeclensionPage.plural') }}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in currentTopicData.tableData" :key="row.case">
                <td><strong>{{ row.case }}</strong></td>
                <td v-html="row.m"></td>
                <td v-html="row.f"></td>
                <td v-html="row.n"></td>
                <td v-if="row.pl !== undefined" v-html="row.pl"></td>
              </tr>
              </tbody>
            </table>
          </section>
          <section class="info-section">
            <h3 class="info-section__title">{{ t('adjectiveDeclensionPage.examples') }}</h3>
            <div v-for="(example, index) in currentTopicData.examples" :key="index" class="example">
              <div class="example__de-text">
                <p class="example__sentence" v-html="example.sentence"></p>
                <SoundBtn :text="example.sentence"/>
              </div>
              <span class="example__translation">{{ example.translation }}</span>
            </div>
          </section>
        </div>
        <div class="practice-area">
          <p class="practice-area__description">{{ currentTopicData.practice.description }}</p>
          <NuxtLink :to="`/${categoryId}/${currentTopicData.id}`" class="practice-area__button">
            {{ currentTopicData.practice.buttonText }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch, nextTick} from 'vue';
import VTips from "~/src/components/V-tips.vue";
import Lottie from 'lottie-web';
import TipIcon from '../../assets/animation/info.json';
import {useRouter} from 'vue-router'
import SoundBtn from '../../src/components/soundBtn'
import { useHead, useSeoMeta, useRuntimeConfig } from '#imports'
import VBackBtn from "../../src/components/V-back-btn.vue";
import VArrowNav from "~/src/components/V-arrowNav.vue";

const canonical = useCanonical()
const {t} = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow'
})

const router = useRouter()
const categoryId = 'adjective-declension';
const topic = ref('definite-article');
const showTips = ref(false);
const activeTipps = ref([]);
const tipRef = ref(null);
let lottieInstance = null;

const isContentVisible = ref(false);
const isMobileLayout = ref(false);
const currentTopicData = computed(() => topics.find(t => t.id === topic.value));

const topics = [
  {
    id: 'definite-article',
    title: t('adjectiveDeclensionPage.sidebarFirst'),
    rule: t('adjectiveContentSide.ruleFirst'),
    tips: [
      {label: t('adjectiveContentSide.firstThemeTipOne')},
      {label: t('adjectiveContentSide.firstThemeTipTwo')},
      {label: t('adjectiveContentSide.firstThemeTipThree')},
      {label: t('adjectiveContentSide.firstThemeTipFour')}
    ],
    tableData: [
      {case: 'Nominativ', m: '-e', f: '-e', n: '-e', pl: '-en'},
      {case: 'Akkusativ', m: '-en', f: '-e', n: '-e', pl: '-en'},
      {case: 'Dativ', m: '-en', f: '-en', n: '-en', pl: '-en'},
      {case: 'Genitiv', m: '-en', f: '-en', n: '-en', pl: '-en'},
    ],
    examples: [
      {sentence: 'Der <b>gute</b> Mann lacht.', translation: t('adjectiveContentSide.FirstThemeTipTranslateOne')},
      {sentence: 'Ich sehe den <b>alten</b> Tisch.', translation: t('adjectiveContentSide.FirstThemeTipTranslateTwo')},
      {
        sentence: 'Wir helfen der <b>jungen</b> Frau.',
        translation: t('adjectiveContentSide.FirstThemeTipTranslateThree')
      },
      {
        sentence: 'Die <b>neuen</b> Autos sind teuer.',
        translation: t('adjectiveContentSide.FirstThemeTipTranslateFour')
      },
    ],
    practice: {
      title: t('adjectiveContentSide.practiceFirstTitle'),
      description: t('adjectiveContentSide.practiceFirstDescription'),
      buttonText: t('adjectiveContentSide.practiceFirstButtonText')
    }
  },
  {
    id: 'indefinite-article',
    title: t('adjectiveDeclensionPage.sidebarSecond'),
    rule: t('adjectiveContentSide.ruleSecond'),
    tips: [
      {label: t('adjectiveContentSide.secondThemeTipOne')},
      {label: t('adjectiveContentSide.secondThemeTipTwo')},
      {label: t('adjectiveContentSide.secondThemeTipThree')},
      {label: t('adjectiveContentSide.secondThemeTipFour')}
    ],
    tableData: [
      {case: 'Nominativ', m: '-er', f: '-e', n: '-es', pl: '-en'},
      {case: 'Akkusativ', m: '-en', f: '-e', n: '-es', pl: '-en'},
      {case: 'Dativ', m: '-en', f: '-en', n: '-en', pl: '-en'},
      {case: 'Genitiv', m: '-en', f: '-en', n: '-en', pl: '-en'},
    ],
    examples: [
      {sentence: 'Ein <b>guter</b> Mann lacht.', translation: t('adjectiveContentSide.secondThemeTipTranslateOne')},
      {sentence: 'Mein <b>kleines</b> Kind spielt.', translation: t('adjectiveContentSide.secondThemeTipTranslateOne')},
      {
        sentence: 'Ich kaufe einen <b>neuen</b> Computer.',
        translation: t('adjectiveContentSide.secondThemeTipTranslateOne')
      },
      {
        sentence: 'Er spricht mit einer <b>netten</b> Person.',
        translation: t('adjectiveContentSide.secondThemeTipTranslateOne')
      },
    ],
    practice: {
      title: t('adjectiveContentSide.practiceSecondTitle'),
      description: t('adjectiveContentSide.practiceSecondDescription'),
      buttonText: t('adjectiveContentSide.practiceSecondButtonText')
    }
  },
  {
    id: 'no-article',
    title: t('adjectiveDeclensionPage.sidebarThird'),
    rule: t('adjectiveContentSide.ruleThird'),
    tips: [
      {label: t('adjectiveContentSide.thirdThemeTipOne')},
      {label: t('adjectiveContentSide.thirdThemeTipTwo')},
      {label: t('adjectiveContentSide.thirdThemeTipThree')},
      {label: t('adjectiveContentSide.thirdThemeTipFour')},
      {label: t('adjectiveContentSide.thirdThemeTipFifth')}
    ],
    tableData: [
      {case: 'Nominativ', m: '-er', f: '-e', n: '-es', pl: '-e'},
      {case: 'Akkusativ', m: '-en', f: '-e', n: '-es', pl: '-e'},
      {case: 'Dativ', m: '-em', f: '-er', n: '-em', pl: '-en'},
      {case: 'Genitiv', m: '-en', f: '-er', n: '-en', pl: '-er'},
    ],
    examples: [
      {sentence: '<b>Guter</b> Wein ist teuer.', translation: t('adjectiveContentSide.ThirdThemeTipTranslateOne')},
      {sentence: 'Ich trinke <b>kaltes</b> Wasser.', translation: t('adjectiveContentSide.ThirdThemeTipTranslateTwo')},
      {
        sentence: '<b>Frische</b> Milch schmeckt gut.',
        translation: t('adjectiveContentSide.ThirdThemeTipTranslateThree')
      },
      {
        sentence: 'Wir fahren mit <b>schnellen</b> Autos.',
        translation: t('adjectiveContentSide.ThirdThemeTipTranslateFour')
      },
    ],
    practice: {
      title: t('adjectiveContentSide.practiceThirdTitle'),
      description: t('adjectiveContentSide.practiceThirdDescription'),
      buttonText: t('adjectiveContentSide.practiceThirdButtonText')
    }
  }
];

const checkScreenSize = () => {
  isMobileLayout.value = window.innerWidth <= 767;
  if (!isMobileLayout.value) {
    isContentVisible.value = false;
  }
};

const closeContent = () => {
  isContentVisible.value = false;
};

const selectTopic = (id) => {
  topic.value = id;
  if (isMobileLayout.value) {
    isContentVisible.value = true;
  }
};

const openTips = (tipps) => {
  activeTipps.value = tipps;
  showTips.value = true;
};

const initLottieIcon = async () => {
  await nextTick();
  if (lottieInstance) lottieInstance.destroy();
  if (tipRef.value) {
    lottieInstance = Lottie.loadAnimation({
      container: tipRef.value,
      loop: false,
      autoplay: true,
      animationData: TipIcon,
    });
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  initLottieIcon();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
  if (lottieInstance) lottieInstance.destroy();
});

watch(currentTopicData, initLottieIcon);
</script>

<style scoped>
.declension-page {
  position: relative;
  display: flex;
  width: 100%;
  height: 100vh;
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
  background: var(--bg, #ffffff);
  overflow-y: auto;
  padding-bottom: 20px;
}

.sidebar__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  background: var(--bg, #ffffff);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  margin-bottom: 16px;
  flex-shrink: 0;
}

.sidebar__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--titleColor, #374151);
  margin-left: 16px;
  margin-top: 0;
  margin-bottom: 0;
  text-shadow: 0 1px var(--titleColor);
}

.sidebar__list {
  list-style: none;
  padding: 0 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar__item {
  width: 100%;
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

.declension-page.content-is-active .content {
  transform: translateX(0);
}

.content__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  background: var(--bg, #ffffff);
  border-bottom: 2px solid #e5e7eb;
  flex-shrink: 0;
}

.content__title {
  color: var(--titleColor, #374151);
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 0 16px;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid #2b2b2b;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 2px 0px #2b2b2b;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.content__body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  background: var(--bg, #f7f9fc);
}

.content__main-column {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
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
  color: var(--titleColor, #374151);
  margin: 0 0 16px 0;
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
  margin-top: 0;
}

.declension-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
  margin-bottom: 24px;
}

.declension-table th {
  background: #ffd166;
  padding: 10px  2px;
  font-weight: 800;
  font-size: .8rem;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  text-align: center;
}

.declension-table td {
  padding: 10px 2px;
  background: #ffffff;
  border-bottom: 2px solid #e5e7eb;
  color: #4b5563;
  font-size: 1rem;
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
  font-weight: 500;
}

.example__sentence :deep(b) {
  font-weight: 800;
  color: #111827;
}

.example__translation {
  display: block;
  color: #9ca3af;
  font-size: 1rem;
  padding-left: 8px;
  font-style: normal;
}

.practice-area {
  padding: 20px;
  flex-shrink: 0;
  text-align: center;
}

.practice-area__title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--titleColor, #374151);
  margin: 0 0 8px 0;
}

.practice-area__description {
  font-size: 1rem;
  color: #9ca3af;
  margin: 0 0 16px 0;
  max-width: none;
}

.practice-area__button {
  display: block;
  width: 100%;
  text-decoration: none;
  background: #3b82f6;
  color: #ffffff;
  padding: 14px;
  border-radius: 44px;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  border: 2px solid #2563eb;
  border-bottom: 6px solid #1d4ed8;
  transition: transform 0.1s;
}

.practice-area__button:active {
  transform: translateY(4px);
  border-bottom-width: 2px;
  margin-bottom: 4px;
}

@media (min-width: 768px) {
  .declension-page {
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