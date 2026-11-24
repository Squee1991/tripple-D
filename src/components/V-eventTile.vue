<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useEventSessionStore } from '~/store/eventsStore.js'

// Квадратная плитка на карте: показывает, что сейчас идёт ивент и сколько до его конца.
// За две недели до старта плитка уже видна и показывает, сколько осталось до начала
const { t } = useI18n()
const localePath = useLocalePath()
const eventStore = useEventSessionStore()

const now = ref(new Date())
let timer = null

// Цвета плитки под тему ивента
const THEMES = {
  winter: { top: '#5aa9f0', bottom: '#2b4f8c', edge: '#1f3a6b' },
  valentine: { top: '#ff8fb4', bottom: '#d6407a', edge: '#9e2a5a' },
  april: { top: '#ffb547', bottom: '#e8782c', edge: '#b5581a' },
  pumpkin: { top: '#ff9c1a', bottom: '#7b3fa6', edge: '#4d2370' }
}

const parseDate = (str, year) => {
  const [datePart, timePart] = str.split(' ')
  const [month, day] = datePart.split('-').map(Number)
  const [hours, minutes] = (timePart || '00:00').split(':').map(Number)
  return new Date(year, month - 1, day, hours ?? 0, minutes ?? 0, 59, 999)
}

const activeEvent = computed(() => {
  const date = now.value
  const event = eventStore.events.find(e => eventStore.isEventActive(e.id, date))
  if (!event) return null
  // Ближайший конец ивента: если в этом году уже прошёл, значит он в следующем (зимний идёт через Новый год)
  let end = parseDate(event.end, date.getFullYear())
  if (end < date) end = parseDate(event.end, date.getFullYear() + 1)
  return { ...event, endDate: end }
})

const ANNOUNCE_DAYS = 7

// Ближайший ивент, который начнётся в течение 7 дней (пока ни один не идёт)
const upcomingEvent = computed(() => {
  if (activeEvent.value) return null
  const date = now.value
  let best = null
  for (const event of eventStore.events) {
    let start = parseDate(event.start, date.getFullYear())
    start.setSeconds(0, 0)
    if (start < date) {
      start = parseDate(event.start, date.getFullYear() + 1)
      start.setSeconds(0, 0)
    }
    const ms = start - date
    if (ms > 0 && ms <= ANNOUNCE_DAYS * 86400000 && (!best || start < best.startDate)) {
      best = { ...event, startDate: start }
    }
  }
  return best
})

const shownEvent = computed(() => activeEvent.value || upcomingEvent.value)

const formatDuration = (ms) => {
  const totalMinutes = Math.floor(Math.max(0, ms) / 60000)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) return t('eventTile.daysHours', { d: days, h: hours })
  return t('eventTile.hoursMinutes', { h: hours, m: minutes })
}

// Сколько календарных дней до даты: 24.11 → 01.12 = 7, в любое время суток
const calendarDaysUntil = (date) => {
  const from = new Date(now.value.getFullYear(), now.value.getMonth(), now.value.getDate())
  const to = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.round((to - from) / 86400000)
}

// Идёт: сколько до конца. Скоро: «через N д» по календарю, в день старта часы и минуты
const timeLeft = computed(() => {
  if (activeEvent.value) return formatDuration(activeEvent.value.endDate - now.value)
  if (upcomingEvent.value) {
    const days = calendarDaysUntil(upcomingEvent.value.startDate)
    const time = days > 0 ? t('eventTile.days', { d: days }) : formatDuration(upcomingEvent.value.startDate - now.value)
    return t('eventTile.startsIn', { time })
  }
  return ''
})

const theme = computed(() => THEMES[shownEvent.value?.id] || { top: '#7d70cf', bottom: '#5d50a8', edge: '#483d8f' })

onMounted(() => {
  timer = setInterval(() => { now.value = new Date() }, 30000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <NuxtLink
      v-if="shownEvent"
      :to="localePath(activeEvent ? activeEvent.url : '/events')"
      :class="['event-tile', { 'is-upcoming': !activeEvent }]"
      :style="{ '--tile-top': theme.top, '--tile-bottom': theme.bottom, '--tile-edge': theme.edge }"
      :aria-label="`${t(shownEvent.valueKey)}: ${timeLeft}`"
      :title="t(shownEvent.valueKey)"
  >
    <img :src="shownEvent.icon" :alt="shownEvent.alt" class="event-tile__icon">
    <span class="event-tile__time">{{ timeLeft }}</span>
  </NuxtLink>
</template>

<style scoped>
.event-tile {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 14px;
  border: 2px solid rgb(255 255 255 / 0.65);
  background:
    radial-gradient(circle at 25% 0%, rgb(255 255 255 / 0.35) 0%, transparent 60%),
    linear-gradient(180deg, var(--tile-top), var(--tile-bottom));
  box-shadow: 0 4px 0 var(--tile-edge), 0 8px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 4px;
  text-decoration: none;
  color: #fff;
  font-family: "Nunito", sans-serif;
  -webkit-tap-highlight-color: transparent;
}

.event-tile:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 var(--tile-edge);
}



.event-tile__icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25));
}

.event-tile__time {
  font-family: "Lilita One", "Nunito", sans-serif;
  font-size: 11px;
  line-height: 1.1;
  white-space: nowrap;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
}


</style>
