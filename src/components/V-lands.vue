<template>
  <div v-if="regions" class="map__wrapper">
    <div class="map__title-wrapper">
<!--      <button @click="backToMain" class="back__to-main">-->
<!--        <img class="back__icon" src="../assets/images/close.svg" alt="">-->
<!--      </button>-->
      <h1 class="map__title">Карта изучения немецкого языка</h1>
    </div>
    <div class="map-layout">
      <div
          class="map-left"
          :class="[
          { 'is-open': isPanelOpen || windowWidth > 767 },
          'theme--' + themeOf(active)
        ]"
          v-if="active"
      >
        <button
            v-if="windowWidth <= 767"
            class="map-left__close"
            @click="isPanelOpen = false"
        >×
        </button>

        <div class="map-left__art">
          <img :src="active?.icon" alt="">
        </div>
        <h2 class="map-left__title">{{ active.name }}</h2>
        <p class="map-left__desc">{{ active.desc }}</p>
        <p class="map-left__level" :class="isUnlocked ? 'ok' : 'locked'">
          <span v-if="isUnlocked">Доступ открыт</span>
          <span v-else>Доступ с уровня {{ active.level }}</span>
        </p>
        <button class="map-btn" :disabled="!isUnlocked" @click="go(active)">
          Выбрать
        </button>
      </div>
      <div class="map-right">
        <div
            v-for="r in regions"
            :key="r.id"
            class="region-card"
            :class="[
            'theme--' + themeOf(r),
            { active: active?.id === r.id }
          ]"
            @click="select(r)"
        >
          <div class="region-card__art">
            <img :src="r.icon" alt="">
          </div>

          <div class="region-card__footer">
            <span class="region-card__title">{{ r.name }}</span>
            <span v-if="clampedLevel < r.level" class="region-card__badge">
              lvl {{ r.level }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { regions } from '@/utils/regions.js'

const props = defineProps({ currentLevel: { type: Number, default: 1 } })

const router = useRouter()
const backToMain = () => router.push('/')

const active = ref(regions[0])
const isPanelOpen = ref(false)
const windowWidth = ref(1024)

function handleResize() {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  }
}

onMounted(() => {
  handleResize()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})

const clampedLevel = computed(() =>
    Math.min(Math.max(props.currentLevel, 1), 20)
)

const isUnlocked = computed(() =>
    active.value ? clampedLevel.value >= active.value.level : false
)

function themeOf(obj) {
  return (obj && (obj.theme || obj.pathTo)) ? (obj.theme || obj.pathTo) : 'default'
}

function select(region) {
  active.value = region
  if (windowWidth.value <= 767) isPanelOpen.value = true
}

function go(region) {
  if (clampedLevel.value >= region.level) {
    router.push(`/location/${region.pathTo}`)
  }
}
</script>


<style>

* {
  font-family: "Nunito", system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}

:root {
  --stroke: #1c1c1c;
  --card-radius: 14px;
  --shadow: 4px 4px 0 var(--stroke);
  --shadow-hover: 2px 2px 0 var(--stroke);
}

.back__to-main {
  border: none;
  background: none;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}

.back__icon {
  width: 100%;
}

.map__wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 5px;
  align-items: center;
  margin: 20px 0 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.map__title-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border: 3px solid var(--stroke);
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: 12px;
  position: relative;
  overflow: hidden;
  background: #4ade80;
  margin-bottom: 10px;
}


.map__title {
  font-size: 2.3rem;
  color: #212121;
  font-weight: 900;
  letter-spacing: .2px;
}

.map-layout {
  display: flex;
  gap: 12px;
  width: 100%;
}

.map-left {
  flex: 1;
  background: #fff;
  border: 3px solid var(--stroke);
  border-radius: var(--card-radius);
  padding: 12px;
  color: #222;
  overflow-y: auto;
  box-shadow: var(--shadow);
  position: relative;
}

.map-left__art {
  width: 100%;
  height: 190px;
  border: 3px solid var(--stroke);
  border-radius: 10px;
  margin-bottom: 14px;
  box-shadow: 3px 3px 0 var(--stroke);
  overflow: hidden;
  background: linear-gradient(180deg, var(--c1), var(--c2));
}

.map-left__art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.map-left__title {
  font-size: 1.6rem;
  margin: 0 0 8px;
  font-weight: 900;
  font-style: italic;
}

.map-left__desc {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #2b2b2b;
}

.map-left__level {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  margin-bottom: 18px;
  padding: 6px 10px;
  border: 2px dashed var(--stroke);
  border-radius: 999px;
  background: #fff;
  box-shadow: 2px 2px 0 var(--stroke);
}

.map-left__level.ok {
  color: #137a4a;
}

.map-left__level.locked {
  color: #b21f24;
}

.map-btn {
  padding: 12px 18px;
  font-weight: 900;
  background: linear-gradient(180deg, #ffe98d, #ffd255);
  color: #222;
  border: 3px solid var(--stroke);
  border-radius: 12px;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: transform .12s ease, box-shadow .12s ease;
  width: 100%;
}

.map-btn:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-hover);
}

.map-btn:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.map-right {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  overflow-y: auto;
  padding: 12px;
  border: 3px solid var(--stroke);
  border-radius: var(--card-radius);
  background: linear-gradient(180deg, #fff, #f7f7f7);
  box-shadow: var(--shadow);
}

.region-card {
  position: relative;
  height: 190px;
  border: 3px solid var(--stroke);
  border-radius: var(--card-radius);
  box-shadow: var(--shadow);
  cursor: pointer;
  overflow: hidden;
  transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
  background: linear-gradient(180deg, var(--c1), var(--c2));
}

.region-card.active {
  outline: 3px solid #fff;
  box-shadow: 0 0 0 3px #fff, 6px 6px 0 var(--stroke);
}

.region-card:hover {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-hover);
}

.region-card__art {
  position: absolute;
  inset: 0;
}

.region-card__art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.region-card__footer {
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 10px;
  border: 2px solid var(--stroke);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255, 255, 255, .75), rgba(255, 255, 255, .55));
  backdrop-filter: blur(2px);
  box-shadow: 2px 2px 0 var(--stroke);
}

.region-card__title {
  font-size: 1.05rem;
  font-weight: 900;
  color: #1d1d1d;
}

.region-card__badge {
  font-size: .82rem;
  font-weight: 900;
  color: #1d1d1d;
  padding: 3px 8px;
  border: 2px solid var(--stroke);
  border-radius: 999px;
  background: linear-gradient(180deg, #fff, #eaeaea);
  box-shadow: 1px 1px 0 var(--stroke);
}

.theme--default {
  --c1: #e8eef6;
  --c2: #d7e2f0;
}

.theme--winds {
  --c1: #dff4ff;
  --c2: #bfe7ff;
}

.theme--plain {
  --c1: #fff2a8;
  --c2: #f6d96c;
}

.theme--stone {
  --c1: #e7f0fa;
  --c2: #c9def1;
}

.theme--ruins {
  --c1: #eaf6d9;
  --c2: #cbe8ae;
}

.theme--north {
  --c1: #e9f5ff;
  --c2: #cfe9ff;
}

.theme--storm {
  --c1: #dce8f2;
  --c2: #b5c7d6;
}

@media (max-width: 767px) {
  .map-layout {
    position: relative;
    display: block;
    overflow-y: auto;
  }

  .map-left {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 0;
    border: none;
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
    transition: transform .25s ease, opacity .25s ease;
    z-index: 1000;
  }

  .map-left.is-open {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
  }

  .map__title {
    font-size: 1.2rem;
  }

  .map-right {
    grid-template-columns:1fr;
    box-shadow: none;
  }

  .map-left__close {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
    border: 3px solid var(--stroke);
    border-radius: 10px;
    background: linear-gradient(180deg, #ffe98d, #ffd255);
    box-shadow: 2px 2px 0 var(--stroke);
    font-size: 22px;
    cursor: pointer;
  }
}
</style>
