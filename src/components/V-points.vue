<template>
  <div class="points">
    <VTips
        :title="articleData.title"
        :tips="articleData.tips"
        v-model="isArticleOpen"
    />
    <section class="points-card" aria-label="Поинты и уровень">
      <header class="points-card__header">
        <h2 class="points_title">Панель игрока</h2>
      </header>
      <ul v-if="langStore" class="points-card__list" aria-label="Сводка">
        <li class="points-card__item">
          <div class="points-card__label">Артиклюсы</div>
          <button v-if="userAuth.uid" @click="openArticleModal" class="articlus__wrapper">
            <img class="articlus__icon" src="../../assets/images/articlus.png" alt="">
            <span class="points-card__value"> {{ langStore.points }}</span>
          </button>
        </li>
        <li class="points-card__item">
          <span class="points-card__label">Уровень</span>
          <span class="points-card__badge">{{ langStore.isLeveling }}</span>
        </li>
        <div class="points-card__progress">
          <div v-if="langStore.exp" class="progress_exp-bar">
            <div class="progress__bar" :style="{width: `${(langStore.exp / 100) * 100}%`}"></div>
            <div class="progress__meta">{{ langStore.exp }}/100 XP</div>
          </div>
        </div>
        <!--        <li class="points-card__item">-->
        <!--          <span class="points-card__label">Подписка</span>-->
        <!--          <span class="sub-badge sub-badge&#45;&#45;off">Не активна</span>-->
        <!--        </li>-->
      </ul>
      <div class="fiends__list-wrapper">
        <h3 class="points-card__title"> Список друзей</h3>
        <ul class="list">
          <li v-for="friend in friendsStore.friends"
              :key="friend.id"
              class="list__item">
            <img
                v-if="friend.avatar"
                :src="friend.avatar"
                alt="Аватар"
                class="list__avatar"
            />
            <div> {{ friend.name || '' }}</div>
          </li>
        </ul>
      </div>
      <div class="points__statistics">
        <div class="points__statistics__items">
          <h3 class="points-card__title">Статистика</h3>
          <button @click="toStatistics" class="stats__btn">Посмотреть статистику</button>
        </div>
      </div>
      <div class="sub-actions">
        <button @click="toPayment" class="btn-activate">Попробовать</button>
      </div>
    </section>
  </div>
</template>
<script setup>
import VTips from "~/src/components/V-tips.vue";
import {userlangStore} from "~/store/learningStore.js";
import {userAuthStore} from '../../store/authStore.js'
import {useRouter} from "vue-router";
import {useFriendsStore} from '../../store/friendsStore.js'
import {onMounted, ref} from "vue";

const {t} = useI18n()
const langStore = userlangStore()
const userAuth = userAuthStore()
const router = useRouter()
const friendsStore = useFriendsStore()
const isArticleOpen = ref(false)
const toPayment = () => {
  router.push('/pay')
}

const toStatistics = () => {
  router.push('/statistics')
}

const openArticleModal = () => isArticleOpen.value = true
const articleData = ref({
  title: t('articleOverlay.title'),
  tips: [
    {id: 1, text: t('articleOverlay.first')},
    {id: 2, text: t('articleOverlay.second')},
    {id: 3, text: t('articleOverlay.third')},
  ]
})

onMounted(() => {
  friendsStore.loadFriends()
})

</script>
<style scoped>

.list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border: 3px solid black;
  border-radius: 15px;
  background: wheat;
  padding: 4px 10px;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  box-shadow: 3px 3px 0 black;
  margin-bottom: 10px;
}

.points_title {
  width: 100%;
  background: #3b7ac4;
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 3px 3px 0 black;
  border: 2px solid black;
}

.stats__btn {
  padding: 10px;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  border-radius: 15px;
  box-shadow: 3px 3px 0 black;
  font-size: 18px;
}

.points__statistics__items {
  display: flex;
  flex-direction: column;
}

.articlus__wrapper {
  display: flex;
  border: 2px solid black;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 1px 0.7rem;
  height: 40px;
  background: white;
  box-shadow: 3px 3px 0 black;
}

.articlus__icon {
  width: 30px;
  height: 27px;
}

.points {
  min-width: 360px;
  display: flex;
  width: 100%;
}

.list__avatar {
  width: 37px;
  border-radius: 50%;
  border: 2px solid black;
}

.list {
  padding: 10px;
  border: 3px solid black;
  border-radius: 15px;
  box-shadow: 3px 3px 0 black;
  margin-bottom: 10px;
}

.points-card {
  color: #111;
  background: linear-gradient(180deg, #ffd83b, #f1c40f);
  border: 4px solid #111;
  border-radius: 20px;
  box-shadow: 4px 4px 0 #111;
  padding: 18px;
  width: 100%;
  height: 100%;
  margin-bottom: 15px;
}

.progress_exp-bar {
  width: 100%;
  height: 20px;
  background: white;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background: #6589e0;
  transition: width .4s;
}

.points-card__header {
  margin-bottom: 12px;
}

.points-card__title {
  display: inline-block;
  padding: 8px 14px;
  background: #111;
  color: #fff;
  border-radius: 14px;
  font-size: 20px;
  font-family: "Nunito", sans-serif;
  margin-bottom: 10px;
}

.points-card__list {
  padding: 10px 12px;
  background: #ffe78a;
  border: 3px solid #111;
  border-radius: 14px;
  margin-bottom: 10px;
}

.points-card__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  margin-top: 15px;
  border-top: 3px dashed #111;
}

.points-card__item + .points-card__item {
  border-top: 2px dashed rgba(0, 0, 0, .15);
}

.points-card__label {
  font-size: 19px;
  font-weight: 600;
  color: #111;
  font-family: "Nunito", sans-serif;
}

.points-card__value {
  font-size: 18px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: "Nunito", sans-serif;
  color: #111;
}


.points-card__badge {
  font-size: 18px;
  font-weight: 600;
  background: #fff;
  border: 2px solid #111;
  box-shadow: 2px 2px 0 black;
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  padding: 4px 10px;
}

.sub-badge {
  font-size: 14px;
  font-weight: 600;
  border: 3px solid #111;
  border-radius: 999px;
  padding: 3px 10px;
  background: #fff;
  font-family: "Nunito", sans-serif;
}

.sub-badge--off {
  position: relative;
  padding-left: 28px;
}

.sub-badge--off::before {
  content: "";
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff4d4f;
  border: 2px solid #111;
}

.sub-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.btn-activate {
  text-align: center;
  width: 100%;
  background: #fff;
  color: #111;
  font-size: 18px;
  border: 3px solid #111;
  border-radius: 15px;
  padding: 10px 16px;
  font-weight: 600;
  box-shadow: 4px 4px 0 #111;
  cursor: pointer;
  font-family: "Nunito", sans-serif;
  transition: transform .06s ease, box-shadow .06s ease, background .2s ease;
}

.btn-activate:hover {
  background: #ffe78a;
}

.btn-activate:active {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0 #111;
}

.btn-activate__icon {
  font-size: 16px;
  line-height: 1;
}

.points-card__progress {
  margin-top: 5px;
}

.progress__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #111;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  font-family: "Nunito", sans-serif;
}

@media (max-width: 420px) {
  .points-card {
    padding: 14px;
  }

  .points-card__value {
    font-size: 16px;
  }
}
</style>
