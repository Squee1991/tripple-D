export function useRewardEngine(learningStore) {
	const DEFAULTS = Object.freeze({
		passRatio: 0.8,
		baseAward: 5,
		levelUpXp: 100,
	});

	function passed(score, total, passRatio = DEFAULTS.passRatio) {
		const need = Math.ceil((total || 0) * passRatio);
		return score >= need;
	}

	function computeAward(passed, baseAward = DEFAULTS.baseAward) {
		return passed ? baseAward : 0;
	}

	async function finalize({
								score,
								total,
								passRatio = DEFAULTS.passRatio,
								baseAward = DEFAULTS.baseAward,
								levelUpXp = DEFAULTS.levelUpXp,
								save = true,
							}) {
		const ok = passed(score, total, passRatio);
		const award = computeAward(ok, baseAward);

		const pointsStart = learningStore.points || 0;
		const expStart = learningStore.exp || 0;
		const levelStart = learningStore.isLeveling || 1;

		let pointsAfter = pointsStart;
		let expAfter = expStart;
		let levelAfter = levelStart;

		if (ok && award > 0) {
			pointsAfter = pointsStart + award;
			expAfter = expStart + award;
			if (expAfter >= levelUpXp) {
				expAfter -= levelUpXp;
				levelAfter = levelStart + 1;
			}
			if (save) {
				learningStore.points = pointsAfter;
				learningStore.exp = expAfter;
				learningStore.isLeveling = levelAfter;
				learningStore.totalEarnedPoints = (learningStore.totalEarnedPoints || 0) + award;
				await learningStore.saveToFirebase?.();
			}
		}

		return {
			ok,
			award,
			levelUpXp,
			pointsStart,
			expStart,
			levelStart,
			pointsAfter,
			expAfter,
			levelAfter,
		};
	}

	return {DEFAULTS, passed, computeAward, finalize};
}
