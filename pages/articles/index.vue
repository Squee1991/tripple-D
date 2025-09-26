<template>
  <div class="theme-page">
    <div class="theme-page-container">
      <div class="theme__title-wrapper">
        <button class="back-btn" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20z"></path>
          </svg>
          {{ t('selectedpage.backBtn') }}
        </button>
        <h1 class="theme-title">{{ t('selectedpage.title') }}</h1>
        <div class="title-spacer"></div>
      </div>
      <div class="theme-content-area">
        <div class="grid-area-wrapper">
          <div class="theme__grid-container">
            <div class="theme-grid">
              <div
                  v-for="key in paginatedTopics"
                  :key="key"
                  class="theme-card"
                  :class="{ active: selectedTopic === key }"
                  @click="selectTopic(key)"
              >
                <div class="card-counter">
                  {{ themeProgress[key]?.total || 0 }}
                </div>
                <div class="theme-card-title">{{ t(nameMap[key]) }}</div>
              </div>
            </div>
            <div class="theme-pagination">
              <button @click="prevPage" :disabled="page === 0">←</button>
              <button @click="nextPage" :disabled="page === maxPage">→</button>
            </div>
          </div>
        </div>
        <div class="learning-modes-container">
          <Transition name="slide-right" appear>
            <div v-if="showModesBlock" class="learning-modes-block">
              <button @click="clearSelectedTopic" class="close-modes-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275L12 10.6l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275-.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275z"></path>
                </svg>
              </button>
              <div class="learning__modes-wrapper">
                <div>
                  <div class="modes-title">
                    {{ t('selectedpage.choiceTitle') }}
                  </div>
                  <div class="topic-hint">
                    {{ t('selectedpage.topic') }}: {{ t(nameMap[selectedTopic]) }}
                  </div>
                </div>
                <div class="modes-list">
                    <label
                            v-for="mode in modes"
                            :key="mode.key"
                            class="checkbox-container"
                            :class="{ 'active-mode': selectedModes.includes(mode.key) }"
                    >
                    <input
                        type="checkbox"
                        v-model="selectedModes"
                        :value="mode.key"
                    />
                    <span class="checkmark">
                                 <svg viewBox="0 0 24 24">
                                    <polyline points="3 12 10 20 21 4"/>
                                 </svg>
                              </span>
                    <span class="label-text">{{ t(mode.label) }}</span>
                  </label>
                </div>
                <button
                    class="start-btn"
                    :disabled="!selectedModes.length"
                    @click="startLearning"
                >
                  {{ t('selectedpage.startBtn') }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {userlangStore} from '../../store/learningStore.js'
import Lottie from 'lottie-web'
import {nameMap} from '../../utils/nameMap.js'
import { useHead, useSeoMeta} from '#imports'
import NotFound from '../../assets/animation/notFound.json'
import {useCanonical} from "../../composables/useCanonical.js";
const {t} = useI18n()
const showModesBlock = ref(false)
const showNoTopicMessage = ref(true)
const router = useRouter()
const store = userlangStore()
const themeList = ref({})
const selectedTopic = ref(null)
const selectedModes = ref([])
const animationContainer = ref(null)
const localePath = useLocalePath()
const canonical = useCanonical()

const pageTitle = 'German Corner — Тренировка артиклей der, die, das в игровой форме'
const pageDesc  = 'Изучайте немецкие артикли der, die, das легко и интересно! Выберите тему и тренируйтесь в пяти интерактивных режимах: запоминание, написание, множественное число, аудио и сборка слов.'

useHead({
  title: pageTitle,
  link: [
    { rel: 'canonical', href: canonical }
  ]
})

useSeoMeta({
  description: pageDesc,
  ogTitle: pageTitle,
  ogDescription: pageDesc,
  ogType: 'website',
  ogUrl: canonical,
  ogImage: '/images/seo-articles.png',
  robots: 'index, follow'
})

onMounted(() => {
  if (animationContainer.value) {
    Lottie.loadAnimation({
      container: animationContainer.value,
      loop: false,
      animationData: NotFound
    })
  }
})

const clearSelectedTopic = () => {
  showModesBlock.value = false
  setTimeout(() => {
    selectedTopic.value = null
    selectedModes.value = []
    showNoTopicMessage.value = false
  }, 450)

}

const goBack = () => {
  router.back()
}

const page = ref(0)
const itemsPerPage = 9

const topicKeys = computed(() => Object.keys(nameMap))

const maxPage = computed(() =>
    Math.ceil(topicKeys.value.length / itemsPerPage) - 1
)

const paginatedTopics = computed(() => {
  const start = page.value * itemsPerPage
  return topicKeys.value.slice(start, start + itemsPerPage)
})

const nextPage = () => {
  if (page.value < maxPage.value) page.value++
}
const prevPage = () => {
  if (page.value > 0) page.value--
}

const modes = [
  {key: 'article', label: 'modes.article'},
  {key: 'letters', label: 'modes.letters'},
  {key: 'wordArticle', label: 'modes.articleWord'},
  {key: 'plural', label: 'modes.plural'},
  {key: 'audio', label: 'modes.audio'}
]

const themeProgress = computed(() => {
  return Object.fromEntries(
      Object.entries(themeList.value).map(([key, words]) => {
        const total = words.length
        const learned = words.filter(word =>
            store.learnedWords.some(lw => lw.de === word.de && lw.topic === key)
        ).length
        return [key, {learned, total}]
      })
  )
})

const selectTopic = (key) => {
  selectedTopic.value = key
  selectedModes.value = []
  showModesBlock.value = true
}

const startLearning = async () => {
  const topicWords = (themeList.value[selectedTopic.value] || [])
      .filter(word => {
        const globalWord = store.words.find(
            w => w.de === word.de && w.topic === selectedTopic.value
        )
        return selectedModes.value.some(
            mode => !(globalWord?.progress?.[mode] === true)
        )
      })
      .map(w => ({...w, topic: selectedTopic.value}))

  await store.addWordsToGlobal(topicWords)
  await store.setSelectedWords(topicWords)
  await store.setSelectedTopics([selectedTopic.value])
  await store.saveToFirebase()

  const path = localePath({
    path: '/articles/articles-session',
    query: {
      topic: selectedTopic.value,
      mode: selectedModes.value
    }
  })
  router.push(path)

}

onMounted(async () => {
  const res = await fetch('/words.json')
  themeList.value = await res.json()
})

</script>

<style scoped>

.theme-page {
  font-family: "Nunito", sans-serif;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.theme-page-container {
  width: 100%;
  max-width: 1200px;
  height: calc(100vh - 4rem);
  display: flex;
  flex-direction: column;
}

.theme__title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem 1rem 1rem;
  border-bottom: 4px solid #1e1e1e;
  flex-shrink: 0;
}

.title-spacer {
  width: 120px;
}

.theme-title {
  font-family: "Nunito", sans-serif;
  font-size: 2.5rem;
  color: var(--titleColor);
  text-align: center;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  font-size: 1.2rem;
  background: #4ade80;
  border: 3px solid #1e1e1e;
  color: #1e1e1e;
  padding: 0.6rem 1rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  box-shadow: 4px 4px 0px #1e1e1e;
  width: 150px;
}

.back-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.back-btn svg {
  font-size: 1.5em;
}

.theme-content-area {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  position: relative;
  gap: 1.5rem;
  margin-top: 1rem;
}

.grid-area-wrapper {
  flex-grow: 1;
  background: #60a5fa;
  border: 3px solid #1e1e1e;
  border-radius: 24px;
  box-shadow: 8px 8px 0px #1e1e1e;
  padding: 1rem;
  display: flex;
  overflow: hidden;
}

.theme__grid-container {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
}

.theme__grid-container::-webkit-scrollbar {
  width: 12px;
}

.theme__grid-container::-webkit-scrollbar-track {
  background: transparent;
}

.theme__grid-container::-webkit-scrollbar-thumb {
  background: #1e1e1e;
  border-radius: 6px;
  border: 3px solid #60a5fa;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  justify-content: start;
  align-content: start;
}

.theme-card {
  background: #fff;
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
  padding: 25px 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
}

.theme-card:hover {
  transform: translateY(-4px);
  box-shadow: 6px 6px 0px #1e1e1e;
}

.theme-card.active {
  background-color: #f1c40f;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.card-counter {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 32px;
  height: 32px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  border: 3px solid #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 400;
}

.theme-card-title {
  font-family: "Nunito", sans-serif;
  font-size: 1.5rem;
  color: #1e1e1e;
}

.theme-pagination {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-shrink: 0;
  padding-bottom: 0.5rem;
}

.theme-pagination button {
  font-family: "Nunito", sans-serif;
  background: #fff;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  width: 45px;
  height: 45px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 4px 4px 0px #1e1e1e;
}

.theme-pagination button:hover:not(:disabled) {
  background: #f1c40f;
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.theme-pagination button:disabled {
  background: #d1d1d1;
  color: #888;
  box-shadow: 2px 2px 0px #888;
  cursor: not-allowed;
}

.learning-modes-container {
  position: relative;
  width: 350px;
  flex-shrink: 0;
}

.learning-modes-block {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 24px;
  /*box-shadow: 8px 8px 0px #1e1e1e;*/
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.close-modes-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #e0e0e0;
  border: 3px solid #1e1e1e;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1e1e1e;
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

.close-modes-btn:hover {
  background: #e74c3c;
  color: white;
}

.modes-title {
  font-size: 2rem;
  text-align: center;
  color: #1e1e1e;
  margin-top: 25px;
}

.topic-hint {
  text-align: center;
  color: #555;
  margin-bottom: 1.5rem;
  font-family: 'Inter', sans-serif;
  font-style: italic;
  font-weight: 500;
}

.modes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding: 10px;
  border-radius: 12px;
  transition: background-color 0.2s;
}

.checkbox-container:hover {
  background-color: #fef8e4;
}

.checkbox-container input {
  display: none;
}

.checkmark {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 3px solid #1e1e1e;
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
  transition: stroke-dashoffset 0.4s ease;
}

.checkbox-container input:checked + .checkmark {
  background-color: #f1c40f;
}

.checkbox-container input:checked + .checkmark polyline {
  stroke-dashoffset: 0;
}

.checkbox-container input:checked + .checkmark svg {
  opacity: 1;
}

.label-text {
  color: #1e1e1e;
  font-weight: 400;
  font-size: 1.2rem;
}

.start-btn {
  width: 100%;
  padding: 1rem;
  font-family: "Nunito", sans-serif;
  font-size: 1.5rem;
  background-color: #4ade80;
  border: 3px solid #1e1e1e;
  color: #1e1e1e;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  box-shadow: 4px 4px 0px #1e1e1e;
  margin-top: 1rem;
}

.start-btn:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #1e1e1e;
}

.start-btn:disabled {
  background: #e0e0e0;
  color: #a1a1a1;
  box-shadow: 2px 2px 0px #a1a1a1;
  cursor: not-allowed;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: transform 0.45s ease;
}

.slide-right-enter-from, .slide-right-leave-to {
  transform: translateX(110%);
}

@media (max-width: 767px) {
  .theme-content-area {
    gap: 0;
  }

  .theme-page {
    padding: 10px;
  }

  .grid-area-wrapper {
    width: 100%;
    box-shadow: none;
  }

  .learning-modes-block {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 380px;
    z-index: 2000;
    border-radius: 0;
    box-shadow: -5px 0px 15px rgba(0, 0, 0, 0.1);
    border: none;
    border-left: 3px solid #1e1e1e;
  }

  .slide-right-enter-from,
  .slide-right-leave-to {
    transform: translateX(100%);
  }

  .theme-title {
    font-size: 1.1rem;
    margin: 0 0.5rem;
    line-height: 1.2;
  }

  .theme__title-wrapper {
    padding: 0 0.5rem 1rem 0.5rem;
  }

  .back-btn {
    padding: 0.5rem 0.8rem;
    width: auto;
    flex-shrink: 0;
  }

  .title-spacer {
    display: none;
  }

  .learning-modes-container {
    width: 0;
  }

  .learning-modes-block {
    max-width: 100%;
  }

  .theme-card {
    padding: 15px 10px;
  }

  .theme-card-title {
    font-size: 1.1rem;
  }
}

@media(max-width: 540px )  {
  .theme__title-wrapper {
    flex-direction: column;
  }
  .back-btn {
    box-shadow: 2px 2px 0 black;
    width: 100%;
    margin-bottom: 15px;
  }
  .theme-title {
    font-size: 1.2rem;
  }
}
.checkbox-container.active-mode {
    background-color: #f1c40f; /* Используем тот же цвет, что и для выбранной темы */
    border-radius: 12px;
}

</style>