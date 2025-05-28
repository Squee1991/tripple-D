<template>
	<div class="deck">
		<h1 class="deck__title">Ваша колода</h1>
		<div class="deck__content">
			<div class="deck__list">
				<div v-for="card in userDeck" :key="card.id" class="deck__card card">
					<div class="card__frame">
						<div class="card__header">
							<span class="card__name">{{ card.de }}</span>
						</div>
						<div class="card__image">
							<img class="card__image--item" :src="getSpellIcon(card.spell.id)" alt="">
						</div>
						<div class="card__spell">
							<div class="card__spell-name">{{ card.spell.name }}</div>
							<div class="card__spell__description">{{ card.spell.description }}</div>
						</div>
						<div class="card__stats">
							<div class="card__attack-icon">
								<img class="card__attack-bg" src="../../assets/images/swords.svg" alt="">
								<span class="card__attack-value">{{ card.attack }}</span>
							</div>
							<div class="card__health-icon">
								<img class="card__health-bg" src="../../assets/images/shield.svg" alt="">
								<span class="card__health-value">{{ card.health }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="card__edit">
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onMounted} from 'vue'
	import { userBattleStore } from '../../store/BattleStore.js'
	const { userDeck } = userBattleStore()

	function getSpellIcon(id) {
		try {
			return new URL(`../../assets/images/spellIcons/${id}.svg`, import.meta.url).href
		} catch {
			return '' || id
		}
	}

</script>

<style scoped>

	.deck__list {
		display: flex;
		flex-wrap: wrap;
	}

	.deck__content {
		display: flex;
	}

	.deck__title {
		width: 100%;
		padding: 30px;
		background: #cba36a;
		margin-bottom: 20px;
	}

	.card__edit {
		width: 200px;
		height: 100vh
	}

	.card__frame {
		position: relative;
		width: 160px;
		align-items: center;
		background: radial-gradient(ellipse at 60% 40%, #fffbe8 60%, #e8d6b7 100%);
		border-bottom-left-radius: 27px;
		border-bottom-right-radius: 27px;
		box-shadow: 0 4px 18px #a5875c99, 0 1px 3px #fff5c9 inset;
		border: 4px solid #b9985b;
		display: flex;
		flex-direction: column;
		padding: 5px 10px 0 10px;
		margin: 25px;
	}

	.card__frame:before {
		content: '';
		display: block;
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		height: 35px;
		background: #7d7d6a;
		border: 4px solid #b9985b;
		border-top-left-radius: 25px;
		border-top-right-radius: 25px;
	}

	.card__header {
		position: absolute;
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 6px;
		height: 40px;
		width: 170px;
	}

	.card__name {
		left: 50%;
		transform: translateX(-50%);
		top:-35px;
		position: absolute;
		width: 155px;
		text-align: center;
		font-size: 14px;
		color: white;
		font-weight: bold;
		letter-spacing: 1px;
		text-shadow: 0 1px 2px #fff5;
		font-family: 'Georgia', serif;
	}

	.card__image {
		background: #524e4e;
		width: 70px;
		height: 90px;
		border-radius: 50%;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 4px solid #8d7c7c;
	}
	.card__image--item {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card__spell {
		border-radius: 7px;
		font-size: 15px;
		font-weight: bold;
		color: #7a591a;
		text-align: center;
		margin-bottom: 6px;
		padding: 3px 0;
	}

	.card__spell-name {
		color: black;
		height: 38px;
	}

	.card__spell__description {
		font-size: 11px;
		height: 49px;
	}

	.card__stats {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: auto;
		padding: 7px 0 0 0;
	}

	.card__attack-icon {
		left: -19px;
		bottom: -10px;
		position: absolute;
		width: 40px;
		height: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.card__health-icon {
		bottom: -10px;
		right: -22px;
		position: absolute;
		width: 44px;
		height: 44px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.card__attack-bg, .card__health-bg {
		width: 100%;
		height: 100%;
	}

	.card__attack-value, .card__health-value {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 30px;
		font-weight: bold;
		color: #efe8e8;
		pointer-events: none;
		text-shadow: 0 1px 3px #0009;
	}


</style>
