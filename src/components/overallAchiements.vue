<template>
	<div class="achievements">
		<div v-for="group in achievementGroups" :key="group.title" class="achievement-group-container">
			<div class="group-header">
				<h2 class="group-title">{{ t(group.title) }}</h2>
				<span :class="['group-stats', { 'all-completed': getCompletedCount(group) === group.achievements.length }]">
					{{ getCompletedCount(group) }} / {{ group.achievements.length }}
				</span>
			</div>
			<div class="achievements-card-container">
				<div v-for="item in group.achievements" :key="item.id" class="achievement-card-overall">
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
	</div>
</template>

<script setup>
	import {ref, watch , computed} from 'vue'
	import {overAchievment} from '../achieveGroup/overAllAchieve/overallAchievements.js'
	import {userlangStore} from '../../store/learningStore.js'
	import {userAuthStore} from '../../store/authStore.js'
	import {useGameStore} from '../../store/marafonStore.js'
	const gameStore = useGameStore()
	const langStore = userlangStore()
	const authStore = userAuthStore()
	const {t} = useI18n()

	const getCompletedCount = (group) => {
		if (!group || !group.achievements) return 0;
		return group.achievements.filter(ach => ach.currentProgress >= ach.targetProgress).length;
	};

	const achievementGroups = ref(overAchievment.map(group => ({
		...group,
		achievements: group.achievements.map(a => ({ ...a }))
	})));

	const findAchievementById = (id) => {
		for (const group of achievementGroups.value) {
			const achievement = group.achievements.find(a => a.id === id);
			if (achievement) {
				return achievement;
			}
		}
		return null;
	};

	watch(() => langStore.totalEarnedPoints, (newPoints) => {
		const achievement = findAchievementById('firstArticleAward');
		if (achievement) {
			achievement.currentProgress = Math.min(newPoints, achievement.targetProgress);
		}
	}, {immediate: true});
	watch(() => langStore.exp, (newExp) => {
		const achievement = findAchievementById('levelUpExp');
		if (achievement) {
			achievement.currentProgress = Math.min(newExp, achievement.targetProgress);
		}
	}, {immediate: true});
	watch(() => langStore.learnedWords.length, (newLength) => {
		const ach10 = findAchievementById('learned10Words');
		if (ach10) {
			ach10.currentProgress = Math.min(newLength, ach10.targetProgress);
		}
		const ach100 = findAchievementById('learned100Words');
		if (ach100) {
			ach100.currentProgress = Math.min(newLength, ach100.targetProgress);
		}
	}, {immediate: true});
	watch(() => langStore.wrongAnswers.length, (newLength) => {
		const achievement = findAchievementById('wrong100Answers');
		if (achievement) {
			achievement.currentProgress = Math.min(newLength, achievement.targetProgress);
		}
	}, {immediate: true});
	watch(() => authStore.registeredAt, (registrationDate) => {
		if (registrationDate) {
			const achievement = findAchievementById('SiteRegular');
			if (achievement) {
				const registeredDate = new Date(registrationDate);
				const currentDate = new Date();
				const diffTime = Math.abs(currentDate - registeredDate);
				const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
				achievement.currentProgress = Math.min(diffDays, achievement.targetProgress);
			}
		}
	}, {immediate: true});
	watch(() => gameStore.lastChanceProgress, (newProgress) => {
		const ach = findAchievementById('LastChance');
		if (ach) {
			ach.currentProgress = newProgress;
		}
	}, { immediate: true });
	watch(() => gameStore.marginForErrorProgress, (newProgress) => {
		const ach = findAchievementById('MarginForError');
		if (ach) {
			ach.currentProgress = newProgress;
		}
	}, { immediate: true });
	watch(() => gameStore.onTheEdgeProgress, (newProgress) => {
		const ach = findAchievementById('OnTheEdge');
		if (ach) {
			ach.currentProgress = newProgress;
		}
	}, { immediate: true });

</script>

<style scoped>
	.achievements {
		font-family: Arial, sans-serif;
	}

	.achievement-group-container {
		margin-bottom: 30px;
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

	.achievements-card-container {
		display: flex;
		flex-direction: column;
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
		font-size: 15px;
		color: #555;
	}
</style>