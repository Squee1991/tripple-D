<template>
  <section class="features">
    <div class="features__inner">
      <div ref="titleRef" class="f__title">
        <h1 class="features__title">{{ t('features.title') }}</h1>
      </div>
      <div class="features__grid">
        <div class="features__card" v-for="(item, index) in items" :key="index"
             :ref="el => { if (el) cardsRef[index] = el }">
          <h2 class="features__card-title">{{ t(item.title) }}</h2>
          <div class="features__icon-wrapper">
            <img :src="item.src" :alt="item.alt" class="features__icon"/>
          </div>
          <div class="features__card-wrapper">
            <ul class="features__list">
              <li v-for="(row, i) in item.description" :key="i" class="features__list-item">
                {{ row.text }}
              </li>
            </ul>
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
import Book from '../../assets/images/DescBook.svg'
import Brain from '../../assets/images/brain.svg'
import Controller from '../../assets/images/video-game.svg'
import AchCup from '../../assets/images/AchIcon.svg'
import Dictionary from '../../assets/images/SeasonEvent.svg'
import Exam from '../../assets/images/exam.svg'
import Ranked from '../../assets/images/ranked.svg'
import Cards from '../../assets/images/greeting-card.svg'

gsap.registerPlugin(ScrollTrigger);
const {t} = useI18n()
const titleRef = ref(null);
const cardsRef = ref([]);
const cards = cardsRef.value;
const items = [
  {
    src: Book, alt: 'Book', title: t('descriptionCardTheme.title'), description: [
      {text: t('descriptionCardTheme.textOne')},
      {text: t('descriptionCardTheme.textTwo')},
      {text: t('descriptionCardTheme.textThree')},
      {text: t('descriptionCardTheme.textFour')}
    ]
  },
  {
    src: Brain, alt: 'Brain', title: t('descriptionCardArticle.title'), description: [
      {text: t('descriptionCardArticle.textOne')},
      {text: t('descriptionCardArticle.textTwo')},
      {text: t('descriptionCardArticle.textThree')},
      {text: t('descriptionCardArticle.textFour')},
    ]
  },
  {
    src: Controller, alt: 'Controller', title: t('descriptionCardGame.title'), description: [
      {text: t('descriptionCardGame.textOne')},
      {text: t('descriptionCardGame.textTwo')},
      {text: t('descriptionCardGame.textThree')},
      {text: t('descriptionCardGame.textFour')}
    ]
  },
  {
    src: AchCup, alt: 'Achievement icon', title: t('descriptionCardRewards.title'), description: [
      {text: t('descriptionCardRewards.textOne')},
      {text: t('descriptionCardRewards.textTwo')},
      {text: t('descriptionCardRewards.textThree')},
      {text: t('descriptionCardRewards.textFour')}
    ]
  },
  {
    src: Ranked, alt: 'Ranked', title: t('descriptionCardRanked.title'), description: [
      {text: t('descriptionCardRanked.textOne')},
      {text: t('descriptionCardRanked.textTwo')},
      {text: t('descriptionCardRanked.textThree')},
      {text: t('descriptionCardRanked.textFour')},
    ]
  },
  {
    src: Exam, alt: 'Exam', title: t('descriptionCardExam.title'), description: [
      {text: t('descriptionCardExam.textOne')},
      {text: t('descriptionCardExam.textTwo')},
      {text: t('descriptionCardExam.textThree')},
      {text: t('descriptionCardExam.textFour')},
      {text: t('descriptionCardExam.textFive')},
    ]
  },
  {
    src: Dictionary, alt: 'Dictionary', title: t('descriptionCardEvents.title'), description: [
      {text: t('descriptionCardEvents.textOne')},
      {text: t('descriptionCardEvents.textTwo')},
      {text: t('descriptionCardEvents.textThree')},
      {text: t('descriptionCardEvents.textFour')}
    ]
  },
  {
    src: Cards, alt: 'Cup', title: t('descriptionCardCards.title'), description: [
      {text: t('descriptionCardCards.textOne')},
      {text: t('descriptionCardCards.textTwo')},
      {text: t('descriptionCardCards.textThree')},
      {text: t('descriptionCardCards.textFour')}
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
  border: 3px solid black;
  box-shadow: 3px 3px 0 black;
  border-radius: 10px;
}

.features__list-item::before {
  content: "";
  position: absolute;
  left: .7rem;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #1e1e1e;
  box-shadow: 1px 1px 0 black;
  background: #fff;
}

.features__list-item {
  position: relative;
  padding: .55rem .75rem .55rem 2rem;
  font-size: .98rem;
  text-align: start;
  font-weight: 600;
  color: #fff;
  letter-spacing: .1px;
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
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
  padding: 2rem 0.9rem;
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
  margin-bottom: 1rem;
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