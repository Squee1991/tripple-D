<template>
	<div class="battle">
		<button class="leave-button" @click="leaveSession">Покинуть бой</button>
		<div v-if="opponentLeft" class="opponent-left">
			⚠️ Противник покинул сессию. Вы будете возвращены в лобби...
		</div>
		<h1>⚔️Бой начался!</h1>
		<p>🆔 Сессия: <strong>{{ sessionId }}</strong></p>
		<p>👤 Вы: <strong>{{ currentUserId ? getName(currentUserId.value) : '...' }}</strong></p>
		<p>🕹️ Противник: <strong>{{ opponentId ? getName(opponentId) : 'Ожидание...' }}</strong></p>
		<div class="chat">
			<h2>💬 Чат</h2>
			<div class="messages" ref="messagesBox">
				<div
					v-for="msg in messages"
					:key="msg.createdAt?.seconds + msg.text"
					class="message"
					:class="{ self: msg.uid === currentUserId }"
				>
					<div class="meta">
						<span class="name">{{ getName(msg.uid) }}</span>
						<span class="time">{{ formatTime(msg.createdAt?.seconds) }}</span>
					</div>
					<div class="text">{{ msg.text }}</div>
				</div>
			</div>
			<input
				v-model="newMessage"
				placeholder="Написать сообщение..."
				@keyup.enter="sendMessage"
			/>
			<button @click="sendMessage">Отправить</button>
		</div>
		<div class="text_under"> Компонент в стадии разработки</div>
	</div>
</template>

<script setup>
	import { useRoute, useRouter } from 'vue-router'
	import { getAuth } from 'firebase/auth'
	import { io } from 'socket.io-client'
	import  useSocket  from '../composables/useSocket.js'
	const socket = useSocket()
	import {
		getFirestore,
		doc,
		deleteDoc,
		onSnapshot,
		getDoc
	} from 'firebase/firestore'
	import { ref, onMounted, onUnmounted, nextTick } from 'vue'
	const iAmLeaving = ref(false)
	const route = useRoute()
	const auth = getAuth()
	const db = getFirestore()
	const router = useRouter()
	const sessionId = route.query.id
	const session = ref(null)
	const currentUserId = ref(null)
	const opponentId = ref(null)
	const newMessage = ref('')
	const messages = ref([])
	const messagesBox = ref(null)
	const userNicknames = ref({})
	const opponentLeft = ref(false)
	const unsubscribeSession = ref(null)

	const leaveSession = async () => {
		iAmLeaving.value = true
		if (!sessionId) return
		try {
			await deleteDoc(doc(db, 'sessions', sessionId))
			router.push('/duel')
		} catch (e) {
			console.error('Ошибка при выходе из боя:', e)
		}
	}
	// Отправить сообщение в чат
	const sendMessage = () => {
		if (!newMessage.value.trim() || !currentUserId.value) return
		const msg = {
			sessionId,
			uid: currentUserId.value,
			text: newMessage.value.trim(),
			createdAt: new Date().toISOString()
		}
		socket.emit("chatMessage", msg)
		newMessage.value = ''
	}

	socket.on("chatMessage", (msg) => {
		if (msg.sessionId !== sessionId) return
		messages.value.push(msg)
		scrollToBottom()
	})

	// Автопрокрутка чата
	const scrollToBottom = async () => {
		await nextTick()
		if (messagesBox.value) {
			messagesBox.value.scrollTop = messagesBox.value.scrollHeight
		}
	}

	const getName = (uid) => {
		if (!uid) return 'Ожидание...'
		if (uid === currentUserId.value) return 'Вы'
		return userNicknames.value[uid] || uid
	}

	const formatTime = (seconds) => {
		if (!seconds) return ''
		const date = new Date(seconds * 1000)
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}

	const loadUserNickname = async (uid) => {
		const docRef = doc(db, 'users', uid)
		const snap = await getDoc(docRef)
		if (snap.exists()) {
			userNicknames.value[uid] = snap.data().nickname || uid
		}
	}

	onMounted(() => {
		if (!sessionId) return

		const sessionRef = doc(db, 'sessions', sessionId)
		unsubscribeSession.value = onSnapshot(sessionRef, async (docSnap) => {
			if (!docSnap.exists()) {
				if (!iAmLeaving.value) { // ← Показывать только если ты не сам уходишь!
					opponentLeft.value = true
					session.value = null
					setTimeout(() => {
						router.push('/duel')
					}, 2200)
				} else {
					// Ты сам ушёл — просто переход на /duel
					router.push('/duel')
				}
				return
			}
			const data = docSnap.data()
			session.value = data
			// Определяем currentUser/opponentId
			if (currentUserId.value === data.hostId) {
				opponentId.value = data.guestId
			} else if (currentUserId.value === data.guestId) {
				opponentId.value = data.hostId
			} else if (data.hostId && !data.guestId) {
				// Случай, когда ты хост, а соперника нет
				opponentId.value = null
			}
			// Проверяем если противник вышел (uid исчез)
			if ((currentUserId.value === data.hostId && !data.guestId)
				|| (currentUserId.value === data.guestId && !data.hostId)) {
				opponentLeft.value = true
				setTimeout(() => {
					router.push('/duel')
				}, 4200)
				return
			}

			// Никнеймы
			if (data.hostId) await loadUserNickname(data.hostId)
			if (data.guestId) await loadUserNickname(data.guestId)

			// Чат
			if (data.messages) {
				messages.value = data.messages.sort(
					(a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
				)
				scrollToBottom()
			}
		})
	})

	onMounted(() => {
		console.log("🔌 socket подключен?", socket.connected)
		const unsub = auth.onAuthStateChanged(async (user) => {
			if (user?.uid) {
				currentUserId.value = user.uid
				await loadUserNickname(user.uid) // ← загружаем ник для самого себя
			} else {
				currentUserId.value = null
			}
		})
		onUnmounted(() => unsub())
	})

	socket.on("connect", () => {
		console.log("✅ Socket подключён, ID:", socket.id)
	})

	onUnmounted(() => {
		if (unsubscribeSession.value) unsubscribeSession.value()
	})

	watch(currentUserId, (val) => {
		if (val && sessionId) {
			socket.emit("join", {
				sessionId,
				uid: val
			});
		}
	});

</script>


<style scoped>

	.leave-button {
		margin-top: 20px;
		background: #aa3a3a;
		color: #fff;
		padding: 10px 20px;
		border-radius: 8px;
		border: none;
		font-weight: bold;
		cursor: pointer;
		transition: 0.2s;
	}
	.leave-button:hover {
		background: #cc2c2c;
	}

	.battle {
		max-width: 700px;
		margin: 0 auto;
		padding: 40px;
		text-align: center;
	}

	.text {
		width: 40px;
		font-weight: bold;
	}

	.text_under{
		font-size: 35px;
	}

	.chat {
		margin-top: 30px;
		text-align: left;
	}

	.messages {
		max-height: 250px;
		overflow-y: auto;
		background: #f5f5f5;
		padding: 12px;
		border-radius: 10px;
		margin-bottom: 12px;
		font-size: 16px;
	}

	.message {
		margin-bottom: 10px;
		background: #e0e0e0;
		padding: 8px 12px;
		border-radius: 10px;
		width: fit-content;
		max-width: 80%;
	}

	.message.self {
		background: #d1c4e9;
		margin-left: auto;
	}

	.meta {
		font-size: 12px;
		color: #666;
		margin-bottom: 4px;
		display: flex;
		justify-content: space-between;
	}

	input {
		width: 100%;
		padding: 8px;
		margin-bottom: 6px;
		border: 1px solid #ccc;
		border-radius: 6px;
	}

	button {
		padding: 8px 16px;
		background: #6633cc;
		color: white;
		border-radius: 8px;
		cursor: pointer;
	}

	.opponent-left {
		margin: 20px auto 0 auto;
		padding: 16px 32px;
		background: #ffebe8;
		color: #a11919;
		font-weight: bold;
		border-radius: 10px;
		font-size: 18px;
		max-width: 350px;
	}
</style>
