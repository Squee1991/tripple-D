<script setup>
import {ref, computed, onMounted} from 'vue'
import {useGalaxyStore} from '../../store/galaxyStore.js'

const emit = defineEmits(['close'])
const store = useGalaxyStore()

const isEditingName = ref(false)
const tempName = ref(store.captainName)

const startEdit = () => {
  tempName.value = store.captainName
  isEditingName.value = true
}

const handleSaveName = async () => {
  if (tempName.value.trim()) {
    await store.setCaptainName(tempName.value)
  }
  isEditingName.value = false
}

// Ранги на основе рекорда
const getRank = (score) => {
  if (score >= 150) return {label: 'ЛЕГЕНДА', class: 'rank-legend'}
  if (score >= 80) return {label: 'МАСТЕР', class: 'rank-master'}
  if (score >= 40) return {label: 'АС', class: 'rank-ace'}
  if (score >= 15) return {label: 'ОХОТНИК', class: 'rank-hunter'}
  if (score > 0) return {label: 'НОВИЧОК', class: 'rank-rookie'}
  return {label: 'НЕИЗВЕСТНО', class: 'rank-none'}
}

const galaxyList = [
  {id: 'alpha', label: 'АЛЬФА', color: '#ffccf9'},
  {id: 'beta', label: 'БЕТА', color: '#ccf2ff'},
  {id: 'gamma', label: 'ГАММА', color: '#e2ffcc'},
  {id: 'delta', label: 'ДЕЛЬТА', color: '#fff0cc'},
  {id: 'epsilon', label: 'ЭПСИЛОН', color: '#d9ccff'},
  {id: 'zeta', label: 'ЗЕТА', color: '#ffcccc'}
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
      <button class="back-btn-sticker" @click="$emit('close')">◀ НАЗАД</button>
      <div class="cabinet-tag">КАБИНА</div>
      <div class="sync-pill">🟢</div>
    </div>

    <div class="main-layout">
      <div class="side-panel">
        <h3 class="side-label">ИДЕНТИФИКАЦИЯ</h3>
        <div class="sticker-card profile-card">
          <label class="input-label">КАПИТАН СУДНА:</label>
          <div class="name-container">
            <img :src="store.activeShip.img" class="ship-icon-mini" alt="icon"/>

            <div class="edit-flow" v-if="isEditingName">
              <input
                  v-model="tempName"
                  @keyup.enter="handleSaveName"
                  class="sticker-input"
                  autofocus
              />
              <button class="save-name-btn" @click="handleSaveName">OK</button>
            </div>

            <h1 v-else @click="startEdit" class="display-name">
              {{ store.captainName }} <span class="edit-pen">✎</span>
            </h1>
          </div>
        </div>

        <div class="sticker-card ship-card desktop-only">
          <div class="tape-strip"></div>
          <div class="ship-name-tag">{{ store.activeShip.name }}</div>
          <div class="ship-frame">
            <img :src="store.activeShip.img" class="ship-render" :alt="store.activeShip.name"/>
          </div>
        </div>
      </div>

      <div class="side-panel">
        <h3 class="side-label">ЛОГ ВЫЛЕТОВ И ДОСТИЖЕНИЙ</h3>

        <div class="main-stats">
          <div class="stat-sticker yellow">
            <span class="stat-label">АРТИКСЫ</span>
            <span class="stat-val">{{ store.balance }} Ⓐ</span>
          </div>
          <div class="stat-sticker blue">
            <span class="stat-label">ОБЩИЙ ОПЫТ</span>
            <span class="stat-val">{{ totalPoints.toLocaleString() }}</span>
          </div>
        </div>

        <div class="galaxy-grid">
          <div
              v-for="g in galaxyList"
              :key="g.id"
              class="galaxy-card"
              :style="{ backgroundColor: g.color }"
              :class="{ is_locked: !(store.highScores[g.id] > 0) }"
          >
            <div class="g-header">
              <span class="g-title">{{ g.label }}</span>
              <div class="g-rank-badge">{{ getRank(store.highScores[g.id] || 0).label }}</div>
            </div>

            <div class="g-body">
              <div class="g-score-line">РЕКОРД: <b>{{ store.highScores[g.id] || 0 }}</b></div>

              <div class="xp-track">
                <div
                    class="xp-bar"
                    :style="{ width: Math.min((store.highScores[g.id] || 0) * 1.5, 100) + '%' }"
                ></div>
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
  width: 100vw;
  height: 100vh;
  z-index: 5000;
  background: #f4f4f2;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  padding: 30px;
  box-sizing: border-box;
  font-family: 'Arial Black', sans-serif;
  overflow: hidden;
}

.cabinet-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.dot-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#d1d1d1 1.5px, transparent 1.5px);
  background-size: 25px 25px;
}

.cabinet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.back-btn-sticker {
  background: #fff;
  border: 3px solid #1a1a1a;
  padding: 10px 20px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 4px 4px 0 #1a1a1a;
}

.cabinet-tag {
  background: #ccff00;
  border: 3px solid #1a1a1a;
  padding: 10px 30px;
  font-weight: 900;
  transform: rotate(-1deg);
  box-shadow: 5px 5px 0 #1a1a1a;
}

.sync-pill {
  font-size: 0.7rem;
  font-weight: 900;
  color: #2ecc71;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 30px;
  flex: 1;
  margin-top: 10px;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.side-label {
  font-size: 0.8rem;
  background: #1a1a1a;
  color: #fff;
  padding: 2px 10px;
  align-self: flex-start;
  transform: rotate(-1deg);
  margin-bottom: -15px;
  z-index: 5;
}

.sticker-card {
  background: #fff;
  border: 3px solid #1a1a1a;
  padding: 20px;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.05);
  position: relative;
}

.profile-card {
  transform: rotate(0.5deg);
  padding-top: 30px;
}

/* ОБНОВЛЕННЫЙ КОНТЕЙНЕР ИМЕНИ */
.name-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 5px;
  min-height: 60px;
}

.ship-icon-mini {
  width: 50px;
  height: 50px;
  object-fit: contain;
  filter: drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
}

.edit-flow {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.sticker-input {
  flex: 1;
  border: 3px solid #1a1a1a;
  font-size: 1.5rem;
  font-family: inherit;
  font-weight: 900;
  padding: 8px;
  background: #fff;
}

.save-name-btn {
  background: #1a1a1a;
  color: #fff;
  border: none;
  padding: 10px 15px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 4px 4px 0 #ccff00;
}

.save-name-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #ccff00;
}

.display-name {
  font-size: 2.2rem;
  margin: 0;
  cursor: pointer;
  letter-spacing: -1px;
}

.edit-pen {
  font-size: 1.2rem;
  opacity: 0.2;
}

.input-label {
  font-size: 0.7rem;
  opacity: 0.5;
  display: block;
  margin-bottom: 5px;
}

/* ОСТАЛЬНЫЕ СТИЛИ */
.ship-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: rotate(-0.5deg);
}

.tape-strip {
  position: absolute;
  top: -12px;
  width: 80px;
  height: 25px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.ship-name-tag {
  background: #1a1a1a;
  color: #fff;
  padding: 5px 15px;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.ship-frame {
  flex: 1;
  width: 100%;
  background: #eef2f5;
  border: 3px solid #1a1a1a;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ship-render {
  width: 220px;
  animation: float 4s infinite ease-in-out;
}

.main-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.stat-sticker {
  border: 3px solid #1a1a1a;
  padding: 15px;
  box-shadow: 6px 6px 0 #1a1a1a;
}

.stat-sticker.yellow {
  background: #fff566;
}

.stat-sticker.blue {
  background: #7ae7ff;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 900;
  opacity: 0.7;
  display: block;
}

.stat-val {
  font-size: 1.8rem;
  font-weight: 900;
}

.galaxy-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  flex: 1;
}

.galaxy-card {
  border: 3px solid #1a1a1a;
  padding: 15px;
  box-shadow: 4px 4px 0 #1a1a1a;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.galaxy-card.is_locked {
  opacity: 0.4;
  filter: grayscale(1);
  border-style: dashed;
}

.g-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.g-title {
  font-size: 1.1rem;
  font-weight: 900;
}

.g-rank-badge {
  font-size: 0.6rem;
  background: #1a1a1a;
  color: #fff;
  padding: 2px 6px;
}

.g-score-line {
  font-size: 0.8rem;
  margin: 10px 0 5px 0;
}

.xp-track {
  height: 12px;
  background: #fff;
  border: 2px solid #1a1a1a;
  position: relative;
  overflow: hidden;
}

.xp-bar {
  height: 100%;
  background: #1a1a1a;
  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%);
  background-size: 10px 10px;
}

.cabinet-footer {
  text-align: center;
  padding: 15px;
  opacity: 0.3;
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 3px;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

@media (max-width: 767px) {
  .pilot-cabinet-fullscreen {
    padding: 15px;
    overflow-y: auto;
  }

  .main-layout {
    grid-template-columns: 1fr;
  }

  .desktop-only {
    display: none;
  }

  .ship-icon-mini {
    display: block;
    width: 60px;
    height: 60px;
  }

  .display-name {
    font-size: 1.6rem;
  }

  .galaxy-grid {
    grid-template-columns: 1fr;
  }

  .main-stats {
    gap: 10px;
  }

  .sticker-input {
    font-size: 1.2rem;
  }
}
</style>