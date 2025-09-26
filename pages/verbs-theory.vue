<template>
  <div class="verbs">
    <div class="verbs__inner">
      <header class="verbs__header">
        <h1 class="verbs__title">{{ t('verbsTheory.title')}}</h1>
        <p class="verbs__subtitle">{{ t('verbsTheory.subTitle')}}</p>
      </header>
      <section v-for="section in contentSections" :key="section.id" class="verbs__card" :class="section.customClass">
        <h2 class="verbs__card-title">{{ section.title }}</h2>
        <template v-for="(item, index) in section.content" :key="index">
          <p v-if="item.type === 'paragraph'" class="verbs__paragraph" v-html="item.text"></p>
          <ul v-if="item.type === 'list'" class="verbs__list">
            <li v-for="(li, i) in item.items" :key="i" class="verbs__item" v-html="li"></li>
          </ul>
          <div v-if="item.type === 'note'" class="verbs__note" v-html="item.text"></div>
          <div v-if="item.type === 'example'" class="verbs__example">
            <img
                class="verbs__icon"
                :src="item.icon === 'Chat' ? Chat : Pin" alt="icon"
                :alt="item.icon === 'Chat' ? 'Dialogue example' : 'Note example'"
            >
            <div class="verbs__example--wrapper">
              <p v-for="(line, i) in item.lines" :key="i" v-html="line"></p>
            </div>
          </div>
          <div v-if="item.type === 'table'" class="verbs__table-wrap">
            <table class="verbs__table">
              <thead>
              <tr>
                <th v-for="header in item.headers" :key="header">{{ header }}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(row, i) in item.rows" :key="i">
                <td v-for="(cell, j) in row" :key="j" v-html="cell"></td>
              </tr>
              </tbody>
            </table>
          </div>
        </template>
      </section>
      <section class="verbs__card verbs__quiz">
        <h2 class="verbs__card-title">{{ t('verbsTheory.quiz')}}</h2>
        <div v-if="!quizFinished" class="verbs__quiz-body">
          <p class="verbs__quiz-progress">{{ t('verbsTheory.quest')}} {{ quizIndex + 1 }} / {{ quizQuestions.length }}</p>
          <h3 class="verbs__quiz-question" v-html="quizQuestions[quizIndex].question"></h3>
          <div class="verbs__quiz-options">
            <button
                v-for="opt in quizQuestions[quizIndex].options"
                :key="opt"
                @click="checkAnswer(opt)"
                :disabled="selectedAnswer !== null"
                :class="['verbs__quiz-option', getOptionClass(opt)]"
            >
              {{ opt }}
            </button>
          </div>
          <div class="verbs__quiz-feedback">
            <p v-if="quizFeedback==='correct'">✅ {{ t('verbsTheory.correct')}}</p>
            <p v-if="quizFeedback==='incorrect'">❌ {{ t('verbsTheory.wrong')}} <b>{{
                quizQuestions[quizIndex].answer
              }}</b></p>
          </div>
          <button v-if="selectedAnswer" @click="nextQuestion" class="verbs__quiz-next">
            {{ quizIndex === quizQuestions.length - 1 ? t('verbTheorySeventhBlock.result') : t('verbTheorySeventhBlock.nextQuest') }}
          </button>
        </div>
        <div v-else class="verbs__quiz-results">
          <h3 class="verbs__results-title">{{ t('verbsTheory.result')}}</h3>
          <p class="verbs__results-score">{{ t('verbsTheory.resultCount')}} {{ quizScore }} / {{ quizQuestions.length }}</p>
          <button @click="resetQuiz" class="verbs__quiz-next">{{ t('verbsTheory.again')}}</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useHead, useSeoMeta, useRuntimeConfig } from '#imports'
import { useRoute } from 'vue-router'
import {ref, computed} from 'vue'
import Pin from '../assets/images/pin.svg'
import Chat from '../assets/images/chat.svg'
const { t } = useI18n()

const runtime = useRuntimeConfig().public
const route = useRoute()

const pageTitle = 'German Corner — Теория немецких глаголов с примерами и квизом'
const pageDesc  = 'Разбор спряжения, времён и вспомогательных глаголов в немецком: machen/lernen, haben/sein, Futur, порядок слов. Примеры, таблицы и мини-квиз.'

useSeoMeta({
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogType: 'article',
  ogUrl: `${runtime.siteUrl}${route.fullPath}`,
  ogImage: '/images/seo-verbs.png',
  robots: 'index, follow'
})

useHead({
  title: pageTitle,
  link: [
    { rel: 'canonical', href: `${runtime.siteUrl}${route.fullPath}` }
  ]
})

const contentSections = ref([
  {
    id: 1,
    title: t('verbTheoryFirstBlock.title'),
    customClass: 'verbs__card--intro',
    content: [
      {
        type: 'paragraph',
        text: `<b>${t('verbTheoryFirstBlock.subTitleFirstPart')}</b>${t('verbTheoryFirstBlock.subTitleSecondPart')}`
      },
      {
        type: 'note',
        text: `<b>${t('verbTheoryFirstBlock.rulePartFirst')}</b> ${t('verbTheoryFirstBlock.rulePartSecond')} <b>${t('verbTheoryFirstBlock.rulePartThird')}</b>.`
      },
      {
        type: 'example', icon: 'Chat', lines: [
          `<u>Ich</u> <b>lerne</b> <u>heute Deutsch</u>. ${t('verbTheoryFirstBlock.firstExample')}`,
          `<u>Heute</u> <b>lerne</b> <u>ich Deutsch</u>. ${t('verbTheoryFirstBlock.secondExample')}`
        ]
      },
      {
        type: 'paragraph',
        text: `${t('verbTheoryFirstBlock.paragraphPartOne')}<b>${t('verbTheoryFirstBlock.paragraphPartTwo')}</b>.`
      },
      {
        type: 'example', icon: 'Pin', lines: [
          'Ich <b>möchte</b> Deutsch <u>lernen</u>.',
          'Ich <b>habe</b> Deutsch <u>gelernt</u>.'
        ]
      }
    ]
  },
  {
    id: 2,
    title: t('verbTheorySecondBlock.title'),
    content: [
      {
        type: 'paragraph',
        text: t('verbTheorySecondBlock.subTitle')
      },
      {
        type: 'table', headers: ['', `machen${t('verbTheorySecondBlock.tableFirstExample')}`, `lernen${t('verbTheorySecondBlock.tableSecondExample')}`], rows: [
          ['ich', 'mach<b>e</b>', 'lern<b>e</b>'],
          ['du', 'mach<b>st</b>', 'lern<b>st</b>'],
          ['er/sie/es', 'mach<b>t</b>', 'lern<b>t</b>'],
          ['wir', 'mach<b>en</b>', 'lern<b>en</b>'],
          ['ihr', 'mach<b>t</b>', 'lern<b>t</b>'],
          ['sie/Sie', 'mach<b>en</b>', 'lern<b>en</b>']
        ]
      },
      {
        type: 'note',
        text: `<b>${t('verbTheorySecondBlock.paragraphPartOne')}</b> ${t('verbTheorySecondBlock.paragraphPartTwo')}<b>a</b>hren → du f<b>ä</b>hrst, l<b>e</b>sen → du l<b>ie</b>st.`
      }
    ]
  },
  {
    id: 3,
    title: t('verbTheoryThirdBlock.title'),
    content: [
      {
        type: 'paragraph',
        text: t('verbTheoryThirdBlock.subTitle')
      },
      {type: 'note', text: `<b>haben / sein</b> ${t('verbTheoryThirdBlock.noteOneFirstPart')} + <b>Partizip II</b> ${t('verbTheoryThirdBlock.noteOneSecondPart')}`},
      {
        type: 'list', items: [
          `${t('verbTheoryThirdBlock.noteTwoFirstPart')} <b>sein</b> ${t('verbTheoryThirdBlock.noteTwoSecondPart')} (<i>gehen, fahren, fliegen</i>), ${t('verbTheoryThirdBlock.noteTwoThirdPart')} (<i>aufstehen, sterben</i>) ${t('verbTheoryThirdBlock.noteTwoFourthPart')} (<i>sein, bleiben, werden</i>).`,
          `${t('verbTheoryThirdBlock.noteThreeFirstPart')} <b>haben</b>.`
        ]
      },
      {
        type: 'example', icon: 'Pin', lines: [
         `Er <b>ist</b> nach Berlin <u>gefahren</u>. ${t('verbTheoryThirdBlock.noteFourPartFirst')}`,
          `Wir <b>haben</b> viel <u>gemacht</u>. ${t('verbTheoryThirdBlock.noteFourPartSecond')}`
        ]
      }
    ]
  },
  {
    id: 4,
    title: t('verbTheoryFourthBlock.title'),
    content: [
      {
        type: 'paragraph',
        text: `${t('verbTheoryFourthBlock.subTitlePartOne')} <b>sein, haben</b> и <b>${t('verbTheoryFourthBlock.subTitlePartTwo')}</b>.`
      },
      {
        type: 'example', icon: 'Chat', lines: [
          `Früher <b>war</b> ich Student. ${t('verbTheoryFourthBlock.typeOne')}`,
          `Gestern <b>hatte</b> ich keine Zeit. ${t('verbTheoryFourthBlock.typeTwo')}`,
          `Ich <b>konnte</b> nicht kommen. ${t('verbTheoryFourthBlock.typeThree')}`
        ]
      }
    ]
  },
  {
    id: 5,
    title: t('verbTheoryFifthBlock.title'),
    content: [
      {type: 'paragraph', text: `${t('verbTheoryFifthBlock.paragraph')}`},
      {type: 'note', text: `<b>werden</b> ${t('verbTheoryFifthBlock.noteOneFirstPart')} + <b>${t('verbTheoryFifthBlock.noteOneSecondPart')}</b> ${t('verbTheoryFifthBlock.noteOneThirdPart')}`},
      {
        type: 'example', icon: 'Pin', lines: [
          `Ich <b>werde</b> morgen Deutsch <u>lernen</u>.${t('verbTheoryFifthBlock.noteTwoFirstPart')}`
        ]
      },
      {
        type: 'paragraph',
        text: `<b>${t('verbTheoryFifthBlock.noteThreeFirstPart')}</b>${t('verbTheoryFifthBlock.noteThreeSecondPart')} <i>Ich lerne <b>morgen</b> Deutsch.</i>`
      }
    ]
  },
  {
    id: 6,
    title: t('verbTheorySixthBlock.title'),
    content: [
      {
        type: 'list', items: [
          `<b>${t('verbTheorySixthBlock.typeOnePartFirst')}</b> ${t('verbTheorySixthBlock.typeOnePartSecond')}<br>❌ <span style="text-decoration: line-through;">Ich heute lerne Deutsch.</span><br>✅ Ich <b>lerne</b> heute Deutsch.`,
          `<b>${t('verbTheorySixthBlock.typeTwoPartOne')}</b> ${t('verbTheorySixthBlock.typeTwoPartTwo')}<br>❌ <span style="text-decoration: line-through;">Ich habe gelernt heute.</span><br>✅ Ich habe heute <b>gelernt</b>.`,
          `<b>${t('verbTheorySixthBlock.typeThreePartOne')}</b> ${t('verbTheorySixthBlock.typeThreePartTwo')}<br>❌ <span style="text-decoration: line-through;">Ich bin das Buch gelesen.</span><br>✅ Ich <b>habe</b> das Buch gelesen.`
        ]
      }
    ]
  }
]);

const quizQuestions = ref([
  {
    question: t('verbTheorySeventhBlock.questOne'),
    options: ['Ich lerne Deutsch.', 'Ich Deutsch lerne.', 'Ich lernen Deutsch.'],
    answer: 'Ich lerne Deutsch.'
  },
  {
    question: t('verbTheorySeventhBlock.questTwo'),
    options: ['Heute gehe ich ins Kino.', 'Heute ich gehe ins Kino.', 'Ich gehe heute ins Kino.'],
    answer: 'Heute gehe ich ins Kino.'
  },
  {
    question: t('verbTheorySeventhBlock.questThree'),
    options: ['Wir haben viel gemacht.', 'Wir sind viel gemacht.', 'Wir haben viel machen.'],
    answer: 'Wir haben viel gemacht.'
  },
  {
    question: t('verbTheorySeventhBlock.questFour'),
    options: ['Er ist nach Hause gefahren.', 'Er hat nach Hause gefahren.', 'Er ist gefahren nach Hause.'],
    answer: 'Er ist nach Hause gefahren.'
  },
  {
    question: t('verbTheorySeventhBlock.questFive'),
    options: ['Ich war müde.', 'Ich bin müde gewesen.', 'Ich hatte müde.'],
    answer: 'Ich war müde.'
  },
  {
    question: t('verbTheorySeventhBlock.questSix'),
    options: ['Sie wird morgen arbeiten.', 'Sie werde morgen arbeiten.', 'Sie wird arbeiten morgen.'],
    answer: 'Sie wird morgen arbeiten.'
  },
  {
    question: t('verbTheorySeventhBlock.questSeven'),
    options: ['gesehen', 'geseht', 'gesahen'],
    answer: 'gesehen'
  }
]);

const quizIndex = ref(0);
const selectedAnswer = ref(null);
const quizScore = ref(0);
const quizFinished = ref(false);
const quizFeedback = ref('');

const checkAnswer = (opt) => {
  selectedAnswer.value = opt;
  if (opt === quizQuestions.value[quizIndex.value].answer) {
    quizScore.value++;
    quizFeedback.value = 'correct';
  } else {
    quizFeedback.value = 'incorrect';
  }
};

const nextQuestion = () => {
  if (quizIndex.value < quizQuestions.value.length - 1) {
    quizIndex.value++;
    selectedAnswer.value = null;
    quizFeedback.value = '';
  } else {
    quizFinished.value = true;
  }
};

const resetQuiz = () => {
  quizIndex.value = 0;
  quizScore.value = 0;
  quizFinished.value = false;
  selectedAnswer.value = null;
  quizFeedback.value = '';
};

const getOptionClass = (opt) => {
  if (selectedAnswer.value === null) return '';
  if (opt === quizQuestions.value[quizIndex.value].answer) return 'correct';
  if (opt === selectedAnswer.value) return 'incorrect';
  return '';
};

definePageMeta({layout: 'footerlayout'})
</script>

<style scoped>
.verbs__inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  color: #1f2937
}

.verbs__header {
  text-align: center;
  margin-bottom: 3rem
}

.verbs__title {
  font-size: 2.6rem;
  font-weight: 800;
  color: #fff;
  background: #818cf8;
  padding: 1rem 2rem;
  border: 3px solid #1f2937;
  border-radius: 16px;
  transform: rotate(-0.6deg);
  box-shadow: 8px 8px 0 #1f2937;
  display: inline-block;
  margin-bottom: 1rem
}

.verbs__subtitle {
  font-size: 1.1rem;
  color: var(--titleColor)
}

.verbs__card {
  background: #fff;
  border: 3px solid #1f2937;
  border-radius: 16px;
  box-shadow: 6px 6px 0 #0f172a;
  padding: 2rem;
  margin-bottom: 2rem
}

.verbs__card-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 900;
  border-bottom: 3px solid #f59e0b;
  padding-bottom: .5rem;
  margin-bottom: 1.25rem
}

.verbs__paragraph {
  font-size: 1.05rem;
  line-height: 1.65;
  margin-bottom: .9rem
}

.verbs__list {
  list-style-type: '✅ ';
  padding-left: 20px;
  margin: 1rem 0;
}

.verbs__item {
  font-size: 1.05rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  padding-left: 10px;
}

.verbs__example {
  display: flex;
  align-items: center;
  margin-top: .3rem;
  color: #374151;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
}

.verbs__example--wrapper {
  display: flex;
  flex-direction: column
}

.verbs__icon {
  width: 40px;
  margin-right: 15px;
  align-self: flex-start;
}

.verbs__note {
  background: #eef2ff;
  border: 2px dashed #818cf8;
  padding: .75rem 1rem;
  border-radius: 12px;
  margin: 1.25rem 0
}

.verbs__table-wrap {
  overflow-x: auto;
  margin: .5rem 0 1rem
}

.verbs__table {
  width: 100%;
  border-collapse: collapse;
  font-size: .98rem
}

.verbs__table th, .verbs__table td {
  border: 2px solid #1f2937;
  padding: .5rem .6rem;
  text-align: left
}

.verbs__table thead th {
  background: #ddd6fe
}

/* Квиз */
.verbs__quiz-body, .verbs__quiz-results {
  text-align: center
}

.verbs__quiz-progress {
  font-size: .9rem;
  color: #6b7280;
  margin-bottom: 1rem
}

.verbs__quiz-question {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 1.4rem
}

.verbs__quiz-options {
  display: flex;
  flex-direction: column;
  gap: .8rem;
  margin-bottom: 1.2rem
}

.verbs__quiz-option {
  width: 100%;
  padding: .9rem 1rem;
  font-size: 1.1rem;
  font-weight: 800;
  border: 3px solid #0f172a;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: .2s;
  box-shadow: 4px 4px 0 #0f172a
}

.verbs__quiz-option:disabled {
  cursor: not-allowed;
  opacity: .75
}

.verbs__quiz-option.correct {
  background: #22c55e;
  color: #fff;
  transform: translate(4px, 4px);
  box-shadow: none
}

.verbs__quiz-option.incorrect {
  background: #ef4444;
  color: #fff;
  transform: translate(4px, 4px);
  box-shadow: none
}

.verbs__quiz-feedback {
  min-height: 2.2rem;
  font-size: 1.1rem;
  font-weight: 800
}

.verbs__quiz-next {
  margin-top: .2rem;
  padding: .9rem 1.6rem;
  font-size: 1.1rem;
  font-weight: 800;
  background: #f59e0b;
  border: 3px solid #1f2937;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 4px 4px 0 #1f2937;
  transition: .2s;
  color: #1f2937
}

.verbs__results-title {
  font-size: 1.6rem;
  margin-bottom: .6rem
}

.verbs__results-score {
  font-size: 1.3rem;
  margin-bottom: 1.2rem
}

@media (max-width: 767px) {
  .verbs__inner {
    padding: 1rem
  }

  .verbs__title {
    font-size: 2.1rem;
    padding: 14px;
    box-shadow: 2px 2px 5px #1f2937
  }

  .verbs__card {
    box-shadow: 2px 2px 5px #1f2937
  }

  .verbs__card-title {
    font-size: 1.45rem
  }

  .verbs__icon {
    width: 34px;
    margin-right: 8px
  }
}
</style>