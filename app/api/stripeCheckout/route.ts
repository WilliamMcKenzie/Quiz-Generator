import resend from '@/app/components/singletons/resend'
import stripe from '@/app/components/singletons/stripe'
import { headers } from 'next/headers'

export async function POST() {
  const headersList = await headers()
  const origin = headersList.get('origin')

  const session = await stripe?.checkout?.sessions.create({
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_creation: "always",
    success_url: `${origin}/pro/success`,
    cancel_url: `${origin}/pro`,
  })
  return new Response(session.url)
}