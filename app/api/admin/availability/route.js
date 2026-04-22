import { createSupabase } from '@/lib/supabase'

export async function GET() {
  const db = createSupabase()
  const { data, error } = await db.from('availability_slots')
    .select('*')
    .order('day_of_week', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ slots: data })
}

export async function POST(request) {
  const body = await request.json()
  const { day_of_week, start_time, end_time } = body

  if (day_of_week == null || !start_time || !end_time) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }

  const db = createSupabase()
  const { data, error } = await db.from('availability_slots')
    .upsert({ day_of_week, start_time, end_time, is_active: true }, { onConflict: 'day_of_week' })
    .select().single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ slot: data })
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const day = searchParams.get('day')
  if (day == null) return Response.json({ error: 'Missing day' }, { status: 400 })

  const db = createSupabase()
  const { error } = await db.from('availability_slots')
    .update({ is_active: false })
    .eq('day_of_week', parseInt(day))

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
