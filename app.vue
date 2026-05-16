<template>
  <NuxtLayout>
    <NuxtPage/>
    <AchievementToast @toast-finished="onToastFinished" />
    <VLost/>
    <VRankOverlay/>
  </NuxtLayout>
</template>

<script setup>
import VRankOverlay from "./src/components/V-rank-overlay.vue";
import { StatusBar, Style } from '@capacitor/status-bar';
import FeedBack from './src/components/V-feedback.vue'
import VStepHint from "./src/components/V-stephint.vue";
import AchievementToast from './src/components/AchievementToast.vue'
import VLost from './src/components/V-lost.vue'
import { useRouter, useRoute } from 'vue-router'
import { useAchievementStore } from '/store/achievementStore.js'
import { useCurrentUser } from "vuefire";
import { userlangStore } from '/store/learningStore.js'
import { userAuthStore } from '/store/authStore.js'
import { useSentencesStore } from '/store/sentencesStore.js';
import { useTrainerStore } from '/store/themenProgressStore.js'
import { useQuestStore } from '/store/questStore.js'
import { useCardsStore } from '/store/cardsStore.js'
import { useLocalStatGameStore } from '/store/localSentenceStore.js'
import { useBillingStore } from '/store/billingStore.js'
import { userChainStore } from '/store/chainStore.js'
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app'
import { onMounted, onUnmounted, ref, watch } from "vue";
import { dailyStore } from '/store/dailyStore.js'
import { useHead } from '#imports'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen';
const { locale, t } = useI18n()

const billingStore = useBillingStore()

useHead(() => ({
  htmlAttrs: { lang: locale.value, dir: locale.value === 'ar' ? 'rtl' : "ltr" },
  title: () => t('useHeadApp.title'),
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content' },
    { name: 'description', content: t('useHeadApp.content') },
    { property: 'og:title', content: t('useHeadApp.contentThree') },
    { property: 'og:description', content: t('useHeadApp.contentFour') },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/images/' },
    { name: 'google-site-verification', content: 'ZWWugYpS5LJWJG3qLMOgbVhKRPvOSta0G3TXE3HhSqI' }
  ],
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
}))

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
const sentencesStore = useSentencesStore();
const daily = dailyStore()
const colorMode = useColorMode();

onMounted(async () => {
  await authStore.initAuth();
  if (authStore.uid) {
    try {
      await learningStore.loadFromFirebase();
      questStore.loadDailyProgress();
      cardStore.loadCreatedCount();
      statsStore.loadLocalStats();
    } catch (e) {
      console.error("Ошибка загрузки данных пользователя:", e);
    }
  }
  achStore.initializeProgressTracking();
  setTimeout(() => {
    if (!achStore.showPopup && !showStepHint.value) {
      onToastFinished();
    }
  }, 2600);
});

const onToastFinished = () => {
  if (authStore.uid) {
    const key = `step_hint_seen_${authStore.uid}`
    if (!localStorage.getItem(key)) {
      showStepHint.value = true
      localStorage.setItem(key, 'true')
    }
  }
}

watch(user, (currentUser, prevUser) => {
  if (prevUser && !currentUser) {
    router.push('/')
  } else if (currentUser && typeof route.query.redirect === 'string') {
    router.push(route.query.redirect)
  }
})

// Если тебе нужны были нативные плагины, я их аккуратно раскомментировал:
watch(() => authStore.uid, (newUid) => {
  if (newUid) billingStore.initialize()
}, { immediate: true })

watch(() => colorMode.value, async (newTheme) => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await StatusBar.setStyle({
      style: newTheme === 'dark' ? Style.Dark : Style.Light
    });
    await StatusBar.setOverlaysWebView({ overlay: true });
  } catch (err) {
    console.error('StatusBar error:', err);
  }
}, { immediate: true });

onUnmounted(() => {
  daily.stop()
})
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
  margin: 0 !important;
  padding: 0 !important;
  background-color: var(--bg);
}
.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
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