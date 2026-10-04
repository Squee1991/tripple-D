<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import PumpkinCoin from 'assets/images/event-rewards/halloween-event/halloween-assets/pumpkinCoin.svg'

import HedgehogQuest from '~/assets/images/event-rewards/halloween-event/halloween-assets/HedhogQuests.svg'
import HedgehogShop from '~/assets/images/event-rewards/halloween-event/halloween-assets/hedhogShop.svg'

import BgCard from 'assets/images/test.png'
import Words from 'assets/images/event-rewards/halloween-event/halloween-quests-icons/Words.jpg'

import QuestsNavIcon from 'assets/images/event-rewards/halloween-event/halloween-assets/quests.svg'
import ShopNavIcon from 'assets/images/event-rewards/halloween-event/halloween-assets/shop.svg'
import BoneClose from 'assets/images/event-rewards/halloween-event/halloween-assets/bone.svg'

import Ghost from 'assets/images/event-rewards/halloween-event/halloween-rewards/ghost.svg'
import WitchBroom from 'assets/images/event-rewards/halloween-event/halloween-rewards/witch-broom.svg'
import WitchHat from 'assets/images/event-rewards/halloween-event/halloween-rewards/witch-hat.svg'
import Pumpkin from 'assets/images/event-rewards/halloween-event/halloween-rewards/pumpkin.svg'
import SpellBook from 'assets/images/event-rewards/halloween-event/halloween-rewards/spell-book.svg'
import Punch from 'assets/images/event-rewards/halloween-event/halloween-rewards/punch.svg'

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

const eventId = computed(() => String(route.params.id || ''))
const isEventOpen = computed(() => {
  const event = eventStore.events.find(e => e.id === eventId.value || e.url.includes(eventId.value))
  if (!event) {
    console.warn('Событие не найдено для ID:', eventId.value)
    return false
  }
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const now = `${month}-${day}`

  const start = event.start.slice(0, 5)
  const end = event.end.slice(0, 5)
  if (start > end) {
    return now >= start || now <= end
  }

  return now >= start && now <= end
})

const bannerText = {
  shop: t('haloweenBanner.shop'),
  quests: t('haloweenBanner.quests')
}

const bannerTextComputed = computed(() => {
  return activeTab.value === 'quests' ? bannerText.quests : bannerText.shop
})

const bannerComputed = computed(() => {
  return activeTab.value === 'quests' ? HedgehogQuest : HedgehogShop
})

const navTabs = computed(() => ([
  {id: 'quests', label: t('eventPanel.questions'), icon: QuestsNavIcon},
  {id: 'reputation', label: t('eventPanel.shop'), icon: ShopNavIcon}
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
  {level: 1, need: 0, title: t('eventPanel.firstReputationHalloween')},
  {level: 2, need: 1000, title: t('eventPanel.secondReputationHalloween')}
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
  {
    id: 'quest-1',
    title: t('halloweenEventQuests.questOne'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-2',
    title: t('halloweenEventQuests.questTwo'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: BgCard
  },
  {
    id: 'quest-3',
    title: t('halloweenEventQuests.questThree'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-4',
    title: t('halloweenEventQuests.questFour'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-5',
    title: t('halloweenEventQuests.questFive'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-6',
    title: t('halloweenEventQuests.questSix'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-7',
    title: t('halloweenEventQuests.questSeven'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-8',
    title: t('halloweenEventQuests.questEight'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-9',
    title: t('halloweenEventQuests.questNine'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-10',
    title: t('halloweenEventQuests.questTen'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-11',
    title: t('halloweenEventQuests.questEleven'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-12',
    title: t('halloweenEventQuests.questTwelve'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-13',
    title: t('halloweenEventQuests.questThirteen'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-14',
    title: t('halloweenEventQuests.questFourteen'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-15',
    title: t('halloweenEventQuests.questFifteen'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-16',
    title: t('halloweenEventQuests.questSixteen'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-17',
    title: t('halloweenEventQuests.questSeventeen'),
    rewardCoins: 15,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-18',
    title: t('halloweenEventQuests.questEighteen'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-19',
    title: t('halloweenEventQuests.questNineteen'),
    rewardCoins: 10,
    rewardRep: 40,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-20',
    title: t('halloweenEventQuests.questTwenty'),
    rewardCoins: 10,
    rewardRep: 60,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-21',
    title: t('halloweenEventQuests.questTwentyOne'),
    rewardCoins: 10,
    rewardRep: 60,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-22',
    title: t('halloweenEventQuests.questTwentyTwo'),
    rewardCoins: 10,
    rewardRep: 60,
    isDone: false,
    hasErrors: false,
    icon: Words
  },
  {
    id: 'quest-23',
    title: t('halloweenEventQuests.questTwentyThree'),
    rewardCoins: 10,
    rewardRep: 60,
    isDone: false,
    hasErrors: false,
    icon: Words
  }
])

async function goToSession(questId) {
  await eventStore.start(eventId.value, String(questId))
  const to = localePath({name: 'event-id-session', params: {id: route.params.id}})
  await router.push(to)
}

const shopItemsList = ref([
  {
    id: 'witchBroom',
    title: t('eventsShopItemsHalloween.witchBroom'),
    priceCoins: 60,
    isOwned: false,
    icon: WitchBroom
  },
  {
    id: 'witchHat',
    title: t('eventsShopItemsHalloween.witchHat'),
    priceCoins: 60,
    isOwned: false,
    icon: WitchHat
  },
  {
    id: 'pumpkin',
    title: t('eventsShopItemsHalloween.pumpkin'),
    priceCoins: 60,
    isOwned: false,
    icon: Pumpkin
  },
  {
    id: 'punch',
    title: t('eventsShopItemsHalloween.punch'),
    priceCoins: 60,
    isOwned: false,
    icon: Punch
  },
  {
    id: 'spellBook',
    title: t('eventsShopItemsHalloween.spellBook'),
    priceCoins: 60,
    isOwned: false,
    icon: SpellBook
  },
  {
    id: 'ghostEffect',
    title: t('eventsShopItemsHalloween.ghostEffect'),
    priceCoins: 200,
    isOwned: false,
    icon: Ghost
  }
])

function isTopItem(item) {
  return item?.id === 'ghostEffect'
}

function canBuyItem(item) {
  if (!item) return false
  if (item.isOwned) return false
  if (coins.value < item.priceCoins) return false
  if (isTopItem(item) && reputationPoints.value < 1000) return false
  return true
}

async function buyReward(rewardId) {
  const item = shopItemsList.value.find(i => i.id === rewardId)
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

function openRequirementsModal(item) {
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

async function onRewardClick(item) {
  if (canBuyItem(item)) {
    await buyReward(item.id)
  } else {
    openRequirementsModal(item)
  }
}

async function refreshProgressBadges() {
  const progressData = await eventStore.loadEventProgress(eventId.value)
  if (!progressData) return

  coins.value = progressData.coins || 0
  reputationPoints.value = progressData.reputationPoints || 0

  const questsProgress = progressData.quests || {}
  quests.value = quests.value.map(q => {
    const qData = questsProgress[q.id]
    const isDone = qData ? !!qData.finished : false
    const hasErrors = !isDone && !!qData && Array.isArray(qData.solvedSteps) && qData.solvedSteps.length > 0

    return {
      ...q,
      isDone,
      hasErrors
    }
  })

  const shopItems = progressData.shopItems || {}
  shopItemsList.value.forEach(item => {
    if (shopItems[item.id]) item.isOwned = true
  })
}

onMounted(() => {
  refreshProgressBadges()
})
</script>

<template>
  <div v-if="isEventOpen" class="season-page">
    <div class="season__bg"></div>
    <div class="svg-snow" aria-hidden="true"></div>
    <div class="season-container">
      <div class="compact-header">
        <button @click="pathToMain" type="button" class="btn-icon-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
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
        <div class="banner__inner">
          <div class="banner">
            <div class="banner__text"> {{ bannerTextComputed }}</div>
            <img :src="bannerComputed" alt="bannerIcon" class="banner__icon">
          </div>
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
          <section v-if="activeTab === 'reputation'">
            <div class="cards">
              <div
                  v-for="reward in shopItemsList"
                  :key="reward.id"
                  class="prize-card achv-card"
              >
                <div class="prize-card__icon">
                  <img :src="reward.icon" alt="">
                </div>
                <div class="prize-card__body">
                  <div class="prize-card__title">{{ reward.title }}</div>
                  <div class="prize-card__actions">
                    <div class="price">
                      <img class="coin" :src="PumpkinCoin" alt="PumpkinCoin">
                      <span class="price__value">{{ reward.priceCoins }} </span>
                    </div>
                    <button
                        class="btn btn--candy"
                        :disabled="reward.isOwned"
                        @click="onRewardClick(reward)"
                    >
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
              <div v-for="quest in quests" :key="quest.id" class="quest achv-card">
                <div class="quest__icon">
                  <img :src="quest.icon" alt="">
                </div>
                <div class="quest__body">
                  <div class="quest__title clickable" @click="goToSession(quest.id)">{{ quest.title }}</div>
                  <div class="quest__meta">
                    <div class="quest__inner">
                      <span class="meta__pill">{{ quest.rewardRep }} {{ t('eventPanel.rep') }}</span>
                      <span class="meta__pill">{{ quest.rewardCoins }} {{ coinIcon }}</span>
                    </div>
                    <button
                        :class="[
                          'btn',
                          'btn--candy',
                          {
                            'btn--repeat': quest.isDone,
                            'btn--errors': quest.hasErrors
                          }
                        ]"
                        @click="goToSession(quest.id)"
                    >
                      {{
                        quest.isDone ? t('eventPanel.repeat') : (quest.hasErrors ? t('eventPanel.errors') : t('eventPanel.execute'))
                      }}
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
      <h1>🔒 {{ t('eventPanel.notAllowedTitle') }}</h1>
      <p>{{ t('eventPanel.notAllowedText') }}</p>
      <button @click="pathToMain" class="btn btn--home">{{ t('eventPanel.pathMain') }}</button>
    </div>
  </div>
</template>

<style scoped>
.season-page {
  height: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}

.season__bg {
  position: fixed;
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
  padding: 5px 10px 5px 10px;
  flex-shrink: 0;
  z-index: 10;
}

.btn-icon-back {
  background: #f69e00;
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
  border-radius: 16px;
  padding: 10px 14px;
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
  padding: 10px;
  scrollbar-width: none;
  height: 100%;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.scroll_sections {
  height: 100%;
  overflow-y: auto;
  padding-bottom: 220px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.banner {
  background: linear-gradient(135deg, #2d124d 0%, #1a0b2e 100%);
  box-shadow: 0 0 6px rgb(255 156 26 / 0.5);
  border-radius: 24px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.banner__text {
  color: white;
  font-weight: 400;
  font-size: 18px;
  font-family: "Rubik Wet Paint", system-ui;
  font-style: italic;
  line-height: 1.3;
  letter-spacing: 1px;
  margin-right: 10px;
  text-shadow: 0 2px 0 orange;
  -webkit-text-stroke: 0.5px #000000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.scroll_sections::-webkit-scrollbar {
  display: none;
}

.coin {
  width: 22px;
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
  margin: 0 0 10px 0;
  flex-shrink: 0;
}

.banner__icon {
  height: 96px;
}

.sliding-bg {
  position: absolute;
  top: 5px;
  bottom: 6px;
  left: 6px;
  width: calc(50% - 6px);
  background: #b64711;
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

.tab-label {
  font-size: 18px;
  font-weight: 400;
  color: #ffe6d1;
  transition: color 0.2s;
  font-family: "Rubik Wet Paint", system-ui;
  -webkit-text-stroke: 0.5px #000000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.mobile-nav__btn--active .tab-label {
  color: #fff;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 0 100px;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.cards::-webkit-scrollbar {
  display: none;
}

.prize-card {
  display: flex;
  flex-direction: row;
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
  border: 3px solid #51504d;
  background: #251233;
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
  color: #ffcf4d;
  font-family: "Rubik Wet Paint", system-ui;
  text-align: left;
}

.prize-card__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.price {
  font-weight: 900;
  color: #1a0f1f;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 4px 6px;
  font-size: 14px;
}

.quests {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 100px;
}

.quest {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  border: 2px solid #9f78c973;
}

.quest__icon {
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 18px;
  width: 62px;
  border: 3px solid #51504d;
}

.quest__icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.quest__body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quest__title {
  font-weight: 400;
  font-size: 16px;
  color: #FFFFFF;
  margin-bottom: 8px;
  text-align: left;
  font-family: "Rubik Wet Paint", system-ui;
  -webkit-text-stroke: 0.5px #000000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

.meta__pill {
  color: #ffcf4d;
  background: #46a714bf;
  border-radius: 10px;
  padding: 3px 8px;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 0;
  white-space: nowrap;
}

.btn {
  border-radius: 18px;
  padding: 6px 14px;
  cursor: pointer;
  width: auto;
  min-width: 120px;
  text-transform: uppercase;
  text-align: center;
  font-family: "Nunito", sans-serif;
  font-size: 12px;
  transition: transform 0.1s, box-shadow 0.1s;
}

.btn:active {
  transform: translateY(2px);
  box-shadow: none !important;
}

.btn--candy {
  background: #ff9c1a;
  color: #2e2b37;
  font-size: 13px;
  font-family: "Rubik Wet Paint", system-ui;
  border: none;
  box-shadow: 0 3px #b3530c;
}

.btn--candy:disabled {
  background: #3a232f;
  color: #888;
  box-shadow: none;
  cursor: not-allowed;
  transform: none;
}

.btn--repeat {
  background: #4c5caf;
  color: #fff;
  font-style: italic;
  box-shadow: 0 4px #333f83;
}

.btn--errors {
  background: #d32f2f;
  color: #fff;
  font-style: normal;
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
  background: #1a0f1f;
  color: #ffe6d1;
  font-family: "Nunito", sans-serif;
}

.closed-content {
  text-align: center;
  padding: 40px;
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
  margin: 0 0 0 4px;
  color: white;
  font-weight: 900;
  font-size: 15px;
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
  .cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .quests {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 400px) {
  .stat-label {
    display: none;
  }
}
</style>