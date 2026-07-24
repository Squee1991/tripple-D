<template>
  <div class="comparison-page" :class="{ 'content-is-active': isContentVisible }">
    <VTips
        v-model="showTips"
        :title="t('adjectiveComparisonPage.tipTitle')"
        :tips="currentTopicData?.tips"
    />
    <div class="sidebar">
      <div class="sidebar__header">
        <VBackBtn/>
        <h2 class="sidebar__title">{{ t('adjectiveComparisonPage.sideBarTitle') }}</h2>
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
                <div class="example__de-text">
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
                  <div class="example__de-text">
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
<!--          <p class="practice-area__description">{{ currentTopicData.practice.description }}</p>-->
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
import VArrowNav from "~/src/components/V-arrowNav.vue";

const canonical = useCanonical()
const {t} = useI18n()

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

.sidebar__heading {
  margin-bottom: 12px;
  padding: 0 20px;
  font-size: 1.1rem;
  font-weight: 800;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sidebar__list {
  list-style: none;
  padding: 15px;
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

.comparison-page.content-is-active .content {
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
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
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
  margin-top: 0;
}

.special-case-group {
  margin-bottom: 24px;
}

.special-case-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 12px;
  border-bottom: none;
  padding-bottom: 0;
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
  .comparison-page {
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