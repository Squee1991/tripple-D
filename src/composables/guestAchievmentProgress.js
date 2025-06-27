import { computed } from 'vue';

export function useAchievementProgress(currentProgressRef, achievementsConfig) {

	const currentAchievement = computed(() => {
		const progressValue = currentProgressRef.value;
		if (progressValue >= achievementsConfig[achievementsConfig.length - 1].threshold) {
			return achievementsConfig[achievementsConfig.length - 1];
		}
		for (let i = 0; i < achievementsConfig.length; i++) {
			if (progressValue < achievementsConfig[i].threshold) {
				return achievementsConfig[i];
			}
		}
		return achievementsConfig[achievementsConfig.length - 1];
	});

	const achievementProgressPercentage = computed(() => {
		const progressValue = currentProgressRef.value;
		const currentAch = currentAchievement.value;
		const currentIdx = achievementsConfig.indexOf(currentAch);
		if (currentIdx === achievementsConfig.length - 1) {
			return 100;
		}

		const currentThreshold = currentAch.threshold;
		const nextThreshold = achievementsConfig[currentIdx + 1].threshold;
		if (progressValue < currentThreshold) {
			if (currentThreshold === 0) return 0;
			const progress = progressValue / currentThreshold;
			return Math.min(100, Math.max(0, progress * 100));
		}

		if (nextThreshold === currentThreshold) {
			return 100;
		}
		const progress = (progressValue - currentThreshold) / (nextThreshold - currentThreshold);
		return Math.min(100, Math.max(0, progress * 100));
	});


	const currentLevelNumber = computed(() => {
		const index = achievementsConfig.indexOf(currentAchievement.value);
		return index + 1;
	});

	const totalProgressLevels = computed(() => achievementsConfig.length);
	const currentProgressText = computed(() => {
		const progressValue = currentProgressRef.value;
		const currentAch = currentAchievement.value;

		const targetThreshold = currentAch.threshold;

		return `${progressValue}/${targetThreshold}`;
	});


	return {
		currentAchievement,
		achievementProgressPercentage,
		currentLevelNumber,
		totalProgressLevels,
		currentProgressText
	};
}