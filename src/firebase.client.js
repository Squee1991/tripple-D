import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, updateDoc, deleteField, deleteDoc } from 'firebase/firestore';
import { useFirebase } from 'vuefire'

// Используем уже инициализированное приложение из nuxt-vuefire
const { $firebase } = useFirebase()
const auth = getAuth($firebase);
const db = getFirestore($firebase);

setPersistence(auth, browserLocalPersistence);

export { auth, db, deleteField, deleteDoc, updateDoc, createUserWithEmailAndPassword, signInWithEmailAndPassword };
