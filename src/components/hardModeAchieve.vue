<template>
	<div v-for="group in achievementGroups" :key="group.title" class="achievement-group">
		<h2 class="group-title">{{ group.title }}</h2>
		<div class="achievements-list">
			<div v-for="achievement in group.achievements" :key="achievement.id" class="achievement-card">
				<div class="achievement-icon-wrapper hard-mode">
					<div class="achievement-icon">
						<span class="icon-emoji">{{ achievement.icon }}</span>
					</div>
				</div>
				<div class="achievement-details">
					<h3 class="achievement-title">{{ achievement.name }}</h3>
					<div class="progress-bar-container">
						<div
							class="progress-bar hard-progress"
							:style="{ width: (achievement.currentProgress / achievement.targetProgress * 100) + '%' }"
						></div>
						<span class="progress-text-overlay">
                     {{ achievement.currentProgress }} / {{ achievement.targetProgress }}
                  </span>
					</div>
					<p class="achievement-description">{{ achievement.description }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, watch } from 'vue';
	import { groupedHardModeAchievements } from '../achieveGroup/hardModeAchievments.js';
	import { useGameStore } from '../../store/marafonStore.js';

	const gameStore = useGameStore();
	const achievementGroups = ref(groupedHardModeAchievements);
	const allAchievements = ref(achievementGroups.value.flatMap(g => g.achievements));

	watch(() => gameStore.totalCorrectAnswers ? gameStore.totalCorrectAnswers[3] : 0, (newTotal) => {
		allAchievements.value.forEach(ach => {
			if (ach.type === 'total') {
				ach.currentProgress = Math.min(newTotal || 0, ach.targetProgress);
			}
		});
	}, { immediate: true });

	watch(() => gameStore.personalBests[3], (newBestStreak) => {
		allAchievements.value.forEach(ach => {
			if (ach.type === 'streak') {
				ach.currentProgress = Math.min(newBestStreak || 0, ach.targetProgress);
			}
		});
	}, { immediate: true });

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
		box-shadow: 0 4px 12px rgba(0,0,0,0.08);
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

	.achievement-icon-wrapper.hard-mode {
		background: linear-gradient(135deg, #8A2387, #E94057, #F27121);
	}

	.progress-bar.hard-progress {

		background: linear-gradient(90deg, #ff7e5f, #feb47b);
	}
</style>