<template>
  <div class="prepositions-page">
    <header class="page-header">
      <div class="prep__header-wrapper">
        <VBackBtn/>
        <h1 class="page-title">{{ t('preposition.title') }}</h1>
      </div>
    </header>
    <main class="page-content">
      <p class="page-subtitle">{{ t('preposition.guideTitle') }}</p>
      <section v-for="(section, index) in pageSections" :key="index" class="topic-card"
               :class="section.customClass">
        <h2 class="card-title">{{ section.title }}</h2>

        <p v-for="(paragraph, pIndex) in section.paragraphs" :key="pIndex" class="paragraph"
           v-html="paragraph"></p>

        <div v-for="(group, gIndex) in section.meaningGroups" :key="gIndex" class="meaning-group">
          <h3 class="group-title"><span class="emoji">{{ group.emoji }}</span>{{ group.title }}</h3>
          <p class="paragraph">{{ group.description }}</p>
          <ul class="bullet-list">
            <li v-for="(item, iIndex) in group.items" :key="iIndex" class="list-item" v-html="item"></li>
          </ul>
        </div>
        <table v-if="section.type === 'contractions'" class="contractions-table">
          <thead>
          <tr>
            <th v-for="header in section.tableData.headers" :key="header">{{ header }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(row, rIndex) in section.tableData.rows" :key="rIndex">
            <td v-for="(cell, cIndex) in row" :key="cIndex" v-html="cell"></td>
          </tr>
          </tbody>
        </table>
        <div v-for="(caseBlock, cbIndex) in section.caseBlocks" :key="cbIndex" class="case-block"
             :class="caseBlock.type">
          <h3 class="case-title">{{ caseBlock.title }}</h3>
          <p class="preposition-list">{{ caseBlock.prepositions }}</p>
          <p v-if="caseBlock.example" class="example" v-html="caseBlock.example"></p>
          <ul v-if="caseBlock.examples" class="bullet-list">
            <li v-for="(ex, exIndex) in caseBlock.examples" :key="exIndex" class="list-item"
                v-html="ex"></li>
          </ul>
        </div>
        <div v-if="section.type === 'quiz'">
          <div v-if="!quizFinished" class="quiz-container">
            <p class="quiz-progress">{{ t('preposition.quest') }} {{ currentQuestionIndex + 1 }} из {{
                section.questions.length
              }}</p>
            <h3 class="quiz-question">{{
                section.questions[currentQuestionIndex].sentence.replace('___',
                    '...')
              }}</h3>
            <div class="quiz-options">
              <button
                  v-for="option in section.questions[currentQuestionIndex].options"
                  :key="option"
                  @click="handleAnswer(option)"
                  :disabled="selectedAnswer !== null"
                  :class="getOptionClass(option)"
                  class="quiz-option"
              >
                {{ option }}
              </button>
            </div>
            <div class="quiz-feedback">
              <p v-if="feedback === 'correct'" class="feedback-text">✅ {{ t('preposition.correct') }}</p>
              <p v-if="feedback === 'incorrect'" class="feedback-text">❌ {{ t('preposition.incorrect') }} <b>{{
                  section.questions[currentQuestionIndex].answer
                }}</b></p>
            </div>
            <button v-if="selectedAnswer" @click="nextQuestion(section.questions.length)"
                    class="practice-button">
              {{
                currentQuestionIndex === section.questions.length - 1 ? t('prepositionQuiz.result') : t('prepositionQuiz.next')
              }}
            </button>
          </div>
          <div v-else class="quiz-results">
            <h3 class="results-title">{{ t('preposition.end') }}</h3>
            <p class="results-score">{{ t('preposition.result') }} {{ score }} / {{ section.questions.length }}</p>
            <button @click="resetQuiz" class="practice-button">{{ t('preposition.again') }}</button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import { useHead, useSeoMeta} from '#imports'
import VBackBtn from "~/src/components/V-back-btn.vue";

const { t } = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow'
})

const pageSections = ref([
  {
    type: 'intro',
    title: t('prepositionsIntro.title'),
    paragraphs: [
      t('prepositionsIntro.paragraph')
    ]
  },
  {
    type: 'meanings',
    title: t('prepositionsFirstBlock.title'),
    meaningGroups: [
      {
        emoji: '📍',
        title: t('prepositionsFirstBlock.meaningTitle'),
        description: t('prepositionsFirstBlock.description'),
        items: [
          `<span class="preposition">in</span> ${t('prepositionsFirstBlock.translateFirstPart')} <b>in der</b> Schule. <span class="translation">${t('prepositionsFirstBlock.translateOne')}</span>`,
          `<span class="preposition">an</span> ${t('prepositionsFirstBlock.translateSecondPart')} Das Bild hängt <b>an der</b> Wand. <span class="translation">${t('prepositionsFirstBlock.translateTwo')}</span>`,
          `<span class="preposition">auf</span> ${t('prepositionsFirstBlock.translateThirdPart')} Das Buch liegt <b>auf dem</b> Tisch. <span class="translation">${t('prepositionsFirstBlock.translateThree')}</span>`
        ]
      },
      {
        emoji: '⏰',
        title: t('prepositionsFirstBlock.meaningTitleTwo'),
        description: t('prepositionsFirstBlock.descriptionTwo'),
        items: [
          `<span class="preposition">am</span> ${t('prepositionsFirstBlock.translateFirstPartTwo')} <b>Am</b> Montag habe ich frei. <span class="translation">${t('prepositionsFirstBlock.translateFirstPartThree')}</span>`,
          `<span class="preposition">um</span> ${t('prepositionsFirstBlock.translateSecondPartTwo')}<b>um</b> 20 Uhr. <span class="translation"> ${t('prepositionsFirstBlock.translateSecondPartThree')}</span>`,
          `<span class="preposition">im</span> ${t('prepositionsFirstBlock.translateFirstPartTwo')} <b>Im</b> Sommer fahren wir ans Meer. <span class="translation"> ${t('prepositionsFirstBlock.translateThirdPartThree')}</span>`
        ]
      }
    ]
  },
  {
    type: 'contractions',
    title: t('prepositionsSecondBlock.title'),
    paragraphs: [t('prepositionsSecondBlock.paragraph')],
    tableData: {
      headers: [t('prepositionsSecondBlock.headerOne'), t('prepositionsSecondBlock.headerTwo'), t('prepositionsSecondBlock.headerThree')],
      rows: [
        ['an', 'das', '<b>ans</b> (ans Fenster)'], ['in', 'das', '<b>ins</b> (ins Kino)'],
        ['auf', 'das', '<b>aufs</b> (aufs Land)'], ['an', 'dem', '<b>am</b> (am Montag)'],
        ['in', 'dem', '<b>im</b> (im Sommer)'], ['von', 'dem', '<b>vom</b> (vom Bahnhof)'],
        ['zu', 'dem', '<b>zum</b> (zum Arzt)'], ['zu', 'der', '<b>zur</b> (zur Schule)']
      ]
    }
  },
  {
    type: 'cases',
    title: t('prepositionsThirdBlock.title'),
    paragraphs: [t('prepositionsThirdBlock.paragraph')],
    caseBlocks: [
      {
        type: 'dative',
        title: t('prepositionsThirdBlock.dativeTitle'),
        prepositions: 'mit, nach, aus, zu, von, bei, seit, gegenüber',
        example: `Ich fahre <b>mit dem</b> Bus. <span class="translation">${t('prepositionsThirdBlock.dativeExample')}</span>`
      },
      {
        type: 'accusative',
        title: t('prepositionsThirdBlock.accusativeTitle'),
        prepositions: 'durch, für, gegen, ohne, um, bis, entlang',
        example: `Er geht <b>durch den</b> Park. <span class="translation">${t('prepositionsThirdBlock.accusativeExample')}</span>`
      },
      {
        type: 'two-way',
        title: t('prepositionsThirdBlock.twoWay'),
        prepositions: 'in, an, auf, über, unter, vor, hinter, neben, zwischen',
        examples: [
          `${t('prepositionsThirdBlock.twoWayExampleFirst')} <b>Dativ</b>: Das Auto steht <b>vor dem</b> Haus. <span class="translation">${t('prepositionsThirdBlock.twoWayTranslateFirst')}</span>`,
          `${t('prepositionsThirdBlock.twoWayExampleSecond')} <b>Akkusativ</b>: Ich fahre das Auto <b>vor das</b> Haus. <span class="translation">${t('prepositionsThirdBlock.twoWayTranslateSecond')}</span>`
        ]

      },
      {
        type: 'genitive',
        title: 'Всегда с Genitiv (Родительный падеж)',
        prepositions: '(an)statt, während, trotz, wegen',
        example: `<b>Während des</b> Urlaubs habe ich viel gelesen. <span class="translation">${t('prepositionsThirdBlock.genitiveExample')}</span>`
      }
    ]
  },
  {
    type: 'quiz',
    title: t('prepositionQuiz.title'),
    customClass: 'practice-card',
    questions: [
      {sentence: 'Ich fahre ___ dem Bus.', options: ['mit', 'durch', 'für'], answer: 'mit'},
      {sentence: 'Er geht ___ den Park.', options: ['ohne', 'aus', 'durch'], answer: 'durch'},
      {sentence: 'Das Buch liegt auf ___ Tisch. (Wo?)', options: ['den', 'dem', 'das'], answer: 'dem'},
      {sentence: 'Wir gehen heute Abend ___ Kino. (Wohin?)', options: ['im', 'am', 'ins'], answer: 'ins'},
      {sentence: 'Sie kommt ___ der Schweiz.', options: ['von', 'aus', 'nach'], answer: 'aus'},
      {sentence: 'Das Geschenk ist ___ dich.', options: ['für', 'gegen', 'mit'], answer: 'für'},
      {sentence: 'Er wohnt ___ seinen Eltern.', options: ['von', 'seit', 'bei'], answer: 'bei'},
      {
        sentence: '___ des schlechten Wetters bleiben wir zu Hause.',
        options: ['Trotz', 'Wegen', 'Statt'],
        answer: 'Wegen'
      },
    ]
  }
]);
const quizQuestions = computed(() => pageSections.value.find(s => s.type === 'quiz')?.questions || []);
const currentQuestionIndex = ref(0);
const selectedAnswer = ref(null);
const score = ref(0);
const quizFinished = ref(false);
const feedback = ref('');

const handleAnswer = (option) => {
  selectedAnswer.value = option;
  if (option === quizQuestions.value[currentQuestionIndex.value].answer) {
    score.value++;
    feedback.value = 'correct';
  } else {
    feedback.value = 'incorrect';
  }
};
const nextQuestion = (totalQuestions) => {
  if (currentQuestionIndex.value < totalQuestions - 1) {
    currentQuestionIndex.value++;
    resetQuestionState();
  } else {
    quizFinished.value = true;
  }
};
const resetQuiz = () => {
  currentQuestionIndex.value = 0;
  score.value = 0;
  quizFinished.value = false;
  resetQuestionState();
};
const resetQuestionState = () => {
  selectedAnswer.value = null;
  feedback.value = '';
};
const getOptionClass = (option) => {
  if (selectedAnswer.value === null) return '';
  if (option === quizQuestions.value[currentQuestionIndex.value].answer) return 'correct';
  if (option === selectedAnswer.value) return 'incorrect';
  return '';
};

</script>

<style scoped>
.prepositions-page {
  font-family: 'Nunito', sans-serif;
  color: #1e1e1e;
  height: 100vh;
  overflow: hidden;
  padding-bottom: 40px;
}

.prep__header-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1;
  background: #6358ac;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-bottom: 5px;
}

.page-header {
  text-align: center;
  margin-bottom: 5px;
}

.page-title {
  font-family: "Nunito", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  flex: 1;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--titleColor);
  text-align: center;
  padding: 10px;
  font-weight: 600;
}

.page-content {
  max-width: 1000px;
  margin: 0 auto;
  height: 100%;
  overflow-y: auto;
  padding: 0 6px;
}

.topic-card {
  background-color: #ffffff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 8px 8px 0px rgba(30, 30, 30, 0.8);
  padding: 2rem;
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 900;
  border-bottom: 3px solid #f1c40f;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  display: inline-block;
}

.paragraph {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.bullet-list {
  padding-left: 0;
}

.list-item {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.topic-card :deep(.translation) {
  color: #777;
  font-style: italic;
  margin-left: 0.5rem;
}

.meaning-group {
  margin-bottom: 2rem;
}

.group-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.emoji {
  margin-right: 0.5rem;
}

.topic-card :deep(.preposition) {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 0.2em 0.4em;
  font-family: monospace;
  color: #d63384;
  font-weight: bold;
}

.preposition-list {
  font-weight: bold;
  font-size: 1.2rem;
  word-spacing: 0.5rem;
}

.contractions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  font-size: 1.1rem;
}

.contractions-table th, .contractions-table td {
  border: 3px solid #1e1e1e;
  padding: 0.8rem;
  text-align: center;
}

.contractions-table th {
  background-color: #f1c40f;
}

.case-block {
  border: 2px solid #1e1e1e;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border-left-width: 8px;
}

.case-title {
  margin-bottom: 7px;
  font-size: 1.1rem;
  color: #4e4fd3;
}

.case-block.dativ {
  border-left-color: #4ade80;
}

.case-block.accusative {
  border-left-color: #f97028;
}

.case-block.two-way {
  border-left-color: #60a5fa;
}

.case-block.genitive {
  border-left-color: #fbc02d;
}

.example {
  margin-top: 0.5rem;
  font-style: italic;
}

.mnemonic {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  border: 2px dashed #1e1e1e;
}

.practice-card {
  text-align: center;
  background-color: #4ade80;
}

.practice-button {
  display: inline-block;
  text-decoration: none;
  background: #f1c40f;
  color: #1e1e1e;
  font-size: 1.3rem;
  font-weight: bold;
  padding: .6rem 2.5rem;
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  transition: all 0.2s;
  margin-top: 1rem;
  cursor: pointer;
}

.quiz-container, .quiz-results {
  text-align: center;
}

.quiz-progress {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1rem;
}

.quiz-question {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.quiz-option {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Nunito', sans-serif;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 4px 4px 0 #1e1e1e;
}

.quiz-option:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.quiz-option.correct {
  background-color: #4ade80;
  color: #fff;
  border-color: #1e1e1e;
  transform: translate(4px, 4px);
  box-shadow: none;
}

.quiz-option.incorrect {
  background-color: #ef476f;
  color: #fff;
  border-color: #1e1e1e;
  transform: translate(4px, 4px);
  box-shadow: none;
}

.quiz-feedback {
  height: 2.5rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.feedback-text {
  margin: 0;
}

.results-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.results-score {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 767px) {
  .topic-card {
    padding: 1.5rem;
    box-shadow: 2px 2px 0px rgba(30, 30, 30, 0.8);
  }

}
</style>