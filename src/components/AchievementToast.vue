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
                    <div class="sparkles"></div>
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
                    <div class="sparkles"></div>
                    <button class="ach-toast-close" @click="awardVisible = false" aria-label="Закрыть">×</button>
                    <div class="ach-toast-icon">
                        <span class="ach-toast-icon-emoji">🎖️</span>
                    </div>
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
/* --- КОНТЕЙНЕР --- */
.ach-toast-container {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 16px;
    pointer-events: none;
}

/* --- ОСНОВНАЯ КАРТОЧКА --- */
.ach-toast-card {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 380px;
    max-width: 100%;
    background: radial-gradient(circle at top left, rgba(60, 68, 83, 0.9), rgba(22, 25, 33, 0.9));
    backdrop-filter: blur(8px);
    color: #fff;
    border-radius: 16px;
    padding: 16px 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.15);
}

/* --- ОСОБЫЙ СТИЛЬ ДЛЯ НАГРАД --- */
.ach-toast-card--award {
    background: radial-gradient(circle at top left, rgba(147, 103, 3, 0.9), rgba(54, 38, 0, 0.9));
    border-color: rgba(255, 215, 0, 0.5);
    box-shadow: 0 10px 40px rgba(255, 190, 0, 0.25), inset 0 0 0 1px rgba(255, 215, 0, 0.3);
}

/* --- ИКОНКА --- */
.ach-toast-icon {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: icon-pop-in 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0.2s;
    /* Убрали фон и рамку, добавили тень для объема */
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

.ach-toast-icon-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.ach-toast-icon-emoji {
    font-size: 52px;
    line-height: 1;
}

/* --- ТЕЛО УВЕДОМЛЕНИЯ --- */
.ach-toast-body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 2px;
    padding-right: 32px;
}

.ach-toast-msg {
    font-size: 14px;
    font-weight: 500;
    color: #b0b8c5; /* Менее контрастный цвет */
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.ach-toast-title {
    font-weight: 700; /* Жирнее */
    font-size: 18px; /* Крупнее */
    line-height: 1.2;
    color: #ffffff;
}

.ach-toast-sub {
    opacity: 0.7;
    font-size: 13px;
    color: #a0a8b5;
}

/* --- КРЕСТИК ЗАКРЫТИЯ --- */
.ach-toast-close {
    position: absolute;
    top: 10px;
    right: 12px;
    border: none;
    background: transparent;
    color: #fff;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s, transform 0.2s;
}

.ach-toast-close:hover {
    opacity: 1;
    transform: scale(1.1);
}

/* --- ТАЙМЕР --- */
.ach-toast-timer {
    margin-top: 12px;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    overflow: hidden;
    box-shadow: none;
}

.ach-toast-timer__bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #4ade80, #22c55e, #16a34a);
    transition: width 100ms linear;
    border-radius: 999px;
}

.ach-toast-card--award .ach-toast-timer__bar {
    background: linear-gradient(90deg, #fde047, #facc15, #eab308);
}

/* --- АНИМАЦИИ --- */
.ach-toast-enter-active,
.ach-toast-leave-active {
    transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.ach-toast-enter-from,
.ach-toast-leave-to {
    opacity: 0;
    transform: translateY(-50px) scale(0.8);
}

/* Анимация "впрыгивания" иконки */
@keyframes icon-pop-in {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }
    60% {
        transform: scale(1.1);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

/* Эффект сияния и частиц (псевдо-элемент) */
.sparkles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
}

.sparkles::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 250%;
    padding-bottom: 250%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 40%);
    animation: shine 1.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    transform: translate(-50%, -50%) scale(0);
}

.ach-toast-card--award .sparkles::before {
    background: radial-gradient(circle, rgba(255, 220, 100, 0.4) 0%, rgba(255, 215, 0, 0) 50%);
}

@keyframes shine {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
    }
    80% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0;
    }
}
</style>
