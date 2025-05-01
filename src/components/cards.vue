<template>
		<div>
			<div class="card-container">
				<div
					v-for="(label, key) in nameMap"
					:key="key"
					class="card"
					:class="{ selected: selectedTopic === key }"
					@click="selectCard(key)"
				>
					<p class="card-title">{{ label }}</p>
					<div class="card-icon" />
				</div>
			</div>
			<transition name="fade">
				<button v-if="selectedTopic" class="next-button" @click="goNext">Далее</button>
			</transition>
		</div>
</template>

<script setup>
	import { ref } from 'vue'
	import { useRouter } from 'vue-router'
	import { userlangStore } from '/store/learningStore.js'
	const selectedTopic = ref(null)
	const topicWords = ref([])
	const router = useRouter()
	const store = userlangStore()

	const goNext = async () => {
		try {
			const response = await fetch('/words.json')
			const data = await response.json()
			topicWords.value = data[selectedTopic.value] || []
			await store.setSelectedTopics([selectedTopic.value])
			await store.setWords(topicWords.value)
			router.push({
				path: '/howtolearn',
				query: {
					topic: selectedTopic.value
				}
			})
		} catch (e) {
			console.error('Ошибка загрузки слов:', e)
		}
	}

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
		DaysAndMonths: 'Дни и месяцы'
	}

	const selectCard = (key) => {
		selectedTopic.value = key
	}
</script>

<style scoped>

	.card-container {
		width: 100%;
		max-width: calc(160px * 7 + 20px * 6);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		justify-content: center;
		padding: 20px 40px;
	}

	.card {
		width: 160px;
		height: 240px;
		background: rgba(0, 0, 0, 0.7);
		border: none;
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		box-shadow: 0 0 12px #00ffff44;
		cursor: pointer;
		transition: all 0.5s ease;
		animation: pulseGlow 6s infinite ease-in-out;
	}


	.card:hover {
		background: rgba(0, 0, 0, 0.93);
		box-shadow: 0 0 20px #00ffffcc;
		transform: scale(1.03);
	}

	@keyframes pulseGlow {
		50% {
			box-shadow: 0 0 5px #00ffffaa;
			transition: all 0.5s ease;
		}
		100% {
			box-shadow: 0 0 5px #00ffff44;
			transition: all 0.5s ease;
		}
	}

	.card-title {
		font-size: 17px;
		font-weight: bold;
		color: white;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 12px;
		text-shadow: 0 0 6px #00ffff55;
	}

	.card-icon {
		width: 40px;
		height: 40px;
		background: radial-gradient(circle at center, #00ffffaa, #007777);
		clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
		box-shadow: 0 0 10px #00ffff66;
	}

	.next-button {
		position: absolute;
		bottom: 60px;
		left: 50%;
		transform: translateX(-50%);
		background: #00ffff44;
		color: white;
		padding: 14px 32px;
		border-radius: 12px;
		font-size: 20px;
		border: 1px solid #00ffffaa;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 0 12px #00ffff55;
	}

	.next-button:hover {
		background: #00ffff88;
		box-shadow: 0 0 20px #00ffffaa;
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
