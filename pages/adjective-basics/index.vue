<template>
    <div class="adjective-page" :class="{ 'content-is-active': isContentVisible }">
        <div class="sidebar">
            <button @click="backToMenu" class="btn__back">На главную</button>
            <h2 class="sidebar__title">Уровни A1 - A2</h2>
            <div class="sidebar__heading">Темы</div>
            <ul class="sidebar__list">
                <li
                        v-for="item in topics"
                        :key="item.id"
                        :class="['sidebar__item', { 'sidebar__item--active': topic === item.id }]"
                >
                    <button class="sidebar__button" @click="selectTopic(item.id)">
                        <span>{{ item.title }}</span>
                    </button>
                </li>
            </ul>
        </div>
        <div class="content" v-if="currentTopicData">
            <button v-if="isMobileLayout" class="btn__close" @click="closeContent">×</button>
            <header class="content__header">
                <h1 class="content__title">Прилагательные: {{ currentTopicData.title }}</h1>
            </header>
            <div class="content__body">
                <div class="content__main-column">
                    <section class="info-section">
                        <h3 class="info-section__title">Примеры</h3>
                        <div v-for="(example, index) in currentTopicData.examples" :key="index" class="example">
                            <p class="example__sentence">
                                {{ example.sentence_part1 }}<span
                                    class="example__highlight">{{ example.highlight }}</span>{{ example.sentence_part2
                                }}
                            </p>
                            <span class="example__translation">{{ example.translation }}</span>
                        </div>
                    </section>
                </div>

                <div class="practice-area">
                    <h3 class="practice-area__title">{{ currentTopicData.practice.title }}</h3>
                    <p class="practice-area__description">{{ currentTopicData.practice.description }}</p>
                    <NuxtLink :to="`/${categoryId}/practice/${currentTopicData.id}`" class="practice-area__button">
                        {{ currentTopicData.practice.buttonText }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, computed, onMounted, onUnmounted} from 'vue'
    import {useRouter} from 'vue-router'

    const router = useRouter()
    const categoryId = 'adjective-basics';
    const topic = ref('colors')
    const backToMenu = () => {
        router.push('/')
    }
    const currentTopicData = computed(() => topics.find(t => t.id === topic.value))


    const isContentVisible = ref(false)
    const isMobileLayout = ref(false)

    const checkScreenSize = () => {
        isMobileLayout.value = window.innerWidth <= 767;
        if (!isMobileLayout.value) {
            isContentVisible.value = false;
        }
    }

    const closeContent = () => {
        isContentVisible.value = false;
    }

    const selectTopic = (id) => {
        topic.value = id
        if (isMobileLayout.value) {
            isContentVisible.value = true;
        }
    }

    onMounted(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', checkScreenSize);
    });

    const topics = [
        {
            id: 'colors',
            title: 'Цвета',
            examples: [
                {
                    sentence_part1: 'Die Blume ist ',
                    highlight: 'rot',
                    sentence_part2: '.',
                    translation: 'Цветок — красный.'
                },
                {
                    sentence_part1: 'Der Himmel ist ',
                    highlight: 'blau',
                    sentence_part2: '.',
                    translation: 'Небо — синее.'
                },
                {
                    sentence_part1: 'Das Gras ist ',
                    highlight: 'grün',
                    sentence_part2: '.',
                    translation: 'Трава — зелёная.'
                }
            ],
            practice: {
                title: 'Практика по цветам',
                description: 'Проверьте, как хорошо вы знаете названия цветов на немецком.',
                buttonText: 'Начать практику',
            }
        },
        {
            id: 'appearance',
            title: 'Внешность',
            examples: [
                {
                    sentence_part1: 'Der Mann ist ',
                    highlight: 'groß',
                    sentence_part2: '.',
                    translation: 'Мужчина — высокий.'
                },
                {sentence_part1: 'Das Haus ist ', highlight: 'alt', sentence_part2: '.', translation: 'Дом — старый.'}
            ],
            practice: {
                title: 'Практика по внешности',
                description: 'Опишите людей и предметы, используя правильные прилагательные.',
                buttonText: 'Начать практику',
            }
        },
        {
            id: 'character',
            title: 'Характер',
            examples: [
                {
                    sentence_part1: 'Sie ist sehr ',
                    highlight: 'freundlich',
                    sentence_part2: '.',
                    translation: 'Она очень дружелюбная.'
                },
                {
                    sentence_part1: 'Der Hund ist ',
                    highlight: 'intelligent',
                    sentence_part2: '.',
                    translation: 'Собака — умная.'
                }
            ],
            practice: {
                title: 'Практика по характеру',
                description: 'Подберите прилагательные, которые описывают характер.',
                buttonText: 'Начать практику',
            }
        },
        {
            id: 'feelings',
            title: 'Чувства и Эмоции',
            examples: [
                {
                    sentence_part1: 'Ich bin sehr ',
                    highlight: 'glücklich',
                    sentence_part2: ' heute.',
                    translation: 'Я сегодня очень счастлив.'
                },
                {
                    sentence_part1: 'Warum bist du ',
                    highlight: 'traurig',
                    sentence_part2: '?',
                    translation: 'Почему ты грустный?'
                },
                {
                    sentence_part1: 'Nach der Arbeit ist er immer ',
                    highlight: 'müde',
                    sentence_part2: '.',
                    translation: 'После работы он всегда уставший.'
                }
            ],
            practice: {
                title: 'Практика по чувствам',
                description: 'Опишите, как себя чувствуют люди в разных ситуациях.',
                buttonText: 'Начать практику',
            }
        },
        {
            id: 'dimensions',
            title: 'Размер и Форма',
            examples: [
                {
                    sentence_part1: 'Ein Elefant ist ',
                    highlight: 'groß',
                    sentence_part2: '.',
                    translation: 'Слон — большой.'
                },
                {
                    sentence_part1: 'Eine Maus ist ',
                    highlight: 'klein',
                    sentence_part2: '.',
                    translation: 'Мышь — маленькая.'
                },
                {
                    sentence_part1: 'Der Tisch ist ',
                    highlight: 'rund',
                    sentence_part2: '.',
                    translation: 'Стол — круглый.'
                }
            ],
            practice: {
                title: 'Практика по размерам',
                description: 'Опишите различные предметы, указывая их размер и форму.',
                buttonText: 'Начать практику',
            }
        }
    ]
</script>

<style scoped>

    .adjective-page {
        display: flex;
        width: 100%;
        height: 100vh;
        padding: 20px;
        background: #e0f7fa;
        gap: 20px;
        font-family: 'Comic Sans MS', 'Trebuchet MS', cursive;
    }

    .sidebar {
        min-width: 350px;
        background: #ffffff;
        border: 3px solid black;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 6px 6px 0px #1e1e1e;
        flex-shrink: 0;
    }

    .sidebar__title {
        font-size: 1.5rem;
        font-weight: bold;
        margin: 0 0 10px 0;
        text-align: center;
    }

    .sidebar__heading {
        margin-bottom: 20px;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .sidebar__list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .sidebar__item {
        margin-bottom: 12px;
    }

    .sidebar__button {
        width: 100%;
        text-align: center;
        padding: 12px;
        background: #f0f0f0;
        border: 2px solid #000;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        font-size: 1rem;
        transition: all 0.2s ease-in-out;
        box-shadow: 3px 3px 0px #000;
    }

    .sidebar__button:hover {
        background: #e0e0e0;
    }

    .sidebar__button:active {
        transform: translate(3px, 3px);
        box-shadow: none;
    }

    .sidebar__item--active .sidebar__button {
        color: #fff;
        background: #8bc34a;
    }

    .content {
        border-radius: 15px;
        border: 2px solid black;
        flex-grow: 1;
        background: #fdfdfd;
        padding: 30px;
        overflow-y: auto;
        box-shadow: 6px 6px 0px #1e1e1e;
        display: flex;
        flex-direction: column;
        gap: 20px;
        position: relative;
    }

    .content__header {
        background: #ffcc00;
        border: 3px solid #000;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 5px 5px 0px #000;
    }

    .content__title {
        color: white;
        font-size: 2rem;
        font-weight: bold;
        text-shadow: 2px 2px 0px #000;
    }

    .content__body {
        display: flex;
        flex-grow: 1;
        border: 3px solid black;
        padding: 20px;
        border-radius: 20px;
        box-shadow: 6px 6px 0px #1e1e1e;
        background: #fff;
    }

    .content__main-column {
        width: 50%;
        padding-right: 20px;
        border-right: 3px dashed #cccccc;
    }

    .info-section {
        margin-bottom: 25px;
    }

    .info-section:last-child {
        margin-bottom: 0;
    }

    .info-section__title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 10px;
        color: #333;
        padding: 0 0 20px 0;
    }

    .example {
        background: #fff;
        border: 2px solid #ddd;
        border-left: 6px solid #ffcc00;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 12px;
        font-size: 1.2rem;
    }

    .example__sentence {
        margin: 0;
        font-weight: bold;
    }

    .example__highlight {
        color: #d9534f;
    }

    .example__translation {
        display: block;
        color: #777;
        font-size: 1rem;
        margin-top: 5px;
        font-style: italic;
    }

    .practice-area {
        width: 50%;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .practice-area__title {
        font-size: 1.6rem;
        font-weight: bold;
        margin: 0 0 10px 0;
    }

    .practice-area__description {
        font-size: 1.1rem;
        color: #333;
        margin-bottom: 20px;
        max-width: 400px;
        padding: 10px 0;
    }

    .practice-area__button {
        display: block;
        text-decoration: none;
        background: #28a745;
        color: #fff;
        border: 2px solid #000;
        border-radius: 8px;
        padding: 12px 25px;
        font-size: 1.2rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        box-shadow: 4px 4px 0px #000;
    }

    .practice-area__button:hover {
        background: #218838;
    }

    .practice-area__button:active {
        transform: translate(4px, 4px);
        box-shadow: none;
    }

    .btn__back {
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
        transition: background-color 0.2s;
    }

    .btn__close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        background-color: #f1c40f;
        border: 3px solid #1e1e1e;
        border-radius: 50%;
        font-size: 24px;
        font-weight: bold;
        color: #1e1e1e;
        cursor: pointer;
        z-index: 100;
        display: none;
        justify-content: center;
        align-items: center;
        line-height: 1;
        padding: 0;
    }

    @media (max-width: 1023px) {
        .content__body {
            flex-direction: column;
        }

        .content__main-column,
        .practice-area {
            width: 100%;
            border-right: none;
            padding: 0;
        }

        .content__title {
            font-size: 1.2rem;
        }
    }

    @media (max-width: 767px) {
        .adjective-page {
            position: relative;
            overflow-x: hidden;
            display: block;
            padding: 0;
            gap: 0;
        }

        .sidebar {
            width: 100%;
            height: 100%;
            min-width: unset;
            border-radius: 0;
            box-shadow: none;
            border: none;
        }

        .content {
            position: absolute;
            top: 0;
            left: 100%;
            width: 100%;
            height: 100%;
            z-index: 50;
            transition: transform 0.4s ease-in-out;
            border-radius: 0;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
        }

        .adjective-page.content-is-active .content {
            transform: translateX(-100%);
        }

        .btn__close {
            display: flex;
        }
    }
</style>