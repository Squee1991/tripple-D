<template>
  <div class="calendar-box">
    <div class="calendar__wrapper">
      <div class="calendar">
        <header class="calendar__header">
          <button class="calendar__nav-btn" @click="goToPreviousMonth">‹</button>
          <div class="calendar__title">
            {{ monthNames[currentMonth] }} {{ currentYear }}
          </div>
          <button class="calendar__nav-btn" @click="goToNextMonth">›</button>
        </header>
        <div class="calendar__weekdays">
          <div v-for="weekday in weekdayNames" :key="weekday" class="calendar__weekday">
            {{ weekday }}
          </div>
        </div>

        <div class="calendar__grid">
          <div
              v-for="day in calendarDays"
              :key="day.key"
              class="calendar__cell"
              :class="{
          'calendar__cell--today': day.isToday,
          'calendar__cell--event': !!day.eventBadge,
          ['calendar__cell--event-' + day.eventBadge?.typeId]: !!day.eventBadge
        }"
          >
            <div class="calendar__date">{{ day.dateObj.getDate() }}</div>
            <div v-if="day.eventBadge?.icon" class="calendar__icon-wrap">
              <img class="calendar__icon" :src="day.eventBadge.icon" :alt="day.eventBadge.alt || day.eventBadge.title" />
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
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";
import HalloweenIcon from '../assets/images/calendar-icons/halloweenIcon.svg'
import ChristmasIcon from '../assets/images/calendar-icons/christmas-wreath.svg'

const annualEvents = ref([
  {
    id: "pumpkin",
    icon: HalloweenIcon,
    alt: 'HalloweenIcon',
    title: "Праздник тыкв",
    typeId: "pumpkin",
    start: "10-31 00:00",
    end: "11-07 23:59",
  },
  {
    id: "winter-veil",
    icon: ChristmasIcon,
    alt: 'ChristmasIcon',
    title: "Шёпот зимы",
    typeId: "winter",
    start: "12-14 00:00",
    end: "01-07 23:59",
  },
  {
    id: "valentine",
    title: "День купидона",
    typeId: "valentine",
    start: "02-14 00:00",
    end: "02-27 23:59",
  },
  {
    id: "april",
    title: "Шутим",
    typeId: "fools",
    start: "04-01 00:00",
    end: "04-01 23:59",
  },
]);

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const weekdayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const now = new Date();
const currentYear = ref(now.getFullYear());
const currentMonth = ref(now.getMonth());

function goToPreviousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
}

function goToNextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
}

function createDate(year, monthIndex, day, hours = 0, minutes = 0) {
  return new Date(year, monthIndex, day, hours, minutes, 0, 0);
}

function parseAnnualToDate(mmddHHmm, year) {
  const [datePart, timePart] = mmddHHmm.split(" ");
  const [mm, dd] = datePart.split("-").map(Number);
  const [hh, min] = timePart.split(":").map(Number);
  return createDate(year, mm - 1, dd, hh, min);
}

function isSameYMD(left, right) {
  return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
  );
}

function materializeAnnualEventForYear(eventItem, year) {
  const startThisYear = parseAnnualToDate(eventItem.start, year);
  const [startMonthStr] = eventItem.start.split(" ");
  const [endMonthStr] = eventItem.end.split(" ");
  const startMonth = parseInt(startMonthStr.split("-")[0], 10);
  const endMonth = parseInt(endMonthStr.split("-")[0], 10);
  let endYear = year;
  if (startMonth === 12 && endMonth === 1) endYear = year + 1;
  const endForYear = parseAnnualToDate(eventItem.end, endYear);

  return {
    id: eventItem.id,
    title: eventItem.title,
    typeId: eventItem.typeId,
    icon: eventItem.icon || null,
    alt: eventItem.alt || "",
    startDate: startThisYear,
    endDate: endForYear,
  };
}


const calendarDays = computed(() => {
  const firstOfMonth = createDate(currentYear.value, currentMonth.value, 1);
  let weekdayIndex = firstOfMonth.getDay();
  if (weekdayIndex === 0) weekdayIndex = 7;
  const daysFromPrev = weekdayIndex - 1;

  const startGridDate = createDate(
      currentYear.value,
      currentMonth.value,
      1 - daysFromPrev
  );

  const days = [];
  for (let index = 0; index < 42; index += 1) {
    const cellDate = createDate(
        startGridDate.getFullYear(),
        startGridDate.getMonth(),
        startGridDate.getDate() + index
    );

    const isInCurrentMonth =
        cellDate.getMonth() === currentMonth.value &&
        cellDate.getFullYear() === currentYear.value;

    const isToday = isSameYMD(cellDate, new Date());

    const eventBadge = resolveEventBadgeForDay(cellDate);

    days.push({
      key: cellDate.toISOString().slice(0, 10),
      dateObj: cellDate,
      isInCurrentMonth,
      isToday,
      eventBadge,
    });
  }
  return days;
});

function resolveEventBadgeForDay(dateObj) {
  const year = dateObj.getFullYear();
  const candidates = [];

  for (const eventItem of annualEvents.value) {
    const cur = materializeAnnualEventForYear(eventItem, year);
    candidates.push(cur);
    const prev = materializeAnnualEventForYear(eventItem, year - 1);
    if (prev.endDate.getFullYear() === year && prev.endDate.getMonth() === 0) {
      candidates.push(prev);
    }
  }
  const match = candidates.find(evt =>
      dateObj >= startOfDay(evt.startDate) && dateObj <= endOfDay(evt.endDate)
  );
  if (!match) return null;
  const isStart = isSameYMD(dateObj, match.startDate);
  const isEnd   = isSameYMD(dateObj, match.endDate);
  const label = (isStart || isEnd) ? match.title : match.title;
  return {
    id: match.id,
    title: match.title,
    typeId: match.typeId,
    label,
    status: isStart ? "start" : isEnd ? "end" : "inside",
    icon: match.icon || null,
    alt: match.alt || ""
  };
}

function startOfDay(dateObj) {
  const result = new Date(dateObj);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(dateObj) {
  const result = new Date(dateObj);
  result.setHours(23, 59, 59, 999);
  return result;
}
</script>

<style scoped>
.calendar {
  max-width: 920px;
  width: 100%;
  margin: 30px auto;
  padding: 20px  6px;
  background: #a855f7;
  border-radius: 14px;
  box-shadow: 0 2px 0 #d1c8a1, 0 6px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid #1a1a1a;
}

.calendar__wrapper{
  padding: 10px;
}

.calendar__header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 14px;
  background: #f1c40f;
  border: 2px solid #1a1a1a;
  border-radius: 12px;
  padding: 8px 10px;
  box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.06);
}

.calendar__title {
  font-size: 20px;
  font-weight: 900;
  color: #2b2b2b;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 0 #fff4c9;
}

.calendar__nav-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #1a1a1a;
  color: #1a1a1a;
  padding: 6px;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 2px 0 #bbab6a, 0 6px 16px rgba(0, 0, 0, 0.08);
  font-weight: 900;
  font-size: 20px;
}

.calendar__nav-btn:hover {
  filter: brightness(1.05);
}

.calendar__nav-btn:active {
  transform: translateY(1px);
}

.calendar__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
  margin: 10px 0 8px;
}

.calendar__weekday {
  text-align: center;
  font-weight: 900;
  color: #ffffff;
  background: #4ade80;
  outline: 2px solid #004d47;
  outline-offset: -2px;
  border-radius: 10px;
  padding: 6px 0;
}

.calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar__cell {
  overflow: hidden;
  background: #f6f6f6;
  border-radius: 14px;
  min-height: 84px;
  max-height: 84px;
  padding: 8px;
  color: red;
  position: relative;
  outline: 3px solid #050505;
  outline-offset: -3px;
  transition: transform .06s ease, box-shadow .15s ease, filter .15s ease, background-color .2s ease, border-color .2s ease;
}


.calendar__cell .calendar__date {
  color: black;
}

.calendar__cell--today .calendar__date {
  color: #fffdfd;
}

.calendar__cell--today {
  outline: 3px solid #f4c84a;
  outline-offset: -3px;
  background: #1e1d1d;
}

.calendar__cell--event-pumpkin {
  background: #986434;
  outline: 3px solid white;
  outline-offset: -3px;
}

.calendar__cell--event-winter {
  background: linear-gradient(180deg, #4884b4 0%, #376e9b 100%);
  outline: 3px solid white;
  outline-offset: -3px;
}

.calendar__cell--event-valentine {
  background: linear-gradient(180deg, #8d3463 0%, #210b16 100%);
  outline: 3px solid white;
  outline-offset: -3px;
}

.calendar__cell--event-fools {
  background: #3b82f6;
  outline: 3px solid white;
  outline-offset: -3px;
}

.calendar__date {
  font-weight: 900;
  color: #f1e8d0;
  text-align: center;
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
  margin-top: 15px;
  width: 38px;
  height: 38px;
  object-fit: contain;
  image-rendering: auto;
  filter: drop-shadow(0 1px 0 rgba(0,0,0,.35));
}

.calendar__badge {
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  font-size: 11px;
  font-weight: 900;
  padding: 2px;
  color: #000000;
  max-width: 100%;
  overflow: hidden;
  background: wheat;
  display: none;
}

@media (max-width: 500px) {
  .calendar__icon {
    width: 32px;
    height: 32px;
  }
}

</style>

