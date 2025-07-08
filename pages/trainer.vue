<script setup>
    import {useTrainerStore} from '../store/themenProgressStore.js'
    import {useRouter} from 'vue-router'
    import {ref, onMounted, onUnmounted, computed} from 'vue'

    const router = useRouter()
    const {t} = useI18n()
    const trainer = useTrainerStore()
    const correctAnswers = ref(0)
    const loading = ref(true)
    const current = ref(0)
    const userAnswer = ref('')
    const feedback = ref(null)
    const finished = ref(false)
    const isChecked = ref(false)
    const showExitModal = ref(false)
    const hourRotation = ref(0);
    const minuteRotation = ref(0);
    const secondRotation = ref(0);
    let clockInterval = null;

    const tasks = computed(() => trainer.selectedModule?.tasks || [])
    const progressPercent = computed(() => ((current.value + (finished.value ? 1 : 0)) / tasks.value.length) * 100)
    const visibleSentence = computed(() => {
        const task = tasks.value[current.value]
        if (feedback.value !== null) {
            return task.question.replace('___', task.answer)
        }
        return task.question
    })
    const check = () => {
        const task = tasks.value[current.value]
        const correct = task.answer
        const isCorrect = userAnswer.value.trim().toLowerCase() === correct
        feedback.value = isCorrect
        isChecked.value = true
        if (isCorrect) correctAnswers.value += 1
    }
    const next = async () => {
        feedback.value = null
        userAnswer.value = ''
        isChecked.value = false
        if (current.value < tasks.value.length - 1) {
            current.value++
        } else {
            finished.value = true
            if (correctAnswers.value === tasks.value.length) {
                const moduleId = trainer.selectedModule.id
                if (!trainer.completedModules.includes(moduleId)) {
                    trainer.completedModules.push(moduleId)
                    await trainer.saveProgress()
                }
            }
        }
    }

    const exit = () => {
        const hasStarted = current.value > 0 || isChecked.value === true
        if (hasStarted && finished.value === false) {
            showExitModal.value = true
        } else {
            router.push('choiceTheme')
        }
    }

    const confirmExit = () => {
        showExitModal.value = false
        router.push('/choiceTheme')
    }

    const cancelExit = () => {
        showExitModal.value = false
    }

    const restartModule = () => {
        correctAnswers.value = 0
        current.value = 0
        feedback.value = null
        userAnswer.value = ''
        isChecked.value = false
        finished.value = false
    }

    const updateClock = () => {
        const now = new Date();
        const seconds = now.getSeconds();
        const minutes = now.getMinutes();
        const hours = now.getHours();
        secondRotation.value = seconds * 6;
        minuteRotation.value = minutes * 6 + seconds * 0.1;
        hourRotation.value = (hours % 12) * 30 + minutes * 0.5;
    };
    const handleBeforeUnload = (event) => {
        event.preventDefault();
    };

    onMounted(async () => {
        if (!trainer.selectedModule) {
            await trainer.loadProgress()
        }
        loading.value = false
        updateClock();
        clockInterval = setInterval(updateClock, 1000);
        window.addEventListener('beforeunload', handleBeforeUnload);
    })

    onUnmounted(() => {
        clearInterval(clockInterval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
    })
</script>
<template>
    <main class="trainer-page">
        <div class="trainer-page__content">
            <div v-if="showExitModal" class="modal-overlay">
                <div class="modal-content">
                    <h3 class="modal-title">{{ t('trainerPage.sure')}}</h3>
                    <p class="modal-text">{{ t('trainerPage.warning')}}</p>
                    <div class="modal-actions">
                        <button class="btn" @click="cancelExit">{{ t('trainerPage.continue')}}</button>
                        <button class="btn btn--danger" @click="confirmExit">{{ t('trainerPage.exit')}}</button>
                    </div>
                </div>
            </div>
            <div class="trainer-page__decorations">
                <button class="exit-sign" @click="exit">
                    <img class="exit-sign-icon" src="../assets/images/exit.svg" alt="">
                    <span class="exit-sign-text">{{ t('trainerPage.exit')}}</span>
                </button>
                <div class="scene-decoration scene-decoration--pencils">
                    <div class="pencil pencil--1"></div>
                    <div class="pencil pencil--2"></div>
                    <div class="pencil pencil--3"></div>
                </div>
                <div class="scene-decoration scene-decoration--bookshelf">
                    <div class="book book--red"></div>
                    <div class="book book--green"></div>
                    <div class="book book--blue"></div>
                    <div class="book book--yellow book--tilted"></div>
                </div>
                <div class="scene-decoration scene-decoration--picture">
                    <div class="picture-art-sun"></div>
                    <div class="picture-art"></div>
                </div>
                <div class="scene-decoration scene-decoration--clock">
                    <div class="clock-hand--numbers">
                        <div class="clock-hand--number-12">12</div>
                        <div class="clock-hand--number-3">3</div>
                        <div class="clock-hand--number-6">6</div>
                        <div class="clock-hand--number-9">9</div>
                    </div>
                    <div class="clock-hand clock-hand--hour" :style="{ transform: `rotate(${hourRotation}deg)` }"></div>
                    <div class="clock-hand clock-hand--minute"
                         :style="{ transform: `rotate(${minuteRotation}deg)` }"></div>
                    <div class="clock-hand clock-hand--second"
                         :style="{ transform: `rotate(${secondRotation}deg)` }"></div>
                </div>
            </div>
            <div class="trainer-app">
                <div class="trainer-app__board">
                    <section v-if="loading" class="trainer-app__view trainer-app__view--loading">
                        <p>{{ t('trainerPage.loading')}}</p>
                    </section>
                    <section v-else-if="trainer.selectedModule" class="trainer-app__view trainer-app__view--content">
                        <header v-if="!finished" class="trainer-app__header">
                            <h1 class="trainer-app__title">{{ trainer.selectedModule.title }}</h1>
                            <h2 class="trainer-app__subtitle">{{ t('trainerPage.quest')}} {{ current + 1 }} / {{
                                tasks.length }}</h2>
                        </header>
                        <div v-if="!finished" class="progress-bar">
                            <div class="progress-bar__fill" :style="{ width: progressPercent + '%' }"></div>
                        </div>
                        <div v-if="!finished" class="trainer-app__task">
                            <p class="trainer-app__question" :class="{ 'is-correct': feedback === true }">
                                {{ visibleSentence }}
                            </p>
                            <div class="trainer-app__input-group">
                                <input
                                        v-model="userAnswer"
                                        class="trainer-app__input"
                                        @keyup.enter="isChecked ? next() : check()"
                                        :disabled="isChecked"
                                        placeholder="..."
                                        maxlength="3"
                                />
                                <button v-if="!isChecked" class="btn" @click="check">{{ t('trainerPage.check')}}
                                </button>
                                <button v-else class="btn btn--next" @click="next">{{ t('trainerPage.further')}}
                                </button>
                            </div>
                            <div v-if="feedback !== null" class="feedback">
                                <p v-if="feedback === true" class="feedback__text feedback__text--success">
                                    ✔ {{ t('trainerPage.right')}}
                                </p>
                                <p v-if="feedback === false" class="feedback__text feedback__text--error">
                                    ✖ {{ t('trainerPage.false')}} {{ tasks[current].answer }}
                                </p>
                            </div>
                        </div>
                        <div v-else class="trainer-app__view trainer-app__view--complete">
                            <div v-if="correctAnswers === tasks.length">
                                <div class="result-icon">🏆</div>
                                <h3 class="result-title">{{ t('trainerPage.end')}}</h3>
                                <p class="result-subtitle">{{ t('trainerPage.save')}}</p>
                                <button class="btn" @click="exit">{{ t('trainerPage.backToTheme')}}</button>
                            </div>
                            <div v-else>
                                <div class="result-icon">🤔</div>
                                <h3 class="result-title">{{ t('trainerPage.morePractice')}}</h3>
                                <p class="result-subtitle">{{ t('trainerPage.result')}} {{ correctAnswers }} / {{
                                    tasks.length }}</p>
                                <div class="result-actions">
                                    <button class="btn btn--restart" @click="restartModule">{{
                                        t('trainerPage.repeat')}}
                                    </button>
                                    <button class="btn btn--secondary" @click="exit">{{ t('trainerPage.toMain')}}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section v-else class="trainer-app__view trainer-app__view--error">
                        <p class="error__text">{{ t('trainerPage.notFound')}}</p>
                        <button class="btn" @click="exit">{{ t('trainerPage.toMain')}}</button>
                    </section>
                </div>
                <div class="trainer-app__ledge">
                    <div class="duster"></div>
                    <div class="chalk"></div>
                </div>
            </div>
        </div>
        <div class="trainer-page__floor"></div>
    </main>
</template>

<style scoped>
    /* ЗАМЕНИТЕ ВЕСЬ ВАШ <style> НА ЭТОТ КОД */

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes scaleIn {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    @keyframes fadeInScene {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* --- ВАШИ ОРИГИНАЛЬНЫЕ СТИЛИ ДЛЯ КОМНАТЫ И ДЕКОРА (НЕ ИЗМЕНЕНЫ) --- */
    .trainer-page {
        position: relative;
        min-height: 100vh;
        overflow: hidden;
        font-family: 'Nunito', sans-serif;
        background-color: #f0ebe5;
        background-image: repeating-linear-gradient(90deg, #e9e2db, #e9e2db 20px, #f0ebe5 20px, #f0ebe5 40px);
    }

    .trainer-page__floor {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 55px;
        z-index: 1;
        background: #8B4513;
        background-image: linear-gradient(to top, #8B4513 0%, #8B4513 83.33%, #6d4c41 83.33%, #6d4c41 100%);
    }

    .trainer-page__content {
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 1.5rem;
    }

    .trainer-page__decorations {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    .exit-sign {
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: all;
        position: absolute;
        top: 3vh;
        left: 3vw;
        z-index: 20;
        background-color: #2E7D32;
        color: rgba(255, 255, 255, 0.9);
        font-family: 'Nunito', sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
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

    .exit-sign-icon {
        width: 14px;
    }

    .exit-sign-text {
        padding-left: 10px;
    }

    .scene-decoration {
        position: absolute;
        animation: fadeInScene 1s ease-out 0.5s backwards;
    }

    .scene-decoration--bookshelf {
        bottom: 7%;
        right: 3%;
        width: 200px;
        height: 20px;
        background-color: #6d4c41;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .book {
        position: absolute;
        bottom: 20px;
        width: 30px;
        height: 100px;
        box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    }

    .book--red {
        left: 10px;
        background-color: #c0392b;
    }

    .book--green {
        left: 45px;
        background-color: #27ae60;
    }

    .book--blue {
        left: 80px;
        background-color: #2980b9;
    }

    .book--yellow {
        left: 115px;
        background-color: #f1c40f;
    }

    .book--tilted {
        transform: rotate(-11deg);
        bottom: 22px;
        left: 120px;
    }

    .scene-decoration--pencils {
        left: 3%;
        bottom: 55px;
        width: 40px;
        height: 35px;
        background-color: #bdc3c7;
        border-radius: 3px;
    }

    .pencil {
        position: absolute;
        bottom: 0;
        width: 8px;
        height: 60px;
        border-radius: 2px 2px 0 0;
    }

    .pencil::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 10px;
        background-color: #34495e;
        border-radius: 2px 2px 0 0;
    }

    .pencil--1 {
        left: 5px;
        background-color: #e74c3c;
        transform: rotate(-5deg);
    }

    .pencil--2 {
        left: 16px;
        background-color: #3498db;
        height: 65px;
    }

    .pencil--3 {
        left: 27px;
        background-color: #2ecc71;
        transform: rotate(3deg);
        height: 55px;
    }

    .scene-decoration--picture {
        bottom: 40%;
        left: 4%;
        padding: 10px;
        background-color: #6d4c41;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .picture-art {
        width: 180px;
        height: 120px;
        background: linear-gradient(to bottom, #87CEEB 0%, #f5f5f5 70%, #228B22 70%);
    }

    .picture-art-sun {
        width: 25px;
        height: 25px;
        background: gold;
        border-radius: 50%;
        position: absolute;
        top: 20px;
        left: 20px;
        opacity: 50%;
    }

    .scene-decoration--clock {
        top: 2vh;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 100px;
        background-color: #f5deb3;
        border-radius: 50%;
        border: 6px solid #8B4513;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .clock-hand--numbers, .clock-hand, .clock-hand--hour, .clock-hand--minute, .clock-hand--second { /* ... все ваши стили для часов ... */
    }

    .clock-hand--numbers {
        position: relative;
        width: 100%;
        height: 100%
    }

    .clock-hand--number-12 {
        position: absolute;
        left: 50%;
        top: 2px;
        font-size: 10px;
        transform: translateX(-50%)
    }

    .clock-hand--number-3 {
        position: absolute;
        right: 2px;
        top: 50%;
        font-size: 10px;
        transform: translateY(-50%)
    }

    .clock-hand--number-6 {
        position: absolute;
        left: 50%;
        bottom: 2px;
        font-size: 10px;
        transform: translateX(-50%)
    }

    .clock-hand--number-9 {
        position: absolute;
        left: 2px;
        top: 50%;
        font-size: 10px;
        transform: translateY(-50%)
    }

    .clock-hand {
        position: absolute;
        bottom: 50%;
        left: 50%;
        transform-origin: bottom center
    }

    .clock-hand--hour {
        width: 6px;
        height: 32px;
        background-color: #333;
        border-radius: 3px;
        margin-left: -3px
    }

    .clock-hand--minute {
        width: 4px;
        height: 42px;
        background-color: #333;
        border-radius: 2px;
        margin-left: -2px
    }

    .clock-hand--second {
        width: 2px;
        height: 40px;
        background-color: #e74c3c;
        border-radius: 1px;
        margin-left: -1px
    }


    /* --- ИЗМЕНЕНИЯ НАЧИНАЮТСЯ ЗДЕСЬ --- */

    /* --- Модальное окно --- */
    .modal-content {
        /* Стили модального окна из вашего кода, они хорошо подходят */
        background: #f0ebe5;
        padding: 2rem 2.5rem;
        border-radius: 12px;
        border: 4px solid #d3c2b2;
        color: #333;
        width: 90%;
        max-width: 480px;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        animation: scaleIn 0.3s ease-out;
    }

    .modal-title {
        font-family: 'Caveat', cursive;
        font-size: 2.5rem;
        margin: 0 0 1rem 0;
        color: #5D4037;
    }

    .modal-text {
        font-family: 'Nunito', sans-serif;
        font-size: 1.1rem;
        margin-bottom: 2rem;
        line-height: 1.6;
        color: #34495e;
    }

    .modal-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    /* --- Основной блок тренажера (немного улучшенная версия вашей доски) --- */
    .trainer-app {
        background: #5D4037; /* Ваша "деревянная" рама */
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.5);
        width: 100%;
        max-width: 700px; /* Немного шире для комфорта */
        position: relative;
    }

    .trainer-app__board {
        background: #2c3e50; /* Ваша "доска" */
        border: 10px solid #34495e;
        border-radius: 5px;
        padding: 2rem 2.5rem;
        box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.7);
        color: #ecf0f1;
        min-height: 420px;
        display: flex;
        flex-direction: column;
    }

    /* Элементы на подставке доски (не изменены) */
    .trainer-app__ledge {
        position: absolute;
        bottom: 10px;
        left: 5%;
        width: 90%;
        height: 25px;
        background-color: #6d4c41;
        border-radius: 3px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
    }

    .duster {
        position: absolute;
        left: 20px;
        bottom: 5px;
        width: 80px;
        height: 40px;
        background-color: #a1887f;
        border-top: 10px solid #5d4037;
        border-radius: 4px;
    }

    .chalk {
        position: absolute;
        right: 30px;
        bottom: 8px;
        width: 50px;
        height: 10px;
        background-color: #f1c40f;
        border-radius: 2px;
        transform: rotate(-5deg);
    }

    /* --- Интерфейс на доске (Улучшенный "меловой" стиль) --- */
    .trainer-app__header {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .trainer-app__title {
        font-family: 'Caveat', cursive;
        font-size: 3rem;
        color: #ffffff;
        margin: 0;
    }

    .trainer-app__subtitle {
        font-size: 1.1rem;
        color: #bdc3c7;
        margin: 0;
        font-family: 'Nunito', sans-serif;
        font-weight: 700;
    }

    .progress-bar {
        width: 100%;
        height: 14px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        border: 2px solid #34495e;
        overflow: hidden;
        margin-bottom: 2rem;
    }

    .progress-bar__fill {
        height: 100%;
        background: #f1c40f;
        border-radius: 6px;
    }

    .trainer-app__task {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
    }

    .trainer-app__question {
        font-size: 1.8rem;
        line-height: 1.6;
        text-align: center;
        flex-grow: 1;
        margin: 0 0 1.5rem 0;
        color: #fff;
    }

    .trainer-app__question.is-correct {
        color: #2ecc71;
    }

    .trainer-app__input-group {
        display: flex;
        gap: 12px;
    }

    .trainer-app__input {
        flex-grow: 1;
        padding: 12px 16px;
        font-size: 1.2rem;
        font-weight: 700;
        border: 3px dashed rgba(236, 240, 241, 0.4);
        background: transparent;
        color: #ecf0f1;
        border-radius: 12px;
    }

    .trainer-app__input:focus {
        outline: none;
        border-color: #f1c40f;
        border-style: solid;
    }

    .btn {
        padding: 12px 24px;
        font-family: 'Caveat', cursive;
        font-size: 1.5rem;
        color: #f1c40f;
        background-color: transparent;
        border: 3px solid #f1c40f;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        white-space: nowrap;
    }

    .btn:hover:not(:disabled) {
        background-color: #f1c40f;
        color: #2c3e50;
    }

    .btn--next {
        border-color: #2ecc71;
        color: #2ecc71;
    }

    .btn--next:hover:not(:disabled) {
        background-color: #2ecc71;
        color: #2c3e50;
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
    }

    .btn--secondary:hover:not(:disabled) {
        background-color: #95a5a6;
        color: #2c3e50;
    }

    .feedback {
        margin-top: 1rem;
        min-height: 50px;
        text-align: center;
    }

    .feedback__text {
        font-size: 1.3rem;
        font-weight: 700;
        font-family: 'Nunito', sans-serif;
    }

    .feedback__text--success {
        color: #2ecc71;
    }

    .feedback__text--error {
        color: #e74c3c;
    }

    .result-icon {
        font-size: 4rem;
    }

    .result-title {
        font-family: 'Caveat', cursive;
        font-size: 2.8rem;
    }

    .result-subtitle {
        font-size: 1.2rem;
        color: #bdc3c7;
    }

    .result-actions {
        display: flex;
        gap: 1.5rem;
    }
</style>