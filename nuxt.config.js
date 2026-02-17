import {defineNuxtConfig} from 'nuxt/config'
import {loadEnv} from 'vite'

const events = ['halloween', 'joke', 'valentine', 'winter']
const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const env = loadEnv(mode, process.cwd(), '')
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY || env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID || env.FIREBASE_APP_ID,
}

const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
let admin
try {
	admin = serviceAccountJson ? {serviceAccount: JSON.parse(serviceAccountJson)} : undefined
} catch {
	admin = undefined
}

const siteUrl =
	process.env.NUXT_SITE_URL ||
	(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export default defineNuxtConfig({
	experimental: {payloadExtraction: false},
	compatibilityDate: '2024-11-01',
	devtools: {enabled: true},
	modules: [
		'@nuxt/image',
		'@pinia/nuxt',
		'nuxt-vuefire',
		'@nuxtjs/google-fonts',
		'@nuxtjs/i18n',
		'@nuxtjs/color-mode',
		'@nuxtjs/robots',
		'@vite-pwa/nuxt',
	],
	pwa: {
		registerType: 'autoUpdate',

		manifest: {
			name: 'Skillupgerman',
			short_name: 'Skillupgerman',
			description: 'Learn german',
			theme_color: '#0b1020',
			background_color: '#0b1020',
			display: 'standalone',
			start_url: '/',
			scope: '/',
			icons: [
				{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
				{ src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
				{ src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
			]
		},

		workbox: {
			navigateFallback: '/',
			globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
		},

		devOptions: {
			enabled: true,
			type: 'module',
		}
	},

	vuefire: {
		config: firebaseConfig,
		auth: true,
		...(admin ? {admin} : {}),
	},

	runtimeConfig: {
		stripeSecret: process.env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY,
		stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET,
		groqApiKey: process.env.GROQ_API_KEY || env.GROQ_API_KEY,
		ADMIN_UID1: process.env.ADMIN_UID1 || env.ADMIN_UID1,
		ADMIN_UID2: process.env.ADMIN_UID2 || env.ADMIN_UID2,
		public: {
			firebaseApiKey: firebaseConfig.apiKey,
			firebaseAuthDomain: firebaseConfig.authDomain,
			firebaseProjectId: firebaseConfig.projectId,
			firebaseStorageBucket: firebaseConfig.storageBucket,
			firebaseMessagingSenderId: firebaseConfig.messagingSenderId,
			firebaseAppId: firebaseConfig.appId,
			siteUrl,
		},
	},
	app: {
		head: {
			link: [
				{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
				{rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png'},
				{rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png'},
				{rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
				{ rel: 'manifest', href: '/manifest.webmanifest' }
			],
			meta: [
				{property: 'og:image', content: 'https://www.skillupgerman.com/android-chrome-512x512.png'},
				{property: 'og:image:type', content: 'image/png'},
				{property: 'og:image:width', content: '512'},
				{property: 'og:image:height', content: '512'},
				{name: 'twitter:card', content: 'summary_large_image'},
				{name: 'twitter:image', content: 'https://www.skillupgerman.com/android-chrome-512x512.png'},
				{name: 'robots', content: 'max-image-preview:large'}
			]
		}
	},
	// sitemap: {
	// 	siteUrl,
	// 	autoLastmod: true,
	// 	exclude: [
	// 		'/**/success',
	// 		'/**/battle',
	// 		'/**/cabinet',
	// 		'/**/calendar',
	// 		'/**/chat',
	// 		'/**/statistics'
	// 	],
	// },
	robots: {
		rules: process.env.VERCEL_ENV === 'production'
			? [
				{userAgent: '*', allow: '/'},
				{userAgent: '*', disallow: '/*success'},
				{userAgent: '*', disallow: '/*battle'},
				{userAgent: '*', disallow: '/*cabinet'},
				{userAgent: '*', disallow: '/*calendar'},
				{userAgent: '*', disallow: '/*chat'},
				{userAgent: '*', disallow: '/*statistics'}
			]
			: [{userAgent: '*', disallow: '/'}],
		// sitemap: `${siteUrl}/sitemap.xml`,
	},

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
		storageKey: 'nuxt-color-mode',
	},

	i18n: {
		strategy: 'prefix',
		lazy: true,
		langDir: 'locales',
		defaultLocale: 'en',
		locales: [
			{code: 'en', iso: 'en-US', name: 'English', file: 'en-US.json'},
			{code: 'pl', iso: 'pl-PL', name: 'Polski', file: 'pl-PL.json'},
			{code: 'hi', iso: 'hi-IN', name: 'हिन्दी', file: 'hi-IN.json'},
			{code: 'tr', iso: 'tr-TR', name: 'Türkçe', file: 'tr-TR.json'},
			{code: 'ro', iso: 'ro-RO', name: 'Română', file: 'ro-RO.json'},
			{code: 'es', iso: 'es-ES', name: 'Español', file: 'es-ES.json'},
			{code: 'fr', iso: 'fr-FR', name: 'Français', file: 'fr-FR.json'},
			{code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru-RU.json'},
			{code: 'uk', iso: 'uk-UA', name: 'Українська', file: 'uk-UA.json'},
			{code: 'uz', iso: 'uz-UZ', name: 'Oʻzbekcha', file: 'uz-UZ.json'},
			{code: 'ar', iso: 'ar-SA', name: 'العربية', file: 'ar-SA.json'},
		],
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'i18n_redirected',
			alwaysRedirect: false,
			redirectOn: 'root',
			fallbackLocale: 'en',
		},
		bundle: {optimizeTranslationDirective: false},
	},

	plugins: ['~/plugins/simplebar.client.js'],

	googleFonts: {
		families: {'Uncial Antiqua': true, Kurale: true, Fredoka: true, Nunito: true},
	},

	vite: {
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					passes: 2,
					drop_console: true,
					drop_debugger: true,
					pure_funcs: ['console.info', 'console.debug', 'console.warn'],
				},
				mangle: true,
				format: {comments: false},
			},
		},
	},

	nitro: {
		preset: 'vercel',
		prerender: {
			crawlLinks: false,
			routes: ['/'],
			failOnError: false,
		},
		compressPublicAssets: true
	},
	routeRules: {
		'/': {prerender: true},
		'/**': {ssr: false},
	},

})
// import { defineNuxtConfig } from 'nuxt/config'
// import { loadEnv } from 'vite'
// import path from 'path'
// import fs from 'fs'
// const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
// const env = loadEnv(mode, process.cwd(), '')
// const serviceAccountFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || 'service-account-dev.json'
// const serviceAccountPath = path.resolve(process.cwd(), serviceAccountFile)
// if (fs.existsSync(serviceAccountPath)) {
// 	process.env.GOOGLE_APPLICATION_CREDENTIALS = serviceAccountPath
// } else {
// 	console.error(serviceAccountPath)
// }
//
// const firebaseConfig = {
// 	apiKey: process.env.FIREBASE_API_KEY || env.FIREBASE_API_KEY,
// 	authDomain: process.env.FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN,
// 	projectId: process.env.FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID,
// 	storageBucket: process.env.FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET,
// 	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID,
// 	appId: process.env.FIREBASE_APP_ID || env.FIREBASE_APP_ID,
// }
//
// const adminJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
// let admin
// try {
// 	admin = adminJson ? { serviceAccount: JSON.parse(adminJson) } : undefined
// } catch {
// 	admin = undefined
// }
//
//
// const siteUrl = process.env.NUXT_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
// export default defineNuxtConfig({
// 	experimental: { payloadExtraction: false },
// 	compatibilityDate: '2024-11-01',
// 	devtools: { enabled: true },
// 	modules: [
// 		'@nuxt/image',
// 		'@pinia/nuxt',
// 		'nuxt-vuefire',
// 		'@nuxtjs/google-fonts',
// 		'@nuxtjs/i18n',
// 		'@nuxtjs/color-mode',
// 		'@nuxtjs/robots',
// 		'@vite-pwa/nuxt',
// 	],
//
// 	pwa: {
// 		registerType: 'autoUpdate',
//
// 		manifest: {
// 			name: 'Skillupgerman',
// 			short_name: 'Skillupgerman',
// 			description: 'Learn german',
// 			theme_color: '#0b1020',
// 			background_color: '#0b1020',
// 			display: 'standalone',
// 			start_url: '/',
// 			scope: '/',
// 			icons: [
// 				{ src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
// 				{ src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
// 				{ src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
// 			]
// 		},
//
// 		workbox: {
// 			navigateFallback: '/',
// 			globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
// 		},
//
// 		devOptions: {
// 			enabled: true,
// 			type: 'module',
// 		}
// 	},
// 	vuefire: {
// 		config: firebaseConfig,
// 		auth: true,
// 		admin: {
// 			serviceAccountPath: serviceAccountPath,
// 		},
// 	},
// 	runtimeConfig: {
// 		stripeSecret: process.env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY,
// 		stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || env.STRIPE_WEBHOOK_SECRET,
// 		groqApiKey: process.env.GROQ_API_KEY || env.GROQ_API_KEY,
// 		ADMIN_UID1: process.env.ADMIN_UID1 || env.ADMIN_UID1,
// 		ADMIN_UID2: process.env.ADMIN_UID2 || env.ADMIN_UID2,
// 		public: {
// 			firebaseApiKey: firebaseConfig.apiKey,
// 			firebaseAuthDomain: firebaseConfig.authDomain,
// 			firebaseProjectId: firebaseConfig.projectId,
// 			firebaseStorageBucket: firebaseConfig.storageBucket,
// 			firebaseMessagingSenderId: firebaseConfig.messagingSenderId,
// 			firebaseAppId: firebaseConfig.appId,
// 			siteUrl,
// 		},
// 	},
// 	app: {
// 		head: {
// 			link: [
// 				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
// 				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
// 				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
// 				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
// 				{ rel: 'manifest', href: '/manifest.webmanifest' }
// 			],
// 			meta: [
// 				{ property: 'og:image', content: 'https://www.skillupgerman.com/android-chrome-512x512.png' },
// 				{ property: 'og:image:type', content: 'image/png' },
// 				{ property: 'og:image:width', content: '512' },
// 				{ property: 'og:image:height', content: '512' },
// 				{ name: 'twitter:card', content: 'summary_large_image' },
// 				{ name: 'twitter:image', content: 'https://www.skillupgerman.com/android-chrome-512x512.png' },
// 				{ name: 'robots', content: 'max-image-preview:large' }
// 			]
// 		}
// 	},
// 	robots: {
// 		rules: process.env.VERCEL_ENV === 'production'
// 			? [
// 				{ userAgent: '*', allow: '/' },
// 				{ userAgent: '*', disallow: '/*success' },
// 				{ userAgent: '*', disallow: '/*battle' },
// 				{ userAgent: '*', disallow: '/*cabinet' },
// 				{ userAgent: '*', disallow: '/*calendar' },
// 				{ userAgent: '*', disallow: '/*chat' },
// 				{ userAgent: '*', disallow: '/*statistics' }
// 			]
// 			: [{ userAgent: '*', disallow: '/' }],
// 	},
// 	css: [
// 		'simplebar/dist/simplebar.min.css',
// 		'~/assets/styles/simplebar.css',
// 		'~/assets/styles/reset.css',
// 		'~/assets/styles/theme.css',
// 	],
// 	colorMode: {
// 		preference: 'system',
// 		fallback: 'light',
// 		globalName: '__NUXT_COLOR_MODE__',
// 		classSuffix: '',
// 		storage: 'localStorage',
// 		storageKey: 'nuxt-color-mode',
// 	},
// 	i18n: {
// 		strategy: 'prefix',
// 		lazy: true,
// 		langDir: 'locales',
// 		defaultLocale: 'en',
// 		locales: [
// 			{ code: 'en', iso: 'en-US', name: 'English', file: 'en-US.json' },
// 			{ code: 'pl', iso: 'pl-PL', name: 'Polski', file: 'pl-PL.json' },
// 			{ code: 'hi', iso: 'hi-IN', name: 'हिन्दी', file: 'hi-IN.json' },
// 			{ code: 'tr', iso: 'tr-TR', name: 'Türkçe', file: 'tr-TR.json' },
// 			{ code: 'ro', iso: 'ro-RO', name: 'Română', file: 'ro-RO.json' },
// 			{ code: 'es', iso: 'es-ES', name: 'Español', file: 'es-ES.json' },
// 			{ code: 'fr', iso: 'fr-FR', name: 'Français', file: 'fr-FR.json' },
// 			{ code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru-RU.json' },
// 			{ code: 'uk', iso: 'uk-UA', name: 'Українська', file: 'uk-UA.json' },
// 			{ code: 'uz', iso: 'uz-UZ', name: 'Oʻzbekcha', file: 'uz-UZ.json' },
// 			{ code: 'ar', iso: 'ar-SA', name: 'العربية', file: 'ar-SA.json' },
// 		],
// 		detectBrowserLanguage: {
// 			useCookie: true,
// 			cookieKey: 'i18n_redirected',
// 			alwaysRedirect: false,
// 			redirectOn: 'root',
// 			fallbackLocale: 'en',
// 		},
// 		bundle: { optimizeTranslationDirective: false },
// 	},
// 	plugins: ['~/plugins/simplebar.client.js'],
// 	googleFonts: {
// 		families: { 'Uncial Antiqua': true, Kurale: true, Fredoka: true, Nunito: true },
// 	},
// 	vite: {
// 		build: {
// 			minify: 'terser',
// 			terserOptions: {
// 				compress: {
// 					passes: 2,
// 					drop_console: true,
// 					drop_debugger: true,
// 					pure_funcs: ['console.info', 'console.debug', 'console.warn'],
// 				},
// 				mangle: true,
// 				format: { comments: false },
// 			},
// 		},
// 	},
//
// 	nitro: {
// 		preset: 'vercel',
// 		prerender: {
// 			crawlLinks: false,
// 			routes: ['/'],
// 			failOnError: false,
// 		},
// 		compressPublicAssets: true
// 	},
// 	routeRules: {
// 		'/': { prerender: true },
// 		'/**': { ssr: false },
// 	}
// })
