<template>
  <div v-if="regions" class="map__wrapper">
    <div class="map__title-wrapper">
      <!--      <button @click="backToMain" class="back__to-main">-->
      <!--        <img class="back__icon" src="../assets/images/close.svg" alt="">-->
      <!--      </button>-->
      <h1 class="map__title">{{t('locationsMenu.title')}}</h1>
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
          <img :src="active?.icon" alt="Choose avatar location">
        </div>
        <h2 class="map-left__title">{{ t(active.name) }}</h2>
        <p class="map-left__desc">{{ active.desc }}</p>
        <p class="map-left__level" :class="isUnlocked ? 'ok' : 'locked'">
          <span v-if="isUnlocked">{{t('locationsMenu.access')}}</span>
          <span v-else>{{t('locationsMenu.accessWithLevel')}} {{ active.level }}</span>
        </p>
        <button class="map-btn" :disabled="!isUnlocked" @click="go(active)">
          {{t('locationsMenu.choose')}}
        </button>
      </div>
      <div class="map-right">
        <div
            v-for="region in regions"
            :key="region.id"
            class="region-card"
            :class="[
            'theme--' + themeOf(region),
            { active: active?.id === region.id }
          ]"
            @click="select(region)"
        >
          <div class="region-card__art">
            <img :src="region.icon" alt="Location avatar">
          </div>
          <div class="region-card__footer">
            <span class="region-card__title">{{ t(region.name) }}</span>
            <span v-if="clampedLevel < region.level" class="region-card__badge">
              lvl {{ region.level }}
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
const { t } = useI18n()
const props = defineProps({ currentLevel: { type: Number, default: 1 } })

const router = useRouter()
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
  font-family: "Nunito", sans-serif;
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
  gap: 12px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.map__title-wrapper {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 3px solid var(--border);
  box-shadow: 3px 3px 0 var(--border);
  border-radius: 15px;
  padding: 10px;
  background: linear-gradient(
      to bottom,
      #f9e7b2 0%,
      #f2d77b 100%
  );
  position: relative;
  overflow: hidden;
}

.map__title {
  font-size: 2.3rem;
  color: #696767;
  font-weight: 600;
  letter-spacing: .2px;
  font-family: "Nunito", sans-serif;
}

.map-layout {
  display: flex;
  gap: 12px;
  width: 100%;
}

.map-left {
  flex: 1;
  border: 3px solid var(--border);
  border-radius: 15px;
  padding: 12px;
  color: #222;
  overflow-y: auto;
  box-shadow: var(--border);
  position: relative;
}

.map-left__art {
  width: 100%;
  height: 190px;
  border: 3px solid var(--border);
  border-radius: 10px;
  margin-bottom: 14px;
  overflow: hidden;
  background: var(--bg);
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
  color: var(--titleColor);
}

.map-left__desc {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 12px;
  color: var(--titleColor);
}

.map-left__level {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 800;
  margin-bottom: 18px;
  padding: 6px 10px;
  border: 2px dashed var(--border);
  border-radius: 999px;
  background: #fff;
  box-shadow: 2px 2px 0 var(--border);
}

.map-left__level.ok {
  color: #137a4a;
}

.map-left__level.locked {
  color: #b21f24;
}

.map-btn {
  padding: 12px 18px;
  background: #f1c40f;
  color: black;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  font-size: 18px;
  border: 2px solid white;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 3px 0  #ead064;
  transition: transform .12s ease, box-shadow .12s ease;
  width: 100%;
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
  padding: 5px;
}

.region-card {
  position: relative;
  height: 190px;
  border: 3px solid var(--border);
  border-radius: 15px;
  box-shadow: 3px 3px 0 var(--border);
  cursor: pointer;
  overflow: hidden;
  transition: transform .12s ease, box-shadow .12s ease, filter .12s ease;
  background: var(--bg)
}

.region-card.active {
  outline: 3px solid #fff;
  box-shadow: 0 0 0 3px #fff, 6px 6px 0 var(--border);
}

.region-card:hover {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0 var(--border);
}

.region-card__art {
  position: absolute;
  inset: 0;
}

.region-card__art img {
  width: 100%;
  height: 100%;
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
  border: 2px solid var(--border);
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255, 255, 255, .75), rgba(255, 255, 255, .55));
  backdrop-filter: blur(2px);
  box-shadow: 2px 2px 0 var(--border);
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
  border: 2px solid var(--border);
  border-radius: 999px;
  background: linear-gradient(180deg, #fff, #eaeaea);
  box-shadow: 1px 1px 0 var(--border);
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
    background: var(--bg);
  }

  .map__title {
    font-size: 1.4rem;
    color: black;
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
    border: 3px solid var(--border);
    border-radius: 10px;
    background: linear-gradient(180deg, #ffe98d, #ffd255);
    box-shadow: 2px 2px 0 var(--border);
    font-size: 22px;
    cursor: pointer;
  }
}
</style>
