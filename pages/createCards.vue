<template>
	<div class="cards-layout">
		<div class="header-bar">
			<NuxtLink to="/" class="back-btn">
				← {{ t('selectedpage.backBtn') }}
			</NuxtLink>
		</div>
		<div class="cards__wrapper">
			<div class="form-block">
				<h2 class="title">{{ editingCardId ? 'Редактирование' : t('choiceTheme.create') }}</h2>
				<form @submit.prevent="saveCard" class="form">
					<div class="custom-topic-list">
						<div class="custom-topic-label">{{ t('choiceTheme.theme')}}</div>
						<div class="custom-select" tabindex="0" @blur="open = false">
							<div class="custom-select__trigger" @click="toggle" :class="{ open }">
								<span>{{ form.topic ? t(themenMap[form.topic]) : t('choiceTheme.choice') }}</span>
								<img :class="{ open }" class="arrow" src="../assets/images/arrowNav.svg" alt="arrow">
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
					</div>
					<template v-for="field in inputFields" :key="field.key">
						<template v-if="field.type === 'textarea'">
                        <textarea
								v-model="form[field.key]"
								:placeholder="t(field.placeholder)"
								:required="field.required"
								:rows="field.rows || 3"
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
					<div class="form-actions">
						<button type="submit" class="btn">{{ editingCardId ? 'Сохранить изменения' : t('choiceTheme.btn')}}</button>
						<button v-if="editingCardId" type="button" @click="resetForm" class="btn btn-secondary">Отмена</button>
					</div>
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
							v-for="card in filteredCards"
							:key="card.id"
							class="card-scene"
					>
						<div
								class="magic-card"
								:class="{'is-flipped': flippedCardId === card.id}"
								@click="!isCardFlipped(card.id) && flipCard(card)"
						>
							<div class="card-face card-front">
								<div class="card-actions">
									<button @click.stop="initiateEdit(card)" class="action-btn edit-btn" title="Редактировать">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
									</button>
									<button @click.stop="initiateDelete(card)" class="action-btn delete-btn" title="Удалить">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
									</button>
								</div>
								<div class="card-content">
									<div v-if="card.topic" class="card-topic">{{ t(themenMap[card.topic]) }}</div>
								</div>
								<div class="card-footer">
									<div v-if="card.level" class="card-level">
										<span class="level-icon">⚡️</span> {{ t('choiceTheme.difficult')}} {{ card.level }}
									</div>
								</div>
							</div>
							<div class="card-face card-back">
								<button @click.stop="unflipCard()" class="card-close-btn">×</button>
								<div class="card-back-content">
									<div class="modal-sentence">
										{{ card.hiddenSentence }}
									</div>
									<form v-if="!guessResult" @submit.prevent="makeGuess" class="guess-form">
										<div v-for="(pos, idx) in card.articles" :key="idx" class="guess-field">
											<input
													v-model="userAnswers[idx]"
													class="input guess-input"
													required
													autocomplete="off"
													@click.stop
											/>
										</div>
										<button type="submit" class="btn guess-btn" @click.stop>Проверить</button>
									</form>
									<div v-else class="guess-result">
										<div
												v-for="(art, idx) in card.articles"
												:key="'result' + idx"
												class="guess-answer"
												:class="{
                                    correct: guessResult[idx] && guessResult[idx].correct,
                                    wrong: guessResult[idx] && !guessResult[idx].correct,
                                 }"
										>
											<b>Пропуск {{ idx + 1 }}:</b>
											<span v-if="guessResult[idx]?.correct"> Верно!</span>
											<span v-else> Ошибка! (Правильно: {{ card.articles[idx] }})</span>
										</div>
										<button @click.stop="unflipCard(true)" class="btn close-btn">Дальше</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {ref, watch, computed, onMounted} from 'vue';
	import {useCardsStore} from '../store/cardsStore.js';
	const editingCardId = ref(null);
	const defaultFormState = { title: '', topic: '', level: '', sentence: '', translation: '' };
	const form = ref({...defaultFormState});
	const searchQuery = ref('');
	const levelFilter = ref('');
	const {t} = useI18n();
	const cardsStore = useCardsStore();
	const ARTICLE_LIST = [ 'der', 'die', 'das', 'dem', 'den', 'des', 'einem', 'einen', 'eines', 'einer', 'mein', 'dein', 'sein', 'ihr', 'unser', 'euer', 'Ihr', 'meinem', 'meinen', 'meiner', 'meines', 'deinem', 'deinen', 'deiner', 'deines', 'seinem', 'seinen', 'seiner', 'seines', 'ihrem', 'ihren', 'ihres', 'unserem', 'unseren', 'unserer', 'unseres', 'eurem', 'euren', 'eurer', 'eures' ];
	const themenMap = { Home: "cardThemen.Home", Animals: "cardThemen.Animals", Clothes: "cardThemen.Clothes", Food: "cardThemen.Food", Body: "cardThemen.Body", Professions: "cardThemen.Professions", Transport: "cardThemen.Transport", Colors: "cardThemen.Colors", Nature: "cardThemen.Nature", City: "cardThemen.City", Time: "cardThemen.Time", Tools: "cardThemen.Tools", Sport: "cardThemen.Sport" };
	const inputFields = [ { key: 'level', type: 'number', placeholder: 'choiceTheme.difficult', required: false, min: 1, max: 10, }, { key: 'sentence', type: 'textarea', placeholder: "choiceTheme.placeholder", required: true, rows: 2, }, { key: 'translation', type: 'text', placeholder: 'choiceTheme.translate', required: false, }, ];
	const open = ref(false);
	const foundArticles = ref([]);
	const hiddenSentence = ref('');
	const toggle = () => { open.value = !open.value; };
	const select = (key) => { form.value.topic = key; open.value = false; };
	function hideAllArticles(sentence) { if (!sentence) return {articles: [], newSentence: sentence}; const regex = new RegExp(`\\b(${ARTICLE_LIST.join('|')})\\b`, 'gi'); let articles = []; let newSentence = sentence.replace(regex, (match) => { articles.push(match); return '___'; }); return {articles, newSentence}; }
	watch(() => form.value.sentence, (sentence) => { const {articles, newSentence} = hideAllArticles(sentence); foundArticles.value = articles; hiddenSentence.value = newSentence; });

	const cards = computed(() => cardsStore.cards);
	const filteredCards = computed(() => {
		let list = cards.value;
		if (searchQuery.value && String(searchQuery.value).trim()) { list = list.filter(card => { const translatedTopic = card.topic ? t(themenMap[card.topic]) : ''; return translatedTopic.toLowerCase().includes(searchQuery.value.toLowerCase()); }); }
		if (levelFilter.value) { const filterNum = Number(levelFilter.value); list = list.filter(card => Number(card.level) === filterNum); }
		return list;
	});

	const flippedCardId = ref(null);
	const userAnswers = ref([]);
	const guessResult = ref(null);
	const isCardFlipped = (cardId) => { return flippedCardId.value === cardId; }
	const flipCard = (card) => { if (flippedCardId.value && flippedCardId.value !== card.id) { unflipCard(); } flippedCardId.value = card.id; userAnswers.value = Array(card.articles.length).fill(''); guessResult.value = null; };
	const unflipCard = (force = false) => { if (force || !guessResult.value) { flippedCardId.value = null; guessResult.value = null; userAnswers.value = []; } else { flippedCardId.value = null; } };
	const makeGuess = () => { const currentCard = cards.value.find(c => c.id === flippedCardId.value); if (!currentCard) return; const results = currentCard.articles.map((art, idx) => { const user = (userAnswers.value[idx] || '').trim().toLowerCase(); return { correct: user === art.toLowerCase(), answer: user }; }); guessResult.value = results; };

	onMounted(() => { cardsStore.subscribePublicCards() })

	// --- ЛОГИКА ДЛЯ ФОРМЫ И УПРАВЛЕНИЯ ---

	const resetForm = () => {
		form.value = {...defaultFormState};
		editingCardId.value = null;
		foundArticles.value = [];
		hiddenSentence.value = '';
	};

	const saveCard = async () => {
		if (!foundArticles.value.length) {
			alert("В предложении нет артиклей для изучения!");
			return;
		}

		const cardData = {
			title: form.value.title,
			topic: form.value.topic,
			level: form.value.level ? Number(form.value.level) : null,
			sentence: form.value.sentence,
			translation: form.value.translation,
			articles: [...foundArticles.value],
			hiddenSentence: hiddenSentence.value
		};

		if (editingCardId.value) {
			await cardsStore.updateCard({ ...cardData, id: editingCardId.value });
		} else {
			await cardsStore.addCard(cardData);
		}

		resetForm();
	};

	const initiateEdit = (card) => {
		editingCardId.value = card.id;
		form.value.title = card.title;
		form.value.topic = card.topic;
		form.value.level = card.level;
		form.value.sentence = card.sentence;
		form.value.translation = card.translation;
		document.querySelector('.form-block').scrollIntoView({ behavior: 'smooth' });
	};

	const initiateDelete = async (card) => {
		if (confirm(`Вы уверены, что хотите удалить карточку по теме "${t(themenMap[card.topic])}"?`)) {
			await cardsStore.removeCard(card.id);
		}
	};
</script>

<style scoped>
	/* Общие стили */
	.cards-layout { background-color: #F6F7FB; min-height: 100vh; padding: 1.5rem; }
	.title { font-size: 1.75rem; font-weight: 700; color: #303545; margin-bottom: 1.5rem; }
	.input { background-color: #FFFFFF; border: 1px solid #EAEBEE; border-radius: 8px; padding: 12px 16px; font-size: 1rem; color: #303545; width: 100%; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s; }
	.input:focus { outline: none; border-color: #4255FF; box-shadow: 0 0 0 3px rgba(66, 85, 255, 0.2); }
	.btn { background-color: #4255FF; color: #FFFFFF; border: none; border-radius: 8px; padding: 12px 24px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: background-color 0.2s, transform 0.1s; }
	.btn:hover { background-color: #3546e0; }
	.btn:active { transform: translateY(1px); }
	.btn-secondary { background-color: #6A758B; }
	.btn-secondary:hover { background-color: #5a6268; }

	.back-btn { display: inline-block; color: #6A758B; font-weight: 600; text-decoration: none; padding: 8px 16px; border-radius: 8px; transition: background-color 0.2s, color 0.2s; margin-bottom: 1rem; }
	.back-btn:hover { background-color: #EAEBEE; color: #303545; }

	/* Разметка */
	.cards__wrapper { display: flex; gap: 2.5rem; align-items: flex-start; max-width: 1400px; margin: 0 auto; }
	.form-block { flex: 1 1 350px; max-width: 400px; position: sticky; top: 1.5rem; }
	.cards-block { flex: 2 1 600px; }

	/* Форма */
	.form { background-color: #FFFFFF; padding: 1.5rem; border-radius: 12px; border: 1px solid #EAEBEE; display: flex; flex-direction: column; gap: 1rem; }
	.input__area {
		resize: vertical; /* ИЗМЕНЕНИЕ 3: Разрешаем тянуть по вертикали */
		min-height: 100px; /* Немного увеличим базовую высоту */
		font-family: inherit;
	}
	.form-actions { display: flex; gap: 1rem; }

	/* Select */
	.custom-topic-label { font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; color: #303545; }
	.custom-select { position: relative; user-select: none; }
	.custom-select__trigger { background: #FFFFFF; border: 1px solid #EAEBEE; border-radius: 8px; padding: 12px 16px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: border-color 0.2s; }
	.custom-select__trigger:hover, .custom-select__trigger.open { border-color: #4255FF; }
	.arrow { width: 16px; transition: transform 0.3s; }
	.arrow.open { transform: rotate(180deg); }
	.custom-select__dropdown { position: absolute; top: calc(100% + 4px); left: 0; width: 100%; background: #FFFFFF; border: 1px solid #EAEBEE; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); z-index: 10; max-height: 200px; overflow-y: auto; }
	.custom-select__option { padding: 12px 16px; cursor: pointer; }
	.custom-select__option:hover { background-color: #F6F7FB; }
	.custom-select__option.selected { background-color: #4255FF; color: #FFFFFF; font-weight: 600; }

	/* Блок с карточками */
	.search-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
	.search-level { max-width: 150px; }
	.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }

	/* Стили для переворота */
	.card-scene {
		perspective: 1000px;
		min-height: 220px; /* ИЗМЕНЕНИЕ 1: Увеличили минимальную высоту карточек */
	}
	.magic-card { width: 100%; height: 100%; position: relative; transition: transform 0.6s; transform-style: preserve-3d; cursor: pointer; border-radius: 12px; }
	.magic-card.is-flipped { transform: rotateY(180deg); cursor: default; }
	.card-face { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; flex-direction: column; background: #FFFFFF; border-radius: 12px; border: 1px solid #EAEBEE; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
	.card-scene:hover .magic-card:not(.is-flipped) .card-face { border-color: #4255FF; box-shadow: 0 8px 16px rgba(0,0,0,0.08); }
	.card-back { transform: rotateY(180deg); justify-content: center; }

	/* Управление на карточке */
	.card-actions { position: absolute; top: 0.75rem; right: 0.75rem; display: flex; gap: 0.5rem; opacity: 0; transition: opacity 0.2s ease-in-out; z-index: 2; }
	.card-scene:hover .card-actions { opacity: 1; }
	.action-btn { background-color: rgba(255, 255, 255, 0.7); border: 1px solid #EAEBEE; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6A758B; backdrop-filter: blur(2px); }
	.action-btn:hover { background-color: #FFFFFF; border-color: #4255FF; color: #4255FF; }
	.action-btn.delete-btn:hover { border-color: #DC3545; color: #DC3545; }

	/* Контент карточки */
	.card-content { padding: 1.5rem; flex-grow: 1; display: flex; align-items: center; justify-content: center; }
	.card-topic { font-size: 1.5rem; font-weight: 600; color: #303545; text-align: center; }
	.card-footer { padding: 0.75rem 1.5rem; border-top: 1px solid #EAEBEE; background-color: #F6F7FB; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; }
	.card-level { font-size: 0.9rem; color: #6A758B; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; }
	.level-icon { font-size: 1.1rem; }

	/* Обратная сторона карточки */
	.card-close-btn { position: absolute; top: 0.5rem; right: 0.75rem; background: none; border: none; font-size: 1.75rem; color: #6A758B; cursor: pointer; line-height: 1; z-index: 2; }
	.card-back-content {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
		overflow-y: auto; /* ИЗМЕНЕНИЕ 2: Добавляем скролл, если контент не влезает */
		max-height: 100%;
	}
	.modal-sentence {
		font-size: 1.25rem;
		font-family: "Georgia", serif;
		color: #303545;
		margin-bottom: 1rem;
		word-break: break-word; /* ИЗМЕНЕНИЕ 2: Заставляем текст переноситься */
		overflow-wrap: break-word; /* ИЗМЕНЕНИЕ 2: И его более современный аналог */
	}
	.guess-form { width: 100%; display: flex; flex-direction: column; gap: 0.75rem; align-items: center;}
	.guess-input { font-size: 1rem; max-width: 200px; text-align: center;}
	.guess-btn { margin-top: 0.5rem; }
	.guess-result { width: 100%; text-align: left; margin-top: 1rem; }
	.guess-answer { padding: 0.5rem; border-radius: 6px; margin-bottom: 0.5rem; font-size: 0.9rem;}
	.guess-answer.correct { color: #28a745; background-color: rgba(40, 167, 69, 0.1); }
	.guess-answer.wrong { color: #dc3545; background-color: rgba(220, 53, 69, 0.1); }
	.close-btn { width: 100%; margin-top: 1rem; background-color: #6A758B; }
	.close-btn:hover { background-color: #5a6268; }

	/* Адаптивность */
	@media (max-width: 900px) {
		.cards__wrapper { flex-direction: column; align-items: stretch; gap: 2rem; }
		.form-block { position: static; max-width: none; }
	}
</style>