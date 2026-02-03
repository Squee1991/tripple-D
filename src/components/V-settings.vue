<template>
  <div v-if="activeTabKey === 'info'" class="tab-content">
    <div v-if="isThemeModalOpen" class="modal-overlay" @click.self="isThemeModalOpen = false">
      <div class="modal-card">
        <div class="modal-title">Выберите оформление</div>
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
          <button class="btn-done" @click="isThemeModalOpen = false">Готово</button>
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
      <div class="accordion__title">{{ $t('cabinetAccordion.faq') }}</div>
      <ul class="service__items-elements">
        <li v-for="item in servicePaths" :key="item.id" class="service__items-list">
          <NuxtLink class="service__items-link" :to="item.path">{{ item.label }}</NuxtLink>
        </li>
      </ul>
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

const props = defineProps({
  settingsIcon: String,
  activeTabKey: {type: String, default: 'info'}
})

const emit = defineEmits(['open'])
const {t} = useI18n()
const uiSettings = useUiSettingsStore()
const eventStore = useEventSessionStore()
const colorMode = useColorMode()
const isThemeModalOpen = ref(false)
const toggleForceUpdateKey = ref(0)
const soundEnabled = ref(false)
const THEMES = {light: 'Светлая', dark: 'Темная', pink: 'Романтическая'}
const SETTINGS_GROUPS = computed(() => [
  {
    id: 'notifications',
    title: 'Уведомления',
    items: [
      {key: 'sound', label: t('cabinetToggle.sound'), type: 'toggle'},
      {key: 'ach', label: t('cabinetToggle.ach'), type: 'toggle'}
    ]
  },
  {
    id: 'appearance',
    title: 'Оформление',
    items: [
      {key: 'theme', label: 'Тема', type: 'button'},
      {key: 'snowFall', label: t('cabinetToggle.snowFall'), type: 'toggle'}
    ]
  }
])

const isValentineThemeUnlocked = computed(() => !!eventStore.shopItems?.['theme'])
const currentThemeName = computed(() => THEMES[colorMode.preference] || THEMES.light)

const handleThemeSelection = (key) => {
  if (key === 'pink' && !isValentineThemeUnlocked.value) {
    emit('open', 'snowWarning')
    return
  }
  colorMode.preference = key
}

const servicePaths = [
  {id: 'Privacy', label: 'Police privacy', path: '/privacy'},
  {id: 'FAQ', label: 'FAQ', path: '/faq'},
  {id: 'terms', label: 'Terms', path: '/terms'}
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
      emit('open', 'snowWarning')
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

.accordion__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.accordion__body {
  padding-top: 10px;
  font-weight: 700;
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

.locked-setting, .theme-option.locked {
  opacity: 0.5;
  cursor: pointer;
}

.settings-block .accordion__body .row__el--wrapper {
  margin-top: 10px;
}

.theme-select-btn {
  background: #f3f4f6;
  border: 2px solid #000;
  border-radius: 9px;
  padding: 8px 4px;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  cursor: pointer;
  font-size: 12px;
  box-shadow: 2px 2px 0 #000;
  transition: 0.1s;
  min-width: 100px;
}

.theme-select-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #000;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-card {
  background: #fff;
  border: 3px solid #000;
  border-radius: 26px;
  padding: 24px;
  width: 90%;
  max-width: 380px;
  box-shadow: 3px 3px 0 #000;
}

.modal-title {
  font-weight: 900;
  font-size: 1.6rem;
  text-align: center;
  margin-bottom: 24px;
}

.theme-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 10px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px;
  border: 3px solid #000;
  border-radius: 18px;
  cursor: pointer;
  font-weight: 800;
  transition: 0.15s;
}

.theme-option.active {
  background: #ffd54f;
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 #000;
}

.theme-preview {
  width: 32px;
  height: 32px;
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

.btn-done {
  background: #4ade80;
  border: 3px solid #000;
  border-radius: 14px;
  padding: 12px 30px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 3px 3px 0 #000;
  width: 100%;
}

.service__items {
  padding: 12px 16px;
  margin-top: 10px;
}

.service__items-elements {
  padding: 10px;
}

.service__items-link {
  color: var(--titleColor);
  font-weight: 900;
  padding: 10px 0;
  display: block;
}

.service__items-list {
  border-bottom: 1px solid var(--titleColor);
  padding-bottom: 5px;
}
</style>