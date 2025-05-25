<template>
	<div class="battle">
		<h1>⚔️ Бой начался!</h1>
		<p>🆔 Сессия: <strong>{{ sessionId }}</strong></p>
		<p>👤 Вы: <strong>{{ currentUserId ? getName(currentUserId.value) : '...' }}</strong></p>
		<p>🕹 Противник: <strong>{{ opponentId ? getName(opponentId) : 'Ожидание...' }}</strong></p>

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
	</div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { getAuth } from 'firebase/auth'
import {
	getFirestore,
	doc,
	onSnapshot,
	updateDoc,
	arrayUnion,
	Timestamp,
	getDoc
} from 'firebase/firestore'
import { ref, onMounted, nextTick } from 'vue'
const route = useRoute()
const auth = getAuth()
const db = getFirestore()

const sessionId = route.query.id
const session = ref(null)
const currentUserId = ref(auth.currentUser?.uid)
const opponentId = ref(null)

const newMessage = ref('')
const messages = ref([])
const messagesBox = ref(null)
const userNicknames = ref({})
const sendMessage = async () => {
	if (!newMessage.value.trim() || !currentUserId.value) return

	const msg = {
		uid: currentUserId.value,
		text: newMessage.value.trim(),
		createdAt: Timestamp.now()
	}

	const sessionRef = doc(db, 'sessions', sessionId)
	await updateDoc(sessionRef, {
		messages: arrayUnion(msg)
	})

	newMessage.value = ''
}
const scrollToBottom = async () => {
	await nextTick()
	if (messagesBox.value) {
		messagesBox.value.scrollTop = messagesBox.value.scrollHeight
	}
}
const getName = (uid) => {
	if (uid === currentUserId.value) return 'Вы'
	return userNicknames.value[uid] || 'Противник'
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
const getName = (uid) => {
	if (!uid) return 'Ожидание...'
	if (uid === currentUserId.value) return 'Вы'
	return userNicknames.value[uid] || uid
}
onMounted(() => {
	if (!sessionId) return

	const sessionRef = doc(db, 'sessions', sessionId)

	onSnapshot(sessionRef, async (docSnap) => {
		const data = docSnap.data()
		if (!data) return

		session.value = data

		if (data.hostId === currentUserId.value) {
			opponentId.value = data.guestId
		} else {
			opponentId.value = data.hostId
		}

		// Загрузка имён
		if (data.hostId) await loadUserNickname(data.hostId)
		if (data.guestId) await loadUserNickname(data.guestId)

		// Сообщения
		if (data.messages) {
			messages.value = data.messages.sort(
					(a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
		)
			scrollToBottom()
		}
	})
	onMounted(() => {
		const unsub = auth.onAuthStateChanged((user) => {
			currentUserId.value = user?.uid || null
		})

		onUnmounted(() => unsub())
	})

	onMounted(() => {
		if (!sessionId) return

		const sessionRef = doc(db, 'sessions', sessionId)

		onSnapshot(sessionRef, async (docSnap) => {
			const data = docSnap.data()
			if (!data) return

			session.value = data

			if (data.hostId === currentUserId.value) {
				opponentId.value = data.guestId
			} else {
				opponentId.value = data.hostId
			}
			if (data.hostId) await loadUserNickname(data.hostId)
			if (data.guestId) await loadUserNickname(data.guestId)
			if (data.messages) {
				messages.value = data.messages.sort(
						(a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
			)
				scrollToBottom()
			}
		})
	})
})
</script>

<style scoped>
.battle {
	max-width: 700px;
	margin: 0 auto;
	padding: 40px;
	text-align: center;
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
</style>