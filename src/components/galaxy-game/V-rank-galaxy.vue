<template>
  <div class="leaderboard-fullscreen">
    <div class="animated-bg">
      <div class="cartoon-clouds"></div>
    </div>
    <div class="leaderboard__inner">
      <div class="leaderboard-header">
        <div class="header-main">
          <button @click="$emit('close')" class="btn-icon-back">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="#2b2b2b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <h2 class="toon-title">{{ t('galaxyRankTable.title')}}</h2>
        </div>
      </div>
      <div class="filter-bubble">
        <select v-model="selectedFilter" class="toon-select">
          <option v-for="option in galaxyOptions" :key="option.id" :value="option.id">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="leaderboard-scroll-area">
        <div v-if="isLoading" class="toon-loader">
          <div class="bouncing-ship">🚀</div>
          <span>{{ t('galaxyRankTable.scan')}}</span>
        </div>
        <div v-else-if="sortedLeaderboard.length === 0" class="empty-state">
          <div class="sad-moon">🌑</div>
          <p class="empty-text">{{ t('galaxyRankTable.empty')}}</p>
          <span class="empty-subtext">{{ t('galaxyRankTable.empty')}}</span>
        </div>
        <div v-else class="players-grid">
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
      </div>
      <div class="pagination-controls" v-if="!isLoading && totalPages > 1">
        <button class="page-btn" @click="prevPage" :disabled="currentPage === 1">◀</button>
        <div class="page-info">
          {{ currentPage }} / {{ totalPages }}
        </div>
        <button class="page-btn" @click="nextPage" :disabled="currentPage === totalPages">▶</button>
      </div>
    </div>
  </div>
</template>

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
const { t } = useI18n()
const currentPage = ref(1)
const itemsPerPage = 10

const galaxyOptions = [
  { id: 'total', label: t('galaxyList.all') },
  { id: 'alpha', label: t('galaxyList.alpha') },
  { id: 'beta', label: t('galaxyList.beta') },
  { id: 'gamma', label: t('galaxyList.gamma') },
  { id: 'delta', label: t('galaxyList.delta') },
  { id: 'epsilon', label: t('galaxyList.epsilon') },
  { id: 'zeta', label: t('galaxyList.zeta') }
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
          captainName: data.captainName || 'Anonymous',
          shipImg: shipInfo?.img || '',
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

<style scoped>

.leaderboard-fullscreen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  font-family: "Nunito", sans-serif;
  overflow: hidden;
  z-index: 6000;
}

.leaderboard__inner {
  max-width: 1000px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  min-height: 0;
}

.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: white;
}

.btn-icon-back {
  background: #fff;
  border: 3px solid #2b2b2b;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 2px 0px #2b2b2b;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.header-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toon-title {
  font-size: 22px;
  color: var(--titleColor);
  margin-left: 10px;
}

.filter-bubble {
  background: #FFFFFF;
  border: 3px solid #000;
  border-radius: 16px;
  padding: 5px 12px;
  box-shadow: 3px 3px 0 #000;
  margin-bottom: 10px;
  width: max-content;
  max-width: 100%;
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
  min-height: 0;
  padding-bottom: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.leaderboard-scroll-area::-webkit-scrollbar {
  display: none;
}

.players-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.player-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 20px;
  padding: 8px 12px;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
}

.gold {
  background: #ffd700;
  box-shadow: 0 4px 0 #d4af37;
}

.silver {
  background: #e0e0e0;
  box-shadow: 0 4px 0 #a0a0a0;
}

.bronze {
  background: #cd7f32;
  box-shadow: 0 4px 0 #8c5922;
}

.rank-badge {
  width: 44px;
  height: 44px;
  background: #fff;
  border: 3px solid #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 900;
  margin-right: 10px;
  flex-shrink: 0;
}

.ship-container {
  width: 44px;
  height: 44px;
  margin-right: 10px;
  flex-shrink: 0;
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
  min-width: 0;
}

.name-tag {
  font-size: 1.1rem;
  font-weight: 900;
  color: #1a1a1a;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 8px;
}

.score-pill {
  display: inline-flex;
  align-items: center;
  background: #1a1a1a;
  color: #fff;
  padding: 4px 12px;
  border-radius: 50px;
  flex-shrink: 0;
}

.score-val {
  color: #ccff00;
  font-size: 1rem;
  font-weight: 900;
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
  from { transform: translateY(0); }
  to { transform: translateY(-20px); }
}

.bouncing-ship {
  animation: bounce 0.5s infinite alternate ease-in-out;
  font-size: 3rem;
  margin-bottom: 10px;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding-top: 10px;
  padding-bottom: 5px;
  flex-shrink: 0;
}

.page-btn {
  background: #ffeb3b;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 1.1rem;
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
  box-shadow: 0 2px 0 #888;
  transform: translateY(2px);
}

.page-info {
  background: white;
  border: 3px solid #000;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 900;
  box-shadow: 0 4px 0 #000;
}

@media (max-width: 767px) {

  .player-card {
    padding: 6px 10px;
  }
  .rank-badge {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  .ship-container {
    width: 36px;
    height: 36px;
  }
  .name-tag {
    font-size: 13px;
  }
  .page-btn {
    padding: 6px 14px;
    font-size: 1rem;
  }
  .page-info {
    padding: 6px 14px;
    font-size: 0.9rem;
  }
}
</style>