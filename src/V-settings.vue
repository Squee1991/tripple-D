<template>
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

            <div class="account-tab-body" @click.stop>

              <template v-if="accountTab === 'account'">
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
                    <button class="btn btn-outline-danger" @click.stop="openCancelModal">
                      {{ t('cabinet.cancelBtn') }}
                    </button>
                  </div>
                </template>

                <template v-else-if="authStore.isPremium && authStore.subscriptionCancelled">
                  <p class="access__text">📅 {{ t('cabinet.access') }} {{ formattedSubscriptionEndDate }}</p>
                </template>

                <div class="account-actions">
                  <button @click.stop="openDeleteModal" class="btn btn-danger w-full">
                    {{ t('cabinet.deleteAcc') }}
                  </button>
                </div>
              </template>
            </div>
          </template>

          <template v-else-if="acc.key === 'settings'">
            <div class="settings__elements">
              <div
                  v-for="settingsItem in settingsToggleItems"
                  :key="settingsItem.key"
                  class="row__el--wrapper"
                  :class="{ 'locked-setting': settingsItem.key === 'snowFall' && !eventStore.isSnowPurchased }"
              >
                <div class="toggle__wrapper">
                  {{ settingsItem.label }}
                  <span v-if="settingsItem.key === 'snowFall' && !eventStore.isSnowPurchased">🔒</span>
                </div>
                <ClientOnly>
                  <ColorScheme v-if="settingsItem.wrap">
                    <VToggle
                        :key="settingsItem.key + toggleForceUpdateKey"
                        :model-value="getSettingValue(settingsItem.key)"
                        @change="value => onSettingChange(settingsItem.key, value)"
                    />
                  </ColorScheme>
                  <template v-else>
                    <VToggle
                        :key="settingsItem.key + toggleForceUpdateKey"
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
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import VToggle from '~/src/components/V-toggle.vue'
import AwardsList from '~/src/components/AwardsList.vue'
import VFindFriends from '~/src/components/V-findFriends.vue'


import {userAuthStore} from '../store/authStore.js'
import {useUiSettingsStore} from '../store/uiSettingsStore.js'
import {useEventSessionStore} from '../store/eventsStore.js'
import {isSoundEnabled, setSoundEnabled, unlockAudioByUserGesture} from '../utils/soundManager.js'

const props = defineProps({
  userIcon: {type: String, required: true},
  settingsIcon: {type: String, required: true},
  faqIcon: {type: String, required: true},
  activeTabKey: {type: String, default: 'info'},
  awards: {type: Array, default: () => []}
})


const accountTab = ref('account')
const emit = defineEmits(['back', 'open'])

const {t, locale} = useI18n()
const router = useRouter()

const authStore = userAuthStore()
const uiSettings = useUiSettingsStore()
const eventStore = useEventSessionStore()

const toggleForceUpdateKey = ref(0)
const activeAccordion = ref(null)

const colorMode = useColorMode()
const darkMode = ref(colorMode.preference === 'dark')
const soundEnabled = ref(false)


const ACCORDIONS = computed(() => [
  {key: 'personal', title: t('cabinetAccordion.personalData'), icon: props.userIcon, isLink: false},
  {key: 'account', title: t('cabinetAccordion.account') || t('cabinet.account'), icon: props.faqIcon, isLink: false},
  {key: 'settings', title: t('cabinetAccordion.settings'), icon: props.settingsIcon, isLink: false},
  {key: 'faq', title: t('cabinetAccordion.faq'), icon: props.faqIcon, isLink: true},
])

function toggleAccordion(key) {
  activeAccordion.value = activeAccordion.value === key ? null : key
  if (key === 'account' && activeAccordion.value === 'account') {
    accountTab.value = 'account'
  }
}

function onAccordionClick(acc) {
  if (acc.isLink) {
    emit('open', 'faq')
    return
  }
  toggleAccordion(acc.key)
}

const registrationDateText = computed(() => {
  const registeredAt = authStore.registeredAt
  if (!registeredAt) return '—'
  let date
  if (typeof registeredAt.toDate === 'function') date = registeredAt.toDate()
  else date = new Date(registeredAt)
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('ru-RU', {day: '2-digit', month: '2-digit', year: 'numeric'})
})

const accountInfoRows = computed(() => [
  {label: t('cabinetInfoRows.name'), value: authStore.name || '—'},
  {label: t('cabinetInfoRows.email'), value: authStore.email || '—'},
  {label: t('cabinetInfoRows.registerDate'), value: registrationDateText.value || '—'},
])


const settingsToggleItems = computed(() => ([
  {key: 'sound', label: t('cabinetToggle.sound'), wrap: false},
  {key: 'dark', label: t('cabinetToggle.theme'), wrap: true},
  {key: 'ach', label: t('cabinetToggle.ach'), wrap: true},
  // { key: 'snowFall', label: t('cabinetToggle.snowFall'), wrap: true },
]))

const getSettingValue = (key) => {
  if (key === 'sound') return soundEnabled.value
  if (key === 'dark') return darkMode.value
  if (key === 'ach') return uiSettings.achievementsNotifyEnabled
  if (key === 'snowFall') return eventStore.isSnowEnabled
  return false
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

const onSettingChange = (key, value) => {
  if (key === 'sound') return handleSoundToggle(value)
  if (key === 'dark') return handleThemeToggle(value)
  if (key === 'ach') return uiSettings.setAchievementsNotifyEnabled(value)

  if (key === 'snowFall') {
    if (!eventStore.isSnowPurchased) {
      emit('open', 'snowWarning')
      toggleForceUpdateKey.value++
      return
    }
    return eventStore.setSnowFallEnabled(value)
  }
}


const formattedSubscriptionEndDate = computed(() => {
  if (!authStore.subscriptionEndsAt) return '-'
  const date = new Date(authStore.subscriptionEndsAt)
  return date.toLocaleDateString(locale.value, {year: 'numeric', month: 'long', day: 'numeric'})
})

function routeToPay() {
  router.push('/pay')
}

function openCancelModal() {
  emit('open', 'cancelPremium')
}

function openDeleteModal() {
  emit('open', 'deleteAccount')
}

onMounted(() => {
  soundEnabled.value = isSoundEnabled()
})
</script>


<style scoped>

.tab-content {
  padding-top: 60px;
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

.accordion__content-left {
  display: flex;
  align-items: center;
}

.accordion__icon {
  width: 28px;
  margin-right: 10px;
}

.accordion__title {
  font-weight: 900;
  font-size: 1.2rem;
  color: var(--titleColor);
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
  color: var(--titleColor);
}

.card-row__value {
  font-weight: 700;
  color: var(--titleColor);
}


.subscription-status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 10px 8px;
  gap: 12px;
}

.subscription-label {
  font-weight: 800;
  color: #6b7280;
  white-space: nowrap;
}

.subscription-status {
  text-align: right;
}

.subscription-status .active {
  color: #f97316;
  font-weight: 900;
}

.subscription-status .cancelled {
  color: #ff9800;
  font-weight: 900;
}

.access__text {
  text-align: end;
  margin-top: 10px;
  font-weight: 800;
  color: var(--titleColor);
}

.premium__btn-wrapper {
  margin-top: 10px;
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

.premium__status-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
  gap: 12px;
  margin-top: 10px;
}

.settings__elements {
  margin-top: 10px;
}

.row__el--wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 8px;
  gap: 10px;
}

.toggle__wrapper {
  font-weight: 900;
  color: var(--titleColor);
  display: flex;
  align-items: center;
  gap: 8px;
}

.locked-setting {
  opacity: 0.7;
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

.account-actions {
  margin-top: 14px;
  padding: 0 8px;
}

.w-full {
  width: 100%;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.friends {
  color: var(--titleColor);
  font-size: 20px;
  font-weight: 600;
}

.tab-content,
.accordion,
.accordion__title,
.accordion__body,
.card-row__label,
.card-row__value,
.toggle__wrapper,
.subscription-status-row,
.subscription-label,
.subscription-status,
.access__text {
  color: #000 !important;
}

@media (min-width: 1024px) {
  .premium__btn:hover {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 #000;
  }

  .accordion:hover {
    transform: translate(1px, 1px);
    box-shadow: 2px 2px 0 #000;
  }

  .btn:hover {
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0 #000;
  }
}

@media (max-width: 1023px) {
  .accordion {
    box-shadow: 2px 2px 0 black;
  }

  .premium__status-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .subscription-status-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .subscription-status {
    text-align: left;
    width: 100%;
  }
}
</style>




