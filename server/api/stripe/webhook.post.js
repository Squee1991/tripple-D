import { buffer } from 'micro'
import Stripe from 'stripe'
import { db } from '../utils/firebase-admin.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const config = {
    api: {
        bodyParser: false
    }
}

export default defineEventHandler(async (event) => {
    const rawBody = await buffer(event.node.req)
    const sig = event.node.req.headers['stripe-signature']

    let stripeEvent
    try {
        stripeEvent = stripe.webhooks.constructEvent(
            rawBody.toString(),
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        console.error('❌ Webhook Error:', err.message)
        return send(event, 400, 'Webhook error')
    }

    if (stripeEvent.type === 'checkout.session.completed') {
        const session = stripeEvent.data.object
        const userId = session?.metadata?.userId

        if (userId) {
            try {
                const userRef = db.collection('users').doc(userId)
                await userRef.update({ isPremium: true })
                console.log('✅ Premium activated for:', userId)
            } catch (err) {
                console.error('🔥 Firestore update error:', err)
            }
        }
    }

    return 'ok'
})
