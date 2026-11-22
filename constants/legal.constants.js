export const PROJECT_NAME = 'SkillUpGerman'
export const SUPPORT_EMAIL = 'skillupgerman.com@gmail.com'

// Дата последнего обновления политики конфиденциальности и условий использования (YYYY-MM-DD)
export const LEGAL_LAST_UPDATED = '2026-07-30'

export const formatLegalDate = (locale = 'en-US') => {
    const [year, month, day] = LEGAL_LAST_UPDATED.split('-').map(Number)
    return new Date(year, month - 1, day).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
}

// Соцсети в футере главной. Пустой url = иконка видна, но не кликается
export const SOCIAL_LINKS = [
    { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@skillupgerman.com' },
    { id: 'telegram', label: 'Telegram', url: 'https://t.me/skilupgerman1' }
]
