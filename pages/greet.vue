<template>
  <section class="page" :class="{ active }">
    <div class="stage">
      <div class="fireworks">
        <div v-for="b in bursts" :key="b.id" class="burst"
             :style="{ left: b.x + '%', top: b.y + '%', animationDelay: b.delay + 's' }">
          <span v-for="s in sparkCount" :key="s" class="spark" :style="sparkStyle(s)"><i class="dot"
                                                                                         :style="dotStyle(b, s)"></i></span>
        </div>
      </div>
      <div class="confetti">
        <span v-for="n in pieces" :key="n" class="piece" :style="pieceStyle()"></span>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, nextTick} from 'vue'

const active = ref(false)
const pieces = 220
const sparkCount = 28
const bursts = ref([])

function rnd(min, max) {
  return Math.random() * (max - min) + min
}

function rndInt(min, max) {
  return Math.floor(rnd(min, max + 1))
}

function pieceStyle() {
  const h = rndInt(0, 360)
  const l = rndInt(0, 100)
  const r = rndInt(0, 360)
  const d = rnd(0, 0.35)
  const size = rndInt(6, 12)
  const fallDur = rnd(2.4, 3.6)
  const spinDur = fallDur * rnd(0.85, 1.15)
  return {
    left: l + '%',
    width: size + 'px',
    height: Math.max(3, Math.round(size * 0.35)) + 'px',
    background: `hsl(${h} 90% 55%)`,
    transform: `rotate(${r}deg)`,
    animationDelay: d + 's, ' + d + 's',
    animationDuration: fallDur + 's, ' + spinDur + 's'
  }
}

function makeBursts() {
  const total = 26
  const list = []
  for (let i = 0; i < total; i++) {
    const x = Math.round(rnd(10, 90))
    const y = Math.round(rnd(18, 70))
    const delay = rnd(0, 0.18)
    const hue = (i * 23 + Math.random() * 180) % 360
    list.push({id: i + 1, x, y, delay, hue})
  }
  bursts.value = list
}

function sparkStyle(s) {
  const angle = (360 / sparkCount) * s + rnd(-6, 6)
  return {transform: `rotate(${angle}deg)`}
}

function dotStyle(b, s) {
  const hue = Math.round((b.hue + s * 7) % 360)
  const boomDur = rnd(0.9, 1.6)
  const fadeDur = rnd(0.6, 1.4)
  const boomDelay = b.delay + rnd(0.05, 0.25)
  const fadeDelay = boomDelay + rnd(0.0, 0.25)
  const size = rnd(3, 5)
  return {
    background: `hsl(${hue} 100% 70%)`,
    width: size + 'px',
    height: size + 'px',
    animationDuration: boomDur + 's, ' + fadeDur + 's',
    animationDelay: boomDelay + 's, ' + fadeDelay + 's'
  }
}

async function play() {
  makeBursts()
  active.value = false
  await nextTick()
  active.value = true
}

makeBursts()
</script>

<style scoped>
.page {
  min-height: 100svh;
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 18px;
}

.stage {
  position: relative;
  overflow: hidden;
  border-radius: 26px
}

.controls {
  display: grid;
  place-items: center
}

.btn {
  appearance: none;
  border: none;
  cursor: pointer;
  padding: 14px 22px;
  border-radius: 16px;
  font-weight: 800;
  background: linear-gradient(180deg, #ffe18f, #ffb647);
  color: #2f2600;
  box-shadow: 0 10px 28px rgba(255, 182, 71, .4), inset 0 1px 0 rgba(255, 255, 255, .8);
  transition: transform .12s ease, box-shadow .12s ease
}

.btn:active {
  transform: translateY(1px) scale(.99);
  box-shadow: 0 6px 18px rgba(255, 182, 71, .4), inset 0 1px 0 rgba(255, 255, 255, .7)
}

.fireworks {
  position: absolute;
  inset: 0;
  pointer-events: none
}

.burst {
  position: absolute;
  width: 0;
  height: 0
}

.spark {
  position: absolute;
  transform-origin: 0 0
}

.dot {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  opacity: 0;
  animation-name: boom, fade;
  animation-timing-function: ease-out, linear;
  animation-fill-mode: forwards, forwards
}

@keyframes boom {
  0% {
    transform: translateX(0) scale(.7)
  }
  70% {
    transform: translateX(120px) scale(1)
  }
  100% {
    transform: translateX(140px) scale(1)
  }
}

@keyframes fade {
  0% {
    opacity: 1
  }
  80% {
    opacity: 1
  }
  100% {
    opacity: 0
  }
}

.confetti {
  position: absolute;
  inset: 0;
  pointer-events: none
}

.piece {
  position: absolute;
  top: -10%;
  opacity: 0;
  border-radius: 2px;
  animation-name: fall, spin;
  animation-timing-function: cubic-bezier(.2, .7, .2, 1), linear;
  animation-fill-mode: both, both
}

.active .piece {
  animation-play-state: running
}

@keyframes fall {
  from {
    transform: translateY(-20%);
    opacity: 0
  }
  12% {
    opacity: 1
  }
  to {
    transform: translateY(165%);
    opacity: 0
  }
}

@keyframes spin {
  from {
    transform: rotate(0)
  }
  to {
    transform: rotate(420deg)
  }
}

@media (prefers-reduced-motion: reduce) {
  .piece, .burst, .spark, .dot {
    animation: none !important
  }
}
</style>
