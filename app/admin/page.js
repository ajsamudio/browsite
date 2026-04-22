'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(0)}`
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

// ── Bookings Tab ──────────────────────────────────────────
function BookingsTab() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/bookings')
    const data = await res.json()
    setBookings(data.bookings ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function cancel(id) {
    if (!confirm('Cancel this appointment?')) return
    await fetch(`/api/admin/bookings?id=${id}`, { method: 'DELETE' })
    load()
  }

  if (loading) return <p className="admin-loading">Loading bookings…</p>
  if (bookings.length === 0) return <p className="admin-empty">No upcoming appointments 🎉</p>

  return (
    <div className="admin-bookings">
      {bookings.map(b => (
        <div key={b.id} className="admin-booking-card">
          <div className="admin-booking-header">
            <div>
              <span className="admin-booking-date">{formatDate(b.date)}</span>
              <span className="admin-booking-time">{formatTime(b.start_time)} – {formatTime(b.end_time)}</span>
            </div>
            <span className={`admin-badge ${b.payment_status}`}>
              {b.payment_status === 'paid' ? '✓ Paid' : b.payment_status === 'cash_pending' ? '💵 Cash' : b.payment_status}
            </span>
          </div>
          <div className="admin-booking-body">
            <p className="admin-client-name">{b.client_name}</p>
            <p className="admin-service">{b.service_name} · {formatPrice(b.service_price)}</p>
            {b.client_phone && <p className="admin-phone">📞 {b.client_phone}</p>}
            <p className="admin-email">✉ {b.client_email}</p>
            {b.notes && <p className="admin-notes">"{b.notes}"</p>}
          </div>
          <button className="admin-cancel-btn" onClick={() => cancel(b.id)}>Cancel Appointment</button>
        </div>
      ))}
    </div>
  )
}

// ── Schedule Tab ──────────────────────────────────────────
function ScheduleTab() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)

  // Local edits keyed by day_of_week
  const [edits, setEdits] = useState({})

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/availability')
    const data = await res.json()
    const map = {}
    ;(data.slots ?? []).forEach(s => { map[s.day_of_week] = s })
    setSlots(data.slots ?? [])
    setEdits(map)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function isActive(day) {
    return edits[day]?.is_active ?? false
  }

  function toggle(day) {
    setEdits(e => ({
      ...e,
      [day]: { ...(e[day] ?? { day_of_week: day, start_time: '10:00', end_time: '18:00' }), is_active: !isActive(day) },
    }))
  }

  function setTime(day, field, val) {
    setEdits(e => ({
      ...e,
      [day]: { ...(e[day] ?? { day_of_week: day, is_active: true }), [field]: val },
    }))
  }

  async function saveDay(day) {
    setSaving(day)
    const edit = edits[day]
    if (!edit?.is_active) {
      await fetch(`/api/admin/availability?day=${day}`, { method: 'DELETE' })
    } else {
      await fetch('/api/admin/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day_of_week: day, start_time: edit.start_time, end_time: edit.end_time }),
      })
    }
    setSaving(null)
    load()
  }

  if (loading) return <p className="admin-loading">Loading schedule…</p>

  const TIMES = Array.from({ length: 26 }, (_, i) => {
    const h = Math.floor(i / 2) + 7 // 7:00 AM to 11:30 PM
    const m = i % 2 === 0 ? '00' : '30'
    return `${String(h).padStart(2, '0')}:${m}`
  })

  function displayTime(t) {
    if (!t) return ''
    const [h, m] = t.split(':').map(Number)
    const ampm = h < 12 ? 'AM' : 'PM'
    return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`
  }

  return (
    <div className="admin-schedule">
      <p className="admin-section-hint">Toggle days on/off and set your working hours for each day.</p>
      {DAY_LABELS.map((label, day) => {
        const active = isActive(day)
        const edit = edits[day] ?? {}
        return (
          <div key={day} className={`admin-day-row ${active ? 'active' : ''}`}>
            <div className="admin-day-left">
              <button
                className={`admin-day-toggle ${active ? 'on' : 'off'}`}
                onClick={() => toggle(day)}
              >
                {active ? 'ON' : 'OFF'}
              </button>
              <span className="admin-day-label">{label}</span>
            </div>
            {active && (
              <div className="admin-day-times">
                <select value={edit.start_time ?? '10:00'} onChange={e => setTime(day, 'start_time', e.target.value)}>
                  {TIMES.map(t => <option key={t} value={t}>{displayTime(t)}</option>)}
                </select>
                <span>to</span>
                <select value={edit.end_time ?? '18:00'} onChange={e => setTime(day, 'end_time', e.target.value)}>
                  {TIMES.map(t => <option key={t} value={t}>{displayTime(t)}</option>)}
                </select>
              </div>
            )}
            <button className="admin-day-save" onClick={() => saveDay(day)} disabled={saving === day}>
              {saving === day ? 'Saving…' : 'Save'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ── Block Dates Tab ───────────────────────────────────────
function BlockTab() {
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ date: '', allDay: true, start_time: '', end_time: '', reason: '' })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/blocked')
    const data = await res.json()
    setBlocks(data.blocked ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function addBlock(e) {
    e.preventDefault()
    if (!form.date) return
    setSaving(true)
    await fetch('/api/admin/blocked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: form.date,
        start_time: form.allDay ? null : form.start_time || null,
        end_time: form.allDay ? null : form.end_time || null,
        reason: form.reason || null,
      }),
    })
    setSaving(false)
    setForm({ date: '', allDay: true, start_time: '', end_time: '', reason: '' })
    load()
  }

  async function removeBlock(id) {
    await fetch(`/api/admin/blocked?id=${id}`, { method: 'DELETE' })
    load()
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="admin-block-tab">
      <p className="admin-section-hint">Block time off for vacations, personal days, or any reason.</p>

      <form onSubmit={addBlock} className="admin-block-form">
        <div className="admin-form-row">
          <div className="admin-field">
            <label>Date</label>
            <input type="date" min={today} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
          </div>
          <div className="admin-field">
            <label>Reason <span className="admin-optional">(optional)</span></label>
            <input placeholder="e.g. Personal day" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
          </div>
        </div>
        <label className="admin-checkbox-label">
          <input type="checkbox" checked={form.allDay} onChange={e => setForm(f => ({ ...f, allDay: e.target.checked }))} />
          Block entire day
        </label>
        {!form.allDay && (
          <div className="admin-form-row">
            <div className="admin-field">
              <label>From</label>
              <input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>To</label>
              <input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} />
            </div>
          </div>
        )}
        <button type="submit" className="admin-add-btn" disabled={saving}>
          {saving ? 'Saving…' : '+ Block This Time'}
        </button>
      </form>

      {loading ? (
        <p className="admin-loading">Loading blocks…</p>
      ) : blocks.length === 0 ? (
        <p className="admin-empty">No upcoming blocks.</p>
      ) : (
        <div className="admin-block-list">
          {blocks.map(b => (
            <div key={b.id} className="admin-block-item">
              <div>
                <strong>{formatDate(b.date)}</strong>
                {b.start_time ? <span> · {formatTime(b.start_time)}–{formatTime(b.end_time)}</span> : <span> · All day</span>}
                {b.reason && <span className="admin-block-reason"> · {b.reason}</span>}
              </div>
              <button className="admin-remove-btn" onClick={() => removeBlock(b.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState('bookings')
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Dragonflybar Studio</h1>
        <button className="admin-logout-btn" onClick={logout}>Sign Out</button>
      </header>

      <nav className="admin-tabs">
        <button className={tab === 'bookings' ? 'active' : ''} onClick={() => setTab('bookings')}>
          📅 Bookings
        </button>
        <button className={tab === 'schedule' ? 'active' : ''} onClick={() => setTab('schedule')}>
          🕐 Schedule
        </button>
        <button className={tab === 'block' ? 'active' : ''} onClick={() => setTab('block')}>
          🚫 Block Time
        </button>
      </nav>

      <main className="admin-main">
        {tab === 'bookings' && <BookingsTab />}
        {tab === 'schedule' && <ScheduleTab />}
        {tab === 'block' && <BlockTab />}
      </main>
    </div>
  )
}
