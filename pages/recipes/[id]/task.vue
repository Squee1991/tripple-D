<template>
  <div class="dialogue-scene">
    <VStopSessionModal
        :show="modalState"
        @confirm="confirmCancel"
        @cancel="cancelExit"
    />
    <div class="dialogue-scene__chef-container">
      <img :src="chefImage" alt="Chef" class="dialogue-scene__chef-img"/>
    </div>
    <div class="dialogue-scene__main-content">
      <div class="dialogue-scene__header">
        <button class="btn-icon-back" @click="modalState = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 class="dialogue__title">{{ recipe?.title }}</h1>
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
import VStopSessionModal from "~/src/components/V-stopSessionModal.vue";

const questStore = useQuestStore()
const router = useRouter()
const route = useRoute()

const recipe = computed(() => questStore.currentRecipe)
const dayData = computed(() => questStore.currentDay)
const modalState = ref(false)
const dialogueScript = ref([])
const displayedMessages = ref([])
const isTyping = ref(false)
const activeTaskIndex = ref(-1)
const isTaskAnswered = ref(false)
const chefImage = ref(ChefHi)
const articleChoices = ref([])
const messageListEl = ref(null)
const isDayFinished = ref(false)


const confirmCancel = () => {
  modalState.value = false
  router.push('/recipes')
}

const cancelExit = () => {
  modalState.value = false
}

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
  top: env(safe-area-inset-top);
  bottom: env(safe-area-inset-bottom) ;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  display: flex;
}

.dialogue-scene__chef-container {
  width: 40%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg);
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
  background-color: var(--bg);
}

.dialogue-scene__header {
  padding: 1.5rem 2rem;
  color: var(--titleColor);
  display: flex;
  align-items: center;
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
  background-color: var(--menuItemsBg);
  border-top: 2px solid var(--tabsSlideBorderColor);
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: env(safe-area-inset-bottom);
}

.message-bubble {
  display: inline-block;
  animation: fadeIn 0.5s;
  max-width: fit-content;
}

.message-bubble__content {
  max-width: 100%;
  padding: 12px 18px;
  border-radius: 20px 20px 20px 5px;
  line-height: 1.6;
  font-size: 1.1rem;
  background-color: #eef2ff;
  border-left: 5px solid #28a421;
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

.dialogue__title {
  margin-left: 15px;
  font-size: 23px;
  font-weight: 600;
  text-shadow: 1px 1px var(--title);
  color: var(--title);
}

.article-test {
  width: 100%;
  text-align: center;
}

.article-test__buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-bottom: env(safe-area-inset-bottom);
}

.article-test__button, .start-button, .back-button {
  font-size: 18px;
  padding: 14px;
  font-family: Nunito, sans-serif;
  font-weight: 600;
  border-radius: 16px;
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  width: 100%;
}

.start-button {
  width: 100%;
  max-width: 768px;
  border-radius: 50px;
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
  .dialogue-scene__chef-container {
    display: none;
  }
  .dialogue-scene__main-content {
    width: 100%;
    height: 100%;
    padding-bottom: env(safe-area-inset-bottom)
  }
  .dialogue-scene__header {
    padding: 5px 10px 15px 10px;
  }

  .dialogue-scene__header span {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
  .dialogue-scene__messages {
    padding: 18px;
    gap: 12px;
  }
  .message-bubble__content {
    padding: 12px;
    font-size: 16px;
    font-weight: 600;
  }
  .dialogue-scene__footer {
    padding: 15px 15px 30px 15px;
    border-radius: 10px 10px 0 0;
    min-height: 130px;
  }

  .article-test__buttons {
    gap: 12px;
  }
  .article-test__button, .start-button {
    font-size: 18px;
    padding: 12px 18px;
    width: 100%;
  }
}

.btn-icon-back {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}
</style>