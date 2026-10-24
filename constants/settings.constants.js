export const RESTRICTIONS_MAP = {
    theme_pink: {
        emoji: '💖',
        keys: ['pinkThemeModal.partOne', 'pinkThemeModal.partTwo', 'pinkThemeModal.partThree']
    },
    theme_orange: {
        emoji: '🎃',
        keys: ['halloweenThemeModal.partOne', 'halloweenThemeModal.partTwo', 'halloweenThemeModal.partThree']
    },
    snow: {
        emoji: '❄️',
        keys: ['cabinet.modalNotAllowEffectFirst', 'cabinet.modalNotAllowEffectSecond', 'cabinet.modalNotAllowEffectThird']
    }
}

export const SERVICE_PATHS_CONFIG = [
    { id: 'attributions', labelKey: 'helpCenter.attributions', path: '/attributions' },
    { id: 'FAQ', labelKey: 'helpCenter.faq', path: '/faq' },
    { id: 'Privacy', labelKey: 'helpCenter.privacy', path: '/privacy' },
    { id: 'terms', labelKey: 'helpCenter.terms', path: '/terms' }
]

export const THEMES_CONFIG = [
    { key: 'light', labelKey: 'themeModal.light' },
    { key: 'dark', labelKey: 'themeModal.dark' },
    { key: 'pink', labelKey: 'themeModal.pink', requiredAch: 'valentineTheme', lockType: 'theme_pink' },
    { key: 'orange', labelKey: 'themeModal.halloween', requiredAch: 'halloweenTheme', lockType: 'theme_orange' }
]

export const SETTINGS_GROUPS_CONFIG = [
    {
        id: 'notifications',
        titleKey: 'settingsGroup.notifications',
        items: [
            { key: 'sound', labelKey: 'cabinetToggle.sound', type: 'toggle' },
            { key: 'ach', labelKey: 'cabinetToggle.ach', type: 'toggle' }
        ]
    },
    {
        id: 'appearance',
        titleKey: 'settingsGroup.appearance',
        items: [
            { key: 'theme', labelKey: 'cabinetToggle.themeBtn', type: 'button' },
            { key: 'snowFall', labelKey: 'cabinetToggle.snowFall', type: 'toggle' },
            { key: 'hedgehogHelper', labelKey: 'cabinetToggle.hedgehogAssistent', type: 'toggle' }
        ]
    },
    {
        id: 'language',
        titleKey: 'settingsGroup.language',
        items: [
            { key: 'lang', labelKey: 'cabinetToggle.language', type: 'button' }
        ]
    }
]