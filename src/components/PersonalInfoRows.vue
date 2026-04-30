<template>
  <div class="profile-wrapper">
    <h3 class="section-title">{{ t('cabinetInfoRows.statsTitle', 'Статистика и достижения') }}</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon xp-icon">
          <img src="../../assets/images/daily.svg" alt="daily">
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ completedDailyQuests }} / 3</span>
          <span class="stat-label">Задания дня</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon title-icon">
          <img :src="currentRankIcon" alt="Rank" class="rank-icon-img" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ currentRankTitle }}</span>
          <span class="stat-label">Текущее звание</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon achievement-icon">
          <img src="../../assets/images/rewards.svg" alt="rewards">
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ unlockedAchievements }} / {{ totalAchievements }}</span>
          <span class="stat-label">Награды</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon streak-icon">
          <img src="../../assets/images/assurance.svg" alt="assurance">
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ langStore.isLeveling }} </span>
          <span class="stat-label">Уровень</span>
        </div>
      </div>
    </div>
    <h3 class="section-title">Стрик марафона артиклей</h3>
    <div class="marathon-grid">
      <div class="stat-card marathon-card easy">
        <div class="stat-icon">🔥</div>
        <div class="stat-info">
          <span class="stat-value">{{ gameStore.personalBests?.[1] || 0 }}</span>
          <span class="stat-label">{{ t('marathonPrepare.difficultEasy') }}</span>
        </div>
      </div>
      <div class="stat-card marathon-card normal">
        <div class="stat-icon">🔥</div>
        <div class="stat-info">
          <span class="stat-value">{{ gameStore.personalBests?.[2] || 0 }}</span>
          <span class="stat-label">{{ t('marathonPrepare.difficultNormal') }}</span>
        </div>
      </div>
      <div class="stat-card marathon-card hard">
        <div class="stat-icon">🔥</div>
        <div class="stat-info">
          <span class="stat-value">{{ gameStore.personalBests?.[3] || 0 }}</span>
          <span class="stat-label">{{ t('marathonPrepare.difficultHard') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { userAuthStore } from '../../store/authStore.js'
import { useRankUserStore } from '../../store/rankStore.js'
import { dailyStore } from '../../store/dailyStore.js'
import { useGameStore } from '../../store/marafonStore.js'
import { userlangStore } from '../../store/learningStore.js'
import { AWARDS } from '~/utils/awards'
import EducationHut from '../../assets/images/graduate-hat.svg'

const { t } = useI18n()
const authStore = userAuthStore()
const rankStore = useRankUserStore()
const dStore = dailyStore()
const gameStore = useGameStore()
const langStore  = userlangStore()
const completedDailyQuests = computed(() => {
  if (!dStore.todayQuests) return 0
  return dStore.todayQuests.filter(quest => quest.isCompleted).length
})

const totalAchievements = computed(() => AWARDS.length)
const unlockedAchievements = ref(0)

const calculateUnlocked = () => {
  if (typeof window === 'undefined') return
  try {
    const storageKey = `awards_shown_v1_${authStore.uid || 'anon'}`
    const raw = localStorage.getItem(storageKey)
    const shown = new Set(raw ? JSON.parse(raw) : [])

    let count = 0
    AWARDS.forEach(award => {
      if (award.key === 'registerAchievement' || shown.has(award.key)) {
        count++
      }
    })
    unlockedAchievements.value = count
  } catch (e) {
    unlockedAchievements.value = 1
  }
}

onMounted(() => {
  calculateUnlocked()
  dStore.updateProgressFromCounters()
  if (gameStore.fetchRecord) gameStore.fetchRecord()
})

watch(() => authStore.uid, () => {
  calculateUnlocked()
})

const toRoman = (n) => {
  const map = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
  return map[n] || String(n)
}

const currentRankInfo = computed(() => {
  const hats = authStore.totalHats ?? 0
  let best = {
    rankTitle: 'v-rank.rank_0',
    lvlIndex: 0,
    hatsNeed: 0,
    icon: EducationHut
  }

  for (const rank of rankStore.ranksData || []) {
    for (let idx = 0; idx < (rank.levels?.length || 0); idx++) {
      const lvl = rank.levels[idx]
      const need = lvl?.hats ?? 0

      if (hats >= need && need >= best.hatsNeed) {
        const icon = rank.icons?.[idx]?.icon ?? rank.icon ?? EducationHut
        best = { rankTitle: rank.title, lvlIndex: idx, hatsNeed: need, icon }
      }
    }
  }
  return best
})

const currentRankTitle = computed(() => {
  const titleKey = currentRankInfo.value.rankTitle
  const translatedName = t(titleKey)
  if (titleKey === 'v-rank.rank_0') {
    return translatedName
  }
  return `${translatedName} ${toRoman(currentRankInfo.value.lvlIndex + 1)}`
})

const currentRankIcon = computed(() => currentRankInfo.value.icon)

</script>

<style scoped>
.profile-wrapper {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.registration-badge {
  width: 100%;
  align-items: center;
  gap: 6px;
  background: var(--tabBg);
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid var(--tabsSlideBorderColor);
  font-size: 14px;
  font-weight: 800;
  color: var(--titleColor);
  align-self: flex-start;
  margin-bottom: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.registration-badge span {
  color: var(--titleColor);
  font-weight: 900;
}

.section-title {
  margin: 5px 0 10px 0;
  font-size: 19px;
  color: var(--titleColor);
  font-weight: 800;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.marathon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat-card {
  background-color: var(--tabBg);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--tabsSlideBorderColor);
  transition: transform 0.2s ease;
}

.stat-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
}

.stat-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.rank-icon-img {
  object-fit: contain;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: 800;
  color: var(--titleColor);
}

.stat-label {
  font-size: 12px;
  color: var(--titleColor);
  margin-top: 2px;
}

.marathon-card {
  flex-direction: column;
  justify-content: center;
  padding: 12px 6px;
  gap: 8px;
  text-align: center;
}

.marathon-card .stat-info {
  align-items: center;
}

.marathon-card .stat-label {
  font-size: 11px;
}

.marathon-card.easy .stat-icon {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(34, 197, 94, 0.25);
  border: 1px solid #16a34a;
  text-shadow: 0 2px 2px rgba(0,0,0,0.1);
}

.marathon-card.normal .stat-icon {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(245, 158, 11, 0.25);
  border: 1px solid #d97706;
  text-shadow: 0 2px 2px rgba(0,0,0,0.1);
}

.marathon-card.hard .stat-icon {
  background: linear-gradient(135deg, #f87171, #ef4444);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(239, 68, 68, 0.25);
  border: 1px solid #dc2626;
  text-shadow: 0 2px 2px rgba(0,0,0,0.1);
}

.premium-banner {
  margin-top: 20px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.25);
  position: relative;
  overflow: hidden;
}

.premium-banner::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
  transform: rotate(30deg);
  pointer-events: none;
}

.premium-banner.is-active {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
}

.premium-content h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 900;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.premium-content p {
  margin: 4px 0 0 0;
  font-size: 13px;
  font-weight: 700;
  opacity: 0.9;
}

.premium-action-btn {
  background: #ffffff;
  color: #db2777;
  border: none;
  border-radius: 14px;
  padding: 12px 20px;
  font-family: inherit;
  font-weight: 900;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.1s ease;
  z-index: 1;
}

.premium-banner.is-active .premium-action-btn {
  color: #059669;
}

.premium-action-btn:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}

@media (max-width: 480px) {
  .premium-banner {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  .premium-action-btn {
    width: 100%;
  }
}

@media (max-width: 400px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>