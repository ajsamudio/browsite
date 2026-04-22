import Stripe from 'stripe'
import { createSupabase } from '@/lib/supabase'
import { getService } from '@/lib/services'
import { toMinutes, toTimeStr } from '@/lib/slots'

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const body = await request.json()
  const { serviceId, date, startTime, clientName, clientEmail, clientPhone, notes } = body

  if (!serviceId || !date || !startTime || !clientName || !clientEmail) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const service = getService(serviceId)
  if (!service) return Response.json({ error: 'Invalid service' }, { status: 400 })

  const endTime = toTimeStr(toMinutes(startTime) + service.duration)
  const db = createSupabase()

  // Create a pending booking to hold the slot
  const { data: booking, error: insertErr } = await db.from('bookings').insert({
    date,
    start_time: startTime,
    end_time: endTime,
    service_id: serviceId,
    service_name: service.name,
    service_price: service.price,
    client_name: clientName,
    client_email: clientEmail,
    client_phone: clientPhone ?? null,
    payment_method: 'card',
    payment_status: 'pending',
    notes: notes ?? null,
  }).select().single()

  if (insertErr) {
    console.error('Booking insert error:', insertErr)
    return Response.json({ error: 'Failed to create booking' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: clientEmail,
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: service.name,
          description: `${date} at ${startTime} — Dragonflybar Studio`,
        },
        unit_amount: service.price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/#booking`,
    metadata: { booking_id: booking.id },
  })

  // Store the session ID on the booking
  await db.from('bookings').update({ stripe_session_id: session.id }).eq('id', booking.id)

  return Response.json({ url: session.url })
}
