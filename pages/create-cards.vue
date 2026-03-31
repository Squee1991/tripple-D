<template>
  <div class="cards-layout">
    <div class="header-bar">
      <NuxtLink to="/" class="back-btn">
        ← {{ t('selectedpage.backBtn') }}
      </NuxtLink>
    </div>

    <div class="cards__wrapper">

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

        <!-- =============== ARTICLES PANEL =============== -->
        <template v-if="cardMode === 'articles'">
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
        </template>

        <!-- =============== PICTURES PANEL =============== -->
        <template v-else>
          <div class="pack-info">
            <h2 class="title">Готовые карточки</h2>
<!--            <p class="pack-text">-->
<!--              Режимы: учить / тест. Прогресс сохраняется по теме.-->
<!--            </p>-->

            <div class="submode-switch">
              <button
                  class="submode-btn"
                  :class="{ active: pictureView === 'learn' }"
                  @click="startLearn()"
              >
                Учить
              </button>
              <button
                  class="submode-btn"
                  :class="{ active: pictureView === 'test' }"
                  @click="startTest()"
              >
                Тест
              </button>
            </div>

            <!-- topic filter -->
            <div class="custom-topic-list" style="margin-top: 14px;">
              <div class="custom-topic-label">Тема</div>

              <div class="custom-select" tabindex="0" @blur="open = false">
                <div class="custom-select__trigger" @click="toggle" :class="{ open }">
                  <span>{{ pictureTopic ? t(themenMap[pictureTopic]) : 'Выбери тему' }}</span>
                  <img :class="{ open }"
                       class="arrow"
                       src="../assets/images/arrowNav.svg"
                       alt="arrow"/>
                </div>

                <div v-if="open" class="custom-select__dropdown">

                  <div
                      v-for="topic in topicStats"
                      :key="topic.key"
                      class="custom-select__option"
                      :class="{ selected: pictureTopic === topic.key }"
                      @click="selectPictureTopic(topic.key)"
                  >
                    {{ topic.icon }} {{ t(topic.titleKey) }}
                    <span v-if="!topic.unlocked"> 🔒</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="pack-count">
              Карточек: <b>{{ basePictureList.length }}</b>
            </div>

            <div class="progress-box" v-if="topicTotal > 0">
              Прогресс:
              <b>{{ topicKnownCount }}/{{ topicTotal }}</b>
              <span class="progress-pct">({{ topicProgressPct }}%)</span>
            </div>

            <div class="topic-rail">
              <button
                  v-for="topic in topicStats"
                  :key="topic.key"
                  type="button"
                  class="topic-chip"
                  :class="{
      active: pictureTopic === topic.key,
      locked: !topic.unlocked,
      completed: topic.completed
    }"
                  :disabled="!topic.unlocked"
                  @click="selectPictureTopic(topic.key)"
              >
                <div class="topic-chip__icon">{{ topic.icon }}</div>
                <div class="topic-chip__level">Lv. {{ topic.order }}</div>
              </button>
            </div>
            <div v-if="currentTopicStat" class="topic-spotlight">
              <div class="topic-spotlight__top">
                <div class="topic-spotlight__icon">{{ currentTopicStat.icon }}</div>
                <div>
                  <div class="topic-spotlight__name">{{ t(currentTopicStat.titleKey) }}</div>
                  <div class="topic-spotlight__level">Level {{ currentTopicStat.order }}</div>
                </div>
              </div>

              <div class="topic-spotlight__progress">
                {{ currentTopicStat.knownCount }}/{{ currentTopicStat.total }} · {{ currentTopicStat.percent }}%
              </div>

              <div class="topic-spotlight__bar">
                <div
                    class="topic-spotlight__bar-fill"
                    :style="{ width: `${currentTopicStat.percent}%` }"
                />
              </div>

              <div class="topic-spotlight__status">
                <span v-if="currentTopicStat.completed">✅ Пройдено</span>
                <span v-else-if="!currentTopicStat.unlocked">🔒 Закрыто</span>
                <span v-else>🟢 Открыто</span>
              </div>
            </div>

            <div class="progress-box" v-if="pictureView === 'test' && testWrongCount">
              Ошибок в тесте: <b>{{ testWrongCount }}</b>
            </div>
          </div>
        </template>
      </div>

      <div class="cards-block">
        <h2 class="title cards-title">{{ t('choiceTheme.available') }}</h2>


        <template v-if="cardMode === 'articles'">
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
                <!-- FRONT -->
                <div class="card-face card-front" :class="getTopicColorClass(card.topic)">
                  <div v-if="canEdit(card)" class="card-actions">
                    <button @click.stop="initiateEdit(card)" class="action-btn edit-btn" title="edit">✏️</button>
                    <button @click.stop="initiateDelete(card)" class="action-btn delete-btn" title="Delete">🗑️</button>
                  </div>

                  <div class="card-content">
                    <div v-if="card.topic" class="card-topic">{{ t(themenMap[card.topic]) }}</div>
                  </div>

                  <div class="card-footer">
                    <div v-if="card.level" class="card-level">⚡️ Level {{ card.level }}</div>
                  </div>
                </div>

                <!-- BACK -->
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
        </template>

        <!-- =============== PICTURES: LEARN =============== -->
        <template v-else-if="pictureView === 'learn'">
          <div class="learn-wrap" v-if="learnQueue.length">
            <div class="learn-card">
              <div class="learn-top">
                <div class="learn-count --learned">
                  {{ learnedWordsCount }}
                </div>
                <div class="badge --notlearned">{{ learnUnknownCount }}</div>
              </div>
              <!-- FLIP IMAGE CARD -->

              <div class="learn-nav">
                <button class="btn btn-secondary tiny-btn" :disabled="learnIndex === 0" @click="learnPrev">←</button>
                <div class="learn-flip-scene" @click="toggleLearnFlip">
                  <div class="learn-flip-card" :class="{ flipped: learnFlipped }">
                    <div class="learn-flip-face learn-flip-front">
                      <img
                          class="learn-image"
                          :src="getWordImageUrl(currentLearnCard.imageKey)"
                          alt="img"
                          draggable="false"
                      />
                    </div>

                    <div class="learn-flip-face learn-flip-back">
                      <SoundBtn
                          :text="currentLearnCard.deWord"
                      />
                      <div class="learn-de">
                        {{ currentLearnCard.deWord || currentLearnCard.imageKey }}
                      </div>
                    </div>
                  </div>
                </div>
                <button class="btn btn-secondary tiny-btn" :disabled="learnIndex >= learnQueue.length - 1" @click="learnNext">→</button>
              </div>


              <div class="learn-actions">
                <button class="btn btn-primary" @click="learnAnswer(true)">
                  ✔️
                </button>
                <button class="btn btn-secondary" @click="learnAnswer(false)">
                  ❌
                </button>
              </div>


              <div class="flip-hint">Нажми на карточку, чтобы увидеть перевод</div>
            </div>
          </div>

          <div v-else class="empty-state">
            Нет карточек для обучения 😿
          </div>
        </template>

        <!-- =============== PICTURES: TEST =============== -->
        <template v-else-if="pictureView === 'test'">
          <div class="test-wrap" v-if="testQueue.length">
            <div class="test-card">
              <div class="learn-top">
                <div class="learn-count">
                  {{ testIndex + 1 }} / {{ testQueue.length }}
                </div>
              </div>

              <img class="learn-image" :src="getWordImageUrl(currentTestCard.imageKey)" alt="img"/>

              <div class="test-question">Выбери перевод на немецкий:</div>

              <div class="test-answers">
                <button
                    v-for="opt in testOptions"
                    :key="opt.key"
                    class="test-option"
                    :class="testOptionClass(opt)"
                    :disabled="testLocked"
                    @click="pickTestOption(opt)"
                >
                  {{ opt.label }}
                </button>
              </div>

              <div class="test-result" v-if="testLocked">
                <span v-if="testWasCorrect" class="ok">✅ Правильно!</span>
                <span v-else class="bad">
                  ❌ Неправильно. Верно:
                  <b>{{ currentTestCard.deWord || currentTestCard.imageKey }}</b>
                </span>
              </div>

              <div class="learn-actions" style="gap: 10px;">
                <button class="btn btn-secondary" :disabled="!testLocked" @click="nextTest">
                  Далее
                </button>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            Нет карточек для теста 😿
          </div>
        </template>
      </div>
    </div>

    <!-- =============== LEARN FINISH MODAL =============== -->
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
    <!-- =============== TEST FINISH MODAL =============== -->
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

const currentTopicStat = computed(() => {
  return topicStats.value.find((topic) => topic.key === pictureTopic.value) || topicStats.value.find((topic) => topic.unlocked)
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
  // reset article flip
  flippedCardId.value = null
  guessResult.value = null
  userAnswers.value = []
  editingCardId.value = null
  open.value = false

  cardMode.value = mode
  if (mode === 'articles') {
    resetForm()
  } else {
    // ✅ in pictures: default = Learn
    startLearn()
  }
}

// ====== PICTURE submode (ONLY learn/test) ======
const pictureView = ref('learn') // 'learn' | 'test'
const setPictureView = (v) => {
  pictureView.value = v
  // reset learn/test UI state
  learnFlipped.value = false
  testLocked.value = false
  testSelectedKey.value = null
  testWasCorrect.value = false
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
  if (key && !isTopicUnlocked(key)) return

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

// ====== Permission for edit/delete ======
const uid = computed(() => getAuth().currentUser?.uid || null)
const canEdit = (card) => !!card?.ownerId && !!uid.value && card.ownerId === uid.value

// =======================================================
// ===================== PICTURES =========================
// =======================================================

// ✅ base picture list (ready only, by topic)
const basePictureList = computed(() => {
  let list = picturePack.filter((c) => c.isReady)
  if (pictureTopic.value) list = list.filter((c) => c.topic === pictureTopic.value)
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

const isTopicCompleted = (topic) => {
  const cards = getCardsByTopic(topic)
  if (!cards.length) return false

  const knownMap = getKnownMapByTopic(topic)
  return cards.every((card) => knownMap[card.imageKey])
}

const topicStats = computed(() => {
  return pictureTopics.map((topicMeta, index) => {
    const cards = getCardsByTopic(topicMeta.key)
    const total = cards.length
    const knownMap = getKnownMapByTopic(topicMeta.key)
    const knownCount = cards.filter((card) => knownMap[card.imageKey]).length
    const percent = total ? Math.round((knownCount / total) * 100) : 0
    const completed = total > 0 && knownCount === total

    let unlocked = index === 0

    if (index > 0) {
      const prevTopic = pictureTopics[index - 1]
      unlocked = isTopicCompleted(prevTopic.key)
    }

    return {
      ...topicMeta,
      total,
      knownCount,
      percent,
      completed,
      unlocked,
    }
  })
})

const isTopicUnlocked = (topicKey) => {
  const stat = topicStats.value.find((t) => t.key === topicKey)
  return !!stat?.unlocked
}

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
const firstUnlockedTopic = computed(() => {
  return topicStats.value.find((t) => t.unlocked && t.total > 0)?.key || ''
})
const startLearn = () => {
  setPictureView('learn')

  if (!pictureTopic.value) {
    pictureTopic.value = firstUnlockedTopic.value
  }

  learnQueue.value = shuffleArray(basePictureList.value)
  learnIndex.value = 0
  learnRound.value = 1
  learnUnknownMap.value = {}
  learnFlipped.value = false

  learnFinishModalOpen.value = false
  learnFinishModalType.value = 'success'
}

const learnNext = () => {
  if (learnIndex.value < learnQueue.value.length - 1) {
    learnIndex.value++
    learnFlipped.value = false
  }
}

const learnPrev = () => {
  if (learnIndex.value > 0) {
    learnIndex.value--
    learnFlipped.value = false
  }
}

// answer + finish behaviour:
// - at end: if no errors -> success modal
// - if errors -> errors modal with "repeat mistakes"
const learnAnswer = (known) => {
  const card = currentLearnCard.value
  if (!card) return

  // persist progress
  markKnown(card, known)

  // manage unknown map
  if (!known) learnUnknownMap.value[card.imageKey] = true
  else if (known) learnedWordsCount.value++
  else delete learnUnknownMap.value[card.imageKey]

  // always reset flip after answer
  learnFlipped.value = false

  // not last => next
  if (learnIndex.value < learnQueue.value.length - 1) {
    learnIndex.value++
    return
  }

  // last => modal
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
    { key: correct.imageKey, label: correct.deWord || correct.imageKey, isCorrect: true },
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
  setPictureView('test')

  if (!pictureTopic.value) {
    pictureTopic.value = firstUnlockedTopic.value
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
  min-height: 100vh;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
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
  box-shadow: 8px 8px 0 #1e1e1e;
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

.custom-select__option.locked {
  opacity: 0.55;
  cursor: not-allowed;
}

.custom-select__option.locked:hover {
  background-color: transparent;
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
  box-shadow: 8px 8px 0 #1e1e1e;
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

.action-btn {
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

.action-btn:hover {
  background-color: #ffffff;
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

.pack-info {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 24px;
  border: 3px solid #1e1e1e;
  box-shadow: 8px 8px 0 #1e1e1e;
}

.pack-text {
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  opacity: 0.8;
}

.pack-count {
  margin-top: 1rem;
  font-weight: 700;
}

.empty-state {
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  opacity: 0.7;
}

.submode-switch {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.submode-btn {
  flex: 1;
  font-family: 'Fredoka One', cursive;
  border: 3px solid #1e1e1e;
  border-radius: 14px;
  padding: 10px 10px;
  cursor: pointer;
  box-shadow: 4px 4px 0 #1e1e1e;
  background: #fff;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.submode-btn:hover {
  transform: translate(1px, 1px);
  box-shadow: 3px 3px 0 #1e1e1e;
}

.submode-btn.active {
  background: #4ade80;
}

.tiny-btn {
  padding: 10px 14px;
  font-size: 0.95rem;
}

.progress-box {
  margin-top: 10px;
  font-weight: 800;
}

.progress-pct {
  opacity: 0.75;
  margin-left: 6px;
}

.learn-wrap,
.test-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.learn-card,
.test-card {
  position: relative;
  overflow: hidden;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 24px;
  box-shadow: 8px 8px 0 #1e1e1e;
  padding: 18px;
}

.learn-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.learn-count {
  font-weight: 900;
  font-family: 'Fredoka One', cursive;
}

.learn-count.--learned {
  background: #0eba0e;
  color: #FFFFFF;
  padding: 10px;
  width: 50px;
  text-align: center;
  border-bottom-right-radius: 20px;
  border-bottom: 3px solid #1e1e1e;
}

.badge {
  font-weight: 900;
  width: 50px;
  color: #FFFFFF;
  text-align: center;
  border: 2px solid rgba(0, 0, 0, 0.12);
  padding: 10px;
  background: #e05f5f;
  border-bottom-left-radius: 20px;
  border-bottom: 3px solid #1e1e1e;
}

.learn-image {
  width: 160px;
  height: 160px;
  object-fit: contain;
  display: block;
  margin: 10px auto 0;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 22px;
  padding: 14px;
  border: 3px solid rgba(0, 0, 0, 0.1);
}

.learn-de {
  margin-top: 12px;
  text-align: center;
  font-family: 'Fredoka One', cursive;
  font-size: 1.2rem;
  color: #1e1e1e;
}

.learn-actions {
  display: flex;
  gap: 12px;
  margin-top: 14px;
}

.learn-actions .btn {
  flex: 1;
}

.learn-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.test-question {
  text-align: center;
  margin-top: 12px;
  font-weight: 800;
}

.test-answers {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-top: 12px;
}

.test-option {
  background: #fef8e4;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 12px 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 4px 4px 0 #1e1e1e;
  transition: all 0.2s;
  text-align: center;
}

.test-option:hover {
  transform: translate(1px, 1px);
  box-shadow: 3px 3px 0 #1e1e1e;
}

.test-option.correct {
  background: #dcfce7;
}

.test-option.wrong {
  background: #fee2e2;
}

.test-option.muted {
  opacity: 0.7;
}

.test-result {
  margin-top: 12px;
  font-weight: 900;
  text-align: center;
}

.test-result .ok {
  color: #166534;
}

.test-result .bad {
  color: #b91c1c;
}

.learn-badges {
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
  width: 200px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  border-radius: 22px;
}

.learn-flip-card.flipped {
  transform: rotateY(180deg);
}

.learn-flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.learn-flip-front {
  background: transparent;
}

.learn-flip-back {
  display: flex;
  flex-direction: column;
  transform: rotateY(180deg);
  background: #fff;
  border: 3px solid rgba(0, 0, 0, 0.1);
  padding: 14px;
}

.flip-hint {
  margin-top: 10px;
  text-align: center;
  font-weight: 700;
  opacity: 0.65;
  font-size: 0.95rem;
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
  box-shadow: 8px 8px 0 #1e1e1e;
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


.btn:focus-visible,
.mode-btn:focus-visible,
.submode-btn:focus-visible,

.custom-select__trigger:focus-visible,
.test-option:focus-visible,
.back-btn:focus-visible,
.action-btn:focus-visible,
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

   .pack-info,
  .form,
  .learn-card,
  .test-card,
  .card-face,
  .modal-window {
    box-shadow: 6px 6px 0 #1e1e1e;
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
  .learn-actions,
  .modal-actions {
    flex-direction: column;
  }

  .search-level {
    max-width: none;
  }

  .btn {
    width: 100%;
  }

  .learn-image {
    width: 140px;
    height: 140px;
  }

  .learn-flip-card {
    width: 200px;
    height: 200px;
  }

  .card-topic {
    font-size: 1.5rem;
  }
}
.topic-rail {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 4px 2px 10px;
  margin-top: 14px;
  scrollbar-width: thin;
}

.topic-chip {
  flex: 0 0 auto;
  width: 72px;
  min-height: 76px;
  border: 3px solid #1e1e1e;
  border-radius: 18px;
  background: #fff;
  box-shadow: 4px 4px 0 #1e1e1e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px 6px;
}

.topic-chip:hover:not(:disabled) {
  transform: translate(1px, 1px);
  box-shadow: 3px 3px 0 #1e1e1e;
}

.topic-chip:disabled {
  opacity: 1;
  -webkit-text-fill-color: inherit;
}

.topic-chip.locked {
  opacity: 0.45;
  background: #f3f4f6;
  cursor: not-allowed;
}

.topic-chip.completed {
  background: #dcfce7;
}

.topic-chip.active {
  background: #fef3c7;
  outline: 3px solid #fca13a;
  outline-offset: 2px;
}

.topic-chip.active.completed {
  background: #bbf7d0;
}

.topic-chip__icon {
  font-size: 1.3rem;
  line-height: 1;
}

.topic-chip__level {
  font-family: 'Fredoka One', cursive;
  font-size: 0.78rem;
  color: #1e1e1e;
}

.topic-spotlight {
  margin-top: 12px;
  background: #fffdf5;
  border: 3px solid #1e1e1e;
  border-radius: 20px;
  box-shadow: 5px 5px 0 #1e1e1e;
  padding: 14px;
}

.topic-spotlight__top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topic-spotlight__icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #fef3c7;
  border: 3px solid #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.topic-spotlight__name {
  font-weight: 900;
  font-size: 1rem;
  color: #1e1e1e;
}

.topic-spotlight__level {
  margin-top: 2px;
  font-size: 0.9rem;
  font-family: 'Fredoka One', cursive;
  color: #444;
}

.topic-spotlight__progress {
  margin-top: 12px;
  font-size: 0.92rem;
  font-weight: 800;
  color: #1e1e1e;
}

.topic-spotlight__bar {
  width: 100%;
  height: 12px;
  margin-top: 8px;
  border-radius: 999px;
  border: 2px solid rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.topic-spotlight__bar-fill {
  height: 100%;
  border-radius: 999px;
  background: #4ade80;
  transition: width 0.25s ease;
}

.topic-spotlight__status {
  margin-top: 10px;
  font-size: 0.85rem;
  font-weight: 800;
}

@media (max-width: 640px) {
  .topic-chip {
    width: 64px;
    min-height: 70px;
    border-radius: 16px;
  }

  .topic-chip__icon {
    font-size: 1.15rem;
  }

  .topic-chip__level {
    font-size: 0.72rem;
  }

  .topic-spotlight {
    padding: 12px;
  }

  .topic-spotlight__icon {
    width: 46px;
    height: 46px;
    font-size: 1.3rem;
  }

  .topic-spotlight__name {
    font-size: 0.95rem;
  }
}
</style>