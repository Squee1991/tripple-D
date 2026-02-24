import { db } from '../utils/firebase-admin.js'
import { verifyFirebaseToken } from '../utils/verify-firebase-token.js'
import { deleteDailyRoom } from '../utils/daily-api.js'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
	try {
		const user = await verifyFirebaseToken(event)
		const { roomId } = await readBody(event)

		if (!roomId) {
			throw createError({ statusCode: 400, statusMessage: 'roomId is required' })
		}

		const roomRef = db.collection('speakingRooms').doc(roomId)
		const roomDoc = await roomRef.get()

		if (!roomDoc.exists) {
			throw createError({ statusCode: 404, statusMessage: 'Room not found' })
		}

		const room = roomDoc.data()

		if (room.hostId !== user.uid) {
			throw createError({ statusCode: 403, statusMessage: 'Only the host can close the room' })
		}

		const { dailyApiKey } = useRuntimeConfig(event)
		await deleteDailyRoom(dailyApiKey, room.dailyRoomName).catch(() => {})

		await roomRef.update({
			status: 'closed',
			closedAt: FieldValue.serverTimestamp()
		})

		return { success: true }
	} catch (err) {
		if (err.statusCode) throw err
		throw createError({ statusCode: 500, statusMessage: 'Failed to close room', data: String(err) })
	}
})
