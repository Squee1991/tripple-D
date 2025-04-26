
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
        }
    }

})
