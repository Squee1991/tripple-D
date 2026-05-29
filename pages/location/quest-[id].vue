<template>
  <div>
    <div v-if="isAdLoading" class="ad-overlay">
      <div class="ad-spinner"></div>
    </div>
    <div class="quest">
      <VLoginPreloader v-if="questStore.loading"/>
      <div v-if="questStore.finished && questStore.success && !questStore.hasMistakes" class="quest__stamp quest__stamp--ok">{{ t('locationQuests.done')}}</div>
      <div v-if="questStore.loading" class="quest__panel quest__panel--loading"></div>
      <div v-else-if="questStore.error" class="quest__panel quest__panel--error">
        <div>Error: {{ questStore.error }}</div>
        <button class="btn" @click="goThemes">back</button>
      </div>
      <div v-else-if="questStore.task" class="quest__card">
        <VHelpModal :open="showHint" @close="showHint=false" />
        <div class="quest__top">
          <button class="quest__back-btn" @click="openLeave('back')">×</button>
          <div class="quest__stat">
            <div class="quest__stat-value">
              {{ questStore.currentIndex + 1 }} / {{ questStore.requiredTasks }}
            </div>
            <div class="quest__progress-line">
              <template v-for="(step, index) in progressSteps" :key="index">
                <div class="quest__dot" :class="getDotClass(step)"></div>
              </template>
            </div>
          </div>
          <div class="quest__lives" v-if="!previouslyCleared">
            <VHearts
                :lives="questStore.lives"
                :max-lives="questStore.maxLives"
                :last-life-at-ms="questStore.lastLifeAtMs"
                :regen-interval-ms="questStore.REGEN_INTERVAL_MS"
            />
          </div>
        </div>
        <div class="quest__section">
          <div v-if="hasTip" class="quest__tip-container">
            <button class="quest__tip-btn" @click="showTipModal = true">💡</button>
          </div>
          <div class="quest__question">
            <template v-if="questStore.task.type === 'input' && questStore.showResult">
              <span v-html="highlightedQuestion"></span>
            </template>
            <template v-else>
              <template v-if="questStore.task?.question">
                {{ t(questStore.task.question) }}
              </template>
            </template>
          </div>
          <div class="quest__body">
            <template v-if="questStore.task.type === 'select' || questStore.task.type === 'readAndAnswer'">
              <div v-if="questStore.task.text" class="quest__read-text">{{
                  t(questStore.task.text)
                }}
              </div>
              <ul class="quest__options" :class="{ 'quest__options--locked': questStore.showResult }">
                <li v-for="option in questStore.task.options" :key="option">
                  <button class="quest__option-btn" :class="optionClass(option, questStore)"
                          @click="handleOptionClick(option)"
                  >
                    {{ t(option) }}
                  </button>
                </li>
              </ul>
            </template>
            <template v-else-if="questStore.task.type === 'input'">
              <div class="quest__speech">
                <input
                    ref="inputRef"
                    type="text"
                    class="quest__input"
                    v-model="questStore.userInput"
                    :disabled="questStore.showResult"
                    @keyup.enter="handleClick"
                    :placeholder="inputPlaceholders.inputType"
                />
                <div v-if="shouldShowGermanLetters" class="german__letters">
                  <button
                      v-for="(letter, index) in germanLetters"
                      :key="index"
                      type="button"
                      class="german__letters-item"
                      :disabled="questStore.showResult"
                      @click="addGermanLetter(letter)"
                  >
                    {{ letter }}
                  </button>
                </div>
              </div>
            </template>
            <template v-else-if="questStore.task.type === 'speechToText'">
              <div class="quest__speech">
                <SoundBtn :text="questStore.task.text"/>
                <input
                    ref="speechInputRef"
                    type="text"
                    class="quest__input"
                    v-model="questStore.userInput"
                    :disabled="questStore.showResult"
                    @keyup.enter="handleClick"
                    :placeholder="inputPlaceholders.inputTypeSTT"
                />
                <div v-if="shouldShowGermanLetters" class="german__letters">
                  <button
                      v-for="(letter, index) in germanLetters"
                      :key="index"
                      type="button"
                      class="german__letters-item"
                      :disabled="questStore.showResult"
                      @click="addGermanLetter(letter)"
                  >
                    {{ letter }}
                  </button>
                </div>
              </div>
            </template>
            <template v-else-if="questStore.task.type === 'reorder'">
              <div class="quest__reorder">
                <div class="quest__reorder-selection" :class="{ 'quest__reorder-selection--empty': questStore.reorderSelection.length === 0 }">
                  <button
                      v-for="(word, index) in questStore.reorderSelection"
                      :key="`${word}-${index}`"
                      class="quest__word-btn"
                      @click="questStore.handleReorderWord(word, 'selection')"
                  >
                    {{ t(word) }}
                  </button>
                </div>
                <div class="quest__word-bank">
                  <button
                      v-for="(word, index) in questStore.reorderBank"
                      :key="`${word}-${index}`"
                      class="quest__word-btn"
                      @click="handleWordBankClick(word)"
                  >
                    {{ t(word) }}
                  </button>
                </div>
              </div>
            </template>
          </div>
          <div v-if="questStore.showResult" :class="statusClassComputed" class="quest__feedback">
            <img class="quest__feedback-icon" :src="questStore.isCorrect ? RightIcon : WrongIcon" alt="answer_icons">
            <div class="quest__feedback-text">
              <div v-if="questStore.isCorrect">{{ t('questCompletedModals.correct')}}</div>
              <div class="quest__correct-answer-block" v-else>
                <div>{{ t('questCompletedModals.correctAnswer')}}</div>
                <div> {{ t(questStore.correctAnswer) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="quest__controls">
          <button class="btn" :disabled="!questStore.showResult && questStore.isConfirmDisabled"
                  @click="handleClick">
            {{ questStore.showResult ? t('questCompletedModals.further') : t('questCompletedModals.check') }}
          </button>
        </div>
      </div>
      <div v-else-if="questStore.finished && questStore.success && !questStore.hasMistakes && questStore.justAwarded"
           class="quest-complete quest-complete--solo">
        <div class="quest-complete__title">{{ t('questCompletedModals.completed')}}</div>
        <div class="quest-complete__subtitle">{{ t('questCompletedModals.reward')}}</div>
        <div class="quest-complete__actions quest-complete__actions--one">
          <button class="btn btn--primary" @click="goThemes">{{ t('questCompletedModals.back')}}</button>
        </div>
      </div>
      <div v-else class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__window">
          <div class="modal__title">
            <template v-if="questStore.success && !questStore.hasMistakes">
              {{ t('questCompletedModals.completed') }}
            </template>
            <template v-else-if="questStore.success && questStore.hasMistakes">
              {{ t('questCompletedModals.completedWithMistakes') }}
            </template>
            <template v-else>
              {{ t('questCompletedModals.notCompleted')}}
            </template>
          </div>
          <div class="modal__actions">
            <button v-for="(btn, index) in footerButtons"
                    :key="index" class="btn"
                    :class="btn.style"
                    @click="btn.action"
            >
              {{ btn.text }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <VReviveModal
        :show="forceRevive || showRevive"
        :correct-count="questStore.correctCount"
        :required-tasks="questStore.requiredTasks"
        :wallet="wallet"
        :can-buy-life="canBuyLife"
        :remaining-ads="remainingAds"
        @purchase="purchaseLife"
        @watchAd="watchAdForLife"
        @back="goThemes"
    />

    <!-- Наш новый компонент модалки -->
    <VStopSessionModal
        :show="showLeaveModal"
        @update:show="showLeaveModal = $event"
        @confirm="confirmLeave"
        @cancel="stayHere"
    />

    <VRulesModal
        :show="showTipModal"
        :show-result="questStore.showResult"
        :current-tip="currentTip"
        @close="showTipModal = false"
    />
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch, watchEffect, nextTick, onBeforeUnmount} from 'vue'
import {useRoute, useRouter, onBeforeRouteLeave} from 'vue-router'
import {userChainStore} from '~/store/chainStore.js'
import {userlangStore} from '~/store/learningStore.js'
import SoundBtn from '~/src/components/soundBtn.vue'
import {playCorrect, playWrong, unlockAudioByUserGesture} from '~/utils/soundManager.js'
import { showRewarded } from '~/utils/admob.js';
import RightIcon from '~/assets/images/location-icons/accept.svg'
import WrongIcon from '~/assets/images/location-icons/cancel.svg'
import {useSeoMeta} from '#imports'
import VHelpModal from "~/src/components/V-help-modal.vue";
import VHearts from '../../src/components/V-hearts.vue'
import VRulesModal from "~/src/components/V-rulesModal.vue";
import VReviveModal from "~/src/components/V-reviveModal.vue";
import VLoginPreloader from "~/src/components/V-loginPreloader.vue";

import VStopSessionModal from "~/src/components/V-stopSessionModal.vue";

useSeoMeta({robots: 'noindex, nofollow'})

const { getDotClass,  optionClass } = useClasses()
const {t, locale} = useI18n()
const route = useRoute()
const router = useRouter()
const questStore = userChainStore()
const langStore = userlangStore()
const forceRevive = ref(false)
const showTipModal = ref(false)
const isAdLoading = ref(false)
const MAX_ADS = 5;
const remainingAds = ref(MAX_ADS);
const PRICE = 10
const questId = computed(() => {
  const rawId = String(route.params.id || route.params.questId || '')
  return rawId.replace('quest-', '')
})

const hasTip = computed(() => {
  return !!(questStore.task && questStore.task.tip)
})

const currentTip = computed(() => {
  return questStore.task?.tip || ''
})

watch(() => questStore.currentIndex, () => {
  showTipModal.value = false
})

const regionKey = computed(() => String(route.query.region || ''))
const progressEntry = computed(() => questStore.questProgress?.[questId.value] || null)
const previouslyCleared = computed(() => !!(progressEntry.value?.success || progressEntry.value?.rewardClaimed))
const wallet = computed(() => Number(langStore.points || 0))
const canBuyLife = computed(() => wallet.value >= PRICE)
const isSpeaking = ref(false)
const learningLanguage = computed(() => langStore.learningLang)
const TARGET_LANG_CODE = 'de'
const speechInputRef = ref(null)
const germanLetters = ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü', 'ß'];
const inputRef = ref(null)
const showHint = ref(false)
const NUMBERS_HINT_KEY = 'hide_numbers_hint_modal'

const now = ref(Date.now())
let rafId = null

function updateTimer() {
  now.value = Date.now()
  rafId = requestAnimationFrame(updateTimer)
}

function updateRemainingAds() {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const statsStr = localStorage.getItem('adRewardStats');
  if (!statsStr) {
    remainingAds.value = MAX_ADS;
    return;
  }
  try {
    const stats = JSON.parse(statsStr);
    if (stats.date !== todayKey) {
      remainingAds.value = MAX_ADS;
    } else {
      remainingAds.value = Math.max(0, MAX_ADS - stats.count);
    }
  } catch (e) {
    remainingAds.value = MAX_ADS;
  }
}

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

const footerButtons = computed(() => [
  {text: questStore.success && questStore.hasMistakes
        ? t('locationQuests.repeatMistakes')
        : t('questCompletedModals.again'),
    action: questStore.success && questStore.hasMistakes
        ? () => questStore.startRetryMistakes()
        : restart,
    style: ''
  },
  {
    text: t('questCompletedModals.back'),
    action: goThemes,
    style: 'btn--primary'
  }
])

const inputPlaceholders = {
  inputTypeSTT: t('locationsPlaceholder.inputType'),
  inputType: 'впишите правильный вариант'
}

const shouldShowGermanLetters = computed(() => {
  if (!questStore.task) return false
  if (!['speechToText', 'input'].includes(questStore.task.type)) return false

  const source = String(
      questStore.task.answer ||
      questStore.task.correctAnswer ||
      questStore.task.text ||
      ''
  )
  return /[äöüÄÖÜß]/.test(source)
})

function addGermanLetter(letter) {
  if (questStore.showResult) return
  const inputEl = questStore.task?.type === 'input' ? inputRef.value : speechInputRef.value
  const current = String(questStore.userInput || '')
  if (!inputEl) {
    questStore.userInput = current + letter
    return
  }
  const start = inputEl.selectionStart ?? current.length
  const end = inputEl.selectionEnd ?? current.length
  questStore.userInput = current.slice(0, start) + letter + current.slice(end)
  nextTick(() => {
    inputEl.focus()
    const pos = start + 1
    inputEl.setSelectionRange(pos, pos)
  })
}

async function speakText(text) {
  if (isSpeaking.value || !text) return;

  isSpeaking.value = true;
  try {
    await getSpeechAudio(text.trim());
  } catch (error) {
    console.error(error);
  } finally {
    isSpeaking.value = false;
  }
}

function handleWordBankClick(wordKey) {
  if (learningLanguage.value === TARGET_LANG_CODE) {
    const textToSpeakRaw = wordKey;
    if (textToSpeakRaw.length > 0) {
      speakText(textToSpeakRaw);
    }
  }
  questStore.handleReorderWord(wordKey, 'bank');
}

function handleOptionClick(opt) {
  questStore.choose(opt);
  if (learningLanguage.value === TARGET_LANG_CODE) {
    const textToSpeakRaw = opt;
    if (textToSpeakRaw.length > 2 && !textToSpeakRaw.includes('.')) {
      speakText(textToSpeakRaw);
    }
  }
}

const showRevive = computed(() =>
    !previouslyCleared.value &&
    questStore.requiredTasks > 0 &&
    questStore.lives <= 0 &&
    questStore.correctCount < questStore.requiredTasks &&
    !questStore.success
)

const highlightedQuestion = computed(() => {
  if (!questStore.task || !questStore.task.question) {
    return '';
  }
  try {
    if (questStore.task.type !== 'input') {
      return t(questStore.task.question);
    }
  } catch (e) {
  }

  const cls = questStore.isCorrect ? 'filled-answer-correct' : 'filled-answer-wrong'
  return t(questStore.task.question).replace('___', `<strong class="${cls}">${questStore.correctAnswer}</strong>`)
})

function goThemes() {
  if (window.history.length > 1) {
    router.back()
  } else if (regionKey.value) {
    router.push(`/location/${regionKey.value}`)
  }
}

function restart() {
  questStore.restart(previouslyCleared.value)
  questStore.loadQuest(questId.value, regionKey.value)
}

function handleClick() {
  unlockAudioByUserGesture()
  if (!questStore.showResult) {
    questStore.confirm(previouslyCleared.value)
  } else {
    questStore.nextTask(previouslyCleared.value)
  }
}

const statusClassComputed = computed(() => (questStore.isCorrect ? 'is-green' : 'is-red'))

const showLeaveModal = ref(false)
const pendingRoute = ref(null)
let allowLeave = false
const hasDirtyInput = computed(() =>
    !!(questStore.selected ||
        (questStore.userInput && questStore.userInput.trim()) ||
        (questStore.reorderSelection && questStore.reorderSelection.length > 0) ||
        questStore.currentIndex > 0)
)
const shouldBlockLeaving = computed(() =>
    (questStore.sessionStarted && !questStore.finished) || (!questStore.finished && hasDirtyInput.value)
)

function openLeave() {
  if (shouldBlockLeaving.value) {
    pendingRoute.value = goThemes
    showLeaveModal.value = true
  } else {
    goThemes()
  }
}

const progressSteps = computed(() =>
    Array.from({length: questStore.requiredTasks}, (_, i) =>
        i < questStore.currentIndex
            ? (questStore.answers?.[i]?.correct ? 'done' : 'wrong')
            : i === questStore.currentIndex
                ? (questStore.showResult ? (questStore.isCorrect ? 'done' : 'wrong') : 'current')
                : 'pending'
    )
)

onBeforeRouteLeave((to, from, next) => {
  if (!allowLeave && shouldBlockLeaving.value) {
    pendingRoute.value = () => router.push(to)
    showLeaveModal.value = true
    next(false)
  } else next()
})

function confirmLeave() {
  allowLeave = true
  showLeaveModal.value = false
  if (pendingRoute.value) pendingRoute.value()
  else goThemes()
}

function stayHere() {
  pendingRoute.value = null
  showLeaveModal.value = false
}

watch(() => questStore.showResult, (shown) => {
  if (!shown) return
  if (questStore.isCorrect) playCorrect()
  else playWrong()
})

async function trySpendLocal(amount) {
  amount = Number(amount) || 0
  if (amount <= 0) return true
  if ((langStore.points ?? 0) < amount) return false

  langStore.points -= amount
  langStore.articlesSpentForAchievement = Number(langStore.articlesSpentForAchievement || 0) + amount
  if (typeof langStore.saveToFirebase === 'function') {
    try {
      await langStore.saveToFirebase()
    } catch {
    }
  }
  return true
}

function watchAdForLife() {
  isAdLoading.value = true;
  showRewarded(
      async () => {
        await questStore.addLife(1);
        if (questStore.finished && !questStore.success) questStore.finished = false;
        if (!questStore.sessionStarted) questStore.sessionStarted = true;
        forceRevive.value = false;
        updateRemainingAds();
      },
      (gotReward) => {
        isAdLoading.value = false;
        if (!gotReward) {
          console.log("Юзер закрыл рекламу раньше времени. Жизнь не даем.");
        }
      }
  );
}

async function purchaseLife() {
  if (!canBuyLife.value) return
  const ok = await trySpendLocal(PRICE)
  if (!ok) return
  await questStore.addLife(1)

  if (questStore.finished && !questStore.success) questStore.finished = false
  if (!questStore.sessionStarted) questStore.sessionStarted = true
  forceRevive.value = false
}

function beforeUnloadHandler(e) {
  e.preventDefault()
}

watch([questId, regionKey], () => {
      questStore.loading = true
      questStore.error = ''
      questStore.quest = null
      questStore.finished = false
      questStore.showResult = false
      questStore.selected = ''
      questStore.userInput = ''
      questStore.reorderSelection = []
      questStore.reorderBank = []
      showHint.value = false
      ;(async () => {
        await questStore.loadProgressFromFirebase?.()
        await questStore.loadQuest(questId.value, regionKey.value)
        const hasAccept = questStore.quest?.tasks?.some(t => t.accept?.length)
        if (hasAccept && localStorage.getItem(NUMBERS_HINT_KEY) !== 'true') {
          showHint.value = true
        }
        await nextTick()
        forceRevive.value = showRevive.value
      })()
    },
    { immediate: true, flush: 'sync' }
)

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)
  if (rafId) cancelAnimationFrame(rafId)
})

onMounted(() => {
  updateTimer()
  updateRemainingAds()
})

watchEffect(() => {
  forceRevive.value = showRevive.value
})
</script>

<style scoped>
.quest {
  min-height: 100%;
  font-family: "Nunito", sans-serif;
  color: #1e1e1e;
  display: flex;
  flex-direction: column;
  padding: 10px 16px;
}

.quest__panel--error {
  background: #ffd5d2;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.quest__correct-answer-block {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.quest__back-btn {
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  background: #fff;
  color: #1e1e1e;
  font-weight: 900;
  font-size: 22px;
  line-height: 1;
  border: 2px solid #1e1e1e;
  border-radius: 40px;
  cursor: pointer;
  transition: all .1s ease-in-out;
  z-index: 99;
}

.quest__card {
  width: 100%;
  margin: 0 auto;
}

.quest__top {
  position: sticky;
  top: 0;
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-top: .25rem;
  margin-bottom: .75rem;
  border-radius: 99px;
}

.quest__stat {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: .4rem 1rem;
  min-width: 120px;
  gap: 10px;
}

.quest__stat-value {
  position: relative;
  font-weight: 600;
  font-size: 1.2rem;
  color: black;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: whitesmoke;
}

.quest__lives {
  padding: .5rem 1rem;
  text-align: center;
  position: relative;
}

.quest__section {
  margin-top: 10px;
  min-height: 250px;
}

.quest__question {
  margin: 0 auto 1rem;
  text-align: center;
  font-size: 1.9rem;
  line-height: 1.25;
  padding: 1rem 1.25rem;
  color: var(--titleColor);
  font-weight: 600;
}

.quest__body {
  width: min(900px, 100%);
  margin: 0 auto 1rem;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.quest__read-text {
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  padding: 1rem;
  width: min(860px, 96%);
  margin: 0 auto;
  box-shadow: 4px 4px 0 #1e1e1e;
  font-size: 18px;
}

.quest__options {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: .25rem;
}

.quest__options--locked {
  pointer-events: none;
}

.quest__option-btn {
  min-width: 88px;
  height: 60px;
  padding: 0 18px;
  font-size: 20px;
  font-weight: 800;
  color: #1e1e1e;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 10px;
  box-shadow: 4px 4px 0 #1e1e1e;
  cursor: pointer;
  transition: all .1s ease-in-out;
}

.quest__word-btn {
  padding: 10px;
  font-size: 20px;
  font-weight: 600;
  background: #fff;
  color: #1e1e1e;
  border: 3px solid #1e1e1e;
  border-radius: 12px;
  box-shadow: 2px 2px 0 #1e1e1e;
  cursor: pointer;
  transition: all .1s ease-in-out;
}

.quest__option-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 #1e1e1e;
}

.quest__option-btn--chosen {
  background: #cde8ff;
}

.quest__option-btn--correct {
  background: #b9f5c4 !important;
}

.quest__option-btn--wrong {
  background: #ffd0cc !important;
}

.quest__option-btn--dim {
  opacity: .6;
}

.quest__input {
  width: min(860px, 96%);
  margin: 0 auto;
  display: block;
  padding: 14px 16px;
  font-size: 18px;
  background: #fff;
  color: #1e1e1e;
  border: 3px solid var(--tabsSlideBorderColor);
  border-radius: 16px;
}

.quest__speech {
  display: grid;
  gap: 14px;
}

.quest__reorder {
  display: grid;
  gap: 14px;
  place-items: center;
}

.quest__reorder-selection {
  width: min(860px, 96%);
  padding: 5px 10px;
  min-height: 60px;
  background: #fff;
  border: 3px solid #1e1e1e;
  border-radius: 16px;
  box-shadow: 3px 3px 0 #1e1e1e;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.quest__reorder-selection--empty {
  background: #fffbe9;
}

.quest__word-bank {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.quest__feedback {
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 0;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 30px 15px;
}

.quest__feedback.is-green {
  color: #3fa65b;
  font-size: 2rem;
  font-weight: 600;
  background: #b9f5c4;
}

.quest__feedback.is-red {
  color: #d9534f;
  font-size: 2rem;
  font-weight: 600;
  font-style: italic;
  background: #ffd0cc;
}

.quest__feedback-icon {
  margin-right: 8px;
  width: 50px;
}

.quest__controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: .25rem;
}

.quest__stamp {
  position: fixed;
  right: 24px;
  top: 18px;
  z-index: 50;
  font-weight: 900;
  border: 3px solid #1e1e1e;
  padding: 6px 12px;
  border-radius: 10px;
  transform: rotate(-6deg);
}

.quest__stamp--ok {
  background: #b9f5c4;
  color: #0f5132;
}

.quest-complete {
  text-align: center;
  padding-top: 60px;
}

.quest-complete__title {
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 10px;
  color: #3fa65b;
}

.quest-complete__subtitle {
  color: #333;
  margin-bottom: 12px;
}

.quest-complete__actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  border: 4px solid #1e1e1e;
  box-shadow: 8px 8px 0 #1e1e1e;
  max-width: 500px;
  width: 90%;
  text-align: center;
  margin: 0 auto;
}

.btn {
  width: 80%;
  max-width: 440px;
  padding: 14px;
  border-radius: 36px;
  font-family: "Nunito", sans-serif;
  font-weight: 900;
  font-size: 22px;
  border: none;
  color: white;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0px 5px 0 #2261c7;
  transition: all .1s ease-in-out;
}

.btn--primary {
  background: #a7ecb8;
}

.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
}

.modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, .35);
  backdrop-filter: blur(2px);
}

.german__letters {
  display: flex;
  gap: 5px;
  margin: 8px 0;
  justify-content: center;
}

.german__letters-item {
  padding: 8px;
  background: #84d3d0;
  box-shadow: 2px 2px 0 black;
  color: white;
  border: 2px solid #757474;
  font-size: 20px;
  font-family: "Nunito", sans-serif;
  font-weight: 600;
  border-radius: 7px;
}

.german__letters-item:active {
  box-shadow: 0 0 0 ;
  transform: translate(1px , 1px);
}

.modal__window {
  position: relative;
  width: min(440px, 92%);
  background: #fff;
  border: 3px solid #111;
  border-radius: 18px;
  padding: 20px 35px;
  text-align: center;
  z-index: 1;
}

.modal__title {
  font-weight: 900;
  font-size: 28px;
  margin-bottom: 8px;
  color: #111;
}

.modal__text {
  padding: 10px;
}

.modal__actions {
  display: flex;
  justify-content: center;
  flex-direction: column-reverse;
  gap: 12px;
  flex-wrap: wrap;
  padding: 20px;
}

.wallet {
  margin: 8px auto 14px;
  width: min(420px, 100%);
}

.wallet__row {
  display: flex;
  justify-content: center;
  font-weight: 800;
  margin: 4px 0;
  gap: 10px;
}

.wallet__label {
  opacity: .8;
}

@media (max-width: 1023px) {
  .quest__top {
    flex-direction: column;
    align-items: center;
    gap: .75rem;
  }
}

@media (max-width: 767px) {
  .quest__question {
    padding: 5px;
    margin: 0 auto .7rem;
  }
  .quest__stat-value {
    width: 4.3rem;
    height: 2.3rem;
    font-size: 1rem;
    border: none;
  }
  .quest__top {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;
    background: none;
    box-shadow: none;
    border: none;
  }
  .quest__stat {
    order: 2;
    text-align: center;
    align-items: center;
    border-radius: 12px;
    padding: .3rem .7rem;
    margin-top: 2.5rem;
  }
  .quest__word-btn {
    font-size: 14px;
  }
  .quest__lives {
    order: 1;
    position: absolute;
    top: .5rem;
    background: none;
    padding: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .quest__question {
    font-size: 1.1rem;
    border-radius: 15px;
  }
  .quest__option-btn {
    height: 40px;
    font-size: 14px;
    border: 3px solid var(--tabsSlideBorderColor);
    box-shadow: var(--boxShadowMobile);
    padding: 3px;
  }
  .quest__feedback.is-red {
    font-size: 1.5rem;
  }
  .quest__feedback {
    padding: 19px 8px;
  }
}

@media (max-width: 479px) {
  .quest__feedback.is-red {
    font-size: 1rem;
  }
  .quest__feedback-icon {
    width: 34px;
  }
}

.quest__progress-line {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  gap: 4px;
}

.quest__dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #cec7c7;
  transition: all 0.3s ease;
}

.quest__dot--done {
  background: #4caf50;
}

.quest__dot--current {
  background: #2196f3;
}

.quest__dot--wrong {
  background: #d9534f;
}

@media (min-width: 1024px) {
  .quest__option-btn:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #1e1e1e;
  }
}

.quest__tip-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.quest__tip-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  font-family: "Nunito", sans-serif;
  font-weight: 800;
  font-size: 16px;
  color: #1e1e1e;
  background: #ffffff;
  border: 2px solid var(--tabsSlideBorderColor);
  border-radius: 12px;
  cursor: pointer;
  transition: all .1s ease-in-out;
}

.quest__tip-btn:hover {
  transform: translate(1px, 1px);
  box-shadow: 2px 2px 0 #1e1e1e;
}

.quest__tip-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 #1e1e1e;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes slideDown {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}

.ad-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(27, 27, 27, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.ad-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-top-color: #00c2ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>