import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { userAuthStore } from './authStore.js';

// Ежедневный забег по артиклям: каждый день 30 одинаковых для всех слов, одна попытка в день.
// Результат и серия дней хранятся в профиле пользователя: users/{uid}.dailyRun
//   { lastPlayedDate: '2026-10-15', lastScore, lastTimeMs, lastTotal, streak, bestScore, totalRuns }

export const DAILY_WORD_COUNT = 30;
const BASE_REWARD_POINTS = 5;
const MAX_STREAK_BONUS_POINTS = 5;

// Дата по местному времени игрока: забег обновляется в его полночь
function dateKey(date = new Date()) {
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}

function yesterdayKey() {
	const date = new Date();
	date.setDate(date.getDate() - 1);
	return dateKey(date);
}

// Генератор случайных чисел от «зерна»: одна и та же дата — один и тот же набор слов у всех
function seededRandom(seed) {
	let state = seed >>> 0;
	return function nextRandom() {
		state = (state + 0x6D2B79F5) >>> 0;
		let value = Math.imul(state ^ (state >>> 15), 1 | state);
		value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

function hashText(text) {
	let hash = 2166136261;
	for (let index = 0; index < text.length; index++) {
		hash = Math.imul(hash ^ text.charCodeAt(index), 16777619);
	}
	return hash >>> 0;
}

export const useDailyRunStore = defineStore('dailyRun', () => {
	const authStore = userAuthStore();
	const db = getFirestore();

	const dailyRun = ref(null);
	const isProfileLoaded = ref(false);
	const allWords = ref([]);
	const today = ref(dateKey());

	const isPlayedToday = computed(() => dailyRun.value?.lastPlayedDate === today.value);

	// Серия жива, если последний забег был сегодня или вчера; иначе она сгорела
	const currentStreak = computed(() => {
		const lastDate = dailyRun.value?.lastPlayedDate;
		if (lastDate === today.value || lastDate === yesterdayKey()) return dailyRun.value.streak || 0;
		return 0;
	});

	function refreshToday() {
		today.value = dateKey();
	}

	async function loadProfile() {
		refreshToday();
		if (!authStore.uid) return;
		try {
			const snapshot = await getDoc(doc(db, 'users', authStore.uid));
			dailyRun.value = snapshot.exists() ? snapshot.data().dailyRun || null : null;
			isProfileLoaded.value = true;
		} catch (error) {
			console.error('Ошибка загрузки ежедневного забега:', error);
		}
	}

	async function loadWords() {
		if (allWords.value.length) return;
		try {
			const response = await fetch('/words.json');
			const wordsByTheme = await response.json();
			allWords.value = Object.values(wordsByTheme).flat();
		} catch (error) {
			console.error('Ошибка загрузки слов:', error);
		}
	}

	// Слова дня: перемешиваем весь список «зерном» от даты и берём первые 30
	function buildTodayWords() {
		const nextRandom = seededRandom(hashText('daily-run:' + today.value));
		const shuffled = [...allWords.value];
		for (let index = shuffled.length - 1; index > 0; index--) {
			const randomIndex = Math.floor(nextRandom() * (index + 1));
			[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
		}
		return shuffled.slice(0, DAILY_WORD_COUNT);
	}

	function rewardForStreak(streak) {
		return BASE_REWARD_POINTS + Math.min(Math.max(streak - 1, 0), MAX_STREAK_BONUS_POINTS);
	}

	// Сохраняет результат сегодняшнего забега. Возвращает { streak, reward } или null, если сегодня уже сохранено
	async function saveResult({ score, total, timeMs }) {
		refreshToday();
		if (!authStore.uid || isPlayedToday.value) return null;

		const previous = dailyRun.value || {};
		const streak = previous.lastPlayedDate === yesterdayKey() ? (previous.streak || 0) + 1 : 1;
		dailyRun.value = {
			lastPlayedDate: today.value,
			lastScore: score,
			lastTotal: total,
			lastTimeMs: timeMs,
			streak,
			bestScore: Math.max(previous.bestScore || 0, score),
			totalRuns: (previous.totalRuns || 0) + 1
		};
		try {
			await setDoc(doc(db, 'users', authStore.uid), { dailyRun: dailyRun.value }, { merge: true });
		} catch (error) {
			console.error('Ошибка сохранения ежедневного забега:', error);
		}
		return { streak, reward: rewardForStreak(streak) };
	}

	return {
		dailyRun, isProfileLoaded, allWords, today, isPlayedToday, currentStreak,
		loadProfile, loadWords, buildTodayWords, saveResult, refreshToday
	};
});
