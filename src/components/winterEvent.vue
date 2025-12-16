<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import VShowFall from "./V-showFall.vue"
import Present from '../assets/images/mery-christmas/Present.svg'
import Snow from 'assets/images/mery-christmas/Snow.svg'

import { useEventSessionStore } from '../../store/eventsStore.js'

import Hat from 'assets/images/event-rewards/winter-event/winter-rewards/santa-hat.svg'
import ChristmasBall from 'assets/images/event-rewards/winter-event/winter-rewards/christmas-ball.svg'
import ChristmasWreath from 'assets/images/event-rewards/winter-event/winter-rewards/christmas-wreath.svg'
import SantaIcon from 'assets/images/event-rewards/winter-event/winter-rewards/SnowEffect.svg'

const { t } = useI18n()
const localePath = useLocalePath()
const router = useRouter()
const route = useRoute()
const eventStore = useEventSessionStore()
const isReqModalOpen = ref(false)
const reqModalTitle = ref('')
const reqModalText = ref('')
const coins = ref(0)
const coinIcon = '❄'
const activeTab = ref('quests')
const isMobilePanelOpen = ref(false)
const reputationPoints = ref(0)
const selectedLevel = ref(1)

const eventId = computed(() => String(route.params.id || ''))
const isEventOpen = computed(() => {
  const event = eventStore.events.find(e => e.id === eventId.value)
  // if (!event) return false
  const now = new Date().toLocaleDateString('fr-CA').slice(5)
  const start = event.start.slice(0, 5)
  const end = event.end.slice(0, 5)
  if (start > end) return now >= start || now <= end
  return now >= start && now <= end
})

const nav = computed(() => ([
  { id: 'quests', label: t('winterEvent.questions'), icon: '📜' },
  { id: 'reputation', label: t('winterEvent.eventShop'), icon: '🏆' }
]))
const computedPanelTitle = computed(() => {
  return activeTab.value === 'reputation'
      ? t('winterEvent.eventShop')
      : t('winterEvent.eventQuestions')
})
const pathToMain = () => {
  router.push('/')
}

function selectTab(tabId) {
  activeTab.value = tabId
  isMobilePanelOpen.value = true
}

function closeMobilePanel() {
  isMobilePanelOpen.value = false
  setTimeout(() => {
    if (window.innerWidth <= 767) activeTab.value = ''
  }, 300)
}

const ranks = computed(() => ([
  { level: 1, need: 0, title: t('winterEvent.firstReputation') },
  { level: 2, need: 1000, title: t('winterEvent.secondReputation') }
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

const progressPct = computed(() => {
  const maxRep = ranks.value.at(-1)?.need ?? 0
  if (maxRep === 0) return 0
  if (reputationPoints.value >= maxRep) return 100

  const span = Math.max(nextNeed.value - levelStart.value, 1)
  const cur = Math.min(Math.max(reputationPoints.value - levelStart.value, 0), span)
  return Math.round((cur / span) * 100)
})

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
  { id: 'quest-21', title: t('winterEventQuests.quest-21'), rewardCoins: 10, rewardRep: 25, isDone: false, icon: '💎' },
  { id: 'quest-1', title: t('winterEventQuests.quest-1'), rewardCoins: 10, rewardRep: 25, isDone: false, icon: '🎄' },
  { id: 'quest-2', title: t('winterEventQuests.quest-2'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🕯️' },
  { id: 'quest-3', title: t('winterEventQuests.quest-3'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🎅' },
  { id: 'quest-4', title: t('winterEventQuests.quest-4'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🌟' },
  { id: 'quest-5', title: t('winterEventQuests.quest-5'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🎁' },
  { id: 'quest-6', title: t('winterEventQuests.quest-6'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '📖' },
  { id: 'quest-7', title: t('winterEventQuests.quest-7'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '📅' },
  { id: 'quest-8', title: t('winterEventQuests.quest-8'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '👻' },
  { id: 'quest-9', title: t('winterEventQuests.quest-9'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '✨' },
  { id: 'quest-10', title: t('winterEventQuests.quest-10'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🏫' },
  { id: 'quest-11', title: t('winterEventQuests.quest-11'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🔗' },
  { id: 'quest-12', title: t('winterEventQuests.quest-12'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🧩' },
  { id: 'quest-13', title: t('winterEventQuests.quest-13'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🌍' },
  { id: 'quest-14', title: t('winterEventQuests.quest-14'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🔮' },
  { id: 'quest-15', title: t('winterEventQuests.quest-15'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '⛸️' },
  { id: 'quest-16', title: t('winterEventQuests.quest-16'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '❄️' },
  { id: 'quest-17', title: t('winterEventQuests.quest-17'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🔔' },
  { id: 'quest-18', title: t('winterEventQuests.quest-18'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🎀' },
  { id: 'quest-19', title: t('winterEventQuests.quest-19'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🎆' },
  { id: 'quest-20', title: t('winterEventQuests.quest-20'), rewardCoins: 10, rewardRep: 50, isDone: false, icon: '🥨' }
])

async function goToSession(questId) {
  await eventStore.start(eventId.value, String(questId))
  const to = localePath({ name: 'event-id-session', params: { id: route.params.id } })
  await router.push(to)
}

const shopByRank = ref({
  1: [
    { id: 'santaHat', title: t('winterEventShopItems.santaHat'), priceCoins: 30, isOwned: false, icon: Hat },
    { id: 'christmasBall', title: t('winterEventShopItems.christmasBall'), priceCoins: 30, isOwned: false, icon: ChristmasBall },
    { id: 'christmasWreath', title: t('winterEventShopItems.christmasWreath'), priceCoins: 30, isOwned: false, icon: ChristmasWreath }
  ],
  2: [
    { id: 'snowFall', title: t('winterEventShopItems.snowFall'), priceCoins: 120, isOwned: false, icon: SantaIcon }
  ]
})

function isSnowItem(item) {
  return item?.id === 'snowFall'
}

function canBuyItem(level, item) {
  if (!item) return false
  if (item.isOwned) return false
  if (currentLevel.value < level) return false
  if (coins.value < item.priceCoins) return false
  if (isSnowItem(item) && reputationPoints.value < 1000) return false
  return true
}

async function buyReward(level, rewardId) {
  if (currentLevel.value < level) return
  const item = shopByRank.value[level].find(i => i.id === rewardId)
  if (!item || item.isOwned) return
  if (isSnowItem(item) && reputationPoints.value < 1000) return
  if (coins.value < item.priceCoins) return
  coins.value -= item.priceCoins
  item.isOwned = true
  await eventStore.saveMainProgress({
    coins: coins.value,
    shopItems: { [item.id]: true }
  })
}

function openRequirementsModal(level, item) {
  reqModalTitle.value = item.title
  if (isSnowItem(item)) {
    reqModalText.value = `${t('winterEvent.needForReward')} ${item.priceCoins} ${coinIcon}  ${t('winterEvent.and')} 1000 ${t('winterEvent.reputation')}`
  } else {
    reqModalText.value = `${t('winterEvent.needForReward')} ${item.priceCoins} ${coinIcon}`
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
  if (window.innerWidth <= 767) activeTab.value = ''
})

</script>

<template>
  <div v-if="!isEventOpen">
    <div class="season__bg">
      <div class="sidebar__decor">
        <img class="present --right" :src="Present" alt="Present icon" />
      </div>
      <div class="svg-snow" aria-hidden="true">
        <VShowFall :image="Snow" />
      </div>
      <div class="xmas-wrapper">
        <div class="achv-layout">
          <aside class="achv-sidebar achv-card">
            <button @click="pathToMain" type="button" class="btn btn--home">
              {{ t('winterEvent.pathMain') }}
            </button>
            <div class="hero achv-card --flat">
              <div class="hero__info">
                <div class="hero__name">{{ t('winterEvent.event') }}</div>
              </div>
            </div>
            <div class="status achv-card --flat">
              <div class="status__row">
                <div class="status__value">{{ t('winterEvent.panel') }}</div>
              </div>
              <div class="status__row --rep">
                <div class="status__label">{{ t('winterEvent.reputation') }}</div>
                <!-- <div class="status__value">{{ levelProgressText }}</div> -->
              </div>
              <div class="bar">
                <span class="bar__text">{{ levelProgressText }}</span>
                <div class="bar__fill" :style="{ width: progressPct + '%' }"></div>
              </div>
              <div class="status__row">
                <div class="status__label">{{ t('winterEvent.currency') }}</div>
                <div class="status__value">{{ coins }} {{ coinIcon }}</div>
              </div>
            </div>
            <nav class="nav">
              <button
                  v-for="item in nav"
                  :key="item.id"
                  :class="['nav__btn', { 'is-active': activeTab === item.id }]"
                  @click="selectTab(item.id)"
              >
                <span class="nav__icon">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </button>
            </nav>
          </aside>
          <main class="achv-panel achv-card" :class="{ 'is-mobile-visible': isMobilePanelOpen }">
            <div class="panel__title">
              <h1>{{ computedPanelTitle }}</h1>
              <button class="mobile-back-btn" @click="closeMobilePanel">
                <span>X</span>
              </button>
            </div>
            <section v-if="activeTab === 'reputation'">
              <div class="section-head">
                <h2>{{ t('winterEvent.shop') }}</h2>
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
                  <div class="prize-card__title">{{ reward.title }}</div>
                  <img class="prize-card__icon" :src="reward.icon" alt="" />
                  <div class="prize-card__body">
                    <div class="prize-card__foot">
                      <span class="price">{{ reward.priceCoins }} {{ coinIcon }}</span>
                      <button
                          class="btn btn--candy"
                          :disabled="reward.isOwned"
                          @click="onRewardClick(selectedLevel, reward)"
                      >
                        <template v-if="reward.isOwned">{{ t('winterEvent.bought') }}</template>
                        <template v-else>{{ t('winterEvent.buy') }}</template>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section v-if="activeTab === 'quests'">
              <div class="quests">
                <div>
                  <h2 class="daily__title">{{ t('winterEvent.questions') }}</h2>
                </div>
                <div v-for="quest in quests" :key="quest.id" class="quest achv-card">
                  <div class="quest__icon">{{ quest.icon }}</div>
                  <div class="quest__body">
                    <div class="quest__title clickable">{{ quest.title }}</div>
                    <div class="quest__meta">
                      <div class="quest__inner">
                        <span class="meta__pill">{{ quest.rewardRep }} {{ t('winterEvent.rep') }}</span>
                        <span class="meta__pill">{{ quest.rewardCoins }} {{ coinIcon }}</span>
                      </div>
                      <button
                          :class="['btn', 'btn--candy', { 'btn--repeat': quest.isDone }]"
                          @click="goToSession(quest.id)"
                      >
                        {{ quest.isDone ? t('winterEvent.repeat') : t('winterEvent.execute') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
      <div v-if="isReqModalOpen" class="req-modal" @click.self="closeRequirementsModal">
        <div class="req-modal__card achv-card">
          <div class="req-modal__head">
            <div class="req-modal__title">{{ reqModalTitle }}</div>
            <button class="req-modal__close" type="button" @click="closeRequirementsModal">✕</button>
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
    <div class="svg-snow" aria-hidden="true">
      <VShowFall :image="Snow" />
    </div>
    <div class="closed-content">
      <h1>🔒 {{ t('winterEvent.notAllowedTitle') }}</h1>
      <p>{{ t('winterEvent.notAllowedText') }}</p>
      <button @click="pathToMain" class="btn btn--home">{{ t('winterEvent.pathMain') }}</button>
    </div>
  </div>
</template>

<style scoped>
.season__bg {
  font-family: "Nunito", sans-serif;
  width: 100%;
  min-height: 100vh;
  background: url('/images/backgoundSnow.webp') no-repeat center center;
  background-size: cover;
  overflow: hidden;
  position: relative;
}

.xmas-wrapper { position: relative; z-index: 2; }

.svg-snow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.status__label {
  display: flex;
  align-items: center;
  font-size: 20px;
}

.sidebar__decor {
  display: flex;
  position: absolute;
  right: -50px;
  bottom: -40px;
}

.present { width: 260px; }

.daily__title {
  margin-bottom: 15px;
  color: #6d7cb5;
  font-weight: 900;
}

.achv-layout {
  display: flex;
  gap: 22px;
  padding: 35px;
  height: 100vh;
}

.achv-card {
  border: 2px solid whitesmoke;
  border-radius: 18px;
  padding: 15px;
  backdrop-filter: blur(1px);
}

.status__value { font-size: 22px; }

.achv-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 360px;
  overflow: hidden;
  position: relative;
}

.btn--home {
  width: 100%;
  background: #F6A623;
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 12px 14px;
  font-weight: 900;
  box-shadow: 0 6px 0 #d79224;
  cursor: pointer;
  font-size: 20px;
}

.hero.achv-card {
  border: none;
  background: none;
  box-shadow: 0 0 0;
  padding: 6px;
}

.hero__name {
  font-weight: 900;
  color: #1A2140;
  font-size: 32px;
  text-align: center;
}

.status {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: #ffffff52;
}

.status__row {
  display: flex;
  justify-content: space-between;
  font-weight: 900;
  color: black;
  border-bottom: 2px dashed black;
  margin-bottom: 10px;
  padding-bottom: 5px;
}

.status__row.--rep { border-bottom: none; }

.bar {
  position: relative;
  height: 29px;
  border: none;
  border-radius: 10px;
  overflow: hidden;
  background: #5873c5;
  text-align: center;
  margin-bottom: 15px;
}

.bar__text {
  transform: translate(-50%, 25%);
  position: absolute;
  left: 50%;
  color: white;
  font-size: 14px;
  text-align: center;
}

.bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #2fb36e, #7ef3b0);
  box-shadow: 0 0 10px #2fb36e80;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav__btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 2px solid whitesmoke;
  color: #1A2140;
  font-weight: 600;
  border-radius: 14px;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 4px 0 #f1ecec;
}

.nav__btn.is-active {
  background: #51c150;
  border: 2px solid transparent;
  color: whitesmoke;
  box-shadow: 0 4px 0 #51a151;
}

.achv-panel {
  background: rgb(233 244 255 / 15%);
  flex-grow: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.achv-panel section {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.achv-panel section::-webkit-scrollbar { width: 0; }

.panel__title {
  display: inline-block;
  margin-bottom: 25px;
  background: #51c150;
  border-radius: 15px;
  box-shadow: 0 5px 0 #4e754e;
  padding: 10px 15px;
  position: relative;
}

.panel__title h1 {
  font-size: 29px;
  font-weight: 900;
  color: whitesmoke;
}

.section-head { align-items: center; margin: 0 0 14px; }

.section-head h2 {
  font-size: 24px;
  font-weight: 900;
  color: #6d7cb5;
  margin-bottom: 15px;
}

.rank-switch {
  display: inline-block;
  background: whitesmoke;
  padding: 5px;
  border-radius: 14px;
  gap: 8px;
}

.pill {
  border: none;
  color: #1A2140;
  background: none;
  border-radius: 14px;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 17px;
}

.pill.is-active { background: #9B8CFF; color: whitesmoke; }

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.prize-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: #ffffff52;
}

.prize-card__icon { width: 110px; height: 110px; }

.prize-card__title {
  font-weight: 900;
  font-size: 16px;
  margin-bottom: 8px;
  color: #1A2140;
}

.prize-card__foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.price {
  font-weight: 900;
  color: whitesmoke;
  background: #9B8CFF;
  height: 44px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 5px 8px;
}

.quests { flex: 1 1 auto; min-height: 0; }

.quest {
  display: flex;
  gap: 12px;
  background: #ffffff52;
  box-shadow: 0 5px 0 rgba(128, 124, 124, 0.53);
  margin-bottom: 15px;
}

.quest__icon { font-size: 50px; }

.quest__body { width: 100%; }

.quest__title {
  font-weight: 900;
  margin-bottom: 6px;
  color: #1A2140;
}

.quest__meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.quest__inner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.meta__pill {
  background: #c5e6ff;
  color: #5873c5;
  border: none;
  border-radius: 14px;
  padding: 6px 10px;
  font-weight: 600;
}

.btn {
  border-radius: 12px;
  padding: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn--candy {
  min-width: 130px;
  background: #F6A623;
  color: #fff;
  border: none;
  box-shadow: 0 5px #d79224;
  font-size: 18px;
  padding: 10px 25px;
  font-family: "Nunito", sans-serif;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.btn--candy:disabled {
  background: #455268;
  color: #c7d1e6;
  box-shadow: none;
  height: 44px;
}

.btn--repeat { background: #4CAF50; box-shadow: 0 5px #388E3C; }

.clickable { cursor: pointer; }

.event-closed {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a2140;
  color: white;
  font-family: "Nunito", sans-serif;
}

.closed-content {
  text-align: center;
  padding: 40px;
  border: 2px solid whitesmoke;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
}

.closed-content h1 { margin-bottom: 20px; font-size: 2rem; }

.closed-content p {
  margin-bottom: 30px;
  font-size: 1.2rem;
  color: #c7d1e6;
}

.mobile-back-btn { display: none; }

/* ---------------------------
   MODAL
---------------------------- */
.req-modal {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.req-modal__card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
}

.req-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.req-modal__title {
  font-weight: 900;
  font-size: 18px;
  color: #1A2140;
}

.req-modal__close {
  border: none;
  background: #ee7430;
  color: white;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 900;
}

.req-modal__text {
  font-weight: 700;
  color: #1A2140;
  line-height: 1.35;
  margin-bottom: 14px;
}

.req-modal__btn { width: 100%; }

/* ---------------------------
   MOBILE
---------------------------- */
@media (max-width: 767px) {
  .achv-layout {
    display: block;
    padding: 15px;
    position: relative;
  }

  .achv-sidebar {
    width: 100%;
    min-width: 0;
    margin-bottom: 20px;
    z-index: 10;
  }

  .achv-panel {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: url('/images/backgoundSnow.webp') no-repeat center center;
    background-size: cover;
    overflow: hidden;
    border-radius: 0;
    padding: 20px;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: none;
  }

  .achv-panel.is-mobile-visible { transform: translateX(0); }

  .mobile-back-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    border: 2px solid #ffffff;
    background: #ee7430;
    width: 40px;
    height: 40px;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 12px;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
  }
}

@media (max-width: 1023px) {
  .quest {
    flex-direction: column;
    align-items: center;
  }

  .quest__meta {
    flex-direction: column;
    align-items: stretch;
  }

  .quest__inner {
    justify-content: center;
    margin-bottom: 10px;
  }

  .quest__title {
    font-size: 18px;
    margin-bottom: 15px;
    text-align: center;
  }

  .cards { flex-wrap: wrap; }

  .pill {
    text-align: center;
    width: 100%;
  }

  .rank-switch { width: 100%; }
}

@media (min-width: 1024px) {
  .btn--home:hover { background: #e7a336; }

  .clickable:hover {
    text-decoration: underline;
    color: #3453a9;
  }

  .clickable:focus {
    outline: 3px solid #9B8CFF;
    border-radius: 6px;
  }

  .btn--repeat:hover {
    background: #66BB6A;
    box-shadow: 0 5px #388E3C;
  }

  .btn--candy:not(.btn--repeat):hover {
    background: #e7a336;
    box-shadow: 0 5px #d79224;
  }
}

@media (max-width: 480px) {
  .prize-card { width: 100%; }
}
</style>
