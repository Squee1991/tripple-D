<template>
    <main class="tenses-layout">
        <aside class="tenses-sidebar">
            <NuxtLink to="/" class="sidebar-button-home"> {{t('tenses.barBtn')}}</NuxtLink>
            <h2 class="tenses-sidebar__title">{{t('tenses.times')}}</h2>
            <div v-for="group in tenseGroups" :key="group.level" class="level-group">
                <h3 class="level-group__title">{{ group.level }}</h3>
                <ul class="tense-menu">
                    <li v-for="tense in group.tenses" :key="tense.name" class="tense-menu__item">
                        <a class="tense-menu__link"
                           :class="{ 'tense-menu__link--is-active': selectedTense && selectedTense.name === tense.name }"
                           @click.prevent="selectTense(tense)"
                        >
                            <span class="tense-menu__icon">📚</span>
                            <span class="tense-menu__name">{{ tense.name }}</span>
                            <span class="tense-menu__badge">{{ tense.level }}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
        <section class="tenses-content">
            <div v-if="selectedTense" class="content-block">
                <h1 class="content-block__title"> {{t('tenses.time')}}: {{ selectedTense.name }}</h1>
                <div class="tense-module">
                    <div class="tense-module__content">
                        <div class="tense-module__info">
                            <div v-for="block in selectedTense.infoBlocks" :key="block.title" class="info-block">
                                <h4 class="info-block__title">{{ t(block.title) }}</h4>
                                <code v-if="block.type === 'formula'" class="info-block__formula">
                                    {{ t(block.content) }}
                                </code>

                                <ul v-else-if="block.type === 'rules'" class="info-block__rules">
                                    <li v-for="rule in block.content" :key="rule">{{ t(rule) }}</li>
                                </ul>
                                <ul v-else-if="block.type === 'examples'" class="example-list">
                                    <li v-for="example in block.content" :key="example.sentence" class="example-item">
                                        <p class="example-item__sentence" v-html="t(example.sentence)"></p>
                                        <p class="example-item__translation">{{ t(example.translation) }}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="tense-module__practice">
                            <div class="practice-list">
                                <div v-for="drill in selectedTense.drills" :key="drill.title"
                                    class="practice-list__item">
<!--                                    <img :src="drill.icon" alt="icon" class="practice-list__icon" />-->
                                    <div class="practice-list__details">
                                        <h4 class="practice-list__title">{{ t(drill.title) }}</h4>
                                        <p class="practice-list__description">{{ t(drill.description) }}</p>
                                    </div>
                                    <NuxtLink :to="drill.url" class="practice-list__button">{{t('tenses.begin')}}</NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="placeholder">
                <p>👈 Выберите время из меню слева.</p>
            </div>
        </section>
    </main>
</template>

<script setup>
    import {ref} from 'vue';
    import ThinkingIcon from '../../assets/images/thinking.svg'
    import Constructor from '../../assets/images/Construktor.svg'
    const { t } = useI18n()
    const tenseGroups = ref([
        {
            level: 'A1 - A2',
            tenses: [
                {
                    name: 'Präsens',
                    level: 'A1',
                    infoBlocks: [
                        {title: 'tenses.howToDo', type: 'formula', content: 'tensesPrasens.howToDo'},
                        {
                            title: 'tenses.howToUse',
                            type: 'rules',
                            content: ['tensesPrasens.howToUseFirst', 'tensesPrasens.howToUseSecond', 'tensesPrasens.howToUseThird']
                        },
                        {
                            title: 'tenses.examples', type: 'examples', content: [
                                {
                                    sentence: 'Ich <b>lerne</b> jeden Tag Deutsch.',
                                    translation: 'tensesPrasens.example'
                                },
                                {sentence: 'Er <b>spielt</b> Fußball.', translation: 'tensesPrasens.exampleTwo'}
                            ]
                        }
                    ],
                    drills: [{
                        icon: '✍️',
                        title: 'tensesPrasens.questTitle',
                        description: 'tensesPrasens.explain',
                        url: '/tenses/prasens'
                    }]
                },
                {
                    name: 'Perfekt',
                    level: 'A2',
                    infoBlocks: [
                        {title: 'tenses.howToDo', type: 'formula', content: 'haben / sein + Partizip II'},
                        {
                            title: 'tenses.howToUse',
                            type: 'rules',
                            content: ['perfect.howToUseFirst', 'perfect.howToUseSecond']
                        },
                        {
                            title: 'tenses.examples', type: 'examples', content: [
                                {
                                    sentence: 'Sie <b>hat</b> ein Buch <b>gelesen</b>.',
                                    translation: 'perfect.example'
                                },
                                {
                                    sentence: 'Wir <b>sind</b> ins Kino <b>gegangen</b>.',
                                    translation: 'perfect.exampleTwo'
                                }
                            ]
                        }
                    ],
                    drills: [
                        {
                            icon: ThinkingIcon,
                            title: 'perfect.choose',
                            description: 'perfect.explain',
                            url: '/tenses/past-auxiliary'
                        },
                        {
                            icon: Constructor,
                            title: 'perfect.chooseTwo',
                            description: 'perfect.explainTwo',
                            url: '/tenses/past-participle'
                        }
                    ]
                },
            ]
        },
        {
            level: 'B1',
            tenses: [
                {
                    name: 'Präteritum',
                    level: 'B1',
                    infoBlocks: [
                        {
                            title: 'tenses.howToDo',
                            type: 'formula',
                            content: 'präteritum.howToDo'
                        },
                        {
                            title: 'tenses.howToUse',
                            type: 'rules',
                            content: ['präteritum.howToUseFirst', 'präteritum.howToUseSecond']
                        },
                        {
                            title: 'tenses.examples', type: 'examples', content: [
                                {
                                    sentence: 'Die Prinzessin <b>lebte</b> in einem Schloss.',
                                    translation: 'präteritum.example'
                                },
                                {
                                    sentence: 'Als Kind <b>las</b> ich sehr gern.',
                                    translation: 'präteritum.exampleTwo'
                                }
                            ]
                        }
                    ],
                    drills: [{
                        icon: '📖',
                        title: 'präteritum.choose',
                        description: 'präteritum.explain',
                        url: '/tenses/prateritum-session'
                    }]
                },
                {
                    name: 'Plusquamperfekt',
                    level: 'B1',
                    infoBlocks: [
                        {
                            title: 'tenses.howToDo',
                            type: 'formula',
                            content: 'hatten / waren + Partizip II'
                        },
                        {
                            title: 'tenses.howToDo',
                            type: 'rules',
                            content: ['pqPerfect.howToUseFirst', 'pqPerfect.howToUseSecond']
                        },
                        {
                            title: 'tenses.examples', type: 'examples', content: [
                                {
                                    sentence: 'Er <b>hatte</b> schon <b>gegessen</b>, als ich ankam.',
                                    translation: 'pqPerfect.example'
                                },
                                {
                                    sentence: 'Nachdem sie die Arbeit <b>beendet hatte</b>, ging sie nach Hause.',
                                    translation: 'pqPerfect.exampleTwo'
                                }
                            ]
                        }
                    ],
                    drills: [{
                        icon: '⏪',
                        title: 'pqPerfect.choose',
                        description: 'pqPerfect.explain',
                        url: '/tenses/plusquamperfekt-session'
                    }]
                },
            ]
        }
    ]);

    const selectedTense = ref(tenseGroups.value[0].tenses[0]);

    function selectTense(tense) {
        selectedTense.value = tense;
    }
</script>

<style scoped>

    .practice-list__item {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .practice-list {
        display: flex;
        flex-direction: column;
        justify-content: space-between;


    }

    .example-item {
        background-color: #f5f5f5;
        border: 2px solid #e0e0e0;
        border-left: 4px solid #ffab00;
        padding: 8px;
        border-radius: 8px;
        margin-bottom: 10px;
    }

    .example-item__sentence {
        font-size: 1.1rem;
        font-weight: 500;
        margin: 0 0 0.5rem 0;
    }

    .example-item__translation {
        font-size: 0.95rem;
        color: #777;
        margin: 0;
        font-style: italic;
    }

    .tenses-layout {
        display: flex;
        gap: 2rem;
        padding: 1rem;
        height: 100vh;
        background-color: #f7f9fc;
    }

    .tenses-sidebar {
        min-width: 350px;
        background-color: #ffffff;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 6px 6px 0px #1e1e1e;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }

    .sidebar-button-home {
        display: block;
        text-align: center;
        width: 100%;
        font-family: 'Fredoka One', cursive;
        padding: 0.8rem;
        margin-bottom: 2rem;
        font-size: 1.2rem;
        border-radius: 12px;
        cursor: pointer;
        background-color: #f1c40f;
        color: #1e1e1e;
        text-decoration: none;
        border: 3px solid #1e1e1e;
        box-shadow: 4px 4px 0px #1e1e1e;
        transition: background-color 0.2s;
    }

    .sidebar-button-home:hover {
        background-color: #ffe04d;
    }

    .tenses-sidebar__title {
        font-family: "Nunito", sans-serif;
        font-size: 1.8rem;
        margin: 0 0 1.5rem 0;
        text-align: center;
    }


    .level-group__title {
        font-size: 1.4rem;
        font-weight: bold;
        text-transform: uppercase;
        color: #60a5fa;
        font-family: "Nunito", sans-serif;
        margin: 0 0 1rem 0.25rem;
    }

    .tense-menu__link {
        display: flex;
        align-items: center;
        padding: 0.9rem 1.1rem;
        margin-bottom: 0.75rem;
        border-radius: 12px;
        cursor: pointer;
        transition: background-color 0.2s;
        border-left: 4px solid transparent;
    }

    .tense-menu__link:hover {
        background-color: #f5f5f5;
    }

    .tense-menu__link--is-active {
        background-color: #4ade80;
        font-weight: bold;
    }

    .tense-menu__name {
        font-size: 1.3rem;
        font-weight: 600;
        flex-grow: 1;
        padding: 10px;
        font-family: "Nunito", sans-serif;
    }

    .tense-menu__badge {
        font-size: 1.2rem;
        font-weight: bold;
        border-radius: 8px;
    }

    .tense-menu__link--is-active .tense-menu__badge {
        color: #1e1e1e;
    }

    .tenses-content {
        background-color: #60a5fa;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        padding: 1rem;
        overflow-y: auto;
        flex: 1;
        box-shadow: 6px 6px 0px #1e1e1e;
    }

    .content-block__title {
        font-family: "Nunito", sans-serif;
        font-size: 2.8rem;
        font-weight: 600;
        color: white;
        background: #f97028;
        padding: 1rem 2rem;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        box-shadow: 8px 8px 0px #1e1e1e;
        margin-bottom: 15px;
    }

    .tense-module {
        background-color: #fff;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        box-shadow: 6px 6px 0px #1e1e1e;
    }

    .tense-module__content {
        display: flex;
        font-family: "Nunito", sans-serif;
    }

    .tense-module__info, .tense-module__practice {
        padding: 2rem;
    }

    .tense-module__info {
        border-right: 3px dashed #e0e0e0;
        width: 50%;
    }

    .info-block {
        margin-bottom: 1rem;
    }

    .info-block__title {
        font-size: 1.7rem;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .info-block__formula {
        font-size: 1.1rem;
        font-family: "Nunito", sans-serif;
    }

    .info-block__rules {
        list-style: none;
        font-size: 1.2rem;
        font-weight: 600;
        color: #333;
    }

    .info-block__rules li {
        padding-left: 2rem;
        position: relative;
        margin-bottom: 5px;
    }

    .info-block__rules li::before {
        content: "✓";
        color: #00c853;
        font-weight: bold;
        font-size: 1.2rem;
        position: absolute;
        left: 0;
    }

    .practice-list__icon {
        max-width: 230px;
        margin-bottom: 10px;
    }

    .practice-list__title {
        font-size: 1.7rem;
        font-weight: bold;
        padding: 0 0 15px 0;
    }

    .practice-list__description {
        font-size: 1rem;
        font-family: "Nunito", sans-serif;
        color: #777;
        margin-bottom: 15px;
    }

    .practice-list__button {
        text-align: center;
        width: 100%;
        border: 3px solid #1e1e1e;
        padding: 15px;
        background: #f1c40f;
        border-radius: 16px;
        cursor: pointer;
        color: #1e1e1e;
        font-size: 1.2rem;
        font-family: "Nunito", sans-serif;
        box-shadow: 4px 4px 0px #1e1e1e;
        transition: all 0.1s ease-in-out;
        margin-bottom: 1.5rem;
    }

    .practice-list__button:hover {
        transform: translate(2px, 2px);
    }

    @media (max-width: 1024px) {
        .tense-module__content {
            display: flex;
            flex-direction: column;
        }

        .tense-module__info,
        .tense-module__practice {
            width: 100%;
            padding: 10px 30px;
        }
    }

</style>