<template>
  <div class="friends">
    <div class="panel panel--search">
      <h3 class="panel__title">Найти друзей по email</h3>
      <div class="search-row">
        <input
            v-model="searchEmail"
            type="email"
            placeholder="Введите email друга"
            class="input"
            @keyup.enter="handleSearch"
        />
        <button class="btn btn--primary" @click="handleSearch" :disabled="isSearching">
          {{ isSearching ? 'Поиск...' : 'Найти' }}
        </button>
      </div>
      <transition name="fade">
        <div v-if="foundUser" class="found-card">
          <div class="found-card__left">
            <div class="avatar-wrapper">
              <img
                  v-if="friendsStore.normalizeAvatarPath(foundUser.avatarUrl || foundUser.avatar)"
                  :src="friendsStore.normalizeAvatarPath(foundUser.avatarUrl || foundUser.avatar)"
                  alt="Аватар пользователя"
                  class="avatar"
                  loading="lazy"
                  referrerpolicy="no-referrer"
              />
              <div v-else class="avatar avatar--placeholder">👤</div>
            </div>

            <div class="found-card__info">
<!--              <div class="found-card__email">{{ foundUser.email || '—' }}</div>-->
              <div v-if="foundUser.name" class="found-card__name">{{ foundUser.name }}</div>
            </div>
          </div>
          <button
              v-if="relationStatus === 'none'"
              class="btn btn--success"
              @click="sendRequest"
              :disabled="isSending"
          >
            {{ isSending ? 'Отправка…' : 'Добавить' }}
          </button>
          <span v-else-if="relationStatus === 'pending'" class="pill pill--pending">Ожидание</span>
          <button
              v-else-if="relationStatus === 'incoming'"
              class="btn btn--success"
              @click="sendRequest"
              :disabled="isSending"
          >
            Принять
          </button>
          <span v-else-if="relationStatus === 'accepted'" class="pill">Уже в друзьях</span>
        </div>
      </transition>

      <div v-if="searchError" class="msg msg--error">{{ searchError }}</div>
      <div v-if="successMessage" class="msg msg--ok">{{ successMessage }}</div>
    </div>
    <div class="tabs">
      <button class="tabs__btn" :class="{active: activeTab === 'incoming'}" @click="activeTab = 'incoming'">
        Входящие
        <span class="tabs__badge" v-if="friendsStore.requestsIncoming.length">
          {{ friendsStore.requestsIncoming.length }}
        </span>
      </button>
      <button class="tabs__btn" :class="{active: activeTab === 'outgoing'}" @click="activeTab = 'outgoing'">
        Исходящие
        <span class="tabs__badge" v-if="friendsStore.requestsOutgoing.length">
          {{ friendsStore.requestsOutgoing.length }}
        </span>
      </button>
<!--      <button class="tabs__btn" :class="{active: activeTab === 'friends'}" @click="activeTab = 'friends'">-->
<!--        Друзья-->
<!--        <span class="tabs__badge" v-if="friendsStore.friends.length">-->
<!--          {{ friendsStore.friends.length }}-->
<!--        </span>-->
<!--      </button>-->
    </div>
    <div class="panel">
      <transition name="fade" mode="out-in">
        <div v-if="activeTab === 'incoming'" key="incoming">
          <div v-if="friendsStore.requestsIncoming.length === 0" class="empty">Нет входящих запросов.</div>
          <ul v-else class="list">
            <li v-for="r in friendsStore.requestsIncoming" :key="r.uid" class="item">
              <div class="item__left">
                <div class="avatar-wrapper">
                  <img
                      v-if="friendsStore.normalizeAvatarPath(r.avatarUrl || r.avatar)"
                      :src="friendsStore.normalizeAvatarPath(r.avatarUrl || r.avatar)"
                      alt="Аватар"
                      class="avatar"
                      loading="lazy"
                      referrerpolicy="no-referrer"
                  />
                  <div v-else class="avatar avatar--placeholder">👤</div>
                </div>
                <div class="item__main">
<!--                  <div class="item__email">{{ r.email || '—' }}</div>-->
                  <div v-if="r.name" class="item__secondary">{{ r.name }}</div>
                </div>
              </div>
              <div class="item__actions">
                <button class="btn btn--success" :disabled="processingUid === r.uid" @click="handleAccept(r.uid)">
                  {{ processingUid === r.uid ? '…' : 'Принять' }}
                </button>
                <button class="btn btn--danger" :disabled="processingUid === r.uid" @click="handleDecline(r.uid)">
                  {{ processingUid === r.uid ? '…' : 'Отклонить' }}
                </button>
              </div>
            </li>
          </ul>
        </div>
        <div v-else-if="activeTab === 'outgoing'" key="outgoing">
          <div v-if="friendsStore.requestsOutgoing.length === 0" class="empty">Нет исходящих запросов.</div>
          <ul v-else class="list">
            <li v-for="r in friendsStore.requestsOutgoing" :key="r.uid" class="item">
              <div class="item__left">
                <div class="avatar-wrapper">
                  <img
                      v-if="friendsStore.normalizeAvatarPath(r.avatarUrl || r.avatar)"
                      :src="friendsStore.normalizeAvatarPath(r.avatarUrl || r.avatar)"
                      alt="Аватар"
                      class="avatar"
                      loading="lazy"
                      referrerpolicy="no-referrer"
                  />
                  <div v-else class="avatar avatar--placeholder">👤</div>
                </div>
                <div class="item__main">
<!--                  <div class="item__email">{{ r.email || '—' }}</div>-->
                  <div v-if="r.name" class="item__secondary">{{ r.name }}</div>
                </div>
              </div>
              <div class="item__right">
                <span class="pill pill--pending">Ожидание</span>
              </div>
            </li>
          </ul>
        </div>
<!--        <div v-else key="friends">-->
<!--          <div v-if="friendsStore.friends.length === 0" class="empty">У вас пока нет друзей.</div>-->
<!--          <ul v-else class="list">-->
<!--            <li v-for="f in friendsStore.friends" :key="f.uid" class="item">-->
<!--              <div class="item__left">-->
<!--                <div class="avatar-wrapper">-->
<!--                  <img-->
<!--                      v-if="friendsStore.normalizeAvatarPath(f.avatarUrl || f.avatar)"-->
<!--                      :src="friendsStore.normalizeAvatarPath(f.avatarUrl || f.avatar)"-->
<!--                      alt="Аватар"-->
<!--                      class="avatar"-->
<!--                      loading="lazy"-->
<!--                      referrerpolicy="no-referrer"-->
<!--                  />-->
<!--                  <div v-else class="avatar avatar&#45;&#45;placeholder">👤</div>-->
<!--                </div>-->
<!--                <div class="item__main">-->
<!--                  <div class="item__email">{{ f.email || '—' }}</div>-->
<!--                  <div v-if="f.name" class="item__secondary">{{ f.name }}</div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </li>-->
<!--          </ul>-->
<!--        </div>-->
      </transition>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {useFriendsStore} from '../store/friendsStore.js'
import {userAuthStore} from '../store/authStore.js'
const friendsStore = useFriendsStore()
const authStore = userAuthStore()

const searchEmail = ref('')
const foundUser = ref(null)
const isSearching = ref(false)
const isSending = ref(false)
const searchError = ref('')
const successMessage = ref('')
const processingUid = ref(null)
const activeTab = ref('friends')

const relationStatus = computed(() => {
  const uid = foundUser.value?.uid
  if (!uid) return 'none'
  if (friendsStore.friends.some(f => f.uid === uid)) return 'accepted'
  if (friendsStore.requestsOutgoing.some(r => r.uid === uid)) return 'pending'
  if (friendsStore.requestsIncoming.some(r => r.uid === uid)) return 'incoming'
  return 'none'
})

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
    searchError.value = e?.message || 'Ошибка при поиске.'
  } finally {
    isSearching.value = false
  }
}

async function sendRequest() {
  if (!foundUser.value) return
  if (relationStatus.value === 'accepted') {
    successMessage.value = 'Этот пользователь уже у вас в друзьях.'
    return
  }
  if (relationStatus.value === 'pending') {
    successMessage.value = 'Запрос уже отправлен.'
    activeTab.value = 'outgoing'
    return
  }
  if (relationStatus.value === 'incoming') {
    try {
      isSending.value = true
      await friendsStore.acceptRequest(foundUser.value.uid)
      await friendsStore.loadFriends()
      successMessage.value = 'Запрос принят. Вы теперь друзья!'
      activeTab.value = 'friends'
    } catch (e) {
      searchError.value = e?.message || 'Не удалось принять запрос.'
    } finally {
      isSending.value = false
    }
    return
  }

  try {
    isSending.value = true
    await friendsStore.sendFriendRequest(foundUser.value.email || foundUser.value.uid)
    successMessage.value = 'Запрос на добавление в друзья отправлен!'
    searchEmail.value = ''
    foundUser.value = null
    await friendsStore.loadFriends()
    activeTab.value = 'outgoing'
  } catch (e) {
    searchError.value = e?.message || 'Не удалось отправить запрос.'
  } finally {
    isSending.value = false
  }
}

async function handleAccept(fromUid) {
  try {
    processingUid.value = fromUid
    await friendsStore.acceptRequest(fromUid)
    await friendsStore.loadFriends()
    activeTab.value = 'friends'
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
.friends {
  width: 100%;
}

.panel + .panel {
  margin-top: 18px;
}

.panel--search {
  margin-bottom: 16px;
}

.panel__title {
  font-weight: 900;
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 14px;
}

.search-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

@media (max-width: 560px) {
  .search-row {
    grid-template-columns: 1fr;
  }
}

.input {
  padding: 10px 14px;
  border: 2px solid #000;
  border-radius: 12px;
  font-size: 1rem;
  background: #fff;
}

.found-card {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 3px solid #000;
  border-radius: 16px;
  background: #fff;
  box-shadow: 4px 4px 0 #000;
  padding: 12px 14px;
}

.found-card__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.found-card__info {
  max-width: 70%;
}

.found-card__email {
  font-weight: 800;
}

.found-card__name {
  font-size: .9rem;
  color: #6b7280;
}

.tabs {
  display: flex;
  gap: 10px;
  margin: 8px 0 16px 0;
  flex-wrap: wrap;
}

.tabs__btn {
  position: relative;
  border: 3px solid #000;
  border-radius: 14px;
  padding: 8px 14px;
  background: #f3f4f6;
  box-shadow: 3px 3px 0 #000;
  font-weight: 800;
  cursor: pointer;
  transition: transform .1s, box-shadow .1s;
}

.tabs__btn.active {
  background: #bbf7d0;
}

.tabs__btn:hover {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 #000;
}

.tabs__badge {
  margin-left: 8px;
  padding: 0 8px;
  border: 2px solid #000;
  border-radius: 9999px;
  font-size: .85rem;
  background: #fde047;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}


.item {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border: 2px solid #000;
  border-radius: 12px;
  background: #fff;
  padding: 10px 12px;
}

.item__left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.item__main {
  display: flex;
  flex-direction: column;
}

.item__email {
  font-weight: 800;
}

.item__secondary {
  font-size: .9rem;
  color: #6b7280;
}

.item__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.item__right {
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  width: 40px;
  height: 40px;
  border: 2px solid #000;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar--placeholder {
  font-size: 18px;
  line-height: 1;
}

.btn {
  border: 3px solid #000;
  border-radius: 12px;
  padding: 8px 14px;
  font-weight: 800;
  background: #f3f4f6;
  box-shadow: 2px 2px 0 #000;
  cursor: pointer;
}

.btn:disabled {
  background: #e5e7eb;
  cursor: not-allowed;
  box-shadow: none;
}

.btn--primary {
  background: #bbf7d0;
}

.btn--success {
  background: #4ade80;
}

.btn--danger {
  background: #f87171;
  color: #fff;
}

.pill {
  border: 2px solid #000;
  border-radius: 9999px;
  padding: 4px 10px;
  font-weight: 800;
}

.pill--pending {
  background: #fde047;
}

.msg {
  margin-top: 10px;
  text-align: center;
  font-weight: 600;
}

.msg--error {
  color: #ef4444;
}

.msg--ok {
  color: #10b981;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>

<style scoped>
.friends {
  padding: 5px 10px;
  max-width: 767px;
  width: 100%;
}


.panel + .panel {
  margin-top: 18px;
}

.panel--search {
  margin-bottom: 16px;
}

.panel__title {
  font-weight: 900;
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 14px;
}

.search-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
}

@media (max-width: 560px) {
  .search-row {
    grid-template-columns: 1fr;
  }
}

.input {
  padding: 10px 14px;
  border: 2px solid #000;
  border-radius: 12px;
  font-size: 1rem;
  background: #fff;
}

.found-card {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 3px solid #000;
  border-radius: 16px;
  background: #fff;
  box-shadow: 4px 4px 0 #000;
  padding: 12px 14px;
}

.found-card__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.found-card__info {
  max-width: 70%;
}

.found-card__email {
  font-weight: 800;
}

.found-card__name {
  font-size: .9rem;
  color: #6b7280;
}

.tabs {
  display: flex;
  gap: 10px;
  margin: 8px 0 16px 0;
}

.tabs__btn {
  position: relative;
  border: 3px solid #000;
  border-radius: 14px;
  padding: 8px 14px;
  background: #f3f4f6;
  box-shadow: 3px 3px 0 #000;
  font-weight: 800;
  cursor: pointer;
  transition: transform .1s, box-shadow .1s;
}

.tabs__btn.active {
  background: #bbf7d0;
}

.tabs__btn:hover {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 #000;
}

.tabs__badge {
  margin-left: 8px;
  padding: 0 8px;
  border: 2px solid #000;
  border-radius: 9999px;
  font-size: .85rem;
  background: #fde047;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item__left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.item__main {
  display: flex;
  flex-direction: column;
}

.item__email {
  font-weight: 800;
}

.item__secondary {
  font-size: 1rem;
  color: #6b7280;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
}

.item__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.item__right {
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  width: 40px;
  height: 40px;
  border: 2px solid #000;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar--placeholder {
  font-size: 18px;
  line-height: 1;
}

.btn {
  border: 3px solid #000;
  border-radius: 12px;
  padding: 8px 14px;
  font-weight: 800;
  background: #f3f4f6;
  box-shadow: 2px 2px 0 #000;
  cursor: pointer;
}

.btn:disabled {
  background: #e5e7eb;
  cursor: not-allowed;
  box-shadow: none;
}

.btn--primary {
  background: #bbf7d0;
}

.btn--success {
  background: #4ade80;
}

.btn--danger {
  background: #f87171;
  color: #fff;
}

/* BADGES & MESSAGES */
.pill {
  border: 2px solid #000;
  border-radius: 9999px;
  padding: 4px 10px;
  font-weight: 800;
}

.pill--pending {
  background: #fde047;
}

.msg {
  margin-top: 10px;
  text-align: center;
  font-weight: 600;
}

.msg--error {
  color: #ef4444;
}

.msg--ok {
  color: #10b981;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .15s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .item {
    flex-direction: column;
  }

  .tabs__btn {
    width: 100%;
  }

  .btn {
    width: 100%;
  }
  .item__left {
    padding: 0 10px;
  }
}
</style>
