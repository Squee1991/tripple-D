import { defineEventHandler, readBody } from 'h3'
import Stripe from 'stripe'
// Импорт базы оставим только чтобы галочку поставить в конце
import { db } from '../utils/firebase-admin.js'

export default defineEventHandler(async (event) => {
    try {
        // 1. Принимаем Email с фронтенда
        const { email, uid } = await readBody(event)

        if (!email) {
            return { success: false, error: 'Email обязателен для поиска в Stripe' }
        }


        const { stripeSecret } = useRuntimeConfig()
        const key = stripeSecret || process.env.STRIPE_SECRET_KEY
        const stripe = new Stripe(key, { apiVersion: '2024-06-20' })

        // 2. Спрашиваем у Stripe: "Дай мне клиента с таким Email"
        const customers = await stripe.customers.list({
            email: email,
            limit: 1
        })

        if (customers.data.length === 0) {
            console.error('[Cancel] Клиент с таким email не найден в Stripe')
            return { success: false, error: 'В Stripe нет такого email' }
        }

        const customerId = customers.data[0].id


        // 3. Ищем у него АКТИВНУЮ подписку
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1
        })

        // Если активных нет, проверим триал (trialing)
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
            // Можно вернуть успех, так как цель достигнута (подписки нет)
            return { success: true, message: 'No active subscription found' }
        }


        // 4. ОТМЕНЯЕМ (Netflix-style)
        await stripe.subscriptions.update(subId, {
            cancel_at_period_end: true,
        })

        // 5. Пытаемся отметить в базе (если UID есть), но если упадет - пофиг, главное Stripe
        if (uid) {
            try {
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