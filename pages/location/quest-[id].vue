<template>
  <div
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
  >
    <div v-if="isAdLoading" class="ad-overlay">
      <div class="ad-spinner"></div>
    </div>
    <div class="mini-salute-container" v-if="miniConfettiParticles.length > 0">
      <div v-for="p in miniConfettiParticles" :key="p.id" class="mini-confetti-piece"
           :style="{
             left: p.left + '%',
             backgroundColor: p.color,
             animationDelay: p.delay + 's',
             animationDuration: p.duration + 's',
             width: p.width + 'px',
             height: p.height + 'px'
           }">
      </div>
    </div>
    <div class="quest">
      <VLoginPreloader v-if="questStore.loading"/>
      <div v-if="questStore.loading" class="quest__panel quest__panel--loading"></div>
      <div v-else-if="questStore.error" class="quest__panel quest__panel--error">
        <div>Error: {{ questStore.error }}</div>
        <button class="btn" @click="goThemes">back</button>
      </div>
      <div v-else-if="questStore.task" class="quest__card">
        <VHelpModal :open="showHint" @close="showHint=false"/>
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
          <div class="quest__lives" v-if="!previouslyCleared && !authStore.isPremium">
            <VHearts
                :lives="questStore.lives"
                :max-lives="questStore.maxLives"
                :last-life-at-ms="questStore.lastLifeAtMs"
                :regen-interval-ms="questStore.currentRegenIntervalMs"
            />
          </div>
        </div>
        <div class="quest__section">
          <div v-if="hasTip" class="quest__tip-container">
            <button class="quest__tip-btn" data-track="quest_hint_rule_opened" @click="showTipModal = true">💡</button>
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
                  <button class="quest__option-btn"
                          :class="optionClass(option, questStore)"
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
                <div class="quest__reorder-selection"
                     :class="{ 'quest__reorder-selection--empty': questStore.reorderSelection.length === 0 }">
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
        </div>
        <div class="actions-wrapper" :class="feedbackClass">
          <div class="actions-container">
            <div v-if="questStore.showResult" class="feedback-text">
              <div v-if="questStore.isCorrect" class="feedback correct slide-up">
                <img class="quest__feedback-icon" :src="RightIcon" alt="correct_icon">
                {{ t('questCompletedModals.correct') }}
              </div>
              <div v-else class="feedback incorrect shake quest__correct-answer-block">
                <div class="feedback-wrong-header">
                  <img class="quest__feedback-icon" :src="WrongIcon" alt="wrong_icon">
                  {{ t('questCompletedModals.correctAnswer') }}
                </div>
                <div class="correct-answer-text">{{ t(questStore.correctAnswer) }}</div>
              </div>
            </div>
            <button v-if="!questStore.showResult" class="btn btn-check" :disabled="questStore.isConfirmDisabled"
                    @click="handleClick">
              {{ t('questCompletedModals.check') }}
            </button>
            <button v-if="questStore.showResult" class="btn slide-up"
                    :class="questStore.isCorrect ? 'btn-next' : 'btn-wrong'" @click="handleClick">
              {{ t('questCompletedModals.further') }}
            </button>
          </div>
        </div>
      </div>
      <VQuestResultScreen
          :finished="questStore.finished"
          :has-mistakes="questStore.hasMistakes"
          :previously-cleared="previouslyCleared"
          :anim-step="animStep"
          :display-xp="displayXp"
          :display-coins="displayCoins"
          :confetti-particles="confettiParticles"
          :has-next-quest="hasNextQuest"
          @next="goNextQuest"
          @themes="goThemes"
          @retry-mistakes="questStore.startRetryMistakes()"
      />
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
    <VHedgehogHelper
        v-if="questStore.task && !questStore.showResult"
        :task="questStore.task"
        :lives="questStore.lives"
    />
  </div>
</template>

<script setup>
import {computed, ref, watch, watchEffect, nextTick, onBeforeUnmount, onMounted} from 'vue'
import {useRoute, useRouter, onBeforeRouteLeave} from 'vue-router'
import {userChainStore} from '~/store/chainStore.js'
import {userlangStore} from '~/store/learningStore.js'
import {userAuthStore} from "~/store/authStore.js"
import SoundBtn from '~/src/components/soundBtn.vue'
import VHedgehogHelper from '~/src/components/V-hedgehog-helper.vue'
import {playCorrect, playWrong, playLevelCompleted, unlockAudioByUserGesture} from '~/utils/soundManager.js'
import {showInterstitial} from '~/utils/admob.js'
import RightIcon from '~/assets/images/location-icons/accept.svg'
import WrongIcon from '~/assets/images/location-icons/cancel.svg'
import {useSeoMeta} from '#imports'
import VHelpModal from "~/src/components/V-help-modal.vue"
import VHearts from '../../src/components/V-hearts.vue'
import VRulesModal from "~/src/components/V-rulesModal.vue"
import VReviveModal from "~/src/components/V-reviveModal.vue"
import VLoginPreloader from "~/src/components/V-loginPreloader.vue"
import VStopSessionModal from "~/src/components/V-stopSessionModal.vue"
import {useSwipeBack} from '~/composables/useSwipeBack.js'
import VQuestResultScreen from '~/src/components/V-QuestResultScreen.vue'
import {useQuestAnimations} from '~/composables/useQuestAnimations.js'
import {useGermanKeyboard} from '~/composables/useGermanKeyboard.js'
import {useQuestLives} from '~/composables/useQuestLives.js'

useSeoMeta({robots: 'noindex, nofollow'})

const {getDotClass, optionClass} = useClasses()
const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const questStore = userChainStore()
const langStore = userlangStore()
const authStore = userAuthStore()
const showTipModal = ref(false)
const PRICE = 5

const inputRef = ref(null)
const speechInputRef = ref(null)
const previouslyCleared = ref(false)
const consecutiveCorrectCount = ref(0)

const {
  animStep,
  displayCoins,
  displayXp,
  confettiParticles,
  miniConfettiParticles,
  spawnMiniConfetti,
  resetAnimations
} = useQuestAnimations(questStore, previouslyCleared)

const {
  germanLetters,
  shouldShowGermanLetters,
  addGermanLetter
} = useGermanKeyboard(questStore, inputRef, speechInputRef)
const {
  isAdLoading,
  remainingAds,
  forceRevive,
  updateRemainingAds,
  watchAdForLife,
  purchaseLife
} = useQuestLives(questStore, langStore, PRICE)

const {$track} = useNuxtApp()
let taskStartTime = Date.now()

const {handleTouchStart, handleTouchMove, handleTouchEnd} = useSwipeBack(() => {
  openLeave()
}, {
  ignoreSelector: '.quest__input, .german__letters-item, .quest__option-btn, .quest__word-btn, .btn'
})

const feedbackClass = computed(() => {
  if (!questStore.showResult) return ''
  return questStore.isCorrect ? 'correct' : 'incorrect'
})

const questId = computed(() => {
  const rawId = String(route.params.id || route.params.questId || '')
  return rawId.replace('quest-', '')
})

const nextQuestId = computed(() => {
  const list = questStore.regionQuests || []
  if (!list.length) return null
  const currentIndex = list.findIndex(q => String(q.questId || q.id) === String(questId.value))
  if (currentIndex > -1 && currentIndex + 1 < list.length) {
    const nextItem = list[currentIndex + 1]
    return String(nextItem.questId || nextItem.id)
  }
  return null
})

const hasNextQuest = computed(() => !!nextQuestId.value)

function goNextQuest() {
  if (!nextQuestId.value) {
    goThemes()
    return
  }
  router.push({
    path: `/location/quest-${nextQuestId.value}`,
    query: {region: regionKey.value}
  })
}

const hasTip = computed(() => !!(questStore.task && questStore.task.tip))
const currentTip = computed(() => questStore.task?.tip || '')

watch(() => questStore.currentIndex, () => {
  showTipModal.value = false
})

const regionKey = computed(() => String(route.query.region || ''))
const wallet = computed(() => Number(langStore.points || 0))
const canBuyLife = computed(() => wallet.value >= PRICE)
const isSpeaking = ref(false)
const learningLanguage = computed(() => langStore.learningLang)
const TARGET_LANG_CODE = 'de'
const showHint = ref(false)
const NUMBERS_HINT_KEY = 'hide_numbers_hint_modal'

const now = ref(Date.now())
let rafId = null

function updateTimer() {
  now.value = Date.now()
  rafId = requestAnimationFrame(updateTimer)
}

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
})

const inputPlaceholders = {
  inputTypeSTT: t('locationsPlaceholder.inputType'),
  inputType: 'впишите правильный вариант'
}

async function speakText(text) {
  if (isSpeaking.value || !text) return
  isSpeaking.value = true
  try {
    await getSpeechAudio(text.trim())
  } catch (error) {
    console.error(error)
  } finally {
    isSpeaking.value = false
  }
}

function handleWordBankClick(wordKey) {
  if (learningLanguage.value === TARGET_LANG_CODE && wordKey.length > 0) {
    speakText(wordKey)
  }
  questStore.handleReorderWord(wordKey, 'bank')
}

function handleOptionClick(opt) {
  questStore.choose(opt)
  if (learningLanguage.value === TARGET_LANG_CODE && opt.length > 2 && !opt.includes('.')) {
    speakText(opt)
  }
}

const showRevive = computed(() =>
    !authStore.isPremium &&
    !previouslyCleared.value &&
    questStore.requiredTasks > 0 &&
    questStore.lives <= 0 &&
    questStore.correctCount < questStore.requiredTasks &&
    !questStore.success
)

const highlightedQuestion = computed(() => {
  if (!questStore.task || !questStore.task.question) return ''
  try {
    if (questStore.task.type !== 'input') return t(questStore.task.question)
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
  consecutiveCorrectCount.value = 0
  questStore.restart(previouslyCleared.value)
  questStore.loadQuest(questId.value, regionKey.value)
}

function handleClick() {
  unlockAudioByUserGesture()
  if (!questStore.showResult) {
    const durationSec = Math.round((Date.now() - taskStartTime) / 1000)
    questStore.confirm(previouslyCleared.value)
    $track('quest_task_answered', {
      quest_id: questId.value,
      duration_seconds: durationSec
    })
  } else {
    taskStartTime = Date.now()
    questStore.nextTask(previouslyCleared.value)
  }
}

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
  if (to.path === '/pay' || to.name === 'pay') {
    next()
    return
  }

  if (!allowLeave && shouldBlockLeaving.value) {
    pendingRoute.value = () => router.push(to)
    showLeaveModal.value = true
    next(false)
  } else {
    next()
  }
})

function confirmLeave() {
  const durationSec = Math.round((Date.now() - taskStartTime) / 1000)
  $track('quest_abandoned', {
    quest_id: questId.value,
    duration_seconds: durationSec,
    dropped_at_index: questStore.currentIndex
  })
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
  if (questStore.isCorrect) {
    playCorrect()
    consecutiveCorrectCount.value++
    if (consecutiveCorrectCount.value === 5) {
      spawnMiniConfetti()
      consecutiveCorrectCount.value = 0
    }
  } else {
    playWrong()
    consecutiveCorrectCount.value = 0
  }
})

function beforeUnloadHandler(e) {
  e.preventDefault()
}

watch(() => questStore.finished, (isFinished) => {
  if (isFinished) {
    $track('quest_finished', {
      quest_id: questId.value,
      region: regionKey.value,
      success: questStore.success,
      has_mistakes: questStore.hasMistakes,
      correct_count: questStore.correctCount,
      required_tasks: questStore.requiredTasks
    })

    if (questStore.success) {
      setTimeout(() => {
        playLevelCompleted()
      }, 200)
    }
  }
})

watch([questId, regionKey], () => {
      if (!questId.value || !regionKey.value) return
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
      resetAnimations()

      const initQuest = async () => {
        consecutiveCorrectCount.value = 0
        await questStore.loadProgressFromFirebase?.()

        const prog = questStore.questProgress?.[questId.value]
        previouslyCleared.value = !!(prog?.success || prog?.rewardClaimed)

        await questStore.loadQuest(questId.value, regionKey.value)
        $track('quest_session_started', {
          quest_id: questId.value,
          region: regionKey.value,
          total_tasks: questStore.requiredTasks,
          lives_initial: questStore.lives
        })
        taskStartTime = Date.now()
        const hasAccept = questStore.quest?.tasks?.some(t => t.accept?.length)
        if (hasAccept && localStorage.getItem(NUMBERS_HINT_KEY) !== 'true') {
          showHint.value = true
        }
        await nextTick()
      }

      if (authStore.isPremium) {
        initQuest()
      } else {
        showInterstitial(initQuest)
      }
    },
    {immediate: true, flush: 'sync'}
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
  position: relative;
  padding-bottom: 150px;
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

.actions-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background: transparent;
  transition: background-color 0.3s ease;
  z-index: 100;
}

.actions-wrapper.correct {
  background-color: #d4edda;
  border-top: 3px solid #2E7D32;
}

.actions-wrapper.incorrect {
  background-color: #f8d7da;
  border-top: 2px solid #C62828;
}

.actions-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 900px;
  gap: 15px;
  align-items: flex-start;
  padding: 15px 20px;
  padding-bottom: calc(15px + env(safe-area-inset-bottom));
}

.feedback-text {
  width: 100%;
  display: flex;
  align-items: center;
}

.feedback {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feedback.correct {
  color: #2E7D32;
}

.feedback.incorrect {
  color: #C62828;
}

.quest__correct-answer-block {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.feedback-wrong-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.correct-answer-text {
  font-weight: 800;
  margin-top: 5px;
}

.quest__feedback-icon {
  width: 32px;
}

.btn {
  width: 100%;
  padding: 14px 24px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  color: #ffffff;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-check {
  background-color: #3b82f6;
  box-shadow: 0 5px 0 #2563eb;
}

.btn-check:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.actions-wrapper.incorrect .btn-check {
  background-color: #ef4444;
  box-shadow: 0 5px 0 #dc2626;
}

.btn-next {
  background-color: #4ade80;
  box-shadow: 0 5px 0 #12a647;
}

.btn-wrong {
  background-color: #ef4444;
  box-shadow: 0 5px 0 #dc2626;
}

.btn:active:not(:disabled) {
  transform: translateY(2px);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
}

.shake {
  animation: shake 0.4s ease-in-out;
}

.mini-salute-container {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 99999;
}

.mini-confetti-piece {
  position: absolute;
  top: -30px;
  opacity: 0;
  border-radius: 3px;
  animation: miniConfettiFall linear forwards;
  will-change: transform, opacity;
}

@keyframes miniConfettiFall {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(720deg) scale(0.6);
    opacity: 0;
  }
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
  box-shadow: 0 0 0;
  transform: translate(1px, 1px);
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
    height: 46px;
    font-size: 14px;
    border: 3px solid var(--tabsSlideBorderColor);
    box-shadow: var(--boxShadowMobile);
    padding: 6px;
  }
}

@media (max-width: 479px) {
  .quest__feedback-icon {
    width: 24px;
  }

  .feedback {
    font-size: 1.2rem;
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
  to {
    transform: rotate(360deg);
  }
}
</style>