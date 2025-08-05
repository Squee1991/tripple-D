<template>
    <div class="exam">
        <h1 class="exam__title">📘 Stuffe {{ route.params.level.toUpperCase() }}</h1>
        <div v-if="!store.isFinished && current" class="exam-card">
            <h2 class="exam-card__title">{{ current.title }}</h2>
            <div v-if="['multiple-choice', 'audio-choice'].includes(current.type)">
                <!-- Только если это multiple-choice — показываем текст задания -->
                <div
                        v-if="current.task.text && current.type === 'multiple-choice'"
                        class="exam-card__text"
                >
                    <strong>Text:</strong> {{ current.task.text }}
                </div>

                <!-- Если audio-choice — выводим кнопку прослушивания без текста -->
                <div
                        v-if="current.type === 'audio-choice'"
                        class="exam-card__audio"
                >
                    <strong>Hörbeispiel:</strong>
                    <SoundBtn
                            :text="current.task.text"
                            lang="de-DE"
                            title="Hörbeispiel anhören"
                    />
                </div>

                <!-- Вопрос (всегда показывается) -->
                <div class="exam-card__question">
                    <strong>Frage:</strong> {{ current.task.question }}
                    <SoundBtn
                            v-if="current.type === 'audio-choice'"
                            :text="current.task.question"
                            lang="de-DE"
                    />
                </div>

                <!-- Варианты ответов -->
                <ul class="exam-card__options">
                    <li
                            v-for="opt in current.task.options"
                            :key="opt"
                            class="exam-card__option-with-sound"
                    >
                        <button class="exam-card__button" @click="store.answerCurrent(opt)">
                            {{ opt }}
                        </button>
                        <SoundBtn
                                v-if="current.type === 'audio-choice'"
                                :text="opt"
                                lang="de-DE"
                        />
                    </li>
                </ul>
            </div>

            <div v-else-if="current.type === 'text-input'">
                <p class="exam-card__text"><strong>Инструкция:</strong> {{ current.task.instruction }}</p>
                <p class="exam-card__text"><em>Bei spiel:</em> {{ current.task.exampleAnswer }}</p>
                <textarea
                        v-model="userText"
                        class="exam-card__textarea"
                        placeholder="schreiben Sie hier bitte"
                        rows="4"
                />
                <button class="exam-card__button" @click="submitTextAnswer">Отправить</button>
            </div>
            <div v-else-if="current.type === 'speaking-prompt'">
                <p class="exam-card__text"><strong>Скажи:</strong> {{ current.task.prompt }}</p>
                <p class="exam-card__text">🎯 Темы: {{ current.task.expectedTopics.join(', ') }}</p>
                <button class="exam-card__button" @click="store.answerCurrent('spoken')">Готово</button>
            </div>
        </div>
        <div v-else class="exam-card exam-card--finish">
            <h2 class="exam-card__title">🎉 Уровень пройден!</h2>
            <p class="exam-card__text">
                Правильных ответов: {{ store.userAnswers.filter(a => a.correct).length }} из
                {{ store.userAnswers.length }}
            </p>
            <NuxtLink to="/exams" class="exam-card__button">⬅ Назад к уровням</NuxtLink>
        </div>
    </div>
</template>

<script setup>
    import { useRoute } from 'vue-router'
    import { ref, computed, onMounted, watch } from 'vue'
    import { userExamStore } from '../../../store/examStore.js'
    import SoundBtn from '../../../src/components/soundBtn.vue'

    const store = userExamStore()
    const route = useRoute()
    const userText = ref('')

    onMounted(() => {
        const level = route.params.level?.toUpperCase()
        store.loadTopics(`/exams/exam-${level}.json`)
    })

    const current = computed(() => store.currentExercise)

    const submitTextAnswer = () => {
        store.answerCurrent(userText.value.trim())
        userText.value = ''
    }

</script>

<style scoped>
    .exam {
        background: #fff8dc;
        min-height: 100vh;
        padding: 3rem 1rem;
        font-family: 'Comic Neue', cursive;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-image: radial-gradient(circle at top left, #fff8dc, #fff1b5);
    }

    .exam__title {
        font-size: 2.5rem;
        margin-bottom: 2.5rem;
        font-weight: bold;
        color: #111;
        background: #fff;
        padding: 1rem 2rem;
        border-radius: 16px;
        border: 4px solid #222;
        box-shadow: 6px 6px 0 #000;
    }

    .exam-card {
        background-color: #fffef7;
        border: 4px solid #111;
        border-radius: 20px;
        padding: 2rem;
        max-width: 740px;
        width: 100%;
        box-shadow: 5px 5px 0 #000;
        margin-bottom: 2rem;
        transform: rotate(0.5deg);
    }

    .exam-card__title {
        font-size: 2rem;
        margin-bottom: 1.2rem;
        font-weight: bold;
        color: #000;
        border-bottom: 3px dashed #222;
        padding-bottom: 0.4rem;
        text-shadow: 1px 1px #fff;
    }

    .exam-card__text,
    .exam-card__question {
        font-size: 1.15rem;
        display: flex;
        margin-bottom: 1rem;
        color: #333;
        line-height: 1.6;
    }

    .exam-card__options {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .exam-card__option-with-sound {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .exam-card__button {
        background: #fff;
        border: 3px solid #111;
        box-shadow: 4px 4px 0 #000;
        padding: 0.8rem 1.4rem;
        font-size: 1.1rem;
        font-weight: bold;
        border-radius: 12px;
        cursor: pointer;
        transition: 0.2s ease;
        font-family: 'Comic Neue', cursive;
        transform: rotate(-1deg);
    }

    .exam-card__button:hover {
        background: #ffeb3b;
        box-shadow: 2px 2px 0 #000;
        transform: translateY(-2px) rotate(1deg);
    }

    .exam-card__textarea {
        width: 100%;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 12px;
        border: 3px solid #111;
        resize: vertical;
        margin-bottom: 1rem;
        box-shadow: inset 3px 3px 0 #bbb;
        background: #fffef7;
        font-family: 'Comic Neue', cursive;
    }
</style>

