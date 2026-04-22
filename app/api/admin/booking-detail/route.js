import { createSupabase } from '@/lib/supabase'

// Used by the Stripe success page to fetch booking details
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')
  const bookingId = searchParams.get('booking_id')

  const db = createSupabase()
  let query = db.from('bookings').select('*')

  if (sessionId) query = query.eq('stripe_session_id', sessionId)
  else if (bookingId) query = query.eq('id', bookingId)
  else return Response.json({ error: 'Missing identifier' }, { status: 400 })

  const { data, error } = await query.single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ booking: data })
}
