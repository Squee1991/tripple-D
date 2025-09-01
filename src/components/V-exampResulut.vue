<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import {getFirestore, collection, query, where, orderBy, limit, getDocs} from 'firebase/firestore'

const auth = getAuth()
const db = getFirestore()
const router = useRouter()
const loading = ref(true)
const error = ref(null)
const attempts = ref([])

function toDateFlexible(v) {
  if (!v) return null
  try {
    if (typeof v.toDate === 'function') return v.toDate()
    const d = new Date(v)
    return isNaN(d) ? null : d
  } catch {
    return null
  }
}

async function loadAttempts(uid) {
  loading.value = true
  error.value = null
  attempts.value = []
  try {
    const q = query(
        collection(db, 'examAttempts'),
        where('ownerUid', '==', uid),
        orderBy('startedAt', 'desc'),
        limit(100)
    )
    const snap = await getDocs(q)
    attempts.value = snap.docs.map(d => ({id: d.id, ...d.data()}))
  } catch (e) {
    console.error(e)
    error.value = e?.message || 'Не удалось загрузить архив'
  } finally {
    loading.value = false
  }
}

function openAttempt(id) {
  router.push(`/examp-archieve?id=${encodeURIComponent(id)}`)
}

onMounted(() => {
  const u = auth.currentUser
  if (u?.uid) {
    loadAttempts(u.uid)
  } else {
    onAuthStateChanged(auth, (user) => {
      if (user?.uid) loadAttempts(user.uid)
      else {
        loading.value = false;
        attempts.value = []
      }
    })
  }
})
</script>

<template>
  <div class="exams-compact">
    <h2 class="ec__title">Архив экзаменов</h2>
    <div v-if="loading" class="ec__box">Загрузка…</div>
    <div v-else-if="error" class="ec__box ec__box--error">{{ error }}</div>
    <div v-else>
      <div class="ec__not" v-if="attempts.length === 0">
        <img class="folder__icon" src="../../assets/images/folders.svg" alt="">
        <div class="ec__text-empty">Архив пуст</div>
      </div>
      <ul class="ec__list">
        <li v-for="a in attempts" :key="a.id" class="ec__item">
          <div class="ec__main">
            <div class="ec__line">
              <span class="ec__lvl">Niveau {{ a.level || '—' }}</span>
              <span class="ec__badge" :class="a.status === 'finished' ? 'is-finished' : 'is-draft'">
                {{ a.status || 'draft' }}
              </span>
            </div>
            <div class="ec__meta">
              <span>Начало:
                {{ toDateFlexible(a.startedAt)?.toLocaleString?.() || '—' }}
              </span>
              <span class="ec__dot">•</span>
              <span>Пройдено: {{ a.currentIndex ?? 0 }}</span>
              <span v-if="a.status === 'finished'" class="ec__dot">•</span>
              <span v-if="a.status === 'finished'">Средний балл: <b>{{ a.averageScore }}</b> / 10</span>
            </div>
          </div>
          <button class="ec__btn" @click="openAttempt(a.id)">Посмотреть результат</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

.exams-compact {
  width: 100%;
}

.folder__icon {
  width: 120px;
}

.ec__title {
  font-weight: 900;
  font-size: 1.6rem;
  margin-bottom: 12px;
  color: var(--titleColor, #111);
}

.ec__box {
  border: 2px solid #000;
  border-radius: 16px;
  padding: 12px;
  background: #fff7dd;
  box-shadow: 3px 3px 0 #000;
}

.ec__box--error {
  background: #ffe2e2;
}

.ec__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ec__text-empty {
  font-size: 1.5rem;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  margin-top: 10px;
}

.ec__not {
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.ec__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border: 3px solid #000;
  border-radius: 16px;
  padding: 12px;
  background: #f3f4f6;
  box-shadow: 4px 4px 0 #000;
}

.ec__main {
  display: grid;
  gap: 4px;
}

.ec__line {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ec__lvl {
  font-weight: 800;
  font-size: 1.1rem;
}

.ec__badge {
  font-size: .75rem;
  padding: 2px 8px;
  border: 2px solid #000;
  border-radius: 999px;
  text-transform: uppercase;
  font-weight: 900;
}

.is-finished {
  background: #bbf7d0;
}

.is-draft {
  background: #fde68a;
}

.ec__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  color: #374151;
  font-size: .95rem;
}

.ec__dot {
  opacity: .6;
}

.ec__btn {
  border: 3px solid #000;
  border-radius: 12px;
  padding: 8px 12px;
  font-weight: 800;
  background: #ffd54f;
  box-shadow: 3px 3px 0 #000;
  cursor: pointer;
  transition: .15s;
}

.ec__btn:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #000;
}

</style>
