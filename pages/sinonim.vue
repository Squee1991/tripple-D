<template>
  <div class="app">
    <div class="app__sky">
      <div class="app__cloud app__cloud--1"></div>
      <div class="app__cloud app__cloud--2"></div>
      <div class="app__cloud app__cloud--3"></div>
    </div>
<!--    <button class="back-btn back-btn&#45;&#45;fixed" type="button" @click="goHome">← На главную</button>-->
    <div class="app__container">
      <div class="app__scroll">
        <div v-if="exercisesStore.isLoading" class="panel">
          <div class="ribbon">
            <div class="ribbon__edge ribbon__edge--left"></div>
            <div class="ribbon__center">Загрузка…</div>
            <div class="ribbon__edge ribbon__edge--right"></div>
          </div>
        </div>
        <div v-else-if="exercisesStore.loadingError" class="panel">
          <div class="ribbon">
            <div class="ribbon__edge ribbon__edge--left"></div>
            <div class="ribbon__center">Ошибка загрузки</div>
            <div class="ribbon__edge ribbon__edge--right"></div>
          </div>
          <div class="panel">
            <div class="topbar__hint">{{ exercisesStore.loadingError }}</div>
            <div class="actions actions--column">
              <button class="play-btn" type="button" @click="reloadExercises">
                ↻ Попробовать ещё раз
              </button>
            </div>
          </div>
        </div>
        <template v-else>
          <template v-if="currentScreen === 'categories'">
            <div class="ribbon">
              <div class="ribbon__edge ribbon__edge--left"></div>
              <div class="ribbon__center">Выберите раздел</div>
              <div class="ribbon__edge ribbon__edge--right"></div>
            </div>
            <div class="panel">
              <div class="grid-2">
                <button
                    v-for="category in availableCategories"
                    :key="category.id"
                    class="tile"
                    :class="category.color"
                    type="button"
                    @click="openLevelsSelection(category)"
                >
                  <div class="tile__icon">{{ category.icon }}</div>
                  <div class="tile__title" v-html="category.title"></div>
                </button>
              </div>
            </div>
          </template>

          <template v-else-if="currentScreen === 'levels'">
            <div class="ribbon">
              <div class="ribbon__edge ribbon__edge--left"></div>
              <div class="ribbon__center">{{ selectedCategoryMeta?.titleText }}</div>
              <div class="ribbon__edge ribbon__edge--right"></div>
            </div>
            <div class="panel">
              <button class="play-btn play-btn--secondary" type="button" @click="returnToCategories">
                ← Вернуться к разделам
              </button>
              <div class="levels">
                <button
                    v-for="levelNum in levelNumbersList"
                    :key="levelNum"
                    class="level-btn"
                    :class="{ 'level-btn--selected': exercisesStore.selectedLevelNumber === levelNum }"
                    type="button"
                    @click="selectSpecificLevel(levelNum)"
                >
                  <div class="level-btn__num">{{ levelNum }}</div>
                  <div class="level-btn__text">уровень</div>
                </button>
              </div>
                <button class="play-btn"
                    type="button"
                    :disabled="!exercisesStore.selectedLevelNumber || exercisesStore.totalTasksCount === 0"
                    @click="startNewGame"
                >
                  ▶ Начать игру
                </button>

            </div>
          </template>
          <template v-else>
            <div class="ribbon">
              <div class="ribbon__edge ribbon__edge--left"></div>
              <div class="ribbon__center">{{ selectedCategoryMeta?.titleText }}</div>
              <div class="ribbon__edge ribbon__edge--right"></div>
            </div>
            <div class="actions actions--column">
              <button class="play-btn play-btn--secondary" type="button" @click="returnToLevels">
                ← Вернуться к уровням
              </button>
            </div>
            <div class="progress">
              <div class="progress__bar">
                <div class="progress__count">
                  {{
                    exercisesStore.totalTasksCount
                        ? (exercisesStore.isSessionFinished ? exercisesStore.totalTasksCount : exercisesStore.currentTaskIndex + 1)
                        : 0
                  }}
                  / {{ exercisesStore.totalTasksCount }}
                </div>
                <div class="progress__fill" :style="{ width: exercisesStore.progressPercent + '%' }"></div>
              </div>
            </div>

            <template v-if="exercisesStore.isSessionFinished">
              <div class="finish">
                <div class="finish__title">Уровень пройден!</div>
                <div class="finish__subtitle">
                  Результат: {{ exercisesStore.correctAnswersCount }} / {{ exercisesStore.totalTasksCount }}
                </div>
                <div  class="actions actions--column finish__actions">
                  <button class="play-btn" type="button" @click="restartCurrentLevel">↻ Пройти ещё раз</button>
                  <button class="play-btn" type="button" :disabled="!hasNextLevelAvailable" @click="goToNextLevel">▶ Следующий уровень</button>
                </div>
              </div>
            </template>
            <template v-else>
              <div
                  class="question"
                  :class="{
                  'question--correct': exercisesStore.feedbackStatus === 'success',
                  'question--wrong': exercisesStore.feedbackStatus === 'error'
                }"
              >
                <Transition name="bounce" mode="out-in">
                  <div class="question__word" :key="exercisesStore.currentTask?.question">
                    {{ exercisesStore.currentTask?.question }}
                  </div>
                </Transition>
              </div>
              <div class="answers">
                <button
                    v-for="option in answerOptionsList"
                    :key="option.text"
                    class="answer"
                    :class="[
                      option.colorClass,
                      {
                        'answer--correct': exercisesStore.feedbackStatus === 'success' && exercisesStore.lastSelectedAnswer === option.text,
                        'answer--wrong': exercisesStore.feedbackStatus === 'error' && exercisesStore.lastSelectedAnswer === option.text,
                        'answer--dimmed': exercisesStore.feedbackStatus !== '' && exercisesStore.lastSelectedAnswer !== option.text
                      }
                    ]"
                    type="button"
                    :disabled="exercisesStore.isInputLocked"
                    @click="exercisesStore.submitAnswer(option.text)"
                >
                  <span class="answer__text">{{ option.text }}</span>
                </button>
              </div>
            </template>
          </template>
        </template>
      </div>
    </div>
    <div class="app__city"></div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useTypeExercisesStore} from "../store/typeExercisesStore.js";
import {useSeoMeta} from "#imports";

const router = useRouter();
const exercisesStore = useTypeExercisesStore();
const currentScreen = ref("categories");

useSeoMeta({
  robots: 'noindex, nofollow'
})

const finishButtons = ref([
  {id: '' , text: 'Пройти ещё раз'},
  {id: '' , text: '▶ Следующий уровень'},
])


const categoryMetadata = ref([
  {id: "antonyms", icon: "↔️", title: "Антонимы", titleText: "Антонимы", color: "tile--green"},
  {id: "synonyms", icon: "🔁", title: "Синонимы", titleText: "Синонимы", color: "tile--orange"},
  {id: "collocations", icon: "🔗", title: "Слово-сочетания", titleText: "Словосочетания", color: "tile--blue"},
  {id: "sentences", icon: "💬", title: "Предложения", titleText: "Предложения", color: "tile--sky"},
  {id: "paraphrase", icon: "🧠", title: "Перефраз", titleText: "Перефразирование", color: "tile--gold"},
  {id: "context", icon: "📖", title: "По контексту", titleText: "Понимание по контексту", color: "tile--red"},
  {id: "logic", icon: "🧩", title: "Логика смысла", titleText: "Логический выбор", color: "tile--purple"},
  {id: "dialogs", icon: "🗨️", title: "Диалоги", titleText: "Диалоги", color: "tile--teal"},
  {id: "negation", icon: "🚫", title: "Отрицание", titleText: "Отрицание", color: "tile--gray"},
  {id: "expressions", icon: "❗", title: "Устойчивые выражения", titleText: "Устойчивые выражения", color: "tile--brown"}
]);

onMounted(async () => {
  await exercisesStore.loadExercises();
});

async function reloadExercises() {
  exercisesStore.exercisesData = [];
  await exercisesStore.loadExercises();
}

const availableCategories = computed(() => {
  const loadedIds = new Set((exercisesStore.exercisesData ?? []).map((cat) => cat.id));
  return categoryMetadata.value.filter((cat) => loadedIds.has(cat.id));
});

const selectedCategoryMeta = computed(() => {
  return categoryMetadata.value.find((cat) => cat.id === exercisesStore.selectedCategoryId) ?? null;
});

const levelNumbersList = computed(() => {
  return (exercisesStore.selectedCategory?.levels ?? []).map((lvl) => lvl.level);
});

const answerOptionsList = computed(() => {
  return (exercisesStore.currentTask?.options ?? []).map((text, idx) => ({
    text,
    colorClass: idx === 0 ? "answer--green" : idx === 1 ? "answer--red" : "answer--blue"
  }));
});

const hasNextLevelAvailable = computed(() => {
  const current = exercisesStore.selectedLevelNumber;
  if (!current) return false;
  return (exercisesStore.selectedCategory?.levels ?? []).some((lvl) => lvl.level === current + 1);
});

watch(
    () => [exercisesStore.selectedCategoryId, exercisesStore.selectedLevelNumber, exercisesStore.totalTasksCount],
    () => {
      if (currentScreen.value === "game" && (!exercisesStore.selectedCategoryId || !exercisesStore.selectedLevelNumber)) {
        currentScreen.value = "categories";
      }
    }
);

function goHome() {
  router.push("/");
}

function openLevelsSelection(category) {
  exercisesStore.setCategory(category.id);
  currentScreen.value = "levels";
}

function selectSpecificLevel(num) {
  exercisesStore.setLevel(num);
}

function startNewGame() {
  exercisesStore.resetSession();
  currentScreen.value = "game";
}

function restartCurrentLevel() {
  exercisesStore.resetSession();
}

function goToNextLevel() {
  if (!hasNextLevelAvailable.value) return;
  exercisesStore.setLevel(exercisesStore.selectedLevelNumber + 1);
  currentScreen.value = "game";
}

function returnToCategories() {
  currentScreen.value = "categories";
}

function returnToLevels() {
  currentScreen.value = "levels";
}
</script>

<style scoped>

.app {
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #6fc7ff 0%, #bfe8ff 45%, #ffe6a9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  font-family: "Nunito", sans-serif;
}

.app__container {
  position: relative;
  width: min(980px, 100%);
  height: 100%;
  z-index: 2;
  display: flex;
}

.app__scroll {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 50px;
  scrollbar-gutter: stable;
}

.app__scroll::-webkit-scrollbar {
  width: 6px;
}

.app__scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.18);
  border-radius: 999px;
}

.app__sky {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.app__cloud {
  position: absolute;
  width: 260px;
  height: 90px;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 999px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.app__cloud::before, .app__cloud::after {
  content: "";
  position: absolute;
  background: rgba(255, 255, 255, 0.75);
  border-radius: 999px;
}

.app__cloud::before {
  width: 120px;
  height: 80px;
  left: 35px;
  top: -35px;
}

.app__cloud::after {
  width: 140px;
  height: 95px;
  right: 25px;
  top: -45px;
}

.app__cloud--1 {
  left: -40px;
  top: 80px;
  opacity: 0.85;
  transform: scale(1.05);
}

.app__cloud--2 {
  right: -60px;
  top: 140px;
  opacity: 0.7;
  transform: scale(0.95);
}

.app__cloud--3 {
  left: 50%;
  top: 40px;
  transform: translateX(-50%) scale(0.8);
  opacity: 0.65;
}

.ribbon {
  position: relative;
  margin: 0 auto 18px;
  width: min(920px, 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ribbon__center {
  padding: 15px 0;
  width: 100%;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffb347 0%, #ff8a00 100%);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
  font-size: clamp(22px, 2.4vw, 36px);
  border: 4px solid rgba(255, 255, 255, 0.25);
  text-align: center;
}

.ribbon__edge {
  position: absolute;
  top: 10px;
  width: 62px;
  height: 66px;
  background: linear-gradient(180deg, #ff9f2e 0%, #e76f00 100%);
  border-radius: 14px;
}

.ribbon__edge--left {
  left: -24px;
  clip-path: polygon(0 0, 100% 12%, 78% 50%, 100% 88%, 0 100%, 18% 50%);
}

.ribbon__edge--right {
  right: -24px;
  clip-path: polygon(100% 0, 0 12%, 22% 50%, 0 88%, 100% 100%, 82% 50%);
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(12px, 2vw, 18px);
}

.tile {
  border: none;
  cursor: pointer;
  border-radius: 22px;
  padding: 16px;
  display: grid;
  place-items: center;
  gap: 10px;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.18);
  border: 4px solid rgba(255, 255, 255, 0.35);
  transition: transform 140ms ease;
}

.tile:active {
  transform: translateY(2px) scale(0.99);
}

.tile__icon {
  font-size: clamp(38px, 4.8vw, 56px);
}

.tile__title {
  text-align: center;
  font-weight: 900;
  color: #fff;
  font-size: clamp(18px, 2.2vw, 28px);
  line-height: 1.05;
}

.tile--green {
  background: linear-gradient(180deg, #46d16a 0%, #1aa84c 100%);
}

.tile--orange {
  background: linear-gradient(180deg, #ffbf57 0%, #ff8a00 100%);
}

.tile--red {
  background: linear-gradient(180deg, #ff5b5b 0%, #e02b2b 100%);
}

.tile--blue {
  background: linear-gradient(180deg, #3a8dff 0%, #1f67d8 100%);
}

.tile--sky {
  background: linear-gradient(180deg, #6aa8ff 0%, #2a78ff 100%);
}

.tile--gold {
  background: linear-gradient(180deg, #ffb347 0%, #ff8a00 100%);
}

.tile--purple {
  background: linear-gradient(180deg, #b06cff 0%, #6a2cff 100%);
}

.tile--teal {
  background: linear-gradient(180deg, #3fe0c5 0%, #0ea08a 100%);
}

.tile--gray {
  background: linear-gradient(180deg, #9aa6b2 0%, #56616b 100%);
}

.tile--brown {
  background: linear-gradient(180deg, #c08a5a 0%, #7a4a22 100%);
}

.back-btn {
  border: none;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 14px;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(180deg, rgba(25, 60, 95, 0.85) 0%, rgba(18, 45, 75, 0.9) 100%);
}

.back-btn--fixed {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.levels {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
}

.level-btn {
  cursor: pointer;
  padding: 10px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f3f6fb 100%);
  border: 2px solid rgba(0, 0, 0, 0.06);
}

.level-btn__num {
  font-weight: 1000;
  font-size: 30px;
  color: #1f4e8c;
}

.level-btn__text {
  margin-top: -6px;
  font-weight: 900;
  color: rgba(31, 78, 140, 0.7);
  font-size: 13px;
}

.level-btn--selected {
  border: 3px solid rgba(255, 138, 0, 0.7);
}

.actions {
  display: flex;
  margin-top: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.play-btn {
  border: none;
  cursor: pointer;
  padding: 14px 22px;
  border-radius: 18px;
  font-weight: 900;
  font-size: clamp(18px, 2vw, 24px);
  color: #fff;
  background: linear-gradient(180deg, #ffb347 0%, #ff8a00 100%);
  border: 3px solid rgba(255, 255, 255, 0.28);
}

.play-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-btn--secondary {
  background: linear-gradient(180deg, rgba(25, 60, 95, 0.85) 0%, rgba(18, 45, 75, 0.9) 100%);
  margin-bottom: 20px;
}

.progress {
  margin-bottom: 15px;
}

.progress__bar {
  position: relative;
  height: 27px;
  width: 100%;
  background: rgba(31, 78, 140, 0.15);
  border-radius: 999px;
  overflow: hidden;
}

.progress__count {
  position: absolute;
  left: 50%;
  font-weight: 900;
  color: #1f4e8c;
  font-size: 18px;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.progress__fill {
  height: 100%;
  width: 0;
  background: linear-gradient(90deg, #46d16a 0%, #ffb347 60%, #ff8a00 100%);
  transition: width 260ms ease;
}

.question {
  margin: 0 auto 26px;
  padding: 26px 24px 22px;
  border-radius: 22px;
  background: #fff;
  text-align: center;
  box-shadow: 0 6px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, border-color 0.3s ease;
  border: 4px solid transparent;
}

.question--correct {
  background-color: #e8f9ec !important;
  border-color: #46d16a !important;
}

.question--wrong {
  background-color: #ffebeb !important;
  border-color: #ff5b5b !important;
}

.answers {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}

.answer {
  border: none;
  cursor: pointer;
  border-radius: 22px;
  padding: 12px;
  border: 4px solid rgba(255, 255, 255, 0.35);
}

.answer__text {
  font-weight: 900;
  color: #fff;
  font-size: clamp(24px, 3vw, 40px);
}

.answer--green {
  background: linear-gradient(180deg, #46d16a 0%, #1aa84c 100%);
}

.answer--red {
  background: linear-gradient(180deg, #ff5b5b 0%, #e02b2b 100%);
}

.answer--blue {
  background: linear-gradient(180deg, #3a8dff 0%, #1f67d8 100%);
}

.finish {
  padding: 22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
}

.finish__title {
  font-weight: 1000;
  font-size: 34px;
  color: #1f4e8c;
}

.bounce-enter-active {
  animation: bounceIn 380ms ease;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.answer--correct {
  background: linear-gradient(180deg, #46d16a 0%, #1aa84c 100%) !important;
  transform: scale(1.01);
  box-shadow: 0 0 25px rgba(70, 209, 106, 0.6);
  border-color: #fff !important;
  z-index: 10;
}

.question--wrong .question__word {
  display: inline-block;
  animation: shakeX 0.5s ease;
}

.answer--dimmed {
  opacity: 0.4;
  filter: grayscale(0.5);
  transform: scale(0.95);
}

@keyframes shakeX {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

.question__word {
  font-weight: 900;
  font-size: clamp(40px, 5vw, 70px);
  color: #1f4e8c;

}

.app__city {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  bottom: 0;
  height: 200px;
  background: #1b5638;
  pointer-events: none;
  clip-path: polygon(
      0 100%,
      0 70%,
      5% 68%,
      10% 66%,
      15% 64%,
      20% 62%,
      30% 64%,
      40% 66%,
      50% 65%,
      60% 63%,
      70% 65%,
      80% 67%,
      90% 69%,
      100% 68%,
      100% 100%
  );
}

@media (max-width: 767px) {
  .grid-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .levels {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .answers {
    display: flex;
    flex-direction: column;
  }

  .ribbon__edge {
    display: none;
  }
}
</style>