// plugins/firebase.client.js
import { initializeApp } from 'firebase/app'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth'
import {
    getFirestore,
    updateDoc,
    deleteField,
    deleteDoc
} from 'firebase/firestore'

import { firebaseConfig } from '../config/firebaseConfig.js'

export default defineNuxtPlugin(() => {
    // инициализация Firebase
    const app = initializeApp(firebaseConfig)

    const auth = getAuth(app)
    const db = getFirestore(app)

    setPersistence(auth, browserLocalPersistence)

    // пробрасываем в nuxtApp.$firebase
    return {
        provide: {
            firebase: {
                auth,
                db,
                deleteField,
                deleteDoc,
                updateDoc,
                createUserWithEmailAndPassword,
                signInWithEmailAndPassword
            }
        }
    }
})
