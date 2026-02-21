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

		const updates = {
			[`participants.${user.uid}`]: FieldValue.delete(),
			participantIds: FieldValue.arrayRemove(user.uid),
			participantCount: FieldValue.increment(-1)
		}

		await roomRef.update(updates)

		const updatedDoc = await roomRef.get()
		const updatedRoom = updatedDoc.data()

		if (updatedRoom.participantCount <= 0 || (updatedRoom.participantIds && updatedRoom.participantIds.length === 0)) {
			const { dailyApiKey } = useRuntimeConfig(event)
			await deleteDailyRoom(dailyApiKey, room.dailyRoomName).catch(() => {})
			await roomRef.update({
				status: 'closed',
				closedAt: FieldValue.serverTimestamp()
			})
		}

		return { success: true }
	} catch (err) {
		if (err.statusCode) throw err
		throw createError({ statusCode: 500, statusMessage: 'Failed to leave room', data: String(err) })
	}
})
