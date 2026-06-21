import { defineStore } from "pinia";
import { ref, computed } from 'vue';
import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor';
import { useBillingStore } from '../store/billingStore.js';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    OAuthProvider,
    updateProfile,
    signOut,
    deleteUser,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithCredential,
    sendEmailVerification,
    signInWithPopup,
    reauthenticateWithPopup,
    GoogleAuthProvider,
    fetchSignInMethodsForEmail
} from 'firebase/auth';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { doc, setDoc, getDoc, getFirestore, updateDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { userlangStore } from "./learningStore.js";
import { AppleSignIn, SignInScope } from '@capawesome/capacitor-apple-sign-in';
let authStateUnsubscribe = null;

const isUserCancelledAuth = (error) => {
    if (!error) return false;
    const code = String(error.code || '').toLowerCase();
    const msg = String(error.message || error.errorMessage || '').toLowerCase();
    if (
        code === 'sign_in_canceled' ||
        code === 'sign_in_cancelled' ||
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request' ||
        code === 'auth/user-cancelled' ||
        code === '12501'
    ) return true;
    return msg.includes('cancel');
};

export const userAuthStore = defineStore('auth', () => {
    const auth = getAuth();
    const langStore = userlangStore();
    const db = getFirestore();
    const LEADERBOARD_COLLECTION = 'marathon_leaderboard';
    const LEADERBOARD_GUESS = 'leaderboard_guess';
    const uid = ref(null);
    const name = ref(null);
    const email = ref(null);
    const registeredAt = ref(null);
    const providerId = ref('');
    const avatar = ref(null);
    const voiceConsentGiven = ref(false);
    const hasSeenOnboarding = ref(false);
    const initialized = ref(false);
    const totalHats = ref(0);
    const freezeEndsAt = ref(null);
    const claimedBonuses = ref([]);
    const achievements = ref(null);
    const notEnoughArticle = ref(false);
    const gotPremiumBonus = ref(false);
    const IMMUNITY_RANK_HATS = 500;
    const availableAvatars = ref(['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '12.png', '7.png', '8.png', '9.png', '10.png', '11.png', '13.png', '14.png']);
    const ownedAvatars = ref(['1.png', '2.png']);

    const isPremium = ref(false);
    const subscriptionEndsAt = ref(null);
    const subscriptionCancelled = ref(false);
    const paymentSource = ref(null);
    const premiumDiscount = ref({ sale_3: false, sale_5: false, sale_6: false, sale_10: false, sale_15: false });

    watch(isPremium, (newValue) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cached_premium', newValue ? 'true' : 'false')
        }
    })

    const isWebView = ref(false);
    const shouldShowFeedbackSurvey = ref(false);
    let initPromise = null;

    const isGoogleUser = computed(() => providerId.value === 'google.com');
    const avatarUrl = computed(() => avatar.value ? `/images/avatars/${avatar.value}` : '');
    const isFreezeActive = computed(() => freezeEndsAt.value ? Date.now() < freezeEndsAt.value : false);

    const getAvatarUrl = (fileName) => fileName ? `/images/avatars/${fileName}` : '';

    const toMillis = (val) => {
        if (!val) return null;
        if (typeof val === 'number') return val;
        if (typeof val?.toMillis === 'function') return val.toMillis();
        if (val instanceof Date) return val.getTime();
        const parsed = Date.parse(val);
        return isNaN(parsed) ? null : parsed;
    };

    const normalizeDate = (value) => {
        if (!value) return null;
        if (typeof value?.toDate === 'function') return value.toDate().toISOString();
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString();
    };

    const detectWebView = () => {
        const ua = navigator.userAgent || '';
        const isIOSWebView = /iPhone|iPod|iPad/i.test(ua) && !/Safari/i.test(ua);
        const isAndroidWebView = /wv/.test(ua);
        isWebView.value = isIOSWebView || isAndroidWebView;
    };

    const createInitialAchievementsObject = () => ({
        achievements: {
            A1: { wins: 0, streaks: 0, cleanSweeps: 0 },
            A2: { wins: 0, streaks: 0, cleanSweeps: 0 },
            B1: { wins: 0, streaks: 0, cleanSweeps: 0 },
            B2: { wins: 0, streaks: 0, cleanSweeps: 0 }
        }
    });

    const setUserData = (data) => {
        uid.value = data.uid || null;
        name.value = data.name || null;
        email.value = data.email || null;
        registeredAt.value = normalizeDate(data.registeredAt);
        avatar.value = data.avatar || null;
        paymentSource.value = data.paymentSource || null;
        isPremium.value = data.isPremium === true;
        subscriptionEndsAt.value = data.subscriptionEndsAt || null;
        subscriptionCancelled.value = isPremium.value && data.subscriptionCancelled === true;
        providerId.value = data.providerId || '';
        ownedAvatars.value = data.ownedAvatars || ['1.png', '2.png'];
        achievements.value = data.achievements || null;
        voiceConsentGiven.value = data.voiceConsentGiven === true;
        hasSeenOnboarding.value = data.hasSeenOnboarding === true;
        totalHats.value = data.totalHats || 0;
        freezeEndsAt.value = toMillis(data.freezeEndsAt);
        claimedBonuses.value = data.claimedBonuses || [];

        if (data.points !== undefined) langStore.points = data.points;
        if (data.exp !== undefined) langStore.exp = data.exp;
        if (data.totalEarnedPoints !== undefined) langStore.totalEarnedPoints = data.totalEarnedPoints;
        if (data.isLeveling !== undefined) langStore.isLeveling = data.isLeveling;
        if (langStore.isLeveling === 0 && langStore.totalEarnedPoints >= 100) {
            langStore.isLeveling = Math.floor(langStore.totalEarnedPoints / 100);
            langStore.exp = langStore.totalEarnedPoints % 100;
        }
        premiumDiscount.value = {
            sale_3: data.sale_3 || false,
            sale_5: data.sale_5 || false,
            sale_6: data.sale_6 || false,
            sale_10: data.sale_10 || false,
            sale_15: data.sale_15 || false
        };

        if (data.isPremium && !data.gotPremiumBonus) grantPremiumBonusPoints();
    };

    const grantPremiumBonusPoints = async () => {
        const user = auth.currentUser;
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        try {
            const snap = await getDoc(userDocRef);
            if (snap.exists() && snap.data().gotPremiumBonus === true) return;

            langStore.points += 50;
            langStore.totalEarnedPoints += 50;
            langStore.gotPremiumBonus = true;
            await langStore.saveToFirebase();
            await updateDoc(userDocRef, { gotPremiumBonus: true });
        } catch (e) {
            console.error('Ошибка начисления премиум бонуса:', e);
        }
    };

    const modifyHats = async (amount) => {
        const authUser = auth.currentUser;
        if (!authUser) return;
        if (amount < 0) {
            if (totalHats.value >= IMMUNITY_RANK_HATS || totalHats.value <= 0) return;
        }
        let newTotal = Math.max(0, totalHats.value + amount);
        totalHats.value = newTotal;
        try {
            await updateDoc(doc(db, 'users', authUser.uid), { totalHats: newTotal });
        } catch (e) {
            console.error('Ошибка обновления шляп:', e);
        }
    };

    const incrementHats = async () => {
        await modifyHats(1);
    };

    const addClaimedBonus = async (hatAmount) => {
        const user = auth.currentUser;
        if (!user || claimedBonuses.value.includes(hatAmount)) return;

        claimedBonuses.value.push(hatAmount);
        try {
            await updateDoc(doc(db, 'users', user.uid), { claimedBonuses: claimedBonuses.value });
        } catch (e) {
            console.error('Ошибка при сохранении бонуса:', e);
        }
    };

    const activateFreeze = async (days) => {
        const authUser = auth.currentUser;
        if (!authUser) return;
        const msToAdd = days * 24 * 60 * 60 * 1000;
        const newDate = (isFreezeActive.value && typeof freezeEndsAt.value === 'number')
            ? freezeEndsAt.value + msToAdd
            : Date.now() + msToAdd;

        freezeEndsAt.value = newDate;
        await updateDoc(doc(db, 'users', authUser.uid), { freezeEndsAt: newDate });
    };

    const cancelFreeze = async () => {
        if (!freezeEndsAt.value) return;
        const authUser = auth.currentUser;
        freezeEndsAt.value = null;
        if (authUser) {
            try {
                await updateDoc(doc(db, 'users', authUser.uid), { freezeEndsAt: null });
            } catch (e) {
                console.error('Ошибка при отмене заморозки:', e);
            }
        }
    };

    const purchase = async (cost, discountId) => {
        const user = auth.currentUser;
        if (!user) return { success: false, reason: 'no-user' };
        if (!['sale_3', 'sale_5', 'sale_6', 'sale_10', 'sale_15'].includes(discountId)) return { success: false, reason: 'invalid-item' };
        if (totalHats.value < cost) return { success: false, reason: 'insufficient' };
        if (premiumDiscount.value[discountId] === true) return { success: false, reason: 'already-owned' };

        try {
            const newTotal = totalHats.value - cost;
            await updateDoc(doc(db, 'users', user.uid), {
                totalHats: newTotal,
                [discountId]: true,
            });
            totalHats.value = newTotal;
            premiumDiscount.value[discountId] = true;
            return { success: true };
        } catch (error) {
            console.error('purchase error', error);
            return { success: false, reason: 'error' };
        }
    };

    const purchaseAvatar = async (fileName) => {
        notEnoughArticle.value = false;
        if (ownedAvatars.value.includes(fileName)) return 'owned';
        if (langStore.points < 50) {
            notEnoughArticle.value = true;
            return 'insufficient';
        }
        langStore.points -= 50;
        langStore.articlesSpentForAchievement += 50;
        await langStore.saveToFirebase();
        ownedAvatars.value.push(fileName);
        await updateDoc(doc(db, 'users', uid.value), { ownedAvatars: ownedAvatars.value });
        return 'success';
    };

    const updateUserAvatar = async (newAvatarFilename) => {
        const user = auth.currentUser;
        if (!user) return;
        try {
            await updateDoc(doc(db, 'users', user.uid), { avatar: newAvatarFilename });
            avatar.value = newAvatarFilename;
        } catch (error) {
            throw error;
        }
    };

    const clearNotEnoughArticle = () => { notEnoughArticle.value = false; };

    const checkFeedbackSurveyEligibility = async () => {
        shouldShowFeedbackSurvey.value = false;
        const authUser = auth.currentUser;
        const currentUid = uid.value || authUser?.uid;
        if (!currentUid) return;

        const snap = await getDoc(doc(db, 'users', currentUid));
        if (!snap.exists()) return;
        const data = snap.data() || {};
        if (data.feedbackSurveyShownAt) return;

        const regDateFromAuth = authUser?.metadata?.creationTime ? new Date(authUser.metadata.creationTime) : null;
        const regDateFromDb = data.registeredAt && typeof data.registeredAt.toDate === 'function' ? data.registeredAt.toDate() : null;
        const regDate = regDateFromDb || regDateFromAuth;
        if (!regDate) return;

        if (Date.now() - regDate.getTime() < 3 * 24 * 60 * 60 * 1000) return; // Поменял 0 на честные 3 дня, раз переменная называется "threeDaysMs"
        shouldShowFeedbackSurvey.value = true;
    };

    const markFeedbackSurveyShown = async () => {
        const authUser = auth.currentUser;
        const currentUid = uid.value || authUser?.uid;
        if (!currentUid) return;
        await updateDoc(doc(db, 'users', currentUid), { feedbackSurveyShownAt: serverTimestamp() });
        shouldShowFeedbackSurvey.value = false;
    };

    const loginWithApple = async () => {
        try {
            const provider = new OAuthProvider('apple.com');
            const isNative = Capacitor.isNativePlatform();
            let authResult;

            if (isNative) {
                const result = await AppleSignIn.signIn({
                    scopes: [SignInScope.Email, SignInScope.FullName],
                });
                // ИСПРАВЛЕНО: у Capawesome токен берется напрямую из result.idToken
                const idToken = result.idToken;

                if (!idToken) {
                    throw new Error('Apple берет у артикля не вернул токен');
                }

                const credential = provider.credential({
                    idToken: idToken,
                });
                authResult = await signInWithCredential(auth, credential);
            } else {
                provider.addScope('email');
                provider.addScope('name');
                authResult = await signInWithPopup(auth, provider);
            }

            const user = authResult.user;
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    ownedAvatars: ['1.png', '2.png'],
                    name: user.displayName || 'Apple User',
                    email: user.email,
                    registeredAt: serverTimestamp(),
                    feedbackSurveyShownAt: null,
                    avatar: '1.png',
                    subscriptionEndsAt: null,
                    subscriptionCancelled: false,
                    gotPremiumBonus: false,
                    voiceConsentGiven: false,
                    hasSeenOnboarding: false,
                    isPremium: false,
                    totalHats: 0,
                    points: 0,
                    claimedBonuses: [],
                    sale_3: false,
                    sale_5: false,
                    sale_6: false,
                    sale_10: false,
                    sale_15: false,
                    ...createInitialAchievementsObject()
                });
            }
            const finalDoc = await getDoc(userDocRef);

            setUserData({
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                registeredAt: user.metadata.creationTime,
                providerId: 'apple.com',
                ...(finalDoc.data() || {})
            });

            await checkFeedbackSurveyEligibility();

            return authResult;

        } catch (error) {
            if (isUserCancelledAuth(error)) return;
            console.error(error);
            const errorMessage = error.message || error.code || String(error);
            alert('Ошибка входа: ' + errorMessage);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const isNative = Capacitor.isNativePlatform();
            let idToken = null;
            if (isNative) {
                await GoogleSignIn.initialize({
                    clientId: '21366957409-oh0vp8d7dh9echqs2cvbsa5i4pcp68a3.apps.googleusercontent.com',
                });
                const result = await GoogleSignIn.signIn({
                    clientId: '21366957409-oh0vp8d7dh9echqs2cvbsa5i4pcp68a3.apps.googleusercontent.com',
                });
                idToken = result.idToken;
            } else {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                idToken = credential?.idToken;
            }

            if (!idToken) {
                console.error('Берет у артикля не вернул токен');
                return;
            }

            const credential = GoogleAuthProvider.credential(idToken);
            const authResult = await signInWithCredential(auth, credential);
            const user = authResult.user;

            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    ownedAvatars: ['1.png', '2.png'],
                    name: user.displayName || 'Google User',
                    email: user.email,
                    registeredAt: serverTimestamp(),
                    feedbackSurveyShownAt: null,
                    avatar: '1.png',
                    subscriptionEndsAt: null,
                    subscriptionCancelled: false,
                    gotPremiumBonus: false,
                    voiceConsentGiven: false,
                    hasSeenOnboarding: false,
                    isPremium: false,
                    totalHats: 0,
                    points: 0,
                    claimedBonuses: [],
                    sale_3: false,
                    sale_5: false,
                    sale_6: false,
                    sale_10: false,
                    sale_15: false,
                    ...createInitialAchievementsObject()
                });
            }

            const finalDoc = await getDoc(userDocRef);
            setUserData({
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                registeredAt: user.metadata.creationTime,
                providerId: user.providerData[0]?.providerId || 'google.com',
                ...(finalDoc.data() || {})
            });

            await checkFeedbackSurveyEligibility();
        } catch (error) {
            if (isUserCancelledAuth(error)) return;
            alert(`❌ ОШИБКА ВХОДА GOOGLE:\n\n${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`);
        }
    };

    const registerUser = async (userData) => {
        const methods = await fetchSignInMethodsForEmail(auth, userData.email);
        if (methods.length > 0) {
            throw { code: 'auth/email-already-in-use' };
        }
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: userData.name });
        await sendEmailVerification(user);

        const userDocRef = doc(db, 'users', user.uid);
        const initialPayload = {
            name: userData.name,
            email: userData.email,
            registeredAt: serverTimestamp(),
            feedbackSurveyShownAt: null,
            avatar: '1.png',
            ownedAvatars: ['1.png', '2.png'],
            isPremium: false,
            subscriptionEndsAt: null,
            gotPremiumBonus: false,
            voiceConsentGiven: false,
            hasSeenOnboarding: false,
            totalHats: 0,
            points: 0,
            claimedBonuses: [],
            sale_3: false,
            sale_5: false,
            sale_6: false,
            sale_10: false,
            sale_15: false,
            ...createInitialAchievementsObject()
        };
        await setDoc(userDocRef, initialPayload);

        setUserData({
            uid: user.uid,
            providerId: user.providerData[0]?.providerId || '',
            ...initialPayload,
            registeredAt: user.metadata.creationTime
        });
        await checkFeedbackSurveyEligibility();
    };

    const loginUser = async ({ email, password }) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        setUserData({
            uid: userCredential.user.uid,
            name: userCredential.user.displayName,
            email: userCredential.user.email,
            registeredAt: userCredential.user.metadata.creationTime,
            ...(userDoc.exists() ? userDoc.data() : {})
        });
        await checkFeedbackSurveyEligibility();
    };

    const resetPassword = async (email) => {
        await sendPasswordResetEmail(auth, email);
    };

    const fetchuser = () => {
        if (authStateUnsubscribe) authStateUnsubscribe();
        authStateUnsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserData({
                        uid: user.uid,
                        email: user.email,
                        registeredAt: user.metadata.creationTime,
                        providerId: user.providerData[0]?.providerId || '',
                        ...data
                    });
                }
                await checkFeedbackSurveyEligibility();
            } else {
                setUserData({});
                if (Capacitor.isNativePlatform()) {
                    await Purchases.logOut().catch(() => {});
                }
            }
            initialized.value = true;
        });
    };

    const initAuth = () => {
        if (initialized.value) return Promise.resolve();
        if (initPromise) return initPromise;

        initPromise = new Promise((resolve) => {
            if (typeof window === 'undefined') {
                initialized.value = true;
                resolve();
                return;
            }
            if (authStateUnsubscribe) authStateUnsubscribe();
            authStateUnsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    setUserData({
                        uid: user.uid,
                        name: user.displayName,
                        email: user.email,
                        registeredAt: user.metadata.creationTime,
                        providerId: user.providerData[0]?.providerId || '',
                        ...(userDoc.exists() ? userDoc.data() : {})
                    });
                    await checkFeedbackSurveyEligibility();
                } else {
                    setUserData({});
                }
                initialized.value = true;
                resolve();
            });
        });
        return initPromise;
    };

    const refreshUser = async () => {
        const user = auth.currentUser;
        if (!user) return;
        try {
            const snap = await getDoc(doc(db, 'users', user.uid));
            if (snap.exists()) {
                setUserData({
                    uid: user.uid,
                    email: user.email,
                    registeredAt: user.metadata.creationTime,
                    providerId: user.providerData[0]?.providerId || '',
                    ...snap.data()
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const setHasSeenOnboarding = async (value = true) => {
        hasSeenOnboarding.value = !!value;
        if (uid.value) {
            localStorage.setItem(`onboardingPassed_${uid.value}`, value ? 'true' : 'false');
        }
        const user = auth.currentUser;
        if (!user) return;
        try {
            await updateDoc(doc(db, 'users', user.uid), { hasSeenOnboarding: !!value });
        } catch (e) {
            console.error('Ошибка при обновлении hasSeenOnboarding:', e);
        }
    };

    const setVoiceConsent = async (value = true) => {
        const user = auth.currentUser;
        if (!user) return;
        await updateDoc(doc(db, 'users', user.uid), { voiceConsentGiven: !!value });
        voiceConsentGiven.value = !!value;
    };

    const deleteAccount = async (password = null) => {
        const user = auth.currentUser;
        if (!user) throw { code: 'auth/no-current-user' };
        try {
            const usesGoogle = user.providerData.some(p => p.providerId === 'google.com');
            if (usesGoogle) {
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);
            } else {
                if (!user.email) throw { code: 'auth/missing-email' };
                if (!password) throw {code: 'auth/missing-password'};
                const cred = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, cred);
            }

            const batch = writeBatch(db);
            batch.delete(doc(db, 'users', user.uid));
            batch.delete(doc(db, LEADERBOARD_COLLECTION, user.uid));
            batch.delete(doc(db, LEADERBOARD_GUESS, user.uid));
            await batch.commit();

            await deleteUser(user);
            setUserData({});
        } catch (err) {
            if (err && err.code) throw err;
            const msg = String(err?.message || '');
            if (msg.includes('requires-recent-login')) throw { code: 'auth/requires-recent-login' };
            if (msg.includes('popup-closed')) throw { code: 'auth/popup-closed-by-user' };
            throw { code: 'auth/unknown' };
        }
    };

    const logOut = async () => {
        // 1. Сначала "затыкаем уши" Firebase, чтобы слушатель не сработал параллельно
        if (authStateUnsubscribe) {
            authStateUnsubscribe();
            authStateUnsubscribe = null;
        }

        // 2. Чистим кэш
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cached_premium');
        }

        // 3. Выходим из RevenueCat
        if (Capacitor.isNativePlatform()) {
            try {
                await Purchases.logOut();
            } catch (e) {
                console.error("RC Logout Error:", e);
            }
        }

        // 4. Очищаем локальные переменные
        setUserData({});

        // 5. И только теперь спокойно выходим из Firebase
        const auth = getAuth()
        await signOut(auth)
    }

    const activatePremium = (premiumData) => {
        isPremium.value = true;
        subscriptionEndsAt.value = premiumData.subscriptionEndsAt;
        subscriptionCancelled.value = false;
    };

    const markCancelledInDb = () => {
        if (!isPremium.value) return;
        subscriptionCancelled.value = true;
    };

    return {
        refreshUser,
        activatePremium,
        name,
        email,
        registeredAt,
        providerId,
        uid,
        isPremium,
        subscriptionEndsAt,
        subscriptionCancelled,
        avatar,
        avatarUrl,
        availableAvatars,
        ownedAvatars,
        initialized,
        isGoogleUser,
        notEnoughArticle,
        voiceConsentGiven,
        totalHats,
        setVoiceConsent,
        clearNotEnoughArticle,
        achievements,
        incrementHats,

        initAuth,
        fetchuser,
        registerUser,
        loginUser,
        loginWithGoogle,
        resetPassword,
        deleteAccount,
        logOut,
        purchaseAvatar,
        updateUserAvatar,
        getAvatarUrl,
        isWebView, detectWebView,
        hasSeenOnboarding,
        setHasSeenOnboarding,
        shouldShowFeedbackSurvey,
        checkFeedbackSurveyEligibility,
        markFeedbackSurveyShown,
        premiumDiscount,
        purchase,
        markCancelledInDb,
        modifyHats,
        freezeEndsAt,
        isFreezeActive,
        activateFreeze,
        cancelFreeze,
        claimedBonuses,
        loginWithApple,
        addClaimedBonus
    };
});

