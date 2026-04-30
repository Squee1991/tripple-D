import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
	getFirestore,
	doc,
	setDoc,
	getDoc,
	serverTimestamp
} from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { dailyStore } from './dailyStore.js'

export const useTrainerStore = defineStore('thematic', () => {
	const daily = dailyStore()
	const topic = ref('')
	const jsonData = ref(null)
	const selectedLevel = ref(null)
	const selectedModule = ref(null)
	const moduleProgress = ref({})

	const db = getFirestore()
	const progressDocRef = (uid, topicKey) =>
		doc(db, 'users', uid, 'thematicProgress', topicKey)

	const ensureUser = async () => {
		const auth = getAuth()
		if (auth.currentUser) return auth.currentUser
		return await new Promise(resolve => {
			const unsub = onAuthStateChanged(auth, u => {
				if (u) { unsub(); resolve(u) }
			})
			setTimeout(() => { unsub(); resolve(null) }, 1300)
		})
	}

	const saveModuleAttempt = async (level, id, mistakes) => {
		const key = `L${level}_M${id}`
		const currentProgress = moduleProgress.value[key]
		if (currentProgress && currentProgress.completed) return
		const isCompleted = mistakes.length === 0
		moduleProgress.value[key] = {
			completed: isCompleted,
			mistakes: mistakes
		}

		if (isCompleted) {
			daily.addThematicLearning(1)
		}

		await saveProgressToFirebase()
	}

	const saveProgressToFirebase = async () => {
		const user = await ensureUser()
		if (!user || !topic.value) return

		const progress = {
			level: selectedLevel.value?.level ?? null,
			module: selectedModule.value?.id ?? null,
			moduleProgress: moduleProgress.value,
			updatedAt: serverTimestamp()
		}

		const docRef = progressDocRef(user.uid, topic.value)
		await setDoc(docRef, progress, { merge: true })
	}

	const loadProgress = async () => {
		const user = await ensureUser()
		if (!user || !topic.value) {
			moduleProgress.value = {}
			return
		}

		const docRef = progressDocRef(user.uid, topic.value)
		const snap = await getDoc(docRef)

		if (!snap.exists()) {
			moduleProgress.value = {}
			return
		}

		const t = snap.data()
		const loadedProgress = t.moduleProgress || {}

		if (t.completedModules && !t.moduleProgress) {
			t.completedModules.forEach(m => {
				let level, id;
				if (typeof m === 'number') { level = 1; id = m; }
				else { level = m.level; id = m.id; }
				loadedProgress[`L${level}_M${id}`] = { completed: true, mistakes: [] }
			})
		}
		moduleProgress.value = loadedProgress

		if (t.level && t.module) {
			await setThemeAndModule(topic.value, t.level, t.module)
		}
	}

	const getModuleProgress = (level, id) => {
		return moduleProgress.value[`L${level}_M${id}`] || null
	}

	const completedModules = computed(() => {
		const completed = []
		for (const key in moduleProgress.value) {
			if (moduleProgress.value[key].completed) {
				const match = key.match(/L(\d+)_M(\d+)/)
				if (match) completed.push({ level: Number(match[1]), id: Number(match[2]) })
			}
		}
		return completed
	})

	const setThemeAndModule = async (topicName, level, moduleId) => {
		topic.value = topicName
		const res = await fetch(`/${topicName}.json`)
		jsonData.value = await res.json()
		selectedLevel.value = jsonData.value.levels.find(l => l.level === Number(level)) ?? null
		selectedModule.value = selectedLevel.value
			? selectedLevel.value.modules.find(m => m.id === Number(moduleId)) ?? null
			: null
	}

	return {
		topic,
		jsonData,
		selectedLevel,
		selectedModule,
		moduleProgress,
		completedModules,
		getModuleProgress,
		setThemeAndModule,
		saveModuleAttempt,
		loadProgress,
	}
})