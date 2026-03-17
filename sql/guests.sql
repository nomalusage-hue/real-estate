CREATE TABLE guests (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP DEFAULT now(),

  ip TEXT,
  country TEXT,
  city TEXT,

  language TEXT,
  timezone TEXT,

  device_type TEXT,
  os TEXT,
  browser TEXT,

  screen_width INT,
  screen_height INT,
  pixel_ratio FLOAT,

  profile_id UUID REFERENCES profiles(id)
);


ALTER TABLE guests
ADD COLUMN IF NOT EXISTS connection_type text,
ADD COLUMN IF NOT EXISTS device_memory float,
ADD COLUMN IF NOT EXISTS touch_support boolean,
ADD COLUMN IF NOT EXISTS screen_orientation text,
ADD COLUMN IF NOT EXISTS referrer text,
ADD COLUMN IF NOT EXISTS last_seen timestamptz,
ADD COLUMN IF NOT EXISTS visit_count integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS first_page text,
ADD COLUMN IF NOT EXISTS utm_params jsonb;