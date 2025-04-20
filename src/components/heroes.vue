<template>
	<div class="heroes">
		<div class="hero__title">Выберите персонажа</div>
		<transition name="bounce" appear>
			<div>
				<div class="heroes__cards">
					<div
						v-for="item in visibleHeroes"
						:key="item.id"
						class="heroes__wrapper"
						@click="selectHero(item)"
					>
						<img class="heroes__item" :src="item.src" alt="">
					</div>
				</div>
			</div>
		</transition>
	</div>
	<div v-if="selectedHero" class="overlay" @click.self="deselectHero">
		<div class="selected__wrapper" @click.stop>
			<div class="selected-hero" @click="deselectHero">
				<img :src="selectedHero.src" alt="Selected" class="selected-hero__img"/>
			</div>
			<div class="btn-glow-wrapper">
				<img class="btn__image" src="../../assets/images/btn2.png" alt="">
			</div>
		</div>
	</div>
</template>


<script setup>
	import {ref, computed} from 'vue'

	const selectedHero = ref(null)

	const allHeroes = [
		{src: '/images/h1.png', id: 1},
		{src: '/images/h3.png', id: 2},
		{src: '/images/h4.png', id: 3},
		{src: '/images/h5.png', id: 4},
	]


	const visibleHeroes = computed(() => {
		if (!selectedHero.value) return allHeroes
		return allHeroes.filter(item => item.id !== selectedHero.value.id)
	})

	function selectHero(hero) {
		selectedHero.value = hero
	}

	function deselectHero() {
		selectedHero.value = null
	}

	function continueWithHero() {
		console.log('Продолжить с героем:', selectedHero.value)
	}
</script>


<style scoped>
	.bounce-enter-active {
		animation: bounce-in 0.8s;
	}

	.bounce-leave-active {
		animation: bounce-in 0.8s reverse;
	}

	@keyframes bounce-in {
		0% {
			transform: scale(0);
		}
		50% {
			transform: scale(1.25);
		}
		100% {
			transform: scale(1);
		}
	}

	.heroes {
		display: flex;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		flex-direction: column;
		align-items: center;
	}

	.selected__wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.heroes__cards {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 20px;
	}

	.hero__title {
		text-align: center;
		padding: 15px;
		font-size: 35px;
		font-weight: bold;
		color: #00ffff;
	}

	.heroes__wrapper {
		width: 150px;
		height: 200px;
		cursor: pointer;
	}

	.heroes__item {
		width: 100%;
		transition: .5s;
	}

	.heroes__item:hover {
		transform: scale(1.06);
		transition: .5s;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
	}


	.selected-hero {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 30px;
		border-radius: 16px;
	}

	.selected-hero__img {
		width: 160px;
		height: auto;
		transform: scale(1.5);
		transition: transform 0.3s;
	}

	.btn__image {
		width: 200px;
		cursor: pointer;
		transition: .5s;
		filter: brightness(1.1);
		position: relative;
		z-index: 1;
	}

	.btn__image:hover {
		transition: .5s;
		filter: brightness(1.5);
	}

	.btn-glow-wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 25px;
	}

	.btn-glow-wrapper::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 190px;
		height: 95px;
		border-radius: 35px;
		background: rgba(0, 255, 255, 0.4);
		filter: blur(20px);
		animation: pulse 4s infinite;
		z-index: 0;
	}

	@keyframes pulse {
		0% {
			opacity: 0.6;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1.1);
		}
		100% {
			opacity: 0.6;
			transform: translate(-50%, -50%) scale(1);
		}
	}

</style>
