<template>
  <div class="comparison-page" :class="{ 'content-is-active': isContentVisible }">
<!--    <div v-if="showTips" class="tips__overlay" @click.self="showTips = false">-->
<!--      <div class="tips__content">-->
<!--        <button class="tips__close" @click="showTips = false">×</button>-->
<!--        <h2 class="tipps__title">{{ t('adjectiveComparisonPage.tipTitle') }}</h2>-->
<!--        <ul class="tips__list">-->
<!--          <li v-for="tip in activeTipps" :key="tip.text" class="tips__item">-->
<!--            <div class="tips__text">{{ tip.text }}</div>-->
<!--          </li>-->
<!--        </ul>-->
<!--      </div>-->
<!--    </div>-->
    <VTips
        v-model="showTips"
        :title="t('adjectiveComparisonPage.tipTitle')"
        :tips="currentTopicData?.tips"
    />
    <div class="sidebar">
      <VBackBtn/>
      <h2 class="sidebar__title">{{ t('adjectiveComparisonPage.sideBarTitle') }}</h2>
      <div class="sidebar__heading">{{ t('adjectiveComparisonPage.sidebarUnderTitle') }}</div>
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
              <h3 class="info-section__title">{{ t('adjectiveComparisonPage.ruleTitle') }}</h3>
              <button
                  :title="t('hoverTitle.tips')"
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
            <h3 class="info-section__title">{{ t('adjectiveComparisonPage.examples') }}</h3>
            <div v-if="currentTopicData.examples">
              <div v-for="(example, index) in currentTopicData.examples" :key="index" class="example">
                <div class="example__line">
                  <p class="example__sentence" v-html="example.sentence"></p>
                  <SoundBtn :text="example.sentence"/>
                </div>
                <span class="example__translation">{{ example.translation }}</span>
              </div>
            </div>
            <div v-if="currentTopicData.specialCases">
              <div v-for="caseGroup in currentTopicData.specialCases" :key="caseGroup.title"
                   class="special-case-group">
                <h4 class="special-case-title">{{ caseGroup.title }}</h4>
                <div v-for="(example, index) in caseGroup.examples" :key="index" class="example">
                  <div class="example__line">
                    <p class="example__sentence" v-html="example.sentence"></p>
                    <SoundBtn :text="example.sentence"/>
                  </div>
                  <span class="example__translation">{{ example.translation }}</span>
                </div>
              </div>
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
import {useRouter} from 'vue-router';
import SoundBtn from '../../src/components/soundBtn.vue'
import Lottie from 'lottie-web';
import TipIcon from '../../assets/animation/info.json';
import VTips from '../../src/components/V-tips.vue';
import {useHead, useSeoMeta} from '#imports'
import VBackBtn from "../../src/components/V-back-btn.vue";

const canonical = useCanonical()
const {t} = useI18n()
// const baseTitle = t('adjectiveComparisonPage.title')
// const pageDesc = t('adjectiveComparisonPage.description')
// useHead({
//   title: baseTitle,
//   link: [
//     {rel: 'canonical', href: canonical}
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
//   ogImage: '/images/seo-adj-comparison.png',
//   robots: 'index, follow'
// })

useSeoMeta({
  robots: 'noindex, nofollow'
})

const router = useRouter();
const categoryId = 'adjective-comparison';
const topics = [
  {
    id: 'regular-forms',
    title: t('adjectiveComparisonPage.sideBarFirst'),
    rule: t('adjectiveComparisonContentSide.ruleOne'),
    tips: [
      {text: t('adjectiveComparisonContentSide.firstThemeTipOne')},
      {text: t('adjectiveComparisonContentSide.firstThemeTipTwo')},
      {text: t('adjectiveComparisonContentSide.firstThemeTipThree')},
      {text: t('adjectiveComparisonContentSide.firstThemeTipFour')}
    ],
    examples: [
      {
        sentence: 'schnell → <b>schneller</b> → <b>am schnellsten</b>',
        translation: t('adjectiveComparisonContentSide.FirstThemeTranslateOne')
      },
      {
        sentence: 'langsam → <b>langsamer</b> → <b>am langsamsten</b>',
        translation: t('adjectiveComparisonContentSide.FirstThemeTranslateTwo')
      },
      {
        sentence: 'billig → <b>billiger</b> → <b>am billigsten</b>',
        translation: t('adjectiveComparisonContentSide.FirstThemeTranslateThree')
      }
    ],
    practice: {
      title: t('adjectiveComparisonContentSide.practiceFirstTitle'),
      description: t('adjectiveComparisonContentSide.practiceFirstDescription'),
      buttonText: t('adjectiveComparisonContentSide.practiceFirstButtonText'),
    }
  },
  {
    id: 'umlaut-forms',
    title: t('adjectiveComparisonPage.sideBarSecond'),
    rule: t('adjectiveComparisonContentSide.ruleTwo'),
    tips: [
      {text: t('adjectiveComparisonContentSide.secondThemeTipOne')},
      {text: t('adjectiveComparisonContentSide.secondThemeTipTwo')},
      {text: t('adjectiveComparisonContentSide.secondThemeTipThree')},
      {text: t('adjectiveComparisonContentSide.secondThemeTipFour')}
    ],
    examples: [
      {
        sentence: 'alt → <b>älter</b> → <b>am ältesten</b>',
        translation: t('adjectiveComparisonContentSide.secondThemeTranslateOne')
      },
      {
        sentence: 'groß → <b>größer</b> → <b>am größten</b>',
        translation: t('adjectiveComparisonContentSide.secondThemeTranslateTwo')
      },
      {
        sentence: 'jung → <b>jünger</b> → <b>am jüngsten</b>',
        translation: t('adjectiveComparisonContentSide.secondThemeTranslateThree')
      },
      {
        sentence: 'kalt → <b>kälter</b> → <b>am kältesten</b>',
        translation: t('adjectiveComparisonContentSide.secondThemeTranslateFour')
      }
    ],
    practice: {
      title: t('adjectiveComparisonContentSide.practiceSecondTitle'),
      description: t('adjectiveComparisonContentSide.practiceSecondDescription'),
      buttonText: t('adjectiveComparisonContentSide.practiceSecondButtonText'),
    }
  },
  {
    id: 'irregular-forms',
    title: t('adjectiveComparisonPage.sideBarThird'),
    rule: t('adjectiveComparisonContentSide.ruleThree'),
    tips: [
      {text: t('adjectiveComparisonContentSide.thirdThemeTipOne')},
      {text: t('adjectiveComparisonContentSide.thirdThemeTipTwo')},
      {text: t('adjectiveComparisonContentSide.thirdThemeTipThree')}
    ],
    specialCases: [
      {
        title: t('adjectiveComparisonContentSide.themeThreeTitleFirstExample'),
        examples: [
          {
            sentence: 'gut → <b>besser</b> → <b>am besten</b>',
            translation: t('adjectiveComparisonContentSide.thirdThemeFirstBlockTranslateOne')
          },
          {
            sentence: 'viel → <b>mehr</b> → <b>am meisten</b>',
            translation: t('adjectiveComparisonContentSide.thirdThemeFirstBlockTranslateOne')
          },
          {
            sentence: 'gern → <b>lieber</b> → <b>am liebsten</b>',
            translation: t('adjectiveComparisonContentSide.thirdThemeFirstBlockTranslateOne')
          },
          {
            sentence: 'bald → <b>eher</b> → <b>am ehesten</b>',
            translation: t('adjectiveComparisonContentSide.thirdThemeFirstBlockTranslateOne')
          }
        ]
      },
      {
        title: t('adjectiveComparisonContentSide.themeThreeTitleSecondExample'),
        examples: [
          {
            sentence: 'hoch → <b>höher</b> → <b>am höchsten</b>',
            translation: t('adjectiveComparisonContentSide.thirdThemeSecondBlockTranslateOne')
          },
          {
            sentence: 'nah → <b>näher</b> → <b>am nächsten</b>',
            translation: t('adjectiveComparisonContentSide.thirdThemeSecondTranslateTwo')
          }
        ]
      },
      {
        title: t('adjectiveComparisonContentSide.themeThreeTitleThirdExample'),
        examples: [
          {
            sentence: 'teuer → <b>teurer</b> → <b>am teuersten</b>',
            translation: t('adjectiveComparisonContentSide.thirdThemeThirdBlockTranslateOne')
          },
          {
            sentence: 'dunkel → <b>dunkler</b> → <b>am dunkelsten</b>',
            translation: t('adjectiveComparisonContentSide.thirdThemeThirdTranslateTwo')
          }
        ]
      },
      {
        title: t('adjectiveComparisonContentSide.themeThreeTitleFourthExample'),
        examples: [
          {
            sentence: 'breit → breit<b>er</b> → <b>am breitesten</b>',
            translation: t('adjectiveComparisonContentSide.thirdThemeFourthBlockTranslateOne')
          },
          {
            sentence: 'heiß → heiß<b>er</b> → <b>am heißesten</b>',
            translation: t('adjectiveComparisonContentSide.thirdThemeFourthTranslateTwo')
          }
        ]
      }
    ],
    practice: {
      title: t('adjectiveComparisonContentSide.practiceThirdTitle'),
      description: t('adjectiveComparisonContentSide.practiceThirdDescription'),
      buttonText: t('adjectiveComparisonContentSide.practiceThirdButtonText'),
    }
  }
];
const backTo = () => {
  router.push('/');
};
const topic = ref('regular-forms');
const currentTopicData = computed(() => topics.find(t => t.id === topic.value));
const showTips = ref(false);
const activeTipps = ref([]);
const tipRef = ref(null);
let lottieInstance = null;
let animationInterval = null;

const isContentVisible = ref(false);
const isMobileLayout = ref(false);

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
  if (animationInterval) clearInterval(animationInterval);
  if (lottieInstance) lottieInstance.destroy();

  if (tipRef.value) {
    lottieInstance = Lottie.loadAnimation({
      container: tipRef.value,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: TipIcon,
    });
    animationInterval = setInterval(() => {
      if (lottieInstance) {
        lottieInstance.stop();
        lottieInstance.play();
      }
    }, 10000);
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  initLottieIcon();
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
  if (animationInterval) clearInterval(animationInterval);
  if (lottieInstance) lottieInstance.destroy();
});

watch(currentTopicData, () => {
  initLottieIcon();
});

</script>

<style scoped>
.comparison-page {
  display: flex;
  width: 100%;
  height: 100vh;
  padding: 20px;

  gap: 20px;
  font-family: "Nunito", sans-serif;
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
  text-decoration: none;
  background: #f1c40f;
  color: #1e1e1e;
  min-width: 230px;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  padding: 12px 25px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 3px 3px 0px #1e1e1e;
}

.practice-area__button:active {
  transform: translate(4px, 4px);
  box-shadow: none;
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

.info__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info__icon-tips {
  width: 60px;
  height: 60px;
  cursor: pointer;
  background: none;
  border: none;
}

.tips__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tips__content {
  position: relative;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0 #1e1e1e;
  width: 90%;
  max-width: 500px;
}

.tips__close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f97028;
  color: #fff;
  border: 2px solid #1e1e1e;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding-bottom: 4px;
}

.tipps__title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.tips__item {
  margin-bottom: 1rem;
}

.tips__text {
  font-size: 1.1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 5px solid #60a5fa;
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
  .comparison-page {
    position: relative;
    overflow-x: hidden;
    display: block;
    padding: 0;
    gap: 0;
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

  .comparison-page.content-is-active .content {
    transform: translateX(-100%);
  }

  .btn__close {
    display: flex;
  }
}

@media (min-width: 1024px) {
  .sidebar__button:hover {
    background: #e0e0e0;
  }

  .practice-area__button:hover {
    background: #ffe04d;
    box-shadow: 1px 1px 0 #1e1e1e;
    transform: translate(2px, 2px);
  }
}

</style>