<template>
  <div v-if="activeTabKey === 'info'" class="tab-content">
    <VBanner
        :text="t('Параметры аккаунта')"
        :icon="SettingIcon"
    />
    <div v-if="isThemeModalOpen" class="modal-overlay" @click.self="isThemeModalOpen = false">
      <div class="modal-card">
        <div class="theme-grid">
          <label
              v-for="(label, key) in THEMES"
              :key="key"
              class="theme-option"
              :class="{ active: colorMode.preference === key, locked: key === 'pink' && !isValentineThemeUnlocked }"
              @click.prevent="handleThemeSelection(key)"
          >
            <input type="radio" name="theme" :value="key" :checked="colorMode.preference === key">
            <div class="theme-option-content">
              <div class="theme-preview" :class="key">
                <span v-if="key === 'pink' && !isValentineThemeUnlocked" class="lock-icon">🔒</span>
              </div>
              <span class="theme-label">{{ label }}</span>
            </div>

            <div class="theme-check" v-if="colorMode.preference === key">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </label>
        </div>

        <div class="modal-actions">
          <button class="btn btn-game btn-success" @click="isThemeModalOpen = false">
            {{ t('themeModal.close') }}
          </button>
        </div>
      </div>
    </div>
    <LangSwitcher v-if="isLangModalOpen" @close="isLangModalOpen = false"/>
    <div
        v-for="group in SETTINGS_GROUPS"
        :key="group.id"
        class="settings-section"
    >
      <div class="section-title">{{ group.title }}</div>
      <div class="section-card">
        <div
            v-for="item in group.items"
            :key="item.key"
            class="section-row"
            :class="{ 'locked-setting': item.key === 'snowFall' && !isSnowUnlocked }"
        >
          <div class="toggle__wrapper">
            {{ item.label }}
            <span v-if="item.key === 'snowFall' && !isSnowUnlocked">🔒</span>
          </div>

          <template v-if="item.type === 'button'">
            <button
                class="theme-select-btn"
                @click="item.key === 'theme' ? isThemeModalOpen = true : isLangModalOpen = true"
            >
              {{ item.key === 'theme' ? currentThemeName : currentLangName }}
            </button>
          </template>

          <template v-else>
            <VToggle
                :key="item.key + toggleForceUpdateKey"
                :model-value="getSettingValue(item.key)"
                @change="value => onSettingChange(item.key, value)"
            />
          </template>
        </div>
      </div>
    </div>
    <div class="settings-section">
      <div class="section-title">{{ t('cabinetAccordion.faq') }}</div>
      <div class="section-card">
        <NuxtLink
            v-for="item in servicePaths"
            :key="item.id"
            class="section-row link-row"
            :to="item.path"
        >
          {{ item.label }}
          <span class="link-arrow">
            <img src="../../assets/images/next.svg" alt="">
          </span>
        </NuxtLink>
      </div>
    </div>
    <div class="settings-section account-actions">
      <div class="section-title"> {{ t('settingsGroup.account')}}</div>
      <div class="account-buttons">
        <button class="btn btn-logout w-full btn-m" @click="authStore.logOut()">
          {{ t('auth.logOut') }}
        </button>
        <button class="btn btn-danger w-full btn-m" @click.stop="openDeleteModal">
          {{ t('cabinet.deleteAcc') }}
        </button>
      </div>
    </div>
    <div v-if="isLockedModalOpen" class="modal-overlay locked-priority" @click.self="isLockedModalOpen = false">
      <div class="modal-card">
        <div class="modal-title locked-title">{{ lockedModalContent.title }}</div>
        <p class="modal-text" v-html="lockedModalContent.text"></p>
        <div class="modal-actions">
          <button class="btn btn-game btn-primary" @click="isLockedModalOpen = false" type="button">
            {{ t('cabinet.modalNotAllowEffectClose') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import VToggle from '~/src/components/V-toggle.vue'
import {useUiSettingsStore} from '../../store/uiSettingsStore.js'
import {useEventSessionStore} from '../../store/eventsStore.js'
import {isSoundEnabled, setSoundEnabled, unlockAudioByUserGesture} from '../../utils/soundManager.js'
import {useAchievementStore} from '../../store/achievementStore.js'
import {userAuthStore} from "../../store/authStore.js";
import LangSwitcher from "~/src/components/langSwitcher.vue";
import VBanner from "~/src/components/V-banner.vue";
import SettingIcon from "../../assets/images/settings.svg";
const router = useRouter();
const authStore = userAuthStore()
const props = defineProps({
  settingsIcon: String,
  activeTabKey: {type: String, default: 'info'}
})

const emit = defineEmits(['open'])
const {t, locales, locale} = useI18n()
const uiSettings = useUiSettingsStore()
const eventStore = useEventSessionStore()
const achievementStore = useAchievementStore()
const colorMode = useColorMode()

const isThemeModalOpen = ref(false)
const isLangModalOpen = ref(false)
const isLockedModalOpen = ref(false)

const currentLangName = computed(() => {
  const current = (locales.value || []).find(l => l.code === locale.value)
  return current ? current.name : locale.value
})

const lockedModalContent = ref({title: '', text: ''})
const toggleForceUpdateKey = ref(0)
const soundEnabled = ref(false)

const THEMES = computed(() => {
  return {
    light: t('themeModal.light'),
    dark: t('themeModal.dark'),
    pink: t('themeModal.pink')
  }
})

const isValentineThemeUnlocked = computed(() => {
  const ach = achievementStore.findById('valentineTheme')
  return ach ? ach.currentProgress >= 1 : false
})

const  openDeleteModal = () => {
  router.push('/delete')
}

const isSnowUnlocked = computed(() => {
  const ach = achievementStore.findById('snowFall')
  return ach ? ach.currentProgress >= 1 : false
})

const SETTINGS_GROUPS = computed(() => [
  {
    id: 'notifications',
    title: t('settingsGroup.notifications'),
    items: [
      {key: 'sound', label: t('cabinetToggle.sound'), type: 'toggle'},
      {key: 'ach', label: t('cabinetToggle.ach'), type: 'toggle'}
    ]
  },
  {
    id: 'appearance',
    title: t('settingsGroup.appearance'),
    items: [
      {key: 'theme', label: t('cabinetToggle.themeBtn'), type: 'button'},
      {key: 'snowFall', label: t('cabinetToggle.snowFall'), type: 'toggle'}
    ]
  },
  {
    id: 'language',
    title: t('settingsGroup.language'),
    items: [
      {key: 'lang', label: t('cabinetToggle.language'), type: 'button'}
    ]
  }
])

const currentThemeName = computed(() => THEMES.value[colorMode.value] || THEMES.value.dark)

const showRestriction = (type) => {
  if (type === 'theme') {
    isThemeModalOpen.value = false
    lockedModalContent.value = {
      title: `💖 ${t('cabinet.notAllow')}`,
      text: `${t('pinkThemeModal.partOne')} <b>${t('pinkThemeModal.partTwo')}</b>. <br/>${t('pinkThemeModal.partThree')}`
    }
  } else if (type === 'snow') {
    lockedModalContent.value = {
      title: `❄️ ${t('cabinet.notAllow')}`,
      text: `${t('cabinet.modalNotAllowEffectFirst')} <b>${t('cabinet.modalNotAllowEffectSecond')}</b>. <br/> ${t('cabinet.modalNotAllowEffectThird')}`
    }
  }
  isLockedModalOpen.value = true
}

const handleThemeSelection = (key) => {
  if (key === 'pink' && !isValentineThemeUnlocked.value) {
    showRestriction('theme')
    return
  }
  colorMode.preference = key
}

const servicePaths = [
  {id: 'Privacy', label: 'Privacy Policy', path: '/privacy'},
  {id: 'FAQ', label: 'FAQ', path: '/faq'},
  {id: 'terms', label: 'Terms of Service', path: '/terms'}
]

const getSettingValue = (key) => {
  if (key === 'sound') return soundEnabled.value
  if (key === 'ach') return uiSettings.achievementsNotifyEnabled
  if (key === 'snowFall') return eventStore.isSnowEnabled
  return false
}

const onSettingChange = (key, value) => {
  if (key === 'sound') {
    setSoundEnabled(value)
    soundEnabled.value = value
    if (value) unlockAudioByUserGesture()
    return
  }
  if (key === 'ach') return uiSettings.setAchievementsNotifyEnabled(value)
  if (key === 'snowFall') {
    if (!isSnowUnlocked.value) {
      showRestriction('snow')
      toggleForceUpdateKey.value++
      return
    }
    eventStore.setSnowFallEnabled(value)
  }
}

onMounted(async () => {
  soundEnabled.value = isSoundEnabled()
  await eventStore.loadEventProgress('winter')
  await eventStore.loadEventProgress('valentine')
})
</script>

<style scoped>

.tab-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 100px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  box-sizing: border-box;
}

.tab-content::-webkit-scrollbar {
  display: none;
}

.settings-section {
  margin-bottom: 24px;
  padding: 0 16px;
}

.section-title {
  font-size: 19px;
  font-weight: 800;
  color: var(--titleColor);
  margin-bottom: 10px;
  padding-left: 4px;
}

.section-card {
  background: var(--settingsSectionBg);
  border-radius: 16px;
  overflow: hidden;
}

.section-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(122, 121, 121, 0.08);
}

.section-row:last-child {
  border-bottom: none;
}

.link-row {
  text-decoration: none;
  color: var(--titleColor);
  font-weight: 700;
  cursor: pointer;
  font-size: 13px;
}

.link-arrow {
  color: #64748b;
  font-size: 20px;
  font-weight: 400;
  width: 12px;
}

.toggle__wrapper {
  font-weight: 900;
  font-size: 13px;
  color: var(--titleColor);
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-select-btn {
  background: #f3f4f6;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 9px;
  padding: 8px 12px;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  cursor: pointer;
  transition: 0.1s;
  color: #000;
}

.theme-select-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 0 0 0 #000;
}

.account-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  background: var(--settingsSectionBg);
  padding: 20px;
  border-radius: 16px;
}

.btn-m {
  width: 100%;
  max-width: 320px;
}

.btn-logout {
  background: #f3f4f6;
  color: #000;
  border: 2px solid #000;
  border-radius: 10px;
  padding: 14px 24px;
  font-weight: 800;
}

.btn-danger {
  background: none;
  color: var(--titleColor);
  border: none;
  border-radius: 10px;
  padding: 14px 24px;
  font-weight: 800;
}

.locked-setting {
  opacity: 0.5;
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 2000;
  padding: 20px;
}

.locked-priority {
  z-index: 3000 !important;
}

.modal-card {
  background: var(--tabBg);
  border-radius: 28px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
  border: 3px solid var(--tabsSlideBorderColor);
  text-align: center;
  animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  position: relative;
}

.modal-title {
  font-size: 22px;
  font-weight: 900;
  color: var(--titleColor);
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

.locked-title {
  font-size: 21px;
}

.modal-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--titleColor);
  margin-bottom: 24px;
  line-height: 1.5;
}

.theme-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.theme-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: #f8fafc;
  border: 3px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.theme-option:active:not(.locked) {
  transform: scale(0.97);
}

.theme-option.active {
  background: #eff6ff;
  border-color: #3b82f6;
  box-shadow: inset 0 3px 0 rgba(59, 130, 246, 0.1);
}

.theme-option.locked {
  opacity: 0.5;
  filter: grayscale(100%);
  background: #f1f5f9;
  cursor: not-allowed;
}

.theme-option-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-preview {
  width: 25px;
  height:  25px;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.theme-preview.light { background: #ffffff; }
.theme-preview.dark { background: #1e293b; }
.theme-preview.pink { background: #fbcfe8; }

.lock-icon {
  font-size: 16px;
}

.theme-label {
  font-size: 17px;
  font-weight: 800;
  color: #334155;
}

.theme-option.active .theme-label {
  color: #1d4ed8;
}

.theme-check {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}

.theme-option input {
  display: none;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
}

.btn-game {
  width: 100%;
  font-family: "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.1s ease;
  color: #ffffff;
}

.btn-success {
  background: #22c55e;
  border: 3px solid #16a34a;
  box-shadow: 0 6px 0 #15803d;
}

.btn-success:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #15803d;
}

.btn-primary {
  background: #3b82f6;
  border: 3px solid #2563eb;
  box-shadow: 0 6px 0 #1d4ed8;
}

.btn-primary:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #1d4ed8;
}
</style>