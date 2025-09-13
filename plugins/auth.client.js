import { userAuthStore } from '../store/authStore.js';
export default defineNuxtPlugin(async () => {
	const authStore = userAuthStore()
	await authStore.initAuth()
})
