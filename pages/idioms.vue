<template>
  <div class="idioms">
    <header class="app-header">
      <VBackBtn/>
      <h1 class="app-title">{{ t('idioms.title') }}</h1>
    </header>

    <div class="scroll-area">
      <div class="app-container">

        <section class="card card--intro">
          <h2 class="card-title">{{ t('idioms.whatIsIt') }}</h2>
          <div class="intro-content">
            <p class="text-p"><b>{{ t('idioms.frazeologizm') }}</b> {{ t('idioms.isFrazeologizm') }}</p>
            <p class="text-p"><b>{{ t('idioms.idiom') }}</b> {{ t('idioms.isIdiom') }}</p>
            <div class="tips">
              <p class="tip-item">📌 <b>{{ t('idioms.frazeologizm') }}:</b> <i>{{
                  t('idioms.explainFirstFrazeoligizm')
                }}</i> {{ t('idioms.explainSecondFrazeoligizm') }}</p>
              <p class="tip-item">📌 <b>{{ t('idioms.idiom') }}:</b> <i>{{ t('idioms.explainFirstIdiom') }}</i>
                {{ t('idioms.explainSecondIdiom') }}</p>
            </div>
          </div>
        </section>

        <section v-for="(group, index) in idiomGroups" :key="index" class="card">
          <h2 class="card-title">{{ group.category }}</h2>
          <div class="idiom-list">
            <div v-for="(idiom, iIndex) in group.expressions" :key="iIndex" class="idiom-item">
              <div class="idiom-row">
                <img class="icon-sm" :src="Chat" alt="">
                <div class="idiom-text">
                  <p class="phrase"><b>{{ idiom.phrase }}</b></p>
                  <p class="meaning">{{ idiom.meaning }}</p>
                </div>
              </div>
              <div v-if="idiom.example" class="idiom-example">
                <img class="icon-xs" :src="Pin" alt="">
                <p class="example-text"><i>{{ idiom.example }}</i></p>
              </div>
            </div>
          </div>
        </section>

        <section class="card quiz-card">
          <h2 class="card-title">{{ t('idioms.quiz') }}</h2>

          <div v-if="!idiomQuizFinished" class="quiz-container">
            <p class="quiz-meta">{{ t('idioms.quest') }} {{ idiomQuizIndex + 1 }} / {{ idiomQuizQuestions.length }}</p>
            <h3 class="quiz-question" v-html="idiomQuizQuestions[idiomQuizIndex].question"/>

            <div class="quiz-options">
              <button
                  v-for="option in idiomQuizQuestions[idiomQuizIndex].options"
                  :key="option"
                  @click="checkIdiomAnswer(option)"
                  :disabled="idiomSelectedAnswer !== null"
                  :class="['quiz-btn', getIdiomOptionClass(option)]"
              >
                {{ option }}
              </button>
            </div>

            <div class="quiz-feedback">
              <Transition name="fade">
                <p v-if="idiomQuizFeedback === 'correct'" class="status-correct">✅ {{ t('idioms.correct') }}</p>
                <p v-else-if="idiomQuizFeedback === 'incorrect'" class="status-wrong">
                  ❌ {{ t('idioms.unCorrect') }} <br>
                  <b>{{ idiomQuizQuestions[idiomQuizIndex].answer }}</b>
                </p>
              </Transition>
            </div>

            <button
                v-if="idiomSelectedAnswer"
                @click="nextIdiomQuestion"
                class="btn-next"
            >
              {{ idiomQuizIndex === idiomQuizQuestions.length - 1 ? t('idioms.showResult') : t('idioms.further') }}
            </button>
          </div>

          <div v-else class="quiz-results">
            <h3 class="result-title">{{ t('idioms.result') }}</h3>
            <p class="result-score">{{ t('idioms.points') }} {{ idiomQuizScore }} / {{ idiomQuizQuestions.length }}</p>
            <button @click="resetIdiomQuiz" class="btn-next">{{ t('idioms.again') }}</button>
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
import {useSeoMeta} from '#imports'
import VBackBtn from "~/src/components/V-back-btn.vue";

const {t} = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow'
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
        meaning: t('idiomFirstCategory.fifthMeaning'),
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
        example: 'Seit dem Streit с тем Chef macht er nur noch Dienst nach Vorschrift.'
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
        phrase: 'Die Nervен verlieren',
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
        example: 'Sie trägt das Herz auf der Zunge и sagt immer ehrlich, was sie denkt.'
      }
    ]
  }
])

const idiomQuizQuestions = ref([
  {
    question: t('idiomQuizFirstQuest.questionFirst'),
    options: [t('idiomQuizFirstQuest.optionOneFirst'), t('idiomQuizFirstQuest.optionTwoFirst'), t('idiomQuizFirstQuest.optionThreeFirst')],
    answer: t('idiomQuizFirstQuest.answer')
  },
  {
    question: t('idiomQuizSecondQuest.questionFirst'),
    options: [t('idiomQuizSecondQuest.optionOneFirst'), t('idiomQuizSecondQuest.optionTwoFirst'), t('idiomQuizSecondQuest.optionThreeFirst')],
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
    answer: t('idiomQuizFifthQuest.answer')
  },
  {
    question: t('idiomQuizSixthQuest.questionFirst'),
    options: [t('idiomQuizSixthQuest.optionOneFirst'), t('idiomQuizSixthQuest.optionTwoFirst'), t('idiomQuizSixthQuest.optionThreeFirst')],
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
</script>

<style scoped>
.idioms {
  background: var(--bg);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  padding: 5px 10px 10px 10px;
  z-index: 100;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 23px;
  font-weight: 800;
  margin-left: 15px;
  color: white;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.app-container {
  padding: 1.5rem 1rem 30px 1rem;
}

.card {
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #1e1e1e;
  padding: 1.2rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 3px solid #f2c94c;
  color: #1e1e1e;
}

.text-p {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 0.8rem;
}

.tips {
  background: #f9fafb;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px dashed #ccc;
}

.tip-item {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.idiom-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.idiom-item {
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 1rem;
}

.idiom-row {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.idiom-text .phrase {
  font-size: 1.05rem;
  color: #1e1e1e;
}

.idiom-text .meaning {
  font-size: 0.95rem;
  color: #6b7280;
  font-style: italic;
  margin-top: 0.2rem;
}

.idiom-example {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  background: #fffbeb;
  padding: 0.4rem;
  border-radius: 6px;
}

.example-text {
  font-size: 0.9rem;
  color: #4b5563;
}

.icon-sm, .icon-xs {
  width: 32px;
  height: 32px;
}

.quiz-container {
  text-align: center;
}

.quiz-meta {
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.quiz-question {
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.quiz-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  border: 2px solid #1e1e1e;
  border-radius: 12px;
  background: #fff;
  box-shadow: 3px 3px 0 #1e1e1e;
  transition: 0.1s;
}

.quiz-btn.correct {
  background: #4ade80 !important;
  color: #fff;
}

.quiz-btn.incorrect {
  background: #ef476f !important;
  color: #fff;
}

.status-correct {
  color: #059669;
  font-weight: 800;
}

.status-wrong {
  color: #dc2626;
  font-weight: 800;
}

.btn-next {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 800;
  background: #f2c94c;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #1e1e1e;
  margin-top: 0.5rem;
}

.result-score {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 1rem 0;
  color: #a78bfa;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>