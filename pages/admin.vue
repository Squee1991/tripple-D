<script setup>
import {ref, onMounted} from 'vue'
import { useSeoMeta } from '#imports'
const checking = ref(true)
const allowed = ref(false)
const uid = ref('')
const email = ref('')
const loading = ref(false)
const errorMsg = ref(null)
const dataJson = ref(null)

useSeoMeta({
  robots: 'noindex, nofollow'
})
const USER_SUBCOLLECTIONS = [
  'daily',
  'localStatGame',
  'cardStats',
  'dailyAgg',
  'friends',
  'quizAttempts',
  'quizModes',
  'quizSessions',
  'quizTopics',
  'sharedExams',
  'ui',
]
const DOC_BY_UID = [
  'progress',
  'guessProgress',
  'cardStats',
  'leaderboard',
  'leaderboard_guess',
  'marathon_leaderboard',
]

async function findUidByEmail(db, emailStr) {
  const {getDocs, collection, query, where} = await import('firebase/firestore')
  const clean = emailStr.trim()
  const q = query(collection(db, 'users'), where('email', '==', clean))
  const snap = await getDocs(q)
  return snap.empty ? null : snap.docs[0].id
}

async function loadUserData() {
  loading.value = true
  errorMsg.value = null
  dataJson.value = null
  try {
    const {getFirestore, doc, getDoc, collection, getDocs, query, where} =
        await import('firebase/firestore')
    const db = getFirestore()
    let targetUid = uid.value.trim()
    if (!targetUid && email.value.trim()) {
      targetUid = await findUidByEmail(db, email.value.trim())
      if (!targetUid) throw new Error('Пользователь с таким email не найден.')
      uid.value = targetUid
    }
    if (!targetUid) throw new Error('Укажи UID или email')
    const userRef = doc(db, 'users', targetUid)
    const userSnap = await getDoc(userRef)
    const userData = userSnap.exists() ? userSnap.data() : null
    const subcollections = {}
    for (const sub of USER_SUBCOLLECTIONS) {
      const subRef = collection(db, `users/${targetUid}/${sub}`)
      const subSnap = await getDocs(subRef)
      subcollections[sub] = subSnap.docs.map(d => ({id: d.id, ...d.data()}))
    }
    const other = {}
    for (const colName of DOC_BY_UID) {
      const dref = doc(db, colName, targetUid)
      const dsnap = await getDoc(dref)
      other[colName] = dsnap.exists() ? [{id: dref.id, ...dsnap.data()}] : []
    }
    {
      const col = collection(db, 'examAttempts')
      const mine = await getDocs(query(col, where('ownerUid', '==', targetUid)))
      const shared = await getDocs(query(col, where('sharedWith', 'array-contains', targetUid)))
      let pending = {docs: []}
      try {
        pending = await getDocs(query(col, where('pendingShares', 'array-contains', targetUid)))
      } catch (_) {
      }
      const uniq = new Map()
      ;[...mine.docs, ...shared.docs, ...pending.docs].forEach(d =>
        uniq.set(d.id, {id: d.id, ...d.data()})
    )
      other['examAttempts'] = Array.from(uniq.values())
    }
    {
      const col = collection(db, 'gameSessions')
      const byHost = await getDocs(query(col, where('hostId', '==', targetUid)))
      const byGuest = await getDocs(query(col, where('guestId', '==', targetUid)))
      let byParticipants = {docs: []}
      try {
        byParticipants = await getDocs(query(col, where('participants', 'array-contains', targetUid)))
      } catch (_) {
      }
      const uniq = new Map()
      ;[...byHost.docs, ...byGuest.docs, ...byParticipants.docs].forEach(d =>
        uniq.set(d.id, {id: d.id, ...d.data()})
    )
      other['gameSessions'] = Array.from(uniq.values())
    }
    dataJson.value = {
      exportedAt: new Date().toISOString(),
      userId: targetUid,
      user: userData,
      subcollections,
      otherCollections: other,
    }
  } catch (e) {
    errorMsg.value = e.message || String(e)
  } finally {
    loading.value = false
  }
}

function clearAll() {
  dataJson.value = null
  errorMsg.value = null
}

function downloadJSON() {
  if (!dataJson.value) return
  const blob = new Blob([JSON.stringify(dataJson.value, null, 2)], {type: 'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gdpr-export-${dataJson.value.userId}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

onMounted(async () => {
  const {getAuth, onAuthStateChanged} = await import('firebase/auth')
  const auth = getAuth()
  const user = auth.currentUser || await new Promise(resolve => {
    const off = onAuthStateChanged(auth, u => {
      off();
      resolve(u)
    })
  })
  if (!user) return navigateTo('/')
  await user.getIdToken(true)
  const token = await user.getIdTokenResult(true)
  const {public: pub} = useRuntimeConfig()
  const adminUids = [pub.ADMIN_UID1, pub.ADMIN_UID2].filter(Boolean)
  const isAdminClaim = !!token.claims?.isAdmin
  const isWhitelisted = adminUids.includes(user.uid)
  const ok = isAdminClaim || isWhitelisted
  if (!ok) return navigateTo('/')
  allowed.value = true
  checking.value = false
})
</script>

<template>
  <div v-if="checking" class="screen-loader">
    <div class="spinner"></div>
    <p>Загружаю админку…</p>
  </div>
  <div v-else-if="allowed" class="admin">
    <h1>Админ · Экспорт данных</h1>
    <div class="card inputs">
      <label>
        <span>UID</span>
        <input v-model="uid" placeholder="YbHM8t…"/>
      </label>
      <div class="hint">или</div>
      <label>
        <span>Email</span>
        <input v-model="email" placeholder="user@example.com"/>
      </label>
      <div class="actions">
        <button @click="loadUserData" :disabled="loading">
          {{ loading ? 'Загружаю…' : 'Загрузить ДАННЫЕ' }}
        </button>
        <button class="ghost" @click="clearAll">Очистить</button>
      </div>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </div>
    <div v-if="dataJson" class="card">
      <div class="toolbar">
        <button @click="downloadJSON">Скачать JSON</button>
      </div>
      <details>
        <summary>Профиль (users/{{ dataJson.userId }})</summary>
        <pre class="pre">{{ dataJson.user }}</pre>
      </details>
      <details>
        <summary>Саб-коллекции</summary>
        <div v-for="(arr, name) in dataJson.subcollections" :key="name" class="section">
          <h3>{{ name }}</h3>
          <pre class="pre">{{ arr }}</pre>
        </div>
      </details>
      <details>
        <summary>Другие коллекции</summary>
        <div v-for="(arr, name) in dataJson.otherCollections" :key="name" class="section">
          <h3>{{ name }}</h3>
          <pre class="pre">{{ arr }}</pre>
        </div>
      </details>
    </div>
    <p v-else class="muted">Введи UID или e-mail → «Загрузить ДАННЫЕ».</p>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.screen-loader {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(8px);
  background: radial-gradient(1200px 800px at 10% 10%, rgba(103, 89, 255, .10), transparent),
  radial-gradient(1000px 600px at 90% 80%, rgba(16, 185, 129, .10), transparent),
  #f8fafcEE;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 14px;
  z-index: 9999;
}

.screen-loader .spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #6759ff;
  border-radius: 50%;
  animation: spin .8s linear infinite;
  box-shadow: 0 2px 12px rgba(103, 89, 255, .22);
}

.screen-loader p {
  color: #334155;
  font-weight: 700;
  letter-spacing: .2px;
}

.admin {
  --bg: linear-gradient(180deg, #f8fafc, #f9fbff);
  --card: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --border: #e6eaf2;
  --accent: #6759ff;
  --shadow: 0 20px 40px rgba(2, 6, 23, .06);
  --radius: 18px;
  --radius-sm: 12px;
  max-width: 780px;
  margin: 32px auto;
  padding: 16px;
  color: var(--text);
  background: var(--bg);
  animation: fadeUp .25s ease both;
}

h1 {
  font-size: 30px;
  font-weight: 900;
  letter-spacing: .2px;
  margin: 0 0 18px;
  line-height: 1.2;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(90deg, #0f172a, #4f46e5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

h1::after {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), #a78bfa);
  box-shadow: 0 0 0 6px rgba(103, 89, 255, .14);
}

.card {
  background: #ffffffcc;
  backdrop-filter: blur(6px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  margin-bottom: 20px;
  transition: transform .08s ease, box-shadow .2s ease;
}

.section {
  margin: 10px 0 16px;
  padding-top: 10px;
  border-top: 1px dashed #e5e7eb;
}

.inputs label {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;
  margin: 10px 0;
}

.inputs span {
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
}

.inputs input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  background: #f8fafc;
  transition: border-color .2s, box-shadow .2s, background .2s, transform .04s;
  outline: none;
}

.inputs input:hover {
  background: #fff;
}

.inputs input:focus-visible {
  border-color: var(--accent);
  box-shadow: 0 0 0 5px rgba(103, 89, 255, .16);
  background: #fff;
}

.hint {
  font-size: 12px;
  color: var(--muted);
  text-align: center;
  margin: 6px 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

button {
  background: linear-gradient(135deg, var(--accent), #8b5cf6);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 800;
  letter-spacing: .2px;
  transition: transform .06s ease, box-shadow .2s ease, filter .2s ease;
  box-shadow: 0 10px 22px rgba(2, 6, 23, .14);
}

button:active {
  transform: translateY(0);
}

button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 5px rgba(103, 89, 255, .22);
}

button.ghost {
  background: linear-gradient(#fff, #f8fafc);
  color: #0f172a;
  border: 1px solid var(--border);
  box-shadow: none;
}

button:disabled {
  opacity: .7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.toolbar > button {
  background: linear-gradient(135deg, var(--accent), #8b5cf6);
  border: none;
}

.toolbar > button:hover {
  filter: brightness(1.05);
}

.error {
  color: #b91c1c;
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 10px 12px;
  border-radius: 12px;
  margin-top: 8px;
}

details {
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 8px;
  background: #fbfcff;
  margin: 12px 0;
}

summary {
  cursor: pointer;
  list-style: none;
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 800;
  color: #0b1220;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background .2s, color .2s;
}

summary::before {
  content: "▸";
  transition: transform .2s ease;
  font-size: 14px;
  color: var(--accent);
}

h3 {
  margin: 8px 0 6px;
  font-size: 15px;
  font-weight: 900;
  color: #111827;
}

.pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 12.5px;
  line-height: 1.6;
  background: #0b1220;
  color: #e5edff;
  border-radius: 12px;
  border: 1px solid #0f1a2b;
  padding: 12px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .04);
}

.muted {
  color: var(--muted);
}

@media (max-width: 720px) {
  .admin {
    margin: 16px auto;
    padding: 10px;
  }

  h1 {
    font-size: 24px;
  }

  .inputs label {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .inputs span {
    width: auto;
  }

  .card {
    padding: 14px;
  }
}

</style>
