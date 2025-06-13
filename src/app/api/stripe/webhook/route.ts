import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

import { db } from '@/database'
import { userTable } from '@/database/schemas'
import { stripe } from '@/lib/stripe'

export const POST = async (request: NextRequest) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe not configured')
  }

  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    throw new Error('Stripe signature not found')
  }

  const body = await request.text()

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  )

  switch (event.type) {
    case 'invoice.paid': {
      if (!event.data.object.id) {
        throw new Error('Invoice ID not found')
      }

      const { subscription, subscription_details, customer } = event.data
        .object as unknown as {
        subscription: string
        subscription_details: {
          metadata: {
            userId: string
          }
        }
        customer: string
      }

      if (!subscription) {
        throw new Error('Subscription not found')
      }

      const userId = subscription_details.metadata.userId

      await db
        .update(userTable)
        .set({
          plan: 'essential',
          stripeSubscriptionId: subscription,
          stripeCustomerId: customer,
        })
        .where(eq(userTable.id, userId))
      break
    }
    case 'customer.subscription.deleted': {
      if (!event.data.object.id) {
        throw new Error('Subscription ID not found')
      }

      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      )

      if (!subscription) {
        throw new Error('Subscription not found')
      }

      const userId = subscription.metadata.userId

      await db
        .update(userTable)
        .set({
          plan: null,
          stripeSubscriptionId: null,
          stripeCustomerId: null,
        })
        .where(eq(userTable.id, userId))
      break
    }
  }

  return NextResponse.json({ received: true })
}
