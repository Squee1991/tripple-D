import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

export const useAudioTaskStore = defineStore('audioTask', () => {
	const allTasks = ref({})
	const currentLevel = ref('A1')
	const currentTopicId = ref(null)
	const loading = ref(false)
	const userProgress = ref({})
	const db = getFirestore()
	const currentTasks = computed(() => allTasks.value[currentLevel.value] || [])
	async function fetchTasks() {
		loading.value = true
		try {
			const data = await $fetch('/audio-tasks/audio-tasks.json')
			allTasks.value = data
		} catch (error) {
			console.error(error)
		} finally {
			loading.value = false
		}
	}

	function setLevel(level) {
		currentLevel.value = level
	}

	function setCurrentTopicId(id) {
		currentTopicId.value = id
	}

	async function loadUserProgress() {
		const auth = getAuth()
		if (!auth.currentUser) return
		try {
			const docRef = doc(db, 'users', auth.currentUser.uid, 'audio_tasks', 'progress')
			const snap = await getDoc(docRef)
			if (snap.exists()) {
				userProgress.value = snap.data()
			}
		} catch (error) {
			console.error(error)
		}
	}

	async function saveTopicProgress(topicId, newResults) {
		if (!userProgress.value[topicId]) {
			userProgress.value[topicId] = {}
		}

		let updated = false
		for (const [taskId, status] of Object.entries(newResults)) {
			if (userProgress.value[topicId][taskId] !== 'success') {
				userProgress.value[topicId][taskId] = status
				updated = true
			}
		}

		if (!updated) return

		const auth = getAuth()
		if (!auth.currentUser) return

		try {
			const docRef = doc(db, 'users', auth.currentUser.uid, 'audio_tasks', 'progress')
			const pureData = JSON.parse(JSON.stringify(userProgress.value))
			await setDoc(docRef, pureData, { merge: true })
		} catch (error) {
			console.error(error)
		}
	}

	return {
		allTasks,
		currentLevel,
		currentTopicId,
		loading,
		currentTasks,
		userProgress,
		fetchTasks,
		setLevel,
		setCurrentTopicId,
		loadUserProgress,
		saveTopicProgress
	}
})