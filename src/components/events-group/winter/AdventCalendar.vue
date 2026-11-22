<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { isSoundEnabled } from '~/utils/soundManager.js'
import SoundBtn from '~/src/components/soundBtn.vue'
import { useEventSessionStore } from '~/store/eventsStore.js'
import adventDays from './adventDays.json'
import SnowClose from '~/assets/images/event-rewards/winter-event/winter-words/snowflake.svg'
import LockedGift from '~/assets/images/mery-christmas/Present.svg'
import { treeImageUrl, TREE_VIEWBOX, TREE_LIGHTS, TREE_STAR, starPoints } from './adventTree.js'

const props = defineProps({
  questsProgress: { type: Object, default: () => ({}) }
})
// coins-pending: сколько снежинок летит в счётчик (страница пока их не показывает)
// coins-landed: снежинки долетели, можно прибавлять к счётчику
const emit = defineEmits(['start', 'coins-pending', 'coins-landed', 'fresh-windows'])

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

// Окошко N открывается N декабря; в январе (до конца ивента) открыты все, чтобы догнать пропущенное.
const isUnlocked = (day) => {
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

// Сегодняшнее окошко: в декабре по дате
const todayDay = computed(() => {
  const date = now.value
  if (date.getMonth() !== 11 || date.getDate() > 24) return null
  const today = days.value.find(item => item.day === date.getDate())
  return today && !today.done ? today.day : null
})
const openedCount = computed(() => days.value.filter(item => item.done).length)
const isAllOpened = computed(() => openedCount.value === 24)

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
  emit('fresh-windows', fresh)
  markSeen()
  const reward = fresh.reduce((sum, day) => sum + (adventDays.find(item => item.day === day)?.rewardCoins || 0), 0)
  if (reward > 0) emit('coins-pending', reward)
  setTimeout(() => {
    justLit.value = new Set()
    emit('fresh-windows', [])
  }, 3200)
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
const lockedDay = ref(null)

function onDoorClick(item) {
  animReady.value = true
  if (!item.unlocked) {
    shakingDay.value = item.day
    lockedDay.value = item.day
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
  try { audioCtx?.close() } catch (e) {}
  boardObserver?.disconnect()
})
</script>

<template>
  <div class="advent">
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

    <!-- Окна в body: внутри прокручиваемой вкладки iOS Safari обрезает position: fixed -->
    <Teleport to="body">
    <transition name="modal">
      <div v-if="lockedDay" class="day-modal" @click.self="lockedDay = null">
        <div class="day-modal__card locked-sheet">
          <div class="day-modal__head">
            <div class="day-modal__ribbon">{{ lockedDay }}. Dezember</div>
            <button class="day-modal__close" type="button" :aria-label="t('adventCalendar.close')" @click="lockedDay = null">
              <img :src="SnowClose" alt="">
            </button>
          </div>
          <div class="day-modal__bauble">
            <span class="day-modal__bauble-cap"></span>
            <img :src="LockedGift" alt="" class="day-modal__img"/>
          </div>
          <div class="locked-sheet__title">{{ t('adventCalendar.lockedTitle') }}</div>
          <p class="locked-sheet__text">{{ t('adventCalendar.lockedText', { day: lockedDay }) }}</p>
          <button type="button" class="day-modal__btn" @click="lockedDay = null">{{ t('adventCalendar.lockedOk') }}</button>
        </div>
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
    </Teleport>
  </div>
</template>

<style scoped>
.advent {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 10px;
}


/* Все 24 подарка одинаковые, по 4 в ряд */
.board {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px 22px;
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

/* Закрытые окошки чуть приглушены, чтобы открытое сегодня выделялось, но цвета подарков оставались праздничными */
.door.is-locked .gift {
  filter: saturate(0.8) brightness(0.94);
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

.locked-sheet__title {
  font-family: "Lilita One", sans-serif;
  font-size: 28px;
  letter-spacing: 0.5px;
  color: #ffffff;
  text-align: center;
  text-shadow: 0 2px 0 rgb(0 0 0 / 0.18);
}

.locked-sheet__text {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
  color: rgb(255 255 255 / 0.85);
  text-align: center;
  line-height: 1.4;
}


/* Карточка дня выезжает снизу шторкой, как фидбек в заданиях */
.day-modal {
  position: fixed;
  inset: 0;
  z-index: 19000;
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
  .board {
    gap: 20px 16px;
    padding-top: 12px;
  }

  .gift__tag { font-size: 15px; min-width: 26px; height: 26px; padding: 0 3px; border-width: 1.5px; }
  .gift__lock { font-size: 10px; right: 3px; bottom: 2px; }
  .gift__bow i { border-width: 2px; }
  .door__today { font-size: 10px; top: -10px; padding: 1px 6px; }
  .door__sparkle { font-size: 10px; }

}

@media (prefers-reduced-motion: reduce) {
  .door.is-today .gift, .door__sparkle { animation: none; }
  .gift__lid, .gift__body { transition: none; }
  .tree-glow__halo, .tree-glow__light, .tree-glow__star, .tree-glow__sparkle,
  .day-modal__bauble { animation: none; }
}
</style>
