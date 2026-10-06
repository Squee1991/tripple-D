export const STREAK_TIERS = [
    {
        tier: 1,
        minDays: 1,
        colors: {
            fireOuter: ['#ff1100', '#ff7b00', '#ffe600', '#ffffff'],
            fireInner: ['#ff6a00', '#ffffaa', '#ffffff'],
            glow: '#ff5500',
            beamColor: '#ff8800',
            accentColor: '#ff9900',
            bgGlow: 'rgba(28, 8, 4, 0.96)'
        }
    },
    {
        tier: 2,
        minDays: 7,
        colors: {
            fireOuter: ['#4a00e0', '#8e2de2', '#f093fb', '#ffffff'],
            fireInner: ['#b5179e', '#f72585', '#ffffff'],
            glow: '#9b5de5',
            beamColor: '#f72585',
            accentColor: '#e056fd',
            bgGlow: 'rgba(18, 4, 28, 0.96)'
        }
    },
    {
        tier: 3,
        minDays: 30,
        colors: {
            fireOuter: ['#0052d4', '#4364f7', '#6fb1fc', '#ffffff'],
            fireInner: ['#00b4d8', '#90e0ef', '#ffffff'],
            glow: '#0077b6',
            beamColor: '#00b4d8',
            accentColor: '#48cae4',
            bgGlow: 'rgba(2, 12, 30, 0.96)'
        }
    },
    {
        tier: 4,
        minDays: 60,
        colors: {
            fireOuter: ['#007965', '#00af91', '#52de97', '#ffffff'],
            fireInner: ['#10b981', '#6ee7b7', '#ffffff'],
            glow: '#059669',
            beamColor: '#34d399',
            accentColor: '#10b981',
            bgGlow: 'rgba(2, 25, 18, 0.96)'
        }
    },
    {
        tier: 5,
        minDays: 150,
        colors: {
            fireOuter: ['#b45309', '#f59e0b', '#fef08a', '#ffffff'],
            fireInner: ['#fbbf24', '#fef9c3', '#ffffff'],
            glow: '#f59e0b',
            beamColor: '#fde047',
            accentColor: '#facc15',
            bgGlow: 'rgba(30, 22, 2, 0.96)'
        }
    },
    {
        tier: 6,
        minDays: 365,
        colors: {
            fireOuter: ['#0d0221', '#541388', '#00ebc7', '#ffffff'],
            fireInner: ['#00f0ff', '#e0e7ff', '#ffffff'],
            glow: '#00f0ff',
            beamColor: '#00ebc7',
            accentColor: '#7000ff',
            bgGlow: 'rgba(4, 2, 18, 0.98)'
        }
    }
];

export function getStreakTier(days) {
    const count = Math.max(1, Number(days) || 1);
    let matched = STREAK_TIERS[0];
    for (const t of STREAK_TIERS) {
        if (count >= t.minDays) {
            matched = t;
        }
    }
    return matched;
}

export function isTierEvolvingDay(days) {
    return STREAK_TIERS.some(t => t.minDays === days);
}


export const BUTTON_HINTS = [
    'streakButtons.first',
    'streakButtons.second',
    'streakButtons.third',
    'streakButtons.fourth',
    'streakButtons.fifth',
    'streakButtons.sixth',
    'streakButtons.seventh',
    'streakButtons.eighth',
    'streakButtons.ninth',
    'streakButtons.tenth'
];

export const allNames = [
    'calendarWeekDays.monday',
    'calendarWeekDays.tuesday',
    'calendarWeekDays.wednesday',
    'calendarWeekDays.thursday',
    'calendarWeekDays.friday',
    'calendarWeekDays.saturday',
    'calendarWeekDays.sunday'
]

export const CALENDAR_HINTS = [
    'calendarHints.first',
    'calendarHints.second',
    'calendarHints.third',
    'calendarHints.fourth',
    'calendarHints.fifth',
    'calendarHints.sixth',
    'calendarHints.seventh',
    'calendarHints.eighth',
    'calendarHints.ninth',
    'calendarHints.tenth'
];