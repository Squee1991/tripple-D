<template>
  <div>
    <div class="quest__only">
      <!-- Загрузка -->
      <div v-if="loading" class="loading">Загрузка квеста...</div>

      <!-- Ошибка -->
      <div v-else-if="error" class="error">
        Ошибка: {{ error }}
        <div class="tiny">questId: {{ questId }} | region: {{ regionKey || '—' }}</div>
        <button class="btn" @click="goBack">Назад</button>
      </div>

      <!-- Вопрос -->
      <div v-else-if="task" class="question-card">
        <div class="q-top">
          <button class="back-btn" @click="goBack">x</button>
          <div class="quest__count">{{ currentIndex + 1 }} / {{ requiredTasks }}</div>
          <div class="q-stats">
            <div class="q__correct-count">Верных ответов: {{ correctCount }}</div>
          </div>
        </div>

        <div class="q-text bubble">
          <template v-if="task.type === 'input' && showResult">
            <span v-html="highlightedQuestion"></span>
          </template>
          <template v-else>
            {{ t(task.question) }}
          </template>
        </div>

        <div class="task-body">
          <template v-if="task.type === 'select' || task.type === 'readAndAnswer'">
            <div v-if="task.text" class="read-text">{{ t(task.text) }}</div>
            <ul class="options" :class="{ locked: showResult }">
              <li v-for="opt in task.options" :key="opt">
                <button class="opt-btn" :class="optionClass(opt)" @click="choose(opt)">
                  {{ t(opt) }}
                </button>
              </li>
            </ul>
          </template>
          <template v-else-if="task.type === 'input'">
            <input
                type="text"
                class="text-input"
                v-model="userInput"
                :disabled="showResult"
                @keyup.enter="handleClick"
                placeholder="Введите ответ..."
            />
          </template>
          <template v-else-if="task.type === 'speechToText'">
            <div class="speech-controls">
              <SoundBtn :text="task.text" />
              <input
                  type="text"
                  class="text-input"
                  v-model="userInput"
                  :disabled="showResult"
                  @keyup.enter="handleClick"
                  placeholder="Напишите услышанное..."
              />
            </div>
          </template>

          <template v-else-if="task.type === 'reorder'">
            <div class="reorder-container">
              <div class="reorder-selection" :class="{ empty: reorderSelection.length === 0 }">
                <button
                    v-for="(word, index) in reorderSelection"
                    :key="`${word}-${index}`"
                    class="word-btn"
                    @click="handleReorderWord(word, 'selection')"
                >
                  {{ t(word) }}
                </button>
              </div>
              <div class="word-bank">
                <button
                    v-for="(word, index) in reorderBank"
                    :key="`${word}-${index}`"
                    class="word-btn"
                    @click="handleReorderWord(word, 'bank')"
                >
                  {{ t(word) }}
                </button>
              </div>
            </div>
          </template>

          <template v-else-if="task.type === 'textToSpeech'">
            <div class="tts-box">
              <p class="tts-text">"{{ t(task.text) }}"</p>
              <p class="tts-tip">
                ℹ️ Нажмите «Ответить», когда будете готовы. В реальном приложении здесь была бы проверка произношения.
              </p>
            </div>
          </template>
        </div>
        <div v-if="showResult" class="feedback" :class="isCorrect ? 'ok' : 'bad'">
          <span class="icon">{{ isCorrect ? '✓' : '✗' }}</span>
          <span class="text">
            {{ isCorrect ? 'Richtig!' : `Richtig ist: ${correctAnswer}` }}
          </span>
        </div>

        <!-- Управление -->
        <div class="controls">
          <button class="btn" :disabled="!showResult && isConfirmDisabled" @click="handleClick">
            {{ showResult ? 'Далее' : 'Проверить' }}
          </button>
        </div>
      </div>

      <!-- Конец квеста -->
      <div v-else class="done-box">
        <div class="done-title">{{ success ? 'Квест выполнен! 🎉' : 'Квест провален' }}</div>
        <div class="done-sub">
          Правильных: {{ correctCount }} из {{ requiredTasks }} (мин. {{ minCorrect }})
        </div>
        <div class="done-actions">
          <button class="btn" @click="restart">Ещё раз</button>
          <button class="btn primary" @click="goBack">Вернуться</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userChainStore } from '../../store/chainStore.js'
import { storeToRefs } from 'pinia'
import SoundBtn from '~/src/components/soundBtn.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const questId = computed(() => String(route.params.id || route.params.questId || ''))
const regionKey = computed(() => String(route.query.region || ''))

const questStore = userChainStore()
const {
  loading, error, task, currentIndex, correctCount, finished,
  showResult, isCorrect, selected, userInput, reorderSelection, reorderBank,
  requiredTasks, minCorrect, success, correctAnswer, isConfirmDisabled
} = storeToRefs(questStore)

const { loadQuest, confirm, choose, handleReorderWord, restart: restartAction, nextTask } = questStore

onMounted(() => {
  loadQuest(questId.value, regionKey.value)
})

function restart() {
  restartAction()
  loadQuest(questId.value, regionKey.value)
}

function goBack() {
  if (regionKey.value) router.push(`/location/${regionKey.value}`)
  else router.push('/location')
}

function optionClass(opt) {
  if (showResult.value) {
    if (opt === task.value.answer) return 'correct pop'
    if (opt === selected.value) return 'wrong shake'
    return 'dim'
  }
  return selected.value === opt ? 'chosen' : ''
}

function handleClick() {
  if (!showResult.value) {
    confirm()
  } else {
    nextTask()
  }
}

const highlightedQuestion = computed(() => {
  if (!task.value) return ''
  if (task.value.type !== 'input') return t(task.value.question)
  const styleClass = isCorrect.value ? 'filled-answer-correct' : 'filled-answer-wrong'
  return task.value.question.replace('___', `<strong class="${styleClass}">${correctAnswer.value}</strong>`)
})
</script>



<style scoped>

.quest__only {
  min-height: 100vh;
  background: #efe9d1;
  font-family: "Nunito", sans-serif;
  color: #121212;
  display: flex;
  flex-direction: column;
  padding-bottom: 48px;
}

.q-top {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
}

.q-stats {
  display: flex;
  text-align: right;
  font-size: 22px;
  line-height: 1.1;
}

.q__correct-count {
  font-weight: 600;
  font-size: 1.4rem;
  font-family: "Nunito", sans-serif;
}

.back-btn {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  appearance: none;
  background: #f6e27a;
  border: 3px solid #121212;
  border-radius: 12px;
  padding: 10px;
  font-weight: 700;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 4px 4px 0 #121212;
  transition: transform .08s ease, box-shadow .08s ease;
}

.back-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #121212;
}

.back-btn:active {
  transform: translate(6px, 6px);
  box-shadow: 0 0 0 #121212;
}

.q-text.bubble {
  margin: 24px auto 28px;
  text-align: center;
  font-size: 34px;
  padding: 18px 22px;
  width: 100%;
}

.task-body {
  margin-bottom: 28px;
}

.read-text {
  background-color: #fff;
  border: 3px solid #121212;
  padding: 16px;
  border-radius: 12px;
  margin: 0 auto 18px;
  font-size: 18px;
  width: min(780px, 92%);
  box-shadow: 6px 6px 0 #121212;
}

.options {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin: 0 0 10px;
  flex-wrap: wrap;
}

.options.locked {
  pointer-events: none;
}

.opt-btn {
  min-width: 70px;
  height: 60px;
  padding: 0 14px;
  font-size: 22px;
  font-weight: 700;
  color: #121212;
  background: #fff;
  border: 4px solid #121212;
  border-radius: 14px;
  box-shadow: 6px 6px 0 #121212;
  cursor: pointer;
  transition: transform .08s ease, box-shadow .08s ease;
  border: 3px solid #000;
  border-radius: 12px;
  box-shadow: 4px 4px #000;
  transition: all .1s ease-in-out;
}

.quest__count {
  font-size: 1.4rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
}

.opt-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #121212;
}

.opt-btn:active {
  transform: translate(6px, 6px);
  box-shadow: 0 0 0 #121212;
}

.opt-btn.chosen {
  background: #cde8ff;
}

.opt-btn.correct {
  background: #b9f5c4 !important;
}

.opt-btn.wrong {
  background: #ffd0cc !important;
}

.opt-btn.dim {
  opacity: .6;
}

.text-input {
  width: 700px;
  margin:  0 auto;
  display: block;
  padding: 12px 16px;
  border-radius: 12px;
  border: 3px solid black;
  background-color: #fff;
  color: #121212;
  font-size: 18px;
  box-shadow: 4px 4px 0 black;
}

.word-btn {
  padding: 12px 16px;
  border-radius: 12px;
  border: 3px solid black;
  background-color: #fff;
  color: #121212;
  font-size: 18px;
  box-shadow: 4px 4px 0 black;
}

.text-input:focus {
  outline: none;
}

.reorder-container {
  display: grid;
  gap: 14px;
  place-items: center;
}

.reorder-selection {
  min-height: 81px;
  background: #fffbe9;
  border: 3px solid #121212;
  border-radius: 12px;
  padding: 10px;
  box-shadow: 6px 6px 0 #121212;
  width: min(780px, 92%);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.word-bank {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.word-btn {
  display: inline-block;
  width: auto;
  cursor: pointer;
  transition: transform .08s ease, box-shadow .08s ease;
}

.word-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #121212;
}

.word-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #121212;
}

.tts-box {
  width: min(780px, 92%);
  margin: 0 auto;
  background: #fff;
  border: 3px solid #121212;
  border-radius: 12px;
  box-shadow: 6px 6px 0 #121212;
  padding: 16px;
}

.tts-text {
  font-size: 22px;
  margin: 0 0 6px;
}

.tts-tip {
  opacity: .8;
}

.feedback {
  width: min(520px, 92%);
  margin: 10px auto 22px;
  font-weight: 800;
  text-align: center;

}

.feedback.ok {
  font-size: 1.5rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  color: #3fa65b;
}

.feedback.bad {
  font-size: 1.5rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  color: #d9534f;
}

.icon {
  margin-right: 8px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 4px;
}

.btn {
  height: 56px;
  padding: 0 36px;
  border-radius: 16px;
  font-weight: 900;
  font-size: 22px;
  border: 3px solid #121212;
  color: #121212;
  background: #aeb4bd;
  cursor: pointer;
  box-shadow: 4px 4px 0 #121212;
  transition: transform .08s ease, box-shadow .08s ease, filter .08s ease;
}

.btn:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #121212;
}

.btn:active:not(:disabled) {
  transform: translate(8px, 8px);
  box-shadow: 0 0 0 #121212;
}

.btn:disabled {
  opacity: .6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 4px 4px 0 #121212;
}

.btn:not(.secondary):not(:disabled) {
  background: #9ad0ff;
}

.btn.primary {
  background: #a7ecb8;
}

.btn.secondary {
  background: #d6d6d6;
}

.done-box {
  text-align: center;
}

.done-title {
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 10px;
  color: #3fa65b;
}

.done-sub {
  color: #333;
  margin-bottom: 24px;
}

.done-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.loading, .error {
  width: min(620px, 92%);
  margin: 24px auto 0;
  text-align: center;
  padding: 18px 20px;
  border-radius: 14px;
  border: 3px solid #121212;
  background: #fff;
  box-shadow: 8px 8px 0 #121212;
}

.error {
  background: #ffd5d2;
}

@keyframes pop-kf {
  0% {
    transform: scale(.96)
  }
  60% {
    transform: scale(1.04)
  }
  100% {
    transform: scale(1)
  }
}

@keyframes shake-kf {
  0%, 100% {
    transform: translateX(0)
  }
  20% {
    transform: translateX(-4px)
  }
  40% {
    transform: translateX(4px)
  }
  60% {
    transform: translateX(-3px)
  }
  80% {
    transform: translateX(3px)
  }
}

.pop {
  animation: pop-kf .25s ease-out;
}

.shake {
  animation: shake-kf .25s ease-out;
}
</style>