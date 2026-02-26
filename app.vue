<template>
  <NuxtLayout>
    <NuxtPage/>
    <AchievementToast @toast-finished="onToastFinished" />
<!--    <VStepHint v-if="showStepHint" @close="showStepHint = false"/>-->
<!--      <FeedBack/>-->
    <VLost/>
<!--    <VRankOverlay/>-->
    <VInstallPwa/>
  </NuxtLayout>
</template>

<script setup>
import VRankOverlay from "./src/components/V-rank-overlay.vue";
import FeedBack from './src/components/V-feedback.vue'
import VStepHint from "./src/components/V-stephint.vue";
import VInstallPwa from "./src/components/V-install-pwa.vue";
import AchievementToast from './src/components/AchievementToast.vue'
import VLost from './src/components/V-lost.vue'
import {useRouter, useRoute} from 'vue-router'
import { useAchievementStore } from './store/achievementStore.js'
import {useCurrentUser} from "vuefire";
import {userlangStore} from './store/learningStore.js'
import {userAuthStore} from './store/authStore.js'
import {useSentencesStore} from './store/sentencesStore.js';
import {useTrainerStore} from './store/themenProgressStore.js'
import {useQuestStore} from './store/questStore.js'
import {useCardsStore} from './store/cardsStore.js'
import {useLocalStatGameStore} from './store/localSentenceStore.js'
import { userChainStore } from './store/chainStore.js'
import {onMounted} from "vue";
import {dailyStore} from './store/dailyStore'
import {computed} from 'vue'
import {useHead} from '#imports'
const { locale, t } = useI18n()
useHead(() => ({
  htmlAttrs: { lang: locale.value, dir: locale.value === 'ar' ? 'rtl' : "ltr" },
  title: () => t('useHeadApp.title'),
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
const langStore = userlangStore()
const daily = dailyStore()

const onToastFinished = () => {
  if (authStore.uid) {
    const key = `step_hint_seen_${authStore.uid}`
    if (!localStorage.getItem(key)) {
      showStepHint.value = true
      localStorage.setItem(key, 'true')
    }
  }
}

onMounted(() => {
  watch(user, (user, prevUser) => {
    if (prevUser && !user) {
      router.push('/')
    } else if (user && typeof route.query.redirect === 'string') {
      router.push(route.query.redirect)
    }
  })
})

onMounted(async () => {
  await learningStore.loadFromFirebase()
  sentencesStore.loadSentences()
  questStore.loadDailyProgress()
  cardStore.loadCreatedCount()
  statsStore.loadLocalStats()
  setTimeout(() => {
    if (!achStore.showPopup && !showStepHint.value) {
      onToastFinished()
    }
  }, 2600)
})

onUnmounted(() => {
  daily.stop()
})

// onMounted(() => {
// 	if (process.client) {
// 		// 1. Отключение правой кнопки мыши
// 		document.addEventListener('contextmenu', function(e) {
// 			e.preventDefault();
// 			console.log('Правая кнопка мыши заблокирована.');
// 		});
//
// 		// 2. Отключение основных горячих клавиш DevTools
// 		document.addEventListener('keydown', function(e) {
// 			// F12
// 			if (e.key === 'F12') {
// 				e.preventDefault();
// 				console.log('F12 заблокирована.');
// 			}
// 			// Ctrl+Shift+I (Windows/Linux) или Cmd+Opt+I (Mac) - Открытие DevTools
// 			if ((e.ctrlKey && e.shiftKey && e.key === 'I') || (e.metaKey && e.altKey && e.key === 'I')) {
// 				e.preventDefault();
// 				console.log('Комбинация Ctrl/Cmd+Shift/Opt+I заблокирована.');
// 			}
// 			// Ctrl+Shift+J (Windows/Linux) или Cmd+Opt+J (Mac) - Открытие консоли
// 			if ((e.ctrlKey && e.shiftKey && e.key === 'J') || (e.metaKey && e.altKey && e.key === 'J')) {
// 				e.preventDefault();
// 				console.log('Комбинация Ctrl/Cmd+Shift+Opt+J заблокирована.');
// 			}
// 			// Ctrl+U (Windows/Linux) или Cmd+U (Mac) - Просмотр исходного кода
// 			if ((e.ctrlKey && e.key === 'U') || (e.metaKey && e.key === 'U')) {
// 				e.preventDefault();
// 				console.log('Комбинация Ctrl/Cmd+U заблокирована.');
// 			}
// 		});
// 	}
// });
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

html {
  font-size: 16px;
}

</style>
