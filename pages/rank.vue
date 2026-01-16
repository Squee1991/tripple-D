<template>
  <div class="ranks-wrapper">
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

            <div class="card-cost">
              🎓 {{ lvl.hats }}
            </div>

            <div v-if="lvl.bonus" class="card-bonus">
              🎁 {{ lvl.bonus }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRankUserStore } from '../../store/rankStore.js'
import { userAuthStore } from '../../store/authStore.js'
import { useSeoMeta } from "#imports"

const store = useRankUserStore()
const authStore = userAuthStore()

useSeoMeta({
  robots: 'noindex, nofollow'
})

</script>

<style scoped>
.ranks-wrapper {
  padding: 40px 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.rank-league {
  margin-bottom: 50px;
}

.league-line {
  border-bottom: 1px solid #eee;
  margin-bottom: 25px;
  padding-bottom: 10px;
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
  padding: 20px;
  border-radius: 25px;
  text-align: center;
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
  margin-bottom: 10px;
  font-size: 20px;
}

.star-active {
  color: #ffcc00;
}

.card-icon img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 15px;
  transition: filter 0.3s ease;
}

.icon-grayscale {
  filter: grayscale(1);
}

.card-label {
  font-weight: 700;
  margin-bottom: 5px;
}

.card-cost {
  display: inline-block;
  background: #f1f3f5;
  padding: 5px 15px;
  border-radius: 15px;
  font-weight: 800;
  margin-top: 10px;
}

.card-bonus {
  margin-top: 8px;
  font-size: 0.9em;
  color: #2f9e44;
  font-weight: 700;
}
</style>