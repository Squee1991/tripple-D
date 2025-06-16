<script setup>
	import {useTrainerStore} from '../store/themenProgressStore.js'
	import {useRouter} from 'vue-router'
	import {ref, onMounted, computed} from 'vue'

	const router = useRouter()
	const trainer = useTrainerStore()
	const correctAnswers = ref(0)
	const loading = ref(true)
	const current = ref(0)
	const userAnswer = ref('')
	const feedback = ref(null)
	const finished = ref(false)
	const isChecked = ref(false)
	const tasks = computed(() => trainer.selectedModule?.tasks || [])
	const progressPercent = computed(() => ((current.value + (finished.value ? 1 : 0)) / tasks.value.length) * 100)
	const visibleSentence = computed(() => {
		const task = tasks.value[current.value]
		if (feedback.value !== null) {
			return task.question.replace('___', task.answer)
		}
		return task.question
	})
	const check = () => {
		const task = tasks.value[current.value]
		const correct = task.answer
		const isCorrect = userAnswer.value.trim().toLowerCase() === correct
		feedback.value = isCorrect
		isChecked.value = true

		if (isCorrect) correctAnswers.value += 1
	}

	const next = async () => {
		feedback.value = null
		userAnswer.value = ''
		isChecked.value = false

		if (current.value < tasks.value.length - 1) {
			current.value++
		} else {
			finished.value = true
			if (correctAnswers.value === tasks.value.length) {
				const moduleId = trainer.selectedModule.id
				if (!trainer.completedModules.includes(moduleId)) {
					trainer.completedModules.push(moduleId)
					await trainer.saveProgress()
				}
			}
			correctAnswers.value = 0
		}
	}


	const exit = () => {
		router.push('/choiceTheme')
	}

	onMounted(async () => {
		if (!trainer.selectedModule) {
			await trainer.loadProgress()
		}
		loading.value = false
	})
</script>

<template>
	<main class="trainer">
		<section v-if="loading" class="trainer__loading">
			<p class="trainer__loading-text">Загрузка...</p>
		</section>

		<section v-else>
			<div v-if="trainer.selectedModule" class="trainer__container">
				<header class="trainer__header">
					<h1 class="trainer__title">{{ trainer.selectedModule.title }}</h1>
					<h2 class="trainer__subtitle">Задание {{ current + 1 }} из {{ tasks.length }}</h2>
				</header>

				<div class="trainer__progress-wrapper">
					<div class="trainer__progress-fill" :style="{ width: progressPercent + '%' }"></div>
				</div>

				<div v-if="!finished" class="trainer__task">
					<p class="trainer__question"
					   :class="{ 'trainer__question--correct': feedback === true }"
					>
						{{ visibleSentence }}
					</p>
					<label class="trainer__label">
						<input v-model="userAnswer" class="trainer__input" @keyup.enter="check"
						       placeholder="Введите ответ"/>
					</label>
					<button v-if="!isChecked" class="trainer__button" @click="check">Проверить</button>
					<button v-else class="trainer__button" @click="next">Далее</button>

					<p v-if="feedback === true" class="trainer__feedback trainer__feedback--success">Верно!</p>
					<p v-if="feedback === false" class="trainer__feedback trainer__feedback--error">
						Неверно. Правильный ответ: {{ tasks[current].answer }}
					</p>
				</div>

				<div v-else class="trainer__complete">
					<h3 class="trainer__complete-title">Модуль пройден!</h3>
					<button class="trainer__button" @click="exit">Назад к выбору</button>
				</div>
			</div>

			<div v-else class="trainer__error">
				<p class="trainer__error-text">Модуль не найден</p>
			</div>
		</section>
	</main>
</template>

<style scoped>
	.trainer {
		padding: 20px;
		font-family: Arial, sans-serif;
	}

	.trainer__header {
		margin-bottom: 16px;
	}

	.trainer__title {
		font-size: 24px;
		margin-bottom: 8px;
	}

	.trainer__subtitle {
		font-size: 18px;
		color: #555;
	}

	.trainer__question--correct {
		color: green;
		font-weight: bold;
	}

	.trainer__progress-wrapper {
		width: 30%;
		height: 14px;
		background: #eee;
		border-radius: 15px;
		overflow: hidden;
		margin-bottom: 20px;
	}

	.trainer__progress-fill {
		height: 100%;
		background: #4caf50;
		width: 0%;
		transition: 1s;
		border-radius: 15px;
	}

	.trainer__task,
	.trainer__complete,
	.trainer__error {
		margin-top: 20px;
	}

	.trainer__question {
		font-size: 16px;
		margin-bottom: 10px;
	}

	.trainer__label {
		display: block;
		margin-bottom: 10px;
	}

	.trainer__input {
		width: 100%;
		padding: 8px;
		font-size: 16px;
		box-sizing: border-box;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.trainer__button {
		padding: 8px 16px;
		font-size: 16px;
		background-color: #4caf50;
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.3s;
	}

	.trainer__button:hover {
		background-color: #45a049;
	}

	.trainer__feedback {
		margin-top: 10px;
		font-weight: bold;
	}

	.trainer__feedback--success {
		color: green;
	}

	.trainer__feedback--error {
		color: red;
	}

	.trainer__loading-text,
	.trainer__error-text,
	.trainer__complete-title {
		font-size: 18px;
		text-align: center;
	}
</style>
