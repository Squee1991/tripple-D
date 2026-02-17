<template>
  <div class="game-universe">
    <div class="sky" ref="skyRef">
      <div class="cloud c1">☁️</div>
      <div class="cloud c2">☁️</div>
      <div class="cloud c3">☁️</div>
      <div class="cloud c4">☁️</div>
      <div class="cloud c5">☁️</div>
      <div class="cloud c6">☁️</div>
      <div class="cloud c7">☁️</div>
      <div class="cloud c8">☁️</div>

      <div class="score-board">
        <span class="score-label">PUNKTE</span>
        <span class="score-divider"></span>
        <span class="score-value">{{ score }}</span>
      </div>

      <div v-if="!isGameOver" class="game-area">
        <div
            v-if="currentWord"
            ref="mobRef"
            :key="gameKey"
            class="mob"
            :class="{ 'is-wrong': isWrongState, 'hidden': showGroundExplosion }"
            :style="{ animationDuration: currentSpeed + 's' }"
            @animationend="triggerBomb"
        >
          <div class="mob-inner">
            <span class="mob-emoji">{{ isWrongState ? '🤬' : '👾' }}</span>
            <div class="mob-bubble">
              {{ currentWord.text }}
            </div>
          </div>
        </div>

        <img
            v-if="isMissileFlying"
            :src="Rocket"
            class="missile"
            :style="missileStyles"
        />

        <div
            v-if="showSuccessExplosion"
            class="explosion small-boom"
            :style="{ top: explosionPos.top + 'px', left: explosionPos.left + 'px' }"
        >
          💥
        </div>

        <div
            v-if="showWrongExplosion"
            class="explosion wrong-boom"
            :style="{ top: wrongExplosionPos.top + 'px', left: wrongExplosionPos.left + 'px' }"
        >
          🗯️💨
        </div>
      </div>

      <div v-if="showGroundExplosion" class="ground-impact-explosion">
        <div class="big-boom-emoji">💥</div>
        <div class="boom-text">KABOOM!</div>
      </div>

      <div v-if="isGameOver" class="game-over-overlay">
        <div class="game-over-card">
          <div class="skull-icon">☠️</div>
          <h2>KAPUTT!</h2>
          <p>Твоя оборона была прорвана!</p>
          <div class="final-score-wrap">
            <span class="fs-label">Счёт:</span>
            <span class="fs-val">{{ score }}</span>
          </div>
          <button class="restart-btn" @click="startGame">ERNEUT VERSUCHEN</button>
          <router-link to="/" class="home-btn">Вернуться на главную</router-link>
        </div>
      </div>
    </div>

    <div class="ground">
      <div class="grass-edge"></div>
      <div class="cannon-station">
        <div class="main-cannon" :class="{ 'recoiling': isMissileFlying, 'shaking': showGroundExplosion }">
          <div class="cannon-barrel" v-if="!showGroundExplosion">
            <img class="tank" :src="Tank" alt="Panzer">
          </div>
        </div>
        <div class="ammo-selector">
          <button
              v-for="art in ['der', 'die', 'das']"
              :key="art"
              class="ammo-btn"
              :class="art"
              @click="shoot(art)"
              :disabled="isMissileFlying || showGroundExplosion"
          >
            {{ art.toUpperCase() }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Rocket from '@/assets/images/missile.svg'
import Tank from '@/assets/images/Tank.svg'

const words = [
  { text: 'Apfel', art: 'der' }, { text: 'Tisch', art: 'der' }, { text: 'Hund', art: 'der' }, { text: 'Garten', art: 'der' }, { text: 'Stuhl', art: 'der' },
  { text: 'Sonne', art: 'die' }, { text: 'Tür', art: 'die' }, { text: 'Katze', art: 'die' }, { text: 'Lampe', art: 'die' }, { text: 'Milch', art: 'die' },
  { text: 'Auto', art: 'das' }, { text: 'Kind', art: 'das' }, { text: 'Haus', art: 'das' }, { text: 'Buch', art: 'das' }, { text: 'Wasser', art: 'das' },
  { text: 'Brot', art: 'das' }, { text: 'Fenster', art: 'das' }, { text: 'Blume', art: 'die' }, { text: 'Tasche', art: 'die' }, { text: 'Tisch', art: 'der' }
]

const score = ref(0)
const isGameOver = ref(false)
const currentWord = ref(null)
const isWrongState = ref(false)
const showSuccessExplosion = ref(false)
const showWrongExplosion = ref(false)
const showGroundExplosion = ref(false)

const currentSpeed = ref(6)
const gameKey = ref(0)
const isMissileFlying = ref(false)
const missilePos = ref({ top: 0, left: 0, angle: 0 })

const mobRef = ref(null)
const skyRef = ref(null)
const explosionPos = ref({ top: 0, left: 0 })
const wrongExplosionPos = ref({ top: 0, left: 0 })

const missileStyles = computed(() => ({
  top: missilePos.value.top + 'px',
  left: missilePos.value.left + 'px',
  transform: `translate(-50%, -50%) rotate(${missilePos.value.angle + 45}deg)`
}))

const startGame = () => {
  score.value = 0
  isGameOver.value = false
  showGroundExplosion.value = false
  currentSpeed.value = 6
  spawnWord()
}

const spawnWord = () => {
  isWrongState.value = false
  showSuccessExplosion.value = false
  showWrongExplosion.value = false
  isMissileFlying.value = false
  const randomIndex = Math.floor(Math.random() * words.length)
  currentWord.value = words[randomIndex]
  gameKey.value++
}

const shoot = (answer) => {
  if (isGameOver.value || isMissileFlying.value || !mobRef.value || showGroundExplosion.value) return

  const mobRect = mobRef.value.getBoundingClientRect()
  const skyRect = skyRef.value.getBoundingClientRect()

  const startX = skyRect.width / 2
  const startY = skyRect.height - 40

  const targetX = mobRect.left - skyRect.left + (mobRect.width / 2)
  const targetY = mobRect.top - skyRect.top + (mobRect.height / 2)

  const angle = Math.atan2(targetY - startY, targetX - startX) * 180 / Math.PI

  missilePos.value = { top: startY, left: startX, angle: angle }
  isMissileFlying.value = true

  setTimeout(() => {
    missilePos.value = { top: targetY, left: targetX, angle: angle }
    setTimeout(() => {
      checkHit(answer, targetX, targetY)
    }, 250)
  }, 10)
}

const checkHit = (answer, x, y) => {
  isMissileFlying.value = false

  if (answer === currentWord.value.art) {
    explosionPos.value = { top: y, left: x }
    score.value += 10
    showSuccessExplosion.value = true
    if (currentSpeed.value > 2) currentSpeed.value -= 0.15
    setTimeout(spawnWord, 400)
  } else {
    wrongExplosionPos.value = { top: y, left: x }
    showWrongExplosion.value = true

    if (!isWrongState.value) {
      isWrongState.value = true
      currentSpeed.value = currentSpeed.value / 3
    }
    setTimeout(() => {
      showWrongExplosion.value = false
    }, 400)
  }
}

const triggerBomb = () => {
  if (showSuccessExplosion.value) return
  showGroundExplosion.value = true
  setTimeout(() => {
    isGameOver.value = true
  }, 1000)
}

onMounted(startGame)
</script>

<style scoped>
.game-universe {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
  overflow: hidden;
  font-family: 'Arial Rounded MT Bold', 'Segoe UI', Roboto, sans-serif;
  user-select: none;
}

.cloud {
  position: absolute;
  font-size: 3rem;
  opacity: 0.6;
  filter: blur(2px);
  animation: cloudFloat linear infinite;
  z-index: 1;
}
.c1 { top: 5%; left: -10%; animation-duration: 30s; font-size: 4rem; }
.c2 { top: 15%; left: -20%; animation-duration: 45s; animation-delay: -5s; }
.c3 { top: 10%; left: 110%; animation-duration: 35s; animation-direction: reverse; font-size: 3.5rem; }
.c4 { top: 25%; left: 30%; animation-duration: 55s; opacity: 0.4; }
.c5 { top: 8%; left: 70%; animation-duration: 40s; animation-delay: -10s; }
.c6 { top: 20%; left: 90%; animation-duration: 28s; font-size: 2.5rem; }
.c7 { top: 30%; left: 10%; animation-duration: 50s; opacity: 0.3; }
.c8 { top: 12%; left: 50%; animation-duration: 33s; animation-delay: -15s; }

@keyframes cloudFloat {
  from { transform: translateX(0); }
  to { transform: translateX(120vw); }
}

.sky { flex-grow: 1; position: relative; }

.score-board {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 30px;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 10;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
.score-label { color: #fff; font-size: 0.9rem; letter-spacing: 2px; font-weight: bold; }
.score-divider { width: 2px; height: 20px; background: rgba(255,255,255,0.3); }
.score-value { font-size: 2rem; font-weight: 900; color: #ffeb3b; text-shadow: 0 2px 10px rgba(0,0,0,0.2); }

.mob { position: absolute; width: 180px; left: 50%; transform: translateX(-50%); animation: fall linear forwards; z-index: 50; }
.mob.hidden { opacity: 0; }

.mob-inner { display: flex; flex-direction: column; align-items: center; }
.mob-emoji { font-size: 3.5rem; margin-bottom: -10px; z-index: 2; filter: drop-shadow(0 5px 5px rgba(0,0,0,0.2)); }
.mob-bubble {
  background: #fff; color: #2c3e50; padding: 12px 25px; border-radius: 20px;
  font-size: 1.5rem; font-weight: 900; text-transform: uppercase;
  border: 4px solid #2c3e50; box-shadow: 0 10px 0 rgba(0, 0, 0, 0.1), inset 0 -4px 0 rgba(0,0,0,0.05); position: relative;
}
.is-wrong .mob-bubble { background: #ff5252; color: #fff; border-color: #fff; box-shadow: 0 10px 0 #b71c1c; animation: shake 0.2s infinite; }
@keyframes shake { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }

.missile { position: absolute; width: 60px; z-index: 15; transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94); filter: drop-shadow(0 0 10px rgba(255, 235, 59, 0.6)); }

.main-cannon { position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); z-index: 5; transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.tank { width: 140px; height: auto; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3)); }
.recoiling { transform: translateX(-50%) translateY(15px) scale(0.95); }
.shaking { animation: shake-hard 0.2s infinite; }
@keyframes shake-hard { 0% { transform: translateX(-50%) translate(0,0); } 25% { transform: translateX(-50%) translate(5px, 5px); } 75% { transform: translateX(-50%) translate(-5px, -5px); } }

.ground { height: 200px; background: linear-gradient(180deg, #2ecc71 0%, #27ae60 100%); display: flex; justify-content: center; align-items: center; position: relative; box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1); }
.grass-edge { position: absolute; top: -15px; width: 100%; height: 20px; background-image: radial-gradient(circle at 50% 100%, #2ecc71 50%, transparent 55%); background-size: 40px 20px; }
.ammo-selector { display: flex; gap: 25px; z-index: 20; padding-top: 20px; }
.ammo-btn { width: 90px; height: 60px; border-radius: 15px; border: none; font-size: 1.2rem; font-weight: 900; color: white; cursor: pointer; transition: all 0.1s; display: flex; justify-content: center; align-items: center; text-shadow: 0 2px 4px rgba(0,0,0,0.2); }
.der { background: #3498db; box-shadow: 0 8px 0 #2980b9; }
.die { background: #e74c3c; box-shadow: 0 8px 0 #c0392b; }
.das { background: #546e7a; box-shadow: 0 8px 0 #37474f; }
.ammo-btn:active:not(:disabled) { transform: translateY(4px); box-shadow: 0 4px 0 rgba(0,0,0,0.2); }
.ammo-btn:disabled { opacity: 0.6; filter: grayscale(0.5); cursor: not-allowed; }

.explosion { position: absolute; font-size: 7rem; transform: translate(-50%, -50%); z-index: 30; }
.small-boom { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
.wrong-boom { animation: pop-wrong 0.4s ease-out forwards; filter: grayscale(1) brightness(1.5); }

.ground-impact-explosion { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); z-index: 100; text-align: center; }
.big-boom-emoji { font-size: 10rem; animation: pop-big 0.8s ease-out forwards; }
.boom-text { font-size: 3rem; color: #ffeb3b; font-weight: 900; text-shadow: 0 0 20px #f44336; animation: pop-text 0.8s ease-out forwards; margin-top: -40px;}

@keyframes pop { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; } }
@keyframes pop-wrong { 0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; } }
@keyframes pop-big { 0% { transform: scale(0); opacity: 1; } 50% { transform: scale(1.2); } 100% { transform: scale(2); opacity: 0; } }
@keyframes pop-text { 0% { transform: translateY(20px) scale(0); opacity: 0; } 50% { transform: translateY(-20px) scale(1.2); opacity: 1; } 100% { transform: translateY(-50px) scale(1); opacity: 0; } }
@keyframes fall { 0% { top: -150px; } 100% { top: 100%; } }

.game-over-overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 200; animation: fade-in 0.5s ease-out; }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.game-over-card { background: white; padding: 40px; border-radius: 40px; text-align: center; border: 6px solid #f44336; max-width: 350px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
.fs-val { font-size: 4rem; font-weight: 900; color: #3498db; }
.restart-btn { background: #ff9800; color: white; border: none; padding: 18px 40px; border-radius: 20px; font-size: 1.3rem; font-weight: 900; cursor: pointer; width: 100%; box-shadow: 0 6px 0 #e65100; transition: 0.1s; }
</style>