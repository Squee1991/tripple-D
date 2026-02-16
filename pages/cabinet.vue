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
    <div class="layout">
      <aside class="sidebar-panel">
        <button class="back-btn" @click="backToMain" aria-label="На главную" type="button">
          <img class="back__btn-icon" :src="Home" alt=""/>
          <span class="back-label">{{ t('cabinet.main') }}</span>
        </button>
        <div class="sidebar-title">{{ t('cabinet.category') }}</div>
        <nav class="tabs-vertical">
          <button
              v-for="tabItem in TAB_ITEMS"
              :key="tabItem.key"
              class="tab-vertical"
              :class="{ active: activeTabKey === tabItem.key }"
              @click="setActiveTab(tabItem.key)"
              type="button"
          >
            <img class="tab-icon" :src="tabItem.icon" :alt="tabItem.alt"/>
            <span class="tab-label">{{ tabItem.label }}</span>
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
                    <div class="user-name">{{ userNameSafe }}</div>
                    <div class="exp-bar">
                      <div class="exp-fill" :style="{ width: `${expFillWidth}%` }"></div>
                      <span class="exp-text">{{ learningStore.exp }} / 100 XP</span>
                    </div>
                    <div class="level-info">{{ t('cabinet.level') }} {{ learningStore.isLeveling }}</div>
                  </div>
                </div>
                <div class="account-tabs">
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
                  <div v-if="accountTab === 'friends'" class="tab-surface">
                    <VFindFriends/>
                  </div>
                  <div v-else-if="accountTab === 'awards'" class="tab-surface">
                    <AwardsList :awards="awardList"/>
                  </div>
                  <div v-else-if="accountTab === 'rank'" class="rank-placeholder">
                    <VRank/>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <component :is="components"/>
            </div>
          </div>
        </ClientOnly>
      </section>
    </div>
    <!-- Avatar modal -->
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
    <!-- Delete modal -->
    <div v-if="isDeleteModalOpen" class="modal-overlay" @click.self="isDeleteModalOpen = false">
      <div class="modal-card">
        <div class="modal-title">{{ t('cabinet.deleteAccTitle') }}</div>
        <p v-if="authStore.isPremium" class="modal-text">
          <span class="warn">{{ t('cabinet.important') }}</span>
          <span> {{ t('cabinet.importantText') }}</span>
        </p>
        <p v-if="!isGoogleUser" class="modal-text">{{ t('cabinet.checkPassword') }}</p>
        <div v-if="!isGoogleUser" class="label">
          <input class="input" v-model="deletePasswordField.value" type="password"/>
          <p v-if="deletePasswordField.error" class="delete-error">{{ t(deletePasswordField.error) }}</p>
        </div>
        <p v-else class="modal-text">{{ t('cabinet.checkGoogle') }}</p>
        <div class="modal-actions">
          <button class="btn btn-danger" @click="confirmDeleteAccount" type="button">
            {{ t('cabinet.deleteAccBtnAccept') }}
          </button>
          <button class="btn" @click="isDeleteModalOpen = false" type="button">
            {{ t('cabinet.deleteAccBtnReject') }}
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
import {useGameStore} from '../store/marafonStore.js'
import {mapErrors} from '../utils/errorsHandler.js'
import {AWARDS} from '~/utils/awards'
import {useFriendsStore} from '../../store/friendsStore.js'
import {useEventSessionStore} from '../../store/eventsStore.js'

import UserIcon from '../assets/images/hedgehog.svg'
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
import ArrowBackIcon from '../assets/images/arrow.svg'
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
const gameStore = useGameStore()
const friendsStore = useFriendsStore()
const eventStore = useEventSessionStore()
const unlockedAwardList = computed(() => awardList.value.filter(a => !a.locked))

const activeTabKey = ref('info')
const isSettingsOpen = ref(false)

const accountTab = ref('common')
const ACCOUNT_TABS = computed(() => [
  {key: 'common', label: t('cabinetNav.common'), icon: IdCard, alt: 'IdCard'},
  {key: 'awards', label: t('cabinetNav.awards'), icon: Rewards, alt: 'award'},
  {key: 'rank', label: t('cabinetNav.rank'), icon: RankAward, alt: 'rank'},
  {key: 'friends', label: t('cabinetNav.exam'), icon: Friends, alt: 'friends'}
])

const isSnowWarningModalOpen = ref(false)
const isCancelModalOpen = ref(false)

const purchaseState = ref('default')
const isAvatarModalOpen = ref(false)
const selectedAvatarName = ref(null)
const isPurchaseModalOpen = ref(false)
const purchaseAvatarName = ref(null)
const iconDisplay = ref(true)

const isDeleteModalOpen = ref(false)
const deletePasswordField = ref({value: '', error: ''})

const userNameSafe = computed(() =>
    authStore.initialized && authStore.name ? authStore.name : '—'
)

const expFillWidth = computed(() => {
  const v = Number(learningStore.exp || 0)
  if (!Number.isFinite(v)) return 0
  return Math.max(0, Math.min(100, v))
})

const iconDisplayComputed = computed(() => {
  return {
    "iconHide": iconDisplay.value
  }
})

const TAB_ITEMS = [
  {key: 'info', label: t('cabinetSidebar.valueOne'), alt: 'infoIcon', icon: AccountIcon},
  {key: 'archive', label: t('cabinetSidebar.valueTwo'), alt: 'archiveIcon', icon: Folder},
  {key: 'shop', label: t('cabinetSidebar.valueThree'), alt: 'shopIcon', icon: ShoppingCart},
  {key: 'settings', label: t('cabinetSidebar.valueFour'), alt: 'settingsIcon', icon: SettingsIcon}
]
const tabs = {
  archive: VExampResulut,
  settings: VSettings,
  shop: Shop,
}

const components = computed(() => {
  return tabs[activeTabKey.value] || null
})

function toggleSettings() {
  isSettingsOpen.value = !isSettingsOpen.value
}

function setActiveTab(key) {
  activeTabKey.value = key
}

watch(activeTabKey, () => {
  isSettingsOpen.value = false
})

function handleSettingsAction(action) {
  if (action === 'cancelPremium') {
    openCancelModal()
    return
  }
  if (action === 'deleteAccount') {
    openDeleteModal()
    return
  }
  if (action === 'snowWarning') {
    isSnowWarningModalOpen.value = true
    return
  }
  if (action === 'faq') {
    goToFaq()
    return
  }
}

function backToMain() {
  router.push('/')
}

const shownAwardsSet = ref(loadShownAwards())
const awardsStorageKey = computed(() => `awards_shown_v1_${authStore.uid || 'anon'}`)

const awardList = ref(
    AWARDS.map(a => ({
      ...a,
      locked: a.key === 'registerAchievement' ? false : !shownAwardsSet.value.has(a.key)
    }))
)

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
    alert('Ошибка: Нет email или uid')
    return
  }
  try {
    const res = await $fetch('/api/stripe/cancel', {
      method: 'POST',
      body: {
        uid: authStore.uid,
        email: authStore.email
      }
    })
    if (res.success) {
      authStore.subscriptionCancelled = true
      isCancelModalOpen.value = false
      alert('Успешно! Автопродление отключено.')
    } else {
    }
  } catch (e) {
    console.error(e)
    alert('Ошибка сети')
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

const isGoogleUser = computed(() => authStore.isGoogleUser)

function openDeleteModal() {
  isDeleteModalOpen.value = true
  deletePasswordField.value = {name: 'deletePassword', value: '', error: ''}
}

async function confirmDeleteAccount() {
  deletePasswordField.value.error = ''
  try {
    await authStore.deleteAccount(deletePasswordField.value.value)
    router.push('/')
  } catch (err) {
    if (!deletePasswordField.value.name) deletePasswordField.value.name = 'deletePassword'
    mapErrors([deletePasswordField.value], err?.code || 'auth/unknown')
  }
}

onMounted(async () => {
  await authStore.markCancelledInDb()
  await learningStore.loadFromFirebase()
  await eventStore.loadGlobalWinterSettings()
  friendsStore.loadFriends()
})
</script>

<style scoped>
.cabinet-wrapper {
  height: 100vh;
  font-family: "Nunito", sans-serif;
  padding: 20px;
  overflow: hidden;
}

.layout {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  gap: 20px;
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
  border: 2px solid #000;
  box-shadow: 2px 2px 0 #000;
  transition: .15s;
}

.back__btn-icon {
  width: 35px;
  height: 35px;
}

.back-label {
  display: inline;
}

.sidebar-title {
  font-weight: 900;
  font-size: 1.15rem;
  text-align: center;
  margin-top: 4px;
  color: var(--titleColor);
}

.tabs-vertical {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tab-vertical {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #000;
  border-radius: 12px;
  background: #f3f4f6;
  box-shadow: 2px 2px 0 #000;
  cursor: pointer;
  transition: .15s;
  font-weight: 600;
  font-size: 1.05rem;
  font-family: "Nunito", sans-serif;
}

.tab-vertical.active {
  background: #447ec1;
  color: white;
}

.tab-icon {
  width: 30px;
}

.tab-icon.--horizontal {
  width: 35px;
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
}

.header-surface {
  position: relative;
  border-radius: 20px;
  padding: 14px 16px;
  background: transparent;
}

.setting-arrow-title {
  display: flex;
  align-items: center;
  position: absolute;
  top: 25px;
  right: 12px;
  gap: 12px;
  z-index: 10;
}

.setting-arrow-title.open {
  left: 12px;
  right: auto;
}

.gear-btn {
  width: 44px;
  height: 44px;
  border: 2px solid #000;
  border-radius: 14px;
  background: #f3f4f6;
  box-shadow: 2px 2px 0 #000;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: .15s;
  flex: 0 0 auto;
}


.rank-placeholder {
  overflow-y: auto;
  max-height: calc(100vh - 230px);
}

.rank-placeholder::-webkit-scrollbar {
  width: 10px;
}

.rank-placeholder::-webkit-scrollbar-thumb {
  background: #1e1e1e;
  border-radius: 10px;
  border: 2px solid #fff;
}

.rank-placeholder::-webkit-scrollbar-track {
  background: transparent;
}

.gear-btn img {
  width: 26px;
  height: 26px;
}

.setting-title {
  font-weight: 600;
  font-size: 30px;
  color: var(--titleColor);
}

.settings-wrapper {
  margin-top: 6px;
}

.user-block {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  border-bottom: 3px solid var(--titleColor);
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
  box-shadow: 2px 2px 0 #000;
  transition: .12s;
}

.change-avatar-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 0 0 0 #000;
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
  border: 3px solid #000;
  position: relative;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: #4ade80;
  transition: width .4s;
}

.exp-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #000;
}

.level-info {
  font-weight: 700;
  color: var(--titleColor);
}

.account-tabs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.account-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  padding: 5px 14px;
  border: none;
  border-radius: 14px;
  color: var(--titleColor);
  font-weight: 900;
  cursor: pointer;
  width: 24%;
  background: none;
  font-size: 1.1rem;
}

.account-tab.active {
  background: #eeeaea;
  border: 2px solid black;
  box-shadow: 2px 2px 0 black;
  border-radius: 10px;
  color: black;
}

.account-tab:active {
  transform: translate(1px, 1px);
  box-shadow: 0 0 0 #000;
}

.rank-title {
  font-weight: 900;
  font-size: 1.2rem;
  margin-bottom: 6px;
}

.rank-text {
  font-weight: 700;
  opacity: .85;
}

/* Modals */
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
  border: 3px solid #000;
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 440px;
  box-shadow: 6px 6px 0 #000;
  text-align: center;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 900;
  font-style: italic;
  margin-bottom: 1rem;
}

.modal-text {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.warn {
  color: red;
  font-weight: bold;
  display: block;
}

.input {
  width: 100%;
  padding: 10px;
  border-radius: 15px;
}

.delete-error {
  color: #dc4545;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
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
/* Avatar modal */
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
  text-align: center;
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

.avatar-option:hover {
  border-color: #60a5fa;
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

.award-strip-icon {
  width: 100%;
  display: block;
  filter: drop-shadow(4px 4px 0 #000);
}

.award-strip-item {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab__text {
  margin-left: 8px;
  font-size: .9rem;
}
/* Hover effects desktop */
@media (min-width: 1024px) {
  .back-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 #000;
  }
  .tab-vertical:hover {
    transform: translate(1px, 1px);
    box-shadow: 0 0 0 #000;
  }
  .gear-btn:hover {
    transform: translate(1px, 1px);
    box-shadow: 0 0 0 #000;
  }
}
/* Mobile layout */
@media (max-width: 1023px) {
  .cabinet-wrapper {
    height: 100vh;
    overflow: hidden;
    padding: 0;
  }
  .sidebar-panel {
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 96%;
    height: 67px;
    padding: 8px 8px;
    z-index: 1100;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    border-radius: 18px;
    border-top: 3px solid var(--titleColor);
    border-left: none;
    border-right: none;
    border-bottom: none;
    box-shadow: none;
    background: var(--bg);
  }

  .sidebar-title {
    display: none;
  }

  .tabs-vertical {
    flex-direction: row;
    gap: 8px;
    flex: 1;
    justify-content: space-around;
  }

  .tab-vertical {
    flex: 1;
    min-width: 0;
    justify-content: center;
    padding: 6px;
  }

  .tab-label {
    display: none;
  }

  .tab-icon {
    width: 28px;
    height: 28px;
  }

  .back-btn {
    width: 48px;
    height: 48px;
    padding: 0;
    display: grid;
    place-items: center;
    border-radius: 50%;
    flex: 0 0 auto;
    background: #ffd54f;
  }

  .back-label {
    display: none;
  }

  .content-panel {
    padding: 10px 5px 95px 5px;
    border: none;
    box-shadow: none;
    border-radius: 0;
  }
  .exp-bar {
    width: 190px;
  }
}

@media ( max-width: 767px) {
  .tab-icon.iconHide {
    display: none;
  }
}

@media (max-width: 420px) {
  .tab-icon {
    width: 32px;
    height: 32px;
  }
  .setting-title {
    font-size: 24px;
  }
  .exp-bar {
    width: 170px;
  }
}
</style>
