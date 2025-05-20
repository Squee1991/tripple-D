<template>
	<div class="wrapper">
		<div v-if="!finished && filteredWords.length" class="exercise-wrapper">
			<NuxtLink to="/" class="back-link">← Назад</NuxtLink>
			<div v-if="currentWord">
				<h2 class="word-counter">Слово {{ currentIndex + 1 }} из {{ total }}</h2>
				<p><strong>слово:</strong> {{ currentWord.ru }}</p>
				<div v-if="currentMode === 'wordArticle'" class="exercise">
					<p>Впишите артикль и слово на немецком:</p>
					<input v-model="userInput" class="input-field"/>
					<button @click="checkAnswer" class="check-button">Проверить</button>
					<p v-if="result === 'correct'" class="result correct">✅ Верно!</p>
					<p v-else-if="result === 'wrong'" class="result wrong">
						❌ Правильно: {{ currentWord.article }} {{ currentWord.de }}
					</p>
				</div>
				<div v-if="currentMode === 'article'" class="exercise">
					<p>Впишите артикль слова : <span class="current__word"> {{currentWord.de}}</span></p>
					<input v-model="userInput" class="input-field"/>
					<button @click="checkAnswer" class="check-button">Проверить</button>
					<p v-if="result === 'correct'" class="result correct">✅ Верно!</p>
					<p v-else-if="result === 'wrong'" class="result wrong">
						❌ Правильно: {{ currentWord.article }}
					</p>
				</div>
				<div v-if="currentMode === 'plural'" class="exercise">
					<p>Впишите форму множественного числа: {{ currentWord.de }}</p>
					<input v-model="userInput" class="input-field"/>
					<button @click="checkAnswer" class="check-button">Проверить</button>
					<p v-if="result === 'correct'" class="result correct">✅ Верно!</p>
					<p v-else-if="result === 'wrong'" class="result wrong">
						❌ Правильно: {{ currentWord.plural }}
					</p>
				</div>
				<div v-if="currentMode === 'audio'" class="exercise">
					<p>Слушайте слово и напишите его:</p>
					<button @click="speakWord(currentWord.de)" class="check-button">Прослушать</button>
					<input v-model="userInput" class="input-field"/>
					<button @click="checkAnswer" class="check-button">Проверить</button>
					<p v-if="result === 'correct'" class="result correct">✅ Верно!</p>
					<p v-else-if="result === 'wrong'" class="result wrong">
						❌ Правильно: {{ currentWord.de }}
					</p>
				</div>
				<div v-if="currentMode === 'letters'" class="exercise">
					<p>Соберите слово из букв: <span class="current__word">{{ currentWord.article }}</span></p>

					<div class="letters">
						<button
							v-for="(letter, index) in shuffledLetters"
							:key="index"
							@click="addLetter(letter, index)"
							:disabled="usedIndices.includes(index)"
							class="make__word"
						>
							{{ letter === ' ' ? '␣' : letter }}
						</button>
					</div>
					<input v-model="userInput" class="input-field"/>
					<button @click="checkAnswer" class="check-button">Проверить</button>
					<p v-if="result === 'correct'" class="result correct">✅ Верно!</p>
					<p v-else-if="result === 'wrong'" class="result wrong">
						❌ Правильно: {{ currentWord.de }}
					</p>
				</div>
			</div>
		</div>

		<div v-else class="completion-wrapper">
			<div class="completion-message">
				<h2 class="congrats-title">Молодец!</h2>
				<p class="congrats-subtitle">Вы завершили все упражнения 👏</p>
				<div class="completion-buttons">
					<NuxtLink to="/" class="completion-btn home">🏠 Вернуться к темам</NuxtLink>
					<button v-if="store.wrongAnswers.length" @click="repeatWrongAnswers" class="completion-btn retry">🔁
						Повторить ошибки
					</button>
					<button @click="restart" class="completion-btn restart">🔄 Пройти снова</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref, computed, watch, onMounted} from 'vue'
	import {useRoute} from 'vue-router'
	import {userlangStore} from '../store/learningStore.js'
	const store = userlangStore()
	const route = useRoute()
	const selectedModes = ref(route.query.mode || [])
	if (typeof selectedModes.value === 'string') {
		selectedModes.value = [selectedModes.value]
	}
	const filteredWords = computed(() =>
		store.words.filter(word =>
			word.topic === store.currentTopic && !isWordLearned(word)
		)
	)
	const total = computed(() => filteredWords.value.length)
	const currentIndex = ref(0)
	const currentModeIndex = ref(0)
	const userInput = ref('')
	const result = ref('')
	const usedIndices = ref([])
	const finished = ref(false)

	const currentWord = computed(() => filteredWords.value[currentIndex.value] || null)
	const currentMode = computed(() => selectedModes.value[currentModeIndex.value])
	const shuffledLetters = computed(() => {
		if (!currentWord.value) return []
		return currentWord.value.de.split('').sort(() => Math.random() - 0.5)
	})

	function speakWord(text) {
		const utterance = new SpeechSynthesisUtterance(text)
		utterance.lang = 'de-DE'
		speechSynthesis.speak(utterance)
	}

	function addLetter(letter, index) {
		const position = usedIndices.value.indexOf(index)

		if (position !== -1) {
			usedIndices.value.splice(position, 1)
			userInput.value =
				userInput.value.slice(0, position) + userInput.value.slice(position + 1)
		} else {
			userInput.value += letter
			usedIndices.value.push(index)
		}
	}

	function isWordLearned(word) {
		return selectedModes.value.every(mode => word.progress?.[mode] === true)
	}

	function checkAnswer() {
		let correct = ''
		switch (currentMode.value) {
			case 'wordArticle':
				correct = `${currentWord.value.article} ${currentWord.value.de}`
				break
			case 'article':
				correct = currentWord.value.article
				break
			case 'plural':
				correct = currentWord.value.plural
				break
			default:
				correct = currentWord.value.de
		}

		const normalize = (text) => text.trim().toLowerCase().replace(/\s+/g, ' ')
		const input = normalize(userInput.value)
		const correctAnswer = normalize(correct)

		const isCorrect = input === correctAnswer
		result.value = isCorrect ? 'correct' : 'wrong'

		setTimeout(async () => {
			await store.markProgress(currentWord.value, currentMode.value, isCorrect)

			if (isCorrect) {
				if (isWordLearned(currentWord.value)) {
					await store.markAsLearned(currentWord.value)
				}
			} else {
				await store.addWrongAnswers(currentWord.value)
			}

			nextExercise()
		}, 800)
	}



	function nextExercise() {
		result.value = ''
		userInput.value = ''
		usedIndices.value = []
		if (currentModeIndex.value < selectedModes.value.length - 1) {
			currentModeIndex.value++
		} else {
			currentModeIndex.value = 0
			currentIndex.value++
		}
		if (currentIndex.value >= filteredWords.value.length) {
			finished.value = true
		}
	}

	function repeatWrongAnswers() {
		currentIndex.value = 0
		currentModeIndex.value = 0
		result.value = ''
		userInput.value = ''
		usedIndices.value = []
		store.words = store.wrongAnswers.filter(w =>
			selectedModes.value.some(mode => !w.progress?.[mode])
		)
		store.cleanWrongAnswers()
		finished.value = false
	}

	function restart() {
		currentIndex.value = 0
		currentModeIndex.value = 0
		userInput.value = ''
		usedIndices.value = []
		result.value = ''
		finished.value = false

		store.words = store.words.filter(w =>
			selectedModes.value.some(mode => !w.progress?.[mode])
		)
	}

	watch(currentMode, (newMode) => {
		if (newMode === 'audio' && currentWord.value?.de) {
			speakWord(currentWord.value.de)
		}
	})

	watch(userInput, (newVal, oldVal) => {
		if (currentMode.value !== 'letters') return
		const diff = oldVal.length - newVal.length
		if (diff > 0) {
			usedIndices.value.splice(newVal.length, diff)
		}
	})

	onMounted(async () => {
		await store.loadFromFirebase()

		if (route.query.topic) {
			store.currentTopic = route.query.topic
		}

		if (route.query.mode) {
			const mode = route.query.mode
			selectedModes.value = Array.isArray(mode) ? mode : [mode]
		}
	})
	definePageMeta({
		middleware: ['auth'],
	})
</script>

<style scoped>
	@import url('https://fonts.googleapis.com/css2?family=Uncial+Antiqua&display=swap');

	.wrapper {
		max-width: 1000px;
		margin: auto;
		padding: 40px 20px;
		font-family: 'Uncial Antiqua', cursive;
		color: #f2ecff;
		background: #120026;
		border-radius: 20px;
		box-shadow: 0 0 20px #39076e55;
	}

	.exercise-wrapper {
		background: #1b0033;
		border-radius: 16px;
		padding: 30px;
		box-shadow: 0 0 20px #6a1b9a55;
	}

	.back-link {
		color: #cfaaff;
		font-size: 16px;
		padding: 10px 16px;
		background: none;
		border: 1px solid #7c4dff;
		border-radius: 8px;
		text-decoration: none;
		transition: 0.3s;
		display: inline-block;
		margin-bottom: 20px;
	}

	.back-link:hover {
		background: #7c4dff;
		color: white;
	}

	.word-counter {
		font-size: 24px;
		color: #ffe082;
		text-align: center;
		margin-bottom: 20px;
	}

	.current__word {
		color: #ffd700;
		font-size: 20px;
		font-weight: bold;
	}

	.exercise {
		text-align: center;
		margin-top: 20px;
	}

	.input-field {
		width: 100%;
		padding: 12px;
		font-size: 18px;
		border: 1px solid #7c4dff;
		border-radius: 10px;
		background: #25003d;
		color: white;
		margin: 15px 0;
	}

	.input-field:focus {
		outline: none;
		box-shadow: 0 0 10px #9575cd;
	}

	.check-button {
		background-color: #7c4dff;
		color: white;
		font-size: 16px;
		padding: 10px 24px;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		font-weight: bold;
		margin-top: 10px;
	}

	.check-button:hover {
		background-color: #9b5de5;
	}

	.letters {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		margin-bottom: 20px;
	}

	.make__word {
		width: 44px;
		height: 56px;
		font-size: 20px;
		background: #311b92;
		color: white;
		border-radius: 6px;
		border: none;
		cursor: pointer;
	}

	.make__word:disabled {
		background: #5e35b1;
		color: #ccc;
	}

	.result {
		font-size: 18px;
		margin-top: 12px;
		font-weight: bold;
	}

	.correct {
		color: #00e676;
	}

	.wrong {
		color: #ff5252;
	}

	.completion-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40px 20px;
	}

	.completion-message {
		background: #1e0030;
		border-radius: 18px;
		padding: 40px;
		text-align: center;
		box-shadow: 0 0 20px #4a148c77;
	}

	.congrats-title {
		font-size: 30px;
		color: #ffd54f;
	}

	.congrats-subtitle {
		font-size: 18px;
		color: #d1c4e9;
	}

	.completion-buttons {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-top: 24px;
	}

	.completion-btn {
		font-size: 16px;
		padding: 12px 0;
		border-radius: 10px;
		font-weight: bold;
		border: none;
		color: white;
		cursor: pointer;
		min-width: 240px;
	}

	.completion-btn.home {
		background: #1976d2;
	}

	.completion-btn.retry {
		background: #f57c00;
	}

	.completion-btn.restart {
		background: #43a047;
	}

	.completion-btn:hover {
		opacity: 0.9;
	}
</style>




