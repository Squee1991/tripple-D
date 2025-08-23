<template>
  <div class="verbs">
    <div class="verbs__inner">
      <header class="verbs__header">
        <h1 class="verbs__title">Глаголы в немецком</h1>
        <p class="verbs__subtitle">Основы для уверенного старта: Präsens, Perfekt, Präteritum и Futur I. Разбираем
          порядок слов и частые ошибки.</p>
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
            <img class="verbs__icon" :src="item.icon === 'Chat' ? Chat : Pin" alt="icon">
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
        <h2 class="verbs__card-title">7) Проверь себя: Мини-квиз</h2>
        <div v-if="!quizFinished" class="verbs__quiz-body">
          <p class="verbs__quiz-progress">Вопрос {{ quizIndex + 1 }} / {{ quizQuestions.length }}</p>
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
            <p v-if="quizFeedback==='correct'">✅ Отлично, всё верно!</p>
            <p v-if="quizFeedback==='incorrect'">❌ Ошибка. Правильный ответ: <b>{{
                quizQuestions[quizIndex].answer
              }}</b></p>
          </div>
          <button v-if="selectedAnswer" @click="nextQuestion" class="verbs__quiz-next">
            {{ quizIndex === quizQuestions.length - 1 ? 'Показать результат' : 'Следующий вопрос' }}
          </button>
        </div>
        <div v-else class="verbs__quiz-results">
          <h3 class="verbs__results-title">Ваш результат</h3>
          <p class="verbs__results-score">Правильных ответов: {{ quizScore }} из {{ quizQuestions.length }}</p>
          <button @click="resetQuiz" class="verbs__quiz-next">Пройти ещё раз</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import Pin from '../assets/images/pin.svg'
import Chat from '../assets/images/chat.svg'

// ===============================================================
// Весь контент для теоретических карточек теперь здесь
// ===============================================================
const contentSections = ref([
  {
    id: 1,
    title: '1) Порядок слов: глагол на 2-м месте',
    customClass: 'verbs__card--intro',
    content: [
      {
        type: 'paragraph',
        text: '<b>Спряжение</b> — это изменение глагола по лицам и числам (я делаю, ты делаешь...). В немецком языке это основа предложения.'
      },
      {
        type: 'note',
        text: '<b>Золотое правило:</b> в простом утвердительном предложении спрягаемый (изменяемый) глагол <b>всегда стоит на втором месте</b>.'
      },
      {
        type: 'example', icon: 'Chat', lines: [
          '<u>Ich</u> <b>lerne</b> <u>heute Deutsch</u>. (Я учу сегодня немецкий.)',
          '<u>Heute</u> <b>lerne</b> <u>ich Deutsch</u>. (Сегодня я учу немецкий.)'
        ]
      },
      {
        type: 'paragraph',
        text: 'Если в предложении есть второй глагол (например, в инфинитиве или Partizip II), он отправляется в самый <b>конец</b>.'
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
    title: '2) Präsens — настоящее время',
    content: [
      {
        type: 'paragraph',
        text: 'Самое частое время, используется для описания действий в настоящем или будущем (с указанием времени). У большинства глаголов одинаковые окончания.'
      },
      {
        type: 'table', headers: ['', 'machen (делать)', 'lernen (учить)'], rows: [
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
        text: '<b>Внимание на сильные глаголы!</b> У них во 2-м и 3-м лице ед.ч. (du, er/sie/es) часто меняется корневая гласная: f<b>a</b>hren → du f<b>ä</b>hrst, l<b>e</b>sen → du l<b>ie</b>st.'
      }
    ]
  },
  {
    id: 3,
    title: '3) Perfekt — разговорное прошедшее время',
    content: [
      {
        type: 'paragraph',
        text: 'Используется для описания завершённых действий, особенно в устной речи. Строится по формуле:'
      },
      {type: 'note', text: '<b>haben / sein</b> (на 2-м месте) + <b>Partizip II</b> (в конце предложения).'},
      {
        type: 'list', items: [
          'С <b>sein</b> идут глаголы движения (<i>gehen, fahren, fliegen</i>), смены состояния (<i>aufstehen, sterben</i>) и исключения (<i>sein, bleiben, werden</i>).',
          'Большинство остальных глаголов — с <b>haben</b>.'
        ]
      },
      {
        type: 'example', icon: 'Pin', lines: [
          'Er <b>ist</b> nach Berlin <u>gefahren</u>. (Движение → sein)',
          'Wir <b>haben</b> viel <u>gemacht</u>. (Обычный глагол → haben)'
        ]
      }
    ]
  },
  {
    id: 4,
    title: '4) Präteritum — "книжное" прошедшее время',
    content: [
      {
        type: 'paragraph',
        text: 'Это время чаще всего встречается в книгах, новостях и рассказах. В живой речи его используют в основном для глаголов <b>sein, haben</b> и <b>модальных</b>.'
      },
      {
        type: 'example', icon: 'Chat', lines: [
          'Früher <b>war</b> ich Student. (Раньше я был студентом.)',
          'Gestern <b>hatte</b> ich keine Zeit. (Вчера у меня не было времени.)',
          'Ich <b>konnte</b> nicht kommen. (Я не мог прийти.)'
        ]
      }
    ]
  },
  {
    id: 5,
    title: '5) Futur I — будущее время',
    content: [
      {type: 'paragraph', text: 'Используется для выражения планов или предположений о будущем. Формула проста:'},
      {type: 'note', text: '<b>werden</b> (на 2-м месте) + <b>инфинитив</b> (в конце предложения).'},
      {
        type: 'example', icon: 'Pin', lines: [
          'Ich <b>werde</b> morgen Deutsch <u>lernen</u>. (Я буду завтра учить немецкий.)'
        ]
      },
      {
        type: 'paragraph',
        text: '<b>Лайфхак:</b> в разговорной речи немцы часто используют Präsens для будущего, если из контекста и так всё понятно: <i>Ich lerne <b>morgen</b> Deutsch.</i>'
      }
    ]
  },
  {
    id: 6,
    title: '6) Типичные ошибки новичков',
    content: [
      {
        type: 'list', items: [
          '<b>Порядок слов:</b> Спрягаемый глагол не на втором месте.<br>❌ <span style="text-decoration: line-through;">Ich heute lerne Deutsch.</span><br>✅ Ich <b>lerne</b> heute Deutsch.',
          '<b>Рамочная конструкция:</b> Вторая часть глагола (в Perfekt, Futur I) не в конце.<br>❌ <span style="text-decoration: line-through;">Ich habe gelernt heute.</span><br>✅ Ich habe heute <b>gelernt</b>.',
          '<b>Выбор haben/sein:</b> Неправильный вспомогательный глагол в Perfekt.<br>❌ <span style="text-decoration: line-through;">Ich bin das Buch gelesen.</span><br>✅ Ich <b>habe</b> das Buch gelesen.'
        ]
      }
    ]
  }
]);

const quizQuestions = ref([
  {
    question: 'Как правильно сказать: "Я учу немецкий"?',
    options: ['Ich lerne Deutsch.', 'Ich Deutsch lerne.', 'Ich lernen Deutsch.'],
    answer: 'Ich lerne Deutsch.'
  },
  {
    question: 'Выберите верный порядок слов: "Сегодня я иду в кино".',
    options: ['Heute gehe ich ins Kino.', 'Heute ich gehe ins Kino.', 'Ich gehe heute ins Kino.'],
    answer: 'Heute gehe ich ins Kino.'
  },
  {
    question: 'Как будет в Perfekt: "Мы много сделали"?',
    options: ['Wir haben viel gemacht.', 'Wir sind viel gemacht.', 'Wir haben viel machen.'],
    answer: 'Wir haben viel gemacht.'
  },
  {
    question: 'Perfekt с глаголом движения: "Он поехал домой".',
    options: ['Er ist nach Hause gefahren.', 'Er hat nach Hause gefahren.', 'Er ist gefahren nach Hause.'],
    answer: 'Er ist nach Hause gefahren.'
  },
  {
    question: 'Präteritum от глагола "sein": "Я был уставший".',
    options: ['Ich war müde.', 'Ich bin müde gewesen.', 'Ich hatte müde.'],
    answer: 'Ich war müde.'
  },
  {
    question: 'Futur I: "Завтра она будет работать".',
    options: ['Sie wird morgen arbeiten.', 'Sie werde morgen arbeiten.', 'Sie wird arbeiten morgen.'],
    answer: 'Sie wird morgen arbeiten.'
  },
  {
    question: 'Выберите правильный Partizip II от глагола "sehen" (видеть).',
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