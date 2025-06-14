<template>
	<div class="session">
		<div class="session__wrapper" v-if="isReady">
			<div v-if="!finished && currentWord && currentMode">
				<div class="session__theme">
					<div class="session__theme-t">{{ t('sessionPage.theme')}}:</div>
					<h1 class="session__topic">{{ topicTitle }}</h1>
				</div>
				<div class="progress-line">
					<span>{{ store.currentIndex + 1 }} / {{ totalWords }}</span>
					<span>{{t('sessionPage.choice')}}: <b>{{ t(modeLabel(currentMode)) }}</b> ({{ currentModeIndex + 1 }}/{{ selectedModes.length }})</span>
				</div>
				<div class="word-block">
					<div class="word-question">
						<span>{{t('sessionLabels.word')}}: {{ currentWord?.[currentLang] }}</span>
					</div>
					<div class="mode-exercise">
						<div v-if="currentMode === 'article'">
							<p>{{t('sessionLabels.articleFor')}} <b>{{ currentWord.de }}</b>:</p>
							<input v-model="userInput" class="input"/>
						</div>
						<div v-if="currentMode === 'letters'">
							<p>{{t('sessionLabels.lettersFor')}} <b>{{ currentWord.article }}</b></p>
							<div class="letters">
								<button v-for="(letter, i) in shuffledLetters" :key="i" :disabled="usedLetters[i]"
								        @click="addLetter(letter, i)">
									{{ letter === ' ' ? '␣' : letter }}
								</button>
							</div>
							<input v-model="userInput" class="input"/>
						</div>
						<div v-if="currentMode === 'wordArticle'">
							<p>{{t('sessionLabels.articleWordFor')}}</p>
							<input v-model="userInput" class="input"/>
						</div>
						<div v-if="currentMode === 'plural'">
							<p>{{t('sessionLabels.pluralFor')}}><b>{{ currentWord.de }}</b>:</p>
							<input v-model="userInput" class="input"/>
						</div>
						<div v-if="currentMode === 'audio'">
							<p>{{t('sessionLabels.audioFor')}}:</p>
							<button @click="speak(currentWord.de)" class="audio-btn">
								<img class="megaphones__icon" src="../assets/images/megaphone.svg" alt="">
								<span>Прослушать</span>
							</button>
							<input v-model="userInput" class="input"/>
						</div>
					</div>
					<div v-if="result" class="answer-result" :class="result">
						<span v-if="result === 'correct'">✅</span>
						<span v-if="result === 'wrong'">❌</span>
						<span
							v-if="currentMode === 'article'">{{t('result.correctAnswer')}}: {{ currentWord.article }}</span>
						<span v-if="currentMode === 'letters' || currentMode === 'audio'">{{t('result.correctAnswer')}}: {{ currentWord.de }}</span>
						<span v-if="currentMode === 'wordArticle'">{{t('result.correct')}}: {{ currentWord.article }} {{ currentWord.de }}</span>
						<span v-if="currentMode === 'plural'">{{t('result.correct')}}: {{ currentWord.plural }}</span>
					</div>
				</div>
				<button
					class="next-btn"
					@click="!result ? checkAnswer() : nextStep()"
					:disabled="!result && (isChecking || !userInput)"
				>
					{{ !result ? t('sessionPage.btnCheck') : t('sessionPage.continue') }}
				</button>
			</div>
			<div v-else class="finish-block">
				<h2>Обучение завершено!</h2>
				<button class="again-btn" @click="restartAll">Повторить тему</button>
				<button v-if="wrongWords.length" class="again-btn" :disabled="wrongWords.length === 0"
				        @click="repeatMistakes">
					Повторить ошибки ({{ wrongWords.length }})
				</button>
				<router-link class="home-btn" to="/">Назад к темам</router-link>
			</div>
		</div>
	</div>
</template>
<script setup>
	import {ref, computed, onMounted} from 'vue'
	import {useRoute} from 'vue-router'
	import {userlangStore} from '../store/learningStore.js'

	const {t, locale} = useI18n()
	const wrongWords = ref([])
	const allWords = ref([])
	const store = userlangStore()
	const route = useRoute()
	const isReady = ref(false)
	const selectedModes = ref([])
	const sessionWords = ref([])
	const finished = ref(false)
	const topicTitle = ref('');
	const userInput = ref('')
	const result = ref('')
	const usedLetters = ref([])
	const isChecking = ref(false)
	const currentModeIndex = computed(() => store.currentModeIndex)
	const currentMode = computed(() => selectedModes.value[currentModeIndex.value])
	const currentWord = computed(() => store.selectedWords[store.currentIndex])
	const totalWords = computed(() => store.selectedWords.length)
	const currentLang = computed(() => locale.value);

	function modeLabel(mode) {
		const m = {
			article: 'modes.article',
			letters: 'modes.letters',
			wordArticle: 'modes.articleWord',
			plural: 'modes.plural',
			audio: 'modes.audio'
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

		if (!ok && !wrongWords.value.includes(currentWord.value)) {
			wrongWords.value.push(currentWord.value)
		}
		await store.markProgress(currentWord.value, currentMode.value, ok)
		await store.saveToFirebase()

		isChecking.value = false
	}

	function nextStep() {
		if (currentModeIndex.value < selectedModes.value.length - 1) {
			store.currentModeIndex++
		} else {
			store.currentModeIndex = 0
			store.currentIndex++
		}

		userInput.value = ''
		usedLetters.value = []
		result.value = ''

		if (store.currentIndex >= store.selectedWords.length) {
			finished.value = true
		}
	}

	function restart() {
		if (wrongWords.value.length > 0) {
			store.selectedWords = [...wrongWords.value]
			wrongWords.value = []
		} else {
			store.selectedWords = [...sessionWords.value]
		}
		store.currentIndex = 0
		store.currentModeIndex = 0
		finished.value = false
		userInput.value = ''
		usedLetters.value = []
		result.value = ''
	}

	function restartAll() {
		store.selectedWords = [...allWords.value]
		store.currentIndex = 0
		store.currentModeIndex = 0
		finished.value = false
		userInput.value = ''
		usedLetters.value = []
		result.value = ''
		wrongWords.value = []
	}

	function repeatMistakes() {
		if (wrongWords.value.length === 0) return
		store.selectedWords = [...wrongWords.value]
		store.currentIndex = 0
		store.currentModeIndex = 0
		finished.value = false
		userInput.value = ''
		usedLetters.value = []
		result.value = ''
		wrongWords.value = []
	}

	onMounted(async () => {
		await store.loadFromFirebase()
		store.syncSelectedWordsProgress()

		let mode = route.query.mode
		selectedModes.value = Array.isArray(mode) ? mode : [mode]
		allWords.value = [...store.selectedWords]
		sessionWords.value = store.selectedWords.filter(w => {
			const isLearned = selectedModes.value.every(m => w.progress?.[m] === true)
			return !isLearned
		})
		store.selectedWords = sessionWords.value.length > 0
			? [...sessionWords.value]
			: [...allWords.value]
		if (store.currentIndex >= store.selectedWords.length) store.currentIndex = 0
		if (store.currentModeIndex >= selectedModes.value.length) store.currentModeIndex = 0
		if (route.query.topic) {
			topicTitle.value = route.query.topic;
		}
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

	.session__wrapper {
		max-width: 1000px;
		margin: 60px auto;
		border-radius: 18px;
		padding: 40px 28px;
		min-height: 420px;
		color: #f4e6cf;
		font-family: 'Montserrat', Arial, sans-serif
	}

	.session__theme {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 25px;
	}
	.session__theme-t {
		color: black;
		font-size: 24px;
	}

	.session__topic {
		color: black;
		text-align: center;
		margin-left: 3px;
		font-weight: bold;
		font-size: 26px;
	}

	.progress-line {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 18px;
		font-size: 25px;
		color: #f5d276;
		text-shadow: 1px 1px 0 #2e1b05;
		font-weight: 600;
	}

	.megaphones__icon {
		width: 25px;
		margin-right: 10px;
	}

	.word-block {
		min-height: 160px;
		margin-top: 20px;
		border-radius: 14px;
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
		display: flex;
		justify-content: center;
		align-items: center;
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
		margin: 3px 0 0 0;
		min-height: 32px;
		text-shadow: 1px 1px 0 #000;
	}

	.answer-result.correct {
		color: #61ea89;
	}

	.answer-result.wrong {
		color: #ff5c5c;
		font-family: "Kurale", serif;
	}

	.next-btn {
		margin-top: 1px;
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
	@media (max-width: 900px) {
		.session__wrapper {
			max-width: 97vw;
			margin: 30px auto;
			padding: 26px 7vw;
			min-height: 340px;
		}
		.progress-line {
			font-size: 18px;
		}
		.word-question {
			font-size: 16px;
		}
		.input {
			font-size: 17px;
			padding: 7px 9px;
		}
		.letters button {
			font-size: 16px;
			width: 36px;
			height: 38px;
		}
		.audio-btn {
			font-size: 15px;
			padding: 7px 12px;
		}
		.next-btn, .again-btn, .home-btn {
			font-size: 16px;
			padding: 10px 16px;
			border-radius: 8px;
		}
	}

	@media (max-width: 700px) {
		.session__wrapper {
			max-width: 100vw;
			margin: 0;
			padding: 16px 2vw;
			min-height: 240px;
			border-radius: 0;
		}
		.session__theme-t {
			font-size: 17px;
		}
		.session__topic {
			font-size: 19px;
		}
		.progress-line {
			font-size: 15px;
			flex-direction: column;
			gap: 4px;
		}
		.word-block {
			min-height: 90px;
			margin-top: 12px;
			border-radius: 8px;
		}
		.word-question {
			font-size: 13px;
			margin-bottom: 9px;
		}
		.mode-exercise p {
			font-size: 13px;
			margin-bottom: 7px;
		}
		.input {
			font-size: 15px;
			padding: 6px 6px;
			border-radius: 4px;
		}
		.letters {
			gap: 4px;
		}
		.letters button {
			font-size: 13px;
			width: 27px;
			height: 29px;
			border-radius: 4px;
			padding: 0;
		}
		.audio-btn {
			font-size: 13px;
			padding: 5px 8px;
			border-radius: 6px;
		}
		.answer-result {
			font-size: 15px;
			min-height: 22px;
		}
		.next-btn, .again-btn, .home-btn {
			font-size: 14px;
			padding: 8px 10px;
			border-radius: 7px;
			margin: 10px 4px 0 0;
		}
		.finish-block {
			margin-top: 30px;
		}
	}

</style>

