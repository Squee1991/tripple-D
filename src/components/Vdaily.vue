<template>
    <div class="daily">
        <section class="qd">
            <header class="qd__header">
                <h3 class="qd__title">Ежедневные задания</h3>
                <div class="qd__right">
                    <img class="timer__icon" src="../../assets/images/dailyIcons/timer.svg" alt="Timer_daily">
                    <span class="qd__timer">{{ prettyMs(msLeft) }}</span>
                </div>
            </header>

            <ul class="qd__list">
                <li class="qd__item" v-for="(q,i) in todayQuests" :key="q.id">
                    <div class="qd__icon" :data-idx="i">{{ icon(i) }}</div>

                    <div class="qd__body">
                        <h4 class="qd__name">{{ q.name }}</h4>

                        <div class="qd__barwrap">
                            <progress class="qd__progress" :value="cur(q)" :max="max(q)"></progress>
                            <span class="qd__barlabel">{{ cur(q) }} / {{ max(q) }}</span>
                        </div>
                    </div>
                    <div class="qd__chest" aria-hidden="true">🧰</div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup>
import {onMounted, onUnmounted} from 'vue'
import {storeToRefs} from 'pinia'
import {dailyStore} from '../../store/dailyStore'

const store = dailyStore()                         // один стор
const {todayQuests, msLeft} = storeToRefs(store) // реактивные refs

onMounted(() => store.start())
onUnmounted(() => store.stop())

function cur(q) {
    const raw = Number(q.currentValue ?? 0)
    return Math.min(Math.max(0, raw), max(q))
}

function max(q) {
    const n = Number(q.targetValue ?? 0)
    return Number.isFinite(n) && n > 0 ? n : 1
}

function prettyMs(x) {
    const ms = typeof x === 'number' ? x : Number(x?.value ?? 0)
    const tot = Math.max(0, Math.floor(ms / 1000))
    const h = Math.floor(tot / 3600)
    const m = Math.floor((tot % 3600) / 60)
    const s = tot % 60
    const pad = n => String(n).padStart(2, '0')
    return `${pad(h)}:${pad(m)}:${pad(s)}`
}

function icon(i) {
    const arr = ['⚡', '⏱️', '🎯', '📚', '🔊', '🧩', '📝', '🧠']
    return arr[i % arr.length]
}
</script>

<style scoped>

.qd {
    padding: 10px;
    color: #e6edf3;
    font-family: "Nunito", sans-serif;
}

.timer__icon {
    width: 40px;
}

.daily {
    width: 100%;
    flex-grow: 1;
    border: 3px solid #22272e;
    border-radius: 16px;
    padding: 16px;
    color: #e6edf3;
    background: #a855f7;
    box-shadow: 4px 4px 0 black;
    font-family: "Nunito", sans-serif;

}

.qd__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.qd__title {
    font-size: 22px;
    font-weight: 800;
    font-family: "Nunito", sans-serif;
    color: black;
}

.qd__right {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #9aa6b2;
}

.qd__timer {
    font-variant-numeric: tabular-nums;
    padding: 3px 8px;
    border-radius: 8px;
    background: #42ab1a;
    border: 3px solid #2b3240;
    box-shadow: 4px 4px 0 black;
    color: white;
    font-size: 16px;
    font-weight: 600;
}

.qd__list {
    gap: 15px;
    display: flex;
    flex-direction: column;
}

.qd__item {
    display: grid;
    grid-template-columns: 42px 1fr 28px;
    gap: 12px;
    align-items: center;
    background: #FFFFFF;
    border: 3px solid #273041;
    border-radius: 14px;
    padding: 12px;
    box-shadow: 4px 4px 0 #273041;
}

.qd__icon {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 20px;
    font-weight: 700;
    background: #142233;
    border: 1px solid #2a3a52;
}


.qd__body {
    display: grid;
    gap: 8px;
}

.qd__name {
    font-size: 15px;
    font-weight: 700;
    line-height: 1.25;
    color: black;
}


.qd__barwrap {
    position: relative;
}

.qd__barlabel {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 800;
    color: #c9d4df;
    pointer-events: none;
}

.qd__timer-label {
    color: white;
}

.qd__progress {
    width: 100%;
    height: 18px;
    border: 1px solid #2a3444;
    border-radius: 10px;
    background: #222b38;
    overflow: hidden;
    -webkit-appearance: none;
    appearance: none;
}

.qd__progress::-webkit-progress-bar {
    background: #222b38;
}

.qd__progress::-webkit-progress-value {

    background: linear-gradient(90deg, #42b9ff 0%, #3ed2a6 100%);
    transition: width .25s ease;
}

.qd__progress::-moz-progress-bar {
    background: linear-gradient(90deg, #42b9ff 0%, #3ed2a6 100%);
}

.qd__chest {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    font-size: 16px;
    color: #f6c64f;
    background: #1a2230;
    border: 1px solid #2b3240;
    border-radius: 6px;
}
</style>
