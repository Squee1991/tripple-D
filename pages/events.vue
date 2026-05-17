<template>
  <div class="events-page">
    <ModalDev
        :visible="showDevModal"
        @close="closeDevModal"
        :title="modalConfig.title"
        :img="modalConfig.img"
        :text="modalConfig.text"
        :button="modalConfig.button"
        @button="onDevModalButton"
    />
    <div class="events-container">
      <div class="page-header">
        <VBackBtnNav/>
        <h1 class="page-title">{{ t('nav.events') }}</h1>
      </div>
      <VTransition>
        <div class="scrollable-view" v-if="isMounted">
          <div class="banner-wrapper">
            <VBanner
                :text="t('bannerTitles.events')"
                :icon="Events"
            />
          </div>
          <div class="topics-list-container">
            <template v-for="event in processedEvents" :key="event.id">
              <NuxtLink
                  v-if="event.isActive"
                  :to="event.url"
                  class="topic-list-item"
              >
                <div class="topic-item-content">
                  <div class="topic-icon-box">
                    <img class="topic-img-icon" :src="event.icon" :alt="event.alt">
                  </div>
                  <div class="topic-text-col">
                    <div class="topic-label">{{ event.title }}</div>
                    <span class="event-dates">{{ event.startDate }} - {{ event.endDate }}</span>
                  </div>
                </div>
                <VArrowNav/>
              </NuxtLink>
              <div
                  v-else
                  @click="handleLockedEvent(event)"
                  class="topic-list-item"
              >
                <div class="topic-item-content">
                  <div class="topic-icon-box">
                    <img class="topic-img-icon" :src="event.icon" :alt="event.alt">
                  </div>
                  <div class="topic-labelt">{{ event.title }}</div>
                </div>
                <VArrowNav/>
              </div>
            </template>
          </div>
        </div>
      </VTransition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ModalDev from '../src/components/modal.vue'
import VBanner from "~/src/components/V-banner.vue"
import PadLock from '../assets/images/padlock.svg'
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";
import HalloweenNav from '../assets/images/halloweenIconNav.svg'
import ValentineNav from '../assets/images/valentineIcon.svg'
import FoolDayNav from '../assets/images/fooldayNav.svg'
import ChristmasDayNav from '../assets/images/christmas-wreathNav.svg'
import Events from '../assets/images/app-nav-icons/events.svg'
import VArrowNav from "~/src/components/V-arrowNav.vue";
import VTransition from "~/src/components/V-transition.vue";
definePageMeta({
  layout: 'footerlayout'
})

const { t } = useI18n()
const router = useRouter()

const showDevModal = ref(false)
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

const modalConfig = computed(() => {
  return {
    title: t('eventLocked.title'),
    text: t('eventLocked.text'),
    button: { label: t('eventLocked.btn'), to: '/calendar' },
    img: PadLock
  }
})

const handleLockedEvent = (event) => {
  showDevModal.value = true
}
const closeDevModal = () => {
  showDevModal.value = false
}
const onDevModalButton = () => {
  showDevModal.value = false
  router.push(modalConfig.value.button.to)
}
watch(showDevModal, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
const isEventActive = (startDateStr, endDateStr) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const parseEventDate = (dateStr) => {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month] = datePart.split('.').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    return new Date(currentYear, month - 1, day, hours, minutes);
  };
  let startDate = parseEventDate(startDateStr);
  let endDate = parseEventDate(endDateStr);
  if (startDate > endDate) {
    if (today.getMonth() < startDate.getMonth()) {
      startDate.setFullYear(currentYear - 1);
    } else {
      endDate.setFullYear(currentYear + 1);
    }
  }
  return today >= startDate && today <= endDate;
}

const allEvents = [
  { id: 'winter-event', valueKey: 'eventsNavNames.winter', url: '/event-winter', startDate: '18.12 00:00', endDate: '02.01 23:59', icon: ChristmasDayNav, alt: 'ChristmasDayNav' },
  { id: 'valentine', valueKey: 'eventsNavNames.valentine', url: '/event-valentine', startDate: '12.02 00:00', endDate: '16.02 23:59', icon: ValentineNav, alt: 'ValentineNav' },
  { id: 'april', valueKey: 'eventsNavNames.firstApril', url: '/event-joke', startDate: '01.04 00:00', endDate: '01.04 23:59', icon: FoolDayNav, alt: 'FoolDayNav' },
  { id: 'halloween', valueKey: 'eventsNavNames.halloween', url: '/event-halloween', startDate: '29.10 00:00', endDate: '31.10 23:59', icon: HalloweenNav, alt: 'HalloweenNav' },
]

const processedEvents = computed(() => {
  return allEvents.map(event => {
    const active = isEventActive(event.startDate, event.endDate)
    return {
      ...event,
      title: t(event.valueKey),
      isActive: active,
      url: active ? event.url : null
    }
  })
})
</script>

<style scoped>
.events-page {
  font-family: "Nunito", sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.events-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.topic-labelt {
  color: var(--titleColor);
  font-weight: 600;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  flex-shrink: 0;
  z-index: 10;
}

.page-title {
  font-size: 23px;
  font-weight: 800;
  color: var(--title);
  letter-spacing: 1px;
  margin: 0 0 0 15px;
  text-shadow: 0 1px var(--title);
}

.scrollable-view {
  flex: 1;
  overflow-y: auto;
  padding: 10px 16px 110px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.scrollable-view::-webkit-scrollbar {
  display: none;
}

.banner-wrapper {
  margin-bottom: 20px;
}

.topics-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.topic-list-item {
  background: var(--menuItemsBg);
  border-radius: 20px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  transition: transform 0.1s, box-shadow 0.1s;
  text-decoration: none;
  width: 100%;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

.topic-list-item:active {
  transform: translateY(4px);
  box-shadow: 0 0px 0 var(--tabsSlideBorderColor);
}

.topic-item-content {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.topic-icon-box {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.topic-img-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.topic-text-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.topic-label {
  color: var(--titleColor);
  font-size: 17px;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
  line-height: 1.2;
  margin: 0;
  text-align: left;
}

.event-dates {
  font-size: 0.75rem;
  font-weight: 800;
  color: #ffffff;
  background: #2ecc71;
  padding: 3px 8px;
  border-radius: 8px;
  display: inline-block;
}

.topic-list-item.is-locked {
  background: var(--menuItemsBg);
}


@media (max-width: 400px) {
  .topic-label {
    font-size: 15px;
  }
  .topic-icon-box {
    width: 36px;
    height: 36px;
  }
}
</style>