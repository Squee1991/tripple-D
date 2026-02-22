import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useGalaxyStore = defineStore('galaxy', () => {
	const galaxies = ref([])
	const activeGalaxyId = ref(null)
	const fetchGalaxies = async () => {
		if (galaxies.value.length > 0) return

		try {
			const res = await fetch('/galaxy-data/galaxies.json')
			const data = await res.json()
			galaxies.value = data.galaxies
		} catch (error) {
			console.error('Ошибка загрузки базы данных:', error)
		}
	}

	const setMission = (galaxyId) => {
		activeGalaxyId.value = galaxyId
	}

	const clearMission = () => {
		activeGalaxyId.value = null
	}

	const currentGalaxy = computed(() =>
		galaxies.value.find(g => g.id === activeGalaxyId.value)
	)

	const currentQuestions = computed(() =>
		currentGalaxy.value?.questions || []
	)

	return {
		galaxies,
		activeGalaxyId,
		fetchGalaxies,
		setMission,
		clearMission,
		currentGalaxy,
		currentQuestions
	}
})