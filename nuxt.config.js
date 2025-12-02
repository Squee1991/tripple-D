
import { defineNuxtConfig } from 'nuxt/config'
import { loadEnv } from 'vite'
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
	admin = serviceAccountJson ? { serviceAccount: JSON.parse(serviceAccountJson) } : undefined
} catch {
	admin = undefined
}

const siteUrl =
	process.env.NUXT_SITE_URL ||
	(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export default defineNuxtConfig({
	experimental: { payloadExtraction: false },
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@nuxt/image',
		'@pinia/nuxt',
		'nuxt-vuefire',
		'@nuxtjs/google-fonts',
		'@nuxtjs/i18n',
		'@nuxtjs/color-mode',
		'@nuxtjs/sitemap',
		'@nuxtjs/robots',
	],

	vuefire: {
		config: firebaseConfig,
		auth: true,
		...(admin ? { admin } : {}),
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
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
			],
			meta: [
				// { name: 'google-site-verification', content: 'fuhqY_1X1Tcpmx_Ab7ol3cx7dfwvZUNQg6t_sdGEezM' },
				{ property: 'og:image', content: 'https://www.skillupgerman.com/android-chrome-512x512.png' },
				{ property: 'og:image:type', content: 'image/png' },
				{ property: 'og:image:width', content: '512' },
				{ property: 'og:image:height', content: '512' },
				{ name: 'twitter:card', content: 'summary_large_image' },
				{ name: 'twitter:image', content: 'https://www.skillupgerman.com/android-chrome-512x512.png' },
				{ name: 'robots', content: 'max-image-preview:large' }
			]
		}
	},
	sitemap: {
		siteUrl,
		autoLastmod: true,
		exclude: [
			'/**/success',
			'/**/battle',
			'/**/cabinet',
			'/**/calendar',
			'/**/chat',
			'/**/statistics'
		],
	},
	robots: {
		rules: process.env.VERCEL_ENV === 'production'
			? [
				{ userAgent: '*', allow: '/' },
				{ userAgent: '*', disallow: '/*success' },
				{ userAgent: '*', disallow: '/*battle' },
				{ userAgent: '*', disallow: '/*cabinet' },
				{ userAgent: '*', disallow: '/*calendar' },
				{ userAgent: '*', disallow: '/*chat' },
				{ userAgent: '*', disallow: '/*statistics' }
			]
			: [{ userAgent: '*', disallow: '/' }],
		sitemap: `${siteUrl}/sitemap.xml`,
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
			{ code: 'pl', iso: 'pl-PL', name: 'Polski', file: 'pl-PL.json' },
			{ code: 'en', iso: 'en-US', name: 'English', file: 'en-US.json' },
			{ code: 'tr', iso: 'tr-TR', name: 'Türkçe', file: 'tr-TR.json' },
			{ code: 'es', iso: 'es-ES', name: 'Español', file: 'es-ES.json' },
			{ code: 'ru', iso: 'ru-RU', name: 'Русский', file: 'ru-RU.json' },
			{ code: 'uk', iso: 'uk-UA', name: 'Українська', file: 'uk-UA.json' },
			{ code: 'uz', iso: 'uz-UZ', name: 'Oʻzbekcha', file: 'uz-UZ.json' },
			{ code: 'ar', iso: 'ar-SA', name: 'العربية', file: 'ar-SA.json' },
		],
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'i18n_redirected',
			alwaysRedirect: false,
			redirectOn: 'root',
			fallbackLocale: 'en',
		},
		bundle: { optimizeTranslationDirective: false },
	},

	plugins: ['~/plugins/simplebar.client.js'],

	googleFonts: {
		families: { 'Uncial Antiqua': true, Kurale: true, Fredoka: true, Nunito: true },
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
				format: { comments: false },
			},
		},
	},

	nitro: {
		preset: 'vercel',
		prerender: {
			crawlLinks: true,
			failOnError: false,
			routes: [
				...['pl','en','tr','es','ru','uk','uz','ar'].flatMap(loc =>
					events.map(ev => `/${loc}/event-${ev}`)
				)
			]
		},
		compressPublicAssets: true
	},
	routeRules: {
		'/': { prerender: true },
		'/ru/**': { prerender: true },
		'/en/**': { prerender: true },
		'/uk/**': { prerender: true },
		'/pl/**': { prerender: true },
		'/tr/**': { prerender: true },
		'/uz/**': { prerender: true },
		'/ar/**': { prerender: true },
		'/es/**': { prerender: true },
		'/api/**': {
			headers: { 'cache-control': 'public, s-maxage=300, stale-while-revalidate=600' }
		},

		'/**/success': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		'/**/battle': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		'/**/cabinet': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		'/**/calendar': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		'/**/chat': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
		'/**/statistics': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
	},
})
