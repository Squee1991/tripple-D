<template>
	<div class="session-wrapper" v-if="isReady">
		<div v-if="!finished && currentWord && currentMode">
			<div class="progress-line">
				<span>Слово {{ store.currentIndex + 1 }} / {{ totalWords }}</span>
				<span>Способ: <b>{{ modeLabel(currentMode) }}</b> ({{ currentModeIndex + 1 }}/{{ selectedModes.length }})</span>
			</div>
			<div class="word-block">
				<div class="word-question">
					<span>слово: {{ currentWord?.ru }}</span>
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
		max-width: 1000px;
		margin: 60px auto;
		/*background: linear-gradient(145deg, #4a2e12, #2d1a0c);*/
		border-radius: 18px;
		/*box-shadow: inset 0 0 0 2px #c5a36a, 0 4px 12px #00000066;*/
		padding: 40px 28px;
		min-height: 420px;
		color: #f4e6cf;
		font-family: 'Uncial Antiqua', cursive;
		/*border: 3px solid #c8a257;*/
		/*background-image: repeating-linear-gradient(*/
		/*	135deg,*/
		/*	#3a220f,*/
		/*	#3a220f 8px,*/
		/*	#402612 8px,*/
		/*	#402612 16px*/
		/*);*/
	}

	.progress-line {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 18px;
		font-size: 25px;
		color: #f5d276;
		text-shadow: 1px 1px 0 #2e1b05;
		padding: 20px;
		font-weight: 600;

	}

	.word-block {
		margin-top: 20px;
		/*background: #5b3717ee;*/
		border-radius: 14px;
		/*box-shadow: inset 0 0 4px #d9b169, 0 0 12px #0000003d;*/
		padding: 28px;
	}

	.word-question {
		font-size: 22px;
		color: #ffdf94;
		margin-bottom: 14px;
		text-shadow: 1px 1px 0 #40260d;
	}

	.mode-exercise p {
		margin-bottom: 10px;
		font-size: 18px;
		color: #42371c;
	}

	.input {
		font-size: 20px;
		padding: 8px 14px;
		border: 2px solid #cba35b;
        font-family: "Kurale", serif;
		font-weight: 600;
		color: #3b3a37;
		border-radius: 6px;
		width: 100%;
		outline: none;
		box-shadow: inset 0 0 6px #0000004d;
		transition: border 0.2s;
	}

	.input:focus {
		border-color: #ffe08a;
	}

	.letters {
		margin: 12px 0 14px 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.letters button {
		font-size: 19px;
		width: 42px;
		height: 45px;
		background: #6a4c2c;
		color: #ffe3a6;
		border-radius: 6px;
		border: 2px solid #d3aa5e;
		cursor: pointer;
		box-shadow: inset 0 0 4px #2e1b05;
		transition: background 0.2s;
	}

	.letters button:disabled {
		background: #46301d;
		color: #c7b99e;
		cursor: default;
		opacity: 0.7;
	}

	.audio-btn {
		background: #80541c;
		color: #fbe6b2;
		border: 2px solid #d4a249;
		border-radius: 8px;
		padding: 7px 18px;
		font-size: 18px;
		cursor: pointer;
		box-shadow: 0 2px 5px #00000033;
		transition: background 0.2s;
		margin-bottom: 15px;
	}

	.audio-btn:hover {
		background: #a1672f;
	}

	.answer-result {
		font-size: 21px;
		font-weight: bold;
		margin: 14px 0 0 0;
		min-height: 32px;
		text-shadow: 1px 1px 0 #000;
	}

	.answer-result.correct {
		color: #61ea89;
	}

	.answer-result.wrong {
		color: #ff5c5c;
	}

	.next-btn {
		margin-top: 22px;
		background: linear-gradient(90deg, #f9e79d, #c19c4c);
		color: #3a220f;
		font-size: 19px;
		font-family: inherit;
		padding: 12px 24px;
		border: none;
		border-radius: 10px;
		font-weight: bold;
		box-shadow: 0 2px 6px #00000055;
		cursor: pointer;
		transition: background 0.2s;
	}

	.next-btn:disabled {
		background: #8d734750;
		color: #ccc09e;
		cursor: not-allowed;
	}

	.finish-block {
		text-align: center;
		margin-top: 48px;
	}

	.again-btn, .home-btn {
		display: inline-block;
		margin: 16px 10px 0;
		padding: 13px 24px;
		background: #ffe4a2;
		color: #3a240c;
		border: 2px solid #cda052;
		border-radius: 10px;
		font-size: 18px;
		font-family: inherit;
		font-weight: bold;
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
		text-decoration: none;
		box-shadow: 0 2px 6px #00000044;
	}

	.again-btn:hover, .home-btn:hover {
		background: #c9a552;
		color: #fff;
	}
</style>

