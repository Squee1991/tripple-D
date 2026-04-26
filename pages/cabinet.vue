<template>
  <div class="cabinet-wrapper">
    <div v-if="isCancelModalOpen" class="modal-overlay" @click.self="closeCancelModal">
      <div class="modal-card">
        <div class="modal-title">{{ t('cabinet.cancelPremium') }}</div>
        <p class="modal-text">{{ t('cabinet.cancelPremiumText') }}</p>
        <div class="modal-actions">
          <button class="btn btn-danger" @click="cancelSubscription" type="button">
            {{ t('cabinet.accept') }}
          </button>
          <button class="btn" @click="closeCancelModal" type="button">
            {{ t('cabinet.reject') }}
          </button>
        </div>
      </div>
    </div>
    <div class="layout__cabinet">
      <aside class="sidebar-panel">
        <button class="back-btn" @click="backToMain" aria-label="На главную" type="button">
          <img class="back__btn-icon" :src="Home" alt="Home"/>
          <span class="back-label">{{ t('cabinet.main') }}</span>
        </button>
        <div class="sidebar-title">{{ t('cabinet.category') }}</div>
        <nav class="nav-container">
          <div
              class="sliding-bg"
              :style="{
                transform: isMobile ? `translateX(${activeIndex * 100}%)` : `translateY(${activeIndex * 100}%)`,
                opacity: activeIndex === -1 ? 0 : 1
              }"
          ></div>
          <button
              v-for="tabItem in TAB_ITEMS"
              :key="tabItem.key"
              class="nav-item"
              :class="{ 'is-active': activeTabKey === tabItem.key }"
              @click="setActiveTab(tabItem.key)"
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
            <div v-if="activeTabKey === 'info'" class="header-surface">
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
              <div v-else>
                <div class="user-block">
                  <div class="avatar-container">
                    <img
                        v-if="authStore.avatarUrl"
                        :src="authStore.avatarUrl"
                        alt="Аватар"
                        class="avatar-current"
                    />
                    <div v-else class="avatar-placeholder"></div>
                    <button
                        @click="isAvatarModalOpen = true"
                        class="change-avatar-btn"
                        title="Сменить аватар"
                        type="button"
                    >
                      <img src="../assets/images/add.svg" alt="Сменить"/>
                    </button>
                  </div>
                  <div class="user-info">
<!--                    <div class="user-name">{{ userNameSafe }}</div>-->
                    <div class="level-info">{{ t('cabinet.level') }} {{ learningStore.isLeveling }}</div>
                    <div class="exp-bar">
                      <div class="exp-fill" :style="{ width: `${expFillWidth}%` }">
                        <div class="glare"></div>
                      </div>
                      <span class="exp-text">{{ learningStore.exp }}%</span>
                    </div>

                  </div>
                </div>
                <div class="account-tabs">
                  <div
                      class="sliding-bg-account"
                      :style="{ transform: `translateX(${activeAccountIndex * 100}%)`,  opacity: activeAccountIndex === -1 ? 0 : 1  }"></div>
                  <button
                      v-for="tab in ACCOUNT_TABS"
                      :key="tab.key"
                      class="account-tab"
                      :class="{ active: accountTab === tab.key }"
                      @click="accountTab = tab.key"
                      type="button"
                  >
                    <img :class="iconDisplayComputed" class="tab-icon --horizontal" :src="tab.icon" :alt="tab.alt">
                    <span class="tab__text">{{ tab.label }}</span>
                  </button>
                </div>
                <div class="account-tab-body">
                  <div v-if="accountTab === 'common'" class="tab-surface">
                    <PersonalInfoRows/>
                    <AccountManagement @open="handleSettingsAction"/>
                  </div>
<!--                  <div v-if="accountTab === 'friends'" class="tab-surface">-->
<!--                    <VFindFriends/>-->
<!--                  </div>-->
                  <div v-else-if="accountTab === 'awards'" class="tab-surface">
                    <AwardsList :awards="awardList"/>
                  </div>
                  <div v-else-if="accountTab === 'rank'" class="rank-placeholder">
                    <VRank/>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab__component-wrapper" v-else>
              <component :is="components" @open="handleSettingsAction"/>
            </div>
          </div>
        </ClientOnly>
      </section>
    </div>

    <div v-if="isAvatarModalOpen" class="avatar-modal-overlay" @click.self="isAvatarModalOpen = false">
      <div class="avatar-modal-content">
        <h3>{{ t('cabinet.newAvatarTitle') }}</h3>
        <div class="avatar-grid">
          <div
              v-for="avatarName in authStore.availableAvatars"
              :key="avatarName"
              class="avatar-option"
              :class="{ selected: selectedAvatarName === avatarName }"
              @click="authStore.ownedAvatars.includes(avatarName) ? selectAvatar(avatarName) : openPurchaseModal(avatarName)"
          >
            <img :src="authStore.getAvatarUrl(avatarName)" :alt="avatarName"/>
            <div v-if="!authStore.ownedAvatars.includes(avatarName)" class="avatar-price">50 🪙</div>
          </div>
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
        <template v-else>
          <div class="modal-title">{{ t('cabinet.buyAvatar') }}</div>
          <p class="modal-text">
            {{ t('cabinet.costs') }} <b>{{ t('cabinet.price') }}</b>
          </p>
          <div class="modal-actions">
            <button class="btn btn-success" @click="confirmPurchase" type="button">
              {{ t('cabinet.buyAvatarBtn') }}
            </button>
            <button class="btn" @click="isPurchaseModalOpen = false" type="button">
              {{ t('cabinet.notBuyAvatarBtn') }}
            </button>
          </div>
        </template>
      </div>
    </div>
    <div v-if="isSnowWarningModalOpen" class="modal-overlay" @click.self="isSnowWarningModalOpen = false">
      <div class="modal-card">
        <div class="modal-title">❄️ {{ t('cabinet.notAllow') }}</div>
        <p class="modal-text">
          {{ t('cabinet.modalNotAllowEffectFirst') }} <b>{{ t('cabinet.modalNotAllowEffectSecond') }}</b>.
          <br/>
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
import {useI18n} from 'vue-i18n'

import AwardsList from '../src/components/AwardsList.vue'
import VExampResulut from '../src/components/V-exampResulut.vue'
import VFindFriends from '../src/components/V-findFriends.vue'
import VRank from '../src/components/V-rank.vue'
import PersonalInfoRows from '../src/components/PersonalInfoRows.vue'
import AccountManagement from "../src/components/AccountManagement.vue";
import Shop from '../src/components/V-shop.vue'

import {userAuthStore} from '../store/authStore.js'
import {userlangStore} from '../store/learningStore.js'
import {useAchievementStore} from '../store/achievementStore.js'
import {AWARDS} from '~/utils/awards'
import {useFriendsStore} from '../../store/friendsStore.js'
import {useEventSessionStore} from '../../store/eventsStore.js'

import Home from '../assets/images/home.svg'
import Folder from '../assets/images/folder.svg'
import UserAccIcon from '../assets/accountToggleIcons/user.svg'
import SettingsIcon from '../assets/images/settings.svg'
import FaqIcon from '../assets/accountToggleIcons/faq.svg'
import OptionIcon from '../assets/accountToggleIcons/option.svg'
import Friends from '../assets/images/friend.svg'
import Rewards from '../assets/images/rewards.svg'
import IdCard from '../assets/images/monitor.svg'
import ShoppingCart from '../assets/images/shopping-cart.svg'
import VSettings from '../src/components/V-settings.vue'
import RankAward from '../assets/images/rankaward.svg'
import AccountIcon from '../assets/images/account.png'

definePageMeta({
  robots: {index: false, follow: false}
})

const {t} = useI18n()
const router = useRouter()
const authStore = userAuthStore()
const learningStore = userlangStore()
const achievementStore = useAchievementStore()
const friendsStore = useFriendsStore()
const eventStore = useEventSessionStore()

const activeTabKey = ref('info')
const isSettingsOpen = ref(false)
const accountTab = ref('common')
const isMobile = ref(false)

const TAB_ITEMS = [
  {key: 'info', label: t('cabinetSidebar.valueOne'), alt: 'infoIcon', icon: AccountIcon},
  {key: 'archive', label: t('cabinetSidebar.valueTwo'), alt: 'archiveIcon', icon: Folder},
  {key: 'shop', label: t('cabinetSidebar.valueThree'), alt: 'shopIcon', icon: ShoppingCart},
  {key: 'settings', label: t('cabinetSidebar.valueFour'), alt: 'settingsIcon', icon: SettingsIcon}
]

const activeIndex = computed(() => {
  return TAB_ITEMS.findIndex(item => item.key === activeTabKey.value)
})

const activeAccountIndex = computed(() => {
  return ACCOUNT_TABS.value.findIndex(tab => tab.key === accountTab.value)
})

const ACCOUNT_TABS = computed(() => [
  {key: 'common', label: t('cabinetNav.common'), icon: IdCard, alt: 'IdCard'},
  {key: 'awards', label: t('cabinetNav.awards'), icon: Rewards, alt: 'award'},
  {key: 'rank', label: t('cabinetNav.rank'), icon: RankAward, alt: 'rank'},
  // {key: 'friends', label: t('cabinetNav.exam'), icon: Friends, alt: 'friends'}
])

const isSnowWarningModalOpen = ref(false)
const isCancelModalOpen = ref(false)
const purchaseState = ref('default')
const isAvatarModalOpen = ref(false)
const selectedAvatarName = ref(null)
const isPurchaseModalOpen = ref(false)
const purchaseAvatarName = ref(null)
const iconDisplay = ref(true)

const userNameSafe = computed(() => authStore.initialized && authStore.name ? authStore.name : '—')
const expFillWidth = computed(() => {
  const value = Number(learningStore.exp || 0)
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(100, value))
})

const iconDisplayComputed = computed(() => ({"iconHide": iconDisplay.value}))

const tabs = {
  archive: VExampResulut,
  settings: VSettings,
  shop: Shop,
}

const components = computed(() => tabs[activeTabKey.value] || null)

function setActiveTab(key) {
  const selectedTab = TAB_ITEMS.find(tab => tab.key === key)
  if (selectedTab && selectedTab.url) {
    router.push(selectedTab.url)
  }
  else {
    activeTabKey.value = key
  }
}

watch(activeTabKey, () => {
  isSettingsOpen.value = false
})

function handleSettingsAction(action) {
  if (action === 'cancelPremium') {
    openCancelModal();
    return;
  }
  if (action === 'deleteAccount') {
    router.push('/delete');
    return;
  }
  if (action === 'snowWarning') {
    isSnowWarningModalOpen.value = true;
    return;
  }
  if (action === 'faq') {
    goToFaq();
    return;
  }
}

function backToMain() {
  router.push('/')
}

const shownAwardsSet = ref(loadShownAwards())
const awardsStorageKey = computed(() => `awards_shown_v1_${authStore.uid || 'anon'}`)
const awardList = ref(AWARDS.map(a => ({
  ...a,
  locked: a.key === 'registerAchievement' ? false : !shownAwardsSet.value.has(a.key)
})))

watch(() => authStore.uid, () => {
  shownAwardsSet.value = loadShownAwards()
  awardList.value = AWARDS.map(a => ({...a, locked: !shownAwardsSet.value.has(a.key)}))
})

function loadShownAwards() {
  try {
    if (typeof window === 'undefined') return new Set()
    const raw = localStorage.getItem(awardsStorageKey.value)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveShownAwards(set) {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(awardsStorageKey.value, JSON.stringify([...set]))
  } catch {
  }
}

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

function openCancelModal() {
  isCancelModalOpen.value = true
}

function closeCancelModal() {
  isCancelModalOpen.value = false
}

async function cancelSubscription() {
  if (!authStore.uid || !authStore.email) {
    return
  }
  try {
    const res = await $fetch('/api/stripe/cancel', {
      method: 'POST',
      body: {uid: authStore.uid, email: authStore.email}
    })
    if (res.success) {
      authStore.subscriptionCancelled = true
      isCancelModalOpen.value = false

    }
  } catch (e) {
    console.error(e)
  }
}

function goToFaq() {
  router.push('/faq')
}

function openPurchaseModal(name) {
  purchaseAvatarName.value = name
  purchaseState.value = 'default'
  isPurchaseModalOpen.value = true
}

function selectAvatar(name) {
  selectedAvatarName.value = name
}

async function confirmPurchase() {
  const status = await authStore.purchaseAvatar(purchaseAvatarName.value)
  if (status === 'success' || status === 'owned') {
    selectedAvatarName.value = purchaseAvatarName.value
    purchaseState.value = 'success'
  } else if (status === 'insufficient') {
    purchaseState.value = 'insufficient'
    isPurchaseModalOpen.value = true
  }
}

async function confirmAvatarChange() {
  if (!selectedAvatarName.value) return
  try {
    await authStore.updateUserAvatar(selectedAvatarName.value)
    isAvatarModalOpen.value = false
  } catch {
  }
}

function closePurchaseOk() {
  isPurchaseModalOpen.value = false
  isAvatarModalOpen.value = false
  purchaseState.value = 'default'
  authStore.clearNotEnoughArticle?.()
}

watch(isAvatarModalOpen, opened => {
  if (opened) selectedAvatarName.value = authStore.avatar
})

const handleResize = () => {
  isMobile.value = window.innerWidth < 1024
}

onMounted(async () => {
  handleResize()
  window.addEventListener('resize', handleResize)
  await learningStore.loadFromFirebase()
  await eventStore.loadGlobalWinterSettings()
  friendsStore.loadFriends()
})
</script>

<style scoped>
.cabinet-wrapper {
  height: 100%;
  font-family: "Nunito", sans-serif;
  padding: 10px;
  overflow: hidden;
}

.layout__cabinet {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  gap: 20px;
}

.tab__component-wrapper {
  height: 100%;
}

.sidebar-panel {
  padding: 16px;
  border-radius: 26px;
  border: 3px solid #000;
  box-shadow: 6px 6px 0 #000;
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
  width: 38px;
  height: 38px;
}

.sidebar-title {
  font-weight: 900;
  font-size: 1.15rem;
  text-align: center;
  margin-top: 4px;
  color: var(--titleColor);
}

.nav-container {
  display: flex;
  flex-direction: column;
  position: relative;
  background: #1e1e1e;
  border-radius: 20px;
  padding: 8px;
  border: 3px solid #2a2a2a;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.1);
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
  box-shadow: 0 4px 12px rgba(99, 88, 172, 0.5);
}

.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
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
  font-size: 1.05rem;
  font-family: "Nunito", sans-serif;
}

.nav-item.is-active .nav-icon {
  transform: scale(1.05);
}

.nav-item:active .nav-icon {
  transform: scale(0.9);
}

.settings-wrapper {
  height: 100%;
}

.content-panel {
  border-radius: 28px;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow: hidden;
}

.content-body {
  flex: 1;
  height: 100%;
}

.header-surface {
  position: relative;
  border-radius: 20px;
  background: transparent;
  padding: 2px;
}

.user-block {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  border-bottom: 4px solid var(--borderMobile);
  border-radius: 15px;
  padding-bottom: 12px;
}

.avatar-container {
  position: relative;
  width: 84px;
}

.avatar-current,
.avatar-placeholder {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  border: 4px solid #000;
  object-fit: cover;
  background: #f3f4f6;
}

.change-avatar-btn {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 34px;
  height: 34px;
  border: 2px solid #000;
  border-radius: 50%;
  padding: 5px;
  display: grid;
  place-items: center;
  cursor: pointer;
  background: #fff;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-name {
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--titleColor);
}

.exp-bar {
  width: 220px;
  height: 26px;
  background: #e5e7eb;
  border-radius: 14px;
  border: 2px solid var(--tabsSlideBorderColor);
  position: relative;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: #4ade80;
  transition: width .4s;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
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

.exp-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #2c2b2b;
  font-size: 13px;
}

.level-info {
  font-weight: 700;
  color: var(--titleColor);
}

.account-tabs {
  display: flex;
  position: relative;
  background: var(--tabBg);
  border-radius: 40px;
  padding: 6px;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  margin-bottom: 5px;
  max-width: 768px;
}

.sliding-bg-account {
  position: absolute;
  top: 8px;
  left: 8px;
  height: calc(100% - 14px);
  width: calc((100% - 16px) / 3);
  background: var(--tabsSlideBg);
  border-radius: 40px;
  transition: transform 0.4s cubic-bezier(0.34, 1.20, 0.64, 1), opacity 0.3s ease;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(99, 88, 172, 0.5);
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
  padding: 12px 4px;
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
  padding-bottom: 100px;
}

.account-tab-body::-webkit-scrollbar {
  width: 2px;
  display: none;
}

.account-tab-body::-webkit-scrollbar-thumb {
  border-radius: 15px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .5);
  z-index: 1000;
}

.modal-card {
  background: #fef8e4;
  border: 2px solid #000;
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 440px;
  box-shadow: 3px 3px 0 #000;
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  border: 3px solid #000;
  border-radius: 16px;
  padding: 10px 16px;
  font-weight: 800;
  background: #f3f4f6;
  box-shadow: 2px 2px 0 #000;
  cursor: pointer;
}

.btn-success {
  background: #4ade80;
}

.btn-danger {
  background: #f44336;
  color: #fff;
}

.avatar-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.avatar-modal-content {
  max-height: 90vh;
  overflow: auto;
  background: #fff;
  padding: 2rem;
  border-radius: 24px;
  border: 4px solid #000;
  box-shadow: 6px 6px 0 #000;
  width: 90%;
  max-width: 600px;
}

.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  padding: 10px;
}

.avatar-option {
  border: 4px solid transparent;
  border-radius: 24px;
  overflow: hidden;
  transition: .15s;
  cursor: pointer;
  position: relative;
}

.avatar-option.selected {
  border-color: #fca13a;
  transform: scale(1.03);
}

.avatar-option img {
  width: 70px;
  display: block;
}

.avatar-price {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: #fca13a;
  color: #fff;
  border: 2px solid #000;
  border-radius: 10px;
  padding: 4px 8px;
  font-weight: 900;
}


@media (max-width: 1023px) {
  .cabinet-wrapper {
    overflow: hidden;
  }

  .sidebar-panel {
    position: fixed;
    left: 50%;
    bottom: 22px;
    transform: translateX(-50%);
    width: calc(100% - 20px);
    height: 71px;
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
    width: 25%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 30px;
  }

  .nav-item {
    justify-content: center;
    padding: 0;
    gap: 0;
  }

  .nav-label {
    display: none;
  }

  .nav-icon {
    width: 32px;
    height: 32px;
  }

  .back-btn {
    width: 52px;
    height: 52px;
    padding: 0;
    display: grid;
    place-items: center;
    border-radius: 50%;
    flex: 0 0 auto;
    background: var(--homeBg);
  }

  .back-label {
    display: none;
  }

  .content-panel {
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
}

@media (max-width: 420px) {
  .exp-bar {
    width: 170px;
  }
}
</style>