<script setup>
import {computed, defineProps} from 'vue'
import {userAuthStore} from '../../store/authStore.js'
import GoldMedal from '../../assets/images/ranked-medals/GoldMedal.svg'
import SilverMedal from '../../assets/images/ranked-medals/SilverMedal.svg'
import BronzeMedal from '../../assets/images/ranked-medals/BronzeMedal.svg'
import VTransition from "~/src/components/V-transition.vue";
const isMounted = ref(false);
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

onMounted(() => {
  setTimeout(()=> {
    isMounted.value = true
  }, 90)
})

</script>

<template>
  <div v-if="player.isSeparated" class="leaderboard-separator">
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
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

.leaderboard-separator {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 12px 0;
}

.leaderboard-separator .dot {
  width: 8px;
  height: 8px;
  background-color: #1e1e1e;
  border-radius: 50%;
  opacity: 0.5;
}

.leaderboard-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 8px;
  margin-bottom: 10px;
  background: var(--menuItemsBg);
  border: 3px solid #1e1e1e;
  border-radius: 18px;
  box-shadow: 2px 2px 0 #1e1e1e;
  font-family: "Nunito", sans-serif;
}

.leaderboard-item--current {
  border: 2px solid #197596;
}

.leaderboard-player-info {
  display: flex;
  align-items: center;
}

.leaderboard-player-avatar {
  width: 42px;
  height: 42px;
}

.leaderboard-player-name {
  font-size: .9rem;
  font-weight: 800;
  color: var(--titleColor);
  margin-left: 5px;
}

.leaderboard-player-rank {
  min-width: 38px;
  text-align: center;
  font-weight: 900;
  font-size: 1.6rem;
  line-height: 1;
}

.rank--default {
  color: var(--titleColor);
}

.leaderboard-score-wrapper {
  width: 40px;
  padding: 4px 10px;
  background: #6b72d1;
  border-radius: 22px;
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
    font-size: 16px;
  }

  .leaderboard-player-rank {
    min-width: 40px;
    font-size: 16px;
  }

  .leaderboard-score-wrapper {
    padding: 6px 0;
  }

  .leaderboard-player-score {
    font-size: 20px;
    color: white;
    text-align: center;
    font-family: 'Lilita One', sans-serif;
    font-weight: 400;
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