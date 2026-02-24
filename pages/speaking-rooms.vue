<template>
  <div class="speaking-rooms">
    <CreateRoomModal
        :visible="showCreateModal"
        @close="showCreateModal = false"
    />
    <div class="speaking-rooms__container">
      <div class="speaking-rooms__header">
        <button @click="goBack" class="back-button-global" aria-label="Back">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          <span>{{ t('speakingRooms.back') }}</span>
        </button>
      </div>

      <div class="speaking-rooms__top">
        <h1 class="speaking-rooms__title">{{ t('speakingRooms.title') }}</h1>
        <button class="speaking-rooms__create-btn" @click="showCreateModal = true">
          {{ t('speakingRooms.createRoom') }}
        </button>
      </div>

      <div v-if="store.isLoadingRooms && store.rooms.length === 0" class="speaking-rooms__loading">
        <div class="skeleton-card" v-for="i in 4" :key="i"></div>
      </div>

      <div v-else-if="store.rooms.length === 0" class="speaking-rooms__empty">
        <p class="speaking-rooms__empty-text">{{ t('speakingRooms.noRooms') }}</p>
      </div>

      <div v-else class="speaking-rooms__grid">
        <RoomCard
            v-for="room in store.rooms"
            :key="room.id"
            :room="room"
            @join="handleJoin"
        />
      </div>

      <div v-if="store.hasMoreRooms && store.rooms.length > 0" class="speaking-rooms__load-more">
        <button
            class="load-more-btn"
            :disabled="store.isLoadingRooms"
            @click="store.fetchRooms(false)"
        >
          {{ store.isLoadingRooms ? t('speakingRooms.loading') : t('speakingRooms.loadMore') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSpeakingRoomStore } from '~/store/speakingRoomStore.js'
import { userAuthStore } from '~/store/authStore.js'
import RoomCard from '~/src/components/speaking-rooms/RoomCard.vue'
import CreateRoomModal from '~/src/components/speaking-rooms/CreateRoomModal.vue'

definePageMeta({ layout: 'footerlayout' })

const { t } = useI18n()
const router = useRouter()
const store = useSpeakingRoomStore()
const authStore = userAuthStore()

const showCreateModal = ref(false)

function goBack() {
  router.back()
}

function handleJoin(roomId) {
  router.push(`/speaking-room/${roomId}`)
}

onMounted(() => {
  if (!authStore.uid) {
    router.push('/')
    return
  }
  store.fetchRooms(true)
})
</script>

<style scoped>
.speaking-rooms {
  font-family: "Nunito", sans-serif;
  min-height: 80vh;
  padding: 1rem;
  max-width: 1100px;
  margin: 0 auto;
}

.speaking-rooms__header {
  margin-bottom: 1rem;
}

.back-button-global {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  box-shadow: 3px 3px 0 #1e1e1e;
  background: #fff;
  padding: 0.5rem 1rem;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.15s;
}

.back-button-global svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.speaking-rooms__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.speaking-rooms__title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--titleColor);
}

.speaking-rooms__create-btn {
  padding: 0.7rem 1.5rem;
  font-weight: 800;
  font-size: 1rem;
  border-radius: 14px;
  border: 3px solid #1e1e1e;
  background: #f1c40f;
  color: #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: all 0.15s;
}

.speaking-rooms__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.speaking-rooms__loading {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.skeleton-card {
  height: 160px;
  background: #eee;
  border-radius: 16px;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.speaking-rooms__empty {
  text-align: center;
  padding: 3rem 1rem;
}

.speaking-rooms__empty-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: #888;
  margin-bottom: 1.5rem;
}

.speaking-rooms__load-more {
  text-align: center;
  margin-top: 1.5rem;
}

.load-more-btn {
  padding: 0.6rem 2rem;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  background: #fff;
  color: #1e1e1e;
  font-family: "Nunito", sans-serif;
  box-shadow: 3px 3px 0 #1e1e1e;
  transition: all 0.15s;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (min-width: 1024px) {
  .speaking-rooms__create-btn:hover,
  .back-button-global:hover,
  .load-more-btn:not(:disabled):hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
  }
}

@media (max-width: 600px) {
  .speaking-rooms__title {
    font-size: 1.4rem;
  }

  .speaking-rooms__grid {
    grid-template-columns: 1fr;
  }
}
</style>
