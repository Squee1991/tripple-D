<template>
	<section class="description-block">
		<div class="description__wrapper">
			<div class="description-block__text">
				<p class="description-block__line">
					🧙‍♂ -<span class="description-block__highlight"> 800 + слов</span> с артиклями
				</p>
				<p class="description-block__line">
					🎓 -  <span class="description-block__highlight">5 способов обучения</span> для разных стилей
				</p>
				<p class="description-block__line">
					🕹 - <span class="description-block__highlight">Элементы игры</span> и прокачка
				</p>
				<p class="description-block__line">
					🏆 - <span class="description-block__highlight">Прохождение уровней</span> и достижений
				</p>
				<p class="description-block__line">
					🏆 - <span class="description-block__highlight">Дуэли с другими участниками</span>
				</p>
				<p class="description-block__line">
					🏆 - <span class="description-block__highlight">Прохождение уровней </span>
				</p>
			</div>
			<img class="description-block__image" src="../../assets/images/wizard2.svg" alt="Волшебник" />
		</div>
	</section>
</template>

<script setup>
	// пусто
</script>

<style scoped>
	.description-block {
		text-align: center;
		font-family: 'Uncial Antiqua', cursive;
		margin-top: 3rem;
		padding: 0 1rem;
		color: #222;
		background: #f5f0f0;
	}

	.description__wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 50px 20px;
	}

	.description-block__text {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		font-size: 1.3rem;
		line-height: 1.8;
		align-items: start;
	}

	.description-block__highlight {
		color: #a246e4;
		font-weight: bold;
	}
</style>
