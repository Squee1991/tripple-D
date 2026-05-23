<template>
  <div class="header-stats">
    <!-- ПОЛНОЭКРАННЫЙ ОВЕРЛЕЙ -->
    <transition name="fade">
      <div v-if="activeTooltip" class="global-overlay" @click="closeTooltips"></div>
    </transition>

    <div
        v-for="item in infoData"
        :key="item.id"
        class="stat-item-wrapper"
    >
      <button class="stat-btn" @click.stop="handleStatClick(item)">
        <img
            v-if="item.id === 'rank' && userAuth.isFreezeActive"
            class="stat-icon freeze-icon"
            :src="FreezeShield"
            alt="Freeze"
            @click.stop="openFreezeModal"
        >
        <img
            :class="{'heart': item.id === 'lives'}"
            class="stat-icon"
            :src="item.icon"
            :alt="item.alt"
        >
        <span v-if="!userAuth.isPremium || item.id !== 'lives'" class="stat-value">{{ item.value }}</span>
      </button>
      <transition name="fade">
        <!-- Добавил уникальный класс для каждого тултипа на основе его id -->
        <div v-if="activeTooltip === item.id" class="tooltip-box" :class="'tooltip-' + item.id" @click="activeTooltip = false">
          <div class="tooltip-header">
            <img :src="item.icon" class="tooltip-title-icon" :alt="item.alt">
            <div class="tooltip-title">{{ item.title }}</div>
          </div>
          <ul class="tooltip-list">
            <li v-for="tip in item.tips" :key="tip.label">{{ tip.label }}</li>
          </ul>
        </div>
      </transition>
    </div>
    <transition name="slide-down">
      <div v-if="showFreezeModal" class="modal-overlay" @click.self="showFreezeModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">{{ t('cardTime.title') }}</h3>
          </div>
          <div class="modal-body">
            <p class="modal-text">{{ t('pointsTimeOverlay.text') }}</p>
            <div class="freeze-status">
              <span class="status-label">{{ t('pointsTimeOverlay.activeTill') }}</span>
              <span class="status-date">{{ formattedFreezeDate }}</span>
            </div>
            <div class="warning__wrapper">
              <span class="warning__text">{{ t('pointsTimeOverlay.warning') }}</span>
              <p class="warning__message">{{ t('pointsTimeOverlay.warningText') }}</p>
            </div>
          </div>
          <button class="modal-close-btn" @click="showFreezeModal = false">{{ t('cardsShop.accessibly') }}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import {userlangStore} from "~/store/learningStore.js"
import {userAuthStore} from '../../store/authStore.js'
import { userChainStore } from '../../store/chainStore.js'
import { useI18n } from 'vue-i18n'
import FreezeShield from '../../assets/images/FreezeShield.svg'
import Hats from '../../assets/images/hatsNAv.svg'
import Articlus from '../../assets/images/article.svg'
import Heart from '../../assets/images/heartInfo.svg'
import Forever from '../../assets/images/forever.svg'

const {t} = useI18n()
const langStore = userlangStore()
const userAuth = userAuthStore()
const chainStore = userChainStore()

const activeTooltip = ref(null)
const showFreezeModal = ref(false)

const formattedFreezeDate = computed(() => {
  if (!userAuth.freezeEndsAt) return ''
  const date = new Date(userAuth.freezeEndsAt)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
})

const infoData = computed(() => [
  {
    id: "rank",
    title: t('pavelOverlay.rankTitle'),
    tips: [
      {label: t('pavelOverlay.rankLabelOne')},
      {label: t('pavelOverlay.rankLabelTwo')},
      {label: t('pavelOverlay.rankLabelThree')}
    ],
    icon: Hats,
    alt: "Hats",
    value: userAuth.totalHats,
    isFreeze: userAuth.isFreezeActive
  },
  {
    id: "article",
    title: t('pavelOverlay.articleTitle'),
    tips: [
      {label: t('pavelOverlay.articleLabelOne')},
      {label: t('pavelOverlay.articleLabelTwo')}
    ],
    icon: Articlus,
    alt: "Articles",
    value: langStore?.points || 0,
    isFreeze: false
  },
  {
    id: "lives",
    title: t('pavelOverlay.livesTitle'),
    tips: [
      {label: t('pavelOverlay.livesLabelOne')},
      {label: t('pavelOverlay.livesLabelTwo')}
    ],
    icon: userAuth.isPremium ? Forever : Heart,
    alt: "Level/Heart",
    value: chainStore.lives || 0,
    isFreeze: false
  }
])

const handleStatClick = (item) => {
  activeTooltip.value = activeTooltip.value === item.id ? null : item.id
}

const openFreezeModal = () => {
  showFreezeModal.value = true
  activeTooltip.value = null
}

const closeTooltips = () => {
  activeTooltip.value = null
}

onMounted(() => {
  document.addEventListener('click', closeTooltips)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeTooltips)
})
</script>

<style scoped>
/* СТИЛИ ОВЕРЛЕЯ */
.global-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 9998;
}

.header-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 0 10px;
  position: relative;
}

.stat-item-wrapper {
  display: flex;
}

.stat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  background: none;
  padding: 0 2px;
  height: 38px;
  cursor: pointer;
}

.stat-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.stat-icon.heart {
  height: 33px;
  width: 33px;
}

.freeze-icon {
  width: 28px;
  height: 28px;
}

.stat-value {
  font-size: 18px;
  font-weight: 800;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
}

.tooltip-box {
  position: absolute;
  top: calc(100% + 5px);
  left: 10px;
  right: 10px;
  background-color: var(--bg);
  color: #a0a6b1;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 12px;
  padding: 16px;
  width: auto;
  max-width: none;
  z-index: 9999;
  box-shadow: 3px 3px 0 var(--tabsSlideBorderColor);
}

.tooltip-box::before {
  content: '';
  position: absolute;
  top: -10px;
  border-width: 0 10px 10px 10px;
  border-style: solid;
  border-color: transparent transparent var(--tabsSlideBorderColor) transparent;
}

/* Привязка стрелочек к конкретным ID, теперь они железно стоят на своих местах */
.tooltip-rank::before {
  left: 20px;
  right: auto;
}

.tooltip-article::before {
  left: 50%;
  transform: translateX(-50%);
  right: auto;
}

.tooltip-lives::before {
  right: 20px;
  left: auto;
  transform: none;
}

.tooltip-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 2px dashed #eaeaea;
}

.tooltip-title-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.tooltip-title {
  color: #5482d9;
  font-size: 19px;
  font-weight: 900;
  margin: 0;
  text-align: left;
  text-shadow: 1px 1px #5482d9;
}

.tooltip-list {
  color: var(--titleColor);
  font-weight: 600;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tooltip-list li {
  font-size: 13px;
  margin-bottom: 8px;
  position: relative;
  padding-left: 14px;
  line-height: 1.4;
  text-align: left;
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
  font-weight: bold;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
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
  z-index: 10000;
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
  text-align: center;
  margin-top: 10px;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}

.modal-title {
  color: white;
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 800;
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
  margin-bottom: 15px;
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

.warning__text {
  color: #e53737;
  -webkit-text-stroke: 1px #e53737;
  margin: 5px 0;
  display: block;
  font-weight: bold;
}

.warning__message {
  color: #a0a6b1;
  font-size: 13px;
  margin-bottom: 15px;
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
}

.modal-close-btn:active {
  box-shadow: none;
  transform: translateY(4px);
}
</style>