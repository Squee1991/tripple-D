<template>
  <section class="features">
    <div class="features__inner">
      <div ref="titleRef" class="f__title">
        <h2 class="features__title">{{ t('features.title') }}</h2>
      </div>
      <div class="features__grid">
        <div class="features__card" v-for="(item, index) in items" :key="index"
             :ref="el => { if (el) cardsRef[index] = el }">
          <h3 class="features__card-title">{{ t(item.title) }}</h3>
          <div class="features__icon-wrapper">
            <img :src="item.src" :alt="item.alt" class="features__icon"/>
          </div>
          <div class="features__card-wrapper">
            <p v-for="item in item.description" class="features__card-desc">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import MagikBook from '../../assets/images/magicBook.svg'
import Brain from '../../assets/images/brain.svg'
import Controller from '../../assets/images/controller.svg'
import Cup from '../../assets/images/cubok.svg'
import Dictionary from '../../assets/images/dictionary.svg'
import Exam from '../../assets/images/exam.svg'
import Ranked from '../../assets/images/ranked.svg'

gsap.registerPlugin(ScrollTrigger);

const {t} = useI18n()
const titleRef = ref(null);
const cardsRef = ref([]);
const items = [
  {src: MagikBook, alt: 'Book', title: 'Темы обучения', description: [
      {text: 'Артикли и предлоги'},
      {text: 'Прилагательные и глаголы'},
      {text: 'Граматика по темам'},
      {text: 'Фразеологизмы и идиомы'},
      {text: 'Построение предложений'}
    ]
  },
  {src: Brain, alt: 'Brain', title: 'Практика артиклей', description: [
      {text: 'Актикль к слову'},
      {text: 'Слово + Артикль'},
      {text: 'Аудио слов'},
      {text: 'Множественное число'},
      {text: 'Слова по буквам'}

    ]
  },
  {src: Controller, alt: 'Controller', title: 'gameCard.title', description: [
      {text: 'Зарабатывай артиклюсы'},
      {text: 'Трать их в магазине'},
      {text: 'Учавствуй в дуэлях'},
      {text: 'Отгадывай слова на время'}
    ]
  },
  {src: Cup, alt: 'Cup', title: 'achievCard.title', description: [
      {text: 'Зарабатывай медали'},
      {text: 'Собирай трофеи'},
      {text: 'Отслеживай достижения'},
      {text: ''}
    ]
  },
  {src: Ranked, alt: 'Ranked', title: 'Система рейтига', description: [
      {text: 'Сравнивай прогресс'},
      {text: 'Более 3 дисциплин'},
      {text: 'Уровни сложности'},
      {text: 'Мотивация соперничества'},
    ]
  },
  {
    src: Exam, alt: 'Exam', title: 'Тесты', description: [
      {text: "Проверка задание с ИИ"},
      {text: "Написание текста"},
      {text: "Слушай и выбирай ответ"},
      {text: "Понимание через чтение"},
      {text: "Тренируй говорение"},
    ]
  },
  {src: Dictionary, alt: 'Dictionary', title: 'Переводчик', description: [
      {text: 'Переводи прямо на сайте'},
      {text: 'Нет ограничений'},
      {text: 'Качество перевода'},
      {text: ''}
    ]
  },
  {
    src: Cup, alt: 'Cup', title: 'Карточки', description: [
      {text: 'Предложения с артиклями'},
      {text: 'Разделение по темам'},
      {text: 'Уровень сложности'},
      {text: 'Примеры других пользователей'}
    ]
  },
]

onMounted(() => {

  gsap.from(titleRef.value, {
    scrollTrigger: {trigger: titleRef.value, start: "top 90%"},
    y: 50,
    opacity: 0,
    duration: 0.3,
    ease: "power3.out",
  });

  const cards = cardsRef.value;

  gsap.set(cards, {opacity: 0, y: 50});
  gsap.to(cards, {
    scrollTrigger: {
      trigger: ".features__grid",
      start: "top 85%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    duration: 0.3,
    stagger: 0.2,
    ease: "power3.out",
  });
});


</script>

<style scoped>
.features {
  padding: 6rem 1.5rem;
  font-family: "Nunito", sans-serif;
  overflow-x: hidden;
}

.features__inner {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.features__title {
  text-align: center;
  margin-bottom: 4rem;
  font-size: 3rem;
  font-family: "Nunito", sans-serif;
  font-weight: 400;
  color: white;
  letter-spacing: -0.02em;
  background: #e55b10;
  padding: 10px 20px;
  transform: rotate(3deg);
  border: 2px solid black;
  border-radius: 10px;
}

.f__title {
  display: flex;
  justify-content: center;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  justify-content: center;
  gap: 2rem;
  padding: 10px;
}

.features__card {
  border-radius: 24px;
  border: 3px solid #1e1e1e;
  box-shadow: 5px 5px 0px #1e1e1e;
  padding: 2rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.features__card:hover {
  transform: translate(4px, 4px);
  box-shadow: 4px 4px 0px #1e1e1e;
}

.features__card:nth-child(1) {
  background-color: #60a5fa;
}

.features__card:nth-child(2) {
  background-color: #fca13a;
}

.features__card:nth-child(3) {
  background-color: #4ade80;
}

.features__card:nth-child(4) {
  background-color: #f97028;
}

.features__card:nth-child(5) {
  background-color: #88bb65;
}

.features__card:nth-child(6) {
  background-color: #a855f7;
}

.features__card:nth-child(7) {
  background-color: #f1c40f;
}

.features__card:nth-child(8) {
  background-color: #fca5a5;
}

.features__icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 110px;
  border-radius: 20px;
  margin-bottom: 2rem;
  border: 3px solid #1e1e1e;
  background-color: #ffffff;
  padding: 8px;
}

.features__icon {
  width: 100%;
}

.features__card-title {
  font-family: "Nunito", sans-serif;
  font-style: italic;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #ffffff;
}

.features__card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.6;
  color: #ffffff;
  opacity: 0.9;
  text-align: start;
}

@media (max-width: 768px) {
  .features {
    padding: 4rem 1rem;
  }

  .features__title {
    font-size: 2.2rem;
    margin-bottom: 3rem;
  }

  .features__grid {
    gap: 2rem;
  }
}
</style>