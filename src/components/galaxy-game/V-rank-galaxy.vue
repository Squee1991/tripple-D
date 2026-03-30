<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGalaxyStore } from '../../store/galaxyStore.js'
import { getFirestore, collectionGroup, getDocs } from 'firebase/firestore'

const emit = defineEmits(['close'])
const store = useGalaxyStore()
const db = getFirestore()

const playersData = ref([])
const selectedFilter = ref('total')
const isLoading = ref(true)

// --- ПАГИНАЦИЯ ---
const currentPage = ref(1)
const itemsPerPage = 10

const galaxyOptions = [
  { id: 'total', label: 'ВСЯ ВСЕЛЕННАЯ' },
  { id: 'alpha', label: 'АЛЬФА СЕКТОР' },
  { id: 'beta', label: 'БЕТА СЕКТОР' },
  { id: 'gamma', label: 'ГАММА СЕКТОР' },
  { id: 'delta', label: 'ДЕЛЬТА СЕКТОР' },
  { id: 'epsilon', label: 'ЭПСИЛОН СЕКТОР' },
  { id: 'zeta', label: 'ЗЕТА СЕКТОР' }
]

const fetchLeaderboard = async () => {
  isLoading.value = true
  try {
    const querySnapshot = await getDocs(collectionGroup(db, 'game_data'))
    const tempPlayers = []

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      if (data.highScores) {
        const scores = data.highScores
        const totalScore = Object.values(scores).reduce((accumulator, current) => accumulator + current, 0)
        const shipInfo = store.tankList.find(tank => tank.id === data.selectedTankId) || store.tankList[0]

        tempPlayers.push({
          uid: docSnapshot.ref.parent.parent.id,
          captainName: data.captainName || 'АНОНИМ',
          shipImg: shipInfo.img,
          highScores: scores,
          totalScore: totalScore
        })
      }
    })
    playersData.value = tempPlayers
  } catch (error) {
    console.error("Ошибка загрузки рейтинга:", error)
  } finally {
    isLoading.value = false
  }
}

const sortedLeaderboard = computed(() => {
  const filter = selectedFilter.value

  const activePlayers = playersData.value.filter(player => {
    const score = filter === 'total' ? player.totalScore : (player.highScores[filter] || 0)
    return score > 0
  })

  return activePlayers.sort((playerA, playerB) => {
    const scoreA = filter === 'total' ? playerA.totalScore : (playerA.highScores[filter] || 0)
    const scoreB = filter === 'total' ? playerB.totalScore : (playerB.highScores[filter] || 0)
    return scoreB - scoreA
  })
})

// --- ЛОГИКА ПАГИНАЦИИ ---
// Сбрасываем страницу на 1 при смене фильтра
watch(selectedFilter, () => {
  currentPage.value = 1
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(sortedLeaderboard.value.length / itemsPerPage))
})

const paginatedLeaderboard = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedLeaderboard.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Хелпер для сохранения реального места игрока
const getGlobalIndex = (localIndex) => {
  return (currentPage.value - 1) * itemsPerPage + localIndex
}

const getPlayerScore = (player) => {
  if (selectedFilter.value === 'total') return player.totalScore
  return player.highScores[selectedFilter.value] || 0
}

onMounted(() => {
  fetchLeaderboard()
})
</script>

<template>
  <div class="leaderboard-fullscreen">
    <div class="leaderboard__inner">
      <div class="animated-bg">
        <div class="cartoon-clouds"></div>
      </div>
      <div class="leaderboard-header">
        <button class="toon-btn-back" @click="$emit('close')">
          <span class="btn-face">◀ НАЗАД</span>
        </button>
        <div class="header-main">
          <h2 class="toon-title">ТОП ПИЛОТОВ</h2>
          <div class="filter-bubble">
            <select v-model="selectedFilter" class="toon-select">
              <option v-for="option in galaxyOptions" :key="option.id" :value="option.id">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="leaderboard-scroll-area">
        <div v-if="isLoading" class="toon-loader">
          <div class="bouncing-ship">🚀</div>
          <span>СКАНИРУЮ...</span>
        </div>
        <div v-else-if="sortedLeaderboard.length === 0" class="empty-state">
          <div class="sad-moon">🌑</div>
          <p class="empty-text">В ЭТОМ СЕКТОРЕ ПУСТО</p>
          <span class="empty-subtext">Стань первым, кто покорит эту систему!</span>
        </div>
        <div v-else>
          <div class="players-grid">
            <div
                v-for="(player, index) in paginatedLeaderboard"
                :key="player.uid"
                class="player-card"
                :class="{
                'gold': getGlobalIndex(index) === 0,
                'silver': getGlobalIndex(index) === 1,
                'bronze': getGlobalIndex(index) === 2
              }"
            >
              <div class="rank-badge">
                <span v-if="getGlobalIndex(index) === 0">👑</span>
                <span v-else>{{ getGlobalIndex(index) + 1 }}</span>
              </div>
              <div class="ship-container">
                <img :src="player.shipImg" :alt="player.captainName" class="floating-ship"/>
              </div>
              <div class="details">
                <div class="name-tag">{{ player.captainName }}</div>
                <div class="score-pill">
                  <span class="score-val">{{ getPlayerScore(player).toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination-controls" v-if="totalPages > 1">
            <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">◀</button>
            <div class="page-info">
              СТРАНИЦА {{ currentPage }} ИЗ {{ totalPages }}
            </div>
            <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">▶</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.leaderboard-fullscreen {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 6000;
  background: #4facfe;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  box-sizing: border-box;
  font-family: 'Arial Rounded MT Bold', 'Arial Black', sans-serif;
  overflow: hidden;
}

.leaderboard__inner {
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}

.animated-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%);
}

.cartoon-clouds {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(white 1.5px, transparent 1.5px);
  background-size: 30px 30px;
  opacity: 0.2;
}

.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  color: white;
}

.toon-btn-back {
  background: #ff4b2b;
  border: 4px solid #000;
  border-radius: 50px;
  padding: 10px 25px;
  cursor: pointer;
  box-shadow: 0 6px 0 #000;
  transition: 0.1s;
}

.toon-btn-back:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 #000;
}

.btn-face {
  color: white;
  font-weight: 900;
  text-shadow: 2px 2px 0 #000;
  font-size: 1.1rem;
}

.header-main {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.toon-title {
  font-size: 1.8rem;
  margin: 0;
  color: #fff;
  -webkit-text-stroke: 2px #000;
  text-shadow: 6px 6px 0 rgba(0, 0, 0, 0.2);
  transform: rotate(-1deg);
}

.filter-bubble {
  background: #FFFFFF;
  border: 4px solid #000;
  border-radius: 20px;
  padding: 5px 15px;
  box-shadow: 4px 4px 0 #000;
}

.toon-select {
  background: none;
  border: none;
  font-family: inherit;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
}

.leaderboard-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
}

.players-grid {
  display: grid;
  gap: 20px;
  padding-bottom: 30px;
}

.player-card {
  display: flex;
  align-items: center;
  background: white;
  border: 4px solid #000;
  border-radius: 30px;
  padding: 10px 15px;
  position: relative;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.1);
  transition: 0.2s;
}

.gold {
  background: #ffd700;
  border-color: #000;
  box-shadow: 0 8px 0 #d4af37;
}

.silver {
  background: #e0e0e0;
  border-color: #000;
  box-shadow: 0 8px 0 #a0a0a0;
}

.bronze {
  background: #cd7f32;
  border-color: #000;
  box-shadow: 0 8px 0 #8c5922;
}

.rank-badge {
  width: 50px;
  height: 50px;
  background: #fff;
  border: 4px solid #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  margin-right: 7px;
  flex-shrink: 0;
}

.ship-container {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.floating-ship {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.details {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name-tag {
  font-size: 1.3rem;
  font-weight: 900;
  color: #1a1a1a;
  text-transform: uppercase;
}

.score-pill {
  display: inline-flex;
  align-items: center;
  background: #1a1a1a;
  color: #fff;
  padding: 4px 15px;
  border-radius: 50px;
}

.score-val {
  color: #ccff00;
  font-size: 1.1rem;
}

.score-pts {
  font-size: 0.6rem;
  margin-left: 5px;
  opacity: 0.7;
}

.toon-loader {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  font-size: 1.5rem;
  text-shadow: 2px 2px 0 #000;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-30px);
  }
}

.leaderboard-footer {
  text-align: center;
  padding: 15px;
}

.sync-tag {
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  display: inline-block;
  padding: 5px 20px;
  border-radius: 50px;
  font-size: 0.7rem;
  letter-spacing: 2px;
}

@media (max-width: 767px) {
  .leaderboard-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .header-main {
    align-items: center;
  }

  .player-card {
    padding: 8px 10px;
  }

  .ship-container {
    width: 40px;
    height: 40px;
  }

  .name-tag {
    font-size: 15px;
  }

  .rank-badge {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px 0 40px 0;
}

.page-btn {
  background: #ffeb3b;
  border: 4px solid #000;
  border-radius: 15px;
  padding: 10px 20px;
  font-size: 1.2rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 4px 0 #000;
  transition: transform 0.1s, box-shadow 0.1s;
}

.page-btn:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 #000;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-info {
  background: white;
  border: 4px solid #000;
  padding: 10px 20px;
  border-radius: 15px;
  font-weight: 900;
  box-shadow: 0 4px 0 #000;
}

@media (max-width: 767px) {
  .pagination-controls {
    gap: 10px;
  }
  .page-btn {
    padding: 8px 15px;
    font-size: 1rem;
  }
  .page-info {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
}
</style>