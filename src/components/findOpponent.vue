<template>
	<div class="match-wrapper">
		<div class="match-header">ПОЕДИНОК АРТИКЛЕЙ</div>
		<div class="match-layout">
			<!-- Левая колонка: игроки -->
			<div class="panel left-panel">
				<div class="panel-title">Данные игрока</div>
				<div class="player-slot">Кол-во побед</div>
				<div class="player-slot">Кол-во поражений</div>
				<div class="player-slot">Всего сыграно</div>
				<div class="player-slot">Кол-во очков</div>
				<button v-if="sessionId" @click="leaveSession" class="leave-button">Покинуть</button>
				<div class="chat-info">Добро пожаловать в артикль-чат!</div>
			</div>

			<!-- Центр: поиск / ожидание -->
			<div class="panel center-panel">
				<div class="panel-title">Темы</div>

			</div>

			<!-- Правая панель: игроки -->
			<div class="panel right-panel">
				<div class="panel-title">Поиск соперника</div>
				<div class="center-content">
					<!-- Кнопка только если не идёт поиск (нет sessionId и не loading) -->
					<button
						v-if="!sessionId && !loading"
						class="find-button"
						@click="findOpponent"
					>
						Найти противника
					</button>

					<!-- Поиск соперника с анимацией, если loading или статус waiting -->
					<div
						v-else-if="loading || (sessionData && sessionData.status === 'waiting')"
						class="status-message"
					>
						<div class="search-spinner"></div>
						<span>Идёт поиск соперника...</span>
					</div>

					<!-- Оба игрока подключены -->
					<div v-else-if="bothPlayersConnected" class="status-message">
						Противник найден!
						<button
							class="find-button"
							:class="{ ready: isReady }"
							:disabled="isReady"
							@click="markReady"
						>
							{{ isReady
							? (opponentReady ? 'Ждём начала боя...' : 'Ожидание второго игрока...')
							: 'Начать бой'
							}}
						</button>
					</div>

					<!-- Сообщения об ошибках -->
					<div v-if="message" class="status-message">{{ message }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onUnmounted, computed } from 'vue'
	import { useRouter } from 'vue-router'
	import {
		getFirestore, collection, query, where, orderBy, limit,
		getDocs, doc, updateDoc, addDoc, onSnapshot, serverTimestamp, deleteDoc, runTransaction
	} from 'firebase/firestore'
	import { getAuth } from 'firebase/auth'

	const db = getFirestore()
	const auth = getAuth()
	const router = useRouter()

	const loading = ref(false)
	const message = ref('')
	const sessionId = ref(null)
	const sessionData = ref(null)
	const unsubscribe = ref(null)
	const uid = computed(() => auth.currentUser?.uid)

	// 1. Найти или создать сессию
	const findOpponent = async () => {
		loading.value = true
		message.value = ''
		if (!uid.value) {
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
						guestId: uid.value,
						status: 'pending'
					})
				})
				sessionId.value = session.id
				listenToSession(session.id)
				message.value = ''
			} catch (error) {
				message.value = 'Сессию уже заняли, пробуем снова...'
				loading.value = false
				await findOpponent()
				return
			}
		} else {
			const newSessionRef = await addDoc(collection(db, 'sessions'), {
				hostId: uid.value,
				guestId: null,
				status: 'waiting',
				readyHost: false,
				readyGuest: false,
				createdAt: serverTimestamp()
			})
			sessionId.value = newSessionRef.id
			listenToSession(newSessionRef.id)
			message.value = ''
		}
		loading.value = false
	}

	// 2. Покинуть сессию
	const leaveSession = async () => {
		if (sessionId.value) {
			await deleteDoc(doc(db, 'sessions', sessionId.value))
			sessionId.value = null
			sessionData.value = null
			message.value = 'Вы покинули сессию'
		}
	}

	// 3. Готовность к бою
	const markReady = async () => {
		if (!uid.value || !sessionId.value || !sessionData.value) return
		const sessionRef = doc(db, 'sessions', sessionId.value)
		if (sessionData.value.hostId === uid.value) {
			await updateDoc(sessionRef, { readyHost: true })
		} else {
			await updateDoc(sessionRef, { readyGuest: true })
		}
	}

	// 4. Подписка на изменения в сессии
	const listenToSession = (id) => {
		const sessionRef = doc(db, 'sessions', id)
		if (unsubscribe.value) unsubscribe.value()
		unsubscribe.value = onSnapshot(sessionRef, (docSnap) => {
			const data = docSnap.data()
			sessionData.value = data
			// Переход в бой если оба готовы
			if (data && data.status === 'active') {
				router.push(`/battle?id=${id}`)
			}
			// Если сессия исчезла (кто-то покинул до боя)
			if (!data) {
				sessionId.value = null
				sessionData.value = null
				message.value = 'Сессия завершена'
			}
		})
	}

	// 5. Автоматический старт боя если оба готовы
	watch(
		() => sessionData.value && sessionData.value.readyHost && sessionData.value.readyGuest && sessionData.value.status === 'pending',
		(isBothReady) => {
			if (isBothReady && sessionId.value) {
				const sessionRef = doc(db, 'sessions', sessionId.value)
				updateDoc(sessionRef, { status: 'active' })
			}
		}
	)

	onUnmounted(() => {
		if (unsubscribe.value) unsubscribe.value()
	})

	// ---- COMPUTED ----
	// Оба игрока подключены (оба нажали "Найти противника")
	const bothPlayersConnected = computed(() =>
		sessionData.value
		&& sessionData.value.status === 'pending'
		&& sessionData.value.hostId
		&& sessionData.value.guestId
	)
	// Являюсь ли я хостом
	const isHost = computed(() =>
		sessionData.value && sessionData.value.hostId === uid.value
	)
	// Я готов или нет
	const isReady = computed(() => {
		if (!sessionData.value) return false
		return isHost.value ? sessionData.value.readyHost : sessionData.value.readyGuest
	})
	// Готов ли соперник
	const opponentReady = computed(() => {
		if (!sessionData.value) return false
		return isHost.value ? sessionData.value.readyGuest : sessionData.value.readyHost
	})
</script>

<style scoped>
	.match-wrapper {
		height: 100vh;
		width: 100vw;
		background: linear-gradient(#f2e6d3, #a88d61);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		font-family: Georgia, serif;
	}
	.match-header {
		background: #3e2e1f;
		color: #ffd765;
		text-align: center;
		font-size: 28px;
		font-weight: bold;
		padding: 12px;
		border-bottom: 4px solid #c9a24e;
	}
	.match-layout {
		flex: 1;
		display: grid;
		grid-template-columns: 1fr 2fr 1fr;
		gap: 12px;
		padding: 16px;
		box-sizing: border-box;
	}
	.panel {
		background: #e0caa2;
		border: 4px solid #7a5b32;
		border-radius: 10px;
		padding: 16px;
		box-shadow: inset 0 0 8px #00000033;
		display: flex;
		flex-direction: column;
	}
	.panel-title {
		font-size: 18px;
		font-weight: bold;
		color: #3a260e;
		margin-bottom: 12px;
		border-bottom: 2px solid #b89040;
		padding-bottom: 6px;
	}
	.player-slot {
		background: #c9b07d;
		padding: 10px;
		margin-bottom: 8px;
		border: 2px solid #8c6c3a;
		border-radius: 6px;
		text-align: center;
		font-weight: 600;
		color: #2e1e07;
	}
	.leave-button {
		margin-top: 8px;
		padding: 10px 0;
		background: #c9b07d;
		border: 2px solid #a88d61;
		border-radius: 6px;
		font-weight: bold;
		color: #3e2e1f;
		cursor: pointer;
		transition: background 0.2s;
	}
	.leave-button:hover {
		background: #ffe4a6;
	}
	.chat-info {
		margin-top: auto;
		font-size: 12px;
		color: #4a3720;
		padding-top: 12px;
	}
	.center-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		justify-content: center;
		flex: 1;
	}
	.find-button {
		background: linear-gradient(120deg, #ffe08a, #a87709);
		color: #3e2503;
		border: 3px solid #f8e1b7;
		border-radius: 18px;
		padding: 16px 38px;
		font-size: 20px;
		font-weight: bold;
		cursor: pointer;
		transition: background 0.3s ease, transform 0.2s ease;
		box-shadow: 0 4px 12px #00000045, inset 0 2px 4px #ffffff60;
		text-shadow: 0 1px 1px #fff2c1;
	}
	.find-button:hover:enabled {
		background: linear-gradient(120deg, #fff0b4, #c99a2b);
		transform: translateY(-2px);
	}
	.find-button:disabled {
		background: #e4d6a179;
		color: #a1926a;
		cursor: not-allowed;
		box-shadow: none;
		opacity: 0.8;
	}
	.status-message {
		font-size: 18px;
		color: #5b3b08;
		font-weight: 500;
		background: #fdf3dc;
		padding: 12px 20px;
		border-radius: 14px;
		border: 2px solid #e3c285;
		box-shadow: inset 0 2px 4px #ffffff80;
		max-width: 360px;
		text-align: center;
	}
	.player-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 8px;
	}
	.player {
		padding: 6px 10px;
		background: #e9dab1;
		border: 1px solid #b0905e;
		border-radius: 6px;
		font-size: 14px;
		color: #2d1e06;
	}

	.search-spinner {
		display: inline-block;
		width: 36px;
		height: 36px;
		border: 5px solid #e6c15c;
		border-radius: 50%;
		border-top-color: #a68836;
		animation: spin 1s linear infinite;
		margin-bottom: 8px;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>
