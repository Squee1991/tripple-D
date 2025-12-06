<script setup>
import {ref, computed, onMounted} from 'vue'
import VShowFall from "./V-showFall.vue"
import Present from '../assets/images/mery-christmas/Present.svg'
import {useRouter, useRoute} from 'vue-router'
import { useEventSessionStore } from '../../store/eventsStore.js'
import Hat from 'assets/images/event-rewards/winter-event/winter-rewards/santa-hat.svg'
import ChristmasBall from 'assets/images/event-rewards/winter-event/winter-rewards/christmas-ball.svg'
import ChristmasWreath from 'assets/images/event-rewards/winter-event/winter-rewards/christmas-wreath.svg'
import SantaIcon from 'assets/images/event-rewards/winter-event/winter-rewards/SnowEffect.svg'
import DeepAvatar from 'assets/images/event-rewards/winter-event/winter-rewards/deerAvatar.png'
import ElfIcon from 'assets/images/event-rewards/winter-event/winter-rewards/elf-icon.svg'
import Snow from 'assets/images/mery-christmas/Snow.svg'
const { t } = useI18n()
const isEventOpen = computed(() => {
  const event = eventStore.events.find(e => e.id === eventId.value)
  if (!event) return false
  const now = new Date().toLocaleDateString('fr-CA').slice(5)
  const start = event.start.slice(0, 5)
  const end = event.end.slice(0, 5)
  if (start > end) {
    return now >= start || now <= end
  }
  return now >= start && now <= end
})

const router = useRouter()
const route = useRoute()
const localePath = useLocalePath()
const eventStore = useEventSessionStore()

const eventId = computed(() => String(route.params.id || ''))

const coins = ref(0)
const coinIcon = '❄'
const activeTab = ref('reputation')
const nav = [
  {id: 'reputation', label: t('winterEvent.reputation'), icon: '🏆'},
  {id: 'quests',     label: t('winterEvent.questions'),   icon: '📜'}
]
const selectedLevel = ref(1)

const computedPanelTitle = computed(() => activeTab.value === 'reputation' ? t('winterEvent.eventShop') : t('winterEvent.eventQuestions'))

const pathToMain = () => { router.push('/') }

const reputationPoints = ref(0)
const ranks = [
  {level: 1, need: 0,   title: t('winterEvent.firstReputation')},
  {level: 2, need: 1000, title: t('winterEvent.secondReputation')},
]

const quests = ref([
  { id: 'quest-1',  title: 'Викторина: Дух Рождества',          rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🎄' },
  { id: 'quest-2',  title: 'Традиции и символы',                rewardCoins: 300, rewardRep: 1000, isDone: false, icon: '🕯️' },
  { id: 'quest-3',  title: 'Николаус и персонажи',              rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🎅' },
  { id: 'quest-4',  title: 'Магия Адвента',                     rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🌟' },
  { id: 'quest-5',  title: 'Искусство дарить подарки',          rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🎁' },
  { id: 'quest-6',  title: 'Чтение: Рождество в ФРГ',           rewardCoins: 5, rewardRep: 40, isDone: false, icon: '📖' },
  { id: 'quest-7',  title: 'Чтение: Праздничные дни',           rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🇩🇪' },
  { id: 'quest-8',  title: 'Легенда о Сильвестре',              rewardCoins: 5, rewardRep: 40, isDone: false, icon: '👻' },
  { id: 'quest-9',  title: 'Сказка: Заколдованный лес',         rewardCoins: 5, rewardRep: 40, isDone: false, icon: '✨' },
  { id: 'quest-10', title: 'Зимние каникулы',                   rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🏫' },
  { id: 'quest-11', title: 'Найди пару: Символы',               rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🔗' },
  { id: 'quest-12', title: 'Найди пару: Традиции',              rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🧩' },
  { id: 'quest-13', title: 'Вокруг света: Обычаи',              rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🌍' },
  { id: 'quest-14', title: 'Европа: Поверья и мифы',            rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🔮' },
  { id: 'quest-15', title: 'Предметы и зимний досуг',           rewardCoins: 5, rewardRep: 40, isDone: false, icon: '⛸️' },
  { id: 'quest-16', title: 'Лексика: Зима и НГ',                rewardCoins: 5, rewardRep: 40, isDone: false, icon: '❄️' },
  { id: 'quest-17', title: 'Лексика: Рождество',                rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🔔' },
  { id: 'quest-18', title: 'Лексика: Подготовка',               rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🎀' },
  { id: 'quest-19', title: 'Лексика: Новогодняя ночь',          rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🎆' },
  { id: 'quest-20', title: 'Лексика: Немецкий праздник',        rewardCoins: 5, rewardRep: 40, isDone: false, icon: '🥨' },
  { id: 'quest-21', title: 'Сокровищница слов',                 rewardCoins: 5, rewardRep: 40, isDone: false, icon: '💎' },
]);

const currentLevel = computed(() => {
  let lvl = 1
  for (const rank of ranks) if (reputationPoints.value >= rank.need) lvl = rank.level
  return lvl
})
const levelStart = computed(() => ranks[currentLevel.value - 1]?.need ?? 0)
const nextNeed   = computed(() => ranks[currentLevel.value]?.need ?? ranks.at(-1).need)

const progressPct = computed(() => {
  const maxRep = ranks[ranks.length - 1].need
  if (reputationPoints.value >= maxRep) return 100
  const span = Math.max(nextNeed.value - levelStart.value, 1)
  const cur  = Math.min(Math.max(reputationPoints.value - levelStart.value, 0), span)
  return Math.round((cur / span) * 100)
})
const levelTotal = computed(() => Math.max(nextNeed.value - levelStart.value, 1))
const levelCurrent = computed(() => Math.max(reputationPoints.value - levelStart.value, 0))

const levelProgressText = computed(() => {
  const maxRep = ranks[ranks.length - 1].need
  if (reputationPoints.value >= maxRep) {
    return `${maxRep} / ${maxRep}`
  }
  return `${levelCurrent.value} / ${levelTotal.value}`
})

function setSelectedLevel(lvl){ selectedLevel.value = lvl }

async function goToSession(questId) {
  await eventStore.start(eventId.value, String(questId))
  const to = localePath({ name: 'event-id-session', params: { id: route.params.id } })
  await router.push(to)
}

async function refreshProgressBadges() {
  const progressData = await eventStore.loadEventProgress(eventId.value)
  if (!progressData) {
    return
  }

  coins.value = progressData.coins || 0
  reputationPoints.value = progressData.reputationPoints || 0
  const questsProgress = progressData.quests || {}
  quests.value = quests.value.map(quest => {
    const progress = questsProgress[quest.id]
    return {
      ...quest,
      isDone: progress ? progress.finished : false
    }
  })

  const shopItems = progressData.shopItems || {}
  Object.values(shopByRank.value).forEach(list => {
    list.forEach(item => {
      if (shopItems[item.id]) {
        item.isOwned = true
      }
    })
  })
}
onMounted(() => {
  refreshProgressBadges()
})

const shopByRank = ref({
  1: [
    {id: 'santaHat', title:  t('winterEventShopItems.santaHat'), priceCoins: 20, isOwned: false, icon: Hat},
    {id: 'christmasBall', title: t('winterEventShopItems.christmasBall'),  priceCoins: 20, isOwned: false, icon: ChristmasBall},
    {id: 'christmasWreath', title: t('winterEventShopItems.christmasWreath'),  priceCoins: 20, isOwned: false, icon: ChristmasWreath}
  ],
  2: [
    {id: 'snowFall', title: t('winterEventShopItems.snowFall'),  priceCoins: 300, isOwned: false, icon: SantaIcon},
  ],
})
async function buyReward(level, rewardId) {
  if (currentLevel.value < level) return
  const item = shopByRank.value[level].find(i => i.id === rewardId)
  if (!item || item.isOwned) return
  if (coins.value < item.priceCoins) return
  coins.value -= item.priceCoins
  item.isOwned = true
  await eventStore.saveMainProgress({
    coins: coins.value,
    shopItems: {
      [item.id]: true
    }
  })
}

</script>

<template>
  <div v-if="!isEventOpen">
    <div class="season__bg">
      <div class="sidebar__decor">
        <img class="present --right" :src="Present" alt="Present icon">
      </div>
      <div class="svg-snow" aria-hidden="true">
        <VShowFall :image="Snow"/>
      </div>
      <div class="xmas-wrapper">
        <div class="achv-layout">
          <aside class="achv-sidebar achv-card">
            <button @click="pathToMain" type="button" class="btn btn--home">{{ t('winterEvent.pathMain')}}</button>
            <div class="hero achv-card --flat">
              <div class="hero__info">
                <div class="hero__name">{{ t('winterEvent.event')}}</div>
              </div>
            </div>
            <div class="status achv-card --flat">
              <div class="status__row">
                <div class="status__value">{{ t('winterEvent.panel')}}</div>
              </div>
              <div class="bar">
                <div class="bar__fill" :style="{ width: progressPct + '%' }"></div>
              </div>
              <div class="status__row">
                <div class="status__label">{{ t('winterEvent.reputation')}}</div>
                <div class="status__value">{{ levelProgressText }}</div>
              </div>
              <div class="status__row">
                <div class="status__label">{{ t('winterEvent.currency')}}</div>
                <div class="status__value">{{ coins }} {{ coinIcon }}</div>
              </div>
            </div>
            <nav class="nav">
              <button
                  v-for="item in nav"
                  :key="item.id"
                  :class="['nav__btn', { 'is-active': activeTab === item.id }]"
                  @click="activeTab = item.id"
              >
                <span class="nav__icon">{{ item.icon }}</span>
                <span>{{ item.label }}</span>
              </button>
            </nav>
          </aside>
          <main class="achv-panel achv-card">
            <div class="panel__title">
              <h1>{{ computedPanelTitle }}</h1>
            </div>
            <section v-if="activeTab === 'reputation'">
              <div class="section-head">
                <h2>{{ t('winterEvent.shop')}}</h2>
                <div class="rank-switch">
                  <button
                      v-for="rank in ranks"
                      :key="rank.level"
                      :class="['pill', { 'is-active': selectedLevel === rank.level }]"
                      @click="setSelectedLevel(rank.level)"
                  >{{ rank.title }}
                  </button>
                </div>
              </div>
              <div class="cards">
                <div v-for="reward in shopByRank[selectedLevel]" :key="reward.id" class="prize-card achv-card">
                  <div class="prize-card__title">{{ reward.title }}</div>
                  <img class="prize-card__icon" :src="reward.icon" alt="">
                  <div class="prize-card__body">
                    <div class="prize-card__foot">
                      <span class="price">{{ reward.priceCoins }} {{ coinIcon }}</span>
                      <button
                          class="btn btn--candy"
                          :disabled="reward.isOwned || currentLevel < selectedLevel || coins < reward.priceCoins"
                          @click="buyReward(selectedLevel, reward.id)"
                      >
                        <template v-if="reward.isOwned">{{ t('winterEvent.bought')}}</template>
                        <template v-else-if="currentLevel < selectedLevel">{{ t('winterEvent.notAllowed')}}</template>
                        <template v-else-if="coins < reward.priceCoins">{{ t('winterEvent.notEnough')}}</template>
                        <template v-else>{{ t('winterEvent.buy')}}</template>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section v-if="activeTab === 'quests'">
              <div class="quests">
                <div><h2 class="daily__title">{{ t('winterEvent.questions')}}</h2></div>
                <div v-for="quest in quests" :key="quest.id" class="quest achv-card">
                  <div class="quest__icon">{{ quest.icon }}</div>
                  <div class="quest__body">
                    <div class="quest__title clickable">{{ quest.title }}
                    </div>
                    <div class="quest__meta">
                      <div class="quest__inner">
                        <span class="meta__pill">{{ quest.rewardRep }} {{ t('winterEvent.rep')}}</span>
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
    </div>
  </div>
  <div v-else class="event-closed">
    <div class="svg-snow" aria-hidden="true">
      <VShowFall :image="Snow"/>
    </div>
    <div class="closed-content">
      <h1>🔒 {{ t('winterEvent.notAllowedTitle')}}</h1>
      <p>{{ t('winterEvent.notAllowedText')}}</p>
      <button @click="pathToMain" class="btn btn--home">{{ t('winterEvent.pathMain')}}</button>
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

.xmas-wrapper {
  position: relative;
  z-index: 2
}

.svg-snow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0
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

.present {
  width: 260px;
}

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

.status__value {
  font-size: 22px;
}

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
  gap: 10px;
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

.bar {
  height: 25px;
  border: none;
  border-radius: 10px;
  overflow: hidden;
  background: #5873c5;
}

.bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #2fb36e, #7ef3b0);
  box-shadow: 0 0 10px #2fb36e80
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 15px
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
  border: none;
  color: whitesmoke;
  border: 2px solid transparent;
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

.achv-panel section::-webkit-scrollbar {
  width: 0;
}

.panel__title {
  display: inline-block;
  margin-bottom: 25px;
  background: #51c150;
  border-radius: 15px;
  box-shadow: 0 5px 0 #4e754e;
  padding: 10px 15px;
}

.panel__title h1 {
  font-size: 32px;
  font-weight: 900;
  color: whitesmoke;
}

.section-head {
  align-items: center;
  margin: 0 0 14px
}

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

.pill.is-active {
  background: #9B8CFF;
  color: whitesmoke;
}

.cards {
  display: flex;
  gap: 10px
}

.prize-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: #ffffff52;
}

.prize-card__icon {
  width: 110px;
  height: 110px;
}

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
  gap: 10px
}

.price {
  font-weight: 900;
  color: whitesmoke;
  background: #9B8CFF;
  height: 44px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 5px 8px
}

.quests {
  flex: 1 1 auto;
  min-height: 0;
}

.quest {
  display: flex;
  gap: 12px;
  background: #ffffff52;
  box-shadow: 0 5px 0 rgba(128, 124, 124, 0.53);
  margin-bottom: 15px;
}

.quest__icon {
  font-size: 50px
}

.quest__body {
  width: 100%;
}

.quest__title {
  font-weight: 900;
  margin-bottom: 6px;
  color: #1A2140;
}

.quest__meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center
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
  cursor: pointer
}

.btn--ghost {
  background: #0f254a;
  color: #e9f2ff;
  border: 2px solid #143760;
  display: none;
}

.btn--candy {
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
  border-color: #2a3850;
  box-shadow: none;
  height: 44px;
}

.btn--repeat {
  background: #4CAF50;
  box-shadow: 0 5px #388E3C;
}

.btn--repeat:hover {
  background: #66BB6A;
  box-shadow: 0 5px #388E3C;
}

.btn--candy:not(.btn--repeat):hover {
  background: #e7a336;
  box-shadow: 0 5px #d79224;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  text-decoration: underline;
  color: #3453a9;
}

.clickable:focus {
  outline: 3px solid #9B8CFF;
  border-radius: 6px;
}

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

.closed-content h1 {
  margin-bottom: 20px;
  font-size: 2rem;
}

.closed-content p {
  margin-bottom: 30px;
  font-size: 1.2rem;
  color: #c7d1e6;
}

@media (max-width: 767px) {
  .achv-layout {
    padding: 15px;
    gap: 12px;
  }
}

@media (max-width: 1023px) {
  .quest {
    flex-direction: column;
  }
  .quest__meta {
    flex-direction: column;
    align-items: stretch;
  }
  .quest__inner {
    justify-content: start;
    margin-bottom: 10px;
  }
  .quest__title {
    font-size: 18px;
    margin-bottom: 15px;
  }
  .panel__title {
    font-size: 26px;
  }
  .cards {
    flex-wrap: wrap;
  }
  .pill {
    text-align: center;
    width: 100%;
  }
  .rank-switch {
    width: 100%;
  }
}

@media (min-width: 1024px) {
  .btn--home:hover {
    background: #e7a336;
  }
}
</style>
