import { initializeApp, getApps } from 'firebase/app'
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics'
import { firebaseConfig } from '../config/firebaseConfig.js'

export default defineNuxtPlugin(async (nuxtApp) => {
	if (process.env.NODE_ENV !== 'production') {
		nuxtApp.provide('track', (name, params) => console.log(`[Dev Track] ${name}`, params))
		return
	}

	const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
	if (!(await isSupported())) return
	const analytics = getAnalytics(app)

	let pageStartTime = Date.now()

	//  Трекинг времени и переходов
	const router = nuxtApp.$router
	if (router) {
		router.afterEach((to, from) => {
			const timeSpentSec = Math.round((Date.now() - pageStartTime) / 1000)
			if (from.path && timeSpentSec > 0) {
				logEvent(analytics, 'screen_time_spent', {
					screen_name: from.path,
					duration_seconds: timeSpentSec
				})
			}
			pageStartTime = Date.now()
			logEvent(analytics, 'screen_view', {
				firebase_screen: to.path,
				page_title: document.title
			})
		})
	}

	if (process.client) {
		//  Трекинг закрытия/сворачивания приложения
		window.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden') {
				const timeSpentSec = Math.round((Date.now() - pageStartTime) / 1000)
				logEvent(analytics, 'app_closed_or_backgrounded', {
					screen_name: window.location.pathname,
					duration_seconds: timeSpentSec
				})
			} else if (document.visibilityState === 'visible') {
				pageStartTime = Date.now()
				logEvent(analytics, 'app_returned_to_foreground', {
					screen_name: window.location.pathname
				})
			}
		})

		// 3. Глобальный перехватчик кликов
		const globalClicks = [
			{ selector: '.banner__button', event: 'banner_button_click' },
			{ selector: '.btn-login', event: 'login_button_click' },
			{ selector: '.map-btn', event: 'regions__button_click' },
			{ selector: '#test', event: 'tests__button_click' },
		]

		document.body.addEventListener('click', (event) => {
			// Сначала ищем наш новый data-track атрибут
			const trackedEl = event.target.closest('[data-track]')
			if (trackedEl) {
				const eventName = trackedEl.getAttribute('data-track')
				logEvent(analytics, eventName, { page_path: window.location.pathname })
				return // Если нашли, отправляем и выходим
			}
			// Если не нашли, проверяем старые классы из массива
			for (const item of globalClicks) {
				if (event.target.closest(item.selector)) {
					logEvent(analytics, item.event, { page_path: window.location.pathname })
					break
				}
			}
		})
	}

	// 4. Метод $track для логики в <script setup> (победы/поражения)
	nuxtApp.provide('track', (name, params = {}) => logEvent(analytics, name, params))
})