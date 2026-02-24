<template>
  <div class="toon-navigation">
    <div class="toon-space-bg">
      <div class="nebula-purple"></div>
      <div class="nebula-blue"></div>
    </div>

    <div class="top-bar">
      <div class="exit-portal" @click="$emit('back')">
        <div class="black-hole">
          <div class="swirl"></div>
          <div class="event-horizon"></div>
        </div>
        <span class="exit-text">НАЗАД</span>
      </div>

      <h1 class="main-title-toon">ЗВЕЗДНЫЙ ПУТЬ</h1>
      <div class="pilot-info-toon"></div>
    </div>
    <div class="constellations-map">
      <div
          v-for="(galaxy, index) in galaxiesWithIcons"
          :key="galaxy.id"
          :class="['galaxy-anchor', 'pos-' + (index + 1)]"
          @click="openGalaxy(galaxy)"
      >
        <div class="galaxy-icon-wrapper">
          <img :src="galaxy.svg" class="galaxy-svg-toon" alt="galaxy"/>
        </div>
        <h2 class="galaxy-label-toon">{{ galaxy.label }}</h2>
      </div>
    </div>
    <Transition name="pop-window">
      <div v-if="activeGalaxy" class="modal-overlay" @click.self="activeGalaxy = null">
        <div class="toon-window">
          <button class="close-window" @click="activeGalaxy = null">✖</button>

          <div class="window-header">
            <div class="icon-frame">
              <img :src="activeGalaxy.svg" alt="" class="window-icon"/>
            </div>
            <div class="header-text">
              <p class="type-badge">{{ activeGalaxy.type.toUpperCase() }}</p>
              <h2>{{ activeGalaxy.name }}</h2>
            </div>
          </div>

          <div class="mission-briefing">
            <p class="mission-desc">{{ activeGalaxy.desc }}</p>
            <button class="btn-go big-btn" @click="startLevel">
              Начать 🚀
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useGalaxyStore} from '../../store/galaxyStore.js'

import ConstellationOne from '../../assets/images/constellation/constellation-1.svg'
import ConstellationTwo from '../../assets/images/constellation/constellation-2.svg'
import ConstellationThree from '../../assets/images/constellation/constellation-3.svg'
import ConstellationFour from '../../assets/images/constellation/constellation-4.svg'
import ConstellationFive from '../../assets/images/constellation/constellation-5.svg'
import ConstellationSix from '../../assets/images/constellation/constellation-6.svg'
import ConstellationSeven from '../../assets/images/constellation/constellation-7.svg'
import ConstellationEight from '../../assets/images/constellation/constellation-8.svg'

const emit = defineEmits(['back', 'select'])
const store = useGalaxyStore()
const activeGalaxy = ref(null)

const iconMap = {
  alpha: ConstellationOne,
  beta: ConstellationTwo,
  gamma: ConstellationThree,
  delta: ConstellationFour,
  epsilon: ConstellationFive,
  zeta: ConstellationSix,
  eta: ConstellationSeven,
  theta: ConstellationEight
}

onMounted(async () => {
  await store.fetchGalaxies()
})

const galaxiesWithIcons = computed(() => {
  return store.galaxies.map(galaxy => ({
    ...galaxy,
    svg: iconMap[galaxy.id] || ConstellationOne
  }))
})

const openGalaxy = (galaxy) => {
  activeGalaxy.value = galaxy
}

const startLevel = () => {
  store.setMission(activeGalaxy.value.id)
  emit('select', activeGalaxy.value.id)
}
</script>

<style scoped>

.toon-navigation {
  position: fixed;
  inset: 0;
  background: #0a0a2e;
  overflow: hidden;
  font-family: 'Arial Rounded MT Bold', 'Helvetica', sans-serif;
  z-index: 5000;
  user-select: none;
}

.toon-space-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0, 0, 0, 0)),
  radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
  radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0, 0, 0, 0));
  background-size: 200px 200px;
  animation: starsTwinkle 4s infinite linear;
}

@keyframes starsTwinkle {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

.nebula-purple {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(156, 39, 176, 0.4), transparent 70%);
  filter: blur(80px);
}

.nebula-blue {
  position: absolute;
  bottom: -10%;
  right: -10%;
  width: 60%;
  height: 60%;
  background: radial-gradient(circle, rgba(3, 169, 244, 0.4), transparent 70%);
  filter: blur(80px);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 50px;
  position: relative;
  z-index: 10;
}

.main-title-toon {
  color: #ffeb3b;
  font-size: 2.5rem;
  text-transform: uppercase;
  -webkit-text-stroke: 3px #adb1a8;
  filter: drop-shadow(3px 3px 0px #e65100);
  transform: rotate(-2deg);
  letter-spacing: 4px;
}

.btn-exit-toon {
  background: #ff5252;
  border: 4px solid #000;
  border-radius: 18px;
  color: #fff;
  font-weight: 900;
  padding: 12px 25px;
  cursor: pointer;
  box-shadow: 0 6px 0 #000;
  transition: 0.1s;
}

.btn-exit-toon:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #000;
}

.pilot-info-toon {
  padding: 10px 20px;
  border-radius: 50px;
  color: #fff;
  font-weight: 900;
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3);
}

.constellations-map {
  position: relative;
  height: 75vh;
  width: 100%;
}

.galaxy-anchor {
  position: absolute;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.galaxy-anchor:hover {
  transform: scale(1.15) rotate(3deg);
  z-index: 100;
}

.galaxy-icon-wrapper {
  position: relative;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  padding: 20px;
  border-radius: 50%;
}

.galaxy-svg-toon {
  width: 130px;
  height: 130px;
  filter: drop-shadow(0 0 15px rgba(0, 210, 255, 0.8));
  animation: floatGalaxy 6s infinite ease-in-out;
}

@keyframes floatGalaxy {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.click-me {
  position: absolute;
  top: -10px;
  background: #ffeb3b;
  border: 3px solid #000;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #000;
  font-weight: 900;
  box-shadow: 4px 4px 0 #000;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%);
  }
  40% {
    transform: translateY(-10px) translateX(-50%);
  }
}

.galaxy-label-toon {
  color: #fff;
  font-size: 1.5rem;
  -webkit-text-stroke: 1.5px #cebebe;
  text-shadow: 4px 4px 0 #2196f3;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 6000;
  backdrop-filter: blur(4px);
}

.toon-window {
  background: #ffffff;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ТОНКАЯ КНОПКА ЗАКРЫТИЯ */
.close-window {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: #f1f1f1;
  border: none;
  border-radius: 50%;
  color: #333;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s;
  z-index: 10;
}

.close-window:hover { background: #e2e2e2; }

/* ШАПКА */
.window-header {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px 16px;
  text-align: center;
}

.icon-frame {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.window-icon {
  width: 100%;
  height: auto;
}

.header-text h2 {
  font-size: 1.5rem;
  margin: 0;
  color: #111;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.type-badge {
  color: #666;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

/* КОНТЕНТ */
.mission-briefing {
  padding: 0 32px 32px;
  text-align: center;
}

.mission-desc {
  font-size: 1rem;
  color: #555;
  margin-bottom: 24px;
  line-height: 1.5;
}

/* ЛАКОНИЧНАЯ КНОПКА */
.big-btn {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s, transform 0.1s;
}

.big-btn:hover { background: #1976d2; }
.big-btn:active { transform: scale(0.98); }

/* ПЛАВНОЕ ПОЯВЛЕНИЕ */
.pop-window-enter-active {
  transition: all 0.3s ease-out;
}
.pop-window-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.pos-1 {
  top: 15%;
  left: 15%;
}

.pos-2 {
  top: 10%;
  left: 45%;
}

.pos-3 {
  top: 18%;
  left: 75%;
}

.pos-4 {
  top: 48%;
  left: 10%;
}

.pos-5 {
  top: 42%;
  left: 42%;
}

.pos-6 {
  top: 48%;
  left: 78%;
}

.pos-7 {
  top: 75%;
  left: 25%;
}

.pos-8 {
  top: 72%;
  left: 60%;
}

.exit-portal {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  z-index: 100;
}

.exit-portal:hover {
  transform: scale(1.1);
}

.exit-portal:hover .black-hole {
  box-shadow: 0 0 30px rgba(156, 39, 176, 0.8);
}

.black-hole {
  position: relative;
  width: 60px;
  height: 60px;
  background: #000;
  border-radius: 50%;
  margin-bottom: 8px;
  overflow: hidden;
  box-shadow: 0 0 15px rgba(156, 39, 176, 0.4);
}

/* ЭФФЕКТ ЗАКРУЧИВАНИЯ */
.swirl {
  position: absolute;
  inset: -50%;
  background: conic-gradient(
      from 0deg,
      transparent,
      #6200ea,
      #aa00ff,
      transparent 60%
  );
  animation: rotatePortal 3s linear infinite;
  filter: blur(5px);
}

/* ГОРИЗОНТ СОБЫТИЙ */
.event-horizon {
  position: absolute;
  inset: 15%;
  background: #000;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 2;
}

.exit-text {
  color: #fff;
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #6200ea;
  opacity: 0.7;
}

@keyframes rotatePortal {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.top-bar {
  display: flex;
  justify-content: space-between;
  padding: 30px 50px;
  position: relative;
  z-index: 10;
}

@media (max-width: 768px) {
  .constellations-map {
    position: relative;
    height: auto;
    min-height: 100vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 40px 20px;
    padding: 100px 20px 50px;
    overflow-y: auto;
  }

  .galaxy-anchor {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    transform: none !important;
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* 3. Оптимизируем размеры для тача */
  .galaxy-svg-toon {
    width: 90px !important;
    height: 90px !important;
  }

  .galaxy-label-toon {
    font-size: 0.9rem !important;
    text-align: center;
    margin-top: 10px;
    white-space: nowrap; /* Чтобы названия не ломались */
  }

  /* 4. Корректируем шапку, чтобы не мешала */
  .top-bar {
    position: fixed; /* Закрепляем шапку сверху */
    top: 0;
    width: 100%;
    background: rgba(10, 10, 46, 0.8); /* Полупрозрачный фон при скролле */
    backdrop-filter: blur(5px);
    padding: 10px 20px;
    z-index: 1000;
  }

  .main-title-toon {
    font-size: 1.5rem !important;
  }

  .black-hole {
    width: 40px !important;
    height: 40px !important;
  }
}

</style>