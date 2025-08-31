<template>
  <div class="statistics">
    <div class="stats__wrapper">
      <div class="stats__header">
        <img src="../../assets/images/statsIcon/diagram.svg" alt="Stats icon" class="stats__icon">
        <h1 class="stats__title">Статистика</h1>
      </div>
      <div class="toggle">
        <div class="view-toggle" :class="{ 'view-toggle--lands': viewMode === 'lands' }">
          <div class="view-toggle__inner" role="tablist" aria-label="Переключение разделов статистики">
            <div class="view-toggle__slider" aria-hidden="true"></div>
            <button
                :class="['view-toggle__btn', { 'is-active': viewMode === 'articles' }]"
                role="tab"
                :aria-selected="viewMode === 'articles' ? 'true' : 'false'"
                :tabindex="viewMode === 'articles' ? 0 : -1"
                @click="setView('articles')"
                :disabled="!hasAnyTopic"
            >
              Артикли
            </button>
            <button
                :class="['view-toggle__btn', { 'is-active': viewMode === 'lands' }]"
                role="tab"
                :aria-selected="viewMode === 'lands' ? 'true' : 'false'"
                :tabindex="viewMode === 'lands' ? 0 : -1"
                @click="setView('lands')"
                :disabled="!hasAnyRegion"
            >
              Языковые земли
            </button>
          </div>
        </div>
      </div>
      <div class="panel-scroll" v-if="hasAnyTopic || hasAnyRegion">
        <template v-if="viewMode === 'articles'">
          <div class="select__block" v-if="hasAnyTopic">
<!--            <h2>Артикли</h2>-->
            <div class="topic-slider">
              <button class="nav-btn" @click="prevTopic" :disabled="!topics.length">
                <img class="nav__btn-arrow-icon" src="../../assets/images/arrow-prew.svg" alt="Arrow prev">
              </button>
              <div class="topic-display" v-if="selectedTopic">
                {{ t(nameMap[selectedTopic]) }}
              </div>
              <button class="nav-btn" @click="nextTopic" :disabled="!topics.length">
                <img class="nav__btn-arrow-icon" src="../../assets/images/arrow-next.svg" alt="Arrow next">
              </button>
            </div>
          </div>
          <div class="stats__block" v-if="selectedTopic">
            <ul>
              <li v-for="(value, mode) in progressByMode" :key="mode" class="mode-item">
                <div class="mode-title">{{ t(nameMode[mode]) }}</div>
                <div class="mode-progress">
                  <div class="progress-wrap progress-wrap--mode">
                    <progress class="progress" :value="value" max="100"></progress>
                    <div class="progress-label">{{ value }}%</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="not__active" v-if="!hasAnyTopic">
            <div class="not__active-title">Тем пока нет — переключитесь на «Языковые земли»</div>
          </div>
        </template>
        <template v-else>
          <div class="stats__block lands">
<!--            <h2>Языковые земли</h2>-->
            <div class="lands__header" v-if="selectedRegionKey">
              <div class="topic-slider">
                <button class="nav-btn" @click="prevRegion" :disabled="!regionKeys.length">
                  <img src="../../assets/images/arrow-prew.svg" alt="Arrow prev">
                </button>
                <div class="topic-display">
                  {{ t(currentRegionTitle) }}
                </div>
                <button class="nav-btn" @click="nextRegion" :disabled="!regionKeys.length">
                  <img src="../../assets/images/arrow-next.svg" alt="Arrow next">
                </button>
              </div>
              <div class="region-summary">
                <div class="region-summary__line">
                  <div class="region-summary__label">Прогресс земли</div>
                  <div class="progress-wrap progress-wrap--summary">
                    <progress class="progress" :value="regionPercent" max="100"></progress>
                    <div class="progress-label">{{ regionPercent }}%</div>
                  </div>
                </div>
                <div class="region-summary__meta">
                  <div>Квестов: {{ totalRegionQuests }}</div>
                  <div>Завершено: {{ completedRegionQuests }} / {{ totalRegionQuests }}</div>
                </div>
              </div>
            </div>
            <div class="lands__list" v-if="selectedRegionKey">
              <div v-if="!regionQuests.length" class="empty">
                Квесты ещё не загружены или не найдены для этой земли.
              </div>
              <ul v-else class="quests-list">
                <li v-for="q in regionQuestRows" :key="q.questId" class="quest-item">
                  <div class="quest-item__header">
                    <div class="quest-item__title">{{ t(q.title) }}</div>
                    <div class="quest-item__badges">
                      <span class="badge" v-if="q.success">Успешно</span>
                    </div>
                  </div>
                  <div class="progress-wrap progress-wrap--quest">
                    <progress class="progress" :value="q.percent" max="100"></progress>
                    <div class="progress-label">{{ q.percent }}%</div>
                  </div>

                  <div class="quest-item__meta">
                    <span>Верных ответов: {{ q.correctCount }}/{{ q.requiredTasks }}</span>
                    <span v-if="q.updatedAtMs">• обновлено: {{ formatDate(q.updatedAtMs) }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </div>
      <div class="not__active" v-else>
        <div class="not__active-title">Нету начатых тем и прогресса по землям</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, computed, watchEffect, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {nameMap, nameMode} from '../../utils/nameMap.js'
import {userlangStore} from '../../store/learningStore.js'
import {userChainStore} from '../../store/chainStore.js'
import {regions} from '../../utils/regions.js'

const {t, d} = useI18n()
const lang = userlangStore()
const chain = userChainStore()

const viewMode = ref('articles')

function setView(v) {
  if (v === 'articles' && !hasAnyTopic.value) return
  if (v === 'lands' && !hasAnyRegion.value) return
  viewMode.value = v
}

onMounted(async () => {
  if (!lang.isLoaded) await lang.loadFromFirebase()
  await chain.loadProgressFromFirebase()
  await fetchAllRegionQuests()
  if (!hasAnyTopic.value && hasAnyRegion.value) {
    viewMode.value = 'lands'
  }
})

const topics = computed(() => Object.keys(lang.topicStats || {}))
const hasAnyTopic = computed(() => topics.value.length > 0)
const selectedTopic = ref('')
watchEffect(() => {
  if (!selectedTopic.value && topics.value.length) selectedTopic.value = topics.value[0]
})

function prevTopic() {
  if (!topics.value.length) return
  const i = topics.value.indexOf(selectedTopic.value)
  selectedTopic.value = topics.value[(i - 1 + topics.value.length) % topics.value.length]
}

function nextTopic() {
  if (!topics.value.length) return
  const i = topics.value.indexOf(selectedTopic.value)
  selectedTopic.value = topics.value[(i + 1) % topics.value.length]
}

const MODES = ['article', 'letters', 'wordArticle', 'audio', 'plural']
const progressByMode = computed(() => {
  const inTopic = lang.words.filter(w => w.topic === selectedTopic.value)
  const total = inTopic.length
  const res = {}
  for (const m of MODES) {
    const passed = inTopic.filter(w => w.progress?.[m] === true).length
    res[m] = total ? Math.round((passed / total) * 100) : 0
  }
  return res
})

const regionKeys = computed(() => regions.map(r => String(r.pathTo)))
const hasAnyRegion = computed(() => regionKeys.value.length > 0)
const selectedRegionKey = ref('')
watchEffect(() => {
  if (!selectedRegionKey.value && regionKeys.value.length) selectedRegionKey.value = regionKeys.value[0]
})

function prevRegion() {
  if (!regionKeys.value.length) return
  const i = regionKeys.value.indexOf(selectedRegionKey.value)
  selectedRegionKey.value = regionKeys.value[(i - 1 + regionKeys.value.length) % regionKeys.value.length]
}

function nextRegion() {
  if (!regionKeys.value.length) return
  const i = regionKeys.value.indexOf(selectedRegionKey.value)
  selectedRegionKey.value = regionKeys.value[(i + 1) % regionKeys.value.length]
}

const currentRegion = computed(() => regions.find(r => String(r.pathTo) === String(selectedRegionKey.value)) || null)
const currentRegionTitle = computed(() => {
  const r = currentRegion.value
  return r?.title || r?.name || t(`regions.${r?.pathTo}`) || r?.pathTo || ''
})

const questsByRegion = ref({})

async function fetchAllRegionQuests() {
  const keys = regionKeys.value
  const jobs = keys.map(async (key) => {
    try {
      const res = await fetch(`/quests/quests-${key}.json`)
      if (!res.ok) return
      const raw = await res.json()
      const list = Array.isArray(raw) ? raw : [raw]
      questsByRegion.value = {
        ...questsByRegion.value,
        [key]: list.map(q => ({
          questId: String(q.questId ?? q.id ?? ''),
          title: q.title || q.name || `Квест #${q.questId}`
        }))
      }
    } catch {
    }
  })
  await Promise.all(jobs)
}

const regionQuests = computed(() => questsByRegion.value[selectedRegionKey.value] || [])
const questProgressMap = computed(() => chain.questProgress || {})
const regionQuestRows = computed(() =>
    regionQuests.value.map(q => {
      const p = questProgressMap.value[q.questId] || {}
      return {
        questId: q.questId,
        title: q.title,
        percent: clamp(Math.round(p.progressPercent || 0)),
        correctCount: Number(p.correctCount || 0),
        requiredTasks: Number(p.requiredTasks || 0),
        success: !!p.success,
        timesCompleted: Number(p.timesCompleted || 0),
        updatedAtMs: Number(p.updatedAtMs || 0)
      }
    })
)
const regionPercent = computed(() => {
  const rows = regionQuestRows.value
  if (!rows.length) return 0
  return Math.round(rows.reduce((s, r) => s + r.percent, 0) / rows.length)
})
const totalRegionQuests = computed(() => regionQuests.value.length)
const completedRegionQuests = computed(() => regionQuestRows.value.filter(r => r.success || r.percent >= 100).length)

function clamp(n) {
  return Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0))
}

function formatDate(ts) {
  try {
    return d(new Date(ts), 'short')
  } catch {
    const dt = new Date(ts);
    const y = dt.getFullYear()
    const m = String(dt.getMonth() + 1).padStart(2, '0')
    const dd = String(dt.getDate()).padStart(2, '0')
    return `${dd}.${m}.${y}`
  }
}
</script>

<style scoped>
.statistics {
  font-family: "Nunito", sans-serif;
  overflow: visible;
  height: 589px;
  max-height: 589px;

}

.stats__wrapper {
  max-width: 440px;
  width: 100%;
  flex-grow: 1;
  padding: 15px 15px;
  border: 3px solid black;
  border-radius: 16px;
  background: #60a5fa;
  height: 100%;
  box-shadow: 4px 4px 0 black;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  scrollbar-gutter: stable both-edges;
}

.stats__wrapper:hover {
  scrollbar-color: rgba(91, 246, 4, 0.3) transparent;
}

.panel-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
  padding-bottom: 16px;
  -webkit-overflow-scrolling: touch;
}

.stats__header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 12px;
  border: 3px solid black;
  border-radius: 13px;
  box-shadow: 4px 4px 0 black;
  background: #fff;
}

.stats__icon {
  width: 40px
}

.stats__title {
  font-size: 22px
}

.toggle {
  background: white;
  padding:4px;
  border-radius: 15px;
  border: 3px solid black ;
  box-shadow: 4px 4px 0 black;
  margin-bottom: 10px;
}

.view-toggle {
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-radius: 12px;
}

.view-toggle__inner {
  position: relative;
  display: flex;
  width: 100%;
  height: 44px;
  background: #fff;
  overflow: hidden;
}

.view-toggle__slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background: black;
  border-radius: 10px;
  transition: transform .18s ease;
  z-index: 0;
  pointer-events: none;
}

.view-toggle--lands .view-toggle__slider {
  transform: translateX(100%);
}

.view-toggle__btn {
  flex: 1 1 50%;
  height: 100%;
  border: none;
  background: transparent;
  font-weight: 800;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.view-toggle__btn:first-child {
  border-left: none;
}

.view-toggle__btn.is-active {
  color: #fff;
}

.view-toggle__btn:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.select__block {
  margin-bottom: 10px
}

.topic-slider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px
}

.not__active-title {
  font-weight: 600;
  text-align: center;
  padding: 20px;
  font-size: 22px
}

.topic-display {
  flex-grow: 1;
  min-width: 220px;
  padding: 8px 12px;
  text-align: center;
  border: 2px solid black;
  border-radius: 8px;
  background: #4ade80;
  font-weight: bold;
  box-shadow: 2px 2px 0 black
}

.nav-btn {
  position: relative;
  background: #494747;
  border: 2px solid black;
  border-radius: 10px;
  height: 40px;
  width: 50px;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  box-shadow: 2px 2px 0 black;
  transition: .2s;
}

.nav__btn-arrow-icon {
  position: absolute;
}

.nav-btn:disabled {
  opacity: .5;
  cursor: not-allowed
}

.nav-btn:hover {
  transform: translate(2px ,  2px);
  transition: .2s;
  background: #625f5f;
  box-shadow: none
}

.mode-item {
  margin-bottom: 10px
}

.mode-title {
  color: white;
  margin: 0 0 6px 0;
  line-height: 1.1;
  font-weight: 600
}

.progress-wrap {
  position: relative
}

.progress-wrap--mode {
  height: 24px
}

.progress-wrap--summary {
  height: 26px
}

.progress-wrap--quest {
  height: 18px
}

.progress {
  width: 100%;
  height: 100%;
  display: block;
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
  accent-color: #7c4caf;
  border-radius: 10px;
  overflow: hidden
}

.progress-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: black;
  pointer-events: none;
}

progress::-webkit-progress-bar {
  background: #f3efef;
  border-radius: 10px
}

progress::-webkit-progress-value {
  background: #7c4caf;
  border-radius: 10px
}

progress::-moz-progress-bar {
  background: #7c4caf;
  border-radius: 10px
}

.lands {
  display: flex;
  flex-direction: column;
}

.lands__header {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #60a5fa;
  margin-top: -4px
}

.quests-list {
  list-style: none;
  margin: 0;
  padding: 0
}

.quest-item {
  background: rgba(255, 255, 255, .95);
  border: 2px solid black;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 2px 2px 0 black;
  margin-bottom: 10px
}

.quest-item__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px
}

.quest-item__title {
  font-weight: 700
}

.quest-item__badges {
  display: flex;
  align-items: center;
  gap: 6px
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border: 2px solid black;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: #4ade80;
  box-shadow: 1px 1px 0 black
}


.quest-item__meta {
  margin-top: 6px;
  font-size: 12px;
  opacity: .9;
  display: flex;
  gap: 10px
}

.region-summary {
  margin: 10px 0 14px;
  padding: 10px;
  border: 2px solid black;
  border-radius: 10px;
  background: #fff;
  box-shadow: 2px 2px 0 black;
  display: none
}

.region-summary__line {
  margin-bottom: 6px
}

.region-summary__label {
  font-weight: 700;
  margin-bottom: 6px
}

.region-summary__meta {
  display: flex;
  gap: 14px;
  font-size: 14px
}

.empty {
  text-align: center;
  font-weight: 600;
  padding: 10px
}

</style>
