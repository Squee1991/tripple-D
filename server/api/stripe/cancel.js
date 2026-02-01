// import { defineEventHandler, readBody, createError } from 'h3'
// import Stripe from 'stripe'
// import { db } from '../utils/firebase-admin.js'
// export default defineEventHandler(async (event) => {
// 	try {
// 		const { uid } = await readBody(event)
// 		if (!uid) {
// 			throw createError({ statusCode: 400, statusMessage: 'Missing UID' })
// 		}
// 		const { stripeSecret } = useRuntimeConfig()
// 		if (!stripeSecret) {
// 			throw createError({ statusCode: 500, statusMessage: 'Stripe key missing' })
// 		}
// 		const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' })
//
// 		const userRef = db.collection('users').doc(uid)
// 		const userDoc = await userRef.get()
// 		const userData = userDoc.data()
//
// 		if (!userData || !userData.subscriptionId) {
// 			throw createError({ statusCode: 404, statusMessage: 'Subscription not found' })
// 		}
//
// 		await stripe.subscriptions.update(userData.subscriptionId, {
// 			cancel_at_period_end: true,
// 		})
//
// 		await userRef.update({
// 			subscriptionCancelled: true
//
// 		})
//
// 		console.log(`[cancel] Subscription ${userData.subscriptionId} scheduled to cancel at period end`)
// 		return { success: true, message: 'Subscription will be canceled at period end' }
// 	} catch (err) {
// 		console.error('[cancel] ERROR:', err)
// 		throw createError({ statusCode: 500, statusMessage: err.message })
// 	}
// })

import { defineEventHandler, readBody, createError } from 'h3'
import Stripe from 'stripe'
import { db } from '../utils/firebase-admin.js'
export default defineEventHandler(async (event) => {
	try {
		const { uid } = await readBody(event)
		if (!uid) throw createError({ statusCode: 400, message: 'Missing UID' })
		const { stripeSecret } = useRuntimeConfig()
		const key = stripeSecret || process.env.STRIPE_SECRET_KEY
		const stripe = new Stripe(key, { apiVersion: '2024-06-20' })
		const userRef = db.collection('users').doc(uid)
		const userDoc = await userRef.get()
		const userData = userDoc.data()
		if (!userData || !userData.subscriptionId) {
			return { success: false, error: 'Subscription ID not found' }
		}
		await stripe.subscriptions.update(userData.subscriptionId, {
			cancel_at_period_end: true,
		})
		await userRef.update({
			subscriptionCancelled: true
		})
		return { success: true }
	} catch (err) {
		throw createError({ statusCode: 500, message: err.message })
	}
})