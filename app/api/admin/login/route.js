import { cookies } from 'next/headers'

export async function POST(request) {
  const { password } = await request.json()

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_token', process.env.ADMIN_PASSWORD, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return Response.json({ ok: true })
}
