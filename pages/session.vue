<template>
	<div class="session-wrapper" v-if="isReady">
		<div v-if="!finished && currentWord && currentMode">
			<div class="progress-line">
				<span>Слово {{ store.currentIndex + 1 }} / {{ totalWords }}</span>
				<span>Способ: <b>{{ modeLabel(currentMode) }}</b> ({{ currentModeIndex + 1 }}/{{ selectedModes.length }})</span>
			</div>
			<div class="word-block">
				<div class="word-question">
					<span>RU:{{ currentWord?.ru }}</span>
				</div>
				<div class="mode-exercise">
					<div v-if="currentMode === 'article'">
						<p>Впиши артикль для <b>{{ currentWord.de }}</b>:</p>
						<input v-model="userInput" class="input"/>
					</div>
					<div v-if="currentMode === 'letters'">
						<p>Собери слово из букв: <b>{{ currentWord.article }}</b></p>
						<div class="letters">
							<button v-for="(letter, i) in shuffledLetters" :key="i" :disabled="usedLetters[i]"
							        @click="addLetter(letter, i)">
								{{ letter === ' ' ? '␣' : letter }}
							</button>
						</div>
						<input v-model="userInput" class="input"/>
					</div>
					<div v-if="currentMode === 'wordArticle'">
						<p>Впиши артикль и слово (например: <b>die Lampe</b>):</p>
						<input v-model="userInput" class="input"/>
					</div>
					<div v-if="currentMode === 'plural'">
						<p>Впиши форму множественного числа для <b>{{ currentWord.de }}</b>:</p>
						<input v-model="userInput" class="input"/>
					</div>
					<div v-if="currentMode === 'audio'">
						<p>Прослушай и впиши слово:</p>
						<button @click="speak(currentWord.de)" class="audio-btn">🔊 Прослушать</button>
						<input v-model="userInput" class="input"/>
					</div>
				</div>
				<div v-if="result" class="answer-result" :class="result">
					<span v-if="result === 'correct'">✅ Верно!</span>
					<span v-if="result === 'wrong'">❌ Неверно. <span v-if="currentMode === 'article'">
						Правильный ответ: {{ currentWord.article }}
					</span>
            <span v-if="currentMode === 'letters' || currentMode === 'audio'">Правильный ответ: {{ currentWord.de }}</span>
            <span v-if="currentMode === 'wordArticle'">Правильно: {{ currentWord.article }} {{ currentWord.de }}</span>
            <span v-if="currentMode === 'plural'">Правильно: {{ currentWord.plural }}</span>
          </span>
				</div>
				<button class="next-btn" @click="checkAnswer" :disabled="isChecking || !userInput">Проверить</button>
			</div>
		</div>
		<div v-else class="finish-block">
			<h2>🎉 Обучение завершено!</h2>
			<button class="again-btn" @click="restart">Пройти снова</button>
			<router-link class="home-btn" to="/">Назад к темам</router-link>
		</div>
	</div>
</template>

<script setup>
	import {ref, computed, onMounted} from 'vue'
	import {useRoute} from 'vue-router'
	import {userlangStore} from '@/store/learningStore'

	const store = userlangStore()
	const route = useRoute()
	const isReady = ref(false)
	const selectedModes = ref([])
	const sessionWords = ref([])
	const finished = ref(false)
	const userInput = ref('')
	const result = ref('')
	const usedLetters = ref([])
	const isChecking = ref(false)

	const currentModeIndex = computed(() => store.currentModeIndex)
	const currentMode = computed(() => selectedModes.value[currentModeIndex.value])
	const currentWord = computed(() => store.selectedWords[store.currentIndex])
	const totalWords = computed(() => store.selectedWords.length)

	function modeLabel(mode) {
		const m = {
			article: 'Вписать артикль',
			letters: 'Собрать слово',
			wordArticle: 'Артикль + слово',
			plural: 'Множественное число',
			audio: 'Аудирование'
		}
		return m[mode] || mode
	}

	const shuffledLetters = computed(() => {
		if (!currentWord.value) return []
		return currentWord.value.de.split('').sort(() => Math.random() - 0.5)
	})

	function addLetter(letter, idx) {
		if (usedLetters.value[idx]) return
		userInput.value += letter
		usedLetters.value[idx] = true
	}

	function speak(text) {
		const u = new window.SpeechSynthesisUtterance(text)
		u.lang = 'de-DE'
		window.speechSynthesis.speak(u)
	}

	function normalize(text) {
		return (text || '').trim().toLowerCase().replace(/\s+/g, ' ')
	}

	async function checkAnswer() {
		if (!currentWord.value || isChecking.value) return
		isChecking.value = true
		let correct = ''
		switch (currentMode.value) {
			case 'article':
				correct = currentWord.value.article;
				break
			case 'letters':
				correct = currentWord.value.de;
				break
			case 'wordArticle':
				correct = `${currentWord.value.article} ${currentWord.value.de}`;
				break
			case 'plural':
				correct = currentWord.value.plural;
				break
			case 'audio':
				correct = currentWord.value.de;
				break
		}
		const ok = normalize(userInput.value) === normalize(correct)
		result.value = ok ? 'correct' : 'wrong'
		setTimeout(async () => {
			await store.markProgress(currentWord.value, currentMode.value, ok)
			if (currentModeIndex.value < selectedModes.value.length - 1) {
				store.currentModeIndex++
			} else {
				store.currentModeIndex = 0
				store.currentIndex++
			}
			await store.saveToFirebase()
			userInput.value = ''
			usedLetters.value = []
			if (store.currentIndex >= store.selectedWords.length) {
				finished.value = true
			}
			isChecking.value = false
			result.value = ''
		}, 700)

	}

	function restart() {
		store.currentIndex = 0
		store.currentModeIndex = 0
		finished.value = false
		userInput.value = ''
		usedLetters.value = []
		result.value = ''
	}

	onMounted(async () => {
		await store.loadFromFirebase()
		store.syncSelectedWordsProgress()
		let mode = route.query.mode
		selectedModes.value = Array.isArray(mode) ? mode : [mode]
		sessionWords.value = store.selectedWords.filter(w => {
			const isLearned = selectedModes.value.every(m => w.progress?.[m] === true)
			return !isLearned
		})

		if (store.currentIndex >= sessionWords.value.length) store.currentIndex = 0
		if (store.currentModeIndex >= selectedModes.value.length) store.currentModeIndex = 0
		isReady.value = true
	})

	watch(userInput, (newVal, oldVal) => {
		if (currentMode.value !== 'letters') return
		const removed = oldVal.length - newVal.length
		if (removed > 0) {
			for (let i = 0; i < removed; i++) {
				const idx = newVal.length + i
				usedLetters.value[idx] = false
			}
		}
	})

</script>

<style scoped>
	.session-wrapper {
		max-width: 700px;
		margin: 48px auto;
		background: linear-gradient(130deg, #18031f 80%, #332053 150%);
		border-radius: 26px;
		box-shadow: 0 4px 18px #380852a8;
		padding: 38px 20px 48px 20px;
		min-height: 390px;
		color: #f7e6cf;
		font-family: 'Uncial Antiqua', cursive;
	}

	.progress-line {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
		font-size: 19px;
		color: #ffe082;
	}

	.word-block {
		margin-top: 15px;
		background: #260d31b8;
		border-radius: 16px;
		box-shadow: 0 0 12px #36074738;
		padding: 23px 19px 30px 19px;
	}

	.word-question {
		font-size: 20px;
		color: #ffd16e;
		margin-bottom: 9px;
	}

	.mode-exercise p {
		margin-bottom: 8px;
	}

	.input {
		font-size: 20px;
		padding: 7px 14px;
		margin: 10px 0 0 0;
		border: 2px solid #a176f6;
		background: #21174a;
		color: #fff6df;
		border-radius: 7px;
		width: 90%;
		outline: none;
		transition: border 0.2s;
	}

	.input:focus {
		border: 2px solid #ffe082;
	}

	.letters {
		margin: 10px 0 12px 0;
	}

	.letters button {
		margin: 2px 3px;
		font-size: 19px;
		width: 39px;
		height: 42px;
		background: #38205d;
		color: #ffe5ab;
		border-radius: 7px;
		border: none;
		cursor: pointer;
		transition: background 0.2s;
	}

	.letters button:disabled {
		background: #594088;
		color: #cbbfa2;
		opacity: 0.7;
		cursor: default;
	}

	.audio-btn {
		background: #31177c;
		color: #ffe082;
		border: none;
		border-radius: 8px;
		padding: 6px 16px;
		margin: 7px 0 10px 0;
		font-size: 19px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.audio-btn:hover {
		background: #5c2fe3;
	}

	.answer-result {
		font-size: 21px;
		font-weight: bold;
		margin: 13px 0 0 0;
		min-height: 32px;
		transition: color 0.2s;
	}

	.answer-result.correct {
		color: #35ea7b;
	}

	.answer-result.wrong {
		color: #fd5c5c;
	}

	.next-btn {
		margin-top: 20px;
		background: linear-gradient(90deg, #f7d96e, #a176f6 160%);
		color: #3b1c07;
		font-size: 19px;
		font-family: inherit;
		padding: 11px 23px;
		border: none;
		border-radius: 12px;
		font-weight: bold;
		box-shadow: 0 2px 8px #59339944;
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
	}

	.next-btn:disabled {
		background: #6c4e2e50;
		color: #998d6b;
		opacity: 0.7;
		cursor: not-allowed;
	}

	.finish-block {
		text-align: center;
		margin-top: 38px;
	}

	.again-btn, .home-btn {
		display: inline-block;
		margin: 16px 14px 0 14px;
		padding: 13px 22px;
		background: #ffefbe;
		color: #1d0736;
		border: none;
		border-radius: 9px;
		font-size: 19px;
		font-family: inherit;
		font-weight: bold;
		cursor: pointer;
		transition: background 0.18s, color 0.2s;
		text-decoration: none;
	}

	.again-btn:hover, .home-btn:hover {
		background: #bca03f;
		color: #fff;
	}
</style>
