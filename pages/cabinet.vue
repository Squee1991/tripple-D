<template>
  <div class="cabinet-wrapper">
    <!-- Модалка отмены подписки -->
    <div v-if="isCancelModalOpen" class="modal-overlay" @click.self="isCancelModalOpen = false">
      <div class="modal-card">
        <div class="modal-title">{{ t('cabinet.cancelPremium') }}</div>
        <p class="modal-text">{{ t('cabinet.cancelPremiumText') }}</p>
        <div class="modal-actions">
          <button class="btn" @click="isCancelModalOpen = false" type="button">
            {{ t('cabinet.reject') }}
          </button>
          <button class="btn btn-danger" @click="cancelSubscription" type="button">
            {{ t('cabinet.accept') }}
          </button>
        </div>
      </div>
    </div>
    <div class="layout__cabinet">
      <aside class="sidebar-panel">
        <button v-if="!isMobile" class="back-btn" @click="router.push('/')" aria-label="to main" type="button">
          <img class="back__btn-icon" :src="Home" alt="Home"/>
          <span class="back-label">{{ t('cabinet.main') }}</span>
        </button>
        <div class="sidebar-title">{{ t('cabinet.category') }}</div>
        <nav class="nav-container">
          <div
              class="sliding-bg"
              :class="{ 'no-transition': !enableTransition }"
              :style="{
                transform: isMobile
                  ? `translateX(${getTransform(activeIndex, tabItems.length)}%)`
                  : `translateY(${getTransform(activeIndex, tabItems.length, true)}%)`,
                opacity: activeIndex === -1 ? 0 : 1
              }"
          ></div>
          <button
              v-for="tabItem in tabItems"
              :key="tabItem.key"
              class="nav-item"
              :class="{ 'is-active': activeTabKey === tabItem.key }"
              @click="setActiveTab(tabItem)"
              type="button"
          >
            <img class="nav-icon" :src="tabItem.icon" :alt="tabItem.alt"/>
            <span class="nav-label">{{ tabItem.label }}</span>
          </button>
        </nav>
      </aside>
      <section class="content-panel">
        <ClientOnly>
          <div class="content-body">
            <VTransition>
              <div v-if="activeTabKey === 'info'" class="header-surface" key="info">
                <div v-if="isSettingsOpen" class="settings-wrapper">
                  <VSettings
                      :userIcon="UserAccIcon"
                      :settingsIcon="OptionIcon"
                      :faqIcon="FaqIcon"
                      :activeTabKey="activeTabKey"
                      :awards="awardList"
                      @back="isSettingsOpen = false"
                      @open="handleSettingsAction"
                  />
                </div>
                <div v-else class="settings-wrapper">
                  <Transition name="menu-appear" appear>
                    <div class="user__interface">
                      <!-- Блок пользователя -->
                      <div class="user-block">
                        <div class="avatar-wrapper">
                          <div class="avatar-container">
                            <img
                                v-if="authStore.avatarUrl"
                                :src="authStore.avatarUrl"
                                alt="avatar"
                                class="avatar-current"
                                :class="currentAvatarEffectClass"
                            />
                            <div v-else class="avatar-placeholder"></div>
                          </div>
                          <button
                              @click="isAvatarModalOpen = true"
                              class="change-avatar-btn"
                              title="Change avatar"
                              type="button"
                          >
                            <img src="../assets/images/add.svg" alt="add"/>
                          </button>
                        </div>
                        <div class="user-info-container">
                          <div class="user__name">{{ authStore.name }}</div>
                          <div v-if="learningStore" class="top-panel-layout">
                            <div class="custom-progress">
                              <div class="progress_exp-bar">
                                <div class="progress__bar" :style="{ width: `${learningStore.exp}%` }">
                                  <div class="glare"></div>
                                </div>
                              </div>
                              <div class="progress-circle">
                                {{ learningStore.exp }} / 100
                              </div>
                            </div>
                            <div class="level-display">
                              <span class="level-value">{{ learningStore.isLeveling || '0' }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="account-tabs">
                        <div
                            class="sliding-bg-account"
                            :class="{ 'no-transition': !enableTransition }"
                            :style="{
                              transform: `translateX(${getTransform(activeAccountIndex, accountTabs.length)}%)`,
                              opacity: activeAccountIndex === -1 ? 0 : 1
                            }"
                        ></div>
                        <button
                            v-for="tab in accountTabs"
                            :key="tab.key"
                            class="account-tab"
                            :class="{ active: accountTab === tab.key }"
                            @click="accountTab = tab.key"
                            type="button"
                        >
                          <img class="tab-icon --horizontal" :src="tab.icon" :alt="tab.alt">
                          <span class="tab__text">{{ tab.label }}</span>
                        </button>
                      </div>

                      <div class="account-tab-body">
                        <transition name="fade" mode="out-in">
                          <div v-if="accountTab === 'common'" class="tab-surface" key="common">
                            <PersonalInfoRows/>
                          </div>
                          <div v-else-if="accountTab === 'awards'" class="tab-surface" key="awards">
                            <AwardsList :awards="awardList"/>
                          </div>
                          <div v-else-if="accountTab === 'rank'" class="rank-placeholder" key="rank">
                            <VRank/>
                          </div>
                        </transition>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
              <div v-else class="tab__component-wrapper" :key="activeTabKey">
                <component :is="activeComponent" @open="handleSettingsAction"/>
              </div>
            </VTransition>
          </div>
        </ClientOnly>
      </section>
    </div>
    <div v-if="isAvatarModalOpen" class="avatar-modal-overlay" @click.self="isAvatarModalOpen = false">
      <div class="avatar-modal-content">
        <h3>{{ t('cabinet.newAvatarTitle') }}</h3>
        <div class="account-tabs avatar-tabs">
          <div
              class="sliding-bg-account avatar-sliding-bg"
              :class="{ 'no-transition': !enableTransition }"
              :style="{
                transform: `translateX(${getTransform(activeAvatarTabIndex, avatarTabs.length)}%)`,
                opacity: activeAvatarTabIndex === -1 ? 0 : 1
              }"
          ></div>
          <button
              v-for="tab in avatarTabs"
              :key="tab.key"
              class="account-tab"
              :class="{ active: activeAvatarTab === tab.key }"
              @click="activeAvatarTab = tab.key"
              type="button"
          >
            <span class="tab__text">{{ tab.label }}</span>
          </button>
        </div>
        <div class="avatar-scroll-container">
          <transition name="fade" mode="out-in">
            <div class="avatar-grid" :key="activeAvatarTab">
              <div
                  v-for="avatarName in currentViewAvatars"
                  :key="avatarName"
                  class="avatar-option"
                  @click="authStore.ownedAvatars.includes(avatarName) ? selectAvatar(avatarName) : openPurchaseModal(avatarName)"
              >
                <div
                    class="avatar__image-wrapper"
                    :class="{
                      selected: selectedAvatarName === avatarName,
                      unowned: !authStore.ownedAvatars.includes(avatarName)
                    }"
                >
                  <img class="avatar-img" :src="authStore.getAvatarUrl(avatarName)" :alt="avatarName"/>
                </div>
                <div v-if="!authStore.ownedAvatars.includes(avatarName)" class="avatar-price">
                  <span>50</span>
                  <img class="price-icon" src="../assets/images/article.svg" alt="coins">
                </div>
              </div>
            </div>
          </transition>
        </div>
        <div class="modal-actions">
          <button @click="isAvatarModalOpen = false" class="btn" type="button">
            {{ t('cabinet.avatarCancel') }}
          </button>
          <button
              @click="confirmAvatarChange"
              :disabled="!selectedAvatarName"
              class="btn btn-success"
              type="button"
          >
            {{ t('cabinet.avatarSave') }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="isPurchaseModalOpen" class="modal-overlay" @click.self="isPurchaseModalOpen = false">
      <div class="modal-card">
        <template v-if="purchaseState === 'success'">
          <div class="modal-title">{{ t('cabinet.boughtAvatar') }}</div>
          <div class="modal-actions">
            <button class="btn btn-success" @click="closePurchaseOk" type="button">
              {{ t('cabinet.boughtBtn') }}
            </button>
          </div>
        </template>
        <template v-else-if="purchaseState === 'insufficient'">
          <div class="modal-title">{{ t('cabinet.notEnoughtArticles') }}</div>
          <div class="modal-actions">
            <button class="btn" @click="closePurchaseOk" type="button">
              {{ t('cabinet.boughtBtn') }}
            </button>
          </div>
        </template>
        <template v-else-if="isRankAvatarLocked">
          <p class="modal__text--computed" style="font-size: 18px; margin-top: 10px;">
            {{ t(`rankAvatars.${purchaseState}`) }}
          </p>
          <div class="modal-actions">
            <button class="btn" @click="closePurchaseOk" type="button">
              {{ t('cardsShop.accessibly') }}
            </button>
          </div>
        </template>
        <template v-else>
          <div class="modal-title">{{ t('cabinet.buyAvatar') }}</div>
          <div class="price__avatar-text">
            <span class="modal-text">50</span>
            <img class="articles" src="../assets/images/article.svg" alt="articles">
          </div>
          <div class="modal-actions">
            <button class="btn" @click="isPurchaseModalOpen = false" type="button">
              {{ t('cabinet.notBuyAvatarBtn') }}
            </button>
            <button class="btn btn-success" @click="confirmPurchase" type="button">
              {{ t('cabinet.buyAvatarBtn') }}
            </button>
          </div>
        </template>
      </div>
    </div>
    <div v-if="isSnowWarningModalOpen" class="modal-overlay" @click.self="isSnowWarningModalOpen = false">
      <div class="modal-card">
        <div class="modal-title">❄️ {{ t('cabinet.notAllow') }}</div>
        <p class="modal-text">
          {{ t('cabinet.modalNotAllowEffectFirst') }} <b>{{ t('cabinet.modalNotAllowEffectSecond') }}</b>.<br/>
          {{ t('cabinet.modalNotAllowEffectThird') }}
        </p>
        <div class="modal-actions">
          <button class="btn" @click="isSnowWarningModalOpen = false" type="button">
            {{ t('cabinet.modalNotAllowEffectClose') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch, watchEffect} from 'vue'
import {useRouter} from 'vue-router'

import AwardsList from '~/src/components/AwardsList.vue'
import VNews from '../src/components/V-news.vue'
import VRank from '../src/components/V-rank.vue'
import PersonalInfoRows from '../src/components/PersonalInfoRows.vue'
import Shop from '../src/components/V-shop.vue'
import VSettings from '../src/components/V-settings.vue'
import VTransition from '~/src/components/V-transition.vue'

import UserAccIcon from '../assets/accountToggleIcons/user.svg'
import FaqIcon from '../assets/accountToggleIcons/faq.svg'
import OptionIcon from '../assets/accountToggleIcons/option.svg'
import Home from '../assets/images/home.svg'

import {userAuthStore} from '../store/authStore.js'
import {userlangStore} from '../store/learningStore.js'
import {useAchievementStore} from '../store/achievementStore.js'
import {useEventSessionStore} from '~/store/eventsStore.js'
import {AWARDS} from '~/utils/awards'

import {
  MAIN_NAV_ITEMS,
  HOME_NAV_ITEM,
  ACCOUNT_TABS_CONFIG,
  AVATAR_TABS_CONFIG
} from '~/constants/cabinet.constants.js'
import {useCabinetAvatars} from '~/composables/useCabinetAvatars.js'

definePageMeta({robots: {index: false, follow: false}})

const {t, locale} = useI18n()
const router = useRouter()
const authStore = userAuthStore()
const learningStore = userlangStore()
const achievementStore = useAchievementStore()
const eventStore = useEventSessionStore()

const MAIN_TAB_KEY = 'cabinet_active_main_tab'
const ACC_TAB_KEY = 'cabinet_active_acc_tab'

const isSettingsOpen = ref(false)
const isMobile = ref(false)
const enableTransition = ref(false)
const isCancelModalOpen = ref(false)
const isSnowWarningModalOpen = ref(false)

const activeTabKey = ref((process.client && sessionStorage.getItem(MAIN_TAB_KEY)) || 'info')
const accountTab = ref((process.client && sessionStorage.getItem(ACC_TAB_KEY)) || 'common')

const {
  isAvatarModalOpen,
  isPurchaseModalOpen,
  selectedAvatarName,
  purchaseState,
  activeAvatarTab,
  isRankAvatarLocked,
  currentAvatarEffectClass,
  currentViewAvatars,
  openPurchaseModal,
  selectAvatar,
  confirmPurchase,
  confirmAvatarChange,
  closePurchaseOk
} = useCabinetAvatars(authStore)

watch(isAvatarModalOpen, (opened) => {
  if (opened) selectedAvatarName.value = authStore.avatar
})

const tabItems = computed(() => {
  const items = MAIN_NAV_ITEMS.map(i => ({...i, label: t(i.labelKey)}))
  if (isMobile.value) {
    return [{...HOME_NAV_ITEM, label: t(HOME_NAV_ITEM.labelKey)}, ...items]
  }
  return items
})

const accountTabs = computed(() =>
    ACCOUNT_TABS_CONFIG.map(tab => ({...tab, label: t(tab.labelKey)}))
)

const avatarTabs = computed(() =>
    AVATAR_TABS_CONFIG.map(tab => ({...tab, label: t(tab.labelKey)}))
)

const activeIndex = computed(() => tabItems.value.findIndex(item => item.key === activeTabKey.value))
const activeAccountIndex = computed(() => accountTabs.value.findIndex(tab => tab.key === accountTab.value))
const activeAvatarTabIndex = computed(() => avatarTabs.value.findIndex(tab => tab.key === activeAvatarTab.value))

const TAB_COMPONENTS = {
  archive: VNews,
  settings: VSettings,
  shop: Shop
}
const activeComponent = computed(() => TAB_COMPONENTS[activeTabKey.value] || null)

const getTransform = (index, arrayLength, isVertical = false) => {
  if (index === -1) return 0
  if (locale.value === 'ar' && !isVertical) {
    return (arrayLength - 1 - index) * 100
  }
  return index * 100
}

function setActiveTab(tab) {
  if (tab.url) {
    router.push(tab.url)
    return
  }
  activeTabKey.value = tab.key
  sessionStorage.setItem(MAIN_TAB_KEY, tab.key)
}

watch(accountTab, (newTab) => {
  sessionStorage.setItem(ACC_TAB_KEY, newTab)
})

function handleSettingsAction(action) {
  const actions = {
    cancelPremium: () => {
      isCancelModalOpen.value = true
    },
    deleteAccount: () => router.push('/delete'),
    snowWarning: () => {
      isSnowWarningModalOpen.value = true
    },
    faq: () => router.push('/faq')
  }
  actions[action]?.()
}

const awardsStorageKey = computed(() => `awards_shown_v1_${authStore.uid || 'anon'}`)

function loadShownAwards() {
  if (!process.client) return new Set()
  try {
    const raw = localStorage.getItem(awardsStorageKey.value)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveShownAwards(set) {
  if (!process.client) return
  try {
    localStorage.setItem(awardsStorageKey.value, JSON.stringify([...set]))
  } catch {
  }
}

const shownAwardsSet = ref(loadShownAwards())
const awardList = ref(AWARDS.map(a => ({
  ...a,
  locked: a.key === 'registerAchievement' ? false : !shownAwardsSet.value.has(a.key)
})))

watch(() => authStore.uid, () => {
  shownAwardsSet.value = loadShownAwards()
  awardList.value = AWARDS.map(a => ({...a, locked: !shownAwardsSet.value.has(a.key)}))
})

const processed = new Set(shownAwardsSet.value)
watchEffect(() => {
  const groups = achievementStore.groups || []
  for (const group of groups) {
    for (const achievement of group.achievements || []) {
      const id = achievement.id
      if (!id || processed.has(id)) continue
      if (achievement.currentProgress >= achievement.targetProgress) {
        const item = awardList.value.find(a => a.key === id)
        if (item && item.locked) {
          item.locked = false
          processed.add(id)
          shownAwardsSet.value.add(id)
          saveShownAwards(shownAwardsSet.value)
        }
      }
    }
  }
})

async function cancelSubscription() {
  if (!authStore.uid || !authStore.email) return
  try {
    const res = await $fetch('/api/stripe/cancel', {
      method: 'POST',
      body: {uid: authStore.uid, email: authStore.email}
    })
    if (res?.success) {
      authStore.subscriptionCancelled = true
      isCancelModalOpen.value = false
    }
  } catch {
  }
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 1024
}

onMounted(async () => {
  handleResize()
  window.addEventListener('resize', handleResize)
  setTimeout(() => {
    enableTransition.value = true
  }, 50)
  await learningStore.loadFromFirebase()
  await eventStore.loadGlobalWinterSettings()
})
</script>

<style scoped>

.cabinet-wrapper {
  height: 100%;
  font-family: "Nunito", sans-serif;
  padding: 5px 10px 10px 10px;
  overflow: hidden;
}

.layout__cabinet {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  gap: 20px;
}

.layout__cabinet:after {
  content: "";
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 50px;
  z-index: 1;
  background: var(--overlayAfter);
}

.articles {
  width: 30px;
}

.price__avatar-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.sidebar-panel {
  padding: 16px;
  border-radius: 26px;
  border: 2px solid var(--tabBg);
  box-shadow: var(--boxShadowMobile);
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 360px;
  height: 100%;
  overflow: auto;
  flex: 0 0 auto;
}

.tab-icon {
  width: 28px;
}

.user__name {
  color: var(--titleColor);
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 19px;
}

.btn {
  font-size: 18px;
}

.back-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 600;
  font-size: 1.2rem;
  background: #ffd54f;
  border-radius: 16px;
  padding: 12px 14px;
  cursor: pointer;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  transition: .15s;
  z-index: 5;
}

.back__btn-icon {
  width: 40px;
  height: 40px;
}

.sidebar-title {
  font-weight: 900;
  font-size: 1.15rem;
  text-align: center;
  margin-top: 4px;
  color: var(--titleColor);
}

.modal-title {
  margin-bottom: 24px;
  font-weight: 600;
  font-size: 24px;
  color: var(--titleColor);
}

.modal-text {
  font-size: 28px;
  font-weight: 400;
  font-family: 'Lilita One', sans-serif;
  color: var(--titleColor);
}

.nav-container {
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 20px;
  padding: 8px;
}

.sliding-bg {
  position: absolute;
  top: 8px;
  left: 8px;
  height: 48px;
  width: calc(100% - 16px);
  background: var(--tabsSlideBg);
  border-radius: 14px;
  transition: transform 0.4s cubic-bezier(0.34, 1.20, 0.64, 1), opacity 0.3s ease;
  z-index: 1;
  box-shadow: var(--tabSlideBoxShadow);
}

.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  position: relative;
  z-index: 2;
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: none;
  color: #fff;
  transition: color 0.3s;
}

.nav-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-label {
  font-weight: 700;
  font-size: 14px;
  font-family: "Nunito", sans-serif;
  color: var(--titleColor);
  margin-left: 10px;
}

.settings-wrapper,
.tab__component-wrapper {
  flex: 1;
  height: 100%;
  min-height: 0;
}

.content-panel {
  border-radius: 28px;
  border: var(--tabBg);
  box-shadow: var(--boxShadowMobile);
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
}

.content-body {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.header-surface {
  position: relative;
  border-radius: 20px;
  background: transparent;
  padding: 2px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.account-tabs {
  display: flex;
  position: relative;
  background: var(--tabBg);
  border-radius: 40px;
  padding: 6px;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  margin-bottom: 10px;
  max-width: 1024px;
}

.sliding-bg-account {
  position: absolute;
  top: 8px;
  left: 8px;
  height: calc(100% - 16px);
  width: calc((100% - 16px) / 3);
  background: var(--tabsSlideBg);
  border-radius: 40px;
  transition: transform 0.4s cubic-bezier(0.34, 1.20, 0.64, 1), opacity 0.3s ease;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(99, 88, 172, 0.5);
}

.avatar-sliding-bg {
  width: calc((100% - 16px) / 2);
}

.account-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  border: none;
  background: none;
  padding: 9px 4px;
  color: var(--tabTextColor);
  font-weight: 900;
  cursor: pointer;
  font-size: 12px;
  transition: transform 0.2s ease;
  gap: 3px;
}

.account-tab.active {
  background: none;
  border: none;
  box-shadow: none;
  color: var(--tabTextColor);
}

.account-tab-body {
  margin-top: 4px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 3px;
  padding-bottom: 122px;
  position: relative;
  overflow-x: hidden;
}

.account-tab-body::-webkit-scrollbar {
  width: 2px;
  display: none;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .5);
  z-index: 9999;
}

.modal-card {
  background: var(--tabBg);
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 340px;
  text-align: center;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 25px;
}

.btn {
  border: none;
  box-shadow: 0 5px 0 #c0c2c9;
  border-radius: 50px;
  padding: 12px 16px;
  font-weight: 800;
  background: #f3f4f6;
  cursor: pointer;
  width: 100%;
}

.btn-success {
  background: #3b82f6;
  box-shadow: 0 5px 0 #1d4ed8;
  color: white;
}

.btn-danger {
  background: #f44336;
  color: #fff;
}

.avatar-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 9999;
}

.avatar-modal-content {
  background: var(--tabBg);
  padding: 16px 10px;
  padding-bottom: env(safe-area-inset-bottom);
  border-radius: 24px 24px 0 0;
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: hidden;
  animation: slideUp 0.3s ease-out forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.avatar-modal-content h3 {
  text-align: center;
  margin-bottom: 15px;
  color: var(--titleColor);
  font-size: 20px;
}

.avatar-scroll-container {
  height: 340px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-bottom: 20px;
  padding: 5px;
}

.avatar-scroll-container::-webkit-scrollbar {
  width: 6px;
}

.avatar-scroll-container::-webkit-scrollbar-thumb {
  background-color: var(--tabsSlideBorderColor, #ccc);
  border-radius: 10px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.avatar-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-bottom: 5px;
}

.avatar__image-wrapper {
  border: 3px solid transparent;
  border-radius: 24px;
  padding: 1px;
  transition: .15s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar__image-wrapper.selected {
  border-color: #fca13a;
  border-radius: 50%;
}

.avatar-img {
  width: 100%;
  max-width: 70px;
  height: auto;
  display: block;
}

.avatar__image-wrapper.unowned .avatar-img {
  opacity: 0.6;
  border-radius: 50%;
  filter: grayscale(1);
}

.tab__text {
  padding: 5px 0;
}

.avatar-price {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--titleColor);
  border-radius: 10px;
  padding: 2px 8px;
  font-weight: 900;
  font-size: 15px;
}

.price-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 767px) {
  .nav-label {
    display: none;
  }
}

@media (max-width: 1023px) {
  .sidebar-panel {
    position: fixed;
    left: 50%;
    bottom: 27px;
    transform: translateX(-50%);
    width: calc(100% - 20px);
    height: 63px;
    padding: 6px;
    z-index: 1100;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    border-radius: 40px;
    border: 3px solid var(--tabsSlideBorderColor);
    box-shadow: var(--boxShadowMobile);
    background: var(--tabBg);
    overflow: visible;
  }

  .sidebar-title {
    display: none;
  }

  .nav-container {
    flex-direction: row;
    flex: 1;
    background: transparent;
    border: none;
    box-shadow: none;
    padding: 0;
    height: 100%;
  }

  .sliding-bg {
    width: 20%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 30px;
  }

  .nav-item {
    justify-content: center;
  }

  .nav-icon {
    width: 35px;
    height: 35px;
  }

  .content-panel {
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
}

.menu-appear-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease-out;
}

.menu-appear-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.user-block {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  background: var(--tabBg, #1f222b);
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 24px;
  padding: 9px 25px 9px 10px;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.15);
}

.avatar-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6px;
}

.avatar-container {
  width: 96px;
  height: 96px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-current,
.avatar-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.change-avatar-btn {
  position: absolute;
  bottom: -8px;
  right: -6px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  padding: 5px;
  display: grid;
  place-items: center;
  cursor: pointer;
  background: #4ade80;
  transition: transform 0.2s ease;
  border: none;
  z-index: 3;
}

.change-avatar-btn:active {
  transform: scale(1.1);
  transition: transform 0.3s ease;
}

.change-avatar-btn img {
  width: 100%;
  height: 100%;
  filter: brightness(200%);
}

.modal__text--computed {
  font-size: 24px;
  font-weight: 600;
  color: var(--titleColor);
  font-family: Nunito, sans-serif;
}

.user-info-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-left: 20px;
  flex: 1;
}

.no-transition {
  transition: none !important;
}

@media (min-width: 1024px) {
  .user__interface,
  .tab__component-wrapper {
    padding: 16px;
  }
}

.top-panel-layout {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
}

.custom-progress {
  position: relative;
  width: 100%;
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
}

.level-value {
  background: #8868db;
  border: none;
  border-radius: 10px;
  padding: 4px 12px;
  color: white;
  font-size: 20px;
  font-weight: 700;
}

.progress_exp-bar {
  flex: 1;
  height: 25px;
  background: #e8eae5;
  border-radius: 20px;
  overflow: hidden;
}

.progress__bar {
  height: 100%;
  background-color: #10b981;
  border-radius: 8px;
  transition: width 0.4s ease-out;
  position: relative;
}

.glare {
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 4px;
}

.effect-unicorn {
  border-radius: 50%;
  outline: 3px solid #da70d6;
  animation: glow-in-gap-unicorn 1.5s infinite alternate ease-in-out;
}

@keyframes glow-in-gap-unicorn {
  0% {
    box-shadow: 0 0 0 0px transparent;
  }
  100% {
    box-shadow: 0 0 8px 3px rgba(218, 112, 214, 0.9);
  }
}

.effect-dragon {
  border-radius: 50%;
  outline: 3px solid #ff8c00;
  animation: glow-in-gap-dragon 1.5s infinite alternate ease-in-out;
}

@keyframes glow-in-gap-dragon {
  0% {
    box-shadow: 0 0 0 0px transparent;
  }
  100% {
    box-shadow: 0 0 8px 3px rgba(255, 140, 0, 0.9);
  }
}

.effect-griffin {
  border-radius: 50%;
  outline: 3px solid #4169e1;
  animation: glow-in-gap-griffin 1.5s infinite alternate ease-in-out;
}

@keyframes glow-in-gap-griffin {
  0% {
    box-shadow: 0 0 0 0px transparent;
  }
  100% {
    box-shadow: 0 0 8px 3px rgba(65, 105, 225, 0.9);
  }
}
</style>