import { createSupabase } from '@/lib/supabase'

export async function GET() {
  const db = createSupabase()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await db.from('blocked_times')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ blocked: data })
}

export async function POST(request) {
  const body = await request.json()
  const { date, start_time, end_time, reason } = body

  if (!date) return Response.json({ error: 'Missing date' }, { status: 400 })

  const db = createSupabase()
  const { data, error } = await db.from('blocked_times')
    .insert({ date, start_time: start_time || null, end_time: end_time || null, reason: reason || null })
    .select().single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ block: data }, { status: 201 })
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 })

  const db = createSupabase()
  const { error } = await db.from('blocked_times').delete().eq('id', id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
