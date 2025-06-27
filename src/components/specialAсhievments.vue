<template>
	<div v-for="group in achievementGroups" :key="group.title" class="achievement-group">
		<div class="group-header">
			<h2 class="group-title">{{ t(group.title) }}</h2>
			<span :class="['group-stats', { 'all-completed': getCompletedCount(group) === group.achievements.length }]">
					{{ getCompletedCount(group) }} / {{ group.achievements.length }}
				</span>
		</div>
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
	const {t} = useI18n()
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

	const getCompletedCount = (group) => {
		if (!group || !group.achievements) return
		return group.achievements.filter(ach => ach.currentProgress >= ach.targetProgress).length
	}

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


	watch(() => learningStore.totalEarnedPoints, (newPoints) => {
		const ach = allAchievements.value.find(a => a.id === 'Hunderd');
		if (ach) {
			ach.currentProgress = Math.min(newPoints, ach.targetProgress);
		}
	}, {immediate: true});

	watch(() => learningStore.articlesSpentForAchievement, (newSpentArticles) => {
		const achievement = allAchievements.value.find(a => a.id === 'Articlus');
		if (achievement) {
			achievement.currentProgress = Math.min(newSpentArticles, achievement.targetProgress);
		}
	}, { immediate: true });


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

	watch(() => gameStore.onTheEdgeProgress, (newProgress) => {
		const ach = allAchievements.value.find(a => a.id === 'Impuls');
		if (ach) {
			ach.currentProgress = newProgress;
		}
	}, { immediate: true });

	watch(() => authStore.registeredAt, (registrationDate) => {
		if (registrationDate) {
			const ach = allAchievements.value.find(a => a.id === "OneYearVeteran")
			if (ach) {
				const registeredDate = new Date(registrationDate)
				const currentDate = new Date()
				const diffTime = Math.abs(currentDate - registeredDate)
				const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
				ach.currentProgress = Math.min(diffDays , ach.targetProgress)
			}
		}
	}, { immediate: true})

	onMounted(() => {
		checkLeaderboardAchievements();
	});

</script>

<style scoped>
	.achievement-group {
		margin-bottom: 30px;
	}

	.group-header {
		display: flex;
		align-items: center;
		gap: 15px;
		padding-bottom: 10px;
		margin-bottom: 20px;
	}

	.group-stats {
		display: inline-block;
		padding: 6px 14px;
		font-size: 0.9em;
		font-weight: bold;
		color: #fff;
		background: linear-gradient(135deg, #007bff, #0056b3);
		border-radius: 20px;
		box-shadow: 0 2px 4px rgba(0,0,0,0.15);
		transition: all 0.3s ease;
		white-space: nowrap;
	}

	.group-stats.all-completed {
		background: linear-gradient(135deg, #28a745, #218838);
		box-shadow: 0 2px 6px rgba(40, 167, 69, 0.4);
	}

	.group-title {
		font-size: 1.5em;
		color: #444;
		margin: 0;
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
		overflow: hidden;
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