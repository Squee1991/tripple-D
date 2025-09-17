<template>
  <div class="fp__backdrop" @click.self="$emit('close')">
    <div class="fp__card">
      <button class="fp__close" @click="$emit('close')">✕</button>

      <div v-if="loading" class="fp__loading">Загрузка…</div>
      <div v-else-if="!profile" class="fp__empty">Профиль не найден</div>
      <div v-else class="fp__content">
        <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" class="fp__avatar" />
        <div class="fp__name">{{ profile.name || 'Без имени' }}</div>

        <div class="fp__row">
          <span class="fp__label">Уровень:</span>
          <span class="fp__value">{{ level }}</span>
        </div>

        <div class="fp__row">
          <span class="fp__label">Email:</span>
          <span class="fp__value">{{ profile.email || '—' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const props = defineProps({
  uid: { type: String, required: true },
})

const db = getFirestore()
const loading = ref(false)
const profile = ref(null)

const normalizeAvatarPath = (v) => {
  if (!v) return null
  const s = String(v).trim()
  if (/^https?:\/\//i.test(s)) return s
  const clean = s.split(/[?#]/)[0].replace(/^\/+/, '')
  const file = clean.split('/').pop()
  if (!file) return null
  return '/images/avatars/' + file
}

const avatarUrl = computed(() =>
    normalizeAvatarPath(profile.value?.avatarUrl || profile.value?.avatar || profile.value?.photoURL)
)

const level = computed(() => {
  if (!profile.value) return '—'
  if (typeof profile.value.level === 'number') return profile.value.level
  const exp = Number(profile.value.exp || 0)
  return Math.floor(exp / 100) + 1
})

async function loadProfile() {
  if (!props.uid) return
  loading.value = true
  profile.value = null
  try {
    const snap = await getDoc(doc(db, 'users', props.uid))
    profile.value = snap.exists() ? snap.data() : null
  } finally {
    loading.value = false
  }
}

watch(() => props.uid, () => loadProfile(), { immediate: true })
</script>

<style scoped>
.fp__backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.4);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.fp__card {
  position: relative;
  width: min(520px, 92vw);
  background: #fffdf5;
  border: 2px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 8px 0 0 var(--border);
  padding: 20px;
}
.fp__close {
  position: absolute; top: 10px; right: 10px;
  border: 2px solid var(--border);
  background: #f1f5f9; border-radius: 10px; padding: 4px 8px;
}
.fp__loading, .fp__empty { padding: 40px 0; text-align: center; font-weight: 700; }
.fp__content { display: grid; gap: 12px; }
.fp__avatar { width: 86px; height: 86px; border-radius: 24px; border: 2px solid var(--border); }
.fp__name { font-size: 1.4rem; font-weight: 800; margin-top: 6px; }
.fp__row { display: flex; gap: 8px; align-items: baseline; }
.fp__label { font-weight: 700; color: #475569; }
.fp__value { font-weight: 700; }
</style>
