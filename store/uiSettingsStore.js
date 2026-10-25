import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUiSettingsStore = defineStore('uiSettings', () => {
	const achievementsNotifyEnabled = ref(true)
	const hedgehogHelperEnabled = ref(true)

	if (process.client) {
		const savedAch = localStorage.getItem('achievementsNotifyEnabled')
		achievementsNotifyEnabled.value = savedAch === null ? true : savedAch === 'true'

		const savedHedgehog = localStorage.getItem('hedgehogHelperEnabled')
		hedgehogHelperEnabled.value = savedHedgehog === null ? true : savedHedgehog === 'true'
	}

	watch(achievementsNotifyEnabled, (val) => {
		if (process.client) {
			localStorage.setItem('achievementsNotifyEnabled', String(val))
		}
	}, { immediate: true })

	watch(hedgehogHelperEnabled, (val) => {
		if (process.client) {
			localStorage.setItem('hedgehogHelperEnabled', String(val))
		}
	}, { immediate: true })

	function setAchievementsNotifyEnabled(value) {
		achievementsNotifyEnabled.value = !!value
	}

	function setHedgehogHelperEnabled(value) {
		hedgehogHelperEnabled.value = !!value
	}

	return {
		achievementsNotifyEnabled,
		setAchievementsNotifyEnabled,
		hedgehogHelperEnabled,
		setHedgehogHelperEnabled
	}
})