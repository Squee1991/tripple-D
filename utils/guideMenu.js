// Меню ёжика-гида: вопрос → варианты → места.
// У пункта либо children (следующий вопрос), либо места: links — страницы учебника, lands — задания на карте.
// Земли ёжик сам делит на группы по уровню (A1 / A2 / B1), а у пунктов карты (byCategory) по разделам карты.
// Все id — из utils/guideCatalog.js. Подпись пункта — labelKey, если задан, иначе hedgehogGuide.menu.<id>;
// у пункта с level подпись «B1 · Средний». color — цвет плитки и иконок.
import { guideCatalog } from './guideCatalog.js'
import { LEVEL_CATEGORIES } from './germanLevel.js'

const landsOf = group => guideCatalog.filter(item => item.group === group).map(item => item.id)
const landsOfLevel = level => LEVEL_CATEGORIES[level].flatMap(landsOf)
const lands = (...ids) => ids.map(id => 'land-' + id)

export const LEVEL_COLORS = { A1: '#22c55e', A2: '#3b82f6', B1: '#8b5cf6' }

export const guideMenu = [
    {
        id: 'words', icon: '📚', color: '#43a047',
        links: ['articles', 'thematic-learning', 'adjective-basics'],
        lands: landsOf('beginner')
    },
    {
        id: 'speak', icon: '🗣️', color: '#f4511e',
        links: ['speak-practice', 'image-description']
    },
    {
        id: 'listen', icon: '🎧', color: '#039be5',
        links: ['audio-tasks']
    },
    {
        id: 'read', icon: '📖', color: '#8e24aa',
        links: ['text-tasks']
    },
    {
        // карта по уровням, внутри уровня земли разбиты по разделам карты
        id: 'map', icon: '🗺️', color: '#00897b',
        children: [
            { id: 'mapA1', level: 'A1', icon: '🌱', color: LEVEL_COLORS.A1, byCategory: true, lands: landsOfLevel('A1') },
            { id: 'mapA2', level: 'A2', icon: '⛰️', color: LEVEL_COLORS.A2, byCategory: true, lands: landsOfLevel('A2') },
            { id: 'mapB1', level: 'B1', icon: '🏔️', color: LEVEL_COLORS.B1, byCategory: true, lands: landsOfLevel('B1') }
        ]
    },
    {
        // как вкладка «Грамматика» на странице обучения (pages/study.vue) + земли всех уровней по темам
        id: 'grammar', icon: '🧩', color: '#3949ab',
        children: [
            {
                id: 'gArticles', labelKey: 'sub.articles', icon: '🔤', color: '#3949ab',
                links: ['article-basic', 'article-theory'],
                lands: lands('family-tree', 'market-square', 'definite-indefinite', 'edge-images', 'secret-lands', 'choice-crossing', 'nobody-village', 'owner-castle', 'hero-square')
            },
            {
                id: 'gVerbs', labelKey: 'sub.verbs', icon: '⏳', color: '#f4511e',
                links: ['verbs-theory', 'verb-forms', 'tenses', 'modal-verbs', 'verb-types'],
                lands: lands(
                    'change-river', 'routine-mill', 'power-pass', 'hearty-inn', 'dress-bazaar', 'healer-hut', 'meet-meadow', 'future-land', 'past-land', 'time-gate', 'order-valley',
                    'past-simple', 'requests-land', 'advice-garden',
                    'story-valley', 'memory-lake', 'craft-valley', 'task-tower', 'decision-workshop', 'wish-island', 'regret-river'
                )
            },
            {
                id: 'gPrepositions', labelKey: 'sub.prepositions', icon: '📍', color: '#e53935',
                links: ['prepositions-theory', 'prepositions'],
                lands: lands('clock-tower', 'action-valley', 'time-road', 'place-prepositions', 'direction-prepositions', 'action-prepositions', 'question-bridge')
            },
            {
                id: 'gAdjectives', labelKey: 'sub.adjectives', icon: '🎨', color: '#d81b60',
                links: ['adjectives-theory', 'adjective-basics', 'adjective-declension', 'adjective-comparison'],
                lands: lands('edge-images', 'secret-lands', 'definite-indefinite', 'calendar-valley', 'comparison-hills', 'taste-market')
            },
            {
                // weil/obwohl, um … zu, относительные придаточные, двойные союзы, мнение
                id: 'gSentences', icon: '🔗', color: '#00897b',
                lands: lands('question-gorge', 'reason-bridge', 'purpose-path', 'consequence-fork', 'neighbor-street', 'link-harbor', 'nuance-bridge', 'word-forge', 'opinion-tower')
            },
            {
                id: 'gIdioms', labelKey: 'sub.idioms', icon: '💬', color: '#8e24aa',
                links: ['idioms']
            }
        ]
    },
    {
        id: 'test', icon: '🎓', color: '#f9a825',
        links: ['exams']
    },
    {
        id: 'play', icon: '🎮', color: '#d81b60',
        links: ['german-universe', 'sentence-duel', 'guess-word', 'article-marathon', 'recipes']
    },
    {
        // список событий с датами строится из store/eventsStore.js
        id: 'events', icon: '🎉', color: '#ff7043',
        events: true
    }
]
