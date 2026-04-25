<template>
  <div class="toon-wrapper">
    <div class="menu-bg-layer">
      <div class="stars-layer"></div>
      <div class="nebula-cloud blue"></div>
      <div class="nebula-cloud purple"></div>
    </div>
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
    <Transition name="fade">
      <div v-if="activeGalaxy" class="modal-overlay" @click.self="activeGalaxy = null">
        <Transition name="pop-window" appear>
          <div class="discovery-card">
            <button class="close-btn" @click="activeGalaxy = null">✖</button>
            <div class="visual-stage">
              <div class="astro-side">
                <img src="../../../assets/images/galaxy-images/astonauntWithMap.svg" alt="astronaut" class="astro-unit">
              </div>
              <div class="projection-side">
                <div class="hologram-platform"></div>
                <img :src="activeGalaxy.svg" alt="galaxy" class="galaxy-projection"/>
              </div>
            </div>
            <div class="info-footer">
              <div class="title-wrap">
                <span class="location-tag">{{ t('galaxyMenu.findGalaxyTitle')}}</span>
                <h2 class="galaxy-name">{{ t(activeGalaxy.name) }}</h2>
              </div>
              <p class="galaxy-desc">
                {{
                  galaxyDescriptions[activeGalaxy.id] || 'Приготовьтесь к высадке! В этой области наблюдается повышенная активность. Зачистите сектор, чтобы восстановить порядок в системе.'
                }}
              </p>
              <button class="start-mission-btn" @click="startLevel">{{ t('galaxyMenu.start')}}</button>
            </div>
          </div>
        </Transition>
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

const galaxyDescriptions = {
  alpha: t('galaxyDescriptions.alpha'),
  beta: t('galaxyDescriptions.beta'),
  gamma: t('galaxyDescriptions.gamma'),
  delta: t('galaxyDescriptions.delta'),
  epsilon: t('galaxyDescriptions.epsilon'),
  zeta: t('galaxyDescriptions.zeta'),
}

const iconMap = {
  alpha: ConstellationOne,
  beta: ConstellationTwo,
  gamma: ConstellationThree,
  delta: ConstellationFour,
  epsilon: ConstellationFive,
  zeta: ConstellationSix,
  eta: ConstellationSeven,
  theta: ConstellationEight
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
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: #0b0e14;
  padding-top: env(safe-area-inset-top, 10px);
  padding-bottom: env(safe-area-inset-bottom, 20px);
  overflow: hidden;
}

.menu-bg-layer {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.stars-layer {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(2px 2px at 20px 30px, #fff, rgba(0, 0, 0, 0)),
  radial-gradient(2px 2px at 100px 150px, #fff, rgba(0, 0, 0, 0));
  background-size: 300px 300px;
  opacity: 0.3;
  animation: bgScroll 100s linear infinite;
}

@keyframes bgScroll {
  from { background-position: 0 0; }
  to { background-position: 1000px 1000px; }
}

.nebula-cloud {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
}

.nebula-cloud.blue {
  top: -10%;
  left: -10%;
  background: #3a7bd5;
}

.nebula-cloud.purple {
  bottom: -10%;
  right: -10%;
  background: #9c27b0;
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  flex-shrink: 0;
  z-index: 10;
}

.exit-text {
  color: #fff;
  font-size: 1rem;
  background: #ff0055;
  font-weight: 900;
  padding: 8px 18px;
  border-radius: 12px;
  border: 2px solid #000;
  box-shadow: 3px 3px 0 #000;
  text-transform: uppercase;
}

.constellations-map {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  gap: 25px;
  padding: 20px;
  overflow-y: auto;
  z-index: 10;
  -webkit-overflow-scrolling: touch;
}

.galaxy-anchor {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 130px;
  cursor: pointer;
}

.galaxy-svg-toon {
  width: 90px;
  height: 90px;
  filter: drop-shadow(0 0 10px rgba(0, 242, 255, 0.3));
}

.galaxy-label-toon {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 900;
  margin-top: 10px;
  text-align: center;
}


.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.24);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 7000;
  backdrop-filter: blur(10px);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.discovery-card {
  background: #1a1c24;
  border-top: 3px solid #303443;
  border-radius: 40px 40px 0 0;
  width: 100%;
  position: relative;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 35px;
  height: 35px;
  background: #ff3e3e;
  border: none;
  border-radius: 50%;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
}

.visual-stage {
  display: flex;
  padding: 30px 20px 0;
  height: 160px;
  align-items: flex-end;
  justify-content: space-around;
  background: linear-gradient(to bottom, rgba(83, 75, 255, 0.1), transparent);
  border-radius: 40px 40px 0 0;
}

.astro-unit {
  width: 120px;
  height: auto;
}

.projection-side {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
}

.galaxy-projection {
  width: 80px;
  z-index: 2;
  animation: floatEffect 6s ease-in-out infinite;
  filter: drop-shadow(0 0 15px rgba(0, 242, 255, 0.6));
}

.hologram-platform {
  position: absolute;
  bottom: 0;
  width: 60px;
  height: 15px;
  background: #00f2ff;
  filter: blur(15px);
  opacity: 0.2;
}

@keyframes floatEffect {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.info-footer {
  padding: 20px 30px 30px;
  text-align: center;
}

.location-tag {
  color: #6f69e8;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 2px;
}

.galaxy-name {
  color: #fff;
  font-size: 22px;
  margin: 5px 0 10px;
  text-transform: uppercase;
  font-weight: 900;
}

.galaxy-desc {
  color: #a0aec0;
  font-size: 0.85rem;
  line-height: 1.4;
  margin-bottom: 20px;
}

.start-mission-btn {
  width: 100%;
  padding: 15px;
  background: #ccff00;
  border: none;
  border-radius: 20px;
  color: #000;
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 6px 0 #89aa00;
  transition: all 0.1s;
}

.start-mission-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #89aa00;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.pop-window-enter-active, .pop-window-leave-active {
  transition: transform 0.2s ease-out;
}

.pop-window-enter-from, .pop-window-leave-to {
  transform: translateY(100%);
}

</style>