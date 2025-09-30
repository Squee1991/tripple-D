<template>
    <NuxtLayout>
        <NuxtPage/>
        <AchievementToast/>
    </NuxtLayout>
</template>

<script setup>
import AchievementToast from './src/components/AchievementToast.vue'
import {useRouter, useRoute} from 'vue-router'
import {useCurrentUser} from "vuefire";
import {userlangStore} from './store/learningStore.js'
import {userAuthStore} from './store/authStore.js'
import {useSentencesStore} from './store/sentencesStore.js';
import {useTrainerStore} from './store/themenProgressStore.js'
import {useQuestStore} from './store/questStore.js'
import {useCardsStore} from './store/cardsStore.js'
import {useLocalStatGameStore} from './store/localSentenceStore.js'
import {onMounted} from "vue";
import {dailyStore} from './store/dailyStore'
import {useHead} from '#imports'
import {computed} from 'vue'
import {useDuelStore} from './store/sentenceDuelStore.js'

const {locale, t} = useI18n()

useHead({
    htmlAttrs: {
        lang: computed(() => locale.value),
        dir: computed(() => 'ltr')
    },
    title: 'German Corner — Учим немецкий легко и интересно в игровой форме',
    meta: [
        {
            name: 'description',
            content: 'German Corner — онлайн-платформа для изучения немецкого языка: грамматика, артикли, времена, упражнения и обучение в игровой форме.'
        },
        {
            name: 'keywords',
            content: 'немецкий язык, артикли, грамматика, учить немецкий онлайн, A1, A2, B1'
        },
        {property: 'og:title', content: 'German Corner — Изучение немецкого языка'},
        {property: 'og:description', content: 'Учи немецкий весело и эффективно с упражнениями и играми!'},
        {property: 'og:type', content: 'website'},
        {property: 'og:image', content: '/images/seo-preview.png'},
        {name: 'google-site-verification', content: 'MLWdpLJXatGGAMkB8ks7yzFKK-K43'}
    ],
    link: [
        {rel: 'icon', type: 'image/png', href: '/favicon.png'},
    ]
})

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
const gameStore = useDuelStore()

onMounted(() => {
    watch(user, (user, prevUser) => {
        if (prevUser && !user) {
            router.push('/')
        } else if (user && typeof route.query.redirect === 'string') {
            router.push(route.query.redirect)
        }
    })
})

onMounted(() => {
    learningStore.loadFromFirebase()
    sentencesStore.loadSentences()
    questStore.loadDailyProgress()
    cardStore.loadCreatedCount()
    statsStore.loadLocalStats()
    gameStore.loadUserAchievements()


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
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;

}

html {
    font-size: 16px;
}
</style>