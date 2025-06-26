<template>
	<div v-for="group in achievementGroups" :key="group.title" class="achievement-group">
		<h2 class="group-title">{{ t(group.title) }}</h2>
		<div class="achievements-list">
			<div v-for="achievement in group.achievements" :key="achievement.id" class="achievement-card">
				<div class="achievement-icon-wrapper special-mode">
					<div class="achievement-icon">
						<span class="icon-emoji">{{ achievement.icon }}</span>
					</div>
				</div>
				<div class="achievement-details">
					<h3 class="achievement-title">{{ t(achievement.name) }}</h3>
					<div class="progress-bar-container">
						<div
							class="progress-bar special-progress"
							:style="{ width: (achievement.currentProgress / achievement.targetProgress * 100) + '%' }"
						></div>
						<span class="progress-text-overlay">
                     {{ achievement.currentProgress }} / {{ achievement.targetProgress }}
                  </span>
					</div>
					<p class="achievement-description">{{ t(achievement.description) }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref, watch, computed, onMounted} from 'vue';
	import {cpecialGroupAchievment} from '../achieveGroup/specialAchieve/specialAchievment.js';
	import {useGameStore} from '../../store/marafonStore.js';
	import {userlangStore} from '../../store/learningStore.js';
	import {userAuthStore} from '../../store/authStore.js';
    const { t} = useI18n()
	const gameStore = useGameStore();
	const learningStore = userlangStore();
	const authStore = userAuthStore();
	const achievementGroups = ref(cpecialGroupAchievment);
	const allAchievements = ref(achievementGroups.value.flatMap(g => g.achievements));

	const grandTotalCorrect = computed(() => {
		const totals = gameStore.totalCorrectAnswers;
		if (!totals) return 0;
		return (totals[1] || 0) + (totals[2] || 0) + (totals[3] || 0);
	});

	watch(grandTotalCorrect, (newGrandTotal) => {
		const ach = allAchievements.value.find(a => a.id === 'totalArticles1000');
		if (ach) {
			ach.currentProgress = Math.min(newGrandTotal, ach.targetProgress);
		}
	}, {immediate: true});

	watch(() => learningStore.isLeveling, (newLevel) => {
		const ach = allAchievements.value.find(a => a.id === 'level10');
		if (ach) {
			ach.currentProgress = Math.min(newLevel, ach.targetProgress);
		}
	}, {immediate: true});

	async function checkLeaderboardAchievements() {
		if (!authStore.uid) return;

		const levels = [1, 2, 3];
		const ids = ['leaderboardEasy', 'leaderboardNormal', 'leaderboardHard'];

		for (let i = 0; i < levels.length; i++) {
			const level = levels[i];
			const achId = ids[i];

			const leaderboard = await gameStore.loadMarathonLeaderboard(level);
			const ach = allAchievements.value.find(a => a.id === achId);

			if (ach && leaderboard.length > 0 && leaderboard[0].id === authStore.uid) {
				ach.currentProgress = 1;
			} else if (ach) {
				ach.currentProgress = 0;
			}
		}
	}

	onMounted(() => {
		checkLeaderboardAchievements();
	});

</script>

<style scoped>
	.achievement-group {
		margin-bottom: 30px;
	}

	.group-title {
		font-size: 1.5em;
		color: #444;
		margin-bottom: 15px;
		padding-bottom: 5px;
		border-bottom: 2px solid #eee;
	}

	.achievements-list {
		display: flex;
		flex-direction: column;
		gap: 15px;
		font-family: Arial, sans-serif;
	}

	.achievement-card {
		display: flex;
		align-items: center;
		gap: 15px;
		border: 1px solid #e0e0e0;
		padding: 15px;
		border-radius: 12px;
		background-color: #fff;
		max-width: 500px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.achievement-icon-wrapper {
		flex-shrink: 0;
		width: 80px;
		height: 80px;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon-emoji {
		font-size: 45px;
		filter: brightness(1.1);
	}

	.achievement-details {
		flex-grow: 1;
	}

	.achievement-title {
		font-size: 1.1em;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.progress-bar-container {
		width: 100%;
		background-color: #e0e0e0;
		border-radius: 10px;
		height: 25px;
		margin-bottom: 10px;
		position: relative;
	}

	.progress-bar {
		height: 100%;
		border-radius: 10px;
		transition: width 0.5s ease-in-out;
	}

	.progress-text-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #333;
		font-size: 0.8em;
		font-weight: bold;
		white-space: nowrap;
	}

	.achievement-description {
		font-size: 0.9em;
		color: #555;
		margin: 0;
	}

	/* 4. НОВЫЕ СТИЛИ ДЛЯ ОСОБЫХ ДОСТИЖЕНИЙ */
	.achievement-icon-wrapper.special-mode {
		/* Фиолетово-синий градиент */
		background: linear-gradient(135deg, #6a11cb, #2575fc);
	}

	.progress-bar.special-progress {
		/* Розово-фиолетовый градиент для прогресс-бара */
		background: linear-gradient(90deg, #c471ed, #f64f59);
	}
</style>