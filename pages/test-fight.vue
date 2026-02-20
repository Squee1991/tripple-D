<template>
  <div class="game-universe">
    <div class="sky" ref="skyRef">
      <div class="star-layer"></div>

      <div class="score-board">
        <span class="score-label">ОЧКИ</span>
        <span class="score-divider"></span>
        <span class="score-value">{{ score }}</span>
      </div>
      <div v-if="!isGameOver" class="game-area">
        <div
            v-if="currentWord && !showGroundExplosion"
            ref="mobRef"
            :key="gameKey"
            class="mob"
            :style="mobStyles"
            @animationend="triggerBomb"
            @transitionend="handleTransitionEnd"
        >
          <div class="mob-inner">
            <span v-if="isWrongState">
              <img class="meteor__fire" :src="MeteorInFire" alt="FIRE">
            </span>
            <span v-else>
              <img class="parachute" :src="Meteor" alt="Meteor">
            </span>

            <div class="mob-bubble" v-if="!isWrongState">
              {{ currentWord.text }}
            </div>
          </div>
        </div>

        <div
            v-if="isMissileFlying"
            class="laser-beam"
            :style="missileStyles"
        ></div>

        <div v-if="showSuccessExplosion" class="vfx" :style="vfxPos">💥</div>
      </div>

      <div v-if="showGroundExplosion" class="ground-impact-explosion">
        <div class="big-boom-emoji">💥</div>
      </div>

      <div v-if="isGameOver" class="game-over-overlay">
        <div class="game-over-card">
          <p class="death-sub">Твой звездолет уничтожен!</p>
          <div class="final-score-wrap">
            <span class="fs-label">SCORE:</span>
            <span class="fs-val">{{ score }}</span>
          </div>
          <button class="restart-btn" @click="startGame">Начать заново</button>
          <router-link to="/games" class="home-btn">Покинуть миссию</router-link>
        </div>
      </div>
      <div class="cannon-station">
        <div class="main-cannon" :class="{ 'recoiling': isMissileFlying, 'shaking': showGroundExplosion }">
          <div class="cannon-barrel" v-if="!showGroundExplosion">
            <img class="tank" :src="Spaceship" alt="Ship">
          </div>
        </div>
        <div class="ammo-selector">
          <button
              v-for="art in ['der', 'die', 'das']"
              :key="art"
              class="ammo-btn"
              @click="shoot(art)"
              :disabled="isMissileFlying || showGroundExplosion || isWrongState"
          >
            {{ art.toUpperCase() }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, nextTick} from 'vue'
import Spaceship from '@/assets/images/spaceship.svg'
import Meteor from '../assets/images/meteor.svg'
import MeteorInFire from '../assets/images/meteorinFire.svg'

const words = [
  {text: 'Baum', art: 'der'}, {text: 'Garten', art: 'der'}, {text: 'Computer', art: 'der'},
  {text: 'Käse', art: 'der'}, {text: 'Mantel', art: 'der'}, {text: 'Berg', art: 'der'},
  {text: 'Brief', art: 'der'}, {text: 'Schlüssel', art: 'der'}, {text: 'Vogel', art: 'der'},
  {text: 'Löffel', art: 'der'},
  {text: 'Blume', art: 'die'}, {text: 'Tasche', art: 'die'}, {text: 'Lampe', art: 'die'},
  {text: 'Milch', art: 'die'}, {text: 'Stadt', art: 'die'}, {text: 'Kamera', art: 'die'},
  {text: 'Brille', art: 'die'}, {text: 'Gabel', art: 'die'}, {text: 'Wohnung', art: 'die'},
  {text: 'Straße', art: 'die'},
  {text: 'Buch', art: 'das'}, {text: 'Fenster', art: 'das'}, {text: 'Brot', art: 'das'},
  {text: 'Wasser', art: 'das'}, {text: 'Fahrrad', art: 'das'}, {text: 'Handy', art: 'das'},
  {text: 'Bett', art: 'das'}, {text: 'Messer', art: 'das'}, {text: 'Bild', art: 'das'},
  {text: 'Zimmer', art: 'das'}
]

const score = ref(0);
const isGameOver = ref(false);
const currentWord = ref(null);
const isWrongState = ref(false);
const showSuccessExplosion = ref(false);
const showGroundExplosion = ref(false);
const currentSpeed = ref(10);
const gameKey = ref(0);
const isMissileFlying = ref(false);
const missilePos = ref({top: 0, left: 0, angle: 0});
const vfxPos = ref({top: '0px', left: '0px'});
const mobRef = ref(null);
const skyRef = ref(null);
const attackStyle = ref({});

const mobStyles = computed(() => {
  if (isWrongState.value) return attackStyle.value;
  return {animationDuration: currentSpeed.value + 's'};
});

const missileStyles = computed(() => ({
  top: missilePos.value.top + 'px',
  left: missilePos.value.left + 'px',
  transform: `translate(-50%, -50%) rotate(${missilePos.value.angle + 90}deg)`,
  opacity: isMissileFlying.value ? 1 : 0
}));

const startGame = () => {
  score.value = 0;
  isGameOver.value = false;
  showGroundExplosion.value = false;
  isWrongState.value = false;
  currentSpeed.value = 10;
  attackStyle.value = {};
  spawnWord();
};

const spawnWord = () => {
  isWrongState.value = false;
  showSuccessExplosion.value = false;
  isMissileFlying.value = false;
  attackStyle.value = {};
  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord.value = words[randomIndex];
  gameKey.value++;
};

const shoot = async (answer) => {
  if (isGameOver.value || isMissileFlying.value || !mobRef.value || showGroundExplosion.value) return;
  const mobRect = mobRef.value.getBoundingClientRect();
  const skyRect = skyRef.value.getBoundingClientRect();
  const startX = skyRect.width / 2;
  const startY = skyRect.height - 130;
  const targetX = mobRect.left - skyRect.left + (mobRect.width / 2);
  const targetY = mobRect.top - skyRect.top + (mobRect.height / 2);
  const angle = Math.atan2(targetY - startY, targetX - startX) * 180 / Math.PI;
  missilePos.value = {top: startY, left: startX, angle: angle};
  isMissileFlying.value = true;

  await nextTick();
  setTimeout(() => {
    missilePos.value = {top: targetY, left: targetX, angle: angle};
    setTimeout(() => {
      checkHit(answer, targetX, targetY)
    }, 160);
  }, 20);
};

const checkHit = async (answer, x, y) => {
  isMissileFlying.value = false;
  vfxPos.value = {top: y + 'px', left: x + 'px'};
  if (answer === currentWord.value.art) {
    score.value += 10;
    showSuccessExplosion.value = true;
    if (currentSpeed.value > 2.5) currentSpeed.value -= 0.15;
    setTimeout(spawnWord, 400);
  } else {
    const currentTop = mobRef.value.offsetTop;
    attackStyle.value = {top: currentTop + 'px', animation: 'none'};
    isWrongState.value = true;
    await nextTick();
    setTimeout(() => {
      attackStyle.value = {
        top: 'calc(100% - 210px)',
        transition: 'top 1.5s linear',
        animation: 'none'
      };
    }, 50);
  }
};

const handleTransitionEnd = () => {
  if (isWrongState.value) triggerBomb();
};

const triggerBomb = () => {
  if (showSuccessExplosion.value) return;
  showGroundExplosion.value = true;
  setTimeout(() => {
    isGameOver.value = true
  }, 900);
};

onMounted(startGame);
</script>

<style scoped>
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

/* ЛАЗЕР (ФИКС) */
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

/* ВЗРЫВ */
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

/* МОДАЛКА */
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
  color: #aaa;
  text-decoration: none;
  font-size: 0.9rem;
}
</style>