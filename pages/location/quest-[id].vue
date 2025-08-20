<template>
  <div>
    <div class="quest__only">
      <button class="back-btn" @click="openLeave('back')">×</button>
      <div v-if="questStore.loading" class="loading">Загрузка квеста...</div>
      <div v-else-if="questStore.error" class="error">
        Ошибка: {{ questStore.error }}
        <div class="tiny">questId: {{ questId }} | region: {{ regionKey || '—' }}</div>
        <button class="btn" @click="openLeave('back')">Назад</button>
      </div>
      <div v-else-if="questStore.task" class="question-card">
        <div class="q-top">
          <div class="stats-bar">
            <div class="stat-widget">
              <div class="widget-value">{{ questStore.currentIndex + 1 }} / {{ questStore.requiredTasks }}</div>
            </div>
            <div class="stat-widget">
              <div class="widget-label">Верных:</div>
              <div class="widget-value">{{ questStore.correctCount }}</div>
            </div>
          </div>
          <div class="lives-bar">
            <div class="hearts-container">
              <span v-for="life in questStore.maxLives" :key="life" class="heart"
                    :class="{ lost: life > questStore.lives }">❤️</span>
            </div>
          </div>
        </div>
        <div class="quest__task__section">
          <div class="q-text bubble">
            <template v-if="questStore.task.type === 'input' && questStore.showResult">
              <span v-html="highlightedQuestion"></span>
            </template>
            <template v-else>
              {{ t(questStore.task.question) }}
            </template>
          </div>
          <div class="task-body">
            <template v-if="questStore.task.type === 'select' || questStore.task.type === 'readAndAnswer'">
              <div v-if="questStore.task.text" class="read-text">{{ t(questStore.task.text) }}</div>
              <ul class="options" :class="{ locked: questStore.showResult }">
                <li v-for="opt in questStore.task.options" :key="opt">
                  <button class="opt-btn" :class="optionClass(opt)" @click="questStore.choose(opt)">{{
                      t(opt)
                    }}
                  </button>
                </li>
              </ul>
            </template>
            <template v-else-if="questStore.task.type === 'input'">
              <input type="text" class="text-input" v-model="questStore.userInput" :disabled="questStore.showResult"
                     @keyup.enter="handleClick" placeholder="Введите ответ..."/>
            </template>
            <template v-else-if="questStore.task.type === 'speechToText'">
              <div class="speech-controls">
                <SoundBtn :text="questStore.task.text"/>
                <input type="text" class="text-input" v-model="questStore.userInput" :disabled="questStore.showResult"
                       @keyup.enter="handleClick" placeholder="Напишите услышанное..."/>
              </div>
            </template>
            <template v-else-if="questStore.task.type === 'reorder'">
              <div class="reorder-container">
                <div class="reorder-selection" :class="{ empty: questStore.reorderSelection.length === 0 }">
                  <button v-for="(word, index) in questStore.reorderSelection" :key="`${word}-${index}`"
                          class="word-btn" @click="questStore.handleReorderWord(word, 'selection')">{{ t(word) }}
                  </button>
                </div>
                <div class="word-bank">
                  <button v-for="(word, index) in questStore.reorderBank" :key="`${word}-${index}`" class="word-btn"
                          @click="questStore.handleReorderWord(word, 'bank')">{{ t(word) }}
                  </button>
                </div>
              </div>
            </template>
            <template v-else-if="questStore.task.type === 'textToSpeech'">
              <div class="tts-box">
                <p class="tts-text">"{{ t(questStore.task.text) }}"</p>
                <p class="tts-tip">ℹ️ Нажмите «Ответить», когда будете готовы. В реальном приложении здесь была бы
                  проверка произношения.</p>
              </div>
            </template>
          </div>
          <div v-if="questStore.showResult" class="feedback" :class="questStore.isCorrect ? 'ok' : 'bad'">
            <span class="icon">{{ questStore.isCorrect ? '✓' : '✗' }}</span>
            <span class="text">{{
                questStore.isCorrect ? 'Richtig' : `Richtig ist: ${questStore.correctAnswer}`
              }}</span>
          </div>
        </div>
        <div class="controls">
          <button class="btn" :disabled="!questStore.showResult && questStore.isConfirmDisabled" @click="handleClick">
            {{ questStore.showResult ? 'Далее' : 'Проверить' }}
          </button>
        </div>
      </div>
      <div v-else class="done-box">
        <div class="done-title">{{ questStore.success ? 'Квест выполнен! 🎉' : 'Квест провален' }}</div>
        <div class="done-sub">
          Правильных: {{ questStore.correctCount }} из {{ questStore.requiredTasks }} (мин. {{ questStore.minCorrect }})
        </div>
        <div v-if="isPerfect" class="bonus-pill">Идеально! +20💎 +20 XP</div>
        <div class="done-actions">
          <button
              v-if="!questStore.success && questStore.lives === 0"
              class="btn buy"
              :disabled="langStore.points < 10"
              @click="buyAttempt"
          >
            Купить попытку (10💎)
          </button>
          <button class="btn" @click="restart">Ещё раз</button>
          <button class="btn primary" @click="openLeave('home')">На главную</button>
        </div>
      </div>
    </div>
    <div v-if="showLeaveModal" class="modal__overlay">
      <div class="modal__card">
        <div class="modal__title">Вы не завершили квест</div>
        <div class="modal__text">Если вы покинете сейчас, прогресс не будет сохранён.</div>
        <div class="modal__actions">
          <button class="btn danger" @click="confirmLeave">Покинуть</button>
          <button class="btn primary" @click="stayHere">Продолжить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter, onBeforeRouteLeave} from 'vue-router'
import {userChainStore} from '../../store/chainStore.js'
import {userlangStore} from '../../store/learningStore.js'
import SoundBtn from '~/src/components/soundBtn.vue'

const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const rewardApplied = ref(false)
const isPerfect = computed(() =>
    questStore.requiredTasks > 0 &&
    questStore.correctCount === questStore.requiredTasks
)
const questId = computed(() => String(route.params.id || route.params.questId || ''))
const regionKey = computed(() => String(route.query.region || ''))

const questStore = userChainStore()
const langStore = userlangStore()

const showLeaveModal = ref(false)
const pendingRoute = ref(null)
let allowLeave = false
let leaveIntent = ref('back')

onMounted(() => {
  questStore.loadQuest(questId.value, regionKey.value)
})

function restart() {
  rewardApplied.value = false
  questStore.restart()
  questStore.loadQuest(questId.value, regionKey.value)
}

function optionClass(opt) {
  if (questStore.showResult) {
    if (opt === questStore.task?.answer) return 'correct pop'
    if (opt === questStore.selected) return 'wrong shake'
    return 'dim'
  }
  return questStore.selected === opt ? 'chosen' : ''
}

function handleClick() {
  if (!questStore.showResult) questStore.confirm()
  else questStore.nextTask()
}

function buyAttempt() {
  if (langStore.points < 10) return
  langStore.points -= 10
  if (typeof langStore.saveToFirebase === 'function') langStore.saveToFirebase()
  questStore.lives = 1
  questStore.finished = false
  questStore.showResult = false
  questStore.selected = ''
  questStore.userInput = ''
  if (questStore.task?.type === 'reorder' && Array.isArray(questStore.task.words)) {
    questStore.reorderSelection = []
    questStore.reorderBank = [...questStore.task.words]
  }
}

const hasDirtyInput = computed(() => {
  return !!(questStore.selected ||
      (questStore.userInput && questStore.userInput.trim()) ||
      (questStore.reorderSelection && questStore.reorderSelection.length > 0) ||
      questStore.currentIndex > 0)
})
const shouldBlockLeaving = computed(() =>
    (questStore.sessionStarted && !questStore.finished) || (!questStore.finished && hasDirtyInput.value)
)

function openLeave(type) {
  leaveIntent.value = type
  if (shouldBlockLeaving.value) {
    pendingRoute.value = type === 'home' ? {path: '/'} : (regionKey.value ? {path: `/location/${regionKey.value}`} : {path: '/location'})
    showLeaveModal.value = true
  } else {
    if (type === 'home') router.push('/')
    else router.push(regionKey.value ? `/location/${regionKey.value}` : '/location')
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (!allowLeave && shouldBlockLeaving.value) {
    pendingRoute.value = to
    showLeaveModal.value = true
    next(false)
  } else {
    next()
  }
})

function confirmLeave() {
  allowLeave = true
  showLeaveModal.value = false
  const to = pendingRoute.value
  if (to) router.push(to)
  else router.push(leaveIntent.value === 'home' ? '/' : (regionKey.value ? `/location/${regionKey.value}` : '/location'))
}

function stayHere() {
  pendingRoute.value = null
  showLeaveModal.value = false
}

const highlightedQuestion = computed(() => {
  if (!questStore.task) return ''
  if (questStore.task.type !== 'input') return t(questStore.task.question)
  const cls = questStore.isCorrect ? 'filled-answer-correct' : 'filled-answer-wrong'
  return questStore.task.question.replace('___', `<strong class="${cls}">${questStore.correctAnswer}</strong>`)
})

watch(() => questStore.finished,
    (fin) => {
      if (!fin) return
      if (isPerfect.value && !rewardApplied.value) {
        langStore.points += 20
        langStore.exp += 20
        rewardApplied.value = true
        if (typeof langStore.saveToFirebase === 'function') {
          langStore.saveToFirebase()
        }
      }
    }
)

</script>

<style scoped>
.quest__only {
  min-height: 100vh;
  font-family: "Nunito", sans-serif;
  color: #1e1e1e;
  display: flex;
  flex-direction: column;
  padding: 1.5rem
}

.quest__task__section {
  margin-top: 50px;
  min-height: 250px
}

.q-top {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 1rem;
  padding-top: .25rem;
  margin-bottom: .75rem
}

.back-btn {
  position: absolute;
  left: 1.5rem;
  top: 1.5rem;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  background: #fff;
  color: #1e1e1e;
  font-weight: 900;
  font-size: 22px;
  line-height: 1;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #1e1e1e;
  cursor: pointer;
  transition: all .1s ease-in-out
}

.back-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e
}

.back-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #1e1e1e
}

.stats-bar {
  display: flex;
  gap: 1rem;
  align-items: stretch
}

.stat-widget {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: .5rem 1rem;
  min-width: 120px;
  text-align: center;
  gap: 10px
}

.widget-label {
  font-family: "Nunito", sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--titleColor)
}

.widget-value {
  font-family: "Nunito", sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--titleColor)
}

.lives-bar {
  margin-left: auto;
  padding: .5rem 1rem;
  text-align: center
}

.hearts-container {
  display: flex;
  gap: .5rem;
  font-size: 1.6rem;
  line-height: 1;
  margin-top: 2px
}

.heart {
  transition: transform .2s ease, filter .2s ease, opacity .2s ease
}

.heart.lost {
  transform: scale(.85);
  filter: grayscale(1);
  opacity: .55
}

.question-card {
  width: min(980px, 100%);
  margin: 0 auto;
  padding: 2.6rem
}

.q-text.bubble {
  margin: 0 auto 1rem;
  text-align: center;
  font-size: 1.9rem;
  line-height: 1.25;
  padding: 1rem 1.25rem;
  color: var(--titleColor);
  font-weight: 600;
  font-family: "Nunito", sans-serif
}

.task-body {
  width: min(900px, 100%);
  margin: 0 auto 1rem;
  display: flex;
  flex-direction: column;
  gap: 14px
}

.read-text {
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 1rem;
  width: min(860px, 96%);
  margin: 0 auto;
  box-shadow: 4px 4px 0 #1e1e1e;
  font-size: 18px
}

.options {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: .25rem
}

.options.locked {
  pointer-events: none
}

.opt-btn {
  min-width: 88px;
  height: 60px;
  padding: 0 18px;
  font-family: "Nunito", sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #1e1e1e;
  background: #fff;
  border: 4px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 6px 6px 0 #1e1e1e;
  cursor: pointer;
  transition: all .1s ease-in-out
}

.opt-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 4px 4px 0 #1e1e1e
}

.opt-btn:active {
  transform: translate(6px, 6px);
  box-shadow: 0 0 0 #1e1e1e
}

.opt-btn.chosen {
  background: #cde8ff
}

.opt-btn.correct {
  background: #b9f5c4 !important
}

.opt-btn.wrong {
  background: #ffd0cc !important
}

.opt-btn.dim {
  opacity: .6
}

.text-input {
  width: min(860px, 96%);
  margin: 0 auto;
  display: block;
  padding: 14px 16px;
  font-size: 18px;
  background: #fff;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #1e1e1e
}

.text-input:focus {
  outline: none
}

.reorder-container {
  display: grid;
  gap: 14px;
  place-items: center
}

.reorder-selection {
  min-height: 84px;
  width: min(860px, 96%);
  padding: 10px;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #1e1e1e;
  display: flex;
  flex-wrap: wrap;
  gap: 8px
}

.word-bank {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px
}

.word-btn {
  padding: 12px 16px;
  font-size: 18px;
  background: #fff;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #1e1e1e;
  cursor: pointer;
  transition: all .1s ease-in-out
}

.word-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e
}

.word-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 #1e1e1e
}

.tts-box {
  width: min(860px, 96%);
  margin: 0 auto;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 4px 4px 0 #1e1e1e;
  padding: 16px
}

.tts-text {
  font-size: 22px;
  margin: 0 0 6px
}

.tts-tip {
  opacity: .85
}

.feedback {
  width: min(560px, 96%);
  margin: 10px auto;
  text-align: center;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  padding: .75rem 1rem
}

.feedback.ok {
  color: #3fa65b;
  font-size: 2rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600
}

.feedback.bad {
  color: #d9534f;
  font-size: 2rem;
  font-family: "Nunito", sans-serif;
  font-weight: 600
}

.icon {
  margin-right: 8px
}

.controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: .25rem
}

.btn {
  height: 56px;
  padding: 0 36px;
  border-radius: 16px;
  font-family: "Nunito", sans-serif;
  font-weight: 900;
  font-size: 22px;
  border: 3px solid #1e1e1e;
  color: #1e1e1e;
  background: #9ad0ff;
  cursor: pointer;
  box-shadow: 4px 4px 0 #1e1e1e;
  transition: all .1s ease-in-out
}

.btn:hover:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0 #1e1e1e
}

.btn:active:not(:disabled) {
  transform: translate(6px, 6px);
  box-shadow: 0 0 0 #1e1e1e
}

.btn:disabled {
  opacity: .6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 4px 4px 0 #1e1e1e
}

.btn.primary {
  background: #a7ecb8
}

.btn.secondary {
  background: #d6d6d6
}

.loading, .error {
  width: min(640px, 96%);
  margin: 24px auto 0;
  text-align: center;
  padding: 18px 20px;
  border-radius: 16px;
  border: 3px solid #1e1e1e;
  background: #fff;
  box-shadow: 8px 8px 0 #1e1e1e
}

.error {
  background: #ffd5d2
}

.done-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap
}

.btn.buy {
  background: linear-gradient(180deg, #ffd166 0%, #f4a623 100%);
  color: #1e1e1e
}

.btn.buy:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed
}

@keyframes shake-kf {
  0%, 100% {
    transform: translateX(0)
  }
  25% {
    transform: translateX(-12px)
  }
  75% {
    transform: translateX(12px)
  }
}

.bonus-pill{
  display:inline-block;
  margin: 10px auto 6px;
  padding: 8px 14px;
  border: 3px solid #1e1e1e;
  border-radius: 999px;
  background: linear-gradient(180deg,#ffe066 0%,#fca13a 100%);
  box-shadow: 4px 4px 0 #1e1e1e;
  font-weight: 900;
}

.shake {
  animation: shake-kf .45s ease
}

@media (max-width: 1023px) {
  .back-btn {
    left: 1rem;
    top: 1rem
  }

  .q-top {
    flex-direction: column;
    align-items: center;
    gap: .75rem;
    padding-top: 2.5rem
  }

  .lives-bar {
    margin-left: 0
  }
}

@media (max-width: 740px) {
  .q-text.bubble {
    font-size: 1.4rem
  }

  .opt-btn {
    height: 56px;
    font-size: 18px
  }

  .btn {
    height: 52px;
    padding: 0 28px;
    font-size: 20px
  }
}

/* modal */
.modal__overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, .35);
  display: grid;
  place-items: center
}

.modal__card {
  width: min(540px, 92%);
  background: #fff;
  border: 3px solid #111;
  border-radius: 18px;
  box-shadow: 12px 12px 0 #1e1e1e;
  padding: 22px;
  text-align: center
}

.modal__title {
  font-weight: 900;
  font-size: 22px;
  margin-bottom: 8px;
  color: #111
}

.modal__text {
  color: #333;
  margin-bottom: 16px
}

.modal__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap
}

.btn.danger {
  background: #ffd0cc
}
</style>
