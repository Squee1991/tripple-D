<template>
  <div class="cabinet-wrapper">
    <div v-if="isCancelModalOpen" class="modal-overlay" @click.self="closeCancelModal">
      <div class="modal-card">
        <div class="modal-title">{{ t('cabinet.cancelPremium') }}</div>
        <p class="modal-text">{{ t('cabinet.cancelPremiumText') }}</p>
        <div class="modal-actions">
          <button class="btn btn-danger" @click="cancelSubscription">{{ t('cabinet.accept') }}</button>
          <button class="btn" @click="closeCancelModal">{{ t('cabinet.reject') }}</button>
        </div>
      </div>
    </div>
    <div class="layout">
      <aside class="sidebar-panel">
        <button class="back-btn" @click="backToMain" aria-label="На главную">
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
          >
            <img class="tab-icon" :src="tabItem.icon" alt=""/>
            <span class="tab-label">{{ tabItem.label }}</span>
          </button>
        </nav>
      </aside>
      <section class="content-panel">
        <div v-if="activeTabKey === 'info'" class="header-surface">
          <div class="user-block">
            <div class="avatar-container">
              <img v-if="authStore.avatarUrl" :src="authStore.avatarUrl" alt="Аватар" class="avatar-current"/>
              <div v-else class="avatar-placeholder"></div>
              <button @click="isAvatarModalOpen = true" class="change-avatar-btn" title="Сменить аватар">
                <img src="../assets/images/add.svg" alt="Сменить"/>
              </button>
            </div>
            <div class="user-info">
              <div class="user-name">{{ authStore.name }}</div>
              <div class="exp-bar">
                <div class="exp-fill" :style="{ width: `${(learningStore.exp / 100) * 100}%` }"></div>
                <span class="exp-text">{{ learningStore.exp }} / 100 XP</span>
              </div>
              <div class="level-info">{{ t('cabinet.level') }} {{ learningStore.isLeveling }}</div>
            </div>
<!--            <button class="add__friend-wrapper" type="button" @click="openFriendSearchModal">-->
<!--              <img class="find__friend" src="../assets/images/magnifying-glass.svg" alt="">-->
<!--              <div class="find__text">Найти друзей</div>-->
<!--            </button>-->
          </div>
          <div class="award-strip">
            <div class="awards__get">
              <div class="awards__title">{{ t('cabinet.awards') }}</div>
              <div class="awards__items">
                <div
                    v-for="awardItem in unlockedAwardList"
                    :key="awardItem.key"
                    class="award-strip-item"
                    :title="t(awardItem.title)"
                >
                  <img class="award-strip-icon" :src="awardItem.icon" :alt="awardItem.title"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="content-body">
          <div v-if="activeTabKey === 'info'" class="tab-content">
            <div
                v-for="acc in ACCORDIONS"
                :key="acc.key"
                class="accordion"
                :class="{ open: activeAccordion === acc.key }"
                @click="onAccordionClick(acc)"
            >
              <div class="accordion__head">
                <div class="accordion__content-left">
                  <img class="accordion__icon" :src="acc.icon" alt="">
                  <div class="accordion__title">{{ acc.title }}</div>
                </div>
                <img
                    v-if="!acc.isLink"
                    class="accordion__arrow"
                    :class="{ rotated: activeAccordion === acc.key }"
                    src="../assets/images/arrowNav.svg"
                    alt=""
                />
              </div>
              <transition name="fade">
                <div
                    v-show="activeAccordion === acc.key && !acc.isLink"
                    class="accordion__body"
                    @click.stop
                >
                  <template v-if="acc.key === 'personal'">
                    <div v-for="infoRow in accountInfoRows" :key="infoRow.label" class="card-row">
                      <span class="card-row__label">{{ infoRow.label }}</span>
                      <span class="card-row__value">{{ infoRow.value }}</span>
                    </div>
                  </template>
                  <template v-else-if="acc.key === 'account'">
                    <div class="subscription-status-row">
                      <div class="subscription-label">{{ t('cabinet.status') }}</div>
                      <div class="subscription-status">
                        <template v-if="authStore.isPremium && !authStore.subscriptionCancelled">
                          <p class="active">✅ {{ t('cabinet.active') }}</p>
                        </template>
                        <template v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
                          <p class="cancelled">⚠️{{ t('cabinet.canceled') }}</p>
                        </template>
                        <template v-else>
                          <p>🔓 {{ t('cabinet.withoutPremium') }}</p>
                          <div class="premium__btn-wrapper">
                            <button @click="routeToPay" class="premium__btn">{{ t('cabinet.buyPremium') }}</button>
                          </div>
                        </template>
                      </div>
                    </div>
                    <template v-if="authStore.isPremium && !authStore.subscriptionCancelled">
                      <div class="premium__status-wrapper">
                        <p>📅 {{ t('cabinet.nextPayment') }} {{ formattedSubscriptionEndDate }}</p>
                        <button class="btn btn-danger" @click.stop="openCancelModal">{{ t('cabinet.cancelBtn') }}</button>
                      </div>
                    </template>
                    <template v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
                      <p class="access__text">📅 {{ t('cabinet.access') }} {{ formattedSubscriptionEndDate }}</p>
                    </template>
                  </template>
                  <template v-else-if="acc.key === 'settings'">
                    <div class="settings__elements">
                      <div
                          v-for="settingsItem in settingsToggleItems"
                          :key="settingsItem.key"
                          class="row__el--wrapper"
                      >
                        <div class="toggle__wrapper">{{ settingsItem.label }}</div>
                        <ClientOnly>
                          <ColorScheme v-if="settingsItem.wrap">
                            <VToggle
                                :model-value="getSettingValue(settingsItem.key)"
                                @change="value => onSettingChange(settingsItem.key, value)"
                            />
                          </ColorScheme>
                          <template v-else>
                            <VToggle
                                :model-value="getSettingValue(settingsItem.key)"
                                @change="value => onSettingChange(settingsItem.key, value)"
                            />
                          </template>
                        </ClientOnly>
                      </div>
                    </div>
                  </template>
                </div>
              </transition>
            </div>
            <div class="footer-actions">
              <button @click="openDeleteModal" class="btn btn-danger">{{ t('cabinet.deleteAcc') }}</button>
            </div>
          </div>
          <div v-else-if="activeTabKey === 'friends'"><VFindFriends/></div>
          <div v-else-if="activeTabKey === 'shop'"><Shop/></div>
          <div v-else-if="activeTabKey === 'award'"><AwardsList :awards="awardList"/></div>
          <div v-else-if="activeTabKey === 'archive'"><VExampResulut/></div>
        </div>
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
          <button @click="isAvatarModalOpen = false" class="btn">{{ t('cabinet.avatarCancel') }}</button>
          <button @click="confirmAvatarChange" :disabled="!selectedAvatarName" class="btn btn-success">
            {{ t('cabinet.avatarSave') }}
          </button>
        </div>
      </div>
    </div>
    <div v-if="isPurchaseModalOpen" class="modal-overlay" @click.self="isPurchaseModalOpen = false">
      <div class="modal-card">
        <template v-if="purchaseState === 'success'">
          <div class="modal-title">{{ t('cabinet.boughtAvatar')}}</div>
          <div class="modal-actions">
            <button class="btn btn-success" @click="closePurchaseOk">{{ t('cabinet.boughtBtn')}}</button>
          </div>
        </template>
        <template v-else-if="purchaseState === 'insufficient'">
          <div class="modal-title">{{ t('cabinet.notEnoughtArticles')}}</div>
          <div class="modal-actions">
            <button class="btn" @click="closePurchaseOk">{{ t('cabinet.boughtBtn')}}</button>
          </div>
        </template>
        <template v-else>
          <div class="modal-title">{{ t('cabinet.buyAvatar') }}</div>
          <p class="modal-text">{{ t('cabinet.costs') }} <b>{{ t('cabinet.price') }}</b></p>
          <div class="modal-actions">
            <button class="btn btn-success" @click="confirmPurchase">{{ t('cabinet.buyAvatarBtn') }}</button>
            <button class="btn" @click="isPurchaseModalOpen = false">{{ t('cabinet.notBuyAvatarBtn') }}</button>
          </div>
        </template>
      </div>
    </div>
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
          <button class="btn btn-danger" @click="confirmDeleteAccount">{{ t('cabinet.deleteAccBtnAccept') }}</button>
          <button class="btn" @click="isDeleteModalOpen = false">{{ t('cabinet.deleteAccBtnReject') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch, watchEffect} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import Progress from '../src/components/progress.vue'
import AwardsList from '../src/components/AwardsList.vue'
import VExampResulut from "../src/components/V-exampResulut.vue";
import VToggle from '../src/components/V-toggle.vue'
import VFindFriends from '../src/components/V-findFriends.vue'
import {userAuthStore} from '../store/authStore.js'
import {userlangStore} from '../store/learningStore.js'
import {useAchievementStore} from '../store/achievementStore.js'
import {useGameStore} from '../store/marafonStore.js'
import {mapErrors} from '../utils/errorsHandler.js'
import {isSoundEnabled, setSoundEnabled, unlockAudioByUserGesture} from '../utils/soundManager.js'
import {useUiSettingsStore} from '../store/uiSettingsStore.js'
import {AWARDS} from '~/utils/awards'

import UserIcon from '../assets/images/hedgehog.svg'
import FriendsIcon from '../assets/images/friend.svg'
import AwardsIcon from '../assets/images/rewards.svg'
import Home from '../assets/images/home.svg'
import Folder from '../assets/images/folder.svg'
import Find from '../assets/images/magnifying-glass.svg'
import EditIcon from '../assets/accountToggleIcons/edit.svg'
import UserAccIcon from '../assets/accountToggleIcons/user.svg'
import SettingsIcon from '../assets/accountToggleIcons/settings.svg'
import FaqIcon from '../assets/accountToggleIcons/faq.svg'
import {useFriendsStore} from '../../store/friendsStore.js'

const {t, locale} = useI18n()
const router = useRouter()
const purchaseState = ref('default')
const authStore = userAuthStore()
const learningStore = userlangStore()
const achievementStore = useAchievementStore()
const gameStore = useGameStore()
const uiSettings = useUiSettingsStore()
const friendsStore = useFriendsStore()

const activeTabKey = ref('info')
const isFriendSearchModalOpen = ref(false)

function openFriendSearchModal() {
  isFriendSearchModalOpen.value = true
}

const TAB_ITEMS = [
  {key: 'info', label: t('cabinetSidebar.valueOne'), icon: UserIcon},
  {key: 'friends', label: t('cabinetSidebar.valueTwo'), icon: FriendsIcon},
  {key: 'award', label: t('cabinetSidebar.valueThree'), icon: AwardsIcon},
  {key: 'archive', label: t('cabinetSidebar.valueFour'), icon: Folder },
]

const ACCORDIONS = ref([
  {key: 'personal', title: t('cabinetAccordion.personalData'), icon: UserAccIcon, isLink: false},
  {key: 'account', title: t('cabinetAccordion.account'), icon: EditIcon, isLink: false},
  {key: 'settings', title: t('cabinetAccordion.settings'), icon: SettingsIcon, isLink: false},
  {key: 'faq', title: t('cabinetAccordion.faq'), icon: FaqIcon, isLink: true},
])

const accountInfoRows = computed(() => [
  {label: t('cabinetInfoRows.name'), value: authStore.name},
  {label: t('cabinetInfoRows.email'), value: authStore.email},
  {label: t('cabinetInfoRows.registerDate'), value: registrationDateText.value || '—'}
])

const settingsToggleItems = [
  {key: 'sound', label: t('cabinetToggle.sound'), wrap: false},
  {key: 'dark', label: t('cabinetToggle.theme'), wrap: true},
  {key: 'ach', label: t('cabinetToggle.ach'), wrap: true},
]

const activeAccordion = ref(null)

function toggleAccordion(key) {
  activeAccordion.value = activeAccordion.value === key ? null : key
}

function onAccordionClick(acc) {
  if (acc.isLink) {
    goToFaq()
    return
  }
  toggleAccordion(acc.key)
}

const isAvatarModalOpen = ref(false)
const selectedAvatarName = ref(null)
const isPurchaseModalOpen = ref(false)
const purchaseAvatarName = ref(null)

const isDeleteModalOpen = ref(false)
const deletePasswordField = ref({value: '', error: ''})

const isCancelModalOpen = ref(false)

const soundEnabled = ref(false)
const colorMode = useColorMode()
const darkMode = ref(colorMode.preference === 'dark')

const registrationDateText = computed(() => {
  const registeredAt = authStore.registeredAt;
  if (!registeredAt) return '—';
  let date;
  if (typeof registeredAt.toDate === 'function') {
    date = registeredAt.toDate();
  } else {
    date = new Date(registeredAt);
  }
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
});

const routeToPay = () => router.push('/pay')

const shownAwardsSet = ref(loadShownAwards())
const awardList = ref(
    AWARDS.map(a => ({ ...a, locked: a.key === 'registerAchievement' ? false : !shownAwardsSet.value.has(a.key)
    }))
)

const unlockedAwardList = computed(() => awardList.value.filter(a => !a.locked))

watch(() => authStore.uid, () => {
  shownAwardsSet.value = loadShownAwards()
  awardList.value = AWARDS.map(a => ({...a, locked: !shownAwardsSet.value.has(a.key)}))
})

const getSettingValue = key => {
  if (key === 'sound') return soundEnabled.value
  if (key === 'dark') return darkMode.value
  if (key === 'ach')  return uiSettings.achievementsNotifyEnabled
}

const onSettingChange = (key, value) => {
  if (key === 'sound') return handleSoundToggle(value)
  if (key === 'dark')  return handleThemeToggle(value)
  if (key === 'ach')   return uiSettings.setAchievementsNotifyEnabled(value)
}

const formattedSubscriptionEndDate = computed(() => {
  if (!authStore.subscriptionEndsAt) return '-'
  const date = new Date(authStore.subscriptionEndsAt)
  return date.toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })
})

const awardsStorageKey = computed(() => `awards_shown_v1_${authStore.uid || 'anon'}`)

function loadShownAwards() {
  try {
    if (typeof window === 'undefined') return new Set()
    const raw = localStorage.getItem(awardsStorageKey.value)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch { return new Set() }
}

function saveShownAwards(set) {
  try {
    if (typeof window === 'undefined') return
    localStorage.setItem(awardsStorageKey.value, JSON.stringify([...set]))
  } catch {}
}

function setActiveTab(key) { activeTabKey.value = key }
function backToMain() { router.push('/') }

function handleSoundToggle(value) {
  setSoundEnabled(value)
  soundEnabled.value = value
  if (value) unlockAudioByUserGesture()
}

function handleThemeToggle(value) {
  colorMode.preference = value ? 'dark' : 'light'
  darkMode.value = value
}

function openCancelModal() { isCancelModalOpen.value = true }
function closeCancelModal() { isCancelModalOpen.value = false }

async function cancelSubscription() {
  if (!authStore.uid) return
  try {
    const res = await $fetch('/api/stripe/cancel', {method: 'POST', body: {uid: authStore.uid}})
    if (!res.success) alert('Ошибка отмены подписки: ' + res.error)
  } catch { alert('Error, try later') }
}

function goToFaq() { router.push('/faq') }

function openPurchaseModal(name) {
  purchaseAvatarName.value = name
  purchaseState.value = 'default'
  isPurchaseModalOpen.value = true
}

function selectAvatar(name) { selectedAvatarName.value = name }

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
  } catch {}
}

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

function closePurchaseOk() {
  isPurchaseModalOpen.value = false
  isAvatarModalOpen.value = false
  purchaseState.value = 'default'
  authStore.clearNotEnoughArticle?.()
}

const isGoogleUser = computed(() => authStore.isGoogleUser)

onMounted(async () => {
  await learningStore.loadFromFirebase()
  soundEnabled.value = isSoundEnabled()
})

onMounted(() => {
  friendsStore.loadFriends()
})

watch(isAvatarModalOpen, opened => {
  if (opened) selectedAvatarName.value = authStore.avatar
})

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
</script>

<style scoped>

.friends{
  color: var(--titleColor);
  font-size: 20px;
  font-weight: 600;

}

.find__friends {
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  font-size: 1rem;
  padding: 5px;
  border: 3px solid black;
  box-shadow: 3px 3px 0 black;
  border-radius: 15px;
}

.find__icon {
  width: 32px;
  margin-right: 10px;
}

.cabinet-wrapper {
  height: 100vh;
  font-family: "Nunito", sans-serif;
  padding: 20px;
  overflow: hidden;
}

.modal-card--friends {
  max-width: 720px;
  width: 95%;
}

.premium__btn {
  padding: 8px 10px;
  border: 2px solid black;
  background: #345fd0;
  width: 100%;
  border-radius: 15px;
  box-shadow: 2px 2px 0 black;
  color: white;
  font-weight: 600;
  font-family: "Nunito", sans-serif;
  cursor: pointer;
}

.back__btn-icon {
  width: 35px;
  height: 35px;
}

.add__friend-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
  background: none;
  padding: 5px 10px;
  border: 3px solid black;
  border-radius: 16px;
  background: white;
  box-shadow: 4px 4px 0 black;
  margin-left: auto;
}

.find__friend {
  width: 40px;
  margin-right: 10px;
}

.find__text {
  color: black;
  font-size: 18px;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
}

.premium__btn-wrapper {
  margin-top: 10px;
}

.premium__status-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}

.layout {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
  gap: 20px;
}

.awards__items {
  display: flex;
}

.accordion__content-left {
  display: flex;
  align-items: center;
}

.awards__title {
  text-align: center;
  width: 100%;
  font-size: 1.3rem;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  padding: 12px 0 ;
  font-weight: 600;
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
  border: 3px solid #000;
  box-shadow: 4px 4px 0 #000;
  transition: .15s;
}

.back-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #000;
}

.back-btn img {
  width: 40px;
  height: 40px;
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

.find__friends {
  margin-bottom: 10px;
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
  border-radius: 16px;
  background: #f3f4f6;
  box-shadow: 2px 2px 0 #000;
  cursor: pointer;
  transition: .15s;
  font-weight: 600;
  font-size: 1.05rem;
  font-family: "Nunito", sans-serif;
}

.tab-vertical:hover {
  transform: translate(1px, 1px);
  box-shadow: 0px 0px 0 #000;
}

.tab-vertical.active {
  background: #9ea9a2;;
}

.tab-icon {
  width: 30px;
}

.content-panel {
  padding: 14px;
  border-radius: 28px;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
}

.header-surface {
  border-radius: 20px;
  padding: 14px 16px;
  gap: 16px;
  background: transparent;
}

.user-block {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 15px;
  border-bottom: 3px solid var(--titleColor);
  border-radius: 15px;
  padding-bottom: 10px;
}

.avatar-container {
  position: relative;
  width: 84px;
}

.avatar-current, .avatar-placeholder {
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
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.user-name {
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--titleColor);
}

.exp-bar {
  width: 200px;
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

.award-strip {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-left: auto;
}

.award-strip-item {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.award-strip-icon {
  width: 100%;
  display: block;
  filter: drop-shadow(4px 4px 0 #000);
}

.content-body {
  flex: 1;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid gray;
  padding: 10px 8px;
  margin-bottom: 10px;
}

.card-row__label {
  font-weight: 900;
}

.label {
  height: 74px;
}

.card-row__value {
  font-weight: 700;
}

.accordion {
  background: #fff7dd;
  border: 3px solid #000;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #000;
  padding: 12px 16px;
  margin-top: 14px;
  cursor: pointer;
  max-height: 60px;
  overflow: hidden;
  transition: max-height .3s ease;
}

.accordion.open {
  max-height: 350px;
}

.accordion__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.accordion__title {
  font-weight: 900;
  font-size: 1.2rem;
}

.accordion__arrow {
  width: 24px;
  transition: transform .25s;
}

.accordion__arrow.rotated {
  transform: rotate(180deg);
}

.accordion__body {
  padding-top: 10px;
  font-weight: 700;
}

.subscription-status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 10px 8px;
}

.subscription-label {
  font-weight: 800;
  color: #6b7280;
}

.subscription-status .active {
  color: #f97316;
  font-weight: 900;
}

.subscription-status .cancelled {
  color: #ff9800;
  font-weight: 900;
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

.footer-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
}

.access__text {
  text-align: end;
  margin-top: 10px;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .25s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.row__el--wrapper {
  display: flex;
  justify-content: space-between;
  padding: 10px 8px;
}

.accordion__icon {
  width: 28px;
  margin-right: 10px;
}

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

  .back-btn img {
    width: 34px;
    height: 34px;
  }

  .accordion {
    box-shadow: 2px 2px 0 black;
  }

  .content-panel {
    padding: 10px 5px 95px 5px;
    border: none;
    box-shadow: none;
    border-radius: 0px;
  }

  .content-body {
    padding: 5px;
  }
}

@media (max-width: 420px) {
  .tab-icon {
    width: 32px;
    height: 32px;
  }
}

@media (min-width: 1024px) {
  .premium__btn:hover {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 #000;
  }
  .add__friend-wrapper:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }
  .find__friends:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #000;
  }
}

@media (max-width: 767px) {
  .premium__status-wrapper {
    flex-direction: column;
    gap: 10px;
  }
}

</style>
