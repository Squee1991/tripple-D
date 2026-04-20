<template>
  <div class="toon-navigation">
    <div class="toon-space-bg">
      <div class="nebula-purple"></div>
      <div class="nebula-blue"></div>
    </div>
    <div class="top-bar">
      <div class="exit-portal" @click="$emit('back')">
        <span class="exit-text">{{ t('galaxyRankTable.back')}}</span>
      </div>
      <div class="pilot-info-toon"></div>
    </div>
    <div class="constellations-map">
      <div
          v-for="(galaxy, index) in galaxiesWithIcons"
          :key="galaxy.id"
          :class="['galaxy-anchor', 'pos-' + (index + 1)]"
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
            <button class="btn-go big-btn" @click="startLevel">{{ t('galaxyMenu.begin')}}</button>
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
const { t } = useI18n()
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
.toon-navigation {
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, #1b0c3b 0%, #0d47a1 100%);
  overflow: hidden;
  font-family: 'Arial Rounded MT Bold', 'Helvetica', sans-serif;
  z-index: 5000;
  user-select: none;
}

.toon-space-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: radial-gradient(4px 4px at 20px 30px, #fff, rgba(0, 0, 0, 0)),
  radial-gradient(5px 5px at 80px 70px, #ffeb3b, rgba(0, 0, 0, 0)),
  radial-gradient(3px 3px at 50px 160px, #fff, rgba(0, 0, 0, 0)),
  radial-gradient(6px 6px at 120px 220px, #00d2ff, rgba(0, 0, 0, 0));
  background-size: 250px 250px;
  animation: starsTwinkle 3s infinite alternate;
}

@keyframes starsTwinkle {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.02);
    opacity: 1;
  }
}

.nebula-purple {
  position: absolute;
  top: -15%;
  left: -10%;
  width: 70%;
  height: 70%;
  background: radial-gradient(circle, rgba(255, 64, 129, 0.5), transparent 60%);
  filter: blur(60px);
}

.nebula-blue {
  position: absolute;
  bottom: -15%;
  right: -10%;
  width: 70%;
  height: 70%;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.5), transparent 60%);
  filter: blur(60px);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  position: relative;
  z-index: 10;
}

.main-title-toon {
  color: #ffeb3b;
  font-size: 3rem;
  text-transform: uppercase;
  -webkit-text-stroke: 2px #000;
  text-shadow: 1px 1px 0 #ffffff;
  transform: rotate(-3deg);
  letter-spacing: 2px;
}

.pilot-info-toon {
  padding: 10px 20px;
  border-radius: 50px;
  color: #fff;
  font-weight: 900;
}

.constellations-map {
  position: relative;
  height: 75vh;
  width: 100%;
}

.galaxy-anchor {
  position: absolute;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  transform: translate(-50%, -50%);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.galaxy-anchor:hover {
  transform: translate(-50%, -50%) scale(1.15);
  z-index: 100;
}


.galaxy-svg-toon {
  width: 130px;
  height: 130px;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
  animation: floatGalaxy 4s infinite ease-in-out;
}

.galaxy-icon-wrapper {
  transition: .4s;
}

.galaxy-anchor:hover .galaxy-icon-wrapper {
  transform: scale(1.1);
  transition: .4s;
}

@keyframes floatGalaxy {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
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
  height: auto;
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

.mission-desc {
  font-size: 1.2rem;
  color: #000;
  font-weight: bold;
  margin-bottom: 25px;
  line-height: 1.4;
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
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-window-enter-from {
  opacity: 0;
  transform: scale(0.5) translateY(50px);
}

.exit-portal {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 100;
}

.exit-portal:hover {
  transform: scale(1.1);
}

.event-horizon {
  position: absolute;
  inset: 25%;
  background: #000;
  border-radius: 50%;
  z-index: 2;
}

.exit-text {
  color: #fff;
  font-size: 1rem;
  background: #534bff;
  font-weight: 900;
  padding: 5px 10px;
  border-radius: 10px;
}

@keyframes rotatePortal {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.pos-1 {
  top: 18%;
  left: 16%;
}

.pos-2 {
  top: 18%;
  left: 50%;
}

.pos-3 {
  top: 18%;
  left: 84%;
}

.pos-4 {
  top: 48%;
  left: 33%;
}

.pos-5 {
  top: 48%;
  left: 67%;
}

.pos-6 {
  top: 78%;
  left: 16%;
}

.pos-7 {
  top: 78%;
  left: 50%;
}

.pos-8 {
  top: 78%;
  left: 84%;
}

@media (max-width: 768px) {
  .constellations-map {
    position: relative;
    height: auto;
    min-height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 40px 20px;
    padding: 30px;
    overflow-y: auto;
  }

  .galaxy-anchor {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    transform: none !important;
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .galaxy-anchor:hover {
    transform: scale(1.01) !important;
  }

  .galaxy-svg-toon {
    width: 90px !important;
    height: 90px !important;
  }

  .galaxy-label-toon {
    font-size: 0.9rem !important;
    text-align: center;
    margin-top: 10px;
    white-space: nowrap;
  }

  .top-bar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }

  .main-title-toon {
    font-size: 1.5rem !important;
  }

  .black-hole {
    width: 50px !important;
    height: 50px !important;
  }
}
</style>