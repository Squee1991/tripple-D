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
import {doc, setDoc, getDoc, getFirestore, updateDoc, deleteDoc, serverTimestamp} from 'firebase/firestore';
import {userlangStore} from "./learningStore.js";

let authStateUnsubscribe = null;
export const userAuthStore = defineStore('auth', () => {
	const name = ref(null)
	const email = ref(null)
	const registeredAt = ref(null)
	const db = getFirestore();
	const providerId = ref('')
	const avatar = ref(null)
	const uid = ref(null)
	const gotPremiumBonus = ref(false)
	const subscriptionEndsAt = ref(null)
	const subscriptionCancelled = ref(false)
	const availableAvatars = ref(['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '12.png', '7.png', '8.png', '9.png', '10.png', '11.png', '13.png', '14.png']);
	const ownedAvatars = ref(['1.png', '2.png']);
	const isPremium = ref(false)
	const isGoogleUser = computed(() => providerId.value === 'google.com');
	const getAvatarUrl = (fileName) => {
		if (!fileName) return '';
		try {
			return new URL(`../assets/images/avatars/${fileName}`, import.meta.url).href;
		} catch (e) {
			console.error(`Ошибка URL для аватара: ${fileName}`, e);
			return '';
		}
	};

	const normalizeDate = (v) => {
		if (!v) return null;
		if (typeof v?.toDate === 'function') return v.toDate().toISOString();
		const d = new Date(v);
		return isNaN(d.getTime()) ? null : d.toISOString();
	};

	const avatarUrl = computed(() => getAvatarUrl(avatar.value));
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

			await deleteDoc(doc(db, 'users', user.uid));
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
		const langStore = userlangStore();
		if (ownedAvatars.value.includes(fileName)) return;
		if (langStore.points < 50) {
			throw new Error('Недостаточно Артиклюсов!');
		}
		langStore.points -= 50;
		langStore.articlesSpentForAchievement += 50;
		await langStore.saveToFirebase();
		ownedAvatars.value.push(fileName);
		const userDocRef = doc(db, 'users', uid.value);
		await updateDoc(userDocRef, {
			ownedAvatars: ownedAvatars.value
		});
	};


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
		})
	}

	fetchuser()

	return {
		name,
		email,
		registeredAt,
		providerId,
		uid,
		isGoogleUser,
		avatar,
		avatarUrl,
		availableAvatars,
		isPremium,
		subscriptionEndsAt,
		subscriptionCancelled,
		ownedAvatars,
		purchaseAvatar,
		registerUser,
		logOut,
		loginUser,
		resetPassword,
		deleteAccount,
		loginWithGoogle,
		updateUserAvatar,
		getAvatarUrl,
		fetchuser
	}
})