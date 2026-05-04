<template>
  <div class="pilot-cabinet-fullscreen">
    <div class="cabinet-bg">
      <div class="dot-pattern"></div>
    </div>
    <div class="cabinet-header">
      <button @click="handleBack" class="btn-icon-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="#2b2b2b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <div class="cabinet-header-title">{{ t('galaxyCabinet.cabinet')}}</div>
    </div>
    <div class="main-layout">
      <div class="side-panel">
        <h3 class="side-label">{{t('galaxyCabinet.id')}}</h3>
        <div class="toon-card profile-card">
          <div class="name-container">
            <div class="ship-icon-wrapper mobile-only-icon">
              <img :src="store.activeShip.img" class="ship-icon-mini" alt="icon"/>
            </div>

            <div class="edit-flow" v-if="isEditingName">
              <input
                  v-model="tempName"
                  @keyup.enter="handleSaveName"
                  class="toon-input"
                  autofocus
              />
              <button class="toon-btn save-name-btn" @click="handleSaveName">OK</button>
            </div>
            <h1 v-else @click="startEdit" class="display-name">
              {{ store.captainName }} <span class="edit-pen">✎</span>
            </h1>
          </div>
        </div>
        <div class="toon-card ship-card desktop-only">
          <div class="ship-name-tag">{{ store.activeShip.name }}</div>
          <div class="ship-frame">
            <div class="star burst-1">✦</div>
            <div class="star burst-2">✦</div>
            <img :src="store.activeShip.img" class="ship-render toon-bounce" :alt="store.activeShip.name"/>
          </div>
        </div>
      </div>
      <div class="side-panel">
        <h3 class="side-label">{{t('galaxyCabinet.journey')}}</h3>
        <div class="main-stats">
          <div class="toon-card stat-card yellow">
            <span class="stat-label">{{t('galaxyCabinet.money')}}</span>
            <span class="stat-val">{{ store.balance }} Ⓐ</span>
          </div>
          <div class="toon-card stat-card blue">
            <span class="stat-label">{{t('galaxyCabinet.commonPoints')}}</span>
            <span class="stat-val">{{ totalPoints.toLocaleString() }}</span>
          </div>
        </div>
        <div class="galaxy-grid">
          <div
              v-for="g in galaxyList"
              :key="g.id"
              class="toon-card galaxy-card"
              :style="{ backgroundColor: g.color }"
              :class="{ is_locked: !(store.highScores[g.id] > 0) }"
          >
            <div class="g-header">
              <span class="g-title">{{ g.label }}</span>
              <div class="g-rank-badge">{{t('galaxyCabinet.rank')}} {{ getRank(store.highScores[g.id] || 0).label }}</div>
            </div>
            <div class="g-body">
              <div class="g-score-line">
                <span class="score-highlight">{{t('galaxyCabinet.streak')}} {{ store.highScores[g.id] || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGalaxyStore } from '../../../store/galaxyStore.js'

const emit = defineEmits(['close'])
const store = useGalaxyStore()
const { t } = useI18n()
const isEditingName = ref(false)
const tempName = ref(store.captainName)

const startEdit = () => {
  window.history.pushState({ isEditingProfile: true }, '')
  tempName.value = store.captainName
  isEditingName.value = true
}

const handleSaveName = async (event) => {
  if (tempName.value.trim()) {
    await store.setCaptainName(tempName.value)
  }
  if (isEditingName.value) {
    window.history.back()
  }
}

const handleBack = () => {
  if (isEditingName.value) {
    window.history.back()
  } else {
    emit('close')
  }
}

const handlePopState = () => {
  if (isEditingName.value) {
    isEditingName.value = false
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
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})
</script>

<style scoped>

.pilot-cabinet-fullscreen {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #1a1a1a;
  box-sizing: border-box;
  font-family: Nunito, sans-serif;
  overflow: hidden;
  user-select: none;
}

.cabinet-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.cabinet-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
}

.cabinet-header-title {
  color: whitesmoke;
  font-size: 24px;
  font-weight: 600;
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
  padding: 0 15px;
  padding-bottom: 20px;
  -webkit-overflow-scrolling: touch;
}

.main-layout::-webkit-scrollbar {
  width: 4px;
  display: none;
}
.main-layout::-webkit-scrollbar-track {
  border-radius: 4px;
}
.main-layout::-webkit-scrollbar-thumb {
  border-radius: 4px;
}
.main-layout::-webkit-scrollbar-thumb:active {
  background: #ff4757;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.side-label {
  font-size: 1.1rem;
  background: #1a1a1a;
  color: #fff;
  padding: 5px 15px;
  border-radius: 10px;
  align-self: flex-start;
  margin-bottom: -15px;
  z-index: 5;
  transform: rotate(-1deg);
  border: 2px solid #fff;
}

.toon-card {
  background: #fff;
  border: 2px solid #1a1a1a;
  border-radius: 25px;
  padding: 20px;
  box-shadow: 3px 3px 0 #1a1a1a;
  position: relative;
  flex-shrink: 0;
}

.profile-card {
  transform: rotate(1deg);
  padding-top: 20px;
  background: #fff9e6;
}

.name-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.edit-flow {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.toon-input {
  flex: 1;
  border: 4px solid #1a1a1a;
  border-radius: 15px;
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: 900;
  padding: 10px;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  box-shadow: inset 4px 4px 0 rgba(0, 0, 0, 0.05);
}

.display-name {
  font-size: 2.5rem;
  margin: 0;
  cursor: pointer;
  color: #1a1a1a;
  text-align: center;
  text-shadow: 2px 2px 0 #fff, 3px 3px 0 #1a1a1a;
  word-break: break-all;
}

.edit-pen {
  font-size: 1.5rem;
  opacity: 0.5;
  display: inline-block;
  transform: rotate(15deg);
}

.toon-btn {
  background: #fff;
  border: 4px solid #1a1a1a;
  border-radius: 15px;
  padding: 10px 20px;
  font-weight: 900;
  font-size: 1.1rem;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 4px 0 #1a1a1a;
  transition: all 0.1s ease;
  text-transform: uppercase;
}

.toon-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 #1a1a1a;
}

.back-btn {
  background: #ff4757;
  color: white;
}

.save-name-btn {
  background: #2ed573;
  color: #1a1a1a;
  padding: 10px 20px;
}

.mobile-only-icon {
  display: none;
}

.ship-icon-wrapper {
  background: #e0f7fa;
  border: 4px solid #1a1a1a;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  justify-content: center;
  align-items: center;
  box-shadow: inset -4px -4px 0 rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.ship-icon-mini {
  width: 55px;
  height: 55px;
  object-fit: contain;
}

.ship-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f1f2f6;
}

.ship-name-tag {
  background: #1a1a1a;
  color: #ccff00;
  padding: 8px 20px;
  font-size: 1.2rem;
  font-weight: 900;
  border-radius: 15px;
  margin-bottom: 20px;
  border: 3px solid #fff;
}

.ship-frame {
  flex: 1;
  width: 100%;
  background: #70a1ff;
  border: 5px solid #1a1a1a;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: inset 5px 5px 0 rgba(0, 0, 0, 0.2);
  min-height: 200px;
  padding: 25px;
}

.star {
  position: absolute;
  color: #fff;
  font-size: 2rem;
}

.burst-1 { top: 10%; left: 10%; animation: twinkle 1s infinite alternate; }
.burst-2 { bottom: 15%; right: 15%; animation: twinkle 1.5s infinite alternate; }

.toon-bounce {
  width: 180px;
  animation: toonFloat 2s infinite cubic-bezier(0.445, 0.05, 0.55, 0.95);
  filter: drop-shadow(4px 4px 0 rgba(0, 0, 0, 0.3));
}

.main-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stat-card {
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-card.yellow { background: #ffa502; }
.stat-card.blue { background: #1e90ff; color: white; }

.stat-label {
  font-size: 0.9rem;
  font-weight: 900;
  text-transform: uppercase;
  color: #1a1a1a;
}

.stat-card.blue .stat-label { color: #fff; }

.stat-val {
  font-size: 2.2rem;
  font-weight: 900;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.galaxy-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.galaxy-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
  padding: 10px;
}

.galaxy-card.is_locked {
  opacity: 0.6;
  filter: grayscale(0.8);
  background: #bdc3c7 !important;
  border-style: dashed;
}

.g-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.g-title {
  font-size: 1rem;
  font-weight: 900;
  text-shadow: 1px 1px 0 #fff;
}

.g-rank-badge {
  font-size: 0.7rem;
  font-weight: 900;
  background: #1a1a1a;
  color: #fff;
  padding: 5px 10px;
  border-radius: 10px;
  border: 2px solid #fff;
  width: 145px;
}

.g-score-line {
  font-size: 1rem;
  font-weight: 900;
  margin: 15px 0 10px 0;
}

.score-highlight {
  background: #fff;
  padding: 2px 8px;
  border-radius: 5px;
  border: 2px solid #1a1a1a;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid #2b2b2b;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 2px 0px #2b2b2b;
  transition: transform 0.1s, box-shadow 0.1s;
}

@keyframes toonFloat {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-1px) scale(1.01); }
}

@keyframes twinkle {
  from { opacity: 0.3; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1.2); }
}

@media (max-width: 900px) {
  .cabinet-header {
    margin-bottom: 15px;
  }

  .main-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only-icon {
    display: flex;
  }

  .edit-flow {
    flex-direction: column;
    align-items: stretch;
  }

  .toon-input {
    font-size: 1.2rem;
  }

  .save-name-btn {
    width: 100%;
    box-sizing: border-box;
  }

  .display-name {
    font-size: 2rem;
  }

  .main-stats {
    gap: 10px;
  }

  .stat-val {
    font-size: 1.8rem;
  }
}
</style>