<template>
  <div class="theme-page">
    <Transition name="fade">
      <VPreloader v-if="isLoading"/>
    </Transition>
    <div class="theme-page-container">
      <div class="theme__title-wrapper">
        <div class="theme__header">
          <VBackBtn/>
          <div class="theme__title">Темы изучения артиклей</div>
        </div>
      </div>
      <div class="theme-content-area">
        <div class="grid-area-wrapper">
          <div class="theme__grid-container">
            <div class="theme-grid">
              <div
                  v-for="key in topicKeys"
                  :key="key"
                  class="theme-card"
                  :class="{ active: selectedTopic === key }"
                  @click="selectTopic(key)"
              >
                <div class="card-counter">
                  {{ themeProgress[key]?.total || 0 }}
                </div>

                <div class="theme-card-icon">
                  <img class="theme__cards-icon-item" :src="`/images/article-themes-images/${iconMap[key] || 'default.svg'}`" :alt="key" />
                </div>
                <div class="theme-card-title">{{ t(nameMap[key]) }}</div>
              </div>
            </div>
          </div>
        </div>
        <Transition name="slide-right" appear>
          <div v-if="showModesBlock" class="learning-modes-block">
            <div class="learning__modes-wrapper">
              <button @click="clearSelectedTopic" class="close-modes-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path
                      fill="currentColor"
                      d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275L12 10.6l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275-.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275z"
                  ></path>
                </svg>
              </button>
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
                    v-for="mode in availableModes"
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
                  :disabled="!selectedModes.length || isLoading"
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
</template>

<script setup>
import VPreloader from "../../src/components/V-preloader.vue";
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { userlangStore } from '../../store/learningStore.js'
import Lottie from 'lottie-web'
import { nameMap } from '../../utils/nameMap.js'
import { useHead, useSeoMeta } from '#imports'
import NotFound from '../../assets/animation/notFound.json'
import { useCanonical } from '../../composables/useCanonical.js'
import VBackBtn from "~/src/components/V-back-btn.vue";

const iconMap = {
  Furniture: 'chair.svg',
  Animals: 'animals.svg',
  Clothes: 'hemd.svg',
  Food: 'meal.svg',
  Body: 'body.svg',
  Professions: 'profession.svg',
  Transport: 'transport.svg',
  Colors: 'colors.svg',
  Nature: 'nature.svg',
  Home: 'home.svg',
  Zeit: 'time.svg',
  City: 'city.svg',
  School: 'school.svg',
  DaysAndMonths: 'calendar.svg',
  Toys: 'toys.svg',
  CommonItems: 'Informatik.svg',
  BathroomItems: 'bath-room.svg',
  Kosmetik: 'makeup.svg',
  Familie: 'family.svg',
  Emotions: 'emotions.svg',
  Werkzeuge: 'instruments.svg',
  Kitchen: 'kitchen.svg',
  Health: 'health.svg',
  Sport: 'sport.svg',
  SportEquipment: 'fitness.svg',
  Travel: 'travel.svg',
  Musik: 'Music.svg',
  Amount: 'Amount.svg',
  Informatik: 'Informatik.svg'
}

const { t } = useI18n()
const showModesBlock = ref(false)
const showNoTopicMessage = ref(true)
const router = useRouter()
const store = userlangStore()
const themeList = ref({})
const selectedTopic = ref(null)
const selectedModes = ref([])
const animationContainer = ref(null)
const localePath = useLocalePath()
const isLoading = ref(false)

useSeoMeta({
  robots: 'noindex, nofollow'
})

const clearSelectedTopic = () => {
  showModesBlock.value = false
  setTimeout(() => {
    selectedTopic.value = null
    selectedModes.value = []
    showNoTopicMessage.value = false
  }, 250)
}

const topicKeys = computed(() => Object.keys(nameMap))

const baseModes = [
  { key: 'wordTranslate',     label: 'modes.wordTranslate' },
  { key: 'article',     label: 'modes.article' },
  { key: 'letters',     label: 'modes.letters' },
  { key: 'wordArticle', label: 'modes.articleWord' },
  { key: 'plural',      label: 'modes.plural' },
  { key: 'audio',       label: 'modes.audio' }
]

const topicWords = computed(() => {
  const key = selectedTopic.value
  if (!key) return []
  return Array.isArray(themeList.value[key]) ? themeList.value[key] : []
})

function hasAnyPlural(wordsArray) {
  const list = Array.isArray(wordsArray) ? wordsArray : []
  return list.some(w => w.plural && String(w.plural).trim() !== '')
}

const hasPluralForCurrentTopic = computed(() => hasAnyPlural(topicWords.value))

const availableModes = computed(() => {
  return hasPluralForCurrentTopic.value
      ? baseModes
      : baseModes.filter(m => m.key !== 'plural')
})

const themeProgress = computed(() => {
  return Object.fromEntries(
      Object.entries(themeList.value).map(([key, words]) => {
        const total = words.length
        const learned = words.filter(word =>
            store.learnedWords.some(lw => lw.de === word.de && lw.topic === key)
        ).length
        return [key, { learned, total }]
      })
  )
})

const selectTopic = (key) => {
  selectedTopic.value = key
  selectedModes.value = []
  showModesBlock.value = true
}

const startLearning = async () => {
  if (!selectedModes.value.length || isLoading.value) return
  isLoading.value = true
  try {
    const topicWordsLocal = (themeList.value[selectedTopic.value] || [])
        .filter(word => {
          const globalWord = store.words.find(
              w => w.de === word.de && w.topic === selectedTopic.value
          )
          return selectedModes.value.some(mode => !(globalWord?.progress?.[mode] === true))
        })
        .map(w => ({ ...w, topic: selectedTopic.value }))

    await store.addWordsToGlobal(topicWordsLocal)
    await store.setSelectedWords(topicWordsLocal)
    await store.setSelectedTopics([selectedTopic.value])
    await store.saveToFirebase()

    await nextTick()
    const path = localePath({
      path: '/articles/articles-session',
      query: { topic: selectedTopic.value, mode: selectedModes.value }
    })
    await router.push(path)
  } catch (e) {
    console.error(e)
    isLoading.value = false
  }
}

onMounted(async () => {
  const res = await fetch('/words.json')
  themeList.value = await res.json()
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
</script>

<style scoped>
.theme-page {
  font-family: "Nunito", sans-serif;
  height: 100%;
  width: 100vw;
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
}

.theme__header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 10px 10px 10px;
  margin-bottom: 5px;
  border-bottom: 2px solid #ffffff;
  border-radius: 10px;
}

.theme__title {
  flex: 1;
  display: flex;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin-left: 15px;
  font-family: "Nunito", sans-serif;
}

.theme__title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.theme-title {
  font-family: "Nunito", sans-serif;
  font-size: 15px;
  color: var(--titleColor, #1e1e1e);
  text-align: center;
  padding: 10px;
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
  padding: 10px 10px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.theme__grid-container::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px 10px;
  justify-content: start;
  align-content: start;
  padding-bottom: 1.4rem;
}

.theme-card {
  background: #fff;
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  box-shadow: 4px 4px 0px #1e1e1e;
  text-align: center;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}


.card-counter {
  position: absolute;
  top: -5px;
  right: -8px;
  width: 45px;
  height: 35px;
  background-color: #e74c3c;
  color: white;
  border-radius: 25%;
  border: 3px solid #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 400;
  z-index: 2;
}

.theme-card-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 10px;
  flex-grow: 1;
}

.theme__cards-icon-item {
  width: 75px;
  height: 75px;
  object-fit: contain;
}

.theme-card-title {
  font-family: "Nunito", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: rebeccapurple;
  padding: 10px;
  width: 100%;
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
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.learning__modes-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.close-modes-btn {
  position: absolute;
  top: 0;
  left: 15px;
  background: #e0e0e0;
  border: 3px solid #1e1e1e;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1e1e1e;
  font-size: 1.5rem;
  transition: background-color 0.1s ease;
}

.close-modes-btn:active {
  background: #e74c3c;
  color: white;
}

.modes-title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: var(--titleColor);
}

.topic-hint {
  text-align: center;
  color: #726b6b;
  margin-bottom: 1.5rem;
  font-family: Nunito, sans-serif;
  font-style: italic;
  font-weight: 500;
  margin-top: 5px;
}

.modes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
  overflow-y: auto;
  padding-bottom: 20px;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  user-select: none;
  position: relative;
  padding: 12px;
  border-radius: 12px;
  background: #f9f9f9;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.checkbox-container:active {
  background-color: #fef8e4;
}

.checkbox-container.active-mode {
  background-color: #f1c40f;
  border: 2px solid #1e1e1e;
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
  transition: stroke-dashoffset 0.3s ease;
}

.checkbox-container input:checked + .checkmark {
  background-color: #fff;
}

.checkbox-container input:checked + .checkmark polyline {
  stroke-dashoffset: 0;
}

.checkbox-container input:checked + .checkmark svg {
  opacity: 1;
}

.label-text {
  color: #1e1e1e;
  font-weight: 600;
  font-size: 1.1rem;
}

.start-btn {
  width: 100%;
  padding: 1rem;
  font-family: "Nunito", sans-serif;
  font-size: 19px;
  font-weight: 700;
  background-color: #4ade80;
  border: 3px solid #1e1e1e;
  color: #1e1e1e;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 4px 4px 0px #1e1e1e;
  margin-top: 10px;
  margin-bottom: 20px;
}

.start-btn:disabled {
  background: #e0e0e0;
  color: #a1a1a1;
  border-color: #a1a1a1;
  box-shadow: 2px 2px 0px #a1a1a1;
  cursor: not-allowed;
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
</style>