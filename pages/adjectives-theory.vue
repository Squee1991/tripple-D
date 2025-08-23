<template>
  <div class="adjs">
    <div class="adjs__inner">
      <header class="adjs__header">
        <h1 class="adjs__title">Прилагательные в немецком: просто и понятно</h1>
        <p class="adjs__subtitle">Что это, где стоят, как сравниваются и какие окончания брать. В конце — мини-квиз.</p>
      </header>
      <section v-for="section in contentSections" :key="section.id" class="adjs__card" :class="section.customClass">
        <h2 class="adjs__card-title">{{ section.title }}</h2>

        <template v-for="(item, index) in section.content" :key="index">

          <p v-if="item.type === 'paragraph'" class="adjs__paragraph" v-html="item.text"></p>

          <div v-if="item.type === 'note'" class="adjs__note" v-html="item.text"></div>

          <div v-if="item.type === 'tip'" class="adjs__tip" v-html="item.text"></div>

          <ul v-if="item.type === 'list'" class="adjs__list">
            <li v-for="(li, i) in item.items" :key="i" class="adjs__item">
              <div class="adjs__example">
                <img class="adjs__icon" :src="li.icon === 'Chat' ? Chat : Pin" alt="icon">
                <div class="adjs__example--wrapper">
                  <p v-html="li.mainText"></p>
                  <span v-if="li.translation" class="adjs__translation" v-html="li.translation"></span>
                </div>
              </div>
              <div v-if="li.subExample" class="adjs__example" style="margin-top: 8px;">
                <img class="adjs__icon" :src="li.subExample.icon === 'Chat' ? Chat : Pin" alt="icon">
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
        <h2 class="adjs__card-title">7) Мини-квиз</h2>
        <div v-if="!quizFinished" class="adjs__quiz-body">
          <p class="adjs__quiz-progress">Вопрос {{ quizIndex + 1 }} / {{ quizQuestions.length }}</p>
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
            <p v-if="quizFeedback === 'correct'" class="adjs__feedback-text">✅ Верно!</p>
            <p v-if="quizFeedback === 'incorrect'" class="adjs__feedback-text">❌ Неверно. Правильный ответ:
              <b>{{ quizQuestions[quizIndex].answer }}</b></p>
          </div>
          <button
              v-if="selectedAnswer"
              @click="nextQuestion"
              class="adjs__quiz-next"
          >
            {{ quizIndex === quizQuestions.length - 1 ? 'Показать результат' : 'Дальше' }}
          </button>
        </div>
        <div v-else class="adjs__quiz-results">
          <h3 class="adjs__results-title">Результат</h3>
          <p class="adjs__results-score">Баллы: {{ quizScore }} / {{ quizQuestions.length }}</p>
          <button @click="resetQuiz" class="adjs__quiz-next">Пройти ещё раз</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import Pin from '../assets/images/pin.svg'
import Chat from '../assets/images/chat.svg'

const contentSections = ref([
  {
    id: 1,
    title: '1) Что такое прилагательное?',
    customClass: 'adjs__card--intro',
    content: [
      {
        type: 'paragraph',
        text: '<b>Прилагательное</b> (Adjektiv) — слово, отвечающее на вопрос «какой?». Примеры: <i>schön</i> (красивый), <i>teuer</i> (дорогой), <i>schnell</i> (быстрый).'
      },
      {
        type: 'note',
        text: '<b>Важно:</b> прилагательные бывают в двух позициях — от этого зависит, нужны ли окончания.'
      },
      {
        type: 'list', items: [
          {
            icon: 'Chat',
            mainText: '<b>Предикативная позиция</b> — после <i>sein/werden/bleiben</i>, <u>без окончаний</u>.',
            translation: 'Die Schuhe sind <b>teuer</b>. — Обувь дорогая.'
          },
          {
            icon: 'Chat',
            mainText: '<b>Атрибутивная позиция</b> — перед существительным, <u>с окончаниями</u>.',
            translation: 'ein <b>schönes</b> Haus; der <b>neue</b> Laptop'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: '2) Как выбрать окончание: супер-короткий алгоритм',
    content: [
      {
        type: 'ordered-list', items: [
          '<b>После sein/werden/bleiben?</b> — ставь <b>без окончания</b>: <i>ist schön</i>.',
          '<b>Перед существительным?</b> Смотри на артикль: <ul class="adjs__bullets"><li><b>der/die/das, dieser, jeder…</b> (определённый) → <u>слабое склонение</u></li><li><b>ein/kein/mein…</b> (неопределённый) → <u>смешанное склонение</u></li><li><b>без артикля</b> → <u>сильное склонение</u></li></ul>',
          '<b>Падеж?</b> В Akkusativ, Dativ и Genitiv почти всегда окончание <b>-en</b>.'
        ]
      },
      {
        type: 'tip',
        text: '<b>Лайфхак:</b> если сомневаешься в косвенных падежах (Akk/Dat/Gen) — чаще всего подходит окончание <b>-en</b>.'
      }
    ]
  },
  {
    id: 3,
    title: '3) Разбираем на примере: `ein` + прилагательное',
    content: [
      {
        type: 'paragraph',
        text: 'Это самая важная тема для новичков. Артикль `ein` (один, какой-то) не всегда показывает род существительного. В этом случае прилагательное берёт эту работу на себя.'
      },
      {
        type: 'note',
        text: '<b>Простая логика:</b> прилагательное получает окончание, которое "подсказывает" нам род существительного, как это сделал бы определённый артикль (d<b>er</b>, di<b>e</b>, da<b>s</b>).'
      },
      {
        type: 'list',
        items: [
          {
            icon: 'Chat',
            mainText: 'Мужской род (Maskulinum): de<b>r</b> Stuhl → ein gut<b>er</b> Stuhl',
            translation: 'Мы видим окончание <b>-er</b> и сразу понимаем, что речь о мужском роде.'
          },
          {
            icon: 'Chat',
            mainText: 'Женский род (Femininum): di<b>e</b> Lampe → ein<b>e</b> gut<b>e</b> Lampe',
            translation: 'Артикль `eine` уже показал женский род, поэтому прилагательному достаточно простого окончания <b>-e</b>.'
          },
          {
            icon: 'Chat',
            mainText: 'Средний род (Neutrum): da<b>s</b> Buch → ein gut<b>es</b> Buch',
            translation: 'Окончание <b>-es</b> безошибочно указывает на средний род.'
          }
        ]
      },
      {
        type: 'paragraph',
        text: '<b>Посмотрим, как это работает в предложениях:</b>'
      },
      {
        type: 'table',
        title: 'Примеры в Nominativ (Кто? Что?) и Akkusativ (Кого? Что?)',
        headers: ['Род', 'Nominativ (это есть...)', 'Akkusativ (я покупаю...)'],
        rows: [
          ['Mask. (m)', 'Das ist <b>ein schöner</b> Tisch.', 'Ich kaufe <b>einen schönen</b> Tisch.'],
          ['Fem. (f)', 'Das ist <b>eine schöne</b> Lampe.', 'Ich kaufe <b>eine schöne</b> Lampe.'],
          ['Neut. (n)', 'Das ist <b>ein schönes</b> Bild.', 'Ich kaufe <b>ein schönes</b> Bild.']
        ]
      },
      {
        type: 'tip',
        text: '<b>Запомните!</b> В Akkusativ мужской род меняется (`ein` → `einen`), а прилагательное почти всегда получает окончание <b>-en</b>. Женский и средний род в Akkusativ выглядят так же, как в Nominativ.'
      }
    ]
  },
  {
    id: 4,
    title: '4) Мини-таблицы для старта',
    content: [
      {
        type: 'table',
        title: 'A) Сильное склонение (без артикля), Nominativ',
        headers: ['', 'Mask.', 'Fem.', 'Neut.', 'Plural'],
        rows: [
          ['Окончан.', '-er', '-e', '-es', '-e'],
          ['Пример', '<b>Guter</b> Mann', '<b>Gute</b> Frau', '<b>Gutes</b> Brot', '<b>Gute</b> Bücher']
        ]
      },
      {
        type: 'table',
        title: 'B) Смешанное (после ein/kein/мой-твой…), Nom/Akk',
        headers: ['Падеж', 'Mask.', 'Fem.', 'Neut.', 'Plural'],
        rows: [
          ['Nom', 'ein <b>guter</b> Mann', 'eine <b>gute</b> Frau', 'ein <b>gutes</b> Brot', 'meine <b>guten</b> Freunde'],
          ['Akk', 'einen <b>guten</b> Mann', 'eine <b>gute</b> Frau', 'ein <b>gutes</b> Brot', 'meine <b>guten</b> Freunde']
        ]
      },
      {
        type: 'note',
        text: 'Идея слабого склонения: в Nominativ ед.ч. часто <b>-e</b>, в остальных падежах — обычно <b>-en</b>.'
      },
      {
        type: 'table',
        title: 'C) Слабое (после der/die/das, dieser…)',
        headers: ['Падеж', 'Mask.', 'Fem.', 'Neut.', 'Plural'],
        rows: [
          ['Nom', 'der <b>gute</b> Mann', 'die <b>gute</b> Frau', 'das <b>gute</b> Brot', 'die <b>guten</b> Freunde'],
          ['Akk', 'den <b>guten</b> Mann', 'die <b>gute</b> Frau', 'das <b>gute</b> Brot', 'die <b>guten</b> Freunde']
        ]
      }
    ]
  },
  {
    id: 5,
    title: '5) Степени сравнения (очень кратко)',
    content: [
      {
        type: 'list', items: [
          {
            icon: 'Chat',
            mainText: '<b>Положительная форма</b> (обычная): <i>schnell, teuer, schön</i>',
            translation: 'Das Auto ist <b>schnell</b>.'
          },
          {
            icon: 'Chat',
            mainText: '<b>Komparativ</b> (сравнительная): +<b>-er</b> + <i>als</i>',
            translation: 'schnell → <b>schneller</b> (als), teuer → <b>teurer</b> (als)',
            subExample: {icon: 'Pin', text: '<i>Mein Auto ist <b>schneller</b> als deins.</i>'}
          },
          {
            icon: 'Chat',
            mainText: '<b>Superlativ</b> (превосходная): <i>am</i> + основа + <b>-sten</b> (как наречие) / <b>-ste</b> (перед сущ.)',
            translation: 'am <b>schnellsten</b>; der <b>schnellste</b> Weg',
            subExample: {icon: 'Pin', text: '<i>Er läuft <b>am schnellsten</b>.</i>'}
          }
        ]
      },
      {
        type: 'note',
        text: '<b>Орфография:</b> после шипящих <i>(s, ß, x, z)</i> чаще <b>-esten</b>: <i>heiß → am heißesten</i>. Часто появляется умлаут: <i>alt → älter → am ältesten</i>.'
      },
      {
        type: 'tip',
        text: '<b>Неправильные формы:</b> gut → <b>besser</b> → <b>am besten</b>; viel → <b>mehr</b> → <b>am meisten</b>; hoch → <b>höher</b> → <b>am höchsten</b>.'
      }
    ]
  },
  {
    id: 6,
    title: '6) Топ-ошибки и короткие правила',
    content: [
      {
        type: 'list', items: [
          {
            icon: 'Chat',
            mainText: '<b>Нет окончаний после sein/werden/bleiben</b>',
            translation: '✗ Die Schuhe sind <s>teuren</s> → ✓ Die Schuhe sind <b>teuer</b>.'
          },
          {
            icon: 'Chat',
            mainText: '<b>Komparativ всегда используется с `als` (чем)</b>',
            translation: 'größer <b>als</b>…, besser <b>als</b>…'
          },
          {
            icon: 'Chat',
            mainText: '<b>Dativ Plural</b>: у существительного обычно +<i>-n</i>',
            translation: 'mit den <b>guten</b> Freunde<b>n</b>'
          }
        ]
      }
    ]
  }
]);
const quizQuestions = ref([
  {
    question: 'Выбери форму: <b>Das ist ein ___ Tisch. (schön)</b>',
    options: ['schöner', 'schöne', 'schönes'],
    answer: 'schöner'
  },
  {
    question: 'Акузатив м.р. после ein-слова: <b>Ich habe einen ___ Hund. (klein)</b>',
    options: ['kleinen', 'kleiner', 'kleine'],
    answer: 'kleinen'
  },
  {question: 'Предикатив: <b>Die Schuhe sind ___.</b>', options: ['teuer', 'teuren', 'teure'], answer: 'teuer'},
  {
    question: 'Опред. артикль, Akk Neut: <b>Sie kauft das ___ Kleid. (rot)</b>',
    options: ['rote', 'rotes', 'roter'],
    answer: 'rote'
  },
  {
    question: 'Dativ Plural: <b>Wir sprechen mit den ___ Nachbarn. (nett)</b>',
    options: ['netten', 'nette', 'netter'],
    answer: 'netten'
  },
  {
    question: 'Komparativ: <b>Dieses Handy ist ___ als jenes. (leicht)</b>',
    options: ['leichter', 'am leichtesten', 'leichte'],
    answer: 'leichter'
  },
  {
    question: 'Superlativ (как наречие): <b>Er läuft ___.</b>',
    options: ['am schnellsten', 'schnellste', 'der schnellste'],
    answer: 'am schnellsten'
  },
  {
    question: 'Сильное склонение (без артикля): <b>___ Brot ist frisch. (gut)</b>',
    options: ['Gutes', 'Guter', 'Gute'],
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

definePageMeta({
  layout: 'footerlayout',
})
</script>

<style scoped>
.adjs__inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  color: #1f2937;
}

.adjs__header {
  text-align: center;
  margin-bottom: 3rem;
}

.adjs__title {
  font-size: 2.6rem;
  font-weight: 800;
  color: #fff;
  background: #60a5fa;
  padding: 1rem 2rem;
  border: 3px solid #1f2937;
  border-radius: 16px;
  transform: rotate(-0.6deg);
  box-shadow: 8px 8px 0px #1f2937;
  display: inline-block;
  margin-bottom: 1rem;
}

.adjs__subtitle {
  font-size: 1.1rem;
  color: var(--titleColor);
}

.adjs__card {
  background: #ffffff;
  border: 3px solid #1f2937;
  border-radius: 16px;
  box-shadow: 6px 6px 0px #0f172a;
  padding: 2rem;
  margin-bottom: 2rem;
}

.adjs__card-title {
  text-align: center;
  font-size: 1.8rem;
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
  width: 40px;
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
  font-size: 0.98rem;
}

.adjs__table th, .adjs__table td {
  border: 2px solid #1f2937;
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
  border: 3px solid #0f172a;
  border-radius: 12px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 4px 4px 0 #0f172a;
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
  background: #a3e635;
  border: 3px solid #1f272a;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 4px 4px 0 #1f2937;
  transition: all 0.2s;
  color: #1f2937;
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
  .adjs__inner {
    padding: 1rem;
  }

  .adjs__title {
    font-size: 2.1rem;
    padding: 14px;
    box-shadow: 2px 2px 5px #1f2937;
  }

  .adjs__card {
    box-shadow: 2px 2px 5px #1f2937;
  }

  .adjs__card-title {
    font-size: 1.45rem;
  }

  .adjs__icon {
    width: 34px;
    margin-right: 8px;
  }
}

</style>