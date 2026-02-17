<template>
  <div class="game-universe">
    <div class="sky" ref="skyRef">
      <div class="score-board">Очки: {{ score }}</div>

      <div v-if="!isGameOver" class="game-area">
        <div
            v-if="currentWord"
            ref="mobRef"
            :key="gameKey"
            class="mob"
            :class="{ 'is-wrong': isWrongState }"
            :style="{ animationDuration: currentSpeed + 's' }"
            @animationend="triggerBomb"
        >
          <div class="mob-inner">
            <span class="mob-emoji">{{ isWrongState ? '🤬' : '👾' }}</span>
            <div class="mob-text">{{ currentWord.text }}</div>
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
      </div>

      <div v-else class="game-over-overlay">
        <div class="big-explosion">☠️</div>
        <div class="game-over-card">
          <h2>KAPUTT!</h2>
          <div class="final-score">Счёт: {{ score }}</div>
          <button class="restart-btn" @click="startGame">ПЕРЕЗАРЯДКА</button>
          <router-link to="/" class="home-btn">На главную</router-link>
        </div>
      </div>
    </div>

    <div class="ground">
      <div class="main-cannon" :class="{ 'recoiling': isMissileFlying }">
        <span class="cannon-body">🚜</span>
        <span class="cannon-barrel">🚀</span>
      </div>

      <div class="ammo-selector">
        <button
            v-for="art in ['der', 'die', 'das']"
            :key="art"
            class="ammo-btn"
            :class="art"
            @click="shoot(art)"
            :disabled="isMissileFlying"
        >
          {{ art.toUpperCase() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Rocket from '@/assets/images/missile.svg' // Убедись, что путь верный

const words = [
  { text: 'Apfel', art: 'der' }, { text: 'Baum', art: 'der' }, { text: 'Hund', art: 'der' }, { text: 'Garten', art: 'der' }, { text: 'Stuhl', art: 'der' },
  { text: 'Sonne', art: 'die' }, { text: 'Tür', art: 'die' }, { text: 'Katze', art: 'die' }, { text: 'Lampe', art: 'die' }, { text: 'Milch', art: 'die' },
  { text: 'Auto', art: 'das' }, { text: 'Kind', art: 'das' }, { text: 'Haus', art: 'das' }, { text: 'Buch', art: 'das' }, { text: 'Wasser', art: 'das' },
  { text: 'Brot', art: 'das' }, { text: 'Fenster', art: 'das' }, { text: 'Blume', art: 'die' }, { text: 'Tasche', art: 'die' }, { text: 'Tisch', art: 'der' }
]

const score = ref(0)
const isGameOver = ref(false)
const currentWord = ref(null)
const isWrongState = ref(false)
const showSuccessExplosion = ref(false)
const currentSpeed = ref(6)
const gameKey = ref(0)

// Ракета
const isMissileFlying = ref(false)
const missilePos = ref({ top: 0, left: 0, angle: 0 })

// Refs
const mobRef = ref(null)
const skyRef = ref(null)
const explosionPos = ref({ top: 0, left: 0 })

const missileStyles = computed(() => ({
  top: missilePos.value.top + 'px',
  left: missilePos.value.left + 'px',
  transform: `translate(-50%, -50%) rotate(${missilePos.value.angle}deg)`
}))

const startGame = () => {
  score.value = 0
  isGameOver.value = false
  currentSpeed.value = 6
  spawnWord()
}

const spawnWord = () => {
  isWrongState.value = false
  showSuccessExplosion.value = false
  isMissileFlying.value = false
  const randomIndex = Math.floor(Math.random() * words.length)
  currentWord.value = words[randomIndex]
  gameKey.value++
}

const shoot = (answer) => {
  if (isGameOver.value || isMissileFlying.value || !mobRef.value) return

  const mobRect = mobRef.value.getBoundingClientRect()
  const skyRect = skyRef.value.getBoundingClientRect()

  // 1. Позиция старта (пушка внизу по центру)
  const startX = skyRect.width / 2
  const startY = skyRect.height

  // 2. Позиция цели (где моб сейчас)
  const targetX = mobRect.left - skyRect.left + (mobRect.width / 2)
  const targetY = mobRect.top - skyRect.top + (mobRect.height / 2)

  // Вычисляем угол поворота ракеты
  const angle = Math.atan2(targetY - startY, targetX - startX) * 180 / Math.PI

  // Запуск ракеты
  missilePos.value = { top: startY, left: startX, angle: angle + 90 }
  isMissileFlying.value = true

  // Анимация полета ракеты к цели
  setTimeout(() => {
    missilePos.value = { top: targetY, left: targetX, angle: angle + 90 }

    // Когда ракета "долетела" (через 300мс)
    setTimeout(() => {
      checkHit(answer, targetX, targetY)
    }, 300)
  }, 10)
}

const checkHit = (answer, x, y) => {
  isMissileFlying.value = false
  explosionPos.value = { top: y, left: x }

  if (answer === currentWord.value.art) {
    score.value += 10
    showSuccessExplosion.value = true
    if (currentSpeed.value > 2) currentSpeed.value -= 0.15
    setTimeout(spawnWord, 400)
  } else {
    // Неверно — моб звереет и ускоряется
    if (!isWrongState.value) {
      isWrongState.value = true
      currentSpeed.value = currentSpeed.value / 3
    }
  }
}

const triggerBomb = () => {
  if (!showSuccessExplosion.value) isGameOver.value = true
}

onMounted(startGame)
</script>

<style scoped>
.game-universe {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(#4facfe 0%, #00f2fe 100%);
  overflow: hidden;
  font-family: 'Arial Rounded MT Bold', sans-serif;
}

.sky { flex-grow: 1; position: relative; }

/* РАКЕТА */
.missile {
  position: absolute;
  width: 40px;
  z-index: 15;
  transition: all 3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.5));
  transform: rotate(45deg);

}

.mob {
  position: absolute;
  width: 150px;
  left: 50%;
  transform: translateX(-50%);
  animation: fall linear forwards;
}

/* Пушка */
.main-cannon {
  position: absolute;
  bottom: 140px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.1s;
}

.recoiling { transform: translateX(-50%) translateY(10px) scale(0.9); }

.cannon-barrel { transform: translateY(20px); font-size: 2.5rem; }

/* Кнопки */
.ground {
  height: 180px;
  background: #2ed573;
  border-top: 10px solid #26af5c;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.ammo-selector { display: flex; gap: 20px; z-index: 20; }

.ammo-btn {
  padding: 15px 30px;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  color: white;
  box-shadow: 0 6px 0 rgba(0,0,0,0.2);
  transition: 0.1s;
}

.ammo-btn:active { transform: translateY(4px); box-shadow: none; }
.ammo-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.der { background: #1e90ff; }
.die { background: #ff4757; }
.das { background: #2f3542; }

/* Взрывы и прочее */
.explosion { position: absolute; font-size: 6rem; transform: translate(-50%, -50%); z-index: 30; }
.small-boom { animation: pop 0.4s ease-out forwards; }

@keyframes pop {
  0% { scale: 0.5; opacity: 1; }
  100% { scale: 2.5; opacity: 0; }
}

@keyframes fall {
  0% { top: -100px; }
  100% { top: 100%; }
}

/* Экраны конца игры такие же как в прошлом примере */
.game-over-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.game-over-card { background: white; padding: 40px; border-radius: 30px; text-align: center; }
.restart-btn { background: #ffa500; color: white; border: none; padding: 15px 30px; border-radius: 20px; font-weight: bold; cursor: pointer; }
</style>