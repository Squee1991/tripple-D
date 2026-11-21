<script setup>
import { computed } from 'vue'
import SnowCoin from '~/assets/images/event-rewards/winter-event/winter-words/snowflake.svg'

// Ночная деревня в шапке зимнего ивента: окно N загорается после окошка N календаря,
// под домиками снег с заголовком текущей вкладки
const props = defineProps({
  questsProgress: { type: Object, default: () => ({}) },
  freshDays: { type: Array, default: () => [] },
  title: { type: String, default: '' }
})

const { t } = useI18n()

const isDone = (day) => !!props.questsProgress?.[`advent-${day}`]?.finished
const openedCount = computed(() => Array.from({ length: 24 }, (_, i) => i + 1).filter(isDone).length)
const isAllOpened = computed(() => openedCount.value === 24)
const justLit = computed(() => new Set(props.freshDays))

// Деревня: 8 домиков по 3 окна, окно N загорается после окошка N
const HOUSES = [
  { x: 18, w: 74, h: 70, roof: '#b8463f' },
  { x: 104, w: 64, h: 92, roof: '#3f6db8' },
  { x: 180, w: 80, h: 64, roof: '#5e8f4a' },
  { x: 272, w: 66, h: 84, roof: '#8a4fb0' },
  { x: 462, w: 66, h: 84, roof: '#b8463f' },
  { x: 540, w: 80, h: 66, roof: '#3f6db8' },
  { x: 632, w: 64, h: 92, roof: '#c07a2c' },
  { x: 708, w: 74, h: 70, roof: '#5e8f4a' }
]
const GROUND = 236

const houses = computed(() => HOUSES.map((house, houseIndex) => {
  const top = GROUND - house.h
  const winW = 13
  const winH = 15
  const gap = (house.w - winW * 3) / 4
  const windows = [0, 1, 2].map(i => {
    const day = houseIndex * 3 + i + 1
    const row = i === 1 ? 0 : 1
    return {
      day,
      x: house.x + gap + i * (winW + gap),
      y: top + 16 + row * 20,
      w: winW,
      h: winH,
      lit: isDone(day)
    }
  })
  const roofPoints = `${house.x - 8},${top} ${house.x + house.w / 2},${top - house.w * 0.42} ${house.x + house.w + 8},${top}`
  const apexY = top - house.w * 0.42
  const cx = house.x + house.w / 2
  // Снежное одеяло на крыше с подтёками по нижнему краю
  const halfBase = house.w / 2 + 8
  const roofYAt = (px) => top - (top - apexY) * (1 - Math.min(1, Math.abs(px - cx) / halfBase))
  const inner = []
  const steps = 12
  for (let k = 0; k <= steps; k++) {
    const px = (house.x + house.w + 8) - (house.w + 16) * (k / steps)
    const drip = k % 2 === 1 ? 5 : 0
    inner.push(`${px.toFixed(1)},${(roofYAt(px) + 6 + drip).toFixed(1)}`)
  }
  const roofSnow = [`${house.x - 11},${top + 1}`, `${cx},${apexY - 4}`, `${house.x + house.w + 11},${top + 1}`, ...inner].join(' ')
  const icicles = [0.15, 0.32, 0.5, 0.68, 0.85].map((f, k) => {
    const ix = house.x + house.w * f
    const len = 5 + ((houseIndex + k) % 3) * 3
    return `${ix - 2.4},${top + 1} ${ix + 2.4},${top + 1} ${ix},${top + 1 + len}`
  })
  const door = { x: cx - 8, y: GROUND - 24, w: 16, h: 24 }
  // Труба с дымом у каждого второго домика
  let chimney = null
  if (houseIndex % 2 === 0) {
    const px = house.x + house.w * 0.74
    const roofY = top - (top - apexY) * (1 - Math.abs(px - cx) / halfBase)
    chimney = { x: px - 5, y: roofY - 16, w: 10, h: 22, smokeX: px, smokeY: roofY - 18 }
  }
  return { ...house, top, windows, roofPoints, roofSnow, icicles, door, chimney }
}))

// Гирлянды между домиками: по одной за каждые 8 открытых окошек
const garlands = computed(() => {
  const list = []
  const spans = [
    [55, 140, 300, 160],
    [500, 160, 745, 140],
    [140, 120, 660, 120]
  ]
  spans.forEach(([x1, y1, x2, y2], index) => {
    if (openedCount.value < (index + 1) * 8) return
    const bulbs = []
    const count = 14
    for (let i = 0; i <= count; i++) {
      const tt = i / count
      const x = x1 + (x2 - x1) * tt
      const sag = Math.sin(Math.PI * tt) * 18
      const y = y1 + (y2 - y1) * tt + sag
      bulbs.push({ x, y, color: ['#ffd84d', '#ff5d5d', '#5ddcff', '#7dff8a'][i % 4], delay: (i % 4) * 0.35 })
    }
    const mid = bulbs[Math.floor(count / 2)]
    list.push({ id: index, path: `M${x1},${y1} Q${mid.x},${mid.y + 18} ${x2},${y2}`, bulbs })
  })
  return list
})

const stars = Array.from({ length: 34 }, (_, i) => ({
  x: (i * 97) % 790 + 5,
  y: (i * 53) % 110 + 6,
  r: i % 5 === 0 ? 1.8 : 1.1,
  delay: (i % 7) * 0.4
}))

// Ёлка в деревне: ярусы [вершина, основание, полуширина], мишура, гирлянды и шары
const TREE_TIERS = [[92, 170, 48], [120, 200, 60], [150, 232, 70]]
const VT_COLORS = ['#ff5d5d', '#ffd84d', '#5ddcff', '#7dff8a', '#ff9ee5']
const vq = (a, b, c, t) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c
const villageTree = TREE_TIERS.map(([apex, base, half], ti) => {
  // гирлянда с огоньками ниже середины яруса
  const gy = apex + (base - apex) * 0.72
  const gw = half * 0.72
  const g = [400 - gw, gy - 6, 400, gy + 12, 400 + gw, gy + 2]
  const lights = []
  for (let k = 1; k < 8; k++) {
    const t = k / 8
    lights.push({ x: vq(g[0], g[2], g[4], t), y: vq(g[1], g[3], g[5], t), color: VT_COLORS[(k + ti) % VT_COLORS.length], delay: ((k + ti) % 4) * 0.3 })
  }
  // золотая мишура выше, наклонённая в другую сторону
  const my = apex + (base - apex) * 0.45
  const mw = half * 0.45
  const tinsel = `M${400 - mw},${my + 2} Q400,${my + 10} ${400 + mw},${my - 5}`
  // шары у нижнего края яруса
  const baubles = [-0.62, -0.2, 0.22, 0.64].map((f, k) => ({
    x: 400 + half * f * 0.9,
    y: base - 6 - (k % 2) * 4,
    color: VT_COLORS[(k * 2 + ti) % VT_COLORS.length]
  }))
  return {
    garland: `M${g[0]},${g[1]} Q${g[2]},${g[3]} ${g[4]},${g[5]}`,
    lights,
    tinsel,
    baubles
  }
})

const driftSparkles = [[60, 246], [150, 250], [255, 244], [345, 252], [470, 247], [560, 251], [650, 245], [745, 250],
  [40, 300], [110, 284], [690, 286], [762, 302]]

const snowDots = Array.from({ length: 44 }, (_, i) => ({
  x: (i * 61) % 800,
  r: i % 3 === 0 ? 2.2 : 1.4,
  duration: 7 + (i % 5) * 1.6,
  delay: -((i * 1.7) % 12)
}))
</script>

<template>
  <div class="village":class="{ 'is-complete': isAllOpened }">
    <svg viewBox="0 44 800 280" preserveAspectRatio="xMidYMax slice" class="village__svg" role="img"
         :aria-label="t('adventCalendar.progress', { count: openedCount })">
      <defs>
        <linearGradient id="advSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0d1b3d"/>
          <stop offset="1" stop-color="#2b4a8a"/>
        </linearGradient>
        <radialGradient id="advMoonGlow">
          <stop offset="0.45" stop-color="#fff6d6" stop-opacity="0.35"/>
          <stop offset="1" stop-color="#fff6d6" stop-opacity="0"/>
        </radialGradient>
        <mask id="advMoonCut">
          <rect x="570" y="50" width="80" height="80" fill="#fff"/>
          <circle cx="622" cy="78" r="21" fill="#000"/>
        </mask>
        <radialGradient id="advGlow">
          <stop offset="0" stop-color="#ffe9a3" stop-opacity="0.9"/>
          <stop offset="1" stop-color="#ffe9a3" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="800" height="324" fill="url(#advSky)"/>
      <circle v-for="(star, i) in stars" :key="'s' + i" :cx="star.x" :cy="star.y" :r="star.r" fill="#fff"
              class="village__star" :style="{ animationDelay: star.delay + 's' }"/>
      <circle cx="610" cy="86" r="44" fill="url(#advMoonGlow)"/>
      <circle cx="610" cy="86" r="24" fill="#fff6d6" mask="url(#advMoonCut)"/>
      <path d="M0,218 C70,196 130,206 180,214 S290,196 350,210 S470,194 540,208 S660,196 720,210 S780,204 800,206 L800,324 L0,324 Z"
            fill="#c9d9f5" opacity="0.6"/>
      <path d="M0,228 C60,210 120,216 170,224 S270,208 330,220 S450,206 520,218 S650,208 710,220 S780,214 800,216 L800,324 L0,324 Z"
            fill="#e8f0ff"/>

      <g v-for="garland in garlands" :key="'g' + garland.id" class="village__garland">
        <path :d="garland.path" fill="none" stroke="#2c3550" stroke-width="1.2"/>
        <circle v-for="(bulb, bi) in garland.bulbs" :key="bi" :cx="bulb.x" :cy="bulb.y" r="3.2" :fill="bulb.color"
                class="village__bulb" :style="{ animationDelay: bulb.delay + 's' }"/>
      </g>

      <g class="village__sleigh" aria-hidden="true">
        <g class="village__sleigh-bob">
          <g transform="translate(200 0) scale(-1 1)">
          <circle v-for="n in 6" :key="'tr' + n" :cx="118 + n * 12" :cy="30 + (n % 2) * 3" :r="1.6 - n * 0.15"
                  fill="#ffe9a3" class="village__trail" :style="{ animationDelay: n * 0.12 + 's' }"/>
          <path d="M60,34 q-6,0 -8,-6 l2,-2 q3,4 8,4 h34 q5,0 7,-5 l3,1 q-2,8 -10,8 z" fill="#ffd45e"/>
          <path d="M64,30 h30 q4,0 4,-4 v-8 q-8,2 -14,0 q-6,-3 -14,1 l-6,4 z" fill="#d23a34"/>
          <circle cx="78" cy="12" r="5" fill="#f2c9a5"/>
          <path d="M73,10 q5,-9 11,-1 z" fill="#d23a34"/>
          <circle cx="85" cy="7" r="1.8" fill="#fff"/>
          <rect x="72" y="16" width="12" height="7" rx="3" fill="#d23a34"/>
          <path d="M88,18 h10 v-6 h-10 z" fill="#2f8a4f"/>
          <line x1="50" y1="24" x2="38" y2="22" stroke="#c9b28a" stroke-width="1"/>
          <g v-for="(deer, di) in [26, 6]" :key="'d' + di" :transform="`translate(${deer - 26} 0)`">
            <ellipse cx="30" cy="22" rx="8" ry="4" fill="#8a5a36"/>
            <rect x="24" y="24" width="1.6" height="7" fill="#6b4329"/>
            <rect x="34" y="24" width="1.6" height="7" fill="#6b4329"/>
            <path d="M22,20 l-4,-6 l3,-1 z" fill="#8a5a36"/>
            <circle cx="18" cy="13" r="3" fill="#8a5a36"/>
            <path d="M17,10 l-2,-5 M17,10 l2,-5 M15,7 l-2,-1 M19,7 l2,-1" stroke="#5a3a22" stroke-width="1"/>
            <circle v-if="di === 1" cx="15.5" cy="13.5" r="1.4" fill="#ff4d4d"/>
          </g>
        </g>
        </g>
      </g>

      <g v-for="house in houses" :key="house.x">
        <g v-if="house.chimney">
          <circle v-for="n in 3" :key="'sm' + n" :cx="house.chimney.smokeX" :cy="house.chimney.smokeY" r="4"
                  fill="#e6edf8" class="village__smoke" :style="{ animationDelay: (n - 1) * 1.1 + 's' }"/>
          <rect :x="house.chimney.x" :y="house.chimney.y" :width="house.chimney.w" :height="house.chimney.h"
                fill="#8b4a3a" stroke="#4a2f22" stroke-width="1.5"/>
          <rect :x="house.chimney.x - 1.5" :y="house.chimney.y - 3" :width="house.chimney.w + 3" height="4" rx="2"
                fill="#ffffff"/>
        </g>
        <rect :x="house.x" :y="house.top" :width="house.w" :height="house.h" fill="#f3e3c7" stroke="#6b4b33"
              stroke-width="2" rx="2"/>
        <polygon :points="house.roofPoints" :fill="house.roof" stroke="#4a2f22" stroke-width="2"/>
        <polygon v-for="(ice, ii) in house.icicles" :key="'ice' + ii" :points="ice" fill="#dff1ff" opacity="0.95"/>
        <polygon :points="house.roofSnow" fill="#ffffff"/>
        <rect :x="house.door.x" :y="house.door.y" :width="house.door.w" :height="house.door.h" fill="#7a4a2b" rx="2"/>
        <g v-for="win in house.windows" :key="win.day">
          <circle v-if="win.lit" :cx="win.x + win.w / 2" :cy="win.y + win.h / 2" r="16" fill="url(#advGlow)"
                  :class="{ 'village__halo--fresh': justLit.has(win.day) }"/>
          <rect :x="win.x" :y="win.y" :width="win.w" :height="win.h" rx="1.5"
                :fill="win.lit ? '#ffd45e' : '#33406b'" stroke="#6b4b33" stroke-width="1.5"
                :class="['village__window', { 'is-lit': win.lit, 'is-fresh': justLit.has(win.day) }]"/>
          <line :x1="win.x + win.w / 2" :y1="win.y" :x2="win.x + win.w / 2" :y2="win.y + win.h" stroke="#6b4b33"
                stroke-width="1"/>
          <rect :x="win.x - 2.5" :y="win.y + win.h - 0.5" :width="win.w + 5" height="4" rx="2" fill="#ffffff"/>
        </g>
      </g>

      <g class="village__tree">
        <polygon points="400,92 352,170 448,170" fill="#2f7d4a"/>
        <polygon points="400,120 340,200 460,200" fill="#2a7043"/>
        <polygon points="400,150 330,232 470,232" fill="#256339"/>
        <rect x="390" y="232" width="20" height="10" fill="#6b4b33"/>
        <g v-for="(tier, ti) in villageTree" :key="'vt' + ti">
          <path :d="tier.tinsel" fill="none" stroke="#ffd45e" stroke-width="2.5" stroke-linecap="round"
                stroke-dasharray="1 3.2"/>
          <path :d="tier.garland" fill="none" stroke="#1d4a30" stroke-width="1"/>
          <circle v-for="(ball, bi) in tier.baubles" :key="'vb' + bi" :cx="ball.x" :cy="ball.y" r="4.2"
                  :fill="ball.color"/>
          <circle v-for="(light, li) in tier.lights" :key="'vl' + li" :cx="light.x" :cy="light.y" r="2.4"
                  :fill="light.color" class="village__bulb" :style="{ animationDelay: light.delay + 's' }"/>
        </g>
        <polygon points="400,70 406,86 423,86 409,96 414,112 400,102 386,112 391,96 377,86 394,86"
                 fill="#ffd84d" stroke="#e0a526" stroke-width="1.5"
                 :class="['village__topstar', { 'is-shining': isAllOpened }]"/>
      </g>
      <ellipse cx="400" cy="240" rx="70" ry="9" fill="#ffffff"/>
      <path d="M0,240 C30,228 70,230 100,238 C130,229 170,228 205,238 C240,230 280,226 320,236 C350,232 370,231 400,237 C430,231 470,228 500,237 C540,228 580,230 615,238 C650,229 690,228 720,237 C750,230 780,229 800,234 L800,324 L0,324 Z"
            fill="#cfdcf5"/>
      <path d="M0,243 C30,231 70,233 100,241 C130,232 170,231 205,241 C240,233 280,229 320,239 C350,235 370,234 400,240 C430,234 470,231 500,240 C540,231 580,233 615,241 C650,232 690,231 720,240 C750,233 780,232 800,237 L800,324 L0,324 Z"
            fill="#ffffff"/>
      <path d="M0,252 C90,246 160,250 260,248 S420,244 520,249 S700,246 800,250 L800,324 L0,324 Z" fill="#ffffff"/>
      <path v-for="(sp, si) in driftSparkles" :key="'sp' + si"
            :d="`M${sp[0]},${sp[1] - 3} L${sp[0] + 0.8},${sp[1] - 0.8} L${sp[0] + 3},${sp[1]} L${sp[0] + 0.8},${sp[1] + 0.8} L${sp[0]},${sp[1] + 3} L${sp[0] - 0.8},${sp[1] + 0.8} L${sp[0] - 3},${sp[1]} L${sp[0] - 0.8},${sp[1] - 0.8} Z`"
            fill="#9fd4ff" class="village__star" :style="{ animationDelay: si * 0.45 + 's' }"/>
      <circle v-for="(dot, i) in snowDots" :key="'f' + i" :cx="dot.x" cy="-6" :r="dot.r" fill="#fff"
              class="village__flake" :style="{ animationDuration: dot.duration + 's', animationDelay: dot.delay + 's' }"/>
    </svg>
    <div class="village__snow">
      <div class="village__title">
        <img :src="SnowCoin" alt="" class="village__title-flake">
        <transition name="title" mode="out-in">
          <span :key="title" class="village__title-text">{{ title }}</span>
        </transition>
        <img :src="SnowCoin" alt="" class="village__title-flake">
      </div>
    </div>
  </div>
</template>

<style scoped>
.village {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 6px 0 rgba(26, 33, 64, 0.25);
  flex-shrink: 0;
}

.village__svg {
  display: block;
  width: 100%;
  height: auto;
  max-height: 290px;
}

.village__star {
  animation: twinkle 2.8s ease-in-out infinite;
}

.village__window.is-lit {
  filter: drop-shadow(0 0 3px #ffcc4d);
}

.village__window.is-fresh {
  animation: lightUp 1.4s ease-out 0.4s both;
}

.village__halo--fresh {
  animation: haloPulse 1.6s ease-out 0.4s 2;
}

.village__bulb {
  animation: blink 1.4s ease-in-out infinite;
}

.village__topstar {
  filter: drop-shadow(0 0 4px #ffd84d);
}

.village__topstar.is-shining {
  filter: drop-shadow(0 0 10px #ffd84d);
  animation: blink 2s ease-in-out infinite;
}

.village__smoke {
  transform-box: fill-box;
  transform-origin: center;
  animation: smoke 3.3s ease-out infinite;
  opacity: 0;
}

.village__flake {
  animation: flakeFall 9s linear infinite;
  opacity: 0.85;
}

.village__sleigh {
  animation: sleighFly 28s linear infinite;
}

.village__sleigh-bob {
  animation: sleighBob 1.6s ease-in-out infinite;
}

.village__trail {
  animation: blink 0.9s ease-in-out infinite;
}

/* Заголовок лежит прямо на нарисованном снегу */
.village__snow {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 21%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  pointer-events: none;
}

.village__title {
  display: flex;
  justify-content: space-between;
  width: 270px;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  font-family: "Lilita One", sans-serif;
  font-size: 20px;
  line-height: 1.1;
  letter-spacing: 0.5px;
  color: #ffffff;
  white-space: nowrap;
  background: linear-gradient(180deg, #3aa76d, #2b8a57);
  border-radius: 50px;
  padding: 6px 16px;
  box-shadow: 0 3px 0 #1f6b42;
  text-shadow: 0 1px 0 rgb(0 0 0 / 0.25);
}

.village__title-flake {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  filter: brightness(0) invert(1);
  animation: flakeSpin 6s linear infinite;
}

@keyframes flakeSpin {
  to { transform: rotate(360deg); }
}

.village__title-text {
  flex: 1;
  text-align: center;
}

.title-enter-active, .title-leave-active { transition: opacity 0.18s ease; }
.title-enter-from, .title-leave-to { opacity: 0; }

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.25; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

@keyframes lightUp {
  0% { fill: #33406b; }
  40% { fill: #fff6b0; }
  100% { fill: #ffd45e; }
}

@keyframes haloPulse {
  0% { opacity: 0; transform-box: fill-box; }
  50% { opacity: 1; }
  100% { opacity: 1; }
}

@keyframes smoke {
  0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
  20% { opacity: 0.8; }
  100% { opacity: 0; transform: translate(10px, -34px) scale(2.2); }
}

@keyframes flakeFall {
  0% { transform: translate(0, 0); }
  50% { transform: translate(8px, 135px); }
  100% { transform: translate(-4px, 272px); }
}

@keyframes sleighFly {
  0% { transform: translate(-160px, 96px); }
  32% { transform: translate(860px, 52px); }
  100% { transform: translate(860px, 52px); }
}

@keyframes sleighBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@media (max-width: 767px) {
  .village__svg {
    height: 160px;
  }

  .village__title {
    width: 240px;
    font-size: 16px;
    gap: 6px;
    padding: 5px 12px;
  }

  .village__title-flake {
    width: 12px;
    height: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .village__star, .village__bulb, .village__topstar, .village__smoke, .village__flake, .village__sleigh,
  .village__sleigh-bob, .village__title-flake { animation: none; }
  .village__sleigh { display: none; }
}
</style>
