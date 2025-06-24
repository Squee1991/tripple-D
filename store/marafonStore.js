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
} from 'firebase/firestore';
import { userAuthStore } from './authStore.js';

const LEADERBOARD_COLLECTION = 'marathon_leaderboard';

export const useGameStore = defineStore('game', () => {
	const authStore = userAuthStore();
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
	const personalBests = ref({ 1: 0, 2: 0, 3: 0 });
	const userId = computed(() => authStore.uid);

	const levelSettings = computed(() => {
		const settings = {
			1: { lives: 5, timer: null },
			2: { lives: 5, timer: 10 },
			3: { lives: 1, timer: 5 },
		};
		return settings[difficulty.value];
	});

	function resetGameState() {
		sessionStreak.value = 0;
		currentWord.value = null;
		gameReady.value = false;
	}

	async function loadWords() {
		if (isLoaded.value) return;
		try {
			const response = await fetch('/words.json');
			const dataByThemes = await response.json();
			allWords.value = Object.values(dataByThemes).flat();
			isLoaded.value = true;
		} catch (error) {
			console.error('Ошибка загрузки слов:', error);
		}
	}

	async function fetchRecord() {
		if (!userId.value) {
			personalBests.value = { 1: 0, 2: 0, 3: 0 };
			return;
		}
		const userLeaderboardDocRef = doc(db, LEADERBOARD_COLLECTION, userId.value);
		const docSnap = await getDoc(userLeaderboardDocRef);

		if (docSnap.exists() && docSnap.data().streaks) {
			const savedStreaks = docSnap.data().streaks;
			personalBests.value = {
				1: savedStreaks['1'] || 0,
				2: savedStreaks['2'] || 0,
				3: savedStreaks['3'] || 0,
			};
		} else {
			personalBests.value = { 1: 0, 2: 0, 3: 0 };
		}
	}

	async function saveRecord() {
		if (!userId.value || !authStore.name) return;

		const userLeaderboardDocRef = doc(db, LEADERBOARD_COLLECTION, userId.value);
		await setDoc(
			userLeaderboardDocRef,
			{
				name: authStore.name,
				avatar: authStore.avatar || '1.png',
				streaks: personalBests.value,
			},
			{ merge: true },
		);
	}

	async function loadMarathonLeaderboard(level) {
		if (!level) return [];
		const leaderboardRef = collection(db, LEADERBOARD_COLLECTION);
		const q = query(
			leaderboardRef,
			where(`streaks.${level}`, '>', 0),
			orderBy(`streaks.${level}`, 'desc')
		);

		const querySnapshot = await getDocs(q);

		const leaderboard = [];
		querySnapshot.forEach(doc => {
			const data = doc.data();
			leaderboard.push({
				id: doc.id,
				name: data.name,
				avatar: data.avatar || '1.png',
				streak: data.streaks[level],
			});
		});
		return leaderboard;
	}

	watch(userId, (newId) => {
		if (newId) {
			fetchRecord();
		} else {
			resetGameState();
			personalBests.value = {
				1: 0,
				2: 0,
				3: 0
			};
		}
	}, { immediate: true });

	function selectGameSettings(level) {
		difficulty.value = level;
		lives.value = levelSettings.value.lives;
		sessionStreak.value = 0;
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
		gameReady.value = false;
		sessionStreak.value = 0;
		stopTimer();
	}

	function submitAnswer(isCorrect) {
		stopTimer();
		if (isCorrect) {
			sessionStreak.value++;
			const currentBest = personalBests.value[difficulty.value] || 0;
			if (sessionStreak.value > currentBest) {
				personalBests.value[difficulty.value] = sessionStreak.value;
				saveRecord();
			}
			startNewRound();
		} else {
			lives.value--;
			sessionStreak.value = 0;
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
		sessionStreak,
		timer,
		levelSettings,
		userId,
		loadWords,
		fetchRecord,
		selectGameSettings,
		startNewRound,
		submitAnswer,
		stopTimer,
		endGame,
		saveRecord,
		loadMarathonLeaderboard,
	};
});