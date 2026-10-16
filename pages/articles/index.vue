<template>
  <div class="theme-page">
    <Transition name="fade">
      <VLoginPreloader v-if="isLoading"/>
    </Transition>
    <div class="theme-page-container">
      <div class="theme__title-wrapper">
        <div class="theme__header">
          <button @click="goBack" class="btn-icon-back" data-track="articles_themen_back_click">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div class="theme__title">{{ t('modes.themeTitle') }}</div>
        </div>
      </div>
      <VTransition>
        <div v-if="isPageLoaded" class="theme-content-area">
          <div class="grid-area-wrapper">
            <div class="theme__grid-container">
              <div class="banner-wrapper">
                <VBanner :icon="BannerIcon" :text="t('bannerTitles.article')"/>
              </div>
              <!-- Повторение: слова из всех тем, у которых подошёл срок -->
              <div v-if="authStore.uid && hasStartedLearning" class="review-card" :class="{ 'is-empty': !totalDueCount }">
                <div class="review-card__text">
                  <span class="review-card__title">🔁 {{ t('wordLearning.reviewTitle') }}</span>
                  <span class="review-card__hint">
                    {{ totalDueCount ? t('wordLearning.reviewCardDue', {count: totalDueCount}) : t('wordLearning.reviewCardEmpty') }}
                  </span>
                </div>
                <button v-if="totalDueCount" class="review-card__button" :disabled="isLoading" @click="startReview(null)">
                  {{ t('wordLearning.reviewButton') }}
                </button>
              </div>
              <div class="topics-list-container">
                <div v-for="group in categorizedTopics" :key="group.id" class="category-group">
                  <div class="category-header">
                    <h3 class="category-title">{{ t(group.title) }}</h3>
                    <div class="category-progress-inline">
                      <span class="category-counter">
                        {{ getCategoryStatus(group).completed }}/{{ group.keys.length }}
                      </span>
                      <div class="mini-progress-bar">
                        <div
                            class="mini-progress-fill"
                            :style="{ width: getCategoryStatus(group).percent + '%' }"
                        ></div>
                      </div>
                      <div class="completion-check" :class="{ 'is-finished': getCategoryStatus(group).isAllDone }">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
                             stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div class="category-grid">
                    <div
                        v-for="(key, index) in group.keys"
                        :key="key"
                        class="topic-list-item"
                        :class="{ active: selectedTopic === key }"
                        @click="selectTopic(key)"
                    >
                      <div class="topic-main-row">
                        <div class="topic-item-content">
                          <div class="topic-icon-box">
                            <span class="theme__cards-icon-item">{{ iconMap[key] || '✨' }}</span>
                          </div>
                          <span class="topic-label">{{ t(nameMap[key]) }}</span>
                        </div>
                        <!-- Проверяем доступность темы через новую функцию -->
                        <VArrowNav v-if="isTopicUnlocked(key)"/>
                        <div v-else class="topic-arrow topic-arrow--locked">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                               stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </div>
                      </div>
                      <div class="topic-progress-wrapper">
                        <div class="progress-bar-container">
                          <div class="progress-bar-fill"
                               :style="{ width: `${themeProgress[key]?.total ? (themeProgress[key].learned / themeProgress[key].total) * 100 : 0}%`, backgroundColor: getTopicColor(index) }"></div>
                        </div>
                        <div class="progress-text">{{
                            themeProgress[key]?.learned || 0
                          }}/{{ themeProgress[key]?.total || 0 }}
                        </div>
                      </div>
                      <div v-if="themeProgress[key]?.due" class="topic-due">
                        🔁 {{ t('wordLearning.topicDue', {count: themeProgress[key].due}) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </VTransition>
      <Transition appear name="slide-right">
        <div v-if="showModesBlock" class="learning-modes-block">
          <div class="learning__modes-wrapper">
            <div class="modes-header-container">
              <button @click="clearSelectedTopic" class="close-modes-btn" data-track="article_modes_closed">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                     stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <div class="modes-title-box">
                <div class="modes-title">{{ iconMap[selectedTopic] || '✨' }} {{ t(nameMap[selectedTopic]) }}</div>
              </div>
            </div>
            <div class="topic-scroll">
              <!-- Прогресс темы одной карточкой -->
              <div class="topic-progress-card">
                <div class="progress-ring" :style="{ '--percent': learnedPercent }">
                  <span class="progress-ring__value">{{ Math.round(learnedPercent) }}%</span>
                </div>
                <div class="topic-progress-card__info">
                  <span class="topic-progress-card__title">
                    {{ t('wordLearning.learnedOf', {learned: selectedTopicProgress.learned, total: selectedTopicProgress.total}) }}
                  </span>
                  <span class="topic-progress-card__meta">
                    <span>🔁 {{ t('wordLearning.statDue') }}: {{ selectedTopicProgress.due }}</span>
                    <span>⭐ {{ t('wordLearning.statMastered') }}: {{ selectedTopicProgress.mastered }}</span>
                  </span>
                </div>
              </div>

              <!-- Что будет в уроке: слова и шаги -->
              <div v-if="lessonWords.length" class="lesson-card">
                <span class="lesson-card__title">
                  {{ isChoosingWords ? t('wordLearning.chosenWordsTitle') : t('wordLearning.nextLessonTitle') }}
                </span>
                <div class="lesson-card__words">
                  <span v-for="word in lessonWords" :key="word.de" class="lesson-word">
                    <span :class="`article-color--${word.article}`">{{ word.article }}</span> {{ word.de }}
                  </span>
                </div>
                <div class="lesson-steps">
                  <template v-for="(step, stepIndex) in lessonSteps" :key="step.label">
                    <span v-if="stepIndex" class="lesson-steps__arrow">→</span>
                    <span class="lesson-step">{{ step.icon }} {{ t(step.label) }}</span>
                  </template>
                </div>
              </div>
              <div v-else-if="!isChoosingWords" class="lesson-card lesson-card--done">
                <span class="lesson-card__title">🎉 {{ t('wordLearning.topicDoneTitle') }}</span>
                <span class="lesson-card__hint">{{ t('wordLearning.topicDoneText') }}</span>
              </div>

              <!-- Слова темы: просто список, свои слова можно отметить по кнопке «Выбрать слова» -->
              <div class="topic-section-head">
                <h3 class="topic-section-title">{{ t('wordLearning.wordsTitle') }} · {{ selectedTopicWords.length }}</h3>
                <button class="select-all-btn" @click="toggleChoosingWords">
                  {{ isChoosingWords ? t('wordLearning.cancelChoice') : t('wordLearning.chooseWords') }}
                </button>
              </div>
              <p v-if="isChoosingWords" class="choose-hint">{{ t('wordLearning.chooseWordsHint') }}</p>
              <div class="topic-words">
                <div
                    v-for="word in selectedTopicWords"
                    :key="word.de"
                    class="topic-word"
                    :class="{ 'is-choosable': isChoosingWords, 'is-selected': isChoosingWords && selectedWordKeys.includes(word.de) }"
                    @click="toggleWord(word)"
                >
                  <span v-if="isChoosingWords" class="checkmark checkmark--small">
                    <svg viewBox="0 0 24 24"><polyline points="3 12 10 20 21 4"/></svg>
                  </span>
                  <!-- Озвучка не должна отмечать слово в режиме выбора -->
                  <span class="word-sound" @click.stop>
                    <SoundBtn :text="`${word.article} ${word.de}`"/>
                  </span>
                  <span class="topic-word__text">
                    <span class="topic-word__german">
                      <span :class="`article-color--${word.article}`">{{ word.article }}</span> {{ word.de }}
                    </span>
                    <span class="topic-word__translation">{{ getTranslation(word) }}</span>
                  </span>
                  <span class="word-status" :class="`word-status--${getWordStatus(word)}`">
                    {{ t(`wordLearning.status_${getWordStatus(word)}`) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="topic-actions">
              <template v-if="isChoosingWords">
                <button class="start-btn" :disabled="!selectedWordKeys.length || isLoading" @click="startLesson">
                  {{ t('wordLearning.learnSelected', {count: selectedWordKeys.length}) }}
                </button>
              </template>
              <template v-else>
                <button v-if="selectedTopicProgress.due" class="start-btn start-btn--review" :disabled="isLoading" @click="startReview(selectedTopic)">
                  {{ t('wordLearning.reviewTopicButton', {count: selectedTopicProgress.due}) }}
                </button>
                <button v-if="lessonWords.length" class="start-btn" :disabled="isLoading" @click="startLesson">
                  {{ t('wordLearning.startLesson') }}
                </button>
                <button v-else-if="!selectedTopicProgress.due" class="start-btn" @click="toggleChoosingWords">
                  {{ t('wordLearning.chooseWords') }}
                </button>
              </template>
            </div>
          </div>
        </div>
      </Transition>
      <VPremiumModal v-model:show="showPremiumModal"/>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {useRouter} from 'vue-router'
import {userlangStore} from '../../store/learningStore.js'
import {userAuthStore} from '../../store/authStore.js'
import {nameMap, categories, iconMap, topicColors} from '../../utils/nameMap.js'
import {isWordInReview, isWordMastered, isWordDue, getDateKey, LESSON_WORD_COUNT} from '../../utils/wordReview.js'
import VLoginPreloader from "../../src/components/V-loginPreloader.vue"
import VBanner from "~/src/components/V-banner.vue"
import BannerIcon from '../../assets/images/articleBannerIcon.svg'
import VArrowNav from "~/src/components/V-arrowNav.vue"
import VTransition from "~/src/components/V-transition.vue"
import VPremiumModal from "~/src/components/V-premiumModal.vue"
import SoundBtn from "~/src/components/soundBtn.vue"

const getTopicColor = (index) => topicColors[index % topicColors.length]
const { $track } = useNuxtApp()
const { t, locale } = useI18n()
const showModesBlock = ref(false)
const router = useRouter()
const store = userlangStore()
const authStore = userAuthStore()
const themeList = ref({})
const selectedTopic = ref(null)
const selectedWordKeys = ref([])
// Режим «Выбрать слова»: в списке появляются галочки, урок — по отмеченным словам
const isChoosingWords = ref(false)
const localePath = useLocalePath()
const isLoading = ref(false)
const isPageLoaded = ref(false)
const showPremiumModal = ref(false)

const categorizedTopics = computed(() => {
  return categories.map(category => {
    const filteredKeys = category.topics.filter(key => nameMap[key] && themeList.value[key]);
    return {...category, keys: filteredKeys};
  }).filter(group => group.keys.length > 0);
})

const flatTopics = computed(() => {
  return categorizedTopics.value.flatMap(group => group.keys)
})

// Прогресс темы: выучено (прошли урок), ждут повторения сегодня, освоено надолго, ещё новые
const themeProgress = computed(() => {
  const todayKey = getDateKey()
  return Object.fromEntries(
      Object.entries(themeList.value).map(([key, topicWords]) => {
        const savedWords = topicWords.map(word => store.getWordEntry({de: word.de, topic: key})).filter(Boolean)
        const learned = savedWords.filter(isWordInReview).length
        return [key, {
          total: topicWords.length,
          learned,
          newCount: topicWords.length - learned,
          due: savedWords.filter(word => isWordDue(word, todayKey)).length,
          mastered: savedWords.filter(isWordMastered).length
        }]
      })
  )
})

const selectedTopicProgress = computed(() => {
  return themeProgress.value[selectedTopic.value] || {total: 0, learned: 0, newCount: 0, due: 0, mastered: 0}
})

const totalDueCount = computed(() => {
  return Object.values(themeProgress.value).reduce((sum, progress) => sum + progress.due, 0)
})

const selectedTopicWords = computed(() => themeList.value[selectedTopic.value] || [])

const learnedPercent = computed(() => {
  const {learned, total} = selectedTopicProgress.value
  return total ? (learned / total) * 100 : 0
})

// Следующий урок — первые ещё не выученные слова темы; в режиме выбора — отмеченные слова
const nextLessonWords = computed(() => selectedTopicWords.value
    .filter(word => !isWordInReview(store.getWordEntry({de: word.de, topic: selectedTopic.value})))
    .slice(0, LESSON_WORD_COUNT))

const lessonWords = computed(() => {
  if (!isChoosingWords.value) return nextLessonWords.value
  return selectedTopicWords.value.filter(word => selectedWordKeys.value.includes(word.de))
})

// Шаги урока для подсказки (сами шаги — LESSON_STEPS в wordReview.js)
const lessonSteps = [
  {icon: '👋', label: 'wordLearning.stepIntro'},
  {icon: '🔍', label: 'wordLearning.stepMeaning'},
  {icon: '🧩', label: 'wordLearning.stepLetters'},
  {icon: '✍️', label: 'wordLearning.stepWrite'}
]

const currentLangKey = computed(() => String(locale.value || '').split('-')[0] || 'en')
const getTranslation = (word) => word[currentLangKey.value] ?? word.en ?? ''

// Статус слова в списке: новое / выучено / пора повторить
function getWordStatus(word) {
  const savedWord = store.getWordEntry({de: word.de, topic: selectedTopic.value})
  if (isWordDue(savedWord)) return 'due'
  if (isWordInReview(savedWord)) return 'learned'
  return 'new'
}

function toggleChoosingWords() {
  isChoosingWords.value = !isChoosingWords.value
  selectedWordKeys.value = []
}

function toggleWord(word) {
  if (!isChoosingWords.value) return
  selectedWordKeys.value = selectedWordKeys.value.includes(word.de)
      ? selectedWordKeys.value.filter(key => key !== word.de)
      : [...selectedWordKeys.value, word.de]
}

// Карточку повторения показываем, только когда уже есть выученные слова
const hasStartedLearning = computed(() => store.words.some(isWordInReview))

const getCategoryStatus = (group) => {
  const completed = group.keys.filter(key => {
    const prog = themeProgress.value[key]
    return prog && prog.learned > 0 && prog.learned === prog.total
  }).length
  const total = group.keys.length
  return {
    completed,
    percent: total > 0 ? (completed / total) * 100 : 0,
    isAllDone: completed > 0 && completed === total
  }
}

const ARE_ALL_TOPICS_UNLOCKED = false

const isTopicUnlocked = (key) => {
  if (ARE_ALL_TOPICS_UNLOCKED || authStore.isPremium) return true
  const allKeys = flatTopics.value
  const index = allKeys.indexOf(key)
  if (index === 0) return true
  const prevKey = allKeys[index - 1]
  const prevProgress = themeProgress.value[prevKey]
  return prevProgress && prevProgress.total > 0 && prevProgress.learned === prevProgress.total
}

const selectTopic = (key) => {
  if (isTopicUnlocked(key)) {
    $track('article_topic_selected', {
      topic_id: key,
      is_completed: themeProgress.value[key]?.learned === themeProgress.value[key]?.total
    })
    window.history.pushState({isModesOpen: true}, '')
    selectedTopic.value = key
    selectedWordKeys.value = []
    isChoosingWords.value = false
    showModesBlock.value = true
  } else {
    $track('article_topic_locked_clicked', {
      topic_id: key
    })
    showPremiumModal.value = true
  }
}

function openSession(query) {
  if (isLoading.value) return
  isLoading.value = true
  router.push(localePath({path: '/articles/articles-session', query}))
}

// Урок по следующим новым словам темы или по отмеченным
const startLesson = () => {
  const wordKeys = lessonWords.value.map(word => word.de)
  if (!wordKeys.length) return
  $track('article_learning_started', {
    topic_id: selectedTopic.value,
    words_count: wordKeys.length,
    is_chosen_words: isChoosingWords.value
  })
  openSession({kind: 'lesson', topic: selectedTopic.value, words: wordKeys})
}

// Повторение: всех тем (topic = null) или одной темы
const startReview = (topic) => {
  $track('article_review_clicked', {
    topic_id: topic || 'all',
    due_words: topic ? selectedTopicProgress.value.due : totalDueCount.value
  })
  openSession(topic ? {kind: 'review', topic} : {kind: 'review'})
}

function goBack() {
  if (showModesBlock.value) window.history.back()
  else router.push('/')
}

const handlePopState = () => {
  if (showModesBlock.value) {
    showModesBlock.value = false
    selectedTopic.value = null
  }
}

const clearSelectedTopic = () => {
  if (showModesBlock.value) window.history.back()
}

onMounted(()=> {
  setTimeout(() => {
    isPageLoaded.value = true
  }, 100)
})

onMounted(async () => {
  if (!store.isLoaded) store.loadFromFirebase()
  const res = await fetch('/words.json')
  themeList.value = await res.json()
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => window.removeEventListener('popstate', handlePopState))
</script>

<style scoped>
.theme-page {
  font-family: "Nunito", sans-serif;
  height: 100%;
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.theme-page-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.theme__header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 10px 10px 10px;
  margin-bottom: 5px;
  border-radius: 10px;
}

.btn-icon-back {
  background: #f5f5f6;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 14px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
  flex-shrink: 0;
  padding: 0;
}

.btn-icon-back:active {
  transform: translate(2px, 3px);
  box-shadow: 0px 0px 0px #1e272e;
}

.theme__title {
  flex: 1;
  display: flex;
  font-size: 23px;
  font-weight: 600;
  color: var(--title);
  text-shadow: 1px 1px var(--title);
  margin-left: 15px;
  font-family: "Nunito", sans-serif;
}

.theme__title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.theme-content-area {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  gap: 0;
}

.grid-area-wrapper {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  width: 100%;
}

.theme__grid-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -ms-overflow-style: none;
}

.banner-wrapper {
  margin: 0 15px 15px 15px;
}

.topics-list-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 10px 40px 15px;
}

.topic-list-item {
  border-radius: 20px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  transition: transform 0.1s, border-bottom-width 0.1s;
}

.topic-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.topic-item-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.topic-icon-box {
  font-size: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme__cards-icon-item {
  display: inline-block;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}

.topic-label {
  color: var(--titleColor);
  font-size: 17px;
  font-weight: 800;
  font-family: "Nunito", sans-serif;
}

.topic-arrow {
  background-color: #3b82f6;
  color: #ffffff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 0px #2563eb;
  flex-shrink: 0;
}

.topic-arrow--locked {
  background-color: #a0aec0;
  box-shadow: 0 3px 0px #718096;
}

.topic-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  width: 100%;
}

.progress-bar-container {
  flex: 1;
  height: 8px;
  background-color: #1e272e;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.progress-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s ease-out;
}

.progress-text {
  color: var(--titleColor);
  font-size: 14px;
  font-weight: 900;
  min-width: 36px;
  text-align: right;
  font-family: "Nunito", sans-serif;
}

.learning-modes-block {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: var(--bg);
  z-index: 2000;
  display: flex;
  flex-direction: column;
}

.learning__modes-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.modes-header-container {
  display: flex;
  padding: 5px 10px 15px 10px;
  margin-bottom: 15px;
}

.close-modes-btn {
  background: #fff;
  border: 3px solid var(--tabsSlideBorderColor);
  box-shadow: var(--boxShadowMobile);
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.close-modes-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0px #2b2b2b;
}

.modes-title-box {
  flex-grow: 1;
  text-align: left;
  margin-left: 15px;
  padding-top: 10px;
}

.modes-title {
  display: flex;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--titleColor);
}

.topic-hint {
  color: #726b6b;
  font-family: Nunito, sans-serif;
  font-style: italic;
  font-weight: 500;
  margin-top: 2px;
  text-align: center;
}

/* Карточка повторения над темами */
.review-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 15px 18px 15px;
  padding: 14px 16px;
  border-radius: 22px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  box-shadow: 0 6px 0 #4c1d95;
  color: #ffffff;
}

.review-card.is-empty {
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  color: var(--titleColor);
}

.review-card__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.review-card__title {
  font-size: 17px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.review-card__hint {
  font-size: 14px;
  font-weight: 700;
  opacity: 0.9;
}

.review-card__button {
  flex-shrink: 0;
  padding: 10px 18px;
  border: none;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.2);
  color: #6d28d9;
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
}

.review-card__button:active:not(:disabled) {
  transform: translateY(3px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
}

/* Отметка на теме: сколько слов ждут повторения */
.topic-due {
  align-self: flex-start;
  margin-top: 8px;
  padding: 3px 10px;
  border-radius: 999px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 13px;
  font-weight: 900;
}

/* Экран темы */
.topic-progress-card {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 15px;
  padding: 14px 16px;
  border-radius: 22px;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
}

.progress-ring {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: conic-gradient(#22c55e calc(var(--percent) * 1%), var(--tabsSlideBorderColor) 0);
  position: relative;
}

.progress-ring::before {
  content: '';
  position: absolute;
  inset: 7px;
  border-radius: 50%;
  background: var(--menuItemsBg);
}

.progress-ring__value {
  position: relative;
  color: var(--titleColor);
  font-size: 15px;
  font-weight: 900;
}

.topic-progress-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.topic-progress-card__title {
  color: var(--titleColor);
  font-size: 18px;
  font-weight: 900;
}

.topic-progress-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  color: #8e8e93;
  font-size: 14px;
  font-weight: 800;
}

/* Карточка следующего урока */
.lesson-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 15px 0;
  padding: 16px;
  border-radius: 22px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 6px 0 #1d4ed8;
  color: #ffffff;
}

.lesson-card--done {
  gap: 4px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 6px 0 #15803d;
}

.lesson-card__title {
  font-size: 17px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.lesson-card__hint {
  font-size: 15px;
  font-weight: 700;
  opacity: 0.9;
}

.lesson-card__words {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.lesson-word {
  padding: 6px 12px;
  border-radius: 999px;
  background: #ffffff;
  color: #1f2937;
  font-size: 15px;
  font-weight: 900;
}

.lesson-steps {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
}

.lesson-step {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
}

.lesson-steps__arrow {
  opacity: 0.7;
}

.choose-hint {
  margin: -4px 15px 12px;
  color: #8e8e93;
  font-size: 14px;
  font-weight: 700;
}

/* Прокручиваемая часть окна темы */
.topic-scroll {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 16px;
  scrollbar-width: none;
}

.topic-scroll::-webkit-scrollbar {
  display: none;
}

.topic-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 15px;
}

.topic-section-title {
  margin: 22px 15px 12px;
  color: var(--titleColor);
  font-size: 19px;
  font-weight: 900;
}

.select-all-btn {
  margin-top: 10px;
  padding: 6px 12px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: #3b82f6;
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 900;
  cursor: pointer;
}

.checkmark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 3px solid #af9e9e;
  background: #fff;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s;
}

.checkmark svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.checkmark polyline {
  stroke: #1e1e1e;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  stroke-dasharray: 28;
  stroke-dashoffset: 28;
  transition: stroke-dashoffset 0.3s ease;
}

/* Список слов темы */
.topic-words {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 15px;
}

.topic-word {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 16px;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  user-select: none;
}

.topic-word.is-choosable {
  cursor: pointer;
}

.topic-word.is-selected {
  border-color: #3b82f6;
}

.checkmark--small {
  width: 24px;
  height: 24px;
}

.topic-word.is-selected .checkmark polyline {
  stroke-dashoffset: 0;
}

.topic-word.is-selected .checkmark svg {
  opacity: 1;
}

.word-sound {
  display: flex;
  flex-shrink: 0;
}

.word-sound :deep(.speak-btn__icon) {
  width: 30px;
}

.topic-word__text {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topic-word__german {
  color: var(--titleColor);
  font-size: 16px;
  font-weight: 900;
}

.topic-word__translation {
  color: #8e8e93;
  font-size: 14px;
  font-weight: 700;
}

.article-color--der {
  color: #007AFF;
}

.article-color--die {
  color: #FF3B30;
}

.article-color--das {
  color: #34C759;
}

.word-status {
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
}

.word-status--new {
  background: #e0f2fe;
  color: #0369a1;
}

.word-status--learned {
  background: #dcfce7;
  color: #15803d;
}

.word-status--due {
  background: #ede9fe;
  color: #6d28d9;
}

.topic-actions {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  padding-bottom: 10px;
}

.topic-actions .start-btn {
  margin: 0 15px 12px 15px;
}

.start-btn--review {
  background-color: #8b5cf6;
  border-color: #7c3aed;
  border-bottom-color: #5b21b6;
}

.start-btn {
  padding: 14px;
  font-family: "Nunito", sans-serif;
  font-size: 19px;
  font-weight: 700;
  background-color: #3b82f6;
  border: 2px solid #2563eb;
  color: white;
  border-radius: 34px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  border-bottom: 4px solid #1d4ed8;
  margin: 10px 15px 20px 15px;

}

.start-btn:disabled {
  background: #e0e0e0;
  color: #a1a1a1;
  border: 2px solid #a1a1a1;
  border-bottom: 4px solid #a1a1a1;
  cursor: not-allowed;
}

.page-fade-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease-out;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 400px) {
  .topic-label {
    font-size: 14px;
  }
}

.category-group {
  margin-bottom: 15px;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  margin-bottom: 12px;
}

.category-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
}

.category-progress-inline {
  display: flex;
  align-items: center;
  gap: 5px;
}

.category-counter {
  font-size: 14px;
  font-weight: 800;
  color: var(--titleColor);
  letter-spacing: 1px;
}

.mini-progress-bar {
  width: 60px;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #cbd5e0;
}

.mini-progress-fill {
  height: 100%;
  background-color: #2ecc71;
  transition: width 0.3s ease;
}

.completion-check {
  color: #cbd5e0;
  display: flex;
  align-items: center;
}

.completion-check.is-finished {
  color: #2ecc71;
}

.category-grid {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 12px;
  padding: 0 16px 15px 0;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: rgba(150, 150, 150, 0.4) transparent;
}

.category-grid::-webkit-scrollbar {
  height: 6px;
}

.category-grid::-webkit-scrollbar-track {
  background: transparent;
}

.category-grid::-webkit-scrollbar-thumb {
  background: rgba(150, 150, 150, 0.4);
  border-radius: 10px;
}

.category-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(150, 150, 150, 0.7);
}

.topic-list-item {
  flex: 0 0 85%;
  scroll-snap-align: start;
  border-radius: 20px;
  padding: 16px;
  background: var(--menuItemsBg);
  border: 2px solid var(--tabsSlideBorderColor);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) {
  .topic-list-item {
    flex: 0 0 300px;
  }
}
</style>