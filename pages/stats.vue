<script setup>
	import {ref, watch, computed, onMounted} from 'vue'
	import {userAuthStore} from '../store/authStore.js'
	import {useGuessWordStore} from '../store/guesStore.js'
	import {useGameStore} from '../store/marafonStore.js'
	import { useRouter} from 'vue-router'
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
		router.push('/')
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
	}, { immediate: true });

	onMounted(async () => {
		if(authStore.uid) {
			await gameStore.fetchRecord()
		}
	})
</script>

<template>
	<div class="ranked-layout">
		<div v-if="isModal">
			<ModalOverlay @close="isModal = false"
			              :icon="CloseIcon"
			              :text="t(modalValues.text)"
			              :overlayBtn="t(modalValues.btn)"
			/>
		</div>
		<div class="ranked-sidebar-corkboard">
			<div class="ranked__side-btnBack-wrapper">
				<button @click="backToMainPage" class="ranked__side-btnBack">На главную</button>
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
						<div v-else class="blackboard__message">{{ t('ranked.notData')}}</div>
					</div>
					<div v-if="activeDiscipline === 'marathon'">
						<div v-if="isMarathonLoading" class="blackboard__message">{{ t('ranked.loading')}}</div>
						<div v-else-if="marathonRating.length">
							<h2 class="blackboard__title">{{ t('ranked.guesMarathonlable')}}: {{ t(difficultyLabels[activeMarathonDifficulty]) }}</h2>
							<ul class="leaderboard__items-container" data-simplebar>
								<LeaderboardItem
									v-for="(player, index) in marathonRating" :key="player.id" :player="player" :rank="index + 1"
									:is-current-user="authStore.name && player.name && player.name.trim().toLowerCase() === authStore.name.trim().toLowerCase()"
									score-field="streak" score-unit=""
								/>
							</ul>
						</div>
						<div v-else class="blackboard__message">{{ t('ranked.emptydifficult')}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>

	.ranked__side-btnBack {
		width: 100%;
		border: 3px solid #5D4037;
		padding: 15px;
		background: #5D4037;
		border-radius: 10px;
		cursor: pointer ;
		color: white;
		font-size: 20px;
		font-weight: 600;
		font-family: 'Neucha', cursive;
	}

	.ranked__side-btnBack:hover {
  		background: #705149;
		color: white;
	}

	.ranked-layout {
		display: flex;
		gap: 2rem;
		padding: 2rem;
		min-height: 100vh;
		background-color: #f0ebe5;
		font-family: 'Neucha', cursive;
	}
	.ranked-sidebar-corkboard {
		flex: 1;
		max-width: 350px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		background: #d2b48c;
		border-radius: 15px;
		box-shadow: 0 10px 30px rgba(0,0,0,0.2);
		padding: 1.5rem;
	}
	.corkboard-title {
		font-family: 'Caveat', cursive;
		font-size: 28px;
		text-align: center;
		color: #4a3c2a;
		margin: 0 0 1rem 0;
	}
	.control-card {
		background: #fff8e1;
		box-shadow: 5px 5px 10px rgba(0,0,0,0.2);
		padding: 13px;
		position: relative;
		border-radius: 5px;
	}
	.user-stats-card {
		background: #e8f5e9;
		border-color: #a5d6a7;
	}
	.control-card .pin {
		position: absolute;
		top: -8px;
		left: 50%;
		transform: translateX(-50%);
		width: 16px;
		height: 16px;
		background: #e53935;
		border-radius: 50%;
		box-shadow: inset 0 0 3px rgba(0,0,0,0.5);
		border: 2px solid #fff;
	}
	.discipline-selector {
		display: flex;
		justify-content: center;
		gap: 10px;
	}
	.discipline-selector__button {
		flex: 1;
		padding: 0.5rem 1rem;
		background: #fdf5d3;
		border: 1px solid #dccca4;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		font-family: 'Neucha', cursive;
	}
	.discipline-selector__button.active {
		background: #f1c40f;
		font-weight: 600;
	}
	.control-card__title {
		text-align: center;
		font-weight: 600;
		margin: 0 0 1rem 0;
	}
	.difficulty-selector {
		display: flex;
		justify-content: center;
		gap: 10px;
	}
	.difficulty-selector__button {
		flex: 1;
		padding: 0.5rem;
		font-size: 0.9rem;
		background: #fdf5d3;
		border: 1px solid #dccca4;
		border-radius: 6px;
		cursor: pointer;
		font-family: 'Neucha', cursive;
	}
	.difficulty-selector__button.active {
		background: #f1c40f;
		font-weight: 600;
	}
	.user-stats__item {
		display: flex;
		justify-content: space-between;
		margin: 0.5rem 0;
	}
	.user-stats__item span {
		font-weight: 600;
	}
	.user-stats__action-btn {
		width: 100%;
		margin-top: 1rem;
		padding: 0.7rem;
		font-size: 1rem;
		font-family: 'Neucha', cursive;
		background: #8BC34A;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
	}
	.ranked-leaderboard-blackboard {
		flex: 2;
	}
	.blackboard-frame {
		background: #5D4037;
		padding: 20px;
		border-radius: 15px;
		box-shadow: 0 10px 30px rgba(0,0,0,0.3);
		height: 100%;
	}
	.blackboard {
		height: 100%;
		background: #2c3e50;
		border: 10px solid #34495e;
		border-radius: 5px;
		padding: 2rem;
		box-shadow: inset 0 0 10px rgba(0,0,0,0.7);
		display: flex;
		flex-direction: column;
	}
	.blackboard__title {
		color: var(--chalk-yellow);
		font-family: 'Caveat', cursive;
		font-size: 30px;
		text-align: center;
		padding: 15px;
		margin-bottom: 20px;

	}
	.blackboard__message {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 1.5rem;
		color: var(--chalk-color);
		opacity: 0.7;
	}
	.leaderboard__items-container {
		list-style: none;
		margin: 0;
		height: calc(100% - 60px);
		overflow-y: auto;
		padding-right: 15px;
	}

	::-webkit-scrollbar {
		width: 8px;
	}
	::-webkit-scrollbar-track {
		background: #34495e;
		border-radius: 4px;
	}
	::-webkit-scrollbar-thumb {
		background: #7f8c8d;
		border-radius: 4px;
	}
</style>