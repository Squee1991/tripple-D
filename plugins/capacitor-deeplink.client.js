import { App } from '@capacitor/app'

export default defineNuxtPlugin((nuxtApp) => {
	const router = useRouter()
	App.addListener('appUrlOpen', data => {
		if (data.url.includes('skillupgerman.com')) {
			const urlObj = new URL(data.url)
			const pathWithQuery = urlObj.pathname + urlObj.search
			router.push(pathWithQuery)
		}
	})
})