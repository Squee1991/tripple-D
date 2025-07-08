<template>
    <main class="trainer-page">
        <button @click="backToMainPage" class="exit-sign">
            <img class="exit-sign-icon" src="../assets/images/exit.svg" alt="">
            <span class="exit-sign-text">Назад</span>
        </button>
        <div class="trainer-app">
            <div class="trainer-app__board">
                <dv v-if="!isStarted" class="guess__start-screen">
                    <h1 class="trainer-app__title start-screen__title">Угадай Слово</h1>
                    <button class="btn" @click="startGame">Начать игру</button>
                </dv>
                <div class="guess__inner-session" v-else>
                    <div class="guess__top-content">
                        <div class="top-content-spacer"></div>
                        <div class="guess__status-group">
                            <div v-if="isStarted && !store.win && !store.lose" class="guess__info">Время: {{
                                Math.floor((now - store.timeStarted) / 1000) }} сек.
                            </div>
                            <div v-if="isStarted && (store.win || store.lose)" class="guess__info">Время: {{
                                store.timeSpent }} сек.
                            </div>
                            <div class="guess__info">Попыток: <span
                                    class="guess__attempts-value">{{ store.attempts }}</span></div>
                        </div>
                        <button class="guess__restart" @click="startGame" title="Начать заново"><img
                                src="../assets/images/undo.svg" alt="restart"></button>
                    </div>
                    <div class="guess__word">
                        <span v-for="(char, i) in store.masked" :key="i" class="guess__letter">{{ char || '_' }}</span>
                    </div>
                    <div class="guess__alphabet">
                        <button v-for="letter in store.alphabet" :key="letter" class="btn btn--letter"
                                :disabled="store.usedLetters.includes(letter) || store.win || store.lose"
                                @click="store.pickLetter(letter)">{{ letter }}
                        </button>
                    </div>
                    <div class="guess__input-area trainer-app__input-group">
                        <input v-model="guessInput" class="trainer-app__input" :disabled="store.win || store.lose"
                               @keyup.enter="guessWord" placeholder="Введи слово целиком"/>
                        <button class="btn" @click="guessWord" :disabled="store.win || store.lose">Угадать</button>
                    </div>

                    <div v-if="store.win" class="feedback__text feedback__text--success guess__result--win">Победа!
                        Слово угадано.
                    </div>
                </div>
            </div>
            <div class="trainer-app__ledge">
                <div class="duster-group">
                    <div class="duster"></div>
                </div>
                <div class="letter-blocks-pile">
                    <div class="letter-block block-1">W</div>
                    <div class="letter-block block-2">O</div>
                    <div class="letter-block block-3">R</div>
                    <div class="letter-block block-4">T</div>
                </div>
            </div>
        </div>
        <Transition name="modal-fade">
            <div v-if="showArticleModal" class="modal-overlay" @click.self="closeArticleModal">
                <div class="modal-content">
                    <div class="modal__icon">🎉</div>
                    <h3 class="modal-title">Ты молодец!</h3>
                    <p class="modal-text">А теперь попробуй угадать артикль слова: <strong>{{ store.answer }}</strong>
                    </p>
                    <form class="article__form" @submit.prevent="checkArticle">
                        <input v-model="articleGuess" class="trainer-app__input" placeholder="der / die / das"
                               :disabled="!!articleResult" @keyup.enter="checkArticle" maxlength="4"/>
                        <button class="btn" @click="checkArticle" :disabled="!!articleResult">Проверить</button>
                    </form>
                    <div v-if="articleResult" class="feedback__text"
                         :class="{'feedback__text--success': articleResult ==='Верно!', 'feedback__text--error': articleResult !=='Верно!'}">
                        {{ articleResult }}
                    </div>
                    <button v-if="articleResult" class="btn modal__close-btn" @click="closeArticleModal">Продолжить
                    </button>
                </div>
            </div>
        </Transition>
        <Transition name="modal-fade">
            <div v-if="showLoseModal" class="modal-overlay" @click.self="closeLoseModal">
                <div class="modal-content">
                    <div class="modal__icon">😔</div>
                    <h3 class="modal-title">Не в этот раз...</h3>
                    <p class="modal-text">Загаданное слово было: <strong class="modal__answer">{{ store.answer
                        }}</strong></p>
                    <div class="modal-actions">
                        <button class="btn btn--restart" @click="startGame">Попробовать снова</button>
                        <NuxtLink to="/" class="btn btn--secondary">На главную</NuxtLink>
                    </div>
                </div>
            </div>
        </Transition>
    </main>
</template>

<script setup>
    /* ЛОГИКА ОСТАЕТСЯ БЕЗ ИЗМЕНЕНИЙ */
    import {ref, watch, onUnmounted} from 'vue'
    import {useGuessWordStore} from '../store/guesStore.js'
    import {useRouter} from 'vue-router'

    const router = useRouter()
    const store = useGuessWordStore()
    const guessInput = ref('')
    const articleGuess = ref('')
    const articleResult = ref(null)
    const isStarted = ref(false)
    const showArticleModal = ref(false)
    const showLoseModal = ref(false)

    const now = ref(Date.now())
    let intervalId = null

    const backToMainPage = () => {
        router.push('/')
    }

    function startTimer() {
        if (intervalId) clearInterval(intervalId)
        intervalId = setInterval(() => {
            now.value = Date.now()
        }, 1000)
    }

    function checkArticle() {
        if (!store.currentWordObj) return
        const correct = articleGuess.value.trim().toLowerCase() === store.currentWordObj.article.toLowerCase()
        articleResult.value = correct ? 'Верно!' : `Неверно. Это было: ${store.currentWordObj.article}`
    }

    function closeArticleModal() {
        showArticleModal.value = false
        startGame()
    }

    function closeLoseModal() {
        showLoseModal.value = false
    }

    function stopTimer() {
        if (intervalId) clearInterval(intervalId)
    }

    async function startGame() {
        await store.startGame()
        isStarted.value = true
        guessInput.value = ''
        articleGuess.value = ''
        articleResult.value = null
        showArticleModal.value = false
        showLoseModal.value = false
        startTimer()
    }

    function guessWord() {
        store.tryGuessWord(guessInput.value)
        guessInput.value = ''
    }

    onUnmounted(() => stopTimer())

    watch(() => store.win, (isWin) => {
        if (isWin) {
            stopTimer()
            setTimeout(() => {
                showArticleModal.value = true
            }, 500);
        }
    })

    watch(() => store.lose, (isLose) => {
        if (isLose) {
            stopTimer()
            setTimeout(() => {
                showLoseModal.value = true
            }, 500);
        }
    })
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Nunito:wght@400;600;700&display=swap');

    /* --- ОСНОВНАЯ СТРУКТУРА --- */
    .trainer-page {
        position: relative;
        min-height: 100vh;
        overflow: hidden;
        font-family: 'Nunito', sans-serif;
        background-color: #f0ebe5;
        background-image: repeating-linear-gradient(90deg, #e9e2db, #e9e2db 20px, #f0ebe5 20px, #f0ebe5 40px);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1.5rem;

    }

    .exit-sign-icon {
        width: 10px;
    }

    .exit-sign {
        top: 3vh;
        left: 3vw;
        position: absolute;
        display: flex;
        align-content: center;
        justify-content: center;
        background-color: #2E7D32;
        color: rgba(255, 255, 255, 0.9);
        font-family: 'Nunito', sans-serif;
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: 4px;
        text-transform: uppercase;
        padding: 8px 20px;
        border: 4px solid #e0e0e0;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 0 0 15px rgba(46, 204, 113, 0.6), 0 0 25px rgba(46, 204, 113, 0.5);
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
        transition: all 0.3s ease;
    }

    .exit-sign:hover {
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.9), 0 0 25px rgba(46, 204, 113, 0.8), 0 0 40px rgba(46, 204, 113, 0.7);
        color: #ffffff;
    }

    .exit-sign-text {
        padding-left: 10px;
    }

    .trainer-app {
        background: #5D4037;
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(0, 0, 0, 0.4);
        width: 100%;
        max-width: 1000px;
		min-height: 640px;
        position: relative;
    }

    .trainer-app__board {
        background: #2c3e50;
        border: 10px solid #34495e;
        border-radius: 5px;
        padding: 2rem 2.5rem;
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.7);
        color: #ecf0f1;
        min-height: 550px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
    }

    .trainer-app__board::before {
        content: '?';
        position: absolute;
        font-family: 'Caveat', cursive;
        font-size: 30rem;
        color: rgba(236, 240, 241, 0.05);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-15deg);
        z-index: 0;
        user-select: none;
    }

    .word-of-the-day-sign {
        position: absolute;
        top: 20px;
        right: 20px;
        background-color: #8B7355;
        color: #f0ebe5;
        font-family: 'Caveat', cursive;
        font-size: 1.5rem;
        padding: 5px 20px;
        border-radius: 4px;
        border: 2px solid #6d4c41;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        transform: rotate(3deg);
        z-index: 2;
    }

    .trainer-app__ledge {
        position: absolute;
        bottom: 10px;
        left: 5%;
        width: 90%;
        height: 25px;
        background-color: #6d4c41;
        border-radius: 3px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .duster-group {
        display: flex;
        align-items: flex-end;
        gap: 10px;
        padding-left: 20px;
    }

    .duster {
        position: relative;
        bottom: -15px;
        width: 80px;
        height: 40px;
        background-color: #a1887f;
        border-top: 10px solid #5d4037;
        border-radius: 4px;
    }

    .chalk {
        position: relative;
        bottom: -8px;
        width: 50px;
        height: 10px;
        background-color: #f1c40f;
        border-radius: 2px;
        transform: rotate(-5deg);
    }

    .letter-blocks-pile {
        position: relative;
        right: 20px;
        width: 100px;
        height: 40px;
    }

    .letter-block {
        position: absolute;
        width: 35px;
        height: 35px;
        background-color: #DEB887;
        border: 1px solid #8B7355;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Caveat', cursive;
        font-size: 24px;
        color: #5D4037;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
        bottom: -15px;
    }

    .block-1 {
        left: 0;
        transform: rotate(-10deg);
        z-index: 1;
    }

    .block-2 {
        left: 25px;
        transform: rotate(8deg);
        z-index: 2;
    }

    .block-3 {
        left: 50px;
        transform: rotate(-5deg);
        z-index: 1;
    }

    .block-4 {
        left: 20px;
        bottom: 10px;
        transform: rotate(15deg);
        z-index: 0;
    }

    /* --- СТИЛИ КОМПОНЕНТА GUESS --- */
    .guess__start-screen, .guess__inner-session {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 1;
    }

    .guess__start-screen {
        justify-content: center;
        text-align: center;
    }

    .start-screen__title {
        font-family: 'Caveat', cursive;
        font-size: 4rem;
        margin-bottom: 2rem;
    }

    .guess__top-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px dashed rgba(236, 240, 241, 0.3);
        color: #bdc3c7;
    }

    .top-content-spacer {
        min-width: 50px;
        flex-shrink: 0;
    }

    .guess__status-group {
        display: flex;
        gap: 1.5rem;
        align-items: center;
    }

    .guess__info {
        font-size: 1rem;
        font-weight: 600;
    }

    .guess__attempts-value {
        color: #f1c40f;
        font-size: 1.2rem;
    }

    .guess__restart {
        background: transparent;
        border: none;
        width: 32px;
        height: 32px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
    }

    .guess__restart:hover {
        opacity: 1;
    }

    .guess__restart img {
        filter: invert(88%) sepia(26%) saturate(1001%) hue-rotate(317deg) brightness(104%) contrast(92%);
    }

    .guess__word {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 2rem;
        flex-wrap: wrap;
        justify-content: center;
        min-height: 80px;
        font-family: 'Caveat', cursive;
        color: #fff;
        font-size: 4.5rem;
        letter-spacing: 0.5rem;
    }

    .guess__letter {
        user-select: none;
        line-height: 1;
    }

    .guess__alphabet {
        max-width: 600px;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
        margin-bottom: 2rem;
    }

    .btn--letter {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        padding: 0;
    }

    .guess__input-area {
        width: 100%;
        max-width: 450px;
        margin-bottom: 1rem;
    }

    .trainer-app__input-group {
        display: flex;
        gap: 12px;
    }

    .trainer-app__input {
        flex-grow: 1;
        padding: 12px 16px;
        font-size: 1.2rem;
        border: 2px dashed rgba(236, 240, 241, 0.5);
        background: transparent;
        color: #ecf0f1;
        border-radius: 8px;
        transition: border-color 0.3s, box-shadow 0.3s;
        text-align: center;
    }

    .trainer-app__input:focus {
        outline: none;
        border-color: #f1c40f;
        border-style: solid;
    }

    .trainer-app__input::placeholder {
        color: rgba(236, 240, 241, 0.4);
    }

    .btn {
        padding: 12px 24px;
        font-family: 'Caveat', cursive;
        font-size: 24px;
        color: #f1c40f;
		font-weight: bold;
        background-color: transparent;
        border: 3px solid #f1c40f;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        white-space: nowrap;
        text-decoration: none;
    }

    .btn:hover:not(:disabled) {
        background-color: #f1c40f;
        color: #2c3e50;
        transform: translateY(-2px);
    }

    .btn:disabled {
        border-color: #7f8c8d;
        color: #7f8c8d;
        cursor: not-allowed;
    }

    /* --- Стили модальных окон --- */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background-color: rgba(44, 62, 80, 0.85);
        backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 1rem;
    }

    .modal-fade-enter-active, .modal-fade-leave-active {
        transition: all 0.3s ease;
    }

    .modal-fade-enter-from, .modal-fade-leave-to {
        opacity: 0;
        transform: scale(0.9);
    }

    .modal-content {
        background: #f0ebe5;
        padding: 2rem 2.5rem;
        border-radius: 12px;
        border: 4px solid #d3c2b2;
        color: #333;
        width: 90%;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }

    .modal__icon {
        font-size: 4rem;
        line-height: 1;
        margin-bottom: 1rem;
    }

    .modal-title {
        font-family: 'Caveat', cursive;
        font-size: 3rem;
        margin: 0 0 1rem 0;
        color: #5D4037;
    }

    .modal-text {
        font-family: 'Nunito', sans-serif;
        font-size: 1.2rem;
        margin-bottom: 2rem;
        line-height: 1.6;
        color: #34495e;
    }

    .modal-text strong {
        color: #2980b9;
        font-weight: 700;
    }

    .modal__answer {
        color: #e74c3c;
        font-weight: 700;
    }

    .article__form {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        width: 100%;
        max-width: 350px;
        margin-bottom: 1rem;
    }

    .article__form .trainer-app__input {
        border-color: rgba(44, 62, 80, 0.3);
        color: #2c3e50;
    }

    .article__form .trainer-app__input:focus {
        border-color: #2980b9;
    }

    .modal-content .btn {
        border-color: #2c3e50;
        color: #2c3e50;
    }

    .modal-content .btn:hover:not(:disabled) {
        background-color: #2c3e50;
        color: #f0ebe5;
    }

    .modal__close-btn {
        margin-top: 1.5rem;
    }

    .modal-actions {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        margin-top: 1rem;
    }

    .btn--restart {
        border-color: #f1c40f;
        color: #f1c40f;
    }

    .btn--restart:hover:not(:disabled) {
        background-color: #f1c40f;
        color: #2c3e50;
    }

    .btn--secondary {
        border-color: #95a5a6;
        color: #95a5a6;
        text-decoration: none;
    }

    .btn--secondary:hover:not(:disabled) {
        background-color: #95a5a6;
        color: #fff;
    }

    /* --- Стили для фидбека --- */
    .feedback__text {
        margin-top: 16px;
        min-height: 30px;
        text-align: center;
        font-size: 1.3rem;
        font-weight: 600;
    }

    .feedback__text--success {
        color: #2ecc71;
    }

    .feedback__text--error {
        color: #e74c3c;
    }

    .guess__result--win {
        margin-top: 1rem;
        width: 100%;
    }

    /* --- Адаптивность --- */
    @media (max-width: 768px) {
        .exit-sign {
            display: none;
        }

        .trainer-app__board {
            padding: 1.5rem 1rem;
            min-height: 480px;
        }

        .guess__top-content {
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
        }

        .guess__word {
            font-size: 2.5rem;
            min-height: 50px;
            margin-bottom: 1.5rem;
        }

        .start-screen__title {
            font-size: 2.8rem;
        }

        .btn--letter {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
        }

        .guess__alphabet {
            gap: 0.4rem;
        }

        .modal-actions, .article__form {
            flex-direction: column;
            width: 100%;
        }

        .word-of-the-day-sign {
            display: none;
        }

        .letter-blocks-pile {
            display: none;
        }

        .top-content-spacer {
            display: none;
        }
    }
</style>