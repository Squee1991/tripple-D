
import { defineNuxtPlugin } from '#app'
import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

export default defineNuxtPlugin(async (nuxtApp) => {
    try {
        let savedLocale = null
        if (Capacitor.isNativePlatform()) {
            const { value } = await Preferences.get({ key: 'user_locale' })
            savedLocale = value
        } else {
            savedLocale = localStorage.getItem('user_locale')
        }
        if (savedLocale) {
            await nuxtApp.$i18n.setLocale(savedLocale)
        }
    } catch (e) {
        console.error('Ошибка плагина языка:', e)
    }
})