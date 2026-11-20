<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSeoMeta, useI18n, useLocalePath } from '#imports'
import VShowFall from '../V-showFall.vue'
import AdventCalendar from './winter/AdventCalendar.vue'
import WinterVillage from './winter/WinterVillage.vue'
import { useEventSessionStore } from '../../../store/eventsStore.js'

import Snow from 'assets/images/mery-christmas/Snow.svg'
import SnowCoin from 'assets/images/event-rewards/winter-event/winter-words/snowflake.svg'
import CalendarNavIcon from 'assets/images/event-rewards/winter-event/winter-words/calendar.svg'
import QuestsNavIcon from 'assets/images/event-rewards/winter-event/winter-words/christmas-stocking.svg'
import ShopNavIcon from 'assets/images/event-rewards/winter-event/winter-words/gift.svg'

import Hat from 'assets/images/event-rewards/winter-event/winter-rewards/santa-hat.svg'
import ChristmasBall from 'assets/images/event-rewards/winter-event/winter-rewards/christmas-ball.svg'
import ChristmasWreath from 'assets/images/event-rewards/winter-event/winter-rewards/christmas-wreath.svg'
import SnowEffectIcon from 'assets/images/event-rewards/winter-event/winter-rewards/SnowEffect.svg'

useSeoMeta({ robots: 'noindex, nofollow' })

const { t, locale } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const eventStore = useEventSessionStore()

const isReqModalOpen = ref(false)
const reqModalTitle = ref('')
const coins = ref(0)
const activeTab = ref('advent')
const questsProgress = ref({})

// Снежинки за окошко прибавляются к счётчику, только когда долетают до него
const pendingCoins = ref(0)
const displayedCoins = computed(() => Math.max(0, Math.round(coins.value - pendingCoins.value)))
function onCoinsPending(amount) {
  pendingCoins.value = amount
}
function onCoinsLanded() {
  const from = pendingCoins.value
  if (!from) return
  const start = performance.now()
  const duration = 900
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1)
    pendingCoins.value = from * (1 - progress)
    if (progress < 1) requestAnimationFrame(step)
    else pendingCoins.value = 0
  }
  requestAnimationFrame(step)
}

const eventId = computed(() => String(route.params.id || ''))
const isEventOpen = computed(() => eventStore.isEventActive(eventId.value))

// Заголовок на снегу под деревней меняется вместе с вкладкой
const bannerByTab = computed(() => ({
  advent: t('winterBanner.advent'),
  quests: t('winterBanner.quests'),
  reputation: t('winterBanner.shop')
}))
const bannerTitle = computed(() => bannerByTab.value[activeTab.value] || bannerByTab.value.advent)

// Окна деревни, загоревшиеся после последнего визита
const freshDays = ref([])

const navTabs = computed(() => ([
  { id: 'advent', label: t('adventCalendar.tab'), icon: CalendarNavIcon },
  { id: 'quests', label: t('eventPanel.questions'), icon: QuestsNavIcon },
  { id: 'reputation', label: t('eventPanel.shop'), icon: ShopNavIcon }
]))

const activeIndex = computed(() => navTabs.value.findIndex(tab => tab.id === activeTab.value))

const getTransformX = (index) => {
  if (index === -1) return 0
  if (locale.value === 'ar') return (navTabs.value.length - 1 - index) * 100
  return index * 100
}

const pathToMain = () => {
  router.push('/')
}

function setTab(tabId) {
  activeTab.value = tabId
}

const quests = ref([
  { id: 'quest-21', title: t('winterEventQuests.quest-21'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '💎' },
  { id: 'quest-22', title: t('winterEventQuests.quest-22'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🏆' },
  { id: 'quest-1', title: t('winterEventQuests.quest-1'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🎄' },
  { id: 'quest-2', title: t('winterEventQuests.quest-2'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🕯️' },
  { id: 'quest-3', title: t('winterEventQuests.quest-3'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🎅' },
  { id: 'quest-4', title: t('winterEventQuests.quest-4'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🌟' },
  { id: 'quest-5', title: t('winterEventQuests.quest-5'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🎁' },
  { id: 'quest-6', title: t('winterEventQuests.quest-6'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '📖' },
  { id: 'quest-7', title: t('winterEventQuests.quest-7'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '📅' },
  { id: 'quest-8', title: t('winterEventQuests.quest-8'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '👻' },
  { id: 'quest-9', title: t('winterEventQuests.quest-9'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '✨' },
  { id: 'quest-10', title: t('winterEventQuests.quest-10'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🏫' },
  { id: 'quest-11', title: t('winterEventQuests.quest-11'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🔗' },
  { id: 'quest-12', title: t('winterEventQuests.quest-12'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🧩' },
  { id: 'quest-13', title: t('winterEventQuests.quest-13'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🌍' },
  { id: 'quest-14', title: t('winterEventQuests.quest-14'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🔮' },
  { id: 'quest-15', title: t('winterEventQuests.quest-15'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '⛸️' },
  { id: 'quest-16', title: t('winterEventQuests.quest-16'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '❄️' },
  { id: 'quest-17', title: t('winterEventQuests.quest-17'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🔔' },
  { id: 'quest-18', title: t('winterEventQuests.quest-18'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🎀' },
  { id: 'quest-19', title: t('winterEventQuests.quest-19'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🎆' },
  { id: 'quest-20', title: t('winterEventQuests.quest-20'), rewardCoins: 10, isDone: false, hasErrors: false, icon: '🥨' }
])

// Задания разложены по главам: сначала слова праздника, потом история от Адвента к Новому году, финал после всех глав
const FINAL_QUEST_ID = 'quest-22'
const CHAPTERS = [
  { id: 'words', quests: ['quest-21'] },
  { id: 'advent', quests: ['quest-4', 'quest-3', 'quest-6', 'quest-11'] },
  { id: 'christmas', quests: ['quest-1', 'quest-2', 'quest-5', 'quest-17', 'quest-18'] },
  { id: 'silvester', quests: ['quest-7', 'quest-12', 'quest-19', 'quest-20'] },
  { id: 'winter', quests: ['quest-10', 'quest-15', 'quest-16'] },
  { id: 'legends', quests: ['quest-8', 'quest-9', 'quest-13', 'quest-14'] },
  { id: 'final', quests: [FINAL_QUEST_ID], isFinal: true }
]
const KIND_BY_STEP_TYPE = { 'multiple-choice': 'choice', reading: 'reading', matching: 'matching', 'choose-word': 'chooseWord' }
const KIND_ICON = { choice: '✅', reading: '📖', matching: '🧩', chooseWord: '✍️', pictures: '🖼️', final: '🏆' }

const isFinalOpen = computed(() => quests.value.every(q => q.id === FINAL_QUEST_ID || q.isDone))

// Задания проходятся строго по порядку глав: следующее открывается, когда пройдено предыдущее.
// Пройденные можно повторять. Порядок не зависит от дат, поэтому действует и в тестовом режиме
const QUEST_ORDER = CHAPTERS.flatMap(chapter => chapter.quests)

const chapters = computed(() => {
  const byId = Object.fromEntries(quests.value.map(q => [q.id, q]))
  const isQuestOpen = (id) => {
    // пройденное задание всегда можно повторить, даже если проходили не по нынешнему порядку
    if (byId[id]?.isDone) return true
    if (id === FINAL_QUEST_ID) return isFinalOpen.value
    const index = QUEST_ORDER.indexOf(id)
    return index <= 0 || !!byId[QUEST_ORDER[index - 1]]?.isDone
  }
  return CHAPTERS.map(chapter => {
    const list = chapter.quests.map(id => byId[id]).filter(Boolean)
      .map(quest => ({ ...quest, isLocked: !isQuestOpen(quest.id) }))
    const done = list.filter(q => q.isDone).length
    return {
      ...chapter,
      list,
      done,
      pct: list.length ? Math.round((done / list.length) * 100) : 0,
      // глава закрыта, пока не открыто ни одно её задание
      isLocked: list.length > 0 && list.every(q => q.isLocked)
    }
  })
})

// Подпись на карточке: что внутри задания и сколько там вопросов
function questKindLabel(quest) {
  const kind = quest.id === FINAL_QUEST_ID ? 'final' : quest.kind
  if (!kind || !quest.count) return ''
  return `${KIND_ICON[kind]} ${t(`winterChapters.kinds.${kind}`)} · ${t(`winterChapters.counts.${kind}`, { n: quest.count })}`
}

// Задание, которое нужно пройти следующим: первое непройденное по порядку
const nextQuest = computed(() => {
  const byId = Object.fromEntries(quests.value.map(q => [q.id, q]))
  return QUEST_ORDER.map(id => byId[id]).find(q => q && !q.isDone) || null
})

const isLockedSheetOpen = ref(false)

function openQuest(quest) {
  if (quest.isLocked) {
    isLockedSheetOpen.value = true
    return
  }
  goToSession(quest.id)
}

function goToNextQuest() {
  isLockedSheetOpen.value = false
  if (nextQuest.value) goToSession(nextQuest.value.id)
}

async function goToSession(questId) {
  await eventStore.start(eventId.value, String(questId))
  const to = localePath({ name: 'event-id-session', params: { id: route.params.id } })
  await router.push(to)
}

// Экономика: 22 задания x 10 + 24 окошка x 5 = 340 снежинок, весь магазин 310 (запас 10%)
const shopItemsList = ref([
  { id: 'santaHat', title: t('eventsShopItems.santaHat'), priceCoins: 50, isOwned: false, icon: Hat },
  { id: 'christmasBall', title: t('eventsShopItems.christmasBall'), priceCoins: 50, isOwned: false, icon: ChristmasBall },
  { id: 'christmasWreath', title: t('eventsShopItems.christmasWreath'), priceCoins: 60, isOwned: false, icon: ChristmasWreath },
  { id: 'snowFall', title: t('eventsShopItems.snowFall'), priceCoins: 150, minDoors: 18, isOwned: false, icon: SnowEffectIcon }
])

// Сколько окошек адвент-календаря уже открыто: снегопад доступен только после 18-го
const openedDoors = computed(() => Object.entries(questsProgress.value || {})
  .filter(([id, data]) => id.startsWith('advent-') && data?.finished).length)

function canBuyItem(item) {
  if (!item || item.isOwned) return false
  if (item.minDoors && openedDoors.value < item.minDoors) return false
  return coins.value >= item.priceCoins
}

async function buyReward(item) {
  if (!canBuyItem(item)) return
  coins.value -= item.priceCoins
  item.isOwned = true
  await eventStore.saveMainProgress({
    coins: coins.value,
    shopItems: { [item.id]: true }
  })
}

// Товар, для которого открыта шторка с условиями покупки
const reqItem = ref(null)

// Условия покупки с текущим прогрессом: снежинки и окошки календаря
const reqList = computed(() => {
  const item = reqItem.value
  if (!item) return []
  const list = [{ id: 'coins', iconImg: SnowCoin, label: t('winterShop.reqCoins'), have: coins.value, need: item.priceCoins }]
  if (item.minDoors) {
    list.push({ id: 'doors', icon: '🎄', label: t('winterShop.reqDoors'), have: openedDoors.value, need: item.minDoors })
  }
  return list.map(req => ({
    ...req,
    done: req.have >= req.need,
    pct: Math.min(100, Math.round((req.have / Math.max(req.need, 1)) * 100))
  }))
})

function openRequirementsModal(item) {
  reqItem.value = item
  reqModalTitle.value = item.title
  isReqModalOpen.value = true
}

function closeRequirementsModal() {
  isReqModalOpen.value = false
}

// Покупка прямо из шторки: кнопка активна, только когда выполнены все условия
const canBuyReqItem = computed(() => !!reqItem.value && canBuyItem(reqItem.value))
async function buyFromSheet() {
  if (!canBuyReqItem.value) return
  await buyReward(reqItem.value)
  closeRequirementsModal()
}

async function onRewardClick(item) {
  if (canBuyItem(item)) {
    await buyReward(item)
  } else {
    openRequirementsModal(item)
  }
}

async function refreshProgressBadges() {
  const progressData = await eventStore.loadEventProgress(eventId.value)
  if (!progressData) return

  coins.value = progressData.coins || 0
  questsProgress.value = progressData.quests || {}

  quests.value = quests.value.map(q => {
    const qData = questsProgress.value[q.id]
    const isDone = qData ? !!qData.finished : false
    const hasErrors = !isDone && !!qData && Array.isArray(qData.solvedSteps) && qData.solvedSteps.length > 0
    return { ...q, isDone, hasErrors }
  })

  const shopItems = progressData.shopItems || {}
  shopItemsList.value.forEach(item => {
    if (shopItems[item.id]) item.isOwned = true
  })
}

// Награды за задания берём из того же JSON, по которому они начисляются, чтобы на экране не было расхождений
async function syncQuestRewards() {
  try {
    const data = await $fetch('/events/event-winter.json')
    const byId = Object.fromEntries((data?.quests || []).map(q => [q.id, q]))
    quests.value = quests.value.map(q => {
      const source = byId[q.id]
      if (!source) return q
      const steps = source.steps || []
      return {
        ...q,
        rewardCoins: source.rewardCoins ?? q.rewardCoins,
        kind: steps.length && steps.every(step => step.image) ? 'pictures' : (KIND_BY_STEP_TYPE[steps[0]?.type] || null),
        count: steps.length
      }
    })
  } catch (e) {}
}

onMounted(() => {
  refreshProgressBadges()
  syncQuestRewards()
})
</script>

<template>
  <div v-if="isEventOpen" class="season-page">
    <div class="season__bg"></div>
    <div class="svg-snow" aria-hidden="true">
      <VShowFall :image="Snow"/>
    </div>
    <div class="season-container">
      <div class="compact-header">
        <button @click="pathToMain" type="button" class="btn-icon-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="#1f3a6b" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 class="page-title">{{ t('eventsNavNames.winter') }}</h1>
        <div class="stats-board">
          <div class="stat-item" data-coin-target>
            <div class="stat-value stat-value--coins">
              <img class="coin coin--header" :src="SnowCoin" alt="">
              <div class="coin__value">{{ displayedCoins }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="scrollable-view">
        <WinterVillage class="season-village" :quests-progress="questsProgress" :fresh-days="freshDays"
                       :title="bannerTitle"/>
        <nav class="mobile-nav" role="tablist">
          <div class="sliding-bg" :style="{ transform: `translateX(${getTransformX(activeIndex)}%)` }"></div>
          <button
              v-for="tab in navTabs"
              :key="tab.id"
              class="mobile-nav__btn"
              :class="{ 'mobile-nav__btn--active': activeTab === tab.id }"
              role="tab"
              @click="setTab(tab.id)"
          >
            <img class="coin" :src="tab.icon" alt="">
            <span class="tab-label">{{ tab.label }}</span>
          </button>
        </nav>
        <div class="scroll_sections">
          <section v-if="activeTab === 'advent'">
            <AdventCalendar :quests-progress="questsProgress" @start="goToSession" @coins-pending="onCoinsPending"
                            @coins-landed="onCoinsLanded"
                            @fresh-windows="freshDays = $event"/>
          </section>
          <section v-if="activeTab === 'reputation'">
            <div class="cards">
              <div v-for="reward in shopItemsList" :key="reward.id" class="prize-card achv-card">
                <div class="prize-card__icon">
                  <img :src="reward.icon" alt="">
                </div>
                <div class="prize-card__body">
                  <div class="prize-card__title">{{ reward.title }}</div>
                  <div v-if="reward.minDoors && !reward.isOwned" class="prize-card__rank">
                    {{ t('winterShop.doorsProgress', { done: Math.min(openedDoors, reward.minDoors), need: reward.minDoors }) }}
                  </div>
                  <div class="prize-card__actions">
                    <div class="price">
                      <img class="coin" :src="SnowCoin" alt="">
                      <span class="price__value">{{ reward.priceCoins }}</span>
                    </div>
                    <button class="btn btn--candy" :disabled="reward.isOwned" @click="onRewardClick(reward)">
                      <template v-if="reward.isOwned">{{ t('eventPanel.bought') }}</template>
                      <template v-else>{{ t('eventPanel.buy') }}</template>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section v-if="activeTab === 'quests'" class="chapters">
            <div v-for="chapter in chapters" :key="chapter.id"
                 :class="['chapter', { 'is-done': chapter.done === chapter.list.length, 'is-locked': chapter.isLocked }]">
              <div class="chapter__head">
                <svg v-if="chapter.isFinal" class="chapter__deco" viewBox="0 0 40 40" aria-hidden="true">
                  <polygon points="20,3 25,15 38,15 27.5,23 31.5,36 20,28 8.5,36 12.5,23 2,15 15,15"
                           fill="#ffd45e" stroke="#e0a526" stroke-width="2" stroke-linejoin="round"/>
                </svg>
                <svg v-else class="chapter__deco" viewBox="0 0 40 40" aria-hidden="true">
                  <path d="M20,22 C14,22 8,18 3,19 C6,15 6,11 4,7 C9,9 13,8 16,5 C17,10 20,15 20,22 Z" fill="#2f8a4f"/>
                  <path d="M20,22 C26,22 32,18 37,19 C34,15 34,11 36,7 C31,9 27,8 24,5 C23,10 20,15 20,22 Z" fill="#3aa76d"/>
                  <path d="M20,22 L11,10 M20,22 L29,10" stroke="#1d5e33" stroke-width="1.2" fill="none"/>
                  <circle cx="16" cy="25" r="4.5" fill="#d8463f"/>
                  <circle cx="24" cy="25" r="4.5" fill="#e2463d"/>
                  <circle cx="20" cy="30" r="4.5" fill="#c43a33"/>
                  <circle cx="14.6" cy="23.6" r="1.3" fill="#ffffff" opacity="0.7"/>
                  <circle cx="22.6" cy="23.6" r="1.3" fill="#ffffff" opacity="0.7"/>
                  <circle cx="18.6" cy="28.6" r="1.3" fill="#ffffff" opacity="0.7"/>
                </svg>
                <div class="chapter__info">
                  <div class="chapter__title">{{ t(`winterChapters.${chapter.id}`) }}</div>
                  <div v-if="chapter.isLocked" class="chapter__hint">
                    {{ chapter.isFinal ? t('winterChapters.finalLocked') : t('winterChapters.chapterLocked') }}
                  </div>
                </div>
                <span class="chapter__count">{{ chapter.done }} / {{ chapter.list.length }}</span>
              </div>
              <div class="quests">
                <div v-for="(quest, qi) in chapter.list" :key="quest.id" :class="['quest', 'achv-card', `--v${qi % 4}`, { 'is-locked': quest.isLocked }]">
                  <div class="quest__icon"><span class="quest__emoji">{{ quest.icon }}</span></div>
                  <div class="quest__body">
                    <div class="quest__title" :class="{ clickable: !quest.isLocked }" @click="openQuest(quest)">
                      {{ quest.title }}
                    </div>
                    <div v-if="questKindLabel(quest)" class="quest__kind">{{ questKindLabel(quest) }}</div>
                    <div class="quest__meta">
                      <div class="quest__inner">
                        <span class="meta__pill --coins">{{ quest.rewardCoins }} <img class="meta__coin" :src="SnowCoin" alt=""></span>
                      </div>
                      <button
                          :class="['btn', 'btn--candy', { 'btn--repeat': quest.isDone, 'btn--errors': quest.hasErrors }]"
                          @click="openQuest(quest)"
                      >
                        {{ quest.isDone ? t('eventPanel.repeat') : (quest.hasErrors ? t('eventPanel.errors') : t('eventPanel.execute')) }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <transition name="sheet">
        <div v-if="isLockedSheetOpen" class="req-modal" @click.self="isLockedSheetOpen = false">
          <div class="req-modal__card">
            <div class="req-modal__head">
              <button class="req-modal__close" type="button" :aria-label="t('adventCalendar.close')"
                      @click="isLockedSheetOpen = false">
                <img :src="SnowCoin" alt="">
              </button>
            </div>
            <div class="req-modal__bauble">
              <span class="req-modal__bauble-cap"></span>
              <span class="lock-sheet__emoji">{{ nextQuest?.icon || '🎄' }}</span>
            </div>
            <div class="req-modal__title">{{ t('winterChapters.lockedTitle', { title: nextQuest?.title || '' }) }}</div>
            <button v-if="nextQuest" class="req-modal__btn" type="button" @click="goToNextQuest">
              {{ t('winterChapters.lockedGo') }}
            </button>
          </div>
        </div>
      </transition>
      <transition name="sheet">
        <div v-if="isReqModalOpen && reqItem" class="req-modal" @click.self="closeRequirementsModal">
          <div class="req-modal__card">
            <div class="req-modal__head">
              <button class="req-modal__close" type="button" :aria-label="t('adventCalendar.close')"
                      @click="closeRequirementsModal">
                <img :src="SnowCoin" alt="">
              </button>
            </div>
            <div class="req-modal__bauble">
              <span class="req-modal__bauble-cap"></span>
              <img :src="reqItem.icon" alt="">
            </div>
            <div class="req-modal__title">{{ reqModalTitle }}</div>
            <ul class="req-list">
              <li v-for="req in reqList" :key="req.id" :class="['req-list__item', { 'is-done': req.done }]">
                <span class="req-list__icon"><img v-if="req.iconImg" :src="req.iconImg" alt=""><template v-else>{{ req.icon }}</template></span>
                <div class="req-list__body">
                  <div class="req-list__row">
                    <span class="req-list__label">{{ req.label }}</span>
                    <span class="req-list__value">{{ Math.min(req.have, req.need) }} / {{ req.need }}</span>
                  </div>
                  <div class="req-list__bar"><span :style="{ width: req.pct + '%' }"></span></div>
                </div>
                <span class="req-list__state">{{ req.done ? '✓' : '' }}</span>
              </li>
            </ul>
            <button class="req-modal__btn" type="button" :disabled="!canBuyReqItem" @click="buyFromSheet">
              {{ t('eventPanel.buy') }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
  <div v-else class="event-closed">
    <div class="closed-content">
      <h1>🔒 {{ t('eventPanel.notAllowedTitle') }}</h1>
      <p>{{ t('eventPanel.notAllowedText') }}</p>
      <button @click="pathToMain" class="btn btn--home">{{ t('eventPanel.pathMain') }}</button>
    </div>
  </div>
</template>

<style scoped>
.season-page {
  /* Высота экрана минус системные полосы телефона (в приложении у .layout есть отступы --sat/--sab),
     иначе страница выше доступного места и прокручивается вся вместе с шапкой */
  height: calc(100vh - var(--sat, 0px) - var(--sab, 0px));
  height: calc(100dvh - var(--sat, 0px) - var(--sab, 0px));
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  font-family: "Nunito", sans-serif;
  -webkit-tap-highlight-color: transparent;
}

.season__bg {
  position: fixed;
  inset: 0;
  background: #0e1f40 url('/images/backgoundSnow.webp') no-repeat center center;
  background-size: cover;
  z-index: 0;
}

.season-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 1;
}

.svg-snow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.compact-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 5px 10px;
  flex-shrink: 0;
  z-index: 10;
}

/* Кнопка назад в морозном стиле: по просьбе только на зимнем ивенте */
.btn-icon-back {
  background: rgb(255 255 255 / 60%);
  border: 2px solid rgb(255 255 255 / 85%);
  box-shadow: 0 4px 0 rgb(31 58 107 / 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 12px;
  width: 40px;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn-icon-back:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 transparent;
}

.achv-card {
  border-radius: 16px;
  padding: 10px 14px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgb(255 255 255 / 55%);
  border: 2px solid rgb(255 255 255 / 75%);
  box-shadow: 0 4px 0 rgb(31 58 107 / 0.12);
}

/* Название ивента между кнопкой назад и счётчиком, как заголовки на других страницах */
.page-title {
  min-width: 0;
  margin: 0 0 0 5px;
  font-family: "Nunito", sans-serif;
  font-size: 23px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #1f3a6b;
  text-shadow: 0 1px #1f3a6b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stats-board {
  display: flex;
  align-items: center;
  justify-content: end;
  flex: 1;
  padding: 0 6px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 50px;
  margin-left: 10px;
  background: rgb(255 255 255 / 55%);
  border: 2px solid rgb(255 255 255 / 75%);
  box-shadow: 0 4px 0 rgb(31 58 107 / 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.stat-item.is-bump {
  animation: coinBump 0.6s ease-out;
}

@keyframes coinBump {
  0%, 100% { transform: scale(1); }
  35% { transform: scale(1.25); box-shadow: 0 0 14px rgb(160 220 255 / 0.9); }
}

.stat-value {
  color: #1f3a6b;
  font-family: "Lilita One", sans-serif;
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.scrollable-view {
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.scroll_sections {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  /* запас под последним элементом плюс высота системной полосы телефона: последний ряд всегда над ней,
     даже на устройствах, где общий отступ приложения не сработал */
  padding-bottom: calc(32px + env(safe-area-inset-bottom, 0px));
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.scroll_sections::-webkit-scrollbar {
  display: none;
}

.season-village {
  margin-bottom: 14px;
}

.coin {
  width: 22px;
}

/* Снежинка в счётчике шапки: крупнее и ближе к числу (.coin общий с иконками вкладок) */
.stat-value--coins {
  gap: 3px;
}

.coin--header {
  width: 30px;
  height: 30px;
}

.coin__value {
  font-size: 22px;
  font-family: "Lilita One", sans-serif;
}

.mobile-nav {
  display: flex;
  position: relative;
  justify-content: space-between;
  background: rgb(255 255 255 / 55%);
  border-radius: 40px;
  padding: 6px;
  border: 2px solid rgb(255 255 255 / 75%);
  box-shadow: 0 4px 0 rgb(31 58 107 / 0.12);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  margin: 0 0 10px 0;
  flex-shrink: 0;
}

.sliding-bg {
  position: absolute;
  top: 5px;
  bottom: 6px;
  left: 6px;
  width: calc((100% - 12px) / 3);
  background: linear-gradient(180deg, #3aa76d, #2b8a57);
  box-shadow: 0 3px 0 #1f6b42;
  border-radius: 30px;
  transition: transform 0.4s cubic-bezier(0.34, 1.35, 0.64, 1);
  z-index: 1;
}

.mobile-nav__btn {
  border: none;
  background: none;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 7px 0;
  cursor: pointer;
  position: relative;
  z-index: 2;
  min-width: 0;
}

.tab-label {
  font-size: 17px;
  font-weight: 600;
  color: #4a5f86;
  transition: color 0.2s;
  font-family: "Fredoka", "Nunito", sans-serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mobile-nav__btn--active .tab-label {
  color: #fff;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prize-card {
  display: flex;
  align-items: center;
  gap: 12px;
}

.prize-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border: 2px solid rgb(255 255 255 / 80%);
  background: rgb(255 255 255 / 55%);
  padding: 8px;
  border-radius: 20px;
}

.prize-card__icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.prize-card__body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.prize-card__title {
  font-size: 17px;
  color: #1f3a6b;
  font-family: "Fredoka", "Nunito", sans-serif;
  font-weight: 600;
}

.prize-card__rank {
  font-size: 12px;
  color: #5b7bd5;
  font-weight: 700;
}

.prize-card__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.price {
  display: flex;
  align-items: center;
  padding: 4px 6px;
}

.price__value {
  margin-left: 4px;
  color: #1f3a6b;
  font-weight: 900;
  font-size: 15px;
}

.quests {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Карточки заданий как подарки из календаря: слева обёртка с узором, лентой и снегом, на ней бирка с иконкой */
.quest {
  --box: #d8463f;
  --box-dark: #a3241f;
  --ribbon: #ffd45e;
  --pattern: repeating-linear-gradient(45deg, rgb(255 255 255 / 0.10) 0 6px, transparent 6px 14px);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 0 12px 0 0;
  border-radius: 20px;
  background: rgb(255 255 255 / 82%);
}

.quest.--v1 {
  --box: #2f8a4f;
  --box-dark: #1d5e33;
  --ribbon: #e2463d;
  --pattern: radial-gradient(circle, rgb(255 255 255 / 0.22) 2px, transparent 2.5px) 0 0 / 12px 12px;
}

.quest.--v2 {
  --box: #e9a92c;
  --box-dark: #b5850f;
  --ribbon: #d8463f;
  --pattern: repeating-linear-gradient(90deg, rgb(255 255 255 / 0.14) 0 4px, transparent 4px 12px);
}

.quest.--v3 {
  --box: #3f6db8;
  --box-dark: #284d8c;
  --ribbon: #ffffff;
  --pattern: radial-gradient(circle, rgb(255 255 255 / 0.35) 1.5px, transparent 2px) 0 0 / 10px 10px;
}

.quest__icon {
  position: relative;
  flex-shrink: 0;
  width: 80px;
  min-height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  background:
    linear-gradient(180deg, transparent calc(50% - 5px), var(--ribbon) calc(50% - 5px), var(--ribbon) calc(50% + 5px), transparent calc(50% + 5px)),
    var(--pattern),
    linear-gradient(180deg, var(--box), var(--box-dark));
  box-shadow: inset -3px 0 0 rgb(0 0 0 / 0.08);
}

/* Снежная шапка на обёртке */
.quest__icon::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 9px;
  background: radial-gradient(circle at 7px 0, #ffffff 7px, transparent 7.5px) 0 0 / 14px 9px repeat-x;
  filter: drop-shadow(0 1px 0 rgb(31 58 107 / 0.12));
}

/* Бирка с иконкой посередине ленты */
.quest__icon::after {
  content: '';
  position: absolute;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px dashed var(--box);
  box-shadow: 0 3px 0 rgb(0 0 0 / 0.15);
}

.quest__emoji {
  position: relative;
  z-index: 1;
  line-height: 1;
}

.quest__body {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 10px 0;
}

.quest__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f3a6b;
  font-family: "Fredoka", "Nunito", sans-serif;
}

/* Что внутри задания: тип и количество */
.quest__kind {
  font-size: 12px;
  font-weight: 700;
  color: #5b6f96;
  margin-bottom: 4px;
}

/* Главы заданий */
.chapters {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.chapter__head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 0 4px;
}

.chapter__deco {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  filter: drop-shadow(0 2px 0 rgb(31 58 107 / 0.15));
}

.chapter__info {
  flex: 1;
  min-width: 0;
}

.chapter__title {
  font-family: "Lilita One", sans-serif;
  font-size: 20px;
  letter-spacing: 0.4px;
  color: #1f3a6b;
  text-shadow: 0 2px 0 rgb(255 255 255 / 0.8);
  line-height: 1.15;
}

.chapter__hint {
  font-size: 12px;
  font-weight: 700;
  color: #5b6f96;
}

.chapter__count {
  flex-shrink: 0;
  font-family: "Lilita One", sans-serif;
  font-size: 15px;
  color: #ffffff;
  background: linear-gradient(180deg, #3aa76d, #2b8a57);
  box-shadow: 0 3px 0 #1f6b42;
  border-radius: 50px;
  padding: 3px 11px;
}

.chapter.is-locked .chapter__count {
  background: #c7d2e6;
  box-shadow: 0 3px 0 #a3b1cc;
}


.quest__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.quest__inner {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta__coin {
  width: 17px;
  height: 17px;
  vertical-align: -1px;
}

.meta__pill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  border-radius: 50px;
  padding: 3px 9px;
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
}


.meta__pill.--coins {
  color: #1f5f9e;
  background: #dcefff;
  font-size: 14px;
  gap: 4px;
}

.btn {
  border-radius: 50px;
  padding: 6px 14px;
  cursor: pointer;
  min-width: 120px;
  text-transform: uppercase;
  text-align: center;
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  font-weight: 800;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn:active {
  transform: translateY(2px);
  box-shadow: none !important;
}

.btn--candy {
  background: linear-gradient(180deg, #3aa76d, #2b8a57);
  color: #ffffff;
  font-size: 13px;
  border: none;
  box-shadow: 0 3px #1f6b42;
  text-shadow: 0 1px 0 rgb(0 0 0 / 0.15);
}

.btn--candy:disabled {
  background: #e3e9f3;
  color: #8a9abf;
  text-shadow: none;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.btn--repeat {
  background: rgb(255 255 255 / 75%);
  color: #237a4b;
  box-shadow: 0 3px rgb(31 58 107 / 0.15);
  text-shadow: none;
}

.btn--errors {
  background: #d32f2f;
  color: #fff;
  box-shadow: 0 4px #7f1d1d;
}

.clickable {
  cursor: pointer;
}

.event-closed {
  height: calc(100dvh - var(--sat, 0px) - var(--sab, 0px));
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0e1f40;
  color: #d6e6ff;
}

.closed-content {
  text-align: center;
  padding: 40px;
  margin: 20px;
}

.closed-content h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #ffd45e;
}

.closed-content p {
  margin-bottom: 30px;
  font-size: 1.2rem;
}

.btn--home {
  background: #c9433b;
  color: #fff;
  border: none;
  box-shadow: 0 6px 0 #8e2a24;
  padding: 12px 20px;
}

/* Условия покупки: нижняя шторка в стиле карточки дня календаря */
.req-modal {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(8, 16, 36, 0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.req-modal__card {
  position: relative;
  width: 100%;
  max-width: 560px;
  max-height: calc(100dvh - 24px);
  overflow-y: auto;
  overscroll-behavior: contain;
  background: linear-gradient(180deg, #1f3c73 0%, #152b55 100%);
  border-top: 3px solid #3aa76d;
  border-radius: 26px 26px 0 0;
  padding: 26px 16px calc(20px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.35);
}

.req-modal__card::before {
  content: '';
  position: absolute;
  top: 9px;
  left: 50%;
  transform: translateX(-50%);
  width: 44px;
  height: 5px;
  border-radius: 3px;
  background: rgb(255 255 255 / 0.3);
}

.req-modal__head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}


.req-modal__bauble {
  position: relative;
  width: 116px;
  height: 116px;
  margin-top: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffffff 0%, #e3f0ff 45%, #b9d3f5 100%);
  box-shadow: 0 0 0 4px rgb(255 255 255 / 0.15), 0 0 26px rgb(143 211 255 / 0.45), inset -8px -10px 18px rgb(31 58 107 / 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}

.req-modal__bauble img {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.req-modal__bauble-cap {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 13px;
  border-radius: 4px 4px 2px 2px;
  background: linear-gradient(90deg, #8a94a8, #e6ebf3 45%, #8a94a8);
}

.lock-sheet__emoji {
  position: relative;
  font-size: 40px;
  line-height: 1;
}


.req-modal__title {
  font-family: "Fredoka", "Nunito", sans-serif;
  font-weight: 600;
  font-size: 24px;
  color: #ffffff;
}

.req-list {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.req-list__item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgb(255 255 255 / 0.1);
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: 16px;
  padding: 10px 12px;
  text-align: left;
}

.req-list__item.is-done {
  background: rgb(58 167 109 / 0.2);
  border-color: rgb(126 224 154 / 0.4);
}

.req-list__icon {
  font-size: 20px;
  width: 26px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.req-list__icon img {
  width: 22px;
  height: 22px;
}

.req-list__body {
  flex: 1;
  min-width: 0;
}

.req-list__row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.req-list__label {
  color: #ffffff;
  font-weight: 700;
}

.req-list__value {
  color: #c9d6f2;
  font-weight: 800;
  white-space: nowrap;
}

.req-list__bar {
  height: 6px;
  border-radius: 3px;
  background: rgb(255 255 255 / 0.15);
  overflow: hidden;
}

.req-list__bar span {
  display: block;
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #6bd3ff, #a8f0c6);
}

.req-list__item.is-done .req-list__bar span {
  background: #3aa76d;
}

.req-list__state {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 13px;
  color: #fff;
  border: 2px solid rgb(255 255 255 / 0.3);
}

.req-list__item.is-done .req-list__state {
  background: #3aa76d;
  border-color: #3aa76d;
}

.sheet-enter-active, .sheet-leave-active { transition: opacity 0.3s ease; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-active .req-modal__card { transition: transform 0.38s cubic-bezier(0.22, 1, 0.36, 1); }
.sheet-leave-active .req-modal__card { transition: transform 0.25s ease-in; }
.sheet-enter-from .req-modal__card, .sheet-leave-to .req-modal__card { transform: translateY(100%); }

.req-modal__close {
  border: none;
  background: none;
  width: 42px;
  height: 42px;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.3s;
}

.req-modal__close img {
  width: 100%;
  height: 100%;
}

.req-modal__close:hover {
  transform: rotate(90deg);
}

.req-modal__btn {
  width: 100%;
  margin-top: 4px;
  border: none;
  border-radius: 50px;
  padding: 14px;
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-family: "Nunito", sans-serif;
  color: #fff;
  background: linear-gradient(180deg, #3aa76d, #2b8a57);
  box-shadow: 0 4px 0 #1f6b42;
  cursor: pointer;
}

.req-modal__btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: none;
}

.req-modal__btn:disabled {
  background: rgb(255 255 255 / 0.14);
  color: rgb(255 255 255 / 0.5);
  box-shadow: none;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }

  .tab-label {
    font-size: 14px;
  }
}
</style>
