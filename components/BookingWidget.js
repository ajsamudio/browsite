'use client'

import { useState, useEffect, useCallback } from 'react'
import { SERVICES, formatPrice } from '@/lib/services'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

function formatDisplay(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

function formatDateLong(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

// ── Step 1: Service Selection ─────────────────────────────
function ServiceStep({ onSelect }) {
  const categories = [...new Set(SERVICES.map(s => s.category))]
  return (
    <div className="bw-service-step">
      <h3 className="bw-step-title">What service are you booking?</h3>
      {categories.map(cat => (
        <div key={cat} className="bw-category">
          <p className="bw-category-label">{cat}</p>
          <div className="bw-service-grid">
            {SERVICES.filter(s => s.category === cat).map(s => (
              <button key={s.id} className="bw-service-card" onClick={() => onSelect(s)}>
                <span className="bw-service-name">{s.name}</span>
                <span className="bw-service-price">{formatPrice(s.price)}</span>
                <span className="bw-service-duration">{s.duration} min</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Step 2: Date Calendar ─────────────────────────────────
function CalendarStep({ service, onSelect }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1)
  const [availableDates, setAvailableDates] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadMonth = useCallback(async (year, month) => {
    setLoading(true)
    setAvailableDates(null)
    try {
      const res = await fetch(`/api/availability?year=${year}&month=${month}&service=${service.id}`)
      const data = await res.json()
      setAvailableDates(new Set(data.availableDates ?? []))
    } finally {
      setLoading(false)
    }
  }, [service.id])

  useEffect(() => { loadMonth(viewYear, viewMonth) }, [viewYear, viewMonth, loadMonth])

  function prevMonth() {
    if (viewMonth === 1) { setViewYear(y => y - 1); setViewMonth(12) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 12) { setViewYear(y => y + 1); setViewMonth(1) }
    else setViewMonth(m => m + 1)
  }

  const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate()
  const todayStr = today.toISOString().split('T')[0]

  const isPast = (d) => {
    const dateStr = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return dateStr < todayStr
  }
  const isAvailable = (d) => {
    const dateStr = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return availableDates?.has(dateStr)
  }

  const canGoPrev = !(viewYear === today.getFullYear() && viewMonth === today.getMonth() + 1)

  return (
    <div className="bw-calendar">
      <h3 className="bw-step-title">Select a date</h3>
      <div className="bw-cal-header">
        <button className="bw-cal-nav" onClick={prevMonth} disabled={!canGoPrev}>‹</button>
        <span className="bw-cal-month">{MONTH_NAMES[viewMonth - 1]} {viewYear}</span>
        <button className="bw-cal-nav" onClick={nextMonth}>›</button>
      </div>
      <div className="bw-cal-grid">
        {DAY_NAMES.map(d => <div key={d} className="bw-cal-day-name">{d}</div>)}
        {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1
          const dateStr = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const past = isPast(day)
          const avail = isAvailable(day)
          return (
            <button
              key={day}
              className={`bw-cal-day ${past ? 'past' : ''} ${loading ? 'loading' : ''} ${avail ? 'available' : 'unavailable'}`}
              disabled={past || !avail || loading}
              onClick={() => onSelect(dateStr)}
            >
              {day}
            </button>
          )
        })}
      </div>
      {loading && <p className="bw-loading">Checking availability…</p>}
    </div>
  )
}

// ── Step 3: Time Slots ────────────────────────────────────
function TimeStep({ service, date, onSelect }) {
  const [slots, setSlots] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/availability?date=${date}&service=${service.id}`)
      .then(r => r.json())
      .then(d => { setSlots(d.slots ?? []); setLoading(false) })
  }, [date, service.id])

  return (
    <div className="bw-time-step">
      <h3 className="bw-step-title">Select a time</h3>
      <p className="bw-date-chosen">{formatDateLong(date)}</p>
      {loading && <p className="bw-loading">Loading times…</p>}
      {!loading && slots?.length === 0 && (
        <p className="bw-no-slots">No times available for this date. Please pick another day.</p>
      )}
      {!loading && slots?.length > 0 && (
        <div className="bw-slots-grid">
          {slots.map(slot => (
            <button key={slot} className="bw-slot" onClick={() => onSelect(slot)}>
              {formatDisplay(slot)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Step 4: Contact Info + Payment ───────────────────────
function InfoStep({ service, date, time, onSubmit, submitting }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', payment: 'cash', notes: '' })
  const [errors, setErrors] = useState({})

  function change(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.payment) errs.payment = 'Select a payment method'
    return errs
  }

  function submit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit(form)
  }

  return (
    <div className="bw-info-step">
      <h3 className="bw-step-title">Your details</h3>
      <div className="bw-summary-bar">
        <span>{service.name}</span>
        <span>·</span>
        <span>{formatDateLong(date)}</span>
        <span>·</span>
        <span>{formatDisplay(time)}</span>
        <span>·</span>
        <span className="bw-summary-price">{formatPrice(service.price)}</span>
      </div>
      <form onSubmit={submit} className="bw-form">
        <div className="bw-field">
          <label>Full Name *</label>
          <input name="name" value={form.name} onChange={change} placeholder="Jane Doe" />
          {errors.name && <span className="bw-error">{errors.name}</span>}
        </div>
        <div className="bw-field">
          <label>Email *</label>
          <input name="email" type="email" value={form.email} onChange={change} placeholder="jane@example.com" />
          {errors.email && <span className="bw-error">{errors.email}</span>}
        </div>
        <div className="bw-field">
          <label>Phone <span className="bw-optional">(optional)</span></label>
          <input name="phone" type="tel" value={form.phone} onChange={change} placeholder="(714) 555-0100" />
        </div>
        <div className="bw-field">
          <label>Notes <span className="bw-optional">(optional)</span></label>
          <textarea name="notes" value={form.notes} onChange={change} rows={2} placeholder="Anything she should know?" />
        </div>

        <div className="bw-payment-section">
          <label className="bw-payment-label">How would you like to pay?</label>
          <div className="bw-payment-options">
            <label className={`bw-payment-option ${form.payment === 'cash' ? 'selected' : ''}`}>
              <input type="radio" name="payment" value="cash" checked={form.payment === 'cash'} onChange={change} />
              <div className="bw-payment-content">
                <span className="bw-payment-icon">💵</span>
                <div>
                  <strong>Pay Cash at Appointment</strong>
                  <p>Bring {formatPrice(service.price)} cash on the day</p>
                </div>
              </div>
            </label>
            <label className={`bw-payment-option ${form.payment === 'card' ? 'selected' : ''}`}>
              <input type="radio" name="payment" value="card" checked={form.payment === 'card'} onChange={change} />
              <div className="bw-payment-content">
                <span className="bw-payment-icon">💳</span>
                <div>
                  <strong>Pay Online Now — {formatPrice(service.price)}</strong>
                  <p>Secured by Stripe. Card details stay private.</p>
                </div>
              </div>
            </label>
          </div>
          {errors.payment && <span className="bw-error">{errors.payment}</span>}
        </div>

        <button type="submit" className="bw-submit-btn" disabled={submitting}>
          {submitting ? 'Processing…' : form.payment === 'card' ? `Pay ${formatPrice(service.price)} & Book` : 'Confirm Booking'}
        </button>
      </form>
    </div>
  )
}

// ── Step 5: Cash Confirmation ─────────────────────────────
function ConfirmStep({ booking, service, date, time }) {
  return (
    <div className="bw-confirm-step">
      <div className="bw-confirm-icon">✓</div>
      <h3>You&rsquo;re booked!</h3>
      <p className="bw-confirm-sub">See you soon at Dragonflybar Studio.</p>
      <div className="bw-confirm-details">
        <div className="bw-confirm-row">
          <span>Service</span><strong>{service.name}</strong>
        </div>
        <div className="bw-confirm-row">
          <span>Date</span><strong>{formatDateLong(date)}</strong>
        </div>
        <div className="bw-confirm-row">
          <span>Time</span><strong>{formatDisplay(time)}</strong>
        </div>
        <div className="bw-confirm-row">
          <span>Payment</span><strong>Cash — {formatPrice(service.price)} due at appointment</strong>
        </div>
      </div>
      <p className="bw-confirm-note">
        A confirmation has been sent to {booking.client_email}
      </p>
    </div>
  )
}

// ── Main Widget ───────────────────────────────────────────
export default function BookingWidget() {
  const [step, setStep] = useState(1)
  const [service, setService] = useState(null)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [booking, setBooking] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function selectService(s) { setService(s); setStep(2) }
  function selectDate(d) { setDate(d); setStep(3) }
  function selectTime(t) { setTime(t); setStep(4) }

  async function handleSubmit(form) {
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        serviceId: service.id,
        date,
        startTime: time,
        clientName: form.name,
        clientEmail: form.email,
        clientPhone: form.phone || null,
        notes: form.notes || null,
      }

      if (form.payment === 'card') {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || 'Something went wrong'); return }
        window.location.href = data.url
      } else {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error || 'Something went wrong'); return }
        setBooking(data.booking)
        setStep(5)
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const STEPS = ['Service', 'Date', 'Time', 'Details', 'Confirm']

  return (
    <div className="bw-widget">
      {/* Progress bar */}
      <div className="bw-progress">
        {STEPS.map((label, i) => (
          <div key={label} className={`bw-progress-step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
            <div className="bw-progress-dot">{step > i + 1 ? '✓' : i + 1}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Back button */}
      {step > 1 && step < 5 && (
        <button className="bw-back" onClick={() => setStep(s => s - 1)}>← Back</button>
      )}

      {/* Steps */}
      <div className="bw-body">
        {step === 1 && <ServiceStep onSelect={selectService} />}
        {step === 2 && <CalendarStep service={service} onSelect={selectDate} />}
        {step === 3 && <TimeStep service={service} date={date} onSelect={selectTime} />}
        {step === 4 && (
          <InfoStep
            service={service} date={date} time={time}
            onSubmit={handleSubmit} submitting={submitting}
          />
        )}
        {step === 5 && booking && (
          <ConfirmStep booking={booking} service={service} date={date} time={time} />
        )}
        {error && <p className="bw-global-error">{error}</p>}
      </div>
    </div>
  )
}
