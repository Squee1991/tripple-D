import { db } from '../utils/firebase-admin.js'
import { verifyFirebaseToken } from '../utils/verify-firebase-token.js'
import { createMeetingToken } from '../utils/daily-api.js'
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

		if (room.status === 'closed') {
			throw createError({ statusCode: 400, statusMessage: 'Room is closed' })
		}

		const isAlreadyIn = room.participantIds && room.participantIds.includes(user.uid)
		if (!isAlreadyIn && room.participantCount >= room.maxParticipants) {
			throw createError({ statusCode: 400, statusMessage: 'Room is full' })
		}

		const { dailyApiKey } = useRuntimeConfig(event)
		const isOwner = room.hostId === user.uid

		const tokenRes = await createMeetingToken(dailyApiKey, {
			roomName: room.dailyRoomName,
			userName: user.email || 'User',
			isOwner,
			expSeconds: 14400
		})

		const userDoc = await db.collection('users').doc(user.uid).get()
		const userData = userDoc.exists ? userDoc.data() : {}

		const updates = {}
		if (!isAlreadyIn) {
			updates[`participants.${user.uid}`] = {
				name: userData.name || user.email || 'Unknown',
				avatar: userData.avatar || '1.png',
				joinedAt: new Date().toISOString(),
				role: isOwner ? 'host' : 'participant'
			}
			updates.participantIds = FieldValue.arrayUnion(user.uid)
			updates.participantCount = FieldValue.increment(1)
		}

		if (room.status === 'waiting' && !isAlreadyIn) {
			updates.status = 'active'
		}

		if (Object.keys(updates).length > 0) {
			await roomRef.update(updates)
		}

		const updatedDoc = await roomRef.get()

		return {
			token: tokenRes.token,
			dailyRoomUrl: room.dailyRoomUrl,
			room: { id: roomId, ...updatedDoc.data() }
		}
	} catch (err) {
		if (err.statusCode) throw err
		throw createError({ statusCode: 500, statusMessage: 'Failed to join room', data: String(err) })
	}
})
