<template>
  <div class="adjective-page" :class="{ 'content-is-active': isContentVisible }">
    <div class="sidebar">
      <button @click="backToMenu" class="btn__back">{{ t('tenses.barBtn') }}</button>
      <h2 class="sidebar__title">{{ t('adjectiveBasicPageSideBar.title') }}</h2>
      <div class="sidebar__heading">{{ t('adjectiveBasicPageSideBar.theme') }}</div>
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
        <h1 class="content__title">{{ t('adjectiveBasicPageSideBar.adjective') }} {{ currentTopicData.title }}</h1>
      </header>
      <div class="content__body">
        <div class="content__main-column">
          <section class="info-section">
            <h3 class="info-section__title">{{ t('adjectiveBasicPageSideBar.example') }}</h3>
            <div v-for="(example, index) in currentTopicData.examples" :key="index" class="example">
              <div class="example__sentence">
                <div>{{ example.sentence_part1 }}
                  <span class="example__highlight">{{ example.highlight }}</span>
                </div>
                <SoundBtn :text="example.sentence_part1 + example.highlight "/>
              </div>
              <span class="example__translation">{{ example.translation }}</span>
            </div>
          </section>
        </div>
        <div class="practice-area">
          <h3 class="practice-area__title">{{ currentTopicData.practice.title }}</h3>
          <p class="practice-area__description">{{ currentTopicData.practice.description }}</p>
          <NuxtLink :to="`/${categoryId}/practice/${currentTopicData.id}`" class="practice-area__button">
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
import Lottie from 'lottie-web';
import SoundBtn from '../../src/components/soundBtn.vue'

const {t, locale} = useI18n();
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
const router = useRouter()
const categoryId = 'adjective-basics';
const topic = ref('colors')
const backToMenu = () => {
  router.push('/')
}
let speakTimeout = null;

// function speak(text) {
//     if (!('speechSynthesis' in window)) {
//         console.error('Браузер не поддерживает Web Speech API.');
//         return;
//     }
//
//     clearTimeout(speakTimeout);
//     window.speechSynthesis.cancel();
//     if (!text) return;
//     speakTimeout = setTimeout(() => {
//         const utterance = new SpeechSynthesisUtterance(text);
//         const langMap = {
//             ru: 'ru-RU',
//             en: 'en-US',
//             de: 'de-DE',
//             uk: 'uk-UA',
//             pl: 'pl-PL',
//             tr: 'tr-TR'
//         };
//
//         utterance.lang = langMap[locale.value] || locale.value;
//         const voices = window.speechSynthesis.getVoices();
//         const targetVoice = voices.find(voice => voice.lang === utterance.lang);
//         if (targetVoice) {
//             utterance.voice = targetVoice;
//         }
//
//         window.speechSynthesis.speak(utterance);
//     }, 250);
// }
const currentTopicData = computed(() => topics.find(t => t.id === topic.value))

const isContentVisible = ref(false)
const isMobileLayout = ref(false)

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
  border: 3px solid black;
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
  border: 2px solid #000;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  box-shadow: 3px 3px 0px #000;
}

.sidebar__button:hover {
  background: #e0e0e0;
}

.sidebar__button:active {
  transform: translate(3px, 3px);
  box-shadow: none;
}

.sidebar__item--active .sidebar__button {
  color: #fff;
  background: #8bc34a;
}

.content {
  border-radius: 15px;
  border: 2px solid black;
  flex-grow: 1;
  background: #fdfdfd;
  padding: 30px;
  overflow-y: auto;
  box-shadow: 6px 6px 0px #1e1e1e;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.content__header {
  background: #ffcc00;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 5px 5px 0px #000;
}

.content__title {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 0px #000;
}

.content__body {
  display: flex;
  flex-grow: 1;
  border: 3px solid black;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 6px 6px 0px #1e1e1e;
  background: #fff;
}

.content__main-column {
  width: 50%;
  padding-right: 20px;
  border-right: 3px dashed #cccccc;
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
  margin-bottom: 10px;
  color: #333;
  padding: 0 0 20px 0;
}

.example {
  background: #fff;
  border: 2px solid #ddd;
  border-left: 6px solid #ffcc00;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 1.2rem;
}

.example__sentence {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.example__highlight {
  color: #d9534f;
}

.example__translation {
  display: block;
  color: #777;
  font-size: 1rem;
  font-style: italic;
}

.practice-area {
  width: 50%;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
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
  background: #28a745;
  color: #fff;
  border: 2px solid #000;
  border-radius: 8px;
  padding: 12px 25px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 4px 4px 0px #000;
}

.practice-area__button:hover {
  background: #218838;
}

.practice-area__button:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}

.btn__back {
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
  line-height: 1;
  padding: 0;
}

@media (max-width: 1023px) {
  .content__body {
    flex-direction: column;
  }

  .content__main-column,
  .practice-area {
    width: 100%;
    border-right: none;
    padding: 0;
  }

  .content__title {
    font-size: 1.2rem;
  }
}

@media (max-width: 767px) {
  .adjective-page {
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

  .adjective-page.content-is-active .content {
    transform: translateX(-100%);
  }

  .btn__close {
    display: flex;
  }
}

.speak-btn {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.speak-btn__icon {
  width: 25px;
  height: 50px;
  transition: transform 0.2s;
}

.speak-btn:hover .speak-btn__icon {
  transform: scale(1.1);
}

.speak-btn:disabled .speak-btn__icon {
  filter: grayscale(1);
  cursor: not-allowed;
}

</style>