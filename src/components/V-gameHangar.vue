<script setup>
import { ref, computed } from 'vue'
import { useGalaxyStore } from '../../store/galaxyStore.js'

const emit = defineEmits(['close'])
const store = useGalaxyStore()
const currentIdx = ref(0)
const currentTank = computed(() => store.tankList[currentIdx.value])
const isSelected = computed(() => store.selectedTankId === currentTank.value.id)
const isOwned = computed(() => store.ownedTanks.includes(currentTank.value.id))
const nextTank = () => currentIdx.value = (currentIdx.value + 1) % store.tankList.length
const prevTank = () => currentIdx.value = (currentIdx.value - 1 + store.tankList.length) % store.tankList.length
const handleBuy = () => {
  store.buyShip(currentTank.value)
}

const handleSelect = () => {
  store.selectShip(currentTank.value.id)
}
</script>

<template>
  <div class="hangar-fullscreen-toon">
    <div class="toon-space-bg"><div class="toon-stars"></div></div>
    <div class="top-hud">
      <button class="back-cyber-btn toon-style" @click="$emit('close')"><span>ВЫЙТИ</span></button>
      <div class="cyber-plank toon-style balance-display">
        <span class="credits-val">{{ store.balance }} 💎</span>
      </div>
    </div>
    <div class="ship-showroom">
      <button class="nav-btn toon-arrow left" @click="prevTank">◀</button>
      <div class="ship-stage-container">
        <div class="ship__inner">
          <Transition name="ship-pop" mode="out-in">
            <div :key="currentIdx" class="ship-active-zone">
              <img :src="currentTank.img" class="ship-main-img toon-ship" :alt="currentTank.name"/>
              <div class="holo-platform toon-platform"></div>
            </div>
          </Transition>

          <div class="stats-cyber-panel toon-panel">
            <div class="stat-row">
              <span class="label toon-label">POWER</span>
              <div class="bar-bg toon-bar-bg">
                <div class="bar-fill toon-orange" :style="{width: currentTank.power + '%'}"></div>
              </div>
            </div>
            <div class="stat-row">
              <span class="label toon-label">WARP</span>
              <div class="bar-bg toon-bar-bg">
                <div class="bar-fill toon-cyan" :style="{width: currentTank.speed + '%'}"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="nav-btn toon-arrow right" @click="nextTank">▶</button>
    </div>

    <div class="bottom-card-wrapper">
      <div class="info-terminal toon-terminal">
        <h2 class="ship-name-display toon-title">{{ currentTank.name }}</h2>
        <div class="action-btn-container">
          <button v-if="!isOwned" class="cyber-action buy toon-buy" @click="handleBuy">
            КУПИТЬ: {{ currentTank.price }}
          </button>
          <button v-else class="cyber-action select toon-select" :class="{ active: isSelected }" @click="handleSelect">
            {{ isSelected ? 'ГОТОВ!' : 'ВЫБРАТЬ' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- ОСНОВНОЙ КОНТЕЙНЕР --- */
.hangar-fullscreen-toon {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
  background: #2c3e50; /* Более яркий темный фон */
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  /* Используем более округлый, мультяшный шрифт, если есть, иначе стандартный жирный */
  font-family: 'Arial Rounded MT Bold', 'Helvetica Rounded', Arial, sans-serif;
  font-weight: bold;
  overflow: hidden;
}

/* --- МУЛЬТЯШНЫЙ ФОН --- */
.toon-space-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, #34495e 0%, #2c3e50 100%);
  z-index: -1;
}

.toon-stars {
  position: absolute; inset: 0;
  background-image: radial-gradient(white 2px, transparent 2px), radial-gradient(white 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: 0 0, 25px 25px;
  opacity: 0.3;
}

/* --- HUD ВЕРХ (Те же формы, новый стиль) --- */
.top-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Общий стиль для мультяшных элементов с clip-path */
.toon-style {
  background: #fff;
  border: 4px solid #000 !important; /* Жирная обводка */
  color: #000;
  box-shadow: 4px 4px 0px #000; /* Жесткая тень */
  text-shadow: none;
  font-weight: 900;
}

.back-cyber-btn.toon-style {
  padding: 8px 20px;
  cursor: pointer;
  /* Оставляем твой clip-path */
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%);
  transition: 0.1s;
  font-size: 20px;
  background: #ff5252; /* Красная кнопка выхода */
  color: #fff;
}

.back-cyber-btn.toon-style:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
}

.cyber-plank.toon-style {
  padding: 8px 30px;
  background: #f1c40f; /* Желтая плашка баланса */
  /* Оставляем твой clip-path */
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
}

.credits-val {
  color: #000;
  font-size: 1.4rem;
  font-weight: 900;
}

/* --- ШОУРУМ --- */
.ship-showroom {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  gap: 35px;
}

.ship-active-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Мультяшный корабль */
.ship-main-img.toon-ship {
  width: 220px;
  /* Жесткая черная тень вместо свечения */
  filter: drop-shadow(5px 5px 0px rgba(0,0,0,0.5));
  animation: hover 4s ease-in-out infinite;
}

@keyframes hover {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
}

/* Мультяшная платформа */
.holo-platform.toon-platform {
  width: 180px;
  height: 20px;
  background: #3498db;
  border: 3px solid #000;
  border-radius: 50%;
  opacity: 1; /* Не прозрачная */
  margin-top: 15px;
  box-shadow: 0 5px 0px #000; /* Жесткая тень */
}

/* Мультяшные стрелки */
.nav-btn.toon-arrow {
  width: 50px; height: 50px;
  background: #fff;
  border: 4px solid #000;
  color: #000;
  font-size: 1.5rem;
  cursor: pointer;
  transition: 0.1s;
  box-shadow: 4px 4px 0 #000;
  border-radius: 10px; /* Чуть скруглил, но можно оставить квадратными */
}

.nav-btn.toon-arrow:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #000;
  background: #f1c40f;
}

/* --- ПАНЕЛЬ СТАТОВ (Мультяшная) --- */
.stats-cyber-panel.toon-panel {
  background: #fff;
  padding: 15px;
  border: 4px solid #000;
  width: 180px;
  margin-top: 20px;
  border-radius: 15px;
  box-shadow: 6px 6px 0 #000;
}

.label.toon-label {
  color: #000;
  font-size: 0.8rem;
  font-weight: 900;
  margin-bottom: 5px;
  display: block;
}

.bar-bg.toon-bar-bg {
  width: 100%; height: 12px;
  background: #bdc3c7;
  border: 3px solid #000;
  border-radius: 6px;
  margin-bottom: 10px;
  overflow: hidden;
}

.bar-fill.toon-orange { background: #e67e22; }
.bar-fill.toon-cyan { background: #3498db; }

/* --- НИЖНИЙ ТЕРМИНАЛ (Те же формы, новый стиль) --- */
.bottom-card-wrapper { display: flex; justify-content: center; margin-top: 20px; }

.info-terminal.toon-terminal {
  background: #fff;
  border: 5px solid #000; /* Жирная рамка */
  padding: 25px;
  text-align: center;
  width: 100%;
  max-width: 400px;
  /* Оставляем твой сложный clip-path */
  clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px));
  box-shadow: 8px 8px 0px rgba(0,0,0,0.3); /* Тень для объема */
  color: #000;
}

.ship-name-display.toon-title {
  color: #000;
  font-size: 1.6rem;
  font-weight: 900;
  margin-bottom: 15px;
  text-shadow: none;
  text-transform: uppercase;
}

/* КНОПКИ ДЕЙСТВИЙ */
.cyber-action {
  width: 100%; padding: 15px;
  font-size: 1.1rem; font-weight: 900;
  background: #fff;
  cursor: pointer;
  transition: 0.1s;
  border: 4px solid #000 !important; /* Принудительно жирная рамка */
  box-shadow: 4px 4px 0 #000;
  color: #000;
  margin-top: 10px;
}

.cyber-action:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #000;
}

.buy.toon-buy { background: #f1c40f; } /* Желтая кнопка купить */
.select.toon-select { background: #3498db; color: #fff;} /* Синяя кнопка выбрать */

.select.active {
  background: #2ecc71; /* Зеленая активная */
  color: #fff;
  box-shadow: none;
  transform: translate(4px, 4px);
  pointer-events: none;
}

/* АДАПТИВ */
@media (max-width: 600px) {
  .ship-main-img.toon-ship { width: 160px; }
  .nav-btn.toon-arrow { width: 45px; height: 45px; }
  .ship-name-display.toon-title { font-size: 1.3rem; }
  .credits-val { font-size: 1.1rem; }
}

/* Твоя анимация (оставил без изменений) */
.ship-pop-enter-active, .ship-pop-leave-active { transition: all 0.3s ease; }
.ship-pop-enter-from { opacity: 0; transform: scale(0.9) translateX(30px); }
.ship-pop-leave-to { opacity: 0; transform: scale(0.9) translateX(-30px); }
</style>