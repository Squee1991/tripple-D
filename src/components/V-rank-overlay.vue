<template>
  <div v-if="store.isOverlayVisible" class="overlay">
    <div class="effects-container">
      <div class="rays"></div>
      <div class="sparkles">
        <span
            v-for="particleIndex in totalParticlesCount"
            :key="particleIndex"
            class="particle-dot"
            :style="dotStyle(particleIndex)"
        ></span>
      </div>
    </div>
    <transition name="bounce-center" appear>
      <div class="modal-content">
        <h1 class="top-title">НОВЫЙ РАНГ!</h1>
        <h2 class="sub-title">{{ store.currentReward.title }}</h2>
        <div class="card-black">
          <div class="stars-epic">
            <span
                v-for="starIndex in store.currentReward.levelIndex"
                :key="'stable-star-' + starIndex"
                class="star-already-there"
            >★</span>
            <span v-if="store.isStarReady" class="star new">★</span>
            <span v-else class="star placeholder">★</span>
          </div>
          <img class="icon-big" :src="store.currentReward.icon" alt="">
          <div class="rank-name">Ранг {{ store.currentReward.levelIndex + 1 }}</div>
        </div>
        <button @click="store.isOverlayVisible = false" class="btn-claim">ПРИНЯТЬ</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useRankUserStore } from '../../store/rankStore.js'

const store = useRankUserStore()
const totalParticlesCount = 200
const dotStyle = (particleIndex) => {
  const randomAngle = Math.random() * 360
  const randomDistance = 100 + Math.random() * 400
  return {
    '--dx': `${Math.cos(randomAngle * Math.PI / 180) * randomDistance}px`,
    '--dy': `${Math.sin(randomAngle * Math.PI / 180) * randomDistance}px`,
    animationDuration: `${2 + Math.random() * 2}s`
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgb(0, 0, 0);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.effects-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rays {
  position: absolute;
  width: 100%;
  height: 100%;
  background: repeating-conic-gradient(
      from 0deg,
      rgba(255, 215, 0, 0.2) 0deg 15deg,
      transparent 15deg 30deg
  );
  animation: rotate-center 40s linear infinite;
  mask-image: radial-gradient(circle, black 20%, transparent 70%);
  -webkit-mask-image: radial-gradient(circle, black 20%, transparent 70%);
}

@keyframes rotate-center {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sparkles {
  position: absolute;
}

.particle-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ffd700;
  border-radius: 50%;
  opacity: 0;
  animation: burst forwards ease-out;
}

@keyframes burst {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(var(--dx, 0px), var(--dy, 0px)) scale(1.2);
  }
}

.modal-content {
  position: relative;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bounce-center-enter-active {
  transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.bounce-center-enter-from {
  transform: scale(0.5);
  opacity: 0;
}

.top-title {
  font-size: 54px;
  font-weight: 900;
  color: white;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
  margin: 0;
  background: linear-gradient(#fff, #ffe066);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
}

.sub-title {
  color: #ffd700;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 25px;
  text-transform: uppercase;
}

.card-black {
  padding: 20px;
  border-radius: 40px;
  text-align: center;
}

.stars-epic {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 50px;
  color: #ffd700;
  height: 30px;
}

.star-already-there {
  display: inline-block;
  opacity: 1;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

.star.new {
  display: inline-block;
  opacity: 0;
  animation: star-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

@keyframes star-pop {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

.star.placeholder {
  display: inline-block;
  visibility: hidden;
}

.icon-big {
  width: 140px;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.2));
}

.rank-name {
  color: white;
  font-size: 30px;
  font-weight: 800;
  text-transform: uppercase;
}

.btn-claim {
  margin-top: 30px;
  background: linear-gradient(#ffd700, #e6a800);
  border: none;
  padding: 18px 60px;
  border-radius: 50px;
  font-weight: 900;
  font-size: 24px;
  color: #222;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.4);
  transition: 0.2s;
  text-transform: uppercase;
}

.btn-claim:hover {
  transform: translateY(-3px) scale(1.05);
}
</style>