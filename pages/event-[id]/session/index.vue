<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLocalePath } from '#i18n'
import { useEventSessionStore } from '../../../store/eventsStore.js'
import SoundBtn from '~/src/components/soundBtn.vue'

const svgFiles = import.meta.glob('@/assets/images/event-rewards/winter-event/winter-words/*.{svg,SVG}', {
  eager: true,
  query: '?url',
  import: 'default'
});

const getImageUrl = (filePath) => {
  if (!filePath) return '';
  const fileName = filePath.split('/').pop();
  for (const fileKey in svgFiles) {
    if (fileKey.endsWith(fileName)) return svgFiles[fileKey];
  }
  return '';
};

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const eventStore = useEventSessionStore()

const eventId = computed(() => String(route.params.id || ''))
const eventData = ref({ quests: [] })
const isLoading = ref(true)
const isFinished = ref(false)
const currentQuest = computed(() => {
  if (!eventStore.questId) return null;
  return eventData.value.quests.find(quest => quest.id === eventStore.questId) || null;
})

const totalSteps = computed(() => currentQuest.value?.steps?.length || 0)
const currentStep = computed(() => currentQuest.value?.steps?.[eventStore.stepIndex] || null)
const isPerfectRun = computed(() => eventStore.score === totalSteps.value)

async function loadEventJson() {
  isLoading.value = true
  try {
    const jsonResponse = await $fetch(`/events/event-${eventId.value}.json`)
    eventData.value = (jsonResponse && Array.isArray(jsonResponse.quests)) ? jsonResponse : { quests: [] }
  } catch (error) {
    console.error("Failed to load event data", error)
    eventData.value = { quests: [] }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  if (!eventStore.eventId || eventStore.eventId !== eventId.value) {
    const restorationSuccess = await eventStore.restoreIfPossible(eventId.value)
    if (!restorationSuccess) {
      return router.replace({ name: 'event-id', params: { id: eventId.value } })
    }
  }
  await loadEventJson()
  if (!currentQuest.value) {
    router.replace({ name: 'event-id', params: { id: eventId.value } })
  }
})

const selectedOptionIndex = ref(null)
const userTextInput = ref('')
const checkStatus = ref(null)

const matchingState = ref({
  leftItemId: null,
  rightItemId: null,
  chosenPairs: []
})
const wrongPairIndices = ref(new Set())

watch(currentStep, () => {
  selectedOptionIndex.value = null
  userTextInput.value = ''
  checkStatus.value = null
  matchingState.value = { leftItemId: null, rightItemId: null, chosenPairs: [] }
  wrongPairIndices.value = new Set()
})

async function retryQuest() {
  isFinished.value = false
  checkStatus.value = null
  await eventStore.start(eventId.value, currentQuest.value.id)
}

function goToNextStep() {
  if (eventStore.stepIndex + 1 < totalSteps.value) {
    eventStore.next(totalSteps.value)
  } else {
    finishQuest()
  }
}

function finishQuest() {
  const isReplay = eventStore.finished
  eventStore.finishQuest();
  isFinished.value = true
  if (!isReplay && currentQuest.value && isPerfectRun.value) {
    const rewards = {
      coins: currentQuest.value.rewardCoins || 0,
      rep: currentQuest.value.rewardRep || 0
    }
    eventStore.awardQuestCompletion(eventStore.questId, rewards)
  }
}

function goBackHome() {
  router.push(localePath({ name: 'event-id', params: { id: eventId.value } }))
}

const filledSentenceHtml = computed(() => {
  if (currentStep.value?.type !== 'choose-word') return ''
  const sourceText = currentStep.value.sentence || ''

  if (selectedOptionIndex.value == null) {
    return sourceText.replace('___', '<b>___</b>')
  }

  const selectedWord = currentStep.value.options[selectedOptionIndex.value]
  return sourceText.replace('___', `<b>${selectedWord}</b>`)
})

function selectOption(index) {
  if (checkStatus.value !== null) return
  selectedOptionIndex.value = index
}

function confirmSingleChoice() {
  if (checkStatus.value !== null) {
    goToNextStep()
    return
  }

  if (selectedOptionIndex.value === currentStep.value.correctOptionIndex) {
    checkStatus.value = 'correct'
    eventStore.addScore(1);
  } else {
    checkStatus.value = 'wrong'
  }
}

function confirmTextInput() {
  if (checkStatus.value !== null) {
    goToNextStep()
    return
  }

  const correctAnswer = (currentStep.value.answerText || '').trim().toLowerCase()
  const userAnswer = (userTextInput.value || '').trim().toLowerCase()
  if (correctAnswer === '__ANY_NON_EMPTY__') {
    if (userAnswer.length > 0) {
      checkStatus.value = 'correct'
      eventStore.addScore(1)
    } else {
      checkStatus.value = 'wrong'
    }
    return
  }

  if (userAnswer === correctAnswer) {
    checkStatus.value = 'correct'
    eventStore.addScore(1)
  } else {
    checkStatus.value = 'wrong'
  }
}

function selectReadingOption(questionIndex, optionIndex) {
  if (checkStatus.value !== null) return
  if (currentStep.value.questions[questionIndex]) {
    currentStep.value.questions[questionIndex].userAnswer = optionIndex
  }
}

function checkReadingAnswers() {
  if (checkStatus.value !== null) {
    goToNextStep()
    return
  }

  if (!currentStep.value.questions) {
    goToNextStep()
    return
  }

  let isAllCorrect = true
  for (const questionItem of currentStep.value.questions) {
    if (questionItem.userAnswer !== questionItem.correctOptionIndex) {
      isAllCorrect = false
    }
  }

  if (isAllCorrect) {
    checkStatus.value = 'correct'
    eventStore.addScore(currentStep.value.questions.length);
  } else {
    checkStatus.value = 'wrong'
  }
}

const usedLeftIds = computed(() => new Set(matchingState.value.chosenPairs.map(([leftId]) => leftId)))
const usedRightIds = computed(() => new Set(matchingState.value.chosenPairs.map(([, rightId]) => rightId)))

const availableLeftItems = computed(() => {
  return (currentStep.value?.pairsLeft || []).filter(item => !usedLeftIds.value.has(item.id))
})

const availableRightItems = computed(() => {
  return (currentStep.value?.pairsRight || []).filter(item => !usedRightIds.value.has(item.id))
})

function pickLeftItem(id) {
  if (checkStatus.value !== null) return
  matchingState.value.leftItemId = id;
  if (matchingState.value.rightItemId) tryCommitPair()
}

function pickRightItem(id) {
  if (checkStatus.value !== null) return
  matchingState.value.rightItemId = id;
  if (matchingState.value.leftItemId) tryCommitPair()
}

function tryCommitPair() {
  const { leftItemId, rightItemId } = matchingState.value;
  if (!leftItemId || !rightItemId) return;

  matchingState.value.chosenPairs.push([leftItemId, rightItemId]);

  // Сброс выбора
  matchingState.value.leftItemId = null;
  matchingState.value.rightItemId = null
}

function undoPair(index) {
  if (checkStatus.value !== null) return
  matchingState.value.chosenPairs.splice(index, 1);
  wrongPairIndices.value.delete(index);
}

function checkMatchingAnswers() {
  if (checkStatus.value !== null) {
    goToNextStep()
    return
  }

  wrongPairIndices.value = new Set()
  const correctPairsSet = new Set((currentStep.value.correctPairs || []).map(([left, right]) => `${left}|${right}`))

  matchingState.value.chosenPairs.forEach(([leftId, rightId], index) => {
    if (!correctPairsSet.has(`${leftId}|${rightId}`)) {
      wrongPairIndices.value.add(index)
    }
  })

  const isCountCorrect = matchingState.value.chosenPairs.length === (currentStep.value.correctPairs || []).length
  const hasNoErrors = wrongPairIndices.value.size === 0

  if (isCountCorrect && hasNoErrors) {
    checkStatus.value = 'correct'
    eventStore.addScore((currentStep.value.correctPairs || []).length);
  } else {
    checkStatus.value = 'wrong'
  }
}
</script>

<template>
  <div class="lesson">
    <div class="lesson__container">

      <header class="topbar">
        <button class="topbar__back" @click="goBackHome">🏠</button>
        <div class="topbar__score" v-if="!isFinished">Очки: {{ eventStore.score }}</div>
      </header>

      <div v-if="isLoading" class="lesson__state">
        <div class="loader"></div>
        <div>Загрузка…</div>
      </div>

      <div v-else-if="isFinished" class="result-wrapper">
        <div v-if="isPerfectRun" class="result card success-card">
          <div class="result__icon">🎉</div>
          <h2 class="result__title">Идеально!</h2>
          <p class="result__text">Вы ответили верно на все {{ totalSteps }} вопросов.</p>
          <div class="rewards" v-if="currentQuest.rewardCoins">
            <span>+{{ currentQuest.rewardCoins }} ❄</span>
            <span>+{{ currentQuest.rewardRep }} 🏆</span>
          </div>
          <button class="btn btn--primary" @click="goBackHome">Забрать награду</button>
        </div>

        <div v-else class="result card fail-card">
          <div class="result__icon">😕</div>
          <h2 class="result__title">Почти получилось</h2>
          <p class="result__subtext">Чтобы получить награду, нужно пройти без ошибок.</p>

          <div class="result__actions">
            <button class="btn btn--primary" @click="retryQuest">Попробовать снова</button>
            <button class="btn btn--ghost" @click="goBackHome">Выйти</button>
          </div>
        </div>
      </div>

      <div v-else-if="!currentQuest" class="lesson__state">
        Квест не найден
        <button class="btn btn--ghost" @click="goBackHome">Назад</button>
      </div>

      <div v-else class="lesson__card">

        <div class="progress">
          <div class="progress__text">Вопрос {{ eventStore.stepIndex + 1 }} / {{ totalSteps }}</div>
          <div class="progress__bar">
            <div class="progress__fill"
                 :style="{ width: (totalSteps ? (eventStore.stepIndex / totalSteps * 100) : 0) + '%' }"></div>
          </div>
        </div>

        <section v-if="currentStep.type === 'reading'" class="section card">
          <div class="paper">
            <SoundBtn :text="currentStep.text"/>
            <h3 class="section__title">Прослушайте текст и ответьте на вопросы</h3>
          </div>
          <div v-if="currentStep.questions && currentStep.questions.length" class="reading">
            <div v-for="(questionItem, questionIndex) in currentStep.questions" :key="questionIndex" class="reading__item">
              <p class="question">{{ questionIndex + 1 }}. {{ questionItem.question }}</p>
              <div class="choices">
                <button
                    v-for="(optionText, optionIndex) in questionItem.options"
                    :key="optionIndex"
                    class="option"
                    :class="{
                      'chosen': questionItem.userAnswer === optionIndex && checkStatus === null,
                      'correct': (checkStatus !== null && questionItem.userAnswer === optionIndex && optionIndex === questionItem.correctOptionIndex) || (checkStatus === 'wrong' && optionIndex === questionItem.correctOptionIndex),
                      'wrong': (checkStatus !== null && questionItem.userAnswer === optionIndex && optionIndex !== questionItem.correctOptionIndex)
                    }"
                    @click="selectReadingOption(questionIndex, optionIndex)"
                >
                  <span class="option__text">{{ optionText }}</span>
                </button>
              </div>
            </div>
            <div class="actions">
              <button class="btn btn--primary" @click="checkReadingAnswers">
                {{ checkStatus === null ? 'Проверить' : 'Далее' }}
              </button>
            </div>
            <div v-if="checkStatus === 'correct'" class="hint hint--success">Верно!</div>
            <div v-if="checkStatus === 'wrong'" class="hint hint--error">Есть ошибки.</div>
          </div>
          <div v-else class="actions">
            <button class="btn btn--primary" @click="goToNextStep">Далее</button>
          </div>
        </section>

        <section v-else-if="currentStep.type === 'mcq' || currentStep.type === 'multiple-choice'" class="section card">
          <p v-if="currentStep.question" class="question">{{ currentStep.question }}</p>

          <img class="question-image"
               v-if="currentStep.image"
               :src="getImageUrl(currentStep.image)"
               alt="Task image">

          <div class="choices">
            <button
                v-for="(optionText, optionIndex) in currentStep.options"
                :key="optionIndex"
                class="option"
                :class="{
                  'chosen': selectedOptionIndex === optionIndex && checkStatus === null,
                  'correct': (checkStatus === 'correct' && selectedOptionIndex === optionIndex) || (checkStatus === 'wrong' && optionIndex === currentStep.correctOptionIndex),
                  'wrong': checkStatus === 'wrong' && selectedOptionIndex === optionIndex && selectedOptionIndex !== currentStep.correctOptionIndex
                }"
                @click="selectOption(optionIndex)"
            >
              <span class="option__text">{{ optionText }}</span>
            </button>
          </div>

          <div class="actions">
            <button class="btn btn--primary" @click="confirmSingleChoice" :disabled="selectedOptionIndex === null && checkStatus === null">
              {{ checkStatus === null ? 'Проверить' : 'Далее' }}
            </button>
          </div>
          <div v-if="checkStatus === 'correct'" class="hint hint--success">Верно!</div>
          <div v-if="checkStatus === 'wrong'" class="hint hint--error">Неверно! Правильный ответ выделен.</div>
        </section>

        <section v-else-if="currentStep.type === 'choose-word'" class="section card">
          <p class="question" v-html="filledSentenceHtml"></p>
          <div class="choices">
            <button
                v-for="(optionText, optionIndex) in currentStep.options"
                :key="optionIndex"
                class="option"
                :class="{
                  'chosen': selectedOptionIndex === optionIndex && checkStatus === null,
                  'correct': (checkStatus === 'correct' && selectedOptionIndex === optionIndex) || (checkStatus === 'wrong' && optionIndex === currentStep.correctOptionIndex),
                  'wrong': checkStatus === 'wrong' && selectedOptionIndex === optionIndex && selectedOptionIndex !== currentStep.correctOptionIndex
                }"
                @click="selectOption(optionIndex)"
            >
              <span class="option__text">{{ optionText }}</span>
            </button>
          </div>
          <div class="actions">
            <button class="btn btn--primary" @click="confirmSingleChoice" :disabled="selectedOptionIndex === null && checkStatus === null">
              {{ checkStatus === null ? 'Проверить' : 'Далее' }}
            </button>
          </div>
          <div v-if="checkStatus === 'correct'" class="hint hint--success">Верно!</div>
          <div v-if="checkStatus === 'wrong'" class="hint hint--error">Неверно! Правильный ответ выделен.</div>
        </section>

        <section v-else-if="currentStep.type === 'fill'" class="section card">
          <h3 class="section__title">Впиши ответ</h3>
          <p class="question">{{ currentStep.prompt }}</p>
          <div class="field">
            <input v-model="userTextInput" class="field__input" placeholder="Ваш ответ" @keyup.enter="confirmTextInput" :disabled="checkStatus !== null"/>
            <button class="btn" @click="confirmTextInput">
              {{ checkStatus === null ? 'Проверить' : 'Далее' }}
            </button>
          </div>
          <div v-if="checkStatus === 'correct'" class="hint hint--success">Верно!</div>
          <div v-if="checkStatus === 'wrong'" class="hint hint--error">Ошибка! Правильный ответ: <b>{{ currentStep.answerText }}</b></div>
        </section>

        <section v-else-if="currentStep.type === 'matching'" class="section card">
          <h3 class="section__title">{{ currentStep.instruction || 'Соедини пары' }}</h3>
          <div class="match">
            <div class="match__cols">
              <div class="match__col">
                <button v-for="leftItem in availableLeftItems"
                        :key="leftItem.id"
                        class="option"
                        :class="{ chosen: matchingState.leftItemId === leftItem.id }"
                        @click="pickLeftItem(leftItem.id)">
                  {{ leftItem.text }}
                </button>
              </div>
              <div class="match__col">
                <button v-for="rightItem in availableRightItems"
                        :key="rightItem.id"
                        class="option"
                        :class="{ chosen: matchingState.rightItemId === rightItem.id }"
                        @click="pickRightItem(rightItem.id)">
                  {{ rightItem.text }}
                </button>
              </div>
            </div>

            <div class="pairs">
              <div
                  v-for="(pairArray, pairIndex) in matchingState.chosenPairs"
                  :key="pairIndex"
                  class="pair-chip"
                  :class="{
                    wrong: checkStatus === 'wrong' && wrongPairIndices.has(pairIndex),
                    correct: (checkStatus === 'correct') || (checkStatus === 'wrong' && !wrongPairIndices.has(pairIndex))
                  }"
                  @click="undoPair(pairIndex)"
              >
                {{ (currentStep.pairsLeft.find(item => item.id === pairArray[0])?.text) || pairArray[0] }} —
                {{ (currentStep.pairsRight.find(item => item.id === pairArray[1])?.text) || pairArray[1] }} ✕
              </div>
            </div>

            <div class="actions">
              <button class="btn btn--primary" @click="checkMatchingAnswers">
                {{ checkStatus === null ? 'Проверить' : 'Далее' }}
              </button>
            </div>
            <div v-if="checkStatus === 'correct'" class="hint hint--success">Отлично, всё верно!</div>
            <div v-if="checkStatus === 'wrong'" class="hint hint--error">Есть ошибки.</div>
          </div>
        </section>

        <section v-else class="section card">
          Неизвестный тип: <code>{{ currentStep.type }}</code>
          <button class="btn btn--ghost" @click="goToNextStep">Пропустить</button>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.success-card {
  border: 3px solid #a2dfb6;
  background: #e9f8ee;
}

.fail-card {
  border: 3px solid #f3b5b5;
  background: #fdecec;
}

.result {
  text-align: center;
  gap: 10px;
  max-width: 400px;
}

.result__icon {
  font-size: 50px;
  margin-bottom: 10px;
}

.result__title {
  font-size: 26px;
  font-weight: 900;
  margin-bottom: 5px;
}

.result__text {
  font-size: 18px;
  font-weight: 700;
}

.result__subtext {
  font-size: 16px;
  color: #777;
  margin-bottom: 15px;
}

.rewards {
  display: flex;
  gap: 10px;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  color: #F6A623;
  margin: 10px 0;
}

.result__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.lesson {
  min-height: 100vh;
  padding: 20px 12px 32px;
  font-family: "Nunito", sans-serif;
  color: #1f2a44;
  background: #fff8e6
}

.lesson__container {
  max-width: 880px;
  margin: 0 auto
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px
}

.topbar__back {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12);
  border: none
}

.topbar__back:active {
  box-shadow: 0 4px 10px rgba(26, 41, 66, .18);
  transform: translateY(1px)
}

.topbar__score {
  background: #ffefc2;
  border-radius: 14px;
  padding: 6px 12px;
  font-weight: 900;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12)
}

.lesson__state {
  text-align: center;
  font-weight: 800;
  color: #5b647c;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px 0
}

.loader {
  width: 44px;
  height: 44px;
  border: 5px solid #e3edff;
  border-top-color: #7aa7ff;
  border-radius: 50%;
  margin: 0 auto 6px;
  animation: spin 1s linear infinite
}

@keyframes spin {
  to {
    transform: rotate(360deg)
  }
}

.lesson__card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center
}

.card {
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  border-radius: 20px;
}

.paper {
  display: flex;
  align-items: center;
  gap: 10px
}

.section__title {
  font-weight: 900;
  font-size: 22px;
  color: #0f1a33;
  margin-bottom: 10px;
}

.question {
  font-size: 20px;
  font-weight: 800;
  color: #203055;
  margin: 6px 0 12px
}

.progress {
  width: 420px;
  max-width: 86vw;
  margin: 6px auto 6px
}

.progress__text {
  text-align: center;
  font-size: 13px;
  font-weight: 900;
  color: #5b647c;
  margin-bottom: 6px
}

.progress__bar {
  height: 25px;
  background: #eaf1ff;
  border-radius: 999px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(20, 34, 58, .08)
}

.progress__fill {
  height: 100%;
  background: linear-gradient(90deg, #bcdcff, #869cb9);
  transition: width .25s ease
}

.choices {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
}

.option {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  min-width: 120px;
  border-radius: 16px;
  background: #fff;
  color: #1f2a44;
  font-weight: 800;
  font-size: 15px;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12);
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform .08s, box-shadow .08s, background .2s, filter .2s;
  position: relative
}

.option:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(26, 41, 66, .18)
}

.option.chosen {
  background: #e0efff;
  border-color: #3b82f6;
  box-shadow: 0 8px 20px rgba(59, 130, 246, .25);
}

.option.correct {
  background: #e9f8ee;
  color: #0f6a36;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12), 0 0 0 2px #a2dfb6 inset;
  border-color: #a2dfb6;
}

.option.wrong {
  background: #fdecec;
  color: #9b1c1c;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12), 0 0 0 2px #f3b5b5 inset;
  border-color: #f3b5b5;
}

.option__text {
  pointer-events: none
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 12px
}

.hint {
  font-weight: 900;
  text-align: center;
  margin-top: 10px
}

.hint--error {
  color: #9b1c1c
}

.hint--success {
  color: #0f6a36;
}

.btn {
  border: none;
  border-radius: 14px;
  padding: 12px 20px;
  min-width: 300px;
  font-weight: 900;
  cursor: pointer;
  font-size: 18px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12)
}

.btn--primary {
  background: #e7f0ff
}

.btn--ghost {
  background: #fff
}

.btn:disabled {
  opacity: .5;
  cursor: not-allowed
}

.btn:active {
  box-shadow: 0 4px 10px rgba(26, 41, 66, .18);
  transform: translateY(1px)
}

.field {
  display: flex;
  gap: 10px;
  align-items: center
}

.field__input {
  height: 46px;
  padding: 0 14px;
  border-radius: 14px;
  border: none;
  outline: none;
  font-weight: 800;
  color: #1f2a44;
  background: #fff;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12)
}

.reading {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 10px
}

.reading__item {
  display: flex;
  flex-direction: column;
  gap: 8px
}

.match {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%
}

.match__cols {
  display: flex;
  gap: 12px;
  align-items: stretch
}

.match__col {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: 8px
}

.pairs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px
}

.pair-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
  border-radius: 14px;
  padding: 8px 12px;
  font-weight: 900;
  background: #fff;
  color: #1f2a44;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12);
  cursor: pointer;
  transition: transform .08s, box-shadow .08s, background .2s
}



.pair-chip:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(26, 41, 66, .18)
}

.pair-chip.correct {
  background: #e9f8ee;
  color: #0f6a36;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12), 0 0 0 2px #a2dfb6 inset
}

.pair-chip.wrong {
  background: #fdecec;
  color: #9b1c1c;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12), 0 0 0 2px #f3b5b5 inset
}

.question-image {
  width: 160px;
  height: 160px;
  display: block;
  padding: 8px;
}

@media (max-width: 540px) {
  .choices {
    width: 100%;
  }
  .option {
    width: 100%;
    max-width: 330px;
  }
  .question {
    font-size: 17px;
    text-align: center;
  }
  .section__title{
    font-size: 19px;
  }
  .lesson {
    padding: 0;
  }
  .lesson__container {
    padding: 5px;
  }
  .topbar {
    padding: 5px 10px;
  }
}

@media (max-width: 767px) {
  .choices{
    justify-content: center;
  }
  .option {
    min-height: 66px;
    font-size: 14px;
  }
}

@media (min-width: 1024px) {
  .option:hover {
    transform: translateY(-1px) rotate(-.3deg)
  }

  .pair-chip:hover {
    transform: translateY(-1px) rotate(.2deg)
  }
}

</style>