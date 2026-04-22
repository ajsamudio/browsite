const SLOT_INTERVAL = 30 // offer a slot every 30 min
const BUFFER_MINUTES = 120 // don't allow bookings within 2 hours of now

export function toMinutes(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function toTimeStr(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatDisplay(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart
}

export function buildSlots({ avail, bookings, blocked, serviceDuration, date }) {
  const dayStart = toMinutes(avail.start_time)
  const dayEnd = toMinutes(avail.end_time)

  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const nowMinutes = now.getHours() * 60 + now.getMinutes() + BUFFER_MINUTES

  const slots = []

  for (let t = dayStart; t + serviceDuration <= dayEnd; t += SLOT_INTERVAL) {
    if (date === todayStr && t < nowMinutes) continue

    const slotEnd = t + serviceDuration

    const bookingConflict = bookings.some(b => {
      const bStart = toMinutes(b.start_time)
      const bEnd = toMinutes(b.end_time)
      return overlaps(t, slotEnd, bStart, bEnd)
    })

    const blockConflict = blocked.some(b => {
      if (!b.start_time) return true
      const bStart = toMinutes(b.start_time)
      const bEnd = toMinutes(b.end_time)
      return overlaps(t, slotEnd, bStart, bEnd)
    })

    if (!bookingConflict && !blockConflict) {
      slots.push(toTimeStr(t))
    }
  }

  return slots
}
