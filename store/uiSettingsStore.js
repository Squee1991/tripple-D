import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUiSettingsStore = defineStore('uiSettings', () => {
	const achievementsNotifyEnabled = ref(true)
	const isUiReady = ref(false)

	if (process.client) {
		const saved = localStorage.getItem('achievementsNotifyEnabled')
		achievementsNotifyEnabled.value = saved === null ? true : saved === 'true'
	}

	watch(achievementsNotifyEnabled, (val) => {
		if (process.client) {
			localStorage.setItem('achievementsNotifyEnabled', String(val))
		}
	}, { immediate: true })

	function setAchievementsNotifyEnabled(v) {
		achievementsNotifyEnabled.value = !!v
	}

	return {
		achievementsNotifyEnabled,
		setAchievementsNotifyEnabled,
		isUiReady
	}
})
