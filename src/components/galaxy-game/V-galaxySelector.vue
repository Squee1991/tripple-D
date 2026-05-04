<template>
  <div class="toon-wrapper">
    <div class="menu-bg-layer">
      <div class="stars-layer"></div>
      <div class="nebula-cloud blue"></div>
      <div class="nebula-cloud purple"></div>
    </div>
    <div class="header-section">
      <div class="top-bar">
        <div class="exit-portal" @click="$emit('back')">
          <button class="btn-icon-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div class="topbar__title">{{t('galaxySelector.constellations')}}</div>
        </div>
      </div>
      <div class="battery-banner">
        <div class="banner-left">
          <div class="banner-info">
            <div class="banner-title">{{ store.activeShip.name }}</div>
            <div class="banner-sub">{{t('galaxySelector.energy')}}</div>
          </div>
          <div class="battery-status">
            <div class="battery-container" :style="{ '--charge-progress': chargeProgressPercent + '%' }">
              <div class="battery-segment segment-red" :class="{ active: store.currentBattery >= 1, charging: store.currentBattery === 0 && !isPremium }"></div>
              <div class="battery-segment segment-yellow" :class="{ active: store.currentBattery >= 2, charging: store.currentBattery === 1 && !isPremium }"></div>
              <div class="battery-segment segment-green" :class="{ active: store.currentBattery >= 3, charging: store.currentBattery === 2 && !isPremium }"></div>
            </div>
            <div class="battery-timer cosmic-font">
              <span v-if="isPremium" class="premium-text">PLUS ∞</span>
              <span v-else class="charging-text">{{ timeToNext }}</span>
            </div>
          </div>
        </div>
        <img :src="store.activeShip.img" class="active-ship-icon" alt="ship" />
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
    <Transition name="modal">
      <div v-if="activeGalaxy" class="modal-overlay" @click.self="activeGalaxy = null">
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
              <span class="location-tag">{{ t('galaxyMenu.findGalaxyTitle') }}</span>
              <h2 class="galaxy-name">{{ t(activeGalaxy.name) }}</h2>
            </div>
            <p class="galaxy-desc">
              {{ galaxyDescriptions[activeGalaxy.id] || 'Приготовьтесь к высадке! В этой области наблюдается повышенная активность немецкого языка. Зачистите сектор, чтобы восстановить порядок в системе.' }}
            </p>
            <button class="start-mission-btn" @click="startLevel">{{ t('galaxyMenu.start') }}</button>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="modal">
      <div v-if="showPlusModal" class="modal-overlay" @click.self="showPlusModal = false">
        <div class="discovery-card">
          <button class="close-btn" @click="showPlusModal = false">✖</button>
          <div class="visual-stage">
            <div class="astro-side">
              <img src="../../../assets/images/galaxy-images/astonauntWithMap.svg" alt="astronaut" class="astro-unit">
            </div>
            <div class="projection-side">
              <div class="hologram-platform plus-glow"></div>
              <img :src="lockedGalaxy?.svg" alt="galaxy" class="galaxy-projection plus-floating"/>
            </div>
          </div>
          <div class="info-footer">
            <div class="title-wrap">
              <span class="location-tag plus-tag">{{t('galaxySelector.sectorBlock')}}</span>
              <h2 class="galaxy-name">{{t('galaxySelector.admission')}}</h2>
            </div>
            <p class="galaxy-desc">
              {{t('galaxySelector.descriptionPlusOne')}} <b>{{ lockedGalaxy ? t(lockedGalaxy.name) : '' }}</b> {{t('galaxySelector.descriptionPlusTwo')}} <b>PLUS</b>.
              {{t('galaxySelector.descriptionPlusThree')}}
            </p>
            <button class="start-mission-btn plus-btn" @click="goToPay">{{t('galaxySelector.getPlusBtn')}}</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useGalaxyStore} from '../../../store/galaxyStore.js'
import {userAuthStore} from '../../../store/authStore.js'

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
const authStore = userAuthStore()
const router = useRouter()

const activeGalaxy = ref(null)
const showPlusModal = ref(false)
const lockedGalaxy = ref(null)
const timeToNext = ref('00:00')
const chargeProgressPercent = ref(0)
let timerInterval = null
const {t} = useI18n()

const isPremium = computed(() => authStore.isPremium)

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

const updateTimer = () => {
  if (isPremium.value || store.currentBattery >= 3) {
    timeToNext.value = ''
    chargeProgressPercent.value = 100
    return
  }

  store.checkBatteryRegen()

  const now = Date.now()
  const REGEN_MS = 60 * 60 * 1000
  const nextRegen = store.currentBatteryRegen + REGEN_MS
  const diff = nextRegen - now

  if (diff <= 0) {
    store.checkBatteryRegen()
    return
  }

  chargeProgressPercent.value = Math.max(0, Math.min(100, ((REGEN_MS - diff) / REGEN_MS) * 100))

  const m = Math.floor(diff / 1000 / 60)
  const s = Math.floor((diff / 1000) % 60)
  timeToNext.value = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

onMounted(async () => {
  await store.fetchGalaxies()
  updateTimer()
  timerInterval = setInterval(updateTimer, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

const galaxiesWithIcons = computed(() => {
  return store.galaxies.map(galaxy => ({
    ...galaxy,
    svg: iconMap[galaxy.id] || ConstellationOne
  }))
})

const openGalaxy = (galaxy) => {
  if (galaxy.id === 'alpha' || isPremium.value) {
    activeGalaxy.value = galaxy
  } else {
    lockedGalaxy.value = galaxy
    showPlusModal.value = true
  }
}

const startLevel = () => {
  store.setMission(activeGalaxy.value.id)
  emit('select-galaxy', activeGalaxy.value.id)
}

const goToPay = () => {
  router.push('/pay')
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
  background-image: radial-gradient(2px 2px at 20px 30px, #fff, transparent),
  radial-gradient(2px 2px at 100px 150px, #fff, transparent);
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
  opacity: 0.2;
}

.nebula-cloud.blue {
  top: -10%;
  left: -10%;
  background: radial-gradient(circle, #3a7bd5 0%, transparent 70%);
}

.nebula-cloud.purple {
  bottom: -10%;
  right: -10%;
  background: radial-gradient(circle, #9c27b0 0%, transparent 70%);
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 5px 10px 15px 10px;
  z-index: 10;
}

.top-bar {
  display: flex;
  align-items: center;
}

.exit-portal {
  display: flex;
  align-items: center;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.topbar__title {
  font-size: 23px;
  color: white;
  font-weight: 600;
  text-shadow: 1px 1px white;
  margin-left: 15px;
}

.battery-banner {
  background: rgba(26, 28, 36, 0.85);
  border: 2px solid #303443;
  border-radius: 16px;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

.banner-left {
  display: flex;
  flex-direction: column;
}

.banner-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.banner-title {
  color: #fff;
  font-size: 21px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.banner-sub {
  color: #8b95a8;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 5px;
}

.active-ship-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 0 5px rgba(0, 242, 255, 0.5));
}

.battery-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.battery-container {
  display: flex;
  gap: 4px;
  padding: 6px;
  background: #11131a;
  border: 2px solid #303443;
  border-radius: 6px;
}

.battery-segment {
  width: 16px;
  height: 12px;
  background: #222;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.segment-red { --seg-color: #ff4b2b; }
.segment-yellow { --seg-color: #ffeb3b; }
.segment-green { --seg-color: #00e676; }

.segment-red.active,
.segment-yellow.active,
.segment-green.active {
  background: var(--seg-color);
}

.segment-red.charging,
.segment-yellow.charging,
.segment-green.charging {
  background: linear-gradient(to right, var(--seg-color) var(--charge-progress), #222 var(--charge-progress));
}

.charging::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--seg-color), transparent);
  opacity: 0.6;
  transform: translate3d(0, 0, 0);
  animation: lightweightChargeSweep 1.2s infinite linear;
}

@keyframes lightweightChargeSweep {
  to { transform: translate3d(200%, 0, 0); }
}

.cosmic-font {
  font-family: 'Courier New', Courier, monospace;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 2px;
}

.premium-text { color: #ff007a; }
.max-text { color: #00e676; }
.charging-text {
  color: #00f2ff;
  font-size: 16px;
}

.constellations-map {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  gap: 25px;
  padding: 30px 20px 20px 20px;
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 7000;
  padding-bottom: env(safe-area-inset-bottom, 0);
  overflow: hidden;
}

.discovery-card {
  background: #1a1c24;
  border-top: 3px solid #303443;
  border-radius: 40px 40px 0 0;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .discovery-card,
.modal-leave-active .discovery-card {
  transition: transform 0.25s ease-out;
}

.modal-enter-from .discovery-card,
.modal-leave-to .discovery-card {
  transform: translate3d(0, 100%, 0);
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
}

.hologram-platform {
  position: absolute;
  bottom: 0;
  width: 60px;
  height: 15px;
  background: radial-gradient(ellipse at center, rgba(0, 242, 255, 0.3) 0%, transparent 70%);
}

.hologram-platform.plus-glow {
  background: radial-gradient(ellipse at center, rgba(255, 0, 122, 0.3) 0%, transparent 70%);
}

.galaxy-projection.plus-floating {
  filter: grayscale(100%) opacity(0.8);
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

.location-tag.plus-tag {
  color: #ff007a;
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

.plus-btn {
  background: linear-gradient(135deg, #ff007a 0%, #7a00ff 100%);
  color: white;
  box-shadow: 0 6px 0 #4a0099;
}

.plus-btn:active {
  box-shadow: 0 2px 0 #4a0099;
}
</style>