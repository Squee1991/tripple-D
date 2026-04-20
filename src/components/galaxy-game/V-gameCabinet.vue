<script setup>
import {ref, computed, onMounted} from 'vue'
import {useGalaxyStore} from '../../../store/galaxyStore.js'

const emit = defineEmits(['close'])
const store = useGalaxyStore()
const { t } = useI18n()
const isEditingName = ref(false)
const tempName = ref(store.captainName)

const startEdit = () => {
  tempName.value = store.captainName
  isEditingName.value = true
}

const handleSaveName = async (event) => {
  console.log('handleSaveName вызван с аргументом:', event);
  if (tempName.value.trim()) {
    await store.setCaptainName(tempName.value)
  }
  isEditingName.value = false
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

<template>
  <div class="pilot-cabinet-fullscreen">
    <div class="cabinet-bg">
      <div class="dot-pattern"></div>
    </div>
    <div class="cabinet-header">
      <button class="toon-btn back-btn" @click="$emit('close')">◀ {{t('galaxyCabinet.back')}}</button>
      <div class="sync-pill"></div>
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

<style scoped>

.pilot-cabinet-fullscreen {
  position: fixed;
  inset: 0;
  max-width: 1300px;
  margin: 0 auto;
  height: 100%;
  z-index: 5000;
  background: #3b28cc;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  font-family: 'Comic Sans MS', 'Arial Black', sans-serif;
  overflow: hidden;
}

.cabinet-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: repeating-linear-gradient(
      45deg,
      #4d3ae0,
      #4d3ae0 20px,
      #3b28cc 20px,
      #3b28cc 40px
  );
}

.dot-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#ffffff 4px, transparent 4px);
  background-size: 50px 50px;
  opacity: 0.15;
}

.cabinet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  flex-shrink: 0;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 30px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 15px;
  padding-bottom: 30px;
}

.main-layout::-webkit-scrollbar {
  width: 2px;
  display: none;
}

.main-layout::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);

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

.burst-1 {
  top: 10%;
  left: 10%;
  animation: twinkle 1s infinite alternate;
}

.burst-2 {
  bottom: 15%;
  right: 15%;
  animation: twinkle 1.5s infinite alternate;
}

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

.stat-card.yellow {
  background: #ffa502;
}

.stat-card.blue {
  background: #1e90ff;
  color: white;
}

.stat-label {
  font-size: 0.9rem;
  font-weight: 900;
  text-transform: uppercase;
  color: #1a1a1a;
}

.stat-card.blue .stat-label {
  color: #fff;
}

.stat-val {
  font-size: 2.2rem;
  font-weight: 900;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.galaxy-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
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

.xp-track-wrapper {
  background: #fff;
  border: 4px solid #1a1a1a;
  border-radius: 15px;
  padding: 3px;
  box-shadow: inset 3px 3px 0 rgba(0, 0, 0, 0.1);
}

.xp-track {
  height: 18px;
  border-radius: 10px;
  overflow: hidden;
  background: #f1f2f6;
}

.xp-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toon-stripes {
  background-color: #ff4757;
  background-image: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
  );
  background-size: 20px 20px;
  animation: moveStripes 1s linear infinite;
}

@keyframes toonFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-1px) scale(1.01);
  }
}

@keyframes twinkle {
  from {
    opacity: 0.3;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes moveStripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 0;
  }
}

@media (max-width: 900px) {
  .cabinet-header {
    margin-bottom: 15px;
  }

  .main-layout {
    grid-template-columns: 1fr;
    gap: 20px;
    padding-right: 5px;
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