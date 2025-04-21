export default defineNuxtConfig({
    ssr: false,
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    modules: [
        '@pinia/nuxt',
        'nuxt-vuefire'
    ],
    vuefire: {
        config: {
            apiKey: "AIzaSyClEXgfnzOXXECQTtNaZ9dl2HKDQjObAAc",
            authDomain: "tripple-d.firebaseapp.com",
            projectId: "tripple-d-457316",
            storageBucket: "tripple-d.appspot.com",
            messagingSenderId: "232501751388",
            appId: "1:232501751388:web:abcdef123456"
        },
        auth: {
            enabled: true,
            sessionCookie: false,
            popupRedirectResolver: false,
            persistence: ['indexedDBLocal'],
            errorMap: 'debug',
        }
    }
})
