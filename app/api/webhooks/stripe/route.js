import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createSupabase } from '@/lib/supabase'

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const bookingId = session.metadata?.booking_id

    if (bookingId) {
      const db = createSupabase()
      await db.from('bookings')
        .update({ payment_status: 'paid' })
        .eq('id', bookingId)
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object
    const bookingId = session.metadata?.booking_id

    if (bookingId) {
      const db = createSupabase()
      await db.from('bookings')
        .update({ payment_status: 'cancelled' })
        .eq('id', bookingId)
    }
  }

  return Response.json({ received: true })
}
