<template>
  <div class="session-page">
    <transition name="fade-slide" appear>
      <div class="trainer-app" v-if="isReady && isMounted">
        <div class="trainer-app__board">
          <div v-if="!finished && currentTask" class="board-content">
            <div class="top-nav">
              <VBackBtnNav/>
              <div class="progress-wrapper">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: progressPercentage + '%' }">
                    <div class="glare"></div>
                  </div>
                </div>
              </div>
              <span class="progress-text">{{ completedTaskCount }} / {{ plannedTaskCount }}</span>
            </div>

            <header class="session-header">
              <div class="session__theme">
                <h1 class="session__topic">{{ sessionTitle }}</h1>
              </div>
              <div v-if="taskBadgeText" class="progress-line">
                <span class="task-badge" :class="{ 'task-badge--retry': currentTask.isRetry }">{{ taskBadgeText }}</span>
              </div>
            </header>

            <div class="word-block">
              <div class="mode-exercise" :key="currentTask.id">
                <!-- Знакомство с новым словом -->
                <div v-if="currentType === 'intro'" class="word-info-display">
                  <div class="wordTranslate">
                    <SoundBtn :text="`${currentWord.article} ${currentWord.de}`"/>
                    <div class="german-word">
                      <span class="highlight-word" :class="`article-color--${currentWord.article}`">{{ currentWord.article }}</span>
                      <span class="highlight-word">{{ currentWord.de }}</span>
                    </div>
                  </div>
                  <div class="word-divider">—</div>
                  <div class="translation-word">{{ uiWord }}</div>
                  <p v-if="genderRuleText" class="gender-tip">💡 {{ genderRuleText }}</p>
                  <div v-if="currentWord.plural" class="intro-plural">
                    {{ t('wordLearning.pluralLabel') }}: {{ currentWord.pluralArticle || 'die' }} {{ currentWord.plural }}
                  </div>
                </div>

                <!-- Выбрать перевод немецкого слова -->
                <div v-if="currentType === 'meaning'" class="article-mode-container">
                  <p class="question-text">{{ t('wordLearning.meaningFor') }}</p>
                  <div class="wordTranslate meaning-word">
                    <SoundBtn :text="`${currentWord.article} ${currentWord.de}`"/>
                    <div class="german-word">
                      <span class="highlight-word" :class="`article-color--${currentWord.article}`">{{ currentWord.article }}</span>
                      <span class="highlight-word">{{ currentWord.de }}</span>
                    </div>
                  </div>
                  <div class="meaning-options">
                    <button
                        v-for="option in meaningOptions"
                        :key="option"
                        class="meaning-btn"
                        :class="{
                          'is-correct': result && option === uiWord,
                          'is-wrong': result === 'wrong' && userInput === option
                        }"
                        :disabled="result !== ''"
                        @click="chooseOption(option)"
                    >
                      {{ option }}
                    </button>
                  </div>
                </div>

                <!-- Выбрать артикль -->
                <div v-if="currentType === 'article'" class="article-mode-container">
                  <p class="question-text">{{ t('sessionLabels.articleFor') }} <span
                      class="highlight-word">{{ currentWord.de }}</span>:</p>
                  <div class="article-options">
                    <button
                        v-for="article in ['der', 'die', 'das']"
                        :key="article"
                        class="article-btn"
                        :class="[
                          article,
                          {
                            'is-correct': result === 'correct' && userInput === article,
                            'is-wrong': result === 'wrong' && userInput === article,
                            'is-revealed': result === 'wrong' && currentWord.article === article
                          }
                        ]"
                        :disabled="result !== ''"
                        @click="chooseOption(article)"
                    >
                      {{ article }}
                    </button>
                  </div>
                </div>

                <!-- Собрать слово из букв -->
                <div v-if="currentType === 'letters'">
                  <div class="question__content">
                    <p class="question-text">{{ t('sessionLabels.lettersFor') }}:&nbsp;</p>
                    <span class="highlight-word">{{ uiWord }}</span>
                  </div>

                  <div class="assembled-letters-box"
                       :class="{ 'is-wrong-box': result === 'wrong', 'is-correct-box': result === 'correct' }">
                    <span
                        v-for="(letterItem, letterPosition) in selectedLetters"
                        :key="'selected-' + letterPosition"
                        class="assembled-char"
                        @click="!result && removeLetter(letterPosition)"
                    >
                      {{ letterItem.char === ' ' ? '␣' : letterItem.char }}
                    </span>
                    <span v-if="selectedLetters.length === 0" class="placeholder-text">...</span>
                  </div>

                  <div class="letters">
                    <button
                        v-for="(letter, letterPosition) in shuffledLetters"
                        :key="'shuffled-' + letterPosition"
                        :class="{'is-hidden': usedLetterPositions[letterPosition]}"
                        :disabled="usedLetterPositions[letterPosition] || result !== ''"
                        @click="addLetter(letter, letterPosition)"
                    >
                      {{ letter === ' ' ? '␣' : letter }}
                    </button>
                  </div>
                </div>

                <!-- Написать слово с артиклем по переводу -->
                <div v-if="currentType === 'wordArticle'">
                  <div class="question__content">
                    <p class="question-text"><b>{{ t('sessionLabels.articleWordFor') }}:&nbsp;</b></p>
                    <span class="highlight-word">{{ uiWord }}</span>
                  </div>
                  <input v-model="userInput" class="trainer-app__input" :disabled="result !== ''"
                         autocapitalize="off" autocomplete="off" spellcheck="false" @keyup.enter="checkAnswer"/>
                </div>

                <!-- Множественное число -->
                <div v-if="currentType === 'plural'">
                  <p class="question-text">{{ t('sessionLabels.pluralFor') }}: <span
                      class="highlight-word">{{ currentWord.article }} {{ currentWord.de }}</span></p>
                  <input v-model="userInput" class="trainer-app__input" :disabled="result !== ''"
                         autocapitalize="off" autocomplete="off" spellcheck="false" @keyup.enter="checkAnswer"/>
                </div>

                <!-- На слух -->
                <div v-if="currentType === 'audio'">
                  <p class="question-text">{{ t('wordLearning.audioWithArticle') }}:</p>
                  <button @click="speak(currentWord.de)" class="audio-btn">
                    <img class="megaphones__icon" src="../../assets/images/megaphone.svg" alt="">
                    <span> {{ t('sessionLabels.listen') }}</span>
                  </button>
                  <input v-model="userInput" class="trainer-app__input" :disabled="result !== ''"
                         autocapitalize="off" autocomplete="off" spellcheck="false" @keyup.enter="checkAnswer"/>
                </div>
              </div>

              <div v-if="shouldShowGermanLetters" class="german__letters">
                <button
                    @click="addGermanLetter(letter)"
                    class="german__letters-item"
                    v-for="letter in germanLetters"
                    :key="letter"
                    :disabled="result !== ''"
                >
                  {{ letter }}
                </button>
              </div>
            </div>
          </div>

          <div v-if="!finished && currentTask && (!isChoiceTask || result)" class="actions-wrapper" :class="feedbackClass">
            <div class="actions-container">
              <div v-if="result" class="feedback-text">
                <div v-if="result === 'correct'" class="feedback correct slide-up">
                  {{ t('trainerPage.right') }}
                </div>
                <div v-else class="feedback incorrect shake">
                  <div class="feedback-wrong-header">{{ t('trainerPage.false') }}</div>
                  <div class="correct-answer-text">{{ correctAnswerText }}</div>
                  <div v-if="genderRuleText && isArticleTask" class="feedback-tip">💡 {{ genderRuleText }}</div>
                </div>
              </div>
              <div v-else-if="isAlmostWarningShown" class="feedback almost slide-up">
                {{ t('wordLearning.almostCorrect') }}
              </div>
              <button
                  v-if="!result"
                  class="btn btn-check"
                  @click="currentType === 'intro' ? goToNextTask() : checkAnswer()"
                  :disabled="isChecking || (currentType !== 'intro' && !userInput)"
              >
                {{ currentType === 'intro' ? t('trainerPage.further') : t('sessionPage.btnCheck') }}
              </button>
              <button
                  v-if="result"
                  class="btn slide-up"
                  :class="result === 'correct' ? 'btn-next' : 'btn-wrong'"
                  @click="goToNextTask"
              >
                {{ t('trainerPage.further') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <Transition name="fade-scale">
      <div v-if="shouldShowFinishModal" class="fullscreen-modal">
        <div class="confetti-container" v-if="mistakeWordKeys.size === 0 && confettiParticles.length > 0">
          <div
              v-for="particle in confettiParticles"
              :key="particle.id"
              class="confetti-piece"
              :style="{
                left: particle.left + '%',
                backgroundColor: particle.color,
                animationDelay: particle.delay + 's',
                animationDuration: particle.duration + 's',
                width: particle.width + 'px',
                height: particle.height + 'px'
              }"
          ></div>
        </div>

        <div class="fullscreen-content">
          <div v-if="animStep >= 1" class="step-fade-in">
            <img :src="mistakeWordKeys.size === 0 ? Great : Support" class="status-img bounce-in" alt="Status icon"/>
          </div>
          <div v-if="animStep >= 2" class="step-fade-in">
            <p class="finish-title">{{ finishTitle }}</p>
            <p class="fs-text">{{ finishText }}</p>
            <p v-if="tomorrowReviewCount" class="tomorrow-review">
              {{ t('wordLearning.tomorrowReview', {count: tomorrowReviewCount}) }}
            </p>
            <div class="finish-words">
              <span
                  v-for="word in sessionWords"
                  :key="getWordKey(word)"
                  class="finish-word"
                  :class="{ 'finish-word--mistake': mistakeWordKeys.has(getWordKey(word)) }"
              >
                {{ word.article }} {{ word.de }}
              </span>
            </div>
          </div>
          <div v-if="animStep >= 3" class="step-fade-in full-width-block actions-spacing">
            <div class="fs-actions">
              <button v-if="mistakeWords.length" class="ios-btn-primary fs-action-btn" @click="repeatMistakes">
                {{ t('wordLearning.repeatMistakes', {count: mistakeWords.length}) }}
              </button>
              <button v-if="continueButtonText" class="ios-btn-primary fs-action-btn" @click="continueLearning">
                {{ continueButtonText }}
              </button>
              <button class="ios-btn-secondary fs-link-btn" @click="leaveResultScreen">
                {{ t('sessionLabels.back') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <VStreakModal
        v-model="showStreakModal"
        :streak="authStore.streakCount"
        @close="handleStreakClosed"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onBeforeUnmount, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {userlangStore} from '../../store/learningStore.js'
import {userAuthStore} from '~/store/authStore.js'
import {dailyStore} from '~/store/dailyStore.js'
import {getSpeechAudio} from '../../utils/googleTTS.js'
import {nameMap} from '../../utils/nameMap.js'
import {playWrong, playCorrect, playLevelCompleted, unlockAudioByUserGesture} from '../../utils/soundManager.js'
import {
  LESSON_WORD_COUNT,
  LESSON_STEPS,
  REVIEW_WORD_COUNT,
  getReviewTaskForWord,
  getReviewForecast,
  shuffleList,
  normalizeAnswer,
  isAlmostCorrectAnswer,
  getGenderRule
} from '../../utils/wordReview.js'
import {updateReviewReminders} from '../../utils/reminders.js'
import {useSeoMeta} from '#imports'
import SoundBtn from "~/src/components/soundBtn.vue";
import VBackBtnNav from "~/src/components/V-backBtnNav.vue";
import VStreakModal from '~/src/components/V-streak.vue'
import {showInterstitial} from '../../utils/admob.js';

import Great from '~/assets/images/Greatcon.svg'
import Support from '~/assets/images/Support.svg'

useSeoMeta({robots: 'noindex, nofollow'})

// Два вида занятия:
//  lesson — слова темы проходят шаги урока (LESSON_STEPS).
//           Слова идут группами по 5: группа проходит шаг за шагом вперемешку, потом следующая группа
//  review — повторение слов, у которых наступил срок; задание зависит от уровня слова
const {t, locale} = useI18n()
const {$track} = useNuxtApp()
const store = userlangStore()
const authStore = userAuthStore()
const daily = dailyStore()
const route = useRoute()
const router = useRouter()

const sessionKind = ref('lesson')
const topicKey = ref('')
const lessonWordKeys = ref([])
// Повтор ошибок после занятия — тренировка: уровни повторения не меняются
const isMistakePractice = ref(false)
const allTopicWords = ref({})
const sessionWords = ref([])
const tasks = ref([])
const currentTaskIndex = ref(0)
// Прогресс считаем по заданиям, запланированным в начале: повтор после ошибки не увеличивает общее число,
// а полоска двигается только после правильного ответа
const plannedTaskCount = ref(0)
const completedTaskCount = ref(0)
const mistakeWordKeys = ref(new Set())

const isReady = ref(false)
const isMounted = ref(false)
const finished = ref(false)
const userInput = ref('')
const result = ref('')
const isChecking = ref(false)
const isSpeaking = ref(false)
// Опечатка в одну букву: первый раз даём исправить, ошибкой не считаем
const isAlmostWarningShown = ref(false)
const wasAlmostWarningUsed = ref(false)

const selectedLetters = ref([])
const usedLetterPositions = ref([])
const germanLetters = ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß']

const animStep = ref(0)
const confettiParticles = ref([])

const showStreakModal = ref(false)
const isWaitingForStreakClose = ref(false)
const initialStreak = ref(authStore.streakCount || 0)
const streakWasIncremented = ref(false)

let nextTaskId = 0

watch(() => authStore.streakCount, (newValue) => {
  if (newValue > initialStreak.value) streakWasIncremented.value = true
})

const getWordKey = (word) => `${word.topic}|${word.de}`

const currentTask = computed(() => tasks.value[currentTaskIndex.value] || null)
const currentWord = computed(() => currentTask.value?.word || null)
const currentType = computed(() => currentTask.value?.type || '')

const currentLangKey = computed(() => String(locale.value || '').trim().split('-')[0] || 'en')

const uiWord = computed(() => {
  const word = currentWord.value || {}
  return word[currentLangKey.value] ?? word.en ?? word.ru ?? word.de ?? ''
})

const sessionTitle = computed(() => {
  if (sessionKind.value === 'review' && !topicKey.value) return t('wordLearning.reviewTitle')
  return nameMap[topicKey.value] ? t(nameMap[topicKey.value]) : t('wordLearning.reviewTitle')
})

const taskBadgeText = computed(() => {
  if (currentTask.value?.isRetry || isMistakePractice.value) return t('wordLearning.tryAgain')
  if (currentType.value === 'intro') return t('wordLearning.newWord')
  return ''
})

// Задания с выбором варианта — ответ по нажатию, без кнопки «Проверить»
const isChoiceTask = computed(() => ['article', 'meaning'].includes(currentType.value))
// Задания, где проверяется артикль, — после ошибки в них полезна подсказка по роду
const isArticleTask = computed(() => ['article', 'wordArticle', 'audio'].includes(currentType.value))

const genderRuleText = computed(() => {
  const rule = getGenderRule(currentWord.value)
  return rule ? t('wordLearning.genderRule', rule) : ''
})

// Варианты перевода: верный + до трёх других слов из той же темы (если мало — из любых тем)
const MEANING_OPTION_COUNT = 4
const meaningOptions = computed(() => {
  const word = currentWord.value
  if (!word || currentType.value !== 'meaning') return []
  const getTranslationText = (otherWord) => otherWord[currentLangKey.value] ?? otherWord.en ?? ''
  const correctText = uiWord.value
  const pickOtherTexts = (candidateWords) => [...new Set(candidateWords.map(getTranslationText))]
      .filter(text => text && text !== correctText)
  let otherTexts = shuffleList(pickOtherTexts(allTopicWords.value[word.topic] || []))
  if (otherTexts.length < MEANING_OPTION_COUNT - 1) {
    const allOtherTexts = pickOtherTexts(Object.values(allTopicWords.value).flat())
        .filter(text => !otherTexts.includes(text))
    otherTexts = [...otherTexts, ...shuffleList(allOtherTexts)]
  }
  return shuffleList([correctText, ...otherTexts.slice(0, MEANING_OPTION_COUNT - 1)])
})

const progressPercentage = computed(() => {
  if (!plannedTaskCount.value) return 0
  return Math.min(100, (completedTaskCount.value / plannedTaskCount.value) * 100)
})

const feedbackClass = computed(() => {
  if (!result.value) return ''
  return result.value === 'correct' ? 'correct' : 'incorrect'
})

const shouldShowGermanLetters = computed(() => {
  if (!currentWord.value || !['plural', 'wordArticle', 'letters', 'audio'].includes(currentType.value)) return false
  const textToCheck = currentType.value === 'plural' ? (currentWord.value.plural || '') : (currentWord.value.de || '')
  return germanLetters.some(letter => textToCheck.includes(letter))
})

const shuffledLetters = computed(() => {
  if (!currentWord.value || currentType.value !== 'letters') return []
  return shuffleList(currentWord.value.de.split(''))
})

// Все варианты, которые засчитываются как правильный ответ
const acceptedAnswers = computed(() => {
  const word = currentWord.value
  if (!word) return []
  const withArticle = `${word.article} ${word.de}`
  switch (currentType.value) {
    case 'meaning':
      return [uiWord.value]
    case 'article':
      return [word.article]
    case 'letters':
      return [word.de]
    case 'wordArticle':
      return [withArticle]
    case 'audio':
      return [withArticle]
    case 'plural':
      return [word.plural, `${word.pluralArticle || 'die'} ${word.plural}`]
    default:
      return []
  }
})

const correctAnswerText = computed(() => {
  const word = currentWord.value
  if (!word) return ''
  if (currentType.value === 'plural') return `${word.pluralArticle || 'die'} ${word.plural}`
  if (currentType.value === 'letters') return word.de
  if (currentType.value === 'meaning') return uiWord.value
  return `${word.article} ${word.de}`
})

const shouldShowFinishModal = computed(() => finished.value && !showStreakModal.value && !isWaitingForStreakClose.value)

// Слова урока: выбранные пользователем или вся тема
function getLessonWords() {
  const topicWords = (allTopicWords.value[topicKey.value] || []).map(word => ({...word, topic: topicKey.value}))
  if (!lessonWordKeys.value.length) return topicWords
  return topicWords.filter(word => lessonWordKeys.value.includes(word.de))
}

// Способ обучения → вид задания (карточка «слово — перевод» это знакомство)
const getTaskTypeForMode = (mode) => mode === 'wordTranslate' ? 'intro' : mode

// Слово из words.json (с переводами) для записи из профиля
function findFullWord(savedWord) {
  const topicWords = allTopicWords.value[savedWord.topic] || []
  const fullWord = topicWords.find(word => word.de === savedWord.de)
  return {...savedWord, ...(fullWord || {}), topic: savedWord.topic}
}

const finishTitle = computed(() => sessionKind.value === 'lesson'
    ? t('wordLearning.lessonDoneTitle')
    : t('wordLearning.reviewDoneTitle'))

const finishText = computed(() => {
  if (sessionKind.value === 'lesson' || isMistakePractice.value) {
    return t('wordLearning.lessonWordsText', {count: sessionWords.value.length})
  }
  const correctFirstTry = sessionWords.value.length - mistakeWordKeys.value.size
  return t('wordLearning.reviewDoneText', {correct: correctFirstTry, total: sessionWords.value.length})
})

// Что предложить дальше: ещё порцию повторения (если остались слова, которым пора)
const continueButtonText = computed(() => {
  if (!finished.value || sessionKind.value !== 'review') return ''
  const dueCount = store.getDueWords(topicKey.value || null).length
  return dueCount ? t('wordLearning.reviewMore', {count: dueCount}) : ''
})

// Сколько слов будет ждать повторения завтра — повод вернуться
const tomorrowReviewCount = computed(() => finished.value ? getReviewForecast(store.words, 1)[1] : 0)

const mistakeWords = computed(() => sessionWords.value.filter(word => mistakeWordKeys.value.has(getWordKey(word))))

function buildLessonTasks(lessonWords) {
  const lessonTasks = []
  for (let groupStart = 0; groupStart < lessonWords.length; groupStart += LESSON_WORD_COUNT) {
    const groupWords = lessonWords.slice(groupStart, groupStart + LESSON_WORD_COUNT)
    for (const mode of LESSON_STEPS) {
      const taskType = getTaskTypeForMode(mode)
      // Мн. число — только для слов, у которых оно есть
      const modeWords = taskType === 'plural' ? groupWords.filter(word => String(word.plural || '').trim()) : groupWords
      // Знакомимся по порядку, дальше — вперемешку, чтобы приходилось вспоминать
      const stageWords = taskType === 'intro' ? [...modeWords] : shuffleList(modeWords)
      // Одно и то же слово не должно идти два задания подряд на стыке способов
      const previousTask = lessonTasks[lessonTasks.length - 1]
      if (previousTask && stageWords.length > 1 && stageWords[0] === previousTask.word) {
        ;[stageWords[0], stageWords[1]] = [stageWords[1], stageWords[0]]
      }
      for (const word of stageWords) {
        lessonTasks.push({id: nextTaskId++, word, type: taskType, isRetry: false})
      }
    }
  }
  return lessonTasks
}

function buildReviewTasks(reviewWords) {
  return reviewWords.map(word => ({
    id: nextTaskId++,
    word,
    type: getReviewTaskForWord(store.getWordEntry(word)),
    isRetry: false
  }))
}

function resetTaskState() {
  clearLetters()
  userInput.value = ''
  result.value = ''
  isAlmostWarningShown.value = false
  wasAlmostWarningUsed.value = false
}

// Собирает новое занятие. Возвращает false, если заниматься нечем
// wordsForPractice — повтор ошибок: только эти слова, без изменения уровней
function buildSession(wordsForPractice = null) {
  isMistakePractice.value = !!wordsForPractice
  if (wordsForPractice) {
    sessionWords.value = wordsForPractice
    tasks.value = sessionKind.value === 'lesson'
        ? buildLessonTasks(wordsForPractice)
        : buildReviewTasks(shuffleList(wordsForPractice))
  } else if (sessionKind.value === 'lesson') {
    sessionWords.value = getLessonWords()
    tasks.value = buildLessonTasks(sessionWords.value)
  } else {
    const dueWords = shuffleList(store.getDueWords(topicKey.value || null)).slice(0, REVIEW_WORD_COUNT)
    sessionWords.value = dueWords.map(findFullWord)
    tasks.value = buildReviewTasks(sessionWords.value)
  }
  currentTaskIndex.value = 0
  plannedTaskCount.value = tasks.value.length
  completedTaskCount.value = 0
  mistakeWordKeys.value = new Set()
  finished.value = false
  animStep.value = 0
  confettiParticles.value = []
  resetTaskState()

  if (tasks.value.length && !wordsForPractice) {
    $track(sessionKind.value === 'lesson' ? 'word_lesson_started' : 'word_review_started', {
      topic_id: topicKey.value || 'all',
      words_count: sessionWords.value.length
    })
  }
  return tasks.value.length > 0
}

function addLetter(letter, letterPosition) {
  if (usedLetterPositions.value[letterPosition]) return
  selectedLetters.value.push({char: letter, originalPosition: letterPosition})
  usedLetterPositions.value[letterPosition] = true
  userInput.value = selectedLetters.value.map(letterItem => letterItem.char).join('')
}

function removeLetter(positionInAnswer) {
  const letterItem = selectedLetters.value[positionInAnswer]
  if (letterItem.originalPosition !== -1) {
    usedLetterPositions.value[letterItem.originalPosition] = false
  }
  selectedLetters.value.splice(positionInAnswer, 1)
  userInput.value = selectedLetters.value.map(item => item.char).join('')
}

function clearLetters() {
  selectedLetters.value = []
  usedLetterPositions.value = []
}

function addGermanLetter(letter) {
  userInput.value += letter
  if (currentType.value === 'letters') {
    selectedLetters.value.push({char: letter, originalPosition: -1})
  }
}

function speak(text) {
  if (isSpeaking.value) return
  isSpeaking.value = true
  getSpeechAudio(text)
  setTimeout(() => isSpeaking.value = false, 3000)
}

function chooseOption(option) {
  if (result.value) return
  userInput.value = option
  checkAnswer()
}

function checkAnswer() {
  if (!currentTask.value || isChecking.value || result.value || !userInput.value) return
  isChecking.value = true
  unlockAudioByUserGesture()

  const task = currentTask.value
  const wordKey = getWordKey(task.word)
  const isWordWithoutMistakes = !mistakeWordKeys.value.has(wordKey)
  const isCorrect = acceptedAnswers.value.some(answer => normalizeAnswer(answer) === normalizeAnswer(userInput.value))

  // Опечатка в одну букву — первый раз просим проверить написание, не засчитывая ошибку
  const isTypedTask = ['wordArticle', 'audio', 'plural'].includes(task.type)
  const isAlmostCorrect = !isCorrect && isTypedTask && !wasAlmostWarningUsed.value
      && acceptedAnswers.value.some(answer => isAlmostCorrectAnswer(userInput.value, answer))
  if (isAlmostCorrect) {
    wasAlmostWarningUsed.value = true
    isAlmostWarningShown.value = true
    isChecking.value = false
    return
  }
  isAlmostWarningShown.value = false

  result.value = isCorrect ? 'correct' : 'wrong'
  isCorrect ? playCorrect() : playWrong()

  const isReviewAnswer = sessionKind.value === 'review' && !isMistakePractice.value
  if (isCorrect) {
    completedTaskCount.value++
    if (sessionKind.value === 'lesson') {
      // Очки — только когда способ пройден для слова впервые (как раньше)
      const isNewlyPassed = store.passWordMode(task.word, task.type)
      if (isNewlyPassed) store.rewardCorrectAnswer(task.type)
    } else {
      store.markTaskPassed(task.word, task.type)
      store.rewardCorrectAnswer(task.type)
    }
    if (isReviewAnswer && !task.isRetry && isWordWithoutMistakes) {
      store.applyReviewAnswer(task.word, true)
    }
  } else {
    store.addWrongAnswers(task.word)
    if (isReviewAnswer && isWordWithoutMistakes) {
      store.applyReviewAnswer(task.word, false)
    }
    mistakeWordKeys.value = new Set([...mistakeWordKeys.value, wordKey])
    // Ошибка — задание вернётся в конце занятия
    tasks.value.push({id: nextTaskId++, word: task.word, type: task.type, isRetry: true})
  }

  isChecking.value = false
}

function goToNextTask() {
  // Карточка знакомства без проверки — засчитывается при нажатии «Далее»
  if (currentType.value === 'intro') {
    completedTaskCount.value++
    store.passWordMode(currentWord.value, 'wordTranslate')
  }
  if (currentTaskIndex.value < tasks.value.length - 1) {
    currentTaskIndex.value++
    resetTaskState()
  } else {
    finishSession()
  }
}

// Задание на слух — сразу проигрываем слово
watch(currentTask, (task) => {
  if (task?.type === 'audio' && isReady.value) speak(task.word.de)
})

function spawnConfetti() {
  const confettiColors = ['#ffb100', '#c982ff', '#4caf50', '#00c2ff', '#ff5252', '#ffffff']
  confettiParticles.value = Array.from({length: 70}, (_, particleIndex) => ({
    id: particleIndex,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    duration: 2.5 + Math.random() * 2,
    width: 7 + Math.random() * 8,
    height: 12 + Math.random() * 14
  }))
}

const triggerFinishAnimations = () => {
  playLevelCompleted()
  if (mistakeWordKeys.value.size === 0) spawnConfetti()
  animStep.value = 0
  setTimeout(() => animStep.value = 1, 100)
  setTimeout(() => animStep.value = 2, 600)
  setTimeout(() => animStep.value = 3, 1100)
}

function saveProgress() {
  store.saveToFirebase()
  updateReviewReminders(getReviewForecast(store.words), t)
}

function finishSession() {
  finished.value = true
  saveProgress()
  // Урок или повторение засчитывают серию; повтор ошибок — нет, это повтор того же занятия
  const streakPromise = isMistakePractice.value
      ? Promise.resolve()
      : daily.countStreakForActivity().catch(error => console.error(error))
  if (!isMistakePractice.value) $track(sessionKind.value === 'lesson' ? 'word_lesson_finished' : 'word_review_finished', {
    topic_id: topicKey.value || 'all',
    words_count: sessionWords.value.length,
    words_with_mistakes: mistakeWordKeys.value.size
  })

  isWaitingForStreakClose.value = true
  setTimeout(async () => {
    await streakPromise
    const isStreakHigher = authStore.streakCount > initialStreak.value
    const streakCountedToday = daily.currentCycle?.streakCounted || streakWasIncremented.value || isStreakHigher
    const modalAlreadyShownToday = daily.currentCycle?.streakModalShown === true

    if (streakCountedToday && !modalAlreadyShownToday) {
      if (typeof daily.markStreakModalShown === 'function') {
        await daily.markStreakModalShown()
      }
      showStreakModal.value = true
    } else {
      isWaitingForStreakClose.value = false
      triggerFinishAnimations()
    }
  }, 500)
}

const handleStreakClosed = () => {
  showStreakModal.value = false
  isWaitingForStreakClose.value = false
  triggerFinishAnimations()
}

function continueLearning() {
  showInterstitial(() => {
    if (!buildSession()) router.push('/articles')
  })
}

// Ещё раз только слова, в которых были ошибки. Без рекламы — не наказываем за ошибки
function repeatMistakes() {
  const wordsForPractice = [...mistakeWords.value]
  if (!wordsForPractice.length) return
  $track('word_mistakes_repeated', {topic_id: topicKey.value || 'all', words_count: wordsForPractice.length})
  buildSession(wordsForPractice)
}

// Реклама — после занятия, на выходе с результата, а не перед уроком
function leaveResultScreen() {
  showInterstitial(() => {
    router.push('/articles')
  })
}

const saveWhenHidden = () => {
  if (document.visibilityState === 'hidden') saveProgress()
}

onMounted(async () => {
  isMounted.value = true
  initialStreak.value = authStore.streakCount || 0
  const unlockOnce = () => {
    unlockAudioByUserGesture()
    window.removeEventListener('pointerdown', unlockOnce, {capture: true})
    window.removeEventListener('keydown', unlockOnce, {capture: true})
  }
  window.addEventListener('pointerdown', unlockOnce, {capture: true})
  window.addEventListener('keydown', unlockOnce, {capture: true})

  sessionKind.value = route.query.kind === 'review' ? 'review' : 'lesson'
  topicKey.value = String(route.query.topic || '')
  const toList = (value) => (Array.isArray(value) ? value : [value]).filter(Boolean).map(String)
  lessonWordKeys.value = toList(route.query.words)

  const [, wordsResponse] = await Promise.all([store.loadFromFirebase(), fetch('/words.json')])
  allTopicWords.value = await wordsResponse.json()

  if (!buildSession()) {
    router.replace('/articles')
    return
  }

  isReady.value = true

  document.addEventListener('visibilitychange', saveWhenHidden)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', saveWhenHidden)
  if (isReady.value) saveProgress()
})
</script>

<style scoped>
.session-page {
  font-family: "Nunito", sans-serif;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}

.trainer-app {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.trainer-app__board {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.board-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 5px 10px 10px 10px;
}

.question__content {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.progress-wrapper {
  flex: 1;
}

.progress-bar {
  width: 100%;
  height: 25px;
  background: #e8eae5;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #10b981;
  border-radius: 8px 0 0 8px;
  transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.glare {
  background: rgba(255, 255, 255, 0.5);
  position: absolute;
  top: 3px;
  left: 8px;
  right: 8px;
  height: 4px;
  border-radius: 4px;
}

.progress-fill[style*="width: 100%"] {
  border-radius: 8px;
  border-right: none;
}

.progress-text {
  font-weight: 900;
  color: var(--titleColor);
  font-size: 16px;
}

.session-header {
  border-bottom: 3px solid #f3f4f6;
  padding-bottom: 12px;
  margin-bottom: 16px;
}

.session__theme {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 8px;
}

.session__theme-t {
  font-size: 16px;
  color: var(--titleColor);
  font-weight: 700;
}

.session__topic {
  font-size: 20px;
  color: var(--titleColor);
  font-weight: 900;
  margin: 0;
}

.progress-line {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: var(--titleColor);
  font-weight: 700;
}

.word-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 20px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.word-block::-webkit-scrollbar {
  display: none;
}

.question-text {
  font-size: 16px;
  color: var(--titleColor);
  text-align: center;
  font-weight: 700;
  padding: 0 10px;
}

.question-text b {
  font-weight: 900;
}

.word-info-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  text-align: center;
}

.wordTranslate {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Артикль и слово — отдельные span, пробел между ними задаём отступом */
.german-word {
  display: inline-flex;
  align-items: baseline;
  gap: 0.3em;
  font-size: 22px;
  color: var(--titleColor);
  font-weight: 900;
}

.word-divider {
  font-size: 1.6rem;
  color: #d1d5db;
  margin: 8px 0;
}

.translation-word {
  font-size: 1.6rem;
  color: var(--titleColor);
  font-weight: 700;
}

.article-mode-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gender-tip {
  margin-top: 14px;
  padding: 8px 14px;
  border-radius: 14px;
  background: rgba(255, 177, 0, 0.15);
  color: var(--titleColor);
  font-size: 15px;
  font-weight: 700;
}

.meaning-word {
  margin-top: 16px;
}

.meaning-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  max-width: 360px;
  margin-top: 20px;
  padding: 0 10px;
}

.meaning-btn {
  min-height: 44px;
  padding: 8px 10px;
  border-radius: 14px;
  border: 2px solid #d1d5db;
  box-shadow: 0 3px 0 #d1d5db;
  background: #ffffff;
  color: #1f2937;
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  overflow-wrap: anywhere;
}

.meaning-btn:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: 0 0 0 #d1d5db;
}

.meaning-btn.is-correct {
  border-color: #22c55e;
  box-shadow: 0 3px 0 #16a34a;
  background: #dcfce7;
  color: #15803d;
}

.meaning-btn.is-wrong {
  border-color: #ef4444;
  box-shadow: 0 3px 0 #b91c1c;
  background: #fee2e2;
  color: #b91c1c;
}

.meaning-btn:disabled:not(.is-correct):not(.is-wrong) {
  opacity: 0.5;
  cursor: default;
}

.article-options {
  display: flex;
  gap: 15px;
  width: 100%;
  max-width: 390px;
  margin-top: 28px;
  padding: 0 10px;
}

.article-btn {
  flex: 1;
  padding: 12px 10px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.1s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Nunito", sans-serif;
  font-size: 28px;
  font-weight: 900;
  color: #ffffff;
  text-transform: lowercase;
}

.article-btn:active:not(:disabled) {
  transform: translateY(6px);
}

.article-btn.der {
  background-color: #007AFF;
  box-shadow: 0 6px 0 #005bb5;
}

.article-btn.der:active:not(:disabled) {
  box-shadow: 0 0 0 #005bb5;
}

.article-btn.die {
  background-color: #FF3B30;
  box-shadow: 0 6px 0 #c22820;
}

.article-btn.die:active:not(:disabled) {
  box-shadow: 0 0 0 #c22820;
}

.article-btn.das {
  background-color: #34C759;
  box-shadow: 0 6px 0 #248a3d;
}

.article-btn.das:active:not(:disabled) {
  box-shadow: 0 0 0 #248a3d;
}

.article-btn.is-correct {
  transform: scale(1.04);
}

.article-btn.is-wrong {
  opacity: 0.5;
  filter: grayscale(0.6);
}

.article-btn.is-revealed {
  animation: pulse-correct 0.6s infinite alternate;
}

@keyframes pulse-correct {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.08);
  }
}

.article-btn:disabled:not(.is-correct):not(.is-wrong):not(.is-revealed) {
  opacity: 0.4;
  cursor: default;
}

.trainer-app__input {
  width: 100%;
  padding: 14px 15px;
  font-family: "Nunito", sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  border: 3px solid #e5e7eb;
  background: #ffffff;
  color: #1e1e1e;
  border-radius: 16px;
  transition: all 0.2s;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  margin-bottom: 20px;
}

.trainer-app__input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.15);
}

.trainer-app__input:disabled {
  cursor: default;
  background: #f3f4f6;
  color: #6b7280;
  border-color: #d1d5db;
  box-shadow: none;
}

.assembled-letters-box {
  width: 100%;
  min-height: 58px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 3px solid #e5e7eb;
  border-radius: 16px;
  margin-bottom: 20px;
  transition: all 0.2s;
}

.assembled-letters-box.is-correct-box {
  border-color: #10b981;
  background: #ecfdf5;
}

.assembled-letters-box.is-wrong-box {
  border-color: #ef4444;
  background: #fef2f2;
}

.assembled-char {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 42px;
  background: #3b82f6;
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 900;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 3px 0 #1e3a8a;
  transition: transform 0.1s;
}

.assembled-char:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #1e3a8a;
}

.is-correct-box .assembled-char {
  background: #10b981;
  box-shadow: 0 3px 0 #064e3b;
  cursor: default;
}

.is-wrong-box .assembled-char {
  background: #ef4444;
  box-shadow: 0 3px 0 #7f1d1d;
  cursor: default;
}

.placeholder-text {
  color: #9ca3af;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 2px;
}

.letters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.letters button {
  font-family: "Nunito", sans-serif;
  font-size: 1.4rem;
  font-weight: 900;
  width: 44px;
  height: 52px;
  background: #ffffff;
  color: #1e1e1e;
  border-radius: 12px;
  border: 3px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 0 4px 0 #e5e7eb;
}

.letters button:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}

.letters button.is-hidden {
  opacity: 0;
  pointer-events: none;
}

.german__letters {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 12px 0;
}

.german__letters-item {
  padding: 8px 14px;
  border: 3px solid #e5e7eb;
  background: #ffffff;
  color: #1e1e1e;
  font-size: 1.2rem;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 0 4px 0 #e5e7eb;
}

.german__letters-item:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 transparent;
}

.audio-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #ffffff;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.1s;
  margin: 20px auto;
  box-shadow: 0 3px 0 #1e1e1e;
}

.audio-btn:active {
  transform: translateY(2px);
  box-shadow: 0 1px 0 #1e1e1e;
}

.megaphones__icon {
  width: 20px;
}

.actions-wrapper {
  margin-top: auto;
  padding: 15px 10px calc(env(safe-area-inset-bottom) + 15px) 10px;
  background: transparent;
  transition: background 0.3s ease;
}

.actions-wrapper.correct {
  background: #dcfce7;
}

.actions-wrapper.incorrect {
  background: #fee2e2;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.feedback-text {
  width: 100%;
}

.feedback {
  font-size: 20px;
  font-weight: 900;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feedback.correct {
  color: #15803d;
}

.feedback.incorrect {
  color: #b91c1c;
}

.tomorrow-review {
  display: inline-block;
  margin-top: 10px;
  padding: 6px 14px;
  border-radius: 999px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 15px;
  font-weight: 900;
}

.feedback.almost {
  font-size: 17px;
  color: #b45309;
}

.feedback-tip {
  font-size: 15px;
  font-weight: 700;
  color: #7f1d1d;
}

.feedback-wrong-header {
  font-size: 16px;
  font-weight: 800;
  color: #991b1b;
}

.correct-answer-text {
  font-size: 22px;
  font-weight: 900;
  color: #b91c1c;
}

.btn {
  width: 100%;
  padding: 16px;
  font-family: "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 900;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  transition: all 0.1s ease;
  text-transform: uppercase;
}

.btn:active:not(:disabled) {
  transform: translateY(4px);
}

.btn-check {
  background: #007AFF;
  color: #ffffff;
  box-shadow: 0 5px 0 #005bb5;
}

.btn-check:active:not(:disabled) {
  box-shadow: 0 0 0 transparent;
}

.btn-check:disabled {
  background: #d1d5db;
  color: #9ca3af;
  box-shadow: 0 5px 0 #9ca3af;
  cursor: not-allowed;
}

.btn-next {
  background: #22c55e;
  color: #ffffff;
  box-shadow: 0 5px 0 #15803d;
}

.btn-next:active {
  box-shadow: 0 0 0 transparent;
}

.btn-wrong {
  background: #ef4444;
  color: #ffffff;
  box-shadow: 0 5px 0 #b91c1c;
}

.btn-wrong:active {
  box-shadow: 0 0 0 transparent;
}

.slide-up {
  animation: slideUpAnim 0.3s ease-out forwards;
}

@keyframes slideUpAnim {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shake {
  animation: shakeAnim 0.4s ease-in-out;
}

@keyframes shakeAnim {
  0%, 100% {
    transform: translateX(0);
  }
  20%, 60% {
    transform: translateX(-5px);
  }
  40%, 80% {
    transform: translateX(5px);
  }
}

.fullscreen-modal {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: var(--bg, #f2f2f7);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 20px;
  box-sizing: border-box;
  overflow: hidden;
}

.fullscreen-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.full-width-block {
  width: 100%;
}

.actions-spacing {
  margin-top: 20px;
}

.step-fade-in {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInStep 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInStep {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fs-text {
  font-size: 19px;
  font-weight: 600;
  color: #8e8e93;
  margin-bottom: 6px;
}

.streak-number {
  font-size: 34px;
  font-weight: 900;
  color: #34C759;
  line-height: 1;
  margin-bottom: 24px;
  padding: 8px 24px;
  border-radius: 20px;
  display: inline-block;
}

.status-img {
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  object-fit: contain;
}

.fs-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.ios-btn-primary {
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 16px 32px;
  font-size: 18px;
  font-weight: 800;
  box-shadow: 0 6px 0 #005bb5;
  cursor: pointer;
  transition: all 0.1s;
  width: 100%;
}

.ios-btn-primary:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #005bb5;
}

.ios-btn-secondary {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  background: none;
  color: #89898e;
  padding: 16px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 800;
  width: 100%;
  border: none;
  cursor: pointer;
}

.ios-btn-secondary:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #d1d1d6;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 10000;
}

.confetti-piece {
  position: absolute;
  top: -20px;
  border-radius: 3px;
  animation: confettiFall linear forwards;
}

.highlight-word {
  font-size: 22px;
  color: darkorange;
  font-weight: 600;
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(105vh) rotate(720deg);
    opacity: 0;
  }
}

.bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease-out;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}

/* Подпись над заданием: «Новое слово» / «Ещё раз» */
.task-badge {
  padding: 4px 14px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 15px;
  font-weight: 900;
}

.task-badge--retry {
  background: #ffedd5;
  color: #c2410c;
}

/* Артикль в карточке знакомства — своим цветом */
.article-color--der {
  color: #007AFF;
}

.article-color--die {
  color: #FF3B30;
}

.article-color--das {
  color: #34C759;
}

.intro-plural {
  margin-top: 14px;
  color: #8e8e93;
  font-size: 17px;
  font-weight: 800;
}

/* Экран окончания урока/повторения */
.finish-title {
  margin: 0 0 6px;
  color: var(--titleColor);
  font-size: 26px;
  font-weight: 900;
}

.finish-words {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 10px 0 4px;
  max-height: 30vh;
  overflow-y: auto;
}

.finish-word {
  padding: 6px 12px;
  border-radius: 12px;
  background: #dcfce7;
  color: #15803d;
  font-size: 15px;
  font-weight: 800;
}

.finish-word--mistake {
  background: #fee2e2;
  color: #b91c1c;
}
</style>
