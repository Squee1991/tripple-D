<template>
  <div class="friend-list">
    <template v-if="openProfileUid && selectedFriend">
      <div class="fiends__list-wrapper">
        <div class="friends__list-header">
          <div class="add__inner">
            <button type="button" class="friend_list-btn" @click="openProfileUid = null">
              К списку друзей
            </button>
          </div>
        </div>
        <FriendPanel
            :friend="selectedFriend"
            @close="openProfileUid = null"
        />
      </div>
    </template>

    <template v-else>
      <div v-if="showList" class="fiends__list-wrapper">
        <div class="friends__list-header">
          <h3 class="points-card__title">Список друзей</h3>
          <div class="add__inner">
            <div class="friends__incoming" v-if="friendsStore.requestsIncoming.length">
              {{ friendsStore.requestsIncoming.length }}
            </div>
            <button @click="pathToFriends" type="button" class="add__friends">
              <img class="add__friends-icon" :src="AddFriendIcon" alt="Add friends icon">
            </button>
          </div>
        </div>
        <ul class="list">
          <li v-for="friend in friendsStore.friends" :key="friend.uid" class="list__item">
            <img v-if="friend.avatar" :src="friend.avatar" alt="friend-Icon" class="list__avatar" />
            <div class="friend__name">{{ friend.name || '' }}</div>

            <button @click="openEdit(friend.uid)" class="friend__dots-btn">
              <img class="friend__dots-icon" :src="Dots" alt="Dots">
            </button>
            <div class="dots__edit-window" v-if="openMenuId === String(friend.uid)">
              <VEdit
                  :open="true"
                  :buttons="friendEditModal"
                  @close="openMenuId = null"
                  @action="actionEditWindow"
              />
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="fiends__add-wrapper">
        <div class="friend_add__btn-wrapper">
          <button type="button" @click="toListFriends" class="friend_list-btn">К списку друзей</button>
        </div>
        <SearchFriend/>
      </div>
    </template>
  </div>
</template>


<script setup>
import { ref } from "vue";
import {useFriendsStore} from '../../store/friendsStore.js'
import AddFriendIcon from '../../assets/images/addFriendsIcon.svg'
import SearchFriend from '../../src/components/friendSearch.vue'
import Dots from '../../assets/images/dots.svg'
import VEdit from '../../src/components/V-editTest.vue'
import Profile from "assets/images/user.svg";
import Trash from "assets/images/trash.svg";
import FriendPanel from "../../src/components/v-friendPorifile.vue";

const friendsStore = useFriendsStore()
const openMenuId = ref(null)
const closeWindow = ref(false)
const openProfileUid = ref(null)
const friendEditModal = ref([
  {icon: Profile, alt: 'Profile_icon', text: 'Профиль'},
  {icon: Trash, alt: 'delete_icon', text: 'Удалить'},
])

const selectedFriend = computed(() => friendsStore.friends.find(f => String(f.uid) === String(openProfileUid.value)))

const handleClose = () => {
  closeWindow.value = false
  openMenuId.value = null
}

const openEdit = (uid) => {
  openMenuId.value = String(uid)
  closeWindow.value = true
}

const actionEditWindow = async (btn) => {
  if (btn.text === 'Профиль') {
    console.log('Profile', openMenuId.value)
    openProfileUid.value = openMenuId.value
  } else if (btn.text === 'Удалить') {
    const uid = openMenuId.value
    try {
      const ok = window.confirm('Удалить пользователя из друзей?')
      if (ok) {
        await friendsStore.removeFriend(uid)
        console.log('Удалён из друзей:', uid)
      }
    } catch (e) {
      console.error(e)
      alert(e?.message || 'Не удалось удалить друга')
    }
  }
  openMenuId.value = null
}

const showList = ref(true)
const pathToFriends = () => {
  showList.value = false
}
const toListFriends = () => {
  showList.value = true
}

</script>

<style scoped>

.dots__edit-window {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99;
}

.friend__dots-btn {
  position: relative;
  width: 40px;
  height: 40px;
  padding: 5px;
  border-radius: 50%;
  background: #798ad2;
  box-shadow: 2px 2px 0 var(--border);
  border: 2px solid var(--border);
}

.friend_list-btn {
  font-size: 1.2rem;
  padding: 10px 15px;
  border-radius: 10px;
  background: #ffd54f;
  box-shadow: 3px 3px 0 var(--border);
  font-size: 1.2rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
}

.friends__incoming {
  font-size: 1.2rem;
  border: 3px solid var(--border);
  box-shadow: 2px 2px 0 var(--border);
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: #fde047;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 900;

}

.add__inner {
  display: flex;
  align-items: center;
  gap: 10px

}

.friend_add__btn-wrapper {
  margin-bottom: 20px;
}

.list__item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  border: 2px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 4px 0 0 var(--border);
  background: whitesmoke;
}

.points-card__title {
  padding: 15px 0;
  font-size: 1.7rem;
}

.list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
}

.friend__name {
  font-size: 1.2rem;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  margin-right: auto;
}

.list__avatar {
  width: 50px;
  height: 50px;
  border-radius: 20px;
  margin-right: 14px;
}

.friends__list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 2px solid var(--border);
  padding-bottom: 10px;
  border-radius: 10px;
}

.fiends__add-wrapper {
  padding: 15px;
}

.fiends__list-wrapper {
  padding: 5px 20px;
}

.add__friends-icon {
  width: 45px;
  height: 35px;
}

.add__friends {
  width: 70px;
  padding: 5px 10px;
  border: 2px solid var(--border);
  background: whitesmoke;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 3px 0 0 var(--border);
}

@media (max-width: 767px) {
  .friend_list-btn {
    width: 100%;
  }
}
</style>