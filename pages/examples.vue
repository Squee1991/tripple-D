<template>
	<main class="theory-main">
		<section class="theory-hero">
			<div class="theory-hero-content">
				<h1 class="theory-title">
					{{ t('examples.label')}}
					<span class="theory-title-accent">Der</span>
					<span class="theory-title-accent die">Die</span>
					<span class="theory-title-accent das">Das</span>
				</h1>
				<p class="theory-subtitle">
					{{ t('examples.title')}}
				</p>
			</div>
		</section>
		<section id="start-theory" class="theory-sections">
			<article class="theory-card" id="intro">
				<h2 class="theory-card-title"> {{ t('examplesFirstBlock.title')}}</h2>
				<p class="theory-card-text">
					{{ t('examplesFirstBlock.subtext')}}
				</p>
			</article>
			<article class="theory-card" id="types">
				<h2 class="theory-card-title">{{ t('examplesSecondBlock.title')}}</h2>
				<ul class="theory-list">
					<li v-for="item in data.items" :key="item.id" class="theory-list-item">
						<span>{{ t(item.itemTitle)}}</span>: <i>der, die, das</i><br>
						<span class="theory-desc">
							{{ t(item.itemInfo)}}<br>
							<span class="theory-example">{{t(item.example)}} <b>die</b> Katze schläft. — <b></b> {{ t(item.partTwo)}}</span>
						</span>
					</li>
				</ul>
			</article>
			<article class="theory-card" id="indefinite-article">
				<h2 class="theory-card-title">{{ t('exampleThirdBlock.label')}}</h2>
				<p class="theory-card-text">{{ t('exampleThirdBlock.subtext')}}</p>
				<ul class="theory-list">
					<li v-for="item in data.itemSecond" :key="item.id" class="theory-list-item">
						<span> {{t(item.value)}} <b>{{t(item.article)}}</b></span>
						<span class="theory-example">{{ t(item.example)}} <b>ein Hund</b> {{t(item.sexExample)}}</span>
					</li>
				</ul>
				<div class="theory-card-text">
					<span class="theory__important"> {{t('exampleThirdBlock.important')}}</span>
					<div> - Ich sehe Bücher</div>
				</div>
			</article>
			<article class="theory-card" id="table">
				<h2 class="theory-card-title">{{ t('exampleTabele.label') }}</h2>
				<table class="theory-table">
					<thead class="theory-table-head">
					<tr class="theory-table-row">
						<th class="theory-table-cell">{{ t('exampleTabele.family') }}</th>
						<th class="theory-table-cell">{{ t('exampleTabele.definite') }}</th>
						<th class="theory-table-cell">{{ t('exampleTabele.NotDefinite') }}</th>
					</tr>
					</thead>
					<tbody class="theory-table-body">
					<tr v-for="tr in data.tabele" :key="tr.id" class="theory-table-row">
						<td class="theory-table-cell">{{ t(tr.sex) }}</td>
						<td class="theory-table-cell">{{ t(tr.article) }}</td>
						<td class="theory-table-cell">{{ t(tr.notDefiniteArticle) }}</td>
					</tr>
					</tbody>

				</table>
			</article>
			<article class="theory-card" id="examples">
				<h2 class="theory-card-title">Примеры с артиклями</h2>
				<ul class="theory-list">
					<li class="theory-list-item"><b>der Hund</b> — собака (м.р.)</li>
					<li class="theory-list-item"><b>die Katze</b> — кошка (ж.р.)</li>
					<li class="theory-list-item"><b>das Haus</b> — дом (ср.р.)</li>
				</ul>
			</article>
			<!--			<article class="theory-card" id="quiz">-->
			<!--				<h2 class="theory-card-title">Мини-квиз</h2>-->
			<!--				<p class="theory-card-text">Скоро тут появится интерактивная проверка знаний 👀</p>-->
			<!--			</article>-->
			<!--			<div class="theory-actions">-->
			<!--				<NuxtLink to="/selectedTopics" class="theory-btn theory-btn-next">Перейти к практике</NuxtLink>-->
			<!--			</div>-->
		</section>
	</main>
</template>


<script setup>
	const {t} = useI18n()
	const data = {
		items: [
			{
				id: 1,
				itemTitle: "examplesSecondBlock.first",
				itemInfo: "examplesSecondBlock.exampleTitle",
				example: "examplesSecondBlock.example",
				partTwo: "examplesSecondBlock.exampleSecondhalf"

			},
			{
				id: 2,
				itemTitle: "examplesSecondBlock.second",
				itemInfo: "examplesSecondBlock.exampleSecondTitle",
				example: "examplesSecondBlock.example",
				partTwo: "examplesSecondBlock.exampleNotDefinite"
			},
		],
		itemSecond: [
			{
				id: 1,
				value: "exampleThirdBlock.man",
				example: "exampleThirdBlock.example",
				sexExample: "exampleThirdBlock.mExample",
				article: "ein"
			},
			{
				id: 2,
				value: "exampleThirdBlock.woman",
				example: "examplesSecondBlock.example",
				sexExample: "exampleThirdBlock.wExample",
				article: "eine"
			},
			{
				id: 3,
				value: "exampleThirdBlock.is",
				example: "examplesSecondBlock.example",
				sexExample: "exampleThirdBlock.isExample",
				article: "ein"
			},
		],
		tabele: [
			{
				id: 1,
				sex: "exampleTabele.m",
				article: "der",
				notDefiniteArticle: "ein"
			},
			{
				id: 2,

				sex: "exampleTabele.w",
				article: "die",
				notDefiniteArticle: "eine"
			},
			{
				id: 3,
				sex: "exampleTabele.is",
				article: "das",
				notDefiniteArticle: "ein"
			},
		]
	}

	definePageMeta({
		layout: 'footerlayout',
	})
</script>

<style scoped>

	.theory-main {
		background: #e8e9ff;
		min-height: 100vh;
		padding-bottom: 64px;
	}

	.theory-hero {
		padding: 70px 0 40px 0;
		text-align: center;
	}

	.theory-hero-content {
		max-width: 680px;
		margin: 0 auto;
	}

	.theory-title {
		font-size: 40px;
		font-weight: 800;
		margin-bottom: 18px;
		letter-spacing: 1px;
		line-height: 1.2;
		color: #1c1458;
		font-family: 'Inter', sans-serif;
		font-style: italic;
	}

	.theory-title-accent {
		font-weight: 900;
	}

	.theory-title-accent.die {
		color: #e53e3e;
		margin-left: 4px;
	}

	.theory-title-accent.das {
		color: #eab308;
		margin-left: 4px;
	}

	.theory-subtitle {
		font-size: 1.5rem;
		color: #4b3bbd;
		margin-bottom: 32px;
		font-weight: 500;
		line-height: 1.4;
	}

	.theory__important {
		font-weight: bold;
		font-size: 22px;
		border-bottom: 3px solid red;
	}

	.theory-btn {
		display: inline-block;
		background: linear-gradient(90deg, #6b7cff, #5172e0);
		color: #fff;
		font-family: 'Inter', sans-serif;
		padding: 14px 44px;
		border-radius: 14px 30px 14px 30px / 30px 14px 30px 14px;
		font-size: 1.1rem;
		font-weight: 700;
		text-decoration: none;
		box-shadow: 0 4px 18px #b5baf7a0;
		transition: background .2s, transform .12s;
	}

	.theory-btn:hover,
	.theory-btn:focus {
		background: linear-gradient(90deg, #5172e0, #6b7cff);
		transform: translateY(-2px) scale(1.04);
	}

	.theory-sections {
		display: flex;
		flex-direction: column;
		gap: 36px;
		max-width: 860px;
		margin: 0 auto;
		padding: 28px 12px 0 12px;
	}

	.theory-card {
		background: #fff;
		border-radius: 18px;
		box-shadow: 0 6px 24px rgba(130, 130, 255, 0.25);
		padding: 30px 26px;
		margin-bottom: 0;
		font-size: 1.15rem;
		line-height: 1.6;
		color: #333;
		border: 1px solid #dcdcff;
	}

	.theory-card-title {
		font-size: 1.5rem;
		color: #3c2db5;
		margin-bottom: 16px;
		font-weight: 700;
	}

	.theory-card-text {
		font-size: 1.15rem;
		color: #333;
		line-height: 1.6;
		margin-bottom: 14px;
	}

	.theory-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.theory-list-item {
		margin-bottom: 12px;
		font-size: 1.15rem;
		color: #333;
		line-height: 1.5;
	}

	.theory-desc {
		display: block;
		color: #4e51a0;
		font-size: 1.08rem;
		margin-top: 4px;
		margin-bottom: 10px;
	}

	.theory-example {
		color: #7379c3;
		font-size: 1rem;
		display: block;
		margin-top: 3px;
	}

	.theory-table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 10px;
	}



	.theory-table-cell {
		border: 1px solid #d6d9f9;
		padding: 10px 16px;
		font-size: 1.05rem;
		text-align: center;
	}

	.theory-table-head .theory-table-cell {
		background: #edf0fe;
		color: #3c2db5;
		font-weight: 700;
	}

	.theory-actions {
		text-align: center;
		margin-top: 24px;
	}

	.theory-btn-next {
		font-size: 1.2rem;
		padding: 16px 52px;
		margin-top: 16px;
		background: linear-gradient(90deg, #6b7cff, #5172e0);
	}

	.theory-btn-next:hover,
	.theory-btn-next:focus {
		background: linear-gradient(90deg, #5172e0, #6b7cff);
		transform: translateY(-2px) scale(1.04);
	}

	@media (max-width: 768px) {
		.theory-title {
			font-size: 1.8rem;
		}

		.theory-hero-content {
			max-width: 99vw;
		}

		.theory-subtitle {
			font-size: 15px;
			padding: 20px;
			margin: 0;
		}

		.theory-card {
			padding: 22px 14px;
			font-size: 1.05rem;
		}

		.theory-table-cell {
			font-size: 0.95rem;
			padding: 8px 8px;
		}

		.theory-hero {
			padding: 30px;
		}
	}

</style>
