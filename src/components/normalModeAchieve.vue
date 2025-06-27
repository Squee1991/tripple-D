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
				<div class="achievement-icon-wrapper medium-mode">
					<div class="achievement-icon">
						<span class="icon-emoji">{{ achievement.icon }}</span>
					</div>
				</div>
				<div class="achievement-details">
					<h3 class="achievement-title">{{ t(achievement.name) }}</h3>
					<div class="progress-bar-container">
						<div
							class="progress-bar medium-progress"
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
	import {ref, watch} from 'vue';
	import {groupedNormalModeAchievements} from '../achieveGroup/marathon/normalModeAchievement.js';
	import {useGameStore} from '../../store/marafonStore.js';
    const { t} = useI18n()
	const gameStore = useGameStore();
	const achievementGroups = ref(groupedNormalModeAchievements);
	const allAchievements = ref(achievementGroups.value.flatMap(g => g.achievements));

	const getCompletedCount = (group) => {
		if (!group || !group.achievements) return
		return group.achievements.filter(ach => ach.currentProgress >= ach.targetProgress).length
	}

	watch(() => gameStore.totalCorrectAnswers ? gameStore.totalCorrectAnswers[2] : 0, (newTotal) => {
		allAchievements.value.forEach(ach => {
			if (ach.type === 'total') {
				ach.currentProgress = Math.min(newTotal || 0, ach.targetProgress);
			}
		});
	}, {immediate: true});

	watch(() => gameStore.personalBests[2], (newBestStreak) => {
		allAchievements.value.forEach(ach => {
			if (ach.type === 'streak') {
				ach.currentProgress = Math.min(newBestStreak || 0, ach.targetProgress);
			}
		});
	}, {immediate: true});

</script>

<style scoped>
	.achievement-group {
		margin-bottom: 30px;
	}

	.achievements-list {
		display: flex;
		flex-direction: column;
		gap: 15px;
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
		background: linear-gradient(135deg, #e2dd11, #91bb1f);
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
		background: linear-gradient(135deg, #3C8CE7, #00EAFF);
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
		font-size: 15px;
		color: #555;
		margin: 0;
	}

</style>