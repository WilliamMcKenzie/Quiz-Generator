import prisma from '@/app/components/singletons/client'
import resend from '@/app/components/singletons/resend'
import stripe from '@/app/components/singletons/stripe'
import { getServerSession } from 'next-auth'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

export async function handler(request : NextRequest) {
  const session = await getServerSession()
  const headers_list = await headers()
  const signature : string = headers_list.get('stripe-signature')!
  const body = await request.text()
  
  let event

  try 
  {
    event = stripe.webhooks.constructEvent(
      body, 
      signature, 
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  }
  catch (error : any)
  {
    return new Response(`Webhook Error: ${error.message}`, { status: 420 })
  }

  if (event.type == "checkout.session.completed")
  {
    console.log("CHECKOUT COMPLETED")
    const customer_id : any = event.data.object.customer
    const customer : any = await stripe.customers.retrieve(customer_id)
    const email = customer.email

    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Quizgen Pro Confirmation',
      html: '<p>This email confirms that you have purchased Quizgen Pro. For any support contact williamqmkz@gmail.com, and I will try to get back to you within 24h! Thanks for supporting my humble endeavour.</p>'
    })

    await prisma.user.updateMany({
        where: {
          OR : [
            { email: email }, 
            { email: session?.user?.email }
          ],
        },
        data: { pro: true }
    })
  }

  return new Response("SUCCESS")
}