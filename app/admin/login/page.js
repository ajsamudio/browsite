'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) router.push('/admin')
    else setError('Incorrect password')
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>Dragonflybar Studio</h1>
        <p>Admin Access</p>
        <form onSubmit={submit}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Checking…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
