import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const useAudioTaskStore = defineStore('audioTask', () => {
	const allTasks = ref({})
	const currentLevel = ref('A1')
	const loading = ref(false)

	const currentTasks = computed(() => allTasks.value[currentLevel.value] || [])

	async function fetchTasks() {
		loading.value = true
		try {

			const data = await $fetch('/audio-tasks/audio-tasks.json')
			allTasks.value = data
		} catch (error) {
			console.error('Ошибка загрузки JSON:', error)
		} finally {
			loading.value = false
		}
	}

	function setLevel(level) {
		currentLevel.value = level
	}

	return {
		allTasks,
		currentLevel,
		loading,
		currentTasks,
		fetchTasks,
		setLevel
	}
})