import Stripe from 'stripe'
import { readBody } from 'h3'
export default defineEventHandler(async (event) => {
    const { stripeSecret, public: { siteUrl } } = useRuntimeConfig()
    if (!stripeSecret) {
        setResponseStatus(event, 500)
        return { error: 'Stripe key missing' }
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' })
    const reqUrl = new URL(getRequestURL(event))
    const origin = siteUrl || `${reqUrl.protocol}//${reqUrl.host}`
    const { priceId, userId, email, quantity } = await readBody(event) || {}
    if (!priceId || !userId || !email) {
        setResponseStatus(event, 400)
        return { error: 'Missing priceId, userId or email' }
    }
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer_email: email,
            line_items: [{ price: priceId, quantity: quantity ?? 1 }],
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel`,
            metadata: { firebaseUID: userId },
            allow_promotion_codes: true,
        })
        return { sessionId: session.id, url: session.url }
    } catch (e) {
        console.error('[checkout] Stripe error:', e)
        setResponseStatus(event, 400)
        return { error: e.message }
    }
})


