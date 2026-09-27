<template>
  <div class="game-loader-overlay">
    <div class="loader-container">
      <ClientOnly v-if="computedAnimationData">
        <div class="loader-lottie-wrapper">
          <ClientOnly>
            <DotLottieVue
                :data="computedAnimationData"
                :loop="true"
                :autoplay="true"
                class="loader-lottie"
            />
          </ClientOnly>
        </div>
      </ClientOnly>
      <img v-else class="preloader__icon" src="../../assets/images/PreloaderIcon.svg" alt="">
      <div class="loader-box"></div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import Hedgehog from '~/assets/animation/Hedgehog_wait.json'
import {DotLottieVue} from '@lottiefiles/dotlottie-vue'

const computedAnimationData = computed(() => {
  if (!Hedgehog) return null
  return typeof Hedgehog === 'object' ? JSON.stringify(Hedgehog) : Hedgehog
})
</script>

<style scoped>
.game-loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bg);
  z-index: 9999999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;
}

.loader-lottie-wrapper {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 20px;
}

.loader-lottie {
  transform: scale(2);
}

.preloader__icon {
  width: 140px;
  margin: 0 auto;
}

@media (max-width: 460px) {
  .loader-lottie {
    transform: scale(1.9);
  }
}

@media (max-width: 360px) {
  .loader-lottie {
    transform: scale(1.8);
  }
}

@media (max-width: 260px) {
  .loader-lottie {
    transform: scale(1.7);
  }
}

.app-title {
  color: #ffffff;
  background: #7e4ce6;
  padding: 12px 30px;
  border-radius: 20px;
  font-family: 'Nunito', 'Segoe UI', sans-serif;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 4px 0 #5a32a3;
  margin: 0;
}

.loader-box {
  width: 100px;
  height: 100px;
  background: #f1c40f;
  border-radius: 18px;
  border: 4px solid #1e1e2d;
  box-shadow: 6px 6px 0 #1e1e2d;

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Nunito', sans-serif;
  font-weight: 900;
  font-size: 26px;
  color: #1e1e2d;
  text-transform: uppercase;

  animation: fastSpin 2.5s linear infinite;
}

.loader-box::after {
  content: 'der';
  animation: swapTextFast 2.5s linear infinite;
}

@keyframes fastSpin {
  0% {
    transform: perspective(400px) rotateY(0deg);
  }
  16% {
    transform: perspective(400px) rotateY(90deg);
  }
  16.01% {
    transform: perspective(400px) rotateY(-90deg);
  }

  33% {
    transform: perspective(400px) rotateY(0deg);
  }
  49% {
    transform: perspective(400px) rotateY(90deg);
  }
  49.01% {
    transform: perspective(400px) rotateY(-90deg);
  }

  66% {
    transform: perspective(400px) rotateY(0deg);
  }
  82% {
    transform: perspective(400px) rotateY(90deg);
  }
  82.01% {
    transform: perspective(400px) rotateY(-90deg);
  }

  100% {
    transform: perspective(400px) rotateY(0deg);
  }
}

@keyframes swapTextFast {
  0%, 16% {
    content: 'der';
  }
  16.01%, 49% {
    content: 'die';
  }
  49.01%, 82% {
    content: 'das';
  }
  82.01%, 100% {
    content: 'der';
  }
}
</style>