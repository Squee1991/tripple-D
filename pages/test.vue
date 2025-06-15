<template>
	<div>
		<h1>🏠 Тема: {{ topic.title || 'Загрузка...' }}</h1>
		<div v-if="topic.levels?.length">
			<label>Уровень:</label>
			<select v-model="selectedLevel">
				<option v-for="(level, i) in topic.levels" :key="i" :value="i">Уровень {{ level.level }}</option>
			</select>
		</div>
		<div v-if="currentLevel.modules?.length && selectedModule === null" class="modules-list">
			<h2 style="margin-top: 2rem;">Выберите модуль:</h2>
			<button
				v-for="(mod, index) in currentLevel.modules"
				:key="index"
				class="module-button"
				@click="openModule(index)"
			>
				📘 Модуль {{ mod.id }}
			</button>
		</div>
		<div v-if="selectedModule !== null && currentModule.tasks?.length">
			<h2 style="margin-top: 2rem;">Задания модуля {{ currentModule.id }}</h2>
			<button @click="closeModule" style="margin-bottom:1rem;">← Назад к модулям</button>
			<div v-for="(task, index) in currentModule.tasks" :key="index" class="task-box">
				<p><strong>Задание {{ index + 1 }}:</strong></p>
				<p class="intro">✍️ Напишите правильный артикль:</p>
				<p class="question">
					{{ getQuestionText(task.question, task.answer, index) }}
				</p>
				<input
					v-model="userAnswers[index]"
					placeholder="der / die / das"
				/>
				<button @click="checkAnswer(index)">Проверить</button>
				<button @click="showCorrect[index] = true">Показать ответ</button>
				<p v-if="feedback[index] === true" class="correct">✔️ Верно!</p>
				<p v-else-if="feedback[index] === false" class="wrong">❌ Неверно</p>
				<p class="show" v-if="showCorrect[index]">
					Полное предложение: <strong>{{ task.question.replace('___', task.answer) }}</strong>
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, watch, nextTick } from 'vue'

	const topic = ref({ levels: [] })
	const selectedLevel = ref(0)
	const selectedModule = ref(null)

	const userAnswers = ref([])
	const feedback = ref([])
	const showCorrect = ref([])

	const currentLevel = computed(() => topic.value.levels?.[selectedLevel.value] || { modules: [] })
	const currentModule = computed(() =>
		selectedModule.value !== null
			? currentLevel.value.modules?.[selectedModule.value] || { tasks: [] }
			: { tasks: [] }
	)

	function updateStateArrays() {
		const count = currentModule.value?.tasks?.length || 0
		userAnswers.value = Array(count).fill('')
		feedback.value = Array(count).fill(null)
		showCorrect.value = Array(count).fill(false)
	}


	function openModule(index) {
		selectedModule.value = index
		nextTick(() => {
			updateStateArrays()
		})
	}

	function closeModule() {
		selectedModule.value = null
		userAnswers.value = []
		feedback.value = []
		showCorrect.value = []
	}

	function checkAnswer(index) {
		const userInput = userAnswers.value[index]?.trim().toLowerCase()
		const correct = currentModule.value.tasks[index].answer.toLowerCase()
		feedback.value[index] = userInput === correct
	}

	function getQuestionText(question, answer, index) {
		if (feedback.value[index] === true || showCorrect.value[index]) {
			return question.replace('___', answer)
		} else {
			return question
		}
	}

	watch(selectedLevel, closeModule)

	onMounted(async () => {
		const res = await fetch('/house.json')
		topic.value = await res.json()
	})
</script>

<style scoped>
	.task-box {
		margin: 1.5rem 0;
		padding: 1rem;
		border: 1px solid #ccc;
		border-radius: 12px;
		background: #f9f9f9;
	}
	.intro {
		font-style: italic;
		color: #555;
	}
	.question {
		font-size: 1.2rem;
		margin: 0.5rem 0;
	}
	input {
		padding: 0.4rem 0.6rem;
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}
	.correct {
		color: green;
		font-weight: bold;
	}
	.wrong {
		color: crimson;
		font-weight: bold;
	}
	.show {
		font-size: 0.95rem;
		margin-top: 0.3rem;
	}
	.modules-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1rem;
	}
	.module-button {
		padding: 0.8rem 1.5rem;
		font-size: 1.1rem;
		border-radius: 8px;
		background: #eef;
		border: 1px solid #99c;
		cursor: pointer;
		transition: 0.2s;
	}
	.module-button:hover {
		background: #dde;
	}
</style>
