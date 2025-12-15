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
      <h2 class="sidebar__title">{{ t('tenses.times') }}</h2>
      <div class="sidebar__heading">{{ t('verbTypesPage.category') }}</div>
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
        <h1 class="content__title">{{ t('tenses.time') }}: {{ currentTopicData.title }}</h1>
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
          <h3 class="practice-area__title">{{ currentTopicData.practice.title }}</h3>
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

const {t} = useI18n()
const router = useRouter()
const topic = ref('presens')
const isContentVisible = ref(false)
const isMobileLayout = ref(false)
const showTips = ref(false)
const activeTipps = ref([])
const tipRef = ref(null)
let lottieInstance = null

const canonical = useCanonical()

useSeoMeta({
  robots: 'noindex, nofollow'
})

// const pageTitle = t('metaTenses.title')
// const pageDesc = t('metaTenses.description')
//
// useHead({
//   title: pageTitle,
//   link: [
//     { rel: 'canonical', href: canonical }
//   ]
// })
// useSeoMeta({
//   title: pageTitle,
//   description: pageDesc,
//   ogTitle: pageTitle,
//   ogDescription: pageDesc,
//   ogType: 'article',
//   ogUrl: canonical,
//   ogImage: '/images/seo-tenses.png',
//   robots: 'index, follow'
// })

const selectTopic = (id) => {
  topic.value = id
  if (isMobileLayout.value) isContentVisible.value = true
}
const backToMenu = () => router.push('/')
const closeContent = () => {
  isContentVisible.value = false
}
const parseTip = (text) => {
  return text.replace(/'([^']+)'/g, (_, key) => {
    try {
      return t(key)
    } catch {
      return key
    }
  })
}

const topics = [
  {
    id: 'presens',
    title: 'Präsens',
    tips: [
      {text: "'prasensTips.first'"},
      {text: "'prasensTips.second'"},
      {text: "'prasensTips.third'"},
      {text: "'prasensTips.fourth'"}
    ],
    contentBlocks: [
      {type: 'rule', title: t('tenses.howToDo'), content: t('tensesPrasens.howToDo')},
      {type: 'subheading', title: t('tenses.howToUse')},
      {
        type: 'rules', content: [
          t('tensesPrasens.howToUseFirst'),
          t('tensesPrasens.howToUseSecond'),
          t('tensesPrasens.howToUseThird')
        ]
      },
      {type: 'subheading', title: t('tenses.examples')},
      {
        type: 'examples',
        content: [
          {sentence: 'Ich <b>lerne</b> jeden Tag Deutsch.', translation: t('tensesPrasens.example')},
          {sentence: 'Er <b>spielt</b> Fußball.', translation: t('tensesPrasens.exampleTwo')}
        ]
      }
    ],
    practice: {
      title: t('tensesPrasens.questTitle'),
      description: t('tensesPrasens.explain'),
      buttonText: t('tenses.begin')
    }
  },
  {
    id: 'perfect',
    title: 'Perfekt',
    tips: [
      {text: "'perfectTips.first'"},
      {text: "'perfectTips.second'"},
      {text: "'perfectTips.third'"},
      {text: "'perfectTips.fourth'"},
      {text: "'perfectTips.fifth'"},
      {text: "'perfectTips.sixth'"}
    ],
    contentBlocks: [
      {type: 'rule', title: t('tenses.howToDo'), content: 'haben / sein + Partizip II'},
      {type: 'subheading', title: t('tenses.howToUse')},
      {
        type: 'rules', content: [
          t('perfect.howToUseFirst'),
          t('perfect.howToUseSecond')
        ]
      },
      {type: 'subheading', title: t('tenses.examples')},
      {
        type: 'examples',
        content: [
          {sentence: 'Sie <b>hat</b> ein Buch <b>gelesen</b>.', translation: t('perfect.example')},
          {sentence: 'Wir <b>sind</b> ins Kino <b>gegangen</b>.', translation: t('perfect.exampleTwo')}
        ]
      }
    ],
    practice: {
      title: t('perfect.choose'),
      description: t('perfect.explain'),
      buttonText: t('tenses.begin')
    }
  },
  {
    id: 'futurOne',
    title: 'Futur I',
    tips: [
      {text: t('futurOne.tipOne')},
      {text: t('futurOne.tipTwo')},
      {text: t('futurOne.tipThree')},
      {text: t('futurOne.tipFour')},
      {text: t('futurOne.tipFive')},
      {text: t('futurOne.tipSix')}
    ],
    contentBlocks: [
      {type: 'rule', title: t('futurOne.howToDoTitle'), content: t('futurOne.howToDoExample')},
      {type: 'subheading', title: t('futurOne.howToUseTitle')},
      {
        type: 'rules', content: [
          t('futurOne.howToUseFirstExample'),
          t('futurOne.howToUseSecondExample')
        ]
      },
      {type: 'subheading', title: t('futurOne.example')},
      {
        type: 'examples',
        content: [
          {sentence: 'Ich <b>werde</b> morgen <b>lernen</b>.', translation: t('futurOne.translateOne')},
          {sentence: 'Er <b>wird</b> bald <b>kommen</b>.', translation: t('futurOne.translateTwo')},
          {sentence: 'Wir <b>werden</b> nicht <b>schlafen</b>.', translation: t('futurOne.translateThree')}
        ]
      },
      {
        type: 'table',
        title: t('futurOne.tableTitle'),
        content: [
          {person: 'ich', form: 'werde'},
          {person: 'du', form: 'wirst'},
          {person: 'er/sie/es', form: 'wird'},
          {person: 'wir', form: 'werden'},
          {person: 'ihr', form: 'werdet'},
          {person: 'sie/Sie', form: 'werden'}
        ]
      }
    ],
    practice: {
      title: 'Futur I',
      description: t('futurOne.practiceDesc'),
      buttonText: t('futurOne.begin')
    }
  },
  {
    id: 'prateritum',
    title: 'Präteritum',
    tips: [
      {text: "'prateritumTips.first'"},
      {text: "'prateritumTips.second'"},
      {text: "'prateritumTips.third'"},
      {text: "'prateritumTips.fourth'"},
      {text: "'prateritumTips.fifth'"}
    ],
    contentBlocks: [
      {type: 'rule', title: t('tenses.howToDo'), content: t('präteritum.howToDo')},
      {type: 'subheading', title: t('tenses.howToUse')},
      {
        type: 'rules', content: [
          t('präteritum.howToUseFirst'),
          t('präteritum.howToUseSecond')
        ]
      },
      {type: 'subheading', title: t('tenses.examples')},
      {
        type: 'examples',
        content: [
          {sentence: 'Die Prinzessin <b>lebte</b> in einem Schloss.', translation: t('präteritum.example')},
          {sentence: 'Als Kind <b>las</b> ich sehr gern.', translation: t('präteritum.exampleTwo')}
        ]
      }
    ],
    practice: {
      title: t('präteritum.choose'),
      description: t('präteritum.explain'),
      buttonText: t('tenses.begin')
    }
  },
  {
    id: 'plusquamperfect',
    title: 'Plusquamperfekt',
    tips: [
      {text: "'plusquamperfekt.first'"},
      {text: "'plusquamperfekt.second'"},
      {text: "'plusquamperfekt.third'"},
      {text: "'plusquamperfekt.fourth'"},
      {text: "'plusquamperfekt.fifth'"}
    ],
    contentBlocks: [
      {type: 'rule', title: t('tenses.howToDo'), content: 'hatten / waren + Partizip II'},
      {type: 'subheading', title: t('tenses.howToUse')},
      {
        type: 'rules', content: [
          t('pqPerfect.howToUseFirst'),
          t('pqPerfect.howToUseSecond')
        ]
      },
      {type: 'subheading', title: t('tenses.examples')},
      {
        type: 'examples',
        content: [
          {sentence: 'Er <b>hatte</b> schon <b>gegessen</b>, als ich ankam.', translation: t('pqPerfect.example')},
          {
            sentence: 'Nachdem sie die Arbeit <b>beendet hatte</b>, ging sie nach Hause.',
            translation: t('pqPerfect.exampleTwo')
          }
        ]
      }
    ],
    practice: {
      title: t('pqPerfect.choose'),
      description: t('pqPerfect.explain'),
      buttonText: t('tenses.begin')
    }
  }
]
const currentTopicData = computed(() => topics.find((t) => t.id === topic.value))

const openTips = (tipps) => {
  activeTipps.value = tipps
  showTips.value = true
}
const initLottieIcon = async () => {
  await nextTick()
  if (lottieInstance) lottieInstance.destroy()
  if (tipRef.value) {
    lottieInstance = Lottie.loadAnimation({
      container: tipRef.value,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: TipIcon
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
  display: flex;
  width: 100%;
  height: 100vh;
  padding: 20px;
  gap: 20px;
  font-family: "Nunito", sans-serif
}

.sidebar {
  min-width: 350px;
  background: #ffffff;
  border: 3px solid #1e1e1e;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 6px 6px 0px #1e1e1e;
  flex-shrink: 0
}

.sidebar__title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-align: center
}

.sidebar__heading {
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #60a5fa;
  text-transform: uppercase
}

.sidebar__list {
  list-style: none;
  padding: 0;
  margin: 0
}

.sidebar__item {
  margin-bottom: 12px
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
  transition: all .2s ease-in-out;
  box-shadow: 3px 3px 0px #1e1e1e
}

.sidebar__button:hover {
  background: #e0e0e0
}

.sidebar__button:active {
  transform: translate(3px, 3px);
  box-shadow: none
}

.sidebar__item--active .sidebar__button {
  color: #1e1e1e;
  font-weight: bold;
  background: #4ade80
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
  position: relative
}

.content__header {
  background: #f97028;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 1rem 2rem;
  box-shadow: 8px 8px 0px #1e1e1e;
  margin-bottom: 15px
}

.content__title {
  color: #fff;
  font-size: 2.1rem;
  font-weight: 600
}

.content__body {
  display: flex;
  flex-grow: 1;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 6px 6px 0px #1e1e1e;
  background: #fff;
  overflow: hidden;
  padding: 0
}

.content__main-column {
  width: 60%;
  padding: 2rem;
  border-right: 3px dashed #e0e0e0;
  overflow-y: auto
}

.info-section {
  margin-bottom: 25px
}

.info-section:last-child {
  margin-bottom: 0
}

.info-section__title {
  font-size: 1.7rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333
}

.info-section__description {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6
}

.info-section__subheading {
  font-size: 1.2rem;
  font-weight: bold;
  color: #6c757d;
  margin-bottom: 1rem;
  border-bottom: 2px solid #eee;
  padding-bottom: .5rem
}

.rules-list {
  margin: 0;
  padding-left: 1.2rem;
}

.rules-item {
  margin-bottom: .5rem;
  list-style: disc;
  color: #555;
  font-size: 1.05rem;
}

.example {
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-left: 4px solid #ffab00;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 1.1rem
}

.example__de-text {
  display: flex;
  justify-content: space-between;
  align-items: center
}

.example__sentence {
  margin: 0;
  font-weight: 500
}

.example__translation {
  display: block;
  color: #777;
  font-size: .95rem;
  margin-top: 5px;
  font-style: italic
}

.practice-area {
  width: 40%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center
}

.practice-area__title {
  font-size: 1.7rem;
  font-weight: bold;
  margin: 0 0 10px 0
}

.practice-area__description {
  font-size: 1rem;
  color: #777;
  margin-bottom: 20px;
  max-width: 400px
}

.practice-area__button {
  min-width: 230px;
  display: block;
  font-weight: 600;
  background: #f1c40f;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 15px;
  font-size: 1.2rem;
  transition: all .1s ease-in-out;
  box-shadow: 3px 3px 0 #1e1e1e;
}

.practice-area__button:hover {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 #1e1e1e;
  background: #ffe04d
}

.practice-area__button:active {
  transform: translate(4px, 4px);
  box-shadow: none
}

.declension-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.1rem
}

.declension-table th, .declension-table td {
  border: 2px solid #1e1e1e;
  padding: 10px;
  text-align: center
}

.declension-table th {
  background-color: #ffd166
}

.declension-table td {
  background-color: #fff
}

.declension-table td:first-child {
  background-color: #f0f0f0
}

.info__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px
}

.info__icon-tips {
  width: 60px;
  height: 60px;
  cursor: pointer;
  border: none;
  background: none
}

.tips__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, .5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center
}

.tips__content {
  position: relative;
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0 #1e1e1e;
  width: 90%;
  max-width: 600px
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
  box-shadow: 3px 3px 0 #1e1e1e
}

.tips__close:hover {
  background: #ff8f50
}

.tipps__title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem
}

.tips__list {
  list-style: none;
  padding: 0;
  margin: 0
}

.tips__item {
  margin-bottom: 1rem
}

.tips__text {
  font-size: 1.1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #60a5fa
}

.btn__back {
  display: block;
  text-align: center;
  width: 100%;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  padding: .8rem;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  background-color: #f1c40f;
  color: #1e1e1e;
  text-decoration: none;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  transition: background-color .2s
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
  padding: 0
}

@media (max-width: 1024px) {
  .content__body {
    flex-direction: column
  }

  .content__main-column, .practice-area {
    width: 100%;
    border-right: none;
    padding: 1rem
  }

  .content__main-column {
    border-bottom: 3px dashed #cccccc;
    padding-bottom: 2rem
  }

  .practice-area {
    padding-top: 2rem
  }

  .content__title {
    font-size: 1.8rem
  }
}

@media (max-width: 767px) {
  .verb-types-page {
    position: relative;
    overflow-x: hidden;
    display: block;
    padding: 0;
    gap: 0
  }

  .sidebar {
    width: 100%;
    height: 100%;
    min-width: unset;
    border-radius: 0;
    box-shadow: none;
    border: none
  }

  .content {
    position: absolute;
    top: 0;
    left: 100%;
    width: 100%;
    height: 100%;
    z-index: 50;
    transition: transform .4s ease-in-out;
    border-radius: 0;
    box-shadow: -5px 0 15px rgba(0, 0, 0, .2)
  }

  .verb-types-page.content-is-active .content {
    transform: translateX(-100%)
  }

  .btn__close {
    display: flex
  }
}
</style>
