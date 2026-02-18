<template>
  <div class="menu-battlefield">
    <Transition name="tank-slide-left">
      <div class="menu-tank-container-left" v-if="!showShop && !isTransitioning">
        <div class="tank-shadow"></div>
      </div>
    </Transition>

    <Transition name="fade-signs">
      <div class="wood-menu-wrapper central-menu" v-if="!showShop && !isTransitioning">
        <div class="menu-controls-signs">
          <div class="sign-item s1"><button class="wood-btn btn-play" @click="$router.push('/test-fight')">В БОЙ!</button></div>
          <div class="sign-item s2"><button class="wood-btn btn-settings" @click="toggleScreen('settings')">Настройки</button></div>
          <div class="sign-item s3"><button class="wood-btn btn-shop" @click="toggleScreen('shop')">Ангар</button></div>
          <div class="sign-item s4"><button class="wood-btn btn-exit" @click="handleExit">Выход</button></div>
        </div>
      </div>
    </Transition>

    <div class="sub-screen-container">
      <VGameSettings v-if="showSettings" @close="toggleScreen('menu')"/>

      <VGameHangar v-if="showShop" @close="toggleScreen('menu')"/>
    </div>

    <div class="shutter-overlay" :class="{ 'shutters-closed': isGatesActive }">
      <div class="shutter shutter-top"></div>
      <div class="shutter shutter-bottom"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import VGameSettings from '../../src/components/V-gameSettings.vue'
import VGameHangar from '../../src/components/V-gameHangar.vue'

const showSettings = ref(false)
const showShop = ref(false)
const isGatesActive = ref(false)
const isTransitioning = ref(false)

const toggleScreen = (target) => {
  if (target === 'shop' || (target === 'menu' && showShop.value)) {
    isGatesActive.value = true
    isTransitioning.value = true
    setTimeout(() => {
      showSettings.value = false
      showShop.value = (target === 'shop')
      if (target === 'menu') isTransitioning.value = false

      setTimeout(() => {
        isGatesActive.value = false
      }, 400)
    }, 700)
  }
  else if (target === 'settings') {
    showSettings.value = true
    showShop.value = false
  }
  else {
    showSettings.value = false
    showShop.value = false
    isTransitioning.value = false
  }
}

const handleExit = () => {
  if (confirm("Выйти из игры?")) window.close();
}
</script>

<style scoped>
.menu-battlefield {
  height: 100vh;
  background-image: url("../../assets/images/fightIcons/gameBG.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
  font-family: 'Segoe UI Black', sans-serif;
}


.wood-menu-wrapper.central-menu {
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
  z-index: 10;
}

.menu-controls-signs {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sign-item {
  filter: drop-shadow(0 10px 6px rgba(0, 0, 0, 0.4));
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.sign-item:hover {
  transform: scale(1.08) rotate(0deg) !important;
}

.s1 {
  transform: rotate(-3deg);
}

.s2 {
  transform: rotate(2deg);
  margin-left: -10px;
}

.s3 {
  transform: rotate(-2deg);
  margin-left: 10px;
}

.s4 {
  transform: rotate(4deg);
}

.wood-btn {
  width: 280px;
  min-height: 85px;
  border-width: 5px;
  border-style: solid;
  clip-path: polygon(2% 8%, 98% 3%, 100% 50%, 97% 94%, 4% 97%, 0% 50%);
  color: #fff;
  font-size: 1.8rem;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-play {
  background: linear-gradient(135deg, rgba(165, 214, 167, 0.85) 0%, rgba(56, 142, 60, 0.85) 100%);
  border-color: #2e7d32;
}

.btn-settings {
  background: linear-gradient(135deg, rgba(129, 212, 250, 0.85) 0%, rgba(2, 136, 209, 0.85) 100%);
  border-color: #01579b;
}

.btn-shop {
  background: linear-gradient(135deg, rgba(255, 202, 40, 0.85) 0%, rgba(255, 111, 0, 0.85) 100%);
  border-color: #e65100;
}

.btn-exit {
  background: linear-gradient(135deg, rgba(239, 154, 154, 0.85) 0%, rgba(183, 28, 28, 0.85) 100%);
  border-color: #b71c1c;
}

.wood-btn:active {
  transform: translateY(2px) scale(0.98);
  filter: brightness(0.8);
}

.shutter-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.shutter {
  flex: 1;
  background: #5d4037;
  background-image: repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0, 0, 0, 0.1) 40px, rgba(0, 0, 0, 0.1) 42px);
  border: 4px solid #3e2723;
  transition: transform 0.6s cubic-bezier(0.7, 0, 0.3, 1);
}

.shutter-top {
  transform: translateY(-100%);
  border-bottom: 8px solid #2a1b18;
}

.shutter-bottom {
  transform: translateY(100%);
  border-top: 8px solid #2a1b18;
}

.shutters-closed .shutter-top,
.shutters-closed .shutter-bottom {
  transform: translateY(0);
  pointer-events: all;
}

.menu-tank-container-left {
  position: absolute;
  bottom: 15%;
  left: 5%;
  width: 380px;
}

.fade-signs-enter-from {
  transform: translate(-50%, 30px);
  opacity: 0;
}

.fade-signs-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>