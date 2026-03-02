<template>
  <div class="verbs-container">
    <div class="fixed-top">
      <header class="header">
        <h1 class="cartoon-title">Немецкие глаголы</h1>
        <div v-if="filteredVerbs.length" class="counter">
          Найдено: <strong>{{ filteredVerbs.length }}</strong>
        </div>
      </header>
      <div class="filters">
        <div class="search-box">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Найти глагол..."
              class="cartoon-input"
          />
        </div>
        <div class="select-wrapper">
          <select v-model="selectedType" class="cartoon-select">
            <option value="">Все типы</option>
            <option value="weak">Слабые (Weak)</option>
            <option value="strong">Сильные (Strong)</option>
            <option value="mixed">Смешанные (Mixed)</option>
            <option value="modal">Модальные (Modal)</option>
          </select>
        </div>
      </div>
    </div>
    <div class="scroll-area" v-if="paginatedVerbs.length > 0">
      <div v-for="verb in paginatedVerbs" :key="verb.id" class="verb-card">
        <div class="card-hero">
          <div class="inf-left-side">
            <SoundBtn :text="verb.infinitive" class="large-sound" />
            <h2 class="inf-main">{{ verb.infinitive }}</h2>
          </div>

          <span :class="['type-tag', verb.type]">{{ verb.type }}</span>
        </div>
        <div class="translation-section">
          <span class="ru-main">{{ verb.translation }}</span>
        </div>
        <div class="tenses-layout">
          <div class="tense-box is-pres">
            <div class="tense-header">PRÄSENS</div>
            <div class="forms-list">
              <div v-for="(form, p) in verb.conjugation_pres" :key="p" class="form-row">
                <SoundBtn :text="`${formatPronoun(p)} ${form}`" class="mini-sound"/>
                <span class="p-label">{{ formatPronoun(p) }}</span>
                <span :class="['v-form', { 'is-highlight': p === 'er_sie_es' }]">{{ form }}</span>
              </div>
            </div>
          </div>
          <div class="tense-box is-past">
            <div class="tense-header">PRÄTERITUM</div>
            <div class="forms-list">
              <div v-for="(form, p) in verb.conjugation_past" :key="p" class="form-row">
                <SoundBtn :text="`${formatPronoun(p)} ${form}`" class="mini-sound"/>
                <span class="p-label">{{ formatPronoun(p) }}</span>
                <span class="v-form">{{ form }}</span>
              </div>
            </div>
          </div>
          <div class="tense-box is-perf">
            <div class="tense-header">PERFEKT</div>
            <div class="forms-list">
              <div v-for="(form, p) in verb.conjugation_perf" :key="p" class="form-row">
                <SoundBtn :text="`${formatPronoun(p)} ${form}`" class="mini-sound"/>
                <span class="p-label">{{ formatPronoun(p) }}</span>
                <span class="v-form is-perf-text">{{ form }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination-bar">
      <button class="nav-btn" :disabled="currentPage === 1" @click="currentPage--">←</button>
      <span class="page-counter"><strong>{{ currentPage }}</strong> / {{ totalPages }}</span>
      <button class="nav-btn" :disabled="currentPage === totalPages" @click="currentPage++">→</button>
    </div>
  </div>
</template>

<script setup>
import SoundBtn from "../src/components/soundBtn.vue";
import {ref, computed, watch, onMounted, onUnmounted} from 'vue'

const {data: rawData} = await useFetch('/verbs.json')
const searchQuery = ref('')
const selectedType = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const formatPronoun = (p) => {
  const map = {ich: 'ich', du: 'du', er_sie_es: 'er/sie/es', wir: 'wir', ihr: 'ihr', sie_Sie: 'sie/Sie'}
  return map[p] || p
}

const updateItems = () => {
  if (process.client) itemsPerPage.value = window.innerWidth <= 767 ? 1 : 10
}
onMounted(() => {
  updateItems();
  window.addEventListener('resize', updateItems)
})
onUnmounted(() => window.removeEventListener('resize', updateItems))

const allVerbs = computed(() => {
  if (!rawData.value) return []
  return Object.entries(rawData.value).flatMap(([type, list]) => list.map(v => ({...v, type})))
})

const filteredVerbs = computed(() => {
  if (!allVerbs.value) return []
  const query = searchQuery.value.toLowerCase().trim()
  const filtered = allVerbs.value.filter(v => {
    const matchType = !selectedType.value || v.type === selectedType.value
    const matchText = v.infinitive.toLowerCase().includes(query) || v.translation.toLowerCase().includes(query)
    return matchType && matchText
  })
  return filtered.sort((a, b) => a.infinitive.toLowerCase() === query ? -1 : 1)
})

const totalPages = computed(() => Math.ceil(filteredVerbs.value.length / itemsPerPage.value) || 1)
const paginatedVerbs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredVerbs.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, selectedType, itemsPerPage], () => currentPage.value = 1)
</script>

<style scoped>

.verbs-container {
  height: 100vh;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #f0f4f8;
  padding: 10px;
  overflow: hidden;
}

.fixed-top {
  flex-shrink: 0;
  background: #fff;
  border-radius: 20px;
  padding: 15px;
  margin-bottom: 10px;
  border: 3px solid #e2e8f0;
}

.cartoon-title {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: 1.6rem;
  color: #1a202c;
  text-align: center;
}

.counter {
  text-align: center;
  font-size: 0.8rem;
  background: #edf2f7;
  display: block;
  margin: 5px auto;
  width: fit-content;
  padding: 2px 10px;
  border-radius: 10px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.cartoon-input, .cartoon-select {
  flex: 1;
  padding: 12px;
  border: 2px solid #cbd5e0;
  border-radius: 15px;
  font-weight: 600;
  outline: none;
  transition: 0.2s;
}

.cartoon-input:focus {
  border-color: #4299e1;
}

.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding: 5px;
}

.verb-card {
  background: #fff;
  border-radius: 25px;
  border: 4px solid #e2e8f0;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 0 #e2e8f0;
}

.card-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border-bottom: 2px dashed #e2e8f0;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.inf-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.inf-main {
  font-size: 2rem;
  font-weight: 900;
  color: #2d3748;
  margin: 0;
}

.large-sound {
  transform: scale(1.4);
}

.ru-main {
  font-size: 1.2rem;
  font-weight: 700;
  color: #718096;
}

.type-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  color: #fff;
  margin-top: 5px;
}

.type-tag.weak {
  background: #48bb78;
}

.type-tag.strong {
  background: #f56565;
}

/* СЕТКА ВРЕМЕН */
.tenses-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.tense-box {
  background: #f7fafc;
  border-radius: 18px;
  padding: 15px;
  border: 2px solid #edf2f7;
}

.tense-header {
  font-size: 0.75rem;
  font-weight: 900;
  color: #a0aec0;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 5px 10px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #edf2f7;
}

.p-label {
  width: 55px;
  font-size: 0.8rem;
  font-weight: 800;
  color: #a0aec0;
  text-align: right;
}

.v-form {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2d3748;
}

.is-highlight {
  color: #e53e3e;
}

.is-perf-text {
  color: #3182ce;
}

.mini-sound {
  transform: scale(0.8);
}

.card-hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-bottom: 2px dashed #e2e8f0;
  padding-bottom: 15px;
  margin-bottom: 10px;
}

.inf-left-side {
  display: flex;
  align-items: center;
  gap: 15px;
}

.type-tag {
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  color: #fff;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}

.translation-section {
  text-align: left;
  margin-bottom: 20px;
}

.ru-main {
  font-size: 1.1rem;
  font-weight: 700;
  color: #718096;
}

/* ПАГИНАЦИЯ */
.pagination-bar {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 15px;
  background: #fff;
  border-radius: 20px;
  border-top: 3px solid #e2e8f0;
}

.nav-btn {
  background: #4299e1;
  color: #fff;
  border: none;
  padding: 10px 25px;
  border-radius: 15px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 0 #2b6cb0;
}

.nav-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #2b6cb0;
}

.nav-btn:disabled {
  background: #cbd5e0;
  box-shadow: 0 4px 0 #a0aec0;
  cursor: not-allowed;
}

@media (max-width: 1023px) {
  .tenses-layout {
    grid-template-columns: 1fr;
  }

  .verb-card {
    border-width: 3px;
    box-shadow: 0 6px 0 #e2e8f0;
  }
}

@media (max-width: 767px) {
  .inf-main {
    font-size: 1.8rem;
  }

  .nav-btn {
    flex: 1;
    text-align: center;
  }
}
</style>