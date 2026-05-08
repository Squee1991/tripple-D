<template>
  <main class="ios-page">
    <header class="topic-switch ios-card">
      <button class="nav-arrow" @click="prevTopic">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="topic-title">
        {{ t(themesMap[selectedTopic]?.name) }}
      </div>
      <button class="nav-arrow" @click="nextTopic">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </header>
    <section class="summary-grid">
      <div class="summary-box">
        <div class="label">{{ t('thematicStatistics.modules') }}</div>
        <div class="value">{{ totalModules }}</div>
      </div>
      <div class="summary-box">
        <div class="label">{{ t('thematicStatistics.done') }}</div>
        <div class="value">{{ totalCompleted }}</div>
      </div>
      <div class="summary-box summary-box--wide">
        <div class="label-row">
          <span class="label">{{ t('thematicStatistics.progress') }}</span>
          <span class="value-small">{{ Math.round(overallPercent) }}%</span>
        </div>
        <div class="ios-progress">
          <div class="ios-progress-fill" :style="{ width: clampPercent(overallPercent) + '%' }"/>
        </div>
      </div>
    </section>
    <section class="legend ios-card">
      <div class="legend-item">
        <span class="dot done"></span>
        <span>{{ t('thematicStatistics.done') }}</span>
      </div>
      <div class="legend-item">
        <span class="dot current"></span>
        <span>{{ t('thematicStatistics.available') }}</span>
      </div>
      <div class="legend-item">
        <span class="dot locked"></span>
        <span>{{ t('thematicStatistics.closed') }}</span>
      </div>
    </section>
    <section class="levels" v-if="levels.length">
      <div v-for="lvl in levels" :key="lvl.level" class="level-card ios-card">
        <header class="level-head">
          <div class="level-title">{{ t('thematicStatistics.level') }} {{ lvl.level }}</div>
          <div class="level-sub">{{ lvl.completed }} / {{ lvl.total }}</div>
        </header>
        <div class="progress-wrap">
          <div class="ios-progress">
            <div class="ios-progress-fill" :style="{ width: clampPercent(lvl.percent) + '%' }"/>
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
            <span class="name">{{ m.title || t('thematicStatistics.module') + ' ' + m.id }}</span>
          </button>
        </div>
      </div>
    </section>
    <section v-else class="empty-state">
      <p>{{ t('thematicStatistics.noData') }}</p>
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

async function openModule(level, id) {}
</script>

<style scoped>
/* БАЗОВЫЙ LAYOUT */
.ios-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: "Nunito", sans-serif;
}

/* ОБЩИЕ СТИЛИ КАРТОЧЕК */
.ios-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

/* ПЕРЕКЛЮЧАТЕЛЬ ТОПИКОВ */
.topic-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-arrow {
  background: #F0F2F5;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.topic-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1E1E1E;
  text-align: center;
  flex: 1;
}

/* СВОДКА (SUMMARY) */
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.summary-box {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.summary-box--wide {
  grid-column: 1 / -1;
}
.label {
  font-size: 0.85rem;
  color: #6B7280;
  font-weight: 600;
  margin-bottom: 4px;
}
.value {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1E1E1E;
}
.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.value-small {
  font-weight: 800;
  color: #1E1E1E;
  font-size: 1rem;
}

/* ПРОГРЕСС БАРЫ */
.ios-progress {
  height: 12px;
  background: #F3F4F6;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  flex: 1;
}
.ios-progress-fill {
  height: 100%;
  background: #4ADE80;
  border-radius: 10px;
  transition: width 0.4s ease;
}

/* ЛЕГЕНДА */
.legend {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 20px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4B5563;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.done { background: #4ADE80; }
.dot.current { background: #FBBF24; }
.dot.locked { background: #E5E7EB; }

/* УРОВНИ И МОДУЛИ */
.levels {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.level-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.level-title {
  font-weight: 800;
  font-size: 1.15rem;
  color: #1E1E1E;
}
.level-sub {
  font-size: 0.85rem;
  color: #6B7280;
  font-weight: 600;
}
.progress-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.percent {
  font-size: 0.85rem;
  font-weight: 700;
  color: #6B7280;
  width: 36px;
  text-align: right;
}

/* КНОПКИ МОДУЛЕЙ */
.modules {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}
.module-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  border-radius: 16px;
  padding: 8px 12px;
  transition: transform 0.2s ease, opacity 0.2s ease;
  text-align: left;
}
.module-pill .id {
  font-weight: 800;
  font-size: 0.9rem;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.module-pill .name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1E1E1E;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Состояния модулей (Мягкие цвета) */
.module-pill.done {
  background: #F0FDF4; /* Светло-зеленый фон */
}
.module-pill.done .id {
  background: #4ADE80;
  color: #FFFFFF;
}

.module-pill.current {
  background: #FFFBEB; /* Светло-желтый фон */
  cursor: pointer;
}
.module-pill.current .id {
  background: #FBBF24;
  color: #FFFFFF;
}

.module-pill.locked {
  background: #F9FAFB;
  opacity: 0.7;
}
.module-pill.locked .id {
  background: #E5E7EB;
  color: #9CA3AF;
}
.module-pill.locked .name {
  color: #9CA3AF;
}

@media (hover: hover) {
  .module-pill:not(.locked):hover {
    transform: scale(1.02);
  }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9CA3AF;
  font-weight: 600;
  background: #FFFFFF;
  border-radius: 20px;
}
</style>