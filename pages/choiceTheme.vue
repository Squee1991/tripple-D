<script setup>
	import { useTrainerStore } from '../store/themenProgressStore.js'
	import { useRouter } from 'vue-router'
	import { ref, onMounted, computed, watch } from 'vue'
	import HomeImg from '../assets/images/home.svg'
	import Clothes from '../assets/images/clothes.svg'
	import Health from '../assets/images/health.svg'
	import Food from '../assets/images/food.svg'
	import Transport from '../assets/images/Transport.svg'
	import Weather from '../assets/images/weather.svg'
	import Purchase from '../assets/images/buy.svg'
	import Family from '../assets/images/family.svg'
	import School from '../assets/images/school.svg'
	import Travel from '../assets/images/travel.svg'
	import Clock from '../assets/images/clock.svg'
	const router = useRouter()
	const trainer = useTrainerStore()
	const themes = [
		{ key: 'house', name: 'Дом', img: HomeImg },
		{ key: 'zeit', name: 'Время', img: Clock },
		{ key: 'family', name: 'Семья', img: Family },
		{ key: 'food', name: 'Еда', img: Food },
		{ key: 'purchases', name: 'Покупки', img: Purchase },
		{ key: 'health', name: 'Здоровье', img: Health },
		{ key: 'weather', name: 'Погода', img: Weather },
		{ key: 'clothes', name: 'Одежда', img: Clothes },
		{ key: 'transport', name: 'Транспорт', img: Transport },
		{ key: 'school', name: 'Школа', img: School },
		{ key: 'travel', name: 'Путешествия', img: Travel }
	]

	const currentImage = computed(() => {
		const found = themes.find(t => t.key === selectedTopic.value)
		return found?.img || null
	})

	const selectedTopic = ref(themes[0].key)
	const jsonData = ref(null)
	const loading = ref(true)
	const selectedLevel = ref(1)
	const topic = computed(() => selectedTopic.value)
	const selectedLevelObj = computed(() => {
		if (!jsonData.value || !jsonData.value.levels) return null
		return jsonData.value.levels.find(l => l.level === Number(selectedLevel.value))
	})

	const isModuleUnlocked = (level, moduleId) => {
		if (level > 1) return false
		if (moduleId === 1) return true
		return trainer.completedModules.includes(Number(moduleId - 1))
	}

	const goToExercise = async (level, module) => {
		await trainer.setThemeAndModule(topic.value, level, module)
		router.push('/trainer')
	}

	const loadThemeData = async () => {
		loading.value = true
		trainer.topic = topic.value
		await trainer.loadProgress()
		const res = await fetch(`/${topic.value}.json`)
		jsonData.value = await res.json()
		selectedLevel.value = 1
		loading.value = false
	}

	onMounted(loadThemeData)
	watch(topic, loadThemeData)
</script>

<template>
	<div class="trainer" v-if="jsonData">
		<div class="trainer__theme">
			<label>Тема:</label>
			<select v-model="selectedTopic" class="trainer__theme-select">
				<option v-for="t in themes" :key="t.key" :value="t.key">{{ t.name }}</option>
			</select>
		</div>
		<div class="trainer__level">
			<select v-model="selectedLevel" class="trainer__level-select">
				<option v-for="level in jsonData.levels" :key="level.level" :value="level.level">
					Уровень {{ level.level }}
				</option>
			</select>
		</div>
		<div class="trainer__image" v-if="currentImage">
			<img :src="currentImage" alt="Выбранная тема" />
		</div>
		<div class="trainer__modules" v-if="selectedLevelObj">
			<h2 class="trainer__modules-title">Уровень {{ selectedLevelObj.level }}</h2>
			<div class="trainer__module-list">
				<button
					v-for="mod in selectedLevelObj.modules"
					:key="mod.id"
					class="trainer__module-btn"
					:disabled="!isModuleUnlocked(selectedLevelObj.level, mod.id)"
					@click="goToExercise(selectedLevelObj.level, mod.id)"
				>
					Модуль {{ mod.id }}
				</button>
			</div>
		</div>
	</div>
</template>

<style>
	.trainer__image {
		margin-top: 1rem;
		text-align: center;
	}
	.trainer__image img {
		width: 120px;
		height: auto;
	}
</style>

