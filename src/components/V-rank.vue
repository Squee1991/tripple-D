<template>
  <div class="ranks-wrapper">
    <div v-for="rank in store.ranksData" :key="rank.title" class="rank-league">
      <div class="league-line">
        <span class="league-title">{{ rank.title }}</span>
      </div>

      <div class="grid">
        <div v-for="(lvl, idx) in rank.levels" :key="idx" class="card">
          <div class="card-stars">
            <span v-for="n in (idx + 1)" :key="n">★</span>
          </div>
          <div class="card-inner">
            <div class="card-icon">{{ rank.icon }}</div>
            <div class="card-label">Ранг {{ idx + 1 }}</div>
            <div class="card-cost">🎓 {{ lvl.hats }}</div>
            <div v-if="lvl.bonus" class="card-cost">🎓 {{ lvl.bonus }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRankUserStore} from '../../store/rankStore.js'
import {useSeoMeta} from "#imports";
const store = useRankUserStore()

useSeoMeta({
  robots: 'noindex, nofollow'
})

</script>

<style scoped>

.card-inner{
  display: flex;
  flex-direction: column;
}
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
  color: #ccc;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.card {
  background: white;
  padding: 30px;
  border-radius: 25px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}

.card-stars {
  color: #ffcc00;
  margin-bottom: 10px;
  font-size: 20px;
}

.card-icon {
  font-size: 60px;
  margin-bottom: 15px;
}

.card-cost {
  display: inline-block;
  background: #f1f3f5;
  padding: 5px 15px;
  border-radius: 15px;
  font-weight: 800;
  margin-top: 10px;
}
</style>