<template>
  <!-- Мультяшная карта раздела: земли стоят островками вдоль извилистой дороги -->
  <div ref="root" class="lands-map" :class="['lands-map--' + theme, 'road-theme--' + theme, prevTheme && 'lands-map--from-' + prevTheme]" :style="{ height: mapHeight + 'px' }">
    <!-- дорога своего цвета у каждого уровня: тень, обводка, полотно, блик и разметка; открытый путь яркий, закрытый приглушённый -->
    <svg class="lands-map__road" :viewBox="`0 0 ${mapWidth} ${mapHeight}`" aria-hidden="true">
      <defs v-if="handover">
        <clipPath :id="handover.clipId">
          <rect x="0" y="0" :width="mapWidth" :height="GATE_Y"/>
        </clipPath>
      </defs>
      <path :d="fullPath" class="road road--shadow" transform="translate(0 5)"/>
      <path :d="fullPath" class="road road--edge"/>
      <path
          v-for="seg in segments"
          :key="'s' + seg.key"
          :d="seg.d"
          class="road road--surface"
          :class="{ 'road--locked': !seg.open }"
      />
      <path v-for="seg in segments" :key="'h' + seg.key" :d="seg.d" class="road road--shine" :class="{ 'road--locked': !seg.open }"/>
      <path
          v-for="seg in segments"
          :key="'m' + seg.key"
          :d="seg.d"
          class="road road--dash"
          :class="{ 'road--dash-open': seg.open, 'road--locked': !seg.open }"
      />
      <!-- до медали дорога ещё цвета прошлого уровня: цвет меняется под медалью -->
      <g v-if="handover" :clip-path="`url(#${handover.clipId})`" :class="'road-theme--' + prevTheme">
        <path :d="handover.seg.d" class="road road--edge"/>
        <path :d="handover.seg.d" class="road road--surface" :class="{ 'road--locked': !handover.seg.open }"/>
        <path :d="handover.seg.d" class="road road--shine" :class="{ 'road--locked': !handover.seg.open }"/>
        <path :d="handover.seg.d" class="road road--dash" :class="{ 'road--dash-open': handover.seg.open, 'road--locked': !handover.seg.open }"/>
      </g>
    </svg>

    <!-- рубеж нового уровня: медаль на дороге; кольцо вокруг неё показывает, сколько земель уровня открыто -->
    <div v-if="isNewLevel" class="level-gate" :style="{ top: GATE_Y + 'px' }">
      <span class="level-gate__medal">
        <span class="level-gate__code">
          {{ theme.toUpperCase() }}
          <svg v-if="levelProgress.total" class="level-gate__ring" viewBox="0 0 60 60" aria-hidden="true">
            <circle cx="30" cy="30" r="26" class="level-gate__ring-base"/>
            <circle cx="30" cy="30" r="26" class="level-gate__ring-track"/>
            <circle
                v-if="levelProgress.open"
                cx="30" cy="30" r="26"
                class="level-gate__ring-fill"
                :stroke-dasharray="RING_LEN"
                :stroke-dashoffset="RING_LEN * (1 - levelProgress.open / levelProgress.total)"
            />
          </svg>
        </span>
        <span class="level-gate__ribbon">
          {{ t(`locationsMenu.level${theme.toUpperCase()}`) }}<template v-if="levelProgress.total"> · {{ levelProgress.open }}/{{ levelProgress.total }}</template>
        </span>
      </span>
    </div>

    <!-- земли -->
    <button
        v-for="(node, index) in nodes"
        :key="node.region.id"
        type="button"
        class="land-node"
        :class="{
          'land-node--active': node.region.id === activeId,
          'land-node--locked': isLocked(node.region)
        }"
        :style="{ left: node.x + '%', top: node.y + 'px', '--delay': (index * 0.35) + 's' }"
        :data-track="'region_card_clicked_' + node.region.id"
        @click="$emit('select', node.region)"
    >
      <span class="land-node__base" aria-hidden="true"></span>
      <span class="land-node__island">
        <img class="land-node__img" :src="node.region.icon" :alt="t(node.region.name)" decoding="async">
      </span>
      <span v-if="isLocked(node.region)" class="land-node__lock">🔒 {{ needLevel(node.region) }}</span>
      <span class="land-node__label" :class="'land-node__label--' + node.side">{{ t(node.region.name) }}</span>
    </button>

    <!-- итоговый тест уровня: стоит на дороге сразу за вершиной -->
    <button
        v-if="testLevel"
        type="button"
        class="test-node"
        :class="{ 'test-node--open': testOpen }"
        :style="{ top: testY + 'px' }"
        :data-track="'map_location_test_' + testLevel"
        @click="$emit('test', testLevel)"
    >
      <span class="test-node__base" aria-hidden="true"></span>
      <span class="test-node__scroll">
        <span class="test-node__title">{{ t('locationTest.title', { level: testLevel }) }}</span>
        <span class="test-node__sub">{{ t('locationTest.mapHint') }}</span>
        <span class="test-node__seal" aria-hidden="true">
          <template v-if="testOpen">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 13 10 18 19 7"></polyline></svg>
          </template>
          <template v-else>🔒</template>
        </span>
      </span>
    </button>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  regions: { type: Array, default: () => [] },
  activeId: { type: String, default: '' },
  // a1 / a2 / b1: цвет земли и украшения
  theme: { type: String, default: 'a1' },
  // уровень раздела выше: от его цвета плавно начинается этот раздел
  prevTheme: { type: String, default: '' },
  // последний раздел карты: дорога заканчивается на последней земле, внизу без запаса
  isLast: { type: Boolean, default: false },
  // сколько земель уровня открыто: кольцо вокруг медали
  levelProgress: { type: Object, default: () => ({ open: 0, total: 0 }) },
  // итоговый тест в конце этого раздела: уровень или пусто; testOpen = уровень пройден
  testLevel: { type: String, default: '' },
  testOpen: { type: Boolean, default: false },
  isLocked: { type: Function, default: () => false },
  needLevel: { type: Function, default: () => 0 }
})
defineEmits(['select', 'test'])

const { t } = useI18n()

// расстояние между землями по вертикали и отступы карты
const ROW = 112
const TOP = 80
// раздел нового уровня начинается с ворот, поэтому земли опускаются ниже
const GATE_TOP = 196
const GATE_Y = 84
const RING_LEN = 2 * Math.PI * 26
// медаль стоит в начале карты (первый уровень) и там, где начинается следующий уровень
const isNewLevel = computed(() => !props.prevTheme || props.prevTheme !== props.theme)
const top = computed(() => isNewLevel.value ? GATE_TOP : TOP)
const BOTTOM = 50
// змейка: центр, справа, центр, слева
const X_PATTERN = [50, 70, 50, 30]

// подпись стоит сбоку от земли, там где больше места; дорога входит сверху и уходит вниз, бока свободны
const LABEL_SIDE = ['left', 'left', 'right', 'right']

const nodes = computed(() => props.regions.map((region, i) => ({
  region,
  x: X_PATTERN[i % X_PATTERN.length],
  y: top.value + i * ROW,
  side: LABEL_SIDE[i % LABEL_SIDE.length]
})))

// под последней землёй последнего раздела оставляем место только для подписи
const TEST_ROW = 126
const testY = computed(() => top.value + Math.max(props.regions.length - 1, 0) * ROW + TEST_ROW)
const lastY = computed(() => props.testLevel ? testY.value + 40 : top.value + Math.max(props.regions.length - 1, 0) * ROW)
const mapHeight = computed(() => lastY.value + (props.isLast ? 70 : BOTTOM + 40))

// реальная ширина карты в пикселях: дорога рисуется без растяжения, изгибы ровные
const root = ref(null)
const mapWidth = ref(360)
let observer = null
onMounted(() => {
  if (!root.value) return
  mapWidth.value = root.value.clientWidth || 360
  if (typeof ResizeObserver === 'undefined') return
  observer = new ResizeObserver(([entry]) => {
    const w = Math.round(entry.contentRect.width)
    if (w) mapWidth.value = w
  })
  observer.observe(root.value)
})
onBeforeUnmount(() => observer?.disconnect())

const px = (pct) => (pct / 100) * mapWidth.value

// точки дороги: вход сверху, земли, выход вниз; open = путь к точке уже открыт
const roadPoints = computed(() => {
  const list = nodes.value.map(n => ({ x: px(n.x), y: n.y, open: !props.isLocked(n.region) }))
  if (!list.length) return []
  // в первом разделе дорога начинается от медали уровня
  const start = props.prevTheme ? 0 : GATE_Y
  const points = [{ x: px(50), y: start, open: list[0].open }, ...list]
  if (props.testLevel) points.push({ x: px(50), y: testY.value, open: props.testOpen })
  if (!props.isLast) points.push({ x: px(50), y: mapHeight.value, open: points[points.length - 1].open })
  return points
})

const curve = (a, b) => {
  const mid = (b.y - a.y) / 2
  return `C ${a.x} ${a.y + mid}, ${b.x} ${b.y - mid}, ${b.x} ${b.y}`
}

// участки между точками: каждый красится по тому, открыта ли земля, к которой он ведёт
const segments = computed(() => {
  const p = roadPoints.value
  const out = []
  for (let i = 1; i < p.length; i++) {
    out.push({ key: i, open: p[i].open, d: `M ${p[i - 1].x} ${p[i - 1].y} ${curve(p[i - 1], p[i])}` })
  }
  return out
})

const fullPath = computed(() => {
  const p = roadPoints.value
  if (!p.length) return ''
  let d = `M ${p[0].x} ${p[0].y}`
  for (let i = 1; i < p.length; i++) d += ' ' + curve(p[i - 1], p[i])
  return d
})

// стык уровней: начало первого участка рисуется цветом прошлого уровня
const handover = computed(() => {
  if (!props.prevTheme || props.prevTheme === props.theme || !segments.value.length) return null
  return { seg: segments.value[0], clipId: `road-handover-${props.regions[0]?.id || props.theme}` }
})
</script>

<style scoped>
/* Карта без своего фона: видна только дорога и земли поверх фона приложения */
.lands-map {
  --road-dash: #ffffff;
  --leaf: #4ade80;
  --leaf-dark: #16a34a;
  --petal: #f472b6;
  --petal-two: #facc15;
  --accent: #22c55e;
  position: relative;
  width: 100%;
  overflow: hidden;
  isolation: isolate;
}

/* цвет дороги по уровню: яркий открытый путь и приглушённый закрытый того же цвета */
.road-theme--a1 {
  --road-edge: #15803d;
  --road-surface: #4ade80;
  --road-shine: #dcfce7;
  --road-locked: #1f5a3c;
  --road-locked-shine: #3d7d5c;
}

.road-theme--a2 {
  --road-edge: #1d4ed8;
  --road-surface: #60a5fa;
  --road-shine: #dbeafe;
  --road-locked: #274a82;
  --road-locked-shine: #4a6ea6;
}

.road-theme--b1 {
  --road-edge: #6d28d9;
  --road-surface: #a78bfa;
  --road-shine: #ede9fe;
  --road-locked: #4a348a;
  --road-locked-shine: #6c55ad;
}

.lands-map--a2 {
  --leaf: #34d399;
  --leaf-dark: #0f9f6e;
  --petal: #60a5fa;
  --accent: #3b82f6;
}

.lands-map--b1 {
  --leaf: #a78bfa;
  --leaf-dark: #7c3aed;
  --petal: #f0abfc;
  --accent: #8b5cf6;
}

/* дорога */
.lands-map__road {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.road {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.road--shadow {
  stroke: rgba(0, 0, 0, 0.35);
  stroke-width: 28px;
}

.road--edge {
  stroke: var(--road-edge);
  stroke-width: 28px;
}

.road--surface {
  stroke: var(--road-surface);
  stroke-width: 21px;
}

/* узкий светлый блик по середине: полотно выглядит выпуклым */
.road--shine {
  stroke: var(--road-shine);
  stroke-width: 9px;
  opacity: 0.55;
}

.road--dash {
  stroke: var(--road-edge);
  stroke-width: 3px;
  stroke-dasharray: 7 11;
  opacity: 0.45;
}

/* на открытом пути разметка светлая и неподвижная */
.road--dash-open {
  stroke: var(--road-dash);
  opacity: 0.9;
}

.road--surface.road--locked {
  stroke: var(--road-locked);
}

.road--shine.road--locked {
  stroke: var(--road-locked-shine);
  opacity: 0.45;
}

.road--dash.road--locked {
  stroke: rgba(255, 255, 255, 0.25);
  stroke-dasharray: 2 9;
  opacity: 1;
}

/* рубеж нового уровня: медаль на дороге */
.level-gate {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 3;
  display: flex;
  justify-content: center;
  transform: translateY(-50%);
  pointer-events: none;
}

.level-gate__medal {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.level-gate__code {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 3px solid var(--tabsSlideBorderColor);
  background: var(--accent);
  color: #fff;
  font-size: 19px;
  font-weight: 900;
}

/* кольцо прогресса вокруг медали: непрозрачная дорожка закрывает дорогу под ним */
.level-gate__ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 74px;
  height: 74px;
  overflow: visible;
  transform: translate(-50%, -50%) rotate(-90deg);
}

.level-gate__ring circle {
  fill: none;
  stroke-width: 7;
}

/* подложка закрывает дорогу под кольцом */
.level-gate__ring .level-gate__ring-base {
  stroke: var(--landsTabBg);
  stroke-width: 9;
}

/* дорожка цвета уровня видна сразу, даже когда ничего не открыто */
.level-gate__ring .level-gate__ring-track {
  stroke: color-mix(in srgb, var(--accent) 45%, var(--landsTabBg));
}

.level-gate__ring .level-gate__ring-fill {
  stroke: color-mix(in srgb, var(--accent) 55%, #fff);
  filter: drop-shadow(0 0 4px var(--accent));
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

/* лента с названием уровня под медалью */
.level-gate__ribbon {
  position: relative;
  margin-top: 13px;
  padding: 2px 10px;
  border-radius: 10px;
  border: 2px solid var(--tabsSlideBorderColor);
  background: var(--landsTabBg);
  color: var(--title);
  font-size: 11px;
  font-weight: 900;
  white-space: nowrap;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.2);
}

/* итоговый тест на дороге: свиток на подставке, как у земель, с сургучной печатью */
.test-node {
  position: absolute;
  left: 50%;
  z-index: 2;
  width: 214px;
  max-width: calc(100% - 24px);
  padding: 0;
  border: none;
  background: none;
  font-family: "Nunito", sans-serif;
  transform: translate(-50%, -50%);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.test-node__base {
  position: absolute;
  left: 50%;
  bottom: -14px;
  width: 170px;
  height: 30px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: linear-gradient(180deg, #8b5a2b, #5e3b1a);
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.3);
}

.test-node__scroll {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  margin: 8px 8px 6px;
  padding: 12px 12px 12px;
  border-left: 3px solid #b98a4f;
  border-right: 3px solid #b98a4f;
  background: linear-gradient(180deg, #fbeecf 0%, #f0dbaf 100%);
  color: #4a2a00;
  text-align: center;
  transition: transform 0.1s ease;
}

.test-node:active .test-node__scroll {
  transform: translateY(3px);
}

/* скрученные края свитка */
.test-node__scroll::before,
.test-node__scroll::after {
  content: "";
  position: absolute;
  left: -9px;
  right: -9px;
  height: 14px;
  border-radius: 7px;
  background: linear-gradient(180deg, #e6c78e 0%, #c1924f 100%);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
}

.test-node__scroll::before {
  top: -7px;
}

.test-node__scroll::after {
  bottom: -7px;
}

.test-node__title {
  font-size: 15px;
  font-weight: 900;
  line-height: 1.15;
}

.test-node__sub {
  font-size: 12px;
  font-weight: 800;
  line-height: 1.15;
  opacity: 0.75;
}

/* сургучная печать: галочка, когда тест открыт, замок, пока закрыт */
.test-node__seal {
  position: absolute;
  right: -14px;
  bottom: -14px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #e0524a, #a81f1a);
  box-shadow: 0 3px 0 #7c1512, 0 4px 8px rgba(0, 0, 0, 0.35);
  font-size: 15px;
}

.test-node:not(.test-node--open) .test-node__scroll {
  filter: saturate(0.55) brightness(0.72);
}

.test-node:not(.test-node--open) .test-node__seal {
  background: radial-gradient(circle at 35% 30%, #7d70cf, #4b4190);
  box-shadow: 0 3px 0 #352c6e, 0 4px 8px rgba(0, 0, 0, 0.35);
}

/* земля-островок */
.land-node {
  position: absolute;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
  padding: 0;
  border: none;
  background: none;
  transform: translate(-50%, -50%);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.land-node__base {
  /* объёмное основание островка */
  position: absolute;
  top: 46px;
  left: 50%;
  width: 84px;
  height: 28px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: linear-gradient(180deg, #8b5a2b, #5e3b1a);
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.3);
}

.land-node__island {
  position: relative;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid var(--tabsSlideBorderColor);
  overflow: hidden;
  background: var(--landsTabBg);
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.25), 0 8px 14px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease;
  animation: land-float 3.4s ease-in-out infinite;
  animation-delay: var(--delay);
}

.land-node:active .land-node__island {
  transform: translateY(5px) scale(0.97);
}

.land-node__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@keyframes land-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -5px; }
}

.land-node__lock {
  position: absolute;
  top: -4px;
  right: -22px;
  z-index: 3;
  padding: 2px 6px;
  border-radius: 10px;
  border: 2px solid #fff;
  background: linear-gradient(135deg, #8b7cf6 0%, #5d4ad8 100%);
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.25);
}

.land-node__label {
  /* подпись сбоку от земли, по центру по высоте: дорога сверху и снизу остаётся видна */
  position: absolute;
  top: 50%;
  z-index: 3;
  width: max-content;
  max-width: 124px;
  transform: translateY(-50%);
  padding: 4px 9px;
  border-radius: 10px;
  border: 2px solid var(--tabsSlideBorderColor);
  background: var(--landsTabBg);
  color: var(--title);
  font-size: 11px;
  font-weight: 900;
  line-height: 1.2;
  text-align: center;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.2);
}

.land-node__label--left {
  right: calc(100% + 8px);
}

.land-node__label--right {
  left: calc(100% + 8px);
}

/* закрытая земля */
.land-node--locked .land-node__img {
  filter: grayscale(0.85) brightness(0.8);
}

.land-node--locked .land-node__label {
  opacity: 0.75;
}

/* выбранная земля: золотое кольцо и ёжик над ней */
.land-node--active .land-node__island {
  border-color: #ffb100;
  box-shadow: 0 5px 0 #c98a00, 0 0 0 4px rgba(255, 177, 0, 0.35), 0 10px 18px rgba(0, 0, 0, 0.3);
}

.land-node--active .land-node__label {
  border-color: #ffb100;
  background: #ffb100;
  color: #3b2d00;
}

@media (prefers-reduced-motion: reduce) {
  .land-node__island {
    animation: none;
  }
}
</style>
