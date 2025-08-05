<script setup>
import {useTrainerStore} from '../../store/themenProgressStore.js'
import {useRouter} from 'vue-router'
import {ref, onMounted, computed, watch} from 'vue'
import HomeImg from '../../assets/images/home.svg'
import Clothes from '../../assets/images/clothes.svg'
import Health from '../../assets/images/health.svg'
import Food from '../../assets/images/food.svg'
import Transport from '../../assets/images/Transport.svg'
import Weather from '../../assets/images/weather.svg'
import Purchase from '../../assets/images/buy.svg'
import Family from '../../assets/images/family.svg'
import School from '../../assets/images/school.svg'
import Travel from '../../assets/images/travel.svg'
import Clock from '../../assets/images/clock.svg'

const router = useRouter()
const trainer = useTrainerStore()
const themes = [
  {key: 'house', name: 'chooseThemeList.home', img: HomeImg, position: {top: '5%', left: '10%', rotate: '-5deg'}},
  {key: 'zeit', name: 'chooseThemeList.time', img: Clock, position: {top: '25%', left: '55%', rotate: '4deg'}},
  {key: 'family', name: 'chooseThemeList.family', img: Family, position: {top: '2%', left: '60%', rotate: '8deg'}},
  {key: 'food', name: 'chooseThemeList.food', img: Food, position: {top: '45%', left: '13%', rotate: '-3deg'}},
  {
    key: 'purchases',
    name: 'chooseThemeList.purchases',
    img: Purchase,
    position: {top: '30%', left: '35%', rotate: '-6deg'}
  },
  {key: 'health', name: 'chooseThemeList.health', img: Health, position: {top: '20%', left: '2%', rotate: '7deg'}},
  {key: 'weather', name: 'chooseThemeList.weather', img: Weather, position: {top: '70%', left: '55%', rotate: '-5deg'}},
  {key: 'clothes', name: 'chooseThemeList.clothes', img: Clothes, position: {top: '48%', left: '65%', rotate: '-3deg'}},
  {
    key: 'transport',
    name: 'chooseThemeList.transport',
    img: Transport,
    position: {top: '55%', left: '30%', rotate: '4deg'}
  },
  {key: 'school', name: 'chooseThemeList.school', img: School, position: {top: '68%', left: '5%', rotate: '-8deg'}},
  {key: 'travel', name: 'chooseThemeList.travel', img: Travel, position: {top: '2%', left: '30%', rotate: '3deg'}}
]

const selectedTopic = ref(themes[0].key)
const jsonData = ref(null)
const loading = ref(true)
const selectedLevel = ref(1)
const topic = computed(() => selectedTopic.value)
const chalkMessage = ref('')
const showChalkMessage = ref(false)
let messageTimeout = null
const moduleToStart = ref(null)
const {t} = useI18n()
const triggerChalkMessage = (text) => {
  clearTimeout(messageTimeout)
  chalkMessage.value = text
  showChalkMessage.value = true
  messageTimeout = setTimeout(() => {
    showChalkMessage.value = false
  }, 2000)
}

const selectedLevelObj = computed(() => {
  if (!jsonData.value || !jsonData.value.levels) return null
  return jsonData.value.levels.find(l => l.level === Number(selectedLevel.value))
})

const isModuleCompleted = (level, id) => {
  return trainer.completedModules.some(m => m.level === level && m.id === id)
}

const isModuleUnlocked = (level, moduleId) => {
  if (moduleId === 1) return true
  return isModuleCompleted(level, moduleId - 1)
}

const isLevelCompleted = (levelNumber) => {
  const level = jsonData.value?.levels.find(l => l.level === levelNumber)
  if (!level) return false
  return level.modules.every(mod =>
      isModuleCompleted(levelNumber, mod.id)
  )
}

const selectLevel = (levelNumber) => {
  if (levelNumber > 1 && !isLevelCompleted(levelNumber - 1)) {
    triggerChalkMessage(`${t('chooseTheme.notAllowedLevel')} ${levelNumber - 1}!`)
  } else {
    selectedLevel.value = levelNumber
    moduleToStart.value = null
  }
}

const handleModuleClick = (module) => {
  if (isModuleUnlocked(selectedLevel.value, module.id)) {
    moduleToStart.value = module
  } else {
    triggerChalkMessage(t('chooseTheme.notAllowedModule'))
  }
}

const goBack = () => {
  router.back()
}

const goToExercise = async (level, module) => {
  await trainer.setThemeAndModule(topic.value, level, module.id)
  router.push('/thematic-learning/thematic-session')
}

const startSelectedModule = () => {
  if (moduleToStart.value) {
    goToExercise(selectedLevel.value, moduleToStart.value)
  }
}

const loadThemeData = async () => {
  loading.value = true
  trainer.topic = topic.value
  await trainer.loadProgress()
  const res = await fetch(`/${topic.value}.json`)
  jsonData.value = await res.json()
  selectedLevel.value = 1
  moduleToStart.value = null
  loading.value = false
}

onMounted(loadThemeData)
watch(topic, loadThemeData)

</script>
<template>
  <div class="classroom-layout">
    <div class="blackboard-wrapper">
      <button class="back-card-button" @click="goBack">
        <div class="pin"></div>
        <span>{{ t('chooseTheme.btnBack') }}</span>
      </button>
      <div class="blackboard">
        <transition name="chalk-fade">
          <div v-if="showChalkMessage" class="chalk-message">
            {{ chalkMessage }}
          </div>
        </transition>
        <div v-if="jsonData" class="blackboard-content">
          <div class="level-selector">
            <button
                v-for="level in jsonData.levels"
                :key="level.level"
                class="level-btn"
                :class="{ 'active': selectedLevel === level.level }"
                @click="selectLevel(level.level)"
            >
              {{ t('chooseTheme.level') }} {{ level.level }}
            </button>
          </div>
          <div class="modules-grid" v-if="selectedLevelObj">
            <button
                v-for="mod in selectedLevelObj.modules"
                :key="mod.id"
                class="module-btn"
                :class="{
                        'locked': !isModuleUnlocked(selectedLevelObj.level, mod.id),
                        'selected': moduleToStart && mod.id === moduleToStart.id
                     }"
                @click="handleModuleClick(mod)"
            >
              {{ t('chooseTheme.module') }} {{ mod.id }}
            </button>
          </div>
          <div class="start-button-container" v-if="moduleToStart">
            <button class="start-button" @click="startSelectedModule">
              {{ t('chooseTheme.btnStart') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="corkboard">
      <h2 class="corkboard-title">{{ t('chooseTheme.choose') }}</h2>
      <div class="corkboard-themes">
        <button
            v-for="theme in themes"
            :key="theme.key"
            class="theme__card-choice"
            :class="{ active: theme.key === selectedTopic }"
            :style="{ top: theme.position.top, left: theme.position.left, transform: `rotate(${theme.position.rotate})` }"
            @click="selectedTopic = theme.key"
        >
          <div class="pin"></div>
          <img :src="theme.img" :alt="theme.name"/>
          <span>{{ t(theme.name) }}</span>
        </button>
      </div>
    </div>
  </div>

</template>

<style>
:root {
  --classroom-bg: #f0ebe5;
  --blackboard-bg: #2c3e50;
  --corkboard-bg: #d2b48c;
  --chalk-color: #ecf0f1;
  --chalk-yellow: #f1c40f;
}

.classroom-layout {
  display: flex;
  height: 100vh;
  padding: 2rem;
  gap: 2rem;
  background-color: #fef8e4;
  font-family: "Nunito", sans-serif;
  overflow: hidden;
  box-sizing: border-box;
}

.blackboard-wrapper {
  flex: 2;
  background: #60a5fa;
  padding: 20px;
  border-radius: 24px;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0px #1e1e1e;
  display: flex;
  position: relative;
}

.blackboard {
  flex: 1;
  background: #1e1e1e;
  border-radius: 12px;
  border: none;
  box-shadow: none;
  padding: 2.5rem 2rem;
  position: relative;
  display: flex;
  flex-direction: column;
}

.blackboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.back-card-button {
  position: absolute;
  top: 15px;
  left: -15px;
  z-index: 20;
  background: #fff;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 16px;
  transform: rotate(-5deg);
  transition: all 0.2s ease-in-out;
}

/*.back-card-button:hover {*/
/*    transform: rotate(0deg) scale(1.05);*/
/*}*/
.back-card-button .pin {
  display: none;
}

.back-card-button span {
  font-size: 1.2rem;
  color: #1e1e1e;
  font-weight: 400;
  font-family: 'Fredoka One', cursive;
}

.level-selector {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 16px;
}

.level-btn {
  color: #fff;
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  font-family: "Nunito", sans-serif;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.level-btn.active {
  background-color: #f1c40f;
  color: #1e1e1e;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 1rem;
}

.module-btn {
  color: #fff;
  background: transparent;
  border: 3px dashed #888;
  padding: 1rem 0.5rem;
  font-size: 1.1rem;
  font-family: "Nunito", sans-serif;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.module-btn:hover:not(.locked) {
  border-style: solid;
  border-color: #fff;
}

.module-btn.locked {
  color: #888;
  cursor: not-allowed;
  opacity: 0.6;
}

.module-btn.selected {
  border-style: solid;
  border-color: #f1c40f;
  background-color: rgba(241, 196, 15, 0.1);
}

.start-button-container {
  margin-top: auto;
  padding-top: 2rem;
  text-align: center;
}

.start-button {
  background: #4ade80;
  border: 3px solid #1e1e1e;
  color: #1e1e1e;
  padding: 0.8rem 2.5rem;
  font-size: 1.5rem;
  font-family: "Nunito", sans-serif;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  box-shadow: 4px 4px 0px #1e1e1e;
}

.start-button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.chalk-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-4deg);
  color: #f1c40f;
  font-family: 'Caveat', cursive;
  font-size: 2rem;
  z-index: 100;
  text-align: center;
}

.chalk-fade-enter-active, .chalk-fade-leave-active {
  transition: opacity 0.4s ease;
}

.chalk-fade-enter-from, .chalk-fade-leave-to {
  opacity: 0;
}

.corkboard {
  flex: 1;
  background: #ffffff;
  border-radius: 24px;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0px #1e1e1e;
  padding: 1.5rem;
  position: relative;
}

.corkboard-title {
  font-family: "Nunito", sans-serif;
  font-size: 2.5rem;
  text-align: center;
  color: #1e1e1e;
  margin-bottom: 1rem;
}

.corkboard-themes {
  position: relative;
  height: calc(100% - 60px);
}

.theme__card-choice {
  position: absolute;
  width: 120px;
  height: 120px;
  background: #fff;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: all 0.2s ease-in-out;
  border-radius: 20px;
}

.theme__card-choice:hover {
  transform: scale(1.1) !important;
  z-index: 10;
}

.theme__card-choice.active {
  box-shadow: 0 0 0 4px #1e1e1e, 0 0 0 8px #f1c40f;
  z-index: 5;
}

.theme__card-choice .pin {
  display: none;
}

.theme__card-choice img {
  width: 50px;
  height: 50px;
}

.theme__card-choice span {
  font-size: 1.1rem;
  color: #1e1e1e;
  font-weight: 400;
}

@media (max-width: 1023px) {
  .classroom-layout {
    padding: 0;
    position: relative;
  }

  .blackboard-wrapper {
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
    box-shadow: none;
    padding: 1rem;
    padding-bottom: 180px;
  }

  .blackboard {
    padding: 1rem;
  }

  .back-card-button {
    top: 10px;
    left: 10px;
    transform: rotate(0deg);
  }

  .corkboard {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 180px;
    width: auto;
    max-width: none;
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
    z-index: 100;
  }

  .corkboard-title {
    display: none;
  }

  .corkboard-themes {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    overflow-x: auto;
    padding: 0 1.5rem;
  }

  .corkboard-themes::-webkit-scrollbar {
    height: 8px;
  }

  .corkboard-themes::-webkit-scrollbar-thumb {
    background: #1e1e1e;
    border-radius: 4px;
  }

  .corkboard-themes::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  .theme__card-choice {
    position: static !important;
    transform: none !important;
    top: auto !important;
    left: auto !important;
    flex-shrink: 0;
    width: 130px;
    height: 130px;
  }
}

@media (max-width: 767px) {
  .blackboard-wrapper {
    padding: 25px 25px 150px 25px;
  }

  .start-button-container {
    padding: 0;
  }

  .level-selector {
    flex-wrap: wrap;
  }

  .blackboard-content {
    padding: 40px 10px;
  }

  .modules-grid {
    display: flex;
    flex-direction: column;
  }

  .module-btn {
    padding: .7rem;
  }

  .corkboard {
    height: 160px;
  }

  .theme__card-choice {
    width: 110px;
    height: 110px;
  }

  .theme__card-choice img {
    width: 40px;
    height: 40px;
  }

  .theme__card-choice span {
    font-size: 1rem;
  }

  .back-card-button {
    padding: 8px 16px;
    top: 13px;
    left: 50%;
    transform: translateX(-50%);
  }

  .back-card-button span {
    font-size: 1rem;
  }
}

@media (max-width: 1280px) {
  .scene-decoration--picture {
    display: none;
  }
}


</style>