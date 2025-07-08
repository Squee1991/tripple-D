<template>
	<div class="battle-container">
		<div v-if="!session" class="loading-screen">
			<div class="search-spinner"></div>
			<p>Загрузка данных боя...</p>
		</div>
		<div v-else class="battle-layout">
			<div class="player-zone opponent-zone">
				<div class="player-info">
					<span class="nickname">{{ opponentNickname }}</span>
					<span class="theme-display">Тема: {{ opponentThemeName }}</span>
				</div>
				<div class="deck-area">
					<div v-for="card in opponentDeck" :key="card.id" class="card-back-wrapper">
						<Card :cardInfo="card" :is-opponent-card="true" />
					</div>
				</div>
			</div>
			<div class="center-zone">
				<h1 class="battle-title">⚔️ ПОЕДИНОК ⚔️</h1>
				<p v-if="opponentLeft" class="status-message opponent-left">
					Противник покинул сессию...
				</p>
			</div>
			<div class="player-zone my-zone">
				<div class="player-info">
					<span class="nickname">Вы ({{ myNickname }})</span>
					<span class="theme-display">Тема: {{ myThemeName }}</span>
				</div>
				<div class="deck-area">
					<Card
							v-for="card in myDeck"
							:key="card.id"
							:cardInfo="card"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted, onUnmounted, computed } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { getAuth } from 'firebase/auth'
	import { getFirestore, doc, onSnapshot, getDoc } from 'firebase/firestore'
	// 1. ИМПОРТИРУЕМ ВАШ КОМПОНЕНТ КАРТЫ
	import Card from '../src/components/deck.vue'

	const route = useRoute()
	const router = useRouter()
	const auth = getAuth()
	const db = getFirestore()
	const sessionId = route.query.id
	const session = ref(null)
	const currentUserId = ref(auth.currentUser?.uid)
	const userNicknames = ref({})
	const opponentLeft = ref(false)
	let unsubscribeSession = null

	const nameMap = {
		Furniture: 'Мебель', Animals: 'Животные', Clothes: 'Одежда', Food: 'Еда', Body: 'Части тела', Professions: 'Профессии', Transport: 'Транспорт', Colors: 'Цвета', Nature: 'Природа', Home: 'Дом', Zeit: 'Время', City: 'Город', School: 'Школа', DaysAndMonths: 'Дни и месяцы', Toys: 'Игрушки', CommonItems: 'Общие', BathroomItems: 'Ванная', Kosmetik: 'Косметика', Familie: 'Семья', Emotions: 'Эмоции', Werkzeuge: 'Инструменты', Kitchen: 'Кухня', Health: 'Здоровье', Sport: 'Спорт', Drinks: 'Напитки', Holidays: 'Праздники', SportEquipment: 'Фитнес', Travel: 'Путешествия', Musik: 'Музыка', Amount: 'Колличество', Informatik: 'Информатика'
	}

	const isHost = computed(() => session.value && currentUserId.value === session.value.hostId)
	const opponentId = computed(() => isHost.value ? session.value?.guestId : session.value?.hostId)
	const myNickname = computed(() => userNicknames.value[currentUserId.value] || 'Вы')
	const opponentNickname = computed(() => userNicknames.value[opponentId.value] || 'Противник')
	const myTheme = computed(() => session.value ? (isHost.value ? session.value.hostTheme : session.value.guestTheme) : '')
	const opponentTheme = computed(() => session.value ? (isHost.value ? session.value.guestTheme : session.value.hostTheme) : '')
	const myDeck = computed(() => session.value ? (isHost.value ? session.value.hostDeck : session.value.guestDeck) || [] : [])
	const opponentDeck = computed(() => session.value ? (isHost.value ? session.value.guestDeck : session.value.hostDeck) || [] : [])
	const myThemeName = computed(() => nameMap[myTheme.value] || myTheme.value)
	const opponentThemeName = computed(() => nameMap[opponentTheme.value] || opponentTheme.value)

	const loadUserNickname = async (uid) => {
		if (!uid || userNicknames.value[uid]) return
		const docRef = doc(db, 'users', uid)
		const snap = await getDoc(docRef)
		if (snap.exists()) { userNicknames.value[uid] = snap.data().nickname || `Игрок...` }
	}

	onMounted(() => {
		if (!currentUserId.value) { router.push('/auth'); return }
		if (!sessionId) { router.push('/duel'); return }
		loadUserNickname(currentUserId.value)
		const sessionRef = doc(db, 'sessions', sessionId)
		unsubscribeSession = onSnapshot(sessionRef, async (docSnap) => {
			if (!docSnap.exists()) { opponentLeft.value = true; setTimeout(() => router.push('/duel'), 3000); return }
			const data = docSnap.data()
			session.value = data
			const oppId = data.hostId === currentUserId.value ? data.guestId : data.hostId
			if (oppId) { await loadUserNickname(oppId) }
		})
	})
	onUnmounted(() => { if (unsubscribeSession) unsubscribeSession() })
</script>

<style scoped>
	/* Стили остаются такими же, как я присылал ранее */
	.battle-container { width: 100vw; height: 100vh; background: #f0e6d2; display: flex; justify-content: center; align-items: center; font-family: 'Georgia', serif; }
	.loading-screen { text-align: center; color: #3e2e1f; }
	.search-spinner { display: inline-block; width: 40px; height: 40px; border: 5px solid #e6c15c; border-radius: 50%; border-top-color: #a68836; animation: spin 1s linear infinite; margin-bottom: 10px; }
	@keyframes spin { to { transform: rotate(360deg); } }
	.battle-layout { width: 100%; height: 100%; max-width: 1400px; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; gap: 20px; }
	.player-zone { flex: 1; display: flex; align-items: center; gap: 20px; padding: 15px; border: 4px solid #7a5b32; border-radius: 15px; background: #e0caa2; box-shadow: inset 0 0 15px #00000033; }
	.player-info { display: flex; flex-direction: column; gap: 10px; background: #c9b07d; padding: 15px; border-radius: 10px; border: 2px solid #8c6c3a; text-align: center; min-width: 220px; box-shadow: 0 4px 8px #00000022; }
	.nickname { font-size: 22px; font-weight: bold; color: #3a260e; }
	.theme-display { font-size: 18px; color: #553a13; font-style: italic; }
	.deck-area { flex: 1; display: flex; justify-content: center; align-items: center; gap: 15px; background: #c9b07d55; border-radius: 10px; min-height: 140px; padding: 10px; flex-wrap: wrap; }
	.center-zone { flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px; color: #3e2e1f; }
	.battle-title { margin: 0; font-size: 28px; color: #3e2e1f; text-shadow: 1px 1px 0px #fffbe8; }
	.status-message.opponent-left { background: #ffebe8; color: #a11919; font-weight: bold; padding: 8px 16px; border-radius: 10px; }
	/* Добавляем стиль для "рубашки" карты противника, если нужно */
	.card-back-wrapper { opacity: 0.7; pointer-events: none; }
</style>