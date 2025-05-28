<template>
	<div class="page-wrapper">
		<div class="theme__der"
			v-for="(theme , key) in themeStore.themes"
			:key="key">
			<div> der {{ theme.stats.der}}</div>
			<div> die {{ theme.stats.die}}</div>
			<div> das {{ theme.stats.das}}</div>
		</div>

	</div>
</template>

<script setup>
	import {ref, onMounted} from 'vue'
	import {useThemeCardStore} from '../store/themeStore.js'

	const themeStore = useThemeCardStore()
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
		DaysAndMonths: 'Дни и месяцы',
		Toys: 'Игрушки',
		CommonItems: 'Общие',
		BathroomItems: 'Вещи для ванной',
		Kosmetik: 'Косметика',
		Familie: 'Семья',
		Emotions: 'Эмоции',
		Werkzeuge: 'Инструменты',
		Kitchen: 'Кухня',
		Health: 'Здоровье',
		Sport: 'Спорт',
		SportEquipment: 'Фитнес-инвентарь',
		Travel: 'Путешествия',
		Musik: 'Музыка',
		Amount: 'Колличество',
		Informatik: 'Информатика'
	}
	onMounted(async () => {
		await themeStore.loadthemes()
		console.log('Загружено:', themeStore.themes)
	})
</script>

<style scoped>


</style>
