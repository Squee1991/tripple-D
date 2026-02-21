<template>
  <div class="toon-navigation">
    <div class="toon-space-bg">
      <div class="nebula-purple"></div>
      <div class="nebula-blue"></div>
      <div v-for="n in 12" :key="n" :class="'star-pop star-' + n">⭐</div>
    </div>

    <div class="top-bar">
      <button class="btn-exit-toon" @click="$emit('back')">ВЫХОД</button>
      <h1 class="main-title-toon">ЗВЕЗДНЫЙ ПУТЬ</h1>
      <div class="pilot-info-toon">ПИЛОТ: PRO</div>
    </div>

    <div class="constellations-map">
      <div
          v-for="(galaxy, index) in galaxies"
          :key="galaxy.id"
          :class="['galaxy-anchor', 'pos-' + (index + 1)]"
          @click="openGalaxy(galaxy)"
      >
        <div class="galaxy-icon-wrapper">
          <img :src="galaxy.svg" class="galaxy-svg-toon" alt="galaxy"/>
          <div class="click-me">КЛИК!</div>
        </div>
        <h2 class="galaxy-label-toon">{{ galaxy.name }}</h2>
      </div>
    </div>

    <Transition name="pop-window">
      <div v-if="activeGalaxy" class="modal-overlay" @click.self="activeGalaxy = null">
        <div class="toon-window">
          <button class="close-window" @click="activeGalaxy = null">✖</button>

          <div class="window-header">
            <img :src="activeGalaxy.svg" class="window-icon"/>
            <div class="header-text">
              <h2>СЕКТОР: {{ activeGalaxy.name }}</h2>
              <p>ВЫБЕРИТЕ ПЛАНЕТУ ДЛЯ ВЫСАДКИ</p>
            </div>
          </div>

          <div class="themes-list">
            <div
                v-for="planet in activeGalaxy.planets"
                :key="planet.id"
                class="theme-item"
                @click="startLevel(planet.id)"
            >
              <div class="planet-mini" :class="planet.colorClass"></div>
              <div class="theme-info">
                <span class="theme-name">{{ planet.theme }}</span>
                <span class="theme-desc">{{ planet.desc }}</span>
              </div>
              <button class="btn-go">ПОЛЕТЕЛИ!</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import ConstellationOne from '../../assets/images/constellation/constellation-1.svg'
import ConstellationTwo from '../../assets/images/constellation/constellation-2.svg'
import ConstellationThree from '../../assets/images/constellation/constellation-3.svg'
import ConstellationFour from '../../assets/images/constellation/constellation-4.svg'
import ConstellationFive from '../../assets/images/constellation/constellation-5.svg'
import ConstellationSix from '../../assets/images/constellation/constellation-6.svg'
import ConstellationSeven from '../../assets/images/constellation/constellation-7.svg'
import ConstellationEight from '../../assets/images/constellation/constellation-8.svg'

const emit = defineEmits(['back', 'select'])
const activeGalaxy = ref(null)

const galaxies = ref([
  {
    id: 'alpha', name: 'ОРИОН', svg: ConstellationOne, planets: [
      {id: 'p1', theme: 'ДОМ', desc: 'Мебель и уют', colorClass: 'blue'},
      {id: 'p2', theme: 'КУХНЯ', desc: 'Еда и посуда', colorClass: 'orange'}
    ]
  },
  {
    id: 'beta', name: 'ЛЕБЕДЬ', svg: ConstellationTwo, planets: [
      {id: 'p3', theme: 'ГОРОД', desc: 'Здания и улицы', colorClass: 'green'},
      {id: 'p4', theme: 'МАШИНЫ', desc: 'Транспорт', colorClass: 'red'}
    ]
  },
  {
    id: 'gamma',
    name: 'АНДРОМЕДА',
    svg: ConstellationThree,
    planets: [{id: 'p5', theme: 'ПРИРОДА', desc: 'Лес и животные', colorClass: 'green'}]
  },
  {
    id: 'delta',
    name: 'ЛИРА',
    svg: ConstellationFour,
    planets: [{id: 'p6', theme: 'РАБОТА', desc: 'Профессии', colorClass: 'grey'}]
  },
  {
    id: 'epsilon',
    name: 'ЦЕНТАВРА',
    svg: ConstellationFive,
    planets: [{id: 'p7', theme: 'ТЕЛО', desc: 'Здоровье', colorClass: 'pink'}]
  },
  {
    id: 'zeta',
    name: 'КАССИОПЕЯ',
    svg: ConstellationSix,
    planets: [{id: 'p8', theme: 'ХОББИ', desc: 'Спорт и игры', colorClass: 'yellow'}]
  },
  {
    id: 'eta',
    name: 'ПЕГАС',
    svg: ConstellationSeven,
    planets: [{id: 'p9', theme: 'ВРЕМЯ', desc: 'Дни и месяцы', colorClass: 'blue'}]
  },
  {
    id: 'theta',
    name: 'ДРАКОН',
    svg: ConstellationEight,
    planets: [{id: 'p10', theme: 'МАГИЯ', desc: 'Исключения', colorClass: 'purple'}]
  }
])

const openGalaxy = (galaxy) => {
  activeGalaxy.value = galaxy
}
const startLevel = (planetId) => {
  emit('select', planetId)
}
</script>

<style scoped>
.toon-navigation {
  position: fixed;
  inset: 0;
  background: #12122b;
  overflow: hidden;
  font-family: 'Arial Rounded MT Bold', 'Comic Sans MS', sans-serif;
  z-index: 5000;
}

/* --- МУЛЬТЯШНЫЙ КОСМОС --- */
.toon-space-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.nebula-purple {
  position: absolute;
  top: -10%;
  left: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, #6200ea33, transparent);
  filter: blur(60px);
}

.nebula-blue {
  position: absolute;
  bottom: -10%;
  right: -10%;
  width: 50%;
  height: 50%;
  background: radial-gradient(circle, #00b0ff33, transparent);
  filter: blur(60px);
}

.star-pop {
  position: absolute;
  font-size: 1.5rem;
  animation: starFloat 3s infinite ease-in-out;
}

@keyframes starFloat {
  0%, 100% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.3) translateY(-10px);
  }
}

/* Позиции звезд (рандомно) */
.star-1 {
  top: 10%;
  left: 15%;
}

.star-2 {
  top: 20%;
  left: 80%;
}

.star-3 {
  top: 70%;
  left: 10%;
}

/* --- HUD --- */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
}

.main-title-toon {
  color: #fff;
  font-size: 2.5rem;
  -webkit-text-stroke: 2px #000;
  text-shadow: 4px 4px 0px #ff9800;
}

.btn-exit-toon {
  background: #ff5252;
  border: 4px solid #000;
  border-radius: 15px;
  color: #fff;
  font-weight: 900;
  padding: 10px 20px;
  cursor: pointer;
  box-shadow: 4px 4px 0 #000;
}

/* --- КАРТА ГАЛАКТИК --- */
.constellations-map {
  position: relative;
  height: 70vh;
  width: 100%;
}

.galaxy-anchor {
  position: absolute;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.galaxy-anchor:hover {
  transform: scale(1.2);
}

.galaxy-anchor:hover .click-me {
  opacity: 1;
}

.galaxy-icon-wrapper {
  position: relative;
}

.galaxy-svg-toon {
  width: 120px;
  height: 120px;
  filter: drop-shadow(0 0 10px #00d2ff);
}

.click-me {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffeb3b;
  border: 2px solid #000;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  color: #000;
  font-weight: 900;
  opacity: 0;
  transition: 0.2s;
}

.galaxy-label-toon {
  color: #fff;
  font-size: 1.2rem;
  -webkit-text-stroke: 1px #000;
  margin-top: 10px;
  text-shadow: 2px 2px 0 #00d2ff;
}

/* Позиции галактик на карте */
.pos-1 {
  top: 10%;
  left: 20%;
}

.pos-2 {
  top: 15%;
  left: 50%;
}

.pos-3 {
  top: 10%;
  left: 80%;
}

.pos-4 {
  top: 45%;
  left: 15%;
}

.pos-5 {
  top: 40%;
  left: 45%;
}

.pos-6 {
  top: 45%;
  left: 75%;
}

.pos-7 {
  top: 75%;
  left: 30%;
}

.pos-8 {
  top: 75%;
  left: 60%;
}

/* --- МУЛЬТЯШНОЕ ОКНО --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 6000;
  backdrop-filter: blur(5px);
}

.toon-window {
  background: #fff;
  border: 8px solid #000;
  border-radius: 40px;
  width: 90%;
  max-width: 500px;
  padding: 40px;
  position: relative;
  box-shadow: 15px 15px 0px #00d2ff;
}

.close-window {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  font-weight: 900;
}

.window-header {
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 4px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.window-icon {
  width: 80px;
  filter: drop-shadow(0 0 5px #00d2ff);
}

.header-text h2 {
  margin: 0;
  font-size: 1.8rem;
  color: #000;
}

.header-text p {
  margin: 5px 0 0;
  color: #666;
  font-weight: bold;
}

.themes-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.theme-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #f8f9fa;
  border: 4px solid #000;
  padding: 15px;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.2s;
}

.theme-item:hover {
  transform: translateX(10px);
  background: #e3f2fd;
}

.planet-mini {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #000;
}

.blue {
  background: #42a5f5;
}

.orange {
  background: #ffa726;
}

.green {
  background: #66bb6a;
}

.pink {
  background: #ec407a;
}

.theme-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.theme-name {
  font-size: 1.2rem;
  font-weight: 900;
  color: #000;
}

.theme-desc {
  font-size: 0.8rem;
  color: #777;
}

.btn-go {
  background: #ffeb3b;
  border: 3px solid #000;
  border-radius: 10px;
  font-weight: 900;
  padding: 5px 10px;
  box-shadow: 2px 2px 0 #000;
}

.pop-window-enter-active {
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-window-leave-active {
  animation: popIn 0.3s reverse ease-in;
}

@keyframes popIn {
  0% {
    transform: scale(0.5) rotate(5deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}
</style>