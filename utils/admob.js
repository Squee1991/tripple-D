import { AdMob, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

let isAdProcessing = false;

export async function showInterstitial(nextStep) {
	if (!Capacitor.isNativePlatform()) {
		return nextStep();
	}

	if (isAdProcessing) return; // Если уже грузится реклама — игнорим клик
	isAdProcessing = true;

	let hasTransitioned = false; // Защита от двойного перехода

	// Умная функция перехода
	const goNext = () => {
		if (!hasTransitioned) {
			hasTransitioned = true;
			isAdProcessing = false;
			nextStep();
		}
	};

	// Слушатель закрытия рекламы
	const listener = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
		console.log('Реклама закрыта, начинаем задание!');
		listener.remove();
		goNext(); // СТРОГО запускаем переход только тут!
	});

	try {
		// Подготавливаем (качаем по сети)
		await AdMob.prepareInterstitial({
			adId: 'ca-app-pub-3940256099942544/1033173712',
		});

		// Показываем
		await AdMob.showInterstitial();

	} catch (e) {
		console.log("Ошибка рекламы, просто идем дальше", e);
		listener.remove();
		goNext(); // Если нет инета или AdBlock - пускаем сразу
	}
}

export async function showRewarded(onReward, onComplete) {
	if (!Capacitor.isNativePlatform()) {
		onReward();
		return onComplete(true);
	}
	if (isAdProcessing) return;
	isAdProcessing = true;
	let rewardReceived = false;
	const rewardListener = await AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
		rewardReceived = true;
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