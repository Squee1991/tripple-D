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
    <aside class="sidebar">
      <div class="sidebar__header">
        <VBackBtn/>
        <h2 class="sidebar__title">{{ t('verbTypesPage.types') }}</h2>
      </div>
      <ul class="sidebar__list">
        <li v-for="item in topics" :key="item.id" class="sidebar__item"
            :class="{ 'sidebar__item--active': topic === item.id }">
          <button class="sidebar__button" @click="selectTopic(item.id)">
            <span>{{ item.title }}</span>
          </button>
        </li>
      </ul>
    </aside>
    <section class="content">
      <div v-if="currentTopicData" class="content-block">
        <header class="content__header">
          <button v-if="isMobileLayout" @click="closeContent" class="btn-icon-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="#2b2b2b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h1 class="content__title">{{ t('verbTypesPage.types') }} {{ currentTopicData.title }}</h1>
        </header>
        <div class="content__body">
          <div class="content__main-column">
            <section
                v-if="currentTopicData.contentBlocks[0] && currentTopicData.contentBlocks[0].type === 'rule'"
                class="info-section">
              <div class="info__wrapper">
                <h3 class="info-section__title">{{ currentTopicData.contentBlocks[0].title }}</h3>
                <button
                    :title="t('hoverTitle.tips')"
                    v-if="currentTopicData.tips" class="info__icon-tips" ref="tipRef"
                    @click="openTips(currentTopicData.tips)"></button>
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
              <section v-if="block.type === 'subheading'" class="info-section">
                <h3 class="info-section__subheading">{{ block.title }}</h3>
              </section>
              <section v-if="block.type === 'rules'" class="info-section">
                <ul class="rules-list">
                  <li v-for="(rule, i) in block.content" :key="i" class="rules-item">
                    {{ rule }}
                  </li>
                </ul>
              </section>
              <section v-if="block.type === 'examples'" class="info-section examples-container">
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
            <NuxtLink :to="`/verb-types/${currentTopicData.id}`" class="practice-area__button">
              {{ currentTopicData.practice.buttonText }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch, nextTick} from 'vue';
import VBackBtn from "../../src/components/V-back-btn.vue";
import {useRouter} from 'vue-router';
import Lottie from 'lottie-web';
import TipIcon from '../../assets/animation/info.json';
import SoundBtn from '../../src/components/soundBtn';
import { useHead, useSeoMeta } from '#imports'

const {t} = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow'
})

const router = useRouter();
const isMobileLayout = ref(false);
const isContentVisible = ref(false);
const topic = ref('prepositions');
const showTips = ref(false);
const activeTipps = ref([]);
const tipRef = ref(null);
let lottieInstance = null;

const selectTopic = (id) => {
  topic.value = id;
  if (isMobileLayout.value) {
    nextTick(() => {
      isContentVisible.value = true;
    });
  }
};

const currentTopicData = computed(() => topics.find(t => t.id === topic.value));

const parseTip = (text) => {
  return text.replace(/'([^']+)'/g, (_, key) => {
    try {
      return t(key);
    } catch {
      return key;
    }
  });
};

const topics = [
  {
    id: 'prepositions',
    title: t('verbTypesPage.typeCategoryFirst'),
    tips: [
      { text: "'verbTypeCategoryFirst.firstPart' <b>Wo(r)+'verbTypeCategoryFirst.secondPart'</b>. 'verbTypeCategoryFirst.thirdPart' <b>Worauf</b> wartest du? → Ich warte <b>auf</b> den Bus." },
      { text: t("verbTypeCategoryFirst.secondTip") }
    ],
    contentBlocks: [
      { type: 'rule', title: t('verbTypeCategoryFirst.ruleTitle'), content: t('verbTypeCategoryFirst.ruleContent') },
      { type: 'subheading', title: t('verbTypeCategoryFirst.firstTypeTitle') },
      { type: 'examples', content: [
          { sentence: 'Ich warte <b>auf dich</b>.', translation: t('verbTypeCategoryFirst.firstExampleTranslate') },
          { sentence: 'Er denkt <b>an seine Arbeit</b>.', translation: t('verbTypeCategoryFirst.secondExampleTranslate') },
        ]
      },
      { type: 'subheading', title: t('verbTypeCategoryFirst.secondTypeTitle') },
      { type: 'examples', content: [
          { sentence: 'Sie spricht <b>mit dem Lehrer</b>.', translation: t('verbTypeCategoryFirst.thirdExampleTranslate') },
          { sentence: 'Ich träume <b>von einer langen Reise</b>.', translation: t('verbTypeCategoryFirst.fourthExampleTranslate') },
        ]
      }
    ],
    practice: { title: t('verbTypeCategoryFirst.practiceTitle'), description: t('verbTypeCategoryFirst.practiceDescription'), buttonText: t('verbTypeCategoryFirst.practiceBtn') }
  },
  {
    id: 'separable',
    title: t('verbTypesPage.typeCategorySecond'),
    tips: [
      { text: "'verbTypeCategorySecond.firstPart' <b>an-, auf-, aus-, ein-, mit-, nach-, vor-, zu-</b>." },
      { text: "'verbTypeCategorySecond.secondPart' <b>-ge-</b>'verbTypeCategorySecond.thirdPart' anrufen → an<b>ge</b>rufen." }
    ],
    contentBlocks: [
      { type: 'rule', title: t('verbTypeCategorySecond.ruleTitle'), content: t('verbTypeCategorySecond.ruleContent') },
      { type: 'table', title: t('verbTypeCategorySecond.firstTypeTitle'), content: [
          {person: 'ich', form: 'rufe ... <b>an</b>'},
          {person: 'du', form: 'rufst ... <b>an</b>'},
          {person: 'er/sie/es', form: 'ruft ... <b>an</b>'}
        ]
      },
      { type: 'subheading', title: 'verbTypeCategorySecond.firstExampleTitle' },
      { type: 'examples', content: [
          { sentence: 'Ich <b>rufe</b> meine Freundin <b>an</b>.', translation: t('verbTypeCategorySecond.firstExampleTranslate') },
          { sentence: 'Der Zug <b>kommt</b> um 18 Uhr <b>an</b>.', translation: t('verbTypeCategorySecond.secondExampleTranslate') }
        ]
      }
    ],
    practice: { title: t('verbTypeCategorySecond.practiceTitle'), description: t('verbTypeCategorySecond.practiceDescription'), buttonText: t('verbTypeCategorySecond.practiceBtn') }
  },
  {
    id: 'irregular',
    title: t('verbTypesPage.typeCategoryThird'),
    tips: [
      { text: "'verbTypeCategoryThird.firstPartTip' <b>e → i</b>: g<b>e</b>ben → du g<b>i</b>bst, er g<b>i</b>bt" },
      { text: "'verbTypeCategoryThird.firstPartTip' <b>e → ie</b>: s<b>e</b>hen → du s<b>ie</b>hst, er s<b>ie</b>ht" },
      { text: "'verbTypeCategoryThird.firstPartTip' <b>a → ä</b>: f<b>a</b>hren → du f<b>ä</b>hrst, er f<b>ä</b>hrt" }
    ],
    contentBlocks: [
      { type: 'rule', title: t('verbTypeCategoryThird.ruleTitle'), content: t('verbTypeCategoryThird.ruleContent') },
      { type: 'table', title: t('verbTypeCategoryThird.firstTypeTitle'), content: [
          {person: 'ich', form: 'fahre'},
          {person: 'du', form: 'f<b>ä</b>hrst'},
          {person: 'er/sie/es', form: 'f<b>ä</b>hrt'}
        ]
      },
      { type: 'subheading', title: t('verbTypeCategoryThird.firstExampleTitle') },
      { type: 'examples', content: [
          { sentence: 'Du <b>sprichst</b> sehr gut Deutsch.', translation: t('verbTypeCategoryThird.firstExampleTranslate') },
          { sentence: 'Er <b>hilft</b> seiner Mutter im Garten.', translation: t('verbTypeCategoryThird.secondExampleTranslate') }
        ]
      }
    ],
    practice: { title: t('verbTypeCategoryThird.practiceTitle'), description: t('verbTypeCategoryThird.practiceDescription'), buttonText: t('verbTypeCategoryThird.practiceBtn') }
  },
  {
    id: 'reflexive',
    title: t('verbTypesPage.typeCategoryFourth'),
    tips: [
      { text: "'verbTypeCategoryFourth.first' <b>mich, dich, sich, uns, euch, sich</b>." },
      { text: t('verbTypeCategoryFourth.second') }
    ],
    contentBlocks: [
      { type: 'rule', title: t('verbTypeCategoryFourth.ruleTitle'), content: t('verbTypeCategoryFourth.ruleContent') },
      { type: 'table', title: t('verbTypeCategoryFourth.form'), content: [
          {person: 'ich', form: 'freue <b>mich</b>'},
          {person: 'du', form: 'freust <b>dich</b>'},
          {person: 'er/sie/es', form: 'freut <b>sich</b>'}
        ]
      },
      { type: 'subheading', title: t('verbTypeCategoryFourth.firstExampleTitle') },
      { type: 'examples', content: [
          { sentence: 'Ich <b>interessiere mich</b> für Musik.', translation: t('verbTypeCategoryFourth.firstExampleTranslate') },
          { sentence: 'Wir <b>treffen uns</b> um 8 Uhr.', translation: t('verbTypeCategoryFourth.secondExampleTranslate') }
        ]
      }
    ],
    practice: { title: t('verbTypeCategoryFourth.practiceTitle'), description: t('verbTypeCategoryFourth.practiceDescription'), buttonText: t('verbTypeCategoryFourth.practiceBtn') }
  }
];

const checkScreenSize = () => {
  isMobileLayout.value = window.innerWidth <= 767;
  if (!isMobileLayout.value) isContentVisible.value = false;
};

const closeContent = () => {
  isContentVisible.value = false;
};

const openTips = (tipps) => {
  activeTipps.value = tipps;
  showTips.value = true;
};

const initLottieIcon = async () => {
  await nextTick();
  if (lottieInstance) {
    lottieInstance.destroy();
    lottieInstance = null;
  }
  if (tipRef.value) {
    lottieInstance = Lottie.loadAnimation({
      container: tipRef.value,
      renderer: 'svg',
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
  border-bottom: 2px solid #e5e7eb;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  margin-bottom: 16px;
  flex-shrink: 0;
}

.sidebar__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--titleColor);
  margin-left: 16px;
  margin-top: 0;
  margin-bottom: 0;
}

.sidebar__heading {
  margin-bottom: 16px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 800;
  color: #60a5fa;
  text-transform: uppercase;
}

.sidebar__list {
  list-style: none;
  padding: 0 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar__button {
  width: 100%;
  text-align: center;
  padding: 15px 20px;
  background: #ffffff;
  border: 2px solid #e5e7eb;
  border-bottom: 6px solid #e5e7eb;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 800;
  font-size: 1.2rem;
  color: #4b5563;
  transition: all 0.1s ease-out;
}

.content {
  position: absolute;
  inset: 0;
  background: var(--bg);
  z-index: 50;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.verb-types-page.content-is-active .content {
  transform: translateX(0);
}

.content-block {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
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
  font-size: 22px;
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
}

.info-section {
  margin-bottom: 25px;
}

.info__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.info-section__title {
  font-size: 20px;
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
}

.info__icon-tips:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 #e5e7eb;
}

.info-section__description {
  font-size: 1.15rem;
  color: #212121;
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
  padding-left: 1.2rem;
}

.rules-item {
  margin-bottom: 0.5rem;
  list-style: disc;
  color: var(--titleColor);
  font-size: 1.05rem;
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
  font-size: 1.1rem;
  color: #374151;
  margin: 0 0 4px 0;
  line-height: 1.4;
  font-weight: 700;
}

.example__translation {
  color: #6b7280;
  font-size: 0.95rem;
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
  flex-shrink: 0;
  margin-top: auto;
  text-align: center;
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

.practice-area__button:active {
  transform: translateY(4px);
  border-bottom-width: 2px;
  margin-bottom: 4px;
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
  padding: 24px 15px;
  border-radius: 28px;
  width: 100%;
  max-width: 400px;
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
  top: -12px;
  right: -12px;
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
}

.tipps__title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 16px 0;
  color: var(--titleColor);
  padding-right: 40px;
}

.tips__list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
  max-height: 60vh;
  overflow-y: auto;
}

.tips__text {
  font-size: 1.05rem;
  padding: 14px;
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