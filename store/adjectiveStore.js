import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { playCorrect, playWrong, unlockAudioByUserGesture } from '../utils/soundManager.js'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, updateDoc, runTransaction, serverTimestamp } from 'firebase/firestore'

export const useQuizStore = defineStore('quiz', () => {
    const allQuestions = ref([])
    const currentQuestions = ref([])
    const userAnswers = ref({})
    const currentQuestionIndex = ref(0)
    const selectedOption = ref(null)
    const feedback = ref(null)
    const db = getFirestore()
    const auth = getAuth()
    const activeQuestion = computed(() => {
        if (currentQuestions.value.length > 0 && currentQuestionIndex.value < currentQuestions.value.length) {
            return currentQuestions.value[currentQuestionIndex.value]
        }
        return null
    })
    const score = computed(() => Object.values(userAnswers.value).filter(a => a && a.isCorrect).length)
    const quizCompleted = computed(() => currentQuestions.value.length > 0 && currentQuestionIndex.value >= currentQuestions.value.length)
    const context = ref({ modeId: null, topicId: null, fileName: null, contentVersion: null, attemptId: null })
    const questionIdsOrder = ref([])
    const startedAt = ref(null)

    function setContext({ modeId, topicId, fileName, contentVersion, attemptId }) {
        context.value.modeId = modeId ?? null
        context.value.topicId = topicId ?? null
        context.value.fileName = fileName ?? null
        context.value.contentVersion = contentVersion ?? 'v1'
        context.value.attemptId = attemptId || `att_${Date.now()}_${Math.random().toString(36).slice(2,8)}`
    }

    function uidOrThrow() {
        const uid = auth.currentUser?.uid
        if (!uid) throw new Error('Not authenticated')
        return uid
    }

    function requireContext() {
        if (!context.value.modeId || !context.value.topicId) {
            throw new Error(`Missing modeId/topicId: ${context.value.modeId}_${context.value.topicId}`)
        }
    }

    function sessionRef() {
        const uid = uidOrThrow()
        requireContext()
        return doc(db, 'users', uid, 'quizSessions', `${context.value.modeId}_${context.value.topicId}`)
    }
    function attemptRef(attemptId) {
        const uid = uidOrThrow()
        requireContext()
        return doc(db, 'users', uid, 'quizAttempts', attemptId)
    }
    function modeAggRef() {
        const uid = uidOrThrow()
        requireContext()
        return doc(db, 'users', uid, 'quizModes', context.value.modeId)
    }
    function topicAggRef() {
        const uid = uidOrThrow()
        requireContext()
        return doc(db, 'users', uid, 'quizTopics', `${context.value.modeId}_${context.value.topicId}`)
    }

    async function saveSessionStart() {
        try {
            await setDoc(sessionRef(), {
                attemptId: context.value.attemptId,
                modeId: context.value.modeId,
                topicId: context.value.topicId,
                fileName: context.value.fileName,
                contentVersion: context.value.contentVersion,
                questionIdsOrder: questionIdsOrder.value,
                currentQuestionIndex: currentQuestionIndex.value,
                userAnswersMap: {},
                selectedOption: null,
                startedAt: startedAt.value ? new Date(startedAt.value) : serverTimestamp(),
                updatedAt: serverTimestamp(),
                completed: false,
            }, { merge: true })
        } catch (e) {}
    }

    async function saveAnswer(index, answer, isCorrect) {
        try {
            await updateDoc(sessionRef(), {
                [`userAnswersMap.${index}`]: { answer, isCorrect },
                updatedAt: serverTimestamp()
            })
        } catch (e) {
            await setDoc(sessionRef(), {
                userAnswersMap: { [index]: { answer, isCorrect } },
                updatedAt: serverTimestamp()
            }, { merge: true })
        }
    }

    async function saveIndex() {
        try {
            await updateDoc(sessionRef(), {
                currentQuestionIndex: currentQuestionIndex.value,
                updatedAt: serverTimestamp()
            })
        } catch (e) {
            await setDoc(sessionRef(), {
                currentQuestionIndex: currentQuestionIndex.value,
                updatedAt: serverTimestamp()
            }, { merge: true })
        }
    }

    async function finalizeAttempt() {
        const total = currentQuestions.value.length
        const correct = Object.values(userAnswers.value).filter(a => a && a.isCorrect).length
        const scoreVal = correct
        const isPerfect = total > 0 && correct === total
        let durationSec = 0
        try {
            const startedMs = startedAt.value ? Number(startedAt.value) : Date.now()
            durationSec = Math.max(0, Math.round((Date.now() - startedMs) / 1000))
        } catch { durationSec = 0 }
        await setDoc(attemptRef(context.value.attemptId), {
            attemptId: context.value.attemptId,
            modeId: context.value.modeId,
            topicId: context.value.topicId,
            fileName: context.value.fileName,
            contentVersion: context.value.contentVersion,
            questionIdsOrder: questionIdsOrder.value,
            userAnswersMap: userAnswers.value,
            total,
            correct,
            score: scoreVal,
            isPerfect,
            durationSec,
            startedAt: startedAt.value ? new Date(startedAt.value) : serverTimestamp(),
            completedAt: new Date(),
        }, { merge: true })
        await setDoc(sessionRef(), { completed: true, updatedAt: serverTimestamp() }, { merge: true })
        await runTransaction(db, async (tx) => {
            const mRef = modeAggRef()
            const tRef = topicAggRef()
            const mSnap = await tx.get(mRef)
            const tSnap = await tx.get(tRef)
            const m = mSnap.exists() ? mSnap.data() : { attemptsCount: 0, bestScore: 0 }
            const t = tSnap.exists() ? tSnap.data() : { attemptsCount: 0, bestScore: 0, perfectSessionsCount: 0, fastestPerfectSec: null, hasPerfect: false, fastPerfectSessionsCount: 0 }

            const mAttempts = (m.attemptsCount || 0) + 1
            const tAttempts = (t.attemptsCount || 0) + 1

            const newPerfectCount = (t.perfectSessionsCount || 0) + (isPerfect ? 1 : 0)
            const newFastest = isPerfect ? Math.min(t.fastestPerfectSec ?? Infinity, durationSec ?? Infinity) : (t.fastestPerfectSec ?? null)
            const addFastPerfect = (isPerfect && (durationSec ?? 0) < 60) ? 1 : 0
            const newFastPerfectCount = (t.fastPerfectSessionsCount || 0) + addFastPerfect

            tx.set(mRef, {
                attemptsCount: mAttempts,
                bestScore: Math.max(m.bestScore || 0, scoreVal),
                lastPlayedAt: serverTimestamp()
            }, { merge: true })

            tx.set(tRef, {
                attemptsCount: tAttempts,
                bestScore: Math.max(t.bestScore || 0, scoreVal),
                lastPlayedAt: serverTimestamp(),
                modeId: context.value.modeId,
                topicId: context.value.topicId,
                perfectSessionsCount: newPerfectCount,
                fastestPerfectSec: Number.isFinite(newFastest) ? newFastest : (t.fastestPerfectSec ?? null),
                hasPerfect: (t.hasPerfect || isPerfect),
                fastPerfectSessionsCount: newFastPerfectCount
            }, { merge: true })
        })
    }

    function getQuestionId(q) {
        const base = q.question + '|' + q.options.join('||') + '|' + q.answer
        let h = 0
        for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0
        return 'q' + h.toString(16)
    }

    async function startNewQuiz(arg) {
        if (typeof arg !== 'object' || !arg.modeId || !arg.topicId) {
            throw new Error('startNewQuiz requires { modeId, topicId, fileName, contentVersion }')
        }
        const { modeId, topicId, fileName, contentVersion } = arg
        currentQuestions.value = []
        userAnswers.value = {}
        currentQuestionIndex.value = 0
        selectedOption.value = null
        feedback.value = null
        questionIdsOrder.value = []
        startedAt.value = Date.now()
        setContext({ modeId, topicId, fileName, contentVersion })
        try {
            const res = await fetch(fileName)
            allQuestions.value = await res.json()
        } catch {
            allQuestions.value = []
        }
        if (allQuestions.value && allQuestions.value.length > 0) {
            const withIds = allQuestions.value.map(q => ({ ...q, id: getQuestionId(q) }))
            const shuffled = [...withIds].sort(() => 0.5 - Math.random())
            const picked = shuffled.slice(0, 10)
            currentQuestions.value = picked
            questionIdsOrder.value = picked.map(q => q.id)
            await saveSessionStart()
        }
    }

    async function bumpAggOnAnswer(isCorrect) {
        try {
            await runTransaction(db, async (tx) => {
                const mRef = modeAggRef()
                const tRef = topicAggRef()

                const mSnap = await tx.get(mRef)
                const tSnap = await tx.get(tRef)
                const m = mSnap.exists() ? mSnap.data() : { totalAnswered: 0, totalCorrect: 0 }
                const t = tSnap.exists() ? tSnap.data() : { totalAnswered: 0, totalCorrect: 0 }

                const mAnswered = (m.totalAnswered || 0) + 1
                const mCorrect  = (m.totalCorrect  || 0) + (isCorrect ? 1 : 0)
                const tAnswered = (t.totalAnswered || 0) + 1
                const tCorrect  = (t.totalCorrect  || 0) + (isCorrect ? 1 : 0)

                tx.set(mRef, {
                    totalAnswered: mAnswered,
                    totalCorrect:  mCorrect,
                    averageAccuracy: mAnswered ? mCorrect / mAnswered : 0,
                    lastPlayedAt: serverTimestamp()
                }, { merge: true })

                tx.set(tRef, {
                    totalAnswered: tAnswered,
                    totalCorrect:  tCorrect,
                    averageAccuracy: tAnswered ? tCorrect / tAnswered : 0,
                    lastPlayedAt: serverTimestamp(),
                    modeId: context.value.modeId,
                    topicId: context.value.topicId
                }, { merge: true })
            })
        } catch {}
    }


    async function restoreOrStart({ modeId, topicId, fileName, contentVersion }) {
        setContext({ modeId, topicId, fileName, contentVersion })
        requireContext()
        await startNewQuiz({ modeId, topicId, fileName, contentVersion })
    }


    // async function restoreOrStart({ modeId, topicId, fileName, contentVersion }) {
    //     setContext({ modeId, topicId, fileName, contentVersion })
    //     requireContext()
    //     let snap = null
    //     try {
    //         const s = await getDoc(sessionRef())
    //         snap = s.exists() ? s.data() : null
    //     } catch {}
    //     if (!snap || snap.fileName !== fileName || snap.contentVersion !== contentVersion || snap.completed) {
    //         await startNewQuiz({ modeId, topicId, fileName, contentVersion })
    //         return
    //     }
    //     try {
    //         const res = await fetch(fileName)
    //         allQuestions.value = await res.json()
    //     } catch {
    //         allQuestions.value = []
    //     }
    //     const idMap = new Map()
    //     allQuestions.value.forEach(q => {
    //         const id = getQuestionId(q)
    //         idMap.set(id, { ...q, id })
    //     })
    //     currentQuestions.value = (snap.questionIdsOrder || []).map(id => idMap.get(id)).filter(Boolean)
    //     questionIdsOrder.value  = snap.questionIdsOrder || []
    //     currentQuestionIndex.value = snap.currentQuestionIndex || 0
    //     selectedOption.value = snap.selectedOption || null
    //     userAnswers.value = snap.userAnswersMap || {}
    //     startedAt.value = snap.startedAt ? new Date(snap.startedAt).getTime() : Date.now()
    //     feedback.value = null
    // }

    function chooseOption(option) {
        if (feedback.value === null) selectedOption.value = option
    }

    async function checkAnswer() {
        if (!selectedOption.value || !activeQuestion.value) return
        if (feedback.value !== null) return
        unlockAudioByUserGesture()
        const isCorrect = selectedOption.value === activeQuestion.value.answer
        feedback.value = isCorrect ? 'correct' : 'incorrect'
        if (isCorrect) playCorrect(); else playWrong()
        userAnswers.value[currentQuestionIndex.value] = { answer: selectedOption.value, isCorrect }
        try { await saveAnswer(currentQuestionIndex.value, selectedOption.value, isCorrect) } catch {}
        try { await bumpAggOnAnswer(isCorrect) } catch {}
    }



    async function nextQuestion() {
        if (currentQuestionIndex.value < currentQuestions.value.length) {
            currentQuestionIndex.value++
            selectedOption.value = null
            feedback.value = null
            try { await saveIndex() } catch {}
            if (currentQuestionIndex.value >= currentQuestions.value.length) {
                await finalizeAttempt()
            }
        }
    }

    return {
        score,
        quizCompleted,
        activeQuestion,
        currentQuestions,
        selectedOption,
        feedback,
        currentQuestionIndex,
        context,
        userAnswers,
        questionIdsOrder,
        startedAt,
        setContext,
        restoreOrStart,
        startNewQuiz,
        chooseOption,
        checkAnswer,
        nextQuestion,
    }
})
