<template>
  <div class="points">
    <VTips
        :tips="flattenedTips"
        v-model="isArticleOpen"
    />
    <section class="points-card" aria-label="Поинты и уровень">
      <header class="points-card__header">
        <h2 class="points__title">{{ t('accountPanel.title') }}</h2>
        <button class="points__info" @click="isArticleOpen = true">
          <img class="points__info-icon" src="../../assets/images/question.svg" alt="">
        </button>
      </header>
      <ul v-if="langStore" class="points-card__list">
<!--        <li class="points-card__item">-->
<!--          <div class="points-card__label">{{ t('accountPanel.rank') }}</div>-->
<!--          <div class="points__hats-wrapper">-->
<!--            <button-->
<!--                v-if="userAuth.freezeEndsAt"-->
<!--                class="hats__shield-btn"-->
<!--                @click="showFreezeModal = true"-->
<!--            >-->
<!--              <img class="hats__icon" src="../../assets/images/FreezeShield.svg" alt="Articlus_icon">-->
<!--            </button>-->
<!--            <div id="articlus" :title="hoverTitle.title" v-if="userAuth.uid" class="articlus__wrapper">-->
<!--              <img class="articlus__icon" src="../../assets/images/graduate-hat.svg" alt="Articlus_icon">-->
<!--              <span class="points-card__value"> {{ userAuth.totalHats}}</span>-->
<!--            </div>-->
<!--          </div>-->
<!--        </li>-->
        <li class="points-card__item">
          <div class="points-card__label">{{ t('accountPanel.articles') }}</div>
          <div id="articlus" :title="hoverTitle.title" v-if="userAuth.uid" class="articlus__wrapper">
            <img class="articlus__icon" src="../../assets/images/articlus.png" alt="Articlus_icon">
            <span class="points-card__value">{{ langStore.points }}</span>
          </div>
        </li>
        <li class="points-card__item">
          <span class="points-card__label">{{ t('accountPanel.level') }}</span>
          <span id="level" :title="hoverTitle.level" class="points-card__badge">{{ langStore.isLeveling }}</span>
        </li>
        <li class="points-card__item points-card__progress">
          <div class="progress_exp-bar">
            <div class="progress__bar" :style="{ width: `${(langStore.exp / 100) * 100}%` }"></div>
            <div class="progress__meta">{{ langStore.exp }}/100 XP</div>
          </div>
        </li>
      </ul>
      <ul v-if="langStore" class="points-card__list">
        <li v-for="section in sections" :key="section.id" :id="section.id" class="ranked__wrapper">
          <NuxtLink :to="section.route" class="ranked__inner">
            <div class="ranked__title-icon">
              <img class="points-card__title-icon" :src="section.icon" :alt="`${section.key}_icon`"/>
              <div class="ranked__title">{{ section.title }}</div>
            </div>
            <img class="stat__icon" src="../../assets/images/dailyIcons/arrow-to.svg" alt="Arrow_icon"/>
          </NuxtLink>
        </li>
      </ul>
    </section>
    <div v-if="showFreezeModal" class="modal-overlay" @click.self="showFreezeModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{t('cardTime.title')}}</h3>
        </div>
        <div class="modal-body">
          <p class="modal-text">{{t('pointsTimeOverlay.text')}}</p>
          <div class="freeze-status">
            <span class="status-label">{{t('pointsTimeOverlay.activeTill')}}</span>
            <span class="status-date">{{ formattedFreezeDate }}</span>
          </div>
          <div class="warning__wrapper">
            <span class="warning__text">{{t('pointsTimeOverlay.warning')}}</span>
            <p class="warning__message">{{t('pointsTimeOverlay.warningText')}}</p>
          </div>
        </div>
        <button class="modal-close-btn" @click="showFreezeModal = false">{{t('cardsShop.accessibly')}}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import VTips from "~/src/components/V-tips.vue";
import {userlangStore} from "~/store/learningStore.js";
import {userAuthStore} from '../../store/authStore.js'
import {useRouter} from "vue-router";
import {useFriendsStore} from '../../store/friendsStore.js'
import {onMounted, ref, computed} from "vue";
import Graph from '../../assets/images/graph.svg'
import AchPanelIcon from '../../assets/images/AchPanelIcon.svg'
import RankedIcon from '../../assets/images/RankedIcon.svg'
import Calendar from '../../assets/images/calendar (2).svg'
import { useRankUserStore } from '../../store/rankStore.js'

const rankStore = useRankUserStore()
const {t} = useI18n()
const langStore = userlangStore()
const userAuth = userAuthStore()
const router = useRouter()
const friendsStore = useFriendsStore()
const isArticleOpen = ref(false)
const showFreezeModal = ref(false)

const formattedFreezeDate = computed(() => {
  if (!userAuth.freezeEndsAt) return ''
  const date = new Date(userAuth.freezeEndsAt)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
})

const flattenedTips = computed(() => {
  const result = [];
  infoData.value.forEach(section => {
    result.push({ label: section.title, isTitle: true });
    section.tips.forEach(tip => {
      result.push({ label: tip.label, isTitle: false });
    });
  });
  return result;
});

const hoverTitle = {
  title: t('hoverTitle.articles'),
  level: t('hoverTitle.level')
}
const infoData = ref([
  // {id: "rank",
  //   title: t('pavelOverlay.rankTitle'),
  //   tips:[
  //     {label: t('pavelOverlay.rankLabelOne')},
  //     {label: t('pavelOverlay.rankLabelTwo')},
  //     {label: t('pavelOverlay.rankLabelThree')}
  //   ]
  // },
  {id: "article",
    title: t('pavelOverlay.articleTitle'),
    tips:[
      {label: t('pavelOverlay.articleLabelOne')},
      {label: t('pavelOverlay.articleLabelTwo')}
    ]
  },
  {id: "level",
    title: t('pavelOverlay.levelTitle'),
    tips:[
      {label: t('pavelOverlay.levelLabelOne')},
      {label: t('pavelOverlay.levelLabelTwo')}
    ]
  }
])
const sections = ref([
  {id: "stats", icon: Graph, alt: 'Graph', title: t('accountPanel.stats'), route: "/statistics"},
  {id: "achievement", icon: AchPanelIcon, alt: 'AchPanel', title: t('accountPanel.achievement'), route: "/achievements"},
  {id: "ranked", icon: RankedIcon, alt: 'Ranked', title: t('accountPanel.ranked'), route: "/leaderboard"},
  {id: "calendar", icon: Calendar, alt: 'Ranked', title: t('accountPanel.eventCalendar'), route: "/calendar"},
])

const toPayment = () => {
  router.push('/pay')
}

onMounted(() => {
  friendsStore.loadFriends()
})

</script>

<style scoped>

.warning__text {
  color: #e53737;
  -webkit-text-stroke: 1px  #e53737;
  margin: 5px 0;
}

.warning__message {
  color: #a0a6b1;;
  font-size: 13px;
}

.warning__wrapper {
  display: flex;
  flex-direction: column;
}

.points-card__title-icon {
  width: 45px;
}

.hats__icon {
  width: 40px;
}

.points__hats-wrapper {
  display: flex;
  align-items: center;
}

.points__info {
  border: none;
  background: none;
}

.points__info-icon {
  width: 50px;
}

.ranked__title-icon {
  display: flex;
  align-items: center;
}

.star{
  font-size: 30px;
}
.ranked__inner {
  width: 100%;
  border: 2px solid var(--border);
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 1px 5px;
  box-shadow: 2px 2px 0  var(--border);
  transition: .2s;
  background: white;
}

.ranked__wrapper:last-child .ranked__inner {
  margin-bottom: 0;
}

@media (min-width: 1024px) {
  .ranked__inner:hover {
    box-shadow: 0 0 0;
    transform: translate(1px , 1px);
    transition: .2s;
  }
}

.ranked__title {
  color: var(--labelTextColor);
  font-size: 18px;
  margin-left: 8px;
  font-weight: 600;
}

.points__title {
  color: var(--panelTextColor);
}

.stat__icon {
  width: 40px;
  transform: rotate(90deg);
  margin-left: 5px;
}

@media (min-width: 1023px) {
  .stats__btn:hover {
    transform: scale(1.05);
    transition: .3s;
  }
}

.stats__btn {
  display: flex;
  align-items: center;
  border: 2px solid var(--border);
  box-shadow: 0 3px 0 var(--border);
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.2rem;
  padding: 0 5px;
  color: #6ea4f1;
  transition: .3s;
  background: none;
}

.articlus__wrapper {
  display: flex;
  width: 90px;
  border:2px solid var(--border);
  box-shadow: 2px 2px 0 var(--border);
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 1px 0.7rem;
  height: 40px;
  background: white;
}

.articlus__icon {
  width: 35px;
  height: 31px;
}

.points {
  min-width: 340px;
  display: flex;
  width: 100%;
}

.hats__shield-btn {
  background: none;
  border: none;
  margin-right: 5px;
  cursor: pointer;
  transition: transform 0.2s;
}

.hats__shield-btn:hover {
  transform: scale(1.05);
}

.points-card {
  color: #111;
  border: 3px solid var(--border);
  border-radius: 20px;
  box-shadow: 2px 2px 0 var(--border);
  padding: 10px 15px;
  width: 100%;
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
}

.progress_exp-bar {
  width: 100%;
  height: 23px;
  background: #e8eae5;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.rank-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rank-display__stars {
  display: flex;
  justify-content: center;
  gap: 2px;
  height: 16px;
}

.rank-star {
  color: #ffcc00;
  font-size: 20px;
  text-shadow: 1px 1px 0px rgba(0,0,0,0.2);
}

.rank-display__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rank-display__icon {
  width: 51px;
  height: 51px;
  object-fit: contain;
}

.rank-display__placeholder {
  font-size: 24px;
}

.rank-display__info {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.rank-display__title {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  color: #666;
}

.rank-display__hats {
  font-size: 14px;
  font-weight: 700;
  color: #111;
}

.points-card__item:nth-child(2) {
  border-top: 3px dashed var(--border);
}

.points-card__list {
  margin-bottom: 2px;
  padding: 1px 0;
  position: relative;
  z-index: 1;
}

.points-card__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px;
  margin-top: 8px;

}

.points-card__item + .points-card__item {
  border-top: 2px dashed rgba(0, 0, 0, .15);
}

.points-card__label {
  font-size: 19px;
  font-weight: 600;
  color: var(--panelTextColor);
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
  border: 2px solid var(--border);
  box-shadow: 2px 2px 0 var(--border);
  border-radius: 10px;
  font-family: "Nunito", sans-serif;
  padding: 4px 10px;
}

.sub-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.points-card__progress {
  margin: 10px 0;
  padding-bottom: 10px;
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

  .ranked__title {
    font-size: 18px;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
  padding: 20px;
}

.modal-content {
  background: #1c222d;
  border: 2px solid #ccdfec;
  border-radius: 20px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.2s ease-out;
  text-align: center;
}

@keyframes slideIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  margin-bottom: 16px;
}

.modal-title {
  color: white;
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.modal-body {
  margin-bottom: 24px;
}

.modal-text {
  color: #a0a6b1;
  font-size: 15px;
  margin-bottom: 16px;
}

.freeze-status {
  background: #2a313e;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #363d4a;
}

.status-label {
  display: block;
  color: #a0a6b1;
  font-size: 12px;
  margin-bottom: 4px;
}

.status-date {
  color: #50a2d8;
  font-size: 18px;
  font-weight: 700;
}

.modal-close-btn {
  width: 100%;
  padding: 12px;
  background: #f1c40f;
  border: none;
  border-radius: 12px;
  color: #1c222d;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 0 #c29d0b;
  transition: transform 0.1s;
}

.modal-close-btn:active {
  box-shadow: none;
  transform: translateY(4px);
}
</style>