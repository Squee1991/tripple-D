<template>
    <div class="page-wrapper">
        <div class="progress-table-container">
            <h1 class="main-title">Прогресс по темам</h1>
            <div class="topic-select">
                <select v-model="selectedTopic" :disabled="!allTopics.length">
                    <option disabled value="">— выберите тему —</option>
                    <option
                            v-for="topic in allTopics"
                            :key="topic"
                            :value="topic"
                    >
                        {{ nameMap[topic] || topic }}
                    </option>
                </select>
            </div>

            <div v-if="selectedTopic" class="topic-block">
                <h2 class="topic-title">{{ nameMap[selectedTopic] || selectedTopic }}</h2>
                <div class="word-table">
                    <div class="word-row header">
                        <div class="word-cell word-ru">Слово</div>
                        <div
                                v-for="mode in learningModes"
                                :key="mode.key"
                                class="word-cell mode-label"
                        >
                            {{ mode.label }}
                        </div>
                    </div>

                    <div
                            v-for="word in paginatedWords(selectedTopic)"
                            :key="word.de"
                            class="word-row"
                    >
                        <div class="word-cell word-ru">{{ word.ru }}</div>
                        <div
                                v-for="mode in learningModes"
                                :key="mode.key"
                                class="word-cell status-cell"
                        >
                        <span :title="getTooltip(word.progress?.[mode.key])">
                           {{ getStatusIcon(word.progress?.[mode.key]) }}
                        </span>
                        </div>
                    </div>

                </div>
                <div class="pagination" v-if="filteredWords(selectedTopic).length > wordsPerPage">
                    <button @click="prevPage" :disabled="currentPage === 1">Назад</button>
                    <span>{{ currentPage }} / {{ totalPages(selectedTopic) }}</span>
                    <button @click="nextPage(selectedTopic)" :disabled="currentPage >= totalPages(selectedTopic)">
                        Вперед
                    </button>
                </div>
            </div>
            <div v-else class="placeholder">
                <p>Выберите тему, чтобы увидеть ваш прогресс!</p>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, computed, onMounted, watch} from 'vue'
    import {userlangStore} from '../../store/learningStore.js'
    const store = userlangStore()
    const selectedTopic = ref('')
    const currentPage = ref(1)
    const wordsPerPage = 7
    const nameMap = {
        Furniture: 'Мебель', Animals: 'Животные', Clothes: 'Одежда', Food: 'Еда',
        Body: 'Части тела', Professions: 'Профессии', Transport: 'Транспорт', Colors: 'Цвета',
        Nature: 'Природа', Home: 'Дом', Zeit: 'Время', City: 'Город', School: 'Школа',
        DaysAndMonths: 'Дни и месяцы', Toys: 'Игрушки', CommonItems: 'Общие',
        BathroomItems: 'Вещи для ванной', Kosmetik: 'Косметика', Familie: 'Семья',
        Emotions: 'Эмоции', Werkzeuge: 'Инструменты', Kitchen: 'Кухня', Health: 'Здоровье',
        Sport: 'Спорт', SportEquipment: 'Фитнес-инвентарь'
    }
    const allTopics = computed(() => store.selectedTopics)

    const filteredWords = (topic) => store.words.filter(w => w.topic === topic)
    const paginatedWords = (topic) => {
        const list = filteredWords(topic)
        const start = (currentPage.value - 1) * wordsPerPage
        return list.slice(start, start + wordsPerPage)
    }
    const totalPages = (topic) => Math.ceil(filteredWords(topic).length / wordsPerPage)

    function prevPage() {
        if (currentPage.value > 1) currentPage.value--
    }

    function nextPage(topic) {
        if (currentPage.value < totalPages(topic)) currentPage.value++
    }

    const learningModes = [
        {key: 'article', label: 'Артикль'}, {key: 'letters', label: 'Буквы'},
        {key: 'wordArticle', label: 'Слово + Артикль'}, {key: 'audio', label: 'Аудио'},
        {key: 'plural', label: 'Мн. число'}
    ]

    const getStatusIcon = (status) => {
        if (status === true) return '✅';
        if (status === false) return '❌';
        return '⏳';
    }
    const getTooltip = (status) => {
        if (status === true) return 'Изучено';
        if (status === false) return 'Ошибка';
        return 'Не изучено';
    }

    watch(selectedTopic, () => {
        currentPage.value = 1
    })

    onMounted(async () => {
        await store.loadFromFirebase()
        store.syncSelectedWordsProgress()
    })


</script>

<style scoped>
    .page-wrapper {
        background-color: #fef8e4;
        min-height: 100vh;
        padding: 2rem;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .progress-table-container {
        width: 100%;
        background: #fff;
        border: 3px solid #1e1e1e;
        border-radius: 24px;
        box-shadow: 8px 8px 0 #1e1e1e;
        padding: 2rem;
        font-family: 'Inter', sans-serif;
    }

    .main-title {
        font-family: 'Fredoka One', cursive;
        font-size: 2.5rem;
        text-align: center;
        color: #1e1e1e;
        margin-bottom: 2rem;
    }

    .topic-select {
        margin-bottom: 2rem;
        text-align: center;
    }

    .topic-select select {
        font-family: 'Fredoka One', cursive;
        font-size: 1.2rem;
        padding: 0.75rem 1.5rem;
        border-radius: 16px;
        border: 3px solid #1e1e1e;
        background-color: #f3f4f6;
        box-shadow: 4px 4px 0 #1e1e1e;
        cursor: pointer;
    }

    .topic-title {
        font-family: 'Fredoka One', cursive;
        font-size: 2rem;
        margin-bottom: 1.5rem;
        color: #f97028;
        text-align: center;
    }

    .word-table {
        display: flex;
        flex-direction: column;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        overflow: hidden;
    }

    .word-row {
        display: flex;
        border-bottom: 2px solid #f3f4f6;
    }

    .word-row:last-child {
        border-bottom: none;
    }

    .word-row.header {
        background: #60a5fa;
        color: white;
        font-family: 'Fredoka One', cursive;
    }

    .word-cell {
        flex: 1;
        padding: 0.75rem 1rem;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .word-cell.word-ru {
        flex: 2; /* Делаем колонку со словом шире */
        justify-content: flex-start;
        font-weight: 700;
        font-size: 1.1rem;
    }

    .word-row.header .mode-label {
        font-size: 0.9rem;
    }

    .status-cell {
        font-size: 1.5rem;
    }

    .status-cell span {
        cursor: help; /* Показываем, что можно навести для подсказки */
    }

    .pagination {
        margin-top: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .pagination button {
        font-family: 'Fredoka One', cursive;
        font-size: 1rem;
        padding: 0.5rem 1.5rem;
        border-radius: 12px;
        border: 3px solid #1e1e1e;
        box-shadow: 4px 4px 0 #1e1e1e;
        background-color: #fca13a;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .pagination button:hover:not(:disabled) {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #1e1e1e;
    }

    .pagination button:disabled {
        background: #d1d5db;
        color: #9ca3af;
        box-shadow: 4px 4px 0 #9ca3af;
        cursor: not-allowed;
    }

    .pagination span {
        font-size: 1.2rem;
        font-family: 'Fredoka One', cursive;
        font-weight: 700;
    }

    .placeholder {
        text-align: center;
        padding: 3rem 1rem;
        background-color: #f3f4f6;
        border-radius: 16px;
    }

    .placeholder p {
        font-family: 'Fredoka One', cursive;
        font-size: 1.5rem;
        color: #6b7280;
    }

    /* Анимация для списка слов */
    .list-enter-active,
    .list-leave-active {
        transition: all 0.5s ease;
    }

    .list-enter-from,
    .list-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }
</style>