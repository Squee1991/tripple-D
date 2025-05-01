<template>
	<div class="howtolearn-wrapper">
		<h1 class="page-title">Выберите режимы обучения</h1>

		<div class="checkbox-group">
			<label v-for="mode in modes" :key="mode.key" class="checkbox-wrapper">
				<input
					type="checkbox"
					v-model="selectedModes"
					:value="mode.key"
				/>
				<span class="checkbox-label">{{ mode.label }}</span>
			</label>
		</div>

		<button
			class="next-button"
			:disabled="!selectedModes.length"
			@click="startLearning"
		>
			Начать
		</button>
	</div>
</template>

<script setup>
	import { ref } from 'vue'
	import { useRouter } from 'vue-router'

	const router = useRouter()
	const selectedModes = ref([])

	const modes = [
		{ key: 'article', label: 'Вписать артикль' },
		{ key: 'letters', label: 'Собрать слово по буквам' },
		{ key: 'word', label: 'Вписать слово' },
		{ key: 'wordArticle', label: 'Вписать слово и артикль' },
		{ key: 'plural', label: 'Форма множественного числа' }
	]

	const startLearning = () => {
		router.push({
			path: '/session',
			query: {
				mode: selectedModes.value
			}
		})
	}
</script>

<style scoped>
	.howtolearn-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 40px;
		background: #0b0f1e;
		color: white;
		font-family: 'Segoe UI', sans-serif;
	}

	.page-title {
		font-size: 28px;
		color: #00ffff;
		margin-bottom: 30px;
		text-align: center;
	}

	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: 15px;
		width: 100%;
		max-width: 400px;
	}

	.checkbox-wrapper {
		display: flex;
		align-items: center;
		gap: 12px;
		background: #1e263c;
		padding: 12px 16px;
		border-radius: 10px;
		cursor: pointer;
		transition: background 0.3s;
	}

	.checkbox-wrapper:hover {
		background: #293147;
	}

	.checkbox-label {
		font-size: 18px;
		color: #ffffff;
	}

	input[type="checkbox"] {
		width: 18px;
		height: 18px;
		accent-color: #00ffff;
		cursor: pointer;
	}

	.next-button {
		margin-top: 30px;
		padding: 12px 24px;
		font-size: 18px;
		background: #00ffff44;
		color: white;
		border: 1px solid #00ffffaa;
		border-radius: 8px;
		cursor: pointer;
		transition: background 0.3s;
	}

	.next-button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.next-button:hover:enabled {
		background: #00ffff88;
	}
</style>
