<template>
	<section class="mode-select">
		<h1 class="mode-select__title">🔮 Выбери свой путь</h1>
		<div class="mode-select__options">
			<div
				class="mode-card"
				:class="{ active: selectedMode === 'learn' }"
				@click="goToLearn"
			>
				<img src="../assets/images/studyWizard.svg" alt="scroll" class="mode-card__image" />
				<h2 class="mode-card__title">📘 Обучение</h2>
				<p class="mode-card__desc">Изучи артикли и слова в волшебной форме</p>
			</div>

			<div
				class="mode-card"
				:class="{ active: selectedMode === 'game' }"
				@click="goToGame"
			>
				<img src="../assets/images/wizardStudy.svg" alt="game" class="mode-card__image" />
				<h2 class="mode-card__title">🎮 Игровой режим</h2>
				<p class="mode-card__desc">Проходи уровни, собирай очки и прокачивайся!</p>
			</div>
		</div>
	</section>

	<section v-if="selectedMode" class="mode__content">
		<div class="card__wrapper" v-if="selectedMode === 'learn'">
			<Cards />
		</div>
		<div v-else>
			<Heroes />
		</div>
	</section>
</template>


<script setup>
	import { ref} from 'vue'
	import Heroes from '../src/components/heroes.vue'
	import Cards from '../src/components/cards.vue'
	import { useRouter} from 'vue-router'
	const router = useRouter()
	const selectedMode = ref('')

	const goToLearn = () => {
		selectedMode.value = 'learn'
	}

	const goToGame = () => {
		selectedMode.value = 'game'
	}

</script>

<style scoped>

	.card.selected {
		background: #f6eaff;
		border: 2px dashed #7a35b8;
		box-shadow: 0 0 20px #c084fcaa;
		transform: scale(1.08);
	}

	.mode-select {
		text-align: center;
		padding: 3rem 1rem;
		font-family: 'Uncial Antiqua', cursive;
		background: linear-gradient(to bottom, #faf3ff, #f0e6ff);
		color: #43205b;
	}

	.mode-select__title {
		font-size: 2rem;
		margin-bottom: 2.5rem;
		color: #7a35b8;
	}

	.mode-select__options {
		display: flex;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.mode-card {
		background: #fff;
		border: 2px dashed #a246e4;
		padding: 2rem;
		border-radius: 1.5rem;
		width: 250px;
		cursor: pointer;
		transition: all 0.3s ease;
		transform: scale(1);
	}

	.mode-card:hover {
		transform: scale(1.05);
		box-shadow: 0 0 20px rgba(162, 70, 228, 0.4);
	}

	.mode-card.active {
		transform: scale(1.08);
		border-color: #7a35b8;
		box-shadow: 0 0 24px #c084fcaa;
	}

	.mode-card__image {

		margin-bottom: 1rem;
	}

	.mode-card__title {
		font-size: 1.3rem;
		color: #5a2a85;
		margin-bottom: 0.5rem;
	}

	.mode-card__desc {
		font-size: 1rem;
		color: #573a72;
	}

	.card.selected {
		transform: scale(1.08);
		border: 2px dashed #7a35b8;
		box-shadow: 0 0 20px #c084fcaa;
		transition: all 0.3s ease;
	}

	.next-button {
		margin-top: 40px;
		background: #f6eaff;
		color: #6a1b9a;
		padding: 14px 32px;
		border-radius: 16px;
		font-size: 20px;
		font-weight: bold;
		border: 2px dashed #a246e4;
		box-shadow: 0 0 16px #d68fff88;
		cursor: pointer;
		transition: all 0.3s ease;
		display: block;
		margin-left: auto;
		margin-right: auto;
		font-family: 'Uncial Antiqua', cursive;
	}

	.next-button:hover {
		background: #ecd4ff;
		box-shadow: 0 0 24px #a246e4;
	}
</style>
