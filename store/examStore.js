import { defineStore } from "pinia"
import { ref, computed } from "vue"
import {
	getStorage,
	ref as storageRef,
	uploadBytes,
	getDownloadURL,
	listAll,
	deleteObject
} from "firebase/storage"
import { getApp } from "firebase/app"
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
import { getAuth, signInAnonymously } from "firebase/auth"
import { updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"

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
	const ownerUid = ref(null)
	const level = ref("")
	const locale = ref("")
	const startedAt = ref(null)
	const finishedAt = ref(null)
	const durationSec = ref(0)

	const speakingDraftBlobs = ref({})
	const speakingMedia = ref({})

	const saveLoading = ref(false)
	const saveError = ref(null)

	const db = getFirestore()
	const auth = getAuth()
	const storage = getStorage(getApp())
	const sref = (p) => storageRef(storage, p)

	const archiveAttempts = ref([])
	const archiveLoading = ref(false)
	const archiveError = ref(null)

	const sharedExams = ref([])
	const sharedLoading = ref(false)
	const sharedError = ref(null)

	const currentArchiveAttempt = ref(null)
	const currentArchiveLoading = ref(false)
	const currentArchiveError = ref(null)

	const genId = () => "att_" + Math.random().toString(36).slice(2) + Date.now().toString(36)
	const attemptDocRef = () => (attemptId.value ? doc(db, "examAttempts", attemptId.value) : null)

	const scoreMap = {
		"ausgezeichnet": 10, "fast perfekt": 9, "gut": 8, "kleine fehler": 7,
		"mittelmäßig": 6, "okay": 5, "viele fehler": 4, "muss verbessert werden": 3,
		"schlecht": 2, "sehr schlecht": 1, "keine antwort": 0,
	}

	const currentExercise = computed(() => exercises.value[currentIndex.value])
	const isFinished = computed(() => currentIndex.value >= exercises.value.length)

	async function ensureAuth() {
		if (!auth.currentUser) await signInAnonymously(auth)
		return auth.currentUser?.uid || null
	}

	async function loadTopics(theme) {
		loading.value = true
		try {
			const res = await fetch(theme)
			const data = await res.json()
			exercises.value = data.modules || []
			currentIndex.value = 0
			userAnswers.value = []
		} finally {
			loading.value = false
		}
	}

	async function startAttempt({ level: lvl, locale: loc }) {
		const uid = await ensureAuth()
		ownerUid.value = uid || null

		attemptId.value = genId()
		level.value = (lvl || "").toUpperCase()
		locale.value = loc || "de-DE"
		startedAt.value = Date.now()
		finishedAt.value = null
		durationSec.value = 0
		userAnswers.value = []
		currentIndex.value = 0
		speakingDraftBlobs.value = {}
		speakingMedia.value = {}
		saveError.value = null
	}

	async function answerCurrent(userAnswer, feedback = null) {
		const current = currentExercise.value
		if (!current || !current.task || !current.id) return
		const correct = current.task.answer ? userAnswer === current.task.answer : true
		userAnswers.value.push({
			id: current.id,
			answer: userAnswer ?? null,
			correct: !!correct,
			feedback: feedback || null,
		})
		currentIndex.value++
	}

	async function uploadSpeakingAudio({ exerciseId, blob, durationSec: d = 0, transcription = "" }) {
		if (!exerciseId || !blob) return null
		if (!speakingDraftBlobs.value[exerciseId]) speakingDraftBlobs.value[exerciseId] = []
		speakingDraftBlobs.value[exerciseId].push({
			blob,
			durationSec: Number.isFinite(d) ? d : 0,
			transcription: transcription || ""
		})
		return URL.createObjectURL(blob)
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

			const speakingFiles = exer.type === "speaking-prompt"
				? (speakingMedia.value[exer.id] || []).map((m) => ({
					exerciseId: exer.id,
					storagePath: m.storagePath || null,
					url: m.url || null,
					durationSec: m.durationSec || 0,
					transcription: m.transcription || "",
				}))
				: []

			return pruneUndefinedDeep({
				id: ans.id,
				module: exer.title || "Unbekannt",
				type: exer.type,
				score,
				answer: ans.answer ?? null,
				taskText,
				question,
				feedback: ans.feedback || null,
				...(exer.type.includes("choice") ? { correct: !!ans.correct } : {}),
				...(speakingFiles.length ? { speaking: { audioFiles: speakingFiles } } : {}),
			})
		}).filter(Boolean)

		const totalScore = items.reduce((s, it) => s + (it.score || 0), 0)
		const averageScore = items.length ? Number(((totalScore / (items.length * 10)) * 10).toFixed(1)) : 0

		const perModuleAcc = {}
		for (const it of items) {
			const mod = it.module || "Unbekannt"
			if (!perModuleAcc[mod]) perModuleAcc[mod] = { sum: 0, count: 0 }
			perModuleAcc[mod].sum += it.score || 0
			perModuleAcc[mod].count += 1
		}

		const perModuleScores = {}
		for (const mod in perModuleAcc) {
			const { sum, count } = perModuleAcc[mod]
			perModuleScores[mod] = Number(((sum / (count * 10)) * 10).toFixed(1))
		}

		return pruneUndefinedDeep({
			attemptId: attemptId.value || genId(),
			ownerUid: ownerUid.value || null,
			sharedWith: [],
			pendingShares: [],
			level: level.value || "",
			locale: locale.value || "de-DE",
			startedAt: startedAt.value || null,
			finishedAt: finishedAt.value || null,
			durationSec: durationSec.value || 0,
			averageScore,
			perModuleScores,
			status: "finished",
			items,
		})
	}

	async function deleteStorageFolderRecursive(rootPath) {
		const rootRef = sref(rootPath)
		async function walkAndDelete(dirRef) {
			try {
				const { items, prefixes } = await listAll(dirRef)
				await Promise.all(items.map(itemRef => deleteObject(itemRef).catch(() => {})))
				await Promise.all(prefixes.map(prefixRef => walkAndDelete(prefixRef)))
			} catch (error) {
				if (error?.code !== "storage/object-not-found") console.error(error)
			}
		}
		await walkAndDelete(rootRef)
	}

	async function finalizeAttemptAndSave() {
		saveLoading.value = true
		saveError.value = null
		try {
			const uid = await ensureAuth()
			ownerUid.value = uid || ownerUid.value || null
			if (!uid || !attemptId.value) throw new Error("No auth or attemptId")

			finishAttempt()

			const uploaded = {}
			for (const [exerciseId, arr] of Object.entries(speakingDraftBlobs.value || {})) {
				const list = Array.isArray(arr) ? arr : []
				const blobsOnly = list.filter(x => x?.blob)
				if (!blobsOnly.length) continue
				uploaded[exerciseId] = []
				for (const item of blobsOnly) {
					const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webm`
					const path = `examAttempts/${attemptId.value}/${exerciseId}/${fileName}`
					const fileRef = sref(path)
					await uploadBytes(fileRef, item.blob, {
						contentType: "audio/webm",
						customMetadata: { ownerUid: uid, attemptId: attemptId.value }
					})
					const url = await getDownloadURL(fileRef)
					uploaded[exerciseId].push({
						durationSec: item.durationSec || 0,
						transcription: item.transcription || "",
						storagePath: path,
						url,
					})
				}
			}

			speakingMedia.value = uploaded

			const snapshot = buildAttemptSnapshot()
			const refDoc = attemptDocRef()
			if (!refDoc) throw new Error("No doc ref")

			await setDoc(refDoc, pruneUndefinedDeep({
				...snapshot,
				ownerUid: ownerUid.value || uid,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			}), { merge: true })

			return true
		} catch (e) {
			saveError.value = e?.message || String(e)
			return false
		} finally {
			saveLoading.value = false
		}
	}

	async function abortAttempt() {
		if (attemptId.value) {
			await deleteStorageFolderRecursive(`examAttempts/${attemptId.value}`)
			await deleteDoc(doc(db, "examAttempts", attemptId.value)).catch(() => {})
		}
		resetCurrentAttemptState()
		speakingDraftBlobs.value = {}
		speakingMedia.value = {}
	}

	async function deleteExam(examId) {
		if (!examId) return
		const uid = await ensureAuth()
		if (!uid) return
		try {
			const refDoc = doc(db, "examAttempts", examId)
			await deleteStorageFolderRecursive(`examAttempts/${examId}`)
			await deleteDoc(refDoc)
			archiveAttempts.value = archiveAttempts.value.filter(a => a.id !== examId)
			if (currentArchiveAttempt.value?.id === examId) clearCurrentArchiveAttempt()
		} catch (e) {
			console.error(e)
		}
	}

	async function loadArchiveAttempts() {
		const uid = await ensureAuth()
		if (!uid) {
			archiveAttempts.value = []
			return
		}
		archiveLoading.value = true
		archiveError.value = null
		try {
			const q = query(
				collection(db, "examAttempts"),
				where("ownerUid", "==", uid),
				orderBy("startedAt", "desc"),
				limit(100)
			)
			const snap = await getDocs(q)
			archiveAttempts.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
		} catch (e) {
			archiveError.value = e?.message || "Не удалось загрузить архив"
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
			const docRef = doc(db, "examAttempts", id)
			const docSnap = await getDoc(docRef)
			if (!docSnap.exists()) throw new Error("Документ не найден")
			const data = docSnap.data()
			if (data.startedAt?.toDate) data.startedAt = data.startedAt.toDate().getTime()
			if (data.finishedAt?.toDate) data.finishedAt = data.finishedAt.toDate().getTime()
			currentArchiveAttempt.value = { id: docSnap.id, ...data }
		} catch (e) {
			currentArchiveError.value = e?.message || "Не удалось загрузить результат"
		} finally {
			currentArchiveLoading.value = false
		}
	}

	function clearCurrentArchiveAttempt() {
		currentArchiveAttempt.value = null
		currentArchiveError.value = null
	}

	async function shareExamWithFriend(examId, friendUid) {
		const myUid = await ensureAuth()
		if (!myUid || !examId || !friendUid) throw new Error("Недостаточно данных для отправки")
		const examRef = doc(db, "examAttempts", examId)
		const examSnap = await getDoc(examRef)
		if (!examSnap.exists()) throw new Error("Экзамен не найден")
		const exam = examSnap.data()
		if (exam.ownerUid !== myUid) throw new Error("Нет прав на отправку этого экзамена")
		const alreadyPending = Array.isArray(exam.pendingShares) && exam.pendingShares.includes(friendUid)
		const alreadyShared = Array.isArray(exam.sharedWith) && exam.sharedWith.includes(friendUid)
		if (alreadyPending || alreadyShared) return { ok: true, already: true }

		let fromName = "Anonymous"
		let fromAvatar = null
		try {
			const myProfileSnap = await getDoc(doc(db, "users", myUid))
			if (myProfileSnap.exists()) {
				const p = myProfileSnap.data()
				fromName = p?.name || p?.displayName || "Anonymous"
				fromAvatar = p?.avatarUrl || p?.avatar || p?.photoURL || null
			}
		} catch {}

		const notifRef = doc(db, "users", friendUid, "sharedExams", examId)
		await setDoc(notifRef, {
			examId,
			fromUid: myUid,
			fromName,
			fromAvatar,
			status: "pending",
			createdAt: serverTimestamp(),
		})
		await updateDoc(examRef, { pendingShares: arrayUnion(friendUid) })
		return { ok: true, already: false }
	}

	async function loadSharedExams() {
		const myUid = await ensureAuth()
		sharedLoading.value = true
		sharedError.value = null
		sharedExams.value = []
		try {
			if (!myUid) return
			const q = query(
				collection(db, "users", myUid, "sharedExams"),
				orderBy("createdAt", "desc")
			)
			const snap = await getDocs(q)
			const promises = snap.docs.map(async (d) => {
				const shareInfo = d.data()
				const examSnap = await getDoc(doc(db, "examAttempts", shareInfo.examId))
				if (!examSnap.exists()) return null
				return { shareId: d.id, ...shareInfo, examDetails: examSnap.data() }
			})
			sharedExams.value = (await Promise.all(promises)).filter(Boolean)
		} catch (e) {
			console.error(e)
			sharedError.value = "Не удалось загрузить экзамены, которыми с вами поделились"
		} finally {
			sharedLoading.value = false
		}
	}

	async function acceptShare(shareInfo) {
		const myUid = auth.currentUser?.uid || null
		if (!myUid || !shareInfo?.examId) return
		const examRef = doc(db, "examAttempts", shareInfo.examId)
		await updateDoc(examRef, {
			pendingShares: arrayRemove(myUid),
			sharedWith: arrayUnion(myUid)
		})
		const shareNotificationRef = doc(db, "users", myUid, "sharedExams", shareInfo.examId)
		await updateDoc(shareNotificationRef, { status: "accepted" })
		const local = sharedExams.value.find(e => e.shareId === shareInfo.shareId)
		if (local) local.status = "accepted"
	}

	async function declineShare(shareInfo) {
		const myUid = auth.currentUser?.uid || null
		if (!myUid || !shareInfo?.examId) return
		const examRef = doc(db, "examAttempts", shareInfo.examId)
		await updateDoc(examRef, { pendingShares: arrayRemove(myUid) })
		const shareNotificationRef = doc(db, "users", myUid, "sharedExams", shareInfo.examId)
		await deleteDoc(shareNotificationRef)
		sharedExams.value = sharedExams.value.filter(e => e.shareId !== shareInfo.shareId)
	}

	function resetCurrentAttemptState() {
		attemptId.value = null
		ownerUid.value = null
		level.value = ""
		locale.value = ""
		startedAt.value = null
		finishedAt.value = null
		durationSec.value = 0
		userAnswers.value = []
		currentIndex.value = 0
		speakingMedia.value = {}
		saveError.value = null
	}

	return {
		exercises, currentIndex, userAnswers, loading,
		attemptId, ownerUid, level, locale,
		startedAt, finishedAt, durationSec,
		speakingMedia, speakingDraftBlobs,
		saveLoading, saveError,
		currentExercise, isFinished,

		loadTopics, startAttempt, answerCurrent, uploadSpeakingAudio,
		finishAttempt, buildAttemptSnapshot, finalizeAttemptAndSave, abortAttempt,

		archiveAttempts, archiveLoading, archiveError, loadArchiveAttempts,
		currentArchiveAttempt, currentArchiveLoading, currentArchiveError,
		loadSingleAttempt, clearCurrentArchiveAttempt,
		deleteExam,

		sharedExams, sharedLoading, sharedError,
		shareExamWithFriend, loadSharedExams, acceptShare, declineShare
	}
})
