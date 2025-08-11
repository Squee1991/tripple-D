<template>
  <div class="cabinet-wrapper">
    <div v-if="isCancelModalOpen" class="modal-overlay" @click.self="closeCancelModal">
      <div class="modal-card">
        <div class="modal-title">Отменить подписку?</div>
        <p class="modal-text">Если вы отмените подписку, премиум-доступ останется до конца оплаченного периода.</p>
        <div class="modal-actions">
          <button class="btn btn-danger" @click="cancelSubscription">Да, отменить</button>
          <button class="btn" @click="closeCancelModal">Нет</button>
        </div>
      </div>
    </div>
    <!--    <Modal-->
    <!--        :visible="isGenericModalOpen"-->
    <!--        :title="genericModalData.title"-->
    <!--        :text="genericModalData.text"-->
    <!--        :img="genericModalData.img"-->
    <!--        @close="isGenericModalOpen = false"-->
    <!--    />-->
    <div class="layout">
      <aside class="sidebar-panel">
        <button class="back-btn" @click="backToMain" aria-label="На главную">
          <img :src="Home" alt=""/>
          <span class="back-label">На главную</span>
        </button>
        <div class="sidebar-title">Категории</div>
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
              <div class="level-info">Уровень: {{ learningStore.isLeveling }}</div>
            </div>
          </div>
          <div class="award-strip">
            <div
                v-for="awardItem in unlockedAwardList"
                :key="awardItem.id"
                class="award-strip-item"
                :title="awardItem.title"
            >
              <img class="award-strip-icon" :src="awardItem.icon" :alt="awardItem.title"/>
            </div>
          </div>
        </div>
        <div class="content-body">
          <div v-if="activeTabKey === 'info'" class="tab-content">
            <div v-for="infoRow in accountInfoRows" :key="infoRow.label" class="card-row">
              <span class="card-row__label">{{ infoRow.label }}</span>
              <span class="card-row__value">{{ infoRow.value }}</span>
            </div>
            <div class="accordion" :class="{ open: isAccountAccordionOpen }" @click="toggleAccountAccordion">
              <div class="accordion__head">
                <div class="accordion__title">Управление аккаунтом</div>
                <img class="accordion__arrow" :class="{ rotated: isAccountAccordionOpen }"
                     src="../assets/images/arrowNav.svg" alt=""/>
              </div>
              <div class="subscription-status-row">
                <div class="subscription-label">Статус подписки</div>
                <div class="subscription-status">
                  <template v-if="authStore.isPremium && !authStore.subscriptionCancelled">
                    <p class="active">✅ Подписка активна</p>
                  </template>
                  <template v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
                    <p class="cancelled">⚠️ Подписка отменена</p>
                  </template>
                  <template v-else>
                    <p>🔓 Без подписки</p>
                  </template>
                </div>
              </div>
              <transition name="fade">
                <div v-show="isAccountAccordionOpen" class="accordion__body" @click.stop>
                  <template v-if="authStore.isPremium && !authStore.subscriptionCancelled">
                    <p>📅 Следующее списание: {{ formattedSubscriptionEndDate }}</p>
                    <button class="btn btn-danger" @click.stop="openCancelModal">Отменить подписку</button>
                  </template>
                  <template v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
                    <p>📅 Доступ до: {{ formattedSubscriptionEndDate }}</p>
                  </template>
                </div>
              </transition>
            </div>
            <div class="accordion" :class="{ open: isSettingsAccordionOpen }" @click="toggleSettingsAccordion">
              <div class="accordion__head">
                <div class="accordion__title">Настройки</div>
                <img class="accordion__arrow"
                     :class="{ rotated: isSettingsAccordionOpen }"
                     src="../assets/images/arrowNav.svg" alt=""/>
              </div>
              <transition name="fade">
                <div v-show="isSettingsAccordionOpen" class="accordion__body settings__elements" @click.stop>
                  <div v-for="settingsItem in settingsToggleItems" :key="settingsItem.key" class="row__el--wrapper">
                    <div class="toggle__wrapper">{{ settingsItem.label }}</div>
                    <ClientOnly>
                      <ColorScheme v-if="settingsItem.wrap">
                        <VToggle :model-value="getSettingValue(settingsItem.key)"
                                 @change="value => onSettingChange(settingsItem.key, value)"/>
                      </ColorScheme>
                      <template v-else>
                        <VToggle :model-value="getSettingValue(settingsItem.key)"
                                 @change="value => onSettingChange(settingsItem.key, value)"/>
                      </template>
                    </ClientOnly>
                  </div>
                </div>
              </transition>
            </div>
            <div class="footer-actions">
              <button @click="openDeleteModal" class="btn btn-danger">Удалить аккаунт</button>
            </div>
          </div>
          <div v-else-if="activeTabKey === 'progress'">
            <Progress/>
          </div>
          <div v-else-if="activeTabKey === 'shop'">
            <Shop/>
          </div>
          <div v-else-if="activeTabKey === 'award'">
            <AwardsList :awards="awardList"/>
          </div>
        </div>
      </section>
    </div>
    <div v-if="isAvatarModalOpen" class="avatar-modal-overlay" @click.self="isAvatarModalOpen = false">
      <div class="avatar-modal-content">
        <h3>Выберите новый аватар</h3>
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
          <button @click="isAvatarModalOpen = false" class="btn">Отмена</button>
          <button @click="confirmAvatarChange" :disabled="!selectedAvatarName" class="btn btn-success">Сохранить
          </button>
        </div>
      </div>
    </div>
    <div v-if="isPurchaseModalOpen" class="modal-overlay" @click.self="isPurchaseModalOpen = false">
      <div class="modal-card">
        <div class="modal-title">Купить аватар?</div>
        <p class="modal-text">Этот аватар стоит <b>50 Артиклюсов</b>. Подтвердите покупку?</p>
        <div class="modal-actions">
          <button class="btn btn-success" @click="confirmPurchase">Купить</button>
          <button class="btn" @click="isPurchaseModalOpen = false">Отмена</button>
        </div>
      </div>
    </div>
    <div v-if="isDeleteModalOpen" class="modal-overlay" @click.self="isDeleteModalOpen = false">
      <div class="modal-card">
        <div class="modal-title">Удалить аккаунт?</div>
        <p class="modal-text">После удаления аккаунта все Ваши данные будут утеряны безвозвратно</p>
        <p v-if="!isGoogleUser" class="modal-text">Введите ваш пароль для подтверждения удаления аккаунта</p>
        <div v-if="!isGoogleUser" class="label">
          <input class="input" v-model="deletePasswordField.value" type="password"/>
          <p v-if="deletePasswordField.error" class="delete-error">{{ t(deletePasswordField.error) }}</p>
        </div>
        <p v-else class="modal-text">Вы вошли через Google. Для удаления аккаунта откроется окно повторной авторизации.</p>
        <div class="modal-actions">
          <button class="btn btn-danger" @click="confirmDeleteAccount">Удалить</button>
          <button class="btn" @click="isDeleteModalOpen = false">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, computed, onMounted, watch, watchEffect} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {toast} from 'vue3-toastify'

import Progress from '../src/components/progress.vue'
import Shop from '../src/components/Shop.vue'
import Modal from '../src/components/modal.vue'
import AwardsList from '../src/components/AwardsList.vue'
import VToggle from '~/src/components/V-toggle.vue'

import {userAuthStore} from '../store/authStore.js'
import {userlangStore} from '../store/learningStore.js'
import {useAchievementStore} from '../store/achievementStore.js'
import {useGameStore} from '../store/marafonStore.js'
import {mapErrors} from '../utils/errorsHandler.js'
import {isSoundEnabled, setSoundEnabled, unlockAudioByUserGesture} from '../utils/soundManager.js'

import DevelopmentIcon from '../assets/images/dev.svg'
import UserIcon from '../assets/images/user.svg'
import ProgressIcon from '../assets/images/progress.svg'
import AwardsIcon from '../assets/awards/award (7).svg'
import Home from '../assets/images/home.svg'

import WasteMoney from '../assets/awards/wasteMoney.svg'
import IdCard from '../assets/awards/idUser.svg'
import Wings from '../assets/awards/gold statuette.svg'
import veteranMedal from '../assets/awards/veteran medal.svg'
import talismanOfPatience from '../assets/awards/talisman of patience.svg'
import LastChance from '../assets/awards/last-chance.svg'
import Rocket from '../assets/awards/Rocket.svg'
import BookOfWisdom from '../assets/awards/bookOfWisdom.svg'
import SandGlass from '../assets/awards/sandglass.svg'
import Shield from '../assets/awards/shield.svg'

const {t} = useI18n()
const router = useRouter()
const authStore = userAuthStore()
const learningStore = userlangStore()
const achievementStore = useAchievementStore()
const gameStore = useGameStore()

const TAB_ITEMS = [
  {key: 'info', label: 'Параметры аккаунта', icon: UserIcon},
  {key: 'progress', label: 'Прогресс по артиклям', icon: ProgressIcon},
  {key: 'award', label: 'Награды', icon: AwardsIcon}
]
const activeTabKey = ref('info')

const isAvatarModalOpen = ref(false)
const selectedAvatarName = ref(null)
const isPurchaseModalOpen = ref(false)
const purchaseAvatarName = ref(null)

const achievementsNotifyEnabled = ref(true)
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('achievementsNotifyEnabled')
  achievementsNotifyEnabled.value = saved === null ? true : saved === 'true'
}

const isDeleteModalOpen = ref(false)
const deletePasswordField = ref({value: '', error: ''})

const isGenericModalOpen = ref(false)
const genericModalData = ref({title: 'Заголовок', text: 'текст', img: DevelopmentIcon})

const isCancelModalOpen = ref(false)

const soundEnabled = ref(isSoundEnabled())
const colorMode = useColorMode()
const darkMode = ref(colorMode.preference === 'dark')

const registrationDateText = computed(() => {
  if (!authStore.registeredAt) return '-'
  return new Date(authStore.registeredAt).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})
const accountInfoRows = computed(() => [
  {label: 'Имя', value: authStore.name},
  {label: 'Email', value: authStore.email},
  {label: 'Дата регистрации', value: registrationDateText.value || '—'}
])

const settingsToggleItems = [
  {key: 'sound', label: 'Звуковые уведомления', wrap: false},
  {key: 'dark', label: 'Тёмный режим', wrap: true},
  {key: 'ach', label: 'Уведомление достижений', wrap: true},
]

const getSettingValue = key => {
  if (key === 'sound') return soundEnabled.value
  if (key === 'dark') return darkMode.value
  if (key === 'ach') return achievementsNotifyEnabled.value
}

const onSettingChange = (key, value) => {
  if (key === 'sound') return handleSoundToggle(value)
  if (key === 'dark') return handleThemeToggle(value)
  if (key === 'ach') {
    achievementsNotifyEnabled.value = value
    localStorage.setItem('achievementsNotifyEnabled', value)
  }
}

const isAccountAccordionOpen = ref(false)
const isSettingsAccordionOpen = ref(false)

const formattedSubscriptionEndDate = computed(() => {
  if (!authStore.subscriptionEndsAt) return '-'
  const date = new Date(authStore.subscriptionEndsAt)
  return date.toLocaleDateString('ru-RU', {year: 'numeric', month: 'long', day: 'numeric'})
})

const achievementToAwardMap = {
  registerAchievement: 'Значок участника',
  wrong100Answers: 'Талисман терпения',
  SiteRegular: 'Медаль ветерана',
  Articlus: 'Алмаз артиклеуса',
  level10: 'Кубок с крыльями',
  LastChance: 'Тик-тик удачи',
  daily: 'Песочные часы вечности',
  guessedFastWords: 'Блиц-ракета',
  guessedSafeWords: 'Щит осторожности',
  guessSixHundred: 'Книга мудрости'
}
const awardsStorageKey = computed(() => `awards_shown_v1_${authStore.uid || 'anon'}`)

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

const shownAwardsSet = ref(loadShownAwards())
const baseAwards = [
  {id: 1, title: 'Алмаз артиклеуса', icon: WasteMoney},
  {id: 2, title: 'Значок участника', icon: IdCard},
  {id: 3, title: 'Кубок с крыльями', icon: Wings},
  {id: 4, title: 'Медаль ветерана', icon: veteranMedal},
  {id: 5, title: 'Талисман терпения', icon: talismanOfPatience},
  {id: 6, title: 'Тик-тик удачи', icon: LastChance},
  {id: 7, title: 'Блиц-ракета', icon: Rocket},
  {id: 8, title: 'Книга мудрости', icon: BookOfWisdom},
  {id: 9, title: 'Песочные часы вечности', icon: SandGlass},
  {id: 10, title: 'Щит осторожности', icon: Shield}
]
const awardList = ref(baseAwards.map(a => ({...a, locked: !shownAwardsSet.value.has(a.title)})))
const unlockedAwardList = computed(() => awardList.value.filter(a => !a.locked))

function setActiveTab(key) {
  activeTabKey.value = key
}

function backToMain() {
  router.push('/')
}

function handleSoundToggle(value) {
  setSoundEnabled(value)
  soundEnabled.value = value
  if (value) unlockAudioByUserGesture()
}

function handleThemeToggle(value) {
  colorMode.preference = value ? 'dark' : 'light'
  darkMode.value = value
}

function toggleAccountAccordion() {
  isAccountAccordionOpen.value = !isAccountAccordionOpen.value
}

function toggleSettingsAccordion() {
  isSettingsAccordionOpen.value = !isSettingsAccordionOpen.value
}

function openCancelModal() {
  isCancelModalOpen.value = true
}

function closeCancelModal() {
  isCancelModalOpen.value = false
}

async function cancelSubscription() {
  if (!authStore.uid) return
  try {
    const res = await $fetch('/api/stripe/cancel', {method: 'POST', body: {uid: authStore.uid}})
    if (!res.success) alert('Ошибка отмены подписки: ' + res.error)
  } catch {
    alert('Произошла ошибка. Попробуй позже.')
  }
}

function openPurchaseModal(name) {
  purchaseAvatarName.value = name
  isPurchaseModalOpen.value = true
}

function selectAvatar(name) {
  selectedAvatarName.value = name
}

async function confirmPurchase() {
  try {
    await authStore.purchaseAvatar(purchaseAvatarName.value)
    selectedAvatarName.value = purchaseAvatarName.value
    isPurchaseModalOpen.value = false
  } catch (err) {
    alert(err.message)
    isPurchaseModalOpen.value = false
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

const isGoogleUser = computed(() => authStore.isGoogleUser)

onMounted(async () => {
  await learningStore.loadFromFirebase()
})

watch(isAvatarModalOpen, opened => {
  if (opened) selectedAvatarName.value = authStore.avatar
})
watch(
    () => authStore.uid,
    () => {
      shownAwardsSet.value = loadShownAwards()
      awardList.value = baseAwards.map(a => ({...a, locked: !shownAwardsSet.value.has(a.title)}))
    }
)

watchEffect(() => {
  let justUnlocked = null
  const groups = achievementStore.groups || []
  for (const group of groups) {
    for (const achievement of group.achievements || []) {
      if (achievement.currentProgress >= achievement.targetProgress) {
        const title = achievementToAwardMap[achievement.id]
        if (!title) continue
        const item = awardList.value.find(a => a.title === title)
        if (item && item.locked && !shownAwardsSet.value.has(title)) {
          item.locked = false
          shownAwardsSet.value.add(title)
          saveShownAwards(shownAwardsSet.value)
          justUnlocked = item
          break
        }
      }
    }
    if (justUnlocked) break
  }
  if (justUnlocked && achievementsNotifyEnabled.value) {
    genericModalData.value = {
      title: 'Поздравляем!',
      text: `Вы получили награду «${justUnlocked.title}»!`,
    }
    isGenericModalOpen.value = true
    toast.success(`🎉 Вы получили награду «${justUnlocked.title}»!`, {
      autoClose: 5000,
      position: toast.POSITION.TOP_CENTER
    })
  }
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
  background: #ffffff;
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
  width: 22px;
  height: 22px;
}

.back-label {
  display: inline;
}

.sidebar-title {
  font-weight: 900;
  font-size: 1.15rem;
  text-align: center;
  margin-top: 4px;
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
  width: 100%;
  padding: 10px 12px;
  border: 3px solid #000;
  border-radius: 16px;
  background: #f3f4f6;
  box-shadow: 4px 4px 0 #000;
  cursor: pointer;
  transition: .15s;
  font-weight: 600;
  font-size: 1.05rem;
  font-family: "Nunito", sans-serif;
}

.tab-vertical:hover {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 #000;
}

.tab-vertical.active {
  background: #9ae6b4;
}

.tab-icon {
  width: 22px;
  height: 22px;
}

.content-panel {
  //background: #7fa5ff;
  padding: 14px;
  border-radius: 28px;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
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
  color: #333;
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
  margin-top: 14px;
  padding: 16px;
  flex: 1;
  overflow: auto;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fffbea;
  border: 3px solid #000;
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 10px;
  box-shadow: 4px 4px 0 #000;
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

@media (max-width: 1024px) {
  .cabinet-wrapper {
    height: 100vh;
    overflow: hidden;
    padding: 0;
  }

  .sidebar-panel {
    position: fixed;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
    width: 94%;
    height: 64px;
    padding: 8px 10px;
    z-index: 1100;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    border-radius: 18px;
    background: #fff;
    border: none;
    box-shadow: none;
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
    padding: 8px;
  }

  .tab-label {
    display: none;
  }

  .tab-icon {
    width: 26px;
    height: 26px;
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
    width: 24px;
    height: 24px;
  }

  .card-row,
  .accordion{
    box-shadow: 2px 2px 0 black;
  }

  .content-panel {
    overflow: hidden;
    padding: 5px 5px  80px 5px;
    border: none;
    box-shadow: none;
    border-radius: 0px;
  }

  .content-body {
    overflow: auto;
    padding: 5px;
  }
}

@media (max-width: 420px) {
  .tab-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
