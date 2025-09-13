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
                <li class="qd__item" v-for="quest in todayQuests" :key="quest.id">
                    <div class="qd__body">
                        <h4 class="qd__name">{{ quest.name }}</h4>
                        <div class="qd__barwrap">
                            <progress class="qd__progress" :value="cur(quest)" :max="max(quest)"></progress>
                            <span class="qd__barlabel">{{ cur(quest) }} / {{ max(quest) }}</span>
                        </div>
                    </div>
                    <div class="qd__chest" aria-hidden="true">
                        <img class="qd__icon" :src="getIconSrc(quest)" alt="">
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { userAuthStore } from "../../store/authStore.js";

const auth = userAuthStore()
import { dailyStore } from '../../store/dailyStore'
import NotCompleted from '../../assets/images/dailyIcons/dailyNotCompleted.svg'
import Completed from '../../assets/images/dailyIcons/dailyCompleted.svg'

const store = dailyStore()
const { todayQuests, msLeft } = storeToRefs(store)

onMounted(() => store.start())
onUnmounted(() => store.stop())

// This function now correctly returns the icon based on the individual quest's status
function getIconSrc(quest) {
    return quest.isCompleted ? Completed : NotCompleted;
}

function cur(q) {
    return Number(q.currentValue ?? 0)
}

function max(q) {
    return Math.max(1, Number(q.targetValue ?? 0))
}

function prettyMs(x) {
    const ms = typeof x === 'number' ? x : Number(x?.value ?? 0)
    const tot = Math.max(0, Math.floor(ms / 1000))
    const hour = Math.floor(tot / 3600)
    const min = Math.floor((tot % 3600) / 60)
    const s = tot % 60
    const pad = n => String(n).padStart(2, '0')
    return `${pad(hour)}:${pad(min)}:${pad(s)}`
}
</script>

<style scoped>

.qd__icon {
    width: 75px;
    height: 75px;
}

.qd {
    color: #e6edf3;
    font-family: "Nunito", sans-serif;
}

.timer__icon {
    width: 40px;
}

.daily {
    width: 100%;
    flex-grow: 1;
    border: 3px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    color: var(--titleColor);
    box-shadow: 2px 2px 0 var(--border);
    font-family: "Nunito", sans-serif;
    margin-bottom: 10px;
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
    color: var(--titleColor);
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
    box-shadow: 2px 2px 0 black;
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
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    background: #FFFFFF;
    border: 3px solid #273041;
    border-radius: 14px;
    padding: 0px 10px;
    box-shadow: 4px 4px 0 #273041;
}

.qd__body {
    gap: 8px;
    flex-grow: 1;
    min-width: 220px;
}

.qd__name {
    font-size: 13px;
    font-weight: 700;
    line-height: 1.25;
    color: black;
    margin-bottom: 10px;
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
    width: 90px;
    height: 90px;
    display: grid;
    place-items: center;
    font-size: 16px;
    color: #f6c64f;
}
</style>
