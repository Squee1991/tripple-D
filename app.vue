<template>
	<NuxtLayout>
		<NuxtPage/>
	</NuxtLayout>
</template>

<script setup>
import {useCurrentUser} from "vuefire";

const router = useRouter()
const route = useRoute()
const user = useCurrentUser()
onMounted(() => {
	watch(user, (user, prevUser) => {
		if (prevUser && !user) {
			// user logged out
			router.push('/login')
		} else if (user && typeof route.query.redirect === 'string') {
			// user logged in
			router.push(route.query.redirect)
		}
	})
})

</script>


<style>
	*{
		padding: 0;
		margin: 0;

	}
</style>