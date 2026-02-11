<template>
  <div class="daily">
    <section class="qd" v-if="ready && todayQuests.length">
      <header class="qd__header">
        <h3 class="qd__title">{{ t('dailyPanel.title')}}</h3>
        <div class="qd__right">
          <img class="timer__icon" src="../../assets/images/dailyIcons/timer.svg" alt="Timer_daily"/>
          <span class="qd__timer">{{ prettyMs(msLeft) }}</span>
        </div>
      </header>
      <ul class="qd__list">
        <li class="qd__item" v-for="(quest, index) in todayQuests" :key="index">
          <div class="qd__body">
            <h4 class="qd__name">{{ t(quest.title) }}</h4>
            <div class="qd__barwrap">
              <progress class="qd__progress" :value="quest.currentValue" :max="quest.targetValue"></progress>
              <span class="qd__barlabel">{{ quest.currentValue }} / {{ quest.targetValue }}</span>
            </div>
          </div>
          <div class="qd__chest">
            <img class="qd__icon" :src="getIconSrc(quest)" alt=""/>
          </div>
        </li>
      </ul>
    </section>
    <section v-else class="qd">
      <div class="qd__header">
        <h3 class="qd__title">{{ t('dailyPanel.title')}}</h3>
        <div class="qd__right">
          <img class="timer__icon" src="../../assets/images/dailyIcons/timer.svg" alt="Timer_daily"/>
          <span class="qd__timer">--:--:--</span>
        </div>
      </div>
      <p class="loading">{{ t('dailyPanel.loading')}}</p>
    </section>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue'
import {storeToRefs} from 'pinia'
import {dailyStore} from '../../store/dailyStore.js'
import NotCompleted from '../../assets/images/dailyIcons/dailyNotCompleted.svg'
import Completed from '../../assets/images/dailyIcons/dailyCompleted.svg'

const { t } = useI18n()
const store = dailyStore()
const {todayQuests, msLeft} = storeToRefs(store)

const ready = ref(false)

onMounted(async () => {
  store.start()
  store.startAutoSync()
  ready.value = true
})
onUnmounted(() => {
  store.stopAutoSync();
  store.stop()
})


function getIconSrc(q) {
  return q?.isCompleted ? Completed : NotCompleted
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


onMounted(() => {
  store.init()
})

onUnmounted(() => {
  store.stopAutoSync()
  store.stop()
})

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
  margin-bottom: 10px;
}

.qd__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.qd__title {
  font-size: 22px;
  font-weight: 800;
  color: var(--panelTextColor);
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
  background: var(--timerbg);
  border: 3px solid #2b3240;
  box-shadow: 2px 2px 0 #000;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
}

.qd__list {
  gap: 10px;
  display: flex;
  flex-direction: column;
}

.qd__item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  background: #fff;
  border: 2px solid var(--border);
  border-radius: 14px;
  padding: 0 10px;
  box-shadow: 2px 2px 0 var(--border);
  position: relative;
  z-index: 1;
}

.qd__body {
  gap: 8px;
  flex-grow: 1;
  width: 250px;
}

.qd__name {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.25;
  color: var(--labelTextColor);
  margin-bottom: 10px;
}

.qd__barwrap {
  position: relative;
}

.qd__barlabel {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  color: #c9d4df;
  pointer-events: none;
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
  background: transparent;
  border: 0;
  cursor: pointer;
}

.loading {
  color: #9aa6b2;
  padding: 12px 0;
}
</style>
