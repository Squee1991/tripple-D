import { defineStore } from 'pinia'
import { ref } from 'vue'
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
	const completedModules = ref([])

	const db = getFirestore()
	const progressDocRef = (uid, topicKey) =>
		doc(db, 'users', uid, 'thematicProgress', topicKey)

	const addCompletedModule = (level, id) => {
		if (!completedModules.value.some(m => m.level === level && m.id === id)) {
			completedModules.value.push({ level, id })
			daily.addThematicLearning(1)
			saveProgress()
		}
	}

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

	const saveProgress = async () => {
		const user = await ensureUser()
		if (!user || !topic.value) return

		const progress = {
			level: selectedLevel.value?.level ?? null,
			module: selectedModule.value?.id ?? null,
			completedModules: completedModules.value ?? [],
			updatedAt: serverTimestamp()
		}

		const docRef = progressDocRef(user.uid, topic.value)
		await setDoc(docRef, progress, { merge: true })
	}

	const loadProgress = async () => {
		const user = await ensureUser()
		if (!user || !topic.value) {
			completedModules.value = []
			return
		}

		const docRef = progressDocRef(user.uid, topic.value)
		const snap = await getDoc(docRef)

		if (!snap.exists()) {
			completedModules.value = []
			return
		}
		const t = snap.data()
		if (Array.isArray(t.completedModules) && typeof t.completedModules[0] === 'number') {
			completedModules.value = t.completedModules.map(id => ({ level: 1, id }))
		} else if (Array.isArray(t.completedModules)) {
			completedModules.value = t.completedModules
		} else {
			completedModules.value = []
		}
		if (t.level && t.module) {
			await setThemeAndModule(topic.value, t.level, t.module)
		}
	}

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
		completedModules,
		setThemeAndModule,
		addCompletedModule,
		saveProgress,
		loadProgress,
	}
})
