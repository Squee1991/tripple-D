<template>
	<div v-for="group in achievementGroup" :key="group.title" class="achievement-group">
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
	import {ref, watch, computed} from 'vue';
	import {writeArticleGroupAchievment} from '../achieveGroup/article/writeArticle.js';
	import {userlangStore} from "../../store/learningStore";
	const { t } = useI18n()
	const langStore = userlangStore();
	const achievementGroup = ref(JSON.parse(JSON.stringify(writeArticleGroupAchievment)));

	const derSuccessCount = computed(() => langStore.words.filter(word => word.article === 'der' && word.progress?.article === true).length);
	const dieSuccessCount = computed(() => langStore.words.filter(word => word.article === 'die' && word.progress?.article === true).length);
	const dasSuccessCount = computed(() => langStore.words.filter(word => word.article === 'das' && word.progress?.article === true).length);

	watch([derSuccessCount, dieSuccessCount, dasSuccessCount],
		([newDerCount, newDieCount, newDasCount]) => {
			achievementGroup.value.forEach(group => {
				if (group.title.includes('der')) {
					group.acvhievments.forEach(achievement => {
						achievement.currentProgress = Math.min(newDerCount, achievement.targetProgress);
					});
				} else if (group.title.includes('die')) {

					group.acvhievments.forEach(achievement => {
						achievement.currentProgress = Math.min(newDieCount, achievement.targetProgress);
					});
				} else if (group.title.includes('das')) {
					group.acvhievments.forEach(achievement => {
						achievement.currentProgress = Math.min(newDasCount, achievement.targetProgress);
					});
				}
			});

		}, {immediate: true});
</script>

<style scoped>

	.achievement-group {
		margin-bottom: 30px;
	}

	.group-title {
		font-size: 1.5em;
		color: #333;
		margin-bottom: 15px;
		padding-bottom: 5px;
		border-bottom: 2px solid #eee;
		font-weight: 600;
	}

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
		background: linear-gradient(135deg, #6c757d, #343a40);
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

	.achievement-title {
		font-size: 20px;
		color: #333;
		margin: 0;
		font-weight: 600;
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
		font-size: 15px;
		color: #555;
		margin: 0;
	}
</style>