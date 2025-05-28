<template>
	<div class="match-wrapper">
		<ThemeExplain v-if="showInfo" @close="showInfo = false"/>
		<div class="match-header">ПОЕДИНОК АРТИКЛЕЙ</div>
		<div class="match-layout">
			<!-- Левая колонка: игроки -->
			<div class="panel left-panel">
				<div class="panel-title">Данные игрока</div>
				<div class="player-slot">Кол-во побед</div>
				<div class="player-slot">Кол-во поражений</div>
				<div class="player-slot">Всего сыграно</div>
				<div class="player-slot">Кол-во очков</div>
				<div class="chat-info">Добро пожаловать в артикль-чат!</div>
			</div>
			<!-- Центр: поиск / ожидание -->
			<div class="panel center-panel">
				<div class="center-panel-header">
					<div class="panel-title">Темы</div>
					<img @click="showInfo = true" class="theme__info" src="../../assets/images/sticker-question.svg"
					     alt="info">
				</div>
				<div class="themen" data-simplebar>
					<div class="themen-inner">
						<template v-if="!showDeck">
							<div
								class="theme-card"
								:class="{ selected: userBattle.selectedTheme === key }"
								v-for="(theme , key) in useTheme.themes"
								:key="key"
								@click="selectTheme(key)"
							>
								<div class="theme-card-title">{{ nameMap[key] || key }}</div>
								<div class="theme__card-icon">
									<img class="theme__card-icon-item" src="../../assets/images/notebooks.svg" alt="">
								</div>
								<div class="theme-articles">
									<div class="article-circle der">{{ theme.stats.der }}</div>
									<div class="article-circle die">{{ theme.stats.die }}</div>
									<div class="article-circle das">{{ theme.stats.das }}</div>
								</div>
							</div>
						</template>
						<template v-else>
							<Deck />
						</template>
					</div>
				</div>
			</div>
			<div class="panel right-panel">
				<div class="panel-title">Поиск соперника</div>
				<div class="center-content">
					<div class="session__wrapper">
						<button v-if="!sessionId && !loading" class="find-button" @click="findOpponent">Найти противника</button>
						<div v-else-if="loading || (sessionData && sessionData.status === 'waiting')"
						     class="status-message">
							<div class="search-spinner"></div>
							<span>Идёт поиск соперника...</span>
						</div>
						<div v-else-if="bothPlayersConnected" class="status-message">
							<div>Противник найден!</div>
							<button class="find-button" :class="{ ready: isReady }" :disabled="isReady" @click="markReady">
								{{ isReady ? (opponentReady ? 'Ждём начала боя...' : 'Ожидание второго игрока...') : 'Начать бой' }}
							</button>

						</div>
						<div v-if="message" class="status-message">{{ message }}</div>
					</div>
				</div>
				<div  class="status-message">
					<button class="find-button" @click="goToDeck">Моя колода</button>
				</div>
				<button v-if="sessionId" @click="leaveSession" class="leave-button">Покинуть</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref, onUnmounted, computed, onMounted} from 'vue'
	import {useRouter} from 'vue-router'
	import {getAuth} from 'firebase/auth'
	import ThemeExplain from '../../src/components/themeExplain.vue'
	import Deck from '../../src/components/deck.vue'
	import {useThemeCardStore} from '../../store/themeStore.js'
	import {userBattleStore } from '../../store/BattleStore.js'
	import {
		getFirestore, collection, query, where,
		orderBy, limit, getDocs, doc, updateDoc, addDoc,
		onSnapshot, serverTimestamp, deleteDoc, runTransaction
	} from 'firebase/firestore'
	const userBattle = userBattleStore()
	const useTheme = useThemeCardStore()
	const db = getFirestore()
	const auth = getAuth()
	const router = useRouter()
	const loading = ref(false)
	const showDeck = ref(false)
	let showInfo = ref(false)
	const message = ref('')
	const sessionId = ref(null)
	const sessionData = ref(null)
	const unsubscribe = ref(null)
	const uid = computed(() => auth.currentUser?.uid)
	const nameMap = {
		Furniture: 'Мебель',
		Animals: 'Животные',
		Clothes: 'Одежда',
		Food: 'Еда',
		Body: 'Части тела',
		Professions: 'Профессии',
		Transport: 'Транспорт',
		Colors: 'Цвета',
		Nature: 'Природа',
		Home: 'Дом',
		Zeit: 'Время',
		City: 'Город',
		School: 'Школа',
		DaysAndMonths: 'Дни и месяцы',
		Toys: 'Игрушки',
		CommonItems: 'Общие',
		BathroomItems: 'Ванная',
		Kosmetik: 'Косметика',
		Familie: 'Семья',
		Emotions: 'Эмоции',
		Werkzeuge: 'Инструменты',
		Kitchen: 'Кухня',
		Health: 'Здоровье',
		Sport: 'Спорт',
		Drinks: 'Напитки',
		Holidays: 'Праздники',
		SportEquipment: 'Фитнес',
		Travel: 'Путешествия',
		Musik: 'Музыка',
		Amount: 'Колличество',
		Informatik: 'Информатика'
	}

	const mySessionTimeout = ref(null)
	const mySessionId = ref(null)
	const selectTheme = async (key) => {
		userBattle.selectedTheme = key
		await userBattle.generateuserDeck()
		showDeck.value = true
	}
	const goToDeck = async () => {
		if (!userBattle.selectedTheme) {
			message.value = 'Сначала выбери тему!'
			return
		}
		await userBattle.generateuserDeck()
		router.push('/deck')
	}

	const findOpponent = async () => {
		loading.value = true
		message.value = ''
		if (!uid.value) {
			message.value = 'Вы не авторизованы'
			loading.value = false
			return
		}
		// 1. Пытаемся присоединиться к чужой сессии
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
				mySessionId.value = null // ты гость, не создавал свою
				listenToSession(session.id)
				message.value = ''
			} catch (error) {
				message.value = 'Сессию уже заняли, пробуем снова...'
				loading.value = false
				await findOpponent()
				return
			}
			loading.value = false
		} else {
			// 2. Создаём свою сессию — и запускаем таймер перепоиска
			const newSessionRef = await addDoc(collection(db, 'sessions'), {
				hostId: uid.value,
				guestId: null,
				status: 'waiting',
				readyHost: false,
				readyGuest: false,
				createdAt: serverTimestamp(),
				theme: userBattle.selectedTheme,
				deck: JSON.parse(JSON.stringify(userBattle.userDeck))
			})
			sessionId.value = newSessionRef.id
			mySessionId.value = newSessionRef.id // запоминаем свою!
			listenToSession(newSessionRef.id)
			message.value = ''
			loading.value = false

			// Через 10 секунд попробуем найти чужую сессию, если не подключился никто
			mySessionTimeout.value = setTimeout(async () => {
				// если никто не подключился — повторно ищем чужие сессии, кроме своей
				if (sessionData.value && !sessionData.value.guestId) {
					const q2 = query(
						collection(db, 'sessions'),
						where('guestId', '==', null),
						where('status', '==', 'waiting'),
						orderBy('createdAt'),
						limit(1)
					)
					const snapshot2 = await getDocs(q2)
					// нашли чужую сессию, отличную от своей
					if (!snapshot2.empty && snapshot2.docs[0].id !== mySessionId.value) {
						const foreignSession = snapshot2.docs[0]
						const foreignSessionRef = doc(db, 'sessions', foreignSession.id)
						try {
							await runTransaction(db, async (transaction) => {
								const docSnap = await transaction.get(foreignSessionRef)
								const data = docSnap.data()
								if (!data || data.guestId || data.status !== 'waiting') {
									throw 'Сессию уже заняли'
								}
								transaction.update(foreignSessionRef, {
									guestId: uid.value,
									status: 'pending'
								})
							})
							sessionId.value = foreignSession.id
							listenToSession(foreignSession.id)
							message.value = ''
							// Удаляем свою висячую сессию
							await deleteDoc(doc(db, 'sessions', mySessionId.value))
							mySessionId.value = null
						} catch (error) {
							// ничего, просто остаёмся хостом, ждём гостя дальше
						}
					}
				}
			}, 10000)
		}
	}

	// 2. Покинуть сессию
	const leaveSession = async () => {
		if (mySessionTimeout.value) clearTimeout(mySessionTimeout.value)
		if (sessionId.value) {
			await deleteDoc(doc(db, 'sessions', sessionId.value))
			sessionId.value = null
			sessionData.value = null
			message.value = 'Вы покинули сессию'
			setTimeout(() => {
				message.value = null
			}, 1500)
		}
	}
	// 3. Готовность к бою
	const markReady = async () => {
		if (!uid.value || !sessionId.value || !sessionData.value) return
		const sessionRef = doc(db, 'sessions', sessionId.value)
		if (sessionData.value.hostId === uid.value) {
			await updateDoc(sessionRef, {readyHost: true})
		} else {
			await updateDoc(sessionRef, {readyGuest: true})
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
				message.value = null
			}
		})
	}
	// 5. Автоматический старт боя если оба готовы
	onUnmounted(() => {
		if (mySessionTimeout.value) clearTimeout(mySessionTimeout.value)
		if (unsubscribe.value) unsubscribe.value()
	})
	// Оба игрока подключены (оба нажали "Найти противника")
	const bothPlayersConnected = computed(() =>
		sessionData.value && sessionData.value.status === 'pending' && sessionData.value.hostId && sessionData.value.guestId
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

	onMounted(async () => {
		useTheme.loadthemes()
	})

	watch(() => sessionData.value && sessionData.value.readyHost && sessionData.value.readyGuest && sessionData.value.status === 'pending',
		(isBothReady) => {
			if (isBothReady && sessionId.value) {
				const sessionRef = doc(db, 'sessions', sessionId.value)
				updateDoc(sessionRef, {status: 'active'})
			}
		}
	)
</script>

<style scoped>
	.theme-card.selected {
		transform: scale(1.05);
		z-index: 2;
	}

	.match-wrapper {
		min-height: 100vh;
		height: 100vh;
		width: 100vw;
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
		flex: 1 1 0%;
		display: flex;
		flex-direction: row;
		min-height: 0;
		height: 100%;
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
		min-height: 0;
		height: 100%;
	}

	.center-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		height: 100%;
	}

	.center-panel-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 4px solid #b89040;
		padding: 10px;
		margin-bottom: 10px;
	}

	.panel-title {
		font-size: 24px;
		font-weight: bold;
		color: #3a260e;
		font-family: 'Georgia', serif;
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
		padding: 10px 0;
		background: #c9b07d;
		border: 2px solid #a88d61;
		border-radius: 10px;
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

	.center-panel-header {
		display: flex;
		justify-content: space-between;
	}

	.center-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
	}

	.theme__info {
		cursor: pointer;
	}

	.find-button {
		background: linear-gradient(120deg, #ffe08a, #a87709);
		color: #3e2503;
		border: 3px solid #f8e1b7;
		border-radius: 18px;
		padding: 15px;
		font-size: 20px;
		font-weight: bold;
		cursor: pointer;
		transition: background 0.3s ease, transform 0.2s ease;
		box-shadow: 0 4px 12px #00000045, inset 0 2px 4px #ffffff60;
		text-shadow: 0 1px 1px #fff2c1;
		margin-bottom: 10px;
		width: 250px;
	}

	.find-button:hover:enabled {
		background: linear-gradient(120deg, #fff0b4, #c99a2b);
	}

	.find-button:disabled {
		background: #e4d6a179;
		color: #a1926a;
		cursor: not-allowed;
		box-shadow: none;
		opacity: 0.8;
	}

	.status-message {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 18px;
		color: #5b3b08;
		font-weight: 500;
		background: #fdf3dc;
		padding: 12px 20px;
		border-radius: 14px;
		border: 2px solid #e3c285;
		box-shadow: inset 0 2px 4px #ffffff80;
		max-width: 360px;
		width: 250px;
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
		to {
			transform: rotate(360deg);
		}
	}

	.themen {
		flex: 1 1 0%;
		min-height: 0;
		padding: 25px;
	}

	.themen-inner {
		display: flex;
		flex-wrap: wrap;
		gap: 2%;
		justify-content: center;
	}

	.theme-card {
		width: 10%;
		min-width: 175px;
		background: linear-gradient(135deg, #e5be73 65%, #a07632 100%);
		border: 5px solid #7a5921;
		border-radius: 20px;
		box-shadow: 0 8px 40px #2e1b0a88,
		0 0 0 5px #ecd18a inset;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 16px;
		margin-bottom: 20px;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		cursor: pointer;
	}

	.theme-card-title {
		width: 150px;
		background: #553a13;
		color: #ffd462;
		font-family: 'Georgia', serif;
		font-size: 17px;
		height: 60px;
		display: flex;
		justify-content: center;
		font-weight: bold;
		align-items: center;
		padding: 7px 5px 8px 5px;
		border-radius: 12px 12px 14px 14px;
		margin-bottom: 18px;
		border: 3px solid #cfab63;
		box-shadow: 0 2px 14px #29190388 inset;
		text-shadow: 0 3px 8px #b3872e, 0 1px 0 #fffbe8;
	}

	.theme__card-icon {
		width: 100px;
		height: 120px;
		border-radius: 50%;
		margin-bottom: 25px;
		border: 4px solid #7a5921;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
		box-shadow: inset 0 6px 18px #a2832e99,
		inset 0 -8px 16px #00000038,
		0 2px 8px #7a5921cc;
		background: radial-gradient(ellipse at 60% 40%, #e2c072 70%, #ba9652 100%);
		position: relative;
	}


	.theme__card-icon-item {

	}

	.theme-card-word-count {
		font-size: 15px;
		font-weight: 500;
		color: #6e4f25;
		background: #fff9d5;
		padding: 6px 12px;
		border-radius: 12px;
		box-shadow: inset 0 1px 2px #ffffffaa;
		margin-bottom: 16px;
	}

	.theme-articles {
		display: flex;
		justify-content: center;
		gap: 7px;
		margin-top: auto;

	}

	.article-circle {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		font-size: 16px;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		box-shadow: 0 0 8px #00000055, inset 0 2px 3px #ffffff50;
		text-shadow: 0 1px 1px #00000099;
	}

	.session__wrapper {
		height: 150px;
	}

	.article-circle.der {
		background: radial-gradient(circle at 60% 40%, #48b85e 70%, #1a431c 100%);
	}

	.article-circle.die {
		background: radial-gradient(circle at 60% 40%, #c53d2f 70%, #6b1616 100%);
	}

	.article-circle.das {
		background: radial-gradient(circle at 60% 40%, #4662b7 70%, #222a50 100%);
	}

	@media (max-width: 900px) {
		.match-layout {
			flex-direction: column;
			gap: 10px;
			padding: 4px;
		}

		.left-panel, .right-panel {
			flex: 0 0 80px;
			min-width: 0;
			max-width: none;
			height: auto;
		}

		.center-panel {
			min-height: 0;
			min-width: 0;
			height: 240px;
			flex: 1 1 0%;
		}
	}

</style>
