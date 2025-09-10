<template>
  <div class="shared-exams-page">
    <header class="page-header">
      <div class="header__inner">
        <button @click="router.push('/')" class="btn btn__back">На главную</button>
        <h2 class="shared__title">Общие тесты от других участников</h2>
      </div>
      <div class="controls">
        <div class="search-sort">
          <div class="search">
            <svg viewBox="0 0 24 24" class="icon">
              <path
                  d="M10 18a8 8 0 1 1 5.292-14.002A8 8 0 0 1 10 18Zm8.707-.293 3.586 3.586-1.414 1.414-3.586-3.586 1.414-1.414Z"/>
            </svg>
            <input v-model.trim="query" type="text" placeholder="Поиск по имени"/>
          </div>
          <select v-model="mode" class="select">
            <option value="all">Все</option>
            <option value="pending">Не принятые</option>
            <option value="scoreDesc">Высокий балл</option>
            <option value="scoreAsc">Низкий балл</option>
          </select>
        </div>
      </div>
    </header>
    <div v-if="!ready" class="skeleton">
      <div class="skeleton-card" v-for="n in 4" :key="n"></div>
    </div>
    <div v-else>
      <div v-if="examStore.sharedLoading" class="status-row">
        <span class="badge badge-warn">Загрузка...</span>
      </div>
      <div v-else-if="examStore.sharedError" class="status-row">
        <span class="badge badge-danger">{{ examStore.sharedError }}</span>
      </div>

      <section v-if="showPending" class="section">
        <div class="section-title">
          <h3>Входящие приглашения</h3>
          <span class="counter">{{ visiblePending.length }}</span>
        </div>
        <ul class="cards">
          <li v-for="share in visiblePending" :key="share.shareId" class="card pending">
            <div class="card-main">
              <div class="avatar">{{ initials(share.fromName) }}</div>
              <div class="meta">
                <div class="title"><b>{{ share.fromName }}</b> пригласил(а) к экзамену</div>
                <div class="sub">
                  <span class="chip">Уровень: {{ (share.examDetails && share.examDetails.level) || 'N/A' }}</span>
                </div>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn btn-accept" @click="examStore.acceptShare(share)">Принять</button>
              <button class="btn btn-outline" @click="examStore.declineShare(share)">Отклонить</button>
            </div>
          </li>
          <li v-if="!visiblePending.length" class="empty">Нет входящих приглашений</li>
        </ul>
      </section>

      <section v-if="showAccepted" class="section">
        <div class="section-title">
          <h3>Доступные вам</h3>
          <span class="counter">{{ visibleAccepted.length }}</span>
        </div>
        <ul class="cards">
          <li v-if="!visibleAccepted.length" class="empty">У вас пока нет принятых экзаменов</li>
          <li v-for="share in visibleAccepted" :key="share.shareId" class="card accepted">
            <div class="card-main">
              <div class="avatar alt">{{ initials(share.fromName) }}</div>
              <div class="meta">
                <div class="title">Экзамен от <b>{{ share.fromName }}</b></div>
                <div class="sub">
                  <span class="chip">Уровень: {{ (share.examDetails && share.examDetails.level) || 'N/A' }}</span>
                  <span class="chip chip-score">Средний балл: {{
                      (share.examDetails && share.examDetails.averageScore) || 'N/A'
                    }}</span>
                </div>
              </div>
            </div>
            <div class="card-actions">
              <button class="btn btn-primary" @click="openSharedAttempt(share.examId)">Посмотреть</button>
            </div>
          </li>
        </ul>
      </section>

      <div v-if="!showPending && !showAccepted && !examStore.sharedLoading" class="empty-state">
        <p>Ничего не найдено</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, computed} from 'vue'
import {useRouter} from 'vue-router'
import {userExamStore} from '../store/examStore.js'

const examStore = userExamStore()
const router = useRouter()

const ready = ref(false)
const query = ref('')
const mode = ref('all')

onMounted(async () => {
  await examStore.loadSharedExams()
  ready.value = true
})

const normalized = s => (s || '').toString().toLowerCase()
const initials = name => (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

const baseFiltered = computed(() => {
  const q = normalized(query.value)
  return examStore.sharedExams.filter(item => !q || normalized(item.fromName).includes(q))
})

const visiblePending = computed(() =>
    baseFiltered.value.filter(e => e.status === 'pending')
)

const visibleAcceptedSorted = computed(() => {
  const list = baseFiltered.value
      .filter(e => e.status === 'accepted')
      .map(i => {
        const score = Number((i.examDetails && i.examDetails.averageScore) || 0)
        return {...i, _score: isNaN(score) ? 0 : score}
      })

  if (mode.value === 'scoreDesc') list.sort((a, b) => b._score - a._score)
  if (mode.value === 'scoreAsc') list.sort((a, b) => a._score - b._score)
  return list
})

const visibleAccepted = computed(() => visibleAcceptedSorted.value)

const showPending = computed(() => mode.value === 'all' || mode.value === 'pending')
const showAccepted = computed(() => mode.value === 'all' || mode.value === 'scoreDesc' || mode.value === 'scoreAsc')

function openSharedAttempt(id) {
  router.push(`/examp-archieve?id=${encodeURIComponent(id)}`)
}
</script>

<style scoped>
:root {
  --panel: #171a2b;
  --muted: #8b90a5;
  --text: #0b0b0b;
  --brand: #6c7cff;
  --brand-2: #9a6cff;
  --ok: #22c55e;
  --card-bd: #2a2f4a;
  --chip: #e9ecf9;
  --chip-score: #e6f6ec;
  --shadow: 3px 3px 0 #000000;
}

.shared__title {
  font-weight: 700;
  font-size: 1.6rem;
  font-family: "Nunito", sans-serif;
}

.shared-exams-page {
  display: grid;
  gap: 16px;
  padding: 20px;
  min-height: 100%;
  color: var(--text);
}

.header__inner {
  display: flex;
  align-items: center;
  gap: 14px;
}

.page-header {
  display: grid;
  gap: 12px;
  background: #f7f5e6;
  padding: 16px 20px;
  border-radius: 16px;
  box-shadow: var(--shadow);
  border: 2px solid #000;
}

.controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}

.search-sort {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  padding: 8px 10px;
  min-width: 240px;
  box-shadow: var(--shadow);
  border: 2px solid #000;
  background: #fff;
}

.search .icon {
  width: 18px;
  height: 18px;
  fill: #777;
  flex: none;
}

.search input {
  width: 100%;
  background: transparent;
  border: 0;
  outline: none;
  color: #111;
  font-size: 14px;
}

.select {
  background: #fff;
  color: #111;
  border: 2px solid #000;
  box-shadow: var(--shadow);
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
  outline: none;
}

.status-row {
  display: flex;
  justify-content: flex-start;
  padding: 4px 6px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 13px;
  letter-spacing: .2px;
  border: 2px solid #000;
  background: #fff;
  box-shadow: var(--shadow);
}

.badge-warn {
  color: #7a5c00;
}

.badge-danger {
  color: #8f1f1f;
}

.section {
  display: grid;
  gap: 10px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
}

.section-title h3 {
  margin: 0;
  font-size: 18px;
}

.counter {
  background: #fff;
  color: #111;
  padding: 4px 8px;
  border-radius: 999px;
  border: 2px solid #000;
  font-size: 14px;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  box-shadow: var(--shadow);
}

.cards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.card {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.card.pending {
  background: #fff7e1;
}

.card.accepted {
  background: #eefcf2;
}

.card-main {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffe08a, #ffb86b);
  color: #2b1c00;
  display: grid;
  place-items: center;
  font-weight: 800;
  letter-spacing: .5px;
  border: 2px solid #000;
  text-transform: uppercase;
}

.avatar.alt {
  background: linear-gradient(180deg, #a7f3d0, #6ee7b7);
  color: #003321;
}

.meta {
  display: grid;
  gap: 4px;
}

.title {
  font-size: 15px;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
}

.sub {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.btn__back {
  box-shadow: var(--shadow);
  background: #6c7cff;
  color: #fff;
  border: 2px solid #000;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 700;
}

.chip {
  background: var(--chip);
  color: #111;
  border: 2px solid #000;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 13px;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
}

.chip-score {
  background: var(--chip-score);
  color: #0a6b2a;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.btn {
  background: #60a5fa;
  font-family: "Nunito", sans-serif;
  font-weight: 700;
  border: 2px solid #000;
  border-radius: 10px;
  padding: 10px 14px;
  color: #fff;
  transition: transform .06s ease, box-shadow .15s ease;
  box-shadow: 2px 2px 0 black;
}

.btn:active {
  transform: translateY(1px) scale(.99);
}

.btn-primary {
  background: #75e375;
  color: #111;
}

.btn-outline {
  background: #efa3a0;
  color: #111;
}

.btn-accept {
  background: #34d399;
  color: #111;
}

.empty {
  background: transparent;
  color: #666;
  border: 2px dashed #000;
  border-radius: 14px;
  padding: 18px;
  text-align: center;
  box-shadow: var(--shadow);
}

.empty-state {
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 40px 12px;
  color: #777;
}

.skeleton {
  display: grid;
  gap: 12px;
}

.skeleton-card {
  height: 84px;
  border-radius: 16px;
  background: linear-gradient(90deg, #eee, #fafafa, #eee);
  background-size: 200% 100%;
  animation: sh 1.2s linear infinite;
  border: 2px solid #000;
  box-shadow: var(--shadow);
}

@keyframes sh {
  0% {
    background-position: 200% 0
  }
  100% {
    background-position: -200% 0
  }
}

@media (max-width: 720px) {
  .cards {
    gap: 10px;
  }

  .btn {
    width: 100%;
  }

  .card {
    grid-template-columns: 1fr;
  }

  .card-actions {
    justify-content: flex-end;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .header__inner {
    flex-direction: column;
  }

  .shared__title {
    font-size: 1.3rem;
  }

  .search-sort {
    width: 100%;
    justify-content: center;
  }

  .search {
    min-width: 0;
  }

  .page-header {
    padding: 14px;
  }
}
</style>
