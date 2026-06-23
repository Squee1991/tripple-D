<template>
  <div class="ranks-wrapper">
    <div class="hats-info">
      <VBanner
          :text="t('v-rank.desc')"
          :icon="EducationHut"
      />
    </div>
    <div v-for="rank in store.ranksData" :key="rank.title" class="rank-league">
      <div class="league-line">
        <span class="league-title">{{ t(rank.title) }}</span>
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
            <div class="card-label">{{ t('v-rank.rank') }} {{ idx + 1 }}</div>
            <div class="card-bottom-info">
              <div class="card-cost">
                🎓 {{ lvl.hats }}
              </div>
              <div v-if="lvl.bonus"
                   class="card-bonus"
                   :class="{
                     'is-discount': typeof lvl.bonus === 'string',
                     'is-claimed': typeof lvl.bonus === 'number' && authStore.claimedBonuses?.includes(lvl.hats)
                   }">
                <span>
                  <template v-if="typeof lvl.bonus === 'number'">+</template>{{ t(lvl.bonus) }}
                </span>
                <img v-if="typeof lvl.bonus === 'number'" class="card__articlus" src="../../assets/images/article.svg" alt="articlus">
                <div v-if="typeof lvl.bonus === 'number' && authStore.claimedBonuses?.includes(lvl.hats)" class="claimed-check-circle">✔</div>
              </div>
            </div>
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
import VBanner from "~/src/components/V-banner.vue";


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
    rankTitle: 'v-rank.rank_0',
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
.hats-left {
  display: flex;
  align-items: center;
}

.ranks-wrapper {
  margin: 0 auto;
  overflow-y: auto;
  padding-bottom: 55px;
  position: relative;
}

.ranks-wrapper:after {
  background: var(--overlayAfter);
}

.ranks-wrapper::-webkit-scrollbar {
  width: 1px;
  background: none;
}

.ranks-wrapper::-webkit-scrollbar-thumb {
  background: none;
}

.ranks-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.rank-league {
  margin-top: 10px;
}

.league-line {
  border-top: 1px solid #eeeeee80;
  margin-top: 5px;
  padding-top: 10px;
  text-align: center;
}

.league-title {
  font-weight: 900;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 2px;
  -webkit-text-stroke: 1px #666;
  padding-bottom: 5px;
  position: relative;
}

.league-title:after {
  content: "";
  width: 50px;
  height: 1px;
  background: #000;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  padding-top: 13px;
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
  font-size: 22px;
  position: absolute;
  left: 50%;
  top: -3px;
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
  padding-top: 22px;
  width: 76px;
  margin-bottom: 5px;
}

.icon-grayscale {
  filter: grayscale(1);
}

.card-label {
  font-weight: 700;
  color: var(--titleColor);
  display: none;
}


.card-bottom-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.card-cost {
  background: #f1f3f5;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 14px;
  color: #495057;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}

.card-bonus {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 14px;
  background: rgba(46, 204, 113, 0.15);
  color: #27ae60;
  border: 1px solid rgba(46, 204, 113, 0.4);
  transition: all 0.3s ease;
}

.card-bonus .card__articlus {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.card-bonus.is-discount {
  background: rgba(52, 152, 219, 0.1);
  color: #2980b9;
  border-color: rgba(52, 152, 219, 0.3);
}

.card-bonus.is-claimed {
  background: #f8f9fa;
  color: #adb5bd;
  border-color: #dee2e6;
}

.card-bonus.is-claimed .card__articlus {
  filter: grayscale(1);
  opacity: 0.6;
}

.claimed-check-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2ecc71;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 10px;
  margin-left: 2px;
  box-shadow: 0 2px 4px rgba(46, 204, 113, 0.3);
}

.hats-info {
  display: flex;
  align-items: center;
  padding: 15px 0 5px 0;
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
  width: 60px;
  height: 60px;
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
    min-width: 68px;
  }
}

@media (max-width: 767px) {
  .hats-info {
    align-items: start;
  }
}

@media (max-width: 700px) {
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