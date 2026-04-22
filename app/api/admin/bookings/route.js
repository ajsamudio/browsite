import { createSupabase } from '@/lib/supabase'

export async function GET() {
  const db = createSupabase()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await db.from('bookings')
    .select('*')
    .gte('date', today)
    .not('payment_status', 'eq', 'cancelled')
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ bookings: data })
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const db = createSupabase()
  const { error } = await db.from('bookings')
    .update({ payment_status: 'cancelled' })
    .eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
