<template>
  <!-- первая встреча после регистрации: то же оформление, что у вступления земли (V-landIntro) -->
  <Teleport to="body">
    <transition name="welcome-fade" appear>
      <div class="welcome">
        <div class="welcome__card" :class="{ 'welcome__card--rtl': locale === 'ar' }" role="dialog" aria-modal="true">
          <!-- ёжик машет из-за ленты: лента закрывает его нижнюю часть -->
          <div class="welcome__stage">
            <div class="welcome__hedgehog" aria-hidden="true">
              <span class="welcome__glow"></span>
              <span v-for="l in letters" :key="'l' + l.id" class="welcome__letter" :style="l.style">{{ l.char }}</span>
              <span v-for="b in bubbles" :key="'b' + b.id" class="welcome__bubble"
                    :class="'welcome__bubble--' + b.side" :style="b.style">{{ b.text }}</span>
              <ClientOnly>
                <DotLottieVue class="welcome__lottie" :data="greetingsData" :autoplay="true" :loop="true"/>
              </ClientOnly>
            </div>
            <h2 class="welcome__banner">{{ t('levelPicker.welcomeTitle') }}</h2>
          </div>
          <p class="welcome__lead">{{ t('levelPicker.introTitle') }}</p>
          <p class="welcome__text">{{ t('levelPicker.introText', { count }) }}</p>
          <button type="button" class="welcome__btn" data-track="level_intro_test" @click="$emit('test')">
            {{ t('levelPicker.startTest') }}
          </button>
          <button type="button" class="welcome__second" data-track="level_intro_choose" @click="$emit('choose')">
            {{ t('levelPicker.chooseSelf') }}
          </button>
          <button type="button" class="welcome__skip" @click="$emit('skip')">{{ t('levelPicker.skip') }}</button>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import Greetings from '~/assets/animation/Greetings.json'

defineProps({
  count: { type: Number, default: 12 }
})
defineEmits(['test', 'choose', 'skip'])

const { t, locale } = useI18n()
const greetingsData = JSON.stringify(Greetings)

const BUBBLE_CYCLE = 12
const bubbleWords = ['Hallo!', 'Willkommen!', 'Los geht’s!', 'Super!', 'Prima!', 'Viel Spaß!']
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
</script>

<style scoped>
.welcome {
  position: fixed;
  inset: 0;
  z-index: 19000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
}

.welcome__card {
  position: relative;
  width: 100%;
  max-height: calc(100dvh - 16px);
  overflow-y: auto;
  padding: 28px max(20px, calc((100% - 480px) / 2)) calc(20px + env(safe-area-inset-bottom));
  border-top: 3px solid #ffb100;
  border-radius: 28px 28px 0 0;
  background: radial-gradient(120% 60% at 50% 0%, rgba(255, 193, 7, 0.12), transparent 70%), var(--bg);
  color: var(--titleColor);
  animation: welcome-pop 0.3s ease-out;
}

.welcome__stage {
  position: relative;
  margin: 0 -20px 16px;
}

.welcome__hedgehog {
  position: relative;
  display: flex;
  justify-content: center;
  height: 190px;
  overflow: hidden;
}

.welcome__glow {
  position: absolute;
  left: 50%;
  top: 30px;
  width: 240px;
  height: 240px;
  margin-left: -120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 200, 60, 0.45) 0%, rgba(255, 160, 40, 0.15) 45%, transparent 70%);
  animation: welcome-breathe 3.2s ease-in-out infinite;
}

.welcome__letter {
  position: absolute;
  bottom: -24px;
  z-index: 0;
  font-size: 1.35rem;
  font-weight: 900;
  opacity: 0;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  animation: welcome-letter linear infinite both;
}

.welcome__bubble {
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
  animation: welcome-bubble ease-out infinite both;
}

.welcome__bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  width: 12px;
  height: 12px;
  background: #fff;
  transform: rotate(45deg);
  border-radius: 2px;
}

.welcome__bubble--left {
  right: calc(50% + 62px);
  transform-origin: right bottom;
}

.welcome__bubble--left::after {
  right: 14px;
}

.welcome__bubble--right {
  left: calc(50% + 62px);
  transform-origin: left bottom;
}

.welcome__bubble--right::after {
  left: 14px;
}

.welcome__lottie {
  position: relative;
  width: 360px;
  height: 360px;
  margin-top: -70px;
  flex-shrink: 0;
}

.welcome__banner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin: -46px 20px 0;
  padding: 6px 12px;
  color: #4a2a00;
  font-size: 1.15rem;
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
  animation: welcome-shine 3.5s ease-in-out 0.6s infinite;
}

.welcome__banner::before,
.welcome__banner::after {
  content: '';
  position: absolute;
  top: 10px;
  width: 22px;
  height: 34px;
  background: #e8961a;
  border: 3px solid #d98a00;
  z-index: -1;
}

.welcome__banner::before {
  left: -18px;
  border-radius: 6px 0 0 6px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 45% 50%);
}

.welcome__banner::after {
  right: -18px;
  border-radius: 0 6px 6px 0;
  clip-path: polygon(0 0, 100% 0, 55% 50%, 100% 100%, 0 100%);
}

.welcome__lead {
  color: #c97a00;
  font-size: 20px;
  font-weight: 800;
  text-align: center;
}

html.dark .welcome__lead,
html.orange .welcome__lead {
  color: #ffc23d;
  text-shadow: 0 0 14px rgba(255, 177, 0, 0.35);
}

.welcome__text {
  margin-top: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  text-align: center;
  opacity: 0.85;
}

.welcome__btn {
  width: 100%;
  margin-top: 20px;
  padding: 16px;
  border: none;
  border-radius: 50px;
  background: linear-gradient(110deg, transparent 35%, rgba(255, 255, 255, 0.35) 50%, transparent 65%) no-repeat,
  linear-gradient(180deg, #5b8cff 0%, #3d68f5 100%);
  background-size: 250% 100%, 100% 100%;
  box-shadow: 0 6px 0 #2a4fc4, 0 10px 22px rgba(61, 104, 245, 0.4);
  color: #fff;
  font-family: "Nunito", sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.3px;
  cursor: pointer;
  animation: welcome-shine 3.5s ease-in-out 1.4s infinite;
}

.welcome__btn:active {
  transform: translateY(3px);
  box-shadow: 0 2px 0 #2a4fc4, 0 4px 10px rgba(61, 104, 245, 0.3);
}

.welcome__second {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 50px;
  background: var(--settingsSectionBg);
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
}

.welcome__skip {
  display: block;
  margin: 10px auto 0;
  padding: 4px 8px;
  border: none;
  background: none;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-decoration: underline;
  opacity: 0.65;
  cursor: pointer;
}

.welcome-fade-enter-active,
.welcome-fade-leave-active {
  transition: opacity 0.25s ease;
}

.welcome-fade-enter-from,
.welcome-fade-leave-to {
  opacity: 0;
}

@keyframes welcome-pop {
  from {
    transform: translateY(100%);
  }
  to {
    transform: none;
  }
}

@keyframes welcome-bubble {
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

@keyframes welcome-letter {
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

@keyframes welcome-breathe {
  0%, 100% {
    transform: scale(0.92);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}

@keyframes welcome-shine {
  0% {
    background-position: 150% 0, 0 0;
  }
  45%, 100% {
    background-position: -50% 0, 0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .welcome__card,
  .welcome__glow,
  .welcome__banner,
  .welcome__btn {
    animation: none;
  }

  .welcome__bubble,
  .welcome__letter {
    display: none;
  }
}
</style>
