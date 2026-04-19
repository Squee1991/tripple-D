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

      <transition name="menu-appear">
        <div v-if="isMounted" class="events-grid">
          <div
              v-for="event in processedEvents"
              :key="event.id"
              class="event-card"
              :class="{ 'is-locked': !event.isActive }"
          >
            <NuxtLink
                v-if="event.isActive"
                :to="event.url"
                class="card-content"
            >
              <div class="event-info">
                <h2 class="card-title">{{ event.title }}</h2>
                <span class="event-dates">{{ event.startDate }} - {{ event.endDate }}</span>
              </div>
              <div class="icon active-icon">✨</div>
            </NuxtLink>
            <div
                v-else
                @click="handleLockedEvent(event)"
                class="card-content"
            >
              <div class="event-info">
                <h2 class="card-title">{{ event.title }}</h2>
                <div class="card__icon-wrapper">
                  <img class="card__icon-item" :src="event.icon" :alt="event.alt">
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ModalDev from '../src/components/modal.vue'
import PadLock from '../assets/images/padlock.svg'
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";
import HalloweenNav from '../assets/images/halloweenIconNav.svg'
import ValentineNav from '../assets/images/valentineIcon.svg'
import FoolDayNav from '../assets/images/fooldayNav.svg'
import ChristmasDayNav from '../assets/images/christmas-wreathNav.svg'

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

.page-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 10px 10px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  flex-shrink: 0;
  z-index: 10;
}

.card__icon-item {
  width: 45px;
  height: 45px;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--titleColor);
  letter-spacing: 1px;
  margin: 0 0 0 10px;
}

.events-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 15px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 110px;
}

.event-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 0 #1e1e1e;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  height: 100%;
}

.event-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 6px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #1e1e1e;
}

.event-dates {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 8px;
  display: inline-block;
  align-self: flex-start;
  border: 1px solid #ddd;
}

.menu-appear-enter-active {
  transition: all 0.4s ease-out;
}

.menu-appear-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>