<template>
  <div v-if="activeTabKey === 'info'" class="tab-content">
    <div v-if="isThemeModalOpen" class="modal-overlay" @click.self="isThemeModalOpen = false">
      <div class="modal-card">
        <div class="modal-title">{{ t('themeModal.title')}}</div>
        <div class="theme-grid">
          <label
              v-for="(label, key) in THEMES"
              :key="key"
              class="theme-option"
              :class="{
                active: colorMode.preference === key,
                locked: key === 'pink' && !isValentineThemeUnlocked
              }"
              @click.prevent="handleThemeSelection(key)"
          >
            <input
                type="radio"
                name="theme"
                :value="key"
                :checked="colorMode.preference === key"
            >
            <div class="theme-preview" :class="key">
              <span v-if="key === 'pink' && !isValentineThemeUnlocked">🔒</span>
            </div>
            <span>{{ label }}</span>
          </label>
        </div>
        <div class="modal-actions">
          <button class="btn btn-success" @click="isThemeModalOpen = false">{{ t('themeModal.close')}}</button>
        </div>
      </div>
    </div>
    <div
        v-for="group in SETTINGS_GROUPS"
        :key="group.id"
        class="accordion open settings-static settings-block"
        @click.stop
    >
      <div class="accordion__head">
        <div class="accordion__content-left">
          <div class="accordion__title">{{ group.title }}</div>
        </div>
      </div>
      <div class="accordion__body" @click.stop>
        <div class="settings__elements">
          <div
              v-for="item in group.items"
              :key="item.key"
              class="row__el--wrapper"
              :class="{ 'locked-setting': item.key === 'snowFall' && !eventStore.isSnowPurchased }"
          >
            <div class="toggle__wrapper">
              {{ item.label }}
              <span v-if="item.key === 'snowFall' && !eventStore.isSnowPurchased">🔒</span>
            </div>
            <template v-if="item.type === 'button'">
              <button class="theme-select-btn" @click="isThemeModalOpen = true">
                {{ currentThemeName }}
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
    </div>
    <div class="service__items">
      <div class="accordion__title">{{ t('cabinetAccordion.faq') }}</div>
      <ul class="service__items-elements">
        <li v-for="item in servicePaths" :key="item.id" class="service__items-list">
          <NuxtLink class="service__items-link" :to="item.path">{{ item.label }}</NuxtLink>
        </li>
      </ul>
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
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import VToggle from '~/src/components/V-toggle.vue'
import { useUiSettingsStore } from '../../store/uiSettingsStore.js'
import { useEventSessionStore } from '../../store/eventsStore.js'
import { isSoundEnabled, setSoundEnabled, unlockAudioByUserGesture } from '../../utils/soundManager.js'
const props = defineProps({
  settingsIcon: String,
  activeTabKey: { type: String, default: 'info' }
})

const emit = defineEmits(['open'])
const { t } = useI18n()
const uiSettings = useUiSettingsStore()
const eventStore = useEventSessionStore()
const colorMode = useColorMode()

const isThemeModalOpen = ref(false)
const isLockedModalOpen = ref(false)
const lockedModalContent = ref({ title: '', text: '' })
const toggleForceUpdateKey = ref(0)
const soundEnabled = ref(false)

const THEMES = { light: t('themeModal.light'), dark: t('themeModal.dark'), pink: t('themeModal.pink') }

const SETTINGS_GROUPS = computed(() => [
  {
    id: 'notifications',
    title: t('settingsGroup.notifications'),
    items: [
      { key: 'sound', label: t('cabinetToggle.sound'), type: 'toggle' },
      { key: 'ach', label: t('cabinetToggle.ach'), type: 'toggle' }
    ]
  },
  {
    id: 'appearance',
    title: t('settingsGroup.appearance'),
    items: [
      { key: 'theme', label: t('cabinetToggle.themeBtn'), type: 'button' },
      { key: 'snowFall', label: t('cabinetToggle.snowFall'), type: 'toggle' }
    ]
  }
])

const isValentineThemeUnlocked = computed(() => !!eventStore.shopItems?.['theme'])
const currentThemeName = computed(() => THEMES[colorMode.preference] || THEMES.light)

const showRestriction = (type) => {
  if (type === 'theme') {
    isThemeModalOpen.value = false
    lockedModalContent.value = {
      title: `💖 ${t('cabinet.notAllow')}`,
      text: `${t('pinkThemeModal.partOne')}} <b>${t('pinkThemeModal.partTwo')}}</b>. <br/>${t('pinkThemeModal.partThree')}}`
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
  { id: 'Privacy', label: 'Police privacy', path: '/privacy' },
  { id: 'FAQ', label: 'FAQ', path: '/faq' },
  { id: 'terms', label: 'Terms', path: '/terms' }
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
    if (!eventStore.isSnowPurchased) {
      showRestriction('snow')
      toggleForceUpdateKey.value++
      return
    }
    eventStore.setSnowFallEnabled(value)
  }
}

onMounted(async () => {
  soundEnabled.value = isSoundEnabled()
  await eventStore.loadEventProgress('valentine')
})
</script>

<style scoped>
.accordion {
  padding: 12px 16px;
  margin-top: 14px;
  cursor: pointer;
  max-height: 60px;
  overflow: hidden;
  transition: max-height .3s ease;
}

.accordion.open {
  max-height: 500px;
}

.accordion__title {
  font-weight: 900;
  font-size: 1.2rem;
  color: var(--titleColor);
}

.accordion__body {
  padding-top: 10px;
}

.row__el--wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 8px;
}

.service__items-elements {
  margin-left: 10px;
  padding: 10px 0;
}

.toggle__wrapper {
  font-weight: 900;
  color: var(--titleColor);
  display: flex;
  align-items: center;
  gap: 8px;
}

.locked-setting, .theme-option.locked {
  opacity: 0.5;
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
}

.theme-select-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 0 0 0 #000;
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
  font-size: 1.8rem;
  font-weight: 900;
  font-style: italic;
  margin-bottom: 1rem;
}

.modal-text {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn {
  border: 2px solid #000;
  border-radius: 10px;
  padding: 10px 24px;
  font-weight: 800;
  background: #f3f4f6;
  box-shadow: 2px 2px 0 #000;
  cursor: pointer;
  transition: 0.1s;
}

.btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #000;
}

.btn-success {
  background: #4ade80;
  width: 100%;
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

.theme-preview.light { background: #fff; }
.theme-preview.dark { background: #222; }
.theme-preview.pink { background: #ff85a1; display: flex; align-items: center; justify-content: center; }

.service__items {
  padding: 12px 16px;
  margin-top: 10px;
}

.service__items-link {
  color: var(--titleColor);
  font-weight: 900;
  padding: 10px 0;
  display: block;
}

.service__items-list {
  border-bottom: 1px solid var(--titleColor);
  padding: 5px 0;
}
</style>