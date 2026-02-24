<template>
<!--  <div class="empty-content">-->
<!--    <div class="empty-icon">🔰</div>-->
<!--    <h3 class="empty-title">{{ t('regionsModal.title')}}</h3>-->
<!--  </div>-->
  <div class="ranks-wrapper">
    <div class="hats-info">
      <div class="hats-left">
        <div class="hats-badge" aria-hidden="true">
          <img :src="currentRankIcon" :alt="currentRankTitle"/>
        </div>

        <div class="hats-meta">
          <div class="hats-rank">{{ currentRankTitle }}</div>

          <div class="hats-hatsline">
            <img class="hat-img" :src="EducationHut" alt="Конфератки"/>
            <span class="hat-value">{{ authStore.totalHats }}</span>
          </div>
        </div>
      </div>

      <div class="hats-right">
        <div class="hats-text">
          Конфератки — это ваш путь к вершине! Накапливайте их, выполняйте все три задания дня. Повышайте свой ранг и покупайте разблокированные бонусы!
        </div>
      </div>
    </div>

    <div v-for="rank in store.ranksData" :key="rank.title" class="rank-league">
      <div class="league-line">
        <span class="league-title">{{ rank.title }}</span>
      </div>
      <div class="grid">
        <div
            v-for="(lvl, idx) in rank.levels"
            :key="idx"
            class="card"
            :class="{
            'is-locked': authStore.totalHats < lvl.hats,
            'is-reached': authStore.totalHats >= lvl.hats
          }"
        >
          <div class="card-stars">
            <span
                v-for="n in (idx + 1)"
                :key="n"
                :class="{ 'star-active': authStore.totalHats >= lvl.hats }"
            >★</span>
          </div>
          <div class="card-inner">
            <div class="card-icon">
              <img
                  :src="rank.icons ? rank.icons[idx].icon : rank.icon"
                  :alt="rank.title"
                  :class="{ 'icon-grayscale': authStore.totalHats < lvl.hats }"
              />
            </div>
            <div class="card-label">Ранг {{ idx + 1 }}</div>
            <div class="card-cost">🎓 {{ lvl.hats }}</div>
            <div v-if="lvl.bonus" class="card-bonus">{{ lvl.bonus }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRankUserStore} from '~/store/rankStore.js'
import {userAuthStore} from '~/store/authStore.js'
import {useSeoMeta} from "#imports"
import EducationHut from '../../assets/images/graduate-hat.svg'
const { t } = useI18n()
const store = useRankUserStore()
const authStore = userAuthStore()

useSeoMeta({robots: 'noindex, nofollow'})

const toRoman = (n) => {
  const map = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
  return map[n] || String(n)
}

const currentRankInfo = computed(() => {
  const hats = authStore.totalHats ?? 0

  let best = {
    rankTitle: 'Новичок',
    lvlIndex: 0,
    hatsNeed: 0,
    icon: EducationHut
  }

  for (const rank of store.ranksData || []) {
    for (let idx = 0; idx < (rank.levels?.length || 0); idx++) {
      const lvl = rank.levels[idx]
      const need = lvl?.hats ?? 0

      if (hats >= need && need >= best.hatsNeed) {
        const icon = rank.icons?.[idx]?.icon ?? rank.icon ?? EducationHut
        best = {rankTitle: rank.title, lvlIndex: idx, hatsNeed: need, icon}
      }
    }
  }

  return best
})

const currentRankTitle = computed(() => {
  return `${currentRankInfo.value.rankTitle} ${toRoman(currentRankInfo.value.lvlIndex + 1)}`
})

const currentRankIcon = computed(() => currentRankInfo.value.icon)
</script>


<style scoped>
.hats-left {
  display: flex;
  align-items: center;
}

.ranks-wrapper {
  margin: 0 auto;
  overflow-y: auto;
  max-height: calc(100vh - 250px);
}

.ranks-wrapper::-webkit-scrollbar {
  width: 10px;
}

.ranks-wrapper::-webkit-scrollbar-thumb {
  background: var(--titleColor);
  border-radius: 10px;
  border: 2px solid #fff;
}

.ranks-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.rank-league {
  margin-bottom: 10px;
}

.league-line {
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
  padding-bottom: 10px;
  text-align: center;
}

.league-title {
  font-weight: 900;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.card {
  padding: 3px;
  text-align: center;
  position: relative;
}

.card.is-locked {
  opacity: 0.6;
}

.card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-stars {
  color: #e0e0e0;
  font-size: 20px;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}

.star-active {
  color: #ffcc00;
}

.card-icon img {

  object-fit: contain;
  transition: filter 0.3s ease;
}

.card-icon {
  padding-top:10px;
  width: 85px;
  height: 85px;
}

.icon-grayscale {
  filter: grayscale(1);
}

.card-label {
  font-weight: 700;
  color: var(--titleColor);
}

.card-cost {
  display: inline-block;
  background: #f1f3f5;
  padding: 5px;
  border-radius: 10px;
  font-weight: 800;
  margin-top: 5px;
}

.card-bonus {
  margin-top: 8px;
  font-size: 0.8em;
  color: #2f9e44;
  font-weight: 700;
}

.hats-info {
  display: flex;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 15px;
}

.hats-badge {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}


.hats-badge img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  display: block;
}

.hats-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hats-rank {
  font-weight: 900;
  font-size: 20px;
  color: var(--titleColor);
  line-height: 1.05;

  white-space: nowrap;
}

.hats-hatsline {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.hat-img {
  width: 38px;
  height: 38px;
  object-fit: contain;
  display: block;
}

.hat-value {
  font-weight: 900;
  font-size: 16px;
  color: var(--titleColor);
}

.hats-right {
  min-width: 0;
  display: flex;
  align-items: center;
  border-left: 4px solid #1bb06d;
  padding-left: 10px;
  margin-left: 25px;
}

.hats-text {
  color: var(--titleColor);
}

.hats-stars-row {
  grid-column: 1 / -1;
  grid-row: 2;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 6px;
}

.hats-stars-row::before,
.hats-stars-row::after {
  content: "";
  height: 1px;
  background: rgba(0, 0, 0, 0.18);
  flex: 1;
  max-width: 220px;
}

.hats-stars-row .stars {
  color: rgba(0, 0, 0, 0.22);
  letter-spacing: 6px;
  font-size: 18px;
}

@media (max-width: 1023px) {
  .grid {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 10px 10px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }

  .card {
    width: 220px;
    scroll-snap-align: start;
  }

  .grid::-webkit-scrollbar {
    height: 0;
  }

  .grid {
    scrollbar-width: none;
    display: flex;
    justify-content: center;
  }

  .hats-badge,
  .hats-badge img {
    width: 80px;
    height: 80px;
  }

  .hats-rank {
    font-size: 20px;
  }

  .hats-text {
    font-size: 13px;
  }

  .hats-left {
    min-width: 200px;
  }
}

@media (max-width: 767px) {
  .hats-info {
    align-items: start;
  }
}

@media (max-width: 700px) {
  .hats-info {
    flex-direction: column;
  }

  .hats-text {
    font-size: 12px;
  }

  .hats-right {
    margin: 0;
  }
}

.map-empty-placeholder {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin-top: 10px;
  color: var(--titleColor);
}

.empty-content {
  max-width: 400px;
  text-align: center;
  margin: 30px auto;

}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--titleColor);
  margin-bottom: 10px;
  text-transform: uppercase;
}

.empty-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #444;
  line-height: 1.4;
}

</style>