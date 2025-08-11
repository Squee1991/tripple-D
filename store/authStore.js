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
import { userlangStore } from "./learningStore.js";
let authStateUnsubscribe = null;
export const userAuthStore = defineStore('auth', () => {
	const name = ref(null)
	const email = ref(null)
	const registeredAt = ref(null)
	const db = getFirestore();
	const providerId = ref('')
	const avatar = ref(null)
	const uid = ref(null)
	const subscriptionEndsAt = ref(null)
	const subscriptionCancelled = ref(false)
	const availableAvatars = ref([ '1.png', '2.png', '3.png', '4.png', '5.png', '6.png',  '12.png', '7.png', '8.png' , '9.png' , '10.png' , '11.png' , '13.png', '14.png']);
	const ownedAvatars = ref(['1.png', '2.png']);
	const isPremium = ref(false)
	const isGoogleUser = computed(() => providerId.value === 'google.com');
	const getAvatarUrl = (fileName) => {
		if (!fileName) return '';
		try {
			return new URL(`../assets/images/avatars/${fileName}`, import.meta.url).href;
		} catch (e) {
			console.error(`Ошибка URL для аватара: ${fileName}`, e); return '';
		}
	};

	const avatarUrl = computed(() => getAvatarUrl(avatar.value));
	const createInitialAchievementsObject = () => {
		return {
			achievements: {
				A1: { wins: 0, streaks: 0, cleanSweeps: 0, flawlessWins: 0 },
				A2: { wins: 0, streaks: 0, cleanSweeps: 0, flawlessWins: 0 },
				B1: { wins: 0, streaks: 0, cleanSweeps: 0, flawlessWins: 0 },
				B2: { wins: 0, streaks: 0, cleanSweeps: 0, flawlessWins: 0 }
			}
		};
	};

	const grantPremiumBonusPoints = async () => {
		const langStore = userlangStore()
		if (langStore.gotPremiumBonus) return
		langStore.points += 50
		langStore.totalEarnedPoints += 50
		langStore.gotPremiumBonus = true /
		await langStore.saveToFirebase()
	}

	const setUserData = (data) => {
		const wasPremium = isPremium.value
		name.value = data.name || null
		email.value = data.email || null
		registeredAt.value = data.registeredAt || null
		uid.value = data.uid || null
		avatar.value = data.avatar || null
		isPremium.value = data.isPremium || false
		subscriptionEndsAt.value = data.subscriptionEndsAt || null
		subscriptionCancelled.value = data.subscriptionCancelled || false
		providerId.value = data.providerId || '',
		ownedAvatars.value = data.ownedAvatars || ['1.png', '2.png'];
		if(!wasPremium && isPremium.value) {
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
			avatar: userDataFromDb.avatar || '1.png',
			isPremium: userDataFromDb.isPremium || false,
			subscriptionEndsAt: userDataFromDb.subscriptionEndsAt || null,
			subscriptionCancelled: userDataFromDb.subscriptionCancelled || false,
			providerId: user.providerData[0]?.providerId || '',
			ownedAvatars: userDataFromDb.ownedAvatars || ['1.png', '2.png']
		});
	};

	const registerUser = async (userData) => {
		const auth = getAuth()
		const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
		const user = userCredential.user;
		await updateProfile(user, { displayName: userData.name })
		await sendEmailVerification(user)
		const defaultAvatar = '1.png';
		await setDoc(doc(db, 'users', user.uid), {
			ownedAvatars: ['1.png', '2.png'],
			name: userData.name,
			email: userData.email,
			registeredAt: serverTimestamp(),
			avatar: defaultAvatar,
			isPremium: false,
			subscriptionEndsAt: null,
			...createInitialAchievementsObject()
		})

		setUserData({
			name: userData.name,
			email: userData.email,
			registeredAt: user.metadata.creationTime,
			uid: user.uid,
			avatar: defaultAvatar,
			isPremium: false
		})
	}


	const loginUser = async ({ email, password }) => {
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
			avatar: userDataFromDb.avatar || null,
			isPremium: userDataFromDb.isPremium || false,
			subscriptionEndsAt: userDataFromDb.subscriptionEndsAt || null,
			subscriptionCancelled: userDataFromDb.subscriptionCancelled || false,
			providerId: userCredential.user.providerData[0]?.providerId || '',
			ownedAvatars: userDataFromDb.ownedAvatars || ['1.png', '2.png']
		})
	}

	const resetPassword = async (email) => {
		const auth = getAuth()
		await sendPasswordResetEmail(auth, email)
	}

	const deleteAccount = async (password = null) => {
		const auth = getAuth();
		const user = auth.currentUser;
		if (!user) throw new Error('Пользователь не найден');

		try {
			if (user.providerData.some(p => p.providerId === 'google.com')) {
				const provider = new GoogleAuthProvider();
				await reauthenticateWithPopup(user, provider);
			} else {
				if (!password || !user.email) throw new Error('Не указан пароль или email');
				const credential = EmailAuthProvider.credential(user.email, password);
				await reauthenticateWithCredential(user, credential);
			}

			await deleteDoc(doc(db, 'users', user.uid));
			await deleteUser(user);
			setUserData({});
		} catch (err) {
			console.error('Ошибка удаления:', err);
			throw err;
		}
	};

	const purchaseAvatar = async (fileName) => {
		const langStore = userlangStore();
		if (ownedAvatars.value.includes(fileName)) return;

		if (langStore.points < 50) {
			throw new Error('Недостаточно Артиклюсов!');
		}

		// Списываем очки
		langStore.points -= 50;
		langStore.articlesSpentForAchievement += 50;
		await langStore.saveToFirebase();

		// Добавляем в купленные
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
						avatar: userDataFromDb.avatar || null,
						isPremium: userDataFromDb.isPremium || false,
						subscriptionEndsAt: userDataFromDb.subscriptionEndsAt || null,
						subscriptionCancelled: userDataFromDb.subscriptionCancelled || false,
						providerId: user.providerData[0]?.providerId || '',
						ownedAvatars: userDataFromDb.ownedAvatars || ['1.png', '2.png']
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