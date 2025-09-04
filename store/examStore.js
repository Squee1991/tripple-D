import {defineStore} from "pinia"
import {ref, computed} from "vue"
import {
	getFirestore,
	doc,
	setDoc,
	serverTimestamp,
	collection,
	query,
	where,
	orderBy,
	limit,
	getDocs,
	deleteDoc,
	getDoc
} from "firebase/firestore"
import {getAuth} from "firebase/auth"
function pruneUndefinedDeep(v) {
	if (Array.isArray(v)) return v.map(pruneUndefinedDeep).filter(x => x !== undefined)
	if (v && typeof v === "object") {
		const out = {}
		for (const [k, val] of Object.entries(v)) {
			if (val === undefined) continue
			const cleaned = pruneUndefinedDeep(val)
			if (cleaned !== undefined) out[k] = cleaned
		}
		return out
	}
	return v === undefined ? undefined : v
}

export const userExamStore = defineStore("exam", () => {
	const exercises = ref([])
	const currentIndex = ref(0)
	const userAnswers = ref([])
	const loading = ref(false)
	const attemptId = ref(null)
	const level = ref("")
	const locale = ref("")
	const startedAt = ref(null)
	const finishedAt = ref(null)
	const durationSec = ref(0)
	const speakingMedia = ref({})
	const db = getFirestore()
	const auth = getAuth()
	const archiveAttempts = ref([])
	const archiveLoading = ref(false)
	const archiveError = ref(null)

	const currentArchiveAttempt = ref(null)
	const currentArchiveLoading = ref(false)
	const currentArchiveError = ref(null)

	const genId = () => "att_" + Math.random().toString(36).slice(2) + Date.now().toString(36)
	const attemptDocRef = () => (attemptId.value ? doc(db, "examAttempts", attemptId.value) : null)
	const currentUserUid = () => auth.currentUser?.uid || null

	const scoreMap = {
		"ausgezeichnet": 10, "fast perfekt": 9, "gut": 8, "kleine fehler": 7,
		"mittelmäßig": 6, "okay": 5, "viele fehler": 4, "muss verbessert werden": 3,
		"schlecht": 2, "сеhr schlecht": 1, "keine antwort": 0,
	}

	const currentExercise = computed(() => exercises.value[currentIndex.value])
	const isFinished = computed(() => currentIndex.value >= exercises.value.length)

	async function loadTopics(theme) {
		loading.value = true
		try {
			const res = await fetch(theme)
			const data = await res.json()
			exercises.value = data.modules
			currentIndex.value = 0
			userAnswers.value = []
		} catch (e) {
			console.error("Failed to load topics", e)
		} finally {
			loading.value = false
		}
	}

	async function deleteExam(examId) {
		if (!examId) return
		const uid = currentUserUid()
		if (!uid) return
		try {
			const refDoc = doc(db, "examAttempts", examId)
			const snap = await getDoc(refDoc)
			if (!snap.exists()) return
			const data = snap.data()
			if (data.ownerUid !== uid) return
			await deleteDoc(refDoc)
			if (attemptId.value === examId) resetCurrentAttemptState()
			archiveAttempts.value = archiveAttempts.value.filter(a => a.id !== examId)
			if (currentArchiveAttempt.value?.id === examId) clearCurrentArchiveAttempt()
		} catch (e) {
			console.error("Ошибка при удалении:", e)
		}
	}

	async function saveProgressDraft(extra = {}) {
		const refDoc = attemptDocRef()
		if (!refDoc) return
		try {
			const payload = pruneUndefinedDeep({
				ownerUid: currentUserUid(),
				level: level.value || "",
				locale: locale.value || "de-DE",
				startedAt: startedAt.value,
				status: "draft",
				currentIndex: currentIndex.value,
				userAnswers: userAnswers.value,
				speakingMedia: speakingMedia.value,
				updatedAt: serverTimestamp(),
				...extra,
			})
			await setDoc(refDoc, payload, {merge: true})
		} catch (e) {
			console.error("Autosave failed:", e)
		}
	}

	async function answerCurrent(userAnswer, feedback = null) {
		const current = currentExercise.value
		if (!current || !current.task || !current.id) {
			console.warn("Нет текущего упражнения — ответ не засчитан")
			return
		}
		const correct = current.task.answer ? userAnswer === current.task.answer : true
		userAnswers.value.push({
			id: current.id,
			answer: userAnswer ?? null,
			correct: !!correct,
			feedback: feedback || null,
		})
		currentIndex.value++
		await saveProgressDraft()
	}

	async function startAttempt({level: lvl, locale: loc}) {
		attemptId.value = genId()
		level.value = (lvl || "").toUpperCase()
		locale.value = loc || "de-DE"
		startedAt.value = Date.now()
		finishedAt.value = null
		durationSec.value = 0
		userAnswers.value = []
		currentIndex.value = 0
		speakingMedia.value = {}
		const refDoc = attemptDocRef()
		if (!refDoc) return
		try {
			const payload = pruneUndefinedDeep({
				ownerUid: currentUserUid(),
				level: level.value,
				locale: locale.value,
				startedAt: startedAt.value,
				status: "draft",
				currentIndex: 0,
				userAnswers: [],
				speakingMedia: {},
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			})
			await setDoc(refDoc, payload, {merge: true})
		} catch (e) {
			console.error("Failed to init attempt doc:", e)
		}
	}

	async function recordSpeakingMeta({exerciseId, durationSec: d = 0, transcription = ""}) {
		if (!exerciseId) return
		if (!speakingMedia.value[exerciseId]) speakingMedia.value[exerciseId] = []
		speakingMedia.value[exerciseId].push({
			durationSec: Number.isFinite(d) ? d : 0,
			transcription: transcription || "",
		})
		await saveProgressDraft()
	}

	function finishAttempt() {
		if (!startedAt.value) return
		finishedAt.value = Date.now()
		durationSec.value = Math.max(0, Math.round((finishedAt.value - startedAt.value) / 1000))
	}

	function buildAttemptSnapshot() {
		const items = userAnswers.value.map((ans) => {
			const exer = exercises.value.find((e) => e.id === ans.id)
			if (!exer) return null
			let score = 0
			if (exer.type === "multiple-choice" || exer.type === "audio-choice") {
				score = ans.correct ? 10 : 0
			} else if (exer.type === "text-input" || exer.type === "speaking-prompt") {
				const key = (ans.feedback?.result || "").toLowerCase()
				score = scoreMap[key] ?? 0
			}
			const taskText = exer.task?.instruction || exer.task?.prompt || exer.task?.text || null
			const question = exer.task?.question || null
			const speakingFiles = exer.type === "speaking-prompt" ? (speakingMedia.value[exer.id] || []).map((m) => ({
				exerciseId: exer.id,
				storagePath: null,
				durationSec: m.durationSec || 0,
				transcription: m.transcription || "",
			})) : []
			return pruneUndefinedDeep({
				id: ans.id,
				module: exer.title || "Unbekannt",
				type: exer.type,
				score,
				answer: ans.answer ?? null,
				taskText,
				question,
				feedback: ans.feedback || null,
				...(exer.type.includes("choice") ? {correct: !!ans.correct} : {}),
				...(speakingFiles.length ? {speaking: {audioFiles: speakingFiles}} : {}),
			})
		}).filter(Boolean)
		const totalScore = items.reduce((s, it) => s + (it.score || 0), 0)
		const averageScore = items.length ? Number(((totalScore / (items.length * 10)) * 10).toFixed(1)) : 0
		const perModuleAcc = {}
		for (const it of items) {
			const mod = it.module || "Unbekannt"
			if (!perModuleAcc[mod]) perModuleAcc[mod] = {sum: 0, count: 0}
			perModuleAcc[mod].sum += it.score || 0
			perModuleAcc[mod].count += 1
		}
		const perModuleScores = {}
		for (const mod in perModuleAcc) {
			const {sum, count} = perModuleAcc[mod]
			perModuleScores[mod] = Number(((sum / (count * 10)) * 10).toFixed(1))
		}
		return pruneUndefinedDeep({
			attemptId: attemptId.value || genId(), ownerUid: currentUserUid(), sharedWith: [],
			pendingShares: [], level: level.value || "", locale: locale.value || "de-DE",
			startedAt: startedAt.value || null, finishedAt: finishedAt.value || null,
			durationSec: durationSec.value || 0, averageScore, perModuleScores,
			status: "finished", items,
		})
	}

	async function finalizeAttemptAndSave() {
		finishAttempt()
		const refDoc = attemptDocRef()
		if (!refDoc) return
		const snapshot = buildAttemptSnapshot()
		try {
			await setDoc(refDoc, pruneUndefinedDeep({...snapshot, updatedAt: serverTimestamp()}), {merge: true})
		} catch (e) {
			console.error("Failed to finalize attempt:", e)
		}
	}

	async function loadArchiveAttempts() {
		const uid = currentUserUid()
		if (!uid) {
			archiveAttempts.value = []
			return
		}
		archiveLoading.value = true
		archiveError.value = null
		try {
			const q = query(collection(db, 'examAttempts'), where('ownerUid', '==', uid), orderBy('startedAt', 'desc'), limit(100))
			const snap = await getDocs(q)
			archiveAttempts.value = snap.docs.map(d => ({id: d.id, ...d.data()}))
		} catch (e) {
			console.error(e)
			archiveError.value = e?.message || 'Не удалось загрузить архив'
		} finally {
			archiveLoading.value = false
		}
	}

	async function loadSingleAttempt(id) {
		if (!id) {
			currentArchiveError.value = "Не передан ID попытки"
			return
		}
		currentArchiveLoading.value = true
		currentArchiveError.value = null
		currentArchiveAttempt.value = null
		try {
			const docRef = doc(db, 'examAttempts', id)
			const docSnap = await getDoc(docRef)
			if (!docSnap.exists()) {
				throw new Error('Документ не найден')
			}
			currentArchiveAttempt.value = {id: docSnap.id, ...docSnap.data()}
		} catch (e) {
			console.error(e)
			currentArchiveError.value = e?.message || 'Не удалось загрузить результат'
		} finally {
			currentArchiveLoading.value = false
		}
	}

	function clearCurrentArchiveAttempt() {
		currentArchiveAttempt.value = null
		currentArchiveError.value = null
	}

	function resetCurrentAttemptState() {
		attemptId.value = null
		level.value = ""
		locale.value = ""
		startedAt.value = null
		finishedAt.value = null
		durationSec.value = 0
		userAnswers.value = []
		currentIndex.value = 0
		speakingMedia.value = {}
	}

	return {
		exercises, currentIndex, userAnswers, loading, attemptId, level, locale,
		startedAt, finishedAt, durationSec, speakingMedia, currentExercise, isFinished,
		loadTopics, answerCurrent, startAttempt, recordSpeakingMeta, finishAttempt,
		buildAttemptSnapshot, finalizeAttemptAndSave,
		archiveAttempts, archiveLoading, archiveError, loadArchiveAttempts,
		currentArchiveAttempt, currentArchiveLoading, currentArchiveError,
		loadSingleAttempt, clearCurrentArchiveAttempt,
		deleteExam
	}
})