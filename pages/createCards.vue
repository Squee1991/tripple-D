<template>
	<div class="cards-layout">
		<div>
			<NuxtLink to="/" class="back-btn">
				{{ t('selectedpage.backBtn') }}
			</NuxtLink>
		</div>
		<div class="cards__wrapper">
			<div class="form-block">
				<h2 class="title">{{ t('choiceTheme.create')}}</h2>
				<form @submit.prevent="createCard" class="form">
					<div class="custom-topic-list">
						<div class="custom-topic-label">{{ t('choiceTheme.theme')}}</div>
						<div class="custom-select" tabindex="0" @blur="open = false">
							<div class="custom-select__trigger" @click="toggle" :class="{ open }">
								{{ form.topic ? t(themenMap[form.topic]) : t('choiceTheme.choice') }}
								<img :class="{ open }" class="arrow" src="../assets/images/arrowNav.svg" alt="">
							</div>
							<div v-if="open" class="custom-select__dropdown">
								<div
									v-for="(name, key) in themenMap"
									:key="key"
									class="custom-select__option"
									:class="{ selected: form.topic === key }"
									@click="select(key)"
								>
									{{ t(name) }}
								</div>
							</div>
						</div>
						<!--					<div v-if="!form.topic" class="custom-topic-placeholder">Выберите тему</div>-->
					</div>
					<template v-for="field in inputFields" :key="field.key">
						<template v-if="field.type === 'textarea'">
								<textarea
									v-model="form[field.key]"
									:placeholder="t(field.placeholder)"
									:required="field.required"
									:rows="field.rows || 2"
									class="input input__area"
								/>
						</template>
						<template v-else>
							<input
								v-model="form[field.key]"
								:type="field.type"
								:placeholder="t(field.placeholder)"
								:required="field.required"
								:min="field.min"
								:max="field.max"
								class="input"
							/>
						</template>
					</template>
					<button type="submit" class="btn">{{ t('choiceTheme.btn')}}</button>
				</form>
			</div>
			<div class="cards-block">
				<h2 class="title cards-title">{{ t('choiceTheme.available')}}</h2>
				<div class="search-bar">
					<input
						v-model="searchQuery"
						class="input search-input"
						type="text"
						:placeholder="t('choiceTheme.search')"
					/>
					<input
						v-model="levelFilter"
						class="input search-level"
						type="number"
						min="1"
						max="10"
						:placeholder="t('choiceTheme.difficult')"
					/>
				</div>
				<div class="cards-grid">
					<div
						v-for="(card, i) in filteredCards"
						:key="card.id || i"
						class="card magic-card"
					>
						<div @click="openGuess(card)" class="card-card-btn">
							<!--						<div class="card-art-title">{{ card.title || `Карточка ${i + 1}` }}</div>-->
							<div v-if="card.topic" class="card-art-topic">{{ t(themenMap[card.topic]) }}</div>
							<div v-if="card.level" class="card-art-level">{{ t('choiceTheme.difficult')}} {{ card.level
								}}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div v-if="currentGuess" class="modal-overlay" @click.self="closeGuess">
				<div class="modal">
					<h3 class="modal-title">{{ currentGuess.title }}</h3>
					<div v-if="currentGuess.topic || currentGuess.level" class="modal-subinfo">
						<span v-if="currentGuess.topic" class="modal-topic">Тема: {{ currentGuess.topic }}</span>
						<span v-if="currentGuess.level" class="modal-level">{{t('choiceTheme.difficult')}}: {{ currentGuess.level }}</span>
					</div>
					<div class="modal-sentence">
						{{ currentGuess.hiddenSentence }}
					</div>
					<div v-if="currentGuess.translation" class="modal-translation">
						перевод: {{ currentGuess.translation }}
					</div>
					<form v-if="!guessResult" @submit.prevent="makeGuess" class="guess-form">
						<div v-for="(pos, idx) in currentGuess.articles" :key="idx" class="guess-field">
							<input
								v-model="userAnswers[idx]"
								class="input guess-input"
								:placeholder="'Артикль' + (idx + 1)"
								required
								autocomplete="off"
								@keyup.enter.prevent="makeGuess"
							/>
						</div>
						<button type="submit" class="btn guess-btn">Проверить</button>
					</form>
					<div v-else class="guess-result">
						<div
							v-for="(art, idx) in currentGuess.articles"
							:key="'result' + idx"
							class="guess-answer"
							:class="{
							correct: guessResult[idx] && guessResult[idx].correct,
							wrong: guessResult[idx] && !guessResult[idx].correct,}">
						<span>
							<b>Пропуск {{ idx + 1 }}:</b>
							<span v-if="guessResult[idx] && guessResult[idx].correct">Верно!</span>
							<span v-else>Ошибка!</span>
						</span>
						</div>
						<div class="modal-original">
							<b>Оригинальное предложение:</b>
							<br/>
							{{ currentGuess.sentence }}
						</div>
						<button @click="closeGuess" class="btn guess-btn close-btn">Закрыть</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref, watch, computed, onMounted} from 'vue';
	import {useCardsStore} from '../store/cardsStore.js';

	const searchQuery = ref('');
	const levelFilter = ref('');
	const showModal = ref(false);
	const {t} = useI18n()
	const cardsStore = useCardsStore();
	const ARTICLE_LIST = [
		'der', 'die', 'das', 'dem', 'den', 'des',
		'einem', 'einen', 'eines', 'einer', 'einem',
		'mein', 'dein', 'sein', 'ihr', 'unser', 'euer', 'ihr', 'Ihr',
		'meinem', 'meinen', 'meiner', 'meines',
		'deinem', 'deinen', 'deiner', 'deines',
		'seinem', 'seinen', 'seiner', 'seines',
		'ihrem', 'ihren', 'ihres',
		'unserem', 'unseren', 'unserer', 'unseres',
		'eurem', 'euren', 'eurer', 'eures'
	];
	const themenMap = {
		Home: "cardThemen.Home",
		Animals: "cardThemen.Animals",
		Clothes: "cardThemen.Clothes",
		Food: "cardThemen.Food",
		Body: "cardThemen.Body",
		Professions: "cardThemen.Professions",
		Transport: "cardThemen.Transport",
		Colors: "cardThemen.Colors",
		Nature: "cardThemen.Nature",
		City: "cardThemen.City",
		Time: "cardThemen.Time",
		Tools: "cardThemen.Tools",
		Sport: "cardThemen.Sport"
	};
	const form = ref({
		title: '',
		topic: '',
		level: '',
		sentence: '',
		translation: '',
	})
	const inputFields = [
		{
			key: 'level',
			type: 'number',
			placeholder: 'choiceTheme.difficult',
			required: false,
			min: 1,
			max: 10,
		},
		{
			key: 'sentence',
			type: 'textarea',
			placeholder: "choiceTheme.placeholder",
			required: true,
			rows: 2,
		},
		{
			key: 'translation',
			type: 'text',
			placeholder: 'choiceTheme.translate',
			required: false,
		},
	];

	const filteredCards = computed(() => {
		let list = cards.value;

		if (searchQuery.value && String(searchQuery.value).trim()) {
			list = list.filter(card => {
				const translatedTopic = card.topic ? t(themenMap[card.topic]) : '';
				return translatedTopic.toLowerCase().includes(searchQuery.value.toLowerCase());
			});
		}
		if (levelFilter.value) {
			const filterNum = Number(levelFilter.value);
			list = list.filter(card => Number(card.level) === filterNum);
		}
		return list;
	});

	const open = ref(false);
	const foundArticles = ref([]);
	const hiddenSentence = ref('');
	const cards = computed(() => cardsStore.cards)
	const currentGuess = ref(null);
	const userAnswers = ref([]);
	const guessResult = ref(null);

	const toggle = () => {
		open.value = !open.value;
	}

	const select = (key) => {
		form.value.topic = key;
		open.value = false;
	}

	function hideAllArticles(sentence) {
		if (!sentence) return {articles: [], newSentence: sentence};
		const regex = new RegExp(`\\b(${ARTICLE_LIST.join('|')})\\b`, 'gi');
		let articles = [];
		let newSentence = sentence.replace(regex, (match) => {
			articles.push(match);
			return '___';
		});
		return {articles, newSentence};
	}

	const createCard = async () => {
		if (!foundArticles.value.length) {
			showModal.value = true
			return;
		}
		await cardsStore.addCard({
			title: form.value.title,
			topic: form.value.topic,
			level: form.value.level ? Number(form.value.level) : null,
			sentence: form.value.sentence,
			translation: form.value.translation,
			articles: [...foundArticles.value],
			hiddenSentence: hiddenSentence.value
		});
		form.value = {
			title: '',
			topic: '',
			level: '',
			sentence: '',
			translation: ''
		};
		foundArticles.value = [];
		hiddenSentence.value = '';
	};

	function openGuess(card) {
		currentGuess.value = card;
		userAnswers.value = Array(card.articles.length).fill('');
		guessResult.value = null;
	}

	function makeGuess() {
		if (!currentGuess.value) return;
		const results = currentGuess.value.articles.map((art, idx) => {
			const user = (userAnswers.value[idx] || '').trim().toLowerCase();
			return {
				correct: user === art.toLowerCase(),
				answer: user
			};
		});
		guessResult.value = results;
	}

	function closeGuess() {
		currentGuess.value = null;
		userAnswers.value = [];
		guessResult.value = null;
	}

	watch(() => form.value.sentence, (sentence) => {
		const {articles, newSentence} = hideAllArticles(sentence);
		foundArticles.value = articles;
		hiddenSentence.value = newSentence;
	});

	onMounted(() => {
		cardsStore.subscribePublicCards()
	})
</script>

<style scoped>

	.cards__wrapper {
		display: flex;
		gap: 20px;
		align-items: flex-start;
		padding: 30px;
	}

	.form-block {
		flex: 1 1 320px;
		min-width: 320px;
		max-width: 420px;
	}

	.cards-block {
		flex: 1.4 1 420px;
		max-width: 740px;
		background: none;
		border: none;
		box-shadow: none;
		margin-top: 0.2em;
	}

	.cards-title {
		font-size: 1.27em;
		font-weight: 700;
		color: #282828;
		letter-spacing: 0.01em;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
		gap: 1.6em;
		margin-top: 0.5em;
	}

	.magic-card {
		border-radius: 18px;
		background: #fff;
		border: 1.5px solid #e4e4e4;
		box-shadow: 0 2px 12px 0 rgba(44, 57, 91, 0.10);
		transition: box-shadow 0.19s, border-color 0.15s, transform 0.17s;
		display: flex;
		align-items: stretch;
		min-height: 130px;
		padding: 0;
		margin: 0;
		overflow: hidden;
	}

	.magic-card:hover,
	.magic-card:focus-within {
		box-shadow: 0 8px 28px 0 rgba(54, 67, 91, 0.13);
		border-color: #c2b688;
		transform: translateY(-2px) scale(1.025);
		background: #f8f7f3;
	}

	.card-card-btn {
		border: none;
		background: transparent;
		width: 100%;
		height: 100%;
		min-height: 130px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
		padding: 1.5em 1.2em 1.1em 1.2em;
		text-align: left;
		cursor: pointer;
		outline: none;
		gap: 0.52em;
		transition: background 0.14s;
	}

	.input__area {
		resize: none;
		height: 140px;
	}

	.card-art-icon {
		font-size: 1.35em;
		margin-bottom: 0.5em;
		color: #edc16a;
		filter: drop-shadow(0 0 4px #f7e3b9);
	}

	.card-art-title {
		font-weight: 700;
		font-size: 1.17em;
		color: #333;
		margin-bottom: 0.32em;
		text-align: left;
	}

	.card-art-topic {
		text-align: center;
		font-size: 25px;
		font-family: "Montserrat", Arial, Helvetica, sans-serif;
		font-weight: 600;
		font-style: italic;
		color: #657c8a;
		opacity: 0.96;
		margin-bottom: 0.28em;
	}

	.card-art-level {
		font-size: 0.92em;
		color: #b59f69;
		opacity: 0.93;
	}

	@media (max-width: 900px) {
		.cards-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 1.2em;
		}

		.magic-card {
			min-height: 90px;
		}
	}

	.modal-overlay {
		position: fixed;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(60, 41, 10, 0.18);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
	}

	.modal {
		background: #fffbe5;
		border-radius: 15px;
		padding: 2.2em 2.6em 2em 2.6em;
		box-shadow: 0 3px 26px #8c640a1f;
		min-width: 300px;
		max-width: 98vw;
		border: 2.3px solid #e2c98d;
		position: relative;
	}

	.modal-title {
		font-size: 1.25em;
		color: #5c451a;
		margin-bottom: 0.9em;
		font-weight: 700;
		text-align: center;
		letter-spacing: 0.02em;
	}

	.modal-subinfo {
		display: flex;
		gap: 2em;
		justify-content: center;
		margin-bottom: 0.7em;
	}

	.modal-topic,
	.modal-level {
		font-size: 1em;
		color: #ad9437;
		opacity: 0.95;
	}

	.modal-sentence {
		font-size: 1.08em;
		margin-bottom: 0.9em;
		color: #413312;
		text-align: center;
	}

	.modal-translation {
		color: #a48b32;
		margin-bottom: 1.1em;
		text-align: center;
	}

	.guess-form {
		display: flex;
		flex-direction: column;
		gap: 0.75em;
	}

	.guess-field {
		margin-bottom: 0.23em;
	}

	.guess-input {
		width: 190px;
		font-size: 1.08em;
		margin-right: 0.6em;
		border-radius: 7px;
	}

	.guess-btn {
		margin-top: 0.8em;
		font-size: 1em;
		background: linear-gradient(97deg, #f1d37a 50%, #edd284 100%);
	}

	.close-btn {
		margin-top: 1.1em;
	}

	.guess-result {
		margin: 1em 0 0.8em 0;
	}

	.guess-answer {
		margin-bottom: 0.5em;
		font-size: 1em;
		text-align: left;
	}

	.guess-answer.correct {
		color: #31932b;
		font-weight: 700;
	}

	.guess-answer.wrong {
		color: #be2821;
		font-weight: 700;
	}

	.modal-original {
		margin-top: 1.2em;
		font-size: 0.98em;
		color: #88774c;
		text-align: left;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 0.7em;
		background: #fdf7ea;
		padding: 1.2em 1.5em 1.5em 1.5em;
		border-radius: 16px;
		box-shadow: 0 1px 12px #ebdec8a8;
		border: 2px solid #e3c992;
	}

	.input {
		border: 1.5px solid #b8a173;
		border-radius: 7px;
		padding: 10px 18px;
		font-size: 1.08em;
		margin-bottom: 0.35em;
		background: #fffdf9;
		outline: none;
		transition: border-color 0.2s;
	}

	.input:focus {
		border-color: #916e29;
	}

	.btn {
		background: linear-gradient(96deg, #e6cc80 55%, #fae29d 100%);
		color: #413312;
		border: none;
		border-radius: 8px;
		padding: 0.7em 1.5em;
		font-size: 1.08em;
		font-weight: 600;
		cursor: pointer;
		margin-top: 0.5em;
		transition: background 0.18s;
		box-shadow: 0 2px 6px #e2c98d39;
	}

	.btn:hover {
		background: linear-gradient(95deg, #f8e6a2 0%, #f6d97b 100%);
	}

	.no-cards {
		color: #a89c7c;
		padding: 1.5em 0 0.6em 0;
		font-size: 1.1em;
		text-align: center;
	}

	.custom-select {
		position: relative;
		width: 100%;
		margin-bottom: 0.7em;
		user-select: none;
	}

	.custom-select__trigger {
		background: #fcf6df;
		border: 2px solid #e2c98d;
		border-radius: 8px;
		padding: 0.55em 1.3em;
		font-size: 1em;
		color: #8e7a36;
		cursor: pointer;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		transition: background 0.16s, color 0.14s, border-color 0.15s;
	}

	.custom-select__trigger.open,
	.custom-select__trigger:hover {
		background: linear-gradient(96deg, #e6cc80 55%, #fae29d 100%);
		color: #564312;
		border-color: #d6b865;
		font-weight: 700;
	}

	.arrow {
		transform: scale(1);
		width: 30px;
		transition: .5s;
	}

	.arrow.open {
		transform: scale(-1);
		transition: .5s;
	}

	.custom-select__dropdown {
		position: absolute;
		top: calc(100% + 2px);
		left: 0;
		width: 100%;
		background: #fffbe5;
		border: 2px solid #e2c98d;
		border-radius: 8px;
		box-shadow: 0 4px 12px #e2c98d34;
		z-index: 10;
		padding: 0.25em 0;
	}

	.custom-select__option {
		padding: 0.55em 1.3em;
		font-size: 1em;
		color: #8e7a36;
		cursor: pointer;
		transition: background 0.13s, color 0.11s;
	}

	.custom-select__option.selected,
	.custom-select__option:hover {
		background: linear-gradient(96deg, #e6cc80 55%, #fae29d 100%);
		color: #564312;
		font-weight: 700;
	}

	/* --------------- */
	.custom-topic-list {
		margin-bottom: 1.1em;
	}

	.custom-topic-label {
		font-weight: 600;
		margin-bottom: 0.55em;
		font-size: 1.02em;
		color: #7e6519;
	}

	.custom-topic-placeholder {
		margin-top: 0.6em;
		color: #b3a46a;
		font-size: 0.96em;
	}

	.search-bar {
		display: flex;
		gap: 0.7em;
		align-items: center;
		margin-bottom: 1.3em;
	}

	.search-level {
		width: 200px;
	}

	.back-btn {
		display: inline-block;
		background: linear-gradient(96deg, #f7e1a7 55%, #e6cc80 100%);
		color: #70521a;
		font-weight: 700;
		padding: 0.7em 2em;
		border-radius: 13px;
		font-size: 1.11em;
		letter-spacing: 0.03em;
		text-decoration: none;
		box-shadow: 0 3px 15px #e6cc8030;
		border: 2px solid #e2c98d;
		transition: background 0.18s, color 0.18s, box-shadow 0.18s;
		margin-bottom: 1.4em;
		margin-top: 0.2em;
	}

	.back-btn:hover, .back-btn:focus {
		background: linear-gradient(95deg, #fae29d 60%, #e6cc80 100%);
		color: #44310f;
		box-shadow: 0 8px 22px #e2c98d55;
		border-color: #c2b688;
	}

</style>
