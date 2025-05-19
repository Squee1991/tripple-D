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
				<button @click="currentPage--" :disabled="currentPage === 1">←</button>
				<span> {{ currentPage }} из {{ totalPages }}</span>
				<button @click="currentPage++" :disabled="currentPage === totalPages">→</button>
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

	watch(
		() => store.selectedTopics,
		(topics) => {
			if (!selectedTopic.value && topics.length > 0) {
				selectedTopic.value = topics[0]
			}
		},
		{ immediate: true }
	)

</script>

<style scoped>

	.word-table {
		display: flex;
		flex-direction: column;
		border: 1px solid #00c2ff33;
		border-radius: 10px;
		overflow: hidden;
	}

	.word-row {
		display: flex;
		border-bottom: 1px solid #00c2ff22;
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
		background: #002233;
		color: #00c2ff;
		font-weight: bold;
	}

	.topic-select {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}

	.topic-select select {
		padding: 8px 16px;
		border-radius: 10px;
		border: 1px solid #00c2ff;
		background: #1a1a1a;
		color: #00c2ff;
		font-size: 14px;
		cursor: pointer;
	}

	.selected-words {
		color: #fff;
	}

	.topic-block {
		margin-bottom: 20px;
	}
</style>
