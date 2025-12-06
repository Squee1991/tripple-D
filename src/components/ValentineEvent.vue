<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import { useEventSessionStore } from '../../store/eventsStore.js'
import HeartFall from "assets/images/mery-christmas/heartFall.svg";
import VShowFall from "~/src/components/V-showFall.vue";
import TeddyGift from 'assets/images/event-rewards/valentine-event/valentine-rewards/teddy-bear.svg'
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

const eventStore = useEventSessionStore()
const router = useRouter()
const route = useRoute()
const eventId = computed(() => String(route.params.id || ''))
const localePath = useLocalePath()

const coins = ref(0)
const coinIcon = '💘'
const activeTab = ref('reputation')
const nav = [
  {id: 'reputation', label: 'Репутация', icon: '🏆'},
  {id: 'quests', label: 'Задания', icon: '📜'},
]
const selectedLevel = ref(1)

const computedPanelTitle = computed(() => activeTab.value === 'reputation' ? 'Магазин ивента' : 'Ежедневные задания')

const pathToMain = () => router.push('/')

const reputationPoints = ref(0)
const ranks = [
  {level: 1, need: 0, title: 'Симпатия'},
  {level: 2, need: 300, title: 'Амур'},
]

const quests = ref([
  {id: 'quest-1', title: 'Список слов', rewardCoins: 20, rewardRep: 20, isDone: false, icon: '📘'},
  {id: 'quest-2', title: 'Выбери верное слово', rewardCoins: 20, rewardRep: 20, isDone: false, icon: '📘'},
  {id: 'quest-3', title: 'Романтические свидания', rewardCoins: 20, rewardRep: 20, isDone: false, icon: '📘'},
  {id: 'quest-4', title: 'Прослушай', rewardCoins: 20, rewardRep: 20, isDone: false, icon: '📘'},
  {id: 'quest-5', title: 'Соедини слова', rewardCoins: 20, rewardRep: 20, isDone: false, icon: '📘'},
  {id: 'quest-6', title: 'Выбери вариант ответа', rewardCoins: 20, rewardRep: 20, isDone: false, icon: '📘'}
])

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

const setSelectedLevel = (lvl) => {
  selectedLevel.value = lvl
}

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
    {id: 'r1', title: 'Плюшевый мишка', priceCoins: 25, isOwned: false, icon: TeddyGift},
    {id: 'r2', title: 'Мини-рамка «Розы»', priceCoins: 40, isOwned: false, icon: '🌹'},
  ],
  2: [
    {id: 'r3', title: 'Тема «Pink Light»', priceCoins: 90, isOwned: false, icon: '✨'},
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

async function resetAll() {
  await eventStore.resetEventProgress(eventId.value)
  coins.value = 0
  reputationPoints.value = 0
  quests.value.forEach(quest => (quest.isDone = false))
  Object.values(shopByRank.value).forEach(list => list.forEach(item => (item.isOwned = false)))
  selectedLevel.value = 1
}
</script>

<template>
  <div v-if="!isEventOpen">
    <div class="valentine-bg">
      <div class="svg-snow" aria-hidden="true">
        <VShowFall :image="HeartFall"/>
      </div>
      <div class="wrapper">
        <div class="achv-layout">
          <aside class="achv-sidebar achv-card">
            <button @click="pathToMain" type="button" class="btn btn--home">На главную</button>
            <div class="hero achv-card --flat">
              <div class="hero__info">
                <div class="hero__name">День Купидона</div>
              </div>
            </div>
            <div class="status achv-card --flat">
              <div class="status__row">
                <div class="status__value">Панель ивента</div>
              </div>
              <div class="bar">
                <div class="bar__fill" :style="{ width: progressPct + '%' }"/>
              </div>
              <div class="status__row">
                <div class="status__label">Репутация</div>
                <div class="status__value">{{ levelProgressText }}</div>
              </div>
              <div class="status__row">
                <div class="status__label">Валюта</div>
                <div class="status__value">{{ coins }} {{ coinIcon }}</div>
              </div>
              <button class="btn btn--ghost" @click="resetAll">Сбросить (тест)</button>
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
                <h2>Магазин по репутации</h2>
                <div class="rank-switch">
                  <button
                      v-for="r in ranks"
                      :key="r.level"
                      :class="['pill', { 'is-active': selectedLevel === r.level }]"
                      @click="setSelectedLevel(r.level)"
                  >{{ r.title }}
                  </button>
                </div>
              </div>
              <div class="cards">
                <div v-for="reward in shopByRank[selectedLevel]" :key="reward.id"
                     class="prize-card achv-card">
                  <div class="prize-card__title">{{ reward.title }}</div>
                  <img  class="prize-card__icon" :src="reward.icon" alt="prize icon">
                  <div class="prize-card__body">
                    <div class="prize-card__foot">
                      <span class="price">{{ reward.priceCoins }} {{ coinIcon }}</span>
                      <button
                          class="btn btn--candy"
                          :disabled="reward.isOwned || currentLevel < selectedLevel || coins < reward.priceCoins"
                          @click="buyReward(selectedLevel, reward.id)"
                      >
                        <template v-if="reward.isOwned">Куплено</template>
                        <template v-else-if="currentLevel < selectedLevel">Недоступно</template>
                        <template v-else-if="coins < reward.priceCoins">Не хватает</template>
                        <template v-else>Купить</template>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section v-else>
              <div class="quests">
                <div><h2 class="daily__title">Ежедневные задания</h2></div>
                <div v-for="quest in quests" :key="quest.id" class="quest achv-card">
                  <div class="quest__icon">{{ quest.icon }}</div>
                  <div class="quest__body">
                    <div class="quest__title clickable">{{ quest.title }}</div>
                    <div class="quest__meta">
                      <div class="quest__inner">
                        <span class="meta__pill">{{ quest.rewardRep }} реп.</span>
                        <span class="meta__pill">{{ quest.rewardCoins }} {{ coinIcon }}</span>
                      </div>
                      <button class="btn btn--candy"
                              :class="{ 'btn--repeat': quest.isDone }"
                              @click="goToSession(quest.id)">
                        {{ quest.isDone ? 'Выполнено' : 'Выполнить' }}
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
      <VShowFall :image="HeartFall"/>
    </div>
    <div class="closed-content">
      <h1>🔒 Событие недоступно</h1>
      <p>Это событие еще не началось или уже завершилось.</p>
      <button @click="pathToMain" class="btn btn--home">На главную</button>
    </div>
  </div>
</template>

<style scoped>

.valentine-bg {
  font-family: "Nunito", sans-serif;
  min-height: 100vh;
  background: radial-gradient(1200px 600px at 20% -10%, #ffd1dc 0%, transparent 60%),
  radial-gradient(1200px 600px at 120% 110%, #ffe3ea 0%, transparent 60%),
  #ffe9ef;
  background: url("/images/ValentineBackground.webp") no-repeat center center;
  background-size: cover;
  overflow: hidden;
  position: relative;
}

.wrapper {
  position: relative;
  z-index: 1;
}

.achv-layout {
  display: flex;
  gap: 22px;
  padding: 35px;
  height: 100vh;
}

.achv-card {
  border: 2px solid #fff4f7;
  border-radius: 18px;
  padding: 15px;
  backdrop-filter: blur(1px);
}

.achv-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 360px;
  overflow: hidden;
  position: relative;
}

.achv-panel {
  background: rgb(255 255 255 / 35%);
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

.btn--home {
  width: 100%;
  background: linear-gradient(180deg, #f88ca9, #e05c84);
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 12px 14px;
  font-weight: 900;
  box-shadow: 0 6px 0 #b94d6e;
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
  color: #6b1030;
  font-size: 32px;
  text-align: center;
}

.status {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #ffffff88;
}

.status__row {
  display: flex;
  justify-content: space-between;
  font-weight: 900;
  color: #6b1030;
  border-bottom: 2px dashed #6b1030;
  margin-bottom: 10px;
  padding-bottom: 5px;
}

.status__value {
  font-size: 22px;
}

.status__label {
  display: flex;
  align-items: center;
  font-size: 20px;
}

.bar {
  height: 25px;
  border: none;
  border-radius: 10px;
  overflow: hidden;
  background: #ff9db8;
}

.bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #ff4d88, #ffc0cb);
  box-shadow: 0 0 10px #ff4d8880;
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
  border: 2px solid #fff4f7;
  color: #6b1030;
  font-weight: 600;
  border-radius: 14px;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 4px 0 #f7dbe3;
  background: #fff;
}

.nav__btn.is-active {
  background: #FF7F7F;
  color: #fff;
  border: 2px solid transparent;
  box-shadow: 0 4px 0 #d5557e;
}

.panel__title {
  display: inline-block;
  margin-bottom: 25px;
  background: #EC4899;
  border-radius: 15px;
  box-shadow: 0 5px 0 #d5557e;
  padding: 10px 15px;
}

.panel__title h1 {
  font-size: 32px;
  font-weight: 900;
  color: #fff;
}

.section-head {
  align-items: center;
  margin: 0 0 14px;
}

.section-head h2 {
  font-size: 24px;
  font-weight: 900;
  color: #6b1030;
  margin-bottom: 15px;
}

.rank-switch {
  display: inline-block;
  background: #fff;
  padding: 5px;
  border-radius: 14px;
  gap: 8px;
}

.pill {
  border: none;
  color: #6b1030;
  background: none;
  border-radius: 14px;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 17px;
}

.pill.is-active {
  background: #ff9db8;
  color: #6b1030;
}

.cards {
  display: flex;
  gap: 10px;
}

.prize-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: #ffffff88;
}

.prize-card__icon {
  font-size: 80px;
  line-height: 110px;
  width: 110px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prize-card__title {
  font-weight: 900;
  font-size: 16px;
  margin-bottom: 8px;
  color: #6b1030;
  text-align: center;
}

.prize-card__body {
  width: 100%;
}

.prize-card__foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.price {
  font-weight: 900;
  color: #fff;
  background: #ff6b9a;
  height: 44px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding: 5px 8px;

}

.daily__title {
  margin-bottom: 15px;
  color: #6b1030;
  font-weight: 900;
}

.quests {
  flex: 1 1 auto;
  min-height: 0;
}

.quest {
  display: flex;
  gap: 12px;
  background: #ffffff88;
  box-shadow: 0 5px 0 rgba(128, 124, 124, 0.35);
  margin-bottom: 15px;
}

.quest__icon {
  font-size: 50px;
}

.quest__body {
  width: 100%;
}

.quest__title {
  font-weight: 900;
  margin-bottom: 6px;
  color: #6b1030;
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
  background: #ffd1dc;
  color: #6b1030;
  border: none;
  border-radius: 14px;
  padding: 6px 10px;
  font-weight: 600;
}

/* --- Buttons --- */
.btn {
  border-radius: 12px;
  padding: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn--ghost {
  background: #6b1030;
  color: #ffe9ef;
  border: 2px solid #8e1a44;
  display: none;
}

.btn--candy {
  background: #ff6b9a;
  color: #fff;
  border: none;
  box-shadow: 0 5px #d5557e;
  font-size: 18px;
  padding: 10px 25px;
  font-family: "Nunito", sans-serif;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.btn--candy:disabled {
  background: #8f6a77;
  color: #f3dbe3;
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

.clickable {
  cursor: pointer;
}

.clickable:hover {
  text-decoration: underline;
  color: #b94d6e;
}

/* --- Closed State --- */
.event-closed {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6b1030;
  color: white;
  font-family: "Nunito", sans-serif;
}

.closed-content {
  text-align: center;
  padding: 40px;
  border: 2px solid #fff4f7;
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
  color: #ffd1dc;
}

.svg-snow {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0
}

/* --- Media Queries (Синхронизировано с Winter) --- */
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
    background: #d5557e;
  }
}
</style>