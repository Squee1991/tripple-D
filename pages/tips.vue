<template>
	<div class="hacks">
		<div class="hacks__title">Лайфхаки по артиклям в немецком</div>
		<div class="hacks__subtitle">
			Как быстро определять артикль слова — используй эти фишки!
		</div>
		<div class="hacks__list">
			<div class="hacks__card" v-for="(hack, i) in hacks" :key="i">
				<div class="hacks__card-row">
					<div class="hacks__main">
						<div class="hacks__pattern">{{ hack.pattern }}</div>
						<div class="hacks__arrow">→</div>
						<div class="hacks__article hacks__article--{{ hack.article }}">
							{{ hack.article }}
						</div>
					</div>
					<div class="hacks__desc">{{ hack.desc }}</div>
				</div>
			</div>
		</div>
		<div class="hacks__actions">
			<button class="hacks__btn hacks__btn--back" @click="goBack">
				Назад
			</button>
			<button class="hacks__btn hacks__btn--start" @click="startLearning">
				Начать обучение
			</button>
		</div>
	</div>
</template>

<script setup>
	import {useRouter} from 'vue-router'

	const router = useRouter()
	const hacks = [
		{
			pattern: '-ung',
			article: 'die',
			desc: 'Слова на -ung всегда женского рода: die Zeitung, die Bedeutung.'
		},
		{
			pattern: '-schaft',
			article: 'die',
			desc: 'Все слова на -schaft — die: die Mannschaft, die Freundschaft.'
		},
		{
			pattern: '-keit, -heit',
			article: 'die',
			desc: 'Слова на -keit и -heit — всегда die: die Möglichkeit, die Freiheit.'
		},
		{
			pattern: '-chen, -lein',
			article: 'das',
			desc: 'Уменьшительные на -chen, -lein — das: das Mädchen, das Fräulein.'
		},
		{
			pattern: '-er (профессии, жители)',
			article: 'der',
			desc: 'Почти все профессии и жители на -er — der: der Lehrer, der Berliner.'
		},
		{
			pattern: '-ismus',
			article: 'der',
			desc: 'Все слова на -ismus — der: der Optimismus, der Journalismus.'
		},
		{
			pattern: 'Дни недели, месяцы, времена года',
			article: 'der',
			desc: 'Дни недели, месяцы, времена года всегда der: der Montag, der Juli, der Winter.'
		},
		{
			pattern: 'Большинство деревьев, цветов',
			article: 'die',
			desc: 'Названия большинства деревьев и цветов — die: die Rose, die Eiche.'
		},
		{
			pattern: 'Металлы',
			article: 'das',
			desc: 'Металлы — das: das Gold, das Silber, das Eisen.'
		},
		{
			pattern: 'Иностранные слова на -ment',
			article: 'das',
			desc: 'Завозные слова на -ment — das: das Instrument, das Dokument.'
		},
		{
			pattern: 'Ge-...e (многие группы)',
			article: 'das',
			desc: 'Многие на Ge-...e — das: das Gebirge, das Gebäude.'
		},
		{pattern: '-um', article: 'das', desc: 'Слова на -um — всегда das: das Zentrum, das Museum.'},
	]

	function goBack() {
		router.back()
	}

	function startLearning() {
		router.push('/selectedTopics')
	}
</script>

<style scoped>
	.hacks {
		background: linear-gradient(180deg, #e4e7ff 60%, #f2f4ff 100%);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0 0 70px 0;
	}

	.hacks__title {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 2.5rem;
		font-weight: 900;
		color: #fff;
		letter-spacing: 1.8px;
		margin-top: 48px;
		text-shadow:
			0 6px 28px #7e6ae9,
			0 2px 10px #fff,
			0 1px 0 #b6a6ee;
		text-align: center;
		filter: drop-shadow(0 6px 28px #8f83f9cc);
	}

	.hacks__subtitle {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 1.23rem;
		color: #836ce3;
		margin-top: 16px;
		margin-bottom: 38px;
		text-align: center;
		font-weight: 600;
		text-shadow: 0 2px 12px #c9c6f6, 0 0px 1px #fff8;
		letter-spacing: 0.12px;
	}

	.hacks__list {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 0 16px;
		margin: 0 auto;
		justify-content: center;
		gap: 28px;
	}

	.hacks__card {
		max-width: 80%;
		padding: 0px 80px;
		display: flex;
		flex-direction: column;
		transition: box-shadow 0.22s, transform 0.18s;
		position: relative;
	}

	.hacks__card-row {
		padding: 22px 24px 20px 24px;
		background: linear-gradient(120deg, #f5f5ff 65%, #e6e2ff 100%);
		border-radius: 23px 35px 23px 35px / 35px 23px 35px 23px;
		box-shadow:
			0 12px 32px #9583f425,
			0 2px 12px #c3c3e733,
			0 0px 1.5px #fff8 inset;
		border: 2.2px solid #d0c3fa;
		position: relative;
		overflow: hidden;
	}
	.hacks__card-row:after {
		content: "";
		position: absolute;
		inset: 0;
		pointer-events: none;
		border-radius: inherit;
		box-shadow: 0 6px 40px #c7d1ff19 inset;
	}

	.hacks__main {
		display: flex;
		align-items: center;
		gap: 18px;
		margin-bottom: 11px;
	}

	.hacks__pattern {
		font-size: 1.14rem;
		font-weight: 700;
		color: #5a51bf;
		background: linear-gradient(90deg, #ecebff 70%, #dbd1ff 100%);
		padding: 8px 20px;
		border-radius: 14px 22px 14px 22px / 22px 14px 22px 14px;
		font-family: 'Consolas', 'Menlo', monospace;
		box-shadow: 0 3px 11px #bdbbe644, 0 1px 2px #fff7 inset;
		white-space: nowrap;
		border: 1.3px solid #c7c4f6;
		text-shadow: 0 2px 8px #edefff66, 0 0px 1px #fff8;
	}

	.hacks__arrow {
		font-size: 1.36rem;
		color: #a49df4;
		margin: 0 4px;
		user-select: none;
		text-shadow: 0 2px 6px #bab7e988;
	}

	.hacks__article {
		font-size: 1.14rem;
		font-weight: 800;
		letter-spacing: 1.4px;
		padding: 8px 22px;
		border-radius: 15px 22px 15px 22px / 22px 15px 22px 15px;
		box-shadow: 0 4px 13px #d1cef599, 0 0px 2px #fff8 inset;
		text-shadow: 0 2px 12px #edefff90, 0 1px 2px #f1f1ff;
		border: 1.5px solid #d4c6ff;
		font-family: 'Montserrat', Arial, sans-serif;
		min-width: 70px;
		text-align: center;
		text-transform: uppercase;
		transition: box-shadow 0.18s, background 0.15s, color 0.15s;
	}

	.hacks__article--der {
		background: linear-gradient(90deg, #f4f2fc 60%, #d8dcff 100%);
		color: #574fb3;
		border-bottom: 4px solid #b8b7e9;
	}

	.hacks__article--die {
		background: linear-gradient(90deg, #fbe6fc 60%, #e0bbf6 100%);
		color: #be53c1;
		border-bottom: 4px solid #e0bbf6;
	}

	.hacks__article--das {
		background: linear-gradient(90deg, #eaf7fc 60%, #b7daf2 100%);
		color: #3094cc;
		border-bottom: 4px solid #b7daf2;
	}

	.hacks__desc {
		font-size: 1.06rem;
		color: #5c537a;
		font-family: 'Montserrat', Arial, sans-serif;
		margin-left: 3px;
		margin-top: 3px;
		font-weight: 500;
		line-height: 1.55;
		text-shadow: 0 1px 4px #e2e3fa66, 0 0px 1px #fff8;
	}

	.hacks__actions {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 30px;
		margin-top: 54px;
		width: 100%;
	}

	.hacks__btn {
		font-family: 'Montserrat', Arial, sans-serif;
		font-size: 1.22rem;
		padding: 18px 44px;
		border-radius: 18px 30px 18px 30px / 30px 18px 30px 18px;
		border: none;
		cursor: pointer;
		font-weight: 900;
		transition: background 0.20s, color 0.18s, box-shadow 0.18s, transform 0.12s;
		box-shadow: 0 4px 24px #bbadff55, 0 2px 12px #e9e4ff33, 0 1px 8px #fff8 inset;
		text-shadow: 0 2px 12px #a99afb77, 0 1px 2px #fff8;
		letter-spacing: 0.03em;
		margin-top: 2px;
	}

	.hacks__btn--back {
		background: linear-gradient(90deg, #e7e4ff 60%, #d7d3f7 100%);
		color: #5b539e;
		border: 2.5px solid #d7d3f7;
	}

	.hacks__btn--back:hover {
		background: linear-gradient(90deg, #dad5f6 60%, #ede6ff 100%);
		color: #382e83;
		box-shadow: 0 8px 28px #cabfff66;
		transform: scale(1.045);
	}

	.hacks__btn--start {
		background: linear-gradient(90deg, #765cb6 65%, #a789e7 100%);
		color: #fff;
		border: 2.5px solid #8f7ae5;
	}

	.hacks__btn--start:hover {
		background: linear-gradient(90deg, #a789e7 80%, #6e53c6 100%);
		color: #fff;
		box-shadow: 0 12px 32px #ad97ee77;
		transform: scale(1.055);
	}

	@media (max-width: 900px) {
		.hacks__list {
			max-width: 99vw;
			padding: 0 4vw;
			gap: 19px;
		}
		.hacks__card {
			padding: 15px 2vw 15px 2vw;
			min-width: 220px;
		}
		.hacks__title {
			font-size: 2rem;
		}
	}

	@media (max-width: 650px) {
		.hacks {
			padding-bottom: 110px;
		}
		.hacks__list {
			padding: 0 0vw;
			gap: 11px;
		}
		.hacks__card {
			padding: 12px 7px 10px 7px;
		}
		.hacks__main {
			gap: 5px;
		}
		.hacks__pattern,
		.hacks__article {
			padding: 4px 8px;
			font-size: 0.98rem;
		}
		.hacks__desc {
			font-size: 0.96rem;
		}
		.hacks__actions {
			gap: 11px;
			margin-top: 29px;
		}
		.hacks__btn {
			padding: 11px 18px;
			font-size: 1rem;
		}
	}

</style>
