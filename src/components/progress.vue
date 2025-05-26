<template>
	<div class="progress-table-container">
		<div class="topic-select">
			<select v-model="selectedTopic" :disabled="!allTopics.length">
				<option disabled value="">— выберите тему —</option>
				<option
					v-for="topic in allTopics"
					:key="topic"
					:value="topic"
				>
					{{ nameMap[topic] || topic }}
				</option>
			</select>
		</div>

		<div v-if="selectedTopic">
			<div
				v-for="topic in filteredTopics"
				:key="topic"
				class="topic-block"
			>
				<h2 class="topic-title">{{ nameMap[topic] || topic }}</h2>
				<div class="word-table">
					<div class="word-row header">
						<div class="word-cell word-ru">Слово</div>
						<div
							v-for="mode in learningModes"
							:key="mode.key"
							class="word-cell"
						>
							{{ mode.label }}
						</div>
					</div>

					<div
						v-for="word in paginatedWords(topic)"
						:key="word.de"
						class="word-row"
					>
						<div class="word-cell word-ru">{{ word.ru }}</div>

						<div
							v-for="mode in learningModes"
							:key="mode.key"
							class="word-cell status-cell"
						>
							{{ word.progress?.[mode.key] === true
							? '✅'
							: word.progress?.[mode.key] === false
							? '❌'
							: '⏳'
							}}
						</div>
					</div>
				</div>

				<div class="pagination" v-if="filteredWords(topic).length > wordsPerPage">
					<button @click="prevPage" :disabled="currentPage === 1">Назад</button>
					<span>{{ currentPage }} / {{ totalPages(topic) }}</span>
					<button @click="nextPage(topic)" :disabled="currentPage >= totalPages(topic)">Вперед</button>
				</div>
			</div>
		</div>
	</div>
</template>


<script setup>
	import { ref, computed, onMounted, watch } from 'vue'
	import { userlangStore } from '../../store/learningStore.js'

	const store = userlangStore()
	const selectedTopic = ref('')
	const currentPage = ref(1)
	const wordsPerPage = 7

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
	const allTopics = computed(() => store.selectedTopics)

	const filteredTopics = computed(() => {
		return selectedTopic.value
			? [selectedTopic.value]
			: allTopics.value
	})

	const filteredWords = (topic) => store.words.filter(w => w.topic === topic)

	const paginatedWords = (topic) => {
		const list = filteredWords(topic)
		const start = (currentPage.value - 1) * wordsPerPage
		return list.slice(start, start + wordsPerPage)
	}

	const totalPages = (topic) =>
		Math.ceil(filteredWords(topic).length / wordsPerPage)

	function prevPage() {
		if (currentPage.value > 1) currentPage.value--
	}
	function nextPage(topic) {
		if (currentPage.value < totalPages(topic)) currentPage.value++
	}

	const learningModes = [
		{ key: 'article', label: 'Артикль' },
		{ key: 'letters', label: 'Буквы' },
		{ key: 'wordArticle', label: 'Слово+Артикль' },
		{ key: 'audio', label: 'Аудирование' },
		{ key: 'plural', label: 'Мн. число' }
	]

	watch(selectedTopic, () => {
		currentPage.value = 1
	})

	onMounted(async () => {
		await store.loadFromFirebase()
		store.syncSelectedWordsProgress()
	})
</script>

<style scoped>
	.progress-table-container {
		padding: 2rem;
		background: linear-gradient(135deg, #151210, #2c2b26);
		border-radius: 12px;
		box-shadow: inset 0 0 20px #000;
		color: #eee;
	}
	.topic-select {
		margin-bottom: 1.5rem;
		text-align: center;
	}
	.topic-select select {
		padding: 0.5rem 1rem;
		border-radius: 8px;
		border: 2px solid #d1a54d;
		background: #2f261c;
		color: #f8e4b2;
		font-size: 1rem;
	}
	.topic-block {
		margin-bottom: 2rem;
	}
	.topic-title {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: #ffd369;
		text-align: center;
	}
	.word-table {
		display: flex;
		flex-direction: column;
		border: 2px solid #c29f52;
		border-radius: 12px;
		overflow: hidden;
	}
	.word-row {
		display: flex;
		background: linear-gradient(to right, #2a251d, #1c1a17);
		border-bottom: 1px solid rgba(255,255,255,0.08);
	}
	.word-row.header {
		background: linear-gradient(to right, #3b2c19, #5b442d);
		color: #f8d369;
		font-weight: bold;
	}
	.word-cell {
		flex: 1;
		padding: 0.75rem 1rem;
		text-align: center;
		font-size: 0.9rem;
	}
	.word-cell.word-ru {
		flex: 2;
		text-align: left;
		color: #fff;
	}
	.status-cell {
		font-size: 1.2rem;
	}
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
	.pagination button {
		padding: 0.5rem 1rem;
		border: 2px solid #7a5c20;
		background: linear-gradient(to bottom, #f0d88e, #b88c3c);
		color: #3a2c0d;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
	}
	.pagination button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.pagination span {
		font-size: 1rem;
		font-weight: bold;
		color: #f8e4b2;
	}
</style>
