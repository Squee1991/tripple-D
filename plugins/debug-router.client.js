export default defineNuxtPlugin((nuxtApp) => {
	const router = useRouter()
	router.beforeEach((to) => {
		// Если в пути появилось слово [object — значит, кто-то накосячил
		if (to.fullPath.includes('[object')) {
			console.error('🚀 [NUXT BUG HUNTER]: Попытка кривого перехода!')
			console.log('Куда идем:', to.fullPath)
			console.trace() // Это покажет, какая функция вызвала переход
			return false // Останавливаем переход
		}
	})
})