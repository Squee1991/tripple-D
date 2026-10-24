<template>
  <div class="hud-screen">
    <div class="hud-column">
      <div class="hud-topbar">
        <button class="btn-icon-back" @click="handleBack" aria-label="back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h2 class="hud-title">{{ t('galaxyCabinet.cabinet') }}</h2>
      </div>

      <div class="hud-scroll">
        <!-- Пилот: корабль, имя (нажать, чтобы изменить) и корабль в полёте -->
        <div class="hud-panel pilot">
          <div class="pilot__avatar">
            <img :src="store.activeShip.img" alt="" class="pilot__ship">
          </div>
          <div class="pilot__info">
            <div v-if="isEditingName" class="pilot__edit">
              <input
                  v-model="tempName"
                  @keyup.enter="handleSaveName"
                  class="pilot__input"
                  maxlength="20"
                  autofocus
                  :disabled="isSavingName"
              />
              <button class="pilot__save" @click="handleSaveName" :disabled="isSavingName">
                <span v-if="isSavingName" class="loader"></span>
                <span v-else>OK</span>
              </button>
            </div>
            <button v-else class="pilot__name" @click="startEdit">
              <span class="pilot__name-text">{{ store.captainName }}</span>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16v4z"/></svg>
            </button>
            <span class="pilot__ship-name">🚀 {{ store.activeShip.name }}</span>
          </div>
        </div>

        <!-- Артиксы и статистика полётов -->
        <div class="hud-panel stat stat--wide">
          <span class="stat__label">{{ t('galaxyCabinet.money') }}</span>
          <span class="stat__value">
            <img :src="Money" alt="" class="hud-currency">
            {{ store.balance.toLocaleString() }}
          </span>
        </div>
        <div class="stats">
          <div class="hud-panel stat">
            <span class="stat__icon">🚀</span>
            <span class="stat__value">{{ store.flightStats.flights.toLocaleString() }}</span>
            <span class="stat__label">{{ t('galaxyCabinet.flights') }}</span>
          </div>
          <div class="hud-panel stat">
            <span class="stat__icon">👾</span>
            <span class="stat__value">{{ store.flightStats.bossesDefeated.toLocaleString() }}</span>
            <span class="stat__label">{{ t('galaxyCabinet.bosses') }}</span>
          </div>
          <div class="hud-panel stat">
            <span class="stat__icon">☄️</span>
            <span class="stat__value">{{ store.flightStats.meteorsDestroyed.toLocaleString() }}</span>
            <span class="stat__label">{{ t('galaxyCabinet.meteors') }}</span>
          </div>
        </div>

        <!-- Рекорды по галактикам -->
        <div class="hud-label">{{ t('galaxyCabinet.journey') }}</div>
        <div class="galaxies">
          <div v-for="galaxy in galaxyList" :key="galaxy.id" class="hud-panel galaxy"
               :class="{ 'is-empty': !(store.highScores[galaxy.id] > 0) }">
            <span class="galaxy__dot" :style="{ background: galaxy.color, boxShadow: `0 0 8px ${galaxy.color}` }"></span>
            <span class="galaxy__name">{{ galaxy.label }}</span>
            <span class="galaxy__record">
              <span class="galaxy__record-label">{{ t('galaxyCabinet.streak') }}</span>
              {{ store.highScores[galaxy.id] || 0 }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useGalaxyStore} from '../../../store/galaxyStore.js'
import Money from '../../../assets/images/galaxy-images/Artics.svg'

const emit = defineEmits(['close'])
const store = useGalaxyStore()
const {t} = useI18n()

const isEditingName = ref(false)
const isSavingName = ref(false)
const tempName = ref(store.captainName)

const startEdit = () => {
  tempName.value = store.captainName
  isEditingName.value = true
}

const handleSaveName = async () => {
  if (!tempName.value.trim() || isSavingName.value) return
  isSavingName.value = true
  try {
    await store.setCaptainName(tempName.value)
    isEditingName.value = false
  } finally {
    isSavingName.value = false
  }
}

const handleBack = () => {
  if (isEditingName.value) {
    isEditingName.value = false
  } else {
    emit('close')
  }
}

const galaxyList = [
  {id: 'alpha', label: t('galaxyList.alpha'), color: '#ff99c2'},
  {id: 'beta', label: t('galaxyList.beta'), color: '#66d9ff'},
  {id: 'gamma', label: t('galaxyList.gamma'), color: '#aaff66'},
  {id: 'delta', label: t('galaxyList.delta'), color: '#ffcc00'},
  {id: 'epsilon', label: t('galaxyList.epsilon'), color: '#b366ff'},
  {id: 'zeta', label: t('galaxyList.zeta'), color: '#ff6666'}
]

onMounted(async () => {
  await store.initUser()
  tempName.value = store.captainName
})
</script>

<style src="~/assets/styles/galaxyHud.css"></style>

<style scoped>
.pilot {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
}

.pilot__avatar {
  flex: none;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, rgba(90, 150, 255, 0.45) 0%, rgba(14, 28, 72, 0.7) 70%);
  box-shadow: 0 0 20px rgba(80, 160, 255, 0.35);
}

.pilot__ship {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.pilot__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pilot__name {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  padding: 0;
  border: none;
  background: none;
  color: #ffffff;
  font-family: Nunito, sans-serif;
  font-size: 22px;
  font-weight: 900;
  text-align: left;
  cursor: pointer;
}

.pilot__name svg {
  flex: none;
  color: #7fa7d9;
}

.pilot__name-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pilot__ship-name {
  color: #9fc2ea;
  font-size: 13px;
  font-weight: 800;
}

.pilot__edit {
  display: flex;
  gap: 8px;
}

.pilot__input {
  flex: 1;
  min-width: 0;
  height: 38px;
  padding: 0 12px;
  border: none;
  border-radius: 10px;
  background: rgba(5, 10, 30, 0.6);
  color: #ffffff;
  font-family: Nunito, sans-serif;
  font-size: 17px;
  font-weight: 800;
  outline: none;
}

.pilot__save {
  flex: none;
  min-width: 52px;
  height: 38px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(70, 140, 255, 0.9) 0%, rgba(32, 72, 180, 0.9) 100%);
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;
}

.loader {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 8px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  text-align: center;
}

.stat--wide {
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  padding: 14px 16px;
}

.stat__icon {
  font-size: 22px;
}

.stat__label {
  color: #7fa7d9;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

.stat__value {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 900;
}

.galaxies {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.galaxy {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
}

.galaxy__dot {
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.galaxy__name {
  flex: 1;
  min-width: 0;
  color: #eaf4ff;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.galaxy__record {
  flex: none;
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: #ffffff;
  font-size: 18px;
  font-weight: 900;
}

.galaxy__record-label {
  color: #7fa7d9;
  font-size: 11px;
  font-weight: 800;
}

/* Галактика без рекорда — приглушённо, но читаемо */
.galaxy.is-empty .galaxy__name,
.galaxy.is-empty .galaxy__record {
  color: #8aa4c8;
}
</style>
