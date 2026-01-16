<template>
  <div>
    <div v-for="infoRow in accountInfoRows" :key="infoRow.label" class="card-row">
      <span class="card-row__label">{{ infoRow.label }}</span>
      <span class="card-row__value">{{ infoRow.value }}</span>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {userAuthStore} from '../store/authStore.js'

const {t} = useI18n()
const authStore = userAuthStore()

const registrationDateText = computed(() => {
  const registeredAt = authStore.registeredAt
  if (!registeredAt) return '—'
  let date
  if (typeof registeredAt.toDate === 'function') date = registeredAt.toDate()
  else date = new Date(registeredAt)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric'})
})

const accountInfoRows = computed(() => [
  {label: t('cabinetInfoRows.name'), value: authStore.name || '—'},
  {label: t('cabinetInfoRows.email'), value: authStore.email || '—'},
  {label: t('cabinetInfoRows.registerDate'), value: registrationDateText.value || '—'},
])
</script>

<style scoped>
.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid gray;
  padding: 10px 8px;
  margin-bottom: 10px;
}

.card-row__label {
  font-weight: 900;
  color: var(--titleColor);
}

.card-row__value {
  font-weight: 700;
  color: var(--titleColor);
}
</style>