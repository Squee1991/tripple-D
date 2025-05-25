<template>
	<div class="find-opponent">
		<button @click="findOpponent" :disabled="loading">
			{{ loading ? 'Поиск...' : 'Поиск противника' }}
		</button>
		<p v-if="message">{{ message }}</p>
	</div>
</template>

<script setup>
	import { ref, onUnmounted } from 'vue'
	import { useRouter } from 'vue-router'
	import {getFirestore, collection, query, where, orderBy, limit,
		getDocs, doc, updateDoc, addDoc, onSnapshot, serverTimestamp, runTransaction
	} from 'firebase/firestore'
	import { getAuth } from 'firebase/auth'

	const db = getFirestore()
	const auth = getAuth()
	const router = useRouter()

	const loading = ref(false)
	const message = ref('')
	let unsubscribe = null

	const findOpponent = async () => {
		loading.value = true
		message.value = ''
		const uid = auth.currentUser?.uid
		if (!uid) {
			message.value = 'Вы не авторизованы'
			loading.value = false
			return
		}

		const q = query(
			collection(db, 'sessions'),
			where('guestId', '==', null),
			where('status', '==', 'waiting'),
			orderBy('createdAt'),
			limit(1)
		)

		const snapshot = await getDocs(q)

		if (!snapshot.empty) {
			// Присоединение к сессии с защитой от коллизий
			const session = snapshot.docs[0]
			const sessionRef = doc(db, 'sessions', session.id)

			try {
				await runTransaction(db, async (transaction) => {
					const docSnap = await transaction.get(sessionRef)
					const data = docSnap.data()
					if (!data || data.guestId || data.status !== 'waiting') {
						throw 'Сессию уже заняли'
					}

					transaction.update(sessionRef, {
						guestId: uid,
						status: 'pending'
					})
				})

				message.value = 'Ожидание подтверждения...'
				listenToSession(sessionRef.id)
			} catch (error) {
				console.warn(error)
				message.value = 'Сессию уже заняли, пробуем снова...'
				loading.value = false
				await findOpponent()
				return
			}

		} else {
			// Создание новой сессии
			const newSessionRef = await addDoc(collection(db, 'sessions'), {
				hostId: uid,
				guestId: null,
				status: 'waiting',
				createdAt: serverTimestamp()
			})

			message.value = 'Ожидание противника...'
			listenToSession(newSessionRef.id)
		}

		loading.value = false
	}

	const listenToSession = (sessionId) => {
		const sessionRef = doc(db, 'sessions', sessionId)

		unsubscribe = onSnapshot(sessionRef, (docSnap) => {
			const data = docSnap.data()
			if (!data) return
			if (data.status === 'pending' && data.hostId === auth.currentUser?.uid) {
				updateDoc(sessionRef, { status: 'active' })
			}

			if (data.status === 'active') {
				router.push(`/battle?id=${sessionId}`)
			}
		})
	}

	onUnmounted(() => {
		if (unsubscribe) unsubscribe()
	})

</script>

<style scoped>
	.find-opponent {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	button {
		padding: 12px 24px;
		font-size: 18px;
		background: #6633cc;
		color: white;
		border-radius: 10px;
		cursor: pointer;
	}
</style>
