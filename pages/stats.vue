<script setup>
	import {ref, watch, computed} from 'vue'
	import {userAuthStore} from '../store/authStore.js'
	import {useGuessWordStore} from '../store/guesStore.js'
	import {useGameStore} from '../store/marafonStore.js'
	import LeaderboardItem from '../src/components/LeaderboardItem.vue'
	import ModalOverlay from '../src/components/modalOverlay.vue'
	import CloseIcon from '../assets/images/close.svg'
	const {t} = useI18n()
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

	const isInGuessLeaderboard = computed(() =>
		guessRating.value.some(r => r.name === authStore.name)
	);

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
	});
</script>

<template>
	<div class="leaderboard">
		<div class="leaderboard__container">
			<div class="leaderboard__wrapper">
				<div v-if="isModal">
					<ModalOverlay @close="isModal = false"
					              :icon="CloseIcon"
					              :text="t(modalValues.text)"
					              :overlayBtn="t(modalValues.btn)"
					/>
				</div>
				<h1 class="leaderboard__title"> {{ t('ranked.label')}}</h1>
				<div class="leader__icon">
					<img class="leader__icon-item" src="../assets/images/leadership.svg" alt="">
				</div>
				<div class="discipline-selector">
					<button
						v-for="tab in disciplines" :key="tab.id"
						class="discipline-selector__button"
						:class="{ 'discipline-selector__button--active': activeDiscipline === tab.id }"
						@click="activeDiscipline = tab.id"
					>
						{{ t(tab.label) }}
					</button>
				</div>
				<div v-if="activeDiscipline === 'guess'" class="leaderboard__content">
					<button
						v-if="authStore.uid && !isInGuessLeaderboard && !isGuessLoading"
						@click="addToLeaderboard"
						class="leaderboard__action-btn"
					>
						{{ t('ranked.toRanked')}}
					</button>
					<div v-if="isGuessLoading" class="leaderboard__message">{{ t('ranked.loading')}}</div>
					<div v-else-if="guessRating.length" class="leaderboard__list">
						<h2 class="leaderboard__subtitle">
							{{ t('ranked.guesTabelelable')}}
						</h2>
							<ul class="leaderboard__items-container"data-simplebar>
								<LeaderboardItem
									v-for="(r, index) in guessRating"
									:key="r.name"
									:player="r"
									:rank="index + 1"
									:is-current-user="r.name === authStore.name"
									score-field="guessed"
									score-unit=""
								/>
							</ul>
					</div>
					<div v-else class="leaderboard__message">
						{{ t('ranked.notData')}}
					</div>
				</div>
				<div v-else-if="activeDiscipline === 'marathon'" class="leaderboard__content">
					<div class="difficulty-selector">
						<button
							v-for="(label, level) in difficultyLabels"
							:key="level"
							class="difficulty-selector__button"
							:class="{ 'difficulty-selector__button--active': activeMarathonDifficulty == level }"
							@click="activeMarathonDifficulty = level"
						>
							{{ t(label) }}
						</button>
					</div>
					<div v-if="!authStore.uid" class="leaderboard__message">
						{{ t('ranked.notAuth')}}
					</div>
					<div v-if="isMarathonLoading" class="leaderboard__message">{{ t('ranked.loading')}}</div>
					<div v-else-if="marathonRating.length" class="leaderboard__list">
						<h2 class="leaderboard__subtitle">
							{{ t('ranked.guesMarathonlable')}}:
							{{ t(difficultyLabels[activeMarathonDifficulty]) }}
						</h2>
						<ul class="leaderboard__items-container">
							<LeaderboardItem
								v-for="(player, index) in marathonRating"
								:key="player.id"
								:player="player"
								:rank="index + 1"
								:is-current-user="player.id === authStore.uid"
								score-field="streak"
								score-unit=""
							/>
						</ul>
					</div>
					<div v-else class="leaderboard__message">
						{{ t('ranked.emptydifficult')}}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.leaderboard__wrapper {
		font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
		max-width: 800px;
		margin: 0 auto;
		padding: 0 30px;
		background-color: #1a1e2f;
		border-radius: 12px;
		color: #e0e0e0;
		border: 1px solid #3a3f5e;
	}

	.leaderboard__container {
		padding: 30px;
	}

	.leader__icon-item {
		width: 200px;
		padding: 20px;
	}

	.leader__icon {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.leaderboard__title {
		text-align: center;
		color: #ffffff;
		font-weight: 600;
	}

	.leaderboard__subtitle {
		text-align: center;
		color: #c0c0d0;
		margin-top: 0;
		margin-bottom: 10px;
		font-weight: 500;
		font-size: 1.2em;
	}

	.leaderboard__content {
		margin-top: 20px;
	}

	.leaderboard__items-container {
		display: flex;
		flex-direction: column;
		height: 300px;
		overflow-y: auto;
	}

	.leaderboard__action-btn {
		display: block;
		margin: 0 auto 20px auto;
		padding: 12px 25px;
		background-color: #4a4e8f;
		color: #fff;
		border: 1px solid #8b8bad;
		border-radius: 5px;
		font-size: 17px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.leaderboard__action-btn:hover {
		background-color: #6a6ff0;
	}

	.leaderboard__message {
		text-align: center;
		color: #a0a0b0;
		font-style: italic;
		padding: 20px;
		border: 1px dashed #4a4e8f;
		border-radius: 5px;
		margin-top: 20px;
		background-color: #2a2d3b;
	}

	.discipline-selector {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 30px;
		flex-wrap: wrap;
	}

	.discipline-selector__button {
		padding: 10px 20px;
		border: 1px solid #4a4e8f;
		border-radius: 8px;
		background-color: #2a2d3b;
		color: #a0a0b0;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	.discipline-selector__button:hover {
		background-color: #3a3f5e;
		color: #ffffff;
	}

	.discipline-selector__button--active {
		background-color: #4a4e8f;
		color: #ffffff;
		border-color: #8b8bad;
		box-shadow: 0 0 8px rgba(74, 78, 143, 0.5);
	}

	.difficulty-selector {
		display: flex;
		justify-content: center;
		gap: 10px;
		margin-bottom: 25px;
		padding: 10px;
		background-color: rgba(0, 0, 0, 0.15);
		border-radius: 8px;
	}

	.difficulty-selector__button {
		padding: 8px 16px;
		border: 1px solid #5a5e9f;
		border-radius: 6px;
		background-color: transparent;
		color: #a0a0b0;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	.difficulty-selector__button:hover {
		background-color: #3a3f5e;
		color: #ffffff;
	}

	.difficulty-selector__button--active {
		background-color: #6a6ff0;
		color: #ffffff;
		border-color: #6a6ff0;
	}

</style>