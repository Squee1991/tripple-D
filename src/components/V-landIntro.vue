<template>
  <Teleport to="body">
    <transition name="land-intro-fade">
      <div v-if="modelValue" class="land-intro" @click.self="close">
        <div class="land-intro__card" :class="{ 'land-intro__card--rtl': locale === 'ar' }" role="dialog"
             aria-modal="true">
          <!-- ёжик машет из-за ленты: лента закрывает его нижнюю часть -->
          <div class="land-intro__stage">
            <div class="land-intro__hedgehog" aria-hidden="true">
              <span class="land-intro__glow"></span>
              <!-- немецкие буквы тихо всплывают вокруг ёжика -->
              <span v-for="l in letters" :key="'l' + l.id" class="land-intro__letter" :style="l.style">{{ l.char }}</span>
              <!-- реплики ёжика по-немецки — по одной, то слева, то справа -->
              <span v-for="b in bubbles" :key="'b' + b.id" class="land-intro__bubble"
                    :class="'land-intro__bubble--' + b.side" :style="b.style">{{ b.text }}</span>
              <ClientOnly>
                <DotLottieVue
                    class="land-intro__lottie"
                    :data="greetingsData"
                    :autoplay="true"
                    :loop="true"
                />
              </ClientOnly>
            </div>
            <h2 class="land-intro__banner">{{ t(region.name) }}</h2>
          </div>
          <p class="land-intro__lead">{{ t(isGrammarLand(region) ? 'landIntro.introGrammar' : 'landIntro.intro') }}</p>
          <ul class="land-intro__list">
            <li
                v-for="(key, index) in pointKeysFor(region)"
                :key="key"
                class="land-intro__item"
            >
              <span class="land-intro__dash" aria-hidden="true"></span>
              <span>{{ t(`landIntro.${region.id}.${key}`) }}</span>
            </li>
          </ul>
          <button type="button" class="land-intro__btn" @click="close">{{ t('landIntro.go') }}</button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import Greetings from '~/assets/animation/Greetings.json'
import { markLandIntroSeen } from '~/utils/landIntro.js'
import { regions } from '~/utils/regions.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  region: { type: Object, required: true }
})
const emit = defineEmits(['update:modelValue'])

const { t, te, locale } = useI18n()
const greetingsData = JSON.stringify(Greetings)

// у земли 3 пункта, у некоторых — четвёртый (повторение, контрольный квест, итоговая практика)
function pointKeysFor(region) {
  return ['p1', 'p2', 'p3', 'p4'].filter(key => te(`landIntro.${region.id}.${key}`))
}
// земли elementary и intermediate грамматические — у ёжика другое вступление.
// Смотрим на раздел regions, а не на level: level бывает временно обнулён для тестов
function isGrammarLand(region) {
  return !regions.beginner.some(r => r.id === region?.id)
}

const BUBBLE_CYCLE = 12
const bubbleWords = ['Hallo!', 'Los geht’s!', 'Super!', 'Danke!', 'Prima!', 'Tschüss!']
const bubbles = bubbleWords.map((text, id) => ({
  id,
  text,
  side: id % 2 ? 'right' : 'left',
  style: { animationDuration: BUBBLE_CYCLE + 's', animationDelay: 0.6 + id * (BUBBLE_CYCLE / bubbleWords.length) + 's' }
}))

const letters = [
  ['Ä', 10, 0, 7, '#ffce00'], ['ß', 86, 1.8, 8, '#ff5a5f'], ['Ö', 22, 3.5, 7.5, '#ff5a5f'],
  ['Ü', 76, 5, 7, '#ffce00'], ['ä', 92, 6.5, 8, 'var(--titleColor)'], ['ü', 4, 4.2, 8.5, 'var(--titleColor)']
].map(([char, left, delay, duration, color], id) => ({
  id,
  char,
  style: { left: left + '%', color, animationDelay: delay + 's', animationDuration: duration + 's' }
}))

function close() {
  markLandIntroSeen(props.region.id)
  emit('update:modelValue', false)
}
</script>

<style scoped>
.land-intro {
  position: fixed;
  inset: 0;
  z-index: 19000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
}


.land-intro__card {
  position: relative;
  width: 100%;
  max-height: calc(100dvh - 16px);
  overflow-y: auto;
  padding: 28px max(20px, calc((100% - 480px) / 2)) calc(20px + env(safe-area-inset-bottom));
  border-top: 3px solid #ffb100;
  border-radius: 28px 28px 0 0;
  background: radial-gradient(120% 60% at 50% 0%, rgba(255, 193, 7, 0.12), transparent 70%), var(--bg);
  color: var(--titleColor);
  animation: land-intro-pop 0.3s ease-out;
}

.land-intro__stage {
  position: relative;
  margin: 0 -20px 16px;
}

.land-intro__hedgehog {
  position: relative;
  display: flex;
  justify-content: center;
  height: 170px;
  overflow: hidden;
}

.land-intro__glow {
  position: absolute;
  left: 50%;
  top: 20px;
  width: 220px;
  height: 220px;
  margin-left: -110px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 200, 60, 0.45) 0%, rgba(255, 160, 40, 0.15) 45%, transparent 70%);
  animation: land-intro-breathe 3.2s ease-in-out infinite;
}

.land-intro__letter {
  position: absolute;
  bottom: -24px;
  z-index: 0;
  font-size: 1.35rem;
  font-weight: 900;
  opacity: 0;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  animation: land-intro-letter linear infinite both;
}

.land-intro__bubble {
  position: absolute;
  top: 34px;
  z-index: 3;
  padding: 6px 12px;
  border-radius: 14px;
  background: #fff;
  color: #2b2b2b;
  font-size: 0.85rem;
  font-weight: 800;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  opacity: 0;
  animation: land-intro-bubble ease-out infinite both;
}

.land-intro__bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  width: 12px;
  height: 12px;
  background: #fff;
  transform: rotate(45deg);
  border-radius: 2px;
}

.land-intro__bubble--left {
  right: calc(50% + 62px);
  transform-origin: right bottom;
}

.land-intro__bubble--left::after {
  right: 14px;
}

.land-intro__bubble--right {
  left: calc(50% + 62px);
  transform-origin: left bottom;
}

.land-intro__bubble--right::after {
  left: 14px;
}

.land-intro__lottie {
  position: relative;
  width: 330px;
  height: 330px;
  margin-top: -66px;
  flex-shrink: 0;
}

.land-intro__banner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin: -46px 20px 0;
  padding: 4px 12px;
  color: #4a2a00;
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.15;
  text-align: center;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  background: linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.6) 50%, transparent 65%) no-repeat,
  linear-gradient(180deg, #ffd860 0%, #f5a623 100%);
  background-size: 250% 100%, 100% 100%;
  border: 3px solid #d98a00;
  box-shadow: 0 4px 0 #b87400, 0 10px 22px rgba(0, 0, 0, 0.3), 0 0 24px rgba(255, 190, 40, 0.35);
  animation: land-intro-shine 3.5s ease-in-out 0.6s infinite;
}

.land-intro__banner::before,
.land-intro__banner::after {
  content: '';
  position: absolute;
  top: 10px;
  width: 22px;
  height: 34px;
  background: #e8961a;
  border: 3px solid #d98a00;
  z-index: -1;
}

.land-intro__banner::before {
  left: -18px;
  border-radius: 6px 0 0 6px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 45% 50%);
}

.land-intro__banner::after {
  right: -18px;
  border-radius: 0 6px 6px 0;
  clip-path: polygon(0 0, 100% 0, 55% 50%, 100% 100%, 0 100%);
}

.land-intro__lead {
  margin-bottom: 14px;
  color: #c97a00;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
}

html.dark .land-intro__lead,
html.orange .land-intro__lead {
  color: #ffc23d;
  text-shadow: 0 0 14px rgba(255, 177, 0, 0.35);
}

.land-intro__list {
  display: flex;
  flex-direction: column;
  gap: 9px;
  list-style: none;
}

.land-intro__item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 16px;
  background: rgba(127, 127, 127, 0.1);
  font-size: 0.93rem;
  font-weight: 600;
  line-height: 1.4;
}

.land-intro__dash {
  flex-shrink: 0;
  width: 14px;
  height: 3px;
  margin-top: 0.62em;
  border-radius: 2px;
  background: linear-gradient(90deg, #5b8cff, #3d68f5);
}

.land-intro__btn {
  margin-top: 20px;
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 50px;
  background: linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.35) 50%, transparent 65%) no-repeat,
  linear-gradient(180deg, #5b8cff 0%, #3d68f5 100%);
  background-size: 250% 100%, 100% 100%;
  box-shadow: 0 6px 0 #2a4fc4, 0 10px 22px rgba(61, 104, 245, 0.4);
  color: #fff;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.3px;
  cursor: pointer;
  animation: land-intro-shine 3.5s ease-in-out 1.4s infinite;
}

.land-intro__btn:active {
  transform: translateY(3px);
  box-shadow: 0 2px 0 #2a4fc4, 0 4px 10px rgba(61, 104, 245, 0.3);
}

.land-intro-fade-enter-active,
.land-intro-fade-leave-active {
  transition: opacity 0.25s ease;
}

.land-intro-fade-enter-from,
.land-intro-fade-leave-to {
  opacity: 0;
}

@keyframes land-intro-pop {
  from {
    transform: translateY(100%);
  }
  to {
    transform: none;
  }
}

@keyframes land-intro-bubble {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.6);
  }
  3% {
    opacity: 1;
    transform: translateY(0) scale(1.08);
  }
  5% {
    transform: translateY(0) scale(1);
  }
  13% {
    opacity: 1;
    transform: translateY(-6px) scale(1);
  }
  16%, 100% {
    opacity: 0;
    transform: translateY(-14px) scale(0.9);
  }
}

@keyframes land-intro-letter {
  0% {
    opacity: 0;
    transform: translateY(0) rotate(-10deg);
  }
  15% {
    opacity: 0.55;
  }
  80% {
    opacity: 0.35;
  }
  100% {
    opacity: 0;
    transform: translateY(-190px) rotate(12deg);
  }
}

@keyframes land-intro-breathe {
  0%, 100% {
    transform: scale(0.92);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}

@keyframes land-intro-shine {
  0% {
    background-position: 150% 0, 0 0;
  }
  45%, 100% {
    background-position: -50% 0, 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .land-intro__card,
  .land-intro__glow,
  .land-intro__banner,
  .land-intro__btn,
  .land-intro__letter {
    animation: none;
  }

  .land-intro__bubble,
  .land-intro__letter {
    display: none;
  }
}
</style>
