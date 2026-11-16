<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSeoMeta, useI18n, useLocalePath } from '#imports'
import VShowFall from '../V-showFall.vue'
import AdventCalendar from './winter/AdventCalendar.vue'
import { useEventSessionStore } from '../../../store/eventsStore.js'

import Snow from 'assets/images/mery-christmas/Snow.svg'
import Present from 'assets/images/mery-christmas/Present.svg'
import SnowCoin from 'assets/images/event-rewards/winter-event/winter-words/snowflake.svg'
import CalendarNavIcon from 'assets/images/event-rewards/winter-event/winter-words/calendar.svg'
import QuestsNavIcon from 'assets/images/event-rewards/winter-event/winter-words/christmas-stocking.svg'
import ShopNavIcon from 'assets/images/event-rewards/winter-event/winter-words/gift.svg'
import SantaBanner from 'assets/images/event-rewards/winter-event/winter-rewards/Santa-icon.svg'
import ElfBanner from 'assets/images/event-rewards/winter-event/winter-rewards/elf-icon.svg'

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
const reputationPoints = ref(0)
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

const bannerByTab = computed(() => ({
  advent: { text: t('winterBanner.advent'), icon: Present },
  quests: { text: t('winterBanner.quests'), icon: SantaBanner },
  reputation: { text: t('winterBanner.shop'), icon: ElfBanner }
}))
const banner = computed(() => bannerByTab.value[activeTab.value] || bannerByTab.value.advent)

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

const ranks = computed(() => ([
  { level: 1, need: 0, title: t('eventPanel.firstReputationWinter') },
  { level: 2, need: 1000, title: t('eventPanel.secondReputationWinter') }
]))

const currentLevel = computed(() => {
  let lvl = 1
  for (const rank of ranks.value) {
    if (reputationPoints.value >= rank.need) lvl = rank.level
  }
  return lvl
})

const levelStart = computed(() => ranks.value[currentLevel.value - 1]?.need ?? 0)
const nextNeed = computed(() => ranks.value[currentLevel.value]?.need ?? ranks.value.at(-1)?.need ?? 0)
const levelTotal = computed(() => Math.max(nextNeed.value - levelStart.value, 1))
const levelCurrent = computed(() => Math.max(reputationPoints.value - levelStart.value, 0))

const levelProgressText = computed(() => {
  const maxRep = ranks.value.at(-1)?.need ?? 0
  if (reputationPoints.value >= maxRep) return `${maxRep} / ${maxRep}`
  return `${levelCurrent.value} / ${levelTotal.value}`
})

const quests = ref([
  { id: 'quest-21', title: t('winterEventQuests.quest-21'), rewardCoins: 10, rewardRep: 25, isDone: false, hasErrors: false, icon: '💎' },
  { id: 'quest-1', title: t('winterEventQuests.quest-1'), rewardCoins: 10, rewardRep: 25, isDone: false, hasErrors: false, icon: '🎄' },
  { id: 'quest-2', title: t('winterEventQuests.quest-2'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🕯️' },
  { id: 'quest-3', title: t('winterEventQuests.quest-3'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🎅' },
  { id: 'quest-4', title: t('winterEventQuests.quest-4'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🌟' },
  { id: 'quest-5', title: t('winterEventQuests.quest-5'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🎁' },
  { id: 'quest-6', title: t('winterEventQuests.quest-6'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '📖' },
  { id: 'quest-7', title: t('winterEventQuests.quest-7'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '📅' },
  { id: 'quest-8', title: t('winterEventQuests.quest-8'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '👻' },
  { id: 'quest-9', title: t('winterEventQuests.quest-9'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '✨' },
  { id: 'quest-10', title: t('winterEventQuests.quest-10'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🏫' },
  { id: 'quest-11', title: t('winterEventQuests.quest-11'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🔗' },
  { id: 'quest-12', title: t('winterEventQuests.quest-12'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🧩' },
  { id: 'quest-13', title: t('winterEventQuests.quest-13'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🌍' },
  { id: 'quest-14', title: t('winterEventQuests.quest-14'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🔮' },
  { id: 'quest-15', title: t('winterEventQuests.quest-15'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '⛸️' },
  { id: 'quest-16', title: t('winterEventQuests.quest-16'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '❄️' },
  { id: 'quest-17', title: t('winterEventQuests.quest-17'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🔔' },
  { id: 'quest-18', title: t('winterEventQuests.quest-18'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🎀' },
  { id: 'quest-19', title: t('winterEventQuests.quest-19'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🎆' },
  { id: 'quest-20', title: t('winterEventQuests.quest-20'), rewardCoins: 10, rewardRep: 50, isDone: false, hasErrors: false, icon: '🥨' }
])

async function goToSession(questId) {
  await eventStore.start(eventId.value, String(questId))
  const to = localePath({ name: 'event-id-session', params: { id: route.params.id } })
  await router.push(to)
}

// Экономика: 21 задание x 10 + 24 окошка x 5 = 330 снежинок, весь магазин 300 (запас 10%)
const shopItemsList = ref([
  { id: 'santaHat', title: t('eventsShopItems.santaHat'), priceCoins: 50, level: 1, isOwned: false, icon: Hat },
  { id: 'christmasBall', title: t('eventsShopItems.christmasBall'), priceCoins: 50, level: 1, isOwned: false, icon: ChristmasBall },
  { id: 'christmasWreath', title: t('eventsShopItems.christmasWreath'), priceCoins: 60, level: 1, isOwned: false, icon: ChristmasWreath },
  { id: 'snowFall', title: t('eventsShopItems.snowFall'), priceCoins: 140, level: 2, minDoors: 18, isOwned: false, icon: SnowEffectIcon }
])

// Сколько окошек адвент-календаря уже открыто: снегопад доступен только после 18-го
const openedDoors = computed(() => Object.entries(questsProgress.value || {})
  .filter(([id, data]) => id.startsWith('advent-') && data?.finished).length)

function canBuyItem(item) {
  if (!item || item.isOwned) return false
  if (currentLevel.value < item.level) return false
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

// Условия покупки с текущим прогрессом: снежинки, репутация, окошки календаря
const reqList = computed(() => {
  const item = reqItem.value
  if (!item) return []
  const list = [{ id: 'coins', iconImg: SnowCoin, label: t('winterShop.reqCoins'), have: coins.value, need: item.priceCoins }]
  if (item.level > 1) {
    list.push({ id: 'rep', icon: '⭐', label: t('eventPanel.reputation'), have: reputationPoints.value, need: ranks.value[item.level - 1].need })
  }
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
  reputationPoints.value = progressData.reputationPoints || 0
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
    quests.value = quests.value.map(q => byId[q.id]
      ? { ...q, rewardCoins: byId[q.id].rewardCoins ?? q.rewardCoins, rewardRep: byId[q.id].rewardRep ?? q.rewardRep }
      : q)
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
        <div class="stats-board">
          <div class="stat-item">
            <span class="stat-value">{{ levelProgressText }}</span>
          </div>
          <div class="stat-item" data-coin-target>
            <div class="stat-value">
              <img class="coin" :src="SnowCoin" alt="">
              <div class="coin__value">{{ displayedCoins }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="scrollable-view">
        <div class="banner">
          <div class="banner__text">{{ banner.text }}</div>
          <img :src="banner.icon" alt="" class="banner__icon">
        </div>
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
                            @coins-landed="onCoinsLanded"/>
          </section>
          <section v-if="activeTab === 'reputation'">
            <div class="cards">
              <div v-for="reward in shopItemsList" :key="reward.id" class="prize-card achv-card">
                <div class="prize-card__icon">
                  <img :src="reward.icon" alt="">
                </div>
                <div class="prize-card__body">
                  <div class="prize-card__title">{{ reward.title }}</div>
                  <div v-if="reward.level > 1" class="prize-card__rank">{{ ranks[reward.level - 1].title }}</div>
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
          <section v-if="activeTab === 'quests'">
            <div class="quests">
              <div v-for="(quest, qi) in quests" :key="quest.id" :class="['quest', 'achv-card', `--v${qi % 4}`]">
                <div class="quest__icon">{{ quest.icon }}</div>
                <div class="quest__body">
                  <div class="quest__title clickable" @click="goToSession(quest.id)">{{ quest.title }}</div>
                  <div class="quest__meta">
                    <div class="quest__inner">
                      <span class="meta__pill --rep">{{ quest.rewardRep }} {{ t('eventPanel.rep') }}</span>
                      <span class="meta__pill --coins">{{ quest.rewardCoins }} <img class="meta__coin" :src="SnowCoin" alt=""></span>
                    </div>
                    <button
                        :class="['btn', 'btn--candy', { 'btn--repeat': quest.isDone, 'btn--errors': quest.hasErrors }]"
                        @click="goToSession(quest.id)"
                    >
                      {{ quest.isDone ? t('eventPanel.repeat') : (quest.hasErrors ? t('eventPanel.errors') : t('eventPanel.execute')) }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
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
  height: 100%;
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
  padding-bottom: 120px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.scroll_sections::-webkit-scrollbar {
  display: none;
}

/* Зимний синий баннер, в цвет синих подарков и ночной деревни */
.banner {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 0%, rgb(255 255 255 / 0.3) 0%, transparent 55%),
    linear-gradient(135deg, #5aa9f0 0%, #3f74c4 55%, #2b4f8c 100%);
  border: 2px solid rgb(255 255 255 / 0.6);
  box-shadow: 0 5px 0 #1f3a6b, 0 10px 24px rgb(31 58 107 / 0.25);
  border-radius: 24px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  flex-shrink: 0;
}

.banner__text {
  color: #ffffff;
  text-shadow: 0 2px 0 rgb(0 0 0 / 0.18);
  font-size: 19px;
  font-family: "Fredoka", "Nunito", sans-serif;
  font-weight: 600;
  line-height: 1.3;
  margin-right: 10px;
}

.banner__icon {
  height: 96px;
  position: relative;
  filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.25));
}

.coin {
  width: 22px;
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
  gap: 8px;
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

/* Карточки заданий: цвета чередуются, как у подарков в календаре */
.quest {
  --tint: #d8463f;
  --tint-2: #ff8a80;
  --tint-dark: #a3241f;
  --tint-soft: rgb(216 70 63 / 0.16);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 18px;
  background: linear-gradient(90deg, var(--tint-soft) 0%, rgb(255 255 255 / 55%) 45%);
}

.quest::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background: linear-gradient(180deg, var(--tint-2), var(--tint));
}

.quest.--v1 { --tint: #2f8a4f; --tint-2: #6fd38f; --tint-dark: #1d5e33; --tint-soft: rgb(47 138 79 / 0.16); }
.quest.--v2 { --tint: #e9a92c; --tint-2: #ffd45e; --tint-dark: #b5850f; --tint-soft: rgb(233 169 44 / 0.18); }
.quest.--v3 { --tint: #3f6db8; --tint-2: #7fb2ff; --tint-dark: #284d8c; --tint-soft: rgb(63 109 184 / 0.16); }

.quest__icon {
  flex-shrink: 0;
  width: 62px;
  height: 62px;
  border-radius: 18px;
  border: 2px solid rgb(255 255 255 / 85%);
  background: radial-gradient(circle at 35% 30%, var(--tint-2), var(--tint) 75%);
  box-shadow: 0 3px 0 var(--tint-dark), inset 0 2px 6px rgb(255 255 255 / 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.quest__body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quest__title {
  font-size: 16px;
  font-weight: 600;
  color: #1f3a6b;
  margin-bottom: 8px;
  font-family: "Fredoka", "Nunito", sans-serif;
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
  width: 12px;
  height: 12px;
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

.meta__pill.--rep {
  color: #8e2a24;
  background: #ffe1dd;
}

.meta__pill.--coins {
  color: #1f5f9e;
  background: #dcefff;
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
  height: 100vh;
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

@media (min-width: 768px) {
  .cards, .quests {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .tab-label {
    font-size: 14px;
  }

  .banner__icon {
    height: 72px;
  }

  .banner__text {
    font-size: 16px;
  }
}
</style>
