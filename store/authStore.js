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
	GoogleAuthProvider
} from 'firebase/auth';
import {doc, setDoc, getDoc, getFirestore, updateDoc, deleteDoc, serverTimestamp} from 'firebase/firestore';
let authStateUnsubscribe = null;
export const userAuthStore = defineStore('auth', () => {
	const name = ref(null)
	const email = ref(null)
	const registeredAt = ref(null)
	const db = getFirestore();
	const avatar = ref(null)
	const uid = ref(null)
	const subscriptionEndsAt = ref(null)
	const subscriptionCancelled = ref(false)
	const availableAvatars = ref([ '1.png', '2.png', '3.png', '4.png', '5.png', '6.png',  '12.png', '7.png', '8.png' , '9.png' , '10.png' , '11.png' , '13.png', '14.png']);
	const isPremium = ref(false)
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

	const setUserData = (data) => {
		name.value = data.name || null
		email.value = data.email || null
		registeredAt.value = data.registeredAt || null
		uid.value = data.uid || null
		avatar.value = data.avatar || null
		isPremium.value = data.isPremium || false
		subscriptionEndsAt.value = data.subscriptionEndsAt || null
		subscriptionCancelled.value = data.subscriptionCancelled || false
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
			subscriptionCancelled: userDataFromDb.subscriptionCancelled || false
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
			subscriptionCancelled: userDataFromDb.subscriptionCancelled || false
		})
	}

	const resetPassword = async (email) => {
		const auth = getAuth()
		await sendPasswordResetEmail(auth, email)
	}

	const deleteAccount = async (currentPassword) => {
		const auth = getAuth();
		const user = auth.currentUser;
		if (!user) return;
		const credential = EmailAuthProvider.credential(
			user.email,
			currentPassword
		);
		await reauthenticateWithCredential(user, credential);
		await deleteDoc(doc(db, 'users', user.uid));
		await deleteUser(user);
		setUserData({});
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
						subscriptionCancelled: userDataFromDb.subscriptionCancelled || false
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
		uid,
		avatar,
		avatarUrl,
		availableAvatars,
		isPremium,
		subscriptionEndsAt,
		subscriptionCancelled,
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