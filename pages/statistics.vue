<template>
  <div class="page">
    <div class="page__stats-wrapper" :class="{'is-mobile': isMobile, 'content-open': isMobile && isContentOpen}">
      <aside class="sidebar">
        <div class="sb__brand">
          <button @click="backTo" class="btn btn__back">{{ t('articlesStatistics.toMain')}}</button>
          <div class="sb__title">{{ t('articlesStatistics.stats')}}</div>
        </div>
        <nav class="sb__nav">
          <button class="sb__link" :class="{active: view === 'articles'}" @click="openPanel('articles')">
            {{ t('articlesStatistics.navFirst')}}
          </button>
          <button class="sb__link" :class="{active: view === 'lands'}" @click="openPanel('lands')">
            {{ t('articlesStatistics.navSecond')}}
          </button>
          <button class="sb__link" :class="{active: view === 'thematic'}" @click="openPanel('thematic')">
            {{ t('articlesStatistics.navThird')}}
          </button>
        </nav>
      </aside>
      <main class="main">
        <section v-if="view==='articles'" class="panel">
          <header class="panel__head">
            <div class="panel__top">
              <h1 class="panel__title">{{ t('articlesStatistics.navFirst')}}</h1>
              <button v-if="isMobile" class="btn btn--ghost" @click="closePanel">{{ t('articlesStatistics.hide')}}</button>
            </div>
            <div class="topic-switch" v-if="hasAnyTopic">
              <button class="nav" @click="prevTopic"><img src="../assets/images/arrow-prew.svg" alt=""/></button>
              <div class="chip__theme">{{ t(nameMap[selectedTopic]) }}</div>
              <button class="nav" @click="nextTopic"><img src="../assets/images/arrow-next.svg" alt=""/></button>
            </div>
          </header>
          <div v-if="hasAnyTopic" class="grid">
            <article class="card">
              <h3 class="card__title">{{ t('articlesStatistics.verticalBar')}}</h3>
              <div class="bars">
                <div class="bars__scale">
                  <span v-for="m in [100,75,50,25,0]" :key="m">{{ m }}%</span>
                </div>
                <div class="bars__wrap">
                  <div v-for="b in bars" :key="b.key" class="col" :class="'col--'+b.key">
                    <div class="col__bg"></div>
                    <div class="col__fill" :class="'col__fill--'+b.key" :style="{ height: b.val + '%' }"></div>
                    <div class="col__foot">{{ b.val }}%</div>
                  </div>
                </div>
              </div>
              <div class="chips chips--bars">
                <span v-for="m in MODES" :key="m" class="chip chip--mode">
                  <span class="dot" :class="'dot--'+m"></span>{{ t(nameMode[m]) }}
                </span>
              </div>
            </article>
            <article class="card">
              <h3 class="card__title">{{ t('articlesStatistics.circle')}}</h3>
              <div class="donut">
                <div class="donut__wrapper">
                  <div class="pie" :style="{'--pie-pct': selectedVal + '%','--pie-color': modeColor}">
                    <div class="pie__text">{{ selectedVal }}%</div>
                  </div>
                </div>
                <div class="chips">
                  <button
                      v-for="m in MODES"
                      :key="m"
                      class="chip chip--mode"
                      :class="{active:selectedMode===m}"
                      @click="selectedMode=m"
                  >
                    <span class="dot" :class="'dot--'+m"></span>{{ t(nameMode[m]) }}
                  </button>
                </div>
              </div>
            </article>
            <article class="card card--full">
              <ProgressTable :selected-topic="selectedTopic"/>
            </article>
          </div>
          <div v-else class="empty">
            <h3 class="empty__title">{{ t('articlesStatistics.notTopics')}}</h3>
            <img class="empty__icon" :src="NodataIcon" alt="">
            <button @click="articleSessionPath" class="article__btn-path">К практике артиклей</button>
          </div>
        </section>
        <section v-else-if="view==='thematic'" class="panel">
          <header class="panel__head">
            <div class="panel__top">
              <h1 class="panel__title">{{ t('articlesStatistics.navThird')}}</h1>
              <button v-if="isMobile" class="btn btn--ghost" @click="closePanel">{{ t('articlesStatistics.hide')}}</button>
            </div>
          </header>
          <article class="card card--full">
            <ThematicLevels/>
          </article>
        </section>
        <section v-else class="panel">
          <header class="panel__head">
            <div class="panel__top">
              <h1 class="panel__title">{{ t('articlesStatistics.navSecond')}}</h1>
              <button v-if="isMobile" class="btn btn--ghost" @click="closePanel">{{ t('articlesStatistics.hide')}}</button>
            </div>
            <div class="topic-switch" v-if="selectedRegionKey">
              <button class="nav" @click="prevRegion"><img src="../assets/images/arrow-prew.svg" alt=""/></button>
              <div class="chip__theme">{{ t(currentRegionTitle) }}</div>
              <button class="nav" @click="nextRegion"><img src="../assets/images/arrow-next.svg" alt=""/></button>
            </div>
          </header>
          <article class="card">
            <h3 class="card__title">{{ t('articlesStatistics.summary')}}</h3>
            <div class="summary">
              <div class="summary__row"><span>{{ t('articlesStatistics.quests')}}</span><b>{{ totalRegionQuests }}</b></div>
              <div class="summary__row"><span>{{ t('articlesStatistics.finished')}}</span><b>{{ completedRegionQuests }} / {{
                  totalRegionQuests
                }}</b></div>
            </div>
            <ul class="quests">
              <li v-for="q in regionQuestRows" :key="q.questId" class="quest">
                <div class="quest__top">
                  <span class="quest__title">{{ t(q.title) }}</span>
                  <span class="badge" v-if="q.success">✔</span>
                </div>
                <div class="pbar">
                  <progress :value="q.percent" max="100"></progress>
                  <span class="pbar__val">{{ q.percent }}%</span>
                </div>
                <div class="quest__meta">
                  <span>{{ t('articlesStatistics.rightAnswers')}} {{ q.correctCount }}/{{ q.requiredTasks }}</span>
<!--                  <span v-if="q.updatedAtMs">• {{ formatDate(q.updatedAtMs) }}1</span>-->
                </div>
              </li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watchEffect, onMounted, onBeforeUnmount} from 'vue'
import {useI18n} from 'vue-i18n'
import {nameMap, nameMode} from '../utils/nameMap.js'
import {userlangStore} from '../store/learningStore.js'
import {userChainStore} from '../store/chainStore.js'
import {regions} from '../utils/regions.js'
import {useRouter} from 'vue-router'
import ProgressTable from '../src/components/progress.vue'
import ThematicLevels from '../src/components/thematic-statistic.vue'
import NodataIcon from '../assets/images/research.svg'

const router = useRouter()
const {t, d} = useI18n()
const lang = userlangStore()
const chain = userChainStore()
const view = ref('articles')
const backTo = () => router.push('/')
const isMobile = ref(false)
const isContentOpen = ref(false)

const articleSessionPath = () => {
  router.push('/articles')
}


function handleResize() {
  isMobile.value = window.innerWidth <= 767
  isContentOpen.value = !isMobile.value
}

function openPanel(target) {
  view.value = target
  if (isMobile.value) isContentOpen.value = true
}

function closePanel() {
  if (isMobile.value) isContentOpen.value = false
}

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
const bars = computed(() => MODES.map(key => ({key, val: progressByMode.value[key] || 0})))
const selectedMode = ref(MODES[0])
const selectedVal = computed(() => progressByMode.value[selectedMode.value] || 0)
const colorMap = {article: '#60a5fa', letters: '#f59e0b', wordArticle: '#a78bfa', audio: '#34d399', plural: '#f472b6'}
const modeColor = computed(() => colorMap[selectedMode.value])

const selectedRegionKey = ref('')
const regionKeys = computed(() => regions.map(r => String(r.pathTo)))
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
const currentRegionTitle = computed(() => currentRegion.value?.title || currentRegion.value?.name || `regions.${currentRegion.value?.pathTo}` || '')

const questsByRegion = ref({})

async function fetchAllRegionQuests() {
  const keys = regionKeys.value
  const jobs = keys.map(async key => {
    try {
      const res = await fetch(`/quests/quests-${key}.json`)
      if (!res.ok) return
      const raw = await res.json()
      const list = Array.isArray(raw) ? raw : [raw]
      questsByRegion.value = {
        ...questsByRegion.value,
        [key]: list.map(q => ({
          questId: String(q.questId ?? q.id ?? ''),
          title: q.title || q.name || `Quest #${q.questId}`
        }))
      }
    } catch {
    }
  })
  await Promise.all(jobs)
}

const regionQuests = computed(() => questsByRegion.value[selectedRegionKey.value] || [])
const questProgressMap = computed(() => chain.questProgress || {})
const regionQuestRows = computed(() => regionQuests.value.map(q => {
  const p = questProgressMap.value[q.questId] || {}
  const clamp = n => Math.max(0, Math.min(100, Math.round(n || 0)))
  return {
    questId: q.questId,
    title: q.title,
    percent: clamp(p.progressPercent),
    correctCount: Number(p.correctCount || 0),
    requiredTasks: Number(p.requiredTasks || 0),
    success: !!p.success,
    updatedAtMs: Number(p.updatedAtMs || 0)
  }
}))

const totalRegionQuests = computed(() => regionQuests.value.length)
const completedRegionQuests = computed(() => regionQuestRows.value.filter(r => r.success || r.percent >= 100).length)

function formatDate(ts) {
  try {
    return d(new Date(ts), 'short')
  } catch {
    const dt = new Date(ts)
    const y = dt.getFullYear()
    const m = String(dt.getMonth() + 1).padStart(2, '0')
    const d2 = String(dt.getDate()).padStart(2, '0')
    return `${d2}.${m}.${y}`
  }
}

onMounted(async () => {
  if (!lang.isLoaded) await lang.loadFromFirebase()
  await chain.loadProgressFromFirebase()
  await fetchAllRegionQuests()
})

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
</script>

<style scoped>

.page__stats-wrapper {
  height: 100vh;
  overflow: hidden;
  display: flex;
  gap: 14px;
  padding: 20px;
  position: relative
}

.empty__title {
  font-size: 1.5rem;
}

.empty__icon {
  width: 280px;
}

.empty {
  margin-bottom: 10px;
  position: absolute;
  width: 90%;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
}

.article__btn-path {
  padding: 8px;
  border-radius: 12px;
  box-shadow: 3px 3px 0  black;
  font-size: 1.1rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  transition: .3s;
  background: #f6f5f5;
}

@media (min-width: 1024px) {
  .article__btn-path:hover {
    transform: translate(1px, 1px);
    box-shadow: none;
    transition: .3s;
  }
}

.btn__back {
  padding: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  border-radius: 12px;
  box-shadow: 3px 3px 0 #000;
  width: 100%;
  background: #f1c40f
}

.donut__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 160px;
  border-bottom: 3px solid #000;
  width: 100%
}

.sidebar {
  background: #fff;
  border: 3px solid #000;
  border-radius: 14px;
  box-shadow: 4px 4px 0 #000;
  padding: 12px;
  display: grid;
  gap: 12px;
  align-content: start;
  min-width: 300px;
  height: 100%
}

.sb__brand {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px
}

.sb__title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1e1e1e;
  font-family: "Nunito", sans-serif;
  font-size: 2rem;
  padding: 10px 0;
  font-weight: 600
}

.sb__nav {
  display: grid;
  gap: 8px
}

.sb__link {
  padding: 1rem 1.25rem;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1.1rem;
  border-radius: 16px;
  transition: .2s;
  border: 3px solid transparent;
  font-weight: 600
}

.sb__link.active {
  background: #4ade80;
  border: 3px solid #000;
  color: #000;
  box-shadow: 4px 4px 0 #000
}

@media (min-width: 1024px) {
  .sb__link:hover {
    border: 3px solid #000
  }
}

.main {
  flex-grow: 1;
  position: relative;
  display: flex;
  min-height: 0
}

.panel {
  flex-grow: 1;
  overflow-y: auto;
  background: #60a5fa;
  border: 3px solid #000;
  border-radius: 14px;
  box-shadow: 4px 4px 0 #000;
  padding: 10px;
  scrollbar-width: thin;
  scrollbar-color: #e3efe1 transparent;
  scrollbar-gutter: stable both-edges
}

.panel::-webkit-scrollbar {
  width: 4px;
  position: absolute
}

.panel::-webkit-scrollbar-track {
  background: transparent
}

.panel::-webkit-scrollbar-thumb {
  background: #e8c0c0;
  border-radius: 10px
}

.panel__head {
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px
}

.panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px
}

.btn--ghost {
  padding: 6px 12px;
  border: 2px solid #000;
  border-radius: 10px;
  background: #f8fafc;
  font-weight: 600;
  box-shadow: 2px 2px 0 #000;
  font-family: "Nunito", sans-serif;
  margin-bottom: 10px;
}

.panel__title {
  font-size: 2rem;
  font-weight: 900
}

.topic-switch {
  display: flex;
  align-items: center;
  gap: 8px
}

.nav {
  width: 38px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 2px solid #000;
  background: #111827;
  color: #fff;
  border-radius: 8px
}

.chip__theme {
  padding: 6px 10px;
  border: 2px solid #000;
  border-radius: 10px;
  background: #4ade80;
  font-weight: 600;
  min-width: 220px;
  text-align: center;
  font-family: "Nunito", sans-serif;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px
}

.card {
  --col-h: 160px;
  border: 2px solid #000;
  border-radius: 12px;
  box-shadow: 2px 2px 0 #000;
  background: #f8fafc;
  padding: 20px 15px
}

.card--full {
  grid-column: 1/-1
}

.card__title {
  margin: 0 0 16px;
  font-weight: 800;
  font-size: 1.5rem;
  font-family: "Nunito", sans-serif
}

.bars {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 10px;
  align-items: end
}

.bars__scale {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: var(--col-h);
  font-size: 11px;
  font-weight: 800;
  color: #111
}

.bars__wrap {
  position: relative;
  height: var(--col-h);
  display: flex;
  align-items: flex-end;
  gap: 26px;
  border-bottom: 3px solid #0f172a;
  background: linear-gradient(#e5e7eb 0 0) 0% 0/100% 2px no-repeat, linear-gradient(#e5e7eb 0 0) 0% 25%/100% 2px no-repeat, linear-gradient(#e5e7eb 0 0) 0% 50%/100% 2px no-repeat, linear-gradient(#e5e7eb 0 0) 0% 75%/100% 2px no-repeat;
  background-position: 0 0, 0 25%, 0 50%, 0 75%
}

.col {
  position: relative;
  width: 18%;
  height: 100%;
  border: 2px solid transparent;
  box-sizing: border-box;
  background: #eef2ff;
  overflow: hidden
}

.col__fill {
  position: absolute;
  inset: auto 0 0 0;
  height: 0;
  transition: height .45s ease-in-out
}

.col__bg {
  position: absolute;
  inset: 0;
  background: #eef2ff
}

.col__foot {
  position: absolute;
  bottom: -23px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  font-weight: 900;
  color: #111;
  pointer-events: none
}

.col--article {
  border-color: #60a5fa
}

.col__fill--article {
  background: #60a5fa
}

.col--letters {
  border-color: #f59e0b
}

.col__fill--letters {
  background: #f59e0b
}

.col--wordArticle {
  border-color: #a78bfa
}

.col__fill--wordArticle {
  background: #a78bfa
}

.col--audio {
  border-color: #34d399
}

.col__fill--audio {
  background: #34d399
}

.col--plural {
  border-color: #f472b6
}

.col__fill--plural {
  background: #f472b6
}

.chips {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  width: 100%;
  margin-top: 30px
}

.chips--bars {
  margin-top: 30px
}

.chip--mode {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 2px solid #000;
  border-radius: 999px;
  background: #fff;
  font-weight: 800;
  font-size: 19px
}

.chip--mode.active {
  background: #111827;
  color: #fff
}

.dot {
  width: 20px;
  height: 20px;
  display: inline-block;
  border: 1.5px solid #000
}

.dot--article {
  background: #60a5fa
}

.dot--letters {
  background: #f59e0b
}

.dot--wordArticle {
  background: #a78bfa
}

.dot--audio {
  background: #34d399
}

.dot--plural {
  background: #f472b6
}

.donut {
  display: flex;
  flex-direction: column;
  align-items: center
}

.pie {
  width: 144px;
  height: 144px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: conic-gradient(var(--pie-color, #16a34a) 0 var(--pie-pct, 0%), #eb6868 var(--pie-pct, 0%) 100%)
}

.pie__text {
  font-size: 22px;
  font-weight: 900;
  color: #111
}

.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin: 16px 0 24px
}

.summary__row {
  background: #f3f4f6;
  border: 2px solid #000;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 3px 3px 0 #000
}

.summary__row span {
  font-family: "Nunito", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563
}

.summary__row b {
  font-family: "Nunito", sans-serif;
  font-size: 2.25rem;
  font-weight: 600;
  color: #111827;
  line-height: 1
}

.quests {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
  display: grid;
  gap: 16px
}

.quest {
  background: #fff;
  border: 2px solid #000;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 3px 3px 0 #000;
  transition: .2s;
  display: flex;
  flex-direction: column;
  gap: 12px
}

.quest:hover {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0 #000
}

.quest__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px
}

.quest__title {
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  font-size: 1.2rem;
  color: #1f2937
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 2px solid #000;
  border-radius: 50%;
  background: #4ade80;
  color: #000;
  font-size: 1rem;
  font-weight: 900;
  flex-shrink: 0
}

.quest__meta {
  margin-top: 4px;
  font-size: .8rem;
  color: #6b7280;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px
}

.pbar {
  position: relative;
  height: 20px
}

.pbar progress {
  width: 100%;
  height: 100%;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 99px;
  overflow: hidden
}

.pbar progress::-webkit-progress-bar {
  background: #e5e7eb;
  border: 2px solid #d1d5db;
  border-radius: 99px
}

.pbar progress::-webkit-progress-value {
  background: #22c55e;
  background-image: linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
  background-size: 24px 24px;
  border-radius: 99px;
  transition: width .3s
}

.pbar progress::-moz-progress-bar {
  background: #22c55e;
  background-image: linear-gradient(45deg, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
  background-size: 24px 24px;
  border-radius: 99px;
  transition: width .3s
}

.pbar__val {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .8rem;
  font-weight: 600;
  color: #b4acac;
}

.is-mobile {
  display: block;
  padding: 10px
}

.is-mobile .sidebar {
  width: 100%;
  min-width: 0
}

.is-mobile .main {
  position: fixed;
  inset: 0;
  padding: 10px;
  pointer-events: none
}

.is-mobile .panel {
  position: absolute;
  inset: 0;
  transform: translateX(100%);
  transition: transform .35s ease-in-out;
  pointer-events: auto
}

.is-mobile.content-open .panel {
  transform: translateX(0)
}

.is-mobile.content-open .sidebar {
  pointer-events: none
}

@media (max-width: 1023px) {
  .chip {
    flex-grow: 1;
    text-align: center
  }

  .grid {
    grid-template-columns: 1fr
  }

  .panel__title {
    display: none
  }

  .panel__head {
    justify-content: center
  }
}

@media (max-width: 767px) {
  .panel__head {
    align-items: stretch;
    flex-direction: column
  }

  .chip {
    flex-grow: 1;
    text-align: center
  }
  .summary__row b {
    font-size: 1.8rem;
  }
  .panel {
    border-radius: 0;
    border: none;
  }
}

</style>
