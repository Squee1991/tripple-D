import { useFirebaseApp, useFirebaseAuth, useFirestore } from 'vuefire'
import {
	browserLocalPersistence,
	setPersistence,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword
} from 'firebase/auth'
import { updateDoc, deleteField, deleteDoc } from 'firebase/firestore'

const app = useFirebaseApp()
const auth = useFirebaseAuth()
const db = useFirestore()
setPersistence(auth, browserLocalPersistence)

console.log('🔥 Using Firebase project:', app.options.projectId)

export {
	auth,
	db,
	updateDoc,
	deleteField,
	deleteDoc,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword
}
