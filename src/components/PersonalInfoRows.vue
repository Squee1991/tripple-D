<template>
  <div class="profile-wrapper">
    <h3 class="section-title">{{ t('personalAccount.statsAndAchievements') }}</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon xp-icon">
          <img src="../../assets/images/daily.svg" alt="daily">
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ completedDailyQuests }} / 3</span>
          <span class="stat-label">{{t('dailyPanel.title')}}</span>
        </div>
      </div>
      <div class="stat-card">
        <!-- Добавлен класс title-icon для точечного увеличения -->
        <div class="stat-icon title-icon">
          <img :src="currentRankIcon" alt="Rank" class="rank-icon-img" />
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ currentRankTitle }}</span>
          <span class="stat-label">{{ t('galaxyCabinet.rank')}}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon achievement-icon">
          <img src="../../assets/images/rewards.svg" alt="rewards">
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ unlockedAchievements }} / {{ totalAchievements }}</span>
          <span class="stat-label">{{ t('awardModal.title')}}</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon streak-icon">
          <img src="../../assets/images/assurance.svg" alt="assurance">
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ langStore.isLeveling }} </span>
          <span class="stat-label">{{ t('stepHitLabels.levelTitle')}}</span>
        </div>
      </div>
    </div>
    <VBanner
        :text="t('personalAccount.streakTitle')"
        :icon="Streakicon"
    />
    <div class="marathon-grid">
      <div class="stat-card marathon-card easy">
        <div class="difficulty-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="14" width="5" height="8" rx="2.5" fill="#ffffff"/>
            <rect x="9.5" y="8" width="5" height="14" rx="2.5" fill="rgba(255,255,255,0.4)"/>
            <rect x="17" y="2" width="5" height="20" rx="2.5" fill="rgba(255,255,255,0.4)"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ gameStore.personalBests?.[1] || 0 }}</span>
          <span class="stat-label">{{ t('marathonPrepare.difficultEasy') }}</span>
        </div>
      </div>
      <div class="stat-card marathon-card normal">
        <div class="difficulty-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="14" width="5" height="8" rx="2.5" fill="#ffffff"/>
            <rect x="9.5" y="8" width="5" height="14" rx="2.5" fill="#ffffff"/>
            <rect x="17" y="2" width="5" height="20" rx="2.5" fill="rgba(255,255,255,0.4)"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ gameStore.personalBests?.[2] || 0 }}</span>
          <span class="stat-label">{{ t('marathonPrepare.difficultNormal') }}</span>
        </div>
      </div>
      <div class="stat-card marathon-card hard">
        <div class="difficulty-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="14" width="5" height="8" rx="2.5" fill="#ffffff"/>
            <rect x="9.5" y="8" width="5" height="14" rx="2.5" fill="#ffffff"/>
            <rect x="17" y="2" width="5" height="20" rx="2.5" fill="#ffffff"/>
          </svg>
        </div>
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
import VBanner from "~/src/components/V-banner.vue";
import Streakicon from '../../assets/images/fire.svg'

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
  height: 100%;
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
  margin-bottom: 23px;
}

.marathon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stat-card {
  background-color: var(--tabBg);
  border-radius: 12px;
  padding: 15px 11px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--tabsSlideBorderColor);
  transition: transform 0.2s ease;
}

.stat-icon {
  font-size: 24px;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.stat-icon.title-icon {
  width: 54px;
  height: 54px;
}

.stat-icon img {
  width: 100%;
  height: 100%;
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
  padding: 18px 6px;
  gap: 8px;
  text-align: center;
}

.difficulty-icon {
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  margin-bottom: 4px;
}

.marathon-card.easy .difficulty-icon {
  background: linear-gradient(135deg, #4ade80, #22c55e);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(34, 197, 94, 0.25);
  border: 1px solid #16a34a;
}

.marathon-card.normal .difficulty-icon {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(245, 158, 11, 0.25);
  border: 1px solid #d97706;
}

.marathon-card.hard .difficulty-icon {
  background: linear-gradient(135deg, #f87171, #ef4444);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(239, 68, 68, 0.25);
  border: 1px solid #dc2626;
}

@media (max-width: 400px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>