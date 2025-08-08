<template>
    <div class="comic-quiz-page">
        <header v-if="!loading && quizStore.activeQuestion" class="quiz-header-comic">
            <button class="btn__back" @click="backTo">{{ t('prasens.back')}}</button>
            <div class="header-item">
                {{ t('prasens.questionNumber')}} {{ quizStore.currentQuestionIndex + 1 }} / {{ quizStore.currentQuestions.length }}
            </div>
            <div class="header-item score">
                {{ t('prasens.score')}} {{ quizStore.score }}
            </div>
        </header>

        <main class="quiz-main-content">
            <div v-if="loading" class="fullscreen-state">
                <p>{{ t('prasens.loading')}}</p>
            </div>

            <div v-else-if="quizStore.quizCompleted" class="fullscreen-state">
                <div class="quiz-summary-comic">
                    <h2>{{ t('prasens.end')}} </h2>
                    <p>{{ t('prasens.result')}} {{ quizStore.score }} / {{ quizStore.currentQuestions.length }}</p>
                    <button @click="startQuiz" class="action-button">{{ t('prasens.again')}}</button>
                    <button @click="backTo" class="action-button">{{ t('prasens.back')}}</button>
                </div>
            </div>

            <div v-else-if="quizStore.activeQuestion" class="quiz-content-comic">
                <div class="question-card-comic">
                    <p class="question-text-comic">
                        <span>{{ quizStore.activeQuestion.question.split('___')[0] }}</span>
                        <span class="blank-space">{{ quizStore.selectedOption || '( ... )' }}</span>
                        <span>{{ quizStore.activeQuestion.question.split('___')[1] }}</span>
                    </p>
                </div>

                <div class="options-grid-comic">
                    <button
                            v-for="option in quizStore.activeQuestion.options"
                            :key="option"
                            @click="quizStore.chooseOption(option)"
                            class="option-button-comic"
                            :class="{ selected: quizStore.selectedOption === option }"
                            :disabled="quizStore.feedback !== null"
                    >
                        {{ option }}
                    </button>
                </div>

                <div class="footer-controls-comic">
                    <div v-if="quizStore.feedback" class="feedback-message-comic" :class="quizStore.feedback">
                        <span v-if="quizStore.feedback === 'correct'">{{ t('prasens.correct')}}</span>
                        <span v-else>{{ t('prasens.wrong')}} {{ quizStore.activeQuestion.answer }}</span>
                    </div>

                    <button
                            v-if="quizStore.feedback === null"
                            @click="quizStore.checkAnswer()"
                            :disabled="!quizStore.selectedOption"
                            class="action-button check"
                    >
                        {{ t('prasens.check')}}
                    </button>
                    <button
                            v-else
                            @click="quizStore.nextQuestion()"
                            class="action-button next"
                    >
                        {{ t('prasens.further')}}
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>

    import {ref, onMounted,} from 'vue';
    import {useQuizStore} from '../../store/usePrasensStore.js';
    import { useRouter} from 'vue-router'
    const router = useRouter()
    const quizStore = useQuizStore();
    const loading = ref(true);
    const { t } = useI18n()
    async function startQuiz() {
        loading.value = true;
        await quizStore.startNewQuiz('/verbs-data/plusquamperfect.json');
        loading.value = false;
    }

    const backTo = () => {
        router.back()
    }

    onMounted(() => {
        startQuiz();
    });

</script>

<style scoped>

    .btn__back {
        border: 3px solid #1e1e1e;
        padding: 15px;
        background: #f1c40f;
        border-radius: 16px;
        cursor: pointer;
        color: #1e1e1e;
        font-weight: 600;
        font-size: 1.2rem;
      font-family: "Nunito", sans-serif;
        box-shadow: 4px 4px 0px #1e1e1e;
        transition: all 0.1s ease-in-out;
    }

    .btn__back:hover {
        box-shadow: 2px 2px 0px #1e1e1e;
    }

    .comic-quiz-page {
        background-color: #f0e8d9;
      font-family: "Nunito", sans-serif;
        letter-spacing: 1.5px;
        min-height: 100vh;
        padding-top: 100px;
    }

    .quiz-header-comic {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: #ffd166;
        color: #000;
        font-size: 1.8rem;
        border-bottom: 3px solid #000;
        box-shadow: 0 4px 0 #000;

    }

    .quiz-main-content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 1.5rem;
        box-sizing: border-box;
    }

    .fullscreen-state {
        font-size: 4rem;
        color: #333;
        text-align: center;
    }

    .quiz-content-comic {
        width: 100%;
        max-width: 900px;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        padding: 15px;
    }

    .question-card-comic,
    .option-button-comic,
    .action-button,
    .quiz-summary-comic {
        border: 3px solid #000;
        border-radius: 12px;
        box-shadow: 6px 6px 0px #000;
        transition: all 0.1s ease-in-out;
    }


    .option-button-comic:hover,
    .action-button:hover,
    .quiz-summary-comic:hover {
        transform: translate(2px, 2px);
        box-shadow: 4px 4px 0px #000;
    }

    .question-card-comic {
        background: #fff;
        padding: 2rem;
        transform: rotate(.7deg);
    }

    .question-text-comic {
        font-size: 2.5rem;
        text-align: center;
        color: #000;
    }

    .blank-space {
        color: #0077b6;
        text-decoration: underline;
    }

    .options-grid-comic {
        display: flex;
        justify-content: center;
        gap: 12px;
        padding: 15px;
    }

    .option-button-comic {
        background-color: #fff;
        color: #000;
        padding: 1rem;
        font-size: 1.8rem;
        cursor: pointer;
        transform: rotate(-1.5deg);
    }

    .option-button-comic:nth-child(2n) {
        transform: rotate(1.5deg);
    }

    .option-button-comic.selected {
        background-color: #06d6a0;
        color: #000;
    }

    .option-button-comic:disabled {
        opacity: 0.7;
        background-color: #e9ecef;
    }

    .footer-controls-comic {
        min-height: 170px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 1rem;
    }

    .feedback-message-comic {
        font-size: 2rem;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: 3px solid black;
        margin-bottom: 10px;
    }

    .feedback-message-comic.correct {
        background-color: #06d6a0;
        transform: rotate(2deg);
    }

    .feedback-message-comic.incorrect {
        background-color: #ef476f;
        transform: rotate(-2deg);
    }

    .action-button {
        width: 100%;
        max-width: 450px;
        padding: 1rem;
        font-size: 2rem;
        cursor: pointer;
    }

    .action-button.check {
        background-color: #0077b6;
        color: white;
    }

    .action-button.check:disabled {
        background-color: #adb5bd;
        color: #495057;
        box-shadow: none;
        transform: none;
    }

    .action-button.next {
        background-color: #60a5fa;
        color: black;
    }

    .quiz-summary-comic {
        background: #fff;
        padding: 3rem;
        text-align: center;
    }

    .quiz-summary-comic h2 {
        font-size: 4rem;
    }

    .quiz-summary-comic p {
        font-size: 2rem;
        margin: 1rem 0 2rem;
    }

    @media (max-width: 767px) {
      .quiz-header-comic {
        gap: 10px;
        padding: 10px;
      }
      .header-item {
        font-size: 18px;
      }
      .btn__back {
        padding: 10px;
        font-size: 1rem;
      }
      .question-text-comic {
        font-size: 1.3rem;
      }
      .option-button-comic {
        font-size: 1.3rem;
      }
      .action-button {
        font-size: 1.4rem;
        font-family: "Nunito", sans-serif;
        font-weight: 600;
      }
      .quiz-main-content {
        padding: 5px;
      }
      .question-card-comic {
        padding: 1rem;
      }
    }

</style>