<template>
  <div class="mobile-page">
    <header class="app-header">
      <button @click="backTo" class="btn-icon-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>
      <h1 class="app-title">{{ t('articlesStatistics.stats') }}</h1>
      <div class="header-spacer"></div>
    </header>
    <div class="banner">
       <VBanner
           :text="t('statistics.title')"
           :icon="StatsIcon"
       />
    </div>
    <div class="tabs-container">
      <div class="segmented-control">
        <div class="sliding-bg" :style="{ transform: `translateX(${activeIndex * 100}%)` }"></div>
        <button class="tab-btn" :class="{ active: view === 'articles' }" @click="view = 'articles'">
          {{ t('articlesStatistics.navFirst') }}
        </button>
        <button class="tab-btn" :class="{ active: view === 'thematic' }" @click="view = 'thematic'">
          {{ t('articlesStatistics.navThird') }}
        </button>
      </div>
    </div>
    <main class="content-scroll">
      <section v-if="view === 'articles'" class="view-panel">
        <div class="topic-switch ios-card" v-if="hasAnyTopic">
          <button class="nav-arrow --back" @click="prevTopic">
            <img class="nav__arrow-item" src="../assets/images/next.svg" alt="next">
          </button>
          <div class="topic-title">{{ t(nameMap[selectedTopic]) }}</div>
          <button class="nav-arrow" @click="nextTopic">
            <img class="nav__arrow-item" src="../assets/images/next.svg" alt="next">
          </button>
        </div>
        <div v-if="hasAnyTopic" class="cards-grid">
          <article class="ios-card">
            <div class="bars">
              <div class="bars__scale">
                <span v-for="m in [100,75,50,25,0]" :key="m">{{ m }}%</span>
              </div>
              <div class="bars__wrap">
                <div v-for="b in bars" :key="b.key" class="col">
                  <div class="col__bg"></div>
                  <div class="col__fill" :class="'bg--'+b.key" :style="{ height: b.val + '%' }"></div>
                  <div class="col__foot">{{ b.val }}%</div>
                </div>
              </div>
            </div>
          </article>
<!--          <article class="ios-card">-->
<!--            <div class="donut">-->
<!--              <div class="pie" :style="{'&#45;&#45;pie-pct': selectedVal + '%','&#45;&#45;pie-color': modeColor}">-->
<!--                <div class="pie__inner">-->
<!--                  <span class="pie__text">{{ selectedVal }}%</span>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="chips-wrap">-->
<!--                <button-->
<!--                    v-for="m in MODES" :key="m"-->
<!--                    class="chip-btn"-->
<!--                    :class="{ active: selectedMode === m }"-->
<!--                    @click="selectedMode = m"-->
<!--                >-->
<!--                  <span class="dot" :class="'bg&#45;&#45;'+m"></span>-->
<!--                  {{ t(nameMode[m]) }}-->
<!--                </button>-->
<!--              </div>-->
<!--            </div>-->
<!--          </article>-->
          <article class="ios-card table-card">
            <ProgressTable :selected-topic="selectedTopic"/>
          </article>
        </div>
        <div v-else class="empty-state">
          <img class="empty-icon" :src="NodataIcon" alt="">
          <h3 class="empty-title">{{ t('articlesStatistics.notTopics') }}</h3>
          <button @click="articleSessionPath" class="btn-primary">{{ t('practiceArticleBtn.btn') }}</button>
        </div>
      </section>
      <section v-else class="view-panel">
        <article class="ios-card">
          <ThematicLevels/>
        </article>
      </section>

    </main>
  </div>
</template>

<script setup>
import {ref, computed, watchEffect, onMounted} from 'vue'
import {nameMap, nameMode} from '../utils/nameMap.js'
import {userlangStore} from '../store/learningStore.js'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import ProgressTable from '../src/components/progress.vue'
import ThematicLevels from '../src/components/thematic-statistic.vue'
import NodataIcon from '../assets/images/research.svg'
import VBanner from "~/src/components/V-banner.vue";
import StatsIcon from '../assets/images/StatsPlus.svg'
import {useSeoMeta} from "#imports";
const router = useRouter()
const {t} = useI18n()
const lang = userlangStore()
const view = ref('articles')

useSeoMeta({
  robots: 'noindex, nofollow'
})

const activeIndex = computed(() => view.value === 'articles' ? 0 : 1)

const backTo = () => router.push('/')
const articleSessionPath = () => router.push('/articles')

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

const colorMap = {
  article: '#60A5FA',
  letters: '#F59E0B',
  wordArticle: '#A78BFA',
  audio: '#34D399',
  plural: '#F472B6'
}
const modeColor = computed(() => colorMap[selectedMode.value])

onMounted(async () => {
  if (!lang.isLoaded) await lang.loadFromFirebase()
})
</script>

<style scoped>

.mobile-page {
  display: flex;
  flex-direction: column;
  height:100vh;
  max-width: 1240px;
  margin: 0 auto;
  font-family: "Nunito", sans-serif;
  overflow: hidden;
}

.app-header {
  display: flex;
  align-items: center;
  padding: 5px 10px 15px 10px;
  z-index: 10;
}

.banner {
  margin: 0 10px;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.app-title {
  font-size: 23px;
  font-weight: 700;
  margin-left: 15px;
  text-shadow: 1px 1px var(--title);
  color: var(--title);
}

.header-spacer {
  width: 40px;
}

.tabs-container {
  padding: 0 10px;
  margin-bottom: 20px;
}

.segmented-control {
  display: flex;
  position: relative;
  border-radius: 24px;
  padding: 4px;
  background: var(--tabBg);
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
}

.sliding-bg {
  position: absolute;
  top: 4px;
  left: 4px;
  height: calc(100% - 8px);
  width: calc(50% - 4px);
  background: var(--tabsSlideBg);
  box-shadow: var(--tabSlideBoxShadow);
  border-radius: 20px;
  transition: transform 0.4s cubic-bezier(0.34, 1.35, 0.64, 1);
  z-index: 1;
  will-change: transform;
}

.tab-btn {
  flex: 1;
  padding: 10px 0;
  position: relative;
  z-index: 2;
  border: none;
  background: transparent;
  border-radius: 20px;
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: var(--titleColor);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.3s ease;
}

.tab-btn.active {
  color: var(--titleColor);
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 0 10px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.view-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cards-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px;
}

.ios-card {
  background: var(--menuItemsBg);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  padding: 10px 15px 0 15px;
}

.table-card.table-card {
  padding: 0;
}

.topic-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  background: none;
  box-shadow: none;
}

.nav-arrow {
  background: var(--tabBg);
  border: none;
  border-radius: 15px;
  width: 44px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-arrow.--back {
transform: rotate(180deg);
}

.nav__arrow-item{
  width: 20px;
}

.topic-title {
  font-weight: 700;
  font-size: 18px;
  color: var(--titleColor);
  text-align: center;
  background: var(--tabBg);
  padding: 6px;
  border-radius: 14px;
  flex: 1;
}

.bars {
  display: grid;
  grid-template-columns: 30px 1fr;
  gap: 12px;
  height: 150px;
}

.bars__scale {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10px;
  color: #9CA3AF;
  font-weight: 600;
  text-align: right;
}

.bars__wrap {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  position: relative;
  border-bottom: 2px solid rgba(255, 255, 255, 0);
  background: linear-gradient(#d1d2d3 0 0) 0 25%/100% 1px no-repeat,
  linear-gradient(#d0d1d3 0 0) 0 50%/100% 1px no-repeat,
  linear-gradient(#d8dadc 0 0) 0 75%/100% 1px no-repeat;
}

.col {
  width: 14%;
  height: 100%;
  position: relative;
  border-radius: 8px 8px 0 0;
  background: var(--tabBg);
  overflow: hidden;
}

.col__fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 8px 8px 0 0;
  transition: height 0.5s ease;
}

.col__foot {
  position: absolute;
  bottom: -20px;
  width: 100%;
  text-align: center;
  font-size: 10px;
  color: #111;
}

.donut {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 15px 10px 15px;
}

.pie {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(var(--pie-color, #60A5FA) 0 var(--pie-pct, 0%), #F3F4F6 var(--pie-pct, 0%) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie__inner {
  width: 90px;
  height: 90px;
  background: #FFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pie__text {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1E1E1E;
}

.chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.chip-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #F7F8FA;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4B5563;
  transition: 0.2s;
}

.chip-btn.active {
  background: #FFF;
  border: 2px solid #E5E7EB;
  color: #1E1E1E;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 40px;
}

.empty-icon {
  width: 180px;
  margin-bottom: 20px;
}

.empty-title {
  color: #6B7280;
  margin-bottom: 20px;
}

.btn-primary {
  background: #3B82F6;
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  width: 100%;
  max-width: 250px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.bg--article {
  background: #60A5FA;
}

.bg--letters {
  background: #F59E0B;
}

.bg--wordArticle {
  background: #A78BFA;
}

.bg--audio {
  background: #34D399;
}

.bg--plural {
  background: #F472B6;
}
</style>