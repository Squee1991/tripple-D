<template>
  <div class="toon-wrapper">

    <div class="top-bar">
      <div class="exit-portal" @click="$emit('back')">
        <span class="exit-text">{{ t('galaxyRankTable.back') }}</span>
      </div>
    </div>

    <div class="constellations-map">
      <div
          v-for="galaxy in galaxiesWithIcons"
          :key="galaxy.id"
          class="galaxy-anchor"
          @click="openGalaxy(galaxy)"
      >
        <div class="galaxy-icon-wrapper">
          <img :src="galaxy.svg" class="galaxy-svg-toon" alt="galaxy"/>
        </div>
        <h2 class="galaxy-label-toon">{{ t(galaxy.label) }}</h2>
      </div>
    </div>

    <Transition name="pop-window">
      <div v-if="activeGalaxy" class="modal-overlay" @click.self="activeGalaxy = null">
        <div class="toon-window">
          <button class="close-window" @click="activeGalaxy = null">✖</button>
          <div class="window-header">
            <div class="icon-frame">
              <img :src="activeGalaxy.svg" alt="" class="window-icon"/>
            </div>
            <div class="header-text">
              <h2>{{ t(activeGalaxy.name) }}</h2>
            </div>
          </div>
          <div class="mission-briefing">
            <button class="btn-go big-btn" @click="startLevel">{{ t('galaxyMenu.begin') }}</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useGalaxyStore} from '../../../store/galaxyStore.js'

import ConstellationOne from 'assets/images/constellation/constellation-1.svg'
import ConstellationTwo from 'assets/images/constellation/constellation-2.svg'
import ConstellationThree from 'assets/images/constellation/constellation-3.svg'
import ConstellationFour from 'assets/images/constellation/constellation-4.svg'
import ConstellationFive from 'assets/images/constellation/constellation-5.svg'
import ConstellationSix from 'assets/images/constellation/constellation-6.svg'
import ConstellationSeven from 'assets/images/constellation/constellation-7.svg'
import ConstellationEight from 'assets/images/constellation/constellation-8.svg'

const emit = defineEmits(['back', 'select-galaxy'])
const store = useGalaxyStore()
const activeGalaxy = ref(null)
const {t} = useI18n()

const iconMap = {
  alpha: ConstellationOne,
  beta: ConstellationTwo,
  gamma: ConstellationThree,
  delta: ConstellationFour,
  epsilon: ConstellationFive,
  zeta: ConstellationSix,
  eta: ConstellationSeven
}

onMounted(async () => {
  await store.fetchGalaxies()
})

const galaxiesWithIcons = computed(() => {
  return store.galaxies.map(galaxy => ({
    ...galaxy,
    svg: iconMap[galaxy.id] || ConstellationOne
  }))
})

const openGalaxy = (galaxy) => {
  activeGalaxy.value = galaxy
}

const startLevel = () => {
  store.setMission(activeGalaxy.value.id)
  emit('select-galaxy', activeGalaxy.value.id)
}
</script>

<style scoped>

.toon-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  overflow: hidden;
  font-family: Nunito, sans-serif;
  user-select: none;
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 10px 10px 2px 10px;
  flex-shrink: 0;
  margin-bottom: 45px;
}

.exit-portal {
  cursor: pointer;
  transition: transform 0.1s;
}

.exit-portal:active {
  transform: scale(0.95);
}

.exit-text {
  color: #fff;
  font-size: 1rem;
  background: #534bff;
  font-weight: 900;
  padding: 8px 14px;
  border-radius: 10px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5);
}

.constellations-map {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  gap: 25px;
  padding: 10px 20px 40px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.galaxy-anchor {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
  cursor: pointer;
  transition: transform 0.1s;
}

.galaxy-anchor:active {
  transform: scale(0.95);
}

.galaxy-svg-toon {
  width: 100px;
  height: 100px;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.2));
}

.galaxy-label-toon {
  color: var(--titleColor, #fff);
  font-size: 1.1rem;
  font-weight: 900;
  margin-top: 8px;
  text-align: center;
}

/* --- МОДАЛЬНОЕ ОКНО --- */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(10, 10, 46, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 6000;
  backdrop-filter: blur(8px);
}

.toon-window {
  background: #fff;
  border: 6px solid #000;
  border-radius: 24px;
  width: 90%;
  max-width: 360px;
  position: relative;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.close-window {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 45px;
  height: 45px;
  background: #ff5252;
  border: 4px solid #000;
  border-radius: 50%;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 0 #000;
  z-index: 20;
}

.close-window:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 #000;
}

.window-header {
  background: #593bff;
  border-bottom: 6px solid #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 24px 20px;
  text-align: center;
}

.icon-frame {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
  background: #fff;
  border: 4px solid #000;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 4px 4px 0 #000;
}

.window-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.header-text h2 {
  font-size: 1.3rem;
  margin: 0;
  color: #000;
  font-weight: 900;
  text-transform: uppercase;
  -webkit-text-stroke: 1px #fff;
}

.mission-briefing {
  padding: 20px;
  text-align: center;
  background: #f8f9fa;
}

.big-btn {
  width: 100%;
  padding: 16px;
  font-size: 1.5rem;
  background: #4caf50;
  color: #fff;
  border: 4px solid #000;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 900;
  text-transform: uppercase;
  box-shadow: 0 6px 0 #1b5e20;
  transition: transform 0.1s;
}

.big-btn:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #1b5e20;
}

.pop-window-enter-active {
  transition: all 0.2s ease-out;
}

.pop-window-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}
</style>