<template>
  <div v-if="activeTabKey === 'info'" class="tab-content">
    <div class="accordion open settings-static settings-block" @click.stop>
      <div class="accordion__head">
        <div class="accordion__content-left">
          <img class="accordion__icon" :src="settingsIcon" alt="">
          <div class="accordion__title">Уведомления</div>
        </div>
      </div>
      <div class="accordion__body" @click.stop>
        <div class="settings__elements">
          <div
              v-for="settingsItem in notificationsToggleItems"
              :key="settingsItem.key"
              class="row__el--wrapper"
          >
            <div class="toggle__wrapper">
              {{ settingsItem.label }}
            </div>
            <ClientOnly>
              <template v-if="settingsItem.wrap">
                <ColorScheme>
                  <VToggle
                      :key="settingsItem.key + toggleForceUpdateKey"
                      :model-value="getSettingValue(settingsItem.key)"
                      @change="value => onSettingChange(settingsItem.key, value)"
                  />
                </ColorScheme>
              </template>
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
      </div>
    </div>
    <div class="accordion open settings-static settings-block" @click.stop>
      <div class="accordion__head">
        <div class="accordion__content-left">
          <img class="accordion__icon" :src="settingsIcon" alt="">
          <div class="accordion__title">Темы</div>
        </div>
      </div>
      <div class="accordion__body" @click.stop>
        <div class="settings__elements">
          <div
              v-for="settingsItem in themesToggleItems"
              :key="settingsItem.key"
              class="row__el--wrapper"
              :class="{ 'locked-setting': settingsItem.key === 'snowFall' && !eventStore.isSnowPurchased }"
          >
            <div class="toggle__wrapper">
              {{ settingsItem.label }}
              <span v-if="settingsItem.key === 'snowFall' && !eventStore.isSnowPurchased">🔒</span>
            </div>
            <ClientOnly>
              <template v-if="settingsItem.wrap">
                <ColorScheme>
                  <VToggle
                      :key="settingsItem.key + toggleForceUpdateKey"
                      :model-value="getSettingValue(settingsItem.key)"
                      @change="value => onSettingChange(settingsItem.key, value)"
                  />
                </ColorScheme>
              </template>
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
      </div>
    </div>
    <div class="service__items">
      <div>
        <div class="accordion__title">{{ t('cabinetAccordion.faq')}}</div>
      </div>
      <div class="service__items">
        <ul class="service__items-elements" v-for="item in servicePaths" :key="item.id">
          <li class="service__items-list">
            <NuxtLink class="service__items-link" :to="item.path">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import VToggle from '~/src/components/V-toggle.vue'
import {userAuthStore} from '../../store/authStore.js'
import {useUiSettingsStore} from '../../store/uiSettingsStore.js'
import {useEventSessionStore} from '../../store/eventsStore.js'
import {isSoundEnabled, setSoundEnabled, unlockAudioByUserGesture} from '../../utils/soundManager.js'

const props = defineProps({
  userIcon: {type: String},
  settingsIcon: {type: String},
  faqIcon: {type: String},
  activeTabKey: {type: String, default: 'info'},
  awards: {type: Array, default: () => []}
})

const emit = defineEmits(['back', 'open'])

const {t} = useI18n()
const router = useRouter()
const authStore = userAuthStore()
const uiSettings = useUiSettingsStore()
const eventStore = useEventSessionStore()

const toggleForceUpdateKey = ref(0)

const colorMode = useColorMode()
const darkMode = ref(colorMode.preference === 'dark')
const soundEnabled = ref(false)
const servicePaths = ref(
    [
      {
        id: 'Privacy',
        label: 'Police privacy',
        path: '/privacy',
      },
      {
        id: 'FAQ',
        label: 'FAQ',
        path: '/faq',
      },
      {
        id: 'terms',
        label: 'Terms',
        path: '/terms',
      }
    ]
)

const notificationsToggleItems = computed(() => ([
  {key: 'sound', label: t('cabinetToggle.sound'), wrap: false},
  {key: 'ach', label: t('cabinetToggle.ach'), wrap: false},
]))


const themesToggleItems = computed(() => ([
  {key: 'dark', label: t('cabinetToggle.theme'), wrap: true},
  {key: 'snowFall', label: t('cabinetToggle.snowFall'), wrap: true},
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

onMounted(() => {
  soundEnabled.value = isSoundEnabled()
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
  max-height: 350px;
}

.accordion__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
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

.settings-block .accordion__body .row__el--wrapper {
  margin-left: 10px;
  margin-top: 10px;
}

.service__items {
  padding: 12px 16px;
}

.service__items {
  margin-top: 10px;
}

.service__items-link {
  color: var(--titleColor);
  font-weight: 900;
  padding: 10px 0;
  display: flex;
}

.service__items-list {
  border-bottom: 1px solid var(--titleColor);
  padding-bottom: 5px;
}

</style>
