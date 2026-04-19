<template>
  <div class="theme-page">
    <div class="page-header">
      <VBackBtnNav />
<!--      <h1 class="page-title">{{ t('chooseTheme.choose') }}</h1>-->
      <h1 class="page-title">Тематические уровни</h1>
    </div>
    <transition name="toast-fade">
      <div v-if="showChalkMessage" class="toast-message">
        {{ chalkMessage }}
      </div>
    </transition>

    <div class="themes-scroll">
      <div class="themes-container">
        <button
            v-for="theme in themes"
            :key="theme.key"
            class="theme-card"
            :class="{ 'active': theme.key === selectedTopic }"
            @click="selectedTopic = theme.key"
        >
          <div class="theme-icon-wrapper">
            <img :src="theme.img" :alt="t(theme.name)" class="theme-icon" />
          </div>
          <span class="theme-name">{{ t(theme.name) }}</span>
        </button>
      </div>
    </div>

    <div v-if="jsonData" class="content-area">
      <div class="level-tabs">
        <button
            v-for="level in jsonData.levels"
            :key="level.level"
            class="level-tab"
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
            class="module-card"
            :class="{
              'locked': !isModuleUnlocked(selectedLevelObj.level, mod.id),
              'selected': moduleToStart && mod.id === moduleToStart.id
            }"
            @click="handleModuleClick(mod)"
        >
          <div class="module-title">{{ t('chooseTheme.module') }}</div>
          <div class="module-number">{{ mod.id }}</div>
          <div class="module-status-icon" v-if="!isModuleUnlocked(selectedLevelObj.level, mod.id)">
            🔒
          </div>
          <div class="module-status-icon" v-else-if="moduleToStart && mod.id === moduleToStart.id">
            ✨
          </div>
        </button>
      </div>
    </div>

    <transition name="slide-up">
      <div class="bottom-action" v-if="moduleToStart">
        <button class="btn-start" @click="startSelectedModule">
          {{ t('chooseTheme.btnStart') }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {useTrainerStore} from '../../store/themenProgressStore.js'
import {useRouter} from 'vue-router'
import {ref, onMounted, computed, watch} from 'vue'
import HomeImg from '../../assets/images/house.svg'
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
import { useHead, useSeoMeta } from '#imports'
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";

const {t} = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow'
})

const router = useRouter()
const trainer = useTrainerStore()
const themes = [
  {key: 'house', name: 'chooseThemeList.home', img: HomeImg},
  {key: 'zeit', name: 'chooseThemeList.time', img: Clock},
  {key: 'family', name: 'chooseThemeList.family', img: Family},
  {key: 'food', name: 'chooseThemeList.food', img: Food},
  {key: 'purchases', name: 'chooseThemeList.purchases', img: Purchase},
  {key: 'health', name: 'chooseThemeList.health', img: Health},
  {key: 'weather', name: 'chooseThemeList.weather', img: Weather},
  {key: 'clothes', name: 'chooseThemeList.clothes', img: Clothes},
  {key: 'transport', name: 'chooseThemeList.transport', img: Transport},
  {key: 'school', name: 'chooseThemeList.school', img: School},
  {key: 'travel', name: 'chooseThemeList.travel', img: Travel}
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

<style scoped>
.theme-page {
  font-family: "Nunito", sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 10px 10px;
  flex-shrink: 0;
  z-index: 10;
}

.page-title {
  font-size: 22px;
  font-weight: 900;
  color: var(--titleColor);
  letter-spacing: 0.5px;
  margin: 0 0 0 12px;
}

.themes-scroll {
  width: 100%;
  overflow-x: auto;
  padding: 10px 0 20px 0;
  scrollbar-width: none;
}

.themes-scroll::-webkit-scrollbar {
  display: none;
}

.themes-container {
  display: flex;
  gap: 12px;
  padding: 0 20px;
  width: max-content;
}

.theme-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 95px;
  height: 95px;
  background: #ffffff;
  border: 3px solid #1e1e1e;
  border-radius: 18px;
  box-shadow: 0 4px 0 #1e1e1e;
  cursor: pointer;
  padding: 10px;
}

.theme-card.active {
  background: #fef08a;
  border-color: #1e1e1e;
}

.theme-icon-wrapper {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.theme-name {
  font-size: 0.85rem;
  font-weight: 800;
  color: #1e1e1e;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 14px;
  overflow-y: auto;
  padding-bottom: calc(env(safe-area-inset-bottom) + 120px);
  scrollbar-width: none;
}

.content-area::-webkit-scrollbar {
  display: none;
}

.level-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 5px;
  scrollbar-width: none;
}

.level-tabs::-webkit-scrollbar {
  display: none;
}

.level-tab {
  flex-shrink: 0;
  padding: 10px;
  background: #f3f4f6;
  color: #4b5563;
  font-family: "Nunito", sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.1s;
  width: 32%;
  white-space: nowrap;
}

.level-tab.active {
  background: #6063c2;
  color: #ffffff;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.module-card {
  position: relative;
  background: #ffffff;
  border: 3px solid #1e1e1e;
  border-radius: 18px;
  padding: 20px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 0 #1e1e1e;
  transition: all 0.1s;
  cursor: pointer;
}

.module-card.selected {
  background: #bfdbfe;
  border-color: #1e1e1e;
}

.module-card.locked {
  background: #f9fafb;
  border-color: #d1d5db;
  box-shadow: 0 4px 0 #d1d5db;
  cursor: not-allowed;
}

.module-title {
  font-size: 1rem;
  font-weight: 800;
  color: #4b5563;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.locked .module-title,
.locked .module-number {
  color: #9ca3af;
}

.selected .module-title {
  color: #1e3a8a;
}

.module-number {
  font-size: 2rem;
  font-weight: 900;
  color: #1e1e1e;
}

.selected .module-number {
  color: #1e3a8a;
}

.module-status-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.2rem;
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 20px calc(env(safe-area-inset-bottom) + 20px);
  background: linear-gradient(to top, var(--bg, #fcfcfc) 80%, transparent);
  z-index: 20;
}

.btn-start {
  width: 100%;
  padding: 16px;
  background: #4ade80;
  border: 3px solid #1e1e1e;
  border-radius: 18px;
  color: #1e1e1e;
  font-family: "Nunito", sans-serif;
  font-size: 1.4rem;
  font-weight: 900;
  text-transform: uppercase;
  box-shadow: 0 5px 0 #1e1e1e;
  cursor: pointer;
  transition: all 0.1s;
}

.toast-message {
  position: fixed;
  top: calc(env(safe-area-inset-top) + 80px);
  left: 50%;
  transform: translateX(-50%);
  background: #ef4444;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 14px;
  border: 3px solid #1e1e1e;
  font-weight: 800;
  font-size: 1.1rem;
  z-index: 100;
  box-shadow: 0 4px 0 #1e1e1e;
  text-align: center;
  width: max-content;
  max-width: 90%;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>