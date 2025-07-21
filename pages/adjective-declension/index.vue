<template>
    <div class="declension-page">
        <div v-if="showTips" class="tips__overlay" @click.self="showTips = false">
            <div class="tips__content">
                <button class="tips__close" @click="showTips = false">×</button>
                <h2 class="tipps__title">Полезные советы:</h2>
                <ul class="tips__list">
                    <li v-for="tip in activeTipps" :key="tip.text" class="tips__item">
                        <div class="tips__text">{{ tip.text }}</div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="sidebar">
            <button @click="backToMenu" class="btn__back">На главную</button>
            <h2 class="sidebar__title">Склонение прилагательных</h2>
            <div class="sidebar__heading">Тип склонения</div>
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
            <header class="content__header">
                <h1 class="content__title">{{ currentTopicData.title }}</h1>
            </header>
            <div class="content__body">
                <div class="content__main-column">
                    <section class="info-section">
                        <div class="info__wrapper">
                            <h3 class="info-section__title">Краткое правило</h3>
                            <div
                                    v-if="currentTopicData.tips"
                                    class="info__icon-tips"
                                    ref="tipRef"
                                    @click="openTips(currentTopicData.tips)"
                            ></div>
                        </div>
                        <p class="info-section__description">
                            {{ currentTopicData.rule }}
                        </p>
                    </section>
                    <section class="info-section">
                        <h3 class="info-section__title">Таблица окончаний</h3>
                        <table class="declension-table">
                            <thead>
                            <tr>
                                <th>Падеж</th>
                                <th>Мужской (m)</th>
                                <th>Женский (f)</th>
                                <th>Средний (n)</th>
                                <th v-if="currentTopicData.tableData[0].pl !== undefined">Множ. (pl)</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="row in currentTopicData.tableData" :key="row.case">
                                <td><strong>{{ row.case }}</strong></td>
                                <td>{{ row.m }}</td>
                                <td>{{ row.f }}</td>
                                <td>{{ row.n }}</td>
                                <td v-if="row.pl !== undefined">{{ row.pl }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </section>
                    <section class="info-section">
                        <h3 class="info-section__title">Примеры</h3>
                        <div v-for="(example, index) in currentTopicData.examples" :key="index" class="example">
                            <p class="example__sentence" v-html="example.sentence"></p>
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
    import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
    import Lottie from 'lottie-web';
    import TipIcon from '../../assets/animation/info.json';
    import { useRouter} from 'vue-router'
    const router = useRouter()
    const categoryId = 'adjective-declension';
    const topic = ref('definite-article');
    const selectTopic = (id) => (topic.value = id);
    const currentTopicData = computed(() => topics.find(t => t.id === topic.value));
    const backToMenu = () => {
        router.push('/')
    }
    const topics = [
        {
            id: 'definite-article',
            title: 'После определённого артикля',
            rule: 'Если перед прилагательным стоит определённый артикль (der, die, das), который уже показывает род и падеж, то прилагательное получает окончание -e или -en.',
            tips: [
                { text: '1. Это «слабое» склонение. Артикль уже всё показал, прилагательное «ленится».' },
                { text: '2. Почти всегда ставь окончание -en. Это самый частый и безопасный вариант.' },
                { text: '3. Исключение: окончание -e ставится только в пяти случаях в единственном числе: в Nominativ (der gute, die gute, das gute) и в Akkusativ для женского и среднего рода (die gute, das gute).' },
                { text: '4. Лайфхак: если форма артикля такая же, как в Nominativ (der, die, das), то окончание -e. Если форма артикля изменилась (den, dem, des), то окончание всегда -en.' }
            ],
            tableData: [
                { case: 'Nominativ', m: '-e', f: '-e', n: '-e', pl: '-en' },
                { case: 'Akkusativ', m: '-en', f: '-e', n: '-e', pl: '-en' },
                { case: 'Dativ', m: '-en', f: '-en', n: '-en', pl: '-en' },
                { case: 'Genitiv', m: '-en', f: '-en', n: '-en', pl: '-en' },
            ],
            examples: [
                { sentence: 'Der <b>gute</b> Mann lacht.', translation: 'Добрый мужчина смеётся.' },
                { sentence: 'Ich sehe den <b>alten</b> Tisch.', translation: 'Я вижу старый стол.' },
                { sentence: 'Wir helfen der <b>jungen</b> Frau.', translation: 'Мы помогаем молодой женщине.' },
                { sentence: 'Die <b>neuen</b> Autos sind teuer.', translation: 'Новые машины дорогие.' },
            ],
            practice: {
                title: 'Практика (опред. артикль)',
                description: 'Проверьте свои знания окончаний после der, die, das.',
                buttonText: 'Начать практику',
            }
        },
        {
            id: 'indefinite-article',
            title: 'После неопределённого артикля',
            rule: 'Если перед прилагательным стоит неопределённый артикль (ein, eine) или притяжательное местоимение (mein, dein), которое не всегда ясно показывает род и падеж, прилагательное "помогает" ему и берёт на себя "сильное" окончание.',
            tips: [
                { text: '1. Это «смешанное» склонение. Сначала проверь, понятен ли род по артиклю.' },
                { text: '2. Если род НЕПОНЯТЕН (Nominativ м.р. и ср.р. → ein Mann, ein Kind), прилагательное получает «сильное» окончание: -er для мужского рода, -es для среднего.' },
                { text: '3. Это также работает для Akkusativ среднего рода (ein Kind).' },
                { text: '4. Во ВСЕХ ОСТАЛЬНЫХ случаях окончания такие же, как в «слабом» склонении (в основном -en).' }
            ],
            tableData: [
                { case: 'Nominativ', m: '-er', f: '-e', n: '-es', pl: '-' },
                { case: 'Akkusativ', m: '-en', f: '-e', n: '-es', pl: '-' },
                { case: 'Dativ', m: '-en', f: '-en', n: '-en', pl: '-' },
                { case: 'Genitiv', m: '-en', f: '-en', n: '-en', pl: '-' },
            ],
            examples: [
                { sentence: 'Ein <b>guter</b> Mann lacht.', translation: 'Один добрый мужчина смеётся.' },
                { sentence: 'Mein <b>kleines</b> Kind spielt.', translation: 'Мой маленький ребёнок играет.' },
                { sentence: 'Ich kaufe einen <b>neuen</b> Computer.', translation: 'Я покупаю новый компьютер.' },
                { sentence: 'Er spricht mit einer <b>netten</b> Person.', translation: 'Он говорит с милым человеком.' },
            ],
            practice: {
                title: 'Практика (неопред. артикль)',
                description: 'Проверьте свои знания окончаний после ein, eine, mein, kein.',
                buttonText: 'Начать практику',
            }
        },
        {
            id: 'no-article',
            title: 'Без артикля',
            rule: 'Если перед прилагательным нет артикля, то оно само должно показать род и падеж. Поэтому оно берёт на себя окончания, похожие на окончания определённых артиклей.',
            tips: [
                { text: '1. Это «сильное» склонение. Прилагательное здесь — главное.' },
                { text: '2. Лайфхак: окончание прилагательного почти всегда такое же, как последняя буква у ОПРЕДЕЛЁННЫХ артиклей (der, die, das...).' },
                { text: '3. Пример: Dativ мужского рода → артикль deM → окончание -em (gutEM Wein).' },
                { text: '4. Пример: Dativ женского рода → артикль deR → окончание -er (mit gutER Laune).' },
                { text: '5. Важное исключение: в Genitiv мужского и среднего рода окончание будет -en (а не -es), чтобы избежать двойного «s».' }
            ],
            tableData: [
                { case: 'Nominativ', m: '-er', f: '-e', n: '-es', pl: '-e' },
                { case: 'Akkusativ', m: '-en', f: '-e', n: '-es', pl: '-e' },
                { case: 'Dativ', m: '-em', f: '-er', n: '-em', pl: '-en' },
                { case: 'Genitiv', m: '-en', f: '-er', n: '-en', pl: '-er' },
            ],
            examples: [
                { sentence: '<b>Guter</b> Wein ist teuer.', translation: 'Хорошее вино - дорогое.' },
                { sentence: 'Ich trinke <b>kaltes</b> Wasser.', translation: 'Я пью холодную воду.' },
                { sentence: '<b>Frische</b> Milch schmeckt gut.', translation: 'Свежее молоко вкусное.' },
                { sentence: 'Wir fahren mit <b>schnellen</b> Autos.', translation: 'Мы едем на быстрых машинах.' },
            ],
            practice: {
                title: 'Практика (без артикля)',
                description: 'Проверьте свои знания окончаний, когда перед прилагательным нет артикля.',
                buttonText: 'Начать практику',
            }
        }
    ]
    const showTips = ref(false);
    const activeTipps = ref([]);
    const tipRef = ref(null);
    let lottieInstance = null;
    let animationInterval = null;
    const openTips = (tipps) => {
        activeTipps.value = tipps;
        showTips.value = true;
    };

    const initLottieIcon = async () => {
        await nextTick();
        if (animationInterval) clearInterval(animationInterval);
        if (lottieInstance) lottieInstance.destroy();

        if (tipRef.value) {
            lottieInstance = Lottie.loadAnimation({
                container: tipRef.value,
                loop: false,
                autoplay: true,
                animationData: TipIcon,
            });

            animationInterval = setInterval(() => {
                if (lottieInstance) {
                    lottieInstance.stop();
                    lottieInstance.play();
                }
            }, 15000);
        }
    };

    onMounted(() => {
        initLottieIcon();
    });

    onUnmounted(() => {
        if (animationInterval) clearInterval(animationInterval);
        if (lottieInstance) lottieInstance.destroy();
    });

    watch(currentTopicData, () => {
        initLottieIcon();
    });

</script>

<style scoped>
    .declension-page {
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
        box-shadow: 6px 6px 0px #1e1e1e;
        display: flex;
        flex-direction: column;
        gap: 20px;
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
        overflow: hidden;
    }
    .content__main-column {
        width: 60%;
        padding-right: 20px;
        border-right: 3px dashed #cccccc;
        overflow-y: auto;
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
        margin-bottom: 15px;
        color: #333;
    }
    .info-section__description {
        font-size: 1.1rem;
        color: #555;
        line-height: 1.6;
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
    }
    .example__translation {
        display: block;
        color: #777;
        font-size: 1rem;
        margin-top: 5px;
        font-style: italic;
    }
    .practice-area {
        width: 40%;
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
    .declension-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 1.1rem;
    }
    .declension-table th, .declension-table td {
        border: 2px solid #000;
        padding: 10px;
        text-align: center;
    }
    .declension-table th {
        background-color: #ffd166;
    }
    .declension-table td {
        background-color: #fff;
    }
    .declension-table td:first-child {
        background-color: #f0f0f0;
    }

    .info__wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    .info__icon-tips {
        width: 60px;
        cursor: pointer;
    }
    .tips__overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.6);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .tips__content {
        position: relative;
        background: white;
        padding: 2rem;
        border-radius: 16px;
        border: 3px solid #1e1e1e;
        box-shadow: 8px 8px 0 #1e1e1e;
        width: 90%;
        max-width: 500px;
    }
    .tips__close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ef476f;
        color: #fff;
        border: 2px solid #1e1e1e;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        padding-bottom: 4px;
    }
    .tipps__title {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
    }
    .tips__list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .tips__item {
        margin-bottom: 1rem;
    }
    .tips__text {
        font-size: 1.1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 5px solid #60a5fa;
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
</style>