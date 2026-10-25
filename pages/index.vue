<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { userAuthStore } from "~/store/authStore.js"
import Header from '../src/components/header.vue'
import VUid from '../src/components/V-uid.vue'
import VEventAvailableModal from "../src/components/V-eventAvailableModal.vue";
import VShowFall from "../src/components/V-showFall.vue";
import VHalloweenEffects from "../src/components/V-halloweenEffects.vue";
import LeafOrange from "../assets/images/halloween-effects/leafOrange.svg";
import LeafGold from "../assets/images/halloween-effects/leafGold.svg";
import Snow from "../assets/images/mery-christmas/Snow.svg";
import HeartFall from "assets/images/mery-christmas/heartFall.svg";
import { useEventSessionStore } from '../store/eventsStore.js'
import VStartPage from "~/src/components/V-startPage.vue";
import { SplashScreen } from '@capacitor/splash-screen'

const eventStore = useEventSessionStore()
const colorMode = useColorMode()
const isHalloweenTheme = computed(() => colorMode.value === 'orange')
// летающие эффекты, паутина и паук — пока идёт событие Хэллоуина (в любой теме) или включена его тема
const isHalloweenFx = computed(() => isHalloweenTheme.value || eventStore.isEventActive('pumpkin'))
const authStore = userAuthStore()
const hydrated = ref(false)
const isLocallyLogged = ref(false)

definePageMeta({
  layout: 'footerlayout'
})

onMounted(() => {

  hydrated.value = true
  isLocallyLogged.value = localStorage.getItem('app_user_logged') === 'true'
  if (authStore.initialized) {
    SplashScreen.hide()
  }
})

watch(() => authStore.initialized, (isInit) => {
  if (isInit) {
    requestAnimationFrame(() => {
      SplashScreen.hide()
    })
  }
})

watch(() => authStore.uid, (newUid) => {
  if (newUid) {
    localStorage.setItem('app_user_logged', 'true')
    isLocallyLogged.value = true
  } else if (authStore.initialized && !newUid) {
    localStorage.removeItem('app_user_logged')
    isLocallyLogged.value = false
  }
})
</script>

<template>
  <VEventAvailableModal @close="false" v-if="authStore.initialized"/>
  <VShowFall v-if="eventStore.isSnowEnabled" :image="Snow"/>
  <VHalloweenEffects v-if="isHalloweenTheme" layer="back"/>
  <div v-if="isHalloweenFx" class="halloween-layer" aria-hidden="true">
    <VHalloweenEffects/>
    <VShowFall :image="LeafOrange" :count="8"/>
    <VShowFall :image="LeafGold" :count="6"/>
  </div>
  <div class="container">
    <template v-if="isLocallyLogged || authStore.uid">
      <div class="stat">
        <Header/>
        <VUid/>
      </div>
    </template>
    <template v-else-if="authStore.initialized && !authStore.uid">
      <VStartPage/>
    </template>
  </div>
</template>

<style scoped>
/* Эффекты поверх контента главной (клики проходят насквозь), но ниже меню и модалок */
.halloween-layer {
  position: fixed;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

.container {
  max-width: 1240px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0 10px;
}

.stat {
  display: flex;
  justify-content: center;
  height: 100%;
  flex-direction: column;
}

.stat::after{
  content: "";
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 50px;
  background: var(--overlayAfter);
}

@media (max-width: 767px) {
  .stat {
    flex-direction: column;
    justify-content: center;
  }
}

@media (max-width: 767px) {
  .container {
    padding: 0;
  }
}
</style>