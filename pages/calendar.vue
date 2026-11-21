<template>
  <div class="page">
    <header class="topbar">
      <VBackBtn/>
      <h1 class="page-title">{{ t('calendarInfo.eventsTitle')}}</h1>
      <div class="spacer"></div>
    </header>
    <div class="calendar__layout">
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
            <button class="calendar__nav-btn calendar__nav-btn--prev" type="button" @click="goToPreviousMonth" aria-label="Предыдущий месяц"><VArrowNav/></button>
            <div class="calendar__header-date">{{ monthNames[currentMonth] }} {{ currentYear }}</div>
            <button class="calendar__nav-btn" type="button" @click="goToNextMonth" aria-label="Следующий месяц"><VArrowNav/></button>
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
import HalloweenIcon from '~/assets/images/calendar-icons/halloweenIcon.svg'
import ChristmasIcon from '~/assets/images/calendar-icons/christmas-wreath.svg'
import FoolDay from '~/assets/images/calendar-icons/FoolDay.svg'
import Bees from '~/assets/images/calendar-icons/bees.svg'
import VBackBtn from "~/src/components/V-back-btn.vue";
import VArrowNav from "~/src/components/V-arrowNav.vue";
const { t} = useI18n()

definePageMeta({
  robots: {
    index: false,
    follow: false
  }
})

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
    start: '12-01 00:00',
    end: '01-03 23:59'
  },
  {
    id: 'valentine',
    icon: Bees,
    alt: 'Bees',
    title: t('eventsNavNames.valentine'),
    typeId: 'valentine',
    start: '02-12 00:00',
    end: '02-18 23:59'
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
    start: '10-19 00:00',
    end: '11-01 23:59'
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
/* Календарь событий в стиле приложения, дни ивента подсвечены его цветом.
   Светлая тема по умолчанию (как :root в theme.css), тёмная через html.dark */
.page {
  --cal-surface: #ffffff;
  --cal-surface-2: #f3f5fa;
  --cal-border: rgb(31 41 72 / 0.09);
  --cal-text: #1f2937;
  --cal-muted: #8a93a6;
  --cal-shadow: 0 6px 18px rgb(31 41 72 / 0.08);
  --cal-accent: #6c5ce7;
  --cal-accent-dark: #5143c4;

  height: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  overflow: hidden;
  font-family: "Nunito", sans-serif;
}

html.dark .page {
  --cal-surface: #1d2333;
  --cal-surface-2: #252c40;
  --cal-border: rgb(255 255 255 / 0.07);
  --cal-text: #ffffff;
  --cal-muted: #8b93a7;
  --cal-shadow: 0 8px 24px rgb(0 0 0 / 0.18);
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 5px 10px 12px;
  background: var(--bg);
}

.page-title {
  font-size: 23px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: var(--title);
}

.spacer {
  display: none;
}

.calendar__layout {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 10px calc(20px + env(safe-area-inset-bottom, 0px));
  scrollbar-width: none;
}

.calendar__layout::-webkit-scrollbar {
  display: none;
}

.main {
  order: 1;
}

.area__info {
  order: 2;
}

/* ---------- карточка календаря ---------- */
.calendar-card {
  background: var(--cal-surface);
  border: 1px solid var(--cal-border);
  border-radius: 24px;
  padding: 14px 12px 16px;
  box-shadow: var(--cal-shadow);
}

.calendar__header {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.calendar__header-date {
  text-align: center;
  font-size: 19px;
  font-weight: 800;
  color: var(--cal-text);
  text-transform: capitalize;
}

/* Стрелки месяцев: общий компонент V-arrowNav, левая развёрнута */
.calendar__nav-btn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar__nav-btn :deep(.topic-arrow) {
  margin: 0;
  width: 30px;
  height: 30px;
  padding: 9px;
}

.calendar__nav-btn--prev :deep(.topic-arrow) {
  transform: rotate(180deg);
}

.calendar__nav-btn:active {
  transform: scale(0.94);
}

.calendar__weekdays,
.calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.calendar__weekdays {
  margin-bottom: 6px;
}

.calendar__weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--cal-muted);
  padding: 4px 0;
}

/* ---------- клетки ---------- */
.calendar__cell {
  --event: transparent;
  position: relative;
  aspect-ratio: 1 / 1.08;
  border-radius: 14px;
  background: var(--cal-surface-2);
  border: 1px solid var(--cal-border);
  padding: 5px 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.calendar__date {
  font-size: 14px;
  font-weight: 800;
  color: var(--cal-text);
  line-height: 1;
}

.calendar__cell--today {
  border: 2px solid var(--cal-accent);
  box-shadow: 0 0 0 3px rgb(108 92 231 / 0.25);
}

.calendar__cell--today .calendar__date {
  color: var(--cal-accent);
}

/* дни ивента: мягкий фон в цвете ивента и иконка по центру */
.calendar__cell--event {
  background: linear-gradient(160deg, color-mix(in srgb, var(--event) 34%, var(--cal-surface-2)), color-mix(in srgb, var(--event) 14%, var(--cal-surface-2)));
  border-color: color-mix(in srgb, var(--event) 55%, transparent);
}

.calendar__cell--event-winter { --event: #4f9cf0; }
.calendar__cell--event-valentine { --event: #ff6f9e; }
.calendar__cell--event-fools { --event: #ffb547; }
.calendar__cell--event-pumpkin { --event: #ff8a1a; }

.calendar__icon-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar__icon {
  width: 60%;
  max-width: 34px;
  height: auto;
  filter: drop-shadow(0 2px 3px rgb(0 0 0 / 0.25));
}

.calendar__badge {
  display: none;
}

/* ---------- обозначения ---------- */
.legend {
  background: var(--cal-surface);
  border: 1px solid var(--cal-border);
  box-shadow: var(--cal-shadow);
  border-radius: 24px;
  padding: 16px 14px;
}

.legend__title {
  font-size: 18px;
  font-weight: 800;
  color: var(--cal-text);
  margin-bottom: 12px;
}

.legend__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.legend__item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 8px;
  border-radius: 16px;
  background: var(--cal-surface-2);
}

.legend__icon-wrap {
  --event: var(--cal-accent);
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--event) 25%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.legend__icon-wrap--winter { --event: #4f9cf0; }
.legend__icon-wrap--valentine { --event: #ff6f9e; }
.legend__icon-wrap--fools { --event: #ffb547; }
.legend__icon-wrap--pumpkin { --event: #ff8a1a; }

.legend__icon {
  width: 28px;
  height: 28px;
}

.legend__meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.legend__name {
  font-size: 14px;
  font-weight: 800;
  color: var(--cal-text);
  line-height: 1.2;
}

.legend__period {
  font-size: 12px;
  font-weight: 700;
  color: var(--cal-muted);
}

/* ---------- большие экраны: обозначения слева, календарь справа ---------- */
@media (min-width: 768px) {
  .calendar__layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    align-items: start;
    gap: 20px;
  }

  .main, .area__info {
    order: unset;
  }

  .legend__list {
    grid-template-columns: 1fr;
  }

  .calendar__grid {
    gap: 8px;
  }

  .calendar__date {
    font-size: 16px;
  }

  .calendar__badge {
    display: block;
    margin-top: auto;
    font-size: 10px;
    font-weight: 800;
    color: var(--cal-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.8;
  }
}

@media (max-width: 380px) {
  .calendar__weekdays,
  .calendar__grid {
    gap: 4px;
  }

  .calendar__cell {
    border-radius: 11px;
    padding: 4px;
  }

  .calendar__date {
    font-size: 12px;
  }
}
</style>
