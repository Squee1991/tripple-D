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
			// 1. Сначала пробуем найти dev-ключ (твой файл)
			let serviceAccountPath = path.resolve(process.cwd(), 'service-account-dev.json')

			// 2. Если dev-файла нет, ищем обычный (для продакшена)
			if (!fs.existsSync(serviceAccountPath)) {
				serviceAccountPath = path.resolve(process.cwd(), 'service-account.json')
			}

			console.log(`📂 Загружаем ключи из: ${path.basename(serviceAccountPath)}`)

			if (fs.existsSync(serviceAccountPath)) {
				const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))
				initializeApp({
					credential: cert(serviceAccount)
				})
				console.log('✅ Firebase Admin успешно подключен!')
			} else {
				console.error('❌ ОШИБКА: Не найден ни service-account-dev.json, ни service-account.json')
				return { success: false, error: 'Server configuration error: missing firebase credentials' }
			}
		} catch (e) {
			console.error('Ошибка инициализации Firebase:', e)
			return { success: false, error: 'Firebase init failed' }
		}
	}
	// --------------------------------

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

			const userId = session.metadata?.firebaseUID

			if (userId) {
				const db = getFirestore()
				// Обновляем статус пользователя
				await db.collection('users').doc(userId).set({
					isPremium: true,
					subscriptionCancelled: false, // Убираем отмену
					subscriptionEndsAt: subscriptionEndsAt,
					subscriptionId: session.subscription || null,
					updatedAt: new Date().toISOString()
				}, { merge: true })
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