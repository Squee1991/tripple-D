<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useLocalePath} from '#i18n'
import {useEventSessionStore} from '../../../store/eventsStore.js'
import SoundBtn from '~/src/components/soundBtn.vue'

const svgFiles = import.meta.glob('@/assets/images/event-rewards/winter-event/winter-words/*.{svg,SVG}', {
      eager: true,
      query: '?url',
      import: 'default'
    }
);

const imgUrl = (path) => {
  if (!path) return '';
  const name = path.split('/').pop();
  for (const key in svgFiles) {
    if (key.endsWith(name)) return svgFiles[key];
  }
  return '';
};

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const s = useEventSessionStore()

const matchState = ref({leftPick: null, rightPick: null, chosenPairs: []})
const wrongPairIdxSet = ref(new Set())

const eventId = computed(() => String(route.params.id || ''))
const eventData = ref({quests: []})
const loading = ref(true)
const finished = ref(false)

const currentQuest = computed(() => s.questId ? (eventData.value.quests.find(q => q.id === s.questId) || null) : null)
const totalSteps = computed(() => currentQuest.value?.steps?.length || 0)
const step = computed(() => currentQuest.value?.steps?.[s.stepIndex] || null)

async function loadEventJson() {
  loading.value = true
  try {
    const json = await $fetch(`/events/event-${eventId.value}.json`)
    eventData.value = (json && Array.isArray(json.quests)) ? json : {quests: []}
  } catch {
    eventData.value = {quests: []}
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!s.eventId || s.eventId !== eventId.value) {
    const ok = s.restoreIfPossible(eventId.value)
    if (!ok) return router.replace({name: 'event-id', params: {id: eventId.value}})
  }
  await loadEventJson()
  if (!currentQuest.value) router.replace({name: 'event-id', params: {id: eventId.value}})
})

const selectedIndex = ref(null)
const userFill = ref('')
const wasWrong = ref(false)

watch(step, () => {
  selectedIndex.value = null
  userFill.value = ''
  wasWrong.value = false
  matchState.value = {leftPick: null, rightPick: null, chosenPairs: []}
  wrongPairIdxSet.value = new Set()
})

function nextStep() {
  if (s.stepIndex + 1 < totalSteps.value) s.next(totalSteps.value)
  else {
    s.finishQuest(totalSteps.value);
    finished.value = true
  }
}

function selectMCQ(i) {
  selectedIndex.value = i
  wasWrong.value = i !== step.value.correctOptionIndex
}

function confirmMCQ() {
  if (selectedIndex.value === step.value.correctOptionIndex) {
    s.addScore(1);
    nextStep()
  } else wasWrong.value = true
}

const filledSentence = computed(() => {
  if (step.value?.type !== 'choose-word') return ''
  const src = step.value.sentence || ''
  if (selectedIndex.value == null) return src.replace('___', '<b>___</b>')
  const word = step.value.options[selectedIndex.value]
  return src.replace('___', `<b>${word}</b>`)
})

function selectChoose(i) {
  selectedIndex.value = i
  wasWrong.value = i !== step.value.correctOptionIndex
}

function confirmChoose() {
  if (selectedIndex.value === step.value.correctOptionIndex) {
    s.addScore(1);
    nextStep()
  } else wasWrong.value = true
}

function answerFill() {
  const a = (step.value.answerText || '').trim().toLowerCase()
  const u = (userFill.value || '').trim().toLowerCase()
  if (a === '__ANY_NON_EMPTY__') {
    if (u.length) nextStep(); else wasWrong.value = true;
    return
  }
  if (u === a) nextStep(); else wasWrong.value = true
}

function checkReadingAnswers() {
  if (!step.value.questions) return nextStep()
  let ok = true
  for (const q of step.value.questions) if (q.userAnswer !== q.correctOptionIndex) ok = false
  if (ok) {
    s.addScore(step.value.questions.length);
    nextStep()
  } else wasWrong.value = true
}

const usedLeftIds = computed(() => new Set(matchState.value.chosenPairs.map(([l]) => l)))
const usedRightIds = computed(() => new Set(matchState.value.chosenPairs.map(([, r]) => r)))
const availableLeft = computed(() => (step.value?.pairsLeft || []).filter(l => !usedLeftIds.value.has(l.id)))
const availableRight = computed(() => (step.value?.pairsRight || []).filter(r => !usedRightIds.value.has(r.id)))

function pickLeft(id) {
  matchState.value.leftPick = id;
  if (matchState.value.rightPick) commitPair()
}

function pickRight(id) {
  matchState.value.rightPick = id;
  if (matchState.value.leftPick) commitPair()
}

function commitPair() {
  const {leftPick, rightPick} = matchState.value;
  if (!leftPick || !rightPick) return;
  matchState.value.chosenPairs.push([leftPick, rightPick]);
  matchState.value.leftPick = null;
  matchState.value.rightPick = null
}

function undoPair(idx) {
  matchState.value.chosenPairs.splice(idx, 1);
  wrongPairIdxSet.value.delete(idx);
  wasWrong.value = false
}

function checkMatching() {
  wrongPairIdxSet.value = new Set()
  const correctSet = new Set((step.value.correctPairs || []).map(([l, r]) => `${l}|${r}`))
  matchState.value.chosenPairs.forEach(([l, r], i) => {
    if (!correctSet.has(`${l}|${r}`)) wrongPairIdxSet.value.add(i)
  })
  const allChosen = matchState.value.chosenPairs.length === (step.value.correctPairs || []).length
  const noWrong = wrongPairIdxSet.value.size === 0
  if (allChosen && noWrong) {
    s.addScore((step.value.correctPairs || []).length);
    nextStep()
  } else {
    wasWrong.value = true
  }
}

function goBack() {
  router.push(localePath({name: 'event-id', params: {id: eventId.value}}))
}
</script>

<template>
  <div class="lesson">
    <div class="lesson__container">
      <header class="topbar">
        <button class="topbar__back" @click="goBack">🏠</button>
        <div class="topbar__score" v-if="!finished">Очки: {{ s.score }}</div>
      </header>

      <div v-if="loading" class="lesson__state">
        <div class="loader"></div>
        <div>Загрузка…</div>
      </div>
      <div v-else-if="finished" class="result card">
        <div class="result__icon">🏁</div>
        <h2 class="result__title">Квест завершён!</h2>
        <p class="result__text">Правильных: <b>{{ s.score }}</b> из <b>{{ totalSteps }}</b></p>
        <button class="btn btn--primary" @click="goBack">Вернуться к ивенту</button>
      </div>
      <div v-else-if="!currentQuest" class="lesson__state">
        Квест не найден
        <button class="btn btn--ghost" @click="goBack">Назад</button>
      </div>
      <div v-else class="lesson__card">
        <div class="progress">
          <div class="progress__text">Вопрос {{ s.stepIndex + 1 }} / {{ totalSteps }}</div>
          <div class="progress__bar">
            <div class="progress__fill"
                 :style="{ width: (totalSteps ? (s.stepIndex / totalSteps * 100) : 0) + '%' }"></div>
          </div>
        </div>
        <section v-if="step.type === 'reading'" class="section card">
          <div class="paper">
            <SoundBtn :text="step.text"/>
            <h3 class="section__title">Прослушайте текст и ответьте на вопросы</h3>
          </div>
          <div v-if="step.questions && step.questions.length" class="reading">
            <div v-for="(q, idx) in step.questions" :key="idx" class="reading__item">
              <p class="question">{{ idx + 1 }}. {{ q.question }}</p>
              <div class="choices">
                <button
                    v-for="(opt, i) in q.options"
                    :key="i"
                    class="option"
                    :class="{ correct: q.userAnswer === i && i === q.correctOptionIndex, wrong: q.userAnswer === i && i !== q.correctOptionIndex }"
                    @click="q.userAnswer = i"
                ><span class="option__text">{{ opt }}</span></button>
              </div>
            </div>
            <div class="actions">
              <button class="btn btn--primary" @click="checkReadingAnswers">Проверить</button>
            </div>
            <div v-if="wasWrong" class="hint hint--error">Есть ошибки, попробуй ещё раз!</div>
          </div>
          <div v-else class="actions">
            <button class="btn btn--primary" @click="nextStep">Далее</button>
          </div>
        </section>
        <section v-else-if="step.type === 'mcq' || step.type === 'multiple-choice'" class="section card">
          <p v-if="step.question" class="question">{{ step.question }}</p>
          <img class="question-image" v-if="step.image" :src="imgUrl(step.image)" alt="">
          <div class="choices">
            <button
                v-for="(opt, i) in step.options"
                :key="i"
                class="option"
                :class="{
                chosen: selectedIndex === i && !wasWrong,
                wrong: wasWrong && selectedIndex === i && i !== step.correctOptionIndex,
                correct: selectedIndex === i && i === step.correctOptionIndex && !wasWrong
              }"
                @click="selectMCQ(i)"
            ><span class="option__text">{{ opt }}</span></button>
          </div>
          <div class="actions">
            <button class="btn btn--primary" @click="confirmMCQ" :disabled="selectedIndex === null">Далее</button>
          </div>
          <div v-if="wasWrong" class="hint hint--error">Неверно, попробуй ещё раз</div>
        </section>
        <section v-else-if="step.type === 'choose-word'" class="section card">
          <p class="question" v-html="filledSentence"></p>
          <div class="choices">
            <button
                v-for="(opt, i) in step.options"
                :key="i"
                class="option"
                :class="{
                chosen: selectedIndex === i && !wasWrong,
                wrong: wasWrong && selectedIndex === i && i !== step.correctOptionIndex,
                correct: selectedIndex === i && i === step.correctOptionIndex && !wasWrong
              }"
                @click="selectChoose(i)"
            ><span class="option__text">{{ opt }}</span></button>
          </div>
          <div class="actions">
            <button class="btn btn--primary" @click="confirmChoose" :disabled="selectedIndex === null">Далее</button>
          </div>
          <div v-if="wasWrong" class="hint hint--error">Неверно, попробуй ещё раз</div>
        </section>
        <section v-else-if="step.type === 'fill'" class="section card">
          <h3 class="section__title">Впиши ответ</h3>
          <p class="question">{{ step.prompt }}</p>
          <div class="field">
            <input v-model="userFill" class="field__input" placeholder="Ваш ответ" @keyup.enter="answerFill"/>
            <button class="btn" @click="answerFill">Проверить</button>
          </div>
          <div v-if="wasWrong" class="hint hint--error">Не то. Ещё раз!</div>
        </section>
        <section v-else-if="step.type === 'matching'" class="section card">
          <h3 class="section__title">{{ step.instruction || 'Соедини пары' }}</h3>
          <div class="match">
            <div class="match__cols">
              <div class="match__col">
                <button v-for="l in availableLeft" :key="l.id" class="option"
                        :class="{ chosen: matchState.leftPick === l.id }" @click="pickLeft(l.id)">{{ l.text }}
                </button>
              </div>
              <div class="match__col">
                <button v-for="r in availableRight" :key="r.id" class="option"
                        :class="{ chosen: matchState.rightPick === r.id }" @click="pickRight(r.id)">{{ r.text }}
                </button>
              </div>
            </div>
            <div class="pairs">
              <div
                  v-for="(p, idx) in matchState.chosenPairs"
                  :key="idx"
                  class="pair-chip"
                  :class="{ wrong: wrongPairIdxSet.has(idx), correct: wasWrong && !wrongPairIdxSet.has(idx) }"
                  @click="undoPair(idx)"
              >
                {{ (step.pairsLeft.find(x => x.id === p[0])?.text) || p[0] }} —
                {{ (step.pairsRight.find(x => x.id === p[1])?.text) || p[1] }} ✕
              </div>
            </div>
            <div class="actions">
              <button class="btn btn--primary" @click="checkMatching">Проверить ответы</button>
            </div>
            <div v-if="wasWrong" class="hint hint--error">Есть ошибки, поправь выделенные пары и попробуй ещё раз!</div>
          </div>
        </section>

        <section v-else class="section card">
          Неизвестный тип: <code>{{ step.type }}</code>
          <button class="btn btn--ghost" @click="nextStep">Пропустить</button>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none
}

.paper {
  display: flex;
  align-items: center;
  gap: 10px
}

.section__title {
  font-weight: 900;
  font-size: 22px;
  color: #0f1a33
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
  justify-content: center;
  margin: 20px 0;
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
  font-size: 16px;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12);
  border: none;
  cursor: pointer;
  transition: transform .08s, box-shadow .08s, background .2s, filter .2s;
  position: relative
}

.option:hover {
  transform: translateY(-1px) rotate(-.3deg)
}

.option:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(26, 41, 66, .18)
}

.option.chosen {
  background: #eef5ff;
  box-shadow: 0 8px 20px rgba(92, 130, 255, .18)
}

.option.correct {
  background: #e9f8ee;
  color: #0f6a36;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12), 0 0 0 2px #a2dfb6 inset
}

.option.wrong {
  background: #fdecec;
  color: #9b1c1c;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12), 0 0 0 2px #f3b5b5 inset
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

.btn {
  border: none;
  border-radius: 14px;
  padding: 10px 16px;
  font-weight: 900;
  cursor: pointer;
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

.result {
  text-align: center;
  gap: 10px
}

.result__icon {
  font-size: 40px
}

.result__title {
  font-size: 22px;
  font-weight: 900
}

.result__text {
  font-weight: 800
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
  border-radius: 14px;
  padding: 8px 12px;
  font-weight: 900;
  background: #fff;
  color: #1f2a44;
  box-shadow: 0 8px 20px rgba(26, 41, 66, .12);
  cursor: pointer;
  transition: transform .08s, box-shadow .08s, background .2s
}

.pair-chip:hover {
  transform: translateY(-1px) rotate(.2deg)
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

@media  (max-width: 540px) {
  .choices {
    width: 100%;
  }
  .option {
    width: 900px;
    max-width: 330px;
  }
}
</style>
