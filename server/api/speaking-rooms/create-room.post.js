import { db } from '../utils/firebase-admin.js'
import { verifyFirebaseToken } from '../utils/verify-firebase-token.js'
import { createDailyRoom } from '../utils/daily-api.js'
import { FieldValue } from 'firebase-admin/firestore'
const ALLOWED_TOPICS = [
	'general', 'family', 'daily-life', 'food', 'travel', 'hobbies',
	'health', 'work', 'education', 'technology', 'culture', 'environment'
]

let questionBanks = null
async function loadQuestionBanks() {
	if (!questionBanks) {
		const storage = useStorage('assets:server')
		questionBanks = await storage.getItem('speaking-questions/questions.json')
	}
	return questionBanks
}

export default defineEventHandler(async (event) => {
	try {
		const user = await verifyFirebaseToken(event)
		const { topic, cefrLevel, visibility = 'public', maxParticipants = 6 } = await readBody(event)

		const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1']
		if (!validLevels.includes(cefrLevel)) {
			throw createError({ statusCode: 400, statusMessage: 'Invalid CEFR level' })
		}
		if (!topic || typeof topic !== 'string') {
			throw createError({ statusCode: 400, statusMessage: 'Topic is required' })
		}
		const validTopic = ALLOWED_TOPICS.includes(topic) ? topic : 'general'
		const clampedMax = Math.min(Math.max(Number(maxParticipants) || 6, 2), 12)

		const { dailyApiKey } = useRuntimeConfig(event)
		if (!dailyApiKey) {
			throw createError({ statusCode: 500, statusMessage: 'DAILY_API_KEY is missing' })
		}

		const roomName = `skillup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
		const dailyRoom = await createDailyRoom(dailyApiKey, {
			name: roomName,
			maxParticipants: clampedMax,
			expSeconds: 14400
		})

		const banks = await loadQuestionBanks()
		const bankId = `${validTopic}-${cefrLevel}`
		const fallbackBankId = `general-${cefrLevel}`
		const bank = banks[bankId] || banks[fallbackBankId]
		let questions = []
		if (bank) {
			const allQ = bank.questions || []
			const shuffled = [...allQ].sort(() => Math.random() - 0.5)
			questions = shuffled.slice(0, 10)
		}

		const userDoc = await db.collection('users').doc(user.uid).get()
		const userData = userDoc.exists ? userDoc.data() : {}

		const roomData = {
			dailyRoomName: dailyRoom.name,
			dailyRoomUrl: dailyRoom.url,
			topic: validTopic,
			cefrLevel,
			visibility,
			maxParticipants: clampedMax,
			hostId: user.uid,
			hostName: userData.name || user.email || 'Unknown',
			hostAvatar: userData.avatar || '1.png',
			status: 'waiting',
			createdAt: FieldValue.serverTimestamp(),
			closedAt: null,
			participantCount: 1,
			participantIds: [user.uid],
			participants: {
				[user.uid]: {
					name: userData.name || user.email || 'Unknown',
					avatar: userData.avatar || '1.png',
					joinedAt: new Date().toISOString(),
					role: 'host'
				}
			},
			questions,
			currentQuestionIndex: 0
		}

		const roomRef = await db.collection('speakingRooms').add(roomData)

		return {
			roomId: roomRef.id,
			dailyRoomUrl: dailyRoom.url,
			dailyRoomName: dailyRoom.name
		}
	} catch (err) {
		if (err.statusCode) throw err
		throw createError({ statusCode: 500, statusMessage: 'Failed to create room', data: String(err) })
	}
})
