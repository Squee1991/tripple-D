import {defineStore} from 'pinia'
import {ref} from 'vue'
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    getFirestore,
    deleteDoc,
    doc,
    updateDoc,
    getDoc,
    setDoc,
    writeBatch,
} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {userAuthStore} from './authStore.js'

export const useCardsStore = defineStore('cardsStore', () => {
    const cards = ref([])
    const createdCount = ref(0)

    const db = getFirestore()
    const authStore = userAuthStore()

    const getUserId = () => {
        const user = getAuth().currentUser
        return user ? user.uid : null
    }

    const normalizeCard = (c) => ({
        ...c,
        type: c.type || 'articles',
    })

    // ===== Stats =====
    const cardStatsDocRef = (uid) => doc(db, 'users', uid, 'cardStats', 'summary')

    const loadCreatedCount = async () => {
        const uid = getUserId()
        if (!uid) return

        const statSnap = await getDoc(cardStatsDocRef(uid))
        if (statSnap.exists()) {
            createdCount.value = statSnap.data().createdCount || 0
        } else {
            createdCount.value = 0
        }
    }

    const saveCreatedCount = async () => {
        const uid = getUserId()
        if (!uid) return

        await setDoc(
            cardStatsDocRef(uid),
            {
                createdCount: createdCount.value,
                name: authStore.name || '',
                updatedAt: new Date().toISOString(),
            },
            {merge: true}
        )
    }

        const loadPublicCards = async () => {
        const q = query(collection(db, 'cards'), where('isPublic', '==', true))
        const snapshot = await getDocs(q)
        cards.value = snapshot.docs.map((d) => normalizeCard({id: d.id, ...d.data()}))
        await loadCreatedCount()
    }

    const subscribePublicCards = () => {
        const q = query(collection(db, 'cards'), where('isPublic', '==', true))
        return onSnapshot(q, (snapshot) => {
            cards.value = snapshot.docs.map((d) => normalizeCard({id: d.id, ...d.data()}))
        })
    }

    const addCard = async (card) => {
        const uid = getUserId()
        if (!uid) return

        await addDoc(collection(db, 'cards'), {
            ...card,
            type: card?.type || 'articles',
            isPublic: true,
            createdAt: new Date().toISOString(),
            ownerId: uid,
        })

        createdCount.value++
        await saveCreatedCount()
    }

    const updateCard = async (cardData) => {
        if (!cardData?.id) {
            console.error('Ошибка обновления: отсутствует ID карточки')
            return
        }

        const cardRef = doc(db, 'cards', cardData.id)
        const {id, ...dataToUpdate} = cardData

        // подстраховка: не даём потерять type
        if (!dataToUpdate.type) dataToUpdate.type = 'articles'

        await updateDoc(cardRef, dataToUpdate)
    }

    const removeCard = async (cardId) => {
        try {
            await deleteDoc(doc(db, 'cards', cardId))
            cards.value = cards.value.filter((card) => card.id !== cardId)
        } catch (error) {
            console.error('Ошибка при удалении карточки:', error)
        }
    }

    // ===== Migrations =====

    // Перенос старой статистики (как у тебя было)
    const migrateCardStats = async () => {
        const uid = getUserId()
        if (!uid) return

        const oldRef = doc(db, 'cardStats', uid)
        const oldSnap = await getDoc(oldRef)
        if (oldSnap.exists()) {
            const data = oldSnap.data()
            await setDoc(cardStatsDocRef(uid), {...data}, {merge: true})
        }
    }

    // (Опционально) Проставить type='articles' всем старым карточкам без type
    const migrateCardTypes = async () => {
        const q = query(collection(db, 'cards'), where('isPublic', '==', true))
        const snapshot = await getDocs(q)

        const batch = writeBatch(db)
        let changed = 0

        snapshot.forEach((d) => {
            const data = d.data()
            if (!data.type) {
                batch.update(doc(db, 'cards', d.id), {type: 'articles'})
                changed++
            }
        })

        if (changed > 0) await batch.commit()
        console.log(`migrateCardTypes: updated ${changed} cards`)
    }

    return {
        cards,
        createdCount,
        loadPublicCards,
        subscribePublicCards,
        addCard,
        updateCard,
        removeCard,
        loadCreatedCount,
        saveCreatedCount,
        migrateCardStats,
        migrateCardTypes,
    }
})