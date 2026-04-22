'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

function formatTime(t) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sessionId) { setError('No session found'); setLoading(false); return }
    fetch(`/api/admin/booking-detail?session_id=${sessionId}`)
      .then(r => r.json())
      .then(d => {
        if (d.booking) setBooking(d.booking)
        else setError('Booking not found')
        setLoading(false)
      })
  }, [sessionId])

  if (loading) return <p className="success-loading">Loading your confirmation…</p>
  if (error) return (
    <div className="success-card">
      <div className="success-icon">✓</div>
      <h2>Payment Received!</h2>
      <p>Your booking is confirmed. We&apos;ll see you soon at Dragonflybar Studio.</p>
      <a href="/" className="success-home-btn">Back to Home</a>
    </div>
  )

  return (
    <div className="success-card">
      <div className="success-icon">✓</div>
      <h2>You&apos;re all booked!</h2>
      <p className="success-sub">Payment confirmed. See you soon at Dragonflybar Studio.</p>
      <div className="success-details">
        <div className="success-row"><span>Service</span><strong>{booking.service_name}</strong></div>
        <div className="success-row"><span>Date</span><strong>{formatDate(booking.date)}</strong></div>
        <div className="success-row"><span>Time</span><strong>{formatTime(booking.start_time)}</strong></div>
        <div className="success-row"><span>Amount paid</span><strong>${(booking.service_price / 100).toFixed(0)}</strong></div>
      </div>
      <p className="success-email-note">A receipt was sent to {booking.client_email}</p>
      <a href="/" className="success-home-btn">Back to Home</a>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <div className="success-page">
      <nav className="success-nav">
        <a href="/" className="success-brand">Dragonflybar Studio</a>
      </nav>
      <Suspense fallback={<p className="success-loading">Loading…</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
