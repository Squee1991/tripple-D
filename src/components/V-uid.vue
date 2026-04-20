<template>
  <div class="uid__container">
    <template v-if="!isMobile">
      <div class="lands__container">
        <VLands/>
      </div>
      <div class="stats__wrapper">
        <VPoints/>
        <VDaily/>
      </div>
    </template>
    <template v-else>
      <nav class="mobile-nav" role="tablist" aria-label="Статистика и прогресс">
        <div class="sliding-bg" :style="{ transform: `translateX(${activeIndex * 100}%)` }"></div>
        <button
            v-for="(tab, index) in tabs"
            :key="tab.id"
            class="mobile-nav__btn"
            :class="{ 'mobile-nav__btn--active': activeTabId === tab.id }"
            role="tab"
            @click="setTab(tab.id)"
        >
          <img class="tab__icon" :src="tab.icon" :alt="tab.alt">
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

const {t} = useI18n();
const tabs = [
  {id: 'locations', icon: Location, alt: 'achIcon', label: t('tabsMobile.locations'), component: VLands},
  {id: 'daily', icon: Daily, alt: 'daily icon', label: t('tabsMobile.daily'), component: VDaily},
  {id: 'profile', icon: Card, alt: 'ach icon', label: t('tabsMobile.profile'), component: VPoints},
]

const activeTabId = ref(tabs[0].id)
const currentTab = computed(() => tabs.find(tab => tab.id === activeTabId.value) || tabs[0])
const currentComponent = computed(() => currentTab.value.component)

const activeIndex = computed(() => tabs.findIndex(tab => tab.id === activeTabId.value))

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

* {
  box-sizing: border-box;
}

.tab__icon {
  width: 35px;
  height: 35px;
  object-fit: contain;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.uid__container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100dvh;
  min-height: 0;
  align-items: stretch;
  gap: 6px;
}

.lands-container {
  flex: 1;
  min-width: 0;
  display: flex;
}

.lands-container > :deep(.map__wrapper) {
  width: 100%;
  flex: 1;
}

.stats__wrapper {
  max-width: 400px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 5px;
  min-height: 0;
  max-height: 100vh;
  overflow: auto;
  scrollbar-width: none;
}

.lands__container {
  height: 100vh;
}

@media (max-width: 1023px) {
  .uid__container {
    padding: 0 5px;
  }
}

@media (max-width: 767px) {
  .uid__container {
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
    height: 100%;
    flex: 1;
    max-height: calc(100dvh - 100px);
    overflow: hidden;
  }

  .mobile-nav {
    display: flex;
    position: relative;
    justify-content: space-between;
    background: var(--tabBg);
    border-radius: 40px;
    padding: 6px;
    border: 3px solid #2a2a2a;
    box-shadow: var(--boxShadowMobile);
    margin: 0 4px;
    z-index: 1;
    flex-shrink: 0;
  }

  .sliding-bg {
    position: absolute;
    top: 6px;
    bottom: 6px;
    left: 6px;
    width: calc(33.33% - 4px);
    background: var(--tabsSlideBg);
    box-shadow: var(--tabSlideBoxShadow);
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
    padding: 8px 0;
    cursor: pointer;
    position: relative;
    z-index: 2;
    -webkit-tap-highlight-color: transparent;
  }

  .mobile-nav__btn--active .tab__icon {
    transform: scale(1.07);
  }

  .mobile-panel {
    flex: 1;
    min-height: 0;
    display: flex;
    position: relative;
    overflow: hidden;
  }

  .mobile-content {
    flex: 1;
    min-height: 0;
    display: block;
    width: 100%;
    overflow-y: auto;
    padding: 8px;
    padding-bottom: 100px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .mobile-content::-webkit-scrollbar {
    display: none;
  }

  .mobile-content > * {
    width: 100%;
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