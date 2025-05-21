<template>
	<div class="spellbook">
		<div class="modal-overlay" v-if="showModal">
			<transition name="zoom">
				<div class="modal">
					<div>
						<div>
							Вы уверены, что хотите купить
						</div>
						<div>{{ selectedSpell?.name }} за</div>
						<div>{{ selectedSpell?.price }}  Артиклюсов?</div>
					</div>
					<div class="modal-buttons">
						<button @click="confirmBuy">Да</button>
						<button @click="cancelBuy">Нет</button>
					</div>
				</div>
			</transition>
		</div>
		<div class="title__wrapper">
			<div class="spell__title">Доска спелов</div>
			<transition name="fade">
				<p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
			</transition>
		</div>
		<div class="spell-list">
			<div v-for="spell in spells" :key="spell.key" class="spell-card">
				<div class="spell-card-row">
					<div class="spell-header">
						<span class="spell-name">{{ spell.name }}</span>
						<span class="spell-price">{{ spell.price }}</span>
					</div>
					<p class="spell-desc">{{ spell.description }}</p>
					<button class="spell__card--btn"
					        :class="{ 'btn-disabled': store.points < spell.price && !isOwned(spell.key) }"
						    @click="confirmPurchase(spell)"
					>
						{{ isOwned(spell.key) ? 'Куплено' : 'Купить' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { userlangStore } from '../../store/learningStore.js'
	import { ref } from 'vue'
	const store = userlangStore()
	const ownedSpells = ref([])
	const errorMessage = ref('')
	const showModal = ref(false)
	const selectedSpell = ref(null)
	const isOwned = (key) => ownedSpells.value.includes(key)
	const spells = [
		{ key: 'retry', name: 'Вторая попытка', description: 'Позволяет попробовать ещё раз', price: 1},
		{ key: 'hideWrong', name: 'Блок неверных', description: 'Скрывает один неверный вариант', price: 20 },
		{ key: 'hint', name: 'Подсказка', description: 'Показывает правильный артикль', price: 30 },
		{ key: 'autoComplete', name: 'Ещё одна попытка', description: 'Считает слово выученным', price: 50 },
		{ key: 'freezeTimer', name: 'Увеличить время', description: 'Увеличивает таймер на 5 сек', price: 25 },
		{ key: 'shieldError', name: 'Щит ошибки', description: 'Игнорирует одну ошибку', price: 40 },
		{ key: 'cleanseWrong', name: 'Стереть ошибки', description: 'Удаляет 1 неправильный ответ из истории', price: 25 },
	]

	const confirmPurchase = (spell) => {
		if (isOwned(spell.key)) return
		if (store.points < spell.price) {
			errorMessage.value = `Недостаточно Артиклюсов для "${spell.name}" ${spell.price}`
			setTimeout(() => (errorMessage.value = ''), 3000)
			return
		}
		selectedSpell.value = spell
		showModal.value = true
	}

	const confirmBuy = () => {
		if (!selectedSpell.value) return
		const spell = selectedSpell.value
		if (store.points >= spell.price && !isOwned(spell.key)) {
			store.points -= spell.price
			ownedSpells.value.push(spell.key)
			store.saveToFirebase()
		}
		showModal.value = false
		selectedSpell.value = null
	}

	const cancelBuy = () => {
		showModal.value = false
		selectedSpell.value = null
	}

</script>

<style scoped>
	.spellbook {
		padding: 2rem;
		background-size: cover;
		border: 3px solid #d4af37;
		border-radius: 12px;
		box-shadow: 0 0 20px #000;
		color: #fff;
		font-family: 'Cinzel', serif;
	}

	.title__wrapper {
		height: 100px;
	}

	.error-message {
		color: #ff6666;
		font-weight: bold;
		text-shadow: 0 0 4px #000;
		background: rgba(255, 0, 0, 0.1);
		padding: 5px 16px;
		border: 2px solid #aa4444;
		border-radius: 10px;
	}

	.spell-name{
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.spell__title{
		font-size: 30px;
		font-family: "Kurale", serif;
	}

	.spell-card-row {
		padding: 20px;
		height: 200px;
		background: rgba(0,0,0,0.6);
		border: 2px solid #c29f52;
		box-shadow: 0 0 10px #000;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.spell__card--btn {
		width: 100%;
		background: #f0d88e;
		color: #3a2c0d;
		border: 2px solid #7a5c20;
		border-radius: 10px;
		padding: 8px;
		cursor: pointer;
		transition: 0.2s;
		font-weight: bold;
	}

	.spell-list {
		display: flex;
		flex-wrap: wrap;
		margin: -10px;
	}

	.spell-card {
		width:33%;
		padding: 10px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex-wrap: wrap;

	}

	.spell-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: bold;
		color: #ffd700;
	}

	.spell-desc {
		color: #ddd;
		font-size: 14px;
		margin-bottom: 10px;
	}



	.modal-overlay {
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
	}

	.modal {
		background: #2a1e10;
		border: 3px solid #c29f52;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 0 20px #000;
		color: #f8e4b2;
		text-align: center;
		width: 320px;
	}

	.modal-buttons {
		display: flex;
		justify-content: space-around;
		margin-top: 1rem;
	}

	.modal-buttons button {
		background: #f0d88e;
		color: #3a2c0d;
		border: 2px solid #7a5c20;
		border-radius: 10px;
		padding: 8px 16px;
		font-weight: bold;
		cursor: pointer;
	}

	.zoom-enter-active {
		animation: zoomIn 0.3s ease;
	}
	.zoom-leave-active {
		animation: zoomOut 0.25s ease forwards;
	}

	@keyframes zoomIn {
		0% {
			transform: scale(0.7);
			opacity: 0;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes zoomOut {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		100% {
			transform: scale(0.7);
			opacity: 0;
		}
	}


</style>
