<template>
    <div class="theme-page">
        <div class="theme-page-container">
            <div class="theme__title-wrapper">
                <button class="back-btn" @click="goBack">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z"></path>
                    </svg>
                    {{t('selectedpage.backBtn')}}
                </button>
                <h2 class="theme-title">{{t('selectedpage.title')}}</h2>
                <div class="title-spacer"></div>
            </div>
            <div class="theme-content-area">

                <div class="grid-area-wrapper">
                    <div class="theme__grid-container">
                        <div class="theme-grid">
                            <div
                                    v-for="key in paginatedTopics"
                                    :key="key"
                                    class="theme-card"
                                    :class="{ active: selectedTopic === key }"
                                    @click="selectTopic(key)"
                            >
                                <div class="card-counter">
                                    {{ themeProgress[key]?.total || 0 }}
                                </div>
                                <div class="theme-card-title">{{ t(nameMap[key]) }}</div>
                            </div>
                        </div>
                        <div class="theme-pagination">
                            <button @click="prevPage" :disabled="page === 0">←</button>
                            <button @click="nextPage" :disabled="page === maxPage">→</button>
                        </div>
                    </div>
                </div>
                <div class="learning-modes-container">
                    <Transition name="slide-right" appear>
                        <div v-if="showModesBlock" class="learning-modes-block">
                            <button @click="clearSelectedTopic" class="close-modes-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                          d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275L12 10.6l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275-.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275z"></path>
                                </svg>
                            </button>
                            <div class="learning__modes-wrapper">
                                <div>
                                    <div class="modes-title">
                                        {{t('selectedpage.choiceTitle')}}
                                    </div>
                                    <div class="topic-hint">
                                        {{t('selectedpage.topic')}}: {{ t(nameMap[selectedTopic]) }}
                                    </div>
                                </div>
                                <div class="modes-list">
                                    <label v-for="mode in modes" :key="mode.key" class="checkbox-container">
                                        <input
                                                type="checkbox"
                                                v-model="selectedModes"
                                                :value="mode.key"
                                        />
                                        <span class="checkmark">
                                 <svg viewBox="0 0 24 24">
                                    <polyline points="3 12 10 20 21 4"/>
                                 </svg>
                              </span>
                                        <span class="label-text">{{t(mode.label)}}</span>
                                    </label>
                                </div>
                                <button
                                        class="start-btn"
                                        :disabled="!selectedModes.length"
                                        @click="startLearning"
                                >
                                    {{ t('selectedpage.startBtn')}}
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    // ВАША ЛОГИКА ОСТАЕТСЯ ПОЛНОСТЬЮ БЕЗ ИЗМЕНЕНИЙ
    import {ref, computed, onMounted} from 'vue'
    import {useRouter} from 'vue-router'
    import {userlangStore} from '../store/learningStore.js'
    import Lottie from 'lottie-web'

    const {t} = useI18n()
    import NotFound from '../assets/animation/notFound.json'

    const showModesBlock = ref(false)
    const showNoTopicMessage = ref(true)
    const router = useRouter()
    const store = userlangStore()
    const themeList = ref({})
    const selectedTopic = ref(null)
    const selectedModes = ref([])
    const animationContainer = ref(null)
    const localePath = useLocalePath()
    onMounted(() => {
        if (animationContainer.value) {
            Lottie.loadAnimation({
                container: animationContainer.value,
                loop: false,
                animationData: NotFound
            })
        }
    })

    const clearSelectedTopic = () => {
        showModesBlock.value = false
        setTimeout(() => {
            selectedTopic.value = null
            selectedModes.value = []
            showNoTopicMessage.value = false
        }, 450)

    }

    const goBack = () => {
        router.push('/')
    }

    const page = ref(0)
    const itemsPerPage = 9

    const topicKeys = computed(() => Object.keys(nameMap))

    const maxPage = computed(() =>
        Math.ceil(topicKeys.value.length / itemsPerPage) - 1
    )

    const paginatedTopics = computed(() => {
        const start = page.value * itemsPerPage
        return topicKeys.value.slice(start, start + itemsPerPage)
    })

    const nextPage = () => {
        if (page.value < maxPage.value) page.value++
    }
    const prevPage = () => {
        if (page.value > 0) page.value--
    }

    const nameMap = {
        Furniture: 'nameMap.Furniture',
        Animals: 'nameMap.Animals',
        Clothes: 'nameMap.Clothes',
        Food: 'nameMap.Food',
        Body: 'nameMap.Body',
        Professions: 'nameMap.Professions',
        Transport: 'nameMap.Transport',
        Colors: 'nameMap.Colors',
        Nature: 'nameMap.Nature',
        Home: 'nameMap.Home',
        Zeit: 'nameMap.Zeit',
        City: 'nameMap.City',
        School: 'nameMap.School',
        DaysAndMonths: 'nameMap.DaysAndMonths',
        Toys: 'nameMap.Toys',
        CommonItems: 'nameMap.CommonItems',
        BathroomItems: 'nameMap.BathroomItems',
        Kosmetik: 'nameMap.Kosmetik',
        Familie: 'nameMap.Familie',
        Emotions: 'nameMap.Emotions',
        Werkzeuge: 'nameMap.Werkzeuge',
        Kitchen: 'nameMap.Kitchen',
        Health: 'nameMap.Health',
        Sport: 'nameMap.Sport',
        SportEquipment: 'nameMap.SportEquipment',
        Travel: 'nameMap.Travel',
        Musik: 'nameMap.Musik',
        Amount: 'nameMap.Amount',
        Informatik: 'nameMap.Informatik'
    }

    const modes = [
        {key: 'article', label: 'modes.article'},
        {key: 'letters', label: 'modes.letters'},
        {key: 'wordArticle', label: 'modes.articleWord'},
        {key: 'plural', label: 'modes.plural'},
        {key: 'audio', label: 'modes.audio'}
    ]

    const themeProgress = computed(() => {
        return Object.fromEntries(
            Object.entries(themeList.value).map(([key, words]) => {
                const total = words.length
                const learned = words.filter(word =>
                    store.learnedWords.some(lw => lw.de === word.de && lw.topic === key)
                ).length
                return [key, {learned, total}]
            })
        )
    })

    const selectTopic = (key) => {
        selectedTopic.value = key
        selectedModes.value = []
        showModesBlock.value = true
    }

    const startLearning = async () => {
        const topicWords = (themeList.value[selectedTopic.value] || [])
            .filter(word => {
                const globalWord = store.words.find(
                    w => w.de === word.de && w.topic === selectedTopic.value
                )
                return selectedModes.value.some(
                    mode => !(globalWord?.progress?.[mode] === true)
                )
            })
            .map(w => ({...w, topic: selectedTopic.value}))

        await store.addWordsToGlobal(topicWords)
        await store.setSelectedWords(topicWords)
        await store.setSelectedTopics([selectedTopic.value])
        await store.saveToFirebase()

        const path = localePath({
            name: 'session',
            query: {
                topic: selectedTopic.value,
                mode: selectedModes.value
            }
        })
        router.push(path)

    }


    onMounted(async () => {
        const res = await fetch('/words.json')
        themeList.value = await res.json()
    })
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Nunito:wght@400;700&display=swap');

    .theme-page {
        font-family: 'Nunito', sans-serif;
        background-color: #f0ebe5;
        background-image: repeating-linear-gradient(90deg, #e9e2db, #e9e2db 20px, #f0ebe5 20px, #f0ebe5 40px);
        min-height: 100vh;
        padding: 2rem;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .theme-page-container {
        width: 100%;
        max-width: 1200px;
        height: calc(100vh - 4rem);
        display: flex;
        flex-direction: column;
    }

    .theme__title-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1rem 1rem 1rem;
        border-bottom: 3px dashed #d3c2b2;
        flex-shrink: 0;
    }

    .title-spacer {
        width: 120px;
    }

    .theme-title {
        font-family: 'Caveat', cursive;
        font-size: 3rem;
        color: #5D4037;
        text-align: center;
    }

    .back-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Nunito', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        background: transparent;
        border: 3px solid #d3c2b2;
        color: #6d4c41;
        padding: 0.5rem 1rem;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
        width: 120px;
    }

    .back-btn:hover {
        background: #6d4c41;
        color: #f0ebe5;
        border-color: #6d4c41;
    }

    .theme-content-area {
        display: flex;
        flex-grow: 1;
        overflow: hidden;
        position: relative;
        gap: 1.5rem;
        margin-top: 1rem;
    }

    .grid-area-wrapper {
        flex-grow: 1;
        background: #faf8f2;
        border: 15px solid #6d4c41;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(0, 0, 0, 0.2);
        padding: 1rem;
        display: flex;
        overflow: hidden;
    }

    .theme__grid-container {
        flex-grow: 1;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        overflow-y: auto;
    }

    .theme__grid-container::-webkit-scrollbar {
        width: 12px;
    }

    .theme__grid-container::-webkit-scrollbar-track {
        background: #e9e2db;
        border-radius: 10px;
    }

    .theme__grid-container::-webkit-scrollbar-thumb {
        background-color: #d3c2b2;
        border-radius: 10px;
        border: 3px solid #e9e2db;
    }

    .theme__grid-container::-webkit-scrollbar-thumb:hover {
        background-color: #bca991;
    }

    .theme-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
        flex-grow: 1;
        /* ===== НАЧАЛО ИЗМЕНЕНИЙ: Исправление растягивания ===== */
        justify-content: start;
        align-content: start;
        /* ===== КОНЕЦ ИЗМЕНЕНИЙ ===== */
    }

    .theme-card {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #e9e2db;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        padding: 1.5rem 1rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        position: relative;
    }

    .theme-card:hover, .theme-card.active {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        border-color: #f1c40f;
    }

    .theme-card.active {
        border-width: 3px;
    }

    .card-counter {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 40px;
        height: 40px;
        background-color: #e74c3c;
        color: white;
        border-radius: 50%;
        border: 3px solid #faf8f2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        font-weight: 700;
    }

    .theme-card-title {
        font-family: 'Caveat', cursive;
        font-size: 1.8rem;
        color: #5D4037;
        margin-top: 0.5rem;
    }

    .theme-pagination {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1.5rem;
        flex-shrink: 0;
        padding-bottom: 0.5rem;
    }

    .theme-pagination button {
        font-family: 'Nunito', sans-serif;
        font-weight: 700;
        background: #d3c2b2;
        color: #6d4c41;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .theme-pagination button:hover:not(:disabled) {
        background: #f1c40f;
        color: #5D4037;
    }

    .theme-pagination button:disabled {
        background: #e9e2db;
        color: #d3c2b2;
        cursor: not-allowed;
    }

    /* Правая панель */
    .learning-modes-container {
        position: relative;
        width: 350px;
        flex-shrink: 0;
    }

    .learning-modes-block {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #e9e2db;
        border-radius: 12px;
        border: 3px dashed #d3c2b2;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
    }

    .close-modes-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #d3c2b2;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #6d4c41;
        font-size: 1.5rem;
    }

    .close-modes-btn:hover {
        background: #e74c3c;
        color: white;
    }

    .learning__modes-wrapper {
        padding-top: 2rem;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .modes-title {
        font-family: 'Caveat', cursive;
        font-size: 2.2rem;
        text-align: center;
        color: #5D4037;
    }

    .topic-hint {
        text-align: center;
        color: #6d4c41;
        margin-bottom: 1.5rem;
        font-style: italic;
    }

    .modes-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex-grow: 1;
        overflow-y: auto;
        padding-right: 0.5rem;
    }

    .checkbox-container {
        display: flex;
        align-items: center;
        gap: 14px;
        cursor: pointer;
        user-select: none;
        position: relative;
    }

    .checkbox-container input {
        display: none;
    }

    .checkmark {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid #bca991;
        background: #faf8f2;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        position: relative;
        overflow: visible;
        flex-shrink: 0;
    }

    .checkmark svg {
        position: absolute;
        top: -6px;
        left: -3px;
        width: 34px;
        height: 34px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    .checkmark polyline {
        stroke: #6d4c41;
        stroke-width: 4;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
        stroke-dasharray: 28;
        stroke-dashoffset: 28;
        transition: stroke-dashoffset 0.4s ease;
    }

    .checkbox-container input:checked + .checkmark {
        border-color: #f1c40f;
    }

    .checkbox-container input:checked + .checkmark polyline {
        stroke-dashoffset: 0;
    }

    .checkbox-container input:checked + .checkmark svg {
        opacity: 1;
    }

    .label-text {
        color: #5D4037;
        font-weight: 700;
    }

    .start-btn {
        width: 100%;
        padding: 1rem;
        font-family: 'Caveat', cursive;
        font-size: 1.8rem;
        background-color: transparent;
        border: 3px solid #f1c40f;
        color: #f1c40f;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .start-btn:hover:not(:disabled) {
        background: #f1c40f;
        color: #5D4037;
    }

    .start-btn:disabled {
        border-color: #d3c2b2;
        color: #d3c2b2;
        cursor: not-allowed;
    }

    .slide-right-enter-active,
    .slide-right-leave-active {
        transition: transform 0.45s ease;
    }

    .slide-right-enter-from,
    .slide-right-leave-to {
        transform: translateX(110%);
    }

    @media (max-width: 900px) {
        .theme-page {
            padding: 1rem;
        }

        .theme-page-container {
            height: calc(100vh - 2rem);
        }

        .theme-content-area {
            flex-direction: column;
            gap: 1rem;
        }

        .learning-modes-container {
            width: 100%;
            height: auto;
            flex-shrink: 1;
        }

        .learning-modes-block {
            position: relative;
            border-left: none;
            border-top: 5px solid #d3c2b2;
            padding: 1rem;
        }

        .slide-right-enter-from,
        .slide-right-leave-to {
            transform: translateY(100%);
        }
    }

    @media (max-width: 768px) {
        .theme-title {
            font-size: 2rem;
        }

        .back-btn {
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
            width: auto;
        }

        .title-spacer {
            display: none;
        }

        .theme__title-wrapper {
            justify-content: space-between;
            padding: 0 0.5rem 1rem 0.5rem;
        }

        .theme-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
    }

    @media (max-width: 480px) {
        .theme-grid {
            grid-template-columns: 1fr;
        }
    }
</style>