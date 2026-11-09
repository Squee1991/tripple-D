<template>
  <!-- первый экран после регистрации: шторка с ёжиком и предложением проверить уровень -->
  <VWelcomeSheet
      v-if="modelValue && step === 'intro'"
      :count="TEST.length"
      @test="startTest"
      @choose="step = 'list'"
      @skip="skip"
  />
  <Teleport to="body">
    <transition name="level-picker-fade">
      <div v-if="modelValue && step !== 'intro'" class="level-picker" @click.self="onBackdrop">
        <div class="level-picker__card" role="dialog" aria-modal="true" :aria-label="t('levelPicker.title')">
          <!-- короткий тест: вопросы по-немецки и не переводятся -->
          <template v-if="step === 'test'">
            <div class="level-test__head">
              <span class="level-test__chip" :class="'level-test__chip--' + testLevel.toLowerCase()">{{ testLevel }}</span>
              <h2 class="level-picker__title">{{ t('levelPicker.testTitle') }}</h2>
              <span class="level-test__count">{{ testIndex + 1 }}/{{ TEST.length }}</span>
            </div>
            <div class="level-test__bar" dir="ltr" aria-hidden="true">
              <span
                  v-for="(_, i) in TEST"
                  :key="i"
                  class="level-test__step"
                  :class="{
                    'level-test__step--ok': testAnswers[i] === true,
                    'level-test__step--bad': testAnswers[i] === false,
                    'level-test__step--now': i === testIndex && testAnswers[i] === undefined
                  }"
              ></span>
            </div>
            <div :key="testIndex" class="level-test__question">
              <p class="level-picker__subtitle">{{ t('levelPicker.testHint') }}</p>
              <p class="level-test__text" lang="de" dir="ltr">
                {{ testParts[0] }}<span class="level-test__gap" :class="{ 'level-test__gap--filled': testLocked }">{{ testLocked ? testQuestion.answer : '' }}</span>{{ testParts[1] }}
              </p>
              <div class="level-picker__list">
                <button
                    v-for="option in testQuestion.options"
                    :key="option"
                    type="button"
                    class="level-test__option"
                    :class="optionClass(option)"
                    lang="de"
                    dir="ltr"
                    :disabled="testLocked"
                    @click="answerTest(option)"
                >
                  {{ option }}
                </button>
              </div>
              <button type="button" class="level-picker__skip" :disabled="testLocked" @click="answerTest(null)">
                {{ t('levelPicker.dontKnow') }}
              </button>
              <button type="button" class="level-picker__skip level-picker__skip--back" @click="backToChoice">
                {{ t('levelPicker.backToChoice') }}
              </button>
            </div>
          </template>

          <template v-else-if="step === 'result'">
            <div class="level-result" :class="'level-result--' + testResult.toLowerCase()">
              <div class="level-result__ring">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="52" class="level-result__track"/>
                  <circle
                      cx="60" cy="60" r="52"
                      class="level-result__fill"
                      :stroke-dasharray="RESULT_RING"
                      :style="{ '--ring-offset': RESULT_RING * (1 - testCorrect / testAnswers.length) }"
                  />
                </svg>
                <span class="level-result__score">{{ testCorrect }}<small>/{{ testAnswers.length }}</small></span>
              </div>
              <p class="level-result__text">{{ t('levelPicker.testScore', { correct: testCorrect, total: testAnswers.length }) }}</p>
              <p class="level-picker__subtitle">{{ t('levelPicker.resultTitle') }}</p>
              <p class="level-result__name">
                <span class="level-result__level">{{ testResult }}</span>
                {{ t(`levelPicker.${testResult.toLowerCase()}Name`) }}
              </p>
            </div>
            <button type="button" class="level-picker__btn" @click="confirm">
              {{ mode === 'settings' ? t('levelPicker.save') : t('levelPicker.continue') }}
            </button>
            <button type="button" class="level-picker__skip" @click="step = 'list'">
              {{ t('levelPicker.changeLevel') }}
            </button>
          </template>

          <template v-else>
          <h2 class="level-picker__title">{{ t('levelPicker.title') }}</h2>
          <p class="level-picker__subtitle">{{ t('levelPicker.subtitle') }}</p>

          <div class="level-picker__list" role="radiogroup">
            <button
                v-for="level in levels"
                :key="level.id"
                type="button"
                role="radio"
                :aria-checked="selected === level.id"
                class="level-option"
                :class="{ 'level-option--active': selected === level.id }"
                :data-track="'level_picker_option_' + level.id"
                @click="selected = level.id"
            >
              <span class="level-option__badge">{{ level.id }}</span>
              <span class="level-option__body">
                <span class="level-option__name">{{ t(`levelPicker.${level.key}Name`) }}</span>
                <span class="level-option__phrase" lang="de" dir="ltr">{{ level.phrase }}</span>
              </span>
              <span class="level-option__radio" aria-hidden="true"></span>
            </button>
          </div>

          <button
              type="button"
              class="level-picker__btn"
              :disabled="!selected"
              @click="confirm"
          >
            {{ mode === 'settings' ? t('levelPicker.save') : t('levelPicker.continue') }}
          </button>
          <button type="button" class="level-picker__skip" @click="startTest">
            {{ t('levelPicker.notSure') }}
          </button>
          <button
              v-if="mode === 'onboarding'"
              type="button"
              class="level-picker__skip"
              @click="skip"
          >
            {{ t('levelPicker.skip') }}
          </button>
          </template>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, defineAsyncComponent, onBeforeUnmount, ref, watch } from 'vue'
import { userAuthStore } from '~/store/authStore.js'

// шторка тянет анимацию ёжика: грузим её только когда она нужна, главная не тяжелеет
const VWelcomeSheet = defineAsyncComponent(() => import('~/src/components/V-welcomeSheet.vue'))

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  // onboarding: первый вход, закрыть можно только выбором или «пропустить» (= A1)
  // settings: смена уровня из настроек, закрывается тапом по фону
  mode: { type: String, default: 'onboarding' }
})
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const authStore = userAuthStore()

// Фразы не переводятся: человек узнаёт свой уровень по тому, понимает ли он немецкий пример
const levels = [
  { id: 'A1', key: 'a1', phrase: 'Ich heiße Anna und wohne in Berlin.' },
  { id: 'A2', key: 'a2', phrase: 'Ich habe gestern Pizza gegessen, weil ich keine Zeit hatte.' },
  { id: 'B1', key: 'b1', phrase: 'Obwohl ich müde war, bin ich noch ins Kino gegangen.' }
]

const selected = ref(null)

// Три блока по 4 вопроса: основы, A2, B1. Человек всегда проходит все вопросы,
// уровень считается в конце: блок пройден при 3 верных из 4, решают блоки A2 и B1
const TEST_BLOCK = 4
const TEST_PASS = 3
const ANSWER_PAUSE = 750
const RESULT_RING = 2 * Math.PI * 52
const TEST_LEVELS = ['A1', 'A2', 'B1']
const TEST = [
  { text: 'Ich ___ aus Polen.', options: ['kommst', 'komme', 'kommen'], answer: 'komme' },
  { text: 'Das ist ___ Mutter.', options: ['mein', 'meinen', 'meine'], answer: 'meine' },
  { text: 'Wie ___ du?', options: ['heißt', 'heiße', 'heißen'], answer: 'heißt' },
  { text: 'Ich kaufe ___ Apfel.', options: ['ein', 'eine', 'einen'], answer: 'einen' },
  { text: 'Gestern ___ ich ins Kino gegangen.', options: ['habe', 'bin', 'hat'], answer: 'bin' },
  { text: 'Ich helfe ___ Freund.', options: ['meinen', 'mein', 'meinem'], answer: 'meinem' },
  { text: 'Ich bleibe zu Hause, weil ich krank ___.', options: ['ist', 'bin', 'sein'], answer: 'bin' },
  { text: 'Mein Bruder ist ___ als ich.', options: ['groß', 'am größten', 'größer'], answer: 'größer' },
  { text: '___ es regnet, gehe ich spazieren.', options: ['Deshalb', 'Trotzdem', 'Obwohl'], answer: 'Obwohl' },
  { text: 'Das ist der Mann, ___ ich gestern gesehen habe.', options: ['der', 'den', 'dem'], answer: 'den' },
  { text: 'Wenn ich Zeit ___, würde ich dich besuchen.', options: ['hatte', 'hätte', 'gehabt'], answer: 'hätte' },
  { text: 'Das Haus wurde 1990 ___.', options: ['bauen', 'baute', 'gebaut'], answer: 'gebaut' }
]
// intro: предложение проверить уровень, list: выбор уровня, test: вопросы, result: итог теста
const step = ref('list')
const testIndex = ref(0)
const testResult = ref(null)
const testAnswers = ref([])
const testPicked = ref(null)
const testLocked = ref(false)
let answerTimer = null
const testQuestion = computed(() => TEST[testIndex.value])
const testParts = computed(() => testQuestion.value.text.split('___'))
const testLevel = computed(() => TEST_LEVELS[Math.floor(testIndex.value / TEST_BLOCK)])
const testCorrect = computed(() => testAnswers.value.filter(Boolean).length)

// после ответа верный вариант зелёный, ошибочный выбор красный
const optionClass = (option) => {
  if (!testLocked.value) return ''
  if (option === testQuestion.value.answer) return 'level-test__option--ok'
  return option === testPicked.value ? 'level-test__option--bad' : 'level-test__option--off'
}

watch(() => props.modelValue, (open) => {
  if (!open) return
  selected.value = authStore.germanLevel || null
  step.value = props.mode === 'onboarding' ? 'intro' : 'list'
  clearTimeout(answerTimer)
  testLocked.value = false
}, { immediate: true })

onBeforeUnmount(() => clearTimeout(answerTimer))

const startTest = () => {
  testAnswers.value = []
  testIndex.value = 0
  testPicked.value = null
  testLocked.value = false
  step.value = 'test'
}

// вышел из теста: возвращаемся к ручному выбору уровня
const backToChoice = () => {
  clearTimeout(answerTimer)
  testLocked.value = false
  step.value = 'list'
}

const finishTest = (level) => {
  selected.value = level
  testResult.value = level
  step.value = 'result'
  $track?.('german_level_test_finished', { level, correct: testCorrect.value, total: testAnswers.value.length })
}

const blockPassed = (block) => {
  const answers = testAnswers.value.slice(block * TEST_BLOCK, (block + 1) * TEST_BLOCK)
  return answers.filter(Boolean).length >= TEST_PASS
}

const suggestedLevel = () => {
  if (!blockPassed(1)) return 'A1'
  return blockPassed(2) ? 'B1' : 'A2'
}

const nextAfterAnswer = () => {
  if (testIndex.value === TEST.length - 1) return finishTest(suggestedLevel())
  testIndex.value++
}

const answerTest = (option) => {
  if (testLocked.value) return
  testLocked.value = true
  testPicked.value = option
  testAnswers.value[testIndex.value] = option === testQuestion.value.answer
  answerTimer = setTimeout(() => {
    nextAfterAnswer()
    testPicked.value = null
    testLocked.value = false
  }, ANSWER_PAUSE)
}

const close = () => emit('update:modelValue', false)

const { $track } = useNuxtApp()

// source: onboarding | settings | skip. По этому событию видно, какой уровень у аудитории
const trackLevel = (level, source) => {
  const previous = authStore.germanLevel || 'none'
  $track?.('german_level_selected', { level, source, previous })
}

const confirm = async () => {
  if (!selected.value) return
  trackLevel(selected.value, props.mode)
  close()
  await authStore.setGermanLevel(selected.value)
}

const skip = async () => {
  trackLevel('A1', 'skip')
  close()
  await authStore.setGermanLevel('A1')
}

const onBackdrop = () => {
  if (props.mode === 'settings') close()
}
</script>

<style scoped>
.level-picker {
  position: fixed;
  inset: 0;
  z-index: 19000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.level-picker__card {
  width: 100%;
  max-width: 340px;
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: 20px 16px 16px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 28px;
  background: var(--tabBg);
  color: var(--titleColor);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: level-picker-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.level-picker__title {
  font-size: 19px;
  font-weight: 900;
  line-height: 1.25;
}

.level-picker__subtitle {
  margin: 4px 0 14px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  opacity: 0.7;
}

.level-picker__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.level-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  background: var(--settingsSectionBg);
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  text-align: start;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}

.level-option:active {
  transform: scale(0.97);
}

.level-option--active {
  border-color: #3b82f6;
}

.level-option__badge {
  flex-shrink: 0;
  width: 34px;
  padding: 3px 0;
  border-radius: 9px;
  background: #3b82f6;
  color: #fff;
  font-size: 13px;
  font-weight: 900;
  text-align: center;
}

.level-option__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.level-option__name {
  font-size: 14px;
  font-weight: 900;
}

.level-option__phrase {
  font-size: 12px;
  font-weight: 600;
  font-style: italic;
  line-height: 1.3;
  text-align: left;
  opacity: 0.75;
}

.level-option__radio {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 50%;
  transition: border 0.15s;
}

.level-option--active .level-option__radio {
  border: 5px solid #3b82f6;
}

.level-picker__btn {
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  border: none;
  border-radius: 50px;
  background: #3b82f6;
  box-shadow: 0 6px 0 #1d4ed8;
  color: #fff;
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.1s ease;
}

.level-picker__btn:active:not(:disabled) {
  transform: translateY(6px);
  box-shadow: 0 0 0 #1d4ed8;
}

.level-picker__btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.level-test__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.level-test__chip {
  flex-shrink: 0;
  min-width: 34px;
  padding: 3px 7px;
  border-radius: 9px;
  border-bottom: 3px solid rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 13px;
  font-weight: 900;
}

.level-test__chip--a1 {
  background: #22c55e;
}

.level-test__chip--a2 {
  background: #3b82f6;
}

.level-test__chip--b1 {
  background: #8b5cf6;
}

.level-test__count {
  flex-shrink: 0;
  min-width: 34px;
  font-size: 13px;
  font-weight: 900;
  text-align: end;
  opacity: 0.7;
}

.level-test__bar {
  display: flex;
  gap: 3px;
  margin: 12px 0 14px;
}

.level-test__step {
  flex: 1;
  height: 7px;
  border-radius: 4px;
  background: var(--settingsSectionBg);
  transition: background 0.2s;
}

.level-test__step--now {
  background: #3b82f6;
}

.level-test__step--ok {
  background: #22c55e;
}

.level-test__step--bad {
  background: #ef4444;
}

.level-test__question {
  animation: level-test-in 0.25s ease;
}

.level-test__text {
  margin-bottom: 14px;
  padding: 16px 12px;
  border: 3px dashed var(--tabsSlideBorderColor);
  border-radius: 18px;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.5;
}

.level-test__gap {
  display: inline-block;
  min-width: 58px;
  margin: 0 3px;
  padding: 0 6px;
  border-bottom: 3px solid #3b82f6;
  color: #3b82f6;
  line-height: 1.2;
  vertical-align: baseline;
}

.level-test__gap--filled {
  border-bottom-color: #22c55e;
  color: #22c55e;
}

.level-test__gap:empty::before {
  content: "\00a0";
}

.level-test__option {
  width: 100%;
  padding: 12px;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
  background: var(--settingsSectionBg);
  box-shadow: 0 4px 0 var(--tabsSlideBorderColor);
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s, background 0.15s, opacity 0.15s;
}

.level-test__option:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 var(--tabsSlideBorderColor);
}

.level-test__option--ok {
  border-color: #16a34a;
  background: #22c55e;
  box-shadow: 0 4px 0 #16a34a;
  color: #fff;
}

.level-test__option--bad {
  border-color: #dc2626;
  background: #ef4444;
  box-shadow: 0 4px 0 #dc2626;
  color: #fff;
  animation: level-test-shake 0.3s ease;
}

.level-test__option--off {
  opacity: 0.45;
}

/* итог теста */
.level-result {
  --result-color: #22c55e;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4px;
  animation: level-picker-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.level-result--a2 {
  --result-color: #3b82f6;
}

.level-result--b1 {
  --result-color: #8b5cf6;
}

.level-result__ring {
  position: relative;
  width: 124px;
  height: 124px;
}

.level-result__ring svg {
  display: block;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.level-result__track,
.level-result__fill {
  fill: none;
  stroke-width: 11;
}

.level-result__track {
  stroke: var(--settingsSectionBg);
}

.level-result__fill {
  stroke: var(--result-color);
  stroke-linecap: round;
  stroke-dashoffset: var(--ring-offset);
  animation: level-result-ring 0.9s ease-out;
}

.level-result__score {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  font-weight: 900;
}

.level-result__score small {
  font-size: 17px;
  opacity: 0.6;
}

.level-result__text {
  margin: 10px 0 10px;
  font-size: 16px;
  font-weight: 900;
}

.level-result__name {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  font-size: 16px;
  font-weight: 900;
}

.level-result__level {
  padding: 2px 8px;
  border-radius: 9px;
  border-bottom: 3px solid rgba(0, 0, 0, 0.25);
  background: var(--result-color);
  color: #fff;
  font-size: 13px;
}

.level-picker__skip {
  margin-top: 10px;
  padding: 4px 8px;
  border: none;
  background: none;
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 700;
  text-decoration: underline;
  opacity: 0.6;
  cursor: pointer;
}

.level-picker__skip--back {
  display: block;
  margin: 2px auto 0;
}

.level-picker-fade-enter-active,
.level-picker-fade-leave-active {
  transition: opacity 0.2s;
}

.level-picker-fade-enter-from,
.level-picker-fade-leave-to {
  opacity: 0;
}

@keyframes level-test-in {
  from {
    opacity: 0;
    transform: translateX(14px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes level-test-shake {
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

@keyframes level-result-ring {
  from {
    stroke-dashoffset: 326.73;
  }
}

@keyframes level-picker-pop {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1);
  }
}
</style>
