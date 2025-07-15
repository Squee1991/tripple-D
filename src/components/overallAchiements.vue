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
	import {ref, watch , onMounted} from 'vue'
	import {overAchievment} from '../achieveGroup/overAllAchieve/overallAchievements.js'
	import {userlangStore} from '../../store/learningStore.js'
	import {userAuthStore} from '../../store/authStore.js'
	import {useGameStore} from '../../store/marafonStore.js'
	import { useQuestStore } from '../../store/questStore.js'
	const gameStore = useGameStore()
	const questStore = useQuestStore()
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


	watch(() => questStore.dailyQuestCount, (newPoints) => {
		const ach = findAchievementById('daily');
		if (ach) {
			const currentPoints = (typeof newPoints === 'number' && !isNaN(newPoints)) ? newPoints : 0;
			ach.currentProgress = Math.min(currentPoints, ach.targetProgress);
		}
	}, { immediate: true });


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
	},
			{ immediate: true });
	watch(() => gameStore.onTheEdgeProgress, (newProgress) => {
		const ach = findAchievementById('OnTheEdge');
		if (ach) {
			ach.currentProgress = newProgress;
		}
	}, { immediate: true });

</script>

<style scoped>

	.achievements {
		font-family: "Nunito", sans-serif;
		width: 100%;
	}

	.achievement-group-container {
		margin-bottom: 2.5rem;
	}

	.group-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
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
		box-shadow: 4px 4px 0px #1e1e1e;
	}

	.achievements-card-container {
		display: flex;
		flex-direction: column;
	}

	.achievement-card-overall {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		border: 3px solid #1e1e1e;
		padding: 1rem;
		border-radius: 20px;
		background-color: #fff;
		box-shadow: 6px 6px 0px #1e1e1e;
		text-align: left;
		width: 650px;
		transition: all 0.2s ease;
		margin-bottom:20px;
	}

	.achievement-icon-wrapper-overall {
		flex-shrink: 0;
		width: 70px;
		height: 70px;
		background: #fef8e4;
		border-radius: 16px;
		border: 3px solid #1e1e1e;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon-img-overall {
		font-size: 40px;
	}

	.achievement-details-overall {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	.achievement-title-overall {
		font-size: 1.3rem;
		color: #1e1e1e;
		font-weight: 400;
		margin: 0 0 10px 0;
	}

	.progress-bar-overall-container {
		width: 100%;
		background-color: #e0e0e0;
		border-radius: 100px;
		height: 28px;
		margin-bottom: 10px;
		position: relative;
		border: 3px solid #1e1e1e;
		overflow: hidden;
	}

	.progress-bar-overall {
		height: 100%;
		background: #4ade80;
		border-radius: 0;
		transition: width 0.5s ease-in-out;
	}

	.progress-text-overall {
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

	.achievement-description-overall {
		font-size: 0.95rem;
		color: #555;
		font-family: 'Inter', sans-serif;
		font-weight: 500;
		margin: 0;
		line-height: 1.4;
	}
</style>