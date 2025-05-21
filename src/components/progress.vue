<template>
	<div class="selected-words">
		<div class="selected-words">
			<div>
				<div class="topic-select">
					<select v-model="selectedTopic" :disabled="store.selectedTopics.length === 0">
						<option
							v-for="topic in store.selectedTopics"
							:key="topic"
							:value="topic"
						>
							{{ topic }}
						</option>
					</select>
				</div>
				<div v-for="topic in filteredTopics" :key="topic" class="topic-block">
					<div class="word-table">
						<div class="word-row header">
							<div class="word-cell word-ru">Слово</div>
							<div v-for="mode in learningModes" :key="mode.key" class="word-cell">
								{{ mode.label }}
							</div>
						</div>
						<div
							v-for="word in paginatedWords(topic)"
							:key="word.de"
							class="word-row">
							<div class="word-cell word-ru">{{ word.ru }}</div>
							<div v-for="mode in learningModes" :key="mode.key" class="word-cell">
							<span :style="{color: word.progress?.[mode.key] === true ? '#00ff99' :
							 word.progress?.[mode.key] === false ? '#ff6666' : '#cccccc'
							}">{{word.progress?.[mode.key] === true ? '✅' : word.progress?.[mode.key] === false ? '❌' : '⏳'}}
							</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="pagination" v-if="store.words.length > wordsPerPage">
				<button @click="currentPage--" :disabled="currentPage === 1">назад</button>
				<span> {{ currentPage }} из {{ totalPages }}</span>
				<button @click="currentPage++" :disabled="currentPage === totalPages">вперед</button>
			</div>
		</div>
	</div>
</template>
<script setup>
	import {userlangStore} from '../../store/learningStore.js'

	const store = userlangStore()
	const selectedMode = ref('article')
	const selectedTopic = ref('')
	const currentPage = ref(1)
	const wordsPerPage = 7

	const paginatedWords = (topic) => {
		return store.words
		.filter(w => w.topic === topic)
		.slice((currentPage.value - 1) * wordsPerPage, currentPage.value * wordsPerPage)
	}

	const totalPages = computed(() => {
		return Math.ceil(store.words.filter(w => !selectedTopic.value || w.topic === selectedTopic.value).length / wordsPerPage)
	})

	const learningModes = ref([
		{key: 'article', label: 'Вписать артикль'},
		{key: 'letters', label: 'Собрать слово'},
		{key: 'wordArticle', label: 'Слово и артикль'},
		{key: 'audio', label: 'Аудирование'},
		{key: 'plural', label: 'Форма мн.ч.'}
	])

	const filteredTopics = computed(() => {
		return selectedTopic.value
			? [selectedTopic.value]
			: store.selectedTopics
	})

	watch(() => store.selectedTopics, (topics) => {
			if (!selectedTopic.value && topics.length > 0) {
				selectedTopic.value = topics[0]
			}
		},
		{immediate: true}
	)

	watch(selectedTopic, () => {
		currentPage.value = 1
	})

</script>

<style scoped>

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		margin-top: 2rem;
		font-family: 'Cinzel', serif;
	}

	.pagination button {
		background: linear-gradient(to bottom, #f0d88e, #b88c3c);
		color: #3a2c0d;
		border: 2px solid #7a5c20;
		border-radius: 12px;
		padding: 8px 20px;
		font-size: 16px;
		cursor: pointer;
		box-shadow: 0 0 8px #000;
		transition: all 0.2s ease;
		font-weight: bold;
		text-transform: uppercase;
	}

	.pagination button:hover:not(:disabled) {
		box-shadow: 0 0 2px #ffd700;
	}

	.pagination button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.pagination span {
		color: #f8e4b2;
		font-size: 16px;
		font-weight: bold;
		text-shadow: 0 0 4px #000;
	}


	.word-table {
		display: flex;
		flex-direction: column;
		border: 2px solid #c29f52;
		border-radius: 12px;
		overflow: hidden;
		background: #1e1a14;
		box-shadow: 0 0 12px #000 inset;
	}

	.word-row {
		display: flex;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		background: linear-gradient(to right, #2a251d, #1c1a17);
	}

	.word-row:last-child {
		border-bottom: none;
	}

	.word-cell {
		flex: 1;
		padding: 10px 12px;
		text-align: center;
		color: #ccc;
		font-size: 14px;
	}

	.word-ru {
		text-align: left;
		color: #fff;
		font-weight: 500;
	}

	.word-row.header {
		background: linear-gradient(to right, #3b2c19, #5b442d);
		color: #f8d369;
		font-weight: bold;
		font-size: 15px;
		border-bottom: 2px solid #d1a54d;
	}

	.topic-select {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}

	.topic-select select {
		padding: 10px 20px;
		border-radius: 12px;
		border: 2px solid #d1a54d;
		background: #2f261c;
		color: #f8e4b2;
		font-size: 15px;
		box-shadow: 0 0 6px #000 inset;
		cursor: pointer;
		transition: 0.2s ease;
	}

	.selected-words {
		color: #fff;
		padding: 2rem;
		background: linear-gradient(135deg, #151210, #2c2b26);
		border-radius: 12px;
		box-shadow: inset 0 0 20px #000;
	}

	.topic-block {
		margin-bottom: 30px;
	}
</style>
