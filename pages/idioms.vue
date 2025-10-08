<template>
  <div class="idioms">
    <div class="idioms__inner">
      <header class="idioms__header">
        <h1 class="idioms__title">{{t('idioms.title')}}</h1>
        <p class="idioms__subtitle">{{t('idioms.subTitle')}}</p>
      </header>
      <section class="idioms__card idioms__card--intro">
        <h2 class="idioms__card-title">{{t('idioms.whatIsIt')}}</h2>
        <p class="idioms__paragraph"><b>{{t('idioms.frazeologizm')}}</b> {{t('idioms.isFrazeologizm')}}</p>
        <p class="idioms__paragraph"><b>{{t('idioms.idiom')}}</b> {{t('idioms.isIdiom')}}</p>
        <p class="idioms__paragraph">📌 <b>{{t('idioms.frazeologizm')}}:</b> <i>{{t('idioms.explainFirstFrazeoligizm')}}</i> {{t('idioms.explainSecondFrazeoligizm')}}</p>
        <p class="idioms__paragraph">📌 <b>{{t('idioms.idiom')}}:</b> <i>{{t('idioms.explainFirstIdiom')}}</i> {{t('idioms.explainSecondIdiom')}}</p>
      </section>
      <section v-for="(group, index) in idiomGroups" :key="index" class="idioms__card">
        <h2 class="idioms__card-title">{{ group.category }}</h2>
        <ul class="idioms__list">
          <li v-for="(idiom, iIndex) in group.expressions" :key="iIndex" class="idioms__item">
            <div class="idioms__example">
              <img class="idioms__icon" :src="Chat" alt="">
              <div class="idioms__example--wrapper">
                <p><b>{{ idiom.phrase }} — </b></p>
                <span class="idioms__translation">{{ idiom.meaning }}</span>
              </div>
            </div>
            <div v-if="idiom.example" class="idioms__example">
              <img class="idioms__icon" :src="Pin" alt="">
              <p><i>{{ idiom.example }}</i></p>
            </div>
          </li>
        </ul>
      </section>
      <section class="idioms__card idioms__quiz">
        <h2 class="idioms__card-title">{{t('idioms.quiz')}}</h2>
        <div v-if="!idiomQuizFinished" class="idioms__quiz-body">
          <p class="idioms__quiz-progress">{{t('idioms.quest')}} {{ idiomQuizIndex + 1 }} / {{ idiomQuizQuestions.length }}</p>
          <h3 class="idioms__quiz-question" v-html="idiomQuizQuestions[idiomQuizIndex].question"/>
          <div class="idioms__quiz-options">
            <button
                v-for="option in idiomQuizQuestions[idiomQuizIndex].options"
                :key="option"
                @click="checkIdiomAnswer(option)"
                :disabled="idiomSelectedAnswer !== null"
                :class="['idioms__quiz-option', getIdiomOptionClass(option)]"
            >
              {{ option }}
            </button>
          </div>
          <div class="idioms__quiz-feedback">
            <p v-if="idiomQuizFeedback === 'correct'" class="idioms__feedback-text">✅ {{t('idioms.correct')}}</p>
            <p v-if="idiomQuizFeedback === 'incorrect'" class="idioms__feedback-text">❌ {{t('idioms.unCorrect')}}
              <b>{{ idiomQuizQuestions[idiomQuizIndex].answer }}</b></p>
          </div>
          <button
              v-if="idiomSelectedAnswer"
              @click="nextIdiomQuestion"
              class="idioms__quiz-next"
          >
            {{ idiomQuizIndex === idiomQuizQuestions.length - 1 ? t('idioms.showResult') : t('idioms.further') }}
          </button>
        </div>
        <div v-else class="idioms__quiz-results">
          <h3 class="idioms__results-title">{{t('idioms.result')}}</h3>
          <p class="idioms__results-score">{{t('idioms.points')}} {{ idiomQuizScore }} / {{ idiomQuizQuestions.length }}</p>
          <button @click="resetIdiomQuiz" class="idioms__quiz-next">{{t('idioms.again')}}</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import Pin from '../assets/images/pin.svg'
import Chat from '../assets/images/chat.svg'
import { useHead, useSeoMeta } from '#imports'
const { t } = useI18n()
const route = useRoute()
const canonical = useCanonical()
const pageTitle = t('metaIdioms.title')
const pageDesc  = t('metaIdioms.description')

useHead({
  title: pageTitle,
  link: [
    { rel: 'canonical', href: canonical }
  ]
})

useSeoMeta({
  title: pageTitle,
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogType: 'article',
  ogUrl: canonical,
  ogImage: '/images/seo-idioms.png',
  robots: 'index, follow'
})

const idiomGroups = ref([
  {
    category: t('idiomFirstCategory.title'),
    expressions: [
      {
        phrase: 'Ich verstehe nur Bahnhof',
        meaning: t('idiomFirstCategory.firstMeaning'),
        example: 'Wenn er über Steuern spricht, verstehe ich nur Bahnhof.'
      },
      {
        phrase: 'Das ist mir Wurst',
        meaning: t('idiomFirstCategory.secondMeaning'),
        example: 'Was wir essen, ist mir Wurst.'
      },
      {
        phrase: 'Tomaten auf den Augen haben',
        meaning: t('idiomFirstCategory.thirdMeaning'),
        example: 'Hast du Tomaten auf den Augen? Das liegt doch direkt vor dir!'
      },
      {
        phrase: 'Alles in Butter',
        meaning: t('idiomFirstCategory.fourthMeaning'),
        example: 'Mach dir keine Sorgen, alles ist in Butter.'
      },
      {
        phrase: 'Den Nagel auf den Kopf treffen',
        meaning:  t('idiomFirstCategory.fifthMeaning'),
        example: 'Mit deiner Analyse hast du den Nagel auf den Kopf getroffen.'
      },
      {
        phrase: 'Mit dem falschen Fuß aufstehen',
        meaning: t('idiomFirstCategory.SixthMeaning'),
        example: 'Heute ist alles schiefgelaufen – ich bin wohl mit dem falschen Fuß aufgestanden.'
      }
    ]
  },
  {
    category: t('idiomSecondCategory.title'),
    expressions: [
      {
        phrase: 'Dienst nach Vorschrift machen',
        meaning: t('idiomSecondCategory.firstMeaning'),
        example: 'Seit dem Streit mit dem Chef macht er nur noch Dienst nach Vorschrift.'
      },
      {
        phrase: 'Ins kalte Wasser springen',
        meaning: t('idiomSecondCategory.secondMeaning'),
        example: 'Am ersten Tag musste ich ins kalte Wasser springen.'
      },
      {
        phrase: 'Das Heft in die Hand nehmen',
        meaning: t('idiomSecondCategory.thirdMeaning'),
        example: 'Sie nahm endlich das Heft in die Hand und organisierte alles selbst.'
      },
      {
        phrase: 'Jemandem auf der Nase herumtanzen',
        meaning: t('idiomSecondCategory.fourthMeaning'),
        example: 'Die Schüler tanzen dem Lehrer auf der Nase herum.'
      },
      {
        phrase: 'Über den Tellerrand schauen',
        meaning: t('idiomSecondCategory.fifthMeaning'),
        example: 'Man muss lernen, über den Tellerrand zu schauen.'
      },
      {
        phrase: 'Einen Zahn zulegen',
        meaning: t('idiomSecondCategory.SixthMeaning'),
        example: 'Wenn du das Projekt rechtzeitig abgeben willst, musst du einen Zahn zulegen.'
      }
    ]
  },
  {
    category: t('idiomThirdCategory.title'),
    expressions: [
      {
        phrase: 'Die Nerven verlieren',
        meaning: t('idiomThirdCategory.firstMeaning'),
        example: 'In der Prüfung hat er die Nerven verloren.'
      },
      {
        phrase: 'Ein dickes Fell haben',
        meaning: t('idiomThirdCategory.secondMeaning'),
        example: 'In diesem Beruf braucht man ein dickes Fell.'
      },
      {
        phrase: 'Jemandem den Kopf waschen',
        meaning: t('idiomThirdCategory.thirdMeaning'),
        example: 'Der Chef hat ihm ordentlich den Kopf gewaschen.'
      },
      {
        phrase: 'Da steppt der Bär',
        meaning: t('idiomThirdCategory.fourthMeaning'),
        example: 'Komm zur Party – da steppt der Bär!'
      },
      {
        phrase: 'Wie ein Elefant im Porzellanladen',
        meaning: t('idiomThirdCategory.fifthMeaning'),
        example: 'Er benimmt sich wie ein Elefant im Porzellanladen.'
      },
      {
        phrase: 'Das Herz auf der Zunge tragen',
        meaning: t('idiomThirdCategory.SixthMeaning'),
        example: 'Sie trägt das Herz auf der Zunge und sagt immer ehrlich, was sie denkt.'
      }
    ]
  }
])
const idiomQuizQuestions = ref([
  {
    question: t('idiomQuizFirstQuest.questionFirst'),
    options: [t('idiomQuizFirstQuest.optionOneFirst'), t('idiomQuizFirstQuest.optionTwoFirst'), t('idiomQuizFirstQuest.optionThreeFirst'),],
    answer: t('idiomQuizFirstQuest.answer')
  },
  {
    question: t('idiomQuizSecondQuest.questionFirst'),
    options: [t('idiomQuizSecondQuest.optionOneFirst'), t('idiomQuizSecondQuest.optionTwoFirst'), t('idiomQuizSecondQuest.optionThreeFirst'),],
    answer: t('idiomQuizSecondQuest.answer')
  },
  {
    question: t('idiomQuizThirdQuest.questionFirst'),
    options: [t('idiomQuizThirdQuest.optionOneFirst'), t('idiomQuizThirdQuest.optionTwoFirst'), t('idiomQuizThirdQuest.optionThreeFirst')],
    answer: t('idiomQuizThirdQuest.answer')
  },
  {
    question: t('idiomQuizFourthQuest.questionFirst'),
    options: [t('idiomQuizFourthQuest.optionOneFirst'), t('idiomQuizFourthQuest.optionTwoFirst'), t('idiomQuizFourthQuest.optionThreeFirst')],
    answer: t('idiomQuizFourthQuest.answer')
  },
  {
    question: t('idiomQuizFifthQuest.questionFirst'),
    options: [t('idiomQuizFifthQuest.optionOneFirst'), t('idiomQuizFifthQuest.optionTwoFirst'), t('idiomQuizFifthQuest.optionThreeFirst')],
    answer: t('idiomQuizFifthQuest.answer'),
  },
  {
    question: t('idiomQuizSixthQuest.questionFirst'),
    options: [t('idiomQuizSixthQuest.optionOneFirst'), t('idiomQuizSixthQuest.optionTwoFirst'),t('idiomQuizSixthQuest.optionThreeFirst')],
    answer: t('idiomQuizSixthQuest.answer')
  },
  {
    question: t('idiomQuizSeventhQuest.questionFirst'),
    options: [t('idiomQuizSeventhQuest.optionOneFirst'), t('idiomQuizSeventhQuest.optionTwoFirst'), t('idiomQuizSeventhQuest.optionThreeFirst')],
    answer: t('idiomQuizSeventhQuest.answer')
  },
  {
    question: t('idiomQuizEightQuest.questionFirst'),
    options: [t('idiomQuizEightQuest.optionOneFirst'), t('idiomQuizEightQuest.optionTwoFirst'), t('idiomQuizEightQuest.optionThreeFirst')],
    answer: t('idiomQuizEightQuest.answer')
  }
])

const idiomQuizIndex = ref(0)
const idiomSelectedAnswer = ref(null)
const idiomQuizScore = ref(0)
const idiomQuizFinished = ref(false)
const idiomQuizFeedback = ref('')

const checkIdiomAnswer = (option) => {
  idiomSelectedAnswer.value = option
  if (option === idiomQuizQuestions.value[idiomQuizIndex.value].answer) {
    idiomQuizScore.value++
    idiomQuizFeedback.value = 'correct'
  } else {
    idiomQuizFeedback.value = 'incorrect'
  }
}

const nextIdiomQuestion = () => {
  if (idiomQuizIndex.value < idiomQuizQuestions.value.length - 1) {
    idiomQuizIndex.value++
    idiomSelectedAnswer.value = null
    idiomQuizFeedback.value = ''
  } else {
    idiomQuizFinished.value = true
  }
}

const resetIdiomQuiz = () => {
  idiomQuizIndex.value = 0
  idiomQuizScore.value = 0
  idiomQuizFinished.value = false
  idiomSelectedAnswer.value = null
  idiomQuizFeedback.value = ''
}

const getIdiomOptionClass = (option) => {
  if (idiomSelectedAnswer.value === null) return ''
  if (option === idiomQuizQuestions.value[idiomQuizIndex.value].answer) return 'correct'
  if (option === idiomSelectedAnswer.value) return 'incorrect'
  return ''
}

definePageMeta({
  layout: 'footerlayout',
});

</script>

<style scoped>

.idioms__icon {
  width: 40px;
  margin-right: 10px;
}

.idioms__inner {
  max-width: 880px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  color: #2c2c2c;
}

.idioms__header {
  text-align: center;
  margin-bottom: 3rem;
}

.idioms__title {
  width: 100%;
  font-size: 2.8rem;
  font-weight: 600;
  color: #fff;
  background: #a78bfa;
  padding: 1rem 2rem;
  border: 3px solid #2c2c2c;
  border-radius: 16px;
  transform: rotate(1deg);
  box-shadow: 8px 8px 0px #2c2c2c;
  display: inline-block;
  margin-bottom: 1rem;
}

.idioms__subtitle {
  font-size: 1.2rem;
  color: var(--titleColor);
}

.idioms__card {
  background: #ffffff;
  border: 3px solid #2c2c2c;
  border-radius: 16px;
  box-shadow: 6px 6px 0px black;
  padding: 2rem;
  margin-bottom: 3rem;
}

.idioms__card-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 900;
  border-bottom: 3px solid #f2c94c;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.idioms__paragraph {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.idioms__list {
  list-style: none;
  padding-left: 0;
}

.idioms__example--wrapper {
  display: flex;
}

.idioms__item {
  font-size: 1.1rem;
  margin-bottom: 1.25rem;
  line-height: 1.6;
}

.idioms__translation {
  color: #777;
  font-style: italic;
  margin-left: 0.5rem;
}

.idioms__example {
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
  color: #444;
}

.idioms__emoji {
  margin-right: 0.4rem;
}

.idioms__quiz-body,
.idioms__quiz-results {
  text-align: center;
}

.idioms__quiz-progress {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 1rem;
}

.idioms__quiz-question {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.idioms__quiz-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.idioms__quiz-option {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 4px 4px 0 #1e1e1e;
}

.idioms__quiz-option:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.idioms__quiz-option.correct {
  background-color: #4ade80;
  color: #fff;
  transform: translate(4px, 4px);
  box-shadow: none;
}

.idioms__quiz-option.incorrect {
  background-color: #ef476f;
  color: #fff;
  transform: translate(4px, 4px);
  box-shadow: none;
}

.idioms__quiz-feedback {
  height: 2.5rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.idioms__quiz-next {
  margin-top: 1rem;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  background: #f2c94c;
  border: 3px solid #2c2c2c;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 4px 4px 0 #2c2c2c;
  transition: all 0.2s;
}

.idioms__results-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.idioms__results-score {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 767px) {
  .idioms__inner {
    padding: 1rem;
  }

  .idioms__title {
    font-size: 1.7rem;
    padding: 15px;
    box-shadow: 2px 2px 5px #2c2c2c;
  }

  .idioms__card-title {
    font-size: 1.6rem;
  }
  .idioms__card {
    box-shadow: 2px 2px 5px #2c2c2c;
  }
  .idioms__example--wrapper {
    display: flex;
    flex-direction: column;
  }
  .idioms__item {
    font-size: 0.9rem;
  }
  .idioms__quiz-question{
    font-size: 1.1rem;
  }
}

</style>
