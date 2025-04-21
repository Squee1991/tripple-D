<template>
	<div class="wrapper">
		<div class="topic__header">
			<div class="top__nav">
				<div class="action__words">
					<div v-if="words.length" class="bulk-actions">
						<button @click="addAllWords" class="start-btn bulk">Добавить все</button>
						<button @click="removeAllWords" class="start-btn bulk remove">Удалить Все</button>
					</div>
					<div class="topic__top-btns">
						<NuxtLink to="/learn" class="start-btn">
							Далее ({{ selectedWords.length }})
						</NuxtLink>
					</div>
				</div>
			</div>
			<ul v-if="words.length" class="word-list">
				<li v-for="(word, index) in paginatedWords" :key="index" class="word-item">
					<div class="word-text">{{ word.article }} {{ word.de }}/{{ word.ru }}</div>
					<button
						@click="toggleWord(word)"
						:class="['toggle-btn', isSelected(word) ? 'selected' : '']"
					>
						{{ isSelected(word) ? 'Удалить' : 'Добавить' }}
					</button>
				</li>
			</ul>
		</div>
		<div class="pagination" v-show="totalPages >= 1">
			<button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Назад</button>
			<span class="pages_pag">Страница {{ currentPage }} из {{ totalPages }}</span>
			<button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Далее</button>
		</div>
	</div>
</template>

<script setup>
	import {ref, onMounted, computed} from 'vue'
	import {userlangStore} from '../store/learningStore.js'



	const props = defineProps({
		selectedTopics: {
			type: Array,
			required: true
		}
	})
	const topics = ref([])
	const words = ref([])
	const currentTitle = ref('')
	const store = userlangStore()

	const currentPage = ref(1)
	const pageSize = 10

	const totalPages = computed(() => Math.ceil(words.value.length / pageSize))

	const paginatedWords = computed(() => {
		const start = (currentPage.value - 1) * pageSize
		return words.value.slice(start, start + pageSize)
	})

	function goToPage(page) {
		if (page >= 1 && page <= totalPages.value) {
			currentPage.value = page
		}
	}

	const selectedWords = computed(() => store.words)

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

	onMounted(async () => {
		await store.loadFromLocal()
		const res = await fetch('/words.json')
		const data = await res.json()
		if (topics.value.length) {
			const allWords = topics.value.flatMap(key => data[key] || [])
			words.value = allWords
			currentTitle.value = topics.value.map(k => nameMap[k] || k).join(', ')
		}
	})

	onMounted(() => {
		store.loadFromLocal()
	})

	function toggleWord(word) {
		if (isSelected(word)) {
			store.removeWord(word)
		} else {
			store.addWord(word)
		}
	}

	function isSelected(word) {
		return selectedWords.value.some(w => w.de === word.de)
	}

	function addAllWords() {
		const newWords = words.value.filter(word => !isSelected(word))
		newWords.forEach(word => store.addWord(word))
	}

	function removeAllWords() {
		store.words = store.words.filter(w => !words.value.some(word => word.de === w.de))
		store.saveAll()
		store.selectedTopics = store.selectedTopics.filter(topic => !topics.value.includes(topic))
		store.saveAll()
	}

	watch(() => props.selectedTopics, async (newTopics) => {
		if (newTopics.length) {
			topics.value = newTopics // 💥 ОБЯЗАТЕЛЬНО
			const res = await fetch('/words.json')
			const data = await res.json()
			const allWords = newTopics.flatMap(key => data[key] || [])
			words.value = allWords
			currentTitle.value = newTopics.map(k => nameMap[k] || k).join(', ')
			currentPage.value = 1
		} else {
			topics.value = []
			words.value = []
			currentTitle.value = ''
			currentPage.value = 1
		}
	}, { immediate: true })
	watch(words, () => {
		currentPage.value = 1
	})
	definePageMeta({
		middleware: ['auth'],
	})

</script>

<style scoped>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	.pages_pag {
		color: white;
	}

	.topic__top-btns {
		display: flex;
		justify-content: space-between;
	}

	.action__words {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 20px;
		margin-top: 30px;
		font-size: 16px;
	}

	.pagination button {
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		background-color: #4caf50;
		color: white;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.pagination button:hover:not(:disabled) {
		background-color: #388e3c;
	}

	.pagination button:disabled {
		background-color: #ccc;
		cursor: default;
	}

	.wrapper {
		max-width: 1300px;
		margin: auto;
		padding: 10px;
		border-radius: 16px;
		font-family: 'Segoe UI', sans-serif;
	}

	.back-link {
		text-decoration: none;
		font-size: 18px;
		color: #4caf50;
		border: 2px solid #4caf50;
		border-radius: 8px;
		padding: 10px 16px;
		font-weight: 600;
		transition: 0.3s ease;
	}

	.back-link:hover {
		background-color: #4caf50;
		color: white;
	}

	.top__nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 5px;
		flex-wrap: wrap;
		gap: 10px;
		min-height: 48px;
	}

	.topic {
		font-size: 26px;
		font-weight: bold;
		color: #2c3e50;
	}


	.start-btn,
	.bulk-btn {
		min-width: 120px;
		background: #4caf50;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 14px;
		padding: 10px;
		border: none;
		border-radius: 10px;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		transition: background-color 0.3s;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.start-btn:hover,
	.bulk-btn:hover {
		background-color: #388e3c;
	}

	.bulk.remove {
		background-color: #f44336;
	}

	.bulk.remove:hover {
		background-color: #d32f2f;
	}

	.word-list {
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.word-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: white;
		padding: 5px;
		border-radius: 12px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.word-item:hover {
		box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.word-text {
		font-size: 16px;
		color: #333;
		font-weight: 500;
	}

	.toggle-btn {
		width: 120px;
		background-color: #4372ff;
		color: white;
		padding: 6px 20px;
		font-size: 13px;
		font-weight: bold;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: 0.3s;
	}

	.toggle-btn:hover {
		background-color: #476bd5;
	}

	.toggle-btn.selected {
		background-color: #4caf50;
	}

	.toggle-btn.selected:hover {
		background-color: #388e3c;
	}

	.bulk-actions {
		display: flex;
		gap: 12px;
		align-items: center;
	}

	@media (max-width: 768px) {
		.wrapper {
			padding: 20px;
		}

		.topic {
			font-size: 15px;
		}

		.word-item {
			flex-direction: column;
			align-items: center;
			gap: 10px;
		}

		.word-text {
			font-size: 15px;
		}

		.toggle-btn {
			width: 100%;
			text-align: center;
		}

		.start-btn,
		.bulk-btn {
			text-align: center;
		}
	}

</style>
