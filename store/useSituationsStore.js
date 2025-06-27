import {defineStore} from "pinia";
import {ref} from 'vue'

export const useSituationsStore = defineStore('situations', () => {
	const currentlevel = ref(1)
	const selectedThemeKey = ref({})
	const themes = ref({})
	const loadThemes = async () => {
		try {
			const response = await fetch('/articleSteps.json')
			const data = await response.json()
			themes.value = data.themem
		} catch (e) {

		}
	}

	const selectedTheme = (key) => {
		selectedThemeKey.value = key
	}

	return {
		currentlevel,
		selectedThemeKey,
		themes,
		loadThemes,
		selectedTheme
	}
})