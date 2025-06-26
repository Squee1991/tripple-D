<template>
	<div class="achievements-list">
		<div v-for="achievement in achievements" :key="achievement.id" class="achievement-card">
			<div class="achievement-icon-wrapper">
				<div class="achievement-icon">
					<span class="icon-emoji">{{ achievement.icon }}</span>
				</div>
			</div>
			<div class="achievement-details">
				<div class="achievement-header">
					<h3 class="achievement-title">{{ t(achievement.name) }}</h3>
					<span class="achievement-progress-text">
                  {{ achievement.currentProgress >= achievement.targetProgress ? '1/1' : '0/1' }}
               </span>
				</div>
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
</template>

<script setup>
	import {ref, computed, watch} from 'vue';
	import {listenAchieveGroup} from '../achieveGroup/listen/listen.js';
	import {userlangStore} from '../../store/learningStore.js'
	const langStore = userlangStore()
	const achievements = ref(listenAchieveGroup);
    const { t } = useI18n()
	const audioWordComputed = computed(() => {
		return langStore.words.filter(word => word.progress?.audio === true).length
	})

	watch(audioWordComputed, (newCount) => {
		achievements.value.forEach(achievement => {
			achievement.currentProgress = Math.min(newCount, achievement.targetProgress)
		})

	}, {immediate: true})

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
		font-size: 15px;
		color: #555;

	}
</style>