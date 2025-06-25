<template>
	<div class="achievments">
		<div class="achievments-card-container">
			<div v-for="item in achievements" :key="item.id" class="achievement-card-overall">
				<div class="achievement-icon-wrapper-overall">
					<div class="achievement-icon-overall">
						<span class="icon-img-overall">{{ item.icon }}</span>
					</div>
				</div>
				<div class="achievement-details-overall">
					<h3 class="achievement-title-overall">{{ t(item.name) }}</h3>
					<div class="progress-bar-overall-container">
						<div
							class="progress-bar-overall"
							:style="{ width: (item.currentProgress / item.targetProgress * 100) + '%' }"
						></div>
						<span class="progress-text-overall">
                     {{ item.currentProgress }}/{{ item.targetProgress }}
                  </span>
					</div>
					<p class="achievement-description-overall">{{ t(item.description) }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, watch } from 'vue'
	import { overAchievment } from '../achieveGroup/overallAchievements.js'
	import { userlangStore } from '../../store/learningStore.js'
	const langStore = userlangStore()
	const { t} = useI18n()
	const achievements = ref(overAchievment.map(a => ({ ...a })))

	watch(() => langStore.points, (newPoints) => {
		const achievement = achievements.value.find(a => a.id === 'firstArticleAward');
		if (achievement) {
			achievement.currentProgress = Math.min(newPoints, achievement.targetProgress);
		}
	}, { immediate: true });

	watch(() => langStore.exp, (newExp) => {
		const achievement = achievements.value.find(a => a.id === 'levelUpExp');
		if (achievement) {
			achievement.currentProgress = Math.min(newExp, achievement.targetProgress);
		}
	}, { immediate: true });

	watch(() => langStore.learnedWords.length, (newLength) => {
		const ach10 = achievements.value.find(a => a.id === 'learned10Words');
		if (ach10) {
			ach10.currentProgress = Math.min(newLength, ach10.targetProgress);
		}
		const ach100 = achievements.value.find(a => a.id === 'learned100Words');
		if (ach100) {
			ach100.currentProgress = Math.min(newLength, ach100.targetProgress);
		}
	}, { immediate: true });

	watch(() => langStore.wrongAnswers.length, (newLength) => {
		const achievement = achievements.value.find(a => a.id === 'wrong100Answers');
		if (achievement) {
			achievement.currentProgress = Math.min(newLength, achievement.targetProgress);
		}
	}, { immediate: true });

</script>

<style scoped>
	.achievments {
		text-align: center;
		font-family: Arial, sans-serif;
	}

	.achievments-card-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.achievement-card-overall {
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
		margin-bottom: 15px;
		width: 100%;
	}

	.achievement-icon-wrapper-overall {
		flex-shrink: 0;
		position: relative;
		width: 80px;
		height: 80px;
		background: linear-gradient(135deg, #A8C0FF, #3F2B96);
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.achievement-icon-overall {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.icon-img-overall {
		font-size: 45px;
		filter: brightness(1.2);
	}

	.achievement-details-overall {
		flex-grow: 1;
	}

	.achievement-title-overall {
		font-size: 20px;
		color: #333;
		font-weight: 600;
		margin-bottom: 8px;
	}

	.progress-bar-overall-container {
		width: 100%;
		background-color: #e0e0e0;
		border-radius: 10px;
		overflow: hidden;
		height: 25px;
		margin-bottom: 10px;
		position: relative;
	}

	.progress-bar-overall {
		height: 100%;
		background: linear-gradient(90deg, #FFD700, #FFA500);
		border-radius: 10px;
		transition: width 0.5s ease-in-out;
	}

	.progress-text-overall {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #333;
		font-size: 0.8em;
		font-weight: bold;
		text-shadow: 0 0 2px rgba(255, 255, 255, 0.7);
		white-space: nowrap;
	}

	.achievement-description-overall {
		font-size: 16px;
		color: #555;
	}
</style>