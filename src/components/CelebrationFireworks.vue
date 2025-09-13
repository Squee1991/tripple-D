<template>
  <section v-show="modelValue" class="celebration active" aria-live="polite">
    <div class="stage">
      <div class="fireworks">
        <div v-for="b in bursts" :key="b.id" class="burst"
             :style="{ left: b.x + '%', top: b.y + '%', animationDelay: b.delay + 's' }">
          <span v-for="s in sparkCount" :key="s" class="spark" :style="sparkStyle(s)">
            <i class="dot" :style="dotStyle(b, s)"></i>
          </span>
        </div>
      </div>
      <div class="confetti">
        <span v-for="n in pieces" :key="n" class="piece" :style="pieceStyle()"></span>
      </div>
    </div>
    <div class="finish-card" :style="{ zIndex: zIndex + 1 }">
      <h2 class="title">{{ title }}</h2>
      <p class="subtitle">{{ resultLabel }} {{ score }} / {{ total }}</p>
      <template v-if="showStats">
        <div class="level-wrap">
          <div class="level-row">
            <div class="level-label">{{ levelLabel }}</div>
            <div class="level-value">{{ shownLevel }}</div>
          </div>
          <div class="xp-bar">
            <div class="xp-fill" :style="{ width: xpWidth + '%' }"></div>
          </div>
          <div class="xp-numbers">{{ Math.round(shownExp) }} / {{ levelUpXp }} XP</div>
        </div>
        <div class="stats">
          <div class="pill pill-time">
            <span class="pill-label">{{ timeLabel }}</span>
            <span class="pill-value">{{ elapsed }}</span>
          </div>
          <div class="pill pill-points">
            <span class="pill-label">{{ pointsLabel }}</span>
            <span class="pill-value">
            {{ Math.round(shownPoints) }}
            <i class="delta" v-if="justAwarded && award > 0">+{{ award }}</i>
          </span>
          </div>
          <div class="pill pill-xp">
            <span class="pill-label">XP</span>
            <span class="pill-value">
            {{ Math.round(shownExpDisplay) }}
            <i class="delta" v-if="justAwarded && award > 0">+{{ award }}</i>
          </span>
          </div>
        </div>
      </template>
      <slot/>
    </div>
  </section>
</template>

<script setup>
import {ref, nextTick, watch, onMounted, computed} from 'vue'

const props = defineProps({
  modelValue: {type: Boolean, default: false},
  score: {type: Number, default: 0},
  total: {type: Number, default: 0},
  elapsed: {type: String, default: '0:00'},
  showStats: { type: Boolean, default: true },
  pointsStart: {type: Number, default: 0},
  expStart: {type: Number, default: 0},
  levelStart: {type: Number, default: 1},
  award: {type: Number, default: 0},
  levelUpXp: {type: Number, default: 100},
  title: {type: String, default: ''},
  resultLabel: {type: String, default: ''},
  timeLabel: {type: String, default: ''},
  pointsLabel: {type: String, default: ''},
  levelLabel: {type: String, default: ''},
  pieces: {type: Number, default: 240},
  sparkCount: {type: Number, default: 30},
  burstsCount: {type: Number, default: 28},
  areaX: {type: Array, default: () => [10, 90]},
  areaY: {type: Array, default: () => [15, 75]},
  zIndex: {type: Number, default: 50},
})

const emit = defineEmits(['update:modelValue'])
const bursts = ref([])

function rnd(min, max) {
  return Math.random() * (max - min) + min
}

function rndInt(min, max) {
  return Math.floor(rnd(min, max + 1))
}

function pieceStyle() {
  const h = rndInt(0, 360), l = rndInt(0, 100), r = rndInt(0, 360)
  const d = rnd(0, 0.35), size = rndInt(6, 12)
  const fallDur = rnd(2.4, 3.6), spinDur = fallDur * rnd(0.85, 1.15)
  return {
    left: l + '%',
    width: size + 'px',
    height: Math.max(3, Math.round(size * 0.35)) + 'px',
    background: `hsl(${h} 90% 55%)`,
    transform: `rotate(${r}deg)`,
    animationDelay: d + 's, ' + d + 's',
    animationDuration: fallDur + 's, ' + spinDur + 's',
  }
}

function makeBursts() {
  const [minX, maxX] = props.areaX
  const [minY, maxY] = props.areaY
  const list = []
  for (let i = 0; i < props.burstsCount; i++) {
    const x = Math.round(rnd(minX, maxX))
    const y = Math.round(rnd(minY, maxY))
    const delay = rnd(0, 0.18)
    const hue = (i * 23 + Math.random() * 180) % 360
    list.push({id: i + 1, x, y, delay, hue})
  }
  bursts.value = list
}

function sparkStyle(s) {
  const angle = (360 / props.sparkCount) * s + rnd(-6, 6)
  return {transform: `rotate(${angle}deg)`}
}

function dotStyle(b, s) {
  const hue = Math.round((b.hue + s * 7) % 360)
  const boomDur = rnd(0.9, 1.6), fadeDur = rnd(0.6, 1.4)
  const boomDelay = b.delay + rnd(0.05, 0.25), fadeDelay = boomDelay + rnd(0.0, 0.25)
  const size = rnd(3, 5)
  return {
    background: `hsl(${hue} 100% 70%)`,
    width: size + 'px',
    height: size + 'px',
    animationDuration: boomDur + 's, ' + fadeDur + 's',
    animationDelay: boomDelay + 's, ' + fadeDelay + 's',
  }
}

async function play() {
  makeBursts()
  emit('update:modelValue', false)
  await nextTick()
  emit('update:modelValue', true)
}

defineExpose({play})

const shownPoints = ref(0)
const shownExp = ref(0)
const shownLevel = ref(1)
const xpWidth = ref(0)
const justAwarded = ref(false)
const shownExpDisplay = computed(() => shownExp.value)

function setFromProps() {
  shownPoints.value = props.pointsStart
  shownExp.value = props.expStart
  shownLevel.value = props.levelStart || 1
  xpWidth.value = Math.min(100, (shownExp.value / props.levelUpXp) * 100)
}

function tween(refVal, from, to, ms = 800) {
  const start = performance.now()
  const step = (t) => {
    const k = Math.min(1, (t - start) / ms)
    const e = 1 - Math.pow(1 - k, 3)
    refVal.value = from + (to - from) * e
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function animateAward() {
  justAwarded.value = true
  const A = Math.max(0, props.award)
  const CAP = props.levelUpXp
  const e0 = props.expStart
  const p0 = props.pointsStart
  const lvl0 = props.levelStart || 1

  tween(shownPoints, p0, p0 + A, 800)

  if (e0 + A < CAP) {
    tween(shownExp, e0, e0 + A, 900)
    tween(xpWidth, (e0 / CAP) * 100, ((e0 + A) / CAP) * 100, 900)
  } else {
    tween(xpWidth, (e0 / CAP) * 100, 100, 500)
    tween(shownExp, e0, CAP, 500)
    setTimeout(() => {
      shownLevel.value = lvl0 + 1
      shownExp.value = 0
      xpWidth.value = 0
      const remainder = e0 + A - CAP
      tween(shownExp, 0, remainder, 500)
      tween(xpWidth, 0, (remainder / CAP) * 100, 500)
    }, 520)
  }
  setTimeout(() => (justAwarded.value = false), 1200)
}

onMounted(() => {
  if (props.modelValue) {
    setFromProps()
    nextTick().then(() => {
      makeBursts()
      animateAward()
    })
  }
})
watch(() => props.modelValue, async (val, old) => {
  if (val && !old) {
    setFromProps()
    await nextTick()
    makeBursts()
    animateAward()
  }
})
</script>

<style scoped>
/* fullscreen + анимации */
.celebration {
  position: fixed;
  inset: 0;
  z-index: v-bind(zIndex);
  pointer-events: none;
  display: grid;
  place-items: center;
  padding: 24px;
  background: transparent;
  font-family: "Nunito", system-ui, -apple-system, Segoe UI, Roboto, sans-serif
}

.stage {
  position: absolute;
  inset: 0;
  overflow: hidden
}

.fireworks, .confetti {
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

/* карточка под твой стиль */
.finish-card {
  position: relative;
  width: 100%;
  max-width: 560px;
  text-align: center;
  color: #1D1D1B;
  background: #F6F1DE;
  border: 3px solid #000;
  border-radius: 22px;
  padding: 28px 24px;
  box-shadow: 8px 8px 0 #000;
  pointer-events: auto
}

.title {
  font-size: 28px;
  color: #1D1D1B;
  margin: 0 0 8px;
  font-weight: 900;
  letter-spacing: .3px
}

.subtitle {
  margin: 0 0 18px;
  color: #2b2b2b
}

.level-wrap {
  margin: 0 0 18px;
  text-align: left
}

.level-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px
}

.level-label {
  font-size: 14px;
  opacity: .9
}

.level-value {
  font-size: 22px;
  font-weight: 900
}

.xp-bar {
  width: 100%;
  height: 24px;
  border-radius: 999px;
  background: #a9a89f;
  overflow: hidden
}

.xp-fill {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #d8ca6f, #F2D36C);
  transition: width .35s ease
}

.xp-numbers {
  margin-top: 6px;
  font-size: 12px;
  opacity: .85
}

.stats {
  display: grid;
  grid-template-columns:repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 10px
}

.pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 10px;
  border-radius: 16px;
  background: #F6F1DE;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000
}

.pill-time {
  background: #E6F0FF
}

.pill-points {
  background: #E9F9EF
}

.pill-xp {
  background: #FFF5D9
}

.pill-label {
  font-size: 12px;
  letter-spacing: .8px;
  opacity: .85
}

.pill-value {
  font-size: 18px;
  font-weight: 900;
  position: relative
}

.delta {
  margin-left: 6px;
  font-size: 14px;
  font-weight: 900;
  color: #2e7d32
}
</style>
