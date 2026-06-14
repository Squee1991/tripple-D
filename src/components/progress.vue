<template>
  <div v-if="selectedTopic" class="progress-table">
    <!--    <h3 class="card-title">{{ t('articleTable.title') }} {{ t(nameMap[selectedTopic]) || selectedTopic }}</h3>-->

    <div class="table-scroll">
      <div class="ios-table">
        <div class="table-header">
          <div class="cell cell-ru">{{ t('articleTable.word') }}</div>
          <div v-for="mode in learningModes" :key="mode.key" class="cell mode-label" :class="'bg-soft--' + mode.key">
            {{ mode.label }}
          </div>
        </div>
        <div v-for="(word, idx) in paginatedWords" :key="idx" class="table-row">
          <div class="cell cell-ru">{{ word.de }}</div>
          <div v-for="mode in learningModes" :key="mode.key" class="cell status-cell" :class="'bg-soft--' + mode.key">
            <span :title="getTooltip(word.progress?.[mode.key])">
              {{ getStatusIcon(word.progress?.[mode.key]) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="ios-pagination" v-if="totalWords > wordsPerPage">
      <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">
        <img class="nav__arrow-item --back" src="../../assets/images/next.svg" alt="next">
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button class="page-btn" @click="nextPage" :disabled="currentPage >= totalPages">
        <img class="nav__arrow-item" src="../../assets/images/next.svg" alt="next">
      </button>
    </div>
  </div>

  <div v-else class="placeholder">
    <p>{{ t('articleTable.choice') }}</p>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {userlangStore} from '../store/learningStore.js'
import {nameMap} from '../utils/nameMap.js'

const props = defineProps({selectedTopic: {type: String, default: ''}})
const {t} = useI18n()
const store = userlangStore()

const learningModes = [
  {key: 'article', label: t('articleTable.modeArticle')},
  {key: 'letters', label: t('articleTable.modeLetters')},
  {key: 'wordArticle', label: t('articleTable.modeWordArticle')},
  {key: 'audio', label: t('articleTable.modeAudio')},
  {key: 'plural', label: t('articleTable.modePlural')}
]

const currentPage = ref(1)
const wordsPerPage = 7

const wordsInTopic = computed(() => store.words.filter(w => w.topic === props.selectedTopic))
const totalWords = computed(() => wordsInTopic.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalWords.value / wordsPerPage)))
const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * wordsPerPage
  return wordsInTopic.value.slice(start, start + wordsPerPage)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const getStatusIcon = s => s === true ? '✅' : s === false ? '❌' : '⏳'
const getTooltip = s => s === true ? t('articleTable.learned') : s === false ? t('articleTable.wrong') : t('articleTable.notLearned')

watch(() => props.selectedTopic, () => {
  currentPage.value = 1
})

onMounted(async () => {
  if (!store.isLoaded) await store.loadFromFirebase()
  store.syncSelectedWordsProgress?.()
})
</script>

<style scoped>
.progress-table {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.card-title {
  margin: 0;
  font-weight: 700;
  font-size: 1.15rem;
  color: #1E1E1E;
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 16px;
}

.ios-table {
  min-width: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #E5E7EB;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
  border-bottom: 1px solid #E5E7EB;
  color: var(--titleColor);
  font-size: 0.75rem;
  font-weight: 700;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
  border-bottom: 1px solid #F3F4F6;
}

.table-row:last-child {
  border-bottom: none;
}

.cell {
  padding: 12px 6px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  word-break: break-word;
}

.cell-ru {
  justify-content: flex-start;
  font-weight: 600;
  color: var(--titleColor);
  padding-left: 14px;
}

.mode-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  line-height: 1.1;
}

.status-cell {
  font-size: 1.1rem;
}

.bg-soft--article {
  background-color: rgba(96, 165, 250, 0.36);
}

.bg-soft--letters {
  background-color: rgba(245, 158, 11, 0.33);
}

.bg-soft--wordArticle {
  background-color: rgba(167, 139, 250, 0.41);
}

.bg-soft--audio {
  background-color: rgba(52, 211, 153, 0.44);
}

.bg-soft--plural {
  background-color: rgba(244, 114, 182, 0.15);
}

.ios-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 26px;
  margin: 12px 0;
}

.page-btn {
  background: var(--tabBg);
  border: none;
  width: 46px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.nav__arrow-item {
  width: 20px;
}

.nav__arrow-item.--back {
  transform: rotate(180deg);
}

.page-btn:disabled {
  opacity: 0.4;
}

.page-info {
  font-weight: 700;
  color: #4B5563;
  font-size: 20px;
}

.placeholder {
  text-align: center;
  padding: 20px;
  color: #9CA3AF;
  font-size: 0.95rem;
}
</style>