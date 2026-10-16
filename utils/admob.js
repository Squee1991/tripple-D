import { AdMob, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { userAuthStore } from '../store/authStore.js';

let isAdProcessing = false;
let isInterstitialLoaded = false;
let isInterstitialLoading = false;
let lastInterstitialTime = 0;

const AD_LIMIT_PER_DAY = 10;
const INTERSTITIAL_COOLDOWN = 2 * 60 * 1000;
const platform = Capacitor.getPlatform();

const INTERSTITIAL_ID = platform === 'android'
	? 'ca-app-pub-7535671094319234/9879918114'
	: 'ca-app-pub-7535671094319234/9780662374';

const REWARDED_ID = platform === 'android'
	? 'ca-app-pub-7535671094319234/9972234061'
	: 'ca-app-pub-7535671094319234/3051034273';

function getTodayKey() {
	const today = new Date();
	return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function canShowRewardedAd() {
	try {
		const todayKey = getTodayKey();
		const statsStr = localStorage.getItem('adRewardStats');
		if (!statsStr) return true;
		const stats = JSON.parse(statsStr);
		if (stats.date !== todayKey) return true;
		return stats.count < AD_LIMIT_PER_DAY;
	} catch (e) {
		return true;
	}
}

function recordSuccessfulView() {
	try {
		const todayKey = getTodayKey();
		const statsStr = localStorage.getItem('adRewardStats');
		let stats = { date: todayKey, count: 0 };
		if (statsStr) {
			const parsedStats = JSON.parse(statsStr);
			if (parsedStats && parsedStats.date === todayKey) {
				stats = parsedStats;
			}
		}
		stats.count++;
		localStorage.setItem('adRewardStats', JSON.stringify(stats));
		console.log(`Пользователь берет бонус! Использовано: ${stats.count}/${AD_LIMIT_PER_DAY}`);
	} catch (e) {
		console.warn('Ошибка записи статистики бонусов:', e);
	}
}
// Тихая предзагрузка рекламы в кэш (не тормозит интерфейс и прелоадер)
async function preloadInterstitial() {
	if (!Capacitor.isNativePlatform() || isInterstitialLoaded || isInterstitialLoading) return;
	isInterstitialLoading = true;
	try {
		await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID });
		isInterstitialLoaded = true;
	} catch (e) {
		isInterstitialLoaded = false;
	} finally {
		isInterstitialLoading = false;
	}
}

export async function initAdmob() {
	if (!Capacitor.isNativePlatform()) return;
	try {
		await AdMob.initialize({
			requestTrackingAuthorization: true,
			initializeForTesting: false // Строго боевой режим!
		});
		// Сразу при входе в приложение тихо качаем первую рекламу про запас
		preloadInterstitial();
	} catch (e) {
		console.error('Ошибка инициализации AdMob:', e);
	}
}

export async function showInterstitial(nextStep) {
	const authStore = userAuthStore();

	if (!authStore.hasAds || !Capacitor.isNativePlatform()) return nextStep();
	if (Date.now() - lastInterstitialTime < INTERSTITIAL_COOLDOWN) return nextStep();
	if (isAdProcessing) return;
	// Если реклама еще не успела докачаться в фоне — запускаем докачку и сразу пускаем юзера без зависаний
	if (!isInterstitialLoaded) {
		preloadInterstitial();
		return nextStep();
	}

	isAdProcessing = true;
	let hasTransitioned = false;
	let dismissListener = null;
	let failListener = null;

	const goNext = () => {
		if (!hasTransitioned) {
			hasTransitioned = true;
			dismissListener?.remove();
			failListener?.remove();
			isAdProcessing = false;
			isInterstitialLoaded = false;
			preloadInterstitial(); // Сразу грузим следующую рекламу в фоне
			nextStep();
		}
	};

	try {
		dismissListener = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, goNext);
		failListener = await AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, goNext);

		await AdMob.showInterstitial();
		lastInterstitialTime = Date.now();
	} catch (e) {
		goNext();
	}
}

export async function showRewarded(onReward, onComplete, onLimitReached) {
	const authStore = userAuthStore();

	if (authStore.isPremium || !Capacitor.isNativePlatform()) {
		onReward();
		return onComplete(true);
	}

	if (!canShowRewardedAd()) {
		if (onLimitReached) onLimitReached();
		return;
	}
	if (isAdProcessing) return;

	isAdProcessing = true;
	let rewardReceived = false;
	let isHandled = false;
	let rewardListener = null;
	let dismissListener = null;
	let failListener = null;

	const cleanup = (success) => {
		if (!isHandled) {
			isHandled = true;
			rewardListener?.remove();
			dismissListener?.remove();
			failListener?.remove();
			isAdProcessing = false;
			onComplete(success);
		}
	};

	try {
		rewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
			rewardReceived = true;
			recordSuccessfulView();
			onReward();
		});

		dismissListener = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
			cleanup(rewardReceived);
		});

		failListener = await AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => {
			cleanup(false);
		});

		await AdMob.prepareRewardVideoAd({ adId: REWARDED_ID });
		await AdMob.showRewardVideoAd();
	} catch (e) {
		cleanup(false);
	}
}