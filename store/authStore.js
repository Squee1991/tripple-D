import {defineStore} from "pinia";
import {ref, computed} from 'vue'
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	EmailAuthProvider, reauthenticateWithCredential,
	updateProfile,
	signOut,
	deleteUser,
	onAuthStateChanged,
	sendPasswordResetEmail,
	sendEmailVerification,
	signInWithPopup,
	reauthenticateWithPopup, GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc, getFirestore, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import {userlangStore} from "./learningStore.js";
let authStateUnsubscribe = null;

export const userAuthStore = defineStore('auth', () => {

	const LEADERBOARD_COLLECTION = 'marathon_leaderboard';
	const LEADERBOARD_GUESS = 'leaderboard_guess'
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
	const isPremium = ref(false)
	const achievements = ref(null);

	const initialized = ref(false)
	let initPromise = null

	const isGoogleUser = computed(() => providerId.value === 'google.com');
	const getAvatarUrl = (fileName) => {
		if (!fileName) return '';
		return `/images/avatars/${fileName}`;
	}

	const normalizeDate = (v) => {
		if (!v) return null;
		if (typeof v?.toDate === 'function') return v.toDate().toISOString();
		const d = new Date(v);
		return isNaN(d.getTime()) ? null : d.toISOString();
	};

	const avatarUrl = computed(() => {
		return avatar.value ? `/images/avatars/${avatar.value}` : '';
	});

	const createInitialAchievementsObject = () => {
		return {
			achievements: {
				A1: {wins: 0, streaks: 0, cleanSweeps: 0, flawlessWins: 0},
				A2: {wins: 0, streaks: 0, cleanSweeps: 0, flawlessWins: 0},
				B1: {wins: 0, streaks: 0, cleanSweeps: 0, flawlessWins: 0},
				B2: {wins: 0, streaks: 0, cleanSweeps: 0, flawlessWins: 0}
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
		const langStore = userlangStore();
		langStore.points += 50;
		langStore.totalEarnedPoints += 50;
		langStore.gotPremiumBonus = true;
		await langStore.saveToFirebase();
		await updateDoc(userDocRef, { gotPremiumBonus: true });
	};

	const setUserData = (data) => {
		name.value = data.name || null
		email.value = data.email || null
		registeredAt.value = normalizeDate(data.registeredAt)
		uid.value = data.uid || null
		avatar.value = data.avatar || null
		isPremium.value = data.isPremium || false
		subscriptionEndsAt.value = data.subscriptionEndsAt || null
		subscriptionCancelled.value = data.subscriptionCancelled || false
		providerId.value = data.providerId || ''
		ownedAvatars.value = data.ownedAvatars || ['1.png', '2.png'];
		achievements.value = data.achievements || null;
		const newAchievements = data.achievements || null;
		if (newAchievements) {
			if (typeof achievements.value !== 'object' || achievements.value === null) {
				achievements.value = {};
			}
			Object.keys(achievements.value).forEach(key => delete achievements.value[key]);
			Object.assign(achievements.value, newAchievements);
		} else {
			achievements.value = null;
		}

		if (data.isPremium && !data.gotPremiumBonus) {
			grantPremiumBonusPoints()
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

	const loginWithGoogle = async () => {
		const auth = getAuth();
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		const user = result.user;
		const userDocRef = doc(db, 'users', user.uid);
		const userDoc = await getDoc(userDocRef);
		if (!userDoc.exists()) {
			await setDoc(userDocRef, {
				ownedAvatars: ['1.png', '2.png'],
				name: user.displayName,
				email: user.email,
				registeredAt: serverTimestamp(),
				avatar: '1.png',
				gotPremiumBonus: false,
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
	};

	const registerUser = async (userData) => {
		const auth = getAuth();
		const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
		const user = userCredential.user;
		await updateProfile(user, { displayName: userData.name });
		await sendEmailVerification(user);
		const defaultAvatar = '1.png';
		const initialOwnedAvatars = ['1.png', '2.png'];
		await setDoc(doc(db, 'users', user.uid), {
			name: userData.name,
			email: userData.email,
			registeredAt: serverTimestamp(),
			avatar: defaultAvatar,
			ownedAvatars: initialOwnedAvatars,
			isPremium: false,
			subscriptionEndsAt: null,
			gotPremiumBonus: false,
			...createInitialAchievementsObject()
		});
		setUserData({
			uid: user.uid,
			name: userData.name,
			email: userData.email,
			registeredAt: user.metadata.creationTime,
			avatar: defaultAvatar,
			ownedAvatars: initialOwnedAvatars,
			isPremium: false,
			subscriptionEndsAt: null,
			gotPremiumBonus: false,
		});
	};

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
	}

	const resetPassword = async (email) => {
		const auth = getAuth()
		await sendPasswordResetEmail(auth, email)
	}

	const deleteAccount = async (password = null) => {
		const auth = getAuth();
		const user = auth.currentUser;
		if (!user) throw { code: 'auth/no-current-user' };
		try {
			const usesGoogle = user.providerData.some(p => p.providerId === 'google.com');
			if (usesGoogle) {
				const provider = new GoogleAuthProvider();
				await reauthenticateWithPopup(user, provider);
			} else {
				if (!user.email) throw { code: 'auth/missing-email' };
				if (!password) throw { code: 'auth/missing-password' };
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

	const purchaseAvatar = async (fileName) => {
		const langStore = userlangStore()
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
		await updateDoc(userDocRef, { ownedAvatars: ownedAvatars.value })
		return 'success'
	}

	const clearNotEnoughArticle = () => {
		notEnoughArticle.value = false
	}

	const logOut = async () => {
		const auth = getAuth()
		await signOut(auth)
		setUserData({});
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
			} else {
				setUserData({});
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
				} else {
					setUserData({});
				}
				initialized.value = true
				resolve()
			})
		})
		return initPromise
	}

	return {
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
		clearNotEnoughArticle,
		achievements,
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
	}
})
