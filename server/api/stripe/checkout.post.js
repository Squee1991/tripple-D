// import Stripe from 'stripe'
// import { readBody } from 'h3'
//
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
//     apiVersion: '2024-04-10',
// })
//
// export default defineEventHandler(async (event) => {
//     console.log('[checkout] POST /api/stripe/checkout hit')
//
//     const { priceId, userId, email } = await readBody(event)
//     console.log('[checkout] Тело запроса:', { priceId, userId, email })
//
//     if (!priceId || !userId || !email) {
//         return {
//             statusCode: 400,
//             body: 'Missing required fields: priceId, userId, or email',
//         }
//     }
//
//     const origin = 'http://localhost:3000'
//     const session = await stripe.checkout.sessions.create({
//         mode: 'subscription',
//         customer_email: email,
//         line_items: [
//             {
//                 price: priceId,
//                 quantity: 1,
//             },
//         ],
//         success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${origin}/cancel`,
//         metadata: {
//             firebaseUID: userId,
//         },
//     })
//
//     return { sessionId: session.id }
// })
import Stripe from 'stripe'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
    const { stripeSecret } = useRuntimeConfig()
    if (!stripeSecret) {
        throw createError({ statusCode: 500, statusMessage: 'Stripe key missing' })
    }
    const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' })

    const body = await readBody(event)
    const { priceId, successUrl, cancelUrl, metadata } = body

    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata, // например { firebaseUID }
    })

    return { url: session.url, id: session.id }
})

