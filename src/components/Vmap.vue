<template>
  <div class="map-page">
    <header class="topbar">
      <div class="topbar__left">
        <h1 class="worldname">{{ worldName }}</h1>
        <span class="subtitle">Карта локаций (уровни 1–20)</span>
      </div>
      <div class="topbar__right">
        <div class="levelpill">Твой уровень: <b>{{ clampedLevel }}</b> / 20</div>
      </div>
    </header>
    <div class="map-container" @keydown.esc="closeModal" tabindex="0">
      <div class="map-card">
        <div class="map-card__header">
          <h2 class="map-card__title">Карта мира</h2>
          <div class="legend">
            <span class="legend__item"><i class="dot dot--1"></i> 1–5</span>
            <span class="legend__item"><i class="dot dot--2"></i> 6–10</span>
            <span class="legend__item"><i class="dot dot--3"></i> 11–15</span>
            <span class="legend__item"><i class="dot dot--4"></i> 16–20</span>
          </div>
        </div>
        <div class="map-box">
          <svg
              class="map__svg"
              viewBox="0 0 1200 700"
              preserveAspectRatio="xMidYMid slice"
              aria-labelledby="title desc"
              role="img"
          >
            <title id="title">Карта локаций с делением по уровням (1–20)</title>
            <desc id="desc">
              6 локаций с требуемым уровнем. Фоновые полосы показывают диапазоны уровней.
            </desc>
            <rect x="0" y="0" width="1200" height="700" class="ocean"/>
            <g class="tiers" aria-hidden="true">
              <g class="tier tier--1">
                <rect x="0" y="0" width="1200" height="175"/>
              </g>
              <g class="tier tier--2">
                <rect x="0" y="175" width="1200" height="175"/>
              </g>
              <g class="tier tier--3">
                <rect x="0" y="350" width="1200" height="175"/>
              </g>
              <g class="tier tier--4">
                <rect x="0" y="525" width="1200" height="175"/>
              </g>
              <text class="tier__label" x="24" y="26">Ур. 1–5</text>
              <text class="tier__label" x="24" y="201">Ур. 6–10</text>
              <text class="tier__label" x="24" y="376">Ур. 11–15</text>
              <text class="tier__label" x="24" y="551">Ур. 16–20</text>
            </g>
            <g class="fills">
              <template v-for="r in regions" :key="r.id">
                <path class="fill" :class="r.fillClass" :d="r.path"/>
              </template>
            </g>
            <g class="borders" aria-hidden="true">
              <template v-for="r in regions" :key="r.id + '-b'">
                <path class="border" :d="r.path"/>
              </template>
            </g>
            <g class="labels" aria-hidden="true">
              <template v-for="r in regions" :key="r.id + '-l'">
                <text class="label" :x="r.label.x" :y="r.label.y">{{ r.name }}</text>
              </template>
            </g>
            <g class="hotzones" aria-label="Локации">
              <template v-for="r in regions" :key="r.id + '-h'">
                <path
                    class="hot"
                    :d="r.path"
                    role="button"
                    tabindex="0"
                    :aria-label="`Открыть локацию ${r.name}`"
                    @click="open(r)"
                    @keydown.enter.prevent="open(r)"
                    @keydown.space.prevent="open(r)"
                />
              </template>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <div v-if="active" class="modal__backdrop" @click.self="closeModal">
      <div class="modal" role="dialog" aria-modal="true" :aria-labelledby="`modal-title-${active.id}`">
        <div class="modal__header">
          <span class="badge">Lvl {{ active.level }}</span>
          <h2 class="modal__title" :id="`modal-title-${active.id}`">{{ active.name }}</h2>
          <button class="modal__close" @click="closeModal" aria-label="Закрыть">×</button>
        </div>
        <div class="modal__body">
          <p class="modal__desc">{{ active.desc }}</p>
          <div class="modal__status" :class="isUnlocked ? 'ok' : 'locked'">
            <span v-if="isUnlocked">Доступ открыт</span>
            <span v-else>Доступ с уровня {{ active.level }}</span>
          </div>
        </div>
        <div class="modal__footer">
          <button class="btn btn--ghost" @click="closeModal">Закрыть</button>
          <button class="btn btn--primary" :disabled="!isUnlocked" @click="go(active)">Перейти</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {useRouter} from 'vue-router'
import {regions} from '../../utils/regions.js'

const props = defineProps({
  worldName: {
    type: String, default: 'Элизиум'
  },
  currentLevel: {
    type: Number, default: 1
  }
})

const router = useRouter()
const active = ref(null)

const clampedLevel = computed(() => Math.min(Math.max(props.currentLevel, 1), 20))
const isUnlocked = computed(() => (active.value ? clampedLevel.value >= active.value.level : false))

function open(region) {
  active.value = region
}

function closeModal() {
  active.value = null
}

function go(region) {
  if (!region) return
  if (clampedLevel.value >= region.level) {
    router.push(`/location/${region.pathTo}`)
    closeModal()
  }
}
</script>

<style>
:root {
  --a: #ffd166;
  --b: #11c5bf;
  --c: #9b5de5;
  --d: #ff7b7b;
  --e: #06d6a0;
  --f: #48bfe3;
  --ocean-top: #9dd6ff;
  --ocean-bot: #6ab0e6;
  --border: #1e2a3a;
  --label: #0b1220;
  --t1: rgba(255, 209, 102, .18);
  --t2: rgba(17, 197, 191, .18);
  --t3: rgba(155, 93, 229, .18);
  --t4: rgba(72, 191, 227, .18);
  --panel: #0b1220cc;
  --panel-b: #1f2a3b;
  --ok: #10b981;
  --ok-bg: #a7f3d0;
  --ok-b: #6ee7b7;
  --locked: #ef4444;
  --locked-bg: #fecaca;
  --locked-b: #fca5a5;
}

.map-page {
  color: var(--titleColor);
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 40px
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(148, 163, 184, .12);
  backdrop-filter: blur(8px)
}

.worldname {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: .03em
}

.subtitle {
  font-size: 12px;
  margin-left: 8px
}

.topbar__left {
  display: flex;
  align-items: baseline;
  gap: 6px
}

.levelpill {
  background: rgba(96, 165, 250, .12);
  color: #dbeafe;
  border: 1px solid rgba(96, 165, 250, .25);
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 800
}

.map-container {
  display: flex;
  justify-content: center
}

.map-card {
  width: 100%;
  border-radius: 18px;
  border: 2px solid black;
  overflow: hidden;
  box-shadow: 6px 6px 0 black
}

.map-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px
}

.map-card__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  font-family: "Nunito", sans-serif
}

.legend {
  display: flex;
  gap: 10px;
  color: #cbd5e1;
  align-items: center
}

.legend__item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  font-size: 12px
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block
}

.dot--1 {
  background: var(--t1)
}

.dot--2 {
  background: var(--t2)
}

.dot--3 {
  background: var(--t3)
}

.dot--4 {
  background: var(--t4)
}

.map-box {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: linear-gradient(180deg, var(--ocean-top), var(--ocean-bot));
  border: 2px solid black
}

.map__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block
}

.tier rect {
  fill: transparent
}

.tier--1 rect {
  fill: var(--t1)
}

.tier--2 rect {
  fill: var(--t2)
}

.tier--3 rect {
  fill: var(--t3)
}

.tier--4 rect {
  fill: var(--t4)
}

.tier__label {
  font: 800 12px/1 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell;
  fill: #0b1220;
  opacity: .75
}

.fill {
  stroke: none
}

.fill-a {
  fill: var(--a)
}

.fill-b {
  fill: var(--b)
}

.fill-c {
  fill: var(--c)
}

.fill-d {
  fill: var(--d)
}

.fill-e {
  fill: var(--e)
}

.fill-f {
  fill: var(--f)
}

.border {
  fill: none;
  stroke: var(--border);
  stroke-width: 3;
  vector-effect: non-scaling-stroke;
  pointer-events: none
}

.label {
  font: 800 16px/1 ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial;
  text-anchor: middle;
  alignment-baseline: middle;
  paint-order: stroke;
  stroke: rgba(255, 255, 255, .8);
  stroke-width: 4px;
  fill: var(--label)
}

.ocean {
  fill: transparent
}

.hot {
  fill: transparent;
  cursor: pointer;
  outline: none
}

.modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, .55);
  display: grid;
  place-items: center;
  padding: 24px;
  z-index: 101
}

.modal {
  width: min(560px, 92vw);
  color: #e5e7eb;
  background: var(--panel);
  border: 1px solid var(--panel-b);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, .35);
  overflow: hidden
}

.modal__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--panel-b)
}

.badge {
  font-weight: 800;
  font-size: 12px;
  letter-spacing: .04em;
  padding: 6px 10px;
  border-radius: 999px;
  background: #08101e;
  border: 1px solid #1f2937
}

.modal__title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #fff
}

.modal__close {
  margin-left: auto;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--panel-b);
  background: #0b1220;
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer
}

.modal__close:hover {
  background: #111827
}

.modal__body {
  padding: 18px 20px;
  display: grid;
  gap: 10px
}

.modal__desc {
  margin: 0;
  color: #cbd5e1
}

.modal__status {
  font-weight: 700;
  padding: 10px 12px;
  border-radius: 10px;
  width: fit-content;
  border: 1px solid var(--panel-b)
}

.modal__status.ok {
  color: var(--ok);
  background: var(--ok-bg);
  border-color: var(--ok-b)
}

.modal__status.locked {
  color: var(--locked);
  background: var(--locked-bg);
  border-color: var(--locked-b)
}

.modal__footer {
  padding: 14px 20px;
  border-top: 1px solid var(--panel-b);
  display: flex;
  justify-content: flex-end;
  gap: 8px
}

.btn {
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  font-weight: 800;
  letter-spacing: .02em;
  border: 1px solid var(--panel-b);
  background: #0b1220;
  color: #fff;
  cursor: pointer
}

.btn:disabled {
  opacity: .55;
  cursor: not-allowed
}

.btn--primary:not(:disabled):hover {
  background: #111827
}

.btn--ghost {
  background: transparent
}

@media (max-width: 720px) {
  .worldname {
    font-size: 16px
  }

  .subtitle {
    display: none
  }

  .legend {
    display: none
  }
}
</style>
