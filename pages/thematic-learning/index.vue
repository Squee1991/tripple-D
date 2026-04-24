<template>
  <div class="theme-page">
    <div class="page-header">
      <VBackBtnNav />
      <h1 class="page-title">{{ t('sub.themen')}}</h1>
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
    <div class="content-area">
      <div class="level-tabs-wrapper">
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--titleColor)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div class="module-status-icon check-icon" v-else-if="moduleToStart && mod.id === moduleToStart.id">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
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
const jsonData = ref({
  levels: [
    { level: 1, modules: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }] },
    { level: 2, modules: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }] },
    { level: 3, modules: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }] }
  ]
})

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
/* ОБЩИЙ КОНТЕЙНЕР (Адаптивный фон) */
.theme-page {
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  background-color: var(--bg);
}


.page-header {
  display: flex;
  align-items: center;
  padding: max(5px, env(safe-area-inset-top)) 10px 12px;
  flex-shrink: 0;
  z-index: 10;
  background: var(--bg);
}

.page-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--titleColor);
  margin: 0 0 0 16px;
}

.themes-scroll {
  width: 100%;
  overflow-x: auto;
  padding: 8px 0 20px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.themes-scroll::-webkit-scrollbar {
  display: none;
}

.themes-container {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  width: max-content;
}

.theme-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 86px;
  height: 90px;
  background: var(--tabBg);
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 20px;
  cursor: pointer;
  padding: 10px;
  transition: all 0.2s ease;
}

.theme-card.active {
  background: rgba(99, 102, 241, 0.15);
  border: 2px solid #6366f1;
}

.theme-icon-wrapper {
  width: 38px;
  height: 38px;
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
  font-size: 13px;
  font-weight: 700;
  color: var(--titleColor);
  opacity: 0.8;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.theme-card.active .theme-name {
  color: var(--titleColor);
  opacity: 1;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  overflow-y: auto;
  padding-bottom: calc(env(safe-area-inset-bottom) + 140px);
  scrollbar-width: none;
}

.content-area::-webkit-scrollbar {
  display: none;
}

.level-tabs-wrapper {
  margin-bottom: 20px;
}

.level-tabs {
  display: flex;
  background: var(--settingsSectionBg);
  padding: 5px;
  border-radius: 18px;
  gap: 4px;
  width: 100%;
}

.level-tab {
  flex: 1;
  padding: 10px 4px;
  background: transparent;
  color: var(--titleColor);
  opacity: 0.6;
  font-family: "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 800;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.level-tab.active {
  background: var(--tabBg);
  color: var(--titleColor);
  opacity: 1;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.module-card {
  position: relative;
  background: var(--tabBg);
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
  cursor: pointer;
  min-height: 90px;
}

.module-card:active:not(.locked) {
  background: var(--settingsSectionBg);
}

.module-card.selected {
  background: rgba(59, 130, 246, 0.15);
  border-color: #3b82f6;
}

.module-card.locked {
  background: var(--settingsSectionBg);
  border-color: var(--tabsSlideBorderColor);
  opacity: 0.6;
  cursor: not-allowed;
}

.module-title {
  font-size: 12px;
  font-weight: 800;
  color: var(--titleColor);
  opacity: 0.7;
  text-transform: uppercase;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.selected .module-title {
  color: #3b82f6;
  opacity: 1;
}

.locked .module-title {
  opacity: 0.4;
}

.module-number {
  font-size: 32px;
  font-weight: 900;
  color: var(--titleColor);
  line-height: 1;
}

.selected .module-number {
  color: #3b82f6;
}

.locked .module-number {
  opacity: 0.4;
}

.module-status-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  width: 20px;
  height: 20px;
  color: #ffffff;
  background: #22c55e;
  border-radius: 50%;
  padding: 3px;
}

.bottom-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 16px calc(env(safe-area-inset-bottom) + 16px);
  background: linear-gradient(to top, var(--bg) 80%, transparent);
  z-index: 20;
}

.btn-start {
  width: 100%;
  padding: 16px;
  background: #22c55e;
  border: 2px solid #16a34a;
  border-bottom-width: 5px;
  border-radius: 18px;
  color: #ffffff;
  font-family: "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.btn-start:active {
  transform: translateY(3px);
  border-bottom-width: 2px;
  margin-bottom: 3px;
}

.toast-message {
  position: fixed;
  top: calc(env(safe-area-inset-top) + 80px);
  left: 50%;
  transform: translateX(-50%);
  background: #ef4444;
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 15px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
  text-align: center;
  width: max-content;
  max-width: 90%;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px) scale(0.9);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(150%);
  opacity: 0;
}
</style>