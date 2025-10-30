<template>
  <div class="uid__container">
    <template v-if="!isMobile">
      <div>
        <VLands/>
      </div>
      <div class="stats__wrapper">
        <VPoints/>
        <VDaily/>
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
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import VPoints from "~/src/components/V-points.vue";
import VDaily from "~/src/components/Vdaily.vue";
import VLands from "~/src/components/V-lands.vue";
import Location from '../../assets/images/location.svg'
import Daily from '../../assets/images/daily.svg'
import Card from '../../assets/images/card.svg'
const { t } = useI18n();
const tabs = [
  {id: 'locations', icon: Location, alt: 'achIcon', label: t('tabsMobile.locations'), component: VLands},
  {id: 'daily', icon: Daily, alt: 'daily icon', label: t('tabsMobile.daily'), component: VDaily},
  {id: 'profile', icon: Card, alt: 'ach icon', label: t('tabsMobile.profile'), component: VPoints},
]

const activeTabId = ref(tabs[0].id)
const currentTab = computed(() => tabs.find(t => t.id === activeTabId.value) || tabs[0])
const currentComponent = computed(() => currentTab.value.component)

function setTab(id) {
  activeTabId.value = id
}

const isMobile = ref(false)
let mql

function updateIsMobile(e) {
  isMobile.value = e.matches
}

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
  height: 100dvh;
  min-height: 0;
  align-items: stretch;
  gap: 10px;
}

.stats__wrapper {
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 5px;
  min-height: 0;
  max-height: 100vh;
  overflow: auto;
}

.stats__wrapper > * {
  flex: 0 0 auto;
}

.stats__wrapper::-webkit-scrollbar {
  width: 6px;
}

.stats__wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.stats__wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

@media (max-width: 660px) {
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
    margin-top: 5px;
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
