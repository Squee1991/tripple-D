<template>
	<div v-for="group in achievementsData" :key="group.title" class="achievement-group">
		<h2 class="group-title">{{ t(group.title) }}</h2>
		<div class="achievements-list">
			<div v-for="achievement in group.acvhievments" :key="achievement.id" class="achievement-card">
				<div class="achievement-icon-wrapper">
					<div class="achievement-icon">
						<span class="icon-emoji">{{ achievement.icon }}</span>
					</div>
				</div>
				<div class="achievement-details">
					<h3 class="achievement-title">{{ t(achievement.name) }}</h3>
					<div class="progress-bar-container">
						<div
							class="progress-bar"
							:style="{ width: (achievement.currentProgress / achievement.targetProgress * 100) + '%' }"
						></div>
						<span class="progress-text-overlay">
                             {{ achievement.currentProgress }} /{{ achievement.targetProgress }}
                  </span>
					</div>
					<p class="achievement-description">{{ t(achievement.description) }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, watch , computed } from 'vue';
	import { assembleWordGroupAchievement } from '../achieveGroup/wordsFromLetters/wordsFromLetters.js';
	import {userlangStore} from "../../store/learningStore";
	const achievementsData = ref(assembleWordGroupAchievement);
	const langStore = userlangStore()
    const { t } = useI18n()
	const wordLetterComputed = computed(()=> {
		return langStore.words.filter(word => word.progress?.letters === true).length
	})

	watch(wordLetterComputed, (newCount) => {
		achievementsData.value.forEach(achievement => {
			achievement.acvhievments.forEach(count => {
				count.currentProgress = Math.min(newCount , count.targetProgress )
			})
		})
	}, { immediate: true})

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
		padding: 15px;
		border-radius: 12px;
		background-color: #fff;
		max-width: 500px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		text-align: left;
		color: #ccc;
	}

	.achievement-icon-wrapper {
		flex-shrink: 0;
		position: relative;
		width: 80px;
		height: 80px;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(to bottom, #007bff, #0056b3);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.achievement-icon {
		display: flex;
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

	.achievement-title {
		font-size: 20px;
		color: #333;
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
		font-size: 0.8em;
		font-weight: bold;
		white-space: nowrap;
	}

	.achievement-description {
		font-size: 15px;
		color: #555;
	}

</style>