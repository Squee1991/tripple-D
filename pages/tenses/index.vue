<template>
  <main class="tenses-layout" :class="{ 'content-is-active': isContentVisible }">
    <div v-if="showTips" class="tips__overlay" @click.self="showTips = false">
      <div class="tips__content">
        <button class="tips__close" @click="showTips = false">×</button>
        <!--                <h2 class="tipps__title"> Советы : </h2>-->
        <ul class="tips__list">
          <li
              v-for="(tip, index) in activeTipps"
              :key="tip.text"
              class="tips__item"
          >
            <div class="tips__text-xl" :class="['tips__text', { 'tips__under': index === activeTipps.length - 1 }]">
              {{ t(tip.text) }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--        <VTips-->
    <!--            v-model="showTips"-->
    <!--            :tips="activeTipps"-->
    <!--        />-->
    <aside class="tenses-sidebar">
<!--      <NuxtLink to="/" class="sidebar-button-home">{{ t('tenses.barBtn') }}</NuxtLink>-->
      <VBackBtn/>
      <h2 class="tenses-sidebar__title">{{ t('tenses.times') }}</h2>
      <div v-for="group in tenseGroups" :key="group.level" class="level-group">
        <h3 class="level-group__title">{{ group.level }}</h3>
        <ul class="tense-menu">
          <li
              v-for="tense in group.tenses"
              :key="tense.name"
              class="tense-menu__item"
          >
            <a
                class="tense-menu__link"
                :class="{ 'tense-menu__link--is-active': selectedTense?.name === tense.name }"
                @click.prevent="selectTense(tense)"
            >
              <span class="tense-menu__icon">📚</span>
              <span class="tense-menu__name">{{ tense.name }}</span>
              <span class="tense-menu__badge">{{ tense.level }}</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
    <div class="tenses-content">
      <button v-if="showCloseButton" class="close-content-btn" @click="closeContent">×</button>
      <div v-if="selectedTense" class="content-block">
        <h1 class="content-block__title">
          {{ t('tenses.time') }}: {{ selectedTense.name }}
        </h1>
        <div class="tense-module">
          <div class="tense-module__info">
            <div
                v-for="(block, index) in selectedTense.infoBlocks"
                :key="index"
                class="info-block"
            >
              <div class="info__wrapper">
                <h4 class="info-block__title">{{ t(block.title) }}</h4>
                <button
                    title="Советы по теме"
                    v-if="block.tipps"
                    class="info__icon-tips"
                    :ref="el => tipRefs[index] = el"
                    @click="openTips(block.tipps, index)"
                ></button>
              </div>
              <div v-if="block.type === 'formula'" class="info-block__formula">
                {{ t(block.content) }}
              </div>
              <ul v-else-if="block.type === 'rules'" class="info-block__rules">
                <li v-for="rule in block.content" :key="rule">{{ t(rule) }}</li>
              </ul>

              <ul v-else-if="block.type === 'examples'" class="example-list">
                <li v-for="example in block.content" :key="example.sentence" class="example-item">
                  <div class="example__de-item">
                    <div class="example-item__sentence" v-html="t(example.sentence)"></div>
                    <SoundBtn :text="example.sentence"/>
                  </div>

                  <p class="example-item__translation">{{ t(example.translation) }}</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="tense-module__practice">
            <div class="practice-list">
              <div
                  v-for="drill in selectedTense.drills"
                  :key="drill.title"
                  class="practice-list__item"
              >
                <div class="practice-list__details">
                  <h4 class="practice-list__title">{{ t(drill.title) }}</h4>
                  <p class="practice-list__description">{{ t(drill.description) }}</p>
                </div>
                <NuxtLink :to="drill.url" class="practice-list__button">
                  {{ t('tenses.begin') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="placeholder">
        <p>👈 {{ t('tenses.chooseHint') }}</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import {ref, onMounted, onUnmounted, watch, nextTick} from 'vue'
import Lottie from 'lottie-web'
import TipIcon from '../../assets/animation/info.json'
import SoundBtn from '../../src/components/soundBtn.vue'
import VTips from "~/src/components/V-tips.vue";
import VBackBtn from "~/src/components/V-back-btn.vue";

const {t} = useI18n()
const selectedTense = ref(null)
const showTips = ref(false)
const activeTipps = ref([])
const isContentVisible = ref(false)
const showCloseButton = ref(false)
const isMobileLayout = ref(false)
const tipRefs = ref([])
const lottieInstances = ref([])
const interval = ref(null)

const openTips = (tipps, index) => {
  activeTipps.value = tipps
  showTips.value = true
}
const tenseGroups = ref([
  {
    level: 'A1 - A2',
    tenses: [
      {
        name: 'Präsens',
        level: 'A1',
        infoBlocks: [
          {
            title: 'tenses.howToDo',
            icon: TipIcon,
            type: 'formula',
            content: 'tensesPrasens.howToDo',
            tipps: [
              {text: "prasensTips.first"},
              {text: "prasensTips.second"},
              {text: "prasensTips.third"},
              {text: "prasensTips.fourth", className: "tips__under"},
            ]

          },
          {
            title: 'tenses.howToUse',
            type: 'rules',
            content: ['tensesPrasens.howToUseFirst', 'tensesPrasens.howToUseSecond', 'tensesPrasens.howToUseThird']
          },
          {
            title: 'tenses.examples',
            type: 'examples',
            content: [
              {
                sentence: 'Ich <b>lerne</b> jeden Tag Deutsch.',
                translation: 'tensesPrasens.example'
              },
              {
                sentence: 'Er <b>spielt</b> Fußball.',
                translation: 'tensesPrasens.exampleTwo'
              }
            ]
          }
        ],
        drills: [{
          icon: '✍️',
          title: 'tensesPrasens.questTitle',
          description: 'tensesPrasens.explain',
          url: '/tenses/prasens'
        }]
      },
      {
        name: 'Perfekt',
        level: 'A2',
        infoBlocks: [
          {
            title: 'tenses.howToDo',
            icon: TipIcon,
            type: 'formula',
            content: 'haben / sein + Partizip II',
            tipps: [
              {text: 'perfectTips.first'},
              {text: 'perfectTips.second'},
              {text: 'perfectTips.third'},
              {text: 'perfectTips.fourth'},
              {text: 'perfectTips.fifth'},
              {text: 'perfectTips.sixth'}
            ]
          },

          {
            title: 'tenses.howToUse',
            type: 'rules',
            content: ['perfect.howToUseFirst', 'perfect.howToUseSecond'],
          },
          {
            title: 'tenses.examples',
            type: 'examples',
            content: [
              {
                sentence: 'Sie <b>hat</b> ein Buch <b>gelesen</b>.',
                translation: 'perfect.example'
              },
              {
                sentence: 'Wir <b>sind</b> ins Kino <b>gegangen</b>.',
                translation: 'perfect.exampleTwo'
              }
            ]
          }
        ],
        drills: [
          {
            icon: '',
            title: 'perfect.choose',
            description: 'perfect.explain',
            url: '/tenses/past-auxiliary'
          },
          {
            icon: '',
            title: 'perfect.chooseTwo',
            description: 'perfect.explainTwo',
            url: '/tenses/past-participle'
          }
        ]
      },
      {
        name: 'Futur I',
        level: 'A2',
        infoBlocks: [
          {
            title: 'Как образуется?',
            icon: TipIcon,
            type: 'formula',
            content: 'werden (в Präsens) + инфинитив в конце',
            tipps: [
              {text: '1. Вспомогательный глагол werden спрягается: ich werde, du wirst, er/sie/es wird и т.д.'},
              {text: '2. Основной глагол (инфинитив) ставится в конец предложения'},
              {text: '3. Используется для обозначения будущих действий'},
              {text: '4. Заменяет Präsens, если нужно подчеркнуть намерение или сделать предположение'},
              {text: '5. Пример: Ich werde lernen. / Er wird bald kommen.'},
              {text: '6. Вопросительное предложение: Wirst du morgen kommen?'}
            ]
          },
          {
            title: 'Когда используется?',
            type: 'rules',
            content: [
              'Планируемые действия в будущем',
              'Предположения о настоящем или будущем'
            ]
          },
          {
            title: 'Примеры',
            type: 'examples',
            content: [
              {
                sentence: 'Ich <b>werde</b> morgen <b>lernen</b>.',
                translation: 'Я буду учиться завтра.'
              },
              {
                sentence: 'Er <b>wird</b> bald <b>kommen</b>.',
                translation: 'Он скоро придёт.'
              }
            ]
          }
        ],
        drills: [
          {
            icon: '',
            title: 'Спряжение werden',
            description: 'Выберите правильную форму глагола werden в зависимости от лица.',
            url: '/tenses/futur-session'
          },
        ]
      }

    ]
  },
  {
    level: 'B1',
    tenses: [
      {
        name: 'Präteritum',
        level: 'B1',
        infoBlocks: [
          {
            title: 'tenses.howToDo',
            icon: TipIcon,
            type: 'formula',
            content: 'präteritum.howToDo',
            tipps: [
              {text: 'prateritumTips.first'},
              {text: 'prateritumTips.second'},
              {text: 'prateritumTips.third'},
              {text: 'prateritumTips.fourth'},
              {text: 'prateritumTips.fifth'}
            ]

          },
          {
            title: 'tenses.howToUse',
            type: 'rules',
            content: ['präteritum.howToUseFirst', 'präteritum.howToUseSecond'],

          },
          {
            title: 'tenses.examples',
            type: 'examples',
            content: [
              {
                sentence: 'Die Prinzessin <b>lebte</b> in einem Schloss.',
                translation: 'präteritum.example'
              },
              {
                sentence: 'Als Kind <b>las</b> ich sehr gern.',
                translation: 'präteritum.exampleTwo'
              }
            ]
          }
        ],
        drills: [{
          icon: '📖',
          title: 'präteritum.choose',
          description: 'präteritum.explain',
          url: '/tenses/prateritum-session'
        }]
      },
      {
        name: 'Plusquamperfekt',
        level: 'B1',
        infoBlocks: [
          {
            title: 'tenses.howToDo',
            icon: TipIcon,
            type: 'formula',
            content: 'hatten / waren + Partizip II',
            tipps: [
              {text: 'plusquamperfekt.first'},
              {text: 'plusquamperfekt.second'},
              {text: 'plusquamperfekt.third'},
              {text: 'plusquamperfekt.fourth'},
              {text: 'plusquamperfekt.fifth'}
            ]
          },
          {
            title: 'tenses.howToDo',
            type: 'rules',
            icon: TipIcon,
            content: ['pqPerfect.howToUseFirst', 'pqPerfect.howToUseSecond'],

          },
          {
            title: 'tenses.examples',
            type: 'examples',
            content: [
              {
                sentence: 'Er <b>hatte</b> schon <b>gegessen</b>, als ich ankam.',
                translation: 'pqPerfect.example'
              },
              {
                sentence: 'Nachdem sie die Arbeit <b>beendet hatte</b>, ging sie nach Hause.',
                translation: 'pqPerfect.exampleTwo'
              }
            ]
          }
        ],
        drills: [{
          icon: '⏪',
          title: 'pqPerfect.choose',
          description: 'pqPerfect.explain',
          url: '/tenses/plusquamperfekt-session'
        }]
      },
    ]
  }
]);

const initLottieIcons = async () => {
  await nextTick()
  lottieInstances.value.forEach(i => i?.destroy())
  lottieInstances.value = []

  tipRefs.value.forEach(container => {
    if (!container) return
    const instance = Lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: TipIcon
    })
    lottieInstances.value.push(instance)
  })
}

const checkScreenSize = () => {
  isMobileLayout.value = window.innerWidth <= 1024
  showCloseButton.value = isMobileLayout.value
  if (!isMobileLayout.value) isContentVisible.value = false
}

const closeContent = () => {
  isContentVisible.value = false
}

onMounted(async () => {
  window.addEventListener('resize', checkScreenSize)
  checkScreenSize()
  if (!isMobileLayout.value) selectedTense.value = tenseGroups.value[0].tenses[0]
  await initLottieIcons()

  interval.value = setInterval(() => {
    lottieInstances.value.forEach(instance => {
      instance?.stop()
      instance?.play()
    })
  }, 15000)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  lottieInstances.value.forEach(i => i?.destroy())
  clearInterval(interval.value)
})

watch(selectedTense, async () => {
  await initLottieIcons()
})

function selectTense(tense) {
  selectedTense.value = tense
  if (isMobileLayout.value) isContentVisible.value = true
}

</script>

<style scoped>
.practice-list__item {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.example__de-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info__icon-tips {
  width: 60px;
  cursor: pointer;
  background: none;
  border: none;
}

.info__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.practice-list {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.example-item {
  background-color: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-left: 4px solid #ffab00;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.example-item__sentence {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
}

.example-item__translation {
  font-size: 0.95rem;
  color: #777;
  margin: 0;
  font-style: italic;
}

.tenses-layout {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  height: 100vh;
}

.tenses-sidebar {
  min-width: 350px;
  background-color: #ffffff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 6px 6px 0px #1e1e1e;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-button-home {
  display: block;
  text-align: center;
  width: 100%;
  font-family: "Nunito", sans-serif;
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

.sidebar-button-home:hover {
  background-color: #ffe04d;
}

.tenses-sidebar__title {
  font-family: "Nunito", sans-serif;
  font-size: 1.8rem;
  margin: 0 0 1.5rem 0;
  text-align: center;
}


.level-group__title {
  font-size: 1.4rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #60a5fa;
  font-family: "Nunito", sans-serif;
  margin: 0 0 1rem 0.25rem;
}

.tense-menu__link {
  display: flex;
  align-items: center;
  padding: 0.9rem 1.1rem;
  margin-bottom: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-left: 4px solid transparent;
}

.tense-menu__link:hover {
  background-color: #f5f5f5;
}

.tense-menu__link--is-active {
  background-color: #4ade80;
  font-weight: bold;
}

.tense-menu__name {
  font-size: 1.3rem;
  font-weight: 600;
  flex-grow: 1;
  padding: 10px;
  font-family: "Nunito", sans-serif;
}

.tense-menu__badge {
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 8px;
}

.tense-menu__link--is-active .tense-menu__badge {
  color: #1e1e1e;
}

.tenses-content {
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 6px 6px 0px #1e1e1e;
  overflow: hidden;
  border-radius: 16px;
  font-family: "Nunito", sans-serif;
}

.content-block {
  background-color: #60a5fa;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  box-shadow: 6px 6px 0px #1e1e1e;
  position: relative;
}

.content-block__title {
  font-family: "Nunito", sans-serif;
  font-size: 2.8rem;
  font-weight: 600;
  color: white;
  background: #f97028;
  padding: 1rem 2rem;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 8px 8px 0px #1e1e1e;
  margin-bottom: 15px;
}

.tense-module {
  background-color: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  box-shadow: 6px 6px 0px #1e1e1e;
}

.tense-module__content {
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  font-family: "Nunito", sans-serif;
}

.tense-module__info, .tense-module__practice {
  padding: 2rem;
}

.tense-module__info {
  border-right: 3px dashed #e0e0e0;
  width: 50%;
  overflow-y: auto;
}

.info-block {
  margin-bottom: 1rem;
}

.info-block__title {
  font-size: 1.7rem;
  font-weight: bold;
}

.info-block__formula {
  font-size: 1.1rem;
  font-family: "Nunito", sans-serif;
}

.info-block__rules {
  list-style: none;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.info-block__rules li {
  padding-left: 2rem;
  position: relative;
  margin-bottom: 5px;
}

.info-block__rules li::before {
  content: "✓";
  color: #00c853;
  font-weight: bold;
  font-size: 1.2rem;
  position: absolute;
  left: 0;
}

.practice-list__icon {
  max-width: 230px;
  margin-bottom: 10px;
}

.practice-list__title {
  font-size: 1.7rem;
  font-weight: bold;
  padding: 0 0 15px 0;
}

.practice-list__description {
  font-size: 1rem;
  font-family: "Nunito", sans-serif;
  color: #777;
  margin-bottom: 15px;
}

.practice-list__button {
  text-align: center;
  width: 100%;
  border: 3px solid #1e1e1e;
  padding: 15px;
  background: #f1c40f;
  border-radius: 16px;
  cursor: pointer;
  color: #1e1e1e;
  font-size: 1.2rem;
  font-family: "Nunito", sans-serif;
  box-shadow: 4px 4px 0px #1e1e1e;
  transition: all 0.1s ease-in-out;
  margin-bottom: 1.5rem;
}

.practice-list__button:hover {
  transform: translate(2px, 2px);
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
  color: #fff;
}

.close-content-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  background-color: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 50%;
  font-size: 28px;
  font-weight: bold;
  color: #1e1e1e;
  cursor: pointer;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  padding: 0;
}

.tips__text {
  font-size: 1.1rem;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #60a5fa;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
}

.tips__item {
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: #333;
  position: relative;
}

@media (max-width: 1023px) {
  .tenses-layout {
    display: block;
    position: relative;
    overflow-x: hidden;
  }

  .content-block__title {
    font-size: 1.6rem;
  }

  .tenses-sidebar {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    border: none;
    box-shadow: none;
    min-width: unset;
  }

  .tenses-content {
    position: absolute;
    top: 0;
    left: 100%;
    width: 100%;
    height: 100vh;
    border-radius: 0;
    z-index: 50;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform: translateX(0);
  }

  .tense-module {
    flex-direction: column;
  }

  .tenses-layout.content-is-active .tenses-content {
    transform: translateX(-100%);
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  }

  .tense-module__content {
    display: flex;
    flex-direction: column;
  }

  .tense-module__info,
  .tense-module__practice {
    width: 100%;
    padding: 10px 30px;
    border-right: none;
  }

  .tips__text {
    color: #222;
    font-size: .9rem;

  }

  .tips__item {
    margin-bottom: 10px;
    font-size: 1.1rem;
    color: #333;
    position: relative;
  }
}


.tips__overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tips__content {
  position: relative;
  z-index: 9999;
  font-family: "Nunito", sans-serif;
  border: 3px solid #1e1e1e;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 8px 8px 0 #1e1e1e;
  width: 80%;
  max-width: 600px;
}

.tips__close {
  position: absolute;
  top: 3px;
  right: 10px;
  background: #f97028;
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-weight: bold;
  border: 2px solid #1e1e1e;
  box-shadow: 3px 3px 0 #1e1e1e;
  transition: background 0.2s;
}

.tips__close:hover {
  background: #ff8f50;
}

.tips__list {
  padding: 5px;
}

.tipps__title {
  padding: 12px 0;
  font-size: 25px;
}

.tips__under {
  background: #fffde7;
  border-left-color: #fbc02d;
  font-weight: bold;
  color: #000;
}

</style>