<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div v-if="message" class="result">
        <div class="result__text">{{ message }}</div>
        <button class="close-btn share__btns" @click="$emit('close')">{{ t('shareModal.close')}}</button>
      </div>
      <template v-else>
        <h2 class="modal-title">{{ t('shareModal.shareWithFriend')}}</h2>
        <input
            type="text"
            v-model="searchTerm"
            :placeholder="t('shareModal.placeholder')"
            class="search-input"
        >
        <div v-if="friends.length === 0" class="no-friends">
          {{ t('shareModal.noFriends')}}
        </div>
        <ul v-else-if="filteredFriends.length > 0" class="friends-list">
          <div>{{ t('shareModal.friendsList')}}</div>
          <li v-for="friend in filteredFriends" :key="friend.uid" class="friend-item">
            <div class="friend-info">
              <img :src="friend.avatar || '/images/default-avatar.png'" alt="avatar" class="avatar">
              <span>{{ friend.name || friend.email }}</span>
            </div>
            <button
                @click="handleShare(friend.uid)"
                class="share-btn share__btns"
                :disabled="isSending"
            >
              {{ isSending ? '...' : t('shareModal.send') }}
            </button>
          </li>
        </ul>
        <div v-else class="no-friends">{{ t('shareModal.friendNotFound')}}</div>
        <button class="close-btn share__btns" @click="$emit('close')">{{ t('shareModal.close')}}</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  friends: { type: Array, required: true },
  isSending: { type: Boolean, default: false },
  message: { type: String, default: '' }
})

const emit = defineEmits(['close', 'share'])
const searchTerm = ref('')
const {t} = useI18n()
const filteredFriends = computed(() => {
  if (!searchTerm.value) return props.friends
  const lower = searchTerm.value.toLowerCase()
  return props.friends.filter(friend =>
      friend.name?.toLowerCase().includes(lower) ||
      friend.email?.toLowerCase().includes(lower)
  )
})

function handleShare(friendUid) {
  emit('share', friendUid)
}
</script>

<style scoped>
.overlay {
  left: 0;
  top: 0;
  width: 100%;
  height: 100dvh;
  position: fixed;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  text-align: center;
}

.search-input {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 2px solid #000;
}

.friends-list {
  max-height: 300px;
  overflow-y: auto;
  margin: -4px;
}

.close-btn {
  border: 2px solid black;
  font-size: 1rem;
  font-family: "Nunito", sans-serif;
  padding: 8px;
  border-radius: 13px;
  box-shadow: 3px 3px 0 #000;
}

.share-btn {
  border: 2px solid black;
  font-size: 0.8rem;
  font-family: "Nunito", sans-serif;
  padding: 8px;
  border-radius: 13px;
  box-shadow: 3px 3px 0 #000;
  background: #60a5fa;
  color: white;
  font-weight: 600;
}

.share__btns:hover {
  box-shadow: 1px 1px 0 #000;
  transform: translate(2px, 2px);
}

.friend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 5px;
  border-bottom: 1px solid #ccc;
}

.friend-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.no-friends {
  text-align: center;
  color: #666;
  padding: 20px 0;
}

.result {
  display: grid;
  gap: 12px;
  align-items: center;
  justify-items: center;
  padding: 8px 0;
}

.result__text {
  font-size: 1.2rem;
  font-weight: 800;
  text-align: center;
}
</style>
