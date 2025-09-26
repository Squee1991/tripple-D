<template>
  <Teleport to="body">
    <div class="ach-toast-container" aria-live="polite" aria-atomic="true">
      <transition name="ach-toast">
        <div
            v-if="ach.showPopup && ach.popupAchievement"
            class="ach-toast-card"
            role="status"
            @mouseenter="pause()"
            @mouseleave="resume()"
        >
          <button class="ach-toast-close" @click="forceClose()" aria-label="Закрыть">×</button>
          <div class="ach-toast-icon">
            <img
                v-if="achIcon?.type === 'img'"
                :src="achIcon.src"
                alt=""
                class="ach-toast-icon-img"
                decoding="async"
            />
            <span v-else class="ach-toast-icon-emoji">{{ achIcon?.text }}</span>
          </div>
          <div class="ach-toast-body">
            <div class="ach-toast-msg">
              {{ t('Получено достижение!') }}
            </div>
            <div class="ach-toast-title">
              {{ t(resolveTitle(ach.popupAchievement)) }}
            </div>
            <div v-if="ach.popupAchievement?.groupTitle" class="ach-toast-sub">
              {{ t(ach.popupAchievement.groupTitle) }}
            </div>
            <div class="ach-toast-timer">
              <div class="ach-toast-timer__bar" :style="{ width: timerPct + '%' }"></div>
            </div>
          </div>
        </div>
      </transition>
      <transition name="ach-toast">
        <div
            v-if="awardVisible"
            class="ach-toast-card ach-toast-card--award"
            role="status"
            @mouseenter="pauseAward()"
            @mouseleave="resumeAward()"
        >
          <button class="ach-toast-close" @click="awardVisible = false" aria-label="Закрыть">×</button>
          <div class="ach-toast-icon">🎖️</div>
          <div class="ach-toast-body">
            <div class="ach-toast-msg">
              {{ t('Вы получили новую награду!') }}
            </div>
            <div class="ach-toast-title">
              {{ t(awardTitle) || 'Награда' }}
            </div>

            <div class="ach-toast-timer">
              <div class="ach-toast-timer__bar" :style="{ width: awardTimerPct + '%' }"></div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </Teleport>
</template>

<script setup>
import {computed, ref, watch, onMounted, onBeforeUnmount} from 'vue'
import {useAchievementStore} from '../../store/achievementStore.js'

const {t} = useI18n()
const ach = useAchievementStore()

function isImageUrl(v) {
  if (typeof v !== 'string') return false
  return /^https?:\/\//i.test(v) && /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/i.test(v)
}

const achIcon = computed(() => {
  const raw = ach.popupAchievement?.icon
  if (!raw) return {type: 'text', text: '🏆'}
  if (isImageUrl(raw)) return {type: 'img', src: raw}
  return {type: 'text', text: raw}
})

const AUTO_CLOSE_MS = 11116000
let raf = null
const remaining = ref(AUTO_CLOSE_MS)
let lastTick = 0
const running = ref(false)

const hasProgress = computed(() => {
  const a = ach.popupAchievement
  if (!a) return false
  const cur = Number(a.currentProgress ?? 0)
  const target = Number(a.targetProgress ?? 0)
  return target > 0 && cur > 0
})

const progressPct = computed(() => {
  const a = ach.popupAchievement
  if (!a) return 0
  const cur = Number(a.currentProgress ?? 0)
  const target = Math.max(1, Number(a.targetProgress ?? 1))
  return Math.min(100, Math.round((cur / target) * 100))
})

const timerPct = computed(() => {
  const passed = Math.max(0, AUTO_CLOSE_MS - Math.max(0, remaining.value))
  return Math.min(100, (passed / AUTO_CLOSE_MS) * 100)
})

function startTimer() {
  clearTimer()
  remaining.value = AUTO_CLOSE_MS
  lastTick = performance.now()
  running.value = true
  raf = requestAnimationFrame(tick)
}

function tick(ts) {
  const delta = ts - lastTick
  lastTick = ts
  remaining.value -= delta
  if (remaining.value <= 0) {
    forceClose()
  } else {
    raf = requestAnimationFrame(tick)
  }
}

function pause() {
  if (!running.value) return
  running.value = false
  if (raf) cancelAnimationFrame(raf)
  raf = null
}

function resume() {
  if (running.value || !ach.showPopup) return
  running.value = true
  lastTick = performance.now()
  raf = requestAnimationFrame(tick)
}

function clearTimer() {
  if (raf) cancelAnimationFrame(raf)
  raf = null
  running.value = false
}

function forceClose() {
  clearTimer()
  ach.closePopup()
}

function resolveTitle(a) {
  return a?.title || a?.name || a?.id || null
}

const awardVisible = ref(false)
const awardTitle = ref('')
const AWARD_AUTO_CLOSE_MS = 1200000
const awardRemaining = ref(AWARD_AUTO_CLOSE_MS)
let awardLastTick = 0
let awardRAF = null
const awardRunning = ref(false)

const awardTimerPct = computed(() => {
  const passed = Math.max(0, AWARD_AUTO_CLOSE_MS - Math.max(0, awardRemaining.value))
  return Math.min(100, (passed / AWARD_AUTO_CLOSE_MS) * 100)
})

function openAward(title) {
  awardTitle.value = title || 'Награда'
  awardVisible.value = true
  startAwardTimer()
}

function startAwardTimer() {
  clearAwardTimer()
  awardRemaining.value = AWARD_AUTO_CLOSE_MS
  awardLastTick = performance.now()
  awardRunning.value = true
  awardRAF = requestAnimationFrame(awardTick)
}

function awardTick(ts) {
  const d = ts - awardLastTick
  awardLastTick = ts
  awardRemaining.value -= d
  if (awardRemaining.value <= 0) {
    awardVisible.value = false
    clearAwardTimer()
  } else {
    awardRAF = requestAnimationFrame(awardTick)
  }
}

function pauseAward() {
  if (!awardRunning.value) return
  awardRunning.value = false
  if (awardRAF) cancelAnimationFrame(awardRAF)
  awardRAF = null
}

function resumeAward() {
  if (awardRunning.value || !awardVisible.value) return
  awardRunning.value = true
  awardLastTick = performance.now()
  awardRAF = requestAnimationFrame(awardTick)
}

function clearAwardTimer() {
  if (awardRAF) cancelAnimationFrame(awardRAF)
  awardRAF = null
  awardRunning.value = false
}

watch(() => ach.showPopup, v => (v ? startTimer() : clearTimer()), {immediate: true})
watch(() => ach.lastUnlockedAward, aw => {
  if (aw?.title) openAward(aw.title)
}, {immediate: true, deep: true})

onMounted(() => {
  if (ach.showPopup) startTimer()
})
onBeforeUnmount(() => {
  clearTimer();
  clearAwardTimer()
})
</script>

<style scoped>
.ach-toast-container {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.ach-toast-card {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 350px;
  max-width: 100%;
  background: rgba(20, 20, 20, 0.92);
  color: #fff;
  border-radius: 14px;
  padding: 14px 16px 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35), inset 0 0 0 1px rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}

.ach-toast-card--award {
  background: linear-gradient(135deg, rgba(35, 28, 10, 0.95), rgba(60, 44, 16, 0.95));
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 215, 128, 0.25);
}

.ach-toast-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  background: gray;
  width: 60px;
  height: 60px;
  border-radius: 10px;
  border: 2px solid white;
}

.ach-toast-icon-img {
  width: 50px;
  height: 50px;

}

.ach-toast-icon-emoji {
  font-size: 28px;
  line-height: 1;
}

.ach-toast-body {
  display: flex;
  flex-direction: column;
}

.ach-toast-title {
  font-weight: 500;
  font-size: 14px;
  margin-top: 5px;
}

.ach-toast-sub {
  opacity: 0.8;
  font-size: 12px;
}

.ach-toast-msg {
  font-size: 17px;
  font-weight: bold;
  color: #a8a5a5;
}

.ach-toast-close {
  position: absolute;
  top: 8px;
  right: 10px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.7;
}

.ach-toast-close:hover {
  opacity: 1;
}

.ach-toast-timer {
  margin-top: 10px;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
}

.ach-toast-timer__bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #16a34a, #22c55e, #86efac);
  transition: width 100ms linear;
  border-radius: 999px;
}

.ach-toast-enter-active {
  animation: bounce-in 0.5s;
}
.ach-toast-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.10);
  }
  100% {
    transform: scale(1);
  }
}
</style>
