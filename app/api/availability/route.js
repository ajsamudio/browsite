import { createSupabase } from '@/lib/supabase'
import { getService } from '@/lib/services'
import { buildSlots } from '@/lib/slots'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const serviceId = searchParams.get('service')
  const date = searchParams.get('date')
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  const service = getService(serviceId)
  if (!service) return Response.json({ error: 'Invalid service' }, { status: 400 })

  const db = createSupabase()
  const { data: availSlots } = await db.from('availability_slots').select('*').eq('is_active', true)

  if (date) {
    return handleDayView(db, date, service, availSlots)
  }

  if (year && month) {
    return handleMonthView(db, parseInt(year), parseInt(month), service, availSlots)
  }

  return Response.json({ error: 'Provide date or year+month' }, { status: 400 })
}

async function handleDayView(db, date, service, availSlots) {
  const dayOfWeek = new Date(date + 'T12:00:00').getDay()
  const avail = availSlots.find(s => s.day_of_week === dayOfWeek)
  if (!avail) return Response.json({ slots: [] })

  const [{ data: bookings }, { data: blocked }] = await Promise.all([
    db.from('bookings').select('start_time, end_time')
      .eq('date', date).not('payment_status', 'eq', 'cancelled')
      .not('payment_status', 'eq', 'pending'), // expired pending card sessions
    db.from('blocked_times').select('start_time, end_time').eq('date', date),
  ])

  const slots = buildSlots({
    avail,
    bookings: bookings ?? [],
    blocked: blocked ?? [],
    serviceDuration: service.duration,
    date,
  })

  return Response.json({ slots })
}

async function handleMonthView(db, year, month, service, availSlots) {
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0)
  const startStr = start.toISOString().split('T')[0]
  const endStr = end.toISOString().split('T')[0]

  const [{ data: bookings }, { data: blocked }] = await Promise.all([
    db.from('bookings').select('date, start_time, end_time')
      .gte('date', startStr).lte('date', endStr)
      .not('payment_status', 'eq', 'cancelled')
      .not('payment_status', 'eq', 'pending'),
    db.from('blocked_times').select('date, start_time, end_time')
      .gte('date', startStr).lte('date', endStr),
  ])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const availableDates = []

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d < today) continue

    const dateStr = d.toISOString().split('T')[0]
    const dayOfWeek = d.getDay()
    const avail = availSlots.find(s => s.day_of_week === dayOfWeek)
    if (!avail) continue

    const dayBookings = (bookings ?? []).filter(b => b.date === dateStr)
    const dayBlocked = (blocked ?? []).filter(b => b.date === dateStr)

    // Whole-day block
    if (dayBlocked.some(b => !b.start_time)) continue

    const slots = buildSlots({
      avail,
      bookings: dayBookings,
      blocked: dayBlocked,
      serviceDuration: service.duration,
      date: dateStr,
    })

    if (slots.length > 0) availableDates.push(dateStr)
  }

  return Response.json({ availableDates })
}
