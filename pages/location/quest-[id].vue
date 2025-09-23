<template>
    <div>
        <div class="quest">
            <button class="quest__back-btn" @click="openLeave('back')">×</button>
            <div v-if="questStore.finished && questStore.success" class="quest__stamp quest__stamp--ok">ПРОЙДЕНО</div>
            <div v-if="questStore.loading" class="quest__panel quest__panel--loading">Загрузка квеста...</div>
            <div v-else-if="questStore.error" class="quest__panel quest__panel--error">
                Ошибка: {{ questStore.error }}
                <div class="quest__tiny">questId: {{ questId }} | region: {{ regionKey || '—' }}</div>
                <button class="btn" @click="goThemes">Назад к темам</button>
            </div>
            <div v-else-if="questStore.task" class="quest__card">
                <div class="quest__top">
                    <div class="quest__stat">
                        <div class="quest__stat-value">
                            {{ questStore.currentIndex + 1 }} / {{ questStore.requiredTasks }}
                        </div>
                        <div class="quest__progress-line">
                            <template v-for="(step, i) in progressSteps" :key="i">
                                <div
                                        class="quest__dot"
                                        :class="{
        'quest__dot--done': step === 'done',
        'quest__dot--wrong': step === 'wrong',
        'quest__dot--current': step === 'current',
      }"
                                ></div>
                            </template>
                        </div>
                    </div>
                    <div class="quest__lives" v-if="!previouslyCleared">
                        <div class="quest__hearts">
              <span
                      v-for="life in questStore.maxLives"
                      :key="life"
                      class="quest__heart"
                      :class="{ 'quest__heart--lost': life > questStore.lives }"
              >❤️</span>
                        </div>
                    </div>
                </div>
                <div class="quest__section">
                    <div class="quest__question">
                        <template v-if="questStore.task.type === 'input' && questStore.showResult">
                            <span v-html="highlightedQuestion"></span>
                        </template>
                        <template v-else>
                            <template v-if="questStore.task?.question">
                                {{ t(questStore.task.question) }}
                            </template>
                        </template>
                    </div>
                    <div class="quest__body">
                        <template v-if="questStore.task.type === 'select' || questStore.task.type === 'readAndAnswer'">
                            <div v-if="questStore.task.text" class="quest__read-text">{{
                                t(questStore.task.text)
                                }}
                            </div>
                            <ul class="quest__options" :class="{ 'quest__options--locked': questStore.showResult }">
                                <li v-for="opt in questStore.task.options" :key="opt">
                                    <button class="quest__option-btn" :class="optionClass(opt)"
                                            @click="handleOptionClick(opt)">
                                        {{ t(opt) }}
                                    </button>
                                </li>
                            </ul>
                        </template>
                        <template v-else-if="questStore.task.type === 'input'">
                            <input
                                    type="text"
                                    class="quest__input"
                                    v-model="questStore.userInput"
                                    :disabled="questStore.showResult"
                                    @keyup.enter="handleClick"
                                    placeholder="Введите ответ..."
                            />
                        </template>
                        <template v-else-if="questStore.task.type === 'speechToText'">
                            <div class="quest__speech">
                                <SoundBtn :text="questStore.task.text"/>
                                <input
                                        type="text"
                                        class="quest__input"
                                        v-model="questStore.userInput"
                                        :disabled="questStore.showResult"
                                        @keyup.enter="handleClick"
                                        placeholder="Напишите услышанное..."
                                />
                            </div>
                        </template>
                        <template v-else-if="questStore.task.type === 'reorder'">
                            <div class="quest__reorder">
                                <div
                                        class="quest__reorder-selection"
                                        :class="{ 'quest__reorder-selection--empty': questStore.reorderSelection.length === 0 }"
                                >
                                    <button
                                            v-for="(word, index) in questStore.reorderSelection"
                                            :key="`${word}-${index}`"
                                            class="quest__word-btn"
                                            @click="questStore.handleReorderWord(word, 'selection')"
                                    >
                                        {{ t(word) }}
                                    </button>
                                </div>
                                <div class="quest__word-bank">
                                    <button
                                            v-for="(word, index) in questStore.reorderBank"
                                            :key="`${word}-${index}`"
                                            class="quest__word-btn"
                                            @click="questStore.handleReorderWord(word, 'bank')"
                                    >
                                        {{ t(word) }}
                                    </button>
                                </div>
                            </div>
                        </template>
                        <template v-else-if="questStore.task.type === 'textToSpeech'">
                            <div class="quest__tts">
                                <p class="quest__tts-text">"{{ t(questStore.task.text) }}"</p>
                                <p class="quest__tts-hint">ℹ️ Нажмите «Ответить», когда будете готовы.</p>
                            </div>
                        </template>
                    </div>
                    <div v-if="questStore.showResult" :class="statusClassComputed" class="quest__feedback">
                        <img class="quest__feedback-icon" :src="questStore.isCorrect ? RightIcon : WrongIcon" alt="">
                        <div class="quest__feedback-text">
                            <div v-if="questStore.isCorrect">Правильно</div>
                            <div class="quest__correct-answer-block" v-else>
                                <div> Правильный ответ:</div>
                                <div> {{ questStore.correctAnswer }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="quest__controls">
                    <button class="btn" :disabled="!questStore.showResult && questStore.isConfirmDisabled"
                            @click="handleClick">
                        {{ questStore.showResult ? 'Далее' : 'Проверить' }}
                    </button>
                </div>
            </div>
            <div v-else-if="questStore.finished && questStore.success && questStore.justAwarded"
                 class="quest-complete quest-complete--solo">
                <div class="quest-complete__title">Квест пройден</div>
                <div class="quest-complete__subtitle">Вы получили награду.</div>
                <div class="quest-complete__actions quest-complete__actions--one">
                    <button class="btn btn--primary" @click="goThemes">Назад к темам</button>
                </div>
            </div>
            <div v-else class="modal">
                <div class="modal__overlay"></div>
                <div class="modal__window">
                    <div class="modal__title">{{ questStore.success ? 'Квест завершён' : 'Квест не пройден' }}</div>
                    <div class="modal__actions">
                        <button class="btn" @click="restart">Ещё раз</button>
                        <button class="btn btn--primary" @click="goThemes">Назад к темам</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="forceRevive || showRevive" class="modal">
            <div class="modal__overlay"></div>
            <div class="modal__window">
                <div class="modal__title">Жизни закончились</div>
                <div class="modal__text">
                    Вы ответили верно {{ questStore.correctCount }} из {{ questStore.requiredTasks }}.<br/>
                    Купите дополнительную жизнь, чтобы продолжить.
                </div>
                <div class="wallet">
                    <div class="wallet__row">
                        <div class="wallet__label">Цена:</div>
                        <div class="wallet__value">10 Артиклюсов</div>
                    </div>
                    <div class="wallet__row">
                        <div class="wallet__label">У вас:</div>
                        <div class="wallet__value">{{ wallet }} Артиклюсов</div>
                    </div>
                </div>
                <div class="modal__actions">
                    <button class="btn" :disabled="!canBuyLife" @click="purchaseLife">
                        {{ canBuyLife ? 'Купить жизнь за 10' : 'Недостаточно' }}
                    </button>
                    <button class="btn btn--primary" @click="goThemes">Назад к темам</button>
                </div>
            </div>
        </div>
        <div v-if="showLeaveModal" class="modal">
            <div class="modal__overlay"></div>
            <div class="modal__window">
                <div class="modal__title">Вы не завершили квест</div>
                <div class="modal__text">Если вы покинете сейчас, прогресс не будет сохранён.</div>
                <div class="modal__actions">
                    <button class="btn btn--danger" @click="confirmLeave">Покинуть</button>
                    <button class="btn btn--primary" @click="stayHere">Продолжить</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, onMounted, ref, watch, watchEffect, nextTick, onBeforeUnmount} from 'vue'
import {useRoute, useRouter, onBeforeRouteLeave} from 'vue-router'
import {userChainStore} from '../../store/chainStore.js'
import {userlangStore} from '../../store/learningStore.js'
import {useI18n} from 'vue-i18n'
import SoundBtn from '~/src/components/soundBtn.vue'
import {playCorrect, playWrong, unlockAudioByUserGesture} from '../../utils/soundManager.js'
import RightIcon from '../../assets/images/location-icons/accept.svg'
import WrongIcon from '../../assets/images/location-icons/cancel.svg'

const PRICE = 10
const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const questStore = userChainStore()
const langStore = userlangStore()
const forceRevive = ref(false)
const questId = computed(() => String(route.params.id || route.params.questId || ''))
const regionKey = computed(() => String(route.query.region || ''))
const progressEntry = computed(() => questStore.questProgress?.[questId.value] || null)
const previouslyCleared = computed(() => !!(progressEntry.value?.success || progressEntry.value?.rewardClaimed))
const wallet = computed(() => Number(langStore.points || 0))
const canBuyLife = computed(() => wallet.value >= PRICE)
const isSpeaking = ref(false)

// Функция для озвучивания текста
async function speakText(text) {
    if (isSpeaking.value || !text) return;

    isSpeaking.value = true;
    try {
        await getSpeechAudio(text.trim());
    } catch (error) {
        console.error('Ошибка при озвучивании:', error);
    } finally {
        isSpeaking.value = false;
    }
}

// ✅ НОВАЯ ФУНКЦИЯ: Обработчик клика по кнопке
function handleOptionClick(opt) {
    // 1. Выполняем первое действие: выбираем ответ
    questStore.choose(opt);

    // 2. Выполняем второе действие: озвучиваем текст этого ответа
    const textToSpeak = t(opt);
    speakText(textToSpeak);
}

const showRevive = computed(() =>
    !previouslyCleared.value &&
    questStore.requiredTasks > 0 &&
    questStore.lives <= 0 &&
    questStore.correctCount < questStore.requiredTasks &&
    !questStore.success
)

const highlightedQuestion = computed(() => {
    if (!questStore.task || !questStore.task.question) {
        return '';
    }
    try {
        if (questStore.task.type !== 'input') {
            return t(questStore.task.question);
        }
    } catch (e) {
        // Если t() выбрасывает ошибку, возвращаем исходный текст
        return questStore.task.question;
    }

    const cls = questStore.isCorrect ? 'filled-answer-correct' : 'filled-answer-wrong'
    return questStore.task.question.replace('___', `<strong class="${cls}">${questStore.correctAnswer}</strong>`)
})

function goThemes() {
    if (regionKey.value) {
        router.push(`/location/${regionKey.value}`)
    }
    // else router.push('/location')
}

function restart() {
    questStore.restart(previouslyCleared.value)
    questStore.loadQuest(questId.value, regionKey.value)
}

function optionClass(opt) {
    if (questStore.showResult) {
        if (opt === questStore.task?.answer) return 'quest__option-btn--correct'
        if (opt === questStore.selected) return 'quest__option-btn--wrong'
        return 'quest__option-btn--dim'
    }
    return questStore.selected === opt ? 'quest__option-btn--chosen' : ''
}

function handleClick() {
    unlockAudioByUserGesture()
    if (!questStore.showResult) {
        questStore.confirm(previouslyCleared.value)
    } else {
        questStore.answers ||= []
        questStore.answers[questStore.currentIndex] = {correct: !!questStore.isCorrect}
        questStore.nextTask(previouslyCleared.value)
    }
}

const statusClassComputed = computed(() => (questStore.isCorrect ? 'is-green' : 'is-red'))

const showLeaveModal = ref(false)
const pendingRoute = ref(null)
let allowLeave = false
const hasDirtyInput = computed(() =>
    !!(questStore.selected ||
        (questStore.userInput && questStore.userInput.trim()) ||
        (questStore.reorderSelection && questStore.reorderSelection.length > 0) ||
        questStore.currentIndex > 0)
)
const shouldBlockLeaving = computed(() =>
    (questStore.sessionStarted && !questStore.finished) || (!questStore.finished && hasDirtyInput.value)
)

function openLeave() {
    if (shouldBlockLeaving.value) {
        pendingRoute.value = goThemes
        showLeaveModal.value = true
    } else {
        goThemes()
    }
}

const progressSteps = computed(() =>
    Array.from({length: questStore.requiredTasks}, (_, i) =>
        i < questStore.currentIndex
            ? (questStore.answers?.[i]?.correct ? 'done' : 'wrong')
            : i === questStore.currentIndex
                ? (questStore.showResult ? (questStore.isCorrect ? 'done' : 'wrong') : 'current')
                : 'pending'
    )
)

onBeforeRouteLeave((to, from, next) => {
    if (!allowLeave && shouldBlockLeaving.value) {
        pendingRoute.value = () => router.push(to)
        showLeaveModal.value = true
        next(false)
    } else next()
})

function confirmLeave() {
    allowLeave = true
    showLeaveModal.value = false
    if (pendingRoute.value) pendingRoute.value()
    else goThemes()
}

function stayHere() {
    pendingRoute.value = null
    showLeaveModal.value = false
}

watch(() => questStore.showResult, (shown) => {
    if (!shown) return
    if (questStore.isCorrect) playCorrect()
    else playWrong()
})

async function trySpendLocal(amount) {
    amount = Number(amount) || 0
    if (amount <= 0) return true
    if ((langStore.points ?? 0) < amount) return false

    langStore.points -= amount
    langStore.articlesSpentForAchievement = Number(langStore.articlesSpentForAchievement || 0) + amount
    if (typeof langStore.saveToFirebase === 'function') {
        try {
            await langStore.saveToFirebase()
        } catch {
        }
    }
    return true
}

async function purchaseLife() {
    if (!canBuyLife.value) return
    const ok = await trySpendLocal(PRICE)
    if (!ok) return
    await questStore.addLife(1)

    if (questStore.finished && !questStore.success) questStore.finished = false
    if (!questStore.sessionStarted) questStore.sessionStarted = true
    forceRevive.value = false
}

function beforeUnloadHandler(e) {
    e.preventDefault()
}

onMounted(async () => {
    await questStore.loadProgressFromFirebase?.()
    await questStore.loadQuest(questId.value, regionKey.value)
    await nextTick()
    forceRevive.value = showRevive.value
    window.addEventListener('beforeunload', beforeUnloadHandler)
})

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeUnloadHandler)
})

watchEffect(() => {
    forceRevive.value = showRevive.value
})

</script>

<style scoped>
.quest {
    min-height: 100svh;
    font-family: "Nunito", sans-serif;
    color: #1e1e1e;
    display: flex;
    flex-direction: column;
    padding: 10px 1.5rem;
}

.quest__panel {
    margin: 0 auto;
    width: 50%;
    text-align: center;
    padding: 18px 20px;
    border-radius: 16px;
    border: 3px solid #1e1e1e;
    background: #fff;
    box-shadow: 4px 4px 0 #1e1e1e;
}

.quest__panel--error {
    background: #ffd5d2;
}

.quest__tiny {
    font-size: 12px;
    opacity: .85;
    margin-top: 6px;
}

.quest__correct-answer-block {
    display: flex;
    flex-direction: column;
    align-items: start;

}

.quest__back-btn {
    position: absolute;
    left: 1.5rem;
    top: 1.5rem;
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    background: #fff;
    color: #1e1e1e;
    font-weight: 900;
    font-size: 22px;
    line-height: 1;
    border: 3px solid #1e1e1e;
    border-radius: 12px;
    box-shadow: 4px 4px 0 #1e1e1e;
    cursor: pointer;
    transition: all .1s ease-in-out;
    z-index: 99;
}

.quest__back-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
}

.quest__back-btn:active {
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 #1e1e1e;
}

.quest__card {
    width: 100%;
    margin: 0 auto;
}

.quest__top {
    position: sticky;
    top: 0;
    max-width: 700px;
    margin: 0 auto;
    width: 100%;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding-top: .25rem;
    margin-bottom: .75rem;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 99px; /* Делаем его овальным */
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.18);
}

.quest__stat {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: .4rem 1rem;
    min-width: 120px;
    gap: 17px;
}

.quest__stat-label, .quest__stat-value {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--titleColor);
}

.quest__lives {
    padding: .5rem 1rem;
    text-align: center;
}

.quest__hearts {
    display: flex;
    gap: .5rem;
    font-size: 1.6rem;
    line-height: 1;
    margin-top: 2px;
}

.quest__heart {
    transition: transform .2s ease, filter .2s ease, opacity .2s ease;
}

.quest__heart--lost {
    transform: scale(.85);
    filter: grayscale(1);
    opacity: .55;
}

.quest__section {
    margin-top: 24px;
    min-height: 250px;
}

.quest__question {
    margin: 0 auto 1rem;
    text-align: center;
    font-size: 1.9rem;
    line-height: 1.25;
    padding: 1rem 1.25rem;
    color: var(--titleColor);
    font-weight: 600;
}

.quest__body {
    width: min(900px, 100%);
    margin: 0 auto 1rem;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.quest__read-text {
    background: #fff;
    border: 3px solid #1e1e1e;
    border-radius: 16px;
    padding: 1rem;
    width: min(860px, 96%);
    margin: 0 auto;
    box-shadow: 4px 4px 0 #1e1e1e;
    font-size: 18px;
}

.quest__options {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: .25rem;
}

.quest__options--locked {
    pointer-events: none;
}

.quest__option-btn {
    min-width: 88px;
    height: 60px;
    padding: 0 18px;
    font-size: 20px;
    font-weight: 800;
    color: #1e1e1e;
    background: #fff;
    border: 3px solid #1e1e1e;
    border-radius: 16px;
    box-shadow: 4px 4px 0 #1e1e1e;
    cursor: pointer;
    transition: all .1s ease-in-out;
}

.quest__option-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
}

.quest__option-btn:active {
    transform: translate(6px, 6px);
    box-shadow: 0 0 0 #1e1e1e;
}

.quest__option-btn--chosen {
    background: #cde8ff;
}

.quest__option-btn--correct {
    background: #b9f5c4 !important;
}

.quest__option-btn--wrong {
    background: #ffd0cc !important;
}

.quest__option-btn--dim {
    opacity: .6;
}

.quest__input {
    width: min(860px, 96%);
    margin: 0 auto;
    display: block;
    padding: 14px 16px;
    font-size: 18px;
    background: #fff;
    color: #1e1e1e;
    border: 3px solid #1e1e1e;
    border-radius: 16px;
    box-shadow: 4px 4px 0 #1e1e1e;
}

.quest__speech {
    display: grid;
    gap: 14px;
}

.quest__reorder {
    display: grid;
    gap: 14px;
    place-items: center;
}

.quest__reorder-selection {
    width: min(860px, 96%);
    padding: 5px 10px;
    min-height: 60px;
    background: #fff;
    border: 3px solid #1e1e1e;
    border-radius: 16px;
    box-shadow: 3px 3px 0 #1e1e1e;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.quest__reorder-selection--empty {
    background: #fffbe9;
}

.quest__word-bank {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.quest__word-btn {
    padding: 10px;
    font-size: 15px;
    font-weight: 600;
    background: #fff;
    color: #1e1e1e;
    border: 3px solid #1e1e1e;
    border-radius: 16px;
    box-shadow: 4px 4px 0 #1e1e1e;
    cursor: pointer;
    transition: all .1s ease-in-out;
}

.quest__tts {
    width: min(860px, 96%);
    margin: 0 auto;
    background: #fff;
    border: 3px solid #1e1e1e;
    border-radius: 16px;
    box-shadow: 4px 4px 0 #1e1e1e;
    padding: 16px;
}

.quest__tts-text {
    font-size: 22px;
    margin: 0 0 6px;
}

.quest__tts-hint {
    opacity: .85;
}

.quest__feedback {
    position: absolute;
    left: 0;
    bottom: 0;
    margin: 0;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 30px 15px;
}

.quest__feedback.is-green {
    color: #3fa65b;
    font-size: 2rem;
    font-weight: 600;
    background: #b9f5c4;
}

.quest__feedback.is-red {
    color: #d9534f;
    font-size: 2rem;
    font-weight: 600;
    font-style: italic;
    background: #ffd0cc;
}

.quest__feedback-icon {
    margin-right: 8px;
    width: 50px;
}

.quest__controls {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: .25rem;
}

.quest__stamp {
    position: fixed;
    right: 24px;
    top: 18px;
    z-index: 50;
    font-weight: 900;
    border: 4px solid #1e1e1e;
    padding: 6px 12px;
    border-radius: 10px;
    box-shadow: 6px 6px 0 #1e1e1e;
    transform: rotate(-6deg);
}

.quest__stamp--ok {
    background: #b9f5c4;
    color: #0f5132;
}

.quest-complete {
    text-align: center;
    padding-top: 60px;
}

.quest-complete__title {
    font-size: 30px;
    font-weight: 900;
    margin-bottom: 10px;
    color: #3fa65b;
}

.quest-complete__subtitle {
    color: #333;
    margin-bottom: 12px;
}

.quest-complete__actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    position: relative;
    background: white;
    padding: 2.5rem;
    border-radius: 24px;
    border: 4px solid #1e1e1e;
    box-shadow: 8px 8px 0 #1e1e1e;
    max-width: 500px;
    width: 90%;
    text-align: center;
    margin: 0 auto;
}

.quest-complete--solo .quest-complete__actions--one {
    justify-content: center;
}

.btn {
    height: 56px;
    padding: 0 26px;
    border-radius: 16px;
    font-family: "Nunito", sans-serif;
    font-weight: 900;
    font-size: 22px;
    border: 3px solid #1e1e1e;
    color: #1e1e1e;
    background: #9dceff;
    cursor: pointer;
    box-shadow: 4px 4px 0 #1e1e1e;
    transition: all .1s ease-in-out;
}

.btn--primary {
    background: #a7ecb8;
}

.btn--danger {
    background: #ffd0cc;
}

.modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
}

.modal__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, .35);
    backdrop-filter: blur(2px);
}

.modal__window {
    position: relative;
    width: min(440px, 92%);
    background: #fff;
    border: 3px solid #111;
    border-radius: 18px;
    box-shadow: 4px 4px 0 #1e1e1e;
    padding: 20px 35px;
    text-align: center;
    z-index: 1;
}

.modal__title {
    font-weight: 900;
    font-size: 28px;
    margin-bottom: 8px;
    color: #111;
}

.modal__text {
    padding: 10px;
}

.modal__actions {
    display: flex;
    justify-content: center;
    flex-direction: column-reverse;
    gap: 12px;
    flex-wrap: wrap;
    padding: 20px;
}

.wallet {
    margin: 8px auto 14px;
    width: min(420px, 100%);
}

.wallet__row {
    display: flex;
    justify-content: center;
    font-weight: 800;
    margin: 4px 0;
    gap: 10px;
}

.wallet__label {
    opacity: .8;
}

@media (max-width: 1023px) {
    .quest__back-btn {
        left: 1rem;
        top: 1rem;
    }

    .quest__top {
        flex-direction: column;
        align-items: center;
        gap: .75rem;
    }

    .quest__lives {
        margin-left: 0;
    }
}

@media (max-width: 767px) {
    .quest__question {
        font-size: 1.2rem;
        border-bottom: 2px solid #9dceff;
        border-radius: 15px;
    }

    .quest__feedback-text {
        font-size: 1.4rem;
    }

    .quest__back-btn {
        font-size: 30px;
        top: 10px;
        left: 0;
        border: none;
        background: none;
        box-shadow: none;
        color: var(--titleColor);
    }

    .quest__feedback {
        position: absolute;
        left: 0;
        bottom: 0;
        margin: 0;
        width: 100%;
        display: flex;
        align-items: center;
        padding: 30px 15px;
    }

    .quest__option-btn {
        height: 47px;
        font-size: 15px;
        box-shadow: 3px 3px 0 black;
        border: 2px solid black;

        padding: 5px;
    }

    .btn {
        height: 52px;
        padding: 0 28px;
        font-size: 20px;
        width: 100%;
    }
}

.quest__progress-line {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    gap: 4px;
}

.quest__dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ccc;
    transition: all 0.3s ease;
}

.quest__dot--done {
    background: #4caf50;
}

.quest__dot--current {
    background: #2196f3;
}

.quest__dot--wrong {
    background: #d9534f;
}


</style>
