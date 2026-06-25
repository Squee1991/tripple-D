<template>
  <Transition name="slide-bottom">
    <div v-if="modelValue" class="modal-overlay-streak" @click.self="closeModal">
      <div class="modal-content">
        <div class="drag-handle-container" @click="closeModal"></div>
        <div class="header">
          <div class="rank-info-card">
            <div class="rank-info-header">
              <div class="hats__left-info">
                <span class="rank-icon-emoji" :class="{ filter : authStore.totalHats}">🎓</span>
                <div class="hats__total"> {{ authStore.totalHats }}</div>
              </div>
              <button @click="openList" class="btn__hats-info">
                <img :class="{ rotated: isOpen }" class="info__btn-icon" src="../../assets/images/next.svg"
                     alt="question">
              </button>
            </div>
            <div class="hats__info-wrapper"
                 :class="{open__info: isOpen}"
            >
              <div class="hats__defence">
                <div class="time__stop-wrapper">
                  <img class="time__stop-icon"
                       :class="{ isFreeze : authStore.isFreezeActive }"
                       :src="FreezeShield"
                       alt="FreezeShield"
                  >
                  <div class="time__stop"> {{ freezeComputed }}</div>
                </div>
              </div>
              <ul class="rank-info-list">
                <li>{{ t('pavelOverlay.rankLabelOne') }}</li>
                <li>{{ t('pavelOverlay.rankLabelTwo') }}</li>
                <li>{{ t('pavelOverlay.rankLabelThree') }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="month-navigation">
          <button @click="prevMonth" class="nav-btn prev">
            <img class="calendar__arrow" src="../../assets/images/next.svg" alt="prev">
          </button>
          <span class="current-month">{{ formattedMonthYear }}</span>
          <button @click="nextMonth" class="nav-btn">
            <img class="calendar__arrow" src="../../assets/images/next.svg" alt="next">
          </button>
        </div>
        <div class="calendar-grid">
          <div v-for="day in weekDays" :key="day" class="weekday">
            {{ day }}
          </div>
          <div v-for="(empty, index) in emptyDays" :key="'empty-start-' + index" class="day-cell empty-cell"></div>
          <div
              v-for="(data, index) in daysData"
              :key="'day-' + index"
              class="day-cell"
              :class="{
                'success': data.tasksCompleted > 0,
                'penalty': data.tasksCompleted < 0,
                'is-today': data.isToday,
                'before-reg': data.isBeforeRegistration
              }"
          >
            <div class="cell-background"></div>
            <span class="day-number">{{ data.day }}</span>

            <div class="task-count" v-if="data.isBeforeRegistration">
              <span class="icon-small" style="opacity: 0.3;">🎓</span>
              <span class="task-number" style="opacity: 0.3;">0</span>
            </div>
            <div class="task-count" v-else>
              <span class="icon-small">🎓</span>
              <span class="task-number" v-if="data.tasksCompleted > 0">{{ data.tasksCompleted }}</span>
              <span class="task-number" v-else-if="data.tasksCompleted < 0">{{ data.tasksCompleted }}</span>
              <span class="task-number" v-else>0</span>
            </div>
          </div>
          <div v-for="(empty, index) in trailingDays" :key="'empty-end-' + index" class="day-cell empty-cell"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, watch, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import VArrowNav from "~/src/components/V-arrowNav.vue";
import { dailyStore } from '../../store/dailyStore.js';
import { userAuthStore } from '../../store/authStore.js';
import FreezeShield from '../../assets/images/FreezeShield.svg';

const { t } = useI18n();
const authStore = userAuthStore();
const isOpen = ref(false);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const openList = () => {
  isOpen.value = !isOpen.value;
}

const freezeComputed = computed(() => {
  return authStore.isFreezeActive ? t('freezeStatus.active') : t('freezeStatus.inactive');
});

const daily = dailyStore();
const viewMode = ref('month');

const closeModal = () => {
  emit('update:modelValue', false);
};

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
];

const weekDays = [
  t('calendarWeekDays.monday'),
  t('calendarWeekDays.tuesday'),
  t('calendarWeekDays.wednesday'),
  t('calendarWeekDays.thursday'),
  t('calendarWeekDays.friday'),
  t('calendarWeekDays.saturday'),
  t('calendarWeekDays.sunday')
];

const currentDate = ref(new Date());
const realToday = new Date();
const daysData = ref([]);
const emptyDays = ref([]);
const trailingDays = ref([]);

const formattedMonthYear = computed(() => {
  const month = monthNames[currentDate.value.getMonth()];
  const year = currentDate.value.getFullYear();
  return `${month} ${year}`;
});

const generateCalendar = async () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const startingDayIndex = firstDay === 0 ? 6 : firstDay - 1;
  emptyDays.value = Array.from({length: startingDayIndex});
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let regDate = new Date();
  if (authStore.registeredAt) {
    regDate = new Date(authStore.registeredAt);
  }
  regDate.setHours(0, 0, 0, 0);

  daysData.value = Array.from({length: daysInMonth}, (_, i) => {
    const dayNumber = i + 1;
    const isToday = year === realToday.getFullYear() && month === realToday.getMonth() && dayNumber === realToday.getDate();
    const dayDate = new Date(year, month, dayNumber);

    return {
      day: dayNumber,
      isToday: isToday,
      isBeforeRegistration: dayDate < regDate
    };
  });
  const totalFilled = startingDayIndex + daysInMonth;
  trailingDays.value = Array.from({length: 42 - totalFilled});
  const monthHistory = await daily.fetchMonthHistory(year, month);
  daysData.value = daysData.value.map(data => {
    const historyCount = monthHistory[String(data.day)];
    let finalCount = historyCount !== undefined ? historyCount : 0;
    if (data.isToday) {
      finalCount = Math.max(finalCount, daily.currentCycle?.completedCount || 0);
    }

    return {
      ...data,
      tasksCompleted: finalCount
    };
  });
};

watch(() => daily.currentCycle?.completedCount, (newVal) => {
  const todayCell = daysData.value.find(d => d.isToday);
  if (todayCell) {
    if (todayCell.tasksCompleted >= 0) {
      todayCell.tasksCompleted = Math.max(todayCell.tasksCompleted, newVal || 0);
    }
  }
});

const prevMonth = async () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
  await generateCalendar();
};

const nextMonth = async () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
  await generateCalendar();
};

onMounted(() => {
  generateCalendar();
});
</script>

<style scoped>
.modal-overlay-streak {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  background: rgba(30, 39, 46, 0.8);
  align-items: flex-end;
  z-index: 9999;
}

.calendar__arrow {
  width: 18px;
  height: 18px;
}

.modal-content {
  width: 100%;
  max-width: 1024px;
  background: var(--bg);
  color: #f8fafc;
  border-radius: 32px 32px 0 0;
  font-family: Nunito, sans-serif;
  max-height: 100vh;
  overflow-y: auto;
  padding-bottom: env(safe-area-inset-bottom);
}

.slide-bottom-enter-active, .slide-bottom-leave-active {
  transition: opacity 0.3s ease;
}

.slide-bottom-enter-active .modal-content, .slide-bottom-leave-active .modal-content {
  transition: transform 0.4s cubic-bezier(0.3, 1, 0.3, 1);
}

.slide-bottom-enter-from, .slide-bottom-leave-to {
  opacity: 0;
}

.slide-bottom-enter-from .modal-content, .slide-bottom-leave-to .modal-content {
  transform: translateY(100%);
}

.drag-handle-container {
  width: 100%;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

.header {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 12px;
}

.rank-info-card {
  border-radius: 16px 16px 0 0;
  padding: 20px 10px 10px 10px;
  width: 100%;
  background: linear-gradient(145deg, rgb(0, 194, 255), rgb(0, 168, 219)) rgb(0, 194, 255);
  position: relative;
  overflow: hidden;
}

.time__stop-icon {
  width: 44px;
  filter: grayscale(1);
}

.time__stop-icon.isFreeze {
  filter: grayscale(0);
}

.time__stop {
  font-size: 17px;
  font-weight: bold;
  margin-left: 10px;
}

.time__stop-wrapper {
  display: flex;
  align-items: center;
  border-radius: 6px;
  padding: 10px;
  margin: 6px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.rank-info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.hats__total {
  font-size: 40px;
  min-width: 98px;
  font-family: 'Lilita One', sans-serif;
}

.hats__left-info {
  display: flex;
  align-items: center;
  padding: 2px 18px 2px 5px;
  gap: 5px;
}

.info__btn-icon {
  width: 32px;
  padding: 6px;
  transform: rotate(0deg);
  transition: transform 0.2s ease-in-out;
}

.info__btn-icon.rotated {
  transform: rotate(90deg);
  transition: .3s;
}

.btn__hats-info {
  font-size: 40px;
  border: none;
  background: none;
  padding: 10px;
  color: white;
  cursor: pointer;
}

.rank-icon-emoji {
  filter: grayscale(1);
  font-size: 64px;
  line-height: 1;
}

.rank-icon-emoji.filter {
  filter: grayscale(0);
}

.rank-title {
  color: white;
  font-size: 20px;
  font-weight: 900;
  margin: 0;
  text-shadow: 1px 1px rgba(0, 0, 0, 0.2);
}

.rank-info-list {
  padding: 0 6px;
}

.hats__info-wrapper {
  opacity: 0;
  height: 0;
  overflow: hidden;
  transition: height 0.3s ease-in-out, opacity 0.3s ease-in-out;
  will-change: height, opacity;
}

.hats__info-wrapper.open__info {
  height: 194px;
  opacity: 1;
}

.rank-info-list li {
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  position: relative;
  padding-left: 14px;
  text-align: left;
}

.rank-info-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  top: 0;
  color: #ffffff;
  font-size: 16px;
}

.rank-info-list li:last-child {
  margin-bottom: 0;
}

.month-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0 20px;
}

.current-month {
  font-size: 20px;
  font-weight: 800;
  color: var(--title);
}

.nav-btn {
  background: #2492cc;
  border: none;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.nav-btn.prev {
  transform: rotate(180deg);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: auto repeat(6, 52px);
  gap: 3px;
  min-height: 360px;
  padding: 8px 12px;
  align-content: start;
}

.weekday {
  text-align: center;
  color: var(--title);
  font-size: 14px;
  font-weight: 800;
}

.day-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  transition: all 0.3s ease;
  overflow: hidden;
  border: 2px solid transparent;
}

.empty-cell {
  background: transparent;
  border: none;
  pointer-events: none;
}

.day-cell:not(.empty-cell) .cell-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--menuItemsBg);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
}

.day-number {
  position: relative;
  font-size: 16px;
  font-weight: 800;
  color: var(--title);
  z-index: 1;
}

.day-cell.before-reg .day-number {
  opacity: 0.3;
}

.task-count {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
  z-index: 1;
}

.icon-small {
  font-size: 16px;
  line-height: 1;
  transition: all 0.3s ease;
}

.task-number {
  font-size: 14px;
  font-weight: 800;
  color: #475569;
}

/* СТИЛИ УСПЕШНОГО ДНЯ (ЗЕЛЕНЫЙ) */
.day-cell.success {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  transform: translateY(-2px);
  border-color: transparent;
}

.day-cell.success .cell-background {
  display: none;
}

.day-cell.success .day-number, .day-cell.success .task-number {
  color: #ffffff;
}

.day-cell.success .icon-small {
  filter: none;
}

/* СТИЛИ ШТРАФА (ЖЕЛТЫЙ) - Сработает только если в Firebase реально будет -3 */
.day-cell.penalty {
  background: linear-gradient(135deg, #eab308, #ca8a04);
  transform: translateY(-2px);
  border-color: transparent;
}

.day-cell.penalty .cell-background {
  display: none;
}

.day-cell.penalty .day-number, .day-cell.penalty .task-number {
  color: #101c3d;
}

.day-cell.penalty .icon-small {
  filter: none;
}

/* СТИЛИ СЕГОДНЯШНЕГО ДНЯ */
.day-cell.is-today {
  border-color: #3b82f6;
  box-shadow: inset 0 0 12px rgba(59, 130, 246, 0.2);
}

.day-cell.is-today .day-number {
  color: #3b82f6;
}

.day-cell.success.is-today {
  border-color: #ffffff;
}

.day-cell.success.is-today .day-number {
  color: #ffffff;
}

.day-cell.penalty.is-today {
  border-color: #ffffff;
}

.day-cell.penalty.is-today .day-number {
  color: #101c3d;
}
</style>