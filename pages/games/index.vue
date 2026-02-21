<template>
  <div class="menu-starfield">
    <div class="stars-container">
      <div class="stars-layer dust"></div>
      <div class="stars-layer mid"></div>
      <div class="stars-layer chaotic"></div>
    </div>

    <Transition name="cyber-fade">
      <div class="cyber-menu-wrapper" v-if="!showShop && !showSettings && !isTransitioning">
        <div class="glitch-title" data-text="STAR_COMMAND">ГАЛАКТИКА АРТИКЛЕЙ</div>

        <div class="menu-controls">
          <div class="menu-item">
            <button class="cyber-btn btn-play" @click="$router.push('/test-fight')">
              <span class="btn-glitch"></span>НАЧАТЬ ИГРУ
            </button>
          </div>
          <div class="menu-item">
            <button class="cyber-btn btn-shop" @click="toggleScreen('shop')">АНГАР ФЛОТА</button>
          </div>
          <div class="menu-item">
            <button class="cyber-btn btn-settings" @click="toggleScreen('settings')">НАСТРОЙКИ</button>
          </div>
          <div class="menu-item">
            <button class="cyber-btn btn-exit" @click="handleExit">Покинуть галактику</button>
          </div>
        </div>
      </div>
    </Transition>
    <div class="sub-screen-container">
      <VGameSettings v-if="showSettings" @close="toggleScreen('menu')"/>
      <VGameHangar v-if="showShop" @close="toggleScreen('menu')"/>
    </div>
    <Transition name="warp-flash">
      <div class="warp-overlay" v-if="isTransitioning"></div>
    </Transition>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import VGameSettings from '../../src/components/V-gameSettings.vue'
import VGameHangar from '../../src/components/V-gameHangar.vue'
import { useRouter} from "vue-router";
const router = useRouter();

const showSettings = ref(false)
const showShop = ref(false)
const isTransitioning = ref(false)

const toggleScreen = (target) => {

  if (target === 'shop' || (target === 'menu' && showShop.value)) {
    isTransitioning.value = true
    setTimeout(() => {
      showSettings.value = false
      showShop.value = (target === 'shop')

      setTimeout(() => {
        isTransitioning.value = false
      }, 300)
    }, 400)
  } else if (target === 'settings') {
    showSettings.value = true
    showShop.value = false
  } else {
    showSettings.value = false
    showShop.value = false
  }
}

const handleExit = () => {
  router.push('/')
}
</script>

<style scoped>
.menu-starfield {
  height: 100vh;
  background: radial-gradient(circle at center, #0a1122 0%, #010409 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  font-family: 'Consolas', monospace;
}

/* ЗВЕЗДНЫЙ ФОН (КОПИЯ ИЗ ИГРЫ ДЛЯ ЕДИНОГО СТИЛЯ) */
.stars-container {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.stars-layer {
  position: absolute;
  inset: -100%;
  background-repeat: repeat;
  pointer-events: none;
}

.dust {
  background-image: radial-gradient(1px 1px at 50px 80px, #fff, transparent);
  background-size: 300px 300px;
  animation: spaceVertical 20s linear infinite;
  opacity: 0.2;
}

.mid {
  background-image: radial-gradient(2px 2px at 100px 150px, #00d2ff, transparent);
  background-size: 400px 400px;
  animation: spaceVertical 10s linear infinite;
  opacity: 0.4;
}

.chaotic {
  background-image: radial-gradient(2px 2px at 200px 300px, #fff, transparent);
  background-size: 500px 500px;
  animation: chaoticRotation 15s ease-in-out infinite;
  opacity: 0.3;
}

@keyframes spaceVertical {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(50%);
  }
}

@keyframes chaoticRotation {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(2deg) scale(1.1);
  }
  100% {
    transform: rotate(0deg) scale(1);
  }
}

.cyber-menu-wrapper {
  position: relative;
  z-index: 10;
  text-align: center;
  background: rgba(10, 25, 47, 0.4);
  padding: 60px;
  border: 1px solid rgba(0, 210, 255, 0.2);
  backdrop-filter: blur(10px);
  clip-path: polygon(0 15%, 5% 0, 95% 0, 100% 15%, 100% 85%, 95% 100%, 5% 100%, 0 85%);
}

.glitch-title {
  color: #fff;
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 10px;
  margin-bottom: 50px;
  text-shadow: 0 0 20px #00d2ff;
}

.menu-controls {
  display: flex;
  flex-direction: column;
  gap: 25px;
  align-items: center;
}

.cyber-btn {
  width: 320px;
  padding: 15px 10px;
  background: transparent;
  border: 1px solid #00d2ff;
  color: #00d2ff;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 3px;
  cursor: pointer;
  position: relative;
  transition: 0.3s;
  clip-path: polygon(0 0, 95% 0, 100% 30%, 100% 100%, 5% 100%, 0 70%);
}

.cyber-btn:hover {
  background: rgba(0, 210, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.4);
  transform: translateX(5px);
}

.btn-play {
  border-color: #00ff9d;
  color: #00ff9d;
}

.btn-play:hover {
  background: rgba(0, 255, 157, 0.1);
  box-shadow: 0 0 25px rgba(0, 255, 157, 0.4);
}

.btn-exit {
  border-color: #ff4b2b;
  color: #ff4b2b;
}

.btn-exit:hover {
  background: rgba(255, 75, 43, 0.1);
  box-shadow: 0 0 20px rgba(255, 75, 43, 0.4);
}

.warp-overlay {
  position: fixed;
  inset: 0;
  background: #fff;
  z-index: 5000;
}

.warp-flash-enter-active, .warp-flash-leave-active {
  transition: opacity 0.3s;
}

.warp-flash-enter-from, .warp-flash-leave-to {
  opacity: 0;
}

/* АНИМАЦИИ ПОЯВЛЕНИЯ */
.cyber-fade-enter-active {
  transition: all 0.5s ease-out;
}

.cyber-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
  filter: blur(10px);
}
</style>