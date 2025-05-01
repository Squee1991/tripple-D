import {defineStore} from "pinia";
import {ref} from 'vue'
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
	signOut,
	deleteUser,
	onAuthStateChanged,
	sendPasswordResetEmail
} from 'firebase/auth';
import {doc, setDoc, getDoc, getFirestore} from 'firebase/firestore';

export const userAuthStore = defineStore('auth', () => {
	const name = ref(null)
	const email = ref(null)
	const password = ref(null)
	const registeredAt = ref(null)

	const setUserData = (data) => {
		name.value = data.name || null
		email.value = data.email || null
		password.value = data.password || null
		registeredAt.value = data.registeredAt || null
	}

	const registerUser = async (userData) => {
		const auth = getAuth()
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			userData.email,
			userData.password
		)

		await updateProfile(userCredential.user, {
			displayName: userData.name
		})

		const now = new Date().toLocaleDateString()

		setUserData({
			name: userData.name,
			email: userData.email,
			password: userData.password,
			registeredAt: now
		})
	}


	const loginUser = async ({email, password}) => {
		const auth = getAuth()
		const userCredential = await signInWithEmailAndPassword(auth, email, password)
		setUserData({
			name: userCredential.user.displayName,
			email: userCredential.user.email,
			password
		})
	}

	const resetPassword = async (email) => {
		const auth = getAuth()
		await sendPasswordResetEmail(auth, email)
	}

	const deleteAccount = async () => {
		const auth = getAuth()
		const user = auth.currentUser
		if (!user) return
		await deleteUser(user)
		name.value = null;
		email.value = null;
		password.value = null;
	}

	const logOut = async () => {
		const auth = getAuth()
		await signOut(auth)
		name.value = null;
		email.value = null;
		password.value = null;
	}

	const fetchuser = () => {
		const auth = getAuth()
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUserData({
					name: user.displayName,
					email: user.email,
				})
			} else {
				name.value = null
				email.value = null
				password.value = null
				registeredAt.value = null
			}
		})
	}

	fetchuser()

	return {
		name,
		email,
		password,
		registeredAt,
		registerUser,
		logOut,
		loginUser,
		resetPassword,
		deleteAccount
	}
})