<template>
  <!-- компактный значок: одно сердце, налитое по числу жизней, и таймер до следующей -->
  <div v-if="compact" class="v-hearts-compact">
    <svg class="v-hearts-compact__heart" viewBox="0 0 32 29.6" aria-hidden="true">
      <defs>
        <clipPath :id="'heart-clip-compact-' + uniqueId">
          <path :d="HEART_PATH"/>
        </clipPath>
      </defs>
      <path class="heart-bg" :d="HEART_PATH"/>
      <g :clip-path="'url(#heart-clip-compact-' + uniqueId + ')'">
        <g class="water-group" :style="compactWaterStyle">
          <path class="water-wave" d="M 0 5 Q 8 8 16 5 T 32 5 T 48 5 T 64 5 V 40 H 0 Z" />
        </g>
      </g>
      <path class="v-hearts-compact__shine" d="M7 6 C4 7 3 10 3.5 12.5"/>
    </svg>
    <span class="v-hearts-compact__count">{{ lives }}</span>
    <span v-if="showTimer && lives < maxLives" class="v-hearts-compact__timer">{{ recoveryTimerText }}</span>
  </div>
  <div v-else class="v-hearts-wrapper">
    <div class="quest__hearts">
      <div
          v-for="(n, i) in maxLives"
          :key="i"
          class="quest__heart-wrapper"
      >
        <svg class="quest__heart-svg" viewBox="0 0 32 29.6">
          <defs>
            <clipPath :id="'heart-clip-' + i + '-' + uniqueId">
              <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
                c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
            </clipPath>
          </defs>
          <path class="heart-bg" d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
            c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
          <g :clip-path="'url(#heart-clip-' + i + '-' + uniqueId + ')'">
            <g class="water-group" :style="getWaterGroupStyle(i)">
              <path class="water-wave" d="M 0 5 Q 8 8 16 5 T 32 5 T 48 5 T 64 5 V 40 H 0 Z" />
            </g>
          </g>
        </svg>
      </div>
    </div>
    <div v-if="showTimer" class="lives-info">
      <template v-if="lives < maxLives">
        <img class="timer" src="~/assets/images/dailyIcons/timer.svg" alt="timer">
        <span class="timer-label">{{ t('lives.next') }}</span>
        <span class="timer-countdown">{{ recoveryTimerText }}</span>
      </template>
      <template v-else>
        <div class="max-status-wrapper">
          <span class="max-status">{{ t('lives.full') }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onActivated, onDeactivated, useId } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  lives: { type: Number, required: true },
  maxLives: { type: Number, required: true },
  lastLifeAtMs: { type: Number, default: 0 },
  regenIntervalMs: { type: Number, default: 60 * 1000 },
  showTimer: { type: Boolean, default: false },
  compact: { type: Boolean, default: false }
})

const HEART_PATH = 'M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z'

const uniqueId = useId().replace(/:/g, '-')
const now = ref(Date.now())
let timerInterval = null

function startTimer() {
  if (timerInterval) return
  now.value = Date.now()
  timerInterval = setInterval(() => {
    now.value = Date.now()
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

onMounted(() => startTimer())
onBeforeUnmount(() => stopTimer())
onActivated(() => startTimer())
onDeactivated(() => stopTimer())

// Оставшееся время до восстановления следующего сердечка
const nextTickRemainingMs = computed(() => {
  if (props.lives >= props.maxLives || !props.regenIntervalMs) return 0
  const lastLife = props.lastLifeAtMs || now.value
  const elapsed = Math.max(0, now.value - lastLife)
  const remaining = props.regenIntervalMs - elapsed
  return Math.max(0, remaining)
})

// Форматирование MM:SS
const recoveryTimerText = computed(() => {
  if (props.lives >= props.maxLives) return ''
  const totalSeconds = Math.floor(nextTickRemainingMs.value / 1000)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})

// в компактном сердце уровень воды = доля оставшихся жизней: 30px — пусто, -6px — полно
const compactWaterStyle = computed(() => {
  const ratio = props.maxLives ? Math.min(1, props.lives / props.maxLives) : 0
  return { transform: `translateY(${30 - ratio * 36}px)`, transition: 'transform 0.4s ease' }
})

function getWaterGroupStyle(i) {
  // Уже полные сердечки
  if (i < props.lives) {
    return { transform: 'translateY(-6px)', transition: 'transform 0.4s ease' }
  }

  // Сердечко, которое наполняется прямо сейчас
  if (i === props.lives && props.lives < props.maxLives && props.regenIntervalMs > 0) {
    const elapsed = Math.max(0, now.value - (props.lastLifeAtMs || now.value))
    const progress = Math.min(100, (elapsed / props.regenIntervalMs) * 100)
    // 30px (пустое) -> -6px (полное), амплитуда 36px
    const yPos = 30 - (progress / 100) * 36

    return {
      transform: `translateY(${yPos}px)`,
      transition: 'transform 0.5s ease-out'
    }
  }

  // Пустые сердечки
  return { transform: 'translateY(30px)', transition: 'transform 0.4s ease' }
}
</script>

<style scoped>
.v-hearts-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.quest__hearts {
  display: flex;
  gap: 8px;
  align-items: center;
}

.quest__heart-wrapper {
  position: relative;
  width: 30px;
  height: 30px;
}

.quest__heart-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 1px rgba(0,0,0,0.1));
}

.heart-bg {
  fill: #e2e2e2;
  stroke: #ccc;
  stroke-width: 1px;
}

.water-group {
  will-change: transform;
}

.water-wave {
  fill: #ff4d4d;
  animation: wave-action 1.5s linear infinite;
}

.timer-countdown {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

@keyframes wave-action {
  0% { transform: translateX(0); }
  100% { transform: translateX(-32px); }
}

.lives-info {
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: 18px;
  gap: 6px;
}

.timer {
  width: 32px;
}

.max-status {
  color: #3d3c3c;
}

.v-hearts-compact {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px 4px 6px;
  border-radius: 20px;
  background: #fff6dc;
  border: 2px solid #5a3a1a;
  box-shadow: 0 3px 0 #5a3a1a;
  color: #5a3a1a;
  font-family: "Nunito", sans-serif;
}

.v-hearts-compact__heart {
  width: 28px;
  height: 26px;
  overflow: visible;
  filter: drop-shadow(0 2px 0 rgba(90, 58, 26, 0.35));
}

.v-hearts-compact__shine {
  fill: none;
  stroke: rgba(255, 255, 255, 0.8);
  stroke-width: 2.2;
  stroke-linecap: round;
}

.v-hearts-compact__count {
  font-size: 18px;
  font-weight: 900;
  line-height: 1;
}

.v-hearts-compact__timer {
  padding-inline-start: 6px;
  border-inline-start: 2px solid rgba(90, 58, 26, 0.25);
  font-size: 13px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 564px) {
  .timer-label {
    display: none;
  }
  .lives-info {
    font-size: 16px;
  }
}
</style>