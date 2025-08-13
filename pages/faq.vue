<template>
  <section class="faq">
    <div class="faq__top-btn">
      <button class="faq__btn-home" @click="goHome">На главную</button>
    </div>
    <div
        v-for="(section, sectionIndex) in faqSections"
        :key="sectionIndex"
        class="faq__section"
    >
      <div class="faq__section-header">
        <span class="faq__section-title">{{ section.title }}</span>
      </div>
      <div class="faq__section-body">
        <div
            v-for="(item, questionIndex) in section.items"
            :key="questionIndex"
            class="faq__item"
            :class="{ 'faq__item--open': isQuestionOpen(sectionIndex, questionIndex) }"
        >
          <button
              class="faq__item-toggle"
              @click="toggleQuestion(sectionIndex, questionIndex)"
              :aria-expanded="isQuestionOpen(sectionIndex, questionIndex)"
              :aria-controls="`faq-item-${sectionIndex}-${questionIndex}`"
          >
            <span class="faq__item-question">{{ item.question }}</span>
            <img
                class="faq__item-arrow"
                src="../assets/images/arrowNav.svg"
                alt="Раскрыть ответ"
            />
          </button>
          <div
              class="faq__item-body"
              :id="`faq-item-${sectionIndex}-${questionIndex}`"
          >
            <template v-if="item.steps && item.steps.length">
              <ol class="faq__steps">
                <li
                    v-for="(step, stepIndex) in item.steps"
                    :key="stepIndex"
                    class="faq__step"
                >
                  {{ step }}
                </li>
              </ol>
              <p v-if="item.note" class="faq__note">{{ item.note }}</p>
            </template>
            <template v-else>
              <p class="faq__answer">{{ item.answer }}</p>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="faq__bottom-btn">
      <p class="faq__contact-text">Есть ещё вопросы? Напишите нам!</p>
      <button class="faq__btn-contact" @click="openContactForm">
        Отправить сообщение
      </button>
    </div>
  </section>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}

function openContactForm() {
  router.push('/support-request')
}

const faqSections = ref([
  {
    title: 'Как пользоваться',
    items: [
      {
        question: 'Что такое достижение?',
        answer: 'Достижение — это отметка за выполненную активность (прогресс, правильные ответы, ежедневные задания и т.п.).'
      },
      {
        question: 'Что такое награды?',
        answer: 'Награды выдаются за выполнение определённых достижений и отображаются в вашем кабинете.'
      },
      {
        question: 'Что такое Артиклюс?',
        answer: 'Артиклюс — это внутренняя валюта. Начисляется за правильные ответы в задании «Практика артиклей». Её можно тратить на повторные попытки или покупки на сайте.'
      },
      {
        question: 'Как попасть в рейтинг?',
        answer: 'Нужно получить минимум 2 уровень, играя в режим «Практика артиклей».'
      },
      {
        question: 'Что такое ежедневные задания?',
        answer: 'Это задания по темам, которые можно выполнять один раз в день. Регулярное выполнение даёт прогресс и дополнительные награды.'
      }
    ]
  },
  {
    title: 'Управление аккаунтом',
    items: [
      {
        question: 'Как поменять имя или почту?',
        answer: 'Перейдите в Кабинет → Настройки, где можно изменить имя и адрес электронной почты.'
      },
      {
        question: 'Как удалить аккаунт?',
        answer: 'В Кабинет → Во вкладке "Параметры аккаунта" выберите «Удалить аккаунт». После удаления все ваши данные будут безвозвратно удалены и их невозможно будет восстановить.'
      },
      {
        question: 'Как восстановить пароль?',
        answer: 'На форме входа выберите «Забыли пароль?» и следуйте инструкциям. Письмо с ссылкой на восстановление будет отправлено на указанный при регистрации почтовый ящик. Важно: используйте реальный и верный адрес электронной почты при регистрации, иначе восстановить пароль будет невозможно.'
      }
    ]
  },
  {
    title: 'Подписка (Премиум)',
    items: [
      {
        question: 'Что даёт подписка Премиум?',
        steps: [
          '1 Озвучка всех слов и предложений — тренируйте восприятие на слух.',
          '2 Обучение без ограничений — проходите любое количество материала в день.',
          '3 Доступ ко всем тестам с авто-проверкой и оценкой от ИИ.',
          '4 Аудио-задания и задания на говорение для тренировки устной речи.',
          '5 Эксклюзивные материалы и упражнения, недоступные в бесплатной версии.',
          'Наша цель — сделать изучение немецкого доступным и увлекательным. Мы создаём атмосферу интерактива, игр и соревнований, чтобы учёба была приключением, в которое хочется возвращаться каждый день!'
        ]
      },
      {
        question: 'Как отключить Премиум?',
        steps: [
          'Войдите в свой аккаунт.',
          'Перейдите в раздел «Кабинет».',
          'Откройте подраздел «Управление аккаунтом».',
          'Нажмите «Отменить подписку».'
        ],
        note: 'После этого доступ сохранится до конца оплаченного периода.'
      },
      {
        question: 'Есть ли возврат за оставшиеся дни?',
        answer: 'Сейчас возврат за оставшиеся дни не предусмотрен.'
      }
    ]
  }
])
const openQuestionBySection = ref(new Map())

function toggleQuestion(sectionIndex, questionIndex) {
  const current = openQuestionBySection.value.get(sectionIndex)
  if (current === questionIndex) {
    openQuestionBySection.value.delete(sectionIndex)
  } else {
    openQuestionBySection.value.set(sectionIndex, questionIndex)
  }
}

function isQuestionOpen(sectionIndex, questionIndex) {
  return openQuestionBySection.value.get(sectionIndex) === questionIndex
}
</script>

<style scoped>

* {
  font-family: "Nunito", sans-serif;
}

.faq {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 24px;
  padding: 22px;
}

.faq__top-btn {
  text-align: center;
  margin-bottom: 16px;
}

.faq__btn-home {
  background: #007bff;
  color: #fff;
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  min-width: 250px;
  font-size: 1.3rem;
}

.faq__btn-home:hover {
  background: #0f72dc;
}

.faq__bottom-btn {
  margin-top: 24px;
  text-align: center;
}

.faq__contact-text {
  margin-bottom: 25px;
  font-weight: 700;
  color: var(--titleColor);
  font-size: 1.4rem;
}

.faq__btn-contact {
  background: #007bff;
  color: #fff;
  padding: 12px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  min-width: 260px;
  font-size: 1.4rem;
}

.faq__btn-contact:hover {
  background: #0056b3;
}

.faq__section-header {
  display: flex;
  justify-content: center;
  color: var(--titleColor);
}

.faq__section-title {
  font-weight: 900;
  font-size: 2rem;
}

.faq__section-body {
  padding: 10px 10px 14px;
}

.faq__item {
  background: #fff;
  border: 3px solid #000;
  border-radius: 16px;
  box-shadow: 3px 3px 0 #000;
  margin: 10px 0;
  overflow: hidden;
}

.faq__item-toggle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f3f4f6;
  border: 0;
  cursor: pointer;
  font-weight: 800;
}

.faq__item-question {
  font-weight: 900;
  font-size: 1.4rem;
}

.faq__item-arrow {
  width: 20px;
  transition: transform .2s ease;
}

.faq__item--open .faq__item-arrow {
  transform: rotate(180deg);
}

.faq__item-body {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height .2s ease, opacity .2s ease, padding .2s ease;
  padding: 0 15px;
}

.faq__item--open .faq__item-body {
  max-height: 1000px;
  opacity: 1;
  padding: 10px 15px;
}

.faq__steps {
  padding-left: 20px;
  margin: 0 0 8px 0;
}

.faq__step {
  margin: 4px 0;
  font-size: 20px;
}

.faq__note {
  margin-top: 8px;
  font-weight: 700;
  padding-left: 20px;
}

.faq__answer {
  margin: 0;
  font-size: 20px;
  font-weight: 400;
}

@media (max-width: 767px) {
  .faq__item-question {
    font-size: 1rem;
  }
  .faq__answer {
    font-size: 1rem ;
  }
  .faq__step {
    font-size: 1rem;
  }
}
</style>
