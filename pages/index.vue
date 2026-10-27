<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { userAuthStore } from "~/store/authStore.js"
import Header from '../src/components/header.vue'
import VUid from '../src/components/V-uid.vue'
import VEventAvailableModal from "../src/components/V-eventAvailableModal.vue";
import VShowFall from "../src/components/V-showFall.vue";
import Snow from "../assets/images/mery-christmas/Snow.svg";
import HeartFall from "assets/images/mery-christmas/heartFall.svg";
import VHalloweenEffects from "../src/components/V-halloweenEffects.vue";
import LeafOrange from "../assets/images/halloween-effects/leafOrange.svg";
import LeafGold from "../assets/images/halloween-effects/leafGold.svg";
import { useEventSessionStore } from '../store/eventsStore.js'
import VStartPage from "~/src/components/V-startPage.vue";
import { SplashScreen } from '@capacitor/splash-screen'

const eventStore = useEventSessionStore()
const authStore = userAuthStore()
const hydrated = ref(false)
const isLocallyLogged = ref(false)
const colorMode = useColorMode()

// Эффекты Хэллоуина — только на главной после входа:
// пока идёт его событие (в любой теме) или включена купленная тема
const isLoggedIn = computed(() => isLocallyLogged.value || !!authStore.uid)
const isHalloweenFx = computed(() =>
    isLoggedIn.value && (colorMode.value === 'orange' || eventStore.isEventActive('pumpkin'))
)

// html.halloween-fx делает фон body прозрачным, чтобы было видно эффекты под контентом
watch(isHalloweenFx, (on) => {
  if (process.client) document.documentElement.classList.toggle('halloween-fx', on)
}, { immediate: true })

onBeforeUnmount(() => {
  document.documentElement.classList.remove('halloween-fx')
})

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
  <template v-if="isHalloweenFx">
    <div class="halloween-layer halloween-layer--back" aria-hidden="true">
      <VHalloweenEffects layer="back"/>
      <VShowFall :image="LeafOrange" :count="3"/>
      <VShowFall :image="LeafGold" :count="2"/>
    </div>
    <div class="halloween-layer" aria-hidden="true">
      <VHalloweenEffects/>
    </div>
  </template>
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

/* листья, звёзды и нижняя паутина — за элементами главной */
.halloween-layer--back {
  z-index: -1;
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