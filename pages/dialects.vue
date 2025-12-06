<template>
  <div class="word-search-container">
    <h2>Словарь диалекта</h2>
    <div v-if="loading" class="status-message">
      <p>Загрузка словаря...</p>
    </div>
    <div v-else-if="error" class="status-message error">
      <p>Ошибка при загрузке данных: {{ error }}</p>
    </div>
    <div v-else-if="allEntries.length > 0" class="search-content">
      <p>Введите букву (для поиска по началу слова) или слово (для поиска по слову) на <strong>Немецком языке</strong>.</p>
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск..."
          class="search-input"
          @keydown.esc="closeUsage"
      />
      <div v-if="filteredResults.length > 0" class="results-container">
        <h3>Результаты ({{ filteredResults.length }}):</h3>
        <ul>
          <li v-for="item in filteredResults" :key="item.key" class="result-item">
            <div class="result-top">
              <div class="result-header">
                <span v-if="item.article" class="article">{{ item.article }}</span>
                <span class="word">{{ item.key }}</span>
              </div>
              <button
                  v-if="hasUsage(item)"
                  class="usage-btn"
                  type="button"
                  @click="openUsage(item)"
                  aria-label="Показать примечание по употреблению"
                  title="Примечание по употреблению"
              >
                <img src="../assets/images/question.svg" alt="usage icon"/>
              </button>
            </div>
            <ul class="translations">
              <li v-if="item.at"><strong>AT (Австрия):</strong>{{ item.at }}</li>
              <li v-if="item.by"><strong>BY (Бавария):</strong> {{ item.by }}</li>
              <li v-if="item.ch"><strong>CH (Швейцария):</strong> {{ item.ch }}</li>
            </ul>
          </li>
        </ul>
      </div>
      <div v-else-if="searchQuery && filteredResults.length === 0" class="no-results">
        <p>По вашему запросу '{{ searchQuery }}' ничего не найдено.</p>
      </div>
    </div>
    <div
        v-if="isUsageOpen"
        class="modal-backdrop"
        @click.self="closeUsage"
        role="dialog"
        aria-modal="true"
    >
      <div class="modal">
        <div class="modal-header">
          <h4 class="modal-title">
            Примечание: <span v-if="currentItem?.article" class="article">{{ currentItem.article }}</span>
            <span>{{ currentItem?.key }}</span>
          </h4>
          <button class="modal-close" @click="closeUsage" aria-label="Закрыть">×</button>
        </div>
        <div class="modal-body">
          <p v-if="typeof currentItemUsage === 'string'">{{ currentItemUsage }}</p>
          <ul v-else class="usage-list">
            <li v-if="currentItemUsage?.at"><strong>AT:</strong> {{ currentItemUsage.at }}</li>
            <li v-if="currentItemUsage?.by"><strong>BY:</strong> {{ currentItemUsage.by }}</li>
            <li v-if="currentItemUsage?.ch"><strong>CH:</strong> {{ currentItemUsage.ch }}</li>
            <li
                v-for="(val, key) in otherUsageKeys"
                :key="key"
            >
              <strong>{{ key.toUpperCase() }}:</strong> {{ val }}
            </li>
          </ul>
          <p v-if="!currentItemUsage || (isObject(currentItemUsage) && Object.keys(currentItemUsage).length === 0)">
            Для этого слова пока нет дополнительного описания.
          </p>
        </div>
        <div class="modal-footer">
          <button class="btn" @click="closeUsage">Ок</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
const allEntries = ref([]);
const searchQuery = ref('');
const loading = ref(true);
const error = ref(null);

const isUsageOpen = ref(false);
const currentItem = ref(null);

function isObject(v) {
  return Object.prototype.toString.call(v) === '[object Object]';
}

function hasUsage(item) {
  if (!item || item.usage == null) return false;
  if (typeof item.usage === 'string') return item.usage.trim().length > 0;
  if (isObject(item.usage)) return Object.keys(item.usage).length > 0;
  return false;
}

const currentItemUsage = computed(() => currentItem.value?.usage);
const otherUsageKeys = computed(() => {
  const u = currentItemUsage.value;
  if (!isObject(u)) return {};
  const known = new Set(['at', 'by', 'ch']);
  return Object.fromEntries(Object.entries(u).filter(([k]) => !known.has(k)));
});

function openUsage(item) {
  currentItem.value = item;
  isUsageOpen.value = true;
}

function closeUsage() {
  isUsageOpen.value = false;
  currentItem.value = null;
}

function processData(data) {
  if (!Array.isArray(data)) return [];
  return data
      .map(item => {
        const key = (item.key || item.de || '').trim();
        return {
          key,
          article: item.article || '',
          at: item.at || '',
          by: item.by || '',
          ch: item.ch || '',
          usage: item.usage ?? null
        };
      })
      .filter(e => e.key);
}

const filteredResults = computed(() => {
  const query = (searchQuery.value || '').trim().toLowerCase();
  if (!query) return [];
  const startsWithLetter = query.length === 1 && /^[a-zäöüß]$/.test(query);
  return allEntries.value.filter(entry => {
    const k = (entry.key || '').toLowerCase();
    return startsWithLetter ? k.startsWith(query) : k.includes(query);
  });
});

async function fetchData() {
  try {
    const response = await fetch('/dialects/dialects.json');
    if (!response.ok) throw new Error('Не удалось загрузить данные');
    const rawData = await response.json();
    allEntries.value = processData(rawData);
  } catch (err) {
    console.error('Не удалось обработать JSON:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const onEsc = e => {
    if (e.key === 'Escape' && isUsageOpen.value) closeUsage();
  };
  window.addEventListener('keydown', onEsc);
  fetchData();
  onUnmounted(() => window.removeEventListener('keydown', onEsc));
});
</script>

<style scoped>
.word-search-container {
  font-family: "Nunito", sans-serif;
  max-width: 800px;
  padding: 30px;
}

h2 {
  color: #1a1a1a;
  font-size: 2em;
  border-bottom: 3px solid #007bff;
  padding-bottom: 12px;
  margin-top: 0;
  margin-bottom: 25px;
}

.search-content p {
  color: #555;
  font-size: 1.1em;
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
  padding: 14px 20px;
  font-size: 1.2em;
  margin-bottom: 30px;
  border: 2px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color .3s, box-shadow .3s;
}

.search-input:focus {
  outline: none;
  border-color: #0056b3;
  box-shadow: 0 0 0 4px rgba(0, 86, 179, .2);
}

.results-container h3 {
  color: #333;
  font-size: 1.5em;
  margin: 20px 0 15px;
  padding-left: 5px;
}

ul {
  list-style: none;
  padding-left: 0;
}

.result-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  padding: 20px 25px;
  margin-bottom: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .05);
  transition: box-shadow .3s ease, transform .1s ease;
}

.result-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.result-header {
  display: flex;
  gap: 6px;
  align-items: baseline;
  margin-bottom: 12px;
  font-size: 1.6rem;
  color: #0056b3;
  font-weight: bold;
}

.article {
  color: #007bff;
  text-transform: lowercase;
}

.word {
  color: #1a1a1a;
}

.usage-btn {
  width: 45px;
  height: 45px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: background .2s, transform .05s;
}

.usage-btn:hover {
  background: #f2f6ff;
}

.usage-btn:active {
  transform: scale(.98);
}

.usage-btn img {
  width: 45px;
  height: 45px;
  display: block;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: min(640px, 92vw);
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .2);
  overflow: hidden;
  animation: pop .12s ease-out;
}

@keyframes pop {
  from {
    transform: translateY(10px);
    opacity: .7;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #eee;
  background: #f7f9fc;
}

.modal-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  gap: 4px;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  line-height: 1;
  color: #666;
  padding: 4px 8px;
  border-radius: 8px;
}

.modal-close:hover {
  background: #f0f0f0;
}

.modal-body {
  padding: 16px 18px;
  color: #333;
}

.usage-list {
  padding-left: 0;
  display: grid;
  gap: 8px;
}

.usage-list li strong {
  min-width: 48px;
  margin-right: 8px;
  display: inline-block;
  color: #1a1a1a;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 18px;
  border-top: 1px solid #eee;
  background: #fafafa;
}

.btn {
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #d0d7ff;
  background: #eaf0ff;
  color: #2046b3;
  font-weight: 600;
  cursor: pointer;
}

.btn:hover {
  background: #dfe8ff;
}
</style>
