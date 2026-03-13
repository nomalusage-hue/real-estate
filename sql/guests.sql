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