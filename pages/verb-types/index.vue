`
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
      <button @click="backToMenu" class="btn__back">{{ t('trainerPage.toMain') }}</button>
      <h2 class="sidebar__title">{{ t('verbTypesPage.types') }}</h2>
      <div class="sidebar__heading">{{ t('verbTypesPage.category') }}</div>
      <ul class="sidebar__list">
        <li v-for="item in topics" :key="item.id"
            :class="['sidebar__item', { 'sidebar__item--active': topic === item.id }]">
          <button class="sidebar__button" @click="selectTopic(item.id)">
            <span>{{ item.title }}</span>
          </button>
        </li>
      </ul>
    </div>
    <div class="content" v-if="currentTopicData">
      <button v-if="isMobileLayout" class="btn__close" @click="closeContent">×</button>
      <header class="content__header">
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
                  title="Советы по теме"
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
          <h3 class="practice-area__title">{{ currentTopicData.practice.title }}</h3>
          <p class="practice-area__description">{{ currentTopicData.practice.description }}</p>
          <NuxtLink :to="`/verb-types/${currentTopicData.id}`" class="practice-area__button">
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
import Lottie from 'lottie-web';
import TipIcon from '../../assets/animation/info.json';
import SoundBtn from '../../src/components/soundBtn';

const router = useRouter();
const {t} = useI18n()
const topic = ref('prepositions');
const selectTopic = (id) => {
  topic.value = id;
  if (isMobileLayout.value) {
    isContentVisible.value = true;
  }
};
const currentTopicData = computed(() => topics.find(t => t.id === topic.value));
const backToMenu = () => router.push('/');

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
      {
        text: "'verbTypeCategoryFirst.firstPart' <b>Wo(r)+'verbTypeCategoryFirst.secondPart'</b>. 'verbTypeCategoryFirst.thirdPart' <b>Worauf</b> wartest du? → Ich warte <b>auf</b> den Bus."
      },
      {
        text: t("verbTypeCategoryFirst.secondTip")
      }
    ],
    contentBlocks: [
      {
        type: 'rule',
        title: t('verbTypeCategoryFirst.ruleTitle'),
        content: t('verbTypeCategoryFirst.ruleContent')
      },
      {type: 'subheading', title: t('verbTypeCategoryFirst.firstTypeTitle')},
      {
        type: 'examples', content: [
          {
            sentence: 'Ich warte <b>auf dich</b>.',
            translation: t('verbTypeCategoryFirst.firstExampleTranslate')
          },
          {
            sentence: 'Er denkt <b>an seine Arbeit</b>.',
            translation: t('verbTypeCategoryFirst.secondExampleTranslate')
          },
        ]
      },
      {type: 'subheading', title: t('verbTypeCategoryFirst.secondTypeTitle')},
      {
        type: 'examples', content: [
          {
            sentence: 'Sie spricht <b>mit dem Lehrer</b>.',
            translation: t('verbTypeCategoryFirst.thirdExampleTranslate')
          },
          {
            sentence: 'Ich träume <b>von einer langen Reise</b>.',
            translation: t('verbTypeCategoryFirst.fourthExampleTranslate')
          },
        ]
      }
    ],
    practice: {
      title: t('verbTypeCategoryFirst.practiceTitle'),
      description: t('verbTypeCategoryFirst.practiceDescription'),
      buttonText: t('verbTypeCategoryFirst.practiceBtn')
    }
  },
  {
    id: 'separable',
    title: t('verbTypesPage.typeCategorySecond'),
    tips: [
      {text: "'verbTypeCategorySecond.firstPart' <b>an-, auf-, aus-, ein-, mit-, nach-, vor-, zu-</b>."},
      {text: "'verbTypeCategorySecond.secondPart' <b>-ge-</b>'verbTypeCategorySecond.thirdPart' anrufen → an<b>ge</b>rufen."}
    ],
    contentBlocks: [
      {
        type: 'rule',
        title: t('verbTypeCategorySecond.ruleTitle'),
        content: t('verbTypeCategorySecond.ruleContent')
      },
      {
        type: 'table', title: t('verbTypeCategorySecond.firstTypeTitle'), content: [
          {person: 'ich', form: 'rufe ... <b>an</b>'},
          {person: 'du', form: 'rufst ... <b>an</b>'},
          {person: 'er/sie/es', form: 'ruft ... <b>an</b>'}
        ]
      },
      {type: 'subheading', title: 'verbTypeCategorySecond.firstExampleTitle'},
      {
        type: 'examples', content: [
          {
            sentence: 'Ich <b>rufe</b> meine Freundin <b>an</b>.',
            translation: t('verbTypeCategorySecond.firstExampleTranslate')
          },
          {
            sentence: 'Der Zug <b>kommt</b> um 18 Uhr <b>an</b>.',
            translation: t('verbTypeCategorySecond.secondExampleTranslate')
          }
        ]
      }
    ],
    practice: {
      title: t('verbTypeCategorySecond.practiceTitle'),
      description: t('verbTypeCategorySecond.practiceDescription'),
      buttonText: t('verbTypeCategorySecond.practiceBtn')
    }
  },
  {
    id: 'irregular',
    title: t('verbTypesPage.typeCategoryThird'),
    tips: [
      {text: "'verbTypeCategoryThird.firstPartTip' <b>e → i</b>: g<b>e</b>ben → du g<b>i</b>bst, er g<b>i</b>bt"},
      {text: "'verbTypeCategoryThird.firstPartTip' <b>e → ie</b>: s<b>e</b>hen → du s<b>ie</b>hst, er s<b>ie</b>ht"},
      {text: "'verbTypeCategoryThird.firstPartTip' <b>a → ä</b>: f<b>a</b>hren → du f<b>ä</b>hrst, er f<b>ä</b>hrt"}
    ],
    contentBlocks: [
      {
        type: 'rule',
        title: t('verbTypeCategoryThird.ruleTitle'),
        content: t('verbTypeCategoryThird.ruleContent')
      },
      {
        type: 'table', title: t('verbTypeCategoryThird.firstTypeTitle'), content: [
          {person: 'ich', form: 'fahre'},
          {person: 'du', form: 'f<b>ä</b>hrst'},
          {person: 'er/sie/es', form: 'f<b>ä</b>hrt'}
        ]
      },
      {type: 'subheading', title: t('verbTypeCategoryThird.firstExampleTitle')},
      {
        type: 'examples', content: [
          {
            sentence: 'Du <b>sprichst</b> sehr gut Deutsch.',
            translation: t('verbTypeCategoryThird.firstExampleTranslate')
          },
          {
            sentence: 'Er <b>hilft</b> seiner Mutter im Garten.',
            translation: t('verbTypeCategoryThird.secondExampleTranslate')
          }
        ]
      }
    ],
    practice: {
      title: t('verbTypeCategoryThird.practiceTitle'),
      description: t('verbTypeCategoryThird.practiceDescription'),
      buttonText: t('verbTypeCategoryThird.practiceBtn')
    }
  },
  {
    id: 'reflexive',
    title: t('verbTypesPage.typeCategoryFourth'),
    tips: [
      {text: "'verbTypeCategoryFourth.first' <b>mich, dich, sich, uns, euch, sich</b>."},
      {text: t('verbTypeCategoryFourth.second')}
    ],
    contentBlocks: [
      {
        type: 'rule',
        title: t('verbTypeCategoryFourth.ruleTitle'),
        content: t('verbTypeCategoryFourth.ruleContent')
      },
      {
        type: 'table', title: t('verbTypeCategoryFourth.form'), content: [
          {person: 'ich', form: 'freue <b>mich</b>'},
          {person: 'du', form: 'freust <b>dich</b>'},
          {person: 'er/sie/es', form: 'freut <b>sich</b>'}
        ]
      },
      {type: 'subheading', title: t('verbTypeCategoryFourth.firstExampleTitle')},
      {
        type: 'examples', content: [
          {
            sentence: 'Ich <b>interessiere mich</b> für Musik.',
            translation: t('verbTypeCategoryFourth.firstExampleTranslate')
          },
          {
            sentence: 'Wir <b>treffen uns</b> um 8 Uhr.',
            translation: t('verbTypeCategoryFourth.secondExampleTranslate')
          }
        ]
      }
    ],
    practice: {
      title: t('verbTypeCategoryFourth.practiceTitle'),
      description: t('verbTypeCategoryFourth.practiceDescription'),
      buttonText: t('verbTypeCategoryFourth.practiceBtn')
    }
  },
  // {
  //     id: 'regular',
  //     title: 'Правильные (слабые)',
  //     tips: [
  //         {text: 'Основа глагола + личное окончание. Например: <b>mach</b>en → ich mach<b>e</b>, du mach<b>st</b>, er mach<b>t</b>.'},
  //         {text: 'В Präteritum добавляется суффикс <b>-te-</b>: ich mach<b>te</b>.'}
  //     ],
  //     contentBlocks: [
  //         {
  //             type: 'rule',
  //             title: 'Краткое правило',
  //             content: 'Слабые глаголы образуют все формы по стандартному, предсказуемому шаблону без изменения корневой гласной. Это самая большая группа глаголов.'
  //         },
  //         {
  //             type: 'table', title: 'Формы', content: [
  //                 {person: 'ich', form: 'mache'},
  //                 {person: 'du', form: 'machst'},
  //                 {person: 'er/sie/es', form: 'macht'}
  //             ]
  //         },
  //         {type: 'subheading', title: 'Примеры'},
  //         {
  //             type: 'examples', content: [
  //                 {sentence: 'Ich <b>mache</b> meine Hausaufgaben.', translation: 'Я делаю домашнее задание.'},
  //                 {sentence: 'Du <b>lernst</b> Deutsch.', translation: 'Ты учишь немецкий.'}
  //             ]
  //         }
  //     ],
  //     practice: {
  //         title: 'Практика (правильные глаголы)',
  //         description: 'Проверь, как ты спрягаешь правильные глаголы.',
  //         buttonText: 'Начать практику'
  //     }
  // }
];

const isContentVisible = ref(false);
const isMobileLayout = ref(false);
const checkScreenSize = () => {
  isMobileLayout.value = window.innerWidth <= 767;
  if (!isMobileLayout.value) isContentVisible.value = false;
};
const closeContent = () => {
  isContentVisible.value = false;
};

const showTips = ref(false);
const activeTipps = ref([]);
const tipRef = ref(null);
let lottieInstance = null;
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
  font-weight: bold;
  background: #4ade80;
}

.content {
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  flex-grow: 1;
  background: #60a5fa;
  padding: 1rem;
  box-shadow: 6px 6px 0px #1e1e1e;
  display: flex;
  flex-direction: column;
  position: relative;
}

.content__header {
  background: #f97028;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 1rem 2rem;
  box-shadow: 8px 8px 0px #1e1e1e;
  margin-bottom: 15px;
}

.content__title {
  color: white;
  font-size: 2.8rem;
  font-weight: 600;
}

.content__body {
  display: flex;
  flex-grow: 1;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 6px 6px 0px #1e1e1e;
  background: #fff;
  overflow: hidden;
  padding: 0;
}

.content__main-column {
  width: 60%;
  padding: 2rem;
  border-right: 3px dashed #e0e0e0;
  overflow-y: auto;
}

.info-section {
  margin-bottom: 25px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section__title {
  font-size: 1.7rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.info-section__description {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

.info-section__subheading {
  font-size: 1.2rem;
  font-weight: bold;
  color: #6c757d;
  margin-bottom: 1rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.example {
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-left: 4px solid #ffab00;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.example__de-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.example__sentence {
  margin: 0;
  font-weight: 500;
}

.example__translation {
  display: block;
  color: #777;
  font-size: 0.95rem;
  margin-top: 5px;
  font-style: italic;
}

.practice-area {
  width: 40%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.practice-area__title {
  font-size: 1.7rem;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.practice-area__description {
  font-size: 1rem;
  color: #777;
  margin-bottom: 20px;
  max-width: 400px;
}

.practice-area__button {
  display: block;
  text-decoration: none;
  background: #f1c40f;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 15px;
  font-size: 1.2rem;
  transition: all 0.1s ease-in-out;
  box-shadow: 4px 4px 0px #1e1e1e;
  width: 100%;
}

.practice-area__button:hover {
  transform: translate(2px, 2px);
  background: #ffe04d;
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

.tips__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
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
  max-width: 600px;
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
  box-shadow: 3px 3px 0 #1e1e1e;
}

.tips__close:hover {
  background: #ff8f50;
}

.tipps__title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.tips__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips__item {
  margin-bottom: 1rem;
}

.tips__text {
  font-size: 1.1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #60a5fa;
}

.btn__back {
  display: block;
  text-align: center;
  width: 100%;
  font-weight: 600;
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

.btn__close {
  position: absolute;
  top: 20px;
  right: 20px;
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
  line-height: 1;
  padding: 0;
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
  }

  .content__title {
    font-size: 1.8rem;
  }
}

@media (max-width: 767px) {
  .verb-types-page {
    position: relative;
    overflow-x: hidden;
    display: block;
    padding: 0;
    gap: 0;
  }

  .sidebar {
    width: 100%;
    height: 100%;
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
  }

  .verb-types-page.content-is-active .content {
    transform: translateX(-100%);
  }

  .btn__close {
    display: flex;
  }
}
</style>