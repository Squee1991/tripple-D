export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: {enabled: true},
	modules: [
		'@nuxt/image',
		'@pinia/nuxt',
		'nuxt-vuefire',
		'@nuxtjs/google-fonts',
		'@nuxtjs/i18n',
		'@nuxtjs/color-mode',
	],
	css: [
		'simplebar/dist/simplebar.min.css',
		'~/assets/styles/simplebar.css',
		'~/assets/styles/reset.css',
		'~/assets/styles/theme.css',
	],
	colorMode: {
		preference: 'system',
		fallback: 'light',
		globalName: '__NUXT_COLOR_MODE__',
		classSuffix: '',
		storage: 'localStorage',
		storageKey: 'nuxt-color-mode'
	},
	i18n: {
		strategy: 'prefix',
		lazy: true,
		langDir: 'locales',
		defaultLocale: 'en',
		locales: [
			{code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru-RU.json'},
			{code: 'uk', iso: 'uk-UA', name: 'Українська', file: 'uk-UA.json'},
			{code: 'en', iso: 'en-US', name: 'English', file: 'en-US.json'},
			{code: 'pl', iso: 'pl-PL', name: 'Polski', file: 'pl-PL.json'},
			{code: 'tr', iso: 'tr-TR', name: 'Türkçe', file: 'tr-TR.json'},
			{code: 'uz', iso: 'uz-UZ', name: 'Oʻzbekcha', file: 'uz-UZ.json'}
		],
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'i18n_redirected',
			alwaysRedirect: false,
			redirectOn: 'no prefix',
			fallbackLocale: 'en'
		}
	},

	plugins: ['~/plugins/simplebar.client.js'],
	googleFonts: {
		families: {
			'Uncial Antiqua': true,
			Kurale: true,
			Fredoka: true,
			Nunito: true
		},
	},
	vuefire: {
		config: {
			apiKey: process.env.FIREBASE_API_KEY,
			authDomain: process.env.FIREBASE_AUTH_DOMAIN,
			projectId: process.env.FIREBASE_PROJECT_ID,
			storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
			messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
			appId: process.env.FIREBASE_APP_ID,
		},
		auth: true
	},
	runtimeConfig: {
		public: {
			firebaseApiKey: process.env.FIREBASE_API_KEY,
			firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
			firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
			firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
			firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
			firebaseAppId: process.env.FIREBASE_APP_ID,
			firebaseClientId: process.env.FIREBASE_CLIENT_ID,
			siteUrl: process.env.SITE_URL || 'https://language-app-beta.vercel.app',
			ADMIN_UID1: process.env.ADMIN_UID1,
			ADMIN_UID2: process.env.ADMIN_UID2,
		}
	},
	vite: {
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					passes: 2,
					drop_console: true,
					drop_debugger: true,
					pure_funcs: ['console.info','console.debug','console.warn'],
				},
				mangle: true,
				format: { comments: false }
			}
		}
	},
	nitro: {
		preset: 'vercel',
		prerender: {
			routes: ['/', '/en', '/ru', '/uk', '/pl', '/tr']
		},
		compressPublicAssets: true
	},
	routeRules: {
		'/': {headers: {'cache-control': 'public, s-maxage=600, stale-while-revalidate=86400'}},
		'/en': {headers: {'cache-control': 'public, s-maxage=600, stale-while-revalidate=86400'}},
		'/ru': {headers: {'cache-control': 'public, s-maxage=600, stale-while-revalidate=86400'}},
		'/uk': {headers: {'cache-control': 'public, s-maxage=600, stale-while-revalidate=86400'}},
		'/pl': {headers: {'cache-control': 'public, s-maxage=600, stale-while-revalidate=86400'}},
		'/tr': {headers: {'cache-control': 'public, s-maxage=600, stale-while-revalidate=86400'}}
	}
})