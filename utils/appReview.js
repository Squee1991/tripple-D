import { InAppReview } from '@capacitor-community/in-app-review';
import { Capacitor } from '@capacitor/core';

// Оценка приложения, два пути:
// 1) В удачный момент (открыт сундук земли, круглая серия, каждый 10-й успешный квест) сами вызываем
//    системное окно оценки (InAppReview): звёзды прямо в приложении, человек никуда не уходит.
//    Покажет ли его система, решает она сама (квоты), и узнать это нельзя, поэтому просим редко.
// 2) Строка «Оценить приложение» в настройках: всегда открывает страницу в магазине (openStoreReview).
//    Системное окно по кнопке не вызываем: из-за квоты кнопка может «ничего не сделать».
// ТЕСТ: true = без порогов и пауз, окно запрашивается после КАЖДОГО успешного квеста и сундука.
// Только для тестовой сборки! Перед релизом вернуть false
const REVIEW_TEST_MODE = false;

const STORAGE_KEY = 'appReviewPrompt';
const MIN_SUCCESS_QUESTS = 5;
const MIN_ACTIVE_DAYS = 2;
const REPEAT_AFTER_DAYS = 30;
const MAX_REQUESTS_PER_YEAR = 3;
const QUESTS_FALLBACK_EVERY = 10;
const STREAK_MILESTONES = [7, 14, 30, 60, 100, 200, 365];
const DAY = 24 * 60 * 60 * 1000;
const YEAR = 365 * DAY;

const ANDROID_PACKAGE = 'com.skillupgerman.app';
// ID приложения в App Store (цифры из ссылки apps.apple.com/app/id...). Пока пусто, на iOS вместо ссылки системное окно
const IOS_APP_STORE_ID = '';

function readState() {
	let state;
	try {
		state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
	} catch (e) {
		state = {};
	}
	return migrateOldState(state);
}

// Старая версия хранила firstSuccessAt и lastRequestAt. Переносим, чтобы давние пользователи
// не ждали заново «2 разных дня», а прошлый запрос оценки учитывался в паузе 30 дней
function migrateOldState(state) {
	if (state.firstSuccessAt && !state.activeDays) {
		const first = new Date(state.firstSuccessAt).toISOString().slice(0, 10);
		state.activeDays = first === todayKey() ? [first] : [first, 'migrated'];
	}
	if (state.lastRequestAt && !state.requestTimes) {
		state.requestTimes = [state.lastRequestAt];
	}
	return state;
}

function writeState(state) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		console.warn('Ошибка сохранения состояния оценки:', e);
	}
}

function todayKey() {
	return new Date().toISOString().slice(0, 10);
}

export function isStreakMilestone(streak) {
	return STREAK_MILESTONES.includes(Number(streak));
}

// Пора ли просить: человек втянулся, давно не просили, годовой лимит не исчерпан
function canAsk(state, now) {
	if (REVIEW_TEST_MODE) return true;
	const recent = (state.requestTimes || []).filter(ts => now - ts < YEAR);
	const lastAt = recent.length ? Math.max(...recent) : 0;
	const isEngaged = (state.successCount || 0) >= MIN_SUCCESS_QUESTS && (state.activeDays || []).length >= MIN_ACTIVE_DAYS;
	const isTimeToAsk = !lastAt || now - lastAt >= REPEAT_AFTER_DAYS * DAY;
	return isEngaged && isTimeToAsk && recent.length < MAX_REQUESTS_PER_YEAR;
}

async function requestSystemReview(state, now) {
	state.requestTimes = [...(state.requestTimes || []).filter(ts => now - ts < YEAR), now];
	writeState(state);
	try {
		await InAppReview.requestReview();
		return true;
	} catch (e) {
		console.error('Ошибка окна оценки:', e);
		return false;
	}
}

// Вызывать после каждого успешного квеста: считает успехи и активные дни.
// Просит оценку, если canPrompt и это удачный момент: круглая серия (streakMilestone) или каждый 10-й успешный квест.
// Возвращает причину запроса ('streak' | 'quests') или null
export async function onQuestSuccessForReview({ canPrompt = true, streakMilestone = false } = {}) {
	if (!Capacitor.isNativePlatform()) return null;

	const now = Date.now();
	const state = readState();
	state.successCount = (state.successCount || 0) + 1;
	const day = todayKey();
	const days = state.activeDays || [];
	if (!days.includes(day)) state.activeDays = [...days, day].slice(-10);

	const isFallbackQuest = REVIEW_TEST_MODE || state.successCount % QUESTS_FALLBACK_EVERY === 0;
	const reason = streakMilestone ? 'streak' : (isFallbackQuest ? 'quests' : null);
	if (!canPrompt || !reason || !canAsk(state, now)) {
		writeState(state);
		return null;
	}
	await requestSystemReview(state, now);
	return reason;
}

// Удачный момент вне квеста (например, открыт сундук пройденной земли). Возвращает true, если окно запрошено
export async function requestReviewAtPeak() {
	if (!Capacitor.isNativePlatform()) return false;
	const now = Date.now();
	const state = readState();
	if (!canAsk(state, now)) return false;
	return requestSystemReview(state, now);
}

export function canOpenStoreReview() {
	return Capacitor.isNativePlatform();
}

// Строка «Оценить приложение» в настройках: открывает страницу приложения в магазине
export async function openStoreReview() {
	const platform = Capacitor.getPlatform();
	if (platform === 'android') {
		// Capacitor перехватывает переход на чужой адрес и отдаёт его системе (Intent), Android открывает Google Play.
		// Само приложение при этом никуда не уходит
		window.location.href = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}&showAllReviews=true`;
		return;
	}
	if (platform === 'ios' && IOS_APP_STORE_ID) {
		window.location.href = `https://apps.apple.com/app/id${IOS_APP_STORE_ID}?action=write-review`;
		return;
	}
	try {
		await InAppReview.requestReview();
	} catch (e) {
		console.error('Ошибка окна оценки:', e);
	}
}
