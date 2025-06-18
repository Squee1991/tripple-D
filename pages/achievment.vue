<template>
	<div class="achievements-page">
		<h1>Достижения</h1>
		<div class="achievements-list">
			<div class="achievement" v-for="ach in achievements" :key="ach.id">
				<div class="achievement__icon">{{ ach.icon }}</div>
				<div>
					<div class="achievement__title">{{ ach.title }}</div>
					<div class="achievement__desc">{{ ach.desc }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const achievements = [
		{
			id: 'first-win',
			icon: '🎉',
			title: 'Первое слово!',
			desc: 'Угадай своё первое слово.',
		},
		{
			id: 'perfect',
			icon: '🥇',
			title: 'Безупречно!',
			desc: 'Угадай слово без единой ошибки.',
		},
		{
			id: 'sniper',
			icon: '🧠',
			title: 'Снайпер',
			desc: 'Угадай слово, использовав не более 5 попыток.',
		},
		{
			id: 'fast',
			icon: '🔥',
			title: 'Быстрый ум',
			desc: 'Угадай 3 слова подряд, не потратив больше 10 попыток на каждое.',
		},
		{
			id: 'streak10',
			icon: '👑',
			title: 'Король угадывания',
			desc: 'Угадай 10 слов подряд.',
		},
		{
			id: 'persistence',
			icon: '💪',
			title: 'Несдающийся',
			desc: 'Угадай слово, потратив все 15 попыток.',
		},
		{
			id: 'lightning',
			icon: '⚡',
			title: 'Молниеносно!',
			desc: 'Угадай слово за 30 секунд.',
		},
		{
			id: 'collection',
			icon: '📚',
			title: 'Коллекционер',
			desc: 'Открой все слова из одной темы.',
		},
		{
			id: 'daily3',
			icon: '📅',
			title: 'Стабильность',
			desc: 'Угадывай хотя бы одно слово 3 дня подряд.',
		}
	]
</script>

<style>
	.achievements-page {
		max-width: 500px;
		margin: 0 auto;
		padding: 2rem 1rem;
		font-family: 'Segoe UI', Arial, sans-serif;
	}
	.achievements-list {
		display: flex;
		flex-direction: column;
		gap: 1.2rem;
		margin-top: 2rem;
	}
	.achievement {
		display: flex;
		align-items: flex-start;
		background: #f8f5ff;
		border-radius: 16px;
		box-shadow: 0 2px 8px #0001;
		padding: 1.2rem 1.4rem;
		gap: 1rem;
	}
	.achievement__icon {
		font-size: 2.1rem;
		margin-top: 0.1em;
	}
	.achievement__title {
		font-weight: 600;
		font-size: 1.16rem;
		margin-bottom: 0.13em;
	}
	.achievement__desc {
		color: #7b6fc9;
		font-size: 1rem;
	}
</style>
