<template>
  <div class="passport">
    <div class="passport__page">
      <header class="passport__head">
        <span class="passport__photo">
          <img v-if="region" :src="region.icon" alt="" decoding="async">
        </span>
        <div class="passport__head-text">
          <span class="passport__caption">{{ t('questPath.passport') }}</span>
          <span class="passport__land">{{ region ? t(region.name) : '' }}</span>
          <span class="passport__chips">
            <span class="passport__chip passport__chip--quests">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="4"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="4 12 10 18 20 6"></polyline>
              </svg>
              {{ doneCount }}/{{ quests.length }}
            </span>
            <span class="passport__chip passport__chip--write">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                <path d="M3 17.25V21h3.75L17.8 9.94l-3.75-3.75L3 17.25zm17.7-10.2a1 1 0 0 0 0-1.42l-2.33-2.33a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              {{ writtenCount }}/{{ quests.length }}
            </span>
          </span>
        </div>
      </header>
      <!-- обложка стоит на месте, прокручиваются только задания внутри -->
      <div class="passport__scroll">
      <ol class="passport__list">
        <li v-for="(node, index) in nodes" :key="node.quest.questId" class="passport__item"
            :class="{ 'passport__item--walked': node.quest.isSuccess }">
          <div class="passport__row">
            <div class="passport__side">
              <button
                  type="button"
                  class="guidebook"
                  :data-track="'region_wordsLearn_clicked_' + node.quest.questId"
                  :aria-label="t('questPath.materials')"
                  @click="$emit('learn', node.quest)"
              >
                <span class="guidebook__pages"></span>
                <span class="guidebook__cover">
                  <span class="guidebook__badge">A</span>
                </span>
              </button>
              <span class="passport__label passport__label--learn">{{ t('questPath.materials') }}</span>
            </div>
            <div class="passport__center">
              <button
                  :ref="el => { if (node.isCurrent) currentEl = el }"
                  type="button"
                  class="visa"
                  :class="['visa--' + node.state, { 'visa--active': node.isCurrent }]"
                  :data-track="'region_node_clicked_' + node.quest.questId"
                  @click="openQuest(node.quest, index)"
              >
                <span class="visa__ring">
                  <img v-if="region" class="visa__img" :src="region.icon" alt="" decoding="async">
                </span>
                <span class="visa__num">{{ index + 1 }}</span>
                <span v-if="node.state === 'perfect'" class="visa__badge" :aria-label="t('locationQuests.done')">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="4"
                       stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="4 12 10 18 20 6"></polyline>
                  </svg>
                </span>
                <span v-else-if="node.state === 'mistakes'" class="visa__badge"
                      :aria-label="t('locationQuests.mistakes')">!</span>
              </button>
              <span class="passport__title">{{ t(node.quest.title) }}</span>
              <!-- место под кнопку есть в каждом ряду, чтобы расстояния между квестами были одинаковыми -->
              <div class="passport__action">
                <button v-if="node.quest.hasMistakes" type="button" class="passport__label passport__label--fix"
                        :data-track="'region_startQuest_clicked_' + node.quest.questId"
                        @click="startQuest(node.quest)">
                  {{ t('locationQuests.repeatMistakes') }}
                </button>
                <button v-else-if="node.isCurrent" type="button" class="passport__label passport__label--go"
                        :data-track="'region_startQuest_clicked_' + node.quest.questId"
                        @click="startQuest(node.quest)">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
                    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/>
                  </svg>
                  {{ t('locationQuests.start') }}
                </button>
              </div>
            </div>
            <div class="passport__side">
              <button
                  type="button"
                  class="postcard"
                  :class="{
                    'postcard--blank': !node.quest.isSuccess,
                    'postcard--done': node.writeDone,
                    'postcard--shake': shakingId === node.quest.questId
                  }"
                  :data-track="(node.quest.isSuccess ? 'region_write_clicked_' : 'region_write_locked_') + node.quest.questId"
                  :aria-label="t('questPath.writing')"
                  @click="onWrite(node)"
              >
                <span class="postcard__rings" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
                <span class="postcard__page" aria-hidden="true">
                  <span class="postcard__line"></span>
                  <span class="postcard__line"></span>
                  <span class="postcard__line postcard__line--short"></span>
                </span>
                <span v-if="node.quest.isSuccess" class="postcard__pencil" aria-hidden="true"></span>
                <span v-else class="postcard__lock">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z"/>
                  </svg>
                </span>
                <span v-if="node.writeDone" class="postcard__stamp">★</span>
              </button>
              <span class="passport__label"
                    :class="node.quest.isSuccess ? 'passport__label--write' : 'passport__label--locked'">
                <template v-if="node.quest.isSuccess && node.writeProgress.total">
                  {{ t('questPath.writing') }} {{ node.writeProgress.done }}/{{ node.writeProgress.total }}
                </template>
                <template v-else>{{ t('questPath.writing') }}</template>
              </span>
              <transition name="passport-pop">
                <span v-if="hintId === node.quest.questId" class="passport__hint">
                  {{ t('questPath.writeLocked') }}
                </span>
              </transition>
            </div>
          </div>
          <div class="passport__route" aria-hidden="true"></div>
        </li>
      </ol>
      <div class="land-chest" :class="'land-chest--' + chestState">
        <button type="button" class="land-chest__btn" :class="{ 'land-chest__btn--shake': chestShaking }"
                :aria-label="chestLabel" data-track="region_chest_clicked" @click="onChestClick">
          <span v-if="chestState === 'ready'" class="land-chest__shine" aria-hidden="true"></span>
          <VLandChest :open="chestState === 'claimed'" :locked="chestState === 'locked'"/>
          <span v-if="chestState === 'locked'" class="land-chest__lock" aria-hidden="true">🔒</span>
        </button>
        <span class="passport__title passport__title--chest">{{ chestLabel }}</span>
        <button v-if="chestState === 'ready'" type="button" class="land-chest__cta" @click="onChestClick">
          {{ t('questPath.chestOpen') }}
        </button>
      </div>
      <!-- вершина уровня пройдена: открывается итоговый тест, он ничего не блокирует -->
      <NuxtLink
          v-if="locationTestLevel"
          class="land-test"
          :to="`/locations-test/${locationTestLevel}`"
          data-track="location_test_opened"
      >
        {{ t('locationTest.title', { level: locationTestLevel }) }}
      </NuxtLink>
      </div>
    </div>
    <Teleport to="body">
      <transition name="chest-fade">
        <div v-if="chestModal" class="chest-modal" role="dialog" aria-modal="true">
          <span class="chest-modal__rays" :class="{ 'chest-modal__rays--on': chestOpened }" aria-hidden="true"></span>
          <span v-for="star in STARS" :key="star.id" class="chest-modal__star" aria-hidden="true"
                :style="{ left: star.left, top: star.top, animationDelay: star.delay }">✦</span>

          <button type="button" class="chest-modal__chest"
                  :class="chestOpened ? 'chest-modal__chest--open' : 'chest-modal__chest--waiting'"
                  :disabled="chestOpened" :aria-label="t('questPath.chestOpen')" @click="openChest">
            <VLandChest :open="chestOpened"/>
            <template v-if="chestOpened">
              <img v-for="coin in coins" :key="coin.id" class="chest-modal__coin" :src="CoinIcon" alt=""
                   :style="{ '--tx': coin.tx, '--ty': coin.ty, '--rot': coin.rot, animationDelay: coin.delay }">
            </template>
          </button>

          <p v-if="!chestOpened" class="chest-modal__hint">{{ t('questPath.chestTap') }}</p>
          <transition name="chest-pop">
            <div v-if="chestOpened" class="chest-modal__reward">
              +{{ shownReward }}
              <img :src="CoinIcon" alt="" class="chest-modal__reward-coin">
            </div>
          </transition>
          <transition name="chest-pop">
            <button v-if="rewardDone" type="button" class="chest-modal__take" @click="closeChest">
              {{ t('questPath.chestTake') }}
            </button>
          </transition>
        </div>
      </transition>
    </Teleport>
    <Teleport to="body">
      <transition name="qsheet-fade">
        <div v-if="openedQuest" class="qsheet" @click.self="openedQuest = null">
          <div class="qsheet__card" role="dialog" aria-modal="true">
            <span class="qsheet__grabber" aria-hidden="true"></span>
            <div class="qsheet__head">
              <span class="qsheet__visa visa" :class="'visa--' + openedNode.state">
                <span class="visa__ring">
                  <img v-if="region" class="visa__img" :src="region.icon" alt="">
                </span>
                <span class="visa__num">{{ openedIndex + 1 }}</span>
              </span>
              <h2 class="qsheet__title">{{ t(openedQuest.title) }}</h2>
              <button type="button" class="qsheet__close" :aria-label="t('hedgehogGuide.close')"
                      @click="openedQuest = null">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="3"
                     stroke-linecap="round">
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                </svg>
              </button>
            </div>
            <span v-if="openedQuest.isPerfect" class="qsheet__stamp">{{ t('locationQuests.done') }}</span>
            <span v-else-if="openedQuest.hasMistakes" class="qsheet__stamp qsheet__stamp--mistakes">
              {{ t('locationQuests.mistakes') }}
            </span>
            <p class="qsheet__desc">{{ t(openedQuest.description) }}</p>
            <div class="qsheet__rewards">
              <template v-if="!openedQuest.isSuccess">
                <span>{{ t('locationQuests.awards') }}</span>
                <span class="qsheet__reward">
                  {{ openedQuest.rewards.points }}
                  <img src="~/assets/images/article.svg" alt="" class="qsheet__coin">
                </span>
                <span class="qsheet__reward">{{ openedQuest.rewards.xp }} <span class="qsheet__xp">XP</span></span>
              </template>
              <template v-else>{{ t('locationQuests.gotAward') }} ✅</template>
            </div>
            <div class="qsheet__actions">
              <button type="button" class="qsheet__btn qsheet__btn--learn"
                      :data-track="'region_wordsLearn_clicked_' + openedQuest.questId"
                      @click="emitAndClose('learn')">
                📘 {{ t('locationWordSession.stuff') }}
              </button>
              <button v-if="openedQuest.isSuccess" type="button" class="qsheet__btn qsheet__btn--write"
                      :data-track="'region_write_clicked_' + openedQuest.questId"
                      @click="emitAndClose('write')">
                ✉️ {{ t('questPath.writeAction') }}
              </button>
              <button type="button" class="qsheet__btn qsheet__btn--start" :class="'qsheet__btn--' + openedNode.state"
                      :data-track="'region_startQuest_clicked_' + openedQuest.questId"
                      @click="emitAndClose('start')">
                <template v-if="openedQuest.hasMistakes">{{ t('locationQuests.repeatMistakes') }}</template>
                <template v-else-if="openedQuest.isPerfect">{{ t('locationQuests.repeat') }}</template>
                <template v-else>{{ t('locationQuests.start') }}</template>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onBeforeUnmount } from 'vue'
import { vibrateTap, vibrateError, vibrateSuccess } from '~/utils/haptics.js'
import { playLevelCompleted } from '~/utils/soundManager.js'
import CoinIcon from '~/assets/images/article.svg'
import VLandChest from '~/src/components/V-landChest.vue'

const props = defineProps({
  quests: { type: Array, required: true },
  region: { type: Object, default: null },
  // { [questId]: { done, total } } — фразы диктанта, написанные без ошибок
  writeProgress: { type: Object, default: () => ({}) },
  chestClaimed: { type: Boolean, default: false },
  chestReward: { type: Number, default: 10 }
})

const emit = defineEmits(['start', 'learn', 'write', 'claim-chest'])

const { t } = useI18n()

const HINT_MS = 2200

const shakingId = ref('')
const hintId = ref('')
const openedQuest = ref(null)
const openedIndex = ref(0)
const currentEl = ref(null)
let hintTimer = null

const currentIndex = computed(() => props.quests.findIndex(quest => !quest.isSuccess))

const nodes = computed(() => props.quests.map((quest, index) => {
  const progress = props.writeProgress[quest.questId] || { done: 0, total: 0 }
  let state = 'todo'
  if (quest.isPerfect) state = 'perfect'
  // ошибки бывают и у незасчитанного квеста — их тоже показываем, а не «текущим» синим
  else if (quest.isSuccess || quest.hasMistakes) state = 'mistakes'
  else if (index === currentIndex.value) state = 'current'
  return {
    quest,
    state,
    isCurrent: index === currentIndex.value,
    writeProgress: progress,
    writeDone: progress.total > 0 && progress.done >= progress.total
  }
}))

const doneCount = computed(() => props.quests.filter(quest => quest.isSuccess).length)
const writtenCount = computed(() => nodes.value.filter(node => node.writeDone).length)
const landComplete = computed(() =>
  props.quests.length > 0 && doneCount.value === props.quests.length && writtenCount.value === props.quests.length
)

const openedNode = computed(() => nodes.value[openedIndex.value] || { state: 'todo' })

// сундук: locked — земля не пройдена, ready — можно открыть, claimed — награда уже получена
// итоговый тест уровня: кнопка на вершине после её последнего квеста
const TEST_BY_SUMMIT = { 'a1-summit': 'A1', 'a2-summit': 'A2', 'wisdom-summit': 'B1' }
const locationTestLevel = computed(() => {
  const level = TEST_BY_SUMMIT[props.region?.id]
  return level && props.quests[props.quests.length - 1]?.isSuccess ? level : ''
})

const chestState = computed(() => {
  if (props.chestClaimed) return 'claimed'
  return landComplete.value ? 'ready' : 'locked'
})

const chestLabel = computed(() => ({
  locked: t('questPath.landGoal'),
  ready: t('questPath.chestReady'),
  claimed: t('questPath.chestClaimed')
})[chestState.value])

const STARS = [
  { id: 1, left: '12%', top: '18%', delay: '0s' },
  { id: 2, left: '84%', top: '14%', delay: '0.6s' },
  { id: 3, left: '20%', top: '70%', delay: '1.1s' },
  { id: 4, left: '78%', top: '64%', delay: '0.3s' },
  { id: 5, left: '50%', top: '10%', delay: '0.9s' },
  { id: 6, left: '90%', top: '40%', delay: '1.4s' },
  { id: 7, left: '6%', top: '44%', delay: '0.5s' }
]

const COUNT_MS = 900

const chestModal = ref(false)
const chestOpened = ref(false)
const rewardDone = ref(false)
const shownReward = ref(0)
const chestShaking = ref(false)
let countTimer = null

// монеты разлетаются веером вверх из сундука
const coins = computed(() => Array.from({ length: props.chestReward }, (_, index) => {
  const angle = (-160 + (140 / Math.max(1, props.chestReward - 1)) * index) * Math.PI / 180
  const distance = 110 + (index % 3) * 30
  return {
    id: index,
    tx: Math.round(Math.cos(angle) * distance) + 'px',
    ty: Math.round(Math.sin(angle) * distance) + 'px',
    rot: (index % 2 ? 1 : -1) * (180 + index * 40) + 'deg',
    delay: (index * 0.04).toFixed(2) + 's'
  }
}))

function onChestClick() {
  if (chestState.value === 'ready') {
    vibrateTap()
    chestOpened.value = false
    rewardDone.value = false
    shownReward.value = 0
    chestModal.value = true
    return
  }
  vibrateError()
  chestShaking.value = false
  nextTick(() => { chestShaking.value = true })
}

function openChest() {
  if (chestOpened.value) return
  chestOpened.value = true
  vibrateSuccess()
  playLevelCompleted()
  emit('claim-chest')

  const startedAt = performance.now()
  clearInterval(countTimer)
  countTimer = setInterval(() => {
    const progress = Math.min(1, (performance.now() - startedAt) / COUNT_MS)
    shownReward.value = Math.round(props.chestReward * progress)
    if (progress >= 1) {
      clearInterval(countTimer)
      rewardDone.value = true
    }
  }, 40)
}

function closeChest() {
  clearInterval(countTimer)
  chestModal.value = false
}

function openQuest(quest, index) {
  vibrateTap()
  openedIndex.value = index
  openedQuest.value = quest
}

function startQuest(quest) {
  vibrateTap()
  emit('start', quest)
}

function emitAndClose(action) {
  const quest = openedQuest.value
  openedQuest.value = null
  emit(action, quest)
}

function onWrite(node) {
  if (node.quest.isSuccess) {
    vibrateTap()
    emit('write', node.quest)
    return
  }
  vibrateError()
  shakingId.value = ''
  nextTick(() => { shakingId.value = node.quest.questId })
  clearTimeout(hintTimer)
  hintId.value = node.quest.questId
  hintTimer = setTimeout(() => { hintId.value = '' }, HINT_MS)
}

function scrollParent(el) {
  for (let node = el.parentElement; node; node = node.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(node).overflowY)) return node
  }
  return null
}

// при входе на землю список сам прокручивается к текущей печати.
// Не scrollIntoView: он двигает и страницу с overflow: hidden, и шапка с кнопкой «назад» уезжает
watch(currentEl, (el) => {
  const box = el && scrollParent(el)
  if (!box) return
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const elRect = el.getBoundingClientRect()
  const boxRect = box.getBoundingClientRect()
  const top = box.scrollTop + elRect.top - boxRect.top - (box.clientHeight - elRect.height) / 2
  box.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' })
}, { flush: 'post' })

onBeforeUnmount(() => {
  clearTimeout(hintTimer)
  clearInterval(countTimer)
})
</script>

<style scoped>
.land-test {
  display: block;
  margin: 16px 12px 8px;
  padding: 13px;
  border-radius: 50px;
  background: #6358ac;
  box-shadow: 0 5px 0 #4b4190;
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  text-align: center;
  text-decoration: none;
}

.passport {
  --ink: #4a2a12;
  --ink-soft: #a67c4e;
  display: flex;
  justify-content: center;
  flex: 1;
  min-height: 0;
  font-family: "Nunito", sans-serif;
  -webkit-tap-highlight-color: transparent;
}

/* страница паспорта: мягкая «пухлая» панель, как в мобильной игре */
.passport__page {
  position: relative;
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 12px 12px 0;
  border-radius: 30px;
  background: linear-gradient(180deg, #fffaf0 0%, #fbeccb 100%);
  box-shadow: inset 0 0 0 4px #f3d9a8,
  inset 0 3px 0 4px rgba(255, 255, 255, 0.7),
  0 8px 0 #c9955a,
  0 14px 26px rgba(0, 0, 0, 0.28);
  color: var(--ink);
}

/* прокручиваемая часть внутри обложки; края уходят под обложку мягко */
.passport__scroll {
  flex: 1;
  min-height: 0;
  margin: 0 -12px;
  padding: 6px 12px 28px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  -webkit-mask: linear-gradient(180deg, transparent 0, #000 14px, #000 calc(100% - 18px), transparent 100%);
  mask: linear-gradient(180deg, transparent 0, #000 14px, #000 calc(100% - 18px), transparent 100%);
}

.passport__scroll::-webkit-scrollbar {
  display: none;
}

.passport__head {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 5px 0 #ecd3a4;
}

.passport__photo {
  flex-shrink: 0;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: 18px;
  border: 3px solid #fff;
  box-shadow: 0 0 0 3px #f3c98a, 0 4px 0 3px #d9a35e;
}

.passport__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.passport__head-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.passport__caption {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.passport__land {
  font-family: "Fredoka", "Nunito", sans-serif;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
  color: var(--ink);
}

.passport__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.passport__chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 12px;
  font-family: "Fredoka", "Nunito", sans-serif;
  font-size: 14px;
  font-weight: 700;
}

.passport__chip--quests {
  background: #e4f6df;
  color: #3f8a33;
  box-shadow: 0 3px 0 #bfe3b6;
}

.passport__chip--write {
  background: #fff0db;
  color: #d67a00;
  box-shadow: 0 3px 0 #f5d3a4;
}

.passport__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.passport__row {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 136px minmax(0, 1fr);
  align-items: start;
  gap: 6px;
  padding-top: 16px;
}

/* дорожка из точек от квеста к материалу и письму */
.passport__row::before {
  content: '';
  position: absolute;
  top: 62px;
  left: 18%;
  right: 18%;
  height: 8px;
  background: radial-gradient(circle, #e6c89a 3.5px, transparent 4px) center / 14px 8px repeat-x;
}

.passport__side,
.passport__center {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* подписи — объёмные плашки, сразу видно, что это кнопки */
.passport__label {
  padding: 3px 10px;
  border-radius: 12px;
  font-family: "Fredoka", "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.passport__label--learn {
  background: #3d68f5;
  box-shadow: 0 3px 0 #2445b8;
}

.passport__label--write {
  background: #ff9600;
  box-shadow: 0 3px 0 #cc6f00;
}

.passport__label--fix,
.passport__label--go {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 16px;
  white-space: nowrap;
  border: none;
  font-size: 14px;
  text-transform: uppercase;
  cursor: pointer;
}

.passport__label--fix:active,
.passport__label--go:active {
  transform: translateY(3px);
  box-shadow: none;
}

.passport__label--go {
  background: #1cb0f6;
  box-shadow: 0 4px 0 #1287bf;
}

.passport__label--fix {
  background: #ff9600;
  box-shadow: 0 3px 0 #cc6f00;
}

.passport__label--locked {
  background: #b8c0cc;
  box-shadow: 0 3px 0 #8e98a8;
}

.passport__title {
  max-width: 130px;
  font-family: "Fredoka", "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  color: var(--ink);
}

/* название квеста всегда занимает две строки, а под ним — слот кнопки одной высоты,
   поэтому все ряды одинаковые по высоте */
.passport__center .passport__title {
  display: -webkit-box;
  padding: 0 6px;
  border-radius: 10px;
  /* цвет бумаги, чтобы дорожка не проходила сквозь текст */
  background: #fdf3dc;
  height: 36px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.passport__action {
  display: flex;
  justify-content: center;
  height: 34px;
}

/* отступ между рядами */
.passport__route {
  height: 26px;
  margin: 2px 0;
}

/* сплошная дорожка из точек от центра одного квеста до центра следующего (под кружками) */
.passport__item {
  position: relative;
}

.passport__item::after {
  content: '';
  position: absolute;
  top: 64px;
  bottom: -64px;
  left: 50%;
  width: 10px;
  margin-left: -5px;
  background: radial-gradient(circle, #e6c89a 4px, transparent 4.5px) center top / 10px 14px repeat-y;
}

.passport__item:last-child::after {
  bottom: -14px;
}

.passport__item--walked::after {
  background-image: radial-gradient(circle, #8fd17f 4px, transparent 4.5px);
}

/* подсказка под блоком письма: сверху её обрезает край прокрутки у первого квеста */
.passport__hint {
  position: absolute;
  top: calc(100% + 8px);
  inset-inline-end: 0;
  z-index: 5;
  width: max-content;
  max-width: 140px;
  padding: 7px 11px;
  border-radius: 14px;
  background: #1e272e;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.25;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

/* квест — круглая игровая кнопка с белой рамкой, цветным ободком и глянцем */
.visa {
  --stamp: #c9c1b1;
  --stamp-dark: #a39a88;
  position: relative;
  width: 96px;
  height: 96px;
  margin-bottom: 10px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform 0.12s ease;
}

.visa:focus {
  border: none;
}

.visa:active {
  transform: translateY(4px);
}

.visa__ring {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 50%;
  border: 4px solid #fff;
  background: #fff;
  box-shadow: 0 0 0 4px var(--stamp), 0 7px 0 4px var(--stamp-dark), 0 12px 16px 4px rgba(0, 0, 0, 0.18);
}

.visa__ring::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: radial-gradient(ellipse 70% 40% at 50% 8%, rgba(255, 255, 255, 0.55), transparent 70%);
  pointer-events: none;
}

.visa__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.visa__num {
  position: absolute;
  left: 50%;
  bottom: -14px;
  min-width: 32px;
  padding: 1px 9px;
  border-radius: 12px;
  border: 3px solid #fff;
  background: var(--stamp);
  box-shadow: 0 3px 0 var(--stamp-dark);
  color: #fff;
  font-family: "Fredoka", "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 700;
  transform: translateX(-50%);
}

.visa--todo .visa__img {
  filter: grayscale(1);
  opacity: 0.45;
}

.visa--current {
  --stamp: #1cb0f6;
  --stamp-dark: #1287bf;
}

.visa--perfect {
  --stamp: #6bba5e;
  --stamp-dark: #44883a;
}

.visa--mistakes {
  --stamp: #ff9600;
  --stamp-dark: #cc6f00;
}

/* актуальный квест слегка парит в воздухе, размер тот же */
.visa--active {
  animation: visa-float 3s ease-in-out infinite;
}

/* отметка о прохождении: галочка или «!» в углу */
.visa__badge {
  position: absolute;
  top: -6px;
  inset-inline-start: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid #fff;
  background: var(--stamp);
  box-shadow: 0 3px 0 var(--stamp-dark);
  color: #fff;
  font-family: "Fredoka", "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 700;
}

/* путеводитель — книжка с закладкой */
.guidebook {
  position: relative;
  width: 56px;
  height: 68px;
  margin-top: 16px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transform: rotate(-6deg);
  transition: transform 0.12s ease;
}

.guidebook:focus {
  border: none;
}

.guidebook:active {
  transform: rotate(-6deg) translateY(4px);
}

.guidebook__pages {
  position: absolute;
  top: 5px;
  bottom: 3px;
  right: -4px;
  width: 50px;
  border-radius: 0 8px 8px 0;
  background: repeating-linear-gradient(90deg, #fff 0 2px, #eadfca 2px 3px);
  box-shadow: 0 4px 0 #d8c39c;
}

.guidebook__cover {
  position: absolute;
  inset: 0 4px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px 12px 12px 6px;
  background: radial-gradient(ellipse 80% 35% at 55% 10%, rgba(255, 255, 255, 0.35), transparent 70%),
  linear-gradient(90deg, #2f55c8 0 9px, #4a74ff 9px);
  box-shadow: 0 5px 0 #2445b8;
}

.guidebook__cover::after {
  content: '';
  position: absolute;
  bottom: -9px;
  right: 12px;
  width: 9px;
  height: 15px;
  background: #ff4b4b;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%);
}

.guidebook__badge {
  margin-left: 8px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #ffc800;
  box-shadow: 0 2px 0 #e5a400;
  color: #fff;
  font-family: "Fredoka", "Nunito", sans-serif;
  font-size: 15px;
  font-weight: 700;
  line-height: 26px;
}

/* письмо: оранжевый блокнот на пружинке с карандашом, до прохождения квеста — серый с замком */
.postcard {
  --pad: #ff9600;
  --pad-dark: #cc6f00;
  position: relative;
  width: 58px;
  height: 68px;
  margin-top: 16px;
  padding: 0;
  border: none;
  border-radius: 10px;
  background: var(--pad);
  box-shadow: 0 5px 0 var(--pad-dark), 0 8px 14px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transform: rotate(6deg);
  transition: transform 0.12s ease;
}

.postcard:focus {
  border: none;
}

.postcard:active {
  transform: rotate(6deg) translateY(4px);
}

.postcard--blank {
  --pad: #c3cad5;
  --pad-dark: #9aa4b3;
}

/* кольца пружинки сверху */
.postcard__rings {
  position: absolute;
  top: -6px;
  left: 8px;
  right: 8px;
  z-index: 2;
  display: flex;
  justify-content: space-between;
}

.postcard__rings i {
  width: 6px;
  height: 13px;
  border-radius: 3px;
  background: linear-gradient(90deg, #8a94a3, #e8edf3 50%, #8a94a3);
}

/* лист в линейку */
.postcard__page {
  position: absolute;
  inset: 8px 5px 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 0 7px;
  border-radius: 6px;
  background: #fff;
}

.postcard__line {
  height: 3px;
  border-radius: 2px;
  background: #ffd9a6;
}

.postcard__line--short {
  width: 55%;
}

.postcard--blank .postcard__line {
  background: #e3e7ed;
}

/* карандаш, прислонённый к блокноту */
.postcard__pencil {
  position: absolute;
  right: -10px;
  bottom: 2px;
  z-index: 3;
  width: 10px;
  height: 40px;
  border-radius: 3px 3px 0 0;
  background: linear-gradient(180deg, #ff7aa2 0 6px, #d9d9d9 6px 10px, transparent 10px),
  linear-gradient(90deg, #ffd84d 0 50%, #f0b400 50%);
  transform: rotate(20deg);
  transform-origin: bottom center;
  filter: drop-shadow(0 2px 0 rgba(0, 0, 0, 0.2));
}

.postcard__pencil::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -9px;
  height: 18px;
  background: linear-gradient(180deg, #f5d0a0 0 60%, #4a2a12 60%);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}

.postcard__lock {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 3px 0 #d6c6a6;
  z-index: 2;
  color: #a0aec0;
  transform: translate(-50%, -50%);
}

/* марка на подписанной открытке */
.postcard__stamp {
  position: absolute;
  top: -10px;
  inset-inline-end: -10px;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid #fff;
  background: #ffc800;
  box-shadow: 0 3px 0 #e5a400;
  color: #fff;
  font-size: 14px;
}

.postcard--done {
  box-shadow: 0 5px 0 var(--pad-dark), 0 0 16px rgba(255, 200, 0, 0.75);
}

.postcard--shake {
  animation: passport-shake 0.4s ease;
}

/* сундук земли */
.land-chest {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.land-chest__btn {
  position: relative;
  width: 130px;
  padding: 0;
  border: none;
  background: none;
  -webkit-tap-highlight-color: transparent;
}

.land-chest__btn:focus {
  border: none;
}

.land-chest--ready .land-chest__btn {
  animation: chest-bounce 1.6s ease-in-out infinite;
}

.land-chest__btn--shake {
  animation: passport-shake 0.4s ease;
}

/* золотое свечение за сундуком, который ждёт открытия */
.land-chest__shine {
  position: absolute;
  inset: -18px -10px -4px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 214, 80, 0.75), rgba(255, 214, 80, 0) 68%);
  animation: chest-shine 1.6s ease-in-out infinite;
}

.land-chest__lock {
  position: absolute;
  left: 50%;
  top: 44%;
  font-size: 30px;
  transform: translate(-50%, -50%);
  filter: drop-shadow(0 2px 0 rgba(0, 0, 0, 0.2));
}

.passport__title--chest {
  max-width: 230px;
}

.land-chest--ready .passport__title--chest {
  color: #b86a00;
}

.land-chest__cta {
  padding: 10px 26px;
  border: none;
  border-radius: 56px;
  background: #ffc800;
  box-shadow: 0 5px 0 #e5a400;
  color: #6b3a17;
  font-family: "Nunito", sans-serif;
  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;
}

.land-chest__cta:active {
  transform: translateY(4px);
  box-shadow: 0 1px 0 #e5a400;
}

/* открытие сундука на весь экран */
.chest-modal {
  position: fixed;
  inset: 0;
  z-index: 19500;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 24px 16px calc(24px + env(safe-area-inset-bottom));
  overflow: hidden;
  background: radial-gradient(circle at 50% 45%, #3d2a6b 0%, #1d1238 60%, #120b24 100%);
  font-family: "Nunito", sans-serif;
  color: #fff;
}

/* лучи света, крутятся после открытия */
.chest-modal__rays {
  position: absolute;
  left: 50%;
  top: 48%;
  width: 160vmax;
  height: 160vmax;
  margin: -80vmax 0 0 -80vmax;
  background: repeating-conic-gradient(from 0deg, rgba(255, 220, 110, 0.16) 0deg 10deg, transparent 10deg 24deg);
  -webkit-mask: radial-gradient(circle, #000 0%, transparent 45%);
  mask: radial-gradient(circle, #000 0%, transparent 45%);
  opacity: 0;
  transform: scale(0.4);
  transition: opacity 0.5s ease, transform 0.7s cubic-bezier(0.3, 1.4, 0.5, 1);
  pointer-events: none;
}

.chest-modal__rays--on {
  opacity: 1;
  transform: scale(1);
  animation: chest-rays 14s linear infinite;
}

.chest-modal__star {
  position: absolute;
  color: #ffe27a;
  font-size: 18px;
  animation: chest-twinkle 1.8s ease-in-out infinite;
  pointer-events: none;
}

.chest-modal__chest {
  position: relative;
  width: min(62vw, 240px);
  /* место под откинутую крышку, чтобы она не закрывала заголовок */
  margin-top: 50px;
  padding: 0;
  border: none;
  background: none;
  animation: chest-drop 0.6s cubic-bezier(0.3, 1.6, 0.5, 1) both;
}

.chest-modal__chest:focus {
  border: none;
}

.chest-modal__chest--waiting :deep(.chest) {
  animation: chest-wobble 1.4s ease-in-out 0.6s infinite;
}

.chest-modal__chest--open :deep(.chest) {
  animation: chest-pop-open 0.45s ease-out;
}

/* монеты вылетают из сундука и падают */
.chest-modal__coin {
  position: absolute;
  left: 50%;
  top: 42%;
  width: 34px;
  height: 34px;
  margin: -17px 0 0 -17px;
  opacity: 0;
  animation: chest-coin 1.3s cubic-bezier(0.2, 0.7, 0.4, 1) forwards;
  pointer-events: none;
}

.chest-modal__hint {
  position: relative;
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  opacity: 0.85;
  animation: chest-hint 1.4s ease-in-out infinite;
}

.chest-modal__reward {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 54px;
  font-weight: 900;
  color: #ffe27a;
  text-shadow: 0 4px 0 #a8730f, 0 0 24px rgba(255, 214, 80, 0.6);
}

.chest-modal__reward-coin {
  width: 48px;
  height: 48px;
}

.chest-modal__take {
  position: relative;
  min-width: 220px;
  padding: 15px 30px;
  border: none;
  border-radius: 58px;
  background: #6bba5e;
  box-shadow: 0 6px 0 #44883a;
  color: #fff;
  font-family: "Nunito", sans-serif;
  font-size: 18px;
  font-weight: 900;
  text-transform: uppercase;
}

.chest-modal__take:active {
  transform: translateY(5px);
  box-shadow: 0 1px 0 #44883a;
}

.chest-fade-enter-active,
.chest-fade-leave-active {
  transition: opacity 0.3s ease;
}

.chest-fade-enter-from,
.chest-fade-leave-to {
  opacity: 0;
}

.chest-pop-enter-active {
  transition: transform 0.45s cubic-bezier(0.3, 1.7, 0.5, 1), opacity 0.2s ease;
}

.chest-pop-enter-from {
  opacity: 0;
  transform: scale(0.3);
}

/* шторка квеста */
.qsheet {
  position: fixed;
  inset: 0;
  z-index: 19000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
}

.qsheet__card {
  position: relative;
  width: 100%;
  max-width: 560px;
  padding: 10px 18px calc(18px + env(safe-area-inset-bottom));
  border-radius: 28px 28px 0 0;
  border-top: 4px solid #ffb100;
  background: var(--bg);
  color: var(--titleColor);
  font-family: "Nunito", sans-serif;
  animation: qsheet-up 0.3s ease-out;
}

.qsheet__grabber {
  display: block;
  width: 40px;
  height: 5px;
  margin: 0 auto 12px;
  border-radius: 3px;
  background: rgba(127, 127, 127, 0.45);
}

.qsheet__head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.qsheet__visa {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  cursor: default;
}

.qsheet__visa .visa__ring {
  border-width: 3px;
  box-shadow: 0 0 0 3px var(--stamp), 0 4px 0 3px var(--stamp-dark);
  animation: none;
}

.qsheet__visa .visa__num {
  bottom: -10px;
  min-width: 24px;
  padding: 0 6px;
  border-width: 2px;
  font-size: 12px;
}

.qsheet__title {
  flex: 1;
  margin: 0;
  font-size: 20px;
  font-weight: 900;
}

.qsheet__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(127, 127, 127, 0.16);
  color: var(--titleColor);
  cursor: pointer;
}

.qsheet__stamp {
  display: inline-block;
  margin-top: 14px;
  padding: 6px 12px;
  border-radius: 12px;
  background: #6bba5e;
  color: #fff;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 0 #44883a;
}

.qsheet__stamp--mistakes {
  background: #ff9600;
  box-shadow: 0 4px 0 #cc6f00;
}

.qsheet__desc {
  margin: 12px 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.qsheet__rewards {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 16px;
  background: #fff;
  border: 3px solid #e0dcdc;
  color: #1e272e;
  font-size: 15px;
  font-weight: 800;
}

.qsheet__reward {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.qsheet__coin {
  width: 22px;
  height: 22px;
}

.qsheet__xp {
  padding: 3px 6px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #a855f7);
  color: #fff;
  font-size: 11px;
  font-weight: 900;
}

.qsheet__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.qsheet__btn {
  padding: 13px;
  border: none;
  border-radius: 34px;
  color: #fff;
  font-family: "Nunito", sans-serif;
  font-size: 17px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.qsheet__btn:active {
  transform: translateY(4px);
  box-shadow: none !important;
}

.qsheet__btn--learn {
  background: linear-gradient(180deg, #5b82ff, #3d68f5);
  box-shadow: 0 5px 0 #1d3a8a;
}

.qsheet__btn--write {
  background: linear-gradient(180deg, #ffb04d, #ff9600);
  box-shadow: 0 5px 0 #cc6f00;
}

.qsheet__btn--start {
  background: linear-gradient(180deg, #6bba5e 0%, #47a14f 100%);
  box-shadow: 0 5px 0 #44883a;
}

.qsheet__btn--start.qsheet__btn--perfect {
  background: linear-gradient(180deg, #6a74a5 0%, #5d7fc1 100%);
  box-shadow: 0 5px 0 #4f6ca8;
}

.qsheet__btn--start.qsheet__btn--mistakes {
  background: linear-gradient(180deg, #ff82a9 0%, #e6517d 100%);
  box-shadow: 0 5px 0 #d64671;
}

.qsheet-fade-enter-active,
.qsheet-fade-leave-active {
  transition: opacity 0.25s ease;
}

.qsheet-fade-enter-from,
.qsheet-fade-leave-to {
  opacity: 0;
}

.passport-pop-enter-active,
.passport-pop-leave-active {
  transition: opacity 0.2s ease;
}

.passport-pop-enter-from,
.passport-pop-leave-to {
  opacity: 0;
}

@keyframes visa-float {
  0%, 100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -5px;
  }
}

@keyframes passport-shake {
  0%, 100% {
    translate: 0 0;
  }
  25% {
    translate: -6px 0;
  }
  50% {
    translate: 6px 0;
  }
  75% {
    translate: -4px 0;
  }
}

@keyframes chest-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes chest-shine {
  0%, 100% {
    opacity: 0.55;
    transform: scale(0.92);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

@keyframes chest-drop {
  from {
    opacity: 0;
    transform: translateY(-60vh) scale(0.6);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* сундук нетерпеливо подпрыгивает и качается, пока его не открыли */
@keyframes chest-wobble {
  0%, 55%, 100% {
    transform: none;
  }
  62% {
    transform: translateY(-10px) rotate(-6deg);
  }
  70% {
    transform: translateY(-10px) rotate(6deg);
  }
  78% {
    transform: translateY(-4px) rotate(-4deg);
  }
  86% {
    transform: rotate(2deg);
  }
}

@keyframes chest-pop-open {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.15, 0.88);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes chest-coin {
  0% {
    opacity: 1;
    transform: translate(0, 0) scale(0.4) rotate(0);
  }
  45% {
    opacity: 1;
    transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot));
  }
  100% {
    opacity: 0;
    transform: translate(var(--tx), calc(var(--ty) + 160px)) scale(0.8) rotate(var(--rot));
  }
}

@keyframes chest-rays {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
}

@keyframes chest-twinkle {
  0%, 100% {
    opacity: 0.2;
    transform: scale(0.7);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes chest-hint {
  0%, 100% {
    opacity: 0.55;
  }
  50% {
    opacity: 1;
  }
}

@keyframes qsheet-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .visa--active,
  .postcard--shake,
  .land-chest--ready .land-chest__btn,
  .land-chest__shine,
  .chest-modal__chest,
  .chest-modal__chest--waiting :deep(.chest),
  .chest-modal__rays--on,
  .chest-modal__star,
  .qsheet__card {
    animation: none;
  }
}

@media (max-width: 360px) {
  .visa {
    width: 84px;
    height: 84px;
  }

  .passport__row::before {
    top: 54px;
  }
}
</style>
