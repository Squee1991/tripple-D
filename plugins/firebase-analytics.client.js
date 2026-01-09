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
	if (process.client) {
		document.body.addEventListener('click', (event) => {
			const bannerBtn = event.target.closest('.banner__button')
			const loginBtn = event.target.closest('.btn-login')
			const coffeeBtn = event.target.closest('.coffee')
			const regionsBtn = event.target.closest('.map-btn')
			const testBtn = event.target.closest('#test')
			const achievementBtn = event.target.closest('#achievement')
			const calendarBtn = event.target.closest('#calendar')
			const gameNavBtn = event.target.closest('#duel')
			const learnNavBtn = event.target.closest('#learn')
			if (learnNavBtn) {
				logEvent(analytics , 'learnNav__button_click')
			}
			if (gameNavBtn) {
				logEvent(analytics , 'gameNav__button_click')
			}
			if (calendarBtn) {
				logEvent(analytics , 'calendar__button_click')
			}
			if (achievementBtn) {
				logEvent(analytics , 'achievement__button_click')
			}
			if (regionsBtn) {
				logEvent(analytics, 'regions__button_click')
			}
			if (coffeeBtn) {
				logEvent(analytics, 'coffee__button_click')
			}
			if (testBtn) {
				logEvent(analytics, 'tests__button_click')
			}
			if (bannerBtn) {
				logEvent(analytics, 'banner_button_click')
			}
			if (loginBtn) {
				logEvent(analytics, 'login_button_click')
			}
		})
	}
	nuxtApp.provide('logEvent', (name, params = {}) => logEvent(analytics, name, params))
})