<template>
  <div
      v-if="modelValue"
      class="supernova-stage"
      :style="stageDynamicStyle"
  >
    <div class="content-wrapper">
      <div class="main-body">
        <p v-if="displayedStreak === 1" class="clean-text" :class="{ 'fade-in-ready': isHeaderVisible }">
          {{ t('hintText.start')}}
        </p>
        <div class="hero-composition">
          <div class="fire-backdrop" :class="{ 'ignited': isFlameVisible }">
            <div class="fire-igniter">
              <svg viewBox="0 0 100 130" class="fire-svg">
                <defs>
                  <linearGradient id="tierOuter" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" :stop-color="currentStreakTier.colors.fireOuter[0]"/>
                    <stop offset="45%" :stop-color="currentStreakTier.colors.fireOuter[1]"/>
                    <stop offset="85%" :stop-color="currentStreakTier.colors.fireOuter[2]"/>
                    <stop offset="100%" :stop-color="currentStreakTier.colors.fireOuter[3]"/>
                  </linearGradient>
                  <linearGradient id="tierInner" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" :stop-color="currentStreakTier.colors.fireInner[0]"/>
                    <stop offset="60%" :stop-color="currentStreakTier.colors.fireInner[1]"/>
                    <stop offset="100%" :stop-color="currentStreakTier.colors.fireInner[2]"/>
                  </linearGradient>
                </defs>
                <path
                    class="fire-flame outer-flame"
                    fill="url(#tierOuter)"
                    d="M 50,5 C 20,40 10,75 10,95 C 10,118 28,128 50,128 C 72,128 90,118 90,95 C 90,75 80,40 50,5 Z"
                />
                <path
                    class="fire-flame inner-flame"
                    fill="url(#tierInner)"
                    d="M 50,45 C 32,68 28,88 28,102 C 28,118 38,124 50,124 C 62,124 72,118 72,102 C 72,88 68,68 50,45 Z"
                />
              </svg>
              <div class="ignite-aura"></div>
            </div>
          </div>
        </div>
        <div class="streak-number-row" :class="{ 'num-visible': isNumberVisible }">
          <span class="streak-num">{{ displayedStreak }}</span>
          <span class="streak-label">{{ streakDaysDeclension }}</span>
        </div>
        <div class="calendar-wrapper" :class="{ 'fade-in-ready': isCalendarVisible }">
          <div class="week-calendar-strip">
            <div
                v-for="day in weekContext.visibleDays"
                :key="day.name"
                class="week-day-col"
                :class="{
                    'is-today': day.isToday,
                    'is-lit': day.isToday ? isTodayLit : day.completed
                  }"
            >
              <span class="week-day-name">{{ day.name }}</span>
              <div class="week-day-badge">
                <span v-if="day.isToday ? isTodayLit : day.completed" class="check-icon">✓</span>
                <span v-else class="empty-dot"></span>
              </div>
            </div>
          </div>
          <p class="calendar-hint">{{ weekContext.hintText }}</p>
        </div>
      </div>
      <div class="hud-bottom">
        <button v-if="isButtonVisible" class="flow-btn pop-btn" @click="close">{{ buttonText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { getStreakTier, allNames, BUTTON_HINTS, CALENDAR_HINTS } from '~/utils/streakTiers.js';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  streak: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const { t } = useI18n();

const displayedStreak = ref(props.streak);

const isHeaderVisible = ref(false);
const isHedgehogVisible = ref(false);
const isFlameVisible = ref(false);
const isNumberVisible = ref(false);
const isCalendarVisible = ref(false);
const isTodayLit = ref(false);
const isButtonVisible = ref(false);

const animationTimers = [];

const currentStreakTier = computed(() => {
  return getStreakTier(displayedStreak.value);
});

const stageDynamicStyle = computed(() => {
  const tierColors = currentStreakTier.value.colors;

  return {
    '--theme-glow': tierColors.glow,
    '--theme-accent': tierColors.accentColor,
    '--theme-bg': tierColors.bgGlow,
    '--fire-c1': tierColors.fireOuter?.[1] || tierColors.accentColor,
    '--fire-c2': tierColors.fireOuter?.[0] || tierColors.glow
  };
});

const getDaysWord = (daysCount) => {
  const absoluteCount = Math.abs(daysCount) % 100;
  const lastDigit = absoluteCount % 10;
  if (absoluteCount > 10 && absoluteCount < 20) {
    return t('shopDaysRaw.dayThird');
  }
  if (lastDigit > 1 && lastDigit < 5) {
    return t('shopDaysRaw.daySecond');
  }
  if (lastDigit === 1) {
    return t('shopDaysRaw.dayFirst');
  }
  return t('shopDaysRaw.dayThird');
};

const streakDaysDeclension = computed(() => {
  const daysWord = getDaysWord(displayedStreak.value);
  return `${daysWord} ${t('hintText.aRow')}`;
});

const buttonText = computed(() => {
  const currentStreakNumber = Number(displayedStreak.value) || 1;
  const hintIndex = (currentStreakNumber - 1) % BUTTON_HINTS.length;
  return t(BUTTON_HINTS[hintIndex]);
});

const weekContext = computed(() => {
  const currentDate = new Date();
  const dayOfWeekIndex = currentDate.getDay();
  const todayIndex = dayOfWeekIndex === 0 ? 6 : dayOfWeekIndex - 1;
  const currentStreak = Number(displayedStreak.value) || 1;

  const seriesStartIndex = Math.max(0, todayIndex - currentStreak + 1);

  const visibleDays = allNames.slice(seriesStartIndex).map((dayNameKey, offsetIndex) => {
    const originalDayIndex = seriesStartIndex + offsetIndex;
    const isCurrentDay = originalDayIndex === todayIndex;
    const isCompletedDay = originalDayIndex <= todayIndex;

    return {
      name: t(dayNameKey),
      isToday: isCurrentDay,
      completed: isCompletedDay
    };
  });

  let hintText = '';

  if (todayIndex === 6) {
    hintText = t('hintText.first');
  } else if (seriesStartIndex > 0 && currentStreak <= 2) {
    hintText = t('hintText.second');
  } else {
    const hintIndex = (currentStreak - 1) % CALENDAR_HINTS.length;
    hintText = t(CALENDAR_HINTS[hintIndex]);
  }

  return {
    visibleDays,
    hintText
  };
});

const clearAllTimers = () => {
  while (animationTimers.length > 0) {
    clearTimeout(animationTimers.pop());
  }
};

const startAnimationSequence = (streakValue) => {
  clearAllTimers();
  displayedStreak.value = streakValue;

  isHeaderVisible.value = false;
  isHedgehogVisible.value = false;
  isFlameVisible.value = false;
  isNumberVisible.value = false;
  isCalendarVisible.value = false;
  isTodayLit.value = false;
  isButtonVisible.value = false;

  animationTimers.push(setTimeout(() => {
    isHeaderVisible.value = true;
    isHedgehogVisible.value = true;
  }, 60));

  animationTimers.push(setTimeout(() => {
    isFlameVisible.value = true;
  }, 300));

  animationTimers.push(setTimeout(() => {
    isNumberVisible.value = true;
  }, 500));

  animationTimers.push(setTimeout(() => {
    isCalendarVisible.value = true;
  }, 700));

  animationTimers.push(setTimeout(() => {
    isTodayLit.value = true;
  }, 1000));

  animationTimers.push(setTimeout(() => {
    isButtonVisible.value = true;
  }, 1700));
};

const close = () => {
  clearAllTimers();
  emit('update:modelValue', false);
  emit('close');
};

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    startAnimationSequence(props.streak);
  } else {
    clearAllTimers();
  }
});

onMounted(() => {
  if (props.modelValue) {
    startAnimationSequence(props.streak);
  }
});
</script>

<style scoped>
.supernova-stage {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  transform: translateZ(0);
  padding-top: max(10px, env(safe-area-inset-top));
  padding-bottom: max(10px, env(safe-area-inset-bottom));
  padding-left: max(10px, env(safe-area-inset-left));
  padding-right: max(10px, env(safe-area-inset-right));
}

.content-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-width: 380px;
  transform: translateZ(0);
}

.main-body {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 4px;
}

.clean-text {
  font-size: 15px;
  line-height: 1.4;
  color: #f1f5f9;
  font-weight: 700;
  text-align: center;
  max-width: 310px;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9);
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.clean-text.fade-in-ready {
  opacity: 1;
  transform: translateY(0);
}

.hero-composition {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  place-items: center;
  width: 100%;
  height: 220px;
}

.fire-backdrop {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
  transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.fire-backdrop.ignited {
  opacity: 1;
  transform: scale(1);
}

.fire-igniter {
  position: relative;
  width: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fire-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 32px var(--theme-glow));
}

.outer-flame {
  transform-origin: 50% 95%;
  animation: smooth-flame-breathe 2.8s ease-in-out infinite alternate;
}

.inner-flame {
  transform-origin: 50% 95%;
  animation: smooth-inner-flicker 2.1s ease-in-out infinite alternate;
}

.ignite-aura {
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  height: 190px;
  filter: blur(24px);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, var(--theme-glow) 55%, transparent 80%);
  opacity: 0.55;
  pointer-events: none;
}

.hedgehog-foreground {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateY(18px);
  opacity: 0;
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.hedgehog-foreground.fade-in-ready {
  opacity: 1;
  transform: translateY(22px);
}

.hedgehog-img {
  width: 110px;
  height: auto;
  filter: drop-shadow(0 14px 26px rgba(0, 0, 0, 0.85));
  animation: hedgehog-bob 2.4s ease-in-out infinite alternate;
}

@keyframes hedgehog-bob {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-6px);
  }
}

.streak-number-row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 10px 0 10px 0;
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.4s ease, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.streak-number-row.num-visible {
  opacity: 1;
  transform: scale(1);
}

.streak-num {
  font-family: Lilita One, sans-serif;
  font-size: 66px;
  font-weight: 950;
  line-height: 0.9;
  letter-spacing: -2px;
  background: linear-gradient(180deg, #ffffff 20%, var(--theme-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 16px var(--theme-glow));
}

.streak-label {
  font-family: "Nunito", sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin-top: 4px;
  background: linear-gradient(180deg, #ffffff 20%, var(--theme-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 10px var(--theme-glow));
}

.calendar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.calendar-wrapper.fade-in-ready {
  opacity: 1;
  transform: translateY(0);
}

.calendar-hint {
  padding: 10px;
  font-size: 17px;
  max-width: 320px;
  width: 100%;
  font-weight: 800;
  color: #ffffff;
  text-align: center;
  margin: 0;
  text-shadow: 0 0 10px rgba(251, 191, 36, 0.45);
  margin-bottom: 20px;
}

.week-calendar-strip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: auto;
  min-width: 190px;
  max-width: 324px;
  padding: 8px 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
  border: none;
  margin-bottom: 20px;
}

.week-day-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 28px;
}

.week-day-name {
  font-size: 12px;
  font-weight: 900;
  color: #64748b;
  letter-spacing: 0.5px;
}

.week-day-col.is-today .week-day-name {
  color: var(--theme-accent);
}

.week-day-badge {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.empty-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
}

.week-day-col.is-lit .week-day-badge {
  background: linear-gradient(135deg, var(--fire-c1) 0%, var(--fire-c2) 100%);
  box-shadow: 0 0 18px var(--theme-glow), 0 0 8px var(--fire-c2);
  animation: lit-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.week-day-col.is-lit .check-icon {
  color: #ffffff;
  font-size: 14px;
  font-weight: 950;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

@keyframes lit-pop {
  0% {
    transform: scale(0.5);
    filter: brightness(2);
  }
  50% {
    transform: scale(1.35);
    filter: brightness(1.6);
    box-shadow: 0 0 26px #fff;
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
}

.hud-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 0 12px 0;
  margin-top: auto;
  min-height: 70px;
  justify-content: flex-end;
}

.flow-btn {
  width: 100%;
  max-width: 300px;
  padding: 12px;
  border: none;
  border-radius: 50px;
  background: #FF5722;
  color: #fff;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 6px 0 #e44b1b;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.flow-btn:active {
  transform: translateY(2px);
}

.pop-btn {
  animation: button-slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes button-slide-up {
  0% {
    opacity: 0;
    transform: translateY(18px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes smooth-flame-breathe {
  0% {
    transform: scale3d(1, 1, 1) rotate(0deg);
  }
  50% {
    transform: scale3d(1.02, 0.98, 1) rotate(-1deg);
  }
  100% {
    transform: scale3d(0.99, 1.03, 1) rotate(1deg);
  }
}

@keyframes smooth-inner-flicker {
  0% {
    transform: scale3d(1, 1, 1);
    opacity: 0.88;
  }
  100% {
    transform: scale3d(1.04, 1.03, 1);
    opacity: 1;
  }
}
</style>