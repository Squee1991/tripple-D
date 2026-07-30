export default defineNuxtPlugin((nuxtApp) => {
	const router = useRouter()
	router.beforeEach((to) => {
		if (to.fullPath.includes('[object')) {
			console.error('🚀 [NUXT BUG HUNTER]: Попытка кривого перехода!')
			console.log('Куда идем:', to.fullPath)
			console.trace()
			return false
		}
	})
})