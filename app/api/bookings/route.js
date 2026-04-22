import { createSupabase } from '@/lib/supabase'
import { getService } from '@/lib/services'
import { toMinutes, toTimeStr } from '@/lib/slots'

export async function POST(request) {
  const body = await request.json()
  const { serviceId, date, startTime, clientName, clientEmail, clientPhone, notes } = body

  if (!serviceId || !date || !startTime || !clientName || !clientEmail) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const service = getService(serviceId)
  if (!service) return Response.json({ error: 'Invalid service' }, { status: 400 })

  const endTime = toTimeStr(toMinutes(startTime) + service.duration)

  const db = createSupabase()

  // Check for conflicts
  const { data: conflicts } = await db.from('bookings')
    .select('id')
    .eq('date', date)
    .not('payment_status', 'eq', 'cancelled')
    .not('payment_status', 'eq', 'pending')

  const hasConflict = (conflicts ?? []).some(b => {
    const bStart = toMinutes(b.start_time)
    const bEnd = toMinutes(b.end_time)
    const newStart = toMinutes(startTime)
    const newEnd = toMinutes(endTime)
    return newStart < bEnd && newEnd > bStart
  })

  if (hasConflict) {
    return Response.json({ error: 'This time slot is no longer available' }, { status: 409 })
  }

  const { data: booking, error } = await db.from('bookings').insert({
    date,
    start_time: startTime,
    end_time: endTime,
    service_id: serviceId,
    service_name: service.name,
    service_price: service.price,
    client_name: clientName,
    client_email: clientEmail,
    client_phone: clientPhone ?? null,
    payment_method: 'cash',
    payment_status: 'cash_pending',
    notes: notes ?? null,
  }).select().single()

  if (error) {
    console.error('Booking insert error:', error)
    return Response.json({ error: 'Failed to create booking' }, { status: 500 })
  }

  return Response.json({ booking }, { status: 201 })
}
