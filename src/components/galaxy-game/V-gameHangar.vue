<script setup>
import {ref, computed, onMounted} from 'vue'
import {useGalaxyStore} from '../../../store/galaxyStore.js'
import Money from '../../../assets/images/galaxy-images/Artics.svg'

const emit = defineEmits(['close'])
const store = useGalaxyStore()
const {t} = useI18n()

// Открываем ангар на корабле, который сейчас в полёте
const currentIndex = ref(Math.max(0, store.tankList.findIndex(ship => ship.id === store.selectedTankId)))
const currentShip = computed(() => store.tankList[currentIndex.value])
const isSelected = computed(() => store.selectedTankId === currentShip.value.id)
const isOwned = computed(() => store.ownedTanks.includes(currentShip.value.id))
const missingArtiks = computed(() => Math.max(0, currentShip.value.price - store.balance))

const showNextShip = () => currentIndex.value = (currentIndex.value + 1) % store.tankList.length
const showPreviousShip = () => currentIndex.value = (currentIndex.value - 1 + store.tankList.length) % store.tankList.length

const handleBuy = async () => {
  await store.buyShip(currentShip.value)
}

const handleSelect = async () => {
  await store.selectShip(currentShip.value.id)
}

// Свайп по кораблю листает ангар
const SWIPE_MIN_DISTANCE = 40
let swipeStartX = null

function onTouchStart(event) {
  swipeStartX = event.touches[0].clientX
}

function onTouchEnd(event) {
  if (swipeStartX === null) return
  const swipeDistance = event.changedTouches[0].clientX - swipeStartX
  swipeStartX = null
  if (swipeDistance <= -SWIPE_MIN_DISTANCE) showNextShip()
  if (swipeDistance >= SWIPE_MIN_DISTANCE) showPreviousShip()
}

onMounted(async () => {
  await store.initUser()
  const selectedIndex = store.tankList.findIndex(ship => ship.id === store.selectedTankId)
  if (selectedIndex >= 0) currentIndex.value = selectedIndex
})
</script>

<template>
  <div class="hud-screen">
    <div class="hud-column">
      <div class="hud-topbar">
        <button class="btn-icon-back" @click="emit('close')" aria-label="back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h2 class="hud-title">{{ t('galaxyMenu.shop') }}</h2>
        <span class="hud-chip">
          <img :src="Money" alt="" class="hud-currency">
          {{ store.balance }}
        </span>
      </div>

      <!-- Витрина: корабль крупно, листается стрелками и свайпом -->
      <div class="showroom" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
        <button class="hud-round-btn showroom__arrow" @click="showPreviousShip" aria-label="previous">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
        <Transition name="ship-switch" mode="out-in">
          <div :key="currentIndex" class="showroom__ship" :class="{ 'is-locked': !isOwned }">
            <span class="showroom__glow"></span>
            <img :src="currentShip.img" class="showroom__image" :alt="currentShip.name"/>
            <span class="showroom__platform"></span>
          </div>
        </Transition>
        <button class="hud-round-btn showroom__arrow" @click="showNextShip" aria-label="next">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div class="showroom__counter">{{ currentIndex + 1 }} / {{ store.tankList.length }}</div>

      <!-- Карточка корабля и действие -->
      <div class="hud-panel ship-info">
        <div class="ship-info__head">
          <h3 class="ship-info__name">{{ currentShip.name }}</h3>
          <span v-if="isSelected" class="ship-info__status is-flying">● {{ t('galaxyHangar.inFlight') }}</span>
          <span v-else-if="!isOwned" class="ship-info__status">🔒</span>
        </div>

        <button v-if="!isOwned" class="hud-button is-gold" :disabled="missingArtiks > 0" @click="handleBuy">
          {{ t('galaxyHangar.buy') }}
          <img :src="Money" alt="" class="hud-currency">
          {{ currentShip.price }}
        </button>
        <button v-else-if="!isSelected" class="hud-button" @click="handleSelect">
          {{ t('galaxyHangar.change') }}
        </button>
        <button v-else class="hud-button is-success" disabled>
          {{ t('galaxyHangar.inFlight') }}
        </button>
        <div v-if="!isOwned && missingArtiks > 0" class="ship-info__missing">
          −{{ missingArtiks }} <img :src="Money" alt="" class="hud-currency">
        </div>
      </div>

      <!-- Все корабли ангара -->
      <div class="fleet">
        <button v-for="(ship, index) in store.tankList" :key="ship.id" class="fleet__item"
                :class="{
                  'is-current': index === currentIndex,
                  'is-locked': !store.ownedTanks.includes(ship.id),
                  'is-flying': ship.id === store.selectedTankId
                }"
                @click="currentIndex = index">
          <img :src="ship.img" :alt="ship.name" class="fleet__image">
        </button>
      </div>
    </div>
  </div>
</template>

<style src="~/assets/styles/galaxyHud.css"></style>

<style scoped>
.showroom {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.showroom__arrow {
  width: 46px;
  height: 46px;
}

.showroom__ship {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.showroom__glow {
  position: absolute;
  top: 10%;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(80, 160, 255, 0.35) 0%, transparent 70%);
  pointer-events: none;
}

.showroom__image {
  position: relative;
  width: min(62vw, 170px);
  animation: shipFloat 3s ease-in-out infinite;
  filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.5));
}

.showroom__ship.is-locked .showroom__image {
  filter: grayscale(0.7) brightness(0.65) drop-shadow(0 12px 24px rgba(0, 0, 0, 0.5));
}

.showroom__platform {
  width: 60%;
  height: 16px;
  margin-top: 6px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(0, 210, 255, 0.45) 0%, transparent 70%);
}

@keyframes shipFloat {
  50% {
    transform: translateY(-10px);
  }
}

.showroom__counter {
  margin: 4px 0 12px;
  color: #7fa7d9;
  font-size: 13px;
  font-weight: 800;
  text-align: center;
  letter-spacing: 1px;
}

.ship-switch-enter-active, .ship-switch-leave-active {
  transition: opacity 0.18s, transform 0.18s;
}

.ship-switch-enter-from {
  opacity: 0;
  transform: scale(0.85);
}

.ship-switch-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.ship-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ship-info__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ship-info__name {
  margin: 0;
  color: #ffffff;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 1px;
}

.ship-info__status {
  color: #9fc2ea;
  font-size: 13px;
  font-weight: 900;
}

.ship-info__status.is-flying {
  color: #3ee07f;
}

.ship-info__missing {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: -4px;
  color: #ff8a8a;
  font-size: 13px;
  font-weight: 800;
}

.fleet {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 12px;
}

.fleet__item {
  position: relative;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
  background: rgba(20, 38, 92, 0.45);
  cursor: pointer;
  transition: background 0.15s;
}

.fleet__item.is-current {
  background: rgba(70, 140, 255, 0.55);
}

.fleet__image {
  height: 40px;
  max-width: 80%;
  object-fit: contain;
}

.fleet__item.is-locked .fleet__image {
  filter: grayscale(0.8) brightness(0.55);
}

.fleet__item.is-flying::after {
  content: '';
  position: absolute;
  top: 6px;
  right: 8px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3ee07f;
  box-shadow: 0 0 6px #3ee07f;
}
</style>
