import {defineStore} from "pinia";
import {ref, computed} from 'vue'

export const useThemeCardStore = defineStore('theme', () => {
	const themes = ref({})
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