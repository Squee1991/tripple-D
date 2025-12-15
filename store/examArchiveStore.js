import { defineStore } from "pinia"
import { ref } from "vue"
import {
	getFirestore,
	collection,
	query,
	where,
	orderBy,
	limit,
	getDocs,
	doc,
	getDoc,
} from "firebase/firestore"

const db = getFirestore()

export const useExamArchiveStore = defineStore("examArchive", () => {
	const attempts = ref([])
	const attemptsLoading = ref(false)
	const attemptsError = ref(null)

	const currentAttempt = ref(null)
	const currentAttemptLoading = ref(false)
	const currentAttemptError = ref(null)

	async function fetchAttemptsForUser(ownerUid, max = 100) {
		attemptsLoading.value = true
		attemptsError.value = null
		attempts.value = []
		try {
			const q = query(
				collection(db, "examAttempts"),
				where("ownerUid", "==", ownerUid),
				orderBy("startedAt", "desc"),
				limit(max)
			)
			const snap = await getDocs(q)
			attempts.value = snap.docs.map(document => ({ id: document.id, ...document.data() }))
		} catch (error) {
			attemptsError.value = error?.message || "Не удалось загрузить архив"
		} finally {
			attemptsLoading.value = false
		}
	}

	async function fetchAttemptById(id) {
		currentAttemptLoading.value = true
		currentAttemptError.value = null
		currentAttempt.value = null
		try {
			const dref = doc(db, "examAttempts", id)
			const snap = await getDoc(dref)
			if (!snap.exists()) throw new Error("Документ не найден")
			currentAttempt.value = { id: snap.id, ...snap.data() }
		} catch (error) {
			currentAttemptError.value = error?.message || "Не удалось загрузить результат"
		} finally {
			currentAttemptLoading.value = false
		}
	}

	function clearCurrentAttempt() {
		currentAttempt.value = null
		currentAttemptError.value = null
	}
	return {
		attempts,
		attemptsLoading,
		attemptsError,
		currentAttempt,
		currentAttemptLoading,
		currentAttemptError,
		fetchAttemptsForUser,
		fetchAttemptById,
		clearCurrentAttempt,
	}
})
