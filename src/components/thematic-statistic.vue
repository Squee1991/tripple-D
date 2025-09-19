<template>
  <main class="stats-page">
    <header class="stats-header">
      <div class="panel__top">
        <h1 class="panel__title">{{ t('thematicStatistics.title')}}</h1>
      </div>
      <div class="topic-switch">
        <button class="nav" @click="prevTopic">
          <img src="../../assets/images/arrow-prew.svg" alt="prevArrow"/>
        </button>
        <div class="chip__theme">
          {{ t(themesMap[selectedTopic]?.name) }}
        </div>
        <button class="nav" @click="nextTopic">
          <img src="../../assets/images/arrow-next.svg" alt="nextArrow"/>
        </button>
      </div>
    </header>
    <section class="summary">
      <div class="card">
        <div class="label">{{ t('thematicStatistics.modules')}}</div>
        <div class="value">{{ totalModules }}</div>
      </div>
      <div class="card">
        <div class="label">{{ t('thematicStatistics.done')}}</div>
        <div class="value">{{ totalCompleted }}</div>
      </div>
      <div class="card">
        <div class="label">{{ t('thematicStatistics.progress')}}</div>
        <div class="value">{{ Math.round(overallPercent) }}%</div>
        <div class="bar">
          <div class="fill" :style="{ width: clampPercent(overallPercent) + '%' }"/>
        </div>
      </div>
      <div class="legend card">
        <span class="dot done"></span>
        <span>{{ t('thematicStatistics.done')}}</span>
        <span class="dot current"></span>
        <span>{{ t('thematicStatistics.available')}}</span>
        <span class="dot locked"></span>
        <span>{{ t('thematicStatistics.closed')}}</span>
      </div>
    </section>
    <section class="levels" v-if="levels.length">
      <div v-for="lvl in levels" :key="lvl.level" class="level-card">
        <header class="level-head">
          <div class="level-title">{{ t('thematicStatistics.level')}} {{ lvl.level }}</div>
          <div class="level-sub">{{ lvl.completed }} / {{ lvl.total }}</div>
        </header>
        <div class="progress">
          <div class="bar">
            <div class="fill" :style="{ width: clampPercent(lvl.percent) + '%' }"/>
          </div>
          <div class="percent">{{ Math.round(lvl.percent) }}%</div>
        </div>
        <div class="modules">
          <button
              v-for="m in lvl.modules"
              :key="m.id"
              class="module-pill"
              :class="m.state"
              @click="openModule(lvl.level, m.id)"
              :title="pillTitle(lvl.level, m)"
          >
            <span class="id">{{ m.id }}</span>
            <span class="name">{{ m.title || t('thematicStatistics.module') + m.id }}</span>
          </button>
        </div>
      </div>
    </section>
    <section v-else class="empty">
      <p>{{t('thematicStatistics.noData')}}</p>
    </section>
  </main>
</template>

<script setup>
import {computed, onMounted, ref, watchEffect} from 'vue'
import {storeToRefs} from 'pinia'
import {useI18n} from 'vue-i18n'
import {useTrainerStore} from '../../store/themenProgressStore.js'

import HomeImg from '../../assets/images/house.svg'
import Clothes from '../../assets/images/clothes.svg'
import Health from '../../assets/images/health.svg'
import Food from '../../assets/images/food.svg'
import Transport from '../../assets/images/Transport.svg'
import Weather from '../../assets/images/weather.svg'
import Purchase from '../../assets/images/buy.svg'
import Family from '../../assets/images/family.svg'
import School from '../../assets/images/school.svg'
import Travel from '../../assets/images/travel.svg'
import Clock from '../../assets/images/clock.svg'

const {t} = useI18n()
const trainer = useTrainerStore()
const {topic, jsonData, completedModules} = storeToRefs(trainer)

const isMobile = ref(false)
onMounted(() => {
  const handler = () => (isMobile.value = window.innerWidth <= 767)
  handler()
  window.addEventListener('resize', handler)
})

/** Темы */
const themes = [
  {key: 'house', name: 'chooseThemeList.home', img: HomeImg},
  {key: 'zeit', name: 'chooseThemeList.time', img: Clock},
  {key: 'family', name: 'chooseThemeList.family', img: Family},
  {key: 'food', name: 'chooseThemeList.food', img: Food},
  {key: 'purchases', name: 'chooseThemeList.purchases', img: Purchase},
  {key: 'health', name: 'chooseThemeList.health', img: Health},
  {key: 'weather', name: 'chooseThemeList.weather', img: Weather},
  {key: 'clothes', name: 'chooseThemeList.clothes', img: Clothes},
  {key: 'transport', name: 'chooseThemeList.transport', img: Transport},
  {key: 'school', name: 'chooseThemeList.school', img: School},
  {key: 'travel', name: 'chooseThemeList.travel', img: Travel},
]
const themesMap = Object.fromEntries(themes.map(x => [x.key, x]))
const themeKeys = themes.map(x => x.key)

const selectedTopic = ref(topic.value || themeKeys[0])

function syncTopic(key) {
  selectedTopic.value = key
  topic.value = key
}

function prevTopic() {
  const i = themeKeys.indexOf(selectedTopic.value)
  syncTopic(themeKeys[(i - 1 + themeKeys.length) % themeKeys.length])
  reload()
}

function nextTopic() {
  const i = themeKeys.indexOf(selectedTopic.value)
  syncTopic(themeKeys[(i + 1) % themeKeys.length])
  reload()
}

const loading = ref(false)

async function reload() {
  loading.value = true
  try {
    await trainer.loadProgress()
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!topic.value) syncTopic(selectedTopic.value)
  await reload()
})

watchEffect(async () => {
  if (topic.value && !jsonData.value) {
    try {
      const res = await fetch(`/${topic.value}.json`)
      if (res.ok) jsonData.value = await res.json()
    } catch (e) {
      console.warn('Не удалось загрузить JSON темы', e)
    }
  }
})

const complSet = computed(() => new Set(completedModules.value.map(m => `${m.level}:${m.id}`)))
const totalCompleted = computed(() => completedModules.value.length)

const levels = computed(() => {
  const out = []
  const levelsArr = jsonData.value?.levels || []
  for (const lvl of levelsArr) {
    const mods = Array.isArray(lvl.modules) ? lvl.modules : []
    const richMods = mods.map((m, i) => {
      const id = m.id ?? i + 1
      const key = `${lvl.level}:${id}`
      const done = complSet.value.has(key)
      const available = id === 1 || complSet.value.has(`${lvl.level}:${id - 1}`)
      const state = done ? 'done' : (available ? 'current' : 'locked')
      return {id, title: m.title || m.name, state}
    })
    const total = richMods.length
    const completed = richMods.filter(m => m.state === 'done').length
    const percent = total ? (completed / total) * 100 : 0
    out.push({level: lvl.level, total, completed, percent, modules: richMods})
  }

  if (!out.length && completedModules.value.length) {
    const byLevel = new Map()
    for (const {level, id} of completedModules.value) {
      const list = byLevel.get(level) || []
      list.push({id, title: null, state: 'done'})
      byLevel.set(level, list)
    }
    for (const [level, mods] of byLevel.entries()) {
      const total = mods.length
      out.push({level, total, completed: total, percent: 100, modules: mods})
    }
  }

  out.sort((a, b) => Number(a.level) - Number(b.level))
  return out
})

const totalModules = computed(() => levels.value.reduce((s, l) => s + l.total, 0))
const overallPercent = computed(() => {
  const t = totalModules.value
  if (!t) return 0
  const c = levels.value.reduce((s, l) => s + l.completed, 0)
  return (c / t) * 100
})

function clampPercent(p) {
  if (Number.isNaN(p)) return 0;
  return Math.max(0, Math.min(100, p))
}

function pillTitle(level, m) {
  if (m.state === 'done') return `Level ${level} — «${m.title || 'Module ' + m.id}»: done`
  if (m.state === 'current') return `Level ${level} — «${m.title || 'Module ' + m.id}»: available`
  return `level ${level} — «${m.title || 'Module ' + m.id}»: closed`
}

async function openModule(level, id) {

}
</script>

<style scoped>
:root {
  --bg: #f6f3ee;
  --ink: #0f172a;
  --muted: #6b7280;
  --card: #ffffff;
  --border: #e5e7eb;
}

.stats-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 12px;
}

.panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel__title {
  font-size: 24px;
  margin: 0;
}

.btn {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #fff;
  cursor: pointer;
}

.btn[disabled] {
  opacity: .6;
  cursor: default;
}

.btn--ghost {
  padding: 6px 12px;
  border: 1px solid var(--border);
  background: #f8fafc;
  border-radius: 10px;
}

.topic-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav {
  width: 38px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid var(--border);
  background: #111827;
  color: #fff;
  border-radius: 8px;
}

.chip__theme {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: #4ade80;
  font-weight: 900;
  min-width: 220px;
  text-align: center;
}

/* Сводка */
.summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 12px 0;
}

.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card .label {
  font-size: 12px;
  color: var(--muted);
}

.card .value {
  font-size: 26px;
  font-weight: 800;
}

.bar {
  height: 10px;
  background: #eef2f7;
  border-radius: 999px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #84cc16);
  width: 0;
  transition: width .35s ease;
}

.legend {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-direction: row;
  justify-content: center;
  font-size: 14px;
}

.legend .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
}

.legend .done {
  background: #22c55e;
}

.legend .current {
  background: #f59e0b;
}

.legend .locked {
  background: #cbd5e1;
}

.levels {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.level-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px;
}

.level-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.level-title {
  font-weight: 800;
}

.level-sub {
  font-size: 12px;
  color: var(--muted);
}

.progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.percent {
  font-size: 12px;
  color: var(--muted);
  width: 40px;
  text-align: right;
}

/* Модули */
.modules {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.module-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px dashed var(--border);
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  cursor: default;
  transition: all .2s ease;
  text-align: left;
}

.module-pill .id {
  font-weight: 800;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
}

.module-pill .name {
  font-size: 14px;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.module-pill.done {
  border-style: solid;
  border-color: #22c55e33;
  background: #f0fdf4;
}

.module-pill.done .id {
  background: #22c55e;
  color: #052e16;
}

.module-pill.current {
  border-style: solid;
  border-color: #f59e0b33;
  background: #fffbeb;
}

.module-pill.current .id {
  background: #f59e0b;
  color: #3b1f03;
}

.module-pill.locked {
  opacity: .55;
}

.module-pill.locked .id {
  background: #cbd5e1;
  color: #334155;
}

.module-pill:not(.locked) {
  cursor: pointer;
}

.module-pill:not(.locked):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(2, 6, 23, .06);
}

.empty {
  color: var(--muted);
  text-align: center;
  padding: 32px 0;
}

@media (max-width: 980px) {
  .summary {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width:1023px) {
  .legend {
    flex-direction: column;
  }
}

</style>
