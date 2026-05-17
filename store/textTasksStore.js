import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

export const useTextTasksStore = defineStore('textTasks', () => {
	const currentTask = ref(null)
	const availableWords = ref([])
	const blanksState = ref({})
	const isChecking = ref(false)
	const tasksList = ref([])
	const currentTaskIndex = ref(-1)

	// Новые стейты для Firebase
	const currentThemeId = ref(null)
	const userProgress = ref({})

	const isAllFilled = computed(() => {
		const blanks = Object.values(blanksState.value)
		return blanks.length > 0 && blanks.every(val => val !== null)
	})

	// Добавили themeId в параметры
	const initTask = (task, list = [], index = -1, themeId = null) => {
		currentTask.value = task

		if (list.length > 0) {
			tasksList.value = list
			currentTaskIndex.value = index
		}
		if (themeId) {
			currentThemeId.value = themeId
		}

		isChecking.value = false
		availableWords.value = [...task.wordsPool].sort(() => Math.random() - 0.5)

		blanksState.value = {}
		task.textElements.forEach(el => {
			if (el.type === 'blank') {
				blanksState.value[el.id] = null
			}
		})
	}

	const placeWord = (blankId, word) => {
		isChecking.value = false
		if (blanksState.value[blankId]) {
			availableWords.value.push(blanksState.value[blankId])
		}

		blanksState.value[blankId] = word
		availableWords.value = availableWords.value.filter(w => w !== word)
	}

	const returnWord = (blankId) => {
		if (isChecking.value) return

		const word = blanksState.value[blankId]
		if (word) {
			availableWords.value.push(word)
			blanksState.value[blankId] = null
		}
	}

	const toggleCheck = () => {
		if (isChecking.value) {
			initTask(currentTask.value, tasksList.value, currentTaskIndex.value, currentThemeId.value)
		} else {
			isChecking.value = true
		}
	}

	const nextTask = () => {
		if (currentTaskIndex.value >= 0 && currentTaskIndex.value < tasksList.value.length - 1) {
			currentTaskIndex.value++
			initTask(tasksList.value[currentTaskIndex.value], tasksList.value, currentTaskIndex.value, currentThemeId.value)
			return true
		}
		return false
	}

	// Загрузка прогресса из Firebase
	async function loadUserProgress() {
		const auth = getAuth()
		const db = getFirestore()

		if (!auth.currentUser) return

		try {
			const docRef = doc(db, 'users', auth.currentUser.uid, 'text_tasks', 'progress')
			const snap = await getDoc(docRef)
			if (snap.exists()) {
				userProgress.value = snap.data()
			}
		} catch (error) {
			console.error(error)
		}
	}

	// Сохранение прогресса конкретной задачи
	async function saveTaskProgress() {
		if (!currentThemeId.value || !currentTask.value) return

		const themeId = currentThemeId.value
		const taskId = currentTask.value.id // Предполагается, что в JSON у задачи есть "id"

		if (!userProgress.value[themeId]) {
			userProgress.value[themeId] = {}
		}

		// Если уже сохранено, лишний раз не дергаем базу
		if (userProgress.value[themeId][taskId] === 'success') return

		userProgress.value[themeId][taskId] = 'success'

		const auth = getAuth()
		const db = getFirestore()

		if (!auth.currentUser) return

		try {
			const docRef = doc(db, 'users', auth.currentUser.uid, 'text_tasks', 'progress')
			const pureData = JSON.parse(JSON.stringify(userProgress.value))
			await setDoc(docRef, pureData, { merge: true })
		} catch (error) {
			console.error(error)
		}
	}

	return {
		currentTask,
		availableWords,
		blanksState,
		isChecking,
		tasksList,
		currentTaskIndex,
		currentThemeId,
		userProgress,
		isAllFilled,
		initTask,
		placeWord,
		returnWord,
		toggleCheck,
		nextTask,
		loadUserProgress,
		saveTaskProgress
	}
})