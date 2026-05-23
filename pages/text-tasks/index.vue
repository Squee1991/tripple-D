<template>
  <div class="tasks-menu-page">
    <div class="page-container">
      <div class="header-wrapper">
        <button class="btn-icon-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="page-title">
          {{ selectedTheme ? selectedTheme.title : t('sub.textTask') }}
        </div>
        <button class="quiz__btn quiz__btn--info" @click="showDevModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
               stroke="orange" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </div>
      <VTransition>
        <div class="content__wrapper" v-if="isMounted">
          <VBanner
              :text="t('bannerTitles.textTask')"
              :icon="TextBooks"
          />
          <nav class="mobile-nav" role="tablist" v-if="!selectedTheme">
            <div class="sliding-bg" :style="{ transform: `translateX(${activeIndex * 100}%)` }"></div>
            <button
                v-for="level in levels"
                :key="level.id"
                class="mobile-nav__btn"
                :class="{ 'mobile-nav__btn--active': currentLevel === level.id }"
                role="tab"
                @click="currentLevel = level.id"
            >
              <span class="tab-label">{{ level.label }}</span>
            </button>
          </nav>
          <div class="content-area" v-if="!selectedTheme">
            <div class="themes-list">
              <div
                  v-for="theme in displayedThemes"
                  :key="theme.id"
                  class="theme-card"
                  @click="selectTheme(theme)"
              >
                <div class="theme-card-top">
                  <div class="theme-icon-box">{{ theme.icon }}</div>
                  <div class="theme-info">
                    <div class="theme-name">{{ theme.title }}</div>
                  </div>
                  <VArrowNav/>
                </div>
                <div class="theme-card-bottom">
                  <div class="progress-track">
                    <div class="progress-fill" :style="{ width: `${getStats(theme.id).total > 0 ? (getStats(theme.id).completed / getStats(theme.id).total) * 100 : 0}%` }"></div>
                  </div>
                  <span class="progress-text">{{ getStats(theme.id).completed }}/{{ getStats(theme.id).total }}</span>
                </div>
              </div>
              <div v-if="displayedThemes.length === 0" class="empty-state">
                В этом разделе пока нет тем
              </div>
            </div>
          </div>
          <VTransition>
            <div class="content-area" v-if="themeData && !isLoading">
              <div class="tasks-list">
                <div
                    v-for="(task, index) in themeData.tasks"
                    :key="task.id"
                    class="task-card"
                    @click="startTask(task, index)"
                >
                  <div v-if="task.icon" class="task-number">{{ task.icon }}</div>
                  <div class="task-info">
                    <div class="task-translation">{{ t(task.translation) }}</div>
                  </div>
                  <VArrowNav/>
                </div>
              </div>
            </div>
          </VTransition>
        </div>
      </VTransition>
      <Modal
          @close="showDevModal = false"
          :visible="showDevModal"
          :title="overlayData.title"
          :img="TextBooks"
          :text="overlayData.text"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useTextTasksStore} from '../../store/textTasksStore.js'
import VBanner from "~/src/components/V-banner.vue"
import TextBooks from "../../assets/images/TextBook.svg"
import VTransition from "~/src/components/V-transition.vue"
import VArrowNav from "~/src/components/V-arrowNav.vue"
import HeadPhones from "assets/images/headphones.svg"
import Modal from "~/src/components/modal.vue"

const showDevModal = ref(false)
const router = useRouter()
const store = useTextTasksStore()
const isMounted = ref(false)
const { t } = useI18n()

const levels = [
  {id: 'low-level', label: 'A1'},
  {id: 'middle-level', label: 'A2'},
  {id: 'high-level', label: 'B1'}
]

const currentLevel = ref('low-level')
const selectedTheme = ref(null)
const themeData = ref(null)
const isLoading = ref(false)
const themesStats = ref({})

const activeIndex = computed(() => levels.findIndex(level => level.id === currentLevel.value))

const overlayData = {
  title: t('textTasksTip.title'),
  text: t('textTasksTip.description'),
}

const allThemesMeta = {
  basic: {id: 'basic', file: 'basic.json', title: t('textThemes.basic'), icon: '👋'},
  routine: {id: 'routine', file: 'routine.json', title: t('textThemes.routine'), icon: '⏰'},
  shopping: {id: 'shopping', file: 'shopping.json', title: t('textThemes.shopping'), icon: '🛒'},
  work: {id: 'work', file: 'work.json', title: t('textThemes.work'), icon: '💼'},
  hobby: {id: 'hobby', file: 'hobby.json', title: t('textThemes.hobby'), icon: '🎨'},
  objects: {id: 'objects', file: 'objects.json', title: t('textThemes.objects'), icon: '🎒'},
  travel: {id: 'travel', file: 'travel.json', title: t('textThemes.travel'), icon: '✈️'},
}

const themesByLevel = {
  'low-level': ['basic', 'hobby', 'work', 'routine', 'shopping', 'travel'],
  'middle-level': ['basic', 'hobby', 'work', 'routine', 'shopping', 'travel'],
  'high-level': ['basic', 'hobby', 'work', 'routine', 'shopping', 'travel']
}

const displayedThemes = computed(() => {
  const activeLevelThemes = themesByLevel[currentLevel.value] || []
  return activeLevelThemes.map(themeKey => allThemesMeta[themeKey])
})

const getStats = (themeId) => {
  const key = `${currentLevel.value}-${themeId}`
  return themesStats.value[key] || { total: 0, completed: 0 }
}

const loadLevelStats = async (level) => {
  const themes = themesByLevel[level] || []
  const fetchPromises = themes.map(async (themeId) => {
    const key = `${level}-${themeId}`
    if (!themesStats.value[key]) {
      try {
        const themeMeta = allThemesMeta[themeId]
        const res = await fetch(`/text-tasks/${level}/${themeMeta.file}`)
        if (res.ok) {
          const data = await res.json()
          themesStats.value[key] = {
            total: data.tasks ? data.tasks.length : 0,
            completed: 0
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  })
  await Promise.all(fetchPromises)
}

watch(currentLevel, (newLevel) => {
  loadLevelStats(newLevel)
})

const selectTheme = async (theme) => {
  selectedTheme.value = theme
  isLoading.value = true
  try {
    const res = await fetch(`/text-tasks/${currentLevel.value}/${theme.file}`)
    if (!res.ok) throw new Error('Network response was not ok')
    themeData.value = await res.json()
  } catch (e) {
    console.error(e)
    selectedTheme.value = null
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  if (selectedTheme.value) {
    selectedTheme.value = null
    themeData.value = null
  } else {
    router.push('/')
  }
}

const startTask = (task, index) => {
  store.initTask(task, themeData.value.tasks, index)
  router.push('/text-tasks/session')
}

onMounted(() => {
  setTimeout(() => {
    isMounted.value = true
  }, 120)
  loadLevelStats(currentLevel.value)
})
</script>

<style scoped>
.tasks-menu-page {
  font-family: "Nunito", sans-serif;
  height: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.page-container {
  width: 100%;
  max-width: 768px;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 5px 10px 15px 10px;
}

.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  flex-shrink: 0;
}

.content__wrapper {
  padding: 0 5px;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
}

.content__wrapper::-webkit-scrollbar {
  display: none;
}

.btn-icon-back,
.quiz__btn {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back,
.quiz__btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.page-title {
  font-size: 23px;
  font-weight: 800;
  text-shadow: 1px 1px var(--title);
  color: var(--title);
  margin-left: 15px;
}

.mobile-nav {
  display: flex;
  position: relative;
  justify-content: space-between;
  background: var(--tabBg, var(--menuItemsBg));
  border-radius: 40px;
  padding: 6px;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile, 0 4px 0 var(--tabsSlideBorderColor));
  margin: 0 0 5px 0;
  z-index: 1;
  flex-shrink: 0;
}

.sliding-bg {
  position: absolute;
  top: 5px;
  bottom: 6px;
  left: 6px;
  width: calc(33.333% - 4px);
  background: var(--tabsSlideBg);
  box-shadow: var(--tabSlideBoxShadow, 0 2px 0 rgba(0,0,0,0.1));
  border-radius: 30px;
  transition: transform 0.4s cubic-bezier(0.34, 1.35, 0.64, 1);
  z-index: 1;
}

.mobile-nav__btn {
  border: none;
  background: none;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  position: relative;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;
}

.tab-label {
  font-size: 16px;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
  color: var(--titleColor);
  transition: transform 0.2s;
}

.content-area {
  padding: 15px 0;
}

.category-title {
  font-size: 18px;
  font-weight: 800;
  color: #718096;
  margin-bottom: 15px;
}

.themes-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.theme-card {
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  cursor: pointer;
  transition: transform 0.1s;
}

.theme-card:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 #e2e8f0;
}

.theme-card-top {
  display: flex;
  align-items: center;
  gap: 15px;
}

.theme-icon-box {
  font-size: 30px;
}

.theme-info {
  flex-grow: 1;
}

.theme-name {
  font-weight: 800;
  color: var(--titleColor);
  font-size: 17px;
}

.theme-card-bottom {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-track {
  flex-grow: 1;
  height: 8px;
  background: var(--tabsSlideBorderColor, #2d3748);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #5c6bc0;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 800;
  color: var(--titleColor);
  min-width: 35px;
  text-align: right;
}

.theme-arrow {
  color: #a0aec0;
  display: flex;
  align-items: center;
}

.empty-state {
  text-align: center;
  color: #a0aec0;
  font-weight: 700;
  padding: 20px;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.task-card {
  border-radius: 16px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  cursor: pointer;
  transition: transform 0.1s;
}

.task-card:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 #e2e8f0;
}

.task-number {
  font-size: 30px;
}

.task-info {
  flex-grow: 1;
  margin-left: 10px;
}

.task-translation {
  font-weight: 600;
  color: var(--titleColor);
  font-size: 15px;
}

.play-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #4facfe;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 3px 0 #0088ff;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
  color: #a0aec0;
  font-weight: 800;
  font-size: 16px;
  gap: 15px;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4facfe;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>