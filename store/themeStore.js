import {defineStore} from "pinia";
import {ref, computed} from 'vue'

export const useThemeCardStore = defineStore('theme', () => {
	const themes = ref({})

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
		BathroomItems: 'Ванная',
		Kosmetik: 'Косметика',
		Familie: 'Семья',
		Emotions: 'Эмоции',
		Werkzeuge: 'Инструменты',
		Kitchen: 'Кухня',
		Health: 'Здоровье',
		Sport: 'Спорт',
		Drinks: 'Напитки',
		Holidays: 'Праздники',
		SportEquipment: 'Фитнес',
		Travel: 'Путешествия',
		Musik: 'Музыка',
		Amount: 'Колличество',
		Informatik: 'Информатика'
	}

	const loadthemes = async () => {
		const response = await fetch('/words.json')
		const raw = await response.json()
		const enriched = {}
		Object.entries(raw).forEach(([key, words]) => {
			if (!Array.isArray(words)) return
			const der = words.filter(w => w.article === 'der').length
			const die = words.filter(w => w.article === 'die').length
			const das = words.filter(w => w.article === 'das').length

			enriched[key] = {
				name: nameMap[key] || key,
				words,
				stats: {
					der, die, das
				}
			}
		})
		themes.value = enriched
	}

	return {
		themes,
		loadthemes
	}
})