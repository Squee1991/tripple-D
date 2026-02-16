import { db } from '../utils/firebase-admin.js'
import { verifyFirebaseToken } from '../utils/verify-firebase-token.js'
import { readFileSync } from 'fs'
import { join } from 'path'

let questionBanks = null
function loadQuestionBanks() {
	if (!questionBanks) {
		const filePath = join(process.cwd(), 'public', 'speaking-questions', 'questions.json')
		questionBanks = JSON.parse(readFileSync(filePath, 'utf-8'))
	}
	return questionBanks
}

export default defineEventHandler(async (event) => {
	try {
		const user = await verifyFirebaseToken(event)
		const { roomId } = await readBody(event)

		if (!roomId) {
			throw createError({ statusCode: 400, statusMessage: 'roomId is required' })
		}

		const roomRef = db.collection('speakingRooms').doc(roomId)
		const roomSnap = await roomRef.get()

		if (!roomSnap.exists) {
			throw createError({ statusCode: 404, statusMessage: 'Room not found' })
		}

		const roomData = roomSnap.data()

		if (roomData.hostId !== user.uid) {
			throw createError({ statusCode: 403, statusMessage: 'Only the host can reload questions' })
		}

		const topic = roomData.topic || 'general'
		const cefrLevel = roomData.cefrLevel || 'B1'

		const banks = loadQuestionBanks()
		const bankId = `${topic}-${cefrLevel}`
		const fallbackBankId = `general-${cefrLevel}`
		const bank = banks[bankId] || banks[fallbackBankId]

		let questions = []
		if (bank) {
			const allQ = bank.questions || []
			const shuffled = [...allQ].sort(() => Math.random() - 0.5)
			questions = shuffled.slice(0, 10)
		}

		await roomRef.update({
			questions,
			currentQuestionIndex: 0,
		})

		return { success: true, questionCount: questions.length }
	} catch (err) {
		if (err.statusCode) throw err
		throw createError({ statusCode: 500, statusMessage: 'Failed to reload questions', data: String(err) })
	}
})
