// import Stripe from 'stripe'
// import { defineEventHandler, readBody, createError } from 'h3'
// import { db } from '../utils/firebase-admin.js'
//
// export default defineEventHandler(async (event) => {
//     try {
//         const { stripeSecret } = useRuntimeConfig()
//         if (!stripeSecret) throw createError({ statusCode: 500, statusMessage: 'Stripe key missing' })
//         const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' })
//
//         const { sessionId } = await readBody(event)
//         if (!sessionId) return { success: false, error: 'Missing sessionId' }
//
//         const session = await stripe.checkout.sessions.retrieve(sessionId)
//         if (session.payment_status !== 'paid') {
//             return { success: false, error: 'Payment not completed' }
//         }
//
//         const uid = session.metadata?.firebaseUID
//         if (!uid) throw new Error('No firebaseUID in session.metadata')
//
//         const subscriptionId = session.subscription
//         if (!subscriptionId) throw new Error('No subscriptionId in session')
//
//         const subscription = await stripe.subscriptions.retrieve(subscriptionId)
//         const subscriptionEndsAt = subscription.current_period_end * 1000
//
//         await db.collection('users').doc(uid).update({
//             isPremium: true,
//             subscriptionId,
//             subscriptionEndsAt,
//             subscriptionCancelled: false,
//         })
//
//         return { success: true }
//     } catch (err) {
//         console.error('[stripe/confirm] ERROR:', err)
//         throw createError({ statusCode: 500, statusMessage: err.message })
//     }
// })



// import { createError, defineEventHandler } from 'h3'
// import Stripe from 'stripe'
// import { readBody } from 'h3'
// import { db } from '../utils/firebase-admin.js'
//
// export default defineEventHandler(async (event) => {
//     try {
//         const { sessionId } = await readBody(event)
//         if (!sessionId) {
//             return { success: false, error: 'Missing sessionId' }
//         }
//         const secretKey = process.env.STRIPE_SECRET_KEY
//         const stripe = new Stripe(secretKey, { apiVersion: '2024-04-10' })
//         const session = await stripe.checkout.sessions.retrieve(sessionId)
//         if (session.payment_status !== 'paid') {
//             return {
//                 success: false,
//                 error: 'Payment not completed'
//             }
//         }
//         const uid = session.metadata?.firebaseUID
//         if (!uid) throw new Error('No firebaseUID in session.metadata')
//         const subscriptionId = session.subscription
//         if (!subscriptionId) throw new Error('No subscriptionId in session')
//         const subscription = await stripe.subscriptions.retrieve(subscriptionId)
//         const subscriptionEndsAt = subscription.current_period_end * 1000
//         await db.collection('users').doc(uid).update({
//             isPremium: true,
//             subscriptionId,
//             subscriptionEndsAt,
//             subscriptionCancelled: false,
//         })
//         return { success: true }
//
//     } catch (err) {
//         console.error('[stripe/confirm] ERROR:', err)
//         throw createError({ statusCode: 500, statusMessage: err.message })
//     }
// })
