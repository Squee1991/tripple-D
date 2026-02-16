import Stripe from 'stripe'
import { readBody, defineEventHandler } from 'h3'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
	// --- ИНИЦИАЛИЗАЦИЯ FIREBASE ---
	if (getApps().length === 0) {
		try {
			let serviceAccountPath = path.resolve(process.cwd(), 'service-account-dev.json')
			if (!fs.existsSync(serviceAccountPath)) {
				serviceAccountPath = path.resolve(process.cwd(), 'service-account.json')
			}
			if (fs.existsSync(serviceAccountPath)) {
				const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))
				initializeApp({ credential: cert(serviceAccount) })
			} else {
				console.error('❌ ОШИБКА: Не найден файл ключей Firebase')
				return { success: false, error: 'Server configuration error' }
			}
		} catch (e) {
			console.error('Ошибка инициализации Firebase:', e)
			return { success: false, error: 'Firebase init failed' }
		}
	}
	const config = useRuntimeConfig()
	const stripeKey = config.stripeSecret || process.env.STRIPE_SECRET_KEY
	if (!stripeKey) return { success: false, error: 'No Stripe Key' }

	const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
	const body = await readBody(event)
	const { sessionId } = body
	if (!sessionId) return { success: false, error: 'No session_id' }
	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId, {
			expand: ['subscription']
		})

		if (session.payment_status === 'paid') {
			let subscriptionEndsAt = null
			if (session.subscription && typeof session.subscription === 'object') {
				subscriptionEndsAt = new Date(session.subscription.current_period_end * 1000).toISOString()
			}

			const userId = session.metadata?.firebaseUID
			const discountUsed = session.metadata?.discountId || null

			if (userId) {
				const db = getFirestore()
				const updateData = {
					isPremium: true,
					subscriptionCancelled: false,
					subscriptionEndsAt: subscriptionEndsAt,
					subscriptionId: session.subscription?.id || session.subscription || null,
					updatedAt: new Date().toISOString()
				}
				if (discountUsed && ['sale_5', 'sale_10', 'sale_15'].includes(discountUsed)) {
					updateData[discountUsed] = false
					console.log("🔥 Сервер: Скидка ${discountUsed} сброшена для юзера ")
				}
				await db.collection('users').doc(userId).set(updateData, { merge: true })
			}

			return {
				success: true,
				data: {
					isPremium: true,
					subscriptionEndsAt: subscriptionEndsAt,
					discountUsed: discountUsed
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