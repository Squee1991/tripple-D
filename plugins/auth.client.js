import { userAuthStore } from '../store/authStore.js';

export default defineNuxtPlugin(async (nuxtApp) => {
	const authStore = userAuthStore();
	try {
		authStore.fetchuser();
	} catch (error) {

	}
});