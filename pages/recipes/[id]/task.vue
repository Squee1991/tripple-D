<template>
    <div class="dialogue-scene">
        <div class="dialogue-scene__chef-container">
            <img :src="chefImage" alt="Шеф-повар Артикль" class="dialogue-scene__chef-img"/>
        </div>
        <div class="dialogue-scene__main-content">
            <div class="dialogue-scene__header">
                <h1>{{ recipe?.title }}</h1>
                <span v-if="dayData">День {{ dayData.day }}</span>
            </div>
            <div ref="messageListEl" class="dialogue-scene__messages">
                <div v-for="(msg, index) in displayedMessages" :key="index" class="message-bubble">
                    <div class="message-bubble__content">
                        <span v-if="!msg.line.includes('___')">{{ msg.line }}</span>
                        <span v-else>
                            {{ msg.line.split('___')[0] }}
                            <span class="blank" :class="msg.status">
                                {{ msg.filledArticle || '___' }}
                            </span>
                            {{ msg.line.split('___')[1] }}
                        </span>
                    </div>
                </div>
                <div v-if="isTyping" class="message-bubble">
                    <div class="message-bubble__content typing-indicator"><span></span><span></span><span></span></div>
                </div>
            </div>
            <div class="dialogue-scene__footer">
                <div v-if="activeTask && !isTaskAnswered" class="article-test">
                    <div class="article-test__buttons">
                        <button
                                v-for="article in articleChoices"
                                :key="article"
                                @click="checkArticle(article)"
                                class="article-test__button"
                                :class="`article-test__button--${article}`"
                        >
                            {{ article }}
                        </button>
                    </div>
                </div>
                <div v-if="isDayFinished" class="day-finished-message">
                    <p>Отлично! Задание на сегодня выполнено.</p>
                    <button @click="backToThemes" class="start-button">К другим темам</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, computed, onMounted, nextTick, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useQuestStore} from '../../../store/questStore.js'
import ChefHi from '../../../assets/images/chefHi.svg'
import ChefOk from '../../../assets/images/ok.svg'
import ChefNo from '../../../assets/images/no.svg'

const questStore = useQuestStore()
const router = useRouter()
const route = useRoute()

const recipe = computed(() => questStore.currentRecipe)
const dayData = computed(() => questStore.currentDay)

const dialogueScript = ref([])
const displayedMessages = ref([])
const isTyping = ref(false)
const activeTaskIndex = ref(-1)
const isTaskAnswered = ref(false)
const chefImage = ref(ChefHi)
const articleChoices = ref([])
const messageListEl = ref(null)
const isDayFinished = ref(false)

const activeTask = computed(() => {
    if (activeTaskIndex.value === -1) return null
    return displayedMessages.value[activeTaskIndex.value]
})

const playScript = async () => {
    if (dialogueScript.value.length === 0) return
    for (const [index, message] of dialogueScript.value.entries()) {
        if (index < displayedMessages.value.length) continue
        isTyping.value = true
        await new Promise(res => setTimeout(res, 1200))
        isTyping.value = false
        const messageObject = {...message, filledArticle: '', status: ''}
        displayedMessages.value.push(messageObject)

        if (message.line.includes('___')) {
            activeTaskIndex.value = index
            generateArticleChoices(message.article)
            return
        }
    }
    isDayFinished.value = true
    chefImage.value = ChefOk

    if (!(await questStore.isRecipeCooldown(recipe.value.id))) {
        await questStore.markRecipeAsCompleted(recipe.value.id)
    }
}

const checkArticle = async (chosenArticle) => {
    isTaskAnswered.value = true
    const task = activeTask.value

    if (chosenArticle === task.article) {
        task.status = 'correct'
        chefImage.value = ChefOk
    } else {
        task.status = 'incorrect'
        chefImage.value = ChefNo
    }

    task.filledArticle = task.article

    await new Promise(res => setTimeout(res, 1500))
    isTaskAnswered.value = false
    activeTaskIndex.value = -1
    chefImage.value = ChefHi
    await playScript()
}

const backToThemes = () => {
    router.push('/recipes')
}

function generateArticleChoices(correctArticle) {
    const possibleArticles = [
        'der', 'die', 'das',
        'den', 'dem', 'des',
        'ein', 'eine', 'einen', 'einem', 'eines'
    ]

    const incorrects = possibleArticles.filter(a => a !== correctArticle)
    const randomIncorrects = incorrects.sort(() => 0.5 - Math.random()).slice(0, 2)
    const allChoices = [correctArticle, ...randomIncorrects].sort(() => 0.5 - Math.random())

    articleChoices.value = allChoices
}

onMounted(async () => {
    const recipeId = route.params.id

    await questStore.loadRecipeById(recipeId)

    if (await questStore.isRecipeCooldown(recipeId)) {
        const remaining = await questStore.getRemainingCooldown(recipeId)
        displayedMessages.value.push({
            line: `Ты уже готовил это блюдо! Возвращайся через ${remaining} секунд.`
        })
        return
    }

    if (recipe.value?.dialogue) {
        dialogueScript.value = recipe.value.dialogue
        playScript()
    } else {
        displayedMessages.value.push({line: 'Упс! Не удалось загрузить диалог.'})
    }
})

watch(displayedMessages, () => {
    nextTick(() => {
        if (messageListEl.value)
            messageListEl.value.scrollTop = messageListEl.value.scrollHeight
    })
}, {deep: true})
</script>


<style scoped>

.dialogue-scene {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f3f4f6;
    display: flex;
    font-family: 'Fredoka', sans-serif;
}

.dialogue-scene__chef-container {
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e0e7ff;
    padding: 2rem;
}

.dialogue-scene__chef-img {
    max-width: 100%;
    max-height: 80%;
    object-fit: contain;
}

.dialogue-scene__main-content {
    width: 60%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

.dialogue-scene__header {
    padding: 1.5rem 2rem;
    border-bottom: 2px solid #f3f4f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dialogue-scene__header h1 {
    font-size: 1.8rem;
    font-weight: 600;
}

.dialogue-scene__header span {
    font-size: 1rem;
    background: #eef2ff;
    padding: 0.5rem 1rem;
    border-radius: 99px;
}

.dialogue-scene__messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.dialogue-scene__footer {
    min-height: 180px;
    padding: 1.5rem;
    background-color: #f9fafb;
    border-top: 2px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
}

.message-bubble {
    display: inline-block;
    animation: fadeIn 0.5s;
    max-width: fit-content;
}

.message-bubble__content {
    max-width: 100%;
    padding: 1rem 1.5rem;
    border-radius: 20px;
    line-height: 1.6;
    font-size: 1.1rem;
    background-color: #eef2ff;
    border-bottom-left-radius: 5px;
}

.blank {
    display: inline-block;
    min-width: 60px;
    padding: 0 8px;
    border-bottom: 2px solid #a5b4fc;
    color: #4338ca;
    font-weight: 600;
    text-align: center;
    transition: all 0.3s;
}

.blank.correct {
    background-color: #dcfce7;
    border-color: #22c55e;
    color: #166534;
    border-radius: 4px;
}

.blank.incorrect {
    background-color: #fee2e2;
    border-color: #ef4444;
    color: #991b1b;
    border-radius: 4px;
}

.article-test {
    width: 100%;
    text-align: center;
}

.article-test__buttons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
}

.article-test__button, .start-button, .back-button {
    font-size: 1.2rem;
    padding: 1.2rem 2.5rem;
    font-family: 'Fredoka', sans-serif;
    font-weight: 500;
    border-radius: 16px;
    border: 3px solid #111827;
    box-shadow: 6px 6px 0px #d1d5db;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
}

.article-test__button:hover, .start-button:hover, .back-button:hover {
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0px #d1d5db;
}

.day-finished-message {
    text-align: center;
}

.day-finished-message p {
    font-size: 1.2rem;
    font-weight: 500;
    color: #4b5563;
}

.back-button {
    margin-top: 1rem;
    background-color: #fff;
}

.typing-indicator span {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #9ca3af;
    border-radius: 50%;
    margin: 0 2px;
    animation: bounce 1.2s infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce {
    0%, 60%, 100% {
        transform: translateY(0);
    }
    30% {
        transform: translateY(-8px);
    }
}

@media (max-width: 768px) {
    .dialogue-scene {
        flex-direction: column;

    }

    /* Полностью скрываем блок с поваром на мобильных устройствах */
    .dialogue-scene__chef-container {
        display: none;
    }

    /* Основной контент теперь занимает 100% высоты и ширины */
    .dialogue-scene__main-content {
        width: 100%;
        height: 100%; /* Занимает всю высоту родителя, так как повар скрыт */
    }

    /* --- Остальные стили остаются такими же --- */
    .dialogue-scene__header {
        padding: 1rem 1.5rem;
    }

    .dialogue-scene__header h1 {
        font-size: 1.4rem;
    }

    .dialogue-scene__header span {
        font-size: 0.9rem;
        padding: 0.4rem 0.8rem;
    }

    .dialogue-scene__messages {
        padding: 1.5rem;
        gap: 1rem;
    }

    .message-bubble__content {
        padding: 0.8rem 1.2rem;
        font-size: 1rem;
    }

    .dialogue-scene__footer {
        min-height: auto;
        padding: 1rem;
    }

    .article-test__buttons {
        gap: 1rem;
        flex-wrap: wrap;
    }

    .article-test__button, .start-button {
        font-size: 1rem;
        padding: 0.8rem 1.5rem;
        box-shadow: 4px 4px 0px #d1d5db;
    }

    .article-test__button:hover, .start-button:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #d1d5db;
    }
}
</style>