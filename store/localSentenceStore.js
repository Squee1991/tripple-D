// store/localStatGameStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment
} from 'firebase/firestore'
import { userAuthStore } from './authStore.js'

export const useLocalStatGameStore = defineStore('localStatGame', () => {
    const constructedSentences = ref(0)
    const db = getFirestore()
    const loadLocalStats = async () => {
        const auth = userAuthStore()
        const uid = auth.uid
        if (!uid) return
        const docRef = doc(db, 'users', uid, 'localStatGame', 'data')
        const snap = await getDoc(docRef)
        if (snap.exists()) {
            constructedSentences.value = snap.data()?.constructedSentences || 0
        } else {
            await setDoc(docRef, {
                constructedSentences: 0
            })
            constructedSentences.value = 0
        }
    }

    const incrementConstructedSentences = async () => {
        const auth = userAuthStore()
        const uid = auth.uid
        if (!uid) return

        constructedSentences.value++
        const docRef = doc(db, 'users', uid, 'localStatGame', 'data')
        await updateDoc(docRef, {
            constructedSentences: increment(1)
        })
    }

    return {
        constructedSentences,
        loadLocalStats,
        incrementConstructedSentences
    }
})
