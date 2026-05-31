<template>
  <div class="cards-layout">
    <div class="header-bar">
      <NuxtLink to="/" class="back-btn">
        ← {{ t('selectedpage.backBtn') }}
      </NuxtLink>
    </div>

    <!-- ====================== ARTICLES MODE ====================== -->
    <div v-if="cardMode === 'articles'" class="cards__wrapper">
      <div class="form-block">
        <div class="mode-switch">
          <button
              type="button"
              class="mode-btn"
              :class="{ active: cardMode === 'articles' }"
              @click="setMode('articles')"
          >
            Артикли
          </button>
          <button
              type="button"
              class="mode-btn"
              :class="{ active: cardMode === 'picture' }"
              @click="setMode('picture')"
          >
            Картинки
          </button>
        </div>

        <h2 class="title">{{ editingCardId ? 'Edit' : t('choiceTheme.create') }}</h2>

        <form @submit.prevent="saveArticleCard" class="form">
          <div class="custom-topic-list">
            <div class="custom-topic-label">{{ t('choiceTheme.theme') }}</div>

            <div class="custom-select" tabindex="0" @blur="open = false">
              <div class="custom-select__trigger" @click="toggle" :class="{ open }">
                <span>{{ form.topic ? t(themenMap[form.topic]) : t('choiceTheme.choice') }}</span>
                <img :class="{ open }" class="arrow" src="../assets/images/arrowNav.svg" alt="arrow"/>
              </div>

              <div v-if="open" class="custom-select__dropdown">
                <div
                    v-for="(name, key) in themenMap"
                    :key="key"
                    class="custom-select__option"
                    :class="{ selected: form.topic === key }"
                    @click="select(key)"
                >
                  {{ t(name) }}
                </div>
              </div>
            </div>
          </div>

          <input
              v-model="form.level"
              type="number"
              class="input"
              :placeholder="t('choiceTheme.difficult')"
              min="1"
              max="10"
          />

          <textarea
              v-model="form.sentence"
              class="input input__area"
              :placeholder="t('choiceTheme.placeholder')"
              required
              rows="2"
          />

          <input
              v-model="form.translation"
              type="text"
              class="input"
              :placeholder="t('choiceTheme.translate')"
          />

          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              {{ editingCardId ? 'Сохранить' : t('choiceTheme.btn') }}
            </button>
            <button
                v-if="editingCardId"
                type="button"
                @click="resetForm"
                class="btn btn-secondary"
            >
              cancel
            </button>
          </div>
        </form>
      </div>

      <div class="cards-block">
        <h2 class="title cards-title">{{ t('choiceTheme.available') }}</h2>

        <div class="search-bar">
          <input
              v-model="searchQuery"
              class="input search-input"
              type="text"
              :placeholder="t('choiceTheme.search')"
          />
          <input
              v-model="levelFilter"
              class="input search-level"
              type="number"
              min="1"
              max="10"
              :placeholder="t('choiceTheme.difficult')"
          />
        </div>

        <div class="cards-grid">
          <div v-for="card in filteredArticleCards" :key="card.id" class="card-scene">
            <div
                class="magic-card"
                :class="{ 'is-flipped': flippedCardId === card.id }"
                @click="!isCardFlipped(card.id) && flipCard(card)"
            >
              <div class="card-face card-front" :class="getTopicColorClass(card.topic)">
                <div v-if="canEdit(card)" class="card-actions">
                  <button @click.stop="initiateEdit(card)" class="card-action-btn edit-btn" title="edit">✏️</button>
                  <button @click.stop="initiateDelete(card)" class="card-action-btn delete-btn" title="Delete">🗑️
                  </button>
                </div>

                <div class="card-content">
                  <div v-if="card.topic" class="card-topic">{{ t(themenMap[card.topic]) }}</div>
                </div>

                <div class="card-footer">
                  <div v-if="card.level" class="card-level">⚡️ Level {{ card.level }}</div>
                </div>
              </div>

              <div class="card-face card-back">
                <button @click.stop="unflipCard()" class="card-close-btn">×</button>

                <div class="card-back-content">
                  <div class="modal-sentence">{{ card.hiddenSentence }}</div>

                  <form v-if="!guessResult" @submit.prevent="makeGuess" class="guess-form">
                    <div v-for="(pos, idx) in card.articles" :key="idx" class="guess-field">
                      <input
                          v-model="userAnswers[idx]"
                          class="input guess-input"
                          required
                          autocomplete="off"
                          @click.stop
                      />
                    </div>

                    <button type="submit" class="btn guess-btn" @click.stop>Check</button>
                  </form>

                  <div v-else class="guess-result">
                    <div
                        v-for="(art, idx) in card.articles"
                        :key="'result' + idx"
                        class="guess-answer"
                        :class="{ correct: guessResult[idx]?.correct, wrong: !guessResult[idx]?.correct }"
                    >
                      <b>Пропуск {{ idx + 1 }}:</b>
                      <span v-if="guessResult[idx]?.correct"> Right! ({{ art }})</span>
                      <span v-else> Mistate! (Right {{ card.articles[idx] }})</span>
                    </div>

                    <button @click.stop="unflipCard(true)" class="btn close-btn">further</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!filteredArticleCards.length" class="empty-state">
          Нет карточек 😿
        </div>
      </div>
    </div>

    <div v-else class="picture-page">
      <div class="mode-switch picture-mode-switch">
        <button
            type="button"
            class="mode-btn"
            :class="{ active: cardMode === 'articles' }"
            @click="setMode('articles')"
        >
          Артикли
        </button>
        <button
            type="button"
            class="mode-btn"
            :class="{ active: cardMode === 'picture' }"
            @click="setMode('picture')"
        >
          Картинки
        </button>
      </div>

      <!-- ====================== SETUP STAGE ====================== -->
      <div v-if="pageStage === 'setup'" class="word-select-screen">
        <div class="word-select-card">
          <h2 class="title">Выбери слова для изучения</h2>

          <!-- MODE -->
          <div class="quick-mode-switch">
            <button
                class="quick-mode-btn"
                :class="{ active: pictureView === 'learn' }"
                @click="setPictureSubmode('learn')"
            >
              <span>📘</span>
              <b>Учить</b>
            </button>

            <button
                class="quick-mode-btn"
                :class="{ active: pictureView === 'test' }"
                @click="setPictureSubmode('test')"
            >
              <span>🧠</span>
              <b>Тест</b>
            </button>
          </div>

          <!-- SEARCH -->
          <div class="word-search-box">
            <input
                v-model="pictureSearchQuery"
                class="input"
                type="text"
                placeholder="Найти слово..."
            />
          </div>

          <!-- TOPICS -->
          <div class="free-topic-grid">
            <button
                v-for="topic in topicStats"
                :key="topic.key"
                type="button"
                class="free-topic-card"
                :class="{
          active: pictureTopic === topic.key,
          completed: topic.completed
        }"
                @click="selectPictureTopic(topic.key)"
            >
              <div class="free-topic-card__icon">{{ topic.icon }}</div>

              <div class="free-topic-card__content">
                <div class="free-topic-card__title">
                  {{ t(topic.titleKey) }}
                </div>

                <div class="free-topic-card__meta">
                  {{ topic.knownCount }}/{{ topic.total }} слов
                </div>

                <div class="free-topic-card__bar">
                  <div
                      class="free-topic-card__bar-fill"
                      :style="{ width: `${topic.percent}%` }"
                  />
                </div>
              </div>
            </button>
          </div>

          <!-- SELECTED TOPIC -->
          <div v-if="currentTopicStat" class="selected-free-topic">
            <div class="selected-free-topic__top">
              <div class="selected-free-topic__icon">
                {{ currentTopicStat.icon }}
              </div>

              <div>
                <div class="selected-free-topic__title">
                  {{ t(currentTopicStat.titleKey) }}
                </div>

                <div class="selected-free-topic__subtitle">
                  {{ currentTopicStat.knownCount }}/{{ currentTopicStat.total }} слов изучено
                </div>
              </div>
            </div>

            <button
                class="btn btn-primary launch-btn"
                @click="startSession"
                :disabled="!canStartPictureSession"
            >
              {{ canStartPictureSession ? `Начать: ${pictureViewLabel}` : 'Нет карточек' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ====================== SESSION ====================== -->
      <div v-else class="session-container">
        <div class="session-header">
          <button class="icon-btn exit-icon-btn" @click="goToSetup">✕</button>

          <div class="session-header-center">
        <span class="session-header-title">
          {{ currentTopicStat?.icon }} {{ t(currentTopicStat?.titleKey) }}
        </span>

            <div class="session-header-subline">
              <span class="session-mode-badge">{{ pictureViewLabel }}</span>
              <span class="session-step-badge">{{ sessionCurrentStep }}/{{ sessionTotalSteps }}</span>
            </div>

            <div class="mini-progress-bg">
              <div class="mini-progress-fill" :style="{ width: `${topicProgressPct}%` }"></div>
            </div>
          </div>

          <div class="session-stats">
        <span v-if="pictureView === 'test'" class="error-badge">
          Ошибок: {{ testWrongCount }}
        </span>
            <span v-else class="error-badge neutral-badge">
          Раунд {{ learnRound }}
        </span>
          </div>
        </div>

        <main class="session-content">
          <template v-if="pictureView === 'learn'">
            <div class="focused-card-wrapper">
              <div class="learn-flip-scene" @click="toggleLearnFlip">
                <div class="learn-flip-card" :class="{ flipped: learnFlipped }">
                  <div class="learn-flip-face learn-flip-front">
                    <img :src="getWordImageUrl(currentLearnCard.imageKey)" class="main-img"/>
                    </div>

                  <div class="learn-flip-face learn-flip-back">
                    <div class="word-info">
                      <SoundBtn :text="currentLearnCard.deWord" class="large-sound"/>
                      <h2 class="de-word">{{ currentLearnCard.deWord }}</h2>
                    </div>
                    <div class="word-subtext">Послушай и оцени, насколько хорошо ты знаешь это слово</div>
                  </div>
                </div>
              </div>

              <div class="learn-help-text">
                <template v-if="!learnFlipped">
                  Нажми на карточку, чтобы открыть перевод
                </template>
                <template v-else>
                  Отметь, знаешь ты это слово или нет
                </template>
              </div>

              <div class="action-footer">
                <button class="session-answer-btn session-answer-btn--wrong" @click="learnAnswer(false)">
                  <span class="session-answer-btn__icon">✕</span>
                  <span class="session-answer-btn__label">Не знаю</span>
                </button>

                <button class="session-answer-btn session-answer-btn--right" @click="learnAnswer(true)">
                  <span class="session-answer-btn__icon">✓</span>
                  <span class="session-answer-btn__label">Знаю</span>
                </button>
              </div>
            </div>
          </template>

          <template v-else-if="pictureView === 'test'">
            <div class="focused-card-wrapper">
              <div class="test-card-shell">
                <img :src="getWordImageUrl(currentTestCard.imageKey)" class="test-img-preview"/>
              </div>

              <div class="test-prompt">
                Выбери правильное слово на немецком
              </div>

              <div class="test-options-list">
                <button
                    v-for="opt in testOptions"
                    :key="opt.key"
                    class="test-opt-btn"
                    :class="testOptionClass(opt)"
                    @click="pickTestOption(opt)"
                >
                  {{ opt.label }}
                </button>
              </div>

              <div
                  v-if="testLocked"
                  class="test-feedback"
                  :class="{ ok: testWasCorrect, bad: !testWasCorrect }"
              >
                <template v-if="testWasCorrect">
                  ✅ Верно
                </template>
                <template v-else>
                  ❌ Неверно. Правильный ответ: <b>{{ currentTestCard.deWord }}</b>
                </template>
              </div>

              <button v-if="testLocked" class="btn btn-primary btn-next-step" @click="nextTest">
                Далее →
              </button>
            </div>
          </template>
        </main>
      </div>
    </div>

    <!-- LEARN FINISH MODAL -->
    <div
        v-if="learnFinishModalOpen"
        class="modal-overlay"
        @click.self="closeLearnFinishModal"
    >
      <div class="modal-window">
        <template v-if="learnFinishModalType === 'success'">
          <h3 class="modal-title">🔥 Великолепно!</h3>
          <p class="modal-text">Ты прошёл тему без ошибок. Настоящий Meister 💪</p>
          <button class="btn btn-primary" @click="closeLearnFinishModal">Продолжить</button>
        </template>

        <template v-else>
          <h3 class="modal-title">🙂 Почти!</h3>
          <p class="modal-text">
            Ошибок: <b>{{ learnUnknownCount }}</b>. Хочешь повторить только их?
          </p>

          <div class="modal-actions">
            <button class="btn btn-primary" @click="repeatLearnMistakes">Повторить ошибки</button>
            <button class="btn btn-secondary" @click="closeLearnFinishModal">Закрыть</button>
          </div>
        </template>
      </div>
    </div>

    <!-- TEST FINISH MODAL -->
    <div
        v-if="testFinishModalOpen"
        class="modal-overlay"
        @click.self="closeTestFinishModal"
    >
      <div class="modal-window">
        <template v-if="testFinishModalType === 'success'">
          <h3 class="modal-title">🏆 Отлично!</h3>
          <p class="modal-text">
            Ты прошёл тест без ошибок. Переходим к следующей теме?
          </p>

          <div class="modal-actions">
            <button class="btn btn-primary" @click="goToNextTopic">
              Следующая тема
            </button>
            <button class="btn btn-secondary" @click="closeTestFinishModal">
              Остаться
            </button>
          </div>
        </template>

        <template v-else>
          <h3 class="modal-title">🙂 Есть ошибки</h3>
          <p class="modal-text">
            Ошибок: <b>{{ testWrongCount }}</b>. Хочешь повторить только их?
          </p>

          <div class="modal-actions">
            <button class="btn btn-primary" @click="repeatWrongTest">
              Повторить ошибки
            </button>
            <button class="btn btn-secondary" @click="closeTestFinishModal">
              Закрыть
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import {ref, watch, computed, onMounted} from 'vue'
import {useCardsStore} from '../store/cardsStore.js'
import {getAuth} from 'firebase/auth'
import {pictureTopics} from '~/data/pictureTopics'
import SoundBtn from "~/src/components/soundBtn.vue";

const {t} = useI18n()
const cardsStore = useCardsStore()
const learnedWordsCount = ref(0)
// ✅ pictures
const {picturePack, getWordImageUrl} = usePicturePack()
const pageStage = ref('setup') // 'setup' | 'session'

// ====== Topics ======
const themenMap = {
  Home: 'cardThemen.Home',
  Animals: 'cardThemen.Animals',
  Clothes: 'cardThemen.Clothes',
  Food: 'cardThemen.Food',
  Body: 'cardThemen.Body',
  Professions: 'cardThemen.Professions',
  Transport: 'cardThemen.Transport',
  Colors: 'cardThemen.Colors',
  Nature: 'cardThemen.Nature',
  City: 'cardThemen.City',
  Time: 'cardThemen.Time',
  Tools: 'cardThemen.Tools',
  Sport: 'cardThemen.Sport',
  Other: 'cardThemen.Other',
}
const canStartPictureSession = computed(() => {
  return !!currentTopicStat.value?.total
})

const sessionCurrentStep = computed(() => {
  return pictureView.value === 'learn'
      ? learnIndex.value + 1
      : testIndex.value + 1
})

const sessionTotalSteps = computed(() => {
  return pictureView.value === 'learn'
      ? learnQueue.value.length
      : testQueue.value.length
})
const currentTopicStat = computed(() => {
  return topicStats.value.find((topic) => topic.key === pictureTopic.value) || topicStats.value[0] || null
})


const shuffleArray = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ====== Mode ======
const cardMode = ref('articles') // 'articles' | 'picture'
const setMode = (mode) => {
  flippedCardId.value = null
  guessResult.value = null
  userAnswers.value = []
  editingCardId.value = null
  open.value = false

  cardMode.value = mode

  if (mode === 'articles') {
    pageStage.value = 'setup'
    resetForm()
  } else {
    pageStage.value = 'setup'
    if (!pictureTopic.value) {
      pictureTopic.value = topicStats.value[0]?.key || ''
    }
    setPictureSubmode('learn')
  }
}

// ====== PICTURE submode (ONLY learn/test) ======
const pictureView = ref('learn') // 'learn' | 'test'
const setPictureSubmode = (v) => {
  pictureView.value = v
  learnFlipped.value = false
  testLocked.value = false
  testSelectedKey.value = null
  testWasCorrect.value = false
}
const pictureViewLabel = computed(() => {
  return pictureView.value === 'learn' ? 'Учить' : 'Тест'
})

const startSession = () => {
  if (!pictureTopic.value) {
    pictureTopic.value = topicStats.value[0]?.key || ''
  }

  if (pictureView.value === 'learn') {
    startLearn()
  } else {
    startTest()
  }

  pageStage.value = 'session'
}

const goToSetup = () => {
  pageStage.value = 'setup'
}

// ====== Dropdown state ======
const open = ref(false)
const toggle = () => (open.value = !open.value)

// articles topic select
const select = (key) => {
  form.value.topic = key
  open.value = false
}

// picture topic select
const pictureTopic = ref('')
const selectPictureTopic = (key) => {
  pictureTopic.value = key
  open.value = false
}
const topicColors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5']
const getTopicColorClass = (topic) => {
  if (!topic) return ''
  let hash = 0
  for (let i = 0; i < topic.length; i++) hash = topic.charCodeAt(i) + ((hash << 5) - hash)
  const index = Math.abs(hash % topicColors.length)
  return topicColors[index]
}
const editingCardId = ref(null)

const defaultArticleFormState = {topic: '', level: '', sentence: '', translation: ''}
const form = ref({...defaultArticleFormState})

const ARTICLE_LIST = [
  'der', 'die', 'das', 'dem', 'den', 'des', 'einem', 'einen', 'eines', 'einer',
  'mein', 'dein', 'sein', 'ihr', 'unser', 'euer', 'Ihr',
  'meinem', 'meinen', 'meiner', 'meines',
  'deinem', 'deinen', 'deiner', 'deines',
  'seinem', 'seinen', 'seiner', 'seines',
  'ihrem', 'ihren', 'ihres',
  'unserem', 'unseren', 'unserer', 'unseres',
  'eurem', 'euren', 'eurer', 'eures',
]

const foundArticles = ref([])
const hiddenSentence = ref('')

function hideAllArticles(sentence) {
  if (!sentence) return {articles: [], newSentence: sentence}
  const regex = new RegExp(`\\b(${ARTICLE_LIST.join('|')})\\b`, 'gi')
  const articles = []
  const newSentence = sentence.replace(regex, (match) => {
    articles.push(match)
    return '___'
  })
  return {articles, newSentence}
}

watch(
    () => form.value.sentence,
    (sentence) => {
      if (cardMode.value !== 'articles') return
      const {articles, newSentence} = hideAllArticles(sentence)
      foundArticles.value = articles
      hiddenSentence.value = newSentence
    }
)

const resetForm = () => {
  editingCardId.value = null
  form.value = {...defaultArticleFormState}
  foundArticles.value = []
  hiddenSentence.value = ''
}

const saveArticleCard = async () => {
  if (!foundArticles.value.length) {
    alert('В предложении нет артиклей для изучения!')
    return
  }

  const cardData = {
    type: 'articles',
    topic: form.value.topic,
    level: form.value.level ? Number(form.value.level) : null,
    sentence: form.value.sentence,
    translation: form.value.translation,
    articles: [...foundArticles.value],
    hiddenSentence: hiddenSentence.value,
  }

  if (editingCardId.value) {
    await cardsStore.updateCard({...cardData, id: editingCardId.value})
  } else {
    await cardsStore.addCard(cardData)
  }
  resetForm()
}

const initiateEdit = (card) => {
  editingCardId.value = card.id
  form.value.topic = card.topic || ''
  form.value.level = card.level ?? ''
  form.value.sentence = card.sentence || ''
  form.value.translation = card.translation || ''
  document.querySelector('.form-block')?.scrollIntoView({behavior: 'smooth'})
}

const initiateDelete = async (card) => {
  const topicName = card.topic ? t(themenMap[card.topic]) : '—'
  if (confirm(`Вы уверены, что хотите удалить карточку по теме "${topicName}"?`)) {
    await cardsStore.removeCard(card.id)
  }
}

// ====== Firestore load ======
onMounted(() => {
  cardsStore.subscribePublicCards()
})

const articleCards = computed(() =>
    (cardsStore.cards || []).filter((c) => (c.type || 'articles') === 'articles')
)

// ====== Filters (articles) ======
const searchQuery = ref('')
const levelFilter = ref('')

const filteredArticleCards = computed(() => {
  let list = articleCards.value

  const q = (searchQuery.value || '').trim().toLowerCase()
  if (q) {
    list = list.filter((card) => {
      const topicName = card.topic ? t(themenMap[card.topic]).toLowerCase() : ''
      return topicName.includes(q) || (card.sentence || '').toLowerCase().includes(q)
    })
  }

  if (levelFilter.value) {
    const lvl = Number(levelFilter.value)
    list = list.filter((c) => Number(c.level) === lvl)
  }

  return list
})

// ====== Flip / Guess (articles) ======
const flippedCardId = ref(null)
const userAnswers = ref([])
const guessResult = ref(null)

const isCardFlipped = (cardId) => flippedCardId.value === cardId

const flipCard = (card) => {
  if (flippedCardId.value && flippedCardId.value !== card.id) unflipCard(true)
  flippedCardId.value = card.id
  guessResult.value = null
  userAnswers.value = Array((card.articles || []).length).fill('')
}

const unflipCard = (force = false) => {
  if (force || !guessResult.value) {
    flippedCardId.value = null
    guessResult.value = null
    userAnswers.value = []
  } else {
    flippedCardId.value = null
  }
}

const makeGuess = () => {
  const currentCard = filteredArticleCards.value.find((c) => c.id === flippedCardId.value)
  if (!currentCard) return

  guessResult.value = (currentCard.articles || []).map((art, idx) => {
    const user = (userAnswers.value[idx] || '').trim().toLowerCase()
    return {correct: user === String(art).toLowerCase(), answer: user}
  })
}

const uid = computed(() => getAuth().currentUser?.uid || null)
const canEdit = (card) => !!card?.ownerId && !!uid.value && card.ownerId === uid.value


// ✅ base picture list (ready only, by topic)
const pictureSearchQuery = ref('')

const basePictureList = computed(() => {
  let list = picturePack.filter((c) => c.isReady)

  if (pictureTopic.value) {
    list = list.filter((c) => c.topic === pictureTopic.value)
  }

  const q = pictureSearchQuery.value.trim().toLowerCase()

  if (q) {
    list = list.filter((c) => {
      return (
          String(c.deWord || '').toLowerCase().includes(q) ||
          String(c.imageKey || '').toLowerCase().includes(q)
      )
    })
  }

  return list
})


const progressKey = computed(() => `picProgress_${uid.value || 'guest'}`)
const progress = ref({}) // { [topicOrAll]: { known: { [imageKey]: true } } }

const loadProgress = () => {
  if (!process.client) return
  try {
    const raw = localStorage.getItem(progressKey.value)
    progress.value = raw ? JSON.parse(raw) : {}
  } catch {
    progress.value = {}
  }
}

const saveProgress = () => {
  if (!process.client) return
  localStorage.setItem(progressKey.value, JSON.stringify(progress.value))
}

onMounted(() => loadProgress())
watch(progressKey, () => loadProgress())

const topicKey = computed(() => (pictureTopic.value ? pictureTopic.value : '__ALL__'))
const ensureTopic = () => {
  const k = topicKey.value
  if (!progress.value[k]) progress.value[k] = {known: {}}
}

const markKnown = (card, known) => {
  ensureTopic()
  if (known) progress.value[topicKey.value].known[card.imageKey] = true
  else delete progress.value[topicKey.value].known[card.imageKey]
  saveProgress()
}
const topicTotal = computed(() => basePictureList.value.length)
const topicKnownCount = computed(() => {
  ensureTopic()
  const knownMap = progress.value[topicKey.value]?.known || {}
  const keysInTopic = new Set(basePictureList.value.map((c) => c.imageKey))
  return Object.keys(knownMap).filter((k) => keysInTopic.has(k)).length
})
const topicProgressPct = computed(() => {
  if (!topicTotal.value) return 0
  return Math.round((topicKnownCount.value / topicTotal.value) * 100)
})

const getKnownMapByTopic = (topic) => {
  return progress.value[topic]?.known || {}
}

const getCardsByTopic = (topic) => {
  return picturePack.filter((card) => card.topic === topic && card.isReady)
}
const topicStats = computed(() => {
  return pictureTopics.map((topicMeta) => {
    const cards = getCardsByTopic(topicMeta.key)
    const total = cards.length
    const knownMap = getKnownMapByTopic(topicMeta.key)
    const knownCount = cards.filter((card) => knownMap[card.imageKey]).length
    const percent = total ? Math.round((knownCount / total) * 100) : 0
    const completed = total > 0 && knownCount === total

    return {
      ...topicMeta,
      total,
      knownCount,
      percent,
      completed,
    }
  })
})

const learnQueue = ref([])
const learnIndex = ref(0)
const learnRound = ref(1)
const learnUnknownMap = ref({}) // { [imageKey]: true }

const learnFlipped = ref(false)
const currentLearnCard = computed(() => learnQueue.value[learnIndex.value])

const toggleLearnFlip = () => {
  learnFlipped.value = !learnFlipped.value
}

// --- Learn finish modal ---
const learnFinishModalOpen = ref(false)
// 'success' | 'errors'
const learnFinishModalType = ref('success')

const learnUnknownCount = computed(() => Object.keys(learnUnknownMap.value || {}).length)

const openLearnFinishModal = (type) => {
  learnFinishModalType.value = type
  learnFinishModalOpen.value = true
}
const closeLearnFinishModal = () => {
  learnFinishModalOpen.value = false
}

// build unknown list from map in current topic
const getLearnUnknownList = () => {
  const keys = Object.keys(learnUnknownMap.value || {})
  if (!keys.length) return []
  const byKey = new Map(basePictureList.value.map((c) => [c.imageKey, c]))
  return keys.map((k) => byKey.get(k)).filter(Boolean)
}
const startLearn = () => {
  setPictureSubmode('learn')

  if (!pictureTopic.value) {
    pictureTopic.value = topicStats.value[0]?.key || ''
  }

  learnQueue.value = shuffleArray(basePictureList.value)
  learnIndex.value = 0
  learnRound.value = 1
  learnUnknownMap.value = {}
  learnFlipped.value = false

  learnFinishModalOpen.value = false
  learnFinishModalType.value = 'success'
}

const learnAnswer = (known) => {
  const card = currentLearnCard.value
  if (!card) return

  markKnown(card, known)

  if (!known) {
    learnUnknownMap.value[card.imageKey] = true
  } else {
    delete learnUnknownMap.value[card.imageKey]
    learnedWordsCount.value++
  }

  learnFlipped.value = false

  if (learnIndex.value < learnQueue.value.length - 1) {
    learnIndex.value++
    return
  }

  const unknownList = getLearnUnknownList()
  if (!unknownList.length) openLearnFinishModal('success')
  else openLearnFinishModal('errors')
}

const repeatLearnMistakes = () => {
  const unknownList = getLearnUnknownList()
  if (!unknownList.length) {
    closeLearnFinishModal()
    return
  }

  learnQueue.value = shuffleArray(unknownList)
  learnIndex.value = 0
  learnRound.value += 1
  learnFlipped.value = false

  // НЕ чистим learnUnknownMap — чтобы "пока не станет 0" работало естественно
  closeLearnFinishModal()
}

// =======================================================
// ===================== TEST MODE ========================
// =======================================================
const testQueue = ref([])
const testIndex = ref(0)
const testOptions = ref([]) // [{key,label,isCorrect}]
const testLocked = ref(false)
const testSelectedKey = ref(null)
const testWasCorrect = ref(false)
const currentTestCard = computed(() => testQueue.value[testIndex.value])

const testWrongMap = ref({}) // { [imageKey]: true }
const testUseWrongOnly = ref(false)

const testFinishModalOpen = ref(false)
const testFinishModalType = ref('success') // 'success' | 'errors'

const testWrongCount = computed(() => Object.keys(testWrongMap.value || {}).length)

const openTestFinishModal = (type) => {
  testFinishModalType.value = type
  testFinishModalOpen.value = true
}

const closeTestFinishModal = () => {
  testFinishModalOpen.value = false
}

const getWrongListFromMap = () => {
  const keys = Object.keys(testWrongMap.value || {})
  if (!keys.length) return []
  const byKey = new Map(basePictureList.value.map((c) => [c.imageKey, c]))
  return keys.map((k) => byKey.get(k)).filter(Boolean)
}

const buildTestOptions = () => {
  const correct = currentTestCard.value
  if (!correct) {
    testOptions.value = []
    return
  }

  const pool = basePictureList.value
      .filter((c) => c.imageKey !== correct.imageKey)
      .filter((c) => (c.deWord || c.imageKey).trim().length > 0)

  const wrong = shuffleArray(pool).slice(0, 3)

  testOptions.value = shuffleArray([
    {key: correct.imageKey, label: correct.deWord || correct.imageKey, isCorrect: true},
    ...wrong.map((c) => ({
      key: c.imageKey,
      label: c.deWord || c.imageKey,
      isCorrect: false,
    })),
  ])

  testLocked.value = false
  testSelectedKey.value = null
  testWasCorrect.value = false
}

const startTest = () => {
  setPictureSubmode('test')

  if (!pictureTopic.value) {
    pictureTopic.value = topicStats.value[0]?.key || ''
  }

  let list = testUseWrongOnly.value ? getWrongListFromMap() : basePictureList.value

  if (testUseWrongOnly.value && !list.length) {
    list = basePictureList.value
    testUseWrongOnly.value = false
  }

  if (!testUseWrongOnly.value) {
    testWrongMap.value = {}
  }

  testFinishModalOpen.value = false
  testQueue.value = shuffleArray(list)
  testIndex.value = 0
  buildTestOptions()
}

const repeatWrongTest = () => {
  testUseWrongOnly.value = true
  closeTestFinishModal()
  startTest()
}

const pickTestOption = (opt) => {
  if (testLocked.value) return

  testSelectedKey.value = opt.key
  testLocked.value = true
  testWasCorrect.value = !!opt.isCorrect

  const card = currentTestCard.value
  if (!card) return

  if (opt.isCorrect) {
    markKnown(card, true)
    delete testWrongMap.value[card.imageKey]
  } else {
    testWrongMap.value[card.imageKey] = true
  }
}

const testOptionClass = (opt) => {
  if (!testLocked.value) return ''
  if (opt.isCorrect) return 'correct'
  if (testSelectedKey.value === opt.key && !opt.isCorrect) return 'wrong'
  return 'muted'
}

const goToNextTopic = () => {
  const currentIndex = pictureTopics.findIndex((t) => t.key === pictureTopic.value)
  if (currentIndex === -1) {
    closeTestFinishModal()
    return
  }

  const nextTopic = pictureTopics[currentIndex + 1]
  if (!nextTopic) {
    closeTestFinishModal()
    return
  }

  pictureTopic.value = nextTopic.key
  testWrongMap.value = {}
  testUseWrongOnly.value = false
  closeTestFinishModal()

  startLearn()
  pageStage.value = 'session'
}

const nextTest = () => {
  if (!testLocked.value) return

  if (testIndex.value < testQueue.value.length - 1) {
    testIndex.value++
    buildTestOptions()
    return
  }

  if (testWrongCount.value > 0) {
    openTestFinishModal('errors')
  } else {
    openTestFinishModal('success')
  }
}
</script>


<style scoped>
.cards-layout {
  background-color: #fef8e4;
  min-height: 100dvh;
  padding: 1rem;
  padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
}

.title {
  font-family: 'Fredoka One', cursive;
  font-size: 1.8rem;
  font-weight: 600;
  color: #1e1e1e;
  margin-bottom: 1.5rem;
  text-align: center;
}

.input {
  background-color: #fef8e4;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  border-radius: 16px;
  padding: 12px 16px;
  font-size: 1rem;
  color: #1e1e1e;
  font-weight: 500;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s;
  appearance: none;
}

.input:focus {
  outline: none;
  border-color: #fca13a;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e;
}

.btn {
  font-family: 'Fredoka One', cursive;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 12px 24px;
  font-size: 1.1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 4px 4px 0 #1e1e1e;
}

.btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e;
}

.btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #1e1e1e;
}

.btn-primary {
  background-color: #4ade80;
  color: #1e1e1e;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #1e1e1e;
  height: 50px;
}

.back-btn {
  display: inline-block;
  color: #1e1e1e;
  font-weight: 700;
  font-family: 'Fredoka One', cursive;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 12px;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
  border: 3px solid #1e1e1e;
}

.back-btn:hover {
  background-color: #fff;
}

.cards__wrapper {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
}

.form-block {
  flex: 1 1 380px;
  max-width: 400px;
  position: sticky;
  top: 1.5rem;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.cards-block {
  flex: 2 1 600px;
}

.form {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 24px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input__area {
  min-height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.custom-topic-label {
  font-family: 'Fredoka One', cursive;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #1e1e1e;
}

.custom-select {
  position: relative;
  user-select: none;
  z-index: 20;
}

.custom-select__trigger {
  background: #fef8e4;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  border-radius: 16px;
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
}

.custom-select__trigger.open {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e;
}

.arrow {
  width: 16px;
  transition: transform 0.3s;
}

.arrow.open {
  transform: rotate(180deg);
}

.custom-select__dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #1e1e1e;
  z-index: 30;
  max-height: 220px;
  overflow-y: auto;
  padding: 0.5rem;
}

.custom-select__option {
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 12px;
  font-weight: 500;
  transition: background-color 0.2s, opacity 0.2s;
}

.custom-select__option:hover {
  background-color: #fef8e4;
}

.custom-select__option.selected {
  background-color: #fca13a;
  color: #ffffff;
  font-weight: 700;
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-level {
  max-width: 150px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.card-scene {
  perspective: 1000px;
  min-height: 220px;
}

.magic-card {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  cursor: pointer;
  border-radius: 24px;
}

.magic-card.is-flipped {
  transform: rotateY(180deg);
  cursor: default;
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
}

.card-back {
  transform: rotateY(180deg);
  background-color: #fff;
}

.card-front.color-1 {
  background-color: #60a5fa;
}

.card-front.color-2 {
  background-color: #f87171;
}

.card-front.color-3 {
  background-color: #fca13a;
}

.card-front.color-4 {
  background-color: #4ade80;
}

.card-front.color-5 {
  background-color: #a78bfa;
}

.card-actions {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  z-index: 2;
}

.card-scene:hover .card-actions {
  opacity: 1;
}

.card-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-topic {
  font-family: 'Fredoka One', cursive;
  font-size: 1.8rem;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.card-footer {
  padding: 0.75rem 1.5rem;
  border-top: 3px solid #1e1e1e;
  background-color: rgba(0, 0, 0, 0.1);
}

.card-level {
  font-family: 'Fredoka One', cursive;
  font-size: 1rem;
  color: #ffffff;
  font-weight: 500;
}

.card-close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  background: none;
  border: none;
  font-size: 1.75rem;
  color: #555;
  cursor: pointer;
  line-height: 1;
  z-index: 2;
}

.card-back-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 100%;
}

.card-action-btn {
  background-color: rgba(255, 255, 255, 0.7);
  border: 2px solid #1e1e1e;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1e1e1e;
}

.card-action-btn:hover {
  background-color: #ffffff;
}

.modal-sentence {
  font-size: 1.25rem;
  font-weight: 500;
  color: #1e1e1e;
  margin-bottom: 1rem;
  text-align: center;
}

.guess-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
}

.guess-input {
  font-size: 1rem;
  max-width: 200px;
  text-align: center;
}

.guess-btn {
  margin-top: 0.5rem;
  background-color: #fca13a;
  color: #fff;
}

.guess-result {
  width: 100%;
  text-align: left;
  margin-top: 1rem;
  font-weight: 500;
}

.guess-answer {
  padding: 0.5rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.guess-answer.correct {
  color: #166534;
  background-color: #dcfce7;
}

.guess-answer.wrong {
  color: #b91c1c;
  background-color: #fee2e2;
}

.close-btn {
  width: 100%;
  margin-top: 1rem;
  background-color: #6b7280;
  color: #fff;
}

.mode-switch {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.mode-btn {
  flex: 1;
  font-family: 'Fredoka One', cursive;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 10px 14px;
  cursor: pointer;
  box-shadow: 4px 4px 0 #1e1e1e;
  background: #fff;
  transition: all 0.2s;
}

.mode-btn:hover {
  transform: translate(1px, 1px);
  box-shadow: 3px 3px 0 #1e1e1e;
}

.mode-btn.active {
  background: #fca13a;
  color: #fff;
}


.empty-state {
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  opacity: 0.7;
}

.learn-flip-scene {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  perspective: 1200px;
  cursor: pointer;
  user-select: none;
}

.learn-flip-card {
  width: min(92vw, 420px);
  min-height: min(58dvh, 420px);
  height: auto;
  aspect-ratio: 1 / 1;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  border-radius: 28px;
}

.learn-flip-card.flipped {
  transform: rotateY(180deg);
}

.learn-flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.learn-flip-front,
.learn-flip-back {
  background: #fff;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0 #1e1e1e;
  padding: 16px;
  flex-direction: column;
  gap: 12px;
}


.learn-flip-back {
  flex-direction: column;
  transform: rotateY(180deg);
  padding: 18px;
}


.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
}

.modal-window {
  width: min(520px, 100%);
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 24px;
  box-shadow: 4px 4px 0 #1e1e1e;
  padding: 18px;
  text-align: center;
}

.modal-title {
  font-family: 'Fredoka One', cursive;
  font-size: 1.7rem;
  margin-bottom: 10px;
}

.modal-text {
  font-weight: 700;
  opacity: 0.85;
  margin-bottom: 14px;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-actions .btn {
  flex: 1;
}

.test-card-shell {
  width: min(92vw, 420px);
  min-height: 260px;
  max-height: 42dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 28px;
  box-shadow: 4px 4px 0 #1e1e1e;
  padding: 16px;
}

.test-img-preview {
  width: 100%;
  height: 100%;
  max-height: 38dvh;
  object-fit: contain;
}

.test-options-list {
  width: 100%;
  max-width: 420px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 16px;
}

.test-opt-btn {
  min-height: 52px;
  border: 2px solid #1e1e1e;
  border-radius: 16px;
  background: #fff;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 3px 3px 0 #1e1e1e;
}

.btn:focus-visible,
.mode-btn:focus-visible,
.quick-mode-btn:focus-visible,
.free-topic-card:focus-visible,
.test-opt-btn:focus-visible,
.custom-select__trigger:focus-visible,
.back-btn:focus-visible,
.card-action-btn:focus-visible,
.session-answer-btn:focus-visible,
.card-close-btn:focus-visible {
  outline: 3px solid #fca13a;
  outline-offset: 3px;
}

@media (max-width: 900px) {
  .cards__wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 2rem;
  }

  .form-block {
    position: static;
    max-width: none;
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }


  .form,
  .card-face,
  .modal-window {
    box-shadow: 4px 4px 0 #1e1e1e;
  }
}

@media (max-width: 640px) {
  .cards-layout {
    padding: 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .search-bar,
  .form-actions,
  .modal-actions {
    flex-direction: column;
  }

  .search-level {
    max-width: none;
  }

  .btn {
    width: 100%;
  }


  .card-topic {
    font-size: 1.5rem;
  }
}


.picture-page {
  max-width: 1400px;
  margin: 0 auto;
}

.picture-mode-switch {
  max-width: 420px;
  margin-bottom: 1.25rem;
}

.launch-btn {
  width: 100%;
  min-height: 56px;
  font-size: 1.2rem;
}

.launch-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 4px 4px 0 #1e1e1e;
}

.session-container {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: 600px;
  margin: 0 auto;
  background: #f8fafc;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom);
}

.session-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 0.75rem;
  padding-top: calc(0.75rem + env(safe-area-inset-top));
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.session-header-center {
  min-width: 0;
}

.session-header-title {
  display: block;
  font-weight: 900;
  font-size: 0.95rem;
  color: #1e1e1e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-header-subline {
  display: flex;
  gap: 6px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.session-mode-badge,
.session-step-badge,
.error-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #fef3c7;
  font-size: 0.75rem;
  font-weight: 800;
}

.error-badge {
  background: #fee2e2;
  color: #b91c1c;
}

.neutral-badge {
  background: #f3f4f6;
  color: #444;
}

.session-answer-btn {
  min-width: 0;
  width: 100%;
  min-height: 56px;
  height: 56px;
  border: 2px solid #1e1e1e;
  border-radius: 18px;
  font-size: 1rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 3px 3px 0 #1e1e1e;
  transition: transform 0.2s, box-shadow 0.2s;
}

.session-answer-btn:active {
  transform: scale(0.96);
}

.session-answer-btn--wrong {
  background: #fee2e2;
  color: #b91c1c;
}

.session-answer-btn--right {
  background: #dcfce7;
  color: #166534;
}

.session-answer-btn__icon {
  font-size: 1.3rem;
}

.session-answer-btn__label {
  font-size: 1rem;
}

.session-content {
  flex: 1;
  display: flex;
  min-height: 0;
}

.mini-progress-bg {
  width: 100%;
  height: 4px;
  background: #eee;
  border-radius: 2px;
  margin-top: 4px;
}

.mini-progress-fill {
  height: 100%;
  background: #4caf50;
  transition: width 0.3s ease;
}

.focused-card-wrapper {
  flex: 1;
  min-height: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
  box-sizing: border-box;
}

.learn-flip-scene {
  width: 100%;
  max-width: 420px;
  flex: 1;
  min-height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  cursor: pointer;
  user-select: none;
}

.hint-tap {
  max-width: 100%;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.3;
}

.main-img {
  width: 100%;
  max-width: 260px;
  max-height: 260px;
  object-fit: contain;
  border-radius: 20px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  border: 2px solid #1e1e1e;
  border-radius: 14px;
  background: #fff;
  font-weight: 900;
  font-size: 1.1rem;
  cursor: pointer;
}

.exit-icon-btn:active {
  transform: scale(0.96);
}

.action-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
  padding: 12px 16px;
  padding-bottom: calc(12px + env(safe-area-inset-bottom));
  background: rgba(254, 248, 228, 0.96);
  backdrop-filter: blur(10px);
  border-top: 2px solid rgba(30, 30, 30, 0.12);
}

@media (min-width: 768px) {
  .session-container {
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }
}

.word-select-screen {
  max-width: 760px;
  margin: 0 auto;
  padding: 1rem 0 2rem;
}

.word-select-card {
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 28px;
  box-shadow: 4px 4px 0 #1e1e1e;
  padding: 1.5rem;
}

.quick-mode-switch {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 1rem;
}

.quick-mode-btn {
  min-height: 76px;
  border: 3px solid #1e1e1e;
  border-radius: 22px;
  background: #fffdf5;
  box-shadow: 4px 4px 0 #1e1e1e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.quick-mode-btn span {
  font-size: 1.6rem;
}

.quick-mode-btn.active {
  background: #fef3c7;
  outline: 3px solid #fca13a;
  outline-offset: 2px;
}

.word-search-box {
  margin-bottom: 1.2rem;
}

.free-topic-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.free-topic-card {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 3px solid #1e1e1e;
  border-radius: 22px;
  background: #fffdf5;
  box-shadow: 4px 4px 0 #1e1e1e;
  padding: 14px;
  text-align: left;
  cursor: pointer;
}

.free-topic-card.active {
  background: #fef3c7;
  outline: 3px solid #fca13a;
  outline-offset: 2px;
}

.free-topic-card.completed {
  background: #dcfce7;
}

.free-topic-card__icon {
  width: 54px;
  height: 54px;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  background: #fff7d6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.free-topic-card__content {
  flex: 1;
}

.free-topic-card__title {
  font-weight: 900;
  color: #1e1e1e;
  margin-bottom: 4px;
}

.free-topic-card__meta {
  font-size: 0.9rem;
  font-weight: 700;
  color: #555;
  margin-bottom: 8px;
}

.free-topic-card__bar {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.free-topic-card__bar-fill {
  height: 100%;
  background: #4ade80;
  border-radius: 999px;
}

.selected-free-topic {
  margin-top: 1.2rem;
  padding: 1rem;
  border: 3px solid #1e1e1e;
  border-radius: 24px;
  background: #fffdf5;
}

.selected-free-topic__top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
}

.selected-free-topic__icon {
  width: 56px;
  height: 56px;
  border: 3px solid #1e1e1e;
  border-radius: 18px;
  background: #fef3c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}

.selected-free-topic__title {
  font-weight: 900;
  font-size: 1.1rem;
}

.selected-free-topic__subtitle {
  font-weight: 700;
  color: #555;
  margin-top: 2px;
}

@media (max-width: 640px) {
  .word-select-card {
    border-radius: 24px;
    padding: 1rem;
    box-shadow: 4px 4px 0 #1e1e1e;
  }

  .quick-mode-btn {
    min-height: 68px;
  }

  .free-topic-card {
    padding: 12px;
    border-radius: 20px;
  }

  .launch-btn {
    min-height: 56px;
  }
}
</style>