<template>
	<div class="pronouns" v-if="pronouns">
		<div class="swiper">
			<div class="swiper__content">
				<div v-if="currentIndex === 0">
					<div class="title__theme">Личные местоимения</div>
					<TableSection :items="pronouns.personal" :columns="['person', 'de', 'ru']"/>
				</div>
				<div v-else-if="currentIndex === 1">
					<div class="title__theme">Притяжательные местоимения</div>
					<TableSection :items="pronouns.possessive" :columns="['person', 'de', 'ru']"/>
				</div>
				<div v-else-if="currentIndex === 2">
					<div class="title__theme">Указательные местоимения</div>
					<TableSection :items="pronouns.demonstrative" :columns="['de', 'ru']"/>
				</div>
			</div>

			<div class="swiper__controls">
				<button @click="prev" :disabled="currentIndex === 0">←</button>
				<button @click="next" :disabled="currentIndex === 2">→</button>
			</div>
		</div>
	</div>
</template>
<script setup>
	import { ref, onMounted } from 'vue'
	import TableSection from './TableSection.vue'

	const pronouns = ref(null)
	const currentIndex = ref(0)

	onMounted(async () => {
		const res = await fetch('/pronouns.json')
		pronouns.value = await res.json()
	})

	function next() {
		if (currentIndex.value < 2) currentIndex.value++
	}

	function prev() {
		if (currentIndex.value > 0) currentIndex.value--
	}
</script>

<style scoped>
	* {
		color: white;
	}

	.pronouns {
		padding: 10px;
		border-radius: 12px;
	}

	.title__theme {
		padding-bottom: 10px;
		font-size: 20px;
		font-weight: 600;
	}

	.swiper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}

	.swiper__content {
		width: 100%;
	}

	.swiper__controls {
		display: flex;
		justify-content: center;
		gap: 20px;
		margin-top: 10px;
	}

	.swiper__controls button {
		background-color: #81c784;
		color: white;
		border: none;
		padding: 8px 16px;
		border-radius: 8px;
		font-size: 16px;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.swiper__controls button:hover {
		background-color: #66bb6a;
	}

	.swiper__controls button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
