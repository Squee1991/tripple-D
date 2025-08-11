<script setup>
    import {ref, watch, computed, onMounted} from 'vue'
    import {userAuthStore} from '../store/authStore.js'
    import {useGuessWordStore} from '../store/guesStore.js'
    import {useGameStore} from '../store/marafonStore.js'
    import {useRouter} from 'vue-router'
    import LeaderboardItem from '../src/components/LeaderboardItem.vue'
    import ModalOverlay from '../src/components/modalOverlay.vue'
    import CloseIcon from '../assets/images/close.svg'

    const {t} = useI18n()
    const router = useRouter()
    const authStore = userAuthStore()
    const guessStore = useGuessWordStore()
    const gameStore = useGameStore()
    const activeDiscipline = ref('guess')
    const guessRating = ref([])
    const isGuessLoading = ref(true)
    const marathonRating = ref([])
    const isMarathonLoading = ref(true)
    const isModal = ref(false)
    const activeMarathonDifficulty = ref(1)

    const disciplines = ref([
        {id: 'guess', label: 'ranked.guessTab'},
        {id: 'marathon', label: 'ranked.marathonTab'}
    ]);

    const modalValues = ref({
        text: "modal.textRanked",
        btn: "modal.textBtn"
    })

    const difficultyLabels = {
        1: 'ranked.easy',
        2: 'ranked.normal',
        3: 'ranked.hard'
    }

    const backToMainPage = () => {
        router.back()
    }

    const isInGuessLeaderboard = computed(() =>
        guessRating.value.some(r => r.name === authStore.name)
    );

    const userMarathonRecord = computed(() => {
        if (!authStore.uid || !marathonRating.value || marathonRating.value.length === 0) {
            return 0;
        }
        const userRecord = marathonRating.value.find(player => player.id === authStore.uid);
        return userRecord ? userRecord.streak : 0;
    })

    async function loadGuessStatistics() {
        isGuessLoading.value = true
        guessRating.value = await guessStore.loadLeaderboard()
        if (authStore.uid) {
            await guessStore.loadGuessProgress()
        }
        isGuessLoading.value = false
    }

    async function loadMarathonStatistics() {
        isMarathonLoading.value = true;
        marathonRating.value = await gameStore.loadMarathonLeaderboard(activeMarathonDifficulty.value)
        if (authStore.uid) {
            await gameStore.fetchRecord()
        }
        isMarathonLoading.value = false
    }

    async function addToLeaderboard() {
        if (!Array.isArray(guessStore.guessedWords) || guessStore.guessedWords.length === 0) {
            isModal.value = true
            return;
        }
        await guessStore.saveToLeaderboard(authStore.name, guessStore.guessedWords.length)
        guessRating.value = await guessStore.loadLeaderboard()
    }

    watch(activeMarathonDifficulty, () => {
        if (activeDiscipline.value === 'marathon') {
            loadMarathonStatistics()
        }
    });

    watch(activeDiscipline, (newDiscipline) => {
        if (newDiscipline === 'guess') {
            loadGuessStatistics()
        } else if (newDiscipline === 'marathon') {
            loadMarathonStatistics()
        }
    }, {immediate: true});

    watch(() => authStore.uid, () => {
        if (activeDiscipline.value === 'guess') {
            loadGuessStatistics()
        } else if (activeDiscipline.value === 'marathon') {
            loadMarathonStatistics()
        }
    }, {immediate: true});

    onMounted(async () => {
        if (authStore.uid) {
            await gameStore.fetchRecord()
        }
    })
</script>

<template>
    <div class="ranked-layout">
        <div v-if="isModal">
            <ModalOverlay
                @close="isModal = false"
                :icon="CloseIcon"
                :text="t(modalValues.text)"
                :overlayBtn="t(modalValues.btn)"
            />
        </div>
        <div class="ranked-sidebar-corkboard">
            <div class="ranked__side-btnBack-wrapper">
                <button @click="backToMainPage" class="ranked__side-btnBack">{{ t('chooseTheme.btnBack')}}</button>
            </div>
            <h1 class="corkboard-title">{{ t('ranked.label')}}</h1>
            <div class="control-card">
                <div class="pin"></div>
                <div class="discipline-selector">
                    <button
                            v-for="tab in disciplines" :key="tab.id"
                            class="discipline-selector__button"
                            :class="{ 'active': activeDiscipline === tab.id }"
                            @click="activeDiscipline = tab.id"
                    >
                        {{ t(tab.label) }}
                    </button>
                </div>
            </div>
            <div class="control-card" v-if="activeDiscipline === 'marathon'">
                <div class="pin"></div>
                <h3 class="control-card__title">{{ t('ranked.difficulty')}}</h3>
                <div class="difficulty-selector">
                    <button
                            v-for="(label, level) in difficultyLabels"
                            :key="level"
                            class="difficulty-selector__button"
                            :class="{ 'active': activeMarathonDifficulty == level }"
                            @click="activeMarathonDifficulty = level"
                    >
                        {{ t(label) }}
                    </button>
                </div>
            </div>
            <div class="control-card user-stats-card">
                <div class="pin"></div>
                <h3 class="control-card__title">{{ t('ranked.myStats')}}</h3>
                <div v-if="authStore.uid">
                    <p v-if="activeDiscipline === 'guess'" class="user-stats__item">
                        {{ t('ranked.wordsGuessed')}} <span>{{ guessStore.guessedWords.length }}</span>
                    </p>
                    <p v-if="activeDiscipline === 'marathon'" class="user-stats__item">
                        {{ t('ranked.maxStreak')}} <span>{{ userMarathonRecord }}</span>
                    </p>
                    <button
                            v-if="activeDiscipline === 'guess' && !isInGuessLeaderboard && !isGuessLoading"
                            @click="addToLeaderboard"
                            class="user-stats__action-btn"
                    >
                        {{ t('ranked.toRanked')}}
                    </button>
                </div>
                <p v-else class="user-stats__item">{{ t('ranked.notAuth')}}</p>
            </div>
        </div>
        <div class="ranked-leaderboard-blackboard">
            <div class="blackboard-frame">
                <div class="blackboard">
                    <div v-if="activeDiscipline === 'guess'">
                        <div v-if="isGuessLoading" class="blackboard__message">{{ t('ranked.loading')}}</div>
                        <div v-else-if="guessRating.length">
                            <h2 class="blackboard__title">{{ t('ranked.guesTabelelable')}}</h2>
                            <ul class="leaderboard__items-container" data-simplebar>
                                <LeaderboardItem
                                        v-for="(r, index) in guessRating" :key="r.name" :player="r" :rank="index + 1"
                                        :is-current-user="authStore.name && r.name && r.name.trim().toLowerCase() === authStore.name.trim().toLowerCase()"
                                        score-field="guessed" score-unit=""
                                />
                            </ul>
                        </div>
                        <div v-else class="blackboard__message">
                            <div class="black__board-title">{{ t('ranked.notData')}}</div>
                            <img src="../assets/images/leadership.svg" alt="">
                        </div>
                    </div>
                    <div v-if="activeDiscipline === 'marathon'">
                        <div v-if="isMarathonLoading" class="blackboard__message">{{ t('ranked.loading')}}</div>
                        <div v-else-if="marathonRating.length">
                            <h2 class="blackboard__title">{{ t('ranked.guesMarathonlable')}}: {{
                                t(difficultyLabels[activeMarathonDifficulty]) }}</h2>
                            <ul class="leaderboard__items-container" data-simplebar>
                                <LeaderboardItem
                                        v-for="(player, index) in marathonRating" :key="player.id" :player="player"
                                        :rank="index + 1"
                                        :is-current-user="authStore.name && player.name && player.name.trim().toLowerCase() === authStore.name.trim().toLowerCase()"
                                        score-field="streak" score-unit=""
                                />
                            </ul>
                        </div>
                        <div v-else class="blackboard__message">
                            <div class="black__board-title">{{ t('ranked.emptydifficult')}}</div>
                            <img src="../assets/images/leadership.svg" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .ranked-layout {
        display: flex;
        gap: 2rem;
        padding: 2rem;
        min-height: 100vh;
        background-color: var(--bg);
        font-family: "Nunito", sans-serif;
        //border: 4px solid #1e1e1e;
        box-sizing: border-box;
    }

    .ranked-sidebar-corkboard {
        flex: 1;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background: transparent;
        box-shadow: none;
        padding: 0;
    }

    .corkboard-title {
        font-family: "Nunito", sans-serif;
        font-size: 35px;
        text-align: center;
        font-weight: 400;
        color: var(--titleColor);
    }

    .black__board-title {
        text-align: center;
    }

    .ranked__side-btnBack {
        width: 100%;
        border: 3px solid #1e1e1e;
        padding: 15px;
        background: #4ade80;
        border-radius: 16px;
        cursor: pointer;
        color: #1e1e1e;
        font-size: 1.2rem;
        font-weight: 400;
        font-family: "Nunito", sans-serif;
        box-shadow: 4px 4px 0px #1e1e1e;
        transition: all 0.1s ease-in-out;
    }

    .ranked__side-btnBack:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #1e1e1e;
    }

    .control-card {
        background: #ffffff;
        box-shadow: 4px 4px 0px #1e1e1e;
        padding: 20px;
        border-radius: 20px;
        border: 3px solid #1e1e1e;
    }

    .control-card__title {
        text-align: center;
        font-weight: 400;
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        color: #1e1e1e;
    }

    .discipline-selector, .difficulty-selector {
        display: flex;
        gap: 10px;
    }

    .discipline-selector__button, .difficulty-selector__button {
        flex: 1;
        padding: 1rem;
        border: 3px solid #1e1e1e;
        border-radius: 12px;
        cursor: pointer;
        font-size: 1.1rem;
        font-family: "Nunito", sans-serif;
        background: #fff;
        color: #1e1e1e;
        box-shadow: 2px 2px 0px #1e1e1e;
        transition: all 0.1s ease-in-out;
    }

    .discipline-selector__button:hover, .difficulty-selector__button:hover {
        background-color: #fef8e4;
    }

    .discipline-selector__button.active {
        background: #f1c40f;
        transform: translate(2px, 2px);
        box-shadow: 0px 0px 0px #1e1e1e;
    }

    .difficulty-selector__button.active {
        background: #4ade80;
        transform: translate(2px, 2px);
        box-shadow: 0px 0px 0px #1e1e1e;
    }

    .user-stats__item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.5rem 0;
        font-weight: 400;
        font-size: 1.1rem;
    }

    .user-stats__item span {
        font-weight: 400;
        font-size: 1.3em;
        background: #fef8e4;
        padding: 2px 8px;
        border-radius: 8px;
        border: 3px solid #1e1e1e;
        width: 45px;
        height: 39px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .user-stats__action-btn {
        width: 100%;
        margin-top: 1rem;
        padding: 0.8rem;
        font-size: 1rem;
        font-family: "Nunito", sans-serif;
        background: #a855f7;
        color: white;
        border: 3px solid #1e1e1e;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 4px 4px 0px #1e1e1e;
        transition: all 0.1s ease-in-out;
    }

    .user-stats__action-btn:hover {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0px #1e1e1e;
    }

    .ranked-leaderboard-blackboard {
        flex: 2;
        background: #5a9ff3;
        border-radius: 24px;
        border: 3px solid #1e1e1e;
        box-shadow: 8px 8px 0px #1e1e1e;
        padding: 24px;
        display: flex;
        width: 100%;
        max-width: 100%;
    }

    .blackboard-frame, .blackboard {
        background: transparent;
        padding: 0;
        border: none;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .blackboard__title {
        font-weight: 400;
        color: #1e1e1e;
        font-family: "Nunito", sans-serif;
        font-size: 2rem;
        text-align: center;
        margin-bottom: 20px;
    }

    .blackboard__message {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        font-size: 1.5rem;
        color: #1e1e1e;
        opacity: 0.7;
    }

    .leaderboard__items-container {
        list-style: none;
        margin: 0;
        padding: 0;
        height: 100%;
        overflow-y: auto;
    }

    ::-webkit-scrollbar {
        width: 12px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background: #1e1e1e;
        border-radius: 6px;
        border: 3px solid #fca5a5;
    }

    @media (max-width: 1023px) {
        .ranked-layout {
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .ranked-sidebar-corkboard {
            width: 100%;
            max-width: 100%;
        }

        .ranked-layout {
            gap: 13px;
            padding: 1rem;
        }

      .ranked-leaderboard-blackboard {
        padding: 3px;
      }
    }
</style>