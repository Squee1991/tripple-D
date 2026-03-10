import { defineEventHandler, readBody } from 'h3'
import Stripe from 'stripe'
// Подключаем Firebase безопасно напрямую
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

export default defineEventHandler(async (event) => {
    // 1. Пуленепробиваемая инициализация из ENV
    if (getApps().length === 0) {
        try {
            const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
            if (!serviceAccountJson) {
                throw new Error('Ключ GOOGLE_APPLICATION_CREDENTIALS_JSON не найден в Vercel!')
            }

            const serviceAccount = JSON.parse(serviceAccountJson)

            // Магическая строчка: чинит приватный ключ
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
            }

            initializeApp({ credential: cert(serviceAccount) })
            console.log('✅ [Cancel] Firebase Admin успешно подключен из ENV!')
        } catch (e) {
            console.error('❌ ОШИБКА FIREBASE [Cancel]:', e.message)
            return { success: false, error: 'Server Config Error: ' + e.message }
        }
    }

    try {
        const { email, uid } = await readBody(event)

        if (!email) {
            return { success: false, error: 'Email обязателен для поиска в Stripe' }
        }
        const { stripeSecret } = useRuntimeConfig()
        const key = stripeSecret || process.env.STRIPE_SECRET_KEY
        const stripe = new Stripe(key, { apiVersion: '2024-06-20' })

        const customers = await stripe.customers.list({
            email: email,
            limit: 1
        })
        if (customers.data.length === 0) {
            console.error('[Cancel] Клиент с таким email не найден в Stripe')
            return { success: false, error: 'В Stripe нет такого email' }
        }

        const customerId = customers.data[0].id
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1
        })
        let subId = null
        if (subscriptions.data.length > 0) {
            subId = subscriptions.data[0].id
        } else {
            const trialSubs = await stripe.subscriptions.list({
                customer: customerId,
                status: 'trialing',
                limit: 1
            })
            if (trialSubs.data.length > 0) subId = trialSubs.data[0].id
        }

        if (!subId) {
            console.log('[Cancel] Активных подписок нет. Видимо, уже отменена.')
            return { success: true, message: 'No active subscription found' }
        }

        await stripe.subscriptions.update(subId, {
            cancel_at_period_end: true,
        })

        // 2. Безопасное обновление базы
        if (uid) {
            try {
                const db = getFirestore()
                await db.collection('users').doc(uid).update({ subscriptionCancelled: true })
            } catch (e) {
                console.error('[Cancel] Ошибка записи в базу (не критично):', e.message)
            }
        }

        return { success: true }

    } catch (err) {
        console.error('[Cancel] CRITICAL ERROR:', err)
        return { success: false, error: err.message }
    }
})