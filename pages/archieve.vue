<template>
	<div class="wrapper">
		<div class="top-nav">
			<NuxtLink to="/" class="nav-btn">Назад</NuxtLink>
			<NuxtLink v-if="words.length" to="/learn" class="continue-btn">Продолжить
			</NuxtLink>
		</div>
		<h2 class="title">Мои слова</h2>
		<div v-if="totalPages > 1" class="pagination">
			<button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Назад</button>
			<span>{{ currentPage }} из {{ totalPages }}</span>
			<button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Далее</button>
		</div>
		<div class="stats">
			<div class="stat-item">Всего: {{ total }}</div>
			<div class="stat-item">Выучено: {{ learned }}</div>
			<div class="stat-item">Осталось: {{ total - learned }}</div>
		</div>
		<ul v-if="words.length" class="word-list">
			<li v-for="word in paginatedWords" :key="word.de" class="word-item">
				<div class="word-info">
					<span class="de">{{ word.article }} {{ word.de }}</span>
					<span class="ru">— {{ word.ru }}</span>
				</div>
				<div class="status-icon">
					<span v-if="isLearned(word)">✅</span>
					<span v-else-if="isWrong(word)">❌</span>
					<span v-else>⏳</span>
				</div>
				<div :class="['btn',isLearned(word)? 'learned': isWrong(word)? 'wrong' : 'waiting']">
					{{ isLearned(word)
					? 'Выучено'
					: isWrong(word)
					? 'Допущена ошибка'
					: 'Не выучено' }}
				</div>
			</li>
		</ul>
		<div v-if="totalPages > 1" class="pagination">
			<button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Назад</button>
			<span>{{ currentPage }} из {{ totalPages }}</span>
			<button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Далее</button>
		</div>
		<p v-else class="no-words">Слова не выбраны.</p>
	</div>
</template>


<script setup>
	import { computed, onMounted , ref } from 'vue'
	import { userlangStore } from '../store/learningStore.js'

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
	onMounted(() => {
		store.loadFromLocal()
	})

	const words = computed(() => store.words)
	const learned = computed(() => store.learnedWords.length)
	const total = computed(() => store.words.length)

	function isLearned(word) {
		return store.isLearned(word)
	}
	function isWrong(word) {
		return store.wrongAnswers.some(w => w.de === word.de)
	}
</script>


<style scoped>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 16px;
		margin: 15px 0;
		font-size: 16px;
	}

	.pagination button {
		padding: 8px 16px;
		border: none;
		border-radius: 8px;
		background-color: #4caf50;
		color: white;
		font-weight: bold;
		cursor: pointer;
		transition: background 0.3s ease;
	}

	.pagination button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.pagination button:hover:not(:disabled) {
		background-color: #388e3c;
	}


	.wrapper {
		max-width: 800px;
		margin: auto;
		padding: 30px;
		background-color: #f9f9f9;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		font-family: 'Segoe UI', sans-serif;
	}

	.top-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.nav-btn {
		text-decoration: none;
		font-size: 16px;
		padding: 10px 16px;
		color: #4caf50;
		border: 2px solid #4caf50;
		border-radius: 8px;
		font-weight: 600;
		transition: 0.3s ease;
	}

	.nav-btn:hover {
		background-color: #4caf50;
		color: white;
	}

	.continue-btn {
		text-decoration: none;
		font-size: 14px;
		padding: 12px 20px;
		background-color: #2196f3;
		color: white;
		border-radius: 8px;
		font-weight: 600;
		transition: background-color 0.3s;
	}

	.continue-btn:hover {
		background-color: #1976d2;
	}

	.title {
		font-size: 28px;
		margin-bottom: 20px;
		text-align: center;
	}

	.stats {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
		font-weight: bold;
	}

	.stat-item {
		font-size: 14px;
	}

	.word-list {
		display: flex;
		flex-direction: column;
		position: relative;
		gap: 12px;
		width: 100%;
	}

	.word-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 20px;
		background: #fff;
		border-radius: 10px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.word-info {
		font-size: 18px;
	}

	.status-icon {
		font-size: 22px;
		width: 32px;
		text-align: center;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}

	.btn {
		padding: 8px 14px;
		border: none;
		border-radius: 8px;
		color: white;
		cursor: default;
		transition: 0.3s;
		min-width: 175px;
		text-align: center;
		font-weight: bold;
	}

	.btn.learned {
		background-color: #4caf50;
	}

	.btn.waiting {
		background-color: #aca2a2;
	}

	.btn.wrong {
		background-color: #f44336;
	}

	.no-words {
		text-align: center;
		font-size: 18px;
		color: #888;
		margin-top: 20px;
	}

	@media (max-width: 768px) {
		.word-item {
			flex-direction: column;
			gap: 10px;
		}
		.status-icon {
			display: none;
		}
		.top-nav {
			gap: 10px;
		}
	}

	@media (max-width: 768px) {
		.stats {
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}


	}
</style>

