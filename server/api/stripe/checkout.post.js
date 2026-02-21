import Stripe from 'stripe'
import {readBody, defineEventHandler, setResponseStatus} from 'h3'
import {initializeApp, getApps, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import path from 'path'
import fs from 'fs'

const COUPON_MAP = {
    'sale_5': 'sale_5',
    'sale_10': 'sale_10',
    'sale_15': 'sale_15'
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const siteUrl = config.public?.siteUrl || 'http://localhost:3012'
    const stripeSecret = config.stripeSecret
    if (getApps().length === 0) {
        try {
            const isDev = process.env.NODE_ENV !== 'production'
            const filename = isDev ? 'service-account-dev.json' : 'service-account.json'
            const serviceAccountPath = path.resolve(process.cwd(), filename)
            console.log(`📂 Пытаюсь загрузить ключи из: ${filename}`)
            if (fs.existsSync(serviceAccountPath)) {
                const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))
                initializeApp({credential: cert(serviceAccount)})
                console.log('🌍 УСПЕШНОЕ ПОДКЛЮЧЕНИЕ К ПРОЕКТУ:', serviceAccount.project_id)
            } else {
                console.error(`⚠️ ОШИБКА: Файл ${filename} не найден! Проверь имя файла.`)
            }
        } catch (e) {
            console.error('Ошибка инициализации Firebase:', e)
        }
    }

    const stripe = new Stripe(stripeSecret, {apiVersion: '2024-06-20'})
    const body = await readBody(event) || {}
    let {priceId, userId, email, couponId} = body
    if (userId) userId = userId.trim()
    if (couponId) couponId = couponId.trim()

    try {
        const db = getFirestore()
        const userDocRef = db.collection('users').doc(userId || 'unknown')
        const userDoc = await userDocRef.get()
        let userData = {}
        if (userDoc.exists) {
            userData = userDoc.data()
            console.log(`✅ Юзер найден в базе: ${userId}`)
        } else {
            const currentApp = getApps()[0]
            const currentProjectId = currentApp ? currentApp.options.credential.projectId : 'unknown'
            console.warn(`⚠️ Юзер НЕ найден. (Сервер смотрит в проект: ${currentProjectId})`)
        }

        const sessionOptions = {
            mode: 'subscription',
            customer_email: email,
            line_items: [{price: priceId, quantity: 1}],
            success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/cancel`,
            metadata: {
                firebaseUID: userId,
                discountId: couponId || null
            },
        }

        if (couponId && userData && userData[couponId] === true) {
            const realStripeCouponId = COUPON_MAP[couponId]
            if (realStripeCouponId) {
                sessionOptions.discounts = [{coupon: realStripeCouponId}]
                console.log(`🎉 Скидка применена: ${realStripeCouponId}`)
            }
        } else {
            sessionOptions.allow_promotion_codes = true
            console.log('ℹ️ Скидка не применена. Включен ручной ввод.')
        }
        const session = await stripe.checkout.sessions.create(sessionOptions)
        return {sessionId: session.id, url: session.url}

    } catch (e) {
        console.error('❌ STRIPE ERROR:', e.message)
        setResponseStatus(event, 400)
        return {error: e.message}
    }
})