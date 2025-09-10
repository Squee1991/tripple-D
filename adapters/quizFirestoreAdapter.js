	// import { getAuth } from 'firebase/auth'
	// import {getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, runTransaction} from 'firebase/firestore'
	//
	// function requireUid() {
	// 	const uid = getAuth().currentUser?.uid
	// 	if (!uid) throw new Error('No authenticated user (uid missing).')
	// 	return uid
	// }
	//
	// function sessionRef(db, uid, modeId, topicId) {
	// 	return doc(db, 'users', uid, 'quizSessions', `${modeId}_${topicId}`)
	// }
	// // function attemptRef(db, uid, attemptId) {
	// // 	return doc(db, 'users', uid, 'quizAttempts', attemptId)
	// // }
	// // function modeAggRef(db, uid, modeId) {
	// // 	return doc(db, 'users', uid, 'quizModes', modeId)
	// // }
	// // function topicAggRef(db, uid, modeId, topicId) {
	// // 	return doc(db, 'users', uid, 'quizTopics', `${modeId}_${topicId}`)
	// // }
	//
	// export function createQuizFirestoreAdapter() {
	// 	const db = getFirestore()
	//
	// 	return {
	// 		async loadSession(modeId, topicId) {
	// 			const uid = requireUid()
	// 			const ref = sessionRef(db, uid, modeId, topicId)
	// 			const snap = await getDoc(ref)
	// 			return snap.exists() ? snap.data() : null
	// 		},
	//
	// 		async saveSessionStart(snap) {
	// 			const uid = requireUid()
	// 			const ref = sessionRef(db, uid, snap.modeId, snap.topicId)
	// 			await setDoc(ref, {
	// 				...snap,
	// 				startedAt: snap.startedAt ? new Date(snap.startedAt) : serverTimestamp(),
	// 				updatedAt: serverTimestamp(),
	// 				completed: false
	// 			}, { merge: true })
	// 		},
	//
	// 		async saveAnswer(modeId, topicId, index, answer, isCorrect) {
	// 			const uid = requireUid()
	// 			const ref = sessionRef(db, uid, modeId, topicId)
	// 			await updateDoc(ref, {
	// 				[`userAnswersMap.${index}`]: { answer, isCorrect },
	// 				updatedAt: serverTimestamp()
	// 			})
	// 		},
	//
	// 		async saveIndex(modeId, topicId, currentQuestionIndex) {
	// 			const uid = requireUid()
	// 			const ref = sessionRef(db, uid, modeId, topicId)
	// 			await updateDoc(ref, {
	// 				currentQuestionIndex,
	// 				updatedAt: serverTimestamp()
	// 			})
	// 		},
	//
	// 		async finalizeAttempt(payload) {
	// 			const uid = requireUid()
	// 			const {
	// 				attemptId, modeId, topicId, fileName, contentVersion,
	// 				questionIdsOrder, userAnswersMap, total, correct, score,
	// 				startedAt, completedAt
	// 			} = payload
	//
	// 			const att = attemptRef(db, uid, attemptId)
	// 			const modeAgg = modeAggRef(db, uid, modeId)
	// 			const topicAgg = topicAggRef(db, uid, modeId, topicId)
	//
	// 			await setDoc(att, {
	// 				attemptId, modeId, topicId, fileName, contentVersion,
	// 				questionIdsOrder,
	// 				userAnswersMap,
	// 				total, correct, score,
	// 				startedAt: startedAt ? new Date(startedAt) : serverTimestamp(),
	// 				completedAt: completedAt ? new Date(completedAt) : serverTimestamp()
	// 			}, { merge: true })
	//
	// 			await runTransaction(db, async (tx) => {
	// 				const mSnap = await tx.get(modeAgg)
	// 				const m = mSnap.exists() ? mSnap.data() : {
	// 					modeId, attemptsCount: 0, bestScore: 0,
	// 					totalAnswered: 0, totalCorrect: 0, averageAccuracy: 0, lastPlayedAt: null
	// 				}
	// 				const mAttempts = (m.attemptsCount || 0) + 1
	// 				const mAnswered = (m.totalAnswered || 0) + (total || 0)
	// 				const mCorrect = (m.totalCorrect || 0) + (correct || 0)
	// 				const mAcc = mAnswered > 0 ? mCorrect / mAnswered : 0
	//
	// 				tx.set(modeAgg, {
	// 					modeId,
	// 					attemptsCount: mAttempts,
	// 					bestScore: Math.max(m.bestScore || 0, score || 0),
	// 					totalAnswered: mAnswered,
	// 					totalCorrect: mCorrect,
	// 					averageAccuracy: mAcc,
	// 					lastPlayedAt: serverTimestamp()
	// 				}, { merge: true })
	// 				const tSnap = await tx.get(topicAgg)
	// 				const t = tSnap.exists() ? tSnap.data() : {
	// 					modeId, topicId, attemptsCount: 0, bestScore: 0,
	// 					totalAnswered: 0, totalCorrect: 0, averageAccuracy: 0, lastPlayedAt: null
	// 				}
	// 				const tAttempts = (t.attemptsCount || 0) + 1
	// 				const tAnswered = (t.totalAnswered || 0) + (total || 0)
	// 				const tCorrect = (t.totalCorrect || 0) + (correct || 0)
	// 				const tAcc = tAnswered > 0 ? tCorrect / tAnswered : 0
	//
	// 				tx.set(topicAgg, {
	// 					modeId, topicId,
	// 					attemptsCount: tAttempts,
	// 					bestScore: Math.max(t.bestScore || 0, score || 0),
	// 					totalAnswered: tAnswered,
	// 					totalCorrect: tCorrect,
	// 					averageAccuracy: tAcc,
	// 					lastPlayedAt: serverTimestamp()
	// 				}, { merge: true })
	// 			})
	// 		},
	//
	// 		async markSessionCompleted(modeId, topicId) {
	// 			const uid = requireUid()
	// 			const ref = sessionRef(db, uid, modeId, topicId)
	// 			await setDoc(ref, { completed: true, updatedAt: serverTimestamp() }, { merge: true })
	// 		},
	// 	}
	// }
