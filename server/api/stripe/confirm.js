import { createError, defineEventHandler } from 'h3'
import Stripe from 'stripe'
import { readBody } from 'h3'
import { db } from '../utils/firebase-admin.js'

export default defineEventHandler(async (event) => {
    try {
        const { sessionId } = await readBody(event)
        console.log('[stripe/confirm] body:', { sessionId })

        if (!sessionId) {
            return { success: false, error: 'Missing sessionId' }
        }

        const secretKey = process.env.STRIPE_SECRET_KEY
        console.log('[stripe/confirm] using Stripe key:', secretKey ? '****' + secretKey.slice(-4) : 'undefined')

        const stripe = new Stripe(secretKey, { apiVersion: '2024-04-10' })

        const session = await stripe.checkout.sessions.retrieve(sessionId)
        console.log('[stripe/confirm] session:', session.id, session.payment_status)

        if (session.payment_status !== 'paid') {
            return { success: false, error: 'Payment not completed' }
        }

        const uid = session.metadata?.firebaseUID
        if (!uid) {
            throw new Error('No firebaseUID in session.metadata')
        }

        await db.collection('users').doc(uid).update({ isPremium: true })
        console.log('[stripe/confirm] Firestore updated for', uid)

        return { success: true }

    } catch (err) {
        console.error('[stripe/confirm] ERROR:', err)
        throw createError({ statusCode: 500, statusMessage: err.message })
    }
})
