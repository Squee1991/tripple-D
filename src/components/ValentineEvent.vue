<script setup>
import {ref, computed} from 'vue'
import {useRouter} from 'vue-router'

const router = useRouter()

const coins = ref(0)
const coinIcon = '💘'
const activeTab = ref('reputation')
const nav = [
    {id: 'reputation', label: 'Репутация', icon: '🏆'},
    {id: 'quests', label: 'Задания', icon: '📜'},
]

const selectedLevel = ref(1)
const computedPanelTitle = computed(() =>
    activeTab.value === 'reputation' ? 'Магазин ивента' : 'Ежедневные задания'
)

const pathToMain = () => router.push('/')

const reputationPoints = ref(0)
const ranks = [
    {level: 1, need: 0, title: 'Симпатия'},
    {level: 2, need: 120, title: 'Влюблённость'},
    {level: 3, need: 300, title: 'Амур'},
]

const quests = ref([
    {id: 'q1', title: '10 романтичных слов (DE)', rewardCoins: 20, rewardRep: 20, isDone: false, icon: '📘'},
    {id: 'q2', title: 'Präsens: 5 признаний', rewardCoins: 25, rewardRep: 30, isDone: false, icon: '✍️'},
    {id: 'q3', title: 'Артикли: 10 карточек', rewardCoins: 35, rewardRep: 40, isDone: false, icon: '🃏'},
    {id: 'q4', title: 'Perfekt: 6 предложений', rewardCoins: 45, rewardRep: 60, isDone: false, icon: '💬'},
    {id: 'q5', title: 'Диалог-свидание: мини-сцена', rewardCoins: 60, rewardRep: 80, isDone: false, icon: '☕'},
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

const setSelectedLevel = (lvl) => {
    selectedLevel.value = lvl
}
const shopByRank = ref({
    1: [
        {id: 'r1', title: 'Стикер «Сердечко»', priceCoins: 25, isOwned: false, icon: '💖'},
        {id: 'r2', title: 'Мини-рамка «Розы»', priceCoins: 40, isOwned: false, icon: '🌹'},
    ],
    2: [
        {id: 'r3', title: 'Тема «Pink Light»', priceCoins: 90, isOwned: false, icon: '✨'},
        {id: 'r4', title: 'Иконка «Амур»', priceCoins: 75, isOwned: false, icon: '🏹'},
    ],
    3: [
        {id: 'r6', title: 'Трофей «Herzmeister»', priceCoins: 180, isOwned: false, icon: '🏆'},
        {id: 'r7', title: 'Фон «Сердечный град»', priceCoins: 150, isOwned: false, icon: '🎆'},
    ],
})

function buyReward(level, rewardId) {
    if (currentLevel.value < level) return
    const item = shopByRank.value[level].find(i => i.id === rewardId)
    if (!item || item.isOwned) return
    if (coins.value < item.priceCoins) return
    coins.value -= item.priceCoins
    item.isOwned = true
}

function completeQuest(id) {
    const q = quests.value.find(x => x.id === id)
    if (!q || q.isDone) return
    q.isDone = true
    coins.value += q.rewardCoins
    reputationPoints.value += q.rewardRep
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
    <div class="valentine-bg">
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

                    <section v-else>
                        <div class="quests">
                            <h2 class="daily__title">Ежедневные задания</h2>
                            <div v-for="q in quests" :key="q.id" class="quest achv-card">
                                <div class="quest__icon">{{ q.icon }}</div>
                                <div class="quest__body">
                                    <div class="quest__title">{{ q.title }}</div>
                                    <div class="quest__meta">
                                        <div class="quest__inner">
                                            <span class="meta__pill">{{ q.rewardRep }} реп.</span>
                                            <span class="meta__pill">{{ q.rewardCoins }} {{ coinIcon }}</span>
                                        </div>
                                        <button class="btn btn--candy" :disabled="q.isDone"
                                                @click="completeQuest(q.id)">
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

.quest__body {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.achv-card {
    border: 2px solid #fff4f7;
    border-radius: 18px;
    padding: 15px;
    backdrop-filter: blur(3px);
}

.achv-sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 360px;
    overflow: hidden;
}

.btn--home {
    width: 100%;
    background: linear-gradient(180deg, #f88ca9, #e05c84);
    color: #fff;
    border: none;
    border-radius: 16px;
    padding: 12px 14px;
    font-weight: 900;
    box-shadow: 0 3px 0 #b94d6e;
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

.bar {
    height: 25px;
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
    font-weight: 900;
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
    font-weight: 900;
    font-size: 17px;
}

.pill.is-active {
    background: #ff9db8;
    color: #6b1030;
}

.cards {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.prize-card {
    display: flex;
    gap: 12px;
    background: #ffffff88;
}

.prize-card__icon {
    font-size: 34px;
}

.prize-card__title {
    font-weight: 900;
    font-size: 16px;
    margin-bottom: 8px;
    color: #6b1030;
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
    border: 2px solid #a82347;
    border-radius: 10px;
    padding: 5px 8px;
}

.quests {
    flex: 1 1 auto;
    overflow: auto;
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
    font-size: 30px;
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

.meta__pill {
    background: #ffd1dc;
    color: #6b1030;
    border: none;
    border-radius: 14px;
    padding: 6px 10px;
    font-weight: 900;
}

.btn {
    border-radius: 12px;
    padding: 14px;
    font-weight: 900;
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
}

.btn--candy:disabled {
    background: #8f6a77;
    color: #f3dbe3;
    box-shadow: none;
}

@media (max-width: 767px) {
    .achv-layout {
        padding: 15px;
        gap: 12px;
    }
}
</style>
