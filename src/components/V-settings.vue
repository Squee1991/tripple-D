<template>
  <div v-if="activeTabKey === 'info'" class="tab-content">

    <div v-if="isThemeModalOpen" class="modal-overlay" @click.self="isThemeModalOpen = false">
      <div class="modal-card">
        <div class="modal-title">{{ t('themeModal.title') }}</div>
        <div class="theme-grid">
          <label
              v-for="(label, key) in THEMES"
              :key="key"
              class="theme-option"
              :class="{ active: colorMode.preference === key, locked: key === 'pink' && !isValentineThemeUnlocked }"
              @click.prevent="handleThemeSelection(key)"
          >
            <input type="radio" name="theme" :value="key" :checked="colorMode.preference === key">
            <div class="theme-preview" :class="key">
              <span v-if="key === 'pink' && !isValentineThemeUnlocked">🔒</span>
            </div>
            <span>{{ label }}</span>
          </label>
        </div>
        <div class="modal-actions">
          <button class="btn btn-success" @click="isThemeModalOpen = false">{{ t('themeModal.close') }}</button>
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
          <span class="link-arrow">›</span>
        </NuxtLink>
      </div>
    </div>
    <div class="settings-section account-actions">
      <div class="section-title">Управление аккаунтом</div>
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
        <div class="modal-title">{{ lockedModalContent.title }}</div>
        <p class="modal-text" v-html="lockedModalContent.text"></p>
        <div class="modal-actions">
          <button class="btn" @click="isLockedModalOpen = false" type="button">
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
    title: 'Оформление',
    items: [
      {key: 'theme', label: t('cabinetToggle.themeBtn'), type: 'button'},
      {key: 'snowFall', label: t('cabinetToggle.snowFall'), type: 'toggle'}
    ]
  },
  {
    id: 'language',

    title: 'Язык',
    items: [
      {key: 'lang', label: 'Язык интерфейса', type: 'button'}
    ]
  }
])

const currentThemeName = computed(() => THEMES[colorMode.value] || THEMES.dark)

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
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--titleColor);
  margin-bottom: 10px;
  padding-left: 4px;
}

.section-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow: hidden;
}

.section-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.section-row:last-child {
  border-bottom: none;
}

.link-row {
  text-decoration: none;
  color: var(--titleColor);
  font-weight: 700;
  cursor: pointer;
}

.link-arrow {
  color: #64748b;
  font-size: 20px;
  font-weight: 400;
}

.toggle__wrapper {
  font-weight: 900;
  color: var(--titleColor);
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-select-btn {
  background: #f3f4f6;
  border: 2px solid #000;
  border-radius: 9px;
  padding: 8px 12px;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 2px 2px 0 #000;
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
}

.btn-m {
  width: 100%;
  max-width: 320px;
}

.btn-logout {
  background: #f3f4f6;
  color: #000;
}

.btn-danger {
  background: #ef4444;
  color: #fff;
  border: 2px solid #b91c1c;
  box-shadow: 2px 2px 0 #b91c1c;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .5);
  z-index: 2000;
}

.locked-priority {
  z-index: 3000 !important;
  background: rgba(0, 0, 0, .7);
}

.modal-card {
  background: #fef8e4;
  border: 3px solid #000;
  border-radius: 20px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 3px 3px 0 #000;
  text-align: center;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 900;
  font-style: italic;
  margin-bottom: 1rem;
  color: #000;
}

.modal-text {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
  color: #000;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  border: 2px solid #000;
  border-radius: 10px;
  padding: 14px 24px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.1s;
  font-family: "Nunito", sans-serif;
}

.btn-success {
  background: #4ade80;
  width: 100%;
  color: #000;
}

.theme-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  border: 2px solid #000;
  border-radius: 16px;
  cursor: pointer;
  font-weight: 800;
  background: #fff;
  color: #000;
}

.theme-option.active {
  background: #ffd54f;
  box-shadow: 2px 2px 0 #000;
}

.theme-preview {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #000;
}

.theme-preview.light {
  background: #fff;
}

.theme-preview.dark {
  background: #222;
}

.theme-preview.pink {
  background: #ff85a1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.locked-setting, .theme-option.locked {
  opacity: 0.5;
}
</style>