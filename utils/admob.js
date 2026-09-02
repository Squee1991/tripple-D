import { AdMob, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { userAuthStore } from '../store/authStore.js';

let isAdProcessing = false;
let lastInterstitialTime = 0;
const AD_LIMIT_PER_DAY = 10;
const INTERSTITIAL_COOLDOWN = 50 * 1000;
const platform = Capacitor.getPlatform();

function getTodayKey() {
	const today = new Date();
	return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

function canShowRewardedAd() {
	const todayKey = getTodayKey();
	const statsStr = localStorage.getItem('adRewardStats');
	if (!statsStr) return true;
	const stats = JSON.parse(statsStr);
	if (stats.date !== todayKey) return true;
	return stats.count < AD_LIMIT_PER_DAY;
}

function recordSuccessfulView() {
	const todayKey = getTodayKey();
	const statsStr = localStorage.getItem('adRewardStats');
	let stats = { date: todayKey, count: 0 };
	if (statsStr) {
		const parsedStats = JSON.parse(statsStr);
		if (parsedStats.date === todayKey) {
			stats = parsedStats;
		}
	}
	stats.count++;
	localStorage.setItem('adRewardStats', JSON.stringify(stats));
	console.log(`Пользователь берет бонус! Использовано: ${stats.count}/${AD_LIMIT_PER_DAY}`);
}

export async function initAdmob() {
	if (!Capacitor.isNativePlatform()) return;
	await AdMob.initialize({
		requestTrackingAuthorization: true,
		initializeForTesting: false
	});
}

export async function showInterstitial(nextStep) {
	const authStore = userAuthStore();
	if (authStore.isPremium || !Capacitor.isNativePlatform()) return nextStep();
	if (Date.now() - lastInterstitialTime < INTERSTITIAL_COOLDOWN) return nextStep();
	if (isAdProcessing) return;

	isAdProcessing = true;
	let hasTransitioned = false;

	const goNext = () => {
		if (!hasTransitioned) {
			hasTransitioned = true;
			isAdProcessing = false;
			nextStep();
		}
	};

	const listener = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
		listener.remove();
		goNext();
	});

	const currentAdId = platform === 'android' ? 'ca-app-pub-7535671094319234/9879918114' : 'ca-app-pub-7535671094319234/9780662374';

	try {
		await AdMob.prepareInterstitial({ adId: currentAdId });
		await AdMob.showInterstitial();
		lastInterstitialTime = Date.now();
	} catch (e) {
		listener.remove();
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

	const rewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
		rewardReceived = true;
		recordSuccessfulView();
		onReward();
	});

	const dismissListener = await AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
		rewardListener.remove();
		dismissListener.remove();
		isAdProcessing = false;
		onComplete(rewardReceived);
	});

	const currentAdId = platform === 'android' ? 'ca-app-pub-7535671094319234/9972234061' : 'ca-app-pub-7535671094319234/3051034273';

	try {
		await AdMob.prepareRewardVideoAd({ adId: currentAdId });
		await AdMob.showRewardVideoAd();
	} catch (e) {
		rewardListener.remove();
		dismissListener.remove();
		isAdProcessing = false;
		onComplete(false);
	}
}