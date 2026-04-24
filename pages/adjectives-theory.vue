<template>
  <div class="adjs">
    <div class="adjs__inner">
      <header class="adjs__header">
        <VBackBtnNav/>
        <div class="adjs__header-title">Прилагательные</div>
      </header>
      <div class="adjs__content-inner">
        <div>
          <h1 class="adjs__title">{{ t('adjectiveTheory.title')}}</h1>
<!--          <p class="adjs__subtitle"> {{ t('adjectiveTheory.subTitle')}}</p>-->
        </div>
        <section v-for="section in contentSections" :key="section.id" class="adjs__card" :class="section.customClass">
          <h2 class="adjs__card-title">{{ section.title }}</h2>
          <template v-for="(item, index) in section.content" :key="index">
            <p v-if="item.type === 'paragraph'" class="adjs__paragraph" v-html="item.text"></p>
            <div v-if="item.type === 'note'" class="adjs__note" v-html="item.text"></div>
            <div v-if="item.type === 'tip'" class="adjs__tip" v-html="item.text"></div>
            <ul v-if="item.type === 'list'" class="adjs__list">
              <li v-for="(li, i) in item.items" :key="i" class="adjs__item">
                <div class="adjs__example">
                  <img
                      class="adjs__icon"
                      :src="li.icon === 'Chat' ? Chat : Pin"
                      :alt="li.icon === 'Chat' ? 'Example icon' : 'Note pin icon'"
                  >
                  <div class="adjs__example--wrapper">
                    <p v-html="li.mainText"></p>
                    <span v-if="li.translation" class="adjs__translation" v-html="li.translation"></span>
                  </div>
                </div>
                <div v-if="li.subExample" class="adjs__example" style="margin-top: 8px;">
                  <img
                      class="adjs__icon"
                      :src="li.subExample.icon === 'Chat' ? Chat : Pin"
                      :alt="li.subExample.icon === 'Chat' ? 'Example icon' : 'Note pin icon'"
                  >
                  <div class="adjs__example--wrapper">
                    <p v-html="li.subExample.text"></p>
                  </div>
                </div>
              </li>
            </ul>
            <ol v-if="item.type === 'ordered-list'" class="adjs__steps">
              <li v-for="(li, i) in item.items" :key="i" v-html="li"></li>
            </ol>
            <template v-if="item.type === 'table'">
              <h3 class="adjs__table-title">{{ item.title }}</h3>
              <div class="adjs__table-wrap">
                <table class="adjs__table">
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
          </template>
        </section>
        <section class="adjs__card adjs__quiz">
          <h2 class="adjs__card-title">{{ t('adjectiveTheory.quizTitle')}}</h2>
          <div v-if="!quizFinished" class="adjs__quiz-body">
            <p class="adjs__quiz-progress">{{ t('adjectiveTheory.question')}} {{ quizIndex + 1 }} / {{ quizQuestions.length }}</p>
            <h3 class="adjs__quiz-question" v-html="quizQuestions[quizIndex].question"></h3>
            <div class="adjs__quiz-options">
              <button
                  v-for="option in quizQuestions[quizIndex].options"
                  :key="option"
                  @click="checkAnswer(option)"
                  :disabled="selectedAnswer !== null"
                  :class="['adjs__quiz-option', getOptionClass(option)]"
              >
                {{ option }}
              </button>
            </div>
            <div class="adjs__quiz-feedback">
              <p v-if="quizFeedback === 'correct'" class="adjs__feedback-text">✅ {{ t('adjectiveTheory.correct')}}</p>
              <p v-if="quizFeedback === 'incorrect'" class="adjs__feedback-text">❌ {{ t('adjectiveTheory.wrong')}}
                <b>{{ quizQuestions[quizIndex].answer }}</b>
              </p>
            </div>
            <button
                @click="nextQuestion"
                :disabled="!selectedAnswer"
                class="adjs__quiz-next"
            >
              {{ quizIndex === quizQuestions.length - 1 ? t('adjectiveTheory.showResult') : t('adjectiveTheory.next') }}
            </button>
          </div>
          <div v-else class="adjs__quiz-results">
            <h3 class="adjs__results-title">{{ t('adjectiveTheory.result')}}</h3>
            <p class="adjs__results-score">{{t('adjectiveTheory.points')}} {{ quizScore }} / {{ quizQuestions.length }}</p>
            <button @click="resetQuiz" class="adjs__quiz-next">{{t('adjectiveTheory.again')}}</button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import Pin from '../assets/images/pin.svg'
import Chat from '../assets/images/chat.svg'
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";
const { t } = useI18n()
const contentSections = ref([
  {
    id: 1,
    title: t('adjectiveTheoryFirstBlock.title'),
    customClass: 'adjs__card--intro',
    content: [
      {
        type: 'paragraph',
        text: `<b>${t('adjectiveTheoryFirstBlock.subtitlePartFirst')}</b> ${t('adjectiveTheoryFirstBlock.subtitlePartTwo')} <i>schön</i> ${t('adjectiveTheoryFirstBlock.subtitlePartThree')} <i>${t('adjectiveTheoryFirstBlock.subtitlePartFour')}</i> (дорогой), <i>schnell</i> ${t('adjectiveTheoryFirstBlock.subtitlePartFive')}`
      },
      {
        type: 'note',
        text: `<b>${t('adjectiveTheoryFirstBlock.noteOnePartOne')}</b> ${t('adjectiveTheoryFirstBlock.noteOnePartTwo')}`
      },
      {
        type: 'list', items: [
          {
            icon: 'Chat',
            mainText: `<b>${t('adjectiveTheoryFirstBlock.noteTwoPartOne')}</b> ${t('adjectiveTheoryFirstBlock.noteTwoPartTwo')} <i>sein/werden/bleiben</i>, <u>${t('adjectiveTheoryFirstBlock.noteTwoPartThree')}</u>.`,
            translation: `Die Schuhe sind <b>teuer</b>. ${t('adjectiveTheoryFirstBlock.noteTranslateOne')}`
          },
          {
            icon: 'Chat',
            mainText: `<b>${t('adjectiveTheoryFirstBlock.noteThreePartOne')}</b> ${t('adjectiveTheoryFirstBlock.noteThreePartTwo')} <u>${t('adjectiveTheoryFirstBlock.noteThreePartThree')}</u>.`,
            translation: `ein <b>schönes</b> Haus; der <b>neue</b> Laptop`
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: t('adjectiveTheorySecondBlock.title'),
    content: [
      {
        type: 'ordered-list', items: [
          `<b>${t('adjectiveTheorySecondBlock.exampleOnePartOne')}</b> ${t('adjectiveTheorySecondBlock.exampleOnePartTwo')} <b>${t('adjectiveTheorySecondBlock.exampleOnePartThree')}</b>: <i>ist schön</i>.`,
          `<b>${t('adjectiveTheorySecondBlock.exampleTwoPartOne')}</b> ${t('adjectiveTheorySecondBlock.exampleTwoPartTwo')} <ul class="adjs__bullets"><li><b>der/die/das, dieser, jeder…</b> ${t('adjectiveTheorySecondBlock.exampleTwoPartThree')} <u>${t('adjectiveTheorySecondBlock.exampleTwoPartFour')}</u></li><li><b>ein/kein/mein…</b> ${t('adjectiveTheorySecondBlock.exampleTwoPartFive')} <u>${t('adjectiveTheorySecondBlock.exampleTwoPartSeven')}</u></li><li><b>${t('adjectiveTheorySecondBlock.exampleTwoPartEight')}</b> → <u>${t('adjectiveTheorySecondBlock.exampleTwoPartNine')}</u></li></ul>`,
          `<b>${t('adjectiveTheorySecondBlock.exampleThreePartOne')}</b> ${t('adjectiveTheorySecondBlock.exampleThreePartTwo')} <b>-en</b>.`
        ]
      },
      {
        type: 'tip',
        text: `<b>${t('adjectiveTheorySecondBlock.tipPartOne')}</b> ${t('adjectiveTheorySecondBlock.tipPartTwo')} <b>-en</b>.`
      }
    ]
  },
  {
    id: 3,
    title: t('adjectiveTheoryThirdBlock.title'),
    content: [
      {
        type: 'paragraph',
        text: t('adjectiveTheoryThirdBlock.paragraph')
      },
      {
        type: 'note',
        text: `<b>${t('adjectiveTheoryThirdBlock.noteOnePartOne')}</b> ${t('adjectiveTheoryThirdBlock.noteOnePartTwo')} (d<b>er</b>, di<b>e</b>, da<b>s</b>).`
      },
      {
        type: 'list',
        items: [
          {
            icon: 'Chat',
            mainText: `${t('adjectiveTheoryThirdBlock.explainExampleOnePartOne')} de<b>r</b> Stuhl → ein gut<b>er</b> Stuhl`,
            translation: `${t('adjectiveTheoryThirdBlock.explainExampleOnePartOne')} <b>-er</b> ${t('adjectiveTheoryThirdBlock.explainExampleOnePartTwo')}`
          },
          {
            icon: 'Chat',
            mainText: `${t('adjectiveTheoryThirdBlock.exampleTwoPartOne')} di<b>e</b> Lamпе → ein<b>e</b> gut<b>e</b> Lampe`,
            translation: `${t('adjectiveTheoryThirdBlock.exampleThreePartOne')} <b>-e</b>.`
          },
          {
            icon: 'Chat',
            mainText: `${t('adjectiveTheoryThirdBlock.exampleFourPartOne')} da<b>s</b> Buch → ein gut<b>es</b> Buch`,
            translation: `${t('adjectiveTheoryThirdBlock.exampleFivePartOne')} <b>-es</b> ${t('adjectiveTheoryThirdBlock.exampleFivePartTwo')}`
          }
        ]
      },
      {
        type: 'paragraph',
        text: `<b>${t('adjectiveTheoryThirdBlock.paragraphTwo')}</b>`
      },
      {
        type: 'table',
        title: `${t('adjectiveTheoryThirdBlock.tableExampleOne')}`,
        headers: [`${t('adjectiveTheoryThirdBlock.tableHeaderOne')}`, `${t('adjectiveTheoryThirdBlock.tableHeaderTwo')}`, `${t('adjectiveTheoryThirdBlock.tableHeaderThree')}`],
        rows: [
          ['Mask. (m)', 'Das ist <b>ein schöner</b> Tisch.', 'Ich kaufe <b>einen schönen</b> Tisch.'],
          ['Fem. (f)', 'Das ist <b>eine schöne</b> Lampe.', 'Ich kaufe <b>eine schöne</b> Lamпе.'],
          ['Neut. (n)', 'Das ist <b>ein шönes</b> Bild.', 'Ich kauфе <b>ein шönes</b> Bild.']
        ]
      },
      {
        type: 'tip',
        text: `<b>${t('adjectiveTheoryThirdBlock.tipOnePartOne')}</b> ${t('adjectiveTheoryThirdBlock.tipOnePartTwo')} <b>-en</b>. ${t('adjectiveTheoryThirdBlock.tipOnePartThree')}`
      }
    ]
  },
  {
    id: 4,
    title: t('adjectiveTheoryFourthBlock.title'),
    content: [
      {
        type: 'table',
        title: t('adjectiveTheoryFourthBlock.tableFirstTitle'),
        headers: ['', 'Mask.', 'Fem.', 'Neut.', 'Plural'],
        rows: [
          [`${t('adjectiveTheoryFourthBlock.rowOne')}`, '-er', '-e', '-es', '-e'],
          [`${t('adjectiveTheoryFourthBlock.rowTwo')}`, '<b>Guter</b> Mann', '<b>Gute</b> Frau', '<b>Gutes</b> Brot', '<b>Gute</b> Bücher']
        ]
      },
      {
        type: 'table',
        title: `${t('adjectiveTheoryFourthBlock.tableSecondTitle')}`,
        headers: [`${t('adjectiveTheoryFourthBlock.header')}`, 'Mask.', 'Fem.', 'Neut.', 'Plural'],
        rows: [
          ['Nom', 'ein <b>guter</b> Mann', 'eine <b>gute</b> Frau', 'ein <b>gutes</b> Brot', 'meine <b>guten</b> Freunde'],
          ['Akk', 'einen <b>guten</b> Mann', 'eine <b>gute</b> Frau', 'ein <b>gutes</b> Brot', 'meine <b>guten</b> Freunde']
        ]
      },
      {
        type: 'note',
        text: `${t('adjectiveTheoryFourthBlock.type')} <b>-e</b>, ${t('adjectiveTheoryFourthBlock.typeTwo')} <b>-en</b>.`
      },
      {
        type: 'table',
        title: t('adjectiveTheoryFourthBlock.typeThree'),
        headers: [`${t('adjectiveTheoryFourthBlock.header')}`, 'Mask.', 'Fem.', 'Neut.', 'Plural'],
        rows: [
          ['Nom', 'der <b>gute</b> Mann', 'die <b>gute</b> Frau', 'das <b>gute</b> Brot', 'die <b>guten</b> Freunde'],
          ['Akk', 'den <b>guten</b> Mann', 'die <b>gute</b> Frau', 'das <b>gute</b> Brot', 'die <b>guten</b> Freunde']
        ]
      }
    ]
  },
  {
    id: 5,
    title: t('adjectiveTheoryFifthBlock.title'),
    content: [
      {
        type: 'list', items: [
          {
            icon: 'Chat',
            mainText: `<b>${t('adjectiveTheoryFifthBlock.exampleOne')}</b> (обычная): <i>schnell, teuer, schön</i>`,
            translation: 'Das Auto ist <b>schnell</b>.'
          },
          {
            icon: 'Chat',
            mainText: `<b>Komparativ</b> ${t('adjectiveTheoryFifthBlock.exampleTwo')}<b>-er</b> + <i>als</i>`,
            translation: 'schnell → <b>schneller</b> (als), teuer → <b>teurer</b> (als)',
            subExample: {icon: 'Pin', text: '<i>Mein Auto ist <b>schneller</b> als deins.</i>'}
          },
          {
            icon: 'Chat',
            mainText: `<b>Superlativ</b> ${t('adjectiveTheoryFifthBlock.exampleThreePartOne')} <i>am</i> ${t('adjectiveTheoryFifthBlock.exampleThreePartTwo')} <b>-sten</b> ${t('adjectiveTheoryFifthBlock.exampleThreePartThree')} <b>-ste</b> ${t('adjectiveTheoryFifthBlock.exampleThreePartFourth')}`,
            translation: 'am <b>schnellsten</b>; der <b>schnellste</b> Weg',
            subExample: {icon: 'Pin', text: '<i>Er läuft <b>am schnellsten</b>.</i>'}
          }
        ]
      },
      {
        type: 'note',
        text: `<b>${t('adjectiveTheoryFifthBlock.exampleFourPartOne')}</b> ${t('adjectiveTheoryFifthBlock.exampleFourPartTwo')} <i>(s, ß, x, z)</i> ${t('adjectiveTheoryFifthBlock.exampleFourPartThree')} <b>-esten</b>: <i>heiß → am heißesten</i>. ${t('adjectiveTheoryFifthBlock.exampleFourPartFour')} <i>alt → älter → am ältesten</i>.`
      },
      {
        type: 'tip',
        text: `<b>${t('adjectiveTheoryFifthBlock.exampleFivePartOne')}</b> gut → <b>besser</b> → <b>am besten</b>; viel → <b>mehr</b> → <b>am meisten</b>; hoch → <b>höher</b> → <b>am höchsten</b>.`
      }
    ]
  },
  {
    id: 6,
    title: t('adjectiveTheorySixthBlock.title'),
    content: [
      {
        type: 'list', items: [
          {
            icon: 'Chat',
            mainText: `<b>${t('adjectiveTheorySixthBlock.exampleFirst')}</b>`,
            translation: '✗ Die Schuhe sind <s>teuren</s> → ✓ Die Schuhe sind <b>teuer</b>.'
          },
          {
            icon: 'Chat',
            mainText: `<b>${t('adjectiveTheorySixthBlock.exampleSecond')}</b>`,
            translation: 'größer <b>als</b>…, besser <b>als</b>…'
          },
          {
            icon: 'Chat',
            mainText: `<b>Dativ Plural</b>${t('adjectiveTheorySixthBlock.exampleThird')}<i>-n</i>`,
            translation: 'mit den <b>guten</b> Freunde<b>n</b>'
          }
        ]
      }
    ]
  }
]);
const quizQuestions = ref([
  {
    question: `${t('adjectiveTheoryQuiz.firstQuest')} <b>Das ist ein ___ Tisch. (schön)</b>`,
    options: ['schöner', 'schöne', 'schönes'],
    answer: 'schöner'
  },
  {
    question: `${t('adjectiveTheoryQuiz.secondQuest')} <b>Ich habe einen ___ Hund. (klein)</b>`,
    options: ['kleinen', 'kleiner', 'kleine'],
    answer: 'kleinen'
  },
  {
    question: `${t('adjectiveTheoryQuiz.thirdQuest')} <b>Die Schuhe sind ___.</b>`,
    options: ['teuer', 'teuren', 'teure'], answer: 'teuer'},
  {
    question: `${t('adjectiveTheoryQuiz.fourthQuest')} <b>Sie kauft das ___ Kleid. (rot)</b>`,
    options: ['rotes', 'rote', 'roter'],
    answer: 'rote'
  },
  {
    question: `Dativ Plural: <b>Wir sprechen mit den ___ Nachbarn. (nett)</b>`,
    options: ['netter', 'nette', 'netten'],
    answer: 'netten'
  },
  {
    question: `Komparativ: <b>Dieses Handy ist ___ als jenes. (leicht)</b>`,
    options: ['leichter', 'am leichtesten', 'leichte'],
    answer: 'leichter'
  },
  {
    question: `${t('adjectiveTheoryQuiz.seventhQuest')} <b>Er läuft ___.</b>`,
    options: ['am schnellsten', 'schnellste', 'der schnellste'],
    answer: 'am schnellsten'
  },
  {
    question: `${t('adjectiveTheoryQuiz.eightQuest')} <b>___ Brot ist frisch. (gut)</b>`,
    options: ['Guter', 'Gutes', 'Gute'],
    answer: 'Gutes'
  }
])

const quizIndex = ref(0)
const selectedAnswer = ref(null)
const quizScore = ref(0)
const quizFinished = ref(false)
const quizFeedback = ref('')

const checkAnswer = (option) => {
  selectedAnswer.value = option
  if (option === quizQuestions.value[quizIndex.value].answer) {
    quizScore.value++
    quizFeedback.value = 'correct'
  } else {
    quizFeedback.value = 'incorrect'
  }
}

const nextQuestion = () => {
  if (quizIndex.value < quizQuestions.value.length - 1) {
    quizIndex.value++
    selectedAnswer.value = null
    quizFeedback.value = ''
  } else {
    quizFinished.value = true
  }
}

const resetQuiz = () => {
  quizIndex.value = 0
  quizScore.value = 0
  quizFinished.value = false
  selectedAnswer.value = null
  quizFeedback.value = ''
}

const getOptionClass = (option) => {
  if (selectedAnswer.value === null) return ''
  if (option === quizQuestions.value[quizIndex.value].answer) return 'correct'
  if (option === selectedAnswer.value) return 'incorrect'
  return ''
}
</script>

<style scoped>
.adjs {
  height: 100%;
}

.adjs__inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  font-family: 'Nunito', sans-serif;
  color: #1f2937;
  overflow: hidden;
}

.adjs__header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  margin-bottom: 10px;
}

.adjs__header-title {
  font-size: 23px;
  margin-left: 15px;
  font-weight: 600;
  color: var(--titleColor);
}

.adjs__content-inner {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 10px 30px 10px;
}

.adjs__title {
  font-size: 2.6rem;
  font-weight: 800;
  color: #fff;
  background: #60a5fa;
  padding: 1rem 2rem;
  border-radius: 16px;
  transform: rotate(-0.6deg);
  display: inline-block;
  margin-bottom: 1rem;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
}

.adjs__subtitle {
  font-size: 1.1rem;
  color: var(--titleColor);
  margin-bottom: 1rem;
}

.adjs__card {
  background: #ffffff;
  border-radius: 16px;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  padding: 24px 15px;
  margin-bottom: 2rem;
}

.adjs__card-title {
  text-align: center;
  font-size: 21px;
  font-weight: 900;
  border-bottom: 3px solid #a3e635;
  padding-bottom: 0.5rem;
  margin-bottom: 1.25rem;
}

.adjs__paragraph {
  font-size: 1.05rem;
  line-height: 1.65;
  margin-bottom: 0.9rem;
}

.adjs__list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.adjs__item {
  font-size: 1.05rem;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.adjs__example {
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
  color: #374151;
}

.adjs__example--wrapper {
  display: flex;
  flex-direction: column;
}

.adjs__translation {
  color: #6b7280;
  font-style: italic;
  margin-top: 0.25rem;
}

.adjs__icon {
  width: 34px;
  margin-right: 10px;
  align-self: flex-start;
  flex-shrink: 0;
}

.adjs__steps {
  margin: 0 0 1rem 1.25rem;
}

.adjs__steps > li {
  margin-bottom: 0.6rem;
  padding-left: 8px;
}

.adjs__bullets {
  margin: 0.4rem 0 0.6rem 1.25rem;
  list-style: disc;
}

.adjs__note {
  background: #eff6ff;
  border: 2px dashed #60a5fa;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin: 0.75rem 0 1rem;
}

.adjs__tip {
  background: #f7fee7;
  border: 2px dashed #a3e635;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-top: 0.75rem;
}

.adjs__table-wrap {
  overflow-x: auto;
  margin-bottom: 1rem;
}

.adjs__table-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 1.5rem 0 0.5rem;
}

.adjs__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  border: 3px solid var(--tabsSlideBorderColor);
}

.adjs__table th, .adjs__table td {
  border: 2px solid var(--tabsSlideBorderColor);
  padding: 0.5rem 0.6rem;
  text-align: left;
}

.adjs__table thead th {
  background: #e0f2fe;
}

.adjs__quiz-body, .adjs__quiz-results {
  text-align: center;
}

.adjs__quiz-progress {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.adjs__quiz-question {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 1.4rem;
}

.adjs__quiz-options {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.2rem;
}

.adjs__quiz-option {
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 1.1rem;
  font-weight: 800;
  border-radius: 12px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
}

.adjs__quiz-option:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

.adjs__quiz-option.correct {
  background-color: #22c55e;
  color: #fff;
  transform: translate(4px, 4px);
  box-shadow: none;
}

.adjs__quiz-option.incorrect {
  background-color: #ef4444;
  color: #fff;
  transform: translate(4px, 4px);
  box-shadow: none;
}

.adjs__quiz-feedback {
  min-height: 2.2rem;
  font-size: 1.1rem;
  font-weight: 800;
}

.adjs__quiz-next {
  margin-top: 0.2rem;
  padding: 0.9rem 1.6rem;
  font-size: 1.1rem;
  font-weight: 800;
  background: #e67335;
  border-radius: 12px;
  cursor: pointer;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  transition: all 0.2s;
  color: #ffffff;
  width: 100%;
}

.adjs__quiz-next:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.7;
}

.adjs__results-title {
  font-size: 1.6rem;
  margin-bottom: 0.6rem;
}

.adjs__results-score {
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
}

@media (max-width: 767px) {
  .adjs__title {
    font-size: 20px;
    padding: 14px;
  }
}
</style>