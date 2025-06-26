<template>
	<div v-for="data in achievementGroup" class="achievement-group">
		<h2 class="group__title">{{ t(data.title) }}</h2>
		<div class="achievment-list">
			<div v-for="achievement in data.achievements" class="achievment__card">
				<div class="achievment__icon-wrapper">
					<div class="achievement-icon">
						<span class="icon-emoji">{{ achievement.icon }}</span>
					</div>
				</div>
				<div class="achievment__details">
					<h3 class="achievment__title">{{ t(achievement.name) }}</h3>
					<div class="progress-bar-container">
						<div
							class="progress-bar"
							:style="{ width: (achievement.currentProgress / achievement.targetProgress * 100) + '%' }"
						></div>
						<span class="progress-text-overlay">
                     {{ achievement.currentProgress }} / {{ achievement.targetProgress }}
                  </span>
					</div>
					<p class="achievment__description">{{ t(achievement.description) }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref , computed , watch } from 'vue';
	import { wordPlusArticleAchievment } from '../achieveGroup/word+article/wordPlusArticle.js';
	import {userlangStore} from "../../store/learningStore";
	const { t } = useI18n();
	const langStore = userlangStore()
	const achievementGroup = ref(wordPlusArticleAchievment);

	const wordArticleCompute = computed(() => {
		return langStore.words.filter(word => word.progress?.wordArticle === true).length
	})

	watch(wordArticleCompute , (newCount) => {
		achievementGroup.value.forEach(achievement => {
			achievement.achievements.forEach(word => {
				word.currentProgress = Math.min(newCount , word.targetProgress )
			})
		})
	}, { immediate: true})

</script>

<style scoped>
	.achievement-group {
		margin-bottom: 30px;
	}

	.group__title {
		font-size: 1.5em;
		color: #444;
		margin-bottom: 15px;
		padding-bottom: 5px;
		border-bottom: 2px solid #eee;
	}

	.achievment-list {
		display: flex;
		flex-direction: column;
		gap: 15px;
		font-family: Arial, sans-serif;
	}

	.achievment__card {
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

	.achievment__icon-wrapper {
		flex-shrink: 0;
		position: relative;
		width: 80px;
		height: 80px;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #274361;
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

	.achievment__details {
		flex-grow: 1;
	}

	.achievment__title {
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

	.achievment__description {
		font-size: 15px;
		color: #555;
	}


</style>