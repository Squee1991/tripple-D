import Stripe from 'stripe'
import { readBody, defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const stripeKey = config.stripeSecret || process.env.STRIPE_SECRET_KEY
	if (!stripeKey) return { success: false, error: 'No Stripe Key' }
	const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
	const body = await readBody(event)
	const { sessionId } = body
	if (!sessionId) return { success: false, error: 'No session_id' }
	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId)
		if (session.payment_status === 'paid') {
			let subscriptionEndsAt = null
			if (session.subscription) {
				const date = new Date()
				date.setDate(date.getDate() + 30)
				subscriptionEndsAt = date.toISOString()
			}
			return {
				success: true,
				data: {
					isPremium: true,
					subscriptionId: session.subscription || null,
					subscriptionEndsAt: subscriptionEndsAt,
					updatedAt: new Date().toISOString()
				}
			}
		} else {
			return { success: false, error: 'Not paid' }
		}
	} catch (e) {
		console.error('Stripe Error:', e)
		return { success: false, error: e.message }
	}
})
