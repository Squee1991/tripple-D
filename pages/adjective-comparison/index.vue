<template>
    <div class="comparison-page">
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
            <button @click="backTo" class="btn__back">На главную</button>
            <h2 class="sidebar__title">Степени сравнения</h2>
            <div class="sidebar__heading">Тип сравнения</div>
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
                            <h3 class="info-section__title">Правило</h3>
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
                        <h3 class="info-section__title">Примеры</h3>
                        <div v-if="currentTopicData.examples">
                            <div v-for="(example, index) in currentTopicData.examples" :key="index" class="example">
                                <div class="example__line">
                                    <p class="example__sentence" v-html="example.sentence"></p>
                                    <button @click="speak(example.sentence)" :disabled="isSpeaking" class="speak-btn">
                                        <img :src="Sound" alt="Произнести" class="speak-btn__icon" />
                                    </button>
                                </div>
                                <span class="example__translation">{{ example.translation }}</span>
                            </div>
                        </div>
                        <div v-if="currentTopicData.specialCases">
                            <div v-for="caseGroup in currentTopicData.specialCases" :key="caseGroup.title" class="special-case-group">
                                <h4 class="special-case-title">{{ caseGroup.title }}</h4>
                                <div v-for="(example, index) in caseGroup.examples" :key="index" class="example">
                                    <div class="example__line">
                                        <p class="example__sentence" v-html="example.sentence"></p>
                                        <button @click="speak(example.sentence)" :disabled="isSpeaking" class="speak-btn">
                                            <img :src="Sound" alt="Произнести" class="speak-btn__icon" />
                                        </button>
                                    </div>
                                    <span class="example__translation">{{ example.translation }}</span>
                                </div>
                            </div>
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
    import { useRouter } from 'vue-router';
    import Lottie from 'lottie-web';
    import TipIcon from '../../assets/animation/info.json';
    import Sound from '../../assets/images/sound.svg';
    import { getSpeechAudio } from '../../utils/googleTTS.js';

    const router = useRouter();
    const categoryId = 'adjective-comparison';

    const isSpeaking = ref(false);
    function speak(htmlText) {
        if (isSpeaking.value) return;
        const plainText = htmlText.replace(/<[^>]*>/g, ' ').replace(/→/g, ', ');

        isSpeaking.value = true;
        getSpeechAudio(plainText);
        setTimeout(() => {
            isSpeaking.value = false;
        }, 2000);
    }

    const topics = [
        {
            id: 'regular-forms',
            title: 'Правильные формы',
            rule: 'Для образования сравнительной степени (Компаратив) добавьте -er. Для превосходной степени (Суперлатив) используйте конструкцию am + прилагательное + -sten.',
            tips: [
                { text: '1. Это базовое правило, оно работает для большинства прилагательных.'},
                { text: '2. Сравнительная степень (Komparativ) используется для сравнения двух предметов: Er ist schneller als ich (Он быстрее, чем я).'},
                { text: '3. Превосходная степень (Superlativ) с "am" используется после глагола: Er läuft am schnellsten (Он бегает быстрее всех).'},
                { text: '4. Если прилагательное стоит перед существительным, используется другая форма: der schnellste Mann (самый быстрый мужчина).'}
            ],
            examples: [
                { sentence: 'schnell → <b>schneller</b> → <b>am schnellsten</b>', translation: 'быстрый → быстрее → самый быстрый' },
                { sentence: 'langsam → <b>langsamer</b> → <b>am langsamsten</b>', translation: 'медленный → медленнее → самый медленный' },
                { sentence: 'billig → <b>billiger</b> → <b>am billigsten</b>', translation: 'дешёвый → дешевле → самый дешёвый' }
            ],
            practice: {
                title: 'Практика (правильные формы)',
                description: 'Образуйте степени сравнения для обычных прилагательных.',
                buttonText: 'Начать практику',
            }
        },
        {
            id: 'umlaut-forms',
            title: 'Формы с умлаутом',
            rule: 'Многие короткие прилагательные с гласными a, o, u в корне получают умлаут (ä, ö, ü) в сравнительной и превосходной степенях.',
            tips: [
                { text: '1. Это правило касается в основном односложных прилагательных.'},
                { text: '2. Запомните основные: alt, groß, jung, kalt, warm, lang, kurz.'},
                { text: '3. Умлаут делает произношение более плавным.'},
                { text: '4. Прилагательное gesund (здоровый) тоже следует этому правилу: gesund → gesünder → am gesündesten.'}
            ],
            examples: [
                { sentence: 'alt → <b>älter</b> → <b>am ältesten</b>', translation: 'старый → старше → самый старый' },
                { sentence: 'groß → <b>größer</b> → <b>am größten</b>', translation: 'большой → больше → самый большой' },
                { sentence: 'jung → <b>jünger</b> → <b>am jüngsten</b>', translation: 'молодой → моложе → самый молодой' },
                { sentence: 'kalt → <b>kälter</b> → <b>am kältesten</b>', translation: 'холодный → холоднее → самый холодный' }
            ],
            practice: {
                title: 'Практика (формы с умлаутом)',
                description: 'Выберите правильную форму для прилагательных, которые меняют корневую гласную.',
                buttonText: 'Начать практику',
            }
        },
        {
            id: 'irregular-forms',
            title: 'Особые формы',
            rule: 'Некоторые важные прилагательные и наречия имеют уникальные формы сравнения или меняют свою основу. Их нужно запомнить.',
            tips: [
                { text: '1. Эти формы — исключения, их нельзя вывести по правилу, только выучить.'},
                { text: '2. `gut`, `viel` и `gern` — самые важные и часто используемые исключения.'},
                { text: '3. Обратите внимание, как `hoch` и `teuer` теряют гласную в середине для удобства произношения.'}
            ],
            specialCases: [
                {
                    title: 'Полностью неправильные формы',
                    examples: [
                        { sentence: 'gut → <b>besser</b> → <b>am besten</b>', translation: 'хороший → лучше → лучший' },
                        { sentence: 'viel → <b>mehr</b> → <b>am meisten</b>', translation: 'много → больше → наибольший' },
                        { sentence: 'gern → <b>lieber</b> → <b>am liebsten</b>', translation: 'охотно → охотнее → охотнее всего' },
                        { sentence: 'bald → <b>eher</b> → <b>am ehesten</b>', translation: 'скоро → скорее/раньше → скорее всего' }
                    ]
                },
                {
                    title: 'С изменением в корне',
                    examples: [
                        { sentence: 'hoch → <b>höher</b> → <b>am höchsten</b>', translation: 'высокий → выше → самый высокий' },
                        { sentence: 'nah → <b>näher</b> → <b>am nächsten</b>', translation: 'близкий → ближе → ближайший' }
                    ]
                },
                {
                    title: 'С выпадением -e- (на -el, -er)',
                    examples: [
                        { sentence: 'teuer → <b>teurer</b> → <b>am teuersten</b>', translation: 'дорогой → дороже → самый дорогой' },
                        { sentence: 'dunkel → <b>dunkler</b> → <b>am dunkelsten</b>', translation: 'тёмный → темнее → самый тёмный' }
                    ]
                },
                {
                    title: 'С дополнительным -e- в превосходной степени',
                    examples: [
                        { sentence: 'breit → breit<b>er</b> → <b>am breitesten</b>', translation: 'широкий → шире → самый широкий' },
                        { sentence: 'heiß → heiß<b>er</b> → <b>am heißesten</b>', translation: 'горячий → горячее → самый горячий' }
                    ]
                }
            ],
            practice: {
                title: 'Практика (особые формы)',
                description: 'Проверьте, как хорошо вы знаете прилагательные-исключения.',
                buttonText: 'Начать практику',
            }
        }
    ];
    const backTo = () => {
        router.push('/');
    };
    const topic = ref('regular-forms');
    const selectTopic = (id) => (topic.value = id);
    const currentTopicData = computed(() => topics.find(t => t.id === topic.value));
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
                renderer: 'svg',
                loop: false,
                autoplay: true,
                animationData: TipIcon,
            });
            animationInterval = setInterval(() => {
                if (lottieInstance) {
                    lottieInstance.stop();
                    lottieInstance.play();
                }
            }, 10000);
        }
    };

    onMounted(() => { initLottieIcon(); });
    onUnmounted(() => {
        if (animationInterval) clearInterval(animationInterval);
        if (lottieInstance) lottieInstance.destroy();
    });
    watch(currentTopicData, () => { initLottieIcon(); });
</script>

<style scoped>
    .comparison-page {
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
        overflow-y: auto;
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
    .special-case-group {
        margin-bottom: 2rem;
    }
    .special-case-title {
        font-size: 1.2rem;
        font-weight: bold;
        color: #6c757d;
        margin-bottom: 1rem;
        border-bottom: 2px solid #eee;
        padding-bottom: 0.5rem;
    }
    .info__wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .info__icon-tips {
        width: 50px;
        height: 50px;
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

    .example__line {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    .speak-btn {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
    }
    .speak-btn__icon {
        width: 25px;
        height: 50px;
        transition: transform 0.2s;
    }
    .speak-btn:hover .speak-btn__icon {
        transform: scale(1.1);
    }
    .speak-btn:disabled .speak-btn__icon {
        filter: grayscale(1);
        cursor: not-allowed;
    }
</style>