export const PROJECT_NAME = 'SkillUpGerman'
export const SUPPORT_EMAIL = 'skillupgerman.com@gmail.com'

// Дата последнего обновления политики конфиденциальности и условий использования (YYYY-MM-DD)
export const LEGAL_LAST_UPDATED = '2026-07-30'

export const formatLegalDate = (locale = 'en-US') => {
    const [year, month, day] = LEGAL_LAST_UPDATED.split('-').map(Number)
    return new Date(year, month - 1, day).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
}
