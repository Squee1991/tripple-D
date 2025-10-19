
import { defineNuxtConfig } from 'nuxt/config'
import { config as loadEnv } from 'dotenv'
if (process.env.ENV_FILE) {
	loadEnv({ path: process.env.ENV_FILE, override: true })
	console.log('[ENV] Loaded from', process.env.ENV_FILE)
} else {
	loadEnv({ override: true })
	console.log('[ENV] Loaded default .env')
}
const isDev = process.env.NODE_ENV === 'development'
console.log('🔥 Firebase Project:', process.env.FIREBASE_PROJECT_ID)
console.log('🌍 Mode:', isDev ? 'DEV' : 'PROD')

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID
}

const siteUrl =
	process.env.NUXT_SITE_URL ||
	(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@nuxt/image', '@pinia/nuxt', 'nuxt-vuefire',
		'@nuxtjs/google-fonts', '@nuxtjs/i18n', '@nuxtjs/color-mode',
		'@nuxtjs/sitemap', '@nuxtjs/robots'
	],
	sitemap: { siteUrl, autoLastmod: true },
	robots: {
		rules: process.env.VERCEL_ENV === 'production'
			? [{ userAgent: '*', allow: '/' }]
			: [{ userAgent: '*', disallow: '/' }],
		sitemap: `${siteUrl}/sitemap.xml`
	},
	css: [
		'simplebar/dist/simplebar.min.css',
		'~/assets/styles/simplebar.css',
		'~/assets/styles/reset.css',
		'~/assets/styles/theme.css'
	],
	colorMode: {
		preference: 'system', fallback: 'light',
		globalName: '__NUXT_COLOR_MODE__', classSuffix: '',
		storage: 'localStorage', storageKey: 'nuxt-color-mode'
	},
	i18n: {
		strategy: 'prefix', lazy: true, langDir: 'locales', defaultLocale: 'en',
		locales: [
			{ code: 'pl', iso: 'pl-PL', name: 'Polski', file: 'pl-PL.json' },
			{ code: 'en', iso: 'en-US', name: 'English', file: 'en-US.json' },
			{ code: 'tr', iso: 'tr-TR', name: 'Türkçe', file: 'tr-TR.json' },
			{ code: 'es', iso: 'es-ES', name: 'Español', file: 'es-ES.json' },
			{ code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru-RU.json' },
			{ code: 'uk', iso: 'uk-UA', name: 'Українська', file: 'uk-UA.json' },
			{ code: 'uz', iso: 'uz-UZ', name: 'Oʻzbekcha', file: 'uz-UZ.json' },
			{ code: 'ar', iso: 'ar-SA', name: 'العربية', file: 'ar-SA.json' }
		],
		detectBrowserLanguage: {
			useCookie: true, cookieKey: 'i18n_redirected',
			alwaysRedirect: false, redirectOn: 'no prefix', fallbackLocale: 'en'
		},
		bundle: { optimizeTranslationDirective: false }
	},
	plugins: ['~/plugins/simplebar.client.js'],
	googleFonts: { families: { 'Uncial Antiqua': true, Kurale: true, Fredoka: true, Nunito: true } },
	vuefire: { config: firebaseConfig, auth: true },
	runtimeConfig: {
		public: {
			firebaseApiKey: firebaseConfig.apiKey,
			firebaseAuthDomain: firebaseConfig.authDomain,
			firebaseProjectId: firebaseConfig.projectId,
			firebaseStorageBucket: firebaseConfig.storageBucket,
			firebaseMessagingSenderId: firebaseConfig.messagingSenderId,
			firebaseAppId: firebaseConfig.appId,
			siteUrl,
			ADMIN_UID1: process.env.ADMIN_UID1,
			ADMIN_UID2: process.env.ADMIN_UID2
		}
	},
	vite: {
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					passes: 2, drop_console: true, drop_debugger: true,
					pure_funcs: ['console.info', 'console.debug', 'console.warn']
				},
				mangle: true,
				format: { comments: false }
			}
		}
	},
	nitro: {
		preset: 'vercel',
		prerender: { routes: ['/', '/en', '/ru', '/uk', '/pl', '/tr', '/uz', '/ar', '/es'] },
		compressPublicAssets: true
	}
})
