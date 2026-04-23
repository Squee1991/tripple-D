<template>
  <main class="rules">
    <div class="rules__wrapper">
      <header class="rules__hero">
        <!--        <h1 class="rules__title">-->
        <!--          {{ t('rulesFirstBlock.title') }}-->
        <!--        </h1>-->
        <div class="rules__header-wrapper">
          <VBackBtn/>
          <div class="rules__header-title">Квиз и советы</div>
        </div>

      </header>
      <section class="rules__list" aria-label="Список правил использования артиклей">
        <p class="rules__subtitle">
          {{ t('rulesFirstBlock.subTitle') }}
        </p>
        <article class="rules__card" id="gender" ref="ruleCards">
          <h2 class="rules__card-title">1. {{ t('rulesFirstBlock.firstCardTitle') }}</h2>
          <ul class="rules__list-ul">
            <li class="rules__list-item">
              <strong>der</strong> {{ t('rulesFirstBlock.exampleSexM') }} <span
                class="rules__tip">{{ t('rulesFirstBlock.exampleAnswerM') }}</span>
            </li>
            <li class="rules__list-item">
              <strong>die</strong> {{ t('rulesFirstBlock.exampleSexW') }} <span
                class="rules__tip">{{ t('rulesFirstBlock.exampleAnswerW') }}</span>
            </li>
            <li class="rules__list-item">
              <strong>das</strong> {{ t('rulesFirstBlock.exampleSexIt') }} <span
                class="rules__tip">{{ t('rulesFirstBlock.exampleAnswerIt') }}</span>
            </li>
          </ul>
          <p class="rules__desc">
            {{ t('rulesFirstBlock.remember') }}
          </p>
        </article>

        <article class="rules__card" id="plural" ref="ruleCards">
          <h2 class="rules__card-title">2. {{ t('rulesSecondBlock.firstCardTitle') }} <strong>die</strong></h2>
          <p class="rules__desc">
            {{ t('rulesSecondBlock.firstCardSub') }} <strong>die</strong>.
          </p>
          <div class="rules__example">
            <p>der Hund <strong>→ die Hunde</strong></p>
            <p>das Kind <strong>→ die Kinder</strong></p>
          </div>
        </article>
        <article class="rules__card" id="cases" ref="ruleCards">
          <h2 class="rules__card-title">3. {{ t('rulesThirdBlock.firstCardTitle') }}</h2>
          <p class="rules__desc">
            {{ t('rulesThirdBlock.firstCardSubTitle') }}
          </p>
          <div class="table-wrapper">
            <table class="rules__table">
              <thead>
              <tr>
                <th>{{ t('rulesTablet.case') }}</th>
                <th>{{ t('rulesTablet.male') }}</th>
                <th>{{ t('rulesTablet.female') }}</th>
                <th>{{ t('rulesTablet.medium') }}</th>
                <th>{{ t('rulesTablet.plural') }}.</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <th>Nominativ</th>
                <td>der</td>
                <td>die</td>
                <td>das</td>
                <td>die</td>
              </tr>
              <tr>
                <th>Genitiv</th>
                <td>des</td>
                <td>der</td>
                <td>des</td>
                <td>der</td>
              </tr>
              <tr>
                <th>Dativ</th>
                <td>dem</td>
                <td>der</td>
                <td>dem</td>
                <td>den</td>
              </tr>
              <tr>
                <th>Akkusativ</th>
                <td>den</td>
                <td>die</td>
                <td>das</td>
                <td>die</td>
              </tr>
              </tbody>
            </table>
          </div>
        </article>
        <article class="rules__card" id="exceptions" ref="ruleCards">
          <h2 class="rules__card-title">4. {{ t('rulesFourthBlock.firstCardTitle') }}</h2>
          <ul class="rules__list-ul">
            <li class="rules__list-item">
              {{ t('rulesFourthBlock.exampleFemale') }} <strong> -chen </strong> , <strong> lein </strong> — всегда
              средний род (<i>das Mädchen</i>).
            </li>
            <li class="rules__list-item">
              {{ t('rulesFourthBlock.exampleTime') }} (der Montag, der Januar , der Winter).
            </li>
            <li class="rules__list-item">
              {{ t('rulesFourthBlock.exampleFlowers') }} (<i>die Rose, die Eiche</i>).
            </li>
          </ul>
        </article>
        <article class="rules__card" id="tips" ref="ruleCards">
          <h2 class="rules__card-title">5. {{ t('rulesFifthBlock.firstCardTitle') }}</h2>
          <ul class="rules__list-ul">
            <li class="rules__list-item">
              {{ t('rulesFifthBlock.exampleFirst') }} <strong>der Tisch</strong>, <strong>die Lampe</strong>.
            </li>
            <li class="rules__list-item">
              {{ t('rulesFifthBlock.exampleSecond') }} (-ung, -heit, -keit )
              {{ t('rulesFifthBlock.exampleSecondAnswer') }}
            </li>
          </ul>
        </article>
        <article class="rules__card" id="quiz" ref="ruleCards">
          <h2 class="rules__card-title">6. {{ t('rulesSixthBlock.firstTitle') }}</h2>
<!--          <p class="rules__desc">-->
<!--            {{ t('rulesSixthBlock.firstExercises') }} (der, die , das), {{ t('rulesSixthBlock.firstAnswer') }}-->
<!--          </p>-->
          <div class="quiz-form">
            <div class="quiz-item" v-for="(word, index) in quizWords" :key="index">
              <label :for="'word-' + index">{{ word.word }} <span class="rules__tip">{{ word.hint }}</span></label>
              <div class="quiz__content__inner">
                <input
                    :id="'word-' + index"
                    v-model="userAnswers[index]"
                    type="text"
                    placeholder="der, die, das..."
                    class="quiz-input"
                    @keyup.enter="checkAnswers"
                />
                <span v-if="showResults"
                      :class="['quiz-result', isCorrect(index) ? 'correct' : 'incorrect']">
                           {{ isCorrect(index) ? '✔️' : `'❌ ${word.article}` }}
                        </span>
              </div>
            </div>
            <div class="quiz__button-el">
              <button @click="checkAnswers" class="quiz-button">{{ t('rulesSixthBlock.checkBtn') }}</button>
              <button class="reset" @click="resetResult">
                <img class="quiz__undo-icon" src="../assets/images/undo.svg" alt="reset">
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>

<script setup>
import {ref} from 'vue';
import {useSeoMeta} from "#imports";
import VBackBtn from "~/src/components/V-back-btn.vue";

const {t} = useI18n()

const quizWords = [
  {word: 'Zeitung', article: 'die', hint: ' '},
  {word: 'Gesundheit', article: 'die', hint: ''},
  {word: 'Mädchen', article: 'das', hint: ''},
  {word: 'Gebäude', article: 'das', hint: ''},
  {word: 'Montag', article: 'der', hint: ''},
  {word: 'Rose', article: 'die', hint: ''},
]

useSeoMeta({
  robots: 'noindex, nofollow'
})

const userAnswers = ref(Array(quizWords.length).fill(''))
const showResults = ref(false)

function checkAnswers() {
  showResults.value = true
}

function isCorrect(index) {
  if (!userAnswers.value[index]) return false;
  return userAnswers.value[index].trim().toLowerCase() === quizWords[index].article
}

const resetResult = () => {
  showResults.value = false;
  userAnswers.value = Array(quizWords.length).fill('');
}

</script>

<style scoped>
.rules {
  padding-bottom: 1rem;
  height: 100%;
  font-family: "Nunito", sans-serif;
  overflow: hidden;
}

.rules__header-title {
  flex: 1;
  font-size: 24px;
  font-weight: 900;
  font-family: "Nunito", sans-serif;
  color: white;
}

.reset {
  border: none;
  background: none;
}

.rules__wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.rules__hero {
  flex-shrink: 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.rules__subtitle {
  font-size: 18px;
  text-align: center;
  color: white;
  max-width: 600px;
  line-height: 1.3;
  background: #00c2ff;
  border-radius: 15px;
  padding: 10px;
  font-family: "Nunito", sans-serif;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
}

.rules__list {
  flex: 1;
  overflow-y: auto;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rules__list::-webkit-scrollbar {
  width: 1px;
  display: none;
}

.rules__card {
  background: #fff;
  border-radius: 24px;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  padding: 1rem;
  transition: all 0.2s ease-in-out;
}

.rules__card-title {
  font-family: "Nunito", sans-serif;
  font-size: 1.3rem;
  color: #1e1e1e;
  margin-bottom: 1rem;
}

.rules__list-ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rules__list-item {
  font-size: 16px;
}

.rules__list-item::before {
  content: '👉';
  margin-right: 0.75rem;
  font-size: 1.5rem;
}

.rules__desc {
  color: #555;
  margin: 1.5rem 0 0.5rem 0;
  font-size: 16px;
  line-height: 1.7;
}

.rules__example {
  color: #333;
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  margin-top: 1rem;
}

.rules__example strong {
  color: #f97028;
}

.rules__tip {
  color: #6b7280;
  font-size: 1rem;
  margin-left: 0.5rem;
}

.table-wrapper {
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  margin-top: 1.5rem;
}

.rules__table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.rules__table th, .rules__table td {
  border: 3px solid var(--tabsSlideBorderColor);
  padding: 0.75rem;
  border-radius: 8px;
}

.rules__table thead th {
  background-color: #60a5fa;
  color: white;
  font-family: "Nunito", sans-serif;
  font-size: 0.9rem;
}

.rules__table tbody td {
  background-color: #fff;
  font-weight: 500;
}

.rules__table tbody th {
  background-color: #f3f4f6;
  font-weight: 700;
}

.quiz-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 1.5rem;
}

.quiz-item {
  display: flex;
  flex-direction: column;
}

.rules__header-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 10px 15px 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  margin-bottom: 5px;
}

.quiz-item label {
  font-weight: 700;
}

.quiz__content__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quiz-input {
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  padding: 0.75rem;
  border-radius: 12px;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  flex-grow: 1;
  transition: all 0.2s ease-in-out;
}

.quiz-input:focus {
  outline: none;
  border-color: #fca13a;
  box-shadow: 2px 2px 0 #fca13a;
}

.quiz-result {
  font-weight: 700;
  font-size: 1rem;
}

.quiz-result.correct {
  color: #22c55e;
}

.quiz-result.incorrect {
  color: #ef4444;
}

.quiz__button-el {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.quiz-button {
  font-family: "Nunito", sans-serif;
  padding: 0.45rem 1.2rem;
  font-size: 1.2rem;
  border-radius: 12px;
  cursor: pointer;
  border: 2px solid #1e1e1e;
  transition: all 0.1s ease-in-out;
  background-color: #f97028;
  color: #ffffff;
  box-shadow: 3px 3px 0 #1e1e1e;
  flex: 1;
}

.quiz-button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e;
}

.quiz__undo-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.2s ease;
}


.rules__title {
  font-size: 2rem;
  transform: rotate(0);
}

.rules__card {
  padding: 12px;
}

.rules__table thead th {
  max-width: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rules__table tbody th {
  width: 85px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>