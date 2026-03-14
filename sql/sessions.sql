-- =========================================
-- SESSIONS TABLE (UPDATED VERSION)
-- =========================================

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,

  started_at TIMESTAMPTZ DEFAULT now(),
  last_activity_at TIMESTAMPTZ DEFAULT now(),

  user_agent TEXT
);

-- Performance index
CREATE INDEX IF NOT EXISTS idx_sessions_guest
ON sessions(guest_id);


-- =========================================
-- SESSION TRACKING FUNCTION
-- =========================================

CREATE OR REPLACE FUNCTION track_session(
  p_guest_id UUID,
  p_user_agent TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  session_id UUID;
BEGIN

  SELECT id INTO session_id
  FROM sessions
  WHERE guest_id = p_guest_id
  AND last_activity_at > now() - interval '30 minutes'
  LIMIT 1;

  IF session_id IS NULL THEN

    INSERT INTO sessions (guest_id, user_agent)
    VALUES (p_guest_id, p_user_agent)
    RETURNING id INTO session_id;

  ELSE

    UPDATE sessions
    SET last_activity_at = now()
    WHERE id = session_id;

  END IF;

  RETURN session_id;

END;
$$;