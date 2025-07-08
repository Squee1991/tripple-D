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
		margin-bottom: 3rem;
		font-family: 'Fredoka One', cursive;
	}

	.group-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding-bottom: 1rem;
		margin-bottom: 1.5rem;
		border-bottom: 3px dashed rgba(27, 27, 27, 0.5);
	}

	.group-title {
		font-size: 2rem;
		color: #1e1e1e;
		margin: 0;
	}

	.group-stats {
		display: inline-block;
		padding: 8px 16px;
		font-size: 1rem;
		font-weight: 400;
		color: #1e1e1e;
		background: #ffffff;
		border-radius: 100px;
		border: 3px solid #1e1e1e;
		box-shadow: 2px 2px 0px #1e1e1e;
		white-space: nowrap;
		transition: all 0.2s ease;
	}
	.group-stats.all-completed {
		background: #f1c40f;
	}

	.achievements-list {
		display: flex;
		flex-direction: column;
	}

	.achievement-card {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		border: 3px solid #1e1e1e;
		padding: 1rem;
		border-radius: 20px;
		background-color: #fff;
		box-shadow: 6px 6px 0px #1e1e1e;
		text-align: left;
		transition: all 0.2s ease;
		width: 650px;
		margin-bottom: 20px;
	}

	.achievement-icon-wrapper {
		flex-shrink: 0;
		width: 70px;
		height: 70px;
		border-radius: 16px;
		border: 3px solid #1e1e1e;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.achievement-icon-wrapper.special-mode {
		background: #a855f7;
	}
	.icon-emoji {
		font-size: 40px;
	}

	.achievement-details {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	.achievement-title {
		font-size: 1.3rem;
		color: #1e1e1e;
		font-weight: 400;
		margin: 0 0 10px 0;
	}

	.progress-bar-container {
		width: 100%;
		background-color: #e0e0e0;
		border-radius: 100px;
		height: 28px;
		margin-bottom: 10px;
		position: relative;
		border: 3px solid #1e1e1e;
		overflow: hidden;
	}
	.progress-bar {
		height: 100%;
		border-radius: 0;
		transition: width 0.5s ease-in-out;
	}

	.progress-bar.special-progress {
		background: #a855f7;
	}
	.progress-text-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #1e1e1e;
		font-size: 0.9rem;
		font-weight: 400;
		text-shadow: none;
		white-space: nowrap;
	}

	.achievement-description {
		font-size: 0.95rem;
		color: #555;
		font-family: 'Inter', sans-serif;
		font-weight: 500;
		margin: 0;
		line-height: 1.4;
	}

</style>