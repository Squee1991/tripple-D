import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const useTrainerStore = defineStore('thematic', () => {
	const topic = ref('')
	const jsonData = ref(null)
	const selectedLevel = ref(null)
	const selectedModule = ref(null)
	const completedModules = ref([]) // [{ level, id }]

	// Добавить пройденный модуль
	const addCompletedModule = (level, id) => {
		if (!completedModules.value.some(m => m.level === level && m.id === id)) {
			completedModules.value.push({ level, id })
			saveProgress()
		}
	}

	// Сохранение прогресса
	const saveProgress = async () => {
		const auth = getAuth()
		const db = getFirestore()
		const user = auth.currentUser
		if (!user) return
		const progress = {
			level: selectedLevel.value?.level,
			module: selectedModule.value?.id,
			completedModules: completedModules.value,
		}
		const docRef = doc(db, 'progress', user.uid)
		const docSnap = await getDoc(docRef)
		let data = {}
		if (docSnap.exists()) data = docSnap.data()
		data[topic.value] = progress
		await setDoc(docRef, data)
	}

	// Загрузка прогресса
	const loadProgress = async () => {
		const auth = getAuth()
		const db = getFirestore()
		let user = auth.currentUser
		if (!user) {
			user = await new Promise(resolve => {
				const unsubscribe = onAuthStateChanged(auth, usr => {
					if (usr) {
						unsubscribe()
						resolve(usr)
					}
				})
				setTimeout(() => {
					unsubscribe()
					resolve(null)
				}, 1300)
			})
		}
		if (!user) {
			completedModules.value = []
			return
		}
		const docRef = doc(db, 'progress', user.uid)
		const docSnap = await getDoc(docRef)
		if (docSnap.exists()) {
			const data = docSnap.data()
			if (data[topic.value]) {
				const t = data[topic.value]
				// Миграция старого формата:
				if (Array.isArray(t.completedModules) && typeof t.completedModules[0] === 'number') {
					// если был старый формат [1,2,3]
					completedModules.value = t.completedModules.map(id => ({ level: 1, id })) // по умолчанию, можно скорректировать если были уровни
				} else if (Array.isArray(t.completedModules)) {
					completedModules.value = t.completedModules
				} else {
					completedModules.value = []
				}
				if (t.level && t.module) {
					await setThemeAndModule(topic.value, t.level, t.module)
				}
			} else {
				completedModules.value = []
			}
		} else {
			completedModules.value = []
		}
	}

	const setThemeAndModule = async (topicName, level, module) => {
		topic.value = topicName
		const res = await fetch(`/${topicName}.json`)
		jsonData.value = await res.json()
		selectedLevel.value = jsonData.value.levels.find(l => l.level === level)
		selectedModule.value = selectedLevel.value.modules.find(m => m.id === module)
	}

	return {
		topic,
		jsonData,
		selectedLevel,
		selectedModule,
		completedModules,
		setThemeAndModule,
		addCompletedModule,
		saveProgress,
		loadProgress,
	}
})
