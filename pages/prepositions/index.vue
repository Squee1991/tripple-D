<template>
  <div class="comparison-page" :class="{ 'content-is-active': isContentVisible }">
    <VTips
        v-model="showTips"
        :title="t('prepositionsIndexPage.tipsTitle')"
        :tips="currentTopicData?.tips"
    />
    <div class="sidebar">
      <div class="sidebar__header">
        <VBackBtn/>
        <h2 class="sidebar__title">{{ t('prepositionsIndexPage.prepositionsTitleNav')}}</h2>
      </div>
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
      <header class="content__header">
        <button @click="closeContent" class="btn-icon-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
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
              <h3 class="info-section__title">{{ t('prepositionsIndexPage.rule')}}</h3>
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
            <h3 class="info-section__title">{{ t('prepositionsIndexPage.examples')}}</h3>
            <div v-if="currentTopicData.examples && currentTopicData.examples.length">
              <div v-for="(example, index) in currentTopicData.examples" :key="index" class="example">
                <div class="example__line">
                  <p class="example__sentence" v-html="example.sentence"></p>
                  <SoundBtn :text="example.sentence"/>
                </div>
                <span class="example__translation">{{ example.translation }}</span>
              </div>
            </div>
            <div v-if="currentTopicData.specialCases">
              <div
                  v-for="caseGroup in currentTopicData.specialCases"
                  :key="caseGroup.title"
                  class="special-case-group"
              >
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useHead, useSeoMeta} from '#imports'
import { useRouter } from 'vue-router'
import SoundBtn from '../../src/components/soundBtn.vue'
import Lottie from 'lottie-web'
import TipIcon from '../../assets/animation/info.json'
import VTips from '../../src/components/V-tips.vue'
import VBackBtn from "../../src/components/V-back-btn.vue";

const { t} = useI18n()
const router = useRouter()
const categoryId = 'prepositions'

useSeoMeta({
  robots: 'noindex, nofollow'
})

const topics = [
  {
    id: 'nominativ',
    title: 'Nominativ',
    rule: t('nominativ.rule'),
    tips: [
      { text: t('nominativ.tipOne') },
      { text: t('nominativ.tipTwo') },
      { text: t('nominativ.tipThree') }
    ],
    examples: [
      { sentence: 'Das ist ein Tisch.', translation: t('nominativ.translateExampleOne') },
      { sentence: 'Der Mann ist Lehrer.', translation: t('nominativ.translateExampleTwo') },
      { sentence: 'Berlin ist die Hauptstadt.', translation: t('nominativ.translateExampleThree') }
    ],
    practice: {
      title: t('nominativ.practiceTitle'),
      description: t('nominativ.practiceDescription'),
      buttonText: t('nominativ.start')
    }
  },
  {
    id: 'akkusativ',
    title: 'Akkusativ',
    rule: t('akkusativ.rule'),
    tips: [
      { text: t('akkusativ.tipOne') },
      { text: t('akkusativ.tipTwo') },
      { text: t('akkusativ.tipThree') },
      { text: t('akkusativ.tipFour') }
    ],
    examples: [
      { sentence: 'Wir gehen durch den Park.', translation: t('akkusativ.translateOne') },
      { sentence: 'Das Geschenk ist für den Lehrer.', translation: t('akkusativ.translateTwo') },
      { sentence: 'Ich bin gegen den Plan.', translation: t('akkusativ.translateThree') },
      { sentence: 'Er kommt ohne den Regenschirm.', translation: t('akkusativ.translateFour') },
      { sentence: 'Wir sitzen um den Tisch.', translation: t('akkusativ.translateFive') },
      { sentence: 'Ich bleibe bis nächsten Montag.', translation: t('akkusativ.translateSix') },
      { sentence: 'Wir gehen den Fluss entlang.', translation: t('akkusativ.translateSeven') }
    ],
    practice: {
      title: t('akkusativ.practiceTitle'),
      description: t('akkusativ.practiceDescription'),
      buttonText: t('akkusativ.start')
    }
  },
  {
    id: 'dativ',
    title: 'Dativ',
    rule: t('dativ.rule'),
    tips: [
      { text: t('dativ.tipOne') },
      { text: t('dativ.tipTwo') },
      { text: t('dativ.tipThree') }
    ],
    examples: [
      { sentence: 'Er kommt aus dem Haus.', translation: t('dativ.translateOne') },
      { sentence: 'Außer dem Kind war niemand da.', translation: t('dativ.translateTwo') },
      { sentence: 'Ich wohne bei meinen Eltern.', translation: t('dativ.translateThree') },
      { sentence: 'Wir fahren mit dem Auto.', translation: t('dativ.translateFour') },
      { sentence: 'Nach dem Essen lernen wir.', translation: t('dativ.translateFive') },
      { sentence: 'Ich lerne seit einem Jahr Deutsch.', translation: t('dativ.translateSix') },
      { sentence: 'Der Zug fährt vom Bahnhof.', translation: t('dativ.translateSeven') },
      { sentence: 'Ich gehe zur Schule.', translation: t('dativ.translateEight') },
      { sentence: 'Dem Haus gegenüber ist ein Park.', translation: t('dativ.translateNine') }
    ],
    practice: {
      title: t('dativ.practiceTitle'),
      description: t('dativ.practiceDescription'),
      buttonText: t('dativ.start')
    }
  },
  {
    id: 'genitiv',
    title: 'Genitiv',
    rule: t('genitiv.rule'),
    tips: [
      { text: t('genitiv.tipOne') },
      { text: t('genitiv.tipTwo') },
      { text: t('genitiv.tipThree') }
    ],
    examples: [
      { sentence: 'Statt des Zuckers nehme ich Honig.', translation: t('genitiv.translateOne') },
      { sentence: 'Trotz des Regens gehen wir spazieren.', translation: t('genitiv.translateTwo') },
      { sentence: 'Während des Unterrichts ist das Handy aus.', translation: t('genitiv.translateThree') },
      { sentence: 'Wegen der Kälte bleiben wir zu Hause.', translation: t('genitiv.translateFour') },
      { sentence: 'Außerhalb der Stadt ist es ruhiger.', translation: t('genitiv.translateFive') },
      { sentence: 'Innerhalb einer Woche bekommst du die Antwort.', translation: t('genitiv.translateSix') },
      { sentence: 'Jenseits des Flusses liegt ein Dorf.', translation: t('genitiv.translateSeven') },
      { sentence: 'Aufgrund der Arbeiten ist die Straße gesperrt.', translation: t('genitiv.translateEight') }
    ],
    practice: {
      title: t('genitiv.practiceTitle'),
      description: t('genitiv.practiceDescription'),
      buttonText: t('genitiv.start')
    }
  }
]

const topic = ref('nominativ')
const currentTopicData = computed(() => topics.find(t => t.id === topic.value))

const showTips = ref(false)
const activeTipps = ref([])
const tipRef = ref(null)
let lottieInstance = null
let animationInterval = null

const isContentVisible = ref(false)
const isMobileLayout = ref(false)

const checkScreenSize = () => {
  isMobileLayout.value = window.innerWidth <= 767
  if (!isMobileLayout.value) {
    isContentVisible.value = false
  }
}

const closeContent = () => {
  isContentVisible.value = false
}

const selectTopic = (id) => {
  topic.value = id
  if (isMobileLayout.value) {
    nextTick(() => {
      isContentVisible.value = true
    })
  }
}

const openTips = (tipps) => {
  activeTipps.value = tipps
  showTips.value = true
}

const initLottieIcon = async () => {
  await nextTick()
  if (animationInterval) clearInterval(animationInterval)
  if (lottieInstance) lottieInstance.destroy()

  if (tipRef.value) {
    lottieInstance = Lottie.loadAnimation({
      container: tipRef.value,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: TipIcon
    })
    animationInterval = setInterval(() => {
      if (lottieInstance) {
        lottieInstance.stop()
        lottieInstance.play()
      }
    }, 10000)
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  initLottieIcon()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  if (animationInterval) clearInterval(animationInterval)
  if (lottieInstance) lottieInstance.destroy()
})

watch(currentTopicData, () => {
  initLottieIcon()
})
</script>

<style scoped>

.comparison-page {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: "Nunito", sans-serif;
  background: var(--bg);
  box-sizing: border-box;
  gap: 20px;
  padding: 20px;
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
  min-width: 350px;
  background: var(--bg);
  border: 3px solid #1e1e1e;
  border-radius: 15px;
  box-shadow: 6px 6px 0px #1e1e1e;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar__header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  margin-bottom: 10px;
}

.sidebar__title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 0 15px;
  text-align: center;
  color: var(--titleColor);
}

.sidebar__list {
  list-style: none;
  padding: 10px 15px;
  margin: 0;
  overflow-y: auto;
}

.sidebar__item {
  margin-bottom: 12px;
}

.sidebar__button {
  width: 100%;
  text-align: center;
  padding: 15px 20px;
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

.content {
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  flex-grow: 1;
  background: #a855f7;
  padding: 1rem;
  box-shadow: 6px 6px 0px #1e1e1e;
  display: flex;
  flex-direction: column;
  position: relative;

}

.content__header {
  background: var(--bg);
  border-radius: 12px;
  padding: 5px 10px 15px 10px;
  box-shadow: var(--boxShadowMobile);
  display: flex;
  align-items: center;
}

.content__title {
  color: var(--titleColor);
  font-size: 23px;
  font-weight: bold;
  margin-left: 15px;
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
  transform: translate(3px, 3px);
  box-shadow: none;
}

.content__body {
  display: flex;
  flex-grow: 1;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 6px 6px 0px #1e1e1e;
  background: var(--bg);
  overflow: hidden;
  padding: 0;
}

.content__main-column {
  width: 60%;
  padding: 2rem;
  border-right: 3px dashed #1e1e1e;
  overflow-y: auto;
}

.info-section {
  margin-bottom: 25px;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info__wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
  background: white;
  border-radius: 15px;
}

.info-section__title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: #131313;
}

.info__icon-tips {
  width: 60px;
  height: 60px;
  cursor: pointer;
  border: none;
  background: none;
}

.info-section__description {
  font-size: 1.1rem;
  color: var(--titleColor);
  line-height: 1.6;
}

.special-case-group {
  margin-bottom: 2rem;
}

.special-case-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--titleColor);
  margin-bottom: 1rem;
  border-bottom: 2px solid #1e1e1e;
  padding-bottom: 0.5rem;
}

.example {
  background-color: white;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-left: 6px solid #ffab00;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 12px;
  font-size: 1.2rem;
}

.example__line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.example__sentence {
  margin: 0;
  font-weight: 500;
  color: #252424;
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
  padding: 2rem;
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
  color: var(--titleColor);
}

.practice-area__description {
  font-size: 1.1rem;
  color: var(--titleColor);
  margin-bottom: 20px;
  max-width: 400px;
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
    padding-bottom: 2rem;
  }
  .practice-area {
    padding-top: 10px;
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
    transition: transform 0.2s ease-in-out;
    border-radius: 0;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
    border: none;
    padding: 0;
    background: var(--bg);
  }

  .comparison-page.content-is-active .content {
    transform: translateX(-100%);
  }
  .content__header {
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: none;
    margin-bottom: 0;
  }

  .content__body {
    border: none;
    border-radius: 0;
    box-shadow: none;
  }
}
</style>