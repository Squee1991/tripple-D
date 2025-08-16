<template>
  <div class="location-page">
    <header class="location-header">
      <h1>{{ region?.name }}</h1>
      <p class="location-desc">{{ region?.desc }}</p>
    </header>
    <div v-if="loading" class="loading">Загрузка квестов...</div>
    <div v-else class="quests">
      <h2>Квесты в этой зоне</h2>
      <div v-if="error" class="error">
        Не удалось загрузить квесты.<br/>
        <div class="tiny">
          URL: {{ url }}<br/>
          {{ error }}
        </div>
      </div>
      <ul v-else-if="quests.length" class="quest-list">
        <li v-for="q in quests" :key="q.questId" class="quest-card">
          <h3>{{ q.title }}</h3>
          <p>{{ q.description }}</p>
          <div class="quest-meta">
            <span>Прогресс: {{ q.progress }}</span>
            <span>Награда: {{ q.rewards.points }}💎, {{ q.rewards.xp }} XP</span>
          </div>
          <button class="btn" @click="startQuest(q)">Начать</button>
        </li>
      </ul>
      <div v-else class="empty">Квесты не найдены.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { regions } from "~/utils/regions.js";

const route = useRoute();
const router = useRouter();

const routeParams = computed(() => String(route.params.id || ""));
const region = computed(() => regions.find(region => region.pathTo === routeParams.value));

const url = computed(() => `/quests/quests-${routeParams.value}.json`);

const quests = ref([]);
const loading = ref(false);
const error = ref("");

async function loadQuests() {
  loading.value = true;
  error.value = "";
  quests.value = [];
  try {
    const res = await fetch(url.value);
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`)
    }
    quests.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
watch(routeParams, loadQuests, { immediate: true });
function startQuest(q) {
  if (q?.questId) {
    router.push(`/quest/${q.questId}`);
  }
}
</script>


<style>
.location-page {
  padding: 20px;
}

.location-header h1 {
  margin: 0 0 6px;
}

.location-desc {
  margin: 0 0 12px;
  color: #94a3b8;
}

.loading, .error, .empty {
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #1f2937;
  background: #0b1220;
  color: #e5e7eb;
}

.error {
  border-color: #7f1d1d;
  background: #3f1d1d;
}

.empty {
  opacity: .9;
}

.tiny {
  font-size: 12px;
  opacity: .8;
  margin-top: 6px;
}

.quests h2 {
  margin: 16px 0 12px;
}

.quest-list {
  display: grid;
  gap: 16px;
  margin-top: 8px;
}

.quest-card {
  border: 2px solid black;
  border-radius: 12px;
  padding: 16px;
  background: #111827;
  color: #fff;
}

.quest-card h3 {
  margin: 0 0 8px;
}

.quest-meta {
  font-size: 14px;
  margin: 8px 0 12px;
  color: #cbd5e1;
  display: flex;
  justify-content: space-between;
}

.btn {
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  font-weight: 800;
  letter-spacing: .02em;
  border: 1px solid #1f2937;
  background: #0b1220;
  color: #fff;
  cursor: pointer;
}

.btn:hover {
  background: #111827;
}
</style>
