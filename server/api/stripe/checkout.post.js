import Stripe from 'stripe'
import { readBody, defineEventHandler, setResponseStatus } from 'h3'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

const COUPON_MAP = {
    sale_5: 'sale_5',
    sale_10: 'sale_10',
    sale_15: 'sale_15'
}

export default defineEventHandler(async (event) => {
    if (getApps().length === 0) {
        try {
            const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

            if (!serviceAccountJson) {
                throw new Error('Ключ GOOGLE_APPLICATION_CREDENTIALS_JSON не найден в Vercel!')
            }

            const serviceAccount = JSON.parse(serviceAccountJson)

            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
            }

            initializeApp({
                credential: cert(serviceAccount)
            })

            console.log('✅ [Checkout] Firebase Admin успешно подключен!')
        } catch (e) {
            console.error('❌ ОШИБКА FIREBASE:', e.message)
            setResponseStatus(event, 500)

            return {
                error: 'Server Config Error: ' + e.message
            }
        }
    }

    const config = useRuntimeConfig()
    const siteUrl = config.public?.siteUrl || 'http://localhost:3000'
    const stripeSecret = config.stripeSecret || process.env.STRIPE_SECRET_KEY

    if (!stripeSecret) {
        setResponseStatus(event, 500)

        return {
            error: 'Server Auth Error: No Stripe Key'
        }
    }

    const stripe = new Stripe(stripeSecret, {
        apiVersion: '2024-06-20'
    })

    const body = await readBody(event) || {}

    let {
        priceId,
        userId,
        email,
        couponId
    } = body

    if (userId) userId = userId.trim()
    if (email) email = email.trim().toLowerCase()
    if (couponId) couponId = couponId.trim()

    if (!userId || !email || !priceId) {
        setResponseStatus(event, 400)

        return {
            error: 'Missing required fields: userId, email or priceId'
        }
    }

    try {
        const db = getFirestore()

        const userDocRef = db.collection('users').doc(userId)
        const userDoc = await userDocRef.get()

        let userData = {}

        if (userDoc.exists) {
            userData = userDoc.data()
        }

        let stripeCustomerId = userData.stripeCustomerId

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email,
                metadata: {
                    firebaseUID: userId
                }
            })

            stripeCustomerId = customer.id

            await userDocRef.set({
                stripeCustomerId
            }, { merge: true })

            console.log('✅ Новый Stripe Customer создан:', stripeCustomerId)
        }

        const subscriptions = await stripe.subscriptions.list({
            customer: stripeCustomerId,
            status: 'all',
            limit: 10
        })

        const hasActiveSubscription = subscriptions.data.some((sub) =>
            ['active', 'trialing'].includes(sub.status)
        )

        if (hasActiveSubscription) {
            setResponseStatus(event, 409)

            return {
                error: 'У пользователя уже есть активная подписка',
                alreadySubscribed: true
            }
        }

        const sessionOptions = {
            mode: 'subscription',
            customer: stripeCustomerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/cancel`,
            metadata: {
                firebaseUID: userId,
                discountId: couponId || null
            },
            subscription_data: {
                metadata: {
                    firebaseUID: userId,
                    discountId: couponId || null
                }
            }
        }

        if (couponId && userData && userData[couponId] === true) {
            const realStripeCouponId = COUPON_MAP[couponId]

            if (realStripeCouponId) {
                sessionOptions.discounts = [
                    {
                        coupon: realStripeCouponId
                    }
                ]

                console.log(`🎉 Скидка применена: ${realStripeCouponId}`)
            }
        } else {
            sessionOptions.allow_promotion_codes = true
        }

        const session = await stripe.checkout.sessions.create(sessionOptions)

        return {
            sessionId: session.id,
            url: session.url
        }
    } catch (e) {
        console.error('❌ STRIPE CHECKOUT ERROR:', e.message)

        setResponseStatus(event, 400)

        return {
            error: e.message
        }
    }
})