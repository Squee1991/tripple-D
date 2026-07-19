import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import {
	doc,
	getDoc,
	getFirestore,
	setDoc,
	collection,
	getDocs,
	query,
	orderBy,
	where,
	limit,
	getCountFromServer
} from 'firebase/firestore';
import { userAuthStore } from './authStore.js';
import { dailyStore } from './dailyStore.js';

const LEADERBOARD_COLLECTION = 'marathon_leaderboard';

export const useGameStore = defineStore('game', () => {
	const authStore = userAuthStore();
	const daily = dailyStore();
	const db = getFirestore();
	const allWords = ref([]);
	const isLoaded = ref(false);
	const gameReady = ref(false);
	const currentWord = ref(null);
	const difficulty = ref(1);
	const lives = ref(0);
	const gameActive = ref(false);
	const sessionStreak = ref(0);
	const timer = ref(0);
	const timerId = ref(null);
	const lastChanceProgress = ref(0);
	const marginForErrorProgress = ref(0);
	const onTheEdgeProgress = ref(0);
	const fastAnswerStreak = ref(0);

	const personalBests = ref({ 1: 0, 2: 0, 3: 0 });
	const allTimeBests = ref({ 1: 0, 2: 0, 3: 0 });
	const totalCorrectAnswers = ref({ 1: 0, 2: 0, 3: 0 });
	const isRecordUpdated = ref(false);

	const userId = computed(() => authStore.uid);
	const levelSettings = computed(() => {
		const settings = {
			1: { lives: 5, timer: null },
			2: { lives: 5, timer: 10 },
			3: { lives: 1, timer: 5 },
		};
		return settings[difficulty.value];
	});
	function getSeasonState() {
		const now = new Date();
		const anchor = Date.UTC(2024, 0, 1);
		const msSinceAnchor = now.getTime() - anchor;
		const cycleLengthMs = 4 * 60 * 1000;
		const halfCycleMs = 2 * 60 * 1000;

		const cycle = Math.floor(msSinceAnchor / cycleLengthMs);
		const msOfCycle = msSinceAnchor % cycleLengthMs;
		const isOpen = msOfCycle < halfCycleMs;
		const currentSeasonId = `Season_${cycle}`;
		const previousSeasonId = `Season_${cycle - 1}`;
		const msLeft = isOpen ? (halfCycleMs - msOfCycle) : (cycleLengthMs - msOfCycle);

		const d = Math.floor(msLeft / (1000 * 60 * 60 * 24));
		const h = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
		const m = Math.floor((msLeft / (1000 * 60)) % 60);
		const s = Math.floor((msLeft / 1000) % 60);

		return {
			isOpen,
			currentSeasonId,
			previousSeasonId,
			timeLeft: { d, h, m, s }
		};
	}
	// function getSeasonState() {
	// 	const now = new Date();
	// 	const anchor = Date.UTC(2024, 0, 1);
	// 	const msSinceAnchor = now.getTime() - anchor;
	// 	const msPerDay = 1000 * 60 * 60 * 24;
	// 	const daysSince = Math.floor(msSinceAnchor / msPerDay);
	// 	const cycleLength = 28;
	// 	const cycle = Math.floor(daysSince / cycleLength);
	// 	const dayOfCycle = daysSince % cycleLength;
	// 	const isOpen = dayOfCycle >= 14;
	// 	const currentSeasonId = `Season_${cycle}`;
	// 	const previousSeasonId = `Season_${cycle - 1}`;
	// 	const nextPhaseDate = new Date(anchor + (cycle * cycleLength + (isOpen ? 28 : 14)) * msPerDay);
	// 	const msLeft = nextPhaseDate.getTime() - now.getTime();
	// 	const d = Math.floor(msLeft / msPerDay);
	// 	const h = Math.floor((msLeft / (1000 * 60 * 60)) % 24);
	// 	const m = Math.floor((msLeft / 1000 / 60) % 60);
	//
	// 	return {
	// 		isOpen,
	// 		currentSeasonId,
	// 		previousSeasonId,
	// 		timeLeft: { d, h, m }
	// 	};
	// }

	function resetGameState() {
		sessionStreak.value = 0;
		currentWord.value = null;
		gameReady.value = false;
		isRecordUpdated.value = false;
	}

	async function loadWords() {
		if (isLoaded.value) return;
		try {
			const response = await fetch('/words.json');
			const dataByThemes = await response.json();
			allWords.value = Object.values(dataByThemes).flat();
			isLoaded.value = true;
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchRecord() {
		if (!userId.value) {
			personalBests.value = { 1: 0, 2: 0, 3: 0 };
			allTimeBests.value = { 1: 0, 2: 0, 3: 0 };
			totalCorrectAnswers.value = { 1: 0, 2: 0, 3: 0 };
			lastChanceProgress.value = 0;
			marginForErrorProgress.value = 0;
			onTheEdgeProgress.value = 0;
			return;
		}

		const userLeaderboardDocRef = doc(db, LEADERBOARD_COLLECTION, userId.value);
		const docSnap = await getDoc(userLeaderboardDocRef);

		if (docSnap.exists()) {
			const data = docSnap.data();
			const { currentSeasonId } = getSeasonState();

			if (data.streaks) {
				allTimeBests.value = {
					1: data.streaks['1'] || 0,
					2: data.streaks['2'] || 0,
					3: data.streaks['3'] || 0,
				};
			}

			if (data.currentSeasonId === currentSeasonId && data.currentSeasonStreaks) {
				personalBests.value = {
					1: data.currentSeasonStreaks['1'] || 0,
					2: data.currentSeasonStreaks['2'] || 0,
					3: data.currentSeasonStreaks['3'] || 0,
				};
			} else {
				personalBests.value = { 1: 0, 2: 0, 3: 0 };
			}

			if (data.totalCorrect) {
				totalCorrectAnswers.value = {
					1: data.totalCorrect['1'] || 0,
					2: data.totalCorrect['2'] || 0,
					3: data.totalCorrect['3'] || 0,
				};
			}
			lastChanceProgress.value = data.lastChanceProgress || 0;
			marginForErrorProgress.value = data.marginForErrorProgress || 0;
			onTheEdgeProgress.value = data.onTheEdgeProgress || 0;
		} else {
			personalBests.value = { 1: 0, 2: 0, 3: 0 };
			allTimeBests.value = { 1: 0, 2: 0, 3: 0 };
			totalCorrectAnswers.value = { 1: 0, 2: 0, 3: 0 };
			lastChanceProgress.value = 0;
			marginForErrorProgress.value = 0;
			onTheEdgeProgress.value = 0;
		}
	}

	async function saveRecord() {
		if (!userId.value || !authStore.name) return;

		const userLeaderboardDocRef = doc(db, LEADERBOARD_COLLECTION, userId.value);
		const { currentSeasonId } = getSeasonState();

		await setDoc(
			userLeaderboardDocRef,
			{
				name: authStore.name,
				avatar: authStore.avatar || '1.png',
				streaks: allTimeBests.value,
				totalCorrect: totalCorrectAnswers.value,
				lastChanceProgress: lastChanceProgress.value,
				marginForErrorProgress: marginForErrorProgress.value,
				onTheEdgeProgress: onTheEdgeProgress.value,
				currentSeasonId: currentSeasonId,
				currentSeasonStreaks: personalBests.value
			},
			{ merge: true },
		);

		isRecordUpdated.value = false;
	}

	async function loadMarathonLeaderboard(level) {
		if (!level) return [];

		const leaderboardRef = collection(db, LEADERBOARD_COLLECTION);
		const { currentSeasonId } = getSeasonState();

		const q = query(
			leaderboardRef,
			where('currentSeasonId', '==', currentSeasonId),
			where(`currentSeasonStreaks.${level}`, '>', 0),
			orderBy(`currentSeasonStreaks.${level}`, 'desc'),
			limit(11)
		);

		const querySnapshot = await getDocs(q);
		const leaderboard = [];
		let index = 1;

		querySnapshot.forEach(doc => {
			const data = doc.data();
			leaderboard.push({
				id: doc.id,
				name: data.name,
				avatar: data.avatar || '1.png',
				streak: data.currentSeasonStreaks[level],
				rank: index++,
				isCurrentUser: doc.id === userId.value
			});
		});

		const isMeInTop10 = leaderboard.some(player => player.id === userId.value);
		const myCurrentStreak = personalBests.value[level] || 0;

		if (!isMeInTop10 && userId.value && myCurrentStreak > 0) {
			const countQuery = query(
				leaderboardRef,
				where('currentSeasonId', '==', currentSeasonId),
				where(`currentSeasonStreaks.${level}`, '>', myCurrentStreak)
			);
			const countSnapshot = await getCountFromServer(countQuery);
			const playersAhead = countSnapshot.data().count;
			const myActualRank = playersAhead + 1;

			leaderboard.push({
				id: userId.value,
				name: authStore.name,
				avatar: authStore.avatar || '1.png',
				streak: myCurrentStreak,
				rank: myActualRank,
				isCurrentUser: true,
				isSeparated: true
			});
		}

		return leaderboard;
	}

	async function getPreviousSeasonRank(level, seasonId) {
		if (!userId.value) return 0;

		const leaderboardRef = collection(db, LEADERBOARD_COLLECTION);
		const q = query(
			leaderboardRef,
			where('currentSeasonId', '==', seasonId),
			where(`currentSeasonStreaks.${level}`, '>', 0),
			orderBy(`currentSeasonStreaks.${level}`, 'desc'),
			limit(3)
		);

		const snap = await getDocs(q);
		let rank = 1;
		let myRank = 0;

		snap.forEach(doc => {
			if (doc.id === userId.value) myRank = rank;
			rank++;
		});

		return myRank;
	}

	watch(userId, (newId) => {
		if (newId) {
			fetchRecord();
		} else {
			resetGameState();
			personalBests.value = { 1: 0, 2: 0, 3: 0 };
			allTimeBests.value = { 1: 0, 2: 0, 3: 0 };
		}
	}, { immediate: true });

	function selectGameSettings(level) {
		difficulty.value = level;
		lives.value = levelSettings.value.lives;
		sessionStreak.value = 0;
		fastAnswerStreak.value = 0;
		gameReady.value = true;
	}

	function startNewRound() {
		if (allWords.value.length === 0) {
			endGame();
			return;
		}
		const randomIndex = Math.floor(Math.random() * allWords.value.length);
		currentWord.value = allWords.value[randomIndex];
		gameActive.value = true;
		startTimer();
	}

	function endGame() {
		gameActive.value = false;
		stopTimer();

		if (isRecordUpdated.value) {
			saveRecord();
		}
	}

	function retryGame() {
		lives.value = levelSettings.value.lives;
		sessionStreak.value = 0;
		startNewRound();
	}

	function submitAnswer(isCorrect) {
		const timeLeft = timer.value;
		stopTimer();

		if (isCorrect) {
			sessionStreak.value++;
			totalCorrectAnswers.value[difficulty.value]++;

			let updateTriggered = false;
			const { isOpen } = getSeasonState();

			if (isOpen && sessionStreak.value > (personalBests.value[difficulty.value] || 0)) {
				personalBests.value[difficulty.value] = sessionStreak.value;
				updateTriggered = true;
			}
			if (sessionStreak.value > (allTimeBests.value[difficulty.value] || 0)) {
				allTimeBests.value[difficulty.value] = sessionStreak.value;
				updateTriggered = true;
			}

			if (updateTriggered) {
				isRecordUpdated.value = true;
			}
		} else {
			lives.value--;
			sessionStreak.value = 0;
			fastAnswerStreak.value = 0;
		}

		if (difficulty.value === 2) {
			try { daily.noteMarathonMediumStreak(sessionStreak.value); } catch {}
		}
		if (difficulty.value === 1) {
			try { daily.noteEasyStreak(sessionStreak.value); } catch {}
		}
		if (difficulty.value === 3) {
			try { daily.noteHardStreak(sessionStreak.value); } catch {}
		}
		if (!isCorrect) {
			try { daily.addWrong(1); } catch {}
		}
		if (difficulty.value === 1 && lives.value === 1) {
			if (sessionStreak.value > lastChanceProgress.value) {
				lastChanceProgress.value = Math.min(sessionStreak.value, 20);
			}
		}
		if (difficulty.value === 1 && lives.value === 5) {
			if (sessionStreak.value > marginForErrorProgress.value) {
				marginForErrorProgress.value = Math.min(sessionStreak.value, 20);
			}
		}
		if (isCorrect && difficulty.value === 3 && timeLeft >= 2) {
			fastAnswerStreak.value++;
		} else {
			if (!isCorrect) {
				sessionStreak.value = 0;
				fastAnswerStreak.value = 0;
			}
		}
		if (fastAnswerStreak.value > onTheEdgeProgress.value) {
			onTheEdgeProgress.value = Math.min(fastAnswerStreak.value, 20);
		}

		if (isCorrect) {
			startNewRound();
		} else {
			if (lives.value <= 0) {
				endGame();
			} else {
				startNewRound();
			}
		}
	}

	function stopTimer() {
		if (timerId.value) {
			clearInterval(timerId.value);
			timerId.value = null;
		}
	}

	function startTimer() {
		stopTimer();
		const timeLimit = levelSettings.value.timer;
		if (timeLimit !== null) {
			timer.value = timeLimit;
			timerId.value = setInterval(() => {
				timer.value--;
				if (timer.value <= 0) {
					submitAnswer(false);
				}
			}, 1000);
		}
	}

	return {
		isLoaded,
		gameReady,
		currentWord,
		difficulty,
		lives,
		gameActive,
		personalBests,
		allTimeBests,
		sessionStreak,
		timer,
		levelSettings,
		userId,
		totalCorrectAnswers,
		lastChanceProgress,
		marginForErrorProgress,
		onTheEdgeProgress,
		loadWords,
		fetchRecord,
		selectGameSettings,
		startNewRound,
		submitAnswer,
		stopTimer,
		endGame,
		saveRecord,
		loadMarathonLeaderboard,
		getSeasonState,
		getPreviousSeasonRank,
		retryGame
	};
});