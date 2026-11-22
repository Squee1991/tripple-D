<template>
  <section class="features">
    <div class="features__inner">
      <div class="f__title">
        <h2 class="features__title">{{ t('features.title') }}</h2>
      </div>

      <div class="features__carousel">
        <button
            class="features__arrow features__arrow--prev"
            type="button"
            :disabled="atStart"
            aria-label="Previous"
            @click="scrollByCard(-1)"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3.5"
               stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div
            class="features__slider"
            ref="sliderRef"
            @scroll.passive="onScroll"
            @mousedown="startDrag"
            @mouseleave="stopDrag"
            @mouseup="stopDrag"
            @mousemove="onDrag"
        >
          <article class="features__card" v-for="(item, index) in items" :key="index">
            <div class="features__icon-wrapper">
              <img :src="item.src" :alt="item.alt" class="features__icon" draggable="false"/>
            </div>
            <h3 class="features__card-title">{{ item.title }}</h3>
            <ul class="features__list">
              <li v-for="(row, i) in item.description" :key="i" class="features__list-item">
                {{ row }}
              </li>
            </ul>
          </article>
        </div>

        <button
            class="features__arrow features__arrow--next"
            type="button"
            :disabled="atEnd"
            aria-label="Next"
            @click="scrollByCard(1)"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3.5"
               stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div class="features__dots">
        <button
            v-for="(item, index) in items"
            :key="index"
            type="button"
            class="features__dot"
            :class="{ 'is-active': index === activeIndex }"
            :aria-label="item.title"
            @click="scrollToCard(index)"
        ></button>
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
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

const card = (src, alt, key, rows) => ({
  src,
  alt,
  title: t(`${key}.title`),
  description: rows.map(row => t(`${key}.${row}`))
})

const FOUR = ['textOne', 'textTwo', 'textThree', 'textFour']

const items = computed(() => [
  card(Book, 'Book', 'descriptionCardTheme', FOUR),
  card(Brain, 'Brain', 'descriptionCardArticle', FOUR),
  card(Controller, 'Controller', 'descriptionCardGame', FOUR),
  card(AchCup, 'Achievement icon', 'descriptionCardRewards', FOUR),
  card(Ranked, 'Ranked', 'descriptionCardRanked', FOUR),
  card(Exam, 'Exam', 'descriptionCardExam', [...FOUR, 'textFive']),
  card(Dictionary, 'Events', 'descriptionCardEvents', FOUR),
  card(Cards, 'Cards', 'descriptionCardCards', FOUR)
])

const sliderRef = ref(null)
const atStart = ref(true)
const atEnd = ref(false)
const activeIndex = ref(0)

// Шаг прокрутки: ширина карточки плюс отступ между карточками
const cardStep = () => {
  const el = sliderRef.value
  const first = el?.querySelector('.features__card')
  if (!first) return 0
  const gap = parseFloat(getComputedStyle(el).columnGap) || 0
  return first.offsetWidth + gap
}

const updateState = () => {
  const el = sliderRef.value
  if (!el) return
  const max = el.scrollWidth - el.clientWidth
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft >= max - 4
  const step = cardStep()
  if (!step) return
  activeIndex.value = atEnd.value
      ? items.value.length - 1
      : Math.min(items.value.length - 1, Math.round(el.scrollLeft / step))
}

let frame = 0
const onScroll = () => {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(updateState)
}

const scrollByCard = (direction) => {
  sliderRef.value?.scrollBy({left: direction * cardStep(), behavior: 'smooth'})
}

const scrollToCard = (index) => {
  sliderRef.value?.scrollTo({left: index * cardStep(), behavior: 'smooth'})
}

// Перетаскивание мышью на компьютере
let isDown = false
let moved = false
let startX = 0
let startScroll = 0

const startDrag = (e) => {
  isDown = true
  moved = false
  startX = e.pageX
  startScroll = sliderRef.value.scrollLeft
}

const stopDrag = () => {
  if (!isDown) return
  isDown = false
  sliderRef.value.classList.remove('is-dragging')
  // после перетаскивания доводим до ближайшей карточки
  if (moved) scrollToCard(Math.round(sliderRef.value.scrollLeft / (cardStep() || 1)))
}

const onDrag = (e) => {
  if (!isDown) return
  const walk = e.pageX - startX
  if (!moved && Math.abs(walk) < 5) return
  if (!moved) {
    moved = true
    sliderRef.value.classList.add('is-dragging')
  }
  e.preventDefault()
  sliderRef.value.scrollLeft = startScroll - walk
}

onMounted(() => {
  updateState()
  window.addEventListener('resize', updateState)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('resize', updateState)
})
</script>

<style scoped>
.features {
  padding: 4rem 1.5rem 5rem;
  font-family: "Nunito", sans-serif;
  overflow-x: hidden;
}

.features__inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.f__title {
  display: flex;
  justify-content: center;
}

.features__title {
  text-align: center;
  margin-bottom: 3.5rem;
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

.features__carousel {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Стрелки в стиле кнопок меню: белые, с рамкой и твёрдой тенью */
.features__arrow {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 14px;
  box-shadow: 3px 3px 0 #1e1e1e;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease, opacity 0.2s ease;
}

.features__arrow:active:not(:disabled) {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 #1e1e1e;
}

.features__arrow:disabled {
  opacity: 0.35;
  cursor: default;
}

.features__slider {
  flex: 1;
  min-width: 0;
  display: flex;
  gap: 24px;
  padding: 8px 8px 16px;
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

.features__card {
  flex: 0 0 calc((100% - 48px) / 3);
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px 26px;
  border-radius: 24px;
  text-align: center;
  user-select: none;
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
  width: 84px;
  height: 84px;
  margin-bottom: 12px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.22);
  pointer-events: none;
}

.features__icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.features__card-title {
  margin-bottom: 14px;
  font-family: "Nunito", sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  color: #fff;
}

.features__list {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  list-style: none;
}

.features__list-item {
  position: relative;
  padding-left: 1.3rem;
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.35;
  text-align: start;
  color: #fff;
}

.features__list-item::before {
  content: "";
  position: absolute;
  left: 0.3rem;
  top: 0.5em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
}

.features__dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.features__dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: var(--titleColor);
  opacity: 0.25;
  cursor: pointer;
  transition: width 0.2s ease, opacity 0.2s ease;
}

.features__dot.is-active {
  width: 26px;
  opacity: 0.9;
}

@media (max-width: 1024px) {
  .features__card {
    flex-basis: calc((100% - 24px) / 2);
  }
}

/* На телефоне листаем пальцем, стрелки не нужны */
@media (max-width: 768px) {
  .features {
    padding: 3rem 0 4rem;
  }

  .features__title {
    font-size: 2.2rem;
    margin: 0 1rem 2.5rem;
  }

  .features__arrow {
    display: none;
  }

  .features__slider {
    gap: 16px;
    padding: 8px 20px 16px;
    scroll-padding: 0 20px;
    cursor: auto;
  }

  .features__card {
    flex-basis: 78%;
  }
}
</style>
