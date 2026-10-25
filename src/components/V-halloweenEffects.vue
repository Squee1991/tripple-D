<script setup>
import { computed } from 'vue'

const props = defineProps({
  // back — луна и звёзды под контентом, front — мыши, паук, призрак и огоньки поверх
  layer: {
    type: String,
    default: 'front'
  },
  batsCount: {
    type: Number,
    default: 4
  },
  starsCount: {
    type: Number,
    default: 22
  },
  firefliesCount: {
    type: Number,
    default: 12
  }
})

function rand(min, max) {
  return Math.random() * (max - min) + min
}

const bats = computed(() =>
    Array.from({ length: props.batsCount }).map((_, i) => {
      const duration = rand(16, 26)
      return {
        id: i + 1,
        // первые две мыши пролетают на фоне луны
        top: (i < 2 ? rand(11, 20) : rand(6, 45)).toFixed(2),
        size: Math.round(rand(26, 46)),
        duration: duration.toFixed(2),
        delay: (-rand(0, duration)).toFixed(2),
        flap: rand(0.22, 0.34).toFixed(2),
        bob: Math.round(rand(14, 34)),
        reverse: i % 2 === 1
      }
    })
)

const stars = computed(() =>
    Array.from({ length: props.starsCount }).map((_, i) => ({
      id: i + 1,
      top: rand(2, 55).toFixed(2),
      left: rand(0, 100).toFixed(2),
      size: rand(1.5, 3.2).toFixed(1),
      duration: rand(2.5, 6).toFixed(2),
      delay: (-rand(0, 6)).toFixed(2)
    }))
)

const fireflies = computed(() =>
    Array.from({ length: props.firefliesCount }).map((_, i) => ({
      id: i + 1,
      top: rand(40, 92).toFixed(2),
      left: rand(0, 100).toFixed(2),
      dx: Math.round(rand(-60, 60)),
      dy: Math.round(rand(-70, -20)),
      duration: rand(7, 13).toFixed(2),
      delay: (-rand(0, 13)).toFixed(2),
      tone: i % 3 === 0 ? 'lavender' : 'amber'
    }))
)
</script>

<template>
  <div class="halloween-fx" :class="'halloween-fx--' + props.layer" aria-hidden="true">
    <ClientOnly>
      <template v-if="props.layer === 'back'">
      <div class="moon">
        <div class="moon__halo"></div>
        <svg class="moon__disc" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="hfx-moon-surface" cx="42%" cy="38%" r="65%">
              <stop offset="0%" stop-color="#ffe9c2"/>
              <stop offset="45%" stop-color="#ffc06b"/>
              <stop offset="80%" stop-color="#f2913a"/>
              <stop offset="100%" stop-color="#d9702a"/>
            </radialGradient>
            <radialGradient id="hfx-moon-crater" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stop-color="#c8692a" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="#f5a552" stop-opacity="0.12"/>
            </radialGradient>
            <radialGradient id="hfx-moon-shade" cx="30%" cy="30%" r="80%">
              <stop offset="60%" stop-color="#000" stop-opacity="0"/>
              <stop offset="100%" stop-color="#7a3410" stop-opacity="0.35"/>
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="96" fill="url(#hfx-moon-surface)"/>
          <ellipse cx="72" cy="66" rx="20" ry="17" fill="url(#hfx-moon-crater)"/>
          <ellipse cx="128" cy="58" rx="11" ry="10" fill="url(#hfx-moon-crater)"/>
          <ellipse cx="118" cy="112" rx="26" ry="22" fill="url(#hfx-moon-crater)"/>
          <ellipse cx="62" cy="128" rx="13" ry="11" fill="url(#hfx-moon-crater)"/>
          <ellipse cx="96" cy="152" rx="9" ry="8" fill="url(#hfx-moon-crater)"/>
          <ellipse cx="150" cy="96" rx="7" ry="6" fill="url(#hfx-moon-crater)"/>
          <ellipse cx="44" cy="92" rx="6" ry="5" fill="url(#hfx-moon-crater)"/>
          <circle cx="100" cy="100" r="96" fill="url(#hfx-moon-shade)"/>
        </svg>
        <div class="moon__cloud moon__cloud--one"></div>
        <div class="moon__cloud moon__cloud--two"></div>
      </div>

      <span
          v-for="st in stars"
          :key="'s' + st.id"
          class="star"
          :style="{
            top: st.top + 'vh',
            left: st.left + 'vw',
            '--size': st.size + 'px',
            '--duration': st.duration + 's',
            '--delay': st.delay + 's'
          }"
      ></span>
      </template>

      <template v-else>
      <svg class="web web--left" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0L100.0 0.0M0 0L96.6 25.9M0 0L86.6 50.0M0 0L70.7 70.7M0 0L50.0 86.6M0 0L25.9 96.6M0 0L0.0 100.0M18.0 0.0Q15.6 2.0 17.4 4.7Q14.5 6.0 15.6 9.0Q12.5 9.6 12.7 12.7Q9.6 12.5 9.0 15.6Q6.0 14.5 4.7 17.4Q2.0 15.6 0.0 18.0M34.0 0.0Q29.4 3.9 32.8 8.8Q27.4 11.4 29.4 17.0Q23.5 18.1 24.0 24.0Q18.1 23.5 17.0 29.4Q11.4 27.4 8.8 32.8Q3.9 29.4 0.0 34.0M50.0 0.0Q43.3 5.7 48.3 12.9Q40.3 16.7 43.3 25.0Q34.6 26.6 35.4 35.4Q26.6 34.6 25.0 43.3Q16.7 40.3 12.9 48.3Q5.7 43.3 0.0 50.0M66.0 0.0Q57.1 7.5 63.8 17.1Q53.2 22.0 57.2 33.0Q45.7 35.1 46.7 46.7Q35.1 45.7 33.0 57.2Q22.0 53.2 17.1 63.8Q7.5 57.1 0.0 66.0M82.0 0.0Q70.9 9.3 79.2 21.2Q66.1 27.4 71.0 41.0Q56.8 43.6 58.0 58.0Q43.6 56.8 41.0 71.0Q27.4 66.1 21.2 79.2Q9.3 70.9 0.0 82.0M98.0 0.0Q84.8 11.2 94.7 25.4Q79.0 32.7 84.9 49.0Q67.8 52.1 69.3 69.3Q52.1 67.8 49.0 84.9Q32.7 79.0 25.4 94.7Q11.2 84.8 0.0 98.0"/>
      </svg>
      <svg class="web web--right" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0L100.0 0.0M0 0L96.6 25.9M0 0L86.6 50.0M0 0L70.7 70.7M0 0L50.0 86.6M0 0L25.9 96.6M0 0L0.0 100.0M18.0 0.0Q15.6 2.0 17.4 4.7Q14.5 6.0 15.6 9.0Q12.5 9.6 12.7 12.7Q9.6 12.5 9.0 15.6Q6.0 14.5 4.7 17.4Q2.0 15.6 0.0 18.0M34.0 0.0Q29.4 3.9 32.8 8.8Q27.4 11.4 29.4 17.0Q23.5 18.1 24.0 24.0Q18.1 23.5 17.0 29.4Q11.4 27.4 8.8 32.8Q3.9 29.4 0.0 34.0M50.0 0.0Q43.3 5.7 48.3 12.9Q40.3 16.7 43.3 25.0Q34.6 26.6 35.4 35.4Q26.6 34.6 25.0 43.3Q16.7 40.3 12.9 48.3Q5.7 43.3 0.0 50.0M66.0 0.0Q57.1 7.5 63.8 17.1Q53.2 22.0 57.2 33.0Q45.7 35.1 46.7 46.7Q35.1 45.7 33.0 57.2Q22.0 53.2 17.1 63.8Q7.5 57.1 0.0 66.0M82.0 0.0Q70.9 9.3 79.2 21.2Q66.1 27.4 71.0 41.0Q56.8 43.6 58.0 58.0Q43.6 56.8 41.0 71.0Q27.4 66.1 21.2 79.2Q9.3 70.9 0.0 82.0M98.0 0.0Q84.8 11.2 94.7 25.4Q79.0 32.7 84.9 49.0Q67.8 52.1 69.3 69.3Q52.1 67.8 49.0 84.9Q32.7 79.0 25.4 94.7Q11.2 84.8 0.0 98.0"/>
      </svg>

      <div class="spider">
        <div class="spider__thread"></div>
        <svg class="spider__body" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <g class="spider__legs spider__legs--left" stroke="#0b0b0d" stroke-width="1.8" fill="none" stroke-linecap="round">
            <path d="M16 18Q8 12 4 16"/>
            <path d="M16 21Q7 19 3 24"/>
            <path d="M16 24Q8 26 5 32"/>
            <path d="M17 26Q11 32 10 37"/>
          </g>
          <g class="spider__legs spider__legs--right" stroke="#0b0b0d" stroke-width="1.8" fill="none" stroke-linecap="round">
            <path d="M24 18Q32 12 36 16"/>
            <path d="M24 21Q33 19 37 24"/>
            <path d="M24 24Q32 26 35 32"/>
            <path d="M23 26Q29 32 30 37"/>
          </g>
          <ellipse cx="20" cy="25" rx="7" ry="8" fill="#0b0b0d"/>
          <circle cx="20" cy="15" r="5" fill="#0b0b0d"/>
          <circle cx="18" cy="14.5" r="1.3" fill="#f5c16c"/>
          <circle cx="22" cy="14.5" r="1.3" fill="#f5c16c"/>
        </svg>
      </div>

      <div class="ghost-track">
        <svg class="ghost" viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2C10 2 4 10 4 20V44L9 40L14 45L20 40L26 45L31 40L36 44V20C36 10 30 2 20 2Z"/>
          <circle cx="14" cy="20" r="3" fill="#1a1920"/>
          <circle cx="26" cy="20" r="3" fill="#1a1920"/>
          <ellipse cx="20" cy="29" rx="3" ry="4" fill="#1a1920"/>
        </svg>
      </div>

      <div
          v-for="b in bats"
          :key="b.id"
          class="bat-track"
          :class="{ reverse: b.reverse }"
          :style="{
            '--top': b.top + 'vh',
            '--duration': b.duration + 's',
            '--delay': b.delay + 's',
            '--bob': b.bob + 'px'
          }"
      >
        <svg
            class="bat"
            :style="{ '--size': b.size + 'px', '--flap': b.flap + 's' }"
            viewBox="0 0 64 32"
            xmlns="http://www.w3.org/2000/svg"
        >
          <path
              d="M32 10C30 6 28 5 27 5C28 8 27 10 25 11C21 8 14 6 4 8C9 10 11 14 11 18C15 15 19 16 21 19C23 17 26 17 28 20C29 22 30 24 32 26C34 24 35 22 36 20C38 17 41 17 43 19C45 16 49 15 53 18C53 14 55 10 60 8C50 6 43 8 39 11C37 10 36 8 37 5C36 5 34 6 32 10Z"
          />
        </svg>
      </div>

      <span
          v-for="f in fireflies"
          :key="'f' + f.id"
          class="firefly"
          :class="'firefly--' + f.tone"
          :style="{
            top: f.top + 'vh',
            left: f.left + 'vw',
            '--dx': f.dx + 'px',
            '--dy': f.dy + 'px',
            '--duration': f.duration + 's',
            '--delay': f.delay + 's'
          }"
      ></span>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.halloween-fx {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* под всем контентом: поверх фона страницы, но ниже любых блоков */
.halloween-fx--back {
  z-index: -1;
}

/* Луна */
.moon {
  position: absolute;
  top: 10vh;
  right: 8vw;
  width: clamp(130px, 30vmin, 240px);
  aspect-ratio: 1;
  /* приглушена: должна лишь чуть-чуть проглядывать сквозь интерфейс */
  opacity: 0.55;
}

.moon__halo {
  position: absolute;
  inset: -160%;
  border-radius: 50%;
  background: radial-gradient(circle closest-side,
  rgba(255, 170, 80, 0.55) 0%,
  rgba(255, 160, 70, 0.38) 20%,
  rgba(245, 130, 50, 0.18) 38%,
  rgba(230, 110, 40, 0.08) 58%,
  rgba(230, 110, 40, 0.03) 78%,
  rgba(230, 110, 40, 0) 100%);
  will-change: opacity;
  animation: moon-pulse 7s ease-in-out infinite alternate;
}

.moon__disc {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

/* Тонкие облака, медленно проплывающие по диску луны */
.moon__cloud {
  position: absolute;
  height: 18%;
  border-radius: 50%;
  background: radial-gradient(ellipse closest-side,
  rgba(40, 30, 40, 0.7) 0%,
  rgba(40, 30, 40, 0.32) 55%,
  rgba(40, 30, 40, 0) 100%);
  will-change: transform;
}

.moon__cloud--one {
  top: 55%;
  left: -60%;
  width: 150%;
  animation: cloud-pass 34s linear infinite;
}

.moon__cloud--two {
  top: 22%;
  left: -60%;
  width: 110%;
  height: 13%;
  animation: cloud-pass 48s linear infinite;
  animation-delay: -20s;
}

/* Летучие мыши */
.bat-track {
  position: absolute;
  top: var(--top);
  left: 0;
  will-change: transform;
  animation: fly-right var(--duration) linear infinite;
  animation-delay: var(--delay);
}

.bat-track.reverse {
  animation-name: fly-left;
}

.bat {
  display: block;
  width: var(--size);
  height: calc(var(--size) / 2);
  fill: #050506;
  filter: drop-shadow(0 0 5px rgba(170, 150, 220, 0.45));
  transform-origin: 50% 60%;
  animation: flap var(--flap) ease-in-out infinite alternate;
}

/* Паутина в верхних углах */
.web {
  position: absolute;
  top: 0;
  width: clamp(70px, 16vmin, 140px);
  height: clamp(70px, 16vmin, 140px);
  fill: none;
  stroke: rgba(225, 222, 235, 0.38);
  stroke-width: 0.7;
  filter: drop-shadow(0 0 2px rgba(190, 175, 235, 0.35));
}

.web--left {
  left: 0;
}

.web--right {
  right: 0;
  transform: scaleX(-1);
}

/* Паук медленно спускается на нити и поднимается обратно */
.spider {
  position: absolute;
  top: 0;
  right: clamp(46px, 11vmin, 96px);
  width: 34px;
  height: 34px;
  will-change: transform;
  animation: spider-drop 14s ease-in-out infinite;
}

.spider__thread {
  position: absolute;
  bottom: 70%;
  left: 50%;
  width: 1px;
  height: 60vh;
  background: rgba(225, 222, 235, 0.5);
}

.spider__body {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 4px rgba(190, 175, 235, 0.55));
  transform-origin: 50% 0;
  animation: spider-sway 3s ease-in-out infinite alternate;
}

.spider__legs {
  transform-origin: 50% 55%;
  animation: spider-legs 0.6s ease-in-out infinite alternate;
}

.spider__legs--right {
  animation-delay: -0.3s;
}

/* На светлых темах (вне темы Хэллоуина) паутину и призрака делаем темнее, чтобы их было видно */
:global(html.light) .web,
:global(html.pink) .web {
  stroke: rgba(60, 55, 75, 0.35);
  filter: none;
}

:global(html.light) .spider__thread,
:global(html.pink) .spider__thread {
  background: rgba(60, 55, 75, 0.45);
}

:global(html.light) .ghost,
:global(html.pink) .ghost {
  fill: rgba(255, 255, 255, 0.95);
  filter: drop-shadow(0 0 3px rgba(60, 50, 90, 0.55));
}

/* Мерцающие звёзды */
.star {
  position: absolute;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: #f1ebe3;
  box-shadow: 0 0 4px rgba(241, 235, 227, 0.8);
  opacity: 0.2;
  animation: twinkle var(--duration) ease-in-out infinite alternate;
  animation-delay: var(--delay);
}

/* Светлячки / магические огоньки */
.firefly {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  will-change: transform, opacity;
  animation: firefly-float var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

.firefly--amber {
  background: #ffd08a;
  box-shadow: 0 0 6px 2px rgba(245, 160, 70, 0.75), 0 0 14px 4px rgba(245, 160, 70, 0.3);
}

.firefly--lavender {
  background: #e3dcff;
  box-shadow: 0 0 6px 2px rgba(160, 140, 225, 0.75), 0 0 14px 4px rgba(160, 140, 225, 0.3);
}

/* Призрак — медленно проплывает раз в ~40 секунд */
.ghost-track {
  position: absolute;
  top: 22vh;
  left: 0;
  will-change: transform, opacity;
  animation: ghost-path 40s linear infinite;
  animation-delay: -12s;
}

.ghost {
  display: block;
  width: 46px;
  height: 55px;
  fill: rgba(236, 232, 245, 0.85);
  filter: drop-shadow(0 0 10px rgba(190, 175, 235, 0.6));
  animation: ghost-bob 3s ease-in-out infinite alternate;
}

@keyframes fly-right {
  0% { transform: translate3d(-10vw, 0, 0); }
  25% { transform: translate3d(22vw, calc(var(--bob) * -1), 0); }
  50% { transform: translate3d(55vw, var(--bob), 0); }
  75% { transform: translate3d(85vw, calc(var(--bob) * -1), 0); }
  100% { transform: translate3d(110vw, 0, 0); }
}

@keyframes fly-left {
  0% { transform: translate3d(110vw, 0, 0) scaleX(-1); }
  25% { transform: translate3d(85vw, var(--bob), 0) scaleX(-1); }
  50% { transform: translate3d(55vw, calc(var(--bob) * -1), 0) scaleX(-1); }
  75% { transform: translate3d(22vw, var(--bob), 0) scaleX(-1); }
  100% { transform: translate3d(-10vw, 0, 0) scaleX(-1); }
}

@keyframes flap {
  from { transform: scaleY(1); }
  to { transform: scaleY(0.35); }
}

@keyframes spider-drop {
  0%, 12% { transform: translate3d(0, -20px, 0); }
  45%, 62% { transform: translate3d(0, 26vh, 0); }
  100% { transform: translate3d(0, -20px, 0); }
}

@keyframes spider-sway {
  from { transform: rotate(-6deg); }
  to { transform: rotate(6deg); }
}

@keyframes spider-legs {
  from { transform: scaleX(1); }
  to { transform: scaleX(0.9); }
}

@keyframes twinkle {
  from { opacity: 0.15; transform: scale(0.8); }
  to { opacity: 0.95; transform: scale(1.15); }
}

@keyframes firefly-float {
  0% { transform: translate3d(0, 0, 0); opacity: 0; }
  20% { opacity: 1; }
  50% { transform: translate3d(var(--dx), var(--dy), 0); opacity: 0.4; }
  80% { opacity: 1; }
  100% { transform: translate3d(0, 0, 0); opacity: 0; }
}

@keyframes ghost-path {
  0% { transform: translate3d(-15vw, 0, 0); opacity: 0; }
  5% { opacity: 0.9; }
  45% { transform: translate3d(115vw, -6vh, 0); opacity: 0.9; }
  50% { transform: translate3d(115vw, -6vh, 0); opacity: 0; }
  100% { transform: translate3d(115vw, -6vh, 0); opacity: 0; }
}

@keyframes ghost-bob {
  from { transform: translateY(-6px) rotate(-4deg); }
  to { transform: translateY(6px) rotate(4deg); }
}

@keyframes cloud-pass {
  from { transform: translate3d(-40%, 0, 0); opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  to { transform: translate3d(160%, 0, 0); opacity: 0; }
}

@keyframes moon-pulse {
  from { opacity: 0.75; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .bat-track,
  .spider,
  .ghost-track,
  .firefly {
    display: none;
  }

  .star {
    animation: none;
    opacity: 0.6;
  }

  .moon__halo,
  .moon__cloud {
    animation: none;
  }
}
</style>
