<template>
  <div class="page">
    <header class="topbar">
      <button class="back-btn" @click="goBack" aria-label="back">←</button>
      <h1 class="page-title">{{ t('calendarInfo.eventsTitle')}}</h1>
      <div class="spacer"></div>
    </header>
    <div class="layout">
      <div class="area__info">
        <div class="legend" aria-label="info">
          <div class="legend__wrapper">
            <div class="legend__title-wrap">
              <h2 class="legend__title">{{ t('calendarInfo.pointsTitle')}}</h2>
            </div>
            <ul class="legend__list">
              <li v-for="event in legendList" :key="event.id" class="legend__item">
                <span class="legend__icon-wrap" :class="'legend__icon-wrap--' + event.typeId">
                   <img :src="event.icon" :alt="event.alt || event.title" class="legend__icon"/>
                    </span>
                <div class="legend__meta"><strong class="legend__name">{{ event.title }}</strong><small
                    class="legend__period">{{ humanizePeriod(event.start, event.end) }}</small>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <main class="main">
        <section class="calendar-card">
          <header class="calendar__header">
            <button class="calendar__nav-btn" @click="goToPreviousMonth" aria-label="Предыдущий месяц">‹</button>
            <div class="calendar__header-date">{{ monthNames[currentMonth] }} {{ currentYear }}</div>
            <button class="calendar__nav-btn" @click="goToNextMonth" aria-label="Следующий месяц">›</button>
          </header>
          <div class="calendar__weekdays">
            <div v-for="weekday in weekdayNames" :key="weekday" class="calendar__weekday">{{ weekday }}</div>
          </div>
          <div class="calendar__grid" role="grid" aria-label="Calendar grid">
            <div
                v-for="day in calendarDays"
                :key="day.key"
                class="calendar__cell"
                :class="{
                'calendar__cell--today': day.isToday,
                'calendar__cell--event': !!day.eventBadge,
                ['calendar__cell--event-' + (day.eventBadge?.typeId || '')]: !!day.eventBadge,
              }"
                role="gridcell"
                :aria-label="dayAria(day)"
            >
              <div class="calendar__date">{{ day.dateObj.getDate() }}</div>
              <div v-if="day.eventBadge?.icon" class="calendar__icon-wrap">
                <img class="calendar__icon" :src="day.eventBadge.icon"
                     :alt="day.eventBadge.alt || day.eventBadge.title"/>
              </div>
              <div
                  v-if="day.eventBadge"
                  class="calendar__badge"
                  :class="'calendar__badge--' + day.eventBadge.typeId"
                  :title="day.eventBadge.title"
              >
                {{ day.eventBadge.label }}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router'
import HalloweenIcon from '../../assets/images/calendar-icons/halloweenIcon.svg'
import ChristmasIcon from '../../assets/images/calendar-icons/christmas-wreath.svg'
import FoolDay from '../../assets/images/calendar-icons/FoolDay.svg'
import Bees from '../../assets/images/calendar-icons/bees.svg'

definePageMeta({
  robots: {
    index: false,
    follow: false
  }
})

const { t} = useI18n()
const router = useRouter()
const goBack = () => {
  router.push('/')
}
const monthNames = [
  t('calendarMonths.january'),
  t('calendarMonths.february'),
  t('calendarMonths.march'),
  t('calendarMonths.april'),
  t('calendarMonths.may'),
  t('calendarMonths.june'),
  t('calendarMonths.july'),
  t('calendarMonths.august'),
  t('calendarMonths.september'),
  t('calendarMonths.october'),
  t('calendarMonths.november'),
  t('calendarMonths.december')
]
const weekdayNames = [
  t('calendarWeekDays.monday'),
  t('calendarWeekDays.tuesday'),
  t('calendarWeekDays.wednesday'),
  t('calendarWeekDays.thursday'),
  t('calendarWeekDays.friday'),
  t('calendarWeekDays.saturday'),
  t('calendarWeekDays.sunday')
]

const annualEvents = ref([
  {
    id: 'winter-veil',
    icon: ChristmasIcon,
    alt: 'ChristmasIcon',
    title: t('eventsNavNames.winter'),
    typeId: 'winter',
    start: '12-24 00:00',
    end: '01-02 23:59'
  },
  {
    id: 'valentine',
    icon: Bees,
    alt: 'Bees',
    title: t('eventsNavNames.valentine'),
    typeId: 'valentine',
    start: '02-14 00:00',
    end: '02-16 23:59'
  },
  {
    id: 'april',
    icon: FoolDay,
    alt: 'FoolDay',
    title: t('eventsNavNames.firstApril'),
    typeId: 'fools',
    start: '04-01 00:00',
    end: '04-01 23:59'
  },
  {
    id: 'pumpkin',
    icon: HalloweenIcon,
    alt: 'HalloweenIcon',
    title: t('eventsNavNames.halloween'),
    typeId: 'pumpkin',
    start: '10-28 00:00',
    end: '10-31 23:59'
  },
])

const legendList = computed(() => annualEvents.value.map(event => ({
  id: event.id, title: event.title, typeId: event.typeId, icon: event.icon, alt: event.alt, start: event.start, end: event.end
})))

const now = new Date()
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth())

function createDate(year, monthIndex, day, hours = 0, minutes = 0) {
  return new Date(year, monthIndex, day, hours, minutes, 0, 0)
}

function parseAnnualToDate(mmddHHmm, year) {
  const [datePart, timePart] = mmddHHmm.split(' ')
  const [mm, dd] = datePart.split('-').map(Number)
  const [hh, min] = timePart.split(':').map(Number)
  return createDate(year, mm - 1, dd, hh, min)
}

function isSameYMD(left, right) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth() && left.getDate() === right.getDate()
}

function startOfDay(dateObj) {
  const date = new Date(dateObj);
  date.setHours(0, 0, 0, 0);
  return date
}

function endOfDay(dateObj) {
  const date = new Date(dateObj);
  date.setHours(23, 59, 59, 999);
  return date
}

  function materializeAnnualEventForYear(eventItem, year) {
    const startThisYear = parseAnnualToDate(eventItem.start, year)
    const [startMonthStr] = eventItem.start.split(' ')
    const [endMonthStr] = eventItem.end.split(' ')
    const startMonth = parseInt(startMonthStr.split('-')[0], 10)
    const endMonth = parseInt(endMonthStr.split('-')[0], 10)
    let endYear = year
    if (startMonth === 12 && endMonth === 1) endYear = year + 1
    const endForYear = parseAnnualToDate(eventItem.end, endYear)
    return {
      id: eventItem.id,
      title: eventItem.title,
      typeId: eventItem.typeId,
      icon: eventItem.icon || null,
      alt: eventItem.alt || '',
      startDate: startThisYear,
      endDate: endForYear
    }
  }

  function resolveEventBadgeForDay(dateObj) {
    const year = dateObj.getFullYear()
    const candidates = []
    for (const eventItem of annualEvents.value) {
      const cur = materializeAnnualEventForYear(eventItem, year)
      candidates.push(cur)
      const prev = materializeAnnualEventForYear(eventItem, year - 1)
      if (prev.endDate.getFullYear() === year && prev.endDate.getMonth() === 0) {
        candidates.push(prev)
      }
    }
    const match = candidates.find(evt => dateObj >= startOfDay(evt.startDate) && dateObj <= endOfDay(evt.endDate))
    if (!match) return null
    const isStart = isSameYMD(dateObj, match.startDate)
    const isEnd = isSameYMD(dateObj, match.endDate)
    const label = (isStart || isEnd) ? match.title : match.title
    return {
      id: match.id,
      title: match.title,
      typeId: match.typeId,
      label,
      status: isStart ? 'start' : isEnd ? 'end' : 'inside',
      icon: match.icon || null,
      alt: match.alt || ''
    }
  }

  const calendarDays = computed(() => {
    const firstOfMonth = createDate(currentYear.value, currentMonth.value, 1)
    let weekdayIndex = firstOfMonth.getDay();
    if (weekdayIndex === 0) weekdayIndex = 7
    const daysFromPrev = weekdayIndex - 1
    const startGridDate = createDate(currentYear.value, currentMonth.value, 1 - daysFromPrev)

    const days = []
    for (let index = 0; index < 42; index += 1) {
      const cellDate = createDate(startGridDate.getFullYear(), startGridDate.getMonth(), startGridDate.getDate() + index)
      const isInCurrentMonth = cellDate.getMonth() === currentMonth.value && cellDate.getFullYear() === currentYear.value
      const isToday = isSameYMD(cellDate, new Date())
      const eventBadge = resolveEventBadgeForDay(cellDate)
      days.push({key: cellDate.toISOString().slice(0, 10), dateObj: cellDate, isInCurrentMonth, isToday, eventBadge})
    }
    return days
  })

  function goToPreviousMonth() {
    if (currentMonth.value === 0) {
      currentMonth.value = 11;
      currentYear.value -= 1
    } else {
      currentMonth.value -= 1
    }
  }

  function goToNextMonth() {
    if (currentMonth.value === 11) {
      currentMonth.value = 0;
      currentYear.value += 1
    } else {
      currentMonth.value += 1
    }
  }

  function dayAria(day) {
    const d = day.dateObj
    const base = `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
    return day.eventBadge ? `${base}. Событие: ${day.eventBadge.title}` : base
  }

  function humanizePeriod(start, end) {
    const [sm, sd] = start.split(' ')[0].split('-')
    const [em, ed] = end.split(' ')[0].split('-')
    return `${sd}.${sm} — ${ed}.${em}`
  }


</script>

<style scoped>
:root {
  --ink: #121018;
  --sticker: #fffdfa;
  --cta: #ff6ea6;
}

.legend__wrapper {
  padding:  0 15px 15px 15px ;
}

.page {
  min-height: 100dvh;
  max-width: 1400px;
  margin: 0 auto;
  padding: 15px;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  padding: 10px 12px;
  background: #fff;
  border-bottom: 3px solid var(--ink);
  box-shadow: 0 6px 0 rgba(0, 0, 0, .06);
  margin-bottom: 15px;
}

.back-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  border: 3px solid var(--ink);
  background: #54cb54;
  font-size: 20px;
  font-weight: 1000;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 0 #30b630;
  transition: transform .18s ease, box-shadow .18s ease;
}

.back-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 0 #f0b7d2;
}

.page-title {
  text-align: center;
  font-size: 28px;
  font-weight: 1000;
  color: var(--ink);
}

.spacer {
  width: 56px;
}

.layout {
  display: flex;
  gap: 10px;
}

.area__info {
  background: #ffffff;
  border-radius: 15px;
}

.legend__item {
  display: flex;
  margin-bottom: 10px;
  padding: 10px;
}

.legend {
  border-radius: 18px;
  min-width: 320px;
  height: 100%;
  box-shadow: 0 5px 0 #e6e6f0;;
}

.legend__title {
  font-size: 24px;
  text-align: center;
  font-weight: 1000;
  color: #2f2e2e;
  padding: 15px;
  margin-bottom: 10px;
  border-bottom: 2px dashed black;
}

.legend__icon-wrap {
  width: 60px;
  height: 60px;
  border: 3px solid var(--ink);
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #fff;
  margin-right: 15px;
}

.legend__meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.legend__name {
  display: block;
}

.legend__period {
  opacity: .8;
}

.legend-mobile > summary {
  cursor: pointer;
  padding: 8px 10px;
  border: 3px solid var(--ink);
  border-radius: 12px;
  background: #fff;
  font-weight: 800;
}

.main {
  flex-grow: 1;
}

.calendar-card {
  border-radius: 22px;
  flex: 1;
}

.calendar__header {
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 12px;
  margin: 0 0 12px;
  background: linear-gradient(180deg, #ffeff8 0%, #ffd9ec 100%);
  border: 3px solid var(--ink);
  border-radius: 16px;
  padding: 8px 10px;
}

.calendar__header-date {
  font-size: 20px;
  font-weight: 1000;
  text-align: center;
  background: #fff;
  border: 2px solid var(--ink);
  border-radius: 12px;
  padding: 6px 10px;
}

.calendar__nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  border: 3px solid var(--ink);
  background: radial-gradient(circle at 50% 35%, #fff, #ffe7f4 60%, #ffd1ea 100%);
  font-size: 20px;
  font-weight: 1000;
  box-shadow: 0 6px 0 #f0b7d2;
}

.calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin: 10px 0;
}

.calendar__weekday {
  text-align: center;
  font-weight: 1000;
  background: linear-gradient(180deg, #dff6ff 0%, #cfe9ff 100%);
  border-radius: 12px;
  padding: 8px 0;
}

.calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar__cell {
  position: relative;
  min-height: clamp(70px, 10vw, 100px);
  max-height: clamp(70px, 10vw, 100px);
  background: #fff;
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 4px 0 #d1d1d5;
}

.calendar__date {
  font-weight: 1000;
  font-size: 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
}

.calendar__cell--today {
  background: linear-gradient(180deg, #fff7fb 0%, #ffeef7 100%);
  border-color: #ff6ea6;
}

.calendar__icon-wrap {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.calendar__icon {
  width: clamp(26px, 4.5vw, 42px);
  height: clamp(26px, 4.5vw, 42px);
  object-fit: contain;
  filter: drop-shadow(0 2px 0 rgba(0, 0, 0, .35));
}

.calendar__badge {
  position: absolute;
  left: 6px;
  right: 6px;
  bottom: 6px;
  text-align: center;
  font-size: 11px;
  font-weight: 900;
  padding: 4px 6px;
  color: #111;
  background: #fff6d8;
  border: 3px solid var(--ink);
  border-radius: 10px;
  box-shadow: 0 4px 0 #e7d7a6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.calendar__cell--event-pumpkin {
  background: linear-gradient(180deg, #ffd4a2 0%, #ffb46b 100%);
  border-color: #5a3100;
}

.calendar__cell--event-winter {
  background: linear-gradient(180deg, #d7f0ff 0%, #a9d7ff 100%);
  border-color: #1a3d6b;
}

.calendar__cell--event-valentine {
  background: linear-gradient(180deg, #ffcee1 0%, #ff9dc4 100%);
  border-color: #7a0e3f;
}

.calendar__cell--event-fools {
  background: linear-gradient(180deg, #cde0ff 0%, #9ec0ff 100%);
  border-color: #0f2d7a;
}

.calendar__badge--pumpkin {
  background: #ffe9c7;
}

.calendar__badge--winter {
  background: #eaf6ff;
}

.calendar__badge--valentine {
  background: #ffe0ee;
}

.calendar__badge--fools {
  background: #e3eeff;
}


@media (max-width: 767px) {
  .layout {
    grid-template-columns: 280px 1fr;
    padding: 0;
  }
}

@media (max-width: 767px) {
  .layout {
    flex-direction: column-reverse;
    gap: 0;
    padding: 0 5px 20px 5px;
  }

  .legend__list {
    display: flex;
    flex-wrap: wrap;
  }
  .calendar-card {
    margin-bottom: 15px;
  }

  .legend__item {
    width: 50%;
  }

  .legend__wrappper {
    padding: 10px;
  }


  .legend__icon-wrap {
    width: 48px;
    height: 48px;
    margin-right: 8px;
  }
  .legend__name {
    font-size: 15px;
  }
  .page {
    padding: 5px;
  }
  .calendar__cell {
    padding: 4px;
  }
  .calendar__badge {
    display: none;
  }
  .calendar__icon {
    width: 31px;
    height: 31px;
  }
  .calendar__icon-wrap {
    padding-top: 15px;
  }
  .page-title {
    font-size: 25px;
  }
}

@media (max-width: 520px) {
  .topbar {
    grid-template-columns: 48px 1fr 48px;
  }

  .back-btn {
    width: 40px;
    height: 40px;
  }

  .calendar__header {
    grid-template-columns: 40px 1fr 40px;
  }

  .calendar__nav-btn {
    width: 40px;
    height: 40px;
  }

  .calendar__weekdays {
    gap: 6px;
  }
}

@media (max-width: 360px) {
  .calendar__grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
