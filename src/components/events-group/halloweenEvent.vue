<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import VShowFall from "../V-showFall.vue"
import PumpkinCoin from 'assets/images/event-rewards/halloween-event/halloween-assets/pumpkinCoin.svg'

import BgCard from 'assets/images/test.png'
import Words from 'assets/images/event-rewards/halloween-event/halloween-quests-icons/Words.jpg'

import QuestsNavIcon from 'assets/images/event-rewards/halloween-event/halloween-assets/quests.svg'
import ShopNavIcon from 'assets/images/event-rewards/halloween-event/halloween-assets/shop.svg'
import BoneClose from 'assets/images/event-rewards/halloween-event/halloween-assets/bone.svg'


import Ghost from 'assets/images/event-rewards/halloween-event/halloween-rewards/ghost.svg'
import WitchBroom from 'assets/images/event-rewards/halloween-event/halloween-rewards/witch-broom.svg'
import WitchHat from 'assets/images/event-rewards/halloween-event/halloween-rewards/witch-hat.svg'

import {useEventSessionStore} from '~/store/eventsStore.js'
import {useSeoMeta, useI18n, useLocalePath} from "#imports"

useSeoMeta({robots: 'noindex, nofollow'})

const {t, locale} = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const eventStore = useEventSessionStore()

const isReqModalOpen = ref(false)
const reqModalTitle = ref('')
const reqModalText = ref('')
const coins = ref(0)
const coinIcon = '🎃'
const activeTab = ref('quests')
const reputationPoints = ref(0)
const selectedLevel = ref(1)

const eventId = computed(() => String(route.params.id || ''))
const isEventOpen = computed(() => {
  const event = eventStore.events.find(e => e.id === eventId.value)
  if (!event) return false
  const now = new Date().toLocaleDateString('fr-CA').slice(5)
  const start = event.start.slice(0, 5)
  const end = event.end.slice(0, 5)
  if (start > end) return now >= start || now <= end
  return now >= start && now <= end
})

const navTabs = computed(() => ([
  {id: 'quests', label: t('eventPanel.questions'), icon: QuestsNavIcon},
  {id: 'reputation', label: t('Магазин'), icon: ShopNavIcon}
]))

const activeIndex = computed(() => navTabs.value.findIndex(tab => tab.id === activeTab.value))

const getTransformX = (index) => {
  if (index === -1) return 0
  if (locale.value === 'ar') {
    return (navTabs.value.length - 1 - index) * 100
  }
  return index * 100
}

const pathToMain = () => {
  router.push('/')
}

function setTab(tabId) {
  activeTab.value = tabId
}

const ranks = computed(() => ([
  {level: 1, need: 0, title: t('eventPanel.firstReputationHalloween', 'Любопытный')},
  {level: 2, need: 1000, title: t('eventPanel.secondReputationHalloween', 'Повелитель Тыкв')}
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

function setSelectedLevel(lvl) {
  selectedLevel.value = lvl
}

const quests = ref([
  {
    id: 'quest-1',
    title: t('halloweenEventQuests.quest-1', 'Картинка → Слово'),
    rewardCoins: 10,
    rewardRep: 70,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-2',
    title: t('halloweenEventQuests.quest-2', 'Основы и факты'),
    rewardCoins: 10,
    rewardRep: 60,
    isDone: false,
    icon: BgCard
  },
  {
    id: 'quest-3',
    title: t('halloweenEventQuests.quest-3', 'Традиции и альтернативы'),
    rewardCoins: 10,
    rewardRep: 60,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-4',
    title: t('halloweenEventQuests.quest-4', 'Мистические существа и легенды'),
    rewardCoins: 10,
    rewardRep: 60,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-5',
    title: t('halloweenEventQuests.quest-5', 'Костюмы и осенняя ночь'),
    rewardCoins: 10,
    rewardRep: 60,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-6',
    title: t('halloweenEventQuests.quest-6', 'Символика и обычаи'),
    rewardCoins: 10,
    rewardRep: 60,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-7',
    title: t('halloweenEventQuests.quest-7', 'Хэллоуин в Германии'),
    rewardCoins: 10,
    rewardRep: 70,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-8',
    title: t('halloweenEventQuests.quest-8', 'Обычаи немецких регионов'),
    rewardCoins: 10,
    rewardRep: 70,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-9',
    title: t('halloweenEventQuests.quest-9', 'Тайна замка Эльц'),
    rewardCoins: 10,
    rewardRep: 70,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-10',
    title: t('halloweenEventQuests.quest-10', 'Легенды темного Шварцвальда'),
    rewardCoins: 10,
    rewardRep: 70,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-11',
    title: t('halloweenEventQuests.quest-11', 'Осенний вечер и домашний уют'),
    rewardCoins: 10,
    rewardRep: 70,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-12',
    title: t('halloweenEventQuests.quest-12', 'Соедини пары: атрибуты Хэллоуина'),
    rewardCoins: 10,
    rewardRep: 70,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-13',
    title: t('halloweenEventQuests.quest-13', 'Соедини пары: немецкие предания'),
    rewardCoins: 10,
    rewardRep: 70,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-14',
    title: t('halloweenEventQuests.quest-14', 'Выбери слово: атмосфера праздника'),
    rewardCoins: 10,
    rewardRep: 70,
    isDone: false,
    icon: Words
  },
  {
    id: 'quest-15',
    title: t('halloweenEventQuests.quest-15', 'Выбери слово: немецкие обычаи'),
    rewardCoins: 10,
    rewardRep: 70,
    isDone: false,
    icon: Words
  }
])

async function goToSession(questId) {
  await eventStore.start(eventId.value, String(questId))
  const to = localePath({name: 'event-id-session', params: {id: route.params.id}})
  await router.push(to)
}

const shopByRank = ref({
  1: [
    {
      id: 'witchBroom',
      title: t('eventsShopItems.witchHat', 'Метла Ведьмы'),
      priceCoins: 30,
      isOwned: false,
      icon: WitchBroom
    },
    {
      id: 'witchHat',
      title: t('eventsShopItems.spiderWeb', 'Шляпа Ведьмы'),
      priceCoins: 30,
      isOwned: false,
      icon: WitchHat
    },
  ],
  2: [
    {
      id: 'ghostEffect',
      title: t('eventsShopItems.ghostEffect', 'Эффект хэллоуина'),
      priceCoins: 120,
      isOwned: false,
      icon: Ghost
    }
  ]
})

function isTopItem(item) {
  return item?.id === 'ghostEffect'
}

function canBuyItem(level, item) {
  if (!item) return false
  if (item.isOwned) return false
  if (currentLevel.value < level) return false
  if (coins.value < item.priceCoins) return false
  if (isTopItem(item) && reputationPoints.value < 1000) return false
  return true
}

async function buyReward(level, rewardId) {
  if (currentLevel.value < level) return
  const item = shopByRank.value[level].find(i => i.id === rewardId)
  if (!item || item.isOwned) return
  if (isTopItem(item) && reputationPoints.value < 1000) return
  if (coins.value < item.priceCoins) return

  coins.value -= item.priceCoins
  item.isOwned = true
  await eventStore.saveMainProgress({
    coins: coins.value,
    shopItems: {[item.id]: true}
  })
}

function openRequirementsModal(level, item) {
  reqModalTitle.value = item.title
  if (isTopItem(item)) {
    reqModalText.value = `${t('eventPanel.needForReward')} ${item.priceCoins} ${coinIcon}  ${t('eventPanel.and')} 1000 ${t('eventPanel.reputation')}`
  } else {
    reqModalText.value = `${t('eventPanel.needForReward')} ${item.priceCoins} ${coinIcon}`
  }
  isReqModalOpen.value = true
}

function closeRequirementsModal() {
  isReqModalOpen.value = false
}

async function onRewardClick(level, item) {
  if (canBuyItem(level, item)) {
    await buyReward(level, item.id)
  } else {
    openRequirementsModal(level, item)
  }
}

async function refreshProgressBadges() {
  const progressData = await eventStore.loadEventProgress(eventId.value)
  if (!progressData) return

  coins.value = progressData.coins || 0
  reputationPoints.value = progressData.reputationPoints || 0

  const questsProgress = progressData.quests || {}
  quests.value = quests.value.map(q => ({
    ...q,
    isDone: questsProgress[q.id] ? questsProgress[q.id].finished : false
  }))

  const shopItems = progressData.shopItems || {}
  Object.values(shopByRank.value).forEach(list => {
    list.forEach(item => {
      if (shopItems[item.id]) item.isOwned = true
    })
  })
}

onMounted(() => {
  refreshProgressBadges()
})
</script>

<template>
  <div v-if="!isEventOpen" class="season-page">
    <div class="season__bg"></div>
    <div class="svg-snow" aria-hidden="true"></div>
    <div class="season-container">
      <div class="compact-header">
        <button @click="pathToMain" type="button" class="btn-icon-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="grey" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div class="stats-board">
          <div class="stat-item">
            <span class="stat-value">{{ levelProgressText }}</span>
          </div>
          <div class="stat-item">
            <div class="stat-value">
              <img class="coin" :src="PumpkinCoin" alt="PumpkinCoin">
              <div class="coin__value">{{ coins }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="scrollable-view">
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
          <section v-if="activeTab === 'reputation'">
            <div class="section-head">
              <div class="rank-switch">
                <button
                    v-for="rank in ranks"
                    :key="rank.level"
                    :class="['pill', { 'is-active': selectedLevel === rank.level }]"
                    @click="setSelectedLevel(rank.level)"
                >
                  {{ rank.title }}
                </button>
              </div>
            </div>
            <div class="cards">
              <div
                  v-for="reward in shopByRank[selectedLevel]"
                  :key="reward.id"
                  class="prize-card achv-card"
              >
                <div class="prize-card__icon">
                  <img :src="reward.icon" alt="">
                </div>
                <div class="prize-card__title">{{ reward.title }}</div>
                <div class="prize-card__body">
                  <div class="price">
                    <img class="coin" :src="PumpkinCoin" alt="PumpkinCoin">
                    <span class="price__value">{{ reward.priceCoins }} </span>
                  </div>
                  <button
                      class="btn btn--candy"
                      :disabled="reward.isOwned"
                      @click="onRewardClick(selectedLevel, reward)"
                  >
                    <template v-if="reward.isOwned">{{ t('eventPanel.bought', 'Куплено') }}</template>
                    <template v-else>{{ t('eventPanel.buy', 'Купить') }}</template>
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section v-if="activeTab === 'quests'">
            <div class="quests">
              <div v-for="quest in quests" :key="quest.id" class="quest achv-card">
                <div class="quest__icon">
                  <img :src="quest.icon" alt="">
                </div>
                <div class="quest__body">
                  <div class="quest__title clickable" @click="goToSession(quest.id)">{{ quest.title }}</div>
                  <div class="quest__meta">
                    <div class="quest__inner">
                      <span class="meta__pill">{{ quest.rewardRep }} {{ t('eventPanel.rep', 'реп.') }}</span>
                      <span class="meta__pill">{{ quest.rewardCoins }} {{ coinIcon }}</span>
                    </div>
                    <button
                        :class="['btn', 'btn--candy', { 'btn--repeat': quest.isDone }]"
                        @click="goToSession(quest.id)"
                    >
                      {{ quest.isDone ? t('eventPanel.repeat', 'Повторить') : t('eventPanel.execute', 'Начать задание') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div v-if="isReqModalOpen" class="req-modal" @click.self="closeRequirementsModal">
        <div class="req-modal__card achv-card">
          <div class="req-modal__head">
            <div class="req-modal__title">{{ reqModalTitle }}</div>
            <button class="req-modal__close" type="button" @click="closeRequirementsModal">
              <img :src="BoneClose" alt="">
            </button>
          </div>
          <div class="req-modal__text">{{ reqModalText }}</div>
          <button class="btn btn--candy req-modal__btn" type="button" @click="closeRequirementsModal">
            Ok
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="event-closed">
    <div class="closed-content">
      <h1>🔒 {{ t('eventPanel.notAllowedTitle', 'Событие закрыто') }}</h1>
      <p>{{ t('eventPanel.notAllowedText', 'В данный момент это событие недоступно.') }}</p>
      <button @click="pathToMain" class="btn btn--home">{{ t('eventPanel.pathMain', 'На главную') }}</button>
    </div>
  </div>
</template>

<style scoped>

.season-page {
  height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;

  -webkit-tap-highlight-color: transparent;
}

.season__bg {
  position: absolute;
  inset: 0;
  background: #1a0f1f url('/images/HalooweenBackground3.webp') no-repeat center center;
  background-size: cover;
  z-index: 1;
}

.season-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
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
  padding: 5px 10px 15px 10px;
  flex-shrink: 0;
  z-index: 10;
}

.btn-icon-back {
  background: #fff;
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
}

.achv-card {
  border-radius: 22px;
  padding: 15px;
  backdrop-filter: blur(4px);
  background: rgb(0 0 0 / 83%);
}

.stats-board {
  display: flex;
  align-items: center;
  justify-content: end;
  flex: 1;
  padding: 0 6px;
  margin: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #46a714bf;
  padding: 6px;
  border-radius: 14px;
  margin-left: 10px;
}

.stat-value {
  color: #ffffff;
  font-weight: 400;
  font-family: Lilita One, sans-serif;
  font-size: 22px;
  display: flex;
  gap: 10px;
}

.scrollable-view {
  padding: 10px 20px 10px;
  scrollbar-width: none;
  height: 100%;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.scroll_sections {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 160px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.scroll_sections::-webkit-scrollbar {
  display: none;
}

.coin {
  width: 28px;
}

.coin__value {
  font-size: 22px;
  font-family: Lilita One, sans-serif;
}

.mobile-nav {
  display: flex;
  position: relative;
  justify-content: space-between;
  background: rgba(31, 14, 21, 0.9);
  border-radius: 40px;
  padding: 6px;
  border: 3px solid rgb(143 140 136 / 0.12);
  margin: 0 0 5px 0;
  flex-shrink: 0;
}

.sliding-bg {
  position: absolute;
  top: 5px;
  bottom: 6px;
  left: 6px;
  width: calc(50% - 6px);
  background: #bd2d2d;
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
}

.tab-icon {
  font-size: 22px;
}

.tab-label {
  font-size: 18px;
  font-weight: 400;
  color: #ffe6d1;
  transition: color 0.2s;
  font-family: "Kablammo", system-ui;
}

.mobile-nav__btn--active .tab-label {
  color: #fff;
}

.section-head {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.rank-switch {
  display: flex;
  background: #1f0e15;
  padding: 5px;
  border-radius: 14px;
  gap: 8px;
  width: 100%;
}

.pill {
  border: none;
  color: #ffe6d1;
  background: none;
  border-radius: 14px;
  padding: 10px 12px;
  font-weight: 900;
  font-size: 16px;
  cursor: pointer;
  flex: 1;
  text-align: center;
  transition: background 0.2s, color 0.2s;
}

.pill.is-active {
  background: #ff9c1a;
  color: #1a0f1f;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 15px;
}

.prize-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 15px 30px 30px 30px;
}

.prize-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  border: 4px solid #51504d;
  background: #251233;
  padding: 18px;
  border-radius: 30%;
}

.prize-card__body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prize-card__title {
  font-size: 22px;
  color: #ffcf4d;
  font-family: "Kablammo", system-ui;
}

.price {
  font-weight: 900;
  color: #1a0f1f;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 10px 10px;
  font-size: 16px;
}

.quests {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 15px;
  flex: 1;
  overflow-y: auto;
}

.quest {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 15px 30px 30px 30px;
  border: 3px solid #9f78c973;
}

.quest__icon {
  font-size: 45px;
  overflow: hidden;
  border-radius: 30%;
  width: 190px;
  border: 4px solid #51504d;
}

.quest__body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quest__title {
  font-weight: 400;
  font-size: 26px;
  color: #FFFFFF;
  text-align: center;
  font-family: "Kablammo", system-ui;
}

.quest__meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quest__inner {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.meta__pill {
  color: #ffcf4d;
  background: #46a714bf;
  border-radius: 14px;
  padding: 6px 12px;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 10px;
}

.btn {
  border-radius: 31px 52% 35px;
  padding: 12px 20px;
  cursor: pointer;
  width: 100%;
  text-transform: uppercase;
  text-align: center;
  font-family: "Nunito", sans-serif;
  font-size: 18px;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn:active {
  transform: translateY(2px);
  box-shadow: none !important;
}

.btn--candy {
  background: #ff9c1a;
  color: #2e2b37;
  font-size: 20px;
  font-family: "Kablammo", system-ui;
  border: none;
  box-shadow: 0 5px #b3530c;
}

.btn--candy:disabled {
  background: #3a232f;
  color: #888;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.btn--repeat {
  background: #4CAF50;
  color: #fff;
  box-shadow: 0 5px #388E3C;
}

.clickable {
  cursor: pointer;
}

.event-closed {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a0f1f;
  color: #ffe6d1;
  font-family: "Nunito", sans-serif;
}

.closed-content {
  text-align: center;
  padding: 40px;
  border: 2px solid #ffbb55;
  border-radius: 20px;
  background: rgba(40, 20, 30, 0.8);
  margin: 20px;
}

.closed-content h1 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #ffcf4d;
}

.closed-content p {
  margin-bottom: 30px;
  font-size: 1.2rem;
  color: #ffe6d1;
}

.btn--home {
  background: #e0701d;
  color: #fff;
  border: none;
  box-shadow: 0 6px 0 #b3530c;
}

.req-modal {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.req-modal__card {
  width: 100%;
  max-width: 400px;
  background: #2a1622;
  border: 2px solid #ffbb55;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  padding: 25px 15px 30px 15px;
}

.req-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.price__value {
  margin: 6px 0 0 6px ;
  color: white;
  font-weight: 900;
  font-size: 18px;

}

.req-modal__title {
  font-weight: 900;
  font-size: 20px;
  color: #ffcf4d;
}

.req-modal__close {
  border: none;
  background: none;
  color: white;
  width: 42px;
  height: 42px;
  cursor: pointer;
  font-weight: 900;
  font-size: 18px;
}

.req-modal__text {
  font-weight: 700;
  color: #ffe6d1;
  line-height: 1.4;
  margin-bottom: 20px;
  font-size: 16px;
}

@media (min-width: 768px) {
  .prize-card {
    flex-direction: column;
    text-align: center;
  }

  .prize-card__icon {
    font-size: 80px;
    width: 100px;
    height: 100px;
  }

  .cards {
    flex-direction: row;
  }

  .prize-card {
    flex: 1;
    min-width: 280px;
  }

  .quest {
    flex-direction: row;
    text-align: left;
  }

  .quest__title {
    text-align: left;
  }

  .quest__meta {
    flex-direction: row;
    justify-content: space-between;
  }

  .btn {
    width: auto;
  }
}

@media (max-width: 400px) {
  .stat-label {
    display: none;
  }
}
</style>