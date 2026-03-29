<template>
  <div class="menu-starfield">
    <div class="space-environment">
      <div class="nebula-cloud blue"></div>
      <div class="nebula-cloud purple"></div>
      <div v-for="n in 12" :key="n" class="floating-toon-star" :style="getRandomPos(n)">
        {{ n % 2 === 0 ? '⭐' : '✨' }}
      </div>
      <img v-for="astro in astronauts"
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
    <div class="open-menu-layout" v-if="currentScreen === 'menu' && !isTransitioning">
      <div class="title-section">
        <h1 class="main-title-toon">
          <span class="word-1">ВСЕЛЕННАЯ</span>
          <span class="word-2">НЕМЕЦКОГО</span>
        </h1>
      </div>
      <div class="controls-section">
        <button class="menu-btn-toon play" @click="toggleScreen('galaxies')">
          <span class="icon">🚀</span> НАЧАТЬ
        </button>
        <div class="secondary-btns">
          <button
              v-for="btn in menuButtons"
              :key="btn.id"
              class="menu-btn-toon"
              :class="btn.class"
              @click="btn.action ? btn.action() : toggleScreen(btn.target)"
          >
            {{ btn.label }}
          </button>
        </div>
      </div>
    </div>
    <div class="sub-screen-container">
      <component
          v-if="currentScreen !== 'menu'"
          :is="componentViews[currentScreen]"
          @close="toggleScreen('menu')"
          @back="toggleScreen('menu')"
          @select="startMission"
      />
    </div>
    <Transition name="warp-flash">
      <div class="warp-overlay" v-if="isTransitioning"></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from "vue-router"
import { useGalaxyStore } from '../../store/galaxyStore.js'

import Astronaut from '../../assets/images/astronaut.svg'
import VGameCabinet from '../../src/components/galaxy-game/V-gameCabinet.vue'
import VGameHangar from '../../src/components/galaxy-game/V-gameHangar.vue'
import VGalaxySelector from '../../src/components/galaxy-game/V-galaxySelector.vue'
import VRankGalaxy from "../../src/components/galaxy-game/V-rank-galaxy.vue";

const router = useRouter()
const store = useGalaxyStore()
const { locale } = useI18n()
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
  { id: 'profile', class: 'settings', label: 'Профиль', target: 'settings' },
  { id: 'shop', class: 'hangar', label: 'АНГАР', target: 'shop' },
  { id: 'rank', class: 'rank-btn', label: 'Рейтинг', target: 'rank' },
  { id: 'exit', class: 'exit', label: 'ВЫХОД', action: () => handleExit() }
]

const getRandomPos = (n) => ({
  top: Math.random() * 100 + '%',
  left: Math.random() * 100 + '%',
  animationDelay: n * 0.4 + 's',
  fontSize: (Math.random() * 1 + 1) + 'rem'
})

const generateAstronauts = (count = 3) => {
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
      if (!hasCollision) {
        positionFound = true
      }
      attempts++
    }
    const size = Math.floor(Math.random() * 80) + 40
    const duration = Math.random() * 10 + 15
    const delay = -(i * 2)
    newAstronauts.push({ id: i, top, left, size, duration, delay })
  }

  astronauts.value = newAstronauts
}

const handleExit = () => router.push(`/${locale.value}`)

const toggleScreen = (target) => {
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

const startMission = (sectorId) => {
  router.push({
    name: `games-id___${locale.value}`,
    params: { id: sectorId }
  })
}

onMounted(() => {
  generateAstronauts()
})
</script>

<style scoped>
.menu-starfield {
  height: 100vh;
  background: #0a0a20;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  font-family: 'Arial Rounded MT Bold', sans-serif;
}


.space-environment {
  position: absolute;
  inset: 0;
  z-index: 0;
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
  background: #00d2ff;
  top: -10%;
  left: -10%;
}

.nebula-cloud.purple {
  background: #ff00ff;
  bottom: -10%;
  right: -10%;
}

.rank-btn {
  background: #9c27b0;
  box-shadow: 0 6px 0 #9826c7;
}

.rank-btn:active {
  box-shadow: 0 2px 0 #000;
}

.floating-toon-star {
  position: absolute;
  animation: floatStars 5s infinite ease-in-out;
  pointer-events: none;
}

@keyframes floatStars {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.8;
  }
}

.open-menu-layout {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

.main-title-toon {
  text-align: center;
  display: flex;
  flex-direction: column;
  line-height: 0.9;
  transform: rotate(-3deg);
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
  gap: 25px;
  width: 100%;
}

.menu-btn-toon {
  border: 4px solid #000;
  border-radius: 20px;
  font-weight: 900;
  color: #fff;
  cursor: pointer;
  transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  text-transform: uppercase;
}

.menu-btn-toon.play {
  width: 100%;
  padding: 10px 20px;
  font-size: 2rem;
  background: #4caf50;
  box-shadow: 0 10px 0 #1b5e20, 0 15px 30px rgba(0, 0, 0, 0.4);
  animation: pulsePlay 2s infinite;
}

.secondary-btns {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
}

.secondary-btns .menu-btn-toon {
  padding: 15px 25px;
  font-size: 1rem;
}

.hangar {
  background: #ff9800;
  box-shadow: 0 6px 0 #e65100;
}

.settings {
  background: #2196f3;
  box-shadow: 0 6px 0 #0d47a1;
}

.exit {
  background: #f44336;
  box-shadow: 0 6px 0 #8e0000;
}

.menu-btn-toon:hover {
  transform: scale(1.01);
}

.menu-btn-toon:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #000;
}

@keyframes pulsePlay {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.01);
  }
}

.warp-overlay {
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 5000;
}

.floating-astronaut {
  position: absolute;
  animation: floatAstro infinite ease-in-out;
  pointer-events: none; /* чтобы они не перекрывали клики по кнопкам */
  opacity: 0.8;
  z-index: 1; /* держим их на фоне, но над туманностями */
}

@keyframes floatAstro {
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(-10deg);
  }
  33% {
    transform: translateY(-30px) translateX(20px) rotate(15deg);
  }
  66% {
    transform: translateY(20px) translateX(-15px) rotate(5deg);
  }
}

.warp-flash-enter-active, .warp-flash-leave-active {
  transition: opacity 0.3s;
}

.warp-flash-enter-from, .warp-flash-leave-to {
  opacity: 0;
}
</style>