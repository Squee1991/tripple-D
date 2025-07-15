<template>
    <main class="modals-layout">
        <div class="modals-sidebar">
            <NuxtLink to="/" class="sidebar-button-home">На главную</NuxtLink>
            <h2 class="modals-sidebar__title">Уровни</h2>
            <ul class="level-menu">
                <li v-for="group in modalGroups" :key="group.level" class="level-menu__item">
                    <a
                            class="level-menu__link"
                            :class="{ 'level-menu__link--is-active': selectedGroup && selectedGroup.level === group.level }"
                            @click.prevent="selectGroup(group)"
                    >
                        {{ group.level }}
                    </a>
                </li>
            </ul>
        </div>
        <section class="modals-content">
            <div v-if="selectedGroup" class="content-wrapper">
                <h1 class="content-title">Модальные глаголы: {{ selectedGroup.level }}</h1>

                <div class="verb-list-card">
                    <ul class="verb-list">
                        <li v-for="verb in selectedGroup.verbs" :key="verb.name" class="verb-list__item">
                            <div class="verb-list__main">
                                <span class="verb-list__name">{{ verb.name }}</span>
                                <span class="verb-list__translation">{{ verb.translation }}</span>
                            </div>
                            <p class="verb-list__example">
                                <span>Пример:</span> <span v-html="verb.example"></span>
                            </p>
                        </li>
                    </ul>
                </div>
                <NuxtLink :to="selectedGroup.practice.url" class="practice-footer__button">
                    {{ selectedGroup.practice.icon }} {{ selectedGroup.practice.title }}
                </NuxtLink>
            </div>
        </section>
    </main>
</template>

<script setup>
    import {ref} from 'vue';
    const modalGroups = ref([
        {
            level: 'A1 - A2',
            practice: {
                icon: '💪',
                title: 'Начать Практику',
                url: '/modal-verbs/modal-verbs-session'
            },
            verbs: [
                {
                    name: 'können',
                    translation: 'мочь, уметь',
                    example: 'Ich <b>kann</b> gut schwimmen.'
                },
                {
                    name: 'müssen',
                    translation: 'быть должным',
                    example: 'Du <b>musst</b> die Hausaufgaben machen.'
                },
            ]
        },
        {
            level: 'B1',
            practice: {
                icon: '🧠',
                title: 'Начать практику',
                url: '/practice/modals-advanced'
            },
            verbs: [
                {
                    name: 'dürfen',
                    translation: 'иметь разрешение',
                    example: 'Hier <b>darf</b> man nicht rauchen.'
                },
                {
                    name: 'sollen',
                    translation: 'быть должным (совет)',
                    example: 'Der Arzt sagt, ich <b>soll</b> mehr schlafen.'
                }
            ]
        }
    ]);

    const selectedGroup = ref(modalGroups.value[0]);
    function selectGroup(group) {
        selectedGroup.value = group;
    }

</script>

<style scoped>

    .modals-layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 2rem;
        padding: 2rem;
        height: 100vh;
        background-color: #f7f9fc;
    }

    .modals-sidebar {
        background-color: #ffffff;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 6px 6px 0px #1e1e1e;
        overflow-y: auto;
    }

    .sidebar-button-home {
        display: block;
        text-align: center;
        width: 100%;
        font-family: "Nunito", sans-serif;
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
    }

    .sidebar-button-home:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #1e1e1e;
    }

    .modals-sidebar__title {
        font-family: "Nunito", sans-serif;
        font-size: 1.8rem;
        margin: 0 0 1.5rem 0;
        text-align: center;
    }

    .level-menu__link {
        display: block;
        width: 100%;
        font-size: 1.3rem;
        font-weight: 600;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 12px;
        cursor: pointer;
        border: 3px solid #1e1e1e;
        text-align: center;
        transition: all 0.2s;
    }

    .level-menu__link:hover {
        background-color: #f0f0f0;
    }

    .level-menu__link--is-active {
        background-color: #4ade80;
        color: #1e1e1e;
        box-shadow: 4px 4px 0px #1e1e1e;
    }

    .modals-content {
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        padding: 2.5rem;
        overflow-y: auto;
        background-color: #60a5fa;
    }

    .content-title {
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

    .verb-list__item {
        background: #fff;
        padding: 13px;
        border: 3px solid #1e1e1e;
        border-radius: 12px;
        margin-bottom: 1.5rem;
        box-shadow: 5px 5px 0px #1e1e1e;
    }

    .verb-list__main {
        display: flex;
        align-items: baseline;
        gap: 1rem;
        margin-bottom: 10px;
    }

    .verb-list__name {
        font-size: 2rem;
        font-family: "Nunito", sans-serif;
    }

    .verb-list__translation {
        font-size: 1.2rem;
        color: #777;
    }

    .verb-list__example {
        font-size: 1.2rem;
        margin: 0;
        padding: 1rem;
        background-color: #f5f5f5;
        border-radius: 8px;
        border: 2px solid #eee;
    }

    .verb-list__example span {
        font-weight: bold;
        color: #555;
        margin-right: 0.5rem;
    }

    .practice-footer {
        margin-top: 1rem;
    }

    .practice-footer__button {
        display: block;
        text-align: center;
        font-family: "Nunito", sans-serif;
        padding: 1.2rem;
        font-size: 1.5rem;
        border-radius: 16px;
        cursor: pointer;
        background-color: #f1c40f;
        color: #1e1e1e;
        text-decoration: none;
        border: 3px solid #1e1e1e;
        box-shadow: 6px 6px 0px #1e1e1e;
        transition: all 0.1s ease-in-out;
    }

    .practice-footer__button:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #1e1e1e;
    }

    @media (max-width: 1024px) {
        .content-title {
            font-size: 1.5rem;
            padding: 10px;
        }
    }

    @media (max-width: 1024px) {
        .verb-list__main {
            flex-direction: column;
        }
    }
</style>