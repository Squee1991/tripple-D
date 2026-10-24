<template>
  <div class="hud-screen leaderboard">
    <div class="hud-column">
      <div class="hud-topbar">
        <button class="btn-icon-back" @click="$emit('close')" aria-label="back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h2 class="hud-title">{{ t('galaxyRankTable.title') }}</h2>
      </div>

      <!-- Выбор галактики: лента вкладок -->
      <div class="hud-tabs">
        <button v-for="option in galaxyOptions" :key="option.id" class="hud-tab"
                :class="{ 'is-active': selectedFilter === option.id }" @click="selectedFilter = option.id">
          {{ option.label }}
        </button>
      </div>

      <div class="hud-scroll">
        <div v-if="isLoading" class="state">
          <ClientOnly>
            <DotLottieVue :data="scanningAnimation" :loop="true" :autoplay="true" class="state__animation"/>
          </ClientOnly>
          <span class="state__text">{{ t('galaxyRankTable.scan') }}</span>
        </div>
        <div v-else-if="playersData.length === 0" class="state">
          <div class="state__icon">🌑</div>
          <span class="state__text">{{ t('galaxyRankTable.empty') }}</span>
          <span class="state__subtext">{{ t('galaxyRankTable.emptySub') }}</span>
        </div>
        <div v-else class="players">
          <div v-for="(player, index) in playersData" :key="player.uid" class="hud-panel player"
               :class="[placeClass(index), { 'is-me': player.uid === myUid }]">
            <span class="player__place">
              <template v-if="index < 3">{{ MEDALS[index] }}</template>
              <template v-else>{{ index + 1 }}</template>
            </span>
            <img :src="player.shipImg" :alt="player.captainName" class="player__ship"/>
            <span class="player__name">{{ player.captainName }}</span>
            <span class="player__score">
              <span class="player__score-label">{{ t('galaxyCabinet.streak') }}</span>
              {{ getPlayerScore(player).toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useGalaxyStore} from '~/store/galaxyStore.js'
import {userAuthStore} from '~/store/authStore.js'
import {getFirestore, collectionGroup, getDocs, query, orderBy, limit} from 'firebase/firestore'
import {useI18n} from 'vue-i18n'
import {DotLottieVue} from '@lottiefiles/dotlottie-vue'
import HedgehogScanning from '~/assets/animation/hedgehog_tablet_green.json'

const emit = defineEmits(['close'])
const store = useGalaxyStore()
const authStore = userAuthStore()
const db = getFirestore()

const playersData = ref([])
const selectedFilter = ref('alpha')
const isLoading = ref(true)
const {t} = useI18n()

const MEDALS = ['🥇', '🥈', '🥉']
// Ёжик в скафандре «сканирует» сектор — показываем его не меньше этого времени, даже если данные пришли быстрее
const MIN_SCANNING_TIME_MS = 1200
const scanningAnimation = JSON.stringify(HedgehogScanning)
const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds))
const myUid = computed(() => authStore.uid)

function placeClass(index) {
  return ['is-gold', 'is-silver', 'is-bronze'][index] || ''
}

const galaxyOptions = [
  {id: 'alpha', label: t('galaxyList.alpha')},
  {id: 'beta', label: t('galaxyList.beta')},
  {id: 'gamma', label: t('galaxyList.gamma')},
  {id: 'delta', label: t('galaxyList.delta')},
  {id: 'epsilon', label: t('galaxyList.epsilon')},
  {id: 'zeta', label: t('galaxyList.zeta')}
]

// Номер последнего запроса: если вкладку переключили, ответ старого запроса не показываем
let latestRequestNumber = 0

const fetchLeaderboard = async () => {
  const requestNumber = ++latestRequestNumber
  isLoading.value = true
  playersData.value = []

  try {
    const filter = selectedFilter.value
    const orderField = filter === 'total' ? 'totalScore' : `highScores.${filter}`

    const leaderboardQuery = query(
        collectionGroup(db, 'game_data'),
        orderBy(orderField, 'desc'),
        limit(10)
    )

    const [querySnapshot] = await Promise.all([getDocs(leaderboardQuery), wait(MIN_SCANNING_TIME_MS)])
    if (requestNumber !== latestRequestNumber) return
    const players = []

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data()
      const scores = data.highScores || {}
      const total = data.totalScore || Object.values(scores).reduce((sum, score) => sum + score, 0)
      const shipInfo = store.tankList.find(tank => tank.id === data.selectedTankId) || store.tankList[0]

      if ((filter === 'total' && total > 0) || (filter !== 'total' && scores[filter] > 0)) {
        players.push({
          uid: docSnapshot.ref.parent.parent.id,
          captainName: data.captainName || 'Anonymous',
          shipImg: shipInfo?.img || '',
          highScores: scores,
          totalScore: total
        })
      }
    })

    playersData.value = players
  } catch (error) {
    console.error(error)
  } finally {
    if (requestNumber === latestRequestNumber) isLoading.value = false
  }
}

watch(selectedFilter, () => {
  fetchLeaderboard()
})

onMounted(() => {
  fetchLeaderboard()
})

const getPlayerScore = (player) => {
  if (selectedFilter.value === 'total') return player.totalScore
  return player.highScores[selectedFilter.value] || 0
}
</script>

<style src="~/assets/styles/galaxyHud.css"></style>

<style scoped>
.leaderboard {
  z-index: 6000;
}

.players {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
}

.player.is-gold {
  background: linear-gradient(90deg, rgba(255, 196, 60, 0.38) 0%, rgba(20, 38, 92, 0.42) 75%);
}

.player.is-silver {
  background: linear-gradient(90deg, rgba(200, 215, 235, 0.3) 0%, rgba(20, 38, 92, 0.42) 75%);
}

.player.is-bronze {
  background: linear-gradient(90deg, rgba(214, 130, 70, 0.34) 0%, rgba(20, 38, 92, 0.42) 75%);
}

/* Своя строка подсвечена голубым */
.player.is-me {
  background: linear-gradient(90deg, rgba(70, 140, 255, 0.6) 0%, rgba(32, 72, 180, 0.45) 100%);
}

.player__place {
  flex: none;
  width: 30px;
  color: #9fc2ea;
  font-size: 17px;
  font-weight: 900;
  text-align: center;
}

.player.is-gold .player__place,
.player.is-silver .player__place,
.player.is-bronze .player__place {
  font-size: 24px;
}

.player__ship {
  flex: none;
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.player__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
}

/* Рекорд — как в бортовом журнале: маленькая подпись «РЕКОРД:» и число */
.player__score {
  flex: none;
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: #ffffff;
  font-size: 18px;
  font-weight: 900;
}

.player__score-label {
  color: #7fa7d9;
  font-size: 11px;
  font-weight: 800;
}

.player.is-gold .player__score {
  color: #ffd56b;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  text-align: center;
}

.state__icon {
  font-size: 54px;
}

.state__animation {
  width: min(80vw, 320px);
  height: min(80vw, 320px);
}

.state__text {
  color: #eaf4ff;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 1px;
}

.state__subtext {
  color: #7fa7d9;
  font-size: 14px;
  font-weight: 700;
}
</style>
