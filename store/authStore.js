import {defineStore} from "pinia";
import {ref, computed, watch} from 'vue'
import { Capacitor } from '@capacitor/core';
import { Purchases } from '@revenuecat/purchases-capacitor'
import { useBillingStore } from '../store/billingStore.js'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    EmailAuthProvider, reauthenticateWithCredential, OAuthProvider,
    updateProfile,
    signOut,
    deleteUser,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithCredential,
    sendEmailVerification,
    signInWithPopup,
    reauthenticateWithPopup, GoogleAuthProvider, fetchSignInMethodsForEmail
} from 'firebase/auth';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import {doc, setDoc, getDoc, getFirestore, updateDoc, deleteDoc, serverTimestamp, writeBatch} from 'firebase/firestore';
import {userlangStore} from "./learningStore.js";

let authStateUnsubscribe = null;

const isUserCancelledAuth = (error) => {
    if (!error) return false
    const code = String(error.code || '').toLowerCase()
    const msg = String(error.message || error.errorMessage || '').toLowerCase()
    if (
        code === 'sign_in_canceled' ||
        code === 'sign_in_cancelled' ||
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request' ||
        code === 'auth/user-cancelled' ||
        code === '12501'
    ) return true
    return msg.includes('cancel')
}

export const userAuthStore = defineStore('auth', () => {
    const auth = getAuth()
    const langStore = userlangStore();
    const LEADERBOARD_COLLECTION = 'marathon_leaderboard';
    const LEADERBOARD_GUESS = 'leaderboard_guess'
    const DAILY__COLLECTION = 'daily';
    const LOCAL_STAT_COLLECTION = 'localStatGame';
    const voiceConsentGiven = ref(false)
    const name = ref(null)
    const email = ref(null)
    const registeredAt = ref(null)
    const db = getFirestore();
    const providerId = ref('')
    const avatar = ref(null)
    const uid = ref(null)
    const notEnoughArticle = ref(false)
    const gotPremiumBonus = ref(false)
    const subscriptionEndsAt = ref(null)
    const subscriptionCancelled = ref(false)
    const availableAvatars = ref(['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '12.png', '7.png', '8.png', '9.png', '10.png', '11.png', '13.png', '14.png']);
    const ownedAvatars = ref(['1.png', '2.png']);
    const isPremium = ref(typeof window !== 'undefined' ? localStorage.getItem('cached_premium') === 'true' : false)
    const achievements = ref(null);
    const isWebView = ref(false)
    const hasSeenOnboarding = ref(false)
    const initialized = ref(false)
    const shouldShowFeedbackSurvey = ref(false)
    const totalHats = ref(0)
    const claimedBonuses = ref([])
    const freezeEndsAt = ref(null)
    const IMMUNITY_RANK_HATS = 500
    const paymentSource = ref(null)
    const premiumDiscount = ref({
        sale_5: false,
        sale_10: false,
        sale_15: false
    })

    const addClaimedBonus = async (hatAmount) => {
        const user = getAuth().currentUser
        if (!user) return
        if (!claimedBonuses.value.includes(hatAmount)) {
            claimedBonuses.value.push(hatAmount)
            const userDocRef = doc(db, 'users', user.uid)
            try {
                await updateDoc(userDocRef, {
                    claimedBonuses: claimedBonuses.value
                })
            } catch (e) {
                console.error('Ошибка при сохранении бонуса:', e)
            }
        }
    }

    const toMillis = (val) => {
        if (!val) return null
        if (typeof val === 'number') return val
        if (typeof val?.toMillis === 'function') return val.toMillis()
        if (val instanceof Date) return val.getTime()
        const parsed = Date.parse(val)
        return isNaN(parsed) ? null : parsed
    }

    const modifyHats = async (amount) => {
        const authUser = getAuth().currentUser
        if (!authUser) return
        if (amount < 0) {
            if (totalHats.value >= IMMUNITY_RANK_HATS) return
            if (totalHats.value <= 0) return
        }
        let newTotal = totalHats.value + amount
        if (newTotal < 0) newTotal = 0
        totalHats.value = newTotal
        const userDocRef = doc(db, 'users', authUser.uid)
        try {
            await updateDoc(userDocRef, {
                totalHats: newTotal
            })
        } catch (e) {
            console.error('Ошибка обновления шляп:', e)
        }
    }

    const cancelFreeze = async () => {
        if (!freezeEndsAt.value) return
        console.log('Пользователь вернулся! Снимаем заморозку')
        const authUser = getAuth().currentUser
        freezeEndsAt.value = null
        if (authUser) {
            const userDocRef = doc(db, 'users', authUser.uid)
            try {
                await updateDoc(userDocRef, {
                    freezeEndsAt: null
                })
            } catch (e) {
                console.error('Ошибка при отмене заморозки:', e)
            }
        }
    }

    const activateDiscount = async (discountId) => {
        const user = getAuth().currentUser
        if (!user) return {success: false, reason: 'no-user'}

        const allowed = ['sale_5', 'sale_10', 'sale_15']
        if (!allowed.includes(discountId)) return {success: false, reason: 'invalid-item'}

        if (premiumDiscount.value[discountId] === true) {
            return {success: false, reason: 'already-owned'}
        }

        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, {[discountId]: true})

        premiumDiscount.value[discountId] = true
        return {success: true}
    }

    let initPromise = null

    const checkFeedbackSurveyEligibility = async () => {
        shouldShowFeedbackSurvey.value = false
        const authUser = getAuth().currentUser
        const currentUid = uid.value || authUser?.uid
        if (!currentUid) return
        const userDocRef = doc(db, 'users', currentUid)
        const snap = await getDoc(userDocRef)
        if (!snap.exists()) return
        const data = snap.data() || {}
        const shownAt =
            data.feedbackSurveyShownAt && typeof data.feedbackSurveyShownAt.toDate === 'function'
                ? data.feedbackSurveyShownAt.toDate()
                : null

        if (shownAt) return

        const regDateFromAuth = authUser?.metadata?.creationTime ? new Date(authUser.metadata.creationTime) : null
        const regDateFromDb = data.registeredAt && typeof data.registeredAt.toDate === 'function' ? data.registeredAt.toDate() : null
        const regDate = regDateFromDb || regDateFromAuth
        if (!regDate) return
        const threeDaysMs = 0
        if (Date.now() - regDate.getTime() < threeDaysMs) return
        shouldShowFeedbackSurvey.value = true
    }

    const markFeedbackSurveyShown = async () => {
        const authUser = getAuth().currentUser
        const currentUid = uid.value || authUser?.uid
        if (!currentUid) return
        const userDocRef = doc(db, 'users', currentUid)
        await updateDoc(userDocRef, {feedbackSurveyShownAt: serverTimestamp()})
        shouldShowFeedbackSurvey.value = false
    }

    const isGoogleUser = computed(() => providerId.value === 'google.com');
    const getAvatarUrl = (fileName) => {
        if (!fileName) return '';
        return `/images/avatars/${fileName}`;
    }
    const detectWebView = () => {
        const ua = navigator.userAgent || ''
        const isIOSWebView = /iPhone|iPod|iPad/i.test(ua) && !/Safari/i.test(ua)
        const isAndroidWebView = /wv/.test(ua)
        isWebView.value = isIOSWebView || isAndroidWebView
    }

    const normalizeDate = (value) => {
        if (!value) return null;
        if (typeof value?.toDate === 'function') return value.toDate().toISOString();
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString();
    };

    const avatarUrl = computed(() => {
        return avatar.value ? `/images/avatars/${avatar.value}` : '';
    });

    const createInitialAchievementsObject = () => {
        return {
            achievements: {
                A1: {wins: 0, streaks: 0, cleanSweeps: 0},
                A2: {wins: 0, streaks: 0, cleanSweeps: 0},
                B1: {wins: 0, streaks: 0, cleanSweeps: 0},
                B2: {wins: 0, streaks: 0, cleanSweeps: 0}
            }
        };
    };

    const grantPremiumBonusPoints = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userDocRef);
        const alreadyGranted = snap.exists() && snap.data().gotPremiumBonus === true;
        if (alreadyGranted) return;
        langStore.points += 50;
        langStore.totalEarnedPoints += 50;
        langStore.gotPremiumBonus = true;
        await langStore.saveToFirebase();
        await updateDoc(userDocRef, {gotPremiumBonus: true});
    };

    const setUserData = (data) => {
        name.value = data.name || null
        email.value = data.email || null
        registeredAt.value = normalizeDate(data.registeredAt)
        uid.value = data.uid || null
        avatar.value = data.avatar || null
        paymentSource.value = data.paymentSource || null
        isPremium.value = data.isPremium === true
        subscriptionEndsAt.value = data.subscriptionEndsAt || null
        subscriptionCancelled.value = isPremium.value && data.subscriptionCancelled === true
        providerId.value = data.providerId || ''
        ownedAvatars.value = data.ownedAvatars || ['1.png', '2.png']
        achievements.value = data.achievements || null
        voiceConsentGiven.value = data.voiceConsentGiven === true
        hasSeenOnboarding.value = data.hasSeenOnboarding === true
        totalHats.value = data.totalHats || 0
        freezeEndsAt.value = toMillis(data.freezeEndsAt)
        claimedBonuses.value = data.claimedBonuses || []
        if (data.points !== undefined) langStore.points = data.points;
        if (data.exp !== undefined) langStore.exp = data.exp;
        if (data.totalEarnedPoints !== undefined) langStore.totalEarnedPoints = data.totalEarnedPoints;
        premiumDiscount.value = {
            sale_5: data.sale_5 || false,
            sale_10: data.sale_10 || false,
            sale_15: data.sale_15 || false
        }
        if (data.isPremium && !data.gotPremiumBonus) grantPremiumBonusPoints()
    }

    const purchase = async (cost, discountId) => {
        const user = getAuth().currentUser
        if (!user) return {success: false, reason: 'no-user'}
        const allowed = ['sale_5', 'sale_10', 'sale_15']
        if (!allowed.includes(discountId)) return {success: false, reason: 'invalid-item'}
        if (totalHats.value < cost) return {success: false, reason: 'insufficient'}
        if (premiumDiscount.value[discountId] === true) return {success: false, reason: 'already-owned'}
        try {
            const newTotal = totalHats.value - cost
            const userRef = doc(db, 'users', user.uid)
            await updateDoc(userRef, {
                totalHats: newTotal,
                [discountId]: true,
            })
            totalHats.value = newTotal
            premiumDiscount.value[discountId] = true
            return {success: true}
        } catch (error) {
            console.error('purchase error', error)
            return {success: false, reason: 'error'}
        }
    }

    const updateUserAvatar = async (newAvatarFilename) => {
        const user = getAuth().currentUser;
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        try {
            await updateDoc(userDocRef, {
                avatar: newAvatarFilename
            });
            avatar.value = newAvatarFilename;
        } catch (error) {
            throw error;
        }
    };

    const isFreezeActive = computed(() => {
        if (!freezeEndsAt.value) return false
        return Date.now() < freezeEndsAt.value
    })

    const activateFreeze = async (days) => {
        const authUser = getAuth().currentUser
        if (!authUser) return
        const msToAdd = days * 24 * 60 * 60 * 1000
        let newDate
        if (isFreezeActive.value && typeof freezeEndsAt.value === 'number') {
            newDate = freezeEndsAt.value + msToAdd
        } else {
            newDate = Date.now() + msToAdd
        }
        freezeEndsAt.value = newDate
        const userDocRef = doc(db, 'users', authUser.uid)
        await updateDoc(userDocRef, {
            freezeEndsAt: newDate
        })
    }

    const loginWithApple = async () => {
        try {
            const isNative = Capacitor.isNativePlatform();
            let user;
            if (isNative) {
                const result = await SignInWithApple.authorize({
                    clientId: 'com.skillupgerman',
                    scopes: 'email name',
                });

                if (!result || !result.response || !result.response.identityToken) return;
                const provider = new OAuthProvider('apple.com');
                const credential = provider.credential({
                    idToken: result.response.identityToken,
                });

                const authResult = await signInWithCredential(auth, credential);
                user = authResult.user;
            } else {

                const provider = new OAuthProvider('apple.com');
                provider.addScope('email');
                provider.addScope('name');

                const authResult = await signInWithPopup(auth, provider);
                user = authResult.user;
            }
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            const defaultName = user.displayName || '';
            const defaultEmail = user.email || '';
            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    ownedAvatars: ['1.png', '2.png'],
                    name: defaultName,
                    email: defaultEmail,
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
                    sale_5: false,
                    sale_10: false,
                    sale_15: false,
                    ...createInitialAchievementsObject()
                });
            }
            const finalDoc = await getDoc(userDocRef);
            const userDataFromDb = finalDoc.data() || {};
            setUserData({
                name: defaultName,
                email: defaultEmail,
                registeredAt: user.metadata.creationTime,
                uid: user.uid,
                providerId: user.providerData[0]?.providerId || '',
                ...userDataFromDb
            });
            await checkFeedbackSurveyEligibility();
        } catch (error) {
            if (isUserCancelledAuth(error)) return;
            const errorDetail = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
            alert(`❌ ОШИБКА ВХОДА APPLE:\n\n${errorDetail}`);
        }
    }

    // const loginWithFacebook = async () => {
    //     try {
    //         const isNative = Capacitor.isNativePlatform();
    //         let user;
    //         if (isNative) {
    //             const FACEBOOK_PERMISSIONS = ['email', 'public_profile'];
    //             const result = await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    //             if (!result.accessToken) {
    //                 console.error('не вернул токен');
    //                 return;
    //             }
    //             const credential = FacebookAuthProvider.credential(result.accessToken.token);
    //             const authResult = await signInWithCredential(auth, credential);
    //             user = authResult.user;
    //         } else {
    //             const provider = new FacebookAuthProvider();
    //             const authResult = await signInWithPopup(auth, provider);
    //             user = authResult.user;
    //         }
    //
    //         const userDocRef = doc(db, 'users', user.uid);
    //         const userDoc = await getDoc(userDocRef);
    //
    //         if (!userDoc.exists()) {
    //             await setDoc(userDocRef, {
    //                 ownedAvatars: ['1.png', '2.png'],
    //                 name: user.displayName || 'User Facebook',
    //                 email: user.email,
    //                 registeredAt: serverTimestamp(),
    //                 feedbackSurveyShownAt: null,
    //                 avatar: '1.png',
    //                 subscriptionEndsAt: null,
    //                 subscriptionCancelled: false,
    //                 gotPremiumBonus: false,
    //                 voiceConsentGiven: false,
    //                 hasSeenOnboarding: false,
    //                 isPremium: false,
    //                 totalHats: 0,
    //                 points: 0,
    //                 claimedBonuses: [],
    //                 sale_5: false,
    //                 sale_10: false,
    //                 sale_15: false,
    //                 ...createInitialAchievementsObject()
    //             });
    //         }
    //
    //         const finalDoc = await getDoc(userDocRef);
    //         const userDataFromDb = finalDoc.data() || {};
    //
    //         setUserData({
    //             name: user.displayName,
    //             email: user.email,
    //             registeredAt: user.metadata.creationTime,
    //             uid: user.uid,
    //             providerId: user.providerData[0]?.providerId || 'facebook.com',
    //             ...userDataFromDb
    //         });
    //
    //         await checkFeedbackSurveyEligibility();
    //
    //     } catch (error) {
    //         if (isUserCancelledAuth(error)) return;
    //         console.error('Ошибка входа через Facebook:', error);
    //         alert(`Ошибка Facebook: ${error.message}`);
    //     }
    // }

    const loginWithGoogle = async () => {
        try {
            const isNative = Capacitor.isNativePlatform();
            let idToken = null;
            if (isNative) {
                await GoogleSignIn.initialize({
                    clientId: '516504654997-15ujeh34o8jc7hkbempel0t60qp0e43g.apps.googleusercontent.com',
                });
                const result = await GoogleSignIn.signIn({
                    clientId: '516504654997-15ujeh34o8jc7hkbempel0t60qp0e43g.apps.googleusercontent.com',
                });
                idToken = result.idToken;
            } else {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                idToken = credential.idToken;
            }
            if (!idToken) {
                console.error('Артикль не вернул токен');
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
                    name: user.displayName,
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
                    sale_5: false,
                    sale_10: false,
                    sale_15: false,
                    ...createInitialAchievementsObject()
                });
            }
            const finalDoc = await getDoc(userDocRef);
            const userDataFromDb = finalDoc.data() || {};
            setUserData({
                name: user.displayName,
                email: user.email,
                registeredAt: user.metadata.creationTime,
                uid: user.uid,
                providerId: user.providerData[0]?.providerId || '',
                ...userDataFromDb
            });

            await checkFeedbackSurveyEligibility();
        } catch (error) {
            if (isUserCancelledAuth(error)) return;
            const errorDetail = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
            alert(`❌ ОШИБКА ВХОДА:\n\n${errorDetail}`);
        }
    }

    const registerUser = async (userData) => {
        const authInstance = getAuth()
        const methods = await fetchSignInMethodsForEmail(authInstance, userData.email)
        if (methods.length > 0) {
            throw {code: 'auth/email-already-in-use'}
        }
        const userCredential = await createUserWithEmailAndPassword(
            authInstance,
            userData.email,
            userData.password
        )
        const user = userCredential.user
        await updateProfile(user, {displayName: userData.name})
        await sendEmailVerification(user)
        const userDocRef = doc(db, 'users', user.uid)
        await setDoc(userDocRef, {
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
            sale_5: false,
            sale_10: false,
            sale_15: false,
            ...createInitialAchievementsObject()
        })
        const finalDoc = await getDoc(userDocRef)
        const data = finalDoc.data() || {}

        setUserData({
            name: data.name ?? userData.name,
            email: data.email ?? userData.email,
            registeredAt: user.metadata.creationTime,
            uid: user.uid,
            providerId: user.providerData[0]?.providerId || '',
            ...data,
        })
        await checkFeedbackSurveyEligibility()
    }

    const setHasSeenOnboarding = async (value = true) => {
        const authInstance = getAuth()
        const user = authInstance.currentUser
        hasSeenOnboarding.value = !!value
        if (uid.value) {
            localStorage.setItem(`onboardingPassed_${uid.value}`, value ? 'true' : 'false')
        }
        if (!user) return
        const userDocRef = doc(db, 'users', user.uid)
        try {
            await updateDoc(userDocRef, {
                hasSeenOnboarding: !!value
            })
        } catch (e) {
            console.error('Ошибка при обновлении hasSeenOnboarding:', e)
        }
    }

    const incrementHats = async () => {
        const authUser = getAuth().currentUser
        if (!authUser) return
        totalHats.value++
        const userDocRef = doc(db, 'users', authUser.uid)
        await updateDoc(userDocRef, {
            totalHats: totalHats.value
        })
    }

    const loginUser = async ({email, password}) => {
        const auth = getAuth()
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userDocRef);
        const userDataFromDb = userDoc.exists() ? userDoc.data() : {};
        setUserData({
            name: userCredential.user.displayName,
            email: userCredential.user.email,
            registeredAt: userCredential.user.metadata.creationTime,
            uid: userCredential.user.uid,
            ...userDataFromDb
        })
        await checkFeedbackSurveyEligibility()
    }

    const resetPassword = async (email) => {
        const auth = getAuth()
        await sendPasswordResetEmail(auth, email)
    }

    const setVoiceConsent = async (value = true) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {voiceConsentGiven: !!value});
        voiceConsentGiven.value = !!value;
    };

    const deleteAccount = async (password = null) => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw {code: 'auth/no-current-user'};
        try {
            const usesGoogle = user.providerData.some(p => p.providerId === 'google.com');
            if (usesGoogle) {
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);
            } else {
                if (!user.email) throw {code: 'auth/missing-email'};
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
            if (msg.includes('requires-recent-login')) throw {code: 'auth/requires-recent-login'};
            if (msg.includes('popup-closed')) throw {code: 'auth/popup-closed-by-user'};
            throw {code: 'auth/unknown'};
        }
    };

    const purchaseAvatar = async (fileName) => {
        notEnoughArticle.value = false
        if (ownedAvatars.value.includes(fileName)) return 'owned'
        if (langStore.points < 50) {
            notEnoughArticle.value = true
            return 'insufficient'
        }
        langStore.points -= 50
        langStore.articlesSpentForAchievement += 50
        await langStore.saveToFirebase()
        ownedAvatars.value.push(fileName)
        const userDocRef = doc(db, 'users', uid.value)
        await updateDoc(userDocRef, {ownedAvatars: ownedAvatars.value})
        return 'success'
    }

    const clearNotEnoughArticle = () => {
        notEnoughArticle.value = false
    }

    const logOut = async () => {
        const auth = getAuth()
        await signOut(auth)
        setUserData({});
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cached_premium');
        }
        if (Capacitor.isNativePlatform()) {
            try {
                await Purchases.logOut();
            } catch (e) {
                console.error("RC Logout Error:", e);
            }
        }
        if (authStateUnsubscribe) {
            authStateUnsubscribe();
            authStateUnsubscribe = null;
        }
    }

    const fetchuser = () => {
        const auth = getAuth()
        if (authStateUnsubscribe) {
            authStateUnsubscribe();
        }
        authStateUnsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userDataFromDb = userDoc.data();
                    setUserData({
                        name: userDataFromDb.name,
                        email: user.email,
                        registeredAt: user.metadata.creationTime,
                        uid: user.uid,
                        providerId: user.providerData[0]?.providerId || '',
                        ...userDataFromDb
                    })
                }
                if (Capacitor.isNativePlatform()) {
                    try {
                        await Purchases.logIn({ appUserID: user.uid })
                    } catch (e) {
                        console.error(e)
                    }
                }
                await checkFeedbackSurveyEligibility()
            } else {
                setUserData({});
                if (Capacitor.isNativePlatform()) {
                    await Purchases.logOut()
                }
            }
            initialized.value = true
        })
    }


    const initAuth = () => {
        if (initialized.value) return Promise.resolve()
        if (initPromise) return initPromise
        initPromise = new Promise((resolve) => {
            if (typeof window === 'undefined') {
                initialized.value = true
                resolve()
                return
            }
            const auth = getAuth()
            if (authStateUnsubscribe) authStateUnsubscribe()
            authStateUnsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    const userDataFromDb = userDoc.exists() ? userDoc.data() : {};
                    setUserData({
                        name: userDataFromDb.name ?? user.displayName,
                        email: user.email,
                        registeredAt: user.metadata.creationTime,
                        uid: user.uid,
                        providerId: user.providerData[0]?.providerId || '',
                        ...userDataFromDb
                    })

                    if (Capacitor.isNativePlatform()) {
                        try {
                            await Purchases.logIn({ appUserID: user.uid })
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    await checkFeedbackSurveyEligibility()
                } else {
                    setUserData({});
                }
                initialized.value = true
                resolve()
            })
        })
        return initPromise
    }

    const refreshUser = async () => {
        const auth = getAuth()
        const user = auth.currentUser
        if (!user) return
        const userDocRef = doc(db, 'users', user.uid)
        try {
            const snap = await getDoc(userDocRef)
            if (snap.exists()) {
                const data = snap.data()
                setUserData({
                    name: data.name,
                    email: user.email,
                    registeredAt: user.metadata.creationTime,
                    uid: user.uid,
                    providerId: user.providerData[0]?.providerId || '',
                    ...data
                })
            }
        } catch (e) {
        }
    }

    const activatePremium = (premiumData) => {
        isPremium.value = true
        subscriptionEndsAt.value = premiumData.subscriptionEndsAt
        subscriptionCancelled.value = false
    }

    const markCancelledInDb = () => {
        if (!isPremium.value) return
        subscriptionCancelled.value = true
    }

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
        activateDiscount,
        markCancelledInDb,
        modifyHats,
        freezeEndsAt,
        isFreezeActive,
        activateFreeze,
        cancelFreeze,
        loginWithApple,
        claimedBonuses,
        addClaimedBonus
    }
})