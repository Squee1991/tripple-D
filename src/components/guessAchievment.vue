<template>
	<div class="achievements-list">
		<div v-for="achievement in achievements" :key="achievement.threshold" class="achievement-card">
			<div class="achievement-icon-wrapper">
				<div class="achievement-icon">
					<span class="icon-emoji">{{ achievement.icon }}</span>
				</div>
			</div>
			<div class="achievement-details">
				<div class="achievement-header">
					<h3 class="achievement-title">{{ t(achievement.title) }}</h3>
					<span class="achievement-progress-text">
                  {{ guessWordStore.guessedWords.length >= achievement.threshold ? '1/1' : '0/1' }}
               </span>
				</div>
				<div class="progress-bar-container">
					<div
						class="progress-bar"
						:style="{ width: calculateProgressPercentage(guessWordStore.guessedWords.length, achievement.threshold) + '%' }"
					></div>
					<span class="progress-text-overlay">
                  {{ Math.min(guessWordStore.guessedWords.length, achievement.threshold) }} / {{ achievement.threshold }}
               </span>
				</div>
				<p class="achievement-description">
					{{ t(achievement.description) }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {useGuessWordStore} from '../../store/guesStore.js';
	import {guessAchievment} from '../achieveGroup/guessAchievments.js';

    const { t} = useI18n()
	const guessWordStore = useGuessWordStore();
	const achievements = guessAchievment;
	const calculateProgressPercentage = (current, target) => {
		if (target === 0) return 0;
		const progress = (current / target) * 100;
		return Math.min(progress, 100);
	};
</script>

<style scoped>
	.achievements-list {
		display: flex;
		flex-direction: column;
		gap: 15px;
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
		text-align: left;
	}

	.achievement-icon-wrapper {
		flex-shrink: 0;
		position: relative;
		width: 80px;
		height: 80px;
		background: linear-gradient(135deg, #FF7B5A, #FF4500);
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.achievement-icon {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon-emoji {
		font-size: 45px;
		filter: brightness(1.2);
	}

	.achievement-details {
		flex-grow: 1;
	}

	.achievement-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.achievement-title {
		font-size: 20px;
		color: #333;
		margin: 0;
		font-weight: 600;
	}

	.achievement-progress-text {
		font-size: 0.9em;
		color: #777;
		font-weight: 500;
	}

	.progress-bar-container {
		width: 100%;
		background-color: #e0e0e0;
		border-radius: 10px;
		overflow: hidden;
		height: 25px;
		margin-bottom: 10px;
		position: relative;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, #FFD700, #FFA500);
		border-radius: 10px;
		transition: width 0.5s ease-in-out;
	}

	.progress-text-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #333;
		font-size: 14px;
		font-weight: bold;
		text-shadow: 0 0 2px rgba(255, 255, 255, 0.7);
		white-space: nowrap;
	}

	.achievement-description {
		font-size: 0.9em;
		color: #555;
		margin: 0;
	}
</style>