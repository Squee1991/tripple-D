<template>
	<NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
</template>

<script setup>
	import {useCurrentUser} from "vuefire";
	import { userlangStore } from './store/learningStore.js'
	import { userAuthStore } from './store/authStore.js'
	import {onMounted} from "vue";
    const  learningStore = userlangStore()
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

</script>


<style>
	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;

	}
</style>