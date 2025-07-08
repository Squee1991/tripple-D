<template>
	<div v-for="data in achievementGroup" class="achievement-group">
		<div class="group-header">
			<h2 class="group-title">{{ t(data.title) }}</h2>
			<span :class="['group-stats', { 'all-completed': getCompletedCount(data) === data.achievements.length }]">
					{{ getCompletedCount(data) }} / {{ data.achievements.length }}
				</span>
		</div>
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
	import { wordPlusArticleAchievment } from '../achieveGroup/article/wordPlusArticle.js';
	import {userlangStore} from "../../store/learningStore";
	const { t } = useI18n();
	const langStore = userlangStore()
	const achievementGroup = ref(wordPlusArticleAchievment);

	const wordArticleCompute = computed(() => {
		return langStore.words.filter(word => word.progress?.wordArticle === true).length
	})

	const getCompletedCount = (group) => {
		if (!group || !group.achievements) return
		return group.achievements.filter(ach => ach.currentProgress >= ach.targetProgress).length
	}

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

	.achievment-list {
		display: flex;
		flex-direction: column;
	}

	.achievment__card {
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
		color: #1e1e1e;
		width: 650px;
		overflow: hidden;
		margin-bottom: 20px;
	}

	.achievment__icon-wrapper {
		flex-shrink: 0;
		width: 70px;
		height: 70px;
		border-radius: 16px;
		border: 3px solid #1e1e1e;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #2dd4bf;
	}
	.icon-emoji {
		font-size: 40px;
	}

	.achievment__details {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	.achievment__title {
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
		background: #2dd4bf;
		border-radius: 0;
		transition: width 0.5s ease-in-out;
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

	.achievment__description {
		font-size: 0.95rem;
		color: #555;
		font-family: 'Inter', sans-serif;
		font-weight: 500;
		margin: 0;
		line-height: 1.4;
	}
</style>