<template>
  <div class="game-universe">
    <div v-if="errorMessage" class="error-screen">
      <h1>⚠️ СИСТЕМНЫЙ СБОЙ</h1>
      <p>{{ errorMessage }}</p>
      <button class="btn-go" @click="goHome">ВЕРНУТЬСЯ В ШТАБ</button>
    </div>
    <div v-else class="sky" ref="skyRef">
      <div class="star-layer"></div>
      <div class="sector-info" v-if="currentGalaxy">
        <span class="sector-name">{{ currentGalaxy.name || 'НЕИЗВЕСТНО' }}</span>
        <span class="sector-type">{{ currentGalaxy.type || '???' }}</span>
      </div>
      <div class="score-board">
        <span class="score-label">ОЧКИ</span>
        <span class="score-value">{{ score }}</span>
      </div>
      <div v-if="!isGameOver" class="game-area">
        <div
            v-if="currentQuestion && !showGroundExplosion"
            ref="mobRef"
            :key="gameKey"
            class="mob"
            :style="mobStyles"
            @animationend="triggerBomb"
            @transitionend="handleTransitionEnd"
        >
          <div class="mob-inner">
            <img :src="isWrongState ? MeteorInFire : Meteor" class="parachute" alt="Target">
            <div class="mob-bubble" v-if="!isWrongState">
              {{ currentQuestion.word }}
            </div>
          </div>
        </div>
        <div v-if="isMissileFlying" class="laser-beam" :style="missileStyles"></div>
        <div v-if="showSuccessExplosion" class="vfx" :style="vfxPos">💥</div>
      </div>
      <div v-if="showGroundExplosion" class="ground-impact-explosion">
        <div class="big-boom-emoji">💥</div>
      </div>
      <div v-if="isGameOver" class="game-over-overlay">
        <div class="game-over-card">
          <p class="death-sub">СЕКТОР НЕ ЗАЧИЩЕН!</p>
          <div class="final-score-wrap"><span class="fs-val">{{ score }}</span></div>
          <button class="restart-btn" @click="startGame">ЕЩЕ РАЗ</button>
          <button class="home-btn" @click="goHome">ВЕРНУТЬСЯ В ШТАБ</button>
        </div>
      </div>
      <div class="cannon-station" v-if="currentQuestion">
        <div class="main-cannon" :class="{ 'recoiling': isMissileFlying }">
          <img v-if="!showGroundExplosion" class="tank" :src="Spaceship" alt="Ship">
        </div>
        <div class="ammo-selector">
          <button
              v-for="opt in currentQuestion.options"
              :key="opt"
              class="ammo-btn toon-btn"
              @click="shoot(opt)"
              :disabled="isMissileFlying || showGroundExplosion || isWrongState"
          >
            {{ opt.toUpperCase() }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGalaxyStore } from '../../store/galaxyStore.js'
import Spaceship from '../../assets/images/spaceship.svg'
import Meteor from '../../assets/images/meteor.svg'
import MeteorInFire from '../../assets/images/meteorinFire.svg'

const route = useRoute()
const router = useRouter()
const store = useGalaxyStore()
const errorMessage = ref('')

const currentGalaxy = computed(() => store.currentGalaxy || null)
const currentQuestions = computed(() => {
  return (store.currentGalaxy && store.currentGalaxy.questions) ? store.currentGalaxy.questions : []
})

const {
  score, isGameOver, currentQuestion, gameKey,
  isWrongState, showSuccessExplosion, showGroundExplosion, isMissileFlying,
  mobRef, skyRef, mobStyles, missileStyles, vfxPos,
  startGame, shoot, handleTransitionEnd, triggerBomb
} = useCombatEngine(currentQuestions)

const initGame = () => {
  try {
    const sectorId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
    if (!sectorId) {
      errorMessage.value = 'ID сектора не передан';
      return;
    }
    store.setMission(sectorId);
    setTimeout(() => { startGame() }, 50);
  } catch (error) {
    errorMessage.value = "Ошибка: " + error.message;
  }
}

const goHome = () => {
  const currentLocale = route.params.locale || 'ru'
  router.push(`/${currentLocale}`)
}

onMounted(() => {
  if (store.galaxies && store.galaxies.length > 0) {
    initGame()
  } else {
    store.fetchGalaxies().then(() => {
      initGame()
    }).catch(err => {
      errorMessage.value = "Не удалось загрузить базу данных."
      console.error(err)
    })
  }
})
</script>

<style scoped>

.error-screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(15, 5, 20, 0.95);
  color: #ff4b2b;
  z-index: 9999;
  text-align: center;
}

.error-screen h1 {
  margin-bottom: 10px;
}

.error-screen p {
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 30px;
}

.btn-go {
  background: #ffeb3b;
  border: 3px solid #000;
  border-radius: 10px;
  font-weight: 900;
  padding: 15px 30px;
  box-shadow: 2px 2px 0 #000;
  cursor: pointer;
}

.ammo-btn.toon-btn {
  background: #fff;
  border: 4px solid #000;
  color: #000;
  border-radius: 15px;
  font-weight: 900;
  box-shadow: 0 6px 0 #000;
  transition: 0.1s;
  min-width: 100px;
  height: 60px;
  font-size: 1.1rem;
}

.ammo-btn.toon-btn:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #000;
}

.sector-info {
  position: absolute;
  top: 20px;
  right: 20px;
  text-align: right;
  z-index: 100;
}

.sector-name {
  display: block;
  color: #ffeb3b;
  font-size: 1.5rem;
  -webkit-text-stroke: 1px #000;
  font-weight: 900;
}

.sector-type {
  color: #fff;
  font-size: 0.8rem;
  opacity: 0.7;
}

.game-universe {
  height: 100vh;
  background: #010409;
  overflow: hidden;
  font-family: 'Arial Rounded MT Bold', sans-serif;
  user-select: none;
}

.sky {
  height: 100%;
  position: relative;
}

.star-layer {
  position: absolute;
  width: 100%;
  height: 200%;
  top: -100%;
  background-image: radial-gradient(1px 1px at 20px 30px, #fff, rgba(0, 0, 0, 0)), radial-gradient(2px 2px at 50px 80px, #eee, rgba(0, 0, 0, 0));
  background-size: 250px 250px;
  animation: starsScroll 12s linear infinite;
  opacity: 0.5;
}

@keyframes starsScroll {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(50%);
  }
}

.score-board {
  position: absolute;
  top: 30px;
  left: 1%;
  color: #00d2ff;
  z-index: 100;
}

.score-value {
  font-size: 1.3rem;
  font-weight: bold;
  margin-left: 10px;
  color: #fff;
}

.mob {
  position: absolute;
  width: 100px;
  left: 50%;
  transform: translateX(-50%);
  animation: fall linear forwards;
  z-index: 50;
}

.meteor__fire {
  width: 140px;
  transform: rotate(-45deg);
  filter: drop-shadow(0 0 25px #ff4b2b);
}

.parachute {
  width: 90px;
  transform: rotate(-45deg);
  filter: drop-shadow(0 0 15px #00d2ff);
}

.mob-bubble {
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 5px 15px;
  border: 2px solid #00d2ff;
  text-align: center;
}

.mob-inner {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
}

.laser-beam {
  position: absolute;
  width: 4px;
  height: 100px;
  background: #00f2fe;
  box-shadow: 0 0 25px #00f2fe, 0 0 10px #fff;
  border-radius: 10px;
  z-index: 9999;
  transition: top 0.15s linear, left 0.15s linear;
  pointer-events: none;
}

.cannon-station {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  gap: 14px;
}

.tank {
  width: 110px;
}

.ammo-btn {
  width: 80px;
  height: 50px;
  border: 1px solid #00d2ff;
  background: rgba(0, 210, 255, 0.1);
  color: #00d2ff;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  margin: 0 10px;
}

.ammo-btn:hover:not(:disabled) {
  background: #00d2ff;
  color: #000;
  box-shadow: 0 0 15px #00d2ff;
}

.ground-impact-explosion {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  text-align: center;
}

.big-boom-emoji {
  font-size: 10rem;
}

@keyframes fall {
  from {
    top: -150px;
  }
  to {
    top: calc(100% - 170px);
  }
}

.game-over-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 5, 15, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5000;
  backdrop-filter: blur(10px);
}

.game-over-card {
  background: #050b14;
  padding: 40px;
  border: 2px solid #ff4b2b;
  text-align: center;
  color: #fff;
  min-width: 320px;
}

.death-title {
  font-size: 3rem;
  color: #ff4b2b;
  margin: 10px 0;
}

.fs-val {
  font-size: 3rem;
  color: #00d2ff;
  display: block;
}

.restart-btn {
  display: block;
  width: 100%;
  padding: 15px;
  background: #ff4b2b;
  color: #fff;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 10px;
}

.home-btn {
  display: block;
  background: none;
  border: none;
  width: 100%;
  color: #aaa;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
}
</style>