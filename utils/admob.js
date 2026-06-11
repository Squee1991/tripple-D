import { AdMob, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { userAuthStore } from '../store/authStore.js';

let isAdProcessing = false;
const AD_LIMIT_PER_DAY = 5;

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

export async function showInterstitial(nextStep) {
	const authStore = userAuthStore();
	if (authStore.isPremium) {
		return nextStep();
	}
	if (!Capacitor.isNativePlatform()) {
		return nextStep();
	}
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
		console.log('Реклама закрыта, начинаем задание!');
		listener.remove();
		goNext();
	});
	try {
		await AdMob.prepareInterstitial({
			adId: 'ca-app-pub-3940256099942544/1033173712',
		});
		await AdMob.showInterstitial();

	} catch (e) {
		console.log("Ошибка рекламы, просто идем дальше", e);
		listener.remove();
		goNext();
	}
}

export async function showRewarded(onReward, onComplete, onLimitReached) {
	const authStore = userAuthStore();
	if (authStore.isPremium) {
		onReward();
		return onComplete(true);
	}
	if (!Capacitor.isNativePlatform()) {
		onReward();
		return onComplete(true);
	}
	if (!canShowRewardedAd()) {
		console.log("Дневной лимит рекламы исчерпан.");
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

	try {
		await AdMob.prepareRewardVideoAd({
			adId: 'ca-app-pub-3940256099942544/5224354917',
		});
		await AdMob.showRewardVideoAd();
	} catch (e) {
		console.log("Ошибка Rewarded рекламы", e);
		rewardListener.remove();
		dismissListener.remove();
		isAdProcessing = false;
		onComplete(false);
	}
}