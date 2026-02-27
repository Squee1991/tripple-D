<template>
  <div class="menu-starfield">
    <div class="space-environment">
      <div class="nebula-cloud blue"></div>
      <div class="nebula-cloud purple"></div>

      <div v-for="n in 15" :key="n" class="floating-toon-star" :style="getRandomPos(n)">
        {{ n % 2 === 0 ? '⭐' : '✨' }}
      </div>
    </div>
    <div class="open-menu-layout" v-if="!showShop && !showSettings && !showGalaxySelector && !isTransitioning">

      <div class="title-section">
        <h1 class="main-title-toon">
          <span class="word-1">ГАЛАКТИКА</span>
          <span class="word-2">АРТИКЛЕЙ</span>
        </h1>
      </div>
      <div class="controls-section">
        <button class="menu-btn-toon play" @click="toggleScreen('galaxies')">
          <span class="icon">🚀</span> В БОЙ!
        </button>

        <div class="secondary-btns">
          <button class="menu-btn-toon hangar" @click="toggleScreen('shop')">АНГАР</button>
          <button class="menu-btn-toon settings" @click="toggleScreen('settings')">HUD</button>
          <button class="menu-btn-toon exit" @click="handleExit">ВЫХОД</button>
        </div>
      </div>

    </div>
    <div class="sub-screen-container">
      <VGalaxySelector
          v-if="showGalaxySelector"
          @back="toggleScreen('menu')"
          @select="startMission"
      />
      <VGameSettings v-if="showSettings" @close="toggleScreen('menu')"/>
      <VGameHangar v-if="showShop" @close="toggleScreen('menu')"/>
    </div>

    <Transition name="warp-flash">
      <div class="warp-overlay" v-if="isTransitioning"></div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router"
import { useGalaxyStore } from '../../store/galaxyStore.js'

import VGameSettings from '../../src/components/V-gameSettings.vue'
import VGameHangar from '../../src/components/V-gameHangar.vue'
import VGalaxySelector from '../../src/components/V-galaxySelector.vue'

const router = useRouter()
const store = useGalaxyStore()
const { locale } = useI18n()

const showSettings = ref(false)
const showShop = ref(false)
const showGalaxySelector = ref(false)
const isTransitioning = ref(false)

const getRandomPos = (n) => ({
  top: Math.random() * 100 + '%',
  left: Math.random() * 100 + '%',
  animationDelay: n * 0.4 + 's',
  fontSize: (Math.random() * 1 + 1) + 'rem'
})

const handleExit = () => router.push(`/${locale.value}`)
const toggleScreen = (target) => {
  const needsWarp = ['shop', 'galaxies'].includes(target) ||
      (target === 'menu' && (showShop.value || showGalaxySelector.value))

  if (needsWarp) {
    isTransitioning.value = true
    setTimeout(() => {
      resetScreens()
      if (target === 'shop') showShop.value = true
      if (target === 'galaxies') showGalaxySelector.value = true
      setTimeout(() => isTransitioning.value = false, 300)
    }, 400)
  } else {
    resetScreens()
    if (target === 'settings') showSettings.value = true
  }
}

const resetScreens = () => {
  showSettings.value = false
  showShop.value = false
  showGalaxySelector.value = false
}

const startMission = (sectorId) => {
  router.push({
    name: `games-id___${locale.value}`,
    params: { id: sectorId }
  })
}

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
/* ВЕРСТКА БЕЗ РАМКИ */
.open-menu-layout {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

/* ЗАГОЛОВОК */
.main-title-toon {
  text-align: center;
  display: flex;
  flex-direction: column;
  line-height: 0.9;
  transform: rotate(-3deg);
}

.word-1 {
  color: #fff;
  font-size: 3rem;
  -webkit-text-stroke: 2px #000;
  text-shadow: 4px 4px 0 #3a7bd5;
}

.word-2 {
  color: #ffeb3b;
  font-size: 5rem;
  -webkit-text-stroke: 3px #000;
  text-shadow: 6px 6px 0 #e67e22;
}
/* КНОПКИ */
.controls-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.menu-btn-toon {
  border: 4px solid #000;
  border-radius: 20px;
  font-weight: 900;
  color: #fff;
  cursor: pointer;
  transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 0 #000;
  text-transform: uppercase;
}

.menu-btn-toon.play {
  padding: 20px 60px;
  font-size: 2rem;
  background: #4caf50;
  box-shadow: 0 10px 0 #1b5e20, 0 15px 30px rgba(0, 0, 0, 0.4);
  animation: pulsePlay 2s infinite;
}

.secondary-btns {
  display: flex;
  gap: 15px;
}

.secondary-btns .menu-btn-toon {
  padding: 12px 25px;
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

/* ЭФФЕКТЫ */
.menu-btn-toon:hover {
  transform: scale(1.1) rotate(2deg);
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
    transform: scale(1.05);
  }
}

/* ВАРП-ВСПЫШКА */
.warp-overlay {
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 5000;
}

.warp-flash-enter-active, .warp-flash-leave-active {
  transition: opacity 0.3s;
}

.warp-flash-enter-from, .warp-flash-leave-to {
  opacity: 0;
}
</style>