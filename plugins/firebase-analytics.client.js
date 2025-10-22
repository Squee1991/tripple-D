import { initializeApp, getApps } from 'firebase/app'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'
import { firebaseConfig } from '../config/firebaseConfig.js'
export default defineNuxtPlugin(async (nuxtApp) => {

	if (process.env.NODE_ENV !== 'production') return
	const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
	if (!(await isSupported())) return
	const analytics = getAnalytics(app)
	nuxtApp.hook('page:finish', () => {
		logEvent(analytics, 'page_view', {
			page_title: document.title,
			page_location: window.location.href,
			page_path: window.location.pathname
		})
	})

	nuxtApp.provide('logEvent', (name, params = {}) => logEvent(analytics, name, params))
})
