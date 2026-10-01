<template>
  <div class="uid__container">
    <ModalDev
        :visible="showDevModal"
        @close="closeDevModal"
        :title="modalConfig.title"
        :img="modalConfig.img"
        :text="modalConfig.text"
        :button="modalConfig.button"
        @button="onDevModalButton"
    />
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
        <div class="sliding-bg" :style="{ transform: `translateX(${getTransformX(activeIndex)}%)` }"></div>
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
      <div class="event-wrapper" v-if="displayEvent">
        <NuxtLink
            :to="displayEvent.isActive ? displayEvent.url : ''"
            class="event"
            :class="{ 'event--inactive': !displayEvent.isActive }"
            @click="handleEventClick"
        >
          <img class="bg" src="~/assets/images/EventNotificationBg.png" alt="" aria-hidden="true">
          <div class="event__content">
            <div class="event__info">
              <span class="event__badge">{{ t(displayEvent.valueKey) }}</span>
              <span class="event__title" v-if="displayEvent.isActive">
                 <strong>{{ t('eventsNotification.left') }} {{ displayEvent.daysNum }} {{
                  displayEvent.daysWord
                }}</strong>
              </span>
              <span class="event__title" v-else>
                {{ t('eventsNotification.untilEvent') }} <strong>{{ displayEvent.daysNum }} {{
                  displayEvent.daysWord
                }}</strong>
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
      <div class="mobile-panel" role="tabpanel">
        <VTransition>
          <div class="mobile-content" :key="currentTab.id">
            <component :is="currentComponent"/>
          </div>
        </VTransition>
      </div>
    </template>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useEventSessionStore} from '~/store/eventsStore.js'
import VPoints from "~/src/components/V-points.vue";
import VDaily from "~/src/components/Vdaily.vue";
import VLands from "~/src/components/V-lands.vue";
import Location from '../../assets/images/location.svg'
import Daily from '../../assets/images/daily.svg'
import Card from '../../assets/images/card.svg'
import VTransition from "~/src/components/V-transition.vue";
import HalloweenNotice from '~/assets/images/halloweenNotice.svg'
import PadLock from '~/assets/images/padlock.svg'
import ModalDev from '~/src/components/modal.vue'

const {t, locale} = useI18n();
const eventStore = useEventSessionStore();
const router = useRouter();

const showDevModal = ref(false)

const modalConfig = computed(() => {
  return {
    title: t('eventLocked.title'),
    text: t('eventLocked.text'),
    button: t('eventLocked.btn'),
    to: '/calendar',
    img: PadLock
  }
})

const closeDevModal = () => {
  showDevModal.value = false
}

const onDevModalButton = () => {
  showDevModal.value = false
  router.push(modalConfig.value.to)
}

watch(showDevModal, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

const tabs = [
  {id: 'locations', icon: Location, alt: 'achIcon', label: t('tabsMobile.locations'), component: VLands},
  {id: 'daily', icon: Daily, alt: 'daily icon', label: t('tabsMobile.daily'), component: VDaily},
  {id: 'profile', icon: Card, alt: 'ach icon', label: t('tabsMobile.profile'), component: VPoints},
]

function getDaysWord(num) {
  const n = Math.abs(num) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return t('shopDaysRaw.dayThird');
  if (n1 > 1 && n1 < 5) return t('shopDaysRaw.daySecond');
  if (n1 === 1) return t('shopDaysRaw.dayFirst');
  return t('shopDaysRaw.dayThird');
}

const displayEvent = computed(() => {
  const now = new Date();
  const currentYear = now.getFullYear();

  const parse = (str, y) => {
    const [datePart, timePart] = str.split(" ");
    const [month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = (timePart || "00:00").split(":").map(Number);
    return new Date(y, month - 1, day, hours ?? 0, minutes ?? 0, 0, 0);
  };

  const upcomingEvents = eventStore.events.map(event => {
    let startDate = parse(event.start, currentYear);
    let endDate = parse(event.end, currentYear);
    if (startDate > endDate) {
      if (now.getMonth() < startDate.getMonth()) {
        startDate.setFullYear(currentYear - 1);
      } else {
        endDate.setFullYear(currentYear + 1);
      }
    }
    if (endDate < now) {
      startDate.setFullYear(startDate.getFullYear() + 1);
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    return {...event, startDate, endDate};
  }).sort((a, b) => a.startDate - b.startDate);

  const nextEvent = upcomingEvents.find(e => e.endDate >= now);
  if (!nextEvent) return null;

  const msPerDay = 1000 * 60 * 60 * 24;
  if (now >= nextEvent.startDate && now <= nextEvent.endDate) {
    const daysLeft = Math.ceil((nextEvent.endDate - now) / msPerDay);
    return {
      ...nextEvent,
      isActive: true,
      daysNum: daysLeft,
      daysWord: getDaysWord(daysLeft)
    };
  } else {
    const daysUntil = Math.ceil((nextEvent.startDate - now) / msPerDay);
    if (daysUntil <= 10) {
      return {
        ...nextEvent,
        isActive: false,
        daysNum: daysUntil,
        daysWord: getDaysWord(daysUntil)
      };
    }
  }

  return null;
});

function handleEventClick(e) {
  if (displayEvent.value && !displayEvent.value.isActive) {
    e.preventDefault();
    showDevModal.value = true;
  }
}

const getTransformX = (index) => {
  if (index === -1) return 0;
  if (locale.value === 'ar') {
    return (tabs.length - 1 - index) * 100;
  }
  return index * 100;
};
const savedTab = typeof window !== 'undefined' ? sessionStorage.getItem('activeMobileTab') : null
const activeTabId = ref(savedTab || tabs[0].id)
const currentTab = computed(() => tabs.find(tab => tab.id === activeTabId.value) || tabs[0])
const currentComponent = computed(() => currentTab.value.component)

const activeIndex = computed(() => tabs.findIndex(tab => tab.id === activeTabId.value))

function setTab(id) {
  activeTabId.value = id
  sessionStorage.setItem('activeMobileTab', id)
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
  document.body.style.overflow = ''
})
</script>

<style scoped>

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

.event-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  margin: 6px 6px 2px 6px;
}

.event__speaker {
  width: 60px;
  height: auto;
  object-fit: contain;
  flex-shrink: 0;
  z-index: 2;
  filter: drop-shadow(0 2px 6px rgba(255, 140, 0, 0.45));
}

.event {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  padding: 12px 16px;
  cursor: pointer;
  text-decoration: none;
}

.event .bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-position: left center;
  z-index: 0;
  pointer-events: none;
}

.event--inactive {
  cursor: pointer;
}

.event__content {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 1;
  position: relative;
  margin-left: auto;
}

.event__info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-right: 40px;
}

.event__badge {
  font-size: 16px;
  font-family: "Rubik Wet Paint", system-ui;
  text-transform: uppercase;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #464242;
  margin-bottom: 4px;
}

.event__title {
  font-size: 14px;
  font-weight: 600;
  color: #f1f1f5;
  line-height: 1.2;
}

.event__title strong {
  color: #ffffff;
  font-weight: 800;
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
  flex: 1;
  overflow-y: auto;
  padding-bottom: 160px;
}

.lands__container::-webkit-scrollbar {
  width: 4px;
}

.lands__container::-webkit-scrollbar-track {
  background: transparent;
}

.lands__container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.lands__container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.4);
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
    max-height: calc(100dvh - 70px);
    overflow: hidden;
  }

  .mobile-nav {
    display: flex;
    position: relative;
    justify-content: space-between;
    border-radius: 40px;
    padding: 6px;
    background: var(--tabBg);
    border: 3px solid var(--tabsSlideBorderColor);
    box-shadow: var(--boxShadowMobile);
    margin: 0 4px;
    z-index: 1;
    flex-shrink: 0;
  }

  .sliding-bg {
    position: absolute;
    top: 5px;
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
    padding: 5px 0;
    cursor: pointer;
    position: relative;
    z-index: 2;
    -webkit-tap-highlight-color: transparent;
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

@media (min-width: 767px) {
  .stats__wrapper {
    padding-bottom: 165px;
  }
}
</style>