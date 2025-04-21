<template>
	<div class="wrapper">
		<div class="top-bar">
			<NuxtLink
				:to="{ path: '/', query: $route.query }"
				class="back-link">← Назад</NuxtLink>
			<p class="counter">Слов, которые нужно выучить: {{ unlearnedWordsCount }}</p>
		</div>
		<h2 class="title">Выбери способ обучения:</h2>
		<form class="modes">
			<label v-for="mode in availableModes" :key="mode.value" class="mode-item">
				<input
					type="checkbox"
					:value="mode.value"
					v-model="selectedModes"
					class="checkbox"
				/>
				<span class="mode-label">{{ mode.label }}</span>
			</label>
		</form>

		<button
			@click="startTraining"
			:disabled="!selectedModes.length || unlearnedWordsCount === 0"
			class="start-button"
		>
			🚀 Начать
		</button>
	</div>
</template>


<script setup>
	import { ref, computed, onMounted } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { userlangStore } from '../store/learningStore.js'


	const route = useRoute()
	const router = useRouter()
	const store = userlangStore()

	const selectedModes = ref([])

	const availableModes = [
		{ value: 'article+word', label: 'Вписать артикль + слово' },
		{ value: 'article', label: 'Вписать только артикль' },
		{ value: 'letters', label: 'Собрать слово из букв' },
		{ value: 'plural', label: 'Вписать форму мн. числа' },
		{ value: 'audio', label: 'Аудирование' }
	]

	const unlearnedWordsCount = computed(() =>
		store.words.filter(word => !store.isLearned(word)).length
	)

	function startTraining() {
		const query = new URLSearchParams()
		selectedModes.value.forEach(mode => query.append('mode', mode))
		router.push(`/session?${query.toString()}`)
	}

	onMounted(() => {
		store.loadFromLocal()

		if (route.query.mode) {
			selectedModes.value = Array.isArray(route.query.mode)
				? route.query.mode
				: [route.query.mode]
		}
	})
	definePageMeta({
		middleware: ['auth'],
	})
</script>


<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	.wrapper {
		max-width: 600px;
		margin: auto;
		padding: 30px;
		background-color: #f4f7fc;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		text-align: center;
		font-family: 'Segoe UI', sans-serif;
	}

	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.back-link {
		text-decoration: none;
		font-size: 16px;
		color: #fff;
		background-color: #4caf50;
		padding: 10px 16px;
		border-radius: 8px;
		transition: background-color 0.3s;
	}

	.back-link:hover {
		background-color: #45a049;
	}

	.counter {
		font-size: 16px;
		color: #555;
	}

	.title {
		font-size: 24px;
		font-weight: bold;
		color: #333;
		margin-bottom: 20px;
	}

	.modes {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-bottom: 30px;
	}

	.mode-item {
		display: flex;
		align-items: center;
		font-size: 18px;
		color: #333;
		cursor: pointer;
	}

	.checkbox {
		width: 20px;
		height: 20px;
		margin-right: 10px;
		cursor: pointer;
	}

	.mode-label {
		cursor: pointer;
	}

	.start-button {
		background-color: #4caf50;
		color: white;
		font-size: 18px;
		padding: 14px 28px;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		width: 100%;
		transition: background-color 0.3s;
	}

	.start-button:hover {
		background-color: #45a049;
	}

	.start-button:disabled {
		background-color: #bdbdbd;
		cursor: not-allowed;
	}

	.start-button:disabled:hover {
		background-color: #bdbdbd;
	}

	@media (max-width: 768px) {
		.wrapper {
			padding: 20px;
		}

		.title {
			font-size: 22px;
		}

		.counter {
			font-size: 14px;
		}
	}
</style>

