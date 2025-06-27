<template>
	<div class="guess">
		<div class="guess__inner">
			<div v-if="!isStarted" class="guess__start-screen">
				<button class="guess__submit" @click="startGame">Начать игру</button>
			</div>
			<div class="guess__inner-session" v-else>
				<div v-if="isStarted && !store.win && !store.lose" class="guess__timer">
					Время: {{ Math.floor((now - store.timeStarted) / 1000) }} сек.
				</div>
				<div v-if="isStarted && (store.win || store.lose)" class="guess__timer">
					Время: {{ store.timeSpent }} сек.
				</div>
				<div class="guess__top-content">
					<div class="guess__back">
						<NuxtLink to="/">Назад</NuxtLink>
					</div>
					<div class="guess__attempts">
						<div class="guess__attempts-text">
							Попыток осталось:
						</div>
						<div class="guess__attempts-value">{{ store.attempts }}</div>
					</div>
					<div class="guess__actions">
						<button class="guess__restart" @click="startGame">
							<img src="../assets/images/undo.svg" alt="">
						</button>
					</div>
				</div>
				<div class="guess__word">
			<span
				v-for="(char, i) in store.masked"
				:key="i"
				class="guess__letter"
				:class="{ 'guess__letter--filled': char }"
			>
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
						<button class="guess__submit" @click="guessWord" :disabled="store.win || store.lose">Проверить
							слово
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
					<div v-if="articleResult" class="guess__result"
					     :class="{'guess__result--win': articleResult==='Верно!','guess__result--lose': articleResult!=='Верно!'}"
					     style="margin-top: 8px;">
						{{ articleResult }}
					</div>
				</div>
				<div v-if="store.lose" class="guess__result guess__result--lose">
					Проигрыш! Было слово: <span class="guess__answer">{{ store.answer }}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref} from 'vue'
	import {useGuessWordStore} from '../store/guesStore.js'

	const store = useGuessWordStore()
	const guessInput = ref('')
	const articleGuess = ref('')
	const articleResult = ref(null)
	const isStarted = ref(false)


	const now = ref(Date.now())
	let intervalId = null

	function startTimer() {
		if (intervalId) clearInterval(intervalId)
		intervalId = setInterval(() => {
			now.value = Date.now()
		}, 0    )
	}

	function checkArticle() {
		if (!store.currentWordObj) return
		const correct = articleGuess.value.trim().toLowerCase() === store.currentWordObj.article.toLowerCase()
		articleResult.value = correct ? 'Верно!' : `Неверно. Это было: ${store.currentWordObj.article}`
	}

	function stopTimer() {
		if (intervalId) clearInterval(intervalId)
	}

	async function startGame() {
		await store.loadGuessProgress()
		await store.startGame()
		isStarted.value = true
		guessInput.value = ''
		articleGuess.value = ''
		articleResult.value = null
		startTimer()
	}

	function guessWord() {
		store.tryGuessWord(guessInput.value)
		guessInput.value = ''
	}

	onUnmounted(() => stopTimer())

	watch(() => store.win, async (val) => {
		if (val && store.currentWordObj) {
			// Сохраняем слово в прогресс (но только если ещё не было)
			if (!store.guessedWords.includes(store.answer)) {
				store.guessedWords.push(store.answer)
				await store.saveGuessProgress()
			}
		}
	})

</script>

<style scoped>

	.guess__top-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30px;
	}

	.guess__back {
		display: flex;
		justify-content: flex-start;
	}

	.guess__timer {
		font-size: 1.15rem;
		margin-bottom: 12px;
		color: #88771a;
		font-weight: 600;
	}


	.guess__back a, .guess__back .nuxt-link-active {
		display: inline-block;
		padding: 13px 32px;
		background: #232323;
		color: #fffbe2;
		border-radius: 13px;
		font-size: 1.19rem;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 700;
		letter-spacing: 0.03em;
		text-decoration: none;
		box-shadow: 0 4px 18px #b7a75a44, 0 2px 8px #fff6bb44;
		border: 2.5px solid #ffe68a;
		transition: background 0.13s, color 0.13s, box-shadow 0.14s, border 0.14s;
		cursor: pointer;
	}

	.guess__back a:hover, .guess__back .nuxt-link-active:hover {
		background: #ffe68a;
		color: #232323;
		border-color: #fdd76c;
		box-shadow: 0 4px 28px #ffe68a77;
	}


	.guess__inner {
		background: #fff;
		box-shadow: 0 8px 40px #d7d0c785, 0 1.5px 10px #e7d8c725;
		border-radius: 28px;
		padding: 42px 36px 36px 36px;
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 1300px;
		margin: 30px auto;
		transition: box-shadow 0.18s;
	}

	.guess__word {
		display: flex;
		gap: 10px;
		justify-content: center;
		margin-bottom: 32px;
	}

	.guess__letter {
		font-size: 2.2rem;
		width: 54px;
		height: 64px;
		background: #f5f2e9;
		color: #4d5345;
		font-family: 'Montserrat', Arial, sans-serif;
		border-radius: 17px;
		box-shadow: 0 2px 8px #e4e0cc44;
		border: 2.5px solid #ece6cf;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: background 0.14s, color 0.16s, border 0.13s;
		user-select: none;
	}

	.guess__letter--filled {
		background: #ffea8a;
		color: #232323;
		border-color: #fdd76c;
		box-shadow: 0 2px 14px #ffe68a77;
	}

	.guess__alphabet {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		justify-content: center;
		margin: 25px auto;
		max-width: 670px;
	}


	.gues__input-items {
		display: flex;
		flex-direction: column;
		width: 50%;
		margin: 0 auto;
	}

	.guess__btn {
		font-size: 1.15rem;
		width: 46px;
		height: 54px;
		border: none;
		border-radius: 14px;
		background: #edeae1;
		color: #4d5345;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 800;
		cursor: pointer;
		box-shadow: 0 2px 8px #c8beb033;
		transition: background 0.13s, color 0.13s, box-shadow 0.11s;
	}

	.guess__btn:disabled {
		background: #f8f5ee;
		color: #b3b1a1;
		cursor: not-allowed;
	}

	.guess__btn:not(:disabled):hover {
		background: #ffea8a;
		color: #232323;
		box-shadow: 0 3px 14px #ffe68a55;
	}

	.guess__input-area {
		display: flex;
		flex-direction: column;
		margin-bottom: 20px;
		justify-content: center;
		gap: 17px;
	}

	.guess__input {
		margin-bottom: 8px;
		font-size: 1.19rem;
		padding: 13px 19px;
		border-radius: 13px;
		border: 2.5px solid #ece6cf;
		outline: none;
		background: #f7f5ef;
		color: #434c3c;
		transition: border 0.13s, background 0.13s;
		font-family: inherit;
		font-weight: 500;
	}

	.guess__input:focus {
		border: 2.5px solid #ffea8a;
		background: #fff9db;
	}

	.guess__submit {
		background: #3a4b3a;
		color: #fff;
		border: none;
		border-radius: 14px;
		padding: 12px 30px;
		font-size: 1.19rem;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: 900;
		cursor: pointer;
		box-shadow: 0 3px 18px #d6e6cc18;
		transition: background 0.14s, color 0.13s, box-shadow 0.14s;
	}

	.guess__submit:disabled {
		background: #f8f5ee;
		color: #b3b1a1;
		cursor: not-allowed;
	}

	.guess__submit:not(:disabled):hover {
		background: #1a2c18;
		color: #ffea8a;
		box-shadow: 0 2px 16px #cbe67d33;
	}

	.guess__inner-session {
		width: 100%;
	}

	.guess__attempts {
		color: #2b3a26;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}

	.guess__attempts-value {
		width: 52px;
		height: 52px;
		border-radius: 50%;
		border: 3.5px solid #d6e67d;
		background: #fffae1;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #d6ae24;
		font-size: 2.1rem;
		font-weight: bold;
		box-shadow: 0 2px 10px #ffe68a35;
	}

	.guess__attempts-text {
		font-size: 24px;
		margin-right: 7px;
		font-weight: 600;
	}

	.guess__result {
		font-size: 1.32rem;
		margin: 13px 0 25px 0;
		font-weight: bold;
		text-align: center;
		border-radius: 12px;
		padding: 13px 22px;
		box-shadow: 0 2px 12px #ffd36c3a;
		letter-spacing: 0.02em;
	}

	.guess__result--win {
		color: #fff;
		background: linear-gradient(96deg, #ffc745 30%, #77d97d 100%);
		border: 2.5px solid #c6be86;
	}

	.guess__result--lose {
		color: #fff;
		background: linear-gradient(95deg, #fa6262 24%, #8185be 100%);
		border: 2.5px solid #ffdddd;
	}

	.guess__answer {
		font-family: monospace;
		font-size: 1.12em;
		letter-spacing: 0.09em;
		color: #fff;
		padding: 4px 13px;
		border-radius: 7px;
		background: #d6ae24;
		margin-left: 10px;
	}

	.guess__restart {
		width: 38px;
		height: 38px;
		background: #f7f5ee;
		color: #d6ae24;
		border: 2.5px solid #ece6cf;
		border-radius: 10px;
		font-size: 1.12rem;
		cursor: pointer;
		font-weight: bold;
		transition: background 0.13s, color 0.13s, border 0.13s;
		margin-top: 13px;
	}

	.guess__restart:hover {
		background: #ffe68a;
		color: #232323;
		border-color: #d6e67d;
	}

	.guess__article {
		gap: 13px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		background: rgba(255, 240, 200, 0.11);
		padding: 14px 0 0 0;
		border-radius: 12px;
	}

	.gues__article--title {
		font-size: 1.13rem;
		color: #2b3a26;
		font-family: 'Montserrat', Arial, sans-serif;
		font-weight: bold;
		letter-spacing: 0.01em;
		margin-bottom: 3px;
		text-shadow: 0 1px 6px #e3e3cb22;
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

	@media (max-width: 700px) {
		.guess__inner {
			padding: 8vw 2vw 9vw 2vw;
			max-width: 98vw;
		}

		.guess__word {
			gap: 3vw;
		}

		.guess__alphabet {
			gap: 2vw;
		}
	}

</style>
