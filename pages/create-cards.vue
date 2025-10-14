<template>
    <div class="cards-layout">
        <div class="header-bar">
            <NuxtLink to="/" class="back-btn">
                ← {{ t('selectedpage.backBtn') }}
            </NuxtLink>
        </div>
        <div class="cards__wrapper">
            <div class="form-block">
                <h2 class="title">{{ editingCardId ? 'Редактирование' : t('choiceTheme.create') }}</h2>
                <form @submit.prevent="saveCard" class="form">
                    <div class="custom-topic-list">
                        <div class="custom-topic-label">{{ t('choiceTheme.theme')}}</div>
                        <div class="custom-select" tabindex="0" @blur="open = false">
                            <div class="custom-select__trigger" @click="toggle" :class="{ open }">
                                <span>{{ form.topic ? t(themenMap[form.topic]) : t('choiceTheme.choice') }}</span>
                                <img :class="{ open }" class="arrow" src="../assets/images/arrowNav.svg" alt="arrow">
                            </div>
                            <div v-if="open" class="custom-select__dropdown">
                                <div
                                        v-for="(name, key) in themenMap"
                                        :key="key"
                                        class="custom-select__option"
                                        :class="{ selected: form.topic === key }"
                                        @click="select(key)"
                                >
                                    {{ t(name) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <template v-for="field in inputFields" :key="field.key">
                        <template v-if="field.type === 'textarea'">
                            <textarea v-model="form[field.key]" :placeholder="t(field.placeholder)"
                                      :required="field.required" :rows="field.rows || 3" class="input input__area"/>
                        </template>
                        <template v-else>
                            <input v-model="form[field.key]" :type="field.type" :placeholder="t(field.placeholder)"
                                   :required="field.required" :min="field.min" :max="field.max" class="input"/>
                        </template>
                    </template>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">{{ editingCardId ? 'Сохранить' :
                            t('choiceTheme.btn')}}
                        </button>
                        <button v-if="editingCardId" type="button" @click="resetForm" class="btn btn-secondary">Отмена
                        </button>
                    </div>
                </form>
            </div>
            <div class="cards-block">
                <h2 class="title cards-title">{{ t('choiceTheme.available')}}</h2>
                <div class="search-bar">
                    <input v-model="searchQuery" class="input search-input" type="text"
                           :placeholder="t('choiceTheme.search')"/>
                    <input v-model="levelFilter" class="input search-level" type="number" min="1" max="10"
                           :placeholder="t('choiceTheme.difficult')"/>
                </div>
                <div class="cards-grid">
                    <div v-for="card in filteredCards" :key="card.id" class="card-scene">
                        <div class="magic-card" :class="{'is-flipped': flippedCardId === card.id}"
                             @click="!isCardFlipped(card.id) && flipCard(card)">
                            <div class="card-face card-front" :class="getTopicColorClass(card.topic)">
                                <div class="card-actions">
                                    <button @click.stop="initiateEdit(card)" class="action-btn edit-btn"
                                            title="Редактировать">✏️
                                    </button>
                                    <button @click.stop="initiateDelete(card)" class="action-btn delete-btn"
                                            title="Удалить">🗑️
                                    </button>
                                </div>
                                <div class="card-content">
                                    <div v-if="card.topic" class="card-topic">{{ t(themenMap[card.topic]) }}</div>
                                </div>
                                <div class="card-footer">
                                    <div v-if="card.level" class="card-level">⚡️ Уровень {{ card.level }}</div>
                                </div>
                            </div>
                            <div class="card-face card-back">
                                <button @click.stop="unflipCard()" class="card-close-btn">×</button>
                                <div class="card-back-content">
                                    <div class="modal-sentence">{{ card.hiddenSentence }}</div>
                                    <form v-if="!guessResult" @submit.prevent="makeGuess" class="guess-form">
                                        <div v-for="(pos, idx) in card.articles" :key="idx" class="guess-field">
                                            <input v-model="userAnswers[idx]" class="input guess-input" required
                                                   autocomplete="off" @click.stop/>
                                        </div>
                                        <button type="submit" class="btn guess-btn" @click.stop>Проверить</button>
                                    </form>
                                    <div v-else class="guess-result">
                                        <div v-for="(art, idx) in card.articles" :key="'result' + idx"
                                             class="guess-answer"
                                             :class="{ correct: guessResult[idx]?.correct, wrong: !guessResult[idx]?.correct }">
                                            <b>Пропуск {{ idx + 1 }}:</b>
                                            <span v-if="guessResult[idx]?.correct"> Верно! ({{ art }})</span>
                                            <span v-else> Ошибка! (Правильно: {{ card.articles[idx] }})</span>
                                        </div>
                                        <button @click.stop="unflipCard(true)" class="btn close-btn">Дальше</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import {ref, watch, computed, onMounted} from 'vue';
    import {useCardsStore} from '../store/cardsStore.js';

    const editingCardId = ref(null);
    const defaultFormState = {title: '', topic: '', level: '', sentence: '', translation: ''};
    const form = ref({...defaultFormState});
    const searchQuery = ref('');
    const levelFilter = ref('');
    const {t} = useI18n();
    const cardsStore = useCardsStore();
    const ARTICLE_LIST = ['der', 'die', 'das', 'dem', 'den', 'des', 'einem', 'einen', 'eines', 'einer', 'mein', 'dein', 'sein', 'ihr', 'unser', 'euer', 'Ihr', 'meinem', 'meinen', 'meiner', 'meines', 'deinem', 'deinen', 'deiner', 'deines', 'seinem', 'seinen', 'seiner', 'seines', 'ihrem', 'ihren', 'ihres', 'unserem', 'unseren', 'unserer', 'unseres', 'eurem', 'euren', 'eurer', 'eures'];
    const themenMap = {
        Home: "cardThemen.Home",
        Animals: "cardThemen.Animals",
        Clothes: "cardThemen.Clothes",
        Food: "cardThemen.Food",
        Body: "cardThemen.Body",
        Professions: "cardThemen.Professions",
        Transport: "cardThemen.Transport",
        Colors: "cardThemen.Colors",
        Nature: "cardThemen.Nature",
        City: "cardThemen.City",
        Time: "cardThemen.Time",
        Tools: "cardThemen.Tools",
        Sport: "cardThemen.Sport"
    };
    const inputFields = [{
        key: 'level',
        type: 'number',
        placeholder: 'choiceTheme.difficult',
        required: false,
        min: 1,
        max: 10,
    }, {
        key: 'sentence',
        type: 'textarea',
        placeholder: "choiceTheme.placeholder",
        required: true,
        rows: 2,
    }, {key: 'translation', type: 'text', placeholder: 'choiceTheme.translate', required: false,},];
    const open = ref(false);
    const foundArticles = ref([]);
    const hiddenSentence = ref('');
    const toggle = () => {
        open.value = !open.value;
    };
    const select = (key) => {
        form.value.topic = key;
        open.value = false;
    };

    const topicColors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
    const getTopicColorClass = (topic) => {
        if (!topic) return '';
        let hash = 0;
        for (let i = 0; i < topic.length; i++) {
            hash = topic.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash % topicColors.length);
        return topicColors[index];
    };

    function hideAllArticles(sentence) {
        if (!sentence) return {articles: [], newSentence: sentence};
        const regex = new RegExp(`\\b(${ARTICLE_LIST.join('|')})\\b`, 'gi');
        let articles = [];
        let newSentence = sentence.replace(regex, (match) => {
            articles.push(match);
            return '___';
        });
        return {articles, newSentence};
    }

    watch(() => form.value.sentence, (sentence) => {
        const {articles, newSentence} = hideAllArticles(sentence);
        foundArticles.value = articles;
        hiddenSentence.value = newSentence;
    });

    const cards = computed(() => cardsStore.cards);
    const filteredCards = computed(() => {
        let list = cards.value;
        if (searchQuery.value && String(searchQuery.value).trim()) {
            list = list.filter(card => {
                const translatedTopic = card.topic ? t(themenMap[card.topic]) : '';
                return translatedTopic.toLowerCase().includes(searchQuery.value.toLowerCase());
            });
        }
        if (levelFilter.value) {
            const filterNum = Number(levelFilter.value);
            list = list.filter(card => Number(card.level) === filterNum);
        }
        return list;
    });

    const flippedCardId = ref(null);
    const userAnswers = ref([]);
    const guessResult = ref(null);
    const isCardFlipped = (cardId) => {
        return flippedCardId.value === cardId;
    }
    const flipCard = (card) => {
        if (flippedCardId.value && flippedCardId.value !== card.id) {
            unflipCard();
        }
        flippedCardId.value = card.id;
        userAnswers.value = Array(card.articles.length).fill('');
        guessResult.value = null;
    };
    const unflipCard = (force = false) => {
        if (force || !guessResult.value) {
            flippedCardId.value = null;
            guessResult.value = null;
            userAnswers.value = [];
        } else {
            flippedCardId.value = null;
        }
    };
    const makeGuess = () => {
        const currentCard = cards.value.find(c => c.id === flippedCardId.value);
        if (!currentCard) return;
        const results = currentCard.articles.map((art, idx) => {
            const user = (userAnswers.value[idx] || '').trim().toLowerCase();
            return {correct: user === art.toLowerCase(), answer: user};
        });
        guessResult.value = results;
    };

    onMounted(() => {
        cardsStore.subscribePublicCards()
    })

    const resetForm = () => {
        form.value = {...defaultFormState};
        editingCardId.value = null;
        foundArticles.value = [];
        hiddenSentence.value = '';
    };
    const saveCard = async () => {
        if (!foundArticles.value.length) {
            alert("В предложении нет артиклей для изучения!");
            return;
        }
        const cardData = {
            title: form.value.title,
            topic: form.value.topic,
            level: form.value.level ? Number(form.value.level) : null,
            sentence: form.value.sentence,
            translation: form.value.translation,
            articles: [...foundArticles.value],
            hiddenSentence: hiddenSentence.value
        };
        if (editingCardId.value) {
            await cardsStore.updateCard({...cardData, id: editingCardId.value});
        } else {
            await cardsStore.addCard(cardData);
        }
        resetForm();
    };
    const initiateEdit = (card) => {
        editingCardId.value = card.id;
        form.value.title = card.title;
        form.value.topic = card.topic;
        form.value.level = card.level;
        form.value.sentence = card.sentence;
        form.value.translation = card.translation;
        document.querySelector('.form-block').scrollIntoView({behavior: 'smooth'});
    };
    const initiateDelete = async (card) => {
        if (confirm(`Вы уверены, что хотите удалить карточку по теме "${t(themenMap[card.topic])}"?`)) {
            await cardsStore.removeCard(card.id);
        }
    };
</script>

<style scoped>
    .cards-layout {
        background-color: #fef8e4;
        min-height: 100vh;
        padding: 1.5rem;
        font-family: 'Inter', sans-serif;
    }

    .title {
        font-family: 'Fredoka One', cursive;
        font-size: 1.8rem;
        font-weight: 600;
        color: #1e1e1e;
        margin-bottom: 1.5rem;
        text-align: center;
    }

    .input {
        background-color: #fef8e4;
        border: 3px solid #1e1e1e;
        box-shadow: 4px 4px 0 #1e1e1e;
        border-radius: 16px;
        padding: 12px 16px;
        font-size: 1rem;
        color: #1e1e1e;
        font-weight: 500;
        width: 100%;
        box-sizing: border-box;
        transition: all 0.2s;
    }

    .input:focus {
        outline: none;
        border-color: #fca13a;
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #1e1e1e;
    }

    .btn {
        font-family: 'Fredoka One', cursive;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        padding: 12px 24px;
        font-size: 1.1rem;
        font-weight: 400;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 4px 4px 0 #1e1e1e;
    }

    .btn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #1e1e1e;
    }

    .btn:active {
        transform: translate(4px, 4px);
        box-shadow: 0 0 0 #1e1e1e;
    }

    .btn-primary {
        background-color: #4ade80;
        color: #1e1e1e;
    }

    .btn-secondary {
        background-color: #f3f4f6;
        color: #1e1e1e;
    }

    .back-btn {
        display: inline-block;
        color: #1e1e1e;
        font-weight: 700;
        font-family: 'Fredoka One', cursive;
        text-decoration: none;
        padding: 8px 16px;
        border-radius: 12px;
        transition: background-color 0.2s;
        margin-bottom: 1rem;
        border: 3px solid #1e1e1e;
    }

    .back-btn:hover {
        background-color: #fff;
    }


    .cards__wrapper {
        display: flex;
        gap: 2.5rem;
        align-items: flex-start;
        max-width: 1400px;
        margin: 0 auto;
    }

    .form-block {
        flex: 1 1 380px;
        max-width: 400px;
        position: sticky;
        top: 1.5rem;
    }

    .cards-block {
        flex: 2 1 600px;
    }


    .form {
        background-color: #FFFFFF;
        padding: 1.5rem;
        border-radius: 24px;
        border: 3px solid #1e1e1e;
        box-shadow: 8px 8px 0 #1e1e1e;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .input__area {
        min-height: 100px;
        resize: vertical;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
    }


    .custom-topic-label {
        font-family: 'Fredoka One', cursive;
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: #1e1e1e;
    }

    .custom-select {
        position: relative;
        user-select: none;
    }

    .custom-select__trigger {
        background: #fef8e4;
        border: 3px solid #1e1e1e;
        box-shadow: 4px 4px 0 #1e1e1e;
        border-radius: 16px;
        padding: 12px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s;
    }

    .custom-select__trigger.open {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 #1e1e1e;
    }

    .arrow {
        width: 16px;
        transition: transform 0.3s;
    }

    .arrow.open {
        transform: rotate(180deg);
    }

    .custom-select__dropdown {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        width: 100%;
        background: #FFFFFF;
        border: 3px solid #1e1e1e;
        border-radius: 16px;
        box-shadow: 4px 4px 0 #1e1e1e;
        z-index: 10;
        max-height: 200px;
        overflow-y: auto;
        padding: 0.5rem;
    }

    .custom-select__option {
        padding: 12px 16px;
        cursor: pointer;
        border-radius: 12px;
        font-weight: 500;
    }

    .custom-select__option:hover {
        background-color: #fef8e4;
    }

    .custom-select__option.selected {
        background-color: #fca13a;
        color: #FFFFFF;
        font-weight: 700;
    }


    .search-bar {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }

    .search-level {
        max-width: 150px;
    }

    .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }


    .card-scene {
        perspective: 1000px;
        min-height: 220px;
    }

    .magic-card {
        width: 100%;
        height: 100%;
        position: relative;
        transition: transform 0.6s;
        transform-style: preserve-3d;
        cursor: pointer;
        border-radius: 24px;
    }

    .magic-card.is-flipped {
        transform: rotateY(180deg);
        cursor: default;
    }

    .card-face {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        flex-direction: column;
        border-radius: 24px;
        border: 3px solid #1e1e1e;
        box-shadow: 8px 8px 0 #1e1e1e;
    }

    .card-back {
        transform: rotateY(180deg);
        background-color: #fff;
    }

    .card-front.color-1 {
        background-color: #60a5fa;
    }

    .card-front.color-2 {
        background-color: #f87171;
    }

    .card-front.color-3 {
        background-color: #fca13a;
    }

    .card-front.color-4 {
        background-color: #4ade80;
    }

    .card-front.color-5 {
        background-color: #a78bfa;
    }


    .card-actions {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        display: flex;
        gap: 0.5rem;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        z-index: 2;
    }

    .card-scene:hover .card-actions {
        opacity: 1;
    }

    .action-btn {
        background-color: rgba(255, 255, 255, 0.7);
        border: 2px solid #1e1e1e;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #1e1e1e;
    }

    .action-btn:hover {
        background-color: #FFFFFF;
    }

    .card-content {
        padding: 1.5rem;
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .card-topic {
        font-family: 'Fredoka One', cursive;
        font-size: 1.8rem;
        font-weight: 600;
        color: #FFFFFF;
        text-align: center;
        text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
    }

    .card-footer {
        padding: 0.75rem 1.5rem;
        border-top: 3px solid #1e1e1e;
        background-color: rgba(0, 0, 0, 0.1);
    }

    .card-level {
        font-family: 'Fredoka One', cursive;
        font-size: 1rem;
        color: #FFFFFF;
        font-weight: 500;
    }


    .card-close-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.75rem;
        background: none;
        border: none;
        font-size: 1.75rem;
        color: #555;
        cursor: pointer;
        line-height: 1;
        z-index: 2;
    }

    .card-back-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem;
        overflow-y: auto;
        max-height: 100%;
    }

    .modal-sentence {
        font-size: 1.25rem;
        font-weight: 500;
        color: #1e1e1e;
        margin-bottom: 1rem;
        text-align: center;
    }

    .guess-form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: center;
    }

    .guess-input {
        font-size: 1rem;
        max-width: 200px;
        text-align: center;
    }

    .guess-btn {
        margin-top: 0.5rem;
        background-color: #fca13a;
        color: white;
    }

    .guess-result {
        width: 100%;
        text-align: left;
        margin-top: 1rem;
        font-weight: 500;
    }

    .guess-answer {
        padding: 0.5rem;
        border-radius: 6px;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }

    .guess-answer.correct {
        color: #166534;
        background-color: #dcfce7;
    }

    .guess-answer.wrong {
        color: #b91c1c;
        background-color: #fee2e2;
    }

    .close-btn {
        width: 100%;
        margin-top: 1rem;
        background-color: #6b7280;
        color: white;
    }


    @media (max-width: 900px) {
        .cards__wrapper {
            flex-direction: column;
            align-items: stretch;
            gap: 2rem;
        }

        .form-block {
            position: static;
            max-width: none;
        }
    }
</style>