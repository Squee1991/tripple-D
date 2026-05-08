<script setup>
import {ref, computed, onMounted} from 'vue'
import {useGalaxyStore} from '../../../store/galaxyStore.js'
import Money from '../../../assets/images/galaxy-images/Artics.svg'

const emit = defineEmits(['close'])
const store = useGalaxyStore()
const currentIdx = ref(0)
const { t } = useI18n()
const currentTank = computed(() => store.tankList[currentIdx.value])
const isSelected = computed(() => store.selectedTankId === currentTank.value.id)
const isOwned = computed(() => store.ownedTanks.includes(currentTank.value.id))

const nextTank = () => currentIdx.value = (currentIdx.value + 1) % store.tankList.length
const prevTank = () => currentIdx.value = (currentIdx.value - 1 + store.tankList.length) % store.tankList.length

const handleBuy = async () => {
  await store.buyShip(currentTank.value)
}

const handleSelect = async () => {
  await store.selectShip(currentTank.value.id)
}

onMounted(async () => {
  await store.initUser()
})

</script>

<template>
  <div class="toon-wrapper">
    <div class="menu-bg-layer">
      <div class="stars-layer"></div>
      <div class="nebula-cloud blue"></div>
      <div class="nebula-cloud purple"></div>
    </div>
    <div class="header-section">
      <div class="top-bar">
        <div class="exit-portal" @click="$emit('close')">
          <button class="btn-icon-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>
        <div class="balance-plate">
          <div class="balance-amount-wrap">
            <img :src="Money" alt="currency" class="currency-icon">
            <span class="balance-num">{{ store.balance }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="showroom">
      <button class="nav-arrow left" @click="prevTank">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>

      <div class="ship-display-area">
        <Transition name="funky-pop" mode="out-in">
          <div :key="currentIdx" class="ship-presentation">
            <img :src="currentTank.img" class="ship-main-render" :alt="currentTank.name"/>
            <div class="hologram-platform"></div>
          </div>
        </Transition>
      </div>
      <button class="nav-arrow right" @click="nextTank">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
    <div class="info-footer-container">
      <div class="info-module">
        <h2 class="ship-title">{{ currentTank.name }}</h2>
        <div class="controls-group">
          <button v-if="!isOwned" class="start-mission-btn buy-btn" @click="handleBuy">
            {{ t('galaxyHangar.buy')}} {{ currentTank.price }}
          </button>
          <button v-else class="start-mission-btn select-btn" :class="{ 'is-active': isSelected }" @click="handleSelect">
            {{ isSelected ? t('galaxyHangar.inFlight') : t('galaxyHangar.change') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toon-wrapper {
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
  justify-content: space-between;
}

/* Кнопка "Назад" из Галактики */
.exit-portal {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor, #ccc);
  box-shadow: 0px 3px 6px rgba(0,0,0,0.2);
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

.topbar__title {
  font-size: 20px;
  color: white;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  margin-left: 15px;
}

/* Плашка баланса */
.balance-plate {
  background: rgba(26, 28, 36, 0.85);
  border: 2px solid #303443;
  border-radius: 12px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

.currency-label {
  color: #8b95a8;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.balance-amount-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.currency-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  filter: drop-shadow(0 0 3px rgba(204, 255, 0, 0.4));
}

.balance-num {
  color: #ccff00;
  font-size: 18px;
  font-weight: 900;
}

/* ================= ЦЕНТРАЛЬНАЯ ЧАСТЬ (SHOWROOM) ================= */
.showroom {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  z-index: 10;
}

.nav-arrow {
  width: 50px;
  height: 50px;
  background: rgba(26, 28, 36, 0.85);
  border: 2px solid #303443;
  color: #fff;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: all 0.1s;
  backdrop-filter: blur(5px);
}

.nav-arrow:active {
  transform: scale(0.9);
  background: #303443;
}

.ship-display-area {
  flex: 1;
  display: flex;
  justify-content: center;
}

.ship-presentation {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.ship-main-render {
  width: 200px;
  z-index: 2;
  filter: drop-shadow(0 0 15px rgba(0, 242, 255, 0.4));
  animation: floatEffect 5s ease-in-out infinite;
}

@keyframes floatEffect {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hologram-platform {
  position: absolute;
  bottom: -15px;
  width: 140px;
  height: 25px;
  background: radial-gradient(ellipse at center, rgba(0, 242, 255, 0.3) 0%, transparent 70%);
}

/* ================= ИНФО И КНОПКИ (ФУТЕР) ================= */
.info-footer-container {
  padding: 0 20px 30px 20px;
  display: flex;
  justify-content: center;
  z-index: 10;
}

.info-module {
  background: rgba(26, 28, 36, 0.85);
  border: 2px solid #303443;
  padding: 25px;
  width: 100%;
  border-radius: 24px;
  max-width: 450px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  text-align: center;
}

.ship-title {
  color: #fff;
  font-size: 24px;
  margin: 0 0 20px 0;
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 1px;
}

.controls-group {
  display: flex;
  flex-direction: column;
}

/* Стили кнопок из Галактики */
.start-mission-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 20px;
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.1s;
}

.buy-btn {
  background: #ccff00;
  color: #000;
  box-shadow: 0 6px 0 #89aa00;
}

.buy-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #89aa00;
}

.select-btn {
  background: #00f2ff;
  color: #000;
  box-shadow: 0 6px 0 #009eb3;
}

.select-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #009eb3;
}

.select-btn.is-active {
  background: #2ecc71;
  color: #fff;
  box-shadow: 0 6px 0 #208e4e;
}

.select-btn.is-active:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #208e4e;
}

.funky-pop-enter-active {
  animation: popIn 0.3s ease-out;
}

.funky-pop-leave-active {
  animation: popOut 0.2s ease-in;
}

@keyframes popIn {
  0% { opacity: 0; transform: scale(0.8) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes popOut {
  to { opacity: 0; transform: scale(1.1) translateY(-20px); }
}

@media (max-width: 600px) {
  .ship-main-render {
    width: 160px;
  }
  .nav-arrow {
    width: 40px;
    height: 40px;
  }
}
</style>