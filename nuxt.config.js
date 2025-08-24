export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    modules: [
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
        globalName: 'NUXT_COLOR_MODE',
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
            {code: 'tr', iso: 'tr-TR', name: 'Türkçe', file: 'tr-TR.json',}
        ],

        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            alwaysRedirect: false,
            fallbackLocale: 'en'
        },
        bundle: {
            optimizeTranslationDirective: false
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
            apiKey: 'AIzaSyClEXgfnzOXXECQTtNaZ9dl2HKDQjObAAc',
            authDomain: 'tripple-d.firebaseapp.com',
            projectId: 'tripple-d',
            storageBucket: 'tripple-d.appspot.com',
            messagingSenderId: '232501751388',
            appId: '1:232501751388:web:abcdef123456',
        },
        auth: true,
        admin: { enabled: false },
    },
    runtimeConfig: {
        public: {
            firebaseApiKey: 'AIzaSyClEXgfnzOXXECQTtNaZ9dl2HKDQjObAAc',
            firebaseAuthDomain: 'tripple-d.firebaseapp.com',
            firebaseProjectId: 'tripple-d',
            firebaseStorageBucket: 'tripple-d.appspot.com',
            firebaseMessagingSenderId: '232501751388',
            firebaseAppId: '1:232501751388:web:abcdef123456',
            firebaseClientId: 'your-client-id-here',
        }
    },


})