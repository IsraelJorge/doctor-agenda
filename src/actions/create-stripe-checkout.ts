'use server'

import { getUserSession } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'
import { stripe } from '@/lib/stripe'
import { Route } from '@/utils/routes'

export const createStripeCheckout = actionClient.action(async () => {
  const session = await getUserSession()
  if (!session) throw new Error('Unauthorized')
  if (!session.user.clinic?.id) throw Error('Not found clinic')

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer_email: session.user.email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}${Route.dashboard}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}${Route.subscription}`,
    subscription_data: {
      metadata: {
        userId: session.user.id,
        clinicId: session.user.clinic.id,
      },
    },
    line_items: [
      {
        price: process.env.STRIPE_ESSENTIAL_PLAN_PRICE_ID,
        quantity: 1,
      },
    ],
  })

  return { sessionId: stripeSession.id }
})
