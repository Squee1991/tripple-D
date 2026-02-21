const DAILY_BASE_URL = 'https://api.daily.co/v1'

export async function createDailyRoom(apiKey, { name, maxParticipants = 6, expSeconds = 14400 }) {
	const res = await fetch(`${DAILY_BASE_URL}/rooms`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name,
			properties: {
				max_participants: maxParticipants,
				enable_chat: true,
				enable_screenshare: false,
				start_video_off: true,
				exp: Math.floor(Date.now() / 1000) + expSeconds
			}
		})
	})
	if (!res.ok) {
		const text = await res.text().catch(() => '')
		throw new Error(`Daily.co createRoom failed (${res.status}): ${text}`)
	}
	return res.json()
}

export async function createMeetingToken(apiKey, { roomName, userName, isOwner = false, expSeconds = 14400 }) {
	const res = await fetch(`${DAILY_BASE_URL}/meeting-tokens`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			properties: {
				room_name: roomName,
				user_name: userName,
				is_owner: isOwner,
				exp: Math.floor(Date.now() / 1000) + expSeconds
			}
		})
	})
	if (!res.ok) {
		const text = await res.text().catch(() => '')
		throw new Error(`Daily.co createMeetingToken failed (${res.status}): ${text}`)
	}
	return res.json()
}

export async function deleteDailyRoom(apiKey, roomName) {
	const res = await fetch(`${DAILY_BASE_URL}/rooms/${roomName}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${apiKey}`
		}
	})
	if (!res.ok && res.status !== 404) {
		const text = await res.text().catch(() => '')
		throw new Error(`Daily.co deleteRoom failed (${res.status}): ${text}`)
	}
	return true
}
