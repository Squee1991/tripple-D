<template>
  <section class="features">
    <div class="features__inner">
      <div class="f__title">
        <h1 class="features__title">{{ t('features.title') }}</h1>
      </div>
      <div
          class="features__slider"
          ref="sliderRef"
          @mousedown="startDrag"
          @mouseleave="stopDrag"
          @mouseup="stopDrag"
          @mousemove="onDrag"
      >
        <div class="features__card" v-for="(item, index) in items" :key="index">
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
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import Book from '../../assets/images/DescBook.svg'
import Brain from '../../assets/images/brain.svg'
import Controller from '../../assets/images/video-game.svg'
import AchCup from '../../assets/images/AchIcon.svg'
import Dictionary from '../../assets/images/SeasonEvent.svg'
import Exam from '../../assets/images/exam.svg'
import Ranked from '../../assets/images/ranked.svg'
import Cards from '../../assets/images/greeting-card.svg'

const {t} = useI18n()

const items = computed(() => [
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
      }
    ]
)
const sliderRef = ref(null)
let isDown = false
let startX
let scrollLeft

const startDrag = (e) => {
  isDown = true
  sliderRef.value.classList.add('is-dragging')
  startX = e.pageX - sliderRef.value.offsetLeft
  scrollLeft = sliderRef.value.scrollLeft
}

const stopDrag = () => {
  isDown = false
  sliderRef.value.classList.remove('is-dragging')
}

const onDrag = (e) => {
  if (!isDown) return
  e.preventDefault()
  const x = e.pageX - sliderRef.value.offsetLeft
  const walk = (x - startX) * 1.5
  sliderRef.value.scrollLeft = scrollLeft - walk
}
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

.f__title {
  display: flex;
  justify-content: center;
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
  transform: rotate(2deg);
  border: none;
  box-shadow: 6px 6px 0 #c2541a;
  border-radius: 10px;
}

.features__slider {
  display: flex;
  gap: 2rem;
  padding: 10px 10px 20px 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  cursor: grab;
}

.features__slider::-webkit-scrollbar {
  display: none;
}

.features__slider.is-dragging {
  scroll-snap-type: none;
  cursor: grabbing;
}

.features__slider.is-dragging .features__card {
  cursor: grabbing;
}

.features__card {
  flex: 0 0 calc(33.333% - 1.33rem);
  scroll-snap-align: start;
  border-radius: 24px;
  border: none;
  box-shadow: 5px 5px 0px #1e1e1e;
  padding: 16px 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  user-select: none;
}

.features__card:hover {
  transform: translate(4px, 4px);
  box-shadow: 4px 4px 0px #1e1e1e;
}

/* Цвета карточек */
.features__card:nth-child(1) {
  background-color: #60a5fa;
  box-shadow: 5px 6px 0 #3079d2;
}

.features__card:nth-child(2) {
  background-color: #fca13a;
  box-shadow: 5px 6px 0 #c47b29;
}

.features__card:nth-child(3) {
  background-color: #4ade80;
  box-shadow: 5px 6px 0 #33b763;
}

.features__card:nth-child(4) {
  background-color: #f97028;
  box-shadow: 5px 6px 0 #d25512;
}

.features__card:nth-child(5) {
  background-color: #88bb65;
  box-shadow: 5px 6px 0 #6db43c;
}

.features__card:nth-child(6) {
  background-color: #a855f7;
  box-shadow: 5px 6px 0 #8237c9;
}

.features__card:nth-child(7) {
  background-color: #f1c40f;
  box-shadow: 5px 6px 0 #c49f0d;
}

.features__card:nth-child(8) {
  background-color: #d57f7f;
  box-shadow: 5px 6px 0 #b65f5f;
}

.features__icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 86px;
  height: 86px;
  border-radius: 20px;
  margin-bottom: 5px;
  pointer-events: none;
}

.features__icon {
  width: 100%;
}

.features__card-title {
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #ffffff;
}

.features__list-item::before {
  content: "";
  position: absolute;
  left: .7rem;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fff;
}

.features__list-item {
  position: relative;
  padding: 4px 4px 4px 1.5rem;
  font-size: 13px;
  text-align: start;
  font-weight: 600;
  color: #fff;
  letter-spacing: .1px;
}

@media (max-width: 1024px) {
  .features__card {
    flex: 0 0 calc(50% - 1rem);
  }
}

@media (max-width: 768px) {
  .features {
    padding: 4rem 1rem;
  }

  .features__title {
    font-size: 2.2rem;
    margin-bottom: 3rem;
  }

  .features__slider {
    gap: 26px;
  }

  .features__card {
    flex: 0 0 60%;
  }
}
</style>