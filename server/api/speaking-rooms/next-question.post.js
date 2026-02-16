import { db } from '../utils/firebase-admin.js'
import { verifyFirebaseToken } from '../utils/verify-firebase-token.js'

export default defineEventHandler(async (event) => {
	try {
		const user = await verifyFirebaseToken(event)
		const { roomId } = await readBody(event)

		if (!roomId || typeof roomId !== 'string') {
			throw createError({ statusCode: 400, statusMessage: 'roomId is required' })
		}

		const roomRef = db.collection('speakingRooms').doc(roomId)
		const roomSnap = await roomRef.get()

		if (!roomSnap.exists) {
			throw createError({ statusCode: 404, statusMessage: 'Room not found' })
		}

		const roomData = roomSnap.data()

		if (roomData.hostId !== user.uid) {
			throw createError({ statusCode: 403, statusMessage: 'Only the host can change questions' })
		}

		const currentIndex = roomData.currentQuestionIndex ?? 0
		const questions = roomData.questions || []
		const nextIdx = currentIndex + 1

		if (nextIdx >= questions.length) {
			throw createError({ statusCode: 400, statusMessage: 'No more questions available' })
		}

		const prevQuestion = questions[currentIndex]

		await roomRef.update({
			currentQuestionIndex: nextIdx,
		})

		return { success: true, currentQuestionIndex: nextIdx }
	} catch (err) {
		if (err.statusCode) throw err
		throw createError({ statusCode: 500, statusMessage: 'Failed to advance question', data: String(err) })
	}
})
