<script setup>
import {ref, computed, onMounted} from 'vue'
import {useGalaxyStore} from '../../../store/galaxyStore.js'

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
  <div class="funky-hangar-root">
    <div class="funky-bg">
      <div class="stars-layer"></div>
      <div class="neon-glow"></div>
    </div>
    <div class="funky-hud">
      <button class="funky-exit-btn" @click="$emit('close')">
        <span>{{ t('galaxyHangar.leave')}}</span>
      </button>
      <div class="funky-balance-plate">
        <span class="currency-label">{{ t('galaxyHangar.money')}}</span>
        <span class="balance-num">{{ store.balance }}</span>
      </div>
    </div>
    <div class="funky-showroom">
      <button class="nav-arrow left" @click="prevTank">◀</button>
      <div class="ship-display-area">
        <Transition name="funky-pop" mode="out-in">
          <div :key="currentIdx" class="ship-presentation">
            <img :src="currentTank.img" class="ship-main-render" :alt="currentTank.name"/>
            <div class="disco-platform"></div>
          </div>
        </Transition>
      </div>
      <button class="nav-arrow right" @click="nextTank">▶</button>
    </div>
    <div class="funky-footer">
      <div class="info-module">
        <h2 class="ship-title">{{ currentTank.name }}</h2>
        <div class="controls-group">
          <button v-if="!isOwned" class="btn-action buy" @click="handleBuy">
            {{ t('galaxyHangar.buy')}} {{ currentTank.price }}
          </button>
          <button v-else class="btn-action select" :class="{ is_active: isSelected }" @click="handleSelect">
            {{ isSelected ? t('galaxyHangar.inFlight') : t('galaxyHangar.change') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.funky-hangar-root {

  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  background: #0f0c29;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  box-sizing: border-box;
  font-family: 'Arial Black', 'Gadget', sans-serif;
  overflow: hidden;
  user-select: none;
}

.funky-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  z-index: -1;
}

.stars-layer {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0, 0, 0, 0)),
  radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
  radial-gradient(2px 2px at 50px 160px, #ff00ff, rgba(0, 0, 0, 0)),
  radial-gradient(2px 2px at 90px 40px, #00f2ff, rgba(0, 0, 0, 0));
  background-size: 200px 200px;
  opacity: 0.5;
  animation: bgScroll 60s linear infinite;
}

.neon-glow {
  position: absolute;
  width: 150%;
  height: 150%;
  background: radial-gradient(circle, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
  top: -25%;
  left: -25%;
  filter: blur(80px);
}

@keyframes bgScroll {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 1000px 1000px;
  }
}

.funky-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.funky-exit-btn {
  background: #ff0055;
  border: 2px solid #000;
  padding: 12px 25px;
  color: #fff;
  font-weight: 900;
  box-shadow: 3px 3px 0px #000;
  cursor: pointer;
  transform: skewX(-10deg);
  transition: 0.2s;
  border-radius: 15px;
}

.funky-balance-plate {
  background: #ccff00;
  border: 2px solid #000;
  padding: 10px;
  box-shadow: 3px 3px 0px #000;
  transform: skewX(10deg);
  display: flex;
  align-items: center;
  border-radius: 15px;
}

.currency-label {
  color: #000;
  font-size: 0.9rem;
  margin-right: 5px;
}

.balance-num {
  color: #000;
  font-size: 1rem;
  font-weight: 900;
}

.funky-showroom {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.nav-arrow {
  width: 60px;
  height: 70px;
  background: #fff;
  border: 3px solid #000;
  border-radius: 15px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 3px 3px 0px #000;
  transition: 0.1s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ship-presentation {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.ship-main-render {
  width: 220px;
  filter: drop-shadow(0 0 20px rgba(0, 242, 255, 0.6));
  animation: funkyFloat 4s ease-in-out infinite;
}

@keyframes funkyFloat {
  0%, 100% {
    transform: translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateY(-15px) rotate(2deg);
  }
}

.disco-platform {
  width: 250px;
  height: 40px;
  background: #000;
  border: 4px solid #00f2ff;
  border-radius: 50%;
  margin-top: 30px;
  position: relative;
  box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
}

.funky-footer {
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
}

.info-module {
  background: #fff;
  border: 6px solid #000;
  padding: 15px;
  width: 100%;
  border-radius: 12px;
  max-width: 450px;
  box-shadow: 5px 5px 0px #212121;
  transform: rotate(-1deg);
}

.ship-title {
  color: #000;
  font-size: 2rem;
  margin: 0 0 20px 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: -1px;
}

.btn-action {
  width: 100%;
  padding: 10px;
  font-size: 1.3rem;
  font-weight: 900;
  border: 2px solid #000;
  cursor: pointer;
  box-shadow: 3px 3px 0px #000;
  transition: 0.1s;
}

.btn-action.buy {
  background: #ccff00;
  color: #000;
}

.btn-action.select {
  background: #00f2ff;
  color: #000;
}

.btn-action:active {
  transform: translate(4px, 4px);
  box-shadow: 2px 2px 0px #000;
}

.btn-action.is_active {
  background: #2ecc71;
  color: #fff;
  pointer-events: none;
  box-shadow: none;
  transform: translate(6px, 6px);
}

.funky-pop-enter-active {
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.funky-pop-leave-active {
  animation: popOut 0.2s ease-in;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.6) translateY(50px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes popOut {
  to {
    opacity: 0;
    transform: scale(1.1) translateY(-30px);
  }
}

@media (max-width: 600px) {
  .ship-main-render {
    width: 170px;
  }

  .info-module {
    transform: none;
  }

  .nav-arrow {
    min-width: 40px;
    height: 50px;
  }
}
</style>