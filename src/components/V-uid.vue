<template>
  <div class="uid__container">
    <template v-if="!isMobile">
      <div class="ui__statistics">
        <VStatistics/>
      </div>
      <div class="stats__wrapper">
        <Vdaily/>
      </div>
      <div>
        <VPoints/>
        <VAchievements/>
      </div>
    </template>
    <template v-else>
      <nav class="mobile-nav" role="tablist" aria-label="Статистика и прогресс">
        <button
            v-for="tab in tabs"
            :key="tab.id"
            class="mobile-nav__btn"
            :class="{ 'mobile-nav__btn--active': activeTabId === tab.id }"
            role="tab"
            @click="setTab(tab.id)"
        >
          <img class="tab__icon" :src="tab.icon" :alt="tab.alt">
          <div class="tab__label">{{ tab.label }}</div>
        </button>
      </nav>
      <div class="mobile-panel" role="tabpanel">
        <Transition name="fade-slide" mode="out-in">
          <div class="mobile-content" :key="currentTab.id">
            <component :is="currentComponent"/>
          </div>
        </Transition>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

import VPoints from "~/src/components/V-points.vue";
import VStatistics from "~/src/components/V-statistics.vue";
import Vdaily from "~/src/components/Vdaily.vue";
import VAchievements from "~/src/components/V-achievements.vue";
import AchIcon from '../../assets/images/achNav.svg'
import Stats from '../../assets/images/stats.svg'
import Daily from '../../assets/images/daily.svg'

const tabs = [
  { id: 'profile', icon: AchIcon, alt: 'ach icon', label: 'Панель ученика', component: VPoints },
  { id: 'daily', icon: Daily, alt: 'daily icon', label: 'Ежедневки', component: Vdaily },
  { id: 'achievements', icon: AchIcon, alt: 'achIcon', label: 'Достижения', component: VAchievements },
  { id: 'points', icon: Stats, alt: 'stats icon', label: 'Статистика', component: VStatistics },
]

const activeTabId = ref(tabs[0].id)
const currentTab = computed(() => tabs.find(t => t.id === activeTabId.value) || tabs[0])
const currentComponent = computed(() => currentTab.value.component)
function setTab(id) { activeTabId.value = id }

const isMobile = ref(false)
let mql
function updateIsMobile(e) { isMobile.value = e.matches }

onMounted(() => {
  mql = window.matchMedia('(max-width: 767px)')
  isMobile.value = mql.matches
  if (mql.addEventListener) mql.addEventListener('change', updateIsMobile)
  else mql.addListener(updateIsMobile)
})

onBeforeUnmount(() => {
  if (!mql) return
  if (mql.removeEventListener) mql.removeEventListener('change', updateIsMobile)
  else mql.removeListener(updateIsMobile)
})
</script>

<style scoped>
.tab__icon {
  width: 50px;
  margin-right: 5px;
}
.tab__label {
  color: var(--titleColor);
}
.uid__container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
}
.ui__statistics {
  flex-grow: 1;
}
.stats__wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 15px;
}

@media(max-width: 660px) {
  .tab__label {
    display: none;
  }
}

@media (max-width: 767px) {
  .uid__container {
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
    height: calc(100dvh - 180px);
    overflow-y: auto;
  }
  .mobile-nav {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 4px;
  }
  .mobile-nav__btn {
    border: none;
    background: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25%;
    font-size: 16px;
    cursor: pointer;
    transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.12s ease;
  }
  .mobile-nav__btn:active {
    transform: translateY(1px);
  }
  .mobile-nav__btn--active {
    background: #eeeaea;
    border: 3px solid black;
    box-shadow: 3px 3px 0 black;
    border-radius: 10px;
  }
  .mobile-panel {
    flex: 1;
    min-height: 0;
    display: flex;
    overflow: hidden;
  }
  .mobile-content {
    flex: 1;
    min-height: 0;
    display: flex;
    width: 100%;
    overflow: auto;
    padding: 4px;
  }
  .mobile-content > * {
    flex: 1;
    width: 100%;
    display: block;
  }
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-slide-enter-active {
  transition: opacity 180ms ease, transform 180ms ease;
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.fade-slide-leave-active {
  transition: opacity 140ms ease, transform 140ms ease;
}
</style>
