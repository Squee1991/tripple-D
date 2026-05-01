<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from "vue-router"
import { useGalaxyStore } from '../../store/galaxyStore.js'

import Astronaut from '../../assets/images/astronaut.svg'
import VGameCabinet from '../../src/components/galaxy-game/V-gameCabinet.vue'
import VGameHangar from '../../src/components/galaxy-game/V-gameHangar.vue'
import VGalaxySelector from '../../src/components/galaxy-game/V-galaxySelector.vue'
import VRankGalaxy from "../../src/components/galaxy-game/V-rank-galaxy.vue";

const router = useRouter()
const store = useGalaxyStore()
const { t } = useI18n()

const currentScreen = ref('menu')
const isTransitioning = ref(false)
const astronauts = ref([])

const componentViews = {
  settings: VGameCabinet,
  shop: VGameHangar,
  galaxies: VGalaxySelector,
  rank: VRankGalaxy,
}

const menuButtons = [
  { id: 'profile', class: 'settings', label: 'galaxyMenu.profile', target: 'settings' },
  { id: 'shop', class: 'hangar', label: 'galaxyMenu.shop', target: 'shop' },
  { id: 'rank', class: 'rank-btn', label: 'galaxyMenu.rank', target: 'rank' },
  { id: 'exit', class: 'exit', label: 'galaxyMenu.exit', action: () => handleExit() }
]

const getRandomPos = (n) => ({
  top: Math.random() * 100 + '%',
  left: Math.random() * 100 + '%',
  animationDelay: n * 0.4 + 's',
  fontSize: (Math.random() * 1 + 1) + 'rem'
})

const generateAstronauts = (count = 2) => {
  const newAstronauts = []
  const minDistance = 15
  for (let i = 0; i < count; i++) {
    let attempts = 0
    let positionFound = false
    let top, left
    while (!positionFound && attempts < 50) {
      top = Math.random() * 80 + 10
      left = Math.random() * 80 + 10
      let hasCollision = newAstronauts.some(astro => {
        const distance = Math.hypot(astro.left - left, astro.top - top)
        return distance < minDistance
      })
      if (!hasCollision) { positionFound = true }
      attempts++
    }
    const size = Math.floor(Math.random() * 80) + 40
    const duration = Math.random() * 10 + 15
    const delay = -(i * 2)
    newAstronauts.push({ id: i, top, left, size, duration, delay })
  }
  astronauts.value = newAstronauts
}

const handleExit = () => router.push('/')

const startMission = (sectorId) => {
  router.push({
    name: 'german-universe-id',
    params: { id: sectorId }
  })
}

const triggerWarpTransition = (target) => {
  const needsWarp = ['shop', 'galaxies', 'rank'].includes(target) ||
      (target === 'menu' && ['shop', 'galaxies', 'rank'].includes(currentScreen.value))

  if (needsWarp) {
    isTransitioning.value = true
    setTimeout(() => {
      currentScreen.value = target
      setTimeout(() => isTransitioning.value = false, 300)
    }, 400)
  } else {
    currentScreen.value = target
  }
}

const toggleScreen = (target) => {
  if (target !== 'menu' && currentScreen.value === 'menu') {
    window.history.pushState({ isSubScreen: true }, '')
    triggerWarpTransition(target)
  }
  else if (target === 'menu' && currentScreen.value !== 'menu') {
    window.history.back()
  }
  else {
    triggerWarpTransition(target)
  }
}

const handlePopState = () => {
  if (currentScreen.value !== 'menu') {
    triggerWarpTransition('menu')
  } else {
    router.push('/')
  }
}

onMounted(() => {
  generateAstronauts()
  window.history.pushState({ isGalaxyRoot: true }, '')
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>

<template>
  <div class="menu__wrapper">
    <div class="menu-bg-layer">
      <div class="nebula-cloud blue"></div>
      <div class="nebula-cloud purple"></div>
      <div v-for="n in 8" :key="n" class="floating-toon-star" :style="getRandomPos(n)">
        {{ n % 2 === 0 ? '⭐' : '✨' }}
      </div>
      <img
          v-for="astro in astronauts"
          :key="'astro' + astro.id"
          :src="Astronaut"
          class="floating-astronaut"
          :style="{
        top: astro.top + '%',
        left: astro.left + '%',
        width: astro.size + 'px',
        animationDuration: astro.duration + 's',
        animationDelay: astro.delay + 's'
      }"
          alt="astronaut"
      />
    </div>
    <div class="menu-content-layer">
      <div class="open-menu-layout" v-if="currentScreen === 'menu' && !isTransitioning">
        <div class="title-section">
          <h1 class="main-title-toon">
            <span class="word-1">{{ t('galaxyMenu.titleWordOne')}}</span>
            <span class="word-2">{{ t('galaxyMenu.titleWordTwo')}}</span>
          </h1>
        </div>
        <div class="controls-section">
          <button class="menu-btn-toon play" @click="toggleScreen('galaxies')">
            <span class="icon">🚀 {{ t('galaxyMenu.begin')}}</span>
          </button>
          <div class="secondary-btns">
            <button
                v-for="btn in menuButtons"
                :key="btn.id"
                class="menu-btn-toon"
                :class="btn.class"
                @click="btn.action ? btn.action() : toggleScreen(btn.target)"
            >
              {{ t(btn.label) }}
            </button>
          </div>
        </div>
      </div>
      <div class="sub-screen-container" v-if="currentScreen !== 'menu'">
        <component
            :is="componentViews[currentScreen]"
            @close="toggleScreen('menu')"
            @back="toggleScreen('menu')"
            @select-galaxy="startMission"
        />
      </div>
    </div>
    <Transition name="warp-flash">
      <div class="warp-overlay" v-if="isTransitioning"></div>
    </Transition>
  </div>
</template>

<style scoped>
.menu__wrapper {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  padding-top: env(safe-area-inset-top, 20px);
  padding-bottom: env(safe-area-inset-bottom, 20px);
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  background: #0b0e14;
}

.menu-bg-layer {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.menu-content-layer {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.open-menu-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 50px;
  width: 100%;
  height: 100%;
  max-width: 360px;
  margin: auto;
}

.sub-screen-container {
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.warp-overlay {
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 5000;
}

.nebula-cloud {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
}

.nebula-cloud.blue {
  top: -100px;
  left: -100px;
  background: #3a7bd5;
}

.nebula-cloud.purple {
  bottom: -100px;
  right: -100px;
  background: #9c27b0;
}

.floating-toon-star {
  position: absolute;
  animation: floatStars 5s infinite ease-in-out;
}

@keyframes floatStars {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
}

.floating-astronaut {
  position: absolute;
  animation: floatAstro infinite ease-in-out;
  opacity: 0.8;
}

@keyframes floatAstro {
  0%, 100% { transform: translateY(0) translateX(0) rotate(-10deg); }
  33% { transform: translateY(-30px) translateX(20px) rotate(15deg); }
  66% { transform: translateY(20px) translateX(-15px) rotate(5deg); }
}

.main-title-toon {
  text-align: center;
  display: flex;
  flex-direction: column;
  line-height: 0.9;
  transform: rotate(-3deg);
  margin: 0;
}

.word-1 {
  color: #fff;
  font-size: 2.1rem;
  -webkit-text-stroke: 2px #f3f0f0;
  text-shadow: 4px 4px 0 #3a7bd5;
}

.word-2 {
  color: #ffeb3b;
  font-size: 3.2rem;
  -webkit-text-stroke: 3px #eae5e5;
  text-shadow: 5px 5px 0 #e67e22;
}

.controls-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  gap: 20px;
  width: 100%;
}

.menu-btn-toon {
  border: 1px solid #000;
  border-radius: 20px;
  font-weight: 900;
  color: #fff;
  cursor: pointer;
  transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-transform: uppercase;
  font-family: inherit;
}

.menu-btn-toon.play {
  width: 100%;
  padding: 15px 20px;
  font-size: 1.8rem;
  background: #4caf50;
  box-shadow: 0 6px 0 #1b5e20, 0 15px 30px rgba(0, 0, 0, 0.4);
  animation: pulsePlay 2s infinite;
}

.secondary-btns {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
}

.secondary-btns .menu-btn-toon {
  padding: 14px 25px;
  font-size: 1.1rem;
}

.hangar { background: #ff9800; box-shadow: 0 6px 0 #e65100; }
.settings { background: #2196f3; box-shadow: 0 6px 0 #0d47a1; }
.rank-btn { background: #9c27b0; box-shadow: 0 6px 0 #9826c7; }
.exit { background: #f44336; box-shadow: 0 6px 0 #8e0000; }

.menu-btn-toon:hover {
  transform: scale(1.02);
}

.menu-btn-toon:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #000;
}

.menu-btn-toon.play:active {
  transform: translateY(6px);
  box-shadow: 0 4px 0 #1b5e20;
}

@keyframes pulsePlay {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.warp-flash-enter-active, .warp-flash-leave-active {
  transition: opacity 0.3s;
}

.warp-flash-enter-from, .warp-flash-leave-to {
  opacity: 0;
}
</style>