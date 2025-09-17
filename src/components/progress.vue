<template>
  <div v-if="selectedTopic" class="progress-table">
    <h3 class="pt__title">Прогресс по теме: {{ t(nameMap[selectedTopic]) || selectedTopic }}</h3>
    <div class="word-table">
      <div class="word-row header">
        <div class="word-cell word-ru">Слово</div>
        <div v-for="mode in learningModes" :key="mode.key" class="word-cell mode-label">
          {{ mode.label }}
        </div>
      </div>
      <div v-for="word in paginatedWords" :key="word.de + '-' + word.ru" class="word-row">
        <div class="word-cell word-ru">{{ word.ru }}</div>
        <div v-for="mode in learningModes" :key="mode.key" class="word-cell status-cell">
          <span :title="getTooltip(word.progress?.[mode.key])">
            {{ getStatusIcon(word.progress?.[mode.key]) }}
          </span>
        </div>
      </div>
    </div>
    <div class="pagination" v-if="totalWords > wordsPerPage">
      <button @click="prevPage" :disabled="currentPage === 1">Назад</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages">Вперед</button>
    </div>
  </div>
  <div v-else class="placeholder">
    <p>Выберите тему, чтобы увидеть ваш прогресс!</p>
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
  {key: 'article', label: 'Артикль'},
  {key: 'letters', label: 'Буквы'},
  {key: 'wordArticle', label: 'Слово + Артикль'},
  {key: 'audio', label: 'Аудио'},
  {key: 'plural', label: 'Мн. число'}
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
const getTooltip = s => s === true ? 'Изучено' : s === false ? 'Ошибка' : 'Не изучено'

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
  display: grid;
  gap: 16px
}

.pt__title {
  margin: 0;
  font-weight: 800;
  font-size: 1.5rem;
  font-family: "Nunito", sans-serif
}

.word-table {
  display: flex;
  flex-direction: column;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  overflow: hidden
}

.word-row {
  display: flex;
  border-bottom: 2px solid #f3f4f6
}

.word-row:last-child {
  border-bottom: none
}

.word-row.header {
  background: #60a5fa;
  color: #fff;
  font-family: "Nunito", sans-serif
}

.word-cell {
  flex: 1;
  padding: .75rem 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center
}

.word-cell.word-ru {
  flex: 2;
  justify-content: flex-start;
  font-weight: 700;
  font-size: 1.1rem
}

.word-row.header .mode-label {
  font-size: .9rem
}

.status-cell {
  font-size: 1.5rem
}

.status-cell span {
  cursor: help
}

.pagination {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem
}

.pagination button {
  font-family: "Nunito", sans-serif;
  font-size: 1rem;
  padding: .5rem 1.5rem;
  border-radius: 12px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  background: #fca13a;
  color: #fff;
  cursor: pointer;
  transition: .2s
}

.pagination button:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e
}

.pagination button:disabled {
  background: #d1d5db;
  color: #9ca3af;
  box-shadow: 4px 4px 0 #9ca3af;
  cursor: not-allowed
}

.pagination span {
  font-size: 1.2rem;
  font-family: "Nunito", sans-serif;
  font-weight: 700
}

.placeholder {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 16px
}

.placeholder p {
  font-family: "Nunito", sans-serif;
  font-size: 1.1rem;
  color: #6b7280
}

@media (max-width: 767px) {
  .word-cell {
    padding: 8px;
    font-size: 1rem
  }

  .word-cell.word-ru {
    font-size: .9rem
  }
}
</style>
