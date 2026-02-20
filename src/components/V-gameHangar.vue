<template>
  <div class="hangar-fullscreen">
    <div class="space-background"></div>

    <div class="top-hud">
      <button class="back-cyber-btn" @click="$emit('close')">
        <span>ВЫЙТИ</span>
      </button>
      <div class="cyber-plank balance-display">
        <span class="credits-val">{{ balance }} 💎</span>
      </div>
    </div>

    <div class="ship-showroom">
      <button class="nav-btn left" @click="prevTank">◀</button>

      <div class="ship-stage-container">
        <div class="ship__inner">
          <Transition name="ship-pop" mode="out-in">
            <div :key="currentIdx" class="ship-active-zone">
              <img :src="tankList[currentIdx].img" class="ship-main-img" alt="Spaceship"/>
              <div class="holo-platform"></div>
            </div>
          </Transition>

          <div class="stats-cyber-panel">
            <div class="stat-row">
              <span class="label">POWER</span>
              <div class="bar-bg">
                <div class="bar-fill neon-orange" :style="{width: tankList[currentIdx].power + '%'}"></div>
              </div>
            </div>
            <div class="stat-row">
              <span class="label">WARP</span>
              <div class="bar-bg">
                <div class="bar-fill neon-cyan" :style="{width: tankList[currentIdx].speed + '%'}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="nav-btn right" @click="nextTank">▶</button>
    </div>

    <div class="bottom-card-wrapper">
      <div class="info-terminal">
        <h2 class="ship-name-display">{{ tankList[currentIdx].name }}</h2>
        <div class="action-btn-container">
          <button v-if="!tankList[currentIdx].owned" class="cyber-action buy" @click="buyTank">
            BUY: {{ tankList[currentIdx].price }}
          </button>
          <button v-else class="cyber-action select" :class="{ active: isSelected }" @click="selectTank">
            {{ isSelected ? 'ACTIVE' : 'SELECT' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import Spaceship from '@/assets/images/spaceship.svg'

const emit = defineEmits(['close'])

const balance = ref(3500)
const currentIdx = ref(0)
const selectedTankId = ref(1)

const tankList = ref([
  {id: 1, name: 'FALKE-01', img: Spaceship, price: 0, owned: true, power: 30, speed: 95},
  {id: 2, name: 'NOVA-02', img: Spaceship, price: 600, owned: false, power: 55, speed: 75},
  {id: 3, name: 'STERN-03', img: Spaceship, price: 1500, owned: false, power: 80, speed: 50},
  {id: 4, name: 'KOMET-04', img: Spaceship, price: 3000, owned: false, power: 90, speed: 35},
  {id: 5, name: 'VOID-X', img: Spaceship, price: 6000, owned: false, power: 100, speed: 15},
])

const isSelected = computed(() => selectedTankId.value === tankList.value[currentIdx.value].id)

const nextTank = () => currentIdx.value = (currentIdx.value + 1) % tankList.value.length
const prevTank = () => currentIdx.value = (currentIdx.value - 1 + tankList.value.length) % tankList.value.length

const buyTank = () => {
  const ship = tankList.value[currentIdx.value]
  if (balance.value >= ship.price) {
    balance.value -= ship.price
    ship.owned = true
    saveData()
  }
}

const selectTank = () => {
  selectedTankId.value = tankList.value[currentIdx.value].id
  localStorage.setItem('selectedTank', selectedTankId.value)
}

const saveData = () => {
  const owned = tankList.value.filter(t => t.owned).map(t => t.id)
  localStorage.setItem('ownedTanks', JSON.stringify(owned))
}

onMounted(() => {
  const savedOwned = JSON.parse(localStorage.getItem('ownedTanks') || '[1]')
  tankList.value.forEach(t => t.owned = savedOwned.includes(t.id))
  selectedTankId.value = Number(localStorage.getItem('selectedTank')) || 1
})
</script>

<style scoped>
.hangar-fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
  background: #02050a;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Consolas', monospace;
  overflow: hidden;
}

.space-background {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, #0a192f 0%, #02050a 100%);
  z-index: -1;
}

/* HUD ВЕРХ */
.top-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.cyber-plank {
  background: rgba(0, 210, 255, 0.05);
  border: 1px solid rgba(0, 210, 255, 0.5);
  padding: 8px 20px;
  backdrop-filter: blur(10px);
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
}

.credits-val {
  color: #00d2ff;
  font-size: 1.2rem;
  font-weight: bold;
}

.back-cyber-btn {
  background: transparent;
  border: 1px solid #ff4b2b;
  padding: 8px 20px;
  color: #ff4b2b;
  cursor: pointer;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%);
  transition: 0.3s;
  font-size: 20px;
}

.back-cyber-btn:hover {
  background: #ff4b2b;
  color: #fff;
  box-shadow: 0 0 15px #ff4b2b;
}

.ship-showroom {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  gap: 35px;
}

.ship-active-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ship-main-img {
  width: 220px; /* Уменьшил корабль */
  filter: drop-shadow(0 0 20px rgba(0, 210, 255, 0.5));
  animation: hover 4s ease-in-out infinite;
}

@keyframes hover {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
  }
}

.holo-platform {
  width: 180px;
  height: 10px;
  background: radial-gradient(ellipse at center, #00d2ff 0%, transparent 70%);
  opacity: 0.5;
  margin-top: 15px;
  box-shadow: 0 5px 20px #00d2ff;
}

.nav-btn {
  width: 45px;
  height: 45px;
  background: rgba(0, 210, 255, 0.1);
  border: 1px solid #00d2ff;
  color: #00d2ff;
  cursor: pointer;
  transition: 0.3s;
}

.nav-btn:hover {
  background: #00d2ff;
  color: #000;
}

/* ПАНЕЛЬ СТАТОВ */
.stats-cyber-panel {
  background: rgba(0, 0, 0, 0.4);
  padding: 15px;
  border: 1px solid rgba(0, 210, 255, 0.3);
  width: 180px;
  margin-top: 20px;
  border-radius: 4px;
}

.label {
  color: #00d2ff;
  font-size: 0.65rem;
  margin-bottom: 5px;
  display: block;
  letter-spacing: 1px;
}

.bar-bg {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 10px;
}

.bar-fill {
  height: 100%;
  transition: width 0.8s ease;
}

.neon-orange {
  background: #ff9800;
  box-shadow: 0 0 10px #ff9800;
}

.neon-cyan {
  background: #00d2ff;
  box-shadow: 0 0 10px #00d2ff;
}

.bottom-card-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.info-terminal {
  background: rgba(10, 25, 47, 0.9);
  border: 1px solid #00d2ff;
  padding: 20px;
  text-align: center;
  width: 100%;
  max-width: 400px;
  clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px));
}

.ship-name-display {
  color: #fff;
  font-size: 1.4rem;
  margin-bottom: 15px;
  text-shadow: 0 0 10px #00d2ff;
}

.cyber-action {
  width: 100%;
  padding: 12px;
  font-size: 0.9rem;
  font-weight: bold;
  background: transparent;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid currentColor;
}

.buy {
  color: #ff9800;
}

.buy:hover {
  background: #ff9800;
  color: #000;
}

.select {
  color: #00d2ff;
}

.select:hover {
  background: #00d2ff;
  color: #000;
}

.select.active {
  background: #00ff9d;
  color: #000;
  border-color: #00ff9d;
  pointer-events: none;
}

@media (max-width: 600px) {
  .ship-main-img {
    width: 160px;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
  }


  .ship-name-display {
    font-size: 1.1rem;
  }

  .cyber-plank {
    padding: 5px 15px;
  }

  .credits-val {
    font-size: 1rem;
  }
}

.ship-pop-enter-active, .ship-pop-leave-active {
  transition: all 0.3s ease;
}

.ship-pop-enter-from {
  opacity: 0;
  transform: scale(0.9) translateX(30px);
}

.ship-pop-leave-to {
  opacity: 0;
  transform: scale(0.9) translateX(-30px);
}
</style>