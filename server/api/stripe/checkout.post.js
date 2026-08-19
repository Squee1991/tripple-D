import Stripe from 'stripe'
import { readBody, defineEventHandler, setResponseStatus, getHeaders } from 'h3'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getPriceDataForUser } from '../../utils/regionalPrices.js'

const COUPON_MAP = {
	sale_3: 'sale_3',
	sale_5: 'sale_5',
	sale_6: 'sale_6',
	sale_10: 'sale_10',
	sale_15: 'sale_15'
}

export default defineEventHandler(async (event) => {
	if (getApps().length === 0) {
		try {
			const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
			if (!serviceAccountJson) {
				throw new Error('Ключ GOOGLE_APPLICATION_CREDENTIALS_JSON не найден в Vercel!')
			}
			const serviceAccount = JSON.parse(serviceAccountJson)
			if (serviceAccount.private_key) {
				serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
			}
			initializeApp({
				credential: cert(serviceAccount)
			})
			console.log('✅ [Checkout] Firebase Admin успешно подключен!')
		} catch (e) {
			console.error('❌ ОШИБКА FIREBASE:', e.message)
			setResponseStatus(event, 500)
			return { error: 'Server Config Error: ' + e.message }
		}
	}
	const config = useRuntimeConfig()
	const siteUrl = config.public?.siteUrl || 'http://localhost:3000'
	const stripeSecret = config.stripeSecret || process.env.STRIPE_SECRET_KEY

	if (!stripeSecret) {
		setResponseStatus(event, 500)
		return { error: 'Server Auth Error: No Stripe Key' }
	}

	const stripe = new Stripe(stripeSecret, {
		apiVersion: '2024-06-20'
	})

	const body = await readBody(event) || {}
	let { userId, email, couponId } = body

	if (userId) userId = userId.trim()
	if (email) email = email.trim().toLowerCase()
	if (couponId) couponId = couponId.trim()

	if (!userId || !email) {
		setResponseStatus(event, 400)
		return { error: 'Missing required fields: userId or email' }
	}

	const headers = getHeaders(event)
	const userCountry = headers['cf-ipcountry'] || headers['x-vercel-ip-country'] || 'DE'
	const priceData = getPriceDataForUser(userCountry)
	const priceId = priceData.id

	try {
		const db = getFirestore()
		const userDocRef = db.collection('users').doc(userId)
		const userDoc = await userDocRef.get()
		let userData = {}
		if (userDoc.exists) {
			userData = userDoc.data()
		}
		if (userData.subscriptionEndsAt) {
			const endDate = new Date(userData.subscriptionEndsAt)
			if (endDate > new Date()) {
				setResponseStatus(event, 409)
				return { error: 'У вас уже есть активная подписка', alreadySubscribed: true }
			}
		}
		let stripeCustomerId = userData.stripeCustomerId
		if (!stripeCustomerId) {
			const existingCustomers = await stripe.customers.list({
				email: email,
				limit: 1
			})
			if (existingCustomers.data.length > 0) {
				stripeCustomerId = existingCustomers.data[0].id
				await userDocRef.set({ stripeCustomerId }, { merge: true })
				console.log('🔄 Восстановили удаленного Stripe Customer:', stripeCustomerId)
			} else {
				const customer = await stripe.customers.create({
					email,
					metadata: { firebaseUID: userId }
				})
				stripeCustomerId = customer.id
				await userDocRef.set({ stripeCustomerId }, { merge: true })
				console.log('✅ Новый Stripe Customer создан:', stripeCustomerId)
			}
		}
		const subscriptions = await stripe.subscriptions.list({
			customer: stripeCustomerId,
			status: 'all',
			limit: 10
		})
		const hasActiveSubscription = subscriptions.data.some((sub) =>
			['active', 'trialing'].includes(sub.status)
		)
		if (hasActiveSubscription) {
			setResponseStatus(event, 409)
			return { error: 'У пользователя уже есть активная подписка', alreadySubscribed: true }
		}

		// ИСПРАВЛЕНИЕ 1: ЗАКРЫВАЕМ СТАРУЮ СЕССИЮ ВМЕСТО ЕЁ ВОЗВРАТА
		const openSessions = await stripe.checkout.sessions.list({
			customer: stripeCustomerId,
			status: 'open',
			limit: 1
		})
		if (openSessions.data.length > 0) {
			await stripe.checkout.sessions.expire(openSessions.data[0].id)
			console.log('🔄 Закрыли старую сессию, создаем новую с актуальным купоном')
		}

		const sessionOptions = {
			mode: 'subscription',
			customer: stripeCustomerId,
			line_items: [{ price: priceId, quantity: 1 }],
			success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${siteUrl}/cancel`,
			metadata: {
				firebaseUID: userId,
				discountId: couponId || null
			},
			subscription_data: {
				metadata: {
					firebaseUID: userId,
					discountId: couponId || null
				}
			}
		}

		const hasDiscountInDB = userData[couponId] || userData.premiumDiscount?.[couponId];

		console.log('--- ПРОВЕРКА СКИДКИ НА БЭКЕНДЕ ---');
		console.log('1. Пришел купон с фронта:', couponId);
		console.log('2. Скидки юзера в БД:', userData.premiumDiscount);
		console.log('3. Итог проверки (hasDiscountInDB):', !!hasDiscountInDB);

		if (couponId && userData && hasDiscountInDB) {
			const realStripeCouponId = COUPON_MAP[couponId]
			if (realStripeCouponId) {
				sessionOptions.discounts = [{ coupon: realStripeCouponId }]
				console.log(`✅ Применяем скидку в Stripe: ${realStripeCouponId}`)
			} else {
				console.log(`❌ Купон ${couponId} не найден в словаре COUPON_MAP`)
				sessionOptions.allow_promotion_codes = true
			}
		} else {
			console.log('❌ Бэкенд отклонил скидку, включаем ручной ввод промокода')
			sessionOptions.allow_promotion_codes = true
		}

		const session = await stripe.checkout.sessions.create(sessionOptions)
		return { sessionId: session.id, url: session.url }

	} catch (e) {
		console.error('❌ STRIPE CHECKOUT ERROR:', e.message)
		setResponseStatus(event, 400)
		return { error: e.message }
	}
})