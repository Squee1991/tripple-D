<template>
  <div class="points">
    <section id="points" class="points-card" aria-label="member_panel">
      <VBanner
          :text="t('accountPanel.title')"
          :icon="CardIcon"
      />
      <div v-if="langStore" class="top-panel-layout">
        <div class="level-display">
          <span class="level-label">{{ t('stepHitLabels.levelTitle')}}:</span>
          <span class="level-value">{{ langStore.isLeveling || '0' }}</span>
        </div>
        <div class="custom-progress">
          <div class="progress_exp-bar">
            <div class="progress__bar" :style="{ width: `${(langStore.exp / 100) * 100}%` }">
              <div class="glare"></div>
            </div>
          </div>
          <div class="progress-circle">
            {{ langStore.exp }} / 100
          </div>
        </div>
      </div>
      <ul v-if="langStore" class="action-menu__list">
        <li v-for="section in sections" :key="section.id" :id="section.id" class="action-menu__item">
          <NuxtLink :to="section.route" class="action-menu__link">
            <div class="action-menu__left">
              <div class="action-menu__icon-bg">
                <img class="action-menu__icon" :src="section.icon" :alt="`${section.title} Icon`"/>
              </div>
              <div class="action-menu__title">{{ section.title }}</div>
            </div>
            <VArrowNav/>
          </NuxtLink>
        </li>
      </ul>
      <AccountManagement/>
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
import VArrowNav from "~/src/components/V-arrowNav.vue";
import AccountManagement from "~/src/components/AccountManagement.vue";
import VBanner from "~/src/components/V-banner.vue";
import CardIcon from "../../assets/images/card.svg";
const {t} = useI18n()
const langStore = userlangStore()
const userAuth = userAuthStore()
const router = useRouter()
const friendsStore = useFriendsStore()
const showFreezeModal = ref(false)

const formattedFreezeDate = computed(() => {
  if (!userAuth.freezeEndsAt) return ''
  const date = new Date(userAuth.freezeEndsAt)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
})

const sections = ref([
  // {id: "stats", icon: Graph, alt: 'Graph', title: t('accountPanel.stats'), route: "/statistics"},
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
.top-panel-layout {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.custom-progress {
  position: relative;
  width: 100%;
  margin-bottom: 15px;
}

.action-menu__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.action-menu__item {
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.2s;
  background:var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  padding: 6px 14px;
}

.action-menu__link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;

}

.action-menu__link:active {
  transform: translateY(4px);
  box-shadow: 0 0 0 #11151c;
}

.action-menu__left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.action-menu__icon-bg {
  background: var(--tabBg);
  border-radius: 12px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-menu__icon {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.action-menu__title {
  color: var(--titleColor);
  font-size: 16px;
  font-weight: 700;
  font-family: "Nunito", sans-serif;
}

.custom-progress .progress_exp-bar {
  height: 27px;
}

.progress-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 800;
  color: #313030;

  white-space: nowrap;
  z-index: 2;
}

.level-display {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.level-label {
  color: var(--title);
  font-size: 21px;
  font-weight: 700;
  text-shadow: 0 1px 0 var(--title);
}

.level-value {
  background: #8868db;
  border: none;
  border-radius: 6px;
  padding: 2px 8px;
  color: white;
  font-size: 19px;
  font-weight: 600;
}

.premium-button {
  width: 100%;
  background: #5093fb;
  border: 1px solid #363d4a;
  border-radius: 14px;
  padding: 14px;
  color: whitesmoke;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  transition: all 0.2s;
}

.premium-link-wrapper {
  text-align: center;
  margin-bottom: 20px;
}

.premium-link {
  color: #e2e8f0;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.2s;
}

.tooltip-container {
  position: relative;
  display: flex;
  align-items: center;
}

.tooltip-box {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  left: auto;
  transform: translateY(-10px);
  background-color: white;
  color: #a0a6b1;
  border: 3px solid #363d4a;
  border-radius: 12px;
  padding: 12px 16px;
  width: max-content;
  max-width: 260px;
  z-index: 9999;
  transition: all 0.2s ease;
  box-shadow: 3px 3px 0 black;
  pointer-events: none;
}


.tooltip-list li {
  font-size: 13px;
  margin-bottom: 6px;
  position: relative;
  padding-left: 14px;
  line-height: 1.3;
}

.tooltip-list li:last-child {
  margin-bottom: 0;
}

.tooltip-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #6589e0;
  font-size: 16px;
  line-height: 1;
}

.warning__text {
  color: #e53737;
  -webkit-text-stroke: 1px  #e53737;
  margin: 5px 0;
}

.warning__message {
  color: #a0a6b1;
  font-size: 13px;
}

.warning__wrapper {
  display: flex;
  flex-direction: column;
}

.ranked__wrapper:last-child {
  margin-bottom: 0;
}

.points__title {
  color: var(--panelTextColor);
  text-shadow: 0px 1px var(--titleColor);
  text-align: center;
  font-weight: 600;
}

.points-card__header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;
}

.points-card {
  color: #111;
  border: 4px solid var(--tabBg);
  box-shadow: var(--boxShadowMobile);
  border-radius: 20px;
  padding: 18px 15px;
  width: 100%;
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
}

.progress_exp-bar {
  flex: 1;
  height: 25px;
  background: #e8eae5;
  border-radius: 10px;
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background-color: #10b981;
  border-radius: 8px;
  transition: width 0.4s ease-out;
  position: relative;
}

.glare{
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 4px
}

.points-card__item + .points-card__item {
  border-top: 2px dashed rgba(0, 0, 0, .15);
}


@media (max-width: 420px) {
  .points-card {
    padding: 14px;
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