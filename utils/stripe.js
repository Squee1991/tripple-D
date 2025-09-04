import { loadStripe } from '@stripe/stripe-js'

export const getStripe = async () => {
    return await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
}
