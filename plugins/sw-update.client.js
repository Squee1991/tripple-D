export default defineNuxtPlugin(async () => {
	if ('serviceWorker' in navigator) {
		try {
			const registrations = await navigator.serviceWorker.getRegistrations()
			for (const registration of registrations) {
				await registration.update()
			}
		} catch (e) {}
	}
})
