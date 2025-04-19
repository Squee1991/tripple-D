<template>
	<div class="wrapper">
		<div v-if="!finished && filteredWords.length" class="exercise-wrapper">
			<NuxtLink to="/" class="back-link">← Назад</NuxtLink>
			<div v-if="currentWord">
				<h2 class="word-counter">Слово {{ currentIndex + 1 }} из {{ total }}</h2>
				<p><strong>слово:</strong> {{ currentWord.ru }}</p>
				<div v-if="currentMode === 'article+word'" class="exercise">
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

	const filteredWords = computed(() => store.words.filter(word => !store.isLearned(word)))
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
		if (usedIndices.value.includes(index)) return
		userInput.value += letter
		usedIndices.value.push(index)
	}

	function checkAnswer() {
		let correct = ''
		switch (currentMode.value) {
			case 'article+word':
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

		const input = userInput.value.trim().toLowerCase()
		correct = correct.trim().toLowerCase()

		result.value = input === correct ? 'correct' : 'wrong'

		if (result.value === 'correct') {
			store.markAsLearned(currentWord.value)
		} else {
			store.addWrongAnswers(currentWord.value)
		}

		setTimeout(nextExercise, 1500)
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
		store.words = [...store.wrongAnswers]
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
	}

	watch(currentMode, (newMode) => {
		if (newMode === 'audio' && currentWord.value?.de) {
			speakWord(currentWord.value.de)
		}
	})

	watch(userInput, (newVal) => {
		if (currentMode.value !== 'letters') return
		usedIndices.value = []
		const inputLetters = newVal.split('')
		const availableIndices = shuffledLetters.value.map((_, i) => i)
		for (const letter of inputLetters) {
			const index = availableIndices.find(i =>
				shuffledLetters.value[i]?.toLowerCase() === letter.toLowerCase() &&
				!usedIndices.value.includes(i)
			)
			if (index !== undefined && index !== -1) {
				usedIndices.value.push(index)
				availableIndices.splice(availableIndices.indexOf(index), 1)
			}
		}
	})

	onMounted(()=> {
		store.loadFromLocal()
	})
</script>

<style scoped>
	.wrapper {
		max-width: 1200px;
		margin: auto;
		padding: 30px 20px;
		font-family: 'Segoe UI', sans-serif;
	}

	.current__word {
		font-size: 22px;
		color: #6262e7;
		font-weight: 600;
	}

	.exercise-wrapper {
		max-width: 800px;
		margin: auto;
		padding: 10px;
		background-color: #f9f9f9;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	}

	.back-link {
		display: inline-block;
		margin-bottom: 20px;
		text-decoration: none;
		font-size: 18px;
		color: #4caf50;
		border: 2px solid #4caf50;
		border-radius: 8px;
		padding: 10px 16px;
		font-weight: 600;
		transition: 0.3s;
	}

	.back-link:hover {
		background-color: #4caf50;
		color: white;
	}

	.word-counter {
		font-size: 26px;
		margin-bottom: 20px;
		text-align: center;
		color: #333;
		font-weight: bold;
	}

	.exercise {
		text-align: center;
	}

	.input-field {
		width: 100%;
		padding: 12px;
		font-size: 18px;
		border-radius: 10px;
		border: 1px solid #ccc;
		margin: 15px 0;
		box-sizing: border-box;
	}

	.check-button {
		background-color: #4caf50;
		color: white;
		font-size: 16px;
		padding: 10px 22px;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		transition: background-color 0.3s;
	}

	.check-button:hover {
		background-color: #388e3c;
	}

	.letters {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		margin-bottom: 15px;
	}

	.make__word {
		width: 40px;
		height: 60px;
		font-size: 20px;
		font-weight: bold;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.make__word:disabled {
		background-color: #9ccc65;
		cursor: default;
	}

	.result {
		font-size: 18px;
		font-weight: bold;
		margin-top: 10px;
	}

	.correct {
		color: green;
	}

	.wrong {
		color: red;
	}

	.completion-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 40px 20px;
	}

	.completion-message {
		background-color: #ffffff;
		border-radius: 16px;
		padding: 40px 30px;
		text-align: center;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
		max-width: 500px;
		width: 100%;
	}

	.completion-buttons {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-top: 20px;
		align-items: center;
	}

	.completion-btn {
		padding: 12px 0;
		font-size: 16px;
		font-weight: 600;
		border-radius: 10px;
		cursor: pointer;
		text-align: center;
		text-decoration: none;
		transition: 0.3s ease;
		color: white;
		border: none;
		min-width: 258px;
	}

	.completion-btn.home {
		background-color: #2196f3;
	}

	.completion-btn.home:hover {
		background-color: #1976d2;
	}

	.completion-btn.retry {
		background-color: #ff9800;
	}

	.completion-btn.retry:hover {
		background-color: #f57c00;
	}

	.completion-btn.restart {
		background-color: #4caf50;
	}

	.completion-btn.restart:hover {
		background-color: #388e3c;
	}
</style>

