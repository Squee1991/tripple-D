<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { isSoundEnabled } from '~/utils/soundManager.js'
import SoundBtn from '~/src/components/soundBtn.vue'
import { useEventSessionStore } from '~/store/eventsStore.js'
import adventDays from './adventDays.json'
import SnowClose from '~/assets/images/event-rewards/winter-event/winter-words/snowflake.svg'
import { treeImageUrl, TREE_VIEWBOX, TREE_LIGHTS, TREE_STAR, starPoints } from './adventTree.js'

const props = defineProps({
  questsProgress: { type: Object, default: () => ({}) }
})
// coins-pending: сколько снежинок летит в счётчик (страница пока их не показывает)
// coins-landed: снежинки долетели, можно прибавлять к счётчику
const emit = defineEmits(['start', 'coins-pending', 'coins-landed'])

const { t } = useI18n()
const eventStore = useEventSessionStore()

const wordImages = import.meta.glob('@/assets/images/event-rewards/winter-event/winter-words/*.svg', {
  eager: true,
  query: '?url',
  import: 'default'
})
const imageUrl = (name) => {
  const key = Object.keys(wordImages).find(path => path.endsWith('/' + name))
  return key ? wordImages[key] : ''
}

// Порядок дверей на доске, как в настоящем календаре: номера вперемешку
const BOARD_ORDER = [17, 5, 22, 9, 1, 13, 20, 3, 11, 24, 7, 15, 2, 19, 8, 23, 12, 4, 16, 10, 21, 6, 14, 18]
const SEEN_KEY = 'skillup.advent.seen'

const now = ref(new Date())
let clockTimer = null

const isDone = (day) => !!props.questsProgress?.[`advent-${day}`]?.finished

// Картина под подарками: каждая дверца показывает свой кусок общей ёлки
const treeUrl = treeImageUrl()
const boardRef = ref(null)
const boardSize = ref({ w: 0, h: 0 })
const tileOffsets = ref({})
let boardObserver = null

function measureTiles() {
  const board = boardRef.value
  if (!board) return
  const rect = board.getBoundingClientRect()
  const offsets = {}
  board.querySelectorAll('[data-advent-day]').forEach(door => {
    const inside = door.querySelector('.door__inside')
    if (!inside) return
    const r = inside.getBoundingClientRect()
    offsets[door.dataset.adventDay] = { x: r.left - rect.left, y: r.top - rect.top }
  })
  boardSize.value = { w: rect.width, h: rect.height }
  tileOffsets.value = offsets
}

const tileStyle = (day) => {
  const off = tileOffsets.value[day]
  if (!off || !boardSize.value.w) return {}
  return {
    backgroundImage: `url("${treeUrl}")`,
    backgroundSize: `${boardSize.value.w}px ${boardSize.value.h}px`,
    backgroundPosition: `${-off.x}px ${-off.y}px`
  }
}

const boardStyle = computed(() => {
  if (!isAllOpened.value || !boardSize.value.w) return {}
  return {
    backgroundImage: `url("${treeUrl}")`,
    backgroundSize: `${boardSize.value.w}px ${boardSize.value.h}px`,
    backgroundPosition: '0 0'
  }
})

const treeStarPoints = starPoints(TREE_STAR.x, TREE_STAR.y, TREE_STAR.r)
const treeSparkles = Array.from({ length: 14 }, (_, i) => ({
  x: 150 + ((i * 83) % 300),
  y: 80 + ((i * 131) % 440),
  delay: (i * 0.29) % 2
}))

const isUnlocked = (day) => {
  // Тестовый режим: все окошки и задания доступны сразу, без привязки к дате
  if (eventStore.isTestMode) return true
  const date = now.value
  const month = date.getMonth()
  if (month === 0) return true
  if (month !== 11) return false
  return date.getDate() >= day
}

const days = computed(() => adventDays.map(item => ({
  ...item,
  done: isDone(item.day),
  unlocked: isUnlocked(item.day),
  img: imageUrl(item.image)
})))

const boardDays = computed(() => BOARD_ORDER.map((day, index) => ({
  ...days.value.find(item => item.day === day),
  variant: index % 4
})))

// Сегодняшнее окошко: в декабре по дате, в тестовом режиме первое неоткрытое
const todayDay = computed(() => {
  if (eventStore.isTestMode) {
    return days.value.find(item => !item.done)?.day ?? null
  }
  const date = now.value
  if (date.getMonth() !== 11 || date.getDate() > 24) return null
  const today = days.value.find(item => item.day === date.getDate())
  return today && !today.done ? today.day : null
})
const openedCount = computed(() => days.value.filter(item => item.done).length)
const isAllOpened = computed(() => openedCount.value === 24)

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

const driftSparkles = [[60, 246], [150, 250], [255, 244], [345, 252], [470, 247], [560, 251], [650, 245], [745, 250]]

const snowDots = Array.from({ length: 44 }, (_, i) => ({
  x: (i * 61) % 800,
  r: i % 3 === 0 ? 2.2 : 1.4,
  duration: 7 + (i % 5) * 1.6,
  delay: -((i * 1.7) % 12)
}))

// Колокольчик через Web Audio, файла со звуком в проекте нет
let audioCtx = null
function playBell() {
  try {
    if (!isSoundEnabled()) return
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    audioCtx = audioCtx || new Ctx()
    const start = audioCtx.currentTime
    ;[[1318.5, 0], [1760, 0.09], [2637, 0.18]].forEach(([freq, offset]) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, start + offset)
      gain.gain.exponentialRampToValueAtTime(0.18, start + offset + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 1.1)
      osc.connect(gain).connect(audioCtx.destination)
      osc.start(start + offset)
      osc.stop(start + offset + 1.2)
    })
  } catch (e) {}
}

// Взрыв конфетти и снежинок из открытой дверцы
const burst = ref({ day: null, pieces: [] })
const BURST_COLORS = ['#ffd45e', '#ff5d5d', '#5ddcff', '#7dff8a', '#ffffff', '#c982ff']
function launchBurst(day) {
  const pieces = Array.from({ length: 26 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 26 + Math.random() * 0.4
    const dist = 60 + Math.random() * 70
    return {
      id: i,
      flake: i % 3 === 0,
      color: BURST_COLORS[i % BURST_COLORS.length],
      dx: Math.cos(angle) * dist + 'px',
      dy: Math.sin(angle) * dist - 30 + 'px',
      rot: Math.round(Math.random() * 720 - 360) + 'deg',
      delay: Math.random() * 0.08 + 's'
    }
  })
  burst.value = { day, pieces }
  setTimeout(() => {
    if (burst.value.day === day) burst.value = { day: null, pieces: [] }
  }, 1300)
}

// Монетки летят из дверцы в счётчик в шапке ивента
const flyingCoins = ref([])
function flyCoinsFrom(days) {
  const target = document.querySelector('[data-coin-target]')
  if (!target) {
    emit('coins-landed')
    return
  }
  const to = target.getBoundingClientRect()
  const coins = []
  days.slice(0, 3).forEach((day, dayIndex) => {
    const door = document.querySelector(`[data-advent-day="${day}"]`)
    if (!door) return
    const from = door.getBoundingClientRect()
    for (let i = 0; i < 6; i++) {
      const sx = from.left + from.width / 2 + (Math.random() - 0.5) * from.width * 0.6
      const sy = from.top + from.height / 2 + (Math.random() - 0.5) * from.height * 0.6
      coins.push({
        id: `${day}-${i}`,
        x: sx + 'px',
        y: sy + 'px',
        dx: (to.left + to.width / 2 - sx) + 'px',
        dy: (to.top + to.height / 2 - sy) + 'px',
        delay: dayIndex * 0.25 + i * 0.07 + 's'
      })
    }
  })
  if (!coins.length) {
    emit('coins-landed')
    return
  }
  flyingCoins.value = coins
  setTimeout(() => {
    emit('coins-landed')
    target.classList.remove('is-bump')
    void target.offsetWidth
    target.classList.add('is-bump')
  }, 900)
  setTimeout(() => {
    flyingCoins.value = []
    target.classList.remove('is-bump')
  }, 2200)
}

const justLit = ref(new Set())

function readSeen() {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function markSeen() {
  try {
    const opened = days.value.filter(item => item.done).map(item => item.day)
    localStorage.setItem(SEEN_KEY, JSON.stringify(opened))
  } catch (e) {}
}

// Окна, которые загорелись после последнего визита, вспыхивают
function detectFreshWindows() {
  const seen = new Set(readSeen())
  const fresh = days.value.filter(item => item.done && !seen.has(item.day)).map(item => item.day)
  if (!fresh.length) return
  justLit.value = new Set(fresh)
  markSeen()
  const reward = fresh.reduce((sum, day) => sum + (adventDays.find(item => item.day === day)?.rewardCoins || 0), 0)
  if (reward > 0) emit('coins-pending', reward)
  setTimeout(() => { justLit.value = new Set() }, 3200)
  nextTick(() => {
    setTimeout(() => flyCoinsFrom(fresh), 500)
  })
}

// Пока прогресс не загрузился, подарки рисуются без анимации:
// уже открытые должны появляться открытыми, а не распахиваться при каждом заходе
const animReady = ref(false)
function enableAnimations() {
  if (animReady.value) return
  requestAnimationFrame(() => requestAnimationFrame(() => { animReady.value = true }))
}

watch(() => props.questsProgress, (value) => {
  if (value && Object.keys(value).length) nextTick(enableAnimations)
}, { immediate: true })

watch(() => props.questsProgress, (value) => {
  if (value && Object.keys(value).length) detectFreshWindows()
}, { immediate: true })

const openingDay = ref(null)
const shakingDay = ref(null)
const activeDay = ref(null)
const lockedToast = ref(null)
let toastTimer = null

function onDoorClick(item) {
  animReady.value = true
  if (!item.unlocked) {
    shakingDay.value = item.day
    lockedToast.value = item.day
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { lockedToast.value = null }, 2400)
    setTimeout(() => { shakingDay.value = null }, 500)
    return
  }
  if (item.done) {
    activeDay.value = item
    return
  }
  openingDay.value = item.day
  playBell()
  launchBurst(item.day)
  setTimeout(() => {
    activeDay.value = item
  }, 900)
}

function closeModal() {
  activeDay.value = null
  openingDay.value = null
}

function startTask() {
  if (!activeDay.value) return
  emit('start', `advent-${activeDay.value.day}`)
}

const dayKey = (day, field) => `adventCalendar.days.d${day}.${field}`

onMounted(() => {
  nextTick(measureTiles)
  if (typeof ResizeObserver !== 'undefined' && boardRef.value) {
    boardObserver = new ResizeObserver(() => measureTiles())
    boardObserver.observe(boardRef.value)
  }
  clockTimer = setInterval(() => { now.value = new Date() }, 60000)
})

onBeforeUnmount(() => {
  clearInterval(clockTimer)
  clearTimeout(toastTimer)
  try { audioCtx?.close() } catch (e) {}
  boardObserver?.disconnect()
})
</script>

<template>
  <div class="advent">
    <div class="village" :class="{ 'is-complete': isAllOpened }">
      <svg viewBox="0 44 800 216" preserveAspectRatio="xMidYMax slice" class="village__svg" role="img"
           :aria-label="t('adventCalendar.progress', { count: openedCount })">
        <defs>
          <linearGradient id="advSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#0d1b3d"/>
            <stop offset="1" stop-color="#2b4a8a"/>
          </linearGradient>
          <radialGradient id="advGlow">
            <stop offset="0" stop-color="#ffe9a3" stop-opacity="0.9"/>
            <stop offset="1" stop-color="#ffe9a3" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="800" height="260" fill="url(#advSky)"/>
        <circle v-for="(star, i) in stars" :key="'s' + i" :cx="star.x" :cy="star.y" :r="star.r" fill="#fff"
                class="village__star" :style="{ animationDelay: star.delay + 's' }"/>
        <circle cx="720" cy="42" r="20" fill="#fff6d6"/>
        <circle cx="729" cy="36" r="18" fill="#1a2d5c"/>
        <path d="M0,218 C70,196 130,206 180,214 S290,196 350,210 S470,194 540,208 S660,196 720,210 S780,204 800,206 L800,260 L0,260 Z"
              fill="#c9d9f5" opacity="0.6"/>
        <path d="M0,228 C60,210 120,216 170,224 S270,208 330,220 S450,206 520,218 S650,208 710,220 S780,214 800,216 L800,260 L0,260 Z"
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
        <path d="M0,240 C30,228 70,230 100,238 C130,229 170,228 205,238 C240,230 280,226 320,236 C350,232 370,231 400,237 C430,231 470,228 500,237 C540,228 580,230 615,238 C650,229 690,228 720,237 C750,230 780,229 800,234 L800,260 L0,260 Z"
              fill="#cfdcf5"/>
        <path d="M0,243 C30,231 70,233 100,241 C130,232 170,231 205,241 C240,233 280,229 320,239 C350,235 370,234 400,240 C430,234 470,231 500,240 C540,231 580,233 615,241 C650,232 690,231 720,240 C750,233 780,232 800,237 L800,260 L0,260 Z"
              fill="#ffffff"/>
        <path d="M0,252 C90,246 160,250 260,248 S420,244 520,249 S700,246 800,250 L800,260 L0,260 Z" fill="#eef4ff"/>
        <path v-for="(sp, si) in driftSparkles" :key="'sp' + si"
              :d="`M${sp[0]},${sp[1] - 3} L${sp[0] + 0.8},${sp[1] - 0.8} L${sp[0] + 3},${sp[1]} L${sp[0] + 0.8},${sp[1] + 0.8} L${sp[0]},${sp[1] + 3} L${sp[0] - 0.8},${sp[1] + 0.8} L${sp[0] - 3},${sp[1]} L${sp[0] - 0.8},${sp[1] - 0.8} Z`"
              fill="#9fd4ff" class="village__star" :style="{ animationDelay: si * 0.45 + 's' }"/>
        <circle v-for="(dot, i) in snowDots" :key="'f' + i" :cx="dot.x" cy="-6" :r="dot.r" fill="#fff"
                class="village__flake" :style="{ animationDuration: dot.duration + 's', animationDelay: dot.delay + 's' }"/>
      </svg>
      <div class="village__counter" :title="t('adventCalendar.progress', { count: openedCount })">
        <span class="village__counter-icon">🕯️</span>
        <span>{{ openedCount }} / 24</span>
      </div>
    </div>

    <div ref="boardRef" :class="['board', { 'is-complete': isAllOpened, 'is-instant': !animReady }]" :style="boardStyle">
      <button
          v-for="item in boardDays"
          :key="item.day"
          type="button"
          :data-advent-day="item.day"
          :class="['door', `--v${item.variant}`, {
            'is-big': item.day === 24,
            'is-locked': !item.unlocked,
            'is-ready': item.unlocked && !item.done,
            'is-today': todayDay === item.day && openingDay !== item.day,
            'is-open': item.done || openingDay === item.day,
            'is-opening': openingDay === item.day,
            'is-shaking': shakingDay === item.day
          }]"
          :aria-label="String(item.day)"
          @click="onDoorClick(item)"
      >
        <span class="door__inside" :style="isAllOpened ? tileStyle(item.day) : null">
          <img v-if="item.img && !isAllOpened" :src="item.img" alt="" class="door__img"/>
        </span>
        <span class="gift">
          <span class="gift__body">
            <span class="gift__ribbon gift__ribbon--v"></span>
            <span class="gift__ribbon gift__ribbon--h"></span>
            <span class="gift__tag">{{ item.day }}</span>
            <span v-if="!item.unlocked" class="gift__lock">❄</span>
          </span>
          <span class="gift__lid">
            <span class="gift__ribbon gift__ribbon--v"></span>
            <span class="gift__snow"></span>
            <span class="gift__bow"><i></i><i></i><b></b></span>
          </span>
        </span>
        <template v-if="todayDay === item.day && openingDay !== item.day">
          <span class="door__today">Heute!</span>
          <span v-for="n in 3" :key="'sp' + n" :class="['door__sparkle', `--s${n}`]">✦</span>
        </template>
        <span v-if="burst.day === item.day" class="door__burst" aria-hidden="true">
          <span v-for="piece in burst.pieces" :key="piece.id"
                :class="['burst-piece', { '--flake': piece.flake }]"
                :style="{ '--dx': piece.dx, '--dy': piece.dy, '--rot': piece.rot, color: piece.color, background: piece.flake ? 'none' : piece.color, animationDelay: piece.delay }">
            <template v-if="piece.flake">❄</template>
          </span>
        </span>
      </button>
      <svg v-if="isAllOpened" class="tree-glow" :viewBox="TREE_VIEWBOX" preserveAspectRatio="xMidYMid slice"
           aria-hidden="true">
        <defs>
          <filter id="treeGlowBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
          <radialGradient id="treeHalo">
            <stop offset="0" stop-color="#fff3c4" stop-opacity="0.55"/>
            <stop offset="1" stop-color="#fff3c4" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="300" cy="320" r="270" fill="url(#treeHalo)" class="tree-glow__halo"/>
        <g v-for="(light, li) in TREE_LIGHTS" :key="'tl' + li" class="tree-glow__light"
           :style="{ animationDelay: light.delay + 's' }">
          <circle :cx="light.x" :cy="light.y" r="11" :fill="light.color" filter="url(#treeGlowBlur)"/>
          <circle :cx="light.x" :cy="light.y" r="5.5" :fill="light.color"/>
        </g>
        <polygon :points="treeStarPoints" fill="#ffe27a" filter="url(#treeGlowBlur)" class="tree-glow__star"/>
        <polygon :points="treeStarPoints" fill="#ffd45e" stroke="#fff3c4" stroke-width="2"/>
        <text v-for="(sp, si) in treeSparkles" :key="'ts' + si" :x="sp.x" :y="sp.y" class="tree-glow__sparkle"
              :style="{ animationDelay: sp.delay + 's' }">✦</text>
      </svg>
    </div>

    <Teleport to="body">
      <img v-for="coin in flyingCoins" :key="coin.id" :src="SnowClose" alt="" class="fly-coin"
           :style="{ left: coin.x, top: coin.y, '--dx': coin.dx, '--dy': coin.dy, animationDelay: coin.delay }"/>
    </Teleport>

    <transition name="toast">
      <div v-if="lockedToast" class="advent-toast">
        <strong>{{ t('adventCalendar.lockedTitle') }}</strong>
        {{ t('adventCalendar.lockedText', { day: lockedToast }) }}
      </div>
    </transition>

    <transition name="modal">
      <div v-if="activeDay" class="day-modal" @click.self="closeModal">
        <div class="day-modal__card">
          <div class="day-modal__head">
            <div class="day-modal__ribbon">{{ activeDay.day }}. Dezember</div>
            <button class="day-modal__close" type="button" :aria-label="t('adventCalendar.close')" @click="closeModal">
              <img :src="SnowClose" alt="">
            </button>
          </div>
          <div class="day-modal__label">{{ t('adventCalendar.wordOfDay') }}</div>
          <div class="day-modal__bauble">
            <span class="day-modal__bauble-cap"></span>
            <img v-if="activeDay.img" :src="activeDay.img" alt="" class="day-modal__img"/>
          </div>
          <div class="day-modal__word">
            <span :class="['day-modal__article', `--${activeDay.article}`]">{{ activeDay.article }}</span>
            <span>{{ activeDay.word }}</span>
            <SoundBtn :text="`${activeDay.article} ${activeDay.word}`"/>
          </div>
          <div class="day-modal__translation">{{ t(dayKey(activeDay.day, 'word')) }}</div>
          <div class="day-modal__example">
            <div class="day-modal__example-de">
              <span>{{ activeDay.example }}</span>
              <SoundBtn :text="activeDay.example"/>
            </div>
            <div class="day-modal__example-tr">{{ t(dayKey(activeDay.day, 'example')) }}</div>
          </div>
          <div class="day-modal__fact">
            <div class="day-modal__fact-title">🎄 {{ t('adventCalendar.didYouKnow') }}</div>
            <p>{{ t(dayKey(activeDay.day, 'fact')) }}</p>
          </div>
          <button type="button" :class="['day-modal__btn', { '--repeat': activeDay.done }]" @click="startTask">
            {{ activeDay.done ? t('adventCalendar.repeat') : t('adventCalendar.start') }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.advent {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 20px;
}

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
  max-height: 230px;
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

.village__counter {
  position: absolute;
  left: 10px;
  top: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(180deg, #3aa76d, #2b8a57);
  color: #fff;
  font-family: "Lilita One", sans-serif;
  font-size: 18px;
  letter-spacing: 0.5px;
  border-radius: 50px;
  padding: 4px 12px;
  box-shadow: 0 3px 0 #1f6b42;
  text-shadow: 0 1px 0 rgb(0 0 0 / 0.25);
}

.village__counter-icon {
  font-size: 15px;
}


/* Все 24 подарка одинаковые, по 4 в ряд */
.board {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px 12px;
  padding-top: 18px;
  width: 100%;
  margin: 0 auto;
}

.door {
  position: relative;
  aspect-ratio: 1 / 1;
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
  font-family: "Fredoka", "Nunito", sans-serif;
  -webkit-tap-highlight-color: transparent;
}


.door.is-opening {
  z-index: 5;
}

/* Что лежит внутри подарка */
.door__inside {
  position: absolute;
  inset: 4% 4% 0;
  border-radius: 12px;
  background-color: #e6f1ff;
  background-image: radial-gradient(circle at 50% 40%, #ffffff 0%, #e6f1ff 55%, #c9ddf7 100%);
  background-repeat: no-repeat;
  box-shadow: inset 0 0 0 3px #ffffff, inset 0 4px 10px rgb(31 58 107 / 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}

.door__img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.door.is-opening .door__img {
  animation: popIn 0.55s cubic-bezier(0.3, 1.6, 0.5, 1) 0.25s both;
}

/* В финале под подарками вместо картинок слов проявляется общая ёлка */
.board.is-complete .door__inside {
  animation: revealPiece 0.9s ease-out both;
}

/* Собранная ёлка: рамки между кусочками растворяются */
.board.is-complete {
  position: relative;
  border-radius: 16px;
  box-shadow: 0 6px 0 rgb(31 58 107 / 0.15), 0 0 30px rgb(255 226 122 / 0.45);
}

.board.is-complete .door__inside {
  box-shadow: none;
  border-radius: 0;
  transition: box-shadow 1.2s ease, border-radius 1.2s ease;
}


.tree-glow {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: 16px;
  animation: glowIn 1.6s ease-out 0.6s both;
}

.tree-glow__halo {
  animation: haloBreath 3.5s ease-in-out infinite;
  transform-origin: 300px 320px;
}

.tree-glow__light {
  animation: lightTwinkle 1.6s ease-in-out infinite;
}

.tree-glow__star {
  animation: starPulse 2.2s ease-in-out infinite;
  transform-origin: 300px 92px;
}

.tree-glow__sparkle {
  fill: #fff7d1;
  font-size: 18px;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes revealPiece {
  0% { filter: brightness(2.2) saturate(0.4); }
  100% { filter: brightness(1) saturate(1); }
}

@keyframes glowIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes haloBreath {
  0%, 100% { opacity: 0.6; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes lightTwinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

@keyframes starPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.25); }
}


/* Коробка-подарок */
.gift {
  position: absolute;
  inset: 0;
  --box: #d83a34;
  --box-dark: #a3241f;
  --ribbon: #f6d27a;
  --ribbon-dark: #c99a2e;
  --pattern: repeating-linear-gradient(45deg, rgb(255 255 255 / 0.10) 0 6px, transparent 6px 14px);
}

.door.--v1 .gift {
  --box: #2f8a4f;
  --box-dark: #1d5e33;
  --ribbon: #e34b44;
  --ribbon-dark: #a8302a;
  --pattern: radial-gradient(circle, rgb(255 255 255 / 0.22) 2px, transparent 2.5px) 0 0 / 12px 12px;
}

.door.--v2 .gift {
  --box: #e9b42c;
  --box-dark: #b5850f;
  --ribbon: #d23a34;
  --ribbon-dark: #9b2420;
  --pattern: repeating-linear-gradient(90deg, rgb(255 255 255 / 0.14) 0 4px, transparent 4px 12px);
}

.door.--v3 .gift {
  --box: #3f6db8;
  --box-dark: #284d8c;
  --ribbon: #eef3ff;
  --ribbon-dark: #b9c6e4;
  --pattern: radial-gradient(circle, rgb(255 255 255 / 0.35) 1.5px, transparent 2px) 0 0 / 10px 10px;
}

.door.is-big .gift {
  --box: #d83a34;
  --box-dark: #a3241f;
  --ribbon: #ffd45e;
  --ribbon-dark: #c99a2e;
  --pattern: radial-gradient(circle, rgb(255 236 160 / 0.45) 1.5px, transparent 2px) 0 0 / 9px 9px;
}

.gift__body {
  position: absolute;
  left: 6%;
  right: 6%;
  top: 26%;
  bottom: 0;
  border-radius: 6px 6px 10px 10px;
  background: var(--pattern), linear-gradient(180deg, var(--box), var(--box-dark));
  box-shadow: 0 5px 0 rgb(0 0 0 / 0.28);
  transform-origin: 50% 100%;
  transition: transform 0.45s ease-in 0.15s, opacity 0.35s ease-in 0.2s;
}

.gift__lid {
  position: absolute;
  left: 0;
  right: 0;
  top: 12%;
  height: 18%;
  border-radius: 6px;
  background: var(--pattern), linear-gradient(180deg, var(--box), var(--box-dark));
  box-shadow: 0 3px 0 rgb(0 0 0 / 0.25);
  transform-origin: 30% 100%;
  transition: transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.5s ease 0.15s;
  z-index: 2;
}

.gift__ribbon {
  position: absolute;
  background: linear-gradient(90deg, var(--ribbon-dark), var(--ribbon) 40%, var(--ribbon-dark));
}

.gift__ribbon--v {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 16%;
  transform: translateX(-50%);
}

.gift__ribbon--h {
  left: 0;
  right: 0;
  top: 42%;
  height: 16%;
  background: linear-gradient(180deg, var(--ribbon-dark), var(--ribbon) 40%, var(--ribbon-dark));
}

.gift__snow {
  position: absolute;
  left: -3%;
  right: -3%;
  top: -22%;
  height: 46%;
  background: #fff;
  border-radius: 10px 10px 6px 6px;
  clip-path: polygon(0 40%, 8% 15%, 20% 30%, 34% 5%, 48% 28%, 62% 8%, 76% 30%, 90% 12%, 100% 38%, 100% 100%, 0 100%);
  box-shadow: inset 0 -2px 0 #dbe7ff;
}

.gift__bow {
  position: absolute;
  left: 50%;
  bottom: 70%;
  width: 54%;
  height: 90%;
  transform: translateX(-50%);
}

.gift__bow i {
  position: absolute;
  bottom: 0;
  width: 46%;
  height: 100%;
  border: 3px solid var(--ribbon-dark);
  background: var(--ribbon);
  border-radius: 50% 50% 10% 50%;
}

.gift__bow i:first-child {
  left: 2%;
  transform: rotate(-30deg);
  transform-origin: 100% 100%;
}

.gift__bow i:nth-child(2) {
  right: 2%;
  transform: rotate(30deg) scaleX(-1);
  transform-origin: 0 100%;
}

.gift__bow b {
  position: absolute;
  left: 50%;
  bottom: -10%;
  width: 26%;
  height: 40%;
  transform: translateX(-50%);
  border-radius: 40%;
  background: var(--ribbon);
  border: 2px solid var(--ribbon-dark);
}

.gift__tag {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 34px;
  height: 34px;
  padding: 0 4px;
  border-radius: 50%;
  background: #fffaf0;
  color: var(--box-dark);
  border: 2px solid var(--ribbon-dark);
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 0 rgb(0 0 0 / 0.2);
}


.gift__lock {
  position: absolute;
  right: 6px;
  bottom: 4px;
  color: #fff;
  font-size: 13px;
  text-shadow: 0 1px 0 rgb(0 0 0 / 0.3);
}

.door.is-locked .gift {
  filter: saturate(0.4) brightness(0.8);
}

.door.is-locked {
  cursor: not-allowed;
}

/* Открытие: крышка улетает, коробка проваливается */
.door.is-open .gift__lid {
  transform: translate(10%, -150%) rotate(-32deg);
  opacity: 0;
}

.door.is-open .gift__body {
  transform: scale(0.6, 0.1);
  opacity: 0;
}

.door.is-open .gift {
  pointer-events: none;
}

/* До загрузки прогресса без переходов, чтобы пройденные окошки не открывались заново при каждом заходе */
.board.is-instant .gift__lid,
.board.is-instant .gift__body,
.board.is-instant .door__inside {
  transition: none !important;
  animation: none !important;
}

.door.is-shaking .gift {
  animation: shake 0.45s ease-in-out;
}

/* Сегодняшнее окошко */
.door.is-today .gift {
  animation: todayHop 3.2s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgb(255 216 77 / 0.85));
}

.door__today {
  position: absolute;
  left: 50%;
  top: -14px;
  transform: translateX(-50%) rotate(-6deg);
  background: #ffd45e;
  color: #8e2a24;
  font-weight: 700;
  font-size: 13px;
  border-radius: 999px;
  padding: 2px 9px;
  box-shadow: 0 2px 0 #c79a1e;
  z-index: 4;
  white-space: nowrap;
}

.door__sparkle {
  position: absolute;
  color: #ffe9a3;
  font-size: 14px;
  text-shadow: 0 0 6px #ffd45e;
  animation: sparkle 1.8s ease-in-out infinite;
  z-index: 4;
  pointer-events: none;
}

.door__sparkle.--s1 { left: -6px; top: 20%; }
.door__sparkle.--s2 { right: -6px; top: 40%; animation-delay: 0.6s; }
.door__sparkle.--s3 { left: 30%; bottom: -8px; animation-delay: 1.2s; }

/* Конфетти и снежинки */
.door__burst {
  position: absolute;
  left: 50%;
  top: 40%;
  width: 0;
  height: 0;
  z-index: 6;
  pointer-events: none;
}

.burst-piece {
  position: absolute;
  left: -4px;
  top: -3px;
  width: 8px;
  height: 6px;
  border-radius: 2px;
  animation: burstFly 1.1s cubic-bezier(0.15, 0.7, 0.3, 1) forwards;
}

.burst-piece.--flake {
  width: auto;
  height: auto;
  font-size: 14px;
  line-height: 1;
}

/* Монетки в счётчик */
.fly-coin {
  position: fixed;
  width: 22px;
  height: 22px;
  margin: -11px 0 0 -11px;
  z-index: 2000;
  pointer-events: none;
  animation: coinFly 0.9s cubic-bezier(0.5, -0.3, 0.7, 0.4) both;
  filter: drop-shadow(0 0 4px rgb(160 220 255 / 0.9));
}

@keyframes todayHop {
  0%, 70%, 100% { transform: translateY(0) rotate(0); }
  76% { transform: translateY(-9px) rotate(-3deg); }
  82% { transform: translateY(0) rotate(2deg); }
  88% { transform: translateY(-4px) rotate(0); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0.4) rotate(0); }
  50% { opacity: 1; transform: scale(1.2) rotate(90deg); }
}

@keyframes burstFly {
  0% { transform: translate(0, 0) rotate(0); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: translate(var(--dx), calc(var(--dy) + 40px)) rotate(var(--rot)); opacity: 0; }
}

@keyframes coinFly {
  0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
  15% { transform: translate(0, -18px) scale(1.15); opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0.7); opacity: 0; }
}

.advent-toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  z-index: 300;
  background: #1A2140;
  color: #fff;
  border-radius: 50px;
  padding: 12px 18px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  gap: 8px;
  max-width: calc(100% - 32px);
}

.advent-toast strong { color: #ffd45e; }

/* Карточка дня выезжает снизу шторкой, как фидбек в заданиях */
.day-modal {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(8, 16, 36, 0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.day-modal__card {
  position: relative;
  width: 100%;
  max-width: 560px;
  max-height: calc(100dvh - 24px);
  overflow-y: auto;
  overscroll-behavior: contain;
  background: linear-gradient(180deg, #1f3c73 0%, #152b55 100%);
  border-top: 3px solid #3aa76d;
  border-radius: 26px 26px 0 0;
  padding: 26px 16px calc(20px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  font-family: "Nunito", sans-serif;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.35);
}

.day-modal__head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.day-modal__close {
  border: none;
  background: none;
  width: 42px;
  height: 42px;
  padding: 4px;
  cursor: pointer;
  transition: transform 0.3s;
}

.day-modal__close img {
  width: 100%;
  height: 100%;
}

.day-modal__close:hover {
  transform: rotate(90deg);
}

.day-modal__ribbon {
  position: relative;
  background: linear-gradient(180deg, #d8463f, #b5352f);
  color: #fff;
  font-weight: 800;
  border-radius: 999px;
  padding: 5px 16px;
  font-family: "Fredoka", "Nunito", sans-serif;
  box-shadow: 0 3px 0 #8e2a24;
}

.day-modal__label {
  color: #9fc4ff;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.08em;
}

/* Картинка слова внутри ёлочного шара */
.day-modal__bauble {
  position: relative;
  width: 132px;
  height: 132px;
  margin-top: 12px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffffff 0%, #e3f0ff 45%, #b9d3f5 100%);
  box-shadow: 0 0 0 4px rgb(255 255 255 / 0.15), 0 0 26px rgb(143 211 255 / 0.45), inset -8px -10px 18px rgb(31 58 107 / 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: baubleSwing 4s ease-in-out infinite;
  transform-origin: 50% -14px;
}

.day-modal__bauble-cap {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 14px;
  border-radius: 4px 4px 2px 2px;
  background: linear-gradient(90deg, #8a94a8, #e6ebf3 45%, #8a94a8);
}

.day-modal__bauble-cap::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  border: 2px solid #c3cbd8;
  border-radius: 50%;
}

.day-modal__img {
  width: 86px;
  height: 86px;
  object-fit: contain;
  animation: popIn 0.5s cubic-bezier(0.3, 1.5, 0.5, 1);
}

.day-modal__word {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 30px;
  font-weight: 900;
  color: #fff;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 4px;
}

.day-modal__article { font-weight: 800; }
.day-modal__article.--der { color: #7fb2ff; }
.day-modal__article.--die { color: #ff8a80; }
.day-modal__article.--das { color: #7ee09a; }

.day-modal__translation {
  color: #a8f0c6;
  font-size: 18px;
  font-weight: 700;
  margin-top: -4px;
}

.day-modal__example {
  width: 100%;
  background: rgb(255 255 255 / 0.1);
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: 16px;
  padding: 10px 12px;
}

.day-modal__example-de {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
  color: #fff;
}

.day-modal__example-tr {
  color: #c9d6f2;
  font-size: 14px;
  margin-top: 4px;
}

.day-modal__fact {
  width: 100%;
  background: rgb(58 167 109 / 0.18);
  border: 1px solid rgb(126 224 154 / 0.3);
  border-radius: 16px;
  padding: 10px 12px;
  text-align: left;
}

.day-modal__fact-title {
  font-weight: 900;
  color: #a8f0c6;
  margin-bottom: 4px;
}

.day-modal__fact p {
  color: #ffffff;
  font-weight: 600;
  line-height: 1.4;
}

.day-modal__btn {
  width: 100%;
  margin-top: 6px;
  border: none;
  border-radius: 50px;
  padding: 14px;
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-family: "Nunito", sans-serif;
  color: #fff;
  background: linear-gradient(180deg, #3aa76d, #2b8a57);
  box-shadow: 0 4px 0 #1f6b42;
  text-shadow: 0 1px 0 rgb(0 0 0 / 0.2);
  cursor: pointer;
}

.day-modal__btn:active {
  transform: translateY(2px);
  box-shadow: none;
}

.day-modal__btn.--repeat {
  background: linear-gradient(180deg, #d8463f, #b5352f);
  box-shadow: 0 4px 0 #8e2a24;
}

@keyframes baubleSwing {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

.toast-enter-active, .toast-leave-active { transition: opacity 0.25s, transform 0.25s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 12px); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .day-modal__card { transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1); }
.modal-leave-active .day-modal__card { transition: transform 0.25s ease-in; }
.modal-enter-from .day-modal__card, .modal-leave-to .day-modal__card { transform: translateY(100%); }

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

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-5px) rotate(-2deg); }
  40% { transform: translateX(5px) rotate(2deg); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(3px); }
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

@keyframes popIn {
  0% { transform: scale(0.3); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 767px) {
  .village__svg {
    height: 128px;
  }

  .board {
    gap: 14px 8px;
    padding-top: 12px;
  }

  .gift__tag { font-size: 15px; min-width: 26px; height: 26px; padding: 0 3px; border-width: 1.5px; }
  .gift__lock { font-size: 10px; right: 3px; bottom: 2px; }
  .gift__bow i { border-width: 2px; }
  .door__today { font-size: 10px; top: -10px; padding: 1px 6px; }
  .door__sparkle { font-size: 10px; }

}

@media (prefers-reduced-motion: reduce) {
  .village__star, .village__bulb, .village__topstar, .village__smoke, .village__flake, .village__sleigh,
  .village__sleigh-bob, .door.is-today .gift, .door__sparkle { animation: none; }
  .village__sleigh { display: none; }
  .gift__lid, .gift__body { transition: none; }
  .tree-glow__halo, .tree-glow__light, .tree-glow__star, .tree-glow__sparkle,
  .day-modal__bauble { animation: none; }
}
</style>
