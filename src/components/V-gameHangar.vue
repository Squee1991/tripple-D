<template>
  <div class="hangar-fullscreen">
    <div class="top-hud">
      <button class="back-wood-btn" @click="$emit('close')">
        <span>НАЗАД</span>
      </button>
      <div class="header-plank balance-display">
        <span>💰 {{ balance }}</span>
      </div>
    </div>
    <div class="tank-showroom">
      <button class="arrow-btn left" @click="prevTank">◀</button>
      <div class="tank-stage-container">
        <div class="tank__inner">
          <Transition name="tank-pop" mode="out-in">
            <div :key="currentIdx" class="tank-active-zone">
              <img :src="tankList[currentIdx].img" class="tank-main-img" alt="Tank"/>
              <div class="tank-shadow"></div>
            </div>
          </Transition>
          <div class="stats-side-plank">
            <div class="stat-row">
              <span class="label">KRAFT (МОЩЬ):</span>
              <div class="bar-bg">
                <div class="bar-fill" :style="{width: tankList[currentIdx].power + '%'}"></div>
              </div>
            </div>
            <div class="stat-row">
              <span class="label">SPEED (СКОРОСТЬ):</span>
              <div class="bar-bg">
                <div class="bar-fill blue" :style="{width: tankList[currentIdx].speed + '%'}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="arrow-btn right" @click="nextTank">▶</button>
    </div>
    <div class="bottom-card-wrapper">
      <div class="info-plank">
        <h2 class="tank-german-name">{{ tankList[currentIdx].name }}</h2>
        <div class="action-btn-container">
          <button v-if="!tankList[currentIdx].owned" class="action-btn buy" @click="buyTank">
            КУПИТЬ ЗА {{ tankList[currentIdx].price }}
          </button>
          <button v-else class="action-btn select" :class="{ active: isSelected }" @click="selectTank">
            {{ isSelected ? 'ВЫБРАН (AKTIV)' : 'ВЫБРАТЬ' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'

import t1 from '../../assets/images/fightIcons/tank (1).svg'
import t2 from '../../assets/images/fightIcons/tank (2).svg'
import t3 from '../../assets/images/fightIcons/tank (3).svg'
import t4 from '../../assets/images/fightIcons/tank (4).svg'
import t5 from '../../assets/images/fightIcons/tank (5).svg'

const emit = defineEmits(['close'])

const balance = ref(3500)
const currentIdx = ref(0)
const selectedTankId = ref(1)

const tankList = ref([
  {id: 1, name: 'DER BLITZ 1', img: t1, price: 0, owned: true, power: 30, speed: 90},
  {id: 2, name: 'DIE KRAFT 2', img: t2, price: 600, owned: false, power: 55, speed: 70},
  {id: 3, name: 'DAS FEUER 3', img: t3, price: 1500, owned: false, power: 75, speed: 50},
  {id: 4, name: 'DER STURM 4', img: t4, price: 3000, owned: false, power: 85, speed: 40},
  {id: 5, name: 'DIE FESTUNG 5', img: t5, price: 6000, owned: false, power: 100, speed: 20},
])

const isSelected = computed(() => selectedTankId.value === tankList.value[currentIdx.value].id)

const nextTank = () => currentIdx.value = (currentIdx.value + 1) % tankList.value.length
const prevTank = () => currentIdx.value = (currentIdx.value - 1 + tankList.value.length) % tankList.value.length

const buyTank = () => {
  const tank = tankList.value[currentIdx.value]
  if (balance.value >= tank.price) {
    balance.value -= tank.price
    tank.owned = true
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
  background: #3a3838;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;
  box-sizing: border-box;
  font-family: 'Segoe UI Black', sans-serif;
}

.tank__inner {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.top-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-plank {
  background: rgba(93, 64, 55, 0.85);
  border: 4px solid #3e2723;
  padding: 10px 40px;
  color: #fff;
  clip-path: polygon(0% 15%, 100% 0%, 95% 100%, 5% 85%);
}

.main-title h1 {
  margin: 0;
  font-size: 1.8rem;
  text-shadow: 2px 2px #000;
  letter-spacing: 2px;
}

.balance-display {
  color: #f1c40f;
  font-size: 1.6rem;
  font-weight: 900;
}

.back-wood-btn {
  background: rgba(183, 28, 28, 0.85);
  border: 3px solid #5d0000;
  padding: 15px 25px;
  color: white;
  font-weight: 900;
  cursor: pointer;
  clip-path: polygon(10% 0%, 100% 10%, 90% 100%, 0% 90%);
  transition: 0.2s;
}

.back-wood-btn:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.tank-showroom {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.tank-active-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tank-main-img {
  width: 260px;
  filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.5));
}

.tank-shadow {
  width: 200px;
  height: 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  filter: blur(12px);
  margin-top: -20px;
}

.arrow-btn {
  width: 80px;
  height: 80px;
  background: rgba(121, 85, 72, 0.9);
  border: 5px solid #3e2723;
  border-radius: 50%;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  transition: 0.2s;
}

.arrow-btn:hover {
  background: #f39c12;
  transform: scale(1.1);
}


.stats-side-plank {
  background: rgba(93, 64, 55, 0.85);
  padding: 10px 20px;
  border: 4px solid #3e2723;
  border-radius: 20px;
  width: 200px;
  clip-path: polygon(0% 0%, 100% 5%, 95% 95%, 5% 100%);
}

.stat-row {
  margin-bottom: 20px;
}

.label {
  display: block;
  color: #fff;
  font-size: 0.8rem;
  margin-bottom: 5px;
}

.bar-bg {
  width: 100%;
  height: 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #e74c3c;
  border-radius: 10px;
  transition: width 0.5s ease-out;
}

.bar-fill.blue {
  background: #3498db;
}


.bottom-card-wrapper {
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
}

.info-plank {
  background: rgba(121, 85, 72, 0.9);
  border: 6px solid #3e2723;
  padding: 30px 30px;
  text-align: center;
  clip-path: polygon(2% 10%, 98% 0%, 100% 90%, 0% 100%);
  min-width: 400px;
}

.tank-german-name {
  color: #fff;
  font-size: 2rem;
  margin: 0 0 20px;
  text-shadow: 3px 3px 0 #000;
}

.action-btn {
  padding: 15px 60px;
  font-size: 1.2rem;
  font-weight: 900;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  color: #fff;
  transition: 0.1s;
}

.buy {
  background: #ff9800;
  box-shadow: 0 6px 0 #e65100;
}

.select {
  background: #2196f3;
  box-shadow: 0 6px 0 #0d47a1;
}

.select.active {
  background: #4caf50;
  box-shadow: 0 6px 0 #1b5e20;
  pointer-events: none;
}

.action-btn:active {
  transform: translateY(5px);
  box-shadow: none;
}

/* АНИМАЦИИ */
.tank-pop-enter-active, .tank-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.tank-pop-enter-from {
  opacity: 0;
  transform: scale(0.5) rotate(10deg);
}

.tank-pop-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(-10deg);
}
</style>