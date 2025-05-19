<template>

	<div class="battle-field">
		<div class="article__block">
			<div v-for="img in pathImg" :key="img.id" class="articles">
				<img class="article" :src="img.src" alt="">
			</div>
		</div>
		<img class="bf" src="../assets/images/Battlefield1.png" alt="">
		<img class="hero" src="../assets/images/hero.png" alt="">
		<img class="boss" src="../assets/images/bossApp.png" alt="">
		<h1 v-if="startBattle" class="title">⚔️ Битва начинается!</h1>
		<div class="game">
			<GameMenu/>
		</div>
	</div>
</template>

<script setup>
	import {ref} from 'vue'
	import GameMenu from '../src/components/gameMenu.vue'

	const pathImg = [
		{src: '/images/das.png', value: 'das' , id: 1},
		{src: '/images/die.png', value: 'die' , id: 2},
		{src: '/images/der.png', value: 'der' , id: 3},
		{src: '/images/den.png', value: 'den' , id: 4},
		{src: '/images/dem.png', value: 'dem' , id: 5},
	]

	const startBattle = ref(true)

	setTimeout(() => {
		startBattle.value = false
	}, 1500)

</script>

<style scoped>

	.article__block {
		position: absolute;
		left: 30%;
		bottom: 10px;
		transform: translateX(-50%);
		display: flex;
		z-index: 20;
	}

	.article {
		width: 100px;
		margin-left: -75px;
		position: relative;
		z-index: 1;
		transition: transform 0.4s;
		cursor: pointer;
	}

	.article:first-child {
		margin-left: -30px;
	}

	.article:hover {
		transform: translateY(-40px);
	}

	.article:hover {
		transform: translateY(-80px);

	}

	.hero {
		position: absolute;
		width: 130px;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
	}

	.boss {
		position: absolute;
		width: 130px;
		top: 10px;
		right: 50%;
		transform: translateX(50%);
	}

	.battle-field {
		width: 100%;
		height: 100vh;
		position: relative;
		display: flex;
		overflow: hidden;
	}

	.title {
		color: white;
		font-size: 52px;
		text-shadow: 0 0 10px #00ffff;
	}

	.bf {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
	}

	.game {
		position: absolute;
		bottom: 20px;
		right: 20%;
	}

</style>
