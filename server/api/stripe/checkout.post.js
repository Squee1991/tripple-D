import Stripe from 'stripe'
import { readBody } from 'h3'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-04-10',
})

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        const { priceId, userId, email } = body

        if (!priceId || !userId || !email) {
            return {
                statusCode: 400,
                body: 'Missing required fields: priceId, userId, or email',
            }
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            customer_email: email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: 'https://language-app-beta.vercel.app/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://language-app-beta.vercel.app/cancel',
            metadata: {
                firebaseUID: userId,
            },
        })

        return { sessionId: session.id }
    } catch (error) {
        return {
            statusCode: 500,
            body: {
                error: 'Stripe error',
                message: error.message,
                type: error.type || 'unknown',
            },
        }
    }
})
