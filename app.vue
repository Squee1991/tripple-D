<template>
	<NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
</template>

<script setup>
	import {useCurrentUser} from "vuefire";
	import { userlangStore } from './store/learningStore.js'
	import { userAuthStore } from './store/authStore.js'
	import { useTrainerStore } from './store/themenProgressStore.js'
	import {onMounted} from "vue";
    const  learningStore = userlangStore()
    const  trainerStore = userlangStore()
	const authStore = userAuthStore()
	const router = useRouter()
	const route = useRoute()
	const user = useCurrentUser()

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

</style>