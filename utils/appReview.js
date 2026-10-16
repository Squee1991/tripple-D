import { InAppReview } from '@capacitor-community/in-app-review';
import { Capacitor } from '@capacitor/core';

// Системное окно оценки (Google Play / App Store) прямо в приложении.
// Покажет ли система окно — решает она сама (квоты), поставил ли человек оценку — узнать нельзя.
// Поэтому просим только в удачный момент и редко: после успешного квеста,
// когда человек уже втянулся (несколько дней и уроков), не чаще раза в 2 месяца
const STORAGE_KEY = 'appReviewPrompt';
const MIN_SUCCESS_QUESTS = 8;
const MIN_DAYS_SINCE_FIRST = 3;
const REPEAT_AFTER_DAYS = 60;
const MAX_REQUESTS = 3;
const DAY = 24 * 60 * 60 * 1000;

function readState() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
	} catch (e) {
		return {};
	}
}

function writeState(state) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		console.warn('Ошибка сохранения состояния оценки:', e);
	}
}

// Вызывать после успешно пройденного квеста: считает успехи и, если canPrompt и пора, просит оценку.
// Возвращает true, если окно было запрошено
export async function onQuestSuccessForReview(canPrompt = true) {
	if (!Capacitor.isNativePlatform()) return false;

	const now = Date.now();
	const state = readState();
	state.successCount = (state.successCount || 0) + 1;
	state.firstSuccessAt = state.firstSuccessAt || now;
	state.requests = state.requests || 0;

	const isEngaged = state.successCount >= MIN_SUCCESS_QUESTS && now - state.firstSuccessAt >= MIN_DAYS_SINCE_FIRST * DAY;
	const isTimeToAsk = !state.lastRequestAt || now - state.lastRequestAt >= REPEAT_AFTER_DAYS * DAY;
	const shouldAsk = canPrompt && isEngaged && isTimeToAsk && state.requests < MAX_REQUESTS;

	if (shouldAsk) {
		state.lastRequestAt = now;
		state.requests += 1;
	}
	writeState(state);
	if (!shouldAsk) return false;

	try {
		await InAppReview.requestReview();
		return true;
	} catch (e) {
		console.error('Ошибка окна оценки:', e);
		return false;
	}
}
