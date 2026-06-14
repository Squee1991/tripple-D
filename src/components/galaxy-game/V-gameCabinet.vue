<template>
  <div class="pilot-cabinet-fullscreen">
    <div class="menu-bg-layer">
      <div class="stars-layer"></div>
      <div class="nebula-cloud blue"></div>
      <div class="nebula-cloud purple"></div>
    </div>

    <div class="cabinet-header">
      <div class="exit-portal" @click="handleBack">
        <button class="btn-icon-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="cabinet-header-title">{{ t('galaxyCabinet.cabinet') }}</div>
      </div>
    </div>

    <div class="main-layout">
      <div class="side-panel">
        <h3 class="side-label">{{ t('galaxyCabinet.id') }}</h3>
        <div class="space-card profile-card">
          <div class="name-container">
            <div class="ship-icon-wrapper mobile-only-icon">
              <img :src="store.activeShip.img" class="ship-icon-mini" alt="icon"/>
            </div>

            <div class="edit-flow" v-if="isEditingName">
              <input
                  v-model="tempName"
                  @keyup.enter="handleSaveName"
                  class="space-input"
                  autofocus
                  :disabled="isSavingName"
              />
              <button class="space-btn save-name-btn" @click="handleSaveName" :disabled="isSavingName">
                <span v-if="isSavingName" class="loader"></span>
                <span v-else>OK</span>
              </button>
            </div>
            <h1 v-else @click="startEdit" class="display-name">
              {{ store.captainName }} <span class="edit-pen">✎</span>
            </h1>
          </div>
        </div>

        <div class="space-card ship-card desktop-only">
          <div class="ship-name-tag">{{ store.activeShip.name }}</div>
          <div class="ship-frame">
            <div class="hologram-platform"></div>
            <img :src="store.activeShip.img" class="ship-render toon-bounce" :alt="store.activeShip.name"/>
          </div>
        </div>
      </div>

      <div class="side-panel">
        <h3 class="side-label">{{ t('galaxyCabinet.journey') }}</h3>
        <div class="main-stats">
          <div class="space-card stat-card accent-yellow">
            <span class="stat-label">{{ t('galaxyCabinet.money') }}</span>
            <div class="stat-val-wrap">
              <img :src="Money" alt="currency" class="currency-icon-large">
              <span class="stat-val">{{ store.balance }}</span>
            </div>
          </div>
          <div class="space-card stat-card accent-blue">
            <span class="stat-label">{{ t('galaxyCabinet.commonPoints') }}</span>
            <div class="stat-val-wrap">
              <span class="stat-val">{{ totalPoints.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div class="galaxy-grid">
          <div
              v-for="g in galaxyList"
              :key="g.id"
              class="space-card galaxy-card"
              :style="{ '--g-color': g.color }"
              :class="{ is_locked: !(store.highScores[g.id] > 0) }"
          >
            <div class="g-header">
              <span class="g-title" :style="{ color: g.color }">{{ g.label }}</span>
              <div class="g-rank-badge">{{ t('galaxyCabinet.rank') }} {{
                  getRank(store.highScores[g.id] || 0).label
                }}
              </div>
            </div>
            <div class="g-body">
              <div class="g-score-line">
                <span class="score-highlight">{{ t('galaxyCabinet.streak') }} {{ store.highScores[g.id] || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useGalaxyStore} from '../../../store/galaxyStore.js'
import Money from '../../../assets/images/galaxy-images/Artics.svg'

const emit = defineEmits(['close'])
const store = useGalaxyStore()
const {t} = useI18n()

const isEditingName = ref(false)
const isSavingName = ref(false)
const tempName = ref(store.captainName)

const startEdit = () => {
  tempName.value = store.captainName
  isEditingName.value = true
}

const handleSaveName = async () => {
  if (!tempName.value.trim() || isSavingName.value) return
  isSavingName.value = true
  try {
    await store.setCaptainName(tempName.value)
    isEditingName.value = false
  } finally {
    isSavingName.value = false
  }
}

const handleBack = () => {
  if (isEditingName.value) {
    isEditingName.value = false
  } else {
    emit('close')
  }
}

const getRank = (score) => {
  if (score >= 200) return {label: t('galaxyRank.rank-legend'), class: 'rank-legend'}
  if (score >= 150) return {label: t('galaxyRank.rank-master'), class: 'rank-master'}
  if (score >= 100) return {label: t('galaxyRank.rank-ace'), class: 'rank-ace'}
  if (score >= 50) return {label: t('galaxyRank.rank-hunter'), class: 'rank-hunter'}
  if (score > 0) return {label: t('galaxyRank.rank-rookie'), class: 'rank-rookie'}
  return {label: t('galaxyRank.none'), class: 'rank-none'}
}

const galaxyList = [
  {id: 'alpha', label: t('galaxyList.alpha'), color: '#ff99c2'},
  {id: 'beta', label: t('galaxyList.beta'), color: '#66d9ff'},
  {id: 'gamma', label: t('galaxyList.gamma'), color: '#aaff66'},
  {id: 'delta', label: t('galaxyList.delta'), color: '#ffcc00'},
  {id: 'epsilon', label: t('galaxyList.epsilon'), color: '#b366ff'},
  {id: 'zeta', label: t('galaxyList.zeta'), color: '#ff6666'}
]

const totalPoints = computed(() => {
  if (!store.highScores) return 0
  return Object.values(store.highScores).reduce((a, b) => a + b, 0)
})

onMounted(async () => {
  await store.initUser()
  tempName.value = store.captainName
})
</script>

<style scoped>
.pilot-cabinet-fullscreen {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  background: #0b0e14;
  padding-top: env(safe-area-inset-top, 10px);
  padding-bottom: env(safe-area-inset-bottom, 20px);
  font-family: 'Nunito', sans-serif;
  overflow: hidden;
  user-select: none;
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
  from {
    background-position: 0 0;
  }
  to {
    background-position: 1000px 1000px;
  }
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

.cabinet-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  z-index: 10;
}

.exit-portal {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor, #ccc);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.exit-portal:active .btn-icon-back {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px transparent;
}

.cabinet-header-title {
  font-size: 20px;
  color: white;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  margin-left: 15px;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 30px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 20px 20px;
  -webkit-overflow-scrolling: touch;
  z-index: 10;
}

.main-layout::-webkit-scrollbar {
  width: 6px;
}

.main-layout::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.main-layout::-webkit-scrollbar-thumb {
  background: #303443;
  border-radius: 4px;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.side-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #8b95a8;
  margin: 0 0 -10px 10px;
  font-weight: 800;
}

.space-card {
  background: rgba(26, 28, 36, 0.85);
  border: 2px solid #303443;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  color: #fff;
  position: relative;
}

.profile-card {
  display: flex;
  justify-content: center;
}

.name-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.display-name {
  font-size: 2rem;
  margin: 0;
  cursor: pointer;
  color: #fff;
  text-align: center;
  font-weight: 900;
  transition: color 0.2s;
}

.display-name:hover {
  color: #ccff00;
}

.edit-pen {
  font-size: 1.2rem;
  color: #8b95a8;
  display: inline-block;
  margin-left: 5px;
}

.edit-flow {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10px;
}

.space-input {
  flex: 1;
  background: #11131a;
  border: 2px solid #00f2ff;
  border-radius: 12px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 800;
  padding: 12px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  box-shadow: 0 0 10px rgba(0, 242, 255, 0.2);
}

.space-input:disabled {
  opacity: 0.7;
}

.space-btn {
  background: #00f2ff;
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 0 #009eb3;
  transition: all 0.1s;
  min-width: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.space-btn:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0px 0 #009eb3;
}

.space-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.loader {
  width: 20px;
  height: 20px;
  border: 3px solid #000;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.ship-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.ship-name-tag {
  color: #00f2ff;
  font-size: 1.2rem;
  font-weight: 900;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.ship-frame {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 180px;
}

.hologram-platform {
  position: absolute;
  bottom: 10%;
  width: 120px;
  height: 20px;
  background: radial-gradient(ellipse at center, rgba(0, 242, 255, 0.3) 0%, transparent 70%);
}

.ship-render {
  width: 160px;
  z-index: 2;
  filter: drop-shadow(0 0 15px rgba(0, 242, 255, 0.4));
}

.toon-bounce {
  animation: floatEffect 4s ease-in-out infinite;
}

@keyframes floatEffect {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.main-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stat-card {
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
}

.accent-yellow {
  border-bottom: 4px solid #ccff00;
}

.accent-blue {
  border-bottom: 4px solid #00f2ff;
}

.stat-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #8b95a8;
}

.stat-val-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.currency-icon-large {
  width: 26px;
  height: 26px;
  object-fit: contain;
  filter: drop-shadow(0 0 5px rgba(204, 255, 0, 0.5));
}

.stat-val {
  font-size: 1.8rem;
  font-weight: 900;
  color: #fff;
}

.accent-yellow .stat-val {
  color: #ccff00;
}

.accent-blue .stat-val {
  color: #00f2ff;
}

.galaxy-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.galaxy-card {
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-left: 4px solid var(--g-color);
  transition: all 0.2s;
}

.galaxy-card.is_locked {
  opacity: 0.5;
  filter: grayscale(0.8);
  border-left-color: #555;
}

.g-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.g-title {
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}

.g-rank-badge {
  font-size: 0.75rem;
  font-weight: 800;
  background: #11131a;
  color: #8b95a8;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #303443;
}

.g-score-line {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
}

.score-highlight {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  color: #fff;
}

.mobile-only-icon {
  display: none;
}

@media (max-width: 900px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only-icon {
    display: flex;
    background: #11131a;
    border: 2px solid #303443;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    justify-content: center;
    align-items: center;
    box-shadow: inset 0 0 10px rgba(0, 242, 255, 0.2);
  }

  .ship-icon-mini {
    width: 50px;
    height: 50px;
    object-fit: contain;
    filter: drop-shadow(0 0 5px rgba(0, 242, 255, 0.5));
  }

  .edit-flow {
    flex-direction: column;
  }

  .space-btn {
    width: 100%;
  }

  .stat-val {
    font-size: 1.5rem;
  }
}
</style>