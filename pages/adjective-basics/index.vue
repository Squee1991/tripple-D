<template>
  <div class="adjective-page" :class="{ 'content-is-active': isContentVisible }">
    <div class="sidebar">
      <div class="sidebar__header">
        <VBackBtn/>
        <h2 class="sidebar__title">{{ t('Основы') }}</h2>
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
        <h1 class="content__title">{{ t('adjectiveBasicPageSideBar.adjective') }} {{ currentTopicData.title }}</h1>
      </header>
      <div class="content__body">
        <div class="content__main-column">
          <section class="info-section">
            <h3 class="info-section__title">{{ t('adjectiveBasicPageSideBar.example') }}</h3>
            <div v-for="(example, index) in currentTopicData.examples" :key="index" class="example">
              <div class="example__de-text">
                <p class="example__sentence">
                  {{ example.sentence_part1 }}
                  <span class="example__highlight">{{ example.highlight }}</span>
                  <template v-if="example.sentence_part2">{{ example.sentence_part2 }}</template>
                </p>
                <SoundBtn :text="example.sentence_part1 + example.highlight"/>
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
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import SoundBtn from '../../src/components/soundBtn.vue'
import { useHead, useSeoMeta } from '#imports'
import VBackBtn from "../../src/components/V-back-btn.vue";
import VArrowNav from "~/src/components/V-arrowNav.vue";

const { t } = useI18n();

useSeoMeta({
  robots: 'noindex, nofollow'
})

const topics = [
  {
    id: 'colors',
    title: t('adjectiveBasicPageSideBar.first'),
    examples: [
      {
        sentence_part1: 'Die Blume ist ',
        highlight: 'rot',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleFirstColors')
      },
      {
        sentence_part1: 'Der Himmel ist ',
        highlight: 'blau',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleSecondColors')
      },
      {
        sentence_part1: 'Das Gras ist ',
        highlight: 'grün',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleThirdColors')
      }
    ],
    practice: {
      title: 'Практика',
      description: 'Проверьте, как хорошо вы знаете названия цветов на немецком.',
      buttonText: 'Начать практику',
    }
  },
  {
    id: 'feelings',
    title: t('adjectiveBasicPageSideBar.fourth'),
    examples: [
      {
        sentence_part1: 'Ich bin sehr ',
        highlight: 'glücklich',
        sentence_part2: ' heute.',
        translation: t('adjectiveBasicPageSideBar.exampleFirstFeelings')
      },
      {
        sentence_part1: 'Warum bist du ',
        highlight: 'traurig',
        sentence_part2: '?',
        translation: t('adjectiveBasicPageSideBar.exampleSecondFeelings')
      },
      {
        sentence_part1: 'Nach der Arbeit ist er immer ',
        highlight: 'müde',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleThirdFeelings')
      }
    ],
    practice: {
      title: t('adjectiveBasicPracticeSide.title'),
      description: t('adjectiveBasicPracticeSide.descriptionSecond'),
      buttonText: t('adjectiveBasicPracticeSide.buttonText'),
    }
  },
  {
    id: 'appearance',
    title: t('adjectiveBasicPageSideBar.second'),
    examples: [
      {
        sentence_part1: 'Der Mann ist ',
        highlight: 'groß',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleFirstAppearance')
      },
      {
        sentence_part1: 'Das Haus ist ',
        highlight: 'alt',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleSecondAppearance')
      },
      {
        sentence_part1: 'Die Frau ist ',
        highlight: 'hübsch',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleThirdAppearance')
      },
      {
        sentence_part1: 'Das Kind ist ',
        highlight: 'blond',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleFourthAppearance')
      }
    ],
    practice: {
      title: t('adjectiveBasicPracticeSide.title'),
      description: t('adjectiveBasicPracticeSide.descriptionThird'),
      buttonText: t('adjectiveBasicPracticeSide.buttonText'),
    }
  },
  {
    id: 'character',
    title: t('adjectiveBasicPageSideBar.third'),
    examples: [
      {
        sentence_part1: 'Sie ist sehr ',
        highlight: 'freundlich',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleFirstCharacter')
      },
      {
        sentence_part1: 'Der Hund ist ',
        highlight: 'intelligent',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleSecondCharacter')
      },
      {
        sentence_part1: 'Er ist ',
        highlight: 'nett',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleThirdCharacter')
      },
      {
        sentence_part1: 'Das Mädchen ist ',
        highlight: 'lustig',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleFourthCharacter')
      }
    ],
    practice: {
      title: t('adjectiveBasicPracticeSide.title'),
      description: t('adjectiveBasicPracticeSide.descriptionFourth'),
      buttonText: t('adjectiveBasicPracticeSide.buttonText'),
    }
  },

  {
    id: 'dimensions',
    title: t('adjectiveBasicPageSideBar.fifth'),
    examples: [
      {
        sentence_part1: 'Ein Elefant ist ',
        highlight: 'groß',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleFirstDimensions')
      },
      {
        sentence_part1: 'Eine Maus ist ',
        highlight: 'klein',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleSecondDimensions')
      },
      {
        sentence_part1: 'Der Tisch ist ',
        highlight: 'rund',
        sentence_part2: '.',
        translation: t('adjectiveBasicPageSideBar.exampleThirdDimensions')
      }
    ],
    practice: {
      title: t('adjectiveBasicPracticeSide.title'),
      description: t('adjectiveBasicPracticeSide.descriptionFifth'),
      buttonText: t('adjectiveBasicPracticeSide.buttonText'),
    }
  }
]
const isContentVisible = ref(false)
const isMobileLayout = ref(false)
const router = useRouter()
const categoryId = 'adjective-basics';
const topic = ref('colors')
let speakTimeout = null;

const currentTopicData = computed(() => topics.find(t => t.id === topic.value))

const checkScreenSize = () => {
  isMobileLayout.value = window.innerWidth <= 767;
  if (!isMobileLayout.value) {
    isContentVisible.value = false;
  }
}

const closeContent = () => {
  isContentVisible.value = false;
}

const selectTopic = (id) => {
  topic.value = id
  if (isMobileLayout.value) {
    isContentVisible.value = true;
  }
}

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});
onUnmounted(() => {
  clearTimeout(speakTimeout)
  window.removeEventListener('resize', checkScreenSize);
});

</script>

<style scoped>
.adjective-page {
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
  margin-bottom: 15px;
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
  padding: 0 15px;
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

.adjective-page.content-is-active .content {
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
  overflow-y: auto;
  padding: 20px;
  background: var(--bg, #f7f9fc);
}

.content__main-column {
  flex-grow: 1;
  padding-bottom: 20px;
}

.info-section {
  margin-bottom: 24px;
}

.info-section__title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--titleColor, #374151);
  margin: 0 0 16px 0;
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

/* Цветные полоски слева для примеров */
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

.example__highlight {
  color: #ef4444;
  font-weight: 800;
}

.example__translation {
  display: block;
  color: #9ca3af;
  font-size: 1rem;
  padding-left: 8px;
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
  color: var(--titleColor, #374151);
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

.practice-area__button:active {
  transform: translateY(4px);
  border-bottom-width: 2px;
  margin-bottom: 4px;
}

@media (min-width: 768px) {
  .adjective-page {
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