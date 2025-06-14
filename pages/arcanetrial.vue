<template>
	<div class="arcane-container">
		<div v-if="!selectedTheme">
			<h2 class="title">{{ levels[currentLevel].name }}: Выбери тему</h2>
			<ul class="level-list">
				<li v-for="(theme, index) in levels[currentLevel].themes" :key="index">
					<button @click="selectTheme(theme, index)">{{ theme.name }}</button>
				</li>
			</ul>
		</div>

		<div v-else-if="current < selectedTheme.trials.length" class="trial-block">
			<h2 class="title">🧙 Испытание {{ current + 1 }}: {{ selectedTheme.trials[current].name }}</h2>
			<p class="description">{{ selectedTheme.trials[current].description }}</p>

			<div v-if="selectedTheme.trials[current].type === 'correct'" class="question">
				Исправь фразу:
				<br />
				<span class="original">{{ selectedTheme.trials[current].question }}</span>
			</div>

			<div class="input-block">
				<input v-model="userCorrection" class="correction-input" />
				<button @click="submitCorrection">Применить</button>
			</div>

			<div v-if="feedback" class="feedback">{{ feedback }}</div>
		</div>

		<div v-else class="result-block">
			<h2 class="final-title">✨ Тема завершена!</h2>
			<p class="final-score">Ты набрал {{ score }} из {{ selectedTheme.trials.length }} очков.</p>
			<p class="rank" :class="{ success: score >= 2, fail: score < 2 }">
				{{ score >= 2 ? 'Ты готов к следующему уровню!' : 'Повтори тему и попробуй снова.' }}
			</p>
			<button @click="nextThemeOrLevel">Продолжить</button>
		</div>
	</div>
</template>

<script setup>
	import { ref } from 'vue'

	const current = ref(0)
	const score = ref(0)
	const feedback = ref('')
	const userCorrection = ref('')
	const selectedTheme = ref(null)
	const selectedThemeIndex = ref(null)
	const currentLevel = ref(0)

	const levels = [
		{
			name: 'Уровень 1',
			themes: [
				{
					name: 'Животные',
					trials: [
						{ name: 'Кот', type: 'correct', question: 'Das Katze schläft.', correct: 'Die Katze schläft.', description: 'Исправь артикль для слова "кошка".' },
						{ name: 'Пёс', type: 'correct', question: 'Ich sehe die Hund.', correct: 'Ich sehe den Hund.', description: 'Исправь артикль в винительном падеже.' },
						{ name: 'Медведь', type: 'correct', question: 'Der Bär ist stark.', correct: 'Der Bär ist stark.', description: 'Здесь всё верно. Не ошибись!' }
					]
				},
				{
					name: 'Мебель',
					trials: [
						{ name: 'Стул', type: 'correct', question: 'Ich sitze auf das Stuhl.', correct: 'Ich sitze auf dem Stuhl.', description: 'Исправь падеж после предлога.' },
						{ name: 'Лампа', type: 'correct', question: 'Der Lampe ist hell.', correct: 'Die Lampe ist hell.', description: 'Проверь род существительного.' },
						{ name: 'Стол', type: 'correct', question: 'Ich kaufe eine Tisch.', correct: 'Ich kaufe einen Tisch.', description: 'Артикль в винительном падеже мужского рода.' }
					]
				}
			]
		},
		{
			name: 'Уровень 2',
			themes: [
				{
					name: 'Профессии',
					trials: [
						{ name: 'Учитель', type: 'correct', question: 'Der Lehrerinnen sind nett.', correct: 'Die Lehrerinnen sind nett.', description: 'Множественное число женского рода.' },
						{ name: 'Инженер', type: 'correct', question: 'Ich sehe die Ingenieur.', correct: 'Ich sehe den Ingenieur.', description: 'Исправь винительный падеж.' },
						{ name: 'Доктор', type: 'correct', question: 'Das Arzt hilft.', correct: 'Der Arzt hilft.', description: 'Род существительного — мужской.' }
					]
				}
			]
		}
	]

	function selectTheme(theme, index) {
		selectedTheme.value = theme
		selectedThemeIndex.value = index
		current.value = 0
		score.value = 0
		userCorrection.value = theme.trials[0].question
	}

	function submitCorrection() {
		const correct = selectedTheme.value.trials[current.value].correct.trim()
		const cleaned = userCorrection.value.trim()
		if (cleaned === correct) {
			score.value++
			feedback.value = '✨ Верно! Магия восстановлена.'
		} else {
			feedback.value = '❌ Неверно. Искажение сохраняется.'
		}
		setTimeout(() => {
			feedback.value = ''
			current.value++
			if (current.value < selectedTheme.value.trials.length) {
				userCorrection.value = selectedTheme.value.trials[current.value].question
			}
		}, 1500)
	}

	function nextThemeOrLevel() {
		const themes = levels[currentLevel.value].themes
		if (selectedThemeIndex.value < themes.length - 1) {
			selectTheme(themes[selectedThemeIndex.value + 1], selectedThemeIndex.value + 1)
		} else {
			currentLevel.value++
			selectedTheme.value = null
			selectedThemeIndex.value = null
		}
	}
</script>

<style scoped>
	.arcane-container {
		max-width: 700px;
		margin: auto;
		padding: 2rem;
		background: #1e1e2f;
		color: #eee;
		border-radius: 1rem;
		font-family: 'Georgia', serif;
		box-shadow: 0 0 10px #8f5;
	}
	.title {
		font-size: 1.6rem;
		margin-bottom: 0.5rem;
		color: #aaf;
	}
	.description {
		font-style: italic;
		margin-bottom: 1rem;
	}
	.question {
		font-size: 1.3rem;
		margin-bottom: 0.5rem;
		text-align: center;
	}
	.original {
		display: inline-block;
		margin-top: 0.5rem;
		font-weight: bold;
		color: #ffc;
	}
	.input-block {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-bottom: 1rem;
	}
	button {
		padding: 0.5rem 1rem;
		background: #333;
		color: #fff;
		border: 2px solid #8f5;
		border-radius: 0.5rem;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	button:hover {
		background: #8f5;
		color: #000;
	}
	.correction-input {
		padding: 0.5rem;
		border-radius: 0.4rem;
		border: 1px solid #aaa;
		font-size: 1rem;
		width: 60%;
	}
	.feedback {
		text-align: center;
		font-weight: bold;
		font-size: 1.2rem;
		color: #ff9;
	}
	.result-block {
		text-align: center;
	}
	.final-title {
		font-size: 1.6rem;
		margin-bottom: 0.5rem;
	}
	.final-score {
		margin-bottom: 1rem;
	}
	.rank.success {
		color: #8f5;
		font-weight: bold;
	}
	.rank.fail {
		color: #f55;
		font-weight: bold;
	}
	.level-list {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-align: center;
	}
	.level-list button {
		padding: 0.7rem 1.5rem;
		font-size: 1.1rem;
		background: #222;
		border: 2px solid #8f5;
		color: #eee;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.level-list button:hover {
		background: #8f5;
		color: #000;
	}
</style>
