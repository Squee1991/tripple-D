<template>
  <div class="declension-page" :class="{ 'content-is-active': isContentVisible }">
    <VTips
        v-model="showTips"
        :title="t('adjectiveComparisonPage.tipTitle')"
        :tips="currentTopicData?.tips"
    />
    <div class="sidebar">
      <VBackBtn/>
      <h2 class="sidebar__title">{{ t('adjectiveDeclensionPage.sideBarTitle') }}</h2>
      <div class="sidebar__heading">{{ t('adjectiveDeclensionPage.sidebarUnderTitle') }}</div>
      <ul class="sidebar__list">
        <li
            v-for="item in topics"
            :key="item.id"
            :class="['sidebar__item', { 'sidebar__item--active': topic === item.id }]"
        >
          <button class="sidebar__button" @click="selectTopic(item.id)">
            <span>{{ item.title }}</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="content" v-if="currentTopicData">
      <button v-if="isMobileLayout" class="btn__close" @click="closeContent">×</button>
      <header class="content__header">
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
          <h3 class="practice-area__title">{{ currentTopicData.practice.title }}</h3>
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
const canonical = useCanonical()
const {t} = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow'
})

// const baseTitle = t('metaAdjectiveDeclension.title')
// const pageDesc  = t('metaAdjectiveDeclension.description')
//
// useHead({
//   title: baseTitle,
//   link: [
//     { rel: 'canonical', href: canonical }
//   ]
// })
//
// useSeoMeta({
//   title: baseTitle,
//   description: pageDesc,
//   ogTitle: baseTitle,
//   ogDescription: pageDesc,
//   ogType: 'article',
//   ogUrl: canonical,
//   ogImage: '/images/seo-adj-declension.png',
//   robots: 'index, follow'
// })
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
const backToMenu = () => {
  router.push('/')
}
const topics = [
  {
    id: 'definite-article',
    title: t('adjectiveDeclensionPage.sidebarFirst'),
    rule: t('adjectiveContentSide.ruleFirst'),
    tips: [
      {text: t('adjectiveContentSide.firstThemeTipOne')},
      {text: t('adjectiveContentSide.firstThemeTipTwo')},
      {text: t('adjectiveContentSide.firstThemeTipThree')},
      {text: t('adjectiveContentSide.firstThemeTipFour')}
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
      {text: t('adjectiveContentSide.secondThemeTipOne')},
      {text: t('adjectiveContentSide.secondThemeTipTwo')},
      {text: t('adjectiveContentSide.secondThemeTipThree')},
      {text: t('adjectiveContentSide.secondThemeTipFour')}
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
      {text: t('adjectiveContentSide.thirdThemeTipOne')},
      {text: t('adjectiveContentSide.thirdThemeTipTwo')},
      {text: t('adjectiveContentSide.thirdThemeTipThree')},
      {text: t('adjectiveContentSide.thirdThemeTipFour')},
      {text: t('adjectiveContentSide.thirdThemeTipFifth')}
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
  display: flex;
  width: 100%;
  height: 100vh;
  padding: 20px;
  gap: 20px;
  font-family: 'Nunito', sans-serif;
}

.sidebar {
  min-width: 350px;
  background: #ffffff;
  border: 3px solid #1e1e1e;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 6px 6px 0px #1e1e1e;
  flex-shrink: 0;
  overflow-y: auto;
}

.btn__back {
  display: block;
  text-align: center;
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  background-color: #f1c40f;
  color: #1e1e1e;
  text-decoration: none;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
  transition: background-color 0.2s;
}

.sidebar__title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-align: center;
}

.sidebar__heading {
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #60a5fa;
  text-transform: uppercase;
}

.sidebar__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar__item {
  margin-bottom: 12px;
}

.sidebar__button {
  width: 100%;
  text-align: center;
  padding: 12px;
  background: #f0f0f0;
  border: 2px solid #1e1e1e;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  box-shadow: 3px 3px 0px #1e1e1e;
}

.sidebar__button:hover {
  background: #e0e0e0;
}

.sidebar__button:active {
  transform: translate(3px, 3px);
  box-shadow: none;
}

.sidebar__item--active .sidebar__button {
  color: #1e1e1e;
  background: #4ade80;
}

.content {
  border-radius: 15px;
  border: 3px solid #1e1e1e;
  flex-grow: 1;
  background: #fdfdfd;
  padding: 30px;
  box-shadow: 6px 6px 0px #1e1e1e;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.content__header {
  background: #ffcc00;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 5px 5px 0px #1e1e1e;
}

.content__title {
  color: white;
  font-size: 2.1rem;
  font-weight: bold;
  text-shadow: 2px 2px 0px #000;
}

.content__body {
  display: flex;
  flex-grow: 1;
  border: 3px solid #1e1e1e;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 6px 6px 0px #1e1e1e;
  background: #fff;
  overflow: hidden;
}

.content__main-column {
  width: 60%;
  padding-right: 20px;
  border-right: 3px dashed #cccccc;
  overflow-y: auto;
}

.info-section {
  margin-bottom: 25px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section__title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.info-section__description {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

.example {
  background: #f5f5f5;
  border: 2px solid #ddd;
  border-left: 6px solid #ffab00;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 1.2rem;
}

.example__sentence {
  margin: 0;
}

.example__translation {
  display: block;
  color: #777;
  font-size: 1rem;
  margin-top: 5px;
  font-style: italic;
}

.practice-area {
  width: 40%;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.practice-area__title {
  font-size: 1.6rem;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.practice-area__description {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 20px;
  max-width: 400px;
  padding: 10px 0;
}

.practice-area__button {
  display: block;
  font-weight: 600;
  min-width: 230px;
  background: #f1c40f;
  color: #1e1e1e;
  border: 2px solid #1e1e1e;
  border-radius: 12px;
  padding: 12px 25px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 3px 3px 0px #1e1e1e;
}

@media (min-width: 1024px) {
  .practice-area__button:hover {
    background: #e3c32b;
    box-shadow: 1px 1px 0 #1e1e1e;
    transform: translate(2px , 2px);
  }
}

.practice-area__button:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}

.declension-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.1rem;
}

.declension-table th, .declension-table td {
  border: 2px solid #1e1e1e;
  padding: 10px;
  text-align: center;
}

.declension-table th {
  background-color: #ffd166;
}

.declension-table td {
  background-color: #fff;
}

.declension-table td:first-child {
  background-color: #f0f0f0;
}

.info__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.info__icon-tips {
  width: 60px;
  height: 60px;
  cursor: pointer;
  border: none;
  background: none;
}

.example__de-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.special-case-group {
  margin-bottom: 2rem;
}

.special-case-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #6c757d;
  margin-bottom: 1rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.example__line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.btn__close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background-color: #f1c40f;
  border: 3px solid #1e1e1e;
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
  color: #1e1e1e;
  cursor: pointer;
  z-index: 100;
  display: none;
  justify-content: center;
  align-items: center;
}

@media (max-width: 1024px) {
  .content__body {
    flex-direction: column;
  }

  .content__main-column, .practice-area {
    width: 100%;
    border-right: none;
    padding: 1rem;
  }

  .content__main-column {
    border-bottom: 3px dashed #cccccc;
    padding-bottom: 2rem;
  }

  .practice-area {
    padding-top: 2rem;
    padding-left: 1rem;
  }

  .content__title {
    font-size: 1.8rem;
  }
}

@media (max-width: 767px) {
  .declension-page {
    position: relative;
    overflow-x: hidden;
    display: block;
    padding: 0;
    gap: 0;
  }

  .declension-table th {
    width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .sidebar {
    width: 100%;
    height: 100vh;
    min-width: unset;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }

  .content {
    position: absolute;
    top: 0;
    left: 100%;
    width: 100%;
    height: 100%;
    z-index: 50;
    transition: transform 0.4s ease-in-out;
    border-radius: 0;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
    padding: 15px;
  }

  .declension-page.content-is-active .content {
    transform: translateX(-100%);
  }

  .btn__close {
    display: flex;
  }
}
</style>