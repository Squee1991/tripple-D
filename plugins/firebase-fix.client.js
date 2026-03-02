import { initializeFirestore } from 'firebase/firestore'
import { getApp } from 'firebase/app'

export default defineNuxtPlugin(() => {
	try {
		const fireApp = getApp()
		initializeFirestore(fireApp, {
			experimentalForceLongPolling: true,
		})
	} catch (e) {
	}
})