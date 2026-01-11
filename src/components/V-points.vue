<template>
  <div class="points">
    <VTips :title="articleData.title"
           :tips="articleData.tips"
           v-model="isArticleOpen"
    />
    <section class="points-card" aria-label="Поинты и уровень">
      <header class="points-card__header">
        <h2 class="points__title">{{ t('accountPanel.title') }}</h2>
      </header>
      <ul v-if="langStore" class="points-card__list">
        <li class="points-card__item">
          <div class="points-card__label">{{ t('accountPanel.articles') }}</div>
          <button id="articlus" :title="hoverTitle.title" v-if="userAuth.uid" @click="openArticleModal" class="articlus__wrapper">
            <img class="articlus__icon" src="../../assets/images/articlus.png" alt="Articlus_icon">
            <span class="points-card__value">{{ langStore.points }}</span>
          </button>
        </li>
        <li class="points-card__item">
          <div class="points-card__label">{{ t('Звание') }}</div>
          <button id="articlus" :title="hoverTitle.title" v-if="userAuth.uid" @click="openArticleModal" class="articlus__wrapper">
            <span class="star">📓</span>
            <span class="points-card__value">0</span>
          </button>
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
      <!--      <div v-if="userAuth.isPremium" class="sub-actions">-->
      <!--        <article class="super-card">-->
      <!--          <div>-->
      <!--            <span class="super-card__badge">{{ t('accountPanel.premium') }}</span>-->
      <!--          </div>-->
      <!--          <p class="sub__text">{{ t('accountPanel.premDescription') }}</p>-->
      <!--          <button @click="toPayment" class="super-card__cta">-->
      <!--            {{ t('accountPanel.try') }}-->
      <!--          </button>-->
      <!--        </article>-->
      <!--      </div>-->
    </section>
  </div>
</template>
<script setup>
import Snow from '../../assets/images/shovel.svg'
import VTips from "~/src/components/V-tips.vue";
import {userlangStore} from "~/store/learningStore.js";
import {userAuthStore} from '../../store/authStore.js'
import {useRouter} from "vue-router";
import {useFriendsStore} from '../../store/friendsStore.js'
import {onMounted, ref, watch} from "vue";
import Graph from '../../assets/images/graph.svg'
import AchPanelIcon from '../../assets/images/AchPanelIcon.svg'
import RankedIcon from '../../assets/images/RankedIcon.svg'
import Calendar from '../../assets/images/calendar (2).svg'

const {t} = useI18n()
const langStore = userlangStore()
const userAuth = userAuthStore()
const router = useRouter()
const friendsStore = useFriendsStore()
const isArticleOpen = ref(false)
const handleLeveling = () => {
  const LEVEL_UP_XP = 100
  if (langStore.exp >= LEVEL_UP_XP) {
    langStore.isLeveling++
    langStore.exp -= LEVEL_UP_XP
  }
}
const hoverTitle = {
  title: t('hoverTitle.articles'),
  level: t('hoverTitle.level')
}
const sections = ref([
  {id: "stats", icon: Graph, alt: 'Graph', title: t('accountPanel.stats'), route: "/statistics"},
  {
    id: "achievement",
    icon: AchPanelIcon,
    alt: 'AchPanel',
    title: t('accountPanel.achievement'),
    route: "/achievements"
  },
  {id: "ranked", icon: RankedIcon, alt: 'Ranked', title: t('accountPanel.ranked'), route: "/leaderboard"},
  {id: "calendar", icon: Calendar, alt: 'Ranked', title: t('accountPanel.eventCalendar'), route: "/calendar"},
])

const toPayment = () => {
  router.push('/pay')
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
watch(() => langStore.exp, (newVal) => {
  handleLeveling()
})
onMounted(() => {
  friendsStore.loadFriends()
})

</script>
<style scoped>

.points-card__title-icon {
  width: 45px;
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
  border: 2px solid black;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 3px 5px;
  box-shadow: 2px 2px 0 black;
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
  color: #1c1b1b;
  font-size: 18px;
  margin-left: 8px;
  font-weight: 600;
}

.points__title {
  color: var(--titleColor);
  -webkit-text-stroke : 1px var(--titleColor);
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
  border:2px solid black;
  box-shadow: 2px 2px 0 black;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 1px 0.7rem;
  height: 40px;
  background: white;
}


.articlus__icon {
  width: 30px;
  height: 27px;
}

.points {
  min-width: 340px;
  display: flex;
  width: 100%;
}

.points-card {
  color: #111;
  border: 3px solid var(--border);
  border-radius: 20px;
  box-shadow: 2px 2px 0 var(--border);
  padding: 18px;
  width: 100%;
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
}

.progress_exp-bar {
  width: 100%;
  height: 25px;
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
  margin-bottom: 12px;
  position: relative;
  z-index: 1;
}

.points-card__list {
  margin-bottom: 10px;
  padding: 3px 0;
  position: relative;
  z-index: 1;
}

.points-card__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 4px;
  margin-top: 15px;
  border-top: 3px dashed var(--border);
}

.points-card__item + .points-card__item {
  border-top: 2px dashed rgba(0, 0, 0, .15);
}

.points-card__label {
  font-size: 19px;
  font-weight: 600;
  color: var(--titleColor);
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

.super-card {
  position: relative;
  width: 100%;
  background: var(--bg);
  border: 4px solid var(--border);
  border-radius: 18px;
  padding: 16px 16px 14px;
  margin-bottom: 10px;
}

.super-card__badge {
  display: inline-block;
  font-weight: 900;
  font-size: 1.5rem;
  font-family: "Nunito", sans-serif;
  color: var(--titleColor);
  margin-bottom: 8px;
}

.super-card__cta {
  width: 100%;
  border: 1px solid #6ea4f1;
  border-radius: 14px;
  padding: 10px;
  font-size: 19px;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  color: white;
  background: #1f68cb;
  box-shadow: 0px 3px 0 #60a5fa;
  cursor: pointer;
  transition: transform .06s ease, box-shadow .06s ease, filter .2s ease;
}

.super-card__cta:hover {
  filter: brightness(1.05);
}

.super-card__cta:active {
  transform: translate(3px, 3px);
  box-shadow: 1px 1px 0 #111;
}

.sub__text {
  font-family: "Nunito", sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 10px 0;
  color: var(--titleColor);
}
</style>
