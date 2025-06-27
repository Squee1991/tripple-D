<template>
	<div class="guess">
		<div class="guess__inner">
			<div class="guess__attempts">
				<div class="guess__attempts-text">Попыток осталось:</div>
				<div class="guess__attempts-value">{{ store.attempts }}</div>
			</div>

			<div class="guess__word">
				<span v-for="(char, i) in store.masked" :key="i" class="guess__letter" :class="{ 'guess__letter--filled': char }">
  {{ char || '_' }}
</span>

			</div>
			<div class="guess__alphabet">
				<button
					v-for="letter in store.alphabet"
					:key="letter"
					class="guess__btn"
					:disabled="store.usedLetters.includes(letter) || store.win || store.lose"
					@click="store.pickLetter(letter)"
				>
					{{ letter }}
				</button>
			</div>

			<div class="guess__input-area">
				<div class="gues__input-items">
					<input
						v-model="guessInput"
						class="guess__input"
						:disabled="store.win || store.lose"
						@keyup.enter="guessWord"
						placeholder="Введи слово целиком"
					/>
					<button
						class="guess__submit"
						@click="guessWord"
						:disabled="store.win || store.lose"
					>
						Проверить слово
					</button>
				</div>
			</div>

			<div v-if="store.win" class="guess__result guess__result--win">Победа!</div>

			<div class="guess__article" v-if="store.win && store.currentWordObj">
				<p class="gues__article--title">А теперь угадай артикль этого слова:</p>
				<input
					v-model="articleGuess"
					class="guess__input"
					:placeholder="'Введите der/die/das'"
					:disabled="articleResult"
					@keyup.enter="checkArticle"
					maxlength="4"
				/>
				<button
					class="guess__submit"
					@click="checkArticle"
					:disabled="articleResult"
				>
					Проверить артикль
				</button>
				<div
					v-if="articleResult"
					class="guess__result"
					:class="{
						'guess__result--win': articleResult === 'Верно!',
						'guess__result--lose': articleResult !== 'Верно!'
					}"
					style="margin-top: 8px;"
				>
					{{ articleResult }}
				</div>
			</div>

			<div v-if="store.lose" class="guess__result guess__result--lose">
				Проигрыш! Было слово: <span class="guess__answer">{{ store.answer }}</span>
			</div>

			<div class="guess__actions">
				<button class="guess__restart" @click="restartGame">
					<img src="../assets/images/undo.svg" alt="">
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	import { useRoute } from 'vue-router'
	import { useGuessWordStore } from '../store/guesStore.js'
	import { useSessionStore } from '../store/sessionStore.js'
	const sessionId = route.query.id || route.params.id
	const guessInput = ref('')
	const articleGuess = ref('')
	const articleResult = ref(null)
	const store = useGuessWordStore()
	const sessionStore = useSessionStore()
	const route = useRoute()

	function checkArticle() {
		if (!store.currentWordObj) return
		const correct = articleGuess.value.trim().toLowerCase() === store.currentWordObj.article.toLowerCase()
		articleResult.value = correct ? 'Верно!' : `Неверно. Это было: ${store.currentWordObj.article}`
	}

	function guessWord() {
		store.tryGuessWord(guessInput.value)
		guessInput.value = ''
	}

	function restartGame() {
		store.setWord(sessionStore.currentWord)
		guessInput.value = ''
		articleGuess.value = ''
		articleResult.value = null
	}

	onMounted(async () => {
		if (!sessionStore.currentWord.value) {
			await sessionStore.loadSessionWord(route.query.id || route.params.id)
		}
		const wordDe = sessionStore.currentWord.value?.word
		if (!wordDe) return

		const response = await fetch('/words.json')
		const data = await response.json()
		let found = null
		for (const topic of Object.keys(data)) {
			const match = data[topic].find(
				w => w.de && wordDe && w.de.toLowerCase() === wordDe.toLowerCase()
			)
			if (match) {
				found = match
				break
			}
		}
		if (found) {
			found.de = found.de.toUpperCase()
			store.setWord(found)
		}
	})

</script>

<style scoped>
	.guess {
		width: 100%;
		display: flex;
		justify-content: center;
		align-content: center;
	}

	.guess__inner {
		position: relative;
		max-width: 100%;
		border-radius: 24px;
		padding: 38px 24px 28px 24px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.guess__word {
		display: flex;
		gap: 4px;
		justify-content: center;
		margin-bottom: 34px;
	}

	.gues__input-items {
		display: flex;
		flex-direction: column;
	}

	.guess__letter {
		font-size: 14px;
		width: 25px;
		height: 35px;
		background: #f7edcf;
		color: #b5a27b;
		font-family: 'Cinzel', serif;
		border-radius: 12px;
		box-shadow: 0 2px 10px #cab1692a;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: background 0.15s, color 0.18s;
		user-select: none;
	}

	.guess__letter--filled {
		background: #7c3aed;
		color: #fffbe2;
		box-shadow: 0 2px 12px #9b73ff44;
	}

	.guess__alphabet {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		justify-content: center;
		margin-bottom: 24px;
		max-width: 500px;
	}

	.guess__btn {
		font-size: 1.1rem;
		width: 40px;
		height: 44px;
		border: none;
		border-radius: 10px;
		background: #ece7f9;
		color: #5531b5;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: bold;
		cursor: pointer;
		box-shadow: 0 1px 6px #dad1fa25;
		transition: background 0.14s, color 0.13s, transform 0.1s;
	}

	.guess__btn:disabled {
		background: #e7dff9;
		color: #b1a5e2;
		cursor: default;
		transform: scale(0.96);
	}

	.guess__btn:not(:disabled):hover {
		background: #c5b1fd;
		color: #fff;
		transform: scale(1.09);
	}

	.guess__input-area {
		display: flex;

		flex-direction: column;
		margin-bottom: 18px;
		justify-content: center;
		max-width: 600px;
		gap: 20px;
	}

	.guess__input {
		margin-bottom: 10px;
		font-size: 1.07rem;
		padding: 10px 14px;
		border-radius: 10px;
		border: 1.5px solid #d4c1ee;
		outline: none;
		background: #f8f4fd;
		color: #5633a4;
		transition: border 0.16s, background 0.13s;
		font-family: inherit;
	}

	.guess__input:focus {
		border: 1.5px solid #b6a2e0;
		background: #fff;
	}

	.guess__submit {
		background: #7c3aed;
		color: #fffbe2;
		border: none;
		border-radius: 10px;
		padding: 10px 18px;
		font-size: 1.07rem;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 700;
		cursor: pointer;
		box-shadow: 0 2px 8px #c0b2f740;
		transition: background 0.17s;
	}

	.guess__submit:disabled {
		background: #cec6e9;
		color: #a299ba;
		cursor: not-allowed;
	}

	.guess__info {
		position: absolute;
		font-size: 1.1rem;
		color: #896d2e;
		margin-bottom: 12px;
		text-align: center;
	}

	.guess__attempts {
		color: #7c3aed;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;
	}

	.guess__result {
		font-size: 1.25rem;
		margin: 10px 0 22px 0;
		font-weight: bold;
		text-align: center;
		border-radius: 12px;
		padding: 9px 20px;
		box-shadow: 0 1px 8px #e5d4a880;
	}

	.guess__result--win {
		color: #fff;
		background: linear-gradient(92deg, #64d370 40%, #38b29d 100%);
	}

	.guess__result--lose {
		color: #fff;
		background: linear-gradient(92deg, #f15b4e 40%, #b21d38 100%);
	}

	.guess__answer {
		font-family: monospace;
		font-size: 1.09em;
		letter-spacing: 0.06em;
		color: #fffbe2;
		padding: 2px 8px;
		border-radius: 7px;
		background: #7c3aed;
		margin-left: 8px;
	}

	.guess__restart {
		width: 30px;
		background: none;
		color: #7c3aed;
		border: none;
		border-radius: 10px;
		font-size: 1.07rem;
		cursor: pointer;
		font-weight: bold;
		transition: background 0.13s, color 0.13s;
	}

	.guess__attempts-value {
		width: 46px;
		height: 46px;
		border-radius: 50%;
		border: 3px solid black;
		display: flex;
		justify-content: center;
		align-items: center;
		color: black;
		font-size: 25px;
		font-weight: bold;
	}


	.guess__attempts-text {
		font-size: 24px;
		margin-right: 15px;
		font-weight: 600;

	}

	.guess__article {
		gap: 15px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	@media (hover: none) and (pointer: coarse) {
		.guess__btn:not(:disabled):hover,
		.guess__letter:hover {
			background: inherit !important;
			color: inherit !important;
			transform: none !important;
			filter: none !important;
		}
	}


</style>
