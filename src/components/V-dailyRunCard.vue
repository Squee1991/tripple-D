<template>
  <div class="daily-card" :class="{ 'is-done': dailyRunStore.isPlayedToday }">
    <div class="daily-card__head">
      <span class="daily-card__title">{{ t('dailyRun.title') }}</span>
      <span v-if="dailyRunStore.currentStreak" class="daily-card__streak">
        🔥 {{ t('dailyRun.streakDays', {count: dailyRunStore.currentStreak}) }}
      </span>
    </div>

    <!-- Сегодня уже сыграл: результат и время до нового забега -->
    <template v-if="dailyRunStore.isPlayedToday">
      <div class="daily-card__row">
        <span class="daily-card__result">
          {{ t('dailyRun.todayResult', {score: dailyRunStore.dailyRun.lastScore, total: dailyRunStore.dailyRun.lastTotal}) }}
        </span>
        <span class="daily-card__hint">{{ nextRunText }}</span>
      </div>
    </template>

    <!-- Ещё не играл сегодня -->
    <template v-else>
      <div class="daily-card__hint">{{ t('dailyRun.subtitle', {count: DAILY_WORD_COUNT}) }}</div>
      <button class="daily-card__play" :disabled="!dailyRunStore.isProfileLoaded" @click="router.push('/daily-run')">
        {{ t('dailyRun.play') }}
      </button>
    </template>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import {useRouter} from 'vue-router'
import {useDailyRunStore, DAILY_WORD_COUNT} from '~/store/dailyRunStore.js'

// Карточка ежедневного забега на экране марафона: кнопка «Играть» или сегодняшний результат
const {t} = useI18n()
const router = useRouter()
const dailyRunStore = useDailyRunStore()

// Раз в минуту обновляем «через сколько новый забег» (и сам день — если наступила полночь)
const now = ref(Date.now())
let clockTimer = 0

const nextRunText = computed(() => {
  const midnight = new Date(now.value)
  midnight.setHours(24, 0, 0, 0)
  const minutesLeft = Math.max(0, Math.ceil((midnight - now.value) / 60000))
  return t('dailyRun.nextIn', {hours: Math.floor(minutesLeft / 60), minutes: minutesLeft % 60})
})

onMounted(() => {
  dailyRunStore.loadProfile()
  clockTimer = setInterval(() => {
    now.value = Date.now()
    dailyRunStore.refreshToday()
  }, 60000)
})

onBeforeUnmount(() => {
  clearInterval(clockTimer)
})
</script>

<style scoped>
.daily-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 24px;
  background: linear-gradient(135deg, #ff9500 0%, #ff5e3a 100%);
  box-shadow: 0 8px 0 #b8481f;
  color: #ffffff;
  font-family: 'Nunito', sans-serif;
}

.daily-card.is-done {
  background: linear-gradient(135deg, #3a4a6b 0%, #2a3350 100%);
  box-shadow: 0 8px 0 #1c2338;
}

.daily-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.daily-card__title {
  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.daily-card__streak {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.2);
  font-size: 14px;
  font-weight: 900;
  white-space: nowrap;
}

.daily-card__row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.daily-card__result {
  font-size: 18px;
  font-weight: 900;
}

.daily-card__hint {
  font-size: 13px;
  font-weight: 700;
  opacity: 0.9;
}

.daily-card__play {
  padding: 11px;
  border: none;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.2);
  color: #ff5e3a;
  font-family: 'Nunito', sans-serif;
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
}

.daily-card__play:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}

.daily-card__play:disabled {
  opacity: 0.6;
}
</style>
