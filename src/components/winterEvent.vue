<script setup>
import {ref, computed} from 'vue'
import VShowFall from "./V-showFall.vue";
import Present from '../assets/images/mery-christmas/Present.svg'
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

const coins = ref(0)
const coinIcon = '❄'
const activeTab = ref('reputation')
const nav = [
  {id: 'reputation', label: 'Репутация', icon: '🏆'},
  {id: 'quests', label: 'Задания', icon: '📜'}
]
const selectedLevel = ref(1)
const computedPanelTitle = computed(() =>
    activeTab.value === 'reputation' ? 'Магазин ивента' : 'Ежедневные задания'
)

const pathToMain = () => {
  router.push('/')
}

const reputationPoints = ref(0)
const ranks = [
  {level: 1, need: 0, title: 'Дружелюбие'},
  {level: 2, need: 120, title: 'Уважение'},
  {level: 3, need: 300, title: 'Превознесение'}
]
const quests = ref([
  {id: 'q1', title: '10 зимних слов', rewardCoins: 20, rewardRep: 20, isDone: false, icon: '📘'},
  {id: 'q2', title: 'Präsens: 5 предложений', rewardCoins: 25, rewardRep: 30, isDone: false, icon: '✍️'},
  {id: 'q3', title: 'Артикли: 10 карточек', rewardCoins: 35, rewardRep: 40, isDone: false, icon: '🃏'},
  {id: 'q4', title: 'Perfekt: составь 6 примеров', rewardCoins: 45, rewardRep: 60, isDone: false, icon: '⏳'},
  {id: 'q5', title: 'Диалог в кафе: мини-сценка', rewardCoins: 60, rewardRep: 80, isDone: false, icon: '☕'}
])
const currentLevel = computed(() => {
  let lvl = 1
  for (const r of ranks) if (reputationPoints.value >= r.need) lvl = r.level
  return lvl
})
const levelStart = computed(() => ranks[currentLevel.value - 1]?.need ?? 0)
const nextNeed = computed(() => ranks[currentLevel.value]?.need ?? ranks.at(-1).need)
const progressPct = computed(() => {
  const span = Math.max(nextNeed.value - levelStart.value, 1)
  const cur = Math.min(Math.max(reputationPoints.value - levelStart.value, 0), span)
  return Math.round((cur / span) * 100)
})
const levelTotal = computed(() => Math.max(nextNeed.value - levelStart.value, 1))
const levelCurrent = computed(() => Math.max(reputationPoints.value - levelStart.value, 0))
const levelProgressText = computed(() => {
  const isMax = currentLevel.value === ranks[ranks.length - 1].level
  return isMax ? `${levelCurrent.value} / МАКС` : `${levelCurrent.value} / ${levelTotal.value}`
})
const localePath = useLocalePath()

async function goToSession(questId) {
  const to = localePath({
    name: 'event-id-session',
    params: { id: route.params.id },
    query: { questId, step: '1' }
  })
  await router.push(to)
}



const setSelectedLevel = (lvl) => {selectedLevel.value = lvl}
const shopByRank = ref({
  1: [
    {id: 'r1', title: 'Стикер «Снежинка»', priceCoins: 25, isOwned: false, icon: '🥶'},
    {id: 'r2', title: 'Мини-рамка «Лёд»', priceCoins: 40, isOwned: false, icon: '🧊'},
    {id: 'r3', title: 'Мини-рамка «Лёд»', priceCoins: 40, isOwned: false, icon: '🧊'},
  ],
  2: [
    {id: 'r3', title: 'Тема «Winter Light»', priceCoins: 90, isOwned: false, icon: '✨'},
    {id: 'r4', title: 'Иконка «Санта-шапка»', priceCoins: 75, isOwned: false, icon: '🎅'},
    {id: 'r5', title: 'Иконка «Санта-шапка»', priceCoins: 75, isOwned: false, icon: '🎅'}
  ],
  3: [
    {id: 'r6', title: 'Трофей «Wintermeister»', priceCoins: 180, isOwned: false, icon: '🏆'},
    {id: 'r7', title: 'Фон «Северное сияние»', priceCoins: 150, isOwned: false, icon: '🌌'},
    {id: 'r8', title: 'Фон «Северное сияние»', priceCoins: 150, isOwned: false, icon: '🌌'}
  ]
})
function buyReward(level, rewardId) {
  if (currentLevel.value < level) return
  const item = shopByRank.value[level].find(i => i.id === rewardId)
  if (!item || item.isOwned) return
  if (coins.value < item.priceCoins) return
  coins.value -= item.priceCoins
  item.isOwned = true
}

function resetAll() {
  coins.value = 0
  reputationPoints.value = 0
  quests.value.forEach(q => (q.isDone = false))
  Object.values(shopByRank.value).forEach(list => list.forEach(r => (r.isOwned = false)))
  selectedLevel.value = 1
}

</script>
<template>
  <div>
    <div class="season__bg">
      <div class="sidebar__decor">
        <img class="present --right" :src="Present" alt="Present icon">
      </div>
      <div class="svg-snow" aria-hidden="true">
        <VShowFall/>
      </div>
      <div class="xmas-wrapper">
        <div class="achv-layout">
          <aside class="achv-sidebar achv-card">
            <button @click="pathToMain" type="button" class="btn btn--home">На главную</button>
            <div class="hero achv-card --flat">
              <div class="hero__info">
                <div class="hero__name">Событие</div>
              </div>
            </div>
            <div class="status achv-card --flat">
              <div class="status__row">
                <!--                <div class="status__value">{{ currentRankTitle }}</div>-->
                <div class="status__value">Панель ивента</div>
              </div>
              <div class="bar">
                <div class="bar__fill" :style="{ width: progressPct + '%' }"></div>
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
            <!--            <img class="left__decor" :src="DecoLeft" alt="">-->
            <div class="panel__title">
              <h1> {{ computedPanelTitle }}</h1>
              <!--              <div class="panel__meta">-->
              <!--                <span class="meta__pill">{{ currentRankTitle }}</span>-->
              <!--              </div>-->
            </div>
            <!--            <div class="tabs">-->
            <!--              <button :class="['tab', { 'is-active': activeTab === 'reputation' }]" @click="activeTab = 'reputation'">-->
            <!--                Репутация-->
            <!--              </button>-->
            <!--              <button :class="['tab', { 'is-active': activeTab === 'quests' }]" @click="activeTab = 'quests'">Задания-->
            <!--              </button>-->
            <!--            </div>-->
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
                <div v-for="reward in shopByRank[selectedLevel]" :key="reward.id" class="prize-card achv-card">
                  <div class="prize-card__icon">{{ reward.icon }}</div>
                  <div class="prize-card__body">
                    <div class="prize-card__title">{{ reward.title }}</div>
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
            <section v-if="activeTab === 'quests'">
              <div class="quests">
                <div>
                  <h2 class="daily__title">Ежедневные задания</h2>
                </div>
                <div v-for="q in quests" :key="q.id" class="quest achv-card">
                  <div class="quest__icon">{{ q.icon }}</div>
                  <div class="quest__body">
                    <div class="quest__title">{{ q.title }}</div>
                    <div class="quest__meta">
                      <div class="quest__inner">
                        <span class="meta__pill">{{ q.rewardRep }} реп.</span>
                        <span class="meta__pill">{{ q.rewardCoins }} {{ coinIcon }}</span>
                      </div>
                      <button class="btn btn--candy" :disabled="q.isDone" @click="goToSession(q.id)">
                        {{ q.isDone ? 'Выполнено' : 'Выполнить' }}
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
  backdrop-filter: blur(2px);
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
  background: #ffffff52;;
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
  font-weight: 900;
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

.quests::-webkit-scrollbar {
  width: 0;
}

.achv-panel section::-webkit-scrollbar-thumb {
  background: #9B8CFF;
  border-radius: 2px;
}

.quests::-webkit-scrollbar-track {
  background: transparent;
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

.tabs {
  gap: 10px;
  margin-bottom: 12px;
  display: inline-block;
  padding: 5px;
  background: white;
  border-radius: 14px;
}

.tab {
  color: #3b3d75;
  border-radius: 14px;
  padding: 8px 14px;
  font-weight: 900;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 18px;
}

.tab.is-active {
  background: #9B8CFF;
  color: whitesmoke;
  box-shadow: 0 3px 0 #8779df;
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
  font-weight: 900;
  font-size: 17px;
}

.pill.is-active {
  background: #9B8CFF;
  color: whitesmoke;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 14px
}

.prize-card {
  display: flex;
  gap: 12px;
  background: #ffffff52;;
}

.prize-card__icon {
  font-size: 34px
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
  border: 2px solid #183a69;
  border-radius: 10px;
  padding: 5px 8px
}

.quest__inner {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.quests {
  flex: 1 1 auto;
  overflow: auto;
  min-height: 0;
}

.quest__body {
  width: 100%;
}

.quest {
  display: flex;
  gap: 12px;
  background: #ffffff52;
  box-shadow: 0 5px 0 rgba(128, 124, 124, 0.53);
  margin-bottom: 15px;
}

.quest__icon {
  font-size: 30px
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

.meta__pill {
  background: #c5e6ff;
  color: #5873c5;
  border: none;
  border-radius: 14px;
  padding: 6px 10px;
  font-weight: 900;
}

.btn {
  border-radius: 12px;
  padding: 14px;
  font-weight: 900;
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
}

.btn--candy:disabled {
  background: #455268;
  color: #c7d1e6;
  border-color: #2a3850;
  box-shadow: none
}

@media (max-width: 767px) {
  .achv-layout {
    padding: 15px;
    gap: 12px;
  }
}

@media (min-width: 1024px) {
  .btn--home:hover {
    background: #e7a336;
  }
}

</style>

