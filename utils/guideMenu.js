// Меню ёжика-гида: вопрос → варианты → места.
// У пункта либо children (следующий вопрос), либо места: links — страницы учебника, lands — задания на карте
// (ёжик показывает их двумя отдельными группами). Все id — из utils/guideCatalog.js.
// Подпись пункта — labelKey, если задан, иначе hedgehogGuide.menu.<id>; color — цвет плитки и иконок.
import { guideCatalog } from './guideCatalog.js'

const landsOf = group => guideCatalog.filter(item => item.group === group).map(item => item.id)

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
        id: 'map', icon: '🗺️', color: '#00897b',
        children: [
            { id: 'mapBeginner', icon: '🌱', color: '#7cb342', lands: landsOf('beginner') },
            { id: 'mapElementary', icon: '⛰️', color: '#00897b', lands: landsOf('elementary') },
            { id: 'mapIntermediate', icon: '🏰', color: '#5e35b1', lands: landsOf('intermediate') }
        ]
    },
    {
        // как вкладка «Грамматика» на странице обучения (pages/study.vue)
        id: 'grammar', icon: '🧩', color: '#3949ab',
        children: [
            {
                id: 'gArticles', labelKey: 'sub.articles', icon: '🔤', color: '#3949ab',
                links: ['article-basic', 'article-theory'],
                lands: ['land-definite-indefinite', 'land-edge-images', 'land-secret-lands']
            },
            {
                id: 'gVerbs', labelKey: 'sub.verbs', icon: '⏳', color: '#f4511e',
                links: ['verbs-theory', 'verb-forms', 'tenses', 'modal-verbs', 'verb-types'],
                lands: ['land-future-land', 'land-past-land', 'land-past-simple', 'land-time-gate', 'land-order-valley', 'land-requests-land']
            },
            {
                id: 'gPrepositions', labelKey: 'sub.prepositions', icon: '📍', color: '#e53935',
                links: ['prepositions-theory', 'prepositions'],
                lands: ['land-place-prepositions', 'land-direction-prepositions', 'land-action-prepositions', 'land-action-valley']
            },
            {
                id: 'gAdjectives', labelKey: 'sub.adjectives', icon: '🎨', color: '#d81b60',
                links: ['adjectives-theory', 'adjective-basics', 'adjective-declension', 'adjective-comparison'],
                lands: ['land-edge-images', 'land-secret-lands', 'land-definite-indefinite']
            },
            {
                id: 'gIdioms', labelKey: 'sub.idioms', icon: '💬', color: '#8e24aa',
                links: ['idioms']
            }
        ]
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
