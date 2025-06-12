import { loadStripe } from '@stripe/stripe-js'

export function useStripe() {
  const redirectStripeCheckout = async ({
    sessionId,
  }: {
    sessionId: string
  }) => {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    )
    if (!stripe) {
      throw new Error('Stripe not found')
    }
    if (!sessionId) {
      throw new Error('Session ID not found')
    }
    await stripe.redirectToCheckout({
      sessionId,
    })
  }

  return { redirectStripeCheckout }
}
