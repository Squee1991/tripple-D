import { AdMob, AdmobConsentStatus, InterstitialAdPluginEvents, RewardAdPluginEvents } from '@capacitor-community/admob';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';
import { userAuthStore } from '../store/authStore.js';

let isAdProcessing = false;
let isInterstitialLoaded = false;
let isInterstitialLoading = false;
let interstitialLoadedAt = 0;
let lastInterstitialTime = 0;
let initPromise = null;
let privacyOptionsRequired = false;

const ConsentChoice = registerPlugin('ConsentChoice');

const CONSENT_PLATFORMS = ['android'];

const AD_LIMIT_PER_DAY = 10;
const INTERSTITIAL_LIMIT_PER_DAY = 12;
const INTERSTITIAL_COOLDOWN = 2 * 60 * 1000;
const INTERSTITIAL_TTL = 55 * 60 * 1000;
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

function getTodayCount(storageKey) {
	try {
		const stats = JSON.parse(localStorage.getItem(storageKey));
		return stats && stats.date === getTodayKey() ? stats.count : 0;
	} catch (e) {
		return 0;
	}
}

function incrementTodayCount(storageKey) {
	const count = getTodayCount(storageKey) + 1;
	try {
		localStorage.setItem(storageKey, JSON.stringify({ date: getTodayKey(), count }));
	} catch (e) {
		console.warn('Ошибка записи статистики рекламы:', e);
	}
	return count;
}

function canShowRewardedAd() {
	return getTodayCount('adRewardStats') < AD_LIMIT_PER_DAY;
}

function canShowInterstitialToday() {
	return getTodayCount('adInterstitialStats') < INTERSTITIAL_LIMIT_PER_DAY;
}

function recordSuccessfulView() {
	const count = incrementTodayCount('adRewardStats');
	console.log(`Пользователь берет бонус! Использовано: ${count}/${AD_LIMIT_PER_DAY}`);
}
function isInterstitialFresh() {
	return isInterstitialLoaded && Date.now() - interstitialLoadedAt < INTERSTITIAL_TTL;
}

export async function preloadInterstitial() {
	if (!Capacitor.isNativePlatform() || isInterstitialLoading || isInterstitialFresh()) return;
	// Премиум без рекламы — не делаем пустых запросов
	if (!userAuthStore().hasAds) return;
	// Дневной лимит исчерпан — загруженная реклама всё равно не покажется
	if (!canShowInterstitialToday()) return;
	isInterstitialLoading = true;
	try {
		if (initPromise) await initPromise;
		await AdMob.prepareInterstitial({ adId: INTERSTITIAL_ID });
		isInterstitialLoaded = true;
		interstitialLoadedAt = Date.now();
	} catch (e) {
		isInterstitialLoaded = false;
	} finally {
		isInterstitialLoading = false;
	}
}

async function getConsentChoice() {
	try {
		const { purposeConsents } = await ConsentChoice.getPurposeConsents();
		if (!purposeConsents.includes('1')) return 'declined';
		return purposeConsents.includes('0') ? 'custom' : 'accepted';
	} catch (e) {
		return 'unknown';
	}
}

async function gatherConsent(track) {
	if (!CONSENT_PLATFORMS.includes(platform)) return;
	try {
		const info = await AdMob.requestConsentInfo();
		privacyOptionsRequired = info.privacyOptionsRequirementStatus === 'REQUIRED';
		if (info.status !== AdmobConsentStatus.REQUIRED || !info.isConsentFormAvailable) return;

		track?.('consent_form_shown');
		const result = await AdMob.showConsentForm();
		privacyOptionsRequired = result.privacyOptionsRequirementStatus === 'REQUIRED';
		track?.(`consent_${await getConsentChoice()}`);
	} catch (e) {
		console.error('Ошибка окна согласия:', e);
	}
}

export async function isPrivacyOptionsRequired() {
	if (initPromise) await initPromise;
	return privacyOptionsRequired;
}

export async function showPrivacyOptions(track) {
	try {
		await AdMob.showPrivacyOptionsForm();
		track?.('consent_changed', { choice: await getConsentChoice() });
	} catch (e) {
		console.error('Ошибка окна настроек конфиденциальности:', e);
	}
}

export function initAdmob(track) {
	if (!Capacitor.isNativePlatform()) return;
	if (!initPromise) {
		initPromise = AdMob.initialize({
			requestTrackingAuthorization: true,
			initializeForTesting: false
		}).then(() => gatherConsent(track)).catch((e) => {
			console.error('Ошибка инициализации AdMob:', e);
		});

		initPromise
			.then(() => userAuthStore().initAuth())
			.then(() => preloadInterstitial());

		App.addListener('resume', () => {
			if (isInterstitialLoaded && !isInterstitialFresh()) {
				isInterstitialLoaded = false;
				preloadInterstitial();
			}
		});
	}
	return initPromise;
}

export async function showInterstitial(nextStep) {
	const authStore = userAuthStore();

	if (!authStore.hasAds || !Capacitor.isNativePlatform()) return nextStep();
	if (Date.now() - lastInterstitialTime < INTERSTITIAL_COOLDOWN) return nextStep();
	if (!canShowInterstitialToday()) return nextStep();
	if (isAdProcessing) return;

	if (!isInterstitialFresh()) {
		isInterstitialLoaded = false;
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
			preloadInterstitial();
			nextStep();
		}
	};

	try {
		dismissListener = await AdMob.addListener(InterstitialAdPluginEvents.Dismissed, goNext);
		failListener = await AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, goNext);

		await AdMob.showInterstitial();
		lastInterstitialTime = Date.now();
		incrementTodayCount('adInterstitialStats');
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

		if (initPromise) await initPromise;
		await AdMob.prepareRewardVideoAd({ adId: REWARDED_ID });
		await AdMob.showRewardVideoAd();
	} catch (e) {
		cleanup(false);
	}
}