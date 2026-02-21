import { getAuth } from 'firebase-admin/auth'

export async function verifyFirebaseToken(event) {
	const authHeader = getHeader(event, 'authorization')
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw createError({ statusCode: 401, statusMessage: 'Missing or invalid Authorization header' })
	}
	const idToken = authHeader.slice(7)
	try {
		const decoded = await getAuth().verifyIdToken(idToken)
		return { uid: decoded.uid, email: decoded.email || '' }
	} catch (err) {
		throw createError({ statusCode: 401, statusMessage: 'Invalid Firebase token', data: String(err) })
	}
}
