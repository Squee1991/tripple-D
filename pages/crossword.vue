<template>
	<div class="switcher">
		<div class="switcher__words">
			<div class="switcher__word">der</div>
			<div class="switcher__word">die</div>
			<div class="switcher__word">das</div>
			<div
				class="switcher__highlight"
				:class="[`switcher__highlight--${current}`, { 'switcher__highlight--stretch': isStretching }]"
			></div>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, onUnmounted } from 'vue'

	const index = ref(0)
	const isStretching = ref(false)

	const articles = ['der', 'die', 'das']
	const current = computed(() => articles[index.value])

	let interval

	onMounted(() => {
		interval = setInterval(() => {
			isStretching.value = true
			setTimeout(() => {
				index.value = (index.value + 1) % articles.length
				isStretching.value = false
			}, 250) // время растяжения
		}, 1500) // общее время одного полного цикла
	})

	onUnmounted(() => {
		clearInterval(interval)
	})
</script>

<style scoped>
	.switcher {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: 'Georgia', serif;
		margin-top: 40px;
	}

	.switcher__words {
		position: relative;
		display: flex;
		justify-content: space-between;
		width: 240px;
		font-size: 32px;
		font-weight: bold;
		text-transform: lowercase;
		border-radius: 30px;
		overflow: hidden;
		color: white;
		background: #e7cece;
		padding: 10px 0;
	}

	.switcher__word {
		flex: 1;
		text-align: center;
		z-index: 1;
		position: relative;
	}

	.switcher__highlight {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 33.33%;
		z-index: 0;
		border-radius: 30px;
		transition:
			left 0.4s ease,
			background-color 0.3s ease,
			width 0.3s ease;
	}

	.switcher__highlight--der {
		left: 0%;
		background-color: black;
	}
	.switcher__highlight--die {
		left: 33.33%;
		background-color: crimson;
	}
	.switcher__highlight--das {
		left: 66.66%;
		background-color: goldenrod;
	}

	.switcher__highlight--stretch {
		width: 46.66%;
		transition: 1s;
	}
</style>
