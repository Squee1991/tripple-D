<template>
	<div class="swiper-wrapper">
		<button class="nav-button left" @click="prevPage" :disabled="currentPage === 0">←</button>

		<div class="card-container">
			<div v-for="(key, index) in visibleKeys" :key="index" class="card"
			     :class="{ selected: selectedTopic === key }" @click="selectCard(key)">
				<p class="card-title">{{ nameMap[key] }}</p>
				<div class="card-icon"></div>
			</div>
		</div>
		<button class="nav-button right" @click="nextPage" :disabled="endIndex >= topics.length">→</button>

	</div>
	<transition name="fade">
		<button v-if="selectedTopic" class="next-button" @click="goNext">Далее</button>
	</transition>
</template>

<script setup>
	import {ref, computed} from 'vue'
	import {useRouter} from 'vue-router'
	import {userlangStore} from '/store/learningStore.js'

	const selectedTopic = ref(null)

	const router = useRouter()
	const store = userlangStore()

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
		BathroomItems: 'Вещи для ванной',
		Kosmetik: 'Косметика',
		Familie: 'Семья',
		Emotions: 'Эмоции',
		Werkzeuge: 'Инструменты',
		Kitchen: 'Кухня',
		Health: 'Здоровье',
		Sport: 'Спорт',
		SportEquipment: 'Фитнес-инвентарь'
	}

	const topics = Object.keys(nameMap)
	const topicsPerPage = 6
	const currentPage = ref(0)

	const startIndex = computed(() => currentPage.value * topicsPerPage)
	const endIndex = computed(() => startIndex.value + topicsPerPage)
	const visibleKeys = computed(() => topics.slice(startIndex.value, endIndex.value))

	const nextPage = () => {
		if (endIndex.value < topics.length) currentPage.value++
	}

	const prevPage = () => {
		if (currentPage.value > 0) currentPage.value--
	}

	const selectCard = (key) => {
		selectedTopic.value = key
	}

	const goNext = async () => {
		try {
			const response = await fetch('/words.json')
			const data = await response.json()

			const incomingWords = (data[selectedTopic.value] || []).map(word => ({
				...word,
				topic: selectedTopic.value,
				progress: {}
			}))

			for (const word of incomingWords) {
				const existing = store.words.find(w => w.de === word.de && w.topic === word.topic)
				if (!existing) {
					store.words.push(word)
				}
			}

			await store.setSelectedTopics([selectedTopic.value])
			await store.saveToFirebase()

			router.push({
				path: '/howtolearn',
				query: {
					topic: selectedTopic.value
				}
			})
		} catch (e) {

		}
	}


</script>

<style scoped>

	.swiper-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40px 0;
		background: linear-gradient(to bottom, #f9f2ff, #fff);
		border-radius: 24px;
		overflow: hidden;
	}

	.card-container {
		display: flex;
		gap: 20px;
		transition: all 0.4s ease;
	}

	.card {
		width: 150px;
		height: 220px;
		background: linear-gradient(145deg, #3a2b5a, #2a1f3c);
		border: 2px dashed #bb86fc;
		border-radius: 18px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		box-shadow: 0 0 18px #ab47bc66;
		cursor: pointer;
		transition: transform 0.4s ease, box-shadow 0.4s ease;
	}

	.card.selected {
		background: linear-gradient(145deg, #5e35b1, #311b92); /* более яркий фиолетовый */
		border: 3px solid #ffffff;
		box-shadow: 0 0 24px #ffffffaa, 0 0 32px #bb86fc;
		transform: scale(1.06);
	}

	.card:hover {
		transform: scale(1.04);
		box-shadow: 0 0 24px #bb86fc;
	}

	.card-title {
		color: #fff;
		font-weight: 700;
		text-transform: uppercase;
		font-size: 15px;
		letter-spacing: 1.2px;
		margin-bottom: 10px;
		text-shadow: 0 0 6px #bb86fcaa;
		text-align: center;
	}

	.card-icon {
		width: 36px;
		height: 36px;
		background: radial-gradient(circle, #80deea, #006064);
		clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
		box-shadow: 0 0 10px #80deea88;
	}

	.nav-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: #f3e5f5;
		border: 2px dashed #9c27b0;
		color: #6a1b9a;
		font-size: 28px;
		padding: 8px 14px;
		border-radius: 12px;
		cursor: pointer;
		box-shadow: 0 0 12px #ba68c8aa;
		transition: all 0.3s ease;
		z-index: 10;
	}

	.nav-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
		box-shadow: none;
	}

	.nav-button:hover:not(:disabled) {
		background: #e1bee7;
		box-shadow: 0 0 20px #ab47bc;
	}

	.nav-button.left {
		left: 70px;
	}

	.nav-button.right {
		right: 70px;
	}

	.next-button {
		margin-top: 10px;
		background: #f6e7ff;
		color: #6a1b9a;
		padding: 14px 32px;
		border-radius: 16px;
		font-size: 20px;
		font-weight: bold;
		border: 2px dashed #a246e4;
		box-shadow: 0 0 5px #d68fff88;
		cursor: pointer;
		transition: all 0.3s ease;
		display: block;
		margin-left: auto;
		margin-right: auto;
		animation: fadeIn 0.3s ease;
		font-family: 'Uncial Antiqua', cursive;
	}

	.next-button:hover {
		background: #ecd4ff;
		box-shadow: 0 0 24px #a246e4;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.4s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}


</style>
