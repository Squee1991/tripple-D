import { db } from '../utils/firebase-admin.js'
import { deleteDailyRoom } from '../utils/daily-api.js'
import { FieldValue } from 'firebase-admin/firestore'

export default defineEventHandler(async (event) => {
	try {
		const { dailyApiKey } = useRuntimeConfig(event)
		const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000)

		const snapshot = await db
			.collection('speakingRooms')
			.where('status', 'in', ['waiting', 'active'])
			.where('createdAt', '<', fourHoursAgo)
			.get()

		if (snapshot.empty) {
			return { cleaned: 0 }
		}

		let cleaned = 0
		const batch = db.batch()

		for (const doc of snapshot.docs) {
			const room = doc.data()
			await deleteDailyRoom(dailyApiKey, room.dailyRoomName).catch(() => {})
			batch.update(doc.ref, {
				status: 'closed',
				closedAt: FieldValue.serverTimestamp()
			})
			cleaned++
		}

		await batch.commit()
		return { cleaned }
	} catch (err) {
		throw createError({ statusCode: 500, statusMessage: 'Cleanup failed', data: String(err) })
	}
})
