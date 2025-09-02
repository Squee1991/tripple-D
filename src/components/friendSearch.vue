<template>
  <div class="friends-tab-container">
    <div class="search-section">
      <h3 class="section-title">Найти друзей по email</h3>

      <div class="search-input-wrapper">
        <input
            v-model="searchEmail"
            type="email"
            placeholder="Введите email друга"
            class="search-input"
            @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch" :disabled="isSearching">
          {{ isSearching ? 'Поиск...' : 'Найти' }}
        </button>
      </div>

      <div v-if="searchError" class="status-message error">{{ searchError }}</div>

      <div v-if="foundUser" class="user-card">
        <div class="user-info">
          <div class="user-name">{{ foundUser.email || '—' }}</div>
          <div class="user-email" v-if="foundUser.name">{{ foundUser.name }}</div>
        </div>
        <button class="action-btn add-friend-btn" @click="sendRequest" :disabled="isSending">
          {{ isSending ? 'Отправка...' : 'Добавить' }}
        </button>
      </div>

      <div v-if="successMessage" class="status-message success">{{ successMessage }}</div>
    </div>

    <div class="requests-section">
      <h3 class="section-title">Входящие запросы ({{ friendsStore.requestsIncoming.length }})</h3>
      <div v-if="friendsStore.requestsIncoming.length > 0" class="request-list">
        <div v-for="request in friendsStore.requestsIncoming" :key="request.uid" class="request-item">
          <div class="request-user">
            <!-- показываем email, НЕ uid -->
            <span class="user-name">{{ request.email || '—' }}</span>
          </div>
          <div class="request-actions">
            <button
                class="action-btn accept-btn"
                :disabled="processingUid === request.uid"
                @click="handleAccept(request.uid)"
            >
              {{ processingUid === request.uid ? '...' : 'Принять' }}
            </button>
            <button
                class="action-btn decline-btn"
                :disabled="processingUid === request.uid"
                @click="handleDecline(request.uid)"
            >
              {{ processingUid === request.uid ? '...' : 'Отклонить' }}
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty-list">Нет входящих запросов.</div>
    </div>

    <div class="requests-section">
      <h3 class="section-title">Исходящие запросы ({{ friendsStore.requestsOutgoing.length }})</h3>
      <div v-if="friendsStore.requestsOutgoing.length > 0" class="request-list">
        <div v-for="request in friendsStore.requestsOutgoing" :key="request.uid" class="request-item">
          <div class="request-user">
            <span class="user-name">{{ request.email || '—' }}</span>
          </div>
          <div class="request-actions">
            <span class="status-pending">Ожидание</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-list">Нет исходящих запросов.</div>
    </div>
    <div class="friends-section">
      <h3 class="section-title">Мои друзья ({{ friendsStore.friends.length }})</h3>
      <div v-if="friendsStore.friends.length > 0" class="friend-list">
        <div v-for="friend in friendsStore.friends" :key="friend.uid" class="friend-item">

          <span class="user-name">{{ friend.email || '—' }}</span>
        </div>
      </div>
      <div v-else class="empty-list">У вас пока нет друзей.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFriendsStore } from '../store/friendsStore.js'
import { userAuthStore } from '../store/authStore.js'

const friendsStore = useFriendsStore()
const authStore = userAuthStore()

const searchEmail = ref('')
const foundUser = ref(null)
const isSearching = ref(false)
const isSending = ref(false)
const searchError = ref('')
const successMessage = ref('')

const processingUid = ref(null)

async function handleSearch() {
  if (!searchEmail.value) {
    searchError.value = 'Пожалуйста, введите email.'
    return
  }
  if (authStore.email === searchEmail.value) {
    searchError.value = 'Нельзя добавить самого себя в друзья.'
    foundUser.value = null
    return
  }

  isSearching.value = true
  searchError.value = ''
  foundUser.value = null
  successMessage.value = ''

  try {
    const user = await friendsStore.findUserByEmail(searchEmail.value)
    foundUser.value = user
    if (!user) searchError.value = 'Пользователь не найден.'
  } catch (e) {
    searchError.value = e.message || 'Ошибка при поиске.'
  } finally {
    isSearching.value = false
  }
}

async function sendRequest() {
  if (!foundUser.value) return
  try {
    isSending.value = true
    await friendsStore.sendFriendRequest(foundUser.value.email || foundUser.value.uid)
    successMessage.value = 'Запрос на добавление в друзья отправлен!'
    searchEmail.value = ''
    foundUser.value = null
    await friendsStore.loadFriends()
  } catch (e) {
    searchError.value = e.message || 'Не удалось отправить запрос.'
  } finally {
    isSending.value = false
  }
}

async function handleAccept(fromUid) {
  try {
    processingUid.value = fromUid
    await friendsStore.acceptRequest(fromUid)
    await friendsStore.loadFriends()
  } catch (e) {
    searchError.value = e?.message || 'Не удалось принять запрос.'
  } finally {
    processingUid.value = null
  }
}

async function handleDecline(fromUid) {
  try {
    processingUid.value = fromUid
    await friendsStore.declineRequest(fromUid)
    await friendsStore.loadFriends()
  } catch (e) {
    searchError.value = e?.message || 'Не удалось отклонить запрос.'
  } finally {
    processingUid.value = null
  }
}

onMounted(() => {
  friendsStore.loadFriends()
})
</script>

<style scoped>
.friends-tab-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.search-section,
.requests-section,
.friends-section {
  background: #fef8e4;
  border: 3px solid #000;
  border-radius: 20px;
  box-shadow: 6px 6px 0 #000;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-weight: 900;
  font-size: 1.5rem;
  color: var(--titleColor);
  margin-bottom: 1rem;
  text-align: center;
}

.search-input-wrapper {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #000;
  border-radius: 12px;
  font-size: 1rem;
}

.search-btn,
.action-btn {
  padding: 10px 20px;
  border: 3px solid #000;
  border-radius: 12px;
  background: #bbf7d0;
  box-shadow: 3px 3px 0 #000;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.search-btn:disabled,
.action-btn:disabled {
  background: #e5e7eb;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.search-btn:hover:not(:disabled),
.action-btn:hover:not(:disabled) {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 #000;
}

.status-message {
  text-align: center;
  font-weight: 600;
  margin-top: 10px;
}

.status-message.error { color: #ef4444; }
.status-message.success { color: #10b981; }

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 3px solid #000;
  border-radius: 16px;
  background: #fff;
  box-shadow: 4px 4px 0 #000;
  margin-top: 20px;
}

.user-info { flex: 1; text-align: left; }
.user-name { font-weight: 800; font-size: 1.2rem; }
.user-email { font-size: 0.9rem; color: #6b7280; }

.add-friend-btn { background: #4ade80; }

.request-list,
.friend-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.request-item,
.friend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 2px solid #000;
  border-radius: 12px;
  padding: 10px 15px;
}

.request-user { flex: 1; font-weight: 600; }
.request-actions { display: flex; gap: 8px; }

.accept-btn { background: #4ade80; }
.decline-btn { background: #f87171; color: white; }

.status-pending {
  background: #fde047;
  padding: 5px 10px;
  border-radius: 10px;
  font-weight: 700;
}

.empty-list {
  text-align: center;
  color: #6b7280;
  padding: 20px;
}
</style>
