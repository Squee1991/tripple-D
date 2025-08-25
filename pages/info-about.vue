<template>
  <div class="about">
    <NuxtLink class="link__back" to="/">
      <img class="link__back-icon" src="../assets/images/close.svg" alt="">
    </NuxtLink>
    <div class="about__wrapper">
      <section class="about__hero">
        <div class="about__hero-text">
          <h1 class="about__title">{{ heroContentRef.title }}</h1>
          <p class="about__subtitle">{{ heroContentRef.subtitle }}</p>
          <ul class="about__mission-list">
            <li
                class="about__mission-item"
                v-for="missionPoint in missionPointsRef"
                :key="missionPoint.id"
            >
              <span class="about__mission-bullet" aria-hidden="true"></span>
              <span class="about__mission-text">{{ missionPoint.text }}</span>
            </li>
          </ul>
        </div>
        <div class="about__hero-image">
          <img
              class="about__image about__image--hero"
              :src="heroContentRef.imageUrl"
              :alt="heroContentRef.imageAlt"
              loading="eager"
          />
        </div>
      </section>
      <section class="about__section">
        <h2 class="about__section-title">Что внутри платформы</h2>
        <div class="about__grid">
          <article
              class="about__card"
              v-for="featureItem in featureItemsRef"
              :key="featureItem.id"
          >
            <div class="about__card-image-wrapper">
              <img
                  class="about__image about__image--card"
                  :src="featureItem.imageUrl"
                  :alt="featureItem.imageAlt"
                  loading="lazy"
              />
            </div>
            <h3 class="about__card-title">{{ featureItem.title }}</h3>
            <p class="about__card-text">{{ featureItem.description }}</p>
          </article>
        </div>
      </section>
      <section class="about__section">
        <h2 class="about__section-title">Теория и практика</h2>
        <div class="about__double">
          <div class="about__double-item" v-for="theoryItem in theoryPracticeRef" :key="theoryItem.id">
            <div class="about__double-image">
              <img
                  class="about__image about__image--wide"
                  :src="theoryItem.imageUrl"
                  :alt="theoryItem.imageAlt"
                  loading="lazy"
              />
            </div>
            <h3 class="about__double-title">{{ theoryItem.title }}</h3>
            <p class="about__double-text">{{ theoryItem.description }}</p>
            <ul class="about__list" v-if="theoryItem.points && theoryItem.points.length">
              <li class="about__list-item" v-for="point in theoryItem.points" :key="point.id">
                <span class="about__list-dot" aria-hidden="true"></span>
                <span class="about__list-text">{{ point.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section class="about__section">
        <h2 class="about__section-title">Практика артиклей: 5 режимов</h2>
        <ul class="about__modes">
          <li class="about__mode-item" v-for="modeItem in articleModesRef" :key="modeItem.id">
            <span class="about__mode-badge">{{ modeItem.orderNumber }}</span>
            <div class="about__mode-info">
              <h3 class="about__mode-title">{{ modeItem.title }}</h3>
              <p class="about__mode-text">{{ modeItem.description }}</p>
            </div>
          </li>
        </ul>
      </section>
      <section class="about__section">
        <h2 class="about__section-title">Наша миссия</h2>
        <div class="about__mission">
          <div class="about__mission-image">
            <img
                class="about__image about__image--rounded"
                :src="Target"
                alt="Миссия платформы — сделать изучение немецкого доступным и увлекательным"
                loading="lazy"
            />
          </div>
          <div class="about__mission-content">
            <p class="about__mission-lead">
              Делаем обучение доступным и интерактивным для людей из любой страны мира — с элементами игры, квестами и марафонами.
            </p>
            <ul class="about__values">
              <li class="about__value-item" v-for="valueItem in valueItemsRef" :key="valueItem.id">
                <span class="about__value-icon" aria-hidden="true"></span>
                <span class="about__value-text">{{ valueItem.text }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section class="about__cta">
        <div class="about__cta-content">
          <h2 class="about__cta-title">{{ callToActionRef.title }}</h2>
          <p class="about__cta-text">{{ callToActionRef.text }}</p>
        </div>
        <div class="about__cta-image">
          <img
              class="about__image about__image--cta"
              :src="callToActionRef.imageUrl"
              :alt="callToActionRef.imageAlt"
              loading="lazy"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Puzzle from '../assets/images/about-icons/puzzle.svg'
import Podium from '../assets/images/about-icons/podium.svg'
import Awards from '../assets/images/about-icons/Awards.svg'
import Duel from '../assets/images/about-icons/Duel.svg'
import Test from '../assets/images/about-icons/Test.png'
import Map from '../assets/images/about-icons/Map.svg'
import Marathon from '../assets/images/about-icons/Marathon.png'
import Thematic from '../assets/images/about-icons/Thematic.svg'
import Target from 'assets/images/about-icons/Target.svg'
import Article from '../assets/images/about-icons/Article.png'
const heroContentRef = ref({
  title: 'О нас',
  subtitle:
      'Мы — платформа для практики немецкого языка с элементами игры: рейтинги, достижения, дуэли, квесты и многое другое.',
  imageUrl: Puzzle,
  imageAlt: 'Герой секции: обучение немецкому в игровом стиле'
})

const missionPointsRef = ref([
  { id: 'mission-global', text: 'Доступно для каждой страны и каждого устройства' },
  { id: 'mission-interactive', text: 'Интерактивные задания и дуэли в дисциплине составления предложений' },
  { id: 'mission-fun', text: 'Обучение через игру: квесты, награды и марафоны' }
])

const featureItemsRef = ref([
  {
    id: 'feature-rating',
    title: 'Таблица рейтинга',
    description: 'Соревнуйся и поднимайся в глобальном топе.',
    imageUrl: Podium,
    imageAlt: 'Иконка таблицы рейтинга'
  },
  {
    id: 'feature-achievements',
    title: 'Достижения и награды',
    description: 'Открывай редкие ачивки и получай награды за прогресс.',
    imageUrl: Awards,
    imageAlt: 'Иконка достижений и наград'
  },
  {
    id: 'feature-duel',
    title: 'Дуэль: составь предложение',
    description: 'Онлайн-поединки на скорость и точность в синтаксисе.',
    imageUrl: Duel,
    imageAlt: 'Иконка дуэелей по составлению предложений'
  },
  {
    id: 'feature-articles',
    title: 'Практика артиклей',
    description: 'Отрабатывай der/die/das в 5 уникальных режимах.',
    imageUrl: Article,
    imageAlt: 'Тренажёр артиклей'
  },
  {
    id: 'feature-ai-tests',
    title: 'Тесты с проверкой от ИИ',
    description: 'Пиши, говори и получай мгновенную обратную связь.',
    imageUrl: Test,
    imageAlt: 'Проверка работ ИИ'
  },
  {
    id: 'feature-map',
    title: 'Карта изучения',
    description: 'Прокачивайся по дорожной карте тем и уровней.',
    imageUrl: Map,
    imageAlt: 'Карта навыков и тем'
  },
  {
    id: 'feature-themes',
    title: 'Тематические темы',
    description: 'Учись по самым полезным темам повседневной речи.',
    imageUrl: Thematic,
    imageAlt: 'Список тематик'
  },
  {
    id: 'feature-quests',
    title: 'Квесты и марафоны',
    description: 'Проходи цепочки заданий и участвуй в марафонах артиклей.',
    imageUrl: Marathon,
    imageAlt: 'Квестовая цепочка'
  }
])

const theoryPracticeRef = ref([
  {
    id: 'theory-articles',
    title: 'Теория ',
    description:
        'Теория по различным темам. Прилагательные существительные и т.д',
    imageUrl: '/images/about/theory-articles.png',
    imageAlt: 'Теория по артиклям',
    points: [
      { id: 'articles-rules', text: 'Правила употребления ' },
      { id: 'articles-exceptions', text: 'Исключения и устойчивые формы' }
    ]
  },
  {
    id: 'theory-adj-verbs',
    title: 'Прилагательные и глаголы',
    description:
        'Склонение прилагательных, времена и формы глаголов — с наглядными таблицами и практикой.',
    imageUrl: '/images/about/theory-grammar.png',
    imageAlt: 'Теория по прилагательным и глаголам',
    points: [
      { id: 'adj-declension', text: 'Склонение прилагательных по падежам' },
      { id: 'verbs-practice', text: 'Практика спряжений и времён' }
    ]
  }
])

const articleModesRef = ref([
  { id: 'mode-1', orderNumber: '01', title: 'Вписать артикль', description: 'Введи корректный der/die/das.' },
  { id: 'mode-2', orderNumber: '02', title: 'Собери слово', description: 'Собери слово и выбери артикль.' },
  { id: 'mode-3', orderNumber: '03', title: 'Слово+Артикль', description: 'Соотнеси слово с правильным артиклем.' },
  { id: 'mode-4', orderNumber: '04', title: 'Множественное число', description: 'Выбери форму и артикль множественного.' },
  { id: 'mode-5', orderNumber: '05', title: 'Аудио-режим', description: 'Слушай и определяй артикль на слух.' }
])

const valueItemsRef = ref([
  { id: 'value-access', text: 'Доступность и понятность' },
  { id: 'value-engagement', text: 'Увлекательность через игру' },
  { id: 'value-feedback', text: 'Мгновенная обратная связь' },
  { id: 'value-progress', text: 'Прозрачный прогресс и цели' }
])

const callToActionRef = ref({
  title: 'Готов начать?',
  text: 'Присоединяйся и прокачай немецкий в своём темпе — от артиклей до уверенных предложений.',
})
</script>

<style scoped>
* {
  font-family: "Nunito", sans-serif;
}
.about {
  --about-bg: #0f0f15;
  --about-fg: #f5f7fb;
  --about-muted: #c7ccda;
  --about-accent: #8b6cff;
  --about-accent-2: #ffd166;
  --about-card: #171a24;
  --about-stroke: #25293a;
  color: var(--titleColor);;
  padding: 65px 0 80px;
}

.about__wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.link__back {
  font-weight: bold;
  position: absolute;
  top:10px;
  left: 20px;
  width: 40px;
}

.link__back-icon {
  width: 100%;
}

.about__hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 28px;
  align-items: center;
  margin-bottom: 56px;
}

.about__title {
  font-size: 40px;
  line-height: 1.1;
  letter-spacing: 0.2px;
  margin: 0 0 25px 0;
}

.about__subtitle {
  font-size: 18px;
  line-height: 1.5;
  color: var(--titleColor);
  margin: 0 0 20px 0;
}

.about__hero-image {
  display: flex;
  justify-content: center;
}

.about__image {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 16px;
}

.about__image--hero {
  max-width: 300px;
}

.about__mission-list {
  margin: 16px 0 0 0;
  display: grid;
  gap: 10px;
}

.about__mission-item {
  display: grid;
  grid-template-columns: 20px 1fr;
  align-items: start;
  gap: 8px;
}

.about__mission-bullet {
  width: 12px;
  height: 12px;
  margin-top: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--about-accent), var(--about-accent-2));
  box-shadow: 0 0 0 3px rgba(139,108,255,0.15);
}

.about__mission-text {
  font-size: 16px;
  color: var(--titleColor);
}

.about__section {
  margin: 56px 0;
}

.about__section-title {
  font-size: 40px;
  line-height: 1.2;
  margin: 0 0 18px 0;
}

.about__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.about__card {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.0));
  border: 2px solid var(--about-stroke);
  border-radius: 16px;
  padding: 16px;
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}

.about__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.35);
  border-color: rgba(139,108,255,0.45);
}

.about__card-image-wrapper {
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
  margin-bottom: 12px;
  background: #0c0e14;
  border: 1px solid var(--about-stroke);
}

.about__image--card {
  object-fit: cover;
}

.about__card-title {
  font-size: 18px;
  margin: 6px 0 6px 0;
}

.about__card-text {
  font-size: 14px;
  color: var(--titleColor);
  font-weight: 400;
  line-height: 1.55;
}

.about__double {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.about__double-item {
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.0));
  border: 1px solid var(--about-stroke);
  border-radius: 16px;
  padding: 18px;
}

.about__double-image {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--about-stroke);
  margin-bottom: 12px;
  background: #0c0e14;
}

.about__image--wide {
  aspect-ratio: 16 / 7;
  object-fit: cover;
}

.about__double-title {
  font-size: 20px;
  margin: 6px 0;
}

.about__double-text {
  font-size: 15px;
  color: var(--titleColor);
  margin: 0 0 8px 0;
}

.about__list {
  display: grid;
  gap: 8px;
}

.about__list-item {
  display: grid;
  grid-template-columns: 14px 1fr;
  gap: 8px;
  align-items: start;
}

.about__list-dot {
  width: 8px;
  height: 8px;
  margin-top: 7px;
  border-radius: 50%;
  background: var(--about-accent);
}

.about__list-text {
  font-size: 14px;
  color: var(--titleColor);
}

.about__modes {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.about__mode-item {
  border: 1px solid var(--about-stroke);
  border-radius: 14px;
  padding: 14px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.0));
}

.about__mode-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  padding: 0 8px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--about-accent), var(--about-accent-2));
  color: #0b0c10;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
}

.about__mode-title {
  font-size: 16px;
  margin: 2px 0 4px 0;
}
.about__mode-text {
  font-size: 14px;
  color: var(--titleColor);
}

.about__mission {
  display: flex;
  align-items: start;
  gap: 20px;
}

.about__mission-image {
  border: 1px solid var(--about-stroke);
  border-radius: 18px;
  padding: 8px;
  background: #0c0e14;
}

.about__image--rounded {
  border-radius: 12px;
}

.about__mission-lead {
  font-size: 24px;
  color: var(--titleColor);
  font-weight: 600;
}

.about__values {
  list-style: none;
  margin-top: 15px;
  display: grid;
  gap: 8px;
}

.about__value-item {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 8px;
  align-items: start;
}

.about__value-icon {
  width: 12px;
  height: 12px;
  margin-top: 6px;
  border-radius: 4px;
  background: linear-gradient(135deg, var(--about-accent-2), var(--about-accent));
}

.about__value-text {
  font-size: 16px;
  font-weight: 500;
}

.about__cta {
  border-top: 2px black solid;
  margin-top: 56px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 18px;
  align-items: center;
}

.about__cta-title {
  font-size: 24px;
  margin: 0 0 8px 0;
}

.about__cta-text {
  font-size: 16px;
  color: var(--titleColor);
  margin: 0;
}

.about__cta-image {
  width: 400px;
  border: 1px solid var(--about-stroke);
  border-radius: 14px;
  overflow: hidden;
  background: #0c0e14;
}

@media (max-width: 1023px) {
  .about__grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .about__modes {
    grid-template-columns: repeat(3, 1fr);
  }
  .about__hero {
    grid-template-columns: 1fr;
  }
  .about__mission {
    grid-template-columns: 1fr;
  }
  .about__cta {
    grid-template-columns: 1fr;
  }
  .about__title {
    text-align: center;
  }
  .about__section-title {
    font-size: 30px;
    text-align: center;
  }
}

@media (max-width: 767px) {
  .about {
    padding: 32px 0 56px;
  }
  .about__mission-image{
    display: none;
  }
  .about__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .about__double {
    grid-template-columns: 1fr;
  }
  .about__modes {
    grid-template-columns: 1fr 1fr;
  }
  .about__title {
    font-size: 32px;
  }
}
</style>
