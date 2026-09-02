<template>
  <NuxtLayout>
    <NuxtPage/>
    <AchievementToast @toast-finished="onToastFinished" />
    <VLost/>
    <VRankOverlay/>
    <VNetwork/>
  </NuxtLayout>
</template>

<script setup>
import VRankOverlay from "./src/components/V-rank-overlay.vue";
import { StatusBar, Style } from '@capacitor/status-bar';
import AchievementToast from './src/components/AchievementToast.vue'
import VLost from './src/components/V-lost.vue'
import { useRouter, useRoute } from 'vue-router'
import { useAchievementStore } from './store/achievementStore.js'
import { useCurrentUser } from "vuefire";
import { userlangStore } from './store/learningStore.js'
import { userAuthStore } from './store/authStore.js'
import { useSentencesStore } from './store/sentencesStore.js';
import { useTrainerStore } from './store/themenProgressStore.js'
import { useQuestStore } from './store/questStore.js'
import { useCardsStore } from './store/cardsStore.js'
import { useLocalStatGameStore } from './store/localSentenceStore.js'
import { useBillingStore } from './store/billingStore.js'
import { userChainStore } from './store/chainStore.js'
import { SplashScreen } from '@capacitor/splash-screen'
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app'
import { onMounted, onUnmounted, ref, watch, nextTick } from "vue";
import { dailyStore } from './store/dailyStore'
import { Capacitor } from '@capacitor/core'
import { AdMob } from '@capacitor-community/admob';
import VNetwork from "./src/components/V-network.vue";
import { initAdmob } from './utils/admob.js';
const chainStore = userChainStore()
const billingStore = useBillingStore()

const achStore = useAchievementStore()
const showStepHint = ref(false)
const cardStore = useCardsStore()
const statsStore = useLocalStatGameStore()
const questStore = useQuestStore()
const learningStore = userlangStore()
const authStore = userAuthStore()
const router = useRouter()
const route = useRoute()
const user = useCurrentUser()

const daily = dailyStore()
const colorMode = useColorMode();

const onToastFinished = () => {
  if (authStore.uid) {
    const key = `step_hint_seen_${authStore.uid}`
    if (!localStorage.getItem(key)) {
      showStepHint.value = true
      localStorage.setItem(key, 'true')
    }
  }
}

onMounted(async () => {
  initAdmob()
  achStore.initializeProgressTracking()
  if (Capacitor.isNativePlatform()) {
    try {
      await SplashScreen.hide({ fadeOutDuration: 0 });
    } catch (e) {
      console.error(e);
    }
    App.addListener('backButton', ({ canGoBack }) => {
      const state = window.history.state || {}
      const isModalOpen = !!(state.isMapPanelOpen || state.isSubCategory || state.isSubScreen)
      const purePath = route.path.replace(/^\/(ru|ar|en)/, '')
      const isHomePage = purePath === '/' || purePath === ''

      if (isModalOpen || !isHomePage) {
        window.history.back()
      } else {
        App.minimizeApp()
      }
    })

    Keyboard.addListener('keyboardWillShow', () => {
      setTimeout(() => {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
    });
  }

  setTimeout(() => {
    if (!achStore.showPopup && !showStepHint.value) {
      onToastFinished()
    }
  }, 2600)
})

onUnmounted(() => {
  daily.stop()
})

watch(() => authStore.initialized, (isReady) => {
  if (isReady) {
    learningStore.loadFromFirebase().catch(err => {
      console.error(err);
    });
  }
}, { immediate: true });

watch(() => authStore.uid, (newUid) => {
  if (newUid) {
    billingStore.initialize();
    questStore.loadDailyProgress();
    cardStore.loadCreatedCount();
    statsStore.loadLocalStats();
    chainStore.loadProgressFromFirebase();
    daily.init();
    daily.start();
  }
}, { immediate: true });

watch(user, (currentUser, prevUser) => {
  if (prevUser && !currentUser) {
    router.push('/')
  } else if (currentUser && typeof route.query.redirect === 'string') {
    router.push(route.query.redirect)
  }
})

watch(() => colorMode.value, async (newTheme) => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await StatusBar.setStyle({
      style: newTheme === 'dark' ? Style.Dark : Style.Light
    });
    await StatusBar.setOverlaysWebView({ overlay: true });
  } catch (err) {
  }
}, { immediate: true });

</script>

<style>

.v-onboarding,
.v-onboarding__overlay {
  pointer-events: none !important;
}

.v-onboarding__step {
  pointer-events: auto !important;
}

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Nunito", sans-serif;
}

:root {
  --sat: env(safe-area-inset-top, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
}

html, body, #__nuxt {
  height: 100% !important;
  width: 100% !important;
  max-width: 1240px;
  margin: 0 auto !important;
  padding: 0 !important;
  overflow: hidden !important;
  background-color: var(--bg);
  overscroll-behavior-x: none;
}
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 1240px;
  padding-top: var(--sat);
  padding-bottom: var(--sab);
  box-sizing: border-box;
  overflow: hidden;
}

#main-content {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>