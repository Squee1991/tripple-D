<template>
		<div>
			<div class="card-container">
				<div
					v-for="(label, key) in nameMap"
					:key="key"
					class="card"
				>
					<p class="card-title">{{ label }}</p>
					<div class="card-icon" />
				</div>
			</div>
		</div>
</template>

<script setup>

	defineProps({
		start: Boolean
	})

	const nameMap = {
		Furniture: 'Мебель',
		Animals: 'Животные',
		Clothes: 'Одежда',
		Food: 'Еда',
		Body: 'Части тела',
		Professions: 'Профессии',
		Transport: 'Транспорт',
		Colors: 'Цвета',
		Nature: 'Природа',
		Home: 'Дом',
		Zeit: 'Время',
		City: 'Город',
		School: 'Школа',
		DaysAndMonths: 'Дни и месяцы'
	}
</script>
<style scoped>

	.card-container {
		width: 100%;
		max-width: calc(160px * 7 + 20px * 6);
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		justify-content: center;
		padding: 20px 40px;
	}

	.card {
		width: 160px;
		height: 240px;
		background: rgba(0, 0, 0, 0.7);
		border: none;
		border-radius: 16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		box-shadow: 0 0 12px #00ffff44;
		cursor: pointer;
		transition: all 0.5s ease;
		animation: pulseGlow 6s infinite ease-in-out;
	}

	.card:hover {
		background: rgba(0, 0, 0, 0.93);
		box-shadow: 0 0 20px #00ffffcc;
		transform: scale(1.03);
	}

	@keyframes pulseGlow {
		50% {
			box-shadow: 0 0 5px #00ffffaa;
			transition: all 0.5s ease;
		}
		100% {
			box-shadow: 0 0 5px #00ffff44;
			transition: all 0.5s ease;
		}
	}

	.card-title {
		font-size: 17px;
		font-weight: bold;
		color: white;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin-bottom: 12px;
		text-shadow: 0 0 6px #00ffff55;
	}

	.card-icon {
		width: 40px;
		height: 40px;
		background: radial-gradient(circle at center, #00ffffaa, #007777);
		clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
		box-shadow: 0 0 10px #00ffff66;
	}

</style>
