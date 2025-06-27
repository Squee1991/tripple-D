<template>
	<div class="theme-container" v-if="currentTheme">
		<img :src="imageSrc" class="theme-image" alt="Тема" />
		<h2 class="theme-name">{{ currentTheme.name }}</h2>
		<div class="theme-actions">
			<button @click="startTheme(currentTheme.key)">Начать</button>
			<button @click="nextTheme" :disabled="isLast">Далее</button>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue'
	import { useSituationsStore } from '../store/useSituationsStore.js'
	import HomeImg from '../assets/images/home.svg'
	import Clothes from '../assets/images/clothes.svg'
	import Health from '../assets/images/health.svg'
	import Food from '../assets/images/food.svg'
	import Transport from '../assets/images/Transport.svg'
	import Weather from '../assets/images/weather.svg'
	import Purchase from '../assets/images/buy.svg'
	import Family from '../assets/images/family.svg'


	const situationStore = useSituationsStore()
	const themeList = ref([])
	const currentIndex = ref(0)

	const themeImages = {
		home: HomeImg,
		clothes: Clothes,
		health: Health,
		food: Food,
		transport: Transport,
		weather: Weather,
		buy: Purchase,
		family: Family,
	}

	const get = async () => {
		await situationStore.loadThemes()
		themeList.value = Object.entries(situationStore.themes).map(([key, name]) => ({key, name}))
	}

	const currentTheme = computed(() => themeList.value[currentIndex.value] || null)
	const isLast = computed(() => currentIndex.value >= themeList.value.length - 1)

	const imageSrc = computed(() => {
		if (!currentTheme.value) return ''
		return themeImages[currentTheme.value.key] || ''
	})

	const nextTheme = () => {
		if (!isLast.value) currentIndex.value++
	}

	const startTheme = (key) => {
		situationStore.selectTheme(key)
	}

	onMounted(get)
</script>



<style scoped>
	.theme-list {
		max-width: 600px;
		margin: auto;
		padding: 1rem;
	}
	.theme-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		border-bottom: 1px solid #ccc;
	}
	.theme-name {
		font-weight: bold;
	}

	.theme-image {
		width: 120px;
		height: auto;
		margin-bottom: 1rem;
	}

	button {
		padding: 0.4rem 0.8rem;
		background: #333;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	button:hover {
		background: #555;
	}
</style>

