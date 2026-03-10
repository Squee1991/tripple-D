// import Stripe from 'stripe'
// import { readBody, defineEventHandler, setResponseStatus } from 'h3'
// import { getFirestore } from 'firebase-admin/firestore'
// import { initializeApp, getApps, cert } from 'firebase-admin/app'
// import fs from 'fs'
// import path from 'path'
//
// const COUPON_MAP = {
//     'sale_5': 'sale_5',
//     'sale_10': 'sale_10',
//     'sale_15': 'sale_15'
// }
//
// export default defineEventHandler(async (event) => {
//     if (getApps().length === 0) {
//         try {
//             let serviceAccountPath = path.resolve(process.cwd(), 'service-account-dev.json')
//             if (!fs.existsSync(serviceAccountPath)) {
//                 serviceAccountPath = path.resolve(process.cwd(), 'service-account.json')
//             }
//             console.log(`📂 [Checkout] Загружаем ключи из: ${path.basename(serviceAccountPath)}`)
//             if (fs.existsSync(serviceAccountPath)) {
//                 const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))
//                 initializeApp({
//                     credential: cert(serviceAccount)
//                 })
//                 console.log('✅ [Checkout] Firebase Admin успешно подключен!')
//             } else {
//                 console.error('❌ ОШИБКА: Ключи не найдены!')
//             }
//         } catch (e) {
//             console.error('Ошибка инициализации Firebase:', e)
//         }
//     }
//     const config = useRuntimeConfig()
//     const siteUrl = config.public?.siteUrl || 'http://localhost:3000'
//     const stripeSecret = config.stripeSecret || process.env.STRIPE_SECRET_KEY
//     if (!stripeSecret) {
//         setResponseStatus(event, 500)
//         return { error: 'Server Auth Error: No Stripe Key' }
//     }
//     const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' })
//     const body = await readBody(event) || {}
//     let { priceId, userId, email, couponId } = body
//     if (userId) userId = userId.trim()
//     if (couponId) couponId = couponId.trim()
//     try {
//         const db = getFirestore()
//         const userDocRef = db.collection('users').doc(userId || 'unknown')
//         const userDoc = await userDocRef.get()
//
//         let userData = {}
//         if (userDoc.exists) {
//             userData = userDoc.data()
//         }
//
//         const sessionOptions = {
//             mode: 'subscription',
//             customer_email: email,
//             line_items: [{ price: priceId, quantity: 1 }],
//             success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${siteUrl}/cancel`,
//             metadata: {
//                 firebaseUID: userId,
//                 discountId: couponId || null
//             },
//         }
//         // Логика купонов
//         if (couponId && userData && userData[couponId] === true) {
//             const realStripeCouponId = COUPON_MAP[couponId]
//             if (realStripeCouponId) {
//                 sessionOptions.discounts = [{ coupon: realStripeCouponId }]
//                 console.log(`🎉 Скидка применена: ${realStripeCouponId}`)
//             }
//         } else {
//             sessionOptions.allow_promotion_codes = true
//         }
//
//         const session = await stripe.checkout.sessions.create(sessionOptions)
//         return { sessionId: session.id, url: session.url }
//
//     } catch (e) {
//         console.error('❌ STRIPE CHECKOUT ERROR:', e.message)
//         setResponseStatus(event, 400)
//         return { error: e.message }
//     }
// })

import Stripe from 'stripe'
import { readBody, defineEventHandler, setResponseStatus } from 'h3'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

const COUPON_MAP = {
    'sale_5': 'sale_5',
    'sale_10': 'sale_10',
    'sale_15': 'sale_15'
}

export default defineEventHandler(async (event) => {
    // 1. Инициализация Firebase без использования fs (безопасно для Vercel)
    if (getApps().length === 0) {
        try {
            const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
            if (serviceAccountJson) {
                const serviceAccount = JSON.parse(serviceAccountJson)
                initializeApp({
                    credential: cert(serviceAccount)
                })
                console.log('✅ [Checkout] Firebase Admin успешно подключен из ENV!')
            } else {
                console.error('❌ ОШИБКА: Переменная GOOGLE_APPLICATION_CREDENTIALS_JSON не найдена!')
            }
        } catch (e) {
            console.error('Ошибка инициализации Firebase Admin:', e)
        }
    }

    const config = useRuntimeConfig()
    // Vercel подставит свой URL из config.public.siteUrl
    const siteUrl = config.public?.siteUrl || 'http://localhost:3000'
    const stripeSecret = config.stripeSecret || process.env.STRIPE_SECRET_KEY

    if (!stripeSecret) {
        setResponseStatus(event, 500)
        return { error: 'Server Auth Error: No Stripe Key' }
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' })
    const body = await readBody(event) || {}
    let { priceId, userId, email, couponId } = body

    if (userId) userId = userId.trim()
    if (couponId) couponId = couponId.trim()

    try {
        const db = getFirestore()
        const userDocRef = db.collection('users').doc(userId || 'unknown')
        const userDoc = await userDocRef.get()

        let userData = {}
        if (userDoc.exists) {
            userData = userDoc.data()
        }

        const sessionOptions = {
            mode: 'subscription',
            customer_email: email,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/cancel`,
            metadata: {
                firebaseUID: userId,
                discountId: couponId || null
            },
        }

        // Логика купонов
        if (couponId && userData && userData[couponId] === true) {
            const realStripeCouponId = COUPON_MAP[couponId]
            if (realStripeCouponId) {
                sessionOptions.discounts = [{ coupon: realStripeCouponId }]
                console.log(`🎉 Скидка применена: ${realStripeCouponId}`)
            }
        } else {
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