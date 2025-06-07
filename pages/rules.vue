<template>
	<main class="rules">
		<header class="rules__hero">
			<h1 class="rules__title">
				Основные правила использования артиклей в немецком языке
			</h1>
			<p class="rules__subtitle">
				Краткая и понятная шпаргалка для всех, кто хочет научиться правильно ставить der, die, das!
			</p>
		</header>

		<section class="rules__list" aria-label="Список правил использования артиклей">
			<article class="rules__card" id="gender">
				<h2 class="rules__card-title">1. Артикль зависит от рода существительного</h2>
				<ul class="rules__list-ul">
					<li class="rules__list-item">
						<strong>der</strong> — мужской род <span class="rules__tip">(der Tisch — стол)</span>
					</li>
					<li class="rules__list-item">
						<strong>die</strong> — женский род <span class="rules__tip">(die Lampe — лампа)</span>
					</li>
					<li class="rules__list-item">
						<strong>das</strong> — средний род <span class="rules__tip">(das Buch — книга)</span>
					</li>
				</ul>
				<p class="rules__desc">
					Род существительного почти всегда нужно запоминать вместе со словом!
				</p>
			</article>

			<article class="rules__card" id="plural">
				<h2 class="rules__card-title">2. Во множественном числе всегда <strong>die</strong></h2>
				<p class="rules__desc">
					Независимо от рода в единственном числе, во множественном всегда используется <strong>die</strong>.
				</p>
				<p class="rules__example">
					der Hund <strong>→ die Hunde</strong><br>
					das Kind <strong>→ die Kinder</strong>
				</p>
			</article>

			<article class="rules__card" id="cases">
				<h2 class="rules__card-title">3. Артикли меняются по падежам</h2>
				<p class="rules__desc">
					В немецком языке 4 падежа, и для каждого рода формы артикля будут разные. Вот таблица для
					определённых артиклей:
				</p>
				<table class="rules__table">
					<thead>
					<tr>
						<th scope="col">Падеж</th>
						<th scope="col">Мужской</th>
						<th scope="col">Женский</th>
						<th scope="col">Средний</th>
						<th scope="col">Множественное</th>
					</tr>
					</thead>
					<tbody>
					<tr>
						<th scope="row">Именительный (кто? что?)</th>
						<td>der</td>
						<td>die</td>
						<td>das</td>
						<td>die</td>
					</tr>
					<tr>
						<th scope="row">Родительный (кого? чего?)</th>
						<td>des</td>
						<td>der</td>
						<td>des</td>
						<td>der</td>
					</tr>
					<tr>
						<th scope="row">Дательный (кому? чему?)</th>
						<td>dem</td>
						<td>der</td>
						<td>dem</td>
						<td>den</td>
					</tr>
					<tr>
						<th scope="row">Винительный (кого? что?)</th>
						<td>den</td>
						<td>die</td>
						<td>das</td>
						<td>die</td>
					</tr>
					</tbody>
				</table>
			</article>

			<article class="rules__card" id="exceptions">
				<h2 class="rules__card-title">4. Исключения и особенности</h2>
				<ul class="rules__list-ul">
					<li class="rules__list-item">
						Существительные на <strong>-chen</strong> и <strong>-lein</strong> — всегда средний род (<i>das
						Mädchen</i> — девочка).
					</li>
					<li class="rules__list-item">
						Дни недели, месяцы, времена года — всегда мужской род (<i>der Montag, der Januar</i>).
					</li>
					<li class="rules__list-item">
						Большинство деревьев и цветов — женский род (<i>die Rose, die Eiche</i>).
					</li>
					<li class="rules__list-item">
						Существительные, начинающиеся с Ge- и оканчивающиеся на -e, часто среднего рода (<i>das
						Gebäude</i> — здание).
					</li>
				</ul>
			</article>
			<article class="rules__card" id="tips">
				<h2 class="rules__card-title">5. Лайфхаки для запоминания</h2>
				<ul class="rules__list-ul">
					<li class="rules__list-item">
						Всегда учи существительные с артиклем: <strong>der Tisch</strong>, <strong>die Lampe</strong>,
						<strong>das Buch</strong>.
					</li>
					<li class="rules__list-item">
						Веди личный словарь с цветовым кодом (например: синий — der, красный — die, жёлтый — das).
					</li>
					<li class="rules__list-item">
						Запоминай окончания, характерные для рода (например, слова на -ung, -heit, -keit — почти всегда
						женский род).
					</li>
				</ul>
			</article>
			<article class="rules__card" id="quiz">
				<h2 class="rules__card-title">6. Проверь себя!</h2>
				<p class="rules__desc">
					Впиши правильный артикль (der, die или das), основываясь на лайфхаках выше, и нажми «Проверить».
				</p>
				<div class="quiz-form">
					<div class="quiz-item" v-for="(word, index) in quizWords" :key="index">
						<label :for="'word-' + index">{{ word.word }} <span class="rules__tip">({{ word.hint }})</span></label>
						<div class="quiz__content__inner">
							<input
								:id="'word-' + index"
								v-model="userAnswers[index]"
								type="text"
								placeholder="der / die / das"
								class="quiz-input"
							/>
							<span v-if="showResults"
							      :class="{'correct': isCorrect(index), 'incorrect': !isCorrect(index)}">
								{{ isCorrect(index) ? '✔️' : '❌ (правильно: ' + word.article + ')' }}
							</span>
						</div>
					</div>
					<div class="quiz__button-el">
						<button @click="checkAnswers" class="quiz-button">Проверить</button>
						<img @click="resetResult" class="queiz__undo-icon" src="../assets/images/undo.svg" alt="">
					</div>
				</div>
			</article>
		</section>
	</main>
</template>


<script setup>

	const quizWords = [
		{word: 'Zeitung', article: 'die', hint: 'окончание -ung'},
		{word: 'Gesundheit', article: 'die', hint: 'окончание -heit'},
		{word: 'Freundlichkeit', article: 'die', hint: 'окончание -keit'},
		{word: 'Mädchen', article: 'das', hint: 'окончание -chen'},
		{word: 'Fräulein', article: 'das', hint: 'окончание -lein'},
		{word: 'Gebäude', article: 'das', hint: 'начало Ge-, окончание -e'},
		{word: 'Montag', article: 'der', hint: 'день недели'},
		{word: 'Rosen', article: 'die', hint: 'цветы, множественное число'},
		{word: 'Lampe', article: 'die', hint: 'окончание -e'},
	]

	const userAnswers = ref(Array(quizWords.length).fill(''))
	const showResults = ref(false)

	function checkAnswers() {
		showResults.value = true
	}

	function isCorrect(index) {
		return userAnswers.value[index].trim().toLowerCase() === quizWords[index].article
	}

	const resetResult = () => {
		showResults.value = null
	}

	definePageMeta({
		layout: 'footerlayout',
	})
</script>

<style scoped>

	.quiz-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 15px;
	}

	.quiz__content__inner {
		display: flex;
		align-items: center;
	}

	.quiz-item {
		display: flex;
		flex-direction: column;
	}

	.quiz__button-el {
		display: flex;
		align-items: center;
		margin-top: 15px;
	}

	.quiz-input {
		width: 50%;
		margin-top: 6px;
		padding: 8px 10px;
		border-radius: 8px;
		border: 1px solid #b3b8f0;
		font-size: 1rem;
	}

	.queiz__undo-icon {
		width: 30px;
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.queiz__undo-icon:hover {
		transform: scale(1.1);
	}

	.quiz-button {
		width: 200px;
		margin-right: 15px;
		padding: 10px 18px;
		background-color: #4044b2;
		color: white;
		font-style: italic;

		border: none;
		border-radius: 8px;
		font-size: 1rem;
		cursor: pointer;
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		transition: background-color 0.2s;
		font-family: 'Inter', sans-serif;
		font-weight: 900;
	}

	.quiz-button:hover {
		background-color: #2e318c;
	}

	.correct {
		color: green;
		margin-top: 4px;
	}

	.incorrect {
		color: red;
		margin-top: 4px;
	}


	.correct {
		color: green;
		margin-top: 4px;
	}

	.incorrect {
		color: red;
		margin-top: 4px;
	}


	.rules {
		background: radial-gradient(circle at 50% 10%, #e3e9ff 0%, #d1d8f7 100%);
		min-height: 100vh;
		padding-bottom: 64px;
		font-family: 'Segoe UI', 'Roboto', sans-serif;
		color: #2e325a;
	}

	.rules__hero {
		padding: 50px 0 30px 0;
		text-align: center;
	}

	.rules__title {
		font-size: 2.4rem;
		font-weight: 900;
		margin-bottom: 12px;
		letter-spacing: 1px;
		color: #4044b2;
		text-shadow: 0 0 6px rgba(100, 120, 255, 0.5), 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.rules__subtitle {
		font-size: 1.25rem;
		color: #585a9d;
		margin-bottom: 10px;
		font-weight: 500;
		text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
	}

	.rules__list {
		max-width: 880px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 35px;
		padding: 20px 15px 0 15px;
	}

	.rules__card {
		background: linear-gradient(145deg, #f0f3ff, #dce1fb);
		border-radius: 18px;
		border: 2px solid #b3b8f0;
		box-shadow: 0 8px 16px rgba(80, 90, 200, 0.3),
		inset 0 1px 0 rgba(255, 255, 255, 0.6);
		padding: 30px 25px;
		transition: transform 0.2s, box-shadow 0.2s;
		cursor: default;
	}

	.rules__card-title {
		font-size: 1.5rem;
		color: #4044b2;
		margin-bottom: 12px;
		text-shadow: 0 0 4px rgba(100, 120, 255, 0.5);
	}

	.rules__list-ul {
		margin: 0 0 12px 20px;
		padding: 0;
		list-style: disc;
	}

	.rules__list-item {
		margin-bottom: 8px;
		line-height: 1.5;
	}

	.rules__desc {
		color: #4a4d8c;
		margin: 9px 0 5px 0;
		font-size: 1.05rem;
	}

	.rules__example {
		color: #565aa5;
		font-size: 1rem;
		margin: 6px 0 0 0;
		line-height: 1.6;
		background: #f3f5ff;
		padding: 12px;
		border-radius: 12px;
		border: 1px solid #c7ccf3;
		box-shadow: inset 0 1px 3px rgba(200, 210, 255, 0.5);
	}

	.rules__tip {
		font-weight: 600;
		color: #565aa5;
		font-size: 20px;
		margin-left: 4px;
		font-style: italic;
	}

	.rules__table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 12px;
		font-size: 1rem;
		background: #f3f5ff;
		border: 2px solid #b3b8f0;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(80, 90, 200, 0.2);
	}

	.rules__table th,
	.rules__table td {
		border: 1px solid #d2d7fa;
		padding: 10px 14px;
		text-align: center;
	}

	.rules__table th {
		background: linear-gradient(145deg, #e8eaff, #d6d9f7);
		color: #4044b2;
		font-weight: 700;
		text-shadow: 0 0 4px rgba(100, 120, 255, 0.4);
	}

	@media (max-width: 700px) {
		.rules__title {
			font-size: 1.6rem;
		}

		.rules__hero {
			padding: 30px 0 20px 0;
		}

		.rules__card {
			padding: 18px 12px;
		}

		.rules__card-title {
			font-size: 1.3rem;
		}

		.rules__table th,
		.rules__table td {
			font-size: 0.9rem;
			padding: 6px 5px;
		}
	}
</style>


