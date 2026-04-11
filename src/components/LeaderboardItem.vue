<script setup>
import {computed, defineProps} from 'vue'
import {userAuthStore} from '../../store/authStore.js'
import GoldMedal from '../../assets/images/ranked-medals/GoldMedal.svg'
import SilverMedal from '../../assets/images/ranked-medals/SilverMedal.svg'
import BronzeMedal from '../../assets/images/ranked-medals/BronzeMedal.svg'

const props = defineProps({
  player: {type: Object, required: true},
  rank: {type: Number, required: true},
  isCurrentUser: {type: Boolean, required: true},
  scoreField: {type: String, default: 'guessed'},
  scoreUnit: {type: String}
})

const medalByRank = {
  1: {src: GoldMedal, alt: 'Gold medal'},
  2: {src: SilverMedal, alt: 'Silver medal'},
  3: {src: BronzeMedal, alt: 'Bronze medal'}
}

const medal = computed(() => medalByRank[props.rank] ?? null)

const authStore = userAuthStore()

const playerScore = computed(() => props.player[props.scoreField] || 0)

const rankClass = computed(() => {
  if (props.rank === 1) return 'rank--gold'
  if (props.rank === 2) return 'rank--silver'
  if (props.rank === 3) return 'rank--bronze'
  return 'rank--default'
})
</script>

<template>
  <li class="leaderboard-item" :class="{ 'leaderboard-item--current': isCurrentUser }">
    <div class="leaderboard-player-info">
      <div class="leaderboard-player-rank" :class="rankClass">
        <img v-if="medal" :src="medal.src" :alt="medal.alt" class="rank-medal"/>
        <span v-else>#{{ rank }}</span>
      </div>
      <img class="leaderboard-player-avatar"
           :src="isCurrentUser ? authStore.avatarUrl : authStore.getAvatarUrl(player.avatar)"
           alt="avatar"
      />
      <span class="leaderboard-player-name">{{ player.name }}</span>
    </div>
    <div class="leaderboard-score-wrapper">
      <span class="leaderboard-player-score">
        {{ playerScore }} {{ scoreUnit }}
      </span>
    </div>
  </li>
</template>

<style scoped>
.leaderboard-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 5px;
  margin-bottom: 10px;
  background: #fff7b8;
  border: 3px solid #1e1e1e;
  border-radius: 18px;
  box-shadow: 2px 2px 0 #1e1e1e;
  font-family: "Nunito", sans-serif;
}

.leaderboard-item--current {
  background: #c9ffbf;
  box-shadow: 4px 4px 0 #1e1e1e;
}

.leaderboard-player-info {
  display: flex;
  align-items: center;
  gap: 5px;
}

.leaderboard-player-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: #fff;
  border: 3px solid #1e1e1e;
  box-shadow: 1px 1px 0 #1e1e1e;
}

.leaderboard-player-name {
  font-size: .9rem;
  font-weight: 800;
  color: #1e1e1e;
  letter-spacing: 0.3px;
}

.leaderboard-player-rank {
  min-width: 38px;
  text-align: center;
  font-weight: 900;
  font-size: 1.6rem;
  line-height: 1;
}

.rank--default {
  color: #000000;
}

.leaderboard-score-wrapper {
  min-width: 52px;
  padding: 1px 10px;
  background: #ffd6a5;
  border: 2px solid #1e1e1e;
  border-radius: 22px;
  box-shadow: 2px 2px 0 #1e1e1e;
  display: flex;
  justify-content: center;
  align-items: center;
}

.leaderboard-player-score {
  font-weight: 900;
  font-size: 1rem;
  color: #1e1e1e;
  width: 40px;
}

@media (max-width: 767px) {


  .leaderboard-player-name {
    font-size: 1.1rem;
  }

  .leaderboard-player-rank {
    min-width: 40px;
    font-size: 1.4rem;
  }

  .rank--gold {
    font-size: 1.7rem;
  }

  .rank--silver {
    font-size: 1.6rem;
  }

  .rank--bronze {
    font-size: 1.5rem;
  }

  .leaderboard-score-wrapper {
    padding: 3px 0;
  }

  .leaderboard-player-score {
    font-size: 1rem;
    text-align: center;
  }
}

.rank-medal {
  width: 45px;
  height: 45px;
  object-fit: contain;
  display: inline-block;
}

@media (max-width: 767px) {
  .rank-medal {
    width: 28px;
    height: 28px;
  }
}
</style>
