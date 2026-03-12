import Stripe from 'stripe'
import { defineEventHandler, readRawBody, getHeader, setResponseStatus } from 'h3'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

export default defineEventHandler(async (event) => {
	if (getApps().length === 0) {
		try {
			const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
			if (serviceAccountJson) {
				const serviceAccount = JSON.parse(serviceAccountJson)
				if (serviceAccount.private_key) {
					serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
				}
				initializeApp({ credential: cert(serviceAccount) })
			}
		} catch (e) {
			console.error('❌ ОШИБКА FIREBASE [Webhook]:', e.message)
			setResponseStatus(event, 500)
			return { error: 'Server Config Error' }
		}
	}
	const config = useRuntimeConfig()
	const stripeKey = config.stripeSecret || process.env.STRIPE_SECRET_KEY
	const webhookSecret = config.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET

	if (!stripeKey || !webhookSecret) {
		console.error('❌ ОШИБКА: Нет ключей Stripe или Webhook Secret')
		setResponseStatus(event, 500)
		return { error: 'Keys missing' }
	}

	const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
	const body = await readRawBody(event)
	const signature = getHeader(event, 'stripe-signature')
	let stripeEvent
	try {
		stripeEvent = stripe.webhooks.constructEvent(body, signature, webhookSecret)
	} catch (err) {
		console.error(`⚠️ Ошибка подписи вебхука: ${err.message}`)
		setResponseStatus(event, 400)
		return { error: `Webhook Error: ${err.message}` }
	}
	if (stripeEvent.type === 'checkout.session.completed') {
		const session = stripeEvent.data.object
		const userId = session.metadata?.firebaseUID
		const discountUsed = session.metadata?.discountId || null

		if (userId) {
			try {
				const db = getFirestore()
				let subscriptionEndsAt = null
				if (session.subscription) {
					const subDetails = await stripe.subscriptions.retrieve(session.subscription)
					subscriptionEndsAt = new Date(subDetails.current_period_end * 1000).toISOString()
				}

				const updateData = {
					isPremium: true,
					subscriptionCancelled: false,
					subscriptionEndsAt: subscriptionEndsAt,
					subscriptionId: session.subscription || null,
					updatedAt: new Date().toISOString()
				}
				if (discountUsed && ['sale_5', 'sale_10', 'sale_15'].includes(discountUsed)) {
					updateData[discountUsed] = false
					console.log(`🔥 [Webhook] Скидка ${discountUsed} сброшена для юзера ${userId}`)
				}
				await db.collection('users').doc(userId).set(updateData, { merge: true })
				console.log(`✅ [Webhook] Юзер ${userId} получил премиум!`)
			} catch (dbError) {
				console.error('❌ [Webhook] Ошибка записи в базу:', dbError)
			}
		}
	}
	return { received: true }
})