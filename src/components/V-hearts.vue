<template>
  <div class="v-hearts-wrapper">
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
  regenIntervalMs: { type: Number, default: 0 },
  showTimer: { type: Boolean, default: false }
})

const uniqueId = useId().replace(/:/g, '-')

const now = ref(Date.now())
let rafId = null

function updateTimer() {
  now.value = Date.now()
  rafId = requestAnimationFrame(updateTimer)
}

function startTimer() {
  if (!rafId) updateTimer()
}

function stopTimer() {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

onMounted(() => startTimer())
onBeforeUnmount(() => stopTimer())
onActivated(() => startTimer())
onDeactivated(() => stopTimer())

const recoveryTimerText = computed(() => {
  if (props.lives >= props.maxLives) return ""
  const lastLife = props.lastLifeAtMs || now.value
  const elapsed = now.value - lastLife
  const nextTickIn = props.regenIntervalMs - (elapsed % props.regenIntervalMs)
  const totalSeconds = Math.floor(nextTickIn / 1000)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})


function getWaterGroupStyle(i) {
  if (i < props.lives) {
    return { transform: 'translateY(-6px)', transition: 'transform 0.3s ease-in-out' }
  }
  if (i === props.lives && props.lives < props.maxLives && props.lastLifeAtMs > 0 && props.regenIntervalMs > 0) {
    const elapsed = Math.max(0, now.value - props.lastLifeAtMs)
    const progress = Math.min(100, (elapsed / props.regenIntervalMs) * 100)
    const yPos = 30 - (progress / 100) * 36;
    return {
      transform: `translateY(${yPos}px)`,
      transition: 'none'
    }
  }
  return { transform: 'translateY(30px)', transition: 'transform 0.3s ease-in-out' }
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

@media (max-width: 564px) {
  .timer-label {
    display: none;
  }
  .lives-info {
    font-size: 16px;
  }
}
</style>