-- Run this in the Supabase SQL editor to set up the booking system.

-- Weekly working schedule (which days/hours she's available)
CREATE TABLE availability_slots (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week   INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 6=Sat
  start_time    TIME NOT NULL,
  end_time      TIME NOT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- One-off date/time blocks (vacation, personal time, etc.)
CREATE TABLE blocked_times (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date        DATE NOT NULL,
  start_time  TIME,   -- NULL = entire day blocked
  end_time    TIME,   -- NULL = entire day blocked
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Client bookings
CREATE TABLE bookings (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date              DATE NOT NULL,
  start_time        TIME NOT NULL,
  end_time          TIME NOT NULL,
  service_id        TEXT NOT NULL,
  service_name      TEXT NOT NULL,
  service_price     INTEGER NOT NULL,  -- cents
  client_name       TEXT NOT NULL,
  client_email      TEXT NOT NULL,
  client_phone      TEXT,
  payment_method    TEXT NOT NULL CHECK (payment_method IN ('card', 'cash')),
  payment_status    TEXT NOT NULL DEFAULT 'pending'
                    CHECK (payment_status IN ('pending', 'paid', 'cash_pending', 'cancelled')),
  stripe_session_id TEXT,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_stripe ON bookings(stripe_session_id);
CREATE INDEX idx_blocked_date ON blocked_times(date);

-- Seed a sample schedule (Tue–Sat, 10am–6pm). Adjust as needed.
INSERT INTO availability_slots (day_of_week, start_time, end_time) VALUES
  (2, '10:00', '18:00'),  -- Tuesday
  (3, '10:00', '18:00'),  -- Wednesday
  (4, '10:00', '18:00'),  -- Thursday
  (5, '10:00', '18:00'),  -- Friday
  (6, '10:00', '18:00');  -- Saturday
